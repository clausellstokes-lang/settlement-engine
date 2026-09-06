import sys, subprocess, re, html, os
url=sys.argv[1]; out=sys.argv[2]
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
p=subprocess.run(["curl","-sL","--max-time","70","--compressed","-A",UA,"-H","Accept: text/html,application/xhtml+xml","-H","Accept-Language: en-US,en;q=0.9","-w","\n@@HTTP:%{http_code}",url],capture_output=True)
raw=p.stdout.decode("utf-8","replace")
code=raw.rsplit("@@HTTP:",1)[-1].strip() if "@@HTTP:" in raw else "?"
body=raw.rsplit("\n@@HTTP:",1)[0]
t=re.sub(r'(?is)<(script|style|noscript|svg|head)[^>]*>.*?</\1>',' ',body)
t=re.sub(r'(?is)<br[^>]*>','\n',t)
t=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|blockquote)>','\n',t)
t=re.sub(r'(?s)<[^>]+>',' ',t)
t=html.unescape(t)
t=re.sub(r'[ \t\xa0]+',' ',t)
t=re.sub(r'\n\s*\n\s*\n+','\n\n',t)
open(out,"w").write(t.strip())
print("HTTP",code,"chars",len(t),"->",out)
