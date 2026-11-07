import fitz
import glob
import os

id_files = sorted(glob.glob(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\*-id.pdf'))

for f in id_files:
    fname = os.path.basename(f)
    doc = fitz.open(f)
    print("=" * 60)
    print("INSPECTING:", fname)
    
    # Check top lines of page 1
    p1 = doc[0].get_text()
    lines = [l.strip() for l in p1.splitlines() if l.strip()]
    for i, l in enumerate(lines[:35]):
        if l in ["Performa", "Aksesibilitas", "Praktik Terbaik", "SEO"]:
            print(f"  {l}: {lines[i+1] if i+1 < len(lines) else ''}")
            
    # Check for OPPORTUNITIES, DIAGNOSTICS, or FAILED AUDITS
    full_text = "\n".join([page.get_text() for page in doc])
    
    # Look for audits scored < 1 or opportunities
    # In Indonesian Lighthouse: "Audit yang tidak lolos" or "Elemen yang Gagal"
    for p_idx, page in enumerate(doc):
        t = page.get_text()
        if "elemen yang gagal" in t.lower() or "audit yang tidak lolos" in t.lower() or "peringatan" in t.lower():
            # filter out unscored / tidak dinilai
            p_lines = t.splitlines()
            for idx, pl in enumerate(p_lines):
                if any(w in pl.lower() for w in ["gagal", "tidak lolos", "peringatan", "warning"]):
                    context = p_lines[max(0, idx-2):min(len(p_lines), idx+3)]
                    clean_c = " | ".join([c.strip() for c in context if c.strip()])
                    print(f"    [P{p_idx+1}] {clean_c}")
