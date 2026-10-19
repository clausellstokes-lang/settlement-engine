# D-PT-r2b — DISPOSITION LOG for THE PARTY (`docs/DESIGN_FP_ARCH_PT.md`), P3 round 2b (lane D-PT-r2b, chair a73343ed; seat Opus 5.5; 2026-10-18 12:00–12:2x EDT by `date`)

Status: DONE. **Disposed 14 of 14: cured 11 · refuted 0 · stop 0 · noted 3**, plus 5 REFINED marks. No git, no test suite; master `81f1cd963` (the detached worktree) read only.

A previous D-PT-r2b seat died on the 5-hour limit at ~08:44 after writing only `D-PT-r2b-probe/PT-before-r2b.md` and `census-r2b.out`; at this seat's start the volume was byte-identical to that copy (`cmp`: IDENTICAL; sha1 `01dee69c…`), so no partial edit existed and the copy serves as this round's before-image. Volume: 200,431 → 226,692 chars (688 → 719 lines); 71 anchored edits (`D-PT-r2b-probe/tools/apply_r2b.py` + `edits_r2b_part1..3.py`, each replacement asserted unique, all-or-nothing, first run on a copy); the diff is `D-PT-r2b-probe/volume-r2b.diff`; the check `check-r2b.out` (every input id has a body bracket; 0 table column mismatches; 0 raw pipes in code spans; residual `party_revealed_site` 0, drifted HR cites 0).

**Read whole, in order:** the kit README, COMPILE-COMMON, DISPOSE, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH (+ L-PT), RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1 (+ ADDENDUM), RULINGS-ROUND2, RULINGS-ROUND2b (+ ADDENDUM), the BOARD, `skeptic/SEAMS-r2.md`, `skeptic/HOST-r2.md`, `cure/D-PT-r2.md`, the volume. **By section / grep:** CH §11 (the corps arm, bans), §16, §16b; RN §2.1 `doer`/`target`, §2.2 the `u:` row; PR §2.2, §2.3, §8.1, §8.2, PR19, §13, R33, STOP-PR-2; ST §2.1, §2.3, §6.2, §7.2–§7.4, the caller list, S8; PL §2 (`seatEpisodeKeyOf`, `seatChangedSince`); MN §2.4; the fold §3.3.12, §3.4 (party rows, WHERE `road`); the sibling round-2/2b logs `D-RN-r2b`, `D-CH-r2b`, `D-PL-r2b`, `D-PR-r2`, `D-ST-r2`, `D-MN-r2b`; the host document (newest copy) rows H2, H5, H7, H8, H12, H17, H22, ENC-HS-01, ENC-HL-01..04, ENC-HL-13.

## 1. MEASURED FIRST

