# UPKEEP-CAPACITY: reads corpus-*.ndjson (corpus.mjs) and prints the measure. python3 an.py <dir>
import json, sys, glob, collections as C
d = sys.argv[1]
import os
LADDER = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ladder-of.json')))
rows = [json.loads(l) for f in sorted(glob.glob(f'{d}/corpus-*.ndjson')) for l in open(f)]
T = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']
BANDS = ['Undefended', 'Vulnerable', 'Lightly Defended', 'Defensible', 'Well-Defended', 'Fortress']
V = ['A', 'B', 'R', 'AW']
print(f'births {len(rows)}; fresh6 {sum(r["key"].startswith("fresh6") for r in rows)}')
print('\n== STEP 2: births holding each rung, by the place\'s tier (thorp hamlet village town city metropolis) ==')
tiers_n = C.Counter(r['tier'] for r in rows); print('births by tier', [tiers_n[t] for t in T])
hold = C.defaultdict(C.Counter); both = C.defaultdict(C.Counter)
for r in rows:
    for p, hs in r['houses'].items():
        for h in {tuple(x) for x in hs}: hold[(p, h[0], h[1], h[2])][r['tier']] += 1
        lad = C.Counter()  # two rungs of ONE ladder (ladder identity from ladder-of.json, chains.mjs's union-find)
        for h in {tuple(x) for x in hs}:
            if h[2] > 1: lad[LADDER[p + '|' + h[0]]] += 1
        if any(v > 1 for v in lad.values()): both[p][r['tier']] += 1
for k in sorted(hold, key=lambda k: (k[0], -k[3], k[2], k[1])):
    p, n, rung, of = k; print(f'  {p:10s} {n:34s} {rung}/{of}  ' + ' '.join(f'{hold[k][t]:4d}' for t in T))
print('  two rungs of one ladder in one birth (part: by tier):', {p: [both[p][t] for t in T] for p in both})
gaps = C.Counter(); gapn = C.defaultdict(C.Counter)
for r in rows:
    for g in r['gaps']: gaps[g] += 1
print('  a part open with no house on its ladder (gap):', dict(gaps))
for g in gaps:
    for r in rows:
        if g in r['gaps']:
            for n in r['gapNames']: gapn[g][n] += 1
for g in gapn: print('   ', g, gapn[g].most_common(6))
def band_idx(b): return BANDS.index(b)
print('\n== STEP 3/4: each candidate against base (E on) ==')
for v in V:
    mv = [r for r in rows if r[v]['score'] != r['base']['score']]
    dl = [r[v]['score'] - r['base']['score'] for r in rows]
    bc = C.Counter((r['base']['band'], r[v]['band']) for r in rows if r['base']['band'] != r[v]['band'])
    up = sum(1 for x in dl if x > 0); dn = sum(1 for x in dl if x < 0)
    print(f'-- {v}: moved {len(mv)} of {len(rows)} (up {up}, down {dn}); mean over movers {sum(r[v]["score"]-r["base"]["score"] for r in mv)/max(1,len(mv)):+.2f}, over all {sum(dl)/len(dl):+.2f}; min {min(dl)}, max {max(dl)}; bands changed {sum(bc.values())} {dict(bc)}')
    f6 = [r for r in rows if r['key'].startswith('fresh6')]
    print(f'   fresh6: moved {sum(r[v]["score"]!=r["base"]["score"] for r in f6)} of {len(f6)}, band changed {sum(r[v]["band"]!=r["base"]["band"] for r in f6)}')
    for t in T:
        rt = [r for r in rows if r['tier'] == t]; dt = [r[v]['score'] - r['base']['score'] for r in rt]
        bct = sum(1 for r in rt if r['base']['band'] != r[v]['band'])
        print(f'   {t:10s} n {len(rt):4d} moved {sum(1 for x in dt if x):4d} mean {sum(dt)/len(dt):+6.2f} min {min(dt):+4d} max {max(dt):+4d} bands {bct:4d}  mean score {sum(r["base"]["score"] for r in rt)/len(rt):5.1f} -> {sum(r[v]["score"] for r in rt)/len(rt):5.1f}')
print('\n== STEP 4: share in each band by tier (base | A | B | R | AW), percent ==')
for t in T:
    rt = [r for r in rows if r['tier'] == t]
    line = []
    for v in ['base'] + V:
        c = C.Counter(r[v]['band'] for r in rt); line.append('/'.join(f'{100*c[b]/len(rt):.0f}' for b in BANDS))
    print(f'  {t:10s} ' + ' | '.join(line))
print('  (bands in order: ' + ', '.join(BANDS) + ')')
print('\n== STEP 4: fullness: births with >=1 score at 100, mean scores at 100, readiness at 100 — by tier ==')
for t in T:
    rt = [r for r in rows if r['tier'] == t]
    print(f'  {t:10s} ' + ' | '.join(f'{v}: {sum(r[v]["full"]>0 for r in rt):3d} {sum(r[v]["full"] for r in rt)/len(rt):.2f} top{sum(r[v]["score"]>=100 for r in rt)}' for v in ['base'] + V))
print('\n== STEP 4: per score, mean by tier (mil mon int eco mag), base -> A -> B ==')
for t in T:
    rt = [r for r in rows if r['tier'] == t]
    def m(v): return ' '.join(f'{sum(r[v]["scores"][i] for r in rt)/len(rt):5.1f}' for i in range(5))
    print(f'  {t:10s} base {m("base")} | A {m("A")} | B {m("B")}')
print('\n== STEP 4: the size row: mean readiness without it, by tier (base, A, B) ==')
for t in T:
    rt = [r for r in rows if r['tier'] == t]
    sz = rt[0]['base']['parts'].get('size', 0)
    print(f'  {t:10s} size {sz:+5.1f}  ' + ' '.join(f'{v}: {sum(r[v]["score"]-r[v]["parts"].get("size",0) for r in rt)/len(rt):5.1f}' for v in ['base', 'A', 'B', 'R']))
print('\n== per part: mean points among births holding it, base -> A -> B -> R ==')
for p in ['garrison', 'militia', 'watch', 'court', 'prison', 'wardens', 'company', 'charter', 'clergy', 'druids', 'market', 'hospital', 'alchemists', 'walls']:
    rp = [r for r in rows if p in r['base']['parts']]
    if not rp: continue
    print(f'  {p:10s} n {len(rp):4d} ' + ' -> '.join(f'{sum(r[v]["parts"].get(p,0) for r in rp)/len(rp):5.2f}' for v in ['base', 'A', 'B', 'R', 'AW']))
