export interface TechItem {
	name: string;
	color: 'teal' | 'terracotta' | 'amber' | 'sage' | 'burgundy';
}

export type DevProjectCategory =
	| 'product'
	| 'system'
	| 'research'
	| 'education'
	| 'experiment';

export type DevProjectStatus =
	| 'live'
	| 'development'
	| 'published'
	| 'reference'
	| 'archived';

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
	primaryActionLabel?: string;
	repoActionLabel?: string;
	availability?: string;
	status: DevProjectStatus;
	category: DevProjectCategory;
	featured?: boolean;
	year: number;
}

export interface ProjectCategoryMeta {
	id: DevProjectCategory;
	title: string;
	description: string;
}

export const projectCategories: ProjectCategoryMeta[] = [
	{
		id: 'product',
		title: 'Produtos e ferramentas',
		description:
			'Coisas que começaram com uma fricção concreta e terminaram como software que alguém pode abrir e usar.',
	},
	{
		id: 'system',
		title: 'Sistemas e métodos',
		description:
			'Infraestruturas para dar coerência ao que costuma ficar disperso: memória, identidade visual, escrita e decisão.',
	},
	{
		id: 'research',
		title: 'Pesquisa que vira sistema',
		description:
			'Hipóteses que não ficaram apenas no texto: ganharam regras, dados, interfaces e uma trilha que outras pessoas podem examinar.',
	},
	{
		id: 'education',
		title: 'Aprender construindo',
		description:
			'Notebooks, protótipos e acervos feitos para aproximar ideias técnicas de estudantes, educadores e comunidades.',
	},
	{
		id: 'experiment',
		title: 'Playground',
		description:
			'Projetos menores, provas de conceito e algumas ideias que simplesmente precisavam existir para eu descobrir aonde levavam.',
	},
];

export const categoryLabels: Record<DevProjectCategory, string> = {
	product: 'Produto',
	system: 'Sistema',
	research: 'Pesquisa',
	education: 'Educação',
	experiment: 'Experimento',
};

export const statusLabels: Record<DevProjectStatus, string> = {
	live: 'Online',
	development: 'Em construção',
	published: 'Publicado',
	reference: 'Acervo',
	archived: 'Arquivado',
};

export const statusColors: Record<DevProjectStatus, string> = {
	live: 'var(--color-teal)',
	development: 'var(--color-amber)',
	published: 'var(--color-burgundy)',
	reference: 'var(--color-sage)',
	archived: 'var(--color-neutral-400)',
};

/**
 * Curadoria da página /dev.
 *
 * O GitHub continua sendo o inventário completo. Esta lista destaca os
 * artefatos que ajudam a explicar como pesquisa, educação e engenharia se
 * encontram no trabalho do Isaac — sem transformar a página em um dump de
 * repositórios.
 */
