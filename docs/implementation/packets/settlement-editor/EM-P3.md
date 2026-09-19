# EM / EM-P3 — THE WORLD-FACT OPTION SETS' ONE HOME (train `em-w0`, wave 0)

**Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)

- **Status:** DRAFT
  ⚠ The status value stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs:297`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 1
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Last revalidated:** 2026-09-19, `d31af2ceebf643818201b2e2ab4a556765d2fc7c` (J-T1 blob identity executed to `7aa769830`, P-14)
- **Depends on:** NONE
- **Collision group:** NONE at wave 0. ⚠ **EM-A1 depends on this packet** for its world-fact card's pools; nothing else in the train names these paths.
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured. Measured at this base: every world-fact option set's real home and export, by symbol; the count of live spellings per fact; the EXISTING facet-alignment contract that already pins three of them; the domain-boundary re-export idiom this home copies; the lighting census's scope and register. Every figure carries its command in `EM-P3.evidence.md`.

---

## 1. Reconciled authority

1. **CHAIR RULING 2026-09-19, ODQ §934.47 addendum, item 2** — *"EM-P3 … the world-fact option sets get ONE canonical, domain-reachable home (the values `resolveConfig` accepts are the truth — measure where it validates culture, terrain, trade access, resources, goods, services, stressors); `src/components/gallery/galleryUtils.js`'s `TERRAIN_OPTIONS`/`CULTURE_OPTIONS`, `CULTURE_PROFILE_KEYS` and the wizard's lists import it; culture's two spellings and terrain's three become one; a single-source walker pins it."*
2. `docs/implementation/charters/EDIT-MODE-TRAIN.md` wave 0, row **EM-P3** (at `1d2da8c95`), which names the home `src/data/worldFactOptions.js` *"(or the measured home)"*.
3. `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §14 FINAL — the world-fact card's pools *"ARE the wizard's own option sets"*.
4. `docs/implementation/PACKET_STANDARD.md`, `EM-PREAMBLE.md` §P1–§P9.
5. Live code and executed evidence at `d31af2cee` — `EM-P3.evidence.md`.

Resolved contradictions, each measured:

- ⭐ **"Culture's two spellings" is THREE, and they are ALREADY PINNED.** `tests/components/gallery/facetAlignment.test.js:12` imports `TERRAIN_WEIGHTS, CULTURES` from `resolveConfig.js` and asserts `CULTURE_OPTIONS ⊇ CULTURES`, no extras (`:75-76`), **and** pins a third copy — `Object.keys(NAMING_DATA).sort()` equals `[...CULTURES].sort()` (`:86`) — with its own comment explaining why the third exists (P-3). → **This packet does not mint a new instrument. It gives the existing contract a source to point at, and extends that file's arms rather than adding a fourth.** Minting a parallel walker beside a live facet-alignment contract is how two instruments come to disagree while both report green.
- ⭐ **"`resolveConfig` validates them" is true for TWO of the seven and false for five.** Measured (P-2): `resolveConfig.js` exports `TERRAIN_WEIGHTS` (`:24`) and `CULTURES` (`:41`) — both already carrying the comment *"Exported for the gallery facet-alignment contract"* — and it **validates nothing else**. Trade access has no list at all; threat, stressors, resources, goods and services live in `src/data/*` modules `resolveConfig` never reads. → The scope is stated per fact in §5.1 rather than as one sentence.
- ⛔ **TRADE ACCESS HAS NO CANONICAL LIST ANYWHERE** (P-4). Its values are spread across module-local `TERRAIN_ROUTE_POOLS` (`resolveConfig.js:29`), two inline literal pools (`:132-133`), `getTerrainType`'s route table, and the gallery's own facet list — and the golden corpus's comment records a seventh value (`mountain_pass`) that *"no route pool rolls"*. This is a MINT, not a move, and it is the one row of this packet that creates a vocabulary rather than relocating one. Flagged in §11 STOP-1 because a minted vocabulary is a decision-fork/ mechanism-coverage question the chair may want priced.
- **The home the charter names (`src/data/worldFactOptions.js`) versus the domain boundary rule.** `src/domain/edit/**` may import nothing from `src/components` (ARCH §1; `EM-PREAMBLE.md` §P4) but `src/data/**` is already the estate's pure-data floor and is reached through `src/domain/` boundary re-exports — the exact idiom `src/domain/cultureProfiles.js` states in its own header: *"The governed profile corpus lives in src/data; generators, dossier readers, and AI context builders import through this stable domain address so the meaning of the culture dial has one public contract."* (P-5) → **The charter's path is adopted, with a domain boundary re-export beside it**, copying that precedent exactly.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** every world-fact option set has ONE canonical home in `src/data/worldFactOptions.js`, reached from the domain through `src/domain/worldFactOptions.js`; `resolveConfig.js` and `galleryUtils.js` import it instead of spelling their own (the wizard spells none — P-9); and the existing facet-alignment contract asserts the single source in both directions.

