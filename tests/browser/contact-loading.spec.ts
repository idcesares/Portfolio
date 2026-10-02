import { expect, test } from '@playwright/test';

test('contact introduction stays visible while JavaScript modules are unavailable', async ({ page }) => {
  await page.route('**/*', route =>
    route.request().resourceType() === 'script' ? route.abort() : route.continue()
  );
  await page.goto('/contact/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Vamos abrir uma boa conversa.');
  await expect(page.locator('.hero-actions a[href^="mailto:"]')).toBeVisible();
});
