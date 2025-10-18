import { useState, useRef } from "react";
import "../styles/history.css";

export default function History() {
  const [selected, setSelected] = useState(null);
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const sheetRef = useRef(null);

  const operations = [
    {
      type: "purchase",
      title: "Тренировка",
      date: "03.10.2025",
      amount: -1500,
      status: "Оплачено",
      studio: "Теплый Стан",
      hours: 1.5
    },
    {
      type: "refill",
      title: "Пополнение",
      date: "01.10.2025",
      amount: 2000,
      status: "Зачислено"
    },
    {
      type: "purchase",
      title: "Кофе",
      date: "02.10.2025",
      amount: -280,
      status: "Оплачено"
    },
    {
      type: "purchase",
      title: "Тренировка",
      date: "05.10.2025",
      amount: -1500,
      status: "Оплачено",
      studio: "Южный Парк",
      hours: 1.5
    },
    {
      type: "refill",
      title: "Пополнение",
      date: "06.10.2025",
      amount: 5000,
      status: "Зачислено"
    },
    {
      type: "purchase",
      title: "Абонемент — фитнес",
      date: "07.10.2025",
      amount: -3500,
      status: "Оплачено",
      studio: "FitLife",
      hours: 10
    },
    {
      type: "purchase",
      title: "Аптека",
      date: "08.10.2025",
      amount: -780,
      status: "Оплачено"
    },
    {
      type: "refill",
      title: "Перевод от друга",
      date: "09.10.2025",
      amount: 1200,
      status: "Зачислено"
    },
    {
      type: "purchase",
      title: "Такси",
      date: "10.10.2025",
      amount: -640,
      status: "Оплачено"
    },
    {
      type: "purchase",
      title: "Тренировка",
      date: "11.10.2025",
      amount: -1500,
      status: "Оплачено",
      studio: "Теплый Стан",
      hours: 1.5
    },
    {
      type: "purchase",
      title: "Снятие наличных",
      date: "12.10.2025",
      amount: -3000,
      status: "Выполнено"
    },
    {
      type: "purchase",
      title: "Ужин в ресторане",
      date: "13.10.2025",
      amount: -2580,
      status: "Оплачено"
    },
    {
      type: "refill",
      title: "Пополнение",
      date: "14.10.2025",
      amount: 3000,
      status: "В ожидании"
    },
    {
      type: "purchase",
      title: "Онлайн-курс",
      date: "15.10.2025",
      amount: -2490,
      status: "Оплачено"
    },
    {
      type: "purchase",
      title: "Тренировка",
      date: "16.10.2025",
      amount: -1500,
      status: "Оплачено",
      studio: "Сокол",
      hours: 1.5
    }
  ];

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
    setTimeout(() => {
      setSelected(null);
      setIsClosing(false);
      setTranslateY(0);
    }, 300); // синхронно с transition
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
          onClick={() => setSelected(op)}
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
        <div className="bottom-sheet-overlay" onClick={handleOverlayClick}>
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
