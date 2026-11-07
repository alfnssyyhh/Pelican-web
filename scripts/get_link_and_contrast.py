import fitz

# 1. Home SEO failed link details
doc = fitz.open(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\download-home-new.pdf')
print("=== HOME LINK DETAILS ===")
for p_idx in [30, 31, 32]:
    if p_idx < len(doc):
        print(f"--- PAGE {p_idx+1} ---")
        print(doc[p_idx].get_text())

# 2. Product contrast details
doc2 = fitz.open(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\download-product-new.pdf')
print("=== PRODUCT CONTRAST DETAILS ===")
for p_idx in [8, 9, 10]:
    if p_idx < len(doc2):
        print(f"--- PAGE {p_idx+1} ---")
        print(doc2[p_idx].get_text())
