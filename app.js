// Dynamisch Games maken
function createGames() {
  const gamesSection = document.getElementById('games');
  for (let g = 1; g <= 4; g++) {
    const gameDiv = document.createElement('div');
    gameDiv.className = 'game';
    gameDiv.id = 'game' + g;
    if (g !== 1) gameDiv.style.display = 'none';

    gameDiv.innerHTML = `
      <h2>Game ${g}</h2>
      ${createTeam('A', g)}
      ${createTeam('B', g)}
      <div>
        <h3>Resultaat Game ${g}</h3>
        <label>Team Score A: <input type="number" id="scoreTotalA-${g}" readonly></label><br>
        <label>Team Score B: <input type="number" id="scoreTotalB-${g}" readonly></label><br>
        <label>Team Punt A: <input type="number" id="teamPuntA-${g}" readonly></label><br>
        <label>Team Punt B: <input type="number" id="teamPuntB-${g}" readonly></label><br>
      </div>
    `;
    gamesSection.appendChild(gameDiv);
  }
}

function createTeam(teamLetter, gameNr) {
  return `
    <div class="team" id="team${teamLetter}-game${gameNr}">
      <h3>Team ${teamLetter}</h3>
      ${createPlayer(teamLetter, gameNr, 1)}
      ${createPlayer(teamLetter, gameNr, 2)}
    </div>
  `;
}

function createPlayer(teamLetter, gameNr, spelerNr) {
  return `
    <div class="speler" id="player-${teamLetter}-${gameNr}-${spelerNr}">
      <label>Naam: <input type="text" id="naam-${teamLetter}-${gameNr}-${spelerNr}" oninput="updateGemiddeldeScratch()"></label><br>
      <label>HCP: <input type="number" id="hcp-${teamLetter}-${gameNr}-${spelerNr}" inputmode="numeric" oninput="updateGame(${gameNr})"></label><br>
      <label>Scratch: <input type="number" id="scratch-${teamLetter}-${gameNr}-${spelerNr}" inputmode="numeric" oninput="updateGame(${gameNr}); updateGemiddeldeScratch()"></label><br>
      <label>Score: <input type="number" id="score-${teamLetter}-${gameNr}-${spelerNr}" readonly></label><br>
      <label>Individueel Punt: <input type="number" id="indivPunt-${teamLetter}-${gameNr}-${spelerNr}" readonly></label><br>
      <label>Gem. Scratch: <input type="number" id="gemScratch-${teamLetter}-${gameNr}-${spelerNr}" readonly></label><br>
      <button class="shootout-button" id="shootout-${teamLetter}-${gameNr}-${spelerNr}">0</button>
    </div>
  `;
}

// Toon juiste tab
function showGame(nr) {
  for (let i = 1; i <= 4; i++) {
    const tab = document.getElementById('game' + i);
    if (tab) {
      tab.style.display = (i === nr) ? 'block' : 'none';
    }
  }
}

// Update game berekeningen
function updateGame(gameNr) {
  // jouw bestaande berekeningen
}

function updateGemiddeldeScratch() {
  // jouw bestaande berekeningen
}

// Hou bij hoeveel strikes per speler
const shootoutCounts = {};

function setupShootoutHandlers() {
  for (let g = 1; g <= 4; g++) {
    ['A', 'B'].forEach(team => {
      for (let s = 1; s <= 2; s++) {
        const id = `shootout-${team}-${g}-${s}`;
        const btn = document.getElementById(id);
        if (!btn) continue;

        const key = `${team}-${s}`;
        shootoutCounts[key] = shootoutCounts[key] || 0;

        btn.addEventListener('click', () => {
          shootoutCounts[key]++;
          btn.textContent = shootoutCounts[key];
          if (g === 4) markShootoutWinners();
        });

        btn.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          shootoutCounts[key] = Math.max(0, shootoutCounts[key] - 1);
          btn.textContent = shootoutCounts[key];
          if (g === 4) markShootoutWinners();
        });
      }
    });
  }
}

function markShootoutWinners() {
  ['A', 'B'].forEach(team => {
    let max = -1;
    let topId = null;
    for (let s = 1; s <= 2; s++) {
      const key = `${team}-${s}`;
      if ((shootoutCounts[key] || 0) > max) {
        max = shootoutCounts[key];
        topId = `shootout-${team}-4-${s}`;
      }
    }

    for (let s = 1; s <= 2; s++) {
      const btn = document.getElementById(`shootout-${team}-4-${s}`);
      if (btn) btn.classList.remove('winner');
    }

    if (topId) {
      const winnerBtn = document.getElementById(topId);
      if (winnerBtn) winnerBtn.classList.add('winner');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  createGames();
  setupShootoutHandlers();
});
