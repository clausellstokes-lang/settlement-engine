# PEOPLE-6 LINKS — the institution card's face row and the NPC card's door back (2026-11-07)

Seat: PEOPLE-6 LINKS, a display lane of the people car, an Opus 5.5 child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's full delegation of 2026-11-06. Branch `lane/people-6-links-2026-11-07`, cut from `origin/lane/people-5ab-merge-2026-11-07` at `bc4b64230`. Every commit pushed with `--no-verify`.

The owner's word (2026-11-07, verbatim): *"I would like for the institution cards to have a small row in each card that has the name of their NPC that also acts as a link to the NPC's card that NPC card also has a link to the institution card the NPC belongs to."*

## 1. What I found (measured first)

- **The institution card.** `src/components/new/tabs/InstitutionsTab.jsx :: InstitutionCard` (`:227` at the base), fed by the view model `institutionsWithServices` (`:117`). The model joins each roster row by its raw `name` (`:136`, "the ONE raw-name read of the join"). The card focuses itself on `entityIdFor('institution', inst)` (`:232`) and carries the anchor `entityAnchor('institution', inst)` (`:244`).
- **The NPC card.** `src/components/new/npcComponents.jsx :: NPCInlineCard` (`:188`). Its card line at `:254–255` and `:342–344` printed `cardHouseOf(npc)` as plain text, followed by the power line (5A's). It focuses itself on `entityIdFor('npc', npc)` (`:239`).
- **The dossier's one cross-card mechanism.** `src/components/primitives/EntityLink.jsx` resolves a stable id against the dossier index (`src/domain/dossier/entityLinks.js :: buildDossierEntityIndex`, `:404`; npcs `:405`, the powers keyed by `factionIdFromName` `:416`, institutions `:428`). A click calls `navigateToEntity(id)` (`src/components/dossier/useNavigateToEntity.js :: useDossierEntityNav`, `:29`). That switches to the kind's tab (`entityLinks.js:248–250`: npc → `npcs`, faction → `power`, institution → `institutions`) and stamps `focusedEntity`. An unresolved id, or one the viewer's scope may not open (X-20 (d)), renders as plain text.
- **Existing uses of that mechanism.**
  - The Institutions card already uses it: the Backs line links to the Power card (`InstitutionsTab.jsx:270`) and the service doors link to the Services tab (`:303`).
  - The Power card names its members as NPC links (`src/components/new/tabs/power/PowerStrata.jsx:337`).
  - The NPC card's tie lines link NPC to NPC (`npcComponents.jsx:436`).
  - This lane reuses the same mechanism and adds no second one.
- **The join key.** `src/generators/people/representatives.js:298–310`: a house face's `institution` is `{ kind: 'house', key: house.name, family, title }`. The seat minted from the governing power is `{ kind: 'power', key: <power name> }` (`:318`). So the institution row's key is the row's `name`, and the minted face's key is the power's name.

## 2. What I built, with the file manifest

| file | change |
|---|---|
| `src/domain/people/cardPowers.js` | One pure reader, `facesByHouse(cards)`: row name → the card whose `institution` is `{ kind: 'house', key: <name> }`; the first card in roster order wins. No new import. |
| `src/domain/people/cardDoor.js` (new) | `cardInstitutionDoorOf(card, settlement)`: a house face → `{ type: 'institution', id: entityIdFor('institution', <the roster row of that name>) }`; a minted face (kind `power`) → `{ type: 'faction', id: factionIdFromName(<power>) }`; `institution: null` → `null`. A house that the roster no longer holds gets an empty id, so the link renders as plain text. It is kept apart from `cardPowers.js` because the print surfaces (the PDF, the world book, Foundry) import `cardPowers`. Putting the dossier's id module (`entityLinks.js`) there widened their closure, and `writerReach.walker`'s surfaceReach arm caught it (`loyalty on autoApplied` gained campaign-pdf and world-book). Only the web NPC card imports `cardDoor.js`. |
| `src/components/new/tabs/InstitutionsTab.jsx` | The view model carries `face` (reusing the join's one key). The card prints a small row, `<title> — <name>`, under the description. The name is an `EntityLink` to the NPC card's own id. A house with no face (the census's NONE, every fabric row) prints no row. |
| `src/components/new/npcComponents.jsx` | The card line's house is an `EntityLink` door back to the Institutions card. A minted face's door is its power's card on the Power tab. A DM's person shows no door. The power line follows unchanged. |
| `tests/components/people6InstitutionFaceLinks.test.jsx` | New: 10 tests (§3). |
| `tests/components/phoneChromeFloor.census.test.js` | Re-keyed with cause (§4). |
| `tests/lint/.lighting-census-baseline.json` | Re-frozen (§4). |
| `tests/lint/ruinFilterRoster.walker.test.js` | `cardDoor.js` is EXEMPT as a name-lookup (it reads the roster only to compute a link id, and a ruined house keeps its card and its face); readers 100 → 101, with cause. |
| `docs/content/wiring-census.json` | Re-derived: `producerIndexFiles` 1271 → 1272 (`cardDoor.js`); pools and relation rows unmoved. |
| `tests/lint/.source-citation-baseline.json`, `tests/lint/sourceCitationIntegrity.walker.test.js` | The dated roster, +1 (§4). |

**Not changed.**
- The PDF: a print has no links. The chair notes a name row there as a possible follow-up for the owner.
- No generator byte, no shim, no simulation file, no writer, and nothing under `docs/shift-records/`.
- A minted face's card line now names its power (as a link), where 5A printed no house for it. Its power line still reads "first of X". The name therefore appears twice on that one card (PLAUSIBLE, §6).

## 3. The proofs

**Component and view-model tests** (`people6InstitutionFaceLinks.test.jsx`, 10/10 green). Each test renders inside the dossier's own provider (`useDossierEntityNav`) and checks the tab setter and the store's `focusedEntity`:
1. `facesByHouse` keys house faces only. `institutionsWithServices` carries `face`, or `null` for a house with no face.
2. The Mill card's row reads `the miller—Edda Marl`. A click opens the `npcs` tab with `focusedEntity.id === entityIdFor('npc', miller)`, the id the NPC card focuses on.
3. The Weekly market card (NONE) has no row, and the row count is exactly 1.
4. `cardInstitutionDoorOf` handles all four shapes: house, minted, `null`, and a house missing from the roster.
5. A house face's door opens the `institutions` tab on `entityIdFor('institution', row)`, the id the Institutions card focuses on.
6. A minted face's door opens the `power` tab on `factionIdFromName(power)`.
7. A DM-authored card (`institution: null`) renders, with no door.
8. **The veil.** `applyVeil(s, ['field:npc:npc_mill:ties'])` removes the card's `institution`, which is the same eye that hides the house on the NPC card. With it gone, the NPC card has no door and the Mill card has no row, while the Mill card itself and the miller's name (on the floor) stay.
9. **The public-safe projection.** `toPublicSafe` reduces each NPC to `NPC_PUBLIC_KEYS`, which holds no `institution` (5A's STOP 1, the migration-189 twin). So a public card has no door and no institution card has a row, while the card's name is kept.

**The touched suites.** Every test file that imports `InstitutionsTab`, `npcComponents`, `cardPowers` or `NPCsTab` was run: 28 files, 344 tests. Two files were red, and both are red at the base (run in a base worktree):
- `phoneChromeFloor.census`: re-keyed for this lane's share (§4).
- `tabSentencesOnce` (X-50 PlotHooks repeats): the base's, and the soak's X-50 STOP.

**The goldens unmoved (M-3).** The 525 hash set was built by plain node with the golden master's own corpus and hash (`generateSettlementPipeline(cfg, null, { seed, customContent: {} })`, sha256 of the JSON), once at the base worktree `bc4b64230` and once at the tip. Both give 525 rows with the set digest `1e46dfcf0452886de7bd4ab6b589260629f18a3f8b3dcfb157a0e813c570dcc8`, identical. No PDF byte moved: no PDF file was touched.

## 4. The registers

| register | door | result | commit |
|---|---|---|---|
| observed-shape readers | the plain check | **left as it is: STOPPED at the base** (`executionTree manifest digest mismatch`, the history-walk fault MERGE-5AB §4 reported). Not fought. The new reads, listed for the landing seat's rung: `npcs[].institution.kind` and `npcs[].institution.key` read on two new display callers through `cardInstitutionOf` (`cardPowers.js :: facesByHouse`, `cardDoor.js :: cardInstitutionDoorOf`); `npcs[].institution.title`, `npcs[].title` and `npcs[].name` read on the face row (`InstitutionsTab.jsx :: InstitutionCard`); `institutions[].name` read in `cardInstitutionDoorOf` (the row lookup). Cause: PEOPLE-6 LINKS | — |
| writer reach | the plain check | exit 0, unmoved (no new writer). The walker's surfaceReach arm went red once, through the door's first home in `cardPowers.js`, and was cured by moving the door to `cardDoor.js` (§2), not by a rebank | — |
| wiring census | `node scripts/wiring-census.mjs`, then `--check` | `producerIndexFiles` 1271 → 1272 (`cardDoor.js`); 709 pools and 165 relation rows unmoved; `--check` exit 0 | the final commit |
| ruin-filter roster | re-keyed by hand with cause | readers 100 → 101, `cardDoor.js` EXEMPT (name-lookup) | the final commit |
| lighting census | `LIGHTING_CENSUS_REFREEZE='PEOPLE-6 LINKS'` + note, on a clean tree; then the plain run | files 2972 → 2973, credited 2600 → 2601, titles 28014 → 28024, suiteTitles 7467 → 7471; plain run 34 / 34 | `fc6b62112` |
| phone chrome floor | re-keyed by hand with cause | /create 615 → 617, /settlements 861 → 863, /gallery 659 → 661. Of each +2, +1 is the face row's one `proseFontSize` site (0 bare) and +1 is red at the base. The base's /admin and /world +1 are left red | `e467e4917` |
| dated roster | `tests/lint/.source-citation-baseline.json` | 101 → 102, this record; the `_rosterGrowth2026-11-07-people-6` note and the walker header's `dated (102)` | this record's commit |

## 5. The red list

**`tests/lint` + `tests/scripts`, whole.** The same command, `npx vitest run tests/lint tests/scripts`, was run at the tip and at a base worktree (`bc4b64230`, `node_modules` linked).
- **Base:** 215 files, 13 red / 25 tests red.
- **First tip run:** 14 red / 28 tests red. The +3 were this lane's: `ruinFilterRoster` 2 and the `writerReach.walker` surfaceReach arm 1. All three were cured (§2, §4). Re-run: `ruinFilterRoster` green, and `writerReach.walker` back to the base's 3.
- **After the cures, the tip's reds equal the base's, file for file and arm for arm.** All of them are the base's:
  - `observedShapeReaders.walker` 6 and `writerReach.walker` 3: the observed-shape STOP, MERGE-5AB §4.
  - `proseFamilyContract` 5, `newsHeadlineContract` and `newsVoiceContract`: the lanes', the AO-0 corpus.
  - `tuningRegister` 4, `institutionTable` 2, `negativeAssertionAnchor` 2, `heldKeyWriterCensus` 1, `mutationCoverageManifest` 1, `proseWiringCensus` 1.
  - `ledgerCitationIntegrity` and `provenanceMap`: ENVIRONMENT, the local `review-fixes-2026-07-08` ref is absent.

**The touched suites** (every test importing `InstitutionsTab`, `npcComponents`, `cardPowers`, `cardDoor` or `NPCsTab`): the base's two only.
- `phoneChromeFloor.census`: /admin and /world +1, the base's; this lane's +1 on three routes is re-keyed.
- `tabSentencesOnce`: X-50 PlotHooks repeats, the base's.

**Mine: none.**

## 6. CONFIRMED vs PLAUSIBLE

CONFIRMED:
- Both directions, NONE, the minted face, the DM person, the veil and the public projection, by the component tests at the tip.
- The navigation mechanism, by reading it in source (§1) and by the tests' tab-setter and `focusedEntity` assertions.
- The goldens unmoved, by the plain-node hash set at base and tip.
- The registers' own exits.
- Each red's attribution, by the same file run at a base worktree.

PLAUSIBLE:
- That a minted face's card line should print its power's name as the door when the power line also reads "first of X". The owner asked for the link; the duplication is one word on the seat's card. The alternative is to link the X inside "first of X" instead.
- That the public projection dropping the row is the intended "hide". The name itself stays on the NPC card, but the join (`institution`) is not public until STOP 1's migration lands. Then the row and the door return together on a public card unless the veil's ties eye is shut.

## 7. The tip

`lane/people-6-links-2026-11-07`, pushed with `--no-verify`. The tip is the commit that carries this record.
