import { Link } from "react-router-dom";
import Logo from "../../assets/icons/Logo";
import { SidebarNavLink } from "../components/SidebarNavLink";

export default function Header() {
  return (
    <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
      <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pt-4 lg:pb-8 lg:dark:border-white/10">
        <div className="hidden lg:flex">
          <Link to="/" aria-label="Home" className="flex items-center gap-2">
            <span className="h-12 w-12">
              <Logo />
            </span>
            <span className="text-xl font-semibold tracking-tighter dark:text-white">
              Many Games
            </span>
          </Link>
        </div>
        <nav className="hidden lg:mt-10 lg:block">
          <ul role="list">
            <SidebarNavLink />
          </ul>
        </nav>
      </div>
    </header>
  );
}
