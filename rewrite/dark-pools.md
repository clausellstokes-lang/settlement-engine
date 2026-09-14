# THE DARK POOLS — defect or dead, settled per pool

Seat: Opus INVESTIGATOR, 2026-09-13. Brief: `$SC/kit/briefs/brief-dark-pools.md`.
Measurement it rests on: `$SC/kit/rewrite/pool-rates.md`.
READ-ONLY against the DEF-2 dock `laneRW-DEF2` @ `49183bafe` (`git status --porcelain` = 0
lines at first read and at last). Nothing was written, staged or committed in the dock.
Every probe below ran from `$SC/darkpools/`, importing the dock's modules by absolute path.

## ⛔ THE PROBE RECIPE — AND THE TRAP THAT VOIDS IT

`generateSettlementPipeline(config, importedNeighbour, options)`. **The seed goes in
`options.seed`, an OBJECT in the THIRD slot.** A first cut of the probe here passed the seed
as a bare string third argument; the pipeline's fail-closed guards (which catch the seed in
slot 1 and slot 2) do not catch a STRING in slot 3, so `options.seed` was `undefined`,
generation fell through to `generateSeed()`, and two runs of the same 768-town grid returned
different counts (plagued 233 vs 222). Corrected, the probe is exactly deterministic and
reproduces `pool-rates.md` row for row. ⚠ A probe that does not reproduce a known measured
row is not yet a probe.

Reproduction achieved (probe → `pool-rates.md` table):
DS-DEF-2 internal 384 / 304 / 80 = rows 28 / 48 / 168 EXACT ·
disaster 353 / 275 / 109 / 31 = rows 31 / 53 / 140 / 196 EXACT ·
beasts `plagued, perimeter but NO force` 42 = row 192 EXACT, `frontier, force without a
perimeter` 21 = row 204 EXACT, `settled, nothing organized` 116 = row 129 EXACT.

---

# ⭐ THE DS-DEF-2 THREE — the batch waits on these

| block | pool | class | VERDICT | ground | what the chair should do |
| --- | --- | --- | --- | --- | --- |
| DS-DEF-2 | Beasts & Monsters: plagued, NO perimeter and NO force | SILENT | **OUT OF GRID** | The generator refuses to BUILD such a town (`src/generators/threatDefensePolicy.js:72-92`), but a campaign can MAKE one by ruining the walls, and the desk then produces the key. PROBED, key returned. | **write it after a corpus that reaches it — DO NOT STRIKE IT** |
| DS-DEF-2 | Internal Security: detention without process | SILENT | **DEAD BY CONSTRUCTION** | A prison-keyword institution exists at NO tier below `town`, and at every tier that has one a court-keyword institution is `required: true`. The read is a generation-time snapshot the ruin path cannot move. | leave the shipped rows and never write it |
| DS-DEF-2 | Disasters & Famine: granary, NO medical provision | SILENT | **DEAD BY CONSTRUCTION** | A granary-keyword institution exists at NO tier below `town`, and at every tier that has one a church-keyword institution is `required: true`. Same snapshot immunity. | leave the shipped rows and never write it |

⭐ **THE CHAIR'S OWN CASE WAS RIGHT TO BE SUSPICIOUS, AND THE ANSWER IS NOT THE ONE THE ZERO
SUGGESTED.** `plagued, NO perimeter and NO force` is NOT dead. It is the AFTERMATH pool, not
the ordinary pool: the generator guarantees every plagued settlement a perimeter and a force
at birth, so no freshly generated town can draw it — but nothing re-establishes that
guarantee afterwards, and a calamity that ruins the palisade and the levy leaves a plagued
town reading exactly this key. The RATE corpus cannot reach it because a world-less town is
never ruined. **Two of the three may be struck; the first must be kept.**

## 1. Beasts & Monsters: plagued, NO perimeter and NO force

The key is `beastsRowPoolKey(config.monsterThreat, walls, garrison||militia)`
(`src/domain/display/stateProse/defenseStateProse.js:444`), reaching the situation
`'plagued country, neither'` only at `family === 'plagued' && !perimeter && !force`
(`defenseStateProse.js:426-437`).

**The policy that forbids it.** `threatDefensePlan`, `src/generators/threatDefensePolicy.js:72-92`:

```js
const needsFortification = (
  threat === 'plagued'
  || (threat === 'frontier' && ['town','city','metropolis'].includes(tier))
);
if (needsFortification && !hasSemantic(institutions,'fortification')) { plan.push({kind:'fortification', …}) }
if (threat === 'plagued' && !hasSemantic(institutions,'force'))       { plan.push({kind:'force', …}) }
```

A plagued settlement at EVERY tier is guaranteed a fortification-semantic institution and a
force-semantic institution. The module's own header calls it "one deterministic policy for
minimum defenses", run twice — before the power layer reads the roster and again at final
reconciliation.

**The only way the pool could still fire, closed exhaustively.** The policy's predicate
(`FORTIFICATION_NAME = /\bwall|citadel|garrison|barracks|palisade|earthwork|fortress\b/i`,
`threatDefensePolicy.js:42`) is WIDER than the desk's perimeter read
(`standingDefenseForces(...).walls`, keywords `walls · citadel · gates (if walled) · inner
citadel · massive walls · palisade · earthwork`). So a town could in principle satisfy the
policy and still read `perimeter = false`. Enumerated over the WHOLE shipped catalogue, the
names that do that are exactly three:

| tier | name satisfying the policy but NOT the desk's wall read | desk garrison? |
| --- | --- | --- |
| town | `Barracks` | **true** |
| city | `Garrison` | **true** |
| metropolis | `Multiple garrisons` | **true** |

Every one of them makes `garrison = true`, hence `force = true`, hence the situation is
`'plagued country, force without a perimeter'` — which the corpus deliberately left as the
empty string, i.e. SILENCE (`defenseStateProse.js:430`). There is no catalogue name that
satisfies the policy's fortification test AND leaves both the perimeter and the force false.

**THE PROBE.** 768-town seeded RATE grid + a 6,000-town adversarial sweep (all six tiers ×
all eight routes × swept culture and terrain, `monsterThreat: 'plagued'` forced):

```
6,768 plagued-or-mixed settlements generated
plagued towns reading perimeter = FALSE at the desk:  2  (both `town`)
  sw-1623  town  W=false G=true  M=false  key=null  defence names: ["town watch","barracks"]
  sw-2481  town  W=false G=true  M=false  key=null  defence names: ["town watch","barracks"]
HIT 'Beasts & Monsters: plagued, NO perimeter and NO force':  0
```

Both unwalled cases are the predicted `Barracks` case, and both render the corpus's silence,
not this pool. **0 hits in 6,768.**

### ⭐ AND THEN THE LIFECYCLE PATHS, WHICH OVERTURN THE VERDICT

The paragraphs above prove only that **no freshly generated settlement** can draw this key.
The doctrine's lifecycle trace — create · read · persist · regenerate · undo · migrate —
finds two live paths that do, and a probe returns the key on both.

`threatDefensePlan`'s `hasSemantic` (`threatDefensePolicy.js:48-56`) reads
`String(institution?.name || '')` on the RAW roster. The desk's `standingDefenseForces`
(`src/domain/institutions/defenseInstitutionBuckets.js:169-178`) reads
`liveInstitutions(settlement)` — ruin-filtered — through `nativeSemanticName` — custom-content
blind. The two predicates therefore disagree in two ways, and each disagreement is a route in.

**PATH 1 — THE RUIN PATH.** Every ruin path in the estate (calamityKernel,
institutionLifecycle, tierOutcomeApply, settlementLifecycleFirstClass, magicRegimeLifecycle)
stamps `{ ...inst, status: 'ruined', _worldPulseInactive: true }`. The stamp does not change
the NAME, so `hasSemantic` still sees a palisade where there is rubble and the reconciliation
adds nothing back.

