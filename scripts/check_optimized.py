import urllib.request
import re
from PIL import Image
import io

req = urllib.request.Request('http://localhost:3000/product', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

urls = re.findall(r'src="(/_next/image\?[^"]+)"', html)
print('Found image optimizer URLs:', len(urls))
for u in urls[:3]:
    full_url = 'http://localhost:3000' + u.replace('&amp;', '&')
    print('Testing optimizer URL:', full_url[:80])
    resp = urllib.request.urlopen(full_url)
    img_data = resp.read()
    im = Image.open(io.BytesIO(img_data)).convert('RGBA')
    print('Optimized image size:', im.size)
    # Check if there are any blue pixels in the top-left area
    blue_count = 0
    w, h = im.size
    for y in range(min(50, h)):
        for x in range(min(80, w)):
            r, g, b, a = im.getpixel((x, y))
            if a > 200 and r < 60 and g < 90 and b > 70:
                blue_count += 1
    print('Blue pixels in top-left of optimized image:', blue_count)
