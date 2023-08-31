type GameDetailProps = {
  score: number;
  highScore: number | null;
};

export function GameDetails(props: GameDetailProps) {
  return (
    <div className="flex flex-row gap-2 sm:w-full lg:flex-col">
      <div className="inline rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 md:px-4">
        <span className="text-xs sm:text-base">Score</span>
        <p className="text-base font-semibold sm:text-3xl">{props.score}</p>
      </div>
      {props.highScore && (
        <div className="inline rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-600 ring-1 ring-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 md:px-4">
          <span className="inline-block text-xs sm:block sm:text-base">
            Lowest guess
          </span>
          <p className="text-base font-semibold sm:text-3xl">
            {props.highScore}
          </p>
        </div>
      )}
    </div>
  );
}
