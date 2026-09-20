# EM-B1k2 — COMPILE EVIDENCE (Opus COMPILE lane, 2026-09-20)

**Tree:** `$SP/read-tip-32602dc60`, detached. `git rev-parse HEAD` → `32602dc607b7423838249cf57d73baf08feb047d`; `git status --short` **EMPTY at the start and at the end**. Nothing edited, staged or committed on any tree. Plain `node` (plus one module hook that stubs `src/lib/supabase.js`) and read-only git.

⚠ **A fact without a command is not verified.** Every row below carries the command and its output. Claims are **CONFIRMED** (executed) or **PLAUSIBLE** (reasoned), and each is labelled where it appears.

---

## §1 · The tree, the window, the preamble — CONFIRMED

```sh
$ git -C $SP/read-tip-32602dc60 rev-parse HEAD
32602dc607b7423838249cf57d73baf08feb047d
$ git -C $SP/read-tip-32602dc60 status --short
(empty)
$ date
Sun Sep 20 02:22:10 EDT 2026
```

The J-T1 window from this tree to the build branch's tip, over every change-manifest and `requiredSymbols` path:

```sh
$ git -C $SP/slot-2 diff --stat 32602dc607b7423838249cf57d73baf08feb047d 07cc2efb6 -- \
    src/domain/worldPulse/factionDensityKernel.js src/domain/worldPulse/roadsKernel.js \
    src/domain/worldPulse/successorNpc.js src/domain/worldPulse/settlementLifecycleFirstClass.js \
    src/domain/density/factionLifecycle.js tests/domain/roadsParticipation.test.js \
    tests/domain/irreversibleRawRoster.test.js src/domain/worldPulse/pulseKernel.js \
    src/domain/worldPulse/worldSnapshot.js src/domain/worldPulse/npcVerdictPulse.js \
    src/domain/worldPulse/applyWorldPulse.js
(NOTHING — no byte differs)

$ git -C $SP/slot-2 diff --stat 32602dc60... 07cc2efb6 -- src tests | tail -5
 tests/lint/.lighting-census-baseline.json | 16 ++++++++--------
 1 file changed, 8 insertions(+), 8 deletions(-)
```

⇒ **CONFIRMED**: across the four docs commits the branch has taken since this tree, the ONLY `src`/`tests` byte to move is the lighting census baseline (the chair's ONE refreeze). No path this packet touches moved. The read tree is the right substrate.

```sh
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1
$ git -C $SP/slot-2 show 07cc2efb6:docs/implementation/preambles/EM-PREAMBLE.md | shasum -a 256
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1
```

⇒ **CONFIRMED**: identical in the read tree and at the branch tip. The header's SHA-256 is the chair's stamp; this is the verified value.

```sh
$ ls tests/domain/irreversibleRawRoster.test.js
ls: ...: No such file or directory
```
⇒ **CONFIRMED**: the CREATE target is absent.

---

## §2 · The seam as it stands — CONFIRMED by reading, by symbol

```sh
$ grep -n "tickStart" src/domain/worldPulse/factionDensityKernel.js
699:    const tickStart = item && item.settlement ? asObject(item.settlement) : null;
700:    if (!tickStart) continue;
706:        /** @type {unknown} */ (tickStart)),
723:      : tickStart;

$ awk 'NR>=671 && NR<=745 && /item/ {print NR": "$0}' src/domain/worldPulse/factionDensityKernel.js
680:   const items = Array.isArray(snap.settlements)
683:   if (!items.length) return { changed: false, ... };
689:   const itemById = new Map(items.map(it => [String(asObject(it).id), asObject(it)]));
690:   const orderedIds = [...itemById.keys()].sort(compareCodepoint);
698:     const item = itemById.get(sid);
699:     const tickStart = item && item.settlement ? asObject(item.settlement) : null;

$ grep -n "reading\." src/domain/worldPulse/factionDensityKernel.js
709:    // ⚠ NOT `|| !reading.reactions.length`. ...
714:    if (!reading.governed) continue;
732:      /** @type {Record<string, unknown>[]} */ (reading.reactions),
```

⇒ **CONFIRMED**: `item` is read at exactly one other site in `advanceFactionDensity` (`itemById.get`), and `reading` is consumed for `governed` and `reactions` **only** — `reading.census` has no consumer. The one-line change is therefore isolated to the IRREVERSIBLE lifecycle decision and to the `fresh` fallback at `:721-723`.

```sh
$ sed -n '721,723p' src/domain/worldPulse/factionDensityKernel.js
    const fresh = asObject(nextUpdates[ui]).settlement
      ? asObject(asObject(nextUpdates[ui]).settlement)
      : tickStart;
$ sed -n '262p' src/domain/worldPulse/factionDensityKernel.js
    const stillEmpty = factionRosterOf(fresh, faction).length === 0;
```

And the participation view's exact relationship to the raw settlement:

```sh
$ sed -n '125,133p' src/domain/worldPulse/worldSnapshot.js
    const _s = saveSettlement(save);
    const _npcs = (_s?.npcs);
    let settlement;
    if (Array.isArray(_npcs) && _npcs.some((n) => isOffStage(n))) {
      settlement = participationViewCache.get(_s)
        || { ..._s, npcs: _npcs.filter((n) => !isOffStage(n)) };
      participationViewCache.set(_s, settlement);
    } else {
      settlement = _s;
    }
$ sed -n '10,13p' src/domain/worldPulse/worldSnapshot.js
/** @param {any} save */
function saveSettlement(save) {
  return save?.settlement || save;
}
```

⇒ **CONFIRMED**: `item.settlement` is `saveSettlement(save)` itself when nobody is off-stage, and otherwise a shallow copy differing **only in `npcs`**. Swapping the object is exactly swapping the roster. ⇒ **CONFIRMED** the `||` fallback's limit: when `save.settlement` is falsy, `item.save?.settlement` is `undefined` and the read stays as today (EM-B1k's identical limit at `:184`).

---

## §3 · THE CORE MEASUREMENT — the reaction is produced from the filtered read and not from the raw one, and the chain does not move

`$W/tickstart-probe.mjs`, a corpus stride, EM-B1k's raw write base modelled in memory (the update entry is `save.settlement` in **both** runs; only the snapshot item's `.settlement` differs).

```sh
$ node --experimental-loader $W/stub-loader.mjs $W/tickstart-probe.mjs 75
stride 75 | towns with a shelved sole member of a NON-governing house: 7 (candidates 7)
⛔ dissolution reaction PRODUCED from the FILTERED tickStart : 7 / 7
⭐ dissolution reaction PRODUCED from the RAW      tickStart : 0 / 7
   faction_dissolved BEATS emitted, filtered / raw          : 6 / 6
⭐ chain outputs that MOVED between the two                  : 0
```

⇒ **CONFIRMED, three things at once.** (a) The habitat is real: today the irreversible reaction is minted 7 / 7 from a projection. (b) The cure removes it: 0 / 7. (c) ⭐ **The packet is BEHAVIOUR-NEUTRAL once EM-B1k has landed** — `{changed, newsEntries, settlementUpdates}` is identical in both runs, and the 6 `faction_dissolved` beats (already-empty houses) fire identically either way, which is the non-vacuity control: the arm is not silent because nothing happens.

