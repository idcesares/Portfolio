# Copy Audit, Fase 1 Task 1.1

> Varredura de todo o copy público do site `dcesares.dev`. Cada bloco recebe uma classificação:
> `keep` (mantém como está), `polish` (ajustes pequenos de tom ou palavra), `rewrite` (refaz do zero).
>
> Escopo: site chrome (páginas públicas, componentes, layout, metadata). Posts individuais de `/blog` e `/work` ficam fora desta auditoria, são conteúdo curado com voz própria e serão tratados em passes separados.
>
> Data: 2026-04-18. Branch: `phase-1-copy`. Referências: `dcesares-brand-overhaul-playbook.md` §4 Fase 1, `design-system/BRAND-VOICE.md`.

---

## Resumo executivo

- **57 blocos auditados** em 7 páginas públicas, 5 componentes com copy e 1 arquivo de constantes SEO.
- **Keep:** 8 blocos. São labels de navegação e títulos estruturais já enxutos.
- **Polish:** 19 blocos. Ajustes de tom, especificidade ou troca de palavra.
- **Rewrite:** 30 blocos. Inclui Skills (Inovação/Confluência/Liderança), todos os três cards do Sobre, hero da home, metadata global, stats-grid, CTAs, 404, deals.
- **Violações de voice rules em site chrome:** 3 (1 "imperdíveis" em `deals.astro`, 1 em-dash em meta description de `dev.astro`, 1 em-dash em 404 EN).
- **Números inconsistentes:** 4 pontos (educadores, professores, estudantes, acessos). Seção dedicada abaixo com os canônicos do Isaac.
- **Questões abertas para o Isaac:** 7. Listadas no final.

---

## Classificação por página

### `/` (src/pages/index.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Hero title | `index.astro:44` | `Isaac D'Césares` | `keep` | Nome próprio. |
| Hero tagline | `index.astro:45` | `Traduzo tecnologias emergentes em experiências que transformam como pessoas e instituições aprendem.` | `polish` | Boa tese, mas "experiências" soa abstrato. Sugestão: substituir por artefato concreto ou testar variante mais curta. |
| Role pill 1 | `index.astro:48` | `Pesquisador` | `keep` | Uma das três dimensões do brand. |
| Role pill 2 | `index.astro:49` | `Educador` | `keep` | Uma das três dimensões. |
| Role pill 3 | `index.astro:50` | `Construtor` | `keep` | Uma das três dimensões. |
| CTA primário home | `index.astro:55` | `Ver projetos` | `rewrite` | Genérico, não indica o que há do outro lado. Playbook Task 1.4. |
| CTA secundário home | `index.astro:58` | `Sobre mim` | `rewrite` | Sem tração. Playbook Task 1.4. |
| Bloco Skills/Inovação | `Skills.astro:7-10` | `Inovação / Expertise em integrar soluções tecnológicas avançadas…` | `rewrite` | Playbook §4 Fase 1 Task 1.2 pede remoção dos três blocos Inovação/Confluência/Liderança. São genéricos, violam o brand test (qualquer consultor poderia assinar). |
| Bloco Skills/Confluência | `Skills.astro:11-14` | `Confluência / Competência em unir tecnologias digitais com a cognição humana…` | `rewrite` | Mesma razão. |
| Bloco Skills/Liderança | `Skills.astro:15-18` | `Liderança / Abordagem de liderança que equilibra inovação tecnológica com ética…` | `rewrite` | Mesma razão. Soa a descrição de cargo. |
| Header "Últimas postagens" | `index.astro:82-83` | `Últimas postagens / Leia alguns dos meus artigos mais recentes sobre tecnologia, educação e desenvolvimento.` | `polish` | Label ok, sub-texto genérico. Sugerir algo mais específico ("O que estou publicando agora", "Escrita recente"). |
| CTA blog home | `index.astro:100` | `Ver todas` | `polish` | Funciona mas pode ganhar verbo com intenção ("Ler o blog", "Ver todos os posts"). |
| Header "Últimos trabalhos" | `index.astro:110-111` | `Últimos trabalhos / Veja alguns dos meus mais recentes trabalhos e publicações.` | `polish` | Repetição "trabalhos … trabalhos". Sub-texto genérico. |
| CTA work home | `index.astro:128` | `Ver todos` | `polish` | Idem. |
| Header "Impacto e Alcance" | `index.astro:138-139` | `Impacto e Alcance / Alguns números que demonstram o impacto do meu trabalho em tecnologia educacional.` | `rewrite` | "Impacto e Alcance" é palavra de deck corporativo. Sub-texto tem "demonstram o impacto" (tautologia com o título). Depende da decisão sobre manter ou não o stats-grid (ver Questões Abertas). |
| Stat 1 | `index.astro:144-145` | `2000+ / Educadores Impactados` | `polish` | Número canônico. "Impactados" é palavra fraca; considerar "formados" ou "educadores em formações diretas". |
| Stat 2 | `index.astro:147-149` | `50+ / Projetos Desenvolvidos` | `rewrite` | Número incorreto. Canônico do Isaac: **20+ projetos em produção**. Também "Desenvolvidos" é vago; "em produção" ou "entregues" é mais forte. |
| Stat 3 | `index.astro:151-153` | `10+ / Instituições Parceiras` | `polish` | Precisa verificação. Sem lista de referência. Ver Questões Abertas. |
| Stat 4 | `index.astro:155-157` | `10+ / Anos de Experiência` | `rewrite` | "Anos de experiência" é linha de currículo. Substituir por métrica do Isaac ("1,2 milhão de acessos em plataformas" ou "5000+ estudantes") ou remover. |

