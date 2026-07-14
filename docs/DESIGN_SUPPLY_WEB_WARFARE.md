# DESIGN — SUPPLY-WEB WARFARE (the indirect war doctrine)
## Fable 5 architecture, 2026-07-14 — owner-directed: strategy is not only the direct assault
### Companion/counterpart: DESIGN_GENEROSITY_ENGINE.md (relief corridors are this doctrine's counterplay). Builds after/with E1.

## 0. The owner's directive
War strategy must include the INDIRECT path: a war-prepared and/or better-INFORMED actor — a
smaller force that cannot win the direct fight, or a larger force reducing confrontation risk —
systematically strikes the satellite suppliers (the villages and thorps that feed a town and its
army) to weaken the target BEFORE the final confrontation, with TIME fully priced.

## 1. Why this is cheap: the substrate already exists
The dependency web IS the M2/M6a supply-link graph (rankSupplySources per consuming institution;
the fragility flag already computes dependency concentration). Armies already move (M5), sieges
already starve (M2b/M5), embargo/toll instruments already exist (G1a levers, M6b), beliefs
already gate knowledge (Wave A), misjudgment is already a cause, and moral drift already prices
atrocity. This doctrine is a CHOOSER upgrade + one small conditional plan state + a light RAID
strike mode — not a new physics layer.

