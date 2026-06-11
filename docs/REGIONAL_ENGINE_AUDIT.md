# Regional Engine Audit — neighborhood system, inter-settlement dynamics, evolution & growth

> **Method.** Eight-dimension multi-agent review (2026-06-11) over `src/domain/region/`, the world-pulse
> cross-settlement layer, the generation→sim neighbour seam, and every DM-facing regional surface, measured
> against `docs/regional-causality-engine.md`. Every critical/high finding was independently, adversarially
> verified with live node probes against committed code: **23 of 24 confirmed (3 critical), 1 refuted,
> 1 downgraded.** Mediums are reviewer-probed but not independently verified. ~93 agents, all read-only.
>
> **Verdict.** Architecture **8/10** — the spec's hardest contracts genuinely hold (see "What is solid").
> Current truthfulness **5.5/10** — the same disease classes the cohesion program is killing in the local
> simulator (string-joins as identity, frozen-vs-live, dead wiring, dual clocks) recur at the regional
> seams, and three of them corrupt or mis-ground the paid surfaces.

## What is solid (verified, keep it this way)

- **Confirmed-channels-only is real.** No propagation path reads suggested/disabled/dormant channels
  (`graph.js:479`, propagation defaults). Discovery is genuinely advisory.
- **Terminal impact statuses survive rediscovery/rebuild** (applied/ignored/expired/resolved re-queue
  probe + `regionalEngine.test.js:285`), per spec.
- **Waves are bounded**: per-hop decay, `maxDepth`, severity floor 0.08, `pathSettlementIds` loop guard —
  a 3-cycle probe contained.
- **Conditions-over-mutation honored**; applied impacts stamp channel provenance into `causes`.
- **The pulse loop is two-phase** (every settlement derives from the same pre-tick snapshot); refugee
  flows are conserved by construction with an exclusive source tag; stressor ping-pong re-infection is
  guarded; `reconcile.js` implements preserve-don't-overwrite and is wired.
- **Wizard News significance is deterministic with stored reasons**; entry-id dedupe prevents duplicate
  derivation.
- **The spec's Verification Coverage section is accurate** — all claimed suites exist and pass (56
  regional tests + soak + seeded Playwright in CI). Rare and worth saying: the paid feature's docs do
  not overclaim its tests.

## Confirmed CRITICAL

| # | Finding | Where |
|---|---------|-------|
| C1 | **Condition ids truncate the impact id at 80 chars** — two distinct applied impacts can collide onto one condition; resolving one silently strips the other's effect from the settlement. | `propagation.js` (conditionFromRegionalImpact id minting) |
| C2 | **Stale tier proposals apply with no current-state guard.** Tier candidates re-emit every eligible tick (tick-suffixed ids, no pending dedupe), proposals accumulate, and accepting an old "village→town" after the settlement became a city rewinds it — with wrong-direction roster surgery and a bogus tierHistory entry. `applyInstitutionLifecycleOutcome` re-verifies against current state for exactly this reason; the tier path doesn't. | `tierResourceDynamics.js:431-449` + `applyWorldPulse.js:420-447` |
| C3 | **Two unsynchronized tick clocks.** The manual "+1/+3" regional-impact buttons advance `wizardNews.currentTick` but never `worldState.tick`; one press skews them permanently (both persist, nothing resyncs). Afterwards pulse news groups under stale ticks and the **paid 2-credit AI chronicle grounds on `feed.currentTick`** — probe: zero of the latest pulse's headlines reach the grounding. The button is also enabled on tick windows with no entries (empty-grounded paid generation). | `campaignSlice.js:662-681`, `applyWorldPulse.js:236-238`, `WizardNewsPanel.jsx:231-235`, `chronicle.js:29-34` |

## Confirmed HIGH

**Rediscovery tramples DM canon** (`graph.js:309-323`)
- H1. Disabled/dormant channels resurrect as `suggested` on every Discover click (only `confirmed` is
  special-cased). Live today without DM action: the pulse auto-marks stale relationship channels dormant,
  Discover resurrects them.
