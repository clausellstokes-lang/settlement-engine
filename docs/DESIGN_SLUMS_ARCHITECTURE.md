# SLUMS — THE BUILD ORDER, THE LAWS, AND THE MECHANICS

## ⏳ OPUS-ERA — FABLE SURVEY OWED
Architected by the chair under Opus 5 from the owner's design session of 2026-08-06.
The design record and its provenance are in `DESIGN_SLUMS.md`; **this document is the BUILD
ORDER and is normative for implementers.** Where the two disagree, `DESIGN_SLUMS.md` holds
the intent and this one holds the sequence.

⛔ **NOTHING HERE IS BUILT, AND NO WAVE MAY START WITHOUT THE OWNER'S WORD.** This is new
capability, not repair.

⚠ Every substrate claim is MEASURED against `claude/composite-r4`, 2026-08-06. **LIVE CODE
OUTRANKS THIS TABLE** — any wave that finds a premise false STOPS and reports.

---

# §1 THE LAWS

Ten live laws bind every wave, plus one retired. Each exists because breaking it produces a
specific failure. **L11 lives in §2g** beside the mechanic it governs; the rest are here.
⚠ **L4 IS RETIRED and L2 IS RESTATED** by the owner's 2026-08-06 simplification (§2a).
**Numbers are NOT reused and NOT renumbered** — renumbering rots every live cross-reference,
which is the estate's own fold precedent.

**L1 — ONE SLUM PER SETTLEMENT.** A slum is a thing with an identity, not a quantity.
*Broken:* the slum becomes a stat and stops being a place.

**L2 — LAWFULNESS MUST NOT FEED SLUM GROWTH.** ⚠⚠ **THIS IS STILL THE LOAD-BEARING LAW; ONLY
ITS SPELLING CHANGED.** It formerly read "type governs shape, never growth rate", because the
loop then ran size → lawfulness → chaos-grain → type → growth. **Dropping the types does NOT
dissolve the loop — it SHORTENS it.** Slum size lowers lawfulness (L9); a less lawful
settlement is less inclined to spend on reducing its slum (§2f); so the slum grows again.
Same runaway, one hop fewer, and easier to introduce by accident precisely because it no
longer needs a type to travel through.
**Growth is driven by economy and provision ONLY.** *Pin it: a wave in which any growth or
reduction-pressure term reads `lawfulness01` — directly or through chaos-grain — is a
REJECT.*

**L3 — COMPOSITION, NOT CEILING.** Slums do not raise the population ceiling. Density
ceilings are unchanged; what moves is the SHARE of the population living in the slum. The
slum offers a bed, it does not move population. *Broken:* the slum leaks into the migration
and density models and has to be reasoned about everywhere.

⛔ **L4 — RETIRED 2026-08-06.** It read "the Rookery is not a type", which had no work left
once the types were dropped (§2a). **Its substance survives and still binds:** criminal
capture is ORTHOGONAL to the slum — a slum district that also holds criminal institutions
offers fencing and contraband, and that is the district assigner speaking, never a kind of
slum. The number is NOT reused.

**L5 — REACH IS DISTRICT ASSIGNMENT, NOT A COVERAGE FIELD.** "The watch does not come here"
is the watch's institution sitting in a different district. **No service gains a coverage,
reach or servedFraction field.** *Broken:* a whole parallel coverage system gets built for
something the assigner already answers.

**L6 — IT IS CALLED A SLUM.** One name, no qualifiers, no kinds (§2a). *Broken:* the
semantics come back and the surface stops being obvious at the table.

**L7 — SLUMS SUPPLY LABOUR.** The slum's contribution to `labor_capacity` is POSITIVE.
*Broken:* slum-reduction is a button with no downside and every lawful settlement presses it,
erasing the historical reason cities tolerated slums.

**L8 — EXPULSION CONSERVES.** Pushing populations out mints a migration column with the
existing `refugee` travel class; the people arrive somewhere. **Razing a slum never deletes
its population.** *Broken:* the model ships a solve-poverty-with-fire button.

