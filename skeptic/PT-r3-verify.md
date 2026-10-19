# PT-r3-verify — refuting verifier for THE PARTY, P3 round 3b (V-PT-r3, Opus 5.5; chair a73343ed continued by 0a2e8bd9; 2026-10-18 18:53 EDT by `date`)

**COUNTS: 14 holds · 2 fails · 0 stop · 1 new (0 BLOCKING · 1 MAJOR) · 1 routedUnapplied (counted inside the 2 fails).**

**Outcome.** PT-V1's cure holds: I re-ran the lane's probe and got identical output. The A.4 cure fails. PT and CH cured the ONE leaf's `enemy_in_service` in parallel with two different reads, and neither applied the other's route (CH-r3-verify RU-2 is the same contradiction from CH's side). There is one new MAJOR (PT-W1): the DM's undo of `BAN_PARTY` erases a court's emergent ban that the strictest-wins merge folded in. The §E.1 and §E.2 receipts hold (0 hits in PT).

**Read whole:** README (both resume blocks), VERIFY, RESEARCH-COMMON, every rulings file (incl. RULINGS-ROUND3 §A–§F), the BOARD, `PT-r2-verify`, `D-PT-r3` and its probe, and the volume (768 lines, sha1 `4560b233…`, the lane's own). **ROUTES (§E.4):** I read the routes of all nine `D-*-r3` files. Halves addressed to PT come only from CH (2), PL (1) and PR (1). **Code:** master `81f1cd963`, read only. My probe is `PT-r3-verify-probe/gateReadAndUndo.mjs` → `.out`; the lane's probe re-run is `windowedLapse.rerun.out` (identical).

## Fails and new
| id | verdict | receipt · cure |
|---|---|---|
| SEAMS-r2-11 · A.4 (M) | **FAILS** (a new contradiction) | **PT §9.2 (l.323):** "LANDED PAIR STATE is `hostile`, as this court believes it: `readBeliefRelationship`". **CH §11 step 3 (l.521), the leaf's owner:** "`relationshipTypeBetween(graph, worldState, courtId, servedId) === 'hostile'` … no live front" (a truth read). **EXECUTED:** with belief `hostile` and truth `rival`, PT refuses and CH admits; with belief `allied` and truth `hostile`, it is the reverse. PT's read also needs a `truthType` that only the graph supplies. P49's "`hostile`, not at war" holds only if "at war" means CH's `atOpenWar`, which PT never names: the landed `atWarWith` reads "hostile = open war" (truth `hostile` → `true`). **Cure:** round 4 rules ONE read for the leaf, and PT cites it verbatim. |
| RU-1 (`D-CH-r3` §5, PT item 2) | **FAILS · ROUTED-UNAPPLIED** | **Route:** "`party_gate`'s `gateDefault` calls (l.280, l.323, l.325) pass the stage's `regionalGraph` as `graph`". **PT still reads:** `gateDefault({ worldState, snapshot, actorRef: {kind:'party'}, settlementId, tick })` at all three sites. **CH's signature is** `({ worldState, snapshot, graph, actorRef, … })` (CH l.210, l.518). PT's pass `advancePartyEngagements({ worldState, snapshot, tick, weekly, crossings })` (l.264) takes no graph either. **Cure:** thread the stage's `regionalGraph` through. |
| **PT-W1** (MAJOR, new) | — | **The contradiction:** §6 Undo (l.257) and the §16 undo row say "`BAN_PARTY`'s inverse lifts exactly the edges it wrote". After the merge, though, the DM's edge and the court's emergent edge are ONE edge, which r3 says is "lifted ONLY by `PARDON_PARTY`" (§9.3, OD-PT-6, P46). **EXECUTED:** an emergent ban `{Kell, untilTick 152}` plus `BAN_PARTY(Kell)` gives one `indefinite` edge. The inverse's lift then leaves `[]` and `emergentBanRestored: false`, although the prior state was banned. **Origin:** the sentence is older than r3, but the contradiction and the untraced undo path came with this cure (PT-V1's class). **The landed idiom restores:** `npcDmVerbs.js :: undoDmVerb` uses "`exclusions: Array.isArray(payload.edges) ? payload.edges : []`". **Cure:** the inverse restores the door's PRIOR edge, and a pin goes beside P46. |

## Holds (one line each)
- **PT-V1** — re-run identical, cases A–F.
- **RN-V2 cite** — RN l.149: "THE TRIPLE (`ver`, `mag`, the heard doer)".
- **A.7** — §0.
- **A.8** — holds on substance; see m4.
- **A.11** — RN l.228, l.468, R59 and OD-RN-41 agree with PT §7.3, §14 and P48.
- **A.14** — `pairKey`, `classifyLegModes` and `candidateRoutes` all exist.
- **FOLD-V3 · FOLD-V4 · RN-V6** — hold.
- **CH route item 1** — the `hostile` label is carried; its conflict is the FAIL above.
- **PL route** — §2.4.
- **PR route** — l.287.
- **§E.1** — 0 hits for `readiness01`, `full` or `empty`.
- **§E.2** — 0 hits for "polity resolutions come before" or "a `sent` taken after".

## Minor carries (not counted)
- **m1 (c4's residue).** §13 l.380 ("the WATCH of `party_warrant` · `party_ambush`, which on a road IS a detachment") and OD-PT-32 l.548 still put a warrant on a road. PR l.839 says "only `party_ambush` sends riders on a road".
- **m2.** §9.3 says "CH §11 states the same rule", but CH l.535 drops the key "either way", where PT keeps it inert. CH also has no one-key-per-door rule.
- **m3.** §9.3 still writes "`banKeys` … ≤ 8" without "windowed".
- **m4.** A.8 says "PT's `banKeys` … use the one form". PT instead followed PL's measured route (a seat episode is not a ban episode). That is right on substance, but it departs from the ruling's letter and is labelled CURED without a REFINED bracket.

The spot-checked NOTED rows hold: A.1–A.3, A.5, A.6, A.9, A.10, A.12, A.13, A.15, `party_stopped`, CH's "until it lands", ST note 6, and carries c1, c2, c3, c5 and c6.

**CONFIRMED vs PLAUSIBLE:** PT-V1's hold, the A.4 read divergence and PT-W1's lost ban are CONFIRMED by execution on master's writers and readers; the route and text verdicts are CONFIRMED by quoting; PT-W1's MAJOR severity and the road arm's traversal remain PLAUSIBLE, and nothing was upgraded.