**PATH 2 — CUSTOM CONTENT.** `nativeSemanticName` returns `''` for any row carrying
`isCustom`/`source: 'custom'`/`customDefinitionId` (`customContentSemanticAuthority.js:41-47`)
— the declared rule that "a stamped custom label cannot acquire built-in physics merely
through spelling". The policy has no such filter, so a custom wall suppresses the palisade the
policy would otherwise add, and the desk cannot see the custom wall either.

**THE PROBE** (a plagued isolated thorp, seed `lifecycle-1`):

```
BASE   walls/garrison/militia = true false false
BASE   beastsKey = Beasts & Monsters: plagued, perimeter but NO force to hold it
BASE   defence names = [ 'Palisade', 'Household levy' ]

RUINED walls/garrison/militia = false false false
RUINED beastsKey = "Beasts & Monsters: plagued, NO perimeter and NO force"     ← THE KEY
RUINED threatDefensePlan on the ruined roster = []   ← and nothing is added back

CUSTOM walls/garrison/militia = false false false
CUSTOM beastsKey = "Beasts & Monsters: plagued, NO perimeter and NO force"     ← THE KEY
CUSTOM threatDefensePlan = []
```

So the pool is **reachable and stable** in the product: a plagued town whose walls are thrown
down stays that way, and the desk says so. The RATE corpus cannot reach it for exactly the
reason `pool-rates.md` LIMIT 1 names — a world-less town is never ruined and carries no custom
content. **VERDICT: OUT OF GRID. The chair must NOT strike this pool.**

### HOW EASILY A REAL CAMPAIGN REACHES IT — tier by tier

The obvious objection to the ruin path is that calamity may not be ALLOWED to ruin defences:
`calamityKernel.js:12,403` bounds the strike to **non-required** institutions
("selectStrikeTargets filters `required` out BEFORE any draw"). So the question is whether the
policy's own additions are required. They are not, mostly — the materialization spreads the
catalogue entry verbatim (`steps/assembleInstitutions.js:702`, `source: 'coherence_repair'`,
which is NOT `'custom'`, so the desk still sees it):

| tier | policy's fortification | policy's first force | can a calamity strike take the perimeter? |
| --- | --- | --- | --- |
| thorp | `Palisade` req=false | `Household levy` req=false | **yes — and the force too** |
| hamlet | `Palisade or earthworks` req=false | `Citizen militia` req=false | **yes — and the force too** |
| village | `Palisade or earthworks` req=false | `Citizen militia` req=false | **yes — and the force too** |
| town | `Town walls` req=false | `Town watch` req=**true** | **yes — and the force need not fall at all** |
| city | `City walls and gates` req=**true** | `Garrison` req=**true** | no (this route is closed at city) |
| metropolis | `Massive walls and fortifications` req=false | `Multiple garrisons` req=false | **yes — and the force too** |

⭐ **TOWN IS THE CHEAPEST ROUTE IN, AND THE SHIPPED RATE TABLE ALREADY SHOWS ITS SIGNATURE.**
At town the policy's force is `Town watch`, and the desk's garrison keywords are
`garrison · barracks · professional guard · professional city watch · multiple garrison` —
a plain `Town watch` matches none of them, and the militia keywords none either. So a plagued
town supplied with a watch reads `force = FALSE` **before any calamity at all**. That is
exactly why `Beasts & Monsters: plagued, perimeter but NO force to hold it` fires on tiers
`thorp · town` and no others (pool-rates row 192, 42 towns — reproduced by probe): thorp and
town are precisely the two tiers whose policy-supplied force is invisible to the desk. Those
42 towns are ONE non-required strike on `Town walls` away from this dark pool. It is not an
exotic state; it is the neighbouring state of a state that already fires on 42 of 768.

⚠ Whether the policy's ruin-blindness is itself a DEFECT: **NO, not as such.** The policy runs
at generation and at final reconciliation, both BEFORE any ruin can occur, so filtering there
would be a no-op — the same reasoning `defenseInstitutionBuckets.js:36-46` already sets down
for the generator's own buckets. The honest statement is that the threat-defence guarantee is
a BIRTH guarantee that no later path renews, which is defensible product behaviour and is the
very story the corpus wrote a pool for. The custom-content half is the weaker of the two: the
policy reading custom names where every consumer is native-only is an inconsistency worth a
row. Not cured here — a change there moves generated worlds for every custom-content user,
which is a behaviour shift and owner-gated, not a "small and certain" fix.

⚠ RAISED, NOT CURED — a latent predicate gap worth a row, not a fix here. On those 2 towns
(~0.03 %) the generator believes it has given a plagued town a defensible perimeter
(`barracks` matched `FORTIFICATION_NAME`) while the desk reads no perimeter, so the Beasts &
Monsters row renders NOTHING on a plagued town. The silence is the corpus's own and is
lawful; the disagreement between the two predicates is not a reader-facing defect today, but
it is the same shape as the label-trap rule already standing in this file's header. Not this
car's to cure.

## 2. Internal Security: detention without process

`internalRowPoolKey(court, prison)` (`defenseStateProse.js:539`) returns this key at
`court === false && prison === true`, off `civicFlag(compound.hasCourtSystem)` and
`civicFlag(compound.hasPrison)`.

`getInstitutionNames` (`src/generators/priorityHelpers.js:54-55`):
`hasPrison` = any name containing `prison · stocks · large prison · massive prison`;
`hasCourtSystem` = any name containing `courthouse · court buildings · democratic assembly ·
city hall · town hall`.

Walked over the whole shipped catalogue (`src/data/institutionalCatalog.js`):

| tier | prison-keyword entries | court-keyword entries |
| --- | --- | --- |
| thorp | — | — |
| hamlet | — | — |
| village | — | — |
| town | `Small prison/stocks` (req **false**, bc 0.7) | **`Town hall` (required: TRUE, bc 1)**, `Courthouse` (false, 0.6) |
| city | `Large prison` (false, 0.7) | **`City hall` (required: TRUE, bc 1)**, **`Multiple courthouses` (required: TRUE, bc 1)**, `Democratic assembly` (false, 0.2) |
| metropolis | `Massive prison` (false, 0.5) | `Multiple court buildings` (false, 0.65) — and the tier inherits the lower rosters |

So a detention institution exists at **no tier below `town`**, and at every tier at which one
exists a court-keyword institution is `required: true` (metropolis inherits). The
implication chain is total: `prison ⇒ tier ≥ town ⇒ court`.

**THE PROBE.** Over the seeded 768-town grid:
```
court=false prison=false 384   court=true prison=true 294   court=true prison=false 90
court = FALSE on 128/128 thorp, 128/128 hamlet, 128/128 village
court = TRUE  on 128/128 town, 128/128 city, 128/128 metropolis
prison = FALSE on 128/128 thorp, hamlet, village
court=FALSE ∧ prison=TRUE :  0 of 768   ·  and 0 of a further 6,000 plagued settlements
```

**THE CHAIR'S READING IS CONFIRMED**, and sharpened: it is not merely that "a court resolves
at every town-plus from a meeting hall" — it is that the tier which first offers a meeting
hall is the same tier which first offers a cell, and the hall is `required` while the cell is
a 0.7 roll. The pool asks for a town that jailed people before it learned to try them, and
the catalogue never builds one in that order.

## 3. Disasters & Famine: granary, NO medical provision

`disasterRowPoolKey(granary, hospital, church)` (`defenseStateProse.js:627`) returns this key
at `granary && !hospital && !church`.
`hasGranary` = any name containing `granar`; `hasChurch` = `church · cathedral · temple ·
monastery · friary · shrine · priest · abbey` (`priorityHelpers.js:63,65`).

