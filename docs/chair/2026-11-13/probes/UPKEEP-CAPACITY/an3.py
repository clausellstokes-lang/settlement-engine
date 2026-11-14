# UPKEEP-CAPACITY: the gap candidates (corpus3.mjs) and G5 (= E of corpus2's second run, merged by merge3.py), each
# against corpus2's base. python3 an3.py <r2-dir> <r4-dir> <merged-dir>
import json, sys, glob, collections as C
r2, r4, mg = sys.argv[1:4]
base = {json.loads(l)['key']: json.loads(l) for f in glob.glob(f'{r2}/c2-*.ndjson') for l in open(f)}
G = {json.loads(l)['key']: json.loads(l) for f in glob.glob(f'{r4}/c3-*.ndjson') for l in open(f)}
M = {json.loads(l)['key']: json.loads(l) for f in glob.glob(f'{mg}/c2-*.ndjson') for l in open(f)}
for k in G: G[k]['G5'] = M[k]['E']
T = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']; SK = ['military', 'monster', 'internal', 'economic', 'magical', 'disaster']
HOUSE = {'G1': ['Professional city watch'], 'G2': ['Household levy'], 'G3': ['Access to parish church'], 'G3p': ['Access to parish church'],
         'G4': ['Druid Circle', 'Elder Grove Council'], 'G5': ['Alchemist shop', 'Alchemist quarter']}
print(f'births {len(G)} (base {len(base)})')
for g in ['G1', 'G2', 'G3', 'G3p', 'G4', 'G5']:
    rows = [(base[k]['base'], G[k][g], G[k]) for k in sorted(G)]
    hold = [x for x in rows if any(h in x[0]['names'] for h in HOUSE[g])]
    dl = [b['score'] - 0 for b, c, _ in rows]
    mv = [c['score'] - b['score'] for b, c, _ in rows]
    bc = C.Counter((b['band'], c['band']) for b, c, _ in rows if b['band'] != c['band'])
    print(f'\n======== {g} (the house: {", ".join(HOUSE[g])}; births holding it {len(hold)}; by tier ' + ' '.join(f'{t[:4]} {sum(1 for x in hold if x[2]["tier"]==t)}' for t in T) + ') ========')
    print(f'READINESS: moved {sum(1 for x in mv if x)} (up {sum(x>0 for x in mv)}, down {sum(x<0 for x in mv)}); mean all {sum(mv)/len(mv):+.3f}; over holders {sum(c["score"]-b["score"] for b,c,_ in hold)/max(1,len(hold)):+.2f}; min {min(mv)} max {max(mv)}; bands {sum(bc.values())} {dict(bc)}')
    for t in T:
        rt = [x for x in rows if x[2]['tier'] == t]; d = [c['score'] - b['score'] for b, c, _ in rt]
        if any(d): print(f'  {t:10s} moved {sum(1 for x in d if x):4d} mean {sum(d)/len(d):+.2f} min {min(d):+d} max {max(d):+d} bands {sum(1 for b,c,_ in rt if b["band"]!=c["band"])}')
    for i, s in enumerate(SK):
        pr = [(b, c) for b, c, _ in rows if b['scores'][i] is not None and c['scores'][i] is not None]
        ds = [c['scores'][i] - b['scores'][i] for b, c in pr]
        if not any(ds): continue
        sb = C.Counter((b['sbands'][i], c['sbands'][i]) for b, c in pr if b['sbands'][i] != c['sbands'][i])
        print(f'  {s:9s} moved {sum(1 for x in ds if x):4d} (up {sum(x>0 for x in ds)}, down {sum(x<0 for x in ds)}) mean over movers {sum(ds)/max(1,sum(1 for x in ds if x)):+.2f} min {min(ds):+d} max {max(ds):+d}; band changes {sum(sb.values())} {dict(sb)}')
    weak = lambda x: x['reliance'] in ('relied-upon', 'integral') and x['sbands'][4] in ('WEAK', 'CRITICAL')
    tc = C.Counter()
    for b, c, _ in rows:
        for n in set(c['threats']) - set(b['threats']): tc[('gained', n)] += 1
        for n in set(b['threats']) - set(c['threats']): tc[('lost', n)] += 1
    pw = sum(b['hPow'] != c['hPow'] for b, c, _ in rows); ap = sum(b['powers'] != c['powers'] for b, c, _ in rows)
    print(f'  magic against the page (reliance relied-upon/integral beside Magical WEAK/CRITICAL): made {sum(weak(c) and not weak(b) for b,c,_ in rows)}, cured {sum(weak(b) and not weak(c) for b,c,_ in rows)}')
    print(f'  AI prompt threats: births changed {sum(set(b["threats"])!=set(c["threats"]) for b,c,_ in rows)} {dict(tc)}')
    print(f'  COUPLING: power structure changed {pw}, a power appears or vanishes {ap}, legitimacy label changed {sum(b["legitLabel"]!=c["legitLabel"] for b,c,_ in rows)}; rest of record changed {sum(b["hRest"]!=c["hRest"] for b,c,_ in rows)}; of band movers, power changed {sum(b["hPow"]!=c["hPow"] for b,c,_ in rows if b["band"]!=c["band"])}')
    # ten towns that name the house: the five largest moves, then five more spread across the holders
    hs = sorted(hold, key=lambda x: (-(abs(x[1]['score'] - x[0]['score'])), x[2]['key']))
    pick = hs[:5] + [x for x in hs[5:]][:: max(1, len(hs[5:]) // 5)][:5]
    print('  TEN THAT NAME THE HOUSE (readiness band; military beasts order supply magic):')
    for b, c, r in pick:
        print(f'    {r["key"]:34s} {b["score"]:3d} {b["band"]:16s} {"/".join(str(x) for x in b["scores"][:5]):18s} -> {c["score"]:3d} {c["band"]:16s} {"/".join(str(x) for x in c["scores"][:5])}')
ed = [G[k]['G1edited'] for k in G if 'G1edited' in G[k]]
d = [e['on']['score'] - e['off']['score'] for e in ed]
print(f'\n======== G1, THE EDITED TOWN: cities and metropolises with their garrison houses removed (the watch alone), G1 off -> on: n {len(ed)}; moved {sum(1 for x in d if x)}; mean {sum(d)/len(d):+.2f}; min {min(d)} max {max(d)}; bands {sum(e["off"]["band"]!=e["on"]["band"] for e in ed)} {dict(C.Counter((e["off"]["band"], e["on"]["band"]) for e in ed if e["off"]["band"]!=e["on"]["band"]))}')
for i, s in enumerate(SK[:5]):
    ds = [e['on']['scores'][i] - e['off']['scores'][i] for e in ed]
    print(f'  {s:9s} mean {sum(ds)/len(ds):+.2f} min {min(ds):+d}; band changes {sum(e["off"]["sbands"][i]!=e["on"]["sbands"][i] for e in ed)}')
