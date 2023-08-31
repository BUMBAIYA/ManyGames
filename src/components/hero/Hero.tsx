import { lazy, Suspense } from "react";
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
      <div className="mb-16 flex flex-col items-center">
        <div className="grid w-full grid-cols-2 gap-8 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
          <GameCardFallback
            imageUrl="/assets/memoryMatch-min.png"
            link="/memorymatch"
            title="Memory match"
            description="Flip and match cards to reveal hidden patterns and images in this classic brain-teasing adventure."
          />
        </div>
      </div>
    </>
  );
}
