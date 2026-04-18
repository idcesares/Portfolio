# dcesares.dev — Brand Overhaul Playbook
> *Plano operacional pra co-criar com Claude Code o alinhamento entre brand essence e site ao vivo.*
> *Versão 1.0 · Abril 2026 · Isaac D'Césares*

---

## 0. Como usar este documento

Este arquivo é o contrato entre Isaac e Claude Code. Mora no repo de `dcesares.dev`, na raiz. Claude Code deve lê-lo (junto com os arquivos de referência da seção 2) antes de qualquer sessão de trabalho, e marcar tasks como completas conforme entrega.

O playbook tem seis fases. Execução esperada em três meses, mas fases podem rodar em paralelo quando as dependências permitirem (a seção 4 aponta quais).

Se algo aqui conflita com o código existente, o playbook ganha, mas a mudança precisa ser discutida em PR, não aplicada silenciosamente.

---

## 1. Princípios não-negociáveis

Estes quatro princípios são o filtro final antes de qualquer commit.

**Brand test (todo PR de copy ou UI precisa passar):**
1. A peça reflete as três dimensões (Researcher, Educator, Builder) ou pelo menos não contradiz nenhuma?
2. A peça segura os dois registros (humano e digital) simultaneamente, mesmo que um esteja em primeiro plano?
3. A peça é específica o bastante pra que só Isaac pudesse ter assinado?
4. A peça traduz algo, ou só apresenta?

Se alguma resposta é "não" ou "não sei", revisa antes de abrir PR.

**Voice rules (aplicam a todo copy PT-BR do site):**
- Português brasileiro por padrão. Termos técnicos em inglês só quando a literatura usa (LLM, maker space, constructionism).
- Zero travessões longos (—). Usa vírgula, ponto, dois-pontos, parênteses. Varia o ritmo.
- Zero vocabulário-assinatura de LLM: "mergulhar", "desvendar", "navegar pelas complexidades", "no cenário atual", "crucial", "fundamental", "vale ressaltar", "em suma", "é importante notar que".
- Zero LinkedIn-ês: "paixão", "catalisador", "jornada", "game-changer", "revolucionar", "disruptivo".
- Prosa flui mais que bullets. Lista só quando a informação é genuinamente paralela.
- Sem abertura tipo "Com certeza!" ou "Ótima pergunta" (aplica também a respostas do agente durante sessões).
- Sem estrutura "não é X, é Y" repetida. Use só quando o contraste é genuinamente necessário.

**Design rules (aplicam a todo commit de UI ou estilo):**
- Tokens são a única fonte de verdade visual. Nenhum hex, rem ou ms hardcoded fora de `design-tokens.css`.
- Se um token necessário não existe, proponha a adição no PR com justificativa, não adicione silenciosamente.
- Nunca `#FFFFFF` como background, nunca `#000000` como foreground. Use `--color-cream` e `--color-charcoal`.
- Headings são Fraunces (exceto H4 em Instrument Sans). Body é sempre Instrument Sans. Código é sempre JetBrains Mono.
- Distribuição de cor: 60% canvas, 30% neutrals, 10% accents. Terracotta é primária, teal é secundária.

**Escopo (o que está fora):**
- Sem redesign de identidade (logo, paleta, tipografia). O design system já está fechado.
- Sem pivô de stack (Astro fica). Nova dependência só com discussão prévia.
- Sem e-commerce, sem sistema de pagamento, sem área logada.

---

## 2. Arquivos de referência obrigatórios

Antes de qualquer sessão, Claude Code lê (ou revisita) estes arquivos. Eles são o substrato do playbook e não devem ser contraditos.

Na raiz do repo de marca (consultados, não editados neste overhaul):
- `isaac-dcesares-brand-essence-ultimate.md` — fonte primária de voz, posição, persona
- `DESIGN-SYSTEM.md` — sistema de design completo em prosa
- `design-tokens.css` — tokens CSS (fonte de verdade visual)
- `idcesaresbranddesignguide.pdf` — versão consolidada dos dois acima

