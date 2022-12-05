import { Ship, GameBoard, Player } from "./battleship.js"

// Ship factory function tests
describe("Ship factory tests", () => {
  
  const len = 7
  const testShip = Ship(len);

  describe("Check factory function produces correct properties and default values", () => {
    test("check overall object properties and properties and confirm length matches", () => {
      expect(testShip).toMatchObject({
        length: len,
        getHits: expect.any(Function),
        getCoords: expect.any(Function),
        isSunk: expect.any(Function),
        hit: expect.any(Function),
        addCoords: expect.any(Function),
      });
    });
  });

  describe("hit() function", () => {
    test("Check that testShip.getHits returns 0 (1)", () => {
      expect(testShip.getHits()).toEqual(0);
    });

    test("Check that testShip.getHits returns an updated hit count after the ship is hit once (2)", () => {
      testShip.hit();
      expect(testShip.getHits()).toEqual(1);
    });
  });
  
  describe("isSunk() function", () => {
    const testShip2 = Ship(len);
    test("Zero hits are inadequate to sink the ship (1)", () => {
      expect(testShip2.isSunk()).toBe(false);
    });
    test("Single hit (for length > 1) is not adequate to sink the ship (2)", () => {
      testShip2.hit();
      expect(testShip2.isSunk()).toBe(false);
    });
    test("Hits = length are adequate to sink the ship (3)", () => {
      for(let i = 1; i<len; i++) {
        testShip2.hit();
      }
      expect(testShip2.isSunk()).toBe(true);
    });
  });

  describe("addCoords() function", () => {
    const testShip3 = Ship(len)
    
    test("Check that testShip.addCoords([1,1]) populates ", () => {
      testShip3.addCoords([1, 1]);
      expect(testShip3.getCoords()).toEqual([[1,1]]);
    });
  });

});

// Gameboard factory function tests
describe('Gameboard factory tests', () => {
  describe("Check factory function produces correct properties and default values", () => {
    
    test("check overall object properties and properties", () => {
      const testBoard = GameBoard();
      expect(testBoard).toMatchObject({
        autoPlaceShips: expect.any(Function),
        placeShip: expect.any(Function),
        getBoard: expect.any(Function),
        getMoves: expect.any(Function),
        getShips: expect.any(Function),
        receiveAttack: expect.any(Function),
        allShipsSunk: expect.any(Function),
        resetBoard: expect.any(Function),
      });
    });
  });

  describe("placeShip() function", () => {    
    test("Check that testBoard.placeShip updates board array for valid placement (1)", () => {
      const testBoard = new GameBoard;
      const sampleBoard = Array(10)
        .fill()
        .map(() => Array(10).fill(null));
      for (let i = 0; i < 3; i++) {
        sampleBoard[i][0] = 1;
      }
      expect(testBoard.placeShip(Ship(3), [0, 0], [2, 0])).toEqual(true);
      testBoard.placeShip(Ship(3), [0, 0], [2, 0]);
      expect(testBoard.getBoard()).toEqual(sampleBoard)

    });
    test("Check that testBoard.placeShip does not update board array for invalid placement (out of bounds) (2)", () => {
      const testBoard = GameBoard();
      expect(testBoard.placeShip(Ship(3), [0, 0], [0, -2])).toEqual(false);
    });
    test("Check that testBoard.placeShip updates board array for invalid placement (overlapping ships) (3)", () => {
      const testBoard = GameBoard();
      testBoard.placeShip(Ship(3), [0, 0], [2, 0]);
      expect(testBoard.placeShip(Ship(2), [0, 0], [0, 2])).toEqual(false);
    });
  });
  
  describe("getBoard() function", () => {
    test("Check that testBoard.getBoard() returns a 10x10 null array on a new board (1)", () => {
      const testBoard = GameBoard();
      const sampleBoard = Array(10)
        .fill()
        .map(() => Array(10).fill(null));
      expect(testBoard.getBoard()).toEqual(sampleBoard)
    })
  })
  describe("getMoves() function", () => {
    test("Check that testBoard.getMove() returns an array (1)", () => {
      const testBoard = GameBoard();
      expect(testBoard.getMoves()).toEqual([])
    });
  })
  describe("getShips() function", () => {
    test("Check that testBoard.getShips() returns array (1)", () => {
      const testBoard = GameBoard();
      expect(testBoard.getShips()).toEqual([])
    });
  })
  
    describe("receiveAttack() function", () => {
      const testBoard = GameBoard();
      testBoard.placeShip(Ship(2), [3, 3], [3, 4]); // [3,3], [3,4]
      testBoard.placeShip(Ship(3), [0, 0], [2, 0]); // [0,0], [1,0], [2,0]]

      test("receiveAttack(coords) results in a 'hit' at [2,0] and updates moves and ships arrays", () => {
        expect(testBoard.receiveAttack([2, 0])).toBe('hit');
        const testObj = {
          coordinates: [2,0],
          status: 'hit',
        }
        expect(testBoard.getMoves().length).toBe(1);
        expect(testBoard.getMoves()[0]).toMatchObject(testObj);
        expect(testBoard.getShips()[1].getHits()).toEqual(1)
      });
      test("receiveAttack(coords) results in a 'miss' [1,1]", () => {
        expect(testBoard.receiveAttack([1, 1])).toBe("miss");
        const testObj = {
          coordinates: [1, 1],
          status: 'miss',
        };
        expect(testBoard.getMoves().length).toBe(2);
        expect(testBoard.getMoves()[1]).toMatchObject(testObj);
      });
      test("receiveAttack(coords) returns false (duplicate move)", () => {
        expect(testBoard.receiveAttack([1, 1])).toBe(false);
        expect(testBoard.getMoves().length).toBe(2);
      });
    })
    describe("allShipsSunk() function", () => {
      const testBoard = GameBoard();
      testBoard.placeShip(Ship(2), [3, 3], [3, 4]); // [3,3], [3,4]
      testBoard.placeShip(Ship(3), [0, 0], [2, 0]); // [0,0], [1,0], [2,0]]
      test("allShipsSunk() to report false when no ships sunk", () => {
        expect(testBoard.allShipsSunk()).toBe(false);
      });
      test("allShipsSunk() to report false when some ships sunk", () => {
        // sink first ship
        testBoard.receiveAttack([3, 3]);
        testBoard.receiveAttack([3, 4]);
        expect(testBoard.allShipsSunk()).toBe(false);
      });
      test("allShipsSunk() to report true when all ships sunk", () => {
        // sink second ship
        testBoard.receiveAttack([0, 0]);
        testBoard.receiveAttack([1, 0]);
        testBoard.receiveAttack([2, 0]);
        expect(testBoard.allShipsSunk()).toBe(true);
      });
    });

    describe("resetBoard() function", () => {
      const testBoard = GameBoard();
      const newBoard = Array(10)
        .fill()
        .map(() => Array(10).fill(null));
      test("resetBoard() to clear board, ships and moves arrays", () => {
        testBoard.placeShip(Ship(2), [3, 3], [3, 4]); // [3,3], [3,4]
        testBoard.placeShip(Ship(3), [0, 0], [2, 0]); // [0,0], [1,0], [2,0]]
        testBoard.receiveAttack([2, 0]);
        testBoard.receiveAttack([1, 1]);

        testBoard.resetBoard();
        expect(testBoard.getBoard()).toEqual(newBoard);
        expect(testBoard.getMoves().length).toBe(0);
        expect(testBoard.getShips().length).toBe(0);
      });
    });
  })

  // Ship factory function tests
