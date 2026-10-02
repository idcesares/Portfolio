import { expect, test } from '@playwright/test';

test('search renders editorial markup as text while preserving highlights', async ({ page }) => {
  await page.route('**/search-data.json', (route) => route.fulfill({
    json: [{
      id: 'safe-search', type: 'blog', url: '/blog/safe-search/', tags: [],
      title: 'Segurança <img src=x onerror="window.searchInjected=true">',
      description: '<img src=x onerror="window.searchInjected=true"> & conteúdo',
      content: 'Segurança',
    }],
  }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir busca', exact: true }).click();
  await page.getByRole('searchbox').fill('Segurança');
  const result = page.locator('.search-result-item');
  await expect(result).toHaveCount(1);
  await expect(result.locator('.search-result-title')).toContainText('<img');
  await expect(result.locator('img')).toHaveCount(0);
  await expect(result.locator('mark')).not.toHaveCount(0);
  expect(await page.evaluate(() => 'searchInjected' in window)).toBe(false);
});
