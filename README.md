# Isaac D'Césares Portfolio Website

**Researcher, Educator & Educational Technology Coordinator at Sesc National Department**

[![Website](https://img.shields.io/badge/Website-dcesares.dev-blue?style=for-the-badge)](https://dcesares.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-isaacdcesares-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/isaacdcesares)
[![GitHub](https://img.shields.io/badge/GitHub-idcesares-181717?style=for-the-badge&logo=github)](https://github.com/idcesares)

## About Me

I'm Isaac D'Césares, Educational Technology Coordinator at Sesc National Department and Master's candidate in Computer Science at UFRJ. My passion lies at the intersection of technology, innovation, and education, constantly seeking ways to transform and improve teaching and learning processes.

With solid academic and professional training, including an MBA in Software Engineering Innovation (UFRJ), specializations in Innovative Education (Stanford) and Digital Transformation (FDC), plus certifications as an Innovative Educator by Google and Microsoft, I'm equipped to lead cutting-edge initiatives in educational technology.

### Professional Impact
- 🎓 **2000+ educators** trained in educational technology programs
- 👥 **1700+ students** impacted through Technology Culture and Social Entrepreneurship programs
- 🌐 **600,000+ platform access** on educational platforms I've implemented
- 🏗️ **50+ projects** developed across educational innovation
- 🤝 **10+ partner institutions** in collaborative initiatives
- 📈 **10+ years** of experience in educational technology

## Portfolio Features

### 🚀 Professional Showcase
- **Research & Publications**: Academic work on AI in education, blockchain applications, and educational technology
- **Live Sessions & Talks**: Educational content on AI for university students, digital security, and technological innovation
- **Project Portfolio**: Comprehensive overview of educational technology initiatives and developments
- **Professional Timeline**: Journey from developer to educational technology leader

### 📚 Educational Content
- **Blog Articles**: In-depth analysis of educational technology trends and AI applications
- **AI Tools for Students**: Curated guides for using artificial intelligence in academic environments
- **Digital Security**: Resources for families and educators on safe technology use
- **Technology Integration**: Strategies for implementing technology in educational settings

### 🔬 Research Areas
- **Artificial Intelligence in Education**: Personalized learning and adaptive systems
- **Blockchain Technology**: Decentralized education and LearnChain project development
- **Educational Data Science**: Analytics for improving learning outcomes
- **Maker Education**: Technology labs and hands-on learning environments
- **Digital Literacy**: Critical thinking and responsible technology use

## Tech Stack & Architecture

### 🏗️ Core Technologies
- **[Astro.js](https://astro.build/)** - Modern static site generator with island architecture
- **[React](https://react.dev/)** - Component-based UI development for interactive elements
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for responsive design
- **[HeroUI](https://heroui.com/)** - Modern React component library for enhanced UX
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript for robust development

### 🎨 Design & UX
- **Modern UI/UX**: Clean, professional design reflecting educational technology expertise
- **Responsive Design**: Optimized for all devices and screen sizes
- **Dark/Light Themes**: User preference-based theme switching
- **Interactive Components**: Engaging user interface with smooth transitions
- **Accessibility**: WCAG compliant design for inclusive user experience

### ⚡ Performance & Features
- **SSR + SSG**: Server-side rendering with static generation for optimal performance
- **SEO Optimized**: Comprehensive meta tags, structured data, and sitemap
- **Content Management**: Markdown-based content with frontmatter for easy updates
- **Search Functionality**: Full-text search across articles and projects using Fuse.js
- **Analytics Integration**: Vercel Analytics and Speed Insights for performance monitoring

### 🔧 Advanced Integrations
- **Content Collections**: Astro's type-safe content management system
- **MDX Support**: Enhanced markdown with React component integration
- **RSS Feed**: Automated feed generation for blog content
- **Sitemap Generation**: Automatic sitemap creation for SEO
- **Image Optimization**: Optimized loading and responsive images

### 🌐 Deployment & Infrastructure
- **Vercel Platform**: Edge deployment with global CDN
- **Git-based Workflow**: Continuous deployment from GitHub
- **Performance Monitoring**: Real-time analytics and speed insights
- **Domain Management**: Custom domain with SSL certificate

## Development & Local Setup

### Prerequisites
- **Node.js** (version 18 or higher)
- **pnpm** (preferred) or npm package manager
- **Git** for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/idcesares/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **View the website**
   Open [http://localhost:4321](http://localhost:4321) in your browser

### Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm astro      # Run Astro CLI commands
```

### Project Structure

```
Portfolio/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Hero.astro      # Homepage hero section
│   │   ├── Nav.astro       # Navigation component
│   │   ├── Skills.astro    # Skills showcase
│   │   └── ...
│   ├── content/            # Content collections
│   │   ├── blog/           # Blog articles (Markdown)
│   │   └── work/           # Portfolio projects (Markdown)
│   ├── layouts/            # Page layouts
│   │   └── BaseLayout.astro
│   ├── pages/              # Route pages
│   │   ├── index.astro     # Homepage
│   │   ├── about.astro     # About page
│   │   ├── blog.astro      # Blog listing
│   │   └── work.astro      # Portfolio listing
│   ├── styles/             # Global styles
│   └── utils/              # Utility functions
├── public/                 # Static assets
│   ├── assets/             # Images and media
│   └── favicon.svg
├── astro.config.mjs        # Astro configuration
├── tailwind.config.cjs     # Tailwind CSS config
└── package.json
```

## Content Management

### Adding Blog Posts
Create a new `.md` file in `src/content/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
publishDate: 2025-01-15 10:00:00
description: "Brief description of your post"
tags: ["AI", "Education", "Technology"]
---

Your content here...
```

### Adding Portfolio Projects
Create a new `.md` file in `src/content/work/` with frontmatter:

```markdown
---
title: "Project Title"
publishDate: 2025-01-15 10:00:00
img: "/path/to/image.jpg"
img_alt: "Image description"
description: "Project description"
tags: ["React", "AI", "Education"]
---

Project details...
```

## Professional Background

### Current Role
**Educational Technology Coordinator** at Sesc National Department
- Leading digital transformation initiatives across educational institutions
- Developing AI-powered educational platforms with 600,000+ user access
- Coordinating technology integration programs for 2000+ educators

### Academic Pursuits
**Master's in Computer Science** at UFRJ (Federal University of Rio de Janeiro)
- Research focus: AI applications in educational technology
- Thesis: Blockchain and decentralized learning systems (LearnChain project)

### Expertise Areas
- **AI in Education**: Personalized learning systems and adaptive technologies
- **Educational Innovation**: Maker spaces, robotics labs, and STEM programs
- **Research & Development**: Academic publications and technology assessment
- **Professional Training**: Educator development and digital literacy programs

### Key Projects & Initiatives

#### LearnChain - Decentralized Education Platform
Blockchain-based platform for educational content sharing and monetization, developed in collaboration with UFRJ's Greco Group.

#### AI for University Students Program
Educational initiatives helping students leverage AI tools for academic success, reaching thousands of students across institutions.

#### Digital Security for Families
Comprehensive programs teaching digital literacy and online safety to families and educators.

#### Sesc Educational Technology Architecture
Three-tier system integrating educational management, adaptive learning platforms, and physical-digital materials.

## Contributing

Contributions are welcome! This portfolio serves as both a personal showcase and a resource for the educational technology community.

### Ways to Contribute
1. **Suggest improvements** to educational content or technical implementation
2. **Report issues** or bugs you encounter
3. **Share insights** on educational technology trends
4. **Collaborate** on research or educational initiatives

### Contribution Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add meaningful description'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License & Usage

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Educational Use
Feel free to use this portfolio as inspiration for your own educational technology projects or academic portfolios. Attribution is appreciated but not required.

## Connect & Collaborate

I'm always open to new partnerships, research opportunities, and projects that align with my vision of transformative and technologically advanced education.

### Professional Contact
- **Email**: [isaac.dcesares@gmail.com](mailto:isaac.dcesares@gmail.com)
- **LinkedIn**: [Isaac D'Césares](https://www.linkedin.com/in/isaacdcesares)
- **GitHub**: [@idcesares](https://github.com/idcesares)
- **Website**: [dcesares.dev](https://dcesares.dev)

### Areas of Interest for Collaboration
- AI and machine learning in educational contexts
- Blockchain applications for education and research
- Educational technology research and development
- Digital literacy and responsible technology use
- STEM education and maker pedagogy

---

*"Technology should empower, not oppress. My mission is to be a catalyst for digital transformation in education, fostering continuous learning and technological adaptability."* - Isaac D'Césares