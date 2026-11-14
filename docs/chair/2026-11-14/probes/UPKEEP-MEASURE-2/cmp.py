# UPKEEP-MEASURE-2: one candidate's move against the tip, compact (compare.py's measures, one block per candidate).
#   python3 cmp.py <base-dir> <cand-dir> <label> [seed-filter-file] [exclude]
# dirs hold c2-*.ndjson rows {key, base:{score, band, scores, sbands, threats, hPow, powers}} (corpus2.mjs or born.mjs).
import json, sys, glob, collections as C
def load(d): return {json.loads(l)['key']: json.loads(l)['base'] for f in sorted(glob.glob(f'{d}/c2-*.ndjson')) for l in open(f)}
a, b = load(sys.argv[1]), load(sys.argv[2]); lab = sys.argv[3]
K = sorted(set(a) & set(b))
if len(sys.argv) > 4:
    S = set(open(sys.argv[4]).read().split()); ex = len(sys.argv) > 5
    K = [k for k in K if (k not in S) == ex]
SK = ['military', 'monster', 'internal', 'economic', 'magical']
dl = [b[k]['score'] - a[k]['score'] for k in K]
bc = C.Counter(f"{a[k]['band']}->{b[k]['band']}" for k in K if a[k]['band'] != b[k]['band'])
out = [f"== {lab}: births {len(K)}; readiness moved {sum(1 for x in dl if x)} (up {sum(x > 0 for x in dl)}, down {sum(x < 0 for x in dl)}), mean {sum(dl)/max(1,len(dl)):+.2f}, min {min(dl, default=0):+d}, max {max(dl, default=0):+d}; readiness bands changed {sum(bc.values())}: {dict(bc.most_common(8))}"]
tot_sb = 0
for i, s in enumerate(SK):
    pr = [k for k in K if a[k]['scores'][i] is not None and b[k]['scores'][i] is not None]
    ds = [b[k]['scores'][i] - a[k]['scores'][i] for k in pr]
    sb = C.Counter(f"{a[k]['sbands'][i]}->{b[k]['sbands'][i]}" for k in pr if a[k]['sbands'][i] != b[k]['sbands'][i])
    tot_sb += sum(sb.values())
    out.append(f"   {s:9s} moved {sum(1 for x in ds if x):5d} (up {sum(x > 0 for x in ds)}, down {sum(x < 0 for x in ds)}) mean {sum(ds)/max(1,len(ds)):+.2f} range {min(ds, default=0):+d}..{max(ds, default=0):+d}; bands {sum(sb.values())}: {dict(sb.most_common(4))}")
pw = sum(a[k]['hPow'] != b[k]['hPow'] for k in K); ap = sum(a[k]['powers'] != b[k]['powers'] for k in K)
th = sum(set(a[k]['threats']) != set(b[k]['threats']) for k in K)
out.append(f"   score bands changed (five scores) {tot_sb}; powers re-drawn {pw}; a power gained or lost {ap}; AI threats changed {th}")
print('\n'.join(out))
