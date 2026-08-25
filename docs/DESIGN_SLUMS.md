# SLUMS — the owner's design session, 2026-08-06

## ⏳ OPUS-ERA — FABLE SURVEY OWED
Captured by the chair from a live design conversation with the owner. **Owner decisions are
marked ⭐ OWNER and are NOT vetoable by a chair.** Chair proposals are marked and ARE
vetoable. ⛔ **NOTHING HERE IS BUILT. This is new capability, not repair, and it is
owner-gated** — it needs the word before a wave is written.

⚠ Every substrate claim below was MEASURED against `claude/composite-r4` on 2026-08-06 by a
read-only recon. Where the recon found an ABSENCE it is stated as one, because an accurate
absence is what makes a design costable.

---

## §1 THE SHAPE (⭐ OWNER)

**A slum is an INSTITUTION and, through the existing total institution→district assigner, a
DISTRICT.** The chair initially argued for a banded condition instead; the owner's
counter-argument won on two grounds and the chair concedes both: the institution list is the
surface a DM actually touches, and the create/destroy/evolve lifecycle already exists and
already keys off economic factors. Reusing a working lifecycle beats ontological tidiness.

- **ONE slum per settlement.** Not N. The slum is a thing with an identity and a name, not a
  quantity. (This supersedes an earlier chair proposal that size be the COUNT of slum
  institutions.)
- **The types are MUTUALLY EXCLUSIVE.** A settlement has one slum of one type.
- **Every type carries the word "Slum" in its name** — *Slum Warren*, *Slum Quarter*,
  *Slum Camp* — so the surface is unambiguous.
- **A weighted roll per advance** decides grow / shrink / hold / destroyed, from
  circumstance. Same idiom as the rest of the institution lifecycle.
- ⛔ **NO per-gang memory of the player.** Considered and REJECTED as too microscopic — it
  implied per-NPC bookkeeping across visits at a scale the product deliberately excludes.

### The three types (chair proposal, owner-shaped; VETOABLE)

A type earns its place only by changing *what you can do there*. Flavour variants are not
types. The three below fail at what the others are good at, which is what makes the type
meaningful rather than decorative.

| Type | Character | What it affords | What it cannot do |
|---|---|---|---|
| **Slum Warren** | Unplanned sprawl, high chaos-grain. No authority reaches it; nobody is listed anywhere. | Vanish; rumours move freely | Nothing is organised — no labour POOL, only individuals |
| **Slum Quarter** | Designated, bounded, registered. The lawful-but-not-good case. | Reliably FIND a named person (everyone is on a list); hire organised cheap labour | You are seen entering and leaving; rumours are dense inside and do not leak |
| **Slum Camp** | Recent arrivals, transient. | Cheapest labour, most willing recruits; **news from ELSEWHERE** — these people just walked out of somewhere | The WORST local knowledge — they do not know this town either |

**Type is DERIVED FROM CIRCUMSTANCE, not rolled independently.** Chaos-grain drives Warren
vs Quarter; refugee influx mints the Camp. A Camp can harden into a Warren or be walled into
a Quarter as the settlement responds — that is the evolve step doing real work.

⭐ **THE ROOKERY IS NOT A FOURTH TYPE.** Criminal capture is ORTHOGONAL: any slum district
that also contains criminal institutions offers fencing and contraband, because institutions
are already totally assigned to districts. This is strictly more elegant than the chair's
original four-type model.

**SIZE gates HOW MUCH; TYPE gates WHAT KIND.** A small Warren gives rumours and a bed; a
large one has its own economy. Growth UNLOCKS affordances and shrinkage removes them, which
is a better felt consequence than a band ticking.

---

## §2 ⭐ THE COMPOSITION RULE — the load-bearing decision

**SLUMS DO NOT RAISE THE POPULATION CEILING. Density ceilings are unchanged. What changes is
the COMPOSITION of the population inside those bands** — what share of the settlement lives
in the slum.

The chair had proposed that free housing raise the effective ceiling; the owner's model is
better and the chair adopts it. It means the slum needs **no population machinery at all**:
the same twelve thousand people are either a prosperous city or a city where a third live in
the Slum Warren, and that is a real difference in what the settlement IS without touching
density, migration or caps. A fraction is also far harder to get wrong than a stock.

⭐ **The slum offers A BED. It does not move population.**

**MEASURED PAYOFF:** `housing_pressure` is a first-class `SYSTEM_VARIABLE` whose own deriver
carries the comment *"Without a real housing dataset, use population×stressors heuristic."*
**SLUM SHARE IS THAT DATASET.** It is the cleanest empty slot in the settlement model.

---

## §3 ⭐ ALIGNMENT, AND THE LOOP THAT MUST NOT CLOSE

⭐ **Regardless of type, slums contribute to CHAOTIC alignment**, and for most lawful
settlements it is in their interest to reduce the slum — by pushing populations out, by
improving internal security and economy, or by reducing criminal activity.