- H2. Confirmed channels keep only `status`+`confirmedAt` — DM-set visibility (`hidden`→`public`),
  accumulated evidence, strength, and `discoveredAt` are overwritten by fresh candidate values.

**String-joins as identity, regional edition**
- H3. `chain_degraded` goods matching is bidirectional substring (`propagation.js:71-77`): an
  "Offshore fisheries" collapse emits an **Ore** import shortage ('fisheries' contains 'ore'); staple
  chains whose resource prose doesn't contain the good label propagate **nothing**. `exactGoodId` exists
  one file over.
- H4. Resource depletion propagation fuzzy-matches raw config keys (`fertile_floodplain` → `custom.*`),
  so depleted-resource shocks for DM-authored resources never match channel goods — food-critical
  propagation muted (`deriveRegionalState`/graph-core probe).
- H5. `pressureModel.js:13-17` matches conditions by prose substring: "**Warehouse** collapse" scores as
  war pressure, a description containing "afraid" as a military condition — and emits fabricated
  DM-facing reason strings into roll explanations.
- H6. `populationDynamics.js:121-148`: the `siege_lifted` **recovery** condition substring-matches
  `/siege/` — the moment a siege breaks, the recovery condition itself deterministically drives mass
  emigration, with a self-contradicting news explanation.

**Propagation arithmetic**
- H7. One local shock double-queues same-kind impacts through multiple channel types, and per-impact
  apply stacks duplicate conditions on the target (`propagation.js` rules + apply path).
- H8. Stressor spread severity decay is cosmetic: the news/roll say "spreads at 0.58" but the persisted
  stressor carries `max(origin, spread)` = full origin severity, which then drives the target's food
  math and dossier (`stressors.js:861,879-883`).
- H9. The world pulse ages regional impacts AFTER queueing the same tick's propagation
  (`applyWorldPulse.js:394-398`): every pulse-created 1-tick delay matures instantly, cascade hops
  arrive a tick early, and the feed logs contradictory queued+ready pairs. (The canon-event path is
  correct; only the pulse swallows delays. Party/proposal paths explicitly pass
  `advanceRegionalImpacts:false` — the design intent the pulse violates.)

**Frozen-vs-live, regional edition**
- H10. Graph edges freeze `relationshipType` at first build (`graph.js:291-294`); dossier relationship
  edits never refresh it — and relationshipEvolution, npcAgency, pressureModel, stressorDynamics,
  populationDynamics all simulate from the stale value while discovery reads the live links.
- H11. World-pulse relationship evolution never writes back to `neighbourNetwork` — dossier, threat
  profile, PDF, and AI grounding (which declares every relationship canonical) keep asserting labels the
  pulse already changed.

**The neighbour seam is hollow (generation side)**
- H12. The paid "Opened trade route" event writes the label `trade_partners` (plural) which **no other
  subsystem recognizes**: channel bundles produce 0 channels instead of 4, discovery confidence drops
  0.90→0.62, trade_route/information_flow candidates vanish.
- H13. The neighbour relationship type a user picks has near-zero mechanical effect on generation:
  the profile path reads `dyn.*` keys `REL_DYNAMICS` never defines — probes show identical institution
  chances, military scores, and faction-mirror odds for hostile vs allied neighbours.
- H14. Hostile-neighbour militarization is dead in both halves: `config.neighborRelationship` is never
  written; `REL_DYNAMICS.militaryBias` is never read.

**Relationships & realm**
- H15. Vassalage hierarchy cascade flips third-party relationships (allied→hostile, trust 0.9→0.08)
  with no proposal and **no Wizard News** (`relationshipHierarchy.js:61-187`) — the only record is a
  field no UI reads.
- H16. Symmetric relationships simulate permanently one-directional: raids/subjugation/patronage are
  locked to the authoring-order edge orientation (`relationshipEvolution.js:1501-1565`) — one side of a
  war can never be raided; a stronger `to` can never subjugate.
- H17. The realm-arc re-emission throttle reads the wrong end of the newest-first feed
  (`advanceCampaignWorld.js:439-447`, `slice(-80)` on a newest-first list): once a campaign exceeds 80
  news entries, every long arc re-emits a duplicate major headline **every tick**. Fix: `slice(0, 80)`.

