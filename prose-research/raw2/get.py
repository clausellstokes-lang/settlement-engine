import sys, subprocess, re, html, os, hashlib
url=sys.argv[1]
out=sys.argv[2] if len(sys.argv)>2 else None
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
r=subprocess.run(["curl","-sL","--compressed","--max-time","60","-A",UA,"-H","Accept: text/html,application/xhtml+xml","-H","Accept-Language: en-US,en;q=0.9",url],capture_output=True)
t=r.stdout.decode("utf-8","replace")
raw=t
t=re.sub(r'(?is)<(script|style|noscript|svg|head)\b.*?</\1>',' ',t)
t=re.sub(r'(?is)<br\s*/?>','\n',t)
t=re.sub(r'(?is)</(p|div|li|h[1-6]|blockquote|tr)>','\n\n',t)
t=re.sub(r'(?s)<[^>]+>',' ',t)
t=html.unescape(t)
t=re.sub(r'[ \t\xa0]+',' ',t)
t=re.sub(r'\n\s*\n\s*\n+','\n\n',t)
t=t.strip()
d=os.path.dirname(os.path.abspath(__file__))
name=out or hashlib.md5(url.encode()).hexdigest()[:10]
p=os.path.join(d,name+".txt")
open(p,"w").write(t)
open(os.path.join(d,name+".html"),"w").write(raw)
print("BYTES_HTML",len(raw),"TEXT",len(t),"->",p)
