const services = [
  {
    id: 1,
    name: "Онлайн-консультация",
    description: "Консультация эксперта через видеосвязь",
    price: 500,
  },
  {
    id: 2,
    name: "Премиум-доступ",
    description: "Доступ к эксклюзивным материалам",
    price: 1200,
  },
  {
    id: 3,
    name: "Обучающий курс",
    description: "Полный курс по основам программирования",
    price: 2500,
  },
];

export default function Services({ onPurchase }) {
  return (
    <div className="services">
      {services.map((s) => (
        <div key={s.id} className="service-card">
          <h3>{s.name}</h3>
          <p>{s.description}</p>
          <div className="bottom">
            <span>{s.price} ₽</span>
            <button onClick={() => onPurchase(s)}>Оплатить</button>
          </div>
        </div>
      ))}
    </div>
  );
}
