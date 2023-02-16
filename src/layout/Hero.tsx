import { Link } from "react-router-dom";
import GameCard from "./components/GameCard";
import HeroOverlay from "./components/HeroOverlay";

export default function Hero() {
  return (
    <>
      <HeroOverlay />
      <h1 className="text-2xl font-bold dark:text-white">Many games</h1>
      <p className="dark:text-zinc-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut maiores
        ratione consequuntur et perspiciatis amet laborum, eveniet, corporis
        quasi autem laboriosam quisquam tenetur! Perspiciatis assumenda
        doloremque ab voluptas repudiandae quae!
      </p>
      <div className="my-16 xl:max-w-none">
        <h2 className="scroll-mt-24 text-xl font-bold dark:text-white">
          <Link
            className="group text-inherit no-underline hover:text-inherit"
            to="/#wordgames"
          >
            <div className="absolute mt-1 ml-[calc(-1*var(--width))] hidden w-[var(--width)] opacity-0 transition [--width:calc(2.625rem+0.5px+50%-min(50%,calc(theme(maxWidth.lg)+theme(spacing.8))))] group-hover:opacity-100 group-focus:opacity-100 md:block lg:z-50 2xl:[--width:theme(spacing.10)]">
              <div className="group/anchor block h-5 w-5 rounded-lg bg-zinc-50 ring-1 ring-inset ring-zinc-300 transition hover:ring-zinc-500 dark:bg-zinc-800 dark:ring-zinc-700 dark:hover:bg-zinc-700 dark:hover:ring-zinc-600">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="h-5 w-5 stroke-zinc-500 transition dark:stroke-zinc-400 dark:group-hover/anchor:stroke-white"
                >
                  <path d="m6.5 11.5-.964-.964a3.535 3.535 0 1 1 5-5l.964.964m2 2 .964.964a3.536 3.536 0 0 1-5 5L8.5 13.5m0-5 3 3"></path>
                </svg>
              </div>
            </div>
            Games
          </Link>
        </h2>
        <div className="grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-4 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-3">
          <GameCard
            link="/2048"
            title="2048"
            description="Combine tiles to reach the total of 2048"
          />
          <GameCard
            link="/puzzle"
            title="Puzzle"
            description="Solve the puzzle by shuffling tiles"
          />
        </div>
      </div>
    </>
  );
}
