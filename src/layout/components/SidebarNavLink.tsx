import { NavLink } from "react-router-dom";
import { classNames } from "../../utility/css";

type LinkType = {
  category: "Puzzle" | "Word" | "Memory";
  games: {
    name: string;
    link: string;
  }[];
};

const LINKS: LinkType[] = [
  {
    category: "Puzzle",
    games: [
      {
        name: "Puzzle",
        link: "puzzle",
      },
      {
        name: "2048",
        link: "2048",
      },
    ],
  },
  {
    category: "Word",
    games: [
      {
        name: "Wordle",
        link: "wordle",
      },
    ],
  },
  {
    category: "Memory",
    games: [
      {
        name: "Memory Match",
        link: "memorymatch",
      },
    ],
  },
];

export interface ISidebarNavLinkProps {
  closeModal?: () => void;
}

export function SidebarNavLink(props: ISidebarNavLinkProps) {
  return (
    <>
      {LINKS.map((category, catIndex) => (
        <li key={catIndex}>
          <h2 className="mt-6 text-xs font-semibold text-zinc-900 dark:text-white">
            {category.category}
          </h2>
          <div className="relative mt-3 pl-2">
            <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"></div>
            <ul className="border-1 border-transparent" role="list">
              {category.games.map((game, gIndex) => (
                <li key={gIndex}>
                  <NavLink
                    to={`/${game.link}`}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "border-l-2 border-l-emerald-400 text-zinc-900 dark:text-emerald-600"
                          : "text-zinc-600 dark:text-zinc-400",
                        "flex justify-between gap-2 py-1 pr-3 pl-4 text-sm transition hover:text-zinc-900 dark:hover:text-white",
                      )
                    }
                    onClick={() => {
                      if (props.closeModal) {
                        props.closeModal();
                      }
                    }}
                  >
                    {game.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
      <div className="flex-1"></div>
    </>
  );
}
