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
			'Plataforma construída do zero com Astro 6 em modo SSR, sistema de busca com Fuse.js, filtragem dinâmica por tags e categorias, animações CSS com scroll reveal, e o Membrane Palette Design System — um sistema de tokens semânticos que garante consistência visual em light e dark mode.',
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
		status: 'live',
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
