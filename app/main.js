// Main application: hash router, state management, UI interactions

import { INDICATORS, CATEGORIES, YEAR_RANGES, GLOSSARY, getAllIndicators, formatValue } from './data.js';
import { 
  renderHome, renderCategory, renderIndicator, renderCompare, 
  renderMethodology, renderSources, renderGlossary, renderSearch 
} from './views.js';

// ============================================================
// State
// ============================================================

const state = {
  currentView: 'home',
  yearRange: 'all',
  searchQuery: '',
  darkMode: false
};

// ============================================================
// DOM Elements
// ============================================================

let app, header, sidebar, searchInput, searchResults, themeToggle, menuToggle, sidebarOverlay;

// ============================================================
// Initialization
// ============================================================

export function init() {
  cacheElements();
  restoreDarkMode();
  setupEventListeners();
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('resize', debounce(resizeCharts, 150));
}

function cacheElements() {
  app = document.getElementById('app');
  header = document.querySelector('header');
  sidebar = document.querySelector('nav.sidebar');
  searchInput = document.getElementById('search-input');
  searchResults = document.getElementById('search-results');
  themeToggle = document.getElementById('theme-toggle');
  menuToggle = document.getElementById('menu-toggle');
  sidebarOverlay = document.querySelector('.sidebar-overlay');
  
  // Create sidebar overlay if not exists
  if (!sidebarOverlay) {
    sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);
  }
}

function restoreDarkMode() {
  const saved = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  state.darkMode = saved !== null ? JSON.parse(saved) : prefersDark;
  applyDarkMode(state.darkMode);
}

function applyDarkMode(on) {
  document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
  localStorage.setItem('darkMode', JSON.stringify(on));
  updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
  if (!themeToggle) return;
  themeToggle.innerHTML = state.darkMode
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  themeToggle.setAttribute('aria-label', state.darkMode ? 'Switch to light mode' : 'Switch to dark mode');
}

// ============================================================
// Event Listeners
// ============================================================

function setupEventListeners() {
  // Theme toggle
  themeToggle?.addEventListener('click', () => {
    state.darkMode = !state.darkMode;
    applyDarkMode(state.darkMode);
  });
  
  // Mobile menu toggle
  menuToggle?.addEventListener('click', toggleSidebar);
  sidebarOverlay?.addEventListener('click', closeSidebar);
  
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearchInput, 150));
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim()) showSearchResults();
    });
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults?.contains(e.target)) {
        hideSearchResults();
      }
    });
  }
  
  // Sidebar navigation links
  sidebar?.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-link');
    if (link) {
      closeSidebar();
      // Let hashchange handle routing
    }
  });
  
  // Keyboard navigation for sidebar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });
}

function toggleSidebar() {
  sidebar?.classList.toggle('open');
  sidebarOverlay?.classList.toggle('open');
  document.body.style.overflow = sidebar?.classList.contains('open') ? 'hidden' : '';
}

function closeSidebar() {
  sidebar?.classList.remove('open');
  sidebarOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

// ============================================================
// Hash Router
// ============================================================

function handleHashChange() {
  const hash = window.location.hash.slice(1) || '/';
  const [path, queryString] = hash.split('?');
  const params = new URLSearchParams(queryString || '');
  
  // Update year range from query param if present
  if (params.has('range')) {
    state.yearRange = params.get('range');
  }
  
  // Parse route
  if (path === '/' || path === '') {
    navigate('home');
  } else if (path.startsWith('/category/')) {
    const catId = path.split('/category/')[1];
    navigate('category', catId);
  } else if (path.startsWith('/indicator/')) {
    const indId = path.split('/indicator/')[1];
    navigate('indicator', indId);
  } else if (path === '/compare') {
    navigate('compare');
  } else if (path === '/methodology') {
    navigate('methodology');
  } else if (path === '/sources') {
    navigate('sources');
  } else if (path === '/glossary') {
    navigate('glossary');
  } else if (path === '/search') {
    const q = params.get('q') || '';
    navigate('search', q);
  } else {
    navigate('home');
  }
  
  updateActiveNav(path);
}

function navigate(view, param = null) {
  state.currentView = view;
  
  switch (view) {
    case 'home':
      renderHome(state.yearRange);
      break;
    case 'category':
      renderCategory(param, state.yearRange);
      break;
    case 'indicator':
      renderIndicator(param, state.yearRange);
      break;
    case 'compare':
      renderCompare(state.yearRange);
      break;
    case 'methodology':
      renderMethodology();
      break;
    case 'sources':
      renderSources();
      break;
    case 'glossary':
      renderGlossary();
      break;
    case 'search':
      performSearch(param);
      break;
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
  closeSidebar();
}

function updateActiveNav(path) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const linkPath = href.slice(1); // remove #
      const isActive = path.startsWith(linkPath) || (path === '/' && linkPath === '/');
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    }
  });
}

