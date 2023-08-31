import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import LoadingGame from "../layout/components/LoadingGame";
import ErrorPage from "../layout/error/ErrorPage";
import GameLayout from "../layout/GameLayout";
import Hero from "../components/hero/Hero";
import GameError from "../layout/error/GameError";

const GameBoard = lazy(() => import("../components/games/2048/GameBoard"));
const SlidePuzzleBoard = lazy(
  () => import("../components/games/slidePuzzle/GameBoard"),
);
const WordleGameBoard = lazy(
  () => import("../components/games/wordle/GameBoard"),
);
const MemoryMatchBoard = lazy(
  () => import("../components/games/memoryMatch/GameBoard"),
);
const GameBoardWithFallback = () => (
  <Suspense fallback={<LoadingGame />}>
    <GameBoard />
  </Suspense>
);

const SlidePuzzleBoardWithFallback = () => (
  <Suspense fallback={<LoadingGame />}>
    <SlidePuzzleBoard />
  </Suspense>
);

const WordleGameBoardWithFallback = () => (
  <Suspense fallback={<LoadingGame />}>
    <WordleGameBoard />
  </Suspense>
);

const MemoryMatchGameBoardWithFallback = () => (
  <Suspense fallback={<LoadingGame />}>
    <MemoryMatchBoard />
  </Suspense>
);

export const GameRoutes: RouteObject = {
  path: "/",
  element: <GameLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      errorElement: <GameError />,
      children: [
        { index: true, element: <Hero /> },
        {
          path: "/2048",
          element: <GameBoardWithFallback />,
        },
        {
          path: "/puzzle",
          element: <SlidePuzzleBoardWithFallback />,
        },
        {
          path: "/wordle",
          element: <WordleGameBoardWithFallback />,
        },
        {
          path: "/memorymatch",
          element: <MemoryMatchGameBoardWithFallback />,
        },
      ],
    },
  ],
};
