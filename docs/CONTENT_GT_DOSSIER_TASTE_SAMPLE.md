# CONTENT-GT-DOSSIER — TASTE SAMPLE (for the owner, before the ONE REGEN)

Branch `claude/generation-time-content-dossier` (PARKED — no fold/PR/deploy). This is the
prose-quality taste-pass the commission asked for: real, generated output from the grown
surfaces, so the voice can be judged before it rides the permanent regeneration.

**What to look for:** does the added variety hold the owner's register (literary, specific,
dry, a fact + the complication it creates; never purple, never generic-fantasy)? Every new
string preserves the interpolated tokens and the meaning of the line it varies; the goldens
regen once at the ONE REGEN.

**Honest note (pre-existing, not introduced here):** a few pressure lines read with a
lowercase "the town council …" at a sentence start. That is the existing `${govFaction}`
interpolation casing (the value is lowercased "the …" while its fallback is capitalized) —
the base's own variants do it in 5 places; this lane added 4 more in the same established
style. A sentence-boundary capitalization pass over `govFaction`/`topFaction` would fix all
9 at once; it is queued as a candidate cleanup, not done here (it would rework the owner's
existing prose and is out of a content-growth lane's scope).

---

## 1. Pressure sentences — the most-surfaced line (table view, map inspector, dossier header)

Each stress type now draws from a deeper pool; a settlement's line varies across regenerations. A few types, three seeds each:

**famine** (was 1 line per settlement-state; the `religious_conversion` name.length%3 selector is gone):
- Ashholt is two bad weeks from genuine starvation; the town council controls the remaining grain reserves and is not discussing it openly.
- Hunger has made Ashholt quiet. The market still opens, the queues still form, but the haggling has gone out of people — they take what they are given and calculate, silently, how long it will last.
- the town council of Ashholt announced a fair distribution of the grain reserves last week; the announcement and the distribution are turning out to be two different things.

**wartime** (was 1 line per settlement-state; the `religious_conversion` name.length%3 selector is gone):
- The war reaches Ashholt as a series of demands rather than battles: levies of men, of grain, of coin, each one framed as duty and none of them refusable. Ashholt is losing people and resources it will not get back, and the front it is bleeding for is somewhere it will never see.
- Every capable pair of hands Ashholt could spare, and several it could not, has gone to the war; what remains is losing people and resources by attrition — a workshop closed for want of a master, a field unsown for want of a back — while the town council reports the settlement loyal and does not report the rest.

**religious_conversion** (was 1 line per settlement-state; the `religious_conversion` name.length%3 selector is gone):
- the town council in Ashholt backed the winning faith a little too early and a little too visibly, and now find that a matter of belief has become a matter of who owes whom — the worst kind of debt to have taken on.
- The conversion order in Ashholt was formally acknowledged within the week. The compliance was faster than anyone expected. The depth of that compliance is a separate question that no one with authority is asking loudly, because the answer would require a response.
- The conversion in Ashholt is being managed as a property question as much as a spiritual one: which endowments, which burial rights, which festival days transfer with the congregation. The theology was settled quickly. The estate is where the fighting is.

**insurgency** (was 1 line per settlement-state; the `religious_conversion` name.length%3 selector is gone):
- In Ashholt the rents go uncollected, the summons go unanswered, and the men the town council sends to enforce either turn back or turn coat. The revolt has not started because it has, in every way that matters, already happened.
- The commons of Ashholt have stopped pretending to accept the current arrangement. the town council still holds the buildings and the official seal, but it is governing by momentum rather than consent. The first faction leader to offer a credible alternative will find an audience.
- The street has gone quiet in Ashholt, and the quiet is not calm — it is the pause before a thing that everyone can feel coming. the town council issues orders that are heard, noted, and not obeyed, and each unobeyed order costs it more than the last.

## 2. Institution descriptions — 1 blurb → a variant pool (draw-free fnv per settlement)

The catalog line stays index-0 (canonical); a settlement deterministically picks one of the pool. Sample:

**Lord's reeve** (thorp):
- _(canonical)_ A steward appointed by a distant lord to oversee the settlement. Authority is formal but often resented.
- A distant lord's man, set here to watch the settlement and remit what it owes. His writ is legitimate; his welcome is not.
- Placed by a lord who never visits, he holds official charge of the settlement. The paperwork backs him. The neighbours do not.

## 3. World-scoped faction names — the same faction no longer appears in two towns

A composed medium realm (settlement-local dedup would repeat names across members); every faction name is now world-unique:

- **Drumbeck**: The Commercial Circle · The Governing Council · The Old Houses
- **Geraspyrgos**: The Establishment Concord · The Independent Bloc
- **Lagourbs**: The Merchant Bloc · The Administrative Circle · The Devout Circle · The Clergy Alliance
- **Goldwiese**: The Establishment Coalition · The Commercial Circle Inner Circle · The Faithful Assembly League
- **Shanzhen**: The Common Interest · The Civic Authority
- **Pantekastro**: The Establishment
- **Aquamagnum**: The Free Alliance · The Merchant Bloc Combine
- **Kitakou**: The Free Alliance Coalition · The Devout Circle League · The Grey Council · The Common Interest League

_(23 factions across 9 members, 23 distinct — zero collisions.)_

---

## What is NOT in this sample (deferred, recorded in the shift map)

- **History-event descriptions** — 58 variants authored + banked, not yet wired (token
  verification + a seed thread pending); clean fnv wiring, same idiom as institutions.
- **Exhaustive institution descs** — the mechanism is proven on 56 institutions; the other
  ~245 are mechanical pool-growth once the voice here is approved.
- **NPC display pools** — the authoring pass stalled; the surface is otherwise draw-safe.
- **Deeper vignettes** — only the thinnest (ARRIVAL_SCENES) grew this pass.

## How the safety was proven (so the regen is trustworthy)

Every grown surface is either selected by an existing single `pick()` (draw count invariant
to pool size) or by a pure fnv hash (zero draws). A base-vs-tree structural diff over the
187-row generator-golden-master grid showed **only prose fields changed** (pressureSentence,
history.historicalCharacter, institutions[].desc + its defenseProfile projections,
arrivalScene) — zero structural/numeric fields moved. Faction dedup runs only on the composed
world bundle, leaving per-settlement generation byte-identical. The parked golden is
`generatorGoldenMaster` (and same-seed siblings), which regenerate once at the ONE REGEN.