**Definition of done:** no world fact has two live spellings, and the walker reds if one returns.

In scope:

1. **One primary behaviour:** the canonical option-set module and its domain boundary.
2. **One required integration:** the two existing production spellings re-pointed at it (`resolveConfig`, `galleryUtils`).
3. **One prevention guard:** the single-source arms, added to the EXISTING `tests/components/gallery/facetAlignment.test.js`.

Explicit non-goals:

- any change to a VALUE. ⛔ **This packet is a MOVE, not a re-vocabulary.** Every list keeps its exact members and its exact order; the one exception is trade access, which has no list to keep (§11 STOP-1).
- the editor's pools (EM-A1), the wizard's UI, the gallery's facets, any generator behaviour;
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `0` |
| Named state writers | `0` |
| Feature flags | `0` |
| User-facing surfaces | `0` |
| Direct consumers | `2` (`resolveConfig.js`, `galleryUtils.js`) |
| New logic-bearing production leaves | `0` — both new files are **pure data / re-export**, no branch |
| Existing logic-bearing production files modified | `2` (`resolveConfig.js`, `galleryUtils.js`) |
| Additional registration-only files | `0` — the wizard row measured out (P-9) |
| Handwritten files total | `5` |
| New/changed effective production lines | `≤ 120` |
| Effective lines per new leaf | `≤ 90` (`src/data/worldFactOptions.js`) · `≤ 30` (the domain re-export) |
| Delta in a shared/hot file | `n/a` — **NO hot file is named.** None of the five standing rows appears in §7. |
| Acceptance cases | `6` |

Overrides approved before dispatch: `NONE`.

