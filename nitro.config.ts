import { defineNitroConfig } from 'nitro/config';

export default defineNitroConfig({
  preset: 'cloudflare-module',
  output: {
    dir: '.output'
  },
  cloudflare: {
    // This ensures the correct worker name is used
    wrangler: {
      name: 'tracer-portraits-studio'
    }
  }
});
