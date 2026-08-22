const ALL_CATEGORIES_LIST = [
  "Animals", "Entertainment", "Everyday Life", "Food & Drink", 
  "Nature", "Objects", "Places", "Professions", "Sports", "Travel"
];

const staticCategoriesPool = [
  {
    category: "Animals",
    pairs: [
      { civilian: "LION", undercover: "TIGER" }, { civilian: "LEOPARD", undercover: "CHEETAH" },
      { civilian: "DOLPHIN", undercover: "WHALE" }, { civilian: "EAGLE", undercover: "HAWK" }
    ]
  },
  {
    category: "Entertainment",
    pairs: [
      { civilian: "MOVIE", undercover: "SERIES" }, { civilian: "CONCERT", undercover: "FESTIVAL" }
    ]
  },
  {
    category: "Everyday Life",
    pairs: [
      { civilian: "ALARM", undercover: "TIMER" }, { civilian: "MIRROR", undercover: "WINDOW" }
    ]
  },
  {
    category: "Food & Drink",
    pairs: [
      { civilian: "COFFEE", undercover: "TEA" }, { civilian: "APPLE", undercover: "PEAR" }
    ]
  },
  {
    category: "Nature",
    pairs: [
      { civilian: "RIVER", undercover: "STREAM" }, { civilian: "OCEAN", undercover: "SEA" }
    ]
  },
  {
    category: "Objects",
    pairs: [
      { civilian: "PENCIL", undercover: "PEN" }, { civilian: "CHAIR", undercover: "STOOL" }
    ]
  },
  {
    category: "Places",
    pairs: [
      { civilian: "CASTLE", undercover: "PALACE" }, { civilian: "HOTEL", undercover: "MOTEL" }
    ]
  },
  {
    category: "Professions",
    pairs: [
      { civilian: "DOCTOR", undercover: "NURSE" }, { civilian: "PILOT", undercover: "CAPTAIN" }
    ]
  },
  {
    category: "Sports",
    pairs: [
      { civilian: "FOOTBALL", undercover: "RUGBY" }, { civilian: "TENNIS", undercover: "BADMINTON" }
    ]
  },
  {
    category: "Travel",
    pairs: [
      { civilian: "PASSPORT", undercover: "VISA" }, { civilian: "SUITCASE", undercover: "DUFFEL" }
    ]
  }
];

let selectedCategories = [...ALL_CATEGORIES_LIST];
let isAIModeEnabled = true;
let lastMrWhitePlayerNames = [];

// Saved Groups Persistent Store
let groups = [
  { id: 'g1', name: 'Office', color: '#f96854', players: ['SN', 'AS', 'LA', 'AA', 'ME', 'AB'] },
  { id: 'g2', name: 'Team 5', color: '#6c5ce7', players: ['SN', 'AS', 'LA'] },
  { id: 'g3', name: 'Bangalore Friends', color: '#00b894', players: ['SN', 'AS', 'LA', 'AA', 'ME'] }
];

let currentSuspects = ['Player 1', 'Player 2', 'Player 3'];
let undercoverCount = 1;
let mrWhiteCount = 1;

let currentWordPair = null;
let gameCards = [];
let currentPickerIndex = 0;
let activePlayers = [];
let isVotingMode = false;
let playerToEliminate = null;
let winningTeam = "";

function initApp() {
  loadFromStorage();
  renderReadyTeams();
  renderSuspectsInputs();
  renderCategoriesUI();
  updateSetupUI();
}

function saveToStorage() {
  localStorage.setItem('uw_groups', JSON.stringify(groups));
  localStorage.setItem('uw_last_white', JSON.stringify(lastMrWhitePlayerNames));
}

