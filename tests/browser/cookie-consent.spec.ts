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

test('cookie preferences can revoke a saved acceptance', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('cookie-consent', 'granted'));
  await page.reload();
  await expect.poll(() => page.locator('html').getAttribute('data-test-ga-calls')).toContain('config');
  await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click();
  await page.getByRole('button', { name: 'Recusar', exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('cookie-consent'))).toBe('denied');
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
});

test('blocked storage does not break consent or theme controls', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem']) {
      Object.defineProperty(Storage.prototype, method, {
        value() { throw new DOMException('Storage blocked', 'SecurityError'); },
      });
    }
  });
  await page.goto('/');
  const theme = page.getByRole('button', { name: 'Tema escuro', exact: true });
  const before = await theme.getAttribute('aria-pressed');
  await theme.click();
  await expect(theme).toHaveAttribute('aria-pressed', String(before !== 'true'));
  await page.getByRole('button', { name: 'Aceitar', exact: true }).click();
  await expect.poll(() => page.locator('html').getAttribute('data-test-ga-calls')).toContain('config');
});

for (const cookiesBlocked of [false, true]) {
  test(`revoking an existing grant fails closed when storage writes fail${cookiesBlocked ? ' and cookies are blocked' : ''}`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('cookie-consent', 'granted'));
    await page.addInitScript((blockCookies) => {
      Object.defineProperty(Storage.prototype, 'setItem', {
        value() { throw new DOMException('Storage full', 'QuotaExceededError'); },
      });
      if (blockCookies) {
        Object.defineProperty(Document.prototype, 'cookie', {
          get() { return ''; },
          set() { throw new DOMException('Cookies blocked', 'SecurityError'); },
        });
      }
    }, cookiesBlocked);
    await page.reload();
    await expect.poll(() => page.locator('html').getAttribute('data-test-ga-calls')).toContain('config');
    await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click();
    await page.getByRole('button', { name: 'Recusar', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Preferências de cookies' })).toBeHidden();
    await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
    // The stale local grant remains readable, but cannot override the denial.
    expect(await page.evaluate(() => localStorage.getItem('cookie-consent'))).toBe('granted');
    await page.reload();
    await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  });
}


test('a stale read-only cookie cannot override a saved denial', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('cookie-consent', 'granted');
    document.cookie = 'portfolio-consent=granted; Path=/; SameSite=Lax';
  });
  await page.addInitScript(() => {
    const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')!;
    Object.defineProperty(Document.prototype, 'cookie', {
      get() { return descriptor.get!.call(this); },
      set() { throw new DOMException('Cookies read-only', 'SecurityError'); },
    });
  });
  await page.reload();
  await expect.poll(() => page.locator('html').getAttribute('data-test-ga-calls')).toContain('config');
  await page.getByRole('button', { name: 'Preferências de cookies', exact: true }).click();
  await page.getByRole('button', { name: 'Recusar', exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('cookie-consent'))).toBe('denied');
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
});