No repo do site (`dcesares.dev`):
- `src/` — código Astro atual
- `public/` — assets
- `astro.config.mjs` — configuração do Astro

Se algum desses arquivos não existe ou não está acessível numa sessão, Claude Code pergunta antes de inferir.

---

## 3. Convenções de trabalho

**Git:**
- Uma branch por fase: `phase-1-copy`, `phase-2-visual`, etc. Sub-tasks podem virar branches a partir dessas se forem grandes.
- Commits pequenos, um conceito por commit. Mensagem em PT ou EN, curta e descritiva. Sem emoji, sem hype.
- PRs pequenos. Se uma task virou um PR de 800 linhas, provavelmente precisa ser quebrada.

**Fluxo por task:**
1. Claude Code lê a task neste playbook e os arquivos de referência relevantes.
2. Se tem ambiguidade, pergunta ao Isaac antes de escrever código.
3. Executa a task.
4. Valida contra o checklist de DoD (seção 7).
5. Abre PR com descrição clara do que mudou e por quê.
6. Marca a task como `[x]` neste playbook no mesmo PR.

**Quando parar e perguntar:**
- Quando a task exige uma decisão de posicionamento que não está no brand essence.
- Quando um token necessário não existe.
- Quando uma mudança afeta mais páginas do que a task descreve.
- Quando dois arquivos de referência parecem se contradizer.

Silêncio pra decidir sozinho é pior que fricção pra alinhar.

---

## 4. Fases de execução

### Fase 1 — Copy Overhaul
**Prazo alvo:** semanas 1–2
**Paralelismo:** pode rodar em paralelo com Fase 2 se for outra sessão.
**Dependências:** nenhuma.

**Objetivo:** fechar o gap entre o tom documentado no brand essence e o texto que hoje está no site. Hoje o site ainda tem blocos genéricos e Sobre em LinkedIn-ês. Depois dessa fase, qualquer parágrafo público do site passa no brand test.

**Tasks:**

- [ ] **1.1 Auditoria de copy**
  Varrer todas as páginas públicas (`/`, `/about`, `/work`, `/blog`, `/dev`, footer, 404, CTAs). Produzir `docs/copy-audit.md` classificando cada bloco de texto em: `keep` (mantém), `polish` (pequenos ajustes), `rewrite` (refaz do zero). Entregar a tabela pro Isaac revisar antes de reescrever.

- [ ] **1.2 Reescrever a home**
  Remover os blocos "Inovação / Confluência / Liderança" (genéricos, violam brand test). Substituir por uma seção única com *uma* tese em prosa, primeira pessoa, mais três sub-seções que apontam pra artefatos concretos (não abstrações). Sugestão de estrutura: tese → "O que venho pesquisando" / "O que venho construindo" / "O que venho ensinando", cada uma com uma frase de contexto e link pra um trabalho específico. Rascunho volta pro Isaac aprovar antes de virar PR.

- [ ] **1.3 Reescrever o Sobre**
  Substituir a estrutura atual (Perfil / Experiência / Áreas / Visão / Convite) por narrativa em 4 a 5 parágrafos com arco: origem, descoberta, prática atual, porquê. Credenciais ficam numa seção discreta ao final, não abrem a página. Eliminar "paixão", "catalisador", "missão". Rascunho volta pro Isaac aprovar.

- [ ] **1.4 CTAs**
  Auditar todos os CTAs do site. Trocar "Ver projetos" por algo mais específico (sugestão: "Ver meu trabalho" ou "O que venho fazendo"). Trocar "Sobre mim" por algo com mais tração ("Quem sou e como penso"). Padronizar o CTA final "Vamos cocriar?" em todas as páginas.

- [ ] **1.5 Reconciliar números**
  Home diz "2000+ educadores", Sobre diz "1000+ professores", "1700 estudantes", "600.000 acessos". Reconciliar com Isaac, definir quais métricas aparecem onde, eliminar duplicidade. Cada número tem que ter contexto mínimo (de quê programa, em que período).