### `/about` (src/pages/about.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Meta description | `about.astro:15` | `Isaac D'Césares traduz tecnologias emergentes em experiências educacionais transformadoras. Pesquisador, educador e construtor.` | `polish` | Ok, mas "experiências educacionais transformadoras" é levemente LinkedIn-ish. |
| Hero title | `about.astro:21` | `Sobre` | `keep` | Label. |
| Hero tagline | `about.astro:22` | `Na membrana entre o humano e o digital: pesquiso, ensino e construo tecnologias que transformam a forma como aprendemos.` | `polish` | Forte. Polish opcional: "transformam a forma como aprendemos" pode virar algo mais concreto. |
| Seção "Quem sou", título | `about.astro:33` | `Quem sou` | `rewrite` | Playbook Task 1.3 pede trocar a estrutura Perfil/Experiência/Áreas/Visão/Convite por narrativa em 4–5 parágrafos com arco (origem, descoberta, prática, porquê). Os títulos de seção somem na reestruturação. |
| Seção "Quem sou", parágrafo 1 | `about.astro:35` | `Trabalho no ponto de confluência entre tecnologia avançada e educação transformadora…` | `rewrite` | Tem ideia certa, mas usa "não é X, nem Y" repetido. Playbook §1 voice rules pede evitar essa estrutura. Reescrever dentro do novo arco narrativo. |
| Seção "Quem sou", parágrafo 2 | `about.astro:36` | `Atualmente, coordeno a área de Tecnologia Educacional no Sesc Nacional…` | `polish` | Credenciais com contexto. Mantém essência mas realocar: playbook Task 1.3 pede credenciais ao final, não abrindo. |
| Seção "O que construo", título | `about.astro:41` | `O que construo` | `rewrite` | Vai sumir na reestruturação. |
| Seção "O que construo", intro | `about.astro:43` | `Meu trabalho atravessa três dimensões que não se separam:` | `rewrite` | Didatismo. A nova narrativa não precisa anunciar a estrutura. |
| Seção "O que construo", Pesquisa | `about.astro:44` | `Pesquisa. Investigo como tecnologias emergentes…` | `polish` | Bom conteúdo, vira parágrafo corrido no novo arco. |
| Seção "O que construo", Educação | `about.astro:45` | `Educação. Formei mais de 1000 professores… 1700 estudantes… 600 mil acessos.` | `rewrite` | Números desatualizados (ver seção Números). Também "Minha maior satisfação é ver alguém entender algo que antes não conseguia" é bom mas precisa integrar ao novo arco. |
| Seção "O que construo", Construção | `about.astro:46` | `Construção. Ideias viram ferramentas, ferramentas viram sistemas…` | `polish` | Boa escrita. Fica, adaptada ao novo arco. |
| Seção "Vamos construir juntos", título | `about.astro:51` | `Vamos construir juntos` | `rewrite` | Playbook define CTA assinatura único: "Vamos cocriar?". E o título "construir juntos" duplica a ContactCTA abaixo. Sumir no novo arco. |
| Parágrafo "Acredito que…" | `about.astro:53` | `Acredito que tecnologia é ferramenta de empoderamento, não de controle. Que a realidade do Brasil é diferente do Vale do Silício…` | `polish` | Conteúdo forte, específico, só Isaac assinaria. "Não é X, é Y" presente. Manter a substância, reescrever a forma. |
| Parágrafo final "Se você trabalha…" | `about.astro:54` | `Se você trabalha com educação, tecnologia ou transformação institucional…` | `polish` | Convite ok. "Não tenho todas as respostas, mas gosto de descobrir junto" é bom, muito Isaac. |

