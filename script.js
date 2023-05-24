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
  const clearCellContent = () => {
    markedValue = "";
    markedPlayer = "";
    isChecked = false;
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
    clearCellContent,
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

  const clearBoard = () => {
    board.forEach((row) => row.forEach((cell) => cell.clearCellContent()));
  };

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

  const diagCheck = () => {
    let left = 0;
    let right = cols - 1;
    const leftDiagItems = [];
    const rightDiagItems = [];

    for (let row = 0; row < rows; row++) {
      const leftTarget = board[0][0];
      const leftTargetValue = leftTarget.getMarkedValue();
      const rightTarget = board[0][cols - 1];
      const rightTargetValue = rightTarget.getMarkedValue();

      if (!leftTarget.getCheckStatus() && !rightTarget.getCheckStatus()) {
        return false;
      }
      if (
        board[row][left].getCheckStatus() &&
        board[row][left].getMarkedValue() === leftTargetValue
      ) {
        leftDiagItems.push(leftTargetValue);
      }
      if (
        board[row][right].getCheckStatus() &&
        board[row][right].getMarkedValue() === rightTargetValue
      ) {
        rightDiagItems.push(rightTargetValue);
      }
      left++;
      right--;
    }
    if (leftDiagItems.length === rows || rightDiagItems.length === rows) {
      return true;
    }
    return false;
  };

  const addPlayerMove = (row, col, player) => {
    board[row][col].checkMark(player);
  };

  return {
    getBoard,
    clearBoard,
    addPlayerMove,
    boardIsFilled,
    rowCheck,
    colCheck,
    diagCheck,
  };
})();

// GameController Module.
// GameController: used to control game logic (winning condition, check invalid input, etc.)
const GameController = (() => {
  const playerOne = {
    team: "Death",
    name: "",
    mark: "☠",
  };
  const playerTwo = {
    team: "Life",
    name: "",
    mark: "☻",
  };
  let gameEnd;
  let winner;
  let turn;
  let currentPlayer;
  let currentTurn;
  let resultMessage;
  const setDefaultGameState = () => {
    gameEnd = false;
    winner = "";
    turn = 0;
    currentPlayer = Math.random() < 0.5 ? playerOne : playerTwo;
    currentTurn = `${currentPlayer.name}'s turn to move!`;
    resultMessage = "Welcome players!";
  };
  const getCurrentPlayer = () => currentPlayer;
  const getCurrentTurnMessage = () => currentTurn;
  const getResultMessage = () => resultMessage;
  const getGameEndStatus = () => gameEnd;
  const getWinner = () => winner;
  const setPlayerName = (name1, name2) => {
    playerOne.name = name1;
    playerTwo.name = name2;
    setDefaultGameState();
  };
  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    currentTurn = `${currentPlayer.name}'s turn to move!`;
  };

  // Check if current player clicked on a filled cell. Returns true if valid false otherwise
  const validMove = (row, col) =>
    !GameBoard.getBoard()[row][col].getCheckStatus();

  // Check whether the game ended with a win.
  const gameWon = () =>
    GameBoard.colCheck() || GameBoard.rowCheck() || GameBoard.diagCheck();

  // TIE: when the game board is filled but no one wins.
  const gameTie = () => GameBoard.boardIsFilled() && !gameWon();

  const playRound = (row, col) => {
    turn++;
    resultMessage =
      turn >= 1 && turn < 5
        ? `Try not to die!`
        : turn >= 5
        ? `This is getting intense!`
        : "";

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
          currentPlayer.team === "Death"
            ? `DEATH prevails!`
            : "Long live humans!";
        winner = currentPlayer.team;
        currentTurn = "Game ended!";
        gameEnd = true;
        return;
      }
      switchTurn();
    }
  };

  return {
    setPlayerName,
    getCurrentPlayer,
    getCurrentTurnMessage,
    getResultMessage,
    getGameEndStatus,
    getWinner,
    switchTurn,
    playRound,
    setDefaultGameState,
  };
})();

// DisplayController Module.
// DisplayController: closely related to the web. This module will take care of DOM manipulation and interaction. This will initially render the game state.
const DisplayController = (() => {
  const boardDiv = document.querySelector(".board"); // board div in HTML
  const messageDiv = document.querySelector(".message");
  const resultDiv = document.querySelector(".result-message");
  const startGameMenu = document.querySelector(".start-game");
  const playerOneInput = document.getElementById("player-one");
  const playerTwoInput = document.getElementById("player-two");
  const startButton = document.querySelector(".start");

  const initiateGame = (event) => {
    // Set players names
    console.log("submitted");
    GameController.setPlayerName(playerOneInput.value, playerTwoInput.value);
    startGameMenu.style = "display: none";
    displayGameBoard();
    event.preventDefault();
  };

  startButton.addEventListener("click", initiateGame);

  const disableBoard = () => {
    Array.from(boardDiv.childNodes).forEach((node) => {
      node.setAttribute("disabled", "");
    });
  };

  const restartGame = () => {
    GameBoard.clearBoard();
    GameController.setDefaultGameState();
    displayGameBoard();
  };

  const resetGame = () => {
    GameBoard.clearBoard();
    GameController.setDefaultGameState();
    startGameMenu.style = "display: flex";
  };

  const displayEndGameButtons = () => {
    const restartButton = document.createElement("button");
    const resetButton = document.createElement("button");

    restartButton.classList.add("restart");
    restartButton.textContent = "Play Again";
    restartButton.addEventListener("click", restartGame);

    resetButton.classList.add("resetGame");
    resetButton.textContent = "Reset Game";
    resetButton.addEventListener("click", resetGame);

    messageDiv.textContent = "";
    messageDiv.appendChild(restartButton);
    messageDiv.appendChild(resetButton);
  };

  // clickHandler() callback: event handler for each cell click.
  const clickHandler = (event) => {
    const cRow = event.target.dataset.row;
    const cCol = event.target.dataset.column;
    GameController.playRound(cRow, cCol);
    displayGameBoard();
    if (GameController.getGameEndStatus()) {
      disableBoard();
      displayEndGameButtons();
    }
    boardDiv.style.backgroundColor =
      GameController.getWinner() === "Death"
        ? "red"
        : GameController.getWinner() === "Life"
        ? "green"
        : "black";
  };

  // paintBoard: render the initial game board, and add event handler to each cell.
  const displayGameBoard = () => {
    const board = GameBoard.getBoard(); // board in the console
    boardDiv.style.backgroundColor = "black";
    boardDiv.innerHTML = ""; // clear board
    messageDiv.textContent = GameController.getCurrentTurnMessage();
    resultDiv.textContent = GameController.getResultMessage();
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
})();
