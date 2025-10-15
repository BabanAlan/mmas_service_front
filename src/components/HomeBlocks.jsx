// src/components/HomeBlocks.jsx
import React from "react";
// import "./HomeBlocks.css";

export default function HomeBlocks({ onNavigate }) {
  return (
    <div className="home-blocks">
      <button className="home-block" onClick={() => onNavigate("services")}>
        Услуги
      </button>
      <button className="home-block" onClick={() => onNavigate("history")}>
        История операций
      </button>
      <button className="home-block" onClick={() => onNavigate("faq")}>
        Помощь
      </button>
    </div>
  );
}
