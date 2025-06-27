// Fallback script to ensure search functionality works in production
(function() {
  'use strict';
  
  // Check if search is already initialized
  if (window.searchInitialized) return;
  
  function waitForSearchElements() {
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');
    
    if (searchInput && searchResults && !searchInput.hasAttribute('data-search-initialized')) {
      // Trigger a custom event to signal search should be initialized
      document.dispatchEvent(new CustomEvent('initializeSearch'));
      return true;
    }
    return false;
  }
  
  // Try to initialize immediately
  if (!waitForSearchElements()) {
    // If not ready, wait for DOM content loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', waitForSearchElements);
    } else {
      // Try again after a short delay
      setTimeout(waitForSearchElements, 500);
    }
  }
  
  window.searchInitialized = true;
})();
