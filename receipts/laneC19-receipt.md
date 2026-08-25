# Lane TE-C19-RECOUNT receipt — COMPLETE

Chartered: ODQ §560.8 / DW-PREP brief §7 — Dwellings charter sub-form recount. Seat: Fable, solo, read-only. 2026-08-24.

## RESUME POINT
DONE: everything. All seven obligations discharged; all deliverables written; final report handed to the chair.
REMAINING: nothing. This lane is closed.
EXACT NEXT COMMAND (for a successor re-verifying): `node /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/c19/adjudicate.js` — re-emits every figure, TSV, control, collision list and the edit spec from c19/charter.md (itself re-extractable via `git show '029268fe579b2cbd64e9941b66e77639133f072e:charters/draft-DWELLINGS-CHARTER.md'`).

## RULED FIGURES (all CONFIRMED, mechanical + independent-parse cross-check)
- CIRCULATION (§2.4, L809-848): floor 59 / **ruled 61** / ceiling 62. Claim was ~55.
- STORAGE (§2.5, L849-885): floor 49 / **ruled 54** / ceiling 58. Claim was ~35.
- Per-class: CIRC THROUGH_ROOM=4 CROSS_PASSAGE=5 CORRIDOR=8 GALLERY=12 LONG_GALLERY=0 LOBBY=8 STAIR_HALL=10 VERTICAL=5 EXTERIOR_WALK=9. STOR CLOSET=8 PANTRY+BUTTERY=5 LARDER=2 DAIRY=3 STILL_ROOM=0 SCULLERY=0 STORE=23 CELLAR/UNDERCROFT=7 ATTIC/GARRET_STORE=6.
- 9 circ top classes CONFIRMED; 6 polarity members CONFIRMED (ABOVE/BELOW one member; NOT_ON_SUSPENDED_TIMBER outside per L878); "five measured width buckets" CONFIRMED.
- First-pass naive figures REPRODUCED exactly: CIRC 86 = distinct per-line backticked UPPER_SNAKE(/alt) segments; STOR 69 = cross-line backtick segments, UPPER(')-tokens at brace depth<=1 outside parens, slash-joined, distinct.
- Claim sites: exactly five (L826, L851, L1047, L1894, L2992-2993) — whole-doc sweep over 3,070 lines found no sixth. L1055/L1904 mention sub-forms but carry no figure.
- Controls: ACCURACY (GALLERY 12 hand=mech exact order; STORE 23 hand=mech exact order); CAN-OVER-COUNT (circ column boundary removed -> 79; stor depth/slash boundary removed -> 61); CAN-MISS (circ underscore-required -> 20; stor per-line backticks -> 15). All fired.
- Cross: circ-subs ∩ stor-subs = 0 (matches first pass). Collisions found: 8 vs landed ROOM_KINDS, 28 vs chartered CELL_KINDS, 2 vs chartered PARTIS (BARBICAN, LONGHOUSE), 2 vs fixtures (CHUTE, GATE), 0 vs FURNISHING_KINDS/JOINT_KINDS/joint-attrs/RECESS/SUBDIVISION. Full list: c19/cross-collisions.txt.
- LADDER ORPHAN (CONFIRMED): §2.4 L822 annotates `LADDER`(fixture), but 'ladder' is in NO fixture roster (landed 22 + chartered 60 = 82 names, 0 hits) and no cell-kind row. Chair decision: 61 + add ladder as 83rd fixture, or 62 and strike the annotation.
- ENVELOPE: not a vocabulary in this charter (0 token occurrences; prose-only). JOINT_KINDS landed file is src/domain/undercity/jointVocabulary.js, NOT under interior/ (brief correction).

## Deliverables (all in scratchpad)
- c19/adjudication-circulation.tsv (121 rows) · c19/adjudication-storage.tsv (103 rows: 102 inventory + supplement PAIR)
- c19/claim-site-edits.md (6 byte-exact line edits across the 5 sites + chair notes)
- c19/cross-collisions.txt · c19/adjudicate-output.txt (full quoted run) · c19/extract.js + adjudicate.js (re-runnable) · c19/inventory-{circ,stor}.txt · c19/naive-stor-tokens.txt · c19/charter.md (source extract)

## Judgment calls (all vetoable, recorded in TSVs + edit spec)
J1 chartered five classes insufficient — attr-enums/fields/prose/name-parts/variants classed as `other:<sublabel>` rather than shoehorned.
J2 LADDER excluded from ruled (charter's own annotation is authoritative); ceiling includes it; orphan flagged.
J3 `+ enfilade` counts (L827-828 names it an added specialisation); floor excludes for shape.
J4 per-(class,form) counting: BACK, BONDED, SMOKE_LOFT each count twice; floor collapses.
J5 slash pairs one form; nested braces (COLD{WET|DRY|GAME|FISH}, {2|3}, {hoist}, {noFire}) are parameters; ceiling re-admits the COLD four.
J6 "the PAIR" counts as a listed member; floor excludes.
J7 REQUIRED_ABOVE/REQUIRED_BELOW = one polarity member (forced by "six members" closed-set arithmetic).
J8 PANTRY+BUTTERY = one compound top-class; storage top level = 9 (informational, no charter claim).
J9 minimal byte edits at claim sites; L826 parenthetical retained as history (45+7=52 never equalled ~55 either); optional rider drafted.
