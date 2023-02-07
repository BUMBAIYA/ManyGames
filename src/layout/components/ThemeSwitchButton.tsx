import {
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";

export default function ThemeSwitchButton() {
  const handleToggle = () => {
    document.documentElement.classList.toggle("dark");
    if (localStorage.getItem("theme") === "light")
      localStorage.setItem("theme", "dark");
    else localStorage.setItem("theme", "light");
  };

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "light");
    } else {
      if (localStorage.getItem("theme") === "dark")
        document.documentElement.setAttribute("class", "dark");
    }
  }, []);

  return (
    <div className="flex gap-4">
      <div className="contents lg:hidden">
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5 lg:hidden focus:[&:not(:focus-visible)]:outline-none"
          aria-label="Find something..."
        >
          <MagnifyingGlassIcon className="h-4 w-4 stroke-zinc-900 dark:stroke-white" />
        </button>
      </div>
      <button
        onClick={handleToggle}
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
        aria-label="Toggle dark mode"
      >
        <SunIcon className="h-4 w-4 stroke-zinc-900 dark:hidden" />
        <MoonIcon className="hidden h-4 w-4 stroke-emerald-300 dark:block" />
      </button>
    </div>
  );
}
