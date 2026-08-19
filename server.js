const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE");

const fallbackCategories = [
  { civilian: "SHOWER", undercover: "BATH" },
  { civilian: "COFFEE", undercover: "TEA" },
  { civilian: "PIZZA", undercover: "BURGER" },
  { civilian: "LAPTOP", undercover: "TABLET" },
  { civilian: "BEACH", undercover: "DESERT" }
];

let usedWordPairs = [];

let gameState = {
  players: {},
  groups: {
    "V5": { name: "V5", color: "#ff5e5e", players: ["Shivam", "Sneha", "Mahima", "Dhanush", "Anand"] }
  },
  activeGroup: null,
  phase: 'home', // 'home', 'lobby', 'groups', 'editGroup', 'cards', 'describing', 'voting', 'mrWhiteGuess', 'ended'
  round: 1,
  turnIndex: 0,
  playerOrder: [],
  cardsPicked: {},
  clues: {},
  votes: {},
  settings: {
    noRepeat: true,
    undercoverCount: 1,
    mrWhiteCount: 1,
    wordPack: "Standard"
  },
  currentPair: { civilian: "", undercover: "" },
  winnerMessage: ""
};

async function getAIWordPair() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(
      'Generate a pair of closely related words for a word-imposter party game in UPPERCASE. One "civilian" word, one "undercover" word. Return ONLY valid JSON: {"civilian": "WORD1", "undercover": "WORD2"}'
    );
    let text = response.response.text().trim().replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text);
    if (parsed.civilian && parsed.undercover) return parsed;
  } catch (e) {
    console.log("AI generation error, using fallback:", e.message);
  }
  return fallbackCategories[Math.floor(Math.random() * fallbackCategories.length)];
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinLobby', () => {
    socket.emit('updateState', gameState);
  });

  socket.on('navigatePhase', (phase) => {
    gameState.phase = phase;
    io.emit('updateState', gameState);
  });

  socket.on('selectGroup', (groupName) => {
    if (gameState.groups[groupName]) {
      gameState.activeGroup = gameState.groups[groupName];
      gameState.players = {};
      gameState.activeGroup.players.forEach((pName, idx) => {
        const fakeId = `p_${idx}_${Date.now()}`;
        gameState.players[fakeId] = { id: fakeId, name: pName, role: null, word: null, isAlive: true };
      });
    }
    io.emit('updateState', gameState);
  });

  socket.on('saveGroup', ({ groupName, color, playerList }) => {
    gameState.groups[groupName] = { name: groupName, color: color || "#3897f0", players: playerList };
    gameState.activeGroup = gameState.groups[groupName];
    gameState.players = {};
    playerList.forEach((pName, idx) => {
      const fakeId = `p_${idx}_${Date.now()}`;
      gameState.players[fakeId] = { id: fakeId, name: pName, role: null, word: null, isAlive: true };
    });
    gameState.phase = 'lobby';
    io.emit('updateState', gameState);
  });

  socket.on('updateSettings', (newSettings) => {
    gameState.settings.noRepeat = Boolean(newSettings.noRepeat);
    gameState.settings.undercoverCount = parseInt(newSettings.undercoverCount) || 0;
    gameState.settings.mrWhiteCount = parseInt(newSettings.mrWhiteCount) || 0;
    io.emit('updateState', gameState);
  });

  socket.on('startGame', async () => {
    const pIds = Object.keys(gameState.players);
    const totalPlayers = pIds.length;

    if (totalPlayers < 3) {
      socket.emit('errorMsg', 'Need at least 3 players to start!');
      return;
    }

    let selectedPair = await getAIWordPair();
    gameState.currentPair = selectedPair;

    let shuffled = [...pIds].sort(() => 0.5 - Math.random());
    let mrWhiteAssigned = 0;
    let undercoverAssigned = 0;

    shuffled.forEach(id => {
      let player = gameState.players[id];
      player.isAlive = true;

      if (mrWhiteAssigned < gameState.settings.mrWhiteCount) {
        player.role = 'mrWhite';
        player.word = '??? (You are Mr. White)';
        mrWhiteAssigned++;
      } else if (undercoverAssigned < gameState.settings.undercoverCount) {
        player.role = 'undercover';
        player.word = gameState.currentPair.undercover;
        undercoverAssigned++;
      } else {
        player.role = 'civilian';
        player.word = gameState.currentPair.civilian;
      }
    });

    gameState.phase = 'cards';
    gameState.round = 1;
    gameState.playerOrder = [...shuffled];
    gameState.turnIndex = 0;
    gameState.cardsPicked = {};
    gameState.clues = {};
    gameState.votes = {};
    io.emit('updateState', gameState);
  });

  socket.on('pickCard', (playerId) => {
    gameState.cardsPicked[playerId] = true;
    let totalAlive = Object.values(gameState.players).filter(p => p.isAlive).length;
    
    if (Object.keys(gameState.cardsPicked).length >= totalAlive) {
      gameState.phase = 'describing';
      gameState.turnIndex = 0;
    }
    io.emit('updateState', gameState);
  });

  socket.on('submitClue', (clueText) => {
    let aliveOrder = gameState.playerOrder.filter(id => gameState.players[id] && gameState.players[id].isAlive);
    let currentTurnId = aliveOrder[gameState.turnIndex];
    
    if (currentTurnId) {
      gameState.clues[currentTurnId] = clueText;
      gameState.turnIndex++;
      if (gameState.turnIndex >= aliveOrder.length) {
        gameState.phase = 'voting';
      }
    }
    io.emit('updateState', gameState);
  });

  socket.on('submitVote', (voterId, targetId) => {
    gameState.votes[voterId] = targetId;
    let alivePlayers = Object.values(gameState.players).filter(p => p.isAlive);

    if (Object.keys(gameState.votes).length >= alivePlayers.length) {
      processVotes();
    } else {
      io.emit('updateState', gameState);
    }
  });

  socket.on('mrWhiteGuess', (guess) => {
    let mrWhite = Object.values(gameState.players).find(p => p.role === 'mrWhite');
    if (guess.trim().toUpperCase() === gameState.currentPair.civilian.toUpperCase()) {
      endGame(`Mr. White (${mrWhite ? mrWhite.name : ''}) guessed "${gameState.currentPair.civilian}" correctly and wins solo!`);
    } else {
      checkWinConditions();
    }
  });
});

