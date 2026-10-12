import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Every page template on the site, as the Membrane suite does for its own pages.
const PAGES = [
  '/',
  '/about/',
  '/blog/',
  '/work/',
  '/dev/',
  '/contact/',
  '/tech-signal/',
  '/deals/',
  '/meme/',
  '/blog/base64-encoder-decoder/',
  '/work/papert-mindstorms-construcionismo-aprendizagem-criativa/',
  '/rota-que-nao-existe/',
];

// Keep the cookie card and the dev overlay out of page-level checks.
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try { localStorage.setItem('cookie-consent', 'denied'); } catch { /* Storage is optional. */ }
  });
});

async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
}

for (const theme of ['light', 'dark'] as const) {
  for (const path of PAGES) {
    test(`axe: ${path} in ${theme} mode has no WCAG A/AA violations`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await open(page, path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .exclude('astro-dev-toolbar')
        // Third-party video embeds are outside the site's control.
        .exclude('iframe')
        .analyze();
      const violations = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(violations).toEqual([]);
    });
  }
}

for (const path of PAGES) {
  test(`${path} has no horizontal overflow at phone width`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test('fonts are the Membrane self-hosted files, with no third-party font requests', async ({ page }) => {
  const fontRequests: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'font' || /fonts\.(googleapis|gstatic)\.com/.test(request.url())) fontRequests.push(request.url());
  });
  await open(page, '/blog/base64-encoder-decoder/');
  const families = await page.evaluate(() =>
    [...document.fonts].filter((face) => face.status === 'loaded').map((face) => face.family.replace(/"/g, '')),
  );
  expect(families).toEqual(expect.arrayContaining(['Fraunces', 'Instrument Sans']));
  expect(fontRequests.length).toBeGreaterThan(0);
  for (const url of fontRequests) expect(new URL(url).origin).toBe(new URL(page.url()).origin);
  // The metric-matched fallbacks stay in every stack.
  const stack = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(stack).toContain('Instrument Sans Fallback');
});

test('the library is the global layer: components render with Membrane styles', async ({ page }) => {
  await open(page, '/');
  await expect(page.locator('.mp-navbar')).toHaveCSS('position', 'sticky');
  await expect(page.locator('.mp-navbar__link[aria-current="page"]')).toHaveText('Início');
  await expect(page.locator('.mp-button').first()).toHaveCSS('border-radius', /\d+px/);
  expect(await page.evaluate(() => typeof window.MembranePalette?.toast)).toBe('function');
});

test('theme toggle follows the OS until pressed, then persists the choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await open(page, '/');
  const html = page.locator('html');
  const toggle = page.getByRole('button', { name: 'Tema escuro', exact: true });
  await expect(html).not.toHaveAttribute('data-theme', /.+/);
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('search opens with "/", closes with Escape and returns focus', async ({ page }) => {
  await open(page, '/blog/');
  const dialog = page.getByRole('dialog', { name: 'Busca' });
  await page.locator('body').press('/');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Buscar em posts e projetos' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  const button = page.getByRole('button', { name: 'Abrir busca', exact: true });
  await button.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
});

test('code blocks use the Membrane block and confirm copying with a toast', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await open(page, '/blog/base64-encoder-decoder/');
  const block = page.locator('.mp-code-block').first();
  await expect(block).toHaveAttribute('data-theme', 'dark');
  await expect(block.locator('pre')).toHaveAttribute('tabindex', '0');
  await block.getByRole('button', { name: 'Copiar código' }).click();
  await expect(page.locator('.mp-toast')).toContainText('Código copiado');
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied.length).toBeGreaterThan(0);
});

test('content stays visible when scripts fail to load', async ({ page }) => {
  await page.route('**/*', (route) => (route.request().resourceType() === 'script' ? route.abort() : route.continue()));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  for (const section of await page.locator('[data-animate]').all()) {
    await expect(section).toHaveCSS('opacity', '1');
  }
});
