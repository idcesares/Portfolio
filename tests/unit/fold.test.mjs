import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findMatches, fold } from '../../src/utils/fold.ts';

test('fold lowercases and strips diacritics without changing the length', () => {
	for (const text of ['Educação', 'ÇÃO', 'Ciência da Computação', "D'Césares", 'naïve café', 'Straße', 'İstanbul']) {
		assert.equal(fold(text).length, text.length, `comprimento mudou em "${text}"`);
	}
	assert.equal(fold('Educação'), 'educacao');
	assert.equal(fold('Ciência da Computação'), 'ciencia da computacao');
	assert.equal(fold("D'Césares"), "d'cesares");
});

test('findMatches ignores case and accents and returns offsets in the ORIGINAL text', () => {
	const text = 'Educação e educacao';
	const matches = findMatches(text, 'EDUCAÇÃO');
	assert.deepEqual(matches, [[0, 8], [11, 19]]);
	assert.deepEqual(matches.map(([a, b]) => text.slice(a, b)), ['Educação', 'educacao']);
});

test('findMatches does not overlap, ignores empty terms and treats regex characters literally', () => {
	assert.deepEqual(findMatches('aaaa', 'aa'), [[0, 2], [2, 4]]);
	assert.deepEqual(findMatches('qualquer coisa', ''), []);
	assert.deepEqual(findMatches('qualquer coisa', '   '), []);
	assert.deepEqual(findMatches('a.*b', '.*'), [[1, 3]]);
	assert.deepEqual(findMatches('<img src=x>', '<img'), [[0, 4]]);
});
