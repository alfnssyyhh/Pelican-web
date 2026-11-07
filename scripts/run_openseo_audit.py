import urllib.request
import urllib.parse
import urllib.error
import time
import re
import json
from html.parser import HTMLParser

BASE_URL = "http://localhost:3000"

# OpenSEO Audit Thresholds (extracted 1:1 from open-seo/src/server/lib/audit/issues/page-reporters.ts)
TITLE_MAX_CHARS = 60
TITLE_MIN_CHARS = 10
META_DESCRIPTION_MAX_CHARS = 160
META_DESCRIPTION_MIN_CHARS = 70
THIN_CONTENT_WORDS = 150
SLOW_RESPONSE_MS = 1500

class OpenSEOPageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.meta_description = ""
        self.canonical_url = None
        self.robots_meta = ""
        self.h1_count = 0
        self.h1_texts = []
        self.heading_order = []  # list of int heading levels, e.g. [1, 2, 3, 2, 3]
        self.current_heading_level = None
        self.current_heading_text = ""
        self.images_total = 0
        self.images_missing_alt = 0
        self.images_without_alt_list = []
        self.links = []  # list of {href, text, is_internal}
        self.current_link_href = None
        self.current_link_text = ""
        self.word_tokens = []
        self.in_ignored_tag = 0  # script, style, noscript, svg
        self.json_ld_scripts = []
        self.in_json_ld = False
        self.json_ld_text = ""
        self.alternates = {} # hreflang -> href

    def handle_starttag(self, tag, attrs):
        attrs_dict = {k.lower(): (v or "") for k, v in attrs}

        if tag in ("script", "style", "noscript", "svg"):
            self.in_ignored_tag += 1
            if tag == "script" and attrs_dict.get("type") == "application/ld+json":
                self.in_json_ld = True
                self.json_ld_text = ""
            return

        if tag == "title":
            self.in_title = True
            return

        if tag == "meta":
            name = attrs_dict.get("name", "").lower()
            prop = attrs_dict.get("property", "").lower()
            content = attrs_dict.get("content", "")
            if name == "description" or prop == "og:description":
                if not self.meta_description and name == "description":
                    self.meta_description = content.strip()
                elif not self.meta_description and prop == "og:description":
                    self.meta_description = content.strip()
            if name in ("robots", "googlebot"):
                self.robots_meta += " " + content.lower()

        if tag == "link":
            rel = attrs_dict.get("rel", "").lower()
            href = attrs_dict.get("href", "")
            if rel == "canonical":
                self.canonical_url = href.strip()
            elif rel == "alternate" and "hreflang" in attrs_dict:
                self.alternates[attrs_dict["hreflang"]] = href.strip()

        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            lvl = int(tag[1])
            self.heading_order.append(lvl)
            self.current_heading_level = lvl
            self.current_heading_text = ""
            if lvl == 1:
                self.h1_count += 1

        if tag == "img":
            self.images_total += 1
            src = attrs_dict.get("src", attrs_dict.get("data-src", ""))
            alt = attrs_dict.get("alt")
            if alt is None:
                self.images_missing_alt += 1
                self.images_without_alt_list.append(src)

        if tag == "a":
            href = attrs_dict.get("href", "").strip()
            if href and not href.startswith(("javascript:", "mailto:", "tel:", "#")):
                self.current_link_href = href
                self.current_link_text = ""

    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript", "svg"):
            if self.in_ignored_tag > 0:
                self.in_ignored_tag -= 1
            if tag == "script" and self.in_json_ld:
                self.in_json_ld = False
                self.json_ld_scripts.append(self.json_ld_text)
            return

        if tag == "title":
            self.in_title = False
            return

        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            if self.current_heading_level == 1:
                self.h1_texts.append(self.current_heading_text.strip())
            self.current_heading_level = None

        if tag == "a":
            if self.current_link_href:
                self.links.append({
                    "href": self.current_link_href,
                    "text": self.current_link_text.strip()
                })
            self.current_link_href = None

    def handle_data(self, data):
        if self.in_ignored_tag > 0:
            if self.in_json_ld:
                self.json_ld_text += data
            return

        if self.in_title:
            self.title += data

        if self.current_heading_level:
            self.current_heading_text += data

        if self.current_link_href:
            self.current_link_text += data

        cleaned = data.strip()
        if cleaned:
            words = re.findall(r"\w+", cleaned)
            self.word_tokens.extend(words)

