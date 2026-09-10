import json,re
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep'
spec=json.load(open(f'{SC}/_recount-herald-spec.json'))
def norm(u):
    u=(u or '').strip().lower().split('#')[0].rstrip('/')
    u=re.sub(r'^https?://(www\.)?','',u)
    u=re.sub(r'arxiv\.org/(abs|html|pdf)/([0-9.]+)(v\d+)?.*',r'arxiv.org/\2',u)
    return u
out={}
for author,groups in spec.items():
    rows=json.load(open(f'{SC}/kept-{author}.json'))
    byi={r['index']:r for r in rows}
    out[author]={}
    for label,idxs in groups.items():
        pages={}; missing=[]; verd={}
        for i in idxs:
            r=byi.get(i)
            if not r: missing.append(i); continue
            v=r.get('verdict',{}).get('verdict','?'); verd[v]=verd.get(v,0)+1
            key=norm(r.get('url')) or ('SRC:'+(r.get('source') or '')[:60])
            pages.setdefault(key,[]).append(i)
        out[author][label]={'cited':len(idxs),'kept':len(idxs)-len(missing),'missing':missing,'distinct_pages':len(pages),'verdicts':verd,'pages':{k:v for k,v in pages.items()}}
        print(f'{author:8s} {label:38s} cited={len(idxs):3d} kept={len(idxs)-len(missing):3d} missing={missing} PAGES={len(pages)} verdicts={verd}')
json.dump(out,open(f'{SC}/_recount-herald-out.json','w'),indent=1)
