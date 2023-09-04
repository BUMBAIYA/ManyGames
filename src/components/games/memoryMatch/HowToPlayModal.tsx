import { useEffect, useReducer, useRef, useState } from "react";
import { BasicModal, BasicModalProps } from "../../modal/BasicModal";
import { classNames } from "../../../utility/css";
import styles from "./styles.module.css";
import { MemoryMatchHelper as MMH } from "./helper";
import { uuid4 } from "../../../utility/uuidGenerator";

const TILE_STATE = [
  "🍒",
  "🍍",
  "🍊",
  "🍋",
  "🍇",
  "💣",
  "🍋",
  "🍇",
  "🍊",
  "🍈",
  "🍒",
  "🥑",
  "💣",
  "🥑",
  "🍈",
  "🍍",
];

const MOVES = [
  [1],
  [13],
  [12],
  [10],
  [0, 10],
  [0, 10, 15],
  [0, 10, 15, 1],
  [0, 10, 15, 1, 12],
  [-1],
];

const generateTiles = (): MMH.MemoryMatchTile[] => {
  return TILE_STATE.map((value, index) => {
    return {
      name: value,
      commonID: index,
      id: uuid4(),
      isVisited: false,
      isCorrectGuessed: false,
      isCurrentlyVisible: false,
    };
  });
};

type HowToPlayModalProps = {} & BasicModalProps;

const initialState: MMH.MemoryMatchTile[] = generateTiles();

export function HowToPlayModal(props: HowToPlayModalProps) {
  const {
    isOpen,
    className,
    closeModal,
    showInitially,
    handleChangeVisiblity,
  } = props;

  const refTimer = useRef<number>(0);
  const refMoves = useRef(0);

  const moveReducer = (state: MMH.MemoryMatchTile[], action: number[]) => {
    if (MOVES[refMoves.current].includes(-1)) {
      return state.map((t) => {
        return { ...t, isCurrentlyVisible: false };
      });
    } else {
      return state.map((t, index) => {
        return MOVES[refMoves.current].includes(index)
          ? { ...t, isCurrentlyVisible: true }
          : { ...t, isCurrentlyVisible: false };
      });
    }
  };

  const [tiles, dispatchMove] = useReducer(moveReducer, initialState);

  const handleClose = () => {
    closeModal(false);
  };

  const isTileRepeated = (name: string) => {
    let isRepeated = 0;
    if (MOVES[refMoves.current].includes(-1)) return false;
    for (let i = 0; i < MOVES[refMoves.current].length; i++) {
      if (tiles[MOVES[refMoves.current][i]].name === name) {
        isRepeated++;
      } else {
      }
    }
    return isRepeated === 2;
  };

  useEffect(() => {
    refTimer.current = setInterval(() => {
      dispatchMove(MOVES[refMoves.current]);
      refMoves.current++;
      if (refMoves.current === MOVES.length) {
        refMoves.current = 0;
      }
    }, 1800);

    return () => {
      clearInterval(refTimer.current);
    };
  }, []);

  return (
    <BasicModal
      title="How to play"
      closeModal={handleClose}
      isOpen={isOpen}
      className={className}
      showInitially={showInitially}
      handleChangeVisiblity={handleChangeVisiblity}
    >
      <div className="mt-2 flex flex-col gap-2 border-t border-emerald-500 py-4 sm:flex-row ">
        <div className="flex w-full justify-center">
          <div
            className="mx-auto inline-grid select-none grid-rows-4 gap-1"
            style={{
              gridTemplateColumns: "repeat(4, minmax(0, 3.25rem))",
            }}
          >
            {tiles.map((tile, index) => (
              <div
                key={index}
                className={classNames(
                  "relative inline-flex aspect-square w-full select-none items-center justify-center rounded-md border bg-white p-2 text-2xl dark:bg-zinc-900 md:border-2",
                  tile.isCurrentlyVisible ? `${styles.spinx}` : "",
                  isTileRepeated(tile.name)
                    ? "border-[#FFD700] bg-gray-300/40 md:border-[3px]"
                    : "border-emerald-500/70",
                )}
              >
                {tile.isCurrentlyVisible ? tile.name : null}
              </div>
            ))}
          </div>
        </div>
        <div className="inline-flex flex-col gap-2 py-2 text-sm">
          <p>
            Your task is to click on two tiles to reveal the emojis underneath.
            Remember, you can only flip two tiles at a time.
          </p>
          <p>
            If the emojis on the flipped tiles match, great job! You've found a
            pair, and those tiles will remain face-up. If the emojis don't
            match, don't worry! The tiles will flip face-down again, and you can
            continue searching for matching pairs.
          </p>
          <p>
            <span className="text-sm font-semibold text-emerald-500">
              Bomb Mode:
            </span>{" "}
            Not only do you need to match the pairs of emojis, but you also have
            to avoid flipping the hidden bombs 💣 twice.
          </p>
          <div className="text-sm">
            <span className="font-semibold text-emerald-500">Note</span>: Visit
            Setting to switch game mode
          </div>
        </div>
      </div>
    </BasicModal>
  );
}
