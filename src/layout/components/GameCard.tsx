import { useRef } from "react";
import { Link } from "react-router-dom";

type GameCardProps = {
  title: string;
  description: string;
  logo?: JSX.Element;
};

export default function GameCard(props: GameCardProps) {
  const refGradientMask = useRef<HTMLDivElement>(null);
  const refSVGMask = useRef<HTMLDivElement>(null);
  function handleHoverAnimation(e: any) {
    var card = e.target.getBoundingClientRect();
    var x = e.clientX - card.left;
    var y = Math.floor(e.clientY - card.top);
    if (refGradientMask.current !== null && refSVGMask.current !== null) {
      refGradientMask.current.style.maskImage = `radial-gradient(150px at ${x}px ${y}px, white, transparent)`;
      refSVGMask.current.style.maskImage = `radial-gradient(150px at ${x}px ${y}px, white, transparent)`;
    }
  }
  return (
    <div
      className="group relative flex rounded-2xl bg-zinc-50 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/5 dark:hover:shadow-black/5"
      onMouseMoveCapture={(e) => handleHoverAnimation(e)}
    >
      <div className="pointer-events-none">
        <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
          <svg
            aria-hidden="true"
            className="dark:fill-white/1 dark:stroke-white/2.5 absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5"
          >
            <defs>
              <pattern
                id=":R56hd6:"
                width="72"
                height="56"
                patternUnits="userSpaceOnUse"
                x="50%"
                y="16"
              >
                <path d="M.5 56V.5H72" fill="none"></path>
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              strokeWidth="0"
              fill="url(#:R56hd6:)"
            ></rect>
            <svg x="50%" y="16" className="overflow-visible">
              <rect strokeWidth="0" width="73" height="57" x="0" y="56"></rect>
              <rect
                strokeWidth="0"
                width="73"
                height="57"
                x="72"
                y="168"
              ></rect>
            </svg>
          </svg>
        </div>
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D7EDEA] to-[#F4FBDF] opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#202D2E] dark:to-[#303428]"
          ref={refGradientMask}
        ></div>
        <div
          className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
          ref={refSVGMask}
        >
          <svg
            aria-hidden="true"
            className="dark:fill-white/2.5 absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:stroke-white/10"
          >
            <defs>
              <pattern
                id=":R1d6hd6:"
                width="72"
                height="56"
                patternUnits="userSpaceOnUse"
                x="50%"
                y="16"
              >
                <path d="M.5 56V.5H72" fill="none"></path>
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              strokeWidth="0"
              fill="url(#:R1d6hd6:)"
            ></rect>
            <svg x="50%" y="16" className="overflow-visible">
              <rect strokeWidth="0" width="73" height="57" x="0" y="56"></rect>
              <rect
                strokeWidth="0"
                width="73"
                height="57"
                x="72"
                y="168"
              ></rect>
            </svg>
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/10 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20"></div>
      <div className="relative flex items-center gap-4 rounded-2xl p-4 pt-16">
        <div className="flex h-24 w-24 items-center justify-center rounded-md border text-black dark:text-white">
          Logo
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
            <Link to="/2048">
              <span className="absolute inset-0 rounded-2xl"></span>
              {props.title}
            </Link>
          </h3>
          <p className="mt-1 text-ellipsis text-sm text-zinc-600 dark:text-zinc-400">
            {props.description}
          </p>
        </div>
      </div>
    </div>
  );
}
