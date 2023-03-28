import { Link } from "react-router-dom";
export default function GameError() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center text-zinc-900 dark:text-emerald-400">
      <h1 className="text-xl font-bold text-emerald-500">Oops!</h1>
      <p>Sorry, an unexpected error has occurred while loading game.</p>
      <Link to="/" className="mt-4 text-blue-500 underline">
        Return to home
      </Link>
    </div>
  );
}
