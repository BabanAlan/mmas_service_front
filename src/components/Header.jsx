import React from "react";
import "../styles/header.css";

export default function Header({ isHome, onBack }) {
  return (
    <div className="header">
      <button className="header-btn" onClick={onBack}>
        {isHome ? "✕ Закрыть" : "< Назад"}
      </button>
    </div>
  );
}
