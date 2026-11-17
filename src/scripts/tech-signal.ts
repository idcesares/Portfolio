/**
 * Tech Signal Stack: comportamento do cliente.
 *
 * Os cards já chegam renderizados do servidor. Este módulo só filtra, busca,
 * destaca e embaralha. Sem JS a página continua completa e legível, na ordem
 * de prioridade.
 */
import { findMatches, fold } from '../utils/fold';
import { buildOpml, type OpmlItem } from '../utils/opml';

const byId = <T extends HTMLElement>(id: string): T => {
	const element = document.getElementById(id);
	if (!element) throw new Error(`tech-signal: elemento #${id} ausente`);
	return element as T;
};

const grid = byId('grid');
const filterRow = byId('filterRow');
const searchInput = byId<HTMLInputElement>('search');
const searchClear = byId<HTMLButtonElement>('searchClear');
const emptyState = byId('empty');
const resultTitle = byId('resultTitle');
const resultCount = byId('resultCount');
const resultMeta = byId('resultMeta');
const tierSeg = byId('tierSeg');
const themeRow = byId('themeRow');
const kindSeg = byId('kindSeg');
const orderSeg = byId('orderSeg');
const orderCtl = byId('orderControl');
const picks = byId('picks');
const picksGrid = byId('picksGrid');
const exportButton = byId<HTMLButtonElement>('exportOpml');
const exportLabel = byId('exportLabel');
const filtersToggle = byId<HTMLButtonElement>('filtersToggle');
const filtersCount = byId('filtersCount');
const filtersPanel = byId('filtersPanel');
const filtersSheet = byId<HTMLDialogElement>('filtersSheet');
const filtersSheetBody = byId('filtersSheetBody');
const filtersApply = byId<HTMLButtonElement>('filtersApply');
const filtersApplyLabel = byId('filtersApplyLabel');
const routineButtons = Array.from(document.querySelectorAll<HTMLElement>('.routine-btn'));
const cards = Array.from(grid.querySelectorAll<HTMLElement>('.signal-card'));

/** Texto de um botão sem o contador numérico que ele carrega. */
const labelOf = (button: HTMLElement) => (button.textContent ?? '').replace(/\s*\d+\s*$/, '').trim();

const CATEGORY_LABELS: Record<string, string> = {};
filterRow.querySelectorAll<HTMLElement>('.filter-pill').forEach((pill) => {
	CATEGORY_LABELS[pill.dataset.filter ?? ''] = labelOf(pill);
});
const KIND_LABELS: Record<string, string> = {};
kindSeg.querySelectorAll<HTMLElement>('.kind-btn').forEach((button) => {
	KIND_LABELS[button.dataset.kind ?? ''] = labelOf(button);
});
const ROUTINE_LABELS: Record<string, string> = { todas: '' };
routineButtons.forEach((button) => {
	ROUTINE_LABELS[button.dataset.routine ?? ''] = button.dataset.label ?? '';
});
const THEME_LABELS: Record<string, string> = { todas: '' };
themeRow.querySelectorAll<HTMLElement>('.theme-pill').forEach((pill) => {
	THEME_LABELS[pill.dataset.theme ?? ''] = labelOf(pill);
});
const TIER_NAMES: Record<string, string> = {};
tierSeg.querySelectorAll<HTMLElement>('.tier-btn').forEach((button) => {
	TIER_NAMES[button.dataset.tier ?? ''] = labelOf(button);
});

let activeFilter = 'todas';
let activeTier = 'todas';
let activeKind = 'todas';
let searchTerm = '';
let activeRoutine = 'todas';
let activeTheme = 'todas';
let activeOrder = 'shuffle';

/* ═══════════ ESTADO NA URL ═══════════
   Filtros, busca e ordem vivem na query string, então um recorte pode ser
   linkado e sobrevive a um reload. Usa replaceState: filtrar não enche o
   histórico, e o botão voltar continua saindo da página. Valores desconhecidos
   na URL são ignorados em vez de quebrar a tela.
═══════════════════════════════════ */
const URL_KEYS = { cat: 'cat', tier: 'tier', kind: 'kind', routine: 'rotina', theme: 'tema', q: 'q', order: 'ordem' } as const;

