const categoriesData = [
  { id: "Animals", name: "Animals", count: 100, pairs: [{ civilian: "DOG", undercover: "WOLF" }, { civilian: "CAT", undercover: "LION" }] },
  { id: "Entertainment", name: "Entertainment", count: 100, pairs: [{ civilian: "MOVIE", undercover: "SERIES" }] },
  { id: "Everyday Life", name: "Everyday Life", count: 100, pairs: [{ civilian: "MORNING", undercover: "EVENING" }] },
  { id: "Food & Drink", name: "Food & Drink", count: 100, pairs: [{ civilian: "COFFEE", undercover: "TEA" }] },
  { id: "Nature", name: "Nature", count: 100, pairs: [{ civilian: "RIVER", undercover: "STREAM" }] },
  { id: "Objects", name: "Objects", count: 100, pairs: [{ civilian: "CHAIR", undercover: "STOOL" }] },
  { id: "Places", name: "Places", count: 100, pairs: [{ civilian: "PARK", undercover: "GARDEN" }] },
  { id: "Professions", name: "Professions", count: 100, pairs: [{ civilian: "DOCTOR", undercover: "NURSE" }] },
  { id: "Sports", name: "Sports", count: 100, pairs: [{ civilian: "FOOTBALL", undercover: "RUGBY" }] },
  { id: "Travel", name: "Travel", count: 100, pairs: [{ civilian: "PLANE", undercover: "HELICOPTER" }] }
];

let selectedCategories = new Set(categoriesData.map(c => c.id));
let isAllSelected = true;

// Default empty group structure for new games
let currentTeam = {
  name: "",
  players: [
    { name: "Player 1", color: "#22c55e" },
    { name: "Player 2", color: "#38bdf8" },
    { name: "Player 3", color: "#4ade80" },
    { name: "Player 4", color: "#0284c7" },
    { name: "Player 5", color: "#f43f5e" }
  ]
};

let undercoverCount = 1;
let mrWhiteCount = 1;

let currentWordPair = null;
let gameCards = [];
let currentPickerIndex = 0;
let activePlayers = [];
let isVotingMode = false;
let playerToEliminate = null;
let winningTeam = "";
let pageHistory = [];

function initApp() {
  renderSuspectsList();
  renderCategoriesGrid();
  updateSetupUI();
}

function startNewGameFromHome() {
  document.getElementById('team-name-input').value = "";
  currentTeam.name = "";
  currentTeam.players = [
    { name: "Player 1", color: "#22c55e" },
    { name: "Player 2", color: "#38bdf8" },
    { name: "Player 3", color: "#4ade80" },
    { name: "Player 4", color: "#0284c7" },
    { name: "Player 5", color: "#f43f5e" }
  ];
  renderSuspectsList();
  updateSetupUI();
  navigateTo('page-2');
}

function updateTeamName(val) {
  currentTeam.name = val.trim();
}

function renderSuspectsList() {
  const container = document.getElementById('suspects-list-container');
  container.innerHTML = '';

  currentTeam.players.forEach((p, idx) => {
    container.innerHTML += `
      <div class="suspect-item">
        <div class="suspect-left">
          <span class="suspect-num">0${idx + 1}</span>
          <span class="suspect-name">${p.name}</span>
        </div>
        <button class="remove-btn" onclick="removePlayer(${idx})">✕</button>
      </div>
    `;
  });

  document.getElementById('badge-player-count').innerText = currentTeam.players.length;
}

function addPlayerToCurrentGroup() {
  if (currentTeam.players.length >= 20) return alert("Maximum 20 players.");
  const nextNum = currentTeam.players.length + 1;
  const colors = ['#22c55e', '#38bdf8', '#4ade80', '#0284c7', '#22d3ee', '#f43f5e'];
  currentTeam.players.push({ name: `Player ${nextNum}`, color: colors[Math.floor(Math.random() * colors.length)] });
  renderSuspectsList();
  updateSetupUI();
}

function removePlayer(idx) {
  if (currentTeam.players.length <= 3) return alert("Minimum 3 players required.");
  currentTeam.players.splice(idx, 1);
  renderSuspectsList();
  updateSetupUI();
}

function renderCategoriesGrid() {
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = '';

  categoriesData.forEach(cat => {
    const isSelected = selectedCategories.has(cat.id);
    grid.innerHTML += `
      <div class="category-card ${isSelected ? 'selected' : ''}" onclick="toggleCategory('${cat.id}')">
        <span class="cat-name">${cat.name}</span>
        <span class="cat-count">${cat.count}</span>
      </div>
    `;
  });

  const allBtn = document.getElementById('cat-btn-all');
  if (isAllSelected) {
    allBtn.classList.add('selected');
  } else {
    allBtn.classList.remove('selected');
  }
}

