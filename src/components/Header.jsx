import React, { useState, useEffect } from "react";
import { CgClose, CgChevronLeft } from "react-icons/cg";
import "../styles/header.css";

export default function Header({ isHome, onBack }) {
  const [prevHome, setPrevHome] = useState(isHome);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isHome !== prevHome) {
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false);
        setPrevHome(isHome);
      }, 300); // длительность анимации
      return () => clearTimeout(timer);
    }
  }, [isHome, prevHome]);

  // Определяем направление только по новому состоянию
  const direction = isHome ? "left-to-right" : "right-to-left";

  return (
    <button className="header-btn" onClick={onBack}>
      <div className="icon-wrapper">
        {animate && (
          <span className={`icon slide-out-${direction}`}>
            {prevHome ? <CgClose /> : <CgChevronLeft />}
          </span>
        )}
        <span className={`icon ${animate ? "hidden" : ""} slide-in-${direction}`}>
          {isHome ? <CgClose /> : <CgChevronLeft />}
        </span>
      </div>
      <div className="text-wrapper">
        {animate && (
          <span className={`text slide-out-${direction}`}>
            {prevHome ? "Закрыть" : "Назад"}
          </span>
        )}
        <span className={`text ${animate ? "hidden" : ""} slide-in-${direction}`}>
          {isHome ? "Закрыть" : "Назад"}
        </span>
      </div>
    </button>
  );
}
