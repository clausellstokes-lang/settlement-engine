# RECON STAGE — the participation view's write path, settled by execution (2026-09-19)

**Lane:** Opus COMPILE (EM-B1f), recon stage under the chair's response to version 2.
**Tree:** `$SP/read-tip-e5bdfd031`, `rev-parse HEAD` → `e5bdfd03176b402e777f2681187b49db47ab43c5`,
`git status --short` **empty at the start and at the end**. Nothing edited, staged or committed on
any tree. Plain `node` only.

> ⚠ **NAMING.** The chair's message calls the ROSTER LOSS **F-2** and the dissolution class
> **F-1**; my version-2 report had them the other way round. **This report uses the chair's
> names throughout.** F-1 = *nothing permanent may be decided from the filtered view* (house
> dissolution is its first instance). F-2 = *nothing may be persisted out of the filtered view*.

---

## PART 1 — Q9: F-2 IS **CONFIRMED**. It is data loss on a routine, shipped DM action.

### 1.1 · The write path, end to end, with no re-merge anywhere

```sh
$ git grep -n "applyWorldPulseResultToState" HEAD -- src
  src/store/campaignAdvanceSession.js:557 · :858        (the two live commit sites)
  src/store/campaignWorldPulseDeferred.js:867 · :948 · :1015
  src/store/campaignPulseHelpers.js:106                 (the definition)
$ sed -n '196,197p;226,232p;241,245p' src/store/campaignPulseHelpers.js
    const save = state.savedSettlements[saveIdx];
    let nextSettlement = update.settlement || save.settlement;          ← :197  ⛔ THE LINE
    const nextSave = { ...save, settlement: nextSettlement, campaignState, timestamp: now };
    state.savedSettlements[saveIdx] = nextSave;                          ← :232  the store's save
      persistUpdates.push({ saveId: save.id,
        settlement: cloneJson(nextSettlement),                           ← :243  the DB payload
        campaignState: cloneJson(campaignState) });
$ sed -n '490,494p' src/store/campaignSliceShared.js
      : persistSaveUpdate(update?.saveId, { settlement: update.settlement, … })
$ sed -n '621p' src/store/campaignSliceShared.js
  await persistSaveUpdates(persistUpdates);
```

⇒ **`update.settlement` replaces the save's settlement wholesale — by assignment, not by merge —
and the same object is cloned into the DB payload.** I searched the whole path for a re-merge (a
merge by id, a "participation view is read-only" guard, a changed-fields-only write-back) and
**there is none**: `campaignPulseHelpers.js` has exactly one settlement assignment (`:197`), and
`persistSaveUpdate` passes `update.settlement` straight through.

And the update is **born filtered**, before any mover runs:
```sh
$ sed -n '178,188p' src/domain/worldPulse/pulseKernel.js
function buildSettlementMap(snapshot, localSettlements) { … 
      settlement: localSettlements.get(String(item.id)) || item.settlement, …
$ grep -n "buildSettlementMap" src/domain/worldPulse/pulseKernel.js
178: (definition)     1506:  const settlementMap = buildSettlementMap(postTimeSnapshot, localSettlements);
$ sed -n '579p' src/domain/worldPulse/pulseKernel.js
    localSettlements.set(String(item.id), vaulted.settlement);     // descends from item.settlement
$ sed -n '127,129p' src/domain/worldPulse/worldSnapshot.js
    if (Array.isArray(_npcs) && _npcs.some((n) => isOffStage(n))) {
      settlement = participationViewCache.get(_s) || { ..._s, npcs: _npcs.filter((n) => !isOffStage(n)) };
```
⇒ ⛔ **F-2 needs no mover at all.** `postTimeSnapshot` is `buildWorldSnapshot`'s output, so every
update entry starts life holding the filtered roster. My version-2 control proved it: with **every
density law dormant** the written settlement still lost the person.

