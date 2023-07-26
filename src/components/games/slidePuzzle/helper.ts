import { shuffleTiles } from "../../../utility/shuffle";

export function generateRandomTiles(size: number) {
  let tiles: number[] = [];
  for (let i = 0; i < size * size; i++) {
    tiles[i] = i;
  }
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
