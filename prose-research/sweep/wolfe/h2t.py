import sys, re, html
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.skip=0
    def handle_starttag(s,t,a):
        if t in ('script','style','noscript','nav','header','footer'): s.skip+=1
        if t in ('p','div','br','li','h1','h2','h3','h4','blockquote','tr'): s.out.append('\n')
    def handle_endtag(s,t):
        if t in ('script','style','noscript','nav','header','footer'): s.skip=max(0,s.skip-1)
        if t in ('p','div','li','h1','h2','h3','h4','blockquote'): s.out.append('\n')
    def handle_data(s,d):
        if not s.skip: s.out.append(d)
p=P(); p.feed(open(sys.argv[1],encoding='utf-8',errors='replace').read())
t=''.join(p.out); t=re.sub(r'[ \t]+',' ',t); t=re.sub(r'\n\s*\n+','\n\n',t)
print(t)
