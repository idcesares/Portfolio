#!/usr/bin/env node
// Verifies every /assets/... path referenced from content collections actually
// exists in public/, catching broken images before they reach production.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const contentDirs = ['src/content/blog', 'src/content/work'];
// Requires a boundary before `/assets/` so it doesn't match the tail of an
// external URL (e.g. https://colab.research.google.com/assets/colab-badge.svg).
const assetPattern = /(?<=^|[\s("'>])\/assets\/[^\s)"'>]+/gm;

let missing = [];

for (const dir of contentDirs) {
  const absDir = `${repoRoot}${dir}/`;
  for (const file of readdirSync(absDir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = readFileSync(`${absDir}${file}`, 'utf-8');
    const matches = raw.match(assetPattern) ?? [];
    for (const match of new Set(matches)) {
      const publicPath = `${repoRoot}public${match}`;
      if (!existsSync(publicPath)) {
        missing.push({ file: `${dir}/${file}`, path: match });
      }
    }
  }
}

if (missing.length > 0) {
  console.error('Broken /assets/ references found:\n');
  for (const { file, path } of missing) {
    console.error(`  ${file} -> ${path}`);
  }
  process.exit(1);
}

console.log(`OK: all /assets/ references in content collections resolve to a file in public/.`);
