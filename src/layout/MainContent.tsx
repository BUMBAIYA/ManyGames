import { Outlet } from "react-router-dom";

export default function MainContent() {
  return (
    <main className="flex-1 py-4 sm:py-14 lg:py-16">
      <Outlet />
    </main>
  );
}
