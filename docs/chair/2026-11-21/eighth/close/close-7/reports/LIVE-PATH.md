# LIVE-PATH: the live path as it runs (CLOSE-7; R24h (4), restated as R24i (b)). A measure; nothing was built.

**THE ANSWER (CONFIRMED by run).**
- On the line, one newcomer decree applied at a tick re-deals the place around its people.
  - **Every saved person keeps their name** (1,804 of 1,804) and the newcomer arrives once in 180 of 180 places.
  - **The houses, powers, government and history move exactly as MASTER-REDERIVE's empty-layer re-derive moved them**: 65, 51, 7,
    63 and 53 places, the same counts.
  - **132 people in 41 places are left belonging to a power or house the place no longer holds.**
- On master, the same decree adds the newcomer. In **7 of 180 places it also moves something else**, through master's own
  engine:
  - 4 thorps gain a power;
  - 5 places have their stress and stressors rows rewritten;
  - 2 places have their pressure sentence re-voiced.

  No house, person, government or event moves on master.

**One change to the brief, by CLOSE-7:** the line tree is the line's CURRENT tip **0559a8405800c05929de584216708b58de2c3ae9**
(point 115, the troubles rule landed dark), not f9531eb3a. `/home/user/wt/line` is detached there, and `/home/user/wt/master` is
detached at db832c892 (`git rev-parse origin/master` names db832c892). Both trees are **KEPT** for phase 2, by CLOSE-7's word. The
brief's "remove both" is overridden.

## The table (CONFIRMED by run; one line per size; line = 0559a8405, ctrl = master db832c892)
Each cell counts places moved out of 30 (180 for "all"). The "moved" column counts a place where anything below moved other than
the newcomer's own arrival.

| size | tree | moved | houses | powers | gov name | events (name) | events (year and kind) | people keep name | kept people rewritten | people orphaned (people in places) | newcomer once |
|---|---|---|---|---|---|---|---|---|---|---|---|
| thorp | line | 14/30 | 6 | 5 | 0 | 10 | 7 | 44/44 | 0 | 0 in 0 | 30/30 |
| hamlet | line | 22/30 | 7 | 14 | 0 | 13 | 12 | 98/98 | 3 | 17 in 10 | 30/30 |
| village | line | 22/30 | 11 | 9 | 0 | 16 | 10 | 158/158 | 2 | 15 in 7 | 30/30 |
| town | line | 14/30 | 13 | 3 | 1 | 5 | 5 | 275/275 | 0 | 8 in 4 | 30/30 |
| city | line | 23/30 | 16 | 15 | 6 | 11 | 11 | 454/454 | 0 | 60 in 15 | 30/30 |
| metropolis | line | 18/30 | 12 | 5 | 0 | 8 | 8 | 775/775 | 0 | 32 in 5 | 30/30 |
| **all** | **line** | **113/180** | **65** | **51** | **7** | **63** | **53** | **1804/1804** | **5** | **132 in 41** | **180/180** |
| thorp | ctrl | 4/30 | 0 | 4 | 0 | 0 | 0 | 44/44 | 0 | 0 in 0 | 30/30 |
| hamlet | ctrl | 0/30 | 0 | 0 | 0 | 0 | 0 | 98/98 | 0 | 0 in 0 | 30/30 |
| village | ctrl | 0/30 | 0 | 0 | 0 | 0 | 0 | 158/158 | 0 | 0 in 0 | 30/30 |
| town | ctrl | 0/30 | 0 | 0 | 0 | 0 | 0 | 275/275 | 0 | 0 in 0 | 30/30 |
| city | ctrl | 0/30 | 0 | 0 | 0 | 0 | 0 | 454/454 | 0 | 0 in 0 | 30/30 |
| metropolis | ctrl | 0/30 | 0 | 0 | 0 | 0 | 0 | 775/775 | 0 | 0 in 0 | 30/30 |
| **all** | **ctrl** | **4/180** | 0 | **4** | 0 | 0 | 0 | 1804/1804 | 0 | 0 in 0 | 180/180 |

- **People lost or gained, by name, other than the newcomer:** 0 on both trees, in every size (CONFIRMED).
- **Mean and max moved per place** for every column: `live-path/line-table.md` and `live-path/control-table.md`. On the line, by
  name, they equal MASTER-REDERIVE's houses, powers, government and events cells: for example, houses in towns are 13 · 2.7 · 34,
  and events by year and kind in metropolises are 8 · 4.1 · 29 (CONFIRMED by both runs).
