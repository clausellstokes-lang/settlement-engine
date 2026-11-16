#!/usr/bin/env python3
# REGRESSION SET: what became of each flagged sentence between two renders of the same towns.
#   regress.py <base-render> <new-render> <flags.json> [--sev MED,HIGH] [--verdict STANDS] [--list]
# (a render dir holds dumps/<town>.txt; a row has town and text, and may have sev, id, verdict)
# For each row: the page lines that hold its folded text, at the base and at the new render.
#   SAME    the same lines hold it (the sentence prints as it did)
#   CHANGED lines still hold it but they are not the base's lines (a mark was added, the sentence re-worded round it): READ THEM
#   GONE    no line holds it now
#   NOBASE  the base did not hold it (the row's text is not on the page as quoted): not counted
import json,re,sys,os,collections
def fold(s): return re.sub(r'\s+',' ',re.sub(r'[^a-z0-9 ]',' ',str(s).lower())).strip()
base,new=sys.argv[1],sys.argv[2]; rows=json.load(open(sys.argv[3]))
if isinstance(rows,dict): rows=next(v for v in rows.values() if isinstance(v,list))
a=sys.argv[4:]; sev=ver=None
for i,x in enumerate(a):
    if x=='--sev': sev=set(a[i+1].split(','))
    if x=='--verdict': ver=set(a[i+1].split(','))
cache={}
def lines(d,t):
    k=(d,t)
    if k not in cache:
        p=os.path.join(d,'dumps',t+'.txt')
        cache[k]=[(l,fold(l)) for l in open(p).read().split('\n')] if os.path.exists(p) else None
    return cache[k]
def holders(d,t,ft):
    ls=lines(d,t)
    if ls is None: return None
    return sorted({l.strip() for l,f in ls if ft and ft in f})
out=collections.defaultdict(list)
for r in rows:
    if sev and r.get('sev') not in sev: continue
    if ver and (r.get('verdict') or r.get('class')) not in ver: continue
    ft=fold(str(r['text']).strip('"'))
    b=holders(base,r['town'],ft); n=holders(new,r['town'],ft)
    if b is None or n is None: out['NORENDER'].append((r,[])); continue
    if not b: out['NOBASE'].append((r,n)); continue
    if not n: out['GONE'].append((r,b))
    elif n==b: out['SAME'].append((r,n))
    else: out['CHANGED'].append((r,n))
tot=sum(len(v) for k,v in out.items() if k not in('NOBASE','NORENDER'))
print(f"rows {tot} · SAME {len(out['SAME'])} · CHANGED {len(out['CHANGED'])} · GONE {len(out['GONE'])} · (not on the base as quoted {len(out['NOBASE'])}; town not rendered {len(out['NORENDER'])})")
if '--list' in a:
    for k in ('GONE','CHANGED','NOBASE'):
        for r,ls in out[k]:
            print(f"  {k} {r.get('id')} {r['town']} | {str(r['text'])[:130]}")
            if k=='CHANGED':
                for l in ls[:3]: print(f"        now: {l[:200]}")
json.dump({k:[dict(id=r.get('id'),town=r['town'],text=r['text'],lines=ls) for r,ls in v] for k,v in out.items()},open('regress.last.json','w'),indent=1)
