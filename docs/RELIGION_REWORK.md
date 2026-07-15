# Religion Rework — Gradual Per-Settlement Pantheon

Status: **design locked 2026-06-27, in build.** Decisions captured in the user memory
`religion-rework-design`. This doc is the build spec.

## 1. Motivation

Today religion is **one faith per settlement** and conversion is a **binary
winner-take-all flip**: a neighbouring deity wins a contest and the settlement's single
`config.primaryDeitySnapshot` teleports to the new god in a single tick. The audit
showed this is the weakest part of the religion layer (a jarring switch, and
`religious_conversion_fracture` stressors flooding the pool).

The rework makes religion **grow gradually, like the faction power system**: a faith
arrives as a cult, competes for adherents among the masses, climbs through standings,
and only the strongest contend to be the settlement's **chief** (patron). Faith
becomes a slow tide with emergent geography, not a light switch — and it becomes
**legible** (a faith panel), which is the front-door value.

We reuse the proven faction-power machinery wholesale: a renormalized 100-point share,
top-N contenders, the governing/chief selection with hysteresis, momentum bands,
pruning, and the pantheon containment cap.

## 2. The model

### 2.1 Per-settlement pantheon
Each settlement holds **multiple deities**, each with:
- **adherent share** — 0..100, the % of the populace devoted to it. Shares across a
  settlement's deities **sum to 100** (renormalized every tick, faction-power idiom).
- **niche** — its `temperamentAxis × alignmentAxis` (3×3 = 9 possible niches).
- **standing** — `cult → established → ascendant` (chief-eligible). Derived from share
  with hysteresis, like a deity's global tier is a lazy view of seats.
