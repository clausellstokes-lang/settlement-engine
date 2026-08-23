# Town cartography / MF-T2N — the resource LOCATION deriver: `deriveResourceSites` sites every entry a settlement already carries in `config.nearbyResources` as a typed `{ resource, bearing, band, terrainAnchor, sourceKind }` record from stored facts alone, stores nothing, and lands dark

- **Status:** READY
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `84e06412f6fdca91020197f2a332ba7f98642f64`
  — the MF-T2H landing, read with `git rev-parse` at the lane's opening and re-read at every
  proof below. Every figure in this packet was executed at THIS base by the implementing lane
  TE-T2N; nothing is inherited from the compile (`draft-PRODUCERS-PLAN.md`, pinned to
  `1a437bca`) except where a row says so and names the re-derivation. ⚠ The compile's census
  figure (`titles: 20719`) was STALE at this base and is re-derived in the census note.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Charter and rulings:** `draft-PRODUCERS-PLAN.md` §3 (this member), §§1–2 (the measured
  substrate and the three lawful shapes), §8 (execution law), §9 (STOP set), §10–§11
  (judgments, RAISED). Ruled at **ODQ §433** (C1–C6 signed, J1–J8 ratified; TE-T2N dispatched
  at §444 at the seat TE-T2R freed). **ODQ §443** binds this member as law: a new reader of a
  PULSE-written settlement key reds `tests/lint/observedShapeReaders.walker.test.js`; every key
  this leaf reads is GENERATION-written and observed, PROVED by that walker at the base and at
  the member tip (§3 row 17).
- **Depends on:** nothing non-terminal. The member reads the LANDED native resource table
  (`src/data/resourceData.js`), the LANDED terrain table (`src/data/geographyData.js`), the
  LANDED closed resource-type vocabulary (`src/domain/resourceSemantics.js`, pinned by
  `tests/domain/resourceTaxonomyClassification.test.js`) and the LANDED slug helper
  (`src/domain/worldPulse/stablePart.js`). MF-T2Q and MF-T2R are siblings on the same producer
  train with no symbol dependency either way (charter J8: R → Q → N is a weak landing
  preference, not an order of need).
- **Binds forward:** the content-train consumer car that will speak these facts (ODQ §433 C3:
  producers land DARK; the dossier pool is record-gated, the CT-1a pattern) and the later port
  tranche's fabric siting read (charter §3 "Consumer decision"). Both import
  `src/domain/resourceSites.js`; neither may re-derive a site.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the
  file at `84e06412` by this lane (`shasum -a 256`) and identical to the value the charter
  and MF-T2R carry, so no re-stamp occurred in the window. Its §P2 hazard dispositions, §P3
  anchor preflight, §P5 census law, §P6 mutant hygiene, §P7 STOP set and §P8 capsule law bind
  this packet and are not restated. **Stamp: GRANTED at ODQ §312.2b** — the stamped column
  applies (eight members per engine train; this train has three).
- **Collision group:** `producers` (the §433 train). At this base the manifest holds **149
  packets, 148 terminal and ONE non-terminal** (re-counted by execution: `valid: 149 packets
  (1 READY)` before this packet was added) — **MF-T2H is still READY** although its code is the
  very commit this base names; its flip to LANDED is the chair's pending act. MF-T2H RESERVES
  `tests/lint/sovereigntyLightingContract.walker.test.js` (a `MODIFY` row) and
  `tests/lint/entropyRootCensus.walker.test.js`; it names neither of this member's paths nor
  `PACKET_MANIFEST.json`. The two delivered paths and this packet's own path are held by NO
  packet. The shared census path is therefore NOT FREE at this base, and this packet does NOT
  reserve it (§417's T2J shape: the row rides this packet verbatim for the chair's landing act;
  see the census note) — which is exactly why the T2J shape exists. ⚠ This packet lists NO `DOC` row
  for `docs/implementation/PACKET_MANIFEST.json` (the MF-T2Q shape, J-TET2N-7): a non-terminal
  packet reserves every change path it names, and MF-T2R's READY row names the manifest — two
  READY siblings naming it in one tree would red `validate:packets` at the landing slot.
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves
  the branch. This lane moved no ref. Both commits ran with hooks ON; the pre-commit
  `eslint --fix` changed nothing (the committed leaf blob equals the blob every proof ran
  against — §3 row 18).

