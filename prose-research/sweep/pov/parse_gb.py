import re,json,html,sys
def parse(path):
    t=open(path,encoding='utf-8',errors='replace').read()
    m=re.search(r'\{"number_of_results":\d+,"search_results":\[.*?\]',t,re.S)
    if not m: return None
    s=m.group(0)+'}'
    try: j=json.loads(s)
    except Exception as e:
        # trim trailing
        s2=re.sub(r',"search_query_escaped".*$','',s); 
        try: j=json.loads(s2+'}')
        except Exception as e2: return {'err':str(e2)}
    return j
for p in sys.argv[1:]:
    j=parse(p)
    q=re.search(r'value="([^"]*)"',open(p,encoding='utf-8',errors='replace').read())
    print('\n=== FILE',p,'| query:',html.unescape(q.group(1)) if q else '?')
    if not j: print('  no results block'); continue
    if 'err' in j: print('  parse err',j['err']); continue
    print('  n=',j.get('number_of_results'))
    for r in j.get('search_results',[]):
        s=html.unescape(re.sub(r'<[^>]+>','',r.get('snippet_text','')))
        s=re.sub(r'\s+',' ',s)
        print('  p.%s | %s'%(r.get('page_number'),s))
