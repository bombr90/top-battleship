import { Ship, GameBoard, Player } from "./battleship.js";
import { display } from "./display.js";

const game = () => {
  // Private objects
  const gameDisplay = display();
  let p1Grid, p2Grid 
  let playerTurn = true;
  // gameDisplay.sayhello();

  const p1 = Player("User1");
  const p2 = Player("Computer");
  const p1Board = GameBoard();
  const p2Board = GameBoard();


  // Private methods
  const placeShips = () => {
    // static placement, dynamic implementation in future
    p1Board.placeShip(Ship(5), [0, 0], [0, 4]);
    p1Board.placeShip(Ship(4), [1, 0], [1, 3]);
    p1Board.placeShip(Ship(3), [2, 0], [2, 2]);
    p2Board.placeShip(Ship(5), [1, 0], [1, 4]);
    p2Board.placeShip(Ship(4), [2, 0], [2, 3]);
    p2Board.placeShip(Ship(3), [3, 0], [3, 2]);
    p2Board.placeShip(Ship(3), [5,8],[7,8])
    p2Board.placeShip(Ship(5), [3, 5], [7, 5]);

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
  }

  const eventAttack = (el) => {
    if(playerTurn){
      const cell = el.target;
      const id = el.target.parentNode.dataset.id;
      const coords = [cell.dataset.x, cell.dataset.y];
      if (p1.attack(coords)) {
        const status = p1Board.receiveAttack(coords);
        gameDisplay.renderCell(cell, status);
        cell.removeEventListener("click", eventAttack);
        playerTurn = false
        if(p1Board.allShipsSunk()) {
          console.log(`${p1.id} Winner!`)
          removeAllBoardListeners();
          return
        }
        const autoCoords = p2.randomCoords(p2.getRemainingMoves())
        if(p2.attack(autoCoords)){
          const status2 = p2Board.receiveAttack(autoCoords)
          const cell2 = gameDisplay.locateCell(p2Grid, autoCoords)
          gameDisplay.renderCell(cell2, status2)
          playerTurn = true
        } else { 
          console.log('autocoords error')
          return
        }
        if(p2Board.allShipsSunk()){
          console.log(`${p2.id} Winner!`)
          removeAllBoardListeners();
          return
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
  };

  const playGame = () => {

  }
  // Public methods

  const renderBoard = () => {
    p1Grid = gameDisplay.renderGrid(p1.id, p1Board.getBoard());
    p2Grid = gameDisplay.renderGrid(p2.id, p2Board.getBoard());
  };

  const renderFleet = () => {
    gameDisplay.renderFleet(p2Grid, p2Board.getShips());
  };

  const startGame = () => {
    playerTurn = true;
    renderBoard();
    placeShips();
    renderFleet();
    addBoardListeners();
    playGame();
  };

  const replayGame = () => {
    resetGame();
    startGame();
  };

  return {
    renderBoard,
    renderFleet,
    startGame,
    replayGame,
  };
}

export { game }


  