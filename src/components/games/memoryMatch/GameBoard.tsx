import { useEffect, useRef, useState } from "react";
import { MemoryMatchTile, generateNewTiles } from "./helper";
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import styles from "./styles.module.css";

const VALID_LETTERS: string[] = [
  "🍅",
  "🍊",
  "🍋",
  "🥝",
  "🍏",
  "🍌",
  "🍍",
  "🍒",
  "🍇",
  "🍉",
  "🍈",
  "🍓",
  "🥑",
  "🫐",
  "🍆",
];

type visitedLetter = {
  commonID: number;
};

export default function MemoryMatchBoard() {
  const refBoard = useRef<HTMLDivElement>(null);
  const [tiles, setTiles] = useState<MemoryMatchTile[]>([]);
  const [visitedLetter, setVisitedLetter] = useState<visitedLetter[]>([]);
  const [correctGuessedID, setCorrectGuessedID] = useState<number[]>([]);

  const setVisible = (id: string) => {
    setTiles((prev) =>
      prev.map((tile) => {
        return tile.id === id
          ? {
              ...tile,
              isCurrentlyVisible: true,
              isVisited: true,
            }
          : tile;
      }),
    );
  };

  const handleResetGame = () => {
    setTiles(generateNewTiles(VALID_LETTERS, 5));
  };

  const handleBoardSize = (size: number) => {
    refBoard.current?.style.setProperty("--board-size", `${size}`);
    setTiles(generateNewTiles(VALID_LETTERS, size));
  };

  useEffect(() => {
    setTiles(generateNewTiles(VALID_LETTERS, 5));
  }, []);

  useEffect(() => {
    console.log(tiles);
  }, [tiles]);

  return (
    <div className="flex w-full flex-col-reverse items-center gap-4 lg:flex-row lg:items-start lg:justify-center">
      <div ref={refBoard} className={`${styles.board_grid}`}>
        {tiles.map((value, index) => {
          return (
            <button
              type="button"
              className="relative inline-flex h-full w-full rounded-md border-2 border-emerald-500/40 bg-white p-2 shadow-sm transition-shadow duration-200 hover:shadow-lg dark:bg-zinc-900 dark:hover:shadow-emerald-400/40"
              style={
                value.isCurrentlyVisible
                  ? {
                      animation: `500ms linear 100ms ${styles.spinx}`,
                    }
                  : {
                      animation: `400ms linear ${(index % 6) * 40}ms ${
                        styles.reset_animation
                      }`,
                    }
              }
              key={index}
              onClick={() => setVisible(value.id)}
            >
              <span className="flex h-full w-full items-center justify-center">
                {!value.isCurrentlyVisible ? value.name : null}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex w-full justify-end lg:w-auto">
        <div className="flex gap-2 lg:flex-col">
          <button
            aria-label="How to play"
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
            onClick={handleResetGame}
          >
            <ArrowPathIcon className="h-8 w-8 stroke-zinc-900 dark:stroke-emerald-300" />
          </button>
          <button
            aria-label="How to play"
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
          >
            <Cog6ToothIcon className="h-8 w-8 stroke-zinc-900 dark:stroke-emerald-300" />
          </button>
          <button
            aria-label="How to play"
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
          >
            <InformationCircleIcon className="h-8 w-8 stroke-zinc-900 dark:stroke-emerald-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
