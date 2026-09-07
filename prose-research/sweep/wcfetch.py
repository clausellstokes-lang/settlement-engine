import sys,re,subprocess,html as H,os
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
out=sys.argv[1]; url=sys.argv[2]
d='wc-raw'
os.makedirs(d,exist_ok=True)
hp=f'{d}/{out}.html'
r=subprocess.run(['curl','-sL','-A',UA,'--compressed','--max-time','75',url,'-o',hp,'-w','%{http_code} %{size_download}'],capture_output=True,text=True)
print(url,'->',r.stdout)
t=open(hp,encoding='utf-8',errors='replace').read()
t=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',t)
t=re.sub(r'(?i)</(p|div|h1|h2|h3|h4|li|blockquote|tr|br)\s*/?>','\n\n',t)
t=re.sub(r'<[^>]+>',' ',t); t=H.unescape(t)
t=re.sub(r'[ \t\r]+',' ',t); t=re.sub(r'\n{3,}','\n\n',t)
open(f'{d}/{out}.txt','w').write(t)
print('chars',len(t))
