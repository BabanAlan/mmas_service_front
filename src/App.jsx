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

export default function App() {
  const [balance, setBalance] = useState(1400);
  const [currentPage, setCurrentPage] = useState("home"); // home, services, history, faq

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
    switch(currentPage) {
      case "services": return <Services onPurchase={handlePurchase} />;
      case "history": return <History />;
      case "faq": return <FAQ />;
    }
  };

  const [tgReady, setTgReady] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      console.log("✅ WebApp API доступен");
      setTgReady(true);
    } else {
      console.warn("⚠️ WebApp API не найден");
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>TG Mini App</h1>
      {tgReady ? (
        <p>Telegram WebApp API доступен ✅</p>
      ) : (
        <p>Запустите через Telegram ⚠️</p>
      )}
    </div>
  );
}

//   return (
//     <div className="app-container">
//       <Header
//         isHome={currentPage === "home"}
//         onBack={() => setCurrentPage("home")}
//       />
//       <Balance balance={balance} />
//       <Deposit onDeposit={handleDeposit} />
//       <HomeBlocks onNavigate={setCurrentPage} />

//       {/* Стек страниц, наезжающий поверх */}
//       <div className={`page-stack ${currentPage !== "home" ? "page-active" : ""}`}>
//         {renderPage()}
//       </div>

//     </div>
//   );
// }
