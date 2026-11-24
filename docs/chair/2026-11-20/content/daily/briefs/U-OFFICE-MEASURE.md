# DAILY-3 · OFFICE-M — MEASURE FIRST: five `office:` atoms on point 97's table of forms (the chair's E72, 10:53 UTC)

A MEASURE: nothing is committed to `src/` or `tests/`. Your deliverable is your final message (a table) and a measure
script with its out file under `/home/user/settlement-engine/docs/chair/2026-11-20/content/daily/measures/OFFICE/`
(if your tool refuses a file there, the content goes in your final message).

## The chair's leave, on six conditions (E72, verbatim in substance)
ONE atom family, five keys: `office: elders`, `office: headman`, `office: mayor`, `office: reeve`, `office: lord's
steward`, for LINES-2 § 2 legitimacy #8 to #12 (`docs/chair/2026-11-20/content/daily/lines/L2/LINES-2.md`, the lines
"Common folk say the elders decide among themselves…", "…the headman listens to friends first…", "The mayor is blamed…",
"…the reeve they chose…", "The lord's steward is obeyed, but not much liked."). (1) THE HOME is the one table of forms
point 97 put on the line, `src/domain/seat/seatTable.js` (name the exact reader: `seatRowOf`, `governmentFamilyOf`,
`preferredFormOf`, or another export): the atom reads the governing FORM's row, NEVER a name test on a label string.
(2) It reads the OFFICE, never the HOLDER: the same dark and lit. (3) It reads the DOCUMENT IN HAND: on a shared read,
where the form's row is withheld or absent, the atom is FALSE (fail closed). (4) First paint: the table reaches the tab
only by its lazy road. (5) The table below to the chair BEFORE the build. (6) After L8: thorp's top resentment re-measured.

## Where you work (read-only)
Two detached worktrees DAILY-3 cuts for you: `/home/user/wt-daily3-office` at 1ec3e81d1 (the working line, point 97: DARK)
and `/home/user/wt-daily3-lit` at 5c4419815 (`lane/close-1-lit-scratch-2026-11-22`: LIT; read and run, never merge).
`node_modules` symlinked in both. Commit nothing, push nothing.

## Read whole, once
`CLAUDE.md`; `src/domain/seat/seatTable.js`; `src/domain/seat/holderOfSeat.js`; `src/domain/seat/seatLaw.js` (as far as it
says where a place's governing kind and form are stored on the record); `src/domain/facts/factVocabulary.js` (how an
existing atom family with a getter home is declared: e.g. `government named` on `rulerKindOf`, and the `house` family);
`src/domain/display/publicSafe.js :: toPublicSafe` (what a shared read keeps of `powerStructure` and the seat);
`src/domain/people/cardVeil.js` (`isHideableHouse`, `isVeiledPower`, and any owner-hide of a government or seat).

## What to measure (M1's 900 births: `measures/M1/measure.m1.mjs`'s recipe, seeds `hxd-<size>-0..149`)
1. The READER: which export of `seatTable.js` gives a born place's governing FORM (and where on the record the kind/form
   are read from), in `path :: symbol` form, and the form names in the table.
2. For each of the five keys: the forms of the table it answers to (e.g. `office: headman` = forms {…}); the rule in
   one line; the share of places that hold it by size, DARK (on 1ec3e81d1) and LIT (on 5c4419815; how to switch the law
   on there: read its config or its own test of the lit law); and the count of places where dark and lit DISAGREE for the
   key (must be 0 if the atom reads the office).
3. FAIL CLOSED: on each place's `toPublicSafe(record)`: does the reader still find the form? the count of places where the
   atom is true on the owner's record and false on the shared document, and the reverse (must be 0).
4. HIDEABLE: can an owner hide a governing form or the seat at all (a veil, a hideable kind, a withheld key)? If yes: the
   five lines are hideable needs (say so); if no: by which rule (`path :: symbol`).
5. THE WORDING LINE for each key, in the form `ATOM <key> : <home> : <the wording>` (e.g. `ATOM office: headman :
   seat (seatTable.js :: <reader>) : the place is governed by the headman's form ({forms})`).
6. FIRST PAINT, by reading: is `seatTable.js` already in an eager chunk (`vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN`,
   `EAGER_FIRST_PAINT_MODULES` in `tests/build/vendorPdfLazy.test.js`), and would the vocabulary's getter import pull it
   eager? Say which, and the lazy road if the vocabulary's home is eager (the eager file declares the atom BY NAME; the
   code that answers it is imported only on the lazy side).

Rules: CLAUDE.md binds. Heavy runs through `sh scripts/gate-mutex.sh --run -- <cmd>` (exit 3 = gave up waiting: run
again), to files, never through a pipe; no GIT_* repository variables in a test's environment. If your permission check
refuses an action, the refusal stands: report it.
Final message: at most 250 words plus ONE table (key | forms | share by size dark | lit disagreements | shared-read
disagreements | wording line), then the reader, the hideable answer, the first-paint answer.
