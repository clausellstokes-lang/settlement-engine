# PS — THE FIDELITY LEDGER OF THE CONSOLIDATION (P8, lane C-PS; SEAT 1 and SEAT 2, 2026-10-23) — COMPLETE: every row disposed; the new text replaces `docs/DESIGN_FP_ARCH_PS.md`

Old text: `history/PS-bracketed-1beabdc85.md` (407,790 bytes, 1,006 lines), byte-identical to `docs/DESIGN_FP_ARCH_PS.md` when each seat began (`cmp`, `/home/user/fp-p8/docs`). New text: `consolidate/PS-new.md` (the whole volume), built by ONE script over the old text (scratchpad `cps/`: `brackets.py` the balanced bracket scan; `build.py` with `d00.py`–`d15.py`, `head.py` and `post.py`; every substitution asserted to match exactly once, every regex substitution its exact count), so every passage not named in a fold note is byte-faithful to `1beabdc85` minus its brackets. SEAT 1 wrote the header, THE READER'S GUIDE, THE OWNER'S WORDS · THE ANSWER and §0–§4 (old lines 1–320; `d00.py`–`d06.py`, `head.py`); SEAT 2 wrote §5–§18 (old lines 322–1006; `d07.py`–`d15.py`, `post.py`), moved the cure record, corrected four passages of seat 1's text (§3 below, each logged) and finished the ledger. After seat 2's rebuild, seat 1's bytes are unchanged except those four logged corrections (a `diff` of the rebuilt old-lines-1–320 text against seat 1's saved output shows exactly them). The cure record is `history/PS-cure-record.md` (Part 1 = old lines 3–14 verbatim; Part 2 = old §18, old lines 773–1004, verbatim).

## 1. THE COUNT (by script, before writing)
The ratchet's MARKERS pattern finds **547** hits in the old text (248 in old lines 1–360, 283 in §6–§17, 16 in §18) — the minimum. The ledger counts more finely: **635 rows** — **522** brackets by balanced scan (519 body: `[CURED …]` 468 · `[REFINED …]` 30 · `[ADDED …]` 17 · `[OPENED …]` 2 · `[STOP …]` 1 · `[RE-RULED …]` 1; 3 inside §18) + **2** markers nested inside a bracket (`N`) + `↳` outside brackets (`A`) + round words outside brackets (`H`) + `STOP` outside brackets (`S`) + `ROUTED-UNAPPLIED` outside brackets (`U`) + **7** header/round lines with no other marker (`L`). Every MARKERS hit maps to one row (a hit inside a bracket to that bracket's row or its nested row). The 635-row basis is seat 1's, kept.

**Dispositions: old markers 635 · folded 554 · dropped 0 · moved 67 · kept 14 · PENDING 0**. (KEPT = a build-time STOP condition kept as a design mark, or a word that is not a marker; MOVED = the header block and old §18, byte-identical in the history file.)

| section | folded | dropped | moved | kept | pending | STOPs |
|---|---|---|---|---|---|---|
| header | 0 | 0 | 30 | 0 | 0 | 0 |
| THE OWNER'S WORDS · THE ANSWER | 3 | 0 | 0 | 0 | 0 | 0 |
| §0 | 28 | 0 | 0 | 1 | 0 | 0 |
| §1 | 53 | 0 | 0 | 0 | 0 | 0 |
| §2 | 67 | 0 | 0 | 0 | 0 | 0 |
| §3 | 12 | 0 | 0 | 0 | 0 | 0 |
| §4 | 42 | 0 | 0 | 2 | 0 | 0 |
| §5 | 45 | 0 | 0 | 1 | 0 | 0 |
| §6 | 14 | 0 | 0 | 1 | 0 | 0 |
| §7 | 26 | 0 | 0 | 2 | 0 | 0 |
| §8 | 1 | 0 | 0 | 0 | 0 | 0 |
| §9 | 17 | 0 | 0 | 0 | 0 | 0 |
| §10 | 14 | 0 | 0 | 0 | 0 | 0 |
| §11 | 28 | 0 | 0 | 3 | 0 | 0 |
| §12 | 20 | 0 | 0 | 0 | 0 | 0 |
| §13 | 41 | 0 | 0 | 1 | 0 | 0 |
| §14 | 48 | 0 | 0 | 0 | 0 | 0 |
| §15 | 19 | 0 | 0 | 0 | 0 | 0 |
| §16 | 65 | 0 | 0 | 3 | 0 | 0 |
| §17 | 11 | 0 | 0 | 0 | 0 | 0 |
| §18 THE CURE RECORD | 0 | 0 | 37 | 0 | 0 | 0 |

STOPs of this pass: **NONE RAISED — no ⛔ STOP PS-C-n.** No conflict two brackets left open was found in the whole volume. The old text's one `[STOP …]` bracket (B235, `STOP SEAMS-r5-2-scope`: the scope of PS's unit widening on the hidden ways) was RULED before `1beabdc85` — the program's round-6 rulings §D ("STOP SEAMS-r5-2-scope: PEACE AND WAR") and the fold's §3.3.18 THE ONE ROAD NETWORK ("IN PEACE AND IN WAR (§D's STOP, RULED …)") — and its own proposal is the ruling, so §5.6 states the ruled scope and cites the fold row, and OD-PS-44 names it. OD-PS-29 (the old row read "THE CHAIR'S … ?") was ruled before `1beabdc85` (the program's round-2b rulings: "OD-PS-29. STANDS: a march prices its CHOSEN path on PS's lit arm only …; lighting is a declared same-seed shift signed at its unit"), so §5.1 and §16 state it as ruled. Seat 1's settled passages (B068 → OD-FC-103; B127 → OD-FC-104; B090/B091 by B091's own words and OD-FC-105; B029 amended by B030) stand. In §14 the ST row's "a body or a menace … holds by its own mover …, never by the helper (routed to ST)" is superseded by the LATER bracket in the same cell (B410, `[RE-RULED 2026-10-19 …]`, quoting the ruling "a body or menace held at the approach is held by the hold helper's FREEZE at its prior position") — latest wins, no conflict left open; §4.1 registrant (2) (seat 1's) already states the same.

## 2. THE SECTION MAP (old → new; COMPLETE)
old lines 1–15 (title, the compile and round header lines 3–14) → the new header + THE READER'S GUIDE (lines 3–14 MOVED to `history/PS-cure-record.md` Part 1, verbatim) · 16–30 THE OWNER'S WORDS · THE ANSWER → same · §0 → §0 (0.1–0.4) · §1 → §1 (PS1–PS16) · §2 → §2 (2.1–2.8) · §3 → §3 · §4 → §4 (4.1–4.4) · §5 → §5 (5.1–5.6) · §6 → §6 (6.1–6.5) · §7 → §7 (7.1–7.7) · §8 → §8 · §9 THE HEARINGS → §9 · §10 THE FLAGS → §10 · §11 THE WAVES → §11 (PS-0 … PS-5) · §12 THE LIFECYCLE → §12 · §13 THE SCENARIO MATRIX → §13 (P1–P42) · §14 THE COUPLINGS → §14 (with SITES CONSIDERED and PATROLS CONSIDERED) · §15 THE TOKEN REGISTER → §15 · §16 THE RULINGS → §16 (OD-PS-0 … OD-PS-54, a `Ruled` column added) · §17 WHAT A DM READS → §17 (twenty sentences) · §18 THE CURE RECORD → MOVED to `history/PS-cure-record.md` Part 2; the new §18 is THE REVIEW TRAIL (one line); `END OF VOLUME.` kept. Every section number is kept, so every "§x" of the old text still resolves. Inside sections: §8's opening bracket paragraph → its opening paragraph; §9's change-note paragraph (old line 433) removed, its verbatim requirement-24 words folded into "Which answers are hearings"; old line 434's two refinements → one paragraph under §9's table; §10's two `↳` rows → plain `movementGrammarEnabled` and `wingsEnabled` rows; §11 PS-0's `[ADDED …]` sub-bullet (old line 459) → folded into the car-0 bullet; §14's `↳ WC` and `↳ MG` rows (old 627, 639) → folded into the WC and MG rows; §16's `↳ OD-PS-35` (old 727) → folded into OD-PS-35. THE CROSS-REFERENCE CHECK (script): every bare "§x" in the new text names a section heading that exists in it; the three "§x" the script could not attribute are other volumes' (PL §3.2, PR §9.3, BD §19). References to other volumes cite their sections by number and title, never by line.

## 3. TEXT CORRECTIONS THAT ARE NOT MARKERS (each the latest ruling applied, or wording only)
SEAT 1 (old lines 1–320):
- Ruling-file and finding-id tags removed from the running text (`RULINGS-ROUND2/2b/3/4/5/6 …`, `RULINGS-P5 …`, `CHAIR-NOTES …`, `SX-08`, `PS-r2-n`, `HOST-r2-n`, `SEAMS-r2-n`, `PS-V2`, `PS-V3`, "A.1"); a quoted ruling keeps its quote ("the ruling: …", "the program's ruling …"). "the skeptic's"/"this lane's"/"the chair's" removed (§0.1, §0.2, §0.3, PS12, §2.7); "the chair's round-2 rulings" → "The rulings that bind this volume" (§0.2).
- §0.2's PL line rewritten to PL's consolidated words (`toll_exemption`, the PL-C-1 ruling) and the bare-word note; the actor-convention line (six kinds); the chooser-car line (WAR CIRCULATION's `WC-car-0`); §0.4 restated as one paragraph in final form.
- THE FIVE REGISTRANTS (B167, the order of record; MG's `movementVerbLeaf` fourth, WC Arc A fifth) applied in PS9's order sentence, PS11's stage sentence and §4.1's order.
- PS9's chosen-freeze rule and §2.7's step-6 rule stated as ruled (OD-FC-103, OD-FC-104); §2.1's wing line rewritten whole from B090 + B091; §2.7's ASK SET and `replanFromNode` lines rewritten; §2.8's persisted-shapes line restated in final form; §2.3's and §2.2's under-table lines restated from B103 and B099; "The round-1 key `departTick` changed" → "The key is never `departTick`, which changes" (§2.1); "the lane's adoption" → "THE PASSAGE's adoption" (§2.8).
- §4.4's "OD-FC-28 ↳ (a) … whose row gains PS's widths at P4" → OD-FC-28 (a) "as amended, for THE PASSAGE's widths".
SEAT 2 (old lines 322–1006):
- Ruling-file and finding-id tags removed from §5–§17's running text and tables (`RULINGS-ROUND2/2b/3/4/5/6`, `RULINGS-P5`, `CHAIR-NOTES`, `SX-08`, `PS-r2-n`, `PS-V1..3`, `PS-X1/X2`, `PS-W1`, `RU-PL-n`, `R-PL`, `HOST-r1-2`, `HOST-r2-n`, `SEAMS-r2-n`, `CH-r1-4`, `P5C-n`, "A.n", "B.n", "C.n", "minor (x)", "(routed)", "a routed row"); a quoted ruling keeps its quote ("the ruling: …", "the program's rule: …"). "the chair's", "the skeptic's" and "the verifier's" removed (§5.1, §5.6 "the chair's L-BD 11 (i)", §13 P7, §15's `PASSAGE_ENVOY_VERDICTS` row "the chair's words" → "the ruled words", §16 OD-PS-1, -19, -29, -46). Round labels removed from §15's "Meaning here" column ("round-2 shapes and reads" → "shapes and reads", and so for rounds 3, 4, 5 and P5) and from OD-PS-27's constants list.
- B167's FIVE / FIFTH applied at the four places it names in seat 2's range: §11 PS-0's car-0 (with B311: five slots, MG's leaf fourth, Arc A fifth, the second helper `replanFromNode`), §14's WC row (with the `↳ WC` row B396: Arc A FIFTH, `holdWingAtContact`), OD-PS-35 (with `↳ OD-PS-35`, B481) — and "the A.13 row", which is in old §18 THE CURE RECORD (old lines 899–900) and already carries its own `↳ A.13` row "reads FIFTH"; old §18 moves verbatim, so no edit is made there (a record of what a round did, not running text).
- OD-PS-29 stated as RULED (§1 above) in §5.1's sentence and in §16.
- STOP SEAMS-r5-2-scope stated as RULED (PEACE AND WAR) in §5.6 and OD-PS-44 (§1 above).
- §14's ST row: the RE-RULED bracket B410 applied — "THE HELPER HOLDS A TRANSIT RECORD ONLY: … a body or a menace … holds by its own mover …, never by the helper (routed to ST)" → "THE HELPER'S FREEZE AT THE APPROACH: … a body or a menace held at the approach is held by the hold helper's FREEZE at its prior position … — on a clockless record the FREEZE is the withheld commit (§4.1 registrant (2)), the mover only registering".
- §14's PL row and §15's `passage` row: the ⚠ request that PL read "transit, not a decision" at its §3.4 call-site row restated as done — PL's consolidated §3.4 row now reads "EXEMPT — transit, not a decision" under the vocabulary ruling of ⛔ STOP PL-C-1 (the bare word "passage" carries THE PASSAGE's meaning, PS14); OD-PS-5's "the charter's passage stays tolls only" → "the charter's `toll_exemption` stays tolls only" (the same ruling).
- §16 in the output shape of CONSOLIDATE §2 item 8: a `Ruled` column added — rows 0–47 ruled 2026-10-18 (the compile and rounds 2–4, all that day), 48–51 on 2026-10-19, 52–54 on 2026-10-20, "amended" listing the dates of the row's own brackets (OD-PS-35 also its `↳` row's), "by delegation · vetoable"; OD-PS-0 marked ⭐ and VISIBLE (as OD-PR-0 is); OD-PS-21's "WITHDRAWN AND REPLACED" → its Ruled cell "re-ruled 2026-10-18 (supersedes the compile's OD-PS-21, …)"; OD-PS-44's Ruled cell adds "the scope ruled 2026-10-19 (PEACE AND WAR)"; OD-PS-54's "THE P5 CURES" → "THE COMPLETENESS RULINGS"; ruling-file references in the Why column → "the program's ruling" (with its subject) or removed where another reason stands; "REFINED" restated in OD-PS-36, -41, -44 and -48 as plain sentences; OD-PS-46's Why gains `p7-effective.out` (B497's receipt).
- Never-statements kept for names the latest text withdrew, so no backticked token is lost: `SET_PASSAGE_STANCE` (§8), `warDeployment` (§5.1), `armyMarchWeeks` (§5.3), `known[B][trailKey].watched` (§5.6), `envoy_intercepted`/`envoy_held` (§6.5), `no_foraging`/`no_halt_at_seat` ("are never terms", §15), `passageNodesOf` (OD-PS-54), `humanTermType` (§6.4, §15).
- Cross-reference and wording fixes: §5.6 "WHO below" → "WHO above" (the WHO bullet stands above it); "§2.1's P6c bracket"/"§2.1's lane-C bracket" → "§2.1's wing line" (§10, §14); "§4.3's P6c bracket" → "§4.3's creditor's request" and "§6.5's P6c bracket" → "§6.5" (§14 OP row); "PS-V2's car" → "§4.1's battle-input car" (§5.6); "byte-identical to round 3" → "byte-identical to THE PASSAGE without the hidden way" (§5.6 TIER, P32); "(P4)"/"at P4" → removed or "the fold's" (§5.6, §9, §15); §6.5's "OPENED by delegation 2026-10-20 (P5 A.2)" → "opened by delegation and no longer the owner's slot" (the date to the rulings and the ODQ); §6.5's "fold §3.3.13 ↳ P5, OD-FC-60 ↳ P5" → "the fold's §3.3.13 and OD-FC-60, as amended"; THE SEA row's "CHAIR-NOTES 14's …" → "the sea border gate, PS2".
- SEAT 1's TEXT CORRECTED BY SEAT 2 (`post.py`, `d14.py`; the only changes to seat 1's bytes): (a) THE GUIDE CHECK — THE READER'S GUIDE item 3 widened to name every truth read and belief read the consolidated text makes (A's `moverRoadOf`, THE PATROLS' `believedWatch` and the fall-odds word as A believes it — §5.2, §5.6; the liege's `reliefAnswerOf` on its OWN belief inputs — §7.5; the holder's `knownTrailsOf` inside THE PATROLS' witness — §5.6; TRUTH of the army transit record over the frozen digest and the territory's holder by `gateKeeperOf` — §4.1, PS2; the holder's obligations — §4.3's creditor's request; its liege's war — §7.7; the routes' landed seasonal, danger and toll costs — §5.1, §5.3; THE PATROLS' `witnessedCrossing` and standing report — PS8, §7.4; the mover's own temperament and the landed pair state — §5.2; the PUBLIC record `sitesNear`, kept-secret sites excluded — §5.1); (b) item 4's "the `passages` ledger only from THE TRANSIT LEAF STAGE … and THE COURT STAGE" was UNTRUE (§5.4, §5.5 and §6.5: THE PATROLS' stage and WC-6's and WC-10's producers call PS's ledger module) → "only through PS's own ledger module — from THE TRANSIT LEAF STAGE …, THE COURT STAGE …, and the calls THE PATROLS' stage and WC-6's and WC-10's producers make into it"; "every hold only through `holdBeforeNode`" → "every hold PS makes only through `holdBeforeNode`" (WC Arc A holds a wing through MG's `holdWingAtContact`, §14); the guide says "only" nowhere else; (c) PS8's "the fold's WHERE companion's one stretch key (P4)" → "(P4)" removed (a review label); (d) PS8's "the candidate geometry of the ONE ROUTE LADDER's lowest rungs" → "… ways (its way-mode edges)" — latest wins by B232 (a way is a route-ledger edge in MODE `way`; "the road ladder's lowest rungs" was the superseded reading) and the fold's §3.3.18.

