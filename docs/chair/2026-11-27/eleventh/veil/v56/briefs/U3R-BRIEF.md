# SEAT U3R (builder): UNIT 3's REWORK UNDER RULING V28: the covert check at every door that reads a copy

READ FIRST, WHOLE: `COMMON-V56.txt` beside this file. YOUR BRANCHES: code `lane/veil-56-2026-11-27-door2-wip`, cut at
`origin/lane/veil-52-2026-11-24-door2-wip` 08a9dd8fb (= unit 3 as built, 2f849aa53, NOT GRANTED, plus VEIL-52's measure); documents
`lane/veil-56-2026-11-27-u3r-docs`, cut at `origin/lane/veil-56-2026-11-27`, your files under `docs/chair/2026-11-27/eleventh/veil/v56/u3r/`.

## WHAT IS WRONG (V28, F1)
In snapshot mode a map member's, a gallery read's and an import's SOURCE is the FROZEN COPY, and master's client stores that copy already
projected (`useGalleryShareControls.js :: modeRecord` -> `galleryPayloadFor` = `toPublicSafe`, which drops every covert tie). So
`_gallery_apply_member_overrides` finds no covert tie in its source, and the covert tie's `prominentRelationship` passes where the party link
(which reads the live row) withholds it. VEIL-52's measure (PLAUSIBLE to me): born today, 69 of 140 hold a covert tie; in 7 the copy is
served at the three doors from a master-made frozen copy, on the tip's 212 and on unit 3's.

## READ (and no wider)
1. `RULING-V1.md` on the chair's record: V28 WHOLE, V1-3, V21; V27's last paragraph (the lesson).
2. On `origin/lane/veil-52-2026-11-24`: `docs/chair/2026-11-24/tenth/veil/VEIL-52-HANDBACK.md` SECTION 0 only;
   `v52/briefs/FROZEN-COVERT-MEASURE-BRIEF.md`, `v52/briefs/COVERT-UNREAD-BRIEF.md`; `v52/restore.sh` (your machine's recipe);
   `v52/out/U3-212-HUNK.diff` and `U3-SLICE-PROOFS.txt`.
3. On your code base: `docs/chair/2026-11-24/tenth/veil/v52/frozen/` (probe, runner, analyser, `FROZEN-COVERT-TABLE.md`).
4. `git show origin/lane/veil-52-2026-11-24-unread-wip` (662a9c207, COVERT-UNREAD: V28 (3)'s fail-closed case, SQL + twin + test): whole, once.
5. The code you change, WHOLE: `supabase/migrations/212_share_veil_later_cures.sql` and its rollback; `src/domain/display/gallerySecondHomes.js`
   (`withholdCovertCopies`) and what of `galleryVeil.js` it calls; the tests you edit.
6. By grep only, in `docs/chair/2026-11-23/ninth/CHAIR-HANDOFF-NINTH.md` on the chair's record: "N84" and "N95" (the member's chronicle,
   frozen name and tier; doors-3's `_gallery_doors_chronicle` at `origin/lane/veil-doors-3-2026-11-20` 3e1115c81).

## THE WORK, IN ORDER
A. THE MACHINE, then RE-RUN VEIL-52's MEASURE as it stands (`v52/frozen/fc.sh`, four runs): your tables against its, difference by line. This
   makes it CONFIRMED on this account. One line to me.
A2. THE SENTENCE's ORACLE IS THE WRITER (my fault 1 of that measure: its `oraclePS` is the rule respelled, so its "0" proves nothing). For
   every stored town of both pools: which tie's phrasing IS the stored `pressureSentence`, by the engine's own writer (the function that
   draws it; find it from `settlementNarrative.js`), not by a name search. COUNT: sentences that are a covert tie's phrasing; of those, how
   many the name test ("names both ends, or holds the tie's words") misses; at EVERY door, the link included, Reveal off. A served sentence
   that is a covert tie's phrasing is a LEAK: to me at once. Bounded: one hour; past it say what was covered.
A3. THE DRIFT PLANT (my fault 2: (b) was measured with the live row equal to the raw record): freeze by master's path, THEN change the live
   row (i) the covert tie deleted, (ii) one end renamed. Red first at the three doors; this is where only the orphan rule stands.
B. THE BUILD, each part red first, the twin rule for rule:
   (a) the source's own covert ties; (b) PLUS THE LIVE STORED ROW's covert ties (its `relationships[]` and its narration's), judged in the
   link's ONE spelling; (c) THE ORPHAN RULE for the copy: a `prominentRelationship` that is the copy of no tie present in the source's
   `relationships[]` is withheld whole, always. (c) FOR THE SENTENCE: DO NOT BUILD IT UNTIL MY LINE "PS-RULE: ..." (the chair is ruling);
   build everything else first. (d) a source carrying either string and NO `relationships` key is `unread`: fail closed (662a9c207 taken in).
   At EVERY door that reads a copy: the gallery read, the import, the map member. Then: V28 (4) the pin test's new members (snapshot with a
   master-made copy and with a tip-made copy; narrated; marked), each against the link's read of the same town; V28 (5) the stale 212
   comments; V28 (6) per N95, the chronicle and the member's frozen name and tier, WITH N84 (d)'s re-key measure FIRST (a file, then go on).
C. THE PROOFS: your re-run of the measure after the cure (0 telling strings at every door; the clean strings withheld, counted, with examples);
   `galleryMapCovert`, `galleryServerVeil`, `galleryImportEqualsRead` (about 3,000 s alone: detached), the covert-unread test, the pin;
   212 up, down, up on 001..211 with the catalogue dump EQUAL after the down; `tests/security` files that name what you changed; `tests/lint`
   whole; typecheck. Reds by name against the base's.
D. HAND IN: `u3r/U3R-212-HUNK.diff` (`git diff dbd4cd9e5 <your tip>` of 212 and its rollback), `u3r/U3R-PROOFS.md` (one table), and one
   message "TIP? U3R <commit>". I read the hunk whole; then a second independent reader; then the chair. Nothing merges before that.

## NOT YOURS
The header's item number is set at the merge. `get_gallery_map` will later pass the stored row to unit 4's five-argument `_gallery_veil`:
leave `s.data` and the served source in scope and name them in your report; do not build that. MAP-COST is another seat's (MC): if you
re-order `get_gallery_map`'s statements say so, do not tune it. SNAP-CHRONICLE stays parked.
