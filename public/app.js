const socket = io();

let currentRoomCode = null;
let myPlayerId = null;
let mySecretWord = null;

// Views
const authView = document.getElementById('auth-view');
const lobbyView = document.getElementById('lobby-view');
const gameView = document.getElementById('game-view');
const votingView = document.getElementById('voting-view');
const mrwhiteView = document.getElementById('mrwhite-view');
const gameoverView = document.getElementById('gameover-view');

function showView(view) {
  [authView, lobbyView, gameView, votingView, mrwhiteView, gameoverView].forEach(v => v.classList.add('hidden'));
  view.classList.remove('hidden');
}

// Room Actions
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

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;
  socket.emit('sendMessage', { roomCode: currentRoomCode, message });
  input.value = '';
}

function updateConfig() {
  const undercoverCount = document.getElementById('config-undercover').value;
  const includeMrWhite = document.getElementById('config-mrwhite').value === 'true';
  socket.emit('updateConfig', { roomCode: currentRoomCode, undercoverCount, includeMrWhite });
}

function startGame() {
  socket.emit('startGame', { roomCode: currentRoomCode });
}

function nextTurn() {
  socket.emit('nextTurn', { roomCode: currentRoomCode });
}

function submitVote(targetId) {
  socket.emit('submitVote', { roomCode: currentRoomCode, targetId });
  document.getElementById('vote-buttons').innerHTML = `<p style="text-align:center; color:#94a3b8;">Vote registered. Waiting for others...</p>`;
}

function submitMrWhiteGuess() {
  const guessedWord = document.getElementById('mrwhite-guess-input').value.trim();
  if (!guessedWord) return alert('Enter a guess!');
  socket.emit('submitMrWhiteGuess', { roomCode: currentRoomCode, guessedWord });
}

// Socket Events
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
    document.getElementById('host-config').classList.remove('hidden');
    document.getElementById('start-btn').classList.remove('hidden');
    document.getElementById('waiting-msg').classList.add('hidden');
  } else {
    document.getElementById('host-config').classList.add('hidden');
    document.getElementById('start-btn').classList.add('hidden');
    document.getElementById('waiting-msg').classList.remove('hidden');
  }
});

socket.on('newMessage', (msg) => {
  const chatBox = document.getElementById('lobby-chat');
  chatBox.innerHTML += `<div class="chat-msg"><span class="sender">${msg.sender}:</span> ${msg.text}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
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

socket.on('mrWhiteGuessPhase', ({ mrWhiteId, mrWhiteName }) => {
  showView(mrwhiteView);
  const status = document.getElementById('mrwhite-status');
  const container = document.getElementById('mrwhite-input-container');

  if (myPlayerId === mrWhiteId) {
    status.innerText = "You were voted out as Mr. White! Guess the Civilian word to win!";
    container.classList.remove('hidden');
  } else {
    status.innerText = `${mrWhiteName} was Mr. White! They are currently trying to guess the Civilian word...`;
    container.classList.add('hidden');
  }
});

socket.on('roundContinued', ({ eliminated, room }) => {
  alert(`${eliminated.name} was voted out!`);
  showView(gameView);
  renderTurns(room);
});

socket.on('gameOver', ({ winner, eliminated, civiliansWord }) => {
  showView(gameoverView);
  document.getElementById('winner-text').innerText = `🏆 ${winner}`;
  document.getElementById('word-reveal-text').innerText = `Civilian Word was: ${civiliansWord}`;
  document.getElementById('eliminated-text').innerText = eliminated ? `Last eliminated: ${eliminated.name} (${eliminated.role})` : '';
});

socket.on('errorMsg', (msg) => alert(msg));