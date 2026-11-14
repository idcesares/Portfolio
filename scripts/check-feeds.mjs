#!/usr/bin/env node
// Saúde dos feeds do Tech Signal Stack.
//
// Para cada fonte com `feed` em src/data/tech-signal-sources.ts, faz uma
// requisição real e confere três coisas: responde 200, devolve XML de feed (não
// uma página HTML de bloqueio) e traz itens. Também avisa quando o item mais
// recente é velho demais para a cadência declarada, que é como um feed morre
// sem ninguém perceber (aconteceu com a SemiAnalysis).
//
// Fontes sem feed não têm como ser conferidas por requisição. Para elas o campo
// `verifiedAt` guarda a data em que alguém viu a fonte publicando de fato, e o
// script avisa quando ele falta ou passa de 90 dias.
//
// Exit 1 quando há falha. Feed parado, bloqueio do site e fonte sem verificação
// recente são só aviso, a menos que se passe --strict.
// Usa rede, então roda sob demanda e não faz parte de `pnpm check`.
//
//   pnpm check:feeds                 todos os feeds
//   pnpm check:feeds --only jota     só fontes cujo nome contém "jota"
//   pnpm check:feeds --strict        parado, inconclusivo ou sem verificação também derruba o exit code
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';

const run = promisify(execFile);

const DAY = 86_400_000;

/** Quantos dias sem item novo até o feed ser considerado parado, por cadência. */
export const STALE_AFTER_DAYS = { Diária: 21, Semanal: 60, Quinzenal: 35, Mensal: 150, Trimestral: 200, Anual: 500 };

/** Revisão da curadoria mais velha que isso merece um aviso. */
export const REVIEW_STALE_DAYS = 180;

/** Verificação manual de fonte sem feed mais velha que isso é considerada vencida. */
export const VERIFICATION_STALE_DAYS = 90;

const TIMEOUT_MS = 15_000;
const CONCURRENCY = 6;
const USER_AGENT = 'Mozilla/5.0 (compatible; dcesares.dev-feed-check)';

/**
 * Decodifica as poucas entidades que aparecem em datas e títulos de feed.
 * `&amp;` vai por último: decodificá-lo antes faria `&amp;lt;` virar `<`
 * (dupla decodificação, apontada pelo CodeQL).
 */
export const decodeEntities = (text) =>
	text
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.trim();

/**
 * Lê o XML de um feed sem dependência. Reconhece RSS 2.0, Atom e RDF (RSS 1.0).
 * Retorna `format: null` quando o texto não é feed (por exemplo uma página HTML).
 * `latest` é a data do item mais recente, ou null se nenhum item traz data.
 */
export function analyzeFeed(text) {
	const head = text.slice(0, 4000);
	const root = head.match(/<(rss|feed|rdf:RDF)\b/i)?.[1]?.toLowerCase();
	if (!root) return { format: null, items: 0, latest: null };

	const format = root === 'feed' ? 'atom' : root === 'rss' ? 'rss' : 'rdf';
	const blocks = [...text.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => m[2]);

	let latest = null;
	for (const block of blocks) {
		const raw = block.match(/<(?:pubDate|dc:date|published|updated)\b[^>]*>([\s\S]*?)<\/(?:pubDate|dc:date|published|updated)>/i)?.[1];
		if (!raw) continue;
		const date = new Date(decodeEntities(raw));
		if (!Number.isNaN(date.getTime()) && (!latest || date > latest)) latest = date;
	}
	return { format, items: blocks.length, latest };
}

/**
 * Transforma o resultado de uma requisição em veredito.
 * status: 'ok' | 'stale' (aviso) | 'fail'. 'blocked' é montado em check(), não aqui.
 */
