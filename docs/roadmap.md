# Roadmap

Atualizado em 19 de outubro de 2026. Site: https://www.dcesares.dev/.

Este é o documento único de estado e prioridades. Ele substitui a análise de 2 de outubro (`site-review.md`), que descrevia a fase anterior (pré-2.2): correção de acessibilidade, desempenho e curadoria. A base agora é a Membrane Palette 2.2.0 e a fase é outra: consolidar a base nova, medir o que ela entrega e abrir o site para parcerias internacionais.

## Onde estamos

- **Base:** o site roda sobre a Membrane Palette 2.2.0 (`design-system/membrane.lock.json`), com componentes `mp-*`, fontes auto-hospedadas e checagem de conformidade (`pnpm check:membrane`).
- **Identidade pública:** Pesquisador · Educador · Desenvolvedor. Fatos sobre Isaac vêm de `design-system/PROFILE.md`, voz de `VOICE.md` e `BRAND-VOICE.md`. O PR #127 já trouxe "Desenvolvedor" ao hero.
- **Propósito e público:** apresentar a atuação para educadores, pesquisadores e parceiros, com três caminhos claros: conhecer a pessoa, explorar a produção, entrar em contato.
- **Áreas:** Home e Sobre, Trabalhos, Blog, Dev, Tech Signal (79 fontes, 62 feeds, OPML), Contato.
- **Qualidade:** testes de navegador com axe em todas as páginas (claro e escuro), overflow mobile, teclado, busca, tema, fontes e consentimento. Consentimento de Analytics revogável no rodapé; a recusa impede o carregamento do Google Analytics.
- **Dependências:** Node 24 LTS, Astro 7, auditoria sem vulnerabilidades conhecidas (avaliação de 10 de outubro em `docs/dependency-assessment-2026-10-10.md`).

## Prioridades

| Ordem | Próxima ação | Critério de conclusão |
| --- | --- | --- |
| 1 | Baixar o LCP de Trabalhos além de 3,78 s: investigar o que mais compete na listagem (várias capas, scripts, fontes) e medir TBT com um ambiente menos ruidoso | Lighthouse mobile com mediana de cinco execuções; LCP até 2,5 s e TBT até 200 ms, sem remover conteúdo autoral |
| 2 | Revisar o rascunho em inglês (Sobre e três trabalhos em destaque) | Voz confirmada por Isaac; depois, alternância de idioma, URLs em português preservadas e metadados testados |
| 3 | Acessibilidade e experiência reais | Percurso com leitor de tela (NVDA ou VoiceOver); Core Web Vitals de campo quando houver dados |

## Referências de desempenho (2 de outubro, antes da base 2.2.0)

Mediana de três execuções em produção, Lighthouse mobile. Servem de ponto de partida, não de meta cumprida.

| Página | Performance | LCP | TBT |
| --- | --- | --- | --- |
| Trabalhos | 88 | 3,40 s | 122 ms |
| Contato | 91 | 2,60 s | 230 ms |

Nova medição em produção em 19 de outubro (Lighthouse 11.7, Chromium 141, mediana de três execuções, ambiente diferente do anterior, então a comparação direta é limitada):

| Página | Performance | LCP | TBT |
| --- | --- | --- | --- |
| Trabalhos | 84 | 4,07 s | 32 ms |
| Contato | 98 | 2,26 s | 30 ms |

Contato está dentro das metas (LCP até 2,5 s, TBT até 200 ms). Trabalhos segue com LCP alto. A primeira capa da listagem é uma miniatura externa do YouTube (`i.ytimg.com`), sem `fetchpriority` nem preconnect, e foi confirmada por trace (PerformanceObserver) como elemento de LCP. O Lighthouse não conseguiu atribuí-lo sozinho. O TBT de Contato de 2/10 não se reproduziu nesta medição.

Medição depois do deploy de `fetchpriority="high"` na primeira capa e preconnect a `i.ytimg.com` (19 de outubro, mesma ferramenta):

| Página | Performance | LCP | TBT |
| --- | --- | --- | --- |
| Trabalhos | 58, 58, 82 (mediana 58) | 3,93, 4,13, 4,10 s (mediana 4,10 s) | 2332, 1349, 32 ms |
| Contato | 92, 99, 99 (mediana 99) | 2,73, 2,02, 1,83 s (mediana 2,02 s) | 29, 0,5, 0 ms |

Em Trabalhos o LCP não mudou (era 3,88, 4,07 e 4,19 s antes). Duas das três execuções tiveram TBT alto, provavelmente ruído do ambiente de medição, o que derrubou a nota; vale repetir. Contato segue dentro das metas. A hipótese de prioridade e conexão não bastou: o gargalo parece ser o próprio download da miniatura externa.

Depois de servir as capas externas pelo otimizador de imagens do site (#130; `/_vercel/image`, WebP, 38 kB a primeira), mediana de cinco execuções em 19 de outubro:

| Página | Performance | LCP | TBT |
| --- | --- | --- | --- |
| Trabalhos | 73 (52 a 86) | 3,78 s (3,31 a 4,52 s) | 787 ms (146 a 2565 ms) |
| Contato | 99 | 2,11 s | 34 ms |

O LCP de Trabalhos caiu cerca de 0,3 s (era 4,07 a 4,10 s), mas segue acima da meta de 2,5 s. O TBT variou demais entre execuções iguais, o que aponta ruído do ambiente de medição e não regressão. Contato está dentro das metas.

São resultados de laboratório, com rede e CPU simuladas. Não representam Core Web Vitals de usuários reais.

## Verificações concluídas em 19 de outubro

- Feeds do NYT (`rss.nytimes.com/.../Technology.xml`) e do ChinAI (`chinai.substack.com/feed`): HTTP 200, XML RSS com 20 itens cada. Os cadastros ficam como estão. A data de curadoria do Tech Signal não foi alterada, porque a conferência cobriu só esses dois feeds.
- Suíte de navegador completa (60 testes, inclusive axe nos dois temas) aprovada, com o novo teste de carregamento da listagem de Trabalhos.

- A Palette 2.2.0 está fixada no commit `0bdbc24` da `master` (`design-system/membrane.lock.json`). O repo da Palette ainda não tem tag; quando `v2.2.0` existir, rodar `pnpm sync:membrane --ref v2.2.0` para trocar o commit pela tag.

## Regras que não mudam

- A experiência funciona em mobile, com teclado e com movimento reduzido. Busca, filtros e tema continuam utilizáveis com armazenamento do navegador restrito.
- A vitrine da home acompanha a atuação de Isaac, não só a data de publicação.
- Os feeds do NYT e do ChinAI falharam por bloqueio de rede no ambiente de auditoria, o que não prova que estejam quebrados. Os cadastros ficam até haver evidência.
- Corpos de artigos, títulos, datas e URLs não são reescritos sem Isaac. A revisão editorial parte do texto publicado e não acrescenta experiências, resultados ou credenciais.
- Inglês: o objetivo é formar parcerias de pesquisa e educação. A adaptação parte do texto autoral e explica referências brasileiras quando necessário. A tradução completa só segue se o piloto for aprovado.
- Deploy e `pnpm build` automático são decisão de Isaac.

## Manutenção

Atualizar estado e prioridades neste arquivo, removendo o que foi concluído. Instalação e operação ficam no [README](../README.md). Mudanças de código seguem PRs curtos com checks aprovados.