> **`censusAuthorization`:** this packet moves the test census by
> **`+1 files / +0 parked / +1 credited / +6 titles / +1 suiteTitles`** — exactly the charter's
> predicted `+1 / 0 / +1 / +6 / +1`. **Base tuple, RE-DERIVED at `84e06412`:
> `2499 / 364 / 2135 / 20729 / 5787`** (the charter's `20719`-vs-`20729` staleness named, not
> absorbed — H8B's Cure 1b and MF-T2H each moved it since the compile). **After tuple, read from
> the walker's own failure message figure by figure and then CONFIRMED by a full green pass
> (33/33) with the row applied: `2500 / 364 / 2136 / 20735 / 5788`.** ONE new acceptance file,
> `tests/domain/resourceSites.test.js`, credited (one literal `describe`, six straight-line
> `it`, no `.each`/`runIf`/nesting). Its authorizing decisions are **ODQ §306.4(a)** (the
> dossier-surface batch adopted as W8 prerequisites), **§421(2)** (the producer train's
> dispatch) and **§433** (this member's charter ruling). The family's stamp is **GRANTED** at
> ODQ §312.2b.
>
> ⛔ **THE ROW IS DEFERRED TO THE LANDING ACT (ODQ §417, the T2J shape, J-TET2J-1).** The walker
> edit was made, proved green, and then REVERTED ON PURPOSE at the member commit: the row is
> inserted by the chair's landing act at the train terminal, so the census arm of
> `sovereigntyLightingContract.walker` REDS at this member's tip — **that is the ONE NAMED
> interior red (charter §6 / preamble §P7.12), not a defect.** No other red stands at this tip
> (§9). The exact text to paste, replacing the `files: … suiteTitles: …` line inside the
> `CENSUS` object (at `:5274` at this base), is:
>
> ```
>     // ── RE-RECORDED 2026-08-23 BY TE-T2N (MF-T2N), CAUSE ATTRIBUTED ──────────
>     // `files` 2499 → 2500, `credited` 2135 → 2136, `titles` 20,729 → 20,735,
>     // `suiteTitles` 5,787 → 5,788. `parked` is UNCHANGED at 364.
>     // ONE new acceptance file, tests/domain/resourceSites.test.js, credited (one literal
>     // `describe`, straight-line `it`, no `.each`/`runIf`/nesting) carrying SIX arms —
>     //   ⭐ guard-the-guard, then totality: every roster entry on a real settlement sites once
>     //   ⭐ the determinism companion: two derivations at distance; no wall-clock or rng reachable
>     //   ⭐ the §306.2 counterfactual reach: one stored input moved, the site moves accordingly
>     //   ⭐ refusal: an absent resource yields no site; a malformed roster yields []
>     //   ⭐ golden inertness by construction: nothing under src/ imports the leaf; nothing stored
>     //   ⭐ version discipline: DERIVED_V1 on every record; keys and vocabularies asserted exact
>     // `censusAuthorization`: ODQ §306.4(a) (the dossier-surface batch adopted as W8
>     // prerequisites), §421(2) (the producer train's dispatch), §433 (this member's charter
>     // ruling, C1-C6 signed).
>     // ⛔ ATTRIBUTED BY ISOLATION, NOT BY ARITHMETIC, at THIS base. The tuple was read from
>     //   the arm's own failure message at each step ("expected 2500 to be 2499"), never
>     //   computed; with the walker pinned at the after tuple, hiding the one new file convicted
>     //   `files` at 2499 — the base figure exactly. No other lane's file moved.
>     files: 2500, parked: 364, credited: 2136, titles: 20735, suiteTitles: 5788,
> ```
>
> ⚠ The chair re-derives the BASE tuple at the terminal before pasting: sibling members on the
> same train each move it by their own declared delta (sum-of-deltas at the terminal, §433.1's
> T2M note; MF-T2R declares `+1/0/+1/+7/+1`, MF-T2Q `+1/0/+1/+7/+1`), and the tuple is never
> carried across a rebase (the rebase-slot law).

> **Delivered files, hashed from their COMMITTED blobs at the member tip** (`git show HEAD:<path>
> | shasum -a 256`), and their effective lines under eslint `max-lines`
> `{ skipBlankLines, skipComments }` measured with eslint's own `Linter`:
>
> | file | action | SHA-256 (committed blob) | effective lines |
> |---|---|---|---:|
> | `src/domain/resourceSites.js` | CREATE | `271fe8705958dabc0aa1442d48d625b6b5b15b61d78f19a0d81ee5354b5661f6` | **89** of 250 (charter predicted ~110–140) |
> | `tests/domain/resourceSites.test.js` | CREATE | `499f645097f1e99f8865f2f96d630d6061e6f5ec4429655b9a956e995ae05c93` | 177 (test; not a production budget) |
>
> Neither path exists at `84e06412` (`git ls-tree 84e06412 -- <path>` is empty for both and for
> this packet's own path), so the member collides with nothing it creates.
> **Existing logic modified: 0. Coupling census: 0.** `git show --stat` of the member commit
> is two CREATEs and zero modified files — the charter's §3 manifest ("Existing logic modified:
> 0") executed.

---

## §0 · WHAT THIS MEMBER IS, AND WHAT IT REFUSES

One Shape-1 pure deriver at the `src/domain/` root (the `ageBands.js` precedent; charter §2,
J2 ratified at §433 C2) and one acceptance file:

1. **`src/domain/resourceSites.js` — `deriveResourceSites(settlement) → ResourceSite[]`.** For
   every string entry in `config.nearbyResources` (the roster `resolveResources.js` writes
   back at generation) it derives one record `{ resource, bearing, band, terrainAnchor,
   sourceKind: 'DERIVED_V1' }` from stored facts alone: the seed-stable `id`, the roster, the
   settlement's `config.terrainType`, and the native resource and terrain tables. Every field
   is a closed vocabulary (FINITE-SEMANTICS); there is no free number and no tuning constant.
2. **Nothing is stored, nothing imports the leaf.** The generator writes no site; the golden
   manifest is bytewise identical before and after the member (§3 row 7); acceptance arm 5
   pins the MECHANISM — no file under `src/` imports the leaf, a generated settlement's JSON
   never mentions a site, and deriving leaves the settlement byte-identical.
3. **The rules are frozen v1.** `sourceKind: 'DERIVED_V1'` rides in every record; changing the
   wind count, the admissible band sets, the anchor precedence or the hash is a DECLARED SHIFT
   by construction and mints a v2 kind (leaf header).

**IT REFUSES** to invent. A resource absent from the roster yields no site (WF-1A's refusal
discipline; mutant m3 holds the line); a malformed, empty or non-array roster yields `[]` and
never a throw; a non-string entry yields no site; depletion is NOT read (a worked-out seam still
sits where it sits — location is not condition; the dossier joins by key to
`nativeResourceConditionRecords`). It mints no registry verb, flag, persisted field, spatial
ledger row, coupling-census row, barrel export or consumer wiring; it touches no
`src/generators/**` or `src/data/**` path; it writes nothing at generation (Shape 3 is
owner-docketed at charter O1). It does not build the dossier pool that speaks it (ODQ §433 C3,
content train) or the fabric siting read (the port tranche).

## §1 · THE DERIVER'S CONTRACT

### §1.1 Inputs, outputs, totality

`deriveResourceSites(settlement: ResourceSiteInput | null | undefined): ResourceSite[]`. TOTAL:
`null`, `undefined`, a non-object, a missing or `null` `config`, a non-array or empty roster
all yield `[]`. Each roster entry is narrowed in-body (non-empty string, else skipped); a
duplicate collapses to its first occurrence; output order is the roster's own stored order (the
stored order is the fact — no sort is introduced). No `Date`, no `Math.random`, no `Intl`, no
I/O, no store, no mutation of the input (arm 5 pins the last). The record:

| field | vocabulary | derivation |
|---|---|---|
| `resource` | the roster entry, verbatim | — |
| `bearing` | `RESOURCE_SITE_BEARINGS` = `N NE E SE S SW W NW` (EIGHT winds, clockwise) | `WINDS[hash(identity\|slug) % 8]` — a uniform modular pick, the spatial octant idiom (`spatialSubstrateRead.approachOctant` is `hash32(key) % 8`) |
| `band` | `RESOURCE_SITE_BANDS` = `AT_HAND NEAR DAYS_REACH` (nearest first) | `ADMISSIBLE[type][hash(identity\|slug\|band) % ADMISSIBLE[type].length]` — a uniform pick WITHIN the set the resource's closed semantic type admits (§1.2) |
| `terrainAnchor` | `RESOURCE_SITE_TERRAIN_ANCHORS` = the seven `TERRAIN_DATA` keys + `UNANCHORED` | the resource's OWN single terrain tie first, else the settlement's `config.terrainType` when it is a terrain key, else the typed gap `UNANCHORED` (§1.3) |
| `sourceKind` | `'DERIVED_V1'` | the frozen derivation version |

**identity** = `settlement.id` when a non-empty string, else `settlement.name`, else
`stablePart`'s own `'unknown'`. `id` is minted by `normalizeSettlement` as `idFromSeed(_seed)`
at `assembleSettlement` (S0: seed-stable, `s_<16hex>`, identical on same-seed regeneration), so
a RENAME never moves a site and a different seed is a different world (J-TET2N-1). **slug** =
`stablePart(resource)` (the worldPulse slug leaf, imported — J-TET2N-3). **hash** = FNV-1a
32-bit followed by Murmur3's fmix32 avalanche, restated locally as the estate's pure leaves do
(`heraldCausalGrammar.js`, `spatialSubstrateRead.js`, `eventProse.js`); measured over 1,044
real sites the octants fall 117–140 each and the three bands 326–369 — flat.

### §1.2 The band law: type-bounded admissible sets, the seed picks within

`RESOURCE_SEMANTICS.type` (`resourceSemantics.js`) is the estate's closed five-value resource
vocabulary — `positional | infrastructure | renewable | exhaustible | magical` — pinned
exhaustively by `resourceTaxonomyClassification.test.js`. The leaf maps each type to the bands
it ADMITS, and the hash picks within:

| type | admits | why |
|---|---|---|
| `positional` (deep harbour, crossroads, defended pass, hot springs, oasis) | `AT_HAND` | the settlement OCCUPIES it |
| `infrastructure` (mill sites) | `AT_HAND` | built at the settlement's own water |
| `renewable` (fields, pasture, forest, fisheries, marsh, palms, herds) | `AT_HAND NEAR` | the working hinterland |
| `exhaustible` (seams, quarries, clay, salt, sand, ruins) | `NEAR DAYS_REACH` | worked from a distance |
| `magical` (the node) | `NEAR DAYS_REACH` | as a seam |
| `UNTYPED` (a custom resource the native table does not know, after `resourceKeyForLabel` alias resolution) | all three | the deriver knows nothing about it and constrains nothing |

This is a grammar table (closed type → closed set), not a dial: no threshold, no weight, no
number appears anywhere in the derivation. Charter O3 flags the siting vocabulary for the
owner's visibility; this lane's position is the compile's — closed buckets with no numeric
tuning are structural vocabulary. Measured over 63 worlds: positional sites `AT_HAND` 58/58,
exhaustible sites `AT_HAND` 0/101 (J-TET2N-4 records the two rejected alternatives).

### §1.3 The anchor law: the resource's own tie outranks the settlement's terrain

`RESOURCE_DATA` carries a single terrain tie for sixteen native keys — `terrain: 'desert' |
'mountain'` on the eight terrain-specific resources, and a one-element `terrainRequired`
(`coastal` or `riverside`) on the eight water-bound ones — which is a stored DATA fact about
where that resource sits. It leads. `salt_flats` (two ties) and the seventeen tie-less keys sit
in the settlement's own terrain family (`config.terrainType`, one of the seven `TERRAIN_DATA`
keys on 210/210 generated worlds). When neither names a terrain the site carries the typed gap
`UNANCHORED` rather than a guessed family (the MF-T2R precedent: typed, never silent). On a
real generated settlement the gap never fires (arm 1 pins it, anchored by arm 4 producing it).

## §2 · S0, MEASURED BEFORE THE FIRST EDIT (charter §3 S0 (a)–(d))

| # | question | finding |
|---|---|---|
| (a) | a seed-stable identity input exists on the settlement? | **YES — `settlement.id`**, `s_<16hex>` from `idFromSeed(_seed)` (`normalizeSettlement.js:191`, `_seed` attached at `assembleSettlement.js:271`), identical on same-seed regeneration (`true`); `name` also present. 210/210 real settlements (5 seeds × 6 tiers × 7 terrains), zero missing. No STOP |
| (b) | `config.nearbyResources` element shape at this base? | flat `string[]` of native keys (`resolveResources.js:506` write-back; custom resources join as their NAME, `:300`); schema `settlement.schema.js:112`. Across 210 worlds: all 33 native keys observed, 0 non-string elements, 0 keys outside `RESOURCE_SEMANTICS`. `config.terrainType` is a `TERRAIN_DATA` key on 210/210 (`resolveConfig.js:180`) |
| (c) | `stablePart` import vs local restatement, on chunk evidence? | `stablePart` is a SLUG helper (not a hash — the charter's phrase is a misnomer) with ZERO imports; eight domain-root leaves already import from `./worldPulse/`. `dist/` is ABSENT in this worktree and the chair baseproof, so chunk membership cannot be read from a build; the STATIC evidence decides: its closure is itself alone and this leaf has no importer at landing, so it joins no chunk. **IMPORTED.** The hash is RESTATED locally (the estate's documented idiom for pure leaves) |
| (d) | generator golden BEFORE and AFTER? | `tests/fixtures/generator-golden-master.json` SHA-256 `29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8` before the first edit and identical at the member tip; the focused test 3/3 green both times (§3 row 7) |
| (e) | the observed-shape reader walker at base (§443 law)? | GREEN; composition `violations: 0 stale: 0`, A1/A7 `387 / 1409 / 1995`; the corpus's `config` shape carries `nearbyResources` and `terrainType`, the `settlement` shape carries `config`, `id`, `name` — every key the leaf reads is observed-written |
| (f) | the census tuple at base, from the walker's own messages? | `2499 / 364 / 2135 / 20729 / 5787`; predicted `+1/0/+1/+6/+1`, then measured exactly that (census note) |

## §3 · PREFLIGHT, EXECUTED AT `84e06412` AND RE-EXECUTED AT THE MEMBER TIP

| # | row | result |
|---|---|---|
| 1 | `git rev-parse claude/composite-r4` at opening and at every proof | `84e06412f6fdca91020197f2a332ba7f98642f64` — unmoved across the member |
| 2 | preamble SHA-256 at base and at tip | `0706aad6…` both — no re-stamp in the window |
| 3 | the two delivered paths and this packet's path at base | ABSENT (`git ls-tree` empty) |
| 4 | §417 duplicate-path probe on the shared census path | 68 holders, 67 LANDED and ONE non-terminal (MF-T2H, READY at this base, `MODIFY`); the path is NOT free and is NOT reserved here — the T2J shape is the only lawful cure |
| 5 | coupling census scope | `CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse\|spatial)\//` (`tests/lint/couplingInclusion.walker.test.js`), green with the member; `src/domain/resourceSites.js` is out of scope — charter §1.7 confirmed, cost ZERO |
| 6 | the resource-type vocabulary the band law reads | `tests/domain/resourceTaxonomyClassification.test.js` green with the member (read-only dependency) |
| 7 | generator golden, BEFORE and AFTER the member (`tests/property/generatorGoldenMaster.test.js`) | 3/3 green at base (S0 batch) and with the member (instrument batch); the fixture bytewise identical at `29c6cc8f…` — the Shape-1 dormancy claim EXECUTED (charter §9.1 fence) |
| 8 | anchors (§P3) | `tests/lint/negativeAssertionAnchor.walker.test.js` green at base and with the member; every negative carries `// anchored:` on its line or the line above, or routes through `expectPresentThenAbsent` / `expectAbsentWithAnchor` BY NAME |
| 9 | census tuple at base, re-derived | `2499 / 364 / 2135 / 20729 / 5787` (the charter's `20719` was stale) |
| 10 | census tuple with the member, read from the walker's own failure messages then confirmed green 33/33 | `2500 / 364 / 2136 / 20735 / 5788` — exactly `+1 / 0 / +1 / +6 / +1`; attributed by isolation (hiding the one file returns `files` to 2499); then REVERTED per §417 (the named interior red) |
| 11 | effective lines, eslint `Linter` `max-lines {skipBlankLines, skipComments}` | leaf **89** of 250; no hot file opened; no `scripts/.size-baseline.json` row |
| 12 | `package.json` / `package-lock.json` motion | none — no §349.2 mint trigger; the lane's cloned `node_modules` tree stays valid (`npm ls` exit 0) |
| 13 | the two typecheck configurations, by name, bare, one at a time, at the member tip | `typecheck:ratchet` → `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` exit 0 · `typecheck:domain:strict` → `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` exit 0 |
| 14 | `tests/lint/domainAnyCastBaseline.test.js` (the monotone-down any-cast ledger) | green with the member; `count-domain-any` over the leaf: `{"any":0,"suppress":0}` — the native table is read through a typed `Record` cast, never `any` |
| 15 | raw C0 control bytes in every authored file (`LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]'`) | 0 in the leaf, the test, this packet, the manifest row and the index row |
| 16 | the enforcement-claims `CLAIM_RE` (`tests/docs/enforcement-claims.test.js:40`) over this packet and the leaf | 0 hits |
| 17 | `tests/lint/observedShapeReaders.walker.test.js` with the member (the §443 law) | GREEN (27 tests) in the instrument batch; composition with the member `violations: 0 stale: 0`, `findings mentioning resourceSites: 0`, A1/A7 **387 / 1409 / 1995** — the base figures exactly; the leaf adds NO reader row |
| 18 | the committed leaf blob vs the proved blob | identical — the pre-commit `eslint --fix` re-indexed nothing (receipt) |

## §4 · ACCEPTANCE — SIX ARMS, ONE LITERAL `describe`, STRAIGHT-LINE `it` (6/6 green, exit 0)

`npx vitest run tests/domain/resourceSites.test.js` — `describe('MF-T2N — the resource
location deriver')`. Every arm runs over REAL generated settlements
(`generateSettlementPipeline`, fixed seeds `mf-t2n-<terrain>`), never a hand-built fixture:

| # | arm | what it proves |
|---|---|---|
| A1 | **guard-the-guard, then totality** (charter acceptance 1, §P6) | positive controls FIRST: fourteen worlds (seven terrains × two tiers) all carry non-empty rosters; the vocabularies are 8 / 3 / 8 — then for every world `sites.map(resource)` equals the distinct roster in order, every field is in its vocabulary, every band is in the admissible set of the resource's type, every positional site is `AT_HAND`, no real site is `UNANCHORED` (anchored by A4 producing it), the positional law was exercised, and the winds AND bands SPREAD across the corpus (a bucketing collapsed to one value reds here — m1, m2) |
| A2 | **determinism companion** (charter acceptance 2) | a second world generated from the same seed AFTER the first was derived, and a `structuredClone`, are both `toEqual` the first; the leaf's comment-stripped source contains `mixedHash32` and the `stablePart` import (the scan is live) and matches none of `Date`, `Math.random`, `Intl`, `performance.now` (anchored) |
| A3 | **counterfactual reach** (charter acceptance 3, the §306.2 input-trap law) | the plains town `mf-t2n-plains` (roster pinned as generated); `precious_metals` reads `{NE, NEAR, plains}`. (i) SWAP that one resource for `crossroads_position` → the site reads `{SW, AT_HAND, plains}` — the band moved because the TYPE moved (an unconstrained three-band pick reads `NEAR` for this token, measured, so the constraint is what convicts — m2), the bearing moved because the token moved (m1), and the three untouched sites are `toEqual` their before-records. (ii) CHANGE THE TERRAIN to `hills` → every tie-less site's anchor follows, every other field unchanged; on the coastal town the single-tie `fishing_grounds` STAYS `coastal` while the two-tie `salt_flats` and the tie-less `ancient_ruins` follow to `hills`. (iii) A NEW `id` moves at least one bearing (m4); (iv) a RENAME with the same `id` moves NOTHING |
| A4 | **refusal** (charter acceptance 4) | `grazing_land` present on the hills town's sites, then ABSENT once the roster drops it (`expectPresentThenAbsent`), the count one lower; `null`, `undefined`, `config: null`, `[]`, a string roster → `[]`; `[42, '', 'iron_deposits', null, 'iron_deposits']` → exactly one `iron_deposits` site; the custom `'Dragonglass'` → one UNTYPED site, band in the full set, anchor the settlement's terrain; a settlement with no terrain and a tie-less resource → one site with `UNANCHORED` (the typed gap) — m3 convicts here |
| A5 | **golden inertness by construction** (charter acceptance 5, re-read at J-TET2N-6) | `importersOf('resourceSemantics.js')` is non-empty and contains `resolveResources.js` (the walk and the import regex are live); `importersOf('resourceSites.js')` is exactly `[]` (anchored); a fresh world's JSON never matches `/resourceSites\|DERIVED_V1/` (anchored by `"nearbyResources"` being in it); deriving leaves `JSON.stringify(settlement)` byte-identical |
| A6 | **version discipline** (charter acceptance 6) | `RESOURCE_SITE_SOURCE_KIND === 'DERIVED_V1'` and every record carries it; `Object.keys(site)` is exactly `['resource','bearing','band','terrainAnchor','sourceKind']`; the three vocabularies are asserted exact; the admissible table's keys are exactly the taxonomy's five types plus `UNTYPED`, each set a non-empty nearest-first subset of the bands, `UNTYPED` the whole set; `expectAbsentWithAnchor` over the record keys |

Cases omitted, not replaced: no persistence round-trip (nothing is written), no privacy
boundary (no rendered surface), no idempotent-write case (no writer), no consumer case (lands
dark by ruling).

## §5 · MUTANTS — m1–m4 ALL CONVICT, planted and restored digest-exact, with a clean control

Harness `/tmp/t2n/mutants.sh` (every run mutexed), against leaf `271fe870…` and test
`499f6450…` (the worktree blobs the member commit then recorded unchanged):

| # | mutant | charter predicted | executed |
|---|---|---|---|
| m1 | bearing bucketing COLLAPSED to one wind (`% RESOURCE_SITE_BEARINGS.length` → `% 1`) | arms 1/3 | **RED on A1 and A3** |
| m2 | the type-bounded band set DELETED (every resource picks over all three bands) — the charter's "band thresholds inverted" re-read against a design with no thresholds (J-TET2N-4) | arm 3 | **RED on A1 and A3** — A1's corpus-wide positional law and A3's measured `NEAR`-vs-`AT_HAND` token both convict |
| m3 | the absent-resource REFUSAL replaced by INVENTION (a malformed roster sites the whole catalog) | arm 4 | **RED on A4** |
| m4 | the IDENTITY dropped from the hash token (every world sites alike) — an extra guard on the seed's reach | — | **RED on A3** |
| control | the restored leaf | green | **PASS**, 6/6, digests `271fe870…` / `499f6450…` reproduced after every restore |

No mutant was inert; none was replaced.

## §6 · EXACT CHANGE MANIFEST

| Action | File | Region | Delta | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/resourceSites.js` | new domain-root leaf | **89** effective of 250 | `deriveResourceSites`, `RESOURCE_SITE_SOURCE_KIND`, `RESOURCE_SITE_BEARINGS`, `RESOURCE_SITE_BANDS`, `RESOURCE_SITE_TERRAIN_ANCHORS`, `UNANCHORED`, `UNTYPED_RESOURCE`, `ADMISSIBLE_BANDS_BY_TYPE`; imports `../data/resourceData.js`, `../data/geographyData.js`, `./resourceSemantics.js`, `./worldPulse/stablePart.js` only; pure |
| `CREATE` | `tests/domain/resourceSites.test.js` | new acceptance file | 177 (test) | one literal `describe`, six straight-line `it`; real generated settlements only; anchored negatives |
| `DOC` | `docs/implementation/packets/town-cartography/MF-T2N.md` | new | — | this packet |

`docs/implementation/PACKET_MANIFEST.json` receives one packet row appended by TEXT surgery
(parsed to verify, never re-serialised) and `docs/implementation/INDEX.md` one table row — the
coordination-ledger surfaces (ODQ §331.4: packets do not list the index; the manifest row is
omitted here on purpose, J-TET2N-7). ⛔ The shared census path is NOT a row here (§417 T2J
shape; the row text rides the census note for the landing act). Generated artifacts: `NONE`. No
`tests/lint/**` file is minted, so §P3b's mutation-coverage row does not attach. **Symbols the
deliverable CREATES** (`export function deriveResourceSites`, `export const
RESOURCE_SITE_SOURCE_KIND`, `export const RESOURCE_SITE_BEARINGS`, `export const
RESOURCE_SITE_BANDS`, `export const RESOURCE_SITE_TERRAIN_ANCHORS`, `export const
ADMISSIBLE_BANDS_BY_TYPE`, `export const UNANCHORED`, `export const UNTYPED_RESOURCE`, the one
describe title) join `requiredSymbols` **at the flip to LANDED, never at READY** (the
MF-T2E/MF-T2F precedent; PACKET_STANDARD §"Change manifest"). At READY the rows name only what
the deliverable PRESERVES: the native table, the terrain table, the type vocabulary and its
resolver, the slug helper, the generator's roster write-back the acceptance depends on, the
coupling-census scope, and the two anchored helpers. `retiredSymbols`: **EMPTY**.

## §7 · JUDGMENT CALLS, VETOABLE

- **J-TET2N-1 — identity is `id` first, `name` second.** `id` is `idFromSeed(_seed)`, so a
  DM rename never relocates a seam (THE PROMISE: the seed is the world); `name` serves only an
  un-normalised object. Rejected: name-first (a rename would move every site).
- **J-TET2N-2 — EIGHT winds over sixteen.** The dossier says "to the north-east"; `NNE` is
  nautical jargon; the estate's own spatial octant idiom is `% 8`. The charter left the count
  to S0 ("the smallest vocabulary the dossier prose can speak").
- **J-TET2N-3 — `stablePart` IMPORTED, the hash RESTATED.** The slug leaf is import-free and
  already imported from the domain root elsewhere; the FNV+avalanche hash is restated as four
  sibling leaves restate it, because importing `heraldCausalGrammar.js` would drag a display
  grammar module with its own contamination fence into a domain-root deriver.
- **J-TET2N-4 — band = a type-bounded admissible set the seed picks within.** Over (a) a pure
  hash over three bands (every band arbitrary — a number in disguise, and the counterfactual
  arm could only assert "differs"), and (b) a flat type → band table (every iron seam in every
  world at the same distance — no world texture). The charter's mutant m2 ("band thresholds
  inverted") is re-read as "the type constraint deleted" because this design has no threshold;
  the charter's predicted conviction arm (3) holds, and arm 1 convicts too. O3 watch recorded.
- **J-TET2N-5 — the resource's own single terrain tie outranks the settlement's terrain.** A
  stored data fact about the resource beats a fact about the settlement; two-tie and tie-less
  resources fall to the settlement; the gap is typed `UNANCHORED`, never guessed.
- **J-TET2N-6 — acceptance arm 5 pins the MECHANISM of golden inertness, not the manifest's
  SHA literal.** The charter's wording ("the manifest read at the member tip equals the base
  manifest … as a pin") is EXECUTED and quoted (§2(d), §3 row 7); a test literal of a
  re-recordable figure would trap every later owner-signed golden shift (the banked
  `requiredSymbols` lesson, applied to a test pin). The structural pin — no importer under
  `src/`, no key written, no mutation — never goes stale and catches the same regression.
- **J-TET2N-7 — no `DOC` row for `PACKET_MANIFEST.json`** (the MF-T2Q shape over MF-T2R's):
  a non-terminal packet reserves every change path it names, and MF-T2R's READY row names the
  manifest; two READY siblings naming it in one tree would red the validator at the landing
  slot. The chair may add the row at the LANDED flip if the T2R shape is preferred.
- **J-TET2N-8 — depletion is not read.** A location is not a condition; the dossier joins by
  key to `nativeResourceConditionRecords`. Reading it here would make a site vanish when a
  seam is worked out, which is false.
- **J-TET2N-9 — the census row DEFERRED to the landing act and the walker edit REVERTED at the
  member commit** (§417 J-TET2J-1, the standing cure).

## §8 · RAISED — split OWNER / CHAIR, and DEFERRED

### Owner (visibility; nothing here blocks the landing)

| # | item | note |
|---|---|---|
| O-i | **The siting vocabulary** (eight winds, three bands, the type → admissible-set table) — charter O3. | This lane's position is the compile's: closed buckets with no numeric tuning are grammar. The owner may still claim the signature; a change is a declared shift minting `DERIVED_V2`. |

### Chair (recorded)

1. **RAISED-1 — the content-train consumer car** (ODQ §433 C3): the dossier pool that speaks
   a site needs lawful sentences for all three bands and for `UNANCHORED` (a floor spoken as a
   floor, the MF-T2R RAISED-2 pattern); `bearing` codes want a humanizer (`NE` → "north-east")
   on the prose side, never in the leaf.
2. **RAISED-2 — the fabric siting read** (the port tranche): the map consumer imports this
   leaf and never re-derives a site; `terrainAnchor` is a FAMILY, not a map coordinate.
3. **RAISED-3 — the landing-slot manifest reservation** (J-TET2N-7): if MF-T2R lands first its
   row goes terminal and the path frees; if the chair prefers both siblings at READY in one
   tree, MF-T2R's manifest `DOC` row is the one to drop.

### Deferred, with the ruling that parks it

| # | item | where it rides |
|---|---|---|
| D-1 | Generation-side given-past facts (stored sites on fresh worlds) | charter O1, owner docket — refused in this train (J3) |
| D-2 | A consumer of any kind (dossier pool, fabric read, PDF) | ODQ §433 C3 — content train and port tranche |

## §9 · THE GATES, AND THE ATTRIBUTION OF EVERY RED — NO STOP RAISED

**Executed 2026-08-23 (UTC), every exit captured in-shell, every vitest invocation under
`scripts/gate-mutex.sh --run` on the shared lock, logs under `/tmp/t2n`:**

| instrument | at the chair baseproof `b10ed1a1` | with the member (`d2f2ed74`) | verdict |
|---|---|---|---|
| `npm run typecheck:ratchet` | — | `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` exit 0 | GREEN at the exact ceiling |
| `npm run typecheck:domain:strict` | — | `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` exit 0 | GREEN at the exact ceiling |
| `npm run validate:packets` | `valid: 149 packets (1 READY)` at base, exit 0 | `valid: 150 packets (1 READY)` at DRAFT and `valid: 150 packets (2 READY)` at READY, exit 0 each | GREEN |
| `tests/domain/resourceSites.test.js` | — | 6/6, exit 0 (`acc-1.log`; again inside the mutant harness's clean control) | GREEN |
| generator golden · observed-shape reader walker · anchor walker · any-cast ledger · coupling-inclusion walker · resource taxonomy | green (S0 batch, 5 files / 85 tests, exit 0) | green (instrument batch: 6 of 7 files; 109 of 110 tests) | UNMOVED — every instrument-table prediction held |
| `tests/lint/sovereigntyLightingContract.walker.test.js` (census arm) | green | RED by construction (`expected 2500 to be 2499`) | the ONE NAMED interior red (census note; §417 T2J shape) |
| **§408 sweep** `npx vitest run tests/lint tests/build tests/ops` (`sweep-408.log`) | — | `Test Files 4 failed \| 179 passed \| 7 skipped (190)`, `Tests 6 failed \| 2113 passed \| 114 skipped (2233)`, exit 1 | the four red files are the census walker above plus the three rows below |
| `clampPrimitiveBaseline` (1) · `warCostKindPools.walker` (3) · `warRulingKindPools.walker` (1) | **RED — the same five titles, the same assertion texts** (`sweep-base-banked.log`, 3 files / 5 failed / 76 passed, exit 1) | RED, identical | PRE-EXISTING, banked; text-identical at base |
| strays (a timeout that passes quiet once) | — | **ZERO** | no re-run was needed |
| `tests/docs` (20 files) + `tests/scripts/implementationPackets.test.js`, with the packet and both ledger rows in place | `enforcement-claims` RED on the pre-existing naked-claim set (`docs-claims-base.log`) | the SAME six (`FABLE_VALIDATION_QUEUE.md` ×4, `GOLDEN_SHIFT_LEDGER.md:2128`, `IN-0C.md:484`) and nothing else (`docs-sweep.log`: 1 failed / 155 passed; `docs-claims-base.log` names the identical six at `b10ed1a1`) | PRE-EXISTING naked-claim debt; this packet, its index row and the leaf add no claim (`CLAIM_RE` 0 hits) |

⚠ **The branch moved under the build:** `claude/composite-r4` read `84e06412` at the lane's
opening and `4060f690` (the WEB-1 landing, two commits) by the member commit. Overlap across
`84e06412..4060f690` with this member: ONLY the two coordination surfaces
(`PACKET_MANIFEST.json` +217 — WEB-1's own row; `INDEX.md` +1) and the census walker's tuple
row (+32/-1 — WEB-1's own re-record). None of the leaf's dependencies, the OSR baseline, the
golden fixture or `src/domain/**` moved, so every reading above is CONFIRMED at `84e06412` and
the chair's CAS re-derives the census tuple by sum-of-deltas and re-appends the two meta rows
(the MF-T2Bf method). The member is NOT rebased by this lane.

### §9.1 What the lane did NOT do

It did not run the full gate or `check:tail` (the landing terminal's act). It did not edit the
census walker beyond the proved-then-reverted tuple walk, nor any baseline, ratchet or
exemption bank. It built no consumer.