⚠⚠ **CHAIR WARNING — THREE OF THESE RULES CHAIN INTO A RUNAWAY POSITIVE FEEDBACK LOOP.**
Slum size pushes lawfulness down → lawfulness drives the chaos-grain that selects type → and
IF type also affects growth, size feeds back into itself. A settlement that tips chaotic gets
a Warren, an uncapped Warren grows, growth pushes it further chaotic. Every chaotic
settlement ends at maximum slum and type stops describing circumstance and becomes destiny.

⚠ **The tempting version of the rule is the dangerous one:** a walled Quarter *physically
capping* the slum feels obviously right, and it is precisely the link that closes the loop.

**PROPOSED CURE (chair, vetoable): TYPE GOVERNS SHAPE AND AFFORDANCES, NEVER GROWTH RATE.**
Growth stays driven by economy and provision — the levers a ruler and a player actually push.
Chaotic settlements then reliably HAVE Warrens without Warrens manufacturing more chaos.
If a cap on the Quarter is wanted anyway, it needs hysteresis; `magicRegimeModel.js` is the
estate's worked template for a sticky, path-dependent per-settlement ladder.

**PROPOSED (chair, vetoable): THE CHOICE OF LEVER SHOULD FEED BACK INTO MALICE.** A city that
clears its slum by EXPULSION becomes measurably more malicious; one that clears it by
INVESTMENT does not. That makes alignment something a settlement EARNS through its history
rather than an input it carries.

---

## §4 AFFORDANCES, NOT SERVICES (⭐ OWNER framing)

⭐ The owner's term: these are **not services in the professional sense**. They are what a
player can DO standing there — gather rumours, find a free or near-free place to sleep that
offers hardly any benefit (or literally the side of the street), find cheap labour.

**MEASURED: no new service CATEGORY is needed.** The estate folds 841 catalogued services
into eleven categories, and the slum's affordances land in five that already exist:
`information` (rumours), `lodging` (a bed, or the street), `employment` (cheap labour),
`criminal` (fencing, where criminal institutions share the district), `food` (scraps).

**THE ONE GENUINELY NEW THING: a TERMS band on a service.** Measured, a `Service` is
`{ id, name, tags }` and nothing more — there is no notion of what you get or on what terms,
so a proper inn and a doss-house floor are both "lodging" and the model cannot tell them
apart. Free-and-worthless is a real rung and it is the slum's signature.

⭐ **COVERAGE DOES NOT NEED TO BE BUILT — a chair error, corrected.** The chair first claimed
the design invented nothing, then that service coverage/reach would have to be minted.
Neither was right. Institutions are **totally assigned to districts**, so "the watch does not
come here" is not a coverage field on the watch — it is the watch's institution sitting in a
different district. **Reach falls out of an assignment that already exists.** That removes
the only whole new system the design would have required, leaving one band.

---

## §5 ⭐ RELIGIOUS CONVERSION, AND THE ORPHANS IT REVIVES

⭐ **Settlements with slums — and large ones especially — are more easily targeted for
religious conversion, scaling with slum size.**

**CHAIR REFINEMENT (vetoable): key it on UNMET NEED rather than on slum size alone.** A slum
that charity reaches converts slowly; a neglected one converts fast. This puts the good/evil
axis to work at exactly the right moment, and it has a large measured payoff:

⭐ **`Almshouse`, `Workhouse`, `Poor relief`, `Alms` and `Vagrancy enforcement` ALL SHIP
TODAY WITH NO UNDERCLASS TO SERVE.** The recon confirmed there is no destitution stock, no
beggar population, no underclass share and no poverty rate anywhere in the model — while the
institutions and services that PRESUPPOSE one are already in the catalog. Making charity the
counter-force to conversion is what finally gives those five entries something to do.

**Landing site exists:** `religious_conversion_fracture` is already one of the 21 members of
`STRESSOR_CATALOG`.

---

## §6 THREE CONSEQUENCES THAT COME FREE

1. ⭐⭐ **EXPULSION HAS SOMEWHERE TO GO.** "Push populations out" mints a migration column,
   and the `refugee` travel class ALREADY EXISTS (`DEMOGRAPHIC_COLUMN_CLASSES` is exactly
   `['refugee','voluntary']`). So a lawful city clearing its slum sends refugees to a
   neighbour, who now has slum pressure. **The problem MOVES rather than vanishing** — it is
   conserved without a conservation law, and a purely local decision generates
   inter-settlement history. This is the strongest consequence available and it needs nothing
   new. It also removes the "solve poverty with fire" button: razing does not delete people.
