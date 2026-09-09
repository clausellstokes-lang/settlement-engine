# THE GAME-GRADE AUDIT — evidence ledger

> **Audit state, 2026-07-24**
> - The original six-surface audit was performed 2026-07-22 against `composite-r4 @ 69b7a8d3`.
> - The live code-of-record worktree is now `claude/composite-r4 @ 8033ddbe` with substantial uncommitted
>   work from concurrent efforts. A line visible in the working tree is current evidence, but it is not
>   called shipped until committed and gated.
> - The Settlement Editor and the Herald were re-read at code level on 2026-07-24 because the new
>   goal-first program starts there. Their replacement assessments appear below, followed by the
>   implementation checkpoint now present in the live tree.
> - Generator, Map Editor, Realm, and Custom Content retain their detailed
>   2026-07-22 scores. Their concrete translation findings were reverified and the
>   confirmed leaks were repaired on 2026-07-24; their broader surface scores were
>   not silently upgraded.
> - Ratings are applicability-based, not quotas. `N/A` or an intentional defer is valid when a machinery
>   point does not improve the surface's real task.
> - The four previously parked golden families were deliberately adjudicated,
>   owner-approved, regenerated, and reverified. The generated Compendium
>   operation artifact was also refreshed from the final live registry.
> - Repository-wide test, build, distribution, and performance evidence belongs
>   to the executable gate and `docs/CURRENT_STATE.md`; this historical ledger no
>   longer republishes a transient dirty-tree count as current truth.
> - The implementation program is `docs/GAME_GRADE_PROGRAM.md`.
> - Default promotion was re-audited against the live implementations. The machine-readable result is
>   `docs/GAME_GRADE_PROMOTION_CONTRACT.json`: `settlementWorkbench` and `heraldCommandBrief` remain
>   proof-only and default-off; `realmItemShadowDiagnostics` remains default-off by design because it is
>   internal accounting rather than a user product surface.

## Historical six-surface scoreboard — 2026-07-22, not current truth

| | Why | Named | Query | Forecast | Lenses | Orient | Verbs |
|---|---|---|---|---|---|---|---|
| The Herald | PRESENT | partial | PRESENT | PRESENT | PRESENT | partial | partial |
| The realm | PRESENT | PRESENT | PRESENT | partial | PRESENT | partial | partial |
| Map editor | PRESENT | PRESENT | partial | partial | GAME-GRADE | partial | partial |
| Generator | partial | partial | absent | partial | absent | partial | PRESENT |
| Settlement editor | partial | partial | partial | partial | absent | partial | PRESENT |
| Custom content | partial | PRESENT | partial | partial | partial | partial | partial |

What was solid in that snapshot: the map lens/layer system (game-grade); the cause-walk +
address web on reading surfaces; the RealmForecast clone-run projection (benchmark-shaped); the deity
effect preview and the editor cascade preview (the two proven forecast patterns); band-word discipline on
read displays; the draft action toolbar. The three weak columns are FORECAST (weakest), ORIENTATION at
scale, and VERBS in place. 30 translation violations catalogued below — all display-only.

## Current proof-slice scoreboard — 2026-07-24 live working tree

| | Why | Named | Query | Review / forecast | Task views | Orient | Verbs |
|---|---|---|---|---|---|---|---|
| Settlement Workbench proof | PRESENT for recorded evidence; honest unavailable state | partial | PRESENT for indexed NPC proof | PRESENT for supported staged edits | PRESENT: Inspector + Change Dock | partial | PRESENT for NPC proof |
| Herald command-brief proof | PRESENT where a source carries a cause; honest degraded routes | partial | PRESENT for canonical proof items | partial; pilot proposal action only | PRESENT: Briefing / Stories / Plans / Decisions | PRESENT for ranked proof items | partial; proposal decision only |

`Review / forecast` is the applicability-aware reading of `FORECAST_BEFORE_COMMIT`; `Task views` is the
same rubric slot as `LENSES`. `PRESENT` here means the named proof slice satisfies the behavior; it does
not claim G-2b or G-4b parity across every entity, source, action, role, or history size.

The editor's unsafe queue contract is now replaced for the supported local proof by a typed,
owner-scoped transaction spine. A rendered NPC edit completed the full
stage → preview → apply → receipt → undo path; switching to mobile made authoring read-only without
hiding the dossier. The remaining editor problem is breadth and durability: other entity families,
offline/cloud ownership, persisted receipts, cross-save behavior, reopen evidence, and cutover are not
complete.

The Herald now has one canonical derived item model and a routeable, attention-aware four-task shell for
the proof sources. The legacy seven sections remain unchanged when the flag is off, and an unauthenticated
mobile user still receives the established locked Realm path rather than a false decision surface. The
remaining Herald problem is breadth and operational proof: the pilot proposal decision is not the whole
action matrix, receipts are session-local, and complete post-advance, share-redaction, device,
browser-timing, and lived-triage evidence remains G-4b work.

### Implementation evidence

- **Transaction spine:** validated intent kinds and payloads; stable owner/save scope; explicit
  preconditions, policies, and receipts; successful-only queue removal; typed retained failures; stale,
  pulse, remote-write, save-switch, pause, and advance fences; pre-apply snapshot undo.
- **Preview honesty:** cascade summaries distinguish available, partial, unavailable, changed, balanced,
  unassessed, and no-change states. Missing computation is not presented as “no structural effect.”
- **Settlement Workbench:** lazy default-off mount; existing dossier entity index; contextual Story and
  state / Why / Connections / Actions; save-scoped Change Dock; desktop authoring and mobile/read-only
  capability gates; no permanent empty shell.
- **Canonical `RealmItem`:** eight source classes; source-specific payload preservation; independent
  dimensions; deterministic ranking and read state; immutable snapshots; collision/exclusion/error
  diagnostics; no second canonical store.
- **Herald proof:** Briefing/Stories/Plans/Decisions; time lens; exact item focus; campaign-scoped,
  bounded route restoration; cause and entity routes; mobile companion; proposal action revalidation and
  terminal-writer receipt; one canonical six-class attention vocabulary; a deterministic, non-cycling
  lead; operation-census linkage for command actions; paused-advance routing to Decisions; one front-page
  catch-up projection owner; deterministic recorded chronology for terminal proposals; one executable
  specialist-source parity inventory; named peaceful and 24-settlement/640-record fixtures; 40-card
  archive reveal batches; player/share shell fail-closed proof; canonical full-input forecast
  invalidation; named refusal rows; and bounded, omission-explicit forecast copy.
- **Translation floor:** shared priority bands, trace presentation, calendar
  labels, settlement sizes, Herald severity/reasons, and conservative legacy
  fallbacks replace confirmed raw engine tokens without changing the stored or
  staged values.
- **Focused verification:** component, read-model, fixture, compatibility,
  accessibility, semantic-translation, and golden-adjacent suites pass together
  with full/strict/UI-boundary types, scoped lint, registry freshness, and diff
  hygiene. Repository-wide release evidence remains the job of `npm run check`.

---

> **Historical sections:** Generator, Map Editor, Realm, and Custom Content below retain their
> 2026-07-22 evidence and line references. Reverify before closing or implementing those findings.

## THE GENERATOR — historical baseline, not reverified
OVERALL: The Generator has best-in-class INPUT legibility (named size/threat/resource bands with sentences, a translated pipeline receipt) but never shows a projected RESULT before forging and leaks one raw engine axis (priority 0-95), leaving it one clear tier below the Sims/Civ bar on forecast and cross-linking.
### Scores
- WHY_ON_DEMAND: PARTIAL — Post-gen 'How this was simulated' drawer (SimulationDrawer.jsx:46-185) mounts PipelineRail.jsx which narrates each of ~17 steps with a factual one-line summary (stepMetadata.js:23-177, e.g. '5 institutions placed', 'Prosperity: <band>', '3 factions formed') + an expandable plain-language description; StepRow (PipelineRail.jsx:117-167) renders structured cause→effect→reason traces (source/effect/reason bullets + downstream). Genuine recorded-cause depth exists but is 2 hops ONLY for assembleInstitutions — PipelineRail.jsx:113-114 states 'today only assembleInstitutions emits these; the rest will adopt incrementally', so the other 16 steps give a summary, not causes. It is also gated behind a trigger button (WizardOutputToolbar.jsx:84-86), not ambient, and there is NO per-field 'why is population 1,240 / prosperity Modest' from any displayed dossier number on this surface.
  GAP: Only 1 of 17 pipeline steps emits click-through causes; the rail is process-narration, not per-state 'click any number → its cause', and it is buried behind a secondary toolbar button.
