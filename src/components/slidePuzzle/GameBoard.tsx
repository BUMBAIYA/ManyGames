import {
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import useEvent from "../../hooks/useEvent";
import { classNames } from "../../utility/css";
import { splitImageToTiles, verifyImageUrl } from "../../utility/image";
import GameWonLostModal from "../GameWonLostModal";
import { GameBoard } from "./GameLogic";
import PreviewModal from "./PreviewModal";
import { SlidePuzzleSettingModal } from "./SettingModal";

export interface IPuzzleProps {}

export default function SlidePuzzleBoard(props: IPuzzleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [boardTileDimenstion, setBoardTileDimension] = useState({
    col: 7,
    row: 5,
  });
  const [board, setBoard] = useState(
    new GameBoard(boardTileDimenstion.col, boardTileDimenstion.row)
  );
  const [imageUrl, setImageUrl] = useState<string>("/assets/puzzle.jpg");
  const [imageTiles, setImageTiles] = useState<string[]>([]);
  const [openSettingModal, setOpenSettingModal] = useState<boolean>(false);
  const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);
  const [openWonModal, setOpenWonModal] = useState<boolean>(true);
  const [loadingBoard, setLoadingBoard] = useState<boolean>(true);

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
          boardTileDimenstion.col
        );
        setImageTiles(tileImages);
      }
      setLoadingBoard(!valid);
    }
    verifyImage();
  }, [imageUrl, boardTileDimenstion]);

  useEffect(() => {
    setBoard(new GameBoard(boardTileDimenstion.col, boardTileDimenstion.row));
  }, [boardTileDimenstion]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.currentTarget !== document.activeElement) return;
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

  useEvent(document.body, "keydown", handleKeyDown, false);

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
  };

  const renderWonModal = () => {
    if (board.won) {
      return (
        <GameWonLostModal
          type="won"
          isOpen={openWonModal}
          closeModal={handleCloseWonModal}
          stats={{
            game: "slidePuzzle",
            isLowestScore: true,
            totalMoves: board.movesCount,
            row: boardTileDimenstion.row,
            col: boardTileDimenstion.col,
          }}
        />
      );
    } else null;
  };

  return (
    <div className="flex flex-col justify-center gap-10">
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="flex w-full flex-col-reverse items-center justify-center gap-6 lg:flex-row lg:items-start">
        {loadingBoard && (
          <div className="flex w-full max-w-3xl items-center justify-center gap-2 text-zinc-900 dark:text-emerald-400">
            <ArrowPathIcon className="h-6 w-6 animate-spin stroke-zinc-900 dark:stroke-emerald-400" />
            <h1 className="text-2xl">Building board...</h1>
          </div>
        )}
        {!loadingBoard && (
          <div
            className={classNames(
              board.hasWon() ? "" : "gap-0.5 md:gap-1",
              "grid w-full max-w-3xl select-none rounded-md bg-zinc-900 p-1 dark:bg-emerald-800"
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
                    "h-full w-full bg-cover bg-no-repeat"
                  )}
                ></img>
              );
            })}
          </div>
        )}
        <div className="flex w-full items-center justify-between gap-4 lg:w-auto lg:flex-col">
          <div className="inline rounded-md bg-emerald-400/10 px-4 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 lg:w-full">
            <span className="text-xs sm:text-base">Moves</span>
            <p className="text-base font-semibold sm:text-3xl">
              {board.movesCount}
            </p>
          </div>
          <div className="flex items-center gap-2 lg:flex-col">
            <button
              className="w-full rounded-md bg-emerald-400/10 p-2 text-base font-semibold ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 sm:px-4 lg:text-lg"
              onClick={() => setOpenPreviewModal((prev) => !prev)}
            >
              <span className="hidden text-base font-semibold text-emerald-600 dark:text-emerald-300 sm:block lg:text-lg">
                {openPreviewModal ? "Hide" : "Preview"}
              </span>
              {openPreviewModal ? (
                <EyeSlashIcon className="block h-6 w-6 stroke-emerald-600 dark:stroke-emerald-400 sm:hidden" />
              ) : (
                <EyeIcon className="block h-6 w-6 stroke-emerald-600 dark:stroke-emerald-400 sm:hidden" />
              )}
            </button>

            <button
              className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400 dark:ring-1 dark:ring-inset  dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4 lg:w-full "
              onClick={handleResetGame}
            >
              <span className="hidden text-base font-semibold text-white dark:text-zinc-900 sm:block lg:text-lg">
                Reset
              </span>
              <ArrowPathIcon className="block h-6 w-6 text-white dark:text-zinc-900 sm:hidden" />
            </button>

            <button
              className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400 dark:ring-1  dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4"
              onClick={() => setOpenSettingModal(true)}
            >
              <span className="text-base font-semibold text-white dark:text-zinc-900 lg:text-lg">
                Settings
              </span>
            </button>
          </div>
        </div>
      </div>
      {renderWonModal()}
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
    </div>
  );
}
