# THE GAME-GRADE PROGRAM — architecture (G-waves)

> **Progress** (append after every wave — this blockquote alone must reconstruct program state)
> - Architecture adversarially verified 2026-07-22 (3 refuter lenses: feasibility / doctrine /
>   completeness): 2 reuse claims re-architected (G-2c spatial reads, G-2e coupling tiers), G-3
>   band-vocabulary layering fixed, stale flag premise corrected, orphan violations ruled. All
>   amendments folded below.
> - Program architected 2026-07-22 from docs/GAME_GRADE_AUDIT.md (6 surfaces × 7 points, 30 numbered
>   violations, 30 quick wins) on composite-r4 @ 69b7a8d3. No wave started.

## The doctrine this program serves

Owner-ratified 2026-07-22 (memory: game-grade-ux-doctrine): the six core surfaces — **generator,
settlement editor, map editor, the realm, custom content, the Herald** — reach the legibility / UX /
navigability grade of **The Sims, SimCity, Civilization, Mount & Blade, Total War: Warhammer**.

**THE TRANSLATION PRINCIPLE (load-bearing):** we have deterministic formulas; we are NOT showing them —
we are translating them for a wide audience. Decomposition-on-demand renders recorded causes as
plain-language sentences ("The harvest failed, so grain ran short"), never modifier arithmetic
("+2 food_pressure × 0.3"). Bands and sentences over raw numbers. Civ's always-answerable *why* is the
feature; Civ's formula-term tooltip is explicitly NOT the format.

**The seven machinery points** (the audit's rubric, the program's targets):
1. WHY_ON_DEMAND — any displayed state opens into its recorded causes, as sentences, hop by hop.
2. NAMED_STATES — every state is a named band with cause (and duration), never a bare integer or token.
3. QUERY_WEB — click anything anywhere → its story; everything cross-links (SimCity query tool,
   Bannerlord encyclopedia).
