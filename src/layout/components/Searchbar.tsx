import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Searchbar() {
  return (
    <div className="hidden lg:block lg:max-w-md lg:flex-auto">
      <button className="hidden h-8 w-full items-center gap-2 rounded-md bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex focus:[&:not(:focus-visible)]:outline-none">
        <MagnifyingGlassIcon className="h-4 w-4 stroke-current" />
        Find games...
        <kbd className="text-2xs ml-auto text-zinc-500 dark:text-zinc-400">
          <kbd className="font-sans">Ctrl </kbd>
          <kbd className="font-sans">Q</kbd>
        </kbd>
      </button>
    </div>
  );
}
