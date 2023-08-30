import { useEffect, useReducer, useState } from "react";
import { ArrowPathIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useSwipeable } from "react-swipeable";
import PageMeta from "../../utility/PageMeta";
import { GameTile, NewGameTile } from "./GameTile";
import useEvent from "../../../hooks/useEvent";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {
  addRandomTile,
  generateInitialCells,
  isGameLost,
  moveTile,
  setPositions,
} from "./helper";
import styles from "./styles.module.scss";
import { BasicModal } from "../../modal/BasicModal";
import ConfettiComponent from "../../modal/ConfettiComponent";

export const initialTileState: GameTile = {
  value: 0,
  row: -1,
  column: -1,
  oldRow: -1,
  oldColumn: -1,
  mergeToTile: null,
};

type ReducerState = {
  board: GameTile[][];
  tiles: GameTile[];
  won: boolean;
  lost: boolean;
  score: number;
};

type ReducerActions =
  | {
      type: "INITIAL";
    }
  | {
      type: "RESTORE";
    }
  | {
      type: GameMovement;
    };

type GameMovement = "UP" | "DOWN" | "RIGHT" | "LEFT";

export enum MoveDirection {
  UP = 1,
  DOWN = 3,
  RIGHT = 2,
  LEFT = 0,
}

export const PROBABILITY = 0.4 as const;
export const BOARD_SIZE = 4 as const;

const initialReducerState: ReducerState = {
  board: generateInitialCells(),
  tiles: [],
  won: false,
  lost: false,
  score: 0,
};

const generateInitialGameState = (): ReducerState => {
  let newCells = generateInitialCells();
  newCells = addRandomTile(newCells);
  newCells = addRandomTile(newCells);
  newCells = setPositions(newCells);
  return { ...initialReducerState, board: newCells };
};

