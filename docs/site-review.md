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

A referência visual é o [design system Membrane Palette](../design-system/DESIGN-SYSTEM.md); a escrita segue o [guia de voz](../design-system/BRAND-VOICE.md). A autenticidade da escrita de Isaac é o critério principal. A revisão editorial preserva relatos, opiniões, ritmo e expressões pessoais; descrições e ajustes de clareza devem partir do texto publicado, sem acrescentar experiências ou resultados.

A experiência deve funcionar em mobile, com teclado e com preferências de movimento reduzido. Busca, filtros e tema precisam continuar utilizáveis quando o navegador restringe armazenamento. O visitante pode rever as preferências de cookies no rodapé; a recusa impede o carregamento do Google Analytics.

## Conteúdo e vitrine

Descrições e alternativas de imagens foram revisadas a partir dos textos e das capas publicadas. Corpos dos artigos, títulos, datas e URLs foram preservados. A home destaca três trabalhos com abordagens complementares:

- **Papert e aprendizagem criativa:** referência escolhida por Isaac para apresentar sua reflexão sobre educação.
- **LearnChain:** articula educação, blockchain e autonomia sobre dados e conhecimento.
- **IA e personalização na educação:** apresenta a aplicação pedagógica da inteligência artificial.

O caminho da vitrine ao artigo e ao contato tem cobertura em teste de navegador. A seleção deve acompanhar a atuação de Isaac, sem depender apenas da data da publicação.

## Estado técnico verificado

A auditoria de dependências não encontrou vulnerabilidades conhecidas. Astro Check passou em 59 arquivos, sem erros, warnings ou hints; referências de assets e builds Vercel e Node foram aprovados. Os 13 testes Chromium passaram. A CI também inicia o preview Docker e confere páginas, busca, feeds, 404 e imagens.

Os testes de navegador cobrem consentimento e revogação de Analytics com armazenamento restrito, renderização segura da busca, vitrine e contato, e metadados no `head` após o HTML ser interpretado pelo navegador. Os testes de Analytics usam um script substituto, sem enviar visitas reais ao Google.

A auditoria identificou que o componente Speed Insights no `head` deslocava os metadados para o corpo da página. O componente foi movido para o `body`, preservando as descrições, URLs canônicas e dados de compartilhamento existentes.

## Tech Signal

A curadoria contém 79 fontes e 62 feeds. O OPML gerado contém exatamente os 62 endereços únicos cadastrados. A conferência externa confirmou 60 feeds com XML RSS ou Atom e entradas utilizáveis.

Os feeds de **The New York Times** e **ChinAI** ficaram sem confirmação por bloqueio do túnel de rede no ambiente de auditoria. Alguns sites também responderam com restrições de acesso. Isso não comprova que os endereços estejam quebrados; os cadastros foram mantidos. A data de curadoria não foi avançada com uma verificação parcial.

## Mobile, acessibilidade e desempenho

Home, Trabalhos, Blog, Contato, Papert e Tech Signal foram avaliados com Chromium e axe-core em 390 e 1280 pixels, nos temas claro e escuro, com movimento reduzido. A amostra não apresentou rolagem horizontal indevida. Foram corrigidos contrastes de botões, contadores e filtros usando as cores previstas no design system, além da hierarquia de títulos das listagens. A verificação adicional contempla consentimento, filtros ativos, hover, Dev, Sobre, indicações e 404. Nos cards do Tech Signal, a borda decorativa impede o axe de calcular alguns contrastes; uma conferência complementar ocultou somente essa borda durante o teste, mantendo as cores dos textos e fundos. As etiquetas identificadas nessa conferência também foram corrigidas.

Medição Lighthouse mobile em produção, em 2 de outubro de 2026, antes dos ajustes finais:

| Página | Performance | LCP | TBT | CLS |
| --- | --- | --- | --- | --- |
| Home | 96 | 2,2 s | 80 ms | 0,001 |
| Trabalhos | 83 | 4,0 s | 190 ms | 0 |
| Contato | 82 | 3,7 s | 260 ms | 0,001 |
| Papert | 95 | 2,7 s | 10 ms | 0,001 |

São resultados de uma execução em laboratório com rede e CPU simuladas, sujeitos a variação; não representam Core Web Vitals de usuários reais. Imagens externas do YouTube foram bloqueadas pelo túnel de rede durante a medição. A auditoria automatizada não substitui avaliação manual com leitores de tela.

## Alcance internacional

O objetivo definido por Isaac é **formar parcerias de pesquisa e educação**. A recomendação é um piloto em inglês com a apresentação de Sobre e os três trabalhos em destaque. A adaptação deve partir do texto autoral, preservar opiniões e expressões pessoais e explicar referências brasileiras quando necessário. Não acrescentar experiências, resultados ou credenciais.

Antes de publicar, revisar o sentido e a naturalidade do inglês com Isaac. Preservar as URLs em português, oferecer alternância explícita de idioma e metadados adequados. A tradução completa do site fica condicionada ao retorno desse piloto.

## Prioridades

| Ordem | Próxima ação | Critério de conclusão |
| --- | --- | --- |
| 1 | Investigar carregamento de Trabalhos e Contato | Comparar medições no mesmo perfil; buscar LCP até 2,5 s e TBT até 200 ms, sem remover conteúdo autoral |
| 2 | Reconfirmar feeds NYT e ChinAI com acesso de rede disponível | XML RSS/Atom com entradas válidas; ajustar cadastro somente se houver evidência de falha |
| 3 | Preparar o piloto em inglês para pesquisa e educação | Sobre e três trabalhos adaptados, revisão autoral de Isaac e navegação entre idiomas testada |
| 4 | Complementar a avaliação de acessibilidade e experiência real | Percurso de teclado e leitor de tela; Core Web Vitals de campo quando houver dados suficientes |

## Manutenção

Este é o documento único de análise do site. Atualizar o estado e as prioridades no próprio arquivo, removendo itens concluídos da lista de ações. Instruções de instalação e operação ficam no [README](../README.md); mudanças de código seguem PRs curtos com checks aprovados.
