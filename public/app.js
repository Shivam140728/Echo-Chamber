let wordPairs = [
  { civilian: "SHOWER", undercover: "BATH" },
  { civilian: "APPLE", undercover: "PEAR" },
  { civilian: "LAPTOP", undercover: "TABLET" },
  { civilian: "GUITAR", undercover: "UKULELE" },
  { civilian: "COFFEE", undercover: "TEA" }
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

let currentWordPair = null;
let gameCards = [];
let currentPickerIndex = 0;

let activePlayers = [];
let isVotingMode = false;
let playerToEliminate = null;

// Initialize
function initApp() {
  updateSetupUI();
}

// Navigation
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  if (pageId === 'page-2') updateSetupUI();
  if (pageId === 'page-3') renderGroupsList();
}

// Setup Page Logic
function adjustRole(role, delta) {
  const activeGroup = groups.find(g => g.id === selectedGroupId);
  const total = activeGroup ? activeGroup.players.length : 0;

  if (role === 'undercover') undercoverCount = Math.max(0, undercoverCount + delta);
  if (role === 'mrWhite') mrWhiteCount = Math.max(0, mrWhiteCount + delta);

  if ((undercoverCount + mrWhiteCount) >= total) {
    if (role === 'undercover') undercoverCount = Math.max(0, total - mrWhiteCount - 1);
    if (role === 'mrWhite') mrWhiteCount = Math.max(0, total - undercoverCount - 1);
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

// Group Management
function renderGroupsList() {
  const container = document.getElementById('groups-container');
  container.innerHTML = '';

  groups.forEach(group => {
    const isSelected = group.id === selectedGroupId;
    container.innerHTML += `
      <div class="group-card" style="background: white; border-radius:16px; padding:12px; margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 style="color:${group.color}">${group.name} (${group.players.length} Players)</h3>
          <button class="icon-btn" onclick="openEditGroup('${group.id}')">✏️</button>
        </div>
        <button class="primary-btn" style="margin-top:8px; padding:8px; font-size:12px;" onclick="selectGroup('${group.id}')">
          ${isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    `;
  });
}

function selectGroup(groupId) {
  selectedGroupId = groupId;
  navigateTo('page-2');
}

function openCreateGroup() {
  editingGroup = { id: 'g_' + Date.now(), name: 'New Group', color: '#38bdf8', players: [] };
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
      <div class="counter-row">
        <span>${p.name}</span>
        <button class="icon-btn" onclick="removePlayerFromGroup(${idx})">🗑️</button>
      </div>
    `;
  });
}

function addPlayerToGroup() {
  if (editingGroup.players.length >= 20) return alert("Maximum 20 players allowed.");
  const name = prompt("Enter player name:");
  if (name && name.trim()) {
    const colors = ['#22c55e', '#38bdf8', '#4ade80', '#0284c7', '#22d3ee', '#f43f5e'];
    editingGroup.players.push({ name: name.trim(), color: colors[Math.floor(Math.random() * colors.length)] });
    renderEditGroup();
  }
}

function removePlayerFromGroup(index) {
  editingGroup.players.splice(index, 1);
  renderEditGroup();
}

function saveGroupChanges() {
  if (editingGroup.players.length < 3) return alert("Group must have at least 3 players.");
  editingGroup.name = document.getElementById('edit-group-name').value.trim() || 'Group';
  const index = groups.findIndex(g => g.id === editingGroup.id);
  if (index >= 0) groups[index] = editingGroup;
  else groups.push(editingGroup);

  selectedGroupId = editingGroup.id;
  navigateTo('page-3');
}

// Game Flow Start
function startGame() {
  const activeGroup = groups.find(g => g.id === selectedGroupId);
  if (!activeGroup || activeGroup.players.length < 3 || activeGroup.players.length > 20) {
    return alert("Player count must be between 3 and 20.");
  }

  // 1. Shuffle player sequence for card picking order each game
  let players = [...activeGroup.players].sort(() => Math.random() - 0.5);
  currentWordPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];

  // 2. Re-assign secret roles randomly every game
  let roles = [];
  for (let i = 0; i < undercoverCount; i++) roles.push('UNDERCOVER');
  for (let i = 0; i < mrWhiteCount; i++) roles.push('MR_WHITE');
  while (roles.length < players.length) roles.push('CIVILIAN');
  roles = roles.sort(() => Math.random() - 0.5);

  activePlayers = players.map((p, idx) => ({
    name: p.name,
    color: p.color,
    role: roles[idx],
    word: roles[idx] === 'CIVILIAN' ? currentWordPair.civilian : (roles[idx] === 'UNDERCOVER' ? currentWordPair.undercover : 'You are Mr. White!'),
    eliminated: false,
    order: idx + 1
  }));

  gameCards = activePlayers.map(p => ({ ...p, used: false }));
  currentPickerIndex = 0;
  isVotingMode = false;

  // Automatically update and show current player name
  renderCardsGrid();
  navigateTo('page-5');
}

// Card Pick Screen
function renderCardsGrid() {
  document.getElementById('current-picker-name').innerText = gameCards[currentPickerIndex].name;
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';

  gameCards.forEach((card, idx) => {
    grid.innerHTML += `
      <div class="mystery-card ${card.used ? 'used' : ''}" onclick="pickCard(${idx})">❓</div>
    `;
  });
}

function pickCard(cardIndex) {
  if (gameCards[cardIndex].used) return;

  const currentPicker = gameCards[currentPickerIndex];
  document.getElementById('modal-avatar').style.background = currentPicker.color;
  document.getElementById('modal-avatar').innerText = currentPicker.name[0];
  document.getElementById('modal-player-name').innerText = currentPicker.name;
  document.getElementById('modal-secret-word').innerText = currentPicker.word;

  gameCards[cardIndex].used = true;
  document.getElementById('card-modal').classList.add('active');
}

function closeCardModal() {
  document.getElementById('card-modal').classList.remove('active');
  currentPickerIndex++;

  if (currentPickerIndex >= gameCards.length) {
    initDescriptionBoard();
    navigateTo('page-6');
  } else {
    renderCardsGrid();
  }
}

// Description & Elimination Board
function initDescriptionBoard() {
  isVotingMode = false;
  let activeOnly = activePlayers.filter(p => !p.eliminated).sort(() => Math.random() - 0.5);
  activeOnly.forEach((p, idx) => p.order = idx + 1);

  renderBoardUI();
}

function renderBoardUI() {
  document.getElementById('board-title').innerText = isVotingMode ? "Elimination Time" : "Description Time";
  document.getElementById('board-subtitle').innerText = isVotingMode 
    ? "Discuss and vote somebody out by pointing fingers!" 
    : "Describe your secret word in order.";

  document.getElementById('vote-action-btn').innerText = isVotingMode ? "Describe again" : "Go to Vote";

  const remainingWhite = activePlayers.filter(p => !p.eliminated && p.role === 'MR_WHITE').length;
  const remainingUndercover = activePlayers.filter(p => !p.eliminated && p.role === 'UNDERCOVER').length;

  document.getElementById('count-mrwhite').innerText = remainingWhite;
  document.getElementById('count-undercover').innerText = remainingUndercover;

  const grid = document.getElementById('players-board-grid');
  grid.innerHTML = '';

  activePlayers.filter(p => !p.eliminated).forEach(p => {
    grid.innerHTML += `
      <div class="player-card-node">
        ${isVotingMode 
          ? `<div class="badge-elim" onclick="openEliminateModal('${p.name}')">Eliminate</div>` 
          : `<div class="badge-order">${p.order}</div>`
        }
        <div class="avatar-large" style="background:${p.color}">${p.name[0]}</div>
        <span class="player-node-name">${p.name}</span>
      </div>
    `;
  });
}

function toggleVoteMode() {
  isVotingMode = !isVotingMode;
  renderBoardUI();
}

function openEliminateModal(playerName) {
  playerToEliminate = activePlayers.find(p => p.name === playerName);
  document.getElementById('elim-player-title').innerText = `Eliminate ${playerToEliminate.name}?`;
  document.getElementById('eliminate-confirm-modal').classList.add('active');
}

function closeEliminateModal() {
  document.getElementById('eliminate-confirm-modal').classList.remove('active');
}

function confirmElimination(targetRole) {
  closeEliminateModal();
  playerToEliminate.eliminated = true;

  document.getElementById('result-role-title').innerText = `${playerToEliminate.role.replace('_', ' ')} ELIMINATED!`;
  document.getElementById('result-avatar').style.background = playerToEliminate.color;
  document.getElementById('result-avatar').innerText = playerToEliminate.name[0];
  document.getElementById('result-player-name').innerText = playerToEliminate.name;

  document.getElementById('result-modal').classList.add('active');
}

function handleResultModalOk() {
  document.getElementById('result-modal').classList.remove('active');

  if (playerToEliminate.role === 'MR_WHITE') {
    document.getElementById('mrwhite-word-input').value = '';
    document.getElementById('mrwhite-guess-modal').classList.add('active');
  } else {
    checkWinConditions();
  }
}

function submitMrWhiteGuess() {
  const guess = document.getElementById('mrwhite-word-input').value.trim().toUpperCase();
  document.getElementById('mrwhite-guess-modal').classList.remove('active');

  if (guess === currentWordPair.civilian.toUpperCase()) {
    triggerGameOver("Mr. White Guessed correctly! Mr. White Wins!");
  } else {
    alert("Incorrect Guess! Game continues.");
    checkWinConditions();
  }
}

function checkWinConditions() {
  const remaining = activePlayers.filter(p => !p.eliminated);
  const remainingInfiltrators = remaining.filter(p => p.role === 'MR_WHITE' || p.role === 'UNDERCOVER');

  if (remainingInfiltrators.length === 0) {
    triggerGameOver("All Infiltrators eliminated! Civilians Win!");
    return;
  }

  if (remaining.length <= 2 && remainingInfiltrators.length > 0) {
    triggerGameOver("Only 2 players remain! Mr. White/Undercover Wins!");
    return;
  }

  initDescriptionBoard();
}

function triggerGameOver(message) {
  document.getElementById('game-over-title').innerText = "Game Over";
  document.getElementById('game-over-msg').innerText = message;
  document.getElementById('game-over-modal').classList.add('active');
}

function restartGameImmediately() {
  document.getElementById('game-over-modal').classList.remove('active');
  startGame();
}

document.addEventListener('DOMContentLoaded', initApp);