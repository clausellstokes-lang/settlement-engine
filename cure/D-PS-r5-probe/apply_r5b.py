#!/usr/bin/env python3
# D-PS-r5 — the second edit pass: aligned with THE BODIES' round-5 §5.2 as read mid-lane (BD 03:52):
# the route lifecycle MOVES the ways' rungs and gates nothing of PS's (dark: BD's candidates alone, the
# degraded arm); PS keeps no rung list of its own; the corridor beside the hop is PS's read; the bypass
# is routed; PS OWNS the access-law widening. Each OLD asserted to occur exactly once.
import sys
P = sys.argv[1]
s = open(P, encoding='utf-8').read()
R = []
def r(old, new): R.append((old, new))

r("""where the ONE ROUTE LADDER's hidden rung is lit (master's `routeLifecycleEnabled`; THE BODIES' `hiddenWaysEnabled` for the known set and the candidate geometry) and THE PASSAGE's planner is lit (PS-4)""",
"""where THE BODIES' ways are lit (`hiddenWaysEnabled`: the known set and the candidate geometry of the ONE ROUTE LADDER's lowest rungs, which master's `routeLifecycleEnabled` moves when it is lit and which stand as the candidates alone when it is dark — BD §5.2's degraded arm) and THE PASSAGE's planner is lit (PS-4)""")

r("""a hidden way is a way of its `hidden` CLASS — the map's `wild` and `way` rungs (the map's contract: `wild · way · trail · track · road · highway`, the host's `hidden` the class {`wild`, `way`}) — whose candidate GEOMETRY is THE BODIES' cover graph (`hiddenWayEdges`, BD §5.2: the candidates the route lifecycle lights into hidden-class ways; the map's canon overrides it when it lands, BD20), keyed by THE BODIES' `trail:<a|b>`; a way that has RISEN to the map's `trail` rung or above is no longer hidden and is crossed as the road is (PS2's land crossing, asked at the border).""",
"""a hidden way is one of THE BODIES' WAYS on that ladder's lowest rungs (BD §5.2: the host's `hidden` CLASS — the map's `wild` and `way` (the map's contract: `wild · way · trail · track · road · highway`, the host's `hidden` the class {`wild`, `way`}) — and whatever worn rung BD §5.2 counts with them; PS keeps no rung list of its own), its candidate GEOMETRY THE BODIES' cover graph (`hiddenWayEdges`: the candidates the route lifecycle lights into the ladder's ways when `routeLifecycleEnabled` is lit, and the candidates alone at the hidden price when it is dark — BD §5.2's degraded arm; the map's canon overrides it when it lands, BD20), keyed by THE BODIES' `trail:<a|b>`. PS reads the CORRIDOR beside the hop into B's land (BD §5.2 (i)); a round-5 BYPASS way skirting a seat between two road nodes (BD §5.2 (ii)) is read by `hiddenWayFor` only once BD's one read says how a bypass maps onto a unit's hops (routed to BD; until then a unit takes no bypass).""")

r("""THE ACCESS LAW is master's, fail-closed (`mayUseHiddenPaths` / `travellerMayWalk`: "armies may not"), and THE PASSAGE makes its ONE DECLARED WIDENING, at PS-4's unit, on the owner's 22:51 word (L-BD 11i):""",
"""THE ACCESS LAW is master's, fail-closed (`mayUseHiddenPaths` / `travellerMayWalk`: "armies may not"), and THE PASSAGE makes — and OWNS (CHAIR-NOTES 18 (d): a shared leaf is an OWNED unit; WC's chooser reads it, routed) — its ONE DECLARED WIDENING, at PS-4's unit, on the owner's 22:51 word (L-BD 11i) and in peace on the chair's L-BD 11 (i) ("a SMALL military unit may take one"):""")

r("""and until it lands THE PASSAGE's hidden way exists only where the ladder carries one.""",
"""and until it lands a corridor beside a live road stands as BD's CANDIDATE only (BD §5.2's degraded arm), which the lit ladder cannot carry as its own edge.""")

r("""the route lifecycle's `routeLifecycleEnabled` (the one ladder's hidden rung — VIRTUAL, dark in every preset; B.4 [CURED 2026-10-19 (fp-final r5)]); THE PATROLS lit for the witness""",
"""the route lifecycle's `routeLifecycleEnabled` moves the ways' rungs where lit and is never a gate of PS's (VIRTUAL, dark in every preset; dark, BD's candidates stand alone at the hidden price — B.4, BD §5.2 [CURED 2026-10-19 (fp-final r5)]); THE PATROLS lit for the witness""")

r("""THE BODIES' `hiddenWaysEnabled` (with `bodiesEnabled`), the route lifecycle's `routeLifecycleEnabled` (the one ladder's hidden rung, RULINGS-ROUND5 B.4) and THE PATROLS' flag for THE HIDDEN WAY (dark any ⇒ no way is ever planned, §5.6)""",
"""THE BODIES' `hiddenWaysEnabled` (with `bodiesEnabled`) and THE PATROLS' flag for THE HIDDEN WAY (dark either ⇒ no way is ever planned, §5.6; master's `routeLifecycleEnabled` moves the ways' rungs and gates nothing of PS's — dark, BD's candidates stand alone, RULINGS-ROUND5 B.4)""")

r("""priced by `gradeLegMultiplier('hidden')`, under the route lifecycle's `routeLifecycleEnabled` too [CURED 2026-10-19 (fp-final r5) — B.4 · B.13 · PS-X1].""",
"""priced by `gradeLegMultiplier('hidden')`, the route lifecycle's `routeLifecycleEnabled` moving the ways' rungs where lit (never a PS gate) [CURED 2026-10-19 (fp-final r5) — B.4 · B.13 · PS-X1].""")

r("""`hiddenWaysEnabled` or `routeLifecycleEnabled` dark ⇒ byte-identical to round 3""",
"""`hiddenWaysEnabled` dark ⇒ byte-identical to round 3 (with `routeLifecycleEnabled` dark the way is BD's candidate at the same price — BD §5.2)""")

r("""`hiddenWaysEnabled` · `routeLifecycleEnabled` |""",
"""`hiddenWaysEnabled` (master's `routeLifecycleEnabled` moves the rungs) |""")

r("""the map's `trail` RUNG is a VISIBLE rung above `way`, and a way risen to it is no hidden way here (§5.6);""",
"""the map's `trail` RUNG is the rung above `way` (outside the host's `hidden` class); whether a way worn to it is still one of THE BODIES' ways is BD §5.2's to say and PS follows it (§5.6);""")

r("""a hidden way is the ladder's `hidden` class (the map's `wild`/`way`); a way risen to the map's `trail` rung or above is crossed as the road;""",
"""a hidden way is one of THE BODIES' ways on the ladder's lowest rungs (the host's `hidden` class, the map's `wild`/`way`, and any worn rung BD §5.2 counts with them — PS keeps no rung list);""")

for old, new in R:
    n = s.count(old)
    if n != 1:
        sys.exit(f"FAIL count={n} for: {old[:120]!r}")
    s = s.replace(old, new, 1)
open(P, 'w', encoding='utf-8').write(s)
print(f"applied {len(R)} replacements")
