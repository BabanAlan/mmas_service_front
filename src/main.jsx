import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { init, miniApp, backButton } from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
  try {
    await init();

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log('Mini App ready');
    }

    // Отключаем вертикальные свайпы
    if (miniApp.disableVerticalSwipes.isAvailable()) {
      miniApp.disableVerticalSwipes();
      console.log('Vertical swipes disabled');
    }

    // Скрываем встроенную кнопку "Закрыть"
    if (backButton.isAvailable()) {
      backButton.hide();
      console.log('Back button hidden');
    }

    // (по желанию) можно изменить цвет хедера
    // if (miniApp.setHeaderColor.isAvailable()) {
    //   miniApp.setHeaderColor('secondary_bg_color');
    // }

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