export default function GameBoard() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [boardStore, setBoardStore] = useLocalStorage("2048-data", {
    won: false,
    lost: false,
    board: generateInitialGameState().board,
    score: 0,
    highscore: 0,
  });

  const stateReducer = (state: ReducerState, action: ReducerActions) => {
    switch (action.type) {
      case "INITIAL": {
        setOpenModal(false);
        return generateInitialGameState();
      }
      case "RESTORE": {
        return {
          won: boardStore.won,
          lost: boardStore.lost,
          board: boardStore.board,
          score: boardStore.score,
          tiles: [],
        };
      }
      case "UP": {
        let moveOut = moveTile(state.board, MoveDirection.UP);
        let lost = isGameLost(moveOut.cells);
        return {
          ...state,
          board: moveOut.cells,
          lost,
          won: moveOut.won,
          score: state.score + moveOut.score,
          tiles: moveOut.tiles,
        };
      }
      case "DOWN": {
        let moveOut = moveTile(state.board, MoveDirection.DOWN);
        let lost = isGameLost(moveOut.cells);

        return {
          ...state,
          board: moveOut.cells,
          lost,
          won: moveOut.won,
          score: state.score + moveOut.score,
          tiles: moveOut.tiles,
        };
      }
      case "RIGHT": {
        let moveOut = moveTile(state.board, MoveDirection.RIGHT);
        let lost = isGameLost(moveOut.cells);
        return {
          ...state,
          board: moveOut.cells,
          lost,
          won: moveOut.won,
          score: state.score + moveOut.score,
          tiles: moveOut.tiles,
        };
      }
      case "LEFT": {
        let moveOut = moveTile(state.board, MoveDirection.LEFT);
        let lost = isGameLost(moveOut.cells);
        return {
          ...state,
          board: moveOut.cells,
          lost,
          won: moveOut.won,
          score: state.score + moveOut.score,
          tiles: moveOut.tiles,
        };
      }
      default: {
        return state;
      }
    }
  };

  const [boardState, dispatchState] = useReducer(stateReducer, {
    won: boardStore.won,
    lost: boardStore.lost,
    score: boardStore.score,
    board: boardStore.board,
    tiles: [],
  });

  const handleMoveDispatch = (type: ReducerActions) => {
    if (boardState.lost || boardState.won) return;
    dispatchState(type);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.currentTarget !== document.activeElement) return;
    if (event.keyCode > 40 || event.keyCode < 37) return;
    event.preventDefault();
    if (event.repeat) return;
    switch (event.key) {
      case "ArrowUp": {
        handleMoveDispatch({ type: "UP" });
        break;
      }
      case "ArrowDown": {
        handleMoveDispatch({ type: "DOWN" });
        break;
      }
      case "ArrowRight": {
        handleMoveDispatch({ type: "RIGHT" });
        break;
      }
      case "ArrowLeft": {
        handleMoveDispatch({ type: "LEFT" });
        break;
      }
      default: {
        return;
      }
    }
  };

  useEvent(document.body, "keydown", handleKeyDown, false);

  const touchSwipeHandlers = useSwipeable({
    onSwipedUp: () => {
      dispatchState({ type: "UP" });
    },
    onSwipedDown: () => {
      dispatchState({ type: "DOWN" });
    },
    onSwipedRight: () => {
      dispatchState({ type: "RIGHT" });
    },
    onSwipedLeft: () => {
      dispatchState({ type: "LEFT" });
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    dispatchState({ type: "RESTORE" });
  }, []);

  useEffect(() => {
    let highscore =
      boardState.score > boardStore.highscore
        ? boardState.score
        : boardStore.highscore;
    setBoardStore({ ...boardState, highscore });
    if (boardState.won || boardState.lost) {
      setOpenModal(true);
    }
  }, [boardState.board]);

  return (
    <div className="flex w-full flex-col items-center gap-4 lg:flex-row-reverse lg:items-start lg:justify-center">
      <PageMeta title="ManyGames | 2048" description="Play 2048 online" />
      <div className="flex w-full justify-between gap-6 lg:w-auto lg:flex-col">
        <div className="flex flex-row gap-2 lg:flex-col">
          <div className="inline rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 md:px-4">
            <span className="text-xs sm:text-base">Score</span>
            <p className="text-base font-semibold sm:text-3xl">
              {boardStore.score}
            </p>
          </div>
          <div className="inline rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 md:px-4">
            <span className="text-xs sm:text-base">High Score</span>
            <p className="text-base font-semibold sm:text-3xl">
              {boardStore.highscore}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2 lg:flex-col lg:items-start">
          <button
            aria-label="Reset game"
            onClick={() => dispatchState({ type: "INITIAL" })}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5 sm:h-10 sm:w-10"
          >
            <ArrowPathIcon className="h-7 w-7 stroke-zinc-900 dark:stroke-emerald-300 sm:h-8 sm:w-8" />
          </button>
        </div>
      </div>
      <div
        {...touchSwipeHandlers}
        className={`relative w-max ${styles.gameBoard}`}
      >
        <div className="flex flex-col gap-[1vw] lg:gap-[1vh]">
          {[...Array(4)].map((_, rIndex) => (
            <div key={rIndex} className="flex gap-[1vw] lg:gap-[1vh]">
              {[...Array(4)].map((_, cIndex) => {
                return (
                  <div
                    className="h-[22vw] w-[22vw] rounded-[1.5vw] border border-emerald-600 bg-white shadow-sm dark:border-emerald-800 dark:bg-zinc-900 lg:h-[18vh] lg:w-[18vh] lg:rounded-[1vh]"
                    key={cIndex}
                  />
                );
              })}
            </div>
          ))}
          {boardState.tiles.map((tile, index) => (
            <NewGameTile tile={tile} key={index} />
          ))}
          {boardStore.board.map((row, rowIndex) => {
            return row.map((tile, colIndex) => {
              return (
                tile.value !== 0 && (
                  <NewGameTile
                    key={rowIndex * BOARD_SIZE + colIndex}
                    tile={tile}
                  />
                )
              );
            });
          })}
        </div>
      </div>
      {openModal && (
        <BasicModal
          isOpen={openModal}
          title={boardState.won ? "You won" : "You lost"}
          closeModal={setOpenModal}
          className="max-w-md"
          confetti={boardState.won && <ConfettiComponent />}
        >
          <div className="mt-4 flex w-full items-baseline gap-2 border-t border-emerald-500 py-2 text-base">
            <span className="text-lg">
              {boardStore.highscore === boardState.score
                ? "New highscore "
                : "Score "}
            </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {boardState.score}
            </span>
          </div>
          <div className="my-2 flex justify-end">
            <button
              aria-label="Reset game"
              onClick={() => dispatchState({ type: "INITIAL" })}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5 sm:h-10 sm:w-10"
            >
              <ArrowPathIcon className="h-7 w-7 stroke-zinc-900 dark:stroke-emerald-300 sm:h-8 sm:w-8" />
            </button>
          </div>
        </BasicModal>
      )}
    </div>
  );
}
