import Footer from "./Footer";
import Header from "./Header";
import MainContent from "./MainContent";

export default function GameLayout() {
  return (
    <div className="lg:ml-72">
      <Header />
      <div className="relative flex min-h-screen flex-col px-4 pt-14 sm:px-6 lg:px-8">
        <MainContent />
        <Footer />
      </div>
    </div>
  );
}
