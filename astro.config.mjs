import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://crispreyecare.com', // <-- This is the critical line causing the crash!
  integrations: [
    tailwind(),
    sitemap()
  ]
});