- **By record bytes, the line moves more than the names show (CONFIRMED).** In all 180 places the tick rewrites the record keys
  `institutions`, `powerStructure`, `history`, `economicState`, `defenseProfile`, `culturalIdentity`, `availableServices`,
  `resourceAnalysis` and `simulationTrace`. This includes the 67 places where no name moved.
  - In dp-town-0, for example, five houses' `desc`, every power's share and label, and the history's descriptions, tensions and
    plot hooks are rewritten. The names and years are kept.
- **Master's record keys moved (CONFIRMED):**
  - `npcs` and `generationCoherenceReceipt` in all 180 places;
  - `stress` and `stressors` in 5;
  - `powerStructure` in 4;
  - `pressureSentence` in 2.

## The control is not "the newcomer and nothing else" (CONFIRMED by run; the causes are PLAUSIBLE by read)
On master, the newcomer re-runs everything downstream of the pinned roster on master's own engine.
- **Four thorps gain a power:**
  - dp-thorp-0 and dp-thorp-29 gain "Creditor's Representative";
  - dp-thorp-13 gains "The Independent Bloc";
  - dp-thorp-14 gains "The Highborn Circle".

  Each is the faction its stressor seats; the stress cast's stakes are re-dealt with it.
- **dp-city-5's stressors are rewritten**, and the thorps' stress rows move with their new power.
- **Two pressure sentences are re-voiced.** dp-village-13's sentence changes "the Mayor who first identified it" to "the Priest who
  first identified it". dp-town-11 is the other place.

## People orphaned on the line (CONFIRMED by run)
A person who keeps their name can be left belonging to a power or house the re-derived place no longer holds.
- **Totals:** 132 people in 41 places. 130 have lost their power and 3 their house; one person has lost both.
- **The baseline is 0:** on the loaded record, 1,799 people are linked and none of them is orphaned.
- **Examples:**
  - dp-metropolis-3: "Thieves' Guild" is gone, and its 13 members are left pointing at it.
  - dp-city-0: the government's name changes from "Merchant oligarchy" to "City Council". The Mayor Qudama ibn Ali, the Wealthiest
    Merchant and the Guild Master still belong to "Merchant oligarchy", and the Priest and the Hedge Wizard to "Craft Guilds".
  - dp-city-8: 9 people are orphaned (City Council → Noble Governorship). dp-city-20: 8 (Royal Authority → City Council).
- **Rewritten in place:** five places also have kept people whose own row changed (dp-hamlet-3, 13 and 17 one each; dp-village-16
  two; dp-village-23 three).

## Method
**Saves.** The 180 master-born rows MASTER-REDERIVE wrote:
- master's engine at db832c892, `read24/make-plan.mjs`'s birth (`birthConfig({ settType })`), seeds `dp-<size>-<i>` for i = 0..29;
- saved in the row shape of `components/generate/SaveToLibraryButton.jsx :: handleSave` → `lib/saves.js :: supabaseSave`;
- read from the scratchpad `MR/line/saved/`. The files are unchanged since that run (latest mtime 2026-11-24 22:45:39, CONFIRMED),
  and each row's hash is in the data.

**Load, on each tree.**
- The library entry `lib/saves.js :: saveEntryFromSupabaseRow` builds (id, name, tier, settlement, config, seed), restated in the
  harness because the function is module-private.
- The settlement goes through that tree's `domain/normalizeSettlement.js :: normalizeSettlement`.
- On the line the load moves `npcs`, the top-level `factions` grouping and `schemaVersion` in 180 places, `relationships` in 163,
  and adds `migrationReports` in 71. This is `settlementMigrations.js :: migrateV1toV2`: `factionAffiliation` becomes
  `memberships[].power`, and `institution` becomes `{ kind: 'house', key }`.
- On master the load moves nothing.
- The record is hydrated as the OPEN save: `activeSaveId`, `settlement`, and `savedSettlements = [entry]`.

**The decree: the store's OWN doors in `src/store/editSlice.js`** (byte-equal on master and the line, CONFIRMED by `diff`), against
a minimal store. `get()` returns a plain state, and `set(fn)` runs the producer on it, as the store's draft does.
1. `stageAddDecreeIntent(get, set, { cardType: 'npc', values: { name: 'Aldous Newcombe', role }, pools, orderedAt })`.
   - This is the binder `components/edit/EditModeShell.jsx :: addTo('npc')` calls.
   - It mints the id with `mintNewcomerId` → `domain/edit/dmLayer.js :: mintDmId(seed, 'minted', n)`, builds the `add-npc` op with
     `operations.js :: makeOp`, and stages the entry with `stageDecree` → `domain/edit/registry.js :: stage`.
   - `pools` is `{ 'npc.role': poolValues('npc.role', record) }`, the world the advance itself reads a pool from
     (`campaignAdvanceSession.js:192`). `role` is the pool's first member.
