import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { GameCardPropsType } from "./GameCard";
import PageMeta from "../utility/PageMeta";

const GameCard = lazy(() => import("./GameCard"));

const GameCardFallback: React.FC<GameCardPropsType> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] animate-pulse rounded-lg bg-gray-200 dark:bg-zinc-800"></div>
      }
    >
      <GameCard
        imageUrl={props.imageUrl}
        title={props.title}
        link={props.link}
        description={props.description}
      />
    </Suspense>
  );
};

export default function Hero() {
  return (
    <>
      <PageMeta
        title="ManyGames | Home"
        description="ManyGames, your go-to destination for fun and addictive word
        games and puzzles!"
      />
      <h1 className="text-2xl font-bold dark:text-white">Many games</h1>
      <p className="dark:text-zinc-400">
        Welcome to ManyGames, your go-to destination for fun and addictive word
        games and puzzles! My goal as solo developer is to add one game every
        week to give users the variety in games.
      </p>
      <div className="my-16 flex flex-col items-center">
        <h2 className="w-full scroll-mt-24 text-xl font-bold dark:text-white">
          <Link
            className="group text-inherit no-underline hover:text-inherit"
            to="/#wordgames"
          >
            Games
          </Link>
        </h2>
        <div className="grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-4 dark:border-white/5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <GameCardFallback
            imageUrl="/assets/2048Icon.png"
            link="/2048"
            title="2048"
            description="Combine tiles of same number to reach the total of 2048"
          />
          <GameCardFallback
            imageUrl="/assets/puzzleIcon.png"
            link="/puzzle"
            title="Puzzle"
            description="Solve the puzzle by shuffling tiles"
          />
          <GameCardFallback
            imageUrl="/assets/wordleIcon.png"
            link="/wordle"
            title="Wordle"
            description="Short word guessing game"
          />
        </div>
      </div>
    </>
  );
}
