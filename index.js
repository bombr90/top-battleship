import { game } from "./game.js";

// Static DOM elements
const input = document.getElementById('input');
const output = document.getElementById("output");
const reset = document.getElementById("reset");
const set = document.getElementById("set");

// Create new 'game'
const currentGame = game();

reset.addEventListener('click', currentGame.replayGame)
set.addEventListener('click', currentGame.setId)
// Start game
currentGame.startGame();






