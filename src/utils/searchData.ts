import { getCollection } from 'astro:content';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  type: 'blog' | 'work';
  tags: string[];
  publishDate: Date;
}

export async function generateSearchData(): Promise<SearchItem[]> {
  const blogPosts = await getCollection('blog');
  const workProjects = await getCollection('work');

  const searchItems: SearchItem[] = [];

  // Add blog posts
  for (const post of blogPosts) {
    searchItems.push({
      id: post.id,
      title: post.data.title,
      description: post.data.description || '',
      content: post.body || '',
      url: `/blog/${post.id}`,
      type: 'blog',
      tags: post.data.tags || [],
      publishDate: post.data.publishDate,
    });
  }

  // Add work projects
  for (const project of workProjects) {
    searchItems.push({
      id: project.id,
      title: project.data.title,
      description: project.data.description || '',
      content: project.body || '',
      url: `/work/${project.id}`,
      type: 'work',
      tags: project.data.tags || [],
      publishDate: project.data.publishDate,
    });
  }

  return searchItems.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
}
