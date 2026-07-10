# PHASE 4 FAITH SYSTEM — DELTA SPEC (post-W2a-port)

Status: ARCHITECT DRAFT 2026-07-09 — for review before entering docs/.
Author: Phase 4 faith-system architect (read-only survey of both checkouts).
Ground truth: THEIRS = `/Users/cstokes/Desktop/settlement-generator/settlement-engine`
(religion v1, certified). OURS = `/Users/cstokes/Desktop/settlement-engine`
(W2a-main port in flight at survey time; religion core already byte-identical to theirs).
Binding inputs: reconciliation decision 2 (ADDITIVE axis model — lawAxis joins as the
alignment axis of the double-axis behavior; warlike/peacelike RETAINED as load-bearing
temperament), the owner FAITH/RELIGION DESIGN CONTRACT + ADDENDUM (memory:
exhaustive-review-in-flight.md:116-117), w2a-merge-dossier.md.

Citation convention: `T:` = their tree, `O:` = our tree. All paths repo-relative.
Port-parity fact (verified 2026-07-09): `religionState.js`, `religiousContest.js`,
`religionLegitimacy.js`, `pantheon.js`, `subsystemActivation.js` are **byte-identical**
across trees; `display/deityEffects.js` differs ONLY by the documented
DEITY_RANK_AUTHORITY single-source ownership (O owns the constant; W2b contract in the
module header); `pulseKernel.js` differs ONLY by the prng reseam
(O:src/domain/worldPulse/pulseKernel.js:8 imports `../../kernel/prng.js`). So citations
into the religion core are valid in both trees; product-surface and store citations are
T-only until merge wave 4.

---

## 1. WHAT EXISTS POST-PORT — the owner's contract, item by item

The owner's contract (memory exhaustive-review-in-flight.md:116, addendum :117), scored
against the engine that the W2a port lands.

### 1.1 "Campaign/realm toggle = SPREAD only (cross-settlement propagation)" — **PARTIAL / WRONG GRANULARITY**

What exists: ONE flag, `religionDynamicsEnabled` (default false —
T:src/domain/worldPulse/simulationRules.js:45, allowlisted :157; Workshop UI copy at
T:src/components/map/SimulationRulesDialog.jsx:72-73), double-gated with the derived
subsystem gate `isSubsystemActive(snapshot,'religion')`
(T:src/domain/worldPulse/subsystemActivation.js:42-56; predicate = any settlement carries
`config.primaryDeitySnapshot` OR `config.cultDeitySnapshots[]`). The gate is checked in
the kernel at T:src/domain/worldPulse/pulseKernel.js:257 (corruption effects) and :821
(the religion block), and again inside the driver
(T:src/domain/worldPulse/religiousContest.js:340-341).

The gap: their single flag gates **ALL** faith dynamics — per-settlement share evolution,
legitimacy drift, patron contests, divine mandate — not just spread. Flag off + deities
present ⇒ total no-op (pinned at T:tests/domain/advanceReligionStates.test.js:61-69).
The owner's contract requires a third state: **local faith dynamics alive, spread off**.
Phase 4 must split the gate (design in §1.9 / build wave W-F1).

What IS correct already: off = freeze-not-delete. `worldState.religionStates` is a
conditional ledger — kernel only writes it when religion ran
(T:pulseKernel.js:1044-1045), and `ensureWorldState` conditionally deep-clones a present
non-empty ledger while never materializing an absent one
(T:src/domain/worldPulse/worldState.js:185-195, and the pantheon discipline :171). A
chief→patron rename migration exists (worldState.js:102-128, schemaVersion 2,
idempotent). Toggle-on = coupling-from-current-states also already holds:
`ensureReligionState` seeds from the embedded snapshots only when no state exists
(T:src/domain/worldPulse/religionState.js:151-186) and otherwise evolves the persisted
state — no retroactive conversion.

### 1.2 "Settlement-level faith works FULLY standalone regardless of toggle" — **PARTIAL (statics yes, dynamics no)**

DONE — the static coupling lattice applies at derive/display time with no flag and no
campaign, gated only on the embedded snapshot's presence:

| Coupling | Evidence |
|---|---|
| rank → religious_authority lift (major 18 / minor 10 / cult 5) | T:src/domain/causalState.js:847 (`DEITY_RANK_AUTHORITY`), applied :881-883. **O-note:** our causalState is pre-port (no deity lift yet); the constant is owned by O:src/domain/display/deityEffects.js pending W2b (contract in its header). |
| good/evil → corruption onset/exposure, span ±0.40 centered on 1.0 | T:src/domain/corruption.js:133-139 (tuning), npcDeityDisfavor :262-280; consumed per-NPC in the pulse at T:src/domain/worldPulse/npcAgency.js:671-702 (evil deity relaxes the onset gate) |
| lawful/chaotic → law_order swing ±8 + corruption tolerance ±0.15 | T:corruption.js:184-198, deityCorruptionTolerance :214-219; law_order application T:causalState.js:731-744 |
| warlike/peacelike → aggression drive term W_DEITY 0.35 | T:src/domain/worldPulse/disposition.js:158 (W_DEITY), :163 (DEITY_TEMPER_SIGN), folded into the single signed drive :234 |
| major (+warlike/evil ⇒ regulatory) → magic legality steps | T:src/domain/magicProfile.js:84-103, applied :166-175, :254-260 |
| display single-source (UI reads the SAME constants the engine applies) | T:src/domain/display/deityEffects.js:32-47 re-exports; equality pinned at T:tests/domain/display/deityEffects.test.js (192 lines) |

PARTIAL — everything *temporal* (share evolution, standings, legitimacy, patron
contests, divine-mandate drift, suppression/revival) lives only in
`advanceReligionStates` (T:religiousContest.js:339-499), which runs only inside the
campaign pulse (`pulseKernel.js:795-845`) and only under the flag. A standalone
settlement has no tick at all, so "fully standalone" can only ever mean: authoring +
assignment + static couplings + faith read-models (panel/PDF) — all of which exist —
plus DM-imposed events (SET_PRIMARY_DEITY / IMPOSE_CULT, §1.6). Phase 4 does NOT try to
give standalone saves a clock; it (a) un-gates the LOCAL lane inside campaigns (§1.9)
and (b) makes the local piety amplifier a pure derivation so it applies to standalone
statics too (§2).

### 1.3 "Piety amplifiers LOCAL + GLOBAL" — **ABSENT (the net-new build)**

Verified absent in BOTH trees: `grep -rn "localPiety|realmPiety|piety" src/` returns
nothing in either checkout. §2 is the design.

### 1.4 "Double-axis behavior: evil backstabs even same-axis allies and especially opposites; good allies/peace" — **PARTIAL (substrate yes, stance machinery no)**

What their 4-axis engine already produces (full audit with lines in §3): axis-opposition
conversion resistance, evil-thrives-under-compromise growth, evil-corrupts-own-faithful,
warbound conversion at spearpoint, regime↔patron alignment fit. What is ABSENT: any
inter-deity **stance function** (cooperation propensity / betrayal hazard), any
law-axis participation in receptivity or ruler-fit, and any deity-driven
alliance/betrayal behavior between settlements. Phase 4 builds the stance layer (§3.3).

### 1.5 "Premium standalone deities/cults/patrons" — **DONE (arrives with wave 4)**

Custom deity authoring is a premium custom-content bucket: category `deities` with the
four axes + domain (T:src/components/compendium/customCategories.js:75-82 — note its
comment still says "three frozen tag axes"; the field list includes `lawAxis`; fix the
comment on adoption), behind the premium upsell gate
(T:src/components/compendium/CustomContentGate.jsx:2). Schema validation with
lawAxis-absence tolerance (legacy 3-axis ⇒ neutral) at
T:src/domain/customContentSchema.js:202-228, mirrored by their DB CHECK (migration 056 —
already in our chain via merge wave 1). Deity is INERT until assigned — the
embed-on-assign bridge.

### 1.6 "Unique deities coexist until spread toggle on" — **DONE mechanically, one namespacing nuance**

