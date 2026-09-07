import sys, subprocess, re, html, os
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15"
def strip(h):
    h=re.sub(r'(?is)<(script|style|noscript|svg|header|footer|nav)[^>]*>.*?</\1>','',h)
    h=re.sub(r'(?is)<br\s*/?>','\n',h); h=re.sub(r'(?is)</(p|div|h\d|li|tr|blockquote)>','\n',h)
    h=re.sub(r'(?s)<[^>]+>','',h); h=html.unescape(h)
    h=re.sub(r'[ \t\r\f\v]+',' ',h); h=re.sub(r'\n\s*\n+','\n\n',h)
    return h.strip()
for line in open(sys.argv[1]):
    line=line.strip()
    if not line or line.startswith('#'): continue
    name,url=line.split(None,1)
    out=f"voice-raw2/{name}.html"
    r=subprocess.run(["curl","-sL","--max-time","60","-A",UA,"-o",out,"-w","%{http_code} %{size_download}",url],capture_output=True,text=True)
    code=r.stdout.strip()
    txt=strip(open(out,encoding='utf-8',errors='replace').read()) if os.path.exists(out) else ''
    open(f"voice-raw2/{name}.txt","w").write(txt)
    print(f"{name}: {code} -> {len(txt)} chars text")
