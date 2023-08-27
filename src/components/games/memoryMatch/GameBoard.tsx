import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { MemoryMatchTile, generateNewTiles, getRandomLetters } from "./helper";
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

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

export default function MemoryMatchBoard() {
  const [tiles, setTiles] = useState<MemoryMatchTile[]>([]);

  useEffect(() => {
    setTiles(generateNewTiles(VALID_LETTERS, 5));
  }, []);

  return (
    <div className="flex w-full flex-col-reverse items-center gap-4 lg:flex-row lg:items-start lg:justify-center">
      <div className={`${styles.board_grid}`}>
        {tiles.map((value, index) => {
          return (
            <button
              type="button"
              className="relative inline-flex h-full w-full rounded-md border-2 border-emerald-500/40 bg-white p-2 shadow-sm transition-shadow duration-200 hover:shadow-lg dark:bg-zinc-700 dark:hover:shadow-emerald-400/40"
              key={index}
            >
              <span className="flex h-full w-full items-center justify-center">
                {value.name}
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
