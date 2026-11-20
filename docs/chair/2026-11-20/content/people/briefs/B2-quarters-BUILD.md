# PEOPLE-1 builder B2: the quarters of a place, built (DRAFT until the chair's ruling is quoted below)

THE CHAIR'S RULING (quoted verbatim by the integrator before this builder is seated): _pending_.

## What you build
The pools of `PROPOSAL-quarters-desc.md` §7 (in `docs/chair/2026-11-20/content/people/`; the wordings are `measures/m2-quarters-pools-atoms.mjs`), as amended by `READ-M2-quarters.md` and the ruling above. Wordings that need a key the chair has not granted are LEFT OUT and listed in your hand-back.

## Files you own (nothing else)
- `src/data/quarterDescPools.js` (NEW). It holds every branch's pool, each row `{ text | template, needs, excludes }` in the house's declared-line shape, and the item tables beside them (each item row declares its own atoms). Index 0 of a pool is today's exact line, declared with what its words truly need.
- `src/generators/spatialGenerator.js` (read WHOLE first). `generateSpatialLayout` gains a fifth argument `{ seed, facts }`. Each quarter's `desc` is chosen through `src/domain/facts/drawDeclared.js` against `factsOf(settlement)`, with `draw: (p) => pickVariant(p, key)`, keyed `'<seed>|quarters.<quarter name>.desc'` (the precedent is `src/generators/steps/institutionDescDraw.js`). A slot's items come out through `lineText` or a per-position `drawDeclared` with its `used` set, never a `.map((l) => l.text)` over filtered rows. No new `instNames.some/filter(` scan (`tests/joins/labelJoins.test.js`). A falsy seed takes index 0 unconditionally. The quarter SET, the names, the gates and `quarters.length` do not change.
- `src/generators/steps/economyReconcilePass.js`: ONE call line, passing `{ seed, facts }`.
- `docs/census/declarations/SPATIAL_TEXT.json` and `tests/domain/facts/census2dTables.test.js :: inlineArm('SPATIAL_TEXT', …)`: the ledger's `source` moves to the new data file, with one row per wording. Add the data file's row to `tests/lint/presumedThings.shared.mjs`. The presumption walkers go green BY DECLARATION, never by an exemption.
- Your new test file(s), whose basename avoids the mutation manifest's pattern (see B1's list).

NOT YOURS: `factVocabulary.js`, `src/generators/power/`, `npcStructure.js`, `npcData.js`, `historyData.js`, `historyGenerator.js`, `supabase/`, `src/domain/veil/`, `tests/security/`, the package files, and every register and baseline. The stale rows the cure leaves in `presumedThings*.register.json` and `presumptionClasses.register.json`, the fork registry's hash-channel count and the censuses are the integrator's, taken by their doors.

## Red first, then green
1. RED before, GREEN after: on `hxd-hamlet-0..29`, no quarter desc says church, priest, cloister or streets where `factsOf` reads `church` false. On `hxd-city-0..29`, no single desc prints in more than 6 of the 30 cities.
2. A seedless `generateSpatialLayout` call is byte-identical to today (`tests/generators/spatialGenerator.test.js` unchanged and green).
3. On 100 born places a size, for every printed desc: its `needs` hold and its `excludes` do not; the crisis-scoped lines keep their law.
4. The random stream is untouched: `trees.mjs <base> <tip> <workdir>` reads 0 non-string differences, and `quarters.length` and every quarter name are identical. List the strings that move.
5. Re-run `measures/m2-quarters-atoms.mjs` against your tree and put the shares before and after in your commit message.

GREEN at your last commit, every run through `sh scripts/gate-mutex.sh --run -- <command>` and read by `sh scripts/gate-tail.sh`: your tests; every test file that names `spatialGenerator` or `quarters`; `tests/lint` WHOLE; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. Never the whole suite, never a census. A red on a register the cure makes stale is reported by name, not fixed. The golden master moves: say which rows, and sign none.

## Hand-back
Commit on `lane/people-1-b2-2026-11-20` by explicit paths, with the receipts in the message, ending:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1Rzt4qD1sri7MHNbHp
Never push, never a pull request, never `--no-verify`. Final message at most 250 words.
