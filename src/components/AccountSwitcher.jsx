import { useMemo, useRef, useState } from "react";
import "../styles/header.css";

function generateColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 50%)`;
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] || "?";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase();
}

export default function AccountSwitcher({ accounts, currentId, onSelect, onRemove, onAdd }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const current = useMemo(
    () => accounts.find((a) => a.id === currentId) || accounts[0],
    [accounts, currentId]
  );

  // close when clicked outside
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  // note: we avoid adding heavy effects; close menu externally by body click

  return (
    <div className="account-switcher" ref={containerRef}>
      <button
        className="avatar-button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Аккаунты"
      >
        <div className="avatar-circle" style={{ background: current?.color }}>
          <span>{getInitials(current?.name || "?")}</span>
        </div>
      </button>

      {open && (
        <div className="account-menu">
          <div className="account-menu-header">Аккаунты</div>
          <div className="account-list">
            {accounts.map((a) => (
              <div key={a.id} className={`account-item ${a.id === currentId ? "active" : ""}`}>
                <button className="account-row" onClick={() => { onSelect(a.id); setOpen(false); }}>
                  <div className="avatar-circle small" style={{ background: a.color }}>
                    <span>{getInitials(a.name)}</span>
                  </div>
                  <span className="account-name">{a.name}</span>
                </button>
                {accounts.length > 1 && (
                  <button className="remove-btn" onClick={() => {
                    if (window.confirm("Удалить этот аккаунт из списка?")) {
                      onRemove(a.id);
                    }
                  }} aria-label="Удалить">
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="add-account" onClick={() => { setOpen(false); onAdd && onAdd(); }}>
            Добавить аккаунт
          </button>
        </div>
      )}
    </div>
  );
}


