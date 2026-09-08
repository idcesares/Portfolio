import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { devProjects, statusLabels } from '../data/dev-projects';
import { AUTHOR_EMAIL, SITE_DESCRIPTION, SOCIAL_LINKS } from '../utils/seo';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ?? new URL('https://www.dcesares.dev')).toString().replace(/\/$/, '');

  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.updatedDate.valueOf() - a.data.updatedDate.valueOf()
  );
  const work = (await getCollection('work', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.updatedDate.valueOf() - a.data.updatedDate.valueOf()
  );

  const generatedDate = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const contentTree = `\`\`\`
${baseUrl.replace('https://', '')}/
├── / (Home)
│   ├── Apresentação profissional
│   ├── Projetos em código em destaque e últimos 4 trabalhos
│   ├── Posts recentes do blog (últimos 4)
│   └── Skills e competências
├── /work/ (Portfolio de Trabalhos, ${work.length} itens)
│   ├── filtros por tags, busca e ordenação client-side
${work.slice(0, 4).map((w) => `│   ├── /work/${w.id}/`).join('\n')}
├── /blog/ (Artigos e Conteúdo, ${posts.length} itens)
│   ├── filtros por tags, busca e ordenação client-side
${posts.slice(0, 4).map((p) => `│   ├── /blog/${p.id}/`).join('\n')}
├── /dev/ (Projetos de Desenvolvimento)
│   ├── /dev/ como vitrine de software autoral
│   ├── projetos em destaque e cards secundários
│   └── tecnologias e stack utilizados
├── /about/ (Sobre)
│   ├── Perfil profissional detalhado
│   ├── Experiência e realizações
│   ├── Áreas de especialização
│   └── Visão e objetivos
├── /contact/ (Contato)
│   ├── Canal principal por email
│   ├── Tipos de conversa e colaboração
│   ├── Guia para uma boa primeira mensagem
│   └── Links profissionais e sociais
├── /deals/ (Ofertas e Códigos)
│   ├── Convites exclusivos para plataformas de IA
│   └── Códigos de desconto para ferramentas
├── /search-data.json (API)
│   └── Dados estruturados para busca
└── /rss.xml (Feed RSS)
    └── Artigos do blog em formato RSS
\`\`\``;

  const body = `# llms-full.txt — Isaac D'Césares Portfolio

**Base URL:** ${baseUrl}
**Idiomas:** Português (pt-BR), termos técnicos em inglês
**Descrição:** ${SITE_DESCRIPTION}

---

## Mapa de Conteúdo Expandido

${contentTree}

---

## Projetos em código
${devProjects.map(project => `- [${project.title}](${baseUrl}/dev/#project-${project.id}): ${project.description} Estado: ${statusLabels[project.status]}.`).join('\n')}

## FAQ (Perguntas Frequentes)

**P: Qual é a formação acadêmica de Isaac D'Césares?**
**R:** Mestrando em Computação pela UFRJ, especializações em Educação Inovadora (Stanford), Innovation Leadership (The Hebrew University of Jerusalem) e Transformação Digital (Fundação Dom Cabral), além de formação em Ciência de Dados pela FGV. Certificações como Educador Inovador Google, Microsoft Innovative Educator e Instrutor CISCO.

**P: Qual é o foco de pesquisa atual?**
**R:** Tecnologias Emergentes (Inteligência Artificial e Blockchain) com foco em arquiteturas que conectam Ciência de Dados a impacto socioeconômico verificável, na UFRJ.

**P: Qual o papel profissional atual?**
**R:** Coordenador de Tecnologias Educacionais no Departamento Nacional do Sesc, liderando projetos estratégicos que alcançam diretamente cerca de 80 mil estudantes em todo o Brasil.

**P: Quais são as principais áreas de atuação?**
**R:** IA aplicada à educação, blockchain educacional, cultura digital, transformação digital e design de experiências de aprendizagem.

**P: Como posso colaborar ou me conectar?**
**R:** Use a página /contact/ ou envie email para ${AUTHOR_EMAIL}. LinkedIn e GitHub também são canais oficiais.

**P: O conteúdo do site pode ser usado comercialmente?**
**R:** Código sob MIT License. Conteúdo educacional de uso livre com atribuição. Consulte o arquivo LICENSE do repositório para detalhes completos.

**P: O site oferece APIs ou dados estruturados?**
**R:** Sim: endpoint /search-data.json com dados estruturados para busca, RSS feed em /rss.xml, sitemap XML para indexação e dados estruturados (schema.org) em todas as páginas.

**P: Existe uma seção dedicada a projetos de desenvolvimento?**
**R:** Sim. A rota /dev apresenta projetos autorais de software, incluindo o próprio dcesares.dev e o sistema de design Membrane Palette.

**P: Isaac oferece consultoria ou palestras?**
**R:** Sim, para projetos alinhados com educação tecnológica inovadora. Contato através dos canais oficiais para discussão de oportunidades.

---

## Glossário de Termos

**AI/IA (Artificial Intelligence)**: Inteligência Artificial, sistemas computacionais capazes de realizar tarefas que normalmente requerem inteligência humana.

**Blockchain**: Tecnologia de registro distribuído que mantém uma lista crescente de registros ligados criptograficamente.

**EdTech**: Educational Technology, tecnologia aplicada à educação para melhorar processos de ensino e aprendizagem.

**Aprendizagem Criativa**: Abordagem pedagógica baseada em aprender fazendo, através de criação e construção com ferramentas digitais e físicas, associada ao trabalho de Seymour Papert.

**LLM**: Large Language Model, modelo de linguagem de grande escala treinado para compreender e gerar texto.

**Letramento Digital**: Habilidades necessárias para usar, compreender e avaliar criticamente tecnologias digitais.

**BNCC Computação**: Componente da Base Nacional Comum Curricular brasileira que trata do letramento e pensamento computacional na educação básica.

**SSR**: Server-Side Rendering, renderização do lado do servidor para melhor performance web.

**Astro**: Framework usado na construção deste site, focado em conteúdo e performance.

---

## APIs e Endpoints

### GET /search-data.json
**Descrição**: Endpoint público que retorna dados estruturados para busca (posts do blog e projetos de trabalho)
**Cache**: 5 minutos (300 segundos)
**CORS**: Habilitado (*)

### GET /rss.xml
**Descrição**: Feed RSS com artigos do blog
**Formato**: XML/RSS 2.0 com extensão Atom
**Conteúdo**: Título, descrição, categorias, data de publicação e atualização, conteúdo completo

---

## Exemplos de Tarefas e Prompts

### Para Resumo de Conteúdo
\`\`\`
"Resuma os principais pontos do artigo mais recente de Isaac D'Césares sobre IA na educação"
\`\`\`

### Para Análise Profissional
\`\`\`
"Baseado no portfolio de Isaac D'Césares, liste suas principais competências em tecnologia educacional"
\`\`\`

### Para Recomendações Educacionais
\`\`\`
"Com base na experiência de Isaac, quais são as melhores práticas para implementar IA em ambientes educacionais?"
\`\`\`

---

## Políticas Completas de Uso por IA

### Licenciamento e Direitos
- **Código fonte**: Licenciado sob MIT License, uso, modificação e distribuição livres
- **Conteúdo educacional**: Uso livre com atribuição
- **Imagens e mídia**: Direitos reservados, contato necessário para uso comercial
- **Dados pessoais**: Uso respeitoso conforme LGPD, sem coleta desnecessária

### Atribuição Obrigatória
- **Autor**: Isaac D'Césares
- **Fonte**: ${baseUrl.replace('https://', '')}
- **URL específica**: Referenciar a página exata quando possível

### Usos Permitidos
- Resumo e análise de conteúdo educacional
- Geração de insights sobre tecnologia educacional
- Resposta a perguntas sobre formação e experiência
- Criação de conteúdo derivado com atribuição
- Uso em pesquisa acadêmica e educacional

### Usos Não Permitidos
- Personificação ou falsificação de identidade
- Uso para desinformação ou conteúdo prejudicial
- Violação de direitos autorais sem atribuição
- Uso comercial direto sem permissão explícita
- Modificação de citações ou contexto de forma enganosa

### Responsabilidade e Precisão
- Conteúdo pode incluir colaboração com IA generativa, com revisão humana aplicada
- Informações sujeitas a atualizações e correções
- Verificação recomendada para uso crítico

---

## Contato e Governança

### Contato Principal
- **Página**: ${baseUrl}/contact/
- **Email**: ${AUTHOR_EMAIL}
- **Idiomas**: Português, inglês

### Canais Profissionais
- **LinkedIn**: ${SOCIAL_LINKS.linkedin}
- **GitHub**: ${SOCIAL_LINKS.github}
- **YouTube**: ${SOCIAL_LINKS.youtube}
- **Twitter/X**: ${SOCIAL_LINKS.twitter}

### Histórico de Mudanças
O changelog real deste site é o histórico de commits do repositório: ${SOCIAL_LINKS.github}/Portfolio/commits/main

---

**Este documento é gerado dinamicamente a cada build a partir do conteúdo publicado.**
**Gerado em**: ${generatedDate}
**Responsável**: Isaac D'Césares (${AUTHOR_EMAIL})
`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
