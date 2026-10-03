# Análise do site

Atualizada em 3 de outubro de 2026. Site: https://www.dcesares.dev/.

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

A auditoria de dependências não encontrou vulnerabilidades conhecidas. Astro Check passou em 61 arquivos, sem erros, warnings ou hints; referências de assets e builds Vercel e Node foram aprovados. Os 18 testes Chromium passaram. A CI também inicia o preview Docker e confere páginas, busca, feeds, 404 e imagens.

Os testes de navegador cobrem ausência de inicialização do worker antes do consentimento, aceite tardio e salvo, revogação de Analytics com armazenamento restrito, renderização segura da busca, vitrine e contato, introdução legível sem módulos JavaScript, menu mobile com Escape, filtros recolhidos fora da árvore de acessibilidade, anúncios de resultados, e metadados no `head` após o HTML ser interpretado pelo navegador. Os testes de Analytics usam um script substituto, sem enviar visitas reais ao Google.

A auditoria identificou que o componente Speed Insights no `head` deslocava os metadados para o corpo da página. O componente foi movido para o `body`, preservando as descrições, URLs canônicas e dados de compartilhamento existentes.

## Tech Signal

A curadoria contém 79 fontes e 62 feeds. O OPML gerado contém exatamente os 62 endereços únicos cadastrados. A conferência externa confirmou 60 feeds com XML RSS ou Atom e entradas utilizáveis.

Os feeds de **The New York Times** e **ChinAI** continuam sem confirmação após nova tentativa, por bloqueio do túnel de rede no ambiente de auditoria. Alguns sites também responderam com restrições de acesso. Isso não comprova que os endereços estejam quebrados; os cadastros foram mantidos. A data de curadoria não foi avançada com uma verificação parcial.

## Mobile, acessibilidade e desempenho

Home, Trabalhos, Blog, Contato, Papert e Tech Signal foram avaliados com Chromium e axe-core em 390 e 1280 pixels, nos temas claro e escuro, com movimento reduzido. A amostra não apresentou rolagem horizontal indevida. Foram corrigidos contrastes de botões, contadores e filtros usando as cores previstas no design system, além da hierarquia de títulos das listagens. A verificação adicional contempla consentimento, filtros ativos, hover, Dev, Sobre, indicações e 404. Nos cards do Tech Signal, a borda decorativa impede o axe de calcular alguns contrastes; uma conferência complementar ocultou somente essa borda durante o teste, mantendo as cores dos textos e fundos. As etiquetas identificadas nessa conferência também foram corrigidas.

A conferência de teclado e da árvore de acessibilidade do Chromium identificou controles de filtros recolhidos ainda disponíveis para navegação e leitura assistiva. Os controles agora ficam inertes quando recolhidos, o botão comunica seu estado, e a contagem de resultados é uma região de status. Escape fecha o menu mobile e devolve o foco ao botão; a navegação desktop permanece aberta. Esses percursos têm cobertura de regressão. A revalidação de Trabalhos, Blog e Contato passou nos 12 cenários de tela e tema, sem violações detectadas pelo axe nem rolagem horizontal indevida. A árvore do navegador não substitui um ensaio real com NVDA, VoiceOver ou outro leitor de tela.

Comparação Lighthouse mobile em produção em 2 de outubro de 2026, com o mesmo perfil e **mediana de três execuções por página em cada versão**:

| Página | Performance antes → depois | LCP antes → depois | TBT antes → depois |
| --- | --- | --- | --- |
| Trabalhos | 82 → 88 | 3,96 → 3,40 s | 114 → 122 ms |
| Contato | 87 → 91 | 3,65 → 2,60 s | 68 → 230 ms |

O carregamento inicial dispensa o preload da fonte serifada em itálico, mantendo-a disponível sob demanda. Capas locais usam qualidade 80. O retrato de Contato é responsivo e sua variante de 640 pixels foi entregue em produção com cerca de 41 kB, em vez dos 160 kB do arquivo original. O texto e a foto iniciais de Contato aparecem imediatamente, sem depender do script de animação.

O LCP melhorou nas duas páginas, mas permanece acima da meta de 2,5 s. O TBT de Contato aumentou nessa comparação; ela não demonstrou ganho geral de processamento. O CLS ficou abaixo de 0,001 nas medianas. São resultados de laboratório com rede e CPU simuladas, sujeitos a variação; não representam Core Web Vitals de usuários reais. Imagens externas do YouTube continuam sujeitas ao bloqueio do túnel de rede no ambiente de auditoria.

A investigação do processamento encontrou tarefas longas do sandbox Partytown mesmo sem consentimento para Analytics. A integração agora inicia o runtime somente após o aceite, mantendo os arquivos e hooks oficiais, o consentimento salvo e a revogação. Uma comparação em preview Node em 3 de outubro, com três rodadas por página e sem builds concorrentes, eliminou as requisições do sandbox antes do consentimento. A mediana de avaliação de scripts atribuída ao sandbox passou de 356 para 0 ms em Trabalhos e de 328 para 0 ms em Contato. Nesse ambiente, o TBT mediano de Trabalhos passou de 118 para 0 ms; Contato já tinha mediana de 0 ms. O LCP local praticamente não mudou. Esses resultados não devem ser misturados às medições de produção nem usados para declarar resolvidas as metas de desempenho. A conferência em produção continua necessária; atualizações de Partytown devem manter os testes de consentimento como gate, pois o wrapper depende da injeção oficial em `head-inline`.

## Alcance internacional

O objetivo definido por Isaac é **formar parcerias de pesquisa e educação**. Foi preparado um rascunho editorial em inglês com a apresentação de Sobre e os três trabalhos em destaque, com revisão de fidelidade às fontes. Ele ainda não foi publicado e aguarda a revisão da voz por Isaac. Os dados profissionais de Sobre — coordenação no Sesc Nacional, mestrado em andamento na UFRJ e cerca de 80 mil estudantes — foram reconfirmados por Isaac. A adaptação deve partir do texto autoral, preservar opiniões e expressões pessoais e explicar referências brasileiras quando necessário. Não acrescentar experiências, resultados ou credenciais.

Antes de publicar, revisar o sentido e a naturalidade do inglês com Isaac. Preservar as URLs em português, oferecer alternância explícita de idioma e metadados adequados. A tradução completa do site fica condicionada ao retorno desse piloto.

## Prioridades

| Ordem | Próxima ação | Critério de conclusão |
| --- | --- | --- |
| 1 | Continuar a melhoria de LCP e revalidar o processamento em produção | LCP até 2,5 s e TBT até 200 ms em comparação repetível, sem remover conteúdo autoral |
| 2 | Reconfirmar feeds NYT e ChinAI com acesso de rede disponível | XML RSS/Atom com entradas válidas; ajustar cadastro somente se houver evidência de falha |
| 3 | Revisar o rascunho em inglês e definir sua publicação | Voz confirmada por Isaac; depois, navegação entre idiomas e metadados testados |
| 4 | Complementar a avaliação de acessibilidade e experiência real | Percurso de teclado e leitor de tela; Core Web Vitals de campo quando houver dados suficientes |

## Manutenção

Este é o documento único de análise do site. Atualizar o estado e as prioridades no próprio arquivo, removendo itens concluídos da lista de ações. Instruções de instalação e operação ficam no [README](../README.md); mudanças de código seguem PRs curtos com checks aprovados.
