# CLAUDE.md

Guia operacional para Claude Code trabalhando neste repo (`dcesares.dev`).

---

## 0. Referências obrigatórias

O overhaul de marca (playbook de fases) foi concluído e o arquivo de playbook foi removido do repo. Este CLAUDE.md é a fonte primária de orientação operacional agora. Ler junto antes de cada sessão:
- [design-system/PROFILE.md](design-system/PROFILE.md) — fatos sobre Isaac (autoridade factual; nunca inferir biografia de exemplos de escrita)
- [design-system/VOICE.md](design-system/VOICE.md) — como Isaac escreve e como o registro se adapta
- [design-system/BRAND-VOICE.md](design-system/BRAND-VOICE.md) — aplicação pública da voz, vocabulário proibido
- [design-system/DESIGN-SYSTEM.md](design-system/DESIGN-SYSTEM.md) — sistema visual em prosa
- [design-system/tokens/design-tokens.css](design-system/tokens/design-tokens.css) — fonte de verdade visual
- [design-system/components/manifest.json](design-system/components/manifest.json) — catálogo da biblioteca de componentes (classes, opções `data-*` válidas, exemplos)

O site é uma **execução da Membrane Palette**: `design-system/` é a distribuição da biblioteca (v2.2.0, ver `design-system/membrane.lock.json`), vendorizada sem edição manual. Atualize com `pnpm sync:membrane` (de `../The-Membrane-Palette` ou `--ref <tag>` via jsDelivr).

Os arquivos `isaac-dcesares-brand-essence-ultimate.md` e `idcesaresbranddesignguide.pdf` vivem no repo de marca, não aqui. Se precisar deles, peça ao Isaac.

---

## 1. Voice rules (resumo — ver BRAND-VOICE.md)

- Português brasileiro por padrão. Inglês só em termos técnicos consagrados.
- Zero travessões longos (—) em PT-BR. Use vírgula, ponto, dois-pontos, parênteses.
- Zero LLM-ês: "mergulhar", "desvendar", "navegar pelas complexidades", "no cenário atual", "crucial", "fundamental", "vale ressaltar", "em suma", "é importante notar".
- Zero LinkedIn-ês: "paixão", "catalisador", "jornada", "game-changer", "disruptivo", "revolucionar".
- Prosa antes de bullets. Listas só quando a informação é genuinamente paralela.
- Sem abertura tipo "Com certeza!" ou "Ótima pergunta".
- Sem estrutura "não é X, é Y" repetida.
- "Vamos cocriar?" é linguagem de campanha opcional, só quando a ação é um convite a colaborar. Botões nomeiam a ação concreta.
- Identidade pública: Pesquisador · Educador · Desenvolvedor. "Builder" não é mais rótulo de identidade. Fatos (cargo, formação, números) só de `PROFILE.md` ou de fonte verificada.

**Brand test** (todo PR de copy passa nas 4): reflete as três dimensões (Pesquisador/Educador/Desenvolvedor)? Segura os dois registros (humano/digital)? É específico o bastante pra só Isaac assinar? Traduz algo, ou só apresenta?

---

## 2. Design rules (resumo — ver DESIGN-SYSTEM.md)

