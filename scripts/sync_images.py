import json
import shutil
from pathlib import Path
from urllib.parse import urlparse

uploads_src = Path(r"R:\Gemini-Workspace\Pelican-web\public_html\wp-content\uploads")
uploads_dst = Path(r"R:\Gemini-Workspace\Pelican-web\pelican-app\public\uploads")
uploads_dst.mkdir(parents=True, exist_ok=True)

# Load attachments
with open(r"R:\Gemini-Workspace\Pelican-web\pelican-app\src\data\attachments.json", "r", encoding="utf-8") as f:
    attachments = json.load(f)

# Load products & posts
with open(r"R:\Gemini-Workspace\Pelican-web\pelican-app\src\data\products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

with open(r"R:\Gemini-Workspace\Pelican-web\pelican-app\src\data\posts.json", "r", encoding="utf-8") as f:
    posts = json.load(f)

# In postmeta, find thumbnail id mapping
# Let's see which attachments are used
import re
sql_file = Path(r"R:\Gemini-Workspace\Pelican-web\pel91275_wp347.sql")
meta_thumbs = {} # post_id -> thumb_id
with open(sql_file, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        if "INSERT INTO `wpnr_postmeta`" in line or "_thumbnail_id" in line:
            matches = re.findall(r"\(\d+,\s*(\d+),\s*'_thumbnail_id',\s*'(\d+)'\)", line)
            for pid, tid in matches:
                meta_thumbs[int(pid)] = int(tid)

print(f"Found {len(meta_thumbs)} thumbnail mappings in postmeta.")

copied_count = 0
# Copy image and update local path
for prod in products:
    pid = prod["id"]
    tid = meta_thumbs.get(pid)
    if tid and str(tid) in attachments:
        url = attachments[str(tid)]
        # url e.g. https://pelican-ms.com/wp-content/uploads/2026/08/gasket-kta19.png
        parsed = urlparse(url)
        # relative path after /uploads/
        rel_path = parsed.path.split("/uploads/")[-1]
        src_file = uploads_src / rel_path
        dst_file = uploads_dst / rel_path
        if src_file.exists():
            dst_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_file, dst_file)
            copied_count += 1
            prod["thumbnail_url"] = f"/uploads/{rel_path}"
        else:
            print(f"Warning: file not found: {src_file}")

for post in posts:
    pid = post["id"]
    tid = meta_thumbs.get(pid)
    if tid and str(tid) in attachments:
        url = attachments[str(tid)]
        parsed = urlparse(url)
        rel_path = parsed.path.split("/uploads/")[-1]
        src_file = uploads_src / rel_path
        dst_file = uploads_dst / rel_path
        if src_file.exists():
            dst_file.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_file, dst_file)
            copied_count += 1
            post["thumbnail_url"] = f"/uploads/{rel_path}"

# Save updated json
with open(r"R:\Gemini-Workspace\Pelican-web\pelican-app\src\data\products.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

with open(r"R:\Gemini-Workspace\Pelican-web\pelican-app\src\data\posts.json", "w", encoding="utf-8") as f:
    json.dump(posts, f, indent=2, ensure_ascii=False)

print(f"Copied {copied_count} thumbnail images to public/uploads!")