function syncUrl() {
	const params = new URLSearchParams();
	if (activeFilter !== 'todas') params.set(URL_KEYS.cat, activeFilter);
	if (activeTier !== 'todas') params.set(URL_KEYS.tier, activeTier);
	if (activeKind !== 'todas') params.set(URL_KEYS.kind, activeKind);
	if (activeRoutine !== 'todas') params.set(URL_KEYS.routine, activeRoutine);
	if (activeTheme !== 'todas') params.set(URL_KEYS.theme, activeTheme);
	if (searchTerm.trim()) params.set(URL_KEYS.q, searchTerm.trim());
	if (activeOrder === 'tier') params.set(URL_KEYS.order, 'prioridade');
	const query = params.toString();
	const next = location.pathname + (query ? '?' + query : '') + location.hash;
	if (next !== location.pathname + location.search + location.hash) history.replaceState(null, '', next);
}

const allowed = (params: URLSearchParams, key: string, valid: string[]) => {
	const value = params.get(key);
	return value !== null && valid.includes(value) ? value : 'todas';
};

const orderOf = (card: HTMLElement) => Number(card.dataset.order ?? 0);

/* ═══════════ OPML DO RECORTE ═══════════
   Baixa só os feeds das fontes que estão na tela agora, no mesmo formato do
   arquivo completo (src/utils/opml.ts). Fonte sem feed próprio fica de fora,
   pelo mesmo motivo de sempre: endereço chutado quebra em silêncio no leitor.
═══════════════════════════════════════ */
const visibleFeedCards = () => cards.filter((card) => !card.hidden && card.dataset.feed);

function updateExport() {
	const count = visibleFeedCards().length;
	exportButton.hidden = false;
	exportButton.disabled = count === 0;
	exportLabel.textContent =
		count === 0 ? 'Nenhum feed neste recorte' : `Baixar OPML destes ${count} ${count === 1 ? 'feed' : 'feeds'}`;
}