| tier | granary-keyword entries | church-keyword entries |
| --- | --- | --- |
| thorp | — | `Wayside shrine` (false, 0.3), `Access to parish church` (false, 0.78) |
| hamlet | — | **`Access to parish church` (required: TRUE, bc 1)**, `Wayside shrine` (false, 0.5) |
| village | — | **`Parish church` (required: TRUE, bc 1)**, **`Priest (resident)` (required: TRUE, bc 1)** |
| town | **`Town granary` (required: TRUE, bc 1)** | **`Parish churches (2-5)` (required: TRUE, bc 1)** |
| city | **`City granaries` (required: TRUE, bc 1)** | **`Parish churches (10-30)` (required: TRUE, bc 1)** |
| metropolis | `State granary complex` (false, 0.7) | `Parish churches (50-100+)` (false, 0.8), `Great cathedral` (false, 0.6) — tier inherits |

`granary ⇒ tier ≥ town ⇒ a REQUIRED parish-church row`. Total.

**THE PROBE.** Over the seeded 768-town grid:
```
granary = FALSE on 128/128 thorp, hamlet, village ; TRUE on 128/128 town, city, metropolis
church  = TRUE on 128/128 hamlet, village, town, city, metropolis ; 117/128 thorp (11 thorps have neither shrine nor access)
granary=TRUE ∧ church=FALSE :  0 of 768  ·  and 0 of a further 6,000 plagued settlements
```

**THE CHAIR'S READING IS REFUTED AS THE GROUND, though true as a fact.** The chair read the
darkness off `hasChurch` firing "at every hamlet from a church in another settlement" — and
that IS the shipped shape: `Access to parish church` is `required: true, baseChance: 1` at
hamlet, and it is literally a walk to a neighbouring settlement's church
(`institutionalCatalog.js:300-305`, "Travel to village church. 2-5km distance typical"). But
that fact cannot be what darkens this pool, because **a hamlet has no granary at all** — the
granary branch is unreachable below `town`. The operative ground is one tier up and is a
different row: at every tier that HAS a granary, a parish-church row is `required: true`.
The chair's mechanism would matter only if a granary could appear at hamlet; it cannot.

The 11 churchless thorps are the only churchless settlements the grid produces, and a thorp
has no granary, so they fall in `no reserves, no medical provision` and never here.

## 4. WHY THE SAME LIFECYCLE PATHS DO NOT REOPEN POOLS 2 AND 3

Pool 1 turned on the desk re-deriving from the LIVE roster. The internal and disaster rows do
not: they read `settlement.economicState.compound.inst`, which is
`getInstFlags(config, institutions)` computed ONCE inside `generateEconomicState`
(`src/generators/economy/economicState.js:51`, stored at `:872`) and never rebuilt. So:

- **The ruin path cannot reach them.** PROBED — a town and a city with every hall, court and
  church stamped `status: 'ruined', _worldPulseInactive: true`:
  ```
  town BEFORE internal: full legal chain (court AND prison) | disaster: granary AND parish care only
  town AFTER  internal: full legal chain (court AND prison) | disaster: granary AND parish care only
  town ruined rows: Parish churches (2-5) · Free company hall · Hireling hall · Adventurers' charter hall · Town hall · Courthouse
  city BEFORE internal: court without detention | disaster: granary AND parish care only
  city AFTER  internal: court without detention | disaster: granary AND parish care only
  city ruined rows: Parish churches (10-30) · Gambling halls · City hall · Multiple courthouses
  ```
  Neither key moves. The snapshot immunises both pools against ruin.
- **Custom content cannot reach them either.** `getInstitutionNames` reads through
  `nativeSemanticNames` (`priorityHelpers.js:41-42`), so a custom "Stocks" cannot set
  `hasPrison` and a custom shrine cannot set `hasChurch`. Custom content can move these flags
  in NEITHER direction.
- **Nor can missing data.** `civicFlag(v) { return v === true; }`
  (`defenseStateProse.js:306-308`) is strict, so a settlement with no `economicState` at all
  reads every civic flag FALSE — landing in `no legal infrastructure` and `no reserves, no
  medical provision`, never in either dark pool. The degenerate path exits away from them.

### THE REFUTATION ATTEMPT — it failed, which is why the verdict stands

The structural argument for pools 2 and 3 rests on `required: true` rows. The obvious way to
break it is an institution-count cap that drops a required row. So the verdicts were attacked
with a sweep over the only three tiers that carry a prison or a granary at all, across the
FULL configuration space rather than the plagued slice:

```
generated 4800 settlements at town/city/metropolis, all 4 threats x 8 routes x swept culture+terrain
  court MISSING at town+ : 0   (of those, with a prison: 0)
  church MISSING at town+: 0   (of those, with a granary: 0)
  HIT 'Internal Security: detention without process' : 0
  HIT 'Disasters & Famine: granary, NO medical provision' : 0
```

No required row is ever dropped. Across everything run for this car — the 768-town seeded
grid, a 6,000-town plagued sweep and this 4,800-town town-and-above sweep, **11,568 generated
settlements** — neither pool fires once, and the catalogue walk says why.

Both pools therefore stay **DEAD BY CONSTRUCTION**. The chair may strike them.

⛔ **RAISED, AND IT IS THE REWRITE'S OWN BUSINESS — NOT THIS CAR'S TO CURE.** The same probe
shows DS-DEF-2's internal row asserting `full legal chain (court AND prison)` about a town
whose Town hall, Courthouse and prison are all rubble, and the disaster row asserting
`granary AND parish care only` about a town whose parish churches are ruined. This is exactly
the ruin-blindness class `defenseInstitutionBuckets.js:28-49` cured for the DEFENCE rows of
this same block and did not cure for the CIVIC rows, because the civic rows read a producer
snapshot rather than the live roster. It matters to the REWRITE directly: prose written for
those two pools can state, of a ruined town, something the settlement's own roster refutes —
a floor-1 self-contradiction reachable without any authoring error. A row for the chair's
ledger, an owner-gated fix (it moves a shipped reading), and not a dark-pool question.

---

# THE REMAINING 53

## ⛔⛔ SLICE A — AND IT FOUND A DEFECT IN THE MEASUREMENT ITSELF (21 pools)

### GROUND A — `DS-STR-1 :: CRISIS_POOL_OF` is NOT DARK. THE INSTRUMENT NEVER ASKED IT. (14 pools)

`CRISIS_POOL_OF` is reachable only through `crisisBannerRung`
(`src/domain/display/stateProse/stressorsStateProse.js:519`) — a SECOND entry point beside the
page-wide desk. The shipped product calls it once per active crisis
(`src/components/new/tabs/OverviewTab.jsx:298`, suppressed only on the public dossier). The
RATE corpus does not: `scripts/prose-rate-corpus.mjs:307-311` calls
`stressors.stressorsStateProse(s, {banners, conditions, worldStressor})` and nothing else, so
only `crisisArityPoolKey` and `crisisFramingPoolKey` ever run. That is exactly why the block
reads live (framing 235/768, arity 7/768) while the rung reads dark.

**It is the same defect class this very script already documents and cured for a sibling desk**
— its own note at `prose-rate-corpus.mjs:187-193`, "three FOOD pools could never fire on the
RATE corpus", because the economy desk was called with its readings absent. The stressor
desk's per-banner recipe never got the same cure.

**THE PROBE** — the shipped per-banner entry point driven over the IDENTICAL 768-town grid
with the IDENTICAL provenance walk:

```
banners seen: 242 | crisisBannerPoolKey returned null on 0 | rung null on 0
  26 SUCCESSION VOID       17 MASS MIGRATION        16 BEAST & RAIDER THREAT
  25 POLITICALLY FRACTURED 17 RECENTLY BETRAYED     14 UNDER SIEGE
  24 FAMINE                17 INDEBTED TO AN OUTSIDE POWER
  21 INSURGENCY            18 DISEASE OUTBREAK      13 INFILTRATED
  20 WARTIME                8 UNDER OCCUPATION       6 RELIGIOUS CRISIS
```

