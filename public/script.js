// Application State
let wordPairs = [
  { civilian: "SHOWER", undercover: "BATH" },
  { civilian: "APPLE", undercover: "PEAR" },
  { civilian: "LAPTOP", undercover: "TABLET" }
];

let groups = [
  {
    id: 'g1',
    name: 'V5',
    color: '#f43f5e',
    players: [
      { name: 'Shivam', color: '#22c55e' },
      { name: 'Sneha', color: '#38bdf8' },
      { name: 'Mahima', color: '#4ade80' },
      { name: 'Dhanush', color: '#0284c7' },
      { name: 'Anand', color: '#22d3ee' }
    ]
  }
];

let selectedGroupId = 'g1';
let editingGroup = null;

let undercoverCount = 1;
let mrWhiteCount = 1;

let gameCards = [];
let currentPickerIndex = 0;

// Initialize and Fetch JSON data if available
async function initApp() {
  try {
    const response = await fetch('words.json');
    if (response.ok) {
      const data = await response.json();
      if (data.wordPairs) wordPairs = data.wordPairs;
      if (data.defaultGroup) groups = [data.defaultGroup];
    }
  } catch (err) {
    console.log("Using default fallback data.");
  }
  updateSetupUI();
}

// Navigation
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  if (pageId === 'page-2') updateSetupUI();
  if (pageId === 'page-3') renderGroupsList();
}

// Role Counters
function adjustRole(role, delta) {
  const activeGroup = groups.find(g => g.id === selectedGroupId);
  const totalPlayers = activeGroup ? activeGroup.players.length : 0;

  if (role === 'undercover') {
    undercoverCount = Math.max(0, undercoverCount + delta);
  } else if (role === 'mrWhite') {
    mrWhiteCount = Math.max(0, mrWhiteCount + delta);
  }

  if ((undercoverCount + mrWhiteCount) >= totalPlayers) {
    if (role === 'undercover') undercoverCount = Math.max(0, totalPlayers - mrWhiteCount - 1);
    if (role === 'mrWhite') mrWhiteCount = Math.max(0, totalPlayers - undercoverCount - 1);
  }

  updateSetupUI();
}

function updateSetupUI() {
  const activeGroup = groups.find(g => g.id === selectedGroupId);
  const total = activeGroup ? activeGroup.players.length : 0;
  const civilians = Math.max(0, total - undercoverCount - mrWhiteCount);

  document.getElementById('setup-player-count').innerText = `Players: ${total}`;
  document.getElementById('label-civilians').innerText = `${civilians} Civilians`;
  document.getElementById('label-undercover').innerText = `${undercoverCount} Undercover`;
  document.getElementById('label-mrwhite').innerText = `${mrWhiteCount} Mr. White`;
}

// Group Selection & Management
function renderGroupsList() {
  const container = document.getElementById('groups-container');
  container.innerHTML = '';

  groups.forEach(group => {
    const isSelected = group.id === selectedGroupId;
    const html = `
      <div class="group-card">
        <div class="group-header" style="background: ${group.color}">
          <span>${group.name}</span>
          <button class="icon-btn" style="color:white" onclick="openEditGroup('${group.id}')">✏️</button>
        </div>
        <div class="group-body">
          ${group.players.map(p => `
            <div class="player-item">
              <div class="avatar-bubble" style="background:${p.color}">${p.name[0]}</div>
              <span style="margin-top:4px">${p.name}</span>
            </div>
          `).join('')}
        </div>
        <div class="group-actions">
          <button class="select-group-btn" onclick="selectGroup('${group.id}')">
            ${isSelected ? 'Selected' : 'Select group'}
          </button>
          <button class="icon-btn" onclick="deleteGroup('${group.id}')">🗑️</button>
        </div>
      </div>
    `;
    container.innerHTML += html;
  });
}

function selectGroup(groupId) {
  selectedGroupId = groupId;
  navigateTo('page-2');
}

function openCreateGroup() {
  editingGroup = {
    id: 'g_' + Date.now(),
    name: 'New Group',
    color: '#38bdf8',
    players: []
  };
  renderEditGroup();
  navigateTo('page-4');
}

