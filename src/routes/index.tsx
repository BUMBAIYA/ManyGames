import { createBrowserRouter, RouteObject } from "react-router-dom";
import GameBoard from "../components/2048/GameBoard";
import ErrorPage from "../layout/ErrorPage";
import { GameRoutes } from "./GameRoutes";

export const router = createBrowserRouter([GameRoutes]);
