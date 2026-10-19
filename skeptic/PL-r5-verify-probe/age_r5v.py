# V-PL-r5: an INDEPENDENT executor of PL's r5 stated rules for C8's age term A (PL §3.5 `A`, §4.6, §10 ↳ oathSince),
# written from the volume's text, not from the lane's script. Week-grain; one stage pass per week after the week's rows.
# Rules read from the volume (2026-10-19 03:58 text):
#  R1 shape 3 keeps the newest CAP=24 rows (newest-cap).
#  R2 SUCCESSION lit: an edge with NO epoch-bearing row (fealty_sworn/renewed/withheld) gets a fealty_sworn baseline
#     (first meeting, after eviction, at a relight).
#  R3 oathSince: set when SUCCESSION writes a baseline on an edge carrying no oathSince; moved forward by every
#     fealty_renewed; NEVER by a later baseline; kept through a dark span; dropped when the edge leaves `vassal`.
#  R4 A = clamp01(weeks since max(oathSince, newest surviving protection_kept) / (25*52)); A computed only with SUCCESSION lit.
#  R5 (§10 ↳ import): an edge WITHOUT oathSince reads A from its oldest surviving row's tick until the append sets it.
CAP, YEAR, H = 24, 52, 25 * 52
EPOCH = {'fealty_sworn', 'fealty_renewed', 'fealty_withheld'}

def run(events, years=25, succ=lambda t: True, oath0='unset', rec0=None, relabel_at=()):
    rec = list(rec0 or [])
    oath = None if oath0 == 'unset' else oath0
    for t in range(0, years * YEAR + 1):
        if t in relabel_at:            # the edge leaves `vassal` and is re-sworn the same week
            rec, oath = [], None
        for k in events.get(t, []):
            rec.append((t, k)); rec = rec[-CAP:]
            if k == 'fealty_renewed' and succ(t):
                oath = t                  # R3: moved forward by a renewal
        if succ(t) and not any(k in EPOCH for _, k in rec):
            rec.append((t, 'fealty_sworn')); rec = rec[-CAP:]
            if oath is None:
                oath = t                  # R3: first baseline only
    T = years * YEAR
    if not succ(T):
        return None
    base = oath if oath is not None else (min(tk for tk, _ in rec) if rec else T)
    pk = [tk for tk, k in rec if k == 'protection_kept']
    return round(min(1.0, (T - max([base] + pk)) / H), 3)

def every(n, kinds, years=25, start=1):
    ev, i, t = {}, 0, float(start)
    while n > 0 and t <= years * YEAR:
        ev.setdefault(int(t), []).append(kinds[i % len(kinds)]); i += 1; t += YEAR / n
    return ev

def merge(*evs):
    out = {}
    for ev in evs:
        for t, ks in ev.items(): out.setdefault(t, []).extend(ks)
    return out

fail = ['relief_kept', 'protection_failed', 'service_refused']
W = [
 ('P52(a) quiet 25y', {}, {}),
 ('P52(b) busy edge 3 fail/yr', every(3, fail), {}),
 ('10 fail/yr', every(10, fail), {}),
 ('defied 3/yr', every(3, ['fealty_defied']), {}),
 ('protective 1 pk/yr', every(1, ['protection_kept']), {}),
 ('P52(c) renewed y20 then 30 fail/yr', merge({20*YEAR: ['fealty_renewed']}, every(30, fail, start=20*YEAR+1)), {}),
 ('P52(d) relit y10-15, 3 fail/yr', every(3, fail), {'succ': lambda t: not (10*YEAR <= t < 15*YEAR)}),
 ('P52(e) succession dark', every(3, fail), {'succ': lambda t: False}),
 ('re-sworn at y24 (left vassal, re-sworn)', every(3, fail), {'relabel_at': {24*YEAR}}),
 ('IMPORT: legacy edge, 1 renewal row at y0, no oathSince, 3 fail/yr', every(3, fail), {'oath0': 'unset', 'rec0': [(0, 'fealty_renewed')], 'imported': True}),
 ('peace sweep: 4 riders_quartered/yr + 1 credit/yr (no pk)', merge(every(4, ['riders_quartered']), every(1, ['service_answered'])), {}),
]
print(f"{'world':66s} A")
for name, ev, kw in W:
    imported = kw.pop('imported', False)
    if imported:
        # an imported edge whose oathSince is absent: the field is None but rows exist
        rec0 = kw.pop('rec0'); kw.pop('oath0')
        a = run(ev, rec0=rec0, oath0=None, **kw)
    else:
        a = run(ev, **kw)
    print(f"{name:66s} {'dark' if a is None else a}")
