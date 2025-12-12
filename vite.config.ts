import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      // 'argon2-browser': 'argon2-browser/dist/argon2-bundled.min.js'
    }
  },
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['argon2-browser']
  },
  worker: {
    format: 'es'
  }
});
