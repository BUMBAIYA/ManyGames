import GithubLogo from "../../assets/icons/GithubLogo";

export default function Footer() {
  return (
    <footer className="hidden space-y-10 pb-10 lg:block">
      <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 dark:border-white/5 sm:flex-row">
        <div className="flex gap-4">
          <a
            href="https://github.com/BUMBAIYA/ManyGames"
            target="_blank"
            aria-label="Source Code"
            className="flex items-center gap-1 dark:text-zinc-400"
          >
            <GithubLogo />
            Github
          </a>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          {"< />"} with ♡ by{" "}
          <a
            className="-underline-offset-2 text-base font-semibold text-emerald-600 underline dark:text-emerald-400"
            target="_blank"
            aria-label="link to creator's website"
            href="https://amitchauhan.vercel.app"
          >
            Amit Chauhan
          </a>
        </p>
      </div>
    </footer>
  );
}
