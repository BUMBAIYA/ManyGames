import { LetterType } from "./GameBoard";

export function generateInitialTiles(
  totalAttempts: number,
  wordLength: number,
) {
  let tiles: LetterType[][] = [];
  for (let rIndex = 0; rIndex < totalAttempts; rIndex++) {
    tiles[rIndex] = [];
    for (let cIndex = 0; cIndex < wordLength; cIndex++) {
      tiles[rIndex][cIndex] = { value: null, status: null };
    }
  }
  return tiles;
}