export function judge({ cadence, analysis, now = new Date() }) {
	if (!analysis.format) return { status: 'fail', note: 'a resposta não é um feed (provável página HTML ou bloqueio)' };
	if (analysis.items === 0) return { status: 'fail', note: 'feed sem nenhum item' };
	if (!analysis.latest) return { status: 'ok', note: `${analysis.items} itens, sem data nos itens` };

	const age = Math.floor((now.getTime() - analysis.latest.getTime()) / DAY);
	const limit = STALE_AFTER_DAYS[cadence] ?? STALE_AFTER_DAYS.Mensal;
	const when = analysis.latest.toISOString().slice(0, 10);
	if (age > limit) {
		return { status: 'stale', note: `último item em ${when} (${age} dias; cadência ${cadence.toLowerCase()}, limite ${limit})` };
	}
	return { status: 'ok', note: `${analysis.items} itens, último em ${when}` };
}

/**
 * Veredito para fonte sem feed, a partir da data em que alguém a viu publicando.
 * status: 'ok' | 'stale' (vencida) | 'unverified' (nunca verificada).
 */
export function judgeVerification(verifiedAt, now = new Date()) {
	if (!verifiedAt) return { status: 'unverified', note: 'sem verificação registrada: conferir à mão e preencher `verifiedAt`' };
	const date = new Date(`${verifiedAt}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return { status: 'unverified', note: `\`verifiedAt\` inválido (${verifiedAt}): use AAAA-MM-DD` };
	const age = Math.floor((now.getTime() - date.getTime()) / DAY);
	if (age > VERIFICATION_STALE_DAYS) return { status: 'stale', note: `verificada em ${verifiedAt} (${age} dias, limite ${VERIFICATION_STALE_DAYS})` };
	return { status: 'ok', note: `verificada em ${verifiedAt} (${age} dias)` };
}