### `/work` (src/pages/work.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Page title | `work.astro:23` | `Trabalho \| Isaac D'Césares` | `keep` | SEO padrão. |
| Meta description | `work.astro:24` | `Conheça os projetos mais recentes de Isaac D'Césares` | `polish` | Genérico, sem proposição de valor. |
| Hero title | `work.astro:29` | `Meus trabalhos` | `polish` | Playbook Task 3.1 vai desambiguar taxonomia (Trabalhos = entregas). Título pode ficar mais preciso ("Entregas", "O que já entreguei"). Fica para quando taxonomia fechar, ajuste pequeno agora. |
| Hero tagline | `work.astro:30` | `Veja abaixo meus projetos mais recentes para ter uma ideia da minha linha de trabalho e experiência.` | `rewrite` | Modo manual de instrução ("veja abaixo"), tautologia ("linha de trabalho e experiência"). |

### `/blog` (src/pages/blog.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Page title | `blog.astro:23` | `Blog \| Isaac D'Césares` | `keep` | SEO padrão. |
| Meta description | `blog.astro:24` | `Conheça as postagens mais recentes de Isaac D'Césares` | `polish` | Genérico. |
| Hero title | `blog.astro:29` | `Blog` | `keep` | Label conciso. |
| Hero tagline | `blog.astro:30` | `Veja abaixo minhas postagens mais recentes!` | `rewrite` | Instrucional, ponto de exclamação vendedor. Sem tese sobre o que é o blog. |

### `/dev` (src/pages/dev.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Page title | `dev.astro:21` | `Dev \| Isaac D'Césares` | `polish` | Playbook Task 3.1 pode fundir ou redefinir "Dev". Depende da taxonomia. |
| Meta description | `dev.astro:22` | `Projetos de desenvolvimento de Isaac D'Césares — código, design systems e ferramentas construídas com propósito.` | `rewrite` | Em-dash em PT-BR viola voice rule. Troca por vírgula ou ponto. |
| Hero title | `dev.astro:27` | `Dev` | `polish` | Depende da decisão da taxonomia (playbook Task 3.1). |
| Hero tagline | `dev.astro:28` | `Código que resolve problemas reais. Programação criativa para um mundo digital em constante evolução.` | `rewrite` | "Um mundo digital em constante evolução" é clichê. |
| Pills | `dev.astro:32-34` | `Full Stack / Open Source / Deploy` | `keep` | Labels técnicos. |
| Section label "Destaque" | `dev.astro:42` | `Destaque` | `keep` | Label. |
| Section label "Projetos" | `dev.astro:55` | `Projetos` | `keep` | Label. |
| Section label "Tecnologias" | `dev.astro:69` | `Tecnologias` | `keep` | Label. |
| Tech intro | `dev.astro:73` | `Ferramentas e frameworks que uso para transformar ideias em código que funciona.` | `polish` | "Transformar ideias em código" é mild LinkedIn-ish mas passa. |

