// Tech Signal Stack no celular e no desktop: a gaveta de filtros, a barra fixa, as
// fileiras que deslizam, a área de toque e a acessibilidade da gaveta aberta.
// O comportamento geral da página (busca, filtros, URL, OPML, temas) está em
// tech-signal.spec.ts.
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Tech Signal Stack: phone filters', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  type Page = import('@playwright/test').Page;
  const opener = (page: Page) => page.locator('#filtersToggle');
  const sheet = (page: Page) => page.locator('#filtersSheet');
  const ready = async (page: Page, url = '/tech-signal/') => {
    await page.goto(url);
    await expect(page.locator('html')).toHaveAttribute('data-signal', 'ready');
  };

  test('the filters live in a sheet opened from the sticky bar', async ({ page }) => {
    await ready(page);
    await expect(opener(page)).toBeVisible();
    await expect(sheet(page)).toBeHidden();
    // O mesmo painel muda de lugar, nada é duplicado.
    expect(await page.locator('#filtersPanel').evaluate((element) => Boolean(element.closest('#filtersSheet')))).toBe(true);

    await opener(page).click();
    await expect(sheet(page)).toBeVisible();
    for (const id of ['#kindSeg', '#tierSeg', '#themeRow', '#orderSeg']) await expect(page.locator(id)).toBeVisible();

    await page.locator('#kindSeg').getByRole('button', { name: /^Análise/ }).click();
    await expect(page.locator('#filtersCount')).toHaveText('1');
    await expect(opener(page)).toHaveAccessibleName('Filtros, 1 ativo');
    const matching = await page.locator('#grid .signal-card[data-kind="analise"]').count();
    await expect(page.locator('#filtersApply')).toHaveText(`Ver ${matching} fontes`);

    await page.locator('#filtersApply').click();
    await expect(sheet(page)).toBeHidden();
    await expect(page.locator('#grid .signal-card:not([hidden])')).toHaveCount(matching);
  });

  test('Escape, the close button and the backdrop close it, and Limpar clears filters but keeps the search', async ({ page }) => {
    await ready(page);
    await opener(page).click();
    await page.keyboard.press('Escape');
    await expect(sheet(page)).toBeHidden();

    await opener(page).click();
    await page.locator('#filtersClose').click();
    await expect(sheet(page)).toBeHidden();

    await opener(page).click();
    await page.mouse.click(195, 40); // fundo escurecido, acima da gaveta
    await expect(sheet(page)).toBeHidden();

    await page.getByRole('searchbox', { name: 'Buscar fontes' }).fill('tecnologia');
    await opener(page).click();
    await page.locator('#tierSeg').getByRole('button', { name: 'Essencial' }).click();
    await page.locator('#themeRow').getByRole('button', { name: /^Regulação/ }).click();
    await expect(page.locator('#filtersCount')).toHaveText('2');
    await page.locator('#filtersClear').click();
    await expect(page.locator('#filtersCount')).toBeHidden();
    await expect(page.getByRole('searchbox', { name: 'Buscar fontes' })).toHaveValue('tecnologia');
    await expect(page).toHaveURL(/\?q=tecnologia$/);
  });

  test('filters from the URL show on the opener badge without opening the sheet', async ({ page }) => {
    await ready(page, '/tech-signal/?tier=1&tema=regulacao');
    await expect(sheet(page)).toBeHidden();
    await expect(page.locator('#filtersCount')).toHaveText('2');
    await expect(opener(page)).toHaveAccessibleName('Filtros, 2 ativos');
  });

  test('with no result the apply button is disabled and says so', async ({ page }) => {
    await ready(page);
    await page.getByRole('searchbox', { name: 'Buscar fontes' }).fill('zzzz-sem-resultado');
    await opener(page).click();
    await expect(page.locator('#filtersApply')).toBeDisabled();
    await expect(page.locator('#filtersApply')).toHaveText('Ver 0 fontes');
  });

  test('resizing to desktop closes the sheet and puts the panel back on the page', async ({ page }) => {
    await ready(page);
    await opener(page).click();
    await expect(sheet(page)).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(sheet(page)).toBeHidden();
    expect(await page.locator('#filtersPanel').evaluate((element) => element.parentElement?.id)).toBe('resultMeta');
    await expect(page.locator('#kindSeg')).toBeVisible();
    await expect(opener(page)).toBeHidden();
  });

  test('the sticky bar stays compact, even on a 320px phone', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await ready(page);
    const bar = await page.locator('.signal-controls').boundingBox();
    expect(bar!.height).toBeLessThan(150);
    // Busca, filtros e tema na mesma linha.
    const tops = await Promise.all(['.signal-search', '#filtersToggle'].map(async (selector) => (await page.locator(selector).boundingBox())!.y));
    expect(Math.abs(tops[0]! - tops[1]!)).toBeLessThan(12);
    const search = await page.locator('.signal-search').boundingBox();
    expect(search!.width).toBeGreaterThan(130);
  });

  test('the list starts near the top: reading strategy and picks swipe sideways', async ({ page }) => {
    await ready(page);
    for (const selector of ['.strategy .mp-grid', '#picksGrid']) {
      const swipes = await page.locator(selector).evaluate((element) => element.scrollWidth > element.clientWidth + 8);
      expect(swipes, `${selector} deveria deslizar na horizontal`).toBe(true);
    }
    const firstCard = await page.locator('#grid .signal-card:not([hidden])').first().boundingBox();
    const scrolled = await page.evaluate(() => window.scrollY);
    // Antes ficava a ~2.700px do topo.
    expect(firstCard!.y + scrolled).toBeLessThan(1900);
  });

  test('card tags have a 44px touch area even though they look small', async ({ page }) => {
    await ready(page);
    for (const selector of ['#grid button.card-theme', '#grid button.card-tier']) {
      const tag = page.locator(selector).first();
      // No centro da tela: perto do topo a barra fixa cobriria o ponto de prova.
      await tag.evaluate((element) => element.scrollIntoView({ block: 'center' }));
      const box = (await tag.boundingBox())!;
      const probeY = box.y + box.height / 2 - 20; // 20px acima do centro: fora da etiqueta, dentro dos 44px
      const hit = await page.evaluate(([x, y]) => {
        const element = document.elementFromPoint(x as number, y as number);
        return element?.closest('button')?.className ?? null;
      }, [box.x + box.width / 2, probeY]);
      expect(hit, `${selector}: o toque 20px acima do centro deveria cair na etiqueta`).toMatch(/card-(theme|tier)/);
    }
  });

  test('the category row shows which side has more pills and brings the active one into view', async ({ page }) => {
    await ready(page);
    const row = page.locator('#filterRow');
    await expect(row).toHaveAttribute('data-overflow', 'end');
    await row.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
    await expect(row).toHaveAttribute('data-overflow', 'start');

    await ready(page, '/tech-signal/?cat=seguranca');
    const inside = await page.evaluate(() => {
      const pill = document.querySelector('.filter-pill[aria-pressed="true"]')!.getBoundingClientRect();
      const rowBox = document.getElementById('filterRow')!.getBoundingClientRect();
      return pill.left >= rowBox.left - 1 && pill.right <= rowBox.right + 1;
    });
    expect(inside).toBe(true);
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the panel stays inline and open, and no opener is offered', async ({ page }) => {
      await page.goto('/tech-signal/');
      await expect(opener(page)).toBeHidden();
      await expect(sheet(page)).toBeHidden();
      await expect(page.locator('#kindSeg')).toBeVisible();
      await expect(page.locator('#tierSeg')).toBeVisible();
      await expect(page.locator('#resultMeta #filtersPanel')).toHaveCount(1);
    });
  });
});

