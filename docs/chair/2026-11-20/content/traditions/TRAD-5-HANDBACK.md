# TRAD-5 — THE HAND-BACK (kept current at every push)

Written 2026-11-20 18:45 UTC (`date -u`). Branch `lane/trad-5-2026-11-20`, fast-forwarded to TRAD-4's final tip `a7473f47c` on the
chair's word "THE LANE IS YOURS at a7473f47c" (18:44 UTC). A successor needs THIS FILE and the open briefs under
`briefs/` only. Earlier hand-backs are history; every ruling in force is restated below.

## 1. THE RULINGS IN FORCE, ONE LIST (the seventh chair's unless marked; each vetoable by the owner)
1. THE OWNER'S WORDS (2026-11-20, verbatim, all bind): "Lastly for the traditions card can you give appropriate
   descriptions per tradition that draws from coherently the history, power, economy, institutions, etc?"; "I like it make
   sure that it has appropriate pool and prose conditions"; "Don't invent drama capitalize on what's already there if it's
   there. Sometimes a calm place is precisely what's needed… We are not creating the campaign."; (~15:44 UTC) "So do what
   you can to comprehensively fix the sameness fault as much as you can".
2. CTR1–CTR10 with ADDENDUM 1 (CTR9), verbatim in `docs/chair/2026-11-20/seventh/prompts/TRAD-1.txt` on
   `origin/lane/chair-2026-11-08`: two or three plain sentences from the town's own record (what is done; who keeps it;
   where it comes from; who pays or presides), a clause only where a closed authored table fits a fact; nothing invented;
   the traditions themselves unchanged (`genesis.js` not edited); derived at render, nothing stored, keyed picks only; the
   leaf takes its audience; level words (calm); the house's prose laws; pools with floors, every line a declared line
   drawn through `drawDeclared`, the crisis dimension with twins; the shared page shows the owner's set drawn at save into
   `publicProse` as text.
3. On TRAD-1's proposal: default audience `'reader'`; the dead's cause only for an event graded MAJOR or CATASTROPHIC; the
   economy sentence out of its ledger voice; a third fair and feast frame; the search index composed with the view's own
   audience; in play the description follows the record's owner.
4. The reader's text names NO PERSON; it is drawn at save and may name nothing a LATER act of the DM could hide; the proof
   covers every address the Curate screen can hide.
5. CTR11: THE READER'S TEXT IS A FUNCTION ONLY OF FACTS NO ACT OF THE DM CAN HIDE (every word named or chosen, by class);
   the owner's page unchanged. The reader never reads `history.founding.foundedBy`; the reader's view strips houses'
   `tags` (the market fact reads the catalogue's tags by NAME); the dead's cause names an event by its KIND ("the siege",
   "the great fire", "the flood", "the years of sickness"), with the totality guard.
6. THE READER'S DEAD-CAUSE WORD RULE (unit 7): an event whose name shares a word with any held name (letters and
   apostrophes; held word less end apostrophes and 's; `HELD_NAME_STOP_WORDS`; prefix catch; the whole name, full and bare,
   as a floor) is never the reader's cause. In the reader's view a power keeps no field any faction eye can remove.