## 2. THE WEB READ (belief-gated — "the more informed", mechanically)
For a threat T, the aggressor derives T's inbound dependency web FROM ITS OWN BELIEF MAP, never
truth: which settlements supply T (per good), each satellite's share of T's capacity, T's buffer
thinness. An informed commander (good intel: couriers, allies, teleport bloc, spies-by-carrier)
sees the real web; a fog-blind one sees a stale or wrong web and CAN STRIKE THE WRONG VILLAGE —
misjudgment-as-cause extends to grand strategy, receipted ("they burned Aldermill believing it
fed the garrison; the grain had come by barge for two winters"). Intel becomes a war asset with
a price, exactly per the info-physics thesis.

## 3. THE STRATEGIC CHOICE (direct vs indirect, time-discounted)
enumerateMoves gains a `weaken_first` family. The chooser compares:
- DIRECT EV: the existing feasibility/strength math (unchanged).
- INDIRECT EV: projected assault EV against a WEAKENED T after N strangulation ticks, MINUS the
  time discount — and the discount is where the owner's "taking into consideration time" bites:
  (a) own drain/exhaustion accrual over N; (b) T's ADAPTATION: M2 failover re-routes supply
  automatically (strangulation must OUTPACE re-sourcing or it never converges — the plan
  re-scores each tick and ABANDONS a stalling campaign; no forever-grind); (c) T's belief
  updates → counterplay (§5) gets stronger the longer the pattern runs; (d) seasonal windows
  (campaign season; a winter strangulation of a snowed-in town is cheap but cruel — and the
  hungry-gap multiplies it); (e) third-party drift (allies arrive, coalitions form).
WHO CHOOSES INDIRECT emerges from existing reads: a smaller force (direct EV terrible), a
cautious/lawful commander (the ONE W0 risk-tolerance read — risk reduction is in-character), an
informed one (the web read is high-confidence). A bold strong aggressor still just attacks.

## 4. INSTRUMENTS (one doctrine, alignment/archetype-flavored — full coherence)
The same web read drives instruments from bloody to bloodless, chosen by archetype + alignment:
- **RAID** (new light strike mode on the existing deployment machinery): a 1-2 tick strike on a
  village/thorp — burns granary/stock, severs its supply links for K ticks, triggers bounded M4
  flight; NO occupation, NO annihilation (rescuable-not-annihilated: small settlements recover;
  `required` institutions and the M11b bounds discipline apply). Cheap, fast, ugly.
- **OCCUPY the satellite** (existing machinery): slower, holds the link, costs garrison.
- **EMBARGO / TOLL WAR** (the G1a levers + M6b, now real): the merchant-archetype version —
  strangle by trade denial, zero bloodshed, slower, reversible.
- **PURCHASE DENIAL** (rides E1's purchase instrument): outbid T for its own suppliers' output —
  economic warfare priced in coin; the evil-lean or wealthy actor's quiet weapon.
- **INTERDICTION** (existing M1/M7 physics): patrol the routes rather than strike the sources.
A war goal composes these: the campaignPlan (§6) sequences raids on the two granary villages,
an embargo on the river trade, THEN the siege — or stops early when T sues for terms (§5).

## 5. COUNTERPLAY (the equal-and-opposite law, applied to war)
The target is not passive, and the pattern is LEGIBLE: consecutive supplier strikes against T's
web mint a "they mean to starve us" belief/news beat (pattern recognition through T's OWN belief
map — an ill-informed T misses it; an informed T reads intent early). Responses, all existing
machinery given honest inputs: M2 FAILOVER re-sourcing (automatic, already built — the web
adapts); GRANARY SURGE (stockpile posture); GARRISON THE WEB (deployments defending satellites —
defense of villages becomes rational, which makes raids costlier, which the raid EV reads);
PREEMPTIVE STRIKE (the mobilization reactions, now with real payloads post-G1a); EARLY TERMS
(sue-for-peace, now with grip post-G1a); COUNTER-STRANGLE (symmetric doctrine against the
aggressor's web); and — the coherence jewel — ALLIED RELIEF: E1's corridors and M7's mercy
smuggling run grain INTO the strangled town, making economic siege a two-sided flow war
(strangulation vs relief throughput), which the existing conservation physics resolves honestly.
THIRD PARTIES: a satellite supplying TWO towns drags the second patron in when struck —
collateral diplomacy priced by the same relationship machinery.

## 6. THE CAMPAIGN PLAN (the one new state, small)
A conditionally-materialized `campaignPlans` entry under spatialLedgers on the aggressor:
{targetId, stages:[{mode, satelliteId, status}], mintedTick, lastScoredTick} — re-scored every
tick (plans are hypotheses, not rails), abandoned on EV collapse (receipted: "the strangulation
of Marchmont was abandoned; the river barges could not be stopped"), consumed stage-by-stage
through the EXISTING strategy-slot/deployment/proposal machinery (DM oversight per the CL
authority axis — under dm_advanced every stage is a proposal; under autonomy it executes).
Bounded: one live plan per aggressor; stages ≤ 4; the M9d payload pattern for approvals.

## 7. ATROCITY ECONOMICS (why not always raze the villages? — the brakes)
Raiding innocents is the textbook moralDrift case (victim-innocence weighting EXISTS): scorched-
web campaigns drift the aggressor's alignment, which feeds W-C2 conscience, which reshapes its
OWN future options (a drifted-evil actor loses lawful allies via the stance/relationship reads —
the doctrine corrupts its user, mechanically). Resolve feedback: strangulation HARDENS the
target's will (defender resolve/exhaustion feedback — historically true; a starved town
capitulates, a raided people rallies — both curves exist, the constants say which dominates
when). Reputation broadcast: "the burner of villages" travels the rumor network — future
diplomacy, alliance formation, and E1 generosity math all read it. And the M11-class bound:
satellites are never annihilated — flight, severance, and recovery, not deletion.

## 8. CONSTITUTIONAL POSTURE
Dormant behind the existing strategy/war gates (no new top-level flag — this is a chooser
deepening inside settlementStrategyEnabled + warLayerEnabled); zero eager (lazy kernels; the
plan ledger nested); goldens byte-identical off-path; seeded forks (`webwar:${aggressor}:
${target}:${tick}`); codepoint-sorted; every constant named/frozen/retunable; aggregate-only;
receipts on every stage, score, abandonment, and misjudgment.

## 9. PINS + SOAK
The owner's scenario as the flagship pin: a smaller informed force indirect-defeats a larger
neighbor (raid granary villages → buffer collapse → weakened siege succeeds) where the direct
assault provably fails under the same seed. The misjudgment pin (fog-blind wrong-village raid,
receipted). The adaptation pin (failover outpaces a half-hearted strangulation ⇒ plan abandons).
The counterplay pin (allied relief keeps the town above the starvation floor ⇒ the aggressor's
plan EV collapses). The atrocity pin (a scorched-web campaign measurably drifts alignment +
costs an alliance). SOAK: a 30y two-power border with one merchant-archetype power — the
bloodless embargo variant occurs endogenously; no strangulation forever-grind; satellite
populations recover post-war.

## 10. SEQUENCING
Design-complete now; BUILDS after E1a (it consumes the relief counterplay + purchase instrument)
as wave W-DOCTRINE, or interleaves with E1c. Its coherence-matrix rows (per the generosity doc's
completeness rule): information ✓ (web read + pattern legibility), trade ✓ (the web IS trade),
factions ✓ (archetype instrument choice), alignment ✓ (atrocity drift), deity ✓ (via stance-
colored alliances), relations ✓ (collateral diplomacy, reputation), generosity ✓ (the counter).
