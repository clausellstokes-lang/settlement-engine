# D-PL-r1 — DISPOSITION LOG for `docs/DESIGN_FP_ARCH_PL.md`, P3 round 1 (lane D-PL-r1, chair a73343ed; seat Opus 5.5; 2026-10-18, 01:24–01:45 EDT by `date`)

## OUTCOME
All 38 findings routed to PL are disposed: the 30 of `skeptic/PL-r1.md`, SEAMS-r1-12 and -24, and HOST-r1-1, -3, -5, -15, -17 and -22. All 38 are CURED in the volume. Four of them (SEAMS-r1-12 and HOST-r1-1, -3, -5) are cured on PL's side only, and their other halves belong to other files, listed under §5. None was refuted and no STOP was raised. The L-FOLD lane's unplaced PL item (OD-PL-22 and OD-PL-23 still read as STOPs) is applied. I executed the chair's three PL re-rulings from RULINGS-ROUND1 as written. The volume went from 103,756 to about 173 KB and 690 lines. It carries 104 round-1 CURED brackets and 7 round-1 REFINED brackets, and §16 has a round-1 block that lists every id. Nothing was written to git or to the master worktree, and no test suite or docs proof was run. The docs proof writes into the shared worktree and runs `git checkout`, so it stays with the chair at P4. Instead I ran master's `CLAIM_RE` from `tests/docs/enforcement-claims.test.js` over the whole volume: 0 hits and no `@enforced-by` tag. A column check of all 15 tables shows every row has the right width; one row broke on `||` inside a code span and I fixed it.

