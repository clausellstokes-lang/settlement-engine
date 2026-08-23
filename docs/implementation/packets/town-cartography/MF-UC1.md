# Town cartography / MF-UC1 — the undercity's SANITATION LADDER and its wells: `deriveSewerLadder` derives which rung a settlement's drains reach, WHY, WHICH quarters they serve, and the wells its water need licenses — one truth with the dossier roster, keyed to the high-water tier, and dark

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `0f3897a56ba57201ca499651f963eb0d11b65761`
  ⚠⚠ **AS AUTHORED — the row above now names the LANDING SLOT (`0f3897a5`, the HK-A landing, the
  43rd; see §12 below); the BUILD base was `c129593816b13640e5740603ca3e51d68ee711fc`.** The
  continuation that follows was written at that BUILD base:
  — the UNDERCITY-STACK landing (ODQ §472.4: MF-UC0 → MF-UC3), read with `git rev-parse` at the
  lane's opening and re-read at every proof below. Every figure in this packet was executed at
  THIS base by the implementing lane TE-UC1; nothing is inherited from the charter
  (`draft-UNDERCITY-PLAN.md`, ruled ODQ §441, ratified §445.2) except where a row says so and
  names the re-derivation. ⚠ The charter states no census tuple on purpose (§441.5(e)); it is
  re-derived here. ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs:165`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Charter and rulings:** `draft-UNDERCITY-PLAN.md` §4 UC-1 (this member), §1 (the binding law
  quoted), §2 (the fabric-vs-engine split), §3 (the live estate and the license-home audit), §7 F2
  (the CT-4 fact contract this member produces), §8–§11. Doctrine citation: **ODQ §311** — and
  specifically **§311.7** (the sanitation ladder and its causes), **§311.6.1** (all
  cities/metropolises, only SOME towns, below that none), **§311.8.1** (the general form: LICENSE
  + ANCHOR + EXTENT DRIVER + TEMPERAMENT + CAUSED PORTALS), **§311.8.2(c)** (the SURFACE_COUPLED
  temperament: sewers per §311.7; wells/cisterns by water need, tier-scaled), **§311.2** (causal,
  never cosmetic — the caused portals), **§311.3** (the high-water law underground: dug is
  forever), **§311.7.3** (the seed-keyed middle-band draw). Ruled at **ODQ §441** — §441.1 (the
  one-truth roster rule), §441.2 (five live causes, the founding slot at zero weight), §441.5(b)
  (temperament + `surfaceJoins[]` on every row; wells MOVED here from UC-3), §441.5(d) (the
  first-paint closure), §441.5(g) (T2R read as ruled at §434), §441.5(k) (the anchor-key law),
  §441.6 (exposable-provisional tuning) — applied in place by TC-UNDERCITY-R2, **ratified at
  §445.2**. Also binding: **§443** (pulse-written keys route through `buildCalamityLedger`),
  **§469** (census-class "pre-existing" needs the RECEIVED-LIST DIFF), **§474** (a
  shared-namespace acceptance arm pins INTENT), **§475** (edge-bundle roster obligations).
- **Depends on:** **T2R (`MF-T2R`), LANDED at ODQ §472** — `deriveHighWater`,
  `src/domain/highWater.js`. This member reads it AS RULED at §434 (the `peakTier` stamp LEADS and
  the tier/population disagreement is the RESIDUAL; the calamity-path gap is a typed
  UNDERSTATEMENT the reader never invents) and inherits its DISPLAY-LAZY law by §443. **UC-0
  (`MF-UC0`), LANDED at ODQ §475/§472.4** — `SANITATION_LADDER` (the rung names),
  `sanitationRosterOf` (the ONE roster read this car shares with the existence gate),
  `institutionAnchorKey` (the canonical key), and `jointVocabulary.js`'s `isJointKind`. **UC-0's
  leaf is NOT edited:** seam D-UC0-3 is already an optional second argument
  (`deriveStrataExistence(settlement, { sanitationRung })`, `strataExistence.js:246`), and this
  member feeds it as landed — proven on 420 real settlements, 420/420. Otherwise this member
  depends on LANDED code only: the geography table (`src/data/geographyData.js`), the
  institutional catalog (`src/data/institutionalCatalog.js`), the tier constants
  (`src/data/constants.js`), the terrain resolver (`src/domain/resolveTerrain.js`), the corruption
  climate read (`src/domain/corruption.js`), the ruin filter
  (`src/domain/institutions/institutionRoster.js`), the calamity ledger
  (`src/domain/display/calamityLedger.js`), the facet chokepoint
  (`src/domain/spatial/cohesionWeave.js`), the codepoint order
  (`src/domain/deterministicSort.js`), the slug helper
  (`src/domain/worldPulse/stablePart.js`), the kernel hash (`src/kernel/proseHash.js`) and the
  kernel clamp (`src/kernel/math.js`).
- **Binds forward:** **CT-4** (the content train's undercity prose chapter, ODQ §361.1) consumes
  this member as charter **§7 F2** — `surfaceCoupled: { sewerLadder: { rung, rungSource, causes[],
  perQuarterCoverage }, wells[] }` — licensing the sentence class "why the drains exist / stop at
  the faubourg". The `rungSource` discipline CT-4 must keep is unchanged and now has its receipt
  on the record: **ROSTER_FULL_WEB** ⇒ cite the roster institution, by the CANONICAL KEY this
  member now returns in `rosterAnchors[]` (§441.5(k)); **TIER_FLOOR** ⇒ say the planned quarters
  drain; **DERIVED** ⇒ cite the winning cause(s) and the uncovered quarters. ⚠ **F2 is
  PROVISIONAL until the §362.4 tuning signature and EXPOSABLE-PROVISIONAL in the interim** (§7
  term 5, §441.6): CT-4 may compile against these defaults, and the owner may veto to "dark until
  signed" by a word. **D5** (the map program's strata wave) consumes the same facts through
  §287.4's StrataExistencePlan seam. **UC-5** (`MF-UC5`) consumes this member's `surfaceJoins[]`
  as the portal truth (one producer per join) and composes its rung into the spine-vs-archipelago
  character (§311.9). **UC-0's existence gate** consumes the rung through its optional second
  argument. None may re-derive a rung.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the file at
  `c1295938` by this lane (`shasum -a 256`) and identical to the value the charter carries, so no
  re-stamp occurred in the window. Its §P2 hazard dispositions, §P3 anchor preflight, §P5 census
  law, §P6 mutant hygiene, §P7 STOP set and §P8 capsule law bind this packet and are not restated.
  **Stamp: GRANTED at ODQ §312.2b** — the stamped column applies (eight members per engine train;
  T-UC1 has three, and this is its third and last). **No UC-PREAMBLE and no new family** (charter
  C-4 / §441.7).
- **Collision group:** `undercity` (the T-UC1 train, car 3 of 3). At this base the manifest holds
  **163 packets — 161 LANDED, one SUPERSEDED (`IA-2`) and ONE non-terminal** (re-counted by
  execution over the manifest at `c1295938`) — **MF-T2H is the READY one**; its flip to LANDED is
  the chair's pending act.
  **MF-T2H RESERVES BOTH census walkers** — `MODIFY
  tests/lint/sovereigntyLightingContract.walker.test.js` AND `MODIFY
  tests/lint/entropyRootCensus.walker.test.js`. This packet therefore does NOT reserve the
  lighting-census path (§417's T2J shape: the row rides this packet verbatim for the chair's
  landing act — see the census note). It DOES reserve `TEST
  tests/lint/ruinFilterRoster.walker.test.js`, which no packet holds at this base
  (`grep ruinFilterRoster docs/implementation/PACKET_MANIFEST.json` → 0 hits) — MF-UC0 re-recorded
  that arm's figure inside its own landing act without a manifest row, and this member reserves
  the path rather than repeating that. The two delivered code paths and this packet's own path are
  held by NO packet (`git ls-tree c1295938 -- src/domain/undercity/` carries only
  `jointVocabulary.js`, `staticComponents.js` and `strataExistence.js`). It reserves no `DOC` row
  for `docs/implementation/PACKET_MANIFEST.json` (the MF-T2Q/MF-T2N/MF-UC3 shape).
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves the
  branch. **This lane moved no ref, ran no `git stash`, never staged with `-A`/`-u`/`.`, never
  wrote in the main checkout, and never pushed.** Every commit ran with hooks ON, and after each
  one the committed blob was `shasum`-compared against the worktree blob — the pre-commit
  `eslint --fix` changed nothing on any commit, so every proof below ran against the committed
  bytes (§P3's re-prove-at-the-tip law).

> **`censusAuthorization`:** this packet moves the test census by
> **`+1 files / +0 parked / +1 credited / +8 titles / +1 suiteTitles`** — exactly the charter's
> predicted five-figure delta for a UC car. **Base tuple, RE-DERIVED at `c1295938`:
> `2510 / 365 / 2145 / 20817 / 5802`** (the UNDERCITY-STACK landing's re-record, ODQ §472.4).
> **After tuple, read from the walker's own failure message figure by figure and then CONFIRMED by
> a full green pass (33/33, exit 0) with the row applied: `2511 / 365 / 2146 / 20825 / 5803`.** ONE
> new acceptance file, `tests/domain/undercitySewerDerivation.test.js`, credited (one literal
> `describe`, eight straight-line `it`, no `.each`/`runIf`/nesting — loop-registered titles are
> refused because they are invisible to the census). Its authorizing decisions are **ODQ §311**
> (the undercity doctrine), **§359.3** (the OB-6 fold), **§431** (this dispatch) and **§441** (the
> ruling), under the charter's §4 census law. The family's stamp is **GRANTED** at ODQ §312.2b.
> **`parked` HELD at 365 and passed WITHOUT redding** during the sequenced walk — the receipt that
> the file is credited rather than parked.
>
> ⛔ **THE ROW IS DEFERRED TO THE LANDING ACT (ODQ §417, the T2J shape).** The walker edit was made,
> walked figure by figure, proved green, and then **REVERTED ON PURPOSE** at the member commit
> (walker blob restored digest-exact to
> `9b277324eacca30c377efb1d2caa2f9f4373ae845ed17100f661486719cc8f7a`); the row is inserted by the
> chair's landing act, so the census arm of `sovereigntyLightingContract.walker` REDS at this
> member's tip — **that is the ONE NAMED interior red (charter §4, preamble §P7.12), not a
> defect.** No other member-caused red stands at this tip (§7). The exact text to paste, replacing
> the `files: … suiteTitles: …` line inside the `CENSUS` object (at `:5782` at this base), is:
>
> ```
>     // ── RE-RECORDED 2026-08-23 BY TE-UC1 (MF-UC1), CAUSE ATTRIBUTED ──────────
>     // `files` 2510 → 2511, `credited` 2145 → 2146, `titles` 20,817 → 20,825,
>     // `suiteTitles` 5,802 → 5,803. `parked` is UNCHANGED at 365.
>     // ONE new acceptance file, tests/domain/undercitySewerDerivation.test.js, credited (one
>     // literal `describe`, straight-line `it`, no `.each`/`runIf`/nesting) carrying EIGHT arms —
>     //   ⭐ the §441.1 ROSTER RULE three ways over REAL settlements, plus the UC-0 seam
>     //   ⭐ the owner's own example: a flat dry town honestly gets cesspits, with no draw taken
>     //   ⭐ G-43: a dated calamity raises the rung and drains the rebuilt quarter — and the cause
>     //     reads THAT a calamity happened, never WHICH KIND (bucket-neutral by constitution)
>     //   ⭐ the HONEST FOUNDING arm: the NO_TYPED_HOME slot is a behavioural no-op on the whole
>     //     roster-free corpus, while each live cause moves the rung monotone in its direction
>     //   ⭐ the PER-QUARTER law: the planned quarters drain, the organic faubourg stays dry
>     //   ⭐ middle-band determinism, with the diced band proved non-empty first
>     //   ⭐ boundaries and totality: the absent floor, the certain threshold, "below that none"
>     //   ⭐ wells and cisterns: tier-scaled, licensed by the live catalog, temperament + joins
>     // `censusAuthorization`: ODQ §311 (the undercity doctrine), §359.3 (the OB-6 fold), §431
>     // (this dispatch), §441 (the ruling, ratified at §445.2).
>     // ⛔ ATTRIBUTED BY EXECUTION AT THIS BASE, figure by figure: each of the four moved numbers
>     //   was read from the arm's OWN failure message ("expected 2511 to be 2510", "expected 2146
>     //   to be 2145", "expected 20825 to be 20817", "expected 5803 to be 5802") and never
>     //   computed; `parked` passed at 365 without redding, which is the receipt that the new
>     //   file is credited. The five arms then passed together, 33/33, exit 0.
>     files: 2511, parked: 365, credited: 2146, titles: 20825, suiteTitles: 5803,
> ```
>
> ⚠⚠ **REBASE LAW (§457/§469) — AND IT ALREADY BIT, MEASURED BEFORE THIS LANE CLOSED.** The tuple
> above is a BUILD-BASE reading. `claude/composite-r4` moved out from under this member while it
> built: WEB-2 then WEB-3 landed, and at `64da7d5d163053bda3aef8ffa7358f5cf112cd26` the census
> literal reads **`files: 2512, parked: 366, credited: 2146, titles: 20826, suiteTitles: 5803`**
> (`:5859`) against this member's base reading of `2510 / 365 / 2145 / 20817 / 5802` (`:5782`).
> ⛔ Note `parked` moved to **366** — carrying this member's tuple across that landing would
> SILENTLY REVERT a landed park while every proof in this packet stayed green, which is exactly
> the failure the law names. **Carry only the DELTA `+1/+0/+1/+8/+1` and re-derive the whole tuple
> by execution at the landing slot.** The landing was characterized: it collides with this member
> on NO code path — the only overlap is the two standing meta files (`INDEX.md`,
> `PACKET_MANIFEST.json`), governed by the standing rebase laws — and it added no `src/domain`
> file, so the `ruinFilterRoster` figure below still reads 90 → 91 at that tip (`git diff
> --name-only c1295938 64da7d5d -- tests/lint/ruinFilterRoster.walker.test.js` is empty). That
> figure is nevertheless a COUNT: re-read it from the arm's own failure message at the slot. The same applies to the `ruinFilterRoster` figure below
> (90 → 91): it is a COUNT of `.institutions` readers in `src/domain`, and any sibling that lands
> a new reader first moves it.

---

## §1 · S0 — THE LICENSE-HOME AUDIT, RE-WALKED FIELD-LEVEL AT `c1295938`

Every row was walked at the line named, in THIS tree, by this lane. **CONFIRMED** = read at the
line; **NO TYPED HOME** = the doctrine named a field that does not exist (ruled, not a STOP).
**No row reads STOP.**

| # | license input (charter §4 UC-1) | home at `c1295938` (executed) | verdict |
|---|---|---|---|
| 1 | the `'Sewage system'` roster row | `src/data/institutionalCatalog.js:2225-2231` — `required: false, baseChance: 0.4, desc: 'Underground drainage. Rare but critical for health.', tags: ['sanitation'], priorityCategory: 'infrastructure'`, in the **city** block, group `Infrastructure`; rolled at metropolis too via `src/generators/steps/assembleInstitutions.js:243` `mergeCatalogs(institutionalCatalog['city'], institutionalCatalog['metropolis'])`. This car reads it ONLY through UC-0's `sanitationRosterOf` (`strataExistence.js:184`) — one truth, never a second read | CONFIRMED (§441.1) |
| 2 | `'Aqueduct or water system'` (the wells license) | `institutionalCatalog.js:2239-2245` — `required: true, baseChance: 1, exclusiveGroup: 'waterSupply', desc: 'Engineered water supply. Conduits, cisterns, fountains.', tags: ['essential', 'water']`, city block ⇒ **city and metropolis carry it BY CONSTRUCTION**, so the tier read IS the roster read. The acceptance pins that against the LIVE catalog (`required === true` in the city block, and `institutionalCatalog.town.Infrastructure['Aqueduct or water system'] === undefined`) rather than asserting it | CONFIRMED (§441.1) |
| 3 | the district 12-enum | `src/domain/districtProfile.js:33-37` `DISTRICT_CATEGORIES` = religious · merchant · military · craft · residential · noble · civic · arcane · criminal · foreign · industrial · other. **PINNED BY VALUE, not imported** (§441.5(d)): `districtProfile.js` pulls `factionProfile` / `causalState` / `activeConditions` / `threatProfile` behind it — a coupling a leaf on the display-lazy path refuses. The acceptance imports the REAL list and pins the two equal, so the copy cannot drift silently | CONFIRMED |
| 4 | prosperity band | `src/domain/corruption.js:528` `readCorruptionClimate(settlement)` → `{ crime, security, prosperity, hasCriminalInst, criminalInstitutions }`, with `prosperity = prosperityScore(eco.prosperity)` (`:502`, table `PROSPERITY_SCORE` `:495-499`, unknown → 0.4 middling). ⚠ `prosperityScore` is NOT exported — `readCorruptionClimate` is the one exported read, and this car consumes IT rather than minting a parallel band | CONFIRMED |
| 5 | civic capacity | the facet chokepoint `facetOf(inst, 'institutionNature') === 'civic'` (`src/domain/spatial/cohesionWeave.js:267` row `/\bhall\b\|court\|assembly\|council\|magistrat/`; chokepoint `:331`) — the READ MF-UC0 pinned (its packet row 8: facet-first, the clandestineFacet law). Custom-content parity by construction: a custom institution declaring the facet counts exactly like a catalog row. **Routed through `liveInstitutions` (§1.1)** | CONFIRMED |
| 6 | gradient + outfall | **GRADIENT:** `resolveSettlementTerrain` (`src/domain/resolveTerrain.js:57` — the ONE terrain read) over the seven published `TERRAIN_DATA` classes (coastal `:51`, riverside `:128`, mountain `:210`, forest `:312`, plains `:420`, hills `:525`, desert `:623`). ⛔ **NO published relief, elevation, slope or drainage field exists** — executed: `grep -n "waterAccess\|elevation\|drainage\|slope\|relief" src/data/geographyData.js` → two PROSE hits only (`:212`, `:577`). The gradient is therefore a declared GRAMMAR over the closed class vocabulary, exhaustiveness-pinned against the live keys, naming the two classes the data's own words describe as sloped ground (mountain `:212` "possibly in a valley or on slopes"; hills `:577` `[D6 THE UNDERWAYS]` "hill slopes and stony ground"). **OUTFALL:** READ, not tabulated — `TERRAIN_DATA[t].impliedTradeAccess` (`port` `:67` coastal, `river` `:143` riverside, `road` `:226`/`:328`/`:541`, `crossroads` `:436`/`:637`) unioned with the settlement's own `config.tradeRouteAccess`, tested against the published route vocabulary `ROUTE_TIER` (`src/domain/tradeRouteSemantics.js:83-97`) | CONFIRMED |
| 7 | plague/fire REBUILD events | `buildCalamityLedger(settlement)` (`src/domain/display/calamityLedger.js:62`) → `{ entries[], count, lastYear, totalDeaths, totalExodus }`. §443 is satisfied by construction: this leaf never NAMES `calamityHistory` (pinned by a comment-stripped source scan in the acceptance). ⚠⚠ **FINDING F-UC1-1 — THE CAUSE IS RE-TYPED.** `src/domain/spatial/calamity.js:260-262` is explicit: the stamp title is "BUCKET-NEUTRAL by constitution … the engine never asserts a disaster kind; the flavor hint is a separate persisted field a DM display may surface." Branching on `flavorSuggestion` would assert a kind the engine refuses to assert, so the cause is **A DATED CALAMITY IN THE IMMUTABLE RECORD**, read as the ledger's COUNT — never "a plague". The G-43 arm proves it: the same count under `'plague'`, under `'fire'` and under NO kind derives byte-identical ladders | CONFIRMED (cause re-typed) |
| 8 | high-water population | `deriveHighWater(settlement)` (`src/domain/highWater.js:183`) → `{ population, tier, window, demoted, deficit, evidence[], channels[], gaps[], understated, derivation }`; the peak is a declared FLOOR and `understated` is true whenever `gaps` is non-empty (§434). This car reads it ONCE and uses it TWICE — as the fifth live cause AND as the tier the ladder's floor and ceiling are keyed to, because built extent derives from the historical maximum (the constitutional high-water law). §434's gap rides out on the result as `highWaterUnderstated` rather than being absorbed | CONFIRMED (§441.5(g)) |
| 9 | founding kind (planned/charter/military) | `grep -rn 'founding\.kind\|foundingKind' src` → **0 hits at `c1295938`** (executed). Prose-regex on `founding.reason` is REFUSED BY NAME | **NO TYPED HOME (§441.2)** — the slot stays typed at ZERO WEIGHT marked `NO_TYPED_HOME`; R-7 wakes it |

### §1.1 · The two roster reads take DELIBERATELY DIFFERENT ruin dispositions

This car reads `.institutions` twice, and the two reads are dispositioned differently. Both
dispositions are stated in the leaf's own header, in the acceptance, and in the walker's
re-record note, so the ruin-filter walker's own documented "file-granular compliance" gap is not
being used to hide one.

- **The SANITATION read is RUIN-BLIND, on purpose.** It goes through UC-0's `sanitationRosterOf`
  over the raw roster — the same read the existence gate makes, which
  `tests/lint/ruinFilterRoster.walker.test.js:105` already exempts as *"existence-gate — §311.1
  sheet gate over the raw roster; §311.3 dug is forever (a ruined institution's seed is a fossil,
  not an absence)"*. **§441.1's one-truth rule requires it:** if the ladder filtered and the gate
  did not, the two cars would disagree about whether the sewer institution exists — the second
  truth the rule exists to forbid. A flattened sewage works means NEGLECTED drains, not un-dug
  ones. Pinned: a roster whose sanitation row carries `status: 'ruined'` still yields
  `rungSource: 'ROSTER_FULL_WEB'`.
- **The CIVIC-CAPACITY count is RUIN-FILTERED,** through `liveInstitutions`
  (`src/domain/institutions/institutionRoster.js:53`). That read is a crediting aggregation in the
  walker's own sense: a burnt-out moot hall is not civic capacity this year. Pinned: four halls
  give `CIVIC_CAPACITY = 1`; the same four with `status: 'ruined'` give `0`. Mutant **m7** (the
  filter removed) convicts it.

This makes the leaf **COMPLIANT** rather than exempt (it imports the accessor), so no exemption
row was added. The walker's reader COUNT nevertheless moves 90 → 91, re-recorded in the
MF-UC0 style at `tests/lint/ruinFilterRoster.walker.test.js:355` and read from that arm's own
failure message (*"expected 91 to be 90"*), never computed.

### §1.2 · The other five S0 checks

- **(b) EDGE-BUNDLE ROSTERS (§475).** Five `.meta.json` rosters exist:
  `supabase/functions/_shared/{aiCharter,aiGrounding,aiOutputSchema,analyticsEvents,intentAtlas}Bundle.meta.json`.
  Rostered files this member READS: `src/domain/corruption.js` (3 rosters),
  `src/domain/tradeRouteSemantics.js` (3, cited only — not imported by the leaf) and
  `src/domain/districtProfile.js` (aiGrounding, cited and pinned in the acceptance, not imported by
  the leaf). **This member MODIFIES none of them** — `git diff --name-only c1295938 -- src` returns
  exactly `src/domain/undercity/sewerDerivation.js`. ⇒ `npm run build:edge-shared` is NOT owed and
  `tests/edgeFunctions` does NOT join the sweep.
- **(c) GENERATOR GOLDEN.** `tests/fixtures/generator-golden-master.json` sha256
  `29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8` **BEFORE and AFTER** — the
  charter's expected digest, unmoved. Golden-inertness PROVEN, not asserted: `generatorGoldenMaster`
  passes at the tip and the manifest bytes are identical.
- **(d) THE OBSERVED-SHAPE READER WALKER (§443).** GREEN at base (1 file / 27 tests, exit 0) and
  GREEN at the tip. Pinned literals at `:737`:
  `{ reads: 1995, identities: 1409, files: 387, bankedReads: 60, taggedRows: 40 }` — UNMOVED. The
  leaf names only generation-written keys (`institutions`, `tier`, `population`, `config`, `id`,
  `name`) and reaches every pulse-written key through a LANDED reader (`buildCalamityLedger`,
  `deriveHighWater`, `readCorruptionClimate`).
- **(e) THE CENSUS TUPLE AT BASE.** `tests/lint/sovereigntyLightingContract.walker.test.js:5782` —
  `files: 2510, parked: 365, credited: 2145, titles: 20817, suiteTitles: 5802`.
- **(f) THE S0 BASE BATTERY, mutexed, exit 0:** `Test Files 9 passed (9)`, `Tests 138 passed (138)`
  — generatorGoldenMaster · observedShapeReaders.walker · sovereigntyLightingContract.walker ·
  negativeAssertionAnchor.walker · domainAnyCastBaseline · couplingInclusion.walker ·
  entropyRootCensus.walker · domainGeneratorsBoundary · sizeBaseline.

---

## §2 · THE CONTRACT

`deriveSewerLadder(settlement, opts = {})` → `{ rung, rungSource, rosterAnchors[], causes[],
perQuarterCoverage, wells[], temperament, surfaceJoins[], score, highWaterTier,
highWaterUnderstated, sourceKind }`. **TOTAL:** `null`, `undefined`, `{}`, a non-array roster, a
string `config` and a roster holding `null`/numbers all yield a typed result; nothing throws.
`opts.highWater` accepts a `deriveHighWater` result a caller has ALREADY computed — one truth, no
second read (the same optional-second-argument idiom UC-0 uses for the rung).

| field | meaning |
|---|---|
| `rung` | one of UC-0's `SANITATION_LADDER` — `cesspits \| culvert \| quarter_network \| full_web` |
| `rungSource` | `ROSTER_FULL_WEB` (the institution) · `TIER_FLOOR` (the floor raised it) · `DERIVED` (the causes decided) — all three live on the corpus |
| `rosterAnchors[]` | the CANONICAL institution keys (§441.5(k)) of the sanitation institutions the roster carries — CT-4's receipt for the ROSTER_FULL_WEB sentence. Empty on every other source |
| `causes[]` | six typed rows `{ cause, weight, direction, value, contribution, home }`; `home` names the live accessor the value was read through |
| `perQuarterCoverage` | a boolean per district-12 key, ordered by codepoint |
| `wells[]` | `{ kind, license, anchor, extent, temperament, surfaceJoins[], sourceKind }`. ⚠ The well extent is scaled by the SAME high-water tier the ladder uses, not by the current one — deliberately, for two reasons: wells and cisterns are BUILT infrastructure and §311.3's inertia law ("dug is forever") applies to them exactly as it applies to a main, and a car that read the tier two different ways would carry a second truth about what tier the settlement is. The anchor is drawn from the DRAINED quarters where any drain, else from all twelve — a town with no network draws its water everywhere |
| `temperament` | `SURFACE_COUPLED` on the ladder and on every well row (§311.8.2(c)) |
| `surfaceJoins[]` | one `grate` join per DRAINED quarter — caused by the coverage (§311.2); EMPTY at cesspits, which is lawful |
| `score` | 0..1, the weighted reading the derived rung stands on |
| `highWaterTier` / `highWaterUnderstated` | the tier the built extent is keyed to, and §434's typed shortfall carried rather than absorbed |

**The rule, in the owner's three sentences.** The ROSTER outranks everything: a sanitation
institution at any tier is a FULL WEB (§441.1). Otherwise the derived rung is banded between the
tier's floor and ceiling — `TIER_LADDER_BOUNDS`, a GRAMMAR keyed to the HIGH-WATER tier: **all
cities/metropolises** carry floor `quarter_network`; **only SOME towns** derive between cesspits
and quarter network; **below that none** (derived ceiling `cesspits`). At or below
`absentFloor` the rung is cesspits with NO draw; at or above `certainThreshold` it is the ceiling
with NO draw; between them the position is weighted-still-diced, seed-keyed off the settlement's
own identity, and the step is NON-DECREASING in the score for a fixed draw — which is what makes
each cause's declared direction a real monotonicity rather than a claim.

**Purity.** No `Date`, no `Math.random`, no `Intl`, no I/O. The only draw is a seed-keyed uniform
off the settlement's existing identity (the §311.7.3 idiom, UC-3's spelling). The FNV root is
IMPORTED from `src/kernel/proseHash.js` and the clamp from `src/kernel/math.js`, so this leaf
defines no hash root (the entropy census is unmoved) and no local clamp (the clamp baseline's
received list does not contain it). Iteration is ordered by `compareCodepoint`.
**`src/domain/undercity/**` imports no `src/domain/townMap/**`.** Zero `any` type tokens; the four
`any` strings in the file are English prose.

**Effective lines: 209** against the ≤250-per-leaf cap (eslint `max-lines`, `skipBlankLines` +
`skipComments`, the TET2K/TET2J method, re-measured at this base). **Zero existing production
files modified.**

---

## §3 · THE INSTRUMENT TABLE — predicted BEFORE the first edit, measured at the tip

| # | instrument | PREDICTED | MEASURED |
|---|---|---|---|
| I1 | `generatorGoldenMaster` + fixture `29c6cc8f…` | UNMOVED bytewise | ✓ identical before and after; test green |
| I2 | `observedShapeReaders.walker` (1995/1409/387/60/40) | UNMOVED | ✓ green at base and tip, literals unmoved |
| I3 | `sovereigntyLightingContract.walker` (2510/365/2145/20817/5802) | INTERIOR RED by design, exactly `+1/0/+1/+8/+1` | ✓ walked figure by figure to `2511/365/2146/20825/5803`, green 33/33, then REVERTED (§417) |
| I4 | `negativeAssertionAnchor.walker` | UNMOVED | ⚠ **RED at first authoring — 6 un-anchored negatives; CURED**, see §5 |
| I5 | `domainAnyCastBaseline` + `count-domain-any` | UNMOVED — zero `any` tokens | ✓ green |
| I6 | `typecheck:ratchet` / `typecheck:domain:strict` | both AT CEILING, exit 0 | ⚠ **RED at first authoring — 3 then 1 error; CURED BY TYPEDEF**, see §5. Final: 173/173 and 1134/1134, exit 0 |
| I7 | `couplingInclusion.walker` | UNMOVED — `src/domain/undercity/**` is outside CENSUS_SCOPE_RE | ✓ green |
| I8 | `entropyRootCensus.walker` | UNMOVED — `fnv1a32` REUSED from the kernel (the UC-3 J-TEUC3-2 lesson, taken pre-emptively) | ✓ green |
| I9 | `domainGeneratorsBoundary` | UNMOVED — imports `src/data/**`, `src/domain/**`, `src/kernel/**` only | ✓ green |
| I10 | `sizeBaseline` + eslint `max-lines` | UNMOVED — new files carry no baseline row; leaf ≤250 | ✓ green; leaf 209 effective |
| I11 | `clampPrimitiveBaseline` (baseline 62) | UNMOVED — kernel `clamp`, never a local one | ✓ PRE-EXISTING RED, received-list diff in §7 |
| I12 | `ruinFilterRoster.walker` (90 readers) | AT RISK — the leaf reads the roster | ⚠ **RED: 90 → 91.** Cured by COMPLIANCE (`liveInstitutions`) + a re-record read from the arm's own failure message; §1.1 |
| I13 | `validate:packets` | 163 → 164, green at DRAFT and at the terminal status | ✓ `valid: 164 packets (1 READY)`, exit 0, at BOTH statuses |

---

## §4 · THE ACCEPTANCE — eight arms, one literal `describe`, straight-line `it`

`tests/domain/undercitySewerDerivation.test.js`. Every arm runs over REAL generated settlements
(`generateSettlementPipeline`, fixed seeds; a 42-world corpus of six tiers × seven terrains, each
terrain paired with its honest route). The counterfactual arms change ONE stored input. Every
vocabulary arm is pinned against the LIVE estate — the catalog, `DISTRICT_CATEGORIES`,
`TERRAIN_DATA`, `TIER_ORDER`, UC-0's `SANITATION_LADDER` — never against the leaf's own copy.
Every scanned negative carries its `// anchored:` line on the IMMEDIATELY PRECEDING line.

| # | arm | what makes it non-vacuous |
|---|---|---|
| A1 | the §441.1 ROSTER RULE three ways + the UC-0 seam | guard-the-guard against the LIVE catalog row, and the corpus is PROVED to contain both roster-bearing and roster-free cities before any leg runs; the seam is checked on all 42 worlds |
| A2 | the owner's own example: a flat dry town gets cesspits | the gradient cause is pinned to value 1 / direction LOWERS / negative contribution; the rung is cesspits with NO DRAW (score ≤ the absent floor, six identities agree); the one-input counterfactual raises the score strictly at each step, and on a second real town moves the rung cesspits → culvert |
| A3 | G-43: a dated calamity raises the rung and drains the rebuilt quarter | the before-state is pinned at cesspits with `civic` uncovered; the after-state gains the rung, the coverage AND the grate; and the identical ladder under `'plague'`, `'fire'` and NO kind is what makes the bucket-neutral claim executed rather than asserted |
| A4 | the HONEST FOUNDING arm + monotonicity + the ruin dispositions | the behavioural no-op LEADS (both perturbation spellings, over all 42 roster-free worlds) so it cannot pass behind a constant pin; monotonicity is measured over the whole corpus per cause — never moves the wrong way, and moves the right way SOMEWHERE (the sweep's liveness, pinned) |
| A5 | the PER-QUARTER law | the 12-enum copy is compared ordered against the REAL `DISTRICT_CATEGORIES`; the covers are proved to NEST; the drained/dry partition is pinned by exact sorted lists; every drained quarter carries its own grate and only those |
| A6 | middle-band determinism | the diced band is proved NON-EMPTY on the corpus first, so the determinism claim is about a path that runs; clone, rename and regeneration-from-seed all agree; a fresh identity re-rolls only inside the band |
| A7 | boundaries and totality | the absent floor and the certain threshold are each proved draw-independent across six identities; the owner's "below that none" is pinned behaviourally AND structurally (a village with every raising cause maxed still gets cesspits); the tier and well grammars are pinned exhaustive against `TIER_ORDER`; the fall-line set is a positive control plus a NAMED exclusion set (§474); garbage yields a typed result |
| A8 | wells and cisterns | the license is read from the LIVE catalog (`required: true` in the city block, absent from town); the extent is proved non-decreasing up `TIER_ORDER` and strictly wider at the top; the cistern appears exactly at city+; every row carries `SURFACE_COUPLED`, one `stair\|well-house` join, and an anchor from the 12-enum |

**Result: 8/8 green, exit 0** (mutexed, at the shipped blob).

---

## §5 · THE MUTANTS — seven drives, seven convictions, all restored digest-exact

Driven at the SHIPPED leaf blob `f3b6d2637c6b998514e9f2046499f8c41eb86dc8147976c6033c63cd2c9b0c53`
with a clean control green at BOTH ends. Every restore was `shasum`-compared, not assumed.

| # | mutant | convicted at |
|---|---|---|
| m1 | the roster rule INVERTED (`roster.length > 0` → `=== 0`) | A1, plus 6 further arms |
| m2 | a cause's DIRECTION FLIPPED (`GRADIENT_OUTFALL: 'LOWERS'` → `'RAISES'`) | A2's `contribution < 0`, plus 3 further arms |
| m3 | the city FLOOR DROPPED (`city floor 2` → `0`) | A1's floored rung, plus A5 |
| m4-INERT | the founding slot given WEIGHT ONLY (`0` → `0.20`) — **the brief's spelling, MEASURED BEHAVIOURALLY INERT**: the slot's value is a literal `0`, so a weight alone moves nothing | the CONSTANT pin only; the behavioural pins PASSED — recorded, then REPLACED |
| **m4** | the founding slot given weight **AND a live `founding.kind` read** — the convicting replacement | **A4's behavioural no-op**, the perturbed rungs parting from the unperturbed ones |
| m5 | the quarter-network cover WIDENED to `residential` | A5's drained/dry partition |
| m6 | the sub-town derived CEILING raised (`village ceiling 0` → `2`) | A7's maxed village |
| m7 | the ruin filter REMOVED from the civic count (`liveInstitutions(s)` → the raw roster) | A4's ruin-disposition pin |

⭐ **THE INERT MUTANT FOUND A REAL WEAKNESS AND IT WAS CURED, NOT PAPERED (J-TEUC1-2).** The first
m4 convicted at a CONSTANT pin that sat AHEAD of the behavioural one, so the behavioural no-op
claim was never reached — a conviction by table self-pin proves nothing about behaviour. Arm A4
was REORDERED so the behavioural claim leads, and widened from one settlement to the whole
roster-free corpus in two perturbation spellings; the mutant was then replaced by the convicting
spelling. Both drives are on the record above.

---

## §6 · THE TUNING DEFAULTS AND THEIR PROVENANCE (§441.6 — PROVISIONAL / EXPOSABLE-PROVISIONAL)

`SEWER_DERIVATION_TUNING` is the ONE tuning surface: bounded, typed, frozen, owner-retunable —
the `UNDERWAYS_TUNING` precedent — and a **REGISTERED TUNING-PASS INPUT (charter §8 R-3)**. The
grammar tables beside it (`TIER_LADDER_BOUNDS`, `QUARTER_COVERAGE_BY_RUNG`, `FALL_LINE_TERRAINS`,
`WATER_ROUTE_VALUES`, `WELL_NEED_BY_TIER`) name which buckets are REACHABLE, never a weight — the
UC-3 `EXTENTS_BY_GROUND` precedent — and are not tuning.

**THE DEFAULTS WERE CHOSEN BY MEASUREMENT, NOT REMEMBERED.** This lane generated a **420-settlement
corpus at this base** with `generateSettlementPipeline(cfg, null, { seed, customContent: {} })` —
6 tiers × 2 cultures × 7 terrains × 5 seeds, each terrain paired with its honest route (the
golden corpus's own `TERRAIN_ROUTE`) — and drove four candidate weight sets over it. The second
pass added the tier ceiling and measured **CAUSE LIVENESS**: how many of the 420 settlements
change rung between a cause's two extremes. A weight that moves nothing is decorative.

| candidate | prosperity / civic / calamity / highWater − gradient | town cesspits:culvert | flat+dry towns → cesspits | liveness pros/civic/cal/hw/grad/**founding** | the four ruled invariants |
|---|---|---|---|---|---|
| A | .30 / .25 / .15 / .30 − .35 | 51 : 19 | 30/30 | 38 / 30 / 29 / 50 / 68 / **0** | all true |
| **B — CHOSEN** | **.25 / .25 / .15 / .35 − .30** | **51 : 19** | **30/30** | **50 / 34 / 29 / 65 / 68 / 0** | **all true** |
| C | .30 / .20 / .15 / .35 − .40 | 56 : 14 | 30/30 | 24 / 21 / 24 / 58 / 68 / 0 | all true |
| D | .35 / .20 / .15 / .30 − .25 | 32 : 38 | **24/30 — REFUSED** | — | the flat-dry invariant FAILS |

**B was chosen** because it satisfies all four ruled invariants AND maximizes the liveness of
every raising cause, with `HIGH_WATER_POPULATION` the heaviest raising weight — the precedence the
constitutional high-water law itself asserts. The three other raising weights plus high water sum
to exactly 1. **D is REFUSED BY MEASUREMENT:** the owner's own example ("a flat dry town honestly
gets cesspits") fails on 6 of its 30 flat-and-dry towns.

**The four ruled invariants, all `true` under B on all 420, re-verified by driving the SHIPPED
LEAF over the same corpus** (not a parallel implementation — the leaf reproduces the swept table
exactly): `cityFloor` · `fullWebIffRoster` · `townCapped` · `subTownNone`, plus `deterministic`
and `wellsWellFormed`, and the **UC-0 seam at 420/420**.

**Rung table under B (420 real settlements):** thorp / hamlet / village 70:0:0:0 each · town
51 cesspits + 19 culvert (the owner's "only SOME towns" = 27%) · city 38 quarter_network +
32 full_web · metropolis 25 quarter_network + 45 full_web. `rungSource` DERIVED 284 / TIER_FLOOR 59
/ ROSTER_FULL_WEB 77 — **all three sources live.**

**The zero-weight founding slot measured INERT on all 420** (liveness **0**) — the corpus-scale
receipt behind A4.

⚠ **STATED, NOT HIDDEN:** `CALAMITY_REBUILD` reads 0 on the whole GENERATED corpus, because
`calamityHistory` is pulse-written and a freshly generated world carries none. Its liveness figure
of 29 comes from the extremes probe, and its lit path is pinned by the G-43 acceptance arm on a
ledger fixture. The cause has a live home and a live branch; it is simply dark until a world is
pulsed.

**Non-weight constants and why they are where they are:** `civicSaturation: 4` (four civic
institutions is a full civic apparatus at town+ on this corpus), `calamitySaturation: 3`,
`cesspitFailurePopulation: 2000` (the high-water line above which cesspits stop coping — inside
the landed `town` band, 901–5000), `highWaterSaturation: 12000` (inside the landed `city` band,
5001–25000), `absentFloor: 0.10` / `certainThreshold: 0.90` (the ABSENT and CERTAIN bands §311.7.3
names, leaving an 80-point diced middle). **Every one of these is a TUNING-PASS INPUT and may be
re-signed with the rest at §341/§362.4.**

---

## §7 · THE §408 SWEEP, CLASSIFIED — with received-list diffs (§469)

`vitest run tests/lint tests/build tests/docs tests/ops tests/domain tests/property tests/data`,
mutexed. `tests/edgeFunctions` is NOT in the sweep: no rostered edge-bundle input file is modified
(§475, §1.2(b)).

**First sweep (before the two cures): 8 files / 11 tests failed** of 1,274 files / 17,570 tests.

| red | classification |
|---|---|
| `tests/docs/enforcement-claims.test.js` (6 rows) | **BANKED.** All six rows are `docs/FABLE_VALIDATION_QUEUE.md`, `docs/GOLDEN_SHIFT_LEDGER.md` and `docs/implementation/packets/foreign-policy/IN-0C.md` — files this member does not touch |
| `tests/lint/warCostKindPools.walker.test.js` ×3 | **BANKED** |
| `tests/lint/warRulingKindPools.walker.test.js` ×1 | **BANKED** |
| `tests/domain/metronomeCooldownLint.test.js` ×1 | **BANKED** |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | **THE ONE NAMED INTERIOR RED, MINE, DEFERRED BY §417** |
| `tests/lint/clampPrimitiveBaseline.test.js` | **PRE-EXISTING — proven by RECEIVED-LIST DIFF, §7.1** |
| `tests/lint/negativeAssertionAnchor.walker.test.js` | **MINE — CURED**, §7.2 |
| `tests/lint/ruinFilterRoster.walker.test.js` ×2 | **MINE — CURED**, §1.1 and §7.2 |

### §7.1 · `clampPrimitiveBaseline` — the RECEIVED-LIST DIFF (§469)

The arm is `expect(baseline).toEqual(currentDefFiles)`; baseline = 62 rows (the frozen JSON),
current = 75 files that still define a local `clamp`/`clamp01`. **Executed, both directions:**
`ADDED (received ∖ baseline)` = the pre-existing rows `src/domain/townCartography/cartographyBuildings.js`,
`cartographyMultiplicity.js`, `src/domain/worldPulse/conquest{DoctrineStage,Execution,Feasibility,Intent}.js`,
`dispositionLedger.js`, `dispositionProfile.js`, `razing.js`, `razingExecution.js`,
`razingWitness.js`, `warAllianceRisk.js`, `warCoalitionDecision.js`;
`REMOVED (baseline ∖ received)` = **0**. **My leaf is not in the received list, and defines no
local clamp** (both executed as booleans: `false`, `false`).

**And the red reproduces at base by construction, not by claim:** the scan's ONLY input is
`src/**`, and `diff <(git ls-tree -r c1295938 --name-only -- src) <(git ls-files -- src)` is
exactly one line — `> src/domain/undercity/sewerDerivation.js` — a file proven absent from the
definer list. The comparison is therefore byte-identical to the one at base. **A DEFERRED ROW
(D-UC1-3) records the 13 un-baselined definers for whoever owns that ratchet; this member does not
widen a baseline it did not move.**

### §7.2 · The two member-caused reds, and what they taught

- **`negativeAssertionAnchor.walker` — 6 un-anchored negatives.** The walker accepts
  `// anchored:` only on the line IMMEDIATELY PRECEDING the assertion
  (`negativeAssertionAnchor.walker.test.js:112`, `ANNOTATION_RE.test(lines[i - 1])`). The first
  authoring put `// anchored:` on the FIRST line of two-line comments, so the preceding line was
  the continuation. **Cured** by moving the marker to the LAST line of every multi-line anchor;
  all nine scanned negatives verified by an executed per-line check. Green.
- **`ruinFilterRoster.walker` ×2.** The leaf enrolled as a `.institutions` reader. **Cured by
  COMPLIANCE, not by exemption** — the civic count now routes through `liveInstitutions`, which is
  also the semantically right answer (§1.1) — and the reader COUNT re-recorded 90 → 91 from the
  arm's own failure message. Green.

**FINAL FULL SWEEP AT THE SHIPPED TIP** (`tests/lint tests/build tests/docs tests/ops tests/domain
tests/property tests/data`, mutexed): **`Test Files 6 failed | 1261 passed | 7 skipped (1274)`,
`Tests 8 failed | 17448 passed | 114 skipped (17570)`.** The eight are exactly:
the six `enforcement-claims` rows (BANKED — the received list is the IDENTICAL six, re-checked
AFTER this packet was written, and none names this member), `metronomeCooldownLint` (BANKED),
`warCostKindPools` ×3 and `warRulingKindPools` (BANKED), `clampPrimitiveBaseline` (PRE-EXISTING,
§7.1) and **`sovereigntyLightingContract.walker` — the ONE named interior red, mine, deferred by
§417.** A per-block scan of every failure for the strings `undercity` / `sewerDerivation` /
`MF-UC1` returns **0 rows in all eight**. `negativeAssertionAnchor.walker` and
`ruinFilterRoster.walker` — the two member-caused reds the first sweep found — are GREEN.

An earlier ten-instrument tip battery over the same cures read `Test Files 10 passed (10)`,
`Tests 125 passed (125)`, exit 0.

**Both typecheckers, by name, bare, captured, verbatim:**

```
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).
```

`npx eslint` on all three touched files exits 0 with an EMPTY report — no error and no warning
(the first authoring carried one unused-import warning, cured by using the import for
`rosterAnchors[]` rather than by deleting it).

⚠ **THE TYPECHECK CURE WAS A TYPEDEF, NOT A WIDENING (the WF-1B/WF-1C law).** The first authoring
carried three errors, then one. The cure declares the leaf's input as the estate's own
`SimSettlement` intersected with the calamity key spelled the way `highWater.js`'s own
`HighWaterInput` spells it — because `buildCalamityLedger` takes a WEAK type and TypeScript refuses
a weak-type argument that declares none of its properties. **Zero `any` type tokens were added and
no baseline was touched.** Declaring the key is not a second truth: the VALUE is still read only
through the banked ledger projection.

---

## §8 · DELIVERED FILES — committed-blob SHA-256

| action | path | committed-blob sha256 | effective |
|---|---|---|---|
| CREATE | `src/domain/undercity/sewerDerivation.js` | `f3b6d2637c6b998514e9f2046499f8c41eb86dc8147976c6033c63cd2c9b0c53` | 209 |
| CREATE | `tests/domain/undercitySewerDerivation.test.js` | `04289ab842f877a606a59dda4eed1150046f6cffe53514012a9660c3845187c8` | — |
| TEST | `tests/lint/ruinFilterRoster.walker.test.js` | `cf0d8c36f1dcccc8601dc8c6d262ae220dd6c7ac7e32b52bea55c2c681bbe7b2` | +13 comment lines, 1 figure |
| DOC | `docs/implementation/packets/town-cartography/MF-UC1.md` | this file | — |

`tests/lint/sovereigntyLightingContract.walker.test.js` is **NOT** delivered — it was walked and
REVERTED digest-exact to `9b277324eacca30c377efb1d2caa2f9f4373ae845ed17100f661486719cc8f7a`
(§417). `tests/fixtures/generator-golden-master.json` is unmoved at
`29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8`.

**C0 scan: 0. Exact `CLAIM_RE` (`tests/docs/enforcement-claims.test.js:40`) over this file: 0.**

---

## §9 · REDS AT THIS MEMBER'S TIP

**Exactly one:** the census arm of `tests/lint/sovereigntyLightingContract.walker.test.js`, the
row deferred to the landing act by §417. Every other red the §408 sweep reported is either banked
(the six enforcement-claims rows, the three `warCostKindPools` arms, `warRulingKindPools`,
`metronomeCooldownLint`) or pre-existing with an executed received-list diff
(`clampPrimitiveBaseline`, §7.1). **No STOP was reached:** every charter STOP condition was
checked — no license input lacked a live home (the founding slot is ruled not a STOP, §441.2);
no generation-path write was needed (R-2 untouched, the golden bytewise identical); no catalog
edit; no validator edit; no shared-path reservation that a split promotion would be needed for.

---

## §10 · DEFERRED ROWS (deliberately deferred — documented, not bugs to re-find)

| row | what | wakes when |
|---|---|---|
| D-UC1-1 | **The lit-vintage per-quarter refinement.** The charter's "mains extend only under rings whose vintage postdates the works (reads surface epoch vintage where lit; dark ⇒ tier default, honestly coarse)" — this member takes the DARK branch by construction. Executed reason: `urbanFabricKernel.js` carries district deposit ledgers, scars and rebirths keyed to a `worldState` a settlement-only pure deriver is never handed, and no settlement-local ring VINTAGE fact exists at this base. The coverage is therefore the rung's declared cover set — the charter's own "tier default, honestly coarse" | a settlement-local vintage fact exists, or a consumer hands this deriver the world state |
| D-UC1-2 | **The founding-kind slot** (`FOUNDING_CHARTER`, weight 0, `NO_TYPED_HOME`) — carried typed so the shape is right, and pinned inert | R-7 lands a typed `founding.kind` on the generation path (the endgame's ONE REGEN is its vehicle) |
| D-UC1-3 | **`clampPrimitiveBaseline` carries 13 un-baselined local-clamp definers** (§7.1's ADDED list) — a pre-existing ratchet drift this member neither caused nor cured, recorded so the next reader does not re-derive it | whoever owns that ratchet re-records it; not this train's |
| D-UC1-4 | **`rosterAnchors[]` returns the registry's stable NAME key, never `inst.id`** — inherited from UC-0's D-UC0-1: no writer produces `id` on an institution at this base | the entity-registry migration mints institution ids |

---

## §11 · JUDGMENT TABLE (this lane's, vetoable by a word)

| # | call | the crux |
|---|---|---|
| J-TEUC1-1 | A `surfaceJoins[]` entry is `{ kind, anchor }` | the LANDED sibling UC-3 ships that spelling (`staticComponents.js:81-84`, J-TEUC3-3); the charter's UC-1 sketch writes `{ kind, feature }`-class, and UC-5 consumes every car's joins as ONE shape — following the landed sibling is the only reading with one truth |
| J-TEUC1-2 | The inert mutant was cured by REORDERING the arm, not by accepting a constant-pin conviction | a conviction at a table self-pin standing ahead of the behavioural pin proves nothing about behaviour; §417's standard is a convicting spelling, and the arm had to earn it |
| J-TEUC1-3 | The CALAMITY cause reads the ledger's COUNT, never the flavor kind | `calamity.js:260` is constitutional: "the engine never asserts a disaster kind". The charter's "plague/great-fire REBUILD" names the doctrine's motivating case, not a branch on a DM hint |
| J-TEUC1-4 | The tier floor and ceiling are keyed to the HIGH-WATER tier, not the current one | built extent derives from the historical maximum — `highWater.js`'s own constitutional law. A city that peaked and shrank still has the drains it built (§311.3, dug is forever) |
| J-TEUC1-5 | `GRADIENT_OUTFALL` declares **LOWERS** and carries the IMPEDIMENT | it is the owner's own framing ("a flat dry town honestly gets cesspits" — a positive impediment, not a missing benefit), and it is what makes the closed 2-direction vocabulary LIVE on every world instead of leaving `LOWERS` a shape the corpus never produces |
| J-TEUC1-6 | The sanitation read stays RUIN-BLIND while the civic count is RUIN-FILTERED | §441.1's one-truth rule versus the walker's crediting class; both are stated in the leaf, the acceptance and the walker note rather than resting on file-granular compliance (§1.1) |
| J-TEUC1-7 | The district 12-enum is a PINNED COPY with an ordered-equality drift ratchet in the acceptance | §441.5(d) forbids the import path's coupling; §474 asks for intent over list-equality, but this list is this file's own COPY of a list another module owns, where equality IS the intent |
| J-TEUC1-8 | The gradient grammar is a declared table over the published terrain vocabulary | the estate stores no elevation, relief or drainage field (executed); inventing a number would be a second truth, and the table is exhaustiveness-pinned against the live keys with its exclusion set named |

---

## §12 · THE LANDING SLOT (TE-UC1-LANDING, 2026-08-23 — slot `0f3897a5`, the HK-A landing, the 43rd)

- **Rebase:** `git rebase --onto 0f3897a56ba57201ca499651f963eb0d11b65761 c129593816b13640e5740603ca3e51d68ee711fc 53d7e492…`,
  detached, the eight holding commits carried as authored. **Carry-proof at blob level FIRST**
  (braced `${sha}:path`, with non-vacuity controls): of the six member paths, **two moved** at the
  slot — `docs/implementation/INDEX.md` (`e573162c9a` → `eb0bc0776b`) and
  `docs/implementation/PACKET_MANIFEST.json` (`ad7fa79486` → `11a37fe4c5`); three did not exist at
  either end (this car creates them); and ⭐ `tests/lint/ruinFilterRoster.walker.test.js` was the
  **SAME blob** `f990edcee9` at base and slot, so the `90 → 91` re-record still applied. Controls:
  `package.json` `2b5ec2014c` and `package-lock.json` `1a8a80b12b` identical at base and slot (**no
  mint trigger crossed**), and a nonexistent path resolved ABSENT at both. `tests/lint/sovereigntyLightingContract.walker.test.js`
  moved at the slot as expected and is base-identical in the holding (the §417 revert), so the
  member never touched it in the rebase. **§475:** all four member-src spellings hit **0** of the
  five `supabase/functions/_shared/*.meta.json` input rosters (control `cohesionWeave.js` hits 3),
  so no `build:edge-shared` is owed.
- **The rebase stopped exactly once**, at 6/8, on exactly the two expected paths, one hunk each.
- **Surgery:** manifest = the slot's bytes plus this row appended by string surgery from the
  holding commit's own insert bytes, never re-serialized — the predecessor row's closing brace
  gained the one comma JSON requires. Deep-compare **165 → 166, ADDED=["MF-UC1"], REMOVED=[],
  DRIFTED=[]**, and the inserted block is byte-identical to the authored one
  (sha256 `6fec52a3b09c08c3238c4195ee16966b…`, 15,315 B). INDEX keep-both, this row at the
  "Current packet set" head above WEB-2 (newest-first order), the added line `cmp` 0 against the
  authored line — **no slot row moved**.
- **The status walk:** READY → LANDED at the re-stamp; `verifiedBase` → the slot sha, scoped to
  this row's span. `requiredSymbols` 9 → 14: the delivered `deriveSewerLadder`; the catalog's
  `'Sewage system'` (the row §441.1's one-truth rule stands on) and `'Aqueduct or water system'`
  (the wells licence); the acceptance suite's one literal `describe`; and the ruin-filter
  disposition MARKER this car is the cause of. ⛔ The marker is pinned and **never the count** —
  a re-recorded FIGURE in `requiredSymbols` is refused by the estate's own law (ODQ TE-26), and
  that count moves the moment any sibling lands a reader. The high-water and calamity-ledger
  reads were already pinned at READY and were not duplicated.
- **The census row, written ONCE here and re-derived by execution (§420/§457/§469/§480.2):** the
  slot read `2512/366/2146/20830/5804`; the DELTA `+1/+0/+1/+8/+1` that crossed re-derives to
  **`2513/366/2147/20838/5805`**, and each of the four moved figures was read from the arm's own
  failure message in assertion order, never computed. `parked` PASSED unmoved at **366** — WEB-2's
  park, which carrying this member's build tuple would have silently reverted. The walked figures
  equal the carried delta exactly, so no title was swallowed by a parked file. Two negative
  controls and the file's byte-identical restore are in the lane receipt.
- **The roster count re-read at the slot, as the packet's own rebase note required:** the arm's
  message convicts `expected 91 to be 90` with the slot's figure put back, and passes at 91 — so
  the base's 90 was still right and no sibling landed an `.institutions` reader under `src/domain`.
- **S0, the gates and the terminal:** the two-part S0 reading, the mutexed re-proofs, the widened
  sweep classification and the full bare `npm run check:tail` verdict lines are recorded in the
  lane receipt (`laneTEUC1-receipt.md`, "THE LANDING SLOT").
- **Landing judgments (vetoable):** J-UC1L-1 one landing-act commit rather than three; J-UC1L-2 the
  INDEX status cell flipped READY → LANDED — ⭐ NOT cosmetic: `validate:packets` cross-checks the
  index's own STATUS column against the manifest (`indexStatuses`, reached through the manifest's
  `indexPath`), so a manifest-only flip is a RED. A first draft of this note claimed no test read
  that column; the validator's message corrected it before the commit;
  J-UC1L-3 the five `requiredSymbols` additions above, and the choice of a marker over a count.
