import re
import json
from pathlib import Path

sql_file = Path(r"R:\Gemini-Workspace\Pelican-web\pel91275_wp347.sql")
out_dir = Path(r"R:\Gemini-Workspace\Pelican-web\pelican-app\src\data")
out_dir.mkdir(parents=True, exist_ok=True)

print(f"Reading {sql_file}...")

# 1. Parse terms (categories and tags)
# In WP: wpnr_terms (term_id, name, slug, term_group)
# wpnr_term_taxonomy (term_taxonomy_id, term_id, taxonomy, description, parent, count)
# wpnr_term_relationships (object_id, term_taxonomy_id, term_order)

terms = {} # term_id -> {name, slug}
term_taxonomies = {} # term_taxonomy_id -> {term_id, taxonomy}
post_terms = {} # post_id -> list of {taxonomy, name, slug}
post_meta = {} # post_id -> {meta_key: meta_value}
posts = {} # post_id -> dict of post fields

with open(sql_file, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        # Check wpnr_terms
        if "INSERT INTO `wpnr_terms`" in line or line.startswith("(") and "INSERT INTO `wpnr_terms`" in line:
            pass

# Let's write a specialized parser for the SQL file
print("Parsing SQL tables...")

def parse_inserts(table_name, line_callback):
    collecting = False
    with open(sql_file, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            if f"INSERT INTO `{table_name}`" in line:
                collecting = True
            if collecting:
                line_callback(line)
                if line.strip().endswith(";"):
                    collecting = False

# Parse terms
all_terms = {} # term_id -> name
def terms_cb(line):
    # tuples: (term_id, 'name', 'slug', term_group)
    matches = re.findall(r"\((\d+),\s*'([^']*)',\s*'([^']*)',\s*\d+\)", line)
    for tid, name, slug in matches:
        all_terms[int(tid)] = {"term_id": int(tid), "name": name, "slug": slug}

parse_inserts("wpnr_terms", terms_cb)
print(f"Found {len(all_terms)} terms.")

# Parse term_taxonomy
all_tax = {} # tt_id -> {term_id, taxonomy}
def tax_cb(line):
    # (term_taxonomy_id, term_id, 'taxonomy', 'description', parent, count)
    matches = re.findall(r"\((\d+),\s*(\d+),\s*'([^']*)',", line)
    for ttid, tid, tax in matches:
        all_tax[int(ttid)] = {"term_id": int(tid), "taxonomy": tax}

parse_inserts("wpnr_term_taxonomy", tax_cb)
print(f"Found {len(all_tax)} term_taxonomies.")

# Parse term_relationships
all_rel = {} # post_id -> list of tt_id
def rel_cb(line):
    matches = re.findall(r"\((\d+),\s*(\d+),\s*\d+\)", line)
    for oid, ttid in matches:
        oid = int(oid)
        ttid = int(ttid)
        all_rel.setdefault(oid, []).append(ttid)

parse_inserts("wpnr_term_relationships", rel_cb)
print(f"Found {len(all_rel)} term relationships.")

# Parse postmeta
# (meta_id, post_id, 'meta_key', 'meta_value')
all_meta = {} # post_id -> {meta_key: meta_value}
def meta_cb(line):
    matches = re.findall(r"\(\d+,\s*(\d+),\s*'([^']*)',\s*(?:'((?:[^'\\]|\\.)*)'|NULL)\)", line)
    for pid, k, v in matches:
        pid = int(pid)
        all_meta.setdefault(pid, {})[k] = v.replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\') if v else ""

parse_inserts("wpnr_postmeta", meta_cb)
print(f"Found postmeta for {len(all_meta)} posts.")

# Parse posts
all_posts = []
all_products = []
all_attachments = {} # id -> guid / url

def posts_cb(line):
    # Regex to extract post rows
    # format: (\d+, \d+, 'date', 'date_gmt', 'content', 'title', 'excerpt', 'status', 'comment_status', 'ping_status', 'password', 'slug', 'to_ping', 'pinged', 'modified', 'modified_gmt', 'content_filtered', parent, 'guid', menu_order, 'post_type', 'mime_type', count)
    pattern = re.compile(
        r"\((\d+),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*'((?:[^'\\]|\\.)*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*(\d+),\s*'([^']*)',\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*(\d+)\)",
        re.DOTALL
    )
    for m in pattern.finditer(line):
        pid, author, date, date_gmt, content, title, excerpt, status, _, _, _, slug, _, _, modified, _, _, parent, guid, menu_order, post_type, mime_type, _ = m.groups()
        pid = int(pid)
        clean_content = content.replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\').replace('\\r\\n', '\n').replace('\\n', '\n')
        
        if post_type == 'attachment':
            all_attachments[pid] = guid
            
        elif post_type == 'post' and status in ['publish', 'draft']:
            # get terms
            ttids = all_rel.get(pid, [])
            cats = []
            tags = []
            for ttid in ttids:
                tinfo = all_tax.get(ttid)
                if tinfo:
                    term = all_terms.get(tinfo["term_id"])
                    if term:
                        if tinfo["taxonomy"] == 'category':
                            cats.append(term["name"])
                        elif tinfo["taxonomy"] == 'post_tag':
                            tags.append(term["name"])
            
            # thumbnail
            thumb_id = all_meta.get(pid, {}).get("_thumbnail_id")
            thumb_url = all_attachments.get(int(thumb_id)) if thumb_id and thumb_id.isdigit() else None
            
            all_posts.append({
                "id": pid,
                "title": title,
                "slug": slug or title.lower().replace(" ", "-"),
                "status": status,
                "date": date,
                "modified": modified,
                "excerpt": excerpt,
                "content": clean_content,
                "categories": cats,
                "tags": tags,
                "thumbnail_url": thumb_url
            })
            
        elif post_type == 'product' and status in ['publish', 'draft']:
            meta = all_meta.get(pid, {})
            ttids = all_rel.get(pid, [])
            cats = []
            tags = []
            for ttid in ttids:
                tinfo = all_tax.get(ttid)
                if tinfo:
                    term = all_terms.get(tinfo["term_id"])
                    if term:
                        if tinfo["taxonomy"] == 'product_cat':
                            cats.append(term["name"])
                        elif tinfo["taxonomy"] == 'product_tag':
                            tags.append(term["name"])
                            
            thumb_id = meta.get("_thumbnail_id")
            thumb_url = all_attachments.get(int(thumb_id)) if thumb_id and thumb_id.isdigit() else None
            
            all_products.append({
                "id": pid,
                "name": title,
                "slug": slug or title.lower().replace(" ", "-"),
                "status": status,
                "sku": meta.get("_sku", ""),
                "price": meta.get("_price", ""),
                "regular_price": meta.get("_regular_price", ""),
                "stock_status": meta.get("_stock_status", "instock"),
                "categories": cats,
                "tags": tags,
                "description": clean_content,
                "short_description": excerpt,
                "thumbnail_url": thumb_url
            })

parse_inserts("wpnr_posts", posts_cb)

print(f"Extracted {len(all_posts)} posts.")
print(f"Extracted {len(all_products)} products.")
print(f"Extracted {len(all_attachments)} attachments.")

# Write to JSON
with open(out_dir / "posts.json", "w", encoding="utf-8") as f:
    json.dump(all_posts, f, indent=2, ensure_ascii=False)

with open(out_dir / "products.json", "w", encoding="utf-8") as f:
    json.dump(all_products, f, indent=2, ensure_ascii=False)

with open(out_dir / "attachments.json", "w", encoding="utf-8") as f:
    json.dump(all_attachments, f, indent=2, ensure_ascii=False)

print("Saved to src/data successfully!")
