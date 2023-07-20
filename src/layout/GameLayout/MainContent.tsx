import { Outlet } from "react-router-dom";

export default function MainContent() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] flex-1 flex-col py-6 sm:py-10">
      <Outlet />
    </main>
  );
}
