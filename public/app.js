// Exact Categories from Image with 100 Major Word Pairs
const staticCategoriesPool = [
  {
    category: "Animals",
    pairs: [
      { civilian: "LION", undercover: "TIGER" }, { civilian: "LEOPARD", undercover: "CHEETAH" }, { civilian: "DOLPHIN", undercover: "WHALE" },
      { civilian: "EAGLE", undercover: "HAWK" }, { civilian: "DOG", undercover: "WOLF" }, { civilian: "CAT", undercover: "PANTHER" },
      { civilian: "HORSE", undercover: "DONKEY" }, { civilian: "FROG", undercover: "TOAD" }, { civilian: "ALLIGATOR", undercover: "CROCODILE" },
      { civilian: "RABBIT", undercover: "HARE" }
    ]
  },
  {
    category: "Entertainment",
    pairs: [
      { civilian: "MOVIE", undercover: "SERIES" }, { civilian: "CONCERT", undercover: "FESTIVAL" }, { civilian: "THEATER", undercover: "CINEMA" },
      { civilian: "MAGICIAN", undercover: "ILLUSIONIST" }, { civilian: "CIRCUS", undercover: "CARNIVAL" }, { civilian: "ACTOR", undercover: "DIRECTOR" },
      { civilian: "DRAMA", undercover: "COMEDY" }, { civilian: "CARTOON", undercover: "ANIME" }, { civilian: "MUSICAL", undercover: "OPERA" },
      { civilian: "TICKET", undercover: "PASS" }
    ]
  },
  {
    category: "Everyday Life",
    pairs: [
      { civilian: "ALARM", undercover: "TIMER" }, { civilian: "MIRROR", undercover: "WINDOW" }, { civilian: "SOAP", undercover: "SHAMPOO" },
      { civilian: "BED", undercover: "SOFA" }, { civilian: "WALLET", undercover: "PURSE" }, { civilian: "SHOWER", undercover: "BATH" },
      { civilian: "UMBRELLA", undercover: "RAINCOAT" }, { civilian: "KEY", undercover: "LOCK" }, { civilian: "CLOCK", undercover: "WATCH" },
      { civilian: "BLANKET", undercover: "QUILT" }
    ]
  },
  {
    category: "Food & Drink",
    pairs: [
      { civilian: "COFFEE", undercover: "TEA" }, { civilian: "APPLE", undercover: "PEAR" }, { civilian: "BURGER", undercover: "SANDWICH" },
      { civilian: "ICE CREAM", undercover: "FROZEN YOGURT" }, { civilian: "PIZZA", undercover: "PASTA" }, { civilian: "JUICE", undercover: "SMOOTHIE" },
      { civilian: "CHOCOLATE", undercover: "CANDY" }, { civilian: "CAKE", undercover: "PASTRY" }, { civilian: "RICE", undercover: "NOODLES" },
      { civilian: "BUTTER", undercover: "CHEESE" }
    ]
  },
  {
    category: "Nature",
    pairs: [
      { civilian: "RIVER", undercover: "STREAM" }, { civilian: "OCEAN", undercover: "SEA" }, { civilian: "MOUNTAIN", undercover: "HILL" },
      { civilian: "FOREST", undercover: "JUNGLE" }, { civilian: "DESERT", undercover: "SAVANNA" }, { civilian: "VOLCANO", undercover: "CANYON" },
      { civilian: "ISLAND", undercover: "PENINSULA" }, { civilian: "RAIN", undercover: "SNOW" }, { civilian: "WIND", undercover: "STORM" },
      { civilian: "SUNFLOWER", undercover: "ROSE" }
    ]
  },
  {
    category: "Objects",
    pairs: [
      { civilian: "PENCIL", undercover: "PEN" }, { civilian: "CHAIR", undercover: "STOOL" }, { civilian: "TABLE", undercover: "DESK" },
      { civilian: "SCISSORS", undercover: "KNIFE" }, { civilian: "BOTTLE", undercover: "GLASS" }, { civilian: "BAG", undercover: "BACKPACK" },
      { civilian: "LAMP", undercover: "FLASHLIGHT" }, { civilian: "BOOK", undercover: "MAGAZINE" }, { civilian: "PHONE", undercover: "TABLET" },
      { civilian: "CAMERA", undercover: "TELESCOPE" }
    ]
  },
  {
    category: "Places",
    pairs: [
      { civilian: "CASTLE", undercover: "PALACE" }, { civilian: "HOTEL", undercover: "MOTEL" }, { civilian: "PARK", undercover: "GARDEN" },
      { civilian: "SCHOOL", undercover: "COLLEGE" }, { civilian: "LIBRARY", undercover: "MUSEUM" }, { civilian: "HOSPITAL", undercover: "CLINIC" },
      { civilian: "AIRPORT", undercover: "STATION" }, { civilian: "MALL", undercover: "MARKET" }, { civilian: "BEACH", undercover: "COAST" },
      { civilian: "CITY", undercover: "VILLAGE" }
    ]
  },
  {
    category: "Professions",
    pairs: [
      { civilian: "DOCTOR", undercover: "NURSE" }, { civilian: "PILOT", undercover: "CAPTAIN" }, { civilian: "CHEF", undercover: "BAKER" },
      { civilian: "POLICE", undercover: "GUARD" }, { civilian: "TEACHER", undercover: "PROFESSOR" }, { civilian: "FIREFIGHER", undercover: "RESCUER" },
      { civilian: "LAWYER", undercover: "JUDGE" }, { civilian: "ENGINEER", undercover: "ARCHITECT" }, { civilian: "SINGER", undercover: "MUSICIAN" },
      { civilian: "FARMER", undercover: "GARDENER" }
    ]
  },
  {
    category: "Sports",
    pairs: [
      { civilian: "FOOTBALL", undercover: "RUGBY" }, { civilian: "TENNIS", undercover: "BADMINTON" }, { civilian: "BASEBALL", undercover: "CRICKET" },
      { civilian: "SWIMMING", undercover: "DIVING" }, { civilian: "SKATING", undercover: "SKIING" }, { civilian: "BOXING", undercover: "WRESTLING" },
      { civilian: "BASKETBALL", undercover: "VOLLEYBALL" }, { civilian: "GOLF", undercover: "BOWLING" }, { civilian: "RUNNING", undercover: "JOGGING" },
      { civilian: "SURFING", undercover: "SAILING" }
    ]
  },
  {
    category: "Travel",
    pairs: [
      { civilian: "PASSPORT", undercover: "VISA" }, { civilian: "SUITCASE", undercover: "DUFFEL" }, { civilian: "FLIGHT", undercover: "CRUISE" },
      { civilian: "MAP", undercover: "COMPASS" }, { civilian: "GUIDE", undercover: "TRANSLATOR" }, { civilian: "TAXI", undercover: "BUS" },
      { civilian: "TENT", undercover: "CABIN" }, { civilian: "SOUVENIR", undercover: "GIFT" }, { civilian: "RESORT", undercover: "CAMP" },
      { civilian: "TICKET", undercover: "BOARDING PASS" }
    ]
  }
];

