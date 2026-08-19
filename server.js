const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE" });

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
 const response = await ai.models.generateContent({
 model: 'gemini-2.5-flash',
 contents: 'Generate a pair of closely related words for a word-imposter party game. One is the "civilian" word, and the other is a distinct yet closely related "undercover" word. Return ONLY valid JSON format like this: {"civilian": "Word1", "undercover": "Word2"}'
 });
 let text = response.text.trim().replace(/```json/g, '').replace(/```/g, '').trim();
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

 if (totalPlayers < 2) {
 socket.emit('errorMsg', 'Need at least 2 players to start!');
 return;
 }

 const totalSpecial = gameState.settings.undercoverCount + gameState.settings.mrWhiteCount;
 if (totalSpecial >= totalPlayers) {
 socket.emit('errorMsg', `Too many roles (${totalSpecial}) for ${totalPlayers} players! Leave room for Civilians.`);
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

 pIds.forEach(id => {
 let player = gameState.players[id];
 player.isAlive = true;

 if (mrWhiteAssigned < gameState.settings.mrWhiteCount) {
 player.role = 'mrWhite';
 player.word = '??? (Blank)';
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
 gameState.playerOrder = shuffled.sort(() => 0.5 - Math.random());
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

 let alivePlayers = Object.values(gameState.players).filter(p => p.isAlive);
 if (gameState.turnIndex >= alivePlayers.length) {
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
 if (player.role !== 'mrWhite') return;

 if (guess.trim().toLowerCase() === gameState.currentPair.civilian.toLowerCase()) {
 endGame(`Mr. White (${player.name}) guessed the correct word ("${gameState.currentPair.civilian}") and wins the game solo!`);
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

 let highestVotes = 0;
 let eliminatedId = null;
 for (let id in voteCounts) {
 if (voteCounts[id] > highestVotes) {
 highestVotes = voteCounts[id];
 eliminatedId = id;
 }
 }

 if (eliminatedId) {
 let eliminatedPlayer = gameState.players[eliminatedId];
 eliminatedPlayer.isAlive = false;

 if (eliminatedPlayer.role === 'mrWhite') {
 gameState.phase = 'mrWhiteGuess';
 gameState.votes = {};
 io.emit('updateState', gameState);
 return;
 }

 if (eliminatedPlayer.role === 'undercover') {
 endGame(`Civilians successfully found the Undercover (${eliminatedPlayer.name})! Civilians win the game!`);
 return;
 }
 }

 checkWinConditions();
}

function checkWinConditions() {
 let alivePlayers = Object.values(gameState.players).filter(p => p.isAlive);

 // Updated Rule: If only 2 players left and undercover not found -> Mr. White wins!
 if (alivePlayers.length <= 2) {
 endGame("Only 2 players left and the Undercover was not found! Mr. White wins the game!");
 return;
 }

 gameState.phase = 'describing';
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

server.listen(3000, () => console.log('Server running on http://localhost:3000'));