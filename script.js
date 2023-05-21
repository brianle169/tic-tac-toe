// Cell Factory.
// Cell(): Used to initiate Cell objects, where each player's mark will be displayed.
const Cell = () => {
  let markedValue = "";
  let isChecked = false; // the current status of cell
  const checkMark = (player) => {
    markedValue = player;
    isChecked = true;
  };
  const getMarkedValue = () => markedValue;
  const getCheckStatus = () => isChecked;
  return { getMarkedValue, checkMark, getCheckStatus };
};

// GameBoard Module.
// GameBoard(): the board display of the tic-tac-toe game -> We will only need ONE board, hence we use Module as an IIFE
const GameBoard = (() => {
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

  const addMark = (row, col, mark) => {
    board[row][col].checkMark(mark);
  };

  return { getBoard };
})();

// GameController Module.
// GameController: used to control game logic (winning condition, check invalid input, etc.)
const GameController = (() => {
  const playerOne = {
    name: "Player 1",
    mark: "☠",
  };
  const playerTwo = {
    name: "Player 2",
    mark: "☻",
  };

  let currentPlayer = playerOne; // playerOne will always go first.

  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const validMove = () => {};

  return {
    getCurrentPlayer,
    switchTurn,
  };
})();

// DisplayController Module.
// DisplayController: closely related to the web. This module will take care of DOM manipulation and interaction. This will initially render the game state.
const DisplayController = (() => {
  const board = GameBoard.getBoard(); // board in the console
  const boardDiv = document.querySelector(".board"); // board div in HTML
  const XMark = "☠";
  const OMark = "☻";

  // playRound() callback: event handler for each cell click.
  const playRound = (event) => {
    const thisCellRow = event.target.dataset.row;
    const thisCellCol = event.target.dataset.column;
    const thisCellMark = event.target.textContent;
    // const thisCellMark = GameController.getCurrentPlayer().mark;
    console.log(
      `Row: ${thisCellRow} - Column: ${thisCellCol} - Mark: ${thisCellMark}`
    );
    // GameBoard.addMark(
    //   thisCellRow,
    //   thisCellCol,
    //   GameController.getCurrentPlayer().mark
    // );
  };

  // displayBoard(): append cells to game board. Update board after each round.
  const displayBoard = () => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const cell = document.createElement("button");
        cell.textContent = Math.random() < 0.5 ? XMark : OMark; // Testing
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.column = col;
        boardDiv.appendChild(cell);
        cell.addEventListener("click", playRound);
      }
    }
  };

  return { displayBoard };
})();

// Here we will call the initial render of the whole web
DisplayController.displayBoard();
