import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
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

  const canonicalPost = posts[0];
  const canonicalWork = work[0];

  const generatedDate = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const body = `# Isaac D'Césares Portfolio

> Portfólio profissional de Isaac D'Césares, Coordenador de Tecnologia Educacional do Sesc Nacional e mestrando em Computação pela UFRJ. Foco em pesquisa, desenvolvimento e aplicações de IA na educação.

Base URL: ${baseUrl}
Idiomas: Português (pt-BR), termos técnicos em inglês
Descrição: ${SITE_DESCRIPTION}
Última atualização: ${generatedDate}

## Navegação Essencial
- [Início](${baseUrl}/): Visão geral e destaques profissionais
- [Trabalhos](${baseUrl}/work/): Portfolio de projetos em tecnologia educacional
- [Blog](${baseUrl}/blog/): Artigos sobre IA, educação e tecnologia
- [Dev](${baseUrl}/dev/): Projetos de desenvolvimento, design system e software autoral
- [Sobre](${baseUrl}/about/): Trajetória profissional e formação acadêmica
- [Contato](${baseUrl}/contact/): Canal principal para projetos, palestras, pesquisa e parcerias
- [Ofertas](${baseUrl}/deals/): Links e códigos exclusivos para ferramentas

## Conteúdos Canônicos
${canonicalWork ? `- [${canonicalWork.data.title}](${baseUrl}/work/${canonicalWork.id}/): ${canonicalWork.data.description}\n` : ''}${canonicalPost ? `- [${canonicalPost.data.title}](${baseUrl}/blog/${canonicalPost.id}/): ${canonicalPost.data.description}\n` : ''}- [Dev](${baseUrl}/dev/): Showcase técnico de projetos de software e do sistema Membrane Palette
- [Trabalhos](${baseUrl}/work/): ${work.length} projetos em blockchain educacional, IA e tecnologia educacional
- [Blog](${baseUrl}/blog/): ${posts.length} artigos sobre IA aplicada à educação
- [Dados de busca](${baseUrl}/search-data.json): Dados estruturados para busca

## O que LLMs podem fazer aqui
- Resumir artigos sobre tecnologia educacional e IA
- Responder perguntas sobre projetos de pesquisa em blockchain e educação
- Descrever projetos autorais da seção /dev e o design system do site
- Fornecer informações sobre formação e experiência profissional
- Explicar conceitos de tecnologia educacional e inovação
- Sugerir recursos e ferramentas baseados no conteúdo do portfolio

## Políticas para uso por LLMs (resumo)
- Licença: Código sob MIT License, conteúdo educacional de uso livre com atribuição
- Atribuição: Isaac D'Césares, ${baseUrl.replace('https://', '')}
- Uso comercial: Permitido com atribuição adequada
- Modificações: Encorajadas para fins educacionais
- Responsabilidade: Conteúdo colaborativo com IA, revisão humana aplicada

## Dados dinâmicos
- Frequência de atualização: Contínua, com novos posts, trabalhos e projetos conforme publicação
- Conteúdo em desenvolvimento: Pesquisa de mestrado em andamento
- Changelog: Disponível no repositório GitHub (${SOCIAL_LINKS.github}/Portfolio/commits)

## Metadados
- Sitemap: ${baseUrl}/sitemap-index.xml
- RSS: ${baseUrl}/rss.xml
- Contato principal: ${AUTHOR_EMAIL}
- Página de contato: ${baseUrl}/contact/
- GitHub: ${SOCIAL_LINKS.github}
- LinkedIn: ${SOCIAL_LINKS.linkedin}

## Como citar
D'Césares, Isaac. *[Título do conteúdo]*. Isaac D'Césares Portfolio, [data de acesso]. Disponível em: ${baseUrl}/[url-específica]

## Optional
- [llms-full.txt](${baseUrl}/llms-full.txt): versão completa com FAQ, glossário e políticas detalhadas

_Gerado dinamicamente a cada build: ${generatedDate}_
`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
