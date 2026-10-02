import assert from 'node:assert/strict';

const base = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4321';
for (const path of ['/', '/about/', '/blog/', '/work/', '/search-data.json', '/rss.xml', '/sitemap-index.xml']) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} should be available`);
  if (path === '/search-data.json') assert.ok((await response.json()).length > 0);
}
assert.equal((await fetch(new URL('/assessment-missing-page/', base))).status, 404);
const html = await (await fetch(base)).text();
const imageSrc = html.match(/<img[^>]*src="([^\"]+)"/)?.[1];
assert.ok(imageSrc?.startsWith('/_astro/') || imageSrc?.startsWith('/_image'), 'The Node preview should use local optimized images');
const image = await fetch(new URL(imageSrc.replaceAll('&amp;', '&'), base));
assert.equal(image.status, 200, 'The local optimized image should be available');
assert.match(image.headers.get('content-type') ?? '', /^image\//);
assert.ok((await image.arrayBuffer()).byteLength > 0);
console.log('Preview routes, search data, 404 and local image optimization passed.');