⚠ **IDENTITY POSTURE: byte-identical output.** Moving a frozen list to a new module and importing it back changes no value, so no generated world moves. The golden master and the prose manifest are UNCHANGED, and the proof is case **A6**.

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-P3
```

Expected: `src/data/worldFactOptions.js` and `src/domain/worldFactOptions.js` ABSENT; the two MODIFY targets clean; every `requiredSymbols` row resolving verbatim. Any mismatch makes this packet STALE.

## 5. Verified tree contract

### 5.1 ⭐ THE SEVEN WORLD FACTS — every live spelling, measured

| world fact | canonical source at the base (path#symbol) | other live spellings | count | evidence |
|---|---|---|---:|---|
| **terrain** | `src/generators/steps/resolveConfig.js#TERRAIN_WEIGHTS` (`:24`, exported *"for the gallery facet-alignment contract"*) — 7 members | `src/components/gallery/galleryUtils.js#TERRAIN_OPTIONS` (`:8`); `tests/helpers/goldenMasterCorpus.js#TERRAINS`; `getTerrainType`'s own route→terrain table | **3 + a derived table** | P-2, P-4 |
| **culture** | `src/generators/steps/resolveConfig.js#CULTURES` (`:41`, same comment) — 11 members | `galleryUtils.js#CULTURE_OPTIONS` (`:12`); `src/data/cultureProfiles.js#CULTURE_PROFILE_KEYS` (`:525`) re-exported by `src/domain/cultureProfiles.js`; `NAMING_DATA`'s keys | **4** | P-2, P-3 |
| **trade access** | ⛔ **NONE — no list exists** | `resolveConfig.js#TERRAIN_ROUTE_POOLS` (module-local, `:29`); the inline pools at `:132-133`; `getTerrainType`'s table; the gallery's facet list; `mountain_pass`, which the golden corpus records as reachable only by explicit config | **0 canonical, ≥4 partial** | P-4 |
| **monster threat** | `src/data/monsterThreat.js#MONSTER_THREAT_TIERS` (`:28`) — `['heartland','frontier','plagued']` — with `MONSTER_THREAT_RANDOM_POOL` (`:37`) and `normalizeMonsterThreat` (`:55`) | the wizard's own labels | **1 canonical + aliases** | P-6 |
| **stressors** | `src/data/stressTypes.js#STRESS_TYPE_MAP` (`:10`), with `src/data/stressTypesMeta.js#STRESS_TYPE_META` (`:24`) | `STRESS_DESCS`, `STRESS_NOTES`, `STRESS_ECONOMIC_EFFECTS`, `STRESS_INSTITUTION_EFFECTS`, `STRESSOR_SPINE_PHRASES` — all **keyed BY** the map, not second spellings of it | **1 canonical** | P-7 |
| **resources** | `src/data/resourceData.js#RESOURCE_DATA` (`:14`), with `SPECIAL_RESOURCES` (`:371`) | `RESOURCE_CHAINS`, `RESOURCE_TO_CHAINS` — keyed by it | **1 canonical** | P-7 |
| **goods** | `src/data/tradeGoodsData.js#GOODS_CATEGORIES` (`:10`) | `IMPORT_GOODS_BY_TIER`, `GOODS_MODIFIERS_BY_TIER` — keyed by it | **1 canonical** | P-7 |
| **services** | `src/data/institutionServices.js#INSTITUTION_SERVICES` (`:8`) | — | **1 canonical** | P-7 |

⭐ **THE SHAPE OF THE WORK IS NOT WHAT THE RULING ASSUMED, AND SAYING SO IS THE POINT.** Four of the seven (stressors, resources, goods, services) **already have exactly one canonical home in `src/data/`** and need no move — only a named citation. Two (terrain, culture) have real duplication and a live contract already pinning it. One (trade access) has no home at all. **The packet is therefore two rows of real work, four rows of citation, and one mint** — not seven moves, and the budget in §3 is sized to that.

### 5.2 The rest of the verified contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| The existing single-source contract | `tests/components/gallery/facetAlignment.test.js` | its culture arms | Imports `TERRAIN_WEIGHTS, CULTURES` from `resolveConfig.js` (`:12`); `expectSuperset(CULTURE_OPTIONS, CULTURES, 'culture')` and `expectNoExtras(…)` (`:75-76`); `expect(Object.keys(NAMING_DATA).sort()).toEqual([...CULTURES].sort())` (`:86`) (P-3) | **EXTEND this file. Never mint a second single-source walker.** |
| The domain-boundary idiom | `src/domain/cultureProfiles.js` | the re-export block | *"The governed profile corpus lives in src/data; … import through this stable domain address so the meaning of the culture dial has one public contract."* (P-5) | Copy this shape for `src/domain/worldFactOptions.js` |
| Pure-data floor | `src/data/**` | — | `monsterThreat.js`, `stressTypes.js`, `resourceData.js`, `tradeGoodsData.js`, `institutionServices.js` are all pure-data modules under it (P-7) | The canonical home joins them |
| Test precedent (contract) | `tests/components/gallery/facetAlignment.test.js` | its superset/no-extras helpers | Both-directions equality with named helpers, literal titles | Copy this proof shape for the new arms |
| Test precedent (shrink-only inventory) | `tests/joins/labelJoins.test.js` | `describe('label-join habitat freeze (shrink-only inventory)')` › `it('the inventory is honest: every frozen file still exists in the scan tree')` | A scan-backed frozen inventory with an honesty arm (P-8) | Copy the honesty arm for A5 |
| Census instrument | `tests/lint/sovereigntyLightingContract.walker.test.js` | `TEST_FILES` · `CENSUS` | Counts TEST files only (`:515-518`, asserted `:7460`); register at `files 2645 · parked 383 · credited 2262 · titles 25009 · suiteTitles 6670` | §7's predicted delta |
| Golden posture | `tests/property/generatorGoldenMaster.test.js` · `tests/property/dossierProseManifest.test.js` | — | Neither appears in §7; the packet moves no value | UNCHANGED; motion is a STOP |

