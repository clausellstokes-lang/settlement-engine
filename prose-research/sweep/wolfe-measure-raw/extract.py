import re,sys,html
p=sys.argv[1]
s=open(p,encoding='utf-8',errors='replace').read()
# isolate article body if possible
s=re.sub(r'(?is)<script.*?</script>','',s)
s=re.sub(r'(?is)<style.*?</style>','',s)
# find paragraphs
paras=re.findall(r'(?is)<p[^>]*>(.*?)</p>',s)
out=[]
for x in paras:
    t=re.sub(r'(?s)<[^>]+>','',x)
    t=html.unescape(t).strip()
    t=re.sub(r'\s+',' ',t)
    if len(t.split())>=5: out.append(t)
print('\n'.join(out))
