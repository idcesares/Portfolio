import { expect, test } from '@playwright/test';

// Replace Google's script with a local test double: exercise the real
// Partytown worker and forwarding without sending test visits to Analytics.
test.beforeEach(async ({ context }) => {
  await context.route('https://www.googletagmanager.com/**', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: `
        const calls = [];
        const record = (args) => {
          calls.push(Array.from(args));
          document.documentElement.setAttribute('data-test-ga-calls', JSON.stringify(calls));
        };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.forEach(record);
        window.dataLayer.push = record;
      `,
    })
  );
});

test('accepting after Partytown is ready initializes Analytics on the same page', async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { partytownReady: Promise<void> }).partytownReady =
      new Promise((resolve) => document.addEventListener('pt0', () => resolve(), { once: true }));
  });
  await page.goto('/');
  // pt0 is dispatched once the worker has finished its initial script scan.
  await page.evaluate(() => (window as unknown as { partytownReady: Promise<void> }).partytownReady);

  await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
  const calls = () => page.locator('html').getAttribute('data-test-ga-calls');
  await expect.poll(calls).toContain('G-0XZV7NBH4E');
  const recorded = JSON.parse((await calls())!);
  expect(recorded.map((args: unknown[]) => args[0])).toEqual(['js', 'config']);
  await expect(page.getByRole('region', { name: 'Preferências de cookies' })).toBeHidden();

  await page.reload();
  await expect.poll(calls).toContain('G-0XZV7NBH4E');
  await expect(page.getByRole('region', { name: 'Preferências de cookies' })).toBeHidden();
});

test('rejecting persists the choice without requesting Analytics', async ({ page }) => {
  const requests: string[] = [];
  page.context().on('request', (request) => {
    if (/googletagmanager|google-analytics/.test(request.url())) requests.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Recusar', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Preferências de cookies' })).toBeHidden();
  await page.reload();
  await expect(page.getByRole('region', { name: 'Preferências de cookies' })).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('cookie-consent'))).toBe('denied');
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  expect(requests).toEqual([]);
});
