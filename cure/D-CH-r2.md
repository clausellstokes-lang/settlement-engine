# D-CH-r2 — DISPOSITION LOG for `docs/DESIGN_FP_ARCH_CH.md`, P3 round 2 (lane D-CH-r2, chair a73343ed; seat Opus 5.5; 2026-10-18, finished 07:25 EDT by `date`)

## OUTCOME
All 24 items routed to CH are disposed: **20 CURED · 1 REFUTED · 0 STOP · 3 NOTED.** The input was the round-1 verifier's file `skeptic/CH-r1-verify.md` (5 FAILS, 2 NEW findings, 7 carries), every item `briefs/RULINGS-ROUND2.md` routes to CH (A.9, A.11, A.14, B, D, E), the two halves `cure/D-PL-r2.md` §5.3–5.4 routes here, and the user's question of 06:35 about weather and sea routes.

The volume grew from 878 lines (222,575 bytes) to 985 lines (about 284 KB). The pre-round copy is `D-CH-r2-probe/CH.before-r2.md` and the diff is `D-CH-r2-probe/volume.diff` (132 lines removed, 228 added). The volume's §25 has a Round 2 block. Git and the test suite were not touched, and the code of record (master `81f1cd963`) was only read. Receipts are in `D-CH-r2-probe/receipts.out` and the token census in `D-CH-r2-probe/tokens.out`.

## 1. FIRST ACT — the measurements that could refute the round's directions (CONFIRMED by read unless marked)

**CH-V1 (BLOCKING): no errand row can name a paragon.** The verifier is right.
- `envoyErrandVocabulary.js :: ENVOY_PURPOSES` is `Object.freeze(['sue', 'self_parlay'])`.
- `envoyErrandRecords.js :: normalizeErrand` drops any row that lacks a peace offer, an acceptance or a snapshot, or whose purpose fails `!PURPOSE_SET.has(purpose)`.
- `envoyErrand.js :: mintEnvoyErrand` has one caller, `envoyDiplomacy.js`, which casts its traveller from a roster (`rosterIdentity: candidate.identity`).
- `emigreErrand.js` states the rule: "MINTING THROUGH THE SPINE MEANS PRICING A JOURNEY AND VALIDATING A CLASS, NEVER WRITING A ROW … owner-gated by name".
- ES owes the "FREE-STANDING spy row" (`espionageMissions.js`, R-ES1-1).
- The road that needs no row is landed: GR-2's `pactProposals.js :: pactTransportFor`. It mints through `mintErrandSpine` with an injected plan, reads only `reason`, and keeps its state in its own record.

