#!/usr/bin/env node
// Membrane conformance lint for the site (the same rules the library applies to
// itself, see design-system/DESIGN-SYSTEM.md §6):
//
//   markup  every mp-* class exists in components/manifest.json, and every
//           data-* option on an mp-* element uses a value the component allows
//   styles  no raw colors, no Tier 1 primitives (--color-terracotta, tints…),
//           no deprecated or unknown tokens, no .theme-dark
//
// Static analysis only: values inside {expressions} are skipped. Exits 1 on
// any finding. Runs in `pnpm check`.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ds = join(root, 'design-system');
const manifest = JSON.parse(readFileSync(join(ds, 'components/manifest.json'), 'utf8'));
const tokensCss = readFileSync(join(ds, 'tokens/design-tokens.css'), 'utf8');

/* ---------- what the library defines ---------- */

const classToComponent = new Map();
for (const component of manifest.components) {
	for (const name of [...component.classes.roots, ...component.classes.parts]) {
		if (!classToComponent.has(name)) classToComponent.set(name, []);
		classToComponent.get(name).push(component);
	}
}
// Base-layer composites (tokens/base.css) are classes too.
const baseCss = readFileSync(join(ds, 'tokens/base.css'), 'utf8');
const baseClasses = new Set([...baseCss.matchAll(/\.(type-[a-z0-9-]+)/g)].map((m) => m[1]));

const tokens = new Set([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const deprecated = new Set([...tokensCss.matchAll(/@deprecated (--[a-z0-9-]+)/g)].map((m) => m[1]));
const primitive = /^--color-(terracotta|teal|amber|burgundy|sage|cream|charcoal|neutral|steel|slate)(-|$)/;

/* ---------- what the site contains ---------- */

const SOURCE_DIRS = ['src', 'rehype-membrane-code.mjs'];
const files = [];
const walk = (path) => {
	if (statSync(path).isDirectory()) {
		for (const entry of readdirSync(path)) walk(join(path, entry));
	} else if (/\.(astro|css|md|mdx|mjs|ts)$/.test(path)) {
		files.push(path);
	}
};
SOURCE_DIRS.forEach((dir) => walk(join(root, dir)));

const findings = [];
const report = (file, text, index, message) => {
	const line = text.slice(0, index).split('\n').length;
	findings.push(`${relative(root, file)}:${line}  ${message}`);
};

// Custom properties the site defines itself (knob overrides, Shiki mapping).
const siteDefined = new Set();
for (const file of files) {
	for (const m of readFileSync(file, 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/g)) siteDefined.add(m[1]);
}

const styleBlocks = (file, text) => {
	if (file.endsWith('.css')) return [{ css: text, offset: 0 }];
	return [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => ({ css: m[1], offset: m.index + m[0].indexOf(m[1]) }));
};

for (const file of files) {
	const text = readFileSync(file, 'utf8');

	/* markup: mp-* classes and their data-* options */
	for (const tag of text.matchAll(/<([a-z][a-z0-9-]*)\b((?:[^>"'{]|"[^"]*"|'[^']*'|\{[^}]*\})*)>/g)) {
		const attrs = tag[2];
		const classAttr = attrs.match(/\bclass=["']([^"']*)["']/) ?? attrs.match(/className:\s*\[([^\]]*)\]/);
		if (!classAttr) continue;
		const classes = classAttr[1].split(/[\s,'"]+/).filter(Boolean);
		const used = classes.filter((c) => c.startsWith('mp-') || c.startsWith('type-'));
		if (!used.length) continue;
		const components = new Set();
		for (const name of used) {
			if (name.startsWith('type-')) {
				if (!baseClasses.has(name)) report(file, text, tag.index, `unknown composite .${name}`);
			} else if (!classToComponent.has(name)) {
				report(file, text, tag.index, `unknown Membrane class .${name}`);
			} else {
				classToComponent.get(name).forEach((c) => components.add(c));
			}
		}
		for (const attr of attrs.matchAll(/\b(data-[a-z-]+)(=\{|(?:=(["'])([^"']*)\3)?)/g)) {
			const [, name, assign, , value] = attr;
			if (assign === '={') continue; // dynamic value, checked by the browser tests
			const owners = [...components].filter((c) => name in c.attributes);
			if (!owners.length) continue;
			const allowed = owners.flatMap((c) => (c.attributes[name] === 'boolean' ? ['boolean'] : c.attributes[name]));
			const ok = allowed.includes('boolean') ? value === undefined || value === '' : value !== undefined && allowed.includes(value);
			if (!ok) report(file, text, tag.index, `${name}="${value ?? ''}" is not an option of ${owners.map((c) => c.slug).join('/')} (allowed: ${allowed.join(', ')})`);
		}
	}

	/* styles: tokens and raw values */
	for (const { css, offset } of styleBlocks(file, text)) {
		const clean = css.replace(/\/\*[\s\S]*?\*\//g, (c) => ' '.repeat(c.length));
		for (const m of clean.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(|(?<![-\w])(?:white|black)(?![-\w])/g)) {
			report(file, text, offset + m.index, `raw color "${m[0]}" (use a semantic token)`);
		}
		for (const m of clean.matchAll(/var\((--[a-z0-9-]+)/g)) {
			const name = m[1];
			if (primitive.test(name)) report(file, text, offset + m.index, `Tier 1 primitive ${name} (use a semantic token)`);
			else if (deprecated.has(name)) report(file, text, offset + m.index, `deprecated token ${name}`);
			else if (!tokens.has(name) && !siteDefined.has(name) && !name.startsWith('--mp-') && !name.startsWith('--tw-')) {
				report(file, text, offset + m.index, `unknown token ${name}`);
			}
		}
		for (const m of clean.matchAll(/\.theme-dark\b/g)) report(file, text, offset + m.index, '.theme-dark is deprecated: use [data-theme="dark"]');
	}
}

if (findings.length) {
	console.error(`Membrane conformance: ${findings.length} finding(s)\n${findings.join('\n')}`);
	process.exit(1);
}
console.log(`Membrane conformance: ${files.length} files OK (Membrane ${manifest.version}).`);
