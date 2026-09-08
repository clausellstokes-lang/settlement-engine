import json,sys,re
# usage: _recount-herald.py <author> <idx,idx,...>  -> distinct urls (same page twice = one), with source names
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep'
author=sys.argv[1]; idxs=[int(x) for x in sys.argv[2].split(',') if x.strip()]
rows=json.load(open(f'{SC}/kept-{author}.json'))
byi={r['index']:r for r in rows}
seen={}
for i in idxs:
    r=byi.get(i)
    if not r: print(f'  #{i}: NOT IN KEPT (partial or absent)'); continue
    v=r.get('verdict',{}).get('verdict','?')
    u=(r.get('url') or '').split('#')[0].rstrip('/')
    key=u or r.get('source')
    seen.setdefault(key,[]).append(i)
    print(f'  #{i}: {v} | {r.get("feature","")[:40]} | {r.get("source","")[:70]} | {u[:80]}')
print(f'DISTINCT PAGES: {len(seen)}')
for k,v in seen.items(): print(f'   {v} -> {k[:100]}')