- **chief flag** — exactly one deity per settlement is the **chief** (the patron ≈
  today's `primaryDeitySnapshot` role). The chief is the top-share deity among the
  top-3, held with an incumbency buffer (§2.5).

### 2.2 Niches = competitive exclusion by nature
A deity belongs to exactly one niche (its temperament×alignment). **At most one deity
per niche per settlement.** Two warlike-evil gods cannot share a city; a warlike-evil
war god and a peaceful-good harvest goddess can (different niches). Within a niche,
the stronger deity holds the slot.

### 2.3 Slots = capacity by tier
A settlement has a **slot capacity** scaling with tier (the number of distinct faiths
its populace can sustain):

| tier | slots |
|---|---|
| thorp | 1 |
| hamlet | 2 |
| village | 2 |
| town | 3 |
| city | 5 |
| metropolis | 7 |

(Starting values; tuned in soak.) This keeps villages monocultural (the chief
dominates) and lets metropolises be cosmopolitan (a first-among-equals chief). It is
why chief **pluralism is tier-scaled** rather than a flat threshold.

### 2.4 Three entry paths (the flexibility rule)
When a deity D reaches a settlement (via carrier / prevalence / occupation) and wants in:

1. **Open niche + free slot** → D enters as a **cult** (small seed share), low bar,
   then climbs gradually. The normal path.
2. **Niche occupied** (a same-niche incumbent) → **same-niche push-out**: D contests
   that incumbent for its slot (today's strength contest, scoped to the niche).
   Moderate bar. Winner holds the niche; loser is suppressed (§2.7).
3. **Niche open BUT capacity full** → **cross-niche eviction**: D challenges the
   **weakest deity currently present** (any niche) for its slot. **Hardest bar** — D's
   projected local strength must substantially exceed the weakest incumbent's
   (`EVICTION_MARGIN`). Prevents permanent first-mover lockout: a strong new creed can
   always force into a saturated city, but only by crowding out its feeblest faith.

Forced occupation (§2.6) overrides the cap entirely.

### 2.5 Strength, growth, and the chief
A deity's **local strength** (its pull on adherents) blends:
- **global rank** — `DEITY_RANK_STRENGTH[rankAxis]` (today's pantheon tier: major >
  minor > cult), which sets entry share, growth rate, and ceiling — **not a free pass
  to chief** (a major god still enters as a cult and climbs).
- **regional prevalence** — a bonus per neighbouring settlement that shares the deity
  (`PREVALENCE_PER_NEIGHBOUR`, capped at `PREVALENCE_MAX`), producing **geographic
  faith clustering** (a "this whole valley worships the war god" effect), bounded.
- **carrier pressure** — faith-carrier channels/edges from deity-bearing neighbours
  (allied/trade/patron/vassal + war_front/military_protection/political_authority).
- **receptivity** — the alignment×temperament **fit** between D and the settlement's
  existing faith-mood (a populace steeped in peaceful-good gods resists a warlike-evil
  newcomer, welcomes a kindred one — the generalized `incumbentCounterForce`).

Each tick, every present deity's share moves by a bounded delta toward its strength,
then shares **renormalize to 100**. Growth is gradual (`SHARE_STEP_MAX` per tick).

The **chief** = the top-share deity, subject to the incumbency buffer:
- **Chief incumbency buffer** (§decision 14): while chief, a deity gets a bounded
  **share-defense multiplier** (`CHIEF_HOLD_MULT`) so it resists displacement — the
  state church, temples, and tradition favour the incumbent. The buffer is **erodable
  and not perpetual**: it decays under sustained challenge (`CHIEF_HOLD_DECAY` while a
  rival stays within striking distance), so a long religious siege eventually breaks
  even an entrenched chief. A challenger seizes the chief seat only with a **decisive,
  sustained** lead (`CHIEF_FLIP_MARGIN` for `CHIEF_FLIP_TICKS`), mirroring the
  governing-faction transition.

### 2.6 Occupation = forced conversion
The occupier's deity gets a forced share injection / niche claim (the coupling already
built: force-scaling via `militaryCapacityScalar`, `WARBOUND_CONVERSION_MULT`,
`incumbentCounterForce`). Forced religion **overrides the slot cap** (the garrison jams
its god in) but breeds resistance — the receptivity counter-force surfaces as the
occupation→insurgency coupling already modelled. Forced conversion is the exception to
gradualism.

### 2.7 Suppressed cults + spread-only + global feedback
- **Evicted/displaced deities** are not deleted — they drop to a **suppressed cult**
  (a residual/dormant entry, reusing the faction suppressed-state / relationship-memory
  idiom) that can **resurge** if conditions later favour it. Religious revivals.
- **Spread-only**: new deities enter a settlement only by spreading from the
  **DM-seeded global pool** (a deity that some settlement already carries). No
  spontaneous local genesis — the global pantheon stays bounded and authored.
- **Global ledger feedback**: `worldState.pantheon[deityId]` keeps its global tier;
  local success (chief-seats + total adherents worldwide) raises global rank, which
  strengthens future local entries — **bounded by the pantheon containment cap** so no
  single faith snowballs the map.

## 3. Divine-mandate legitimacy coupling (decision 13)

For **royal/authoritative** governments, `publicLegitimacy` gains a bounded
**divine-mandate** term:

```
mandate = MANDATE_WEIGHT[govClass]
        × religiousAuthority01(settlement)          // strength of religious authority
        × chiefSecurity                              // chief dominance × (1 − contestedness)
        × alignmentFit(chiefDeity, regimeCharacter)  // kindred props more, mismatch less
```

- **Two-way**: a strong, secure, uncontested church+patron **props** the throne; a
  weak or **contested** chief (a rising rival cult) **erodes** legitimacy *before* the
  rival even wins → feeds the coup/government-challenge cluster. This is the
  religion-upheaval → regime-change chain, the payoff of the whole rework.
- **Scope** (`MANDATE_WEIGHT` by government class):
  - **theocracy → full** (its legitimacy ≈ its chief deity),
  - **feudal / monarchy / autocracy / imperial / empire / despot / magocracy → partial**,
  - **merchant / council / republic / oligarchy / confederation → none**.
- **Alignment fit modulates**: `regimeCharacter` is approximated from government type
  (authoritarian/martial regimes favour warlike/evil-tolerant chiefs; traditional
  monarchies favour order/neutral; a theocracy's fit is automatic to its own chief). A
  kindred chief props more; a mismatched chief props less; **never fully punishes** (it
  is a weaker prop, not an active penalty beyond the lost prop).
- The mandate is a **bounded component** of legitimacy, not the whole score.

## 4. Data model

```js
// worldState.religionStates[settlementId] = {
//   deities: {                                  // codepoint-sorted keys (deityRef)
//     [deityRef]: {
//       deityRef, snapshot,                     // the embedded deity snapshot
//       niche: 'warlike|neutral|peaceful' + ':' + 'good|neutral|evil',
//       share,                                  // 0..100 adherent share
//       standing: 'cult'|'established'|'ascendant',
//       standingHeld,                           // hysteresis ticks
//       suppressed,                             // bool — a dormant displaced cult
//     }, ...
//   },
//   chiefRef,                                   // the patron deity ref
//   chiefHeld,                                  // ticks held (buffer/erosion bookkeeping)
//   capacity,                                   // slot capacity (tier-derived, cached)
// }
```

- `config.primaryDeitySnapshot` is retained as a **derived chief-mirror** (the chief's
  snapshot) so PDF, gallery, facets, and the ~12 UI reads keep working unchanged.
- CONDITIONAL materialization (byte-identity): absent on a religion-off / deity-free
  campaign, exactly like `pantheon` / `occupations` today.

## 5. Migration + compat
- Existing single `primaryDeitySnapshot` → a religionStates entry with that deity as
  **chief at 100% share** in its niche, capacity per tier.
- `primaryDeitySnapshot` stays as the derived chief-mirror (write-through on chief
  change) so no downstream read breaks.
- A save/customContent migration backfills religionStates lazily on first advance.

## 6. Generation
- Generation mints a **starting pantheon**: a chief plus 0..(capacity−1) **minor cults**
  (tier-scaled), so the faith panel is alive on day one and spread has substrate.
- Deterministic (seeded, codepoint-sorted). Regenerates `generator-golden-master` +
  `goldenViewModel` snapshots (a deliberate, reviewed output change).

## 7. Faith panel UI (cohesive, this rework)
A per-settlement **faith panel**: the deities present with adherent-share bars, the
**chief**, the **rising cult**, the **contested niche**, each standing
(cult→established→ascendant), and — for royal/authoritative regimes — the **divine-
mandate status** (is the church propping or undermining the throne). Wired into the
dossier/settlement view, honouring the voice/copy contract and the existing design
tokens. This is where the living religion becomes visible.

## 8. Determinism + performance
- No `Date.now`/`Math.random`/`new Date` in the domain; RNG injected, forked per
  contest on the frozen recipe; **codepoint-sorted** iteration everywhere output order
  matters; same-tick merges commutative.
- Bounded state: deities-per-settlement capped at slot capacity (+ a few suppressed),
  suppressed cults pruned after a grace window, the containment cap on global feedback.

## 9. Tuning constants (starting values — soak-tuned)
`SLOTS_BY_TIER` (§2.3), `CULT_SEED_SHARE` 4, `SHARE_STEP_MAX` 6/tick,
`EVICTION_MARGIN` 1.5×, `PREVALENCE_PER_NEIGHBOUR` 0.06, `PREVALENCE_MAX` 0.3,
`CHIEF_HOLD_MULT` 1.15, `CHIEF_HOLD_DECAY` 0.02/tick-contested,
`CHIEF_FLIP_MARGIN` 6 share, `CHIEF_FLIP_TICKS` 3, `MANDATE_WEIGHT` {theocracy 1.0,
royal/authoritative 0.45, other 0}, plus the existing occupation coupling constants.

## 10. Build phases (see task list)
1. Design doc (this). 2. Engine core `religionState.js` + tests. 3. Kernel
integration (gradual share movement replaces the flip; fold occupation forced
conversion; global feedback). 4. Divine-mandate legitimacy coupling. 5. Generation
starting pantheon + golden regen. 6. Migration + compat mirror. 7. Faith panel UI.
8. Tests + gate + soak-tune.
