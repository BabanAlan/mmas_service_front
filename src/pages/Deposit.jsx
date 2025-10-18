import { useState } from "react";
import "../styles/deposit.css";

export default function Deposit({ onDeposit }) {
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false); // состояние закрытия
  const [amount, setAmount] = useState("");

  const handleOpen = () => setShowModal(true);

  const handleClose = () => {
    setClosing(true); // запускаем анимацию закрытия
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
      setAmount("");
    }, 300); // время совпадает с duration анимации CSS
  };

  const handlePayment = () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      alert("Введите сумму больше 0 ₽");
      return;
    }
    alert(`Заглушка: перевод на YooKassa ${numericAmount} ₽`);
    onDeposit(numericAmount);
    handleClose();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) setAmount(value);
  };

  const handleKeyDown = (e) => {
    if (["-", "+", "e", "."].includes(e.key)) e.preventDefault();
  };

  return (
    <div className="deposit">
      <button onClick={handleOpen}>Пополнить баланс</button>

      {showModal && (
        <div
          className={`modal-overlay ${closing ? "closing" : ""}`}
          onClick={handleClose}
        >
          <div
            className={`modal ${closing ? "modal-closing" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Введите сумму пополнения</h3>
            <input
              type="text"
              placeholder="Сумма в ₽"
              value={amount}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              inputMode="numeric"
            />
            <button onClick={handlePayment}>Перейти к оплате</button>
          </div>
        </div>
      )}
    </div>
  );
}
