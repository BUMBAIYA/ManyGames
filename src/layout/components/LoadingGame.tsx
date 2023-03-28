import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function LoadingGame() {
  return (
    <div className="flex flex-1 items-center justify-center gap-2 text-zinc-900 dark:text-emerald-400">
      <ArrowPathIcon className="h-6 w-6 animate-spin stroke-zinc-900 dark:stroke-emerald-400" />
      <h1 className="text-2xl">Loading game...</h1>
    </div>
  );
}
