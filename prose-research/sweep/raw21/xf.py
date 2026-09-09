import re,sys,html
raw=open(sys.argv[1],encoding='utf-8',errors='replace').read()
raw=re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>',' ',raw)
# mark article boundaries with author
def mark(m):
    return "\n\n===POST author=%s===\n" % m.group(1)
raw=re.sub(r'(?is)<article[^>]*data-author="([^"]*)"[^>]*>', mark, raw)
raw=re.sub(r'(?is)<blockquote[^>]*>','\n[QUOTE]\n',raw)
raw=re.sub(r'(?is)</blockquote>','\n[/QUOTE]\n',raw)
raw=re.sub(r'(?is)<br\s*/?>|</p>|</div>|</li>|</h[1-6]>|</article>','\n',raw)
raw=re.sub(r'(?s)<[^>]+>',' ',raw)
raw=html.unescape(raw)
raw=raw.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','--').replace('\xa0',' ')
raw=re.sub(r'[ \t]+',' ',raw)
raw=re.sub(r'\n\s*\n+','\n\n',raw)
sys.stdout.write(raw)
