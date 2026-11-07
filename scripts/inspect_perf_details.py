import fitz
import re

for fname in ["download-home-new.pdf", "download-product-new.pdf", "download-service-new.pdf"]:
    doc = fitz.open(f'R:\\Gemini-Workspace\\Pelican-web\\SEO-test-lighthouse\\{fname}')
    print("=" * 60)
    print(fname)
    full_text = "\n".join([page.get_text() for page in doc])
    
    # Extract opportunities
    savings = re.findall(r'([A-Za-z0-9\s—–\-\(\)\/\.\:\,]+Est savings[^\n]+)', full_text)
    for s in set(savings):
        print("  Savings:", s.strip())
        
    diags = re.findall(r'(Reduce JavaScript execution time[^\n]+|Minimize main-thread work[^\n]+|Avoid large layout shifts[^\n]+|Largest Contentful Paint image was not[^\n]+|Image elements do not have explicit[^\n]+|Serve static assets with an efficient cache[^\n]+|Reduce unused JavaScript[^\n]+|Reduce unused CSS[^\n]+|Render-blocking[^\n]+)', full_text, re.IGNORECASE)
    for d in set(diags):
        print("  Diag:", d.strip())
