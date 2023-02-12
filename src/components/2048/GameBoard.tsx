import { useState } from "react";
import { Board } from "./GameLogic";
import useEvent from "../../hooks/useEvent";
import GameTile from "./GameTile";
import GameOverlay from "./GameOverlay";
import GameDetails from "./GameDetails";
import "../../styles/2048.css";
import "../../styles/scss/2048.scss";

type GameBoardProps = {
  size?: number;
};

export default function GameBoard({ size = 4 }: GameBoardProps) {
  const [board, setBoard] = useState(new Board(size));

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode > 40 || event.keyCode < 37) return;
    event.preventDefault();
    if (event.repeat) return;
    if (board.hasWon()) return;
    if (board.hasLost()) return;
    let boardClone: Board = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );
    switch (event.key) {
      case "ArrowUp": {
        let newBoard = boardClone.move(1);
        setBoard(newBoard);
        break;
      }
      case "ArrowDown": {
        let newBoard = boardClone.move(3);
        setBoard(newBoard);
        break;
      }
      case "ArrowRight": {
        let newBoard = boardClone.move(2);
        setBoard(newBoard);
        break;
      }
      case "ArrowLeft": {
        let newBoard = boardClone.move(0);
        setBoard(newBoard);
        break;
      }
      default: {
        return;
      }
    }
  };

  useEvent("keydown", handleKeyDown, false);

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
    setBoard(new Board(size));
  };

  return (
    <div className="flex flex-col-reverse items-center gap-8 md:flex-row md:items-start">
      <div className="relative">
        <div className="flex flex-col gap-1 sm:gap-2">{cells}</div>
        {tiles}
        <GameOverlay
          onRestart={handleResetGame}
          hasLost={board.hasLost()}
          hasWon={board.hasWon()}
        />
      </div>
      <GameDetails score={board.score} resetGame={handleResetGame} />
    </div>
  );
}
