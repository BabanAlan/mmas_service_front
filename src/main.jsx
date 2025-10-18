import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { init, miniApp } from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
  if (!window.Telegram?.WebApp) {
    console.warn("⚠️ Telegram WebApp API не найден. Запущено вне Telegram.");
    return;
  }

  try {
    await init();

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log("✅ Mini App ready");

      // Отключаем свайп и системную кнопку
      if (window.Telegram.WebApp?.disableSwipeBack) {
        window.Telegram.WebApp.disableSwipeBack(true); // true — запрещает сворачивание свайпом
      }

      if (window.Telegram.WebApp?.BackButton?.hide) {
        window.Telegram.WebApp.BackButton.hide(); // прячем кнопку назад/закрыть
      }

      // Дополнительно можно спрятать кнопку Close (для новых версий WebApp)
      if (window.Telegram.WebApp?.MainButton?.hide) {
        window.Telegram.WebApp.MainButton.hide();
      }
    }

  } catch (error) {
    console.error("Initialize error:", error);
  }
};

initializeTelegramSDK();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
