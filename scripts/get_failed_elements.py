import fitz

# 1. Product A11y failed elements
doc = fitz.open(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\download-product-new.pdf')
print("=== PRODUCT FAILED ELEMENTS ===")
for p in doc:
    txt = p.get_text()
    if "Warna latar belakang" in txt or "rasio kontras" in txt:
        print(txt)

# 2. Rent A11y failed elements
doc2 = fitz.open(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\download-rent-new.pdf')
print("=== RENT FAILED ELEMENTS ===")
for p in doc2:
    txt = p.get_text()
    if "Warna latar belakang" in txt or "rasio kontras" in txt:
        print(txt)

# 3. Home SEO failed audits
doc3 = fitz.open(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\download-home-new.pdf')
print("=== HOME SEO FAILED AUDITS ===")
for p in doc3:
    txt = p.get_text()
    if "SEO" in txt and ("92" in txt or "Gagal" in txt or "Audit yang tidak lolos" in txt or "tidak valid" in txt or "robot" in txt or "canonical" in txt):
        print(txt)