### `/deals` (src/pages/deals.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Page title | `deals.astro:31` | `Ofertas e Cupons \| Isaac D'Césares` | `keep` | Label. |
| Meta description | `deals.astro:31` | `Explore ofertas exclusivas, cupons de desconto e códigos de indicação para aproveitar o melhor das ferramentas digitais e plataformas inovadoras.` | `polish` | "Plataformas inovadoras" é LinkedIn-ish. |
| Hero title | `deals.astro:35` | `Ofertas e Cupons` | `keep` | Label. |
| Hero tagline | `deals.astro:36` | `Descubra vantagens imperdíveis e aproveite o melhor das plataformas tecnológicas!` | `rewrite` | "Imperdíveis" é vocabulário proibido. "Aproveite o melhor" é vago. |
| Deal 1 título | `deals.astro:11` | `Desconto Exclusivo no Perplexity Pro` | `keep` | Acionável. |
| Deal 1 descrição | `deals.astro:12` | `Garanta benefícios incríveis ao se inscrever…` | `polish` | "Benefícios incríveis" é frouxo. |
| Deal 2 título | `deals.astro:15` | `Cadastro VIP no Beacons` | `polish` | "VIP" é palavra de marketing. |
| Deal 2 descrição | `deals.astro:16` | `Crie sua página personalizada e alcance seu público…` | `polish` | "Desbloqueie recursos premium" é genérico. |
| Deal 3 título | `deals.astro:20` | `Junte-se ao You.com` | `keep` | Direto. |
| Deal 3 descrição | `deals.astro:21` | `Descubra o You.com e explore uma gama de modelos e agentes de IA…` | `polish` | "Recursos diferenciados" é vago. |
| Deal 4 título | `deals.astro:25` | `Convite Exclusivo para o Lovable` | `polish` | "Exclusivo" repetido entre deals. |
| Deal 4 descrição | `deals.astro:26` | `Participe do Lovable, a plataforma inovadora…` | `polish` | "Inovadora". |

**Observação:** a página `/deals` não é referenciada no menu principal, só no footer. Fora do escopo central do playbook mas incluída por completude.

### `/404` (src/pages/404.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Page title | `404.astro:8` | `Not Found` | `rewrite` | EN. Site é PT-BR. |
| Meta description | `404.astro:8` | `404 Error — this page was not found` | `rewrite` | EN, em-dash. Reescrever em PT-BR. |
| Hero title | `404.astro:9` | `404: Page Not Found` | `rewrite` | EN. |
| Hero tagline | `404.astro:9` | `Geek alert: this page slipped into a black hole!` | `rewrite` | EN, piada importada. Isaac é PT-BR; piada pode até ficar mas precisa soar como ele. |
| Texto | `404.astro:11` | `Did you mistype the URL, or did a glitch in the Matrix strike again?` | `rewrite` | EN. |
| Link | `404.astro:11` | `Take me home 🏠` | `rewrite` | EN. |

### Footer (src/components/Footer.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Crédito técnico | `Footer.astro:18` | `Desenvolvido por @idcesares usando Astro` | `polish` | Playbook Task 2.8 pede expandir footer. Crédito técnico pode ficar, mas mais discreto. |
| Copyright | `Footer.astro:21` | `© {currentYear} Isaac D'Césares` | `keep` | Padrão. |
| Link Ofertas | `Footer.astro:24` | `Ofertas` | `keep` | Label. |
| Social icons | `Footer.astro:8-11` | labels LinkedIn, Twitter, GitHub, YouTube | `keep` | Labels acessíveis. |

### Nav (src/components/Nav.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Menu item Home | `Nav.astro:8` | `Home` | `polish` | "Home" é aceitável, mas PT-BR puro pediria "Início". Decisão estilística. |
| Menu item Trabalhos | `Nav.astro:9` | `Trabalhos` | `polish` | Depende da taxonomia (playbook Task 3.1). |
| Menu item Blog | `Nav.astro:10` | `Blog` | `keep` | Termo consagrado. |
| Menu item Dev | `Nav.astro:11` | `Dev` | `polish` | Depende da decisão em Task 3.1 (playbook sugere fundir com GitHub ou remover). |
| Menu item Sobre | `Nav.astro:12` | `Sobre` | `keep` | Label. |
| Label busca | `Nav.astro:99` | `Busca` | `keep` | Label. |
| Placeholder busca | `Nav.astro:104` | `Pesquise posts e projetos...` | `keep` | Acionável. |

### ContactCTA (src/components/ContactCTA.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Título | `ContactCTA.astro:7` | `Vamos cocriar soluções humanas e tecnológicas?` | `polish` | Boa. "Soluções humanas e tecnológicas" é levemente genérico. Playbook menciona "Vamos cocriar?" como assinatura pura. Decisão: manter com qualificador (atual) ou enxugar para assinatura limpa. |
| CTA botão | `ContactCTA.astro:10` | `Fale comigo` | `keep` | Direto. |

### FilterBar (src/components/FilterBar.astro)

