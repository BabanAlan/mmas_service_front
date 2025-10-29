import { useEffect, useRef, useState } from "react";
import "../styles/header.css";

export default function Login({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const res = onLogin?.(login.trim(), password);
    if (!res || !res.ok) {
      setError(res?.error || "Ошибка авторизации");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="login-page" style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Вход в аккаунт</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          onKeyDown={onKeyDown}
          style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onKeyDown}
          style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }}
        />
        {error && (
          <div style={{ color: "#dc2626", fontSize: 14 }}>{error}</div>
        )}
        <button
          onClick={submit}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "#0ea5e9",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Войти
        </button>
      </div>
    </div>
  );
}