function processVotes() {
  let voteCounts = {};
  Object.values(gameState.votes).forEach(targetId => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });

  let maxVotes = 0;
  for (let id in voteCounts) {
    if (voteCounts[id] > maxVotes) maxVotes = voteCounts[id];
  }

  let highestVotedIds = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes);

  if (highestVotedIds.length > 1) {
    // Tie logic
    gameState.phase = 'describing';
    gameState.round++;
    gameState.turnIndex = 0;
    gameState.clues = {};
    gameState.votes = {};
    io.emit('updateState', gameState);
    return;
  }

  let eliminatedId = highestVotedIds[0];
  let eliminatedPlayer = gameState.players[eliminatedId];
  eliminatedPlayer.isAlive = false;

  if (eliminatedPlayer.role === 'mrWhite') {
    gameState.phase = 'mrWhiteGuess';
    gameState.votes = {};
    io.emit('updateState', gameState);
    return;
  }

  checkWinConditions();
}

function checkWinConditions() {
  let alivePlayers = Object.values(gameState.players).filter(p => p.isAlive);
  let aliveCivilians = alivePlayers.filter(p => p.role === 'civilian').length;
  let aliveUndercovers = alivePlayers.filter(p => p.role === 'undercover').length;
  let aliveMrWhites = alivePlayers.filter(p => p.role === 'mrWhite').length;

  let totalImposters = aliveUndercovers + aliveMrWhites;

  if (totalImposters === 0) {
    endGame("Civilians successfully eliminated all imposters! Civilians win!");
    return;
  }

  if (totalImposters >= aliveCivilians) {
    endGame("Imposters equaled or outnumbered Civilians! Imposters win!");
    return;
  }

  gameState.phase = 'describing';
  gameState.round++;
  gameState.turnIndex = 0;
  gameState.clues = {};
  gameState.votes = {};
  io.emit('updateState', gameState);
}

function endGame(msg) {
  gameState.phase = 'ended';
  gameState.winnerMessage = msg;
  io.emit('updateState', gameState);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));