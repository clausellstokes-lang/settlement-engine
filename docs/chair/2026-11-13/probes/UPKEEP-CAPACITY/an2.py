# UPKEEP-CAPACITY, the second corpus (corpus2.mjs). python3 an2.py <dir-with-c2-*.ndjson> <census.json>
import json, sys, glob, os, collections as C
VARS = os.environ.get('CAP_VARIANTS', 'A,B').split(',')  # a merged file (merge3.py) carries base, E and BE
d, cj = sys.argv[1], sys.argv[2]
rows = [json.loads(l) for f in sorted(glob.glob(f'{d}/c2-*.ndjson')) for l in open(f)]
census = json.load(open(cj))
T = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']
SK = ['military', 'monster', 'internal', 'economic', 'magical', 'disaster']
print(f'births {len(rows)}; fresh6 {sum(r["key"].startswith("fresh6") for r in rows)}')
off = C.Counter()
for r in rows:
    for p, hs in r['base']['houses'].items():
        for h in hs: off[(p, h[0], h[1], h[2], r['tier'])] += 1
print('houses by rung and tier (scaled parts):')
for k in sorted({k[:4] for k in off}): print(f'  {k[0]:10s} {k[1]:34s} {k[2]}/{k[3]} ' + ' '.join(f'{off[k + (t,)]:4d}' for t in T))
for v in VARS:
    print(f'\n======== {v} against base (each seed born three times, the factor through the whole pipeline) ========')
    dl = [r[v]['score'] - r['base']['score'] for r in rows]
    mv = [x for x in dl if x]
    bc = C.Counter((r['base']['band'], r[v]['band']) for r in rows if r['base']['band'] != r[v]['band'])
    print(f'READINESS: moved {len(mv)} (up {sum(x>0 for x in dl)}, down {sum(x<0 for x in dl)}); mean all {sum(dl)/len(dl):+.2f}, movers {sum(mv)/max(1,len(mv)):+.2f}; min {min(dl)} max {max(dl)}; bands {sum(bc.values())} {dict(bc)}')
    f6 = [r for r in rows if r['key'].startswith('fresh6')]
    print(f'  fresh6: moved {sum(r[v]["score"]!=r["base"]["score"] for r in f6)} of {len(f6)}, band {sum(r[v]["band"]!=r["base"]["band"] for r in f6)}')
    for t in T:
        rt = [r for r in rows if r['tier'] == t]; dt = [r[v]['score'] - r['base']['score'] for r in rt]
        print(f'  {t:10s} n {len(rt):4d} moved {sum(1 for x in dt if x):4d} mean {sum(dt)/len(dt):+6.2f} min {min(dt):+4d} max {max(dt):+4d} band {sum(r["base"]["band"]!=r[v]["band"] for r in rt):4d}  mean {sum(r["base"]["score"] for r in rt)/len(rt):5.1f} -> {sum(r[v]["score"] for r in rt)/len(rt):5.1f}')
    print('SCORES (the page band: STRONG >=65, ADEQUATE >=40, WEAK >=20, CRITICAL):')
    for i, s in enumerate(SK):
        pr = [r for r in rows if r['base']['scores'][i] is not None and r[v]['scores'][i] is not None]
        ds = [r[v]['scores'][i] - r['base']['scores'][i] for r in pr]
        sb = C.Counter((r['base']['sbands'][i], r[v]['sbands'][i]) for r in pr if r['base']['sbands'][i] != r[v]['sbands'][i])
        print(f'  {s:9s} moved {sum(1 for x in ds if x):4d} (up {sum(x>0 for x in ds)}, down {sum(x<0 for x in ds)}) mean {sum(ds)/max(1,len(ds)):+.2f} min {min(ds):+d} max {max(ds):+d}; band changes {sum(sb.values())} {dict(sb)}')
        print('             by tier, mean move: ' + ' '.join(f'{t[:4]} {sum(r[v]["scores"][i]-r["base"]["scores"][i] for r in pr if r["tier"]==t)/max(1,sum(1 for r in pr if r["tier"]==t)):+.2f}' for t in T))
    weak = lambda x: x['reliance'] in ('relied-upon', 'integral') and x['sbands'][4] in ('WEAK', 'CRITICAL')
    print(f'MAGIC AGAINST THE PAGE: reliance relied-upon/integral beside Magical WEAK/CRITICAL: base {sum(weak(r["base"]) for r in rows)}, {v} {sum(weak(r[v]) for r in rows)}; made {sum(weak(r[v]) and not weak(r["base"]) for r in rows)}, cured {sum(weak(r["base"]) and not weak(r[v]) for r in rows)}; reliance reading changed {sum(r["base"]["reliance"]!=r[v]["reliance"] for r in rows)}')
    tc = C.Counter()
    for r in rows:
        a, b = set(r['base']['threats']), set(r[v]['threats'])
        for n in b - a: tc[('gained', n)] += 1
        for n in a - b: tc[('lost', n)] += 1
    print(f'AI PROMPT THREATS from defence: births changed {sum(set(r["base"]["threats"])!=set(r[v]["threats"]) for r in rows)}; {dict(tc)}')
    band = [r for r in rows if r['base']['band'] != r[v]['band']]; nob = [r for r in rows if r['base']['band'] == r[v]['band']]
    pw = lambda r: r['base']['hPow'] != r[v]['hPow']; ap = lambda r: r['base']['powers'] != r[v]['powers']; rest = lambda r: r['base']['hRest'] != r[v]['hRest']
    lg = lambda r: r['base']['legitLabel'] != r[v]['legitLabel']
    print(f'COUPLING: band changed {len(band)}: power structure changed {sum(map(pw, band))}, a power appears or vanishes {sum(map(ap, band))}, legitimacy label changed {sum(map(lg, band))}, rest of record changed {sum(map(rest, band))}')
    print(f'          band unchanged {len(nob)}: power structure changed {sum(map(pw, nob))}, power appears/vanishes {sum(map(ap, nob))}, rest of record changed {sum(map(rest, nob))}')
    print(f'          ALL: power structure changed {sum(map(pw, rows))}, power appears/vanishes {sum(map(ap, rows))}; by tier ' + ' '.join(f'{t[:4]} {sum(pw(r) for r in rows if r["tier"]==t)}/{sum(ap(r) for r in rows if r["tier"]==t)}' for t in T))
    gv = C.Counter()
    for r in rows:
        a, b = set(r['base']['powers']), set(r[v]['powers'])
        for n in b - a: gv[('in', n)] += 1
        for n in a - b: gv[('out', n)] += 1
    print('          powers in/out: ' + str(gv.most_common(12)))
