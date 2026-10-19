import { expect, test } from '@playwright/test';

test('work listing prioritizes its first cover and preconnects to the external image host', async ({ page }) => {
  await page.goto('/work/', { waitUntil: 'domcontentloaded' });
  const images = page.locator('[data-filterable-item] .mp-card__media img');
  await expect(images.first()).toHaveAttribute('fetchpriority', 'high');
  await expect(images.first()).toHaveAttribute('loading', 'eager');
  await expect(images.nth(1)).not.toHaveAttribute('fetchpriority', /.+/);
  await expect(page.locator('head link[rel="preconnect"][href="https://i.ytimg.com"]')).toHaveCount(1);
});
