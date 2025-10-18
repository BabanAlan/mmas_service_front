import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'

import { init, miniApp } from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
  try {
    await init();

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log('Mini App ready');
    }

  } catch (error) {
    console.error('Initialize error:', error);
  }
  window.disableVerticalSwipes;
};

initializeTelegramSDK();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
