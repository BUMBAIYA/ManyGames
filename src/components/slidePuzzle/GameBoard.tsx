import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useEvent from "../../hooks/useEvent";
import { classNames } from "../../utility/css";
import { GameBoard } from "./GameLogic";

export interface ISlidePuzzleBoardProps {}

export function SlidePuzzleBoard(props: ISlidePuzzleBoardProps) {
  const [board, setBoard] = useState(new GameBoard(8, 5));

  const handleResetGame = () => {
    setBoard(new GameBoard(8, 5));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode > 40 || event.keyCode < 37) return;
    event.preventDefault();
    if (event.repeat) return;
    let boardClone: GameBoard = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );
    switch (event.key) {
      case "ArrowUp": {
        let newBoard = boardClone.moveTile(1);
        if (newBoard == null) break;
        setBoard(newBoard);
        break;
      }
      case "ArrowDown": {
        let newBoard = boardClone.moveTile(3);
        if (newBoard == null) break;
        setBoard(newBoard);
        break;
      }
      case "ArrowRight": {
        let newBoard = boardClone.moveTile(2);
        if (newBoard == null) break;
        setBoard(newBoard);
        break;
      }
      case "ArrowLeft": {
        let newBoard = boardClone.moveTile(4);
        if (newBoard == null) break;
        setBoard(newBoard);
        break;
      }
      default: {
        return;
      }
    }
  };

  useEvent("keydown", handleKeyDown, false);

  return (
    <div className="flex justify-center gap-4">
      <div
        className={classNames(
          board.hasWon() ? "" : "gap-1",
          "inline-grid grid-cols-8 grid-rows-5 overflow-x-scroll rounded-md bg-zinc-900 p-1 dark:bg-zinc-700"
        )}
      >
        {board.tiles.map((_tile, index) => {
          if (_tile === 39)
            return (
              <div
                key={index}
                className="h-20 w-[88px] rounded-sm bg-zinc-900 text-black dark:bg-white"
              ></div>
            );
          return (
            <div
              key={index}
              style={{
                backgroundImage: `url(/puzzles/${_tile + 1}.png)`,
              }}
              className={classNames(
                board.hasWon() ? "" : "rounded-sm",
                "h-20 w-[88px] bg-cover bg-no-repeat"
              )}
            ></div>
          );
        })}
      </div>
      <div>
        <button
          className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400  dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4"
          onClick={handleResetGame}
        >
          <span className="hidden text-lg font-semibold text-white dark:text-zinc-900 sm:block">
            Reset
          </span>
          <ArrowPathIcon className="block h-6 w-6 text-white dark:text-zinc-900 sm:hidden" />
        </button>
        <div className="dark:text-white">
          {board.hasWon() ? "completed" : "Not complete"}
        </div>
      </div>
    </div>
  );
}
