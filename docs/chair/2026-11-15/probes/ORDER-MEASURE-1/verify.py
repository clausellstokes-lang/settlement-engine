# ORDER-MEASURE-1 · item 4 verification sheet: python3 verify.py <snap.ndjson.gz> <join.json> <pair-spec> [k=20]
# pair-spec: STEP:PATHPREFIX[,PATHPREFIX...]  e.g. generateNarratives:history.,settlementReason
# Prints k rows of that pair (evenly spaced by row id among the rows the join located there), each with its reader's
# why, its text, and THE RECORD'S MOVE between the line's birth and the end: powers lost / gained (name·category·label),
# houses dropped / added, trade and chains changed, the defence at the end. The judgment is the reader's, by the record.
import gzip, json, sys
snapf, joinf, spec = sys.argv[1:4]; k = int(sys.argv[4]) if len(sys.argv) > 4 else 20
step, prefixes = spec.split(':', 1); prefixes = prefixes.split(',')
J = [r for r in json.load(open(joinf)) if r.get('match') == 'stored' and r['step'] == step and any(r['path'].startswith(p) for p in prefixes)]
J.sort(key=lambda r: int(r['id']) if str(r['id']).isdigit() else 0)
k = min(k, len(J)); pick = [J[int(i * len(J) / k)] for i in range(k)] if J else []  # k > len(J) takes every row once
need = {r['town'] for r in pick}; T = {}
for line in gzip.open(snapf):
    r = json.loads(line)
    if r['seed'] in need: T[r['seed']] = r
def val_at(ch, i):
    v = None
    for j, x in ch:
        if j <= i: v = x
        else: break
    return v
print(f'{spec}: {len(J)} rows located, n={sum(r["n"] for r in J)}; showing {len(pick)}')
for r in pick:
    t = T[r['town']]; L = t['labels']; b = L.index(step); e = len(L) - 1; F = t['fam']
    pa, pe = val_at(F['powers'], b), val_at(F['powers'], e)
    A = {f[0]: f for f in (pa or {}).get('f', [])}; E = {f[0]: f for f in (pe or {}).get('f', [])}
    d = []
    lost = [f'{A[x][0]}·{A[x][1]}·{A[x][3]}' for x in A if x not in E]; got = [f'{E[x][0]}·{E[x][1]}' for x in E if x not in A]
    if lost: d.append('P-' + '; '.join(lost))
    if got: d.append('P+' + '; '.join(got))
    ha, he = set(val_at(F['houses'], b) or []), set(val_at(F['houses'], e) or [])
    if ha - he: d.append('H-' + '; '.join(sorted(ha - he)))
    if he - ha: d.append('H+' + '; '.join(sorted(he - ha)))
    ta, te = val_at(F['trade'], b) or {}, val_at(F['trade'], e) or {}
    for kk in ('x', 'm', 'n'):
        a_, e_ = set(ta.get(kk, [])), set(te.get(kk, []))
        if a_ != e_: d.append(f'T{kk}-{sorted(a_ - e_)}+{sorted(e_ - a_)}')
    if json.dumps(val_at(F['chains'], b)) != json.dumps(val_at(F['chains'], e)): d.append('chains moved')
    de = val_at(F['defence'], e); da = val_at(F['defence'], b)
    if da is None and de: d.append('defence built later: ' + str(de.get('r')))
    print(f"\n#{r['id']} n{r['n']} {r['town']} [{r['path']}] {r['file']}\n  WHY: {(r['why'] or '')[:150]}\n  TXT: {r["text"][:130]}\n  MOVE: {' | '.join(d)[:300] or '(none in these families)'}  ENDP: {', '.join(f'{x[0]}·{x[1]}·{x[3]}' for x in E.values())[:140]}")