## 1. FIRST ACT — the measurements that could refute the re-rulings (master `81f1cd963`, read-only; CONFIRMED by read unless marked)
- **The patch channel (PL-r1-2).** The kernel has exactly ONE outcome fold: `pulseKernel.js` `const applied = applyWorldPulseOutcomes({`. The polity stage's host, `dispositionChannels.js :: advanceTreatiesWithDisposition`, runs AFTER that fold (its own header says "The treaty mover resolves after the kernel's early outcome fold"), and its result passes through `applyPulseMover`. The landed relabel channel is a relationship outcome with `proposalPayload.kind === 'relationship_label_change'`. The frozen applier gives such an outcome the edge seed, the patch, the graph label, the channel bundle, the neighbour networks and the cascade (`applyWorldPulse.js`'s block from `graph = ensureRelationshipEdgeSeed(graph, outcome, now);` to `resolveRelationshipHierarchy({`). Its precedent is `occupation.js :: vassalizationOutcomes`, minted with `applyMode: 'auto'`. A pre-fold host that can carry it is `coup.js :: coupVerdictOutcomes`: 126 effective lines, it receives `worldState` and `rules`, and its doc reads "outcomes for applyWorldPulseOutcomes (deterministic, probability 1)". It is called under `stressorsEnabled`, which is lit in every preset except `static_campaign`. `proposalAdmission.js :: admitGuaranteedProposalOutcomes` passes every outcome that needs no proposal admission. In `changeAuthorityPolicy.js` the precedent row is `occupation_vassalized: { authority: 'auto' }`, and its contract test reads each row's mint with `readFileSync(resolve(wpDir, mod))`, so the leaf must live under `src/domain/worldPulse/`. `decisionTier.js` classes majors by `CAMPAIGN_ALTERING_CANDIDATE_TYPES`, plus `isGovernmentChange` on any `government_change` payload. A missing pair edge is seeded by `relationshipEdgeSeed.js :: ensureRelationshipEdgeSeed` from `metadata.relationshipSeed`. An explicit re-stamp on a `toType: 'vassal'` write wins (`applyRelationshipPatch`).
- **The war closure ((A′)).** `warIntent.js :: stampDeploymentRecall` is a pure worldState writer. Its header says "the war layer consumes the `recalled` stamp at the top of its NEXT tick, resolving the deployment as an outcome:'withdrawal'", and `warDeployment.js` adds "NO disposition delta". The precedent `warRulingsEvidence.js :: applyVerdictWarDissolutions` stamps the cause `'authority_verdict'`. `concludedWarRecord.js :: CLOSE_ROADS` holds 13 tokens ("An unmapped cause reds the discovery arm"). Fallback (B) is not needed by this read, but the end-to-end closure was not executed (PLAUSIBLE).
- **The member basis (PL-r1-3).** In `rulingPowerSeat.js` the basis values are `occupations_ledger` · `occupation_rung_vassalized` · `vassal_edge_treaty_floor` · `vassal_edge` · `treaty_subordinating_ties`. `hegemony.js :: SUBORDINATING_TERM_TYPES` contains `'puppet_seat'`. `vassalageSeat` keeps one candidate, codepoint-first, and the module exports no list.
- **Belief (PL-r1-8).** `beliefMap.js :: readBeliefRelationship` reads "the declared relationship is public". No believed-legitimacy read exists.
- **The fealty key (PL-r1-9).** `rulingPower.js :: authorityTransferEpochFor` documents why cause/tick tuples collide. A `seatTransitions` row carries a stable `id: \`ladder:${sid}:${now2}:…\`` and an `authorityEpoch`.
- **Relief (PL-r1-11).** `warDeployment.js` has `const defenderReliefBonus = allyDefenseEnabled ? computeAllyRelief(…)`. In `simulationRules.js`, `allyDefenseEnabled: false` is the default and `true` is set only in the `full_simulation` block.
- **Endorsement (PL-r1-12).** `religionLegitimacy.js :: neighbourEndorsement` takes the per-tick mean over neighbours, with `LAG: 0.12` a tick.
- **Appointment (PL-r1-19).** The applier applies `FACTION_PAYLOAD_KINDS` payloads for any applied outcome. `applyWorldPulseFactionRoster.js :: applyFactionPayloadEffect` handles `case 'government_change'`.
- **Smaller receipts.** `upswingKernel.js` has a private `applyLegitimacyDeltasToUpdates`. The generosity writer skips a legacy legitimacy. `readWarSeatBooks(` has 10 call sites. `convergence.js` defines `FRIENDLY_REL` with `vassal` in it. `cultureDistance.js` holds the identity sub-term (`W_IDENTITY: 0.4`), whose `governingName` comes from the governing faction's name (`rulingStructure.js`) and from "<occupier> occupation authority" (`warDeployment.js`). There are 25 channel-bundle reader files (`probe/channelReaders.txt`).
- **Effective lines** (`probe/effLines.out`, eslint's own count): coup 126 · decisionTier 72 · changeAuthorityPolicy 238 · relationshipEdgeSeed 50 · concludedWarRecord 295 · concludedWars 255 · warIntent 154 · warDeployment 685 · occupation 738 · warSeatBooks 492 · rulingPowerSeat 295 · religionLegitimacy 227.
- **Tokens** (`probe/tokens.out`). Free tokens (0 · 0 · 0): `polity_verdict`, `polityVerdictOutcomes`, `crownReachAt`, `vassalageSeatsOf`, `fealty_sworn`, `polityHoldEnabled`, `polityBreakEnabled`, `POLITY_LIEGE_SHARE`, `POLITY_PARAMOUNT_REACH`, `narrowed_voice`, `APPOINT_TO_SEAT`. Quoted literals found: `claimant` ×9, `pressed` ×13, `realm` ×140, and `ring` ×2 (a town-map glyph).

## 2. THE RECORD (BLOCKING and MAJOR in full; the MINOR ids are in the volume's §16 block)
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| PL-r1-1 | B | CURED (RULINGS-ROUND1 PL-r1-1) | PL4, PL5, PL6, §2, §3.1–3.3, OD-PL-4/12/16 | §735.2 quoted; band map `0.10/0.25/0.38/0.45`; reach `0/0.1/0.2/0.3`; ⚑ an owner-visible row |
| PL-r1-2 | B | CURED (RULINGS-ROUND1 PL-r1-2; channel measured) | §0 rows, PL14, §5.5, §9 HOOKS, OD-PL-35/36 | the one fold; `coup.js` pre-fold host; `vassalizationOutcomes` shape; `stampDeploymentRecall` |
| PL-r1-3 | B | CURED (RULINGS-ROUND1 PL-r1-3) | PL1, §0, P34 | the basis list |
| PL-r1-4 | B | CURED | §5.5, §7, P22, P30, OD-PL-40 | ordered default conditions; `lapsed` unreachable while a seat is held |
| PL-r1-5 | M | CURED | §5.3 | `vassalageSeat`'s stored-label read; book and coup term guarded; channel walker |
| PL-r1-6 | M | CURED | §5.3, §5.5, §5.7, P33 | `occupation.js` guarded; no `polity_fallen` for contest parties |
| PL-r1-7 | M | CURED | §0, PL2, PL12, §2, P3 | additive `vassalageSeatsOf`; one resolver |
| PL-r1-8 | M | CURED (ruled public by name) | PL16, §2, §3.5, §10, OD-PL-38 | `readBeliefRelationship` precedent |
| PL-r1-9 | M | CURED | §4.6, §5.6, P14/15/36 | `authorityTransferEpochFor` + `seatTransitions` id; `fealty_sworn` baseline |
| PL-r1-10 | M | CURED | PL7, §5.6, §7, HOOKS, P5/P5b | break through the verdict channel; definitional default reads this war's rows |
| PL-r1-11 | M | CURED | §4.3, §7, §8, PL-4, P9/P25 | `allyDefenseEnabled`; OD-MN-21; aligned with MN §4.7 as cured this round |
| PL-r1-12 | M | CURED | §14.3, §14.8 | per-tick `neighbourEndorsement`, `LAG 0.12` |
| PL-r1-13 | M | CURED | PL-10, PL-11, §14.8 | fold req. 16; `IMPOSE_CHANCE = 0.3` |
| PL-r1-14 | M | CURED | PL14, §9 HOOKS | one hook per host |
| PL-r1-15 | M | CURED | §8, §3.6, §9, OD-PL-41 | `polityHoldEnabled`, `polityBreakEnabled` |
| PL-r1-16 | M | CURED | §2, §4.1, §5.3, §5.4, P18 | sides include crown and claimant; `aside` never suspends |
| PL-r1-17 | M | CURED | §8, §10, P32 | the wind-down; `closeRoadFor` Road 7 |
| PL-r1-18 | M | CURED | §3.1 a–d, PL5, §4.1, §4.3, §6 | head and observer named |
| PL-r1-19 | M | CURED | §7, §9, §15.4, OD-PL-43 | `APPOINT_TO_SEAT`; `FACTION_PAYLOAD_KINDS`; `isGovernmentChange` |
| SEAMS-r1-12 | M | CURED (PL's half) | §2, PL5, P37, OD-PL-44 | `crownReachAt`, already cited by CH §5/§11 |
| HOST-r1-1 | B | CURED (PL's half) | §0, §2, §9 PL-1, OD-PL-42 | HR:530, HR:498, HR:744; §934.87 attribution |
| HOST-r1-3 | M | CURED (PL's half) | §9 PL-1, PL15 | H13/H9/H17/H19 rows |
| HOST-r1-5 | M | CURED (PL's half) | §2 | HR:513; "ring" |
| HOST-r1-15 | M | CURED (PL's half) | §3.5, §15.6, OD-PL-33 | HR:528/533; garrisons → ST |
| HOST-r1-17 | M | CURED | OD-PL-13 | HR:909, HR:498–500 |

MINOR ids, all CURED: PL-r1-20 through -30, SEAMS-r1-24 and HOST-r1-22. One line each is in the volume's §16 block.

## 3. STOPS
None. Every cure stays inside a chair ruling or the skeptic's offered cure. No cure needs a kernel line: the verdict mint rides `coup.js`, and the recalls ride `warIntent.js`. No cure contradicts an owner word. PL-r1-1's band map is the chair's own reading of §735.2, and it is marked in the volume as an OWNER-VISIBLE row beside the quotation.

## 4. REFINED (each bracketed in the volume)
1. A WHERE column on §7, per the chair's host ruling 3.
2. A pointer for the PASSAGE word (§2, §4.5); PS's coupling row is the chair's at P4.
3. A note that the "presets" column claims preset names (§8; host ruling 4).
4. PL15 names the world canon as its carrier and PL-1 names its M-W2/H13 wait (host ruling 1).
5. The class argument's remaining roles are stated (§3.4).
6. `narrowed_sphere` is renamed `narrowed_voice` (§3, OD-PL-9).
7. The `dominant` deference prose is corrected (§2).
8. The garrison slot moves to THE SITES (OD-PL-33, §15.6; the chair's 10-18 ruling).
9. PL-2's outcome sentence is added to §13.
10. Crown claims are kept off H13's `claims` field, which carries lineage claims (§9 PL-1).

## 5. FOR THE CHAIR — cross-file follow-ups my cures create or expose (not mine to write)
- **Fold** (SEAMS-r1-17, at P4). The fold still carries:
  - the sphere and `POLITY_LIEGE_CEILING`;
  - the verdict writer relabelling through `applyRelationshipPatch` (the §3.4 `polity_war` row and OD-FC-45);
  - the `relief_answer` registry row as a CLIMAX kind (fold line 447) — now struck by PL-r1-11;
  - `narrowed_sphere` (§5, line 574).

  It also needs a WHERE column for PL's kinds and §5 rows for these tokens: `polity_verdict` · `crownReachAt` · `vassalageSeatsOf` · `fealty_sworn` · `polityHoldEnabled` · `polityBreakEnabled` · `POLITY_LIEGE_SHARE` · `POLITY_PARAMOUNT_REACH` · `APPOINT_TO_SEAT` · `narrowed_voice` · the prose "ring". It needs the MAP REGISTER block (HOST-r1-5), and §3.1 rows for the borders lens versus the sway and for garrisons and held sites (HOST-r1-1, -15).
- **MN §4.7.** It still says "PL's `relief_answer` CLIMAX hearing stays the hearing of an ARMY's siege". Since PL-r1-11, the answer is an input on the `siege` card too. Everything else in MN §4.7 (one decider, `menaceResponseEnabled` alone, PL owning the rows) matches PL §4.3.
- **CH.** The `paragonGateEnabled` row says the crown's ban needs PL's `polityEnabled`. The hold band it reads now lives under `polityHoldEnabled`.
- **PT §9.2, §10.1, §283.** These still weight the crown by `polityHoldOf`. They should read `crownReachAt(…).share01` (the PT half of SEAMS-r1-12).
- **Owner-visible rows for ODQ §934.93:**
  - OD-PL-12, the liege's share map against §735.2's "equal or greater";
  - OD-PL-37, alignment-25f;
  - OD-PL-43, where a sealed appointment waits on the DM's own majors pause.

## CONFIRMED vs PLAUSIBLE
CONFIRMED by read at `81f1cd963` (the symbol and the quoted line): every code receipt in §1 and every "measured" claim in the volume's round-1 brackets. Two checks were CONFIRMED by execution in this lane: the `CLAIM_RE` scan and the table-width check. PLAUSIBLE: that the recall stamps close every member war end to end (PL-9's car-0 executes it, and (B) is the named fallback); the host-line deltas of the HOOKS table (measured at each first wave's car-0); and every DRAFT constant (UNMEASURED, on the FP-46 roster).
