import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { imageConfig } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import sharp from 'sharp';
import { SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH, type SocialImage } from './seo';

export type ShareableEntry = CollectionEntry<'blog'> | CollectionEntry<'work'>;

const width = SOCIAL_IMAGE_WIDTH;
const height = SOCIAL_IMAGE_HEIGHT;
const maxRemoteBytes = 10 * 1024 * 1024;
const remoteCovers = new Map<string, Promise<Buffer | undefined>>();

async function normalizeCover(input: string | Buffer) {
	const image = sharp(input);
	const { autoOrient } = await image.metadata();
	const ratio = autoOrient.width / autoOrient.height;
	if (ratio >= 1.4 && ratio <= 2.4) {
		return image.autoOrient().resize(width, height).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
	}

	// Preserve the composition of square, portrait and very wide source images.
	const foreground = await image.clone().autoOrient().resize(width, height, { fit: 'inside' }).png().toBuffer();
	const backdrop = await image.autoOrient().resize(width, height).blur(36).modulate({ brightness: 0.65 }).png().toBuffer();
	return sharp(backdrop).composite([{ input: foreground, gravity: 'centre' }]).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
}

async function prepareRemoteCover(src: string) {
	try {
		const url = new URL(src);
		if (url.protocol !== 'https:' || !imageConfig.domains?.includes(url.hostname)) {
			throw new Error('image host is outside the configured allowlist');
		}
		const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(8000) });
		if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
			throw new Error(`unexpected image response (${response.status})`);
		}
		if (Number(response.headers.get('content-length')) > maxRemoteBytes) {
			throw new Error('image is too large');
		}
		const bytes = Buffer.from(await response.arrayBuffer());
		if (bytes.length > maxRemoteBytes) throw new Error('image is too large');
		return await normalizeCover(bytes);
	} catch (error) {
		console.warn(`[social-image] Using the default cover for ${src}: ${String(error)}`);
		return undefined;
	}
}

function getRemoteCover(src: string) {
	const existing = remoteCovers.get(src);
	if (existing) return existing;
	const cover = prepareRemoteCover(src);
	remoteCovers.set(src, cover);
	return cover;
}

export async function getArticleSocialImage(entry: ShareableEntry): Promise<SocialImage | undefined> {
	const { img, img_alt, title } = entry.data;
	if (typeof img === 'string' && !(await getRemoteCover(img))) return undefined;
	return {
		src: `/social/${entry.collection}/${entry.id}.jpg`,
		alt: img_alt || `Imagem de capa de ${title}`,
		type: 'image/jpeg',
	};
}

export async function renderArticleSocialImage(entry: ShareableEntry) {
	if (typeof entry.data.img === 'string') return getRemoteCover(entry.data.img);

	// The image schema exposes a public URL. Use the Markdown source to resolve
	// the local file without relying on Astro's internal asset fields.
	const filePath = entry.filePath;
	if (!filePath) throw new Error(`Missing content file for ${entry.collection}/${entry.id}`);
	const { frontmatter } = parseFrontmatter(await readFile(filePath, 'utf8'));
	if (typeof frontmatter.img !== 'string') throw new Error(`Missing cover path in ${filePath}`);
	return normalizeCover(resolve(dirname(filePath), frontmatter.img));
}