function loadFromStorage() {
  const stored = localStorage.getItem('uw_groups');
  if (stored) {
    try { groups = JSON.parse(stored); } catch(e){}
  }
  const storedWhite = localStorage.getItem('uw_last_white');
  if (storedWhite) {
    try { lastMrWhitePlayerNames = JSON.parse(storedWhite); } catch(e){}
  }
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function openGameSetup() {
  renderSuspectsInputs();
  updateSetupUI();
  navigateTo('page-2');
}

// Renders saved groups below hero banner with Delete option
function renderReadyTeams() {
  const container = document.getElementById('ready-teams-list');
  container.innerHTML = '';
  
  if (groups.length === 0) {
    container.innerHTML = `<p style="font-size:12px; color:#888; text-align:center; padding:10px;">No saved teams yet. Start a new game to create one!</p>`;
    return;
  }

  groups.forEach(g => {
    container.innerHTML += `
      <div class="ready-team-item">
        <div class="team-main-info" onclick="loadCrewToSetup('${g.id}')">
          <div class="team-avatar-square" style="background:${g.color}">${g.name.charAt(0)}</div>
          <div>
            <h4>${g.name}</h4>
            <p>${g.players.length} players (${g.players.join(', ')})</p>
          </div>
        </div>
        <button class="delete-crew-btn" onclick="deleteCrew(event, '${g.id}')" title="Delete Team">🗑️</button>
      </div>
    `;
  });
}

// Delete group option implementation
function deleteCrew(event, groupId) {
  event.stopPropagation(); // Prevents loading the crew when clicking delete
  const team = groups.find(g => g.id === groupId);
  if (!team) return;

  if (confirm(`Are you sure you want to delete "${team.name}"?`)) {
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
    updateSetupUI();
    navigateTo('page-2');
  }
}

function renderSuspectsInputs() {
  const list = document.getElementById('suspects-inputs-list');
  list.innerHTML = '';
  currentSuspects.forEach((name, idx) => {
    const num = (idx + 1).toString().padStart(2, '0');
    list.innerHTML += `
      <div class="suspect-row">
        <span class="suspect-num">${num}</span>
        <input type="text" class="suspect-input" value="${name}" onchange="updateSuspectName(${idx}, this.value)">
        <button class="remove-btn" onclick="removeSuspect(${idx})">✕</button>
      </div>
    `;
  });
  document.getElementById('suspects-counter-badge').innerText = currentSuspects.length;
  updateSetupUI();
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

function adjustRole(role, delta) {
  const total = currentSuspects.length;
  if (role === 'undercover') undercoverCount = Math.max(0, undercoverCount + delta);
  if (role === 'mrWhite') mrWhiteCount = Math.max(0, mrWhiteCount + delta);

  if ((undercoverCount + mrWhiteCount) >= total) {
    if (role === 'undercover') undercoverCount = Math.max(0, total - mrWhiteCount - 1);
    if (role === 'mrWhite') mrWhiteCount = Math.max(0, total - undercoverCount - 1);
  }
  updateSetupUI();
}

function updateSetupUI() {
  document.getElementById('label-undercover-count').innerText = undercoverCount;
  document.getElementById('label-mrwhite-count').innerText = mrWhiteCount;
  document.getElementById('deal-summary-text').innerText = `${currentSuspects.length} players · ${undercoverCount} Spy · ${mrWhiteCount} Mr White`;
}

function toggleAllCategories() {
  if (selectedCategories.length === ALL_CATEGORIES_LIST.length) {
    selectedCategories = [];
  } else {
    selectedCategories = [...ALL_CATEGORIES_LIST];
  }
  renderCategoriesUI();
}

function toggleCategory(catName) {
  if (selectedCategories.includes(catName)) {
    selectedCategories = selectedCategories.filter(c => c !== catName);
  } else {
    selectedCategories.push(catName);
  }
  renderCategoriesUI();
}

function renderCategoriesUI() {
  const allChip = document.getElementById('cat-chip-all');
  const allLabel = document.getElementById('all-cat-label');
  const allCheck = document.getElementById('all-cat-check');

  if (selectedCategories.length === ALL_CATEGORIES_LIST.length) {
    allChip.classList.remove('unselected');
    allChip.classList.add('active');
    allLabel.innerText = "✨ All categories selected";
    allCheck.style.display = "inline";
  } else if (selectedCategories.length === 0) {
    allChip.classList.remove('active');
    allChip.classList.add('unselected');
    allLabel.innerText = "✨ Select all categories";
    allCheck.style.display = "none";
  } else {
    allChip.classList.remove('active', 'unselected');
    allLabel.innerText = `✨ ${selectedCategories.length} categories selected`;
    allCheck.style.display = "none";
  }

  document.querySelectorAll('.cat-card').forEach(card => {
    const cat = card.getAttribute('data-cat');
    if (selectedCategories.includes(cat)) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

function toggleAIMode(enabled) { isAIModeEnabled = enabled; }

async function getNextWordPair() {
  if (selectedCategories.length === 0) {
    selectedCategories = [...ALL_CATEGORIES_LIST];
    renderCategoriesUI();
  }
  const pool = staticCategoriesPool.filter(c => selectedCategories.includes(c.category));
  const cat = pool[Math.floor(Math.random() * pool.length)];
  const pair = cat.pairs[Math.floor(Math.random() * cat.pairs.length)];
  return { civilian: pair.civilian, undercover: pair.undercover };
}

async function startGame() {
  if (currentSuspects.length < 3) return alert("Minimum 3 players required.");
  if (selectedCategories.length === 0) return alert("Please select at least one category.");

  const teamName = document.getElementById('setup-team-name').value.trim() || 'Custom Crew';
  
  const existingIndex = groups.findIndex(g => g.name.toLowerCase() === teamName.toLowerCase());
  if (existingIndex >= 0) {
    groups[existingIndex].players = [...currentSuspects];
  } else {
    const colors = ['#f96854', '#6c5ce7', '#00b894', '#fdcb6e', '#e84393'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    groups.push({
      id: 'g_' + Date.now(),
      name: teamName,
      color: randomColor,
      players: [...currentSuspects]
    });
  }
  saveToStorage();
  renderReadyTeams();

  let playersPool = [...currentSuspects].sort(() => Math.random() - 0.5);
  currentWordPair = await getNextWordPair();

  let eligibleMrWhites = playersPool.filter(p => !lastMrWhitePlayerNames.includes(p));
  if (eligibleMrWhites.length < mrWhiteCount) eligibleMrWhites = playersPool;
  eligibleMrWhites.sort(() => Math.random() - 0.5);

  let chosenMrWhites = eligibleMrWhites.slice(0, mrWhiteCount);
  lastMrWhitePlayerNames = [...chosenMrWhites];
  saveToStorage();

  let remaining = playersPool.filter(p => !chosenMrWhites.includes(p));
  remaining.sort(() => Math.random() - 0.5);
  let chosenSpies = remaining.slice(0, undercoverCount);

  activePlayers = playersPool.map((pName, idx) => {
    let role = 'CIVILIAN';
    if (chosenMrWhites.includes(pName)) role = 'MR_WHITE';
    else if (chosenSpies.includes(pName)) role = 'UNDERCOVER';

    return {
      name: pName,
      role: role,
      word: role === 'CIVILIAN' ? currentWordPair.civilian : (role === 'UNDERCOVER' ? currentWordPair.undercover : 'You are Mr. White!'),
      eliminated: false,
      order: idx + 1
    };
  });

  gameCards = activePlayers.map(p => ({ ...p, used: false }));
  currentPickerIndex = 0;
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

function pickCard(idx) {
  if (gameCards[idx].used) return;
  const current = gameCards[currentPickerIndex];
  document.getElementById('modal-avatar').innerText = current.name.charAt(0);
  document.getElementById('modal-player-name').innerText = current.name;
  document.getElementById('modal-secret-word').innerText = current.word;
  gameCards[idx].used = true;
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

function initDescriptionBoard() {
  isVotingMode = false;
  renderBoardUI();
}

function renderBoardUI() {
  document.getElementById('board-title').innerText = isVotingMode ? "Elimination Time" : "Description Time";
  document.getElementById('board-subtitle').innerText = isVotingMode ? "Discuss and vote somebody out!" : "Describe your secret word in order.";

  const grid = document.getElementById('players-board-grid');
  grid.innerHTML = '';
  activePlayers.filter(p => !p.eliminated).forEach(p => {
    grid.innerHTML += `
      <div class="player-card-node">
        <div class="avatar-large">${p.name.substring(0, 2)}</div>
        <span style="font-size:11px; font-weight:700;">${p.name}</span>
        ${isVotingMode ? `<button style="background:#f96854; color:white; border:none; padding:2px 8px; border-radius:10px; font-size:9px; margin-top:4px;" onclick="openEliminateModal('${p.name}')">Eliminate</button>` : ''}
      </div>
    `;
  });
}

function toggleVoteMode() {
  isVotingMode = !isVotingMode;
  renderBoardUI();
}

function openEliminateModal(name) {
  playerToEliminate = activePlayers.find(p => p.name === name);
  document.getElementById('elim-player-title').innerText = `Eliminate ${playerToEliminate.name}?`;
  const container = document.getElementById('elimination-options-container');
  container.innerHTML = `
    <button class="dark-primary-btn" onclick="confirmElimination('MR_WHITE')">Eliminate as Mr. White 🕵️‍♂️</button>
    <button class="dark-primary-btn" onclick="confirmElimination('UNDERCOVER')">Eliminate as Spy 🕵️</button>
  `;
  document.getElementById('eliminate-confirm-modal').classList.add('active');
}

function confirmElimination(role) {
  document.getElementById('eliminate-confirm-modal').classList.remove('active');
  playerToEliminate.eliminated = true;

  document.getElementById('result-role-title').innerText = `${playerToEliminate.role} ELIMINATED!`;
  document.getElementById('result-avatar').innerText = playerToEliminate.name.charAt(0);
  document.getElementById('result-player-name').innerText = playerToEliminate.name;
  document.getElementById('result-modal').classList.add('active');
}

function handleResultModalOk() {
  document.getElementById('result-modal').classList.remove('active');
  if (playerToEliminate.role === 'MR_WHITE') {
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
    checkWinConditions();
  }
}

function checkWinConditions() {
  const remaining = activePlayers.filter(p => !p.eliminated);
  const remainingInfiltrators = remaining.filter(p => p.role === 'MR_WHITE' || p.role === 'UNDERCOVER');

  if (remainingInfiltrators.length === 0) {
    winningTeam = 'CIVILIANS';
    triggerGameOver("Civilians Win! All infiltrators eliminated.");
  } else if (remaining.length <= 1) {
    winningTeam = 'INFILTRATORS';
    triggerGameOver("Infiltrators achieved majority!");
  } else {
    initDescriptionBoard();
  }
}

function triggerGameOver(msg) {
  document.getElementById('game-over-title').innerText = winningTeam === 'CIVILIANS' ? "Civilians Win! 🎉" : "Infiltrators Win! 🏆";
  document.getElementById('game-over-msg').innerText = msg;
  document.getElementById('game-over-modal').classList.add('active');
}

function goToSummaryPage() {
  document.getElementById('game-over-modal').classList.remove('active');
  document.getElementById('summary-title').innerText = winningTeam === 'CIVILIANS' ? "Civilians Win! 🎉" : "Infiltrators Win! 🏆";
  document.getElementById('sum-civilian-word').innerText = currentWordPair.civilian;
  document.getElementById('sum-undercover-word').innerText = currentWordPair.undercover;

  const list = document.getElementById('summary-players-list');
  list.innerHTML = '';
  activePlayers.forEach(p => {
    list.innerHTML += `
      <div style="background:white; padding:10px; border-radius:12px; margin-bottom:6px; display:flex; justify-content:space-between; font-size:12px;">
        <span><strong>${p.name}</strong> (${p.role})</span>
        <span>${p.word}</span>
      </div>
    `;
  });

  navigateTo('page-7');
}

function confirmQuitGame() {
  if (confirm("Quit current game?")) navigateTo('page-1');
}

document.addEventListener('DOMContentLoaded', initApp);