import sys, re, html
raw = open(sys.argv[1], 'rb').read().decode('utf-8', 'replace')
raw = re.sub(r'(?is)<(script|style|noscript|svg|head)[^>]*>.*?</\1>', ' ', raw)
raw = re.sub(r'(?is)<!--.*?-->', ' ', raw)
raw = re.sub(r'(?i)<(br|/p|/div|/li|/h[1-6]|/tr)[^>]*>', '\n', raw)
raw = re.sub(r'(?s)<[^>]+>', ' ', raw)
raw = html.unescape(raw)
raw = re.sub(r'[ \t\xa0]+', ' ', raw)
raw = re.sub(r'\n\s*\n\s*\n+', '\n\n', raw)
lines = [l.strip() for l in raw.split('\n')]
print('\n'.join(l for l in lines if l))