**Fourteen pools compose on towns already in the corpus, at 78–339 bp. They are not zeros;
they were never measured.** The chair must NOT strike them. Verdict for all fourteen:
**DEFECT — fix the instrument, then write them.**

### GROUND B — SLAVE REVOLT is the fifteenth, and it is different

`resolveStress` filters generator-owned entities through the generation content profile
(`src/generators/steps/resolveStress.js:194-232`, `allowsGeneratedContent`). The default is
`grounded` (`src/domain/generationContentProfile.js:134`), whose `slavery` boundary is `false`,
and "Slave Revolt" matches `TOPIC_PATTERNS.slavery`. The grid never sets `config.contentProfile`.

```
profile grounded  topics=["slavery"] allows=false
profile grim      topics=["slavery"] allows=true
contentProfile=grounded: 1500 town+ settlements, SLAVE REVOLT banners = 0
contentProfile=grim:     1500 town+ settlements, SLAVE REVOLT banners = 6
  composed rung provenance: {"blockId":"DS-STR-1","poolKey":"SLAVE REVOLT"}
```
Corroboration that the roll is not the cause: 200,000 direct `generateStress` rolls at `city`
return `slave_revolt` 845 times (0.422 %), so ~14 were expected in a 3,000-town sweep and 0
appeared. Verdict: **OUT OF GRID** (Ground A's defect also sits underneath it).

### GROUND C — the granary and blockade rungs read the WORLD PULSE's stockpile (6 pools)

`granaryPoolKey` needs `deriveGranaryOutlook().available`
(`src/domain/display/dossierViewModel.js:325-332`), false without
`economicState.foodSecurity.stockpile.season`. `foodSecurityPoolKey` reads
`stockpile.blockaded` / `.blockadeBypass` (`economyStateProse.js:395-401`).
`foodSecurity.stockpile` has exactly ONE writer, `advanceFoodStockpile`
(`src/domain/worldPulse/foodStockpile.js:410`), called only from `pulseKernel.js:543`, and
`season` exists only when `simulationRules.seasonsEnabled === true` (`pulseKernel.js:483`).
**Measured: 0 of 768 grid towns carry a stockpile at all.**

```
settlements pulsed: 120 (no food ledger: 0)
COMPOSED: GRANARY: well stocked 113 · GRANARY: stocked 7 · DS-ECO-9 :: BLOCKADED 60
60 towns x 36 besieged months — granaryPoolKey:
  well stocked 241 · stocked 613 · thin 193 · nearly empty 1113
  end-state composed: nearly empty 47 · stocked 12 · well stocked 1
with a Teleportation Circle: blockaded=true blockadeBypass='teleport'
  composed: ['DS-ECO-9 :: BLOCKADE BYPASSED']
ALL 768 RATE-grid towns, resolveBlockadeBypassChannel: { none: 768 }
600 town+ at priorityMagic=100: { none: 258, teleport: 327, airship: 15 }
```

⭐ **AND A SECOND UN-SWEPT AXIS FALLS OUT OF THIS.** The grid's config carries only
`settType · tradeRouteAccess · monsterThreat · culture · terrainOverride`
(`prose-rate-corpus.mjs:92-117`), so **all five priority sliders sit at the default 50 on every
one of the 768 towns** — measured as one distinct triple, `E50 C50 M50`. At 50 no town ever
receives a teleportation circle or an airship dock; raise `priorityMagic` and 57 % do. That is
a whole configuration axis the corpus does not vary, and it plausibly darkens pools outside
this slice.

| block | pool | verdict | ground | what the chair should do |
| --- | --- | --- | --- | --- |
| DS-STR-1 | BEAST & RAIDER THREAT | **DEFECT** | GROUND A — composes 16/768 when called | fix the defect then write it |
| DS-STR-1 | DISEASE OUTBREAK | **DEFECT** | GROUND A — 18/768 | fix the defect then write it |
| DS-STR-1 | FAMINE | **DEFECT** | GROUND A — 24/768 | fix the defect then write it |
| DS-STR-1 | INDEBTED TO AN OUTSIDE POWER | **DEFECT** | GROUND A — 17/768 | fix the defect then write it |
| DS-STR-1 | INFILTRATED | **DEFECT** | GROUND A — 13/768 | fix the defect then write it |
| DS-STR-1 | INSURGENCY | **DEFECT** | GROUND A — 21/768 | fix the defect then write it |
| DS-STR-1 | MASS MIGRATION | **DEFECT** | GROUND A — 17/768 | fix the defect then write it |
| DS-STR-1 | POLITICALLY FRACTURED | **DEFECT** | GROUND A — 25/768 | fix the defect then write it |
| DS-STR-1 | RECENTLY BETRAYED | **DEFECT** | GROUND A — 17/768 | fix the defect then write it |
| DS-STR-1 | RELIGIOUS CRISIS | **DEFECT** | GROUND A — 6/768 | fix the defect then write it |
| DS-STR-1 | SUCCESSION VOID | **DEFECT** | GROUND A — 26/768 | fix the defect then write it |
| DS-STR-1 | UNDER OCCUPATION | **DEFECT** | GROUND A — 8/768 | fix the defect then write it |
| DS-STR-1 | UNDER SIEGE | **DEFECT** | GROUND A — 14/768 | fix the defect then write it |
| DS-STR-1 | WARTIME | **DEFECT** | GROUND A — 20/768 | fix the defect then write it |
| DS-STR-1 | SLAVE REVOLT | OUT OF GRID | GROUND B — the grid does not vary `config.contentProfile` | write it after a corpus that reaches it |
| DS-ECO-2 | GRANARY: well stocked | OUT OF GRID | GROUND C — composes 113/120 after one pulsed tick | write it after a corpus that reaches it |
| DS-ECO-2 | GRANARY: stocked | OUT OF GRID | GROUND C — 613 town-months | write it after a corpus that reaches it |
| DS-ECO-2 | GRANARY: thin | OUT OF GRID | GROUND C — 193 town-months under drawdown | write it after a corpus that reaches it |
| DS-ECO-2 | GRANARY: nearly empty | OUT OF GRID | GROUND C — composes 47/60 at end state | write it after a corpus that reaches it |
| DS-ECO-9 | BLOCKADED | OUT OF GRID | GROUND C — composes 60/120 with a siege stressor | write it after a corpus that reaches it |
| DS-ECO-9 | BLOCKADE BYPASSED | OUT OF GRID | GROUND C — needs the blockade AND a magical transport channel; the grid varies neither | write it after a corpus that reaches it |

**Nothing in slice A is DEAD BY CONSTRUCTION. Not one of these 21 pools may be struck.**

Slice A's own limits: the full 273-row table was NOT re-taken with a corrected `deskReturns`
(that would mean editing the read-only dock), so the chair owes a re-take after the cure —
adding a per-banner return also moves `bareSentences`, the pair distribution and the
tier-silence findings, which `rateTable` computes over the same `fired` list. The granary and
blockade probes call `advanceFoodStockpile` directly rather than driving a full campaign tick,
so the pool keys are proven but the FREQUENCY a played campaign yields is not. `SLAVE REVOLT`
carries an owner-gated question slice A did not decide: `grim` is a shipped, player-selectable
profile, so the pool is reachable — but whether the corpus should sweep `contentProfile` is a
policy call, not a measurement one.

## ⛔ SLICE B — TWO MORE DEFECT FAMILIES, ONE OF THEM READER-FACING (13 pools)

Instrument check passed exactly: `DIRECTION: worsening` 180, `SEVERITY: high` 128,
`SEVERITY: medium` 51, `SEVERITY: critical` 56, `DS-POW-2 :: stable matched` 431,
`recentConflict present` 763, `DS-POW-7 :: layer DORMANT` 763.

**G1 — the condition substrate is born at tick zero, crisis-only, and ALWAYS traced.**
`promoteStressorsToConditions` (`conditionPromotion.js:195-209`) is the only generation-time
condition source. It always stamps `triggeredAt.sourceEventType: 'GENERATION'` and a
`causes: [{source:'generation'}]`; it never passes `status` or `duration`, so every born
condition sits at `elapsedTicks: 0`. Its 14 reachable archetypes are all `defaultStatus`
worsening or stable, all `defaultSeverity` ≥ 0.45. Measured: 235 condition-towns of 768,
`{worsening:185, stable:57}`, `elapsedTicks` 0 on 235/235, `causes.length ≥ 1` on 235/235.

**G2 — the other half of the condition lifecycle is the WORLD PULSE, which the grid has none
of.** `upswingKernel.js` mints `reconstruction` (:571-579), `boom` (:689-694) and
`flourishing` (:~735-745) with no `causes` and no `triggeredAt`;
`withTickedConditionDurations` (`activeConditions.js:863-910`) is the only thing that advances
`elapsedTicks` and the only thing that forces `status: 'easing'` (:880-881).

**G3 — `recentConflict` is TOTAL.** `deriveBaselineConflict`
(`governanceNarrative.js:372-486`) ends in an unconditional return. Measured present on
**768 of 768** — and that totality is what darkens the DS-POW-2 share pools.

| block | pool | verdict | ground | what the chair should do |
| --- | --- | --- | --- | --- |
| DS-CND-1 | ARCHETYPE: boom | OUT OF GRID | G2 — `upswingKernel.js:689-694`, world tick only | write it after a corpus that reaches it |
| DS-CND-1 | ARCHETYPE: flourishing | OUT OF GRID | G2 — `upswingKernel.js:~735-745` | write it after a corpus that reaches it |
| DS-CND-1 | ARCHETYPE: reconstruction | OUT OF GRID | G2 — `upswingKernel.js:571-579` | write it after a corpus that reaches it |
| DS-CND-1 | PROVENANCE: causes[] or sourceEventType populated | **DEFECT** | The key IS produced on **235/768** (100 % of condition towns) and composes to NOTHING: all three variants name `{reason}` (`src/data/dossierStateProse/stressors.generated.js:2539, 2547, 2556`), no `{reason}` producer exists, and anchored liveness drops the pool empty. Routed at `stressorsStateProse.js:487` | fix the defect then write it |
| DS-CND-1 | PROVENANCE: no causes[] and no sourceEventType | OUT OF GRID | G1 forbids it at birth; G2's pulse mints pass neither field and it fires there | write it after a corpus that reaches it |
| DS-CND-1 | DURATION: inside the expiry wind-down window | OUT OF GRID | G1/G2 — `elapsedTicks` 0 on 235/235; fires at elapsed 4.8/6 | write it after a corpus that reaches it |
| DS-CND-1 | DIRECTION: easing | OUT OF GRID | G1 — no rule-reachable archetype defaults to `easing`; 0 of 894 conditions over 3,840 towns | write it after a corpus that reaches it |
| DS-CND-1 | SEVERITY: low | OUT OF GRID (sampling depth, not a missing axis) | **It DOES fire in the shipped product** — 11 firings in a 3,072-town heartland sweep, none in the 768 grid | write it after a corpus that reaches it |
| DS-POW-2 | governing faction holds a DOMINANT share | **DEFECT** | G3 + the lens order at `powerStateProse.js:377-380`: `stabilityLensPoolKey` returns `recentConflict present` before `governingSharePoolKey` is called. The state exists on **132/768**. `PowerTab.jsx:223` calls the same function, **so it is dark for real readers too** | fix the defect then write it |
| DS-POW-2 | governing faction holds a NARROW plurality | **DEFECT** | Same defect; state exists on **116/768** | fix the defect then write it |
| DS-POW-2 | critical matched | **DEAD BY CONSTRUCTION** | The only `Critical` stability string in the tree is `governanceNarrative.js:289` `'Critical (active siege — survival priority)'`, and the siege branch at `powerStateProse.js:328` matches first. No world-pulse writer sets `powerStructure.stability`. The desk already declares this at `powerStateProse.js:295-305` | leave the shipped rows and never write it |
| DS-POW-6 | present: false (no legitimacy reading) | OUT OF GRID | `computePublicLegitimacy` is unconditional (`rulingStructure.js:767`) ⇒ ledger present on **768/768**. Only reader is a save written before the field existed | write it after a corpus that reaches it |
| DS-POW-7 | an opposition bloc forms COVERT under an autarchy | OUT OF GRID | `settlementBlocs({worldState: null, …})` returns null on **768/768** (`politicsRead.js:112-118`); the ruling-power half is ordinary (`autocrat` on 83/768) | write it after a corpus that reaches it |

⭐ **THE DS-POW-2 SHARE PAIR IS A WORSE SHAPE THAN DS-POW-3's.** DS-POW-3 is dark because the
instrument never calls its entry point. These two are dark because the key function IS called
on every town and its CALL SITE short-circuits before it — on the instrument's path AND on
the product's. A reader can never see them either. That is a live content loss, not a
measurement artefact.

⭐ **AND THE DS-CND-1 PROVENANCE DEFECT IS THE PUREST ONE IN THE CAR.** The rung is built on
all 235 condition towns, the key is correct, and `composeStateProse` hands back
`sentence: null, provenance: null` — because every variant names a `{reason}` slot nothing
fills. 235 towns of content, silently dropped. Its CURE is a corpus act (a fill vocabulary, or
a `{reason}`-free variant) and `stressorsStateProse.js:~560` already argues a desk must not
invent that vocabulary — so the choice between those two cures is the chair's, not the
investigator's.

Slice B's own limits: no real world tick was run, so every G2 verdict rests on the producer's
source plus a state shaped exactly as that producer shapes it, and the rates those pools would
show on a played world are unmeasured. The DS-CND-1 desk reads `conditions[0]` only
(`stressorsStateProse.js:~470`), which narrows every DS-CND-1 pool's real rate and was not
quantified. `SEVERITY: low`'s true grid rate was bounded but not settled — "the grid was
unlucky" versus "4 seeds a cell is structurally too few" is not separated. **DS-POW-6
`present: false` is the one verdict slice B could not close**: no generated settlement reaches
it and no live code path constructs one, so its only reader is a pre-field save; if no such
saves exist in the wild, that pool is DEAD rather than OUT OF GRID.

## SLICE D — THE FIRST REAL DEAD POOLS, AND THE SLIDER AXIS CONFIRMED INDEPENDENTLY (8 pools)

Instrument check passed: `Naval Defense: Port only` 105 ✔ · DS-SUP-3 593/54/117/4 ✔ ·
DS-ECO-10 399/163/146/48/12 ✔ · DS-DEF-3 Dangerous 24 ✔ Unsafe 11 ✔ Safe 2 ✔. (DS-DEF-3
`Moderate` reads 509 against the corpus's 507 because 5 towns compose nothing downstream of a
correct key — the same 5 that make `First-Survey` 763. The ladder reproduces; the delta is the
composer.)

⭐ **THE SLIDER AXIS, FOUND TWICE INDEPENDENTLY.** Slice A noticed it in passing; slice D
proves it arithmetically. `rateGrid()` (`prose-rate-corpus.mjs:92-116`) writes exactly five
config keys, so `priorityEconomy/Military/Magic/Religion/Criminal` sit at the wizard default
50 on all 768 towns. `priorityHelpers.js:468-477` computes
`threshold = |(e*7 + m*13 + r*17 + mg*19 + c*23) % 97|`; at all-50 that is **exactly 70**, and
every `fires(n)` call in the function uses `n ∈ {45,48,50,52,55,62,65}` — all ≤ 65. So
`fires(n) = threshold < n` is **false for all thirteen compound-stress flags on every one of
the 768 towns, whatever their institutions**. That is not a rare draw; it is arithmetic.

| block | pool | verdict | ground | what the chair should do |
| --- | --- | --- | --- | --- |
| DS-DEF-3 | Very Safe | OUT OF GRID | Bar is `effectiveSafety >= 3.5` (`safetyProfile.js:261`). Over the 768: ratio min 0.2 · p50 0.8 · p90 1.4 · p99 1.8 · **MAX 2.5** — a full 1.0 short, and `crimEff` never drops below 16.5 so the `max(8,·)` floor never helps. Un-pin the sliders and it fires freely: **1,247 of 6,174** swept towns read Very Safe, max ratio 12.5 | write it after a corpus that reaches it |
| DS-DEF-6 | Naval Defense: Naval force | **DEAD BY CONSTRUCTION** | Keys on `hasNavy` = `hasAny(names,['navy','major port'])`. **The catalogue contains ZERO rows matching either** — `priorityHelpers.js:31` says so itself: *"(and Major port/Navy if ever cataloged)"*. Custom content cannot supply it (`nativeSemanticName` returns `''`). `hasNavy` true on 0 of 768 and 0 of 6,174 | leave the shipped rows and never write it |
| DS-DEF-6 | Naval Defense: Under blockade | OUT OF GRID | `stockpile` null on 768 of 768; sole writer is the campaign tick `foodStockpile.js:410-418`. The missing input is the WORLD TICK, not the trade route | write it after a corpus that reaches it |
| DS-ECO-10 | POSTURE: import_dependent | **DEAD BY CONSTRUCTION** | `exportPosture.js:58-63` — the if-chain has exactly **five** arms and no sixth. `import_dependent` exists in that file ONLY as a key of `EXPORT_STATUS_LABEL` (:25), an **orphaned label**. A world changes nothing; the derivation reads only `economicState` + `config` | leave the shipped rows and never write it |
| DS-ECO-11 | ECONOMIC STRENGTHS: none recorded | **DEAD BY CONSTRUCTION** | `resourceGenerator.js:499` assigns `terrain.economicStrengths` verbatim and **all seven `TERRAIN_DATA` rows carry exactly four entries**. An invalid terrain errors and carries no array, which the key routes to `null`, not to the empty pool. `strengths length histogram: {4: 768}`, 0 empty rosters across 6,174 | leave the shipped rows and never write it |
| DS-REL-2 | flagDriven count > 0 | OUT OF GRID | `npcGenerator.js:1694-1701`. **The archetype half already passes** — `mil_crim_corruption` occurs 197 times over 13,904 relationship rows. The sole blocker is `anyActive`, false by the slider arithmetic. **NOT world-dependent**: `getStressFlags(config, institutions)` reads no world. Un-pin the sliders and **1,055 of 6,174** towns carry it | write it after a corpus that reaches it |
| DS-SUP-3 | THE FOOD GAP | SPLIT — DEAD at thorp/hamlet/village, UNSETTLED at town+ | **The chair's ordering hypothesis is settled and is the OPPOSITE of what was suspected:** `serviceCatalogPoolKey` (`economyStateProse.js:786-800`) tests `food` first and `healing` second, BEFORE the count arms — the named gaps SHADOW the generic pools, never the reverse. They are dark because `food` never appears in `deriveNotableAbsences` (absence keys over 768: `{transport: 104, information: 21}` and nothing else). Below town a `required: true` row yields a `p:1` food service; at town+ no required row guarantees food, yet 0 hits in 7,824 settlements | hold — see the limit |
| DS-SUP-3 | THE HEALING GAP | SPLIT — DEAD at thorp–city, UNSETTLED at metropolis | Same ladder, same ordering. Guaranteed `required: true` healing rows exist at every tier through city; **metropolis alone has none**, yet 0 hits in 7,824 (min metropolis healing bucket 2) | hold — see the limit |

⚠ **AN ADJACENT DEFECT SLICE D RAISED BUT DID NOT CLAIM AS THIS POOL'S:**
`worldPulse/navalStrength.js:77` calls `hasNavy` *"the dead hasNavy boolean"* and ships
`hasWarNavy(digest,item,id)` as its live replacement — which this desk, and
`defenseDisplay.js:259`, do not read. The pool is dead; the reason it is dead is a read that
the estate has already superseded elsewhere and not here.

Slice D's own limits: **the two DS-SUP-3 gaps are the one split verdict in the whole car and
it was deliberately not rounded up.** Below village the gap is barred by a required row; at
town+/metropolis it is NOT barred, yet did not occur in 7,824 settlements across the whole
slider space reachable. What would settle it: a walk of the town+/metropolis roster asking
whether any non-required food-service row is effectively certain (an `exclusiveGroup` whose
members exhaust the space, or a coherence-repair pass back-filling an empty essential bucket).
No food fallback was found in `servicesGenerator.js` the way the criminal bucket has one
(`:92-110`), which is what leaves the door ajar. `Very Safe` and `flagDriven > 0` are proved
REACHABLE on one named input (the sliders) but not proved TYPICAL — the wizard-draw corpus was
not run. For `Naval Defense: Naval force`, one path is not closed: if the GM edit path writes a
non-custom-stamped row whose name contains "navy", the pool would be GM-only rather than dead;
the generator can never produce it either way.

## SLICE C — THE GEN BLOCKS, AND THE SLIDER AXIS A THIRD TIME (11 pools)

Instrument note: slice C's instrument is the shipped key function called on dumped fields — a
strict SUPERSET of the rate table, which additionally requires the compose step to draw.
Reproduction: DS-GEN-11 `viable: true/false` **610 / 158 exact** · DS-GEN-14 `FOUNDED-YOUNG`
**76 exact** · DS-GEN-3 food `Secure/Deficit/Deficit × Active Famine` **131 / 120 / 24 exact**.
Where it differs it is always ≥ the corpus (prosperity 323 vs 321, FOUNDED-OLD 692 vs 687),
consistent with ~5 towns per block that key but do not draw. **So a zero in this instrument is
a zero in the corpus** — the only direction this car needs.

**GROUND A (a THIRD independent discovery of the slider axis).** `getPriorities`
(`priorityHelpers.js:14-20`) defaults all five sliders to 50 when config omits them, and
`rateGrid()` omits them. Measured: every one of the 768 towns reads
`priorityeconomy/religion/magic/criminal/military: [50]`, a single distinct value.
The sliders are a first-class wizard input (`src/components/generate/PrioritySliders.jsx`).
**GROUND B.** The grid also pins `customContent: {}` (`prose-rate-corpus.mjs:359`).

| block | pool | verdict | ground | what the chair should do |
| --- | --- | --- | --- | --- |
| DS-GEN-3 | foodSecurity.label: Surplus | OUT OF GRID (B) — borderline, see limit | Gate is `surplusPct > 40` (`foodGenerator.js:353-355`). Native ceiling: `TERRAIN_AGRI.plains 1.0` + `agriMod` cap 0.5 = 1.50 → **ratio 1.3846 = 38 %, two points under the gate, at every tier**. Realized over 1,408 towns: best surplusPct **33**. Custom items declaring `foodImpact:'produces'` add up to +0.6 and **light it 10/12 seeds at 4 producers** | write it after a corpus that reaches it |
| DS-GEN-3 | prosperity: Poverty / Impoverished | **DEAD BY CONSTRUCTION** | `deriveProsperityLabel` closes over `LABELS = ['Struggling','Poor','Moderate','Comfortable','Prosperous','Wealthy']` (`prosperity.js:124`). The pool is routed ONLY from `Subsistence`/`Impoverished`/`Destitute` (`generalStateProse.js:209-211`), none of which is in LABELS; `Subsistence` is re-mapped to Struggling/Poor at `prosperity.js:127-131` | leave the shipped rows and never write it |
| DS-GEN-3 | prosperity: Wealthy / Thriving | OUT OF GRID (A) | `Wealthy` needs `econOut >= 70` (`prosperity.js:135`); with `pri.economy` pinned at 50 the product tops out at **50.40** over 768 towns — 19.6 short, and `magicBoostEconomy` is exactly 1.0 because `pri.magic` is pinned too. Sweep economy 80–95: **Wealthy on 73 of 288**, desk fires the pool. Not clamped, not band-gated — slider-gated | write it after a corpus that reaches it |
| DS-GEN-7 | power_economic: criminal faction in a transit hub | OUT OF GRID (A) | Needs crime power > 20 AND `isEntrepot` (`narrativeGenerator.js:581-589`). Grid: crime power p99 = 20 (max 43), entrepot on 148, conjunction **0/768**. Sweep `priorityCriminal` → 95: **50 hits, pool produced 50 times** | write it after a corpus that reaches it |
| DS-GEN-7 | power_economic: temple economy under a secular seat | OUT OF GRID (A) | Needs `situationDesc` to contain "church controls", gated at `pri.religion >= 70 && pri.economy <= 42 && (religion − economy) >= 28` (`priorityHelpers.js:526-531`). Both pinned at 50 → **0/768**. Swept: 147 towns write it, **119 pool keys produced** | write it after a corpus that reaches it |
| DS-GEN-7 | power_economic: powerful criminal faction in a prosperous settlement | **DEAD BY CONSTRUCTION** — least certain row in the car | Needs power > 35 AND prosperity ∈ {Prosperous, Wealthy, Thriving}. **The antecedents are anti-correlated on one slider**: the only lever raising faction power is `priorityCriminal`, and `criminalEffective >= 65` SUBTRACTS a prosperity rung (`prosperity.js:151`). 1,080 settlements at criminal 60–95 × economy 70–95: the joint cell is **0**, and both `power>35` cells stayed empty | leave the shipped rows and never write it |
| DS-GEN-7 | power_stress: occupation against stated stability | **DEAD BY CONSTRUCTION** — the note negates its own producer | Requires the `occupied` stress AND `powerStructure.stability` NOT containing "occupation" or "suppress" (`narrativeGenerator.js:605-611`). Forced on **336 settlements**: the stability text is a single constant, `'Suppressed (under occupation: resistance simmers)'`, which contains **both** forbidden words. Omissions: 0 of 336 | leave the shipped rows and never write it |
| DS-GEN-7 | historical_economic: the recovery narrative | **DEAD BY CONSTRUCTION** — a filter reading a key no writer writes | Requires an event `name` containing `Boom` or `Trade Route Opened` (`narrativeGenerator.js:652-655`). Over **1,355 generated events, 28 distinct names, ZERO matches**. The `Collapse|Famine` half matches 47 towns, so the predicate is half-live and can never complete | leave the shipped rows and never write it |
| DS-GEN-11 | the MARGINAL arm: neither verdict returned | **DEAD BY CONSTRUCTION** for generated records | `economicViability.viable` was `typeof 'boolean'` on **768/768** and 610 + 158 = 768 exactly. The key is an honest fail-open for a record with no verdict, not a third generated state | leave the shipped rows and never write it |
| DS-GEN-14 | GROWN-UNRECORDED | **DEAD BY CONSTRUCTION** for generated records | Needs `!history.founding`; present on **768/768** and 144/144 further. The route is live (`foundedPoolKey({})` does return it) — only a record lacking the founding block reaches it | leave the shipped rows and never write it |
| DS-GEN-18 | HOME-FED | **DEFECT** (plus an ordering blocker) | `homeFedChain` (`generalStateProse.js:1363-1369`) joins `activeChains[].resource` to the exploitation ledger on a bare `.toLowerCase()`, but the two writers use different token shapes — chains write `Camel Herds`, `Mountain Timber`; exploitation writes `camel_herds`, `mountain_timber`. **The shipped bare-lowercase compare joins 0 towns of 768; normalising spaces→underscores joins 20.** The desk's own docblock at `:1314-1330` asserts the join is "on the canonical `resourceKeyForLabel` token" — **the shipped code never applies it.** ⚠ Curing it is necessary but NOT sufficient: on all 20 towns `STALLED` or `BOUGHT-IN` pre-empts | fix the defect then write it |

### ⭐ SLICE C SETTLED THE DS-ECO-2 TENSION — AND FOUND A PRODUCER MISCALIBRATION

There is **no plumbing defect** between the two food readings. They read the SAME two numbers
and diverge only on a threshold 40 points apart: `economyStateProse.js:414` calls it a surplus
at `foodBalance.surplus > 0` — one unit of grain — while `foodGenerator.js:354` requires
`surplusPct > 40`. All 21 DS-ECO-2 "surplus" towns sit at a 6–22 % margin and read **Secure**
in the food ladder (`fsProd === fbProd` and `fsNeed === fbNeed` on every one).

And the squeeze is structural: plains carries the best base capacity (1.0) but cannot carry the
river-keyed `agriMod` rows; riverside carries them but loses 0.1 of base. Measured ceilings
over 1,408 towns: plains → effectiveAgri **1.35**, riverside → **1.34**; surplus needs > 1.4045
at the luckiest harvest. **The `> 40` gate sits above the food model's own zero-luck maximum of
38.** That is a producer miscalibration the chair may want to raise separately — it is not a
dark-pool question, but it is why this pool is dark.

### ⚠ AND THE SOURCE'S OWN DOCBLOCK IS STALE AT THIS TIP

`generalStateProse.js:979-1032` records that the two criminal notes are "dead by threshold —
their power took exactly three values, 5, 6 and 7". **At the dock tip crime-faction power on
the RATE grid reaches 43 (p99 = 20)**, and the transit-hub note is not dead by threshold at
all — it is slider-gated and fires 50 times once `priorityCriminal` moves. The same block calls
the temple-economy note "merely RARE"; it is not rare, it is gated at `pri.religion >= 70` and
fires 119 times above that line. Worth correcting when that block is next touched — a stale
measurement in a docblock is exactly the shape that darkens a pool by argument.

Slice C's own limits: **`powerful criminal faction in a prosperous settlement` is the least
certain verdict in the whole car** — 2,808 settlements searched across three sliders without
the antecedents co-occurring, and the mechanism named, but the five-dimensional slider space
was not exhausted and institution-roster or culture overrides that might raise faction power
without raising `criminalEffective` were not tried. The narrow question to harden it: *can any
config put a Thieves' Guild above 35 % power on a town whose prosperity label is Prosperous or
better?* **`foodSecurity.label: Surplus` is a borderline OUT-OF-GRID / DEAD call** — on the
NATIVE catalogue alone it is dead, and if the chair's corpus will never carry custom content,
treat it as DEAD. HOME-FED's ordering blocker is a law question, not a measurement one, and was
left to the chair. And the three "DEAD for generated records" rows (MARGINAL, GROWN-UNRECORDED,
Poverty/Impoverished) all light on a stored or hand-authored record; whether the estate ever
renders a legacy save through `generalDeskLines` is outside this car.

---

---

# THE TALLY — ALL 56, AND WHAT THE CHAIR MAY STRIKE

| verdict | pools | share |
| --- | ---: | ---: |
| **DEFECT** — something prevents a state that should occur | **18** | 32 % |
| **OUT OF GRID** — reachable in the product, absent from this corpus | **24** | 43 % |
| **DEAD BY CONSTRUCTION** — the combination cannot occur | **12** | 21 % |
| **SPLIT / UNSETTLED** — dead at some tiers, open at others | **2** | 4 % |

By slice: DS-DEF-2 (mine) 2 DEAD · 1 OUT OF GRID. Slice A 14 DEFECT · 7 OUT OF GRID.
Slice B 3 DEFECT · 9 OUT OF GRID · 1 DEAD. Slice C 1 DEFECT · 4 OUT OF GRID · 6 DEAD.
Slice D 3 OUT OF GRID · 3 DEAD · 2 SPLIT. Total 18 + 24 + 12 + 2 = **56**.

## ⭐⭐ THE HEADLINE: THE PREMISE OF THE CAR DOES NOT SURVIVE THE MEASUREMENT

The car was chartered on the possibility that ~56 pools could be struck for ~67M tokens. **They
cannot. Only 12 may be struck, worth 14.4M tokens** — and 44 of the 56 are pools a reader can
reach, or could reach if a defect were cured.

| | pools | at 1.2M a pool |
| --- | ---: | ---: |
| the car's opening hypothesis (strike all 56) | 56 | ~67.2M |
| **actually strikeable (DEAD BY CONSTRUCTION)** | **12** | **14.4M** |
| of those, conservatively strikeable — excluding the 3 that are dead only for GENERATED records and light on a stored or hand-authored one (DS-GEN-11 MARGINAL · DS-GEN-14 GROWN-UNRECORDED · DS-GEN-3 Poverty/Impoverished) | **9** | **10.8M** |
| must be KEPT and written | 42 | ~50.4M |
| held pending one roster walk (the two DS-SUP-3 gaps) | 2 | ~2.4M |

**The twelve strikeable pools:** DS-DEF-2 `Internal Security: detention without process` ·
DS-DEF-2 `Disasters & Famine: granary, NO medical provision` · DS-POW-2 `critical matched` ·
DS-DEF-6 `Naval Defense: Naval force` · DS-ECO-10 `POSTURE: import_dependent` ·
DS-ECO-11 `ECONOMIC STRENGTHS: none recorded` · DS-GEN-3 `prosperity: Poverty / Impoverished` ·
DS-GEN-7 `power_economic: powerful criminal faction in a prosperous settlement` ·
DS-GEN-7 `power_stress: occupation against stated stability` ·
DS-GEN-7 `historical_economic: the recovery narrative` ·
DS-GEN-11 `the MARGINAL arm` · DS-GEN-14 `GROWN-UNRECORDED`.

## THE 18 DEFECTS, GROUPED BY CURE

1. **THE INSTRUMENT NEVER ASKS THE RUNG (14 pools).** `prose-rate-corpus.mjs:307-311` omits
   `crisisBannerRung`. Cure: add the per-banner return, then RE-TAKE THE WHOLE TABLE — it also
   moves `bareSentences`, the pair distribution and the tier silences.
2. **THE PROSE COMPOSES TO NOTHING (1 pool).** DS-CND-1 `PROVENANCE: causes[] populated` keys
   correctly on 235/768 towns and every variant names a `{reason}` slot nothing fills. Cure is
   a corpus act — a fill vocabulary, or a `{reason}`-free variant — and is the chair's choice.
3. **THE CALL SITE SHORT-CIRCUITS THE KEY (2 pools).** DS-POW-2's two share pools: the state
   exists on 132 and 116 towns and `stabilityLensPoolKey` returns first, on the instrument's
   path AND the product's. **A reader can never see these either.**
4. **THE JOIN IS SPELLED WRONG (1 pool).** DS-GEN-18 `HOME-FED` — the docblock says the join
   is on the canonical token; the shipped code does a bare `.toLowerCase()`. 0 towns join;
   normalised, 20 do. Necessary but not sufficient — the annex's order still pre-empts.

## ⭐ THE ONE FINDING THREE INVESTIGATORS FOUND INDEPENDENTLY

**The RATE grid pins all five priority sliders at 50.** Slices A, C and D each arrived at it
from a different pool. `rateGrid()` writes only `settType · tradeRouteAccess · monsterThreat ·
culture · terrainOverride`, so `priorityEconomy/Military/Magic/Religion/Criminal` are the
wizard default 50 on every one of the 768 towns — a single distinct value. And the consequence
is arithmetic, not probabilistic: `priorityHelpers.js:468-477` computes
`threshold = |(e*7 + m*13 + r*17 + mg*19 + c*23) % 97|` = **exactly 70** at all-50, while every
`fires(n)` call uses `n ≤ 65`, so **all thirteen compound-stress flags are false on all 768
towns whatever their institutions**. The sliders are a first-class wizard input. At least
6 of the 24 OUT OF GRID pools are darkened by this one un-swept axis alone.

**The corpus's other un-swept inputs, named:** the world/campaign tick (no ruin, no stockpile,
no world stressors, no condition ageing) · `config.contentProfile` · `options.customContent` ·
the five priority sliders. A corpus that swept the sliders costs one grid dimension and would
light pools in four different blocks.