export const devProjects: DevProject[] = [
	{
		id: 'greenrisk',
		title: 'GreenRisk',
		description:
			'Instrumento explicável para estimar risco de greenwashing em divulgações climáticas — com regras, evidências e proveniência abertas à inspeção.',
		longDescription:
			'Instrumento de pesquisa para estimar risco de greenwashing em divulgações climáticas: quando o discurso ambiental merece uma análise mais cuidadosa? Combina sinais do ClimateBERT e regras fuzzy em um escore auditável, com registro das regras acionadas e da proveniência. O resultado apoia a investigação humana; não é uma certificação nem uma conclusão de fraude.',
		techStack: [
			{ name: 'Python', color: 'teal' },
			{ name: 'ClimateBERT', color: 'terracotta' },
			{ name: 'Lógica fuzzy', color: 'amber' },
			{ name: 'W3C PROV-O', color: 'sage' },
			{ name: 'NLP', color: 'burgundy' },
		],
		demoUrl: 'https://doi.org/10.5281/zenodo.21122389',
		repoUrl: 'https://github.com/idcesares/GreenRisk',
		primaryActionLabel: 'Artigo e versão',
		repoActionLabel: 'Método e código',
		status: 'published',
		category: 'research',
		featured: true,
		year: 2026,
	},
	{
		id: 'padline',
		title: 'Padline',
		description:
			'Um pad colaborativo em tempo real no qual a própria URL já é o espaço de escrita. Sem conta, sem onboarding, sem cerimônia.',
		longDescription:
			'Editor colaborativo inspirado na simplicidade do Dontpad: abra uma URL, escreva e compartilhe. Blocos ricos, presença, histórico, resiliência offline, links somente leitura e proteção por PIN são sustentados por Yjs, Durable Objects e SQLite — sem enviar o conteúdo para modelos de IA.',
		techStack: [
			{ name: 'React 19', color: 'teal' },
			{ name: 'TypeScript', color: 'terracotta' },
			{ name: 'Yjs', color: 'amber' },
			{ name: 'Cloudflare Workers', color: 'sage' },
			{ name: 'Durable Objects', color: 'burgundy' },
			{ name: 'SQLite', color: 'teal' },
		],
		demoUrl: 'https://padline.page',
		repoUrl: 'https://github.com/idcesares/padline',
		primaryActionLabel: 'Abrir um pad',
		repoActionLabel: 'Ver arquitetura',
		status: 'live',
		category: 'product',
		featured: true,
		year: 2026,
	},
	{
		id: 'membrane-design-system',
		title: 'The Membrane Palette',
		description:
			'Design system em tokens que mantém calor humano e precisão digital na mesma interface — com dark mode e acessibilidade como estrutura, não remendo.',
		longDescription:
			'Sistema de design orientado por uma metáfora simples: a interface como membrana entre o humano e o digital. A fonte de verdade usa tokens DTCG; o CSS gerado trabalha com OKLCH e light-dark(), enquanto gates automatizados verificam contraste WCAG AA e consistência entre os artefatos.',
		img: '/assets/blog_imgs/membrane-palette.webp',
		imgAlt: 'Showcase visual do design system The Membrane Palette',
		techStack: [
			{ name: 'Design Tokens', color: 'teal' },
			{ name: 'DTCG', color: 'terracotta' },
			{ name: 'OKLCH', color: 'amber' },
			{ name: 'CSS', color: 'sage' },
			{ name: 'WCAG AA', color: 'burgundy' },
		],
		demoUrl: 'https://membrane-palette.dcesares.dev',
		repoUrl: 'https://github.com/idcesares/The-Membrane-Palette',
		primaryActionLabel: 'Explorar o sistema',
		repoActionLabel: 'Usar os tokens',
		status: 'live',
		category: 'system',
		featured: true,
		year: 2026,
	},
	{
		id: 'portfolio-dcesares',
		title: 'dcesares.dev',
		description:
			'Este portfólio: uma base editorial para reunir pesquisa, prática profissional e código sem fingir que são vidas separadas.',
		techStack: [
			{ name: 'Astro 7', color: 'teal' },
			{ name: 'TypeScript', color: 'terracotta' },
			{ name: 'Tailwind CSS', color: 'sage' },
			{ name: 'Fuse.js', color: 'amber' },
			{ name: 'Vercel', color: 'burgundy' },
		],
		img: '/assets/blog_imgs/what-is-astro-cover-image.webp',
		imgAlt: 'Página inicial do portfólio dcesares.dev',
		demoUrl: 'https://dcesares.dev',
		repoUrl: 'https://github.com/idcesares/Portfolio',
		status: 'live',
		category: 'product',
		year: 2026,
	},
	{
		id: 'cloud-dancer',
		title: 'Cloud Dancer',
		description:
			'Template open source de portfólio com layout bento, movimento ambiental e uma arquitetura de conteúdo preparada para pessoas, buscadores e LLMs.',
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
		category: 'product',
		year: 2026,
	},
	{
		id: 'my-ip',
		title: "What's My IP",
		description:
			'Diagnóstico de IP e rede com explicações legíveis, exportação local e nenhum rastreador acompanhando a consulta.',
		techStack: [
			{ name: 'Next.js 16', color: 'teal' },
			{ name: 'React 19', color: 'terracotta' },
			{ name: 'TypeScript', color: 'amber' },
			{ name: 'Vitest', color: 'burgundy' },
		],
		demoUrl: 'https://myip.dcesares.dev',
		repoUrl: 'https://github.com/idcesares/my-ip',
		status: 'live',
		category: 'product',
		year: 2026,
	},
	{
		id: 'tech-signal-stack',
		title: 'Tech Signal Stack',
		description:
			'Curadoria navegável de fontes sobre tecnologia, IA, engenharia, negócios, política e educação — com espaço real para quem apura no Brasil.',
		techStack: [
			{ name: 'Astro', color: 'teal' },
			{ name: 'TypeScript', color: 'terracotta' },
			{ name: 'RSS/OPML', color: 'amber' },
			{ name: 'SEO', color: 'burgundy' },
		],
		demoUrl: '/tech-signal/',
		repoUrl: 'https://github.com/idcesares/Portfolio',
		status: 'live',
		category: 'product',
		year: 2026,
	},
	{
		id: 'aprendizagemcriativa-rio',
		title: 'aprendizagemcriativa.rio',
		description:
			'Casa digital do Núcleo Rio da Rede Brasileira de Aprendizagem Criativa, organizada para leitura, memória da comunidade e descoberta de recursos.',
		techStack: [
			{ name: 'Astro', color: 'teal' },
			{ name: 'TypeScript', color: 'terracotta' },
			{ name: 'Markdown/MDX', color: 'amber' },
			{ name: 'Content Collections', color: 'sage' },
			{ name: 'Vercel', color: 'burgundy' },
		],
		demoUrl: 'https://aprendizagemcriativa.rio',
		status: 'live',
		category: 'product',
		year: 2026,
	},
	{
		id: 'prof-gpt',
		title: 'Prof. GPT',
		description:
			'Construtor de prompts pedagógicos para cocriar planos de aula com contexto, inclusão, BNCC e critérios claros de saída.',
		techStack: [
			{ name: 'SvelteKit', color: 'teal' },
			{ name: 'Svelte', color: 'terracotta' },
			{ name: 'JavaScript', color: 'amber' },
			{ name: 'Vite', color: 'sage' },
		],
		demoUrl: 'https://prof-gpt.vercel.app/',
		repoUrl: 'https://github.com/idcesares/Prof-GPT',
		status: 'live',
		category: 'product',
		year: 2025,
	},
	{
		id: 'base64-encoder-decoder',
		title: 'Base64 Encoder/Decoder',
		description:
			'Utilitário web para codificar e decodificar Base64 com Unicode, feedback imediato e uma API server-side pequena e direta.',
		techStack: [
			{ name: 'Next.js', color: 'teal' },
			{ name: 'React', color: 'terracotta' },
			{ name: 'JavaScript', color: 'amber' },
			{ name: 'Tailwind CSS', color: 'sage' },
		],
		demoUrl: 'https://base64.dcesares.dev',
		repoUrl: 'https://github.com/idcesares/Base64-Encoder-Decoder',
		status: 'live',
		category: 'product',
		year: 2024,
	},
	{
		id: 'qr-code-analyzer',
		title: 'QR Code Analyzer',
		description:
			'Leitor de QR Code para imagem, colagem ou câmera, criado como uma experiência curta de utilidade imediata.',
		techStack: [
			{ name: 'React', color: 'teal' },
			{ name: 'TypeScript', color: 'terracotta' },
			{ name: 'Vite', color: 'amber' },
			{ name: 'Gemini API', color: 'sage' },
		],
		repoUrl: 'https://github.com/idcesares/QR-Code-Analyzer',
		status: 'development',
		category: 'product',
		year: 2025,
	},
	{
		id: 'predictive-mnemonic-ecology',
		title: 'Predictive Mnemonic Ecology',
		description:
			'Memória local-first para agentes: lembra contexto útil, lida com contradições, respeita orçamento de tokens e explica por que recuperou cada registro.',
		techStack: [
			{ name: 'Python', color: 'teal' },
			{ name: 'MCP', color: 'terracotta' },
			{ name: 'SQLite', color: 'amber' },
			{ name: 'Svelte', color: 'sage' },
			{ name: 'Local AI', color: 'burgundy' },
		],
		availability: 'Alpha privado durante a fase de consolidação e dogfooding.',
		status: 'development',
		category: 'system',
		year: 2026,
	},
	{
		id: 'rse-design-system',
		title: 'Design System da Rede Sesc de Educação',
		description:
			'Blueprint técnico da identidade da Rede: tokens semânticos, componentes, guidelines e artefatos reutilizáveis para manter uma presença nacional coerente.',
		techStack: [
			{ name: 'Design Tokens', color: 'teal' },
			{ name: 'DTCG', color: 'terracotta' },
			{ name: 'CSS', color: 'amber' },
			{ name: 'JavaScript', color: 'sage' },
			{ name: 'SVG', color: 'burgundy' },
		],
		demoUrl: 'https://rse-design-showcase.idcesares.chatgpt.site/showcase/',
		primaryActionLabel: 'Abrir o showcase',
		status: 'development',
		category: 'system',
		year: 2026,
	},
	{
		id: 'remove-ai-writing-signs',
		title: 'Remove AI Writing Signs',
		description:
			'Método de edição reconstrutiva para textos em inglês: desmonta padrões previsíveis de texto gerado por IA antes de reconstruir voz, ritmo e especificidade.',
		techStack: [
			{ name: 'Agent Skills', color: 'teal' },
			{ name: 'Prompt Engineering', color: 'terracotta' },
			{ name: 'Edição', color: 'amber' },
			{ name: 'LLMs', color: 'sage' },
		],
		repoUrl: 'https://github.com/idcesares/remove-ai-writing-signs',
		repoActionLabel: 'Conhecer o método',
		status: 'published',
		category: 'system',
		year: 2026,
	},
	{
		id: 'learnchain',
		title: 'LearnChain',
		description:
			'Exploração de uma infraestrutura descentralizada para aprendizagem, credenciais e circulação de valor — a origem de perguntas que ainda atravessam minha pesquisa.',
		techStack: [
			{ name: 'Next.js', color: 'teal' },
			{ name: 'TypeScript', color: 'terracotta' },
			{ name: 'Blockchain', color: 'amber' },
			{ name: 'Vercel', color: 'sage' },
		],
		repoUrl: 'https://github.com/idcesares/LearnChain',
		status: 'development',
		category: 'research',
		year: 2023,
	},
	{
		id: 'sparql-ipfs',
		title: 'SPARQL + IPFS',
		description:
			'Série de provas de conceito sobre consultas semânticas em dados distribuídos, reunindo SPARQL, Comunica, Next.js e IPFS.',
		techStack: [
			{ name: 'SPARQL', color: 'teal' },
			{ name: 'IPFS', color: 'terracotta' },
			{ name: 'Comunica', color: 'amber' },
			{ name: 'Next.js', color: 'sage' },
		],
		demoUrl: 'https://sparql-next-ipfs.vercel.app',
		repoUrl: 'https://github.com/idcesares/sparql-next-ipfs',
		status: 'reference',
		category: 'research',
		year: 2023,
	},
	{
		id: 'experimentos-de-ia',
		title: 'Experimentos Práticos de IA',
		description:
			'Acervo em português com experiências de IA que podem ser testadas sem programação — revisado para continuar útil em vez de virar um cemitério de links.',
		techStack: [
			{ name: 'Markdown', color: 'teal' },
			{ name: 'Curadoria', color: 'terracotta' },
			{ name: 'IA generativa', color: 'amber' },
			{ name: 'No-code', color: 'sage' },
		],
		repoUrl: 'https://github.com/idcesares/Experimentos-de-IA',
		repoActionLabel: 'Explorar o acervo',
		status: 'reference',
		category: 'education',
		year: 2026,
	},
	{
		id: 'clube-stem-ia',
		title: 'Clube de IA da Escola Sesc',
		description:
			'Notebooks usados em experiências de letramento em IA, aprendizagem de máquina e robótica com estudantes do Ensino Médio.',
		techStack: [
			{ name: 'Python', color: 'teal' },
			{ name: 'Jupyter', color: 'terracotta' },
			{ name: 'Machine Learning', color: 'amber' },
			{ name: 'Robótica', color: 'sage' },
		],
		repoUrl: 'https://github.com/idcesares/Clube-de-STEM-IA-ESEM',
		status: 'reference',
		category: 'education',
		year: 2020,
	},
	{
		id: 'arduino-iot-ia',
		title: 'Arduino, IoT e IA',
		description:
			'Prova de conceito em que protótipos conectados percebem contexto e reagem usando Arduino, sensores, serviços de nuvem e bots.',
		techStack: [
			{ name: 'Arduino', color: 'teal' },
			{ name: 'C++', color: 'terracotta' },
			{ name: 'IoT', color: 'amber' },
			{ name: 'Cloud', color: 'sage' },
		],
		repoUrl:
			'https://github.com/idcesares/Arduino--IoT-e-IA--prototipos-inteligentes-e-reativos',
		status: 'reference',
		category: 'education',
		year: 2021,
	},
	{
		id: 'open-digital-fabrication',
		title: 'Open Digital Fabrication Projects',
		description:
			'Repositório aberto para projetos de fabricação digital, cultura maker, modelagem 3D e corte a laser em contextos de aprendizagem.',
		techStack: [
			{ name: 'Fabricação digital', color: 'teal' },
			{ name: 'Modelagem 3D', color: 'terracotta' },
			{ name: 'Corte a laser', color: 'amber' },
			{ name: 'Maker', color: 'sage' },
		],
		repoUrl: 'https://github.com/idcesares/Open-Digital-Fabrication-Projects',
		status: 'reference',
		category: 'education',
		year: 2021,
	},
	{
		id: 'data-science-mini-projects',
		title: 'Data Science Mini Projects',
		description:
			'Coleção de pequenos estudos com datasets, visualizações e algoritmos — um registro do aprendizado pela investigação dos dados.',
		techStack: [
			{ name: 'Python', color: 'teal' },
			{ name: 'Jupyter', color: 'terracotta' },
			{ name: 'Data Science', color: 'amber' },
			{ name: 'Machine Learning', color: 'sage' },
		],
		repoUrl: 'https://github.com/idcesares/Data-Science-Mini-Projects',
		status: 'reference',
		category: 'education',
		year: 2021,
	},
	{
		id: 'queimadas-pantanal',
		title: 'Queimadas no Pantanal',
		description:
			'Análise exploratória de uma década de queimadas no Pantanal, transformando séries ambientais em uma narrativa visual verificável.',
		techStack: [
			{ name: 'Python', color: 'teal' },
			{ name: 'Jupyter', color: 'terracotta' },
			{ name: 'Visualização de dados', color: 'amber' },
			{ name: 'Análise exploratória', color: 'sage' },
		],
		repoUrl: 'https://github.com/idcesares/DS_queimadas_pantanal',
		status: 'published',
		category: 'education',
		year: 2022,
	},
	{
		id: 'disposable-pods',
		title: 'Disposable Pods',
		description:
			'Salas temporárias para compartilhar textos, links e arquivos sem conta; o conteúdo desaparece quando a sala esvazia ou após 24 horas.',
		techStack: [
			{ name: 'TypeScript', color: 'teal' },
			{ name: 'Socket.IO', color: 'terracotta' },
			{ name: 'Node.js', color: 'amber' },
			{ name: 'Privacidade', color: 'sage' },
		],
		repoUrl: 'https://github.com/idcesares/Disposable-Pods',
		status: 'development',
		category: 'experiment',
		year: 2026,
	},
	{
		id: 'sistema-de-sorteio',
		title: 'Sistema de Sorteio Eletrônico',
		description:
			'Sorteio web reproduzível para distribuir vagas, com semente opcional, primeira chamada, lista de espera e saída pronta para conferência.',
		techStack: [
			{ name: 'JavaScript', color: 'teal' },
			{ name: 'HTML', color: 'terracotta' },
			{ name: 'Bootstrap', color: 'sage' },
			{ name: 'SeedRandom', color: 'amber' },
		],
		demoUrl: 'https://sistema-de-sorteio.vercel.app/',
		repoUrl: 'https://github.com/idcesares/Sistema-de-Sorteio',
		status: 'live',
		category: 'experiment',
		year: 2020,
	},
	{
		id: 'ai-quiz',
		title: 'AI Quiz',
		description:
			'Quiz sobre a história da inteligência artificial com animações, feedback contextual e compartilhamento de resultados.',
		techStack: [
			{ name: 'Next.js', color: 'teal' },
			{ name: 'React', color: 'terracotta' },
			{ name: 'Framer Motion', color: 'amber' },
			{ name: 'Lottie', color: 'sage' },
		],
		demoUrl: 'https://ai-quiz.idcesares.vercel.app',
		repoUrl: 'https://github.com/idcesares/AiQuiz',
		status: 'live',
		category: 'experiment',
		year: 2021,
	},
	{
		id: 'isaac-or-not-isaac',
		title: 'Isaac or Not Isaac',
		description:
			'Um classificador no navegador que responde à pergunta científica definitiva: a pessoa diante da câmera é Isaac ou não?',
		techStack: [
			{ name: 'Teachable Machine', color: 'teal' },
			{ name: 'TensorFlow.js', color: 'terracotta' },
			{ name: 'HTML', color: 'amber' },
			{ name: 'Computer Vision', color: 'sage' },
		],
		demoUrl: 'https://isaac-or-not-isaac.vercel.app',
		repoUrl: 'https://github.com/idcesares/ISAAC-OR-NOT-ISAAC',
		status: 'live',
		category: 'experiment',
		year: 2024,
	},
];
