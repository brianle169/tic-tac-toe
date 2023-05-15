// Player: each player is also an object
const Player = () => {};

// Cell: each Cell is an object, we will need multiple cells -> We apply FactoryFunction
const Cell = () => {
  const markedValue = "";
  const getMarkedValue = () => markedValue;
  return { getMarkedValue };
};

// GameBoard: the board display of the tic-tac-toe game -> We will only need ONE board, hence we use Module as an IIFE
const Gameboard = (() => {
  const rows = 3;
  const cols = 3;
  const board = [];

  // Build a board;
  for (let row = 0; row < rows; row++) {
    // Each row is an array of cells
    board[row] = [];
    for (let col = 0; col < cols; col++) {
      // Append cells inside each row
      board[row].push(Cell());
    }
  }

  const getBoard = () => board;

  return { getBoard };
})();

// GameController: used to control game logic (winning condition, check invalid input, etc.) -> We will only need ONE of this,
// hence the module pattern
const GameController = (() => {})();

// DisplayController: closely related to the web. This module will take care of DOM manipulation and interaction.
const DisplayController = (() => {})();
