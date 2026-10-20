import { expect, test } from '@playwright/test';

test('work listing prioritizes its first cover and serves covers through the image optimizer', async ({ page }) => {
  await page.goto('/work/', { waitUntil: 'domcontentloaded' });
  const images = page.locator('[data-filterable-item] .mp-card__media img');
  await expect(images.first()).toHaveAttribute('fetchpriority', 'high');
  await expect(images.first()).toHaveAttribute('loading', 'eager');
  await expect(images.nth(1)).not.toHaveAttribute('fetchpriority', /.+/);
  const sources = await images.evaluateAll(els => els.map(el => (el as HTMLImageElement).currentSrc || (el as HTMLImageElement).src));
  const origin = new URL(page.url()).origin;
  expect(sources.filter(src => new URL(src).origin !== origin)).toEqual([]);
});
