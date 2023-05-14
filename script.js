// GameBoard factory-function, serve as a foundational container for other elements
function GameBoard() {
  const rows = 3;
  const cols = 3;
  const board = [];

  for (let row = 0; row < rows; row++) {
    board[row] = []; // Each row in the board is an array
    for (let col = 0; col < cols; col++) {
      board[row].push(Cell()); // Push a cell into each row.
    }
  }

  const getBoard = () => board;

  return { getBoard };
}

// Cell factory-function, serve as an object creator for game cells, where user will click
// to play a move
function Cell() {
  let move = "";

  const playMove = (player) => {
    move = player;
  };

  const getMove = () => move;

  return { getMove, playMove };
}
