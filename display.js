import { Ship } from "./battleship.js";

const display = (payLoad, checkPayLoad) => {
  // DOM elements
  const container = document.getElementById("container");
  const gameDisplay = document.getElementById("gameDisplay");
  const gui = document.getElementById("gui");
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const dragShip = document.getElementById("dragShip");
  // Drag and Drop storage variables
  let dragElement = null;
  let dragPosition = null;
  let dragBoard = null
  const getId = () => input.value;

  const hideInput = () => {
    gui.firstElementChild.style.display = 'none';
  };

  const renderCell = (el, status) => {
    el.textContent = status === "hit" ? "x" : "-";
  };

  const locateCell = (grid, coord) => {
    const x = coord[0];
    const y = coord[1];
    const cell = grid.querySelector(`.square[data-x='${x}'][data-y='${y}']`);
    return cell;
  };

  const renderGrid = (id, board) => {
    let newGrid = document.createElement("div");
    
    
    newGrid.id = "grid_" + id;
    newGrid.dataset.id = id;
    newGrid.classList.add("grid");
    for (let i = board.length - 1; i >= 0; i--) {
      for (let j = 0; j < board[0].length; j++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.dataset.x = j;
        square.dataset.y = i;
        square.textContent = `x:${j}, y:${i}`;
        newGrid.appendChild(square);
      }
    }
    gameDisplay.appendChild(newGrid);
    return gameDisplay.lastElementChild;
  };

  const renderGridLabels = () => {
    const labels = [`Opponent's board`, `Your board`]
    labels.forEach(label => {
      let gridLabel = document.createElement("div");
      gridLabel.textContent = label;
      gridLabel.classList.add("gameDisplayLabel");
      gameDisplay.appendChild(gridLabel);
    })
  }

  const renderFleet = (grid, ships) => {
    ships.forEach((ship) => {
      const coords = ship.getCoords();
      coords.forEach((coord) => {
        const x = coord[0];
        const y = coord[1];
        const cell = grid.querySelector(
          `.square[data-x='${x}'][data-y='${y}']`
        );
        cell.classList.add("shade");
      });
    });
  };

  const renderDragShips = (board, len) => {
    dragBoard = board
    const shipTemplate = document.createElement("div");
    shipTemplate.draggable = true;
    shipTemplate.dataset.vertical = false;
    shipTemplate.dataset.index = dragShip.childNodes.length
    shipTemplate.dataset.length = len;
    shipTemplate.classList.add("shipTemplate");
    shipTemplate.addEventListener("click", rotateDragShip);
    shipTemplate.addEventListener("dragstart", dragStartHandler);

    for (let i = 0; i < len; i++) {
      let square = document.createElement("div");
      square.dataset.position = i;
      square.addEventListener("mousedown", getDragShipPosition);
      square.classList.add("square");
      shipTemplate.appendChild(square);
    }
    dragShip.appendChild(shipTemplate);
  };

  const getDragShipPosition = (el) => {
    dragPosition = el.target.dataset.position;
  };

  const setDropTarget = (grid) => {
    const cells = grid.childNodes;
    cells.forEach((cell) => {
      cell.addEventListener("dragover", dragOverHandler);
      cell.addEventListener("dragenter", dragEnterHandler);
      cell.addEventListener("dragleave", dragLeaveHandler);
      cell.addEventListener("drop", dragDropHandler);
    });
  };

  const dragStartHandler = (el) => {
    dragElement = el.target;
    el.dataTransfer.effectAllowed = "move";
    el.dataTransfer.setData("text", dragElement.dataset.index);
  };

  const dragOverHandler = (el) => {
    el.preventDefault();
    el.dataTransfer.dropEffect = "move";
  };

  const dragEnterHandler = (el) => {
    el.preventDefault();
    el.target.classList.add("dragOver");
  };

  const dragLeaveHandler = (el) => {
    el.preventDefault();
    el.target.classList.remove("dragOver");
  }

  const dragDropHandler = (el) => {
    el.preventDefault();
    el.target.classList.remove("dragOver");
    const index = el.dataTransfer.getData("text");
    const draggable = dragShip.childNodes[index]
    const length = +draggable.dataset.length;
    const vertical = draggable.dataset.vertical;
    const offset = +dragPosition;
    const x = +el.target.dataset.x;
    const y = +el.target.dataset.y;
    const startCoords = [];
    const endCoords = [];
    if (vertical === 'true') {
      startCoords.push([x, y - offset]);
      endCoords.push([x, y + (length - 1) - offset]);
    } else {
      startCoords.push([x - offset, y]);
      endCoords.push([x + (length - 1) - offset, y]);
    }

    payLoad.newShip = Ship(length)
    payLoad.startCoord = startCoords
    payLoad.endCoord = endCoords
    checkPayLoad(payLoad, draggable)

    return true;
  };

  const rotateDragShip = (el) => {
    const ship = el.target.parentElement
    ship.classList.toggle("verticalFlex");
    ship.dataset.vertical =
      ship.classList.contains("verticalFlex");
    return true
  };
  const hideDragShip = (draggable) => {
    draggable.style.display = 'none'
    return true
  };

  const greetingDisplay = (id) => {
    output.textContent = `Hello ${id}. Please finish placing your ships on the board (click to rotate)`;
    return true
  };

  const outputDisplay = (str) => {
    output.textContent = str;
    return true
  };

  const resetDisplay = () => {
    gameDisplay.replaceChildren();
    dragShip.style.display = "flex";
    dragShip.replaceChildren()
    gui.firstElementChild.style.display = "flex";
  };

  return {
    getId,
    hideInput,
    renderCell,
    locateCell,
    renderGrid,
    renderGridLabels,
    renderFleet,
    resetDisplay,
    renderDragShips,
    hideDragShip,
    rotateDragShip,
    setDropTarget,
    greetingDisplay,
    outputDisplay,
  };
};

export { display };
