"""Check built MKG links and assets; optionally verify live destinations.
Run after npm run build: python3 scripts/check-links.py [--live]
"""
import concurrent.futures
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path('.vercel/output/static')
ORIGIN = 'https://www.miamiknifeguy.com'

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.links, self.assets = set(), [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('href'):
            self.links.append(attrs['href'])
        if tag in ('img', 'script') and attrs.get('src'):
            self.assets.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') in ('stylesheet', 'icon', 'preload'):
            self.assets.append(attrs.get('href', ''))

pages = {}
for path in sorted(ROOT.rglob('*.html')):
    route = '/' + str(path.relative_to(ROOT)).removesuffix('index.html')
    pages[route] = Document(path.read_text())
errors, pending, external, links = [], set(), set(), set()
for route, page in pages.items():
    for href in page.links + page.assets:
        url = urllib.parse.urlsplit(urllib.parse.urljoin(ORIGIN + route, href))
        if url.scheme not in ('http', 'https'):
            continue
        if url.netloc not in ('www.miamiknifeguy.com', 'miamiknifeguy.com'):
            if href in page.links:
                external.add(urllib.parse.urlunsplit(url._replace(fragment='')))
            continue
        links.add(url.path)
        target = urllib.parse.unquote(url.path)
        file = ROOT / target.lstrip('/')
        if file.is_dir():
            file /= 'index.html'
        if not file.exists():
            if re.fullmatch(r'/r/[^/]+/?', target):
                pending.add(target)
            else:
                errors.append({'from': route, 'target': href, 'error': 'missing file'})
        elif url.fragment and href in page.links:
            doc = pages.get(target if target.endswith('/') else target + '/')
            if doc and urllib.parse.unquote(url.fragment) not in doc.ids:
                errors.append({'from': route, 'target': href, 'error': 'missing anchor'})

for css in ROOT.rglob('*.css'):
    for asset in re.findall(r'url\([\'\"]?(/[^)\'\"]+)', css.read_text()):
        if not (ROOT / asset.lstrip('/').split('?')[0]).exists():
            errors.append({'from': str(css.relative_to(ROOT)), 'target': asset, 'error': 'missing CSS asset'})

result = {'pages': len(pages), 'internal_destinations': len(links), 'errors': errors, 'dynamic_routes': sorted(pending), 'external_links': sorted(external)}
if '--live' in sys.argv:
    # Read live HTML for the live audit: unpublished build hashes must not be
    # mistaken for broken assets on production.
    with urllib.request.urlopen(ORIGIN + '/sitemap.xml', timeout=25) as response:
        sitemap = ET.fromstring(response.read())
    live_routes = [node.text for node in sitemap.findall('.//{*}loc')]
    def read_page(url):
        try:
            with urllib.request.urlopen(url, timeout=25) as response:
                return url, response.status, Document(response.read().decode()), response.url
        except urllib.error.HTTPError as error:
            return url, error.code, None, url
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        live_pages = list(pool.map(read_page, live_routes))
    live_targets, live_page_results, live_docs = set(), [], {}
    for url, code, doc, final in live_pages:
        live_page_results.append({'url': url, 'status': code, 'final': final})
        if doc:
            live_docs[urllib.parse.urlsplit(final).path] = doc
            for href in doc.links + doc.assets:
                destination = urllib.parse.urlsplit(urllib.parse.urljoin(final, href))
                if destination.scheme in ('http', 'https'):
                    if destination.netloc in ('www.miamiknifeguy.com','miamiknifeguy.com') or href in doc.links:
                        live_targets.add(urllib.parse.urlunsplit(destination._replace(fragment='')))
    live_anchor_errors = []
    for url, code, doc, final in live_pages:
        if not doc: continue
        for href in doc.links:
            dest = urllib.parse.urlsplit(urllib.parse.urljoin(final,href))
            target_doc = live_docs.get(dest.path)
            if dest.netloc == 'www.miamiknifeguy.com' and dest.fragment and target_doc and urllib.parse.unquote(dest.fragment) not in target_doc.ids:
                live_anchor_errors.append({'from':url,'target':href})
    def check(url):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'MKG-Link-Check/1.0'}), timeout=25) as response:
                return {'url': url, 'status': response.status, 'final': response.url}
        except urllib.error.HTTPError as error:
            return {'url': url, 'status': error.code}
        except Exception as error:
            return {'url': url, 'error': str(error)}
    urls = sorted(live_targets - {row['url'] for row in live_page_results})
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        result['live'] = live_page_results + list(pool.map(check, urls))
    result['live_pages'] = len(live_page_results)
    result['live_anchor_errors'] = live_anchor_errors
print(json.dumps(result, indent=2))
sys.exit(bool(errors))
