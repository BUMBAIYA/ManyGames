import { Outlet } from "react-router-dom";

export default function GameLayout() {
  return (
    <div>
      {/* TODO: AppLayout, Navbar or Sidebar */}
      <Outlet />
    </div>
  );
}
