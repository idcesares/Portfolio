import { expect, test } from '@playwright/test';

test('Escape closes the mobile menu and returns focus to its button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const button = page.locator('button[aria-controls="menu-content"]');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Home', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
});

for (const path of ['/work/', '/blog/']) {
  test(`collapsed filters stay out of the accessibility tree on ${path}`, async ({ page }) => {
    await page.goto(path);
    const button = page.getByRole('button', { name: 'Filtros avançados', exact: true });
    const category = page.getByRole('combobox', { name: 'Categoria:', exact: true });
    const accessibility = await page.context().newCDPSession(page);
    const accessibleCategories = async () => {
      const { nodes } = await accessibility.send('Accessibility.getFullAXTree');
      return nodes.filter(node => !node.ignored && node.role?.value === 'combobox' && node.name?.value === 'Categoria:').length;
    };
    // Role locators do not account for inert; inspect Chromium's actual tree.
    await expect.poll(accessibleCategories).toBe(0);
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.focus();
    await page.keyboard.press('Tab');
    expect(await page.locator('#advanced-filters').evaluate(element => element.contains(document.activeElement))).toBe(false);
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(category).toBeVisible();
    await expect.poll(accessibleCategories).toBe(1);
    await page.keyboard.press('Enter');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(accessibleCategories).toBe(0);
    await page.getByRole('textbox', { name: path === '/work/' ? 'Buscar projetos' : 'Buscar posts', exact: true }).fill('zzzz-no-results');
    await expect(page.getByRole('status')).toContainText('0');
    await expect(page.locator('[data-filterable-item]:visible')).toHaveCount(0);
    await accessibility.detach();
  });
}
