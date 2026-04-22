// app.js — Main controller. Ties all modules together.

// ── Tab navigation ──
document.querySelectorAll(”.nav-btn”).forEach(btn => {
btn.addEventListener(“click”, () => {
const tab = btn.dataset.tab;

```
document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));

btn.classList.add("active");
document.getElementById(`tab-${tab}`).classList.add("active");

// Refresh leaderboard when switching to it
if (tab === "leaderboard") renderLeaderboard();
```

});
});

// ── Teams tab buttons ──
document.getElementById(“openAddTeam”).addEventListener(“click”, openAddTeamModal);
document.getElementById(“cancelAddTeam”).addEventListener(“click”, closeAddTeamModal);
document.getElementById(“saveTeamBtn”).addEventListener(“click”, saveTeam);
document.getElementById(“addPlayerBtn”).addEventListener(“click”, addPlayerRow);

// Close modal on overlay click
document.getElementById(“addTeamModal”).addEventListener(“click”, function(e) {
if (e.target === this) closeAddTeamModal();
});

// ── Scoring tab ──
document.getElementById(“submitMatchBtn”).addEventListener(“click”, submitMatch);

// ── Leaderboard tab ──
document.getElementById(“resetBtn”).addEventListener(“click”, resetAll);

// ── Settings tab ──
document.getElementById(“saveRulesBtn”).addEventListener(“click”, saveRules);
document.getElementById(“addPlacementBtn”).addEventListener(“click”, addPlacementRow);

// ── Toast helper ──
function showToast(msg) {
let toast = document.querySelector(”.toast”);
if (!toast) {
toast = document.createElement(“div”);
toast.className = “toast”;
document.body.appendChild(toast);
}
toast.textContent = msg;
toast.classList.add(“show”);
setTimeout(() => toast.classList.remove(“show”), 2500);
}

// ── Init ──
async function init() {
try {
await loadRules();
await loadTeams();
renderScoreEntry();
await renderLeaderboard();
} catch (err) {
console.error(“Init error:”, err);
showToast(“Firebase not connected yet”);
}
}

init();
