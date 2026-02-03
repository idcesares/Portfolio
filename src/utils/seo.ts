import type { CollectionEntry } from 'astro:content';

export const SITE_NAME = "Isaac D'Césares";
export const SITE_TITLE = "Isaac D'Césares: Inovação e Tecnologia";
export const SITE_DESCRIPTION =
  'Transformando a interseção entre Tecnologia e Educação através de soluções éticas e inovadoras.';
export const SITE_LANGUAGE = 'pt-BR';
export const SITE_LOCALE = 'pt_BR';

export const AUTHOR_NAME = SITE_NAME;
export const AUTHOR_JOB_TITLE = 'Coordenador de Tecnologia Educacional';
export const AUTHOR_ORG = 'Sesc Nacional';
export const AUTHOR_PROFILE_PATH = '/about/';

export const SOCIAL_LINKS = {
  github: 'https://github.com/idcesares',
  linkedin: 'https://www.linkedin.com/in/isaacdcesares',
};

const getSiteHref = (site: URL) => site.href;

export const getSiteStructuredData = (site: URL) => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getSiteHref(site),
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: getSiteHref(site),
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: getSiteHref(site),
    jobTitle: AUTHOR_JOB_TITLE,
    worksFor: {
      '@type': 'Organization',
      name: AUTHOR_ORG,
    },
    sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github],
  },
];

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
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: getSiteHref(site),
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: getSiteHref(site),
    },
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
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: getSiteHref(site),
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: getSiteHref(site),
    },
    datePublished: entry.data.publishDate.toISOString(),
    dateModified: updatedDate.toISOString(),
    inLanguage: SITE_LANGUAGE,
    keywords: entry.data.tags.join(', '),
  };
};
