# GENERATION-TIME CONTENT — DOSSIER + NAMING SHIFT MAP (predict-first)

Lane: `claude/generation-time-content-dossier` (base = `claude/generation-time-content`
tip `f9720b5a`, the sibling event-prose lane, itself based on `claude/w7-prep` `07d3a1d2`).
Task #27's DOSSIER + NAMING half — the surfaces the sibling event-prose lane deferred
to a taste-sampled sibling (`GENERATION_TIME_SHIFT_MAP.md` §SCOPE deferral table).

This branch **PARKS RED** (the G2 pattern, same as the sibling): growing seeded prose
pools shifts same-seed picks into persisted/golden dossier + world state. **No golden is
re-recorded here.** The goldens regen ONCE at the pre-signed ONE REGEN on the composite.
This doc is written BEFORE the corpus growth (predict-first) and the "VERIFIED" section is
filled in AFTER the build. The branch **does not fold** — it is backup-on-branch only
(RULING #7 EARLY PUSH discipline; no PR, no deploy, owner-gated).

Authoritative inventory: `docs/review-r2/CONTENT_THINNESS_SURVEY_RAW.txt` (banked on the
ledger branch `review-fixes-2026-07-08` @ `71dea09f`). The sibling grew the world-pulse
event-prose slice; this lane grows the dossier/settlement + naming slices.

The owner wants a **TASTE-SAMPLE** of the authored prose before this rides the permanent
ONE REGEN. The taste-sample artifact is produced at the end of the lane.

---

## THE LAWS (enforced by tests/generators/dossierProse.test.js + siblings)

The sibling's four laws (PURE SELECTION / CANONICAL-AT-ZERO / FRAMING-NOT-SEMANTICS /
PORTABLE SPECIFICITY) carry over. This lane adds a FIFTH, load-bearing law, because —
unlike the event-prose lane, which ADDED a pure hash where there was no prior choice — the
dossier surfaces are drawn during generation from the **single global seeded PRNG**
(`src/kernel/rngContext.js`, `_activeRng`). The whole safety of a park-red content grow
here rests on not perturbing that stream's STRUCTURAL output.

**LAW 5 — DRAW-COUNT INVARIANCE (the new, load-bearing law).**
`pick(arr)` advances the stream by EXACTLY ONE `_roll()` regardless of `arr.length`
(`arr[Math.floor(_roll()*arr.length)]`). Therefore:

- A pool selected by a **single `pick`/`pickRandom2`** may be grown freely: the draw count
  is invariant (still one `_roll()`), so only the chosen STRING changes — every downstream
  draw is byte-identical and NO structural/numeric field of the settlement or world moves.
  This is the primary growth lane.
- A pool selected by a **deterministic index** (e.g. `name.length % 3`) or a **fixed field
  copy** (institution `desc`, history `description`) draws ZERO. Adding variety there must
  ALSO draw zero — via the **pure FNV hash** (`fnv1a32(stableSeed) % pool.length`, the
  sibling's `pickLine` idiom) — never a new `pick()` (which would insert a draw and cascade
  the stream). Canonical string stays at index 0.
- A pool selected by a **reroll / retry / `drawUnique`** path draws a VARIABLE number of
  `_roll()`s (collision-dependent). Growing such a pool changes the collision rate → changes
  the draw count → cascades the stream. These are handled surface-specifically: either
  restructured to a fixed-draw selection, kept byte-identical with a separate pure post-pass
  adding the variety, or deferred with a recorded reason. NEVER naively grown.

**Why the shift stays legitimate:** every varied string is display/record-only (no
downstream code branches on the prose text — the load-bearing lookups are on NAMES/keys,
never on `desc`/description/pressure prose). With draw-count held invariant, the only bytes
that move are the specific prose fields, and the regenerated goldens at the ONE REGEN carry
them. Interpolated semantic tokens (counts, cause, provenance, names, the wartime
"on the right side of it" / "losing people and resources" branch anchors) are threaded
through unchanged, so every keyword/structural/branch pin stays green.

---

## SELECTION MECHANISM

Reuse the sibling's pure picker where a draw-neutral hash-select is needed:
`src/domain/worldPulse/eventProse.js` exports `fnv1a32` and `pickLine(pool, seed, interp)`
(falsy seed ⇒ index 0 = canonical; pure, zero rng). For dossier surfaces that already draw
via `pick`/`pickRandom2`, GROW THE POOL and keep the single draw (Law 5, primary lane).

