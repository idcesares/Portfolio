import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    
    // Texto em português brasileiro
    const minutes = Math.ceil(readingTime.minutes);
    const minutesText = minutes === 1 ? 'minuto' : 'minutos';
    data.astro.frontmatter.minutesRead = `${minutes} ${minutesText} de leitura`;
  };
}
