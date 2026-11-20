# FRAME-2 · brief B10 — a person is never "it" in the crisis cast's stored strings (one stored cause)

Written by FRAME-2 (the integrating seat). You are a builder of FRAME-2: one unit, one commit, red first. Read whole before you edit: `CLAUDE.md`; `src/domain/crisis/crisisCast.js`; `docs/chair/2026-11-20/content/frame2/B5-NAMES-RESULTS.md` (its census: kinds (C) and (D)); `tests/domain/frame2NamesRule.test.js`; the tests under `tests/domain/` that import `crisisCast.js` (grep).

## The ruling (the chair's, 2026-11-20, verbatim in substance)

"The 598 strings of `crisisCast.js` that speak of their holder as 'it' or a role: not a breach of the names rule, because the row carries its holder's name in its own field and the security lane withholds a cast ENTRY whole, by its holder, never one string of it. BUT THE 18 THAT CALL A PERSON 'IT' ARE A FAULT A DM HEARS: FIX THEM NOW, as their own stored cause, one commit, red first: a person takes the pronoun of that person's own `gender`, else 'they'; nothing else in those lines moves; a town not in that crisis is byte-identical; name what it moves."

B5's census found them: the waverer's reason "its power could go either way" stored on a row whose holder is a PERSON (18 on B5's pool). Find EVERY reason in the cast's closed vocabulary (`CAST_REASONS`, `STAKE_REASONS`, `CAST_ABSENCES`, any sibling) that can be stored on a row held by a person and that says "it"/"its" of that holder; the waverer is the known one; report any other.

## What to do

1. MEASURE FIRST: on a born pool of towns in crisis (every kind, every tier: births by `generateSettlementPipeline({ settType, stressTypes: [kind] }, null, { seed, customContent: {} })` as B5 did, or B7's `gen.mjs` in `docs/chair/2026-11-20/content/frame2/B7-CF10-PROPOSAL-RESULTS.md`), count the stored strings that call a person "it", by kind and role.
2. RED FIRST: a test (add it to `tests/domain/frame2NamesRule.test.js` beside kind (D), or a new file whose basename avoids `census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin`) asserting that no stored cast string calls a person "it"/"its": record its red count.
3. FIX: the reason for a person-held row takes the person's own pronoun from `gender` (she/her, he/his, else they/their, with the verb agreeing), filled where the row is written, from a closed form in the vocabulary (e.g. a `{their}` slot, as `troubleCast.js :: fillReason` does). A row held by a POWER keeps "its". Nothing else in those lines moves.
4. PROVE: (a) every town NOT in crisis is byte-identical (the stored record, digest of `JSON.stringify`) before and after, on a pool of every tier; (b) every town in crisis whose cast holds no such row is byte-identical; (c) in towns that change, ONLY those reason strings change (diff the stored records). Name every pinned figure and golden this moves (grep the fixtures that birth a crisis: the 525-row golden master carries `infiltrated` and `famine`; check whether the waverer is cast there), by file and title. Re-record NOTHING.
5. Gates: your test; `tests/domain/crisis` and every test that imports `crisisCast.js`; `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`. Every run to a file; never through a pipe (`sh scripts/gate-tail.sh <command>`).

One commit by explicit paths (with your results file `docs/chair/2026-11-20/content/frame2/B10-PERSON-NOT-IT-RESULTS.md` and this brief), hooks on, no push, no reset/stash/checkout. Message `fix(FRAME-2 · B10): a person in the crisis cast is never "it": the holder's own pronoun`, red and green counts in the body, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_019yED1SkacgZyeUgMMGhdL4`. No GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in any command's environment. Never edit `package.json`, `package-lock.json`, `supabase/`, `src/domain/veil/`, `tests/security/`.

Final message: at most 200 words: the sha; the count before and after by role; the byte-identity proof; the pins and goldens that move.
