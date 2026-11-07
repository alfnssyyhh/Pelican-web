import fitz

for fname in ["download-service-id.pdf", "download-marine-automation-marine-navigation-marine-electrical-support-id.pdf"]:
    doc = fitz.open(f'R:\\Gemini-Workspace\\Pelican-web\\SEO-test-lighthouse\\{fname}')
    print("=" * 60)
    print("CHECKING CLS IN:", fname)
    for p_idx, page in enumerate(doc):
        t = page.get_text()
        if "pergeseran tata letak" in t.lower() or "cumulative layout shift" in t.lower() or "cls" in t.lower():
            for line in t.splitlines():
                if any(k in line.lower() for k in ["cls", "pergeseran", "shift", "layout", "elemen"]):
                    if len(line.strip()) < 120:
                        print(f"  [P{p_idx+1}]", line.strip())
