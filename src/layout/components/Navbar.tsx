import { Fragment, useEffect, useRef, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeSwitchButton from "./ThemeSwitchButton";
import Logo from "../../assets/icons/Logo";
import { Link } from "react-router-dom";
import { SidebarNavLink } from "./SidebarNavLink";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  function scale(
    number: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
  ) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
  const onScroll = (e: Event) => {
    e.stopPropagation();
    const scrolledHeight = document.documentElement.scrollTop;
    if (scrolledHeight < 60) {
      navRef.current?.style.setProperty(
        "--bg-opacity-light",
        "" + scale(scrolledHeight, 1, 59, 0.4, 0.9),
      );
      navRef.current?.style.setProperty(
        "--bg-opacity-dark",
        "" + scale(scrolledHeight, 1, 59, 0.2, 0.8),
      );
    }
  };

  useEffect(() => {
    window.onscroll = onScroll;
  }, []);

  return (
    <>
      <div
        className="sticky top-0 z-50 flex h-14 items-center justify-between gap-12 bg-white/[var(--bg-opacity-light)] px-4 backdrop-blur-sm transition dark:bg-zinc-900/[var(--bg-opacity-dark)] dark:backdrop-blur sm:px-6 lg:left-72 lg:z-30 lg:px-8"
        ref={navRef}
      >
        <div className="absolute inset-x-0 top-full h-px bg-zinc-900/10 transition dark:bg-white/10"></div>
        <div className="flex items-center gap-5 lg:hidden">
          <Link to="/" aria-label="Home" className="z-10 h-10 w-10">
            <Logo />
          </Link>
        </div>
        <div className="flex w-full items-center justify-end gap-4">
          <div className="flex items-center">
            <ThemeSwitchButton />
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
              aria-label="Toggle navigation"
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? (
                <XMarkIcon className="w-4 stroke-zinc-900 dark:stroke-white" />
              ) : (
                <Bars3Icon className="w-4 stroke-zinc-900 dark:stroke-white" />
              )}
            </button>
          </div>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 lg:hidden"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 top-14 bg-zinc-400/20 opacity-100 backdrop-blur-sm dark:bg-black/40" />
          </Transition.Child>

          <Dialog.Panel>
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="fixed left-0 top-14 bottom-0 flex w-full translate-x-0 flex-col overflow-y-auto bg-white px-4 pt-6 pb-4 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-900/10 dark:bg-zinc-900 dark:ring-zinc-800 min-[416px]:max-w-sm sm:px-6 sm:pb-10">
                <nav>
                  <ul role="list">
                    <SidebarNavLink closeModal={() => setOpen(false)} />
                  </ul>
                </nav>
              </div>
            </Transition.Child>
          </Dialog.Panel>
        </Dialog>
      </Transition.Root>
    </>
  );
}
