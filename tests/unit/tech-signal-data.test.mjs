// Integridade dos dados do Tech Signal Stack e regras de voz do CLAUDE.md §1.
// Roda sem rede. Pega o erro de digitação que só apareceria como card quebrado.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { STALE_AFTER_DAYS } from '../../scripts/check-feeds.mjs';

const data = await import('../../src/data/tech-signal-sources.ts');
const { SOURCES, THEMES, CATEGORIES, ROUTINES, KIND_NAME, TIER_NAME } = data;

const BANNED = /(mergulh(ar|o|e)|desvendar|crucial|fundamental|paix[ãa]o|catalisador|jornada|game-changer|disruptiv[oa]|revolucion(ar|e)|vale ressaltar|em suma|[ée] importante notar|no cen[áa]rio atual|navegar pelas complexidades)/i;

test('every source has a unique name and an https address', () => {
	const names = SOURCES.map((source) => source.name);
	assert.equal(new Set(names).size, names.length, 'nome repetido');
	for (const source of SOURCES) {
		assert.match(source.url, /^https:\/\//, `${source.name}: url sem https`);
		if (source.feed) assert.match(source.feed, /^https:\/\//, `${source.name}: feed sem https`);
	}
});

test('enumerated fields use values the page and the feed checker know', () => {
	const categories = new Set(CATEGORIES.map((category) => category.id));
	const themes = new Set(THEMES.map((theme) => theme.id));
	const routines = new Set(ROUTINES.map((routine) => routine.id));
	for (const source of SOURCES) {
		assert.ok([1, 2, 3].includes(source.tier) && TIER_NAME[source.tier], `${source.name}: tier`);
		assert.ok(KIND_NAME[source.kind], `${source.name}: natureza ${source.kind}`);
		assert.ok(source.cadence in STALE_AFTER_DAYS, `${source.name}: cadência ${source.cadence} sem limite no check:feeds`);
		assert.ok(source.cats.length > 0 && source.cats.every((id) => categories.has(id)), `${source.name}: categoria`);
		assert.ok(!source.themes || (source.themes.length <= 3 && source.themes.every((id) => themes.has(id))), `${source.name}: temas`);
		assert.ok(!source.routine || routines.has(source.routine), `${source.name}: rotina`);
		assert.ok(source.topics.length > 0, `${source.name}: sem topics`);
	}
});

test('every theme in the vocabulary is used by at least two sources', () => {
	for (const theme of THEMES) {
		const used = SOURCES.filter((source) => source.themes?.includes(theme.id)).length;
		assert.ok(used >= 2, `tema "${theme.label}" tem ${used} fonte(s)`);
	}
});

test('verifiedAt is a past ISO date and only appears on sources with no feed', () => {
	for (const source of SOURCES) {
		if (!source.verifiedAt) continue;
		assert.match(source.verifiedAt, /^\d{4}-\d{2}-\d{2}$/, `${source.name}: formato`);
		assert.ok(new Date(`${source.verifiedAt}T00:00:00Z`).getTime() <= Date.now() + 86_400_000, `${source.name}: data no futuro`);
		assert.ok(!source.feed, `${source.name}: tem feed, o check:feeds já o confere`);
	}
});

test('card copy follows the voice rules: no long dash, no LLM or LinkedIn vocabulary', () => {
	for (const source of SOURCES) {
		for (const [field, text] of [['desc', source.desc], ...source.topics.map((topic) => ['topic', topic])]) {
			assert.ok(!text.includes('—'), `${source.name} (${field}): travessão longo`);
			const hit = text.match(BANNED);
			assert.ok(!hit, `${source.name} (${field}): "${hit?.[0]}"`);
		}
	}
});

test('the "mês de ano" label is derived from the curation date, never typed by hand', () => {
	const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
	assert.match(data.CURATED_AT, /^\d{4}-\d{2}-\d{2}$/);
	const [year, month] = data.CURATED_AT.split('-');
	assert.equal(data.CURATED_LABEL, `${months[Number(month) - 1]} de ${year}`);
});
