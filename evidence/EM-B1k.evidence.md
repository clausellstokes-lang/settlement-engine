# EM-B1k — evidence (Opus COMPILE lane, 2026-09-19)

Tree: `$SP/read-tip-e5bdfd031`, `rev-parse HEAD` → `e5bdfd03176b402e777f2681187b49db47ab43c5`,
`git status --short` **empty at the start and at the end**. Nothing edited, staged or committed on
any tree; plain `node` only. Preamble hash: `1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6`.

---

## §1 · The seam, exactly

```sh
$ sed -n '178,188p' src/domain/worldPulse/pulseKernel.js
function buildSettlementMap(snapshot, localSettlements) {
  const map = new Map();
  for (const item of snapshot.settlements) {
    map.set(String(item.id), {
      saveId: String(item.id),
      save: item.save,
      settlement: localSettlements.get(String(item.id)) || item.settlement,   ← ⛔ THE WRITE BASE
    });
  }
  return map;
}
$ grep -n "buildSettlementMap" src/domain/worldPulse/pulseKernel.js
178: (definition)    1506:  const settlementMap = buildSettlementMap(postTimeSnapshot, localSettlements);
$ sed -n '579p' src/domain/worldPulse/pulseKernel.js
    localSettlements.set(String(item.id), vaulted.settlement);   // descends from item.settlement
$ sed -n '127,129p' src/domain/worldPulse/worldSnapshot.js
    if (Array.isArray(_npcs) && _npcs.some((n) => isOffStage(n))) {
      settlement = participationViewCache.get(_s) || { ..._s, npcs: _npcs.filter((n) => !isOffStage(n)) };
$ sed -n '139,146p' src/domain/worldPulse/worldSnapshot.js
    return { id, save, name, settlement, activeConditions, causal, system };   ⭐ `save` IS ON THE ITEM
$ sed -n '197p;232p;243p' src/store/campaignPulseHelpers.js
    let nextSettlement = update.settlement || save.settlement;
    state.savedSettlements[saveIdx] = nextSave;
        settlement: cloneJson(nextSettlement),
```
⇒ the update is **born filtered** and `:197` lands it in the store and the DB payload with **no
re-merge anywhere on the path** (searched: `campaignPulseHelpers.js` has exactly one settlement
assignment; `persistSaveUpdate` passes it through). The raw roster is already on the item as
`save`, so cure (1) needs no new field.

---

## §2 · ⭐⭐ THE MEASUREMENT THAT SHAPES THE PACKET — cure (1) ALONE cures BOTH defects

`cure-simulation.mjs` leaves the snapshot **filtered** (participation reads untouched) and changes
only the UPDATE's settlement to the raw save settlement. `factionDensityKernel` is **unpatched**.

```sh
$ node $W/cure-simulation.mjs
view roster is 1 of 2 in every shelved row below (the snapshot is UNCHANGED)

ACTIVE sole Weaver (control)              | write base: filtered | houses: ["The Crown","The Weavers"] | roster: 2 | beats: []
SHELVED sole Weaver — TODAY               | write base: filtered | houses: ["The Crown"]               | roster: 1 | beats: ["faction_dissolved"]
SHELVED sole Weaver — AFTER CURE (1) ONLY | write base: raw      | houses: ["The Crown","The Weavers"] | roster: 2 | beats: []
HOSTAGE sole Weaver — AFTER CURE (1) ONLY | write base: raw      | houses: ["The Crown","The Weavers"] | roster: 2 | beats: []
```

⇒ ⭐ **The house survives, the roster is whole, and no `faction_dissolved` beat fires — with no
edit to any consumer.** The reason is in the tree's own words at `factionDensityKernel.js:258-262`:
> ⭐ THE CONFIRMATION. The law read the tick's opening picture; between then and now another mover
> may have seated somebody. **An irreversible consequence may only fire on a fact that is still
> true at the moment it is applied.**
> `const stillEmpty = factionRosterOf(fresh, faction).length === 0;`