Forbidden alternatives:

- ⛔ **no second single-source walker** — extend `facetAlignment.test.js`;
- ⛔ **no value, member or ORDER change to any list** — `TERRAIN_WEIGHTS` carries weights whose order feeds `rng.weightedPick` (`resolveConfig.js:112-114`), so a reordering is a generation shift disguised as a move;
- no new top-level `worldState` key; no persisted shape; no flag;
- no edit to `src/data/cultureProfiles.js`, `NAMING_DATA`, either golden, or the census register by hand;
- no files outside the manifest.

## 6. Exact contracts

### Inputs and outputs

```js
// src/data/worldFactOptions.js — PURE DATA. No branch, no import from src/domain,
// src/generators or src/components. Frozen at module load.
export const TERRAIN_WEIGHTS = Object.freeze([ /* the SEVEN pairs, verbatim from
  resolveConfig.js:24-27, same members, same order, same weights */ ]);
export const TERRAINS = Object.freeze(TERRAIN_WEIGHTS.map(([t]) => t));
export const CULTURES = Object.freeze([ /* the ELEVEN, verbatim from resolveConfig.js:41-44 */ ]);
/** Citations, not copies: each names the module that owns the vocabulary. */
export const WORLD_FACT_SOURCES = Object.freeze({
  terrain:      'src/data/worldFactOptions.js#TERRAIN_WEIGHTS',
  culture:      'src/data/worldFactOptions.js#CULTURES',
  tradeAccess:  'src/data/worldFactOptions.js#TRADE_ACCESS',
  monsterThreat:'src/data/monsterThreat.js#MONSTER_THREAT_TIERS',
  stressors:    'src/data/stressTypes.js#STRESS_TYPE_MAP',
  resources:    'src/data/resourceData.js#RESOURCE_DATA',
  goods:        'src/data/tradeGoodsData.js#GOODS_CATEGORIES',
  services:     'src/data/institutionServices.js#INSTITUTION_SERVICES',
});
```

```js
// src/domain/worldFactOptions.js — the stable domain address, copying
// src/domain/cultureProfiles.js's boundary idiom exactly. A re-export ONLY.
export { TERRAIN_WEIGHTS, TERRAINS, CULTURES, TRADE_ACCESS, WORLD_FACT_SOURCES }
  from '../data/worldFactOptions.js';
```

### Absence rules

- absent from `WORLD_FACT_SOURCES`: **forbidden** — all eight keys are required, and A4 asserts the count.
- a `WORLD_FACT_SOURCES` value naming a path that does not exist, or a symbol not present in it: a walker red (A4).
- `TRADE_ACCESS`: see §11 STOP-1. The packet does not choose its members.

### Ordering, determinism, lifecycle

