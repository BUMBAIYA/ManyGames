import GithubLogo from "../assets/icons/GithubLogo";
import TwitterLogo from "../assets/icons/TwitterLogo";
import GameReviewForm from "./components/GameReviewForm";

export default function Footer() {
  return (
    <footer className="space-y-10 pb-10">
      {/* <div className="relative h-8">
        <GameReviewForm />
      </div> */}
      <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 dark:border-white/5 sm:flex-row">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          © Copyright 2023. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="/#" aria-label="Home">
            <GithubLogo />
          </a>
          <a href="/#" aria-label="Home">
            <TwitterLogo />
          </a>
        </div>
      </div>
    </footer>
  );
}
