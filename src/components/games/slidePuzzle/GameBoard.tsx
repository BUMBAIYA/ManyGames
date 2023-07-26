import { useEffect, useRef, useState } from "react";
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  EyeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useSwipeable } from "react-swipeable";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { useHotkey } from "../../../hooks/useHotKey";
import GameWonLostModal from "../../modal/GameWonLostModal";
import { BuildingBoardLoader } from "./BuildingBoardLoader";
import { ErrorMessage } from "./ErrorMessage";
import { PreviewModal } from "./PreviewModal";
import { SlidePuzzleSettingModal } from "./SettingModal";
import { BasicModal } from "../../modal/BasicModal";
import { generateRandomTiles, getPositionOfEmptyTile } from "./helper";
import { splitImageToTiles, verifyImageUrl } from "../../../utility/image";
import { classNames } from "../../../utility/css";
import PageMeta from "../../utility/PageMeta";

export const DEFAULT_PUZZLE_IMG_URL = import.meta.env.PROD
  ? "https://manygames.vercel.app/assets/puzzle.jpg"
  : "/assets/puzzle.jpg";

export const PUZZLE_SIZES = [3, 4, 5, 6] as const;

type MoveDirection = "UP" | "DOWN" | "RIGHT" | "LEFT";

type SlidePuzzleData = {
  size: number;
  imageUrl: string;
  highscore: number;
  currentMove: number;
};

