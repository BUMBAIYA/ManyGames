import { shuffleTiles } from "../../../utility/shuffle";
import { s4 } from "../../../utility/uuidGenerator";

export type MemoryMatchTile = {
  name: string;
  id: string;
  commonID: number;
  isVisited: boolean;
  isCurrentlyVisible: boolean;
  isDisabled: boolean;
  isKill: boolean;
};

const INVALID_TEXT = "☠️";

export const getRandomLetters = (arr: string[], length: number) => {
  const shuffledString = shuffleTiles(arr);
  return shuffledString.slice(0, length);
};

export function generateNewTiles(arr: string[], size: number) {
  let tiles: MemoryMatchTile[] = [];
  let randomTiles: string[] = [];
  let duplicateTile = 2;
  let wrongDuplicate = 2;
  if (size === 4) {
    randomTiles = getRandomLetters(arr, 7);
  } else if (size === 5) {
    randomTiles = getRandomLetters(arr, 11);
    wrongDuplicate = 3;
  } else {
    randomTiles = getRandomLetters(arr, 11);
    duplicateTile = 3;
    wrongDuplicate = 3;
  }

  for (let i = 0; i < randomTiles.length; i++) {
    for (let repeatedTile = 0; repeatedTile < duplicateTile; repeatedTile++) {
      tiles.push({
        name: randomTiles[i],
        id: s4(),
        commonID: i + 1,
        isCurrentlyVisible: false,
        isDisabled: false,
        isVisited: false,
        isKill: false,
      });
    }
  }

  for (let repeatedTile = 0; repeatedTile < wrongDuplicate; repeatedTile++) {
    tiles.push({
      name: INVALID_TEXT,
      id: s4(),
      commonID: 0,
      isCurrentlyVisible: false,
      isDisabled: false,
      isVisited: false,
      isKill: false,
    });
  }

  return shuffleTiles(tiles);
}
