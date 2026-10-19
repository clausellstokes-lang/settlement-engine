# D-FOLD-r3 — DISPOSITION LOG for the coherence fold, the spine and CN, P3 round 3a (lane D-FOLD-r3, chair session a73343ed continued by chair 0a2e8bd9; seat Opus 5.5; 2026-10-18 18:00–18:1x EDT by `date`)

Status: DONE 2026-10-18 18:1x EDT — 45 of 45 input ids disposed (cured 39 · refuted 0 · stop 0 · noted 6); insertions-only proof PASS (§6).

Input: (1) `skeptic/FOLD-r2-verify.md` whole (FAILS 1 · NEW 2 · ten minor notes + the chair note); (2) rows other `*-r2-verify.md` route to FOLD (MN-V6's builder note; RN's carried `party_voiced` trigger; ST note 6); (3) `briefs/RULINGS-ROUND3.md` A.1–A.15 (the fold's halves), the FOLD B-section, §D.1 and §E.1–E.3; (4) beyond the brief's letter, the FOLD routes of all eight sibling round-3a lanes (`cure/D-{PL,MN,PR,PS,PT,ST,CH,RN}-r3.md`), applied now so that round 3b's ROUTED-UNAPPLIED class (§E.4) finds none in the fold. Files owned: `docs/DESIGN_FP_COHERENCE_FOLD.md`, `docs/DESIGN_FP_SPINE.md`, `docs/DESIGN_FP_ARCH_CN.md` (INSERTIONS-ONLY), this log, `D-FOLD-r3-probe/`. No git, no test suite.

## Progress
- 18:00 EDT: orientation reads done (README, COMPILE-COMMON, DISPOSE, OWNERSHIP, every rulings file through ROUND3 §E, CHAIR-NOTES, the BOARD's owner lines, FOLD-r2-verify, the FOLD-routed rows of the eight other verify files, D-FOLD-r2b, the round-3a lanes' ROUTES). Snapshots: `D-FOLD-r3-probe/{FOLD,SPINE,CN}.before-r3.md` (sha256 800a09ad… · b18d5a37… · 9d103cb5…).
- 18:01–18:12 EDT: measured on master (`receipts-r3.out`, `tokens-r3.out`); read the fold's touched rows and the siblings' current text; wrote `texts_r3.py` (31 fold + 2 spine insertions); dry-run clean.
- 18:12 EDT: D-CH-r3 and D-RN-r3 landed; their fold routes added (OD-FC-47 ↳ r3, OD-FC-28 ↳ r3, three §5 rows).
- 18:14 EDT: `cmp` showed all three files unchanged since the snapshot (no concurrent writer); WRITTEN; proof PASS.

## 1. MEASURED FIRST (master `81f1cd963`, read-only; `D-FOLD-r3-probe/receipts-r3.out`, `tokens-r3.out`)
| # | Question | Receipt | Verdict |
|---|---|---|---|
| R1 | Is piracy parity live or in a dark module? | `spatial/navalLayer.js` Stage 5: "scoreRoute prices port-node embattlement into sea routes verbatim (pinned since M8) and banditryLoss fires on EVERY arriving shipment sea or land alike"; "This module adds NO danger math" | CONFIRMED (read): live by construction |
| R2 | `seaRoadsEnabled` lit? | `roads/seaRoads.js` header: "DARK behind the VIRTUAL flag `seaRoadsEnabled` (§1 law 1; ABSENT from DEFAULT_SIMULATION_RULES"; `rg` over `src`: only that file | CONFIRMED: lit in no preset |
| R3 | Is `u:` landed? | `supabase/functions/ingest-events/index.ts` (rate key `u:` + actor id); migration `029_gallery_view_dedup.sql`; `tests/security/ingestCheckRate.pglite.test.js` | CONFIRMED: a homonym on the server meter |
| R4 | The pair form; a gate fraction? | `spatialDigest.js` module-local `pairKey` (joins with `|`); crossings `{ a, b, cost, cellA, cellB }`, no fraction | CONFIRMED (read) |
| R5 | `hash01` · `fnv1a32` · `classifyLegModes` · `COURSE_TARGET_SEP` | `region/contestMath.js :: hash01`; `kernel/proseHash.js :: fnv1a32` (and three more); `roads/seaRoads.js :: classifyLegModes`; `events/realmManifest.js :: COURSE_TARGET_SEP = '␟'` | CONFIRMED (read) |
| R6 | `POSTURE_ACTOR_KINDS` | `worldPulse/strategicPosture.js`: `Object.freeze(['settlement'])` | CONFIRMED (read) |
| R7 | `readBeliefRelationship`; `hostile` | `worldPulse/beliefMap.js :: readBeliefRelationship`; `relationships/canonicalRelationship.js` holds `'hostile'` | CONFIRMED (read) |
| R8 | `ENTER_THRESHOLD` | `spatial/embattlement.js`: `ENTER_THRESHOLD: 0.55`, `EXIT_THRESHOLD: 0.3` | CONFIRMED (read) — bears on L-BD's brief (routed) |
| T | Token census | `SITE_READINESS` `siteReadiness01` `siteReadinessOf` `reliefAnswerOf` `presenceComposer` `warSiegeRefused` `PASSAGE_UNSEEN_ROWS_CAP` `fatigueFloor01` `groundCap01` `party_made_known_site` `FEALTY_ROW_FAMILIES` `settlementFundingBand` `polity_ban` `fealty_sworn` `fealty_renewed` `PARAGON_LEAN_SEAMS` `paragon_leak` `actRef` `doerKey` `siteId`: 0 src · 0 tests each; quoted `'at_strength'` `'hollow'` `'manned'` `'skeleton'` `'freeze'` `'border'` `'stretch:` 0 src files; `'sparse'` 1 (`settlement.schema.js` `proseDensity` typedef); `incidentType` 24 src files | CONFIRMED (executed) |

## 2. THE RECORD (the fold's §9.6 round-3 block carries the same table)
| id | sev | disposition | where (the fold unless named) | receipt |
|---|---|---|---|---|
| HOST-r2-9 (FAIL) | M | RE-CURED — fold:748's force-band row narrowed to §3.1.29 ↳ r2b; a site sends its READINESS word | §5 force band ↳ r3; §3.1.29 ↳ r3 | the verifier's two quoted rows; ST §2.4 `garrisonBandOf → SITE_READINESS word` |
| FOLD-V3 | M | CURED — `party_made_known_site`, FREE; old name withdrawn | §5 PT's site kind ↳ r3 | T; PT 9 hits / 0 old; ST 8 |
| FOLD-V4 | M | CURED — RN-3's lighting gate STRUCK; three questions visible, gating nothing | OD-FC-63 ↳ r3 | RULINGS-ROUND2 B; RN §6.2 quoted; PT OD-PT-17; ORDER NOTE ↳ r2b (2) |
| minor `u:` | m | CURED | §5 regard keys ↳ r3 | R3 |
| minor `cut01` | m | CURED — 0.5 until the digest carries a fraction; a map ask | §3.4 WHERE `road` ↳ r3; INBOX ↳ r3 (l) | R4 |
| minor `a␟b` (two spellings) | m | CURED — `stretch:<a\|b>`; `␟` only the dial separator | §3.4 WHERE `road` ↳ r3; §5 stretch row | R4, R5 |
| minor actor-kind lists | m | CURED — five kinds in §1, the spine, §3.3.12, OD-FC-57 | §1 (r3); §3.3.12 ↳ r3; OD-FC-57 ↳ r3; SPINE req 24 + SP-4 | A.7; R6 |
| minor site rationale excludes `menace` | m | CURED — the test is acting on a card | as above | MN §2 r3 (same reason) |
| minor `party_stopped` | m | CURED — no kind (STOP-PR-2) | §3.4 recount ↳ r3 | RULINGS-ROUND2b STOP-PR-2 |
| minor a rule on the map | m | CURED — the cadence an ASK | §5 `patrol` ↳ r3 | §3.1.26 ↳ r2b; PR14 |
| minor piracy in a dark module | m | CURED — live by construction; D-6 S3 the missions' arm | §3.3.14 ↳ r3 | R1, R2 |
| minor §8 no round-2b line | m | CURED | §8 (r2b and r3a lines) | — |
| minor OD-FC-56 / OD-FC-19 | m | CURED — C0, C0.5, C1..C16; the order with C14–C16 | OD-FC-19 ↳ r3; OD-FC-56 ↳ r3 | ORDER NOTE ↳ r2b (1); L-FOLD2 item 8 |
| minor OD-FC-46 "two feeders" | m | CURED — three feeders, one shared car | OD-FC-46 ↳ r3 | MN §3.3; A.3 |
| minor ST STOP-era wording | m | NOTED — ST's half, applied by D-ST-r3 (ST:411, ST:601 now withdraw it) | — | grep |
| chair note: L-FOLD2 items 4/5 | — | NOTED — corrected by the chair (ROUND3 B FOLD; L-FOLD2 shows CORRECTED 17:2x) | — | read |
| MN-V6 (routed) | M | CURED — A.3 | §3.1.30; §6 ↳ r3; OD-FC-46 ↳ r3 | MN §3.3 r3 |
| RN carry: `party_voiced` trigger | m | CURED — A.11 | §3.4 `party_voiced` ↳ r3; §1 (r3); SPINE | PT §7.3 r3 text read |
| ST note 6 (routed) | m | NOTED — `party_cleared_site` already registered | §5 PT round-2 tokens ↳ | read |
| A.1 | ruling | CURED — keep's garrison the site's; YIELDS struck; OD-PR-41 superseded | §3.1.29 ↳ r3 | ST "0 while THE PATROLS are lit" 0 hits now |
| A.2 | ruling | CURED — FREEZE mode, fourth in PS §4.1 | §3.4 `armies_meet` ↳ r3; WC INBOX ↳ r3 (5) | PS §4.1 read |
| A.3 | ruling | CURED — shared car, neutral home, builder | §3.1.30; §6 ↳ r3; OD-FC-46/56 ↳ r3; §5 MN row | MN §3.3 r3 (`presenceComposer`, 5 hits) |
| A.4 | ruling | CURED — the landed pair state through belief | §3.1.25 ↳ r3; §5 gate ↳ r3 | R7; CH §11 r3; PT §9.2 r3 |
| A.5 | ruling | CURED — the four families | §5 `fealty_*` ↳ r3; OD-FC-45 ↳ r3 | PL §8, OD-PL-52 |
| A.6 | ruling | CURED — two facts | as A.5 | PL OD-PL-53 |
| A.7 | ruling | CURED | as the actor-kind minor | — |
| A.8 | ruling | CURED — one ban grammar; prefixes | §3.4 `call_in_answer` ↳ r3; §5 PL row | PL §4.6 r3 |
| A.9 | ruling | CURED — one name | §5 funding band ↳ r3 | PR 0 live uses of the old name |
| A.10 | ruling | CURED as §E.1 settles it | §3.1.29 ↳ r3; §5 readiness row; INBOX (m) | ST §2.4 |
| A.11 | ruling | CURED | as the RN carry | — |
| A.12 | ruling | NOTED — no fold text (`believedWhereabouts` 0 hits) | — | grep |
| A.13 | ruling | NOTED — no fold text on sea legs; §3.3.14 (d) consistent | — | grep (`waypoint` 0) |
| A.14 | ruling | CURED | as the `a␟b`/`cut01` minors | R4, R5 |
| A.15 | ruling | NOTED — no fold text (`paragonLean` 0 hits); the roster row added from CH's route | OD-FC-28 ↳ r3 | grep |
| §D.1 | ruling | CURED — an OWNER ROW, recommended yes; no mechanism | OD-FC-72 | ST `HOLDER_CLASSES` read |
| §E.1 | ruling | CURED — ST's measured words | §5 readiness row | ST §2.4 |
| §E.2 | ruling | CURED — first sight, the card's default | §5 `fealty_*` ↳ r3; OD-FC-45 ↳ r3 | PL §4.3 r3 |
| §E.3 | ruling | CURED — registrations; field force | §5 PL row; §3.1.29 ↳ r3 | PL, PS §2.5 |
| D-MN-r3 routes | — | CURED — third `menace_met` producer; two armies; tokens | §3.4 `menace_met`/`armies_meet` ↳ r3; WC INBOX (6); §5 | MN M37, M57 |
| D-PR-r3 routes | — | CURED — tokens; cadence ask; `cut01` ask; YIELDS | §5 PR row; §5 `patrol` ↳ r3; INBOX (l) | `D-PR-r3-probe/tokens-r3.out` |
| D-PS-r3 routes | — | CURED — tokens; freeze; the two card notes recorded for P4 | §5 PS row; §3.4 recount ↳ r3; WC (5) | PS §4.1 |
| D-PT-r3 routes | — | CURED | §5 gate ↳ r3; `party_voiced` ↳ r3; WHERE ↳ r3 | — |
| D-ST-r3 routes | — | CURED — readiness; gloss; harbour watch; `a␟b`; `site_taken` note for P4 | as above | PR OD-PR-37; PS crossing WHERE |
| D-PL-r3 routes | — | CURED | §3.4 `call_in_answer` ↳ r3; §5; OD-FC-45 ↳ r3 | — |
| D-CH-r3 + D-RN-r3 routes | — | CURED — verdict deed (one person stage, stamp cap, `a_year`); `actRef` cross-door; lean seams; leak cause; `readiness` homonym; roster | OD-FC-47 ↳ r3; OD-FC-28 ↳ r3; §5 CH/RN/readiness rows | RN §3.1, OD-RN-40; CH §2.2 |

**Counts:** disposed 45 of 45 (3 verifier MAJOR ids · 12 minor notes and the chair note · 3 routed verifier rows · 15 A-rows · §D.1 and §E.1–E.3 · 7 lane-route bundles): cured 39 · refuted 0 · stop 0 · noted 6.

## 3. STOPs
None.

## 4. REFINED (marked in the fold, vetoable)
1. §3.1.30 — the shared presence composer gets an ownership row of its own (not only §6's builder note), on the §3.1.23/§3.1.24 idiom.
2. The actor test restated as "acts on a card" (own choice · the table's · the DM's authored course), which explains both the menace (kept) and the site (excluded) with one reason.
3. P4's round-3 card notes for PS's and ST's not-yet-registered kinds are recorded in the recount bracket so P4 cannot lose them.
4. OD-FC-72 written now as a VISIBLE owner row (§D.1 placed it at P4); P4 must not duplicate it.

## 5. ROUTED — other-volume halves this lane cannot write
- **PL** (PL §15/PolitySite bracket, the A.10 cure clause): still says "`readiness01 = F × Q`; the chair's `full · manned · sparse · skeleton · empty`" — §E.1 FAIL class; → `siteReadiness01` and ST's `SITE_READINESS` words (also ST's route).
- **PR** (§15.2, ~l.578): "ST's readiness words (`full · manned · sparse · skeleton · empty`, A.10)" → `at_strength · manned · sparse · skeleton · hollow` (§E.1; also ST's route).
- **THE BODIES** (`briefs/L-BD.md` item 6, the chair's brief): "ENTER 0.35 / EXIT 0.30" vs master `ENTER_THRESHOLD: 0.55` (R8); its feeder registers into §3.1.30's closed list by the same door (MN's route).
- **P4** (the chair's fold pass): PS's and ST's §3.4 kind rows with the card notes recorded in the recount ↳ r3; C14–C16 chain rows; ODQ §934.93 gains OD-FC-72 and the map asks (l)/(m).

## 6. PROOF
`python3 -I D-FOLD-r3-probe/proof_r3.py <docs> D-FOLD-r3-probe` → `proof_r3.out`: FOLD +79/−0, SPINE +2/−0, CN +0/−0; removing the inserted lines restores each snapshot byte for byte: PASS. Numstat (diff against the snapshots, no git) → `numstat-r3.out`:
```
79	0	docs/DESIGN_FP_COHERENCE_FOLD.md
2	0	docs/DESIGN_FP_SPINE.md
0	0	docs/DESIGN_FP_ARCH_CN.md
```
The engine's checks (unique anchors, table pipe counts, no `path:line`, no claim phrases) passed on the dry run and the write.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: the token census, the insertions-only proof and numstat. CONFIRMED by read at `81f1cd963`: R1–R8 and every symbol the new rows cite. CONFIRMED by reading the siblings' current text (18:0x–18:1x): PL §4.3/§4.6/§8/OD-PL-52/53, MN §2/§3.3, PS §4.1 and its crossing WHERE, ST §2.1/§2.4, PR OD-PR-37 and its A.9/A.14 brackets, PT §7.3/§2.4, CH §11, RN §3.1/§6.2/OD-RN-40. PLAUSIBLE, not upgraded: that CH and RN do not change those passages again after their logs (both lanes had finished at 18:08); every DRAFT constant cited (unchanged, UNMEASURED).