export default function SlidePuzzleBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isError, setIsError] = useState<boolean>(false);
  const [isBoardBuilding, setIsBoardBuilding] = useState<boolean>(true);
  const [isWon, setIsWon] = useState<boolean>(false);

  const [boardData, setBoardData] = useLocalStorage<SlidePuzzleData>(
    "puzzle-data",
    {
      size: 3,
      imageUrl: DEFAULT_PUZZLE_IMG_URL,
      highscore: 0,
      currentMove: 0,
    },
  );
  const [tiles, setTiles] = useLocalStorage<number[]>(
    "puzzle-state",
    generateRandomTiles(boardData.size),
  );

  const [imageTiles, setImageTiles] = useState<string[]>([]);

  const [openWonModal, setOpenWonModal] = useState<boolean>(false);
  const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);
  const [openSettingModal, setOpenSettingModal] = useState<boolean>(false);
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);

  const [emptyTileIndex, setEmptyTileIndex] = useState<number>(0);

  const loadImage = async (imageUrl: string, size: number) => {
    let imageValidity = false;
    imageValidity = await verifyImageUrl(imageUrl);
    if (imageValidity) {
      const tileImages = await splitImageToTiles(
        imageUrl,
        canvasRef,
        size,
        size,
      );
      setImageTiles(tileImages);
    } else {
      setIsError(true);
    }
    setIsBoardBuilding(!imageValidity);
  };

  const swapTile = (indexToBeSwiped: number) => {
    let tempTile = [...tiles];
    [tempTile[emptyTileIndex], tempTile[indexToBeSwiped]] = [
      tempTile[indexToBeSwiped],
      tempTile[emptyTileIndex],
    ];
    return tempTile;
  };

  const checkWonCondition = () => {
    for (let i = 0; i < boardData.size * boardData.size; i++) {
      if (tiles[i] !== i) return false;
    }
    return true;
  };

  const handleMoveTile = (dir: MoveDirection) => {
    switch (dir) {
      case "UP": {
        let indexToBeSwaped = emptyTileIndex + boardData.size;
        if (indexToBeSwaped > boardData.size * boardData.size - 1) break;
        setTiles(swapTile(indexToBeSwaped));
        setBoardData({ ...boardData, currentMove: boardData.currentMove + 1 });
        break;
      }
      case "DOWN": {
        if (emptyTileIndex - boardData.size < 0) break;
        let indexToBeSwaped = emptyTileIndex - boardData.size;
        setTiles(swapTile(indexToBeSwaped));
        setBoardData((prev) => ({
          ...prev,
          currentMove: prev.currentMove + 1,
        }));
        break;
      }
      case "RIGHT": {
        if (emptyTileIndex === 0) break;
        if (emptyTileIndex % boardData.size === 0) break;
        setTiles(swapTile(emptyTileIndex - 1));
        setBoardData((prev) => ({
          ...prev,
          currentMove: prev.currentMove + 1,
        }));
        break;
      }
      case "LEFT": {
        if ((emptyTileIndex + 1) % boardData.size === 0) break;
        setTiles(swapTile(emptyTileIndex + 1));
        setBoardData((prev) => ({
          ...prev,
          currentMove: prev.currentMove + 1,
        }));
        break;
      }
      default:
        return;
    }
  };

  useEffect(() => {
    setEmptyTileIndex(getPositionOfEmptyTile(tiles));
    let isWon = checkWonCondition();
    setIsWon(isWon);
    if (isWon) {
      setTimeout(() => {
        setOpenWonModal(true);
      }, 1500);
    }
  }, [tiles]);

  useEffect(() => {
    loadImage(boardData.imageUrl, boardData.size);
  }, [boardData.imageUrl, boardData.size]);

  const handleResetBoard = () => {
    setBoardData({ ...boardData, currentMove: 0 });
    setTiles(generateRandomTiles(boardData.size));
  };

  const handleUpatePuzzle = (img: string, size: number) => {
    setIsBoardBuilding(true);
    setBoardData({ ...boardData, currentMove: 0, size, imageUrl: img });
    loadImage(img, size);
    setTiles(generateRandomTiles(size));
  };

  const handleCloseWonModal = () => {
    setOpenWonModal(false);
    if (
      boardData.currentMove < boardData.highscore ||
      boardData.highscore === 0
    ) {
      setBoardData((prev) => ({
        ...prev,
        highscore: boardData.currentMove,
        currentMove: 0,
      }));
    } else {
      setBoardData({ ...boardData, currentMove: 0 });
    }
    setIsWon(false);
    setTiles(generateRandomTiles(boardData.size));
  };

  useHotkey([
    ["ArrowUp", () => handleMoveTile("UP")],
    ["ArrowDown", () => handleMoveTile("DOWN")],
    ["ArrowRight", () => handleMoveTile("RIGHT")],
    ["ArrowLeft", () => handleMoveTile("LEFT")],
  ]);

  const touchSwipeHandlers = useSwipeable({
    onSwipedUp: () => {
      handleMoveTile("UP");
    },
    onSwipedDown: () => {
      handleMoveTile("DOWN");
    },
    onSwipedRight: () => {
      handleMoveTile("RIGHT");
    },
    onSwipedLeft: () => {
      handleMoveTile("LEFT");
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <>
      <PageMeta
        title="ManyGames | Slide Puzzle"
        description="Play sliding puzzle online with different levels of difficulties"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="relative flex flex-col justify-center gap-4 xl:flex-row-reverse">
        <div className="flex w-full flex-col justify-between gap-2 xl:w-auto xl:flex-col xl:justify-start">
          <div className="flex w-full justify-end">
            <button
              onClick={() => setOpenInfoModal(true)}
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
              aria-label="How to play"
            >
              <InformationCircleIcon className="h-8 w-8 stroke-zinc-900 dark:stroke-emerald-300" />
            </button>
            <BasicModal
              title="How to Play"
              isOpen={openInfoModal}
              closeModal={setOpenInfoModal}
              className="max-w-xl"
            >
              <div className="mt-2 flex w-full flex-col justify-center gap-2 border-t border-emerald-500 p-4 text-black dark:text-white">
                <span className="font-base w-full text-sm leading-relaxed">
                  Welcome to our exciting puzzle game! Your goal is to complete
                  the given image by moving the puzzle pieces around. Challenge
                  yourself by adjusting the difficulty level in the settings. As
                  you play the game. You can preview the puzzle using preview
                  option in the game. Get ready to test your wits and have fun
                  piecing together the images in this engaging and brain-teasing
                  game! Happy puzzling!
                </span>
              </div>
            </BasicModal>
          </div>
          <div className="flex w-full justify-between gap-2 xl:flex-col">
            <div className="flex w-full flex-row gap-2 md:w-auto xl:flex-col">
              <div className="inline rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 md:px-4 lg:w-full">
                <span className="text-xs sm:text-base">Moves</span>
                <p className="text-base font-semibold sm:text-3xl">
                  {boardData.currentMove}
                </p>
              </div>
              <div className="inline rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 md:px-4 lg:w-full">
                <span className="text-xs sm:text-base">Highscore</span>
                <p className="text-base font-semibold sm:text-3xl">
                  {boardData.highscore}
                </p>
              </div>
            </div>
            <div className="flex h-min gap-2 xl:flex-1 xl:flex-col">
              <button
                className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4 lg:w-full"
                aria-label="preview puzzle"
                onClick={() => setOpenPreviewModal(true)}
              >
                <span className="hidden text-base font-semibold text-white dark:text-zinc-900 sm:block lg:text-lg">
                  Preview
                </span>
                <EyeIcon className="block h-6 w-6 stroke-white dark:stroke-zinc-900 sm:hidden" />
              </button>
              <PreviewModal
                title="Puzzle preview"
                isOpen={openPreviewModal}
                closeModal={setOpenPreviewModal}
                className="max-w-2xl"
                imageUrl={boardData.imageUrl}
              />
              <button
                className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4 lg:w-full"
                aria-label="reset puzzle"
                onClick={handleResetBoard}
              >
                <span className="hidden text-base font-semibold text-white dark:text-zinc-900 sm:block lg:text-lg">
                  Reset
                </span>
                <ArrowPathIcon className="block h-6 w-6 text-white dark:text-zinc-900 sm:hidden" />
              </button>
              <button
                className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4 lg:w-full"
                aria-label="puzzle setting"
                onClick={() => setOpenSettingModal(true)}
              >
                <span className="hidden text-base font-semibold text-white dark:text-zinc-900 sm:block lg:text-lg">
                  Setting
                </span>
                <Cog6ToothIcon className="block h-6 w-6 text-white dark:text-zinc-900 sm:hidden" />
              </button>
              <SlidePuzzleSettingModal
                isOpen={openSettingModal}
                closeModal={setOpenSettingModal}
                imageUrl={boardData.imageUrl}
                size={boardData.size}
                submit={handleUpatePuzzle}
              />
            </div>
          </div>
        </div>
        {isError && <ErrorMessage />}
        {isError ? null : isBoardBuilding ? (
          <BuildingBoardLoader />
        ) : (
          <div
            {...touchSwipeHandlers}
            className={classNames(
              isWon ? "" : "gap-[2px] sm:gap-1",
              "grid w-full max-w-3xl select-none rounded-sm bg-zinc-900 p-[2px] dark:bg-emerald-800 sm:rounded-md sm:p-1",
            )}
            style={{
              gridTemplateColumns: `repeat(${boardData.size}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${boardData.size}, minmax(0, 1fr))`,
            }}
          >
            {tiles.map((_tile, index) => {
              if (index === emptyTileIndex && !isWon) {
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
                    isWon ? "" : "rounded-sm",
                    "pointer-events-none h-full w-full select-none bg-cover bg-no-repeat",
                  )}
                />
              );
            })}
          </div>
        )}
        {isWon && (
          <GameWonLostModal
            isOpen={openWonModal}
            closeModal={handleCloseWonModal}
            isWon
          >
            <div className="mt-4">
              <p className="mb-1 text-sm text-gray-500">
                {`${
                  boardData.currentMove < boardData.highscore
                    ? "New Lowest Score"
                    : "Score"
                } for ${boardData.size}x${boardData.size} board`}
              </p>
              <p className="text-3xl font-bold text-emerald-500">
                {boardData.currentMove}
              </p>
            </div>
          </GameWonLostModal>
        )}
      </div>
    </>
  );
}
