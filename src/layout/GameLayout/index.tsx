import Navbar from "../components/Navbar";
import Footer from "./Footer";
import Header from "./Header";
import MainContent from "./MainContent";

export default function GameLayout() {
  return (
    <div className="lg:ml-72">
      <Header />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="px-4 sm:px-6 lg:px-8">
          <MainContent />
          <Footer />
        </div>
      </div>
    </div>
  );
}