**The guard was correct all along. It failed only because `fresh` was filtered too.** Give it a raw
base and it refuses the irreversible act by itself.

---

## §3 · ⭐ THE MERGE RULE ALREADY EXISTS IN THE TREE — `fullRoster`

```sh
$ sed -n '/const fullRoster/,/};/p' src/domain/worldPulse/roadsKernel.js
  const fullRoster = (id) => {
    const saveNpcs = saveNpcsOf(id);
    const updNpcs = Array.isArray(asObject(freshSettlement(id)).npcs) ? … : [];
    if (!saveNpcs.length) return updNpcs;            // no save roster ⇒ the update's is all we have
    const updByKey = new Map();
    updNpcs.forEach((n, i) => updByKey.set(npcId(id, n, i), asObject(n)));
    return saveNpcs.map((n, i) => updByKey.get(npcId(id, n, i)) || asObject(n));
  };
$ sed -n '1094,1096p' src/domain/worldPulse/roadsKernel.js
    // Emit when the roads full roster differs from the update roster — either a whereabouts
    // changed OR the update dropped an off-stage NPC roads must keep (this full-roster update
    // is the last word, so a hostage is never lost even under a naive save merge).
$ grep -n "export function npcId" -A 2 src/domain/worldPulse/npcAgency.js
194:export function npcId(saveId, npc, index) {
195:  return `${saveId}:${npc?.id || stablePart(npc?.name || npc?.label || `npc_${index}`)}`;
```
⇒ **iterate the RAW roster; take the tick's version of each person when the tick has one, else the
raw one.** That is the chair's requirement — *"merged onto the raw roster by id so that nothing a
mover did is lost and nothing the filter hid is dropped"* — already written, in production, and
**the roads lane wrote it because it had already been bitten by this exact defect.**

⚠ **Its key is id-first with a positional FALLBACK** (`npc_${index}` when a record has no `id`,
`name` or `label`). Over two arrays of different length the fallback can mis-pair. Every generated
NPC carries `id` and `name` (measured: `createNpc` always sets both), so the fallback is unreached
on real data — but the packet pins it (A4) rather than assuming it.

**Why the roads compensation does NOT already cure the estate:** it is lane-local and doubly gated.
```sh
$ sed -n '342,349p' src/domain/worldPulse/roadsKernel.js
  if (!roadsActive(worldState)) { return { … changed: false … }; }
  const digest = activeSpatialDigest(worldState);
  if (!digest) { return { … changed: false … }; }
$ node -e "…ensureWorldState + roadsActive…"
input rules {}                    -> normalized roadsEnabled: undefined | roadsActive: false
input rules {"roadsEnabled":true} -> normalized roadsEnabled: true      | roadsActive: true
```
⇒ a realm with roads dark, **or lit but with no spatial digest** (a single-settlement campaign, or
any realm before its graph is built), has no protection at all. Confirmed by execution: the DM
reproduction loses the person **with `roadsEnabled: true` as well as with it absent**
(`f2-roads-lit-repro.mjs`, same 6-of-7 result).

---

## §4 · The per-writer table — every mover that writes `npcs`

