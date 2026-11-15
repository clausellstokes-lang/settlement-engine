# ORDER-MEASURE-1 · items 1-3 from the snapshot corpus: python3 order_table.py <snap.ndjson.gz> <order.tsv> <out.json>
# 1. per step: the fact families it WRITES (towns where the family changes at that step) and the prose it WRITES
#    (final prose strings born there, by index-free record path); its READS (declared ctx keys -> families; an
#    assembly sub-step reads the whole settlement).
# 2/3. the pairs: final prose born at step i, whose step reads family F, where F changes AFTER i; for each pair, the
#    towns holding such prose and the towns where F at the prose's birth != F at the end, with the HOW of the move.
import gzip, json, sys, collections
snapf, orderf, outf = sys.argv[1:4]
KEYFAM = {'institutions': ['houses'], 'economicState': ['chains', 'trade', 'income', 'food', 'safety'],
          'powerStructure': ['powers', 'powerText'], 'powerIntent': ['powers'], 'npcs': ['people'], 'relationships': ['ties'],
          'history': ['history'], 'stress': ['stress'], 'stressTypes': ['stress']}
ALL = ['powers', 'powerText', 'houses', 'chains', 'trade', 'income', 'food', 'safety', 'defence', 'people', 'ties', 'history', 'stress', 'conditions']
reads = {}
for line in open(orderf):
    c = line.rstrip('\n').split('\t'); name = c[1]; ks = [k for k in c[2][2:].split(',') if k]
    reads[name] = sorted({f for k in ks for f in KEYFAM.get(k, [])})
def reads_of(label):
    # an assembly sub-step reads the settlement as it then stands (factsOf / the generators take the whole record);
    # the canonical conditions are minted only at the step's return, so no sub-step reads them
    if label.startswith('A') and '-' in label or label == 'assembleSettlement': return [f for f in ALL if f != 'conditions']
    if label in ('resolveCrisisCast', 'FINAL'): return ALL
    return reads.get(label, [])
FACT = set(ALL) - {'powerText'}

def val_at(changes, i):
    v = None
    for j, x in changes:
        if j <= i: v = x
        else: break
    return v
def how(fam, a, b):
    if a is None: return ['not-yet-built']
    if fam == 'powers':
        na = [f[0] for f in (a or {}).get('f', [])]; nb = [f[0] for f in (b or {}).get('f', [])]
        out = []
        rem = [x for x in na if x not in nb]; add = [x for x in nb if x not in na]
        if rem and add and len(rem) == len(add): out.append('relabelled')
        else:
            if rem: out.append('removed')
            if add: out.append('added')
        if not out:
            if (a or {}).get('gov') != (b or {}).get('gov'): out.append('governing-changed')
            elif [f[3] for f in a['f']] != [f[3] for f in b['f']]: out.append('standing-label')
            else: out.append('power-share')
        return out
    if fam == 'houses':
        sa, sb = set(a or []), set(b or []); o = []
        if sa - sb: o.append('dropped')
        if sb - sa: o.append('added')
        return o or ['reordered']
    if fam == 'chains':
        ma = {c[0]: c for c in a or []}; mb = {c[0]: c for c in b or []}; o = []
        if set(ma) - set(mb): o.append('chain-dropped')
        if set(mb) - set(ma): o.append('chain-added')
        if any(ma[k] != mb[k] for k in set(ma) & set(mb)): o.append('chain-state')
        return o or ['reordered']
    if fam == 'people':
        ia = {p[0]: p for p in a or []}; ib = {p[0]: p for p in b or []}; o = []
        if set(ia) - set(ib): o.append('person-dropped')
        if set(ib) - set(ia): o.append('person-added')
        if any(ia[k] != ib[k] for k in set(ia) & set(ib)): o.append('seat-or-role')
        return o or ['reordered']
    return ['changed']

steps = None; writes = collections.defaultdict(lambda: collections.Counter()); born = collections.defaultdict(collections.Counter)
pairs = collections.defaultdict(lambda: {'towns': set(), 'moved': collections.defaultdict(set), 'how': collections.defaultdict(collections.Counter), 'strings': 0})
towns = 0
for line in gzip.open(snapf):
    r = json.loads(line); towns += 1; L = r['labels']; steps = steps or L; end = len(L) - 1
    for fam, ch in r['fam'].items():
        for j, _ in ch[1:]: writes[L[j]][fam] += 1
        if ch and ch[0][0] > 0: writes[L[ch[0][0]]][fam] += 1  # first appearance after step 0
    seen = set()
    for path, b, text in r['prose']:
        st = L[b]; born[st][path] += 1
        for fam in reads_of(st):
            if fam not in FACT: continue
            ch = r['fam'][fam]
            if not any(j > b for j, _ in ch): continue  # the family is not written after the birth in this town
            key = (path, st, fam); P = pairs[key]; P['strings'] += 1; P['towns'].add(r['seed'])
            va, vb = val_at(ch, b), val_at(ch, end)
            if json.dumps(va) != json.dumps(vb) and (r['seed'], key) not in seen:
                seen.add((r['seed'], key)); P['moved'][r['seed']]; P['moved'][r['seed']].add(1)
                for h in how(fam, va, vb): P['how'][h][r['seed']] = 1
out = {'towns': towns, 'steps': steps, 'reads': {s: reads_of(s) for s in steps},
       'writes': {s: dict(writes[s]) for s in steps}, 'born': {s: dict(born[s].most_common()) for s in steps},
       'pairs': sorted([{'path': k[0], 'step': k[1], 'fam': k[2], 'towns': len(v['towns']), 'moved': len(v['moved']),
                         'how': {h: len(c) for h, c in v['how'].items()}} for k, v in pairs.items()], key=lambda x: -x['moved'])}
json.dump(out, open(outf, 'w'), indent=0)
print('towns', towns, 'pairs', len(out['pairs']), 'moved>0', sum(1 for p in out['pairs'] if p['moved']))
