import json

POSTS_PATH = "Pelican-web/pelican-app/src/data/posts.json"

EXCERPT_MAP = {
    "marine-automation-marine-navigation-marine-electrical-support": "Rapid technical diagnostics and mobilization for marine automation, navigation electronics, and electrical distribution across Batam shipyards.",
    "diesel-engine-troubleshooting-memahami-masalah-sebelum-kerusakan-menjadi-lebih-besar": "Disciplined diagnostic methodology for identifying and resolving marine diesel engine faults based on telemetry data and root cause analysis in Batam.",
    "rental-genset-untuk-marine-oil-gas-dan-industri-batam": "Certified silent and containerized diesel generator fleet from 25 to 1250 kVA for marine shipyards, offshore platforms, and industries in Batam.",
    "marine-diesel-engine-support-service-parts-warranty": "Disciplined maintenance for propulsion and auxiliary diesel engines, top overhauls, cylinder head reconditioning, and fuel calibration in Batam.",
    "marine-navigation-system-control-panel": "Custom design, fabrication, and testing of marine switchboards, motor control centers, and automation consoles meeting international standards.",
    "odme-troubleshooting-and-repair-service": "Diagnostics and repairs for tanker ODME systems, oil content meters, and overboard discharge valves under MARPOL Annex I standards in Batam."
}

with open(POSTS_PATH, "r", encoding="utf-8") as f:
    posts = json.load(f)

updated_count = 0
for post in posts:
    slug = post.get("slug")
    if slug in EXCERPT_MAP:
        new_excerpt = EXCERPT_MAP[slug]
        post["excerpt"] = new_excerpt
        if "excerpt_en" in post:
            post["excerpt_en"] = new_excerpt
        if "excerpt_id" in post:
            post["excerpt_id"] = new_excerpt
        updated_count += 1
        print(f"Updated {slug}: {len(new_excerpt)} chars")

with open(POSTS_PATH, "w", encoding="utf-8") as f:
    json.dump(posts, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully updated {updated_count} posts in {POSTS_PATH}")
