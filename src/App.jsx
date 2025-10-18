import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
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

  useEffect(() => {
    // Проверяем Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      setTgReady(true);

      // Если поддерживается BackButton API — подписываемся
      const backButton = tg.BackButton;

      if (backButton) {
        // Назначаем обработчик
        backButton.onClick(() => {
          setCurrentPage("home");
          backButton.hide();
        });
      }

      // Следим за изменением страницы
      if (currentPage === "home") {
        backButton?.hide();
      } else {
        backButton?.show();
      }
    } else {
      console.warn("⚠️ Telegram WebApp API не найден");
    }
  }, [tgInitialized, currentPage]);

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

  if (!tgReady) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>TG Mini App</h1>
        <p>Запустите через Telegram ⚠️</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        isHome={currentPage === "home"}
        onBack={() => setCurrentPage("home")}
      />
      <Balance balance={balance} />
      <Deposit onDeposit={handleDeposit} />
      <HomeBlocks onNavigate={setCurrentPage} />

      <div className={`page-stack ${currentPage !== "home" ? "page-active" : ""}`}>
        {renderPage()}
      </div>
    </div>
  );
}
