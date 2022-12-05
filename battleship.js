const Ship = (shipLength) => {
  const length = shipLength
  let hits = 0
  const coords = [] 
  const getHits = () => hits
  const getCoords = () => coords
  const isSunk = () => {
    return hits >= length;
  }

  const hit = () => {
    hits++
  }

  const addCoords = ([x,y]) => {
    coords.push([x,y])
  }


  return {
    length,
    getHits,
    getCoords,
    isSunk,
    hit,
    addCoords,
  }
}

const GameBoard = () => {
  let board = Array(10).fill().map(() => Array(10).fill(null))
  const moves = []
  const ships = []

  const checkValidCoords = (...coords) => {
    return coords.every((el) => el >= 0 && el < 10);
  };

  const checkMoves = ([x,y]) => {
    return JSON.stringify(moves).includes(JSON.stringify([x,y]))
  }

  const placeShip = (newShip, startCoords, endCoords) => {
    if(!checkValidCoords(...startCoords, ...endCoords)) {
      return false
    }
    // Deep copy needed, slice shallow copy will change original 2D array
    let newBoard = JSON.parse(JSON.stringify(getBoard()));
    const currShip = Ship(newShip.length); 

    for (let i = startCoords[0]; i <= endCoords[0]; i++) {
      for (let j = startCoords[1]; j <= endCoords[1]; j++) {
        if (newBoard[i][j] !== null) {
          return false
        }
        newBoard[i][j] = ships.length+1;
        currShip.addCoords([i,j]);
      }
    }
    ships.push(currShip);
    board = JSON.parse(JSON.stringify(newBoard));
    return true;
  };

  const autoPlaceShips = () => {
    for (let i = 0; i < 5; i++) {
      const newShip = Ship(i+1)
      let loopCount = 0;
      let shipPlaced = false
      while (shipPlaced === false){
        const startCoords = [
          Math.floor(Math.random() * 9),
          Math.floor(Math.random() * 9),
        ];
        const endCoords =
          Math.floor(Math.random() * 2) === 1
            ? [startCoords[0], startCoords[1] + i]
            : [startCoords[0] + i, startCoords[1]];
        shipPlaced = placeShip(newShip, startCoords, endCoords);
        loopCount++;
        if (loopCount > 100) {
          console.log("autoplace error");
          return false;
        }
      }
    }
    return true
  };


  const getBoard = () => {
    return board;
  }

  const getMoves = () => moves

  const getShips = () => ships

  const receiveAttack = ([x, y]) => {
    if (!checkValidCoords(...[x, y]) || checkMoves([x, y])) {
      return false;
    }

    let newBoard = getBoard();
    const shipsIndex = newBoard[x][y]; 
    
    if (shipsIndex) { 
      moves.push({
        coordinates: [x, y],
        status: 'hit'
      });
      ships[shipsIndex-1].hit()

      return 'hit'
    } else {
      moves.push({
        coordinates: [x, y],
        status: 'miss',
      });
      return 'miss'
    }
  }

  const allShipsSunk = () => {
    return getShips().every( ship => ship.isSunk())
  };

  const resetBoard = () => {
    board = Array(10)
    .fill()
    .map(() => Array(10).fill(null));
    ships.splice(0, ships.length);
    moves.splice(0,moves.length);
  }

  return {
    placeShip,
    autoPlaceShips,
    getBoard,
    getMoves,
    getShips,
    receiveAttack,
    allShipsSunk,
    resetBoard,
  };
}

const Player = (name) => {
  let id = name;
  const playerMoves = [];
  let remainingMoves = [...Array(100).keys()]

  const checkValidCoords = (...coords) => {
    return coords.every((el) => el >= 0 && el < 10);
  };

  const checkMoves = ([x,y]) => {
    return JSON.stringify(playerMoves).includes(JSON.stringify([x,y]))
  }
  const convertToIndex = ([x,y]) => x*10 + y
  const convertToCoord = (el) => [(el-el%10)/10 , el%10]

  const setId = (str) => { 
    id = str
  }
  const getMoves = () => playerMoves
  const getRemainingMoves = () => remainingMoves

  const attack = ([x,y]) => {
    if (!checkValidCoords(...[x, y]) || checkMoves([x, y])) {
      return false
    }
    playerMoves.push([x,y])
    const removeIndex = remainingMoves.findIndex(el => el === convertToIndex([x,y]))
    remainingMoves.splice(removeIndex,1)
    return true;
  }

  const randomCoords = (arr) => {
    const randomIndex = Math.floor(Math.random()*arr.length)
    return convertToCoord(arr[randomIndex])
  };

  const resetPlayer = () => {
    playerMoves.splice(0,playerMoves.length)
    remainingMoves = [...Array(100).keys()];
  }

  return {
    id,
    setId,
    getMoves,
    getRemainingMoves,
    attack,
    randomCoords,
    resetPlayer,
  };
};


export { Ship, GameBoard, Player }