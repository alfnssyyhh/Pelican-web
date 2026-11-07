import re
import json
from pathlib import Path
from html import unescape

posts_file = Path(r"R:\Gemini-Workspace\Pelican-web\pelican-app\src\data\posts.json")
with open(posts_file, "r", encoding="utf-8") as f:
    posts = json.load(f)

def clean_html(html):
    if not html:
        return ""
    # If it contains ChatGPT container divs, extract only the inner markdown prose
    m = re.search(r'<div class="[^"]*markdown prose[^"]*"[^>]*>(.*?)</div>\s*</div>\s*</div>', html, re.DOTALL)
    if m:
        html = m.group(1)
    
    # Remove data-start, data-end, data-is-last-node, data-testid, etc.
    html = re.sub(r'\s+data-[a-zA-Z0-9_-]+="[^"]*"', '', html)
    html = re.sub(r'\s+data-[a-zA-Z0-9_-]+', '', html)
    
    # Clean up empty divs or spans
    html = re.sub(r'<div[^>]*>\s*</div>', '', html)
    
    # Remove inline style="text-align: left;"
    html = re.sub(r'\s+style="text-align:\s*left;?"', '', html)
    
    # Normalize unescaped entities
    html = unescape(html)
    return html.strip()

for p in posts:
    p["content"] = clean_html(p["content"])
    p["title"] = unescape(p["title"])
    p["categories"] = [unescape(c) for c in p["categories"]]

with open(posts_file, "w", encoding="utf-8") as f:
    json.dump(posts, f, indent=2, ensure_ascii=False)

print(f"Sanitized {len(posts)} posts successfully!")

# Let's also sanitize products
products_file = Path(r"R:\Gemini-Workspace\Pelican-web\pelican-app\src\data\products.json")
with open(products_file, "r", encoding="utf-8") as f:
    products = json.load(f)

for prod in products:
    prod["description"] = clean_html(prod["description"])
    prod["short_description"] = clean_html(prod["short_description"])
    prod["name"] = unescape(prod["name"])
    prod["categories"] = [unescape(c) for c in prod["categories"]]

with open(products_file, "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"Sanitized {len(products)} products successfully!")
