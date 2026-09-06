import re,html,sys
def strip(fn):
    s=open(fn,encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<script.*?</script>','',s); s=re.sub(r'(?is)<style.*?</style>','',s)
    s=re.sub(r'(?is)<!--.*?-->','',s)
    s=re.sub(r'(?i)</(p|div|h[1-6]|li|br|tr|blockquote)>','\n',s); s=re.sub(r'(?i)<br[^>]*>','\n',s)
    s=re.sub(r'<[^>]+>',' ',s); s=html.unescape(s)
    s=re.sub(r'[ \t]+',' ',s); s=re.sub(r'\n[ \t]+','\n',s); s=re.sub(r'\n{3,}','\n\n',s)
    return s
if __name__=='__main__':
    for f in sys.argv[1:]:
        out=f.rsplit('.',1)[0]+'.txt'
        t=strip(f); open(out,'w').write(t); print(out,len(t))
