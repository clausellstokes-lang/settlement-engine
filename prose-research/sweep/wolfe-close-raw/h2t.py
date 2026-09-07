import sys, re, html
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s): super().__init__(); s.out=[]; s.skip=0
    def handle_starttag(s,t,a):
        if t in ('script','style','noscript'): s.skip+=1
        if t in ('p','br','div','li','h1','h2','h3','h4','tr','blockquote','pre'): s.out.append('\n')
    def handle_endtag(s,t):
        if t in ('script','style','noscript'): s.skip=max(0,s.skip-1)
        if t in ('p','div','li','h1','h2','h3','h4','tr','blockquote','pre'): s.out.append('\n')
    def handle_data(s,d):
        if not s.skip: s.out.append(d)
for f in sys.argv[1:]:
    p=P(); p.feed(open(f,encoding='utf-8',errors='replace').read())
    txt=html.unescape(''.join(p.out)); txt=re.sub(r'[ \t]+',' ',txt); txt=re.sub(r'\n\s*\n+','\n\n',txt)
    open(f.rsplit('.',1)[0]+'.txt','w').write(txt); print(f, len(txt))