def has_heading_level_skip(order):
    for i in range(1, len(order)):
        if order[i] > order[i - 1] + 1:
            return True, f"H{order[i-1]} -> H{order[i]}"
    return False, ""

def audit_url(url, locale="id"):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "OpenSEO-Audit/1.0 (+https://openseo.so/docs/crawler)",
            "Accept": "text/html,application/xhtml+xml",
            "Cookie": f"NEXT_LOCALE={locale}"
        }
    )
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            elapsed_ms = int((time.time() - t0) * 1000)
            status_code = resp.status
            content_type = resp.headers.get("Content-Type", "")
            raw_html = resp.read().decode("utf-8", errors="replace")
            header_canonical = resp.headers.get("Link")
    except urllib.error.HTTPError as e:
        elapsed_ms = int((time.time() - t0) * 1000)
        return {
            "url": url,
            "status_code": e.code,
            "error": str(e),
            "elapsed_ms": elapsed_ms,
            "issues": [{"type": "broken-page" if e.code < 500 else "server-error", "severity": "warning" if e.code < 500 else "critical", "detail": f"Status {e.code}"}]
        }
    except Exception as e:
        elapsed_ms = int((time.time() - t0) * 1000)
        return {
            "url": url,
            "status_code": 0,
            "error": str(e),
            "elapsed_ms": elapsed_ms,
            "issues": [{"type": "blocked-page", "severity": "critical", "detail": str(e)}]
        }

    parser = OpenSEOPageParser()
    parser.feed(raw_html)

    issues = []
    
    # 1. Status & Performance
    if elapsed_ms > SLOW_RESPONSE_MS:
        issues.append({"type": "slow-response", "severity": "info", "detail": f"{elapsed_ms}ms > {SLOW_RESPONSE_MS}ms"})

    # 2. Robots / Indexability
    is_indexable = "noindex" not in parser.robots_meta.lower()
    if not is_indexable:
        issues.append({"type": "noindex-page", "severity": "warning", "detail": parser.robots_meta.strip()})

    # 3. Canonical
    if not parser.canonical_url:
        issues.append({"type": "missing-canonical", "severity": "warning", "detail": "No rel=canonical defined"})

    # 4. Title
    title = parser.title.strip()
    if not title:
        issues.append({"type": "missing-title", "severity": "critical", "detail": "Missing <title> tag"})
    elif len(title) > TITLE_MAX_CHARS:
        issues.append({"type": "title-too-long", "severity": "info", "detail": f"{len(title)} chars > {TITLE_MAX_CHARS} ({title[:50]}...)"})
    elif len(title) < TITLE_MIN_CHARS:
        issues.append({"type": "title-too-short", "severity": "info", "detail": f"{len(title)} chars < {TITLE_MIN_CHARS} ({title})"})

    # 5. Meta Description
    desc = parser.meta_description.strip()
    if not desc:
        issues.append({"type": "missing-meta-description", "severity": "warning", "detail": "Missing meta description"})
    elif len(desc) > META_DESCRIPTION_MAX_CHARS:
        issues.append({"type": "meta-description-too-long", "severity": "info", "detail": f"{len(desc)} chars > {META_DESCRIPTION_MAX_CHARS} ({desc[:50]}...)"})
    elif len(desc) < META_DESCRIPTION_MIN_CHARS:
        issues.append({"type": "meta-description-too-short", "severity": "info", "detail": f"{len(desc)} chars < {META_DESCRIPTION_MIN_CHARS} ({desc})"})

    # 6. Headings
    if parser.h1_count == 0:
        issues.append({"type": "missing-h1", "severity": "warning", "detail": "0 H1 headings found"})
    elif parser.h1_count > 1:
        issues.append({"type": "multiple-h1", "severity": "warning", "detail": f"{parser.h1_count} H1 headings found: {parser.h1_texts}"})

    has_skip, skip_detail = has_heading_level_skip(parser.heading_order)
    if has_skip:
        issues.append({"type": "heading-order-skip", "severity": "info", "detail": f"Skipped heading level: {skip_detail}"})

    # 7. Content Quality
    word_count = len(parser.word_tokens)
    if is_indexable and word_count < THIN_CONTENT_WORDS:
        issues.append({"type": "thin-content", "severity": "warning", "detail": f"{word_count} words < {THIN_CONTENT_WORDS}"})

    # 8. Images Alt
    if parser.images_missing_alt > 0:
        issues.append({"type": "images-missing-alt", "severity": "warning", "detail": f"{parser.images_missing_alt} / {parser.images_total} images missing alt: {parser.images_without_alt_list[:2]}"})

    # 9. Outgoing Links
    if is_indexable and len(parser.links) == 0:
        issues.append({"type": "no-outgoing-links", "severity": "warning", "detail": "0 outgoing links"})

    return {
        "url": url,
        "status_code": status_code,
        "elapsed_ms": elapsed_ms,
        "title": title,
        "title_len": len(title),
        "desc": desc,
        "desc_len": len(desc),
        "canonical": parser.canonical_url,
        "h1_count": parser.h1_count,
        "h1_text": parser.h1_texts[0] if parser.h1_texts else None,
        "heading_order": parser.heading_order,
        "word_count": word_count,
        "images_total": parser.images_total,
        "images_missing_alt": parser.images_missing_alt,
        "links_count": len(parser.links),
        "links": parser.links,
        "json_ld_count": len(parser.json_ld_scripts),
        "alternates": parser.alternates,
        "issues": issues
    }

