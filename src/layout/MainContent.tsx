import { Outlet } from "react-router-dom";

export default function MainContent() {
  return (
    <main className="flex-1 pt-4 sm:py-6 sm:pb-14 lg:pb-16 lg:pt-6">
      <Outlet />
    </main>
  );
}
