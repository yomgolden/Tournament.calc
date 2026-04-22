// scoring.js — Placement + kills → points calculation and match submission

let rules = { killPoints: 1, placements: [] };

async function loadRules() {
rules = await dbGetRules();
renderRulesForm();
}

// ── Calculate points for a single result ──
function calculatePoints(placement, kills) {
const placementPts = getPlacementPoints(placement);
const killPts = kills * rules.killPoints;
return placementPts + killPts;
}

function getPlacementPoints(placement) {
if (!rules.placements || !rules.placements.length) return 0;
// Sort placements so the last defined position acts as fallback
const sorted = […rules.placements].sort((a, b) => a.position - b.position);
// Find exact match first
const exact = sorted.find(p => p.position === placement);
if (exact) return exact.points;
// If placement is beyond defined positions, return 0
return 0;
}

// ── Score entry form ──
function renderScoreEntry() {
const teams = getTeams();
const container = document.getElementById(“scoreEntryList”);

if (!teams.length) {
container.innerHTML = `<div class="empty-state">Add teams first before entering scores.</div>`;
return;
}

container.innerHTML = teams.map(team => `<div class="score-card" data-team-id="${team.id}" data-team-name="${team.name}"> <div class="score-team-name">${team.name}</div> <div class="score-field"> <label>Place</label> <input type="number" class="placement-input" min="1" max="99" value="" placeholder="—"/> </div> <div class="score-field"> <label>Kills</label> <input type="number" class="kills-input" min="0" value="0"/> </div> </div>`).join(””);
}

async function submitMatch() {
const matchNum = parseInt(document.getElementById(“matchNumber”).value) || 1;
const cards = document.querySelectorAll(”.score-card”);

if (!cards.length) { showToast(“No teams to score”); return; }

const results = [];
let hasAnyPlacement = false;

cards.forEach(card => {
const teamId   = card.dataset.teamId;
const teamName = card.dataset.teamName;
const placement = parseInt(card.querySelector(”.placement-input”).value) || 0;
const kills    = parseInt(card.querySelector(”.kills-input”).value) || 0;
const points   = calculatePoints(placement, kills);

```
if (placement > 0) hasAnyPlacement = true;

results.push({ teamId, teamName, placement, kills, points });
```

});

if (!hasAnyPlacement) { showToast(“Enter at least one placement”); return; }

await dbSaveMatch({ matchNumber: matchNum, results });

// Auto-increment match number
document.getElementById(“matchNumber”).value = matchNum + 1;

// Reset kills to 0, clear placements
cards.forEach(card => {
card.querySelector(”.placement-input”).value = “”;
card.querySelector(”.kills-input”).value = “0”;
});

await renderLeaderboard();
showToast(`Match ${matchNum} saved!`);
}

// ── Rules form ──
function renderRulesForm() {
document.getElementById(“killPointsInput”).value = rules.killPoints ?? 1;

const container = document.getElementById(“placementRules”);
container.innerHTML = (rules.placements || []).map((p, i) => `<div class="placement-row" data-index="${i}"> <input type="number" class="pos-input" value="${p.position}" min="1" placeholder="Position"/> <input type="number" class="pts-input" value="${p.points}" min="0" step="0.5" placeholder="Points"/> <button class="remove-placement" onclick="removePlacementRow(this)">✕</button> </div>`).join(””);
}

function addPlacementRow() {
const container = document.getElementById(“placementRules”);
const existing = container.querySelectorAll(”.placement-row”);
const nextPos = existing.length + 1;

const row = document.createElement(“div”);
row.className = “placement-row”;
row.innerHTML = `<input type="number" class="pos-input" value="${nextPos}" min="1" placeholder="Position"/> <input type="number" class="pts-input" value="0" min="0" step="0.5" placeholder="Points"/> <button class="remove-placement" onclick="removePlacementRow(this)">✕</button>`;
container.appendChild(row);
row.querySelector(”.pts-input”).focus();
}

function removePlacementRow(btn) {
btn.closest(”.placement-row”).remove();
}

async function saveRules() {
const killPoints = parseFloat(document.getElementById(“killPointsInput”).value) || 1;

const rows = document.querySelectorAll(”.placement-row”);
const placements = Array.from(rows).map(row => ({
position: parseInt(row.querySelector(”.pos-input”).value) || 0,
points:   parseFloat(row.querySelector(”.pts-input”).value) || 0
})).filter(p => p.position > 0);

rules = { killPoints, placements };
await dbSaveRules(rules);
showToast(“Rules saved!”);
}
