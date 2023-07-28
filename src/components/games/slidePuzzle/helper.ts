import { shuffleTiles } from "../../../utility/shuffle";
import { MoveDirection } from "./GameBoard";

export function generateEmptyTiles(size: number) {
  let tiles: number[] = [];
  for (let i = 0; i < size * size; i++) {
    tiles[i] = i;
  }
  return tiles;
}

export const swapElementInArray = (
  tiles: number[],
  fromIndex: number,
  toIndex: number,
) => {
  let tempTile = [...tiles];
  [tempTile[toIndex], tempTile[fromIndex]] = [
    tempTile[fromIndex],
    tempTile[toIndex],
  ];
  return tempTile;
};

export function generateTileForHowToPlay(
  size: number,
  moves?: MoveDirection[],
) {
  let len = size * size;
  let emptyTileIndex = len - 1;
  let tiles = generateEmptyTiles(size);

  const swapTile = (indexToBeSwiped: number) => {
    let tempTile = [...tiles];
    [tempTile[emptyTileIndex], tempTile[indexToBeSwiped]] = [
      tempTile[indexToBeSwiped],
      tempTile[emptyTileIndex],
    ];
    return tempTile;
  };

  const handleMoveTile = (dir: MoveDirection) => {
    switch (dir) {
      case "UP": {
        let indexToBeSwaped = emptyTileIndex + size;
        if (indexToBeSwaped > len - 1) break;
        tiles = swapTile(indexToBeSwaped);
        emptyTileIndex = getPositionOfEmptyTile(tiles);
        break;
      }
      case "DOWN": {
        if (emptyTileIndex - size < 0) break;
        let indexToBeSwaped = emptyTileIndex - size;
        tiles = swapTile(indexToBeSwaped);
        emptyTileIndex = getPositionOfEmptyTile(tiles);
        break;
      }
      case "RIGHT": {
        if (emptyTileIndex === 0) break;
        if (emptyTileIndex % size === 0) break;
        tiles = swapTile(emptyTileIndex - 1);
        emptyTileIndex = getPositionOfEmptyTile(tiles);
        break;
      }
      case "LEFT": {
        if ((emptyTileIndex + 1) % size === 0) break;
        tiles = swapTile(emptyTileIndex + 1);
        emptyTileIndex = getPositionOfEmptyTile(tiles);
        break;
      }
      default: {
        return;
      }
    }
  };

  if (moves) {
    moves.map((move) => {
      switch (move) {
        case "UP": {
          handleMoveTile("UP");
          break;
        }
        case "DOWN": {
          handleMoveTile("DOWN");
          break;
        }
        case "RIGHT": {
          handleMoveTile("RIGHT");
          break;
        }
        case "LEFT": {
          handleMoveTile("LEFT");
          break;
        }
        default: {
          return;
        }
      }
    });
  }

  const getTiles = () => {
    return tiles;
  };

  const getEmptyTileIndex = () => {
    return emptyTileIndex;
  };

  return { tiles, emptyTileIndex };
}

export function generateRandomTiles(size: number) {
  let tiles = generateEmptyTiles(size);
  const shuffleTile = () => {
    tiles = shuffleTiles(tiles);
    if (!isSolvable(tiles, size)) {
      shuffleTile();
    }
  };
  shuffleTile();
  return tiles;
}

export function getPositionOfEmptyTile(tiles: number[]): number {
  return tiles.indexOf(tiles.length - 1);
}

function isSolvable(tiles: number[], size: number) {
  let emptyTileIndex = getPositionOfEmptyTile(tiles);
  const countInversion = () => {
    let inversions = 0;
    let currentLen = tiles.length;
    for (let i = 0; i < currentLen - 1; i++) {
      for (let j = i + 1; j < currentLen; j++) {
        if (
          i !== emptyTileIndex &&
          j !== emptyTileIndex &&
          tiles[i] > tiles[j]
        ) {
          inversions++;
        }
      }
    }
    return inversions;
  };
  let inversions = countInversion();
  let boardSize = size * size;
  if (boardSize % 2 === 0) {
    if (inversions % 2 === 0) {
      return Math.floor(emptyTileIndex / size) % 2 !== 0;
    }
    return Math.floor(emptyTileIndex / size) % 2 === 0;
  }
  return inversions % 2 == 0;
}
