import json,sys,os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,'.')
SWEEP='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep'
prev=json.load(open(SWEEP+'/found-kay-craft.json'))
mods=[]
for m in sys.argv[1:]:
    mods.append(__import__(m))
new=[]
for m in mods: new.extend(m.CLAIMS)
newsrc=[]
for m in mods: newsrc.extend(getattr(m,'SOURCES',[]))
claims=[]
for c in prev.get('claims',[]): claims.append(c)
seen={(c.get('url'),c.get('quote'),c.get('claim')) for c in claims}
for c in new:
    c=dict(c); c.pop('file',None)
    k=(c.get('url'),c.get('quote'),c.get('claim'))
    if k in seen: continue
    seen.add(k); claims.append(c)
srcs=list(prev.get('sourcesRead',[]))
have={s.get('url') for s in srcs}
for s in newsrc:
    if s['url'] in have: continue
    have.add(s['url']); srcs.append(s)
import cfg
out=dict(complete=cfg.COMPLETE, coverage=cfg.COVERAGE, sourcesRead=srcs, claims=claims)
json.dump(out,open(SWEEP+'/found-kay-craft.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('sources',len(srcs),'claims',len(claims))
