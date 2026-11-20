# FRAME-2 · brief B5 — the names rule in FRAME-2's own files

Written by FRAME-2 (the integrating seat) on `lane/frame-2-2026-11-20`. You are a builder of FRAME-2: one unit, one commit, red first. Read whole before you edit: `CLAUDE.md`; `src/domain/display/governanceAccount.js` (the helper `powerNameInProse` and its doc comment); `src/domain/summary/tonightSheet.js`; `src/domain/tension/troubleCast.js`; `src/domain/crisis/crisisHooks.js`; `src/domain/crisis/crisisCast.js`; and the tests that import each of them (find them by grep).

## The ruling (the chair's, verbatim)

"THE NAMES RULE IS YOURS IN YOUR OWN FILES (another seat, NAMES-1, leaves `src/domain/summary/tonightSheet.js`, `src/domain/crisis/crisisHooks.js` and `crisisCast.js` to you): a power in a sentence takes its prose form with its article through the one helper (`src/domain/display/governanceAccount.js :: powerNameInProse`); a person's second mention in one sentence is a pronoun from that person's own `gender` where no second person of that gender is in play, else the role, else the surname, else the given name; a pronoun or a role is never the ONLY reference to a person or a power in a stored string. Say what you changed and what you left."

Your files: those three, and `src/domain/tension/troubleCast.js` (the frame's own). No other source file. You do NOT edit `governanceAccount.js`.

## What to do

1. **MEASURE FIRST.** On a born pool (at least 10 towns a tier, thorp to metropolis, calm and in crisis: births by `generateSettlementPipeline({ settType }, null, { seed, customContent: {} })`; choose seeds and say which), collect every sentence the four files compose (the sheet's opening, people lines, hooks, frame reasons; the crisis hooks; every string the crisis cast stores or composes) and classify each breach of the rule by kind:
   (A) a power's name in a sentence NOT through `powerNameInProse` (a raw `faction` string spliced into prose; a doubled article "the The ..."; a missing article; "Military/Guard" where its prose form is "the Guard");
   (B) a person's second mention in one sentence repeated by full name where the rule wants a pronoun (gender known, no second person of that gender in the sentence) or a role/surname;
   (C) a pronoun or a role as the ONLY reference to a person or a power in a STORED string (a field written into the settlement document: in these files, what `crisisCast.js` stores on the crisis record; find which strings are stored and which are composed at render);
   (D) a pronoun that disagrees with the person's own `gender`.
   Write the census (count by kind and by file, three examples each) into your results file before you change code.
2. **RED FIRST.** A test file under `tests/domain/` (basename avoiding the mutation manifest's pattern `census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin`) that asserts, over the born pool, zero breaches of (A)-(D) in each file's output. Run it at the current tree and record the red count by kind.
3. **FIX** each breach at its source in the four files, using `powerNameInProse` for every power in a sentence (`start = true` at a sentence's head) and a helper of your own in the file that composes the sentence for the person's second mention. Do not change what a sentence says, only how it names. Do not touch a string that is the record's own text copied verbatim (a tension's sentence, a hook from the template): those are NAMES-1's or the generator's; list them.
4. **STORED STRINGS MOVE GOLDENS.** If a fix changes a string `crisisCast.js` STORES at generation, a stored town changes: name every golden or pinned figure that moves (run the tests that read crisis towns' stored records and list each red by file and title), and do NOT re-record any golden: report them. If the stored change is large, stop at the census and report instead of fixing: the seat will rule.
5. Green: your test; every existing test that imports the four files.

## Gates

Every run to a file under `/tmp/claude-0/-home-user-settlement-engine/a24e1eb5-d90d-5963-a121-dbebc78118f8/scratchpad/`; read the count lines; never through a pipe (`sh scripts/gate-tail.sh <command>`). Then `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`.

## Commit

One commit, explicit paths, hooks on, no push, no reset/stash/checkout. Your results file: `docs/chair/2026-11-20/content/frame2/B5-NAMES-RESULTS.md` (the census before and after; what you changed; what you left and why; the goldens that move). Message `fix(FRAME-2 · B5): the names rule in the sheet, the crisis hooks, the crisis cast and the trouble cast`, red and green counts in the body, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_019yED1SkacgZyeUgMMGhdL4`. No GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in any command's environment. Never edit `package.json`, `package-lock.json`, `supabase/`, `src/domain/veil/`, `src/domain/display/`, `src/domain/rulingPower*.js`, the generators.

Final message: at most 250 words: the sha, the census before and after by kind, what you left, the goldens that move.
