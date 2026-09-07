import re,html,sys
for p in sys.argv[1:]:
    t=open(p,encoding='utf-8',errors='replace').read()
    q=re.search(r'"search_query_escaped":"([^"]*)"',t)
    hits=re.findall(r'"page_number":"([^"]*)","snippet_text":"((?:[^"\\]|\\.)*)"',t)
    print('\n=== %s | q=%s | n=%d'%(p, html.unescape(q.group(1).encode().decode('unicode_escape')) if q else '?', len(hits)))
    for pn,s in hits:
        s=s.encode().decode('unicode_escape',errors='replace'); s=html.unescape(re.sub(r'<[^>]+>','',s)); s=re.sub(r'\s+',' ',s)
        print('  p.%s | %s'%(pn,s))
