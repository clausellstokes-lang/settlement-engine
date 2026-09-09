import sys, re, html
raw = open(sys.argv[1], encoding='utf-8', errors='ignore').read()
raw = re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>', ' ', raw)
raw = re.sub(r'(?i)<br\s*/?>|</p>|</div>|</h\d>|</li>', '\n', raw)
txt = re.sub(r'<[^>]+>', ' ', raw)
txt = html.unescape(txt)
txt = re.sub(r'[ \t\xa0]+', ' ', txt)
txt = re.sub(r'\n\s*\n+', '\n', txt)
print(txt)