function openEditGroup(groupId) {
  const target = groups.find(g => g.id === groupId);
  editingGroup = JSON.parse(JSON.stringify(target));
  renderEditGroup();
  navigateTo('page-4');
}

function renderEditGroup() {
  document.getElementById('edit-group-name').value = editingGroup.name;
  const list = document.getElementById('edit-players-list');
  list.innerHTML = '';

  editingGroup.players.forEach((p, idx) => {
    list.innerHTML += `
      <div class="player-row-edit">
        <div class="player-row-left">
          <div class="avatar-bubble" style="background:${p.color}; width:36px; height:36px; font-size:14px">${p.name[0]}</div>
          <span style="font-weight:700">${p.name}</span>
        </div>
        <button class="icon-btn" onclick="removePlayerFromGroup(${idx})">🗑️</button>
      </div>
    `;
  });
}

function addPlayerToGroup() {
  const name = prompt("Enter player name:");
  if (name && name.trim()) {
    const colors = ['#22c55e', '#38bdf8', '#4ade80', '#0284c7', '#22d3ee', '#f43f5e'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    editingGroup.players.push({ name: name.trim(), color: randomColor });
    renderEditGroup();
  }
}

function removePlayerFromGroup(index) {
  editingGroup.players.splice(index, 1);
  renderEditGroup();
}

function saveGroupChanges() {
  editingGroup.name = document.getElementById('edit-group-name').value.trim() || 'Group';
  const index = groups.findIndex(g => g.id === editingGroup.id);
  
  if (index >= 0) {
    groups[index] = editingGroup;
  } else {
    groups.push(editingGroup);
  }

  selectedGroupId = editingGroup.id;
  navigateTo('page-3');
}

function deleteGroup(groupId) {
  if (groups.length <= 1) return alert("You must have at least one group.");
  groups = groups.filter(g => g.id !== groupId);
  if (selectedGroupId === groupId) selectedGroupId = groups[0].id;
  renderGroupsList();
}

// Gameplay Logic
function startGame() {
  const activeGroup = groups.find(g => g.id === selectedGroupId);
  if (!activeGroup || activeGroup.players.length === 0) return alert("Please select a group with players.");

  const players = [...activeGroup.players];
  const wordPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];

  let roles = [];
  for (let i = 0; i < undercoverCount; i++) roles.push('UNDERCOVER');
  for (let i = 0; i < mrWhiteCount; i++) roles.push('MR_WHITE');
  while (roles.length < players.length) roles.push('CIVILIAN');
  roles = roles.sort(() => Math.random() - 0.5);

  gameCards = players.map((p, idx) => ({
    player: p,
    role: roles[idx],
    word: roles[idx] === 'CIVILIAN' ? wordPair.civilian : (roles[idx] === 'UNDERCOVER' ? wordPair.undercover : 'You are Mr. White!'),
    used: false
  }));

  currentPickerIndex = 0;
  renderCardsGrid();
  navigateTo('page-5');
}

function renderCardsGrid() {
  const activeGroup = groups.find(g => g.id === selectedGroupId);
  document.getElementById('current-picker-name').innerText = activeGroup.players[currentPickerIndex].name;

  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';

  gameCards.forEach((card, idx) => {
    grid.innerHTML += `
      <div class="mystery-card ${card.used ? 'used' : ''}" onclick="pickCard(${idx})">
        ❓
      </div>
    `;
  });
}

function pickCard(cardIndex) {
  const card = gameCards[cardIndex];
  if (card.used) return;

  const currentPicker = gameCards[currentPickerIndex].player;

  document.getElementById('modal-avatar').style.background = currentPicker.color;
  document.getElementById('modal-avatar').innerText = currentPicker.name[0];
  document.getElementById('modal-player-name').innerText = currentPicker.name;
  document.getElementById('modal-secret-word').innerText = card.word;

  card.used = true;
  document.getElementById('card-modal').classList.add('active');
}

function closeCardModal() {
  document.getElementById('card-modal').classList.remove('active');
  currentPickerIndex++;

  if (currentPickerIndex >= gameCards.length) {
    alert("All players have picked their cards! Start describing your words!");
    navigateTo('page-2');
  } else {
    renderCardsGrid();
  }
}

// App Launch
document.addEventListener('DOMContentLoaded', initApp);