from django.shortcuts import render
from django.http import JsonResponse
from .utils import search_web, search_images, search_news, get_suggestions


def index(request):
    """Homepage with the search bar."""
    return render(request, 'search/index.html')


def search_results(request):
    """Search results page."""
    query = request.GET.get('q', '').strip()
    search_type = request.GET.get('type', 'web')
    page = int(request.GET.get('page', 1))
    region = request.GET.get('region', 'wt-wt')
    safe = request.GET.get('safe', 'moderate')

    if not query:
        return render(request, 'search/index.html')

    results = []
    error = None

    if search_type == 'images':
        results, error = search_images(query, safe=safe, region=region)
    elif search_type == 'news':
        results, error = search_news(query, region=region, safe=safe)
    else:
        results, error = search_web(query, page=page, region=region, safe=safe)

    total_results = len(results)
    has_next = total_results >= 10 and search_type == 'web'

    context = {
        'query': query,
        'results': results,
        'search_type': search_type,
        'page': page,
        'next_page': page + 1,
        'prev_page': page - 1,
        'has_next': has_next,
        'has_prev': page > 1,
        'region': region,
        'safe': safe,
        'error': error,
        'total_results': total_results,
        'regions': [
            ('wt-wt', 'All Regions'),
            ('us-en', 'United States'),
            ('uk-en', 'United Kingdom'),
            ('in-en', 'India'),
            ('au-en', 'Australia'),
            ('ca-en', 'Canada'),
            ('de-de', 'Germany'),
            ('fr-fr', 'France'),
            ('jp-jp', 'Japan'),
        ],
    }

    return render(request, 'search/results.html', context)


def autocomplete(request):
    """AJAX endpoint for search suggestions."""
    query = request.GET.get('q', '')
    if len(query) < 2:
        return JsonResponse([], safe=False)
    suggestions = get_suggestions(query)
    return JsonResponse(suggestions, safe=False)
