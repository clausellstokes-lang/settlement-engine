# MN — FIDELITY VERIFICATION OF THE COMPLETED CONSOLIDATION (P8, seat FV-MN, cloud, 2026-10-23)

**COUNTS: sampled 151 = 147 ledger rows + 4 whole-text checks (THE READER'S GUIDE, §12 THE RULINGS, the cure record, the allow file) · holds 149 · FAILS 2.** All 147 sampled rows HOLD. The two FAILs are **F1, THE READER'S GUIDE item 3** (the "belief only" pattern) and **F2, one allow line with an untrue reason**. Notes N1–N9 below are NOT fails.

**THE RATCHET (re-run on `/home/user/fp-p8/docs/DESIGN_FP_ARCH_MN.md` as it stands, with `MN-allow.txt`): `RATCHET 4 DIFFERENCE CLASSES`.** The details: tokens 1229 → 1094 · missing 0 · new-in-new 17; cites 93 = 93 (missing 0); laws 15 = 15; OD 58 → 56; ⭐ 4 → 10; DRAFT 31 → 28; UNMEASURED 17 → 16; wave ids 32 → 9; flags 25 = 25; review markers left 0. These match ledger §5b exactly. I re-proved each of the four explanations by script:
- **OD 58 → 56.** `OD-PL-48` and `OD-PR-43` occur only at old L862 and L826, inside the moved cure record. Every OD id in the old body (L1–679) is in the new text (body − new = ∅).
- **DRAFT 31 → 28.** Two DRAFTs stood only in the moved cure record (old L875, L960). The third was old L394's B257 quote of the superseded "one hop per two weeks (DRAFT …)". New L393 keeps B257's own "a DRAFT design shift" (old L394 has 2 DRAFTs, new L393 has 1). Every other DRAFT line keeps its count.
- **UNMEASURED 17 → 16.** The lost one is old L394's quote of RULINGS-P5 C.14's untaken alternative ("or declares a multiple on the FP-46 roster, UNMEASURED"). MN declares no multiple. Every other line keeps its count.
- **Wave ids 32 → 9.** All 23 lost matches (`MN-8` … `MN-41`) are `OD-MN-n — …` row starts in old L688–932, which is the cure record. The waves MN-0 … MN-7 and PL-55 survive.
- **⭐ 4 → 10** (an increase, so not a ratchet difference). The old ⭐ lines L165, L526 and L649 survive at new L164, L522 and L643. The extra marks are the ⭐ added on THE OWNER'S rows OD-MN-2 and OD-MN-37 and on cross-references to OD-MG-6.
- **The new-in-new tokens** are trail paths, the guide's `advanceMenaces` / `menaceLedger.js` (both in the body), and pairing artifacts. Neither text has a line with an odd number of backticks (script), so the artifacts come from escaped backticks and spans over 200 characters, not from a stray mark.

**THE ALLOW FILE (170 lines, 161 tokens, no duplicates), checked line by line against ledger §4 by location (script `scratchpad/fvmn/allow.py`, `allow2.py`).**
- Every "MOVED WITH THE CURE RECORD" token has zero backticked occurrences in old body lines 24–679, except `pressTally.danger01`. That token occurs at old L161 inside B092, the P5 rename note. **This is F2.**
- Every superseded name sits where a later bracket replaced it: `menaceSightings` / `recordMenaceSighting` at L163 (B098), `seenBy` at L107, `defenderReliefBonus` and `side` at L360, `road{a,b}` at L411 (B283), `repelled · breached` at L414 (B285).
- Every "PRESENT IN THE NEW TEXT" token occurs literally in the new text.
- The header templates and kit paths sit in old lines 3–23, which are moved verbatim.

**THE MARKER COUNT (my own balanced scan, `scratchpad/fvmn/count.py`) equals the ledger's 600 rows.**
- Brackets: 478 (CURED 417 · REFINED 33 · r4: 11 · r5: 10 · ADDED 4 · RE-RULED 2 · WITHDRAWN 1). 476 are top level and 2 nested; 17 are in header L1–23 and 4 in the cure record.
- Markers outside brackets: `↳` 28 · STOP 16 · `(fp-final …)` 12 · ROUTED-UNAPPLIED 8 · round words 46 (the ledger's regex `[Rr]ound|ROUND` + space + digit; my L-by-L match against the H rows differs by 0).
- Other rows: 3 header L rows and 9 cure-record headers.
- Total: 478 + 28 + 16 + 12 + 8 + 46 + 3 + 9 = 600. The ledger's rows are A28 · B478 · F12 · H46 · R9 · S16 · U8 + L3 = 600, with dispositions folded 488 · dropped 2 · moved 106 · kept 4.
- All 478 B rows align with my bracket index by old line (0 mismatches).

**THE CURE RECORD.** I confirmed that `history/MN-bracketed-1beabdc85.md` is byte-identical to `git show 1beabdc85:docs/DESIGN_FP_ARCH_MN.md`. `history/MN-cure-record.md` = a 3-line preamble + old L3–23 verbatim (Part 1) + old L680–979 verbatim (Part 2). Nothing else is in the file (script). The volume's §14 is the one-line REVIEW TRAIL.

## THE TWO FAILS
- **F1 — THE READER'S GUIDE, item 3: the "belief only" pattern.** The guide reads: "BELIEF for every court's answer — relief, common cause, the chooser term, the dossier's court voice — through `believedMenaces` …; the truth wherever there is no rumor road". The text names a second exception the guide omits. §4.6 (new L302; old L303) says the chooser rows "DECIDE for a court, so each reads that court's own picture (**self is truth**; another court's facts through belief)", and "MN's contribution is `menaceAtHome ∈ { walls · country · none }` from the court's own picture (**self is truth**)". So the chooser term's own-town read is TRUTH, not `believedMenaces`. **Cure:** item 3 → "… BELIEF for every court's answer about a menace beyond its own walls — relief, common cause, the chooser's foreign facts, the dossier's court voice — through `believedMenaces` …; a court's own town read true (self is truth: the chooser's `menaceAtHome`, §4.6); the truth wherever there is no rumor road (the omniscient arm)."
- **F2 — one allow line has an untrue reason.** `pressTally.danger01` is filed under "MOVED WITH THE CURE RECORD (tokens only old §14 THE CURE RECORD carried)". It also stood at old L161, in the body's B092. Its true reason is a SUPERSEDED NAME: P5C-12/C.14 renamed it `press01` in place. The ledger names that reason nowhere. No design loss: `press01` stands at new L160 and in §3.5 item 1. **Cure:** in `MN-allow.txt` and ledger §4, move the line under SUPERSEDED NAMES ("renamed `press01`, B092"). No change to the volume.

## THE LANE NOTES, VERIFIED
- **Seat 1's six hand corrections (ledger §3 items 8–13), each read against the old text: all HOLD.**
  - (8) The MN5 joint "by design. The walls term" (new L102): old L103 had B048 between "by design" and B049's folded sentence.
  - (9a) §3.1 "`believedDenOf` READ it — ONE row per" (new L162): the old quote's close plus B098 were removed.
  - (9b) §4.7: no `")..` is left anywhere (grep 0).
  - (10) §3.1 "`kind` ∈ `menace · body`, and `unit` with its `heading?` by THE UNIT SIGHTING below", and §3.5 item 9 "(a `unit` subject's row also `heading?` — THE UNIT SIGHTING, §3.1, OD-MG-6)". Both use B104's own words: "the subject kind `unit` beside `menace` and `body` … and the optional field `heading?` … written only for a `unit` row". Nothing new is decided, and §3.5 still counts nine.
  - (11) §2 "ST §6.7, as cured" → "ST §6.7".
  - (12) "of the chair's 10-17 idea" → "of the 10-17 idea put to the owner". The quoted words are untouched.
  - (13) `walls") So the worst` → `walls"). So the worst`.
- **OD-MN-41 (4) is stated as re-ruled: HOLD.** It now reads "its mover only REGISTERS the move, THE SITES' closing call decides after every mover, and where the verdict is `held` PS's ONE hold helper's FREEZE keeps it at its prior position — on a clockless record, the WITHHELD COMMIT; nothing is rolled back (§6)". This is clause for clause §6 new L398 as B277 (RE-RULED, B.6) left it. "by its own mover" and "own mover" have 0 hits. The Ruled cell says "(4) re-ruled 2026-10-19 (supersedes OD-MN-41 (4) of 2026-10-19)". B399's withdrawn "no PS hold-helper row names it" has 0 hits in the new text.
- **OD-MN-9, M21, M44, M60–M64 survive: HOLD.**
  - OD-MN-9 is at new L610 and carries RULINGS-PL-MN's re-ruling of 2026-10-17 ("supersedes … as compiled").
  - M1–M64 run in the old row order (64 = 64).
  - The word diffs of M21, M44, M60–M64 against the de-bracketed old rows show only tag removal and spacing. M44 gains B368's receipt `cure/D-MN-r3-probe/m53.out`.
- **§10 row K: HOLD.**
  - `menaceName`→`name` follows K's own shape cell (`name?`) and §3.1. "no menace id"→"no subject id" is the only reading consistent with r6's generalization to body subjects.
  - Old L526 (↳ K) is folded cell by cell into K: the shape cell carries "(⭐ OD-MG-6, THE OWNER'S, VISIBLE)"; the create·read cell the three UNIT producers and MG's readers; the regeneration cell the unit memory clause; the normalizer "and a `heading` on a non-`unit` row"; the dark cell "no `unit` row while MG's flag is dark"; the horizon is unchanged.
  - The lane flagged both renames as vetoable choices. PLAUSIBLE: they are the latest reading, not a decision.
- **§12 "Ruled" column: HOLD (N4).** I compared each row's bracket and inline-stamp dates with its Ruled cell by script, for 42 rows = 42 rows. 40 rows' date sets match or add only the compile date. Two differ, both defensibly:
  - OD-MN-2 dates `enlists` by its ruling, RULINGS-ROUND4 (10-18), not by the row's r5 bracket (10-19).
  - OD-MN-29 omits 2026-10-19 (the r5 "OWNED unit" amendment, CHAIR-NOTES 18 (d)).
  - The re-rulings are dated from the rulings files: OD-MN-9 and 21 → 10-17 (RULINGS-PL-MN; RULINGS-AFTER-COMPILE); OD-MN-27, 28, 29 → 10-18 (RULINGS-ROUND1).
- **§12 read whole against old L604–649: HOLD.** Rows: 42 = 42. ⭐ OD-MG-6, OD-MN-2 and OD-MN-37 are VISIBLE; OD-MN-8 keeps "VISIBLE to the owner (ODQ §934.93)". Every bracket's latest content is in its cell: OD-MN-10's adoption and the WC retire; OD-MN-16's struck aspatial hop, moved to "not on the roster"; OD-MN-30's measured `war_pressure` note; OD-MN-33's seam words and slot (2); OD-MN-40's r5 (2) and (3); OD-MN-41's r6 generalization. THE OPEN STOPS: none, and none needed.
- **The cure record: HOLD** (above).

## NOTES (not fails)
- **N1** — A joint where the five brackets after "(M50, M53)" at old L198 were removed (B129 among them; the last, P5C-15, folded) has no full stop at new L197: "…leaves only when the raid stops (M50, M53) THE COMPOSER TAKES NO BELIEF SELECTION." The same kind as seat 1's items 8–9. My joint scanner (`fvmn/joints2.py`) found no other.
- **N2** — Cosmetic spacing. New L45 "`W_SIEGE`.85" (old "`W_SIEGE` .85"); new L181 "IN PLACE** :" (the joint where the REFINED r2 MN-V2 bracket was removed).
- **N3** — Two inline "vetoable"s inside removed brackets are gone: old L163 (the sightings store as its own key) and old L396 (`enlists`). Each is carried vetoable in §12 (OD-MN-41 (1), OD-MN-40) and by header line 5. This is the CH N3 pattern.
- **N4** — The Ruled-column date differences above (OD-MN-29 could add "amended 2026-10-19 (the composer an OWNED unit)").
- **N5** — INHERITED: new L262 (§4 table) still says "POP · EC · HB rows". §4.10 and MN-7 say EC's row is STRUCK. Old L263 is identical and has no bracket.
- **N6** — §3.4 new L228 says "(the shared unit's module … — owned by this volume, read by every feeder)". The ownership is B042's latest-wins (ledger §3 item 6). "Read by every feeder" is loose, because feeders REGISTER rows.
- **N7** — Guide item 4, "nothing on any relationship edge", is a new summary phrase. It is true of MN's own writer, but MN's sworn relief answer lands, through PL's door, on `relationshipState.fealtyRecord` (§3.5 item 6). Suggest "MN's writer touches no relationship edge".
- **N8** — The verifier's duplicate receipt `skeptic/MN-r3-verify-probe/union.out` was dropped from old L103's running text (the lane's `cure/D-MN-r4-probe/union.out` with the same numbers is kept). The allow group's reason ("moved with … a change note; stay in history/MN-cure-record.md") is loose for it: it occurs only in git and in `history/MN-bracketed-1beabdc85.md`.
- **N9** — The ledger's H regex leaves out 42 hyphenated "round-N" words outside brackets. Each is handled as a §3 text correction (items 3, 16) or moved with the header or cure record. 0 survive in the new text.

## THE TABLE
| row | verdict | receipt |
|---|---|---|
| B021 B022 B024 B032 B036 B037 B040 B052 B060 B069 B094 B106 B109 B129 B153 B155 B169 B178 B183 B221 B222 B236 B255 B286 B314 B334 B335 B354 B355 B356 B365 B435 B436 B438 B473 (MN-r1-1/2/3, BLOCKING) | HOLD | the lone besieger "below about 92 % … would never roll" (L48); release realised AT BIRTH (L183, OD-MN-28); `pressTally`/`quietWeeks`/`press01` folded (L160); "Both the walls term and the raid term stand at or above `ENTER_THRESHOLD` (the raid's DRAFT 0.6)" (L279); MN-2 reads `SIEGE_VERDICT_BANDS` "with the exhaustion clock as its age ceiling" = RULINGS-ROUND1's own "age ceiling (… lifts by exhaustion)" (L347); M34–M36 intact |
| B185 B304 B305 B456 B457 (HOST-r1-2, BLOCKING) | HOLD | CANONIZED ≠ PREMIUM "the ruling of record (the fold §1, requirement 17)"; "not an entitlement and not an owner row of MN's" (L280, L435, OD-MN-35) |
| B031 B268 B386 B461 (SEAMS-r2-1 · HOST-r2-1, BLOCKING) | HOLD | THE SEA IS IN THE BOOKS with the owner's question (L397, OD-MN-38); W-NAVY and M8's carriers; M51 intact |
| B043 · B082 (the 2 DROPPED) | HOLD | change notes only; the cured "OWNED unit" sentence (L102) and "SIX kinds" + B081's body-as-actor clause (L144) stand |
| S074–S077 (KEPT) · S078 (FOLDED) · S079–S089 (MOVED) | HOLD | design STOPs at L118, L373, L444, L621; "never a WC column" without "STOP-PR-0" (L640); the moved ones are in Part 2 verbatim |
| A000 A001 A007 A008 A009 A011 A012 A013 A014 (↳) | HOLD | labels → fold rows by title (L325, L472); ↳ K folded into K (L522); ↳ r6 folded into OD-MN-41 (1); "⭐ OD-MG-6 (MN's row) — VISIBLE" (L643) |
| F096–F101 (fp-final stamps) | HOLD | stamps gone; cured text stands (K, OD-MN-4, OD-MN-10, OD-MN-29) |
| seat 1 items 8–13 (B048/B049, B098, B211, B104 + §3.5 item 9, §2 "as cured", owner frame, §4.1 stop) | HOLD | above |
| B092 B093 B095 B096 (L161, the record) | HOLD | the full record line read side by side: rename to `press01`, `drives`, the current-press-set write, `pactAnswers` — every clause present (L160) |
| B256 B257 B258 B417 (the aspatial march, P5C-14) | HOLD | "ONE WEEK A HOP (a DRAFT design shift, nothing built)"; landed `hopWeeks(digest, fromId, toId, season = null, mode = null)` re-placed (L393); M12 "ONE week per hop"; OD-MN-16 "not on the roster: … the aspatial hop"; 0 hits of "two weeks a hop" |
| B277 B399 (RE-RULED, B.6) | HOLD | §6 L398 freeze/withheld commit; OD-MN-41 (4); M63 |
| B280–B285 (§7 bracket-only paragraphs) | HOLD | folded as plain paragraphs (L409–L412) in their own words; `stretch:<a\|b>` kept, `road{a,b}` gone |
| B344–B346 B367–B370 B395–B400 (M21, M44, M60–M64) | HOLD | word diff: tags only; B368 receipt kept |
| B447 B449 B451 B470–B472 (§12/§13) | HOLD | third `menace_met` producer withdrawn; EXECUTED arc guard; seam words; §13's closing sentence from SMN-22 (L670) |
| random 25 + 2: B028 B039 B056 B120 B121 B140 B146 B149 B152 B168 B176 B194 B197 B198 B204 B223 B225 B290 B307 B310 B312 B318 B415 B422 B321 B333 B081 | HOLD | old vs new side by side (`scratchpad/fvmn/show.py`): each the latest bracket's content, e.g. "M28 asserts the floor — never the prior severity" (L270); "MN mints no relief fork" for struck `menaceReliefAnswer` (L441); "PL's liege share …, PS's border defender (OD-PS-38) and MN's relief read one field force" (L347) |
| whole-volume sweep (old L24–679 de-bracketed vs new, lost numerals and negations) | HOLD | 56 lines flagged, every one read: lost numerals are dates or ids from tags, finding ids, or misalignment; lost negations are change-note phrases ("the inflected word only", "not MN's alone" superseded by the OWNED unit) |
| § cross-references | HOLD | every bare §x resolves to §0–§14, §3.1–§3.5, §4.1–§4.12, §5.1–§5.8 or §10 A–L; the rest name other volumes or ODQ; no "l.NNN" left |
| THE READER'S GUIDE | **FAIL (F1)** | item 3: "BELIEF for every court's answer … the chooser term" vs §4.6 "self is truth" |
| MN-allow.txt | **FAIL (F2)** | `pressTally.danger01` at old L161 (B092), reason "only §14" untrue |
| §12 THE RULINGS · the cure record | HOLD | above |

**CONFIRMED vs PLAUSIBLE:** CONFIRMED by executed scripts and side-by-side reads: the ratchet re-run and each of its four explanations, the allow-file location check (and F2), my marker count of 600, the cure record's byte containment, the old text's identity to `1beabdc85`, the § resolver, the Ruled-date comparison, the guide's "self is truth" contradiction (F1), and every row receipt above. PLAUSIBLE only: the judgement that row K's two renames and the Ruled-column date choices are latest-wins readings rather than new decisions, and that N1–N9 are not fidelity fails.
