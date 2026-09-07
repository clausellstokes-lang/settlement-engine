# Town cartography / MF-UC3 — the undercity's STATIC components: `deriveStaticComponents` derives the caverns a settlement's GROUND gives it, licensed by the geography data's own excavation-affinity rows, anchored on its own published natural features, epoch-invariant, and lands dark

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `f32c548ea720fc10ae895b0d542a837cce7d63aa`
  ⚠⚠ **AS AUTHORED — the row above now names the LANDING SLOT (see the Landing note below); the
  BUILD base was `4060f690` (WEB-1's landing).** The continuation that follows was written at that base:
  — WEB-1's landing (ODQ §446.1), read with `git rev-parse` at the lane's opening and re-read at
  every proof below. Every figure in this packet was executed at THIS base by the implementing
  lane TE-UC3; nothing is inherited from the charter (`draft-UNDERCITY-PLAN.md`, ruled ODQ §441,
  ratified §445.2) except where a row says so and names the re-derivation. ⚠ The charter's census
  tuple was deliberately omitted (§441.5(e)) and is re-derived here; the charter's line citations
  `geographyData.js:268/577` land on the SECOND line of each `[D6 THE UNDERWAYS]` comment at this
  base (`:267-274` mountain, `:576-582` hills) — the same two rows, re-walked.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Landing note (TE-UCSTACK-LANDING, 2026-08-23, ODQ §472.4 — THE UNDERCITY TRAIN's FIRST TWO CARS, a lawful green prefix of T-UC1):** authored at BUILD
  base `4060f690` as holding tip `64a4b259` (pinned `refs/preserve/holding-uc3`); landed as ONE stacked landing with its sibling
  (MF-UC0 → MF-UC3, UC-0 first because UC-3 imports its `jointVocabulary.js`; each rebased in sequence onto the moving tip) at slot `f32c548e`
  (the PRODUCER TRAIN's §469 follow-on, landings 36–38). Rebased implementation commits `2bd4c821 → cda3112d` (authored `4559b9bd → 64a4b259`);
  this member is the SECOND (the LAST — its position IS the live tuple) of the two. Entered at **LANDED** directly — the §410 form, as the MAP STACK and the PRODUCER TRAIN did:
  MF-T2H's READY reservation on the census walker stands until HK-A lands, so the §417 deferred row could only enter the manifest at a
  terminal status, and did, at this act. Census: slot `2508 / 365 / 2143 / 20801 / 5800`; this member's position `2510 / 365 / 2145 / 20817 / 5802`; the stack's ONE live tuple
  `2510 / 365 / 2145 / 20817 / 5802` convicted at the stack tip (33/33) with the negative controls *"the estate's file count moved — re-measure, do not re-word: expected 2510 to be 2508"* (control A, the summed delta +2)
  and *"… expected 2510 to be 2509"* (control B, MF-UC0's position put back — MF-UC3's +1 alone, the proof that no sibling's delta was dropped by the merge).
  Every delivered-file digest this packet cites (the hash table, the preamble `0706aad6…`, the generator-golden fixture `29c6cc8f…`) re-verified at the
  landed tree — none moved, so no RE-HASHED table note is owed; the census note's walker digest `97d8437d…` is the BUILD-base pristine blob
  (restoration history), and the walker at the landed tree reads `9b277324eacca30c377efb1d2caa2f9f4373ae845ed17100f661486719cc8f7a` after this act's re-record. The DORMANT CARRY of `src/domain/undercity/jointVocabulary.js` resolved to MF-UC0's ONE copy at the rebase (git dropped the identical add/add — the rebased member commit 2bd4c821 carries two files, not three; blob 44803aa7 on every side, `cmp` exit 0 both ways, sha256 f9445c98… as cited); the `CREATE` row for that path is therefore REMOVED from this packet's manifest `changeManifest` at this act (J-R2-2: UC-0 mints it; a LANDED CREATE row here would claim a path another LANDED packet created).
- **Charter and rulings:** `draft-UNDERCITY-PLAN.md` §4 UC-3 (this member), §1 (the binding law
  quoted), §2 (the fabric-vs-engine split), §3 (the live estate and the license-home audit), §7 F4
  (the CT-4 fact contract this member produces), §8–§11. Doctrine citation: **ODQ §311** — and
  specifically **§311.6.3** ("caverns … never grow nor diminish — static terrain facts,
  seed-permanent, licensed by the ground, epoch-invariant"), **§311.8.1** (the general form:
  LICENSE + ANCHOR + EXTENT DRIVER + TEMPERAMENT + CAUSED PORTALS), **§311.8.2(a)** (the STATIC
  temperament), **§311.2** (causal, never cosmetic — the caused portals), **§311.6.4** (isolated
  pieces are lawful). Ruled at **ODQ §441**, applied in place by TC-UNDERCITY-R2, **ratified at
  §445.2**; dispatched at the seat freed by WEB-1 (§446.2's queue, under the §447 seat law).
- **Depends on:** **UC-0 (`MF-UC0`), the same train's earlier car** — for
  `src/domain/undercity/jointVocabulary.js` (charter J-R2-2: the closed joint vocabulary's DATA
  module is minted by UC-0 so every later component row imports one truth). That file does not
  exist at this base, so this lane carries it as a **DORMANT CARRY: byte-identical to UC-0's own
  worktree copy, SHA-256 `f9445c9868122a41d33d984700ffc19693cc9c6168fec440df0f64d31f7ed13f`**
  (`cmp` exit 0 against `…/laneTEUC0-tree/src/domain/undercity/jointVocabulary.js`). **THE LANDING
  ACT KEEPS ONE COPY:** whichever of UC-0/UC-3 lands first delivers the file; the second lane's
  blob is identical, so the rebase has nothing to merge and the surviving copy is the same bytes
  either way. No spelling convergence is owed — the lists are the charter's own closed
  vocabularies verbatim. Otherwise this member depends on nothing non-terminal: it reads the
  LANDED geography table (`src/data/geographyData.js`), the LANDED institutional catalog
  (`src/data/institutionalCatalog.js`), the LANDED terrain resolver
  (`src/domain/resolveTerrain.js`), the LANDED native-resource projection
  (`src/domain/content/customContentSemanticAuthority.js`), the LANDED codepoint order
  (`src/domain/deterministicSort.js`), the LANDED slug helper
  (`src/domain/worldPulse/stablePart.js`) and the LANDED kernel hash
  (`src/kernel/proseHash.js`).
- **Binds forward:** **CT-4** (the content train's undercity prose chapter, ODQ §361.1) consumes
  this member as charter **§7 F4** — `staticComponents[]`, caverns with terrain license,
  `temperament: 'STATIC'`, `surfaceJoins[]` — licensing the sentence class "what the ground gave".
  **UC-5** (`MF-UC5`, the connectivity graph) consumes each row's `surfaceJoins[]` as the portal
  truth (one producer per join) and its `anchor` as the component's surface cause. **The map
  program's D5 strata wave** consumes the same facts through §287.4's StrataExistencePlan seam.
  None may re-derive a cavern.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the file at
  `4060f690` by this lane (`shasum -a 256`) and identical to the value the charter carries, so no
  re-stamp occurred in the window. Its §P2 hazard dispositions, §P3 anchor preflight, §P5 census
  law, §P6 mutant hygiene, §P7 STOP set and §P8 capsule law bind this packet and are not restated.
  **Stamp: GRANTED at ODQ §312.2b** — the stamped column applies (eight members per engine train;
  T-UC1 has three). **No UC-PREAMBLE and no new family** (charter C-4 / §441.7).
- **Collision group:** `undercity` (the T-UC1 train). At this base the manifest holds **150
  packets, 149 terminal and ONE non-terminal** (re-counted by execution: `valid: 150 packets
  (1 READY)` before this packet was added) — **MF-T2H is still READY** although its code is an
  ancestor of this base; its flip to LANDED is the chair's pending act. **MF-T2H RESERVES BOTH
  census walkers** — `MODIFY tests/lint/sovereigntyLightingContract.walker.test.js` AND
  `MODIFY tests/lint/entropyRootCensus.walker.test.js` — and names none of this member's paths and
  not `PACKET_MANIFEST.json`. The three delivered paths and this packet's own path are held by NO
  packet (`git ls-tree 4060f690 -- src/domain/undercity/` is empty). The shared census path is
  therefore NOT FREE at this base, and this packet does NOT reserve it (§417's T2J shape: the row
  rides this packet verbatim for the chair's landing act — see the census note). It reserves no
  `DOC` row for `docs/implementation/PACKET_MANIFEST.json` either (the MF-T2Q/MF-T2N shape).
  ⚠ The entropy-census reservation is why J-TEUC3-2's cure had to be REUSE rather than a
  re-record: the path was not this lane's to claim.
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves the
  branch. **This lane moved no ref, ran no `git stash`, never staged with `-A`/`-u`/`.`, and never
  wrote in the main checkout.** Both commits ran with hooks ON; the pre-commit `eslint --fix`
  changed nothing (the committed blobs equal the blobs every proof ran against — §3).

> **`censusAuthorization`:** this packet moves the test census by
> **`+1 files / +0 parked / +1 credited / +8 titles / +1 suiteTitles`** — exactly the charter's
> predicted five-figure delta for a UC car. **Base tuple, RE-DERIVED at `4060f690`:
> `2500 / 365 / 2135 / 20730 / 5787`** (WEB-1's landing re-record, ODQ §446.1 — the charter states
> no tuple on purpose, §441.5(e), because the landing cascade keeps moving it). **After tuple, read
> from the walker's own failure message figure by figure and then CONFIRMED by a full green pass
> (33/33, exit 0) with the row applied: `2501 / 365 / 2136 / 20738 / 5788`.** ONE new acceptance
> file, `tests/domain/undercityStaticComponents.test.js`, credited (one literal `describe`, eight
> straight-line `it`, no `.each`/`runIf`/nesting — loop-registered titles are refused because they
> are invisible to the census). Its authorizing decisions are **ODQ §311** (the undercity
> doctrine), **§359.3** (the OB-6 fold), **§431** (this dispatch) and **§441** (the ruling), under
> the charter's §4 census law. The family's stamp is **GRANTED** at ODQ §312.2b.
> ⭐⭐ **STACKED LANDING (ODQ §472.4; §457/§469 laws) — convicted at the stack tip, never carried.** Slot tuple
> (`claude/composite-r4` = `f32c548e`, the PRODUCER TRAIN's follow-on): `2508 / 365 / 2143 / 20801 / 5800`; this member's position in the
> stack re-derives to `2510 / 365 / 2145 / 20817 / 5802`; the stack's ONE live tuple `2510 / 365 / 2145 / 20817 / 5802` was
> convicted at the stack tip (33/33) with two negative controls — the slot's own tuple put back reds at `files`:
> *"the estate's file count moved — re-measure, do not re-word: expected 2510 to be 2508"* (the summed delta +2), and
> MF-UC0's position tuple put back reds *"… expected 2510 to be 2509"* (MF-UC3's delta alone). The DELTA `+1/+0/+1/+8/+1` crossed the
> rebase; the authored tuples above are the BUILD-base history.
>
> ⛔ **THE ROW IS DEFERRED TO THE LANDING ACT (ODQ §417, the T2J shape).** The walker edit was made,
> walked figure by figure, proved green, and then **REVERTED ON PURPOSE** at the member commit
> (walker blob restored digest-exact to `97d8437d680d6f675c8df1841c917e3904934dbd1eba18cc6befdc6abf9a83b2`);
> the row is inserted by the chair's landing act at the train terminal, so the census arm of
> `sovereigntyLightingContract.walker` REDS at this member's tip — **that is the ONE NAMED interior
> red (charter §4, preamble §P7.12), not a defect.** No other red stands at this tip (§9). The exact
> text to paste, replacing the `files: … suiteTitles: …` line inside the `CENSUS` object (at
> `:5304` at this base), is:
>
> ```
>     // ── RE-RECORDED 2026-08-23 BY TE-UC3 (MF-UC3), CAUSE ATTRIBUTED ──────────
>     // `files` 2500 → 2501, `credited` 2135 → 2136, `titles` 20,730 → 20,738,
>     // `suiteTitles` 5,787 → 5,788. `parked` is UNCHANGED at 365.
>     // ONE new acceptance file, tests/domain/undercityStaticComponents.test.js, credited (one
>     // literal `describe`, straight-line `it`, no `.each`/`runIf`/nesting) carrying EIGHT arms —
>     //   ⭐ guard-the-guard, then totality: the corpus is 14 REAL settlements carrying both
>     //     licensing grounds and one waterlogged licensed ground; every table re-derived from
>     //     TERRAIN_DATA here rather than from the leaf's own copy
>     //   ⭐ epoch invariance: a settlement aged three centuries derives identical caverns, and
>     //     the comment-stripped source reads no epoch key of the settlement at all
>     //   ⭐ terrain licensing over REAL settlements: caverns on exactly the two licensed grounds,
>     //     and never in the floodplain — the marsh-bearing hill thorp gets none; draining it
>     //     gives it one
>     //   ⭐ seed determinism: same seed deep-equal, clone identical, rename identical, a new
>     //     identity moves the ground
>     //   ⭐ the §311.8.1 general form: temperament STATIC, typed license, published anchor, closed
>     //     extent, surfaceJoins from the closed joint vocabulary — EMPTY where the ground names
>     //     no way in (the lawful isolated cavern, §311.6.4)
>     //   ⭐ the deriver's own validation refuses an out-of-vocabulary joint kind
>     //   ⭐ G-43: flip the terrain class and the cavern license flips with it
>     //   ⭐ refusal and version discipline: garbage yields [] without throwing; vocabularies frozen
>     // `censusAuthorization`: ODQ §311 (the undercity doctrine), §359.3 (the OB-6 fold), §431
>     // (this dispatch), §441 (the ruling, 24/24 applied and ratified at §445.2).
>     // ⛔ ATTRIBUTED BY ISOLATION, NOT BY ARITHMETIC, at THIS base. The tuple was read from the
>     //   arm's own failure message at each step ("expected 2501 to be 2500", then credited, then
>     //   titles, then suiteTitles), never computed; with the walker pinned at the after tuple,
>     //   hiding the one new file convicted `files` at 2500 — the base figure exactly. `parked`
>     //   PASSED at 365 without redding. No other lane's file moved.
>     files: 2501, parked: 365, credited: 2136, titles: 20738, suiteTitles: 5788,
> ```
>
> ⚠ The chair re-derives the BASE tuple at the terminal before pasting: T-UC1's sibling cars each
> move it by their own declared delta (sum-of-deltas at the terminal), and the tuple is never
> carried across a rebase (the rebase-slot law). MF-UC0 declares `+1/0/+1/+8/+1` from base
> `84e06412`; MF-T2N declares `+1/0/+1/+6/+1`; MF-T2R and MF-T2Q each `+1/0/+1/+7/+1`.

> **Delivered files, hashed from their COMMITTED blobs at the member tip** (`git show HEAD:<path>
> | shasum -a 256`), and their effective lines under eslint `max-lines`
> `{ skipBlankLines, skipComments }` measured with eslint's own `Linter`:
>
> | file | action | SHA-256 (committed blob) | effective lines |
> |---|---|---|---:|
> | `src/domain/undercity/jointVocabulary.js` | CREATE (carried from UC-0, identical bytes) | `f9445c9868122a41d33d984700ffc19693cc9c6168fec440df0f64d31f7ed13f` | **8** of 20 |
> | `src/domain/undercity/staticComponents.js` | CREATE | `3d403f5c20fd942641e4556cd5edf023bf441a0a4503fe40ca0759bdfc9eecde` | **111** of 250 (charter estimated ~100) |
> | `tests/domain/undercityStaticComponents.test.js` | CREATE | `1d6a373041e2ff8cd7d5cebaaad6ecd28fd9c347d6130844a5e1da1e22462667` | 215 (test; not a production budget) |
>
> None of the three paths exists at `4060f690`, so the member collides with nothing it creates.
> **Existing logic modified: 0. Coupling census: 0. Shared/hot files touched: 0.** `git show --stat`
> of the member commit is three CREATEs and zero modified files — well inside the ≤400-effective
> wave cap (**119 effective production lines**), the ≤250-per-leaf cap and the ≤3-modified-
> production-files cap (zero modified).
---

## §0 · WHAT THIS MEMBER IS, AND WHAT IT REFUSES

**IS:** one pure deriver at the undercity root. `deriveStaticComponents(settlement)` answers a
single question — *what did the ground give this town?* — and answers it from stored facts alone:
the settlement's seed-stable `id`, its resolved terrain class, and its native resource roster.
It returns zero or one `cavern` rows, each carrying the §311.8.1 general form whole: a typed
`license` (the terrain fact that permits it), an `anchor` (the surface feature it sits beside),
an `extent` (the closed bucket the ground fixes once), `temperament: 'STATIC'`, and
`surfaceJoins[]` (the caused portals — §311.2).

**REFUSES, by construction:**
- **No generation-path write.** Generation never imports this leaf; the generator golden manifest
  is byte-identical before and after (§3). Charter §8 R-2 is not tripped.
- **No epoch read.** No tick, year, history, calamity stamp, population or tier of the settlement
  is reachable from this file — proven behaviourally (a settlement aged three centuries derives
  identical rows) and structurally (a comment-stripped source scan). §443's pulse-written-key law
  therefore does not bind this car: it reads no key the pulse writes.
- **No tuning constant.** The excavation license is the EXISTENCE of a geography-data row, never
  its modifier; the ground's hardness is a typed string the data already carries. There is no
  weight, no threshold and no coefficient in this leaf. Charter §8 R-3 gains no input.
- **No name-string idiom.** Terrain resolves through the estate's one terrain read
  (`resolveSettlementTerrain`); resources through the generator's own native projection
  (`nativeSemanticResourceKeys`); the flood refusal from the catalog's own `forbiddenResources`.
- **No second truth.** The joint kinds come from `jointVocabulary.js`; the FNV root from
  `kernel/proseHash.js`; the flood list from the catalog. This leaf restates none of them.
- **No geometry, no sheet, no surface.** Galleries, chamber cuts, the −1 leaf and drawn joints are
  fabric-side D5 work (charter §2, deferred row D-4). This member ships no user-visible surface
  (charter §8 R-4 untouched) and lands DARK — no production module imports it.
- **No wells or cisterns.** They are SURFACE-COUPLED and moved to UC-1 at §441.5(b); filing one
  here would have recorded the wrong temperament.
- **No store verb, no payload grammar** (§423): nothing here is a player-initiated act.

## §1 · THE DERIVER'S CONTRACT

### §1.1 The license is READ from the data, never tabulated

`TERRAIN_DATA` already declares which ground takes an excavation. The `[D6 THE UNDERWAYS]` rows
name `'Underground network'` as a terrain-affinity institution on exactly two classes —
**mountain** (`geographyData.js:267-274`, *"Stone easily excavated for tunnels"*) and **hills**
(`:576-582`, *"Firm ground easily excavated for tunnels"*). The leaf re-derives the licensed set
at every call as *"the terrain whose `institutionModifiers` carries a row named 'Underground
network'"* → executed: `["mountain","hills"]`. **The modifier number is never read.** A
coefficient would be a tuning input (charter §8 R-3) and this car declares none; a hardcoded
terrain list would be a second truth that could silently disagree with the data.

The ground's HARDNESS is likewise typed data, not a number: `architectureModifiers.
stoneAvailability` — mountain `'very high'`, hills `'high'`. `EXTENTS_BY_GROUND` maps that closed
string to the extents the ground ADMITS (`very high` → `chamber | hall | system`; `high` →
`pocket | chamber`). It is a **grammar table**, not a tuning table: it names which buckets are
reachable, never a weight or a threshold — the MF-T2N J-TET2N-4 shape (type-bounded admissible
sets, the seed picking within). A licensed terrain whose hardness the table does not admit yields
NO cavern: the leaf refuses rather than inventing an extent for unfamiliar ground.

### §1.2 The anchor is the ground's OWN published feature

`TERRAIN_DATA[t].naturalFeatures` is the estate's live per-terrain feature vocabulary — mountain:
`mine entrance · quarry · mountain pass · hidden valley · cave system`; hills: `hilltop fort
site · terraced fields · stone circle · valley crossroads`. The cavern sits beside one of them,
picked by the settlement's own seed. **Nothing is invented**: every `anchor` in an output row is
a string the geography data itself publishes, and the acceptance re-derives that from the live
table rather than from the leaf's own copy.

### §1.3 The caused portal, and the lawful isolated cavern

A cave mouth is a `breach`-kind join (`jointVocabulary.js`) to the surface feature it opens from —
but only where that feature is itself an opening into the ground. `GROUND_OPENINGS` is the closed
set of published features that name one: `cave system`, `mine entrance`, `quarry`. Where the
ground names no opening, `surfaceJoins` is **EMPTY**, and that is lawful (§311.6.4 — "isolated
pieces are lawful") and honest (§311.9.2(vii) — the void nobody has found a way into is itself the
game). **Hill country reaches that state on every world**: none of its four published features is
an opening. Both states occur on real generated settlements, measured.

Every join is built by `staticSurfaceJoin(kind, anchor)`, which REFUSES any kind outside the
closed vocabulary: an unlawful kind yields no join at all rather than an unlawful row. A component
may lack a portal; no component may carry an invented one.

### §1.4 The ground can refuse — the one stored "tunnels flood"

The catalog's three `'Underground network'` rows carry
`forbiddenResources: ['marshlands', 'fertile_floodplain']` (`institutionalCatalog.js:887/:1447/
:1966`; the comment at `:878` — *"makes it impossible atop marsh/floodplain (tunnels flood)"*).
That is the estate's ONE stored statement that waterlogged ground holds no void. The leaf derives
the list at load as the union of `forbiddenResources` over every catalog row DECLARING the
`subterranean` facet → executed `["fertile_floodplain","marshlands"]`, and never restates the
pair. A settlement whose NATIVE roster (the generator's own `nativeSemanticResourceKeys`
projection, the same one `assembleInstitutions` refuses by) carries such a resource has no cavern,
whatever its terrain class. **This is the doctrine's "no cavern in the floodplain", and it is not
dead code:** over a 210-world corpus, 50 settlements carry a waterlogging resource natively and
**8 of them sit on licensed hill ground**.

### §1.5 One ground, one cavern (J-TEUC3-1)

The ground is ONE fact, so it gives ONE cavern system — its place and size varying by the world's
own seed, and its extent never moving again (§311.8.2(a): "never grow nor diminish"). The largest
bucket, `system`, is itself the plural form. The alternative — a row per natural feature — needs a
COUNT rule, and every candidate count rule is an invented number this car refuses to mint. The
return type stays an ARRAY (charter §7 F4's `staticComponents[]`) so UC-5 and CT-4 consume rows
uniformly and a later car may widen the population without a shape change.

## §2 · S0, MEASURED BEFORE THE FIRST EDIT (charter §4's order)

| # | measured | result |
|---|---|---|
| (a) | the terrain license homes | `TERRAIN_DATA` (`geographyData.js:50`) carries SEVEN classes; the `[D6 THE UNDERWAYS]` excavation-affinity rows sit at `:267-274` (mountain, *"Stone easily excavated for tunnels"*) and `:576-582` (hills, *"Firm ground easily excavated for tunnels"*). Licensed set re-derived live: `["mountain","hills"]`. Hardness: `very high` / `high`. **No floodplain/marsh TERRAIN class exists** — the doctrine's refusal lives at the RESOURCE level, homed in the catalog at `institutionalCatalog.js:887/:1447/:1966`, union derived live as `["fertile_floodplain","marshlands"]` |
| (b) | the identity input | `settlement.id` present and matching `s_<16hex>` on **210/210** real settlements (5 seeds × 6 tiers × 7 terrains); `config.terrainType` a `TERRAIN_DATA` key on 210/210; same-seed regeneration gives an identical id. The only epoch-ish top-level key a freshly generated settlement carries is `history` |
| (b2) | **is the floodplain refusal reachable?** | **YES, measured.** 50 of the 210 carry a waterlogging resource NATIVELY — `{plains:15, hills:8, forest:10, riverside:12, desert:5}` — and **8 sit on licensed hill ground**. Mountain never draws one (0/30). The refusal is a live branch, not the shape-the-corpus-never-produces vacuity |
| (c) | generator golden BEFORE | `tests/fixtures/generator-golden-master.json` sha256 `29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8`, 67,779 bytes |
| (d) | the reader walker (§443) | GREEN at base; A1/A7 literals at `:737` `{ reads: 1995, identities: 1409, files: 387, bankedReads: 60, taggedRows: 40 }`. The leaf reads ONLY generation-written keys, through the banked readers `resolveSettlementTerrain` and `nativeSemanticResourceKeys`; it reads NO pulse-written key, so §443's calamityLedger cure does not bind this car |
| (e) | the census tuple at base | `2500 / 365 / 2135 / 20730 / 5787` at `:5304`; predicted delta `+1/0/+1/+8/+1` |
| (f) | the S0 base battery, mutexed | `Test Files 9 passed (9)`, `Tests 138 passed (138)`, exit 0 |

**No STOP was raised.** Every license input this car needs has a live home read at a named line;
the charter's §3 STOP condition (a license input with no live home) does not fire here.

## §3 · PREFLIGHT, EXECUTED AT `4060f690` AND RE-EXECUTED AT THE MEMBER TIP

| # | instrument | predicted | measured at the tip |
|---|---|---|---|
| I1 | `generatorGoldenMaster` + fixture | UNMOVED bytewise | **UNMOVED — `29c6cc8f…` identical**, 3/3 green. Golden inertness PROVEN, not asserted |
| I2 | `observedShapeReaders.walker` | UNMOVED at 1995/1409/387 | **GREEN, literals UNMOVED** with the member |
| I3 | `sovereigntyLightingContract.walker` | INTERIOR RED, exactly `+1/0/+1/+8/+1` | **RED exactly as predicted** (`expected 2501 to be 2500`); walked green, isolated, REVERTED |
| I4 | `negativeAssertionAnchor.walker` | UNMOVED | **green** at base and tip |
| I5 | `domainAnyCastBaseline` + `count-domain-any` | UNMOVED, zero `any` | **green**; `count-domain-any` has ZERO undercity rows |
| I6 | `typecheck:ratchet` / `typecheck:domain:strict` | both at ceiling | **`OK — no type regressions (173 error(s), ceiling 173).`** and **`✓ no strict-type regressions (1134 errors, ceiling 1134).`**, exit 0 each. Two authored type defects were found and cured BY TYPEDEF first (§9.2) |
| I7 | `couplingInclusion.walker` | UNMOVED | **green** — `src/domain/undercity/**` is outside `CENSUS_SCOPE_RE` |
| I8 | `entropyRootCensus.walker` | **AT RISK** | **RED at the first build (35 vs 34), CURED BY REUSE, then green at 34** — J-TEUC3-2 |
| I9 | `domainGeneratorsBoundary` | UNMOVED | **green** — the leaf imports `src/data/**`, `src/domain/**`, `src/kernel/**` only |
| I10 | `sizeBaseline` + eslint `max-lines` | UNMOVED | **green** — three NEW files, no baseline row; leaf 111 of 250 |
| I11 | `tests/build/townMapLazy.test.js` | SKIPPED (dist absent) | **skipped** at base and tip; the closure claim is proved instead by the acceptance's source scan (no `townMap` token in the comment-stripped leaf) and by the leaf having NO production importer |
| I12 | `validate:packets` | 150 → 151, green at DRAFT and READY | see §9 |

## §4 · ACCEPTANCE — EIGHT ARMS, ONE LITERAL `describe`, STRAIGHT-LINE `it` (8/8 green, exit 0)

Every arm runs over REAL generated settlements (`generateSettlementPipeline`, 7 terrains × 2 tiers,
`mf-uc3-*` seeds), never a hand-built fixture. Every counterfactual changes ONE stored input.

| arm | what it pins |
|---|---|
| **A1** | GUARD-THE-GUARD, then totality. 14 real worlds, every `id` an `s_<16hex>`, every terrain a published class; the corpus carries BOTH licensing grounds (4 settlements) AND exactly one licensed-but-waterlogged ground (the fuel A3 burns). **Every table is re-derived from `TERRAIN_DATA` right here** — the licensed set, the hardness classes, the opening features — so a table that drifts from the geography it claims to read reds instead of passing on its own copy. Then: at most one row per world, every field in its closed vocabulary |
| **A2** | EPOCH INVARIANCE. A settlement given a new tier, four times the population, a 300-year history, a plague stamp, a world clock and an epoch counter derives byte-identical caverns; and the comment-stripped source contains no settlement epoch read, no `townMap`, no clock and no ambient randomness — three positives first, so the scan cannot go vacuous |
| **A3** | TERRAIN LICENSING over REAL settlements. Caverns appear on exactly `mountain/town`, `mountain/thorp`, `hills/town`; the ten unlicensed worlds give none; **the marsh-bearing hill thorp — licensed ground — gives none, and draining its native roster gives it one**; flooding a mountain town takes its cavern away (a present-then-absent transition) |
| **A4** | SEED DETERMINISM. Two independently generated same-seed worlds are deep-equal; a clone is identical; a rename is identical; a new identity moves the extent (`chamber` → `system`) |
| **A5** | THE §311.8.1 GENERAL FORM. Every row: `temperament: 'STATIC'`, `sourceKind: 'DERIVED_V1'`, a license whose `reason` matches the live D6 row, joins whose `kind` is in `JOINT_KINDS` and whose `anchor` is the row's own anchor, and a join count that is exactly 1 where the anchor is an opening and 0 otherwise. **Both states occur**: one cave mouth (`breach` at `cave system`) and two lawful ISOLATED caverns (`mountain pass`, `terraced fields`) |
| **A6** | THE DERIVER'S OWN VALIDATION. `staticSurfaceJoin` builds `breach`/`stair` rows and REFUSES `tunnel`, `shaft`, `BREACH`, `null` and an anchorless join — and the joins the corpus actually produces all pass the vocabulary, so the constructor is the live path, not a side door |
| **A7** | G-43. A plains town gains a cavern on mountain rock (anchor `mine entrance`, with its breach); a mountain town loses it on the flat (present-then-absent); hill stone gives a smaller, unentered cave whose extent is admissible for `high` and not for `very high` |
| **A8** | REFUSAL AND VERSION DISCIPLINE. `null`, `undefined`, `{}`, a null config, an unpublished terrain and the `'auto'` sentinel on BOTH legs of the resolver chain all yield `[]` without throwing; an identity-less object still derives from its ground (total, not lucky); `DERIVED_V1` frozen; every exported vocabulary `Object.isFrozen` |

## §5 · MUTANTS — SIX PLANTED, SIX CONVICT, planted and restored digest-exact, with clean controls

Pristine leaf `3d403f5c…`; clean controls before, between and after all 8/8 exit 0.

| mutant | the semantic change | arms it reds |
|---|---|---|
| m1 | the excavation-affinity finder INVERTED | **A5** (the license receipt) |
| m2 | an EPOCH KEY READ introduced (`s.population` in the extent token) | **A2 · A4 · A7** |
| m3 | the JOINT-KIND VALIDATION dropped from `staticSurfaceJoin` | **A6** |
| m4 | the ground's "tunnels flood" REFUSAL dropped | **A3 · A5** |
| m5 | the IDENTITY dropped from the seed token | **A4 · A5 · A7** |
| m6 | the GROUND LICENSE deleted WHOLESALE (both gates) | **A3 · A4 · A5 · A7** |

⭐ **THE PROPERTY m1 EXPOSED, STATED (§417's equivalent-mutant standard).** The terrain license is
TWO INDEPENDENT CONJOINED DATA FACTS — the `[D6 THE UNDERWAYS]` affinity row AND a hardness class
`EXTENTS_BY_GROUND` admits. Inverting only the affinity finder cannot add an unlicensed terrain,
because none of the other five carries an admitted hardness (`medium`/`low`/`very low`), so A3
stays green ON PURPOSE and m1 convicts on the license RECEIPT instead. **m6 was planted to convict
the licensing arm in a spelling the design can actually reach** — the license deleted wholesale,
which reds A3 with `expected [ 'plains/town', 'coastal/town', …(7) ] to deeply equal
[ 'mountain/town', …(2) ]`. No mutant was inert; none needed replacing.

## §6 · EXACT CHANGE MANIFEST

| Action | File | Region | Delta | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/undercity/jointVocabulary.js` | new frozen data module | **8** of 20 | `JOINT_KINDS`, `TEMPERAMENTS`, `isJointKind`, `isTemperament`; zero-import. **Carried from UC-0, identical bytes (`f9445c98…`) — the landing act keeps ONE copy** |
| `CREATE` | `src/domain/undercity/staticComponents.js` | new undercity leaf | **111** of 250 | `deriveStaticComponents`, `groundLicenseOf`, `staticSurfaceJoin`, `waterloggedResourceKeys`, `STATIC_COMPONENT_KINDS`, `CAVERN_EXTENTS`, `EXTENTS_BY_GROUND`, `GROUND_OPENINGS`, `CAVERN_MOUTH_JOINT`, `STATIC_TEMPERAMENT`, `STATIC_COMPONENT_SOURCE_KIND`, `EXCAVATION_AFFINITY_INSTITUTION`, `WATERLOGGED_FACET_KIND`; pure, epoch-invariant, no `townMap` import |
| `CREATE` | `tests/domain/undercityStaticComponents.test.js` | new acceptance file | 215 (test) | one literal `describe`, eight straight-line `it`; real generated settlements only; anchored negatives |
| `DOC` | `docs/implementation/packets/town-cartography/MF-UC3.md` | new | — | this packet |

`docs/implementation/PACKET_MANIFEST.json` receives one packet row appended by TEXT surgery
(parsed to verify, never re-serialised) and `docs/implementation/INDEX.md` one table row — the
coordination-ledger surfaces (ODQ §331.4: packets do not list the index; the manifest row is
omitted here on purpose, the MF-T2Q/MF-T2N shape). ⛔ **NEITHER census walker is a row here** —
`sovereigntyLightingContract.walker` (§417's T2J shape; the row text rides the census note) nor
`entropyRootCensus.walker` (never edited at all — J-TEUC3-2 cured by reuse). Both are RESERVED by
MF-T2H at READY. Generated artifacts: `NONE`. No migration (charter §10's affirmative non-goal).
No `tests/lint/**` file is minted, so §P3b's mutation-coverage row does not attach. **Symbols the
deliverable CREATES join `requiredSymbols` at the flip to LANDED, never at READY** (the
MF-T2E/MF-T2F precedent; PACKET_STANDARD §"Change manifest"). At READY the rows name only what the
deliverable PRESERVES. `retiredSymbols`: **EMPTY**.

## §7 · JUDGMENT CALLS, VETOABLE

- **J-TEUC3-1 — ONE cavern row per licensed settlement.** The ground is one fact; the extent
  vocabulary carries the plurality (`system` is a cave network). Rejected: a row per published
  natural feature (needs a COUNT rule, and every candidate is an invented number — an R-3 tuning
  input this car refuses); a per-feature coin (a causeless flip the doctrine forbids at §311.6.1,
  and it makes the G-43 arm probabilistic). Reversal: widen the population inside the same array
  shape when a later car brings a countless data-grounded rule.
- **J-TEUC3-2 — the FNV root is IMPORTED from `src/kernel/proseHash.js`, not restated.** The first
  build defined `fnv1a32` locally (the MF-T2N precedent's shape) and RED `entropyRootCensus.walker`
  — its `hash-helper DEFINITIONS in src = 34` counter matched the name. That is a THIRD interior
  red, and the charter authorizes only two (§441.5(e)); its walker path is also RESERVED by MF-T2H
  at READY. The cure is REUSE, not renaming-around: the kernel leaf already exports the identical
  root and `src/domain/dossier/entityLinks.js` already imports it from the domain, so this leaf
  defines NO hash root, adds NO census row, and the counter stays at 34 with no walker edit. Only
  the Murmur finaliser is local (`avalanche32`, outside the census's name set) — the CURED
  spelling, because a raw `fnv % length` aliases onto a parity class. Behaviour proved identical
  across the change (probe diff empty). Reversal: restate the root and re-record 34 → 35 at the
  landing act if the chair prefers the counter to see it.
- **J-TEUC3-3 — a `surfaceJoins[]` entry is `{ kind, anchor }`.** §441.5(b) names "a joint kind …
  + the anchoring SURFACE feature" and fixes no key; the charter's UC-1 sketch writes `feature`
  in a "-class rows" hedge. `anchor` is chosen because the component row's own surface-feature
  field is already `anchor` (§311.8.1's ANCHOR) — one word, one meaning, across the train.
  **UC-1/UC-2/UC-4/UC-5 must converge on `anchor`, or the chair rules the other way at the landing
  act** (a one-key rename in this leaf and its acceptance).
- **J-TEUC3-4 — the flood refusal reads the CATALOG's own list, derived at load.** Over
  hardcoding `['marshlands','fertile_floodplain']` (a second truth that cannot follow the catalog)
  and over importing UC-0's `strataExistence.js` (not on the branch, and its forbiddance index is
  not exported). One SOURCE, two readers, zero restatements. When both cars are landed a follow-on
  may export UC-0's index and have this leaf import it; behaviour is identical either way.
- **J-TEUC3-5 — the `EXTENTS_BY_GROUND` grammar table is structural vocabulary, not tuning.** It
  names which closed buckets a ground class ADMITS; the seed picks within by uniform modulus. No
  weight, no threshold, no scalar. ⚠ **O3 watch recorded** (the MF-T2N J-TET2N-4 precedent): the
  chair or owner may still claim it for the §362.4 tuning signature, in which case the four bucket
  names and the two admissible sets are the whole surface to sign.
- **J-TEUC3-6 — the identity is `id` first, `name` second.** `id` is `idFromSeed(_seed)` (measured
  `s_<16hex>` on 210/210 real settlements, seed-stable), so a rename never moves the ground —
  THE PROMISE: the seed is the world. `name` serves only an un-normalised object; a nameless one
  still derives from its ground, so the deriver is total rather than lucky.

## §8 · RAISED — split OWNER / CHAIR, and DEFERRED

### Owner (visibility; nothing here blocks the landing)
- **Nothing new.** This member ships no user-visible surface (R-4 untouched), no generation-path
  write (R-2 untouched), no flag, no migration and no catalog edit. Its only tuning-adjacent
  surface is J-TEUC3-5's grammar table, raised there rather than here because it declares no
  scalar.

### Chair (recorded)
- **C-UC3-1 — the `{ kind, anchor }` join key** (J-TEUC3-3): the first car to write a
  `surfaceJoins[]` row fixes the spelling for the train. Ruled here, vetoable by a word.
- **C-UC3-2 — `jointVocabulary.js` is delivered by BOTH T-UC1 cars as identical bytes**: the
  landing act keeps one copy. Named in the header so the terminal does not read the second
  delivery as a conflict.
- **C-UC3-3 — the entropy-census avoidance is REUSE, not a rename** (J-TEUC3-2), recorded so the
  next undercity car reaches for `kernel/proseHash.js` rather than restating a root and
  discovering the counter the hard way.

### Deferred, with the ruling that parks it
- **D-UC3-1 — a richer cavern population.** One row per licensed settlement today (J-TEUC3-1);
  wakes when a countless, data-grounded multiplicity rule exists. The array shape already carries
  it.
- **D-UC3-2 — the `id`-precedence anchor rung.** Charter §441.5(k) prefers an institution's `id`
  when present; this member anchors on TERRAIN features, not institutions, so the rung does not
  arise here. Named so UC-2/UC-5 do not read its absence as an omission.
- **D-UC3-3 — coastal sea caves and desert lava tubes.** The geography data licenses neither
  (no `[D6 THE UNDERWAYS]` row, `stoneAvailability` `medium`), and inventing a license would be
  the second truth §1.1 refuses. Wakes only with a geography-data row, which is a G2 golden-
  shifting act.

## §9 · THE GATES, AND THE ATTRIBUTION OF EVERY RED — NO STOP RAISED

### §9.1 The §408 pre-gate sweep, mutexed and quiet
`npx vitest run tests/lint tests/build tests/ops` at the member tip →
`Test Files 4 failed | 179 passed | 7 skipped (190)`, `Tests 6 failed | 2113 passed | 114 skipped
(2233)`, SWEEP_TRUE_EXIT=1 in 93 s (load average 4.45 at start — a measured quiet trough, not a
process count). The six reds:

| red | attribution |
|---|---|
| `sovereigntyLightingContract.walker` census arm | **THE ONE NAMED INTERIOR RED**, this member's, deferred to the landing act by §417 |
| `clampPrimitiveBaseline` (1) | PRE-EXISTING |
| `warCostKindPools.walker` (3) | PRE-EXISTING |
| `warRulingKindPools.walker` (1) | PRE-EXISTING |

The five banked reds were re-run MUTEXED at the chair's `b10ed1a1` baseproof (read-only, own
`TMPDIR`, tree clean): `Test Files 3 failed`, `Tests 5 failed | 76 passed (81)` — the same five
TITLES and the same five AssertionError texts, `diff`-proved IDENTICAL to the tip's
(`expected [ …(5) ] to deeply equal [ …(10) ]`, three of `[ …(5) ] … [ …(6) ]`, and
`[ …(62) ] … [ …(75) ]`). **Strays: ZERO** — no classify-then-re-run was needed, and the §432
second-stray escalation did not arise.

### §9.2 What the lane found and cured in itself
Three authored defects, each caught by an executed instrument rather than by review:
1. **`typecheck:ratchet` +1** — TS2345 at the `nativeSemanticResourceKeys` call: the narrowed
   `s.config` is `object`, not `Record<string, unknown>`. Cured by a TYPED cast.
2. **`typecheck:domain:strict` +5** — two TS7053 (indexing `TERRAIN_DATA` by a `string`), two
   TS7006 (implicit-any callback params) and one TS2322. **Cured BY TYPEDEF** (a declared
   `TerrainRow` + a narrowing `terrainRow()` lookup + an explicit `typeof terrain !== 'string'`
   guard) — zero widening, zero suppression, zero `any`, the WF-1B/WF-1C law.
3. **`entropyRootCensus.walker` 35 vs 34** — the locally restated `fnv1a32`. Cured by REUSE
   (J-TEUC3-2). Behaviour proved identical across all three cures by a probe diff.
An authored ACCEPTANCE defect was also caught by its own first run: the `'auto'`-sentinel arm
assumed `terrainType: 'auto'` alone unresolves the ground, when `resolveTerrain`'s documented chain
falls through to `terrainOverride`. The arm now pins the override and sets both legs — the honest
reading of the sentinel guard, and a better pin than the one it replaced.

### §9.3 What the lane did NOT do
No full gate / `check:tail` (the terminal's act). No ref moved, no push, no stash, no `git add -A`,
no write in the main checkout, no consumer wired, no walker/baseline/exemption edit left standing,
no packet flipped that this lane does not own. The lane HOLDS.
