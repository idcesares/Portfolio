/** Tags ordered by how many entries use them (ties alphabetical, pt-BR). */
export function tagsByFrequency(entries: { data: { tags: string[] } }[]): string[] {
	const counts = new Map<string, number>();
	for (const { data } of entries) for (const tag of data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR')).map(([tag]) => tag);
}