- [ ] **1.6 Varredura anti-LLM-ês e anti-LinkedIn-ês**
  Fazer grep em todo copy do site pelos termos proibidos (ver seção 1). Produzir lista, revisar caso a caso, substituir. Commit separado, fácil de revisar.

- [ ] **1.7 Metadata e SEO básico**
  Title da home "Isaac D'Césares: Inovação e Tecnologia" é genérico. Reescrever para algo com a proposição de valor. Revisar `<meta description>` de cada página. Adicionar Open Graph images consistentes com design system (terracotta/cream, wordmark visível).

**Entrega da fase:** todas as páginas públicas passam no brand test, zero vocabulário proibido, números coerentes, metadata decente.

---

### Fase 2 — Visual Coherence
**Prazo alvo:** semanas 2–3
**Paralelismo:** pode rodar em paralelo com Fase 1.
**Dependências:** `design-tokens.css` precisa estar acessível no repo do site.

**Objetivo:** fazer o site expressar visualmente o que o design system promete. Hoje, pelo que o HTML deixa ver, o site está mais neutro do que o sistema documentado. Depois dessa fase, terracotta, teal, Fraunces e a lógica de registros estão visíveis e consistentes.

**Tasks:**

- [ ] **2.1 Importar design-tokens.css**
  Se ainda não está importado globalmente no layout base do Astro, importar. Verificar que `:root` e `[data-theme="dark"]` estão disponíveis em toda página.

- [ ] **2.2 Auditoria de valores hardcoded**
  Grep em `src/` por hex colors, rem sizes, ms durations. Produzir `docs/hardcoded-values-audit.md`. Substituir um por um por `var(--token)`. Se um valor não tem token correspondente, parar e discutir (não inventar token sem aprovação).

- [ ] **2.3 Hero redesign**
  Implementar o hero da home conforme DESIGN-SYSTEM.md §11.1: título em Fraunces display com WONK=1, foto com `--photo-warmth`, CTA primário em terracotta, CTA secundário em teal outline. Aplicar `--gradient-warmth` como glow ambiente.

- [ ] **2.4 Tipografia full-pass**
  Verificar que todos `h1-h3` usam Fraunces, H4 usa Instrument Sans, body usa Instrument Sans. Ativar WONK=1 em `--text-display` e `--text-h1`. Configurar letter-spacing e line-height conforme tokens `--tracking-*` e `--leading-*`. Verificar que max-width de corpo de texto é 65ch em páginas de leitura longa.

- [ ] **2.5 Lógica de cor humano/digital nas tags**
  Nas páginas de listagem (/blog, /work), aplicar cor de tag baseada em categoria: temas humanos (educação, pedagogia, construcionismo, ética) em terracotta a 10%, temas digitais (IA, blockchain, código, sistemas) em teal a 10%, híbridos em amber a 10%. Produzir mapa de categoria → cor em `src/data/category-colors.ts` ou equivalente.

- [ ] **2.6 Dark mode full-pass**
  Testar cada página em light e dark. Corrigir contrastes, verificar que accents lightened (terracotta → `#D4724F`, teal → `#3AAFA8`) são usados em dark mode. Fotos ganham `brightness(0.92)` em dark mode conforme especificação.

- [ ] **2.7 Focus states e acessibilidade**
  Garantir que todo elemento interativo tem focus visível (`2px solid var(--color-teal)`, offset 2px). Validar touch targets mínimo 44x44px. Rodar axe ou pa11y em cada página, zerar violações.

- [ ] **2.8 Footer redesign**
  Footer atual é pobre ("Desenvolvido por @idcesares usando Astro"). Expandir pra: links de navegação secundários, redes (GitHub, LinkedIn, Lattes?), signup de newsletter (placeholder até Fase 5), crédito técnico discreto. Tipografia e cor conforme design system.

- [ ] **2.9 Monograma e wordmark**
  Implementar o monograma `dc` (d terracotta, c teal) como logo do site, tanto no header quanto como favicon. Gerar favicons em múltiplos tamanhos. Wordmark completo no footer.

