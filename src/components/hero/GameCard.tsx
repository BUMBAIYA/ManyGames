import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export type GameCardPropsType = {
  title: string;
  link: string;
  description: string;
  imageUrl: string;
};

export default function GameCard(props: GameCardPropsType) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(imgRef.current!);
            }
          });
        },
        { rootMargin: "50px" },
      );
      observer.observe(imgRef.current);
      return () => {
        if (imgRef.current === null) return;
        observer.unobserve(imgRef.current!);
      };
    }
  }, [props.imageUrl]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <Link
      to={props.link}
      className="flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:shadow-black"
    >
      <div className="mx-2 mt-2 overflow-hidden rounded-md border dark:border-zinc-700">
        {isLoading && (
          <div className="aspect-square w-full animate-pulse bg-gray-200 dark:bg-zinc-700"></div>
        )}
        <img
          alt="Icon"
          className="w-full bg-cover"
          style={{ opacity: isVisible ? 1 : 0 }}
          ref={imgRef}
          src={isVisible ? props.imageUrl : ""}
          onLoad={handleImageLoad}
        />
      </div>
      <div className="flex flex-col p-4 pb-6 xl:p-6">
        <div className="flex flex-col">
          <span className="text-lg font-bold dark:text-white">
            {props.title}
          </span>
          <p className="justify-end text-gray-500 dark:text-gray-400">
            {props.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
