import { useSwipeable } from "react-swipeable";
import {
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { classNames } from "../../../utility/css";
import { splitImageToTiles, verifyImageUrl } from "../../../utility/image";
import GameWonLostModal from "../../modal/GameWonLostModal";
import PageMeta from "../../utility/PageMeta";
import { GameBoard } from "./GameLogic";
import PreviewModal from "./PreviewModal";
import { SlidePuzzleSettingModal } from "./SettingModal";
import { useEventListener } from "../../../hooks/useEventListener";

enum MoveDirection {
  UP = 1,
  DOWN = 3,
  RIGHT = 2,
  LEFT = 4,
}

export const DEFAULT_SLIDEPUZZLE_IMG_URL = import.meta.env.PROD
  ? "https://manygames.vercel.app/assets/puzzle.jpg"
  : "/assets/puzzle.jpg";

export interface IPuzzleProps {}

export default function SlidePuzzleBoard(props: IPuzzleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const refLoadingError = useRef<HTMLElement>(null);

  const [boardTileDimenstion, setBoardTileDimension] = useLocalStorage(
    "slidingpuzzle-boardsize",
    {
      col: 7,
      row: 5,
    },
  );
  const [board, setBoard] = useState(
    new GameBoard(boardTileDimenstion.col, boardTileDimenstion.row),
  );
  const [imageUrl, setImageUrl] = useLocalStorage<string>(
    "slidepuzzle-imageUrl",
    DEFAULT_SLIDEPUZZLE_IMG_URL,
  );
  const [imageTiles, setImageTiles] = useState<string[]>([]);
  const [openSettingModal, setOpenSettingModal] = useState<boolean>(false);
  const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);
  const [openWonModal, setOpenWonModal] = useState<boolean>(true);
  const [loadingBoard, setLoadingBoard] = useState<boolean>(true);
  const [lowestMoves, setLowestMoves] = useLocalStorage<number>(
    "slidepuzzle-lowestmoves",
    0,
  );

  const getClonedBoard = (): GameBoard => {
    return Object.assign(Object.create(Object.getPrototypeOf(board)), board);
  };

  const handleMoveTile = (dir: MoveDirection) => {
    let newBoard = getClonedBoard().moveTile(dir);
    if (newBoard == null) return;
    setBoard(newBoard);
  };

  useEffect(() => {
    setLoadingBoard(true);
    let valid = false;
    async function verifyImage() {
      valid = await verifyImageUrl(imageUrl);
      if (valid) {
        const tileImages = await splitImageToTiles(
          imageUrl,
          canvasRef,
          boardTileDimenstion.row,
          boardTileDimenstion.col,
        );
        setImageTiles(tileImages);
      } else {
        if (refLoadingError.current) {
          refLoadingError.current.innerHTML =
            "Error! Check Internet connection or reload page";
          refLoadingError.current.style.color = "red";
          refLoadingError.current.previousElementSibling?.classList.toggle(
            "hidden",
          );
        }
      }
      setLoadingBoard(!valid);
    }
    verifyImage();
  }, [imageUrl, boardTileDimenstion.row, boardTileDimenstion.col]);

  useEffect(() => {
    setBoard(new GameBoard(boardTileDimenstion.col, boardTileDimenstion.row));
  }, [boardTileDimenstion.col, boardTileDimenstion.row]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.currentTarget !== document.activeElement) return;
    if (event.keyCode > 40 || event.keyCode < 37) return;
    event.preventDefault();
    if (event.repeat) return;

    switch (event.key) {
      case "ArrowUp": {
        handleMoveTile(MoveDirection.UP);
        break;
      }
      case "ArrowDown": {
        handleMoveTile(MoveDirection.DOWN);
        break;
      }
      case "ArrowRight": {
        handleMoveTile(MoveDirection.RIGHT);
        break;
      }
      case "ArrowLeft": {
        handleMoveTile(MoveDirection.LEFT);
        break;
      }
      default: {
        return;
      }
    }
  };

  useEventListener("keydown", handleKeyDown, document.body, false);

  const touchSwipeHandlers = useSwipeable({
    onSwipedUp: () => {
      handleMoveTile(MoveDirection.UP);
    },
    onSwipedDown: () => {
      handleMoveTile(MoveDirection.DOWN);
    },
    onSwipedRight: () => {
      handleMoveTile(MoveDirection.RIGHT);
    },
    onSwipedLeft: () => {
      handleMoveTile(MoveDirection.LEFT);
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleResetGame = () => {
    setBoard(new GameBoard(boardTileDimenstion.col, boardTileDimenstion.row));
  };

  const handleUpatePuzzle = (img: string, col: number, row: number) => {
    setImageUrl(img);
    setBoardTileDimension({ col, row });
  };

  const handleCloseSettingModal = () => {
    setOpenSettingModal(false);
  };

  const handleCloseWonModal = () => {
    setOpenWonModal(false);
    handleResetGame();
    setOpenWonModal(true);
    if (board.movesCount < lowestMoves || lowestMoves === 0) {
      setLowestMoves(board.movesCount);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-10">
      <PageMeta
        title="ManyGames | Slide Puzzle"
        description="Play sliding puzzle online with different levels of difficulties"
      />
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="flex w-full flex-col-reverse items-center justify-center gap-6 lg:flex-row lg:items-start">
        {loadingBoard && (
          <div className="flex w-full max-w-3xl items-center justify-center gap-2 text-zinc-900 dark:text-emerald-400">
            <ArrowPathIcon className="h-6 w-6 animate-spin stroke-zinc-900 dark:stroke-emerald-400" />
            <span ref={refLoadingError} className="text-2xl">
              Building board...
            </span>
          </div>
        )}
        {!loadingBoard && (
          <div
            {...touchSwipeHandlers}
            className={classNames(
              board.hasWon() ? "" : "gap-[2px] sm:gap-1",
              "grid w-full max-w-3xl select-none rounded-sm bg-zinc-900 p-[2px] dark:bg-emerald-800 sm:rounded-md sm:p-1",
            )}
            style={{
              gridTemplateColumns: `repeat(${boardTileDimenstion.col}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${boardTileDimenstion.row}, minmax(0, 1fr))`,
            }}
          >
            {board.tiles.map((_tile, index) => {
              if (
                _tile ===
                  boardTileDimenstion.col * boardTileDimenstion.row - 1 &&
                !board.won
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
                    board.hasWon() ? "" : "rounded-sm",
                    "pointer-events-none h-full w-full select-none bg-cover bg-no-repeat",
                  )}
                />
              );
            })}
          </div>
        )}
        <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row lg:w-auto lg:flex-col">
          <div className="flex w-full flex-row gap-2 lg:flex-col">
            <div className="inline rounded-md bg-emerald-400/10 px-4 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 lg:w-full">
              <span className="text-xs sm:text-base">Moves</span>
              <p className="text-base font-semibold sm:text-3xl">
                {board.movesCount}
              </p>
            </div>
            <div className="inline rounded-md bg-emerald-400/10 px-4 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20">
              <span className="text-xs sm:text-base">Lowest moves</span>
              <p className="text-base font-semibold sm:text-3xl">
                {lowestMoves}
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-2 lg:w-full lg:flex-col">
            <button
              className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4 lg:w-full"
              onClick={() => setOpenPreviewModal((prev) => !prev)}
            >
              <span className="hidden text-base font-semibold text-white dark:text-zinc-900 sm:block lg:text-lg">
                {openPreviewModal ? "Hide" : "Preview"}
              </span>
              {openPreviewModal ? (
                <EyeSlashIcon className="block h-6 w-6 stroke-white dark:stroke-zinc-900 sm:hidden" />
              ) : (
                <EyeIcon className="block h-6 w-6 stroke-white dark:stroke-zinc-900 sm:hidden" />
              )}
            </button>

            <button
              className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4 lg:w-full"
              onClick={handleResetGame}
            >
              <span className="hidden text-base font-semibold text-white dark:text-zinc-900 sm:block lg:text-lg">
                Reset
              </span>
              <ArrowPathIcon className="block h-6 w-6 text-white dark:text-zinc-900 sm:hidden" />
            </button>

            <button
              className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4 lg:w-full"
              onClick={() => setOpenSettingModal(true)}
            >
              <span className="text-base font-semibold text-white dark:text-zinc-900 lg:text-lg">
                Settings
              </span>
            </button>
          </div>
        </div>
      </div>
      <SlidePuzzleSettingModal
        isOpen={openSettingModal}
        closeModal={handleCloseSettingModal}
        imageUrl={imageUrl}
        col={boardTileDimenstion.col}
        row={boardTileDimenstion.row}
        submit={handleUpatePuzzle}
      />
      <PreviewModal
        isOpen={openPreviewModal}
        closeModal={() => setOpenPreviewModal(false)}
        imageUrl={imageUrl}
      />
      {board.hasWon() && (
        <GameWonLostModal
          isOpen={openWonModal}
          closeModal={handleCloseWonModal}
          type="won"
        >
          <div className="mt-4">
            <p className="mb-1 text-sm text-gray-500">
              {`${
                board.movesCount < lowestMoves ? "New Lowest Score" : "Score"
              } for ${boardTileDimenstion.row}x${
                boardTileDimenstion.col
              } board`}
            </p>
            <p className="text-3xl font-bold text-emerald-500">
              {board.movesCount}
            </p>
          </div>
        </GameWonLostModal>
      )}
    </div>
  );
}
