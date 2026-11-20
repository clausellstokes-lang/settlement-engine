# NAMES-1 builder brief: a power in a sentence takes its article (CN1)

Written 2026-11-20 05:07 UTC by NAMES-1. One family of composers per builder; the family's files are listed below.

## The rule (the seventh chair's ruling CN1; the owner, 2026-11-20: "Do it pre deploy. I like it.")

A power's catalogue label is a category, not a proper noun. Every SENTENCE a DM reads that names a power says it WITH ITS
ARTICLE: "The Feudal Appointee has been debating market levies", "Wants to stop the Religious Authorities from taking
anything more from the Elder Council". Today these print bare ("Feudal Appointee has been debating…") or with a capital "The"
in mid-sentence ("from The Guard"). A label in a table, a chip, a heading, a list or a key stays exactly as it is: only
sentences change.

## The one helper (do not write another)

`src/data/people/powerSentenceName.js :: powerNameWithArticle(name, start)`, re-exported from
`src/domain/display/powerSentenceName.js`; `src/domain/display/governanceAccount.js :: powerNameInProse` returns it too.
- `powerNameWithArticle(n)` gives "the Elder Council", "the Guard" (for "Military/Guard"), "the Independent Bloc" (for "The Independent Bloc").
- `powerNameWithArticle(n, true)` gives "The …" for a slot that OPENS a sentence.
- Where the template already writes "the" before the slot ("the {seat}"), use `powerNameAfterArticle(n)` (no article). It
  must never read "the the".
- A possessive is the article form plus "'s", or plus a bare "'" for a plural, as the file already forms it
  (`powerPossessive` gives the body's possessive: prefix "the "/"The ").
- Import from the nearest lawful home: `src/data/**` files import `../data/people/powerSentenceName.js` (a data file must never
  import `src/domain/`); generators and domain files import `src/domain/display/powerSentenceName.js`.

## Your family (its files are your whole manifest; touch nothing else in `src/`)

Given in the message that seats you. Find every place in your files where a POWER'S NAME (a `faction`/`power`/`name` of a
`powerStructure.factions[]` entry, a ruler, a governing power, a rival) is put into a sentence, and fill it through the
helper. Template literals (`${a} and ${b} are in conflict`) need the sentence-start form where the name opens the
sentence. A slot table (`{faction}` filled by a function) needs the fill changed once, plus the opening capital.

## Laws

- **Never rename or move a function, export or file.** The security lane binds its rows to writers BY SYMBOL: change what a
  function writes, never what it is called or where it lives. Add no new top-level named numeric constant.
- **Not yours, never touch:** `src/domain/summary/tonightSheet.js`, `src/domain/tension/**`, `supabase/**`,
  `src/domain/display/gallery*.js`, `src/domain/veil/**`, `tests/security/**`, `package.json`, `package-lock.json`, any
  golden fixture (`tests/fixtures/*golden*`) and any register or baseline JSON.
- **No git command that writes:** no add, commit, stash, checkout, reset or restore. Other builders work in this same tree
  on other files. NAMES-1 commits.
- **Read every file you change WHOLE** before you change it.
- A test that pins the old sentence text of YOUR composers is re-pinned to the new text, in the same test file, with a
  trailing comment `// NAMES-1 (CN1): the article`. Never weaken an assertion, never delete an anchor, never skip a test.
- A golden-master or golden-corpus hash test that goes red because generated text moved is EXPECTED: do not touch it, and
  list it in your report by file and test title.
- Gates: never read a gate through a pipe. Run your own tests as
  `npx vitest run <files> > /tmp/<you>.log 2>&1; echo $?`, then grep the log. Never run the whole suite.

## Proof you report

1. Your walker figure. `npx vitest run tests/lint/namesInSentences.walker.test.js --reporter=verbose` prints the CN1 arms'
   first twenty offenders by stored path. Your family's paths must be gone from that list (the arms count every family, so
   they stay red until all four land). Report the arm's count before and after your work.
2. Every test file that imports one of your files: run it, and report pass/fail counts and every red with its title.
3. Ten sentences, before and after, from your composers. Read them as prose: "the Merchant Guilds need the Elder Council",
   never "the the", never "The" mid-sentence.

Report in at most 300 words: files changed; the counts; each red with its title and whether it is a golden (expected) or
yours to fix; anything you could not do and why.