7. THE SHARED SET (CTR9 amended, (B)): the owner's set stays; rows drawn for the shared page admit BY THE FLOOR ONLY, and
   the floor excludes the hideable class by the security lane's one predicate (`people/cardVeil.js :: isHideableHouse`,
   read, never copied); served rows numbered densely in served order. NO WORDING OF A FIELD A SHARED READ SERVES IS CHOSEN
   BY A HOUSE OF A HIDEABLE KIND OR BY ANY FACT ABOUT CRIME; every other house a wording needs is LISTED in §5 for the
   security reader at the join. The shared text's verdict is HOLDS (REVIEW-VEIL-13, 16:06 and 16:20); unit 8 is CLOSED
   (the import door is not a leak: an unmarked share is served exactly, 211's design). Not re-opened.
8. NAMES IN SENTENCES: a power through `governanceAccount.js :: powerNameInProse`; a verb after a power through
   `src/data/people/powerSentenceName.js :: powerVerb`; a house through `src/data/houseSentenceName.js`; NO PRONOUN AFTER A
   POWER'S NAME (point 82 is on the line, not here). NO NEW LINE SAYS "the town" or "a town"; `{town}` is the place's name.
9. THE LEAF MOVES NO BORN TOWN: 1,245 documents (golden 525 + census 720) byte-identical, base `441ec3b32` (or
   `0c9069489` by `git archive`; sha256 `d70950941f33…a002a`) vs the tip, by `tools/born.mjs` and `cmp`, at every merge.
10. THIS LANE IS ON AN OLDER BASE THAN THE WORKING LINE: it NEVER merges `lane/join-2026-11-14`, `lane/kernel-mix-*` or any
    branch holding the line's tip; it CHERRY-PICKS (`e32c9b27e` = `bd42d63c7`, the kernel's `pickVariantMixed`). The
    chair joins the lane to the line.
11. CRISIS: an excluded feast/fair/harvest-thanks line yields to its twin under ANY active crisis; the text never says what
    became of the rite this year (only `lastOutcome` where the record holds it).
12. THE GLOSS FLOOR IS THREE A POOL. NO FIRST SENTENCE SAYS "KEPT" TWICE (unit 9).
13. NO TOWN PRINTS A SENTENCE TWICE (unit 10): rotation inside the town over the surface's set
    (`shownTraditions.js :: descriptionSetOf`); the keeper's fourth and fifth wording "too" (`KEEPER_FRAMES_TOO`, never a
    pick); the payer left out where its slot runs short. Bar 0 of 432, owner and reader.
