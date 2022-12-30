import { ArrowPathIcon } from "@heroicons/react/24/outline";

type GameDetailProps = {
  score: number;
  resetGame: () => void;
};

export default function GameDetails(props: GameDetailProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="rounded-md bg-teal-500 px-4 py-1 text-white">
        <div className="text-[75%]">SCORE</div>
        <div>{props.score}</div>
      </div>
      <div>
        <button
          className="rounded-md bg-pink-600 px-4 py-2 text-xl font-semibold text-white transition-colors duration-100 ease-in hover:bg-pink-700"
          onClick={props.resetGame}
        >
          <span className="hidden sm:block">New game</span>
          <ArrowPathIcon className="block h-6 w-6 sm:hidden" />
        </button>
      </div>
    </div>
  );
}