Assignment: `SET_PRIMARY_DEITY` commits `config.primaryDeityRef` + a field-disciplined
frozen `primaryDeitySnapshot` (T:src/domain/events/mutateEntities.js:756-798; no
wall-clock leak, lawAxis defaulted 'neutral' :792-794). `IMPOSE_CULT` seeds cults beneath
the patron honoring tier capacity + one-per-niche via the pure
`reconcileCultImposition` (mutateEntities.js:800-843; religionState.js:222-257). Store
half: T:src/store/settlementDeityHelpers.js:58/:105 (arrives wave 4 with the store
topologies; O has neither yet — verified absent). With spread off, nothing crosses
settlements; each member's pantheon is independent (dormancy oracle + per-settlement
`religionStates` keys).

NUANCE: the owner specified ids namespaced `deity:<saveId>:<slug>`. Their refs are
custom-registry ids (e.g. `custom:lu_<name>` in soaks) with a `deity:<name>` fallback in
`deityIdOf` (T:src/domain/worldPulse/pantheon.js:129-135). Same-ref = same god is
INTENTIONAL for the shared global pool (spread-only rule §2.7 of the rework). Wave-4
verify item: confirm registry ids cannot collide across campaign members from different
accounts (two DMs' distinct "War Father" homebrews must not identity-merge). If they
can, mint refs as `deity:<accountOrSaveScope>:<slug>` at the registry seam — NOT in the
engine (the engine treats refs as opaque).

### 1.7 The engine underneath (what the port delivers, for the record)

- **Niche grid + competitive exclusion:** niche = `temperamentAxis:alignmentAxis`
  (religionState.js:59-61), one active deity per niche, tier slot capacity
  thorp 1 → metropolis 7 (:27, :64-66); three entry paths — open-slot cult seed,
  same-niche push-out (PUSH_MARGIN 1.1), capacity-full cross-niche eviction
  (EVICTION_MARGIN 1.5) — attemptEntry :268-307; forced occupation overrides capacity
  (:295-297).
- **Gradual shares:** renorm-to-100 largest-remainder integer idiom (:113-123), bounded
  SHARE_STEP_MAX 6/tick, erodable patron hold (PATRON_HOLD 0.35, decay 0.02/contested
  tick) — advanceShares :314-339; standings cult/established/ascendant with hysteresis
  (:126-131).
- **Legitimacy as a second, lagging axis:** rightful-claim target from ruler endorsement
  + neighbour recognition + tenure + chronicle momentum − heresy stain, compromise
  re-weighting (captured states legitimize by fiat) —
  religionLegitimacy.js:44-64 (tuning), :242-264 (target), :271-280 (step). Religious
  institutions lend creed-agnostic backing (institutionBackingOf :84-93, W_INSTITUTION
  0.12 :62).
- **Patron seat:** organic share-based flip with decisive-sustained-lead buffer
  (PATRON_FLIP_MARGIN 6 × PATRON_FLIP_TICKS 3, selectPatron :355-378); SCHISM/organic
  contest = seeded legitimacy-weighted top-3 roll with siege hysteresis
  (resolvePatronContest :433-475), PRNG forked per settlement+tick
  (`religion-contest::${tick}::${cid}` — religiousContest.js:468).
- **Spread:** faith carriers = allied/trade/patron/vassal edges +
  war_front/military_protection/political_authority channels (religiousContest.js:55-62),
  MIN_CARRIER 0.15, size-asymmetric faith mass (TIER_MASS thorp 1 → metropolis 32,
  influence clamped 0.12..4 — religionState.js:75-95), capped prevalence clustering
  (:47-48, :293-303), occupation conversion (OCC_CONVERSION_GAIN 0.5, WARBOUND 1.35×,
  incumbentCounterForce :129-137), conversion fires ONLY on patron change and drives the
  EXISTING `religious_conversion_fracture` stressor (conversionOutcome :217-257,
  severity 0.5 at :487).
- **Global feedback:** `worldState.pantheon` deity ledger (wins/losses/seats/tier) with
  hysteresis dwell TIER_HOLD_TICKS 2 and containment cap MAX_TIER_CHANGES_PER_TICK 2
  (pantheon.js:54-70), conditional materialization (byte-identity, :23-28).
- **Legitimacy → coup chain:** projection `projectReligionStateOntoSettlement` writes
  `config.faithProfile` (patronSecurity = 0.7·legit + 0.3·dominance, contested-damped —
  religionState.js:491-513) → `applyDivineMandate` pulls `publicLegitimacy.score`
  toward a bounded target (MANDATE_RANGE 30, MANDATE_PULL 0.15, MANDATE_STEP 2/tick;
  theocracy 1.0 / royal 0.45 / civic 0 — :521-575), mounted at pulseKernel.js:1060-1064;
  low legitimacy feeds the existing coup cluster (proven end-to-end by
  T:scripts/audit/religion-coup-soak.mjs — applyDivineMandate + coupSpawnGate +
  coupVerdictOutcomes on the REAL pulse).
- **Dormancy discipline:** double gate + conditional ledgers + the structural
  `normalizeForDormancy` oracle (absent === {} === []) —
  T:tests/domain/religionDormancy.byteIdentity.test.js:28-48; worldpulse golden fixture
  O:tests/fixtures/worldpulse-golden-master.json (present in our tree).
- **Test freight (all present in O):** religionState 219 / religiousContest 298 /
  religionLegitimacy 196 / religionCorruption 636 / religionTier2 92 / dormancy 207 /
  advanceReligionStates 156 / pantheon 488 / primaryDeityEmbed 145 / z2MagicDeity 101 /
  display/deityEffects 192 lines. Soaks (all present in O:scripts/audit/):
  religion-balance.mjs (default 300 seeds × 80 ticks — the Monte-Carlo cert lane),
  religion-soak.mjs (40×60 live loop), religion-coup-soak.mjs (3 mandate cohorts),
  simulate-religion.mjs (kernel-driven region).

### 1.8 Contract scorecard

| Owner contract item | Status | Phase 4 action |
|---|---|---|
| Spread-only toggle (`faithSpreadEnabled`) | PARTIAL — flag exists but gates everything | W-F1 gate split + rename/migration |
| Standalone settlement faith regardless of toggle | PARTIAL — statics yes, dynamics flag-locked | W-F1 local lane un-gated (campaign); statics already standalone |
| Piety amplifiers local+global | ABSENT | W-F3 (§2) |
| Double-axis behavior matrix | PARTIAL — substrate only | W-F2/W-F4 (§3) |
| Premium standalone deities/cults/patrons | DONE (wave 4 delivery) | verify only |
| Coexistence until toggle-on | DONE | verify + ref-collision check |
| 4 owner pins (spread-inert / spread-determinism / standalone-faith / coexistence) | ~2.5 of 4 exist in other clothing | W-F1 lands all 4 under the owner's names |
| Generation-time starting pantheon (§6 of rework) | **ABSENT — verified** (§4) | W-F5 |

### 1.9 The gate split (W-F1 design — the contract's first structural demand)

Two lanes, one new flag:

- **LOCAL lane** — per-settlement pantheon evolution, legitimacy, patron
  contest/schism, divine mandate, local piety: runs whenever
  `isSubsystemActive(snapshot,'religion')` — NO simulationRules flag. Deity-free
  campaigns remain byte-identical (subsystem gate short-circuits before any fork/mint —
  religiousContest.js:23 already documents this property; it becomes the ONLY gate for
  the local lane).
- **SPREAD lane** — carrier reach into OTHER settlements (religiousContest.js:369-400),
  prevalence bonus (:293-303), religious_authority mints (:353-367), occupation
  faith-pull (:436-441), realm piety (§2), global inter-deity politics (§3.3-global):
  gated by **`faithSpreadEnabled`** (new simulationRules key, default false).
- `religionDynamicsEnabled` MIGRATES → `faithSpreadEnabled` (tolerant reader: if a
  persisted rules object carries the old key and not the new one, its value transfers;
  old key preserved until deliberate deprecation — house additive-schema style).
  SimulationRulesDialog copy updates to spread-only semantics.
- Implementation shape: `advanceReligionStates({ ..., rules })` splits its gate — the
  :340 flag check becomes the SPREAD guard around steps 1-2 (mints + reach) and the
  occupation-pull branch; step 3's per-settlement evolution runs on the subsystem gate
  alone with `reaching = null` when spread is off. `pulseKernel.js:821` religionActive
  becomes `religionLocalActive = isSubsystemActive(...)` and
  `spreadActive = simulationRules.faithSpreadEnabled && religionLocalActive`; the
  corruption-effects gate :253-258 keys on `religionLocalActive` (deity→corruption is a
  LOCAL effect — the owner's standalone doctrine).
- **Deliberate pin revisions (reviewed, named in the commit):**
  T:tests/domain/advanceReligionStates.test.js:61-69 (flag-off ⇒ empties **with deities
  present**) is revised to: flag-off ⇒ no mints/no reach/no cross-settlement outcomes,
  but local evolution proceeds. The deity-FREE dormancy pin
  (religionDormancy.byteIdentity) is UNTOUCHED and must stay green verbatim.
- **The owner's 4 pins land here, under their contract names:**
  1. `faithSpreadInertness` — spread off ⇒ zero cross-settlement faith influence
     (no mints, no reach entries, no prevalence, no occupation pull), N-tick property.
  2. `faithSpreadDeterminism` — spread on ⇒ same seed ⇒ identical religionStates +
     outcomes across runs and member-order permutations (extends the existing
     order-independence suite).
  3. `settlementFaithStandalone` — a deity-bearing settlement with spread OFF evolves
     shares/legitimacy/mandate identically whether or not OTHER members carry deities.
  4. `coexistenceIndependence` — N distinct deities across N members, spread off, K
     ticks ⇒ every pantheon evolves as if alone (pairwise-equal to solo-run fixtures).

Toggle-on remains a coupling event by construction (spread lane reads current
religionStates; ensureReligionState never re-seeds an existing state), and toggle-off
freezes (conditional ledger persists, worldState.js:185-195).

---

## 2. THE PIETY AMPLIFIER — design (the core net-new build)

Owner contract (addendum A): `deityEffect = base × f(localPiety) × g(realmPiety)`;
localPiety = pure derivation, ALWAYS applies; realmPiety = campaign tick-START average,
toggle-gated (neutral 1.0 when `faithSpreadEnabled` off or no campaign); both bounded
~0.5×–2.0×; receipts must name both multipliers with causes; property-test the bound
over N ticks. "In a very religious world, religion matters even more."

### 2.1 Derivations (pure, rng-free, tick-start)

New leaf module `src/domain/worldPulse/piety.js` (zero-import except religionState/
religionLegitimacy read helpers; goes in the deityEffects display re-export set so UI
and engine read ONE table).

```js
export const PIETY_TUNING = Object.freeze({
  // local01 term weights (sum 1)
  W_AUTHORITY: 0.40,     // religious_authority causal variable, 0..1 (score/100)
  W_INSTITUTION: 0.35,   // institutionBackingOf(settlement) — temples/monasteries/shrines
  W_DEVOTION: 0.25,      // patron dominance × standing weight (see below)
  STANDING_DEVOTION: Object.freeze({ ascendant: 1, established: 0.6, cult: 0.25 }),
  // multiplier maps: f = clampMult(1 + SPAN_LOCAL × (local01 − PIVOT_LOCAL))
  PIVOT_LOCAL: 0.35,     // "a modest town with a patron and one temple" ≈ neutral
  SPAN_LOCAL: 1.0,       // f ∈ [0.65, 1.65] over local01 ∈ [0,1]
  PIVOT_REALM: 0.35,
  SPAN_REALM: 0.5,       // g ∈ [0.825, 1.325] — global tilt gentler than local
  MULT_MIN: 0.5, MULT_MAX: 2.0,   // hard composite bound (owner's ~0.5–2.0)
});
```

- `localPiety01(settlement, religionState)` = clamp01 of the weighted sum:
  - **authority** = clamp01(religious_authority score / 100) read from the settlement's
    causal state (post-W2b it includes the DEITY_RANK_AUTHORITY lift — causalState
    :881-883 — so rank feeds piety through the existing channel, no re-derivation);
  - **institution** = `institutionBackingOf(settlement)`
    (religionLegitimacy.js:84-93 — already 0..1, creed-agnostic; NOT double-counted:
    verified not read by deriveReligiousAuthority, comment :72-73);
  - **devotion** = `(patronShare/100) × STANDING_DEVOTION[patron.standing]`, plus
    `0.15 × (activeDeityCount − 1)/capacity` for a живой multi-faith pantheon, clamped
    — read from `religionStates[cid]` when present, else from the static embeds
    (patron present ⇒ share 100 semantics of ensureReligionState :153-157, so a
    standalone/static settlement derives the SAME devotion the first tick would).
- **Identity short-circuit (the dormancy anchor):** a settlement with no
  `primaryDeitySnapshot`, no `cultDeitySnapshots`, and no religionState entry has NO
  piety record at all — every amplified call site multiplies by literal 1.0
  (`pietyMultOf(x) ?? 1`). Deity-free worlds cannot observe the feature (same
  conditional-materialization discipline as pantheon/religionStates).
- `localMult = clampMult(1 + SPAN_LOCAL × (local01 − PIVOT_LOCAL))`.
- `realm01` = arithmetic mean of members' `local01` over **codepoint-sorted member ids,
  measured on the tick-START snapshot** (computed once in pulseKernel beside the other
  pre-tick aggregates, e.g. next to the pantheon seat snapshot at pulseKernel.js:1028);
  members without a piety record contribute the neutral PIVOT_REALM (a mostly-secular
  realm dilutes toward 1.0, it does not zero out).
- `realmMult = 1.0` exactly when `faithSpreadEnabled` is false OR there is no campaign;
  else `clampMult(1 + SPAN_REALM × (realm01 − PIVOT_REALM))`.
- `pietyMult = clamp(MULT_MIN, MULT_MAX, localMult × realmMult)` — the composite every
  site consumes.

Determinism: zero RNG anywhere in piety (pure derivation — no forks needed); all reads
off the single pre-tick snapshot; codepoint-ordered aggregation. The tick-START
measurement is the anti-runaway seam the owner named: this tick's amplified effects
cannot re-enter this tick's piety.

### 2.2 Schema shape (derived read-model, never a stored ledger)

Extend the existing projection (projectReligionStateOntoSettlement,
religionState.js:491-513) — `config.faithProfile.piety`:

```js
faithProfile.piety = {
  local01,                 // 0..1
  localMult, realmMult,    // the two multipliers, 1.0-exact when identity/toggle-gated
  causes: [                // receipts substrate — owner: "name both multipliers with causes"
    { source: 'religious_authority', value },      // 0..1 inputs, in weight order
    { source: 'institutions', value },
    { source: 'devotion', value },
  ],
}
```

Nothing new in worldState (derived-never-stored, per the subsystemActivation doctrine
:11-13). realmMult is recomputed per tick and carried on the pulse trace/receipts —
every religion outcome and amplified coupling receipt gains
`amplifiers: { localMult, realmMult }` naming both with causes. Standalone/static
surfaces derive the same record at display time (PDF/panel parity, §5).

### 2.3 Exactly which couplings multiply (the amplified-site table)

The amplifier is a **multiplier field over the existing engine — never a rewrite**.
Every site keeps its own clamp; the piety factor composes INSIDE existing bounds.

| # | Coupling (owner's list) | Site | Amplification | Proposed range at extremes |
|---|---|---|---|---|
| 1 | Conversion pressure | final `deityLocalStrength` value at its two call sites — entries religiousContest.js:434 and share targets :452 | `clamp01(strength × pietyMult(target))` — target-side: a devout town is a fiercer battleground both to hold and to take | base 0.. clamp01; ×0.5–2.0 |
| 2 | Occupation conversion | :436-441 | inherits via #1 (the lift lands on the same strength). NOT separately multiplied — no double-count | — |
| 3 | Legitimacy weight from mandate | applyDivineMandate target swing, religionState.js:570 | `target = 50 + weight × base × MANDATE_RANGE × fitFactor × pietyMult` — MANDATE_STEP (2/tick) UNCHANGED so per-tick boundedness holds | swing ±30 → ±15..±60 target-space, still step-capped |
| 4 | Contest stakes | conversion-outcome severity 0.5, religiousContest.js:487 | `clamp01(0.5 × pietyMult(convert))` — a devout city's conversion is a bigger crisis; the seeded contest WEIGHTS (:381-388) are NOT amplified (legitimacy is rightfulness, not devotion) and PATRON_FLIP margins/hysteresis are NOT amplified (cadence guards stay absolute — the vassal-flood lesson) | severity 0.25..1.0 |
| 5 | religious_authority mint strength | :359 | `clamp01(mintStrength × realmMult)` — spread-lane-only by construction (mints are already spread-gated) | 0.35-base ×0.825–1.325 |
| 6 | Rank → authority lift | causalState deriveReligiousAuthority lift (T:843-885; lands W2b) | `Math.round(lift × localMult)` — 18/10/5 → 9..36 / 5..20 / 3..10, inside the score clamp | bounded by variable's 0-100 clamp |
| 7 | Deity→corruption pressure | npcDeityDisfavor deviation, corruption.js:270/:278 | effective deviation `span × clamp(-score,-1,1) × localMult`, then re-clamped so the multiplier stays within [1−0.6, 1+0.6] (hard cap 0.6 > 0.40 base, still inside the equilibrium damping per corruption.js:127-132) | ±0.40 → ±0.20..±0.60 |
| 8 | Deity→aggression | deityTemper drive term, disposition.js:234 | `W_DEITY × deityTemper × localMult`; final disposition still clamped by the existing MULTIPLIER_SPAN (:271 exports it) — no new range | ±0.35 → ±0.175..±0.70 pre-span-clamp |
| 9 | Deity→law_order | law swing consumption, causalState.js:731-744 (W2b) | `lawOrderSwing × lawDir × localMult`, score clamp holds | ±8 → ±4..±16 |
| 10 | Narrative salience | faith deltas + pantheon arcs (collectFaithDeltas pulseKernel.js:840; realmEvents.synthesizePantheonArcs) | significance weight × realmMult, THEN the E4 feed-distribution envelope caps apply UNCHANGED (no news-type may breach its share gate; salience amplification can reorder, never flood) | ×0.825–1.325 |
| — | Magic legality steps | magicProfile.js:103 | **NOT amplified** — integer step function; a fractional multiplier either does nothing or jumps a whole legality band. Documented exclusion; revisit only if Phase 5 re-models legality as a scalar | — |
| — | Growth favour / compromise chain | religionLegitimacy.js:167-180 | **NOT separately amplified** — it already multiplies inside deityLocalStrength (#1); a second application would square piety's effect on conversion | — |

### 2.4 The neutrality theorem (what the property pins prove)

1. **Zero-span equivalence:** with `SPAN_LOCAL = SPAN_REALM = 0` (test-forced), every
   multiplier is exactly 1.0 ⇒ the engine's outputs are **byte-identical** to the
   pre-amplifier engine on (a) the dormancy fixture under `normalizeForDormancy` and
   (b) a religion-ACTIVE multi-deity fixture (raw deep-equal). This is the
   "multiplier field, never a rewrite" guarantee, mechanically enforced.
2. **Identity short-circuit:** deity-free settlement ⇒ no piety record ⇒ literal ×1.0
   ⇒ dormancy byte-identity extends over the amplifier code (§6).
3. **Bound + stationarity:** over N=200 ticks × a seeded cohort, every emitted
   `localMult × realmMult` ∈ [MULT_MIN, MULT_MAX]; and the temple→piety→effects loop is
   non-divergent — assert `local01` deltas damp (|Δ| per tick bounded and the K-tick
   moving average converges) under a fixture where institutions grow. Piety cannot mint
   institutions or authority directly (it multiplies couplings that are themselves
   clamped), so the loop closes only through slow institutional channels — the test
   proves the composition stays inside the envelope (owner's named runaway).
4. **Receipts:** every amplified outcome carries `amplifiers:{localMult, realmMult}` +
   causes; pinned by a receipts-shape test (claims-carry-enforcement).

### 2.5 Amplifiers × the double axis

Piety multiplies **all** deity-flavoured pressures symmetrically, hostile ones included
(owner: devout+evil ⇒ holy-war pressure; devout+good ⇒ pax dei):

- Stance-derived hazards and affinities (§3.3) are multiplied by the ACTING settlement's
  `pietyMult` (its zeal drives its behavior), with the composite clamp applied after —
  a devout evil-patron settlement backstabs harder and oftener within its cadence caps;
  a devout good-patron settlement's alliance/peace weights rise; a low-piety settlement
  (mult < 1) fades toward secular baseline — deity politics literally matter less where
  faith is thin, more where it is everywhere.
- Cooldowns, caps, hysteresis margins, and the containment cap are NEVER amplified
  (guards absolute — pantheon.js:70, RELIGION_TUNING flip margins, betrayal cooldowns in
  §3.3). Amplifiers scale magnitudes and probabilities-within-caps, not cadence guards.

---

## 3. DOUBLE-AXIS BEHAVIOR AUDIT — owner's matrix vs their niche grid

Owner contract (addendum B): Good–Evil = INTENT (cooperation propensity + betrayal
hazard; good ≈ never betrays, alliance/peace-seeking; evil = nonzero hazard vs EVERYONE
incl. same-axis, amplified vs Good, instrumental alliances). Law–Chaos =
METHOD/RELIABILITY (LE strategic/triggered betrayal honoring pact letter; CE capricious
even self-destructive; LG durable treaties; CG peace-seeking but flaky; LN order-first;
CN max variance not max malice; TN reactive). Deepest enmity = diagonals LE↔CG, CE↔LG +
direct G↔E; Law↔Chaos same-moral = friction not enmity. Decision 2 (binding): the grid
is temperament × alignment, lawAxis ADDITIVE; warlike/peacelike stays load-bearing.

### 3.1 Where their model already produces the contract

| Contract behavior | Their mechanism | Evidence |
|---|---|---|
| G↔E direct enmity | alignment-gap conversion resistance (aGap term, weight 0.6 — "either opposition alone can substantially counter") | religiousContest.js:129-137 (incumbentCounterForce), positions :97-98 |
| Evil's instrumental opportunism | evil-only growth boost under the compromise chain (COMPROMISE_EVIL_AMP 0.45) — the dark thrives where rule rots | religionLegitimacy.js:167-180; compromise chain :134-142 |
| Evil betrays "even its own" (NPC altitude) | evil deity corrupts the FAITHFUL — onset multiplier vs its own adherents, gate relaxed even in crime-free towns | corruption.js:262-280; npcAgency.js:671-702 |
| Warlike belligerence (temperament, correctly separate from intent) | W_DEITY 0.35 signed aggression drive; warbound conversion 1.35× at spearpoint | disposition.js:158/:163/:234; religiousContest.js:94 |
| Good/peace de-escalation | peacelike ⇒ −0.35 drive (same term, negative sign) | disposition.js:163, :234 |
| Regime↔faith kindredness | mandateAlignmentFit (despots favour warlike/evil, monarchies good/neutral; "never fully punishes") + deityRulerFit in growth/legitimacy | religionState.js:535-549; religionLegitimacy.js:147-152 |
| Law axis as a distinct lever (not enmity) | lawful ⇒ +law_order/−corruption-tolerance; chaotic inverse — deliberately NOT folded into onset/exposure (no double-count) | corruption.js:175-198, :214-219; causalState.js:731-744 |
| Same-niche exclusion (kindred gods compete hardest for the same devotees) | one-deity-per-niche + push-out contest | religionState.js:59-61, :283-292 |

### 3.2 Where the contract is NOT yet produced (the Phase 4 delta)

1. **No stance function exists.** Nothing anywhere computes a pairwise deity→deity (or
   deity-bearing settlement pair) stance. Inter-deity interaction today is purely
   competitive conversion inside one settlement. Grep-verified: no
   betrayal/alliance machinery consumes deity axes
   (relationshipRulesAdversarial.js, npcAgency.js, factionCompetition.js,
   warDeployment.js contain zero deity references beyond npcAgency's corruption gate).
2. **lawAxis is invisible to the religion engine.** nicheOf (religionState.js:60),
   incumbentCounterForce (:129-137), deityRulerFit (religionLegitimacy.js:147-152), and
   mandateAlignmentFit (religionState.js:538) all read ONLY temperament+alignment.
   Verified: `lawAxis` appears in zero worldPulse religion modules. So LE↔CG / CE↔LG
   diagonal enmity, pact durability, and capriciousness are unrepresented.
3. **"Good allies/peace" has no positive channel.** Peacelike damps aggression, but no
   deity-driven alliance/treaty formation or peace-brokering weight exists.
4. **"Evil backstabs allies" has no channel at all** — there is no ally-betrayal hazard
   keyed on anything, let alone deity intent.

### 3.3 The Phase 4 design: `deityStance.js` (pure) + two consumption lanes

New module `src/domain/worldPulse/deityStance.js` — pure, rng-free, pinned data tables
(the owner delegated grid design; weights land as governed tables, deityEffects-style
equality-pinned):

```js
// stanceOf(deityA, deityB) → { affinity: -1..+1, betrayalHazard: 0..1, pactDurability: 0..1, variance: 0..1 }
export const STANCE_TUNING = Object.freeze({
  // INTENT (good–evil): cooperation propensity + hazard floor/aimed hazard
  GOOD_COOP: +0.5,            // good side: affinity lift, hazard 0
  EVIL_HAZARD_BASE: 0.15,     // evil betrays EVERYONE ≥ this (incl. same-axis allies)
  EVIL_HAZARD_VS_GOOD: 0.35,  // amplified against Good (the owner's "especially")
  // METHOD (law–chaos): shapes HOW, never who is hated
  LAW_PACT_DURABILITY: +0.4,  // lawful: durable treaties; betrayal only strategic/triggered
  CHAOS_VARIANCE: +0.5,       // chaotic: capricious timing, flaky pacts (CG), self-harming raids (CE)
  DIAGONAL_ENMITY: 0.25,      // extra negative affinity on LE↔CG and CE↔LG diagonals
  SAME_MORAL_LAW_FRICTION: 0.10, // Law↔Chaos same-moral = friction, NOT enmity (small)
  TEMPER_STAKES: 0.3,         // warlike pairs escalate stakes (temperament stays load-bearing)
});
```

Behavior derivation (data-driven, no branching per named alignment — the 9 archetypes
fall out of the two signed axes): affinity = f(alignSigns) − diagonals − law friction;
betrayalHazard = evil-side base + vs-good amplification, shaped by law (lawful ⇒
triggered-only: hazard applies only when a stance TRIGGER fires — e.g. target weakened,
war exhaustion, occupation opportunity; chaotic ⇒ unconditional per-tick hazard with
high variance); pactDurability drives relationship-decay resistance; variance drives
roll spread. True Neutral (legacy default per the owner) ⇒ all-zero stance = today's
behavior.

**Local lane (standalone-safe, no flag):**
- Patron-vs-cult friction: schism/organic contest pressure gains a stance term —
  a same-niche rival with hostile stance escalates `contestedTicks` accrual and the
  organic-contest eligibility (religionState.js:445-447 area), weights from the table.
- Receptivity: `incumbentCounterForce` gains a bounded law-method term (lawful
  incumbents resist chaotic newcomers' *methods* and vice versa) — ADDITIVE new term,
  zero for law-neutral/legacy deities (customContentSchema tolerance semantics:
  absence ⇒ neutral ⇒ 0 ⇒ byte-identical, corruption.js:200-208 precedent).

**Global lane (toggle-gated by `faithSpreadEnabled`, seeded tick):**
- For codepoint-ordered pairs of deity-bearing members, stance feeds the EXISTING
  relationship-evolution weights (adversarial rule weights up for negative affinity,
  alliance/peace-brokering weights up for positive — consumed where relationship rules
  already take weights, never a parallel ledger).
- Betrayal events: hazard rolls fork the pulse PRNG per pair+tick
  (`deity-stance::${tick}::${a}::${b}` — consumption-independent forks, the
  religion-contest idiom at religiousContest.js:468). Guards: per-settlement betrayal
  cooldown (no re-betrayal within BETRAYAL_COOLDOWN_TICKS), per-tick realm cap
  (MAX_BETRAYALS_PER_TICK, containment-cap idiom pantheon.js:70), asymmetric by design
  (evil initiates; good's "hazard" is 0 — it may only respond).
- Receipts name the stance inputs (both deities' axes, trigger, both piety multipliers).

**Where their model must be ADJUSTED (weights, not rewrites):**
- mandateAlignmentFit (religionState.js:535-549) gains a small law term (lawful patron
  props traditional monarchies harder; chaotic patron props despots-by-fear less) —
  bounded, additive, neutral ⇒ 0.
- deityRulerFit (religionLegitimacy.js:147-152) unchanged in Phase 4 (compromise chain
  already covers the intent side; adding law here risks double-counting with the
  corruption-tolerance lever — revisit only if soak shows chaotic-lawful ruler mismatch
  is inert).
- The niche key STAYS 2-axis (`temperament:alignment`, religionState.js:60). Rationale:
  the niche grid is the competitive-exclusion certification substrate (slot capacities,
  entry paths, 60k-scale contest soaks all assume 9 niches); a 27-cell grid would
  re-open all of it for marginal expressiveness. Law differentiates same-niche rivals
  through stance/receptivity instead — decision 2's "additive" doctrine applied.

---

## 4. GENERATION-TIME STARTING PANTHEON (§6 of RELIGION_REWORK) — status: **NOT IMPLEMENTED, VERIFIED**

Verification (2026-07-09): T:src/generators/ contains **zero** references to
`primaryDeitySnapshot`, `religionState`, `pantheon`, or starting-pantheon minting
(grep across src/generators + whole-tree search for "starting pantheon" — only the doc
mentions it: T:docs/RELIGION_REWORK.md:183-186). Deities enter the world exclusively
via the DM actions SET_PRIMARY_DEITY / IMPOSE_CULT (mutateEntities.js:756-843) and then
spread. The dossier's "spec'd but implementation UNVERIFIED" resolves to **ABSENT**.

What remains (Phase 4 W-F5 — the one generator-side, golden-regenerating wave):

1. **Governed deity pool** — a data table (`src/data/deityPool.js`, house
   foodImportRates-style with rationale comments): ~20-30 authored deities spanning the
   temperament×alignment grid with lawAxis + domains, culture/terrain affinity tags.
   This is also the "DM-seeded global pool" §2.7 spread substrate for worlds whose DM
   never authors a custom god.
2. **Generation step** (new step in the generator pipeline, seeded from the frozen
   recipe like every step): mint a chief (patron) + 0..(capacity−1) minor cults per
   settlement, tier-scaled (capacityForTier — religionState.js:64-66), deterministic
   draws (forked rng per step, codepoint-ordered), affinity-weighted by
   terrain/culture/government. Embeds write the SAME field-disciplined snapshot shape
   as setPrimaryDeity (:782-796) into `config.primaryDeitySnapshot` +
   `config.cultDeitySnapshots` — the pulse then seeds religionStates lazily via
   ensureReligionState on first advance (:151-186; no generator-side worldState
   writes).
3. **Config surface**: a generation-config field (`config.faith = 'none'|'pantheon'`,
   default TBD with owner — recommend `pantheon` for new generations; `none` preserves
   deity-free generation for users who want it). Absent field on legacy configs ⇒
   tolerant reader ⇒ `none` ⇒ byte-identical regeneration of old recipes.
4. **Golden regen**: ONE reviewed 155-config `generator-golden-master` +
   goldenViewModel regen (the deliberate output change §6 names). Scheduled as Phase
   4's single generator-golden event; the dormancy oracle and worldpulse fixtures are
   unaffected until a pulse runs.
5. **Ref namespacing**: pool deities mint refs `deity:core:<slug>` (stable across
   saves — a valley of settlements sharing the Harvest Mother is the intended §2.5
   prevalence-clustering substrate); the wave-4 registry-collision verify (§1.6) covers
   custom refs.

---

## 5. PRODUCT SURFACE STATUS

Arriving with merge wave 4 from their tree (VERIFY on adoption, don't rebuild):

| Surface | Their evidence |
|---|---|
| Pantheon workspace panel (map) | T:src/components/map/PantheonPanel.jsx (+ test tests/components/pantheonPanel.test.jsx) |
| Map overlay deity assignment | T:tests/components/assignDeityFromMap.test.jsx; WorldMapStage/RealmInspector/RealmDashboard deity reads |
| Settlement faith facts | T:src/components/settlement/WarFaithSection.jsx (faithProfile/divineMandateStatus consumers) |
| Compendium: authoring + effect preview + activation strip | T:src/components/compendium/{customCategories.js:75-82, DeityEffectPreview.jsx, PantheonActivationStrip.jsx, CustomContentGate.jsx} |
| Sim rules toggle | T:src/components/map/SimulationRulesDialog.jsx:72-73 |
| PDF faith section | T:src/pdf/lib/liveWorld.js:51-55 (pantheonStandings, describeDeityEffects, divineMandateStatus, patronContestOdds), read-model :94-107 |
| Gallery facet | T:src/lib/gallery.js:633 (`primary_deity` column fallback to embed name; deity migration 049 already in our chain) + campaign pantheon rows T:src/components/gallery/CampaignStatePanel.jsx:178-213 |
| Display depth module | display/pantheonDepth.js (O already has it — prep landed it) + admin tuning panel test |

**Phase 4 must VERIFY at wave-4 adoption:** (a) all faith surfaces render from the
embed/read-models only (never customContent at display time — the pulse decoupling
doctrine); (b) gallery/publish allowlist: `faithProfile` and deity fields pass the
fail-closed 38-key allowlist deliberately (explicit allowlist additions + drift-pin
update, per the seed-secrecy posture — decision 3; deity snapshots contain no DM
notes by construction, field discipline mutateEntities.js:782-796); (c) SHARED_FIELDS
parity decisions recorded for faithProfile/piety (owner contract names this
explicitly); (d) premium gate intact on deity authoring; (e) registry ref-collision
check (§1.6); (f) customCategories.js:75 comment fixed ("three frozen tag axes" → four).

**Phase 4 must ADD:**
1. Piety readouts — faith panel + PDF parity row: local01 with cause bars
   (authority/institutions/devotion), localMult/realmMult chips, and the realm gauge
   when spread is on. Copy honours VOICE_AND_TONE; receipts-on-tap reuses the
   explanation-field idiom.
2. Stance surfaces — inter-deity enmity/affinity lines in the pantheon panel (global
   lane, spread-on only) + patron-vs-cult friction note locally; wizardNews templates
   for betrayal/alliance/holy-war events (threaded via the E4 arc-threading, subject to
   the feed-distribution envelope).
3. SimulationRulesDialog: `faithSpreadEnabled` rename + spread-only copy (the current
   copy at T:SimulationRulesDialog.jsx:73 describes contest+seats, which becomes the
   ungated local lane — copy must change with W-F1).
4. Starting-pantheon generation config control (wizard) + faith panel "alive on day
   one" states.
5. Gallery/PDF/panel additions all land with their own pins (allowlist drift pin,
   PDF section render-lane test in the F36 pdf lane, panel honesty gates).

---

## 6. RE-CERTIFICATION PLAN

Baselines to protect (unchanged unless a wave says otherwise): 155-config
`generator-golden-master` (byte-identity; regen ONLY in W-F5, reviewed);
`worldpulse-golden-master.json` under `normalizeForDormancy` (regen ONLY in W-F1,
reviewed); deity-FREE dormancy byte-identity (NEVER regens — it must hold verbatim
through every wave); full `npm run check` gate + Deno lanes at every wave boundary.

**Soak matrix (re-run at each behavior-changing wave; O already carries all 4 scripts):**

| Script | Scale | Re-run after | Watch |
|---|---|---|---|
| religion-balance.mjs | 300 seeds × 80 ticks (the Monte-Carlo cert lane) | W-F1, W-F2, W-F3 | contest hold-rate surface, evil-rise reliable-not-monolithic |
| religion-soak.mjs | 40 × 60 live loop | every wave | share drift, stuck schisms, NaN degeneracy guards |
| religion-coup-soak.mjs | 3 cohorts, full pulse | W-F1, W-F3 | mandate props/erodes → coup rates per cohort stay in band |
| simulate-religion.mjs | region reps × ticks, kernel-driven | W-F1, W-F3, W-F4 | conversions, tier shifts, mints, fracture stressors |

**W-F0 captures the BEFORE-numbers** (the Track-I discipline): run all four on the
freshly-landed port and pin the emergent distributions as envelope baselines (evil
patron share by corruption cohort, patron-flip rate/1k ticks, schism resolution time,
conversion count per region-run, coup incidence per cohort). These are the Phase 4
regression gates.

**New pins the amplifiers need:**
1. `pietyNeutrality.test.js` — the zero-span byte-equivalence (§2.4.1) on both the
   dormancy fixture and a religion-active fixture. THE load-bearing pin.
2. `pietyBounds.property.test.js` — N-tick bound + stationarity (§2.4.3), seeded
   cohort, growing-institutions fixture (the runaway loop the owner named).
3. `pietyReceipts.test.js` — every amplified outcome names both multipliers + causes.
4. **Amplified-world distribution envelope** — a high-piety cohort (temple-rich,
   ascendant patrons, spread on) vs a neutral cohort through religion-soak-style runs:
   pin that amplified worlds shift distributions in the DESIGNED direction and
   magnitude band (conversion velocity ×~1.2-1.8, mandate coup coupling stronger,
   never outside MULT bounds), and that a mostly-secular realm's realmMult ≈ 1.0±0.05.
5. **Dormancy byte-identity EXTENSION** — the existing oracle test gains legs: (a)
   deity-free + all Phase 4 code present ⇒ byte-identical (extends automatically via
   the identity short-circuit, but assert it explicitly against the pre-Phase-4
   fixture); (b) spread-off inertness N-tick property (owner pin 1); (c) law-neutral +
   True-Neutral legacy deities ⇒ stance all-zero ⇒ pre-stance behavior byte-identical
   on a religion-active fixture (the additive-axis back-compat, mirroring the lawAxis
   absence⇒neutral discipline).
6. **Stance determinism/cadence pins** — pair-fork reproducibility, betrayal cooldown +
   realm cap honored under adversarial fixtures, feed-distribution envelope still green
   with religion news flowing (E4 pins re-run, not rewritten).
7. **Tuning-table equality pins** — PIETY_TUNING / STANCE_TUNING consumed-not-retyped
   by every surface (the deityEffects.test.js pattern), claims-carry-enforcement.

**Golden regen ledger for Phase 4 (each ONE reviewed event):** W-F1 worldpulse-oracle
regen (gate split changes flag-on shapes; deity-free unchanged), W-F5 generator golden
regen (starting pantheon). No other wave may touch either fixture; W-F2/3/4 must land
golden-clean on flag-off/deity-free paths and envelope-green on active paths.

---

## 7. BUILD SEQUENCE (implementer waves — Opus; each wave gate-green before the next)

Precondition: merge waves 4-5 complete (store mounts SET_PRIMARY_DEITY/IMPOSE_CULT →
`config.primaryDeitySnapshot`/`cultDeitySnapshots[]`, W2b causalState with
DEITY_RANK_AUTHORITY imported from deityEffects per the O-header contract, product
surfaces adopted, single wave-5 golden regen done). Every wave: golden protocol +
F1-F47 adoption checklist + determinism doctrine (no Date.now/Math.random/locale; rng
only via per-step forks; codepoint iteration; tick-start reads) + receipts on every new
outcome + pins born with the feature.

- **W-F0 — baseline + parity audit (no product code).** Verify port parity holds at
  wave-5 exit (religion suites green, the 3 documented divergences intact: prng reseam,
  DEITY_RANK_AUTHORITY ownership resolved by W2b, F12 regex + formatCount applied).
  Run all 4 soaks; commit envelope baselines as fixtures (the before-numbers). Wave-4
  verify list from §5 executed. GATE: full check + envelopes recorded.

- **W-F1 — gate split + owner pins.** `faithSpreadEnabled` + migration from
  `religionDynamicsEnabled`; local/spread lane split in advanceReligionStates +
  pulseKernel (§1.9); the 4 owner pins under contract names; freeze-semantics test;
  deliberate revision of the flag-off unit pin; SimulationRulesDialog copy;
  worldpulse-oracle regen (reviewed). GATE: dormancy verbatim-green, soaks in baseline
  envelope for spread-on runs, spread-off local-lane envelope NEWLY pinned.

- **W-F2 — stance function, LOCAL lane.** `deityStance.js` + STANCE_TUNING tables +
  equality pins; law-method term into incumbentCounterForce; stance term into
  schism/organic contest pressure; mandateAlignmentFit law term. All additive,
  neutral-zero for legacy/True-Neutral deities (back-compat pin 5c). GATE: golden
  untouched, religion-balance + religion-soak envelopes (expect small deltas on
  law-authored fixtures only — reviewed).

- **W-F3 — piety amplifiers.** `piety.js` + PIETY_TUNING; faithProfile.piety
  projection; realm aggregate at tick start in pulseKernel; the §2.3 site table applied
  seam-by-seam with receipts; pins 1-4 + dormancy extension 5a/5b. GATE: zero-span
  byte-equivalence green, bounds/stationarity green, full soak matrix + amplified-world
  envelope pinned.

- **W-F4 — stance GLOBAL lane (spread-gated).** Stance → relationship-evolution
  weights; betrayal hazard events with pair-forked rolls, cooldowns, realm cap;
  good-alliance/peace weights; piety composition (§2.5); wizardNews templates under
  the E4 envelope. GATE: spread-off inertness property still green (the lane is inside
  the spread gate), simulate-religion + coup-soak envelopes, feed-distribution pins.

- **W-F5 — starting pantheon (the generator wave).** deityPool.js governed table;
  generation step + config field + tolerant reader; ref scheme `deity:core:<slug>`;
  ONE reviewed 155-config golden regen + goldenViewModel; wizard config control. GATE:
  legacy-config byte-identity (faith='none' path), regen reviewed key-by-key
  (faith-only diffs), full suite.

- **W-F6 — product surface + polish.** Piety readouts (panel/PDF parity), stance
  surfaces, allowlist additions + drift pin, copy pass, preview-verified; PDF render
  lane extended. GATE: full check + pdf lane + a11y/tap-target sweeps clean.

- **W-F7 — re-cert closeout.** Full soak matrix re-run + envelopes ratcheted to
  post-Phase-4 bands; docs (RELIGION_REWORK.md Phase-4 addendum + this delta spec
  merged into docs/); grade-check per the A+ maintenance invariant; owner report with
  the before/after distribution tables.

Dependency notes: W-F2 before W-F3 (piety multiplies stance outputs; landing stance
first keeps W-F3's neutrality proof one-variable). W-F4 after W-F3 (betrayal magnitudes
ship piety-composed from birth — no double regen). W-F5 is independent of W-F2..4 and
may run in parallel fences EXCEPT its golden regen must not interleave with any other
agent's golden checks (the standing lint-staged/golden hazard — manager commits solo).

## Open items for the architect/owner

1. Starting-pantheon default (`pantheon` vs `none`) for NEW generations — recommend
   `pantheon` (day-one faith panel life; §6 of the rework intended it), owner to ratify.
2. `religionDynamicsEnabled` deprecation window after migration (keep tolerant reader
   one release? — recommend yes, delete in Phase 6 lifecycle pass).
3. Magic-legality amplification deliberately excluded (§2.3) — revisit in Phase 5 if
   legality becomes scalar.
4. Registry ref-collision verify (§1.6) — wave-4 checklist item; escalate only if
   collisions are possible cross-account.

---

## Architect ratifications (2026-07-11, under the owner's delegated-judgment mandate)

1. **Starting-pantheon default = `pantheon`** for new generations. A `none` default ships a
   dead faith panel to most users; the contract's standalone-faith intent wants day-one life.
   Lands with W-F5 and its reviewed generator-golden event. Existing saves untouched.
2. **`religionDynamicsEnabled` deprecation**: tolerant reader kept one release after the
   W-F1 migration to `faithSpreadEnabled`; deleted in the Phase 6 lifecycle pass.
3. **Magic-legality amplification stays excluded** from the piety table — stepwise enums
   don't multiply. Revisit only if Phase 5 makes legality scalar.
4. **Registry ref-collision verify** added to the merge wave-4 checklist (escalate only if
   cross-account collisions prove possible).

Golden-event budget for Phase 4: exactly two reviewed events (W-F1 worldpulse-oracle
rebase, W-F5 generator golden), distinct from the merge program's single regen.

---

## OWNER DESIGN REFINEMENT (2026-07-10) — the stance heuristic and the axis integration directive

Supersedes decision 2's "temperament retained" posture and refines §3's stance design. Owner's words, formalized:

### The stance heuristic (fills W-F2's tables)
- **EVIL = self-centered, non-consolidated.** High aggression baseline against ALL alignments
  INCLUDING its own (strikes out / out-manipulates / seeks control, power, influence). In
  conflict-target preference, only a SLIGHT tilt toward good/neutral over evil — evil does not
  form a bloc. Evil alliances are transactional and carry standing betrayal risk.
- **GOOD = common-ground-seeking, consolidated.** Cooperation bias toward mutual benefit
  (touches trade formation and treaty terms, not just war). Low conflict baseline against
  everyone, EXCEPT strong, consolidated aggression against evil.
- **Emergent consequence (the design's self-balancing property):** coalitions of light vs a
  fractious darkness arise from the asymmetry itself — evil is locally strong / globally weak
  (fragments), good is globally strong / slow to strike (stable, not expansionist). Neither
  pole dominates the map by construction.
- **LAW axis governs method + durability, not direction:** lawful evil = ordered domination
  (vassalage, coercive-but-held treaties); chaotic evil = raids + betrayal; lawful good =
  pacts + institutions; chaotic good = ad-hoc aid. Treaty half-life scales with lawfulness.

### The amplifier composition (stance × piety)
The patron deity's stance is an AMPLIFIER on the settlement's generated temperament: it biases
the settlement's own actions, its trade posture, and its willingness to sue for peace — scaled
by piety (W-F3's local scalar). Direction from stance, magnitude from piety; a nominal
settlement barely shifts, a devout one substantially. Consumption seams: dispositionLedger
inputs, trade salience/coercion willingness, war wind-down / peace-suing thresholds.

### The axis integration directive (OWNER, supersedes the additive-model ratification)
warbound × peaceful is INTEGRATED INTO lawful×chaos + good×evil — not retained as an
independent stored axis. "Warlike" becomes a DERIVED, TARGET-CONDITIONAL property: no deity is
abstractly warlike; aggression(A→B) derives from A's two-axis alignment + the stance tables +
target B's alignment. Staged execution:
- **W-F2 (revised):** deityStance.js implements the target-conditional tables above + a
  temper-DERIVATION SHIM — stored temperament becomes read-time-derived from the two axes
  (byte-compatible during transition; the niche key still reads the derived value).
- **W-F3:** piety amplifiers unchanged, now explicitly the magnitude knob on stance bleed.
- **W-F4 (grown):** the structural retirement — stored temperament axis removed (migration for
  the deity-shape CHECKs, niche re-key onto derived temper, warbound-conversion + mandate-fit
  re-plumbed to the derivation). This is the redesign's heavy half.
- **W-F7:** re-certification becomes a FULL re-run against the W-F0 baseline (not a delta) —
  the niche-composition change requires it. Envelope targets: the self-balancing property above
  must be OBSERVABLE (no runaway pole across the config grid).

### The risk-calculator fidelity term (OWNER, 2026-07-10 — lands in W-F4)
The war feasibility gate (worldPulse/feasibilityGate.js — the existing "risk calculator") is
obeyed with alignment-conditioned fidelity: LAWFUL actors follow its verdict to the letter;
toward neutral and chaos the actor decides on a NOISY ESTIMATE of the true inputs, margin of
error increasing substantially and scaling (superlinear toward the chaotic pole).
- DETERMINISM: the error term is a seeded draw from the actor's per-decision rng fork —
  replay-identical; chaos in the fiction, never in the engine.
- SCOPE: the same discipline term governs war initiation, deployment sizing, AND suing for
  peace (a chaotic actor misjudges when it is losing — fights past exhaustion or quits
  winnable wars). Composes with stance x piety: settlement governance sets base discipline;
  the patron's law axis pulls on it scaled by piety.
- BALANCE CAUTION (binding on W-F7 certification): the calculator is itself a model with
  blind spots — some calculator-refused wars are genuinely winnable, and only high-error
  actors ever discover them. The W-F7 envelopes must show chaotic actors winning SOME
  refused-rated wars (variance with occasional payoff); if chaos is a pure tax, the term is
  mistuned. Lawful realms: fewer, better wars; chaotic realms: more, noisier wars; neither
  pole runs away.

### The corruption-plane amplifier (OWNER, 2026-07-10 — lands in W-F3 with the piety amplifiers)
Corruption/compromise amplification (institutions AND individuals) scales across the full
two-axis plane: STRONGEST at chaos x evil, CLOSING TO ZERO at lawful x good. The corner is
SUPERADDITIVE — the two restraints are independent (good = conscience, law = systems) and
corruption requires both absent, so their failures multiply. Neutral plane-center ~= 1.0
(baseline unchanged).
- COMPOSITION: patron deity's plane position gives direction/strength; piety gives bleed-through
  (stance x piety pattern; deity-free or zero-piety => multiplier 1.0, byte-identical — the
  neutrality theorem extends over this surface).
- SCOPE: scales the PRESSURE channels only — institution capture/compromise rates, NPC
  corruptible-flaw expression, climate drift. Corruption already stamped into the world is not
  retroactively erased; a lawful-good conversion starves the rot forward, never launders history.
- CLAMP (binding on W-F7): the chaos x evil corner is dramatic, not degenerate — devout-CE
  settlements sit at a clamped maximum (playable thieves'-city, not collapse). Envelope targets:
  devout-LG ~= zero new compromise, devout-CE = clamped max, neutral = baseline, no runaway
  anywhere on the plane.
- The W-F3 amplified-site table gains the corruption-pressure rows; the surface consumes
  W-F2's derived evil01/chaos01.

### Development fidelity + government-form synergy (OWNER, 2026-07-10)

**Development fidelity (lands W-F4 with the discipline term's other consumers).** The existing
optimal development planner — expand the strongest viable value chain; on reasonable saturation
(no metals => no mine) pivot to the next — is the LAWFUL pole's behavior exactly. Chaotic
patronage injects the same seeded, piety-scaled estimate-noise into the VALUE RANKING itself:
suboptimal expansions, late pivots, lingering on saturated chains. Reading pinned: "good
economies" = the healthy-economy baseline planner; law-chaos modulates decision QUALITY;
good-evil keeps trade CONDUCT via the stance heuristic. Emergent property (bind to W-F7 /
Phase-6 envelopes): chaotic misdevelopment = accidental diversification — lawful economies
show higher peak prosperity AND higher depletion/trade-shock fragility; chaotic show lower
peaks, fatter survival tails. Same variance-with-payoff law as the war calculator.

**Government-form x law-axis synergy (the fourth amplifier — lands W-F3; LAW AXIS ONLY, never
good x evil: the FORM of rule is a law-chaos matter, its CONDUCT is good-evil).** Each
governance form carries a law-axis affinity: feudal/royal/dukedom/magistracy => lawful;
free-towns/frontier compacts/tribal moots => chaotic-lean; merchant councils => center;
criminal syndicates => chaotic. Patron law-position vs the form's affinity feeds legitimacy
weight, mandate strength, and stability — piety-scaled; mismatch = legitimacy friction (the
trickster god over a dukedom; the lawgiver's temple in a freebooter port). THEOCRACY special
case: its affinity IS the patron's position — synergy by construction (which is why
religious_authority already amplifies everything else). Neutrality theorem holds: deity-free
or zero-piety => no synergy term, byte-identical.

### Evil-pact cohesion (OWNER, 2026-07-10 — lands W-F4, inter-deity alliance/betrayal channel)
Evil deities DO band together for convenience, and pact cohesion within evil scales on the LAW
axis: two lawful-evil deities bond more strongly than ANY combination containing a chaotic-evil
party — semantics: evil-pact cohesion amplification keys on the MINIMUM lawfulness across the
parties (the least lawful member sets the ceiling); betrayal hazard scales inversely. So
LE x LE > LE x CE >= CE x CE. The earlier asymmetry remains the cap: even the strongest
lawful-evil compact is transactional and betrayal-priced — evil's best cooperation approaches
good's consolidated baseline, never exceeds it. (Devils hold treaties; demons can't hold a
handshake — derived, not declared.)

### The reciprocal patron loop (OWNER, 2026-07-10 — lands W-F4; envelopes W-F7)
Patron deities are CHOSEN and RETAINED by three inputs: legitimacy, conversion (adherent
share), and ALIGNMENT FIT — how much the settlement's own actions align with the deity's
two-axis position. The relationship is RECIPROCAL BUT NOT PERPETUAL: the patron's amplifiers
shape conduct, aligned conduct feeds the patron's hold, and the loop must be continuously fed
— fit DECAYS, so drifting conduct erodes patronage.
- ENDOGENEITY FILTER (strict): the fit measure reads ONLY the settlement's own domestic
  conduct — development discipline, governance actions, corruption/purge events, internal
  contests. EXCLUDED ENTIRELY: external actions/situations (war, trade, partnerships) and
  the USER and PARTY. Foreign policy is governed by the stance/discipline amplifiers but
  never feeds patron fit; the DM's hand is divine fiat, not evidence.
- CONSEQUENCE (bind as behavior): SET_PRIMARY_DEITY (a user action) sets the patron but does
  not feed the loop — an imposed patron over misaligned conduct erodes unless conduct comes
  to match or the user re-intervenes. The imposed-god-that-withers is a native story arc.
- COUNTERFORCES: incumbency is contested from within — rival cults via the niche grid,
  misaligned-faction agitation, internal contest events. Patron status = homeostasis under
  pressure, never ownership.
- STABILITY (binding on W-F7): the feedback gain is SUBCRITICAL — entrenchment is strong,
  absorbing states don't exist. Long-soak envelope: patron transitions continue at realistic
  rates vs the W-F0 hold-rate baseline; no cell of the config grid locks permanently.

### The two gaps — architect's allocation (owner delegated 2026-07-10: "i leave the gaps to you")
**Portfolios (the quiet middle).** Deities gain a PORTFOLIO/domain (harvest, sea, storm, death,
craft, knowledge, ...) in W-F5 with the starting pantheon: (a) niche differentiation at
generation (no duplicate portfolios in a starting cell); (b) ONE mechanical hook through an
EXISTING seam — portfolio-terrain/economy AFFINITY feeds the receptivity term
(deityLocalStrength) that already drives growth. True-neutral faiths become distinctive by
HABITAT, not new physics; the plane keeps ethos/conduct, portfolio owns where faiths thrive.
Orthogonality preserved. Portfolio-flavored content (hooks/blessings/descriptions) = Phase 5.
Full mechanical portfolio effects = future axis, deliberately out of Phase 4.

**Legibility (the last mile).** Cause-chain emission is REQUIRED AT AUTHORSHIP for every faith
mechanism W-F2..W-F4 builds (seat changes, legitimacy crossings, stain, mandate shifts, pact
formation/betrayal) — pinned: no faith mutation ships with an empty reasons chain (extend the
conversion machinery's existing causes pattern). W-F6 renders the chains as plain chronicle
sentences. Emission at authorship, prose at the surface wave, a pin between them.
