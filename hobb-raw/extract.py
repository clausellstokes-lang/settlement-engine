import re,sys,html
def txt(p):
    s=open(p,encoding='utf-8',errors='replace').read()
    m=re.search(r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)</div>\s*<(?:footer|/article|div[^>]*class="[^"]*(?:entry-footer|post-navigation|sharedaddy))',s,re.S)
    if not m:
        m=re.search(r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*)',s,re.S)
    body=m.group(1) if m else s
    body=re.sub(r'<script.*?</script>','',body,flags=re.S)
    body=re.sub(r'<style.*?</style>','',body,flags=re.S)
    body=re.sub(r'<br\s*/?>','\n',body)
    body=re.sub(r'</p>','\n\n',body)
    body=re.sub(r'<[^>]+>',' ',body)
    body=html.unescape(body)
    body=re.sub(r'[ \t]+',' ',body)
    body=re.sub(r'\n{3,}','\n\n',body)
    return body.strip()
print(txt(sys.argv[1]))
