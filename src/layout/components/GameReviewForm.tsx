export default function GameReviewForm() {
  return (
    <form className="absolute inset-0 flex items-center justify-center gap-6 sm:justify-start">
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Was this game fun?
      </p>
      <div className="group grid h-8 grid-cols-[1fr,1px,1fr] overflow-hidden rounded-md border border-zinc-900/10 dark:border-white/20">
        <button
          type="submit"
          className="hover:bg-zinc-900/2.5 px-3 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
          data-response="yes"
        >
          Yes
        </button>
        <div className="bg-zinc-900/10 dark:bg-white/20"></div>
        <button
          type="submit"
          className="hover:bg-zinc-900/2.5 px-3 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
          data-response="no"
        >
          No
        </button>
      </div>
    </form>
  );
}