---

# LIMITS OF THIS CAR AS A WHOLE

1. **No investigator ran a real world tick.** Every OUT OF GRID verdict that turns on the
   campaign world (ruin, stockpile, condition ageing, world stressors) is grounded in the
   producer's source plus a state shaped exactly as that producer shapes it — not in an
   executed `advanceCampaignWorld`. The pool keys are proven; the RATES a played campaign
   would show are unmeasured, and no corpus here can supply them.
2. **The 14 DS-STR-1 figures are what a corrected instrument WOULD report**, taken by driving
   the shipped `crisisBannerRung` over the identical grid. The full 273-row table was not
   re-taken, because that needs an edit to a read-only dock.
3. **Two pools are genuinely unsettled** — the DS-SUP-3 FOOD and HEALING gaps. Dead below
   village by a `required: true` row; NOT structurally barred at town+ / metropolis, yet zero
   hits in 7,824 settlements. One roster walk settles them.
4. **One DEAD verdict is soft** — DS-GEN-7 `powerful criminal faction in a prosperous
   settlement`. 2,808 settlements searched across three sliders; the five-dimensional space
   was not exhausted.
5. **Three DEAD verdicts are "dead for GENERATED records"** and light on a stored or
   hand-authored one. Whether the estate renders such records through these desks is a
   product-history question outside this car, and it is why the conservative strike count is
   9 rather than 12.
