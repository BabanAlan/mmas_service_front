import React from "react";
import "../styles/faq.css";

export default function FAQ() {
  const faqs = [
    { id: 1, question: "Как пополнить баланс?", answer: "Нажмите кнопку 'Пополнить баланс' на главной странице и следуйте инструкциям." },
    { id: 2, question: "Как купить услугу?", answer: "Выберите нужную услугу в разделе 'Услуги' и нажмите 'Купить'." },
    { id: 3, question: "Что делать, если недостаточно средств?", answer: "Пополните баланс и попробуйте снова." },
  ];

  return (
    <div className="faq-page">
      <h2>Помощь / FAQ</h2>
      {faqs.map(faq => (
        <div key={faq.id} className="faq-item">
          <strong>{faq.question}</strong>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
