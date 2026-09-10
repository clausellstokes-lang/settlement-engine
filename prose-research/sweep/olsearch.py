import sys,re,html,urllib.parse,subprocess
q=sys.argv[1]
url="https://openlibrary.org/search/inside?q="+urllib.parse.quote('"'+q+'"')
out=subprocess.run(["curl","-sL","-A","Mozilla/5.0",url],capture_output=True,text=True).stdout
t=re.sub(r'(?is)<(script|style).*?</\1>',' ',out)
# capture book title blocks and quotes
t2=re.sub(r'(?s)<[^>]+>','\n',t); t2=html.unescape(t2)
t2=re.sub(r'[ \t]+',' ',t2); t2=re.sub(r'\n\s*\n+','\n',t2)
i=t2.find('results found')
print(t2[i-200:i+9000] if i>0 else t2[:4000])
