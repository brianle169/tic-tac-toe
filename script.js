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
    markedPlayer = player.getName();
    markedValue = player.getMark();
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

  const getCheckInfo = () =>
    board.map((row) => row.map((cell) => cell.getCheckStatus()));

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

  const gameWon = () => colCheck() || rowCheck() || diagCheck();
  const gameTie = () => boardIsFilled() && !gameWon();

  const checkWinner = () => {
    if (gameWon()) {
      return GameController.getCurrentPlayer().getTeam();
    }
    if (gameTie()) {
      return "Tie";
    }
    return null;
  };

  const addPlayerMove = (row, col, player) => {
    board[row][col].checkMark(player);
  };

  return {
    getBoard,
    getCheckInfo,
    clearBoard,
    addPlayerMove,
    boardIsFilled,
    checkWinner,
  };
})();

// PLayer factory function: Initiate and set player's attributes
const Player = (pTeam, pName, pMark) => {
  const team = pTeam;
  let name = pName;
  const mark = pMark;
  const getTeam = () => team;
  const getName = () => name;
  const getMark = () => mark;
  const setName = (newName) => {
    name = newName;
  };
  return { getTeam, getName, getMark, setName };
};

const AI = () => {
  // AI is also a player.
  const aiPlayer = Player("Death", "AI", "☠");
  // Benchmark to pick move
  const scores = {
    Death: 10,
    Life: -10,
    Tie: 0,
  };
  // Minimax algorithm to pick the best move possible
  const move = () => {
    const board = GameBoard.getBoard();
    const getRand = () => Math.floor(Math.random() * board.length);
    let randomRow;
    let randomCol;
    do {
      randomRow = getRand();
      randomCol = getRand();
    } while (board[randomRow][randomCol].getCheckStatus());
    GameController.playRound(randomRow, randomCol);
  };

  return { ...aiPlayer, move };
};

// GameController Module.
// GameController: used to control game logic (winning condition, check invalid input, etc.)
const GameController = (() => {
  let gameEnd;
  let winner;
  let turn;
  let currentPlayer;
  let currentTurn;
  let resultMessage;
  let aiMode;

  let playerOne = Player("Death", "Death", "☠");
  const playerTwo = Player("Life", "Life", "☻");

  const setDefaultGameState = (isAIMode) => {
    aiMode = isAIMode;
    gameEnd = false;
    winner = null;
    turn = 0;
    currentPlayer = Math.random() < 0.5 ? playerOne : playerTwo;
    if (aiMode) {
      playerOne = AI();
      currentPlayer = playerOne;
    }
    currentTurn = `${currentPlayer.getName()}'s turn to move!`;
    resultMessage = "Welcome players!";
  };

  const getCurrentPlayer = () => currentPlayer;
  const getCurrentTurnMessage = () => currentTurn;
  const getResultMessage = () => resultMessage;
  const getGameEndStatus = () => gameEnd;
  const getWinner = () => winner;
  const setPlayerName = (name1, name2) => {
    if (name1 !== "" && name2 !== "") {
      playerOne.setName(name1);
      playerTwo.setName(name2);
    }
    setDefaultGameState(false);
  };
  const switchTurn = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    currentTurn = `${currentPlayer.getName()}'s turn to move!`;
    if (aiMode && currentPlayer.getName() === "AI") {
      currentPlayer.move();
      if (gameEnd) DisplayController.finalizeGame();
      DisplayController.displayGameBoard();
    }
  };

  // Check if current player clicked on a filled cell. Returns true if valid false otherwise
  const validMove = (row, col) =>
    !GameBoard.getBoard()[row][col].getCheckStatus();

  const playRound = (row, col) => {
    resultMessage =
      ++turn >= 1 && turn < 5
        ? `Try not to die!`
        : turn >= 5
        ? `This is getting intense!`
        : "";

    // If the move is valid (no overlap) then we add move to cell.
    if (validMove(row, col)) {
      GameBoard.addPlayerMove(row, col, currentPlayer);
      winner = GameBoard.checkWinner();
      if (winner === "Tie") {
        resultMessage = `Looks like no one is dead (or alive)`;
        currentTurn = `Game ended!`;
        gameEnd = true;
        return;
      }
      if (winner !== null && winner !== "Tie") {
        resultMessage =
          winner === "Death" ? `DEATH prevails!` : "Long live humans!";
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
  const aiModeButton = document.querySelector(".toggle-ai-mode");
  let aiMode = false;

  const initiateAIMode = (event) => {
    aiMode = true;
    GameController.setDefaultGameState(aiMode);
    startGameMenu.style = "display: none";
    checkAIMoves();
    displayGameBoard();
    event.preventDefault();
  };

  const checkAIMoves = () => {
    if (GameController.getCurrentPlayer().getName() === "AI") {
      GameController.getCurrentPlayer().move();
    }
  };

  aiModeButton.addEventListener("click", initiateAIMode);

  const initiateGame = (event) => {
    // Set players names
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
    GameController.setDefaultGameState(aiMode);
    checkAIMoves();
    displayGameBoard();
  };

  const resetGame = () => {
    GameBoard.clearBoard();
    aiMode = false;
    GameController.setDefaultGameState(aiMode);
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

  const finalizeGame = () => {
    disableBoard();
    displayEndGameButtons();
    boardDiv.style.backgroundColor =
      GameController.getWinner() === "Death"
        ? "red"
        : GameController.getWinner() === "Life"
        ? "green"
        : "black";
  };

  // clickHandler() callback: event handler for each cell click.
  const clickHandler = (event) => {
    const cRow = event.target.dataset.row;
    const cCol = event.target.dataset.column;
    GameController.playRound(cRow, cCol);
    displayGameBoard();
    if (GameController.getGameEndStatus()) {
      finalizeGame();
    }
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

  return { displayGameBoard, finalizeGame };
})();
