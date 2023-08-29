import { useEffect, useRef, useState } from "react";
import { MemoryMatchTile, generateNewTiles } from "./helper";
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import styles from "./styles.module.css";
import useLocalStorage from "../../../hooks/useLocalStorage";

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
  const [boardSize, setBoardSize] = useState<number>(5);
  const [lost, setLost] = useState<boolean>(false);
  const [score, setScore] = useLocalStorage<number>("memory-match", 0);
  const refBoard = useRef<HTMLDivElement>(null);
  const [tiles, setTiles] = useState<MemoryMatchTile[]>([]);
  const [currentTile, setCurrentTile] = useState<MemoryMatchTile | null>(null);
  const [correctGuessedID, setCorrectGuessedID] = useState<Set<number>>(
    new Set(),
  );

  const handleSetVisible = (tile: MemoryMatchTile) => {
    if (currentTile) {
      if (currentTile.id === tile.id) return;
      setScore((prev) => prev + 1);
      if (tile.commonID === 0 && tile.isVisited === true) {
        setLost(true);
        setTiles((prev) =>
          prev.map((t) => {
            return t.id === tile.id || t.isCorrectGuessed === true
              ? { ...t, isCurrentlyVisible: true }
              : { ...t, isCurrentlyVisible: false };
          }),
        );
      }
      if (currentTile.commonID === tile.commonID) {
        if (hasInvisibleTileWithCommonID(currentTile.commonID, tile)) {
          setCurrentTile(tile);
          setTiles((prev) =>
            prev.map((t) => {
              return t.id === tile.id
                ? {
                    ...t,
                    isCurrentlyVisible: true,
                    isVisited: true,
                  }
                : t;
            }),
          );
        } else {
          setCurrentTile(tile);
          setCorrectGuessedID((prev) => prev.add(tile.commonID));
          setTiles((prev) =>
            prev.map((t) => {
              return t.commonID === currentTile.commonID
                ? {
                    ...t,
                    isCurrentlyVisible: true,
                    isVisited: true,
                    isCorrectGuessed: true,
                  }
                : t;
            }),
          );
        }
      } else {
        setCurrentTile(tile);
        setTiles((prev) =>
          prev.map((t) => {
            return t.id === tile.id
              ? {
                  ...t,
                  isCurrentlyVisible: true,
                  isVisited: true,
                }
              : correctGuessedID.has(t.commonID)
              ? { ...t, isCorrectGuessed: true, isCurrentlyVisible: true }
              : { ...t, isCurrentlyVisible: false };
          }),
        );
      }
    } else {
      setCurrentTile(tile);
      setScore((prev) => prev + 1);
      setTiles((prev) =>
        prev.map((t) => {
          return t.id === tile.id
            ? {
                ...t,
                isCurrentlyVisible: true,
                isVisited: true,
              }
            : t;
        }),
      );
    }
  };

  const hasInvisibleTileWithCommonID = (
    commonID: number,
    currentTile: MemoryMatchTile,
  ): boolean => {
    return tiles.some((tile) =>
      currentTile.id === tile.id
        ? false
        : tile.commonID === commonID && !tile.isCurrentlyVisible,
    );
  };

  const handleResetGame = () => {
    setTiles(generateNewTiles(VALID_LETTERS, boardSize));
    setCorrectGuessedID(new Set<number>());
    setCurrentTile(null);
    setLost(false);
  };

  const handleBoardSize = (size: number) => {
    setBoardSize(size);
    refBoard.current?.style.setProperty("--board-size", `${boardSize}`);
    setTiles(generateNewTiles(VALID_LETTERS, boardSize));
  };

  useEffect(() => {
    handleBoardSize(boardSize);
  }, []);

  return (
    <div className="flex w-full flex-col-reverse items-center gap-4 lg:flex-row lg:items-start lg:justify-center">
      <div ref={refBoard} className={`${styles.board_grid}`}>
        {tiles.map((tile, index) => {
          return (
            <button
              type="button"
              className="relative inline-flex h-full w-full rounded-md border-2 border-emerald-500/40 bg-white p-2 shadow-sm transition-shadow duration-200 hover:shadow-lg dark:bg-zinc-900 dark:hover:shadow-emerald-400/40"
              style={
                tile.isCurrentlyVisible
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
              onClick={() => handleSetVisible(tile)}
            >
              <span className="flex h-full w-full items-center justify-center">
                {tile.isCurrentlyVisible ? tile.name : null}
              </span>
            </button>
          );
        })}
        {Object.entries(correctGuessedID).map(([key, value]) => {
          return value;
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