**Entrega da fase:** zero hex hardcoded, dark mode funcional em toda página, acessibilidade AA verificada, hero expressa o brand system.

---

### Fase 3 — Arquitetura de Conteúdo
**Prazo alvo:** semana 3–4
**Paralelismo:** depende da Fase 1 estar 80% pronta (copy estabilizado).
**Dependências:** Fase 1.

**Objetivo:** clarificar a taxonomia do site e preparar o chão pra Fase 4 (ensaio-pilar). Hoje Blog, Trabalhos e Dev compartilham espaço sem lógica clara pro visitante.

**Tasks:**

- [ ] **3.1 Desambiguar taxonomia**
  Definir com Isaac o que é cada seção:
  - **Trabalhos:** registros de entregas (palestras, podcasts, projetos executados).
  - **Blog:** posts técnicos curtos a médios, guias, tutoriais, comentários sobre tema do momento.
  - **Ensaios** (novo): peças longas, opinativas, com tese. Gênero novo.
  - **Dev:** a definir, talvez fundir com GitHub linkado ou virar um showcase de repos.
  Produzir `docs/content-taxonomy.md` com a definição.

- [ ] **3.2 Criar content collection "ensaios" no Astro**
  Schema em `src/content/config.ts` com campos: title, subtitle, abstract, publishedAt, updatedAt, tags, coverImage, readTime, status (draft/published), lang (pt/en). Layout específico `src/layouts/EssayLayout.astro` com tipografia longform: `--container-sm`, Fraunces nos headings, Instrument Sans body em `--text-body-lg`, line-height `1.6+`, drop cap opcional na primeira letra.

- [ ] **3.3 Home destaca ensaio-pilar**
  Adicionar seção "O que estou pensando" na home, acima ou abaixo da tese, que puxa o ensaio mais recente com status published. Se não há ensaio publicado ainda, seção fica oculta (não mostra placeholder).

- [ ] **3.4 Review de menu e IA**
  Reestruturar menu se necessário depois de 3.1. Provavelmente: Home / Ensaios / Trabalhos / Blog / Sobre / Contato. "Dev" vira link externo pro GitHub ou some.

- [ ] **3.5 Tags coerentes**
  Consolidar tags em todas collections. Hoje `/work` tem filtro por categorias longas ("Análise Exploratória", "Aprendizagem Criativa", etc.). Normalizar, evitar duplicatas (ex: "IA" vs "Inteligência Artificial"). Produzir `src/data/tags.ts` como fonte única.

**Entrega da fase:** taxonomia clara, collection de ensaios pronta pra receber conteúdo, home preparada pra destacar ensaio.

---

### Fase 4 — Ensaio-pilar
**Prazo alvo:** fim do mês 1
**Paralelismo:** escrita é do Isaac, Claude Code apoia.
**Dependências:** Fase 3.

**Objetivo:** publicar o primeiro ensaio de autoridade. Esse é o ativo mais importante que o site não tem hoje. Depois dele, a natureza do site muda: deixa de ser portfólio e vira também sede do pensamento.

Essa fase é mais conteúdo do que código, mas Claude Code contribui em:

- [ ] **4.1 Setup de template e workflow**
  Criar `/src/content/ensaios/TEMPLATE.md` com frontmatter preenchido e estrutura sugerida (abertura, 3–5 seções, fechamento). Criar script `npm run new-essay` que copia o template com slug.

- [ ] **4.2 Crítica do rascunho**
  Quando Isaac trouxer o primeiro rascunho, Claude Code atua como editor: aponta passagens que caem no brand test, sugere cortes, identifica frases LLM-ês. Não reescreve sem pedido. Trabalho colaborativo.

- [ ] **4.3 Produção final**
  Imagem de capa consistente com design system (terracotta/teal/cream), typography pass, metadata social, link interno da home.

Tópicos que o Isaac topou considerar (ver relatório de diagnóstico):
- Construcionismo na era dos LLMs
- Educação pública brasileira e MIT Media Lab
- IA na educação: a tese do meio
- LearnChain revisitado

