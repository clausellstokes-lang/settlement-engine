# UPKEEP-CAPACITY, the build: one commit's move, measured as the candidates were. Each run is corpus2.mjs with
# CAP_CANDS=base and drops off, at a commit's tree (no hook set: the tree itself). python3 compare.py <before-dir> <after-dir> [label]
import json, sys, glob, collections as C
a = {json.loads(l)['key']: json.loads(l)['base'] for f in glob.glob(f'{sys.argv[1]}/c2-*.ndjson') for l in open(f)}
b = {json.loads(l)['key']: json.loads(l)['base'] for f in glob.glob(f'{sys.argv[2]}/c2-*.ndjson') for l in open(f)}
lab = sys.argv[3] if len(sys.argv) > 3 else 'move'
tier = {k: k.split('-')[-2] for k in a}
T = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']; SK = ['military', 'monster', 'internal', 'economic', 'magical', 'disaster']
K = sorted(a)
dl = [b[k]['score'] - a[k]['score'] for k in K]
bc = C.Counter((a[k]['band'], b[k]['band']) for k in K if a[k]['band'] != b[k]['band'])
print(f'== {lab}: births {len(K)}; records differ {sum(a[k]["hAll"]!=b[k]["hAll"] for k in K)}')
print(f'READINESS moved {sum(1 for x in dl if x)} (up {sum(x>0 for x in dl)}, down {sum(x<0 for x in dl)}); mean all {sum(dl)/len(dl):+.2f}; min {min(dl)} max {max(dl)}; bands {sum(bc.values())} {dict(bc)}')
print(f'  fresh6: moved {sum(b[k]["score"]!=a[k]["score"] for k in K if k.startswith("fresh6"))}, band {sum(b[k]["band"]!=a[k]["band"] for k in K if k.startswith("fresh6"))}')
for t in T:
    kt = [k for k in K if tier[k] == t]; d = [b[k]['score'] - a[k]['score'] for k in kt]
    print(f'  {t:10s} moved {sum(1 for x in d if x):4d} mean {sum(d)/len(d):+.2f} min {min(d):+d} max {max(d):+d} bands {sum(a[k]["band"]!=b[k]["band"] for k in kt)}')
for i, s in enumerate(SK):
    pr = [k for k in K if a[k]['scores'][i] is not None and b[k]['scores'][i] is not None]
    ds = [b[k]['scores'][i] - a[k]['scores'][i] for k in pr]
    sb = C.Counter((a[k]['sbands'][i], b[k]['sbands'][i]) for k in pr if a[k]['sbands'][i] != b[k]['sbands'][i])
    print(f'  {s:9s} moved {sum(1 for x in ds if x):4d} (up {sum(x>0 for x in ds)}, down {sum(x<0 for x in ds)}) mean {sum(ds)/max(1,len(ds)):+.2f} min {min(ds, default=0):+d} max {max(ds, default=0):+d}; bands {sum(sb.values())} {dict(sb)}')
weak = lambda x: x['reliance'] in ('relied-upon', 'integral') and x['sbands'][4] in ('WEAK', 'CRITICAL')
made = [k for k in K if weak(b[k]) and not weak(a[k])]
print(f'  MAGIC AGAINST THE PAGE: made {len(made)} {made[:12]}, cured {sum(weak(a[k]) and not weak(b[k]) for k in K)}')
tc = C.Counter()
for k in K:
    for n in set(b[k]['threats']) - set(a[k]['threats']): tc[('gained', n)] += 1
    for n in set(a[k]['threats']) - set(b[k]['threats']): tc[('lost', n)] += 1
print(f'  AI THREATS: births changed {sum(set(a[k]["threats"])!=set(b[k]["threats"]) for k in K)} {dict(tc)}')
pw = [k for k in K if a[k]['hPow'] != b[k]['hPow']]; ap = [k for k in K if a[k]['powers'] != b[k]['powers']]
print(f'  COUPLING: power structure changed {len(pw)} (of which band changed {sum(a[k]["band"]!=b[k]["band"] for k in pw)}), a power appears or vanishes {len(ap)}, legitimacy label changed {sum(a[k]["legitLabel"]!=b[k]["legitLabel"] for k in K)}')
gv = C.Counter()
for k in ap:
    for n in set(b[k]['powers']) - set(a[k]['powers']): gv[('in', n)] += 1
    for n in set(a[k]['powers']) - set(b[k]['powers']): gv[('out', n)] += 1
if gv: print('  powers in/out: ' + str(dict(gv)))
