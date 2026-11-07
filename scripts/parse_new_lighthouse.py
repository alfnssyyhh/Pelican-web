import fitz
import glob
import os
import re

pdf_files = glob.glob(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\*-new.pdf')

for f in sorted(pdf_files):
    fname = os.path.basename(f)
    doc = fitz.open(f)
    print("=" * 60)
    print(f"FILE: {fname}")
    p1 = doc[0].get_text()
    
    lines = [l.strip() for l in p1.splitlines() if l.strip()]
    print("Top page 1 lines:", lines[:25])
    
    full_text = "\n".join([page.get_text() for page in doc])
    
    # Check metric numbers
    for i, l in enumerate(lines):
        if any(k in l for k in ['First Contentful Paint', 'Largest Contentful Paint', 'Total Blocking Time', 'Cumulative Layout Shift', 'Speed Index']):
            print(f"  Metric {l}: {lines[i+1] if i+1 < len(lines) else ''}")

    # Check for accessibility failures
    acc_fails = re.findall(r'(\[?[a-zA-Z0-9_\-\.\#\:\s\"\'\=\>\<\(\)]+does not have sufficient color contrast[^\n]+|Background and foreground colors do not have a sufficient contrast ratio[^\n]+|Heading elements are not in a sequentially-descending order[^\n]+|Links do not have a discernible name[^\n]+|Buttons do not have an accessible name[^\n]+|Target sentuh tidak memiliki ukuran[^\n]+|Warna latar belakang dan latar depan tidak memiliki[^\n]+)', full_text, re.IGNORECASE)
    if acc_fails:
        print("  A11y fails:", set(acc_fails))
    else:
        print("  A11y: No major failures detected!")
        
    # Check for Best Practices issues
    bp_fails = re.findall(r'(Issues were logged to the console[^\n]+|Missing doctype[^\n]+|Detected [0-9]+ errors logged to the console[^\n]+|Masalah dicatat di panel Issues[^\n]+)', full_text, re.IGNORECASE)
    if bp_fails:
        print("  Best Practices fails:", set(bp_fails))
    else:
        print("  Best Practices: No failures detected!")
