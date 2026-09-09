"""
Search utilities using the ddgs (DuckDuckGo Search) library.
Provides web, images, news search and autocomplete suggestions.
"""

import urllib.parse

try:
    from ddgs import DDGS
except ImportError:
    from duckduckgo_search import DDGS


def _get_favicon(url: str) -> str:
    """Return a Google favicon URL for a given page URL."""
    try:
        parsed = urllib.parse.urlparse(url)
        return f"https://www.google.com/s2/favicons?domain={parsed.netloc}&sz=32"
    except Exception:
        return ""


def _get_domain(url: str) -> str:
    """Return the display domain for a URL."""
    try:
        parsed = urllib.parse.urlparse(url)
        return parsed.netloc.replace("www.", "")
    except Exception:
        return url


def search_web(query: str, page: int = 1, region: str = "wt-wt", safe: str = "moderate") -> tuple:
    """
    Search the web via DuckDuckGo.
    Returns (results_list, error_str_or_None).
    """
    results = []
    safe_map = {"strict": "on", "moderate": "moderate", "off": "off"}
    safesearch = safe_map.get(safe, "moderate")

    try:
        ddgs = DDGS()
        max_results = 10
        # DDG doesn't support page offset natively; simulate by fetching more
        fetch_count = max_results * page
        raw = list(ddgs.text(
            query,
            region=region if region != "wt-wt" else "wt-wt",
            safesearch=safesearch,
            max_results=min(fetch_count, 50),
        ))

        # Slice to the requested page
        page_results = raw[(page - 1) * max_results : page * max_results]

        for r in page_results:
            url = r.get("href", "")
            results.append({
                "title": r.get("title", ""),
                "url": url,
                "description": r.get("body", ""),
                "display_url": url[:80],
                "source": _get_domain(url),
                "favicon": _get_favicon(url),
                "type": "web",
            })

        return results, None

    except Exception as e:
        return results, str(e)


def search_images(query: str, safe: str = "moderate", region: str = "wt-wt") -> tuple:
    """
    Search images via DuckDuckGo.
    Returns (results_list, error_str_or_None).
    """
    results = []
    safe_map = {"strict": "on", "moderate": "moderate", "off": "off"}
    safesearch = safe_map.get(safe, "moderate")

    try:
        ddgs = DDGS()
        raw = list(ddgs.images(
            query,
            region=region if region != "wt-wt" else "wt-wt",
            safesearch=safesearch,
            max_results=40,
        ))

        for r in raw:
            results.append({
                "title": r.get("title", ""),
                "url": r.get("url", r.get("image", "")),
                "thumbnail": r.get("thumbnail", r.get("image", "")),
                "image": r.get("image", ""),
                "source": r.get("source", _get_domain(r.get("url", ""))),
                "width": r.get("width", 0),
                "height": r.get("height", 0),
                "type": "image",
            })

        return results, None

    except Exception as e:
        return results, str(e)


def search_news(query: str, region: str = "wt-wt", safe: str = "moderate") -> tuple:
    """
    Search news via DuckDuckGo.
    Returns (results_list, error_str_or_None).
    """
    results = []

    try:
        ddgs = DDGS()
        raw = list(ddgs.news(
            query,
            region=region if region != "wt-wt" else "wt-wt",
            safesearch="off",  # DDG news doesn't respect safesearch the same way
            max_results=20,
        ))

        for r in raw:
            url = r.get("url", "")
            results.append({
                "title": r.get("title", ""),
                "url": url,
                "description": r.get("body", ""),
                "display_url": url[:80],
                "source": r.get("source", _get_domain(url)),
                "favicon": _get_favicon(url),
                "date": r.get("date", ""),
                "type": "news",
            })

        return results, None

    except Exception as e:
        return results, str(e)


def get_suggestions(query: str) -> list:
    """Get autocomplete suggestions from DuckDuckGo."""
    try:
        ddgs = DDGS()
        results = list(ddgs.suggestions(query))
        return [r.get("phrase", "") for r in results if r.get("phrase")]
    except Exception:
        return []
