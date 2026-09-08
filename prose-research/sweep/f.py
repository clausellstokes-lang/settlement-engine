import sys,re,html,subprocess,os
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
os.makedirs("raw",exist_ok=True); os.makedirs("txt",exist_ok=True)
def go(url,name):
    r=subprocess.run(["curl","-sL","--compressed","-A",UA,url,"-o",f"raw/{name}.html","-w","%{http_code}"],capture_output=True,text=True)
    code=r.stdout.strip()
    s=open(f"raw/{name}.html",encoding="utf-8",errors="replace").read()
    s=re.sub(r'(?is)<(script|style|nav|footer|noscript)[^>]*>.*?</\1>',' ',s)
    s=re.sub(r'(?is)<br\s*/?>','\n',s)
    s=re.sub(r'(?is)</(p|div|h1|h2|h3|h4|li|tr|blockquote)>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s); s=html.unescape(s)
    s=re.sub(r'[ \t\xa0]+',' ',s); s=re.sub(r'\n\s*\n+','\n\n',s)
    open(f"txt/{name}.txt","w",encoding="utf-8").write(s.strip())
    print(f"HTTP {code} words={len(s.split())} {url} -> txt/{name}.txt")
for a in sys.argv[1:]:
    url,name=a.split("::")
    go(url,name)
