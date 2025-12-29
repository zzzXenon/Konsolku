import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/', 
  build: {
    outDir: 'dist'
  },
  plugins: [
    tailwindcss(),
    {
      name: 'custom-logger',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          // \x1b[32m for green text
          // \x1b[0m for reset
          console.log('\x1b[32mSYSTEM READY: Ready to serve on port 5173\x1b[0m');
        });
      }
    }
  ],
});