4. FORECAST_BEFORE_COMMIT — translated projected consequences before the user commits.
5. LENSES — one view answers many questions.
6. ORIENTATION — the product says what deserves attention next, at 20+ settlement scale.
7. VERBS_ON_ENTITIES — entities carry their legal actions in place; the world's motion surfaces
   ambiently (M&B's "Count X is besieging Y").

**Scope law:** game-grade **presentation** of the simulation we already record — never simulation
additions. Simplicity-over-fidelity and THE PROMISE govern. Every feature below reads existing recorded
state or existing deterministic helpers; none writes new engine behavior.

## Method

Gates per wave: focused pins (counted) → full lint/copy/voice families → `check-domain-strict` 0 →
tsc 0 → build + VERIFY_DIST with the first-paint closure QUOTED vs a fresh base measurement (Δ≤0 —
margin is ~194 bytes; every new module is a lazy leaf) → full suite tolerating exactly the 4 parked
golden families. One commit per wave (sub-lettered where a wave splits per-surface), plan-note commit
after each. Standing hazards that bind every wave: sizeBaseline tolerance-0 (JSX comments count;
WorldMap.jsx has 2 lines of headroom — never edit it, decompose), no new store actions (reuse; if
unavoidable → operationRegistry + label/description + gen:compendium-data regen), Z_LAYERS manifest for
any popover, E-I keyboard rules, no em-dash/exclamation in authored copy, deep-craft kill-list
(tintedCallouts: CARD_ALT + border idiom, never GOLD_BG washes), mutation-coverage manifest entry for
every new invariant/walker test, wizardNews is EAGER (ambient readers of it must not drag inspector
chunks eager — import from lazy leaves only).

## Owner decisions honored throughout (do not violate)

- THE PROMISE: no same-seed output shifts; everything here is display-layer.
- The per-order marginal forecast in RealmForecast is DELIBERATELY owner-gated (RealmForecast.jsx:33-41)
  — G-2 does not un-gate it; it stays on the owner queue.
- Herald routing/name vetoes remain open; this program builds on the shipped Herald as-is.

---

## G-0 — THE TRANSLATION PURGE (floor wave; all display-only)

**Thesis:** no raw engine vocabulary reaches a reader anywhere on the six surfaces. Closes the
translation violations (V-*) and ships the TRANSLATION-class quick wins. (Six Q-* rows are query-web /
orientation / verb enrichments, not translation — they ship in their home waves: Q-RLM5 → G-3,
Q-MAP2 → G-4, Q-MAP1 + Q-RLM2 + Q-CUS4 + Q-CUS5 → G-5.)

**Explicit rulings on the two deliberate-looking violations (recorded, owner-vetoable):**
- **V-GEN4 (raw seed as `<code>`): KEEP, framed.** The seed IS the product's reproducibility promise —
  a deliberate exception to the no-raw-tokens rule, kept with its "Current draft seed" framing intact.
- **V-GEN5 (PipelineReveal terminal-mono checklist): KEEP as deliberate craft.** The reveal is a
  once-per-forge moment, not a reader surface; its engine-theater is intentional showmanship. Veto
  flips it to the body font.

**Named fixes for the ratchet-blind runtime-value leaks** (regex cannot catch these; they are closed by
listed site, and the ratchet header documents them as accepted evasion gaps per structural-prevention):
V-RLM7 (QuickInspector + PlacementDetailCard `String(tier)` → size-word map), V-HER5 (RealmVerbComposer
dial `d.key` / `String(o)` fallbacks → labeled dials or humanized fallback), V-CUS4's EntityPicker half
(title-tooltip refIds → resolved names), V-RLM5 ('tier' → 'Size' vocabulary in DeltaLead).

**The recurring fix shapes** (each violation maps to one):
- **Token→label maps** at render sites: NPC bank facets (`win_public_legitimacy` → "Win public
  legitimacy"), STASIS_REASONS, EditKind summaries ("edit-npc" → "edited ⟨NPC name⟩"), foodImpact/deity
  axis keys through the existing keyLabel/label lists, PipelineRail result/source tokens, heraldFeed
  `human(kind)` fallbacks and heraldGrammar reason tokens through a friendly-label lookup seeded from
  WHAT_PHRASES (the walker-enforced ~91-key rumor-register phrase map — a SEED, not a drop-in: it lives
  on the rumor surface, heraldFeed does not import it today, and it misses real kinds incl.
  `cold_war_supply_sanctions`, `convoy_ordered`, `settlement_terminal_death`. The wave authors
  headline-register phrases for the uncovered kinds and stands up a NEW walker over the heraldFeed
  keyspace; the existing walker guards only rumors).
- **Tick → calendar** everywhere a tick leaks: WarFaithMapOverlay, CauseWalkPanel, ChronicleScrollback —
  all through the existing `tickCalendarLabel()`.
- **Number → band**: priority sliders 0-95 → Minimal / Low / Balanced / High / Dominant (value stays the
  raw token; display bands); depletion "~35% chance" → likelihood words (often / sometimes / rarely
  depleted); SubstrateTab drops the bare 0-100 score (band carries the signal); LayersPanel "40%" gets a
  threshold caption.
- **Engine-voice copy rewrites**: "pure-functional steps" → plain; "Causal substrate / System variables"
  → reader language ("What's holding, what's strained"); "Edit (bank):" heading drops the internal word;
  the map drop-preview stops asserting an uncomputed consequence as fact (honesty leak V-MAP4).
- **Unlock what's built**: WizardCloseout renders in Basic too; size-hint for signed-in users; severity
  band words displayed on Herald headlines (`severityBand()` exists at heraldFilter.js:20, undisplayed);
  Adjudication tab badge (drop the `narrowing &&` guard for it); cause-trace toggle extended to
  HeraldForecast + Adjudication OutcomeCards (CauseWalkPanel is already in-chunk).
- **Stale-premise correction (verify pass):** `flag('compendiumInlineHelp')` already ships ON
  (flagRegistry.js:51, "Promoted on") — the audit's "shipped OFF" and QUERY_WEB=ABSENT rationale are
  partially stale; HelpPopover is live. Nothing to flip. G-0 instead updates the stale
  ConfigurationPanel comment and the audit doc note; the REAL remaining generator query-web gap is
  links from archetype / resource / deity choices (G-5).

**Prevention (lands WITH this wave — shrink-only, so it may precede later honesty):** the
**translation ratchet** — `tests/lint/translationLeak.ratchet.test.js`, a node-matchAll source scan over
`src/components/**` for the leak shapes we just cured: (a) `tick {`/`Tick ${` render interpolations,
(b) snake_case string literals inside JSX text/option positions, (c) `human(` calls in render files
outside an allowlisted translator module. Frozen exact inventory of surviving offenders (target: near-0
after this wave), shrink-only, honesty companion, kind failure message naming the translator to use.
Manifest entry + mutation plant per E-A.

**Exit:** all V-* rows closed, KEEP-ruled, or deferred with rationale; ratchet green at its frozen
floor with its evasion gaps documented in-header; every TRANSLATION-class Q-* shipped (the six
later-wave Q-* rows are tracked in their home waves' exits).

## G-1 — THE EDITOR DEAD-END (the confirmed bug)

**Finding (CONFIRMED):** NpcLifecycleControls' verbs (bank edits, stasis, ransom, rescue, recall) queue
edits via `queueEdit` on a surface where PendingChangesBar never mounts — actions shown where they
cannot be completed.

**Architecture:** verbs are actions, not edit-mode furniture (doctrine point 7). (a) NpcLifecycleControls
renders wherever the NPC card renders, state-gated (isHostage/isTraveling) rather than mode-gated;
(b) PendingChangesBar mounts on every surface that can queue — the bar, not the mode, is the commit
affordance; (c) every queued lifecycle kind flows through the existing pendingEdits dispatcher
(COMMITTABLE_EDIT_KINDS trace: queue → preview → commit → undo → version snapshot → persist → reopen);
(d) previewCascade gains arms for the NPC-lifecycle kinds so the cascade panel counts them (feeds G-2).
Lifecycle trace is the wave's verification spine: prove commit AND undo AND reopen-after-save for each
verb, pinned.

**Exit:** from a saved settlement's NPC card: queue ransom → see it in the bar with a translated summary
→ preview counts it → commit → undo → reopen; all pinned. No new store actions.

## G-2 — FORECAST EVERYWHERE (the weakest column)

**Thesis:** before any commit, a translated projection — computed by existing deterministic machinery,
rendered as sentences. Two proven patterns to extend: **DeityEffectPreview** (live engine-sourced
sentence preview) and **CascadePreviewPanel** (translated delta preview). Sub-waves per surface:

- **G-2a Generator — the result recap.** The audit's finding: recaps echo inputs, never results, and only
  in Advanced. Ship: WizardCloseout in all modes (done in G-0); post-forge **"What you got" strip** —
  the pipeline receipt promoted from the buried drawer to an ambient one-line-per-beat summary above
  the dossier, composed by a NEW TYPED COMPOSER (`recapOf(settlement)` — fixed templates over
  stepMetadata summaries + existing band reads; slots: name, institution count, market band, faction
  count, prosperity band. NO causal clause is invented — a cause clause renders only where a recorded
  trace exists, else the sentence ends at the band. Verify pass: stepMetadata carries no causal clause;
  pressureSentence is a single stored field — neither may be freeformed into causes). **Regenerate
  delta** — full `generate()` writes lastRegenerationDelta (verified feasible: `state.settlement` is in
  scope pre-overwrite at settlementSlice.js:962; the field is transient store-only, never persisted —
  PROMISE-clean). Caveat honored: a full reroll changes every id, so the id-diff reads as noise — the
  full-reroll recap uses SUMMARY-level deltas (counts + banded shifts: "prosperity Modest →
  Comfortable, 2 more institutions"), not the entity-level diff regenSection was tuned for.
- **G-2b Settlement editor — preview totality.** previewCascade covers every COMMITTABLE_EDIT_KINDS
  member (G-1 built the NPC arms; this wave completes table/prose kinds where meaningful and adds the
  **preview manifest walker**: every committable kind has a preview arm or a rationale row — the walker
  lands HERE, once true, per structural-prevention's fix-first law).
- **G-2c Map editor — placement forecast (RE-ARCHITECTED after the verify pass refuted the original
  mechanism).** What the verify pass proved: there is NO per-cell terrain accessor at cursor time (the
  bridge exposes only the heavyweight one-shot `getSpatialPack`; the placement echo carries no biome and
  fires post-drop; WorldMapStage.jsx:344-347 concedes live cursor cell data is unbuilt), and
  `deriveRegionalGraph` reads a settlement's RECORDED neighbours — useless for an un-placed drop target.
  The honest architecture, in two tiers:
  (1) **At cursor/commit — proximity only:** "Nearest neighbors: Ashford (near), Bram (a day's ride).
  Likely ties: the channels those neighbors already carry." Computed by NEW display-layer spatial math
  (distance over existing placements' recorded x/y — cheap, deterministic, display-only) + the
  neighbors' recorded channel types. No terrain claim is made at cursor time.
  (2) **Post-drop — terrain joins:** once the placement echo lands with a cellId, the card MAY add the
  terrain read via the existing pure `biomeAt` (spatialDigest.js:243) where a spatial digest exists.
  Terrain-at-cursor is DEFERRED to the owner queue: it requires a new endpoint into the vendored FMG
  fork (public/map — outside all code gates; touching it is its own decision).
  Replaces the dishonest hardcoded drop-preview copy (V-MAP4) either way. Terrain edits/reroll get a
  scope sentence ("Re-rolls the heightmap under 2 placements — their sites re-derive").
- **G-2d Realm — the advance preview.** **Weather, not prophecy (ARCHITECTURE RULING, vetoable):** the
  pre-advance surface shows the DIVINATION view — pressures, queued orders, pending decisions that will
  auto-resolve, interval scope — never the computed outcome (which would collapse the reveal the
  chronicle exists for). Mechanically: the Advance confirm gains a compact RealmDocket/pressure digest
  ("Advancing one month across 12 settlements. Pressure builds toward famine in the east. 2 staged
  orders will execute; 3 decisions will auto-resolve.") — the DOCKET-CLASS reads surfaced at the
  control instead of three doors deep. **Chunk guard (verified, explicit):** the digest is its own lazy
  leaf mounted from the confirm (never a static import into WorldMap.jsx); it reads only light store
  state (worldState.proposals / stressors, docketLapse.lapseOf) and NEVER invokes forecastRun (which
  stays behind RealmForecast's dynamic import). Regenerate/Clear Map get computed loss inventories
  (already partially built for Regenerate — extend to Clear Map).
- **G-2e Custom content — the effect preview, HONESTY-TIERED (re-scoped after the verify pass proved
  the coupling tables exist only for deities).** Three tiers, each rendering only what the engine
  actually reads — the preview NEVER claims an effect the engine ignores:
  (1) **Deity-grade (deities only):** the existing DeityEffectPreview — unchanged, the benchmark.
  (2) **Describer-grade (institutions, resources, stressors):** NEW display describers built over the
  ACTUAL scattered read sites, pinned display==engine the way deityEffects.js is (its determinism-test
  pattern is the template): institutions → what `criticality`/`foodImpact` do (economyReconcilePass.js:144,
  foodBalance.js:100) + the tag→capacity heuristic; resources → tier-keyed depletion behavior +
  satisfiesCategories trade; stressors → the generic onset path (crisisLifecycle.js:225: custom
  stressors carry no promotion rule — the preview SAYS so). This is named as real domain work
  (new describer modules + pins), not "rendering only."
  (3) **Truth-grade (traditions + inert attributes):** the preview states the recorded truth —
  "Traditions appear in your settlement's dossier; they don't yet steer the living world" (the
  tick-time seam is a deliberately deferred coordination seam, customFounding.js:10-13) and
  "economicWeight/authority/defenseRole shape the entry, not the simulation" (inert at generation,
  verified). Honest emptiness over fabricated effect — the translation principle applied to absence.
  All three tiers + "Where it can appear" (the conditions generation actually checks). No freeform.

**Exit:** every commit-verb on the six surfaces either shows a translated projection or carries a
manifest rationale row; the preview-manifest walker is green; the owner-gated per-order marginal
forecast remains gated (queue row).

## G-3 — ORIENTATION AT SCALE (the triage layer)

**Thesis:** one computed truth for "what needs you," aggregated everywhere.

- **The selector (single-writer, LAYERING FIXED after the verify pass):** `src/domain/display/
  needsAttention.js` (lazy leaf) — `needsAttentionOf(campaign, savedSettlements)` (signature widened:
  proposals + docket lapse live on the campaign) → ranked SETTLEMENT rows `{ref, band, sentence}`.
  **The band vocabulary is DEFINED HERE** — `SETTLEMENT_ATTENTION_BANDS = Critical / Strained / Routine`
  — as the domain-level truth; heraldFilter.js (which today defines those words at component level,
  :20-25) imports them from this module, never the reverse (domain→component inversion refuted). The
  domain's other `severityBand` (activeConditions.js:534, different words) is a different concept —
  named apart, documented in both headers. **The three PRE-EXISTING needs-attention owners are this
  wave's refactor targets, not violations to scan around:** heraldFilter.needsAttention(),
  LibraryToolbar's idiom, and livingWorldSignals.js are rebased to consume the shared selector (or its
  bands) in this wave; THEN the Pattern-3 single-writer scan lands, forbidding new derivations.
  **Exit rescoped:** map badges, palette sort, folder rows, and the Dashboard banner agree byte-for-byte
  on the SETTLEMENT ranking (the Herald strip's per-item news ordering is a different object type and
  keeps its own sort law — the settlement clustering within it uses these bands).
  Sentence shape, from a NEW typed composer with fixed templates (no freeform): "⟨Settlement⟩ —
  ⟨Band⟩: ⟨top recorded cause slot⟩." — the cause slot fills ONLY from a recorded stressor/proposal
  label; absent a record, the sentence ends at the band.
- **Custom-content workspace roll-up (audit ORIENTATION gap, adopted):** the same wave ships the
  cross-bucket attention line in the workspace header ("2 deities authored but never assigned · 1 item
  has a broken reference") — a savedSettlements/customContent scan of the Q-CUS5 shape, re-derived in a
  lazy leaf (not imported from PantheonActivationStrip, which is a component).
- **Surfaces:** map markers get a needs-attention badge layer (new lazy overlay component — never a
  WorldMap.jsx edit); SettlementPalette gains severity sort (Q-RLM5); Herald tab strip shows resting
  counts + the Adjudication badge (G-0 started it; this wave completes all doors); campaign folder rows
  reuse the same rows; the Dashboard banner re-reads the shared selector (one truth).
- **Durations join bands** (the audit's named-state gap): threat/stress pills gain "for ⟨span⟩" from
  recorded onset ticks through tickCalendarLabel — display-only.

**Exit:** at 20+ settlements, triage is answerable from the map alone, the palette alone, or the Herald
strip alone, and all three agree byte-for-byte on the ranking (pinned against the shared selector).

## G-4 — VERBS ON ENTITIES + AMBIENT MOTION (the M&B wave)

- **The verb registry (typed, frozen, walker-covered; CONTRACT AMENDED after the verify pass):**
  `src/domain/display/entityVerbs.js` — per entity type (settlement, npc, faction, deity, headline,
  proposal, custom item) a frozen list of `{id, label, gate, dispatch}` where dispatch is one of THREE
  legal shapes: an EXISTING store action (walker-pinned against operationRegistry), a NAVIGATION target
  (walker-pinned against a frozen nav-target list in the same module), or an EXISTING inspector
  callback chain (openInspectorAt/onSection — section state is local React state by design, not store
  state, verified; the walker pins these against a frozen callback-name list). No verb invents an
  action; the walker covers all three shapes.
- **Granularity honesty (verified limits):** no proposal-focus primitive exists — the Adjudication verb
  reads "Open Adjudication — focused on ⟨settlement⟩" (matchesFocus already scopes the desk by
  selectedSettlementId); per-proposal focus is queued as a follow-up, not overstated now. The
  "advance-this-settlement" verb is DROPPED — every advance action is campaign-scoped
  (operationRegistry.js:77,93), a per-settlement advance would be a simulation addition the scope law
  forbids; the map card instead carries the honest "Advance the realm" (campaign advance) where the
  settlement is in a campaign.
- **Render sites:** Herald headlines gain act-here verbs ("Open Adjudication — focused here", "Focus
  the map here", "Open dossier") — the reader stops reconstructing orders across doors;
  PlacementDetailCard reaches parity with QuickInspector + verbs (open dossier, focus Herald);
  DistrictCard/InstitutionCard get "Open in dossier" + faction links (Q-MAP2); custom-content cards get
  "See where it's used" (feeds G-5's usage index).
- **Ambient motion — the ticker:** a one-line strip cycling the urgent pin's 1-3 headlines,
  byte-verbatim from heraldFeed, EntityLinked, click → the Herald article. Sentence shape is the
  recorded headline itself — no new composition. Implementation: its own lazy leaf reading the store,
  **mounted in WorldMapToolbar or WorldMapStage — NEVER WorldMap.jsx** (598/600 effective lines; any
  edit there busts the tolerance-0 ceiling); never importing inspector chunks (wizardNews-eager hazard).
  Post-advance, the same strip carries the interval headline.

**Exit:** the audit's V7 column re-scores PRESENT+ on all six surfaces; a siege can be read AND acted on
without leaving the door where it was read.

## G-5 — THE QUERY WEB CLOSES (SimCity query tool everywhere)

- **Click-anything parity:** PlacementDetailCard carries the pressure sentence + address links +
  "recent stories" (heraldFeed filtered to the settlement — the map becomes a Herald lens);
  dossier stat lines (population, Substrate bands, threat pills) gain the cause-walk affordance where a
  recorded trace exists (degrade honestly where not — no fabrication, walker-enforced).
- **Custom content ↔ world round-trip:** a derived usage index (a savedSettlements scan of the
  computePantheonActivation SHAPE, re-derived in a domain lazy leaf — that function lives in a
  component and must not be imported across surfaces): authored cards read "Appears in 3 saved towns"
  (linked);
  gold-star items in dossiers deep-link back to the authored entry; the Dependencies web becomes
  navigable buttons (Q-CUS4).
- **Concept links:** generator choices and Herald items link to Compendium band-ladder entries.
  ⚠️ OWNER-GATED SLICE: the global compendium deep-link scheme is a parked owner decision — this wave
  ships surface-local links only (component → known entry id); the universal scheme waits for the ruling.
- **Depth honesty:** the Herald's 4-level address chain stays degraded to settlement-level for
  wizardNews subjects until the T4 record-shape wiring (subject ids) — queued, not faked.

**Exit:** from any entity mention on any surface, its story is ≤1 click; from any authored item, its
worlds are ≤1 click; no dead-text entity names remain on the six surfaces (pinned by a link census).

## G-6 — PREVENTION + THE RE-SCORE (close-out)

- Standing machinery census (maintain, don't bypass): translation ratchet (G-0), preview manifest
  (G-2b), needsAttention single-writer scan (G-3), verb-registry walker (G-4), link census (G-5) — all
  registered in the mutation-coverage manifest with plants or rationales.
- **The re-audit:** re-run the six-scorer workflow against the finished tree; record the closing
  scoreboard in the audit doc. Target: no ABSENT anywhere; FORECAST/ORIENTATION/VERBS columns ≥ PRESENT
  on all six surfaces; translation violations 0.
- Final plan note + completion memory.

## Sequencing rationale

G-0 first: it is the floor every later sentence renders through, it is all display-only, and its ratchet
is shrink-only (legal to land before later honesty). G-1 second: a confirmed reachability bug, and its
preview arms are G-2b's prerequisite. G-2 before G-3: forecasts are data the badges may reference, and
FORECAST is the weakest column (highest leverage). G-4 after G-3: verbs want the triage rows and badges
as render sites. G-5 spans all surfaces and rides everything prior; its correctness-asserting link
census lands only once the links exist. G-6 last per structural-prevention: correctness-asserting
walkers only over honest data. Waves are independently shippable; each ends at a full gate.

## Owner-decision queue (parked, deliberate)

- Compendium deep-link scheme (pre-existing parked ruling) — gates G-5's universal slice.
- Per-order marginal forecast (pre-existing, RealmForecast.jsx:33-41) — stays gated.
- Terrain-at-cursor for the placement forecast — requires a NEW endpoint into the vendored FMG fork
  (public/map, outside all code gates); G-2c ships without it (proximity tier only).
- The advance-preview "weather, not prophecy" ruling (G-2d) — my recommendation stands; veto = show
  computed outcomes instead (one component swap).
- V-GEN5 KEEP ruling (PipelineReveal terminal-mono theater) — veto flips it to the body font.
- Herald masthead + routing vetoes — unchanged, open.

## Deferred (documented, NOT bugs to re-find)

- Realm-wide per-variable choropleth lens ("show me the whole realm's food security") — real gap
  (audit RLM LENSES), deliberately deferred: needs a design pass on which variables earn a lens; queue
  behind G-3 learnings.
- Generator config lenses (audit GEN LENSES ABSENT) — the config is a form; lensing it is redesign, not
  translation. Revisit after G-2a lands.
- Editor "show only edited / diff vs generated" lens — worthy, small, not load-bearing; tail candidate.
- Custom-content by-state lens (dangling refs / never-assigned filter, audit CUS LENSES) — joins the
  lens design pass above; the G-3 workspace roll-up covers the attention half now.
- Herald facet depth beyond severity (section/kind/provenance facets, lens persistence — audit HER
  LENSES) — pre-existing Herald follow-up, deferred here formally.
- LayersPanel/RoutesToolbar duplicate relationship-toggle owners (audit MAP LENSES redundancy) — a
  single-owner refactor candidate; small, queue with G-3's single-writer pass or the tail.
- Generator config needs-attention markers + editor per-field attention markers (audit GEN/SED
  ORIENTATION) — different scale class than G-3's 20+-settlement triage; revisit after G-3 lands.
- Per-proposal focus in Adjudication (no primitive exists today) — follow-up after G-4's
  settlement-scoped verbs.
- wizardNews subject-id record shape — T4 ONE REGEN batch (pre-existing).

**Blocked by scope law / recording gaps (considered, not silently dropped):** per-step pipeline causes
(only assembleInstitutions emits traces — a RECORDING gap; G-2a surfaces summaries, cannot add causes);
custom-institution cause-traces (assembleInstitutions emits no recordTrace for them — same class);
authored content in the Herald / factions reaching generation (a generation-reach gap). All three need
engine-side recording changes — T4-class decisions, not display waves.
