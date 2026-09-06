import re,html,sys
def conv(p):
    s=open(p,encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',s)
    s=re.sub(r'(?s)<[^>]+>','\n',s)
    s=html.unescape(s)
    lines=[l.strip() for l in s.split('\n')]
    return '\n'.join(l for l in lines if l)
if __name__=='__main__':
    for p in sys.argv[1:]:
        t=conv(p); o=p.rsplit('.',1)[0]+'.txt'; open(o,'w').write(t); print(o,len(t))
