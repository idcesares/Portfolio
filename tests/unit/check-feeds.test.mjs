import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analyzeFeed, decodeEntities, judge, judgeVerification } from '../../scripts/check-feeds.mjs';

const NOW = new Date('2026-11-01T00:00:00Z');

const rss = (...dates) => `<?xml version="1.0"?><rss version="2.0"><channel><title>x</title>
<lastBuildDate>Mon, 01 Jan 2035 00:00:00 GMT</lastBuildDate>
${dates.map((d) => `<item><title>t</title><pubDate>${d}</pubDate></item>`).join('\n')}</channel></rss>`;

test('reads RSS items and picks the newest pubDate, ignoring the channel lastBuildDate', () => {
	const result = analyzeFeed(rss('Mon, 05 Oct 2026 10:00:00 GMT', 'Wed, 28 Oct 2026 10:00:00 GMT'));
	assert.equal(result.format, 'rss');
	assert.equal(result.items, 2);
	assert.equal(result.latest.toISOString().slice(0, 10), '2026-10-28');
});

test('reads Atom entries (updated / published)', () => {
	const atom = `<feed xmlns="http://www.w3.org/2005/Atom"><title>x</title>
<updated>2035-01-01T00:00:00Z</updated>
<entry><title>a</title><updated>2026-10-20T09:00:00Z</updated></entry>
<entry><title>b</title><published>2026-10-25T09:00:00Z</published></entry></feed>`;
	const result = analyzeFeed(atom);
	assert.equal(result.format, 'atom');
	assert.equal(result.items, 2);
	assert.equal(result.latest.toISOString().slice(0, 10), '2026-10-25');
});

test('reads RDF (RSS 1.0) with dc:date and CDATA dates', () => {
	const rdf = `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><channel/>
<item><dc:date>2026-09-01T00:00:00Z</dc:date></item>
<item><pubDate><![CDATA[Tue, 20 Oct 2026 08:00:00 GMT]]></pubDate></item></rdf:RDF>`;
	const result = analyzeFeed(rdf);
	assert.equal(result.format, 'rdf');
	assert.equal(result.items, 2);
	assert.equal(result.latest.toISOString().slice(0, 10), '2026-10-20');
});

test('an HTML page served with 200 is not a feed', () => {
	const result = analyzeFeed('<!doctype html><html><body>Just a moment...</body></html>');
	assert.equal(result.format, null);
	assert.equal(judge({ cadence: 'Diária', analysis: result, now: NOW }).status, 'fail');
});

test('a feed with no items fails', () => {
	const result = analyzeFeed('<rss version="2.0"><channel><title>x</title></channel></rss>');
	assert.equal(result.items, 0);
	assert.equal(judge({ cadence: 'Semanal', analysis: result, now: NOW }).status, 'fail');
});

test('stale limits follow the declared cadence', () => {
	const at = (days) => analyzeFeed(rss(new Date(NOW.getTime() - days * 86_400_000).toUTCString()));
	assert.equal(judge({ cadence: 'Diária', analysis: at(10), now: NOW }).status, 'ok');
	assert.equal(judge({ cadence: 'Diária', analysis: at(30), now: NOW }).status, 'stale');
	assert.equal(judge({ cadence: 'Semanal', analysis: at(30), now: NOW }).status, 'ok');
	assert.equal(judge({ cadence: 'Quinzenal', analysis: at(20), now: NOW }).status, 'ok');
	assert.equal(judge({ cadence: 'Quinzenal', analysis: at(45), now: NOW }).status, 'stale');
	assert.equal(judge({ cadence: 'Mensal', analysis: at(100), now: NOW }).status, 'ok');
	assert.equal(judge({ cadence: 'Mensal', analysis: at(200), now: NOW }).status, 'stale');
	assert.equal(judge({ cadence: 'Trimestral', analysis: at(150), now: NOW }).status, 'ok');
	assert.equal(judge({ cadence: 'Trimestral', analysis: at(260), now: NOW }).status, 'stale');
	assert.equal(judge({ cadence: 'Anual', analysis: at(400), now: NOW }).status, 'ok');
});

test('items without dates are accepted but noted', () => {
	const result = analyzeFeed('<rss><channel><item><title>x</title></item></channel></rss>');
	const verdict = judge({ cadence: 'Diária', analysis: result, now: NOW });
	assert.equal(verdict.status, 'ok');
	assert.match(verdict.note, /sem data/);
});

test('feedless sources are judged by the date someone saw them publishing', () => {
	assert.equal(judgeVerification(undefined, NOW).status, 'unverified');
	assert.equal(judgeVerification('ontem', NOW).status, 'unverified');
	assert.equal(judgeVerification('2026-10-20', NOW).status, 'ok');
	assert.equal(judgeVerification('2026-08-15', NOW).status, 'ok');
	const old = judgeVerification('2026-06-01', NOW);
	assert.equal(old.status, 'stale');
	assert.match(old.note, /153 dias/);
});

test('entities are decoded once: "&amp;lt;" stays "&lt;" instead of becoming "<"', () => {
	assert.equal(decodeEntities('&amp;lt;b&amp;gt;'), '&lt;b&gt;');
	assert.equal(decodeEntities('Tom &amp; Jerry'), 'Tom & Jerry');
	assert.equal(decodeEntities('&lt;![CDATA[x]]&gt;'), '<![CDATA[x]]>');
	assert.equal(decodeEntities('<![CDATA[ Mon, 05 Oct 2026 ]]>'), 'Mon, 05 Oct 2026');
});
