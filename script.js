// Cell: each Cell is an object, we will need multiple cells -> We apply FactoryFunction
const Cell = () => {
  let markedValue = "";
  let isChecked = false; // the current status of cell
  const checkMark = (player) => {
    markedValue = player;
    isChecked = true;
  };
  const getMarkedValue = () => markedValue;
  return { getMarkedValue, checkMark };
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

// DisplayController: closely related to the web. This module will take care of DOM manipulation and interaction. This will initially render the game state.
const DisplayController = (() => {
  const board = Gameboard.getBoard(); // board in the console
  const boardDiv = document.querySelector(".board"); // board div in HTML

  const displayBoard = () => {
    // for (let row = 0; row < board.length; row++) {
    //   for (let col = 0; col < board[row].length; col++) {
    //     const cell = document.createElement("button");
    //     cell.classList.add("cell");
    //     cell.dataset.row = row;
    //     cell.dataset.column = col;
    //     boardDiv.appendChild(cell);
    //   }
    // }
    console.log("hello");
  };
  return { displayBoard };
})();

// Here we will call the initial render of the whole web
DisplayController.displayBoard();