**B (bound = placed at the employer's seat) makes the hand-off correct.**
- `envoyDiplomacy.js :: unclaimedPlacementAt` requires `position.placed`, `hostSettlementId === settlementId`, and no residency, transit or `dmAssignment`.
- `envoyPulse.js :: envoyIsPhysicallyHome` refuses every roamer, then reads the placed host with the same three facets empty.
- `npcLedger.js :: moveNpcRecord` files a record as placed exactly when `hostSettlementId !== ''`. The envoy family re-files a traveller as a roamer with `hostSettlementId: null`.

**CH-r1-12: the deed ledger is append-only.** RN2's rule ("never rewritten, folded or pruned"; minted once) holds as the verifier quotes it. So the deed is minted only when the stay closes.

**CH-r1-24: fifteen readers, not fourteen.** `rg -l "\.roamers|\.placed\b" src` returns 18 files. Removing `AutoplacementConsent.jsx` and the two demographics modules leaves 15 real readers, including `envoyPulse.js`. Effective host lines, counted the house's way (the count gives 332 for `envoyPulse.js`):

| Host | Effective lines |
|---|---|
| `heraldWanderers.js` | 166 |
| `npcLedgerProjection.js` | 113 |
| `npcCirculation.js` | 388 |
| `npcReplacement.js` | 161 |
| `reputationRaceConsumer.js` | 183 |
| `npcCirculationTransit.js` | 75 |
| `pactProposals.js` | 235 |
| `relationshipEvolution.js` | 438 |

**CH-r1-20 and A.14: the harbouring write.**
- PL (D-PL-r2) now owns `requestFealtyRow(worldState, snapshot, { relationshipKey, kind, episodeId, toId? })`, which returns `{ fealtyRow, relationshipPatch }`, plus `FEALTY_EPISODE_PREFIXES` with `polity_ban:` registered.
- The writer is `relationshipEvolution.js :: applyRelationshipPatch(worldState, outcome, now, edge)`. Its state lives in `worldState.relationshipStates[key]`.
- `sovereigntyTransfer.js :: accrueSaleGrievance` is the landed precedent for a stage writing a state-only patch (`proposalPayload: null`).
- The person stage already receives `regionalGraph`, so the edge can be read there.

**The seat-change lapse.**
- The exclusion edge is `{ settlementId, kind, untilTick | indefinite }` (`npcLedgerFacets.js`). It has no mint tick, so the tick form of the read cannot be anchored.
- `seatKey` is a LANDED token (`density/seatKey.js :: seatKey`) and must be avoided.

**The user's question (weather and sea).**
- `distanceRead.js :: pathCost(digest, fromId, toId, season = null)` and `hopWeeks(…, season = null, mode = null)` are modality-aware. They carry TRADE M8's sea lanes ("a sea lane embarks at a port") and the frozen SEASONS-B overlay.
- `candidateRoutes` walks `routingAdjacency`, which is augmented with sea lanes where the endpoints are ports.
- **Defect found:** `npcCirculationTransit.js :: planWanderLeg` calls `hopWeeks(digest, text(fromId), hop.toId)` with NO season. Round 1's §4.4 claim ("winter lengthens every leg through `hopWeeks`' seasonal overlay where `seasonsEnabled`") was therefore false as landed.

**The `transportedDecision` carry.**
- `applyWorldPulse.js` reads `const peaceDecision = transportedDecision || readWarPeaceDecision({`. The live read runs first.
- When `!transportedDecision && envoyDiplomacyActive(state)`, the accepted decision is dispatched as `decision: peaceDecision`.
- `envoyDiplomacy.js :: envoyReturnAcceptance` returns `exact.acceptance`. So CH's term is read once, at the decision, and then carried. It is never bypassed.

**D (retainers' upkeep).** `pulseKernel.js` calls `advanceTreasury(sieged, { interval, tick, deployment, blockade, rules })`. It passes no worldState.

**THE CORPS's substrate.** WC §1.7.2 defines the free-unit record (`spatialLedgers.freeUnits[unitKey]`). WC-10..12 and `freeCompaniesEnabled` are unbuilt; WC's status of record lists only WC-0A..0E as built dark.

## 2. THE RECORD
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| CH-r1-4 (FAIL) | M | CURED | CH8, CH9, P2 filing, §3, §2.4, §5, OD-CH-24, S34 | `unclaimedPlacementAt`, `envoyIsPhysicallyHome`, `moveNpcRecord` (§1) |
| CH-r1-12 (FAIL) | M | CURED | §2.2b, P2, CH-0 kill arm, L1, L3, S28, OD-CH-22 | RN2 append-only; RULINGS-ROUND2 B |
| CH-r1-20 (FAIL) · A.14 | M | CURED | §11, OD-CH-13, S12, §19, CH-5 | PL §4.6 request door; PL7; `applyRelationshipPatch`; `accrueSaleGrievance` |
| CH-r1-24 (FAIL) | M | CURED | §2.4, §2.2, CH-0, waves table | the census (18 → 15) and the host counts |
| HOST-r1-5 (FAIL) | M | CURED | the whole volume; §2.3 register | a scripted sweep; only quotes remain (the owner's words, RN's act literal, the host document's "gate-closure") |
| CH-V1 (NEW) | B | CURED (the verifier's options a+b, plus GR-2's priced journey) | §0, CH8, CH9, §4.2, §5, §7, §8, §9, §15, §19, CH-4, CH-7, OD-CH-30–32, S6, S14 | `ENVOY_PURPOSES`; `normalizeErrand`; roster casting; `emigreErrand.js`; `pactTransportFor` |
| CH-V2 (NEW) | M | CURED | §6.1, §2.2, P2, CH-3 (e), S4, S35 | the volume's own P2 and §6.3 |
| carry SEAMS-r1-19 | m | CURED | §2.3, §13, §18 | ADDENDUM |
| carry HOST-r1-2 | m | CURED | CH18, §6.2, §19 | ADDENDUM (COMPATIBLE) |
| carry `polityEnabled` | m | CURED | §19, CH-5, §11 | PL §8: `polityHoldEnabled`, `polityObligationsEnabled` |
| carry PL §14.7 | m | NOTED | §6.2 | PL :577 still cites two carriers; routed |
| carry RN `settlementUpdates` | m | NOTED | §4.1 | `rg -c settlementUpdates DESIGN_FP_ARCH_RN.md` = 0; routed |
| carry `transportedDecision` | m | REFUTED | §0, §6.2 | `applyWorldPulse.js` and `envoyReturnAcceptance` (§1) |
| carry MN `wilds` (= A.9) | m | NOTED | §6.2 | MN :591, :699, :709 still say `wilds`; MN's lane |
| A.11 custody | — | CURED | §0, CH3, §2.3, §3, §9, §12, §18, §19, L7, §24, S27, OD-CH-11/33, CH-8 | ADDENDUM SEAMS-r1-1; A.11 |
| B THE CORPS | — | CURED | §16b, P1, CH2, §7, §12.2, §18, §19, CH-10, L8, S36, OD-CH-36, §2.2b | `briefs/L-CH.md` addendum; WC §1.7.2, §1.12.5 |
| B purpose | — | CURED | status, §0, CH3, §3, OD-CH-35 | `briefs/L-CH.md` 01:4x word |
| D retainers | — | CURED | CH10, §0, §7, §19, OD-CH-10 | RULINGS-ROUND2 D; the treasury call (§1) |
| E sites | — | CURED | §5, §4.4, §14, §18, S38, OD-CH-38 | ST §7 coverage row; `sitesNear`; ST S6 |
| E patrols (+ H16) | — | CURED | §5, §4.4, §11, §14, §18, S39, OD-CH-38 | PR §8 rows 327–328, OD-PR-16, §10.5; host document 06:14 |
| E plague-R7 | — | CURED | §11 step 3 | CHAIR-NOTES item 11 |
| E doctrines 10-18 | — | CURED | status, CH3, §6.2 | BOARD 01:31, 01:33, 05:57, 06:32 |
| D-PL-r2 §5.4 | — | CURED | §11 Lifted, P2 `banKeys`, S11, OD-CH-34 | PL §2 `seatChangedSince` key form; the edge shape |
| user's weather and sea question | — | CURED | status, §0, §4.4, §5, CH-1, S37, OD-CH-37, §24 | `pathCost`, `candidateRoutes`, the `planWanderLeg` defect (§1) |

## 3. STOPS
None. Every cure either follows a chair ruling (RULINGS-ROUND2 A.11, A.14, B, D, E and the ADDENDUM) or takes the verifier's own offered cure. Nothing needs a kernel line, and nothing contradicts an owner word.

## 4. REFINED (each bracketed in the volume, vetoable)
1. **The recruiter is a PRICED JOURNEY.** It follows GR-2's idiom: a `soughtBy` row on the sought paragon's record and no errand row. The owner's message 2 ("sought out by NPC of a settlement based on belief of where they could be") now works wherever CH is lit. If this is vetoed, there is no recruiter in any world until the owner's errand-row slot lands (OD-CH-31).
2. **The DM-posted operative.** A bound paragon that the DM `assign`s outside its lands holds that place as its `postId`. It walks its own leg to the rendezvous and back. It is caught on re-entry at the town's gate, or by patrols when PR is lit. Its findings reach home as one telling through RN's arm, never as a direct belief write (OD-CH-32). This saves the owner's handler idea inside the 01:4x doctrine ("unless directed by the user").
3. **The DM's hand (`authored.heldAt`).** This is the ADDENDUM's "held at X", built as an authored field on the existing `introduce` revision door (OD-CH-33).
4. **A court's pardon reads the exact KEY form** of `seatChangedSince`, with the key stored on the banned paragon's record (`banKeys`). This way the DM's tick-less `CHANGE_RULING_POWER` counts (OD-CH-34).
5. **`SITE_FIT`**, the calling-to-site-kind table for the choice's site row. A `tower` is weighed by no calling; it is the DM's to place (ST3).
6. **The season car.** `planWanderLeg` gains a `season` argument (≤ 2 lines). It has no production caller, so the change is byte-identical.
7. **THE CORPS's sell-out reuses the `paragon_disgraced` card** rather than adding a new kind.
8. **A zero-import mark predicate (`paragonMark.js`)**, so first-paint readers pay one tiny module.

## 5. OTHER FILES' HALVES — routed to the chair and the owning lanes (this lane wrote none of them)
1. **PL §14.7 (:577).** Add the third faith carrier, the 3a entry carrier (`paragonFaithCarriers`, `attemptEntry`).
2. **RN.**
   - RN-S1's mount must thread `worldState`, `wizardNews` and `settlementUpdates` into BOTH returns (CH-r1-30). RN's text has zero `settlementUpdates` mentions.
   - RN must key a corps as `c:<unitKey>`.
   - RN's per-deed arrival read for `believedWhereabouts` must be named.
   - RN's telling arm must take TWO registered CH sources: the leak, and the posted operative's findings.
3. **MN.** `wilds` → `wildland` at :591, :699 and :709 (A.9).
4. **The fold.**
   - SP-4a's `POSTURE_ACTOR_KINDS` gains `corps`.
   - The WC inbox gets THE CORPS row: the parked force market closes into CH, plus WC-10's free-unit normalizer arm and a DM-authority people event.
   - The errand-row widening is recorded as THE OWNER'S slot, with the paragon as its named first consumer, beside ES's free-standing row and Q-TC12-1.
   - The W-COIN inbox gets the `retainers` row.
   - Register CH's round-2 tokens in §5 (§2.3's ROUND 2 row).
5. **PT.** The exclusion-edge actor-ref widening gains a `corps` arm.
6. **WC.** The free-unit normalizer's `paragon` arm, and a DM-authority birth event that draws a named origin's census.

## 6. OPEN FOR THE CHAIR
1. **REFINED 1–3.** Veto any of them and CH falls back to the owner's errand-row slot alone. The recruiter and the line home would then be dark in every world until the owner rules the persisted shape.
2. **THE CORPS's manpower.** A DM-authored company's people come from a named origin's census through a WC event. WC has no such event yet (WC's free units are born only by fission). The event's shape is WC's call, and possibly the owner's under the parked-market history. CH designed the mark and the behaviours, and the corps lands with WC-10.
3. **The user's question.** The user asked whether weather and sea routes are already in the books. They are (TRADE M8 and the canon's overlay). CH builds on them, with one measured defect cured by a small car: `planWanderLeg` drops the season.

## CONFIRMED vs PLAUSIBLE
CONFIRMED by code read at `81f1cd963`:
- the errand row's closure (purposes, peace-offer rows, roster casting) and the GR-2 idiom;
- the placement predicates and the home read;
- the census and the host counts;
- the relationship writer and its state-only precedent;
- the edge's shape and the `seatKey` collision;
- `pathCost` and `candidateRoutes` carrying sea lanes and the seasonal overlay, and `planWanderLeg` dropping the season;
- the transported acceptance;
- the treasury call;
- the season car's byte-identity: `planWanderLeg`'s only caller is `advanceWanderer`, whose only callers are inside `npcResidency.js :: advanceResidency`, which has zero callers in `src`.

PLAUSIBLE, not upgraded:
- RN's per-deed arrival read behind `believedWhereabouts`;
- RN's telling arm taking two registered sources;
- the treasury car for W-COIN's `retainers` row;
- WC's DM-authority people event for THE CORPS.

