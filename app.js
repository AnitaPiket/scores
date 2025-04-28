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
        <label>Team Scratch A: <input type="number" id="scratchTotalA-${g}" readonly></label><br>
        <label>Team Scratch B: <input type="number" id="scratchTotalB-${g}" readonly></label><br>
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
      <label>Naam: <input type="text" id="naam-${teamLetter}-${gameNr}-${spelerNr}"></label><br>
      <label>HCP: <input type="number" id="hcp-${teamLetter}-${gameNr}-${spelerNr}" oninput="updateGame(${gameNr})"></label><br>
      <label>Scratch: <input type="number" id="scratch-${teamLetter}-${gameNr}-${spelerNr}" oninput="updateGame(${gameNr})"></label><br>
      <label>Score: <input type="number" id="score-${teamLetter}-${gameNr}-${spelerNr}" readonly></label><br>
      <label>Individueel Punt: <input type="number" id="indivPunt-${teamLetter}-${gameNr}-${spelerNr}" readonly></label><br>
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
  ['A', 'B'].forEach(team => {
    let scratchTotal = 0;
    let scoreTotal = 0;

    for (let speler = 1; speler <= 2; speler++) {
      const scratch = parseInt(document.getElementById(`scratch-${team}-${gameNr}-${speler}`).value) || 0;
      const hcp = parseInt(document.getElementById(`hcp-${team}-${gameNr}-${speler}`).value) || 0;
      const score = scratch + hcp;
      document.getElementById(`score-${team}-${gameNr}-${speler}`).value = score;
      scratchTotal += scratch;
      scoreTotal += score;
    }

    document.getElementById(`scratchTotal${team}-${gameNr}`).value = scratchTotal;
    document.getElementById(`scoreTotal${team}-${gameNr}`).value = scoreTotal;
  });

  updateIndividuelePunten(gameNr);
  updatePunten(gameNr);
  updateSamenvatting();
}

// Bereken individuele punten
function updateIndividuelePunten(gameNr) {
  for (let speler = 1; speler <= 2; speler++) {
    const scoreA = parseInt(document.getElementById(`score-A-${gameNr}-${speler}`).value) || 0;
    const scoreB = parseInt(document.getElementById(`score-B-${gameNr}-${speler}`).value) || 0;

    if (scoreA > scoreB) {
      document.getElementById(`indivPunt-A-${gameNr}-${speler}`).value = 1;
      document.getElementById(`indivPunt-B-${gameNr}-${speler}`).value = 0;
    } else if (scoreB > scoreA) {
      document.getElementById(`indivPunt-A-${gameNr}-${speler}`).value = 0;
      document.getElementById(`indivPunt-B-${gameNr}-${speler}`).value = 1;
    } else {
      document.getElementById(`indivPunt-A-${gameNr}-${speler}`).value = 0.5;
      document.getElementById(`indivPunt-B-${gameNr}-${speler}`).value = 0.5;
    }
  }
}

// Bereken teampunten per game
function updatePunten(gameNr) {
  const scoreA = parseInt(document.getElementById(`scoreTotalA-${gameNr}`).value) || 0;
  const scoreB = parseInt(document.getElementById(`scoreTotalB-${gameNr}`).value) || 0;

  if (scoreA > scoreB) {
    document.getElementById(`teamPuntA-${gameNr}`).value = 1;
    document.getElementById(`teamPuntB-${gameNr}`).value = 0;
  } else if (scoreB > scoreA) {
    document.getElementById(`teamPuntA-${gameNr}`).value = 0;
    document.getElementById(`teamPuntB-${gameNr}`).value = 1;
  } else {
    document.getElementById(`teamPuntA-${gameNr}`).value = 0.5;
    document.getElementById(`teamPuntB-${gameNr}`).value = 0.5;
  }
}

// Update samenvatting totaal
function updateSamenvatting() {
  let totaalA = 0;
  let totaalB = 0;

  for (let g = 1; g <= 4; g++) {
    totaalA += parseInt(document.getElementById(`scoreTotalA-${g}`)?.value) || 0;
    totaalB += parseInt(document.getElementById(`scoreTotalB-${g}`)?.value) || 0;
  }

  document.getElementById('teamTotaalA').innerText = totaalA;
  document.getElementById('teamTotaalB').innerText = totaalB;

  if (totaalA > totaalB) {
    document.getElementById('bonusPunt').innerText = 1;
  } else if (totaalB > totaalA) {
    document.getElementById('bonusPunt').innerText = 0;
  } else {
    document.getElementById('bonusPunt').innerText = 0.5;
  }
}

// Reset app
function resetApp() {
  if (confirm('Weet je zeker dat je alles wilt wissen?')) {
    localStorage.clear();
    location.reload();
  }
}

// Export PDF (later toevoegen)
function exportPDF() {
  alert('PDF export functie wordt later toegevoegd.');
}

// Start
document.addEventListener('DOMContentLoaded', () => {
  createGames();
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
      document.activeElement.blur();
      window.scrollTo(0, 0);
    });
  });
});