describe("Player factory tests", () => {
  describe("Check factory function produces correct properties and default values", () => {
    const testPlayer = Player('test')
    test("check overall object properties and properties", () => {
      expect(testPlayer).toMatchObject({
        id: "test",
        setId: expect.any(Function),
        getMoves: expect.any(Function),
        getRemainingMoves: expect.any(Function),
        attack: expect.any(Function),
        randomCoords: expect.any(Function),
        resetPlayer: expect.any(Function),
      });
    });
  });
  describe("getMoves() function", () => {
    const testPlayer = Player("test")
    test("check getMoves() returns initialized array", () => {
      expect(testPlayer.getMoves()).toEqual([]);
    })
  })
  describe("getRemainingMoves() function", () => {
    const testPlayer = Player("test");
    test("check getRemainingMoves() returns initialized array of 100 elements", () => {
      expect(testPlayer.getRemainingMoves()).toEqual([...Array(100).keys()])
    });
  });
  describe("attack() function", () => {
    const testPlayer = Player("test")
    test("check attack() returns true for valid attack [1,0]", () => {
      const testIndex = 10
      expect(testPlayer.getRemainingMoves()).toContain(testIndex);
      expect(testPlayer.attack([1,0])).toBe(true);
      expect(testPlayer.getMoves()).toEqual([[1,0]]);
      expect(testPlayer.getRemainingMoves()).not.toContain(testIndex)

    });
    test("check attack() returns false for invalid coord attack [-1,0]", () => {
      expect(testPlayer.attack([-1, 0])).toBe(false);
    });
    test("check attack() returns false for duplicate coord attack [1,0]", () => {
      expect(testPlayer.getMoves()).toEqual([[1, 0]]);
      expect(testPlayer.attack([1, 0])).toBe(false);
    }); 
  });
  describe("randomCoords(arr) function", () => {
    const testPlayer = Player("test")
    test("check randomCoords(arr) returns random element from an array", () => {
      const testArr = [0,1,2,3,99]
      const randomTestCoords = testPlayer.randomCoords(testArr);
      const testCoords = [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [9, 9],
      ];
      expect(testCoords).toContainEqual(randomTestCoords);
    });
  });
  describe('resetPlayer() function', () => {
    const testPlayer = Player("test");
    test("check resetPlayer() resets playerMoves and remainingMoves arrays", () => {
      testPlayer.attack([0,0])
      testPlayer.attack([9, 9]);
      expect(testPlayer.getMoves().length).toBe(2)
      expect(testPlayer.getRemainingMoves().length).toBe(98) 
      testPlayer.resetPlayer()
      expect(testPlayer.getMoves().length).toBe(0); 
      expect(testPlayer.getRemainingMoves().length).toBe(100); 
      
    })
  })
})