- NAMED_STATES: PARTIAL — Most config inputs render as named bands WITH a sentence: size tiers carry population ranges + evocative hints (en.js:127-134 'A real economy. Guilds. A jail.'), Regional Threat is Safe Heartland/Active Frontier/Embattled with a one-liner (ConfigurationPanel.jsx:373-380), nearby resources cycle named states Allow/Abundant/Depleted with tooltips (ConfigurationPanel.jsx:182-198), stress renders typed labels+icons. BUT the five priority sliders render a BARE INTEGER on the raw 0-95 engine axis with no band word (PrioritySliders.jsx:72-74, aria-valuetext 'priority 50 of 95' at line 65) — the densest control on the Advanced panel exposes the modifier value directly.
  GAP: Priority sliders show raw 0-95 integers instead of named bands (Minimal/Balanced/Dominant); the closeout's 65 'emphasis' threshold (WizardCloseout.jsx:43) is an invisible engine cutoff.
- QUERY_WEB: ABSENT — The create surface has essentially no cross-linking. The only entity→story affordance is HelpPopover on some Foundations labels (ConfigurationPanel.jsx:40, topics tier/trade-route/terrain/culture/settlement-age/monster-threat/magic-level) but it self-gates on flag('compendiumInlineHelp') and renders null when off (ConfigurationPanel.jsx:38-40), i.e. shipped OFF. Archetype chips (CharacterPresetCard.jsx), FoundingWorlds sample cards (FoundingWorlds.jsx:81-99), PlaceInRegionCard campaign/deity selects (PlaceInRegionCard.jsx:86-114) carry no links into the Compendium band-ladders that already document these concepts.
  GAP: No ambient cross-links from any create choice (culture, threat, archetype, resource, deity) to the Compendium; the one help affordance is flag-gated off.
- FORECAST_BEFORE_COMMIT: PARTIAL — Advanced mode gets WizardCloseout 'Ready to generate' recap that TRANSLATES the input delta ('Economy-led, 3 forced · 2 excluded', WizardCloseout.jsx:197-241) and cross-field consequences are surfaced as sentences (magic-off at town+ → 'Isolated is set to Road' ConfigurationPanel.jsx:402-406; isolated town+ → forced Teleportation Circle clerk-note ConfigurationPanel.jsx:314-319). PlaceInRegionCard shows the placement outcome ('On save, this settlement will be offered to X with Y as its patron', PlaceInRegionCard.jsx:121-127). Size gauge hints translate size meaning. BUT the recap echoes INPUTS, never a projected RESULT (no 'expect ~N institutions, a market, a militia; prosperity likely Modest'); WizardCloseout renders ONLY in Advanced (GenerateWizard.jsx:430) so Basic and the anon/instant HomeHero path — the primary funnel — get zero recap; and the generator's own 'Regenerate draft' (WizardOutputToolbar.jsx:89-97 → handleGenerate → generate()) produces NO delta, since lastRegenerationDelta is written only by regenSection (settlementSlice.js:1157-1163), not by full generateSettlement.
  GAP: No forecast of the actual settlement's contents before forging; no recap at all on Basic/anon (the main paths); Regenerate-draft shows no what-changed delta.
- LENSES: ABSENT — The config surface is a single fixed form (LayeredConfigurationPanel.jsx:176-251). The only view switch is Basic⇄Advanced (ChangeModeBar / ModeSelector.jsx:23-26), which is progressive disclosure of MORE controls, not switchable lenses answering different questions over the same data. No filter/lens toggle exists on the create surface.
  GAP: No lens system; mode toggle adds controls rather than re-framing the same configuration.
- ORIENTATION: PARTIAL — Pre-gen hierarchy is clean: one gold Generate CTA as the single focal point (GenerateWizard.jsx:447-454), deep-section collapsedHints name what each shapes ('Force or forbid', LayeredConfigurationPanel.jsx:46-48), onboarding highlights step 0/1 via data-onboard-highlight (GenerateWizard.jsx:416,451). Post-gen PostGenCoach gives an ordered, state-aware 'what's next' (save→export→refine→place, one idea per panel — PostGenCoach.jsx:50-217, nextSteps.js:58-96) which is real next-action orientation. BUT there is no needs-attention / badge system flagging what a config still needs, and nothing scales to many entities (single-settlement creation, so the 20+ navigability test is N/A here).
  GAP: No 'this still needs attention' signal on the config; orientation is a linear reading order plus a post-gen coach, not a prioritized attention map.
- VERBS_ON_ENTITIES: PRESENT — The just-forged draft carries its full legal action set in place: the sticky WizardOutputToolbar mounts Back / Regenerate draft / New Draft / How-this-was-simulated (WizardOutputToolbar.jsx:79-153) and the action row carries Save to Library / Buy this Dossier / Export PDF (GenerateWizard.jsx:540-553). FoundingWorlds cards carry 'Fork this sample' in place (FoundingWorlds.jsx:94-96); archetype chips apply in one tap (CharacterPresetCard.jsx:196-206); PlaceInRegionCard carries Upgrade for the gated act (PlaceInRegionCard.jsx:65-66). Not GAME_GRADE: the entities INSIDE the config (resources, forced institutions) carry only toggle-cycle, no richer contextual verbs, and ambient world-motion (M&B 'Count X besieging Y') does not apply to a pre-motion creation surface.
  GAP: Draft-level verbs are strong; config-internal entities have only toggles, and there is no ambient world-state to surface (expected on a creation surface).
### Historical translation violations — reverified and repaired in the current tree
- **V-GEN1** src/components/generate/PrioritySliders.jsx:65,72-74 — Priority value shown as a bare integer on the raw 0-95 engine axis ('{val}' at 72-74; aria-valuetext 'priority 50 of 95' at 65) with no translated band word — the internal modifier scale surfaced directly to the user.
- **V-GEN2** src/components/ConfigurationPanel.jsx:184-190,214,219-221 (and 55) — Resource depletion PROBABILITY surfaced as raw arithmetic: '~{tierPct}% chance of depleted at generation' and the legend chip 'Allow (~35% depleted)', driven by the DEPLETION_PROB map (line 73); stress panel similarly shows '~40% chance' (line 55). Exposes the formula's probability rather than a plain-language likelihood band.
- **V-GEN3** src/components/dossier/SimulationDrawer.jsx:143 (and PipelineRail.jsx subtitle via en.js pipeline.subtitle) — Engineering jargon to a wide audience: 'Seventeen pure-functional steps, deterministic per seed.' 'pure-functional' is implementation vocabulary; 'deterministic per seed' is only half-translated.
- **V-GEN4** src/components/generate/LayeredConfigurationPanel.jsx:118-138 (SeedField) — Raw numeric seed rendered as <code> ('Current draft seed', data-testid current-seed). Intentional reproducibility feature (THE PROMISE), but a bare engine seed integer is shown; mild — acceptable if framed, but it is a raw token surfaced.
- **V-GEN5** src/components/generate/PipelineReveal.jsx:51,208-224 — The loading step list is rendered in a monospace terminal font (mono, line 51) as a code-style '✓ / ▸' checklist — labels themselves are translated ('casting NPCs…') but the presentation deliberately evokes an engine/console running, mildly against the 'never show the machinery' principle.
### Quick wins
- **Q-GEN1** Map the priority slider integer to a band word (0-95 → Minimal/Low/Balanced/High/Dominant) shown beside or instead of the number in PrioritySliders.jsx:72-74 — data already present, display-only.
- **Q-GEN2** Ship/flip flag('compendiumInlineHelp') so the existing HelpPopover deep-links the Foundations labels into the Compendium (ConfigurationPanel.jsx:38-40) — wiring already built.
- **Q-GEN3** Render WizardCloseout in Basic mode too, not just Advanced (GenerateWizard.jsx:430) — the recap component is pure and already handles the 'Fully procedural' case.
- **Q-GEN4** Remove the isAnon gate on the size-hint line in HomeHero.jsx:356 so signed-in users picking thorp/city/metropolis also get the translated meaning (sizeHint keys for all six tiers already exist, en.js:127-134).
- **Q-GEN5** Reword SimulationDrawer subtitle (SimulationDrawer.jsx:143) to drop 'pure-functional' — e.g. 'Seventeen steps that run the same way every time for a given seed.'
- **Q-GEN6** Convert the resource depletion '~35% chance' probability (ConfigurationPanel.jsx:184-221) to a plain likelihood band ('often depleted' / 'sometimes depleted') to stop leaking the DEPLETION_PROB arithmetic.

