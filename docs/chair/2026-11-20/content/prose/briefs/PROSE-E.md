# BRIEF: PROSE-E PHASE 2, THE CURE (PROSE-6's builder; the chair's N70, 2026-11-23 07:28 UTC)
YOU BUILD ON `lane/prose-6-2026-11-23-e-wip`, in the worktree `/home/user/wt-e`, cut at b443be64b. `node_modules` there is a symlink: never commit it.
- Commit by EXPLICIT paths only.
- Never push, never touch another branch, never `--no-verify`, never `npm run check`, never the whole suite.
- Every run goes through `sh scripts/gate-mutex.sh --run -- <cmd>`, logged under /home/user/logs with its exit code appended. Never read a log through a pipe; one heavy run at a time.
- After ANY test-file change, run `tests/lint` WHOLE before calling it green.
- If your own permission check refuses a command: stop, and report the exact command and the reason. Try nothing else to the same end.
THE WORDS, the ONLY source: `lines/DISAGREE-E-LINES.md`, FINAL at 24d8edf83. Read it with `git -C /home/user/settlement-engine show lane/prose-6-2026-11-23:docs/chair/2026-11-20/content/prose/lines/DISAGREE-E-LINES.md`. Use the words as written. If a walker refuses a line: STOP, and report the line and the walker.
THE MEASURE behind it: `map/DISAGREE-E-PHASE1.md` and `map/disagree-e-phase1.mjs` at the same ref.

## 0. FIRST, ON PAPER: WHY NO-MARKET v12 NEVER DRAWS
GEN-13 `NO-MARKET` v12 is eligible on all 254 P1 pages and drew on none. Read the kernel's own rule that decides this (`stateProseKernel.js` and whatever the general desk passes it) and say it in at most 4 lines, with file:line. Read it; do not guess.
If v12 CAN print beside ECO-10 `POSTURE: established` on any class of page: STOP, and report the rule and that class.

## 1. THE TOOTH FIRST (red first), in `tests/helpers/oppositeSentencePairs.mjs` and `tests/domain/oppositeSentencePairs.test.js`
- `PINNED_OLD_WORDS` gains five rows, keyed by pool and vid, holding each OLD text as the lines file gives it: GEN-13 `NO-MARKET` v10; DEF-2 `Internal Security: full legal chain (court AND prison)` v1 and v2; DEF-2 `CHAIN: food trades working` v1; DEF-2 `Economic Survival: CRITICAL` v1.
- `OPPOSITE_PAIRS` gains the two watched rows:
  - general DS-GEN-13 `NO-MARKET` v12 × economy DS-ECO-10 `POSTURE: established` (all its vids);
  - defense DS-DEF-2 `Economic Survival: CRITICAL` v2, v3 × general DS-GEN-17 `GARRISONED` v1.
- ARM 1 takes the P1-P4 seeds of the measure, at least one per TRUE variant pair, among its seeds.
- ARM 2's positive controls cover each new row's two sides.
Commit the tooth ALONE first. Show it RED on these unchanged leaves: ARM 5 on the old words, with their seeds by name. The new pair rows read 0 there too, as watched.

## 2. THE CURE
- Five rows of `WORD_CORRECTIONS` in `scripts/generate-dossier-state-prose.mjs`, in the DS-DEF-2 WEAK rows' form, ruling `CHAIR-2026-11-23-N70`.
- The same five texts in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, each on its own line, with marks unchanged.
- Then `npm run gen:dossier-prose`, and `npm run gen:dossier-prose -- --check`, which must exit 0.
- The tooth goes green.

## 3. THE PINS ON THE OLD WORDS (test-only, each re-stated by its cause; a pin that guards a MEANING is kept)
Grep `tests/` by the five pools' keys, by `dossierStateProse` (the leaf DIRECTORY), by the changed files' names and exported symbols, and by each old text's distinctive words. Expected:
- `tests/domain/bar8DesksDef.test.js` :8, 64-65, 187-200 (full legal chain);
- `tests/domain/corpusCureGuards.test.js` :72 (CHAIN working v1): SAY what its `gone` guards, and that it still holds;
- `tests/helpers/pageLaws/law13K.mjs` :22, 33 ("heard and held" is kept);
- `tests/domain/generalStateProseDesk.test.js` :500-512 (T1-13: green UNCHANGED).
Name any other hit. Say each pin, before and after.

