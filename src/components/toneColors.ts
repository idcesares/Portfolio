import type { TechItem } from '../data/dev-projects';

export type Tone = TechItem['color'];

/**
 * Texto sobre tinta para pills e chips.
 *
 * Terracotta, teal, amber e sage usam os pares semânticos da Membrane Palette
 * v2.1 (`--color-human-*`, `--color-digital-*`, `--color-warning-*`,
 * `--color-success-*`), que o gate de contraste verifica nos dois temas.
 * Burgundy não tem par semântico: o matiz fica no fundo e na borda, e o texto
 * usa `--color-text-primary`.
 */
export const toneColors: Record<Tone, { bg: string; border: string; text: string }> = {
	teal: {
		bg: 'var(--color-digital-bg)',
		border: 'var(--color-teal-20)',
		text: 'var(--color-digital-text)',
	},
	terracotta: {
		bg: 'var(--color-human-bg)',
		border: 'var(--color-terracotta-20)',
		text: 'var(--color-human-text)',
	},
	amber: {
		bg: 'var(--color-warning-bg)',
		border: 'color-mix(in srgb, var(--color-warning) 25%, transparent)',
		text: 'var(--color-warning-text)',
	},
	sage: {
		bg: 'var(--color-success-bg)',
		border: 'color-mix(in srgb, var(--color-success) 25%, transparent)',
		text: 'var(--color-success-text)',
	},
	burgundy: {
		bg: 'var(--color-burgundy-10)',
		border: 'color-mix(in srgb, var(--color-burgundy-light) 30%, transparent)',
		text: 'var(--color-text-primary)',
	},
};