14. THE FOUNDER PHRASE ENDS THE FOUNDING SENTENCE (unit 11; the chair's three frames verbatim); the reader's
    `foundingBare` untouched.
15. THE LEAF PICKS BY `pickVariantMixed`, key `${seed}::${id}#<slot>` (unit 11's second commit); unit 6's counts re-taken
    after it; the owner's four files re-cut ONCE, from the same towns, with one paragraph of what moved.
16. THE BAR: no sentence on more than about 15% of all places of a size (to 20% passes as sampling); inside a town none twice.
17. A KEYED CHOICE NEEDS NO NEW DRAW; a saved town keeps its stored sentence. Fortune: if a clause reads the fortune label,
    say so (none does: the economy clause reads `incomeSources` rank only).
18. GATES at every merge: the module test files, `tests/lint` WHOLE (ledger fetched), `typecheck:ratchet`,
    `typecheck:domain:strict`, `npm run lint`; ONE heavy gate at a time (`scripts/gate-mutex.sh --run`); never through a
    pipe (`sh scripts/gate-tail.sh`); never the whole suite; the lighting census re-taken BY ITS OWN DOOR, by count.
19. PUSH: only `refs/heads/lane/*` (this branch and its builders' `-wip`); plain pushes with the hooks; never
    `--no-verify`, a force push, master, or A PULL REQUEST; `git ls-remote` and the commits' author read before every push;
    never a push with nothing to send; no hosted database, credential, `supabase` or deploy.
20. NOT THIS LANE'S FILES: `genesis.js`, `traditionCorpus.js`, `publicSafe.js`, `galleryVeil.js`, `cardVeil.js`,
    `supabase/`, `tests/security/` beyond the traditions' own born test, `drawDeclared.js`, `factVocabulary.js` (read only).

## 2. THE UNITS (earlier units: TRAD-4-HANDBACK §2)
| unit | what | state | commit |
|---|---|---|---|
| 10 | no town prints a sentence twice | MERGED by TRAD-4 (`9530bd22f`); its gates re-run by TRAD-5 at `a7473f47c`: module files 0, `tests/lint` 3303/3304 (census only), typechecks 0, eslint 0; census by its door `24a01c130`; then `tests/lint` WHOLE 221/221, 3304/3304 | `ea1e2ffaa` |
| 11 | founder phrase last (`d32f044d6`); `pickVariantMixed` at the leaf's pick (`dbfca2aa1`); the table's header comment (`b328a9b5a`, TRAD-5's builder, brief `briefs/TRAD-5-U11-COMMENT.md`) | READ ONCE, red re-run at `e97a917b7`: 3 failed / 140 passed, exactly its three new arms; MERGED `37b3f9dcd`; gates there: module files 262/262, `tests/lint` 3306/3307 (census only), typechecks 0, eslint 0, confinement 1,245 identical | `lane/trad-5-2026-11-20-u11-wip` |
| 12 | unit 6's measures re-taken on the final leaf; the owner's four files re-cut once from the same towns; HOUSES.txt (brief `briefs/TRAD-5-U12-RECUT.md`) | READ, MERGED `96d4c7b22` (docs and the lane's tools only); census by its door `624e5a9ba` | `lane/trad-5-2026-11-20-u12-wip` (`1a86ee712`) |

## 3. FOR THE OWNER (plain text beside this file, re-cut once by unit 12 from the same towns as TRAD-4's first cut)
`TRAD-5-SAMPLES-30.txt`, `TRAD-5-SAMPLES-CRISIS-12.txt`, `TRAD-5-MEASURES.txt`, `TRAD-5-FOR-THE-OWNER-SHARED-PAGE.txt`;
each opens with one plain paragraph of what moved (no sentence twice in a town: 94 of 432 towns before; "kept"/"keeps"
twice: 13 calm rites and 29 under famine before; the founding sentence ends on its founder: 387; "A common feast" picked
55% -> 24%). `out-trad5/RUN.txt` re-makes every figure. The shared-page count (0 of 432) was NOT re-run (no tool computes it).

## 3b. NAMED SURVIVORS (not built now)
- An imported clone re-draws its traditions (the sanitizer drops `traditions`; 0 of 140 clones show the served set).
- The PDF with a lit mirror prints a sentence twice in 2 towns (Silberwiese, Hisntappa: mirror rows the owner's set drops,
  described alone); the player tab 0. The PDF's and the player tab's rites outside the drawn set.
- The dead `recordCleanOf` reader.
- CTR11's "other direction" line for the owner: 17 of 1,232 rites (re-taken by unit 12: still 17; the figures file's raw 34
  compares a rite in its set with the same rite alone, so 17 is the like-for-like count).
- The leaf rotates no S1 lead: a town whose two rites share an act and print no gloss could repeat a lead (0 of 432 do).
- The owner's page only: the payer's rank counts a criminal income row (17 rites' rank word); a criminal power that is not
  hidden could be named as an owner-page keeper (0 rites in the six pools).
- `tests/kernel/proseHash.test.js` counts as parked in the lighting census (473) from the cherry-pick: the chair's, at the close.

## 4. EXECUTED vs PLAUSIBLE
EXECUTED by TRAD-5: the confinement (`born.mjs`, base `441ec3b32` archive, sha `d70950941f33…a002a`) at `e97a917b7` (code
equal to `a7473f47c`) and at `37b3f9dcd` (code equal to the final tip): 1,245 documents cmp-identical each time. The gates
in §2. Unit 11's and 12's measures are the BUILDERS' (executed by them, receipts in their commits), not re-run by TRAD-5.

## 5. HOUSES THE POOLS NEED (for the security reader at the join)
`out-trad5/HOUSES.txt` (by `tools/houses.mjs`, `isHideableHouse` CALLED): 57 houses, 0 hideable (catalogue at every tier,
and 0 of 4,000 born in the calm pool). Atoms that read a house: `institution: smith`, `market`; atoms reading no house:
`navigable`, `river`, `coast`. No wording reads a fact about crime: the leaf reads hideable houses, veiled powers and the
criminal income only to leave them out of the reader's text.

## Updated (append at each later commit, with `date -u`)
- 2026-11-20 19:48 UTC — the lane taken at `a7473f47c`; unit 10's gates re-run and the census by its door (`24a01c130`); unit 11 merged
  (`37b3f9dcd`); unit 12 merged (`96d4c7b22`); the census by its door again (`624e5a9ba`). NEXT: `tests/lint` whole at the
  final commit, then "TRAD <commit>".
