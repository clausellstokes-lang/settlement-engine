import json,os,sys
BASE='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep'
OUT=BASE+'/found-wolfe-close-continued.json'
PRIOR=BASE+'/.wcc-prior.json'
def load_prior():
    if os.path.exists(PRIOR): return json.load(open(PRIOR))
    d=json.load(open(OUT)); json.dump(d,open(PRIOR,'w')); return d
def write(new_claims,new_sources,coverage,complete=False):
    load_prior(); p=json.load(open(OUT))
    claims=list(p['claims']); srcs=list(p['sourcesRead'])
    seen={(c['url'],c.get('quote',''),c['claim'][:60]) for c in claims}
    for c in new_claims:
        k=(c['url'],c.get('quote',''),c['claim'][:60])
        if k not in seen: claims.append(c); seen.add(k)
    su={s['url'] for s in srcs}
    for s in new_sources:
        if s['url'] not in su: srcs.append(s); su.add(s['url'])
    json.dump({'complete':complete,'coverage':coverage,'sourcesRead':srcs,'claims':claims},
              open(OUT,'w'),indent=1)
    print('wrote',OUT,len(claims),'claims',len(srcs),'sources')
