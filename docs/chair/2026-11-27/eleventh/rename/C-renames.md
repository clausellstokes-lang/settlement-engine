# (C) THE RENAMES THE PRODUCT OFFERS

Tree: `lane/stack-121-guard-wip-2026-11-27` at cccda7569. Read from the code (PLAUSIBLE) unless marked CONFIRMED (executed or grepped to an exhaustive result). "House" in this product is an institution (the Institutions tab's cards; `EDITABLE_FIELDS.institution.backs` "the powers the house backs"; `institutionRename.js` "renaming the worst-case house").

## 1. The town

| # | control | action / reducer | what it writes |
|---|---|---|---|
| T1 | the dossier header's inline pencil in the live editor: `src/components/dossier/DossierHeaderRow.jsx :: commitRename` -> `queueEdit('rename-settlement', { newName })` | `src/domain/pendingEditIntents.js` validates `newName = text(input.newName)` (trimmed; empty refused `new_name_required`); `src/store/settlementPendingEdits.js` (the rename-settlement apply): a SAVED town -> `renameSettlement(saveId, newName)`; an UNSAVED town -> `state.settlement.name = payload.newName` | the name only |
| T2 | the saved dossier's header (readOnly saved view, `allowRename`): `src/components/SettlementDetail.jsx :: handleRenameSettlement` | `src/store/settlementSlice.js :: renameSettlement` -> `src/store/settlementRenameHelpers.js :: renameSettlementImpl`; the detail copy by `src/components/settlements/helpers.js :: renameDetailSettlement` | `settlement.name` and the save row's `name` (and its cloud `name` column); in CANON also one `RENAME_SETTLEMENT` flavour row on the event log ("<old> is now known as <new>."). Persisted by `persistSaveUpdate` -> `lib/saves.js :: supabaseUpdate`, which RE-COMPOSES the shared page's stamp (`publicProseForRow` -> `composePublicProse(renamed)`) on the same write |
| T3 | (naming, not renaming) the create form's "Settlement Name (optional)": `src/components/ConfigurationPanel.jsx` -> `config.customName` | `src/generators/steps/assembleSettlement.js` (`customName.trim() || generateSettlementName(culture)`) | a new BIRTH; not a rename of a saved town |

What the town rename does NOT write: no derived field, no stored prose (no cascade; history events, tensions, hooks, traditions keep the old name: see (F)), not `_seed`, not `id`, and NOT the AI narrative (`renameSettlementImpl` never calls `aiSlice :: applyCosmeticRename`, which the person and power renames do call: PLAUSIBLE, by reading). OUT of the line: the world tick's own rename at a collapse (`src/domain/worldPulse/settlementLifecycleFirstClass.js`, dual-writes `config.customName`), advance time.

## 2. A person

| # | control | action / reducer | what it writes |
|---|---|---|---|
| P1 | the library's "Edit Names" (Cartographer): `src/components/settlementDetail/SettlementDetailEditNames.jsx` -> `src/components/SettlementsPanel.jsx :: applyRename('npc', ...)` (refused in canon) | `src/components/settlements/helpers.js :: withNpcRenamed` -> `src/domain/factionRename.js :: npcRenameChanges` / `applyNpcRenameToSettlement` (THE ONE NPC-RENAME WRITER); partners by `applyNpcRenameToPartner`; then `applyCosmeticRename` on each touched save's ai_data | the name at every JOIN of `NPC_RENAME_SURFACES` (`npcs[].name`, `factions[].members[].name`, `relationships[].npc1Name/npc2Name`, `interSettlementRelationships[].npcName`, the crisis cast's `roles[].name`, `levers[].holderName`); the person's `id` is left alone; GENERATED PROSE ABOUT THE PERSON IS NOT REWRITTEN (the module's own ledger: "NO RENAME LANE HAS EVER REWRITTEN GENERATED PROSE ABOUT A PERSON") |
| P2 | the store's `renameNPC` (pending edit `rename-npc`, `settlementPendingEdits.js` -> `settlementRenameHelpers.js :: renameNpcImpl`, the same writer) | as P1 | as P1. No component in `src/components` queues `'rename-npc'` (grep: only `PendingChangesBar.jsx` labels one), so the store lane has no UI producer on this tree (CONFIRMED by grep) |

## 3. A house (institution)

No control and no store action renames an institution (CONFIRMED by grep: `applyInstitutionRenameToSettlement` / `institutionRenameChanges` have no caller outside `src/domain/institutionRename.js` and its tests; `serviceComponents.jsx` imports only a constant). The writer exists: `src/domain/institutionRename.js :: applyInstitutionRenameToSettlement` (key joins only, "NOT ONE CASCADE ROW IS PROSE"). (D) measures a house rename BY THAT WRITER, as the product would perform one, and says so. The institution's `desc` and `backs` are editable (`EDITABLE_FIELDS.institution`), its name is not.

## 4. A power (faction)

| # | control | action / reducer | what it writes |
|---|---|---|---|
| F1 | the dossier workbench: `src/components/dossier/WorkbenchFactionRename.jsx` (mounted by `SettlementWorkbench.jsx`) -> `queueEdit('rename-faction', { factionIndex, newName })` | `settlementSlice.js :: renameFaction` -> `settlementRenameHelpers.js :: renameFactionImpl` (refused in canon) -> `src/domain/factionRename.js :: applyFactionRenameToSettlement` + `applyFactionRenameToPartner` + persist + `applyCosmeticRename` | dual-writes `.faction` + `.name`; every key join of `FACTION_RENAME_SURFACES`; AND stored PROSE by whole-word substitution (`substituteWholeWord`): the roster `desc`, pairwise `narrative`/`dmNote`, `powerStructure.recentConflict`, tension party rosters, `pressureSentence`, `coherenceNotes[].note`, NPC `title`/`role`/`secret`/`goal` prose, relationship roles |
| F2 | the library's "Edit Names": `SettlementsPanel.jsx :: applyRename('faction', ...)` | `helpers.js :: withFactionRenamed` -> `factionRenameChanges` (the same writer) | as F1 |

## 5. Can a town be saved NAMELESS?

See the execution below (CONFIRMED rows) and, for every key of (A) holding the town's name, what a falsy key does.

**Through the UI: NO** (PLAUSIBLE, by reading every writer): the create form falls back to a generated name (`assembleSettlement.js`: `customName.trim() || generateSettlementName(culture)`); every rename trims and refuses an empty name (`pendingEditIntents.js` `new_name_required`; `renameSettlementImpl` `if (!trimmed) return false`; `SettlementsPanel.applyRename` `if (!newName.trim() ...) return`).

**Through the JSON import: YES** (CONFIRMED, `tools/nameless.jsx`, `work/N.jsonl`): an export file whose `settlement.name` is `""`, `"   "` or absent passes `validateAccountImport` + `prepareSettlementEntry` and is SAVED by `saves.save` with `settlement.name` `""` / `"   "` / absent (the library ROW is named "Imported settlement": `prepareSettlementEntry`'s display fallback names the row, never the record). 3 of 3 forms, 10 of 10 towns. (A gallery import keeps whatever name the shared row holds; a shared row comes from a saved town, so it is never blank unless the town was imported blank.)

What each key of (A) holding the town's name does on a nameless town (the ten towns rendered with `name: ''`, every tab walked, picks logged):

| site | key on a nameless town | what prints |
|---|---|---|
| A1-A10 Daily Life (`dailyLife.js :: pickNameable`, `pickKey`) | `typeof name === 'string' && name ? ... : null` -> **null** (CONFIRMED: 174 picks, every one keyed null) | `pickRendezvous` on a falsy key takes the FIRST eligible line of the branch (A1, W5, P1, E1 ...: 26 distinct lines over 174 picks): every nameless town in the same branch prints the same Daily Life. A BLANK name (`"   "`) is truthy: the key is `"   ::dailyLife.<slot>::<branch>"`, one constant shared by every blank-named town (PLAUSIBLE, by reading) |
| A16 foodGapHookLine | `::<band>::food-gap` (PLAUSIBLE) | one line per band, the same for every nameless town |
| A18 crisisSummaryVantage | `::<kind>` (PLAUSIBLE) | one column per crisis kind for every nameless town |
| A19 / A20 fortune | `this place::...` (the code's own constant fallback, PLAUSIBLE) | one line per event/age |
| A26 overview headline | `name || tierWord` -> the tier word (PLAUSIBLE) | one headline per tier |
| A11 / A21 viability, arrangement | `_seed ?? id ?? name`: the name is never reached on a record with an id (every saved record has one: `normalizeSettlement` stamps it) | unchanged |
| A32 / A33 tensionCause | `''` (unwired) | - |

A key on the town's `id` has no nameless case: `normalizeSettlement` stamps an `id` on every record that lacks one (from `_seed`, else from the record's content).
