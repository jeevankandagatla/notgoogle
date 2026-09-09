/* home.js — Homepage interactions */

// Particle generator
function createParticles() {
  const container = document.getElementById('bgParticles');
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 15}s;
      background: ${Math.random() > 0.5 ? '#a855f7' : '#3b82f6'};
      opacity: ${Math.random() * 0.5};
    `;
    container.appendChild(particle);
  }
}

createParticles();

// DOM elements
const searchInput = document.getElementById('homeSearchInput');
const clearBtn = document.getElementById('clearBtn');
const autocompleteList = document.getElementById('autocompleteList');
const homeSearchForm = document.getElementById('homeSearchForm');

// Clear button visibility
if (searchInput) {
  searchInput.addEventListener('input', () => {
    clearBtn.style.display = searchInput.value ? 'flex' : 'none';
    debounce(fetchSuggestions, 280)(searchInput.value);
  });

  // Keyboard shortcut: '/' focuses search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === 'Escape') {
      searchInput.blur();
      hideAutocomplete();
    }
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
    hideAutocomplete();
  });
}

// Autocomplete
let currentHighlight = -1;
let suggestions = [];

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

async function fetchSuggestions(query) {
  if (!query || query.length < 2) {
    hideAutocomplete();
    return;
  }
  try {
    const resp = await fetch(`/autocomplete/?q=${encodeURIComponent(query)}`);
    suggestions = await resp.json();
    renderAutocomplete(suggestions);
  } catch (e) {
    hideAutocomplete();
  }
}

function renderAutocomplete(items) {
  if (!items.length) {
    hideAutocomplete();
    return;
  }

  autocompleteList.innerHTML = items.slice(0, 8).map((item, i) => `
    <li class="autocomplete-item" data-index="${i}" role="option">
      <span class="ac-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      ${escapeHtml(item)}
    </li>
  `).join('');

  autocompleteList.classList.add('visible');
  currentHighlight = -1;

  autocompleteList.querySelectorAll('.autocomplete-item').forEach((el, i) => {
    el.addEventListener('click', () => {
      searchInput.value = suggestions[i];
      hideAutocomplete();
      homeSearchForm.submit();
    });
    el.addEventListener('mouseenter', () => {
      setHighlight(i);
    });
  });
}

function setHighlight(index) {
  const items = autocompleteList.querySelectorAll('.autocomplete-item');
  items.forEach(el => el.classList.remove('highlighted'));
  if (index >= 0 && index < items.length) {
    items[index].classList.add('highlighted');
    currentHighlight = index;
  }
}

function hideAutocomplete() {
  autocompleteList.classList.remove('visible');
  autocompleteList.innerHTML = '';
  currentHighlight = -1;
}

// Keyboard navigation for autocomplete
if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    const items = autocompleteList.querySelectorAll('.autocomplete-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(Math.min(currentHighlight + 1, items.length - 1));
      if (currentHighlight >= 0) searchInput.value = suggestions[currentHighlight];
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(Math.max(currentHighlight - 1, -1));
      if (currentHighlight >= 0) searchInput.value = suggestions[currentHighlight];
    } else if (e.key === 'Enter' && currentHighlight >= 0) {
      e.preventDefault();
      searchInput.value = suggestions[currentHighlight];
      hideAutocomplete();
      homeSearchForm.submit();
    } else if (e.key === 'Escape') {
      hideAutocomplete();
    }
  });
}

// Close autocomplete when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-box-wrapper')) {
    hideAutocomplete();
  }
});

// Pill active state management
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', function () {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('pill-active'));
    this.classList.add('pill-active');
  });
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Animate logo in on load
window.addEventListener('load', () => {
  document.querySelector('.home-main').style.opacity = '1';
});
