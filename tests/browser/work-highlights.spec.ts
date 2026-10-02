import { expect, test } from '@playwright/test';

test('curated work highlights lead from the home page to work and contact', async ({ page }) => {
  await page.goto('/');
  const highlights = page.getByRole('region', { name: 'Trabalhos em destaque', exact: true });
  await expect(highlights).toBeVisible();
  await expect(highlights.locator('.project-item')).toHaveCount(3);
  await expect(highlights.getByRole('heading', { name: /Revisitando Papert/ })).toBeVisible();
  await expect(highlights.getByRole('heading', { name: /LearnChain/ })).toBeVisible();
  await expect(highlights.getByRole('heading', { name: /Personalização na Educação/ })).toBeVisible();

  await highlights.getByRole('link', { name: /Revisitando Papert/ }).click();
  await expect(page).toHaveURL(/\/work\/papert-mindstorms-construcionismo-aprendizagem-criativa\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Papert');
  await page.getByRole('link', { name: 'Abrir contato', exact: true }).click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator('a[href^="mailto:"]')).not.toHaveCount(0);
});