**Unbounded state**
- H18. `regionalGraph.eventLog` grows without bound, embedding two full settlement projections (~4.4KB+)
  per canon event **that no code ever reads**; terminal impacts are never archived. All of it persists to
  localStorage (already quota-fragile) and cloud-syncs on every change.

**Downgraded after verification**
- M*. Hidden/GM-channel **impact markers** ignore channel visibility on the map (`regionalMapOverlay.js:80-90`)
  — real asymmetry, downgraded high→medium: `pointerEvents:none` suppresses the leaking tooltip and no
  player view of the map exists; what remains is anonymous orphan markers for concealed channels.

## Refuted (reported honestly)

- ~~"Food ledger is frozen against population change"~~ — mechanism true (the ledger is
  generation-frozen and population moves every tick) but **harm disproven by probe sweep**: the food
  model is exactly population-scale-invariant (dailyNeed and dailyProduction both scale linearly; ratios
  cancel; storageMonths is an infrastructure table). Live re-derivation would be byte-identical. If
  refugee influxes *should* strain food, that is a **model-design decision** (per-capita physics today),
  not a freshness bug — flagged for the owner as a design question, not a defect.

## Reviewer-probed mediums (not independently verified — triage list)

- Channel identity includes the goods set: goods drift mints sibling channels; one shock can queue
  through both (graph-core).
- `causal_shift` rules check variables the causal diff never emits (resourcePressure/resilience/
  externalThreat) — dead branches (propagation).
- Impact dedup keeps the FIRST same-id impact, not the strongest (propagation).
- Saves-array-order dependence: candidate conflict ties + one shared rng stream reshuffle outcomes when
  the settlement list reorders (probe: same campaign, reversed saves → different settlement gets the
  condition) (orchestration).
- Calendar contradiction: campaigns seed `{month:1, season:'spring'}` but months 1-3 derive winter —
  and winter adds +0.08 food pressure, biasing early famines (orchestration, `worldState.js:43-107`).
- Flow proposal gate unreachable: migration severity caps at 0.6, trade at 0.7, gate at 0.72 — every
  refugee transfer (≤12% of population) auto-applies; `majorChangesRequireProposal` never consulted
  (flows.js).
- One upstream famine reaches a dependent through four undocumented stacked paths in one tick
  (spread + flows + queued impact + three additive pressure boosts ≈ +0.38) (orchestration).
- A famine/siege drains population through two unbudgeted paths in the same tick (flow_migration ≤12% +
  population_decline ≤18%, no shared conflict tag) — **verified high-confidence** (evolution).
- Tier/resource/institution candidates bypass `resolveCandidateConflicts` — their conflictTags are dead
  wiring; per-settlement budgets don't apply (advanceCampaignWorld.js:356-380).
