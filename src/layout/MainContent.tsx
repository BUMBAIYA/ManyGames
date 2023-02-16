import { Outlet } from "react-router-dom";

export default function MainContent() {
  return (
    <main className="flex-1 py-6 sm:py-10">
      <Outlet />
    </main>
  );
}
