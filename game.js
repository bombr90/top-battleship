import { Ship, GameBoard, Player } from "./battleship.js";
import { display } from "./display.js";

const game = () => {
  // Private objects
  const displayPayload = {
    newShip: null,
    startCoord: [],
    endCoord: [],
  };
  let p1Grid, p2Grid;
  let playerTurn = true;

  const p1 = Player("Player");
  const p2 = Player("Computer");
  const p1Board = GameBoard();
  const p2Board = GameBoard();
  const gameDisplay = display(displayPayload, checkPayLoad);
  
  // to allow child to update board as ship pieces are placed
  function checkPayLoad(payLoad, draggable) {
    if (
      p2Board.placeShip(
        displayPayload.newShip,
        ...displayPayload.startCoord,
        ...displayPayload.endCoord
      ) === true
    ) {
      gameDisplay.hideDragShip(draggable)
      renderFleet();
      if (p2Board.getShips().length === 5) {
        gameDisplay.hideInput();
        gameDisplay.outputDisplay(`${p1.id}, Let's play battleship!`)
      }
    }
  }

  // Private methods

const until = (predFn) => {
  const poll = (done) =>
    predFn() ? done() : setTimeout(() => poll(done), 500);
  return new Promise(poll);
};

  const placeShips = () => {
    gameDisplay.setDropTarget(p2Grid);
    p1Board.autoPlaceShips();
    const sample = [5,4,3,2,1];
    for (const vals of sample) {
      gameDisplay.renderDragShips(p2Board, vals);
    }
  };

  const addBoardListeners = () => {
    const p1Cells = p1Grid.querySelectorAll(".square");
    p1Cells.forEach((cell) => {
      cell.addEventListener("click", eventAttack);
    });
  };

  const removeAllBoardListeners = () => {
    const p1Cells = p1Grid.querySelectorAll(`.square`);
    p1Cells.forEach((cell) => {
      cell.removeEventListener("click", eventAttack);
    });
  };

  const eventAttack = (el) => {
    if (playerTurn) {
      const cell = el.target;
      const id = el.target.parentNode.dataset.id;
      const coords = [cell.dataset.x, cell.dataset.y];
      if (p1.attack(coords)) {
        const status = p1Board.receiveAttack(coords);
        gameDisplay.renderCell(cell, status);
        cell.removeEventListener("click", eventAttack);
        playerTurn = false;
        if (p1Board.allShipsSunk()) {
          gameDisplay.outputDisplay(`Game over. ${p1.id} wins!`);
          removeAllBoardListeners();
          return;
        }
        const autoCoords = p2.randomCoords(p2.getRemainingMoves());
        if (p2.attack(autoCoords)) {
          const status2 = p2Board.receiveAttack(autoCoords);
          const cell2 = gameDisplay.locateCell(p2Grid, autoCoords);
          gameDisplay.renderCell(cell2, status2);
          playerTurn = true;
        } else {
          console.log("autocoords error");
          return;
        }
        if (p2Board.allShipsSunk()) {
          gameDisplay.outputDisplay(`Game over. ${p2.id} wins!`);
          removeAllBoardListeners();
          return;
        }
      }
    }
  };

  const resetGame = () => {
    p1.resetPlayer();
    p2.resetPlayer();
    p1Board.resetBoard();
    p2Board.resetBoard();
    gameDisplay.resetDisplay();
    gameDisplay.outputDisplay("");
  };

  // Public methods
  const setId = (el) => {
    const newId = gameDisplay.getId();
    if (newId) {
      gameDisplay.hideInput();
      p1.id = newId;
      gameDisplay.greetingDisplay(p1.id);
    }
  };

  const renderBoard = () => {
    p1Grid = gameDisplay.renderGrid(p1.id, p1Board.getBoard());
    p2Grid = gameDisplay.renderGrid(p2.id, p2Board.getBoard());
    gameDisplay.renderGridLabels();
  };

  const renderFleet = () => {
    gameDisplay.renderFleet(p2Grid, p2Board.getShips());
  };

  const startGame = async () => {
    playerTurn = true;
    renderBoard();
    gameDisplay.outputDisplay(`Type in your desired name (and click set) then place your ships on the board (click to rotate)`);
    placeShips();
    await until(() => p2Board.getShips().length === 5);
    addBoardListeners();
  };

  const replayGame = () => {
    resetGame();
    startGame();
  };

  return {
    setId,
    renderBoard,
    renderFleet,
    startGame,
    replayGame,
  };
}

export { game }


  