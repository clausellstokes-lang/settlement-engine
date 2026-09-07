import sys, re
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.skip=0; s.cur=[]; s.keep=('p','h1','h2','h3','h4','li','blockquote','figcaption')
        s.inkeep=0
    def handle_starttag(s,t,a):
        if t in ('script','style','nav','footer','header','aside','noscript','svg'): s.skip+=1
        if t in s.keep: s.inkeep+=1
        if t=='br' and s.inkeep: s.cur.append(' ')
    def handle_endtag(s,t):
        if t in ('script','style','nav','footer','header','aside','noscript','svg'): s.skip=max(0,s.skip-1)
        if t in s.keep and s.inkeep:
            s.inkeep-=1
            txt=re.sub(r'\s+',' ',''.join(s.cur)).strip()
            if txt: s.out.append(txt)
            s.cur=[]
    def handle_data(s,d):
        if s.skip==0 and s.inkeep: s.cur.append(d)
for f in sys.argv[1:]:
    p=P(); p.feed(open(f,encoding='utf-8',errors='ignore').read())
    o=f.rsplit('.',1)[0]+'.txt'
    open(o,'w').write('\n\n'.join(p.out))
    print(o, len(p.out), sum(len(x) for x in p.out))
