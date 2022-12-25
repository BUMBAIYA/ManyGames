type GameOverlayProps = {
  onRestart: () => void;
  hasWon: boolean;
  hasLost: boolean;
};

export default function GameOverlay(props: GameOverlayProps) {
  if (props.hasWon) {
    return (
      <div className="absolute top-0 left-0 flex h-full w-full animate-show items-center justify-center rounded-[1vmin] bg-white bg-opacity-75 backdrop-blur-sm backdrop-filter">
        <span className="text-[8vmin] font-extrabold text-amber-600">
          Yoo won!
        </span>
        <div>
          <button
            className="rounded-[1vmin] bg-512/80 px-2 py-1 text-[3vmin] font-semibold text-white transition-colors duration-150 ease-in hover:bg-512 sm:px-3 sm:py-2 sm:text-[2.5vmin]"
            onClick={props.onRestart}
          >
            Play again
          </button>
        </div>
      </div>
    );
  }
  if (props.hasLost) {
    return (
      <div className="absolute top-0 left-0 flex h-full w-full animate-show flex-col items-center justify-center rounded-[1vmin] bg-white bg-opacity-75 backdrop-blur-sm backdrop-filter">
        <span className="text-[8vmin] font-extrabold text-rose-600">
          Game over!
        </span>
        <div>
          <button
            className="rounded-[1vmin] bg-512/80 px-2 py-1 text-[3vmin] font-semibold text-white transition-colors duration-150 ease-in hover:bg-512 sm:px-3 sm:py-2 sm:text-[2.5vmin]"
            onClick={props.onRestart}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  return null;
}
