# Every reader of a current tension's side (`history.currentTensions[*].factions`), PAGE-2's census (written 2026-11-20 12:22 UTC)

EXECUTED by a read-only helper of PAGE-2 at 0c9069489, key rows spot-read by PAGE-2; the session sheet's reader read on
origin/lane/frame-5-2026-11-20. NOTHING on the line composes a sentence from a side; nothing reads a side by position or
assumes three.

- `src/generators/historyGenerator.js :: buildHistoricalEvent` (via `substituteNames`): the WRITER: template words, with
  seven slots replaced by a power's roster name or a fixed fallback ('the criminal network', 'the merchant class', 'the
  orthodox clergy', 'The garrison' / 'The watch' / 'The militia' / 'Local enforcement', 'the governing authority').
- `src/generators/power/rosterText.js :: settleTensionsToRoster`: matches each side EXACTLY against the powers cut from the
  roster; re-points a cut power to the ruler it folded into, or drops it; de-duplicates (two sides already occur).
- `src/domain/dossier/plotHooks.js :: campPartiesOf`: classes each side by EXACT lookup in the roster's power names, power or
  group; the tension hooks' `parties`; `coherence/hookTruth.js :: hookPartyViolations` refuses a hook whose power party is
  not on the roster (groups never refused).
- `src/components/new/tabs/HistoryTab.jsx :: TensionRow`: every side as a chip through `MentionText` (a side equal to a power
  or house name links).
- `src/components/new/tabs/OverviewTab.jsx` ("Tensions & Conflicts"): every side as a raw chip.
- `src/pdf/lib/viewModel.js` (overview, power and history slices): copies the sides to `parties`.
- `src/pdf/sections/HistoryFounding.jsx`: "Parties: A  vs  B  vs  C" (`label`/`humanize` title-case a one-word side).
- `src/pdf/sections/Overview.jsx`: sides joined " / ".
- `src/domain/factionRename.js` (cascade step over `rewriteProseList` / `substituteName`): rewrites a power's name inside
  every side on a power rename (whole-word, with or without "the").
- `src/domain/institutionRename.js :: NON_CASCADED_SURFACES`: declares the path faction-owned: a house rename never rewrites
  a side.
- `src/domain/coherence/readerBattery.js :: tensionMemoryFindings`: joins description and sides, tests `LIVING` (the template
  side words "Former …", "Old loyalists", "Those who suffered …", "Beneficiaries who kept …").
- `src/domain/display/guardLineUnderTheLaw.js :: familiesHeldOf`: stringifies the tensions with others, tests
  `FAMILIES_NAMED` (a side such as "Old families" holds the families the guard line names).
- `src/domain/display/galleryVeil.js` (the tension kind): sides always kept, never veiled; `publicSafe.js` passes
  `currentTensions` whole.
- `src/domain/display/stateProse/generalStateProse.js` DS-GEN-1: UNMOUNTED; slots `faction`/`faction2` and a state key on
  `factions.length` (would be the first positional reader if mounted).
- `src/domain/tension/troubleCast.js :: templateLabelOf` (ON origin/lane/frame-5-2026-11-20, not yet on the line): reads each
  side's WORDS against `sideArchetypes.js :: SIDE_ARCHETYPE`, else the slot's label in `GENERATOR_REPLACED_SIDES` (succession 0
  and 2, economic_disparity 0, religious_tension 0, crime_wave 0 and 2, corruption 0): a side's archetype and face.
- TESTS AND TOOLS: `tests/lint/presumedThings.shared.mjs :: leaves` (every leaf against the presumed-things register);
  `tests/helpers/pageLaws/lowFamiliesI.mjs` (`low.hook-party`: family/reform/loyal/hardline/radical/tradition/zealot regexes
  on the stringified tensions); `scripts/audit/crime-signal-writers.mjs` (ORG regex matches 'the criminal network').
- PINS: `tests/data/tailHistoryBatch2.test.js` ("the twenty…": exactly three sides; side words in its regexes);
  `tests/data/tailHistoryBatch3.test.js` (≥2 sides; side words); `tests/generators/placeNotTierDefence.test.js` (no "The
  garrison" side); `tests/generators/w2FixData5OccupationTension.test.js` (FALSE_WORDS side words);
  `tests/domain/coherence/readerBattery.test.js`, `tests/domain/dossier/plotHookParties.test.js`,
  `tests/domain/factionRename.test.js` (fixtures with side words).
