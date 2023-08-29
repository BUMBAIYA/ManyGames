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
  isCorrectGuessed: boolean;
};

const INVALID_TEXT = "☠️" as const;

type MemoryBoardConfig = {
  duplicate: number;
  wrongDuplicate: number;
};

export const BOARD_CONFIG: Record<number, MemoryBoardConfig> = {
  4: {
    duplicate: 2,
    wrongDuplicate: 0,
  },
  5: {
    duplicate: 2,
    wrongDuplicate: 1,
  },
  6: {
    duplicate: 3,
    wrongDuplicate: 3,
  },
};

export const getRandomLetters = (
  arr: string[],
  size: number,
  length: number,
) => {
  const shuffledString = shuffleTiles(arr);
  return shuffledString.slice(0, length);
};

export function generateNewTiles(arr: string[], size: number) {
  let tiles: MemoryMatchTile[] = [];
  let randomTiles: string[] = [];
  // if (size === 4) {
  //   randomTiles = getRandomLetters(
  //     arr,
  //     size,
  //     ((size * size) - BOARD_CONFIG[size].wrongDuplicate) / BOARD_CONFIG[size].duplicate,
  //   );
  // } else if (size === 5) {
  //   randomTiles = getRandomLetters(
  //     arr,
  //     size,
  //     (size * size - BOARD_CONFIG[size].wrongDuplicate) /
  //       BOARD_CONFIG[size].duplicate,
  //   );
  // } else if (size === 6) {

  // }

  randomTiles = getRandomLetters(
    arr,
    size,
    (size * size - BOARD_CONFIG[size].wrongDuplicate) /
      BOARD_CONFIG[size].duplicate,
  );

  for (let i = 0; i < randomTiles.length; i++) {
    for (
      let repeatedTile = 0;
      repeatedTile < BOARD_CONFIG[size].duplicate;
      repeatedTile++
    ) {
      tiles.push({
        name: randomTiles[i],
        id: s4(),
        commonID: i + 1,
        isCurrentlyVisible: false,
        isDisabled: false,
        isVisited: false,
        isKill: false,
        isCorrectGuessed: false,
      });
    }
  }

  for (
    let repeatedTile = 0;
    repeatedTile < BOARD_CONFIG[size].wrongDuplicate;
    repeatedTile++
  ) {
    tiles.push({
      name: INVALID_TEXT,
      id: s4(),
      commonID: 0,
      isCurrentlyVisible: false,
      isDisabled: false,
      isVisited: false,
      isKill: false,
      isCorrectGuessed: false,
    });
  }
  return shuffleTiles(tiles);
}