def main():
    print("=" * 80)
    print("🚀 OpenSEO Comprehensive Audit Runner (Every-App OpenSEO Engine v1.0)")
    print(f"Target: {BASE_URL} (PT Pelican Mitra Sejati)")
    print("=" * 80)

    # 1. Discover URLs from sitemap.xml
    sitemap_url = f"{BASE_URL}/sitemap.xml"
    print(f"\n[1/4] Fetching sitemap: {sitemap_url}")
    req = urllib.request.Request(sitemap_url, headers={"User-Agent": "OpenSEO-Audit/1.0"})
    with urllib.request.urlopen(req) as resp:
        sitemap_xml = resp.read().decode("utf-8")
    
    locs = re.findall(r"<loc>(.*?)</loc>", sitemap_xml)
    print(f"  Found {len(locs)} URLs declared in sitemap.xml")

    # Map production URLs to localhost URLs
    urls_to_test = []
    for loc in locs:
        path = urllib.parse.urlparse(loc).path
        if not path:
            path = "/"
        urls_to_test.append(f"{BASE_URL}{path}")

    # Add key functional routes if not in sitemap
    extra_paths = ["/", "/service", "/rent", "/product", "/artikel", "/works", "/contact"]
    for ep in extra_paths:
        target = f"{BASE_URL}{ep}"
        if target not in urls_to_test:
            urls_to_test.append(target)

    # Deduplicate while preserving order
    seen = set()
    unique_urls = []
    for u in urls_to_test:
        if u not in seen:
            seen.add(u)
            unique_urls.append(u)

    print(f"  Total unique URLs to crawl and audit: {len(unique_urls)}")

    # 2. Audit each URL
    print(f"\n[2/4] Auditing all pages using OpenSEO analysis pipeline...")
    results = []
    for idx, u in enumerate(unique_urls, start=1):
        rel_path = urllib.parse.urlparse(u).path or "/"
        res = audit_url(u, locale="id")
        results.append(res)
        crit = sum(1 for i in res["issues"] if i["severity"] == "critical")
        warn = sum(1 for i in res["issues"] if i["severity"] == "warning")
        info = sum(1 for i in res["issues"] if i["severity"] == "info")
        status_icon = "✅ PASS" if (crit == 0 and warn == 0) else ("⚠️ WARN" if crit == 0 else "❌ FAIL")
        print(f"  [{idx:02d}/{len(unique_urls):02d}] {status_icon} | {res['status_code']} ({res['elapsed_ms']:3d}ms) | H1: {res.get('h1_count', 0)} | Words: {res.get('word_count', 0):4d} | {rel_path}")

    # 3. Multipage checks (Duplicates, Broken Links, Orphan Pages)
    print(f"\n[3/4] Running OpenSEO Cross-Page / Multipage Checks...")
    all_issues = []
    for r in results:
        for iss in r.get("issues", []):
            all_issues.append({"url": r["url"], **iss})

    # Check Duplicate Titles
    title_map = {}
    for r in results:
        t = r.get("title")
        if t:
            title_map.setdefault(t, []).append(r["url"])
    
    dup_titles = {t: us for t, us in title_map.items() if len(us) > 1}
    for t, us in dup_titles.items():
        for u in us:
            all_issues.append({
                "url": u,
                "type": "duplicate-title",
                "severity": "warning",
                "detail": f"Duplicate title '{t[:40]}...' shared by {len(us)} pages"
            })

    # Check Duplicate Meta Descriptions
    desc_map = {}
    for r in results:
        d = r.get("desc")
        if d:
            desc_map.setdefault(d, []).append(r["url"])
    dup_descs = {d: us for d, us in desc_map.items() if len(us) > 1}
    for d, us in dup_descs.items():
        for u in us:
            all_issues.append({
                "url": u,
                "type": "duplicate-meta-description",
                "severity": "warning",
                "detail": f"Duplicate description '{d[:40]}...' shared by {len(us)} pages"
            })

    # Check Broken Internal Links
    print("  Checking internal link integrity...")
    all_internal_targets = set()
    for r in results:
        for l in r.get("links", []):
            href = l["href"]
            if href.startswith("/"):
                all_internal_targets.add(f"{BASE_URL}{href}")
            elif href.startswith(BASE_URL):
                all_internal_targets.add(href)

    broken_links = []
    for target in all_internal_targets:
        # Quick HEAD check
        try:
            req = urllib.request.Request(target, method="HEAD", headers={"User-Agent": "OpenSEO-Audit/1.0"})
            with urllib.request.urlopen(req, timeout=5) as resp:
                if resp.status >= 400:
                    broken_links.append((target, resp.status))
        except urllib.error.HTTPError as e:
            if e.code >= 400:
                broken_links.append((target, e.code))
        except Exception:
            pass

    for bl, code in broken_links:
        all_issues.append({
            "url": bl,
            "type": "broken-internal-link",
            "severity": "critical",
            "detail": f"Internal target returns HTTP {code}"
        })

    # 4. Summary & Score Compilation
    crit_total = sum(1 for i in all_issues if i["severity"] == "critical")
    warn_total = sum(1 for i in all_issues if i["severity"] == "warning")
    info_total = sum(1 for i in all_issues if i["severity"] == "info")

    print("\n" + "=" * 80)
    print("📊 OPENSEO AUDIT SUMMARY & VERDICT")
    print("=" * 80)
    print(f"Total Crawled Pages : {len(results)}")
    print(f"Total Issues Found  : {len(all_issues)}")
    print(f"  🔴 Critical Issues : {crit_total}")
    print(f"  🟡 Warnings        : {warn_total}")
    print(f"  🔵 Info Notices    : {info_total}")
    print(f"  🔗 Broken Links    : {len(broken_links)}")
    print(f"  📑 Duplicate Titles: {len(dup_titles)}")
    print(f"  📑 Duplicate Descs : {len(dup_descs)}")
    print("=" * 80)

    # Detailed issues list
    if all_issues:
        print("\n🔍 ISSUE BREAKDOWN:")
        for iss in all_issues:
            icon = "🔴" if iss["severity"] == "critical" else ("🟡" if iss["severity"] == "warning" else "🔵")
            rel = urllib.parse.urlparse(iss["url"]).path or "/"
            print(f"  {icon} [{iss['severity'].upper()}] {iss['type']} on {rel}: {iss.get('detail', '')}")
    else:
        print("\n🎉 PERFECT AUDIT! Zero critical errors, zero warnings, zero duplicate titles/descriptions!")

    # Save JSON report
    report_data = {
        "engine": "OpenSEO (every-app/open-seo)",
        "site": "PT Pelican Mitra Sejati",
        "target": BASE_URL,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "summary": {
            "crawled_pages": len(results),
            "total_issues": len(all_issues),
            "critical_issues": crit_total,
            "warnings": warn_total,
            "info_notices": info_total,
            "broken_internal_links": len(broken_links),
            "duplicate_titles": len(dup_titles),
            "duplicate_descriptions": len(dup_descs),
        },
        "pages": results,
        "all_issues": all_issues
    }
    
    out_path = r"R:\Gemini-Workspace\Pelican-web\openseo_audit_report.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)
    print(f"\nAudit results saved to: {out_path}")

if __name__ == "__main__":
    main()
