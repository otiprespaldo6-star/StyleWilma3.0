import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update capability
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nueva versión de Styled By Wilma disponible. Actualizando...');
  },
  onOfflineReady() {
    console.log('Styled By Wilma está lista para funcionar sin conexión.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