## 4. ALLOW-MISSING (`consolidate/PS-allow.txt` carries the same list, one token per line)
- HEADER TEMPLATE (11, seat 1): the header lines' `[CURED … — <id>: …]` / `[REFINED …]` / `[ADDED …]` template tokens, moved with the header block.
- REVIEW-TRAIL PATHS (37, seat 1; +5, seat 2): ruling files, lane logs, routes, skeptic and verifier reports and probe folders cited only by header lines or brackets — seat 2 adds `assessments/P5-RULINGS-2026-10-20.md`, `cure/D-BD-r5.md`, `cure/D-PL-r5.md`, `cure/D-PR-r5.md`, `skeptic/BD-r5.md` (cited only inside brackets of §5.5, §5.6 and §7.5). They stay in git and the kit; executed probe receipts that back a measured claim are KEPT in the text (`cure/D-PS-r4-probe/p7-minimality.out`, `cure/D-PS-r5-probe/p7-effective.out`, `skeptic/PS-r4-verify-probe/p7-danger.out`, `p7-season.out`, `cure/D-PS-ST-PR-p5-probe/ps-master-reads.out`, …).
- SUPERSEDED NAMES (7, seat 1): `settlement · person · party · menace` and `… · corps`; `road (prev, B)`; `(B)` and `(capacity)`; `B`; `protection_failed` (as B086's withdrawn arm; the token itself still stands in P14 as PL's outcome word).
- MOVED WITH THE CURE RECORD (40, seat 2): every backticked token that occurs ONLY in old §18 THE CURE RECORD (old lines 773–1004) — round labels of verifier reports (`MN-r2-verify` …), lane scripts (`apply_r5.py`, `tablecheck.py` …), probe files (`tokens-r4.out` …), the cure rows' quoted identifiers (`SITE_READINESS`, `paragonLean`, `menace_met`, `road{P,B}` …) and the two bracket labels quoted there (`[OPENED …]`, `[STOP SEAMS-r5-2-scope]`). Each is byte-identical in `history/PS-cure-record.md` Part 2.

