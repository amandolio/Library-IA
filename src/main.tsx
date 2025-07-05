import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Aumentar límite de event listeners para evitar warnings en desarrollo
if (typeof process !== 'undefined' && process.setMaxListeners) {
  process.setMaxListeners(50);
}

// También configurar para EventEmitter si está disponible
if (typeof window !== 'undefined') {
  // Configurar límites para el entorno del navegador
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  let listenerCount = 0;
  
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    listenerCount++;
    if (listenerCount > 100) {
      console.warn('Alto número de event listeners detectado:', listenerCount);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);