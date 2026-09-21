# EM / EM-P3 — THE WORLD-FACT OPTION SETS' ONE HOME (train `em-w0`, wave 0)

**Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: 1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6 — stamped by the chair at promotion; §P2 rows 10–11, which this packet is the first to carry, landed at `4da740b52`)

- **Status:** `LANDED`
  ⚠ The status value stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs:297`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 2 (pre-proved at the tip, then amended under the chair's rulings of 2026-09-19 — P-27)
- **Landed at:** `f4e5b64c5f1aad56710f21891bccb1943d05633b` — train EM-T3; built under sealed dispatch by an Opus build lane; the generation worker re-minted 1,401,128 to 1,401,208 (+80 B, bound 412), the engine 196 B smaller, the eager first-paint set byte-identical at 268; strict dist 538
  **What version 2 changed and why.** An Opus pre-proof lane re-measured this packet against the
  build branch's tip `a41a0e109` (evidence P-15…P-27). Not one declared source path had moved, so
  every verified fact and every line number survived unchanged. Four things did change.
  (1) **The bundle budgets are now priced**, under the charter's amendment of 2026-09-19 that names
  EM-P3 the first packet to owe it: `resolveConfig.js` is inside the generation worker's closure,
  whose ceiling has ZERO slack (P-20).
  (2) ⭐ **THE PLACEMENT CURE, ruled by the chair and measured** — `WORLD_FACT_SOURCES` is an INDEX
  of where the other option lists live, not an option list, and the generation worker never reads it.
  It therefore lives in `src/domain/worldFactOptions.js`, outside `resolveConfig`'s import closure,
  while the option VALUES live in `src/data/worldFactOptions.js` where the generator must reach them.
  The worker's priced delta falls **+634 B → +206 B** and the first-paint closure stays byte-identical
  (P-27). The estate's own law for this shape: *"THE CURE IS THE PLACEMENT, NEVER THE CEILING"*.
  (3) **§11 STOP-1 is RESOLVED** — the charter at the tip rules trade access to EM-P3b, so
  `TRADE_ACCESS` leaves this packet entirely and `WORLD_FACT_SOURCES` carries seven keys (P-22).
  (4) **The lighting census's absolute tuple is replaced by this packet's own delta**, because the
  register moved under the packet between its base and the tip (P-19).
  One forbidden alternative is pinned throughout: **no `src/generators/**` module may import the
  `src/domain/` address** — measured, that single path segment puts BOTH new files into the eager
  first-paint closure (P-20g). The gallery may, and does, because it is not a first-paint module.
- **Verified base:** `fixes-2026-09-18-consist` at `4928be0ab7210dff47429af788670f80947d36ad`
- **Last revalidated:** 2026-09-19 at `4928be0ab7210dff47429af788670f80947d36ad` — measured by an Opus pre-proof lane at `a41a0e109` (evidence P-15…P-28) and stamped by the chair at promotion. The J-T1 window `d31af2cee..<tip>` over every change-manifest and every requiredSymbols path holds ONE moved path, and it is the reason the base is the tip: `tests/build/generationWorkerLazy.test.js`, re-minted at `91d5f155b` (ODQ §934.19 addendum 2) — the ceiling row this packet now carries puts that file in the dispatch's substrate, so the row and this stamp are one act. Both CREATE targets are absent and Git-clean; all 12 requiredSymbols rows resolve verbatim (the chair re-ran both at the promotion tip, after EM-B3a's landing `668d87512`, which touches none of this packet's paths). THE BUDGETS, PRICED UNDER THE CHAIR'S PLACEMENT CURE (the citation map lives in the domain leaf, out of `resolveConfig`'s import closure): the generation worker +206 B by per-module estimate against a ZERO-slack ceiling of 1,401,128 B — a certain red, carried by this packet's own ceiling TEST row and bounded at 412 B; the lazy engine −143 B (READ and quoted at the build, never edited); the eager first-paint set byte-identical at 268 modules; data-lazy +349 B. The rise rides the standing conditional ruling and the chair records the measured figures in the ODQ at the landing. THE LIGHTING WALKER IS ALREADY RED AT THIS TIP by EM-B3a's un-refrozen landing (its build lane measured `2648 · 383 · 2265 · 25013 · 6675` against the frozen `2646 · 383 · 2263 · 25005 · 6671`); this packet's own delta is `titles +2`, so the whole tuple should read `2648 · 383 · 2265 · 25015 · 6675` — measure it in a throwaway `git archive` probe outside the worktree (the walker's equality is a sequential chain and shows only `files` in place); the refreeze is the train's terminal act and the chair's.
- **Depends on:** NONE — re-checked at the tip. EM-B3b and EM-P0 are LANDED, EM-P2 is STALE; this packet needs none of them, and no other non-terminal packet reserves any of its paths (P-23).
- **Collision group:** NONE at wave 0. ⚠ **EM-A1 depends on this packet** for its world-fact card's pools; nothing else in the train names these paths. ⚠ This packet also reserves **`tests/build/generationWorkerLazy.test.js`** — unreserved by every one of the manifest's 188 packets at the tip (P-23), and released when EM-P3 lands. `tests/build/vendorPdfLazy.test.js` is **READ, never edited**, and is deliberately NOT a manifest row (chair's ruling Q3: a row the build is expected not to edit makes the landing's "exactly N paths" receipt ambiguous).
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured, and re-measured at the tip. Measured: every world-fact option set's real home and export, by symbol; the count of live spellings per fact; the EXISTING facet-alignment contract that already pins terrain AND culture; the domain-boundary re-export idiom this home copies; the lighting census's scope and register; and — new in version 2 — **which emitted chunk every `src/` path in this packet lands in, by executing the repo's own `vite.config.js` derivations against a patched overlay of the tip.** Every figure carries its command in `EM-P3.evidence.md`.

---

## 1. Reconciled authority

1. **CHAIR RULING 2026-09-19, ODQ §934.47 addendum, item 2** — *"EM-P3 … the world-fact option sets get ONE canonical, domain-reachable home (the values `resolveConfig` accepts are the truth — measure where it validates culture, terrain, trade access, resources, goods, services, stressors); `src/components/gallery/galleryUtils.js`'s `TERRAIN_OPTIONS`/`CULTURE_OPTIONS`, `CULTURE_PROFILE_KEYS` and the wizard's lists import it; culture's two spellings and terrain's three become one; a single-source walker pins it."*
2. `docs/implementation/charters/EDIT-MODE-TRAIN.md` wave 0, row **EM-P3** — **re-read at the tip `a41a0e109`, where it now reads** *"the world-fact option sets' one home (as measured: two moves, four citations; **trade access → EM-P3b**)"* and names the home `src/data/worldFactOptions.js` *"(or the measured home)"*. At this packet's old base the charter was 53 lines and had no EM-P3 row at all (P-22).
2b. ⭐ **`docs/implementation/charters/EDIT-MODE-TRAIN.md`, "Amendments of 2026-09-19 15:0x EDT", final bullet** — *"Ceilings are PRICED AT PRE-PROOF for every packet that touches the generation worker's closure (the process law of ODQ §934.19 addendum 2): the packet's manifest carries the two bundle-ceiling tests as TEST rows with a stated byte bound, and the build lane re-mints them under the chair's standing conditional ruling — a real `npm run build`, the kit's per-module attribution showing ONLY the packet's own modules moved, growth inside the priced bound — or STOPS. **EM-P3 (`resolveConfig.js`) is the first.**"* This is why §7 carries two TEST rows §5.2 did not have at version 1, and why §8 gains step 9.
2c. **`docs/implementation/charters/EDIT-MODE-TRAIN.md`, the EM-P3b paragraph** — *"trade access gets its one list (`TRADE_ACCESS`, minted with its decision-fork row and its mechanism-coverage row) and the world-facts card declares it."* This is the chair's answer to version 1's §11 STOP-1.
3. `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §14 FINAL — the world-fact card's pools *"ARE the wizard's own option sets"*.
4. `docs/implementation/PACKET_STANDARD.md`, `EM-PREAMBLE.md` §P1–§P9.
5. Live code and executed evidence at `d31af2cee` — `EM-P3.evidence.md`.

Resolved contradictions, each measured:

- ⭐ **"Culture's two spellings" is THREE, and they are ALREADY PINNED.** `tests/components/gallery/facetAlignment.test.js:12` imports `TERRAIN_WEIGHTS, CULTURES` from `resolveConfig.js` and asserts `CULTURE_OPTIONS ⊇ CULTURES`, no extras (`:75-76`), **and** pins a third copy — `Object.keys(NAMING_DATA).sort()` equals `[...CULTURES].sort()` (`:86`) — with its own comment explaining why the third exists (P-3). → **This packet does not mint a new instrument. It gives the existing contract a source to point at, and extends that file's arms rather than adding a fourth.** Minting a parallel walker beside a live facet-alignment contract is how two instruments come to disagree while both report green.
- ⭐ **"`resolveConfig` validates them" is true for TWO of the seven and false for five.** Measured (P-2): `resolveConfig.js` exports `TERRAIN_WEIGHTS` (`:24`) and `CULTURES` (`:41`) — both already carrying the comment *"Exported for the gallery facet-alignment contract"* — and it **validates nothing else**. Trade access has no list at all; threat, stressors, resources, goods and services live in `src/data/*` modules `resolveConfig` never reads. → The scope is stated per fact in §5.1 rather than as one sentence.
- ⛔ **TRADE ACCESS HAS NO CANONICAL LIST ANYWHERE** (P-4), and **at the tip the charter removes the row from this packet** (P-22). Its values are spread across module-local `TERRAIN_ROUTE_POOLS` (`resolveConfig.js:29`), two inline literal pools (`:131-133`), `getTerrainType`'s route table, and the gallery's own facet list — and the golden corpus's comment records a seventh value (`mountain_pass`) that *"no route pool rolls"*. That made it a MINT, not a move. Version 1 held the question open as §11 STOP-1; **version 2 applies the chair's landed answer — trade access is EM-P3b's whole row.** `TRADE_ACCESS` is exported nowhere here, `WORLD_FACT_SOURCES` carries SEVEN keys, and the decision-fork and mechanism-coverage obligations travel with EM-P3b where the mint happens.
- ⭐⭐ **A GENERATOR IMPORTING THE DOMAIN ADDRESS WOULD PUT BOTH NEW FILES IN FIRST PAINT** (P-20g, measured). `vite.config.js`'s `computeEngineSharedDomain()` seeds into the EAGER `engine-core` chunk the transitive closure, within `src/domain`, of every domain module any `src/generators` module imports. Measured on an overlay differing by one path segment: with `resolveConfig.js` importing `../../domain/worldFactOptions.js`, `EAGER_FIRST_PAINT_MODULES` goes 268 → 270, `src/domain/worldFactOptions.js` routes to `engine-core` and `src/data/worldFactOptions.js` to the eager `data` chunk. → **The generator and the gallery import `src/data/worldFactOptions.js`; the `src/domain/` address exists for EM-A1's domain consumers and is imported by NO generator.** Pinned as a forbidden alternative in §5.2.
- **The home the charter names (`src/data/worldFactOptions.js`) versus the domain boundary rule.** `src/domain/edit/**` may import nothing from `src/components` (ARCH §1; `EM-PREAMBLE.md` §P4) but `src/data/**` is already the estate's pure-data floor and is reached through `src/domain/` boundary re-exports — the exact idiom `src/domain/cultureProfiles.js` states in its own header: *"The governed profile corpus lives in src/data; generators, dossier readers, and AI context builders import through this stable domain address so the meaning of the culture dial has one public contract."* (P-5) → **The charter's path is adopted, with a domain boundary re-export beside it**, copying that precedent exactly.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** every world-fact option VALUE set that HAS a home has ONE canonical home in `src/data/worldFactOptions.js`; `src/domain/worldFactOptions.js` is the stable domain address, re-exporting those values and owning the `WORLD_FACT_SOURCES` index of where the other five lists live. `resolveConfig.js` imports the **`src/data/`** address; `galleryUtils.js` imports the **`src/domain/`** address; neither spells its own list any more (the wizard spells none — P-9); and the existing facet-alignment contract asserts the single source in both directions. Trade access is **not** in this packet (the charter routes it to EM-P3b — P-22).

⭐ **THE TWO ADDRESSES ARE A BUDGET DECISION, NOT A TASTE ONE, AND THE SPLIT IS THE POINT** (P-27, the chair's ruling Q2). The option VALUES must be reachable from `src/generators`, so they sit in `src/data/` and ride into the generation worker with `resolveConfig`. The CITATION MAP is an index of other modules' addresses — **the generation worker never reads it** — so it sits in the domain leaf, outside `resolveConfig`'s import closure. Measured, that placement takes the worker's priced delta from **+634 B to +206 B** while the first-paint closure stays byte-identical. Folding the map back beside the lists would spend 428 extra bytes of a ZERO-SLACK ceiling on bytes the worker never executes; `vite.config.js`'s own det-math note states the rule — *"THE CURE IS THE PLACEMENT, NEVER THE CEILING"*.

⛔ **The asymmetry is load-bearing and is pinned in §5.2:** a `src/generators/**` module importing the `src/domain/` address seeds `ENGINE_SHARED_DOMAIN` and drags BOTH files into the eager first-paint closure (268 → 270, measured — P-20g). The gallery may import it and does, because `galleryUtils.js` is not a first-paint module (proved, P-27c).

**Definition of done:** no world fact has two live spellings, and the walker reds if one returns.

In scope:

1. **One primary behaviour:** the canonical option-set module and its domain boundary.
2. **One required integration:** the two existing production spellings re-pointed at it (`resolveConfig`, `galleryUtils`).
3. **One prevention guard:** the single-source arms, added to the EXISTING `tests/components/gallery/facetAlignment.test.js`.

Explicit non-goals:

- any change to a VALUE. ⛔ **This packet is a MOVE, not a re-vocabulary.** Every list keeps its exact members and its exact order, with no exception — trade access, the one fact that would have needed a mint, is now EM-P3b's (P-22).
- `TRADE_ACCESS` in any form, including an empty or placeholder export. EM-P3b mints it with its decision-fork and mechanism-coverage rows.
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
| Ceiling-bearing test files | `1` — `generationWorkerLazy.test.js` only; **constant + comment only**, no arm added or removed. `vendorPdfLazy.test.js` is READ, never edited, and is not a manifest row (ruling Q3). |
| Handwritten files total | `6` (5 + the one ceiling test) — the cap is 12 |
| New/changed effective production lines | `≤ 120` — **unchanged**; a ceiling constant is a test line, not a production line |
| Effective lines per new leaf | `≤ 40` (`src/data/worldFactOptions.js` — VALUES only) · `≤ 45` (`src/domain/worldFactOptions.js` — the re-export plus the seven-key index) |
| Delta in a shared/hot file | `n/a` — **NO hot file is named.** None of the five standing rows appears in §7. |
| Acceptance cases | `7` (was 6; A7 is the ceiling arm) — the standard's cap is 8 |
| ⭐ Generation-worker byte delta | **`+206 B` minified under the placement cure, measured (P-27a); priced bound `412 B` = the estimate ×2.** Rejected alternative: the map beside the lists, `+634 B` — 428 extra bytes of a zero-slack ceiling for bytes the worker never reads. |

Overrides approved before dispatch: `NONE`. **No budget is raised here:** the acceptance count moves 6 → 7 inside the standard's own cap of 8, and the file count 5 → 7 inside its cap of 12.

⚠ **IDENTITY POSTURE: byte-identical output.** Moving a frozen list to a new module and importing it back changes no value, so no generated world moves. The golden master and the prose manifest are UNCHANGED, and the proof is case **A6**.

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-P3
```

Expected: `src/data/worldFactOptions.js` and `src/domain/worldFactOptions.js` ABSENT; the two MODIFY targets and the two TEST targets clean; every `requiredSymbols` row resolving verbatim. Any mismatch makes this packet STALE.

⭐ **Re-read against the AMENDED manifest** (six change rows, twelve requiredSymbols, `vendorPdfLazy.test.js` dropped) — P-28.

**Read dry at `a41a0e109` (P-24), check by check against `scripts/implementation-session.mjs`:**

| check | source | verdict once the chair stamps the base to the tip |
|---|---|---|
| status is READY | `:274` | the chair's promotion supplies it |
| manifest validates | `:271` | PASSES — no duplicate change path across packets (P-23); 7 acceptance cases ≤ 8; every action in `PACKET_ACTIONS` |
| branch matches the capsule | `:353` | the build lane holds the integration branch in ITS worktree; the chair stays detached |
| base is an ancestor of HEAD | `:176-183` | PASSES — the base IS the tip |
| substrate unchanged since base | `:185-196` | **SHORT-CIRCUITS at `:184`** (`head === packet.verifiedBase`). It would pass even from the old base: P-16's window over the substrate is EMPTY |
| capsule names every substrate path | `:197-200` | PASSES — built from the same two lists |
| CREATE targets absent and Git-clean | `:205-211` | PASSES — both ABSENT and untracked-clean at the tip (P-16) |
| non-CREATE targets Git-clean | `:212-213` | PASSES on a clean lane worktree |

⭐ Note the substrate check **excludes CREATE rows** (`:186`), so the ceiling TEST row puts `generationWorkerLazy.test.js` INTO the substrate. That is deliberate: if another lane moves the worker ceiling between the chair's stamp and the dispatch, **this packet refuses rather than landing on a moved ceiling.** `vendorPdfLazy.test.js` is deliberately outside the substrate — it is read, never written, and a row for it would only make the landing's path receipt ambiguous (ruling Q3).

⛔⛔ **AND IT HAS A CONSEQUENCE THE CHAIR ACTS ON AT PROMOTION: THE OLD BASE IS IMPOSSIBLE.** `tests/build/generationWorkerLazy.test.js` MOVED between `d31af2cee` and the tip — that is commit `91d5f155b`, EM-P0's own re-mint (P-25). At version 1, with no ceiling row, this packet's window was empty and it would have dispatched at either sha. **From version 2 it must be stamped to `a41a0e109` or later**, or `assertAncestorAndSubstrate` throws `verified-base descendant changed declared substrate: tests/build/generationWorkerLazy.test.js`. Dropping `vendorPdfLazy.test.js` (ruling Q3) removes one name from that message and changes nothing else — **the constraint stands on the worker row alone** (P-28). This is the same refusal that re-pinned EM-P2 to `00fab686d`. Stamping the base to the tip satisfies it by short-circuit (`:184`). ⭐ The chair stamps the base and this row together, at promotion.

## 5. Verified tree contract

### 5.1 ⭐ THE WORLD FACTS — every live spelling, measured

⚠ **Three counts appear below and they are different facts; the arithmetic is stated once here so no
reader has to reconstruct it.** The charter names SEVEN world facts (terrain, culture, trade access,
resources, goods, services, stressors). The table measures EIGHT rows, because monster threat has its
own canonical home and belongs in the census even though the charter's list omits it.
`WORLD_FACT_SOURCES` carries SEVEN keys — the table's eight minus trade access, which the charter
moved to EM-P3b (P-22). A4 asserts that seven-key named set.

| world fact | canonical source at the base (path#symbol) | other live spellings | count | evidence |
|---|---|---|---:|---|
| **terrain** | `src/generators/steps/resolveConfig.js#TERRAIN_WEIGHTS` (`:24`, exported *"for the gallery facet-alignment contract"*) — 7 members | `src/components/gallery/galleryUtils.js#TERRAIN_OPTIONS` (`:8`); `tests/helpers/goldenMasterCorpus.js#TERRAINS`; `getTerrainType`'s own route→terrain table | **3 + a derived table** | P-2, P-4 |
| **culture** | `src/generators/steps/resolveConfig.js#CULTURES` (`:41`, same comment) — 11 members | `galleryUtils.js#CULTURE_OPTIONS` (`:12`); `src/data/cultureProfiles.js#CULTURE_PROFILE_KEYS` (`:525`) re-exported by `src/domain/cultureProfiles.js`; `NAMING_DATA`'s keys | **4** | P-2, P-3 |
| ~~**trade access**~~ | ⛔ **NONE — no list exists, and the row is EM-P3b's** (charter, P-22) | `resolveConfig.js#TERRAIN_ROUTE_POOLS` (module-local, `:29`); the inline pools at `:131-133`; `getTerrainType`'s table; the gallery's facet list; `mountain_pass`, which the golden corpus records as reachable only by explicit config | **0 canonical, ≥4 partial** | P-4, P-22 |
| **monster threat** | `src/data/monsterThreat.js#MONSTER_THREAT_TIERS` (`:28`) — `['heartland','frontier','plagued']` — with `MONSTER_THREAT_RANDOM_POOL` (`:37`) and `normalizeMonsterThreat` (`:55`) | the wizard's own labels | **1 canonical + aliases** | P-6 |
| **stressors** | `src/data/stressTypes.js#STRESS_TYPE_MAP` (`:10`), with `src/data/stressTypesMeta.js#STRESS_TYPE_META` (`:24`) | `STRESS_DESCS`, `STRESS_NOTES`, `STRESS_ECONOMIC_EFFECTS`, `STRESS_INSTITUTION_EFFECTS`, `STRESSOR_SPINE_PHRASES` — all **keyed BY** the map, not second spellings of it | **1 canonical** | P-7 |
| **resources** | `src/data/resourceData.js#RESOURCE_DATA` (`:14`), with `SPECIAL_RESOURCES` (`:371`) | `RESOURCE_CHAINS`, `RESOURCE_TO_CHAINS` — keyed by it | **1 canonical** | P-7 |
| **goods** | `src/data/tradeGoodsData.js#GOODS_CATEGORIES` (`:10`) | `IMPORT_GOODS_BY_TIER`, `GOODS_MODIFIERS_BY_TIER` — keyed by it | **1 canonical** | P-7 |
| **services** | `src/data/institutionServices.js#INSTITUTION_SERVICES` (`:8`) | — | **1 canonical** | P-7 |

⭐ **THE SHAPE OF THE WORK IS NOT WHAT THE RULING ASSUMED, AND SAYING SO IS THE POINT.** Four of the seven (stressors, resources, goods, services) **already have exactly one canonical home in `src/data/`** and need no move — only a named citation. Two (terrain, culture) have real duplication and a live contract already pinning it. One (trade access) has no home at all, **and the charter has moved it to EM-P3b**. **The packet is therefore two rows of real work and five rows of citation — not seven moves, and not a mint at all.** The charter's own row now says the same thing: *"as measured: two moves, four citations; trade access → EM-P3b"*. The budget in §3 is sized to that.

### 5.2 The rest of the verified contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| The existing single-source contract | `tests/components/gallery/facetAlignment.test.js` | its culture arms | Imports `TERRAIN_WEIGHTS, CULTURES` from `resolveConfig.js` (`:12`); `expectSuperset(CULTURE_OPTIONS, CULTURES, 'culture')` and `expectNoExtras(…)` (`:75-76`); `expect(Object.keys(NAMING_DATA).sort()).toEqual([...CULTURES].sort())` (`:86`) (P-3) | **EXTEND this file. Never mint a second single-source walker.** |
| The domain-boundary idiom | `src/domain/cultureProfiles.js` | the re-export block | *"The governed profile corpus lives in src/data; … import through this stable domain address so the meaning of the culture dial has one public contract."* (P-5) | Copy this shape for `src/domain/worldFactOptions.js` |
| Pure-data floor | `src/data/**` | — | `monsterThreat.js`, `stressTypes.js`, `resourceData.js`, `tradeGoodsData.js`, `institutionServices.js` are all pure-data modules under it (P-7) | The canonical home joins them |
| Test precedent (contract) | `tests/components/gallery/facetAlignment.test.js` | its superset/no-extras helpers | Both-directions equality with named helpers, literal titles | Copy this proof shape for the new arms |
| Test precedent (shrink-only inventory) | `tests/joins/labelJoins.test.js` | `describe('label-join habitat freeze (shrink-only inventory)')` › `it('the inventory is honest: every frozen file still exists in the scan tree')` | A scan-backed frozen inventory with an honesty arm (P-8) | Copy the honesty arm for A5 |
| Census instrument | `tests/lint/sovereigntyLightingContract.walker.test.js` | `TEST_FILES` · `CENSUS` | Counts TEST files only (`:515-518`); the register lives in `tests/lint/.lighting-census-baseline.json`. ⛔ **NO ABSOLUTE TUPLE IS QUOTED HERE.** It moved under this packet between its base and the tip — `files 2645→2646 · parked 383→383 · credited 2262→2263 · titles 25009→25005 · suiteTitles 6670→6671` (P-19) — so the absolute is **stamped by the chair at promotion from the live baseline**; only the DELTA below is this packet's. | §7's predicted delta |
| ⭐ Worker ceiling (v2) | `tests/build/generationWorkerLazy.test.js` | `WORKER_BUNDLE_CEILING_BYTES` | `= 1401128` (`:138`), minted at `91d5f155b` to the EXACT measured bundle — **zero slack**. `resolveConfig.js` is in the worker's 219-module closure and the VALUES leaf joins it, 219 → 220; **the domain leaf and its citation map stay OUT** (P-27a). **Not one worker-closure module has changed since the mint** (P-20d), so the slack is still zero. ⚠ Its dist arms are `describe.runIf(DIST_EXISTS)` (`:327`) — **without `VERIFY_DIST=1` the ceiling arm SILENTLY SKIPS** and the run is a vacuous green; `:321` is the arm that reds when `VERIFY_DIST=1` meets a missing dist. | §7's TEST row; §8 step 9's re-mint |
| ⭐ Engine / data-lazy / first-paint (v2) | `tests/build/vendorPdfLazy.test.js` | the engine + data-lazy + closure arms | ⛔ **READ, NEVER EDITED — not a manifest row** (ruling Q3). engine `< 679_000` (measured 678,131; 869 B margin) — this packet **shrinks** it by 143 B. `DATA_LAZY_RAW_CEILING_BYTES = 3_098_110` over a measured 939,520 — the values leaf's 349 B is inside a ~2.16 MB allowance. The three first-paint budgets are untouched: the eager set is **byte-identical**, 268 modules both sides, under the cure too (P-27d). | §8 step 9.7 READS and QUOTES the engine size; §11 STOPs if the margin is not intact |
| Golden posture | `tests/property/generatorGoldenMaster.test.js` · `tests/property/dossierProseManifest.test.js` | — | Neither appears in §7; the packet moves no value | UNCHANGED; motion is a STOP |

Forbidden alternatives:

- ⛔⛔ **NO `src/generators/**` MODULE MAY IMPORT `src/domain/worldFactOptions.js`.** `resolveConfig.js` imports `src/data/worldFactOptions.js`; the gallery imports the domain address. Measured (P-20g): one path segment changed in the GENERATOR sends `EAGER_FIRST_PAINT_MODULES` 268 → 270 and routes BOTH new files into the eager first-paint chunks (`engine-core` and `data`), charging the three owner-ratified first-paint budgets. This is the FP-G8 / `cultureProfiles` defect that `vite.config.js` already records having had to excise once. ⭐ The gallery edge is SAFE and measured (P-27c,d): `computeEngineSharedDomain()` seeds only from `src/generators`, `galleryUtils.js` is not a first-paint module, and the eager set stays byte-identical at 268 with the gallery importing the domain leaf.
- ⛔ **`WORLD_FACT_SOURCES` MAY NOT MOVE INTO `src/data/worldFactOptions.js`.** Measured (P-27a): that folds the citation map into `resolveConfig`'s import closure and the zero-slack worker's delta goes `+206 B → +634 B` — 428 bytes the generation worker never reads. The split is a priced budget decision under the chair's ruling Q2, not a stylistic one.
- ⛔ **no `TRADE_ACCESS` export, not even empty** — EM-P3b's row (P-22). An empty export would satisfy a walker while answering `[]` to a real caller, which is the vacuous green the estate refuses.
- ⛔ **no second single-source walker** — extend `facetAlignment.test.js`;
- ⛔ **no value, member or ORDER change to any list** — `TERRAIN_WEIGHTS` carries weights whose order feeds `rng.weightedPick` (`resolveConfig.js:112-114`), so a reordering is a generation shift disguised as a move;
- ⛔ **no ceiling RAISED to make room** — the two ceiling files are edited ONLY under §8 step 9, only after a real build attributes the bytes to this packet's own two modules, and only within the §7 bound. `EM-PREAMBLE.md` §P7: *"Never raise a baseline, budget, timeout or ceiling to finish a packet."* The re-mint here is the charter's named conditional act, not a lane's edit, and it STOPS if the attribution shows any third module moved.
- no new top-level `worldState` key; no persisted shape; no flag;
- no edit to `src/data/cultureProfiles.js`, `NAMING_DATA`, either golden, or the census register by hand;
- no files outside the manifest.

## 6. Exact contracts

### Inputs and outputs

⭐ **TWO FILES, TWO JOBS, AND THE SPLIT IS PRICED (ruling Q2).** `src/data/` holds the option
VALUES, because `src/generators` must reach them. `src/domain/` holds the ADDRESS plus the
`WORLD_FACT_SOURCES` INDEX, because the generation worker never reads an index of other modules'
paths and must not carry it.

```js
// src/data/worldFactOptions.js — PURE DATA, VALUES ONLY. No branch, no import from
// src/domain, src/generators or src/components. Frozen at module load.
// ⛔ WORLD_FACT_SOURCES DOES NOT LIVE HERE. It is an index, not an option list, and
//    this module rides into the generation worker with resolveConfig.js, whose
//    ceiling has zero slack (+206 B priced; +634 B if the map moves here).
export const TERRAIN_WEIGHTS = Object.freeze([ /* the SEVEN pairs, verbatim from
  resolveConfig.js:24-27, same members, same order, same weights */ ]);
