import fitz
import glob
import os

id_new_files = sorted(glob.glob(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\*-id-new.pdf'))

print(f"Found {len(id_new_files)} files ending with -id-new.pdf")

for f in id_new_files:
    fname = os.path.basename(f)
    doc = fitz.open(f)
    print("=" * 60)
    print(f"FILE: {fname} (Pages: {len(doc)})")
    
    p1 = doc[0].get_text()
    lines = [l.strip() for l in p1.splitlines() if l.strip()]
    
    # Extract scores
    scores = {}
    for metric in ["Performa", "Performance", "Aksesibilitas", "Accessibility", "Praktik Terbaik", "Best Practices", "SEO"]:
        for i, l in enumerate(lines[:35]):
            if l.lower() == metric.lower():
                val = lines[i+1] if i+1 < len(lines) else ""
                scores[metric] = val
                print(f"  {metric}: {val}")
                
    # Check metrics
    for k in ['First Contentful Paint', 'Largest Contentful Paint', 'Total Blocking Time', 'Cumulative Layout Shift', 'Speed Index']:
        for i, l in enumerate(lines):
            if k in l:
                print(f"  Metric {k}: {lines[i+1] if i+1 < len(lines) else ''}")
                
    # Search for failures
    full_text = "\n".join([page.get_text() for page in doc])
    failed_items = []
    for line in full_text.splitlines():
        if any(term in line.lower() for term in [
            "tidak memiliki rasio kontras", "insufficient color contrast",
            "link tidak memiliki teks deskriptif", "links do not have descriptive text",
            "target sentuh tidak memiliki", "masalah dicatat di panel issues",
            "audit yang tidak lolos", "audit yang gagal"
        ]):
            failed_items.append(line.strip())
            
    if failed_items:
        print("  Failing flags:")
        for it in set(failed_items):
            print("   *", it)
    else:
        print("  No major audit failure strings found.")
