import fitz

def inspect_page(pdf_name, search_terms):
    doc = fitz.open(f'R:\\Gemini-Workspace\\Pelican-web\\SEO-test-lighthouse\\{pdf_name}')
    print("=" * 60)
    print(f"INSPECTING: {pdf_name}")
    for page_idx, page in enumerate(doc):
        t = page.get_text()
        for term in search_terms:
            if term.lower() in t.lower():
                print(f"--- MATCH on Page {page_idx + 1} for '{term}' ---")
                for line in t.splitlines():
                    if any(st.lower() in line.lower() for st in [term, "gagal", "fail", "skor", "audit", "elemen", "rasio", "kontras", "canonical", "robots", "link", "deskripsi", "title"]):
                        print("  ", line.strip())

# 1. Home SEO
inspect_page("download-home-new.pdf", ["seo", "pencarian", "audit yang tidak lolos", "audit yang gagal", "crawl", "link"])

# 2. Product a11y
inspect_page("download-product-new.pdf", ["kontras", "contrast", "elemen yang gagal"])

# 3. Rent a11y
inspect_page("download-rent-new.pdf", ["kontras", "contrast", "elemen yang gagal"])