export const TERRAINS = Object.freeze(TERRAIN_WEIGHTS.map(([t]) => t));
export const CULTURES = Object.freeze([ /* the ELEVEN, verbatim from resolveConfig.js:41-44 */ ]);
```

```js
// src/domain/worldFactOptions.js — the stable domain address, copying
// src/domain/cultureProfiles.js's boundary idiom, PLUS the citation index.
// ⛔ NO src/generators MODULE MAY IMPORT THIS FILE — measured, it puts both files
//    into the eager first-paint closure (§5.2). Generators take the src/data
//    address. Importers here: galleryUtils.js today, EM-A1's card later, and the
//    acceptance test — every one of them lazy.
export { TERRAIN_WEIGHTS, TERRAINS, CULTURES } from '../data/worldFactOptions.js';

/** Citations, not copies: each names the module that owns the vocabulary.
 *  SEVEN keys. Trade access is EM-P3b's row (the charter, 2026-09-19) and is
 *  absent here by ruling, not by omission — A4's named-set arm proves the
 *  difference, and EM-P3b adds the eighth key and moves that arm. */
export const WORLD_FACT_SOURCES = Object.freeze({
  terrain:      'src/data/worldFactOptions.js#TERRAIN_WEIGHTS',
  culture:      'src/data/worldFactOptions.js#CULTURES',
  monsterThreat:'src/data/monsterThreat.js#MONSTER_THREAT_TIERS',
  stressors:    'src/data/stressTypes.js#STRESS_TYPE_MAP',
  resources:    'src/data/resourceData.js#RESOURCE_DATA',
  goods:        'src/data/tradeGoodsData.js#GOODS_CATEGORIES',
  services:     'src/data/institutionServices.js#INSTITUTION_SERVICES',
});
```

```js
// src/generators/steps/resolveConfig.js — the two literals become an import plus a
// re-export under their EXISTING names, so the facet contract, the gallery and the
// corpus helper keep their current import site unchanged.
// ⛔ THE src/data ADDRESS, NEVER THE src/domain ONE.
import { TERRAIN_WEIGHTS, CULTURES } from '../../data/worldFactOptions.js';
export { TERRAIN_WEIGHTS, CULTURES };
```

```js
// src/components/gallery/galleryUtils.js — the gallery reads the DOMAIN address.
// Safe and measured: ENGINE_SHARED_DOMAIN seeds only from src/generators, and this
// module is not in the first-paint closure (P-27c,d).
import { TERRAINS, CULTURES as CANONICAL_CULTURES } from '../../domain/worldFactOptions.js';
export const TERRAIN_OPTIONS = [...TERRAINS];
export const CULTURE_OPTIONS = [...CANONICAL_CULTURES];
```

### Absence rules

- absent from `WORLD_FACT_SOURCES`: **forbidden** — all **seven** keys are required, and A4 asserts both the count AND the exact key set, so a drop cannot hide behind a count that happens to match.
- a `WORLD_FACT_SOURCES` value naming a path that does not exist, or a symbol not present in it: a walker red (A4).
- `TRADE_ACCESS`: **absent, by the charter's ruling (P-22).** Not empty, not placeholder, not declared — absent. EM-P3b mints it.

### Ordering, determinism, lifecycle

- **Order is load-bearing and preserved exactly.** `TERRAIN_WEIGHTS` feeds `rng.weightedPick(terrains, weights)` (`resolveConfig.js:112-114`) and `CULTURES` feeds `rng.pick(CULTURES)` (`:160`): **a reorder moves every random-terrain and random-culture world.** The move copies both arrays verbatim, and A6 proves no golden moved.
- Hash/fork key `NONE`; no rounding; no PRNG in the new modules; no clock, locale or environment read.
- Lifecycle: module load, frozen. Never persisted. Every other column `n/a`.
- Flag: `NONE`. Golden posture: **UNCHANGED**.
- Alignment: `DECLARED EMPTY.` Edit story: `ENGINE-ONLY: this packet moves vocabularies; it exposes no DM verb.`

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/data/worldFactOptions.js` | `TERRAIN_WEIGHTS`, `TERRAINS`, `CULTURES` | `≤ 40` | Pure data, frozen, **VALUES ONLY**. Copy `TERRAIN_WEIGHTS` and `CULTURES` **verbatim, same members, same order**. Import nothing. ⛔ **No `TRADE_ACCESS`** (P-22). ⛔ **No `WORLD_FACT_SOURCES`** — it rides into the zero-slack worker from here (P-27a). |
| `CREATE` | `src/domain/worldFactOptions.js` | the re-export block, `WORLD_FACT_SOURCES` | `≤ 45` | The re-export, with the boundary docblock copied in shape from `src/domain/cultureProfiles.js`, **plus the seven-key citation index**, plus the "no generator may import this" note from §6. |
| `MODIFY` | `src/generators/steps/resolveConfig.js` | `TERRAIN_WEIGHTS`, `CULTURES` | `≤ 6` net | Replace both literals with an import **from `../../data/worldFactOptions.js`** (⛔ never the `src/domain/` address — P-20g) and **re-export both under their existing names**, so every current importer (the facet contract, the gallery, the corpus helper) keeps working unchanged. ⛔ Touch nothing else in this file. |
| `MODIFY` | `src/components/gallery/galleryUtils.js` | `TERRAIN_OPTIONS`, `CULTURE_OPTIONS` | `≤ 6` net | Derive both from **`../../domain/worldFactOptions.js`** instead of spelling them. Keep the exported names — `GallerySidebar.jsx:8,12,83,89` imports them. This is the domain leaf's production importer (P-27c). |
| ⭐ `TEST` | `tests/build/generationWorkerLazy.test.js` | `WORKER_BUNDLE_CEILING_BYTES` | **`≤ 412 B` of growth** | **THE CHARTER'S CEILING ROW (amendment of 2026-09-19).** The worker ceiling has ZERO slack and this packet's two worker-closure modules add a measured **+206 B** minified under the placement cure (P-27a). The bound is that estimate **×2**, stated as an estimate. The constant is re-minted to the EXACT measured bundle by the build lane in §8 step 9, in the form `91d5f155b` used. ⛔ Constant + comment ONLY; no arm added, removed or retitled. **Growth past `1,401,128 + 412 = 1,401,540 B`, or any third module in the attribution, is a STOP.** ⚠ The ceiling arm is behind `describe.runIf(DIST_EXISTS)`; it must be run with `VERIFY_DIST=1` after a real build or it silently skips. |
| ~~`MODIFY` the wizard's option list~~ | — | — | **ROW DROPPED — MEASURED, NOT ASSUMED.** P-9: `git grep -n "'plains'\|'germanic'" -- src/components/generate/ src/components/GenerateWizard.jsx src/components/ConfigurationPanel.jsx` returns **zero lines**. The wizard spells no terrain or culture list of its own; the ruling's "the wizard's lists" are the gallery's, already covered by row 4. A manifest row for a file that does not duplicate is scope this packet does not take. |
| `TEST` | `tests/components/gallery/facetAlignment.test.js` | cases A1–A5 | `n/a` | **EXTEND the existing contract.** Literal titles only; no `.each`, no loop-generated registration, no nested `describe` (`EM-PREAMBLE.md` §P3.4). Every negative assertion carries `// anchored:` on the line immediately above. |

