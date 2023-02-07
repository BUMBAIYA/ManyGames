import { RouteObject } from "react-router-dom";
import GameBoard from "../components/2048/GameBoard";
import ErrorPage from "../layout/ErrorPage";
import GameLayout from "../layout/GameLayout";
import Hero from "../layout/Hero";

export const GameRoutes: RouteObject = {
  path: "/",
  element: <GameLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Hero /> },
        {
          path: "/2048",
          element: <GameBoard />,
        },
      ],
    },
  ],
};
