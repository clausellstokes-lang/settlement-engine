import sys, re, json, html, urllib.parse, subprocess, os, hashlib
BOOK="9uAsEAAAQBAJ"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
D=os.path.dirname(os.path.abspath(__file__))
def q(term):
    key=hashlib.md5(term.encode()).hexdigest()[:10]
    f=os.path.join(D,"c_%s.html"%key)
    if not os.path.exists(f) or os.path.getsize(f)<10000:
        url="https://books.google.com/books?id=%s&q=%s"%(BOOK,urllib.parse.quote(term))
        subprocess.run(["curl","-sL","-A",UA,url,"-o",f],check=True)
    s=open(f,encoding='utf-8',errors='replace').read()
    res=re.findall(r'\{"page_id":"(.*?)","page_number":"(.*?)","snippet_text":"(.*?)"\}',s)
    out=[]
    for pid,pn,sn in res:
        t=sn.encode().decode('unicode_escape')
        t=re.sub(r'<[^>]+>','',t)
        t=html.unescape(t)
        t=t.replace('\xa0',' ')
        t=re.sub(r'\s+',' ',t).strip()
        out.append((pn,t))
    return out
for term in sys.argv[1:]:
    print("="*20,"QUERY:",term)
    r=q(term)
    if not r: print("  (no snippet results)")
    for pn,t in r: print("  [p.%s] %s"%(pn,t))
