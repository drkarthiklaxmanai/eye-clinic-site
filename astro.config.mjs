import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // THIS is the line that fixes the crash. It must be here!
  site: 'https://crispreyecare.com',
  prefetch: true,
  integrations: [
    tailwind(),
    sitemap({
      // Exclude ad landing pages from the sitemap -- they're noindexed
      // and shouldn't be submitted to Google for organic crawling.
      filter: (page) => !page.includes('/lp/'),
    }),
  ],
});