**L9 — SLUMS PUSH LAWFULNESS DOWN.** Read with L2, which forbids the return path.

**L10 — THE TIER GATE IS A HARD RULE, NOT A PROBABILITY.** `TIER_ORDER` is
`['thorp','hamlet','village','town','city','metropolis']`. **No slum below `town`.** A
hamlet with a slum is a category error at the table. Town gets the smallest size only; city
and metropolis get the full band.

---

# §2 THE MECHANICS

## §2a THERE IS ONE KIND OF SLUM. IT IS CALLED A SLUM.

⭐ **OWNER, 2026-08-06, superseding an earlier chair proposal:** *"Just keep everything into
one thing called a slum, we don't need this semantics. We just need to know that it is a
slum."*

**The three-type model (Warren / Quarter / Camp) is STRUCK.** There is no type field, no type
derivation, no type vocabulary and no per-type affordance table. A settlement either has a
slum or it does not.

**What was struck with it, so nobody re-derives it:** type-selection from chaos-grain and
refugee influx; the Camp-hardens-into-Warren evolution; and the per-type affordance
asymmetries. **Nothing in §2c–§2j depended on the types** — every coupling, lever, vacancy
and faith rule below reads SIZE or SHARE, never kind.

⚠ **TWO THINGS SURVIVE THE STRIKE and must not be lost with it:**
1. **Criminal capture stays ORTHOGONAL** (this was L4's substance). A slum district that also
   holds criminal institutions offers fencing and contraband — that is the district assigner
   speaking, not a kind of slum.
2. **The feedback guard survives, RESTATED as L2.** It never depended on types; the types
   were only the path the loop travelled. Dropping them shortens the loop, it does not open
   it.

## §2b Size, and what it gates

**SIZE is the only dimension.** Growth UNLOCKS affordances and shrinkage REMOVES them — a
felt consequence, not a band ticking. A small slum gives rumours and a bed; a large one has
its own economy. The weighted roll each advance moves size, and size alone.

## §2c The share, and the empty slot it fills

`slumShare01` = the fraction of the settlement's population living in the slum, derived from
size against tier population. It is a FRACTION, not a stock (L3).

⭐ **`housing_pressure` is a first-class `SYSTEM_VARIABLE` whose own deriver carries the
comment *"Without a real housing dataset, use population×stressors heuristic."* Slum share IS
that dataset.** This is the cleanest empty slot in the settlement model.

## §2d The couplings

Through the `activeConditions` contract, against the closed `SYSTEM_VARIABLES`:

| System | Direction | Why |
|---|---|---|
| `housing_pressure` | worse | §2c — the slum IS the housing datum |
| `criminal_opportunity` | worse | unpoliced ground |
| `social_trust` | worse | a population outside the civic bargain |
| `law_order` | worse | L9 |
| **`labor_capacity`** | **BETTER** | **L7 — this is the tradeoff, and it is what makes the design honest** |

## §2e Affordances, not services

⭐ The owner's framing: these are **not services in the professional sense** — they are what a
player can DO standing there.

**No new service CATEGORY is needed.** The estate folds 841 catalogued services into eleven
categories; the slum's affordances land in five that already exist: `information` (rumours),
`lodging` (a bed, or the street), `employment` (cheap labour), `criminal` (fencing, where
criminal institutions share the district — §2a), `food` (scraps).

**THE ONE NEW THING: a TERMS band on a service.** Measured, a `Service` is
`{ id, name, tags }` and nothing more, so a proper inn and a doss-house floor are both
"lodging" and the model cannot tell them apart. **Free-and-worthless is a real rung and it is
the slum's signature.**

## §2f The levers, and their moral price

Three ways a ruler reduces a slum, with very different costs:

| Lever | Cost | Malice |
|---|---|---|
| **Expel** | cheap, immediate | **raises malice** — and mints a refugee column (L8) |
| **Secure** | moderate | neutral |
| **Invest** | expensive, slow | **does not raise malice** |

⭐ That makes alignment something a settlement **earns through its history** rather than an
input it carries — and a purely local decision generates inter-settlement consequence.

## §2g THE VACANCY — power, faith, and revolt

⭐ **OWNER:** slums contribute to the rise and power of **religious authorities** and
**criminal institutions**, and lower the power of **guards and security, nobility, and the
ruling power** — because each of those is doing a bad job.

### ⚠⚠ L11 — THE SLUM GRANTS NOTHING. IT OPENS A VACANCY THAT SOMEBODY MUST FILL.

**This is the second determinism law, and it exists for the same reason as L2.** An automatic
transfer — slum up ⇒ temple and gang up, noble and ruler down — is monotone: every settlement
with a slum slides toward theocracy-or-crime, and slum size tells you the whole story. The
mechanic stops describing circumstance and becomes destiny.

**So the slum creates a VACANCY and grants nothing by itself. A claimant must act:**

| Claimant | How it claims | Result |
|---|---|---|
| **A faith** | charity institutions present IN THAT DISTRICT | `religious_authority` rises |
| **A gang** | criminal institutions present IN THAT DISTRICT (L4) | `criminal_opportunity` rises |
| **The ruler** | the INVEST lever (§2f) | nobody else gains; the slum shrinks |
| **⛔ NOBODY** | — | **the vacancy stays open — see §2i** |

⭐ This is what finally makes `Almshouse`, `Poor relief` and `Alms` load-bearing: they are not
merely a counter-force, they are **the mechanism by which a faith claims the ground.**

**Pin it:** a settlement with a large slum and NO claimant present must show NO rise in
`religious_authority` or `criminal_opportunity`. A wave in which slum size alone moves either
is a REJECT.

### §2h WHAT THE RULER LOSES IS REACH, NOT CAPABILITY

⚠ The slum does not make the watch weaker — **it shrinks the territory the watch actually
holds.** A guard at full strength policing seventy percent of a city is a different thing
from a weakened guard policing all of it, and the second is the wrong story.

This is already expressed: institutions are **totally assigned to districts**, so the watch
not being in the slum district IS the reach loss (L5 doing double duty).

| System | Direction | Why |
|---|---|---|
| `public_legitimacy` | down | the claim to govern, visibly unmet |
| `ruling_authority` | down | same |
| `faction_power` (nobility) | down | their standing rests on order they are not providing |
| `defense_readiness` | ⛔ **NOT TOUCHED** | that is CAPABILITY, and capability has not changed |

### §2i INCOMING FAITHS — the owner's actual meaning, and it is stronger

⭐ **OWNER, clarifying: "religious conversion" means INCOMING DEITIES SEEKING A FOOTHOLD**,
with a boost to **chaotic-aligned** ones — the precursor to revolutions and slum revolts.

⛔ **THE DEITY DOCTRINE CONSTRAINS THE SPELLING, AND IMPROVES IT.** The engine is NEVER
theological; faith is culture; there are no premade deities. So this can never be *a god
arrives and acts*. It is **a faith taking root where the existing order failed** — which is
how it works historically anyway, and it keeps the engine out of the business of gods doing
things. Substrate: `customContentSchema` already carries deities with TWO separate 3-value
enums, `alignmentAxis` (good/evil/neutral) and `lawAxis` (lawful/chaotic/neutral), so a
chaotic-aligned faith is representable today without minting anything.

**Why the chaotic boost is mechanically right and not merely flavour:** an established lawful
faith is *part of the order that failed these people*. A chaotic one offers what the order
does not. That is exactly why it precedes revolt.

**⭐ CHAIR ADDITION — WEIGHT IT CHAOTIC, DO NOT MAKE IT EXCLUSIVE. An incoming LAWFUL faith
is a second, equally good story and it is FREE.** A reform movement, a temperance order, a
militant brotherhood imposing discipline where the state did not. It **reduces** the slum —
it is the INVEST lever pulled by someone who is not the ruler — and it **still undermines the
ruler**, because someone else is visibly providing order.

> **Same mechanic, opposite alignment, opposite outcome: chaotic incoming faith → the revolt
> path; lawful incoming faith → parallel authority and theocratic drift. Two distinct
> histories out of one wave.**

**Landing site:** `religious_conversion_fracture` is already one of the 21
`STRESSOR_CATALOG` members — the fracture between an established faith and an incoming one
needs no new class.

### §2j REVOLT — what happens when the vacancy goes unfilled

⛔ **Mint nothing.** `insurgency`, `rebellion`, `political_fracture` and `coup_detat` are
already stressor classes; a slum revolt PROMOTES into one.

The vacancy model supplies the distinction worth having:

- **A revolt WITH a claimant has a banner** — an incoming chaotic faith gives it doctrine,
  leadership and a demand. It is smaller, more directed, and it can win something.
- **A revolt with an OPEN vacancy is a bread riot** — bigger, dumber, shorter, and it burns
  out without changing who rules.

Which one a settlement gets depends on whether anybody bothered to show up first.

## §2h What the slum does for infiltration

Slums lower the entry bar and do **not** raise the ceiling — the easy door leads to the cheap
room. A slum-heavy settlement should carry a **low catch rate and high suspicion
accumulation**: everybody saw the stranger, nobody stopped him, and the counter-intel layer
works it out later. That uses `suspicionOf` and mints nothing.

⚠ **The rumour network already enforces the slum's honesty** — corroboration counts
INDEPENDENT LINEAGES, not arrivals, so a slum yields many tellings of one lineage and volume
does not buy confidence. Nothing to add.

⛔ **NO per-gang memory of the player.** Considered and rejected: per-NPC bookkeeping across
visits is below this product's grain.

---

# §3 THE BUILD ORDER

Twelve waves: **SL-0 and SL-1 carry NO FLAG, SL-2 MINTS `slumsEnabled`, and SL-4..SL-12 (nine waves) RIDE it.** ⛔ **SL-3 IS STRUCK** (§2a) and its number is NOT reused — renumbering rots every live cross-reference, which is the estate's own fold precedent. The flag is
absent from `DEFAULT_SIMULATION_RULES` until the owner lights it at the terminal soak.

| # | Wave | Flag | Why it sits here |
|---|---|---|---|
| **SL-0** | **The vocabulary leaf** | none | Everything downstream reads these words. Must precede every consumer. |
| **SL-1** | **The classifier collision** | none | ⚠ **GOLDEN SHIFT — must land EARLY** (see below) |
| **SL-2** | **The institution + the flag** | **MINTS** `slumsEnabled` | CQ5 trio in one commit; nothing can be gated before the gate exists |
| ~~**SL-3**~~ | ~~Type derivation~~ | — | ⛔ **STRUCK — there are no types (§2a). Number not reused.** |
| **SL-4** | **The share → `housing_pressure`** | rides | Needs size; this is L3 made real |
| **SL-5** | **The condition coupling** | rides | Needs the share to couple |
| **SL-6** | **Affordances + the terms band** | rides | Needs size to gate which are live |
| **SL-7** | **The lifecycle roll** | rides | ⚠ L2 is pinned HERE — it is the only wave that can violate it |
| **SL-8** | **The levers + expulsion** | rides | Needs the lifecycle to reduce |
| **SL-9** | **The vacancy + the claim** | rides | Needs the share; L11 lives here |
| **SL-10** | **Incoming faiths** | rides | Needs the vacancy to claim |
| **SL-11** | **Revolt promotion** | rides | Needs to know whether the vacancy was filled |
| **SL-12** | **The lawfulness contribution** | rides | ⚠ Lands LAST so the L2 no-feedback pin is already standing |

## The waves

**SL-0 — THE VOCABULARY LEAF.** A zero-import neutral leaf carrying `SLUM_TYPES`
(`warren / quarter / camp`), the size band, the service TERMS band, and the naming function
that satisfies L6. Pure data and pure derivations; no behaviour.
⚠ **Vocabulary-siting law:** shared band words live in their own neutral leaf beside
`lawWord.js` / `bandFamilies.js`, **never inside the program that needs them.** The failure
that minted this rule: a producer emitting `chaotic` while two frozen consumers accepted only
`lawless`, silently nulling whole rows.

**SL-1 — THE CLASSIFIER COLLISION. ⚠⚠ THIS IS A GOLDEN SHIFT AND IT MUST BE DECLARED.**
`districtProfile.js` classifies `/slum|thieves|criminal|seedy|den|underground/i → 'criminal'`.
Under L6 the institution is called a slum, so **every slum district is typed CRIMINAL** by a
regex that predates this design — including one holding nothing but the destitute. Worse: the spatial generator
*already* emits a "Shadows District" with a landmark "The Warren (slums)", so **existing
worlds already hit this regex** — changing it moves district categories on settlements that
exist today. Land it early, in its own commit, with the same-seed diff quoted, per the
standing rule that nothing which can move an output may land after the tuning signature.

**SL-2 — THE INSTITUTION AND THE FLAG.** The catalog entry, tier-gated `town+` by hard rule
(L10). ⚠ Institutions have **no `type` field** — the kind is `category` (11 values) plus
`tags` (44). Use `category: Infrastructure`, tags `housing` and `underground`, and — pointedly
— **not** `sanitation`; the absence is the meaning. Carry the slum type as a TAG rather than
parsing the name, so no consumer re-derives a type from a string. Add the
`moralMartialLean` entry (a slum is roughly `{ cruelty: +0.4, disorder: +0.8 }`; the estate
already codes almshouse `{−0.7,−0.2}` and workhouse `{0.5,−0.5}`). **CQ5: manifest row +
authored certification row + first real gate read in ONE commit.**

⛔ **SL-3 — STRUCK 2026-08-06.** It derived a slum TYPE from chaos-grain and refugee influx.
There are no types (§2a), so there is nothing to derive. **The number is not reused.**
⚠ Its one durable finding, recorded so it is not re-discovered: `urbanFabricKernel` already
integrates a chaos-grain drift toward `1 − lawfulness01`. **Nothing in this program may read
it** — under L2 that is the forbidden return path.

**SL-4 — THE SHARE.** `slumShare01` feeds `housing_pressure`, replacing a heuristic its own
author flagged. Pin that the ceiling is untouched (L3).

**SL-5 — THE CONDITION COUPLING.** An `activeConditions` archetype declaring the §2d
`affectedSystems`. ⚠ `applyConditions` is the one read idiom; `ownsArchetype` is the
double-count guard. **Pin the POSITIVE `labor_capacity` arm explicitly (L7)** — it is the arm
most likely to be quietly dropped as counter-intuitive.

**SL-6 — AFFORDANCES AND THE TERMS BAND.** The five existing categories; the terms band is
the only new field. Type × size gates which affordances are live.

**SL-7 — THE LIFECYCLE ROLL.** Weighted grow / shrink / hold / destroyed per advance, driven
by economy and provision. ⛔ **L2 IS PINNED HERE: a mutant that makes any growth term read
the type must RED.**

**SL-8 — THE LEVERS AND EXPULSION.** ⭐ Expulsion mints a migration column with the existing
`refugee` class — `DEMOGRAPHIC_COLUMN_CLASSES` is exactly `['refugee','voluntary']`, so this
needs nothing new. The neighbour receives slum pressure. **Pin L8: population is conserved
across a razing or an expulsion.**

**SL-9 — THE VACANCY AND THE CLAIM.** The §2g/§2h power model. ⛔ **L11 IS PINNED HERE: a
large slum with NO claimant present must move NEITHER `religious_authority` NOR
`criminal_opportunity`.** A mutant that grants power from slum size alone must RED. The
ruler-side losses (`public_legitimacy`, `ruling_authority`, `faction_power`) land here too,
with `defense_readiness` explicitly NOT touched and that absence pinned — capability has not
changed, reach has.

**SL-10 — INCOMING FAITHS.** The §2i mechanic, weighted chaotic but **not exclusive**. ⛔ The
DEITY DOCTRINE binds: no god acts, a faith takes root. Both arms must be driven —
a chaotic incoming faith (revolt path) and a lawful one (parallel authority, slum shrinks).
⚠ Pin the lawful arm explicitly; it is the counter-intuitive one and therefore the one most
likely to be quietly dropped, exactly like L7's positive labour term.

**SL-11 — REVOLT PROMOTION.** Promote into an EXISTING stressor class; mint none. Pin the
banner/bread-riot distinction: a revolt with a claimant and one without must be
distinguishable in the receipt, or the vacancy model is unobservable from outside.

**SL-12 — THE LAWFULNESS CONTRIBUTION.** Slum share feeds `computeLawfulness`. ⚠
`settlementAlignment` returns `{ lawfulness01, malice01 }` **derived live and never
persisted** — this is a new input to a derivation, not a stored field. Lands last so SL-7's
L2 pin is already standing when the loop's other half arrives.

---

# §4 SUBSTRATE TO BORROW, NOT MINT

- **Districts are real and engine-meaningful** — `deriveDistrictProfile` (12 categories,
  `WEALTH_BANDS destitute…opulent`, `SAFETY_BANDS lawless…fortified`); `urbanFabricKernel`
  keeps persisted decaying per-district-class stocks. ⚠ Districts are DERIVED, not persisted.
- **Institutions are TOTALLY assigned to districts** (`institutionAssignment.js`) — this is
  what makes L5 work.
- **Both alignment axes are already independent** — nothing collapses them into a 9-point label.
- **`capacityModel.js`** already tracks `labor` supply/demand with a `surplus…absent` band;
  its header names the case: *"Refugee influx raises FOOD DEMAND but adds LABOR SUPPLY."*
- **`activeConditions.js`** — 46 archetypes, `affectedSystems` against 16 closed system
  variables. The read idiom for everything in §2d.
- **Four runtime create/destroy paths already exist** for institutions (DM events, endogenous
  economic lifecycle, tier change, razing) — the slum uses them, it does not add a fifth.

## ⛔ NOT AVAILABLE — do not design against these
- **Persisted origin-tagged population DOES NOT EXIST.** Migration columns carry `originId`,
  but **the tag dies with the event** and is never written onto the destination. The people
  ledger is docs-side only. **Any segregation arm keyed to population origin has no floor.**
- **No underclass concept of any kind** — no destitution stock, no beggar population, no
  poverty rate. `destitute` is only a band WORD in three unrelated ladders.
- **No service coverage/reach field**, and under L5 none is wanted.

---

# §5 OWNER-GATED AND CHAIR-OWED

⛔ **OWNER-GATED — none of these may be self-ruled:**
1. **The whole program.** New capability, not repair. No wave starts without the word.
2. **SL-1's golden shift** — it moves district categories on worlds that already exist.
3. **The terms band on `Service`**, if it turns out to touch a persisted service record
   rather than a derived one. VERIFY-AT-BUILD and STOP if persisted.
4. **§9's scope question** (below).

**CHAIR-OWED, answerable at build:** whether the slum type rides a tag or a dedicated field;
whether the terms band belongs in SL-0's leaf or its own; and the exact size-band edges,
which are TUNING and therefore land unsigned until the tuning signature.

# §6 THE SCOPE QUESTION STILL OPEN

Slums as a **housing-and-affordance mechanic** is contained — thirteen waves, one new field,
snapping onto `housing_pressure`, `capacityModel`, the district assigner and the condition
contract.

Slums as the front door to a **destitution model** is a much larger and more interesting
program, and it is what those five orphaned charity institutions have been waiting for.

**This build order is written for the first and does not foreclose the second.**
