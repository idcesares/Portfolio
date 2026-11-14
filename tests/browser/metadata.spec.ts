import { readFileSync } from 'node:fs';
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

test('the Person JSON-LD matches the role in PROFILE.md and does not claim a finished UFRJ degree', async ({ page }) => {
  const profile = readFileSync(new URL('../../design-system/PROFILE.md', import.meta.url), 'utf8');
  const role = profile.match(/\*\*Current role \(pt-BR\):\*\*\s*(.+)/)?.[1]?.trim();
  expect(role).toBeTruthy();

  await page.goto('/');
  const person = await page.evaluate(() => {
    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
      const data = JSON.parse(script.textContent ?? 'null');
      const node = (Array.isArray(data) ? data : [data]).find((item) => item?.['@type'] === 'Person');
      if (node) return node;
    }
    return null;
  });
  expect(person).not.toBeNull();
  expect(person.jobTitle).toBe(role);
  expect(role!.endsWith(person.worksFor.name)).toBe(true);
  expect(JSON.stringify(person.alumniOf ?? [])).not.toMatch(/UFRJ/);
  await expect(page.locator('head > meta[name="description"]')).toHaveAttribute('content', /desenvolvedor/);
  await expect(page.locator('head > meta[name="description"]')).not.toHaveAttribute('content', /construtor/);
});

