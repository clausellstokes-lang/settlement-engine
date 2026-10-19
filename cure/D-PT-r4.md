# D-PT-r4 — THE PARTY, P3 round 4a disposition lane (Opus 5.5 high; chair 0a2e8bd9, Fable 5.1, continuing a73343ed; 2026-10-18, started 22:13 EDT by `date`)

Owned files: `docs/DESIGN_FP_ARCH_PT.md` (rewritten in place; brackets `[CURED 2026-10-18 (fp-final r4) — <id>: …]` / `[REFINED 2026-10-18 (fp-final r4) — …]`), this log, `cure/D-PT-r4-probe/`. Code of record: master `81f1cd963` (the detached worktree named in `briefs/RESEARCH-COMMON.md`, read-only; HEAD verified `81f1cd963553f226b222714914ff34584e9911b8`). No git, no suite.

Pre-round copy: `D-PT-r4-probe/PT-before-r4.md` (sha1 `4560b233eecc5a97e01737406f23abfc2d16c898`, the verifier's own snapshot, 768 lines).

## 0. Inputs (read whole)
README (both resume blocks) · COMPILE-COMMON · DISPOSE · RESEARCH-COMMON · RULINGS-PL-MN · -AFTER-RESEARCH · -AFTER-COMPILE · CHAIR-NOTES (1–18) · ROUND1 (+addendum) · ROUND2 · ROUND2b (+addendum) · ROUND3 (§A–§G) · ROUND4 (§A–§D) · `skeptic/PT-r3-verify.md` (2 fails incl. 1 ROUTED-UNAPPLIED · 1 new MAJOR · 4 minors) · `skeptic/SEAMS-r3.md` (ROUTES: "PT: —") · the ROUTES of all nine `cure/D-*-r3.md` (to PT: CH ×2, PL ×1, PR ×1) · `cure/L-BD.md` §4 (PT's route) · `briefs/L-BD.md` items 33, 36 (+32b/33b) · `docs/DESIGN_FP_ARCH_BD.md` §2.1–§2.5, §9.1, §9.5, §11, §12, §19 (as D-BD-r4 left them at 22:19) · CH §2.2, §11, §5 "Bodies considered", §7 bounty (as D-CH-r4 left them at 22:17) · the volume whole.

## 1. Measured first (the receipts that could refute the brief)
- **M1 — A.8's one belief read, EXECUTED** (`D-PT-r4-probe/beliefReadAndRestore.mjs` → `.out`, master's `beliefMap.js :: readBeliefRelationship`, `roads/embassyHazard.js :: relationshipTypeBetween / atOpenWar / atWarWith`): `at_war_with_employer` = `atOpenWar(graph, court, served)` read first; `enemy_in_service` = `readBeliefRelationship(court, served, worldState, relationshipTypeBetween(graph, worldState, court, served)) === 'hostile'`. Belief `hostile` / truth `rival`, no front ⇒ `enemy_in_service`; belief `allied` / truth `hostile` ⇒ none (the court believes them allies); belief and truth `hostile`, no front ⇒ `enemy_in_service` (P49); a live confirmed `war_front` ⇒ `at_war_with_employer` first; omniscient: truth `hostile` ⇒ `enemy_in_service`, truth `rival` ⇒ none. The truth type comes only from the graph — RU-1's threading is what makes the read callable.
- **M2 — the graph is in hand.** `envoyPulse.js :: advanceEnvoyDiplomacyPulse({ worldState, snapshot, regionalGraph, wizardNews, settlementUpdates, tick, … })`; the kernel passes `regionalGraph: applied.regionalGraph` (`pulseKernel.js` l.2194–2197). RN's ONE PERSON STAGE sits inside that function, so PT's registered pass receives the same binding at zero host lines. The same graph also feeds `liveSieges({ worldState, regionalGraph })` (§8.2's siege clock), which round 3 left unthreaded too.
- **M3 — the verifier's PT-W1 conviction RE-RUN, byte-identical** (`gateReadAndUndo.copy.mjs` → `gateReadAndUndo.rerun.out` = `skeptic/PT-r3-verify-probe/gateReadAndUndo.out`): the round-3 inverse ("lifts exactly the edges it wrote") leaves `[]` and the prior windowed ban lost.
- **M4 — the landed restore idiom.** `npcDmVerbs.js :: undoDmVerb`: PARDON's token carries "the lifted edges verbatim, windows and all, so re-shutting a door restores the exact sentence rather than a fresh indefinite one", and the inverse replays them ("pardon: re-shut every door, with its original window": `for (const edge of … payload.edges …) next = addExclusionEdge(next, wnpcId, asObject(edge)).worldState;`). `npcLedger.js :: liftExclusionEdges(worldState, id, { settlementId, kinds })` lifts one door.
- **M5 — A.19's restore, MODELLED on master's writers** (`beliefReadAndRestore.out` A–F): the token stores each touched door's PRIOR edges; the inverse lifts the door and re-writes them — exact for a prior windowed edge (A: `untilTick 152` back; banned at 120, open at 160), a prior absence (B), a prior indefinite edge (C), a three-door region with an untouched fourth door (D); PARDON's inverse with the dropped `banKeys` row (E) exact. **F (the case the bare ruling misses):** a court's `party_banned` window minted AFTER the DM's `BAN_PARTY` folds into the indefinite edge; undoing `BAN_PARTY` from the token alone leaves the door OPEN (`[]`) though the court's ban stands in the world; with the window carried on the door's `banKeys` row (`untilTick 160`) re-written after the prior edge, the court's ban holds at 150 and opens at 170. ⇒ REFINED R4-1.
- **M6 — tokens** (`census-r4.out`, `census_quoted.py`): `body_ended` · `party_made_known_trail` FREE (0 word files and 0 quoted literals in master `src`/`tests` and the ledger `docs/`); `reaches_party` PT's own (1 ledger doc, this volume); `passed` — 0 quoted literals in `src` as a verdict; a backtick field name on `certification/warConvergenceForces.js`'s rows ("`passed` on the returned row"), another surface, registered; BD's `bodies_meet` verdict `passed` in the same sense; `bodyId` — a React `useId` local in two admin components (another surface), BD's and CH's field in the docs.
- **M7 — landed `IMPOSE_CULT`** (`components/settlement/eventComposer/EventComposerDeityField.jsx`, `DeityAssignmentPanel.jsx`): the composer's "Cult" event assigns or removes a CULT deity on a town — the faith ladder's small end — so PT §3.3's "shameful on its face" row and §19b's `deed_harm` ("a trouble brought on") read a cult as villainy: RULINGS-ROUND3 §D.2 (corrected) "any volume text that reads 'cult' as villainy is a finding" (A.3's class) ⇒ REFINED R4-4.

## 2. The record
(written below as the lane goes)

**35 ids: 19 CURED · 0 REFUTED · 0 STOP · 16 NOTED.** Volume after: 819 lines, sha1 `5a51834616112176f10be8aaa6811fbb2349f534`; 57 `(fp-final r4)` brackets (46 CURED · 11 REFINED); diff `D-PT-r4-probe/volume-r4.diff`. The volume's §21 round-r4 block carries every row with its sections.

| id | sev | disposition | where | receipt |
|---|---|---|---|---|
| SEAMS-r2-11 · A.4 (FAIL) | M | CURED per A.8 — CH's ONE belief read quoted, `atOpenWar` first | §9.2, P49 | M1 (A8 cases) |
| RU-1 (FAIL · ROUTED-UNAPPLIED) | M | CURED — `regionalGraph` through the pass, three `gateDefault` calls, `liveSieges` | §7.1, §7.3, §9.2 | M2 |
| PT-W1 (new) | M | CURED per A.19 + REFINED R4-1 | §6, §2.1, §9.3, §16, OD-PT-6, P50, P51 | M3 re-run identical; M5 A–F |
| m1 · m2 · m3 · m4 | m | CURED (m4 by a REFINED bracket) | §13, OD-PT-32, §9.3 | verifier's quotes; PR l.932 |
| SEAMS-r3 "PT: —" | — | NOTED | — | SEAMS-r3 ROUTES |
| D-CH-r3 PT 1 · 2 | routed | CURED (A.8 · RU-1) | §9.2, §7.1 | CH §2.2 signature |
| D-PL-r3 PT | routed | NOTED (holds; m4) | §2.4 | verifier "PL route — §2.4" |
| D-PR-r3 PT | routed | CURED (m1 residue) | §13 | PR l.145, l.382 |
| L-BD §4 PT | routed | CURED — the road arm's BODY HALF (R4-2) | §9.2 … P52 | BD §2.2 `where`, §9.5, BD15, S17 |
| L-BD 33 | owner item | CURED — the bounty's `party_request` (`need.bodyId`, patience, never `fell_short`); `body_ended` on CH's `hunt_won` rows (R4-3) | §7.2, §8.2, §8.6, §3.1, §3.3, P53 | CH §7 (l.463 "The PARTY answers through PT's mirror"), CH-2 |
| L-BD 36 | owner item | CURED — trail revealed to the party = host record; told to a town = `TRAIL_KNOWN`'s `party` dial → `party_made_known_trail` | §3.1, P54 | BD §11 `TRAIL_KNOWN` |
| A.3 | ruling | CURED (PT's word "untied band"; conclave shrine AMBIGUOUS) + REFINED R4-4 (`IMPOSE_CULT`) | §3.3, §19b, P41, P55 | M7 |
| A.8 · A.12 · A.15 · A.19 | ruling | CURED | §9.2 · §0/§2.2/§15 · §7.3 · §6 | M1 · CH l.66 · RN l.365 · M4/M5 |
| A.16 | ruling | CURED (PT's half, REFINED R4-5) | §4 (6), P56 | ST owns the veil |
| A.1 · A.2 · A.4 · A.5 · A.6 · A.7 · A.9 · A.10 · A.11 · A.13 · A.14 · A.17 · A.18 · A.20 | ruling | NOTED — 0 PT hits (python census of each token); A.6: the party's clearing reaches ST's writer, ST closes the occasion | — | census in this lane's session |

## 3. STOPs
NONE.

## 4. REFINED (each marked in the volume; vetoable)
- **R4-1** `banKeys` rows carry the court's window `untilTick`, so `BAN_PARTY`'s restoring inverse keeps a court's ban minted after the verb (M5 F). One integer on PT's declared draft shape (OD-PT-4).
- **R4-2** the road arm's BODY HALF speaks a meeting's words `passed · reaches_party · struck` (default `passed`), never the gate's — a body holds no posture toward the party (BD15). Deliberately unlike CH's body party (a body may stop a PARAGON, `admitted · refused`, default `refused`).
- **R4-3** the party's hand on a body and a trail rides BD's verbs as a `party` dial (`END_BODY`, `TRAIL_KNOWN`), the deed minted at execution — MN's idiom; one act, one undo.
- **R4-4** `IMPOSE_CULT` reads AMBIGUOUS (the composer's "Cult" event assigns a cult deity — the faith ladder's small end), `deed_patronage`, not `deed_harm`.
- **R4-5** a party deed at a kept-secret site names the anchor only, never the site, until `made_known` (A.16's veil).
- **m4** the `banKeys` departure from RULINGS-ROUND3 A.8's letter, marked.

## 5. ROUTES (the halves this lane cannot write; one line per volume)
- **CH:** (1) §11 step 3 reads A.8's belief form (D-CH-r4's own row; PT quotes it at §9.2/P49 — if CH's text still reads truth, PT and CH diverge again); (2) R4-1's case on `paragon.banKeys`: a `person_banned` window minted after `banish` at the same door folds into the indefinite edge and `banish`'s prior-edge inverse then opens the door — add `untilTick` to `paragon.banKeys` and re-write it in the inverse where still ahead (PT §6; `D-PT-r4-probe/beliefReadAndRestore.out` F; CH's own `banKeysUndo.out` covers A–C only); (3) CH §14's bounty call names its body in its `source` so PT's request takes `need: { bodyId }`.
- **BD:** (1) `END_BODY` gains a second dial `party` (body · party) and `TRAIL_KNOWN` a fourth (town · trail · known/forgotten · party); with `party` on, the execution calls PT's door (`body_ended` · `party_made_known_trail`); (2) §12's "the party's road arm" row: verdicts `passed · reaches_party · struck`, default `passed`, the body's own `where` read as truth (PT §9.2).
- **RN:** the deed target shape admits `{ kind: 'body', id }` (a gang's `g:`, a conclave's creed key, a beast none) for PT's `body_ended`; RN reads `body_ended` on CH's `hunt_won` rows (registered by CH, no PT row).
- **FOLD (P4):** §3.4 `party_gate` row — the body half's words and its WHERE `road{a, b}` / the trail; §5 — `body_ended`, `party_made_known_trail`, `need.bodyId`, `banKeys.untilTick`, `passed` (BD's sense, a certification field homonym), `IMPOSE_CULT`'s re-reading; §3.3/§1 six actor kinds (A.12 — FOLD's own row).
- **ST:** nothing owed; PT's §4 (6) declines to break A.16's veil — ST may cite it among the telling sources a kept-secret site guards.

## 6. Open for the chair
1. R4-2 vs CH's body party: two road meetings with a body, two vocabularies, because a body may act on a paragon and never on the party. The alternative is CH's `admitted · refused` on PT's half with the default `admitted` minted anyway — rejected because PT's rule mints no card on a plain admission.
2. R4-1 adds one field to PT's draft shape; the alternative (the token alone) loses a court's later ban on the DM's undo (M5 F).

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution on master's own readers and writers: A.8's read in six cases, the verifier's PT-W1 conviction (re-run byte-identical), and the restoring inverse in six cases incl. F (modelled — the design is unbuilt). CONFIRMED by quoting: every master symbol cited (M2, M4, M7) and every sibling text (CH §2.2/§11/§7/§2.2b, BD §2.2/§9.5/§11, RN l.365, PR l.145/382/932). PLAUSIBLE, not upgraded: that D-CH-r4 lands step 3 in belief form; that BD and RN take the routed dials and target shape; the traversal still PLAUSIBLE until PT-6; every DRAFT constant (none added).
