import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import YAML from 'yaml';

/** Loader .yml/.yaml agar file data bisa di-import langsung dari komponen. */
function yaml() {
  return {
    name: 'yaml-loader',
    enforce: 'pre',
    transform(code, id) {
      if (!/\.ya?ml(\?|$)/.test(id)) return null;
      const data = YAML.parse(code);
      return { code: `export default ${JSON.stringify(data)};`, map: null };
    },
  };
}

// astro.config dijalankan Node biasa, jadi .env dibaca manual.
const env = {
  ...loadEnv('development', process.cwd(), ''),
  ...loadEnv('production', process.cwd(), ''),
  ...process.env,
};
const site = env.SITE_URL || undefined;

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: site ? [sitemap()] : [],
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  vite: {
    plugins: [yaml()],
  },
});