2. **SLUMS SUPPLY LABOUR, so clearing them is COSTLY.** Cheap labour is labour SUPPLY, and
   `capacityModel.js` already tracks `labor` with supply/demand and a `surplus…absent` band.
   A ruler who clears the slum loses the pool and prices rise. Without this, slum-reduction is
   a button with no downside and every lawful settlement presses it — with it, the historical
   reason cities TOLERATED slums is in the model.
3. **The rumour network already enforces the slum's honesty.** Corroboration counts
   INDEPENDENT LINEAGES, not arrivals — "echo chains cannot inflate confidence." So a slum
   yields many tellings of one lineage and volume does not buy certainty. The
   loud-but-unreliable character needs no new machinery.

---

## §7 ⚠ A NAMING COLLISION, FINDABLE NOW AND ANNOYING LATER

⭐ The owner requires "Slum" in every name. ⚠ But `districtProfile.js` already classifies
`/slum|thieves|criminal|seedy|den|underground/i → 'criminal'`. **A Slum Camp full of refugees
would therefore be typed a CRIMINAL district** by a regex that predates this design.

Either that classifier stops treating the word as criminal, or every slum is criminal
regardless of type. Cheap to fix before the build; annoying to discover when something
downstream reads district category.

---

## §8 SUBSTRATE TO BORROW, NOT MINT (all MEASURED 2026-08-06)

- **Districts are real and engine-meaningful.** `deriveDistrictProfile` mints 12
  `DISTRICT_CATEGORIES` with `WEALTH_BANDS` (`destitute…opulent`) and `SAFETY_BANDS`
  (`lawless…fortified`). `urbanFabricKernel.js` keeps PERSISTED decaying per-district-class
  prominence stocks plus typed scars. ⚠ Districts are DERIVED, not persisted — a
  district-scoped slum state must ride `urbanFabric` or be derived.
- **The geometry axis is already running.** `urbanFabricKernel` integrates a chaos-grain
  drift toward `1 − lawfulness01` — exactly the chaotic-sprawls / lawful-designates
  distinction, already implemented.
- **Both alignment axes are already independent.** `settlementAlignment` returns
  `{ lawfulness01, malice01 }` as separate 0..1 scalars, derived live and never persisted.
  Nothing in the engine collapses them into a 9-point label.
- **The per-institution moral read exists.** `moralMartialLean.js` carries signed
  `{ cruelty, disorder }` per institution — slave market `{0.9,−0.4}`, gambling house
  `{0.1,0.7}`, almshouse `{−0.7,−0.2}`, workhouse `{0.5,−0.5}` — and
  `settlementMoralConductLean` already aggregates. A slum is roughly `{+0.4,+0.8}`.
- **Institutions have NO `type` field** — the kind is `category` (11 values) plus `tags` (44),
  minted by `src/data/institutionalCatalog.js`. Useful tags already present: `housing`,
  `underground`, `criminal`, `smuggling`, and — by its ABSENCE on a slum — `sanitation`.
- **The coupling contract is `activeConditions.js`** — 46 archetypes, each declaring
  `affectedSystems` against 16 closed `SYSTEM_VARIABLES` that already include
  `housing_pressure`, `criminal_opportunity`, `social_trust`, `law_order` and
  `labor_capacity`. `applyConditions` is the one read idiom.
- **Tiers:** `TIER_ORDER = ['thorp','hamlet','village','town','city','metropolis']`. ⚠ The
  schema separately declares a 7th value `capital` that `TIER_ORDER` does not contain and the
  generator never emits — treat `TIER_ORDER` as engine truth.
- **Vocabulary-siting law:** shared band words live in their own zero-import neutral leaf
  beside `lawWord.js` / `bandFamilies.js`, NEVER inside the program that needs them. The
  failure that minted this rule: a producer emitting `chaotic` while two frozen consumers
  accepted only `lawless`, silently nulling whole rows.

### ⛔ NOT AVAILABLE — do not design against these
- **Persisted origin-tagged population DOES NOT EXIST.** Migration columns carry `originId`
  and a travel class, but **the origin tag dies with the event** — it is never written onto
  the destination settlement. The "people ledger" is docs-side only. Any segregation arm
  keyed to population origin has no floor to stand on until that lands.
- **No underclass concept of any kind exists** — no destitution stock, no beggar population,
  no poverty rate. `destitute` appears only as a band WORD in three unrelated ladders.
- **Slums exist as PROSE with nothing reading them.** The spatial generator already emits a
  "Shadows District" with a landmark called "The Warren (slums)", and no mechanic anywhere
  reads a slum.

---

## §9 THE SCOPE DECISION STILL OPEN (chair, owed to the owner)

Slums as a **housing / affordance** mechanic is contained: it snaps onto `housing_pressure`,
`capacityModel`, the district assigner and the condition contract, and mints one terms band.

Slums as the front door to a **destitution model** is a much larger and more interesting
program — and it is what those five orphaned charity institutions have been waiting for.

The design above is written for the first and does not foreclose the second.
