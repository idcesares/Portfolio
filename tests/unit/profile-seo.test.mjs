// O PROFILE.md é a autoridade factual sobre o Isaac. Estes testes leem o texto dele
// (nada fixo aqui) e impedem que o SEO (JSON-LD, llms.txt, descrições) volte a
// divergir em silêncio quando o perfil ou o código mudarem.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const profile = read('design-system/PROFILE.md');
const seo = await import('../../src/utils/seo.ts');

const field = (label) => profile.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`))?.[1]?.trim();
const role = field('Current role \\(pt-BR\\)');
const ufrj = field('UFRJ public wording \\(pt-BR\\)');

const personNode = () => seo.getSiteStructuredData(new URL('https://example.com')).find((node) => node['@type'] === 'Person');

test('PROFILE.md states the role and the UFRJ wording these tests compare against', () => {
	assert.ok(role, 'não achei "Current role (pt-BR)" no PROFILE.md');
	assert.ok(ufrj, 'não achei "UFRJ public wording (pt-BR)" no PROFILE.md');
});

test('the JSON-LD job title is the role written in PROFILE.md and the organization closes it', () => {
	assert.equal(seo.AUTHOR_JOB_TITLE, role);
	assert.ok(role.endsWith(seo.AUTHOR_ORG), `"${role}" deveria terminar em "${seo.AUTHOR_ORG}"`);
	const person = personNode();
	assert.equal(person.jobTitle, role);
	assert.equal(person.worksFor.name, seo.AUTHOR_ORG);
});

test('the Person node never lists UFRJ as a finished degree: the master\'s is in progress', () => {
	const person = personNode();
	assert.ok(!(person.alumniOf ?? []).some((school) => /UFRJ/.test(school.name)), 'alumniOf diria que o mestrado terminou');
});

test('llms.txt and the about page repeat the role and the UFRJ wording from PROFILE.md', () => {
	const llms = read('src/pages/llms.txt.ts');
	assert.ok(llms.includes(role), 'llms.txt: cargo diferente do PROFILE.md');
	assert.ok(llms.includes(ufrj), 'llms.txt: vínculo com a UFRJ diferente do PROFILE.md');
	const about = read('src/pages/about.astro');
	assert.ok(about.includes(role), 'about.astro: cargo diferente do PROFILE.md');
	assert.ok(about.includes(ufrj), 'about.astro: vínculo com a UFRJ diferente do PROFILE.md');
});

test('public descriptions use the current identity and not the retired "construtor"', () => {
	assert.match(seo.SITE_DESCRIPTION, /desenvolvedor/);
	for (const file of ['src/utils/seo.ts', 'src/pages/about.astro', 'src/pages/llms.txt.ts']) {
		assert.doesNotMatch(read(file), /educador e construtor/i, `${file} ainda diz "educador e construtor"`);
	}
});
