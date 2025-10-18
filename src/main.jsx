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

      // Убираем кнопку "Закрыть"
      miniApp.setBackButtonVisible(false);
      miniApp.disableClosingConfirmation();

      // Отключаем свайпы вниз
      if (miniApp.disableVerticalSwipes) {
        miniApp.disableVerticalSwipes();
      }

      // Можно также задать цвет хедера
      // miniApp.setHeaderColor('secondary_bg_color');
    }

  } catch (error) {
    console.error('Initialize error:', error);
  }
};

initializeTelegramSDK();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
