import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'custom-logger',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          // \x1b[32m makes the text green, \x1b[0m resets it
          console.log('\x1b[32mSYSTEM READY: Ready to serve on port 5173\x1b[0m');
        });
      }
    }
  ],
});