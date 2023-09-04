import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowPathIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import ConfettiComponent from "../../modal/ConfettiComponent";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { MemoryMatchHelper as MMH } from "./helper";
import { BasicModal } from "../../modal/BasicModal";
import { MemoryMatchSettingModal } from "./SettingModal";
import { HowToPlayModal } from "./HowToPlayModal";
import { GameDetails } from "./GameDetails";
import { classNames } from "../../../utility/css";
import styles from "./styles.module.css";

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

type BoardGridCSS = {
  gridSize: string;
  fontSize: string;
};

type MemoryMatchStore = {
  cs: number;
  ls: number | null;
  bs: number;
  smi: boolean;
};

export default function MemoryMatchBoard() {
  const [isGameLost, setGameLost] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [openWonLostModal, setWonLostModal] = useState<boolean>(false);
  const [openSettingModal, setOpenSettingModal] = useState<boolean>(false);
  const [boardStore, setBoardStore] = useLocalStorage<MemoryMatchStore>(
    "memory-match",
    {
      cs: 0,
      ls: null,
      bs: 4,
      smi: true,
    },
  );
  const [openHowToPlayModal, setOpenHowToPlayModal] = useState<boolean>(
    boardStore.smi,
  );
  const refBoard = useRef<HTMLDivElement>(null);
  const [tiles, setTiles] = useState<MMH.MemoryMatchTile[]>([]);
  const [currentTile, setCurrentTile] = useState<MMH.MemoryMatchTile | null>(
    null,
  );
  const [correctGuessedID, setCorrectGuessedID] = useState<Set<number>>(
    new Set(),
  );

  const checkIsGameLost = (tile: MMH.MemoryMatchTile) => {
    if (tile.commonID === 0 && tile.isVisited === true) {
      setGameLost(true);
      setWonLostModal(true);
      setTiles((prev) =>
        prev.map((t) => {
          return t.id === tile.id || t.isCorrectGuessed === true
            ? { ...t, isCurrentlyVisible: true }
            : { ...t, isCurrentlyVisible: false };
        }),
      );
    }
  };

  const flipConsercativeBomb = (
    currentTile: MMH.MemoryMatchTile,
    tile: MMH.MemoryMatchTile,
  ) => {
    if (currentTile.commonID === 0 && tile.commonID === 0) {
      setCurrentTile(tile);
      setTiles((prev) =>
        prev.map((t) => {
          return t.id === tile.id
            ? { ...t, isCurrentlyVisible: true }
            : t.isCorrectGuessed
            ? t
            : { ...t, isCurrentlyVisible: false };
        }),
      );
    }
  };

  const handleSetVisible = (tile: MMH.MemoryMatchTile) => {
    if (currentTile) {
      if (currentTile.id === tile.id) return;
      incrementScore();
      checkIsGameLost(tile);
      flipConsercativeBomb(currentTile, tile);
      if (currentTile.commonID === tile.commonID) {
        if (hasInvisibleTileWithCommonID(currentTile.commonID, tile.id)) {
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
          const isWon = handleGameWon(tile.commonID);
          if (isWon) {
            setTiles((prev) =>
              prev.map((t) => {
                return { ...t, isCurrentlyVisible: true };
              }),
            );
            return;
          }
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
      incrementScore();
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

  const incrementScore = () => {
    setBoardStore((prev) => {
      return { ...prev, cs: prev.cs + 1 };
    });
  };

  const hasInvisibleTileWithCommonID = (
    commonID: number,
    currentTileID: string,
  ): boolean => {
    return tiles.some((tile) =>
      currentTileID === tile.id
        ? false
        : tile.commonID === commonID && !tile.isCurrentlyVisible,
    );
  };

  const handleGameWon = (currentCommonID: number) => {
    if (
      !tiles.some((t) =>
        t.commonID === 0
          ? false
          : t.commonID === currentCommonID
          ? false
          : !t.isCorrectGuessed,
      )
    ) {
      setIsGameWon(true);
      setWonLostModal(true);
      handleHighScore();
      return true;
    }
    return false;
  };

  const handleHighScore = () => {
    if (boardStore.ls === null || boardStore.cs < boardStore.ls) {
      setBoardStore((prev) => {
        return { ...prev, ls: boardStore.cs };
      });
    }
  };

  const handleResetGame = () => {
    handleBoardSize(boardStore.bs);
    setTiles(MMH.generateNewTiles(VALID_LETTERS, boardStore.bs));
    setCorrectGuessedID(new Set<number>());
    setCurrentTile(null);
    setGameLost(false);
    setIsGameWon(false);
  };

  const handleBoardSize = (size: number) => {
    setBoardStore((prev) => {
      return { ...prev, cs: 0, bs: size };
    });
    setBoardCssVariables(
      size,
      MMH.MEMORY_MATCH_BOARD_CONFIG[size].gridCSSVar.gridMobile,
      MMH.MEMORY_MATCH_BOARD_CONFIG[size].gridCSSVar.gridDesktop,
    );
    setTiles(MMH.generateNewTiles(VALID_LETTERS, boardStore.bs));
  };

  const setBoardCssVariables = (
    size: number,
    gridMobile: BoardGridCSS,
    gridDesktop: BoardGridCSS,
  ) => {
    refBoard.current?.style.setProperty("--board-size", `${size}`);
    refBoard.current?.style.setProperty(
      "--grid-size",
      window.innerWidth <= 640 ? gridMobile.gridSize : gridDesktop.gridSize,
    );
    refBoard.current?.style.setProperty(
      "--font-size",
      window.innerWidth <= 640 ? gridMobile.fontSize : gridDesktop.fontSize,
    );
  };

  const resetBoardCssVar = () => {
    setBoardCssVariables(
      boardStore.bs,
      MMH.MEMORY_MATCH_BOARD_CONFIG[boardStore.bs].gridCSSVar.gridMobile,
      MMH.MEMORY_MATCH_BOARD_CONFIG[boardStore.bs].gridCSSVar.gridDesktop,
    );
  };

  const handleCloseWonLostModal = () => {
    setWonLostModal(false);
    handleResetGame();
  };

  useLayoutEffect(() => {
    resetBoardCssVar();
    setTiles(MMH.generateNewTiles(VALID_LETTERS, boardStore.bs));
    window.addEventListener("resize", resetBoardCssVar);
    return () => window.removeEventListener("resize", resetBoardCssVar);
  }, [boardStore.bs]);

  useEffect(() => {
    handleResetGame();
  }, [boardStore.bs]);

  return (
    <>
      <div className="flex w-full flex-col-reverse items-center gap-4 lg:flex-row lg:items-start lg:justify-center">
        <div ref={refBoard} className={classNames(styles.board_grid, "h-full")}>
          {tiles.map((tile, index) => {
            return (
              <button
                type="button"
                className={classNames(
                  "relative inline-flex h-full w-full select-none rounded-md border bg-white p-2 shadow-sm transition-shadow duration-200 hover:shadow-lg dark:bg-zinc-900 dark:hover:shadow-emerald-400/40 md:border-2",
                  tile.isCurrentlyVisible ? `${styles.spinx}` : "",
                  tile.isCorrectGuessed
                    ? "border-[#FFD700] bg-gray-300/40 md:border-[3px]"
                    : "border-emerald-500/70",
                )}
                style={
                  tile.isCurrentlyVisible
                    ? {}
                    : {
                        animation: `400ms linear ${(index % 6) * 40}ms ${
                          styles.reset_animation
                        }`,
                      }
                }
                key={tile.id}
                onClick={() => handleSetVisible(tile)}
              >
                <span
                  className={classNames(
                    "flex h-full w-full items-center justify-center",
                    tile.isCorrectGuessed ? "opacity-75" : "",
                  )}
                >
                  {tile.isCurrentlyVisible ? tile.name : null}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex w-full justify-end lg:w-auto">
          <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row lg:flex-col">
            <GameDetails score={boardStore.cs} highScore={boardStore.ls} />
            <div className="flex w-full justify-end gap-2 lg:flex-col-reverse">
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
                onClick={() => setOpenSettingModal(true)}
              >
                <Cog6ToothIcon className="h-8 w-8 stroke-zinc-900 dark:stroke-emerald-300" />
              </button>
              <button
                aria-label="How to play"
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
                onClick={() => setOpenHowToPlayModal(true)}
              >
                <InformationCircleIcon className="h-8 w-8 stroke-zinc-900 dark:stroke-emerald-300" />
              </button>
              {openHowToPlayModal && (
                <HowToPlayModal
                  isOpen={openHowToPlayModal}
                  closeModal={setOpenHowToPlayModal}
                  className="max-w-3xl"
                  showInitially={boardStore.smi}
                  handleChangeVisiblity={(vis) =>
                    setBoardStore((prev) => {
                      return { ...prev, smi: vis };
                    })
                  }
                />
              )}

              <MemoryMatchSettingModal
                isOpen={openSettingModal}
                closeModal={setOpenSettingModal}
                size={boardStore.bs}
                handleSubmit={(size) => {
                  if (size === boardStore.bs) return;
                  setBoardStore((prev) => {
                    return { ...prev, bs: size, cs: 0 };
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {(isGameLost || isGameWon) && (
        <BasicModal
          title={isGameWon ? "You won" : "You lost"}
          isOpen={openWonLostModal}
          closeModal={handleCloseWonLostModal}
          confetti={isGameWon && <ConfettiComponent />}
        >
          {isGameLost && (
            <div className="mt-4">
              <span className="text-sm font-normal">
                Opps! you clicked the same bomb{" "}
                <span className="text-2xl">
                  {MMH.MEMORY_MATCH_INVALID_TEXT}
                </span>{" "}
                twice
              </span>
              <br />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Hint: Always remember the bomb's position
              </span>
            </div>
          )}
          {isGameWon && (
            <div className="mt-4">
              <p className="mb-1 text-sm text-gray-500">
                {`${
                  boardStore.cs < boardStore.ls! ? "New Lowest Score" : "Score"
                } for size ${boardStore.bs} board`}
              </p>
              <p className="text-3xl font-bold text-emerald-500">
                {boardStore.cs}
              </p>
            </div>
          )}
        </BasicModal>
      )}
    </>
  );
}