- Tier hysteresis hole: promotion fires at 0.92×min — inside the demotion-eligible zone; one ineligible
  tick wipes the whole streak (vs economyDrift's decay-not-amnesia) (tierResourceDynamics).
- Tier promotion reactivation launders corruption impairments that the lifecycle reopen path
  deliberately preserves (`tierResourceDynamics.js:458` vs `institutionLifecycle.js:758-761`).
- City+ settlements deplete resources unconditionally (`rank >= city` OR-clause): calm cities flap
  renewables and one-way ratchet nonrenewables to permanent depletion (tierResourceDynamics:334).
- Relationship memory double/triple-counts one event (incident + pulse history + label change);
  memoryScore saturates and Daily-Life grounding claims escalating rivalry after one incident.
- Persisted memory/posture fields are write-only (refreshed 3×/pulse, read by nothing) — dead state in
  every campaign save (relationshipMemory.js:296-335).
- factionStates never pruned: coup-renamed factions leave permanent ghosts the capture rollup reads.
- Coup hostile-neighbour sponsorship is narrative-only (no cost, no exposure path, never wound down on
  peace; coup excluded from WAR_STRESSOR_TYPES).
- Guaranteed `vassal_overlord_weakness_memory` (p=1) floods Wizard News every tick and evicts real
  incidents from the 8-slot memory buffer.
- Alias vocabulary drift: stressorDynamics matches raw edge labels, ignoring RELATIONSHIP_TYPE_ALIASES —
  'war'/'enemy' edges evolve as hostile but are invisible to hostile-neighbour detection.
- Apply-from-dossier stamps `triggeredAt.tick = 0` always (the feed tick is in scope and unused).
- Applied impacts never reconcile when their materialized condition expires locally — map/inbox/news
  report pressure that no longer exists until the DM manually resolves a ghost.
- Focus policy is dead wiring (spec step 9: full/partial/queued) — everything queues; conservative but
  the spec misstates the product and a test pins the dead value.
- Wall-clock stamps inside `graph.js`/`wizardNews.js` helpers (and the canon path threads no `now`) —
  replay is not byte-identical despite propagation.js's own comment claiming it.
- `service_dependency` and `migration_pressure` channels are uncreatable (discovery never emits them) —
  `regional_service_disruption` is dead vocabulary end-to-end; five stressor spreadChannels silently
  match zero channels.
- **docs/world-pulse-roadmap.md is severely stale**: 10 of 11 `[next]` items (plus 4a) are implemented,
  wired, and tested green; only 4d (NPC/relationship chronicle UI) is genuinely missing. An owner
  reading it would re-commission ~ten finished work items.
- supplyChainState regionalPressures fallback token-matches condition prose to chain text (≥4-char
  substring) — drift hazard.

(Lows — ~25 items incl. dead `expiresAtTick` read, `maxAgeTicks:null` default vs spec's 12,
char-indexed goods corruption in `normalizeChannel`, 80-char channel-id truncation, inbox controls on
inactive campaigns, season/birth-timestamp erasure on stressor upsert, conservation remainder leak,
test-gap inventory — are itemized in the review transcripts; each carries file:line.)

## Proposed remediation — "Regional waves" (same groove: fix + pin per item, gate, adversarial verify)

- **R1 — Truth-critical (C1-C3, H17, H8, H9, H5, H6):** condition-id collision; tier-proposal
  current-state guard (mirror `applyInstitutionLifecycleOutcome`); single tick clock (or derived sync +
  chronicle grounded on worldState.tick); arc-throttle `slice(0,80)`; spread severity persisted as
  attenuated (or news told the truth); pulse ages impacts before queueing; pressure/population matching
  by archetype id, never prose. Small diffs, each independently shippable.
- **R2 — Rediscovery & lifecycle integrity (H1, H2, H7, mediums: dedupe-keep-strongest, ghost applied
  impacts, triggeredAt.tick):** merge semantics that preserve ALL DM-set fields and terminal-ish
  statuses; same-shock dedupe across channel types; expiry writeback when materialized conditions lapse.
- **R3 — The neighbour seam & relationships (H10-H16, alias drift, memory double-count):**
  `trade_partners`→canonical alias; pulse↔neighbourNetwork bidirectional sync (or one substrate);
  edge relationshipType refresh on rebuild; either wire REL_DYNAMICS or delete it honestly;
  symmetric-relationship direction fairness; vassal cascade becomes proposal + news.
- **R4 — Bounds, determinism, hygiene (H18 + mediums/lows):** cap/archive eventLog (or stop embedding
  projections nobody reads — five dead deriveRegionalState fields go with it); thread `now` through
  graph/news helpers; per-settlement rng forks for candidate rolls; calendar season fix; flows proposal
  gate made reachable; uncreatable channel types either get discovery rules or leave the enum; refresh
  world-pulse-roadmap.md statuses; add the missing invariant tests (every channel type creatable,
  clock-sync pin, same-tick delay pin, impact-visibility pin).

R1/R2 are pure sim-side and safe to start immediately after the in-flight chip work lands (no file
overlap except `tierResourceDynamics.js` — coordinate with the open chip). R3 touches DM-visible
relationship semantics — worth a short owner conversation on intended directionality. R4 closes the
loop and converts this audit's bug classes into permanent invariants, in the spirit of the cohesion
plan's Wave 8.