let selectedCategories = ["All"];
let usedWordPairsHistory = new Set();
let isAIModeEnabled = true;

let unusedPairsDeck = [];
let winningTeam = ""; 
let pageHistory = [];

let groups = [
  {
    id: 'g1',
    name: 'Team 5',
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

function saveGroupsToStorage() {
  localStorage.setItem('undercover_groups', JSON.stringify(groups));
  localStorage.setItem('undercover_ai_mode', JSON.stringify(isAIModeEnabled));
}

function loadGroupsFromStorage() {
  const storedGroups = localStorage.getItem('undercover_groups');
  if (storedGroups) {
    try { groups = JSON.parse(storedGroups); } catch (e) { console.error(e); }
  }

  const storedAIMode = localStorage.getItem('undercover_ai_mode');
  if (storedAIMode !== null) {
    isAIModeEnabled = JSON.parse(storedAIMode);
    document.getElementById('ai-mode-switch').checked = isAIModeEnabled;
  }
}

function toggleAIMode(enabled) {
  isAIModeEnabled = enabled;
  saveGroupsToStorage();
}

// Category Selection Logic
function toggleCategory(catName) {
  if (catName === 'All') {
    selectedCategories = ['All'];
  } else {
    selectedCategories = selectedCategories.filter(c => c !== 'All');
    if (selectedCategories.includes(catName)) {
      selectedCategories = selectedCategories.filter(c => c !== catName);
    } else {
      selectedCategories.push(catName);
    }

    if (selectedCategories.length === 0) {
      selectedCategories = ['All'];
    }
  }

  renderCategoriesUI();
}

function renderCategoriesUI() {
  const chips = document.querySelectorAll('.category-chip');
  chips.forEach(chip => {
    const text = chip.innerText.replace('✨ ', '');
    if (selectedCategories.includes('All') && text.includes('All')) {
      chip.classList.add('active');
    } else if (!selectedCategories.includes('All') && selectedCategories.includes(text)) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

// AI / Word Pair Engine
async function getNextWordPair() {
  if (isAIModeEnabled) {
    try {
      const availableCategories = selectedCategories.includes('All') 
        ? ["Animals", "Entertainment", "Everyday Life", "Food & Drink", "Nature", "Objects", "Places", "Professions", "Sports", "Travel"]
        : selectedCategories;

      const randomCat = availableCategories[Math.floor(Math.random() * availableCategories.length)];
      
      const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(randomCat)}&max=10`);
      const data = await response.json();
      
      if (data && data.length >= 2) {
        const word1 = data[0].word.toUpperCase();
        const word2 = data[1].word.toUpperCase();
        const pairKey = `${word1}-${word2}`;

        if (!usedWordPairsHistory.has(pairKey)) {
          usedWordPairsHistory.add(pairKey);
          return { civilian: word1, undercover: word2, category: randomCat };
        }
      }
    } catch (err) {
      console.warn("AI Generation fallback to local non-repeating deck:", err);
    }
  }

  // Local Deck Fallback Mode
  if (unusedPairsDeck.length === 0) {
    staticCategoriesPool.forEach(cat => {
      if (selectedCategories.includes('All') || selectedCategories.includes(cat.category)) {
        cat.pairs.forEach(pair => {
          const pairKey = `${pair.civilian}-${pair.undercover}`;
          if (!usedWordPairsHistory.has(pairKey)) {
            unusedPairsDeck.push({ ...pair, category: cat.category });
          }
        });
      }
    });

    if (unusedPairsDeck.length === 0) {
      usedWordPairsHistory.clear();
      return getNextWordPair();
    }

    unusedPairsDeck.sort(() => Math.random() - 0.5);
  }

  const selected = unusedPairsDeck.pop();
  usedWordPairsHistory.add(`${selected.civilian}-${selected.undercover}`);
  return selected;
}

function initApp() {
  loadGroupsFromStorage();
  updateSetupUI();
  renderCategoriesUI();
}

function navigateTo(pageId, isBack = false) {
  const currentActive = document.querySelector('.page.active');
  if (currentActive && !isBack) {
    pageHistory.push(currentActive.id);
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  if (pageId === 'page-2') updateSetupUI();
  if (pageId === 'page-3') renderGroupsList();
}

function goBack() {
  if (pageHistory.length > 0) {
    const previousPage = pageHistory.pop();
    navigateTo(previousPage, true);
  } else {
    navigateTo('page-1', true);
  }
}

function confirmQuitGame() {
  if (confirm("Are you sure you want to quit the current game?")) {
    pageHistory = [];
    navigateTo('page-2');
  }
}

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
  document.getElementById('label-civilians').innerText = `👤 ${civilians} Civilians`;
  document.getElementById('label-undercover').innerText = `🕵️ ${undercoverCount} Undercover`;
  document.getElementById('label-mrwhite').innerText = `🕵️‍♂️ ${mrWhiteCount} Mr. White`;
}

function renderGroupsList() {
  const container = document.getElementById('groups-container');
  container.innerHTML = '';

  groups.forEach(group => {
    const isSelected = group.id === selectedGroupId;
    container.innerHTML += `
      <div class="group-card" style="background: white; border-radius:16px; padding:12px; margin-bottom:12px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
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
      <div class="counter-row" style="background:white; padding:8px 12px; border-radius:12px; margin-bottom:6px;">
        <span style="font-weight:700;">${p.name}</span>
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
  if (index >= 0) {
    groups[index] = editingGroup;
  } else {
    groups.push(editingGroup);
  }

  selectedGroupId = editingGroup.id;
  saveGroupsToStorage();
  navigateTo('page-3');
}

async function startGame() {
  const activeGroup = groups.find(g => g.id === selectedGroupId);
  if (!activeGroup || activeGroup.players.length < 3 || activeGroup.players.length > 20) {
    return alert("Player count must be between 3 and 20.");
  }

  let players = [...activeGroup.players].sort(() => Math.random() - 0.5);
  currentWordPair = await getNextWordPair();

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

  renderCardsGrid();
  navigateTo('page-5');
}

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

function initDescriptionBoard() {
  isVotingMode = false;
  let activeOnly = activePlayers.filter(p => !p.eliminated).sort(() => Math.random() - 0.5);

  if (activeOnly.length > 1 && activeOnly[0].role === 'MR_WHITE') {
    const nonWhiteIdx = activeOnly.findIndex(p => p.role !== 'MR_WHITE');
    if (nonWhiteIdx !== -1) {
      const temp = activeOnly[0];
      activeOnly[0] = activeOnly[nonWhiteIdx];
      activeOnly[nonWhiteIdx] = temp;
    }
  }

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

  const remainingWhite = activePlayers.filter(p => !p.eliminated && p.role === 'MR_WHITE').length;
  const remainingUndercover = activePlayers.filter(p => !p.eliminated && p.role === 'UNDERCOVER').length;

  const container = document.getElementById('elimination-options-container');
  container.innerHTML = '';

  if (remainingWhite > 0) {
    container.innerHTML += `
      <button class="primary-btn dark-btn" onclick="confirmElimination('MR_WHITE')">Eliminate as Mr. White 🕵️‍♂️</button>
    `;
  }

  if (remainingUndercover > 0) {
    container.innerHTML += `
      <button class="primary-btn dark-btn" onclick="confirmElimination('UNDERCOVER')">Eliminate as Undercover 🕵️</button>
    `;
  }

  container.innerHTML += `
    <button class="secondary-btn" onclick="closeEliminateModal()">Cancel</button>
  `;

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

// AUTOMATIC CIVILIAN WIN CONDITION
function checkWinConditions() {
  const remaining = activePlayers.filter(p => !p.eliminated);
  const remainingInfiltrators = remaining.filter(p => p.role === 'MR_WHITE' || p.role === 'UNDERCOVER');

  // Win condition: All Mr. White and Undercovers are eliminated
  if (remainingInfiltrators.length === 0) {
    winningTeam = 'CIVILIANS';
    triggerGameOver("All Infiltrators (Undercovers & Mr. Whites) eliminated! Civilians win!");
    return;
  }

  // Win condition: Infiltrators reach majority or equality
  if (remaining.length <= 2 && remainingInfiltrators.length > 0) {
    winningTeam = 'INFILTRATORS';
    triggerGameOver("Infiltrators achieved majority!");
    return;
  }

  initDescriptionBoard();
}

function triggerGameOver(message) {
  const titleText = winningTeam === 'CIVILIANS' ? "The Civilians win! 🎉" : "The Infiltrators win! 🏆";
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

document.addEventListener('DOMContentLoaded', initApp);