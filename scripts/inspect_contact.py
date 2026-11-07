import fitz

doc = fitz.open(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\download-contact.pdf')
full_text = ""
for page_num, page in enumerate(doc):
    t = page.get_text()
    if any(k in t.lower() for k in ["praktik terbaik", "best practice", "kesalahan", "error", "console", "keamanan", "security", "rasio kontras", "kontras", "formulir", "label"]):
        print(f"--- PAGE {page_num+1} ---")
        for line in t.splitlines():
            line_str = line.strip()
            if any(k in line_str.lower() for k in ["praktik terbaik", "browser error", "console", "audit", "kontras", "contrast", "label", "input", "form", "aria", "link", "gagal", "fail", "peringatan"]):
                print("   ", line_str)
