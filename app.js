// Bowling Scores PWA - versie 6 met challenge-knoppen

let holdTimeout = null;

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
      <label>Score: <input type="number" id="score-${teamLetter}-${gameNr}-${spelerNr}" readonly placeholder="[automatisch]"></label><br>
      <label>Individueel Punt: <input type="number" id="indivPunt-${teamLetter}-${gameNr}-${spelerNr}" readonly placeholder="[automatisch]"></label><br>
      <label>Gem. Scratch: <input type="number" id="gemScratch-${teamLetter}-${gameNr}-${spelerNr}" readonly placeholder="[automatisch]"></label><br>
      <div class="challenge-knop" 
           id="challenge-${teamLetter}-${gameNr}-${spelerNr}" 
           onclick="incrementChallenge('${teamLetter}', ${gameNr}, ${spelerNr})"
           onmousedown="startHold('${teamLetter}', ${gameNr}, ${spelerNr})"
           onmouseup="clearHold()" 
           ontouchstart="startHold('${teamLetter}', ${gameNr}, ${spelerNr})" 
           ontouchend="clearHold()">0</div>
    </div>
  `;
}
function incrementChallenge(team, game, speler) {
  const id = `challenge-${team}-${game}-${speler}`;
  const knop = document.getElementById(id);
  let waarde = parseInt(knop.innerText) || 0;
  knop.innerText = waarde + 1;
  updateChallengeHighlight(team);
}

function startHold(team, game, speler) {
  holdTimeout = setTimeout(() => {
    const id = `challenge-${team}-${game}-${speler}`;
    const knop = document.getElementById(id);
    let waarde = parseInt(knop.innerText) || 0;
    if (waarde > 0) knop.innerText = waarde - 1;
    updateChallengeHighlight(team);
  }, 1000); // 1 seconde vasthouden = -1
}

function clearHold() {
  clearTimeout(holdTimeout);
}

function updateChallengeHighlight(team) {
  const values = [];
  for (let g = 1; g <= 4; g++) {
    for (let s = 1; s <= 2; s++) {
      const id = `challenge-${team}-${g}-${s}`;
      const el = document.getElementById(id);
      if (el) {
        const value = parseInt(el.innerText) || 0;
        values.push({ el, value });
      }
    }
  }

  const scores = values.map(v => v.value);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const allSame = scores[0] === scores[1] && scores[0] !== 0;

  values.forEach(v => {
    v.el.style.backgroundColor = ""; // reset eerst

    if (allSame) {
      v.el.style.backgroundColor = "#FFD700"; // geel
    } else if (v.value === max && v.value !== 0) {
      v.el.style.backgroundColor = "#FF4D4D"; // rood
    } else if (v.value === min && v.value !== 0 && v.value !== max) {
      v.el.style.backgroundColor = "#4CAF50"; // groen
    }
    // anders: geen kleur (0 of neutraal)
  });
}


function showGame(nr) {
  for (let i = 1; i <= 4; i++) {
    document.getElementById('game' + i).style.display = (i === nr) ? 'block' : 'none';
    document.getElementById('tab' + i).classList.remove('active-tab');
  }
  document.getElementById('tab' + nr).classList.add('active-tab');
}
function updateGame(gameNr) {
  ['A', 'B'].forEach(team => {
    let scoreTotal = 0;

    for (let speler = 1; speler <= 2; speler++) {
      const scratch = parseInt(document.getElementById(`scratch-${team}-${gameNr}-${speler}`).value) || 0;
      const hcp = parseInt(document.getElementById(`hcp-${team}-${gameNr}-${speler}`).value) || 0;
      const score = scratch + hcp;
      document.getElementById(`score-${team}-${gameNr}-${speler}`).value = score;
      scoreTotal += score;
    }

    document.getElementById(`scoreTotal${team}-${gameNr}`).value = scoreTotal;
  });

  updateIndividuelePunten(gameNr);
  updatePunten(gameNr);
  updateSamenvatting();
}

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
function updateSamenvatting() {
  let totaalA = 0;
  let totaalB = 0;
  let puntenA = 0;
  let puntenB = 0;

  for (let g = 1; g <= 4; g++) {
    totaalA += parseInt(document.getElementById(`scoreTotalA-${g}`)?.value) || 0;
    totaalB += parseInt(document.getElementById(`scoreTotalB-${g}`)?.value) || 0;

    for (let speler = 1; speler <= 2; speler++) {
      puntenA += parseFloat(document.getElementById(`indivPunt-A-${g}-${speler}`)?.value) || 0;
      puntenB += parseFloat(document.getElementById(`indivPunt-B-${g}-${speler}`)?.value) || 0;
    }

    puntenA += parseFloat(document.getElementById(`teamPuntA-${g}`)?.value) || 0;
    puntenB += parseFloat(document.getElementById(`teamPuntB-${g}`)?.value) || 0;
  }

  if (totaalA > totaalB) {
    document.getElementById('bonusPunt').innerText = "Team A";
    puntenA += 1;
  } else if (totaalB > totaalA) {
    document.getElementById('bonusPunt').innerText = "Team B";
    puntenB += 1;
  } else {
    document.getElementById('bonusPunt').innerText = "Gelijkspel";
    puntenA += 0.5;
    puntenB += 0.5;
  }

  document.getElementById('teamTotaalA').innerText = totaalA;
  document.getElementById('teamTotaalB').innerText = totaalB;
  document.getElementById('totaalPuntenA').innerText = puntenA;
  document.getElementById('totaalPuntenB').innerText = puntenB;
}

function updateGemiddeldeScratch() {
  let spelersData = {};

  for (let g = 1; g <= 4; g++) {
    ['A', 'B'].forEach(team => {
      for (let speler = 1; speler <= 2; speler++) {
        const naam = document.getElementById(`naam-${team}-${g}-${speler}`)?.value.trim();
        const scratch = parseInt(document.getElementById(`scratch-${team}-${g}-${speler}`)?.value) || null;

        if (naam) {
          if (!spelersData[naam]) {
            spelersData[naam] = { total: 0, count: 0 };
          }
          if (scratch !== null && scratch !== 0) {
            spelersData[naam].total += scratch;
            spelersData[naam].count++;
          }
        }
      }
    });
  }

  for (let g = 1; g <= 4; g++) {
    ['A', 'B'].forEach(team => {
      for (let speler = 1; speler <= 2; speler++) {
        const naam = document.getElementById(`naam-${team}-${g}-${speler}`)?.value.trim();
        const gemInput = document.getElementById(`gemScratch-${team}-${g}-${speler}`);
        if (naam && spelersData[naam] && spelersData[naam].count > 0) {
          gemInput.value = Math.round(spelersData[naam].total / spelersData[naam].count);
        } else {
          gemInput.value = "";
        }
      }
    });
  }
}

function resetApp() {
  if (confirm('Weet je zeker dat je alles wilt wissen?')) {
    localStorage.clear();
    location.reload();
  }
}

function exportPDF() {
  alert('PDF export functie wordt later toegevoegd.');
}

document.addEventListener('DOMContentLoaded', () => {
  createGames();
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
      document.activeElement.blur();
      window.scrollTo(0, 0);
    });
  });
});
