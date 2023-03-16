import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom";

export default function GameError() {
  const error: any = useRouteError();

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-zinc-900 dark:text-emerald-400">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred while loading game.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <div className="mt-4"></div>
      <Link to="/" className="text-blue-500 underline">
        Return to home
      </Link>
    </div>
  );
}
