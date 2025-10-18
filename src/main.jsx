import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { init, miniApp, initBackButton } from '@telegram-apps/sdk';

const [backButton] = initBackButton();
backButton.hide();
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
      backButton.hide();
        try {
          window.Telegram.WebApp.disableVerticalSwipes();
        }
        catch(e){console.error(e)}

        try {
          window.Telegram.WebApp.BackButton.hide();
        }
        catch(e){console.error(e)}

        try{
          window.Telegram.WebApp.MainButton.hide();
        }
        catch(e){console.error(e)}

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
