import Fuse, { type FuseResult, type FuseResultMatch } from 'fuse.js';
import type { SearchItem } from '../utils/searchData';

class SearchManager {
  private fuse: Fuse<SearchItem> | null = null;
  private searchData: SearchItem[] = [];

  constructor() {
    this.init();
  }

  async init() {
    // Load search data
    try {
      const response = await fetch('/search-data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.searchData = await response.json();
      
      this.fuse = new Fuse(this.searchData, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'description', weight: 0.3 },
          { name: 'content', weight: 0.2 },
          { name: 'tags', weight: 0.1 }
        ],
        threshold: 0.3,
        includeMatches: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
      });

      this.setupAllSearchInstances();
    } catch (error) {
      console.error('Failed to load search data:', error);
    }
  }

  setupAllSearchInstances() {
    // Find the search input element in the modal and set it up
    const searchInput = document.querySelector('#search-input') as HTMLInputElement;
    const searchResults = document.querySelector('#search-results') as HTMLElement;
    const searchClear = document.querySelector('#search-clear') as HTMLElement;
    
    if (searchInput && searchResults && searchClear) {
      this.setupSearchInstance(searchInput, searchResults, searchClear);
    }
  }

  setupSearchInstance(searchInput: HTMLInputElement, searchResults: HTMLElement, searchClear: HTMLElement) {
    searchInput.addEventListener('input', (e: Event) => {
      const query = (e.target as HTMLInputElement).value;
      this.performSearch(query, searchResults);
    });

    searchInput.addEventListener('focus', (e: Event) => {
      const query = (e.target as HTMLInputElement).value;
      if (query.length >= 2) {
        this.performSearch(query, searchResults);
      }
    });

    searchClear.addEventListener('click', () => {
      this.clearSearch(searchInput, searchResults);
    });

    // Handle Escape key
    searchInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.hideResults(searchResults);
        searchInput.blur();
      }
    });

    // Close results when clicking outside
    document.addEventListener('click', (e: Event) => {
      const target = e.target as Node;
      if (!searchInput.contains(target) && !searchResults.contains(target)) {
        this.hideResults(searchResults);
      }
    });
  }

  performSearch(query: string, searchResults: HTMLElement) {
    if (!this.fuse) return;

    if (query.length < 2) {
      this.hideResults(searchResults);
      return;
    }

    const results = this.fuse.search(query);
    this.displayResults(results.slice(0, 8), searchResults); // Limit to 8 results
  }

  displayResults(results: FuseResult<SearchItem>[], searchResults: HTMLElement) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      this.showResults(searchResults);
      return;
    }

    const resultsHTML = results.map(result => {
      const item = result.item;
      const highlightedTitle = this.highlightMatches(item.title, result.matches?.filter((m: FuseResultMatch) => m.key === 'title'));
      
      return `
        <a href="${item.url}" class="search-result-item">
          <div class="search-result-type">${item.type === 'blog' ? 'Blog' : 'Trabalho'}</div>
          <div class="search-result-title">${highlightedTitle}</div>
          <div class="search-result-description">${this.truncateText(item.description, 120)}</div>
        </a>
      `;
    }).join('');

    searchResults.innerHTML = resultsHTML;
    this.showResults(searchResults);
  }

  highlightMatches(text: string, matches?: readonly FuseResultMatch[]): string {
    if (!matches || matches.length === 0) return text;
    
    let highlightedText = text;
    const match = matches[0];
    
    if (match.indices && match.indices.length > 0) {
      // Sort indices in reverse order to avoid index shifting issues
      const sortedIndices = [...match.indices].sort((a, b) => b[0] - a[0]);
      
      for (const [start, end] of sortedIndices) {
        const before = highlightedText.substring(0, start);
        const highlighted = highlightedText.substring(start, end + 1);
        const after = highlightedText.substring(end + 1);
        highlightedText = `${before}<mark style="background: var(--accent-regular); color: var(--gray-0); padding: 0.1em 0.2em; border-radius: 0.2em;">${highlighted}</mark>${after}`;
      }
    }
    
    return highlightedText;
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  }

  clearSearch(searchInput: HTMLInputElement, searchResults: HTMLElement) {
    searchInput.value = '';
    this.hideResults(searchResults);
  }

  showResults(searchResults: HTMLElement) {
    searchResults.classList.remove('hidden');
  }

  hideResults(searchResults: HTMLElement) {
    searchResults.classList.add('hidden');
  }
}

// Initialize search when DOM is loaded
function initializeSearch() {
  new SearchManager();
}

// Initialize search
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSearch);
} else {
  initializeSearch();
}
