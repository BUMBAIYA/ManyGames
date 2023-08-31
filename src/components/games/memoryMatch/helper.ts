import { shuffleTiles } from "../../../utility/shuffle";
import { uuid4 } from "../../../utility/uuidGenerator";

export namespace MemoryMatchHelper {
  export type MemoryMatchTile = {
    name: string;
    id: string;
    commonID: number;
    isVisited: boolean;
    isCurrentlyVisible: boolean;
    isCorrectGuessed: boolean;
  };

  export const MEMORY_MATCH_INVALID_TEXT = "💣" as const;

  type MemoryBoardConfig = {
    duplicate: number;
    wrongDuplicate: number;
    gridCSSVar: {
      gridMobile: {
        gridSize: string;
        fontSize: string;
      };
      gridDesktop: {
        gridSize: string;
        fontSize: string;
      };
    };
  };

  export const MEMORY_MATCH_BOARD_CONFIG: Record<number, MemoryBoardConfig> = {
    4: {
      duplicate: 2,
      wrongDuplicate: 0,
      gridCSSVar: {
        gridMobile: {
          gridSize: "21vw",
          fontSize: "10vw",
        },
        gridDesktop: {
          gridSize: "15vh",
          fontSize: "7vh",
        },
      },
    },
    5: {
      duplicate: 2,
      wrongDuplicate: 1,
      gridCSSVar: {
        gridMobile: {
          gridSize: "16vw",
          fontSize: "8vw",
        },
        gridDesktop: {
          gridSize: "12vh",
          fontSize: "6vh",
        },
      },
    },
    6: {
      duplicate: 3,
      wrongDuplicate: 3,
      gridCSSVar: {
        gridMobile: {
          gridSize: "14vw",
          fontSize: "7vw",
        },
        gridDesktop: {
          gridSize: "12vh",
          fontSize: "5vh",
        },
      },
    },
  } as const;

  export const getRandomLetters = (arr: string[], length: number) => {
    const shuffledString = shuffleTiles(arr);
    return shuffledString.slice(0, length);
  };

  export function generateNewTiles(arr: string[], size: number) {
    let tiles: MemoryMatchTile[] = [];
    let randomTiles: string[] = [];

    randomTiles = getRandomLetters(
      arr,
      (size * size - MEMORY_MATCH_BOARD_CONFIG[size].wrongDuplicate) /
        MEMORY_MATCH_BOARD_CONFIG[size].duplicate,
    );

    for (let i = 0; i < randomTiles.length; i++) {
      for (
        let repeatedTile = 0;
        repeatedTile < MEMORY_MATCH_BOARD_CONFIG[size].duplicate;
        repeatedTile++
      ) {
        tiles.push({
          name: randomTiles[i],
          id: uuid4(),
          commonID: i + 1,
          isCurrentlyVisible: false,
          isVisited: false,
          isCorrectGuessed: false,
        });
      }
    }

    for (
      let repeatedTile = 0;
      repeatedTile < MEMORY_MATCH_BOARD_CONFIG[size].wrongDuplicate;
      repeatedTile++
    ) {
      tiles.push({
        name: MEMORY_MATCH_INVALID_TEXT,
        id: uuid4(),
        commonID: 0,
        isCurrentlyVisible: false,
        isVisited: false,
        isCorrectGuessed: false,
      });
    }
    return shuffleTiles(tiles);
  }
}