## THE SETTLEMENT EDITOR — current rebaseline, 2026-07-24

**OVERALL:** The old audit's queue-safety and visible-completion defects are stale in the live tree.
The supported pending-edit proof now admits complete kind-specific payloads, resolves NPCs to durable
IDs, captures owner/save/revision/source identity, commits or discards exact intent IDs, retains
failures, emits receipts, and provides snapshot undo. Table Ledger actions are scoped to the table
intents they display. Mobile mutation controls fail closed before enqueue. A committed edit is read
back through the active-save-scoped live settlement rather than the opening dossier snapshot.

The remaining problem is breadth and durable product completion. Editing still spans prose authoring,
pending mechanical/world intents, Event Composer operations, and other specialized writers with
different timing and recovery contracts. The flagged Workbench proves a settlement-centered Inspector
and Change Dock for the NPC vertical, but the legacy shell remains the default and the proof does not
yet cover every entity family, cloud/offline receipt recovery, or cross-save atomicity.

### Scores

- **WHY_ON_DEMAND: PARTIAL** — Edited prose retains generated-value provenance and surrounding dossier
  content carries recorded cause language. The current controls still do not answer why an NPC facet,
  relationship, institution, or pressure has its present value before the GM changes it. "What it was"
  is available more often than "why it became this."
- **NAMED_STATES: PARTIAL** — The live controls humanize NPC facet values, map stasis reasons to
  table-facing availability labels, translate pending-edit summaries, and use generic human snapshot
  labels. Goal and role archetype values now remain typed in storage while rendering through the NPC
  facet vocabulary; the prior raw-goal and invisible-role-result defects are closed. Broader domain
  labels can still be understandable without yet explaining why the state exists.
- **QUERY_WEB: PARTIAL** — The dossier retains entity anchors, linked prose, settlement references, and
  relationship context. The flagged Workbench exposes Story, State, Why, Connections, and Actions for
  indexed NPCs. Other entity families and the legacy default shell do not yet share that complete web.
- **REVIEW / FORECAST: PRESENT FOR THE SUPPORTED PROOF; PARTIAL OVERALL** — Exact-scope pending-edit
  preview, apply, receipt, retained failure, and snapshot undo now share one transaction vocabulary.
  Cascade summaries explicitly distinguish exact changes, affected scope, directional outlook, and
  unavailable computation. Event Composer remains its own exact operation path, while clock-bound work
  still cannot promise the result of intervening queued world state.
- **TASK VIEWS: PRESENT IN THE FLAGGED PROOF** — Settlement Workbench supplies Inspector and Change Dock
  views over the dossier. The legacy edit prelude remains the rollback/default owner until entity,
  persistence, device, and lived-orientation parity closes.
- **ORIENTATION: PARTIAL** — Edited badges, per-field revert styling, pending counts, and queue summaries
  make local work visible, and retained failure/stale receipts no longer disappear as success. The full
  authored/staged/canon-queued/pulse-queued/reopen history is not yet one durable cross-session ledger.
- **VERBS_ON_ENTITIES: PRESENT FOR THE NPC PROOF; PARTIAL OVERALL** — NPC cards carry legal,
  state-gated lifecycle actions and ambient whereabouts; desktop reaches exact-scope review and mobile
  disables unsupported writes before enqueue. Other entity families and full device journeys remain
  open. The earlier audit incorrectly counted Pin on this path: saved dossiers force the read-only
  condition that suppresses it.

### Resolved or superseded findings

| Prior ID | Live-tree state | Evidence |
|---|---|---|
| V-SED1 | resolved in working tree | `NpcLifecycleControls.jsx:46-49,148-151` humanizes facet labels |
| V-SED2 | resolved in working tree | `PendingChangesBar.jsx:48-72` translates lifecycle and table kinds |
| V-SED3 | resolved in working tree | `settlementSlice.js:566-570` records a human dossier-change label |
| V-SED4 | resolved in working tree | `NpcLifecycleControls.jsx:126` uses reader-facing copy |
| V-SED5 | resolved in working tree | `NpcLifecycleControls.jsx:39-44,163-175` names availability states |
| Old "bar never mounts" premise | stale | `OutputContainer.jsx:863-868` mounts it for non-public, non-player dossiers |
| Old "NPC kinds are uncounted" premise | stale | `pendingEditsPreview.js:180-197,224-240` includes them |
| C-SED1 | resolved for the supported proof | `pendingEditIntents.js` admits complete payloads; `settlementPendingEdits.js` retains failed/stale intents and receipts |
| C-SED2 | resolved | `TableLedgerPanel.jsx` submits exact visible table-intent IDs |
| C-SED3 | resolved at the capability boundary | `NpcLifecycleControls.jsx` disables and guards mobile enqueue |
| C-SED6 | resolved for the supported proof | intents carry durable NPC IDs, owner/save scope, revision, and source fingerprint |
| C-SED7 | resolved | NPC cards translate goal facets and distinguish role archetype from the authored office/title |
| C-SED8 | resolved | `SettlementDetail.jsx` selects the active-save-scoped live settlement; `settlementDossierHeroLiveState.test.jsx` pins it |
| C-SED10 | resolved for the proof vocabulary | previews distinguish exact change, affected scope, directional outlook, and unavailable computation |

These are working-tree observations, not a claim that the changes have shipped.

### Rebaseline findings that remain

- **C-SED4 — Mutation semantics remain broader than the proof contract.** Prose uses immediate
  `applyUserEditAction`; header
  rename may call a writer directly or enter a queue depending on context; structural and NPC changes use
  the pending transaction; Event Composer intentions use their own exact operation path; link and
  cross-save work have still other persistence seams. The pending-edit family now shares a small change
  contract, but the complete editor does not yet have one durable timing/recovery model.
- **C-SED5 — The apparent prose system is much wider than its live reach.** The edit registry names many
  field types, but the live JSX consumer of `applyUserEditAction` is the NPC secret. Faction,
  institution, hook, history, and settlement prose entries are currently latent and must not be counted
  as completed authoring flows.
- **C-SED9 — The Workbench proves the better information architecture but has not cut over.** The
  flagged shell is settlement-centered; the legacy prelude remains available and default until feature,
  device, persistence, and lived-orientation parity is demonstrated.

### Immediate safety rulings

1. Preserve the now-proven validation, exact scope, failure retention, and stale-source contracts while
   expanding entity coverage.
2. Do not promise cross-save atomicity. Preflight all affected saves and show saga/outbox-style status
   when the persistence layer cannot commit them atomically.
3. Keep unsupported mobile enqueue affordances disabled until the same device can review, commit,
   discard, and recover.
4. Keep the existing editor available until entity, persistence, keyboard/touch, and reopen parity are
   demonstrated for the Workbench.