| # | Receipt | Settles |
|---|---|---|
| M1 | `cmp PT-before-r2b.md DESIGN_FP_ARCH_PT.md` → IDENTICAL (the dead seat left no edit) | the before-image |
| M2 | `worldPulse/npcLedgerFacets.js :: normalizeExclusionEdge`: `return windowed ? Object.freeze({ settlementId, kind, untilTick: Math.floor(rawUntil) }) : Object.freeze({ settlementId, kind, indefinite: true })` — no mint tick | R2b-1: PT §9.3's `seatChangedSince(…, banTick)` had no input; CH stores the episode key (`paragon.banKeys`) for the same reason |
| M3 | `spatial/spatialCost.js :: SLOW_NOT_SEVER_MAX = 6` ("winter makes a mountain pass NEAR-impassable … but NEVER infinite/cut — so a snowed-in town is dear to reach yet still RESCUABLE by spring"); `spatial/distanceRead.js :: stormSeasonFactor` (internal): "Always ≥ 1 (slow, not sever)" | R2b-2: PT's season/sea cites rest on landed law, not on CHAIR-NOTES 13–14 (contested by SEAMS-r2-1/-3, HOST-r2-1/-13); PT never said "closed pass" |
| M4 | `spatial/distanceRead.js :: candidateRoutes(digest, fromId, toId, k)` → `Array<{ path: string[], cost }>`, "the shortest path plus single-edge-detour alternates … MEMOIZED per (digest, pair)" | the road arm's traversal (the cheapest land route); PLAUSIBLE that it follows the path `hopWeeks` priced when a sea lane is cheaper |
| M5 | host document (newest): ENC-HS-01 at HR:601 ("When: M-SITE-A, the first site milestone, where the reveal path sits (V14 §8 SE3)"); ENC-HL-01 HR:644 ("the map reads it from M-SITE-A on"); ENC-HL-02 HR:645 ("across M-SITE-A and M-SITE-F"); ENC-HL-04 HR:647 ("the map's reveal path is in M-SITE-A"); ENC-HL-13 HR:656; law 6 HR:667; "gate" never bare HR:514; day-one Q10 HR:873; H7 HR:66 (waits on "H2; M-W1; H4; H5"); H22 HR:84 (waits on "H5; H7; H8; H12") | HOST-r2-12; PT's five cites HR:513/600/655/666/872 each stood one line low (re-pointed) |
| M6 | sibling text (live): CH §16b "the exclusion edge's actor-ref widening (PT's shape change) gains a `corps` arm", CH §11 "(PT's actor-ref widening's `corps` arm; until it lands a corps carries no edge …)"; RN §2.2 `u:<unitKey>` row, `doer`/`target` `{kind:'corps', id: unitKey}`; PR §8.2 party row "PT's `party_gate` WIDENED to WHERE `road (a, b)`, fired by a patrolled traversal of the DM's own move", PR19 (the WATCH a riders' detachment), R33 "at most ONE `party_gate` card at WHERE `road`", §2.2 THE ONE STRETCH KEY, §13 the window; ST §7.2 PT row (ST-r2-19), the writer's closed caller list naming "PT's party door for `party_cleared_site`", `SITE_EVENTS` incl. `made_known · kept_secret`, `SITE_STATUS` dials `subject · event · funding · quality`; PL §2 `seatEpisodeKeyOf` and the two forms of `seatChangedSince` | every cure aligned to the owning volume's text |
| M7 | census (`census-r2b-2.sh` → `census-r2b-2.out`, session zsh `rg`): `RECORD_CLEARING` 0·0·0·0·0; `party_made_known_site` 0 everywhere; `banKeys` 0 src · 0 tests (CH's ledger doc only); `fromIds` 0 src, 2 test files as a parameter name; `made_known` ST only. The dead seat's `census-r2b.out`: no quoted `'u:'` literal in master `src`; `corps` 2 prose src hits | tokens FREE / registered |
| M8 | `grep -c met_in_person DESIGN_FP_ARCH_CH.md` = 0 | CH's half still owed (§20 (4)) |
| M9 | RN lines 223 ("does NOT ripple"), 829–830, `partySeq` 5 hits | RN cured PT's three round-2 halves (D-RN-r2b §2) |

## 2. THE RECORD — 14 ids: 11 CURED · 0 REFUTED · 0 STOP · 3 NOTED

| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| SEAMS-r2-6 | MAJOR | CURED — the widening's key grammar `wnpc_…` · `party` · `u:<unitKey>` (CH writes a corps' edges; 0 host lines); a corps as engagement actor (its own `visit_party`) or `officer` (retained); `RECORD_MEETING` takes a company; `corps` on the actor convention | §0, §2.1 shape 3, §2.2, §2.4, §6, §7.3, §14, §16, P44, OD-PT-6, OD-PT-31 | M6; RULINGS-ROUND2b SEAMS-r2-6 |
| SEAMS-r2-14 | MINOR | CURED — `party_gate`'s ROAD ARM: a third court's riders who noticed the party on the road the DM's move crossed (PR's `patrolEncounter`, the noticing court's `gateDefault`), CH's words, ≤ 1 road card per move, origin/destination riders excluded | §9.2, §7.3, §13, §2.2, §2.4, §14, §15, §19, §19b, P43, OD-PT-10, OD-PT-32 | M4, M6 |
| HOST-r2-12 | MAJOR | CURED (PT's half) — M-SITE-A for the reach and reveal doors (M-SITE-F for statuses); the priced journey's canon root H2 → H7, H5 + H7 + H8 + H12 → H22; five drifted host cites re-pointed | PT17, §4, §8.3, §14, OD-PT-25 | M5 |
| R2b STOP-PR-2 | — | CURED — RULED (a) executed (no new kind; CH's words) | as SEAMS-r2-14 | RULINGS-ROUND2b |
| R2b SEAMS-r2-6 | — | CURED — `u:<unitKey>` in PT's rows | as SEAMS-r2-6 | RULINGS-ROUND2b |
| R2b OD-PT-28 | — | CURED — ACCEPTED and recorded; the reversing road CLOSED with reason (new capability, the owner's to ask for) | §6, OD-PT-28, P42, §20 | RULINGS-ROUND2b |
| R2b HOST-r2-5 (D-PL-r2b §5.3; D-PR-r2 §5) | — | CURED — "opens H16" struck; the host's facts out through H9 / H23; H16 untouched | §13, §21 r2 row | PR14, PR §13 |
| R2b ADDENDUM ST-r2-14 | — | CURED — `site` a WHERE and a subject, never an actor kind; a site deed's target = the anchor + a `siteId` qualifier | §4 (1)/(3), §0, §2.2, §13, OD-PT-30 | the ADDENDUM |
| D-ST-r2 route (ST-r2-19) | — | CURED — the clearing is ONE act: `RECORD_CLEARING` → PT's door → ST's one writer; one undo | §4 (2), §6, P41, OD-PT-30 | ST §7.2, caller list, S8 |
| D-ST-r2 route (HOST-r2-19) | — | CURED — `party_revealed_site` → `party_made_known_site` (6 occurrences); `revealed` never a PT token | §2.4, §3.3, §4, §19b, OD-PT-30 | ST §2.1/§2.3; ENC-MS-02 |
| D-PR-r2 route (PR-r2-13) | — | CURED — the WATCH of a warrant/ambush on a road IS a riders' detachment (PR19); the hearing stays PT's | §7.3, §2.2, §13, OD-PT-32 | PR19 |
| D-CH-r2b §5 item 2 | — | NOTED — covered by SEAMS-r2-6's cure | §2.1 shape 3 | — |
| D-RN-r2b | — | NOTED — nothing routed to PT; §20 (1) updated (RN cured PT's halves) | §20 | M9 |
| FOLD parenthetical (D-MN-r2 / D-PT-r2 "ROUTE to the chair / fold") | — | NOTED — the fold lane's; no PT row | — | both files read |

## 3. STOPS
None. Every cure executes a RULINGS-ROUND2b row or aligns PT to a sibling's cured text; zero kernel lines; no owner-gated class touched (the two new sub-fields are DRAFT design on PT's own sub-ledger, REFINED and vetoable).

## 4. REFINED (each marked in the volume, vetoable)
- **R2b-1 `banKeys`** (§2.1, §9.3, §16, OD-PT-4/6, P45): a court's own pardon of the party reads PL's EXACT KEY FORM `seatChangedSince(…, episode)`, the banning court's `seatEpisodeKeyOf` stored at the ban's mint. Why: M2 — the tick form read a tick no record held, and CH's paragon bans lift by the key form, so one court's two bans would have lapsed under two rules on a DM's tick-less `CHANGE_RULING_POWER`.
- **R2b-2** (§0, §8.3): the season and the sea cite `SLOW_NOT_SEVER_MAX` and the storm factor, never CHAIR-NOTES 13–14 (M3).
- **R2b-3 `presentAt.fromIds`** (§2.1, §16, OD-PT-4/32): the place the DM's move left — the road arm's traversal needs an origin the toggle overwrote.
- **R2b-4 `RECORD_CLEARING(siteId)`** (§4, §6): the table verb that fires PT's clearing door (ST S8 implied one; none was named).
- **R2b-5** (§13): PT's `road(a, b)` read as PR's ONE STRETCH KEY `road{a, b}` (whole road; the road arm names the riders' half), as MN reads its own.

## 5. THE OTHER HALVES (routed; this lane wrote none)
1. **RN** — `target` gains an optional `siteId` qualifier (PT's site deeds), named in the normalizer; RN §8's sites bracket "ST's actor convention gains `site`" → a WHERE and a subject (the ADDENDUM).
2. **ST** — §7.3's pending passage "a site is an actor ref only as a hearing's WHERE and a target (`{ kind: 'site', id }`)" awaits its bracket under the ADDENDUM; the reveal door (open question 1).
3. **PR** — the party's inputs to `patrolEncounter` are stated on PT's side (cover by `fameIn`; no home court ⇒ strangers; ban × 2; traveller key `party`); PR may confirm in its row; its party row writes `road (a, b)` where CH/PT write `road{a, b}`.
4. **CH** — name `met_in_person` as the producer of `marks.metParty` (M8).
5. **The fold (P4)** — §3.3.12 gains `corps`, `site` re-bracketed as WHERE + subject; §3.4 `party_gate` ↳ gains the road arm; the WHERE `road` row gains `party_gate` (road arm) and `party_hunted`, `party_visit` stays `settlement` (A.13); §5 rows `fromIds`, `banKeys` (CH's sense on two records), `RECORD_CLEARING`, `party_made_known_site` (replaces PT's round-2 token), `u:` (RN's); CHAIR-NOTES 16 gains PT's corps edge arm; §6 notes PT-6's road arm with C16.

## 6. OPEN FOR THE CHAIR
1. Should the reveal of a site be ONE act through PT's door like the clearing? ST's closed caller list names only the clearing door, and `SITE_STATUS` already carries four dials, so today `party_made_known_site` rides beside the DM's `SITE_STATUS made_known` (offered by PT2's suggestion).
2. (RN's, echoed) the fold's `party_voiced` trigger reads "a court, or a person of `regional` fame"; PT and RN say persons only.
3. Round 1's two still open: a deed-only upward size bias; an AMEND `{ lie: true }` on `party_pledge_due`.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by code read at `81f1cd963`: M2, M3, M4 (signature and return). CONFIRMED by reading the host document and the live sibling volumes: M5, M6, M8, M9. CONFIRMED by execution: M1 (`cmp`), M7 (census), the volume check (`check-r2b.out`), the edit run (71 asserted replacements, dry run identical to the live result). PLAUSIBLE, not executed: that `candidateRoutes`' primary path is the road `hopWeeks` priced when a sea lane is cheaper; PR's reading of the party as a stranger; every DRAFT constant. None upgraded.

## 8. PROBES (`cure/D-PT-r2b-probe/`)
`PT-before-r2b.md` (the dead seat's byte copy, verified) · `census-r2b.sh` → `census-r2b.out` (the dead seat's) · `census-r2b-2.sh` → `census-r2b-2.out` · `tools/apply_r2b.py`, `tools/edits_r2b_part1..3.py`, `tools/edits_r2b_all.py` (the edit record) → `apply-r2b.out` · `tools/check_r2b.py` → `check-r2b.out` · `volume-r2b.diff`.
