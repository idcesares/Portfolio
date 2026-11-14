import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildOpml, escapeXml } from '../../src/utils/opml.ts';

const base = { title: 'Tech Signal Stack', ownerName: "Isaac D'Césares", ownerId: 'https://example.com/tech-signal/', modified: new Date('2026-11-09T00:00:00Z') };
const item = (name, xmlUrl = 'https://example.com/feed') => ({ name, xmlUrl, htmlUrl: 'https://example.com', description: 'Jornalismo · Diária · Global' });

test('escapes the five XML characters in every attribute and text node', () => {
	assert.equal(escapeXml(`<a href="x">Tom & 'Jerry'</a>`), '&lt;a href=&quot;x&quot;&gt;Tom &amp; &apos;Jerry&apos;&lt;/a&gt;');
	const xml = buildOpml({ ...base, folders: [{ label: 'P&D', items: [item('R&B <live>')] }] });
	assert.match(xml, /<outline text="P&amp;D" title="P&amp;D">/);
	assert.match(xml, /text="R&amp;B &lt;live&gt;" title="R&amp;B &lt;live&gt;"/);
	assert.match(xml, /<ownerName>Isaac D&apos;Césares<\/ownerName>/);
});

test('produces OPML 2.0 with a head, folders of outlines and the modified date in UTC', () => {
	const xml = buildOpml({ ...base, folders: [{ label: 'Brasil', items: [item('JOTA'), item('Tecnoblog')] }] });
	assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>\n<opml version="2.0">/);
	assert.match(xml, /<dateModified>Mon, 09 Nov 2026 00:00:00 GMT<\/dateModified>/);
	assert.equal((xml.match(/<outline type="rss"/g) ?? []).length, 2);
	assert.ok(xml.endsWith('</opml>\n'));
});

test('drops empty folders, so a cut never exports a folder with nothing in it', () => {
	const xml = buildOpml({ ...base, folders: [{ label: 'Vazia', items: [] }, { label: 'Cheia', items: [item('X')] }] });
	assert.doesNotMatch(xml, /Vazia/);
	assert.match(xml, /Cheia/);
});
