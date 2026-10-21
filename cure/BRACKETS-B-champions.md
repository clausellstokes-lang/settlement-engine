# BRACKETS-B-champions — P6c BRACKETS LANE B (CH whole · OP one edit · RN one bracket); chair 6eb7b5b6; seat Opus 5.5

Started 2026-10-20 20:20 CDT (by `date`). INSERTIONS-ONLY. Never git beyond the read-only numstat; never the test suite.

## §0 BASELINE (before any edit, 20:20 CDT)
- `git diff --numstat 8a3061070 -- docs/DESIGN_FP_ARCH_CH.md docs/DESIGN_FP_ARCH_OP.md docs/DESIGN_FP_ARCH_RN.md` →
  `244 52 docs/DESIGN_FP_ARCH_CH.md` · `54 13 docs/DESIGN_FP_ARCH_RN.md` · OP prints nothing (OP is UNTRACKED at 8a3061070 — a P6a compile; its proof is the diff against this lane's snapshot).
- The pre-existing deletions (CH 52, RN 13) are the earlier lanes' in-place amendments (L-CH-PD / D-CH-PD-r1 on CH; P5 + lane A2 on RN) — NOT this lane's. This lane's own proof is the diff against its snapshots: `BRACKETS-B-champions-probe/{CH,OP,RN}.before.md` (sha CH e732b1be… = the verifier's snapshot, byte-identical; OP 0cb11a0f…; RN 0cda1efb…).

## §1 PROGRESS
- 20:2x CDT — inputs read: README (RESUME BLOCK 3 + laws), COMPILE-COMMON, DISPOSE, RULINGS-P6 WHOLE (§A–§H), RULINGS-P5 WHOLE (ADDENDUM §C.25 · §D.3 · §D.7), OWNER-WORDS-2026-10-20, the BOARD's 10-20 owner lines, skeptic/CH-PD-r1-verify.md WHOLE, cure/D-CH-PD-r1.md WHOLE, the ROUTES of D-OP-r1/r2/r3, D-MG-r1/r2/r3, D-WS-r1/r2/r3, D-FOUR-r4; OP §9 and its §15 CH row; WS §4.2 C9 and §13; RN §6.2. CH sections read whole before each bracket: header, CH22, §2.1, §2.2, §2.2b, §2.4, §3, §4, §5 (bullets), §6, §7, §10b, §12.4, §14, CH-0/2/3/11, L1/L1c/L3, S60–S69, OD-CH-50..56.
- MEASURED FIRST (the refuting measurement): (a) `lean2.mjs` RE-RUN from this lane's probe dir → `BRACKETS-B-champions-probe/lean2.rerun.out.txt` + `.tsv`, BYTE-IDENTICAL to `cure/D-CH-PD-r1-probe/lean2.out.{txt,tsv}` (diff empty); (b) the verifier's `s68i.mjs` RE-RUN → `s68i.rerun.out.txt`, BYTE-IDENTICAL to `skeptic/CH-PD-r1-verify-probe/s68i.out.txt` ("18 one-step malice changes move act AGAINST the face's kind coordinate"); (c) master `81f1cd963` (read-only): `religionState.js:300` "`const seed = (existingShare = 0) => ({ deityRef: ref, snapshot: deity, …`" · `religiousContest.js:257` "`[deity.rankAxis]`" · `religiousContest.js:547` "`if (!isSubsystemActive(snapshot, 'religion')) return …`" · `pulseKernel.js:458` "`const religionActive = isSubsystemActive(snapshot, 'religion');`" — H.1 and V2's receipts CONFIRMED; (d) `briefs/L-CH-PD.md` item 2 holds "a merciful god's champion rescues readily" (the chair's), the BOARD's 12:44 line the owner's verbatim word — F.4 CONFIRMED.
- 20:3x CDT — CH: `edit_ch.py` (36 unique-anchor insertions, each asserted unique) + the §25 P6c block appended; OP + RN: `edit_op_rn.py` (OP 5 insertions, RN 1).

