# ORDER-MEASURE-1 · item 5: what a candidate cure moves on the worklists' located rows, by the record alone.
# python3 cure_rows.py <base corpus.ndjson.gz> <candidate corpus.ndjson.gz> <join.json> <verdicts.tsv> [STEP:PREFIX,...]
# For every located row (or those at the named pair): does its text still sit in its own town's record (base -> candidate)?
# Counts rows (and town-prints, the rows' n) CLEARED (stored before, gone after) and KEPT, and for the verified rows their
# verdicts. Also the insurgency summary check: towns whose stored stress summary says "a strong power ... stopped obeying"
# with no non-governing power of standing Significant+ in the FINAL roster.
import gzip, json, re, sys, collections
basef, candf, joinf, verf = sys.argv[1:5]; spec = sys.argv[5] if len(sys.argv) > 5 else None
norm = lambda s: re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9 ]+', ' ', s.lower())).strip()
def strings(x, out):
    if isinstance(x, str): out.append(x)
    elif isinstance(x, dict):
        for k, v in x.items():
            if k not in ('simulationTrace', 'generationCoherenceReceipt', 'config', '_config'): strings(v, out)
    elif isinstance(x, list):
        for v in x: strings(v, out)
    return out
J = [r for r in json.load(open(joinf)) if r.get('match') == 'stored']
if spec:
    st, pre = spec.split(':', 1); pre = pre.split(',')
    J = [r for r in J if r['step'] == st and any(r['path'].startswith(p) for p in pre)]
V = {}
for l in open(verf).read().splitlines()[1:]:
    a, b, c = l.split('\t'); V[b] = c.split(' ')[0]
need = {r['town'] for r in J}
def load(f):
    T = {}; ins = {}
    for l in gzip.open(f):
        r = json.loads(l); s = r['s']
        if r['seed'] in need: T[r['seed']] = norm(' | '.join(strings(s, [])))
        st_ = s.get('stress'); ents = st_ if isinstance(st_, list) else [st_] if st_ else []
        if any(e and e.get('type') == 'insurgency' for e in ents):
            ps = s.get('powerStructure') or {}; gov = ps.get('governingName')
            rival = any((f.get('faction') != gov) and f.get('powerLabel') in ('Strong', 'Dominant', 'Significant') for f in ps.get('factions') or [])
            says = any(e and 'stopped obeying' in (e.get('summary') or '') for e in ents)
            ins[r['seed']] = (says, rival)
    return T, ins
TB, IB = load(basef); TC, IC = load(candf)
c = collections.Counter(); vc = collections.Counter()
for r in J:
    t = norm(r['text']); inb = t in TB.get(r['town'], ''); inc = t in TC.get(r['town'], '')
    k = 'kept' if inb and inc else 'cleared' if inb and not inc else 'new' if inc and not inb else 'absent-both'
    c[k] += 1; c[k + '_n'] += r['n']
    if r['id'] in V: vc[(V[r['id']], k)] += 1
print(f"rows at {spec or 'all located'}: {len(J)} · " + ' · '.join(f'{k} {v}' for k, v in sorted(c.items())))
print('verified rows by verdict -> outcome:', dict(sorted(vc.items())))
bad = lambda I: sum(1 for says, rival in I.values() if says and not rival)
print(f"insurgency towns: {len(IB)} · summary says 'stopped obeying' with no rival of standing at the end: base {bad(IB)} -> candidate {bad(IC)}")