async function fetchOnce(url) {
	const response = await fetch(url, {
		redirect: 'follow',
		signal: AbortSignal.timeout(TIMEOUT_MS),
		headers: { 'user-agent': USER_AGENT, accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*;q=0.5' },
	});
	return { response, text: response.ok ? await response.text() : '' };
}

/** Respostas com que CDNs barram cliente automático. Não dizem nada sobre o feed. */
const BOT_BLOCK = new Set([401, 403, 429, 503]);

/**
 * Alguns sites (Verge, Ars Technica, Wired, NYT) devolvem 403 ao fetch do Node e
 * 200 ao curl para o mesmo pedido, porque barram a impressão digital do cliente.
 * Quando isso acontece, tenta uma vez pelo curl. Sem curl, retorna null.
 */
async function fetchViaCurl(url) {
	try {
		const marker = '\n__HTTP_STATUS__:';
		const { stdout } = await run(
			'curl',
			['-sL', '--compressed', '-m', String(TIMEOUT_MS / 1000), '-A', USER_AGENT, '-w', `${marker}%{http_code}`, url],
			{ maxBuffer: 64 * 1024 * 1024 }
		);
		const at = stdout.lastIndexOf(marker);
		return { status: Number(stdout.slice(at + marker.length)), text: stdout.slice(0, at) };
	} catch {
		return null;
	}
}

/** Uma tentativa extra para falha transitória (rede, timeout, 429, 5xx). */
export async function check(source) {
	const attempt = async () => {
		try {
			const { response, text } = await fetchOnce(source.feed);
			if (response.ok) {
				const moved = response.url && response.url !== source.feed ? ` (redirecionado para ${response.url})` : '';
				const analysis = analyzeFeed(text);
				// Alguns CDNs respondem 200 com uma página de desafio só para o fetch do Node
				// (The Register já fez isso). Antes de reprovar, o curl tem uma chance.
				if (!analysis.format) {
					const viaCurl = await fetchViaCurl(source.feed);
					if (viaCurl?.status === 200 && analyzeFeed(viaCurl.text).format) {
						const verdict = judge({ cadence: source.cadence, analysis: analyzeFeed(viaCurl.text) });
						return { ...verdict, note: `${verdict.note} (o fetch do Node recebeu uma página em vez do feed; conferido via curl)${moved}` };
					}
				}
				const verdict = judge({ cadence: source.cadence, analysis });
				return { ...verdict, note: verdict.note + moved };
			}
			if (BOT_BLOCK.has(response.status)) {
				const viaCurl = await fetchViaCurl(source.feed);
				if (viaCurl?.status === 200) {
					const verdict = judge({ cadence: source.cadence, analysis: analyzeFeed(viaCurl.text) });
					return { ...verdict, note: `${verdict.note} (o fetch do Node levou HTTP ${response.status}; conferido via curl)` };
				}
				return { status: 'blocked', note: `HTTP ${viaCurl?.status ?? response.status}: o site barra cliente automático, conferir à mão` };
			}
			return { transient: response.status >= 500, status: 'fail', note: `HTTP ${response.status}` };
		} catch (error) {
			const reason = error?.name === 'TimeoutError' ? `sem resposta em ${TIMEOUT_MS / 1000}s` : (error?.cause?.code ?? error?.message ?? 'erro de rede');
			return { transient: true, status: 'fail', note: reason };
		}
	};
	const first = await attempt();
	if (first.status === 'fail' && first.transient) return attempt();
	return first;
}

async function mapPool(items, limit, worker) {
	const results = new Array(items.length);
	let next = 0;
	await Promise.all(
		Array.from({ length: Math.min(limit, items.length) }, async () => {
			while (next < items.length) {
				const index = next++;
				results[index] = await worker(items[index]);
			}
		})
	);
	return results;
}

async function main() {
	const args = process.argv.slice(2);
	const strict = args.includes('--strict');
	const onlyAt = args.indexOf('--only');
	const only = onlyAt === -1 ? '' : (args[onlyAt + 1] ?? '').toLowerCase();

	const data = await import('../src/data/tech-signal-sources.ts');
	const sources = data.SOURCES.filter((source) => source.feed && source.name.toLowerCase().includes(only));
	const feedless = data.SOURCES.filter((source) => !source.feed && source.name.toLowerCase().includes(only));
	if (sources.length === 0 && feedless.length === 0) {
		console.error(only ? `Nenhuma fonte combina com "${only}".` : 'Nenhuma fonte.');
		process.exit(1);
	}

	console.log(`Conferindo ${sources.length} feeds (${CONCURRENCY} em paralelo)…\n`);
	const results = sources.length ? await mapPool(sources, CONCURRENCY, async (source) => ({ source, ...(await check(source)) })) : [];

	const mark = { ok: '✓', stale: '!', blocked: '?', fail: '✗' };
	for (const { source, status, note } of results) {
		console.log(`${mark[status]} ${source.name.padEnd(30)} ${note}`);
	}

	const failed = results.filter((r) => r.status === 'fail');
	const stale = results.filter((r) => r.status === 'stale');
	const blocked = results.filter((r) => r.status === 'blocked');
	const good = results.length - failed.length - stale.length - blocked.length;
	console.log(`\n${good} ok, ${stale.length} parados, ${blocked.length} inconclusivos (bloqueio), ${failed.length} com falha.`);

	const manual = feedless.map((source) => ({ source, ...judgeVerification(source.verifiedAt) }));
	if (manual.length) {
		console.log(`\nSem feed, verificação manual (${manual.length}):\n`);
		const manualMark = { ok: '✓', stale: '!', unverified: '?' };
		for (const { source, status, note } of manual) console.log(`${manualMark[status]} ${source.name.padEnd(30)} ${note}`);
		const pending = manual.filter((item) => item.status !== 'ok').length;
		console.log(`\n${manual.length - pending} verificadas, ${pending} a conferir à mão.`);
	}
	const manualPending = manual.filter((item) => item.status !== 'ok').length;

	const reviewAge = Math.floor((Date.now() - new Date(`${data.CURATED_AT}T00:00:00Z`).getTime()) / DAY);
	if (reviewAge > REVIEW_STALE_DAYS) {
		console.log(`\nA última revisão da curadoria foi em ${data.CURATED_AT} (${reviewAge} dias). Vale agendar outra.`);
	}

	process.exit(failed.length > 0 || (strict && stale.length + blocked.length + manualPending > 0) ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	await main();
}
