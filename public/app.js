// 14 Game Categories
const ALL_CATEGORIES_LIST = [
  "Every day life", "Tools", "Society & Occupation", "School & Education", 
  "Work & Office", "Sports and Hobbies", "Media & Entertainment", 
  "World & Geography", "Food & Culinary", "Around the House", 
  "Animal", "Object", "Personal Electronic", "Consumer Tech"
];

let selectedCategories = [...ALL_CATEGORIES_LIST];
let geminiApiKey = "";
let lastMrWhitePlayerNames = [];

let currentSuspects = ['Player 1', 'Player 2', 'Player 3'];
let undercoverCount = 1;
let mrWhiteCount = 1;

let currentWordPair = null;
let gameCards = [];
let currentPickerIndex = 0;
let activePlayers = [];
let descriptionOrder = []; 
let isVotingMode = false;
let playerToEliminate = null;
let winningTeam = "";

function initApp() {
  loadFromStorage();
  renderSuspectsInputs();
  renderCategoriesUI();
  updateSetupUI();
}

function saveToStorage() {
  localStorage.setItem('uw_last_white', JSON.stringify(lastMrWhitePlayerNames));
  localStorage.setItem('uw_gemini_key', geminiApiKey);
}

function loadFromStorage() {
  const storedWhite = localStorage.getItem('uw_last_white');
  if (storedWhite) { try { lastMrWhitePlayerNames = JSON.parse(storedWhite); } catch(e){} }

  geminiApiKey = localStorage.getItem('uw_gemini_key') || "";
  if (document.getElementById('gemini-api-key')) {
    document.getElementById('gemini-api-key').value = geminiApiKey;
  }
}

function saveApiKey(val) {
  geminiApiKey = val.trim();
  saveToStorage();
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function renderSuspectsInputs() {
  const list = document.getElementById('suspects-inputs-list');
  if (!list) return;
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

function toggleCategory(catName) {
  if (selectedCategories.includes(catName)) {
    selectedCategories = selectedCategories.filter(c => c !== catName);
  } else {
    selectedCategories.push(catName);
  }
  renderCategoriesUI();
}

function renderCategoriesUI() {
  const container = document.getElementById('categories-grid');
  if (!container) return;
  container.innerHTML = '';
  ALL_CATEGORIES_LIST.forEach(cat => {
    const isSelected = selectedCategories.includes(cat);
    container.innerHTML += `
      <button class="cat-card ${isSelected ? 'active' : ''}" onclick="toggleCategory('${cat}')">
        <span>${cat}</span>
      </button>
    `;
  });
}

// Online Real-time AI Fetching via Gemini API (No local word storage)
async function fetchOnlineWordPair() {
  if (!geminiApiKey) {
    alert("Please enter a valid Gemini API key in the setup screen to get AI words online.");
    return null;
  }

  if (selectedCategories.length === 0) {
    selectedCategories = [...ALL_CATEGORIES_LIST];
    renderCategoriesUI();
  }

  // Select a random category from active user selections
  const chosenCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
  const randomSeed = Math.floor(Math.random() * 100000); // Random seed ensures unique responses

  const prompt = `Generate 1 completely random and unique pair of closely related secret words for an "Undercover" game.
  Category: "${chosenCategory}".
  Random Seed: ${randomSeed}.
  Make sure the civilian word and undercover word are distinct, creative, and closely related.
  Output MUST be strictly raw JSON in this format without markdown or extra explanation:
  {"civilian": "WORD1", "undercover": "WORD2"}`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const data = await res.json();
    
    if (data.error) {
      alert("Gemini API Error: " + data.error.message);
      return null;
    }

    const rawText = data.candidates[0].content.parts[0].text.trim();
    const parsed = JSON.parse(rawText);

    return { 
      civilian: parsed.civilian.toUpperCase(), 
      undercover: parsed.undercover.toUpperCase(),
      category: chosenCategory
    };
  } catch (e) {
    alert("Failed to fetch word from AI online. Please check internet connection or API key.");
    console.error("Online AI Search Error:", e);
    return null;
  }
}

async function startGame() {
  if (currentSuspects.length < 3) return alert("Minimum 3 players required.");
  if (selectedCategories.length === 0) return alert("Please select at least one category.");
  if (!geminiApiKey) return alert("Gemini API Key is required to fetch words online!");

  // Fetch brand new words online
  currentWordPair = await fetchOnlineWordPair();
  if (!currentWordPair) return; // Stop if API call failed

  let playersPool = [...currentSuspects].sort(() => Math.random() - 0.5);

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
    initDescriptionSequence();
    navigateTo('page-6');
  } else {
    renderCardsGrid();
  }
}

function initDescriptionSequence() {
  let remaining = activePlayers.filter(p => !p.eliminated);
  remaining.sort(() => Math.random() - 0.5);
  descriptionOrder = remaining;
  isVotingMode = false;
  renderBoardUI();
}

