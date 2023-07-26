import { ArrowPathIcon } from "@heroicons/react/24/outline";

export function BuildingBoardLoader() {
  return (
    <div className="mt-20 flex w-full max-w-3xl items-center justify-center gap-2 text-zinc-900 dark:text-emerald-400">
      <ArrowPathIcon className="h-6 w-6 animate-spin stroke-zinc-900 dark:stroke-emerald-400" />
      <span className="text-2xl">Building board...</span>
    </div>
  );
}