**Entrega da fase:** um ensaio publicado, linkado da home, com tese original.

---

### Fase 5 — Growth Infrastructure
**Prazo alvo:** mês 2
**Paralelismo:** algumas tasks podem rodar em paralelo com Fase 4.
**Dependências:** Fase 2 (visual consistente), Fase 3 (taxonomia clara).

**Objetivo:** transformar visitante único em audiência recorrente. Hoje quem entra e gosta não tem jeito fácil de voltar passivamente.

**Tasks:**

- [ ] **5.1 Newsletter: decisão de plataforma**
  Avaliar opções (Buttondown, Beehiiv, Substack Custom Domain, ConvertKit). Recomendação inicial: Buttondown (simples, bom com domínio próprio, API decente). Decisão sai em `docs/newsletter-decision.md`.

- [ ] **5.2 Newsletter: integração**
  Form no footer e em páginas chave (fim de ensaio, Sobre). Página `/newsletter` com amostra do que virá e botão de subscribe. Design consistente com sistema.

- [ ] **5.3 Página /now**
  Curta, em prosa, atualizada a cada 2–3 meses. Estrutura: "O que estou pesquisando", "O que estou lendo", "O que estou construindo", "Onde estou no mundo". Linkar no footer e, discretamente, no menu.

- [ ] **5.4 Prova social**
  Faixa discreta na home (abaixo do hero ou antes do CTA final) com logos de instituições (Sesc, UFRJ, Stanford, Google for Education, Microsoft). Sem pose, em escala de cinza ou cor única. Opcionalmente, 2–3 citações curtas de colegas/educadores com quem trabalhou (com permissão).

- [ ] **5.5 RSS e Atom feeds**
  Feeds válidos pra blog e ensaios. Link visível no footer.

- [ ] **5.6 Analytics leve e privado**
  Plausible ou Fathom, sem cookies, sem GA. Setup e página `/privacidade` explicando.

**Entrega da fase:** infraestrutura de retenção funcionando, prova social ancorada, site pronto pra crescer audiência.

---

### Fase 6 — Versão Inglês
**Prazo alvo:** mês 3
**Paralelismo:** não.
**Dependências:** Fases 1 e 4 concluídas (precisa ter copy e ensaio estáveis antes de traduzir).

**Objetivo:** abrir o site pra audiência internacional sem traduzir tudo. Foco em: home, Sobre, e ensaio-pilar.

**Tasks:**

- [ ] **6.1 Estratégia de i18n**
  Decidir entre i18n nativo do Astro (recomendado, gera rotas `/en/...` com fallback) vs landing simples `/en`. Recomendação inicial: Astro i18n. Documentar em `docs/i18n-strategy.md`.

- [ ] **6.2 Language switcher**
  Componente no header. Persiste preferência via cookie. `hreflang` tags corretas no `<head>`.

- [ ] **6.3 Traduzir home, Sobre e ensaio-pilar**
  Tradução não é transcrição. O Sobre em inglês pode ter estrutura ligeiramente diferente pra público acadêmico internacional. Isaac revisa cada tradução antes do merge.

- [ ] **6.4 OG images em duas línguas**
  Gerar OG images separadas pra rotas EN quando o título diferir.

**Entrega da fase:** landing bilíngue funcional, navegação fluida entre línguas, SEO respeitado.

---

## 5. Como operar com Claude Code

**Início de sessão:**
Isaac inicia com algo como: *"Vamos rodar a task 2.3 hoje. Lê o playbook, os arquivos da seção 2, e começa."*

Claude Code responde com um plano curto (3–5 linhas) do que vai fazer antes de tocar em arquivo. Isaac confirma ou ajusta.

**Durante a sessão:**
- Perguntas vêm primeiro, código depois.
- Uma task por vez. Se descobrir que a task depende de outra não feita, parar e discutir.
- Se o escopo crescer além da task, pausar e perguntar se abre task nova ou expande a atual.

