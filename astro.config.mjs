import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// English at the root, French under /fr/ (static output, deployed as is on Vercel).
export default defineConfig({
  site: 'https://astro-float.org',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  // no font or image is inlined into the CSS as a data: address (the Content-Security-Policy in vercel.json forbids it; one request more is cached)
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
      i18n: { defaultLocale: 'en', locales: { en: 'en-GB', fr: 'fr-FR' } },
    }),
  ],
});
