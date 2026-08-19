const socket = io();

let currentRoomCode = null;
let myPlayerId = null;
let mySecretWord = null;

// UI View Elements
const authView = document.getElementById('auth-view');
const lobbyView = document.getElementById('lobby-view');
const gameView = document.getElementById('game-view');
const votingView = document.getElementById('voting-view');
const gameoverView = document.getElementById('gameover-view');

function showView(view) {
  [authView, lobbyView, gameView, votingView, gameoverView].forEach(v => v.classList.add('hidden'));
  view.classList.remove('hidden');
}

// User Actions
function createRoom() {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert('Enter nickname');
  socket.emit('createRoom', { username });
}

function joinRoom() {
  const username = document.getElementById('username').value.trim();
  const roomCode = document.getElementById('room-code-input').value.trim();
  if (!username || !roomCode) return alert('Enter both nickname and room code');
  socket.emit('joinRoom', { username, roomCode });
}

function startGame() {
  socket.emit('startGame', { roomCode: currentRoomCode });
}

function nextTurn() {
  socket.emit('nextTurn', { roomCode: currentRoomCode });
}

function submitVote(targetId) {
  socket.emit('submitVote', { roomCode: currentRoomCode, targetId });
  document.getElementById('vote-buttons').innerHTML = `<p style="text-align:center">Vote registered. Waiting for others...</p>`;
}

// Socket Receivers
socket.on('roomCreated', ({ roomCode, playerId }) => {
  currentRoomCode = roomCode;
  myPlayerId = playerId;
  showView(lobbyView);
  document.getElementById('display-room-code').innerText = roomCode;
});

socket.on('roomJoined', ({ roomCode, playerId }) => {
  currentRoomCode = roomCode;
  myPlayerId = playerId;
  showView(lobbyView);
  document.getElementById('display-room-code').innerText = roomCode;
});

socket.on('updateRoom', (room) => {
  const list = document.getElementById('player-list');
  list.innerHTML = room.players.map(p => `<li>${p.name} ${p.id === room.host ? '👑 Host' : ''}</li>`).join('');
  if (room.host === myPlayerId) {
    document.getElementById('start-btn').classList.remove('hidden');
    document.getElementById('waiting-msg').classList.add('hidden');
  }
});

socket.on('gameStarted', (room) => {
  showView(gameView);
  const me = room.players.find(p => p.id === myPlayerId);
  mySecretWord = me.word;

  const secretCard = document.getElementById('secret-word-card');
  secretCard.innerText = "🔒 Hold to reveal Secret Word";
  
  secretCard.onmousedown = secretCard.ontouchstart = () => secretCard.innerText = `YOUR WORD: ${mySecretWord}`;
  secretCard.onmouseup = secretCard.ontouchend = () => secretCard.innerText = "🔒 Hold to reveal Secret Word";

  renderTurns(room);
});

socket.on('turnUpdate', ({ currentTurnIndex }) => {
  const items = document.querySelectorAll('#turn-list li');
  items.forEach((item, index) => {
    item.classList.toggle('active-turn', index === currentTurnIndex);
  });
});

function renderTurns(room) {
  const alivePlayers = room.players.filter(p => p.alive);
  const list = document.getElementById('turn-list');
  list.innerHTML = alivePlayers.map((p, i) => `
    <li class="${i === room.currentTurnIndex ? 'active-turn' : ''}">${p.name}</li>
  `).join('');
}

socket.on('startVoting', (room) => {
  showView(votingView);
  const container = document.getElementById('vote-buttons');
  const alivePlayers = room.players.filter(p => p.alive && p.id !== myPlayerId);

  container.innerHTML = alivePlayers.map(p => `
    <button onclick="submitVote('${p.id}')">Eliminate ${p.name}</button>
  `).join('');
});

socket.on('roundContinued', ({ eliminated, room }) => {
  alert(`${eliminated.name} was voted out!`);
  showView(gameView);
  renderTurns(room);
});

socket.on('gameOver', ({ winner, eliminated, room }) => {
  showView(gameoverView);
  document.getElementById('winner-text').innerText = `🏆 ${winner} WIN!`;
  document.getElementById('eliminated-text').innerText = `Final eliminated: ${eliminated.name} (${eliminated.role})`;
});

socket.on('errorMsg', (msg) => alert(msg));