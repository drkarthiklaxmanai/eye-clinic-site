import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // THIS is the line that fixes the crash. It must be here!
  site: 'https://crispreyecare.com', 
  prefetch: true, 
  integrations: [
    tailwind()
  ]
});
