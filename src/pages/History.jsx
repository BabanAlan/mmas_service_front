export default function History() {
  const operations = [
    { id: 1, type: "Пополнение", amount: 1200, date: "2025-10-15" },
    { id: 2, type: "Покупка: Онлайн-консультация", amount: -500, date: "2025-10-14" },
    { id: 3, type: "Пополнение", amount: 800, date: "2025-10-13" },
  ];

  return (
    <div className="history-page">
      <h2>История операций</h2>
      {operations.map(op => (
        <div key={op.id} className="history-item">
          <span>{op.date}</span>
          <span>{op.type}</span>
          <span>{op.amount > 0 ? `+${op.amount} ₽` : `${op.amount} ₽`}</span>
        </div>
      ))}
    </div>
  );
}