| Bloco | Localização | Texto atual | Classificação | Justificativa |
|---|---|---|---|---|
| Placeholder busca blog | `FilterBar.astro:35` | `Buscar posts...` | `keep` | Acionável. |
| Placeholder busca work | `FilterBar.astro:35` | `Buscar projetos...` | `keep` | Acionável. |
| Sort "Mais recentes" | `FilterBar.astro:19` | `Mais recentes` | `keep` | Label. |
| Sort "Mais antigos" | `FilterBar.astro:20` | `Mais antigos` | `keep` | Label. |
| Sort "Alfabética (A-Z)" | `FilterBar.astro:21` | `Alfabética (A-Z)` | `keep` | Label. |
| Label categoria | `FilterBar.astro:64` | `Categoria:` | `keep` | Label. |
| Option padrão | `FilterBar.astro:66` | `Todas as categorias` | `keep` | Label. |
| Botão reset | `FilterBar.astro:75` | `Limpar filtros` | `keep` | Label. |
| Results count | `FilterBar.astro:83, 464-467` | `Mostrando todos os resultados` / `N posts` / `N de M projetos` | `keep` | Labels sistêmicos. |
| Botão filtros avançados | `FilterBar.astro:52` | `Filtros avançados` (title attr) | `keep` | Label. |

### Constantes SEO globais (src/utils/seo.ts)

| Constante | Texto atual | Classificação | Justificativa |
|---|---|---|---|
| `SITE_TITLE` | `Isaac D'Césares: Inovação e Tecnologia` | `rewrite` | Playbook Task 1.7 explicitamente flaga como genérico. Precisa expressar a proposição de valor (tradução entre educação e tecnologia avançada, membrana humano/digital). |
| `SITE_DESCRIPTION` | `Transformando a interseção entre Tecnologia e Educação através de soluções éticas e inovadoras.` | `rewrite` | "Através de soluções éticas e inovadoras" é LinkedIn-ish puro. |
| `AUTHOR_JOB_TITLE` | `Coordenador de Tecnologia Educacional` | `keep` | Factual, cargo real. |
| `AUTHOR_ORG` | `Sesc Nacional` | `keep` | Factual. |
| RSS title | `MainHead.astro:90` | `Isaac D'Césares: Inovação e Tecnologia` | `rewrite` | Herda do SITE_TITLE. Atualizar junto. |

---

## Reconciliação de números

Canônicos passados pelo Isaac nesta sessão:

| Métrica | Número canônico |
|---|---|
| Educadores formados | **2000+** |
| Estudantes alcançados | **5000+** |
| Acessos às plataformas construídas | **1,2 milhão** |
| Projetos em produção | **20+** |

Onde aparecem hoje e o que precisa mudar:

| Localização | Texto atual | Ação |
|---|---|---|
| `index.astro:144-145` | `2000+ Educadores Impactados` | Manter número, trocar label: `Educadores Formados` (ou "Educadores em formações diretas"). |
| `index.astro:147-149` | `50+ Projetos Desenvolvidos` | Corrigir para `20+`. Label: `Projetos em Produção`. |
| `index.astro:151-153` | `10+ Instituições Parceiras` | **Ver Questão Aberta 4.** Sem confirmação, removo ou substituo. |
| `index.astro:155-157` | `10+ Anos de Experiência` | Substituir por `1,2M Acessos às Plataformas` ou `5000+ Estudantes Alcançados`. **Ver Questão Aberta 5.** |
| `about.astro:45` | `mais de 1000 professores` | Atualizar para `mais de 2000 educadores` (alinhando com canônico). |
| `about.astro:45` | `1700 estudantes` | Atualizar para `mais de 5000 estudantes`. |
| `about.astro:45` | `mais de 600 mil acessos` | Atualizar para `1,2 milhão de acessos`. |

**Regra de contexto (playbook Task 1.5):** cada número precisa ter contexto mínimo (de qual programa, em que período). Isso ainda não existe no site. Ao reescrever o Sobre (Task 1.3) e a home (Task 1.2), adicionar contexto inline. Exemplo: "…formei mais de 2000 educadores em programas de tecnologia educacional pelo Sesc entre 2019 e 2025…".

---

## Varredura anti-LLM-ês e anti-LinkedIn-ês

### Site chrome (escopo da Task 1.1)

