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
  { civilian: "Tiger", undercover: "Lion" },
  { civilian: "Coffee", undercover: "Tea" },
  { civilian: "Laptop", undercover: "Tablet" },
  { civilian: "Beach", undercover: "Desert" },
  { civilian: "Pizza", undercover: "Burger" }
];

let usedWordPairs = [];

let gameState = {
  players: {},
  phase: 'lobby',
  round: 1,
  turnIndex: 0,
  playerOrder: [],
  clues: {},
  votes: {},
  settings: {
    noRepeat: true,
    undercoverCount: 1,
    mrWhiteCount: 1
  },
  currentPair: { civilian: "", undercover: "" },
  winnerMessage: ""
};

async function getAIWordPair() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(
      'Generate a pair of closely related words for a word-imposter party game. One is the "civilian" word, and the other is a distinct yet closely related "undercover" word. Return ONLY valid JSON format like this: {"civilian": "Word1", "undercover": "Word2"}'
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

  socket.on('joinGame', (name) => {
    if (gameState.phase !== 'lobby') {
      socket.emit('errorMsg', 'Game already in progress!');
      return;
    }
    const pCount = Object.keys(gameState.players).length;
    if (pCount >= 20) {
      socket.emit('errorMsg', 'Room is full (Maximum 20 players allowed)!');
      return;
    }
    gameState.players[socket.id] = {
      id: socket.id,
      name: name || `Player_${Math.floor(Math.random()*100)}`,
      role: null,
      word: null,
      isAlive: true
    };
    io.emit('updateState', gameState);
  });

  socket.on('updateSettings', (newSettings) => {
    if (gameState.phase !== 'lobby') return;
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

    const totalSpecial = gameState.settings.undercoverCount + gameState.settings.mrWhiteCount;
    if (totalSpecial >= totalPlayers) {
      socket.emit('errorMsg', `Too many special roles (${totalSpecial}) for ${totalPlayers} players! Leave room for Civilians.`);
      return;
    }

    let selectedPair;
    let attempts = 0;
    while (attempts < 5) {
      selectedPair = await getAIWordPair();
      if (!gameState.settings.noRepeat || !usedWordPairs.includes(selectedPair.civilian)) break;
      attempts++;
    }
    if (gameState.settings.noRepeat) usedWordPairs.push(selectedPair.civilian);
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

    gameState.phase = 'describing';
    gameState.round = 1;
    gameState.playerOrder = [...shuffled].sort(() => 0.5 - Math.random());
    gameState.turnIndex = 0;
    gameState.clues = {};
    gameState.votes = {};
    io.emit('updateState', gameState);
  });

  socket.on('submitClue', (clueText) => {
    const player = gameState.players[socket.id];
    if (!player || !player.isAlive) return;

    gameState.clues[socket.id] = clueText;
    gameState.turnIndex++;

    let aliveOrder = gameState.playerOrder.filter(id => gameState.players[id] && gameState.players[id].isAlive);
    if (gameState.turnIndex >= aliveOrder.length) {
      gameState.phase = 'voting';
    }
    io.emit('updateState', gameState);
  });

  socket.on('submitVote', (targetId) => {
    const voter = gameState.players[socket.id];
    if (!voter || !voter.isAlive) return;

    gameState.votes[socket.id] = targetId;
    let alivePlayers = Object.values(gameState.players).filter(p => p.isAlive);

    if (Object.keys(gameState.votes).length === alivePlayers.length) {
      processVotes();
    } else {
      io.emit('updateState', gameState);
    }
  });

  socket.on('mrWhiteGuess', (guess) => {
    const player = gameState.players[socket.id];
    if (!player || player.role !== 'mrWhite') return;

    if (guess.trim().toLowerCase() === gameState.currentPair.civilian.toLowerCase()) {
      endGame(`Mr. White (${player.name}) guessed the correct word ("${gameState.currentPair.civilian}") and wins the game!`);
    } else {
      player.isAlive = false;
      checkWinConditions();
    }
  });

  socket.on('disconnect', () => {
    delete gameState.players[socket.id];
    if (Object.keys(gameState.players).length === 0) gameState.phase = 'lobby';
    io.emit('updateState', gameState);
  });
});

function processVotes() {
  let voteCounts = {};
  Object.values(gameState.votes).forEach(targetId => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });

  let maxVotes = 0;
  for (let id in voteCounts) {
    if (voteCounts[id] > maxVotes) {
      maxVotes = voteCounts[id];
    }
  }

  let highestVotedIds = Object.keys(voteCounts).filter(id => voteCounts[id] === maxVotes);

  // If tie, no one is eliminated this round
  if (highestVotedIds.length > 1) {
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

  // Win Condition 1: Civilians win when all Imposters (Undercover + Mr. White) are dead
  if (totalImposters === 0) {
    endGame("Civilians successfully eliminated all imposters! Civilians win the game!");
    return;
  }

  // Win Condition 2: Imposters win when their number is equal to or greater than active Civilians
  if (totalImposters >= aliveCivilians) {
    endGame("Imposters (Undercover & Mr. White) equaled or outnumbered Civilians! Imposters win!");
    return;
  }

  // Continue to next round
  gameState.phase = 'describing';
  gameState.round++;
  gameState.turnIndex = 0;
  gameState.playerOrder = alivePlayers.map(p => p.id).sort(() => 0.5 - Math.random());
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