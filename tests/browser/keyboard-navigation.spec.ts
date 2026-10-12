import { expect, test } from '@playwright/test';

test('on phones every navbar link stays reachable and the current page is marked', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/');
  const nav = page.getByRole('navigation', { name: 'Navegação principal' });
  const links = nav.getByRole('link');
  await expect(links).toHaveCount(6);
  // The Membrane navbar scrolls its link row instead of hiding it behind a menu.
  for (const link of await links.all()) {
    await link.focus();
    await expect(link).toBeInViewport();
  }
  await expect(nav.getByRole('link', { name: 'Blog', exact: true })).toHaveAttribute('aria-current', 'page');
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
    await page.getByRole('searchbox', { name: path === '/work/' ? 'Buscar projetos' : 'Buscar posts', exact: true }).fill('zzzz-no-results');
    await expect(page.getByRole('status')).toContainText('0');
    await expect(page.locator('[data-filterable-item]:visible')).toHaveCount(0);
    await accessibility.detach();
  });
}