## 5. THE RATCHET (whole volume: `python3 tools/consolidate-ratchet.py history/PS-bracketed-1beabdc85.md consolidate/PS-new.md --allow-missing-file consolidate/PS-allow.txt`)
```
tokens: old 1163 · new 1074 · missing 0 · new-in-new 10
  NEW tokens in the new text (each must be a registered name, never a mint):
   + 1beabdc85
   + : a same-kingdom patrol riding a member's roads by right of the banner (§5.5); it spends no 
   + advancePassageCourts
   + cure/
   + history/PS-cure-record.md
   + relationshipEvolution.js :: applyRelationshipPatch
   + settlement-engine-kits/fp-final-a73343ed-2026-10-17/
   + settlement-engine-kits/fp-final-a73343ed-2026-10-17/history/PS-cure-record.md
   + skeptic/
   + toll_exemption
cites (path :: symbol): old 89 · new 90 · missing 0
laws (XX1–XXn bold): old 16 · new 16
OD rulings: old 65 · new 67
owner rows ⭐: old 15 · new 16
DRAFT marks: old 45 · new 45
UNMEASURED marks: old 22 · new 22
wave ids (XX-n): old 9 · new 8  ← FEWER (explain in the ledger)
flags (…Enabled): old 23 · new 23
review markers left in the new text: 0
RATCHET 1 DIFFERENCE CLASSES
```
THE ONE REMAINING DIFFERENCE, EXPLAINED: "wave ids (XX-n): old 9 · new 8" — the lost id is `MG-24`, which is not a wave: the pattern matched `OD-MG-24 — ` inside B090 (§2.1's wing bracket); `OD-MG-24` stands in §2.1's wing line, and every wave id (PS-0 … PS-5, EC-17, MN-4) survives. Missing tokens: 0. Cites: old 89 · new 90 (the guide's `relationshipEvolution.js :: applyRelationshipPatch`, CONFIRMED at `81f1cd963`: `export function applyRelationshipPatch` in `src/domain/worldPulse/relationshipEvolution.js`). Laws 16 · 16; OD rulings 65 · 67 (OD-FC-103 and OD-FC-104 cited); ⭐ 15 · 16 (OD-PS-0 marked); DRAFT 45 · 45; UNMEASURED 22 · 22; flags 23 · 23; review markers left: 0. The NEW tokens are the header's paths, THE REVIEW TRAIL's `cure/`, `skeptic/` and `history/PS-cure-record.md`, the guide's names (each a name the old text registers — `advancePassageCourts` inside §4.2's backticked signature — or a landed symbol), PL's `toll_exemption` (the PL-C-1 ruling) and one backtick-parity artefact (B139's fold in the `permits` row) — no mint.

## 6. THE GUIDE CHECK (done before the volume was replaced)
THE READER'S GUIDE's "what it reads" item names every truth read and belief read the consolidated text makes (seat 2 widened it — §3 (a)); its "only" claims were checked against the text: item 4's ledger claim was untrue and is corrected (§3 (b)); "every hold PS makes only through `holdBeforeNode`", "trust and resentment only through … `applyRelationshipPatch`" (§7.1–§7.3, §7.7: one state-only relationship outcome) and "a harbouring row only REQUESTED through PL's `requestFealtyRow`" (§7.7) hold.

## 7. THE ROWS (one per marker; `B` body bracket by index · `C` bracket inside §18 · `N` nested in a bracket · `A`/`H`/`S`/`U` outside brackets, `<code>-L<line>.<k>` · `L` header/round line)
| id | old line | old section | first 60 characters | what happened | new section | note |
|---|---|---|---|---|---|---|
| B000 | 7 | header | [REFINED 2026-10-18 (fp-final) — what; why] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B001 | 8 | header | [CURED 2026-10-18 (fp-final r2) — <id>: …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B002 | 9 | header | [CURED 2026-10-18 (fp-final r3) — <id>: …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B003 | 9 | header | [REFINED 2026-10-18 (fp-final r3) — …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B004 | 10 | header | [CURED 2026-10-18 (fp-final r4) — <id>: …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B005 | 10 | header | [REFINED 2026-10-18 (fp-final r4) — …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B006 | 11 | header | [CURED 2026-10-19 (fp-final r5) — <id>: …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B007 | 11 | header | [REFINED 2026-10-19 (fp-final r5) — …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B008 | 12 | header | [CURED 2026-10-20 (fp-final P5) — <id>: …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B009 | 12 | header | [REFINED 2026-10-20 (fp-final P5) — …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B010 | 13 | header | [CURED 2026-10-20 (fp-final P5) — <id>: …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B011 | 13 | header | [REFINED 2026-10-20 (fp-final P5) — …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B012 | 14 | header | [ADDED 2026-10-20 (fp-final P6c; <route>) — …] | MOVED | history | the bracket template inside a header line, moved with the header block to history |
| B013 | 24 | THE OWNER'S WORDS · THE ANSWER | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-18 · RULINGS-ROUN | FOLDED | THE OWNER'S WORDS · THE ANSWER | the owner's doctrines read against this volume, folded as its own paragraph after THE OWNER'S WORDS (the ids removed) |
| B014 | 25 | THE OWNER'S WORDS · THE ANSWER | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-1 · PS-r2-2 · HOS | FOLDED | THE OWNER'S WORDS · THE ANSWER | the owner's question on the sea and its answer (THE SEA IS IN THE BOOKS), folded as its own paragraph after the doctrines (the ids removed; the owner's words verbatim) |
| B015 | 29 | THE OWNER'S WORDS · THE ANSWER | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 (the sea), PS-r2-1 | FOLDED | THE OWNER'S WORDS · THE ANSWER | a change note (the sea, the cut "take nothing", `unopposed`); the paragraph states all three |
| B016 | 40 | §0 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 · PS-r2-4 · PS-r2- | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B017 | 41 | §0 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minor 5: meas | FOLDED | §0 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B018 | 42 | §0 | [CURED 2026-10-18 (fp-final r3) — PS-V2] | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B019 | 43 | §0 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minor 5] | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B020 | 44 | §0 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B021 | 44 | §0 | [CURED 2026-10-18 (fp-final r3) — PL-V5 · A.6] | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B022 | 45 | §0 | [CURED 2026-10-18 (fp-final r3) — A.14] | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B023 | 51 | §0 | [CURED 2026-10-18 (fp-final r3) — PS-r2-13] | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B024 | 54 | §0 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 · HOST-r2-2 · PS-r | FOLDED | §0 | a change note between table rows (seven substrate rows added, each read at `81f1cd963`); the rows stand; the line removed |
| B025 | 61 | §0 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-30; RULINGS- | FOLDED | §0 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B026 | 65 | §0 | [CURED 2026-10-18 (fp-final r2) — PS-r2-22: 'siegeFallOddsWo | FOLDED | §0 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B027 | 69 | §0 | [CURED 2026-10-19 (fp-final r5) — BD-r4-3 · RULINGS-ROUND5 B | FOLDED | §0 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B028 | 74 | §0 | [CURED SPL-M13] | FOLDED | §0 | a stamp inside the PL §4.5 quote; the line restated with PL's consolidated words (the vocabulary ruling of ⛔ STOP PL-C-1: the charter's toll right is `toll_exemption`, the bare word "passage" THE PASSAGE's) |
| B029 | 76 | §0 | [CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.7: the ac | FOLDED | §0 | the five-kind convention, amended by B030 to six; its corps and site clauses folded into the six-kind line (§0.2's actor-convention line rewritten whole) |
| B030 | 76 | §0 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.12 (RULIN | FOLDED | §0 | the six-kind actor convention (the latest), folded as §0.2's actor-convention line with B029's surviving clauses |
| B031 | 77 | §0 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.7 · SEAMS | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B032 | 78 | §0 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B033 | 79 | §0 | [CURED 2026-10-19 (fp-final r5) — BD-r4-3 · PS-X1 · RULINGS- | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B034 | 80 | §0 | [CURED 2026-10-20 (fp-final P5) — C.1 (P5C-1, WC-PS-20; RULI | FOLDED | §0 | the car's owner restated (WAR CIRCULATION's owned unit, PS a registered claimant), replacing "owned by the first chain to land" in the line it amended |
| B035 | 83 | §0 | [CURED 2026-10-18 (fp-final r2) — the PS items of 'briefs/RU | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B036 | 88 | §0 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2] | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B037 | 89 | §0 | [CURED 2026-10-18 (fp-final r2) — PS-r2-4 · PS-r2-5] | FOLDED | §0 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B038 | 93 | §0 | [REFINED 2026-10-18 (fp-final) — ten refinements from 'cure/ | FOLDED | §0 | the ten refinements of the brief, restated as §0.4's one paragraph in final form (B039's corrections applied to (4)–(7)) |
| B039 | 93 | §0 | [CURED 2026-10-18 (fp-final r2) — round-1 refinement (5) is  | FOLDED | §0 | its corrections of refinements (4)–(7) folded into §0.4's paragraph (the clamp and two bounds of PS9; the band `none · grudging · fair · wide`; the seat-pair WHERE; the place-keyed noticing read) |
| B040 | 99 | §1 | [CURED 2026-10-18 (fp-final r4) — R-CH (D-CH-r3's route; the | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B041 | 99 | §1 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (1)] | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B042 | 99 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 · HOST-r2-2 (the s | FOLDED | §1 | a change note (the sea and teleport arms, `patrol`, `corps`, occupied land, the envoy arm); PS1 states all of them |
| B043 | 101 | §1 | [CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.13, cited | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B044 | 101 | §1 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minor 4: the  | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B045 | 101 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 · HOST-r2-2 (the m | FOLDED | §1 | a change note (the modality of every hop; the territory holder keeps the gate; H16 lifts the sway exclusion for the keeper read only; winter slows); PS2 states all of them |
| B046 | 103 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-13] | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B047 | 103 | §1 | [CURED 2026-10-18 (fp-final r3) — PS-r2-13 (the fail): the r | FOLDED | §1 | a change note (the earlier cure covered only an absent record); PS3 states the `unknown` and no-edge reading |
| B048 | 105 | §1 | [CURED 2026-10-18 (fp-final r3) — PS-r2-13] | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B049 | 105 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-12 (the occupation r | FOLDED | §1 | a change note (the occupation row; no `unknown` rung; `client` read as the `patron` alias); PS4 states all three |
| B050 | 105 | §1 | [REFINED 2026-10-18 (fp-final) — the brief's "members' mutua | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B051 | 105 | §1 | [CURED 2026-10-19 (fp-final r5) — PS-X2 (MAJOR) · RULINGS-RO | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B052 | 105 | §1 | [REFINED 2026-10-19 (fp-final r5) — THE CONTEST'S OWN WAR IS | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B053 | 107 | §1 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minors 2 and  | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B054 | 107 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-1 (BLOCKING), as RUL | FOLDED | §1 | its surviving content (why the band word is `grudging`, the `SCARCITY_BANDS` cite) folded as one sentence of PS5; the withdrawn brief item and its liege carve-out named only in the text of record |
| B055 | 109 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-19: the enemy's defa | FOLDED | §1 | a change note (`unopposed` joins the closed list); PS6 lists the nine answers |
| B056 | 113 | §1 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-8: the parameter  | FOLDED | §1 | a change note (the parameter was undefined); PS8 defines `gateKey` |
| B057 | 113 | §1 | [CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.14: the k | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B058 | 113 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-18] | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B059 | 113 | §1 | [CURED 2026-10-18 (fp-final r3) — PS-V1] | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B060 | 113 | §1 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2): "the | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B061 | 113 | §1 | [CURED 2026-10-19 (fp-final r6)] | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B062 | 113 | §1 | [CURED 2026-10-19 (fp-final r5) — PS-X1 · RULINGS-ROUND5 B.1 | FOLDED | §1 | a change note (one known set, one network, one price); folded as the clause after "the capacity is the hiding law" (BD's struck `weeksMult` kept as a never-statement) |
| B063 | 113 | §1 | [REFINED 2026-10-18 (fp-final r4) — the seat arm, stated onc | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B064 | 113 | §1 | [REFINED 2026-10-18 (fp-final) — the brief's "the roads gaun | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B065 | 115 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-3 · PS-r2-5 · PS-r2- | FOLDED | §1 | a change note (the earlier one-week shift from wherever the read fired; the cap covers screens); PS9 states the final helper, modes and bounds |
| B066 | 115 | §1 | [CURED 2026-10-18 (fp-final r3) — PS-r2-15 (the fail), as RU | FOLDED | §1 | a change note (the earlier clamp moved a mid-hop unit forward; the ruling of the one helper, its two modes, the one order and Bound 2 only where lit); PS9 and §4.1 state the ruling |
| B067 | 119 | §1 | [REFINED 2026-10-18 (fp-final r3) — the theorem is the measu | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B068 | 121 | §1 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §D.4 · 'cure/D-M | FOLDED | §1 | the five-registrant order folded (§1 PS9's order, PS11's stage); its OPEN question (does a chosen freeze spend Bound 2?) stated as RULED by the fold's OD-FC-103 (latest ruling as of `1beabdc85`: NO) |
| B069 | 124 | §1 | [CURED 2026-10-18 (fp-final r4) — R-ST-a · SEAMS-r3-7 · RULI | FOLDED | §1 | a change note (the struck "as it holds at a refused border"); PS9 states the fort's FREEZE mode |
| B070 | 126 | §1 | [REFINED 2026-10-18 (fp-final) — the brief's aspatial arm pr | FOLDED | §1 | a refinement note (the brief presumed aspatial armies travel); PS10 states the measurement |
| B071 | 128 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-15 · RULINGS-ROUND2b | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B072 | 128 | §1 | [REFINED 2026-10-18 (fp-final r3) — PS-r2-verify minor 5 and | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B073 | 128 | §1 | [CURED 2026-10-20 (fp-final P5) — C.1: the car is WAR CIRCUL | FOLDED | §1 | the chooser car's owner (WAR CIRCULATION's `WC-car-0`, cut before EC-17) and PS's one row folded into PS11's sentence on `settlementStrategy.js` |
| B074 | 130 | §1 | [CURED 2026-10-18 (fp-final r3) — MN-V6 · A.3: THE PASSAGE n | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B075 | 130 | §1 | [CURED 2026-10-20 (fp-final P5) — P5C-15 (WC-PS-64; RULINGS- | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| N075 | 130 | §1 | ↳ (1): the composer takes no belief selection — the selectio | FOLDED | §1 | nested in B075; disposed with its parent |
| B076 | 130 | §1 | [CURED 2026-10-18 (fp-final r3) — PS-r2-12 (the fail): the s | FOLDED | §1 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B077 | 130 | §1 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B078 | 130 | §1 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-7 (one compositio | FOLDED | §1 | a change note (one composition sentence, MN's; the destination's own land); PS12 states both |
| B079 | 132 | §1 | [CURED 2026-10-18 (fp-final r3) — RN-V6 · RULINGS-ROUND3 A.4 | FOLDED | §1 | a change note ("a court's fame moves" struck here, in §7.3 and §14); PS13 states that no court has fame |
| B080 | 132 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-17 (no RN regard bet | FOLDED | §1 | a change note (no RN regard between courts; RN's `passage` slot row; the corps' fame key); PS13 states all three |
| B081 | 134 | §1 | [CURED 2026-10-20 (fp-final P5) — RULINGS-P5 D.2 (PS14's sta | FOLDED | §1 | a cite re-pointing note; PS14's cite of PL's ninth class restated in place (PL §2's `PRECEDENCE_CLASSES`, §3.2's row) |
| B082 | 134 | §1 | [REFINED 2026-10-20 (fp-final P5) — P5C-3 is PL's and is cur | FOLDED | §1 | PL's book seam (PL-3's `decisionClass` argument at `passageAnswerOf`'s call site, PL §3.4) folded into PS14's cite |
| B083 | 134 | §1 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-10] | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B084 | 134 | §1 | [CURED 2026-10-18 (fp-final r3) — PL-V5 · RULINGS-ROUND3 A.6 | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B085 | 134 | §1 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.1 · A.2 · | FOLDED | §1 | its three rules (the call supplies a default, never a fact; the share in the threshold; the outcome PL's rule, cited) folded as PS14's paragraph; its nested r5 stamp folded with it |
| N085 | 134 | §1 | [CURED 2026-10-19 (fp-final r5) — RU-PL-2]. (2) THE SHARE IS | FOLDED | §1 | nested in B085; disposed with its parent |
| B086 | 134 | §1 | [CURED 2026-10-19 (fp-final r5) — RU-PL-1 · SEAMS-r4-2 · D-P | FOLDED | §1 | a change note (the withdrawn `kept` arm "passed through → `protection_failed`" restated by the earlier text); PS14 cites PL §4.3 (3) and never restates it |
| B087 | 134 | §1 | [CURED 2026-10-18 (fp-final r3) — PL-V4 (PS's side) · A.5] | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B088 | 138 | §1 | [CURED 2026-10-18 (fp-final r2) — PS-r2-8 · PS-r2-14] | FOLDED | §1 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B089 | 147 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-3 (BLOCKING), as RUL | FOLDED | §2 | a change note (the unit key is the deployment id, never `departTick`; screen holds keep it; two kinds added); §2.1 states the key |
| B090 | 152 | §2 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §G.2 · §E.4 · 'c | FOLDED | §2 | the wing rule (no fifth mover kind; passes under its army's key; the hold helper takes a wing record) folded into §2.1's wing line; its march-row bank clause dropped as superseded by B091 (the bank lives on MG's wing row) |
| B091 | 153 | §2 | [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-1 / RULINGS-P6 §I. | FOLDED | §2 | its ruling (ONE home for a wing's bank — MG's wing row; no march row for a wing; MG's stepper's two PS callees; the degraded arm) folded into §2.1's wing line, which supersedes B090's march-row clause (the fold's OD-FC-105 agrees) |
| B092 | 154 | §2 | [CURED 2026-10-18 (fp-final r3) — PL-V4, PS's side; PL's com | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B093 | 155 | §2 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B094 | 158 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-12 · PS-r2-13] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B095 | 158 | §2 | [CURED 2026-10-18 (fp-final r3) — PS-r2-13: the table's clos | FOLDED | §2 | a change note (the table covers every value the read returns); §2.2 states it |
| B096 | 158 | §2 | [CURED 2026-10-19 (fp-final r5) — PS-X2 · RULINGS-ROUND5 B.1 | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B097 | 165 | §2 | [CURED 2026-10-18 (fp-final r3) — PS-r2-13] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B098 | 167 | §2 | [CURED 2026-10-19 (fp-final r5) — PS-X2 · B.14] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B099 | 169 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-12 (the occupation r | FOLDED | §2 | its surviving fact (no edge reads `client`; the `normalizeRelationshipEdge` cite) folded as the line under §2.2's table; the rest a change note (the occupation row, the `unknown` row) |
| B100 | 178 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-11: "subtracted from | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B101 | 182 | §2 | [CURED 2026-10-18 (fp-final r3)] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B102 | 182 | §2 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.1] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B103 | 186 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-11: "B's deployment  | FOLDED | §2 | its surviving content (no deployment points at an incursion — the `hostilePairFor` cite; one contest per crossing; "on the road at the border") folded as the line under §2.3's table |
| B104 | 188 | §2 | [REFINED 2026-10-18 (fp-final) — the brief's 'contested' is  | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B105 | 191 | §2 | [REFINED 2026-10-18 (fp-final) — the brief's three causes ke | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B106 | 194 | §2 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor (c): th | FOLDED | §2 | a change note (the two spellings named one read); §2.5 states the one signature |
| B107 | 194 | §2 | [CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.1, PS's s | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B108 | 194 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-20, the walker's law | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B109 | 194 | §2 | [REFINED 2026-10-18 (fp-final) — no unit-size band exists on | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B110 | 197 | §2 | [CURED 2026-10-20 (fp-final P5) — P5C-15 (WC-PS-48; RULINGS- | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B111 | 197 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-10, under the owner' | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B112 | 197 | §2 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minor 4: "at  | FOLDED | §2 | a change note ("at the gate" → "at the border"; the cap against the field force); §2.6 states both |
| B113 | 200 | §2 | [CURED 2026-10-20 (fp-final P5) — P5C-13 (WC-PS-50; RULINGS- | FOLDED | §2 | a change note (declared and never called); §2.7 states the one call |
| B114 | 201 | §2 | [CURED 2026-10-20 (fp-final P5) — P5C-13 (WC-PS-51; RULINGS- | FOLDED | §2 | the ASK SET folded as §2.7's line in final form (`passageNodesOf` named only as a never-statement) |
| B115 | 202 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 · HOST-r2-2] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B116 | 203 | §2 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B117 | 203 | §2 | [CURED 2026-10-20 (fp-final P5) — the ROUTED-UNAPPLIED PS ha | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B118 | 204 | §2 | [CURED 2026-10-20 (fp-final P5) — the ROUTED-UNAPPLIED PS ha | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B119 | 204 | §2 | [CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B120 | 204 | §2 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B121 | 204 | §2 | [CURED 2026-10-19 (fp-final r5) — PS-X1 · B.13: the round-4  | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B122 | 206 | §2 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.7 · SEAMS | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B123 | 206 | §2 | [CURED 2026-10-19 (fp-final r5) — minor (a) · D-PL-r4 route  | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B124 | 212 | §2 | [CURED 2026-10-20 (fp-final P5) — C.1 (P5C-1, WC-PS-20): the | FOLDED | §2 | a change note (the term had no signature); §2.7 states it |
| B125 | 215 | §2 | [CURED 2026-10-20 (fp-final P5) — P5C-15 (WC-PS-64)] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B126 | 216 | §2 | [CURED 2026-10-18 (fp-final r3) — PS-r2-15 · A.2] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B127 | 217 | §2 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §A.6 · MG-r1-5 · | FOLDED | §2 | the second helper `replanFromNode` folded as §2.7's line; its OPEN question (does PS's own step-6 reroute take condition (c)?) stated as RULED by the fold's OD-FC-104 (NO); the naval bound stated as the fold's deferral to MG-7's unit |
| B128 | 218 | §2 | [CURED 2026-10-18 (fp-final r3) — A.1, PS's side] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B129 | 218 | §2 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor (c): ON | FOLDED | §2 | a change note (one signature); §2.7 states it |
| B130 | 219 | §2 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.1 · PS-W1 | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B131 | 219 | §2 | [CURED 2026-10-19 (fp-final r5) — minor (i)] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B132 | 220 | §2 | [CURED 2026-10-18 (fp-final r3) — PS-V2] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B133 | 221 | §2 | [CURED 2026-10-20 (fp-final P5) — P5C-4 (WC-PS-37 · WC-PR-57 | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B134 | 222 | §2 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-39; RULINGS- | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B135 | 223 | §2 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-29)] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B136 | 226 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-23] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B137 | 230 | §2 | [CURED 2026-10-19 (fp-final r5) — minor (f)] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B138 | 230 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-10] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B139 | 230 | §2 | [CURED 2026-10-18 (fp-final r4) — A.7: 'banner' — a same-kin | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B140 | 231 | §2 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-39): 'guardL | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B141 | 231 | §2 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.2 · R-PL: | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B142 | 232 | §2 | [CURED 2026-10-18 (fp-final r3) — PS-V1: one shared cap let  | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B143 | 233 | §2 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2): 'tra | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B144 | 233 | §2 | [CURED 2026-10-18 (fp-final r3) — PS-V2 · A.2: the row exist | FOLDED | §2 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B145 | 235 | §2 | [CURED 2026-10-18 (fp-final r2) — PS-r2-18 (the archive's ke | FOLDED | §2 | a change note between the table and the state words (the archive's one meaning; the `marches` map; `crossing`, `place`; one card per territory); the table states all of them; the line removed |
| B146 | 237 | §2 | [CURED 2026-10-18 (fp-final r4) — minor (a)] | FOLDED | §2 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B147 | 239 | §2 | [CURED 2026-10-19 (fp-final r5) — minor (e) · minor (f)] | FOLDED | §2 | a stamp inside the persisted-shapes line, which is restated in final form (the per-round additions named as the final fields) |
| B148 | 239 | §2 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-39)] | FOLDED | §2 | a stamp inside the persisted-shapes line (`guardLoss?` named as a final field) |
| B149 | 249 | §3 | [CURED 2026-10-19 (fp-final r5) — PS-X2 · B.14] | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B150 | 249 | §3 | [CURED 2026-10-18 (fp-final r2) — PS-r2-12 · PS-r2-13] | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B151 | 250 | §3 | [CURED 2026-10-18 (fp-final r3) — A.1] | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B152 | 251 | §3 | [CURED 2026-10-18 (fp-final r2) — PS-r2-1] | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B153 | 251 | §3 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minors 2 and  | FOLDED | §3 | a change note (the struck stranger-for-tolerance clause; the clamp); the row states the clamp |
| B154 | 254 | §3 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B155 | 255 | §3 | [CURED 2026-10-19 (fp-final r5) — minor (a)] | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B156 | 255 | §3 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.7 · SEAMS | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B157 | 255 | §3 | [CURED 2026-10-19 (fp-final r5) — B.14] | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B158 | 256 | §3 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B159 | 257 | §3 | [CURED 2026-10-18 (fp-final r2) — PS-r2-18] | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B160 | 260 | §3 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-32)] | FOLDED | §3 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B161 | 270 | §4 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor (d): "i | FOLDED | §4 | a change note (the statement miscounted); the sentence states the one `resolveFieldBattle` statement |
| B162 | 270 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minor 5 · PS- | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B163 | 272 | §4 | [CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.6 · SEAMS | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B164 | 272 | §4 | [CURED 2026-10-18 (fp-final r4) — R-ST-a · SEAMS-r3-7 · RULI | FOLDED | §4 | a change note (the withdrawn quotation); registrant (2) states the FREEZE mode |
| B165 | 272 | §4 | [CURED 2026-10-18 (fp-final r2) — PS-r2-15 (ST's fort regist | FOLDED | §4 | a change note (ST's fort registrant; PR's screen registrant; the one cap); the order states them |
| B166 | 272 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-r2-15 (the fail) · RULI | FOLDED | §4 | a change note (the order written once; PR's own order and arithmetic routed away); the order states it |
| B167 | 274 | §4 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §D.4 · 'cure/D-M | FOLDED | §4 | the five-registrant order folded into THE ORDER OF REGISTRANTS above (MG's leaf (4), Arc A (5)) and PS9/PS11; its writer/caller rule kept as this paragraph; its "reads FIVE / FIFTH" directive applied here and in PS9, PS11 (seat 2 applies it at §11 PS-0's car-0, §14's WC row, OD-PS-35 and the A.13 row) |
| B168 | 276 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minor 5] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B169 | 278 | §4 | [CURED 2026-10-18 (fp-final r2) — PS-r2-4 (BLOCKING; the nex | FOLDED | §4 | a change note (the next-node rule left territories unread; the replay `cure/D-PS-r2-probe/sweep.out` judges every node; the read fired early); step 2's sweep states the cure |
| B170 | 279 | §4 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B171 | 280 | §4 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor (a): th | FOLDED | §4 | a change note (the state had no name); step 2 names `in_hearing` |
| B172 | 280 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-V3: an 'awaiting' unit  | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B173 | 280 | §4 | [CURED 2026-10-20 (fp-final P5) — P5C-13 (WC-PS-50)] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B174 | 280 | §4 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B175 | 284 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-V3] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B176 | 286 | §4 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.2 · R-PL] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B177 | 286 | §4 | [CURED 2026-10-19 (fp-final r5) — RU-PL-2 (ROUTED-UNAPPLIED, | FOLDED | §4 | a change note (each first sight had its own default); the enemy branch states the ONE mirrored line |
| B178 | 288 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-r2-15 · A.2 · PS-V3] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B179 | 290 | §4 | [CURED 2026-10-19 (fp-final r5) — minor (e): the exit had no | FOLDED | §4 | a change note (the exit had no named row); step 5 names it |
| B180 | 290 | §4 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-39)] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B181 | 291 | §4 | [CURED 2026-10-19 (fp-final r5) — minor 1: "cheapest-in-seas | FOLDED | §4 | a change note ("cheapest-in-season" vs the effective cost); step 6 states the effective cost |
| B182 | 291 | §4 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor 1 · RUL | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B183 | 291 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-V2] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B184 | 291 | §4 | [REFINED 2026-10-18 (fp-final r3) — a reroute cannot avoid t | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B185 | 293 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-V2 (MAJOR), as RULED by | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B186 | 293 | §4 | [REFINED 2026-10-18 (fp-final r3) — the ruling's ground rule | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B187 | 295 | §4 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §A.6 · §C PS · M | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B188 | 297 | §4 | [REFINED 2026-10-18 (fp-final) — not in the brief; a routing | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B189 | 297 | §4 | [REFINED 2026-10-18 (fp-final r2) — measured: a retreat reco | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B190 | 301 | §4 | [CURED 2026-10-20 (fp-final P5) — P5C-13 (WC-PS-51)] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B191 | 301 | §4 | [CURED 2026-10-18 (fp-final r2) — PS-r2-7: the round-1 envoy | FOLDED | §4 | its honest statement (the envoy buys a better answer, and time only where the stranger is far along the path; the courier-speed cite) folded as the step's closing sentence; the earlier envoy timing named only in the text of record |
| B192 | 301 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-V3: and where a bound r | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B193 | 307 | §4 | [REFINED 2026-10-18 (fp-final) — reuse of the landed reserve | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B194 | 308 | §4 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §C PS (OP) · OP  | FOLDED | §4 | its content folded into the sentence or cell it amended (ids and ruling tags removed) |
| B195 | 310 | §4 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B196 | 311 | §4 | [CURED 2026-10-18 (fp-final r2) — PS-r2-19] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B197 | 311 | §4 | [CURED 2026-10-18 (fp-final r4) — PS-W1 (MAJOR) · RULINGS-RO | FOLDED | §4 | its surviving rule (the default re-derived when the DM changes the liege line) folded into the answer's enemy clause; the earlier field-force-alone threshold named only in the text of record |
| B198 | 315 | §4 | [CURED 2026-10-18 (fp-final r2) — HOST-r2-16] | FOLDED | §4 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B199 | 315 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minor 2: "a s | FOLDED | §4 | a change note (the struck stranger-for-tolerance clause); the composition states that a stranger carries its `leave_by` |
| B200 | 315 | §4 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minor 3: stat | FOLDED | §4 | a change note (the clamp stated); the composition states it |
| B201 | 317 | §4 | [CURED 2026-10-18 (fp-final r2) — PS-r2-1 (BLOCKING), RULED  | FOLDED | §4 | a change note (the ruling that war raises an ally's tolerance; the withdrawn round-1 collapse); §4.4 states the ruling |
| B202 | 325 | §5 | [CURED 2026-10-20 (fp-final P5) — P5C-15 (WC-PS-18; RULINGS- | FOLDED | §5 | its read class (the PUBLIC record; a kept-secret fort only through a belief read ST names) folded into the sentence on the held fort (ids and ruling tags removed) |
| B203 | 325 | §5 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 · PS-r2-15 · RULIN | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B204 | 325 | §5 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 B (P7's MIN | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B205 | 325 | §5 | [CURED 2026-10-19 (fp-final r5) — minor 1: "seasonal cost" → | FOLDED | §5 | a change note ("seasonal cost" → the effective cost); the sentence states the effective cost; its probe receipt kept beside it |
| B206 | 325 | §5 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B207 | 325 | §5 | [CURED 2026-10-19 (fp-final r5) — B.4] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B208 | 325 | §5 | [CURED 2026-10-18 (fp-final r2) — PS-r2-6] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B209 | 325 | §5 | [CURED 2026-10-20 (fp-final P5) — C.1 (P5C-1, WC-PS-20; RULI | FOLDED | §5 | the chooser car's owner (WAR CIRCULATION's `WC-car-0`, cut before EC-17) and PS's one row `passageChooserTermOf` folded into the sentence on the DECLARATION (ids removed) |
| B210 | 325 | §5 | [REFINED 2026-10-18 (fp-final) — the brief named "'warDeploy | FOLDED | §5 | a refinement note (the brief named `warDeployment`'s route choice); its measurement folded as the paragraph's closing sentence ("never in `warDeployment`") |
| B211 | 330 | §5 | [CURED 2026-10-18 (fp-final r2) — PS-r2-22 (the symbol's mod | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B212 | 332 | §5 | [CURED 2026-10-19 (fp-final r5) — minor 1] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B213 | 332 | §5 | [CURED 2026-10-18 (fp-final r2) — PS-r2-6 · PS-r2-22] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B214 | 332 | §5 | [CURED 2026-10-18 (fp-final r4) — minor 1] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B215 | 335 | §5 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-81; RULINGS- | FOLDED | §5 | the closed recall register (`CLOSE_ROADS`, thirteen → fifteen), ⭐ the owner's row VISIBLE (OD-PS-53), W-MEM's confirmation and the fold §5 row folded into road 7's sentence (ids removed) |
| B216 | 335 | §5 | [CURED 2026-10-18 (fp-final r3) — minor 5's measured seam] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B217 | 338 | §5 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor 1 · RUL | FOLDED | §5 | a change note (the earlier read returned one base-cheapest path); the paragraph states the candidates; its executed receipt kept as the reason |
| B218 | 338 | §5 | [CURED 2026-10-19 (fp-final r5) — minor 1: the minimand name | FOLDED | §5 | a change note (the minimand named); the sentence names `scoreRoute`'s `effectiveCost` |
| B219 | 338 | §5 | [CURED 2026-10-18 (fp-final r2) — PS-r2-6: the round-1 rerou | FOLDED | §5 | its surviving rules (a never-statement: arrival never recomputed through `armyMarchWeeks` over the cheapest route's clock; winter slows, never cuts; the climate band only through the one seasonal table) folded as the paragraph's closing sentence; the earlier reroute (no season, no sea graph, zero-week detours) and the struck "closed pass" named only in the text of record |
| B220 | 341 | §5 | [CURED 2026-10-18 (fp-final r3) — minor 4] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B221 | 341 | §5 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-21; RULINGS- | FOLDED | §5 | the WC INBOX row (WC-6's producer calls `passageAnswerOf`; PS the one writer; dark by absence) folded into the column arm's last sentence |
| B222 | 343 | §5 | [CURED 2026-10-18 (fp-final r2) — PS-r2-16 · SEAMS-r2-6] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B223 | 344 | §5 | [CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2 ("PR's  | FOLDED | §5 | a change note (PR's `patrol` token struck from both access arrays); the sentence states the holder's knowledge read, and §5.6 names the struck token |
| B224 | 344 | §5 | [CURED 2026-10-19 (fp-final r5) — minor (g)] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B225 | 345 | §5 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.7 · SEAMS | FOLDED | §5 | a change note (THE BANNER's jurisdiction half; the earlier sentence applied the ally's size tolerance at every hold); the paragraph states the three holds |
| B226 | 345 | §5 | [CURED 2026-10-19 (fp-final r5) — minor (a) · D-PL-r4 route  | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B227 | 345 | §5 | [CURED 2026-10-19 (fp-final r5) — PS-X2 · RULINGS-ROUND5 B.1 | FOLDED | §5 | a change note ("armies are untouched" struck); the paragraph's last sentences state the guarded ally rung for armies |
| B228 | 346 | §5 | [CURED 2026-10-18 (fp-final r4) — R-CH] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B229 | 346 | §5 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-24): the sam | FOLDED | §5 | WC-10's half of the WC INBOX row folded as the corps arm's closing sentence |
| B230 | 348 | §5 | [CURED 2026-10-19 (fp-final r5) — BD-r4-3 · RULINGS-ROUND5 B | FOLDED | §5 | ruling and finding ids on the heading (ONE NETWORK, ONE KNOWN SET, ONE PRICE, the junction key); the section states each |
| B231 | 348 | §5 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2): "the | FOLDED | §5 | THE BODIES' route to THE PASSAGE (with the owner's words on hidden roads, verbatim) moved off the heading and folded as the section's opening sentence |
| B232 | 349 | §5 | [CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2 · BD-r5 | FOLDED | §5 | its surviving facts (one edge per pair per mode; PS keeps no rung list) folded beside "THE BODIES and PS cite it"; the earlier reading of the ways as the road ladder's lowest rungs named only in the text of record |
| B233 | 349 | §5 | [CURED 2026-10-20 (fp-final P5) — the ROUTED-UNAPPLIED PS ha | FOLDED | §5 | BD §5.2 (ii)'s ruling quoted and P39 cited beside the bypass sentence; the withdrawn "until then a unit takes no bypass" named only in the text of record |
| B234 | 349 | §5 | [CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2 · BD-r5 | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B235 | 349 | §5 | [STOP SEAMS-r5-2-scope: the widening's SCOPE is unruled — th | FOLDED | §5 | a STOP that was RULED before `1beabdc85` (the program's round-6 rulings §D and the fold's §3.3.18: PEACE AND WAR, the STOP's own proposal); the ruled scope stated in place, the fold row cited — no PS-C STOP |
| B236 | 349 | §5 | [CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2: PS's o | FOLDED | §5 | a change note (PS's open question on the way's identity answered by the MODE `way`); the paragraph states it |
| B237 | 351 | §5 | [REFINED 2026-10-18 (fp-final r4) — the route names a small  | FOLDED | §5 | a refinement (the MOVER must know the trail too) folded into WHERE's sentence |
| B238 | 352 | §5 | [CURED 2026-10-19 (fp-final r5) — B.4 · L-BD 11i (cite)] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B239 | 352 | §5 | [CURED 2026-10-20 (fp-final P5) — RULINGS-P5 D.2 (§5.6 cites | FOLDED | §5 | the three wartime readers (WC §1.1.5, WY E1, GENERALS G2) folded as WHEN's closing sentences (their volumes' bracket labels removed; "WHO below" → "WHO above", where WHO stands) |
| B240 | 352 | §5 | [REFINED 2026-10-19 (fp-final r5) — a UNIT's way is chosen b | FOLDED | §5 | a refinement (a unit's way by the deterministic re-score, never a body's roll; vetoable) folded as WHEN's last sentence |
| B241 | 354 | §5 | [CURED 2026-10-19 (fp-final r5) — PS-X1: the round-4 test re | FOLDED | §5 | a change note (the earlier test read the stored flag alone); its surviving never-statement folded beside the union read |
| B242 | 354 | §5 | [CURED 2026-10-19 (fp-final r5)] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B243 | 356 | §5 | [CURED 2026-10-19 (fp-final r5)] | FOLDED | §5 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B244 | 373 | §6 | [CURED 2026-10-18 (fp-final r2) — PS-r2-14] | FOLDED | §6 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B245 | 373 | §6 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-29; RULINGS- | FOLDED | §6 | the closed register's measurement (both lists closed, pinned at six; no producer scored `passage`) folded as the reason the trigger is a declared change |
| B246 | 373 | §6 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-30)] | FOLDED | §6 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B247 | 373 | §6 | [REFINED 2026-10-18 (fp-final) — the brief had GRAMMAR's len | FOLDED | §6 | a refinement (the one-off is the permit, the lens drafts the standing right; the Herald never says "right of passage") folded as two sentences; its nested P5 stamp (the cite of `termLabel`, never `humanTermType`) folded with it |
| N247 | 373 | §6 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-30)]).] | FOLDED | §6 | nested in B247; disposed with its parent |
| B248 | 375 | §6 | [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b SEAMS-r2-2 | FOLDED | §6 | the ruling's rule (a patrol stops an envoy only as a road hearing; never `envoy_intercepted`/`envoy_held`) moved off the heading and folded as a sentence before the defaults; its "holding by a patrol waits on ES-2b" superseded by B252 (a patrol never holds an envoy) |
| B249 | 375 | §6 | [OPENED 2026-10-20 by delegation (P5 A.2); the wave order st | FOLDED | §6 | the opening of ES-2b by delegation (no longer the owner's slot; the custody wave admits only the shapes as written) folded into the paragraph's ES-2b sentence (the date to §16) |
| B250 | 376 | §6 | [CURED 2026-10-20 (fp-final P5) — P5W-2's PS half (RULINGS-P | FOLDED | §6 | a change note (the old "holding an envoy … waits on ES-2b, the owner's slot" re-worded); the paragraph states the custody road |
| B251 | 376 | §6 | [OPENED 2026-10-20 by delegation (P5 A.2); the wave order st | FOLDED | §6 | a duplicate opening note (as B249); folded with it |
| B252 | 376 | §6 | [REFINED 2026-10-20 (fp-final P5) — the envoy named OUTSIDE  | FOLDED | §6 | a refinement (the envoy named OUTSIDE the opened shapes) folded as the paragraph's reason; the misreading it guarded against named only in the text of record |
| N252 | 376 | §6 | ↳ P5 ("nothing is widened beyond the shapes as written"); ve | FOLDED | §6 | nested in B252; disposed with its parent |
| B253 | 378 | §6 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §A.3 · §C PS · O | FOLDED | §6 | the named capability of S-e (THE OPPORTUNITY's `detourEnvoyErrand`, its `delay` contract) kept as its own paragraph (ruling tags removed) |
| B254 | 385 | §7 | [CURED 2026-10-20 (fp-final P5) — P5C-15 (WC-PS-48)] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B255 | 385 | §7 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-32)] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B256 | 385 | §7 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-13 · SEAMS-r2-6] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B257 | 388 | §7 | [CURED 2026-10-18 (fp-final r2) — PS-r2-9 (no second meaning | FOLDED | §7 | its surviving rules (no second meaning of `treaty_breach`, no third breach type — stated above; foraging, halting and the mid-crossing size cap are no breaches) folded as the paragraph's closing sentence |
| B258 | 388 | §7 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minor 4: the  | FOLDED | §7 | a change note (the size cap read at the BORDER, the word rule); folded into B257's sentence |
| B259 | 391 | §7 | [CURED 2026-10-18 (fp-final r3) — RN-V6 · A.4: "a court's FA | FOLDED | §7 | a change note ("a court's FAME" struck); the sentence states that no court has fame |
| B260 | 391 | §7 | [CURED 2026-10-18 (fp-final r2) — PS-r2-17 · SEAMS-r2-13.] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B261 | 394 | §7 | [CURED 2026-10-20 (fp-final P5) — P5C-4 (WC-PS-37 · WC-PR-57 | FOLDED | §7 | the second producer's case (PR §9.1 (a) quoted) folded beside the heading words; the old pin's wording named only in the text of record |
| B262 | 397 | §7 | [CURED 2026-10-18 (fp-final r4) — PS-W1 · A.1] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B263 | 397 | §7 | [CURED 2026-10-18 (fp-final r2) — PS-r2-11: B's home defence | FOLDED | §7 | the measured reason for ONE contest per crossing (the derived home defence; losses written back to deployments only) folded after the heading words; the old weekly `barred` named only in the text of record |
| B264 | 397 | §7 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor (e)] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B265 | 397 | §7 | [CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.4 · SEAMS | FOLDED | §7 | the ruling (the answer taken ONCE at first sight) stated by the sentence; the refuted weekly re-ask kept as a never-statement; its lane-log path in PS-allow.txt |
| B266 | 397 | §7 | [CURED 2026-10-19 (fp-final r5) — RU-PL-2] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B267 | 397 | §7 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.2 · R-PL  | FOLDED | §7 | its reason (a row minted before the DM's pause) folded beside the mint-at-resolution rule |
| B268 | 397 | §7 | [CURED 2026-10-18 (fp-final r4) — PL-V5 (= A.6, the §E.2 FAI | FOLDED | §7 | a change note (the struck "polity before passage inside the week"); the paragraph states that the polity stage runs AFTER army transit |
| B269 | 397 | §7 | [CURED 2026-10-19 (fp-final r5) — RU-PL-1 · SEAMS-r4-2 · D-P | FOLDED | §7 | a change note (the withdrawn `kept` arm restated by an earlier parenthetical); the paragraph cites PL §4.3 (3) and never restates it |
| B270 | 397 | §7 | [CURED 2026-10-18 (fp-final r3) — PL-V5 · RULINGS-ROUND3 A.6 | FOLDED | §7 | the joint row (PL the record, PS the defender term; P14) folded after the walls clause |
| B271 | 397 | §7 | [CURED 2026-10-18 (fp-final r3) — A.1, PS's side: the round- | FOLDED | §7 | a change note (the earlier defender was B's `homeDefense`, which the keep joins); the paragraph states `homeDefense − siteDefense` |
| B272 | 397 | §7 | [CURED 2026-10-18 (fp-final r3) — PS-r2-verify minor 5] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B273 | 397 | §7 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-39; RULINGS- | FOLDED | §7 | the measured reason for the declared outcome channel folded beside it |
| B274 | 397 | §7 | [CURED 2026-10-18 (fp-final r3) — minor 5's measured seam] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B275 | 397 | §7 | [CURED 2026-10-18 (fp-final r3) — MN-V6 · A.3 · PS-r2-12] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B276 | 397 | §7 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-7 · RULINGS-ROUND | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B277 | 403 | §7 | [CURED 2026-10-18 (fp-final r3) — PL-V4, PS's side: the roun | FOLDED | §7 | a change note (the withdrawn "not priced … until PL registers its prefix"); the sentence states all four prefixes |
| B278 | 403 | §7 | [CURED 2026-10-18 (fp-final r3) — A.5] | FOLDED | §7 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B279 | 403 | §7 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-10 · RULINGS-ROUN | FOLDED | §7 | ruling and finding ids (PL's request door; harbouring priced, never a break); the section states both |
| B280 | 409 | §8 | [CURED 2026-10-18 (fp-final r2) — PS-r2-8 · RULINGS-ROUND2 C | FOLDED | §8 | the ruling (ONE verb, EC-6's, widened; PS mints none) folded as the section's opening paragraph; the withdrawn verb kept as a never-statement |
| B281 | 428 | §9 | [CURED 2026-10-18 (fp-final r3) — PS-V3] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B282 | 429 | §9 | [CURED 2026-10-18 (fp-final r3) — PS-V3] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B283 | 429 | §9 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2) · A.7 | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B284 | 429 | §9 | [CURED 2026-10-18 (fp-final r4) — A.7] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B285 | 429 | §9 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B286 | 429 | §9 | [CURED 2026-10-19 (fp-final r5) — SEAMS-r4-16 · minor (c)] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B287 | 431 | §9 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.2 · R-PL] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B288 | 431 | §9 | [CURED 2026-10-19 (fp-final r5) — RU-PL-2 · minor (d)] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B289 | 431 | §9 | [CURED 2026-10-18 (fp-final r4) — PS-W1 · A.1] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B290 | 431 | §9 | [CURED 2026-10-19 (fp-final r5) — RU-PL-2] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B291 | 433 | §9 | [CURED 2026-10-18 (fp-final r2) — PS-r2-14 (the welcome and  | FOLDED | §9 | a change-note paragraph (the welcome and the treaty road are cards; the harbour and circle WHERE; the seat-pair key; one threshold; one contest; THE ENVOY ARM's line); the table states each, and requirement 24's verbatim words are folded into "Which answers are hearings" |
| B292 | 434 | §9 | [REFINED 2026-10-18 (fp-final) — the fold's WHERE table offe | FOLDED | §9 | a refinement (why the land WHERE is `road (a, b)` until H16) folded as a paragraph under the table |
| B293 | 434 | §9 | [REFINED 2026-10-18 (fp-final) — the brief's 'incursion' is  | FOLDED | §9 | a refinement (`incursion` landed; the kind `armed_incursion`; `barred` for `contested`) folded as the same paragraph's second sentence |
| B294 | 436 | §9 | [CURED 2026-10-18 (fp-final r2) — PS-r2-14: the round-1 "not | FOLDED | §9 | a change note (the withdrawn "not hearings", OD-PS-21); the paragraph states that every answer is a hearing |
| B295 | 438 | §9 | [CURED 2026-10-18 (fp-final r4) — A.2 · R-PL] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B296 | 438 | §9 | [CURED 2026-10-19 (fp-final r5) — minor (d)] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B297 | 438 | §9 | [CURED 2026-10-18 (fp-final r3) — PS-V3] | FOLDED | §9 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B298 | 446 | §10 | [CURED 2026-10-18 (fp-final r4) — A.7 · L-BD route to PS (2) | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B299 | 446 | §10 | [CURED 2026-10-19 (fp-final r5) — B.4] | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B300 | 446 | §10 | [CURED 2026-10-18 (fp-final r3) — MN-V6 · A.3 · A.5] | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B301 | 446 | §10 | [CURED 2026-10-18 (fp-final r2)] | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B302 | 446 | §10 | [CURED 2026-10-18 (fp-final r3)] | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B303 | 446 | §10 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B304 | 446 | §10 | [CURED 2026-10-19 (fp-final r5)] | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B305 | 446 | §10 | [CURED 2026-10-20 (fp-final P5) — the P5 pins] | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B306 | 447 | §10 | [CURED 2026-10-20 (fp-final P5) — P5C-18] | FOLDED | §10 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B307 | 448 | §10 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §B.2 · MG-r1-4)  | FOLDED | §10 | the ↳ row folded as the `movementGrammarEnabled` row (the flag named from the bracket); its clause on `wingsEnabled` and the march row DROPPED as superseded by B308 |
| B308 | 449 | §10 | [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-1 / RULINGS-P6 §I. | FOLDED | §10 | the ↳ row folded as the `wingsEnabled` row; its SUPERSEDES clause applied (the row above no longer carries the march-row clause), the wording "(§2.1's lane-C bracket)" → "§2.1's wing line" |
| B309 | 458 | §11 | [CURED 2026-10-18 (fp-final r3) — A.2 · PS-V2 · minor 5] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B310 | 458 | §11 | [CURED 2026-10-18 (fp-final r2) — PS-r2-15 · RULINGS-ROUND2b | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B311 | 459 | §11 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §D.4 · 'cure/D-M | FOLDED | §11 | the five-slot car (MG's leaf fourth, Arc A fifth — B167's FIVE / FIFTH applied here), the second helper `replanFromNode`, the held set and the returned writes folded into PS-0's car-0 bullet; MG-0's car-0 and its ⛔ S-MG-a kept beside it |
| B312 | 460 | §11 | [CURED 2026-10-20 (fp-final P5) — P5C-13: 'passageNodesOf' s | FOLDED | §11 | a change note (`passageNodesOf` struck here and in the EDITOR's predicates); the list names `gateKeeperOf` and the predicates name `passageCrossingOf` |
| B313 | 460 | §11 | [CURED 2026-10-18 (fp-final r4) — A.7 · A.1] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B314 | 460 | §11 | [CURED 2026-10-18 (fp-final r3) — PS-r2-13 · A.1 · PS-V1] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B315 | 460 | §11 | [CURED 2026-10-18 (fp-final r2) — PS-r2-8] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B316 | 468 | §11 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B317 | 468 | §11 | [CURED 2026-10-19 (fp-final r5) — minor 1] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B318 | 468 | §11 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-30)] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B319 | 468 | §11 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-29)] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B320 | 471 | §11 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-32; RULINGS- | FOLDED | §11 | HB's row (asked through the fold's HB INBOX under the landed class `terms_offered`; every PS habit lean dark until it lands) folded beside the fork rows |
| B321 | 484 | §11 | [CURED 2026-10-20 (fp-final P5) — P5C-4] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B322 | 484 | §11 | [CURED 2026-10-18 (fp-final r3) — MN-V6 · A.3 · PS-r2-12] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B323 | 484 | §11 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-81)] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B324 | 484 | §11 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B325 | 484 | §11 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-39)] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B326 | 485 | §11 | [CURED 2026-10-18 (fp-final r2) — PS-r2-24] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B327 | 492 | §11 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B328 | 492 | §11 | [CURED 2026-10-19 (fp-final r5) — B.4 · B.13 · PS-X1] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B329 | 492 | §11 | [CURED 2026-10-19 (fp-final r5) — BD-r4-3 · B.4] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B330 | 492 | §11 | [CURED 2026-10-20 (fp-final P5) — C.1: the round-4 text "the | FOLDED | §11 | a change note (the struck "the first chain to land owns the car"); the sentence names WAR CIRCULATION's owned car |
| B331 | 493 | §11 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B332 | 496 | §11 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §11 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B333 | 496 | §11 | [CURED 2026-10-18 (fp-final r2) — HOST-r2-14: the round-1 li | FOLDED | §11 | the measurement (alignment passed as `null`; `riskToleranceFromAlignment` is fidelity, not boldness; the host's known defects) folded after the Alignment bullet; the struck line kept as a never-statement |
| B334 | 516 | §12 | [CURED 2026-10-19 (fp-final r5)] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B335 | 518 | §12 | [CURED 2026-10-18 (fp-final r4) — A.7] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B336 | 526 | §12 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.2 · R-PL] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B337 | 526 | §12 | [CURED 2026-10-19 (fp-final r5) — RU-PL-2 · minor (d)] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B338 | 527 | §12 | [CURED 2026-10-18 (fp-final r4) — A.2 · A.1 · minor (a)] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B339 | 530 | §12 | [CURED 2026-10-18 (fp-final r4) — A.2] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B340 | 531 | §12 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B341 | 533 | §12 | [CURED 2026-10-18 (fp-final r4) — A.2] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B342 | 534 | §12 | [CURED 2026-10-19 (fp-final r5) — minor (e)] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B343 | 536 | §12 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-39)] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B344 | 544 | §12 | [CURED 2026-10-18 (fp-final r3) — PS-V1] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B345 | 547 | §12 | [CURED 2026-10-18 (fp-final r3) — PS-V1] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B346 | 551 | §12 | [CURED 2026-10-18 (fp-final r2) — PS-r2-18: the round-1 "und | FOLDED | §12 | a change note (the earlier "under the MOVER's key" reversed the key); the veil row states the directed key `holderId<moverId` |
| B347 | 554 | §12 | [CURED 2026-10-18 (fp-final r2) — PS-r2-4 · PS-r2-5 · PS-r2- | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B348 | 558 | §12 | [CURED 2026-10-18 (fp-final r3) — A.2 · PS-V2] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B349 | 558 | §12 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B350 | 559 | §12 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B351 | 563 | §12 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B352 | 565 | §12 | [CURED 2026-10-18 (fp-final r3) — PS-V2's dark-after-lit pat | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B353 | 565 | §12 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §12 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B354 | 579 | §13 | [CURED 2026-10-18 (fp-final r2) — PS-r2-14] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B355 | 580 | §13 | [CURED 2026-10-18 (fp-final r3) — minor 4, the word rule] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B356 | 581 | §13 | [CURED 2026-10-18 (fp-final r2) — PS-r2-7] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B357 | 581 | §13 | [CURED 2026-10-18 (fp-final r3) — PS-V3] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B358 | 582 | §13 | [CURED 2026-10-18 (fp-final r2) — PS-r2-3 · PS-r2-5] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B359 | 583 | §13 | [CURED 2026-10-19 (fp-final r5) — minor 1 (the r4 verifier's | FOLDED | §13 | its executed reason (a seasonal clause reds on a correct world) folded beside the effective clauses, its receipt kept; the source wording to correct named only in the text of record |
| B360 | 583 | §13 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor 1 (EXEC | FOLDED | §13 | the struck same-season clause kept as a never-statement with its executed reason and receipt |
| B361 | 583 | §13 | [CURED 2026-10-18 (fp-final r2) — PS-r2-6 · PS-r2-22 · HOST- | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B362 | 589 | §13 | [CURED 2026-10-18 (fp-final r2) — PS-r2-1, RULED by RULINGS- | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B363 | 590 | §13 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-7 · RULINGS-ROUND | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B364 | 590 | §13 | [CURED 2026-10-18 (fp-final r3) — MN-V6 · A.3 · PL-V5 · A.6] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B365 | 590 | §13 | [CURED 2026-10-18 (fp-final r4) — PS-W1 · A.1 · A.2 · R-PL] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B366 | 590 | §13 | [CURED 2026-10-19 (fp-final r5) — RU-PL-1] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B367 | 591 | §13 | [CURED 2026-10-18 (fp-final r2) — PS-r2-15 · PS-r2-22 · RULI | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B368 | 591 | §13 | [CURED 2026-10-18 (fp-final r3) — PS-r2-15 · A.2 · PS-V3] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B369 | 593 | §13 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 · HOST-r2-17] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B370 | 596 | §13 | [CURED 2026-10-18 (fp-final r2) — PS-r2-14] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B371 | 597 | §13 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 · HOST-r2-2] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B372 | 600 | §13 | [CURED 2026-10-18 (fp-final r3) — PS-r2-12] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B373 | 601 | §13 | [CURED 2026-10-18 (fp-final r3) — PS-V1] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B374 | 602 | §13 | [CURED 2026-10-18 (fp-final r3) — A.1 · minor 5] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B375 | 606 | §13 | [CURED 2026-10-18 (fp-final r3) — PS-V2] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B376 | 607 | §13 | [CURED 2026-10-18 (fp-final r3) — PS-r2-13] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B377 | 608 | §13 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B378 | 608 | §13 | [CURED 2026-10-19 (fp-final r5) — PS-X1 (the round-4 premise | FOLDED | §13 | a change note (the earlier premise could not be met by the stored ledger alone; the one known set); the row states the office arm |
| B379 | 609 | §13 | [CURED 2026-10-19 (fp-final r5) — minor (g)] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B380 | 609 | §13 | [CURED 2026-10-19 (fp-final r5) — PS-X2 · B.14] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B381 | 609 | §13 | [CURED 2026-10-18 (fp-final r4) — A.7 · SEAMS-r3-6] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B382 | 610 | §13 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor (a)] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B383 | 610 | §13 | [CURED 2026-10-19 (fp-final r5) — minor (e)] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B384 | 611 | §13 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor (e)] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B385 | 612 | §13 | [CURED 2026-10-19 (fp-final r5) — PS-X2 · B.14] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B386 | 613 | §13 | [CURED 2026-10-19 (fp-final r5) — RU-PL-2 · minor (d)] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B387 | 614 | §13 | [CURED 2026-10-20 (fp-final P5) — P5C-4] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B388 | 615 | §13 | [CURED 2026-10-20 (fp-final P5) — the routed half] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B389 | 616 | §13 | [CURED 2026-10-20 (fp-final P5) — P5C-18] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B390 | 617 | §13 | [CURED 2026-10-20 (fp-final P5) — P5C-18] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B391 | 618 | §13 | [CURED 2026-10-20 (fp-final P5) — C.1] | FOLDED | §13 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B392 | 626 | §14 | [CURED 2026-10-18 (fp-final r3) — A.2] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B393 | 626 | §14 | [CURED 2026-10-18 (fp-final r2) — PS-r2-11 · PS-r2-15 · SEAM | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B394 | 626 | §14 | [CURED 2026-10-19 (fp-final r5) — B.4 (cite)] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B395 | 626 | §14 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-21 · WC-PS-2 | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B396 | 627 | §14 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §D.4)] | FOLDED | §14 | the ↳ WC row folded into the WC row (FIVE registrants, Arc A FIFTH after MG's leaf; `holdWingAtContact`; the losses' seam) — B167's FIVE / FIFTH applied to §14's WC row |
| B397 | 628 | §14 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-10 · PS-r2-17 · P | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B398 | 628 | §14 | [CURED 2026-10-18 (fp-final r3) — PL-V4 · PL-V5 · A.5 · A.6] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B399 | 628 | §14 | [CURED 2026-10-18 (fp-final r4) — A.1 · A.2 · A.7 · SEAMS-r3 | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B400 | 628 | §14 | [CURED 2026-10-19 (fp-final r5) — PS-X2 · RU-PL-1 · RU-PL-2  | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B401 | 629 | §14 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-29 · WC-PS-3 | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B402 | 630 | §14 | [CURED 2026-10-18 (fp-final r2) — PS-r2-8] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B403 | 631 | §14 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-7] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B404 | 631 | §14 | [CURED 2026-10-18 (fp-final r3) — MN-V6 · A.3 · PS-r2-12] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B405 | 631 | §14 | [CURED 2026-10-20 (fp-final P5) — P5C-15 (WC-PS-64); MN to c | FOLDED | §14 | a stamp with a coupling note (MN to confirm the row in its composition sentence); the MN row says MN §3.3 owns the composition sentence and should name the row |
| B406 | 632 | §14 | [CURED 2026-10-18 (fp-final r3) — minor 4] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B407 | 632 | §14 | [CURED 2026-10-18 (fp-final r3) — A.2 · A.1] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B408 | 632 | §14 | [CURED 2026-10-18 (fp-final r2) — PS-r2-15 · HOST-r2-3] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B409 | 632 | §14 | [CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 A.3 (cite)] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B410 | 632 | §14 | [RE-RULED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.6: "a  | FOLDED | §14 | the latest ruling on a body or a menace at the approach (the helper's FREEZE at its prior position; on a clockless record the withheld commit) folded into the ST row, replacing the superseded "holds by its own mover … never by the helper" (and the bullet's lead words, which said the helper holds a transit record only) |
| B411 | 633 | §14 | [CURED 2026-10-18 (fp-final r3) — PS-r2-15 · A.2] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B412 | 633 | §14 | [CURED 2026-10-18 (fp-final r2) — PS-r2-16 · SEAMS-r2-8 · SE | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B413 | 633 | §14 | [CURED 2026-10-19 (fp-final r5) — PS-X1 · minor (g)] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B414 | 633 | §14 | [CURED 2026-10-18 (fp-final r4) — A.7 · L-BD route to PS (2) | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B415 | 633 | §14 | [CURED 2026-10-20 (fp-final P5) — P5C-4] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B416 | 634 | §14 | [CURED 2026-10-18 (fp-final r3) — RN-V6 · A.4: "and a court' | FOLDED | §14 | a change note ("and a court's fame moves" struck); the row states that no court has fame |
| B417 | 634 | §14 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-13 · PS-r2-17 · S | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B418 | 635 | §14 | [CURED 2026-10-18 (fp-final r4) — R-CH] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B419 | 635 | §14 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B420 | 635 | §14 | [CURED 2026-10-18 (fp-final r3) — A.13] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B421 | 636 | §14 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-1 · PS-r2-2 · HOS | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B422 | 638 | §14 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §A.6 · §D.4 · §E | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B423 | 639 | §14 | [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-1 / RULINGS-P6 §I. | FOLDED | §14 | the ↳ MG row (two PS callees per wing; no march row; the bank on MG's wing row) folded into the MG row and its seam ("§2.1's lane-C bracket" → "§2.1's wing line") |
| B424 | 640 | §14 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §A.3 · §C PS · O | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B425 | 641 | §14 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-32)] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B426 | 644 | §14 | [CURED 2026-10-19 (fp-final r6)] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B427 | 644 | §14 | [CURED 2026-10-18 (fp-final r4) — L-BD routes to PS (1) and  | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B428 | 644 | §14 | [CURED 2026-10-19 (fp-final r5) — BD-r4-3 · B.4 · B.13 · PS- | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B429 | 647 | §14 | [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E · L-ST i | FOLDED | §14 | the owner's sites word folded verbatim after the paragraph's lead words; the ruling and finding ids removed |
| B430 | 647 | §14 | [CURED 2026-10-18 (fp-final r4) — R-ST-b · RULINGS-ROUND4 A. | FOLDED | §14 | a change note ("inside Bound 2" was unqualified); the sentence states "where THE PASSAGE is lit"; ST's OD-ST-14 cited beside it |
| B431 | 647 | §14 | [CURED 2026-10-18 (fp-final r3) — A.1, PS's side: the round- | FOLDED | §14 | a change note (the withdrawn "a ready keep stands … in the one border battle"); the sentence states the field force |
| B432 | 649 | §14 | [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E · SEAMS- | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B433 | 649 | §14 | [CURED 2026-10-18 (fp-final r4) — A.7 · L-BD route to PS (2) | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B434 | 649 | §14 | [CURED 2026-10-18 (fp-final r4) — R-ST-b · A.11] | FOLDED | §14 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B435 | 657 | §15 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-30): 'humanT | FOLDED | §15 | its fact (no `humanTermType` exists) folded beside the `termLabel` cite |
| B436 | 657 | §15 | [CURED 2026-10-18 (fp-final r2) — PS-r2-25] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B437 | 661 | §15 | [CURED 2026-10-18 (fp-final r2) — PS-r2-19] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B438 | 664 | §15 | [CURED 2026-10-18 (fp-final r3) — PS-r2-13] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B439 | 665 | §15 | [CURED 2026-10-18 (fp-final r2) — PS-r2-20] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B440 | 672 | §15 | [CURED 2026-10-18 (fp-final r2) — PS-r2-23] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B441 | 673 | §15 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B442 | 675 | §15 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-13] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B443 | 677 | §15 | [CURED 2026-10-20 (fp-final P5)] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B444 | 679 | §15 | [CURED 2026-10-18 (fp-final r3) — PL-V4] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B445 | 680 | §15 | [CURED 2026-10-18 (fp-final r3) — A.14] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B446 | 681 | §15 | [CURED 2026-10-18 (fp-final r3) — A.2 · PS-V1 · PS-V2 · A.1  | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B447 | 682 | §15 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B448 | 683 | §15 | [CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2] | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B449 | 683 | §15 | [CURED 2026-10-19 (fp-final r5) — SEAMS-r4-16 · minor (c) ·  | FOLDED | §15 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B450 | 694 | §16 | [CURED 2026-10-18 (fp-final r4) — R-CH · L-BD route to PS (1 | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B451 | 694 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 · PS-r2-16 · SEAMS | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B452 | 696 | §16 | [CURED 2026-10-19 (fp-final r5) — PS-X2 · B.14] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B453 | 697 | §16 | [CURED 2026-10-18 (fp-final r2) — HOST-r2-3 · HOST-r2-18] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B454 | 700 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-8] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B455 | 704 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-1 · PS-r2-20 · HOST- | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B456 | 705 | §16 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor (b): "o | FOLDED | §16 | a change note ("of B's home defence" survived an earlier cure); the row states the FIELD FORCE |
| B457 | 706 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-15 · PS-r2-22 · RULI | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B458 | 706 | §16 | [CURED 2026-10-18 (fp-final r3) — A.2] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B459 | 709 | §16 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-10] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B460 | 710 | §16 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-7] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B461 | 710 | §16 | [CURED 2026-10-18 (fp-final r3) — A.3 · MN-V6 · PS-r2-12] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B462 | 712 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-14] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B463 | 715 | §16 | [CURED 2026-10-18 (fp-final r3) — PS-V1] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B464 | 715 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-18] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B465 | 717 | §16 | [CURED 2026-10-20 (fp-final P5) — P5C-15 (WC-PS-48)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B466 | 718 | §16 | [CURED 2026-10-18 (fp-final r4)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B467 | 718 | §16 | [CURED 2026-10-20 (fp-final P5)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B468 | 719 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2 · HOST-r2-2] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B469 | 720 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-6] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B470 | 721 | §16 | [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b SEAMS-r2-2 | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B471 | 722 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-3 · PS-r2-4 · PS-r2- | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B472 | 723 | §16 | [CURED 2026-10-18 (fp-final r4) — A.1 · A.2 · minor (e)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B473 | 723 | §16 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-39)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B474 | 723 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-11] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B475 | 723 | §16 | [CURED 2026-10-18 (fp-final r3) — A.1 · A.6 · minor 5] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B476 | 724 | §16 | [CURED 2026-10-18 (fp-final r3) — PS-r2-12] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B477 | 724 | §16 | [CURED 2026-10-18 (fp-final r2) — PS-r2-12] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B478 | 725 | §16 | [CURED 2026-10-18 (fp-final r4) — R-CH] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B479 | 725 | §16 | [CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 (PLAUSIBLE in t | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B480 | 726 | §16 | [CURED 2026-10-18 (fp-final r3) — PS-r2-15 · A.2] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B481 | 727 | §16 | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §D.4 · §E.4)] | FOLDED | §16 | the ↳ OD-PS-35 row (five registrants; the wing record; `replanFromNode`) folded into OD-PS-35 — B167's FIVE applied to OD-PS-35 |
| B482 | 728 | §16 | [CURED 2026-10-18 (fp-final r3) — PS-V2] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B483 | 729 | §16 | [CURED 2026-10-18 (fp-final r3) — PS-V3] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B484 | 730 | §16 | [CURED 2026-10-18 (fp-final r3) — A.1, PS's side] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B485 | 731 | §16 | [CURED 2026-10-18 (fp-final r3) — PL-V5 · A.6] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B486 | 732 | §16 | [CURED 2026-10-18 (fp-final r3) — PS-r2-13] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B487 | 733 | §16 | [CURED 2026-10-18 (fp-final r3) — minor 5] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B488 | 734 | §16 | [CURED 2026-10-18 (fp-final r4) — PS-W1 · RULINGS-ROUND4 A.1 | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B489 | 734 | §16 | [CURED 2026-10-19 (fp-final r5) — RU-PL-1] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B490 | 735 | §16 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.2 · R-PL  | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B491 | 735 | §16 | [CURED 2026-10-19 (fp-final r5) — RU-PL-2 · minor (d)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B492 | 736 | §16 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B493 | 736 | §16 | [CURED 2026-10-19 (fp-final r5) — B.4 · B.13 · PS-X1 · BD-r4 | FOLDED | §16 | ids of the one network, price, access law and known set; the row states each |
| B494 | 737 | §16 | [CURED 2026-10-19 (fp-final r5) — PS-X2 · minor (a)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B495 | 737 | §16 | [CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.7 · SEAMS | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B496 | 738 | §16 | [CURED 2026-10-19 (fp-final r5) — minor 1] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B497 | 738 | §16 | [CURED 2026-10-19 (fp-final r5) — minor 1, EXECUTED 'p7-effe | FOLDED | §16 | a stamp naming its executed receipt; `p7-effective.out` kept in OD-PS-46's Why cell |
| B498 | 738 | §16 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor 1 · RUL | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B499 | 739 | §16 | [CURED 2026-10-18 (fp-final r4) — PS-r3-verify minor (a)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B500 | 740 | §16 | [CURED 2026-10-19 (fp-final r5) — PS-X2 · RULINGS-ROUND5 B.1 | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B501 | 741 | §16 | [CURED 2026-10-19 (fp-final r5) — minor (e)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B502 | 742 | §16 | [CURED 2026-10-19 (fp-final r5) — minor (i)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B503 | 743 | §16 | [CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 A.2] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B504 | 743 | §16 | [CURED 2026-10-19 (fp-final r5) — SEAMS-r4-16 · minor (c)] | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B505 | 744 | §16 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-29); RULINGS | FOLDED | §16 | its ruling ("a closed register — the owner's row, visible") is the row's ⭐ mark |
| B506 | 745 | §16 | [CURED 2026-10-20 (fp-final P5) — P5C-18 (WC-PS-81); RULINGS | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B507 | 746 | §16 | [CURED 2026-10-20 (fp-final P5) — RULINGS-P5 C.1 · C.4 · C.1 | FOLDED | §16 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B508 | 758 | §17 | [CURED 2026-10-18 (fp-final r2) — PS-r2-24] | FOLDED | §17 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B509 | 764 | §17 | [CURED 2026-10-18 (fp-final r2) — PS-r2-2] | FOLDED | §17 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B510 | 765 | §17 | [CURED 2026-10-18 (fp-final r2) — PS-r2-19] | FOLDED | §17 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B511 | 765 | §17 | [CURED 2026-10-19 (fp-final r5) — minor (h): the threshold r | FOLDED | §17 | its rule (the threshold reads Tolle's DEFENCE, never its guard alone) folded into sentence 14's scrutiny |
| B512 | 766 | §17 | [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b SEAMS-r2-2 | FOLDED | §17 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B513 | 767 | §17 | [CURED 2026-10-18 (fp-final r2) — PS-r2-11] | FOLDED | §17 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B514 | 768 | §17 | [CURED 2026-10-18 (fp-final r3) — PL-V5 · A.6] | FOLDED | §17 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B515 | 769 | §17 | [CURED 2026-10-18 (fp-final r3) — PS-V3] | FOLDED | §17 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B516 | 770 | §17 | [CURED 2026-10-18 (fp-final r4) — L-BD route to PS (2)] | FOLDED | §17 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| B517 | 771 | §17 | [CURED 2026-10-19 (fp-final r5) — minor (h): a feud leaves t | FOLDED | §17 | its rule (a feud leaves the hold and the stack unchanged, PL §4.7 F.5 quoted) folded into sentence 20's scrutiny |
| B518 | 771 | §17 | [CURED 2026-10-18 (fp-final r4) — A.7 · RULINGS-ROUND3 §F.5] | FOLDED | §17 | a stamp: the cured text stands at the same place; the ids stay in the text of record |
| C519 | 900 | §18 THE CURE RECORD | [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §D.4)] | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| C520 | 951 | §18 THE CURE RECORD | [STOP SEAMS-r5-2-scope] | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| C521 | 983 | §18 THE CURE RECORD | [OPENED …] | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| A-L79.1 | 79 | §0 | ↳ r6: every rung 'wild · way · trail' of the way-mode edge i | FOLDED | §0 | the r6 amendment folded into the host class line (every rung of the way-mode edge hidden and ×2) |
| A-L315.1 | 315 | §4 | ↳ (a) states for MN, PL and PT, whose row gains PS's widths  | FOLDED | §4 | OD-FC-28 (a) as amended (THE PASSAGE's widths) stated |
| A-L376.1 | 376 | §6 | ↳ P5, OD-FC-60 ↳ P5) [CURED 2026-10-20 (fp-final P5) — P5W-2 | FOLDED | §6 | "fold §3.3.13 ↳ P5, OD-FC-60 ↳ P5" restated as "the fold's §3.3.13 and OD-FC-60, as amended" |
| A-L376.2 | 376 | §6 | ↳ P5) [CURED 2026-10-20 (fp-final P5) — P5W-2's PS half (RUL | FOLDED | §6 | "fold §3.3.13 ↳ P5, OD-FC-60 ↳ P5" restated as "the fold's §3.3.13 and OD-FC-60, as amended" |
| A-L448.1 | 448 | §10 | ↳ [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §B.2 · MG-r1-4 | FOLDED | §10 | the ↳ row folded into a plain `movementGrammarEnabled` row (B307) |
| A-L449.1 | 449 | §10 | ↳ [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-1 / RULINGS-P6 § | FOLDED | §10 | the ↳ row folded into a plain `wingsEnabled` row (B308; it supersedes the row above's march-row clause) |
| A-L627.1 | 627 | §14 | ↳ WC [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §D.4)] \| "O | FOLDED | §14 | the ↳ WC row folded into the WC row (B396) |
| A-L639.1 | 639 | §14 | ↳ MG [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-1 / RULINGS-P | FOLDED | §14 | the ↳ MG row folded into the MG row (B423) |
| A-L704.1 | 704 | §16 | ↳ (a) gains the row); spend weights 'quiet 0.5 · present 1 · | FOLDED | §16 | OD-FC-28 ↳ (a) restated as "the fold's OD-FC-28 (a), as amended" |
| A-L727.1 | 727 | §16 | ↳ OD-PS-35 [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §D.4  | FOLDED | §16 | the ↳ OD-PS-35 row folded into OD-PS-35 (B481) |
| A-L815.1 | 815 | §18 THE CURE RECORD | ↳ (a) row routed) \| §4.4 · OD-PS-13 \| \| HOST-r2-17 \| m \| CUR | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| A-L900.1 | 900 | §18 THE CURE RECORD | ↳ A.13 [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §D.4)] \|  | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| A-L983.1 | 983 | §18 THE CURE RECORD | ↳ P5) — re-checked against ES's ES-2b row, CH l.736 and BD § | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| A-L1004.1 | 1004 | §18 THE CURE RECORD | ↳ 'wingsEnabled' · §14 ↳ MG \|  END OF VOLUME.  | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| A-L1004.2 | 1004 | §18 THE CURE RECORD | ↳ MG \|  END OF VOLUME.  | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L8.1 | 8 | header | ROUND 2 (first attack): disposed by lane D-PS-r2 (Opus 5.5), | MOVED | history | header/round line moved with the header block to `history/PS-cure-record.md` Part 1 |
| H-L9.1 | 9 | header | ROUND 3a: disposed by lane D-PS-r3 (Opus 5.5), 2026-10-18 —  | MOVED | history | header/round line moved with the header block to `history/PS-cure-record.md` Part 1 |
| H-L9.2 | 9 | header | round-3 block and 'cure/D-PS-r3.md' (probe 'cure/D-PS-r3-pro | MOVED | history | header/round line moved with the header block to `history/PS-cure-record.md` Part 1 |
| H-L10.1 | 10 | header | ROUND 4a: disposed by lane D-PS-r4 (Opus 5.5), 2026-10-18 —  | MOVED | history | header/round line moved with the header block to `history/PS-cure-record.md` Part 1 |
| H-L10.2 | 10 | header | round-4 block and 'cure/D-PS-r4.md' (probe 'cure/D-PS-r4-pro | MOVED | history | header/round line moved with the header block to `history/PS-cure-record.md` Part 1 |
| H-L11.1 | 11 | header | ROUND 5a: disposed by lane D-PS-r5 (Opus 5.5), 2026-10-19 —  | MOVED | history | header/round line moved with the header block to `history/PS-cure-record.md` Part 1 |
| H-L11.2 | 11 | header | round-5 block and 'cure/D-PS-r5.md' (probe 'cure/D-PS-r5-pro | MOVED | history | header/round line moved with the header block to `history/PS-cure-record.md` Part 1 |
| H-L74.1 | 74 | §0 | round-1 bracket: "members of one polity and liege/vassal sta | FOLDED | §0 | the round word removed where the line is restated in final form |
| H-L82.1 | 82 | §0 | round 2) owns the noticing read this volume consumes (PS8's  | FOLDED | §0 | "round 2" removed from the PATROLS line |
| H-L83.1 | 83 | §0 | round-2 rulings that bind this volume** [CURED 2026-10-18 (f | FOLDED | §0 | the round word removed where the line is restated in final form |
| H-L119.1 | 119 | §1 | round-2 clamp applied to an arbitrary node moved the unit fo | FOLDED | §1 | the round word removed where the line is restated in final form |
| H-L120.1 | 120 | §1 | round 2: 'cure/D-PS-r2-probe/sweep.out' — 2 of 154 land hold | FOLDED | §1 | "round 2" removed from the EXECUTED cite |
| H-L148.1 | 148 | §2 | round-1 key 'departTick' changed on every held week, so cros | FOLDED | §2 | the round word removed where the line is restated in final form |
| H-L167.1 | 167 | §2 | round-5 REFINED) \|  [CURED 2026-10-18 (fp-final r2) — PS-r2- | FOLDED | §2 | the round word removed where the line is restated in final form |
| H-L172.1 | 172 | §2 | round 2, PS-r2-19):  \| Answer \| Who can receive it \| What it | FOLDED | §2 | "added in round 2" removed |
| H-L239.1 | 239 | §2 | round 2; round 3 adds two optional fields to 'marches' and a | FOLDED | §2 | the persisted-shapes line restated in final form (the per-round additions named as final fields) |
| H-L239.2 | 239 | §2 | round 3 adds two optional fields to 'marches' and a second p | FOLDED | §2 | the persisted-shapes line restated in final form (the per-round additions named as final fields) |
| H-L239.3 | 239 | §2 | round 4 adds 'liegeAnswer' to 'crossings' (A.2's one declare | FOLDED | §2 | the persisted-shapes line restated in final form (the per-round additions named as final fields) |
| H-L239.4 | 239 | §2 | round 5 adds NO field: a 'banner' permit's 'leaveBy' turns o | FOLDED | §2 | the persisted-shapes line restated in final form (the per-round additions named as final fields) |
| H-L338.1 | 338 | §5 | round-4 candidate loop adds ~6 to round 2's ~16, PLAUSIBLE u | FOLDED | §5 | "the round-4 candidate loop adds ~6 to round 2's ~16" → "the candidate loop adds ~6 to the reroute's own ~16" |
| H-L338.2 | 338 | §5 | round 2's ~16, PLAUSIBLE until PS-1's car-0 measures it). Ov | FOLDED | §5 | "the round-4 candidate loop adds ~6 to round 2's ~16" → "the candidate loop adds ~6 to the reroute's own ~16" |
| H-L356.1 | 356 | §5 | round 3 (the route lifecycle's own flag is no gate of this a | FOLDED | §5 | "byte-identical to round 3" → "byte-identical to THE PASSAGE without the hidden way" (the hidden way's degraded arm) |
| H-L446.1 | 446 | §10 | round 5, minor 1); (20) a planted trail crossing by a unit a | FOLDED | §10 | "(P7; round 5, minor 1)" → "(P7)" (the finding ids of the lit-mutant pins removed) |
| H-L458.1 | 458 | §11 | round-2 identifiers of §15) on the then-current master.   -  | FOLDED | §11 | "the round-2 identifiers of §15" → "the identifiers of §15" |
| H-L460.1 | 460 | §11 | round 2 — drop-when-empty, the archive's two per-kind bounds | FOLDED | §11 | "— `marches` added in round 2 —" removed |
| H-L468.1 | 468 | §11 | round 4 — its weeks by the landed caravan clock 'supplyShipm | FOLDED | §11 | ", round 4" and the finding ids removed from PS-1's `distanceRead.js` edit |
| H-L583.1 | 583 | §13 | round-3 base-cheapest pick, a pass at 660, loses to a grass  | FOLDED | §13 | "the round-3 base-cheapest pick" → "a base-cheapest pick" (P7's receipt) |
| H-L590.1 | 590 | §13 | round 4 from "marched on", A.1) [CURED 2026-10-18 (fp-final  | FOLDED | §13 | "— re-worded in round 4 from \"marched on\", A.1" removed (P14's outcome words stand) |
| H-L608.1 | 608 | §13 | round 3 (with 'routeLifecycleEnabled' dark the way is BD's c | FOLDED | §13 | "byte-identical to round 3" → "byte-identical to THE PASSAGE without the hidden way" (P32) |
| H-L622.1 | 622 | §14 | round 2)  \| Sibling \| The coupling \| The seam \| \|---\|---\|--- | FOLDED | §14 | "each the sibling's to confirm in round 2" → "each the sibling's to confirm" |
| H-L633.1 | 633 | §14 | round-4 bracket; routed) [CURED 2026-10-18 (fp-final r4) — A | FOLDED | §14 | "(PS8's round-4 bracket; routed)" → "(PS8)" |
| H-L649.1 | 649 | §14 | round 4 — §5.5, §5.6) [CURED 2026-10-18 (fp-final r4) — A.7  | FOLDED | §14 | "added in round 4" → "among them" (PATROLS CONSIDERED) |
| H-L678.1 | 678 | §15 | round-2 shapes and reads \| FREE as identifiers (0 src); 'mar | FOLDED | §15 | "round-2 shapes and reads" → "shapes and reads" |
| H-L681.1 | 681 | §15 | round-3 identifiers \| FREE at '81f1cd963' (0 src, 0 tests fo | FOLDED | §15 | "round-3 identifiers" → "identifiers of the hold, the archive and the battle inputs" |
| H-L682.1 | 682 | §15 | round-4 fields, states, kinds, reads and keys \| 'liegeAnswer | FOLDED | §15 | "round-4 fields, …" → "fields, states, kinds, reads and keys" |
| H-L683.1 | 683 | §15 | round-5 reads, keys and words \| 'hidden', 'HIDDEN_GRADE', 'H | FOLDED | §15 | "round-5 reads, keys and words" → "reads, keys and words" |
| H-L718.1 | 718 | §16 | round 2), the border battle's defender's ground (round 2), ' | FOLDED | §16 | OD-PS-27's per-round labels (round 2 · round 3 · round 4) and finding ids removed from the constants list |
| H-L718.2 | 718 | §16 | round 2), 'PASSAGE_DEFIANCE_RESENTMENT' 0.10, the urgency ha | FOLDED | §16 | OD-PS-27's per-round labels (round 2 · round 3 · round 4) and finding ids removed from the constants list |
| H-L718.3 | 718 | §16 | round 3), the 'hidden_approach' threat step (one, round 4 [C | FOLDED | §16 | OD-PS-27's per-round labels (round 2 · round 3 · round 4) and finding ids removed from the constants list |
| H-L718.4 | 718 | §16 | round 4 [CURED 2026-10-18 (fp-final r4)]), (the border battl | FOLDED | §16 | OD-PS-27's per-round labels (round 2 · round 3 · round 4) and finding ids removed from the constants list |
| H-L718.5 | 718 | §16 | round 2), the lens's demand count (two KEPT passages a year  | FOLDED | §16 | OD-PS-27's per-round labels (round 2 · round 3 · round 4) and finding ids removed from the constants list |
| H-L775.1 | 775 | §18 THE CURE RECORD | Round 2 (first attack) — lane D-PS-r2, 2026-10-18; inputs 's | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L823.1 | 823 | §18 THE CURE RECORD | round 1; restated in §14 \| PS8 · §14 PR \| \| R2 C Q4 \| — \| CU | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L826.1 | 826 | §18 THE CURE RECORD | Round 3a — lane D-PS-r3, 2026-10-18; inputs 'skeptic/PS-r2-v | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L830.1 | 830 | §18 THE CURE RECORD | round-2 clamp moved a unit forward in 51,486 of 111,540 case | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L861.1 | 861 | §18 THE CURE RECORD | Round 4a — lane D-PS-r4, 2026-10-18; inputs 'skeptic/PS-r3-v | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L866.1 | 866 | §18 THE CURE RECORD | round-3 reroute took ONE base-cheapest path (EXECUTED: a win | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L867.1 | 867 | §18 THE CURE RECORD | round-2 record row) and at PS1's person and party rows \| PS1 | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L883.1 | 883 | §18 THE CURE RECORD | round 3, and its screen parenthetical is carried ("or crossi | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L896.1 | 896 | §18 THE CURE RECORD | round-3 record \| — \| \| A.11 \| ruling \| CURED — as R-ST-a · R | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L910.1 | 910 | §18 THE CURE RECORD | Round 5a — lane D-PS-r5, 2026-10-19; inputs 'skeptic/PS-r4-v | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L946.1 | 946 | §18 THE CURE RECORD | Round 6a — lane D-RESIDUE-r6, 2026-10-19 (one residue lane o | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| H-L946.2 | 946 | §18 THE CURE RECORD | round-5 lanes' ROUTES to PS written after PS closed (PL · ST | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| S-L6.1 | 6 | header | STOP conditions and the open questions: 'settlement-engine-k | MOVED | history | header/round line moved with the header block to `history/PS-cure-record.md` Part 1 |
| S-L83.1 | 83 | §0 | STOPS an envoy only as a road hearing — PS's 'passage_at_the | KEPT | §0 | not a marker: the verb "STOPS" inside a quoted ruling |
| S-L270.1 | 270 | §4 | STOP condition (S-a):** if the extraction cannot free ≥ 4 ef | KEPT | §4 | a design mark: the build-time STOP condition (S-a) |
| S-L270.2 | 270 | §4 | STOP — no other host can hold a column in place (the positio | KEPT | §4 | a design mark: the build-time STOP condition (S-a) |
| S-L353.1 | 353 | §5 | STOP (S-g): if they cannot, the arm stays dark (no trail is  | KEPT | §5 | a design mark: the build-time STOP condition (S-g) |
| S-L376.1 | 376 | §6 | STOP (S-e): if it cannot, 'stopped' keeps the questioning an | KEPT | §6 | a design mark: the build-time STOP condition (S-e) |
| S-L391.1 | 391 | §7 | STOP if it needs a new persisted field); 'urgency' writes re | KEPT | §7 | a design mark: the build-time STOP condition on the credibility charge door |
| S-L397.1 | 397 | §7 | STOP (S-f), WIDENED to "no carrier": if the war layer's writ | KEPT | §7 | a design mark: the build-time STOP condition (S-f), widened to "no carrier" |
| S-L458.1 | 458 | §11 | STOP (S-a) if it cannot free ≥ 4 eff lines; THE TRANSIT LEAF | KEPT | §11 | a design mark: the build-time STOP condition (S-a) |
| S-L484.1 | 484 | §11 | STOP S-f widened to "no carrier") [CURED 2026-10-20 (fp-fina | KEPT | §11 | a design mark: STOP S-f ("no carrier") |
| S-L492.1 | 492 | §11 | STOP (S-g) if 'planMarch' and the leaf cannot see one input  | KEPT | §11 | a design mark: the build-time STOP condition (S-g) |
| S-L604.1 | 604 | §13 | STOPPED — Ashford's riders meet a stranger's envoy on Ashfor | KEPT | §13 | not a marker: the word "STOPPED" in P28's title, THE ENVOY STOPPED |
| S-L721.1 | 721 | §16 | STOP S-e) [CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b  | KEPT | §16 | a design mark: STOP S-e inside OD-PS-30 |
| S-L723.1 | 723 | §16 | STOP S-f widened to "no carrier": then the battle's news lin | KEPT | §16 | a design mark: STOP S-f inside OD-PS-32 |
| S-L736.1 | 736 | §16 | STOP (S-g) if 'planMarch' and the leaf cannot share the plan | KEPT | §16 | a design mark: the build-time STOP (S-g) inside OD-PS-44 |
| S-L775.1 | 775 | §18 THE CURE RECORD | STOP 0. Log: 'cure/D-PS-r2.md'.  \| Id \| Sev \| Disposition \|  | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| S-L826.1 | 826 | §18 THE CURE RECORD | STOP 0. Log: 'cure/D-PS-r3.md' (probe 'cure/D-PS-r3-probe/': | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| S-L861.1 | 861 | §18 THE CURE RECORD | STOP 0. Log: 'cure/D-PS-r4.md' (probe 'cure/D-PS-r4-probe/': | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| S-L910.1 | 910 | §18 THE CURE RECORD | STOP 0. Log: 'cure/D-PS-r5.md' (probe 'cure/D-PS-r5-probe/': | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| S-L951.1 | 951 | §18 THE CURE RECORD | STOP — peace and war (this volume, L-BD 11 (i) + the owner's | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| S-L956.1 | 956 | §18 THE CURE RECORD | STOP above; the roll is BD's (PS keeps its deterministic re- | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| S-L959.1 | 959 | §18 THE CURE RECORD | STOP 0 \| id \| class \| disposition \| where \| \|---\|---\|---\|--- | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| S-L980.1 | 980 | §18 THE CURE RECORD | STOP 0; every P5 bracket above kept \| id \| class \| dispositi | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| S-L985.1 | 985 | §18 THE CURE RECORD | STOP named); re-checked against the three brackets' text: no | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| U-L10.1 | 10 | header | ROUTED-UNAPPLIED row), NEW and minor row of 'skeptic/PS-r3-v | MOVED | history | header/round line moved with the header block to `history/PS-cure-record.md` Part 1 |
| U-L11.1 | 11 | header | ROUTED-UNAPPLIED rows), NEW and minor row of 'skeptic/PS-r4- | MOVED | history | header/round line moved with the header block to `history/PS-cure-record.md` Part 1 |
| U-L861.1 | 861 | §18 THE CURE RECORD | ROUTED-UNAPPLIED · 1 new MAJOR · 6 minor notes), 'skeptic/SE | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| U-L910.1 | 910 | §18 THE CURE RECORD | ROUTED-UNAPPLIED · 2 new MAJOR · 9 minor notes), the PS rout | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| U-L916.1 | 916 | §18 THE CURE RECORD | ROUTED-UNAPPLIED) \| CURED: the outcome CITED (PL §4.3 (3), O | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| U-L917.1 | 917 | §18 THE CURE RECORD | ROUTED-UNAPPLIED, the mirror half) \| CURED: ONE line per lie | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| U-L944.1 | 944 | §18 THE CURE RECORD | ROUTED-UNAPPLIED halves are RU-PL-1 and RU-PL-2, cured above | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| U-L959.1 | 959 | §18 THE CURE RECORD | ROUTED-UNAPPLIED PS half), the census adjudication's PS rows | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| U-L976.1 | 976 | §18 THE CURE RECORD | ROUTED-UNAPPLIED (BD → PS, route 1; C.25 · B.1) \| route \| CU | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| U-L999.1 | 999 | §18 THE CURE RECORD | ROUTED-UNAPPLIED BD → PS route 1); not duplicated \| — \|  ### | MOVED | history | inside old §18 THE CURE RECORD, moved verbatim to `history/PS-cure-record.md` Part 2 |
| L003 | 3 | header | ## Compiled by lane L-PS (Opus 5.5) under chair session a733 | MOVED | history | compile header line (the compile credit, lane and date) |
| L004 | 4 | header | ## Compiled on the owner's word; DARK behind two virtual fla | MOVED | history | compile header line (the owner's word and the two flags, restated in the new header) |
| L005 | 5 | header | ## Bound by the FP constitution's requirements 1–24 ('DESIGN | MOVED | history | compile header line (the requirements line, restated in the new header) |
| L007 | 7 | header | ## '[REFINED 2026-10-18 (fp-final) — what; why]' brackets ma | MOVED | history | compile header line with the bracket template |
| L012 | 12 | header | ## P5 (THE COMPLETENESS CRITIC): disposed by lane D-PS-ST-PR | MOVED | history | round header (P5) |
| L013 | 13 | header | ## P5d (THE RESIDUE ROUND): disposed by lane D-PS-ST-PR-p5b  | MOVED | history | round header (P5d) |
| L014 | 14 | header | ## P6c (THE BRACKETS): routes into this volume from THE OPPO | MOVED | history | round header (P6c) |

## CURES AFTER FV-PS AND THE SEAMS CURES FOR PS (2026-10-23, the cloud chair)
- F1 (B028 · B397 · THE READER'S GUIDE item 8): the claim "in every volume the bare word ['passage'] carries THE PASSAGE's meaning" over-reached — the chair's PL-C-1 ruling is PL's, and the briefs that carried it to the lanes stated it without its scope (the chair's error, corrected here). The three sites now scope it to this volume and THE POLITY (PL's own ruling; the fold §5 register). The guide's "gate" rule regains PS2's qualifier: never bare "in this volume's own prose"; quoted rulings and host lines keep their source's word.
- F2 (B127): the naval FREEZE-hold bound is restored as OPEN — "an open question, PS's to name at MG-7's unit" (no fold row rules it; OD-FC-103 and OD-FC-104 rule other questions).
- F3 (allow file): `cure/D-PS-ST-PR-p5.md` also stood in OD-PS-54's Why cell (old L746) as a review-trail path; its ruling's content stands in the cell — the ALLOW reason is corrected to say so.
- SEAMS-P8-7 (L296): the verifier id inside the quoted brief item becomes an editorial bracket — "… [PS §4.1's] ground/fatigue car is the seam".
- SEAMS-P8-10 (L273): "ST §4.3 as cured" → "ST §4.3".
