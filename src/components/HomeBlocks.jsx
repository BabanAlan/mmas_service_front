import React from "react";
import "../styles/home.css";

export default function HomeBlocks({ onNavigate }) {
  return (
    <div className="home-blocks">
      <button className="home-block" onClick={() => onNavigate("services")}>
        Услуги
      </button>
      <button className="home-block" onClick={() => onNavigate("history")}>
        История
      </button>
      <button className="home-block" onClick={() => onNavigate("faq")}>
        Помощь
      </button>
    </div>
  );
}