### 1.2 · ⭐ THE REPRODUCTION, IN A DM'S TERMS — real generation, the app's own writer, the shipped tick, the real store commit

`f2-dm-repro.mjs`. The only thing not loaded from the tree is `src/lib/supabase.js`, the single
module that reads `import.meta.env` (a Vite-only global); a node module hook replaces it with an
inert stub carrying its exact five-export shape. **Everything else — the generator, the DM writer,
the pulse, the store helper — is the shipped code.**

```sh
$ node --experimental-loader $W/stub-loader.mjs $W/f2-dm-repro.mjs
GENERATED TOWN: Dar-al-khand | roster 7 :: Dorothea Eindriðason · Yusuf Bjarnarson · Daud Jung ·
                               Bolontiku Rognvaldsson · Chang Ritter · Eun Randversson · The Lord Mayor

DM ACTION  applyNpcOp stasis-npc -> {"ok":true,"status":"applied","reason":null}
  the shelved person   : Dorothea Eindriðason | .stasis now = {"reason":"sequestered"}
  isOffStage(them)     : true
  roster ON THE SAVE   : 7 (the shelf does not remove anybody)

AFTER ONE TICK (commit: true), the roster THE SAVE WOULD HOLD
  store  state.savedSettlements[0].settlement.npcs : 6 of 7
  DB     persistUpdates[0].settlement.npcs         : 6 of 7
  IS THE SHELVED PERSON STILL THERE?  store: false | persisted: false
  ⛔ MISSING FROM THE PERSISTED ROSTER: Dorothea Eindriðason

UN-SHELVE AFTERWARDS  applyNpcOp return-npc -> {"ok":false,"status":"failed","reason":"npc_target_missing"}
```

⇒ ⛔⛔ **CONFIRMED. The shelved person is gone from both the store's save and the row that would
be written to the database, and they cannot be brought back** — `return-npc` refuses with
`npc_target_missing`, because the record that held them no longer exists. **Un-shelving can never
recover them.** The only recovery is the campaign-level `pulseUndoStack` snapshot
(`capturePulseSnapshot`, `campaignPulseHelpers.js:262-275`), which rewinds the whole tick and is
bounded — not a recovery of the person.

