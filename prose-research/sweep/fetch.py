import sys,re,html,subprocess,os
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
def get(url,name):
    p=f"raw/{name}.html"
    subprocess.run(["curl","-sL","--max-time","60","-A",UA,url,"-o",p])
    if not os.path.exists(p): return "FETCH FAILED"
    t=open(p,encoding='utf-8',errors='replace').read()
    n=len(t)
    t=re.sub(r'(?is)<(script|style|noscript).*?</\1>',' ',t)
    t=re.sub(r'(?s)<[^>]+>',' ',t)
    t=html.unescape(t)
    t=re.sub(r'[ \t]+',' ',t)
    t=re.sub(r'\n\s*\n+','\n',t)
    open(f"raw/{name}.txt","w",encoding='utf-8').write(t)
    return f"[{name}] html_bytes={n} text_chars={len(t)}"
if __name__=="__main__":
    print(get(sys.argv[1],sys.argv[2]))
