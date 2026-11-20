# TRAD-2 builders — the rules every unit brief carries (read whole, with your unit's brief)

You are a builder of TRAD-2 (the seventh chair's seat finishing A DESCRIPTION UNDER EACH TRADITION). TRAD-2 integrates
and reads your diff line by line; you build ONE unit, in ONE commit, red first.

READ FIRST, AND NO MORE THAN THIS BEFORE YOUR UNIT'S FILES: `CLAUDE.md`; this file; your unit's brief;
`docs/chair/2026-11-20/content/traditions/TRAD-1-HANDBACK.md` (what is built and why). Every source file you CHANGE you
read WHOLE first. Cite code by symbol (`path :: symbol`), never by line.

THE OWNER'S WORDS (2026-11-20, all bind you): "Lastly for the traditions card can you give appropriate descriptions per
tradition that draws from coherently the history, power, economy, institutions, etc?"; "I like it make sure that it has
appropriate pool and prose conditions"; "Don't invent drama capitalize on what's already there if it's there. Sometimes a
calm place is precisely what's needed… We are not creating the campaign."

LAWS:
- RED FIRST: every arm you add is run red against the tree before your cure, and you quote the failing title and its
  assertion in your report. A walker is NEVER widened to pass; a register row is a claim with its reason; a frozen
  baseline is re-taken only BY ITS OWN DOOR, and you name every figure that moves (before → after), never sign one.
- NOT YOUR FILES (never edit): `src/domain/traditions/genesis.js`, `src/data/traditionCorpus.js`,
  `src/domain/display/publicSafe.js`, `src/domain/display/galleryVeil.js`, `src/domain/people/cardVeil.js`, anything
  under `supabase/`, `tests/security/` other than the two traditions files named in your brief,
  `src/domain/facts/drawDeclared.js`, `src/domain/facts/factVocabulary.js`, `package.json`, `package-lock.json`, and
  `tests/lint/.lighting-census-baseline.json` (the lighting census is TRAD-2's own, re-taken at each merge: leave its
  walker red if your new test files move it and say so).
- No born town may move: the descriptions are rendered and the reader's rows are drawn at save. Touch nothing the
  generator pipeline runs.
- Names in sentences: a POWER a sentence names goes through `src/domain/display/governanceAccount.js ::
  powerNameInProse`; a HOUSE through `src/data/houseSentenceName.js :: houseSentenceName` (the house's prose form; the
  article is the frame's); never a bare label and never a private copy of either rule. The reader's text names NO
  person at all.
- Gates: every run to a file, read by its count lines; never through a pipe (`sh scripts/gate-tail.sh <command…>`
  prints the tail and exits with the gate's own code). No test run with any of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE,
  GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment. In a fresh worktree, `node_modules` may be
  missing: symlink the main checkout's (`ln -s /home/user/settlement-engine/node_modules node_modules`) and never commit
  it; if a lint file reads `review-fixes-2026-07-08`, it is fetched already in the shared object store.
- GREEN AT YOUR COMMIT: your unit's arms; every test file that names a module you changed (find them with `git grep -l`);
  `tests/lint` WHOLE (state each red file by name and cause; the lighting census may stay red, by count, for TRAD-2);
  `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`: each exit 0.
- COMMIT: ONE commit on your worktree's branch, by explicit paths (`git add <path>…`), hooks ON (never `--no-verify`),
  the message carrying your receipts (red titles, green counts, figures moved). NEVER push, never a pull request, never
  touch another branch. Read the author line of your commit before you finish.
- REPORT (your final message, at most 300 words plus one table): the commit sha and branch; per arm, red then green with
  counts; every file changed; every stored figure moved (before → after); what is EXECUTED told from what is PLAUSIBLE;
  anything you noticed that is not your unit (do not chase it).
- Every hour you write is read from `date -u` in the command that writes it.
