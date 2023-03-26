import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import LoadingGame from "../layout/LoadingGame";
import ErrorPage from "../layout/ErrorPage";
import GameLayout from "../layout/GameLayout";
import Hero from "../layout/Hero";
import GameError from "../layout/GameError";

const GameBoard = lazy(() => import("../components/2048/GameBoard"));
const SlidePuzzleBoard = lazy(
  () => import("../components/slidePuzzle/GameBoard")
);
const WordleGameBoard = lazy(() => import("../components/wordle/GameBoard"));
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
      ],
    },
  ],
};
