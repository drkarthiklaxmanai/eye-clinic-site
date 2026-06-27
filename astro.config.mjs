import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://crispreyecare.com',
  prefetch: true,
  integrations: [
    tailwind(),
    sitemap({
      // Landing pages are ad-traffic-only and intentionally excluded
      // from organic discovery -- they're not meant to rank or be
      // found via search, only reached via paid campaigns.
      filter: (page) => typeof page === 'string' && !page.includes('/lp/'),
    })
  ]
});
