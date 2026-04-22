// teams.js — Add, display, and delete teams

let teams = []; // in-memory cache

async function loadTeams() {
teams = await dbGetTeams();
renderTeams();
}

function renderTeams() {
const container = document.getElementById(“teamsList”);
if (!teams.length) {
container.innerHTML = `<div class="empty-state">No teams yet.<br/>Tap "+ Add Team" to get started.</div>`;
return;
}
container.innerHTML = teams.map(team => `<div class="team-card" data-id="${team.id}"> <div class="team-card-name">${team.name}</div> <div class="team-card-players"> ${team.players.map(p =>`• ${p}`).join("<br/>")} </div> <button class="team-delete" onclick="deleteTeam('${team.id}')">✕</button> </div> `).join(””);
}

async function deleteTeam(id) {
if (!confirm(“Delete this team?”)) return;
await dbDeleteTeam(id);
await loadTeams();
renderScoreEntry(); // refresh scoring tab
showToast(“Team removed”);
}

// ── Modal logic ──
function openAddTeamModal() {
document.getElementById(“addTeamModal”).classList.add(“open”);
document.getElementById(“teamNameInput”).value = “”;
// Reset players to one blank row
const playerInputs = document.getElementById(“playerInputs”);
playerInputs.innerHTML = `<label>Players</label> <div class="player-row"> <input type="text" class="player-input" placeholder="Player 1"/> <button class="remove-player" style="visibility:hidden" onclick="removePlayerRow(this)">✕</button> </div>`;
document.getElementById(“teamNameInput”).focus();
}

function closeAddTeamModal() {
document.getElementById(“addTeamModal”).classList.remove(“open”);
}

function addPlayerRow() {
const container = document.getElementById(“playerInputs”);
const rows = container.querySelectorAll(”.player-row”);
const count = rows.length + 1;

// Make all existing remove buttons visible
rows.forEach(r => r.querySelector(”.remove-player”).style.visibility = “visible”);

const row = document.createElement(“div”);
row.className = “player-row”;
row.innerHTML = `<input type="text" class="player-input" placeholder="Player ${count}"/> <button class="remove-player" onclick="removePlayerRow(this)">✕</button>`;
container.appendChild(row);
row.querySelector(“input”).focus();
}

function removePlayerRow(btn) {
const row = btn.closest(”.player-row”);
row.remove();
// If only one row left, hide its remove button
const rows = document.getElementById(“playerInputs”).querySelectorAll(”.player-row”);
if (rows.length === 1) {
rows[0].querySelector(”.remove-player”).style.visibility = “hidden”;
}
}

async function saveTeam() {
const name = document.getElementById(“teamNameInput”).value.trim();
if (!name) { showToast(“Enter a team name”); return; }

const playerInputs = document.querySelectorAll(”.player-input”);
const players = Array.from(playerInputs)
.map(i => i.value.trim())
.filter(Boolean);

if (!players.length) { showToast(“Add at least one player”); return; }

await dbAddTeam({ name, players });
closeAddTeamModal();
await loadTeams();
renderScoreEntry();
showToast(“Team added!”);
}

// Expose teams cache for other modules
function getTeams() { return teams; }