## §2 THE PROOF — INSERTIONS-ONLY
- Against this lane's snapshots (`diff <before> <after>`): CH `<` 0 · `>` 59 · OP `<` 0 · `>` 5 · RN `<` 0 · `>` 1 — every change a pure line insertion; NO landed line deleted or rewritten (table amendments are new `↳` rows; paragraph amendments are dated lines directly after the amended line).
- `git diff --numstat 8a3061070 -- docs/DESIGN_FP_ARCH_CH.md docs/DESIGN_FP_ARCH_OP.md docs/DESIGN_FP_ARCH_RN.md` AFTER (20:32 CDT): `303 52 docs/DESIGN_FP_ARCH_CH.md` · `55 13 docs/DESIGN_FP_ARCH_RN.md` · OP prints nothing (untracked at 8a3061070). Before: 244/52 · 54/13. So this lane added CH +59 · RN +1 and deleted NOTHING (the 52 and 13 are the earlier lanes' in-place amendments, unchanged by this lane). ⚠ Disclosure: one extra read-only git call (`git status --porcelain -- docs/DESIGN_FP_ARCH_OP.md`, to confirm OP is untracked) beyond the numstat.
- Table rows checked for cell counts against their headers (§2.1 4 · §2.2 3 · §2.2b 7 · §2.4 4 · §4.2 4 · §6.2 5 · §14 2 · §22 3 · §23 3 · OP §2.3 5).

## §3 THE RECORD (27 routes)

| # | Route (source) | Volume · where | Disposition |
|---|---|---|---|
| 1 | §G.1 the rescue exert is the card only (OP-V5; D-FOUR-r4) | CH P2 `exertion` · §2.2 ↳ · §2.2b · §4.5 · §6.1 · §10b face | APPLIED (carrier = OP's proposal, PLAUSIBLE; key name → CH-1 car-0 / P7 §5) |
| 2 | §G.6 no heroic-faced act is a false report; `false_word` on the deceiver's face (D-OP-r3) | CH §2.2b + new `false_word` row · §10b face · §10b couplings | APPLIED (row coordinates = the information-villain row's, REFINED vetoable) |
| 3 | §E.5 who answers a `captive_held` call (D-OP-r3 text, replacing r2's) | CH §4.2 `answer_call` ↳ | APPLIED |
| 4 | OP-r1-14 a free paragon's rescue writes regard only | CH §4.2 `answer_call` ↳ | APPLIED |
| 5 | D-OP-r3 `work_here` stands at `source.venueId` | CH §4.2 `work_here` ↳ · §4.5 | APPLIED |
| 6 | D-OP-r2/r3 · §D.1 · §E.6 the §14 `captive_held` row + harm twin | CH §14 new row | APPLIED |
| 7 | OP-r1-13 both excluded from PT's read | CH §14 BELIEF bracket | APPLIED (PT's own line → P7) |
| 8 | OP-r1-15 · OD-OP-24 ⭐ `aim.roadOpportunity` in `normalizeParagon` | CH P2 `aim` · L3 · §23 cited row | APPLIED |
| 9 | §C `patrol_will` | CH §2.2 (already P5C-19) | APPLIED BY PREDECESSOR — G.1's skip added beside it |
| 10 | §A.3/§A.6 · D-MG-r1 verbs NAMED; riding by the aim | CH §5 new bullet | APPLIED |
| 11 | D-WS-r1 `purse_empty` stays CH's (`coffers_bare` WS's) | CH §4.8 | APPLIED |
| 12 | WS §4.2 C9 / §13 the retainer offer to a corps | CH §7 | APPLIED (text from WS's own seam table; D-WS logs carry no CH line for it) |
| 13 | D-WS "the commander arm" | — | COULD-NOT-PLACE — no CH-addressed text in D-WS-r1..r3 or WS §13 (the `commander` routes go to C4 THE GENERALS and WC); inventing a placement is refused |
| 14–17 | D-CH-PD-r1 routes 5 · 6 · 7 · 8 | CH §2.1 `creedRef` ↳ · §2.4 ↳ · §3 CH-0b · CH-3 | APPLIED (route 8 widened by H.1) |
| 18 | §H.1 oath to an unseated god admitted WITHOUT a contest; "enters through its saint" WITHDRAWN | CH CH22 · §6.2 ↳ · §10b field · §10b Tier · CH-11 · OD-CH-55 ↳ | APPLIED (Tier reading "the field stands" = the roll reads it, REFINED vetoable) |
| 19 | §H.3 CH-PD-V1 monotone per half; good god's war champion below unsworn | CH §10b `act` · S68 ↳ · OD-CH-52 ↳ · CH-11 | APPLIED (re-run quoted) |
| 20 | §H.3 CH-PD-V2 world snapshot first; never-read list scoped | CH CH22 · §2.1 ↳ · §6.2 ↳ · §10b field · §10b never | APPLIED |
| 21–23 | V-CH-PD-r1 minors (S60; S61/S65 hash stream; wholly neutral god's shame) | CH S60 ↳ · S61·S65 ↳ · §4.5 | APPLIED (S61/S65 narrowed to identical-state order, REFINED vetoable) |
| 24 | §H.2 CH cites | CH §10b flock | APPLIED |
| 25 | §H.2 RN l.416 superseded (D-CH-PD-r1 route 2's text) | RN §6.2, one bracket beside lane A2's | APPLIED |
| 26 | §F.4 re-attribution + the owner's 12:44 word verbatim (+ route 3 "a good god's") | OP §9 l.341 + pointer at l.343 | APPLIED |
| 27 | D-CH-PD-r1 route 4 "lies less readily" ×3 | OP l.162 (↳ row) · l.301 · l.344 | APPLIED |

Counts: applied 26 of 27 · could-not-place 1 · stop 0. N/A (no half for this lane's volumes): RULINGS-P5 §C.25 (no CH item), §D.3 (BD's/ES's — CH carries no custody shape, L7), §D.7 (WC's, lane A).

## §4 ROUTED (for P7 the fold, and the owners)
- RN (owner's lane / P7): D-CH-PD-r1 route 1 — export lens one's pure core AND the lens-two mix (the verifier: "RN's mix export not yet on RN's books"); register OP's `captive_rescued` and CH's `false_word` `paragon_act` rows in `DEED_SOURCES` / the inherent-value registration; RN l.191's history mention of `patronLean` is fine (a rename note).
- PT: `party_request` never reads `captive_held` (OP r1/r2's route; not this lane's file).
- FOLD §5: the `exertion` key carrying `source.kind` (name at CH-1 car-0); `swornDeity` · `swornDeityOf` · `swornLean` · `swornTemperOf` · `SWORN_LEAN_WEIGHT` · `sworn_creed_conflict` · `keeps_the_faith` · `patron_creed` · `suppressed_creed`; `patronDeity` in its landed settlement sense only; `purse_empty` vs `coffers_bare`; `false_word` as a `paragon_act`.
- FOLD FP-46 roster: `SWORN_LEAN_WEIGHT` 0.10 (boldness ½), μ ½, the shame bar −½; the `false_word` row's coordinates (DRAFT).
- W-LIVES (fold INBOX): a new `SUBJECT_RESOLUTIONS` rung `swornDeity` (route 9).
- ODQ §934.94 VISIBLE: OD-CH-51 ⭐, OD-CH-56 ⭐, OD-OP-24 ⭐, H.1's admission-without-contest, V1's owner-visible consequence (a good god's war champion leans below an unsworn one), the Tier reading.
- MG l.63 says "(L-CH-PD, the owner's 12:44 word)" without the chair's sentence — no misquote; no change asked.
- V-BRACKETS-B (RULINGS-P6 §H.4) reads this lane's 42 inserted lines; SEAMS-P6 reads CH/RN/OP last.

## §5 CONFIRMED vs PLAUSIBLE
CONFIRMED: insertions-only (the snapshot diffs, the numstat), the two probe re-runs byte-identical, the four master receipts for H.1/V2, F.4's source. PLAUSIBLE (carried as their owners wrote them, never upgraded): the `exertion` source-kind carrier (OP §9's proposal), the `false_word` row's coordinates, the Tier reading of "the field stands", the S61/S65 narrowing.

CLOSED 20:3x CDT — lane complete.
