/**
 * Minúsculas e sem acento, caractere por caractere. O resultado tem sempre o
 * mesmo comprimento do original, então um índice achado no texto dobrado vale
 * no texto original. É isso que deixa o destaque da busca ignorar acento sem
 * reescrever o conteúdo do card.
 */
export function fold(text: string): string {
	let out = '';
	for (const char of text) {
		const base = char.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
		out += base.length === char.length ? base : char;
	}
	return out;
}

/**
 * Posições (no original) de cada ocorrência do termo, ignorando caixa e acento.
 * Retorna pares [início, fim). Termo vazio não casa com nada.
 */
export function findMatches(text: string, term: string): Array<[number, number]> {
	const needle = fold(term.trim());
	if (!needle) return [];
	const haystack = fold(text);
	const matches: Array<[number, number]> = [];
	let from = 0;
	for (let at = haystack.indexOf(needle, from); at !== -1; at = haystack.indexOf(needle, from)) {
		matches.push([at, at + needle.length]);
		from = at + needle.length;
	}
	return matches;
}