function toggleAllCategories() {
  if (isAllSelected) {
    selectedCategories.clear();
    isAllSelected = false;
  } else {
    categoriesData.forEach(c => selectedCategories.add(c.id));
    isAllSelected = true;
  }
  renderCategoriesGrid();
}

function toggleCategory(catId) {
  if (selectedCategories.has(catId)) {
    selectedCategories.delete(catId);
    isAllSelected = false;
  } else {
    selectedCategories.add(catId);
    if (selectedCategories.size === categoriesData.length) {
      isAllSelected = true;
    }
  }
  renderCategoriesGrid();
}

function adjustRole(role, delta) {
  const total = currentTeam.players.length;
  if (role === 'undercover') undercoverCount = Math.max(0, undercoverCount + delta);
  if (role === 'mrWhite') mrWhiteCount = Math.max(0, mrWhiteCount + delta);

  if ((undercoverCount + mrWhiteCount) >= total - 1) {
    if (role === 'undercover') undercoverCount = Math.max(0, total - mrWhiteCount - 2);
    if (role === 'mrWhite') mrWhiteCount = Math.max(0, total - undercoverCount - 2);
  }

  updateSetupUI();
}

function updateSetupUI() {
  document.getElementById('cnt-undercover').innerText = undercoverCount;
  document.getElementById('cnt-mrwhite').innerText = mrWhiteCount;
  document.getElementById('footer-summary-text').innerText = 
    `${currentTeam.players.length} players · ${undercoverCount} Spy · ${mrWhiteCount} Mr White`;
}

function getNextWordPair() {
  let activePool = categoriesData.filter(c => selectedCategories.has(c.id));
  if (activePool.length === 0) activePool = categoriesData;

  let allPairs = [];
  activePool.forEach(c => {
    c.pairs.forEach(p => allPairs.push(p));
  });

  return allPairs[Math.floor(Math.random() * allPairs.length)];
}

function startGame() {
  if (selectedCategories.size === 0) return alert("Please select at least one category.");
  if (currentTeam.players.length < 5) return alert("Minimum 5 players required.");

  let players = [...currentTeam.players].sort(() => Math.random() - 0.5);
  currentWordPair = getNextWordPair();

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
    order: 0
  }));

  gameCards = activePlayers.map(p => ({ ...p, used: false }));
  currentPickerIndex = 0;
  isVotingMode = false;

  renderCardsGrid();
  navigateTo('page-5');
}

