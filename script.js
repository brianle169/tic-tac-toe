// Cell Factory.
// Cell(): Used to initiate Cell objects, where each player's mark will be displayed.
const Cell = (rowIndex, colIndex) => {
  const coordinate = {
    r: rowIndex,
    c: colIndex,
  };
  let markedValue = "";
  let markedPlayer = "";
  let isChecked = false; // the current status of cell
  const checkMark = (player) => {
    markedPlayer = player.name;
    markedValue = player.mark;
    isChecked = true;
  };
  const getCoordinate = () => coordinate;
  const getMarkedValue = () => markedValue;
  const getMarkedPlayer = () => markedPlayer;
  const getCheckStatus = () => isChecked;
  return {
    getMarkedValue,
    checkMark,
    getCheckStatus,
    getCoordinate,
    getMarkedPlayer,
  };
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
      board[row].push(Cell(row, col));
    }
  }

  const getBoard = () => board;

  const rowIsFilled = (row) => row.every((cell) => cell.getCheckStatus());

  const boardIsFilled = () => board.every(rowIsFilled);

  const rowIsIdentical = (row) => {
    const result =
      rowIsFilled(row) &&
      row.every(
        (element) => element.getMarkedValue() === row[0].getMarkedValue()
      );
    return result;
  };

  const rowCheck = () => board.some(rowIsIdentical);

  const colCheck = () => {
    for (let col = 0; col < cols; col++) {
      const target = board[0][col];
      const colItems = [target.getMarkedValue()];
      if (!target.getCheckStatus()) continue;
      for (let row = 1; row < rows; row++) {
        if (board[row][col].getMarkedValue() === target.getMarkedValue()) {
          colItems.push(target.getMarkedValue);
        }
      }
      if (colItems.length === cols) {
        return true;
      }
    }
    return false;
  };

  const addPlayerMove = (row, col, player) => {
    board[row][col].checkMark(player);
  };

  return { getBoard, addPlayerMove, boardIsFilled, rowCheck, colCheck };
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
  let gameEnd = false;
  let winner = "";
  let currentPlayer = playerOne; // playerOne will always go first.
  let currentTurn = `${currentPlayer.name}'s turn to move!`;
  let resultMessage = `What an intense game!`;
  const getCurrentPlayer = () => currentPlayer;
  const getCurrentTurnMessage = () => currentTurn;
  const getResultMessage = () => resultMessage;
  const getGameEndStatus = () => gameEnd;
  const getWinner = () => winner;
  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    currentTurn = `${currentPlayer.name}'s turn to move!`;
  };

  // Check if current player clicked on a filled cell. Returns true if valid false otherwise
  const validMove = (row, col) =>
    !GameBoard.getBoard()[row][col].getCheckStatus();

  // Check whether the game ended with a win.
  const gameWon = () => GameBoard.colCheck() || GameBoard.rowCheck();

  // TIE: when the game board is filled but no one wins.
  const gameTie = () => GameBoard.boardIsFilled() && !gameWon();

  const playRound = (row, col) => {
    // If the move is valid (no overlap) then we add move to cell.
    if (validMove(row, col)) {
      GameBoard.addPlayerMove(row, col, currentPlayer);
      if (gameTie()) {
        resultMessage = `You're probably still alive lol!`;
        currentTurn = `Game ended!`;
        gameEnd = true;
        return;
      }
      if (gameWon()) {
        resultMessage =
          currentPlayer.name === "Death" ? `You're DEAD!` : "You SURVIVED!";
        winner = currentPlayer.name;
        currentTurn = "Game ended!";
        gameEnd = true;
        return;
      }
      switchTurn();
    }
  };

  return {
    getCurrentPlayer,
    getCurrentTurnMessage,
    getResultMessage,
    getGameEndStatus,
    getWinner,
    switchTurn,
    playRound,
  };
})();

// DisplayController Module.
// DisplayController: closely related to the web. This module will take care of DOM manipulation and interaction. This will initially render the game state.
const DisplayController = (() => {
  const boardDiv = document.querySelector(".board"); // board div in HTML
  const messageSpan = document.querySelector(".message");
  const resultSpan = document.querySelector(".result-message");

  const disableBoard = () => {
    Array.from(boardDiv.childNodes).forEach((node) => {
      node.setAttribute("disabled", "");
    });
  };

  // clickHandler() callback: event handler for each cell click.
  const clickHandler = (event) => {
    const cRow = event.target.dataset.row;
    const cCol = event.target.dataset.column;
    GameController.playRound(cRow, cCol);
    paintBoard();
    if (GameController.getGameEndStatus()) {
      disableBoard();
    }
  };

  // paintBoard: render the initial game board, and add event handler to each cell.
  const paintBoard = () => {
    const board = GameBoard.getBoard(); // board in the console
    boardDiv.innerHTML = ""; // clear board
    messageSpan.textContent = GameController.getCurrentTurnMessage();
    resultSpan.textContent = GameController.getResultMessage();
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
