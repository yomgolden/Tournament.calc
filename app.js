// app.js — Main controller. Ties all modules together.

// ── Tab navigation ──
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${tab}`).classList.add("active");
    if (tab === "leaderboard") renderLeaderboard();
  });
});

// ── Teams tab buttons ──
document.getElementById("openAddTeam").addEventListener("click", openAddTeamModal);
document.getElementById("cancelAddTeam").addEventListener("click", closeAddTeamModal);
document.getElementById("saveTeamBtn").addEventListener("click", saveTeam);
document.getElementById("addPlayerBtn").addEventListener("click", addPlayerRow);

document.getElementById("addTeamModal").addEventListener("click", function(e) {
  if (e.target === this) closeAddTeamModal();
});

// ── Scoring tab ──
document.getElementById("submitMatchBtn").addEventListener("click", submitMatch);

// ── Leaderboard tab ──
document.getElementById("resetBtn").addEventListener("click", resetAll);

// ── Settings tab ──
document.getElementById("saveRulesBtn").addEventListener("click", saveRules);
document.getElementById("addPlacementBtn").addEventListener("click", addPlacementRow);

// ── Toast helper ──
function showToast(msg) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ── Init ──
async function init() {
  try {
    await loadRules();
  } catch (err) {
    console.error("Rules error:", err);
  }
  try {
    await loadTeams();
  } catch (err) {
    console.error("Teams error:", err);
    document.getElementById("teamsList").innerHTML =
      '<div class="empty-state">No teams yet. Tap "+ Add Team" to get started.</div>';
  }
  try {
    renderScoreEntry();
  } catch (err) {
    console.error("Scoring error:", err);
  }
  try {
    await renderLeaderboard();
  } catch (err) {
    console.error("Leaderboard error:", err);
  }
}

init();
