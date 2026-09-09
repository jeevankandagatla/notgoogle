/* results.js — Search results page interactions */

// ---- Settings Panel ----
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const settingsOverlay = document.getElementById('settingsOverlay');

function openSettings() {
  settingsPanel.classList.add('open');
  settingsOverlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeSettings() {
  settingsPanel.classList.remove('open');
  settingsOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
if (settingsOverlay) settingsOverlay.addEventListener('click', closeSettings);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSettings();
});

// ---- Header Search Clear Button ----
const headerInput = document.getElementById('headerSearchInput');
const headerClearBtn = document.getElementById('headerClearBtn');
const headerAutocompleteList = document.getElementById('headerAutocompleteList');

if (headerClearBtn) {
  headerClearBtn.addEventListener('click', () => {
    if (headerInput) {
      headerInput.value = '';
      headerInput.focus();
      hideHeaderAutocomplete();
    }
  });
}

// ---- Autocomplete for header search ----
let headerSuggestions = [];
let headerHighlight = -1;

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

async function fetchHeaderSuggestions(query) {
  if (!query || query.length < 2) { hideHeaderAutocomplete(); return; }
  try {
    const resp = await fetch(`/autocomplete/?q=${encodeURIComponent(query)}`);
    headerSuggestions = await resp.json();
    renderHeaderAutocomplete(headerSuggestions);
  } catch (e) {
    hideHeaderAutocomplete();
  }
}

function renderHeaderAutocomplete(items) {
  if (!items.length) { hideHeaderAutocomplete(); return; }
  headerAutocompleteList.innerHTML = items.slice(0, 8).map((item, i) => `
    <li class="autocomplete-item" data-index="${i}" role="option">
      <span class="ac-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      ${escapeHtml(item)}
    </li>
  `).join('');
  headerAutocompleteList.classList.add('visible');
  headerHighlight = -1;

  headerAutocompleteList.querySelectorAll('.autocomplete-item').forEach((el, i) => {
    el.addEventListener('click', () => {
      headerInput.value = headerSuggestions[i];
      hideHeaderAutocomplete();
      document.getElementById('headerSearchForm').submit();
    });
    el.addEventListener('mouseenter', () => setHeaderHighlight(i));
  });
}

function setHeaderHighlight(index) {
  const items = headerAutocompleteList.querySelectorAll('.autocomplete-item');
  items.forEach(el => el.classList.remove('highlighted'));
  if (index >= 0 && index < items.length) {
    items[index].classList.add('highlighted');
    headerHighlight = index;
  }
}

function hideHeaderAutocomplete() {
  if (headerAutocompleteList) {
    headerAutocompleteList.classList.remove('visible');
    headerAutocompleteList.innerHTML = '';
    headerHighlight = -1;
  }
}

if (headerInput) {
  headerInput.addEventListener('input', debounce(() => fetchHeaderSuggestions(headerInput.value), 280));

  headerInput.addEventListener('keydown', (e) => {
    const items = headerAutocompleteList ? headerAutocompleteList.querySelectorAll('.autocomplete-item') : [];
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHeaderHighlight(Math.min(headerHighlight + 1, items.length - 1));
      if (headerHighlight >= 0) headerInput.value = headerSuggestions[headerHighlight];
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHeaderHighlight(Math.max(headerHighlight - 1, -1));
      if (headerHighlight >= 0) headerInput.value = headerSuggestions[headerHighlight];
    } else if (e.key === 'Enter' && headerHighlight >= 0) {
      e.preventDefault();
      headerInput.value = headerSuggestions[headerHighlight];
      hideHeaderAutocomplete();
      document.getElementById('headerSearchForm').submit();
    } else if (e.key === 'Escape') {
      hideHeaderAutocomplete();
    }
  });

  // Keyboard shortcut: '/' focuses header search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== headerInput) {
      e.preventDefault();
      headerInput.focus();
      headerInput.select();
    }
  });
}

// Close autocomplete on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.header-search-wrapper')) {
    hideHeaderAutocomplete();
  }
});

// ---- Result card stagger animation ----
function animateResults() {
  const cards = document.querySelectorAll('.web-result-card, .news-card, .image-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'none';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 40);
  });
}

animateResults();

// ---- Image lightbox ----
const imageCards = document.querySelectorAll('.image-card');
if (imageCards.length) {
  imageCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Allow normal link behavior — no preventDefault
    });
  });
}

// ---- Utility ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