const slug = (text: string) => fold(text).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function downloadOpml() {
	const selected = visibleFeedCards().sort((a, b) => orderOf(a) - orderOf(b));
	if (selected.length === 0) return;

	const itemOf = (card: HTMLElement): OpmlItem => ({
		name: card.querySelector<HTMLElement>('.card-title')?.dataset.original ?? '',
		xmlUrl: card.dataset.feed ?? '',
		// getAttribute e não .href: a propriedade normaliza (acrescenta a barra final).
		htmlUrl: card.querySelector('.card-link')?.getAttribute('href') ?? '',
		description: card.dataset.meta ?? '',
	});

	// Com uma categoria escolhida vira uma pasta só; sem ela, a primeira categoria
	// de cada fonte é a pasta, como no arquivo completo.
	const folderIds =
		activeFilter === 'todas'
			? Object.keys(CATEGORY_LABELS).filter((id) => id !== 'todas')
			: [activeFilter];
	const folders = folderIds.map((id) => ({
		label: CATEGORY_LABELS[id] ?? id,
		items: selected
			.filter((card) => activeFilter !== 'todas' || (card.dataset.cats ?? '').split(' ')[0] === id)
			.map(itemOf),
	}));

	const parts: string[] = [];
	if (activeFilter !== 'todas') parts.push(CATEGORY_LABELS[activeFilter] ?? activeFilter);
	if (activeKind !== 'todas') parts.push(KIND_LABELS[activeKind] ?? activeKind);
	if (activeTier !== 'todas') parts.push(TIER_NAMES[activeTier] ?? activeTier);
	if (activeRoutine !== 'todas') parts.push(ROUTINE_LABELS[activeRoutine] ?? activeRoutine);
	if (activeTheme !== 'todas') parts.push(THEME_LABELS[activeTheme] ?? activeTheme);
	if (searchTerm.trim()) parts.push(`busca "${searchTerm.trim()}"`);

	const xml = buildOpml({
		title: parts.length ? `Tech Signal Stack: ${parts.join(' · ')}` : 'Tech Signal Stack',
		ownerName: exportButton.dataset.owner ?? '',
		ownerId: exportButton.dataset.ownerId ?? '',
		modified: new Date(`${exportButton.dataset.modified ?? ''}T00:00:00Z`),
		folders,
	});

	const url = URL.createObjectURL(new Blob([xml], { type: 'text/x-opml+xml;charset=utf-8' }));
	const link = document.createElement('a');
	link.href = url;
	link.download = `tech-signal-stack${parts.length ? '-' + parts.map(slug).join('-') : ''}.opml`;
	document.body.append(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
}

exportButton.addEventListener('click', downloadOpml);

/* ═══════════ FILTROS NO CELULAR ═══════════
   Em tela estreita o painel (natureza, ordem, prioridade, tema) vive numa gaveta
   aberta pelo botão da barra fixa; em tela larga fica inline, como sempre foi. O
   mesmo painel, com os mesmos botões e ouvintes, muda de lugar: nada é duplicado.
   O selo do botão diz quantos filtros do painel estão ativos, para um filtro
   guardado na gaveta não parecer um bug.
═══════════════════════════════════════════ */
const phone = window.matchMedia('(width < 48em)');

function placeFilters() {
	if (phone.matches) {
		filtersSheetBody.append(filtersPanel);
	} else {
		if (filtersSheet.open) filtersSheet.close();
		resultMeta.append(filtersPanel);
	}
}
phone.addEventListener('change', placeFilters);

function activeSecondaryFilters() {
	return (activeKind !== 'todas' ? 1 : 0) + (activeTier !== 'todas' ? 1 : 0) + (activeTheme !== 'todas' ? 1 : 0);
}

function updateFiltersBadge() {
	const count = activeSecondaryFilters();
	filtersCount.hidden = count === 0;
	filtersCount.textContent = String(count);
	filtersToggle.setAttribute('aria-label', count ? `Filtros, ${count} ${count === 1 ? 'ativo' : 'ativos'}` : 'Filtros');
}

function updateApplyButton(visible: number) {
	filtersApply.disabled = visible === 0;
	// "Ver 41 fontes" / "Ver 1 fonte". Sem resultado o botão fica desabilitado.
	filtersApplyLabel.textContent = `Ver ${visible} ${visible === 1 ? 'fonte' : 'fontes'}`;
}

filtersToggle.addEventListener('click', () => filtersSheet.showModal());
byId('filtersClose').addEventListener('click', () => filtersSheet.close());
// Toque fora da gaveta (no fundo escurecido) também fecha.
filtersSheet.addEventListener('click', (event) => {
	if (event.target === filtersSheet) filtersSheet.close();
});
filtersApply.addEventListener('click', () => {
	filtersSheet.close();
	resultMeta.scrollIntoView({ block: 'start' });
});

/* ═══════════ FILEIRA DE CATEGORIAS ═══════════
   Diz de que lado há mais pílulas escondidas (o CSS esmaece esse lado).
═════════════════════════════════════════════ */
function updateOverflow() {
	const max = filterRow.scrollWidth - filterRow.clientWidth;
	const hiddenAtStart = max > 1 && filterRow.scrollLeft > 1;
	const hiddenAtEnd = max > 1 && filterRow.scrollLeft < max - 1;
	filterRow.dataset.overflow = hiddenAtStart && hiddenAtEnd ? 'both' : hiddenAtEnd ? 'end' : hiddenAtStart ? 'start' : 'none';
}

filterRow.addEventListener('scroll', updateOverflow, { passive: true });
new ResizeObserver(updateOverflow).observe(filterRow);

// Uma categoria vinda da URL pode estar fora da área visível: traz ela para o centro.
function revealActiveCategory() {
	const pill = filterRow.querySelector<HTMLElement>('.filter-pill[aria-pressed="true"]');
	if (!pill || activeFilter === 'todas') return;
	const offset = pill.getBoundingClientRect().left - filterRow.getBoundingClientRect().left - (filterRow.clientWidth - pill.offsetWidth) / 2;
	filterRow.scrollLeft += offset;
}

/* ═══════════ DESTAQUE ═══════════
   Monta texto e <mark> como nós, sem innerHTML: o conteúdo do card nunca é
   interpretado como HTML, e o casamento ignora caixa e acento.
═══════════════════════════════ */
function paint(target: HTMLElement, text: string, term: string, tail?: Element | null) {
	const nodes: Node[] = [];
	let cursor = 0;
	for (const [start, end] of findMatches(text, term)) {
		if (start > cursor) nodes.push(document.createTextNode(text.slice(cursor, start)));
		const mark = document.createElement('mark');
		mark.textContent = text.slice(start, end);
		nodes.push(mark);
		cursor = end;
	}
	if (cursor < text.length) nodes.push(document.createTextNode(text.slice(cursor)));
	if (tail) nodes.push(tail);
	target.replaceChildren(...nodes);
}

function paintHighlights(card: HTMLElement, term: string) {
	const title = card.querySelector<HTMLElement>('.card-title');
	const desc = card.querySelector<HTMLElement>('.card-desc');
	const link = title?.querySelector<HTMLElement>('.card-link');
	if (!title || !desc || !link) return;
	// O aviso "(abre em uma nova aba)" é do leitor de tela e sobrevive ao destaque.
	paint(link, title.dataset.original ?? '', term, link.querySelector('.mp-visually-hidden'));
	paint(desc, desc.dataset.original ?? '', term);
}

function render() {
	const term = fold(searchTerm.trim());
	let visible = 0;

	for (const card of cards) {
		const matchesCat = activeFilter === 'todas' || (card.dataset.cats ?? '').split(' ').includes(activeFilter);
		const matchesTier = activeTier === 'todas' || card.dataset.tier === activeTier;
		const matchesKind = activeKind === 'todas' || card.dataset.kind === activeKind;
		const matchesRoutine = activeRoutine === 'todas' || card.dataset.routine === activeRoutine;
		const matchesTheme = activeTheme === 'todas' || (card.dataset.themes ?? '').split(' ').includes(activeTheme);
		const matchesTerm = !term || (card.dataset.haystack ?? '').includes(term);
		const show = matchesCat && matchesTier && matchesKind && matchesRoutine && matchesTheme && matchesTerm;

		card.hidden = !show;
		if (show) {
			visible++;
			paintHighlights(card, searchTerm);
		}
	}

	let title = activeFilter === 'todas' ? 'Todas as fontes' : (CATEGORY_LABELS[activeFilter] ?? '');
	if (activeKind !== 'todas') title += ' · ' + KIND_LABELS[activeKind];
	if (activeTier !== 'todas') title += ' · ' + TIER_NAMES[activeTier];
	if (activeRoutine !== 'todas') title += ' · ' + ROUTINE_LABELS[activeRoutine];
	if (activeTheme !== 'todas') title += ' · ' + THEME_LABELS[activeTheme];
	resultTitle.textContent = title;
	resultCount.textContent = visible === 1 ? '1 fonte' : visible + ' fontes';

	const isEmpty = visible === 0;
	emptyState.hidden = !isEmpty;
	grid.hidden = isEmpty;
	updateExport();
	updateFiltersBadge();
	updateApplyButton(visible);
	syncUrl();
}

function press(group: ParentNode, selector: string, attr: string, value: string) {
	group.querySelectorAll<HTMLElement>(selector).forEach((button) => {
		button.setAttribute('aria-pressed', button.dataset[attr] === value ? 'true' : 'false');
	});
}

function setCategory(id: string) {
	activeFilter = id;
	press(filterRow, '.filter-pill', 'filter', id);
	render();
}

function setKind(kind: string) {
	activeKind = kind;
	press(kindSeg, '.kind-btn', 'kind', kind);
	render();
}

function setRoutine(routine: string) {
	activeRoutine = routine;
	routineButtons.forEach((button) => {
		button.setAttribute('aria-pressed', button.dataset.routine === routine ? 'true' : 'false');
	});
	render();
}

/** Marca como ativas, nos cards, as etiquetas do tema escolhido. */
function pressCardThemes() {
	grid.querySelectorAll<HTMLElement>('.card-theme').forEach((tag) => {
		tag.setAttribute('aria-pressed', tag.dataset.theme === activeTheme ? 'true' : 'false');
	});
}

function setTheme(theme: string) {
	activeTheme = theme;
	press(themeRow, '.theme-pill', 'theme', theme);
	pressCardThemes();
	render();
}

function setTier(tier: string) {
	activeTier = tier;
	press(tierSeg, '.tier-btn', 'tier', tier);
	render();
}

filterRow.querySelectorAll<HTMLElement>('.filter-pill').forEach((pill) => {
	pill.addEventListener('click', () => setCategory(pill.dataset.filter ?? 'todas'));
});
// Tema: clicar de novo no ativo limpa. Vale tanto para a fileira quanto para a etiqueta do card.
themeRow.querySelectorAll<HTMLElement>('.theme-pill').forEach((pill) => {
	pill.addEventListener('click', () => {
		const theme = pill.dataset.theme ?? 'todas';
		setTheme(activeTheme === theme ? 'todas' : theme);
	});
});
tierSeg.querySelectorAll<HTMLElement>('.tier-btn').forEach((button) => {
	button.addEventListener('click', () => setTier(button.dataset.tier ?? 'todas'));
});
kindSeg.querySelectorAll<HTMLElement>('.kind-btn').forEach((button) => {
	button.addEventListener('click', () => setKind(button.dataset.kind ?? 'todas'));
});

// Os blocos da estratégia de leitura filtram a lista. Clicar de novo no ativo limpa.
routineButtons.forEach((button) => {
	button.hidden = false;
	button.addEventListener('click', () => {
		const routine = button.dataset.routine ?? 'todas';
		setRoutine(activeRoutine === routine ? 'todas' : routine);
		resultMeta.scrollIntoView({ block: 'start' });
	});
});

// Selo de prioridade dentro do card também filtra. Clicar de novo no ativo limpa.
grid.addEventListener('click', (event) => {
	const tag = (event.target as Element).closest<HTMLElement>('.card-theme');
	if (tag) {
		const theme = tag.dataset.theme ?? 'todas';
		setTheme(activeTheme === theme ? 'todas' : theme);
		resultMeta.scrollIntoView({ block: 'start' });
		return;
	}
	const badge = (event.target as Element).closest<HTMLElement>('.card-tier');
	if (!badge) return;
	const tier = badge.dataset.tier ?? 'todas';
	setTier(activeTier === tier ? 'todas' : tier);
	resultMeta.scrollIntoView({ block: 'start' });
});

let searchTimer: number | undefined;
searchInput.addEventListener('input', () => {
	searchTerm = searchInput.value;
	searchClear.hidden = searchTerm.length === 0;
	window.clearTimeout(searchTimer);
	searchTimer = window.setTimeout(render, 120);
});
searchClear.addEventListener('click', () => {
	searchTerm = '';
	searchInput.value = '';
	searchClear.hidden = true;
	searchInput.focus();
	render();
});
searchInput.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') searchClear.click();
});

