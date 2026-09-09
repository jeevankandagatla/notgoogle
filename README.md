# NotGoogle 🔍

> A privacy-first metasearch engine that aggregates results from DuckDuckGo — no tracking, no ads, no profiling.

![NotGoogle Homepage](https://img.shields.io/badge/Django-5.1-green?style=flat-square&logo=django)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=flat-square&logo=python)
![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)

---

## ✨ Features

- 🌐 **Web Search** — 10 results per page with favicons, source domain, title & snippet
- 🖼️ **Image Search** — Masonry grid of image thumbnails with hover overlays
- 📰 **News Search** — News cards with source, publication date, and snippet
- ⌨️ **Autocomplete** — Live search suggestions as you type
- ⚙️ **Settings Panel** — Region selector & SafeSearch toggle
- 📄 **Pagination** — Navigate through web search result pages
- ⚡ **Keyboard Shortcut** — Press `/` anywhere to instantly focus the search bar
- 🔒 **Zero Tracking** — No cookies, no user profiling, no ads
- 📱 **Responsive** — Works on desktop, tablet, and mobile

---

## 🖼️ Screenshots

| Homepage                        | Web Results                         |
| ------------------------------- | ----------------------------------- |
| Dark glassmorphism landing page | 10 results with favicons & snippets |

| Image Results                   | News Results                     |
| ------------------------------- | -------------------------------- |
| Masonry grid with hover effects | Cards with source, date, and URL |

---

## 🛠️ Tech Stack

| Layer                   | Technology                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**       | Django 5.1 (Python)                                                                                                              |
| **Search Engine** | [`ddgs`](https://pypi.org/project/ddgs/) — DuckDuckGo Search (no API key needed)                                               |
| **Frontend**      | Vanilla HTML5 + CSS3 + Vanilla JavaScript                                                                                        |
| **Design**        | Glassmorphism dark theme, CSS animations                                                                                         |
| **Fonts**         | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) |
| **Database**      | SQLite (default Django)                                                                                                          |

---

## 📁 Project Structure

```
notgoogle/
├── manage.py
├── requirements.txt
├── db.sqlite3
│
├── notgoogle/                  # Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── search/                     # Main search app
│   ├── views.py                # index, search_results, autocomplete views
│   ├── urls.py                 # URL routing
│   ├── utils.py                # DuckDuckGo search wrappers (web, images, news)
│   └── models.py
│
├── templates/
│   └── search/
│       ├── index.html          # Homepage with animated search bar
│       └── results.html        # Results page (web / images / news)
│
└── static/
    ├── css/
    │   └── style.css           # Full design system (dark glassmorphism)
    └── js/
        ├── home.js             # Particles, autocomplete, animations
        └── results.js          # Settings panel, stagger animations
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- pip

### 1. Clone the repository

```bash
git clone https://github.com/jeevankandagatla/notgoogle.git
cd notgoogle
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Apply migrations

```bash
python manage.py migrate
```

### 4. Run the development server

```bash
python manage.py runserver
```

### 5. Open in your browser

```
http://127.0.0.1:8000/
```

---

## 📦 Dependencies

```
django>=5.1
ddgs>=1.0           # DuckDuckGo Search library
requests>=2.32
beautifulsoup4>=4.13
lxml>=6.0
```

Install all at once:

```bash
pip install -r requirements.txt
```

---

## 🔗 URL Routes

| URL                            | View               | Description                          |
| ------------------------------ | ------------------ | ------------------------------------ |
| `/`                          | `index`          | Homepage with search bar             |
| `/search/?q=...&type=web`    | `search_results` | Web search results                   |
| `/search/?q=...&type=images` | `search_results` | Image search results                 |
| `/search/?q=...&type=news`   | `search_results` | News search results                  |
| `/autocomplete/?q=...`       | `autocomplete`   | AJAX autocomplete suggestions (JSON) |

### Query Parameters

| Parameter  | Values                              | Default      | Description                   |
| ---------- | ----------------------------------- | ------------ | ----------------------------- |
| `q`      | any string                          | —           | Search query                  |
| `type`   | `web`, `images`, `news`       | `web`      | Search type                   |
| `page`   | integer                             | `1`        | Page number (web search only) |
| `region` | `wt-wt`, `us-en`, `in-en`, … | `wt-wt`    | Search region                 |
| `safe`   | `strict`, `moderate`, `off`   | `moderate` | SafeSearch level              |

---

## ⌨️ Keyboard Shortcuts

| Key             | Action                              |
| --------------- | ----------------------------------- |
| `/`           | Focus the search bar                |
| `↑` / `↓` | Navigate autocomplete suggestions   |
| `Enter`       | Select highlighted suggestion       |
| `Escape`      | Close autocomplete / settings panel |

---

## 🔒 Privacy

NotGoogle is designed from the ground up to respect your privacy:

- **No cookies** are set on your browser
- **No user sessions** or accounts are tracked
- **No analytics** or third-party tracking scripts
- **No ads** are injected into results
- All searches are proxied through the DuckDuckGo API — DuckDuckGo's own [privacy policy](https://duckduckgo.com/privacy) applies to the underlying requests

---

## 🎨 Design System

The UI uses a custom CSS design system with:

- **Color palette**: Deep navy (`#0a0a0f`) background with purple (`#a855f7`) / blue (`#3b82f6`) gradient accents
- **Glassmorphism** — `backdrop-filter: blur()` for frosted-glass card effects
- **Animated orbs** — radial gradient blobs pulsing behind the homepage
- **Particle system** — floating dots generated by JavaScript on the homepage
- **Staggered animations** — result cards fade in sequentially on load
- **CSS custom properties** — full token-based design system in `:root`


<p align="center">Made with ❤️ for privacy</p>
