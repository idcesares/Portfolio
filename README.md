# Portfolio Isaac D'Césares

**Pesquisador, Educador e Coordenador de Tecnologia Educacional no Departamento Nacional do Sesc**

[![Website](https://img.shields.io/badge/Website-dcesares.dev-blue?style=for-the-badge)](https://dcesares.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-isaacdcesares-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/isaacdcesares)
[![GitHub](https://img.shields.io/badge/GitHub-idcesares-181717?style=for-the-badge&logo=github)](https://github.com/idcesares)

## Sobre Mim

Sou Isaac D'Césares, Coordenador de Tecnologia Educacional no Departamento Nacional do Sesc e mestrando em Computação pela UFRJ. Minha paixão está na interseção entre tecnologia, inovação e educação, buscando constantemente formas de transformar e melhorar os processos de ensino e aprendizagem.

Com uma sólida formação acadêmica e profissional, incluindo MBA em Inovação em Engenharia de Software (UFRJ), especializações em Educação Inovadora (Stanford) e Transformação Digital (FDC), além de certificações como Educador Inovador pelo Google e Microsoft, estou equipado para liderar iniciativas de vanguarda no campo da tecnologia educacional.

### Impacto Profissional
- 🎓 **2000+ educadores** capacitados em programas de tecnologia educacional
- 👥 **1700+ estudantes** impactados através de programas de Cultura Tecnológica e Empreendedorismo Social
- 🌐 **600.000+ acessos** em plataformas educacionais que implementei
- 🏗️ **50+ projetos** desenvolvidos em inovação educacional
- 🤝 **10+ instituições parceiras** em iniciativas colaborativas
- 📈 **10+ anos** de experiência em tecnologia educacional

## Características do Portfolio

### 🚀 Showcase Profissional
- **Pesquisa e Publicações**: Trabalhos acadêmicos sobre IA na educação, aplicações de blockchain e tecnologia educacional
- **Lives e Palestras**: Conteúdo educacional sobre IA para estudantes universitários, segurança digital e inovação tecnológica
- **Portfolio de Projetos**: Visão abrangente das iniciativas e desenvolvimentos em tecnologia educacional
- **Trajetória Profissional**: Jornada de desenvolvedor a líder em tecnologia educacional

### 📚 Conteúdo Educacional
- **Artigos do Blog**: Análises aprofundadas sobre tendências em tecnologia educacional e aplicações de IA
- **Ferramentas de IA para Estudantes**: Guias selecionados para uso de inteligência artificial em ambientes acadêmicos
- **Segurança Digital**: Recursos para famílias e educadores sobre uso seguro da tecnologia
- **Integração Tecnológica**: Estratégias para implementação de tecnologia em ambientes educacionais

### 🔬 Áreas de Pesquisa
- **Inteligência Artificial na Educação**: Aprendizagem personalizada e sistemas adaptativos
- **Tecnologia Blockchain**: Educação descentralizada e desenvolvimento do projeto LearnChain
- **Ciência de Dados Educacionais**: Analytics para melhoria dos resultados de aprendizagem
- **Educação Maker**: Laboratórios de tecnologia e ambientes de aprendizagem prática
- **Letramento Digital**: Pensamento crítico e uso responsável da tecnologia

## Stack Tecnológico e Arquitetura

### 🏗️ Tecnologias Principais
- **[Astro.js](https://astro.build/)** - Gerador de site moderno com arquitetura de ilhas
- **[React](https://react.dev/)** - Desenvolvimento de UI baseado em componentes para elementos interativos
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first para design responsivo
- **[HeroUI](https://heroui.com/)** - Biblioteca moderna de componentes React para UX aprimorada
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript com tipagem segura para desenvolvimento robusto

### 🎨 Design e UX
- **UI/UX Moderna**: Design limpo e profissional refletindo expertise em tecnologia educacional
- **Design Responsivo**: Otimizado para todos os dispositivos e tamanhos de tela
- **Temas Claro/Escuro**: Alternância de tema baseada na preferência do usuário
- **Componentes Interativos**: Interface de usuário envolvente com transições suaves
- **Acessibilidade**: Design compatível com WCAG para experiência de usuário inclusiva

### ⚡ Performance e Funcionalidades
- **Hybrid SSR + Prerender**: Todas as páginas são prerendered no build para máxima performance
- **MPA Navigation**: Navegação tradicional com prefetch inteligente (viewport strategy)
- **SEO Otimizado**: Meta tags abrangentes, dados estruturados e sitemap
- **Gerenciamento de Conteúdo**: Conteúdo baseado em Markdown com frontmatter para atualizações fáceis
- **Funcionalidade de Busca**: Busca em texto completo em artigos e projetos usando Fuse.js
- **Integração de Analytics**: Vercel Analytics e Speed Insights para monitoramento de performance
- **Scroll Animations**: Animações CSS com `data-animate` attributes (respeitando prefers-reduced-motion)

### 🔧 Integrações Avançadas
- **Content Collections**: Sistema de gerenciamento de conteúdo type-safe do Astro
- **Suporte MDX**: Markdown aprimorado com integração de componentes React
- **Feed RSS**: Geração automatizada de feed para conteúdo do blog
- **Geração de Sitemap**: Criação automática de sitemap para SEO
- **Otimização de Imagens**: Carregamento otimizado e imagens responsivas

### 🌐 Deploy e Infraestrutura
- **Plataforma Vercel**: Deploy edge com CDN global
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Asset Caching**: Cache immutable (1 ano) para assets otimizados
- **Workflow baseado em Git**: Deploy contínuo a partir do GitHub
- **Monitoramento de Performance**: Analytics e insights de velocidade em tempo real
- **Gerenciamento de Domínio**: Domínio personalizado com certificado SSL

## Desenvolvimento e Configuração Local

### 🐳 Opção 1: Docker (Recomendado - Machine Agnostic)

**Início Rápido com Docker**:
```bash
# Windows PowerShell
.\docker.ps1 up

# Linux/macOS ou Terminal padrão
docker-compose up -d
```

Acesse: **http://localhost:4321**

**Documentação Completa**: Ver **[DOCKER.md](./DOCKER.md)** ou pasta **[`docker/`](./docker/)**

### 💻 Opção 2: Instalação Local

**Pré-requisitos**:
- **Node.js** (versão 18 ou superior)
- **pnpm** (preferível) ou npm como gerenciador de pacotes
- **Git** para controle de versão

**Passos para Instalação**:

1. **Clone o repositório**
   ```bash
   git clone https://github.com/idcesares/Portfolio.git
   cd Portfolio
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   pnpm dev
   # ou
   npm run dev
   ```

4. **Visualize o website**
   Abra [http://localhost:4321](http://localhost:4321) no seu navegador

### Scripts Disponíveis

```bash
pnpm dev        # Inicia servidor de desenvolvimento
pnpm build      # Build para produção
pnpm preview    # Preview do build de produção
pnpm astro      # Executa comandos CLI do Astro
```

### Observação (Windows + Vercel Adapter)
Em Windows, o build com `@astrojs/vercel` pode falhar com `EPERM: operation not permitted, symlink`
ao gerar `.vercel/output`. Isso acontece porque a criação de symlinks exige permissões elevadas
ou o **Developer Mode** habilitado. Soluções comuns:
- habilitar Developer Mode no Windows;
- rodar o terminal/VS Code como Administrador; ou
- executar o build em WSL/Docker/Linux.

Se você usa o deploy automático da Vercel via Git, o build em produção ocorre em Linux e esse
erro local pode ser ignorado.

### Estrutura do Projeto

```
Portfolio/
├── src/
│   ├── components/          # Componentes UI reutilizáveis
│   │   ├── Hero.astro      # Seção hero da homepage
│   │   ├── Nav.astro       # Componente de navegação
│   │   ├── Skills.astro    # Showcase de habilidades
│   │   ├── FilterBar.astro # Barra de filtros para busca
│   │   └── ...
│   ├── content/            # Collections de conteúdo
│   │   ├── blog/           # Artigos do blog (Markdown/MDX)
│   │   └── work/           # Projetos do portfolio (Markdown/MDX)
│   ├── layouts/            # Layouts de página
│   │   └── BaseLayout.astro
│   ├── pages/              # Páginas de rota
│   │   ├── index.astro     # Homepage
│   │   ├── about.astro     # Página sobre
│   │   ├── blog.astro      # Listagem do blog
│   │   ├── work.astro      # Listagem do portfolio
│   │   ├── deals.astro     # Página de ofertas
│   │   └── search-data.json.ts  # API endpoint para busca
│   ├── styles/             # Estilos globais
│   └── utils/              # Funções utilitárias
├── public/                 # Assets estáticos
│   ├── assets/             # Imagens e mídia
│   │   ├── blog_imgs/      # Imagens dos posts do blog
│   │   └── backgrounds/    # Imagens de fundo responsivas
│   ├── favicon.svg
│   ├── search-fallback.js  # Fallback de busca (cache 24h)
│   └── llms.txt           # Instruções para LLMs
├── astro.config.mjs        # Configuração do Astro
├── tailwind.config.cjs     # Configuração do Tailwind CSS
├── vercel.json             # Configuração de deploy, security headers e caching
└── package.json
```

## Gerenciamento de Conteúdo

### Adicionando Posts do Blog
Crie um novo arquivo `.md` ou `.mdx` em `src/content/blog/` com frontmatter:

```markdown
---
title: "Título do Seu Post"
publishDate: 2025-01-15 10:00:00
updatedDate: 2025-01-15 10:00:00
description: "Breve descrição do seu post"
tags: ["IA", "Educação", "Tecnologia"]
img: "/assets/blog_imgs/nome-da-imagem.webp"
img_alt: "Descrição da imagem"
---

Seu conteúdo aqui...
```

### Adicionando Projetos do Portfolio
Crie um novo arquivo `.md` ou `.mdx` em `src/content/work/` com frontmatter:

```markdown
---
title: "Título do Projeto"
publishDate: 2025-01-15 10:00:00
updatedDate: 2025-01-15 10:00:00
img: "/assets/blog_imgs/projeto-imagem.webp"
img_alt: "Descrição da imagem"
description: "Descrição do projeto"
tags: ["React", "IA", "Educação"]
---

Detalhes do projeto...
```

### Schema das Collections
Ambas as collections (`blog` e `work`) seguem o mesmo schema definido em `src/content.config.ts`:
- **title**: Título obrigatório
- **description**: Descrição para SEO
- **publishDate**: Data de publicação
- **updatedDate**: Data de atualização
- **tags**: Array de tags para categorização
- **img**: Caminho para imagem (obrigatório)
- **img_alt**: Texto alternativo para a imagem

## Contexto Profissional

### Função Atual
**Coordenador de Tecnologia Educacional** no Departamento Nacional do Sesc
- Liderança de iniciativas de transformação digital em instituições educacionais
- Desenvolvimento de plataformas educacionais com IA e 600.000+ acessos de usuários
- Coordenação de programas de integração tecnológica para 2000+ educadores

### Formação Acadêmica
**Mestrado em Computação** na UFRJ (Universidade Federal do Rio de Janeiro)
- Foco de pesquisa: Aplicações de IA em tecnologia educacional
- Dissertação: Blockchain e sistemas de aprendizagem descentralizada (projeto LearnChain)

**Formação Complementar**
- MBA em Inovação em Engenharia de Software (UFRJ)
- Especialização em Educação Inovadora (Stanford)
- Especialização em Transformação Digital (FDC)
- Certificação como Educador Inovador (Google e Microsoft)

### Áreas de Expertise
- **IA na Educação**: Sistemas de aprendizagem personalizada e tecnologias adaptativas
- **Inovação Educacional**: Espaços maker, laboratórios de robótica e programas STEM
- **Pesquisa e Desenvolvimento**: Publicações acadêmicas e avaliação de tecnologias
- **Formação Profissional**: Desenvolvimento de educadores e programas de letramento digital

### Projetos e Iniciativas Principais

#### LearnChain - Plataforma de Educação Descentralizada
Plataforma baseada em blockchain para compartilhamento e monetização de conteúdo educacional, desenvolvida em colaboração com o Grupo Greco da UFRJ.

#### Programa IA para Estudantes Universitários
Iniciativas educacionais ajudando estudantes a aproveitar ferramentas de IA para sucesso acadêmico, alcançando milhares de estudantes em diversas instituições.

#### Segurança Digital para Famílias
Programas abrangentes ensinando letramento digital e segurança online para famílias e educadores.

#### Arquitetura de Tecnologia Educacional do Sesc
Sistema de três camadas integrando gestão educacional, plataformas de aprendizagem adaptativa e materiais físico-digitais.

## Funcionalidades Avançadas

### Sistema de Busca
- **Endpoint de Dados**: `/search-data.json` gera dados estruturados para busca
- **Busca Client-Side**: Implementação com Fuse.js para busca em tempo real
- **Filtros**: Por tags, termos de busca e ordenação (mais recente/antigo/alfabético)
- **Cache**: Endpoint cached por 5 minutos via configuração Vercel

### Otimizações de Performance
- **Lazy Loading**: Imagens carregadas sob demanda
- **WebP/AVIF**: Formatos de imagem otimizados
- **Bundle Splitting**: Código dividido para carregamento eficiente
- **Tailwind Purging**: CSS otimizado automaticamente

### SEO e Analytics
- **Meta Tags**: Configuração abrangente via astro-seo
- **JSON-LD**: Dados estruturados para mecanismos de busca
- **Sitemap**: Geração automática
- **RSS Feed**: Feed automatizado para conteúdo do blog
- **Vercel Analytics**: Monitoramento de performance e Core Web Vitals

## Contribuições

Contribuições são bem-vindas! Este portfolio serve tanto como showcase pessoal quanto como recurso para a comunidade de tecnologia educacional.

### Formas de Contribuir
1. **Sugerir melhorias** no conteúdo educacional ou implementação técnica
2. **Reportar problemas** ou bugs encontrados
3. **Compartilhar insights** sobre tendências em tecnologia educacional
4. **Colaborar** em pesquisas ou iniciativas educacionais

### Processo de Contribuição
1. Faça um fork do repositório
2. Crie uma branch de feature: `git checkout -b feature/nome-da-sua-feature`
3. Faça suas mudanças e commit: `git commit -m 'Adiciona descrição significativa'`
4. Push para sua branch: `git push origin feature/nome-da-sua-feature`
5. Submeta um pull request

## Licença e Uso

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### Uso Educacional
Sinta-se livre para usar este portfolio como inspiração para seus próprios projetos de tecnologia educacional ou portfolios acadêmicos. Atribuição é apreciada, mas não obrigatória.

## Conecte-se e Colabore

Estou sempre aberto a novas parcerias, oportunidades de pesquisa e projetos que se alinhem com minha visão de educação transformadora e tecnologicamente avançada.

### Contato Profissional
- **Email**: [isaac.dcesares@gmail.com](mailto:isaac.dcesares@gmail.com)
- **LinkedIn**: [Isaac D'Césares](https://www.linkedin.com/in/isaacdcesares)
- **GitHub**: [@idcesares](https://github.com/idcesares)
- **Website**: [dcesares.dev](https://dcesares.dev)

### Áreas de Interesse para Colaboração
- IA e machine learning em contextos educacionais
- Aplicações de blockchain para educação e pesquisa
- Pesquisa e desenvolvimento em tecnologia educacional
- Letramento digital e uso responsável da tecnologia
- Educação STEM e pedagogia maker

### Recursos Adicionais
- **Feed RSS**: [dcesares.dev/rss.xml](https://dcesares.dev/rss.xml)
- **Sitemap**: [dcesares.dev/sitemap-0.xml](https://dcesares.dev/sitemap-0.xml)
- **Dados de Busca**: [dcesares.dev/search-data.json](https://dcesares.dev/search-data.json)
- **Instruções para LLMs**: [dcesares.dev/llms.txt](https://dcesares.dev/llms.txt)

---

*"A tecnologia deve empoderar, não oprimir. Minha missão é ser um catalisador da transformação digital na educação, fomentando aprendizagem contínua e adaptabilidade tecnológica."* - Isaac D'Césares

---

**Última atualização**: Janeiro 2026 | **Versão do site**: Astro 5 + Hybrid SSR | **Status**: Em desenvolvimento ativo
