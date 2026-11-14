"""SENT TO: grep each row's fixed words, its #ids and its writer's symbol in the nine running briefs and in
CHAIR-HANDOFF-FIFTH section 7 lines stamped 09:00 UTC or later; prints the hits with 70 chars of context."""
import json,re,glob,os,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from writers import W
base=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
docs={os.path.basename(p)[:-3]:open(p).read() for p in glob.glob(base+'/briefs/*.md')}
docs['HANDOFF-7>=0900']=open(base+'/handoff5-sec7-0900.md').read()
rows=json.load(open(base+'/rows/rows.merged.json')); out={}
for r in rows:
    keys=set()
    if r.get('words') and len(r['words'])>=8: keys.add(r['words'])
    for a in r.get('also',[]):
        pass
    txt=r['sentence']+' '+' '.join(a['sentence'] for a in r.get('also',[]))
    for m in re.findall(r'(?:#|ww#|pf#|inc #|n)(\d{2,4})\b',r['id']+' '+txt): pass
    for m in re.findall(r'(#(?:ww-|pf-|ww|pf)?\d{2,4})\b',txt): keys.add(m)
    if r['id'].startswith('BAR-'): keys.add('#'+r['id'][4:]); keys.add('n'+r['id'][4:])
    for f,n in W.get(r['id'],[]):
        if n and re.match(r'^[A-Za-z_$][\w$]{6,}$',n): keys.add(n)
    hits=[]
    for d,t in docs.items():
        for k in keys:
            for m in re.finditer(re.escape(k)+(r'\b' if k[-1].isalnum() else ''),t):
                hits.append((d,k,t[max(0,m.start()-50):m.end()+50].replace('\n',' ')))
                break
    out[r['id']]=hits
    if hits: print(r['id'],'::',' ; '.join(f"{d}[{k}]" for d,k,_ in hits)[:300])
json.dump(out,open(base+'/rows/sent.json','w'),indent=1)
