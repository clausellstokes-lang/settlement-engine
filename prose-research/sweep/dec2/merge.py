import json, glob, os, sys
base = json.load(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/dec2/PRIOR-found-backup.json'))
claims = list(base['claims']); sources = list(base['sourcesRead'])
seen_urls = {s['url'] for s in sources}
for p in sorted(glob.glob('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/dec2/parts/batch*.json')):
    d = json.load(open(p))
    for s in d['sourcesRead']:
        if s['url'] not in seen_urls:
            sources.append(s); seen_urls.add(s['url'])
    claims.extend(d['claims'])
out = {"complete": len(sys.argv)>1 and sys.argv[1]=='final',
       "coverage": open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/dec2/coverage.txt').read().strip(),
       "sourcesRead": sources, "claims": claims}
json.dump(out, open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-ai-arch-decoding-literature.json','w'), indent=1, ensure_ascii=False)
print('sources', len(sources), 'claims', len(claims), 'complete', out['complete'])
