export default function Balance({ balance }) {
  return (
    <div className="balance">
      <h2>Ваш баланс</h2>
      <p>{balance} ₽</p>
    </div>
  );
}
