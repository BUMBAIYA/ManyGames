import { TrashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
export default function GameError() {
  const navigate = useNavigate();
  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center text-zinc-900 dark:text-emerald-400">
      <h1 className="text-xl font-bold text-emerald-500">Oops!</h1>
      <p>Sorry, an unexpected error has occurred while loading game.</p>
      <div className="mt-4 flex items-center gap-4">
        <span>If error persists please clear the cache</span>
        <button
          className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-red-400"
          onClick={handleClearStorage}
        >
          Delete cache
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
      <Link to="/" className="mt-4 text-blue-500 underline">
        Return to home
      </Link>
    </div>
  );
}
