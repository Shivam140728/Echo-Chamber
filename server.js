const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Word database (Civilian word vs Undercover word)
const WORD_PAIRS = [
  { civilian: "Apple", undercover: "Pear" },
  { civilian: "Laptop", undercover: "Tablet" },
  { civilian: "Coffee", undercover: "Tea" },
  { civilian: "Cat", undercover: "Dog" },
  { civilian: "Batman", undercover: "Spider-Man" },
  { civilian: "Pizza", undercover: "Burger" }
];

const rooms = {};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

io.on('connection', (socket) => {

  // CREATE ROOM
  socket.on('createRoom', ({ username }) => {
    const roomCode = generateRoomCode();
    rooms[roomCode] = {
      code: roomCode,
      host: socket.id,
      gameState: 'LOBBY', // LOBBY, PLAYING, VOTING, GAME_OVER
      players: [{ id: socket.id, name: username, alive: true, role: null, word: null, votes: 0 }],
      currentTurnIndex: 0,
      civiliansWord: "",
      undercoverWord: "",
      votingResults: {}
    };

    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, playerId: socket.id });
    io.to(roomCode).emit('updateRoom', rooms[roomCode]);
  });

  // JOIN ROOM
  socket.on('joinRoom', ({ username, roomCode }) => {
    const code = roomCode.toUpperCase();
    const room = rooms[code];

    if (!room) return socket.emit('errorMsg', 'Room not found.');
    if (room.gameState !== 'LOBBY') return socket.emit('errorMsg', 'Game already in progress.');
    if (room.players.some(p => p.name === username)) return socket.emit('errorMsg', 'Name taken.');

    room.players.push({ id: socket.id, name: username, alive: true, role: null, word: null, votes: 0 });
    socket.join(code);

    socket.emit('roomJoined', { roomCode: code, playerId: socket.id });
    io.to(code).emit('updateRoom', room);
  });

  // START GAME
  socket.on('startGame', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room || room.host !== socket.id) return;
    if (room.players.length < 3) return socket.emit('errorMsg', 'Need at least 3 players.');

    // Reset game state
    room.gameState = 'PLAYING';
    const pair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    room.civiliansWord = pair.civilian;
    room.undercoverWord = pair.undercover;

    // Distribute roles (1 Undercover, 1 Mr. White if >=4 players, rest Civilians)
    let roles = ['UNDERCOVER'];
    if (room.players.length >= 4) roles.push('MR_WHITE');
    while (roles.length < room.players.length) roles.push('CIVILIAN');
    roles = shuffle(roles);

    room.players.forEach((p, index) => {
      p.alive = true;
      p.role = roles[index];
      p.word = p.role === 'CIVILIAN' ? room.civiliansWord : (p.role === 'UNDERCOVER' ? room.undercoverWord : '??? (You are Mr. White)');
    });

    room.currentTurnIndex = 0;
    io.to(roomCode).emit('gameStarted', room);
  });

  // NEXT TURN / START VOTING
  socket.on('nextTurn', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    let alivePlayers = room.players.filter(p => p.alive);
    room.currentTurnIndex++;

    if (room.currentTurnIndex >= alivePlayers.length) {
      room.gameState = 'VOTING';
      room.votingResults = {};
      alivePlayers.forEach(p => p.votes = 0);
      io.to(roomCode).emit('startVoting', room);
    } else {
      io.to(roomCode).emit('turnUpdate', { currentTurnIndex: room.currentTurnIndex });
    }
  });

  // SUBMIT VOTE
  socket.on('submitVote', ({ roomCode, targetId }) => {
    const room = rooms[roomCode];
    if (!room || room.gameState !== 'VOTING') return;

    const target = room.players.find(p => p.id === targetId);
    if (target) target.votes += 1;

    room.votingResults[socket.id] = targetId;

    const aliveCount = room.players.filter(p => p.alive).length;
    if (Object.keys(room.votingResults).length >= aliveCount) {
      // Process Elimination
      let eliminated = room.players.filter(p => p.alive).reduce((max, p) => p.votes > max.votes ? p : max, room.players[0]);
      eliminated.alive = false;

      checkWinConditions(roomCode, eliminated);
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
    io.to(roomCode).emit('gameOver', { winner, eliminated: eliminatedPlayer, room });
  } else {
    // Next round
    room.gameState = 'PLAYING';
    room.currentTurnIndex = 0;
    io.to(roomCode).emit('roundContinued', { eliminated: eliminatedPlayer, room });
  }
}

server.listen(3000, () => console.log('Server running on http://localhost:3000'));