// ============================================================
// Search
// ============================================================

function handleSearchInput() {
  const query = searchInput.value.trim().toLowerCase();
  state.searchQuery = query;
  
  if (query.length === 0) {
    hideSearchResults();
    return;
  }
  
  const results = getAllIndicators().filter(ind => 
    ind.name.toLowerCase().includes(query) ||
    ind.shortName.toLowerCase().includes(query) ||
    ind.code.toLowerCase().includes(query) ||
    ind.category.toLowerCase().includes(query)
  );
  
  renderSearchDropdown(results);
  showSearchResults();
}

function renderSearchDropdown(results) {
  if (!searchResults) return;
  
  searchResults.innerHTML = '';
  
  results.slice(0, 10).forEach(ind => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.innerHTML = `
      <div class="result-name">${ind.shortName}</div>
      <div class="result-category">${ind.category} • ${ind.unit}</div>
    `;
    item.addEventListener('click', () => {
      window.location.hash = `#/indicator/${ind.id}`;
      hideSearchResults();
      searchInput.value = '';
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
    searchResults.appendChild(item);
  });
  
  if (results.length > 10) {
    const more = document.createElement('div');
    more.className = 'search-result-item';
    more.style.fontStyle = 'italic';
    more.style.color = 'var(--color-text-muted)';
    more.textContent = `+ ${results.length - 10} more results…`;
    searchResults.appendChild(more);
  }
}

function showSearchResults() {
  searchResults?.classList.add('open');
}

function hideSearchResults() {
  searchResults?.classList.remove('open');
}

function performSearch(query) {
  const q = query.trim().toLowerCase();
  const results = getAllIndicators().filter(ind => 
    ind.name.toLowerCase().includes(q) ||
    ind.shortName.toLowerCase().includes(q) ||
    ind.code.toLowerCase().includes(q) ||
    ind.category.toLowerCase().includes(q)
  );
  renderSearch(q, results);
}

// ============================================================
// Chart Resize Handling
// ============================================================

function resizeCharts() {
  // Trigger re-render of visible charts by dispatching a custom event
  // The chart functions in views.js read container.clientWidth on render
  const charts = document.querySelectorAll('.chart-wrapper');
  charts.forEach(wrapper => {
    const svg = wrapper.querySelector('.chart-svg');
    if (svg) {
      // Force reflow by clearing and letting the view re-render
      // This is a simple approach; a more sophisticated one would store render functions
    }
  });
}

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// ============================================================
// CSV Download (exposed for views.js)
// ============================================================

window.downloadCSV = function(indicator, yearRange) {
  const startYear = yearRange === '2015-2019' ? 2015 : yearRange === '2020-2024' ? 2020 : 2015;
  const endYear = yearRange === '2015-2019' ? 2019 : 2024;
  
  let csv = `Year,${indicator.name} (${indicator.unit}),Source\n`;
  for (let y = startYear; y <= endYear; y++) {
    const val = indicator.series[y];
    if (val !== undefined) {
      csv += `${y},${val},${indicator.source}\n`;
    } else {
      csv += `${y},,${indicator.source}\n`;
    }
  }
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${indicator.id}-${yearRange}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// ============================================================
// Category Navigation Population
// ============================================================

function populateCategoryNav() {
  const categoryNav = document.getElementById('category-nav');
  if (!categoryNav) return;
  
  CATEGORIES.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="#/category/${cat.id}" class="nav-link" data-path="/category/${cat.id}">
        <span aria-hidden="true">${cat.icons}</span>${cat.name}
      </a>
    `;
    categoryNav.appendChild(li);
  });
}

// ============================================================
// Initialize on DOM ready
// ============================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    populateCategoryNav();
    init();
  });
} else {
  populateCategoryNav();
  init();
}