/** Zera todos os filtros e mantém o texto da busca. */
function clearFilters() {
	setCategory('todas');
	setKind('todas');
	setTier('todas');
	setRoutine('todas');
	setTheme('todas');
}

byId('filtersClear').addEventListener('click', clearFilters);

byId('emptyReset').addEventListener('click', () => {
	searchTerm = '';
	searchInput.value = '';
	searchClear.hidden = true;
	clearFilters();
});

// Atalho: "/" foca a busca.
document.addEventListener('keydown', (event) => {
	const target = event.target as Element | null;
	if (event.key === '/' && !target?.closest('input, textarea, select, [contenteditable]')) {
		event.preventDefault();
		searchInput.focus();
	}
});

/* ═══════════ EMBARALHAR ═══════════
   O HTML sai ordenado por prioridade (sem JS, é isso que se vê). No cliente,
   cada visita sorteia uma ordem nova e três fontes fora do núcleo essencial.
═══════════════════════════════ */
function randomInt(max: number) {
	const buffer = new Uint32Array(1);
	crypto.getRandomValues(buffer);
	return (buffer[0] ?? 0) % max;
}

function shuffled<T>(list: readonly T[]): T[] {
	const out = list.slice();
	for (let i = out.length - 1; i > 0; i--) {
		const j = randomInt(i + 1);
		[out[i], out[j]] = [out[j] as T, out[i] as T];
	}
	return out;
}

