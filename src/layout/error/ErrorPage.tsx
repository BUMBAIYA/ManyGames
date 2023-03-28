import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom";
import Logo from "../../assets/icons/Logo";

export default function ErrorPage() {
  const error: any = useRouteError();

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "light");
    } else {
      if (localStorage.getItem("theme") === "dark")
        document.documentElement.setAttribute("class", "dark");
    }
  }, []);

  return (
    <div className="flex h-screen flex-col bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">
      <div className="p-4">
        <Logo />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-emerald-500">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <div className="mt-4"></div>
        <Link to="/" className="text-blue-500 underline">
          Return to home
        </Link>
      </div>
    </div>
  );
}