function renderCardsGrid() {
  document.getElementById('current-picker-name').innerText = gameCards[currentPickerIndex].name;
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';

  gameCards.forEach((card, idx) => {
    grid.innerHTML += `<div class="mystery-card ${card.used ? 'used' : ''}" onclick="pickCard(${idx})">❓</div>`;
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

// TURN ORDER RULE: Mr. White CANNOT be the first person to describe/start discussion
function initDescriptionBoard() {
  isVotingMode = false;
  let activeOnly = activePlayers.filter(p => !p.eliminated);

  // Shuffle active players until a non-Mr. White player is at index 0
  let validOrder = false;
  while (!validOrder) {
    activeOnly.sort(() => Math.random() - 0.5);
    if (activeOnly[0].role !== 'MR_WHITE') {
      validOrder = true;
    }
  }

  activeOnly.forEach((p, idx) => p.order = idx + 1);
  renderBoardUI();
}

function renderBoardUI() {
  document.getElementById('board-title').innerText = isVotingMode ? "Elimination Time" : "Description Time";
  document.getElementById('board-subtitle').innerText = isVotingMode ? "Discuss and vote somebody out!" : "Describe your secret word in order.";
  document.getElementById('vote-action-btn').innerText = isVotingMode ? "Describe again" : "Go to Vote";

  const remainingWhite = activePlayers.filter(p => !p.eliminated && p.role === 'MR_WHITE').length;
  const remainingUndercover = activePlayers.filter(p => !p.eliminated && p.role === 'UNDERCOVER').length;

  document.getElementById('board-count-mrwhite').innerText = remainingWhite;
  document.getElementById('board-count-undercover').innerText = remainingUndercover;

  const grid = document.getElementById('players-board-grid');
  grid.innerHTML = '';

  activePlayers.filter(p => !p.eliminated).sort((a,b) => a.order - b.order).forEach(p => {
    grid.innerHTML += `
      <div class="player-card-node">
        ${isVotingMode ? `<div class="badge-elim" onclick="openEliminateModal('${p.name}')">Eliminate</div>` : `<div class="badge-order">${p.order}</div>`}
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

  const remainingWhite = activePlayers.filter(p => !p.eliminated && p.role === 'MR_WHITE').length;
  const remainingUndercover = activePlayers.filter(p => !p.eliminated && p.role === 'UNDERCOVER').length;

  const container = document.getElementById('elimination-options-container');
  container.innerHTML = '';

  if (remainingWhite > 0) {
    container.innerHTML += `<button class="primary-btn dark-btn" onclick="confirmElimination('MR_WHITE')">Eliminate as Mr. White 🕵️‍♂️</button>`;
  }
  if (remainingUndercover > 0) {
    container.innerHTML += `<button class="primary-btn dark-btn" onclick="confirmElimination('UNDERCOVER')">Eliminate as Undercover 🕵️</button>`;
  }

  container.innerHTML += `<button class="secondary-btn" onclick="closeEliminateModal()">Cancel</button>`;
  document.getElementById('eliminate-confirm-modal').classList.add('active');
}

function closeEliminateModal() {
  document.getElementById('eliminate-confirm-modal').classList.remove('active');
}

function confirmElimination(targetRole) {
  closeEliminateModal();
  playerToEliminate.eliminated = true;

  const icon = playerToEliminate.role === 'CIVILIAN' ? '👤' : (playerToEliminate.role === 'UNDERCOVER' ? '🕵️' : '🕵️‍♂️');
  document.getElementById('result-role-title').innerText = `${icon} ${playerToEliminate.role.replace('_', ' ')} ELIMINATED!`;
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
    winningTeam = 'INFILTRATORS';
    triggerGameOver("Mr. White guessed correctly!");
  } else {
    document.getElementById('mrwhite-wrong-modal').classList.add('active');
  }
}

function closeMrWhiteWrongModal() {
  document.getElementById('mrwhite-wrong-modal').classList.remove('active');
  checkWinConditions();
}

function checkWinConditions() {
  const remaining = activePlayers.filter(p => !p.eliminated);
  const remainingInfiltrators = remaining.filter(p => p.role === 'MR_WHITE' || p.role === 'UNDERCOVER');

  if (remainingInfiltrators.length === 0) {
    winningTeam = 'CIVILIANS';
    triggerGameOver("All Mr. Whites and Undercovers eliminated! Civilians win!");
    return;
  }

  if (remaining.length <= 2 && remainingInfiltrators.length > 0) {
    winningTeam = 'INFILTRATORS';
    triggerGameOver("Infiltrators achieved majority!");
    return;
  }

  initDescriptionBoard();
}

function triggerGameOver(message) {
  const titleText = winningTeam === 'CIVILIANS' ? "The Civilians win!" : "The Infiltrators win!";
  document.getElementById('game-over-title').innerText = titleText;
  document.getElementById('game-over-msg').innerText = message;
  document.getElementById('game-over-modal').classList.add('active');
}

function goToSummaryPage() {
  document.getElementById('game-over-modal').classList.remove('active');

  document.getElementById('summary-title').innerText = winningTeam === 'CIVILIANS' ? "The Civilians win! 🎉" : "The Infiltrators win! 🏆";
  document.getElementById('sum-civilian-word').innerText = currentWordPair.civilian;
  document.getElementById('sum-undercover-word').innerText = currentWordPair.undercover;

  const list = document.getElementById('summary-players-list');
  list.innerHTML = '';

  activePlayers.forEach(p => {
    let icon = '👤';
    if (p.role === 'UNDERCOVER') icon = '🕵️';
    if (p.role === 'MR_WHITE') icon = '🕵️‍♂️';

    const isWinner = (winningTeam === 'CIVILIANS' && p.role === 'CIVILIAN') || (winningTeam === 'INFILTRATORS' && p.role !== 'CIVILIAN');

    list.innerHTML += `
      <div class="summary-row ${isWinner ? 'winner-row' : ''} ${p.eliminated ? 'eliminated-row' : ''}">
        <div class="summary-player-info">
          <div class="avatar-bubble" style="background:${p.color}; width:36px; height:36px; font-size:14px;">${p.name[0]}</div>
          <div>
            <div style="font-weight:700; font-size:14px;">${p.name} ${p.eliminated ? '(Eliminated)' : ''}</div>
            <div style="font-size:11px; color:#64748b;">Word: ${p.word}</div>
          </div>
        </div>
        <div class="role-badge-icon">${icon}</div>
      </div>
    `;
  });

  navigateTo('page-7');
}

function navigateTo(pageId, isBack = false) {
  const currentActive = document.querySelector('.page.active');
  if (currentActive && !isBack) pageHistory.push(currentActive.id);

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function goBack() {
  if (pageHistory.length > 0) {
    navigateTo(pageHistory.pop(), true);
  } else {
    navigateTo('page-1', true);
  }
}

function confirmQuitGame() {
  if (confirm("Are you sure you want to quit the current game?")) {
    pageHistory = [];
    navigateTo('page-1');
  }
}

document.addEventListener('DOMContentLoaded', initApp);