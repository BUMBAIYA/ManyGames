import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { classNames } from "../../utility/css";

export type GameCardPropsType = {
  title: string;
  link: string;
  description: string;
  imageUrl: string;
};

export default function GameCard(props: GameCardPropsType) {
  const cardRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, options);
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [cardRef, options]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Link
      to={props.link}
      className="flex flex-col overflow-hidden rounded-md bg-white transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-700 dark:hover:shadow-black lg:border lg:border-zinc-300"
    >
      <div
        ref={cardRef}
        className="overflow-hidden border dark:border-zinc-700 lg:mx-2 lg:mt-2"
      >
        {isLoading && (
          <div className="aspect-square w-full animate-pulse bg-gray-200 dark:bg-zinc-700"></div>
        )}

        <img
          alt={props.title}
          className="w-full bg-cover"
          style={{ display: isLoading ? "none" : "block" }}
          src={isVisible ? props.imageUrl : ""}
          onLoad={handleImageLoad}
        />
      </div>
      <div className="flex flex-col rounded-b-md border border-t-0 border-gray-300 p-2 dark:border-0 lg:border-0 lg:px-3 lg:pb-4">
        <div className="flex flex-col">
          <span className="text-md font-semibold dark:text-white">
            {props.title}
          </span>
          <p className="hidden justify-end py-2 text-sm text-gray-500 dark:text-gray-400 lg:block">
            {props.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
