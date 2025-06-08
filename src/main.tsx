// Remover importações de polyfills que estão causando erros
// Comentando temporariamente para teste
// import './lib/buffer-polyfill.js';
// import './lib/crypto-polyfill.js';
// import './lib/events-polyfill.js';
// import './lib/cloudflare-sockets-fallback.js';
// import './lib/util-polyfill.js';

// Definir Buffer globalmente
// import { Buffer } from './lib/buffer-polyfill.js';
// (window as Window & typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer;

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Inicializar banco de dados local de geradoras
import { initLocalGeradoras } from './lib/init-local-geradoras';

// Inicializar geradoras locais
initLocalGeradoras();

createRoot(document.getElementById("root")!).render(<App />);
