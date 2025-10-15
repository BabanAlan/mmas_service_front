export default function Home({ onNavigate }) {
  return (
    <div className="home-grid">
      <div className="home-block" onClick={() => onNavigate("services")}>Услуги</div>
      <div className="home-block" onClick={() => onNavigate("history")}>История</div>
      <div className="home-block" onClick={() => onNavigate("faq")}>Помощь</div>
    </div>
  );
}
