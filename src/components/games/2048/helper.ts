import { GameTile } from "./GameTile";
import {
  BOARD_SIZE,
  MoveDirection,
  PROBABILITY,
  initialTileState,
} from "./GameBoard";

const DELTA_X = [-1, 0, 1, 0] as const;
const DELTA_Y = [0, -1, 0, 1] as const;

export function generateInitialCells(): GameTile[][] {
  let cells: GameTile[][] = [];
  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
    cells[rowIndex] = [];
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex++) {
      cells[rowIndex][colIndex] = { ...initialTileState };
    }
  }
  return cells;
}

export function addTile(value: number): GameTile {
  let newTile = { ...initialTileState, value };
  return newTile;
}

export function addRandomTile(cells: GameTile[][]): GameTile[][] {
  let newCells = cells;
  let emptyTiles = [];
  for (let rowIndex = 0; rowIndex < BOARD_SIZE; ++rowIndex) {
    for (let columnIndex = 0; columnIndex < BOARD_SIZE; ++columnIndex) {
      if (newCells[rowIndex][columnIndex].value === 0) {
        emptyTiles.push({ rowIndex, columnIndex });
      }
    }
  }
  let randomIndex = Math.floor(Math.random() * emptyTiles.length);
  let randomEmptyTile = emptyTiles[randomIndex];
  let newRandomValue = Math.random() < PROBABILITY ? 4 : 2;
  let newTile = addTile(newRandomValue);
  newCells[randomEmptyTile.rowIndex][randomEmptyTile.columnIndex] = newTile;
  return cells;
}

export function setPositions(cells: GameTile[][]): GameTile[][] {
  let newCells = cells;
  newCells = newCells.map((row, rowIndex) => {
    return row.map((tile, colIndex) => {
      let newTile = { ...tile };
      newTile.oldRow = tile.row;
      newTile.oldColumn = tile.column;
      newTile.row = rowIndex;
      newTile.column = colIndex;
      return newTile;
    });
  });
  return newCells;
}

function getRowColOfRotatedMatrix(
  direction: MoveDirection,
  row: number,
  col: number,
) {
  let newRow = -1;
  let newCol = -1;
  switch (direction) {
    case 1: {
      newRow = col;
      newCol = BOARD_SIZE - 1 - row;
      break;
    }
    case 2: {
      newRow = BOARD_SIZE - 1 - row;
      newCol = BOARD_SIZE - 1 - col;
      break;
    }
    case 3: {
      newRow = BOARD_SIZE - 1 - col;
      newCol = row;
      break;
    }
    default: {
      return { row, col };
    }
  }
  return { row: newRow, col: newCol };
}

function moveLeft(cells: GameTile[][], direction: MoveDirection) {
  let newCells = cells;
  let won = false;
  let hasChanged = false;
  let score = 0;
  let mergedTiles: GameTile[] = [];
  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
    let currentRow = newCells[rowIndex].filter((tile) => tile.value !== 0);
    let resultRow: GameTile[] = [];
    for (let targetIndex = 0; targetIndex < BOARD_SIZE; targetIndex++) {
      let targetTile: GameTile =
        currentRow.length !== 0 ? currentRow.shift()! : addTile(0);
      if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
        let newDimension = getRowColOfRotatedMatrix(
          direction,
          rowIndex,
          targetIndex,
        );

        let tileToMerge: GameTile;
        let tile1 = targetTile;
        targetTile = addTile(targetTile.value);
        tile1.mergeToTile = targetTile;

        let tile2 = currentRow.shift()!;
        tile2.mergeToTile = targetTile;
        targetTile.value += tile2.value;
        score = tile1.value + tile2.value;

        tileToMerge = {
          ...tile2,
          mergeToTile: {
            ...targetTile,
            row: newDimension.row,
            column: newDimension.col,
          },
        };
        mergedTiles = [...mergedTiles, tileToMerge];
      }
      resultRow[targetIndex] = targetTile;
      if (targetTile.value === 2048) {
        won = true;
      }
      hasChanged =
        targetTile.value !== newCells[rowIndex][targetIndex].value ||
        hasChanged;
    }
    newCells[rowIndex] = resultRow;
  }

  return { hasChanged, won, newCells, score, tiles: mergedTiles };
}

function rotateLeftMatrix(cells: GameTile[][]) {
  let newCell: GameTile[][] = [];
  for (let xIndex = 0; xIndex < BOARD_SIZE; ++xIndex) {
    newCell.push([]);
    for (let yIndex = 0; yIndex < BOARD_SIZE; ++yIndex) {
      newCell[xIndex][yIndex] = cells[yIndex][BOARD_SIZE - xIndex - 1];
    }
  }
  return newCell;
}

function rotateRightMatrix(cells: GameTile[][]) {
  let newCell: GameTile[][] = [];
  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
    newCell.push([]);
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex++) {
      newCell[rowIndex][colIndex] = cells[BOARD_SIZE - colIndex - 1][rowIndex];
    }
  }
  return newCell;
}

export function moveTile(cells: GameTile[][], direction: MoveDirection) {
  let newCells = cells;
  if (direction !== 3) {
    for (let i = 0; i < direction; i++) {
      newCells = rotateLeftMatrix(newCells);
    }
  } else {
    newCells = rotateRightMatrix(newCells);
  }
  let moveOut = moveLeft(newCells, direction);
  newCells = moveOut.newCells;
  if (direction === 3) {
    newCells = rotateLeftMatrix(newCells);
  } else {
    for (let i = 0; i < direction; i++) {
      newCells = rotateRightMatrix(newCells);
    }
  }
  if (moveOut.hasChanged) {
    newCells = addRandomTile(newCells);
  }
  newCells = setPositions(newCells);
  return {
    cells: newCells,
    score: moveOut.score,
    won: moveOut.won,
    tiles: moveOut.tiles,
  };
}

export function isGameLost(cells: GameTile[][]) {
  let lost = false;
  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex++) {
      if (cells[rowIndex][colIndex].value === 0) return false;
      lost = cells[rowIndex][colIndex].value === 0 || lost;
      for (let dir = 0; dir < 4; dir++) {
        let newRow = rowIndex + DELTA_X[dir];
        let newColumn = colIndex + DELTA_Y[dir];
        if (
          newRow < 0 ||
          newRow >= BOARD_SIZE ||
          newColumn < 0 ||
          newColumn >= BOARD_SIZE
        ) {
          continue;
        }
        lost =
          cells[rowIndex][colIndex].value === cells[newRow][newColumn].value ||
          lost;
      }
    }
  }
  return !lost;
}
