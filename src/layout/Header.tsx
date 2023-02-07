import { Link } from "react-router-dom";
import Logo from "../assets/icons/Logo";
import Navbar from "./components/Navbar";

export default function Header() {
  return (
    <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
      <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pt-4 lg:pb-8 lg:dark:border-white/10">
        <div className="hidden lg:flex">
          <Link to="/" aria-label="Home">
            <Logo />
          </Link>
        </div>
        <Navbar />
      </div>
    </header>
  );
}
