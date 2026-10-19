# D-PL-r5: an executor of PL's r5 STATED RULES for C8's age term A (RULINGS-ROUND5 A.7; no master code exists).
# Rules as the r5 volume writes them (PL §3.5 `A`, §4.6, §10 shape 3):
#  - shape 3 keeps the newest CAP=24 rows; the SUCCESSION family writes a `fealty_sworn` baseline whenever the edge holds
#    no epoch-bearing row (first meeting, eviction, relight) -- a BOOKKEEPING row, never read by A;
#  - `oathSince` = the tick the STANDING oath was sworn: set with the edge's FIRST baseline (the record's birth), moved
#    forward by every `fealty_renewed` (renew / stand_by: the oath sworn again to the lord of the new episode), NEVER by a
#    re-written baseline (eviction, relight), kept through a dark span, dropped by the normalizer when the edge stops being `vassal`;
#  - A = clamp01(weeksSince(max(oathSince, newest surviving protection_kept)) / (25*52));
#  - A is computed only where C8 and politySuccessionEnabled are lit (its declared host flag); otherwise the hold is the
#    six-term formula (A absent).
# The r4 rule (verifier's ageterm_r4b.py) is executed beside it for the same worlds.
CAP, YEAR = 24, 52
H = 25 * YEAR
EPOCH = {'fealty_sworn', 'fealty_renewed', 'fealty_withheld'}
RENEW_R4 = {'fealty_sworn', 'fealty_renewed', 'protection_kept'}
RENEW_R5 = {'protection_kept'}  # fealty_renewed is folded into oathSince

def run(events, years=25, succession=lambda t: True):
    rec, oath, baselines = [], None, 0
    for t in range(0, years * YEAR + 1):
        for k in events.get(t, []):
            rec.append((t, k)); rec = rec[-CAP:]
            if k == 'fealty_renewed' and succession(t) and oath is not None: oath = t
        if succession(t) and not any(k in EPOCH for _, k in rec):
            rec.append((t, 'fealty_sworn')); rec = rec[-CAP:]; baselines += 1
            if oath is None: oath = t
    T = years * YEAR
    # r4: newest renewing row; none -> 1 ("evicted reads 1")
    r4 = [tk for tk, k in rec if k in RENEW_R4]
    A4 = 1.0 if not r4 else min(1.0, (T - max(r4)) / H)
    # r5: oathSince or a surviving renewal
    if not succession(T) or oath is None:
        A5 = None  # C8's A dark (its host flag politySuccessionEnabled dark): the six-term hold, byte-identical
    else:
        cands = [oath] + [tk for tk, k in rec if k in RENEW_R5]
        A5 = min(1.0, (T - max(cands)) / H)
    return round(A4, 3), (None if A5 is None else round(A5, 3)), baselines, oath

def every(n, kinds, years=25, start=1):
    ev, i, t = {}, 0, float(start)
    if n <= 0: return ev
    while t <= years * YEAR:
        ev.setdefault(int(t), []).append(kinds[i % len(kinds)]); i += 1; t += YEAR / n
    return ev

def merge(*evs):
    out = {}
    for ev in evs:
        for t, ks in ev.items(): out.setdefault(t, []).extend(ks)
    return out

fail = ['relief_kept', 'protection_failed', 'service_refused']
worlds = [
    ('quiet edge: no row in 25 years', {}, None),
    ('failing crown: 1 failure row/yr', every(1, fail), None),
    ('failing crown: 3 failure rows/yr', every(3, fail), None),
    ('failing crown: 10 failure rows/yr', every(10, fail), None),
    ('defied crown: 3 fealty_defied/yr', every(3, ['fealty_defied']), None),
    ('protective crown: 1 protection_kept/yr', every(1, ['protection_kept']), None),
    ('busy protective: 1 protection_kept/yr + 30 failures/yr', merge(every(1, ['protection_kept'], start=26), every(30, fail)), None),
    ('renewed at y20 (coup -> renew), quiet since', {20 * YEAR: ['fealty_renewed']}, None),
    ('renewed at y20, then 30 failures/yr (renewal evicted)', merge({20 * YEAR: ['fealty_renewed']}, every(30, fail, start=20 * YEAR + 1)), None),
    ('relit: succession dark y10-y15, 3 failures/yr', every(3, fail), lambda t: not (10 * YEAR <= t < 15 * YEAR)),
    ('succession dark throughout, 3 failures/yr', every(3, fail), lambda t: False),
]
print('A at year 25 (1 = oaths a generation old, 0 = freshly sworn or renewed); r4 = the round-4 rule; r5 = oathSince')
print(f"{'world':58s} {'A r4':>6s} {'A r5':>6s} baselines oathSince")
for name, ev, succ in worlds:
    A4, A5, b, oath = run(ev, succession=(succ or (lambda t: True)))
    print(f"{name:58s} {A4:6.3f} {('dark' if A5 is None else f'{A5:.3f}'):>6s} {b:9d} {oath}")
