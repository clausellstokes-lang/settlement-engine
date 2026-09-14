#!/usr/bin/env python3
"""mk-refute-compare-args.py <journal.jsonl> <args-<BLOCK>.json> <dock name> <out.json> [casebook-out.md]
Extracts the FABLE refuters' first-round verdicts (the REFUTE results: {dir, verdicts[{variant,face,verdict,law,quote,finding,cure?}]}) from a
block run's journal and writes the comparison workflow's per-block args: {block, dock, pools:[{pool, dir, rounds, fableVerdicts:[...]}]}.
Optionally writes a CASE BOOK of the confirmed FAILs (law · quote · finding · cure) for the two-pass Opus checker brief."""
import json, sys, os, glob
J, LA, DOCK, OUT = sys.argv[1:5]; CB = sys.argv[5] if len(sys.argv) > 5 else None
la = json.load(open(LA)); BLOCK = la['block']; PK = os.path.join(os.path.dirname(os.path.abspath(LA)), BLOCK)
res = [json.loads(l)['result'] for l in open(J) if '"type":"result"' in l or '"type": "result"' in l]
res = [r for r in res if isinstance(r, dict)]
refutes = [r for r in res if 'dir' in r and 'verdicts' in r and 'newFindings' not in r]
by = {}
for r in refutes:
    d = r['dir'].rstrip('/').split('/')[-1]
    by[d] = r['verdicts']
pools = []
for p in la['pools']:
    d = p['dir']; v = by.get(d)
    if not v: print('WARN no Fable verdicts for', d, file=sys.stderr); continue
    drafts = sorted(glob.glob(os.path.join(PK, d, 'draft-round-*.md')))
    rounds = max([int(os.path.basename(x).split('-')[-1].split('.')[0]) for x in drafts] or [1])
    vv = []
    for x in v:
        try: variant = int(x['variant']); face = int(x['face'])
        except Exception: continue
        vv.append({'variant': variant, 'face': face, 'verdict': x['verdict'], 'law': x.get('law', ''), 'quote': x.get('quote', ''), 'finding': x.get('finding', ''), 'cure': x.get('cure', '')})
    pools.append({'pool': p['pool'], 'dir': d, 'rounds': rounds, 'fableVerdicts': vv})
out = {'block': BLOCK, 'dock': DOCK, 'pools': pools}
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
n = sum(len(p['fableVerdicts']) for p in pools); f = sum(1 for p in pools for x in p['fableVerdicts'] if x['verdict'] == 'FAIL')
print(json.dumps({'block': BLOCK, 'pools': len(pools), 'faces': n, 'fableFAIL': f}))
if CB:
    lines = ['# CASE BOOK — confirmed refutation findings (the answer key the checker briefs are calibrated on)', '', 'Each case: the block and pool, the face quoted (at most twelve words), the LAW named, the finding, the cure the refuter named. A case is a worked example of one ground; read them as the SHAPE of a finding, never as a list to match by wording.', '']
    k = 0
    for p in pools:
        for x in p['fableVerdicts']:
            if x['verdict'] != 'FAIL': continue
            k += 1
            lines.append('## Case %d — %s · %s · variant %d face %d' % (k, BLOCK, p['pool'], x['variant'], x['face']))
            lines.append('- QUOTE: ' + x['quote'][:140]); lines.append('- LAW: ' + x['law'][:200]); lines.append('- FINDING: ' + x['finding'][:600]); lines.append('- CURE: ' + x['cure'][:300]); lines.append('')
    open(CB, 'w').write('\n'.join(lines)); print('casebook cases', k, '->', CB)
