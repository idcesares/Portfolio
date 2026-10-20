#!/usr/bin/env node
// Copies The Membrane Palette distribution into design-system/.
//
// The site is an execution of the Membrane, so it ships the library as is:
// membrane.css (fonts + tokens + base + components), membrane.js (behaviors),
// the Tailwind v4 theme, the self-hosted fonts and the brand marks. Nothing in
// design-system/ is edited by hand; run this script to update it.
//
//   node scripts/sync-membrane.mjs --from ../The-Membrane-Palette
//   node scripts/sync-membrane.mjs --ref <tag or commit>     (via jsDelivr)
//
// Writes design-system/membrane.lock.json with the version and source.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const target = join(repoRoot, 'design-system');
const REPO = 'idcesares/The-Membrane-Palette';

const FONTS = ['fraunces', 'instrument-sans', 'jetbrains-mono'].flatMap((family) =>
	['latin', 'latin-ext'].flatMap((subset) =>
		['normal', 'italic'].map((style) => {
			const axis = family === 'fraunces' ? 'opsz' : 'wght';
			return `fonts/${family}-${subset}-${axis}-${style}.woff2`;
		}),
	),
);

const FILES = [
	'membrane.css',
	'llms.txt',
	'DESIGN-SYSTEM.md',
	'PROFILE.md',
	'VOICE.md',
	'BRAND-VOICE.md',
	'CHANGELOG.md',
	'components/membrane.js',
	'components/membrane.d.ts',
	'components/manifest.json',
	'tokens/design-tokens.css',
	'tokens/base.css',
	'tokens/membrane-tailwind.css',
	'tokens/tokens.resolved.json',
	'fonts/fonts.css',
	'fonts/OFL-Fraunces.txt',
	'fonts/OFL-Instrument-Sans.txt',
	'fonts/OFL-JetBrains-Mono.txt',
	...FONTS,
	'brand/idcesares-logo-compact-primary.svg',
	'brand/idcesares-logo-wordmark-primary.svg',
	'brand/idcesares-logo-monogram-primary.svg',
	'brand/idcesares-icon-monogram-light.svg',
	'brand/idcesares-icon-monogram-dark.svg',
];

function parseArgs(argv) {
	const args = {};
	for (let i = 0; i < argv.length; i += 1) {
		if (argv[i] === '--from') args.from = argv[++i];
		else if (argv[i] === '--ref') args.ref = argv[++i];
	}
	if (!args.from && !args.ref) args.from = resolve(repoRoot, '../The-Membrane-Palette');
	return args;
}

async function readSource({ from, ref }, path) {
	if (from) return readFileSync(join(from, path));
	const url = `https://cdn.jsdelivr.net/gh/${REPO}@${ref}/${path}`;
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${response.status} ${url}`);
	return Buffer.from(await response.arrayBuffer());
}

function gitCommit(dir) {
	try {
		return execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
	} catch {
		return null;
	}
}

const args = parseArgs(process.argv.slice(2));
if (args.from && !existsSync(join(args.from, 'membrane.css'))) {
	console.error(`No Membrane checkout at ${args.from}. Pass --from <dir> or --ref <tag>.`);
	process.exit(1);
}

const sources = await Promise.all(FILES.map(async (path) => [path, await readSource(args, path)]));

// Replace the managed folders wholesale so files removed upstream disappear here.
for (const dir of ['components', 'tokens', 'fonts', 'brand']) {
	rmSync(join(target, dir), { recursive: true, force: true });
}
for (const [path, contents] of sources) {
	const out = join(target, path);
	mkdirSync(dirname(out), { recursive: true });
	writeFileSync(out, contents);
}

const manifest = JSON.parse(readFileSync(join(target, 'components/manifest.json'), 'utf8'));
const lock = {
	package: '@idcesares/the-membrane-palette',
	version: manifest.version,
	repository: `https://github.com/${REPO}`,
	ref: args.ref ?? gitCommit(args.from),
	files: FILES.length,
};
writeFileSync(join(target, 'membrane.lock.json'), `${JSON.stringify(lock, null, '\t')}\n`);
console.log(`Membrane ${lock.version} (${lock.ref ?? 'local'}) → design-system/ (${FILES.length} files)`);
