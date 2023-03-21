import { ArrowPathIcon } from "@heroicons/react/24/outline";

type GameDetailProps = {
  score: number;
  highScore: number;
  resetGame: () => void;
};

export default function GameDetails(props: GameDetailProps) {
  return (
    <div className="flex w-full flex-row justify-between gap-6 px-2 py-1 md:w-max md:flex-col">
      <div className="flex flex-row gap-2 md:flex-col">
        <div className="inline rounded-md bg-emerald-400/10 px-4 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20">
          <span className="text-xs sm:text-base">SCORE</span>
          <p className="text-base font-semibold sm:text-3xl">{props.score}</p>
        </div>
        <div className="inline rounded-md bg-emerald-400/10 px-4 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20">
          <span className="text-xs sm:text-base">HIGH SCORE</span>
          <p className="text-base font-semibold sm:text-3xl">
            {props.highScore}
          </p>
        </div>
      </div>
      <div>
        <button
          className="rounded-md bg-zinc-900 p-2 shadow-sm transition-colors duration-100 ease-in hover:bg-zinc-700 dark:bg-emerald-400  dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/80 dark:hover:ring-emerald-400 sm:px-4"
          onClick={props.resetGame}
        >
          <span className="hidden text-lg font-semibold text-white dark:text-zinc-900 sm:block">
            New game
          </span>
          <ArrowPathIcon className="block h-6 w-6 text-white dark:text-zinc-900 sm:hidden" />
        </button>
      </div>
    </div>
  );
}
