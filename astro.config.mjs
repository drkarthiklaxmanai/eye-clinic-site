import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // THIS is the line that fixes the crash. It must be here!
  site: 'https://crispreyecare.com', 
  integrations: [
    tailwind(),
    sitemap()
  ]
});
