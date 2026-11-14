import { expect, test } from '@playwright/test';

const visibleCards = (page: import('@playwright/test').Page) => page.locator('#grid .signal-card:not([hidden])');

test.describe('Tech Signal Stack', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tech-signal/');
    // O script reordena os cards depois do carregamento; espera o estado final.
    await expect(page.locator('#picks')).toBeVisible();
  });

  test('search ignores accents and case, and highlights the original text', async ({ page }) => {
    const search = page.getByRole('searchbox', { name: 'Buscar fontes' });
    await search.fill('educacao');
    const porvir = visibleCards(page).filter({ has: page.getByRole('heading', { name: 'Porvir' }) });
    await expect(porvir).toHaveCount(1);
    // O destaque cobre o trecho acentuado do texto original.
    await expect(porvir.locator('mark').first()).toHaveText(/educação/i);

    await search.fill('EDUCAÇÃO');
    await expect(porvir).toHaveCount(1);

    await search.fill('seguranca');
    await expect(visibleCards(page).filter({ has: page.getByRole('heading', { name: 'Schneier on Security' }) })).toHaveCount(1);
  });

  test('search never interprets the term or the card text as HTML', async ({ page }) => {
    await page.getByRole('searchbox', { name: 'Buscar fontes' }).fill('<img src=x onerror="window.injected=1">');
    await expect(page.locator('#empty')).toBeVisible();
    expect(await page.evaluate(() => 'injected' in window)).toBe(false);
    await expect(page.locator('#grid img')).toHaveCount(0);

    // Termo com metacaracteres de regex só pode casar literalmente.
    await page.getByRole('searchbox', { name: 'Buscar fontes' }).fill('.*');
    await expect(page.locator('#empty')).toBeVisible();
  });

  test('highlighting keeps the screen-reader hint on the card link', async ({ page }) => {
    await page.getByRole('searchbox', { name: 'Buscar fontes' }).fill('tecnoblog');
    const card = visibleCards(page).first();
    await expect(card.locator('.card-link mark')).toHaveCount(1);
    await expect(card.locator('.card-link .mp-visually-hidden')).toHaveText(/abre em uma nova aba/);
  });

  test('category and priority filters narrow the list and the count follows', async ({ page }) => {
    const count = page.locator('#resultCount');
    const total = await visibleCards(page).count();
    await page.getByRole('button', { name: /^Brasil/ }).click();
    const brazil = await visibleCards(page).count();
    expect(brazil).toBeGreaterThan(0);
    expect(brazil).toBeLessThan(total);
    await expect(count).toHaveText(`${brazil} fontes`);

    await page.locator('#tierSeg').getByRole('button', { name: 'Essencial' }).click();
    const essential = await visibleCards(page).count();
    expect(essential).toBeGreaterThan(0);
    expect(essential).toBeLessThan(brazil);
    for (const card of await visibleCards(page).all()) {
      await expect(card).toHaveAttribute('data-tier', '1');
    }
  });

  test('filters, search and order are restored from the URL', async ({ page }) => {
    await page.goto('/tech-signal/?cat=brasil&tier=1&kind=jornalismo&q=jota&ordem=prioridade');
    await expect(page.locator('#picks')).toBeVisible();
    await expect(page.getByRole('searchbox', { name: 'Buscar fontes' })).toHaveValue('jota');
    await expect(page.getByRole('button', { name: /^Brasil/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#tierSeg').getByRole('button', { name: 'Essencial' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#kindSeg').getByRole('button', { name: /^Jornalismo/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#orderSeg').getByRole('button', { name: 'Por prioridade' })).toHaveAttribute('aria-pressed', 'true');
    await expect(visibleCards(page)).toHaveCount(1);
    await expect(visibleCards(page).getByRole('heading', { name: 'JOTA' })).toBeVisible();
    await expect(page.locator('#resultTitle')).toHaveText('Brasil · Jornalismo · Essencial');
  });

  test('the URL follows the filters without adding history entries', async ({ page }) => {
    const before = await page.evaluate(() => history.length);
    await page.getByRole('button', { name: /^Brasil/ }).click();
    await expect(page).toHaveURL(/\?cat=brasil$/);
    await page.locator('#tierSeg').getByRole('button', { name: 'Forte' }).click();
    await expect(page).toHaveURL(/\?cat=brasil&tier=2$/);
    await page.getByRole('searchbox', { name: 'Buscar fontes' }).fill('lgpd');
    await expect(page).toHaveURL(/\?cat=brasil&tier=2&q=lgpd$/);
    await page.locator('#orderSeg').getByRole('button', { name: 'Por prioridade' }).click();
    await expect(page).toHaveURL(/ordem=prioridade$/);
    expect(await page.evaluate(() => history.length)).toBe(before);

    // Limpar tudo devolve a URL limpa.
    await page.getByRole('searchbox', { name: 'Buscar fontes' }).fill('zzzz-sem-resultado');
    await page.getByRole('button', { name: 'Limpar filtros' }).click();
    await expect(page).toHaveURL(/\?ordem=prioridade$/);
  });

  test('unknown URL values are ignored instead of breaking the page', async ({ page }) => {
    await page.goto('/tech-signal/?cat=nao-existe&tier=9&kind=xyz&ordem=aleatoria');
    await expect(page.locator('#picks')).toBeVisible();
    await expect(page.locator('#resultTitle')).toHaveText('Todas as fontes');
    const total = await page.locator('#grid .signal-card').count();
    await expect(visibleCards(page)).toHaveCount(total);
    await expect(page).toHaveURL(/\/tech-signal\/$/);
  });

  test('order=prioridade renders the server order and keeps it', async ({ page }) => {
    await page.goto('/tech-signal/?ordem=prioridade');
    await expect(page.locator('#picks')).toBeVisible();
    const orders = await page.locator('#grid .signal-card').evaluateAll((cards) => cards.map((card) => Number((card as HTMLElement).dataset.order)));
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  test('reading strategy is derived from the data and filters the list', async ({ page }) => {
    const morning = page.locator('.strat-item').filter({ hasText: 'Ficar em dia' });
    // Os nomes vêm do campo `routine` das fontes, em ordem de prioridade e alfabética.
    await expect(morning).toContainText('Hacker News, Tecnoblog, The Verge, TLDR.');
    const button = morning.getByRole('button', { name: 'Mostrar só estas 4 fontes' });
    await expect(button).toHaveAttribute('aria-pressed', 'false');

    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(visibleCards(page)).toHaveCount(4);
    for (const name of ['Hacker News', 'Tecnoblog', 'The Verge', 'TLDR']) {
      await expect(visibleCards(page).getByRole('heading', { name })).toHaveCount(1);
    }
    await expect(page.locator('#resultTitle')).toHaveText('Todas as fontes · Ficar em dia');
    await expect(page).toHaveURL(/\?rotina=manha$/);

    // Clicar de novo no bloco ativo limpa o filtro.
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await expect(page).toHaveURL(/\/tech-signal\/$/);
    expect(await visibleCards(page).count()).toBeGreaterThan(4);
  });

  test('every block of the reading strategy matches its cards and combines with other filters', async ({ page }) => {
    for (const routine of ['manha', 'semana', 'fundo']) {
      const block = page.locator('.strat-item').filter({ has: page.locator(`[data-routine="${routine}"]`) });
      const expected = await page.locator(`#grid .signal-card[data-routine="${routine}"]`).count();
      expect(expected).toBeGreaterThan(0);
      await expect(block.getByRole('button')).toHaveText(`Mostrar só estas ${expected} fontes`);
    }
    await page.goto('/tech-signal/?rotina=fundo&cat=brasil');
    await expect(page.locator('#picks')).toBeVisible();
    await expect(visibleCards(page)).toHaveCount(2);
    await expect(visibleCards(page).getByRole('heading', { name: 'JOTA' })).toHaveCount(1);
    await expect(visibleCards(page).getByRole('heading', { name: 'Cetic.br' })).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Mostrar só estas 5 fontes' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('theme chips carry the real count of sources and filter the list', async ({ page }) => {
    const chips = page.locator('#themeRow .theme-pill');
    expect(await chips.count()).toBe(15);
    for (const chip of await chips.all()) {
      const id = await chip.getAttribute('data-theme');
      const shown = Number(await chip.locator('.pill-count').textContent());
      expect(await page.locator(`#grid .signal-card[data-themes~="${id}"]`).count()).toBe(shown);
      expect(shown).toBeGreaterThan(0);
    }

    await page.locator('#themeRow').getByRole('button', { name: /^Ensino superior/ }).click();
    await expect(page.locator('#themeRow').getByRole('button', { name: /^Ensino superior/ })).toHaveAttribute('aria-pressed', 'true');
    const expected = await page.locator('#grid .signal-card[data-themes~="ensino-superior"]').count();
    await expect(visibleCards(page)).toHaveCount(expected);
    await expect(page.locator('#resultTitle')).toHaveText('Todas as fontes · Ensino superior');
    await expect(page).toHaveURL(/\?tema=ensino-superior$/);
    for (const name of ['Inside Higher Ed', 'Desafios da Educação', 'INEP']) {
      await expect(visibleCards(page).getByRole('heading', { name })).toHaveCount(1);
    }

    // Clicar de novo no tema ativo limpa o filtro.
    await page.locator('#themeRow').getByRole('button', { name: /^Ensino superior/ }).click();
    await expect(page).toHaveURL(/\/tech-signal\/$/);
    expect(await visibleCards(page).count()).toBeGreaterThan(expected);
  });

  test('the theme tag on a card filters too, and stays in sync with the chips', async ({ page }) => {
    const card = visibleCards(page).filter({ has: page.getByRole('heading', { name: 'JOTA' }) });
    await card.getByRole('button', { name: 'Regulação e governança' }).click();
    await expect(page).toHaveURL(/\?tema=regulacao$/);
    await expect(page.locator('#themeRow').getByRole('button', { name: /^Regulação e governança/ })).toHaveAttribute('aria-pressed', 'true');
    for (const tag of await page.locator('#grid .card-theme[data-theme="regulacao"]').all()) {
      await expect(tag).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(page.locator('#grid .card-theme[data-theme="mercado"]').first()).toHaveAttribute('aria-pressed', 'false');
    // Os temas combinam com os outros filtros.
    await page.locator('#tierSeg').getByRole('button', { name: 'Essencial' }).click();
    await expect(page).toHaveURL(/tier=1&tema=regulacao$/);
    await expect(visibleCards(page)).toHaveCount(1);
  });

  test('a theme from the URL is restored, and an unknown one is ignored', async ({ page }) => {
    await page.goto('/tech-signal/?tema=privacidade&cat=brasil');
    await expect(page.locator('#picks')).toBeVisible();
    await expect(page.locator('#themeRow').getByRole('button', { name: /^Privacidade e vigilância/ })).toHaveAttribute('aria-pressed', 'true');
    for (const card of await visibleCards(page).all()) {
      await expect(card).toHaveAttribute('data-themes', /privacidade/);
      await expect(card).toHaveAttribute('data-cats', /brasil/);
    }
    await page.goto('/tech-signal/?tema=nao-existe');
    await expect(page.locator('#picks')).toBeVisible();
    await expect(page.locator('#resultTitle')).toHaveText('Todas as fontes');
    await expect(page).toHaveURL(/\/tech-signal\/$/);
  });

  test('search finds sources by the name of a theme', async ({ page }) => {
    await page.getByRole('searchbox', { name: 'Buscar fontes' }).fill('tecnologia educacional');
    await expect(visibleCards(page).getByRole('heading', { name: 'EdSurge' })).toHaveCount(1);
    await expect(visibleCards(page).getByRole('heading', { name: 'Porvir' })).toHaveCount(1);
  });

  test('sources with no fitting theme keep their free tags as plain labels', async ({ page }) => {
    const techmeme = page.locator('#grid .signal-card').filter({ has: page.getByRole('heading', { name: 'Techmeme' }) });
    await expect(techmeme).not.toHaveAttribute('data-themes', /.+/);
    await expect(techmeme.locator('.card-theme')).toHaveCount(0);
    await expect(techmeme.locator('.mp-card__footer span.mp-tag', { hasText: 'Consenso' })).toHaveCount(1);
  });

  test('the sorted picks show themes as labels, not buttons', async ({ page }) => {
    await expect(page.locator('#picksGrid .signal-card')).toHaveCount(3);
    await expect(page.locator('#picksGrid button.card-theme')).toHaveCount(0);
    await expect(page.locator('#picksGrid button.card-tier')).toHaveCount(0);
  });

  test('the OPML cut carries the theme in its title and file name', async ({ page }) => {
    await page.locator('#themeRow').getByRole('button', { name: /^Dados e pesquisa/ }).click();
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#exportOpml').click()]);
    expect(download.suggestedFilename()).toBe('tech-signal-stack-dados-e-pesquisa.opml');
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(chunk as Buffer);
    expect(Buffer.concat(chunks).toString('utf8')).toContain('<title>Tech Signal Stack: Dados e pesquisa</title>');
  });

  test('OPML download without filters is identical to the server file', async ({ page }) => {
    const button = page.locator('#exportOpml');
    await expect(button).toBeEnabled();
    const [download] = await Promise.all([page.waitForEvent('download'), button.click()]);
    expect(download.suggestedFilename()).toBe('tech-signal-stack.opml');
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(chunk as Buffer);
    const fromClient = Buffer.concat(chunks).toString('utf8');
    const fromServer = await (await page.request.get('/tech-signal.opml')).text();
    expect(fromClient).toBe(fromServer);
  });

  test('OPML download follows the current cut and only carries feeds', async ({ page }) => {
    await page.getByRole('button', { name: /^Brasil/ }).click();
    await page.locator('#tierSeg').getByRole('button', { name: 'Essencial' }).click();
    const withFeed = await page.locator('#grid .signal-card:not([hidden])[data-feed]').count();
    expect(withFeed).toBeGreaterThan(0);
    const button = page.locator('#exportOpml');
    await expect(button).toHaveText(`Baixar OPML destes ${withFeed} ${withFeed === 1 ? 'feed' : 'feeds'}`);

    const [download] = await Promise.all([page.waitForEvent('download'), button.click()]);
    expect(download.suggestedFilename()).toBe('tech-signal-stack-brasil-essencial.opml');
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(chunk as Buffer);
    const xml = Buffer.concat(chunks).toString('utf8');
    expect(xml).toContain('<title>Tech Signal Stack: Brasil · Essencial</title>');
    expect((xml.match(/<outline type="rss"/g) ?? []).length).toBe(withFeed);
    // Uma pasta só, com o nome da categoria escolhida.
    expect((xml.match(/<outline text="/g) ?? []).length).toBe(1);
    expect(xml).toContain('<outline text="Brasil" title="Brasil">');
  });

  test('OPML button is disabled when the cut has no feed to export', async ({ page }) => {
    await page.getByRole('searchbox', { name: 'Buscar fontes' }).fill('zzzz-sem-resultado');
    const button = page.locator('#exportOpml');
    await expect(button).toBeDisabled();
    await expect(button).toHaveText('Nenhum feed neste recorte');
  });

  test('the header stat names what it counts', async ({ page }) => {
    const stat = page.locator('.signal-header__stats .mp-stat').filter({ hasText: 'primárias e pesquisa' });
    await expect(stat).toHaveCount(1);
    const expected = await page.locator('#grid .signal-card[data-kind="primaria"], #grid .signal-card[data-kind="pesquisa"]').count();
    await expect(stat.locator('.mp-stat__value')).toHaveText(String(expected));
  });

  test('the social preview uses a raster image crawlers accept', async ({ page }) => {
    await expect(page.locator('head > meta[property="og:image"]')).toHaveAttribute('content', /\.png$/);
    await expect(page.locator('head > meta[name="twitter:image"]')).toHaveAttribute('content', /\.png$/);
  });
});

test.describe('Tech Signal Stack: reveal and degradation', () => {
  test('the grid is revealed only after the client has ordered it', async ({ page }) => {
    await page.goto('/tech-signal/');
    await expect(page.locator('html')).toHaveAttribute('data-signal', 'ready');
    await expect(page.locator('#grid')).toBeVisible();
    await expect(page.locator('#picks')).toBeVisible();
  });

  test('if the script never loads, the CSS fallback still reveals the grid', async ({ page }) => {
    await page.route('**/*', (route) => (route.request().resourceType() === 'script' ? route.abort() : route.continue()));
    await page.goto('/tech-signal/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-signal', 'pending');
    await expect(page.locator('#grid')).toBeHidden();
    // Rede de segurança: ~1,8s depois, a grade aparece na ordem do servidor.
    await expect(page.locator('#grid')).toBeVisible({ timeout: 6_000 });
    await expect(page.locator('html')).toHaveAttribute('data-signal', 'pending');
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the page is complete, in priority order, with no dead controls', async ({ page }) => {
      await page.goto('/tech-signal/');
      await expect(page.locator('html')).not.toHaveAttribute('data-signal', /.*/);
      await expect(page.locator('#grid')).toBeVisible();
      const orders = await page.locator('#grid .signal-card').evaluateAll((cards) => cards.map((card) => Number((card as HTMLElement).dataset.order)));
      expect(orders.length).toBeGreaterThan(50);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
      // Controles que só funcionam com JS ficam escondidos em vez de parecerem quebrados.
      await expect(page.locator('#picks')).toBeHidden();
      await expect(page.locator('#orderControl')).toBeHidden();
      await expect(page.locator('#exportOpml')).toBeHidden();
      await expect(page.locator('.routine-btn').first()).toBeHidden();
      await expect(page.getByRole('link', { name: 'Baixar OPML' })).toBeVisible();
    });
  });
});
