import json

with open("Pelican-web/pelican-app/src/data/posts.json", "r", encoding="utf-8") as f:
    posts = json.load(f)

print(f"Total posts: {len(posts)}")
for i, p in enumerate(posts):
    t = p.get("title", "")
    e = p.get("excerpt", "")
    slug = p.get("slug", "")
    print(f"\n[{i+1}] Slug: {slug}")
    print(f"    Title ({len(t)}): {t}")
    print(f"    Excerpt ({len(e)}): {e}")