```sh
$ git grep -nE "npcs:\s*[^,}]" HEAD -- src/domain/worldPulse src/domain/density src/generators/density
```
| # | writer | what it writes | merge rule under cure (1) | positional-index hits |
|---|---|---|---|---|
| 1 | `applyWorldPulseBetrayal.js:51` | `{ ...entry.settlement, npcs: nextNpcs }` — a betrayal mark | maps the update roster ⇒ **maps the RAW roster; marks land on everyone present** | 1 |
| 2 | `factionDensityKernel.js:602` | `npcs: [...npcs, founder]` — an **ARRIVAL** | append; the raw base keeps every prior member | 0 |
| 3 | `factionDensityKernel.js:647` | `npcs: nextNpcs` — a move | map over the raw base | 0 |
| 4 | `magicFormsPractitioner.js:250` | `{ ...record, npcs: [...npcs, minted] }` — an **ARRIVAL** | append | 0 |
| 5 | `npcAgency.js:235` | `{ ...settlement, npcs: nextNpcs }` — corruption/ousting marks | map over the raw base | 1 |
| 6 | `npcGrowthKernel.js:597` | `{ ...s, npcs: nextNpcs }` — acquired traits | map over the raw base | 1 |
| 7 | `npcVerdictPulse.js:142` | `npcs: replaced.npcs` — a verdict | replace; raw base | 0 |
| 8 | `roadsKernel.js:1102` | `{ ...freshSettlement(sid), npcs: nextNpcs }` — whereabouts, built from `fullRoster` | **already raw-merged; becomes redundant** | 0 |
| — | `worldSnapshot.js:129` | the FILTER — a read projection, not a mover | unchanged | — |
| — | `lineageMemberBirth.js:236` (`npcs: []`, a NEW settlement) · `applyDensityLaw.js:331` (generation) | out of scope | — | — |

⚠ **THE PACKET'S ONE REAL RISK, stated plainly:** three writers (1, 5, 6) map the update roster
**positionally as well as by value**, so under a raw base they iterate MORE people than today —
every mark they compute for an off-stage person is new behaviour. All three compute marks from
`worldState` state keyed by `npcId`, not from position, so the expected effect is "an off-stage
person's mark is now also refreshed" rather than a miscomputation — **PLAUSIBLE, and A5 is the arm
that must prove it.** This is the packet's chief acceptance burden.

---

## §5 · The irreversible consumers, and the two unreachable writers

```sh
$ sed -n '699p;704p;262p' src/domain/worldPulse/factionDensityKernel.js
    const tickStart = item && item.settlement ? asObject(item.settlement) : null;   ← FILTERED (the READING)
    const reading = readFactionLifecycle(… tickStart …, { tick });
    const stillEmpty = factionRosterOf(fresh, faction).length === 0;                ← the CONFIRMATION
$ sed -n '611,615p' src/domain/worldPulse/settlementLifecycleFirstClass.js
    const npcs = (Array.isArray(settlement.npcs) ? settlement.npcs : [])
      .map((npc) => (npc && !npc.dispersed ? { ...npc, dispersed: true, dispersedAtTick: tick, dispersalNote } : npc));
$ sed -n '64,66p' src/domain/worldPulse/successorNpc.js
export function replaceOustedNpcs(settlement, oustedNames, rng) {
  … if (!names.size || !Array.isArray(settlement?.npcs)) return settlement;
$ grep -rl "\.npcs" src/domain/density
src/domain/density/factionLifecycle.js
$ grep -rl "\.npcs" src/domain/worldPulse src/domain/spatial | wc -l
      41
$ sed -n '308p' tests/domain/roadsParticipation.test.js
    const out = execFileSync('grep', ['-rl', '\\.npcs', 'src/domain/worldPulse', 'src/domain/spatial'], …)
```
⇒ **the widened root convicts EXACTLY ONE new file: `src/domain/density/factionLifecycle.js`**
(41 under the two current roots). One disposition row, not a sweep.

---

## §6 · Bundle membership of every candidate file — measured with the build's own graph

