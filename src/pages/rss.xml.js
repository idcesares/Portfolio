import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export const prerender = true;

export async function GET(context) {
  const blog = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.updatedDate.valueOf() - a.data.updatedDate.valueOf()
  );
  return rss({
    title: "Blog do Isaac D'Césares",
    description: "Blog pessoal do Isaac D'Césares, com foco em tecnologia e educação.",
    site: context.site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    customData: '<language>pt-BR</language>',
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
      customData: `<atom:updated>${post.data.updatedDate.toISOString()}</atom:updated>`,
    })),
  });
}
