# THE HOME PAGE'S SAMPLE TOWN: WHICH ROAD IT IS BORN ON (CLOSE-1, for unit 5; written 2026-11-22 08:11 UTC, read from `date -u`)

CONFIRMED by run on the join scratch (4bba8781d), with `close/measures/fixture-probe.mjs`'s recipe (kept in the seat's
scratch): the fixture's seed `lf-033`, its recorded settType `village`.

- `scripts/generate-landing-fixture.mjs :: forgeConfigFor` births with `generateSettlementPipeline(forgeConfigFor(st), …)`,
  WITHOUT `birthConfig`. The live "Forge this exact town" road (`src/store/settlementGenerateAction.js`) births
  through `birthConfig`.
- Today (both new dials dark), the two births of `lf-033` are the same town (Cnocby, 82): they differ ONLY in
  `config` and `_config`, which carry `_densityLawVersion: 2` and `_livingContentLawVersion: 2` on the button's road
  and nothing on the script's.
- After the flip, the button's road mints `_seatLawVersion: 2` and `_fortuneLawVersion: 2` and the script's does not: if
  either law moves this village, the sample no longer forges the town it shows. RE-MEASURED ON THE LIT SCRATCH: see
  below when run. If the town differs there, it is a TRUE FAULT of class (d) for the recipe (the script must birth
  through `birthConfig` before the close re-emits it).

## ON THE LIT SCRATCH (5c4419815; 2026-11-22 08:13 UTC)
CONFIRMED by run: the script's birth and the button's birth of `lf-033` (village) now DIFFER beyond the config: in
`economicState`, `powerStructure`, `npcs`, `history`, `_config`, `arrivalScene`, `defenseProfile` and
`simulationTrace` (the name and population stay Cnocby, 82). A TRUE FAULT, class (d), sent to the chair: the fixture
must be emitted through `birthConfig` (after `loadLivingContentRoster`) before the close's `--emit`;
`tests/build/landingFixtureFreshness.test.js` cannot see it (it re-runs the same script).
