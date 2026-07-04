import type { CollectionEntry } from 'astro:content';

export const SITE_NAME = "Isaac D'Césares";
export const SITE_TITLE = "Isaac D'Césares: pesquisa, educação e tecnologia";
export const SITE_DESCRIPTION =
  'Traduzo IA, blockchain e sistemas emergentes em prática educacional. Pesquisador, educador e construtor entre o humano e o digital.';
export const SITE_LANGUAGE = 'pt-BR';
export const SITE_LOCALE = 'pt_BR';

export const AUTHOR_NAME = SITE_NAME;
export const AUTHOR_JOB_TITLE = 'Coordenador de Tecnologia Educacional';
export const AUTHOR_ORG = 'Sesc Nacional';
export const AUTHOR_PROFILE_PATH = '/about/';
export const AUTHOR_EMAIL = 'isaac.dcesares@gmail.com';

export const SOCIAL_LINKS = {
  github: 'https://github.com/idcesares',
  linkedin: 'https://www.linkedin.com/in/isaacdcesares',
  youtube: 'https://www.youtube.com/@idcesares/',
  twitter: 'https://twitter.com/idcesares',
};

export const DEFAULT_OG_IMAGE = '/assets/portrait.webp';

const getSiteHref = (site: URL) => site.href;
export const getPersonId = (site: URL) => new URL('/about/#person', site).toString();

export const getSiteStructuredData = (site: URL) => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getSiteHref(site),
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: { '@id': getPersonId(site) },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': getPersonId(site),
    name: AUTHOR_NAME,
    url: getSiteHref(site),
    image: new URL('/assets/portrait.webp', site).toString(),
    email: AUTHOR_EMAIL,
    jobTitle: AUTHOR_JOB_TITLE,
    worksFor: {
      '@type': 'Organization',
      name: AUTHOR_ORG,
    },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Universidade Federal do Rio de Janeiro (UFRJ)' },
      { '@type': 'CollegeOrUniversity', name: 'Stanford University' },
      { '@type': 'CollegeOrUniversity', name: 'The Hebrew University of Jerusalem' },
      { '@type': 'CollegeOrUniversity', name: 'Fundação Dom Cabral' },
      { '@type': 'CollegeOrUniversity', name: 'Fundação Getulio Vargas (FGV)' },
    ],
    knowsAbout: [
      'Inteligência Artificial na Educação',
      'Blockchain Educacional',
      'Tecnologia Educacional',
      'Aprendizagem Criativa',
      'Transformação Digital',
    ],
    sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github, SOCIAL_LINKS.youtube, SOCIAL_LINKS.twitter],
  },
];

export const getBreadcrumbStructuredData = (
  site: URL,
  items: { name: string; path: string }[]
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(({ name, path }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: new URL(path, site).toString(),
  })),
});

export const getBlogPostingStructuredData = (
  entry: CollectionEntry<'blog'>,
  site: URL
) => {
  const pageUrl = new URL(`/blog/${entry.id}/`, site).toString();
  const imageUrl = new URL(entry.data.img, site).toString();
  const updatedDate = entry.data.updatedDate ?? entry.data.publishDate;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: entry.data.title,
    description: entry.data.description,
    image: imageUrl,
    author: { '@id': getPersonId(site) },
    publisher: { '@id': getPersonId(site) },
    datePublished: entry.data.publishDate.toISOString(),
    dateModified: updatedDate.toISOString(),
    mainEntityOfPage: pageUrl,
    inLanguage: SITE_LANGUAGE,
    keywords: entry.data.tags.join(', '),
  };
};

export const getWorkStructuredData = (
  entry: CollectionEntry<'work'>,
  site: URL
) => {
  const pageUrl = new URL(`/work/${entry.id}/`, site).toString();
  const imageUrl = new URL(entry.data.img, site).toString();
  const updatedDate = entry.data.updatedDate ?? entry.data.publishDate;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: entry.data.title,
    description: entry.data.description,
    image: imageUrl,
    url: pageUrl,
    author: { '@id': getPersonId(site) },
    publisher: { '@id': getPersonId(site) },
    datePublished: entry.data.publishDate.toISOString(),
    dateModified: updatedDate.toISOString(),
    inLanguage: SITE_LANGUAGE,
    keywords: entry.data.tags.join(', '),
  };
};
