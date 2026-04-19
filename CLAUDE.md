# CLAUDE.md

Guia operacional para Claude Code trabalhando neste repo (`dcesares.dev`).

---

## 0. Playbook é a fonte primária

Toda sessão de trabalho começa lendo [dcesares-brand-overhaul-playbook.md](dcesares-brand-overhaul-playbook.md). O playbook define as fases, tasks, Definition of Done e anti-patterns. Este arquivo é apenas o resumo operacional para orientação rápida — se houver conflito, o playbook ganha.

Arquivos de referência obrigatórios (ler junto antes de cada sessão):
- [design-system/BRAND-VOICE.md](design-system/BRAND-VOICE.md) — voz, tom, vocabulário proibido
- [design-system/DESIGN-SYSTEM.md](design-system/DESIGN-SYSTEM.md) — sistema visual em prosa
- [design-system/tokens/design-tokens.css](design-system/tokens/design-tokens.css) — fonte de verdade visual

Os arquivos `isaac-dcesares-brand-essence-ultimate.md` e `idcesaresbranddesignguide.pdf` mencionados no playbook vivem no repo de marca, não aqui. Se precisar deles, peça ao Isaac.

---

## 1. Voice rules (resumo — ver BRAND-VOICE.md)

- Português brasileiro por padrão. Inglês só em termos técnicos consagrados.
- Zero travessões longos (—) em PT-BR. Use vírgula, ponto, dois-pontos, parênteses.
- Zero LLM-ês: "mergulhar", "desvendar", "navegar pelas complexidades", "no cenário atual", "crucial", "fundamental", "vale ressaltar", "em suma", "é importante notar".
- Zero LinkedIn-ês: "paixão", "catalisador", "jornada", "game-changer", "disruptivo", "revolucionar".
- Prosa antes de bullets. Listas só quando a informação é genuinamente paralela.
- Sem abertura tipo "Com certeza!" ou "Ótima pergunta".
- Sem estrutura "não é X, é Y" repetida.
- CTA assinatura: "Vamos cocriar?"

**Brand test** (todo PR de copy passa nas 4): reflete as três dimensões (Researcher/Educator/Builder)? Segura os dois registros (humano/digital)? É específico o bastante pra só Isaac assinar? Traduz algo, ou só apresenta?

---

## 2. Design rules (resumo — ver DESIGN-SYSTEM.md)

- Tokens em [design-tokens.css](design-system/tokens/design-tokens.css) são a única fonte de verdade visual. Zero hex, rem, ms hardcoded fora dele.
- Token faltando? Proponha no PR com justificativa, não adicione silenciosamente.
- Nunca `#FFFFFF` em background, nunca `#000000` em foreground. Use `var(--color-bg-primary)` e `var(--color-text-primary)`.
- Tipografia: Fraunces em H1–H3 (H4 em Instrument Sans), body em Instrument Sans, código em JetBrains Mono.
- Cor: 60% canvas/neutrals, 30% accents humanos (terracotta primária, amber, burgundy), 10% registro digital (teal secundária, steel blue, slate).
- Touch targets mínimo 44×44px. `:focus-visible` com `outline: var(--focus-ring)`.
- Dark mode via `prefers-color-scheme` + `[data-theme="dark"]` + `.theme-dark`.

---

## 3. Comandos

```bash
pnpm dev                  # Dev server em http://localhost:4321
pnpm astro check          # TypeScript + schemas das content collections
pnpm build                # SSR build para Vercel (EPERM no Windows é esperado; Vercel builda no Git)
pnpm preview              # Testar SSR build local
pnpm check                # Gate pré-commit (astro check + build)
pnpm audit                # Dependências high+critical
```

Alternativa Docker quando build local falha:
```bash
.\docker.ps1 up           # PowerShell
make check                # Linux/macOS
```

Endpoints de dev: `/search-data.json` (busca), `/rss.xml` (feed).

Nunca rodar `pnpm build` ou deploy automaticamente. Deploy é decisão do Isaac.

---

## 4. Estrutura

- `src/pages/` — rotas Astro. Páginas públicas com `export const prerender = true`.
- `src/content/blog/` e `src/content/work/` — content collections (Markdown/MDX, PT-BR, schema em [src/content.config.ts](src/content.config.ts)).
- `src/layouts/BaseLayout.astro` — layout único.
- `src/components/` — componentes `PascalCase.astro` com `interface Props {}`.
- `src/styles/` — estilos globais que consomem tokens.
- `design-system/` — spec somente leitura (voice, design system, tokens).
- `public/assets/` — imagens. Paths absolutos em markdown (`/assets/...`), WebP preferido, `loading="lazy"`.

Stack: Astro 6 SSR em Vercel, Tailwind v4 via `@tailwindcss/vite`, HeroUI React, Fuse.js client-side search.

Convenções: TS strict, sem `any`. Commits em inglês (`feat:`, `fix:`, `docs:`). Uma branch por fase do playbook (`phase-1-copy`, `phase-2-visual`, etc.). PRs pequenos.

---

## 5. Fluxo de trabalho (do playbook §3 e §5)

1. Ler a task no [playbook](dcesares-brand-overhaul-playbook.md) e os arquivos de referência relevantes.
2. Se tem ambiguidade, **perguntar antes de escrever código**.
3. Apresentar plano curto (3–5 linhas) e aguardar confirmação do Isaac.
4. Executar a task (uma por vez — se descobrir dependência, parar e discutir).
5. Validar contra o DoD da seção 7 do playbook.
6. Abrir PR pequeno com "o que" e "porquê". Marcar a task como `[x]` no playbook no mesmo PR.

**Quando parar e perguntar:** decisão de posicionamento fora do brand essence; token faltando; mudança afeta mais páginas que a task descreve; arquivos de referência se contradizem.

---

## 6. Anti-patterns (do playbook §6)

- Adicionar deps JS sem discutir. Site é Astro com pouco JS; manter assim.
- Criar componentes genéricos sem verificar se já existem.
- Inventar tokens novos silenciosamente.
- Travessão longo em PT-BR, vocabulário LLM/LinkedIn.
- Animações decorativas sem propósito de comunicar estado ou relação.
- Rodar `pnpm build` ou deploy automaticamente.
- Mudar paleta, logotipo, tipografia — decisão de marca, não de código.
- Gerar conteúdo (posts, ensaios) sem Isaac. Claude edita, critica, formata — não substitui a voz.

---

## 7. Decisões de produto

Todas com Isaac (`isaac.dcesares@gmail.com`). Silêncio pra decidir sozinho é pior que fricção pra alinhar.