## THE MAP EDITOR — historical baseline, not reverified
OVERALL: The Map Editor is manipulation-rich (drag/keyboard placement, terrain editing, drag-nudge, reroll) with a genuinely game-grade lens/layer system and a standout town-map 'why it sits here' translation, but it misses the bar on placement-time forecasting (absent), on-map entity cross-linking and in-place verbs (partial), and scalable attention-orientation on the canvas (partial) — one benchmark strength surrounded by three fixable shortfalls.
### Scores
- LENSES: GAME_GRADE — World map: 4 modes (View/Terrain/Annotate/Routes, ModeSwitch.jsx:24-29) + LayersPanel.jsx:134-298 exposes ~15 toggleable layers, several with sub-filters (relationship types 146-154, regional channel types 178-186, impact statuses + a severity slider 196-231, traveler sub-layers 255-263) + native FMG state-borders/cultures/biomes 284-298 + RoutesToolbar.jsx:102-170 chip filters. Town map: named lens switcher parchment/watercolor/dark-fantasy/VTT + bespoke AI skins (SettlementMapEditControls.jsx:191-252), Plan/Panorama projection (SettlementMapPane.jsx:714-724), Show-the-years aging (EditControls 80-86), fog-of-war layer. One view genuinely answers many questions via switchable lenses — depth exceeds most benchmark map filters.
  GAP: LayersPanel and RoutesToolbar duplicate the relationship/chains toggles (two owners for one state); world-map and town-map lens systems are entirely separate with no shared mental model. Redundancy, not absence.
- NAMED_STATES: PRESENT — Palette cards render threat as a named band via shared threatDisplay (SettlementPalette.jsx:245,337-351) + a named stressor chip 352-367, plus tier + pop count. QuickInspector shows tier + pop + a pressure SENTENCE (QuickInspector.jsx:117-130). DistrictCard shows wealth/safety as named bands destitute→opulent (SettlementMapCards.jsx:84-85, bands defined districtProfile.js:39 WEALTH_BANDS). Provenance uses response-mode labels + latent bands strong/moderate/slight, never raw numbers (provenanceModel.js:22-59). MapLegend impact magnitude is a low→high band with ring-size, not integers (MapLegend.jsx:206-219). Lifecycle glyphs render as ruins/abandoned/steading words (PlacementsLayer.jsx:325-327).
  GAP: LayersPanel regionalMinSeverity displays a raw '40%' threshold (LayersPanel.jsx:229) and regional-impact statuses render engine workflow words (queued/applied/expired, human() at 196-202) rather than in-world phrasing. Both are on filter controls, not entity state, so minor — but they are the only bare-number/token leaks.
- WHY_ON_DEMAND: PRESENT — Town map is the standout: clicking a district opens a 'Why it sits here' section with plain-language cause sentences translated from engine effect tokens (SettlementMapCards.jsx:98-120 rendering provenanceModel.js EFFECT_LABEL/FAMILY_LABEL 22-46 — e.g. 'wore a path here', 'the wall bends to take it in'); the SM-5 Notes drawer surfaces founding response mode + site causes + declined-advantage 'roads not taken' (SettlementMapPane.jsx:221,730-737). Hovering any world-map marker or palette card gives a translated pressure sentence (QuickInspector.jsx:119-130). 1 hop to a cause, ~2 to the deeper drawer.
  GAP: The WORLD map is thin: clicking a placement gives facts only (culture/terrain/tier/pop, PlacementDetailCard.jsx:104-116) with NO 'why' — the only route to causes is the 'Open' button that navigates AWAY to the dossier (WorldMapStage.jsx:274-281). The pressure sentence already computed for the hover-peek is not reused in the click card.