Stable seeds available at each site (for hash-select where a fixed-field surface needs
variety without a draw): settlement `name`/`id`, institution NAME (the object key),
directed relationship pair key (`${r.name}>${s.name}`), event `type` + settlement id.

---

## SCOPE (JUDGMENT, vetoable)

**GROWN (this lane) — draw-safe, single-pick surfaces (primary lane):**

1. **Pressure sentence (CRITICAL)** — `narrativeText.js` PRESSURE_SENTENCES. Most-surfaced
   line in the product (TableView, map QuickInspector, SummaryTabV2). Selected by one
   `pickRandom2` in `generatePressureSentence`. Deepen all 15 stress pools. Fix the
   `religious_conversion` `name.length % 3` selector by returning the full variant array and
   letting `pickRandom2` select (draw-neutral: pickRandom2 already fired on the 1-element
   array; real re-roll variety replaces the clustered deterministic bucket). Deepen the
   `insurgency`/`mass_migration`/`wartime` compound-branch arrays (1→N per branch) and
   `slave_revolt`. **Live-pin constraint:** every `wartime` winning-branch variant must
   contain "on the right side of it"; every losing-branch variant "losing people and
   resources" and not the winning anchor (narrativePressureCompound.test.js, fixed seed).
2. **Political-character flavor** — `narrativeText.js` POLITICAL_FLAVOR. Selected by one
   outer `pickRandom2` in `buildStressProfile`. Deepen the 8 pattern pools. **Constraint:**
   new `*_heavy` variants call `pickRandom2(r.filter(...))?.name` exactly once (matching the
   pattern's inner-draw count); new `catastrophic`/`layered_history`/`stable` variants call
   it zero times — preserves total draw count.
3. **Founding / arrival / stress vignettes** — `narrativeGenerator.js` + `narrativeData.js`:
   TERRAIN_NARRATIVE_HOOKS (8×6), COMMODITY_HOOKS, FOUNDERS_BY_TIER, CHALLENGES_BY_ROUTE,
   OVERCOMING_BY_PROSPERITY, STRESS_DESCS (15×4), ARRIVAL_SCENES (market/river/smoke/guild
   only 2 deep — the thinnest named pools), ARRIVAL_ADDONS (5×4), CULTURAL_DETAILS. All
   single-`pick`/`pickRandom2` → grow freely. **Constraints:** do NOT add
   `ARRIVAL_ADDONS.mountain_pass` (test asserts it undefined); keep STRESS_DESCS openings
   distinct from ARRIVAL_SCENES (stress-wins-over-route test).
   - `STRESS_NOTES` (15×1) is a 0-draw deterministic object lookup MID-history-stream in
     `genArrivalDetail` — deepen via **hash-select** on a stable seed (zero draws), or leave
     single. [decide during authoring — see owner queue]

**GROWN — 0-draw fixed-field surfaces (draw-neutral hash-select required):**

4. **Historical events catalog** — `historyData.js` HISTORICAL_EVENTS_DATA (29 types × 1
   description). Description = single fixed string, 0 draws (recon HIGH). Deepen to a
   `descriptions:[]` array + fnv hash-select on `${ctx._seed}::histEvent::${i}::${type}`
   (0 draws; thread `ctx._seed` → generateHistory → generateEventNarrative, internal signature
   only; falsy-seed ⇒ variant[0]). Grow the single-pick token vocabularies (defaultTokens,
   name pools, ECHO_PREFIXES — mirror ECHO growth into `dossier/plotHooks.js:81`) freely.
   **DEFER:** plotHook DEPTH (the ECHO reframe at historyGenerator.js:546-548 is a
   content-branch draw site) and NEW event types (EVENT_TYPE_NAMES title-uniqueness pins +
   timeline category budgets).
5. **Institution descriptions** — `institutionalCatalog.js` `desc` (301 × 1, fixed field
   spread, 0 draws, NO pins, NO load-bearing substring consumer — recon HIGH). Convert `desc`
   scalar → variant array (`desc[0]` = canonical) + a post-pass at the end of
   `assembleInstitutions` collapsing to one string via
   `fnv1a32(${ctx._seed}:${inst.name}) % desc.length`, written back to the scalar `inst.desc`
   (no persistence-shape change). Do NOT touch institution NAME (object key) — load-bearing
   substring lookup. **Scale:** mechanism + a representative cross-tier sample this pass;
   exhaustive 301 deferred pending taste-approval (see deferral ledger).

**Careful / mechanism-dependent:**

6. **NPC persona / hooks / goals** — `npcData.js`. All persona sites are a single-draw
   `pick` (recon HIGH). GROW the draw-safe display pools: MANNERISMS, SPEECH_PATTERNS,
   NPC_BUILDS, NPC_FEATURES, NPC_WANTS, NPC_FACTION_GOALS, NPC_SECRETS(goals),
   NPC_PLOT_HOOKS(presentation). The relationship archetypes (STRESS_ECONOMIC_EFFECTS, 18×1
   `desc`/`tension` `(r,s)=>string`) grow via a pair-key fnv hash-select (0 draws).
   **DEFER (content-branch hazard):** NPC_PERSONALITY_TRAITS.negative/.neutral feed
   `personality.includes('arrogant'|'greedy'|'pragmatic')` (relationshipArchetypes.js:52-56)
   and NPC_CRIMINAL_SECRETS is keyword-classified — growing either flips a content-branch and
   changes the draw count (cascades relationships/conflicts within the same fork). Also
   NPC_PERSONALITY_TRAITS.positive requires a NPC_TEMPERAMENTS lockstep mirror. Flag (not fix)
   the NPC_WANTS→`clothes` mislabel side-finding.
7. **Faction names (CRITICAL)** — `powerData.js` FACTION_DESCRIPTORS + `factionGrouping.js`.
   The per-settlement naming (single `pick` + 1–5 retry loop + conditional suffix `pick`) is
   DRAW-COUNT-VARIABLE. **Approach (recon PRIMARY, draw-neutral):** leave FACTION_DESCRIPTORS
   and `generateFactions` EXACTLY as-is (per-settlement naming byte-identical, zero rng
   perturbation, zero per-settlement golden shift). Add a NEW **pure rng-free world-assembly
   post-pass** in `composeInstantWorld` (where all members are assembled together) that
   detects cross-settlement `faction.name` collisions and renames them deterministically via
   a local fnv keyed on `${settlement.id}:${memberIdDigest}`, appending a same-category
   descriptor/suffix. **Constraint:** renamed names must still contain their category keyword
   (`inferFactionCategory` substring fallback, factionCategories.js:121-126) and not another
   category's keyword. This is the survey-directed world-scoped-dedupe fix with zero
   per-settlement stream/golden impact.

**DEFERRED-with-reason (owner-gated or adequate):**

| Surface | File | Why deferred |
|---|---|---|
| Institution NAME variety | `institutionalCatalog.js` (object keys) | Load-bearing substring lookup keys (rulingStructure / governanceNarrative / npcGenerator `.includes()`); proper-name variety needs a separate `displayName` schema field = **owner-gated persistence shape**. `desc` variety (grown above) does NOT touch names. |
| Institution service menus | `institutionServices.js` (935 `desc`) | Rated ADEQUATE (menu/reference register, terse utilitarian). No desc picker exists (fixed field keyed by service NAME). Low value / large surface; deferred unless the taste-pass asks for it. |
| Deity names + portfolios | `deityPool.js` | Owner-ratified architecture (cross-settlement repetition IS the design). DO NOT grow without an explicit owner ask. |
| Naming cultures (people/place) | `namingData.js` | Rated adequate; thousands of combos per culture. DO NOT grow without an owner ask. |

---

## PREDICTED GOLDEN-RED SET (before build)

The dossier prose persists into save/version_history/golden data (settlement
`pressureSentence`, `arrivalScene`, `history.founding.*`, `history.historicalCharacter`,
`institutions[].desc`, `npcs[].*`, `powerStructure.factions[].name`). Under PARK RED these
goldens shift at the ONE REGEN. Predicted LIVE-suite (non-golden) reds:

Unlike the sibling event-prose lane (whose actual red set was EMPTY because nothing
exact-pinned its prose), THIS lane genuinely parks a golden: `tests/property/
generatorGoldenMaster.test.js` hashes `sha256(JSON.stringify(settlement))` over a ~187-row
grid and includes every grown field (pressureSentence, arrivalScene, history.founding.*,
historicalCharacter, institutions[].desc, npcs[].persona-fields, factions[].name). It will
go **RED** on growth — **EXPECTED and PARKED; do NOT re-record here** (the ONE REGEN owns it,
`UPDATE_GOLDEN=1`). Likely also red (same-seed, whole-object): `settlementPoliticsDormancyGolden`,
`settlementLifecycleDormancyGolden`, and any instant-world fingerprint golden touched by the
faction rename pass. These PARK.

**LIVE (non-golden) tests must stay GREEN** — they assert pool-wide `startsWith`/`includes`/
regex-anchor/structural bounds (narrativeArrival renders the whole pool; terrainFoundingHooks
loops seeds; narrativePressureCompound pins the wartime branch anchors — preserved by Law 3).
One LIVE test needs a pool-robust update: `stressTypeContentWave.test.js` fixed-seed keyword
probes on STRESS_DESCS (make the probe assert the pick ∈ the rendered pool, or broaden the
regex to cover new entries).

**The lane's verification is a STRUCTURAL DIFF, not "goldens green":** generate the golden
grid before/after each surface and assert the ONLY differing JSON paths are the intended
prose fields — proving draw-count invariance (no structural/numeric field moved). Proven for
pressure sentences below.

---

## DEFERRAL LEDGER (documented in code/tests, NOT bugs to re-find)

- Institution NAME `displayName` schema — owner-gated persistence shape. Not started.
- Institution service menus (935) — adequate register; deferred pending taste-pass.
- Deity + naming-culture growth — owner-ratified; not touched.
- **Exhaustive institution descs (the other ~245 of 301)** — mechanism proven on a 56-institution
  sample; the rest is mechanical pool-growth once the voice is taste-approved. Deferred.
- **History-event descriptions** — 58 authored variants (2 per type) are BANKED in
  `scratchpad/authored_history.json` but NOT yet wired: they carry substitution tokens
  (`{resource}`/`{location}`/…) that must be verified against generateEventNarrative, and the
  wiring needs `ctx._seed` threaded through generateHistory→generateEventNarrative. Deferred to a
  follow-on (clean fnv wiring, same idiom as institutions).
- **NPC display pools** — the authoring fan-out agent stalled (API error), so no strings landed;
  the surface is otherwise draw-safe (single-pick) and can be grown in a follow-on. NPC_PERSONALITY_TRAITS
  (negative/neutral) + NPC_CRIMINAL_SECRETS are DEFERRED regardless (content-branch draw hazard,
  recon HIGH). The NPC_WANTS→`clothes` field mislabel (npcGenerator.js:286) is FLAGGED, not fixed
  (pre-existing, out of a content-growth lane's scope).
- **Deeper vignettes** — grew the survey's thinnest pools (ARRIVAL_SCENES 2→4); STRESS_DESCS
  (needs the stressTypeContentWave keyword probes made pool-robust) and STRESS_NOTES (0-draw
  lookup; hash-select needs a seed threaded into genArrivalDetail) deferred.

## OWNER-DECISION QUEUE (parked, deliberate)

- **Taste-sample gate:** the authored prose register should be owner-reviewed before this
  lane folds into the composite / rides the ONE REGEN. Recommendation: review the taste
  sample; if the voice is approved, the parked branch folds with the sibling at the composite.
- **STRESS_NOTES variety:** hash-select (adds real per-settlement variety, draw-neutral) vs
  leave single (founding coda, lower surface). Recommendation: hash-select if a stable seed
  is cleanly available at the `genArrivalDetail` site; else leave single. [resolve in build]
- [institution-desc scale + faction-registry design — after recon.]

## JUDGMENT CALLS (delegated; each vetoable; all favor the owner's PARK-RED + reuse-the-seam
values)

- **Base = the sibling event-prose branch** (not bare `07d3a1d2`), to reuse `eventProse.js`'s
  pure `pickLine`/`fnv1a32` rather than fork it and to keep the two parked content lanes
  stacked for the composite. Veto reverts by `git rebase --onto 07d3a1d2 …`.
- **Shared picker is a LOCAL kernel leaf** (`src/kernel/proseHash.js`), not a cross-import of
  `eventProse.js`, to keep zero generators→worldPulse coupling. Veto: swap the import.
- **religious_conversion selector swapped `name.length%3` → `pickRandom2`** (the survey-directed
  CRITICAL fix; draw-neutral — pickRandom2 already fired on the 1-element array). Veto reverts
  the closure to the deterministic index.
- **World-scoped faction dedup** is the survey/brief-directed REPAIR of the worst thin-content
  surface (settlement-local dedup is "the root cause"), NOT a new capability — implemented as a
  pure post-pass that touches per-settlement generation not at all. Veto reverts by removing the
  one `dedupeWorldFactionNames(settlements)` call. The rename STRATEGY (same-category descriptor,
  then base+suffix probe) is a taste choice — see owner queue.
- **Institution-desc scale: representative 56-institution sample this pass**, mechanism proven;
  the exhaustive 301 is deferred to the taste-approval (deferral ledger). Veto: adjust the
  sample / defer entirely.

---

## VERIFIED (after build)

> **Progress** (append after every surface)
> - Recon (workflow wf_84ad5c59-7f5, 8/9 agents; political-flavor errored on schema cap,
>   covered by direct analysis): per-settlement + per-step rng FORK confirmed — blast radius
>   of any draw-count change = one forked step-stream of one settlement. All target modules
>   are lazy engine-chunk (no eager risk).
> - **Pressure sentences — DONE + VERIFIED.** Grew 15 stress pools (standard 3→6; compound
>   branches 1→3 per branch with anchors preserved; religious_conversion flattened, dropping
>   `name.length%3`; succession_void `_rng` hoisted). Focused narrative tests: **35 passed**.
>   Structural diff (base narrativeText vs mine over the 187-row golden grid): **178 leaf
>   diffs, ALL on `pressureSentence`, zero other paths** ⇒ draw-count invariance CONFIRMED.
> - **Political flavor — DONE + VERIFIED.** Grew 8 pattern pools (+3/+2 each), matching the
>   inner-`pickRandom2` count per pattern. Structural diff (full tree vs base): only
>   `pressureSentence` + `history.historicalCharacter` moved.
> - **Arrival vignettes — thinnest pools grown.** ARRIVAL_SCENES market/river/smoke/guild 2→4
>   (the survey's thinnest named pools); narrativeArrival green (pool-robust).
> - **Mechanism — `src/kernel/proseHash.js`** (pure fnv + canonical-at-zero `pickVariant`,
>   zero draws). Guard: `tests/kernel/proseHash.test.js`.
> - **Institution descriptions — 56-institution sample, DONE + VERIFIED.** `desc` scalar→
>   `[canonical, ...variants]` selected by fnv on `${ctx._seed}:${name}` in a post-pass at
>   assembleInstitutions end (0 draws; scalar written back). Full base-vs-tree structural diff
>   (1211 leaf diffs): ONLY prose paths moved — `institutions[].desc` (764) + its consistent
>   `defenseProfile.*.desc` projections (176), `pressureSentence` (178),
>   `history.historicalCharacter` (90), `arrivalScene` (3). ZERO structural fields. Guard:
>   `tests/generators/dossierContent.test.js` (walker + register + canonical-at-zero +
>   determinism + wartime anchors). typecheck 0, lint clean, 52 institution/generator tests green.
> - **Faction names (CRITICAL) — DONE + VERIFIED.** World-scoped dedup as a PURE, rng-free
>   post-pass (`src/lib/instantWorld/factionDedup.js`) wired into `composeInstantWorld` after
>   minting: per-settlement generation is byte-identical (the pass runs only on the composed
>   bundle), and cross-settlement `factions[].name` collisions are renamed deterministically to
>   world-unique same-category descriptors (conflicts parties/desc/plotHooks + powerStructure
>   mirror kept consistent; dossier prose uses role-archetype names, never these). Renames by
>   IDENTITY (fixed a bug where two same-name factions in one settlement — local dedup caps out
>   — collapsed to one name). Zero collisions across 15 composed realms (all sizes × seeds);
>   determinism preserved; 19 existing instant-world tests green + 7 new guards
>   (`tests/lib/instantWorld/factionDedup.test.js`). instantWorldFingerprint VALUE shifts once
>   (parked golden; the existing tests pin shape/determinism, not the value, so none red today).
> - Plan opened 2026-07-17 from the survey (`CONTENT_THINNESS_SURVEY_RAW.txt`) + the sibling
>   lane's deferral table.

[TO FILL as surfaces land: full-gate output (with the parked-golden reds enumerated),
eager-closure delta, pool sizes before→after, guard-test counts, commits.]
