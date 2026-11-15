# ORDER-MEASURE-1 · items 2-4 in one table: python3 pairs.py <snap.ndjson.gz> <order.json> <join.json> > pairs.md
# A PAIR is (the step a final prose string is born at, a fact family that step reads). It is in the CLASS when a LATER
# step writes that family. Its MOVE in a town is REFINED: powers = a power removed / added / relabelled or a standing
# label changed (a share-only change by the conservation is not counted); houses = a house added or dropped; the
# economy families, the people, the ties, the history, the defence = any change; a family not yet built at the birth
# counts as moved ("not-yet-built").
import gzip, json, sys, collections
snapf, orderf, joinf = sys.argv[1:4]
O = json.load(open(orderf)); READS = O['reads']; STEPS = O['steps']
FACT = ['powers', 'houses', 'chains', 'trade', 'income', 'food', 'safety', 'defence', 'people', 'ties', 'history', 'stress', 'conditions']
def at(ch, i):
    v = None
    for j, x in ch:
        if j <= i: v = x
        else: break
    return v
def moved(fam, a, b):
    if a is None and b is not None: return 'not-yet-built'
    if fam == 'powers':
        if a is None or b is None: return None
        na = {f[0]: f[3] for f in a['f']}; nb = {f[0]: f[3] for f in b['f']}
        if set(na) - set(nb) and set(nb) - set(na): return 'roster-replaced'
        if set(na) - set(nb): return 'power-removed'
        if set(nb) - set(na): return 'power-added'
        if na != nb or a['gov'] != b['gov']: return 'standing-label'
        return None
    if fam == 'houses':
        return 'house-added/dropped' if set(a or []) != set(b or []) else None
    return 'changed' if json.dumps(a) != json.dumps(b) else None
P = collections.defaultdict(lambda: {'strings': 0, 'towns': set(), 'moved': set(), 'how': collections.Counter(), 'paths': collections.Counter(), 'later': collections.Counter()})
per_town_moves = {}
for line in gzip.open(snapf):
    r = json.loads(line); L = r['labels']; e = len(L) - 1; F = r['fam']
    births = collections.defaultdict(list)
    for path, b, text in r['prose']: births[b].append(path)
    tm = {}
    for b, paths in births.items():
        for fam in READS.get(L[b], []):
            if fam not in FACT: continue
            later = [L[j] for j, _ in F[fam] if j > b]
            if not later: continue
            key = (L[b], fam); p = P[key]; p['strings'] += len(paths); p['towns'].add(r['seed']); p['paths'].update(paths)
            m = moved(fam, at(F[fam], b), at(F[fam], e))
            if m: p['moved'].add(r['seed']); p['how'][m] += 1; p['later'].update(set(later)); tm[key] = m
    per_town_moves[r['seed']] = tm
J = [x for x in json.load(open(joinf)) if x.get('match') == 'stored']
rows = collections.defaultdict(lambda: [0, 0]); allrows = [0, 0]
for x in J:
    tm = per_town_moves.get(x['town'], {})
    hit = [fam for (st, fam) in tm if st == x['step']]
    if hit:
        allrows[0] += 1; allrows[1] += x['n']
        for fam in hit: rows[(x['step'], fam)][0] += 1; rows[(x['step'], fam)][1] += x['n']
print('| # | written at (step i) | prose it writes (top paths) | reads family | later writer(s) j | towns with the prose | towns where the family MOVES after the write (how) | worklist rows located there (towns printing) |')
print('|---|---|---|---|---|---|---|---|')
k = 0
for key, p in sorted(P.items(), key=lambda kv: (-len(kv[1]['moved']), STEPS.index(kv[0][0]))):
    if not p['moved']: continue
    k += 1; st, fam = key
    paths = ', '.join(f'`{a}`' for a, _ in p['paths'].most_common(3))
    later = ', '.join(s for s in STEPS if s in p['later'])
    how = ', '.join(f'{h} {c}' for h, c in p['how'].most_common())
    rr = rows.get(key, [0, 0])
    print(f'| {k} | {st} | {paths} | {fam} | {later} | {len(p["towns"])} | {len(p["moved"])} ({how}) | {rr[0]} ({rr[1]}) |')
print(f'\nWorklist rows located at a class pair whose family moved in the row\'s town: {allrows[0]} rows, printing in {allrows[1]} town-prints (sum of the rows\' n).')