**The exact line where the filtered roster replaces the raw one:**
`src/store/campaignPulseHelpers.js:197` — `let nextSettlement = update.settlement || save.settlement;`
landing at `:232` (the store's save) and `:243` (the DB payload). Its origin is
`src/domain/worldPulse/worldSnapshot.js:127-129`, where the filtered object is minted.

### 1.3 · Reachability — this is not a dark path

| off-stage cause | producer | reachable today? |
|---|---|---|
| **stasis (shelved)** | the DM's **Availability** select → `queueEdit('stasis-npc', …)` (`NpcLifecycleControls.jsx:115-121`) → `applyNpcOp` writes `npc.stasis = { reason }` (`settlementPendingEditWriters.js:131`) | ⛔ **YES — a shipped, routine control.** (`enterStasis` in `npcOps.js:126` is a second, currently unwired spelling of the same act) |
| **hostage** | the roads mover: `roadsKernel.js:1073` writes `{ state:'hostage', … }`, returned at `:1092` | ⛔ **YES** — `roadsEnabled: true` (`simulationRules.js:675`) and it is in the **lights of all four presets**, including the default `realistic_regional` (`compendiumData.generated.js:412,413,416,417`) |
| `jailed` / `exiled` / `removed` | ⛔ **only after EM-B1f + EM-B1a** | not yet — which is why EM-B1f must land behind the cure |

---

## PART 2 — F-1's blast radius

### 2.1 · Who reads the filtered view, and what they write

`consumer-sweep.mjs` classifies every `src/domain/worldPulse` module that reads a snapshot-side
roster by what it writes. **23 read one; 10 are write-bearing:**

| consumer | what it writes | reversible? | reads |
|---|---|---|---|
| ⛔ **`factionDensityKernel.js`** | **the house is swept out of `powerStructure.factions`** + a `faction_dissolved` news beat | ⛔ **NO — R18 sweeps live state permanently** | **FILTERED** (`:699` `tickStart = item.settlement`; `:704` the reading; `:262` the `stillEmpty` confirmation reads `fresh`, which descends from the same view) |
| ⛔ **every mover, and the seam itself** | **the settlement row persisted to the save** | ⛔ **NO — F-2** | **FILTERED, from birth** (`buildSettlementMap:184`) |
| `npcLadderKernel.js` | ladder rungs in `spatialLedgers.npcLadder` | reversible — re-derived each tick from the roster | FILTERED |
| `npcGrowthKernel.js` | settlement updates (growth) | additive | FILTERED |
| `roadsKernel.js` | missions, ransom, whereabouts | reversible | ⭐ **RAW** — dispositioned "reads the FULL roster to manage hostages" |
| `partyImpact.js` | settlement updates | DM-authored | ⭐ **RAW** — dispositioned "the RAW READER, deliberately ungated" |
| `assizeKernel.js` · `commonsVoiceKernel.js` · `momentum.js` | updates + news | reversible | FILTERED |
| `conquestDoctrineStage.js` · `warDeployment.js` | ledgers | reversible | FILTERED |

⚠ **Two more roster-readers with permanent consequences, both currently unreachable — named so
they are cured with the class rather than found later:**
- `settlementLifecycleFirstClass.js:611-615` — on a settlement's death it maps `settlement.npcs`
  stamping `dispersed: true` and returns `{ ...settlement, npcs }`. Through the filtered view an
  off-stage person is **not in the array**, so the dispersal would neither mark them nor carry
  them — the law-6 conservation `npcCirculation`'s disposition cites.
- `successorNpc.replaceOustedNpcs` (`:66-77`) — replaces ousted NPCs by name over
  `settlement.npcs`; an off-stage holder is invisible to it.
- `src/generators/density/titularSuccession.js` (`:177`, `:231`) calls `factionRosterOf` and has
  **no importer in `src/`** — dark, and it will read whatever settlement its future caller passes.

⚠ **Why the class could hide:** the participation ratchet greps only two roots —
```sh
$ sed -n '308p' tests/domain/roadsParticipation.test.js
    const out = execFileSync('grep', ['-rl', '\\.npcs', 'src/domain/worldPulse', 'src/domain/spatial'], …)
```
— and the `.npcs` read that bites is at `src/domain/density/factionLifecycle.js:117`, outside
both. `factionDensityKernel.js` *is* listed (`:139`) but carries **no disposition comment**, so it
inherits the file's blanket *"everything else is via-snapshot (protected by the gate, no edit)"*.

### 2.2 · The population at risk — measured on real generated worlds

`population-at-risk.mjs`, using the estate's own `factionRosterOf` over the golden master's
**full 525-row corpus**:

```sh
$ node $W/population-at-risk.mjs 1
settlements generated: 525 | stride 1
factions total: 3378 | with EXACTLY ONE rostered member: 1608 (47.6%)  | already empty: 490
of those sole-member factions, GOVERNING: 147 (a ruling_interregnum instead of a dissolution)
settlements holding at least one such faction: 525 (100.0% of the corpus)

by tier:  tier | towns | factions | sole-member factions
   city          84       756       304
   hamlet        84       360       192
   metropolis    84       756       218
   thorp         84       240       204
   town         105       726       342
   village       84       540       348
```
(A 66-town stride agrees: 48.1%, 100% of towns.)

⇒ ⛔ **47.6% of all factions hold exactly one rostered member, and EVERY settlement in the corpus
holds at least one such faction.** Shelving that one person — or the roads mover taking them
hostage — permanently dissolves their house. 147 of the 1,608 are governing, which takes the
softer `ruling_interregnum` path instead.

⚠ **A naming note:** I could not find a canonical "63-row sample" of **settlements** — the
charter's 63-row sample is EM-P2's census corpus and `tests/helpers/dossierCorpus.js` is a prose
loader. I used the estate's canonical settlement corpus (the golden master's 525 rows, cached by
the script) and report a stride beside it. If the chair meant a specific 63-row settlement set,
name it and I will re-run.

