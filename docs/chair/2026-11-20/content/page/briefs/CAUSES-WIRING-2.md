# PAGE-13's brief: CAUSES-WIRING-2 (the causes' wiring, on the base with the trouble lane's parity cure)

ONE builder, red first, render only. Base: the display lane with the line at stack-96 (`b03a31560`; the trouble lane,
point 96, carries the causes' parity cure: FAULT 0 on every row of PAGE-9's sort) merged, its registers re-taken by
their doors (PAGE-13 names the commit). Common law: `BUILDER-RULES.md` beside this file (its rule 2 list is read with
THIS brief's OWNED list, which wins).

READ WHOLE: `briefs/CAUSES-WIRING.md` (PAGE-9's brief: it governs everything this file does not change, its step 5 pins
and its first-paint addendum included); `build/CAUSES-WIRING/READERS.md` (the readers' census, taken at the lane's base
on 2026-11-20); `build/CAUSES-WIRING/STOP.md` and `PARITY-SORT.md` (why the first builder stopped); and, as you need them,
`src/domain/display/tensionCause.js`, `src/domain/display/tensionShown.js`, the surfaces READERS.md marks "to wire".

## What changed since PAGE-9's brief
- The parity cure is on the base. Its own reading: the owner's sentence and a served one may differ ONLY where the
  served document has lost a hidden house or power, and then the served page prints what a place without it prints
  (the hideable walker's EXEMPT entry for `TENSION_CAUSES`, read it on the base: three rows are LISTED, not
  parity-held: crime_wave:criminal_power, guild_conflict:guilds_rule, outside_debt:merchants_rule).
- THE SEVENTH CHAIR'S CONDITION OF 20:44 UTC 2026-11-20: THE CAUSE SENTENCE REPLACES THE DESCRIPTION; NO SURFACE SAYS ONE
  TROUBLE IN TWO WAYS. Its (b): the six surfaces READERS.md marks; its (d): the commonest first trouble measured
  (`build/CAUSES-WIRING/firstTrouble.mjs`).
- `tests/ui/safetyReaderBytes.test.jsx` stores no hash any more (READER-DIFF): it needs no re-record; it must stay green.

## The unit
1. MEASURE FIRST, at the base, by the existing scripts (re-run, outputs under
   `docs/chair/2026-11-20/content/page/build/CAUSES-WIRING-2/`): `build/CAUSES-WIRING/parity.mjs` and `paritySort.mjs`.
   Expect: every difference is a veiled pair traced to a declared atom (FAULT 0), or one of the three LISTED rows. ANY
   OTHER DIFFERENCE STOPS YOU (report the town, kind, projection and both sentences). Re-take the readers' census
   (READERS.md's grep) at the base and say what moved since 2026-11-20.
2. WIRE, as PAGE-9's step 3 says, in `src/domain/display/tensionShown.js`: `tensionSentenceShown(record, tension)` =
   `tensionCauseSentenceOf(record, tension) ?? <the stored description>`; every surface READERS.md marks "to wire"
   prints a trouble's sentence ONLY through it, with the document it was given. Where a surface prints the description
   AND another wording of the same trouble, it prints one: say which and why.
3. TESTS, red first, PAGE-9's step 4 (a made-up record; the sentence COMPUTED, never quoted; the parity arm over the born
   pools, owner against each served projection, reading as step 1's expectation; THE GUARD: a source scan that no file in
   the lane's directories reads a tension's `description` for print except `tensionShown.js`). A new test file's basename
   avoids the mutation manifest's words (BUILDER-RULES rule 4: "parity" is one of them).
4. PINS by their doors (PAGE-9's step 5): the page census, `tests/components/dossierPhoneFloorAllViews.test.jsx`, the
   wiring census's producer index if it moves. Report the lighting census's figures; do NOT refreeze it (PAGE-13 does at
   the merge).
5. FIRST PAINT NOT ONE BYTE UP (PAGE-9's addendum): ONE `npm run build`, then `VERIFY_DIST=1` on
   `tests/build/vendorPdfLazy.test.js` and `tests/build/generationWorkerLazy.test.js`; the three first-paint figures and
   the worker's, at base and tip; name the chunk the tables land in. A rise STOPS you: report it.

## Files you OWN
`src/domain/display/tensionShown.js` (ADD `tensionSentenceShown`; `tensionSidesShown` is NOT changed); the surfaces
READERS.md marks "to wire" in `src/components/`, `src/pdf/`, `src/foundry/`, `src/domain/display/`; new test files under
`tests/domain/display/` (NOT `tensionSidesServed.test.js`: another builder's) or `tests/components/`; the page census's
and the phone floor's figures by their doors; new files under `build/CAUSES-WIRING-2/`. NEVER: `src/data/tensionCauses.js`,
`tensionCause.js`, `tensionCauseHolds.js`, `tensionSidePower.js`, `tensionSideMeanings.js` (the trouble half's: a wrong
sentence goes to PAGE-13), `tests/lint/samenessHideable*` (another builder's), `publicSafe.js`, `gallery*.js`,
`src/domain/veil/`, `src/domain/tension/`, `src/domain/summary/`, `src/domain/crisis/`, `supabase/`, `tests/security/`.
A surface in another seat's files is NAMED in your hand-back, not edited.

## Gates (each through `sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh …`, to a file; ONE heavy run at a time)
Your tests (red, then green); every test file that names a module you changed (`grep -rl <basename> tests`);
`npx vitest run tests/lint` WHOLE after your LAST test-file change; `npm run lint`; `npm run typecheck:ratchet`;
`npm run typecheck:domain:strict`; the build and its two tests. Never the whole suite.

## Hand-back (at most 400 words)
Branch and commit; the parity counts (pairs, differences, each traced or listed, or the STOP); the census's movement;
every surface wired (file :: symbol) and every one NAMED for another seat; red and green count lines; each pin's
before -> after with its cause; first paint at base and tip and the tables' chunk; each gate's count line; every
judgment the brief did not settle.
