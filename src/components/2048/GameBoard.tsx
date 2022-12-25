import { useState } from "react";
import { Board } from "./GameLogic";
import useEvent from "../../hooks/useEvent";
import GameTile from "./GameTile";
import GameOverlay from "./GameOverlay";
import GameDetails from "./GameDetails";

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

  const tiles = board.tiles
    .filter((_tile) => _tile.value !== 0)
    .map((_t, index) => {
      return <GameTile tile={_t} key={index} />;
    });

  const handleResetGame = () => {
    setBoard(new Board(size));
  };

  return (
    <div className="flex h-screen justify-center bg-gray-100">
      <div>
        <GameDetails score={board.score} resetGame={handleResetGame} />
        <div className="relative">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${size}, 14vmin)`,
              gridTemplateRows: `repeat(${size}, 14vmin)`,
            }}
            className="gap-[1vmin] rounded-[1vmin]"
          >
            {Array.from({ length: size * size }, (_, index) => {
              return (
                <div
                  key={index}
                  className="h-[14vmin] w-[14vmin] rounded-[1vmin] bg-gray-300/70"
                ></div>
              );
            })}
            {tiles}
          </div>
          <GameOverlay
            onRestart={handleResetGame}
            hasLost={board.hasLost()}
            hasWon={board.hasWon()}
          />
        </div>
      </div>
    </div>
  );
}