- **Order is load-bearing and preserved exactly.** `TERRAIN_WEIGHTS` feeds `rng.weightedPick(terrains, weights)` (`resolveConfig.js:112-114`) and `CULTURES` feeds `rng.pick(CULTURES)` (`:160`): **a reorder moves every random-terrain and random-culture world.** The move copies both arrays verbatim, and A6 proves no golden moved.
- Hash/fork key `NONE`; no rounding; no PRNG in the new modules; no clock, locale or environment read.
- Lifecycle: module load, frozen. Never persisted. Every other column `n/a`.
- Flag: `NONE`. Golden posture: **UNCHANGED**.
- Alignment: `DECLARED EMPTY.` Edit story: `ENGINE-ONLY: this packet moves vocabularies; it exposes no DM verb.`

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/data/worldFactOptions.js` | `TERRAIN_WEIGHTS`, `TERRAINS`, `CULTURES`, `TRADE_ACCESS`, `WORLD_FACT_SOURCES` | `≤ 90` | Pure data, frozen. Copy `TERRAIN_WEIGHTS` and `CULTURES` **verbatim, same members, same order**. Import nothing. |
| `CREATE` | `src/domain/worldFactOptions.js` | the re-export block | `≤ 30` | A re-export only, with the boundary docblock copied in shape from `src/domain/cultureProfiles.js`. |
| `MODIFY` | `src/generators/steps/resolveConfig.js` | `TERRAIN_WEIGHTS`, `CULTURES` | `≤ 6` net | Replace both literals with an import from `../../data/worldFactOptions.js` and **re-export both under their existing names**, so every current importer (the facet contract, the gallery, the corpus helper) keeps working unchanged. ⛔ Touch nothing else in this file. |
| `MODIFY` | `src/components/gallery/galleryUtils.js` | `TERRAIN_OPTIONS`, `CULTURE_OPTIONS` | `≤ 6` net | Derive both from the canonical home instead of spelling them. Keep the exported names — `GallerySidebar.jsx:8,12,83,89` imports them. |
| ~~`MODIFY` the wizard's option list~~ | — | — | **ROW DROPPED — MEASURED, NOT ASSUMED.** P-9: `git grep -n "'plains'\|'germanic'" -- src/components/generate/ src/components/GenerateWizard.jsx src/components/ConfigurationPanel.jsx` returns **zero lines**. The wizard spells no terrain or culture list of its own; the ruling's "the wizard's lists" are the gallery's, already covered by row 4. A manifest row for a file that does not duplicate is scope this packet does not take. |
| `TEST` | `tests/components/gallery/facetAlignment.test.js` | cases A1–A5 | `n/a` | **EXTEND the existing contract.** Literal titles only; no `.each`, no loop-generated registration, no nested `describe` (`EM-PREAMBLE.md` §P3.4). Every negative assertion carries `// anchored:` on the line immediately above. |

Generated artifacts: `NONE`. **Neither new file is in an edge-shared bundle closure** — the five entry modules are `src/domain/{aiCharter,aiGrounding,aiOutputSchema,intentAtlas}.js` and `src/lib/analyticsEvents.js` (P-10).

No other file may be edited.

**Predicted register moves, priced here rather than discovered at the terminal:**

