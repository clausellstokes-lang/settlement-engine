# The chair's strict burn-down of the bar's first read: a row "still prints" only if its
# whole sentence prints word for word (figures folded) in its own town's dump.
# usage: python3 strict_burndown.py <bar0 out-dir>
import json,io,re,collections,glob,os,sys
out=sys.argv[1]
def norm(s): return re.sub(r'\s+',' ',str(s).replace('‘',"'").replace('’',"'").replace('“','"').replace('”','"')).strip()
def fig(s): return re.sub(r'\d[\d,.]*','#',s)
L=json.load(io.open('/home/user/c3/docs/chair/2026-11-14/probes/CENSUS-3/REVIEW-BAR-0-LIST.json',encoding='utf-8'))
lanes={}
for f in glob.glob('/home/user/chair/docs/chair/2026-11-14/bar-0-rows/BAR-0-ROWS-*.json'):
    lane=os.path.basename(f)[len('BAR-0-ROWS-'):-5]
    d=json.load(io.open(f,encoding='utf-8')); rows=d['rows'] if isinstance(d,dict) else d
    for r in rows: lanes[r['n']]=lane
pages={}
def page(seed):
    if seed not in pages:
        try:
            pages[seed]=[fig(norm(l)) for l in io.open('%s/dumps/%s.txt'%(out,seed),encoding='utf-8').read().split('\n') if l and not l.startswith('== ') and not l.startswith('[STYLE]')]
        except Exception as e: pages[seed]=None
    return pages[seed]
res=collections.Counter(); bylane=collections.Counter(); tot=collections.Counter(); exact_rows=collections.defaultdict(list); bykind=collections.Counter(); totkind=collections.Counter()
for r in L:
    if r.get('severity') not in ('HIGH','MED'): continue
    p=page(r['town'])
    if p is None: res['nopage']+=1; continue
    s=fig(norm(r['sentence']))
    exact = any(s in l for l in p) if len(s)>12 else any(l==s for l in p)
    lane=lanes.get(r['n'],'?'); tot[(lane,r['severity'])]+=1
    k=r.get('kind') or r.get('class') or '?'
    totkind[(k,r['severity'])]+=1
    if exact:
        res[r['severity']+' exact']+=1; bylane[(lane,r['severity'])]+=1; exact_rows[lane].append(r['n']); bykind[(k,r['severity'])]+=1
    else: res[r['severity']+' changed-or-gone']+=1
print(dict(res))
for (lane,sev),n in sorted(tot.items()):
    print('  %-9s %-4s exact-printing %2d of %2d' % (lane,sev,bylane[(lane,sev)],n))
for (k,sev),n in sorted(totkind.items(), key=lambda x:-x[1]):
    print('  kind %-40s %-4s %2d of %2d' % (str(k)[:40],sev,bykind[(k,sev)],n))
print({k:v for k,v in exact_rows.items()})
