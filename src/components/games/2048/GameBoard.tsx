import { useState } from "react";
import { Board } from "./GameLogic";
import useEvent from "../../../hooks/useEvent";
import GameTile from "./GameTile";
import GameDetails from "./GameDetails";
import GameWonLostModal from "../../modal/GameWonLostModal";
import useLocalStorage from "../../../hooks/useLocalStorage";
import PageMeta from "../../utility/PageMeta";
import { useSwipeable } from "react-swipeable";

import { BasicModal } from "../../modal/BasicModal";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

enum MoveDirection {
  UP = 1,
  DOWN = 3,
  RIGHT = 2,
  LEFT = 0,
}

export default function GameBoard() {
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [board, setBoard] = useState(new Board());
  const [openWonModal, setOpenWonModal] = useState<boolean>(true);
  const [highScore, setHighScore] = useLocalStorage<number>(
    "2048-highscore",
    0,
  );

  const getClonedBoard = (): Board => {
    return Object.assign(Object.create(Object.getPrototypeOf(board)), board);
  };

  const handleMoveTile = (dir: MoveDirection) => {
    setBoard(getClonedBoard().move(dir));
  };

  const handleHighScore = () => {
    if (board.score > highScore) {
      setHighScore(board.score);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.currentTarget !== document.activeElement) return;
    if (event.keyCode > 40 || event.keyCode < 37) return;
    event.preventDefault();
    if (event.repeat) return;
    if (board.hasWon()) return;
    if (board.hasLost()) return;
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

  useEvent(document.body, "keydown", handleKeyDown, false);

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

  const cells = board.cells.map((row, rowIndex) => {
    return (
      <div key={rowIndex} className="flex gap-1 sm:gap-2">
        {row.map((_, colIndex) => {
          return (
            <div
              className="h-[76px] w-[76px] rounded-md border border-emerald-600 bg-gray-100 shadow-sm dark:border-emerald-800 dark:bg-zinc-900 sm:h-32 sm:w-32"
              key={colIndex}
            />
          );
        })}
      </div>
    );
  });

  const tiles = board.tiles
    .filter((_tile) => _tile.value !== 0)
    .map((_t, index) => {
      return <GameTile tile={_t} key={index} />;
    });

  const handleResetGame = () => {
    setBoard(new Board(4));
  };

  const handleCloseWonModal = () => {
    handleHighScore();
    setOpenWonModal(false);
    handleResetGame();
    setOpenWonModal(true);
  };

  return (
    <div className="flex select-none flex-col-reverse items-center gap-8 md:flex-row md:items-start md:justify-center">
      <PageMeta title="ManyGames | 2048" description="Play 2048 online" />
      <div className="relative" {...touchSwipeHandlers}>
        <div className="flex flex-col gap-1 sm:gap-2">{cells}</div>
        {tiles}
      </div>
      <div className="flex w-full flex-col gap-4 md:w-auto">
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
              <span className="hidden w-full text-sm font-medium leading-relaxed lg:block">
                You can use arrow keys or drag gesture or swipe on the game
                board to move the tiles. Tiles with the same number merge into
                one when they touch. Add them up to reach 2048!
              </span>
              <span className="block w-full text-sm font-medium leading-relaxed lg:hidden">
                You can use drag gesture on the game board to move the tiles.
                Tiles with the same number merge into one when they touch. Add
                them up to reach 2048!
              </span>
            </div>
          </BasicModal>
        </div>
        <div className="w-full">
          <GameDetails
            score={board.score}
            resetGame={handleResetGame}
            highScore={highScore}
          />
        </div>
      </div>

      {board.hasWon() && (
        <GameWonLostModal
          isOpen={openWonModal}
          closeModal={handleCloseWonModal}
          type="won"
        >
          <div className="mt-4">
            <p className="mb-1 text-sm text-gray-500">
              {`${board.score > highScore ? "New High Score" : "Score"}`}
            </p>
            <p className="text-3xl font-bold text-emerald-500">{board.score}</p>
          </div>
        </GameWonLostModal>
      )}
      {(board.hasLost() || board.hasWon()) && (
        <GameWonLostModal
          isOpen={openWonModal}
          closeModal={handleCloseWonModal}
          type={board.hasWon() ? "won" : "lost"}
        >
          <div className="mt-4">
            <p className="mb-1 text-sm text-gray-500">
              {`${board.score > highScore ? "New High Score" : "Score"}`}
            </p>
            <p className="text-3xl font-bold text-emerald-500">{board.score}</p>
          </div>
        </GameWonLostModal>
      )}
    </div>
  );
}
