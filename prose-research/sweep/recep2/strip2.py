import re,html,os,glob,sys
src='reception-raw'; dst='recep2'
def strip(s):
    s=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>','',s)
    s=re.sub(r'(?i)<br\s*/?>|</p>|</div>|</h\d>|</li>|</tr>','\n',s)
    s=re.sub(r'(?s)<[^>]+>','',s)
    s=html.unescape(s)
    s=re.sub(r'[ \t\r\f\v]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n',s)
    return s.strip()
for f in sorted(glob.glob(src+'/*.html')):
    b=os.path.basename(f)[:-5]
    t=strip(open(f,encoding='utf-8',errors='replace').read())
    open(f'{dst}/{b}.txt','w').write(t)
    print(b, len(t))
