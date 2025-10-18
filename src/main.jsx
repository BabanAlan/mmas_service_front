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

      // Скрываем BackButton
      try {
        miniApp.BackButton.hide();
      } catch (e) {
        console.warn("BackButton.hide() не сработало:", e);
      }

      // Отключаем свайп вниз (если SDK поддерживает)
      try {
        miniApp.disableVerticalSwipes();
      } catch (e) {
        console.warn("disableVerticalSwipes() не сработало:", e);
      }

      // Важно: Telegram WebApp может сам игнорировать запрет свайпа в некоторых версиях
      // На iOS чаще всего нельзя полностью убрать свайп вниз
      if (window.Telegram.WebApp) {
        try {
          window.Telegram.WebApp.disableSwipeBack?.(true);
        } catch {}
      }
      createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

    }
  } catch (error) {
    console.error("Initialize error:", error);
  }
};

initializeTelegramSDK();

