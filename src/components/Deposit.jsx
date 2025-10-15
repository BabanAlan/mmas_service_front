import { useState } from "react";
import "../styles/deposit.css";

export default function Deposit({ onDeposit }) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");

  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setAmount("");
  };

  const handlePayment = () => {
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      alert("Введите сумму больше 0 ₽");
      return;
    }

    // Заглушка для YooKassa
    alert(`Заглушка: перевод на YooKassa ${numericAmount} ₽`);

    onDeposit(numericAmount);
    handleClose();
  };

  // Разрешаем вводить только цифры
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // только цифры
      setAmount(value);
    }
  };

  // Запрещаем ввод "-" и других символов через клавиатуру
  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
      e.preventDefault();
    }
  };

  return (
    <div className="deposit">
      <button onClick={handleOpen}>Пополнить баланс</button>

      {showModal && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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