One town, quotable (`$W/arms-probe.mjs`):

```sh
$ node --experimental-loader $W/stub-loader.mjs $W/arms-probe.mjs
TOWN Schwarzwalde (corpus row 0)  roster 3 | sole-member house: Merchant Guilds | its one member: Liutgar Bauer
DM ACT applyNpcOp stasis-npc -> {"ok":true,"status":"applied","reason":null}

(i) THE READ, ISOLATED — readFactionLifecycle(tickStart)
  FILTERED tickStart (item.settlement, TODAY): roster of Merchant Guilds = 0 | reaction: ["faction_dissolved"]
  RAW      tickStart (item.save.settlement, THE CURE): roster of Merchant Guilds = 1 | reaction: []
```

⇒ **CONFIRMED**: A1's red and its green, in one town, through the app's own DM writer.

---

## §4 · THE FALLBACK HOLE — EM-B1k's refusal rests on an unpinned invariant

`$W/tickstart-probe2.mjs`. Same towns; the only change is an update entry carrying **no `.settlement`**, so `fresh` falls back to `tickStart` (`:721-723`).

```sh
$ node --experimental-loader $W/stub-loader.mjs $W/tickstart-probe2.mjs 75
stride 75 | shelved-sole-member towns: 7
  TARGET house dissolved BEAT — filtered tickStart / raw tickStart : 0 / 0
  TARGET house SWEPT from powerStructure — filtered / raw          : 0 / 0
  ⛔ FALLBACK ARM (update entry with no .settlement) target beat   : 7 / 7
  corpus names: towns scanned 7 | rostered NPCs 63 | towns with a DUPLICATE name 0 | duplicate members 0
```

⇒ **CONFIRMED**: with EM-B1k's raw write base the shelved sole member's house survives (0 / 7 dissolved, 0 / 7 swept) — EM-B1k's `stillEmpty` confirmation works exactly as its packet claims. ⇒ ⛔ **CONFIRMED**: take the fallback and the same house is dissolved **7 / 7**, because `fresh` is then the filtered `tickStart`. **PLAUSIBLE, not confirmed:** that the fallback is unreachable in production — `buildSettlementMap` always sets `settlement`, but nothing in the tree pins that, and `applyWorldPulse.js:609` (`settlementUpdates.set(String(entry.saveId), entry)`) replaces an entry wholesale from another producer. The cure removes the dependency rather than arguing about it.

⇒ **CONFIRMED (small sample)**: 0 duplicate display names across 7 towns / 63 rostered NPCs — the `replaceOustedNpcs` name-join risk (§12.1 item 2) is not observed on this stride.

---

## §5 · THE TWO PERMANENT ROSTER WRITERS — reachable, un-cureable in place, and measured both ways

### §5.1 · Neither can read raw: neither receives a save — CONFIRMED

```sh
$ sed -n '578p' src/domain/worldPulse/settlementLifecycleFirstClass.js
export function applySettlementLifecycleOutcomeToSettlement(settlement, outcome) {
$ sed -n '64p' src/domain/worldPulse/successorNpc.js
export function replaceOustedNpcs(settlement, oustedNames, rng) {
```

⇒ **CONFIRMED**: neither signature carries a save or a snapshot item, so "read the RAW roster explicitly" is **not expressible** inside either file. Their base is their caller's.

### §5.2 · Both callers are made raw by EM-B1k — CONFIRMED

```sh
$ sed -n '715,717p;733p' src/domain/worldPulse/applyWorldPulse.js
      const entry = settlementUpdates.get(String(saveId));
      if (!entry) continue;
      const beforeSettlement = entry.settlement;
      const afterSettlement = applyOutcomeToSettlement(beforeSettlement, outcome, saveId, {...});
$ sed -n '290p' src/domain/worldPulse/applyWorldPulse.js
  const settlementUpdates = new Map(settlementMap ? [...settlementMap.entries()] : []);
$ sed -n '1506p' src/domain/worldPulse/pulseKernel.js
  const settlementMap = buildSettlementMap(postTimeSnapshot, localSettlements);
$ sed -n '1209p' src/domain/worldPulse/applyWorldPulse.js
  const settlementMap = new Map((saves || []).map(save => [..., { ..., settlement: save.settlement || save }]));

$ sed -n '617p;660,663p' src/domain/worldPulse/pulseKernel.js
    let s = mirrorCorruptionOntoSettlement(localSettlements.get(sid), worldState.npcStates, String(sid));
      const verdicts = applyOrganicNpcVerdicts({ worldState, settlement: s, exposures: oustedExps, ... });
$ sed -n '133p' src/domain/worldPulse/npcVerdictPulse.js
  const replaced = replaceOustedNpcs(
```