function renderBoardUI() {
  document.getElementById('board-title').innerText = isVotingMode ? "Elimination Time" : "Description Time";
  document.getElementById('board-subtitle').innerText = isVotingMode ? "Discuss and vote somebody out!" : "Describe your secret word in order.";

  const remaining = activePlayers.filter(p => !p.eliminated);
  const mwLeft = remaining.filter(p => p.role === 'MR_WHITE').length;
  const spyLeft = remaining.filter(p => p.role === 'UNDERCOVER').length;

  document.getElementById('count-mrwhite').innerText = `${mwLeft} Mr White`;
  document.getElementById('count-undercover').innerText = `${spyLeft} Spy`;

  const grid = document.getElementById('players-board-grid');
  grid.innerHTML = '';

  const displayList = descriptionOrder.filter(p => !p.eliminated);

  displayList.forEach((p, index) => {
    grid.innerHTML += `
      <div class="player-card-node">
        <div class="avatar-large">${p.name.substring(0, 2)}</div>
        <span style="font-size:11px; font-weight:700;">${p.name}</span>
        <span style="font-size:9px; color:#888; margin-top:2px;">Turn #${index + 1}</span>
        ${isVotingMode ? `<button style="background:#f96854; color:white; border:none; padding:2px 8px; border-radius:10px; font-size:9px; margin-top:4px; cursor:pointer;" onclick="openEliminateModal('${p.name}')">Eliminate</button>` : ''}
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
  document.getElementById('eliminate-confirm-modal').classList.add('active');
}

function eliminateAsRole(votedOption) {
  document.getElementById('eliminate-confirm-modal').classList.remove('active');

  if (playerToEliminate.role === 'MR_WHITE') {
    document.getElementById('mrwhite-word-input').value = '';
    document.getElementById('mrwhite-guess-modal').classList.add('active');
  } else {
    processEliminationResult();
  }
}

function submitMrWhiteGuess() {
  const guess = document.getElementById('mrwhite-word-input').value.trim().toUpperCase();
  document.getElementById('mrwhite-guess-modal').classList.remove('active');

  if (guess === currentWordPair.civilian.toUpperCase()) {
    winningTeam = 'MR_WHITE';
    triggerGameOver("Mr. White guessed the secret word correctly and won the game!");
  } else {
    playerToEliminate.eliminated = true;
    document.getElementById('result-role-title').innerText = `MR. WHITE GUESS FAILED!`;
    document.getElementById('result-avatar').innerText = playerToEliminate.name.charAt(0);
    document.getElementById('result-player-name').innerText = `${playerToEliminate.name} guessed "${guess}" incorrectly!`;
    document.getElementById('result-modal').classList.add('active');
  }
}

function processEliminationResult() {
  playerToEliminate.eliminated = true;

  document.getElementById('result-role-title').innerText = `${playerToEliminate.role} ELIMINATED!`;
  document.getElementById('result-avatar').innerText = playerToEliminate.name.charAt(0);
  document.getElementById('result-player-name').innerText = playerToEliminate.name;
  document.getElementById('result-modal').classList.add('active');
}

function handleResultModalOk() {
  document.getElementById('result-modal').classList.remove('active');
  checkWinConditions();
}

function checkWinConditions() {
  const remaining = activePlayers.filter(p => !p.eliminated);
  const remainingMrWhite = remaining.filter(p => p.role === 'MR_WHITE');
  const remainingUndercover = remaining.filter(p => p.role === 'UNDERCOVER');

  if (remainingMrWhite.length === 0 && remainingUndercover.length === 0) {
    winningTeam = 'CIVILIANS';
    triggerGameOver("Civilians Win! All Mr. Whites and Undercovers have been eliminated.");
    return;
  }

  if (remaining.length <= 2) {
    if (remainingMrWhite.length > 0) {
      winningTeam = 'MR_WHITE';
      triggerGameOver("Mr. White Wins!");
      return;
    }
    if (remainingUndercover.length > 0) {
      winningTeam = 'UNDERCOVER';
      triggerGameOver("Undercover Wins!");
      return;
    }
  }

  isVotingMode = false;
  renderBoardUI();
}

function triggerGameOver(msg) {
  document.getElementById('game-over-title').innerText = winningTeam + " Wins!";
  document.getElementById('game-over-msg').innerText = msg;
  document.getElementById('game-over-modal').classList.add('active');
}

function goToSummaryPage() {
  document.getElementById('game-over-modal').classList.remove('active');
  document.getElementById('sum-civilian-word').innerText = currentWordPair.civilian;
  document.getElementById('sum-undercover-word').innerText = currentWordPair.undercover;

  const list = document.getElementById('summary-players-list');
  list.innerHTML = '';
  activePlayers.forEach(p => {
    list.innerHTML += `
      <div class="summary-player-card">
        <div>
          <span class="p-info">${p.name}</span>
          <span class="p-role">(${p.role})</span>
        </div>
        <span class="p-word">${p.word}</span>
      </div>
    `;
  });

  navigateTo('page-7');
}

function playAgain() { startGame(); }
function confirmQuitGame() { if (confirm("Quit current game?")) navigateTo('page-1'); }

document.addEventListener('DOMContentLoaded', initApp);