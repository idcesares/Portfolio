# Análise do site

Atualizada em 2 de outubro de 2026. Site: https://www.dcesares.dev/.

## Propósito e público

O portfólio apresenta Isaac D’Césares como pesquisador, educador e desenvolvedor na interseção entre educação e tecnologia. Deve ajudar educadores, pesquisadores e parceiros a entender sua atuação, encontrar evidências do trabalho e iniciar uma conversa.

A organização do site deve tornar claros três caminhos: conhecer a pessoa, explorar sua produção e entrar em contato. Projetos e textos precisam conectar conhecimento técnico a aplicações e resultados concretos.

## Organização do conteúdo

| Área | Papel | Critério de qualidade |
| --- | --- | --- |
| Home e Sobre | Apresentar atuação e contexto profissional | Proposta clara, informações atuais e caminho visível para trabalhos e contato |
| Trabalhos | Demonstrar experiência em projetos, pesquisas e palestras | Contexto, contribuição de Isaac, entregas e evidências identificáveis |
| Blog | Compartilhar reflexão e conhecimento aplicado | Voz autoral, fontes quando necessárias, descrições úteis e tags consistentes |
| Dev | Apresentar ferramentas e projetos de software | Problema atendido, funcionamento e acesso ao projeto |
| Tech Signal | Oferecer curadoria de fontes | Critérios de seleção claros, links funcionais e feeds utilizáveis |
| Contato | Facilitar conversas profissionais | Canais acessíveis e próximos passos claros |

## Identidade e experiência

A referência visual é o [design system Membrane Palette](../design-system/DESIGN-SYSTEM.md); a escrita segue o [guia de voz](../design-system/BRAND-VOICE.md). A revisão editorial deve preservar a autoria, a precisão e a relação entre pesquisa, educação e prática.

A experiência deve funcionar em mobile, com teclado e com preferências de movimento reduzido. Busca, filtros e tema precisam continuar utilizáveis quando o navegador restringe armazenamento. O visitante pode rever as preferências de cookies no rodapé; a recusa impede o carregamento do Google Analytics.

## Estado técnico verificado

A base técnica está operacional. As verificações concluídas em 2 de outubro indicam:

- Auditoria completa de dependências sem vulnerabilidades conhecidas.
- Astro Check: 57 arquivos, zero erros, warnings ou hints; referências de assets e build Vercel aprovados.
- Oito testes Chromium aprovados, cobrindo consentimento, revogação com armazenamento restrito e renderização segura da busca.
- Preview Node standalone e Docker aprovados; a CI inicia o container e verifica páginas, busca, feeds, 404 e imagens.
- As 42 páginas geradas têm um H1, metadados essenciais e destinos internos válidos na amostra analisada.
- Deploy de produção, páginas principais, índice de busca, RSS e sitemap verificados; checks da branch principal aprovados.

Os testes de Analytics usam um script substituto, sem enviar visitas reais ao Google. Esta verificação não inclui medição de Core Web Vitals, auditoria completa de acessibilidade ou validação de todos os links externos.

## Prioridades

Priorizar a qualidade do conteúdo e a clareza da navegação. Avaliar novas funcionalidades conforme o benefício para o público.

| Ordem | Ação | Impacto / esforço estimados | Critério de conclusão |
| --- | --- | --- | --- |
| 1 | Revisar textos antigos, descrições e alt text | Alto / médio | Voz autoral preservada, descrições claras e imagens com alternativas adequadas ao contexto |
| 2 | Revisar a apresentação dos trabalhos e o caminho até contato | Alto / médio | Leitor identifica contexto, contribuição e entregas; encontra o canal de contato |
| 3 | Conferir fontes e feeds do Tech Signal | Médio / baixo | Links externos conferidos; apenas feeds utilizáveis entram no OPML |
| 4 | Medir experiência mobile e acessibilidade nas páginas principais | Alto / médio | Registrar medições, problemas reproduzíveis e ações com critérios verificáveis |
| 5 | Avaliar a necessidade de conteúdo em inglês | A confirmar / alto | Público e benefício definidos antes de implementar; URLs em português preservadas |

## Manutenção

Este é o documento único de análise do site. Atualizar o estado e as prioridades no próprio arquivo, removendo itens concluídos da lista de ações. Instruções de instalação e operação ficam no [README](../README.md); mudanças de código seguem PRs curtos com checks aprovados.
