"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// variables to reset: board, currPlayer, htmlBoard

// set instance of Game
// add eventListener to button which runs instance of game
// within instance, handle clicks

// if you want to call a method within a class you have to set it to this in constructor
// FOR EVERY METHOD THAT CALLS ANOTHER METHOD INSIDE A CLASS IT MUST BE PRECEEDED WITH KEYWORD THIS.

class Game {
  constructor(p1, p2, height= 6, width= 7) {
    this.height = height;
    this.width = width;
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.board = [];
    this.handleClick = this.handleClick.bind(this);
    this.button = document.querySelector(".button");

    // had an error because we put this.handleClick() here, but we don't want to run that function at start

    // execute functions in the constructor
    // when you put new Class, it will CALL THE CONSTRUCTOR
    // put functions in constructor if you want to call it immediately
    this.makeBoard();
    this.makeHtmlBoard();

  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) { // does this.height work?
      this.board.push(Array.from({ length: this.width })); // ^ for this.width?
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    // this will reset the HTML board to start from scratch again!

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  // event listener will need bind

  handleClick(evt) {


    // have to put this in front of this for the event listener
    // get x from ID of clicked cell

    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    // have to put this in front of findSpotForCol because we want to call it now!

    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.color} player won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    console.log(this.players)
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
  //  piece.classList.add(`p${this.currPlayer}`);   don't need this anymore because we don't have the background color in css, it's in JS now
    piece.style.background = this.currPlayer.color
    piece.style.top = -50 * (y + 2);
    // only assigning background color to one player right now
    // this was happening because the logic for changing currPlayer was based on a number,
    // instead of it being p1 or p2. the logic was changed in line 110

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    let top = document.querySelector("#column-top");
    top.removeEventListener('click', this.handleClick);
    // removing event listener with this.handleClick.bind(this) does not work because it is an anonymous function that
    // can't be repeated. (it works in addEventListener but not remove)
    // so you have to set this.handleClick.bind(this) to a variable in constructor
    alert(msg);
  }

  checkForWin() {
     const _win = (cells) => { //arrow function to keep this value from above 
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

let button = document.querySelector(".button");
button.addEventListener("click", function() {
  let p1 = new Player(document.querySelector("#p1").value);
  let p2 = new Player(document.querySelector("#p2").value);
  new Game(p1, p2)
})

class Player {
  constructor(color) {
    this.color = color;
  }
}



// const WIDTH = 7;
// const HEIGHT = 6;

// let currPlayer = 1; // active player: 1 or 2
// let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

/*function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
} */

/** makeHtmlBoard: make HTML table and row of column tops. */

/* function makeHtmlBoard() {
  const board = document.getElementById('board');

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);

  // make main part of board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
} */

/** findSpotForCol: given column x, return top empty y (null if filled) */

/* function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
} */

/** placeInTable: update DOM to place piece into HTML table of board */

/* function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
} */

/** endGame: announce game end */

/* function endGame(msg) {
  alert(msg);
} */

/** handleClick: handle click of column top to play piece */

/* function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
} */

/** checkForWin: check board cell-by-cell for "does a win start here?" */

/* function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
} */

// makeBoard();
// makeHtmlBoard();
// don't need these anymore