```sh
$ node $W/…closure + vite.config EAGER_FIRST_PAINT_MODULES…
file                                                 genWkr advWkr tscWkr EAGER
src/domain/worldPulse/pulseKernel.js                 false  true   false  false
src/store/campaignPulseHelpers.js                    false  false  false  false
src/domain/worldPulse/factionDensityKernel.js        false  true   false  false
src/domain/worldPulse/worldSnapshot.js               false  true   false  false
src/domain/worldPulse/settlementLifecycleFirstClass.js false true  false  false
src/domain/worldPulse/successorNpc.js                false  true   false  ⭐ true
src/domain/worldPulse/roadsKernel.js                 false  true   false  false
```
⇒ **NOTHING touches the zero-slack generation worker (0 B).** `pulseKernel.js` is in
`advanceInterval.worker` — **no ceiling exists today; TOOL-3 is minting one with 4 KB of per-train
headroom, so this packet prices a DELTA and owes no re-mint (the chair's Q3 ruling).**
⚠ `successorNpc.js` is **EAGER (first paint)** — a reason to keep it out of THIS packet.

**Edge-shared INPUT membership** (`EM-PREAMBLE.md` §P2 row 10 — membership, never entry-hood):
```sh
$ node -e "…the two metas' inputs…"
   worldPulse/pulseKernel.js                       charter: false | outputSchema: false
   store/campaignPulseHelpers.js                   charter: false | outputSchema: false
   worldPulse/factionDensityKernel.js              charter: false | outputSchema: false
   worldPulse/worldSnapshot.js                     charter: TRUE  | outputSchema: TRUE
   worldPulse/settlementLifecycleFirstClass.js     charter: false | outputSchema: false
   worldPulse/successorNpc.js                      charter: false | outputSchema: false
   worldPulse/roadsKernel.js                       charter: false | outputSchema: false
```
⇒ ⭐ **`pulseKernel.js` is an input of NEITHER bundle, so THIS packet owes no edge-shared
rebuild and no `_shared` rows at all.** Only `worldSnapshot.js` would, and this packet does not
touch it — another reason the split falls where it does.

**Registers naming the candidate files:**
```sh
pulseKernel        → .domain-any-baseline · .tuning-inventory · .domain-strict-baseline
                     .full-typecheck-baseline · .observed-shape-readers-baseline · .size-baseline
campaignPulseHelpers → .observed-shape-readers-baseline
```
⚠ `scripts/.size-baseline.json` carries `pulseKernel.js` — a **line ceiling**, so the edit must be
measured against it (§3.1 of the packet). `.tuning-inventory.json` is line-addressed but the
walker keys on `spanDigest` (proved for EM-B1f: *"the line-address hazard is deliberately NOT
re-planted here"*). `docs/content/wiring-census.json` `stamp.files` (7 entries) names **none** of
the candidates ⇒ no re-take owed.

---

## §7 · Golden neutrality — EXECUTED

```sh
$ git grep -rln "stasis" -- tests/fixtures        → (nothing)
$ git grep -rln "whereabouts" -- tests/fixtures   → (nothing)
$ node -e "…preset-lighting-witness-golden.json…" bytes 8560 | "stasis": false | "hostage": false | "jailed": false | "exiled": false
$ node $W/…corpus-purity…                         35 settlements, 340 NPCs, .stasis: 0, .whereabouts: 0
```
⇒ **no golden scenario contains a shelved or hostage NPC, and generation never writes either
key.** The cure changes only worlds where the bug fires. The goldens, the dormancy goldens and the
preset witness **cannot move** — and the packet runs all of them so the claim is executed, not
asserted.

---

## §8 · The population at risk, and the reproduction the arms encode

```sh
$ node $W/population-at-risk.mjs 1
settlements generated: 525 | factions total: 3378 | with EXACTLY ONE rostered member: 1608 (47.6%)
of those, GOVERNING: 147 | settlements holding at least one such faction: 525 (100.0%)
```
```sh
$ node --experimental-loader …stub… $W/f2-dm-repro.mjs        ← TODAY'S RED, quoted in A1
DM ACTION  applyNpcOp stasis-npc -> {"ok":true,"status":"applied","reason":null}
  roster ON THE SAVE   : 7 (the shelf does not remove anybody)
AFTER ONE TICK (commit: true), the roster THE SAVE WOULD HOLD
  store  state.savedSettlements[0].settlement.npcs : 6 of 7
  DB     persistUpdates[0].settlement.npcs         : 6 of 7
  ⛔ MISSING FROM THE PERSISTED ROSTER: Dorothea Eindriðason
UN-SHELVE AFTERWARDS  applyNpcOp return-npc -> {"ok":false,"status":"failed","reason":"npc_target_missing"}
```

**How the build lane reaches the real store commit under vitest, with no loader stub.** The plain
`node` run needed a stub because `src/lib/supabase.js` reads `import.meta.env`. **Vitest runs
through Vite, so `import.meta.env` is defined and the module loads unchanged.**
```sh
$ grep -n "test: {" -A 6 vite.config.js
894:  test: {
898:    environment: 'node',          ← the default; no DOM needed for store logic
903:    setupFiles: ['./tests/setup/fastCheckSeed.js'],
$ git grep -ln "applyWorldPulseResultToState" -- tests
tests/joins/crisisTripleSync.test.js · tests/store/wizardNewsCommitReconcile.test.js
```
⇒ the model is `tests/store/wizardNewsCommitReconcile.test.js` — a `tests/store/**` file importing
the store helper directly under the default `node` environment. **A1 lives there, with no stub.**

---

## §9 · What old saves hold — for the owner's question

```sh
$ node --experimental-loader …stub… $W/old-saves-hold.mjs
ERASED PERSON: Dorothea Eindriðason / npc_1
persisted roster length: 6
  npcs[] by id                : false        ⛔ the record itself is GONE
  anywhere in the settlement  : true
  keys that still name them   : relationships, factions, pressureSentence
  factions[].members[]        : [0,0,0,0,0,0]
  relationships entries       : 12    | relationships name them: true
  populationHistory present   : 1
```
⇒ **the person's RECORD is unrecoverable** — role, importance, faction affiliation, personality,
secrets, influence, every facet: gone with the array entry. What survives is only their **NAME**,
in three places: dangling `relationships` edges (12 entries, pointing at somebody the roster no
longer holds), a `factions` mention, and a rendered `pressureSentence` that speaks about a person
who does not exist. `factions[].members[]` is empty here, so that alias home holds nothing.
`populationHistory` is a count, not a roster.

**A repair could therefore restore a NAME and re-hang edges; it could not restore the person.**
The only true rewind is the campaign-level `pulseUndoStack` snapshot (`capturePulseSnapshot`,
`campaignPulseHelpers.js:262-275`) — a whole-tick rewind, bounded, and gone once the stack rolls.
⛔ **No repair is built here** (the chair's instruction).

---

## §10 · Required symbols, verbatim at `e5bdfd031`, with the post-edit simulation

```sh
$ grep -cF 'function buildSettlementMap'          src/domain/worldPulse/pulseKernel.js     → 1
$ grep -cF 'export function buildWorldSnapshot'   src/domain/worldPulse/worldSnapshot.js   → 1
$ grep -cF 'const fullRoster'                     src/domain/worldPulse/roadsKernel.js     → 1
$ grep -cF 'export function npcId'                src/domain/worldPulse/npcAgency.js       → 1
$ grep -cF 'export function applyWorldPulseResultToState' src/store/campaignPulseHelpers.js → 1
$ grep -cF 'export function factionRosterOf'      src/domain/density/factionLifecycle.js   → 1
$ grep -cF 'export function applyNpcOp'           src/store/settlementPendingEditWriters.js → 1
```
All **HOLD** post-edit: the packet changes `buildSettlementMap`'s BODY and adds a helper beside it;
it renames, moves and deletes nothing. `retiredSymbols`: **NONE**.

```sh
$ node -e "…PACKET_MANIFEST.json, TERMINAL={LANDED,SUPERSEDED}…"
✓ no non-terminal packet reserves src/domain/worldPulse/pulseKernel.js or any test path
EM-B1k present: NO — free to place
```
