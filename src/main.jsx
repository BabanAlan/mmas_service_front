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
    }

    // Спрятать системную кнопку Telegram
    miniApp.disableVerticalSwipes();
    miniApp.BackButton.hide();

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
