// leaderboard.js — Aggregate all match results and display rankings

async function renderLeaderboard() {
const matches = await dbGetMatches();
const teams = getTeams();

// Build totals per team
const totals = {};

teams.forEach(team => {
totals[team.id] = {
name: team.name,
totalPoints: 0,
totalKills: 0,
matchesPlayed: 0
};
});

matches.forEach(match => {
(match.results || []).forEach(result => {
if (totals[result.teamId]) {
totals[result.teamId].totalPoints  += result.points || 0;
totals[result.teamId].totalKills   += result.kills || 0;
totals[result.teamId].matchesPlayed += 1;
}
});
});

// Sort by total points descending
const ranked = Object.values(totals).sort((a, b) => b.totalPoints - a.totalPoints);

const container = document.getElementById(“leaderboardList”);

if (!ranked.length) {
container.innerHTML = `<div class="empty-state">No results yet. Enter match scores to see the leaderboard.</div>`;
return;
}

container.innerHTML = ranked.map((team, index) => {
const rank = index + 1;
const rankClass = rank <= 3 ? `rank-${rank}` : “”;
const medal = rank === 1 ? “🥇” : rank === 2 ? “🥈” : rank === 3 ? “🥉” : rank;

```
return `
  <div class="lb-row ${rankClass}">
    <div class="lb-rank">${medal}</div>
    <div>
      <div class="lb-name">${team.name}</div>
      <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);margin-top:2px">
        ${team.matchesPlayed} match${team.matchesPlayed !== 1 ? "es" : ""}
      </div>
    </div>
    <div class="lb-kills">
      Kills
      <span>${team.totalKills}</span>
    </div>
    <div class="lb-points">${team.totalPoints}</div>
  </div>
`;
```

}).join(””);
}

async function resetAll() {
if (!confirm(“Reset ALL match data? Teams will remain but all scores will be deleted.”)) return;
await dbDeleteAllMatches();
await renderLeaderboard();
showToast(“All scores reset”);
}