**Fim de sessão:**
Claude Code:
1. Lista o que foi feito.
2. Marca as tasks como `[x]` no playbook.
3. Abre PR com descrição clara.
4. Aponta o que ficou pendente ou apareceu como descoberta.

**Sugestão de CLAUDE.md no repo do site:**
Criar `CLAUDE.md` na raiz com:
- Link pro playbook
- Resumo das voice rules e design rules
- Comando padrão de dev e build
- Estrutura de diretórios
- Quem consultar em caso de decisão de produto (Isaac)

---

## 6. Anti-patterns

O que Claude Code não deve fazer neste projeto:

- Adicionar bibliotecas JS sem discutir. O site é Astro com pouco JS, queremos manter assim.
- Criar componentes genéricos (`<Card>`, `<Button>`) sem antes verificar se já existem e se o novo tem razão de ser.
- Inventar tokens novos. Se faltar algo, propor no PR.
- Usar travessão longo em copy PT-BR.
- Escrever "é importante destacar", "crucial", "fundamental", "no cenário atual".
- Adicionar animações sem propósito declarado. Motion existe pra comunicar estado ou relação, não pra decorar.
- Rodar `npm run build` ou deploy automaticamente. Deploy é decisão do Isaac.
- Mudar a paleta, o logotipo, a tipografia. Isso é decisão de marca, não de desenvolvimento.
- Gerar conteúdo (posts, ensaios) sem Isaac. Claude Code edita, critica, formata, mas não substitui a voz.

---

## 7. Definition of Done (checklist por PR)

Todo PR precisa passar nesses itens antes de merge.

**Copy (quando aplicável):**
- [ ] Passa no brand test (4 perguntas da seção 1).
- [ ] Zero vocabulário proibido (grep limpo).
- [ ] Zero travessões longos em PT-BR.
- [ ] Números consistentes com outras páginas.
- [ ] Revisado pelo Isaac.

**Visual (quando aplicável):**
- [ ] Zero hex, rem, ms hardcoded fora de `design-tokens.css`.
- [ ] Dark mode testado manualmente.
- [ ] Contraste WCAG AA validado (body e large text).
- [ ] Responsivo em 375px (mobile) e 1200px+ (desktop).
- [ ] Focus states visíveis em todos interativos.

**Sempre:**
- [ ] `npm run build` passa sem warning.
- [ ] Sem erros no console do browser.
- [ ] Commit message clara, uma ideia por commit.
- [ ] Task marcada como `[x]` no playbook.
- [ ] PR tem descrição com o "o que" e o "porquê".

---

## 8. Métricas de sucesso

Essas são as perguntas que respondem "deu certo?" três meses adiante.

**Quantitativas:**
- Tempo médio em página > 2 minutos na home e no ensaio-pilar.
- Bounce rate da home abaixo de 60%.
- Pelo menos 200 inscritos na newsletter.
- Pelo menos 3 ensaios publicados.
- Versão EN recebendo pelo menos 15% do tráfego total.

**Qualitativas (mais importantes):**
- O Sobre, lido em voz alta, soa como Isaac falando. Não soa como LinkedIn.
- Um visitante que nunca ouviu falar do Isaac sai sabendo: quem ele é, o que pensa sobre algo específico, como voltar.
- Um recrutador acadêmico internacional consegue navegar o site em inglês e chegar no ensaio-pilar sem atrito.
- Um educador brasileiro encontra um guia prático (blog) e um pensamento de fundo (ensaio) na mesma sessão.
- O site parece feito pelo Isaac. Não parece template.

---

## 9. Log de alterações

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0 | 2026-04-18 | Documento inicial |

Claude Code pode atualizar esse log quando mudar o playbook via PR.

---

*Este playbook é vivo. Revisa ao final de cada fase, ajusta a partir do que foi aprendido. O objetivo não é seguir o plano ao pé da letra, é usar o plano pra ganhar coerência entre a marca documentada e a marca executada. Se no caminho o plano precisar mudar, muda.*

*Vamos cocriar.*
