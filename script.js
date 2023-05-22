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

  const cellIsFilled = (cell) => cell.getCheckStatus();

  const rowIsFilled = (row) => row.every(cellIsFilled);

  const boardIsFilled = () => board.every(rowIsFilled);

  const addPlayerMove = (row, col, mark) => {
    board[row][col].checkMark(mark);
  };

  return { getBoard, addPlayerMove, boardIsFilled };
})();

// GameController Module.
// GameController: used to control game logic (winning condition, check invalid input, etc.)
const GameController = (() => {
  const playerOne = {
    name: "Death",
    mark: "☠",
  };
  const playerTwo = {
    name: "Life",
    mark: "☻",
  };

  let currentPlayer = playerOne; // playerOne will always go first.

  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const gameEnd = () => {
    const board = GameBoard.getBoard();
  };

  const validMove = (row, col) => {
    const board = GameBoard.getBoard();
    return !board[row][col].getCheckStatus();
  };

  const playRound = (row, col, mark) => {
    if (validMove(row, col)) {
      GameBoard.addPlayerMove(row, col, mark);
      switchTurn();
    }
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
  const messageSpan = document.querySelector(".message");

  // clickHandler() callback: event handler for each cell click.
  const clickHandler = (event) => {
    const thisCellRow = event.target.dataset.row;
    const thisCellCol = event.target.dataset.column;
    const thisCellMark = GameController.getCurrentPlayer().mark;
    GameController.playRound(thisCellRow, thisCellCol, thisCellMark);
    console.log(GameBoard.boardIsFilled());
    paintBoard();
  };

  // paintBoard: render the initial game board, and add event handler to each cell.
  const paintBoard = () => {
    const board = GameBoard.getBoard(); // board in the console
    messageSpan.textContent = `${
      GameController.getCurrentPlayer().name
    }'s turn...`;
    boardDiv.innerHTML = ""; // clear board
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const cell = document.createElement("button");
        cell.textContent = board[row][col].getMarkedValue();
        cell.style.color = cell.textContent === "☠" ? "red" : "green";
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.column = col;
        boardDiv.appendChild(cell);
        cell.addEventListener("click", clickHandler);
      }
    }
  };
  paintBoard(); // Render an initial game board.
})();
