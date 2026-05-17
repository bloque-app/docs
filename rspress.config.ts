import { defineConfig } from '@rspress/core';
import { pluginPreview } from '@rspress/plugin-preview';
import { pluginSitemap } from '@rspress/plugin-sitemap';
import * as path from 'node:path';
import { pluginMermaid } from './plugins/plugin-mermaid';

const PUBLISH_URL = 'https://docs.bloque.sh';
const PUBLIC_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL ?? '';
const PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';
const PUBLIC_SUPABASE_TABLE = process.env.PUBLIC_SUPABASE_TABLE ?? '';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Bloque Docs',
  description: 'The official documentation for building apps on Bloque',
  lang: 'es',
  logoText: 'Bloque Docs',
  icon: '/bloque-icon.png',
  logo: {
    light: '/bloque-icon.png',
    dark: '/bloque-icon.png',
  },
  plugins: [
    pluginPreview({
      previewLanguages: ['tsx', 'jsx', 'mdx'],
      iframeOptions: {
        devPort: 7778,
      },
    }),
    pluginSitemap({
      siteUrl: PUBLISH_URL,
    }),
    pluginMermaid({
      theme: 'default',
    }),
  ],
  route: {
    cleanUrls: true,
    exclude: ['**/fragments/**', 'components/**'],
  },
  themeConfig: {
    lastUpdated: true,
    footer: {
      message: '© 2025-present Bloque Copilot Inc.',
    },
    enableAppearanceAnimation: true,
    hideNavbar: 'auto',
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/bloque-app/sdk',
      },
      {
        icon: 'npm',
        mode: 'link',
        content: 'https://www.npmjs.com/package/@bloque/sdk',
      },
      {
        icon: 'x',
        mode: 'link',
        content: 'https://x.com/bloque_app',
      },
    ],
    editLink: {
      docRepoBaseUrl:
        'https://github.com/bloque-app/sdk/tree/main/website/docs',
    },
    locales: [
      {
        lang: 'es',
        title: 'Bloque SDK',
        label: 'Español',
      },
      {
        lang: 'en',
        title: 'Bloque SDK',
        label: 'English',
      },
    ],
  },
  languageParity: {
    enabled: false,
    include: [],
    exclude: [],
  },
  builderConfig: {
    source: {
      preEntry: ['./styles/index.css'],
      define: {
        __PUBLIC_SUPABASE_URL__: JSON.stringify(PUBLIC_SUPABASE_URL),
        __PUBLIC_SUPABASE_PUBLISHABLE_KEY__: JSON.stringify(
          PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        ),
        __PUBLIC_SUPABASE_TABLE__: JSON.stringify(PUBLIC_SUPABASE_TABLE),
      },
    },
  },
});
