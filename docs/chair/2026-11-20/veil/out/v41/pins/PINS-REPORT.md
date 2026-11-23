# V41-PINS report (VEIL-41, chain C; test-only, worktree /home/user/wt/c2, lane/veil-41-2026-11-23-c2-wip)

OUTCOME: DONE. All eight re-statements are green with an anchor, test files only. The 55-file set's reds are exactly VS1 1 and chain A's 3.

## Commits (one per file, explicit paths, not pushed)
115be7619 (1 walker census), ba670086c (2 publicProseEquality), 8ec7ff16d (3 entityIndex), e08bb289f (6 Totality),
88b5156e3 (7 ring note), 312052808 (WIP, UNPROVED, before the mutex wait: 4 HandRows D, 5 Inversion, 8 SignalCopies),
69c07953e (2's fix: scale notes read from source, not literal anchors; carries the proofs of 312052808).

## Receipts
- RED at 79e94d633: /var/tmp/v18/out/v41/pins-c2.log (the seat's measure: 236 failed of 1,141 in 9 files).
- GREEN, single files: p1-green.log (walker 6 of 9, the 3 chain A rows red by design), p2-green.log (438 of 438),
  p3-green.log (41 of 41), p6-green.log (29 of 29), p7-green.log (2 of 2), all under /var/tmp/v18/out/v41/pins/.
- The 55-file set, ONE run through the mutex: set.log: at 312052808, 4 failed of 1,152 in 2 files (VS1 1; chain A's 3: power.desc, power.label, power.relation.dmNote)
- tests/lint WHOLE: lint.log: 25 failed of 3,280 in 17 files (C2-BUILD's 26 less the census pin; same failing titles otherwise) (the tip: 48 of 3,304).
- tests/copy WHOLE: copy.log: 2 failed of 172 (voiceMechanics, untouched) (the tip: 2 of 172).
- After the set: the lint run showed 2 NEW literal anchors from 2 in proseDrawnAnchors. Fixed in 69c07953e and re-proven
  ALONE: p2-green-r.log 438 of 438, lint3-r.log (only HandRows 1 is left, down from 2). The set was not re-run.
- Probes (measure-first, scratch files deleted): probe2.json (owner vs served lines, 12 towns x 11 tabs), probe3.json
  (dossier search), probe7.json (the ring-note vantage).

## Which way (6): the rung-drop mechanism arms were PARKED
The twin exposes NO step before withhold-always: galleryVeil.js :: dropVeiledPublicProse is module-private and
applyVeil always ends with galleryWithholdAlways.js :: withholdAlways. The two arms are PARKED BY NAME in
publicPayloadVeilTotality.test.js :: PARKED_RUNG_DROP ("returns with (b)"), count pinned at 2, each held to a COVERED
address whose VEILED_PUBLIC_PROSE row stands. The key arms count the lines on the projection BEFORE the veil (> 0) and
find no publicProse key on applyVeil(projected, []) nor applyVeil(projected, [address]).

## FIDELITY GAP (7)
The served shared Defense tab prints criminalStructureOf(shared).note, the ORIGINAL vantage (the served record carries
no _seed for defenseDisplay.js :: withRingVantage); the owner's player view prints the seeded variant. Measured: they
differ on soak1k-11 and soak1k-41 (soak1k-10's variant is the original). Named, not pinned. Shut, the tab prints none.

## A. Component sites reading a publicProse block, and what each prints on a SERVED record now
src/pdf/** reads none (no publicProseOf, no .blocks[, no block id). `economy:print` has no component reader.
| site | prints on a served record |
|---|---|
| src/components/new/economyDeskRead.js :: publicEconomyDesk (economy:economics, :services, :resources, :daily_life) | NOTHING (SILENT_ECONOMY_DESK) |
| src/components/new/generalDeskRead.js :: publicGeneralLines (general:overview, :economics, :history, :viability) | NOTHING (GENERAL_DESK_SILENT) |
| src/components/new/stressorsDeskRead.js :: publicStressorsDesk (stressors:overview) | NOTHING (SILENT_STRESSORS_DESK) |
| src/components/new/defenseDeskRead.js :: publicLens (defense:<lens>, eight lenses) | NOTHING (SILENT_DEFENSE_DESK[lens]) |
| src/components/new/defenseDeskRead.js :: criminalRingNoteRead (defense:criminal ringNote) | A LOCAL LINE: criminalStructureOf(served).note, drawn from the served record by defenseDisplay.js :: deriveCriminalStructure, original vantage |
| src/components/new/powerDeskRead.js :: publicPowerDesk (power:desk) | NOTHING (SILENT_POWER_DESK) |
| src/components/new/powerDeskRead.js :: publicLadderRung via powerLadderRead (power:ladder) | NOTHING (rung null) |
| src/components/new/powerDeskRead.js :: governanceAccountRead (power:governance) | NOTHING (null) |
| src/components/new/tabs/WarFaithDesk.jsx :: publicWarFaithDesk (warFaith:faith) | NOTHING (SILENT) |
| src/components/new/magicDeskRead.js :: publicMagicDesk (magic) | NOTHING (SILENT_MAGIC_DESK) |
| src/components/new/viabilityDeskRead.js :: publicIsolationDesk (viability) | NOTHING (SILENT_ISOLATION_DESK) |
| src/components/new/viabilityDeskRead.js :: viabilityVerdictRead (viewModel:viability) | NOTHING (summary '') |
| src/components/new/overviewIdentity.js :: overviewIdentityOf (overview:identity) | NOTHING (scope '', governs '') |
| src/components/dossier/DossierSearchResults.jsx :: ShippedProse (via dossierSearch.js prose objects) | NOTHING (no prose object is indexed) |
Beside the table (not block readers, measured in probe2): three tab-local lines on a served record EQUAL a composed
string, so publicProseEquality names them as LOCAL: EconomicsTab.jsx's Shadow Economy scale note (by
shadowCaptureShown of the served, page-re-derived blackMarketCapture; soak1k-0, 4, 5, 9) and DefenseTab's print of the
served safetyProfile.safetyDesc and .guardEffectivenessDesc (12 of 12), with the ring note above.

## B. One line
The owner's Curate screen shows block:power.criminalUnderside in its Power section as the row "The capture reading"
(galleryVeil.js :: CURATE_SECTIONS), HIDDEN by default (STATIC_DEFAULT_GROUPINGS: "X-21c: Power's capture reading").