| Arquivo | Linha | Termo | Contexto | Ação |
|---|---|---|---|---|
| `src/pages/deals.astro` | 36 | `imperdíveis` | Hero tagline | Trocar ao reescrever tagline (já marcada `rewrite`). |
| `src/pages/dev.astro` | 22 | em-dash `—` | Meta description em PT-BR | Trocar por vírgula ou ponto. |
| `src/pages/404.astro` | 8 | em-dash `—` | Meta description (em EN) | Reescrever a página em PT-BR. |
| `src/components/FloatingButton.astro` | 17 | em-dash | Dentro de comentário CSS | **Keep** — comentário de código, não copy público. |

Site chrome está quase limpo. A maioria dos problemas de copy ali não é vocabulário proibido, é genérico e sem voz.

### Content collections (fora do escopo da Task 1.1, catalogar para tasks futuras)

Encontradas 20+ ocorrências em posts de `/blog` e `/work` (termos: "jornada", "revolucionar/revoluciona", "disruptivo", "é crucial", "é fundamental", "reveladora", "verdadeiramente revolucionárias", "mergulhar", "imperdí", "paixão"). Lista completa via grep no comando `(?i)mergulhar|desvendar|navegar pelas complexidades|no cenário atual|é crucial|é fundamental|vale ressaltar|em suma|é importante (notar|destacar)|paixão|catalisador|jornada|game.?changer|disrupt|revolucion|imperdí` em `src/content/`.

**Recomendação:** criar task dedicada na Fase 1 Task 1.6 para varredura de posts, ou abordar caso a caso conforme Isaac revisitar cada post. Não é item desta auditoria.

---

## Questões abertas para o Isaac

Preciso da decisão em cada uma antes de partir para a Task 1.2 (reescrita da home) e Task 1.3 (reescrita do Sobre).

1. **Stats-grid na home.** O playbook não pede explicitamente para remover, mas o bloco "Impacto e Alcance" é a seção que mais soa a LinkedIn. Quer:
   (a) manter com 4 stats corrigidos e labels mais fortes,
   (b) reduzir para 3 stats ancorados nos canônicos (2000+ educadores, 5000+ estudantes, 1,2M acessos),
   (c) remover inteiramente e substituir pela seção de tese com 3 sub-seções da Task 1.2?

2. **Blocos Inovação/Confluência/Liderança (Skills.astro).** Playbook Task 1.2 pede remoção. Confirmo remoção total na Task 1.2, correto? (Componente fica no repo como código morto ou deleto o arquivo também?)

3. **CTAs (Task 1.4).** Sugestões do playbook: "Ver projetos" → "Ver meu trabalho" ou "O que venho fazendo"; "Sobre mim" → "Quem sou e como penso". Topa com essas ou prefere testar outras? Posso trazer 3 variantes de cada no PR da Task 1.4.

4. **"10+ Instituições Parceiras".** Número tem base (Sesc, UFRJ, Stanford, Google, Microsoft, FDC, Firjan, MIT)? Se sim, mantenho. Se não ancorado, removo.

5. **Quarta stat.** Se mantiver o grid, o que entra no lugar de "10+ Anos de Experiência": "1,2M acessos" ou "5000+ estudantes"?

6. **Página `/404`.** Reescrever em PT-BR. Quer tom brincalhão (mantendo a piada de "glitch") ou mais sóbrio? Sugestão: "Essa página sumiu. Volta pra casa e tenta de novo." com link "Voltar pra home".

7. **ContactCTA.** Mantém "Vamos cocriar soluções humanas e tecnológicas?" ou migra para a assinatura pura "Vamos cocriar?" em todas as páginas (playbook §1)?

---

## Próximos passos

Assim que as 7 questões acima tiverem resposta, abro:

- **PR desta Task 1.1** (este audit + nenhuma mudança de código).
- **Task 1.2** (reescrever home) em commit separado na mesma branch `phase-1-copy`, partindo do que você decidir nas questões 1, 2, 3, 4, 5.
- **Task 1.3** (reescrever Sobre) depois de 1.2, partindo do arco narrativo e dos números canônicos.
- **Task 1.4, 1.5, 1.6, 1.7** encadeadas.

Todas as reescritas voltam pra você como rascunho antes de virarem commit final (playbook §4 Fase 1).
