export interface TechItem {
	name: string;
	color: 'teal' | 'terracotta' | 'amber' | 'sage' | 'burgundy';
}

export interface DevProject {
	id: string;
	title: string;
	description: string;
	longDescription?: string;
	img?: string;
	imgAlt?: string;
	techStack: TechItem[];
	demoUrl?: string;
	repoUrl?: string;
	status: 'live' | 'development' | 'archived';
	featured?: boolean;
	year: number;
}

const statusLabels: Record<DevProject['status'], string> = {
	live: 'Online',
	development: 'Em construção',
	archived: 'Arquivado',
};

const statusColors: Record<DevProject['status'], string> = {
	live: 'var(--color-teal)',
	development: 'var(--color-amber)',
	archived: 'var(--color-neutral-400)',
};

export { statusLabels, statusColors };

/**
 * Dev projects showcase data.
 * Add, remove or reorder entries to update the /dev page.
 */
export const devProjects: DevProject[] = [
	{
		id: 'portfolio-dcesares',
		title: 'dcesares.dev',
		description:
			'Portfólio profissional e blog técnico com busca inteligente, design system proprietário e deploy contínuo.',
		longDescription:
			'Plataforma construída do zero com Astro 6 em modo SSR, sistema de busca com Fuse.js, filtragem dinâmica por tags e categorias, animações CSS com scroll reveal, e o Membrane Palette Design System, um sistema de tokens semânticos que garante consistência visual em light e dark mode.',
		img: '/assets/blog_imgs/astro.webp',
		imgAlt: 'Screenshot do portfólio dcesares.dev com o design Membrane Palette',
		techStack: [
			{ name: 'Astro 6', color: 'teal' },
			{ name: 'TypeScript', color: 'terracotta' },
			{ name: 'Tailwind CSS', color: 'sage' },
			{ name: 'Fuse.js', color: 'amber' },
			{ name: 'Vercel', color: 'burgundy' },
			{ name: 'Docker', color: 'teal' },
		],
		demoUrl: 'https://dcesares.dev',
		repoUrl: 'https://github.com/idcesares/Portfolio',
		status: 'live',
		featured: true,
		year: 2025,
	},
	{
		id: 'membrane-design-system',
		title: 'Membrane Palette',
		description:
			'Design system completo com tokens semânticos, paleta inspirada em membranas biológicas e suporte nativo a dark mode.',
		longDescription:
			'Sistema de design que une a calidez humana à precisão digital. Inclui mais de 100 tokens CSS, tipografia fluida com clamp(), escala de espaçamento em base 4, sombras com tonalidade quente e suporte completo a dark mode automático e manual.',
		techStack: [
			{ name: 'CSS Custom Properties', color: 'teal' },
			{ name: 'Design Tokens', color: 'amber' },
			{ name: 'Tailwind v4', color: 'sage' },
		],
		demoUrl: 'https://dcesares.dev/design-system-showcase.html',
		repoUrl: 'https://github.com/idcesares/idcesares-design-system',
		status: 'live',
		year: 2026,
	},
	{
		id: 'cloud-dancer',
		title: 'Cloud Dancer',
		description:
			'Template open-source de portfólio dev com layout bento, motion ambient, temas light/dark e otimização LLM/GEO.',
		longDescription:
			'Landing page de alto desempenho inspirada no Pantone 11-4201 Cloud Dancer. Arquitetura content-driven com seções bento-style, animações ambient com Framer Motion, testes Playwright, assets prontos para LLMs (llms.txt, JSON-LD) e personalização em 5 minutos.',
		techStack: [
			{ name: 'Next.js 16', color: 'teal' },
			{ name: 'TypeScript', color: 'terracotta' },
			{ name: 'Tailwind CSS', color: 'sage' },
			{ name: 'Framer Motion', color: 'amber' },
			{ name: 'Playwright', color: 'burgundy' },
		],
		demoUrl: 'https://cloud-dancer.dcesares.dev',
		repoUrl: 'https://github.com/idcesares/Cloud-Dancer',
		status: 'live',
		featured: false,
		year: 2026,
	},
	{
		id: 'base64-encoder-decoder',
		title: 'Base64 Encoder/Decoder',
		description:
			'Ferramenta web para codificar e decodificar texto em Base64 com suporte a Unicode, feedback em tempo real e API server-side.',
		techStack: [
			{ name: 'Next.js', color: 'teal' },
			{ name: 'React', color: 'terracotta' },
			{ name: 'JavaScript', color: 'amber' },
			{ name: 'Tailwind CSS', color: 'sage' },
		],
		demoUrl: 'https://base64.dcesares.dev',
		repoUrl: 'https://github.com/idcesares/Base64-Encoder-Decoder',
		status: 'live',
		featured: false,
		year: 2024,
	},
	{
		id: 'my-ip',
		title: "What's My IP",
		description:
			'App privacy-first de diagnóstico de IP e rede, com detecção server-side, exportação de dados e endpoint API público.',
		longDescription:
			'Aplicação web que exibe seu IP detectado (IPv4/IPv6) com diagnósticos de navegador e rede em tempo real. Inclui detecção de categoria (público/privado/CGNAT), indicadores de confiança, toggle básico/avançado, ações de copiar/compartilhar/exportar, histórico local e um endpoint /api/ip limpo, tudo sem tracking.',
		techStack: [
			{ name: 'Next.js 16', color: 'teal' },
			{ name: 'React 19', color: 'terracotta' },
			{ name: 'TypeScript', color: 'amber' },
			{ name: 'Tailwind CSS', color: 'sage' },
			{ name: 'Vitest', color: 'burgundy' },
		],
		demoUrl: 'https://myip.dcesares.dev',
		repoUrl: 'https://github.com/idcesares/my-ip',
		status: 'live',
		featured: false,
		year: 2026,
	},
	{
		id: 'aprendizagemcriativa-rio',
		title: 'aprendizagemcriativa.rio',
		description:
			'Site institucional e editorial do Núcleo Rio de Janeiro da Rede Brasileira de Aprendizagem Criativa, com foco em conteúdo, acessibilidade, SEO e experiência mobile.',
		longDescription:
			'Website criado para apresentar a comunidade do Núcleo Rio de Janeiro da RBAC, divulgar agenda, publicar relatos e reunir recursos em uma experiência clara, acessível e orientada à leitura. O projeto combina arquitetura de conteúdo com identidade local, performance, SEO e navegação fluida em dispositivos móveis.',
		techStack: [
			{ name: 'Astro', color: 'teal' },
			{ name: 'TypeScript', color: 'terracotta' },
			{ name: 'Markdown/MDX', color: 'amber' },
			{ name: 'Content Collections', color: 'sage' },
			{ name: 'Zod', color: 'burgundy' },
			{ name: 'Tailwind CSS 4', color: 'teal' },
			{ name: 'Preact', color: 'terracotta' },
			{ name: 'Vercel', color: 'amber' },
		],
		demoUrl: 'https://aprendizagemcriativa.rio',
		status: 'live',
		featured: false,
		year: 2026,
	},
	// ------------------------------------------------------------------
	// Adicione seus projetos abaixo seguindo o mesmo formato.
	// Exemplos de template para referência rápida:
	// ------------------------------------------------------------------
	// {
	// 	id: 'meu-projeto',
	// 	title: 'Nome do Projeto',
	// 	description: 'Descrição curta do projeto em uma ou duas frases.',
	// 	longDescription: 'Descrição detalhada opcional para o card featured.',
	// 	img: '/assets/blog_imgs/minha-imagem.webp',
	// 	imgAlt: 'Descrição da imagem',
	// 	techStack: [
	// 		{ name: 'React', color: 'teal' },
	// 		{ name: 'Node.js', color: 'sage' },
	// 		{ name: 'PostgreSQL', color: 'amber' },
	// 	],
	// 	demoUrl: 'https://exemplo.com',
	// 	repoUrl: 'https://github.com/usuario/repo',
	// 	status: 'live',
	// 	featured: false,
	// 	year: 2025,
	// },
];