- **Componentes primeiro.** Antes de escrever CSS, use a biblioteca: `mp-button`, `mp-card`, `mp-tag`, `mp-badge`, `mp-input`/`mp-field`, `mp-dialog`, `mp-navbar`, `mp-prose`, `mp-code-block`, `mp-empty`, `mp-steps`, `mp-stat`, layout (`mp-container`, `mp-stack`, `mp-cluster`, `mp-grid`, `mp-section`) e as composições `type-*`. Opções só como `data-*` com os valores do manifest; estado só por atributos nativos/ARIA (`aria-pressed`, `aria-current`, `hidden`), nunca classe de estado. CSS próprio de página fica para layout específico e para os knobs `--mp-<componente>-*`.
- `membrane.js` é o único JS de comportamento genérico (dialog, menu, tabs, combobox, toast). Feedback de ação usa `window.MembranePalette.toast()`.
- Ícones: `<Icon>` (Lucide, `.mp-icon`, linha). Marcas: `<BrandMark>` (SVGs outline de `design-system/brand/`), nunca recriar o logotipo em texto.
- Fontes: as da Membrane (`design-system/fonts/`, auto-hospedadas, com fallbacks métricos). Nada de Google Fonts nem Fonts API do Astro.
- `pnpm check:membrane` reprova classes `mp-*` inexistentes, valores `data-*` fora do manifest, cores cruas, primitivos Tier 1 e tokens desconhecidos ou depreciados.
- Tokens em [design-tokens.css](design-system/tokens/design-tokens.css) são a única fonte de verdade visual. Zero hex, rem, ms hardcoded fora dele.
- Token faltando? Proponha no PR com justificativa, não adicione silenciosamente.
- Nunca `#FFFFFF` em background, nunca `#000000` em foreground. Use `var(--color-bg-primary)` e `var(--color-text-primary)`.
- Tipografia: Fraunces em H1–H3 (H4 em Instrument Sans), body em Instrument Sans, código em JetBrains Mono.
- Cor: 60% canvas/neutrals, 30% accents humanos (terracotta primária, amber, burgundy), 10% registro digital (teal secundária, charcoal). Steel blue existe só como cor de gráfico (`--color-chart-5`).
- Consuma tokens semânticos (Tier 2), não primitivos. Texto sobre tinta usa os pares verificados pelo gate de contraste: `--color-human-text`/`--color-human-bg`, `--color-digital-text`/`--color-digital-bg` e `--color-{success,warning,error,info}-text`/`-bg`. Nunca `--color-teal`, `--color-terracotta` etc. como cor de texto (não mudam no dark mode).
- Campos de formulário: borda `var(--color-border-input)` (≥3:1, WCAG 1.4.11). Hover de botão preenchido: `--color-action-primary-hover` / `--color-action-secondary-hover`, nunca `filter: brightness()`.
- Tamanhos de texto: `--text-small`, `--text-body`, `--text-h4`, `--text-h3`, `--text-h2`. Os aliases `--text-sm/base/md/lg/xl` estão depreciados.
- Touch targets mínimo 44×44px. `:focus-visible` com `outline: var(--focus-ring)`.
- Dark mode via `prefers-color-scheme` + `[data-theme="dark"|"light"]` no `<html>`. A classe `.theme-dark` está depreciada desde a v2.1 do Membrane Palette: não use.
- Motion: efeitos só de hover ficam dentro de `@media (hover: hover)`; movimento (lift, nudge) sai sob `prefers-reduced-motion`.

---

## 3. Comandos

```bash
pnpm dev                  # Dev server em http://localhost:4321
pnpm astro check          # TypeScript + schemas das content collections
pnpm build                # SSR build para Vercel (EPERM no Windows é esperado; Vercel builda no Git)
pnpm build:preview        # Build Node standalone em dist-preview/
pnpm preview              # Servir o build Node local
pnpm check                # Gate pré-commit (astro check + assets + check:membrane + build)
pnpm check:membrane       # Conformidade com a Membrane (manifest + tokens)
pnpm test:browser         # Playwright: axe em todas as páginas (claro/escuro), overflow mobile, teclado, busca, tema, fontes, consentimento
pnpm sync:membrane        # Atualiza design-system/ a partir da Membrane Palette
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
- `design-system/` — distribuição da Membrane Palette (somente leitura; atualizar com `pnpm sync:membrane`).
- `public/assets/` — imagens. Paths absolutos em markdown (`/assets/...`), WebP preferido, `loading="lazy"`.

Stack: Astro 7 SSR em Vercel, Membrane Palette (componentes `mp-*` + `membrane.js`), Tailwind v4 via `@tailwindcss/vite` com o tema da Membrane, Fuse.js client-side search. Sem React/UI kits: o site é intencionalmente Astro puro com pouco JS.

Convenções: TS strict, sem `any`. Commits em inglês (`feat:`, `fix:`, `docs:`). PRs pequenos e focados em um escopo.

---

## 5. Fluxo de trabalho

1. Ler a task e os arquivos de referência relevantes (seção 0).
2. Se tem ambiguidade, **perguntar antes de escrever código**.
3. Apresentar plano curto (3–5 linhas) e aguardar confirmação do Isaac.
4. Executar a task (uma por vez — se descobrir dependência, parar e discutir).
5. Validar contra as regras de voz (seção 1) e design (seção 2).
6. Abrir PR pequeno com "o que" e "porquê".

**Quando parar e perguntar:** decisão de posicionamento fora do brand essence; token faltando; mudança afeta mais páginas que a task descreve; arquivos de referência se contradizem.

---

## 6. Anti-patterns

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
