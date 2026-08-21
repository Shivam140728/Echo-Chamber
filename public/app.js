let groups = [
  { id: 'g1', name: 'Cyber Hackers', color: '#00E5FF', players: ['Alpha', 'Beta', 'Cipher', 'Glitch'] },
  { id: 'g2', name: 'Network Bluffs', color: '#FF0055', players: ['Agent 1', 'Agent 2', 'Agent 3'] },
  { id: 'g3', name: 'Shadow Protocol', color: '#CCF144', players: ['Neo', 'Trinity', 'Morpheus', 'Smith', 'Oracle'] }
];

let currentSuspects = ['Player 1', 'Player 2', 'Player 3'];

function initApp() {
  loadFromStorage();
  renderReadyTeams();
}

function saveToStorage() {
  localStorage.setItem('cm_groups', JSON.stringify(groups));
}

function loadFromStorage() {
  const stored = localStorage.getItem('cm_groups');
  if (stored) {
    try { groups = JSON.parse(stored); } catch(e){}
  }
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function openGameSetup() {
  renderSuspectsInputs();
  navigateTo('page-2');
}

// Render saved groups with Delete button
function renderReadyTeams() {
  const container = document.getElementById('ready-teams-list');
  container.innerHTML = '';

  if (groups.length === 0) {
    container.innerHTML = `<p style="font-size:11px; color:#8B949E; text-align:center; padding:10px;">No saved crews found.</p>`;
    return;
  }

  groups.forEach(g => {
    container.innerHTML += `
      <div class="ready-team-item">
        <div class="team-info-group" onclick="loadCrewToSetup('${g.id}')">
          <div class="team-avatar-square" style="background:${g.color}">${g.name.charAt(0)}</div>
          <div>
            <h4>${g.name}</h4>
            <p>${g.players.length} players (${g.players.slice(0, 3).join(', ')}${g.players.length > 3 ? '...' : ''})</p>
          </div>
        </div>
        <button class="delete-crew-btn" title="Delete Group" onclick="deleteGroup(event, '${g.id}')">✕</button>
      </div>
    `;
  });
}

// Feature 1: Delete Group Option
function deleteGroup(event, groupId) {
  event.stopPropagation(); // Prevents triggering loadCrewToSetup click
  const groupToDelete = groups.find(g => g.id === groupId);
  if (groupToDelete && confirm(`Are you sure you want to delete "${groupToDelete.name}"?`)) {
    groups = groups.filter(g => g.id !== groupId);
    saveToStorage();
    renderReadyTeams();
  }
}

function loadCrewToSetup(groupId) {
  const g = groups.find(item => item.id === groupId);
  if (g) {
    document.getElementById('setup-team-name').value = g.name;
    currentSuspects = [...g.players];
    renderSuspectsInputs();
    navigateTo('page-2');
  }
}

function renderSuspectsInputs() {
  const list = document.getElementById('suspects-inputs-list');
  list.innerHTML = '';
  currentSuspects.forEach((name, idx) => {
    list.innerHTML += `
      <div class="suspect-row">
        <span style="font-size:10px; color:#00E5FF; font-family:'Space Mono';">${(idx + 1).toString().padStart(2, '0')}</span>
        <input type="text" class="suspect-input" value="${name}" onchange="updateSuspectName(${idx}, this.value)">
        <button style="background:none; border:none; color:#8B949E; cursor:pointer;" onclick="removeSuspect(${idx})">✕</button>
      </div>
    `;
  });
  document.getElementById('suspects-counter-badge').innerText = currentSuspects.length;
}

function addSuspectField() {
  if (currentSuspects.length >= 20) return alert("Maximum 20 players allowed.");
  currentSuspects.push(`Player ${currentSuspects.length + 1}`);
  renderSuspectsInputs();
}

function updateSuspectName(idx, val) {
  currentSuspects[idx] = val.trim() || `Player ${idx + 1}`;
}

function removeSuspect(idx) {
  if (currentSuspects.length <= 3) return alert("Minimum 3 players required.");
  currentSuspects.splice(idx, 1);
  renderSuspectsInputs();
}

function startGame() {
  const teamName = document.getElementById('setup-team-name').value.trim() || 'Cyber Hackers';
  
  // Save or update group in localStorage
  const existingIdx = groups.findIndex(g => g.name.toLowerCase() === teamName.toLowerCase());
  if (existingIdx >= 0) {
    groups[existingIdx].players = [...currentSuspects];
  } else {
    const colors = ['#00E5FF', '#FF0055', '#CCF144', '#9D4EDD'];
    groups.push({
      id: 'g_' + Date.now(),
      name: teamName,
      color: colors[Math.floor(Math.random() * colors.length)],
      players: [...currentSuspects]
    });
  }
  saveToStorage();
  renderReadyTeams();
  alert(`Server Connected! Team "${teamName}" deployed.`);
}

document.addEventListener('DOMContentLoaded', initApp);