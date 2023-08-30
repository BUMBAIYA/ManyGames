import { useEffect, useReducer, useRef, useState } from "react";
import { classNames } from "../../../utility/css";
import { BasicModal, BasicModalProps } from "../../modal/BasicModal";
import {
  generateTileForHowToPlay,
  getPositionOfEmptyTile,
  swapElementInArray,
} from "./helper";
import { MoveDirection } from "./GameBoard";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import styles from "./styles.module.css";

type WordleHowToPlayProps = {
  imageTiles: string[];
  aspectRatio: number;
  size: number;
} & BasicModalProps;

type ReducerState = {
  tiles: number[];
  emptyTileIndex: number;
};

type ReducerAction = MoveDirection | "RESET" | "NONE";

export function PuzzleHowToPlay(props: WordleHowToPlayProps) {
  const {
    isOpen,
    closeModal,
    imageTiles,
    aspectRatio,
    size,
    className,
    showInitially,
    handleChangeVisiblity,
  } = props;
  const refTimer = useRef(0);
  const refMoves = useRef(0);

  const initialMoves: MoveDirection[] = ["RIGHT", "DOWN", "RIGHT", "DOWN"];

  const moves: ReducerAction[] = [
    "NONE",
    "UP",
    "LEFT",
    "UP",
    "LEFT",
    "NONE",
    "RESET",
  ];

  const moveReducer = (state: ReducerState, action: ReducerAction) => {
    switch (action) {
      case "UP": {
        let indexToBeSwaped = state.emptyTileIndex + size;
        if (indexToBeSwaped > size * size - 1) return state;
        let tiles = swapElementInArray(
          state.tiles,
          indexToBeSwaped,
          state.emptyTileIndex,
        );
        let emptyTileIndex = getPositionOfEmptyTile(tiles);
        return { tiles, emptyTileIndex };
      }
      case "DOWN": {
        if (state.emptyTileIndex - size < 0) return state;
        let indexToBeSwaped = state.emptyTileIndex - size;
        let tiles = swapElementInArray(
          state.tiles,
          indexToBeSwaped,
          state.emptyTileIndex,
        );
        let emptyTileIndex = getPositionOfEmptyTile(tiles);
        return { tiles, emptyTileIndex };
      }
      case "RIGHT": {
        if (state.emptyTileIndex % size === 0 || state.emptyTileIndex === 0)
          return state;
        let tiles = swapElementInArray(
          state.tiles,
          state.emptyTileIndex,
          state.emptyTileIndex - 1,
        );
        let emptyTileIndex = getPositionOfEmptyTile(tiles);
        return { tiles, emptyTileIndex };
      }
      case "LEFT": {
        if ((state.emptyTileIndex + 1) % size === 0) return state;
        let tiles = swapElementInArray(
          state.tiles,
          state.emptyTileIndex,
          state.emptyTileIndex + 1,
        );
        let emptyTileIndex = getPositionOfEmptyTile(tiles);
        return { tiles, emptyTileIndex };
      }
      case "RESET": {
        let { tiles, emptyTileIndex } = generateTileForHowToPlay(
          size,
          initialMoves,
        );
        return { tiles, emptyTileIndex };
      }
      case "NONE": {
        return state;
      }
      default: {
        return state;
      }
    }
  };

  const initialState: ReducerState = generateTileForHowToPlay(
    size,
    initialMoves,
  );

  const [boardState, dispatchMove] = useReducer(moveReducer, initialState);

  const handleCloseModal = () => {
    closeModal(false);
  };

  useEffect(() => {
    refTimer.current = setInterval(() => {
      dispatchMove(moves[refMoves.current]);
      refMoves.current++;
      if (refMoves.current === moves.length) {
        refMoves.current = 0;
      }
    }, 1000);
    return () => {
      clearInterval(refTimer.current);
    };
  }, []);

  return (
    <BasicModal
      title="How to play"
      isOpen={isOpen}
      closeModal={handleCloseModal}
      className={props.className}
      showInitially={showInitially}
      handleChangeVisiblity={handleChangeVisiblity}
    >
      <div className="mt-2 flex w-full flex-col gap-2 border-t border-emerald-500 py-2 text-sm">
        <span>You have to complete the puzzle by shuffling the tiles.</span>
        <span>
          Use keyboad arrrow keys or swipe on the game board to move the tile.
        </span>
        <span>
          Move the tile into empty slot using swipe or keyboard arrows as show
          in example. After the correct pieces are in place puzzle will be
          solved.
        </span>
        <div className="my-2 w-full border-t border-emerald-500"></div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex w-full justify-center sm:w-1/2">
            <div
              className={classNames(
                boardState.emptyTileIndex === size * size - 1
                  ? "gap-0"
                  : "gap-[2px] sm:gap-1",
                props.aspectRatio < 1 ? "h-80 lg:h-72" : "w-full",
                "grid max-w-3xl select-none rounded-sm bg-zinc-900 p-[2px] dark:bg-emerald-800 sm:rounded-md sm:p-1",
              )}
              style={{
                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
                aspectRatio,
              }}
            >
              {boardState.tiles.map((_tile, index) => {
                if (
                  index === boardState.emptyTileIndex &&
                  boardState.emptyTileIndex !== size * size - 1
                ) {
                  return (
                    <div
                      key={index}
                      className="h-full w-full rounded-sm bg-white text-black dark:bg-zinc-900"
                    ></div>
                  );
                }
                return (
                  <img
                    src={imageTiles[_tile]}
                    key={index}
                    className={classNames(
                      boardState.emptyTileIndex === size * size - 1
                        ? ""
                        : "rounded-sm",
                      "pointer-events-none h-full w-full select-none bg-cover bg-no-repeat",
                    )}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col justify-start sm:w-1/2">
            <div className="mt-4 flex w-full flex-col gap-2">
              <div className="flex justify-center">
                <span
                  className={classNames(
                    moves[refMoves.current - 1] === "UP"
                      ? `${styles.clicked}`
                      : "",
                    "h-9 w-9 rounded-md border-2 border-zinc-300 dark:border-zinc-600",
                  )}
                >
                  <ChevronUpIcon className="dark:text-zinc-400 " />
                </span>
              </div>
              <div className="flex justify-center gap-2">
                <span
                  className={classNames(
                    moves[refMoves.current - 1] === "LEFT"
                      ? `${styles.clicked}`
                      : "",
                    "h-9 w-9 rounded-md border-2 border-zinc-300 dark:border-zinc-600",
                  )}
                >
                  <ChevronLeftIcon className="dark:text-zinc-400" />
                </span>
                <span
                  className={classNames(
                    moves[refMoves.current - 1] === "DOWN"
                      ? `${styles.clicked}`
                      : "",
                    "h-9 w-9 rounded-md border-2 border-zinc-300 dark:border-zinc-600",
                  )}
                >
                  <ChevronDownIcon className="dark:text-zinc-400" />
                </span>
                <span
                  className={classNames(
                    moves[refMoves.current - 1] === "RIGHT"
                      ? `${styles.clicked}`
                      : "",
                    "h-9 w-9 rounded-md border-2 border-zinc-300 dark:border-zinc-600",
                  )}
                >
                  <ChevronRightIcon className="dark:text-zinc-400" />
                </span>
              </div>
            </div>
            <div className="my-4 border-t border-emerald-400"></div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Settings</span>
              <div>
                <span className="text-base text-emerald-600 underline dark:text-emerald-400">
                  Size
                </span>
                <span>
                  : Four board sizes can be choosen from 3x3 4x4 5x5 6x6.
                </span>
              </div>
              <div>
                <span className="text-base text-emerald-600 underline dark:text-emerald-400">
                  Image
                </span>
                <span>
                  : You can choose your favourite image from the internet. Enter
                  the image url in the imageurl field and verify the image first
                  and save to reflect changes.
                </span>
              </div>
              <div>
                <span className="text-base text-emerald-600 underline dark:text-emerald-400">
                  IMPORTANT
                </span>
                <span> :Board will be reset after changing the settings.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicModal>
  );
}