2. `markDecreeApplied(get, set, { saveId, entryId, meta: { appliedAt, tickRef } })`. This is EM-C1's `registry.js :: markApplied`,
   the verb the tick's hook (`domain/worldPulse/decreeHook.js`) marks a due decree with.
3. `applyRosterDecreesAtTick(get, set, { saveId })`, exactly the call `campaignAdvanceSession.js` (line ~1063) makes for each roster
   save after the pulse. Inside it:
   - **The minted row:** `dmLayer.js :: applyEdit` → `mintRow`, which writes `minted[id] = { kind: 'npc', name, role }`.
   - **`regenerateWithLayer`** (`store/settlementRederiveAction.js`) is handed `layerForRun`, the layer holding THIS tick's one
     minted row, together with `storedConfigFor(get(), saveId, live)` (the library row's `config`) and `DECLARATION_CONSULT`. It
     calls `dmLayer.rederive`, whose `pinsFrom` pins the `npcs` collection and its closure, with the newcomer appended.
   - **Then** `carryForward(live, derived)`, `dmLayer` written, and one `set` onto the view and the library row.

   Every receipt reads `rederived: true`, minted one id, and left `unapplied` empty, in 180 of 180 places on both trees
   (CONFIRMED). The library row equals the view.
- **What is not run.** The pulse's other effects at the same tick are not run, so the measure isolates the roster half. The
  difference between master's and the line's `settlementRederiveAction.js` is only the engine seam (`lib/localPipeline.js`, plus
  a remote flag that is closed here). `dmLayer.js` is equal on both trees (CONFIRMED by `git diff`).

**How each column is keyed** (MASTER-REDERIVE's keys, `before` = master's saved row and `after` = the tick's record):
- **Houses:** `institutions[].name`, as a multiset.
- **People:** `npcs[].name`.
- **Powers:** `powerStructure.factions[].faction`.
- **Government:** `powerStructure.governingName`.
- **Events:** `history.historicalEvents`, by name and by `yearsAgo` + `type`.

The new columns:
- **"People keep name":** the multiset intersection of the people's names before and after.
- **"Kept people rewritten":** a person with the same id and name whose row differs from the loaded record.
- **"People orphaned":**
  - A person (newcomer excluded) is orphaned when a house or power they belong to is not in the place's `institutions` or
    `powerStructure.factions`.
  - A person's house is read from `institution` (a v1 string, or the v2 `{ kind: 'house', key }`) or from `allegiance.house`.
    Their power is read from `factionAffiliation` (v1), `memberships[].power` or `allegiance.power` (v2).
  - The count is taken against the loaded record (0 on both trees). `secondaryAffiliation` is NOT read: it is a category such as
    "criminal network", not a power's name.

**Runs.** All went through the gate mutex, with the exit code appended to each log; logs are in the scratchpad `LP/`. The two final
runs are CONFIRMED, exit=0:
- `line3.log`: the line, 180 places in 25 s, 0 errors;
- `control3.log`: master, 180 places in 16 s, 0 errors.

Earlier runs (smoke, then two full passes before the orphan key was corrected for the v2 card) are superseded and not used. No file
under src/, tests/ or scripts/ changed in any tree, and nothing was committed (`git status` is clean in both).

## Data (`close-7/live-path/`)
- `live-path.census.jsx`: the harness. It is kept as phase 2's RED.
- `summarize.mjs`: the by-size tables.
- `line-rows.jsonl` and `control-rows.jsonl`: per place, what was lost and gained in each column, with the receipt, the newcomer's
  id, the orphan counts and the record keys moved.
- `line-table.md` and `control-table.md`.
- `PARTIAL.md`: the running notes.
- Sample records (saved, loaded and after) for 5 places on each tree are in the scratchpad: `LP/dump-line/` and `LP/dump-master/`.

The vitest configs that run the harness, rooted at each tree, are `LP/vitest.line.mjs` and `LP/vitest.master.mjs`. Each is run from
inside its tree:

```
LP_LOAD=<tree> LP_SAVED=<scratchpad>/MR/line/saved LP_OUT=<file> GATE_MUTEX_MAX_POLLS=400 sh scripts/gate-mutex.sh --run -- node_modules/.bin/vitest run --config <cfg>
```
