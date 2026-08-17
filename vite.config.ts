import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  // Only use cloudflare plugin during dev or preview, NOT during build
  const isBuild = command === 'build';
  
  return {
    plugins: [
      TanStackRouterVite(),
      react(),
      // Only include cloudflare plugin when not building with Nitro
      ...(isBuild && process.env.CF_BUILD !== 'true' ? [] : [cloudflare()]),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // Ensure SSR build works correctly
      rollupOptions: {
        external: ['@cloudflare/vite-plugin'],
      },
    },
  };
});
