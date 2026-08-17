import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [
    // TanStack Router plugin - THIS IS CRITICAL for TanStack Start
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    // Remove cloudflare plugin during build to avoid the earlier error
    // We'll handle Cloudflare deployment separately
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // TanStack Start uses SSR by default
  ssr: {
    noExternal: ['@tanstack/*'],
  },
  // This is important - TanStack Start doesn't use index.html
  build: {
    // Don't look for index.html
    rollupOptions: {
      input: {
        client: './src/entry-client.tsx',
        server: './src/entry-server.tsx',
      },
    },
  },
});
