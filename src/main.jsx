import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { init, miniApp } from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
  try {
    await init();

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log('Mini App ready');
    }

    // Отключаем вертикальные свайпы, чтобы приложение не сворачивалось
    if (window.Telegram?.WebApp?.disableVerticalSwipes) {
      window.Telegram.WebApp.disableVerticalSwipes();
      console.log('Vertical swipes disabled');
    }

  } catch (error) {
    console.error('Initialize error:', error);
  }
};

initializeTelegramSDK();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