function setOrder(order: string, reshuffle: boolean) {
	activeOrder = order;
	press(orderSeg, '.order-btn', 'order', order);
	if (order === 'tier') {
		grid.append(...cards.slice().sort((a, b) => orderOf(a) - orderOf(b)));
	} else if (reshuffle) {
		grid.append(...shuffled(cards));
	}
	syncUrl();
}

const isBrazil = (card: HTMLElement) => (card.dataset.cats ?? '').split(' ').includes('brasil');

function pickFresh() {
	const pool = cards.filter((card) => card.dataset.tier !== '1');
	const local = shuffled(pool.filter(isBrazil));
	const world = shuffled(pool.filter((card) => !isBrazil(card)));
	const chosen = [local[0], world[0]].filter((card): card is HTMLElement => Boolean(card));
	const rest = shuffled(pool.filter((card) => !chosen.includes(card)));
	if (rest[0]) chosen.push(rest[0]);

	picksGrid.replaceChildren(
		...shuffled(chosen).map((card) => {
			const copy = card.cloneNode(true) as HTMLElement;
			copy.hidden = false;
			copy.removeAttribute('data-order');
			// No bloco de sorteio selo e temas são só rótulo, não filtro.
			copy.querySelectorAll<HTMLElement>('.card-tier, .card-theme').forEach((control) => {
				const label = document.createElement('span');
				label.className = control.className;
				for (const key of ['tier', 'theme', 'tone']) {
					const value = control.dataset[key];
					if (value) label.dataset[key] = value;
				}
				label.append(...Array.from(control.childNodes).map((node) => node.cloneNode(true)));
				control.replaceWith(label);
			});
			return copy;
		})
	);
	picks.hidden = false;
}