Generated artifacts: `NONE`. **Neither new file is in an edge-shared bundle closure** — the five entry modules are `src/domain/{aiCharter,aiGrounding,aiOutputSchema,intentAtlas}.js` and `src/lib/analyticsEvents.js`, re-measured at the tip (P-18).

No other file may be edited.

**Predicted register moves, priced here rather than discovered at the terminal:**

| Register | Moves? | Predicted delta | Door |
|---|---|---|---|
| Lighting census | **titles ONLY** | ⭐ this packet adds NO test file; it extends one that exists. `CENSUS.files` counts `TEST_FILES` (`:515-518`), so `files`, `parked` and `credited` are **UNCHANGED**, and `suiteTitles` is **+0** (no new `describe`). `titles` moves by **+2** — A4's named-set arm and A7's ceiling arm; A1/A2/A3/A5 are assertions added inside the contract's existing `it(` bodies, and A6 runs a test it does not edit. ⛔ **The absolute tuple is NOT restated here** (it moved under this packet, P-19): the chair stamps the live baseline at promotion and this delta applies to it. | A named interior red on `titles` alone; re-derived whole at the terminal, by the chair |
| Mutation-coverage manifest | **NO** | zero — `tests/components/` is **not** one of the eight `ENFORCER_DIRS` (`tests/lint`, `design`, `docs`, `data`, `copy`, `security`, `edgeFunctions`, `generators`); `facetAlignment.test.js` already exists and still carries no row at the tip; and `tests/build/` is not an enforcer dir either, so the two ceiling rows owe nothing (P-18). ⚠ Re-checked because the manifest itself MOVED between base and tip — it gained exactly one row, EM-P0's `pipelinePinnedMode.test.js`. |
| Writer-reach / observed-shape | **NO** | zero — no settlement field is read. Both new modules are frozen literals with no property access on a settlement object, so the `src/`-wide scan finds no reader to convict. |
| Decision-fork / mechanism-coverage | **NO** | zero — **the mint left this packet.** `TRADE_ACCESS` and both of its obligations (`PACKET_STANDARD.md:297`) travel with EM-P3b (P-22). Nothing here mints a chooser or a pool. |
| ⭐ Bundle ceilings (new in v2) | **YES — the worker, and ONLY the worker** | `WORKER_BUNDLE_CEILING_BYTES` re-mints to the exact measured bundle: **+206 B predicted, `≤ 412 B` bounded** under the placement cure. `vendorPdfLazy.test.js`'s engine (−143 B), data-lazy (+349 B) and first-paint (byte-identical) arms need **no edit and are not a manifest row** — §8 step 9.7 READS and QUOTES the engine size instead, and §11 STOPs if its ~700 B margin is not intact (ruling Q3). | §8 step 9: a real `npm run build` through the exclusive mutex + the kit's per-module attribution, in the form `91d5f155b` used, under the standing conditional ruling |
| Prose-numerics · size-baseline · edge-shared | **NO** | zero |

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch. **Re-run P-9's command**; if the wizard has since grown a list, that is a STOP and a re-compile, not a quiet sixth row.
1. Capture the baseline: run `facetAlignment.test.js` green at the base and record its count, so the extension's delta is visible.
2. Add the failing arms for A1–A5.
3. Create `src/data/worldFactOptions.js` with both arrays copied verbatim — **VALUES ONLY, no citation map**.
4. Create `src/domain/worldFactOptions.js`: the re-export **plus** the SEVEN-key `WORLD_FACT_SOURCES`.
5. Re-point `resolveConfig.js` at the **`src/data/`** address, then `galleryUtils.js` at the **`src/domain/`** address. ⛔ Not the other way round — §5.2's first two forbidden alternatives. (No wizard row — P-9.)
6. No registration is owed (§7 table).
7. Run focused verification (§10), including the golden proof A6.
8. ⭐ **THE CEILING STEP — the charter's named act, and the reason this packet carries a ceiling TEST row.**
   1. `npm run build` **through the exclusive mutex**, on this packet's own tip, and again as a CONTROL at the verified base in its own detached worktree with `npm ci` from the committed lockfile. Both builds the same way: the kit's attribution wrapper reads main-graph chunks a constant 742 B low, so a control built differently would compare two instruments (the note `91d5f155b` records).
   2. Run the kit's per-module attribution (`tools/attrib.config.mjs`, per-module RENDERED lengths) over BOTH builds and sweep every emitted chunk.
   3. ⛔ **The attribution must show ONLY this packet's own modules moved** — `src/generators/steps/resolveConfig.js` (down) and `src/data/worldFactOptions.js` (new). `src/domain/worldFactOptions.js` and `galleryUtils.js` must NOT appear in the worker's attribution at all; if either does, the placement cure has failed and that is a **STOP**. A third module with a moved rendered length anywhere is a **STOP for the chair**, not a bigger re-mint.
   4. Check the growth against §7's bound (`≤ 412 B`; predicted +206 B). Over the bound is a **STOP**.
   5. Re-mint `WORKER_BUNDLE_CEILING_BYTES` to the EXACT measured bundle — zero slack, as every mint before it — with a dated attribution comment in the form `91d5f155b` used: **W-before, W-after, the delta, and the moved modules with their rendered lengths at both ends**, the module count at both ends, and what the bytes ARE.
      ⭐ **THE RISE RIDES THE STANDING CONDITIONAL RULING** (ODQ §934.19 addendum 2 and the charter's amendment of 2026-09-19): a real `npm run build`, the per-module attribution showing ONLY this packet's modules moved, and growth inside the packet's priced bound TOGETHER authorise the lane to re-mint. **The lane re-mints; the chair records the measured figures in the ODQ as a named, vetoable rise at the landing.** The lane does not seek a fresh ruling and does not raise anything beyond the measurement.
   6. **Prove the arm is not vacuous:** set the constant to the measured value minus 1, confirm it reds with the printed figure, restore it, re-run green. `91d5f155b` did exactly this.
   7. ⛔ **READ, DO NOT EDIT, `tests/build/vendorPdfLazy.test.js`** (ruling Q3). From the same build, **read and QUOTE the emitted `engine-<hash>.js` size** and check it against the live `expect(size).toBeLessThan(679_000)` with the ~700 B cross-environment margin the four prior raises carried intact (i.e. `size + 700 < 679_000`). Predicted: a 143 B **shrink** from 678,131. **If it is not under that bound with the margin intact, STOP for the chair — no edit.** Quote the data-lazy and first-paint arms' results too; they are predicted green untouched.
   8. `VERIFY_DIST=1` on `generationWorkerLazy.test.js` and `vendorPdfLazy.test.js` after the restore, and `npx eslint` on the one edited file. ⚠ **Without `VERIFY_DIST=1` the dist arms are `describe.runIf(DIST_EXISTS)` and silently skip** — a run with no printed count for the ceiling arm DID NOT PROVE IT.
9. Write the completion receipt, quoting **W-before, W-after, the delta, the moved modules, and the engine size read**.

Bounded algorithm (the single-source arm):

```text
1. Import the canonical home and every re-exporting module.
2. For each of terrain and culture: assert the canonical array and EVERY live
   spelling are equal AS ARRAYS — same members AND same order, both directions.
   Never a superset test where an equality is available.
3. For each WORLD_FACT_SOURCES entry: assert the path exists and the symbol is
   present verbatim in it.
4. Assert WORLD_FACT_SOURCES' key set equals the SEVEN named facts exactly
   (terrain, culture, monsterThreat, stressors, resources, goods, services) —
   the named set, not just the count, so a drop cannot hide behind a
   coincidental total. Trade access is EM-P3b's and is asserted ABSENT, with
   the charter cited in the failure message so the next reader learns why.
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behaviour — one source | the canonical home and every re-exporter | terrain and culture are equal AS ARRAYS (members AND order) across every live spelling, both directions | `tests/components/gallery/facetAlignment.test.js` |
| A2 | The existing arms still hold | `CULTURE_OPTIONS`, `CULTURES`, `NAMING_DATA` | the three pre-existing culture assertions (`:75`, `:76`, `:86`) pass unchanged against the new source | same |
| A3 | Counterforce — GUARD-THE-GUARD | a planted extra member in `galleryUtils.js`'s derived list | A1 REDS, naming the fact and the divergent member | same |
| A4 | The citation map is honest | `WORLD_FACT_SOURCES`, imported from `src/domain/worldFactOptions.js` | the key set equals the SEVEN named facts exactly; `tradeAccess` is ABSENT, the failure message carrying the one-line note *"trade access is EM-P3b's row (the charter, 2026-09-19); EM-P3b adds the eighth key and moves this arm"*; every path exists; every symbol is present verbatim in its file | same |
| A5 | Order is load-bearing | `TERRAIN_WEIGHTS` | the weights array is equal element-for-element to the pre-move literal, with the reason in the failure message (`rng.weightedPick` reads position) | same |
| A6 | ⭐ Identity / golden | the 525-row corpus | `generatorGoldenMaster` and `dossierProseManifest` **do not move** — the packet relocates values and changes none | `tests/property/generatorGoldenMaster.test.js` (run, not edited) |
| A7 | ⭐ The worker ceiling is re-minted to a MEASURED figure, and the arm still bites | the dist build of §8 step 9 | `WORKER_BUNDLE_CEILING_BYTES` equals the bundle's measured size EXACTLY (zero slack); the constant minus 1 REDS with the printed byte figure and is restored; the attribution names only `src/generators/steps/resolveConfig.js` and `src/data/worldFactOptions.js`, and **neither the domain leaf nor `galleryUtils.js` appears in the worker at all** | `tests/build/generationWorkerLazy.test.js` (the re-minted arm, run under `VERIFY_DIST=1` — it skips without it) |

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

# ⭐ THE CEILING STEP (§8 step 9). The build takes the EXCLUSIVE mutex itself; do not
# wrap it in the shared tier, and do not run it until everything above is green.
npm run build                 # this tip, and a CONTROL build at the verified base
                              # in its own detached worktree, npm ci from the lockfile
node tools/attrib.config.mjs  # the chair kit's per-module rendered-length attribution,
                              # swept over EVERY emitted chunk, both builds

# ⛔ VERIFY_DIST=1 IS LOAD-BEARING, NOT DECORATION. Both files' dist arms are
#    describe.runIf(DIST_EXISTS) (generationWorkerLazy.test.js:327): without it the
#    ceiling arm SILENTLY SKIPS and the green means nothing.
# ⭐ HOW THE ENV REACHES THE GATE. The manifest's `checks` are argv arrays spawned
#    with `shell: false` (implementation-gate.mjs:186-194), so no row can carry an
#    env assignment — and none in the estate does (argv[0] across all 842 declared
#    checks is only npx / npm / node / bash). The same spawn takes `env = process.env`,
#    so the build lane EXPORTS VERIFY_DIST=1 in the shell that runs the gate, and the
#    manifest's tests/build row then runs with the dist arms live. This line is the
#    authority; the receipt must print the ceiling arm's own test count.
VERIFY_DIST=1 GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/build/generationWorkerLazy.test.js \
  tests/build/vendorPdfLazy.test.js --maxWorkers=2
npx eslint tests/build/generationWorkerLazy.test.js      # the ONLY edited ceiling file
```

Expected: **every command exits `0`.** ⛔ This packet has NO named red except the lighting census's `titles +2` delta (§7) and the ONE deliberate, restored red of A7's monotone proof. **`UPDATE_GOLDEN` is never set** — a golden that moves here is a STOP, because a move that changes a value is not a move. A gate line with no printed test count DID NOT RUN (`gate-mutex.sh` gives up after its poll budget and exits `0`).

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if: either golden moves; any list's members or ORDER change; a second single-source walker appears necessary; `resolveConfig.js` needs an edit outside its two literals; `WORLD_FACT_SOURCES` would name a path that does not exist; **a `src/generators/**` module would import `src/domain/worldFactOptions.js`**; **`WORLD_FACT_SOURCES` would move into `src/data/worldFactOptions.js`**; **the attribution shows any module but this packet's own two moving a rendered byte, or shows the domain leaf or `galleryUtils.js` inside the worker at all**; **the worker's growth exceeds §7's `412 B` bound**; **the emitted `engine-<hash>.js` is not under `679_000` with ~700 B of margin intact** (READ and quoted, never edited — ruling Q3); **the data-lazy or first-paint arms move against §7's prediction**; or **the ceiling arm reports no test count** (it skipped for want of `VERIFY_DIST=1`).

---

### ✅ STOP-1 — RESOLVED BY THE CHAIR AT THE TIP. TRADE ACCESS IS EM-P3b's WHOLE ROW.

Version 1 measured (P-4) that the trade-access vocabulary exists only as scattered pools and tables — `TERRAIN_ROUTE_POOLS` (module-local, seven per-terrain arrays), two inline literal pools at `resolveConfig.js:131-133`, `getTerrainType`'s route table, and the gallery's own facet list. Observable members: `road`, `crossroads`, `river`, `port`, `isolated`, plus the config-only tokens `random_trade`, `none` and `mountain_pass` — the last of which the golden corpus records as *"the panel's seventh option. No route pool rolls it."* Minting it would be a NEW VOCABULARY carrying `PACKET_STANDARD.md:297`'s two estate-wide obligations, and a membership question (five rollable routes, or all eight?) that a lane may not decide. Version 1 therefore offered the chair two dispositions and refused to choose between them.

⭐ **The chair chose a third, and it is landed in the charter at `a41a0e109`** (P-22, quoted in §1 items 2 and 2c): the EM-P3 row now reads *"as measured: two moves, four citations; **trade access → EM-P3b**"*, and EM-P3b *"gets its one list (`TRADE_ACCESS`, minted with its decision-fork row and its mechanism-coverage row) and the world-facts card declares it."*

**Disposition, applied in version 2:** `TRADE_ACCESS` is exported **nowhere** in this packet — not as a placeholder, not empty, not declared. `WORLD_FACT_SOURCES` carries seven keys and A4 asserts the named set plus `tradeAccess`'s absence, so the omission is a pinned fact rather than a silent gap. Both mint obligations travel with EM-P3b. **This packet no longer mints anything, and its STOP-1 is closed.** ⚠ Recorded for the chair's veto: if the chair would rather EM-P3 carry an eighth placeholder key, that reverses one line of §6, one arm of A4 and one row of §7, and adds ~55 B to the worker's priced delta.

### ✅ STOP-2 — RESOLVED. THE CHAIR TOOK THE PLACEMENT CURE, AND IT IS MEASURED.

Version 2's first draft put `WORLD_FACT_SOURCES` beside the option lists in `src/data/`, and the lane measured that this cost **+634 B** into a ZERO-SLACK worker — of which the values actually MOVED accounted for ~0 (they merely relocate), while the citation map, **which the generation worker never reads**, accounted for nearly all of it.

**The chair ruled (Q2, 2026-09-19):** *"a citation map is an INDEX of where the other option lists live, not an option list. 'One home' is the law for option VALUES … the citation map belongs where its only readers are — the domain-reachable leaf this packet already CREATEs — so it never enters `resolveConfig`'s import closure."* The estate's own statement of the rule is `vite.config.js`'s det-math note: ***"THE CURE IS THE PLACEMENT, NEVER THE CEILING."***

**Measured under the cure (P-27), all four budgets:**

| budget | under the cure | vs the rejected alternative |
|---|---|---|
| generation worker (zero slack) | **+206 B** (closure 219 → 220; the domain leaf is OUT) | +634 B — **428 B saved** |
| lazy engine (`< 679_000`) | **−143 B**, a shrink | same |
| data-lazy (~2.16 MB allowance) | **+349 B** | +777 B |
| ⛔ first paint (three owner-ratified budgets) | **BYTE-IDENTICAL — 268 modules, `diff` empty** | byte-identical |

**Rejected alternative, recorded:** the citation map beside the lists — **+634 B into a zero-slack worker for bytes the worker never reads.** Pinned as a forbidden alternative in §5.2 so it cannot drift back.

**The gate the chair set was (d), and it holds.** The domain leaf now carries data and imports the data module — the shape of the pinned hazard — so the lane proved its importers: exactly two production references exist (`galleryUtils.js` → the domain leaf; `resolveConfig.js` → the data leaf), **no `src/generators` module imports the domain leaf**, so `computeEngineSharedDomain()` is not seeded, and every importer is measured **lazy**. The eager set is byte-identical at 268.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the next wave.

## 12. Completion receipt

⭐ **THE COMPLETION COMMIT NAMES EXACTLY THESE SIX PATHS AND NO OTHER.** `git show --stat HEAD` must list these, all six, nothing more — the estate's ledger-checkout hazard is that a commit without a pathspec sweeps stale deletions in, so the commit is made with an explicit pathspec and the stat is read back before the receipt is written:

```
src/data/worldFactOptions.js                   (CREATE)
src/domain/worldFactOptions.js                 (CREATE)
src/generators/steps/resolveConfig.js          (MODIFY)
src/components/gallery/galleryUtils.js         (MODIFY)
tests/components/gallery/facetAlignment.test.js (TEST)
tests/build/generationWorkerLazy.test.js       (TEST — the ceiling constant + its comment)
```

⛔ `tests/build/vendorPdfLazy.test.js` is **READ and quoted, never staged** (ruling Q3). Its appearance in the stat is a STOP.

- Base SHA: `4928be0ab7210dff47429af788670f80947d36ad` (stamped by the chair at promotion).
- ⭐ **The worker rise, quoted:** W-before `______` B · W-after `______` B · delta `______` B (bound 412 B) · modules moved `src/generators/steps/resolveConfig.js` `_____ → _____`, `src/data/worldFactOptions.js` `new → _____` · module count at both ends `_____` · the emitted `engine-<hash>.js` read at `______` B against `< 679_000` with margin intact. **The rise rides the standing conditional ruling (ODQ §934.19 addendum 2 + the charter's amendment): the real build, the attribution showing only this packet's modules, and growth inside the priced bound authorise the lane's re-mint; the chair records these measured figures in the ODQ as a named, vetoable rise at the landing.**
- Dispatch bundle and seal identity: **NOT DISPATCHED** — status DRAFT; compiled at `d31af2cee`, pre-proved at `a41a0e109`.
- Final commit or working-tree state: **no edit made in any tree.** The compile lane wrote only under `$SP/lane-em-a-scratch/`; the pre-proof lane only under `$SP/lane-preproof-EM-P3-scratch/`.
- Exact changed files and effective-line deltas: `NONE`.
- Acceptance cases: `0 of 7 executed`.
- Focused commands, exits, and counts: **no vitest, eslint, `npm run check`, build or writing script was run by either lane.** Every measurement command and its output is in `EM-P3.evidence.md` (P-1…P-14 at the base; P-15…P-24 at the tip).
- Both typecheck configurations: `n/a`.
- Base-versus-wave failure identity diff: `n/a`.
- Dormancy/golden result: `n/a` — DECLARED UNCHANGED for the eventual build, proved by A6.
- Generated artifacts: `NONE`
- Deviations: **§11 STOP-1 is RESOLVED** by the chair's landed charter ruling (trade access → EM-P3b). **§11 STOP-2 is RESOLVED** by the chair's ruling Q2 — the placement cure is taken and measured (worker +634 B → **+206 B**; first paint byte-identical). Both applied in version 2; neither is open.
- Out-of-scope observations, without investigation:
  1. **Five of the seven world facts never needed this packet** — stressors, resources, goods and services already have exactly one canonical `src/data/` home each, and trade access has none to move (§5.1). Their rows are citations, and saying so keeps a later lane from "moving" a list that is already single.
  2. `tests/helpers/goldenMasterCorpus.js` carries a fourth terrain spelling in a TEST helper. It is out of this packet's manifest deliberately — a test helper is not production duplication — but it will drift the day terrain changes, and the walker cannot see it.
  3. `mountain_pass` is a selectable trade-route option that **no route pool rolls** (the golden corpus's own comment). Named, not investigated; EM-P3b inherits it.
  4. `resolveConfig.js`'s two exports already carry the comment *"Exported for the gallery facet-alignment contract"* — the estate had already recognised this duplication and solved half of it with a contract test rather than a source. This packet finishes that move.
  5. ⭐ **The facet-alignment contract already pins TERRAIN both directions too** (`:58-59`), not just culture as version 1's §5.2 implied. The A1 extension is an equality upgrade of arms that exist, which is why its `titles` delta is +2 and not +5.
  6. ⭐ **`src/domain/worldFactOptions.js` gains a real production importer under the cure** — `galleryUtils.js` (P-27c). Version 2's first draft left it with none; the chair's Q2 placement gives the domain address both a job (the citation index) and a reader.
  7. ⚠ **The two ceiling files' dist arms are `describe.runIf(DIST_EXISTS)`.** A focused run without `VERIFY_DIST=1` skips the ceiling arm and prints green. Named in §10 and §11; it is the vacuous-green class the estate refuses.
- Judgment calls (pre-proof lane, each vetoable):
  1. **Applied the charter's landed STOP-1 ruling** rather than re-asking it: `TRADE_ACCESS` removed entirely, seven citation keys, A4 asserts the named set AND `tradeAccess`'s absence with EM-P3b named in the message.
  2. **Took the chair's placement cure (Q2) and proved gate (d) before applying it** — the eager first-paint set is byte-identical at 268 with the gallery importing the domain leaf, and no `src/generators` module imports it, so `ENGINE_SHARED_DOMAIN` is not seeded (P-27).
  3. **Bounded the worker growth at `412 B`** = the measured `+206 B` esbuild per-module estimate ×2, per the pre-proof brief's rule. It is an ESTIMATE from per-file minification, not a build; the build lane's real figure governs, and anything past the bound STOPS.
  4. **Dropped `vendorPdfLazy.test.js` from the manifest (Q3)** and replaced it with §8 step 9.7's READ-and-quote plus a §11 STOP, so the landing's "exactly six paths" receipt is unambiguous.
