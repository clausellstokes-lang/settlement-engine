# V-PL-r4 (4b re-run): an INDEPENDENT executor of PL's OWN STATED RULES for C8's age term (no master code exists).
# PL §4.6: shape 3, cap 24, newest kept; the `fealty_sworn` BASELINE is written when the stage meets a sworn edge
#   with NO epoch-bearing row ("a new oath, a world lit mid-campaign, or a record whose epoch rows were evicted by the cap").
#   Epoch-bearing rows carry the lord's episode key: fealty_sworn, fealty_renewed, fealty_withheld (fealty-question rows).
# PL §3.5 `A`: clamp01(weeksSince(newest RENEWING row) / (25 * 52)); renewing = fealty_sworn, fealty_renewed, protection_kept;
#   "an edge whose renewing rows the cap has evicted reads 1".
CAP, YEAR = 24, 52
H = 25 * YEAR
EPOCH = {'fealty_sworn', 'fealty_renewed', 'fealty_withheld'}
RENEW = {'fealty_sworn', 'fealty_renewed', 'protection_kept'}

def simulate(events, years=25, succession_lit=True):
    """events: dict tick -> list of kinds appended that tick (the stage then runs its baseline check)."""
    rec = [(0, 'fealty_sworn')]
    baselines = 0
    trace_A_one = 0
    for t in range(1, years * YEAR + 1):
        for k in events.get(t, []):
            rec.append((t, k)); rec = rec[-CAP:]
        if succession_lit and not any(k in EPOCH for _, k in rec):
            rec.append((t, 'fealty_sworn')); rec = rec[-CAP:]; baselines += 1
        if not any(k in RENEW for _, k in rec):
            trace_A_one += 1   # weeks in which the stated "evicted reads 1" clause is observable
    T = years * YEAR
    ren = [tk for tk, k in rec if k in RENEW]
    A = 1.0 if not ren else min(1.0, (T - max(ren)) / H)
    return round(A, 3), baselines, trace_A_one

def every(n_per_year, kinds, years=25, start=1):
    ev = {}
    if n_per_year <= 0: return ev
    step = YEAR / n_per_year
    i = 0
    t = start
    while t <= years * YEAR:
        ev.setdefault(int(t), []).append(kinds[i % len(kinds)]); i += 1; t += step
    return ev

fail = ['relief_kept', 'protection_failed', 'service_refused']
rows = []
rows.append(('quiet edge: no row in 25 years', simulate({})))
for n in (1, 2, 3, 6, 10):
    rows.append((f'failing crown: {n} failure rows/yr', simulate(every(n, fail))))
rows.append(('defied crown: 3 fealty_defied/yr', simulate(every(3, ['fealty_defied']))))
rows.append(('lender: 1 service_answered credit/yr + 2 relief_sent/yr', simulate(every(3, ['service_answered', 'relief_sent', 'relief_sent']))))
# one `withhold` answer (epoch-bearing, not renewing) at year 1, then failures: the window where "reads 1" is observable
ev = every(2, fail); ev.setdefault(52, []).append('fealty_withheld')
rows.append(('withheld at y1 + 2 failure rows/yr', simulate(ev)))
rows.append(('failing crown 2 rows/yr, SUCCESSION dark (no baseline writer)', simulate(every(2, fail), succession_lit=False)))
print('A = age term at year 25 (1 = oaths a generation old; 0 = freshly sworn); baselines = fealty_sworn rows re-written by the cap rule;')
print('weeksA1 = weeks in which the stated clause "renewing rows evicted -> reads 1" holds')
for name, (A, b, w) in rows:
    print(f'{name:62s} A={A:5.3f}  baselines={b:2d}  weeksA1={w}')
