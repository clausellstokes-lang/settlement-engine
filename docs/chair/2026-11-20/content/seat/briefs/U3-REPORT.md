# U3 — THE HOLDER LEAF: builder B3's report (to SEAT-3)

Branch `lane/seat-2026-11-20-u3`, cut from `bd6d8c67c`. Commits: `b9bb5620e` (the leaf, its arms, the pin, the acceptance script and its outputs) and the commit that carries this file. Not pushed.

## What landed (files owned, nothing else)

- NEW `src/domain/seat/holderOfSeat.js` :: `holderOf(settlement, { audience })` → `{ rule, holder, holderName, person, kind, refused, personRule }`; `isCrownedForm(form, tier)`; `APPOINTED_SEAT_FORMS`.
- NEW `tests/domain/seat/holderOfSeat.test.js` (29 tests, arms (1)–(8)).
- `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN` gains `'/src/domain/seat/holderOfSeat.js'` (routes to `coherence-lazy`, executed through the shipped `manualChunks`).
- NEW `docs/chair/2026-11-20/content/seat/u3/measure-u3.mjs` and its outputs `u3-holder-{default,presets}.{json,md}`.

The two fields beyond the brief's API: `refused` (true where the reader was refused the owner's answer; `rule` then names the refused rule) and `personRule` (`'seat'` or `'crown'`: the field the dispatch additions asked to name for CS22 (c)).

## Red → green (CONFIRMED, executed)

| step | result |
|---|---|
| leaf absent | the suite cannot load (`Cannot find module …holderOfSeat.js`): 0 of 29 ran |
| a stub exporting the three names, reading nothing | 27 failed, 2 passed (the `none` arm and the purity arm pass on a stub that answers nothing) |
| the leaf | 29 passed |

Plant-and-restore on the built leaf (each arm bites; the leaf restored byte-identical, sha256 checked): the crown filter off → 2 red (arm 7); the reader's veiled-face filter off → 1 red (arm 4); the `recentConflict` tie-break off → 1 red (arm 3); the reader falling through instead of refusing → 7 red (arms 4, 5); the `ousted` filter off → 1 red (arm 1).

## The acceptance run on both pools (CONFIRMED; `u3/u3-holder-*.md`)

| rule | default: proposal (1) | default: built (owner) | presets: proposal (1) | presets: built (owner) |
|---|---|---|---|---|
| R1 | 0 | 0 | 0 | 0 |
| R2 | 365 | 365 | 213 | 213 |
| R3 | 96 | 96 | 243 | 243 |
| R4 | 413 | 413 | 444 | 444 |
| R5 | 26 | 26 | 60 | 60 |
| two rules disagree | 0 | 0 | 2 | 2 (the same two towns; R2 wins) |

- 900 + 960 towns, 0 errors. The built leaf against the proposal's draft (`seat-draft.mjs :: holderOf`), town by town, rule AND holder: **0 differ** on both pools. The rule × kind table equals the proposal's measure row for row.
- The reader, on each town's SERVED document (`toPublicSafe`): the same counts, 0 refused, 0 towns where it names another holder than the owner (no birth puts a veiled power in the seat). `personRule` is `seat` in all 1,860; no town lacks a person.

## R1: exactly what it reads, and what makes it read two takers

It reads `powerStructure.factionRelationships[]`: an edge whose `pair` holds the CURRENT form (the governing row's name, `nameOf(governingFactionOf(s))`) and whose `narrative` is exactly `"<taker> is the power behind the <form, lower-cased>. The seat answers to them now."` (the one sentence `transferRulingPower` writes, and the only writer of it in `src/`); the taker must stand as a row (`powerStructure.factions[]`, not the governing row). An older transfer's edge is re-keyed onto the new form but keeps its old narrative, so it never matches.

**Two takers** match only when a later transfer returns the seat to a form it held before (≥ 3 transfers, since the outgoing name is never reused): the first taker's re-keyed edge reads true again. The leaf then reads `powerStructure.recentConflict` (the transfer's own "X overthrew the … as a <form>." / "Power passed to X by …; the government now sits as a <form>"), else the last matching edge in list order. Order alone is not enough: the taker's own pre-existing edge is rewritten IN PLACE and can sit before the stale one (arm 3 proves that case). **U5 makes it unambiguous** by retiring the old holder's edge (to a competitive one, no key) at every transfer, so one edge ever matches. The `ascendant` modifier and `previousGovernments` are not read: neither names the last taker.

For the owner, a taker with no row (a power since removed) is no answer and R2 reads on. For the reader it is refused (rule R1, no holder): a served document drops a hidden row and masks its name ("an unseen interest"), and the reader cannot tell the two cases apart.

## CS22 (c) on `person`

