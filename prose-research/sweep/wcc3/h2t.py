import sys,re,html
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.out=[]; self.skip=0
    def handle_starttag(self,t,a):
        if t in ('script','style','nav','svg'): self.skip+=1
        if t in ('p','br','div','li','h1','h2','h3','h4','blockquote','tr'): self.out.append('\n')
    def handle_endtag(self,t):
        if t in ('script','style','nav','svg') and self.skip: self.skip-=1
        if t in ('p','div','li','h1','h2','h3','h4','blockquote','tr'): self.out.append('\n')
    def handle_data(self,d):
        if not self.skip: self.out.append(d)
p=P(); p.feed(open(sys.argv[1],encoding='utf-8',errors='replace').read())
t=''.join(p.out); t=re.sub(r'\n{3,}','\n\n',t); t=re.sub(r'[ \t]{2,}',' ',t)
print(t)