6. **DS-DEF-6 `Naval Defense: Naval force` has one unclosed path**: a GM-added, non-custom-
   stamped row named "navy". The generator can never produce it either way.
7. **Nothing was written to the dock.** Porcelain verified before and after; the only entries
   throughout were the running workflow's own modified tracked files. One untracked file of
   mine (`def2-joint.json`) was created by a relative-path write while cwd was the dock and
   was removed the moment it was seen — the hazard is written into this file's header so the
   next seat does not repeat it.
8. **No DEFECT was fixed.** Each of the four cures moves generated output, a shipped reading,
   or the measurement instrument itself — behaviour shifts, not "small and certain" repairs.
   They are recorded for the chair, not taken.

LAST LINE — SETTLED: all 56, none by argument alone. **The car's premise does not survive:
only 12 of the 56 may be struck (14.4M tokens at 1.2M a pool), 9 of them conservatively — not
56 for 67M. Eighteen are DEFECTS denying readers content, fourteen of those because the
measuring instrument never asks the rung.** The DS-DEF-2 THREE, which the batch waits on:
`Internal Security: detention without process` and
`Disasters & Famine: granary, NO medical provision` are DEAD BY CONSTRUCTION — strike them,
never write them — proved by an exhaustive walk of the shipped catalogue's `required` rows
and by 11,568 generated settlements with zero hits, including a failed refutation attempt
aimed at the one hole the argument had. `Beasts & Monsters: plagued, NO perimeter and NO
force` is **OUT OF GRID, NOT DEAD** — the generator will not BUILD such a town but a ruined
palisade MAKES one, and the probe returns the key; the chair must NOT strike it. NOT SETTLED:
the other 53 zero pools, out with four investigators; the probe recipe, the seed trap and the
reproduction check above are the instrument for them.
