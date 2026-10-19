p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PR.md'
s=open(p,encoding='utf-8').read()
reps=[
(r"""a hunt moves to this week's predicted place (§5.5),""",
 r"""a hunt moves to this week's predicted place (§5.5) and, where its quarry fled by a way the town does not know whole, rolls its GLEANING (§5.5; BD's write) [CURED 2026-10-19 (fp-final r5) — L-BD 11e],"""),
(r"""every lean is a leaf its host calls in ≤ 3 lines;""",
 r"""the riders' declared hidden token `patrol` joins `routeNetworkConsumers.js :: HIDDEN_PATH_KINDS`' one frozen array (+0 lines; PR-2's unit, OD-PR-51) [CURED 2026-10-19 (fp-final r5) — B.4]; every lean is a leaf its host calls in ≤ 3 lines;"""),
]
for a,b in reps:
    assert s.count(a)==1,a[:60]
    s=s.replace(a,b)
lines=s.split('\n')
idx=[i for i,l in enumerate(lines) if l.startswith('| `worldPulse/strategicPosture.js :: courtRiskAppetiteOf` | ')]
assert len(idx)==1
rows=[
r"""| `worldPulse/routeNetworkConsumers.js :: HIDDEN_PATH_KINDS` · `mayUseHiddenPaths` · `HIDDEN_GRADE` · `routeNetworkLedger.js :: ROUTE_GRADES` · `routeNetworkConsumersTransit.js :: gradeLegMultiplier` | "`export const HIDDEN_PATH_KINDS = Object.freeze(['covert_envoy', 'smuggler', 'wanderer']);`"; `mayUseHiddenPaths` "fails CLOSED: an unrecognized kind is refused, so a lane that forgets to declare itself gets the army's answer"; "`['highway', 'road', 'track', 'hidden']`"; "`hidden: 2,`" ("THE HIDDEN RUNG IS 2 BECAUSE H3'S IS … The agreement is pinned"), equal to `npcConsequencesTuning.js`'s "`HIDDEN_PATH_SLOWDOWN: 2,`"; H3's `planWanderLeg`: "`gradeMultiplier: hop.hidden ? NPC_CONSEQUENCES_TUNING.HIDDEN_PATH_SLOWDOWN : 1,`" | THE HIDDEN WAYS ARE THIS RUNG (RULINGS-ROUND5 B.4): its access law (the riders' one declared token, OD-PR-51), its one price for a way ridden (§5.5), the ladder THE BODIES' `hiddenWayEdges` reads (§2.2) — never a graph or a price of PR's [CURED 2026-10-19 (fp-final r5) — B.4, measured by this lane] | `routeLifecycleEnabled` (virtual) for a rung to move; the access law always | 540 (wc -l) · — · — | the route ledger (not PR's) |""",
r"""| `worldPulse/treasury.js :: UPKEEP_LEDGERS` · `computeUpkeep` | "`export const UPKEEP_LEDGERS = Object.freeze(['deployments']);`"; "today the writer passes exactly one, the `deployments` one-army ledger" | a detachment is NO deployment record, so a hunt pays no deployment upkeep; the riders' coin is the W-COIN `patrols` row when it lights (§3.1, §5.5, §7.1) [REFINED 2026-10-19 (fp-final r5) — measured; BD §9.11's "the TREASURY pays the detachment" routed to BD] | W-COIN | — | derived |""",
]
for k,r in enumerate(rows):
    lines.insert(idx[0]+1+k, r)
s='\n'.join(lines)
open(p,'w',encoding='utf-8').write(s)
print('ok')
