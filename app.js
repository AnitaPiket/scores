// Spelergegevens
const players = [
  { id: 'p1', name: 'Alice', team: 'A' },
  { id: 'p2', name: 'Bob', team: 'A' },
  { id: 'p3', name: 'Carol', team: 'B' },
  { id: 'p4', name: 'Dave', team: 'B' },
];

// Teller voor strikes per speler
const strikeCounts = {};
players.forEach(player => {
  strikeCounts[player.id] = 0;
});

// Huidige game (stel in op 5 om de winnaar te bepalen)
let currentGame = 5;

// Container voor de spelersknoppen
const container = document.getElementById('players-container');

// Functie om de knoppen te renderen
function renderButtons() {
  container.innerHTML = '';
  players.forEach(player => {
    const button = document.createElement('button');
    button.classList.add('player-button');
    button.id = player.id;
    button.textContent = strikeCounts[player.id];

    // Klikken verhoogt de teller
    button.addEventListener('click', () => {
      strikeCounts[player.id]++;
      button.textContent = strikeCounts[player.id];
      if (currentGame > 4) {
        highlightWinners();
      }
    });

    // Rechtermuisklik verlaagt de teller
    button.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (strikeCounts[player.id] > 0) {
        strikeCounts[player.id]--;
        button.textContent = strikeCounts[player.id];
        if (currentGame > 4) {
          highlightWinners();
        }
      }
    });

    container.appendChild(button);
  });
}

// Functie om de winnaars per team te markeren
function highlightWinners() {
  // Reset alle knoppen
  players.forEach(player => {
    const btn = document.getElementById(player.id);
    btn.classList.remove('winner');
  });

  // Groepeer spelers per team
  const teams = {};
  players.forEach(player => {
    if (!teams[player.team]) {
      teams[player.team] = [];
    }
    teams[player.team].push(player);
  });

  // Bepaal de winnaar per team
  for (const team in teams) {
    const teamPlayers = teams[team];
    let maxCount = -1;
    let winnerId = null;
    teamPlayers.forEach(player => {
      if (strikeCounts[player.id] > maxCount) {
        maxCount = strikeCounts[player.id];
        winnerId = player.id;
      }
    });
    if (winnerId) {
      document.getElementById(winnerId).classList.add('winner');
    }
  }
}

// Initialiseer de knoppen
renderButtons();
