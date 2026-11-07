import urllib.request
import re

def check_lang(cookie):
    req = urllib.request.Request('http://localhost:3000')
    if cookie:
        req.add_header('Cookie', cookie)
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        m = re.search(r'<html[^>]+lang="([^"]+)"', html)
        h1 = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
        return (m.group(1) if m else None, h1.group(1).strip() if h1 else None)

print('No cookie :', check_lang(None))
print('Cookie ID :', check_lang('NEXT_LOCALE=id'))
print('Cookie EN :', check_lang('NEXT_LOCALE=en'))
