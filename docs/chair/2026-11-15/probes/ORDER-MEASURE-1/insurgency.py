# the crisis seat's claim re-measured: insurgency towns, a non-governing power of standing at the summary's write (A1) vs the end
import gzip, json, sys, collections
c = collections.Counter(); ex = []
for l in gzip.open(sys.argv[1]):
    r = json.loads(l); st = r['fam']['stress'][-1][1] or []
    if 'insurgency' not in st: continue
    L = r['labels']; a1 = L.index('A1-stress-summary'); e = len(L) - 1
    def at(i):
        v = None
        for j, x in r['fam']['powers']:
            if j <= i: v = x
        return v
    def rivals(v, labels): return [f[0] for f in v['f'] if f[0] != v['gov'] and f[3] in labels]
    for lab, S in (('Strong+', {'Strong', 'Dominant'}), ('Significant+', {'Strong', 'Dominant', 'Significant'})):
        ra, re_ = rivals(at(a1), S), rivals(at(e), S)
        c[(lab, 'towns')] += 1; c[(lab, 'rival at write')] += bool(ra); c[(lab, 'rival at write, none at end')] += bool(ra) and not re_
        c[(lab, 'none at write')] += not ra
        if lab == 'Strong+' and ra and not re_: ex.append(r['seed'])
for k, v in sorted(c.items()): print(k, v)
print('lost:', ex)
