import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { init, miniApp } from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
  if (!window.Telegram?.WebApp) {
    console.warn("⚠️ Telegram WebApp API не найден. Запущено вне Telegram.");
    return false;
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

      // Отключаем свайп вниз
      try {
        miniApp.disableVerticalSwipes();
      } catch (e) {
        console.warn("disableVerticalSwipes() не сработало:", e);
      }

      if (window.Telegram.WebApp) {
        try {
          window.Telegram.WebApp.disableSwipeBack?.(true);
        } catch {}
      }
    }
    return true;
  } catch (error) {
    console.error("Initialize error:", error);
    return false;
  }
};

// Инициализируем перед рендерингом
initializeTelegramSDK().then((tgInitialized) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App tgInitialized={tgInitialized} />
    </StrictMode>
  );
});