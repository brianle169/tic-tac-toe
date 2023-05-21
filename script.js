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

  const logBoard = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        console.log(board[i][j].getMarkedValue());
        console.log(board[i][j].getCheckStatus());
      }
    }
  };

  const addPlayerMove = (row, col, mark) => {
    board[row][col].checkMark(mark);
    // logBoard();
  };

  return { getBoard, addPlayerMove };
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

  const playRound = (row, col, mark) => {
    // if game is not end, and move is valid
    // update the board
    GameBoard.addPlayerMove(row, col, mark);
  };

  return {
    getCurrentPlayer,
    switchTurn,
    playRound,
  };
})();

// DisplayController Module.
// DisplayController: closely related to the web. This module will take care of DOM manipulation and interaction. This will initially render the game state.
const DisplayController = (() => {
  const boardDiv = document.querySelector(".board"); // board div in HTML

  // clickHandler() callback: event handler for each cell click.
  const clickHandler = (event) => {
    // get the clicked cell's attributes
    const thisCellRow = event.target.dataset.row; // row index
    const thisCellCol = event.target.dataset.column; // column index
    const thisCellMark = GameController.getCurrentPlayer().mark; // which player moved
    console.log(
      `Row: ${thisCellRow} - Column: ${thisCellCol} - Mark: ${thisCellMark}`
    );
    GameController.playRound(thisCellRow, thisCellCol, thisCellMark);
    paintBoard();
    GameController.switchTurn(); // switch player's turn
  };

  // drawInitialBoard: render the initial game board, and add event handler to each cell.
  const paintBoard = () => {
    const board = GameBoard.getBoard(); // board in the console
    boardDiv.innerHTML = ""; // clear board
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const cell = document.createElement("button");
        cell.textContent = board[row][col].getMarkedValue();
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.column = col;
        boardDiv.appendChild(cell);
        cell.addEventListener("click", clickHandler);
      }
    }
  };

  return { paintBoard };
})();

// Here we will call the initial render of the whole web
DisplayController.paintBoard();