## 4. PROOFS (b443be64b against your tip)
- (a) The tooth: red first, then green.
- (b) The 900-birth read, by `map/disagree-e-phase1.mjs` run on your tip:
  - the five old wordings print on 0 pages;
  - the same 14 variant pairs now print with the NEW words, so give their pages and re-read one page of each: TRUE or NOT, with why. Any TRUE: STOP;
  - the two watched rows at 0;
  - `OPPOSITE_PAIRS` and `PINNED_OLD_WORDS` at 0.
- (c) No cell left empty: the same count as at b443be64b (dz-city-101 alone).
- (d) THE DARK PROOF, as `map/disagree-dark.mjs` on `/home/user/wt-disagree` takes it: the digest over every non-string field of the 900 records must be EQUAL. Give the sha and the count. Then list the strings that differ (only these five sentences).
- (e) `proseMoveGrammar` CONTROL 4, MEASURED: its three figures (repeatedOpener 166; share ×800 154; share 0.193). If any moves: STOP and report the pool and why.
- (f) Rule 8 by directory and exported names, as the landing runs it, in ONE run:
  - every test file naming `dossierStateProse`, `generate-dossier-state-prose` or `oppositeSentencePairs`, or an exported symbol of a changed file;
  - every file whose name contains `StateProse`;
  - `tests/copy` whole.
  Then `tests/copy`, `tests/store`, `tests/architecture` and `tests/docs` whole; `tests/lint` whole; ONE `npm run build`, then `VERIFY_DIST=1` on `tests/build` whole, with the five figures. Every red goes BY NAME against RED-AT-LINE.tsv (`git -C /home/user/settlement-engine show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv`; match by containment).
- (g) After any whole check: `git config --local --get core.bare`, `user.name`, and `git log --all --since='3 hours ago' --author=Fixture`.

## 5. THE REGISTERS: NOT NOW
Do NOT re-take any register: the shift register, the observed-shape baseline, the lighting census, the wiring census, proseCorpusBytes or proseComposed. The chair takes them LAST, after the line moves. List each one that reds BECAUSE of this cure, by name, with its figure before and after.

## REPORT
Write `docs/chair/2026-11-20/content/prose/PROSE-E-REPORT.md` in the worktree, at most 80 lines, committed. It holds item 0; the commits; (a) to (g); the registers that red; anything refused, word for word. Final message to me: at most 200 words.

## AMENDMENT 1 (the chair's N71, 2026-11-23 07:40 UTC; it rules your stop at item 0)
- Item 0 is ANSWERED by your probe: v12 draws, and prints as the bare cut "{settlement} has no market." on 46 pages. Write that rule into the report with its file:line.
- v12 is NOT re-worded. The watched row for NO-MARKET v12 × ECO-10 `established` is DROPPED from `OPPOSITE_PAIRS`. It becomes a `PINNED_TAILS` row in GEN-17 v2's form: v12's tail after its first cut ("trades in a small way: a sack here, a bundle there, carried between neighbours") prints on 0 pages. The CRITICAL v2, v3 × GARRISONED v1 watched row stands.
- The tooth's header names the matcher's FLOOR: a clause cut under four literal words is not matched (`oppositeSentencePairs.mjs:97`). Leave a placeholder for the FLOOR measure's figure, which a second agent is taking beside you; I give you the figure. The floor itself is NOT changed.
- THE REPORT gains, for each of the five re-worded lines, EVERY FORM THE PAGES PRINT: whole, and each cut, read from the readers' code (`siteClause` in `generalDeskRead.js` and its like on the defense and economy desks). Quote each form, and say which mount prints it. Each printed form is judged against the cell it stands beside, not only the whole sentence.
- Everything else in this brief stands. Go on from item 1. One heavy run at a time on the box: a second agent shares the mutex with you.