---

## PART 3 — the cures, PRICED, NOT CHOSEN

### Cure (a) — the irreversible consumers and the write-back read the RAW roster

⭐ **The raw roster is already on the snapshot item.** `worldSnapshot.js:139-146` returns
`{ id, save, name, settlement, activeConditions, causal, system }`, and `save` carries the
untouched settlement (`saveSettlement`, `:11`). So a consumer that needs the raw roster does not
need a new field — it needs to be told which to read.

| touched | symbol | change |
|---|---|---|
| `src/domain/worldPulse/pulseKernel.js` | `buildSettlementMap` (`:178-188`), the `localSettlements` seed (`:579`) | the write-back base becomes the RAW settlement, so nothing filtered is ever persisted (**cures F-2**) |
| `src/domain/worldPulse/factionDensityKernel.js` | `:699` `tickStart`, `:262` `stillEmpty` | the lifecycle reading and its confirmation read the raw roster (**cures F-1's first instance**) |
| `src/domain/worldPulse/settlementLifecycleFirstClass.js` · `successorNpc.js` | `:611`, `:66` | the two other permanent roster writers, for the same reason |
| `tests/domain/roadsParticipation.test.js` | `:308` | ⛔ **the ratchet widens to `src/domain/density`** so this class cannot hide again |

**Size:** 3–4 production files, one test root. **Risk:** every mover that currently sees the
filtered settlement keeps seeing it, so participation semantics are untouched; only the
*decision* and the *write* change base.

### Cure (b) — the filter keeps reversible absences IN, under a flag; participation reads skip them

| touched | symbol | change |
|---|---|---|
| `src/domain/worldPulse/worldSnapshot.js` | `:127-129` | the view keeps reversibly-absent people, marking them |
| all **seven** `isOffStage` consumers | `envoyCasting:96` · `npcLadderState:201` · `npcLadderKernel:661` · `roadsKernel:474,928` · `warSeatBooks:102` · `worldSnapshot:127,129` | each must now skip them itself — the widening the ONE-chokepoint design exists to avoid |
| `src/domain/roads/state.js` | `isOffStage` | gains a reversibility split |
| `tests/domain/roadsParticipation.test.js` | `:308` | same widening |

**Size:** ~9 files. **Risk:** it re-opens the chokepoint the roads design closed ("the ONE
participation chokepoint"), and each consumer becomes a place the next member can be forgotten —
exactly the class EM-B1d's walker exists to prevent.

### Cure (c) — MY THIRD CANDIDATE, stated plainly

**F-1 and F-2 are one bug with two faces: the participation view is a READ projection that was
allowed to become the WRITE base.** Cure it once, at the seam: the tick's write-back and every
irreversible decision take the RAW settlement; the filtered view stays a read-only projection
handed to participation readers only. That is cure (a)'s first two rows generalised into a rule —
*"nothing permanent is decided from, and nothing is persisted out of, the participation view"*,
which is exactly the sentence the chair chartered EM-B1k under. Under (c), (a) is the
implementation and (b) is unnecessary.

### Golden neutrality — measured, and BOTH cures are neutral

```sh
$ git grep -rln "stasis" -- tests/fixtures      → (nothing)
$ git grep -rln "whereabouts" -- tests/fixtures → (nothing)
$ node -e "…preset-lighting-witness-golden.json…"
bytes: 8560 | contains "stasis": false | "hostage": false | "jailed": false | "exiled": false
$ node $W/corpus-purity.mjs
settlements sampled: 35 | generated NPCs: 340 | with .stasis: 0 | with .whereabouts: 0
```
⇒ **No golden scenario contains a shelved or hostage NPC, and generation never writes either
key.** Both cures — and cure (c) — are **golden-neutral on the corpus by measurement**: they
change only worlds where the bug fires, i.e. worlds where a DM has shelved somebody or the roads
mover has taken a hostage. `generatorGoldenMaster`, `dossierProseManifest` and the preset witness
cannot move.

---

## PART 4 — what a DM sees today, in plain words

> You generate a town. It has seven named people and several houses; roughly half of those houses
> are one person. You decide a character is off-screen for a while — an illness, a pilgrimage, a
> secret — so you set their **Availability** to "sequestered". The app accepts it; the roster
> still shows seven.
>
> You advance the world one month.
>
> **That person is no longer in your town.** Not shelved — *gone*. Their house is gone with them,
> with a chronicle line saying it dissolved. You cannot un-shelve them: the app says there is
> nobody by that name. The only way back is to undo the whole month.
>
> The same thing happens, with no action from you at all, when the roads take somebody hostage —
> and the roads are on in every preset, including the default.

---

## PART 5 — Q8: the walker's `omits` field, with the two-line example and a recommendation

Under FORM B, `src/domain/roads/state.js` spells only `'dead'` (to subtract it), so its roster row
is `spelling: 'literals', enumerator: false, omits: ALL_BUT_DEAD` — lawful, but:

```js
// what the row SAYS, read plainly:
{ file: 'src/domain/roads/state.js', symbol: 'isOffStage', omits: ['exiled','jailed','missing','removed','retired'] }
// what the code DOES: it puts exiled, jailed and removed OFF-STAGE. Three of the five "omitted"
// words are exactly the ones the arm acts on — they are DERIVED from NPC_UNAVAILABLE_STATUSES,
// not spelled, and `omits` means "not written here", not "not handled".
```

**Recommended wording, if the chair keeps the two-spelling scheme:** rename the field's *meaning*
in the walker's header from "the members this row leaves out" to **"the members this row does not
SPELL, each with the reason it need not"**, and require a derived row's `why` to name its source
vocabulary. That is a comment-and-contract change, zero code.

**Recommended alternative, if the chair prefers the field to stay literal:** add a third
`spelling: 'derived'` whose checker asserts (1) the file imports the named vocabulary, (2) every
literal it spells is used only to subtract, and (3) `omits` lists only the members genuinely
outside the arm — here `missing` and `retired`, which is what the code means. Cost: one branch in
`offencesOf` (`:281-291`) and one roster row shape. **The chair rules it with EM-B1k's shape.**

---

## PART 6 — Q10 applied

Acknowledged and applied: **EM-B1f does not narrow.** Its version-2 packet stands as compiled,
with all three members (`exiled`, `jailed`, `removed`), and its header now carries
**`Depends on: EM-B1d (LANDED at 95e494bdb) · EM-B1k (chartered, not yet landed)`** with the
status note pointing at EM-B1k instead of at an open ruling. Nothing else in the packet changed.

---

## Labelling

**CONFIRMED** (command + output quoted above): the absence of any re-merge on the write path; the
DM-level reproduction including the failed un-shelve; the reachability of both stasis and hostage;
the 525-row population at risk; the consumer classification; the corpus and fixture purity; the
snapshot item carrying the raw `save`.
**PLAUSIBLE**, and labelled where it appears: the reversibility column for the six non-dissolution
write-bearing consumers is read from their code and dispositions rather than executed one by one
(only `factionDensityKernel`'s irreversibility was executed); and the two unreachable permanent
writers (`settlementLifecycleFirstClass`, `successorNpc`) are traced by reading, since no live
path reaches them today.
**NOT ADJUDICATED:** the choice among cures (a), (b) and (c) is the chair's.
