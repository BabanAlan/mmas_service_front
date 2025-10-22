import { useEffect, useState, useRef } from "react";
import Balance from "./components/Balance.jsx";
import Deposit from "./components/Deposit.jsx";
import HomeBlocks from "./components/HomeBlocks.jsx";
import Services from "./pages/Services.jsx";
import History from "./pages/History.jsx";
import FAQ from "./pages/FAQ.jsx";
import "./styles/main.css";
import "./styles/animations.css";

export default function App({ tgInitialized }) {
  const [balance, setBalance] = useState(1400);
  const [currentPage, setCurrentPage] = useState("home");
  const [tgReady, setTgReady] = useState(false);

  // 👇 swipe control
  const startX = useRef(0);
  const translateX = useRef(0);
  const isSwiping = useRef(false);
  const pageRef = useRef(null);
  const homeRef = useRef(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      setTgReady(true);
      const backButton = tg.BackButton;

      if (backButton) {
        backButton.onClick(() => setCurrentPage("home"));
      }

      if (currentPage === "home") {
        backButton?.hide();
      } else {
        backButton?.show();
      }
    } else {
      console.warn("⚠️ Telegram WebApp API не найден");
    }
  }, [tgInitialized, currentPage]);

  // swipe to go back with blur
  useEffect(() => {
    const page = pageRef.current;
    const home = homeRef.current;
    if (!page || !home) return;

    const handleTouchStart = (e) => {
      if (currentPage === "home") return;
      if (e.touches[0].clientX > 40) return;
      startX.current = e.touches[0].clientX;
      isSwiping.current = true;
      page.style.transition = "none";
      home.style.transition = "none";
    };

    const handleTouchMove = (e) => {
      if (!isSwiping.current) return;
      const deltaX = e.touches[0].clientX - startX.current;
      if (deltaX < 0) return;

      translateX.current = deltaX;
      const progress = Math.min(deltaX / window.innerWidth, 1);

      page.style.transform = `translateX(${deltaX}px)`;
      page.style.filter = `blur(${progress * 8}px)`;

      home.style.filter = `blur(${8 - progress * 8}px)`;
      home.style.opacity = `${0.3 + progress * 0.7}`;
    };

    const handleTouchEnd = () => {
      if (!isSwiping.current) return;

      page.style.transition = "transform 0.25s ease, filter 0.25s ease";
      home.style.transition = "filter 0.25s ease, opacity 0.25s ease";

      const handleTransitionEnd = () => {
        setCurrentPage("home");
        page.style.transform = "";
        page.style.filter = "";
        home.style.filter = "";
        home.style.opacity = "";
        page.removeEventListener("transitionend", handleTransitionEnd);
      };

      if (translateX.current > 100) {
        // успешный свайп — анимируем уход
        page.style.transform = "translateX(100%)";
        page.style.filter = "blur(8px)";
        home.style.filter = "blur(0)";
        home.style.opacity = "1";

        page.addEventListener("transitionend", handleTransitionEnd);
      } else {
        // недостаточный свайп — откат
        page.style.transform = "translateX(0)";
        page.style.filter = "blur(0)";
        home.style.filter = "blur(8px)";
        home.style.opacity = "0.3";

        page.addEventListener("transitionend", handleTransitionEnd);
      }

      isSwiping.current = false;
      translateX.current = 0;
    };

    page.addEventListener("touchstart", handleTouchStart);
    page.addEventListener("touchmove", handleTouchMove);
    page.addEventListener("touchend", handleTouchEnd);

    return () => {
      page.removeEventListener("touchstart", handleTouchStart);
      page.removeEventListener("touchmove", handleTouchMove);
      page.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPage]);

  const handleDeposit = (amount) => setBalance(balance + Number(amount));

  const handlePurchase = (service) => {
    if (balance < service.price) {
      alert("Недостаточно средств");
      return;
    }
    alert(`Вы купили: ${service.name}`);
    setBalance(balance - service.price);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "services":
        return <Services onPurchase={handlePurchase} />;
      case "history":
        return <History />;
      case "faq":
        return <FAQ />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Home-layer */}
      <div
        ref={homeRef}
        className={`home-layer ${currentPage !== "home" ? "blurred" : ""}`}
      >
        <Balance balance={balance} />
        <Deposit onDeposit={handleDeposit} />
        <HomeBlocks onNavigate={setCurrentPage} />
      </div>

      {/* Active page */}
      <div
        ref={pageRef}
        className={`page-stack ${currentPage !== "home" ? "page-active" : ""}`}
      >
        {renderPage()}
      </div>
    </div>
  );
}
