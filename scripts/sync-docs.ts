#!/usr/bin/env bun

import { $ } from 'bun';
import { cp, exists, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REPOS = [
  {
    repo: 'https://github.com/bloque-app/sdk.git',
    slug: 'sdk',
  },
  {
    repo: 'https://github.com/bloque-app/payments.git',
    slug: 'pay',
  },
];

const SOURCE_ROOT = 'website';
const LANGS = ['en', 'es'] as const;

const destDir = process.argv[2];
if (!destDir) {
  console.error('Usage: sync-docs <destination>');
  process.exit(1);
}

const tmpBase = join(tmpdir(), `docs-sync-${Date.now()}`);

await Promise.all([
  mkdir(tmpBase, { recursive: true }),
  mkdir(destDir, { recursive: true }),
]);

console.log(`Syncing docs to: ${destDir}\n`);

for (const { repo, slug } of REPOS) {
  const clonePath = join(tmpBase, slug);

  console.log(`Cloning ${repo}`);
  await $`git clone --depth 1 ${repo} ${clonePath}`;

  for (const lang of LANGS) {
    const sourcePath = join(clonePath, SOURCE_ROOT, lang);
    const targetPath = join(destDir, lang, slug);

    if (!(await exists(sourcePath))) {
      console.warn(`Skipping ${slug}/${lang}: folder not found`);
      continue;
    }

    await mkdir(join(destDir, lang), { recursive: true });

    await rm(targetPath, { recursive: true, force: true });
    await cp(sourcePath, targetPath, { recursive: true });

    const GENERATED_CONTENT = `This directory is generated at deploy time.

Source repository: ${repo}
Language: ${lang}

Its contents are not versioned and may be overwritten on each deployment.
Do not modify files or folders manually.
`;

    await Bun.write(join(targetPath, '.generated'), GENERATED_CONTENT);

    console.log(`Copied ${slug}/website/${lang} → ${lang}/${slug}`);
  }

  console.log();
}

await rm(tmpBase, { recursive: true, force: true });
console.log('Docs sync completed.');
