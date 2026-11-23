READS WHOLE: this file, `close-5/briefs/FLIP-COMMON.md` (its "Where you work" and "What may never happen" only bind you; its re-pin classes do not), `src/data/people/personMention.js`, `tests/lint/personMentionCase.walker.test.js`, and the pronoun test file you add a tooth to. WINDOW: 1,000,000 tokens.

# PRONOUN-2 — THE STOP MARKS OUT OF STRING LITERALS (the ninth chair's N54, 2026-11-23 05:45 UTC; written 2026-11-23 05:46 UTC)
THE RED (the landing's gate on the stack 5e63f2603): `tests/copy/voiceMechanics.test.js` "E2 ... per-file debt exactly matches the
baseline": `src/data/people/personMention.js: baseline em:0 bang:0 -> current em:0 bang:1`. CAUSE: the string literal `'!'` in
`personMention.js :: OBJECT_FOLLOWERS`. The ratchet counts every `!` inside a string literal of src/data and src/domain; its allowlist
covers em dashes only; the file's own `NOT_AFTER_LETTER` already uses a regex literal for this reason.
WHERE YOU WORK: the worktree `/home/user/wt/pronoun2`, branch `lane/close-5-2026-11-23-pronoun2-wip`, cut at
`origin/lane/close-4-2026-11-23-pronoun-wip` 95180c283 (links to `node_modules` and `.husky/_` in place). Logs in
`/tmp/claude-0/-home-user-settlement-engine/c4c5e7a5-54f3-5364-a337-92ee45f01117/scratchpad/flip/PRONOUN-2/`. Another builder works in
`/home/user/wt/flip`: never touch it; heavy runs only through the mutex.
THE CHANGE (RULED): the six stop marks (`, . ; : ! ?`) are no longer string literals in `personMention.js`: ONE regex literal
matches exactly those six, and is read exactly where `OBJECT_FOLLOWERS.has(follower)` is read today (a follower is object when
the regex matches it OR the Set, now holding only the word followers, has it). Every test that reads the Set
(`tests/lint/personMentionCase.walker.test.js`; grep `tests/` for others) follows IN THE SAME COMMIT so that it still classes the
six marks. NO BEHAVIOUR MOVES: every follower's class is what it was. If the exported Set's other readers make that impossible
without a second copy of the rule, STOP.
PROOFS, IN ORDER:
1. RED FIRST at 95180c283: `tests/copy/voiceMechanics.test.js` E2 red with that line (quote it); GREEN after your change.
2. THE EQUALITY PROOF: CLOSE-4's corpus of later mentions, `docs/chair/2026-11-21/eighth/close/close-4/they-measure.mjs` (read it;
   run with `TREE=<a tree>`), on a `git archive` copy of 95180c283 and on your tree: its output byte-equal. AND a wider one you
   write in the scratch: every template string of both callers' tables (the script's own imports) passed through `secondMentions`
   with a set of people names, before and after: byte-equal, the count of strings said. 0 differ, or STOP.
3. A TOOTH in an EXISTING pronoun test file (no new test file, so no door moves): each of the six marks classed object.
4. The pronoun lane's own test files whole (`git diff --name-only 244fa84ef 95180c283 -- tests`); `tests/copy` whole; `tests/lint`
   whole (only the line's three: `proseComposed` A0b; `proseCorpusBytes` RAW and GZIP); `npm run typecheck:ratchet`;
   `npm run typecheck:domain:strict`; `npx eslint` on your files. Each through the mutex, to a log, read by `tail`.
5. ONE commit by explicit paths, the receipts in its message, ending with the two lines:
   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   Claude-Session: https://claude.ai/code/session_01FbPLbczmgBJrps3Eo813m1
   Never push, merge, amend, rebase, --no-verify, pull request.
6. ALSO ANSWER, from git and the files only: why PRONOUN's own proofs did not show this red (which directories CLOSE-4's rule 8
   ran: `docs/chair/2026-11-21/eighth/close/CLOSE-4-HANDBACK.md` section (2)); one sentence.
Report: `docs/chair/2026-11-21/eighth/close/close-5/reports/PRONOUN-2.md` (in the main checkout; not committed by you). Final message at
most 200 words: the commit, the counts, CONFIRMED vs PLAUSIBLE in one sentence.
