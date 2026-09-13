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

| block | pool | class | VERDICT | ground |
| --- | --- | --- | --- | --- |
| DS-DEF-2 | Beasts & Monsters: plagued, NO perimeter and NO force | SILENT | **DEAD BY CONSTRUCTION** | `src/generators/threatDefensePolicy.js:72-92` — a named, deterministic policy whose whole job is to forbid exactly this combination. See below. |
| DS-DEF-2 | Internal Security: detention without process | SILENT | **DEAD BY CONSTRUCTION** | A prison-keyword institution exists at NO tier below `town`, and at every tier that has one a court-keyword institution is `required: true`. See below. |
| DS-DEF-2 | Disasters & Famine: granary, NO medical provision | SILENT | **DEAD BY CONSTRUCTION** | A granary-keyword institution exists at NO tier below `town`, and at every tier that has one a church-keyword institution is `required: true`. See below. |

**What the chair should do with all three: LEAVE THE SHIPPED ROWS AND NEVER WRITE THEM.**

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

---

# THE REMAINING 53 — IN PROGRESS

(rows appended as they are settled)

---

LAST LINE — SETTLED: the DS-DEF-2 THREE, each DEAD BY CONSTRUCTION, each backed by an
executed probe over 6,768 generated settlements with 0 hits and by an exhaustive walk of the
shipped institution catalogue; the chair may leave all three shipped rows untouched and never
write them. NOT SETTLED: the other 53 zero pools; the probe recipe and the reproduction check
above are the instrument for them.