orderCtl.hidden = false;
orderSeg.querySelectorAll<HTMLElement>('.order-btn').forEach((button) => {
	button.addEventListener('click', () => {
		const order = button.dataset.order ?? 'shuffle';
		if (order === 'shuffle') {
			button.removeAttribute('data-spin');
			void button.offsetWidth;
			button.setAttribute('data-spin', '');
		}
		setOrder(order, true);
	});
});
byId('picksReroll').addEventListener('click', pickFresh);

// Estado inicial: o que a URL pede, validado contra o que a página realmente tem.
const initial = new URLSearchParams(location.search);
activeFilter = allowed(initial, URL_KEYS.cat, Object.keys(CATEGORY_LABELS));
activeTier = allowed(initial, URL_KEYS.tier, Object.keys(TIER_NAMES));
activeKind = allowed(initial, URL_KEYS.kind, Object.keys(KIND_LABELS));
activeRoutine = allowed(initial, URL_KEYS.routine, Object.keys(ROUTINE_LABELS));
activeTheme = allowed(initial, URL_KEYS.theme, Object.keys(THEME_LABELS));
searchTerm = initial.get(URL_KEYS.q) ?? '';
searchInput.value = searchTerm;
searchClear.hidden = searchTerm.length === 0;
press(filterRow, '.filter-pill', 'filter', activeFilter);
press(tierSeg, '.tier-btn', 'tier', activeTier);
press(kindSeg, '.kind-btn', 'kind', activeKind);
press(themeRow, '.theme-pill', 'theme', activeTheme);
pressCardThemes();
routineButtons.forEach((button) => {
	button.setAttribute('aria-pressed', button.dataset.routine === activeRoutine ? 'true' : 'false');
});

placeFilters();

try {
	setOrder(initial.get(URL_KEYS.order) === 'prioridade' ? 'tier' : 'shuffle', true);
	pickFresh();
	render();
	revealActiveCategory();
	updateOverflow();
} finally {
	// Revela a grade já na ordem final (ver [data-signal='pending'] na página).
	document.documentElement.dataset.signal = 'ready';
}