| Register | Moves? | Predicted delta | Door |
|---|---|---|---|
| Lighting census | **NO** | **zero** — ⭐ this packet adds NO test file; it extends an existing one. `CENSUS.files` counts `TEST_FILES` (`:515-518`), and an existing file that gains arms moves `titles`/`suiteTitles` only if it gains `test(` calls — **it does**, so `titles +T` and `suiteTitles +0` (no new `describe`). `files`, `parked` and `credited` are UNCHANGED. | A named interior red on `titles` alone; re-derived whole at the terminal |
| Mutation-coverage manifest | **NO** | zero — `tests/components/` is **not** one of the eight `ENFORCER_DIRS` (`tests/lint`, `design`, `docs`, `data`, `copy`, `security`, `edgeFunctions`, `generators`), and `facetAlignment.test.js` already exists, so no row is owed (P-11) |
| Writer-reach / observed-shape | **NO** | zero — no settlement field is read; the new modules are frozen literals |
| Decision-fork registry | ⚠ **ONLY IF `TRADE_ACCESS` IS MINTED** | a mint would carry its classification row and its mechanism-coverage baseline row (`PACKET_STANDARD.md:297`) — **which is why §11 STOP-1 holds the mint for the chair** rather than taking it |
| Prose-numerics · size-baseline · edge-shared | **NO** | zero |

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch. **Re-run P-9's command**; if the wizard has since grown a list, that is a STOP and a re-compile, not a quiet sixth row.
1. Capture the baseline: run `facetAlignment.test.js` green at the base and record its count, so the extension's delta is visible.
2. Add the failing arms for A1–A5.
3. Create `src/data/worldFactOptions.js` with both arrays copied verbatim.
4. Create `src/domain/worldFactOptions.js`.
5. Re-point `resolveConfig.js`, then `galleryUtils.js`. (No wizard row — P-9.)
6. No registration is owed (§7 table).
7. Run focused verification (§10), including the golden proof A6.
8. Write the completion receipt.

Bounded algorithm (the single-source arm):

```text
1. Import the canonical home and every re-exporting module.
2. For each of terrain and culture: assert the canonical array and EVERY live
   spelling are equal AS ARRAYS — same members AND same order, both directions.
   Never a superset test where an equality is available.
3. For each WORLD_FACT_SOURCES entry: assert the path exists and the symbol is
   present verbatim in it.
4. Assert WORLD_FACT_SOURCES has exactly eight keys, so a fact cannot be dropped.
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behaviour — one source | the canonical home and every re-exporter | terrain and culture are equal AS ARRAYS (members AND order) across every live spelling, both directions | `tests/components/gallery/facetAlignment.test.js` |
| A2 | The existing arms still hold | `CULTURE_OPTIONS`, `CULTURES`, `NAMING_DATA` | the three pre-existing culture assertions (`:75`, `:76`, `:86`) pass unchanged against the new source | same |
| A3 | Counterforce — GUARD-THE-GUARD | a planted extra member in `galleryUtils.js`'s derived list | A1 REDS, naming the fact and the divergent member | same |
| A4 | The citation map is honest | `WORLD_FACT_SOURCES` | exactly eight keys; every path exists; every symbol is present verbatim in its file | same |
| A5 | Order is load-bearing | `TERRAIN_WEIGHTS` | the weights array is equal element-for-element to the pre-move literal, with the reason in the failure message (`rng.weightedPick` reads position) | same |
| A6 | ⭐ Identity / golden | the 525-row corpus | `generatorGoldenMaster` and `dossierProseManifest` **do not move** — the packet relocates values and changes none | `tests/property/generatorGoldenMaster.test.js` (run, not edited) |

Rows for absence, idempotency, lifecycle and privacy are **omitted, not replaced**: nothing is persisted, projected or made absent.

## 10. Verification commands

```sh
npx eslint src/data/worldFactOptions.js src/domain/worldFactOptions.js \
  src/generators/steps/resolveConfig.js src/components/gallery/galleryUtils.js \
  tests/components/gallery/facetAlignment.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/components/gallery/facetAlignment.test.js --maxWorkers=2
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/generators/resolveConfigReceipts.test.js --maxWorkers=2
# A6 — the identity proof. It must be GREEN, not re-recorded.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/property/generatorGoldenMaster.test.js \
  tests/property/dossierProseManifest.test.js --maxWorkers=2

