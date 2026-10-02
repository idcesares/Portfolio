import { expect, test } from '@playwright/test';

for (const path of ['/', '/work/', '/tech-signal/', '/work/papert-mindstorms-construcionismo-aprendizagem-criativa/']) {
  test(`metadata remains in the parsed document head on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('head > meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('head > meta[name="description"]')).toHaveAttribute('content', /\S/);
    await expect(page.locator('head > link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('head > meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('head > title')).toHaveCount(1);
    await expect(page.locator('body vercel-speed-insights')).toHaveCount(1);
    await expect(page.locator('head vercel-speed-insights')).toHaveCount(0);
  });
}
