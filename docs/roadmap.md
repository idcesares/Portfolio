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
| 1 | Reduzir o LCP de Trabalhos (hipótese: capa externa do YouTube) e reconfirmar o TBT de Contato | Lighthouse mobile com mediana de três execuções; LCP até 2,5 s e TBT até 200 ms, sem remover conteúdo autoral |
| 2 | Revisar o rascunho em inglês (Sobre e três trabalhos em destaque) | Voz confirmada por Isaac; depois, alternância de idioma, URLs em português preservadas e metadados testados |
| 3 | Reconfirmar os feeds do NYT e do ChinAI com acesso de rede | XML RSS/Atom com entradas válidas; mexer no cadastro só com evidência de falha |
| 4 | Acessibilidade e experiência reais | Percurso com leitor de tela (NVDA ou VoiceOver); Core Web Vitals de campo quando houver dados |

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

Contato está dentro das metas (LCP até 2,5 s, TBT até 200 ms). Trabalhos segue com LCP alto. A primeira capa da listagem é uma miniatura externa do YouTube (`i.ytimg.com`), sem `fetchpriority` nem preconnect, e é a hipótese principal; o Lighthouse falhou ao atribuir o elemento de LCP, então falta confirmar com um trace. O TBT de Contato de 2/10 não se reproduziu nesta medição.

São resultados de laboratório, com rede e CPU simuladas. Não representam Core Web Vitals de usuários reais.

## Regras que não mudam

- A experiência funciona em mobile, com teclado e com movimento reduzido. Busca, filtros e tema continuam utilizáveis com armazenamento do navegador restrito.
- A vitrine da home acompanha a atuação de Isaac, não só a data de publicação.
- Os feeds do NYT e do ChinAI falharam por bloqueio de rede no ambiente de auditoria, o que não prova que estejam quebrados. Os cadastros ficam até haver evidência.
- Corpos de artigos, títulos, datas e URLs não são reescritos sem Isaac. A revisão editorial parte do texto publicado e não acrescenta experiências, resultados ou credenciais.
- Inglês: o objetivo é formar parcerias de pesquisa e educação. A adaptação parte do texto autoral e explica referências brasileiras quando necessário. A tradução completa só segue se o piloto for aprovado.
- Deploy e `pnpm build` automático são decisão de Isaac.

## Manutenção

Atualizar estado e prioridades neste arquivo, removendo o que foi concluído. Instalação e operação ficam no [README](../README.md). Mudanças de código seguem PRs curtos com checks aprovados.
