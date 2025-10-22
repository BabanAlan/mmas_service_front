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
      // только свайп от левого края
      if (e.touches[0].clientX > 40) return;
      startX.current = e.touches[0].clientX;
      isSwiping.current = true;
      // убираем переходы, чтобы движение было мгновенным
      page.style.transition = "none";
      home.style.transition = "none";
    };

    const handleTouchMove = (e) => {
      if (!isSwiping.current) return;
      const deltaX = e.touches[0].clientX - startX.current;
      if (deltaX < 0) return;

      translateX.current = deltaX;
      const progress = Math.min(deltaX / window.innerWidth, 1);

      // движение и блюр страницы (inline-стили на время свайпа)
      page.style.transform = `translateX(${deltaX}px)`;
      page.style.filter = `blur(${progress * 8}px)`; // max 8px

      // home проявляется: уменьшаем блюр и увеличиваем opacity
      // NOTE: эти inline-стили временные — после окончания свайпа они уберутся
      home.style.filter = `blur(${8 - progress * 8}px)`; // от 8 → 0
      home.style.opacity = `${0.3 + progress * 0.7}`; // от 0.3 → 1
    };

    const handleTouchEnd = () => {
      if (!isSwiping.current) return;

      // восстанавливаем переходы для анимации возврата/перехода
      page.style.transition = "transform 0.25s ease, filter 0.25s ease";
      home.style.transition = "filter 0.25s ease, opacity 0.25s ease";

      if (translateX.current > 100) {
        // успешный свайп — анимируем уход и затем переключаем страницу
        page.style.transform = "translateX(100%)";
        page.style.filter = "blur(8px)";
        home.style.filter = "blur(0)";
        home.style.opacity = "1";
        setTimeout(() => {
          // переключаем на home — класс .blurred будет убран (см. render)
          setCurrentPage("home");

          // чистим inline-стили — состояние задастся CSS-классом
          page.style.transform = "";
          page.style.filter = "";
          home.style.filter = "";
          home.style.opacity = "";
        }, 200);
      } else {
        // недостаточный свайп — откатываем
        page.style.transform = "translateX(0)";
        page.style.filter = "blur(0)";
        // вернём home в состояние "размыто" (если мы на внутренней странице)
        home.style.filter = "blur(8px)";
        home.style.opacity = "0.3";

        // через анимацию вернём классы/стили в исходное состояние
        setTimeout(() => {
          page.style.transform = "";
          page.style.filter = "";
          home.style.filter = "";
          home.style.opacity = "";
        }, 250);
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
      {/* Home-layer: класс 'blurred' ставится только если мы НЕ на home */}
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