- FORECAST_BEFORE_COMMIT: PARTIAL — Strong on the consequential world-altering actions: Advance Realm is gated by a translated scope summary ('Advance N settlements by one month? The realm will drift and may surface proposals to review. This undo is available only for the current session.', WorldMap.jsx:183-187,604-607); Regenerate shows a computed loss-count ('You'll lose 3 placements and 2 labels. This cannot be undone.', WorldMap.jsx:632-648); Import-image and save-on-canonized also confirm.
  GAP: The core manipulation act — dropping a settlement — has NO per-target forecast. The drag preview is a hardcoded generic card ('Settlements land at the nearest valid cell. Trade-route candidates auto-link to neighbours within 2 days.', WorldMapStage.jsx:365-375) that the code itself flags as not-yet-live ('a future iteration can hover-follow the cursor with live FMG cell data', 344-347). No terrain suitability, no who-it-would-road/trade-link-with, no proximity read at the cursor — below SimCity/Bannerlord placement-suitability grade. Terrain edits (heightmap/biome/reroll/nudge) also commit without preview of effect.
- ORIENTATION: PARTIAL — Change/conflict cues exist: the H2 first-advance ink-pulse breathes only the medallions the tick TOUCHED, in reading order (PlacementsLayer.jsx:128-179); WarFaith/Travelers overlays + MapLegend render sieges/deployments/occupation/army-columns ambiently; RoutesToolbar surfaces a 'Network stress' red-flag callout (RoutesToolbar.jsx:174-193); the Inspector toggle carries a persistent unreviewed-pulse amber badge + count (WorldMapToolbar.jsx:684-717); palette cards carry per-settlement threat/stressor chips.
  GAP: No persistent, scalable 'what deserves attention next' on the MAP itself. The advance pulse is one-shot (re-baselines on reload); the palette attention chips live in the sidebar list, not on the markers; there is no needs-attention badge layer on markers, no attention sort/filter, no 'N settlements need review' banner over the canvas. At 20+ settlements, triage is delegated to the separate Realm Inspector, not answered on the map.
- VERBS_ON_ENTITIES: PARTIAL — Ambient world-motion is genuinely strong (the M&B 'Count X besieging Y' bar): siege rings + coalition badges, deployment arrows, occupation shading, trade-war prizes, mobilizing arcs, and army/migrant/envoy columns all render on the map with a documented legend (MapLegend.jsx:130-168, WarFaithMapOverlay/TravelersLayer). Selecting a placement gives an in-place card with Open (→dossier) + Remove (PlacementDetailCard.jsx:118-138). Keyboard placement session is a full a11y verb path (KeyboardPlacementControl.jsx).
  GAP: Entity cards carry almost no in-place verbs: DistrictCard has ZERO actions besides Close (SettlementMapCards.jsx:77-81 confirmed), InstitutionCard only Close (InstitutionCard.jsx:95), QuickInspector is pointer-events:none. The placement card offers only Open/Remove — no 'advance just this settlement', 'propose', 'canonize', 'link route'. Legal actions on an entity are not surfaced at the entity.
- QUERY_WEB: PARTIAL — Peek-and-open is ambient: hovering any palette card OR any map marker fires the QuickInspector peek through one shared setHoveredSettlementId path (PlacementsLayer.jsx:268-280, SettlementPalette.jsx:201-205); clicking a marker → PlacementDetailCard → Open navigates to the full dossier; town-map clicks open cause/profile cards; edge annotations label exits to named neighbours (SettlementMapPane.jsx:666-668).
  GAP: The cross-link WEB is not realized on the map. grep confirms NO EntityLink and no deep-links in any map/townMap card. Named entities inside cards are dead text: DistrictCard 'Dominant faction: {name}' (SettlementMapCards.jsx:86), the neighbour names in edge annotations (names-only by design), and building institutions are not clickable to their own stories. The map connects to the settlement dossier via one 'Open' hop but is not a hub into the broader entity/Compendium web — cards are terminal.
### Historical translation violations — reverified and repaired in the current tree
- **V-MAP1** src/components/map/LayersPanel.jsx:229 — Regional-impact severity filter renders a raw threshold percentage — `{Math.round(regionalMinSeverity * 100)}%` (e.g. '40%'). The impact magnitude itself is banded low→high in the legend, but this filter knob exposes the underlying 0..0.8 scalar as a bare percent.
- **V-MAP2** src/components/map/LayersPanel.jsx:196-202 (and RoutesToolbar chains/roads) — Regional-impact status chips render engine workflow tokens via human() — 'queued', 'applied', 'resolved', 'ignored', 'expired' — system-vocabulary words rather than in-world phrasing shown directly to the user.
- **V-MAP3** src/components/map/ChronicleScrollback.jsx:241,267,277,290 — Raw engine tick integers shown to the user — 'Tick {selected.tick}', 'Tick {t.tick}', 'Chronicle, tick {c.tick}'. A tickCalendarLabel() translator already exists (used in AdvanceReport.jsx:387) but is not applied here. (This is the chronicle timeline living under components/map/; primarily an Inspector/Herald surface, flagged as adjacent.)
- **V-MAP4** src/components/map/WorldMapStage.jsx:365-375 — Not a token leak but a translation-honesty leak: the drop-preview card states a specific computed-sounding consequence ('Trade-route candidates auto-link to neighbours within 2 days') as fixed copy that is NOT computed for the actual drop target — the code comment concedes live cell data is a future iteration.
### Quick wins
- **Q-MAP1** Reuse the already-computed pressure sentence (QuickInspector.jsx:66) inside PlacementDetailCard so a world-map click shows one translated 'why', not just facts — display-only, one line added to PlacementDetailCard.jsx:104-116.
- **Q-MAP2** Give DistrictCard an 'Open dossier' verb and make 'Dominant faction: {name}' (SettlementMapCards.jsx:86) a link — the district card currently has zero actions and zero cross-links; a single Button + navigate turns a terminal card into a web node.
- **Q-MAP3** Route ChronicleScrollback 'Tick N' (lines 241/267/277/290) through the existing tickCalendarLabel() used in AdvanceReport.jsx:387 so users read a translated date, not a raw tick integer.
- **Q-MAP4** Relabel/soften the drop-preview copy in WorldMapStage.jsx:365-375 (or gate the 'auto-link within 2 days' claim behind a real computation) so the surface stops presenting fixed copy as a computed forecast.
- **Q-MAP5** Label the LayersPanel severity slider output (line 229) as 'Min. impact severity' band-word or add a caption so the bare '40%' reads as a threshold, not exposed engine scalar.

## THE REALM — historical baseline, not reverified
OVERALL: Strong translation discipline with two standout strengths — a genuine multi-hop, sentence-based cause-walk and a live cross-settlement address web — plus real ambient war motion and Civ-caliber map layers; but it falls short of the benchmark on scale-orientation (no needs-attention roster for 20+ towns) and pre-commit forecast, and a handful of raw tick/score leaks (all quick, display-only fixes) are the only outright translation violations.
### Scores
- WHY_ON_DEMAND: PRESENT — AdvanceReport.jsx:81-90,438,447-449 wire a 'Trace the causes' button on every event receipt that opens CauseWalkPanel.jsx — a genuine backward provenance chain (buildCauseWalk), multi-hop down to roots, rendered as plain '← because {headline}' sentences (CauseWalkPanel.jsx:96-101) and, when the discourse flag is lit, one connected prose passage (CauseWalkPanel.jsx:41-50,70-73), ending on a graceful 'no deeper memory' line (:119-123). The dossier answers why in sentences too: Causes/Substrate pressures ('Under pressure: X, Y', SubstrateTab.jsx:118-121) and Chronicle 'Because {reason}' (ChronicleTab.jsx:110-114).
  GAP: Not universal: the trace affordance renders ONLY when the provenance ledger lit the campaign (AdvanceReport.jsx:349 hasRecordedEdges gates ReceiptRow's onTrace), and only from Chronicle/advance events — a bare stat (population, a Substrate score, a threat pill) has no click-to-why. Depth is real (2+ hops) but reachable from one corner, not from 'any displayed number' as the bar asks.
- NAMED_STATES: PRESENT — Substrate/Causes renders named health bands (surplus/adequate/strained/critical/collapsed) as pills (SubstrateTab.jsx:45-52,54-63). Outlook/Viability renders a named verdict — COHERENT / MARGINAL / NOT COHERENT (ViabilityTab.jsx:76-78). Threat is a shared named word via threatDisplay ('Plagued','Frontier') with calm baselines suppressed (settlementThreat.js:33-51; SettlementPalette.jsx:337-350). Decree standing is a named word — 'still amendable' / 'sealed' (AdvanceReport.jsx:222-224).
  GAP: Two named-state defects: Causes prints the raw 0-100 engine score beside the band (SubstrateTab.jsx:143) — a bare number the bar says to replace with bands; and durations are absent — bands, threat and stress pills carry no 'for how long', and the one duration on the map is the leaked 'since tick N' (WarFaithMapOverlay.jsx:160), not a human span.
- QUERY_WEB: PRESENT — A real cross-settlement address web: useRealmEntityNav.js:33-51 + buildRealmEntityWeb resolve any subject to settlement›power›faction›npc, and AddressChain.jsx:34-70 renders each level as a live RealmEntityLink that opens that entity's card in ITS settlement's dossier even from a different (or no) open settlement — landed by useCrossSettlementFocus.js:27-45. AffectedSettlements links every named affected town (AddressChain.jsx:81-140). Wired into the Chronicle world rows (ChronicleTab.jsx:91-114; OutputContainer.jsx:774-779).
  GAP: Ambient reach is narrow: the web is concentrated on Chronicle/news rows that carry an address block; the MAP entity card (PlacementDetailCard.jsx:118-138) offers only Open/Remove with zero cross-links, the SettlementPalette cards don't link, and a bare stat mention isn't a link. The web exists and cross-navigates well, but it is not the ambient 'inspect anything anywhere' fabric the benchmark implies.
- FORECAST_BEFORE_COMMIT: PARTIAL — Destructive dossier commits do preview consequences in plain language: narrative regen confirms 'This discards the current narrative prose and generates a new one, spending N credits. The raw simulation is unchanged.' (OutputContainer.jsx:1002-1006), and queued edits get a cascade preview (PendingChangesBar, OutputContainer.jsx:862-866).
  GAP: The headline world-commit on THIS surface — Advance Realm (WorldMapToolbar.jsx:455-463) — fires with no translated projected consequences before you commit; the realm forecast lives in the inspector (HeraldForecast/RealmForecast), off-surface. Map-destructive actions Regenerate and Clear Map are danger-styled but wire straight to parent callbacks with no visible confirm/forecast (WorldMapToolbar.jsx:651-659).
- LENSES: PRESENT — Three real lens systems. The map LayersPanel is Civ-map-mode caliber: toggles for placements, relationships (per-type filter sub-list), chains, regional channels (channel-type filter), regional impacts (status filter + min-severity threshold), war/faith, GM-visibility, and travelers armies/migrants/envoys with sub-filters (LayersPanel.jsx:34-36,136-241), documented by MapLegend.jsx. The dossier stacks group tabs (Summary/Systems/World/Map/Notes) + a raw-vs-AI narrative lens (OutputContainer.jsx:91-109,579,745-759). AdvanceReport has zoom-altitude tabs Headline/Chapters/Threads/Events (AdvanceReport.jsx:308-407).
  GAP: The map lenses answer structural/relationship questions (who is at war, trade routes, edges) but there is no per-variable realm-wide state lens — no 'food security' or 'unrest' choropleth across all settlements — so a Civ-style 'show me the whole realm's X' question can't be answered from one view.
- ORIENTATION: PARTIAL — Several real signals: the toolbar Inspector button carries an amber needs-review badge ('N pulse proposals awaiting review', WorldMapToolbar.jsx:684-717); the WhileYouWereAway banner summarizes 'N weeks passed' + the major beats on return (WhileYouWereAway.jsx:80-138); war/siege/mobilize glyphs draw the eye to conflict nodes ambiently (WarFaithMapOverlay.jsx:148-225); a one-shot medallion ink-pulse marks touched settlements on the first advance (PlacementsLayer.jsx:128-179); palette cards show per-settlement threat + stress pills (SettlementPalette.jsx:332-368).
  GAP: No scalable needs-attention ordering outside the inspector. The SettlementPalette is name-search only (SettlementPalette.jsx:65-72,91-107) — there is no sort/filter by unrest/siege/needs-you, and the per-card pills don't aggregate into 'these 3 need you.' At 20+ settlements you scroll and eyeball; the map glyphs and the single inspector badge are the only aggregate cues. Scales poorly.
- VERBS_ON_ENTITIES: PARTIAL — World motion genuinely surfaces ambiently on the map — deployment arrows home→target, siege rings + coalition-count badge, occupation shading, mobilization arcs, trade-war prizes, all from live read-models (WarFaithMapOverlay.jsx:92-225). The dossier carries in-place verbs: narrate/simulation drawer (DossierActionBand, OutputContainer.jsx:834-851), assign patron deity under Power (DeityAssignmentPanel, :680), inline rename, pending-edits, PDF export.
  GAP: The map's own committed entity card is verb-thin — PlacementDetailCard offers only Open and Remove-from-map (PlacementDetailCard.jsx:118-138), and it is actually THINNER than the hover QuickInspector, which alone carries the pressure sentence + top hook (QuickInspector.jsx:119-150). World-verbs (besiege, ally, decree) are not issuable in place on this surface (inspector-bound), and the ambient motion's legibility is hover-`<title>`-only — no persistent 'Rivermouth besieges Cnocby' sentence on the map, and touch users get nothing (PlacementsLayer.jsx:276 ignores touch; QuickInspector pointerEvents:none :92).
### Historical translation violations — reverified and repaired in the current tree
- **V-RLM1** WarFaithMapOverlay.jsx:160 — Occupation glyph tooltip: `Occupied by ${occupier} since tick ${sinceTick}` — the raw engine tick counter is shown to the user instead of a calendar phrase (the codebase already has tickCalendarLabel for exactly this).
- **V-RLM2** CauseWalkPanel.jsx:103 — The why-on-demand cause-walk hop fallback renders `· tick {hop.tick}` — a bare engine tick number inside the primary 'trace the causes' surface (only avoided when the discourse-prose flag is lit).
- **V-RLM3** SubstrateTab.jsx:143 (Causes tab) — Raw 0–100 engine score `{row.score}` printed beside every health band — a bare number where the bar mandates bands over bare numbers; the band already carries the signal.
- **V-RLM4** SubstrateTab.jsx:104-106,134 (Causes tab) — Engine-vocabulary framing shown to the reader: title 'Causal substrate', body 'The sixteen forces the engine simulates…', and the grid header 'System variables' — names the engine and its internal 'variables' rather than translating to reader meaning.
- **V-RLM5** AdvanceReport.jsx:145 — DeltaLead chip 'tier {String(t.from)} → {String(t.to)}' uses the word 'tier' that the product's own legibility law retired in favor of 'Size', and prints the raw from/to tier values verbatim.
- **V-RLM6** AdvanceReport.jsx:148 — Relationship delta chip renders human(r.kind) where kind is a hyphenated token (e.g. 'war-declared','alliance-formed') — human() only strips underscores, so the hyphenated engine token reaches the reader ('war-declared') instead of a sentence ('war declared').
- **V-RLM7** QuickInspector.jsx:117 / PlacementDetailCard.jsx:108 — Tier is printed raw via String(tier).toUpperCase() / {tier}; if the tier value is a multi-word engine token (e.g. 'large_town') it surfaces as 'LARGE_TOWN' rather than a translated size word — tolerant but unguarded.
### Quick wins
- **Q-RLM1** Kill the three raw tick/score leaks (all display-only): route WarFaithMapOverlay.jsx:160 and CauseWalkPanel.jsx:103 through the existing tickCalendarLabel() instead of 'tick N', and drop the bare 0–100 score at SubstrateTab.jsx:143 (or hide it behind a detail toggle) since the band already carries the state.
- **Q-RLM2** Fold QuickInspector's pressure sentence into PlacementDetailCard so the committed click-card (PlacementDetailCard.jsx:110-116) is not thinner than the hover peek — display-only, reuses s.pressureSentence already read in QuickInspector.jsx:65.
- **Q-RLM3** Align AdvanceReport DeltaLead (AdvanceReport.jsx:145) to the product's 'Size' vocabulary and render from/to as size words, and fix :148 to humanize the hyphen so 'war-declared' reads 'war declared'.
- **Q-RLM4** Retitle the Causes/Substrate engine framing (SubstrateTab.jsx:104-106,134) from 'Causal substrate / the engine simulates / System variables' to reader language (e.g. 'What's holding, what's strained') — pure copy.
- **Q-RLM5** Add a lightweight sort/filter to SettlementPalette (SettlementPalette.jsx:65-72) — e.g. sort by threat/stress severity so the settlements that need attention float to the top — a display-only ordering over data the cards already read.

## CUSTOM CONTENT — historical baseline, not reverified
OVERALL: The custom-content authoring workspace is well-built and legible on the INPUT side — self-documenting fields, named-band states, a real derived dependency web, and a genuinely game-grade deity forecast — but falls a moderate distance short on the OUTPUT/integration side: authored content is not yet a first-class citizen of the query web (no dossier<->compendium round-trip, no Herald presence, no usage echo), consequence-forecasting is deity-only, and the sole generated-item 'why' is inconsistent and leaks raw engine tokens.
### Scores
- WHY_ON_DEMAND: PARTIAL — Deity authoring has a live 'This god will…' forecast reading the engine's own single source (DeityEffectPreview.jsx:30-31 -> deityDraftPreview.js:46-66 -> describeDeityEffects), rendering plain sentences + a dormancy note — this one bucket approaches game-grade. For GENERATED custom content the only recorded why is a trace: custom RESOURCES emit causes:[{source:'custom',effect:'authored by you',reason:'"X" is a custom resource you added…'}] (resolveResources.js:169-177), but custom INSTITUTIONS/services/goods emit NO recordTrace (assembleInstitutions.js:423-442; PipelineRail.jsx:113 confirms only catalog paths trace). The trace that exists is buried in the lazy SimulationDrawer->PipelineRail (SimulationDrawer.jsx:166), not on the entity chip. Depth = 1 hop, resources only.
  GAP: Custom institutions/services/goods carry no cause-trace; the resource trace is buried in a Simulation drawer and leaks raw tokens; non-deity authored cards show no 'what this does'.
- NAMED_STATES: PRESENT — Stored enum keys resolve to human labels: CustomItemAttributes.jsx:17 keyLabel() maps criticality/economicWeight/authority/defenseRole -> labels; deity axes render as words (CustomItemAttributes.jsx:43-46); form controls are labeled selects over named bands (CustomContent.jsx:44-47,328-330,349). PantheonActivationStrip renders four NAMED milestone states with detail sentences + a live/dormant badge (PantheonActivationStrip.jsx:134-155). No bare integers exposed. Two raw-key leaks remain (see violations).
  GAP: foodImpact chip and DeityAssignmentPanel snapLine print raw stored keys instead of their band labels.
- QUERY_WEB: PARTIAL — Within authoring there IS a real cross-link web: DependenciesSection wires refId pickers over prebuilt+custom; DependencySummary derives REVERSE links with no stored back-refs ('Auto-linked from your other custom content', Dependencies.jsx:47-68,128-154) + dangling-ref detection (Dependencies.jsx:120-126). But those links are static spans, not navigable. The loop never closes with the worlds the content shapes: a generated gold-star custom institution shows only title='Your custom content' (OverviewTab.jsx:325) — no deep-link to the authored entry — and an authored card never lists which settlements use it. Authored content is absent from the Herald (deities name-walled; factions never reach generation, FactionEventBanner.jsx). Deep-links are one-way only (EventComposerDeityField.jsx:100).
  GAP: No dossier<->compendium round-trip and no usage back-reference; the visible dependency web is non-clickable; authored content never appears in the Herald.
- FORECAST_BEFORE_COMMIT: PARTIAL — Deities get a benchmark-grade pre-commit forecast: DeityEffectPreview updates live as axes are set, listing exact engine couplings + inter-god stance + government synergy + dormancy caveat as sentences (DeityEffectPreview.jsx:30-84). PlaceInRegionCard states the on-save outcome (PlaceInRegionCard.jsx:121-127); WizardCloseout recaps steering incl. deity before Generate (WizardCloseout.jsx:98-105). But the other SEVEN buckets (institutions/services/resources/stressors/tradeGoods/factions/traditions) save with ZERO consequence preview — FIELD_HINTS (CustomContent.jsx:51-79) explain field meaning, not item effect. The substitute is the whole-app 'Test in a generation' CTA (CustomContent.jsx:533), not an inline forecast.
  GAP: Consequence forecasting exists only for deities; 7 of 8 buckets commit blind — DeityEffectPreview proves the pattern but it is unimplemented elsewhere.
- LENSES: PARTIAL — The workspace offers a catalog-vs-'My Custom Content' mode toggle (CompendiumPanel.jsx:301-306), two authoring lanes (customCategories.js:109-122), per-bucket chips with counts, free-text search, and a 'Start from a built-in' seed picker (CustomContent.jsx:527-555). That is navigation + basic filtering, not switchable analytical lenses over one view: no cross-bucket slice, no filter by state (dangling refs, never-assigned deities); search is single free-text.
  GAP: Filtering is tab/mode navigation, not multi-question lens switching; no cross-bucket or by-state analytical views.
- ORIENTATION: PARTIAL — Local orientation is good: bucket chips carry counts (CustomContent.jsx:504); PantheonActivationStrip names the next incomplete milestone with Assign/Realm CTAs (PantheonActivationStrip.jsx:144-155); dangling-ref warnings flag broken items (Dependencies.jsx:120); honest empty states with a one-click out (CustomContent.jsx:583-602); a post-save peak/end nudge (CustomContent.jsx:563-573); sync status/error banners (CustomContent.jsx:469-484). But every signal is per-card/per-bucket — no aggregated needs-attention roll-up, no bucket-chip problem badge, no 'N deities authored but never assigned'. Does not scale: you must open each bucket to find problems.
  GAP: No aggregated cross-bucket needs-attention view; problem signals are buried per-card and don't surface at the workspace glance.
- VERBS_ON_ENTITIES: PARTIAL — Saved-item cards carry legal actions in place: Edit + Delete with a consequence-explaining confirm (CustomContent.jsx:637-643); workspace Add / clone 'Start from a built-in' / 'Test in a generation' (CustomContent.jsx:522-536); pack Export/Import (ContentPackBar.jsx:93-104); deity Assign-patron / Impose-cult / Remove (DeityAssignmentPanel.jsx:151-206). Strong on the actions clause. But the world-motion clause is absent: no authored card echoes the living world (a deity card never says 'worshipped in 3 settlements'; an authored Mill never says 'appears in 5 towns'). PantheonActivationStrip is aggregate + name-free, not a per-entity usage/motion echo.
  GAP: In-place verbs are solid, but authored entities carry no ambient world-motion / usage back-reference — cards are inert catalog rows with no live-world echo.
### Historical translation violations — reverified and repaired in the current tree
- **V-CUS1** src/components/PipelineRail.jsx:127,133 (the only recorded-why surface for generated custom content, e.g. custom resources) — Renders trace.targetId raw ('resource.Dragonbone Greatswords'), trace.result raw ('present'/'present_but_depleted'), and c.source raw ('custom') — engine tokens shown verbatim instead of a translated sentence.
- **V-CUS2** src/components/compendium/CustomItemAttributes.jsx:36 — `Food · ${item.foodImpact}` prints the raw stored key (e.g. 'surplus'/'drain') rather than keyLabel(FOOD_IMPACT, …); every other chip on the card resolves its label, this one leaks the token.
- **V-CUS3** src/components/settlement/DeityAssignmentPanel.jsx:56-62 (snapLine, in the patron/cult summary and lapsed read-only view) — Joins raw axis keys with ' · ' (snap.alignmentAxis/rankAxis/lawAxis/domain -> e.g. 'evil · greater · lawful'); stored enum keys surfaced instead of DEITY_ALIGNMENT/DEITY_TIER/DEITY_LAW labels.
- **V-CUS4** src/components/EntityPicker.jsx:146,151-153 and src/components/compendium/Dependencies.jsx:105 (hover/error states) — Raw refId tokens ('custom:<uid>', 'prebuilt:institutions:…') appear in title tooltips and missing-reference labels ('Reference no longer exists: <refId>').
### Quick wins
- **Q-CUS1** CustomItemAttributes.jsx:36 — wrap foodImpact in keyLabel(FOOD_IMPACT, item.foodImpact) so the chip shows the band label, not the raw key (display-only, matches every sibling chip).
- **Q-CUS2** DeityAssignmentPanel.jsx:56-62 — map snapLine's axis keys through DEITY_ALIGNMENT/DEITY_TIER/DEITY_LAW label lists (as CustomItemAttributes already does) so the patron/cult summary reads in words, not stored keys.
- **Q-CUS3** PipelineRail.jsx:127,133 — add a small display map for result ('present'->'Present') and source ('custom'->'You authored this') and strip the 'resource.'/'institution.' prefix off targetId; turns leaked tokens into a sentence with no data change.
- **Q-CUS4** Dependencies.jsx:95-118 — render resolved dependency names as buttons that setActiveCat + focus the target item, converting the static reverse-link web into a navigable one.
- **Q-CUS5** Add a static usage count to saved deity/institution cards ('Assigned in N settlements' / 'Appears in N saved worlds') by scanning savedSettlements the way computePantheonActivation already does — a cheap first step toward the missing ambient world-motion echo.

## THE HERALD — current rebaseline, 2026-07-24

**OVERALL:** The Herald is not a failed surface. Its best organs are unusually strong: typed editorial
routing, a multi-hop recorded cause walk, linked address chains, specialized War/Faith/Trade bodies,
Wizard News arcs, a deterministic pending-future outlook, a docket, adjudication, and honest empty states.

The old audit nevertheless overstates how integrated those organs are. The normalized feed currently
reads pulse history and live stressors, while Wizard News, proposals, paused major verdicts, docket orders,
and forecast records enter through separate components. Search, time, focus, counts, deduplication, and
attention therefore do not govern "the realm's news" as one system. The seven peer doors also mix topic,
time, workflow, and summary as if they were the same navigation axis. The product has enough machinery;
the problem is editorial and semantic routing.

### Scores

- **WHY_ON_DEMAND: PARTIAL** — Headline records with root IDs can open the multi-hop `CauseWalkPanel`,
  which remains a benchmark-grade local instrument when the root is indexed in pulse history. The button
  currently appears for any root ID, including unindexed live-stressor IDs that can open an empty chain
  headed by the raw ID. Forecast, Dashboard, and adjudication projections do not consistently carry the
  same receipt. The surface-wide rating is therefore partial, not a downgrade of the indexed cause walk
  itself.
- **NAMED_STATES: PARTIAL** — Forecast, lapse, provenance, and attention states are named. Severity still
  drives sorting and visual emphasis without appearing as a word on the item. Fallback headlines and
  reasons continue to humanize typed tokens rather than translate them through authored vocabulary.
- **QUERY_WEB: PARTIAL** — Address chains resolve settlement, faction, power, and NPC references into
  dossier routes, and focus round-trips through the map. Many source records lack deeper subject IDs, so
  links commonly stop at settlement. The Dashboard attention digest, docket settlement chips, and
  resolved-decision log remain plain text, so the linked web does not cover the whole Herald.
- **REVIEW / FORECAST: PARTIAL OVERALL; OUTLOOK INSTRUMENT PRESENT** — `RealmForecast` runs the shared
  pending-future simulation on a clone and provides dated deltas, warnings, pauses, and a ceteris-paribus
  boundary. The old claim that the UI runs two clone simulations is incorrect; the marginal comparison
  helper remains deliberately unwired and owner-gated. The forecast is also buried under Divination and
  not presented in the same context as Advance Realm or a specific staged order. Its staleness fingerprint
  does not cover every stressor-content or member-settlement change, and refused orders are summarized as
  a count rather than named with their reasons. More seriously, party-caused queued events omit the real
  store-side party-impact ripple, while the UI claims the forecast is exact and "the next tick"; that copy
  is false for the omitted ripple and for month/season/year intervals.
- **TASK VIEWS: PARTIAL** — Time, focus, search, attention, severity, dashboard prose, and forecast
  intervals are useful lenses over the report feed. They do not govern the separately read adjudication,
  Wizard News, and docket sources, and their local state is not routeable or restorable.
- **ORIENTATION: PARTIAL** — Needs-attention digest, urgent pins, settlement grouping, lapsed markers, and
  advance status provide real triage. Counts appear only while narrowing and explicitly exclude
  Adjudication (`RealmInspector.jsx:227-235`), so resting navigation hides the workflow that most demands
  the GM's word. One boolean predicate also conflates significance, severity, amendment, covert status,
  and decision state.
- **VERBS_ON_ENTITIES: PARTIAL** — Adjudication, the Realm Verb Composer, and the docket provide genuine
  gated actions with refusal reasons. Report cards mainly route or explain; they do not carry a
  contextual handoff into a prefilled legal action, so the reader leaves the story and reconstructs the
  order in a separate desk.

### Translation finding disposition

- **V-HER1 — resolved.** Cause hops use `tickCalendarLabel`.
- **V-HER2 / V-HER3 — resolved at the conservative fallback boundary.** Missing authored labels use
  section-level reader copy rather than exposing rule families, kinds, or types.
- **V-HER4 — resolved.** Recorded reasons pass through `newsReasonPhrases`; absent reasons remain absent.
- **V-HER5 — resolved.** Realm Verb Composer routes unknown dial/option tokens through the shared
  presentation-boundary humanizer.
- **V-HER6 — resolved.** Herald headlines render the shared named severity band as text.
- **V-HER7 / V-HER8 — resolved.** Outcome cards render a named severity state and translated reason
  phrases rather than raw arithmetic or underscore tokens.
- **V-HER9 — raw-ID portion resolved.** An unresolved save becomes “A campaign settlement,” and an
  unresolved event target is omitted. Event kinds retain a conservative word fallback; richer authored
  vocabulary remains voice polish rather than an engine-token leak.

These closures establish the translation floor; they do not by themselves complete the Herald
overhaul or justify default promotion.

### Current blocking findings

- **C-HER1 — The navigation mixes incompatible dimensions.** Dashboard, four editorial topics,
  Divination, and Adjudication are seven peer tabs even though they represent summary, topic, temporal
  planning, and workflow. Stage the Road and Timelapse add two more local modes in the same shell.
- **C-HER2 — RESOLVED IN THE FLAGGED COMMAND SHELL.** `buildHeraldFeed` consumes pulse selected outcomes, impact
  digest, resolved stressors, and live stressors (`heraldFeed.js:111-150`). It does not adapt
  `wizardNews`, pending proposals, paused major verdicts, docket orders, or forecast items. Those records
  could not participate consistently in counts, filters, attention, search, identity, or read state. The
  canonical `RealmItem` model accounts for the eight named record families, and
  `heraldCommandSourceParity.js` now explicitly maps Dashboard, Wizard News, War, Faith, Trade, archive,
  forecast, docket, and adjudication owners into the four task views. Rendered parity tests pin every
  retained specialist mount. The legacy feed remains the rollback owner while the flag is off.
- **C-HER3 — RESOLVED IN THE CANONICAL PROOF.** `toHeraldItem` falls back to
  `${section}-${kind}-${tick}` and `buildHeraldFeed` deduplicates by that ID
  (`heraldFeed.js:72-94,115-120`). Two records of the same kind and section in one tick can collapse.
  `RealmItem` now supplies source-specific origin keys, retains same-kind/same-tick records, and visibly
  degrades irresolvable collisions. The legacy feed remains unchanged behind the rollback path.
- **C-HER4 — RESOLVED IN THE CANONICAL PROOF.** `HeraldAdjudication` rereads proposals and paused
  majors directly. The Herald strip's focus, query, time, attention, and severity selectors therefore do
  not reliably govern decisions. The flagged Decisions view now receives the filtered canonical cases
  and its resting badge counts unresolved cases only.
- **C-HER5 — RESOLVED IN THE CANONICAL PROOF.** The strip promises "Only what
  needs a decision now," while `heraldFilter.needsAttention` combines major, severity, amendable, covert,
  and adjudication into one boolean (`heraldFilter.js:31-44`). Whole-campaign pulse entries are already
  applied historical outcomes, yet a past major or covert record can be presented as if it needs a
  present decision. The canonical model now carries one six-class vocabulary, explicit promotion
  reasons, and a deterministic non-cycling lead.
- **C-HER6 — RESOLVED.** `WhileYouWereAway` rendered in both `HeraldBody` and `RealmDashboard`.
  `RealmDashboard` is now the single front-page owner, pinned by a rendered ownership test.
- **C-HER7 — RESOLVED FOR THE PROOF ROUTES.** Time lens, desk tool, query, attention toggle, severity
  filter, and filter-sheet state are local to `RealmInspector`. A story cannot be addressed with its
  active view and restored context, and opening/back can discard the edition the GM was reading. The
  command shell now retains campaign-scoped section, item, query, time lens, filters, scroll, and focus
  return; desk-tool persistence remains intentionally transient.
- **C-HER8 — PARTIAL; RENDERED CUTOVER PROOF REMAINS.** `useAdvanceSession.js` opens
  Dashboard before the initial advance and before a resumed segment. Neither completion nor pause performs
  result-aware routing; a paused result formerly returned while Dashboard remained selected. A parked
  initial or resumed interval now routes through `adjudication`, which becomes Decisions under the
  command shell. The complete changed/resolved/new journey remains a rendered and lived requirement.
- **C-HER9 — RESOLVED FOR THE PILOT DECISION; BREADTH REMAINS.** `RealmMobileGate` exposed only the
  read-only Dashboard beneath a desktop wall. Map manipulation may reasonably stay desktop-only, but
  reading Stories, reviewing the docket, and completing a decision are separate tasks. The command
  companion now supports those pilot journeys; the full action and accessibility matrix remains open.
- **C-HER10 — RESOLVED IN THE CANONICAL MODEL.** Current `section` is an editorial
  home. A realm record also needs independent temporal and workflow states. Reusing `section` as the new
  navigation axis would destroy the existing typed routing instead of extending it. `RealmItem` now
  carries independent topic, temporal, workflow, epistemic, resolution, operation, and attention facts.
- **C-HER11 — RESOLVED AT THE CLAIM BOUNDARY.** One canonical fingerprint now hashes the complete campaign
  world/graph and member-save inputs, including same-count stressor edits and settlement edits. Refused
  orders are named with settlement, operation, code, and detail. The result names its selected interval,
  calls itself a bounded deterministic projection, and explicitly discloses the party-ripple omission;
  it no longer says "exact" or "this is the next tick."
- **C-HER12 — RESOLVED AT THE DOCKET BOUNDARY.** `lapseOf` still evaluates each order independently against
  current settlement state, which is the truth it actually owns. The Docket now calls that state
  "currently expected to be refused" and warns that an earlier order can change later preconditions.
- **C-HER13 — RESOLVED FOR RECORDED DECISION SOURCES.** The resolved log concatenated proposal order
  with the latest pulse and sliced the first 15 without sorting. Both shells now sort terminal proposals
  by recorded resolution time, then in-world tick and stable identity; terminally refused proposals are
  history rather than being offered for a second decision.

### Architecture ruling

Preserve the Herald's voice and specialist bodies. First derive a non-persisted, source-specific
`RealmItem` envelope in shadow and prove identity, coverage, counts, routing, and resolution behavior.
Then test four task-oriented views as reversible selectors over existing bodies:

- **Briefing** — what needs the GM, what changed, what is active, what is building;
- **Stories** — the archive, with War/Faith/Trade/Civic as filters and aliases;
- **Plans** — outlook, docket, staged orders, and advance context;
- **Decisions** — proposals, paused verdicts, lapsed orders, and resolved history.

Compatibility is mandatory: Dashboard maps to Briefing; topic doors map to filtered Stories; Divination
maps to Plans; Adjudication maps to Decisions. Existing section IDs, `openInspectorAt(...)` callers,
focus, search, time lens, size, Escape/back behavior, and deep links stay supported. Legacy render bodies
may retire after parity and rollback proof; cheap semantic aliases remain unless a future conflict is
separately justified.
