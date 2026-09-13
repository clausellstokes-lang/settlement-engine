# Brief — INSTR-912 car 13: the domain strict-type ratchet — twelve strict errors in four island modules, and every other shell-out the base-state capsule makes

Seat: Opus 5 — implementer. The chair (Fable) rules; you build and measure. Receipt: append `## CAR 13` to `$SC/receipt-instr-912.md`. `$SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit`.

## Where
- Dock: `$SC/laneINSTR2` at **3ccd29a29** (fifteen commits over f3ab08f51: the twelve lane cars, the writer-reach register car, the census totals car; porcelain 0). Never touch any other dock or the main tree. `$SC/HOLD-VITEST` exists; you are EXEMPT for focused runs and ONE whole `tests/lint` run.
- Read first: `$SC/capsule-914.log` (the refusal), `scripts/check-domain-strict.mjs` (what a strict error is, how the per-file baseline works, and its rule "New/worsened files must be strict-clean — fix or annotate; do not widen the baseline"), and `scripts/base-state-capsule.mjs` (every `shellOut`/`ratchetPair` it runs — car 13 must leave EVERY one of them green, not only the one that refused).

## The red
`node scripts/check-domain-strict.mjs` reports strict-type regressions in the domain kernel: `src/domain/institutions/institutionTable.js` +1 · `src/domain/prose/entryWalker.js` +4 · `src/domain/prose/grammarWalker.js` +6 · `src/domain/prose/moveGrammar.js` +1 (baseline 0 for each — new files). Cure each by making the code strict-clean (a real type fix, a JSDoc type, a narrowing) — NEVER by widening the baseline and never with a blanket `@ts-ignore`/`any` cast unless the file's own idiom already annotates that way for a documented reason (read the estate's `domainAnyCastBaseline` / `domainStrictBaseline` walkers under `tests/lint/` — they ratchet casts and annotations too; your cure must leave BOTH of them green: a strict error cured with a new `any` cast would move one debt into another ratchet). ARM: `node scripts/check-domain-strict.mjs` exit 0 with the four files at 0; `npx vitest run tests/lint/domainStrictBaseline.test.js` and `tests/lint/domainAnyCastBaseline.test.js` (find their exact names) green; the typecheck ratchet at its ceiling (173/173) or lower.

## The rest of the capsule's shell-outs
Run every script `scripts/base-state-capsule.mjs` shells out to (grep `shellOut(` / `ratchetPair(` — paste the list), each once, and paste each exit and its last line. A red among them is yours to cure in this car if it is the island's, or to report with its measurement if it is not (do not cure a pre-existing estate red). Then `sh scripts/gate-mutex.sh --run -- node scripts/base-state-capsule.mjs --runtime-tests=32173` ONCE to prove the capsule regenerates (it writes `docs/implementation/BASE_STATE.json`) — then `git checkout -- docs/implementation/BASE_STATE.json` so the chair's own capsule car writes it; paste the capsule's "wrote … (N figures)" line.

## Discipline, fences, proof
Runner count 0 in its own shell call before every vitest run; focused files one at a time; the seven lane suites must equal car 12's tallies; ONE whole `tests/lint` run at the end (146 files expected green); the OSR and prose-numerics dry reads exact; `npx vitest run tests/copy/voiceMechanics.test.js` E2 must still name only the two banked files (no em dash or bang enters any string literal). Change only the four named `src/` modules (types/annotations; no behaviour change — every walker tally must be identical), plus the receipt. No register `--write` (the lighting census cannot move: no test title changes). One car `INSTR-912 car 13: the domain strict ratchet — twelve strict errors leave four island modules, <clause>`; explicit staging; porcelain 0; the three trailers exactly:
```
Seat: Opus 5 — Fable-unvalidated
Lane: INSTR-912
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
Return: the car sha; per file strict errors before → after with the cure named; the strict script's exit line; the cast/annotation walkers' tallies; the typecheck line; the capsule's shell-out list with exits and its "wrote" line; the seven tallies; the whole-tests/lint summary; anything owed.
