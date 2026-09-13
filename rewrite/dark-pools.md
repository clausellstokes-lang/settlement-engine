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

## SLICES B, C, D — IN PROGRESS

---

LAST LINE — SETTLED: the DS-DEF-2 THREE. `Internal Security: detention without process` and
`Disasters & Famine: granary, NO medical provision` are DEAD BY CONSTRUCTION — strike them,
never write them — proved by an exhaustive walk of the shipped catalogue's `required` rows
and by 11,568 generated settlements with zero hits, including a failed refutation attempt
aimed at the one hole the argument had. `Beasts & Monsters: plagued, NO perimeter and NO
force` is **OUT OF GRID, NOT DEAD** — the generator will not BUILD such a town but a ruined
palisade MAKES one, and the probe returns the key; the chair must NOT strike it. NOT SETTLED:
the other 53 zero pools, out with four investigators; the probe recipe, the seed trap and the
reproduction check above are the instrument for them.
