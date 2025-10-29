import { useEffect, useState, useRef } from "react";
import Balance from "./components/Balance.jsx";
import Deposit from "./components/Deposit.jsx";
import HomeBlocks from "./components/HomeBlocks.jsx";
import Services from "./pages/Services.jsx";
import History from "./pages/History.jsx";
import FAQ from "./pages/FAQ.jsx";
import Login from "./pages/Login.jsx";
import "./styles/main.css";
import "./styles/animations.css";
import AccountSwitcher from "./components/AccountSwitcher.jsx";
import {
  listAccounts as storeList,
  getCurrentAccountId as storeCurrentId,
  upsertAccount as storeUpsert,
  selectAccount as storeSelect,
  removeAccount as storeRemove,
  snapshot as storeSnapshot,
  getBalance as storeGetBalance,
  adjustBalance as storeAdjustBalance,
  addHistory as storeAddHistory,
  listHistory as storeListHistory,
} from "./lib/accountStore";

export default function App({ tgInitialized }) {
  const [balance, setBalance] = useState(0);
  const [historyOps, setHistoryOps] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const rawAccs = localStorage.getItem("mmas.accounts");
      const accs = rawAccs ? JSON.parse(rawAccs) : [];
      const current = localStorage.getItem("mmas.currentAccountId");
      if (!current || accs.length === 0) return "login";
    } catch {}
    return "home";
  });
  const [tgReady, setTgReady] = useState(false);
  const [accounts, setAccounts] = useState(() => storeList());
  const [currentAccountId, setCurrentAccountId] = useState(() => storeCurrentId());

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

  // reflect store snapshot if changed elsewhere
  useEffect(() => {
    const snap = storeSnapshot();
    if (snap.currentAccountId !== currentAccountId) setCurrentAccountId(snap.currentAccountId);
    if (snap.accounts.length !== accounts.length) setAccounts(snap.accounts);
  }, [currentAccountId, accounts.length]);

  // load account-specific balance and history when account changes
  useEffect(() => {
    if (!currentAccountId) {
      setBalance(0);
      setHistoryOps([]);
      return;
    }
    setBalance(storeGetBalance(currentAccountId));
    setHistoryOps(storeListHistory(currentAccountId));
  }, [currentAccountId]);

  // force login on first run or when no account selected
  useEffect(() => {
    if (!currentAccountId || accounts.length === 0) {
      setCurrentPage("login");
    }
  }, [accounts.length, currentAccountId]);

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

      if (translateX.current > 100) {
        // успешный свайп — анимируем уход
        page.style.transform = "translateX(100%)";
        page.style.filter = "blur(8px)";
        home.style.filter = "blur(0)";
        home.style.opacity = "1";

        const handleTransitionEnd = () => {
          setCurrentPage("home");
          page.style.transform = "";
          page.style.filter = "";
          home.style.filter = "";
          home.style.opacity = "";
          page.removeEventListener("transitionend", handleTransitionEnd);
        };

        page.addEventListener("transitionend", handleTransitionEnd);
      } else {
        // недостаточный свайп — откат
        page.style.transform = "translateX(0)";
        page.style.filter = "blur(0)";
        home.style.filter = "blur(8px)";
        home.style.opacity = "0.3";

        // нет setCurrentPage на home!
        const handleTransitionEnd = () => {
          page.style.transform = "";
          page.style.filter = "";
          home.style.filter = "";
          home.style.opacity = "";
          page.removeEventListener("transitionend", handleTransitionEnd);
        };

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

  const formatDate = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  };

  const handleDeposit = (amount) => {
    if (!currentAccountId) return;
    const next = storeAdjustBalance(currentAccountId, Number(amount));
    setBalance(next);
    const op = { type: "refill", title: "Пополнение", date: formatDate(), amount: Number(amount), status: "Зачислено" };
    const list = storeAddHistory(currentAccountId, op);
    setHistoryOps(list);
  };

  const handlePurchase = (service) => {
    if (balance < service.price) {
      alert("Недостаточно средств");
      return;
    }
    alert(`Вы купили: ${service.name}`);
    if (!currentAccountId) return;
    const next = storeAdjustBalance(currentAccountId, -service.price);
    setBalance(next);
    const op = { type: "purchase", title: service.name, date: formatDate(), amount: -service.price, status: "Оплачено" };
    const list = storeAddHistory(currentAccountId, op);
    setHistoryOps(list);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <Login
            onLogin={(login, password) => {
              // fixed credentials
              const valid = [
                { login: "Araik", password: "Araik" },
                { login: "Yan", password: "jaba" },
                { login: "admin", password: "admin" },
              ];
              const match = valid.find(
                (v) => v.login === login && v.password === password
              );
              if (!match) return { ok: false, error: "Неверный логин или пароль" };

              // upsert/select into store using DB-like identifiers
              const mmasId = `mmas:${match.login.toLowerCase()}`;
              const { account } = storeUpsert({ mmasId, displayName: match.login });
              const snap = storeSelect(account.id);
              setAccounts(snap.accounts);
              setCurrentAccountId(snap.currentAccountId);
              setCurrentPage("home");
              return { ok: true };
            }}
          />
        );
      case "services":
        return <Services onPurchase={handlePurchase} />;
      case "history":
        return <History operations={historyOps} />;
      case "faq":
        return <FAQ />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <AccountSwitcher
        accounts={accounts.map((a) => ({ id: a.id, name: a.displayName, color: a.color }))}
        currentId={currentAccountId}
        onSelect={(id) => {
          const snap = storeSelect(id);
          setAccounts(snap.accounts);
          setCurrentAccountId(snap.currentAccountId);
        }}
        onRemove={(id) => {
          const snap = storeRemove(id);
          setAccounts(snap.accounts);
          setCurrentAccountId(snap.currentAccountId);
          if (!snap.currentAccountId) setCurrentPage("login");
        }}
        onAdd={() => setCurrentPage("login")}
      />
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
