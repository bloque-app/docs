import type { Plugin } from '@rspress/core';
import * as path from 'path';

interface MermaidPluginOptions {
  theme?: 'dark' | 'light' | 'default' | 'base' | 'forest' | 'neutral' | 'null';
  themeVariables?: Record<string, string>;
}

export const pluginMermaid = (options: MermaidPluginOptions = {}) => {
  return {
    name: 'rspress-plugin-mermaid',
    globalUIComponents: [path.join(__dirname, 'mermaid-renderer.tsx')],
    addMetaHeader: () => [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
    ],
  } as Plugin;
};
