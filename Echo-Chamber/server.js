const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const WORD_PAIRS = [
  { civilian: "Apple", undercover: "Pear" },
  { civilian: "Laptop", undercover: "Tablet" },
  { civilian: "Coffee", undercover: "Tea" },
  { civilian: "Batman", undercover: "Spider-Man" },
  { civilian: "Pizza", undercover: "Burger" },
  { civilian: "Guitar", undercover: "Violin" }
];

const rooms = {};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

io.on('connection', (socket) => {

  // FEATURE: CREATE ROOM
  socket.on('createRoom', ({ username }) => {
    const roomCode = generateRoomCode();
    rooms[roomCode] = {
      code: roomCode,
      host: socket.id,
      gameState: 'LOBBY', // LOBBY, PLAYING, VOTING, GUESS_WORD, GAME_OVER
      players: [{ id: socket.id, name: username, alive: true, role: null, word: null, votes: 0 }],
      currentTurnIndex: 0,
      civiliansWord: "",
      undercoverWord: "",
      undercoverCount: 1, // Default host config
      includeMrWhite: true,
      votes: {},
      pendingElimination: null,
      messages: []
    };

    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, playerId: socket.id });
    io.to(roomCode).emit('updateRoom', rooms[roomCode]);
  });

  // FEATURE: JOIN ROOM
  socket.on('joinRoom', ({ username, roomCode }) => {
    const code = roomCode.toUpperCase();
    const room = rooms[code];

    if (!room) return socket.emit('errorMsg', 'Room not found.');
    if (room.gameState !== 'LOBBY') return socket.emit('errorMsg', 'Game already in progress.');
    if (room.players.some(p => p.name === username)) return socket.emit('errorMsg', 'Username taken in this room.');

    room.players.push({ id: socket.id, name: username, alive: true, role: null, word: null, votes: 0 });
    socket.join(code);

    socket.emit('roomJoined', { roomCode: code, playerId: socket.id });
    io.to(code).emit('updateRoom', room);
  });

  // FEATURE: REAL-TIME MESSAGING
  socket.on('sendMessage', ({ roomCode, message }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const msgData = { sender: player.name, text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    room.messages.push(msgData);
    io.to(roomCode).emit('newMessage', msgData);
  });

  // FEATURE: GAME SETUP CONFIGURATION BY HOST
  socket.on('updateConfig', ({ roomCode, undercoverCount, includeMrWhite }) => {
    const room = rooms[roomCode];
    if (!room || room.host !== socket.id) return;

    room.undercoverCount = parseInt(undercoverCount) || 1;
    room.includeMrWhite = Boolean(includeMrWhite);
    io.to(roomCode).emit('updateRoom', room);
  });

  // FEATURE: START GAME & ROLE ASSIGNMENT
  socket.on('startGame', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room || room.host !== socket.id) return;
    
    const totalPlayers = room.players.length;
    const requiredSpecial = room.undercoverCount + (room.includeMrWhite ? 1 : 0);
    
    if (totalPlayers <= requiredSpecial) {
      return socket.emit('errorMsg', `Need more players! Total players must exceed Undercovers + Mr. White (${requiredSpecial}).`);
    }

    room.gameState = 'PLAYING';
    const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    room.civiliansWord = pair.civilian;
    room.undercoverWord = pair.undercover;

    // Generate roles list based on settings
    let roles = [];
    for (let i = 0; i < room.undercoverCount; i++) roles.push('UNDERCOVER');
    if (room.includeMrWhite) roles.push('MR_WHITE');
    while (roles.length < totalPlayers) roles.push('CIVILIAN');
    
    roles = shuffle(roles);

    room.players.forEach((p, index) => {
      p.alive = true;
      p.role = roles[index];
      p.word = p.role === 'CIVILIAN' ? room.civiliansWord : (p.role === 'UNDERCOVER' ? room.undercoverWord : '??? (Mr. White)');
    });

    room.currentTurnIndex = 0;
    io.to(roomCode).emit('gameStarted', room);
  });

  // TURN TRACKING
  socket.on('nextTurn', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const alivePlayers = room.players.filter(p => p.alive);
    room.currentTurnIndex++;

    if (room.currentTurnIndex >= alivePlayers.length) {
      room.gameState = 'VOTING';
      room.votes = {};
      alivePlayers.forEach(p => p.votes = 0);
      io.to(roomCode).emit('startVoting', room);
    } else {
      io.to(roomCode).emit('turnUpdate', { currentTurnIndex: room.currentTurnIndex });
    }
  });

  // FEATURE: VOTING
  socket.on('submitVote', ({ roomCode, targetId }) => {
    const room = rooms[roomCode];
    if (!room || room.gameState !== 'VOTING') return;

    const voter = room.players.find(p => p.id === socket.id);
    if (!voter || !voter.alive) return;

    room.votes[socket.id] = targetId;

    const alivePlayers = room.players.filter(p => p.alive);
    if (Object.keys(room.votes).length >= alivePlayers.length) {
      // Calculate votes
      alivePlayers.forEach(p => p.votes = 0);
      Object.values(room.votes).forEach(tId => {
        const target = room.players.find(p => p.id === tId);
        if (target) target.votes++;
      });

      let eliminated = alivePlayers.reduce((max, p) => p.votes > max.votes ? p : max, alivePlayers[0]);
      
      // FEATURE: MR. WHITE GUESS WORD OPPORTUNITY
      if (eliminated.role === 'MR_WHITE') {
        eliminated.alive = false;
        room.pendingElimination = eliminated;
        room.gameState = 'GUESS_WORD';
        io.to(roomCode).emit('mrWhiteGuessPhase', { mrWhiteId: eliminated.id, mrWhiteName: eliminated.name, room });
      } else {
        eliminated.alive = false;
        checkWinConditions(roomCode, eliminated);
      }
    }
  });

  // FEATURE: MR. WHITE SUBMIT GUESS
  socket.on('submitMrWhiteGuess', ({ roomCode, guessedWord }) => {
    const room = rooms[roomCode];
    if (!room || room.gameState !== 'GUESS_WORD') return;

    const isCorrect = guessedWord.trim().toLowerCase() === room.civiliansWord.toLowerCase();

    if (isCorrect) {
      room.gameState = 'GAME_OVER';
      io.to(roomCode).emit('gameOver', { 
        winner: 'MR. WHITE (Guessed Word Correctly!)', 
        eliminated: room.pendingElimination, 
        civiliansWord: room.civiliansWord,
        room 
      });
    } else {
      checkWinConditions(roomCode, room.pendingElimination);
    }
  });

  // DISCONNECT HANDLER
  socket.on('disconnect', () => {
    for (let code in rooms) {
      const room = rooms[code];
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) {
        delete rooms[code];
      } else {
        if (room.host === socket.id) room.host = room.players[0].id;
        io.to(code).emit('updateRoom', room);
      }
    }
  });
});

function checkWinConditions(roomCode, eliminatedPlayer) {
  const room = rooms[roomCode];
  const alive = room.players.filter(p => p.alive);
  const aliveImp = alive.filter(p => p.role === 'UNDERCOVER' || p.role === 'MR_WHITE');
  const aliveCiv = alive.filter(p => p.role === 'CIVILIAN');

  let winner = null;

  if (aliveImp.length === 0) {
    winner = "CIVILIANS";
  } else if (aliveImp.length >= aliveCiv.length) {
    winner = "IMPOSTORS (Undercover/Mr. White)";
  }

  if (winner) {
    room.gameState = 'GAME_OVER';
    io.to(roomCode).emit('gameOver', { winner, eliminated: eliminatedPlayer, civiliansWord: room.civiliansWord, room });
  } else {
    room.gameState = 'PLAYING';
    room.currentTurnIndex = 0;
    io.to(roomCode).emit('roundContinued', { eliminated: eliminatedPlayer, room });
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));