⇒ **CONFIRMED**: writer 1's pulse base is `buildSettlementMap`'s map (EM-B1k's `:184`) and its proposal base is already `save.settlement`; writer 2's base is `localSettlements` (EM-B1k's `:579`). **Both become raw with EM-B1k and with nothing else.**

### §5.3 · Both are REACHABLE today — the RECON's "unreachable" premise is REFUTED

```sh
$ grep -n "settlementLifecycleEnabled" src/domain/worldPulse/simulationRules.js
648:  settlementLifecycleEnabled: true,          # inside the WAVES virtual spread
$ git grep -n "settlementLifecycleEnabled" HEAD -- src/domain/compendium/generated/compendiumData.generated.js
412: "realistic_regional" ... "isDefault":true ... lights:[... "settlementLifecycleEnabled" ...]
413: "dramatic_campaign"  ... lights:[... "settlementLifecycleEnabled" ...]
416: "living_realm"       ... lights:[... "settlementLifecycleEnabled" ...]
417: "full_simulation"    ... lights:[... "settlementLifecycleEnabled" ...]

$ grep -n -B1 "advanceNpcCorruption(" src/domain/worldPulse/pulseKernel.js
388:  const corruption = advanceNpcCorruption(worldState, snapshot, rng.fork('corruption'), {...});
$ grep -n "export function advanceNpcCorruption" src/domain/worldPulse/npcAgency.js
695:export function advanceNpcCorruption(worldState, snapshot, rng, ...) {
$ grep -n "kind: 'ousted'" src/domain/worldPulse/npcAgency.js
847:        exposures.push({ npcId: id, settlementId: item.id, name: s.name, kind: 'ousted', ... });
```

⇒ ⛔ **CONFIRMED, BOTH REFUTED**: `settlementLifecycleEnabled` is lit in **all four presets including the default**, and `advanceNpcCorruption` — the sole producer of `kind: 'ousted'` — is called **unconditionally** at `pulseKernel.js:388` with no flag above it. Neither lane is dark. A5 and A6 are therefore contracted at REAL triggers.

### §5.4 · Handed the filtered view, both DROP the off-stage soul — CONFIRMED, executed, both directions

```sh
$ node --experimental-loader $W/stub-loader.mjs $W/arms-probe.mjs      # continued
(ii) THE DISPERSAL ARM — applySettlementLifecycleOutcomeToSettlement (terminal_death)
  RAW base (after EM-B1k):    roster out 3 | dispersed stamps 3 | the shelved soul present: true | dispersed:true
  FILTERED base (the class):  roster out 2 | dispersed stamps 2 | the shelved soul present: false

(iii) THE SUCCESSOR ARM — replaceOustedNpcs
  RAW base (after EM-B1k):    roster out 3 | the ousted replaced: true | the shelved soul present: true
  FILTERED base (the class):  roster out 2 | the ousted replaced: true | the shelved soul present: false
```

⇒ **CONFIRMED**: both writers lose the shelved soul permanently on a filtered base and carry them on a raw one. ⇒ ⛔ **CONFIRMED that the census lies about them today**:

```sh
$ sed -n '73p' tests/domain/roadsParticipation.test.js
  // DM sovereignty); everything else is via-snapshot (protected by the gate, no edit). A NEW
$ sed -n '248,251p' tests/domain/roadsParticipation.test.js
    'src/domain/worldPulse/settlementLifecycleFirstClass.js',
    'src/domain/worldPulse/successorNpc.js',
```
Neither row carries a disposition comment, so both inherit that blanket — and neither is via-snapshot. That is what §6.3's rewrites fix.

### §5.5 · And the `factionDensityKernel` row's disposition is about the WRONG function — CONFIRMED

```sh
$ sed -n '128,139p' tests/domain/roadsParticipation.test.js
    // TE-DENSITY-1 (§810.1 R8, the emergence mint): applyCadence reads the RAW roster of
    // `fresh` — the freshest SAVED copy the write lands on — solely to append the minted
    // FOUNDER ... Dormant by default ...
    'src/domain/worldPulse/factionDensityKernel.js',
```
⇒ **CONFIRMED**: the row is dispositioned, but only for `applyCadence`; the `tickStart` lifecycle read inherits the blanket. ⚠ And the existing clause is **aspirational at this tip** — `fresh` descends from the participation view until EM-B1k lands (§12.1 item 5).

---

## §6 · Sizes and ceilings — CONFIRMED with eslint's own `Linter`

`$W/efflines.mjs` (`max-lines`, `{ skipBlankLines: true, skipComments: true }`, eslint resolved through the read tree's own `package.json`):

```sh
$ node $W/efflines.mjs
   395 src/domain/worldPulse/factionDensityKernel.js
    50 src/domain/worldPulse/successorNpc.js
   462 src/domain/worldPulse/settlementLifecycleFirstClass.js
   838 src/domain/worldPulse/roadsKernel.js
  1581 src/domain/worldPulse/pulseKernel.js
    61 src/domain/density/factionLifecycle.js
   127 tests/domain/roadsParticipation.test.js

$ node -e "const b=require('./scripts/.size-baseline.json'); ..."
src/domain/worldPulse/roadsKernel.js  => 838
src/domain/worldPulse/pulseKernel.js  => 1581
factionDensityKernel.js / successorNpc.js / settlementLifecycleFirstClass.js / factionLifecycle.js => undefined (no row)

$ grep -n "max-lines" eslint.config.js | sed -n '...'
712:      'max-lines': ['error', { max: 800, skipBlankLines: true, skipComments: true }],   # src/domain/**
```

⇒ **CONFIRMED**: `roadsKernel.js` is at **838 / 838** — and LANDED `EP-3A`'s own manifest note says so in terms: *"this file sits at exactly its frozen 838, tolerance-zero in both directions, so an own-line import would red eslint and a shrink would red sizeBaseline"*. The other three sit far under the 800 `max-lines` ceiling and carry no baseline row. None of the four is on `PACKET_STANDARD.md`'s standing hot-file list at this tip.

---

## §7 · `requiredSymbols` — each proven by a quoted `grep -cF`, with the post-edit simulation

```sh
$ for each row: grep -cF '<symbol>' <path>
1  src/domain/worldPulse/factionDensityKernel.js :: export function advanceFactionDensity
1  src/domain/worldPulse/factionDensityKernel.js :: function applyReactions
1  src/domain/worldPulse/factionDensityKernel.js :: function applyCadence
1  src/domain/density/factionLifecycle.js :: export function readFactionLifecycle
1  src/domain/density/factionLifecycle.js :: export function factionRosterOf
1  src/domain/density/factionLifecycle.js :: export const ROSTER_ABSENT_STATUSES
1  src/domain/worldPulse/worldSnapshot.js :: export function buildWorldSnapshot
1  src/domain/worldPulse/pulseKernel.js :: function buildSettlementMap
1  src/domain/worldPulse/applyWorldPulse.js :: function applyOutcomeToSettlement
1  src/domain/worldPulse/settlementLifecycleFirstClass.js :: export function applySettlementLifecycleOutcomeToSettlement
1  src/domain/worldPulse/successorNpc.js :: export function replaceOustedNpcs
1  src/domain/worldPulse/npcVerdictPulse.js :: export function applyOrganicNpcVerdicts
1  src/domain/worldPulse/roadsKernel.js :: const fullRoster
1  src/domain/roads/state.js :: export function isOffStage
1  tests/domain/roadsParticipation.test.js :: function foundReaders
1  tests/domain/roadsParticipation.test.js :: const UNDISPOSITIONED_NPCS_READERS
```

**The post-edit simulation, row by row.** Thirteen rows sit in files this packet does not touch or touches only by comment ⇒ present verbatim after the build. `export function advanceFactionDensity` — the edit is inside its body, the signature survives. `function foundReaders` — the edit is inside its body (a third grep root), the declaration survives. `const UNDISPOSITIONED_NPCS_READERS` — byte-identical by contract. ⇒ **ALL SIXTEEN SURVIVE.**

**`retiredSymbols`: NONE, and it is proven, not assumed.**

```sh
$ grep -cF 'const tickStart = item && item.settlement ? asObject(item.settlement) : null;' \
    src/domain/worldPulse/factionDensityKernel.js
1
$ node -e "…190-entry PACKET_MANIFEST.json, rows naming any path of this packet…"
EP-3A LANDED | changeManifest: [MODIFY roadsKernel.js] | requiredSymbols: ["tickStreamSeedOf(worldState, { base: str(asObject(worldState).rngSeed) })"]
EP-3B LANDED | changeManifest: [MODIFY roadsKernel.js] | requiredSymbols: ["const yearSeed = yearStreamSeedOf(...)"]
EM-B1d LANDED | changeManifest: [⛔ COMMENT ONLY — MODIFY src/domain/density/factionLifecycle.js] | requiredSymbols: ["export const ROSTER_ABSENT_STATUSES"]
entries scanned: 190
```

⇒ **CONFIRMED**: the replaced line is a `requiredSymbols` row of **no** packet, and the symbol `tickStart` itself survives. Nothing is moved, renamed or deleted ⇒ no retirement and no cross-packet discharge owed. ⇒ **CONFIRMED**: **no non-terminal packet reserves any path here** — all three hits are LANDED. The only live collision is **EM-B1k**, whose placed §7 `TEST` row edits `tests/domain/roadsParticipation.test.js` and whose manifest entry is not yet in the register.

⇒ ⭐ **CONFIRMED PRECEDENT for a comment-only `MODIFY` row**: `EM-B1d`, LANDED, carries one on `src/domain/density/factionLifecycle.js` marked *"⛔ COMMENT ONLY — THE FROZEN ARRAY IS BYTE-IDENTICAL"*. That is the evidence behind §13 Q1's recommendation.

---

## §8 · The budgets — chunk closures measured with vite's own edge reader

`$W/eager-probe.mjs` imports `EAGER_FIRST_PAINT_MODULES` from the repo's **own** `vite.config.js` derivation:

```sh
$ node $W/eager-probe.mjs
EAGER_FIRST_PAINT_MODULES size: 268
       src/domain/worldPulse/factionDensityKernel.js
       src/domain/worldPulse/settlementLifecycleFirstClass.js
EAGER  src/domain/worldPulse/successorNpc.js
       src/domain/worldPulse/roadsKernel.js
       src/domain/worldPulse/pulseKernel.js
EAGER  src/domain/density/factionLifecycle.js
       src/domain/worldPulse/worldSnapshot.js
EAGER  src/domain/events/mutateEntities.js

$ node $W/eager-path.mjs
src/domain/worldPulse/successorNpc.js
  src/main.jsx -> src/store/index.js -> src/store/settlementSlice.js
   -> src/domain/events/mutateEntities.js -> src/domain/worldPulse/successorNpc.js
```

`$W/closure-membership.mjs` (the static-edge resolver copied verbatim from `computeEagerModuleGraph`):

```sh
$ node $W/closure-membership.mjs
### GENERATION WORKER (src/workers/generation.worker.js)     modules in closure: 220
   --  factionDensityKernel.js   --  roadsKernel.js   --  successorNpc.js
   --  settlementLifecycleFirstClass.js   --  density/factionLifecycle.js
### EAGER FIRST PAINT (main.jsx + kernel/** + generators/lookups.js)  modules: 251
   IN  successorNpc.js   (the other four: not in closure)
### ADVANCE INTERVAL WORKER (src/workers/advanceInterval.worker.js)   modules: 549
   IN  all five
### TOWN SCENE EXPORT WORKER   modules: 125   -- all five
```

⇒ ⭐ **CONFIRMED: 0 B into the ZERO-SLACK generation worker** (`WORKER_BUNDLE_CEILING_BYTES = 1401208`, `tests/build/generationWorkerLazy.test.js:159`) — none of the four is in its 220-module closure. ⇒ **CONFIRMED: `successorNpc.js` is the ONLY eager one**, and the packet's row on it is COMMENT-ONLY. ⇒ **CONFIRMED**: all five are in the advance worker's closure (TOOL-3's 4 KB per-train headroom; a DELTA, no per-packet re-mint).

The first-paint budget and its margin:

```sh
$ grep -n "CLOSURE_BUDGET_BYTES\|CLOSURE_GZIP\|CLOSURE_BROTLI\|679_000" tests/build/vendorPdfLazy.test.js
565:const CLOSURE_BUDGET_BYTES = 1_048_000;
595:const CLOSURE_GZIP_BUDGET_BYTES = 337_000;
596:const CLOSURE_BROTLI_BUDGET_BYTES = 283_000;
787:    expect(size).toBeLessThan(679_000);
976:  it.skipIf(!requireDistRead)(`entry static closure raw bytes stay under the first-paint budget (...)`
```
The newest figures the file itself records: **1,047,205 / 1,048,000** (T13 ratification, 2026-09-01) ⇒ ≈**795 B** of raw margin, and **678,131 / 679,000** for the lazy engine ⇒ **869 B**. ⚠ **PLAUSIBLE, not confirmed, that those are the live figures** — EM-P0's own raise note says the first-paint arm was *green* at `023eda2ec` without printing a number, and both arms are `skipIf(!requireDistRead)` so they measure nothing without a fresh `dist`. The file's history is explicit that raises here are **OWNER-SIGNED**, which is why the packet contracts `successorNpc.js` at **0 B** rather than pricing a rise.

⚠ **PLAUSIBLE**: that a comment-only edit renders zero bytes. Vite's production build strips comments other than legal ones, which is why the packet forbids `/*!`, `@license` and `@preserve` in the three comment rows and makes the attribution a §11 STOP condition rather than an assumption.

Edge-shared INPUT membership, against the metas' own `inputs`:

```sh
$ node -e "…for each supabase/functions/_shared/*.meta.json, match the four paths against m.inputs…"
aiCharterBundle.meta.json      inputs: 114 | hits: NONE
aiGroundingBundle.meta.json    inputs:  74 | hits: NONE
aiOutputSchemaBundle.meta.json inputs: 115 | hits: NONE
analyticsEventsBundle.meta.json inputs:  2 | hits: NONE
intentAtlasBundle.meta.json    inputs:   2 | hits: NONE
```
⇒ ⭐ **CONFIRMED**: no rebuild, no `_shared` rows, **no generator in `checks`**, and §P2.12's seven-path hazard does not arise.

---

## §9 · The ratchet widening — the exact new conviction

```sh
$ sed -n '308p' tests/domain/roadsParticipation.test.js
    const out = execFileSync('grep', ['-rl', '\\.npcs', 'src/domain/worldPulse', 'src/domain/spatial'], { cwd: process.cwd(), encoding: 'utf-8' });

$ grep -rl '\.npcs' src/domain/worldPulse src/domain/spatial | grep -v '\.test\.' | wc -l
41
$ grep -rl '\.npcs' src/domain/worldPulse src/domain/spatial src/domain/density | grep -v '\.test\.' | wc -l
42
$ grep -rl '\.npcs' src/domain/density | grep -v '\.test\.'
src/domain/density/factionLifecycle.js
```

⇒ ⭐ **CONFIRMED, re-measured at this tip**: the widening convicts **exactly one** new file, `src/domain/density/factionLifecycle.js`. 41 → 42.

```sh
$ grep -n "UNDISPOSITIONED_CEILING" tests/domain/roadsParticipation.test.js
  const UNDISPOSITIONED_CEILING = 7;     # monotone-down; "You may burn it; you may never pad it."
```
⇒ The new conviction goes to `EXPECTED` **with** a disposition. The quarantine and its ceiling stay byte-identical.

---

## §10 · Registers and the `tests/` sweep

```sh
$ node -e "Object.keys(require('./docs/content/wiring-census.json').stamp.files)"
src/domain/display/stateProse/{generalStateProse,powerStateProse,economyStateProse,defenseStateProse,
  stressorsStateProse,warFaithStateProse,dossierMounts}.js          # 7 rows, none of the four
$ grep -c "factionDensityKernel\|roadsKernel\|successorNpc\|settlementLifecycleFirstClass" \
    tests/lint/.prose-numerics-baseline.json
0
$ for f in …; do git grep -n "$f:[0-9]" HEAD -- src docs/content tests; done
(no output for ANY of the five paths)
$ grep -n "spanDigest" tests/lint/tuningRegister.walker.test.js | sed -n '...'
212:    expect(spanDigest(commented), 'a comment must not move a digest — otherwise every'
213:      + ' documentation pass becomes a signing event').toBe(spanDigest(base));
428:      expect(planted.spanDigest, 'a comment inserted above the table must leave the digest
429:        + ' where it was — the line-address hazard is deliberately NOT re-planted here')
$ for f in …; do grep -c "worldPulse/$f.js" scripts/.writer-reach-baseline.json; done
factionDensityKernel 0 | roadsKernel 0 | successorNpc 0 | settlementLifecycleFirstClass 0
$ sed -n '36,49p' tests/lint/mutationCoverage.shared.mjs
export const ENFORCER_DIRS = ['tests/lint','tests/design','tests/docs','tests/data',
  'tests/copy','tests/security','tests/edgeFunctions','tests/generators'];
export const NAME_PATTERN =
  /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i;
```

⇒ **CONFIRMED**: no wiring-census re-take; no prose-numerics row; **zero** `path:line` citations of any of the five files; the tuning walker is digest-keyed and explicitly pins comment-insertion; no writer-reach rows exist for the four; and `tests/domain/irreversibleRawRoster.test.js` is outside `ENFORCER_DIRS` and matches no `NAME_PATTERN` token ⇒ **no mutation-coverage row owed**.

**The `tests/` sweep (preproof step 12) — the one that could have bitten:**

```sh
$ git grep -ln "factionDensityKernel\|advanceFactionDensity" HEAD -- tests
tests/domain/roadsParticipation.test.js      # names it only as a census STRING
tests/generators/densityLaw.test.js          # drives it
tests/lint/.tuning-inventory.json

$ grep -n "const snapOf" tests/generators/densityLaw.test.js
1412:  const snapOf = (...list) => ({ settlements: list.map(s => ({ id: s.id, settlement: s })) });
1571:  const snapOf = (...list) => ({ settlements: list.map(s => ({ id: s.id, settlement: s })) });
$ grep -c "snapOf(" tests/generators/densityLaw.test.js
13
```

⇒ ⭐ **CONFIRMED — NO FIXTURE REDS**: `snapOf` builds snapshot items **without a `save` key**, so `item.save?.settlement` is `undefined` and all **13** `advanceFactionDensity` drives fall through the `||` to `item.settlement` — byte-identical under the cure. ⚠ And the corollary, which is why the CREATE row insists on it: a `save`-less item exercises the FALLBACK, so the new suite must build items **with** `save` or it proves nothing.

**The lighting posture of the file the packet edits** (preproof step 14b): `tests/domain/roadsParticipation.test.js` imports its openers from `'vitest'` (`:13` — `import { describe, it, expect } from 'vitest';`, read verbatim), registers **3** literal `describe`s and **5** straight-line literal `it`s, contains no `.each`, no nested `describe`, no loop- or conditional-registration, and never binds `it`, `test` or `describe` a second time (`grep` for `(it)`, `const it`, `let it`, `function it`, `=> it`, ` it =` → no matches). ⇒ **CONFIRMED structurally credited**; ⚠ **PLAUSIBLE** that the walker's own `parkReasonsFor` prints `[]` for it — the function is a module-internal const in the walker and cannot be imported by a lane. **The pre-proof should execute it.** The packet's delta claims **zero** new titles in this file regardless, so the only figure at risk is the new file's `+5`.

---

## §10a · ⚠ A STALE ADDRESS IN EM-B1k's OWN §5, corrected here — CONFIRMED

EM-B1k's verified-tree contract cites `roadsKernel.js`'s merge as `const fullRoster` (`:395`-ish). At this tip:

```sh
$ grep -n "const fullRoster" src/domain/worldPulse/roadsKernel.js
425:  const fullRoster = (id) => {
$ grep -n "roads full roster differs" src/domain/worldPulse/roadsKernel.js
1094:    // Emit when the roads full roster differs from the update roster — either a whereabouts
1095:    // changed OR the update dropped an off-stage NPC roads must keep (this full-roster update
1096:    // is the last word, so a hostage is never lost even under a naive save merge).
```

⇒ **CONFIRMED**: the symbol lives at **`:425`**; the comment EM-B1k2 re-points is the three-line block at **`:1094-1096`**, and the sentence to correct is the parenthetical *"this full-roster update is the last word, so a hostage is never lost even under a naive save merge"* — true, and no longer the estate's only defence once EM-B1k's write base is raw. The `requiredSymbols` row names the SYMBOL (`const fullRoster`), never the line, so no address travels in the manifest. **Worth the chair's eye on EM-B1k's §5 row, which carries the `:395` hint.**

---

## §11 · The §7 table and the JSON manifest, proved set-equal

```sh
$ node -e "…parse EM-B1k2.manifest.json, extract the §7 table rows from EM-B1k2.md, compare as sets…"
JSON PARSES OK. id=EM-B1k2 status=DRAFT
PACKET_ACTIONS = ["CREATE","DOC","MODIFY","REGISTER","TEST"]
rows with an action outside PACKET_ACTIONS: 0
§7 TABLE rows  (6):            JSON rows (6):
   MODIFY src/domain/worldPulse/factionDensityKernel.js
   MODIFY src/domain/worldPulse/settlementLifecycleFirstClass.js
   MODIFY src/domain/worldPulse/successorNpc.js
   MODIFY src/domain/worldPulse/roadsKernel.js
   CREATE tests/domain/irreversibleRawRoster.test.js
   TEST   tests/domain/roadsParticipation.test.js
SET-EQUAL: YES
acceptanceCases: 8 | all {id,case}: true
checks arrays: 11 | requiredSymbols: 16 | retiredSymbols: 0
symbol in BOTH lists: 0
```

⇒ **CONFIRMED**. `PACKET_ACTIONS` is read from `scripts/implementation-packets.mjs:30`. Every measured NEGATIVE (mutation-coverage, edge-shared, prose-numerics, wiring-census, writer-reach, the line-citations) lives in **§7.1's ledger**, never as a table row — TOOL-1's arm reads a table-only path as drift.

---

## §12 · Closing state

```sh
$ git -C $SP/read-tip-32602dc60 rev-parse HEAD
32602dc607b7423838249cf57d73baf08feb047d
$ git -C $SP/read-tip-32602dc60 status --short
(empty)
```

Nothing was edited, staged or committed on any tree. Every file this lane wrote is under `$SP/lane-em-compile-EM-B1k2-scratch/`. No gate, no vitest, no eslint CLI, no npm script, no estate check script was run.

---
---

# PRE-PROOF APPENDIX — re-measured at `63e40fe57`, 2026-09-20 ~03:1x–03:3x EDT

*An Opus PRE-PROOF lane (read-only). Sections §13 onward are NEW; nothing above is rewritten.
Tree: `$SP/read-tip-63e40fe57`, detached at `63e40fe5708c1459fe303442c38e66fa8e9b388b`,
`git status --short` EMPTY at start and end. Every claim carries its command.*

## §13 · The tip, the window, the preamble — CONFIRMED

```sh
$ git -C $SP/read-tip-63e40fe57 rev-parse HEAD
63e40fe5708c1459fe303442c38e66fa8e9b388b
$ git -C $SP/read-tip-63e40fe57 status --short
(empty)
$ date
Sun Sep 20 03:10:47 EDT 2026
```

**THE J-T1 WINDOW — `32602dc60` (the compile base) → `63e40fe57`, over every change-manifest and
requiredSymbols path:**

```sh
$ git diff --stat 32602dc60 63e40fe57 -- <all 14 paths>
 src/domain/worldPulse/pulseKernel.js    |   4 +-
 tests/domain/roadsParticipation.test.js | 118 ++++++++++++++++++++++++++++++++
 2 files changed, 120 insertions(+), 2 deletions(-)

$ git log --oneline 32602dc60..63e40fe57
63e40fe57 PACKETS: EM-B1k LANDED at 19c4cb853 (version 2) …
19c4cb853 EM-B1k: the tick's settlement is born from the raw save roster …
07cc2efb6 PACKETS: EM-B1k's §7 change table made set-equal with its JSON manifest …
1e5bcf83d REGISTER: the lighting census re-derived at train EM-T3's terminal …
1b381485f PACKETS: EM-B1k placed and READY at c740ded8b (version 2) …
c740ded8b DOC: the chair's owed corrections on the branch …
```

⇒ **CONFIRMED: not one of this packet's four production files moved in the window.** The only
code motion is EM-B1k's two lines; the only test motion is EM-B1k's +118 in the file this packet
also edits (the declared collision).

**THE CREATE TARGET IS ABSENT (both spellings):**

```sh
$ ls tests/domain/irreversibleRawRoster.test.js          → No such file or directory
$ ls tests/domain/irreversibleRawRoster.contract.test.js → No such file or directory
```

**THE PREAMBLE, RE-STAMPED:**

```sh
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1  docs/implementation/preambles/EM-PREAMBLE.md
```

⇒ identical to the packet's recorded hash. CONFIRMED.

## §14 · EM-B1k's two seam lines are REAL — quoted

```sh
$ grep -n "save?.settlement\|save\.settlement" src/domain/worldPulse/pulseKernel.js
184:      settlement: localSettlements.get(String(item.id)) || item.save?.settlement || item.settlement,
579:    localSettlements.set(String(item.id), item.save?.settlement?.npcs && item.save.settlement.npcs !== /** @type {{npcs?: unknown}} */ (vaulted.settlement)?.npcs ? { ...vaulted.settlement, npcs: item.save.settlement.npcs } : vaulted.settlement);
2924:          settlement: clone(birth.save.settlement),
```

```sh
$ node -e "…PACKET_MANIFEST…"   # EM-B1k's entry
EM-B1k status: LANDED | verifiedBase c740ded8b… | landedAt 19c4cb85393e73404caa3bac1fe7800a48bfd39e
paths: MODIFY src/domain/worldPulse/pulseKernel.js | CREATE tests/store/participationWriteBase.test.js | TEST tests/domain/roadsParticipation.test.js
```

⇒ **CONFIRMED**: the dependency is discharged. `buildSettlementMap`'s write base is raw; the
`localSettlements` seed is raw in the identity-preserving form. ⚠ `:579` is **CURE-F's line** and a
cure lane is rewriting its comparand right now — see §20.

## §15 · ⭐ THE CORE MEASUREMENT, RE-RUN AT THE REAL TIP — the compile's §3 reproduces EXACTLY

`$S/tickstart-reprobe.mjs`: the filtered view built with `worldSnapshot.js`'s own expression
(`{ ..._s, npcs: _npcs.filter(n => !isOffStage(n)) }`), the law driven exactly as
`factionDensityKernel.js:704` drives it, EM-B1k's raw base now REAL rather than modelled.

```sh
$ node $S/tickstart-reprobe.mjs 75 7
stride 75 | towns with a shelved sole member of a NON-governing house: 7
dissolution reaction PRODUCED from the FILTERED tickStart : 7 / 7
dissolution reaction PRODUCED from the RAW      tickStart : 0 / 7
OTHER houses' reactions (the non-vacuity control), filtered / raw : 6 / 6
  Schwarzwalde           house=Merchant Guilds      member=Liutgar Bauer          filtered=faction_dissolved raw=none
  Katotopia              house=Merchant Guilds      member=Hieronymos Alexios     filtered=faction_dissolved raw=none
  Chinggisnuur           house=Merchant Guilds      member=Vangchug Tayichi'ud    filtered=faction_dissolved raw=none
  Suryaganj              house=Religious Authorities member=The High Priestess     filtered=faction_dissolved raw=none
  Hongcheng              house=Merchant Guilds      member=Nuan Xie               filtered=faction_dissolved raw=none
  Goraburg               house=Merchant Guilds      member=Elica Golubev          filtered=faction_dissolved raw=none
  Stormtun               house=Arcane Orders        member=Ingvar Snorrason       filtered=faction_dissolved raw=none
```

⇒ **CONFIRMED at the promotion tip**: 7 / 7 and 0 / 7, the same seven towns and the same 6-beat
non-vacuity control the compile measured in memory. The packet's central premise is executed fact
at `63e40fe57`, not a model.

## §16 · ⭐ Q4 — THE FULL-CORPUS DISPLAY-NAME CENSUS (525 rows, one command)

`$S/name-census.mjs` — every golden-corpus row generated through the estate's own pipeline
(`generateSettlementPipeline`), the collision key being the EXACT key `replaceOustedNpcs` joins on
(`String(npc.name).toLowerCase()`, `successorNpc.js:65`, `:70`).

```sh
$ node $S/name-census.mjs
ROWS 525 | ROWS WITH A ROSTER 525 | NPCS 5171
SETTLEMENTS WITH A DUPLICATE DISPLAY NAME: 0
```

⇒ **CONFIRMED: ZERO duplicate display names within any settlement, across all 525 corpus rows and
5,171 rostered NPCs.** Under the chair's Q4 ruling (§934.60 addendum 2 / §934.47 addendum 39) this
CLOSES the name-join question with the figure recorded, and **EM-B1k3 is not chartered**. The
uniqueness assertion is folded into the acceptance matrix (see the packet's A6 and its note about
the chair's wording).

## §17 · ⭐ Q5 — EVERY SAVE WRITER READ; can a save without `.settlement` be written today?

**The writers, quoted.**

```sh
$ grep -n "settlement:" src/lib/saves.js | head
266:  return { ...entry, settlement: _normalize(entry.settlement) };     # migrateSettlementShape (read adapter)
280:    settlement: usable ? row.data : null,                            # saveEntryFromSupabaseRow — INACTIVE ⇒ null
380:    settlement: null,                                                # supabaseListMeta — the meta projection
459:        creates: [{ ...v2, id: saveId, settlement: link.settlement }],
460:        updates: [{ id: link.partner.id, settlement: link.partner.settlement }],
725:    settlement: null,                                                # localListMeta — the meta projection
757:        ? { ...s, settlement: link.partner.settlement }
759:      next.unshift({ ...v2, settlement: link.settlement, id, savedAt: Date.now() });
```

```sh
$ sed -n '765p' src/lib/saves.js     # the plain local write
  saves.unshift({ ...v2, settlement, id, savedAt: Date.now() });
$ sed -n '470p' src/lib/saves.js     # the cloud write
    data:            settlement,
```

**(a) THE PERSIST PATHS ALWAYS SET IT.** Both writers (`supabaseSave` → `row.data`;
`localSaveEntry` → `{...v2, settlement}`) always carry the key, and `migrateSaveToV2`
(`saves.js:190-219`) adds only `seed` and `campaignState` — it has **no** v1→v2 settlement lift, so
nothing in the tree ever mints the legacy "the save IS the settlement" envelope.

**(b) BUT AN ENTRY WITH A FALSY `.settlement` REACHES THE TICK.** Three read projections mint one —
`saves.js:280` (an INACTIVE save), `:380` and `:725` (the two meta projections) — and the pulse's
member list is **unfiltered by access state**:

```sh
$ sed -n '167,178p' src/store/campaignSliceShared.js
export function campaignSettlements(state, campaignId) { … 
  const ids = new Set((c.settlementIds || []).map(String));
  return (state.savedSettlements || []).filter(save => ids.has(String(save.id)));
}
$ grep -rn "isSaveActive" src/store/        → (no hits)
```

**(c) AND ON THAT SHAPE THE FALLBACK CANNOT DIVERGE.** `saveSettlement(save) = save?.settlement || save`
(`worldSnapshot.js:11-13`) returns the ENVELOPE, which carries no `npcs`
(`grep -rn "save\.npcs\|save?.npcs" src/` → **zero hits**), so `worldSnapshot.js:127` takes the
`else` branch and `settlement = _s` **by reference** (`:132`). Raw and filtered are then the SAME
object: EM-B1k's `:184` and this packet's `:699` both fall back to the identical value.

⇒ **CONFIRMED, and Q5 CLOSES with the measurement**: no writer can produce a save whose
`.settlement` is absent *while a roster hides behind the envelope*; the falsy-`.settlement` shapes
that do exist carry no roster at all, so the `||` fallback is the snapshot's own tolerance and not a
filtering hazard. **No raw-fallback token is owed and no fourth production file is needed.**
⚠ The unfiltered member list is a separate (non-blocking) observation — §20 item 4.

## §18 · ⭐ THE RATCHET'S FOURTH ROOT — what it actually convicts (the chair's premise REFUTED)

```sh
$ cd <tip>; grep -rl '\.npcs' src/domain/worldPulse src/domain/spatial | grep -v '\.test\.' | wc -l
41
$ grep -rl '\.npcs' … src/domain/density | wc -l
42        # + src/domain/density/factionLifecycle.js
$ grep -rl '\.npcs' … src/domain/density src/generators/density | wc -l
43        # + src/generators/density/applyDensityLaw.js
$ grep -rl -e '\.npcs' -e 'factionRosterOf' … (four roots) | wc -l
44        # + src/generators/density/titularSuccession.js
$ comm -13 <today's 41> <the 44>
src/domain/density/factionLifecycle.js
src/generators/density/applyDensityLaw.js
src/generators/density/titularSuccession.js
```

Both engines, same figures: `/usr/bin/grep` (BSD grep 2.6.0-FreeBSD, which is what
`execFileSync('grep', …)` resolves to here) → 41 / 43 / 44, and the shell's ugrep → identical.

⛔ **THE CHAIR'S BRIEF SAYS the fourth root gives `titularSuccession.js` its disposition row. IT
DOES NOT.** That file reads the roster ONLY through `factionRosterOf` — the literal `.npcs` never
appears in it:

```sh
$ grep -n 'npcs\|factionRosterOf' src/generators/density/titularSuccession.js
74:import { factionRosterOf } from '../../domain/density/factionLifecycle.js';
167: * @param {{npcs?: Array<Record<string, unknown>>}|null|undefined} settlement
177:  return factionRosterOf(settlement, faction)
203: *   npcs?: Array<Record<string, unknown>>,
231:    const roster = factionRosterOf(settlement, faction);
```

The file the fourth root DOES convict is `applyDensityLaw.js`:

```sh
$ grep -n '\.npcs' src/generators/density/applyDensityLaw.js
319:  const npcs = input.npcs || [];        # inside `export function disperseNamedRoster(input)` (:317)
$ grep -rn "disperseNamedRoster" src/
src/generators/narrativeGenerator.js:33:import { disperseNamedRoster } from './density/applyDensityLaw.js';
src/generators/narrativeGenerator.js:995:    ? disperseNamedRoster({
```

⇒ **CONFIRMED.** `disperseNamedRoster` runs at GENERATION time (the coherence seam,
`narrativeGenerator.js:995`), where no snapshot and therefore no participation view exists — a clean,
true disposition. And `titularSuccession.js` has **no `src/` importer** (its only mentions are a
comment in `successionGrammar.js:4` and `tests/generators/densityLaw.test.js:96`) — it is dark, as
the chair said, but the `\.npcs` predicate cannot see it.

⛔ **A row in `EXPECTED` for a file the scan does not return REDS the exactness arm**
(`roadsParticipation.test.js:430`: `expect(foundReaders()).toEqual([...EXPECTED, ...UNDISPOSITIONED].sort())`).
So the chair's instruction is deliverable in exactly one of two ways, both priced in the packet's
§13 Q1.

## §19 · ⭐ THE `contract` RENAME IS PRICED — and it drags in a REAL PLANT

```sh
$ node -e "import('./tests/lint/mutationCoverage.shared.mjs').then(m=>{…})"
ENFORCER_DIRS ["tests/lint","tests/design","tests/docs","tests/data","tests/copy","tests/security","tests/edgeFunctions","tests/generators"]
NAME_PATTERN /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i
irreversibleRawRoster.test.js          -> false
irreversibleRawRoster.contract.test.js -> true
$ node -e "…enumerateInvariants(cwd)…"
enumerated invariant files: 706        # tests/domain 44 · tests/store 14
```

So the rename opts the CREATE file into the enumeration, and a newly enumerated file with no
manifest row REDS `tests/lint/mutationCoverageManifest.test.js`. The register's own shape:

```sh
$ node -e "…scripts/mutation-coverage-manifest.json…"
top keys: _doc, uncoveredBaseline, rationales, invariants, meta
uncoveredBaseline: 186
invariant entries: 706   KIND DISTRIBUTION {"rationale":430,"mutation":90,"uncovered":186}
```

⛔ `uncovered` is not available (it would be the first RAISE of `uncoveredBaseline` in the
register's life — §934.47 addendum 43); `rationale` would be false (the suite is not a scanner).
⇒ the row is **`mutation`**, and a `mutation` row is joined one-to-one to a REAL plant:

```sh
$ grep -n "mutation'" tests/lint/mutationCoverageManifest.test.js
120:      if (entry.kind === 'mutation' && !entry.label) problems.push(`${key}: mutation entry with no label`);
130:  test('LABEL JOIN: manifest mutation claims and sweep labels match one-to-one', …)
$ grep -c "check_caught" scripts/mutation-sweep.sh
135
$ node -e "…MUTATED_FILES…"
MUTATED_FILES entries: 84
  src/domain/worldPulse/factionDensityKernel.js -> false
  scripts/mutation-coverage-manifest.json       -> true
```

⇒ **CONFIRMED PRICE:** the rename costs TWO registration files —
`scripts/mutation-coverage-manifest.json` (the row) **and** `scripts/mutation-sweep.sh` (the
`perl -0pi -e` plant + `check_caught` line + `factionDensityKernel.js` joining `MUTATED_FILES`).
The plant's idiom, from the newest three in the file (`scripts/mutation-sweep.sh:1559-1585`), is a
one-line `perl -0pi -e` followed by
`check_caught "<label>" <file> "<npx vitest run … --no-file-parallelism>" "<the EXACT it title expected to fail>"`.
The convicting mutant is §6.1's replacement reverted — which is A1's own red, so the build lane
proves it once and records it twice.

⛔ **AND IT COLLIDES.** `scripts/mutation-coverage-manifest.json` is reserved by the one
non-terminal packet in the manifest:

```sh
$ node -e "…non-terminal packets…"
--- EM-B3c READY verifiedBase 63de6da75…
    CREATE tests/security/galleryScannerMirrorTotality.test.js
    CREATE supabase/migrations/203_gallery_scanner_client_mirror_totality.sql
    MODIFY scripts/ops/migrationRehearsalCore.mjs
    TEST   tests/ops/migrationRehearsal.test.js
    REGISTER scripts/mutation-coverage-manifest.json      ⛔
    DOC docs/DEPLOY.md · ARCHITECTURE.md · docs/CURRENT_STATE.md
$ sed -n '676,700p' scripts/implementation-packets.mjs
    const reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(String(status));
      … addError(errors, `duplicate change path across packets: ${row.path} (…)`)
$ grep -n "TERMINAL_PACKET_STATUSES = " scripts/implementation-packets.mjs
43:const TERMINAL_PACKET_STATUSES = new Set(['LANDED', 'SUPERSEDED']);
```

⇒ **CONFIRMED: a SECOND placement gate.** EM-B1k2 carrying that row may not be placed while EM-B3c
is non-terminal — exactly the EM-B1k shape, one file over.
`scripts/mutation-sweep.sh` is reserved by nobody (zero manifest rows name it).

## §20 · The remaining registers, budgets and symbols — re-measured at the tip

**Effective lines (eslint's own `Linter`, `max-lines` `skipBlankLines: true, skipComments: true`):**

```sh
   395 src/domain/worldPulse/factionDensityKernel.js
   462 src/domain/worldPulse/settlementLifecycleFirstClass.js
    50 src/domain/worldPulse/successorNpc.js
   838 src/domain/worldPulse/roadsKernel.js
  1581 src/domain/worldPulse/pulseKernel.js        (EM-B1k held it, as its receipt says)
   218 tests/domain/roadsParticipation.test.js
```

⇒ 395 / 462 / 50 / 838 CONFIRMED unchanged. `scripts/.size-baseline.json:14` still reads
`"src/domain/worldPulse/roadsKernel.js": 838` — tolerance-zero both directions.

**All sixteen `requiredSymbols` resolve EXACTLY ONCE** (`grep -cF` = 1 on every row; run in one
command, output in the lane's report). Two candidate NEW rows also resolve:
`export function disperseNamedRoster` in `applyDensityLaw.js` → 1.

**Budgets, re-read at the tip:**

```sh
tests/build/generationWorkerLazy.test.js:159: export const WORKER_BUNDLE_CEILING_BYTES = 1401208;
tests/build/vendorPdfLazy.test.js:565:        const CLOSURE_BUDGET_BYTES = 1_048_000;      (:539 last measured 1,047,205)
tests/build/vendorPdfLazy.test.js:787:        expect(size).toBeLessThan(679_000);          (:776 last measured 678,131)
```

⭐ **THE EAGER CLOSURE, RE-DERIVED THROUGH VITE'S OWN EXPORT** (not a replica — the config's own
comment forbids replicas):

```sh
$ node -e "import('./vite.config.js').then(m=>{const a=[...m.EAGER_FIRST_PAINT_MODULES];…})"
eager modules: 268
  successorNpc.js                -> true
  factionDensityKernel.js        -> false
  roadsKernel.js                 -> false
  settlementLifecycleFirstClass.js -> false
  factionLifecycle.js            -> true      ⭐ (not edited by this packet; the chair's preamble amendment carries it)
  applyDensityLaw.js             -> false
  pulseKernel.js                 -> false
```

⇒ **268**, which is the manifest `_note`'s figure; the evidence §8 line "modules: 251" was a lane
replica walk and is **retired** by this measurement.

**Edge-shared:** 0 hits for all five paths across the five metas' own `inputs`
(114 / 74 / 115 / 2 / 2) — no rebuild, no `_shared` row, **no generator in `checks`**.

**Line-addressed / stamped / cited registers:**

```sh
prose-numerics baseline   : 0 hits, all five paths
wiring-census stamp.files : 7 entries, ALL under src/domain/display/stateProse/ — none of ours
tuning-inventory rows     : factionDensityKernel 2 · settlementLifecycleFirstClass 7 · successorNpc 0 · roadsKernel 19
  and the two pins that make a comment free are verbatim at the SAME lines the compile cited:
  tuningRegister.walker.test.js:212 'a comment must not move a digest…'   :428 'a comment inserted above the table…'
writer-reach baseline     : 0 hits, all five paths
path:line citations       : 0 hits for all SIX paths across src, docs/content, tests
```

**The lighting census is UNAFFECTED by the rename**: `parkReasonsFor` is
`classify(src).reasons` (`sovereigntyLightingContract.walker.test.js:1670`) — it reads SOURCE TEXT,
never a path — and `measureCensus` (`:602-603`) sums titles over credited files. The delta stands at
`+1 files / +0 parked / +1 credited / +5 titles / +1 suiteTitles` provided the new file is written
to §7's shape. No fixture in `tests/fixtures/` holds `"stasis"` or `"whereabouts"` (zero files), so
the golden posture holds.

**`priced.settlementUpdates`' producer, traced (the chair's twenty-minute SLOT):**
`applyWorldPulse.js:607-609` re-sets entries from `applyWarPeaceRefusal(…)` (`warPeaceRefusal.js:103`),
whose updates come from `applyLegitimacyHits` (`momentum.js`), which MAPS the incoming array and
writes `next[ui] = { ...entry, settlement: {…} }` — it can never mint an entry without `.settlement`,
and every other entry passes through by reference. ⇒ **CONFIRMED: through the priced path an entry
without `.settlement` is not producible today**; A4 still pins the fallback, because nothing in the
tree *asserts* it (and the loop's own guard means a snapshot item with no settlement `continue`s at
`:700` before the fallback can be reached).

**Two further already-raw maps the compile did not name:** `applyWorldPulse.js:1209`
(`applyWorldPulseProposal`) and `:1308` (`mintRealmVerbProposal`) both build
`{ saveId, save, settlement: save.settlement || save }` — raw by construction, untouched.

## §21 · Closing state

```sh
$ git -C $SP/read-tip-63e40fe57 rev-parse HEAD
63e40fe5708c1459fe303442c38e66fa8e9b388b
$ git -C $SP/read-tip-63e40fe57 status --short
(empty)
```

Nothing was edited, staged or committed on any tree. Every file this lane wrote is under
`$SP/lane-preproof-EM-B1k2-scratch/`. No gate, no vitest, no eslint CLI, no npm script and no
estate check script was run; the two probes are plain `node` reads of the tree's own modules.
