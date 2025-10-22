import { useState, useRef } from "react";
import operations from "../data/HistoryData";
import "../styles/history.css";

export default function History() {
  const [selected, setSelected] = useState(null);
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const sheetRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientY - startY;
    if (diff > 0) setTranslateY(diff);
  };

  const handleTouchEnd = () => {
    if (translateY > 120) {
      animateClose();
    } else {
      setTranslateY(0);
    }
  };

  const animateClose = () => {
    setIsClosing(true);
    setTranslateY(window.innerHeight); // уезжает вниз
    setIsVisible(false); // плавно убираем overlay
    setTimeout(() => {
      setSelected(null);
      setIsClosing(false);
      setTranslateY(0);
    }, 300); // совпадает с transition
  };


  const handleSelect = (op) => {
    setSelected(op);
    setIsVisible(true);
  };


  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("bottom-sheet-overlay")) {
      animateClose();
    }
  };

  const sorted = [...operations].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="history-container">
      <h2>История операций</h2>
      {sorted.map((op, i) => (
        <div
          key={i}
          className={`history-card ${op.type}`}
          onClick={() => handleSelect(op)}
        >
          <div className="history-main">
            <div>
              <h3>{op.title}</h3>
              <p className="history-date">{op.date}</p>
            </div>
            <div className="history-amount">
              <strong>
                {op.amount > 0 ? "+" : ""}
                {op.amount} ₽
              </strong>
              <span
                className={`history-status ${
                  op.status === "Зачислено" ? "status-blue" : "status-green"
                }`}
              >
                {op.status}
              </span>
            </div>
          </div>
        </div>
      ))}

      {selected && (
        <div
          className={`bottom-sheet-overlay ${isVisible ? "show" : ""}`}
          onClick={handleOverlayClick}
        >
        <div
          className="bottom-sheet"
          ref={sheetRef}
          style={{
            transform: `translateY(${translateY}px)`,
            transition:
              isClosing || translateY === 0
                ? "transform 0.3s ease"
                : "none",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
        <div className="drag-handle" />
          <h3>{selected.title}</h3>
          <p>
            <strong>Дата:</strong> {selected.date}
          </p>
          {selected.studio && (
            <p>
              <strong>Зал:</strong> {selected.studio}
            </p>
          )}
          {selected.hours && (
            <p>
              <strong>Длительность:</strong> {selected.hours} ч.
            </p>
          )}
          <p>
            <strong>Сумма:</strong> {selected.amount} ₽
          </p>
          <p>
            <strong>Статус:</strong> {selected.status}
          </p>
        </div>
      </div>
    )}
    </div>
  );
}