test.describe('Tech Signal Stack: desktop filters', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('everything stays inline and the sheet opener is not offered', async ({ page }) => {
    await page.goto('/tech-signal/');
    await expect(page.locator('html')).toHaveAttribute('data-signal', 'ready');
    await expect(page.locator('#filtersToggle')).toBeHidden();
    await expect(page.locator('#filtersSheet')).toBeHidden();
    await expect(page.locator('#resultMeta #filtersPanel')).toHaveCount(1);
    await expect(page.locator('#kindSeg')).toBeVisible();
    await expect(page.locator('#orderSeg')).toBeVisible();
    await expect(page.locator('#tierSeg')).toBeVisible();
    await expect(page.locator('#filterRow')).toHaveAttribute('data-overflow', 'none');
    // Estratégia e sorteio continuam em grade no desktop.
    expect(await page.locator('#picksGrid').evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  });
});

test.describe('Tech Signal Stack: filter sheet accessibility', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const theme of ['light', 'dark'] as const) {
    test(`the open sheet has no WCAG A/AA violations in ${theme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto('/tech-signal/');
      await expect(page.locator('html')).toHaveAttribute('data-signal', 'ready');
      await page.locator('#filtersToggle').click();
      await expect(page.locator('#filtersSheet')).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .exclude('astro-dev-toolbar')
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }

  test('the sheet is a modal dialog: focus moves in, Escape closes, focus returns to the opener', async ({ page }) => {
    await page.goto('/tech-signal/');
    await expect(page.locator('html')).toHaveAttribute('data-signal', 'ready');
    const opener = page.locator('#filtersToggle');
    await opener.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#filtersSheet')).toBeVisible();
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('#filtersSheet')))).toBe(true);
    await expect(page.getByRole('dialog', { name: 'Filtros' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#filtersSheet')).toBeHidden();
    await expect(opener).toBeFocused();
  });
});