print('\n======== THE COUNT LAW (each house dropped alone; two HOUSE parts moving on one score) ========')
for v in ['base'] + VARS:
    tw = C.Counter(); births = 0; der = C.Counter()
    for r in rows:
        t = r[v]['count']['twice']
        if t: births += 1
        for h, s, ids in t: tw[(h, s, '+'.join(sorted(ids)))] += 1
        for k2, n in r[v]['count']['derived'].items(): der[k2] += n
    print(f'  {v}: births with a house feeding one score through two parts: {births}; derived (gate/multiplier) moves: {dict(der)}')
    for k, n in tw.most_common(20): print(f'     {n:5d}  {k}')
# static: the houses that OPEN two parts feeding one score (census openers), standing in the birth, both parts present
SC = {'walls': 'mil mon', 'garrison': 'mil mon int', 'militia': 'mil mon int', 'watch': 'mil int', 'court': 'int', 'prison': 'int', 'wardens': 'mon', 'company': 'mil', 'charter': 'mil mon int', 'arcane': 'mil mon int', 'clergy': 'mon int mil', 'druids': 'mon', 'market': 'sup', 'hospital': 'sup mon', 'alchemists': 'sup', 'parish': 'mil int', 'elders': 'mil int', 'magicPresence': 'mag'}
PARTID = {'magicPresence': 'magic'}
opens = C.defaultdict(set)
for p, hs in census['parts'].items():
    if p in SC:
        for h in hs: opens[h['name']].add(p)
st = C.Counter(); sb = 0
for r in rows:
    hit = False
    for n in set(r['base']['names']):
        ps = [p for p in opens.get(n, ()) if PARTID.get(p, p) in r['base']['parts']]
        for s in ['mil', 'mon', 'int', 'sup', 'mag']:
            f = [p for p in ps if s in SC[p].split()]
            if len(f) > 1: st[(n, s, '+'.join(sorted(f)))] += 1; hit = True
    sb += hit
print(f'\n  STATIC (a house that opens two parts sharing a score, both parts standing; the weights\' scores, not the birth\'s): births {sb}')
for k, n in st.most_common(20): print(f'     {n:5d}  {k}')
# The drop test, split: a house that ITSELF opens two of the parts that moved on one score (a double feed), against
# a move in a part the house does not open (the traditions' shared cap against beasts, R2; or a factor whose
# greatest house was the one dropped). Openers from the census, keyed by the part id.
PID = lambda p: PARTID.get(p, p)
opens_id = C.defaultdict(set)
for n, ps in opens.items():
    for p in ps: opens_id[n].add(PID(p))
for p, hs in census['parts'].items():
    if p in ('arcaneTower', 'arcaneGuild'):
        for h in hs: opens_id[h['name']].add('arcane')
    if p in ('clergyShrine', 'clergyStrong'):
        for h in hs: opens_id[h['name']].add('clergy')
print('\n======== THE COUNT LAW, split: the house\'s OWN parts (a double feed) | a part it does not open (side effect) ========')
for v in ['base'] + VARS:
    own = C.Counter(); side = C.Counter(); bo = 0
    for r in rows:
        hit = False
        for h, s, ids in r[v]['count']['twice']:
            mine = sorted(set(ids) & opens_id.get(h, set()))
            if len(mine) > 1: own[(h, s, '+'.join(mine))] += 1; hit = True
            else: side[(h, s, '+'.join(sorted(ids)))] += 1
        bo += hit
    print(f'  {v}: births with a house feeding one score through two of ITS OWN parts: {bo}')
    for k, n in own.most_common(10): print(f'     own  {n:5d}  {k}')
    print(f'     side effects (not a double feed): {sum(side.values())} rows; top: {side.most_common(4)}')
