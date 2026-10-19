# D-PT-r3 — disposition lane for THE PARTY, P3 round 3a (Opus 5.5, chair 0a2e8bd9 continuing a73343ed; 2026-10-18)

**Outcome.** I disposed all 37 input ids: 18 CURED, 0 REFUTED, 0 STOP, 19 NOTED. The volume is `docs/DESIGN_FP_ARCH_PT.md`: 768 lines, sha1 `4560b233…`, up from 718 lines at `0c0b0661…`, which is the sha the verifier read. Every change carries `[CURED 2026-10-18 (fp-final r3) — …]`. There is one refinement, R3-1, marked `[REFINED 2026-10-18 (fp-final r3) — …]`. §21 has gained a round-r3 block. Git and the test suite were not touched. The code of record, master `81f1cd963`, was read only.

**Inputs, read whole:**
- The kit README, COMPILE-COMMON, DISPOSE, OWNERSHIP and the BOARD.
- The rulings files: RULINGS-PL-MN, -AFTER-RESEARCH, -AFTER-COMPILE, CHAIR-NOTES, RULINGS-ROUND1 with its addendum, ROUND2, ROUND2b with its addendum, and ROUND3.
- `skeptic/PT-r2-verify.md`.
- The PT volume.

**Inputs, read by grep in context:**
- The PT-routed rows in the other eight `*-r2-verify.md` files.
- The round-3a sibling logs `D-PL-r3`, `D-PR-r3`, `D-ST-r3` and `D-PS-r3`.

## 1. What I measured first (the receipts the cures were checked against)

**M1, PT-V1, re-run at master.** The verifier's own case (`skeptic/PT-r2-verify-probe/mergeLift.mjs`) was re-run as case E of `D-PT-r3-probe/windowedLapse.mjs`, against master's `npcLedger.js` writers.
- The steps: an emergent windowed ban at Kell, then the DM's indefinite ban at Kell, then `liftExclusionEdges(party, {settlementId: Kell})`.
- The result: `stillBannedAtKell: false`. **The fail is CONFIRMED by execution.**
- Code read: `npcLedgerFacets.js :: normalizeExclusionEdges` ("the STRICTER edge wins — indefinite …"). `npcLedger.js :: liftExclusionEdges` lifts every edict-kind edge at the door: `kinds.includes(edge.kind) && (door === '' || edge.settlementId === door)`.

**M2, the cured rule, modelled on master's writers** (the design is unbuilt; the merge and `isExcludedFrom` are master's):

| Case | Result |
|---|---|
| A: emergent ban, then the DM's | Nothing lifted; the key stays, inert; `stillBannedAtKell: true` |
| B: the DM's ban, then emergent | Still banned after the seat change |
| C: emergent ban alone | Lifted by the seat change |
| D: emergent at Kell, the DM's at Tolle | Kell lifts and Tolle stands |
| F: the cap | 9 emergent bans plus 1 indefinite door. 8 windowed keys kept and the oldest evicted. The evicted door stays banned until its `untilTick` and then opens. The indefinite door's key is kept outside the cap. |

Output: `D-PT-r3-probe/windowedLapse.out`.

**M3, symbols re-read at master:**
- `beliefMap.js :: readBeliefRelationship(observerId, subjectId, worldState, truthType)`: "if (b.source === 'belief') return b.record.allianceLabel || truthType;". Used for A.4.
- `distanceRead.js :: pairKey`: "a < b ? `${a}|${b}` : `${b}|${a}`". It is internal; PR keys on its form. Used for A.14.
- `seaRoads.js :: classifyLegModes(digest, path)`: returns `Array<'land'|'sea'>`. Used for A.14.
- `distanceRead.js :: candidateRoutes(digest, fromId, toId, k)`. The road arm, unchanged.

**M4, censuses on the PT volume:**
- No hits for: `keep`/`garrison`, `holdBeforeNode`, `fealty_`, `fundingBand`, `readiness01`, `believedWhereabouts`, `paragonLean`, `party_stopped`, `hashInt` and "court's fame".
- `a␟b` had two minted sites, both now replaced. Its two remaining hits are inside brackets that record the change.

## 2. The record table

The verifier's six carries are `PT-r2v-c1…c6`, in its order; `-p` is its PLAUSIBLE note.

| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| **PT-V1** | **MAJOR** | **CURED.** A seat change lapses ONLY an edge that is still windowed. An indefinite edge is lifted only by `PARDON_PARTY` and its key stays inert. | §9.3 · §2.1 · §16 · OD-PT-6 · P46 | M1, M2 (A–D) |
| PT-r2v-c1 | carry | CURED (PT's cite). RN's deed target gains `siteId` per RULINGS-ROUND3 B for RN; PT mints none. | §4 (1) · §20 (1) | ROUND3 B |
| PT-r2v-c2 | carry | CURED. §20 (4) is closed. | §20 (4) | CH l.766: "`metParty` is written by CH's stage when PT's `met_in_person` deed names the paragon" |
| PT-r2v-c3 | carry | CURED. The counterparty is "court, person or corps". | §15 EDITOR | No PT kind has a menace actor |
| PT-r2v-c4 | carry | CURED. "Warrant served on a road" is struck. | §7.3 | PR19 and R33 (D-PR-r3): "a `party_warrant` stands at the court's town" |
| PT-r2v-c5 | carry | CURED. The cap counts windowed keys only and the oldest evicts. R3-1: one key per door. | §2.1 · §16 · P47 | M2 (F) |
| PT-r2v-c6 | carry | CURED. "The reveal" means `party_made_known_site` only. | §20 (5) | D-ST-r3 row 48 says the same |
| PT-r2v-p | PLAUSIBLE | NOTED. The traversal stays PLAUSIBLE until PT-6. | §9.2 | — |
| SEAMS-r2-11 (CH verifier: "PT reuses the one meaning") | **MAJOR** | **CURED per A.4.** `enemy_in_service` reads the landed pair state: `hostile`, as the court believes it. War is caught first by `at_war_with_employer`. | §9.2 · P49 | RN R51 refuses court-to-court regard; M3 |
| CH-r2v minor (CH's "until it lands") | m | NOTED. This is CH's text. | — | — |
| FOLD-V3 | M (fold's) | NOTED. PT's token `party_made_known_site` holds. | §2.4 | — |
| FOLD-V4 | M (fold's) | NOTED. PT already says RN-3 carries no lighting gate. | §15 · OD-PT-17 | — |
| FOLD minor `party_stopped` | m | NOTED. 0 hits in PT. | — | M4 |
| RN-V2 (the swapped `doerRef`) | **MAJOR (routed)** | **CURED (cite).** RN's heard pass re-reads on the triple (`ver`, `mag`, `doerRef`). | §11.1 | ROUND3 B for RN |
| RN-V6 | M (PS's) | NOTED. PT claims no court fame. | — | M4 |
| RN minor (PT's voice is "a person") | m | CURED per A.11. | §7.3 · §13 · §14 · §15 · §19b · PT5 · §0 · OD-PT-22 · P48 | — |
| RN minor (the fold's trigger "a court") | m | CURED (PT's side) per A.11. | §7.3 · P48 | — |
| ST-r2v note 6 | m (ST's) | NOTED. | — | — |
| The holds citing PT (CH · PR · RN · ST) | — | NOTED. | — | — |
| A.1 · A.2 · A.3 · A.5 · A.6 · A.9 · A.10 · A.12 · A.13 · A.15 | ruling | NOTED. PT has no text on these (M4). A.12: PT has its own `whereaboutsOf`. A.13: PT plans no legs. | — | M4 |
| A.4 | ruling | CURED, as SEAMS-r2-11 above. | §9.2 | M3 |
| A.7 | ruling | CURED. Five actor kinds, with the menace rationale. | §0 | — |
| A.8 | ruling | CURED. `banKeys` is registered apart from `polity_ban:<subjectKey>:<banTick>`. | §2.4 | D-PL-r3 l.110 |
| A.11 | ruling | CURED, as the RN minors above. | §7.3 … P48 | — |
| A.14 | ruling | CURED. `a␟b` becomes `stretch:<a\|b>`, and the sea-hop test is `classifyLegModes`. | §2.2 · §13 · §9.2 | M3 |
| D-PL-r3 route | routed | CURED, as A.8. | §2.4 | — |
| D-PR-r3 route | routed | CURED, as c4. | §7.3 | — |
| D-ST-r3 route (Q3) | routed | NOTED. The one-act question is the chair's. | §20 (5) | — |

The A-row line counts as 10 ids, one per ruling.

**STOPs: none.**

**REFINED R3-1.** `banKeys` holds one key per door. A re-ban at the same door replaces the key with the newer episode. The reason: the landed merge keeps one edge per (door, kind), so two keys would mean two lift rules for one fact. Vetoable.

## 3. Routed: the other-volume halves this lane cannot write

1. **CH §11 "Lifted".** Its second sentence ("an edge whose court reads `seatChangedSince(…).changed === true` is lifted") lacks the windowed guard. A DM `banish` on a door that already holds an emergent ban merges the two into an indefinite edge, and the lift would then erase the DM's word. This is PT-V1's class, on `paragon.banKeys`. CH also needs the same cap rule (windowed only; oldest evicts first) and one key per door. That keeps one ban and one lift rule.
2. **CH §11 step 3 (A.4).** `enemy_in_service` should read the landed pair label through the same belief read PT names (`readBeliefRelationship`).
3. **The fold §5, l.711** (the town's-gate register row) still says `enemy_in_service` is "a court this court regards at `enmity` or worse". It needs an A.4 bracket at P4.
4. **The fold §3.4 `party_voiced` row (A.11).** The trigger should read "a court (any), or a person or corps of `regional` fame or wider" (P4). The §1, spine and §3.3.12 rows should name five actor kinds (A.7).
5. **RN** (all per ROUND3 B for RN):
   - §5.5's court arm (A.11);
   - the deed target's `siteId` field;
   - the heard pass's triple key (RN-V2);
   - strike the withdrawn "actor convention gains `site`" from the sites bracket.
6. **The fold's WHERE companion** registers `stretch:<a|b>` for PT's road rows (A.14).

## 4. Open for the chair

1. Should `party_made_known_site` be ONE act through PT's door, as the clearing is? This is ST's Q3 and PT §20 (5). Today ST's closed caller list names only the clearing door.
2. Two items are still open from round 1:
   - a deed-only upward bias on the size drift;
   - an AMEND `{ lie: true }` on `party_pledge_due`.

**CONFIRMED vs PLAUSIBLE:**
- **CONFIRMED by execution:** PT-V1's fail, and the cured rule's behaviour on master's writers. The rule itself is modelled, because the design is unbuilt.
- **CONFIRMED by code read:** the A.4 and A.14 symbols.
- **CONFIRMED by grep:** the cross-volume agreements with PR19, D-ST-r3 and D-PL-r3.
- **PLAUSIBLE, and still marked so:** the road arm's traversal.