node scripts/implementation-packets.mjs validate
```

Expected: **every command exits `0`.** ⛔ This packet has NO named red except the lighting census's `titles` delta (§7), and **`UPDATE_GOLDEN` is never set** — a golden that moves here is a STOP, because a move that changes a value is not a move. A gate line with no printed test count DID NOT RUN.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if: either golden moves; any list's members or ORDER change; a second single-source walker appears necessary; `resolveConfig.js` needs an edit outside its two literals; or `WORLD_FACT_SOURCES` would name a path that does not exist.

---

### ⛔ STOP-1 — TRADE ACCESS HAS NO LIST TO MOVE, SO ITS ROW IS A MINT AND THE PACKET DOES NOT TAKE IT

Measured (P-4): the trade-access vocabulary exists only as scattered pools and tables — `TERRAIN_ROUTE_POOLS` (module-local, seven per-terrain arrays), two inline literal pools at `resolveConfig.js:132-133`, `getTerrainType`'s route table, and the gallery's own facet list. The observable members across those sites are `road`, `crossroads`, `river`, `port`, `isolated`, plus the config-only tokens `random_trade`, `none` and `mountain_pass` — the last of which the golden corpus records as *"the panel's seventh option. No route pool rolls it."*

**Minting `TRADE_ACCESS` is therefore a NEW VOCABULARY, and three things follow that a lane may not decide:**

1. **Membership.** Does the canonical list carry the five rollable routes, or all eight including the config-only tokens? A pool the editor offers is a user-facing set; a generator's roll pool is not.
2. **`PACKET_STANDARD.md:297` prices it.** *"A seeded chooser or pool mint carries two obligations. (a) Its decision-fork classification row … (b) Its mechanism-coverage baseline row."* Both are estate-wide rows belonging to the minting wave. This packet's budget does not carry them and its §7 does not name them.
3. **`mountain_pass` is a measured latency**, not a new idea: a selectable option no pool rolls. Canonicalizing the list forces a decision about it either way, and silently including or excluding it would be exactly the quiet renegotiation the standard forbids.

**Disposition:** the six facts with real homes move and are cited now; `TRADE_ACCESS` is exported as a **named, empty-by-declaration placeholder the walker refuses to read** until the chair rules its membership, OR the row is dropped from this packet and re-aimed. **The lane does not choose between those two.** Everything else in this packet is READY-shaped and does not wait on it — which is why the status is DRAFT rather than BLOCKED.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the next wave.

## 12. Completion receipt

- Base SHA: `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- Dispatch bundle and seal identity: **NOT DISPATCHED** — status DRAFT; compile only.
- Final commit or working-tree state: **no edit made.** This lane wrote only under `$SP/lane-em-a-scratch/`.
- Exact changed files and effective-line deltas: `NONE`.
- Acceptance cases: `0 of 6 executed`.
- Focused commands, exits, and counts: **no vitest, eslint, `npm run check` or writing script was run.** Every measurement command and its output is in `EM-P3.evidence.md`.
- Both typecheck configurations: `n/a`.
- Base-versus-wave failure identity diff: `n/a`.
- Dormancy/golden result: `n/a` — DECLARED UNCHANGED for the eventual build, proved by A6.
- Generated artifacts: `NONE`
- Deviations: **ONE STOP recorded, §11 STOP-1 (trade access is a mint, not a move).** The other six facts are compiled.
- Out-of-scope observations, without investigation:
  1. **Four of the seven world facts never needed this packet** — stressors, resources, goods and services already have exactly one canonical `src/data/` home each (§5.1). Their rows are citations, and saying so keeps a later lane from "moving" a list that is already single.
  2. `tests/helpers/goldenMasterCorpus.js` carries a fourth terrain spelling in a TEST helper. It is out of this packet's manifest deliberately — a test helper is not production duplication — but it will drift the day terrain changes, and the walker cannot see it.
  3. `mountain_pass` is a selectable trade-route option that **no route pool rolls** (the golden corpus's own comment). Named, not investigated.
  4. `resolveConfig.js`'s two exports already carry the comment *"Exported for the gallery facet-alignment contract"* — the estate had already recognised this duplication and solved half of it with a contract test rather than a source. This packet finishes that move.
- Judgment calls: `NONE`.