Where the form is CROWNED and R1 found a taker, every seat candidate that is rank 1 of the taker (the keeper of its heaviest house) is skipped. The person is the next candidate (the seat's own card), or null. `personRule: 'crown'` says so. Through the real `transferRulingPower` on a city: a City Council taken by Noble Houses becomes Royal Authority, and the keeper is never named (arm 7). The control is a town whose form becomes Ducal Governorship: the keeper is kept there.

**The crown test, my judgment (vetoable):** `isCrownedForm(form, tier)` is true for a form `officeFamilyOfForm` files under `sovereign` (none today), or for Royal Authority where `officeWordInfo(officeTitleOf({ family: 'sovereign', tier })).crown` holds. That word is read on the base ladder: a culture changes the word, never the hat (CS22 (e)). An unknown size reads crowned, so the rule fails closed. The two tests the dispatch names cannot find a crown alone, and I executed this over all 58 government names: no form's family is `sovereign`, and today's title word for each form is never a crown word. Royal Authority's family is `appointed`, its title Lord Mayor or Governor. So Royal Authority is named, from RULINGS (c).

## Other judgment calls (vetoable)

- **The reader refuses; it does not fall through.** Where the owner's first answering rule gives a power the reader may not be told (a hidden or criminal power, a power criminal by its name, or a power with no row), the reader gets `rule` = that rule, `holder` null, `refused` true, and the office's kind (never the refused holder's kind).
- **The reader's person** is never a veiled face (`cardInstitutionVeilOf` 'veiled'). On a served document such a card already carries no role or memberships, so this matters only when a caller hands the owner's record with the reader audience.
- **`kind`** for a holder is `ownKindOf` (a hidden non-criminal holder reads its own kind for the owner). With no holder it is the office's kind (`formKindOf`, else the governing row's contest kind).
- **R3** reads no "seat of a kind" for government, other or criminal forms; criminal forms fall to R4, as the proposal measured (22 at presets). Ties go by power, then codepoint name.
- **R5's list** is `APPOINTED_SEAT_FORMS`, a restatement of `representatives.js :: APPOINTED_GOVERNMENTS`. That module is a generator with a 255-module import closure, and importing it would give `coherence-lazy` an edge into `engine`. A test pins the copy equal to the original and to `GOVERNMENT_FAMILY`'s appointed family.
- **Imports:** `rulingPower`, `factionArchetypes`, `dossier/seatHolder`, `people/membership`, `people/cardVeil`, `people/cardPowers`, `seat/seatTable`, `data/cultureOfficeTitles`. It does not import `powerStrata.js`, so there is no cycle with U4.

## Registers, pins and figures that moved

- `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN`: 1 entry added (the leaf). No byte figure moves: no module imports the leaf yet.
- The census arms' delta, my new files only: `sovereigntyLightingContract.walker` "THE CENSUS IS AN ASSERTION…": test-file count 3707 → 3708 (`tests/domain/seat/holderOfSeat.test.js`); `proseWiringCensus.walker` "THE DRY READ" and "car 0 … byte-identical": `scripts/wiring-census.mjs --dry` reports the stamp alone moving (`producerIndexFiles` 1437 → 1438, `src/domain/seat/holderOfSeat.js`), 0 rows, 0 bytes. Not re-recorded, not committed.
- `writerReach`'s frozen `surfaceReach`: `hidden on factions` campaign-pdf N → R (live), not re-recorded (above).
- Nothing else. No golden, no stored town, no born pin, no tuning row. The leaf holds no numeric constant.

## Gates (CONFIRMED)

- `typecheck:ratchet` 167/167 OK; `typecheck:domain:strict` 1113/1113 OK (the leaf is in the strict program, 0 rows); `lint` 0 errors, 38 warnings, none in my files.
- 34 files: every test naming a changed module outside `tests/lint` and `tests/setup`, plus `layerBoundaries`, `engineCoreLazyEdge` and `densityCreateBoundary.walker`. Result: 380 passed, 61 skipped, 2 failed, neither mine:
  - `generationForkCensus` A1, on COMMON's list;
  - `dmLayerGoldenIsolation` A7 (the golden corpus), red at the base too: run in a `git archive` of `bd6d8c67c` with 11,337 files counted, it fails the same arm.
- `tests/lint` whole: 217 of 220 files, 3,267 of 3,271 tests. Red: the two census files above (the delta named), and **`writerReach.walker` "the surfaceReach grammar round-trips…": `hidden on factions` campaign-pdf N → R**. At the base archive the three files are green (165/165), so this one is caused by U3. The OSR resolver now grounds `seat/seatTable.js :: isVeiledRow`'s `hidden` read (R readers: publicSafe.js, cardVeil.js, **+ seatTable.js**; measured at both trees through `check-writer-reach.mjs :: measure`), so campaign-pdf (whose closure holds seatTable.js through rulingPower.js) goes from a name read to a grounded read. A reach GAIN on the frozen `surfaceReach`, the same register U2's report moved and SEAT-2 re-took at the merge; outside my manifest, NOT re-recorded: **SEAT-3's to re-take**. `negativeAssertionAnchor` and `ledgerCitationIntegrity` are green here.
- The confinement proof `confine-two.sh bd6d8c67c b9bb5620e`: **EQUAL**. base `bd6d8c67c` and tip `b9bb5620e` both read golden `4472f8a1…f6a0d3` 525, census `69d83fd6…ecd472` 720, `all 36ee5bb0bea0bb3fcc6bd83f1e9e732b4dc643f09e0844545c64785798d8ce89 1245` (equal to SEAT-3's reference).

## Not done

- RULINGS (c)'s sovereign reading (Royal Authority on a royal-seat house, out of R5 for that reading only). That is U12's to measure and wire. Until then a born Royal Authority with no holder reads R5. **SEAT-3 to confirm that is the intended owner.**
- No push. No census re-record. No edit to `rulingPower.js` or `seatTable.js`. No seat-law branch (the leaf is a read; its callers gate).

CONFIRMED (executed): every count, red, green, plant and gate figure above. PLAUSIBLE: that U4's import of the leaf from generators keeps `engineCoreLazyEdge` green. Nothing imports it yet; the pin is in place for when something does.
