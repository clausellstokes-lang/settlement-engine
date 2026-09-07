import re, html, sys, glob, os
for f in sorted(glob.glob("*.html")):
    s = open(f, encoding="utf-8", errors="replace").read()
    s = re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>', ' ', s)
    s = re.sub(r'(?i)<br\s*/?>', '\n', s)
    s = re.sub(r'(?i)</(p|div|li|h[1-6]|tr|blockquote)>', '\n\n', s)
    s = re.sub(r'(?s)<[^>]+>', ' ', s)
    s = html.unescape(s)
    s = s.replace(' ',' ')
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\n\s*\n\s*\n+', '\n\n', s)
    out = os.path.splitext(f)[0] + ".txt"
    open(out,'w',encoding='utf-8').write(s)
    print(out, len(s))
