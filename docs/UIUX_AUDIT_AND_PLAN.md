# SettlementForge — Page-by-Page Audit + Overhaul Plan

> **⚠️ HISTORICAL (audit + plan snapshot) — do NOT read as current state.** Much of this plan has since shipped on `master`. Code is the source of truth; see [docs/README.md](README.md) for the CANONICAL-vs-HISTORICAL index and the precedence rule (code > canonical > historical).

> Every page/card answered against the [review checklist](UIUX_PRINCIPLES.md#per-page-review-checklist), with a concrete, principle-tied overhaul. Treat the app as a SYSTEM: the plan section below sequences the work foundation-first so pages stay cohesive. Audit reflects the BASE on-disk app (a prior structural pass is stashed; copy is being handled by the voice workstream).

## Overhaul plan (system-level)

### Themes

- TRUST IS THE PRODUCT, AND IT IS LEAKING THROUGH DEAD/CONTRADICTORY CONTROLS. Across all three surfaces the cardinal sin (P2) keeps surfacing: a $2.99 buy-the-dossier link that scrolls to a data-buy-this-dossier anchor existing nowhere (HomeHero.jsx:312, verified — silent no-op on a revenue CTA); three different anon tier-ceiling strings in one funnel (hero 'hamlet/village/town' vs dead wizard banner 'Thorp/Hamlet/Village' vs cap 'town size' vs authSlice maxTier 'town'); REL_COLORS triplicated with DIVERGENT hex values (SettlementCard.jsx:14 rival #8b1a1a/patron #2a3a7a vs SettlementDetail.jsx:44 vs generateCampaignPDF.js:59) so the same relationship renders a different color in card vs dossier vs PDF; SaveQuotaMeter 'Sign in' routed to pricing not auth; doc-vs-code drift (PipelineReveal promises Esc-to-skip it doesn't implement, CharacterPresetCard names a 'Custom' pill that isn't rendered). For an expert, lore-fluent audience a single visible contradiction reads as 'AI hallucination / generator,' which is the exact perception the brand spends everything to defeat. Eliminating dead controls and routing every duplicated truth (tier ceilings, relationship colors, action labels) through a single source is the highest-leverage trust move.
- CONTENT IS NOT THE HERO — MONETIZATION AND CHROME OUTRANK THE GM'S OWN WORK AT BOTH ENDS. The pattern repeats per surface: the Library opens on a save-quota/upgrade meter before the GM's towns (no page H1 at all); the post-generate dossier is topped by a full-width gold 'Regenerate Draft' (discard) CTA before the reveal is even read; the config panel greets the GM with an optional 'Settlement Name' field instead of Population/tier; the settlement card's true primary (View/open) is a subordinate blue button buried 4th in a 5-button cluster behind three competing gold buttons. Every surface needs to lead with the runnable essentials and demote the funnel/chrome to a frame (P1/P6).
- FLAT HIERARCHY + BOX-SOUP IS THE DOMINANT VISUAL FAILURE EVERYWHERE. The squint test fails on nearly every surface: the Create panel nests bordered-card-inside-bordered-card 4+ levels deep (LayeredConfigurationPanel wraps ConfigurationPanel's own border inside a Foundations border, plus 3 DeepSections + PlaceInRegionCard, plus SliderPanel's border inside Fine-tune); OverviewTab stacks ~10 left-bordered cards at uniform gaps; the Library stacks every chunk (meter/toolbar/folders/unassigned) as a separately-bordered card at a flat 12px gap. Grouping is carried by borders, not differential spacing, and no view has a single dominant focal point. The fix is one system-wide move: spacing-as-grouping (P5) + a ~3-level emphasis ladder built from ≥2 of {size,weight,color} (P4), with borders reserved for genuinely semantic callouts (crisis/contradiction).
- THE FONT-SIZE FLOOR IS BROKEN AS A TOKEN-LEVEL DEFECT, NOT A PER-PAGE ONE. The FS scale itself ships pico:7 / nano:8 / micro:9 / xxs:10 plus half-steps 7.5/8.5/9.5 (tokens.js:498-499), and the dossier + library lean on them for persistent labels, kind-tags, faction %s, pips, and even some body text. 7–10px fails AA legibility and is unreadable at arm's length on a phone 'at the table' — a direct hit on the audience's primary use case. This is fixed once at the token layer (establish an ~11px floor for any persistent UI text, ~12–13px for content; quarantine pico/nano for non-user-facing only) and it heals dozens of pages at once.
- TOO MANY COMPETING NAVIGATION/ACTION AXES AND CTAs PER REGION. The dossier alone stacks six bands of chrome (group strip + sub-tab strip + 3-segment altitude control + narrative-layer strip + owner-actions strip + per-tab Sections) before any content, with Systems holding 8 sub-tabs (over 7±2); the post-generate region has 3 loud CTAs (Regenerate/New/Save); the settlement card has 3 gold buttons + blue + red; SettlementDetail's header has 3 saturated CTAs (violet Edit / red Export / blue Share) with no primary. Every region needs exactly one primary, secondary/tertiary visibly subordinated, and rare actions pushed into overflow (P8).
- THE LIVING-WORLD DIFFERENTIATOR (CHANGE OVER TIME) IS INVISIBLE ON THE DEFAULT READS. The product's entire moat — deltas after advancing time — only appears in the legacy SummaryTab's WhatChangedPanel and a RegenerationDeltaCard, yet summaryMagazineV2 (default-on, verified) makes SummaryTabV2 the landing surface and it carries NO delta block; OverviewTab score bars are static absolutes; library cards and settlement cards show only current bands, never 'food -2 / unrest rising.' P3 says lead with movement; right now movement is hidden on exactly the surfaces a returning GM hits first.
- PROVENANCE AND DOMAIN LANGUAGE ARE BLURRED — THE GM CAN'T TELL ENGINE FROM AI, OR DECODE THE ENGINE'S OWN TERMS. Simulation-derived Plot Hooks and AI-narrated DM Compass hooks use near-identical card styling (only a purple tint differs); the narrative/AI layer wears four different shells and four labels for one concept; and engine internals leak as GM-facing copy ('Substrate', 'the 15-variable causal substrate', 'Engine' altitude level, raw enum echoes like REQ/forced/→). Unify the narrative layer to one violet treatment + one label, add explicit engine-vs-AI provenance markers, and rename Substrate to GM language (P2/P11).
- TWO DIVERGENT IMPLEMENTATIONS AND DEAD LEGACY PATHS BEHIND DEFAULT-ON FLAGS ARE A LIVE CORRECTNESS RISK. SummaryTabV2 (live) silently dropped the Copy-to-clipboard export AND the WhatChangedPanel that the legacy SummaryTab still has; OutputContainer retains a dead flat-TABS strip, a Simulation tab entry, and REROLLABLE soak-killswitch scaffolding even though dossierFiveTabs/narrativeLayerStrip are default-on; the Basic/Advanced mode fork now routes both choices to the identical LayeredConfigurationPanel (a decoy). Pick one implementation per concept, port the missing features forward, and prune the dead branches before they cause a visible regression.

### Global moves (do once, system-wide)

- **[high] Establish a single source of truth for every duplicated fact: tier ceilings, relationship colors, and shared action labels/icons** — Three classes of duplicated truth are actively contradicting themselves and must each collapse to one constant. (1) Tier ceilings: derive every anon-cap string from TIER_GATE.anon.maxTier ('town') — the hero says hamlet/village/town, the dead wizard banner says Thorp/Hamlet/Village, the cap note says 'town size'; route all of them through one helper. (2) Relationship colors: REL_COLORS is triplicated with DIVERGENT hex (SettlementCard.jsx:14 vs SettlementDetail.jsx:44 vs generateCampaignPDF.js:59) so the same rival/patron link renders a different color in card vs dossier vs PDF — extract one shared module imported by all three. (3) Shared actions (View, Save, Advance Time, Export, Share, Delete) must use one name+icon+placement everywhere. This is the cheapest, highest-trust move and unblocks the per-surface CTA fixes.
- **[high] Fix the token font-size floor once: ~11px minimum for any persistent UI text, ~12–13px for content** — The defect lives in the FS scale itself (tokens.js:498-499: pico:7/nano:8/micro:9/xxs:10 + 7.5/8.5/9.5 half-steps). Establish a hard floor: any persistent label/badge/chip/pip/tab-label ≥11px (FS.xs), content body ≥12–13px (FS.sm/md); quarantine pico/nano/micro and the sub-10 half-steps for non-user-facing use only. Sweep the dossier (kind-tags FS['7.5'], faction %s, altitude/sub-tab labels FS.xxs) and library (pips, chips at micro/xxs). One token change plus a sweep heals AA legibility across dozens of pages and directly serves the at-the-table phone scan.
- **[high] Codify one emphasis ladder and one primary-per-region rule; restyle buttons by task importance not HTML semantics** — Define ≤3 perceivable levels built from ≥2 of {size,weight,color}, and a documented Button ladder: exactly one high-emphasis primary (solid gold) per region, secondary = outline, tertiary/destructive = small ghost/icon separated by a spacer. Apply system-wide to the regions that currently fail the squint test: post-generate (make Save the sole primary; demote Regenerate to outline near the toolbar; restyle 'New' as quiet outline, drop its Zap icon), settlement card (View as primary or whole-card click target; Add-to-Campaign/Canonize/Advance into a kebab; Delete small+separated), SettlementDetail header (one primary; Export is NOT destructive so drop danger-red), CampaignFolder (Advance Time primary; PDF secondary not danger-red).
- **[high] Adopt spacing-as-grouping as the default; reserve borders for semantic callouts only (anti-box-soup)** — Replace uniform-gap bordered-card stacks with a differential spacing rhythm (tight within a cluster, looser between) plus an occasional background tint or single header band. Flatten the worst offenders: Create panel (drop the outer Foundations border wrapping ConfigurationPanel's own border; collapse Fine-tune's triple-nested collapsibles), OverviewTab (~10 left-bordered cards → spaced rows), Library (drop the bordered wrapper on Unassigned; band meter/toolbar as borderless tints), CampaignFolder (remove the 3-4 stacked border-bottoms before the first card). Reserve the bordered card + colored left-border for crisis/contradiction callouts where the semantic earns it.
- **[high] Collapse the dossier's six chrome bands into a header-owned identity + one action cluster + a single nav axis** — The dossier stacks group strip + sub-tab strip + altitude control + narrative strip + owner-actions strip + per-tab Sections before content, and re-prints the settlement identity THREE times (DossierHeaderRow, SummaryTabV2 band, OverviewTab strip). Make the card header the SOLE owner of identity and add a one-line state line ('Ruled by <faction> · <stability> · <headline tension>'). Merge owner-actions + narrative control + altitude + Reroll into ONE right-aligned cluster (primary = Refine to prose; Share/Buy/Detail/Simulate in overflow); move Reroll into the NPCs/History tab bodies. Rename the altitude levels off the 'Overview' collision (e.g. Glance/Detail/Full) and differentiate the group strip from the sub-tab strip (icons/counts, distinct treatment).
- **[med] Unify the narrative/AI layer to one treatment + one label, and add explicit engine-vs-AI provenance** — One concept currently wears four shells (violet strip, purple banner, per-tab NarrativeNote, purple Guidance tab) and four labels ('Narrative Layer · AI prose pass' / 'Narrative Layer: Identity/Lens' / 'Narrative Layer' / 'Guidance') with an internally inconsistent stance on saying 'AI'. Pick one violet treatment, one label vocabulary, one decision on the word 'AI', and never render two violet bands for the same view. Separately, add a clear provenance marker distinguishing simulation-derived Plot Hooks from AI-narrated DM Compass hooks (same purple = AI everywhere). Rename engine-internal 'Substrate'/'15-variable causal substrate'/'Engine' to GM-facing language (e.g. 'Pressures' / 'Causal Map').
- **[med] Make change-over-time the default focal layer wherever a prior snapshot exists** — Promote deltas/trends to the top of the surfaces a returning GM hits first: port WhatChangedPanel into SummaryTabV2 (the live default that currently lacks it), render OverviewTab score bars and EconomicsTab food/trade as deltas when a prior state exists, and add a delta pip to library + settlement cards after an Advance ('food -2', 'unrest rising') instead of only the new absolute band. Pair with defaulting the Library sort to 'Needs attention' (or a persistent 'N towns need attention' filter banner) so the in-session triage goal has a surfaced control.
- **[med] Prune dead/legacy paths and resolve divergent implementations now that flags are default-on** — Verified default-on flags (flags.js) mean the legacy branches are dead weight and a regression risk. Port SummaryTabV2's MISSING Copy export + WhatChangedPanel from the legacy SummaryTab, then delete the legacy SummaryTab; remove OutputContainer's dead flat-TABS strip, Simulation tab entry, and REROLLABLE soak-killswitch scaffolding; resolve the Basic/Advanced decoy (both modes render the identical LayeredConfigurationPanel) by dropping the fork or making the modes genuinely differ, and fix the Advanced 'step by step' copy. Also retire doc-vs-code drift: implement PipelineReveal's promised Esc-to-skip, render or stop naming CharacterPresetCard's 'Custom' pill, soften generate.subline off 'watch the pipeline as it runs.'
- **[med] Standardize accessibility primitives: label association, ≥2-channel state, 44px targets, real headings/landmarks** — Make PlaceInRegionCard's correct <label htmlFor> the standard (ConfigurationPanel's Sel/Lbl relies on proximity only); ensure every colored state (faction bars, status tags, trade arrows, pips, relationship colors) pairs color with a glyph/label that survives the smallest size and never hides the % on thin segments; raise interactive targets (sm Buttons are 28px min; sub-tabs are tiny) toward ~44px for tablet-at-the-table; add real h1/landmarks (Library has none; 'Unassigned' is a div; SampleDashboard heading is an 11px muted label); add role=progressbar/aria-valuenow to the SaveQuotaMeter bar; replace emoji glyphs (📱 🕯 🔍) with the lucide set already imported.
- **[med] Reframe every limit, error, and dead-end as a previewed next step with a real CTA** — Apply P9/P10 consistently: fix or remove the no-op $2.99 side-door (wire the real purchase handler or add the data-buy-this-dossier anchor); distinguish a true generation failure from a tier gate in the sample fork (don't mis-frame an engine error as an upsell); add a catch+retry to NotesTab.save() (a silent save failure currently loses prep notes); add a 'No settlements match — Clear filters' empty result to the Library toolbar; give persistence/reactivation alerts an actionable CTA; make the post-generate map next-step state-aware ('Save first, then place it' for unsaved users). Reorder the at-cap hero card to lead with unlock value, not the spent allowance.

### Recommended implementation sequence


**1. FOUNDATION — design tokens, shared constants, Button ladder, primitives (no single page; touches all)**
   - Raise the FS floor in tokens.js (≥11px persistent UI, ≥12–13px content); quarantine pico/nano/micro + sub-10 half-steps
   - Extract one shared REL_COLORS module; import it in SettlementCard, SettlementDetail, generateCampaignPDF (kills the card-vs-dossier-vs-PDF color contradiction)
   - Create one tier-ceiling helper derived from TIER_GATE.anon.maxTier; replace all hardcoded anon size strings
   - Codify the Button ladder (one solid-gold primary per region; outline secondary; ghost/icon tertiary) and the ≤3-level emphasis rule
   - Standardize label association (<label htmlFor>), ≥2-channel state, ~44px targets, and a shared lucide icon for Search (drop emoji)

**2. CREATE / GENERATE flow + anon landing (the funnel — fix before driving traffic to it)**
   - Fix or remove the no-op $2.99 buy-the-dossier side-door (HomeHero.jsx:312); make heroV2 the only hero variant
   - Resolve the Basic/Advanced decoy (both render the same panel) — drop the fork or make modes differ; fix the 'step by step' copy
   - Flatten the config box-soup: drop the outer Foundations border, give one dominant header, collapse Fine-tune's triple nesting
   - Reorder ConfigurationPanel so Population/tier is top-left; demote optional Settlement Name below the essentials
   - Delete the dead/contradictory anon-in-panel banner; implement PipelineReveal Esc-to-skip; resolve CharacterPresetCard 'Custom'
   - Post-generate: make Save the sole primary; demote Regenerate to outline; restyle 'New' as quiet outline; make the map next-step state-aware; end on an evocative runnable detail

**3. DOSSIER / OUTPUT (highest-traffic read surface; the conversion peak lives here)**
   - Header owns identity once + a one-line state line ('Ruled by X · stability · headline tension'); kill the two duplicate identity bands
   - Collapse six chrome bands into one action cluster + one nav axis; rename altitude off the 'Overview' collision; differentiate group vs sub-tab strips; move Reroll into NPCs/History bodies
   - Consolidate Systems' 8 sub-tabs toward 7±2; sweep the FS floor across tabs (kind-tags, faction %s, sub-tab labels)
   - Pick ONE summary: port Copy export + WhatChangedPanel into SummaryTabV2, then delete legacy SummaryTab; make the cheat-sheet empty state fall back to simulation-derived hooks
   - Promote deltas to the top of the default Summary/Overview when a prior snapshot exists; de-border OverviewTab/Economics into spaced rows
   - Unify the narrative layer to one violet treatment+label; add engine-vs-AI provenance; rename 'Substrate'; prune dead flat-TABS/Simulation/REROLLABLE scaffolding
   - Always show faction/income %s with a glyph+label; replace emoji icons with lucide; collapse two-column V2 to stacked on narrow viewports

**4. LIBRARY list shell + Save-quota meter (the hub a GM returns to between sessions)**
   - Add a real h1 'Library' + subtitle + single primary 'New Settlement' CTA; demote SaveQuotaMeter to a slim line below the header (content above funnel)
   - Replace uniform 12px stacking with a spacing hierarchy; drop the bordered Unassigned wrapper; make the town list the focal layer under blur
   - Default sort to 'Needs attention' or add a persistent 'N towns need attention' triage banner
   - Route SaveQuotaMeter 'Sign in' to actual auth (not pricing); add role=progressbar/aria-valuenow; add 'No settlements match — Clear filters' empty result
   - Replace emoji magnifier with lucide Search; give persistence/reactivation errors an actionable CTA

**5. SETTLEMENT CARD + action cluster (atomic library row; the at-a-glance triage unit)**
   - Collapse to ONE primary (View / whole-card click target); Delete small+separated; Add-to-Campaign/Canonize/Advance into a kebab overflow
   - Add runnable essentials top-left: ruling NPC/faction name + a one-line causal tension
   - Consume the shared REL_COLORS (fixes the card-vs-detail divergence); add inline labels + raise pip text off 9px
   - Group the content column into two spacing tiers; fold network/regional badges behind '+n effects'
   - Render deltas after an Advance ('food -2', 'unrest rising') as the focal pip, not just the new band

**6. SETTLEMENT DETAIL header + CampaignFolder/RealmStrip + secondary library chrome (toolbar, bulk bar, sample state)**
   - SettlementDetail header: chunk into nav / status / actions; one primary; Export is not destructive (drop danger-red); ~44px targets
   - CampaignFolder: Advance Time as sole gold primary; PDF as subordinate secondary (not danger-red); flatten the stacked border-bottoms; raise RealmStrip text off 10px
   - Sample state: distinguish a true generation error (plain-language + retry) from a tier gate (purchase modal); promote the heading to a real AA-safe h2
   - Bulk bar: wrap 'N selected' in aria-live; separate Delete with a spacer; consider sticky positioning
   - NotesTab: add a catch+retry to save() so a failed save doesn't silently lose prep notes; surface an unsaved-changes indicator

### Risks

- Regression risk from pruning default-on flag branches: SummaryTabV2 is MISSING the Copy export and WhatChangedPanel that legacy SummaryTab has — deleting legacy before porting both forward would silently remove shipped features. Port-then-delete, with a test asserting both exist in the live path.
- The FS floor bump is a global visual change that will reflow dense surfaces (dossier tabs, library pips, sub-tab strips) and may cause wrapping/overflow or break tight two-column layouts (SummaryTabV2). Needs a full visual sweep at tablet + phone widths, not just unit tests.
- Unifying REL_COLORS to one palette will visibly change colors on at least two of the three current call sites (card/detail/PDF currently disagree) — pick the canonical palette deliberately (the dossier/detail values are the user-facing reference) and verify PDF export still reads correctly, since the PDF has its own contrast constraints.
- Collapsing the dossier's six chrome bands and the altitude control touches the most-used surface and its ARIA tablist/radiogroup wiring; careless merging could break keyboard nav (roving tabindex, arrow/Home/End) or the altitude gating that hides Substrate at 'guided'. Preserve the existing a11y handlers and the empty-grid guard.
- Demoting the SaveQuotaMeter and Regenerate, and reframing tier caps, sits on the conversion path — these are revenue-sensitive. The plan assumes content-first lifts trust (and thus conversion) for an expert audience, but it should be A/B-guarded (the flag infra already supports this) rather than shipped blind, especially the hero at-cap reorder and the meter relocation.
- The Basic/Advanced fork resolution is a product decision, not just UI: dropping it changes the documented mode model and any analytics/onboarding copy keyed to it. Confirm with product before removing, or the 'make them genuinely differ' path adds real scope.
- Adding ruler/tension one-liners to library cards and the dossier state line depends on read-models (settlementSignals/factions) reliably yielding a named ruler and a headline tension for every settlement, including thin anon/sample data — needs a graceful fallback so the new focal line never renders empty or contradicts the dossier (the cardinal sin it's meant to fix).


---

## Per-surface audit


### Surface: CREATE / GENERATE flow + anon landing — the funnel from cold visitor through first dossier, and the signed-in instant + layered-config generation path. Files reviewed: GenerateWizard.jsx, HomeHero.jsx, generate/LayeredConfigurationPanel.jsx, ConfigurationPanel.jsx, generate/ModeSelector.jsx, generate/CharacterPresetCard.jsx, generate/PipelineReveal.jsx, generate/WizardEmptyState.jsx, generate/WizardNextSteps.jsx, generate/WizardCloseout.jsx, generate/PlaceInRegionCard.jsx, generate/WizardOutputToolbar.jsx, generate/SaveToLibraryButton.jsx, generate/ChangeModeBar.jsx, PipelineRail.jsx, plus copy/en.js and store/authSlice.js for ground-truth on caps/copy.

**Cross-cutting:**
- BOX-SOUP IS THE SURFACE'S DOMINANT FLAW. The Create path is a stack of bordered cards inside bordered cards: LayeredConfigurationPanel wraps ConfigurationPanel (own border) in a Foundations border; CharacterPresetCard, three DeepSections, and PlaceInRegionCard are each separately bordered; inside ConfigurationPanel, Fine-tune nests Collapsibles inside a separately-bordered SliderPanel. Differential spacing does almost no grouping work. Adopt P5: one container per logical group, header tint + whitespace for the rest, borders reserved for genuinely separable optional depth.
- NO SINGLE FOCAL POINT / FLAT HIERARCHY across the config panel and the post-generate region. Section headers are nearly all FS.lg/600 serif INK, and the post-generate region has 3+ co-equal loud CTAs (Regenerate, New, Save). Every view should pass the squint test with exactly one dominant element (P4/P8).
- TIER-CEILING COPY IS INCONSISTENT IN ONE FLOW: hero='hamlet/village/town', dead wizard banner='Thorp/Hamlet/Village', cap note='town size', authSlice truth=maxTier 'town'. Route every tier-ceiling string through a single shared constant derived from TIER_GATE; a visible contradiction here is the cardinal sin (P2).
- THE BASIC/ADVANCED MODE FORK IS NOW A DECOY: post-Phase-6 both modes render the identical LayeredConfigurationPanel, and the Advanced longDesc still promises a 'step by step' wizard that no longer exists. Either remove the fork (the layered panel already does progressive disclosure) or make the modes genuinely differ, and fix the copy (P1/P8/P11).
- DOC-VS-CODE DRIFT erodes trust and maintainability: PipelineReveal's docstring promises Esc-to-dismiss that isn't implemented; CharacterPresetCard's copy references a 'Custom' control that isn't rendered; generate.subline promises 'watch the pipeline as it runs' over a synchronous record-replay. Make the code match the promise or the promise match the code (P10/P11).
- DEAD / BROKEN CONTROLS: the at-cap '$2.99 buy the dossier' link scrolls to a data-buy-this-dossier anchor that exists nowhere (silent no-op on a revenue CTA); the anon-in-panel banner is unreachable. Audit for controls whose first click can't land (P8).
- CONTENT-AS-HERO INVERTED AT BOTH ENDS: the panel greets the GM with an optional Settlement Name field instead of Population/tier, and the post-generate peak is topped by a full-width 'Regenerate Draft' (discard) button before the dossier is read. Lead every surface with the runnable essentials; subordinate the re-roll (P1/P6/P9).
- ACCESSIBILITY INCONSISTENCY: PlaceInRegionCard uses proper <label htmlFor> while ConfigurationPanel's Sel/Lbl pair relies on proximity only; the resource four-state cycle and 'off' states lean on opacity for de-emphasis. Standardize label association and ensure every state has ≥2 non-opacity channels at AA contrast (P7).
- STRENGTHS TO PROTECT: the magic/isolation/town+ constraint logic with plain-language reasons and the forced-Teleportation-Circle consequence note is exactly the visible causal coherence the product sells (P2); the PipelineReveal peak and the anon proof-ladder (hero→sample→region replay) are well-built; Save-as-signup and the unsaved-exit confirm handle limits and recovery the right way (P9/P10). Do not regress these while flattening the chrome.


#### Anon HomeHero (cold landing)
*File:* `src/components/HomeHero.jsx`
*Purpose:* Convert a cold, lore-fluent GM from 'is this just another AI generator?' to first dossier in one click: positioning (anti-AI), a size picker (hamlet/village/town), and a Begin CTA — then reframe the daily cap as an unlock.
*Layout today:* Centered 720px parchment gradient card. Header switches on the heroV2 flag (H1 anti-AI line + italic deck, OR eyebrow + title + subtitle + bordered anti-AI quote). Then a flex-wrap row of 3 SizeButtons (left-aligned label + hint), then the primary Begin CTA with a remaining-count subline, then a footnote with an inline Sign-in button, then a hairline ornament. At cap, the CTA region swaps to an unlock card (sign-in primary + a dashed-rule '$2.99 buy the dossier' side-door link) followed by AnonTierTeaser.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test: does 'a SIMULATOR for DMs' land as the recalled message and is the next action obvious? | **good** | With heroV2 on, the H1 'Most generators roll on a table. / This one simulates.' (en.js:58-60) is the strongest possible statement of the north star, and the gold Begin CTA is the unambiguous focal point. The legacy variant buries the same idea below an eyebrow + two paragraphs. Takeaway lands. |
| Primary CTA discipline & first click | **good** | Exactly one high-emphasis primary (Button variant=primary size=lg with Sparkles + ArrowRight, HomeHero.jsx:323-339); Sign-in is a subordinate ghost/underline link (366-378). Clean hierarchy. |
| Correct button→function mapping | **broken** | The at-cap side-door 'buy the dossier for $2.99 ↓' (HomeHero.jsx:309-316) does document.querySelector('[data-buy-this-dossier]')?.scrollIntoView — but no element with data-buy-this-dossier exists anywhere in src (grep returns only this line). The link silently no-ops: a paid-conversion control that does nothing. Cardinal trust + revenue failure. |
| Match real world / consistency of stated caps | **weak** | Copy is internally consistent here (note 'capped at town size', en.js hero.note; sizes hamlet/village/town match TIER_GATE.anon.maxTier==='town' in authSlice.js:37). But it contradicts the wizard's own anon banner (GenerateWizard.jsx:306 says 'Thorp, Hamlet, or Village') — a cross-surface contradiction in the same flow (P2 cardinal sin). |
| Emphasis on change / peak-end | **adequate** | The cap is correctly reframed as an unlock not a wall (HomeHero.jsx:273-318, P9). But the at-cap card leads with 'You've explored hamlet, village, town' (past tense, what's used up) before the unlock value — slightly inverts the recommended 'lead with what sign-in gets you'. |
| Accessibility (POUR) | **adequate** | SizeButtons use aria-pressed and 44px-ish min targets; anti-AI italic gold-on-parchment (swatch['#5A4A2A'], HomeHero.jsx:217) needs an AA spot-check. Active size is encoded by border+background (two channels) — good. The decorative ornament is aria-hidden. |
| Cognitive load | **good** | Three sizes, one CTA, one footnote link. Minimal, funnel-appropriate. |

*Overhaul:*
- **[high]** Fix or remove the $2.99 side-door: either add the data-buy-this-dossier anchor to the AnonTierTeaser/sample-dossier purchase block, or replace the scroll with the real purchase handler (setPurchaseModalOpen). Never ship a money CTA that no-ops. — _A dead primary-intent revenue control is the worst possible trust signal to an expert audience and loses real conversions._ (P8 (first click must land) / P10)
- **[med]** Make the heroV2 two-voice variant the only variant (retire the legacy eyebrow+anti-AI-quote path) so every cold visitor gets the strongest 'simulator not generator' framing as the recalled message. — _The legacy variant dilutes the north-star takeaway under three stacked paragraphs; the v2 H1 is the conversion lever._ (P1 / P6)
- **[low]** Reorder the at-cap card to lead with the unlock value ('Unlock thorp→metropolis, unlimited saves, PDF export') and demote the 'you've explored…' line to a small subhead. — _Goal-gradient + peak/end: sell the next step, don't recap the spent allowance._ (P9)


#### Signed-in HomeHero (Welcome back / instant)
*File:* `src/components/HomeHero.jsx`
*Purpose:* For a converted user, skip marketing and let them roll instantly across all six tiers; surface a Welcome-back card for return visits.
*Layout today:* Same 720px card, but header is 'Instant Generation' eyebrow + 'Welcome back, {name}.' + 'Pick a size. Roll a settlement. Full ladder unlocked.' Then 6 compact SizeButtons (no hints), then a single 'Generate a {size}' CTA. WelcomeBackCard self-gates above.

| Q | Verdict | Finding |
|---|---|---|
| Distinctness from anon variant | **good** | Different eyebrow, no anti-AI line, 6 tiers, compact buttons (HomeHero.jsx:225-248, 92). A returning GM won't confuse it with the cold landing. |
| Recognition vs recall / runnability | **adequate** | Compact buttons drop the size hints (HomeHero.jsx:263 passes hint only when isAnon), so a signed-in user choosing 'thorp' vs 'hamlet' has no inline reminder of scale. Recognition-over-recall would keep a terse hint. |
| System status & perceived speed | **good** | CTA shows busy state 'Forging…' with disabled+busy props (HomeHero.jsx:327-333). Instant path feedback is correct. |
| Cohesion with the flow | **weak** | handleBegin sets wizardMode='basic' and generates (HomeHero.jsx:117-119), so a returning user lands directly in the post-generate dossier and never sees the layered config they're paying for — the expert accelerator is one extra back-click away with no scent that it exists from the hero. |
| Empty state / Welcome-back | **good** | WelcomeBackCard self-gates and offers Open + Forge follow-up (HomeHero.jsx:141-149) — a strong Zeigarnik re-entry for a saved campaign. |

*Overhaul:*
- **[med]** Add a subordinate 'Configure instead →' link beside the signed-in CTA that routes to the layered panel (setWizardMode without generating). — _Information scent to the expert accelerator; today the paying GM's depth is hidden behind a generate-then-back detour._ (P1 (progressive disclosure with scent))
- **[low]** Restore terse size hints on the signed-in compact buttons (or a single dynamic caption under the row reflecting the picked size). — _Recognition over recall — even an expert benefits from 'a real economy, guilds, a jail' when picking town vs city quickly._ (P6 / recognition)


#### WizardEmptyState (Create landing shell)
*File:* `src/components/generate/WizardEmptyState.jsx`
*Purpose:* Decide what the no-mode/no-settlement Create view shows: hero+sample+region-replay for anon, or 'Create a Settlement' heading + Basic/Advanced mode picker for signed-in.
*Layout today:* 860px column. Anon: HomeHero → lazy HomeSampleDossier → lazy RegionWakeReplay. Signed-in: centered 'Create a Settlement' heading + 'Choose a generation mode' + large ModeSelector. A 'Want full control?' strip precedes the picker (signed-in) or points anon to sign-in.

| Q | Verdict | Finding |
|---|---|---|
| Peak/end & psychology (anon proof ladder) | **good** | The anon ladder hero → static sample dossier → living-region replay (WizardEmptyState.jsx:41-50) is a well-sequenced proof of the moat (static depth, then the living world) — strong use of demonstration over claim. |
| Progressive disclosure / cohesion | **adequate** | Signed-in users get BOTH the HomeHero instant path (rendered by showHomeHero) AND the ModeSelector below — two competing entry points to generation on one screen. Discoverable, but no clear ranking of 'fast roll' vs 'configure'. |
| Empty state quality | **good** | Signed-in empty state has heading + instruction + sample-driven CTA via the hero; not a dead 'nothing here' state. |
| Distinctness | **good** | Visually distinct from Library/Gallery: parchment hero + mode cards, no list/grid chrome. |

*Overhaul:*
- **[med]** On the signed-in landing, visually rank the two paths: keep the hero as the dominant 'Roll now' block and demote the ModeSelector into a single quieter 'Want full control? Basic / Advanced' affordance rather than two large hover-lifting cards competing with the hero. — _One focal point per view; today the large mode cards rival the hero CTA for the squint-test winner._ (P4 / P8)


#### ModeSelector (Basic / Advanced cards)
*File:* `src/components/generate/ModeSelector.jsx`
*Purpose:* Let a signed-in user pick Basic (one-screen) vs Advanced (step-by-step) generation.
*Layout today:* Flex-wrap row of 2 large cards (background image, icon, serif title, desc, italic longDesc) or a small variant. Active = gold border + GOLD_BG.

| Q | Verdict | Finding |
|---|---|---|
| Match real world (no leaked internals) & truth-in-labeling | **weak** | The Advanced longDesc promises 'step by step… Walk through general config, institutions, services, and trade' (ModeSelector.jsx:26), but Phase 6 collapsed the step wizard into ONE LayeredConfigurationPanel (per the file's own header in GenerateWizard.jsx:18-22 and LayeredConfigurationPanel.jsx:1-23). Both Basic and Advanced now render the SAME layered panel — the 'step by step' promise is no longer true. |
| Distinctness of the two choices | **broken** | Because both modes route to the identical LayeredConfigurationPanel (GenerateWizard.jsx:298-356 renders it for any non-null wizardMode), the Basic/Advanced distinction is now cosmetic — the user picks between two cards that produce the same screen. A decoy choice. |
| Design optimality / hierarchy | **adequate** | Large cards build emphasis from size+weight+color (icon 40px, serif xxl, gold). Fine. But 'longDesc' italic prose inside a clickable card mixes prose-to-read with a click target. |
| Consistency / Jakob | **good** | aria-pressed, aria-label, keyboard focus styling present (ModeSelector.jsx:67-84). |

*Overhaul:*
- **[high]** Resolve the Basic/Advanced fiction: either (a) drop the mode picker entirely and present the single LayeredConfigurationPanel with Foundations open and Deep-constraints collapsed (the panel already IS progressive), or (b) make the modes actually differ (Basic = Foundations only; Advanced = everything expanded). — _Two controls that lead to identical state is a decoy that erodes expert trust and wastes a decision; the layered panel already does progressive disclosure better than a mode fork._ (P1 / P8 (no decoy controls))
- **[med]** If the picker survives, rewrite the Advanced longDesc to stop promising 'step by step' / 'walk through' and describe the layered panel honestly. — _Truth-in-labeling; an expert who picks Advanced expecting a stepper will distrust the product when it doesn't appear._ (P11 / trust)


#### LayeredConfigurationPanel + ConfigurationPanel (the config surface)
*File:* `src/components/generate/LayeredConfigurationPanel.jsx`
*Purpose:* The single progressive Create panel: Character preset → Foundations → Fine-tune → Deep constraints (Institutions/Services/Trade) → Place in Region. The expert accelerator.
*Layout today:* Vertical stack of bordered sections: CharacterPresetCard (parchment), a Foundations bordered card wrapping ConfigurationPanel (name + custom-content toggle + two 3-col grids of selects + a 'Fine-tune' collapsible with sliders/resources/stress), a 'Deep constraints' uppercase label over three collapsible DeepSections, then PlaceInRegionCard. Each section is its own 1px-border card.

| Q | Verdict | Finding |
|---|---|---|
| Borders vs whitespace (anti-box-soup) | **broken** | This is the worst box-soup in the surface: CharacterPresetCard (border) + Foundations card (border, with CARD_HDR header) wrapping ConfigurationPanel (its OWN border, ConfigurationPanel.jsx:292) → a bordered card inside a bordered card. Then 3 DeepSection bordered cards + PlaceInRegionCard (border + left-accent). Inside ConfigurationPanel, Fine-tune nests Collapsibles inside a SliderPanel that has its own parchment border (ConfigurationPanel.jsx:46), inside the Foundations border. Four+ nested container levels; differential spacing is doing almost no grouping work (P5). |
| Design optimality / 3-level cap | **weak** | Section headers are all the same serif FS.lg/600/INK (LayeredConfigurationPanel.jsx:81,117; DeepSection 81) so Character, Foundations, and each Deep section read at one identical level — no dominant entry point. The 'Deep constraints' label is uppercase FS.xs/800 MUTED (127), a different and weaker treatment than the things it groups. Squint test yields a flat stack, not a hierarchy. |
| Front-load / scannability | **adequate** | Foundations subtitle 'size, route, culture: the essentials' (LayeredConfigurationPanel.jsx:118) is good keyword-first scent. But ConfigurationPanel leads with 'Settlement Name (optional)' (ConfigurationPanel.jsx:295) as the first field — an optional, low-value input occupies the top-left where the most table-relevant control (Population/tier) should be (P6). |
| Error prevention & domain language | **good** | The magic/isolation/town+ constraint logic is genuinely strong: blocked options are disabled with domain-language reasons ('Town+ requires a trade route or Magic slider above 0', ConfigurationPanel.jsx:329-331; isolated-town+ forces a Teleportation Circle with a clear consequence note, 355-368). This is exactly the visible-causal-coherence the product needs (P2). |
| Cognitive load / progressive disclosure | **adequate** | Deep constraints correctly collapsed by default with 'Optional' affordances (DeepSection, LayeredConfigurationPanel.jsx:82). But Fine-tune is a collapsible inside Foundations that itself contains two more collapsibles (Nearby Resources, Settlement Stress, ConfigurationPanel.jsx:455-459) — three disclosure depths, easy to lose place. |
| Match real world (no leaked internals) | **good** | Labels are GM-native (Population, Trade Route, Regional Threat, Culture, Magic in the World?). No seed/RPC/worldPulse leakage in the visible copy. |
| Accessibility | **weak** | Selects use a Sel helper with a thin border and 5px radius (ConfigurationPanel.jsx:32) but no associated <label> element — Lbl renders a <div>, not a <label htmlFor>, so the select↔label association relies on proximity only (PlaceInRegionCard DOES use proper <label htmlFor>, so it's inconsistent). Resource four-state cycle buttons encode state largely by color+glyph (good) but the 'off' state relies heavily on opacity 0.45-0.55 which is borderline for low-vision users. |
| Coherence (named entities, byte-identical claim) | **good** | The panel documents that it's a pure UI reshuffle producing byte-identical generation (LayeredConfigurationPanel.jsx:11-13; CharacterPresetCard writes the same archetypePatch as the legacy dropdown). Internally coherent. |

*Overhaul:*
- **[high]** Flatten the nesting: drop the outer Foundations border so ConfigurationPanel's own card is the only container; group sections with differential spacing + a single subtle CARD_HDR header band each, reserving the bordered card only for Deep constraints. Remove the redundant CharacterPresetCard border or merge it visually into the Foundations top. — _The current bordered-card-inside-bordered-card stack is textbook box-soup; whitespace and one header tint can carry the grouping at half the chrome._ (P5 / P19 (borders earn their place))
- **[med]** Establish one focal point: make 'Foundations' (or Character) the single dominant header (larger/heavier), and demote Deep-constraints section headers to a clearly lower level so the panel reads as Essentials → optional depth. — _Today every section header is the same weight, so there is no entry point; the expert can't tell what to fill first._ (P4 / P6)
- **[med]** Reorder ConfigurationPanel so Population/tier is the top-left first control and move 'Settlement Name (optional)' below the essentials grid (or into Fine-tune). — _Most-table-relevant fact top-left; an optional name field is the wrong thing to greet the GM with._ (P6)
- **[med]** Wrap each select in a real <label htmlFor> (match PlaceInRegionCard) and raise the 'off'/incompatible resource states above pure-opacity de-emphasis to a second channel (dashed border is present — ensure text contrast still ≥4.5:1). — _Accessibility: label association and ≥2 channels for state._ (P7 / accessibility)
- **[low]** Collapse the Fine-tune triple-nesting: promote Nearby Resources and Settlement Stress to siblings of the sliders inside one Fine-tune body rather than collapsibles-within-a-collapsible. — _Three disclosure depths exceed the ~3-level cap and make state easy to lose._ (P4 / cognitive load)


#### CharacterPresetCard
*File:* `src/components/generate/CharacterPresetCard.jsx`
*Purpose:* Promote the 17 settlement archetypes to a Tier-1 'pick a character to shape the town in one tap' card.
*Layout today:* Parchment card: 'Character' serif title + inline hint + explainer line, then archetype groups (uppercase group labels) of pill Buttons; active pill = gold.

| Q | Verdict | Finding |
|---|---|---|
| Recognition vs recall / first click | **good** | 17 named pills grouped (CharacterPresetCard.jsx:68-96) with title tooltips (a.desc) — recognition-driven, and activeArchetypeKey infers the selected pill from current sliders (30-38) so reopening shows state. Strong picker. |
| Emphasis / two-channel state | **good** | Active pill = gold border + gold tint background + bold + aria-pressed (CharacterPresetCard.jsx:79-88) — color+weight+border, plus ARIA. Compliant. |
| Cognitive load | **adequate** | 17 pills exceeds 7±2, but grouping into named bands mitigates it; acceptable for an expert picker. |
| Discoverability of the 'Custom' escape | **weak** | The explainer says 'pick Custom and tune them yourself' (CharacterPresetCard.jsx:65) but there is NO Custom pill rendered — 'Custom' is just the implicit state when no archetype matches. The copy references an affordance that doesn't visibly exist. |

*Overhaul:*
- **[low]** Either render an explicit 'Custom' pill (active when activeArchetypeKey is null) that opens Fine-tune, or rewrite the explainer to not name a 'Custom' button that isn't there. — _Copy promises a control that doesn't exist; an expert tuning sliders manually has no visible 'I'm in custom' confirmation._ (P11 / recognition)
- **[low]** Cap visual emphasis so this card doesn't out-shout Foundations (currently both are FS.lg/700 serif on parchment-vs-card). — _Per the panel-level focal-point fix._ (P4)


#### PlaceInRegionCard
*File:* `src/components/generate/PlaceInRegionCard.jsx`
*Purpose:* Premium birth-time intent: assign the settlement-to-be to a campaign/region and an optional patron deity; teaser for non-premium.
*Layout today:* Bordered card with gold left-accent, MapPin + 'Place in Region' + 'premium' tag. Non-premium: lock icon + one-line value prop + 'Upgrade' ghost. Premium: two labeled selects (campaign, deity) + a confirmation summary line when either is set.

| Q | Verdict | Finding |
|---|---|---|
| Errors as previews / upgrade framing | **good** | Non-premium sees a value-stating teaser with an Upgrade CTA, not a disabled tombstone (PlaceInRegionCard.jsx:54-68) — limit-as-preview (P9). |
| Empty-state guidance | **good** | Empty campaign/deity lists give next-step copy ('No campaigns yet. Create one in the Realm', 'Author a deity in the Compendium', PlaceInRegionCard.jsx:93-94,109-110) — instructional, not dead. |
| Coherence / trust | **good** | The confirmation line ('On save, this settlement will be offered to X with Y as its patron', PlaceInRegionCard.jsx:115-121) makes the deferred action honest and previewable. Documented byte-identical safety (writes only intent fields). |
| Cohesion with post-generate flow | **weak** | This pre-generate intent (targetCampaignId/primaryDeityRef) is captured before generation, but the post-generate WizardNextSteps 'Place it on your world map' step (WizardNextSteps.jsx:93-96) tells the user to drag from the library — never references the campaign they may have just chosen here. The two 'place in region' moments don't acknowledge each other. |
| Accessibility | **good** | Proper <label htmlFor> on both selects (PlaceInRegionCard.jsx:82,98) — the right pattern the rest of the config panel should copy. |

*Overhaul:*
- **[med]** Thread the chosen campaign/deity into the post-generate close-out: if targetCampaignId is set, WizardNextSteps' map step should say 'Finish placing it in {campaign}' instead of generic drag-from-library guidance. — _Carry shared context forward; an expert who set birth intent shouldn't be told to start placement from scratch._ (P2 / cohesion)


#### PipelineReveal (the emotional peak)
*File:* `src/components/generate/PipelineReveal.jsx`
*Purpose:* The 'this is a real engine, not a roll' moment: a ~2s full-screen overlay narrating the procedural steps the engine just ran.
*Layout today:* Fixed full-screen INK_DEEP overlay, centered 460px gradient panel: 'Forging {name}…' serif gold header, a left-aligned monospace step list (✓/▸/blank glyph + theatrical step label), and a gold progress bar. Advances ~280ms/step, min 2000ms total, role=status aria-live=polite.

| Q | Verdict | Finding |
|---|---|---|
| Peak engineering (P9) | **good** | This is the right artifact for the peak: named, theatrical steps + a deterministic progress bar over a dark stage make the engine's work legible (PipelineReveal.jsx:117-159). The monospace 'receipt' framing reinforces 'simulated, not invented'. |
| Error recovery / power-user fast-path | **broken** | The docstring claims 'Esc dismisses immediately (power-user fast-path)' (PipelineReveal.jsx:27-28), but there is NO keydown/Esc handler in the component — the only exit is waiting out the timed playback or onComplete. A time-pressured GM regenerating repeatedly is forced through 2s each time with no skip. Doc says one thing, code does another. |
| System status / domain language | **good** | Step labels come from copy.pipelineSteps theatrical translations (not function names); unlabeled internal passes are filtered out (PipelineReveal.jsx:56-61). No engine jargon leaks. |
| Match real world / honesty | **adequate** | It's a record+replay of a synchronous run (documented PipelineReveal.jsx:10-14) — honest enough as a feeling, but generate.subline copy 'Watch the pipeline as it runs' (en.js, generate.subline) overpromises live narration the engine can't actually do. |
| Accessibility | **good** | role=status + aria-live=polite announces active steps; progress encoded by glyph (✓/▸) AND color AND bar width — multi-channel. Missing only the focus-trap/Esc that the docstring promises. |
| Width / framing | **good** | 460px capped panel on a full-bleed dark stage — appropriate for a modal peak, reads on tablet (width 90%). |

*Overhaul:*
- **[med]** Implement the Esc-to-skip the docstring already promises, plus a small 'Skip ▸' affordance, and trap focus while the overlay is up. — _A repeat-regenerating GM needs a fast-path; shipping a docstring that lies about Esc is a trust/maintenance hazard._ (P10 / P9 (don't let the peak become friction on repeat))
- **[low]** Soften generate.subline from 'Watch the pipeline as it runs' to language that matches the record-replay reality (e.g. 'Watch the engine retrace its work'). — _Honesty to an audience that will notice the engine is synchronous; coherence is the product._ (P11 / trust)


#### Post-generate state (toolbar + Save + WizardNextSteps)
*File:* `src/components/GenerateWizard.jsx`
*Purpose:* After the reveal: show the dossier, give the GM the runnable result plus the canonical next actions (Back/New, Save, and guidance).
*Layout today:* Sticky dark gradient WizardOutputToolbar (Back / name+tier+pop / New) → Regenerate Draft gold button ABOVE the dossier → OutputContainer (capped to PAGE_MAX) → centered SaveToLibraryButton → WizardNextSteps guidance card → unsaved-exit ConfirmDialog.

| Q | Verdict | Finding |
|---|---|---|
| Runnability / lead with essentials | **weak** | The first thing above the freshly-revealed dossier is a full-width gold 'Regenerate Draft' button (GenerateWizard.jsx:364-385) — i.e. the post-generate peak is immediately topped by a 'throw this away and re-roll' CTA before the GM has read the result. The runnable content should be the hero; Regenerate should be subordinate. |
| Primary CTA discipline | **broken** | This region has multiple high-emphasis primaries competing: full-width gold Regenerate (GenerateWizard.jsx:366), gold 'New' in the sticky toolbar (WizardOutputToolbar.jsx:60-67, styled variant=primary), and the large Save button. Three loud CTAs, no single dominant action — and 'New' (start over) is styled as a primary with a Zap icon, louder than it should be for a destructive-ish reset. |
| Error prevention & recovery | **good** | Unsaved random draft is protected by a ConfirmDialog with domain-accurate wording ('randomly generated, so the exact result won't come back… your configuration is kept', GenerateWizard.jsx:464-472). Correct reversibility warning (P10). |
| Save flow / limits as upgrade | **good** | SaveToLibraryButton renders an active 'Save this town. Free account →' door when the user can't save, stashing a pending intent rather than a disabled control (SaveToLibraryButton.jsx:62-92) — limit-as-conversion. Single canonical save (the duplicate toolbar save was removed, WizardOutputToolbar.jsx:51-58). |
| Close on a runnable detail + one next step (P9 end) | **adequate** | WizardNextSteps gives a numbered, state-aware checklist (save/export/refine/map/another) with a persistent 'Got it' dismiss (WizardNextSteps.jsx:106-185) — a solid end. But it's guidance-only and sits BELOW Save, so the literal end of the flow is a generic checklist rather than an evocative settlement detail. |
| Match real world / map guidance accuracy | **weak** | The 'Place it on your world map' next step says 'Drag it from your library onto the map' (WizardNextSteps.jsx:95) — but if the user hasn't saved yet (and the card shows for can't-save users too), there's nothing in the library to drag; the instruction assumes a state that may not hold. |
| Distinctness / dead-ends | **good** | The settlement-exists-but-navigated-back state (GenerateWizard.jsx:477-530) offers View + a fresh ModeSelector — no dead-end. |

*Overhaul:*
- **[high]** Demote Regenerate from a full-width gold button above the dossier to a subordinate control inside/near the sticky toolbar (outline), so the dossier itself is the post-reveal hero and re-roll is available but not shouting. — _Content is the hero; topping the peak with a 'discard this' CTA undercuts the moment the reveal just earned._ (P1 / P8 / P9)
- **[high]** Establish one primary per region: make Save the single high-emphasis action post-generate; restyle toolbar 'New' as a quiet outline (it's a reset) and drop its Zap icon; keep Back as a gold/secondary. — _Three loud CTAs (Regenerate, New, Save) split the first click; the highest-value action for a just-generated dossier is Save._ (P8 / P11 (style by task importance))
- **[med]** Make the map next-step state-aware: only show 'drag from library' once saved; for unsaved users show 'Save first, then place it on your map'. — _Recognition/recovery — don't instruct an action the user can't yet perform._ (P2 / cohesion)
- **[low]** End the flow on an evocative runnable detail (e.g. echo the settlement's defining tension/hook) above or within the What's-next card. — _Engineer the end (P9) on a memorable, gameable detail, not a generic checklist._ (P9)


#### GenerateWizard anon-in-panel banner (dead/contradictory path)
*File:* `src/components/GenerateWizard.jsx`
*Purpose:* A banner intended to tell an anon user inside the layered panel which tiers are free.
*Layout today:* Gold-left-accent parchment strip: 'Free mode: generating Thorp, Hamlet, or Village. Sign in for all settlement tiers.' rendered when authTier==='anon' inside the pre-generate panel block.

| Q | Verdict | Finding |
|---|---|---|
| Reachability / correctness | **broken** | This banner (GenerateWizard.jsx:303-307) is in the `!settlement && wizardMode` panel block, but anon users can never set a wizardMode through the UI (showModePicker is authTier!=='anon', GenerateWizard.jsx:275; the hero generates instantly setting mode only at generate-time). So the branch is effectively dead — AND its copy 'Thorp, Hamlet, or Village' contradicts the true anon ceiling (town, TIER_GATE.anon.maxTier) and the hero's own 'hamlet/village/town'. A latent, wrong, contradictory string in the funnel. |
| Trust / consistency | **broken** | Three different tier-ceiling statements coexist in this one flow: hero offers hamlet/village/town, this banner says thorp/hamlet/village, the cap copy says 'capped at town size'. P2 cardinal sin (visible contradiction) waiting to surface if the gating ever changes. |

*Overhaul:*
- **[high]** Delete the dead anon-in-panel banner, or if it can ever render, fix its copy to match TIER_GATE.anon.maxTier ('town') and the hero's tier list, sourced from a single shared constant. — _Dead code carrying a contradictory tier claim is a trust landmine; tier ceilings must come from one source._ (P2 / P11)


### Surface: Generated DOSSIER / OUTPUT — the settlement output card rendered by OutputContainer.jsx: dark identity header, owner/visitor actions strip, narrative-layer strip, four thematic group tabs (Summary/Systems/World/Notes), a per-group sub-tab strip, a right-aligned "Detail" altitude control, and the active tab body (Summary V2, Overview, DM Summary, Plot Hooks, Economics, Power, Defense, Services, Substrate, Magic, Resources, Viability, NPCs, History, Daily Life, Relationships/Neighbours, Guidance/DM Compass, DM Notes, AI Notes, Chronicle, Simulation). Live flags dossierFiveTabs / narrativeLayerStrip / summaryMagazineV2 / tableView are all default-ON, so this review targets that configuration as shipped.

**Cross-cutting:**
- FONT SIZE FLOOR IS BROKEN ACROSS THE ENTIRE SURFACE (P7/accessibility, HIGH). The dossier leans on FS.micro=9px, FS.nano=8px, FS.pico=7px and FS['7.5']=7.5px for labels, badges, kind-tags, legends and even some body text (SummaryTabV2 kind label FS['7.5'], PlotHooksTab category label FS['7.5'], NarrativeNote header FS['9.5'], dozens of FS.micro/xxs eyebrow labels). 7-10px text fails AA legibility and is unreadable at arm's length on a phone 'at the table' — directly contradicting the audience's primary use case. Establish a hard floor of ~11px (FS.xs) for any persistent label and ~12-13px for content; reserve pico/nano for nothing user-facing.
- THE IDENTITY OF THE SETTLEMENT IS RENDERED THREE TIMES (P2/P4/P5, HIGH). The dark serif name+tier+pop bar appears in DossierHeaderRow (OutputContainer:617), AGAIN as a parchment header band inside SummaryTabV2 (lines 126-152), and AGAIN as the gradient identity strip at the top of OverviewTab (lines 79-96). On the default Summary group landing the user sees two near-identical headers stacked; switching to Overview shows a third variant. This is wasted vertical space, breaks the single-focal-point rule, and erodes the 'one credible frame' feel. The card-level header should own identity; tab bodies should NOT re-print name/tier/pop.
- TOO MANY TAB SURFACES AND TWO COMPETING NAVIGATION AXES (P1/P4/cognitive load, HIGH). The user faces a group strip (4) + a sub-tab strip (up to 8 in Systems) + a 3-segment altitude control + a narrative-layer strip + an owner-actions strip + per-tab collapsible Sections — six stacked bands of chrome before any content. Systems alone (substrate, magic, services, economics, power, defense, resources, viability) is 8 sub-tabs, far over the 7±2 scan budget and far past 'grab the runnable essentials in one glance'. Consolidate Systems, and collapse the altitude control + narrative strip into the header or a single overflow affordance.
- DEAD CHROME ABOVE THE FOLD ON EVERY READ (P1/P5/P8, MED). Between the header and the first content the owner view always renders: BuyThisDossier + ShareToGallery + SimulationDrawer trigger (OutputContainer:665), a possible WelcomeCreditCard, a PendingChangesBar, the group strip, the 'Detail' altitude row, and the sub-tab strip. Even when all the self-gating children render nothing, the wrapper divs (padding, borderBottom) still paint empty bands (e.g. the actions strip div at :666 always has padding+border). Collapse empty wrappers and move secondary actions (share/buy/simulate) into a single right-aligned action cluster or an overflow menu.
- INFORMATION SCENT ON THE GROUP TABS IS WEAK AND ORDER FIGHTS THE EYE-PATH (P6/P8, MED). Group labels are single generic words ('Summary','Systems','World','Notes') with no icons or counts, while the flat TABS array still carries rich icons that the group strip discards. A GM mid-session scanning for 'who runs this town' can't tell that Power lives under Systems and NPCs under World. Add keyword-bearing labels or icon+count hints, and surface the highest-frequency reads (Power/Factions, NPCs, Plot Hooks) closer to the front.
- COLOR-ONLY SEMANTICS RECUR (P7, MED). Faction power bars (SummaryTab FactionBar), the institution category distribution bar (OverviewTab:298), prosperity/safety/defense status tags, and trade in/out arrows lean on color as the primary or sole channel; small % labels are dropped entirely below 11-12% width (FactionBar line 81, EconomicsTab income bar line 279). Pair every colored state with a glyph/label that survives at the smallest size and never hide the number on the thin segments.
- BOX-SOUP AND NESTED FALSE FLOORS (P5, MED). Almost every block is a bordered, rounded, tinted card with a 3px colored left-border, nested inside the bordered dossier card, inside collapsible Sections that are themselves bordered cards. Tabs like Economics and Overview stack 6-10 such cards with uniform gaps, so grouping is carried by borders not spacing and the squint test yields a wall of boxes. Flatten: let differential spacing + an occasional tint carry grouping; reserve the bordered card + left-border for genuinely semantic callouts (crisis, contradiction).
- LEGACY/LIVE DRIFT IN OutputContainer (P11/trust, MED). The flat TABS array (lines 105-127) and the Simulation tab entry are retained but the live four-group path never renders them as a flat strip; REROLLABLE (line 128) drives a Reroll button in the header keyed on selectedTab even though Reroll only applies to npcs/history; and TAB_GROUPS comments still say 'spec §8 Summary/Systems/World/Notes' / 'name retained even though count is now four'. This is maintenance risk and a source of subtle inconsistency (e.g. the header Reroll button can appear/disappear as you move between sub-tabs). Prune the dead flat-strip path and the soak-killswitch scaffolding now that the flags are default-on.
- ENGINE JARGON AND RAW ENUMS LEAK (P11, MED). 'Substrate' and 'the 15-variable causal substrate' (SubstrateTab) are engine-internal framing, not GM language; tradeRouteAccess values render as raw underscored strings in places; source labels REQ/forced/auto-resolved and a raw '→' appear as institution badges (OverviewTab:313, SummaryTab:410) needing a legend to decode. Rename Substrate to something GM-facing (e.g. 'Pressures' / 'Causal Map'), and humanize enum echoes.
- EMPHASIS-ON-CHANGE IS BURIED (P3, MED). The product's differentiator — deltas after advancing time — is rendered only by WhatChangedPanel deep inside the legacy SummaryTab (line 253) and a RegenerationDeltaCard banner. With summaryMagazineV2 default-ON, SummaryTabV2 is the landing surface and it carries NO what-changed/delta block at all — it shows only static pressure/arrival prose + a cheat sheet. The living-world story is invisible on the default read. Promote deltas/trends to the top of the default Summary when a prior snapshot exists.
- INCONSISTENT NARRATIVE-LAYER CHROME (P4/P11, LOW-MED). The AI/narrative layer is presented through at least four different visual treatments: the violet narrative-layer STRIP under the header, the purple DossierNarrativeBanner above tab content, the NarrativeNote collapsible inside each functional tab, and the purple-tinted Guidance sub-tab. Same concept, four shells, four label phrasings ('Narrative Layer · AI prose pass', 'Narrative Layer: Identity/Lens', 'Narrative Layer', 'Guidance'). Unify to one violet treatment and one label vocabulary.
- EMOJI GLYPHS USED AS LOAD-BEARING UI (P7/P11/accessibility, LOW). '📱 Open in Table View' button (SummaryTabV2:298), '🕯' cheat-sheet icon, and assorted emoji in service/event maps render inconsistently across OS/font and have no text alternative. Replace with the lucide icon set already imported throughout the surface for visual + a11y consistency.


#### Dossier card shell + identity header (DossierHeaderRow)
*File:* `src/components/dossier/DossierHeaderRow.jsx + src/components/OutputContainer.jsx:605-739`
*Purpose:* Frame the whole output as a credible 'dossier' and surface the at-a-glance identity (name, tier, population, trade access, threat, active-stress chip) plus the rename affordance and the narrative-layer action.
*Layout today:* Dark brown gradient bar: serif gold name (editable inline) at left; a wrap row of small meta spans (tier, ·, pop, trade access, threat pill, stress chip); right side holds an optional Reroll button (keyed on selectedTab) and the narrative buttons (only when the strip flag is off or readOnly). Below it: an always-present owner-actions strip, optional credit/pending bars, the group strip, a right-aligned 'Detail' altitude row, then the sub-tab strip.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **adequate** | Name + tier + pop land instantly and the parchment/serif frame reads as a 'dossier' (DossierHeaderRow:41-62). But the takeaway 'who runs this and why is it tense' is NOT in the header — only a generic stress chip; the GM must dig into a tab. |
| Layout & spacing-as-grouping | **weak** | Below the header, OutputContainer stacks 4-6 full-width bands (actions strip :666, altitude row :730, group strip, sub-tab strip) each with its own border/tint, so grouping is carried by borders and the gap rhythm between bands is near-uniform; squinting yields stacked stripes, not chunks. |
| Distinctness from siblings | **good** | The dark serif identity bar is unmistakably the dossier and not Library/Gallery/Realm. |
| Primary CTA discipline | **weak** | The header region has no single primary action: a conditional gold Reroll button (DossierHeaderRow:64) sits beside the narrative button group, and just below, the actions strip presents Buy + Share + Simulation triggers as co-equal — no clear first click. |
| Correct button to function mapping | **adequate** | Reroll is correctly gated to npcs/history via REROLLABLE (OutputContainer:128) but its presence in the HEADER means it appears only on those two sub-tabs and silently vanishes elsewhere, which reads as a layout glitch. |
| Recognition vs recall | **good** | Identity facts are persistent across tabs because the header is outside the tab body (settlement = rawSettlement, OutputContainer:576). |
| Accessibility (POUR) | **weak** | Threat pill uses FS.xs, stress chip FS.xxs (10px) on a dark gradient; gold name on dark passes but the muted-brown meta spans on the dark gradient are borderline. Inline-edit pencil reveals on hover only (recall/keyboard concern noted in EditableInline). |
| Trust/credibility | **adequate** | Looks credible; but comments admit retained dead scaffolding (TABS/Simulation tab/REROLLABLE) and 'name retained even though count is now four' (OutputContainer:81,98) — internal drift that risks future inconsistency. |

*Overhaul:*
- **[high]** Make the header the SINGLE owner of identity and add a one-line 'state line' (e.g. 'Ruled by <faction> · <stability> · <headline tension>') so the 5-second 'who runs it / why tense' answer lives here. — _The skimmer's core question is currently answered only several clicks deep; the header is the highest-value real estate._ (P6 front-load for the scan / P2 causal coherence)
- **[high]** Collapse the owner-actions strip, narrative-layer strip, altitude control and Reroll into ONE right-aligned action cluster (primary = Refine to prose; secondary = Share/Buy/Detail/Simulate in an overflow), removing 3-4 stacked full-width bands. — _Six chrome bands precede content; one calm action cluster restores hierarchy and reclaims the fold._ (P8 one primary action per region / P5 reduce borders)
- **[med]** Move Reroll out of the header into the NPCs/History tab bodies next to their content. — _A header control that appears on only 2 of ~20 sub-tabs reads as a bug and violates placement-by-frequency._ (P8 placement by importance)
- **[med]** Delete the dead flat-TABS strip path, the Simulation tab entry, and the soak-killswitch flag branches now that dossierFiveTabs/narrativeLayerStrip are default-on. — _Live/legacy drift is a trust and maintenance liability; the comments themselves flag the staleness._ (P11 consistency / trust)


#### Group tab strip (DossierGroupTabStrip)
*File:* `src/components/dossier/DossierGroupTabStrip.jsx`
*Purpose:* Top-level navigation across the four thematic groups (Summary / Systems / World / Notes); clicking a group selects its first sub-tab.
*Layout today:* A flex row of four equal-width Buttons (active = gold variant, inactive = ghost), gap 2, padding 4, on a parchment band with a bottom border. Correct WAI-ARIA tablist with roving tabindex + arrow keys.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **adequate** | Four equal buttons read clearly as primary nav, but the single-word labels (DossierGroupTabStrip:54, labels from TAB_GROUPS) give no scent about what's inside ('Systems' could be defense, economy, magic — it's all of them). |
| Design optimality (hierarchy) | **weak** | All four buttons are equal-width and equal-weight; the only active cue is the gold variant — color+weight is fine, but there is no information scent (no icon, no count) and no acknowledgement that Summary is the default/most-used. |
| Distinctness from the sub-tab strip below | **weak** | The group strip (gold/ghost pill buttons on parchment) and the sub-tab strip immediately below (icon+label tabs on near-identical parchment, DossierTabStrip:18) are visually similar two stacked horizontal selectors, which is confusing — two tab rows that look like tabs. |
| Placement by importance | **adequate** | Sits at the top of nav where expected; equal widths waste the serial-position advantage (no emphasis on the most-reached group). |
| Cognitive load | **good** | Four groups is within budget and a sensible reduction of the legacy 14. |
| Accessibility (POUR) | **good** | Proper role=tablist/tab, aria-selected, roving tabindex, arrow/Home/End handling, focus management via requestAnimationFrame (DossierGroupTabStrip:18-35). Button min-height should be checked for 44px touch. |

*Overhaul:*
- **[med]** Differentiate the two strips: render the group selector as a segmented/underlined master row visually distinct from the sub-tab pill row (e.g. larger, with an icon per group), or merge them into one strip with grouped sub-tabs. — _Two near-identical tab rows stacked is the clearest 'where am I' failure on the surface._ (P4 hierarchy / P7 distinctness)
- **[med]** Add a tiny count or representative icon to each group label (e.g. World 12, with a people glyph) for information scent. — _GMs hunting a specific fact need to predict which group holds it._ (P6 information scent)
- **[low]** Confirm each group Button meets ~44px touch height for tablet-at-the-table use. — _size='sm' Buttons may fall below the 44px target._ (accessibility / P12 tablet reflow)


#### Sub-tab strip + Detail/altitude control
*File:* `src/components/dossier/DossierTabStrip.jsx + src/components/common/AltitudeControl.jsx + OutputContainer.jsx:730-749`
*Purpose:* Within-group navigation (the resolved sub-tabs) plus a global progressive-disclosure axis (Overview/Detail/Engine) that gates depth across read surfaces.
*Layout today:* Sub-tab strip: horizontally scrollable row of vertical icon-over-label tabs with left/right chevron scrollers and gradient fades; active tab gets a 2px bottom accent + boxed top/side borders; Guidance tab tinted purple. ABOVE it sits a separate right-aligned band: an uppercase 'Detail' eyebrow + the 3-segment AltitudeControl radiogroup (Overview/Detail/Engine).

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **weak** | The 'Detail' altitude control (OutputContainer:735, AltitudeControl SEGMENTS) is a third selector competing with two tab rows; a new DM cannot tell that 'Overview/Detail/Engine' changes content density vs. navigates, especially since the word 'Overview' also names a Summary sub-tab (TABS:106) — a genuine label collision. |
| Layout & spacing-as-grouping | **weak** | The altitude band, group strip and sub-tab strip are three consecutive full-width bordered bands with similar parchment tints; no spacing rhythm separates 'navigation' from 'density control'. |
| Distinctness / decoy controls | **weak** | With 'Overview' appearing both as an altitude level and a sub-tab, and 'Detail' as both the eyebrow label and a level, the altitude control is a decoy that can draw clicks meant for navigation (intuitiveness/first-click failure). |
| Progressive disclosure | **adequate** | The altitude axis is a sound idea — SubstrateTab/CausalViewTabs genuinely gate on it (SubstrateTab:29) and Substrate is dropped from the strip at 'guided' (OutputContainer:380) so a new DM doesn't land on an empty grid. But its effect is invisible on most tabs, so users won't learn what it does. |
| System status & feedback | **good** | Active sub-tab and active altitude segment both give immediate visual feedback (accent border / gold inset). |
| Accessibility (POUR) | **adequate** | Sub-tab strip is a correct ARIA tablist with roving tabindex (DossierTabStrip:21-47); altitude is role=radiogroup/radio with aria-checked + tooltips (AltitudeControl:33-59). BUT active-tab font FS.xxs (10px) and inactive 500-weight thin label fail the size+weight floor; vertical icon+10px label tabs are small touch targets. |
| Match real world (jargon) | **weak** | 'Engine' as an altitude level and 'Substrate' as a sub-tab leak engine framing; 'Detail' eyebrow + Overview/Detail/Engine is engineer taxonomy, not GM language. |

*Overhaul:*
- **[high]** Rename the altitude levels away from the 'Overview' collision (e.g. Glance / Detail / Full, or a simple density toggle) and physically integrate the control into the header action cluster, not as its own band. — _The 'Overview' double-meaning plus a third stacked selector is the surface's worst first-click hazard._ (P11 domain language / P9 first click lands)
- **[high]** Raise sub-tab label size to >=11px and active weight to >=700, and ensure each tab is >=44px tall for touch. — _10px/500-weight tab labels fail legibility and the at-the-table touch target._ (P4 weight+size / accessibility)
- **[low]** Teach the altitude control once (a one-time inline hint or animating the content when toggled) so its effect is discoverable. — _A density control whose effect is invisible on the current tab will be ignored or misread as broken._ (P10 status & feedback)


#### DM Summary — magazine V2 (SummaryTabV2, default landing)
*File:* `src/components/new/SummaryTabV2.jsx`
*Purpose:* The default 'read this at the table' surface: a 4-sentence identity pitch on the left and a 'Tonight at the table' NPC/Hook/Twist/Red-flag cheat sheet on the right, plus an Open-in-Table-View CTA.
*Layout today:* Parchment header band (name + UPPERCASE tier·pop·trade) over a two-column flex body: left flex 1.2 serif prose ('The town in 4 sentences' eyebrow, italic gold accent line + pressure tail + muted arrival, optional prosperity/stressors line); right flex 0.95 parchment aside ('Tonight at the table' cheat sheet of color-left-bordered cards) with a primary 'Open in Table View' button.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **good** | This is the strongest page on the surface: the left pitch + right cheat sheet maps exactly to skimmer-vs-worldbuilder, and 'Tonight at the table' (line 227) is perfect audience language. |
| Does it fulfill its purpose (runnable essentials first) | **adequate** | Cheat sheet is genuinely runnable, but it depends entirely on tonightAtTheTable() yielding entries; the empty state (line 235) tells the user to 'run the narrative layer', pushing them to a paid/AI step rather than degrading to simulation-derived hooks that already exist (collectPlotHooks). |
| Emphasis on change | **broken** | As the DEFAULT landing (summaryMagazineV2 default-on), this tab shows ZERO deltas/trends. The WhatChangedPanel lives only in the legacy SummaryTab (SummaryTab.jsx:253) which V2 replaces, so on an advanced settlement the living-world differentiator is entirely absent from the first read. |
| Design optimality (hierarchy) | **adequate** | Italic gold accent line is a nice single focal point, but cheat-sheet card titles are FS['11.5'] and KIND labels are FS['7.5'] (lines 264-275) — the most table-relevant text is below the legibility floor. |
| Scannability & content | **good** | Front-loaded eyebrow + bold accent + chunked cards; prose-to-read (serif) is visually distinct from data-to-scan (sans cards). |
| Width & responsive | **weak** | Two-column flex (line 155) has no breakpoint collapse; on a tablet/phone the 1.2/0.95 columns will squeeze the cheat sheet rather than stack, and prose isn't held to a 45-75ch measure inside the wide left column. |
| Distinctness | **weak** | Re-renders a full name+tier+pop header (lines 126-152) duplicating the dossier header directly above it. |
| Accessibility (POUR) | **weak** | FS['7.5'] kind labels (7.5px), emoji '📱'/'🕯' as non-text icons, and color-coded left borders as the kind signal (KIND_ACCENT) with only a tiny same-color text tag as backup. |

*Overhaul:*
- **[high]** Add a 'What changed' delta block at the very top of V2 when a prior snapshot/populationHistory exists (port WhatChangedPanel into the V2 path). — _The default read currently hides the entire living-world value proposition._ (P3 emphasize change)
- **[high]** Make the cheat-sheet empty state fall back to simulation-derived hooks (collectPlotHooks) instead of advertising the AI layer. — _The zero-input path must produce a runnable cheat sheet without paying for narration (P1)._ (P1 content is the hero / P9 turn limits into previews)
- **[high]** Raise cheat-sheet title to >=12px and KIND tags to >=10px with a glyph; stack the two columns below the prose measure on narrow viewports. — _The cheat sheet is read mid-session on a phone — it must survive small screens and arm's length._ (accessibility / P12 reflow)
- **[med]** Remove the duplicated name/tier/pop header band; let the dossier header own identity. — _Two identical headers stacked waste the fold and dilute hierarchy._ (P4 one focal point / P5 spacing)
- **[low]** Replace emoji icons with lucide glyphs already used elsewhere. — _Cross-platform consistency + a11y._ (P7/P11)


#### Overview tab
*File:* `src/components/new/tabs/OverviewTab.jsx`
*Purpose:* The systems-health dashboard: identity recap, active crisis, a Systems Health panel (status tags + score bars + food deficit), tensions/conflicts, arrival/pressure, origin, notable connection, geography, spatial layout, warnings/coherence notes, and the full institutions accordion.
*Layout today:* Tall single column of ~10 stacked bordered/tinted cards and collapsible Sections, top to bottom: identity gradient strip, crisis cards, 'Systems Health' Section (StatusTag row + 2-col ScoreRow grid + food bar), Tensions, dark arrival/pressure card, Origin, Notable Connection, Geography, Spatial Layout accordion, Warnings, Institutions accordion.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **weak** | It opens with a THIRD identity strip (lines 79-96) duplicating the header and Summary; the actual differentiator (Systems Health, line 116) is the 4th block down, so the 5-second takeaway is 'name again' not 'system state'. |
| Layout & spacing-as-grouping | **broken** | This is the worst box-soup on the surface: ~10 bordered cards stacked with near-uniform 14px margins, each with its own border + colored left-border; squinting yields an undifferentiated ladder of boxes (lines 79,99,116,164,192,199,209,216,236,259,283). |
| Does it fulfill its purpose | **adequate** | Systems Health genuinely shows prosperity/safety/viability/defense + score bars + food deficit (the causal state), which is valuable — but it's buried and competes with 9 other cards. |
| Design optimality (hierarchy) | **weak** | No single focal point; every card shouts equally (each has a colored accent border). 'one dominant entry point, ~3 levels' is violated. |
| Emphasis on change | **weak** | Score bars and food deficit are static absolutes; no delta/trend rendering even though this is the natural home for 'food -2, legitimacy down'. |
| Scannability & content | **adequate** | Section titles are keyword-first ('Tensions & Conflicts', 'Geography & Resources'), but ScoreRow labels use empty icon='' (lines 137-141) leaving a stray leading space, and several labels carry stray ', ' fallbacks (StatusTag value default ', ' line 38; sp.safetyRatio fallback line 145) which can render as literal commas. |
| Borders vs whitespace | **broken** | Nested containers everywhere: Sections (bordered card) contain bordered StatusTags and bordered accordions; institutions accordion has its own border inside the card inside the dossier card — at least 3 nested borders. |
| Accessibility (POUR) | **weak** | Heavy FS.micro/FS.xxs label usage; institution source legend (line 331) and category pills rely on tiny color-coded glyphs (REQ/→/✦) at FS.nano (8px). |

*Overhaul:*
- **[high]** Lead the tab with Systems Health as the single focal block; drop the duplicate identity strip entirely. — _The dashboard is the reason to visit Overview; identity is already shown twice above._ (P4 one focal point / P6 front-load)
- **[high]** De-border aggressively: carry grouping with spacing + one subtle tint; reserve bordered cards for crisis/contradiction callouts only. — _~10 nested bordered cards is textbook box-soup that taxes the scan._ (P5 anti-box-soup)
- **[med]** Render score bars as deltas/trends when a prior state exists (show movement, not just the absolute). — _This is the obvious surface for the living-world story._ (P3 emphasize change)
- **[med]** Fix the stray ', ' value fallbacks and empty-icon leading spaces (StatusTag:38, ScoreRow icons, safetyRatio:145). — _Literal ', ' and orphan spaces read as data bugs and erode trust._ (P2 no visible contradiction / trust)


#### DM Summary (legacy SummaryTab, dark-shipped)
*File:* `src/components/new/SummaryTab.jsx`
*Purpose:* The pre-V2 single-column summary: state-at-a-glance bar, identity header with Copy, active crisis, arrival, 3 situation tiles, Faith/War, What-Changed, Power & Conflict, key figures, plot hooks, setting, institutions. Now replaced by V2 in the live path but still mounted when summaryMagazineV2 is off.
*Layout today:* Single column: ReadSystemStateBar, dark identity header with a gold Copy button, crisis cards, arrival card, 3 SitTiles, FaithWarBlock, WhatChangedPanel, Power&Conflict card with FactionBar, Notable Connection, Key Figures grid, collapsible Plot Hooks, Setting accordion, Institutions accordion.

| Q | Verdict | Finding |
|---|---|---|
| Cohesion with the whole flow | **weak** | It contains the valuable WhatChangedPanel (line 253) and a working Copy-to-clipboard export (line 149) that V2 LACKS — so the live default lost two real features in the V2 swap. |
| Does it fulfill its purpose | **good** | As a single dense read it's actually more complete than V2 (power bars, key figures, hooks, copy export all present). |
| Design optimality | **weak** | Same duplicated dark identity header (line 195) as the dossier header; very dense; many FS.xxs/micro labels. |
| Distinctness from V2 | **broken** | Two summary implementations coexist with diverging feature sets gated only by a flag; whichever ships, the other is dead weight and a drift risk. |
| Primary CTA discipline | **adequate** | The gold Copy button is a clear single action in the header region; good. |
| Accessibility (POUR) | **weak** | FactionBar hides % under 11% width (line 81); SitTile/keys use empty icon='' leaving leading spaces; pervasive 10px labels. |

*Overhaul:*
- **[high]** Pick ONE summary implementation; port V2's missing Copy export + WhatChangedPanel into V2 and delete the legacy SummaryTab. — _Two divergent summaries behind a flag is the single biggest correctness/trust risk in the surface — the live default silently dropped Copy and What-Changed._ (P11 consistency / trust)
- **[med]** Always render the FactionBar percentage label (place it outside the segment when the segment is too thin). — _Dropping the number on small factions defeats the at-a-glance power read._ (P7 two channels)


#### Plot Hooks tab
*File:* `src/components/new/tabs/PlotHooksTab.jsx`
*Purpose:* A dedicated Summary sub-tab listing simulation-derived structural hooks (from NPCs, factions, tensions, economy, safety, history, relationships), independent of the AI layer.
*Layout today:* A single 'Plot hooks' Section containing a vertical stack of color-left-bordered cards, each with a serif source title + tiny uppercase category tag + body line.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **good** | Clear, single-purpose, well-labeled; the empty state (line 26) explains provenance, which builds trust. |
| Does it fulfill its purpose (runnable) | **good** | Hooks are simulation-derived and always available — exactly the zero-input runnable content the audience needs. |
| Design optimality / scannability | **weak** | Source title FS['11.5'] is truncated to one line (whiteSpace nowrap, line 52) and the category tag is FS['7.5'] (7.5px) — the two most useful fields are below the legibility floor and the source can be clipped. |
| Distinctness from the Guidance tab | **adequate** | Card styling is nearly identical to the Guidance/Compass hook rows and the V2 cheat sheet; only the purple tint distinguishes Guidance. A GM may not register that one is simulation-derived and one is AI. |
| Borders vs whitespace | **adequate** | Cards-in-a-Section is acceptable here since the list is the content, though the outer Section border + per-card border is one nesting too many. |
| Accessibility (POUR) | **weak** | 7.5px category tag; category meaning carried mostly by left-border color + tiny same-color tag. |

*Overhaul:*
- **[high]** Raise source title to >=13px (and allow wrap), category tag to >=10px. — _These are the scan targets; clipping/7.5px defeats the tab's purpose._ (P4 size+weight / accessibility)
- **[med]** Add a small 'simulation-derived' provenance marker to distinguish from the AI Guidance hooks. — _Coherence/trust depends on the GM knowing what's engine vs. narration._ (P2 / trust)
- **[low]** Flatten the outer Section border (use a heading + spacing). — _List content doesn't need a bordered card around bordered cards._ (P5 anti-box-soup)


#### Economics tab (representative of the Systems content tabs)
*File:* `src/components/new/tabs/EconomicsTab.jsx`
*Purpose:* Deep economic dossier: prosperity header, at-a-glance tiles, income sources, trade profile (exports/imports/neighbour trade/local), food security with balance bar+narrative, economic flows with filters, plot hooks, supply chains, resource exploitation, shadow economy, granary gauge.
*Layout today:* Single very long column of ~10 collapsible Sections and tinted cards: prosperity gradient header, 2 at-a-glance tiles, Income (bars), Trade Profile (2-col grids of pills), Food Security (bar + narrative card), Economic Flows (filter buttons + chain cards), Economic Plot Hooks, Supply Chains, Custom Chains, Resource Exploitation, Shadow Economy, Granary.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test (runnable first) | **weak** | It opens with prosperity + complexity prose, but the most table-relevant economic fact ('can they feed themselves / what's scarce') is several Sections down (Food Security line 369); the tab dumps depth before essentials. |
| Layout & spacing-as-grouping | **weak** | ~10 Sections each a bordered collapsible card, with embedded bordered tiles/pills/cards (chain cards line 95, income bars, trade pills); grouping is all borders, gap rhythm uniform. |
| Progressive disclosure | **good** | Sections default-open intelligently (Food Security opens only on deficit line 369; Flows opens on impairment line 60), which is genuinely good information scent. |
| Emphasis on change | **weak** | All static absolutes (output score, %s); no economic delta even though food/trade are prime living-world signals. |
| Scannability & content | **adequate** | Section titles are keyword-first with counts (good), but trade pills and chain status labels are FS.xxs/micro and use color+tiny-glyph encoding for impaired/vulnerable/critical (FLOW_STATUS line 17, import color logic line 320) with legends required to decode. |
| Borders vs whitespace | **broken** | Chain cards (bordered, left-bordered) inside a bordered Section inside the dossier card; trade-profile pills are bordered inside grid columns inside a bordered Section — multiple nesting levels. |
| Accessibility (POUR) | **weak** | Import/export status is color-first (red=necessity, dark-red=terrain-critical) with the explanatory legend in 10px italic (line 330); income % hidden under 8% width (line 281); pervasive micro labels. |
| Coherence (audience) | **good** | Strong causal coherence: food deficit narrative ties production+import coverage+residual, supply chains link to dependencies, shadow economy cross-refs Defense (line 577) — exactly the visible causality the product needs. |

*Overhaul:*
- **[med]** Promote a 2-3 fact economic summary to the top (prosperity, food balance verdict, top export/critical import) before the deep Sections. — _Runnable essentials must precede the depth dump._ (P1 progressive disclosure / P6 front-load)
- **[med]** Reduce nesting: render chain/trade items as spaced rows with a single status glyph+label rather than fully bordered cards inside bordered Sections. — _Cuts the box-soup that buries the causal story._ (P5 anti-box-soup)
- **[med]** Always show income/faction percentages and pair every status color with a text label at >=11px. — _Hidden numbers + color-only status fail the scan and a11y._ (P7 two channels)


#### Substrate tab (Systems)
*File:* `src/components/new/tabs/SubstrateTab.jsx + CausalViewTabs`
*Purpose:* Expose the 15-variable causal engine (food, legitimacy, defense, trade...), its band 'why' readouts, pressures, and settlement strength — the worldbuilder's trust-verification surface.
*Layout today:* A wrapper that, at 'guided' altitude, shows a one-paragraph explainer hint, and at Detail/Engine mounts CausalViewTabs (the grid + pressures + strength). Dropped from the strip entirely at 'guided' altitude.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **weak** | 'Substrate' / 'the 15-variable causal substrate' (lines 28-37) is engine jargon — a GM won't know this is the trust/why surface from the tab name. |
| Match real world (jargon) | **broken** | The tab name and copy leak the engine model ('substrate', '15-variable', 'pressures') — exactly the internal vocabulary P11 forbids; even the altitude level that reveals it is named 'Engine'. |
| Progressive disclosure | **good** | Smart: hidden at guided (avoids the empty 15-var grid for new DMs, OutputContainer:380), with an Overview hint so it's not a dead end (lines 29-38). |
| Empty state | **good** | The guided-altitude explainer doubles as a graceful empty/teaser state pointing to Detail/Engine and 'watch it move as the world advances'. |
| Distinctness | **adequate** | Functionally distinct (the causal grid is unique), but the name overlaps conceptually with Viability/Overview Systems Health which also describe systemic state. |
| Coherence (audience) | **good** | This is the single best 'verify the simulation hangs together' surface — exposing the variable grid + band-why is exactly what a worldbuilder needs to trust and extend. |

*Overhaul:*
- **[high]** Rename 'Substrate' to GM-facing language (e.g. 'Pressures', 'Causal Map', or 'Why It's Like This') and rewrite the explainer without 'substrate/15-variable'. — _The most trust-building surface is hidden behind the most jargon-y label._ (P11 domain language)
- **[low]** Add a one-line link from Overview's Systems Health and Viability into this tab ('see why →'). — _Connect the static state readouts to the causal explanation surface._ (P2 visible causal coherence)


#### DM Compass / Guidance tab
*File:* `src/components/new/tabs/DMCompassTab.jsx`
*Purpose:* Consolidated AI-narrated DM guidance: adventure hooks, red flags, a twist, identity markers, friction points, and a connections map of named-entity edges.
*Layout today:* Four stacked Sections (DM Compass, Identity Markers, Friction Points, Connections Map), each with an italic explainer line and icon+prose bullet rows; only present when narration produced content; tinted purple in the strip.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **good** | Clear sub-headings ('Adventure hooks', 'Red flags', 'If the session is dragging', line 73) are excellent runnable, audience-native framing. |
| Does it fulfill its purpose (runnable) | **good** | 3 hooks / 2 red flags / 1 twist + drop-in identity markers is precisely the at-the-table kit; section-level graceful degradation (each renders only if populated). |
| Design optimality | **adequate** | Three perceivable levels via Section accents + icon rows; reasonable. Eyebrow labels at FS.xxs (10px) are small but acceptable here. |
| Distinctness from Plot Hooks | **weak** | Both surfaces present 'hooks' in nearly identical card/bullet styling; the only differentiator is purple tint + the word Guidance. Users may not grasp this is the AI layer vs. simulation-derived. |
| Match real world | **good** | Pure GM language throughout (hooks, red flags, twist, friction points). |
| Accessibility (POUR) | **adequate** | Icon+color+label pairing is good; Georgia serif prose at FS['12.5'] is legible; small eyebrow labels are the only weak point. |

*Overhaul:*
- **[med]** Add a clear 'AI narrative layer' provenance banner/badge at the top so this reads as distinct from the simulation-derived Plot Hooks. — _Trust depends on the GM knowing which hooks are engine vs. AI._ (P2 / trust)
- **[low]** Unify hook-card styling decisions with Plot Hooks but keep a single consistent provenance signal (purple = AI everywhere). — _Consistent narrative-layer treatment across the surface._ (P11 consistency)


#### Notes tabs (DM Notes / AI Notes / Campaign Context)
*File:* `src/components/new/tabs/NotesTab.jsx`
*Purpose:* Owner-private prep: a DM Notes scratch space (never sent to AI) and a Campaign Context field woven into narration; persisted per saved settlement.
*Layout today:* Padded column: TabIntro, then one or two bordered sections (DM Notes textarea / Campaign Context textarea + explanatory paragraph), then a primary Save button or a 'save the settlement first' hint.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **good** | Labels + placeholders make the two purposes immediately clear; the privacy distinction is well explained (line 115). |
| Error prevention & recovery | **good** | Unsaved-draft handling reconciles external changes without clobbering edits (lines 38-44); no-saveId shows a graceful 'save first' hint (line 132) instead of freezing. |
| Primary CTA discipline | **good** | Single primary Save button with saving/saved states (line 120-130). |
| System status & feedback | **good** | Save shows 'Saving...'/'Saved' transient feedback. |
| Error messages | **weak** | save() has try/finally but no catch — a failed updateDossierNotes silently resets to 'Save notes' with no error message or retry CTA (lines 55-66), violating plain-language error recovery. |
| Accessibility (POUR) | **good** | Textareas have aria-labels, resize allowed, adequate min-height; eyebrow labels at FS.xxs are small but non-critical. |

*Overhaul:*
- **[med]** Add a catch with a plain-language error + retry to save(). — _A silent save failure loses prep notes with no signal — unacceptable for owner data._ (P10 errors state what to do next)
- **[low]** Surface a subtle 'unsaved changes' indicator while draft differs from saved. — _Zeigarnik open-loop nudge to save before navigating away._ (P10 status / psychology)


#### Chronicle tab (Notes group)
*File:* `src/components/new/tabs/ChronicleTab.jsx`
*Purpose:* The settlement's living-history feed: manual edits, party-caused actions, and world-pulse events merged newest-first, timed from canonization and tagged by source.
*Layout today:* A 'Chronicle (n)' Section with a vertical stack of color-left-bordered rows, each: relative-day label + uppercase title + source chip (PARTY/EDIT/WORLD) + optional summary.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **good** | Chronological, source-tagged feed reads instantly as a timeline; strong empty state (line 27) explains what will appear. |
| Emphasis on change | **good** | This is the surface that DOES honor 'living world' — relative-day timing + party/world/edit provenance is exactly the change-over-time story (lines 41-51). |
| Distinctness | **good** | Timeline-row styling is distinct from the card/pill content tabs; chips give clear provenance. |
| Design optimality / two channels | **good** | Source encoded in BOTH color and a labeled chip with a glyph (⚔ PARTY / EDIT / WORLD) — proper dual-channel. |
| Borders vs whitespace | **adequate** | Bordered rows inside a bordered Section; acceptable for a feed but could rely more on spacing. |
| Accessibility (POUR) | **adequate** | Chips at FS.micro (9px) are small; tabular-nums on the day label is a nice touch but 9px is below the floor. |

*Overhaul:*
- **[low]** Raise chip/label sizes to >=10-11px. — _Provenance chips are the scan targets of the feed._ (accessibility)
- **[low]** Consider grouping by 'recent vs earlier' with a spacing break rather than uniform gaps. — _Goal-gradient/recency: the GM cares most about the latest events._ (P3 / P5)


#### Narrative-layer chrome (strip + banner + per-tab note)
*File:* `src/components/OutputContainer.jsx:636-660 + src/components/dossier/DossierNarrativeBanner.jsx + src/components/new/NarrativeNote.jsx`
*Purpose:* Present and control the optional AI prose refinement: a labeled strip with the primary 'refine' action under the header, an identity/lens banner above tab content, and a collapsible per-tab note.
*Layout today:* Strip: violet-tinted bordered band (eyebrow 'Narrative Layer · AI prose pass' + one-line description + the narrative buttons). Banner: violet gradient band above tab content showing thesis (Summary/Overview) or per-tab lens note. NarrativeNote: violet collapsible card at the top of functional tabs.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test | **adequate** | Violet consistently = AI (good color convention), and the strip clearly offers the refine action; but three different shells for one concept dilute recognition. |
| Primary CTA discipline | **adequate** | The strip isolates a single primary narrative action (good), but it's a 4th action region competing with the header buttons and actions strip. |
| Consistency & conventions | **weak** | Four labels for one layer: 'Narrative Layer · AI prose pass' (strip), 'Narrative Layer: Identity'/'Lens' (banner, DossierNarrativeBanner:43), 'Narrative Layer' (NarrativeNote:43), 'Guidance' (tab). Inconsistent vocabulary. |
| Match real world | **adequate** | NarrativeNote deliberately drops 'AI' to avoid 'hallucination' connotation (good reasoning in its header comment), but the strip still says 'AI prose pass' — internally inconsistent stance on whether to say 'AI'. |
| Borders vs whitespace | **weak** | Strip + banner can both appear for the same tab (Summary/Overview), stacking two violet bordered bands before content. |
| Accessibility (POUR) | **adequate** | Violet-on-parchment contrast for the eyebrow micro labels (FS.micro/['9.5']) should be verified for AA; the ✦ glyph backs the color. |

*Overhaul:*
- **[med]** Collapse to ONE narrative-layer affordance: the strip control + the in-content banner, with a single consistent label ('Narrative Layer') and one decision on whether to say 'AI'. — _Four shells/labels for one concept is the clearest consistency failure on the surface._ (P11 consistency)
- **[low]** Never render both the strip and the identity banner for the same view; pick the banner for content context and keep the action in the header cluster. — _Two stacked violet bands waste the fold and double the chrome._ (P5 / P4)


### Surface: LIBRARY (saved settlements) + settlement detail. Files reviewed on disk: src/components/SettlementsPanel.jsx, src/components/SettlementDetail.jsx, src/components/settlements/{SettlementCard,SaveQuotaMeter,SampleDashboard,SampleCard,CampaignFolder,LibraryBulkBar,BulkActionBar,LivingWorldSignalRow,HealthPip,RealmStrip,helpers}.{jsx,js}, src/components/library/LibraryToolbar.jsx, src/components/settlementDetail/{SettlementDetailNetworkEffectsPanel,SettlementDetailLinkNeighbourCard,SettlementDetailEditNames}.jsx. Theme/Button primitives cross-checked (FS scale: micro 9 / xxs 10 / xs 11; Button variants primary=solid gold, gold=GOLD_BG pale, info=blue, danger=red, ai=violet, secondary=outline).

**Cross-cutting:**
- BOX-SOUP IS THE DOMINANT FAILURE (P5). Both surfaces stack independently-bordered, parchment-tinted cards at a uniform ~12px gap with no differential spacing: the list view (quota meter, toolbar, bulk bar, New Campaign, each folder, each card, the unassigned wrapper) and the edit-mode detail (8 sibling bordered panels). Grouping is carried by borders, not whitespace, producing false floors and a flat rhythm. Fix globally: lead with spacing tiers + background banding, reserve borders for cards whitespace can't carry.
- NO FOCAL POINT / INVERTED CTA HIERARCHY (P4, P8). Across the surface, multiple equal-emphasis buttons compete with no designated primary: the settlement card has 3 gold buttons (Add to Campaign/Canonize/Advance Time) while the true primary (View) is subordinate blue and 4th of 5; the detail header has 3 saturated CTAs (violet Edit / red Export / blue Share) at equal size. Designate ONE primary per region and subordinate the rest to outline/ghost. The card body should be the click target for 'open'.
- FONT SIZES BELOW THE AT-TABLE / AA THRESHOLD (P12, accessibility). Library cards, pip rows, RealmStrip, badges, and network-effect values lean heavily on FS.micro(9) and FS.xxs(10) on a parchment background — too small for an arm's-length mid-session scan and at risk of failing AA contrast for muted/gold text. Raise the floor for any load-bearing fact (ruler, tension, health band) to >=11-12px and reserve 9-10px for truly secondary chrome.
- STATE ENCODED BY COLOR ALONE (P7). Living-world pips, health bands, siege red, relationship dots, the quota bar, and the detail header's hue-coded buttons rely on color as the primary channel with only hover-title backup. Pair every semantic state with a glyph/text label or position and give the quota bar role=progressbar.
- RUNNABLE ESSENTIALS ARE MISSING FROM THE QUICK VIEW (P1, P6, runnability). Neither the library card nor the dossier open foregrounds 'who runs this town and why is it tense' — the audience's core mid-session question. Cards show abstract bands; the dossier drops into a tool-heavy header. Add ruler + one-line causal tension to the card top-left and to a brief runnable summary at the dossier open.
- CHANGE IS INVISIBLE OUTSIDE EDIT MODE (P3). The product's differentiator (causal change over time) only appears in edit-gated panels (Chronicle, RegionalImpactInbox, NetworkEffects). The library cards and read-only dossier show static absolute state with no deltas/trends after an advance. Surface 'food -2 / unrest rising' on cards and expose the chronicle in the read view.
- CROSS-SURFACE COLOR CONTRADICTION (P2). REL_COLORS is duplicated with DIFFERENT values in SettlementCard.jsx:14 and SettlementDetail.jsx:44, so the same relationship type renders one color on the library card and another in the dossier's neighbour list — a visible coherence break. Consolidate into one shared module.
- LABEL->DESTINATION AND ERROR->FRAME MISMATCHES (P10, P11). SaveQuotaMeter 'Sign in' routes to pricing not auth (SettlementsPanel.jsx:667); a real fork generation error opens the purchase modal as if it were a tier gate (SettlementsPanel.jsx:138-143); Apply-Saved-Config regenerates (destroying the current dossier) on one click without a confirm. Make labels do what they say and frame errors honestly with a next-step CTA.
- MISSING PAGE-LEVEL IDENTITY & SEMANTICS (distinctness, accessibility). The list view has no h1/'Library' title and no landmark/heading structure ('Unassigned' is a styled div), weakening 5-second orientation, sibling distinctness vs Gallery, and screen-reader navigation. Add a real page header + semantic headings.
- TOUCH TARGETS UNDER 44px. All sm buttons (the dominant size across cards, toolbars, bars) are minHeight 28 (Button SIZES), below the ~44px guideline for tablet-at-the-table use — the stated usage context.


#### Library list shell (SettlementsPanel list view)
*File:* `src/components/SettlementsPanel.jsx:650-789`
*Purpose:* The Library: a GM's saved settlements, grouped by campaign + unassigned, with the save-quota funnel, search/sort/filter toolbar, bulk-select bar, and the New Campaign control. The hub a GM returns to between sessions to find and reopen a town.
*Layout today:* Single flex column, gap:12, capped at PAGE_MAX. Top to bottom: optional persistenceError alert → SaveQuotaMeter → LibraryToolbar (only if saves>0) → LibraryBulkBar (only in selectMode) → New Campaign button (premium only) → then either a 'Loading saves...' card, the SampleDashboard empty state, or the campaign-folder list followed by the 'Unassigned (n)' group. Every chunk is a parchment-tinted bordered card stacked at a uniform 12px gap.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test: can a GM tell what this page is for, who it's for, and what to do next, and does the intended takeaway land? | **adequate** | The card stack reads as 'my saved towns' and the SaveQuotaMeter labels it, but there is no page H1/title anywhere in the list view (SettlementsPanel.jsx:650 opens straight into a meter). The first thing the eye hits is a quota meter + upgrade pitch, not the GM's own content, so the recalled message skews toward 'pay me' rather than 'your library'. The 'who runs this town / what's tense' takeaway is buried in 9-10px pips lower down. |
| Layout & spacing-as-grouping: do distinct chunks emerge from spacing alone, and are gaps on the scale? | **weak** | The outer gap is a uniform 12 (SettlementsPanel.jsx:651) between every dissimilar chunk — quota meter, toolbar, bulk bar, New Campaign, folders, unassigned — so the rhythm is flat and grouping is carried almost entirely by borders (box-soup), not differential spacing. Within the list, folders and the unassigned group also sit at the same 12 gap, so a campaign and the loose pile read as peers. Hardcoded literals (12, 6, 8, 4) are used directly instead of the SP/space scale that LibraryToolbar correctly uses. |
| Does it fulfill its purpose: can the user complete the primary task (find + reopen a settlement)? | **good** | Yes — search/sort/filter (LibraryToolbar) is wired through a pure applyLibraryFilters pipeline (LibraryToolbar.jsx:76) over filteredIds, folders intersect the filtered set (SettlementsPanel.jsx:730), and each card has a View action. Deep-link + world-map focus open detail correctly (SettlementsPanel.jsx:262-318). |
| Cohesion with the flow: clean handoff before/after, shared context carried forward? | **good** | List→detail is in-component with URL sync (SettlementsPanel.jsx:282-318); onLoad routes a save back into the generate wizard with raw config preserved (SettlementsPanel.jsx:83-97); forkSample generates AND saves then navigates (SettlementsPanel.jsx:120-171). No dead-ends. Advance Time on a standalone card correctly redirects to the campaign popover rather than dying (SettlementCard.jsx:181-184). |
| Plays on human psychology (peak/end, Zeigarnik, recognition, goal-gradient)? | **adequate** | SaveQuotaMeter's free meter is a goal-gradient nudge (SaveQuotaMeter.jsx:68-75) and SampleDashboard avoids the empty void. But there is no Zeigarnik hook for unfinished drafts (a draft and a canon save look near-identical save for a tiny badge) and no peak/end moment on returning to the library — the highest-value recall ('which town is on fire') is not engineered to the top. |
| Design optimality: hierarchy from >=2 of {size,weight,color}, <=3 levels, one focal point? | **broken** | There is no focal point. The quota meter, toolbar, New Campaign (variant gold, size md), and every card title (FS.md/700) compete at similar weight. Under a squint the page is an even grid of parchment boxes. The intended hero — the settlements — does not dominate its own page because the funnel chrome sits above it at equal visual weight. |
| Distinctness from siblings (Library vs Gallery vs Compendium vs Realm)? | **weak** | With no page title and a generic stack of tinted cards, the list view is not strongly differentiated from Gallery (also a card stack of settlements). The only distinguishing element is the quota meter; the parchment-card-stack idiom is shared, risking 'where am I' confusion. |
| Placement of every element by importance & purpose? | **weak** | The save-quota/upgrade funnel occupies the most valuable real estate (top, first-read) above the user's own content (SettlementsPanel.jsx:662). Per serial-position the high-value items (the GM's towns) should anchor the top; the monetization frame is hoisted above them on every visit, which is a soft dark-pattern placement. |
| Intuitiveness & first click obvious? | **adequate** | For 'reopen a town' the per-card View is findable but is styled info/blue (subordinate) and sits 4th in a 5-button cluster, so it does not read as the primary first click. For 'make a new settlement' there is NO control here at all — the comment at SettlementsPanel.jsx:692-695 confirms saving/creation moved to the generate flow, leaving the Library with no path to its sibling primary task. |
| Correct button->function mapping, shared name/icon? | **good** | Controls map correctly; shared DeleteConfirmation, shared Button primitive, consistent lucide icons. New Campaign uses FolderPlus (SettlementsPanel.jsx:711) consistent with FolderOpen elsewhere. |
| Primary CTA discipline: one high-emphasis primary per region? | **broken** | The list region has no single primary; New Campaign is variant gold size md (SettlementsPanel.jsx:711) and each card carries up to three gold buttons (see card page). Multiple equal-emphasis gold CTAs per screen with no dominant one. |
| System status & perceived speed? | **good** | savesLoading shows a labeled card (SettlementsPanel.jsx:719); fork shows per-card busy/'Generating…' (SampleCard.jsx:71); persistence failures roll back and surface a domain-language alert (SettlementsPanel.jsx:338). No bare spinners on the list. |
| Match real-world domain language (no engine jargon)? | **good** | List-level copy is GM-native (campaign, settlement, canon, neighbour). No seed/RPC/worldPulse/partialize leaks at this level. |
| Error prevention & recovery? | **good** | Deletes are confirmed (DeleteConfirmation), bulk delete is one coherent batch (computeBulkDelete, helpers.js:65), persistBatch rolls back optimistic state and restores the open detail on failure (SettlementsPanel.jsx:320-339). |
| Error messages: plain-language what+next with CTA? | **adequate** | persistenceError and reactivationError are plain-language (SettlementsPanel.jsx:338, 225) but state only what went wrong, not a next step or a retry CTA. The reactivation copy ('Choose an inactive settlement after freeing one of your three free slots') is instructive but has no actionable button. |
| Recognition vs recall? | **adequate** | Cards show name/tier/time/links/health so recognition is decent, but campaign membership of an unassigned card and the meaning of dense pip rows require recall of the legend; nothing on-page decodes 'War-weary' / 'Strained' bands inline beyond a hover title. |
| Scannability & content: keyword-first headings, bold facts, prose distinct from data? | **weak** | The only heading in the list is 'Unassigned (n)' (SettlementsPanel.jsx:765); campaign folders carry names but there's no information-bearing section structure and no 'Library' heading. Facts are scannable inside a card but the page lacks a layer-cake skeleton. |
| Cognitive load & choices (7+-2)? | **weak** | A populated library presents the quota meter + a 4-control toolbar + 7 filter chips + New Campaign + per-card 5-button clusters simultaneously. The combined control count on first paint comfortably exceeds 7+-2 before the user sees a single town's content. |
| Progressive disclosure? | **good** | Filters are correctly hidden behind a Filters disclosure (LibraryToolbar.jsx:249) and bulk bar only appears in selectMode. Sensible default face. |
| Borders vs whitespace (anti-box-soup)? | **broken** | Every chunk is its own bordered+tinted card (meter, toolbar, bulk bar, each folder, each settlement card, the unassigned wrapper), stacked at uniform 12 — textbook box-soup with no flattening and no whitespace-led grouping. The colored left-border semantic convention (used on SampleCard.jsx:17) is not applied to real saves. |
| Emphasis on change (deltas/trends as focal)? | **weak** | Cards show absolute living-world pips (LivingWorldSignalRow) and a health band, but no deltas/trends — there is no 'food -2' or 'unrest rising' since last advance. The product's differentiator (change over time) is invisible in the library; only static state shows. |
| Empty state: explains what appears + one-click sample/template? | **good** | SampleDashboard replaces the void with three forkable seeds and instruction+delight copy (SampleDashboard.jsx, SampleCard.jsx). Strong empty state — among the best surfaces here. |
| Accessibility (POUR): contrast, 2-channel state, keyboard, 44px, ARIA, semantics? | **weak** | List shell has no h1/landmark structure; 'Unassigned' is a styled div not a heading (SettlementsPanel.jsx:764). Heavy reliance on FS.micro(9)/xxs(10) text on parchment risks failing AA body contrast/legibility at the table. New Campaign input autofocuses (acceptable) but the list has no skip structure. sm buttons are minHeight 28 (Button SIZES) — under the ~44px touch target. |
| Consistency & conventions? | **adequate** | Internally consistent with the app's parchment idiom, but the search field uses a literal emoji magnifier (LibraryToolbar.jsx:196) instead of a lucide Search icon used everywhere else — a small convention break. |
| Trust/credibility? | **good** | Living-world pips reuse the dossier read-models (settlementSignals/healthPip), so library state can't contradict the dossier — a real coherence win. No typos spotted in list copy. |
| Width & responsive? | **good** | Routed through PAGE_MAX (SettlementsPanel.jsx:651); single column that reflows naturally. Toolbar/meter flex-wrap. No full-bleed. |
| Cognitive walkthrough per step? | **adequate** | Find→open works, but a returning GM forms the goal 'open the town that's at war' and the page gives no prioritized entry — they must scan every card's pip row. The 'Needs attention' sort exists (LibraryToolbar.jsx:50) but is not the default, so the right control isn't surfaced for that goal. |
| Runnability: grab essentials at a glance before deep detail? | **adequate** | Card-level essentials (name, tier, links, health, war) are present but compressed into <=10px pips; a time-pressured GM cannot scan ruler/tension at arm's length. The quick-reference exists but is undersized and de-prioritized below the funnel. |
| Coherence: internally consistent, named entities match across surfaces? | **good** | Rename cascades into neighbours' interSettlementRelationships (SettlementsPanel.jsx:358-401) and delete cleans both sides of links (helpers.js:65-79), so cross-settlement names stay consistent — the cardinal-sin contradiction is actively prevented. |

*Overhaul:*
- **[high]** Add a real page header: an h1 'Library' (serif) with a one-line subtitle and a single primary 'New Settlement' CTA that routes to the generate flow; demote the SaveQuotaMeter to a slim line BELOW the header (or right-aligned in it), never the first-read element. — _The GM's own content must own the top of their own page; the monetization frame should frame, not lead. Restores a focal entry point and gives the Library a path to its sibling primary task it currently lacks._ (P1)
- **[high]** Replace uniform 12px stacking with a spacing hierarchy: large gap (space between meter/header and the list), tight gap within a folder's cards, medium between folders; drop the bordered wrapper on the 'Unassigned' group and let whitespace + a real heading carry it. — _Spacing-as-grouping eliminates box-soup and lets chunks emerge under a squint without escalating borders._ (P5)
- **[med]** Make the settlement list the focal layer: lighten/flatten meter+toolbar chrome (tint only, no full border) so that under blur the row of town cards is what survives as dominant. — _One focal point per view, built by de-emphasizing neighbors rather than escalating content._ (P4)
- **[med]** Default the sort to 'Needs attention' (or add a persistent 'X towns need attention' banner that filters on click) so the returning-GM goal 'open the town that's tense' has a surfaced control. — _Match the dominant in-session goal to the first available control; lead with anomalies._ (P3)
- **[med]** Promote a colored left-border semantic on each save card (e.g. red=at-war/crisis, gold=canon, neutral=draft) mirroring SampleCard's gold rail, so phase/crisis is a second channel readable at a glance. — _Two-channel state encoding + scannable serial position for the at-table skim._ (P7)
- **[low]** Replace the emoji magnifier with the lucide Search icon and give error alerts an actionable CTA (Retry on persistence failure; a direct 'Manage slots' link in reactivation copy). — _Cross-surface icon consistency and recovery with a next step._ (P11)


#### Save-quota meter + funnel header
*File:* `src/components/settlements/SaveQuotaMeter.jsx:36-97`
*Purpose:* Show the GM their save usage and pitch the simulation as the premium product (explicitly NOT a size gate).
*Layout today:* A single parchment row: Save icon + tier-dependent label (left, flex:1), a thin progress bar (free only), then a Sparkles premium-pitch chip + Upgrade button (free) / Sign in (anon) / nothing (premium).

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test? | **good** | 'N of 3 saves used' + meter + pitch reads instantly as a quota+upgrade row (SaveQuotaMeter.jsx:61-90). Clear who/what. |
| Layout & spacing-as-grouping? | **good** | Single coherent flex row, gap:12/8, wraps cleanly; one chunk, no internal ambiguity. |
| Does it fulfill its purpose? | **good** | Counts, meter fill, and upgrade/sign-in CTAs all present and wired (onUpgrade/onSignIn). |
| Cohesion with flow? | **adequate** | onUpgrade and onSignIn BOTH route to 'pricing' (SettlementsPanel.jsx:666-667) — an anon user clicking 'Sign in' lands on Pricing, not an auth flow, a label->destination mismatch. |
| Plays on psychology? | **good** | Bar turns danger-red at the cap (SaveQuotaMeter.jsx:72), a clean goal-gradient/scarcity cue without a dark pattern (it caps count, honestly states it's not a size gate). |
| Design optimality? | **adequate** | Two-ish levels (bold count vs muted label); fine in isolation but as the page's first element it over-weights monetization relative to the towns below. |
| Distinctness? | **good** | Distinct single-row component, not confusable with a card. |
| Placement by importance? | **weak** | Correct internally, but the component as a whole is mis-placed at the very top of the Library (see list-shell finding) — the funnel outranks the content. |
| Intuitiveness & first click? | **good** | Upgrade/Sign in are the obvious clicks for this row. |
| Button->function mapping? | **weak** | 'Sign in' maps to onSignIn which is wired to pricing, not sign-in (SettlementsPanel.jsx:667). The label promises auth; the function opens pricing. |
| Primary CTA discipline? | **good** | One gold CTA per state (Upgrade or Sign in). |
| System status? | **good** | Bar width transitions; immediate state. |
| Domain language? | **good** | PREMIUM_PITCH names the simulation, never size (SaveQuotaMeter.jsx:25). On-brand. |
| Error prevention? | **good** | N/A — read-only presentational. |
| Error messages? | **good** | N/A. |
| Recognition vs recall? | **good** | All needed info inline. |
| Scannability? | **good** | Bold count, short pitch, scannable. |
| Cognitive load? | **good** | Minimal. |
| Progressive disclosure? | **good** | Premium hides the meter entirely; appropriate. |
| Borders vs whitespace? | **adequate** | Its own bordered tinted card adds to the stack's box-soup; could be a borderless tinted strip. |
| Emphasis on change? | **good** | N/A for a quota meter. |
| Empty/zero state? | **good** | Anon variant 'Sign in to save' handles zero slots. |
| Accessibility? | **weak** | The meter bar conveys fill via color/width only with no text/ARIA value (SaveQuotaMeter.jsx:69-73) — the 'N of max' text nearby partly mitigates, but the bar itself is single-channel and has no role=progressbar/aria-valuenow. |
| Consistency & conventions? | **good** | Uses shared Button, theme tokens, lucide icons. |
| Trust/credibility? | **good** | Honest framing ('NOT a size gate' enforced in copy + test hook). |
| Width & responsive? | **good** | flexWrap, minWidth guards. |
| Cognitive walkthrough? | **adequate** | Free user understands and can act; anon user is misled by Sign in->pricing. |
| Runnability? | **good** | N/A. |
| Coherence? | **good** | Consistent tier model. |

*Overhaul:*
- **[high]** Route onSignIn to the actual auth/sign-in flow, not pricing (fix at SettlementsPanel.jsx:667). — _The control must do what its label promises._ (P11)
- **[med]** Add role=progressbar + aria-valuenow/min/max to the meter bar and a glyph/textual cap indicator so the 'at cap' state is 2-channel, not color+width alone. — _Never let color be the sole carrier of a state._ (P7)
- **[med]** Demote to a borderless tinted strip and relocate beneath the new page header (per list-shell overhaul). — _Reduce box-soup and stop the funnel from outranking content._ (P5)


#### Settlement card + action cluster
*File:* `src/components/settlements/SettlementCard.jsx:42-227`
*Purpose:* The atomic library row: identify a saved town at a glance (name, tier, age, links, living-world + health pips) and act on it (open, campaign, canonize, advance time, delete).
*Layout today:* A bordered rounded card; left: optional select checkbox + a content column (name+health pip row, time/tier sub-row, living-world pip row, retained badge, neighbour chips, network-effect badges, regional-count badges). Right: a flex cluster of up to FIVE buttons — Add to Campaign/Move (gold), Canonize (gold) or Canon marker, Advance Time (gold), View (info/blue), Delete (danger). DeleteConfirmation expands below on demand.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test? | **adequate** | Name + tier land fast, but the most table-relevant facts (who rules, why it's tense) are not present at all — the card shows health/war pips but no ruler name and no causal one-liner. Identity lands; runnable state is thin. |
| Layout & spacing-as-grouping? | **weak** | The content column stacks five potential pip/badge rows (SettlementCard.jsx:60-114) at marginTop 1-4 each — a dense uniform drizzle with no grouping between 'identity' and 'living-world' and 'network' tiers. The right action cluster is a flat gap:4 row. |
| Does it fulfill its purpose? | **good** | All actions function; View opens detail, campaign/canonize/advance/delete all wired with correct guards (active checks throughout). |
| Cohesion with flow? | **good** | Advance Time on a standalone card opens the move-to-campaign popover instead of dead-ending (SettlementCard.jsx:181-184); View carries saveData into detail. |
| Plays on psychology? | **weak** | No serial-position emphasis (all cards equal), no Zeigarnik cue distinguishing an unfinished draft, no recognition aid for which town needs action. The card is a flat record, not a prioritized cue. |
| Design optimality? | **broken** | The action cluster is THREE gold buttons (Add to Campaign, Canonize, Advance Time) + one blue + one red, ALL size sm, all equal weight (SettlementCard.jsx:119-213). There is no primary; the actual primary action (View/open) is the blue, visually subordinate to three gold buttons. Hierarchy fails the squint test — the cluster is a wall of equal chips. |
| Distinctness? | **good** | Distinct card idiom; inactive/retained variant visually differs (opacity 0.68, grey border). |
| Placement by importance? | **broken** | Delete (destructive) sits at the far right end of the row at the SAME size and adjacency as View (SettlementCard.jsx:205-213) — destructive should be smaller/separated. The everyday primary (View) is 4th of 5 and de-emphasized; campaign-management actions a GM uses rarely are gold and dominant. |
| Intuitiveness & first click? | **weak** | For 'open this town' the eye is pulled to the three gold buttons first; View (blue, 4th) is a decoy-laden target. Worse, clicking the card body does NOT open it — only the small View button does. |
| Button->function mapping? | **adequate** | Labels map correctly, but 'Advance Time' on a standalone card doesn't advance time — it opens the campaign popover (SettlementCard.jsx:182). Justified, but the label over-promises for a settlement not in a campaign. |
| Primary CTA discipline? | **broken** | Three gold buttons per card = three competing high-ish-emphasis CTAs. View (the true primary) is styled as subordinate info. Inverted CTA discipline. |
| System status? | **good** | Reactivate shows busy/'Restoring…' (SettlementCard.jsx:199-202); disabled states on inactive saves are clear. |
| Domain language? | **good** | Canonize, campaign, neighbour, tier — all GM-native. Tooltips explain canonize consequences (SettlementCard.jsx:158). |
| Error prevention? | **good** | Delete is confirmed with link-cascade warning (SettlementCard.jsx:216-224); canonize is reversible and tooltip-warned. |
| Error messages? | **good** | N/A at card level. |
| Recognition vs recall? | **weak** | Pip colors (war red, faith violet, health bands) require recalling a legend; no inline labels beyond hover titles. A glance can't decode 'this pile of colored chips' without memory. |
| Scannability? | **weak** | Up to 5 micro-text (9px) badge rows compete; the name (FS.md/700) is the only strong anchor. No top-left runnable fact beyond the name; ruler/tension absent. |
| Cognitive load? | **weak** | 5 action buttons + up to 5 badge rows per card; multiplied across a populated library this is heavy. The action set should collapse rare actions into an overflow menu. |
| Progressive disclosure? | **weak** | All five actions are always visible; campaign/canonize/advance (premium, infrequent) should hide behind an overflow or move into detail, leaving View + Delete + a kebab. |
| Borders vs whitespace? | **adequate** | The card border is earned, but the move popover and delete confirm add nested chrome; badge chips each carry their own border (SettlementCard.jsx:74,90,99) creating chip-soup within the card. |
| Emphasis on change? | **weak** | Pips show current state, never deltas. After an Advance Time the card should foreground 'food -2 / unrest rising'; it shows only the new absolute band. |
| Empty state? | **good** | N/A (card always has data); a peaceful card correctly shows no living-world row (LivingWorldSignalRow self-gates). |
| Accessibility? | **weak** | Pip meaning is color+hover-title only (LivingWorldSignalRow text labels help, but health pip 'Stable' etc. rely on tiny 9px color text). sm buttons minHeight 28 < 44px touch. Checkbox has aria-label (good). Card is not a single focusable/clickable region — only sub-buttons are reachable. |
| Consistency & conventions? | **adequate** | REL_COLORS duplicated here (SettlementCard.jsx:14) AND in SettlementDetail.jsx:44 with DIFFERENT values (card: rival #8b1a1a, patron #2a3a7a; detail: rival #8a5010, patron #4a1a6a) — the same relationship renders a different color in the card vs the dossier, a cross-surface inconsistency. |
| Trust/credibility? | **good** | Pips reuse dossier read-models so card state matches the dossier; no contradiction. |
| Width & responsive? | **adequate** | Content column has minWidth:0 + ellipsis (good), but a 5-button cluster + checkbox can crowd narrow widths; the cluster doesn't collapse responsively. |
| Cognitive walkthrough? | **weak** | Goal 'open town' -> the obvious-looking targets (gold) are the wrong ones; the right one (View) is subordinate. The mapping from goal to control is mis-cued. |
| Runnability? | **weak** | A GM cannot grab 'who runs it / why it's tense' from the card — no ruler, no one-line tension cause. Only abstract bands. The runnable essential is missing from the at-a-glance row. |
| Coherence? | **adequate** | State is coherent with the dossier, but the relationship-color divergence (above) is a visible contradiction between card and detail for the same link. |

*Overhaul:*
- **[high]** Collapse the action cluster to ONE primary (View — make it the high-emphasis action, or make the whole card body the click target) + Delete demoted to a small ghost/icon button separated by a spacer; move Add to Campaign / Canonize / Advance Time into a kebab overflow menu. — _One unambiguous primary per region, destructive small+separated, rare actions disclosed on demand._ (P8)
- **[high]** Add the runnable essentials to the card top-left: the ruling NPC/faction name and a one-line causal tension ('Food deficit + contested legitimacy') beside the name. — _Lead with the at-the-table fact the skimmer hunts mid-session._ (P6)
- **[high]** Unify REL_COLORS into one shared module imported by both SettlementCard and SettlementDetail (and Workshop), eliminating the card-vs-dossier color divergence. — _A named relationship must look identical across surfaces; visible contradiction is the cardinal sin._ (P2)
- **[med]** Group the content column into two spacing tiers (identity block tight; living-world/network block separated by a larger gap) and cap badge rows — fold network-effect + regional badges behind a '+n effects' affordance. — _Spacing-as-grouping and 7+-2 to tame the badge drizzle._ (P5)
- **[med]** After an advance, render deltas on the card (e.g. 'unrest rising', 'food -2') as the focal pip rather than only the new band. — _Emphasize change — the product's differentiator._ (P3)
- **[med]** Add inline text labels (not just hover titles) or a persistent legend for health/war/faith pips, and raise pip text off 9px. — _Two-channel encoding + AA legibility at the table._ (P7)


#### Campaign folder + RealmStrip
*File:* `src/components/settlements/CampaignFolder.jsx:78-195`
*Purpose:* Group a region's settlements, surface its 'state of the realm' (in-world clock, sieges, dominant faith, news recency), and offer campaign-level actions (advance time, export PDF, rename, delete).
*Layout today:* Rounded card. Header strip (tinted): collapse chevron, FolderOpen, name (or inline rename), settlement count, map icon, then Advance Time (gold) + PDF (danger) + Edit/Delete icon buttons. Below (when expanded): RealmStrip (self-hides if dormant), optional pdf error, delete confirm, RegionalGraphSummary, then nested SettlementCards.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test? | **good** | FolderOpen + name + 'N settlements' + RealmStrip clock reads instantly as a campaign region (CampaignFolder.jsx:81-138). |
| Layout & spacing-as-grouping? | **adequate** | Header/realm-strip/regional-summary/cards are separated by borders and bg tints rather than spacing; nested cards sit at gap:4 (CampaignFolder.jsx:167) which is appropriately tighter than the outer 12 — one of the few correct spacing contrasts. |
| Does it fulfill its purpose? | **good** | Collapse, rename, advance, export, delete, regional impacts all wired. |
| Cohesion with flow? | **good** | Advance Time deep-links to the World Map Wizard-News workspace (SettlementsPanel.jsx:466-474); disabled with explanatory tooltip until the world is canonized (CampaignFolder.jsx:105-108). |
| Plays on psychology? | **good** | RealmStrip's clock + siege count + news-recency create a living-world peak ('3 sieges, news this tick') that rewards opening the folder. |
| Design optimality? | **adequate** | Header has two button colors (gold advance, red PDF) + two icon buttons; reasonable, though Advance Time (gold) and PDF (red) read as co-equal CTAs when advance is the primary campaign action. |
| Distinctness? | **good** | Clearly a container, distinct from a settlement card via the header strip + RealmStrip. |
| Placement by importance? | **adequate** | Advance Time first is correct, but PDF (a rarer action) is given danger-red prominence equal to it; Delete is an icon button correctly demoted. |
| Intuitiveness & first click? | **good** | Collapse chevron and Advance Time are obvious; rename via pencil is conventional. |
| Button->function mapping? | **good** | All map correctly; PDF lazy-loads with busy/error feedback (CampaignFolder.jsx:36-48). |
| Primary CTA discipline? | **adequate** | Advance Time should be the sole gold primary; PDF being danger-red competes for emphasis. |
| System status? | **good** | PDF shows 'Exporting…' and a role=alert error row (CampaignFolder.jsx:118,127-134). |
| Domain language? | **good** | Realm, siege, tick, season/year, dominant faith — rich GM/TTRPG language (RealmStrip.jsx). |
| Error prevention? | **good** | Delete confirms and clarifies settlements become unassigned, not deleted (CampaignFolder.jsx:144). |
| Error messages? | **good** | PDF error states what failed with a retry implication (CampaignFolder.jsx:44). |
| Recognition vs recall? | **good** | RealmStrip surfaces clock/sieges/faith inline so the GM needn't recall campaign state. |
| Scannability? | **good** | RealmStrip is a clean labeled-segment row with bold values (RealmStrip.jsx:112-136). |
| Cognitive load? | **adequate** | Header is dense (count + map icon + 2 buttons + 2 icon buttons) but acceptable for a container. |
| Progressive disclosure? | **good** | Collapse hides the whole body; RealmStrip and each segment self-hide when dormant/empty. |
| Borders vs whitespace? | **weak** | Nested containers stack: folder border > header strip border-bottom > RealmStrip border-bottom > RegionalGraphSummary (its own chrome) > cards (each bordered). Multiple false-floor border lines before reaching content. |
| Emphasis on change? | **good** | RealmStrip leads with news-recency and siege count — genuine change/anomaly signals (RealmStrip.jsx:117-136). |
| Empty state? | **good** | Empty campaign shows italic 'No settlements yet. Use the arrow button to move settlements here' (CampaignFolder.jsx:169). |
| Accessibility? | **adequate** | Collapse/rename/delete are IconButtons with labels; RealmStrip segments convey via icon+text (good 2-channel). But siege red vs muted is partly color-led, and FS.xxs(10) text dominates the strip. |
| Consistency & conventions? | **good** | Uses shared IconButton/Button/DeleteConfirmation; collapse chevron convention honored. |
| Trust/credibility? | **good** | RealmStrip reuses warStatus/pantheon read-models so realm state matches the dossiers (RealmStrip.jsx:93-94). |
| Width & responsive? | **good** | Header flexes; strip wraps. |
| Cognitive walkthrough? | **good** | Canonize-then-advance gating is explained inline so the GM forms the right next-step goal. |
| Runnability? | **good** | RealmStrip is genuinely runnable-at-a-glance for the region (clock + sieges + faith). |
| Coherence? | **good** | Dominant-faith/siege derivations are shared with the dossier/map; consistent naming. |

*Overhaul:*
- **[med]** Make Advance Time the single gold primary in the header and re-style PDF as a subordinate secondary/ghost (it's not destructive — danger-red is the wrong semantic). — _One primary per region; style by task importance, not by visual loudness._ (P8)
- **[med]** Flatten the nested border lines: drop the RealmStrip and header border-bottoms in favor of background-tint banding, so there are not 3-4 horizontal rules before the first card. — _Anti-box-soup; remove false floors._ (P5)
- **[low]** Raise RealmStrip text from FS.xxs(10) and ensure siege/no-siege uses an icon-state (not just red vs muted). — _Legibility + 2-channel state for the at-table scan._ (P7)


#### Library toolbar (search/sort/filter/select)
*File:* `src/components/library/LibraryToolbar.jsx:162-328`
*Purpose:* Let a GM find a settlement (search across saves/NPCs/factions), reorder, filter by phase/structure/living-world/campaign, and toggle bulk-select.
*Layout today:* A wrapping tinted card: search field (flex), Sort select, Filters disclosure button, Select toggle, result count (right). Filters expand into a full-width chip row (Canon/Draft/Pending edits/Linked/At war/Has deity/In crisis + campaign select + Clear).

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test? | **good** | Search + Sort + Filters + Select is an instantly recognizable list toolbar. |
| Layout & spacing-as-grouping? | **good** | Uses the SP/R scale (LibraryToolbar.jsx:179-186); filter panel separated by a top border + flexBasis 100% (clean wrap). |
| Does it fulfill its purpose? | **good** | Pipeline is pure and complete: search spans NPC/faction names (LibraryToolbar.jsx:89-95), all chips wired including previously-orphaned draftOnly/hasPendingEdits. |
| Cohesion with flow? | **good** | Output feeds filteredIds which the folders + unassigned list intersect, so the toolbar truly drives what renders. |
| Plays on psychology? | **good** | 'Needs attention' sort + 'In crisis' filter give the GM a fast path to the salient towns. |
| Design optimality? | **adequate** | Filters/Select use variant gold when active vs secondary — clear 2-state; but the active chips use four different variants (success/gold/danger) which is meaningful (phase vs living-world) yet borders on a rainbow under the squint. |
| Distinctness? | **good** | Unmistakably a toolbar, distinct from cards. |
| Placement by importance? | **good** | Search (most frequent) takes flex priority; rare filters hidden behind disclosure; count right-aligned. |
| Intuitiveness & first click? | **good** | Search field is the obvious first target. |
| Button->function mapping? | **good** | Sort/filter/select all map correctly; aria-expanded/aria-pressed set. |
| Primary CTA discipline? | **good** | No competing CTAs; toolbar controls are appropriately equal-weight utilities. |
| System status? | **good** | Result count updates live ('N of total · M filters', LibraryToolbar.jsx:278-281). |
| Domain language? | **good** | Canon/Draft/At war/Has deity/In crisis — GM-native filter labels. |
| Error prevention? | **good** | Clear filters + Clear search both present; no destructive controls. |
| Error messages? | **good** | N/A. |
| Recognition vs recall? | **good** | Active filter count badge + per-chip aria-pressed make state recognizable. |
| Scannability? | **good** | Compact, chunked; disclosure keeps default face clean. |
| Cognitive load? | **adequate** | 7 filter chips + campaign select is at the top of 7+-2; acceptable behind disclosure. |
| Progressive disclosure? | **good** | Exemplary — filters hidden by default, revealed on demand (LibraryToolbar.jsx:249-258,285). |
| Borders vs whitespace? | **good** | Single toolbar card; filter panel divided by one top border. Restrained. |
| Accessibility? | **weak** | Search icon is a literal emoji '🔍' (LibraryToolbar.jsx:196) — inconsistent with lucide elsewhere and read aloud oddly by SR; select controls lack visible focus styling beyond browser default; chip text at FS.xs(11). |
| Emphasis on change? | **good** | N/A — but enabling crisis/at-war filtering is the change-surfacing affordance. |
| Empty state? | **adequate** | No 'no results match your filters' message when filtering yields zero — the list area simply shows nothing (folders/unassigned both empty). |
| Consistency & conventions? | **adequate** | Mostly consistent; the emoji magnifier and the inline BORDER/INK/MUTED re-declarations (LibraryToolbar.jsx:30-33) diverge from importing theme tokens like siblings do. |
| Trust/credibility? | **good** | Living-world filters reuse settlementSignals/needsAttention so they can't disagree with the cards (LibraryToolbar.jsx:127-145). |
| Width & responsive? | **good** | flexWrap + flexBasis 100% panel reflows to stacked on narrow. |
| Cognitive walkthrough? | **good** | Find->filter->reopen is well supported; the only gap is the missing zero-results feedback. |
| Runnability? | **good** | 'Needs attention' + 'In crisis' are the runnable triage controls. |
| Coherence? | **good** | Shared derivations keep filter semantics coherent with card pips. |

*Overhaul:*
- **[med]** Add a 'No settlements match your search/filters — Clear filters' empty result message when the filtered list is empty. — _Avoid a silent dead-end; offer the recovery CTA._ (P10)
- **[low]** Replace the emoji '🔍' with the lucide Search icon and import shared theme tokens instead of re-declaring BORDER/INK/MUTED. — _Cross-surface icon/token consistency._ (P11)


#### Bulk action bar (multi-select)
*File:* `src/components/settlements/BulkActionBar.jsx:31-97 (+ LibraryBulkBar.jsx)`
*Purpose:* Act on many saves at once: add-to-campaign, canonize, export, delete, with a count and a clear/done.
*Layout today:* Tinted row: 'N selected', then Add to campaign (gold, premium) + Canonize (gold, premium) + Export (info) + Delete (danger) + Done (ghost, pushed right).

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test? | **good** | 'N selected' + action buttons reads instantly. |
| Layout & spacing-as-grouping? | **good** | Single row, gap:8, Done pushed right with marginLeft auto (BulkActionBar.jsx:92). |
| Does it fulfill its purpose? | **good** | All four bulk actions wired via the hook (LibraryBulkBar.jsx:22-31). |
| Cohesion with flow? | **good** | Appears only in selectMode (SettlementsPanel.jsx:688); selection drives every action. |
| Plays on psychology? | **good** | Count gives goal feedback; disabled-until-selected prevents empty actions. |
| Design optimality? | **adequate** | Two gold + one blue + one red + ghost — same flat-equal issue as the card cluster, though acceptable in a transient action bar where actions are genuinely co-equal. |
| Distinctness? | **good** | Transient bar, visually distinct from toolbar via different tint. |
| Placement by importance? | **adequate** | Delete (destructive) sits inline at equal size with Export; could be separated. Done correctly far-right. |
| Intuitiveness & first click? | **good** | After selecting, the action set is obvious. |
| Button->function mapping? | **good** | All map correctly; campaign actions self-hide when !canManageCampaigns (BulkActionBar.jsx:57,78). |
| Primary CTA discipline? | **adequate** | No single primary, but bulk actions are legitimately parallel; acceptable. |
| System status? | **good** | Count updates live; disabled state on zero selection. |
| Domain language? | **good** | Add to campaign / Canonize / Export / Delete — clean. |
| Error prevention? | **good** | Delete routes through DeleteConfirmation with link-loss warning (LibraryBulkBar.jsx:32-38). |
| Error messages? | **good** | Inherits persistBatch rollback alert. |
| Recognition vs recall? | **good** | Count + visible actions; no recall needed. |
| Scannability? | **good** | One short row. |
| Cognitive load? | **good** | 5 controls, within limits. |
| Progressive disclosure? | **good** | Whole bar is disclosed only in select mode. |
| Borders vs whitespace? | **adequate** | Own bordered card adds to the stack but is transient. |
| Accessibility? | **weak** | Bulk export gives no aria-live announcement of selection count changes; the 'N selected' is a plain span not a live region, so SR users don't hear the count update. |
| Emphasis on change? | **good** | N/A. |
| Empty state? | **good** | Disabled actions at 0; clear. |
| Consistency & conventions? | **good** | Shared Button/icons; Trash2/Download/BookMarked conventional. |
| Trust/credibility? | **good** | Delete warning is honest about link loss. |
| Width & responsive? | **good** | flexWrap. |
| Cognitive walkthrough? | **good** | Select->act->confirm is clean. |
| Runnability? | **good** | Bulk export supports prep workflows. |
| Coherence? | **good** | Acts on the same save set. |

*Overhaul:*
- **[low]** Wrap 'N selected' in an aria-live=polite region and separate Delete from the parallel actions with a spacer. — _State changes announced in a second channel; destructive separated._ (P7)
- **[low]** Consider a subtle 'sticky' position for the bar so it stays in view while scrolling a long selection. — _Keep the action affordance near the work (Fitts) for large libraries._ (P8)


#### Empty / sample state (SampleDashboard + SampleCard)
*File:* `src/components/settlements/SampleDashboard.jsx + SampleCard.jsx`
*Purpose:* Turn a zero-save library into an inviting first run: three hand-picked, forkable sample settlements with a one-click Generate.
*Layout today:* A parchment panel: centered uppercase heading 'Start from a sample. Or roll your own', a centered intro paragraph (max 460), then a vertical stack of three SampleCards (gold left-rail, name + Sample badge + tier/terrain, italic teaser, tag chips, gold Generate button).

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test? | **good** | Heading + three sample cards instantly say 'fork a starter town' (SampleDashboard.jsx:18-28). |
| Layout & spacing-as-grouping? | **good** | Clear panel with centered intro then gap:10 card stack; the gold left-rail (SampleCard.jsx:17) is a clean semantic accent. |
| Does it fulfill its purpose? | **good** | Fork generates AND auto-saves for signed-in users (SettlementsPanel.jsx:148-163), navigating to the dossier. |
| Cohesion with flow? | **good** | Tier-gated forks (anon forking a city) open the purchase modal rather than dying (SettlementsPanel.jsx:138-143) — a reframed upgrade preview. |
| Plays on psychology? | **good** | Peak engineering: instead of an empty void, three evocative teasers create desire; goal-gradient toward the first save. |
| Design optimality? | **good** | Name (serif/600) + Sample badge + Generate (gold) give a clear 3-level hierarchy per card; one CTA each. |
| Distinctness? | **good** | The 'Sample' badge + gold rail clearly mark these as templates, not the user's saves. |
| Placement by importance? | **good** | Generate is the single CTA, left-aligned at card foot. |
| Intuitiveness & first click? | **good** | Generate is the obvious, only action. |
| Button->function mapping? | **good** | Generate forks the sample; label from t('generate.button') keeps copy centralized (SampleCard.jsx:71). |
| Primary CTA discipline? | **good** | Exactly one gold CTA per card. |
| System status? | **good** | busy/'Generating…' on the forking card, with forkingId disabling double-clicks (SampleCard.jsx:71, SettlementsPanel.jsx:102). |
| Domain language? | **good** | Tier/terrain/teaser/tags — worldbuilder-native. |
| Error prevention? | **good** | Concurrent-fork guard; tier-gate redirects to upgrade. |
| Error messages? | **weak** | A generation FAILURE (not a tier gate) also just opens the purchase modal (SettlementsPanel.jsx:138-143) — a real engine error is mis-framed as an upsell, with no error message about what went wrong. |
| Recognition vs recall? | **good** | Teaser + tags + tier let the GM recognize which sample fits without prior knowledge. |
| Scannability? | **good** | Name, badge, teaser (italic prose, visually distinct from data), tag chips — good layer-cake. |
| Cognitive load? | **good** | Three choices — well within limits, and a 'roll your own' alternative is named. |
| Progressive disclosure? | **good** | Just enough to entice; depth comes after fork. |
| Borders vs whitespace? | **good** | Cards have an earned border + the meaningful gold rail; no nesting soup. |
| Accessibility? | **adequate** | Uses semantic <article>/<h4>/<p> (good), but the heading is FS.xs(11) uppercase muted — visually a label, not a heading, and the centered uppercase MUTED heading may dip below AA on parchment. |
| Emphasis on change? | **good** | N/A — empty state. |
| Empty state? | **good** | This IS the model empty state: two-parts-instruction + one-part-delight, with a one-click sample CTA. Best-in-surface. |
| Consistency & conventions? | **good** | Shared Button, theme tokens, t() copy. |
| Trust/credibility? | **good** | 'Same setting, different settlement' honestly frames the fork as a mechanically distinct generation, not a copy. |
| Width & responsive? | **good** | Intro capped at 460 (prose measure); cards reflow. |
| Cognitive walkthrough? | **good** | Pick a sample -> Generate -> dossier; clear feedback throughout. |
| Runnability? | **good** | Teaser conveys the runnable hook of each sample. |
| Coherence? | **good** | Fork seeds are user-suffixed for deterministic-but-distinct results (forkSeedFor). |

*Overhaul:*
- **[med]** Distinguish a true generation error from a tier gate: on a real fork failure show a plain-language error with a retry CTA, reserving the purchase modal for the tier-gated case. — _Errors must say what went wrong and what to do next, not masquerade as an upsell._ (P10)
- **[low]** Promote the panel heading to a real semantic h2 at body/serif size with AA-safe color, rather than an 11px uppercase muted label. — _Information-bearing heading + accessible contrast._ (P6)


#### Settlement detail — header / toolbar
*File:* `src/components/SettlementDetail.jsx:251-373`
*Purpose:* Frame an opened saved dossier: navigate back, identify it (name + phase + narrated/raw + edited), and offer the dossier-level actions (edit, export, share, revert).
*Layout today:* A single tinted toolbar card containing one wrapping row: Back to list (secondary) · settlement name (serif) · PhaseBadge · StateBadge(narrated/raw) · spacer · [Revert to Raw, edit-mode+narrated] · [Edited·N badge] · Edit Dossier (ai/violet or locked secondary) · Export Dossier (danger) · Share to Gallery (info). Below: optional Share panel.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test? | **adequate** | Name + Back read instantly, but the row crams up to 7 controls + 2 badges (SettlementDetail.jsx:256-344) so 'what do I do here' is muddled; the dossier itself (the hero) is below the fold under all this chrome. |
| Layout & spacing-as-grouping? | **weak** | All controls live in ONE flat flex-wrap row at gap:8 (SettlementDetail.jsx:256) — back-nav, identity, state badges, and three different actions share one undifferentiated cluster with no grouping between navigation, status, and actions. |
| Does it fulfill its purpose? | **good** | Back, edit toggle, export sheet, share panel, revert all wired and gated correctly. |
| Cohesion with flow? | **good** | Back returns to list + clears linking; URL sync keeps the address bar correct; edit mode reveals the workshop/links/chronicle progressively. |
| Plays on psychology? | **adequate** | Edited·N and narrated/raw badges reward investment, but there's no end-of-flow runnable closeout — opening a dossier drops you into a tool-heavy header, not an evocative summary. |
| Design optimality? | **broken** | The header has at least THREE competing high-emphasis actions: Edit Dossier (violet), Export Dossier (danger-red), Share to Gallery (blue) — three saturated colors at equal sm size (SettlementDetail.jsx:305-344). No focal action; the squint yields a stripe of equally-loud buttons. Export uses danger-red despite being non-destructive. |
| Distinctness? | **good** | The toolbar-over-dossier layout is distinct from the list view. |
| Placement by importance? | **weak** | The most common dossier action for a time-pressured GM (Export to run at the table, or just read) is not visually prioritized; Edit (a premium, less-frequent action) is violet-prominent. Revert-to-Raw (rare, semi-destructive) sits inline with primary actions when present. |
| Intuitiveness & first click? | **adequate** | Back is clear; but for 'get the printable dossier' vs 'edit' vs 'publish' the three loud buttons compete and no single one reads as the intended next step. |
| Button->function mapping? | **good** | Each maps correctly; locked Edit opens the purchase modal (SettlementDetail.jsx:309-312); Export uses busy state. |
| Primary CTA discipline? | **broken** | Three colored CTAs (violet/red/blue) with no designated primary and no outline/ghost subordination — direct violation. |
| System status? | **good** | Export shows busy/'Building PDF…' (SettlementDetail.jsx:326-331); a local @keyframes spin is injected so the spinner animates. |
| Domain language? | **good** | Dossier, Canon, narrated/raw, Gallery — all GM-native; tooltips explain consequences. |
| Error prevention? | **good** | Revert-to-Raw is confirmed via ConfirmDialog (SettlementDetail.jsx:540-548); export validates consistency (surfaces, never blocks, the user's own doc). |
| Error messages? | **good** | pdfError renders a plain-language danger box (SettlementDetail.jsx:508-512). |
| Recognition vs recall? | **good** | Phase, narrated/raw, edited-count all visible inline; no recall needed. |
| Scannability? | **weak** | The single dense button row has no chunking; the eye can't separate navigation from status from actions. |
| Cognitive load? | **weak** | Up to 9 interactive/badge elements in one row exceeds comfortable scan, especially mid-session. |
| Progressive disclosure? | **good** | Edit-only chrome (Workshop write, links, network effects, edit names, chronicle, apply-config) is gated behind Edit Dossier (SettlementDetail.jsx:382-498); View opens clean. |
| Borders vs whitespace? | **adequate** | Header is one tinted card; reasonable. The detail body below is capped at PAGE_MAX separately (SettlementDetail.jsx:527). |
| Accessibility? | **adequate** | Buttons have titles; Share has aria-pressed; StateBadge carries role=status. But the toolbar is not a labeled landmark and the action stripe relies on color to differentiate function (violet/red/blue) — same hue-coded meaning risk; sm buttons under 44px. |
| Emphasis on change? | **adequate** | PhaseBadge + Edited·N hint at history but no delta vs last advance is shown in the header; change lives only in the (edit-only) chronicle. |
| Empty state? | **good** | N/A — always has a settlement. |
| Consistency & conventions? | **adequate** | Shared primitives used, but Export-as-danger-red is an inconsistent semantic (danger should mean destructive) versus the rest of the app. |
| Trust/credibility? | **good** | validateDossier logs cross-surface contradictions before export (SettlementDetail.jsx:191-196); narrated/raw badge discloses provenance honestly. |
| Width & responsive? | **good** | Header full-width, dossier body capped at PAGE_MAX (SettlementDetail.jsx:527); row wraps on narrow. |
| Cognitive walkthrough? | **adequate** | Back/edit/export are findable, but the goal-to-control mapping for the primary 'I want the runnable sheet' is diluted by three equal CTAs. |
| Runnability? | **adequate** | Export Dossier (PDF/print parity via ExportSheet variants) is the runnable path and is present, but it's buried among equal buttons rather than being the obvious table-prep action. |
| Coherence? | **good** | Hydrates phase/eventLog/systemState from THIS save on open (SettlementDetail.jsx:120-141), preventing the prior-settlement state bleed the comment documents — a real coherence fix. |

*Overhaul:*
- **[high]** Split the header into three spacing-grouped zones: left = Back + name + phase/state badges (navigation+identity); right = ONE primary action. Designate Export Dossier as the single primary (solid, not danger-red), demote Edit Dossier and Share to Gallery to outline/secondary. — _One unambiguous primary per region; group by function via spacing; style by task importance._ (P8)
- **[med]** Re-color Export from danger to a neutral/primary variant; reserve danger-red for genuinely destructive actions (delete/revert). — _Semantic color consistency — danger must mean destructive._ (P7)
- **[med]** Open the dossier on a brief runnable summary line (ruler + one-line tension) directly under the header before the full OutputContainer, engineering the open as a runnable peak. — _Lead with runnable essentials; engineer the open moment._ (P9)
- **[low]** Move Revert to Raw out of the top action row into the edit-mode revert/provenance area (it already only shows in edit+narrated), so the header never mixes a semi-destructive action with primary actions. — _Destructive/rare actions separated from primaries._ (P8)


#### Settlement detail — edit-mode body (Workshop, links, network effects, edit names, chronicle)
*File:* `src/components/SettlementDetail.jsx:375-538 + settlementDetail/* + NetworkEffectsPanel`
*Purpose:* Behind Edit Dossier: regenerate-from-config, AI polish, the Workshop right-rail, regional impact inbox, neighbour linking, network-effect visualization, NPC/faction renaming, and the chronicle.
*Layout today:* A vertical stack (each its own bordered card, marginBottom 12-14): Apply-Saved-Config row, AIInlineCard, Workshop (always mounted), then edit-only: RegionalImpactInbox, SuccessorPrompt, Link-a-Neighbour collapsible, Neighbour Network list, NetworkEffectsPanel, Edit Names collapsible, ChroniclePanel. Then the read-only OutputContainer dossier below.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test? | **weak** | In edit mode the screen becomes a long vertical pile of ~8 bordered cards (SettlementDetail.jsx:382-498) before the actual dossier; 'where is the thing I came to edit' is not answerable in 5s. |
| Layout & spacing-as-grouping? | **weak** | Every section is an independently bordered card at uniform ~12-14 marginBottom; no grouping of related concerns (linking + network effects + edit names are all relationship-ish but sit as separate equal boxes). |
| Does it fulfill its purpose? | **good** | All edit affordances function; renames cascade, links build both sides, network effects compute from the graph. |
| Cohesion with flow? | **good** | Apply-config regenerate routes back through onLoad to the wizard (SettlementDetail.jsx:384); regional impact apply updates detail in place (handleRegionalImpactApplied). |
| Plays on psychology? | **adequate** | Chronicle is a nice open-loop/history reward but is last and edit-only, so casual users never see the living-history payoff. |
| Design optimality? | **weak** | No focal point in edit mode — eight peer cards. The Apply-Config button (info/blue) and AI polish compete with the Workshop for attention. |
| Distinctness? | **good** | Edit mode is clearly distinct from the clean View. |
| Placement by importance? | **weak** | The destructive 'Apply Saved Configuration & Regenerate' (discards current dossier for a fresh roll) is the FIRST card in edit mode (SettlementDetail.jsx:382-390) — a rarely-wanted, dossier-destroying action given top placement. |
| Intuitiveness & first click? | **weak** | A user entering edit mode to tweak a name is met first by a regenerate button; the path to the actual editable fields (inline in the dossier far below, or Edit Names card) is not obvious. |
| Button->function mapping? | **good** | Each control does what it says; AI polish correctly calls requestNarrative (the dangling runAiLayer was fixed, SettlementDetail.jsx:400-408). |
| Primary CTA discipline? | **weak** | Multiple co-equal action cards; no single primary for the edit session. |
| System status? | **good** | RegionalImpactInbox/AI/PDF carry their own busy/error states. |
| Domain language? | **good** | Neighbour, faction, NPC, canon-lock, chronicle — clean; the lock explanation is GM-friendly (SettlementDetailEditNames.jsx:31-34). |
| Error prevention? | **adequate** | Apply-config has an inline warning that it discards the current dossier (SettlementDetail.jsx:387-389) but it is NOT a confirm dialog — one click destroys the current narrative/edits for a fresh roll. Canon-lock guards renames in depth. |
| Error messages? | **good** | Inherits persistBatch rollback; link/remove failures roll back. |
| Recognition vs recall? | **good** | Edit Names shows role + current name per row; link card lists all linkable saves with tier. |
| Scannability? | **weak** | Long card pile; the dossier (the content) is pushed far down in edit mode. |
| Cognitive load? | **weak** | Eight stacked panels at once is heavy; could be tabbed/grouped (relationships vs narrative vs lifecycle). |
| Progressive disclosure? | **adequate** | Linking and Edit Names are collapsible (good), but the rest expand all at once on entering edit mode. |
| Borders vs whitespace? | **broken** | Pure box-soup: 8 sibling bordered cards (info-tint link list, network-effects card, edit-names card, chronicle) each with its own border + the inner OutputContainer below. Multiple false floors. |
| Accessibility? | **adequate** | Collapsibles use aria-expanded/aria-pressed; inline rename inputs have aria-labels (SettlementDetailEditNames.jsx:52,94). Network-effect bars convey direction via position+color but the value text is monospace tiny (FS.xxs). |
| Emphasis on change? | **good** | Chronicle + RegionalImpactInbox + NetworkEffects surface change/causality — the strongest change-emphasis on the surface, though gated behind edit mode. |
| Empty state? | **good** | Link card shows 'No other saved settlements to link' (LinkNeighbourCard.jsx:15); network effects/chronicle self-hide when empty. |
| Consistency & conventions? | **weak** | REL_COLORS here (SettlementDetail.jsx:44) differ from SettlementCard's REL_COLORS values, so neighbour relationship colors in this network list don't match the same links rendered on the library card. |
| Trust/credibility? | **good** | NetworkEffects shows per-source breakdown with hop-depth/decay/tier-ratio (NetworkEffectsPanel.jsx:67-69) — exposes WHY a modifier exists, exemplary causal transparency. |
| Width & responsive? | **good** | Cards full-width within the detail; dossier body capped at PAGE_MAX. |
| Cognitive walkthrough? | **weak** | The edit goal often (rename one NPC) doesn't map to an obvious control; the regenerate-everything button is the most prominent, risking accidental destruction. |
| Runnability? | **adequate** | NetworkEffects/Chronicle are reference-grade but edit-only; the runnable read lives in OutputContainer below. |
| Coherence? | **good** | Links build both sides with shared NPC/conflict generation (handleLink); renames cascade across saves — strong cross-settlement coherence. |

*Overhaul:*
- **[high]** Group the eight edit cards into 2-3 labeled sections by concern (Narrative: AI polish + revert; Relationships: link + network + chronicle; Lifecycle: regenerate + regional impacts) using spacing/section headers instead of eight equal bordered cards. — _Spacing-as-grouping + chunking to defeat box-soup and the 8-panel overload._ (P5)
- **[high]** Demote 'Apply Saved Configuration & Regenerate' out of the first/top slot and wrap it in a ConfirmDialog (it discards the current dossier) — treat it as the destructive action it is. — _Consequential/irreversible actions confirmed and de-prioritized, not first-and-one-click._ (P10)
- **[med]** Unify REL_COLORS with the card/library so neighbour link colors match across detail and library (same fix as the card page). — _Named relationships must look identical across surfaces._ (P2)
- **[med]** Surface the Chronicle (history of change) in the read-only View too (collapsed), not only in edit mode, so the living-world payoff reaches non-editing GMs. — _Emphasize change as the differentiator for the primary (read) audience._ (P3)


### Surface: REALM / WORLD MAP — the deterministic simulation's spatial home: an FMG geography iframe with a React SVG overlay, a ~40-control top toolbar, a 4-way mode switch with per-mode contextual toolbars, a left settlement palette, a toggleable Layers panel, a bottom-left Legend, and a right-dock Realm Inspector (Dashboard / War & Diplomacy / Pantheon / Pulse Results / Chronicle). This is where a GM places canon settlements, advances time ("Advance Realm"), and reads what the simulation did. It is the surface where "this is an engine, not a generator" must land — and currently the chrome (toolbar density, box-soup) fights that message hard, while the actual living-world payoff is buried behind a closed inspector.

**Cross-cutting:**
- BOX-SOUP IS THE SURFACE'S DEFINING FLAW. Nearly every component is its own bordered CARD: toolbar row 1 (border), context row 2 (border), palette rail (border), map (2px border), layers rail (border), inspector (border) → each section (border) → each Stat/Outcome/Status/Deity card (border). The map — the hero — is a small island inside 4+ concentric/adjacent frames. Per P5, switch wholesale to differential spacing + tints; reserve borders for the colored semantic left-border (which War/Pantheon already use well) and earn every remaining frame.
- STATIC STATS WHERE CHANGE IS THE PRODUCT. The Realm Dashboard (the default payoff) and Pantheon report absolute counts with zero deltas/trends/arrows, while LiveWarStatus (the best component) shows live causal state. The product's entire differentiator is causal change over time; the dashboard must lead with 'what moved this tick' (P3). This is the single highest-leverage fix for 'simulator, not generator'.
- THE LIVING WORLD IS HIDDEN BY DEFAULT. The Realm Inspector starts CLOSED, so the default Realm view is a static map with no sign a simulation exists. Open the Dashboard by default for an active campaign and lead with deltas — engineer the peak where 'real engine' lands (P3/P9).
- NO SINGLE PRIMARY ACTION. The toolbar runs TWO gold primaries (Save + Advance Realm) inside ~20 same-size pills; Advance Realm — the marquee action — has no privileged position. Demote Save (the AutoSaveChip covers reassurance), make Advance Realm the lone primary in a stable right-edge campaign-clock cluster, and overflow rare actions (P4/P8).
- STAGED PROGRESS MISSING ON THE LONGEST OP. Advance Realm (the >10s simulation) shows only a label flip + bare 'Loading…' spinner. The op that most needs 'which stage is running' (resolving stressors → rolling → writing chronicle) has none (P10).
- DUPLICATED, DIVERGENT RELATIONSHIP CONTROLS & COLORS. Relationship-type filtering lives in BOTH LayersPanel and RoutesToolbar with DIFFERENT palettes, and the Legend matches only one of them. Three sources of truth for the same edges = visible contradiction (P2/P11). Unify to one palette/control.
- ENTITY-NAME INCONSISTENCY ACROSS TABS. RealmDashboard shows raw weariest.id while War/Pulse/Chronicle resolve the same entity to a name via nameById — a cross-tab contradiction (P2 cardinal sin). Thread nameById through the dashboard.
- ENGINE JARGON LEAKS. 'propagationMode', 'intensity', 'candidate(s)', 'drift', 'GM regional channels', 'Tier drift' surface in the Pulse header, Rules dialog, and Layers panel. Translate to GM language (Spread, Drama, changes considered/applied, causal links) per P11.
- COLOR-ONLY SEMANTICS in spots: RealmDashboard crisis/hot tint is color-only; Pantheon's three near-identical purples lean on color to distinguish tiers. Pair with glyph/weight/size (P7).
- WEAK/ABSENT EMPTY-STATE ONBOARDING. A new GM with no campaign / no canon settlements lands on a near-blank map; the palette empty state is one italic line with no CTA, and placement gates only reveal themselves via failed-drop toasts. Add a guided first action + explain canon filtering inline (P2/P9).
- NO RESPONSIVE REFLOW. The palette(240) + map + layers(240) triptych and the 420 inspector don't collapse; on a tablet at the table the map gets crushed. Route through caps and collapse rails to drawers (P12).
- CONSISTENCY DRIFT: QuickInspector re-declares theme tokens locally instead of importing from theme.js; AutoSaveChip's `saving` state is dead because WorldMapToolbar renders <AutoSaveChip/> with no saving prop — so 'Saving…' never shows during performSaveMap. Wire the in-flight flag through (trust/credibility).


#### Top Toolbar (WorldMapToolbar)
*File:* `src/components/map/WorldMapToolbar.jsx`
*Purpose:* Single horizontal bar carrying mode switch, campaign picker, save/clear, Pulse/Rules/News/Pantheon inspector openers, three preset chips, interval select, Advance Realm, Undo, Layers, Help, Import/Share image, template picker, Fit, Regenerate, Inspector toggle, plus a loading/error status line.
*Layout today:* One flex-wrap row, padding sm/md, CARD bg, single border. ~20+ controls separated by thin 1px vertical dividers; everything is the same IconButton size/weight; 'Save' and 'Advance Realm' use `primary` (gold) styling, everything else `secondary`. flex:1 spacer pushes the status line right. On a laptop this wraps to 2-3 rows of indistinguishable pills.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test — does 'a SIMULATOR for DMs' / the one obvious next action land? | **broken** | WorldMapToolbar.jsx:72-365 is a ~20-control wall where Save and Advance Realm are BOTH gold `primary` (lines 163,252), so there is no single focal action. The intended hero — Advance Realm, the thing that makes the world live — is buried mid-row between Rules/News/Pantheon/presets/interval. A GM cannot tell in 5s that this is a time-advancing simulator vs. a generic map editor. |
| Primary CTA discipline — one high-emphasis primary per region? | **broken** | Two `primary` gold buttons coexist (Save line 163, Advance Realm line 258) in the same region, violating P8. They compete; neither wins the squint test. |
| Cognitive load & choices — minimized, grouped within ~7±2? | **broken** | With a campaign active, the row exposes well over 15 controls (mode pill + select + Save + chip + Trash + Pulse + Rules + News + Pantheon + 3 preset chips + interval + Advance + Undo + Layers + Help + Import + 2 Share + template + Fit + Regenerate + Inspector). No grouping beyond hairline dividers (lines 136,174,271,338). Far past 7±2. |
| Borders vs whitespace (anti-box-soup) — earning their place? | **weak** | Grouping is carried by 1px BORDER2 dividers (lines 136,174,271,338) instead of differential spacing (P5). gap is a uniform SP.sm everywhere, so spacing does no grouping work; the dividers are a band-aid. |
| Placement by importance & purpose (Fitts/serial position)? | **weak** | Destructive/rare Regenerate (line 346) and Clear-map Trash (line 170) sit inline at the same size as everyday actions. Frequently-used Advance Realm is mid-row, not at a stable edge. Inspector toggle — arguably the gateway to all the simulation payoff — is last before the spacer (line 355). |
| Match real world (domain language, zero engine jargon)? | **adequate** | Labels are domain-clean (Advance Realm, Pulse, Pantheon, Canon). 'World Pulse' / 'Realm' read well. Minor: 'Regenerate' + 'Random island' template is editor-speak, acceptable for the worldbuilder. |
| Distinctness from siblings (Library/Gallery/Compendium)? | **good** | The mode pill + campaign clock controls are unique to Realm; no confusion with other surfaces. |
| Correct button→function mapping & shared icons? | **good** | Icons match actions (Zap=Pulse/Advance, Save=Save, Newspaper=News). Save uses the same Save icon as elsewhere. No mis-wires found. |
| System status & perceived speed (>10s shows stage)? | **weak** | Advance Realm only flips label to 'Advancing' (line 258) and the status line shows a bare 'Loading…' spinner (line 371). For the marquee long-running simulation op, there is no per-stage progress (P10) — exactly the operation that most needs 'which simulation stage is running'. |

*Overhaul:*
- **[high]** Demote Save to secondary/outline and make Advance Realm the SINGLE gold primary; move it to a fixed right-anchored 'campaign clock' cluster (interval + Advance + Undo) that never wraps away. — _One unambiguous primary per region; Advance Realm is the action that makes the simulation the hero. Save is reassured by the AutoSaveChip already present._ (P8)
- **[high]** Split the toolbar into 3 spaced clusters carried by whitespace, not dividers: [Mode] · · · [Campaign + clock] · · · [View utilities: Layers/Legend/Fit/Help]. Collapse rare actions (Regenerate, Clear map, Import/Share image, template) into an overflow 'More' menu. — _Restraint over density; lets the GM's eye land on the 3 things that matter mid-session instead of scanning 20 equal pills._ (P5)
- **[med]** Replace the bare 'Loading…'/'Advancing' with a staged status (e.g. 'Resolving stressors → rolling outcomes → writing chronicle') for Advance Realm. — _The simulation depth becomes legible exactly when the GM watches it run; a bare spinner squanders the peak._ (P10)


#### Mode Switch (ModeSwitch)
*File:* `src/components/map/ModeSwitch.jsx`
*Purpose:* Segmented control switching the map between View / Terrain / Annotate / Routes tooling.
*Layout today:* 4 (or 2 in image mode) segmented Buttons in a BORDER2 tray; active = secondary variant, inactive = ghost. Icons Eye/Mountain/PenTool/Link.

| Q | Verdict | Finding |
|---|---|---|
| Optimality — hierarchy ≥2 channels, one focal, survives squint? | **adequate** | Active state is carried by variant (secondary vs ghost) — bg + weight, two channels (lines 42-49). Acceptable, though the active pill is subtle against the tray. |
| Intuitiveness & first click — correct first click obvious? | **adequate** | View is first and default; reasonable. But the keymap in WorldMap.jsx:725 binds 'P' to VIEW mode while the label is 'View' (comment even says 'P (place)') — a stale label/shortcut mismatch that would confuse a power user reading the tour/help. |
| Consistency & conventions (Jakob)? | **good** | Segmented mode pill is a standard map-editor convention; image-mode correctly drops Terrain/Routes (line 27) since there is no FMG geometry. |
| Accessibility — state in ≥2 channels, keyboard, labels? | **adequate** | aria-pressed set (line 48); active conveyed by variant. Touch target is size 'md' Button — likely near but verify ≥44px on mobile. |
| Match real world (domain language)? | **good** | View/Terrain/Annotate/Routes are clear GM/map terms. |

*Overhaul:*
- **[low]** Rename the first mode 'Place' (matching its 'P' shortcut and its real job — placing settlements) or rebind the shortcut to 'V'; align WorldMap.jsx keymap comment (line 704-707) with reality. — _Label/shortcut coherence; the help tour references these and a contradiction erodes trust._ (P11)
- **[low]** Strengthen the active pill (add a subtle inset shadow or gold underline) so the current mode survives the blur test against the tray. — _One focal point per view; mode is the primary state of the whole stage._ (P4)


#### Contextual Toolbars (Annotate / Terrain / Routes)
*File:* `src/components/map/WorldMapContextToolbars.jsx`
*Purpose:* A second row under the mode switch exposing tools for the active mode: Annotate (select/text/marker + size/font/color/undo/redo), Terrain (heightmap/biomes + double-click hint), Routes (relationship-type filter chips + roads/chains toggles + network-stress flag).
*Layout today:* Each is its own CARD bordered row; lazy-loaded; flex-wrap with internal dividers. RoutesToolbar pushes a red network-stress callout to the right via marginLeft:auto.

| Q | Verdict | Finding |
|---|---|---|
| Layout & spacing-as-grouping — chunks from spacing alone? | **weak** | AnnotateToolbar.jsx:34-145 and RoutesToolbar.jsx:78-189 both rely on 1px dividers + uniform gap; the option clusters (e.g. Size/Font/Color in Annotate) don't read as a group by spacing. |
| Borders vs whitespace — stacked bordered rows? | **weak** | Toolbar row 1 (CARD+border) + context row 2 (CARD+border) stack two identical bordered bars, a 'box-soup' double frame consuming vertical space above the already height-constrained map (WorldMap.jsx:742 calc 100vh-120px). |
| Does it fulfill its purpose — complete the mode's task? | **good** | Each toolbar exposes the right tools; TerrainToolbar.jsx:118-128 even has an honest inline hint that per-feature edits need a double-click on the map (a thoughtful affordance). |
| Emphasis on change — surfaces deltas/anomalies? | **good** | RoutesToolbar.jsx:168-188 promotes a supply-chain 'Network stress' red flag to the right edge — a genuine anomaly-forward touch aligned with P3. |
| Primary CTA discipline within the row? | **adequate** | These are tool palettes (no single CTA expected); ghost/secondary chips are appropriately subordinate. Acceptable. |
| Distinctness — does the row clearly change per mode? | **good** | Routes shows colored relationship chips, Annotate shows tool+style controls, Terrain shows heightmap/biomes — visually distinct per mode. |
| Accessibility — chip state in ≥2 channels? | **adequate** | RoutesToolbar chips pair color dot + border + weight + aria-pressed (lines 104-127); state not color-alone. LayersPanel-style chips OK. |

*Overhaul:*
- **[med]** Merge the context row into the main toolbar as a mode-scoped second tier WITHOUT its own card border — let it sit inside the same frame separated by spacing, so the stage doesn't lose a full bordered row of height. — _Anti-box-soup; reclaim vertical space for the hero (the map). Frame-not-fullbleed but also not double-framed._ (P5)
- **[low]** In AnnotateToolbar, group the per-tool style options (Size/Font/Color) with tight internal spacing and a clear gap from the tool selector, dropping the divider. — _Spacing carries grouping; reduces the pill-soup feel._ (P5)


#### Map Stage + Settlement Palette + iframe loading/drop states
*File:* `src/components/map/WorldMapStage.jsx`
*Purpose:* The body: left 240px settlement palette (drag-to-place), the FMG iframe (or image backdrop) with the SVG overlay, the drop-target affordances, the 'Summoning the world…' loader, the QuickInspector/PlacementDetailCard/MapLegend, and the right Layers panel.
*Layout today:* flex row: palette (fixed 240, bordered card) · map container (flex, 2px border that turns gold on drag) · optional Layers panel (fixed 240, bordered card). Loader is a centered parchment-blur overlay. Drop preview is a dashed gold inset + (flag-gated) hint card top-right.

| Q | Verdict | Finding |
|---|---|---|
| Empty state — explains what appears + one-click sample/template? | **weak** | SettlementPalette.jsx:79-87 empty state is a single italic line ('No settlements yet. Generate one on the Create tab.') with NO CTA/link to Create and no delight (P-empty-state asks two-parts-instruction-one-part-delight). A brand-new GM with no canon settlements and no campaign hits a near-blank map with no guided first action. |
| Cohesion with the flow — clean handoff config→generate→dossier→place? | **weak** | Placement requires (a) a selected campaign AND (b) canon settlements; both are gated with toasts in WorldMap.jsx:314-322 but the palette/stage never proactively says 'select a campaign first'. The dead-end is only discovered on a failed drop. No inline path back to Create or to canonize. |
| System status & perceived speed — loader quality? | **good** | WorldMapStage.jsx:168-180 shows an evocative 'Summoning the world…' spinner over a parchment blur — on-brand, non-bare, good per P10. |
| Intuitiveness & first click — primary task (place) obvious? | **adequate** | Palette footer hint 'Drag a card onto the map to place it' (lines 105-112) + drag affordance is reasonable; but with canon-only enforcement, non-canon saves are simply absent (activeSaves filter, WorldMap.jsx:177-179) with no explanation of WHY a settlement the GM expects is missing. |
| Recognition vs recall — palette surfaces enough to choose? | **good** | SettlementCard (lines 133-249) surfaces name/tier/pop/threat/stressor pills + placed badge — strong recognition for choosing where to drop without opening the dossier. |
| Width & responsive — single readable column on tablet? | **weak** | The three-column flex (palette 240 + map + layers 240) has no reflow; on a tablet the map column gets crushed between two fixed 240 rails. No breakpoint collapses the palette to a drawer. |
| Borders vs whitespace — palette/map/layers as 3 bordered rails? | **weak** | Three side-by-side bordered cards (lines 85-89, 103-117, 230-234) create a triptych of frames; the map's own 2px border (line 112) adds a 4th frame inside the page frame. |
| Distinctness & trust — credible at a glance? | **good** | Parchment map bg + drag affordances read as a credible map workspace; placed-badge + gold drag border are clear feedback. |

*Overhaul:*
- **[high]** Make the palette empty state a real empty state: a one-line explanation + a primary 'Generate a settlement' button routing to Create, and (if no campaign) a 'Select or create a campaign' prompt with a sample/demo campaign CTA. — _Two-part-instruction-plus-delight empty state; turn the dead blank map into a guided first action and protect the new-GM onboarding._ (P9)
- **[med]** When canon-only filtering hides saves, show a muted footnote in the palette ('3 drafts hidden — only canon settlements can be placed. Canonize on the dossier.') with a link. — _Visible causal coherence — explain WHY expected entities are absent instead of silently dropping them; prevents a 'where did my town go?' trust break._ (P2)
- **[med]** Collapse the Layers panel (and on tablet, the palette) into an overlay drawer rather than a third fixed rail, and reflow to a single column under the page cap on narrow widths. — _Width discipline + frame-not-fullbleed; keep the map readable at the table._ (P12)


#### Realm Inspector shell (Dashboard/War/Pantheon/Pulse/Chronicle)
*File:* `src/components/map/RealmInspector.jsx`
*Purpose:* Right-dock 420px overlay rail with 5 tabbed sections that surface the living world without body-swapping the map.
*Layout today:* Absolute right dock, CARD_ALT, header 'Realm Inspector' + close, a flex-wrap tab row of IconButtons, then a scrolling section body. Sections lazy-load. Peacetime/empty notes fill otherwise-blank sections.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test — does the living world land? | **weak** | The Inspector is CLOSED by default (WorldMap.jsx inspectorOpen state starts closed; opened only via toolbar). The single most important payoff — the State of the Realm dashboard — is hidden behind a click. The default Realm view is a static map, not a living world, undercutting P1/P3 on first impression. |
| Layout & spacing-as-grouping — tabs read as a group? | **adequate** | Tab row (lines 119-134) is a flex-wrap of identical IconButtons separated by gap:6; with 5 tabs it can wrap on the 420 rail. Active tab uses `active` gold tint + aria-pressed — two channels, OK. |
| Cohesion — empty/peacetime handling across tabs? | **good** | PeacetimeNote (lines 207-212) and Empty (lines 214-223) ensure War/Pulse/Chronicle never read as broken when there's no data — a thoughtful 'calm, not blank' treatment. |
| Recognition vs recall — entities consistent across tabs? | **good** | A single nameById map (lines 78-79) is threaded into War and Chronicle so settlement names match across sections (supports P2 cross-tab consistency). |
| Primary CTA discipline within the rail? | **adequate** | The rail is mostly read-only; the one intervention (AssignDeityFromMap in Pantheon) is appropriately scoped. No competing primaries. |
| Width & responsive — rail on tablet? | **adequate** | width:min(420px, calc(100%-24px)) (line 96) degrades to near-full-width on narrow screens, overlaying the map. Acceptable as an overlay but it then fully hides the map it's supposed to coexist with. |
| Distinctness — is this clearly the 'control room'? | **weak** | Header is just 'Realm Inspector' with no summary line; opening it lands on Dashboard but there's no persistent 'what is this campaign / what tick' context strip across tabs, so switching to War/Pantheon loses the at-a-glance realm frame. |

*Overhaul:*
- **[high]** Open the Inspector to the Dashboard by default when a campaign is active (collapse-on-demand), so the living-world summary is the first thing a GM sees on the Realm. — _The simulation is the hero; lead with the living world, not a quiet map. Engineer the peak — this is where 'real engine' lands._ (P3)
- **[med]** Add a thin persistent context strip in the Inspector header (campaign name · in-world date/tick · tension band) that stays visible across all 5 tabs. — _Recognition over recall + visible state; the GM never loses the realm frame when drilling into War or Pantheon._ (P2)
- **[low]** If the rail goes near-full-width on tablet, dim/peek the map edge or add a 'back to map' affordance so it doesn't feel like a body-swap (the very thing this rail was built to avoid). — _Cohesion + frame-not-fullbleed; preserve the 'map stays mounted' promise on small screens._ (P12)


#### Realm Dashboard (+ anon/free locked state)
*File:* `src/components/map/RealmDashboard.jsx`
*Purpose:* Default Inspector section: a glanceable State-of-the-Realm grid (in-world date, settlements, active wars, dominant faith, war-weariest, mobilizing, occupations, tension) for premium; a locked teaser that fires a pricing moment for anon/free.
*Layout today:* Header 'State of the Realm' + a responsive auto-fit grid of 8 Stat cards (each a bordered box with uppercase micro-label + big value + sub). Locked state: gold-bordered teaser card with lock icon, paragraph, 3-bullet list, gold CTA.

| Q | Verdict | Finding |
|---|---|---|
| Emphasis on change — deltas/trends as focal, not static absolutes? | **broken** | Every Stat (lines 202-250) is a STATIC absolute (count of wars, count of occupations, current tension label). There are NO deltas/trends/arrows ('+2 settlements at war since last tick', 'tension ↑ from Simmering'). This is precisely the static-stats anti-pattern P3 warns against — the product's differentiator (change over time) is invisible on its own dashboard. |
| Optimality — hierarchy ≥2 channels, ~3 levels, one focal? | **weak** | All 8 Stat cards are identical weight/size (lines 69-88); the only differentiation is a red/orange value tint for crisis/hot (line 70). There is no single focal stat — 'Tension' (the headline) sits last and looks identical to 'Settlements'. 8 equal boxes, no dominant entry point (violates P4 one-focal-point). |
| Borders vs whitespace — 8 bordered boxes? | **weak** | Each Stat is its own BORDER2 box (line 74) inside the rail card inside the map — a grid of 8 little frames (box-soup). Spacing could group date/peace vs war stats instead. |
| Empty state — no-campaign / dormant handled? | **good** | No-campaign prompt (lines 164-172) and 'No pantheon'/'No sieges' subs are handled; dashboard never reads broken. |
| Errors/limits reframed as upgrade previews (anon/free)? | **good** | RealmDashboardLocked (lines 94-148) is a strong P9 preview: evocative copy ('wars ignite and burn themselves out…'), 3 concrete bullets, tier-aware CTA ('Sign in to unlock' vs 'Upgrade to run the Realm'), fires map_realm_teaser + first_advance_attempt moments. Reframes the wall as a preview, not a denial. |
| Match real world / coherence — values trustworthy & named? | **adequate** | War-weariest shows weariest.id (line 225) — that is a raw settlement ID, not a resolved name, unlike the War tab which resolves names via nameById. A visible inconsistency (P2 cardinal sin) where the dashboard shows an id and the War tab shows the name for the same entity. |
| Accessibility — tone in ≥2 channels? | **weak** | Crisis/hot is conveyed by value COLOR alone (Stat line 70: red/orange text). No icon/glyph/label change pairs it — color-only semantic (violates P7). |
| Scannability — keyword-first, focal fact top-left? | **adequate** | Labels are keyword-first uppercase (line 79); but with auto-fit grid the 'most table-relevant fact' (Tension / Active wars) isn't pinned top-left — order is date, settlements, wars… so the scan leads with the calendar, not the tension. |

*Overhaul:*
- **[high]** Lead the dashboard with deltas: show each stat's change since the last pulse (e.g. 'Active wars 3 ▲2', 'Tension Strained ↑ from Simmering'), and make the single most urgent stat (tension/active wars) a larger focal card top-left. — _Emphasize change, not static stats — this is the differentiator that proves a deterministic engine ran; and give the view one focal point._ (P3)
- **[high]** Resolve weariest.id to a settlement name via the same nameById map the War/Chronicle tabs use. — _Named entities must be identical across tabs; an id here vs a name there is a visible contradiction._ (P2)
- **[med]** Pair crisis/hot color with a glyph or text band (e.g. a small ⚔ / 'CRISIS' tag), and flatten the 8 boxes into 2-3 spacing-grouped clusters (Calendar | Conflict | Faith) instead of 8 equal frames. — _Two-channel encoding + anti-box-soup + ~3 perceivable levels._ (P7)


#### War & Diplomacy (LiveWarStatus)
*File:* `src/components/map/LiveWarStatus.jsx`
*Purpose:* Live war/siege/deployment/trade-war/disposition standings read from the post-pulse worldState, the causal proof that the war engine actually ran.
*Layout today:* A Section with grouped subheads (Active sieges / Armies abroad / Trade wars / War standings); each item a StatusRow with a colored left-border (red=danger, teal=trade, gold=neutral) + bold title + sub detail. Standings render as wrapped W/L chips.

| Q | Verdict | Finding |
|---|---|---|
| Make causal coherence visible — WHY this state? | **good** | Titles encode causality ('The War of {target}: a coalition besieges the walls', deployment 'Home garrison thinned, war chest bleeding' lines 73-93). This is the surface most aligned with P2 — the simulation's reasoning is legible. |
| Front-load & chunk — keyword-first subheads? | **good** | Subheads 'Active sieges / Armies abroad / Trade wars / War standings' (lines 64-113) are information-bearing and chunked for the scan. |
| Encode state in ≥2 channels — not color-only? | **good** | StatusRow pairs tone color with the colored LEFT BORDER + explicit text title/detail (lines 30-44); meaning is not color-alone. War standings chips pair color with 'W/L' text (lines 116-130). |
| Emphasis on change — deltas vs absolutes? | **adequate** | It surfaces live state (who besieges whom) which IS the change vs peacetime, but doesn't show trend (e.g. 'siege entered tick 14, 2 fronts up from 1'). Deployment shows 'since tick' (line 92) which helps. |
| Borders vs whitespace — row frames? | **adequate** | StatusRows are bordered boxes (line 35) but grouped by subhead with gap:14 between clusters (line 61) — spacing does some grouping work here, better than the dashboard. |
| Coherence — named entities consistent? | **good** | All entities resolved via nameFor(nameById,...) (line 26-28), matching the names used in Pulse/Chronicle. Consistent across tabs. |
| Trust — can the GM verify derivation? | **adequate** | It states outcomes credibly but links to no underlying roll; the Pulse tab's Roll Explanations carry that. Acceptable division but the two aren't cross-linked. |

*Overhaul:*
- **[med]** Add a one-line trend to each live row ('siege began tick 12 · 2 fronts, up from 1') and a cross-link from a siege/trade-war row to its originating Pulse roll explanation. — _Emphasize change + let the expert verify how results were derived (trust is the product)._ (P3)
- **[low]** Keep this layout as the template the Dashboard should imitate — its causal titles + 2-channel rows + spacing-grouped subheads are the strongest pattern in the surface. — _Cross-cutting cohesion; the best pattern should propagate, not be a one-off._ (P6)


#### World Pulse Results (WorldPulsePanel)
*File:* `src/components/map/WorldPulsePanel.jsx`
*Purpose:* The post-advance digest: pending proposals (apply/dismiss), active stressors & echoes, latest-pulse outcomes, impact digest, and roll explanations — the engine's receipts.
*Layout today:* A bordered section with an icon-badge header (campaign · tick · season · mode · intensity · N pending) and an auto-fit multi-column grid of Sections, each rendering OutcomeCards or empty notes. Pre-canon, it shows a single 'Canonize the world first' OutcomeCard.

| Q | Verdict | Finding |
|---|---|---|
| Engineer the peak — is this the 'real engine' moment? | **adequate** | The content (rolls with probability/severity/chance pills, lines 391-419; proposals with reasons) is the proof-of-engine payoff. But it's presented as a flat multi-column grid of equal Sections (lines 191-200) with no narrative arc or 'here's what just changed' headline — the peak is buried in a spreadsheet of cards. |
| Front-load & chunk — most table-relevant first? | **weak** | Section order is LiveWar, Pending Proposals, Stressors, Latest Pulse, Impact Digest, Roll Explanations. The auto-fit grid (line 197) lets these flow into columns in arbitrary visual order at different widths, so 'what do I act on now' (proposals) isn't reliably top-left. |
| Primary CTA discipline — proposal actions clear? | **adequate** | Apply (good) / Dismiss (danger) SmallButtons per proposal (lines 229-244) are appropriately scoped; busy states handled. Fine for a multi-item list. |
| Error messages — plain language + recovery? | **good** | actionError surfaces 'Proposal update failed: …' / 'Canonize failed: …' in a red banner (lines 123-127, 206-210) — domain-ish and visible, though without an explicit next-step CTA. |
| Progressive disclosure — leads with essentials? | **weak** | Everything (rolls, digest, stressors) is dumped at once across columns; Roll Explanations (deep verification detail) sits as a peer Section rather than a progressive 'show the math' disclosure. Upfront dump vs P1's progressive disclosure. |
| System status — was the advance staged? | **weak** | This panel shows RESULTS but the advance itself (triggered in WorldMap.jsx:531) gives no staged progress; the panel just appears populated. The >10s op lacked stage feedback (see toolbar finding). |
| Borders vs whitespace — card grid? | **weak** | Section→OutcomeCard→inner borders create deep nesting; empty notes are themselves dashed boxes (e.g. lines 211-214). Many frames within frames within the rail. |
| Match real world / no engine jargon? | **adequate** | Mostly clean (proposals, stressors, sieges). 'propagationMode', 'intensity', 'candidate(s)', 'drift item(s)' (lines 184-186, 327) leak engine-model terms into the header/summary — borderline jargon for a GM. |

*Overhaul:*
- **[high]** Lead the Pulse panel with a single narrative 'What changed this tick' summary card (deltas + the 1-2 headline events), then disclose Proposals (act-now), then collapse Roll Explanations / Impact Digest behind a 'Show the simulation's reasoning' expander. — _Engineer the peak + progressive disclosure: give the emotional 'the world moved' beat first, math on demand._ (P9)
- **[med]** Replace the free-flowing auto-fit grid with a fixed priority order (Proposals → What changed → Live war → deep detail) so the act-now content is always top-left. — _Front-load for the GM's eye-path; the action the GM must take shouldn't reflow to a random column._ (P6)
- **[low]** Rename header chips to GM language: 'propagationMode'→'Spread', 'intensity'→'Drama', 'candidate(s)'/'drift'→'changes considered/applied'. — _Domain-native language, no engine internals leaking._ (P11)


#### Pantheon (PantheonPanel + AssignDeityFromMap)
*File:* `src/components/map/PantheonPanel.jsx`
*Purpose:* The living-faith view: deities grouped by tier (Major/Minor/Cult) with seats + W/L + 'from Major' progress + a coupling explainer, plus Realm Arcs and Conversion Contests; self-hides when religion is dormant.
*Layout today:* Bordered section, icon-badge header, scroll body: Realm Arcs (gold left-border rows) → tier groups (colored uppercase subheads + DeityRows) → Conversion Contests rows. DeityRow has a collapsible 'How this faith couples' disclosure.

| Q | Verdict | Finding |
|---|---|---|
| Make causal coherence visible — WHY faith state? | **good** | Conversion Contests ('X (3 seats) vs Y (1 seat): contesting Z', lines 167-175) and the coupling explainer (describeDeityEffects, lines 205-225) expose the causal mechanism — strong P2. |
| Progressive disclosure — depth on demand? | **good** | DeityRow coupling effects are behind a per-row expander (lines 207-225) — leads with seats/record, reveals coupling on demand. Good P1/P19. |
| Optimality — hierarchy & one focal? | **adequate** | Tier color (violet shades) + uppercase subheads give 3 levels; but Major/Minor/Cult colors (#7c3aed/#9333ea/#a78bda, line 26) are near-identical purples — weak differentiation between the most and least important tiers (size/weight don't escalate with tier). |
| Empty state — dormant handled? | **good** | Dormant copy 'Assign a primary deity to a settlement to awaken the realm's faith' (lines 127-130) is instructive and on-theme; tab also self-hides via hasPantheon. |
| Borders vs whitespace? | **adequate** | DeityRows are bordered with a tier-color left-border (line 192) carrying semantic meaning consistently — a legitimate use of the colored left border per P-borders. |
| Accessibility — tier in ≥2 channels? | **weak** | Tier is conveyed by left-border color + a capitalized text tag (line 203) — two channels, OK — but the three purples are too close to distinguish at AA; relies on the text tag to disambiguate. |
| Coherence — deity names consistent? | **good** | deityName resolves from settlement snapshots with a display-name fallback (lines 37-45), consistent within the panel. |

*Overhaul:*
- **[med]** Differentiate tiers by weight/size too, not just three similar purples (Major larger/bolder; Cult muted/smaller), and reserve color contrast for AA. — _Build hierarchy from ≥2 channels; the most important faith tier should dominate the scan._ (P4)
- **[med]** Surface a faith DELTA on Realm Arcs / DeityRows ('+1 seat this tick', 'rising'), matching the War tab's living-state framing. — _Emphasize change — faith winning converts over time is the point._ (P3)


#### Layers Panel
*File:* `src/components/map/LayersPanel.jsx`
*Purpose:* Right rail of checkbox layer toggles (settlements, relationships, chains, regional channels/impacts, roads, labels, markers, native borders/cultures) with per-type filter chips and a severity slider.
*Layout today:* 240 bordered card; header 'Layers' + close; scrolling list of LayerToggle rows; expandable filter-chip sub-lists indented SP.md; a 'Map features' divider group at the bottom.

| Q | Verdict | Finding |
|---|---|---|
| Cognitive load & choices — ~7±2 grouped? | **weak** | ~11 top-level toggles plus nested chip lists (lines 112-240). Only one divider ('Map features', line 223) groups them; the first ~9 are an ungrouped list well past 7±2. |
| Recognition vs recall — chip colors map to map? | **good** | Filter chips use the same colors as the edges they control (REL_TYPES + regionalChannelColor, lines 124-156) — recognition matches the map and the Legend. |
| Accessibility — toggles labeled, keyboard, targets? | **adequate** | Real checkboxes with htmlFor + aria-label (lines 246-272). Touch target is the padded label row; chips are small (3px/8px padding, line 284) — likely under 44px (P-accessibility risk). |
| Borders vs whitespace? | **adequate** | The list itself is borderless rows inside one card (good); chips add visual density but are contained. |
| Match real world — 'GM regional channels' clear? | **weak** | 'GM regional channels' / 'Regional channels' / 'Regional impacts' (lines 143-207) are model-ish; a GM may not distinguish 'regional channels' from 'relationships' without the legend. |
| Distinctness from Routes toolbar? | **weak** | Relationship filtering exists in BOTH LayersPanel (lines 122-133) and RoutesToolbar (lines 100-138) with DIFFERENT chip colors (#0f766e vs #4A7A3A for trade) — duplicated control, inconsistent color, two places to do the same thing (violates shared-action consistency). |

*Overhaul:*
- **[high]** Unify relationship filtering between LayersPanel and RoutesToolbar (same colors, ideally one source of truth) so a shared control looks and behaves identically. — _Shared actions must look/sit identically everywhere; two divergent copies erode trust._ (P11)
- **[med]** Group toggles into labeled clusters (Settlements & Routes | Simulation overlays | Annotations | Map features) using spacing + one subhead each. — _Chunk within 7±2; let the GM find the layer family fast._ (P5)
- **[low]** Rename 'GM regional channels'/'Regional channels' to plain terms tied to the Legend (e.g. 'Causal links (GM-only)'). — _Domain language; reduce the model-leak._ (P11)


#### Map Legend
*File:* `src/components/map/MapLegend.jsx`
*Purpose:* Bottom-left collapsible key for relationship colors, war/faith channels, spatial war glyphs, and impact-magnitude scale.
*Layout today:* Default-collapsed pill; expands to a 232px card with grouped swatch+label rows (Relationships / War & Faith / Impact magnitude).

| Q | Verdict | Finding |
|---|---|---|
| Recognition — does it decode the map's glyphs? | **good** | Comprehensive swatches incl. deployment arrow, siege+coalition badge, occupation shading, trade-war prize, mobilizing arc (lines 117-149) — genuinely decodes the spatial language. Strong recognition aid. |
| Default state — clean first view? | **good** | Default-collapsed (line 72) keeps the first map view clean while remaining one click away — good restraint. |
| Coherence — colors match the layers/edges? | **adequate** | REL_KEYS colors (lines 22-28) match LayersPanel REL_TYPES, but NOT RoutesToolbar's REL_TYPES (different greens/blues) — so the Legend agrees with one filter UI and disagrees with the other. |
| Accessibility — color paired with shape/label? | **good** | Every row pairs a swatch with a text label, and glyph rows use distinct shapes (arrow/ring/diamond) — not color-alone. |
| Placement — collides with anything? | **good** | Bottom-left, z-20, explicitly positioned to avoid the right-dock Inspector (lines 76-83). |

*Overhaul:*
- **[med]** Make the Legend the single color source of truth and reconcile RoutesToolbar/LayersPanel to it (one palette). — _A legend that disagrees with the filter chips is a visible contradiction._ (P2)
- **[low]** Auto-expand the relevant Legend group when the GM enters Routes mode or toggles a war overlay on. — _Information scent at the moment of need without permanent clutter._ (P6)


#### QuickInspector + PlacementDetailCard
*File:* `src/components/map/QuickInspector.jsx`
*Purpose:* Hover-peek (name/tier/pop + pressure sentence + top hook) and the click-selected placement card (stats + Open/Remove).
*Layout today:* Both top-right of the map; QuickInspector is a pointer-events:none parchment card with gold left-border; PlacementDetailCard is a 260 bordered card with header + body + Open(primary)/Remove(danger). QuickInspector hides when a selection is active so they don't collide.

| Q | Verdict | Finding |
|---|---|---|
| Runnability — grab essentials at a glance mid-session? | **good** | QuickInspector surfaces pressure sentence + top Tier-A hook (lines 113-144) — exactly the runnable essentials a GM wants on hover, before committing to the dossier. |
| Placement — competing for the same corner? | **adequate** | Both occupy top-right (QuickInspector top:12/right:12; card top:SP.md/right:SP.md) and also overlap the PlacementDetailCard zone the PlacementDetailCard doc claims is reserved; QuickInspector self-hides on selection (line 51) so they don't show simultaneously, but they share the slot with QuickInspector's own peek vs the toolbar above. |
| Distinctness — peek vs committed card clear? | **good** | Peek labeled 'PEEK' eyebrow (lines 100-106) vs the bordered 'Settlement' card with actions — clearly different commitment levels. |
| Primary CTA — first click on the card obvious? | **good** | PlacementDetailCard Open is primary (flex:1), Remove is danger/subordinate (lines 119-137) — clean P8. |
| Consistency — QuickInspector uses local theme constants? | **weak** | QuickInspector.jsx:31-38 re-declares GOLD/INK/BODY/serif/sans locally instead of importing from theme.js (unlike every sibling). A drift risk if the palette changes — and a maintenance/trust inconsistency. |
| Coherence — names match other surfaces? | **good** | Resolves from the same saves store; name/tier/pop consistent with palette and dossier. |

*Overhaul:*
- **[low]** Import shared tokens in QuickInspector instead of re-declaring GOLD/INK/serif locally. — _Cross-surface consistency + prevents silent palette drift._ (P11)
- **[low]** Reserve distinct corners (or stack with offset) for the hover peek vs the toolbar status so neither is ever clipped under the toolbar on short viewports. — _Placement by importance; avoid overlap with the height-constrained stage._ (P8)


#### Simulation Rules Dialog
*File:* `src/components/map/SimulationRulesDialog.jsx`
*Purpose:* Expert configuration: propagation/intensity/migration selects, 12 core system toggles, 3 advanced living-world gates (War layer / Settlement strategy / Religion dynamics), plus presets.
*Layout today:* Dialog with selects (Field+Select), a grid of 12 Toggle checkboxes, and a separate 'advanced' group of 3 gates each with a one-line explainer.

| Q | Verdict | Finding |
|---|---|---|
| Progressive disclosure — essentials first, depth on demand? | **adequate** | Presets (toolbar chips) provide the zero-config path; this dialog is the expert matrix (15 toggles + 3 selects). The 3 advanced gates are correctly separated with explainers (lines 58-65). But the 12 core toggles are an undifferentiated grid with no per-toggle 'what it does'. |
| Match real world — toggle labels GM-legible? | **weak** | Core toggle labels (lines 36-49) like 'Emergents', 'Tier drift'→'Promotion/demotion', 'Institution lifecycle' are terse/model-ish; only the 3 advanced gates carry explanations. |
| Error prevention — defaults + reversibility? | **adequate** | normalizeSimulationRules + DEFAULT_SIMULATION_RULES (line 8) supply safe defaults; presets give a recovery path. Dialog is non-destructive (settings, reversible). |
| Cognitive load — 15 toggles? | **weak** | 15 toggles + 3 selects in one dialog is heavy; the very thing presets exist to avoid. Acceptable as an expert accelerator IF the default path (presets) is prominent (it is, in the toolbar). |
| Accessibility — labels associated? | **good** | Field uses useId + cloneElement to inject ids; Toggle uses htmlFor+useId (lines 75-117) — proper label association. |

*Overhaul:*
- **[med]** Add a one-line 'what it does' under each of the 12 core toggles (as the 3 advanced gates already have), or tooltip them. — _Domain-native legibility; an expert still benefits from knowing what 'Emergents' changes._ (P11)
- **[low]** Show the active preset at the top of the dialog and a 'reset to preset' so the matrix reads as 'tuning a preset' not 'configure from scratch'. — _Progressive disclosure with strong scent; ties the expert matrix back to the zero-config path._ (P1)


### Surface: Compendium reference (standalone /compendium route + in-app panel). Mounted at App.jsx:577 as <CompendiumPanel standalone />. Two top-level modes — Built-in Catalog (8 tabs + global type-ahead + per-tab search) and My Custom Content (premium authoring manager) — toggled by a segmented control. Files: src/components/CompendiumPanel.jsx and src/components/compendium/*.

**Cross-cutting:**
- DEAD CONTROLS (highest-severity cross-cutting): the per-tab 'Search...' box is wired to 4 of 8 catalog tabs only. TiersTab is passed search={q} but ignores it (signature destructures _search, CatalogTabs.jsx:21 vs CompendiumPanel.jsx:142); EconomyTab/ArcaneTab/LivingWorldTab accept no search prop at all. A GM typing in the box on those tabs sees nothing happen — a correct-button-mapping failure that undermines trust in the whole reference. Either wire them all or hide the box per-tab.
- TWO SEARCHES, INCONSISTENT SCOPE & COVERAGE: the global search (indexed in domain/compendium/searchIndex.js) does NOT cover Institutions (the largest catalog) or Living World, while the per-tab Institutions box DOES find them. So the same query 'granary' succeeds in one box and fails in the other — a visible contradiction (P2 cardinal sin). The two boxes also look identical with no scope cue. Make global search a strict superset and label scopes ('Search the whole Compendium' vs 'Filter this tab').
- LABEL DRIFT ACROSS SURFACES: the global-search result category 'Magic & Religion' (searchIndex.js:93 / CAT_COLOR) names a tab actually labelled 'Religion & the Pantheon' (CompendiumPanel.jsx:16). HelpPopover topics ('magic-level') and the legacy #magic anchor also straddle old/new naming. Pick one canonical name per section and use it in tab label, search category, and anchor.
- SUB-LEGIBLE, AA-FAILING MICRO-TYPOGRAPHY: FS.nano(8px)/micro(9px)/xxs(10px) carry real content across the custom-content forms, dependency chips, field hints (CustomContent.jsx:428), and count lines, frequently in MUTED — which the tokens themselves flag as failing AA on parchment for body text (tokens.js:451-453). Reference + authoring text the user must read should be FS.xs minimum and off MUTED.
- BORDER-SOUP / UNIFORM HAIRLINE RHYTHM: the prose catalog tabs separate every row with a full-width 1px border (no spacing-based grouping), and the Custom tab stacks 4-5 bordered strips inside the already-bordered page card (false floors). The surface leans on borders where differential spacing + a single tint should carry grouping (P5).
- NO STANDALONE PAGE IDENTITY: the standalone route opens straight into the mode toggle with no H1/subtitle (App.jsx:577). The surface's identity ('the rules behind every dossier') lives only in document.title. Add a real header so the 5-second test and recalled-message land.
- SILENT ASYNC STATE: customContentLoading/customContentError exist in the store but are discarded into _-prefixed vars (CustomContent.jsx:249-250) and never rendered — no skeletons, no failure message on a premium synced write surface (violates P10).
- SELECTED-SEGMENT INCONSISTENCY: at least three visual languages for 'active choice' coexist — gold-underline tab strip, variant='primary' filter chips (Power), and coloured-outline category pills (custom content). Unify into one selected-segment treatment for cross-surface consistency (P11).
- EMPTY-STATE GAPS: Power and Institutions grids render an empty grid with no recovery copy when a filter/search yields nothing; the empty custom bucket gives instruction-only copy with no one-click sample even though 'Start from a built-in' is right there. Every zero-state should explain + offer a one-click out.
- WHAT WORKS — PRESERVE: the single-source-of-truth wiring (DeityEffectPreview and the Arcane axis effects both read describeDeityEffects/DEITY_AXIS_EFFECTS, the same the engine uses), the derived reverse-link dependency model with dangling-ref warnings, the honest faction-via-event and dormant-pantheon framing, and the read-only grandfathered preview on the upgrade wall are exactly the coherence-is-the-product, honest-provenance behaviours the north star demands. Keep these and extend the 'this will do X' preview idiom to stressors/institutions.


#### Standalone page frame & mode toggle
*File:* `src/components/CompendiumPanel.jsx:182-236`
*Purpose:* Frame the whole reference as a page and let the GM choose between the built-in catalog (read) and their own authored content (write). It is the surface's entry point and the only place the two halves are distinguished.
*Layout today:* A single PAGE_MAX card (border + xl radius + ELEV[1]). Top is a #F5EDE0 strip with two equal flex:1 buttons: 'Built-in Catalog' (gold when active) and 'My Custom Content' (violet/ai when active, with a count pill). Below it, in catalog mode: the global search bar, then the tab strip, then a second per-tab search row, then the scrollable content well. There is NO page H1, no 'Compendium' title, no one-line statement of what this surface is — the card opens straight into the toggle.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test: can a GM tell what this page is for, who it's for, and what to do next? | **weak** | Standalone mount (App.jsx:577) renders the bare card with no H1/eyebrow/intro. The first thing the eye hits is two equal-weight toggle buttons and THREE stacked controls (global search, tab strip, per-tab search) before any content. 'Compendium' as a recalled identity is carried only by the nav item and document.title (CompendiumPanel.jsx:124), never on-screen. The takeaway 'this is the reference manual for the simulator' does not land in 5s; a card that opens on 'Built-in Catalog \| My Custom Content' reads as a settings pane. |
| Distinctness from siblings (Library/Gallery/Compendium/Realm)? | **adequate** | It follows the sibling 'framed card with a tab strip' pattern (HowToUse.jsx:457 is identical scaffolding), so it doesn't read as a different app — but that very sameness plus the missing title means a GM landing mid-flow can confuse it with How-To. The gold-vs-violet mode toggle is the only strong distinguishing mark and it is small. |
| Primary CTA discipline: one high-emphasis primary per region? | **weak** | The mode toggle uses TWO high-emphasis fills side by side (variant 'gold' and variant 'ai', CompendiumPanel.jsx:188-194) at flex:1 each. Two filled equal buttons compete; neither is subordinate. For a reference page the dominant intent is 'read the catalog', so 'Built-in Catalog' should be the resting/selected state and 'My Custom Content' a clearly secondary affordance — not a co-equal violet fill. |
| Width & responsive: routed through caps, prose held to measure? | **good** | Standalone frames at PAGE_MAX (line 184); prose/row tabs cap at PROSE_MAX, grid tabs (power/institutions) fill to 100% then reflow via auto-fill minmax (lines 177-180). This is disciplined and correct. |

*Overhaul:*
- **[high]** Add a real page header above the card in standalone mode: an H1 'Compendium' (serif, FS.h1) with a one-line subtitle 'How the simulator builds and runs a settlement — the rules behind every dossier.' Only in standalone; embedded panel keeps its host heading. — _Fixes the 5-second test and the recalled-identity gap; a reference manual must announce itself. Right now the surface's purpose lives only in the browser tab._ (P6)
- **[med]** Demote the mode toggle to a single-primary pattern: render it as a true segmented control where 'Built-in Catalog' is the default selected segment and 'My Custom Content' is a quieter segment (outline + violet count pill), not a second filled button. Keep the violet only on the active-custom state. — _Two co-equal filled buttons violate one-primary-per-region and make the resting state ambiguous._ (P8)
- **[med]** Collapse the triple control stack: in catalog mode, fold the per-tab 'Search...' box into the global search (one search to rule the page) OR visually subordinate it (it currently looks identical to the global bar and duplicates intent). — _Two near-identical search inputs 6px apart is box-soup and choice overload at the top of the page; the GM cannot tell which one searches 'everything' vs 'this tab'._ (P5)


#### Global type-ahead search
*File:* `src/components/compendium/CompendiumGlobalSearch.jsx`
*Purpose:* One search across every built-in section: type, pick a result, the parent switches to the owning tab and scrolls to the anchor. The fast path for a GM who knows the term but not the tab.
*Layout today:* Gold-search-icon input in a CARD pill on a PARCH strip; absolutely-positioned dropdown listbox with term (bold) + an uppercase category pill colour-coded by CAT_COLOR. Full keyboard support (arrows/Enter/Esc), click-outside close, empty-state message.

| Q | Verdict | Finding |
|---|---|---|
| Correct button→function mapping / does it cover the catalog? | **weak** | The index (domain/compendium/searchIndex.js:53-130) covers tiers, routes, threat, economy, arcane, stress, neighbour, archetypes, neighbour-relationships — but NOT the Institutions tab (the largest catalog, ~40+ entries shown via getFullCatalogWithTierMeta) and NOT the Living World tab. A GM globally searching 'granary', 'mill', or 'World Pulse' gets the no-match empty state even though Institutions' own per-tab search finds 'granary'. That is a visible contradiction between the two search boxes. |
| Match real-world domain language? | **weak** | The result category pill reads 'Magic & Religion' (searchIndex.js:93, CAT_COLOR key) but the tab it lands on is labelled 'Religion & the Pantheon' (CompendiumPanel.jsx:16). Same destination, two names — a coherence/consistency miss the lore-fluent reader will notice. |
| System status & perceived speed / accessibility? | **good** | role=combobox + aria-expanded/aria-controls, role=listbox/option with aria-selected, arrow/Enter/Esc handling, hover sync (lines 109-168). Solid a11y. Results are memoised and instant. |
| Empty state quality? | **adequate** | 'No matches for X. Try a tier, archetype, route, or stress name.' (line 182) is helpful and on-brand, but it omits the two biggest categories the user is most likely to search (institutions, living-world) precisely because they aren't indexed — so the suggestion can mislead. |

*Overhaul:*
- **[high]** Index the Institutions catalog and the Living World groups into searchIndex.js so global search is a superset of every per-tab search. At minimum, lazily index institution names+desc from getFullCatalogWithTierMeta. — _The product promise is 'find anything fast'; a global search that silently misses the largest section breaks trust and contradicts the per-tab box._ (P2)
- **[med]** Rename the search category label 'Magic & Religion' → 'Religion & the Pantheon' to match the tab label exactly (one canonical name everywhere). — _Named-entity/label consistency across surfaces is the difference between 'simulator' and 'sloppy generator'._ (P11)
- **[low]** Differentiate the two search affordances explicitly: this global bar placeholder is good ('Search the whole Compendium…'); make the per-tab box read 'Filter this tab…' so their scopes are unmistakable. — _Recognition-over-recall: the GM should never have to remember which box is which._ (P6)


#### Catalog tabs — prose/row tabs (Tiers, Economy, Arcane, Living World, Stress, Neighbour)
*File:* `src/components/compendium/CatalogTabs.jsx:21-213`
*Purpose:* Document the simulation's rules as scannable reference: tier bands, trade routes, threat, economy model, the pantheon axes/effects, the living-world substrate, stress conditions, and neighbour relationships.
*Layout today:* Each tab is an intro <p> then either a list of label+desc rows separated by 1px bottom borders, or a stack of accented left-border Cards. Headings are serif FS['14']. Colour-coded by domain (danger red, gold, green, blue, violet).

| Q | Verdict | Finding |
|---|---|---|
| Does the per-tab search actually work on every tab? | **broken** | TiersTab is rendered with search={q} (CompendiumPanel.jsx:142) but its signature destructures _search (CatalogTabs.jsx:21) and ignores it entirely — the tier/route/threat list is never filtered. Type 'port' while on the Tiers tab and nothing happens. EconomyTab, ArcaneTab, and LivingWorldTab take NO search prop at all (lines 46,117,168), so the per-tab search box is silently dead on 4 of 8 catalog tabs. |
| Layout & spacing-as-grouping (squint test)? | **weak** | Every row is divided by a 1px BORDER bottom-rule (e.g. lines 27,33,39,131,206). The rhythm is uniform full-width hairlines, so clusters do NOT emerge from spacing — it reads as one undifferentiated ledger. P5 wants spacing-first grouping; this is border-soup. Mixed within a tab: Tiers/Neighbour use bordered rows while Economy/Arcane use bordered Cards, so the same surface has two visual grammars. |
| Scannability & content / front-loading? | **adequate** | Headings are keyword-first and good ('Trade Route Access', 'Monster Threat'). Labels are bold and left-aligned (good top-left-fact placement). But the Economy/Arcane Cards bury the scannable fact inside prose paragraphs rather than a delta/condition-first line. |
| Emphasis on change / 'living world' is the hero? | **weak** | This is static-stat documentation by nature, acceptable for a reference, but the Living World tab (lines 168-179) — the one place that should sell 'causal change over time' — is five identical grey Cards of prose with no example of an actual delta ('food -2 → unrest rising'). The peak moment of the surface is rendered as the flattest content. |
| Trust/credibility & coherence? | **good** | Pantheon axis effects are pulled from the shared DEITY_AXIS_EFFECTS single source (lines 11,89-107) so the reference can't drift from the engine — exactly the visible-coherence the audience needs. One typo risk: StressTab desc fallback is `\|\| ', '` (line 197), which prints a stray comma-space if a stress has no description. |

*Overhaul:*
- **[high]** Fix the dead search: give TiersTab a real `search` prop and filter all three of its lists (tiers/routes/threat); pass and apply `search` in EconomyTab, ArcaneTab, LivingWorldTab. Or hide the per-tab search box on tabs that don't support it — never show a control that does nothing. — _A search box that silently no-ops on half the tabs is the cardinal correct-button-mapping failure and erodes trust in the whole surface._ (P8)
- **[med]** Replace the per-row 1px hairlines with spacing-as-grouping: drop most borders, use tighter gaps within a section and a clear larger gap (space scale) between sections, reserving a tint/left-accent only for the section header. Unify on ONE grammar (rows OR cards) across all prose tabs. — _Anti-box-soup; let whitespace carry grouping so the GM's eye chunks the reference instead of reading a uniform ledger._ (P5)
- **[med]** Make the Living World tab the surface's peak: lead it with a concrete worked example of a tick ('food deficit + contested legitimacy + nearby war → tension ↑, a proposal queued') before the five system Cards, with one real delta glyph set. — _This is where 'a real engine, not a roll' must land; right now it is the flattest content on the page._ (P9)
- **[low]** Fix the StressTab empty-description fallback from `', '` to a real placeholder or omit the line. — _A stray ', ' is a visible typo on a trust surface._ (P11)


#### Catalog tabs — grid tabs (Power & Factions, Institutions)
*File:* `src/components/compendium/CatalogTabs.jsx:57-78,215-245`
*Purpose:* Browse the ~40+ archetypes and the full institutional catalog as a filterable card grid — the densest, most reference-heavy tabs.
*Layout today:* Power: a row of category filter Buttons (All/Economic/Military/…) then an auto-fill minmax(240px) grid of cards (name + category Tag + italic condition + desc, coloured left-border by category). Institutions: an italic count line then an auto-fill minmax(200px) grid of cards (name + optional Core tag + category tag + desc).

| Q | Verdict | Finding |
|---|---|---|
| Does it fulfil its purpose / progressive disclosure? | **adequate** | Institutions shows 'first 48 of N' (line 231) and tells the user to search — reasonable cap. But there is no 'show all' without typing, and the count line is MUTED italic (color:MUT, line 230) — the one piece of state the user needs, rendered in the lowest-contrast style on the tab. |
| Design optimality / hierarchy (≥2 channels, ≤3 levels)? | **good** | Archetype cards build hierarchy from serif+700+INK name vs italic muted condition vs SEC desc, with a coloured left-border + category Tag (two channels for category). Within the squint test the card name dominates. This is the strongest-built part of the surface. |
| Filter consistency with the rest of the app? | **weak** | Power's category filter uses variant 'primary' for the active chip (CatalogTabs.jsx:64) while the custom-content category pickers use a coloured-outline pill pattern (CustomContent.jsx:179-194), and the catalog tab strip uses gold-underline. Three different 'selected segment' visual languages inside one surface. |
| Empty state when a filter/search yields nothing? | **broken** | Neither grid handles zero results. PowerTab filtering to a category+search with no matches renders an empty grid with no message (lines 66-76). Institutions with a non-matching search shows '0 results' (line 231) then an empty grid — no recovery guidance. |

*Overhaul:*
- **[med]** Add a real empty state to both grids: when filtered.length===0 show 'No archetypes match "X" in {category}. Clear the filter or try another term.' with a one-click reset. — _Empty-state guidance + recovery; an empty grid is a dead-end._ (P10)
- **[med]** Unify the active-filter visual language across Power chips, the catalog tab strip, and the custom-content category pills into one selected-segment treatment. — _Three selection grammars in one surface taxes recognition and reads as inconsistent craft._ (P11)
- **[low]** Promote the Institutions count/state line out of MUTED into a readable weight, and add a 'Show all N' affordance so the 48-cap isn't a hidden wall. — _The one status line a user relies on shouldn't be the lowest-contrast text on the tab; de-emphasise neighbours, not the load-bearing fact._ (P4)


#### Custom Content manager (authoring)
*File:* `src/components/compendium/CustomContent.jsx:242-585`
*Purpose:* Premium authoring of institutions, services, resources, trade goods, stressors, factions, deities, and discovered supply chains, organised into two lanes (Settlement Content vs Living World), with dependencies that wire content into generation.
*Layout today:* ContentPackBar, then two labelled lanes of category pills, then conditional strips (Pantheon activation / Faction event / Supply chains), then Add/Start-from-built-in/Test affordances, then the add/edit form (purple-tinted), then the item list (violet left-border cards with attribute chips + dependency summaries).

| Q | Verdict | Finding |
|---|---|---|
| Cognitive load & progressive disclosure on the form? | **weak** | The form (renderForm, lines 415-451) dumps every field for the bucket as a flat vertical stack of label+control+italic hint (institutions has 13 fields). Each hint is FS.micro (9px) italic MUTED (line 428) — below legible body size and below AA on parchment. There is no essentials-first / advanced-collapsed split; a GM adding 'a custom tavern' faces the full schema upfront. |
| Error prevention & recovery / reversibility? | **good** | Save is disabled until name is non-empty (lines 447,292), delete routes through DeleteConfirmation with a clear 'catalog only, existing settlements keep their copy' detail (lines 571-577), and import re-validates + reports skipped items (ContentPackBar.jsx:67-77). Cancel is always present. |
| Empty state (two parts instruction, one delight)? | **weak** | Empty bucket shows only 'No custom {x} yet. Click "Add" to create one.' (line 536) — pure instruction, no delight, no one-click sample/template even though 'Start from a built-in' exists right above and would be the perfect sample CTA to surface inside the empty state. |
| System status / loading & error feedback? | **broken** | The store exposes customContentLoading and customContentError but they're pulled into _-prefixed (intentionally unused) vars (lines 249-250) and never rendered. A slow cloud sync shows no skeleton and a sync failure shows nothing — silent failure on a premium write surface. |
| Accessibility of the form? | **weak** | Labels wrap controls with htmlFor (good), but field hints at FS.micro=9px italic MUTED (line 428) and pill buttons at FS.xxs=10px (line 348) are below readable size and MUTED fails AA on parchment (per tokens.js:451-453 comment). The dense 9–10px chrome is a contrast/size accessibility miss. |
| Match real-world / no engine jargon leak? | **adequate** | Mostly domain-native. But field labels are auto-derived by splitting camelCase (line 425), so 'tierMin'→'tier Min', 'alignmentAxis'→'alignment Axis' leak the schema's internal field shape rather than clean GM labels ('Smallest tier', 'Alignment'). |

*Overhaul:*
- **[high]** Render customContentLoading (skeleton) and customContentError (plain-language banner with a retry CTA) instead of discarding them into _-vars. — _A premium write surface that fails silently is the worst trust outcome; status + recovery is mandatory for synced mutations._ (P10)
- **[high]** Split the authoring form into essentials-first (name, category, description) with an 'Advanced attributes' progressive-disclosure section for the long tail; bump field hints from FS.micro to at least FS.xs and off MUTED to an AA-passing body colour. — _Reduce upfront cognitive load and fix sub-legible AA-failing helper text; the paying GM scans, they don't read a 13-field wall._ (P1)
- **[med]** Give each field a clean human label map instead of camelCase-split ('tierMin'→'Smallest tier', 'alignmentAxis'→'Alignment'). — _Domain language; 'alignment Axis' leaks engine internals into the GM's view._ (P11)
- **[med]** Upgrade the empty bucket state with a one-click 'Start from a built-in {institution}' sample CTA pulled from the seed picker. — _Empty-state best practice and goal-gradient; the sample path already exists, just surface it where the user is stuck._ (P9)


#### Custom Content supporting strips (PackBar, Pantheon, Faction, SupplyChains, DeityPreview, Dependencies)
*File:* `src/components/compendium/ContentPackBar.jsx, PantheonActivationStrip.jsx, FactionEventBanner.jsx, SupplyChainsManager.jsx, DeityEffectPreview.jsx, Dependencies.jsx`
*Purpose:* Teach and operate the living-world authoring model: export/import packs, the dormant→assigned→dynamics activation ladder, the faction-enters-via-event honesty note, discovered supply-chain verification, live deity-effect preview, and dependency wiring with reverse-links.
*Layout today:* Each is a left-accented strip/card. Pantheon is a 3-milestone checklist with Live/Dormant badge + deep-link buttons. SupplyChains has confirmed (green) + pending (amber) sections with name-and-confirm rows. DeityEffectPreview is a 'This god will…' bulleted list from the shared source. Dependencies render refId chips with dangling-ref warnings and derived reverse-links.

| Q | Verdict | Finding |
|---|---|---|
| Make causal coherence visible / trust is the product? | **good** | This cluster is the surface's strongest expression of the north star: DeityEffectPreview reads couplings from the SAME describeDeityEffects the engine uses (DeityEffectPreview.jsx:26-28), Dependencies derives reverse-links instead of fragile back-writes and flags dangling refs (Dependencies.jsx:47-68,120-127), and the Pantheon strip makes the dormant-until-live causal chain explicit. Honest, coherent, extensible. |
| Error messages in plain language with a next step? | **good** | PackBar import errors are domain-phrased ('Could not read the file.', 'Invalid pack.', 'N skipped (invalid).' ContentPackBar.jsx:59-76). Dangling-ref warning tells the user exactly what to do ('Edit this item to fix.' Dependencies.jsx:125). |
| Primary action discipline within each strip? | **adequate** | Mostly clean (secondary/ghost link buttons). One issue: the SupplyChains pending row places Confirm (success) and Reject (danger) at equal size adjacent (SupplyChainsManager.jsx:121-126) — destructive should be smaller/separated per Fitts + serial position. |
| Encode state in ≥2 channels? | **good** | Pantheon milestones pair check/circle icon + colour + bold label (PantheonActivationStrip.jsx:57-67); Live/Dormant badge pairs colour + text. SupplyChains uses colour + section heading + left-border. State is multi-channel throughout. |
| Borders vs whitespace (anti-box-soup)? | **weak** | Inside the Custom tab the user can face a vertical stack of 4+ bordered/tinted strips (PackBar, lanes, Pantheon strip, seed-picker box, form box, bordered item cards) — nested boxes within the already-bordered standalone card. That's the false-floor / box-soup risk the principles warn about. |

*Overhaul:*
- **[med]** Reduce nested chrome in the Custom tab: let the lane grouping and supporting strips sit on spacing + a single subtle tint rather than each having its own full border; flatten the seed-picker and form from bordered boxes into spaced regions. — _Anti-box-soup; a column of 4-5 bordered cards inside a bordered page card reads as stacked false floors._ (P5)
- **[low]** In SupplyChainsManager, make Reject a smaller ghost/text button and separate it from the success Confirm so the destructive action isn't equal-weight adjacent. — _Destructive actions small and separated; protects against mis-clicks during verification._ (P8)
- **[low]** Keep the DeityEffectPreview/Dependencies single-source-of-truth pattern and extend the 'this will do X' preview idiom to stressors/institutions where couplings exist. — _This is the coherence-is-the-product peak working correctly; replicate it._ (P2)


#### Premium gate / upsell (Custom Content for free & anon)
*File:* `src/components/compendium/CustomContent.jsx:101-225`
*Purpose:* Convert free/anon users on the Custom Content tab while letting grandfathered local items remain browseable read-only.
*Layout today:* Centered gradient card: violet Sparkles disc, 'Custom Compendium (Premium)' serif title, value prose (≤460px), a gold grandfathered-count note, then either a sign-in nudge (anon) or an 'Upgrade to Premium' violet button. Below it, a read-only list of any local items by category.

| Q | Verdict | Finding |
|---|---|---|
| Engineer the negative peak as a preview, not a denial? | **good** | Grandfathered items stay browseable read-only (lines 155-225, opacity 0.85 'Local' tag), and the upsell leads with what you GET (author institutions, pantheon, packs, cross-device sync, lines 122-129) rather than 'locked'. This reframes the wall as a preview reasonably well. |
| One unambiguous primary action / first click? | **good** | Single 'Upgrade to Premium' ai-variant button for signed-in users (line 146); anon sees a plain-text 'Sign in and upgrade' line with no decoy button. Correct first click is obvious for the paid path. |
| Error/limit message reframed as upgrade moment? | **adequate** | The gate is reframed positively, but the anon path is weaker: it's a plain MUTED sentence (line 144) with no actual sign-in CTA button — the user must hunt for sign-in elsewhere. A goal-gradient nudge ('Sign in free, then upgrade') with a button would convert better. |
| Accessibility / contrast of the upsell? | **adequate** | Title and body are readable, but the gold grandfathered-note uses color:GOLD on a faint gold tint (lines 134-135) which is borderline for AA, and the anon nudge is MUTED. |

*Overhaul:*
- **[med]** Give the anon path a real button ('Sign in to start' → auth modal) instead of a passive MUTED sentence, preserving the upgrade as the second step. — _First click must land; an anon converter shouldn't dead-end on grey text._ (P8)
- **[low]** Recolour the grandfathered-count note to an AA-passing ink-on-tint and pair the gold with an icon so meaning isn't colour-only. — _AA contrast + two-channel encoding on the parchment/gold palette._ (P7)


### Surface: ABOUT / HOW-TO + comparison content — src/components/HowToUse.jsx (the 8 guide tabs), src/components/howto/LivingWorldTab.jsx, src/components/howto/UnderTheHoodTab.jsx, and the dead-code src/components/ComparePage.jsx (every /compare* route redirects to /howto?tab=compare via App.jsx:212-214, so ComparePage is never imported or rendered).

**Cross-cutting:**
- DEAD CODE / LOST FUNNEL: ComparePage.jsx (547 lines, the richest comparison content with real <table> grids, per-page ForgeCTA, GalleryNudge, and a card landing) is entirely unreachable — App.jsx:212-214 redirects every compare* route to howto?tab=compare and never imports ComparePage. The live CompareTab that replaced it is three prose blocks with no table and no CTA, a strict downgrade in both information and conversion. Either revive it inside the tab or delete it.
- ZERO CTAs ACROSS THE GUIDE: the entire 8-tab About surface (HowToUse) has no primary action anywhere — no 'Generate', no 'Sign up', no 'See Pricing', no 'Open Realm'. Quick Start says 'Hit Generate' with no button; the value ladder defines per-rung CTAs in en.js that LivingWorldTab never renders. The most-read teaching surface dead-ends every reader (violates P8/P9).
- NO PAGE-LEVEL IDENTITY / SEMANTICS: no <h1>, no surface eyebrow/title, and most section headings are styled <div>s not real <h2>/<h3>. The surface fails the 5-second test (no 'About SettlementForge — a simulator for DMs' anchor) and gives screen readers/SEO a flat heading tree. The dead ComparePage, ironically, has proper PageTitle/h1/h2 and table semantics.
- ENGINE-JARGON LEAKS: UnderTheHoodTab (and likely the aboutLiving copy LivingWorldTab pulls) expose the banned internal vocabulary — 'substrate', 'nine pressure axes', 'fifteen causal variables', 'war_drain', 'war_exhaustion', 'settlement strength dial'. The principles explicitly forbid leaking engine internals (worldPulse/canonStatus class); rewrite to GM-facing language.
- BOX-SOUP + FLAT HIERARCHY: Under the Hood (16 identical gold-left cards), DM Philosophy (7), and the Insight pattern generally stack same-styled bordered cards at a uniform 14px margin with no focal point and one perceivable level. Grouping is carried by borders, not spacing; lists routinely exceed 7±2 (12 Generation mechanics, 12 detail-tab rows) with no sub-chunking or ranking. Reduce borders, lead with spacing, and give each tab one focal entry.
- OFF-SCALE SPACING + WIDTH INCONSISTENCY: gaps are hardcoded magic numbers (28/22/14/18/16, padding '24px 28px', columnGap '22px') rather than SP/space tokens; widths are inconsistent (full PAGE_MAX content well with no inner cap, vs CompareTab's one-off maxWidth:760, vs PROSE_MAX 820 defined-but-unused). Long prose runs edge-to-edge past 75ch. Route all prose through PROSE_MAX and use the space scale.
- NAMING + COPY INCONSISTENCIES (trust): PowerTab repeatedly says 'Settlements tab' while nav and RefTab say 'Library'; routes.js titles still name real competitors ('vs ChatGPT/Worldographer/Kanka') against category-only on-page copy; and PhilosophyTab line 228-229 has a fused-word typo ('arrive**disappointment**'). For an audience that judges the product on coherence, these visible contradictions are disproportionately damaging.
- DUPLICATE / OVERLAPPING TABS: Power User vs Reference restate neighbour-linking and campaign workflow nearly verbatim; Reference's Compendium/Living-World sections restate the real Compendium; Under the Hood and DM Philosophy are visually identical Insight grids. Consolidate ownership so content has one home and tabs are visually distinct.
- DEAD NON-STANDALONE BRANCH: HowToUse.jsx:492-524 is a second near-identical copy of the tab shell that App never mounts (only <HowToUse standalone /> is used). Two divergent shells invite drift; delete the unused one.


#### HowToUse shell + tab bar
*File:* `src/components/HowToUse.jsx:442-525`
*Purpose:* The single 'About' surface: a tabbed guide reachable from the footer (App.jsx:624) and the primary nav. Frames SettlementForge as a simulator and teaches a GM how to run it.
*Layout today:* A PAGE_MAX card with a horizontal scrolling tab strip of 8 tabs (Quick Start, Power User, The Living World, Under the Hood, DM Philosophy, Reference, How We Compare, FAQ) over a 24x28px-padded content well. Active tab = CARD background + 2px gold underline + bold; inactive = transparent + MUTED + weight 500. URL ?tab= deep-links a tab. A second, near-identical non-standalone branch (lines 492-524) renders the same tabs in a 60vh-scroll panel but is never mounted (App only calls <HowToUse standalone />).

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test: can a GM tell what this is, who it's for, and what to do next? | **weak** | The surface opens on Quick Start (line 446-451 default), which leads with '#1 On the Create tab...' steps — good for a doer — but there is no page-level H1, no 'About SettlementForge' title, and no eyebrow identifying the surface. A GM landing here from the footer sees a bare tab strip; the recalled message 'this is a SIMULATOR for DMs' is buried inside the right-hand 'Why it works this way' column, not stated up top. The 8 tabs themselves are the only orientation. |
| Layout & spacing-as-grouping: do chunks emerge from spacing, and are gaps on the scale? | **weak** | Gaps are hardcoded off-scale magic numbers throughout (gap:28, gap:22, marginBottom:14/18/16, padding:'24px 28px', columnGap:'22px' at lines 13,145,161,478) rather than the space-1..space-12 / SP tokens used by ComparePage. The rhythm is roughly uniform 14px between every Insight card, so within-cluster vs between-cluster spacing does not differentiate groups; grouping is carried entirely by borders, not whitespace. |
| Distinctness from siblings (Library/Gallery/Compendium/Realm)? | **adequate** | The tabbed-card shell is visually distinct enough from list-based surfaces, but it is nearly identical in chrome to CompendiumPanel (also rendered as `<… standalone />` at App.jsx:577-578) — both are PAGE_MAX cards with tab strips. The Reference tab (RefTab, line 330) is itself a mini-Compendium of nav/tab/workflow definitions, creating functional overlap a GM could confuse with the real Compendium. |
| Primary CTA discipline: one high-emphasis primary action per region? | **broken** | The entire 8-tab guide contains zero CTAs. Quick Start tells the GM to 'Hit Generate' (line 135) but offers no button to get to Create; The Living World's value-ladder rungs define copy CTAs ('Forge a settlement', 'Create a free account', 'See what the Realm unlocks' in en.js) but LivingWorldTab.jsx:40-57 renders only eyebrow/tier/body and drops the cta field entirely. The redirect-killed ComparePage had a proper ForgeCTA on every page; folding it into the tab lost every conversion exit. |
| Button→function mapping & dead controls? | **broken** | ComparePage.jsx (547 lines) is fully dead: App.jsx:212-214 redirects all four compare* views to howto?tab=compare and never imports ComparePage, so its richer 7-8 row comparison tables, ForgeCTA, and GalleryNudge are unreachable. The CompareTab that replaced it (HowToUse.jsx:387-425) is three prose Insight blocks with no table and no CTA — a strict downgrade in both information and funnel. routes.js:50-53 still advertises /compare/chatgpt etc. with stale named-competitor titles ('vs ChatGPT', 'vs Kanka') that contradict the category-only on-page copy. |
| Width & responsive: prose held to 45-75ch, no full-bleed? | **weak** | Content well is PAGE_MAX (1200) with NO inner max-width (comment at line 476-477 explicitly opts out). Tabs that aren't multi-column run prose edge-to-edge of a 1200px card far past the 75ch measure: FaqTab (line 427), and the dark intro cards in QuickTab/Philosophy/Living (e.g. conceptIntro line 78, full-width gradient paragraphs). CompareTab pins maxWidth:760 (line 389) inconsistently. PROSE_MAX (820) exists in the tokens (theme.js) but is never applied here. |
| Accessibility (POUR): contrast, 2-channel state, semantics? | **weak** | Tabs use aria-pressed (line 466) but are not a real role=tablist/tab/tabpanel pattern, so the panel relationship and arrow-key navigation are absent. There are no <h1>/<h2> landmarks on most tabs — section titles are styled <div>s (e.g. lines 125,163,217), so screen-reader/SEO heading structure is flat. Inactive tab color is MUTED on PARCH (decorative gray on cream) at small FS.sm/xs, a likely sub-4.5:1 risk. Insight titles in GOLD on CARD (line 34) at FS.xs are a known parchment/gold contrast risk. |
| Trust/credibility: zero typos/inconsistencies? | **broken** | PhilosophyTab line 228-229 has a broken sentence: 'What you find when you arrive<strong>disappointment</strong>' — the period and space before 'disappointment' are missing, so two words collide on screen in the DM Philosophy tab (the one selling coherence and honesty). The same paragraph mis-punctuates the three-item list with periods where commas belong. Trust copy with a visible typo undercuts P2. |

*Overhaul:*
- **[high]** Add a real surface header above the tab strip: eyebrow 'GUIDE', H1 'How to run SettlementForge', one-line lede 'A simulator for Dungeon Masters — generate a coherent town in seconds, then run the region for years.' Make it a semantic <h1>. — _Passes the 5-second test and lands the intended takeaway ('a SIMULATOR for DMs') as the recalled message instead of burying it in a side column._ (P6)
- **[high]** Fix the line 228-229 sentence (add '. ' before 'disappointment') and re-punctuate the discovery/disappointment/ingenuity list with commas. Proofread all gradient-card prose. — _A visible typo on the page that argues for coherence and honesty is the cardinal trust sin for this audience._ (P2)
- **[high]** Delete ComparePage.jsx OR re-route it: if the rich comparison tables and per-page ForgeCTA are wanted, render ComparePage for compare* views instead of redirecting; otherwise remove the 547-line dead file and the stale named-competitor titles in routes.js:50-53. — _547 lines of unreachable code with a superior comparison table and CTA is both maintenance debt and a lost SEO/funnel asset; the live CompareTab is a strict downgrade._ (P8)
- **[high]** Restore conversion exits inside the guide: render the value-ladder CTAs in LivingWorldTab (wire the dropped t('valueLadder.rungs.*.cta')), and add one ForgeCTA-style primary button at the end of Quick Start ('Generate your first settlement') and How We Compare. — _Every flow must close on a runnable next step; a guide with zero CTAs is a dead-end that fails the peak/end and first-click principles._ (P9)
- **[med]** Apply PROSE_MAX (820) / ~45-75ch to all single-column prose tabs (FAQ, Philosophy intro, Quick concept, Living thesis) and replace the maxWidth:760 magic number with the shared cap. — _Long-form lore past 75ch on a 1200px card is hard to scan; width must route through shared caps, not per-tab guesses._ (P12)
- **[med]** Convert the tab strip to a proper ARIA tablist/tab/tabpanel with roving-tabindex arrow-key nav, and promote section titles to real <h2>/<h3>. — _Keyboard operability and semantic heading structure are POUR requirements and currently absent._ (P11)
- **[med]** Replace hardcoded gaps (28/22/14/18/16) with SP/space tokens and widen between-section gaps relative to within-section, so cluster grouping reads from spacing before borders. — _Uniform 14px rhythm and off-scale numbers create box-soup grouping; spacing should carry the structure._ (P5)
- **[low]** Delete the dead non-standalone branch (lines 492-524) since App only ever mounts standalone. — _Two divergent copies of the same tab shell invite drift and contradict the single-source principle._ (P11)


#### Quick Start tab
*File:* `src/components/HowToUse.jsx:71-157`
*Purpose:* The default landing tab: teach a newcomer the 60-second happy path to a first dossier, then explain why the engine works the way it does.
*Layout today:* Two-column flex on wide screens: left (flex 2) = 'First settlement in 60 seconds' with numbered Step components + one inline italic sub-bullet + a Tip; right (flex 1) = 'Why it works this way' over a dark gradient concept card with five bolded mini-essays (constraint-driven, coherence, narrative refinement, AI prompt). Wraps to one column under ~760px.

| Q | Verdict | Finding |
|---|---|---|
| Does it fulfil its purpose (complete the primary task)? | **adequate** | The 6 numbered steps (lines 128-137) are accurate and well-front-loaded, but the page can't actually launch the task it describes — no link to Create. It documents the path rather than starting it. |
| Progressive disclosure: leads with essentials, depth on demand? | **weak** | The right column dumps ~250 words of constraint-driven/coherence/refinement theory (lines 78-119) inline and always-open, directly competing with the action steps for the squint. The 'why' is depth that should be collapsed or moved to Under the Hood, not co-equal with the 60-second path. |
| Design optimality: hierarchy from >=2 channels, one focal point? | **weak** | Two side-by-side serif headings of equal weight/size (FS.lg 600 at lines 125 and 150) create two competing focal points; the dark gradient card actually out-weighs the step list visually, so the eye lands on theory, not action — inverting the intended hierarchy. |
| Match real world (no engine jargon)? | **good** | Copy stays in GM language (tier, trade route, terrain, faction, dossier, DM Summary). No seed/RPC/worldPulse leaks in this tab. |
| Scannability: keyword-first headings, prose-to-read vs data-to-scan? | **adequate** | Steps are scannable with bolded keywords, but the right column is five dense prose blocks each opening with a bold term then a period-fragment style ('Most generators roll on a table. This one simulates. Every output.' line 85-86) — staccato sentence fragments that read as data but are prose, blurring the prose/scan distinction. |

*Overhaul:*
- **[high]** Collapse the 'Why it works this way' column into a single 2-3 sentence thesis plus a 'Read Under the Hood' link; move the four mini-essays to the Under the Hood tab where they belong. — _Restores a single focal point (the 60-second path) and removes the upfront theory dump._ (P1)
- **[high]** Add a primary 'Open Create' / 'Generate your first settlement' button as step 0 or after step 6. — _The page's primary task is generating; the first click must land somewhere._ (P8)
- **[med]** Demote the right-column heading to a smaller, lighter treatment so the steps win the squint test. — _Two equal serif headings violate the one-focal-point cap; de-emphasize to emphasize._ (P4)


#### Power User tab
*File:* `src/components/HowToUse.jsx:159-210`
*Purpose:* Teach the paying/expert GM the accelerators: sliders, stress conditions, institution forcing, neighbour linking, campaign management, map placement.
*Layout today:* A single responsive column container (COLS(360)) flowing three NO_BREAK sections (Sliders/Stress, Linking Neighbours, Managing Saved Settlements) into 1-2 newspaper columns; each section = serif heading + intro paragraph + numbered Steps + a Tip.

| Q | Verdict | Finding |
|---|---|---|
| Scannability & content for the expert scanner? | **good** | Headings are keyword-first ('Sliders, Stress & Institution Control', 'Linking Settlements as Neighbours'), facts are bolded, and the mechanical Tips (e.g. 'A Rival suppresses overlapping exports', line 191) give the depth a Cartographer pays for. Strong layer-cake structure. |
| Recognition vs recall / cross-surface consistency of terms? | **weak** | The copy says 'Settlements tab' (lines 184,186,188,190) but the live nav and RefTab (line 334) both call it 'Library' — an internal naming contradiction within the same surface that forces the reader to map two names to one place. P2's named-entity-consistency rule is violated for a navigation label. |
| Borders vs whitespace (anti-box-soup)? | **adequate** | This tab is mostly border-free (relies on column flow + Step rows), which is good, but the multi-column flow can split a 6-step list awkwardly across columns despite NO_BREAK on the section, so step 1 and step 4 can sit in different columns mid-procedure. |
| Match real world (no engine jargon)? | **good** | Domain-native throughout (relationship types, exports, dependency chains, legitimacy). No internals leak. |
| Distinctness / does it duplicate Reference? | **weak** | The neighbour-linking and campaign content here (lines 186-206) is re-stated almost verbatim in RefTab's 'Settlement Workflow' rows (lines 353-359), so two tabs of the same surface carry duplicate instructions that can drift. |

*Overhaul:*
- **[high]** Rename every 'Settlements tab' reference to 'Library' to match the nav and RefTab. — _A visible naming contradiction inside one surface is exactly the coherence break the audience punishes._ (P2)
- **[med]** De-duplicate against RefTab: let Power User own the how-to procedures and have Reference link to them, or vice versa, instead of maintaining both. — _Duplicate instructions across sibling tabs invite drift and add cognitive load._ (P11)
- **[low]** Force numbered procedures to stay in a single column (wrap each Steps list in its own NO_BREAK block or use a single-column layout for procedural sections). — _A procedure split across two newspaper columns breaks the goal-gradient reading order._ (P6)


#### The Living World tab
*File:* `src/components/howto/LivingWorldTab.jsx:91-118`
*Purpose:* Bridge from the static free dossier to the premium living simulation: thesis, a 3-rung value ladder (anon tries / free saves+full-size / premium simulates), and one card per premium living system.
*Layout today:* Dark gradient thesis card, then ValueLadder (three flex cards, color-coded top borders: green/gold/violet), then an intro line, then a COLS() flow of violet-left-bordered LivingSystemCards (title + premium chip + claim + 'How it stays coherent' line + opt-in/reversible qualifier).

| Q | Verdict | Finding |
|---|---|---|
| Plays on human psychology (goal-gradient, peak/end)? | **adequate** | The 3-rung ladder is a strong goal-gradient/upgrade device with lens-tailored headlines (line 28), but it drops the rung CTAs: en.js defines valueLadder.rungs.*.cta ('Forge a settlement' etc.) yet the component (lines 40-57) never renders the cta field, so the ladder shows the desire without the action. |
| Encode state/emphasis in >=2 channels (P7)? | **good** | Premium is signalled by violet color AND a text 'premium' chip AND a left border AND the qualifier line (LivingSystemCard lines 70-86) — multi-channel, not color-alone. Rung accents pair color with an uppercase eyebrow label. |
| Emphasis on change (deltas/trends)? | **good** | This tab is the only one that genuinely sells movement: the value-ladder 'simulates' rung and the system cards lead with change ('wars ignite and end, faiths rise, trade routes flip, a chronicle writes itself'). Aligns with P3. |
| Match real world (no engine jargon)? | **weak** | Depends on en.js copy not loaded here, but the file derives systems from tx('aboutLiving.systems') (line 92) and the UnderTheHood sibling leaks 'substrate', 'pressure axes', 'war_drain', 'war_exhaustion', 'settlementStrength' (UnderTheHoodTab.jsx:143-169) — engine-internal variable names the principle list explicitly bans (worldPulse-class). The Living World tab risks the same if its copy mirrors that vocabulary. |
| Cohesion / handoff to upgrade flow? | **weak** | It sells Cartographer-tier simulation but provides no link to Pricing or Realm; the premium chips are informational with no path to act, so the upsell dead-ends. |

*Overhaul:*
- **[high]** Render the rung CTAs (wire t('valueLadder.rungs.*.cta')) as buttons/links: anon→Create, free→sign-up, premium→Pricing/Realm. — _A value ladder that names the next rung but offers no way to climb it wastes the goal-gradient peak._ (P9)
- **[med]** Audit aboutLiving copy for engine-internal terms (substrate, pressure axis, war_drain) and rewrite to GM-facing language; reserve the variable-name vocabulary for Under the Hood at most. — _Leaking engine internals is the named anti-pattern that makes a 'simulator' read as a leaky prototype._ (P11)
- **[med]** Add a single primary 'See the Realm' / 'Compare plans' CTA at the end of the systems list. — _Close the upsell loop on a runnable next step rather than a wall of chips._ (P8)


#### Under the Hood tab
*File:* `src/components/howto/UnderTheHoodTab.jsx:43-173`
*Purpose:* Prove the engine is a real simulation by explaining its two layers: 12 GENERATION mechanics (how one town is derived) and 4 SIMULATION mechanics (how the region moves over time).
*Layout today:* SectionHead + a COLS() flow of 12 gold-left-bordered Insight cards (Generation), a 1px divider, then SectionHead + COLS() flow of 4 Insight cards (Simulation). Insight = uppercase gold FS.xs title + FS.sm body paragraph.

| Q | Verdict | Finding |
|---|---|---|
| Cognitive load & choices (lists within 7+-2)? | **weak** | The Generation section is 12 equally-weighted Insight cards in one undifferentiated grid (lines 49-135) — far past 7+-2 with no sub-grouping, no priority ordering, and no way to tell the load-bearing mechanic (Constraint-Driven) from a detail (Magic as Economic Buffer). It is a flat wall of 12 same-styled boxes. |
| Borders vs whitespace (anti-box-soup)? | **weak** | 16 identical bordered+gold-left cards stacked at uniform marginBottom:14 is textbook box-soup; whitespace carries nothing and every card screams for equal attention. The colored left border is decorative-uniform here, not semantic (it doesn't distinguish Generation gold from any state). |
| Match real world (no engine jargon)? | **broken** | The Simulation section leaks raw engine internals the principles explicitly ban: 'Fifteen Causal Variables: the Substrate' (line 143), 'Nine Pressure Axes' (line 151), 'war_drain', 'war_exhaustion' as code identifiers (line 159), 'settlement strength' as a dial name. This is the worldPulse/canonStatus class of leak — the GM is shown the variable taxonomy, not the world. |
| Design optimality: one focal point, <=3 levels? | **weak** | Across 16 cards there is no focal point and effectively one perceivable level (every card identical in size/weight/color). The two SectionHeads are the only hierarchy, and they're the same FS.lg/600 as headings elsewhere, so the layer split is faint. |
| Trust/credibility: lets the GM verify derivation? | **good** | The content itself is the strongest trust asset on the surface — concrete causal claims ('remove the mill and the grain surplus collapses, exports drop, prosperity slides within a generation', lines 125-126) directly serve P2's 'make causal coherence visible'. The substance is excellent; only the packaging and jargon hurt it. |

*Overhaul:*
- **[high]** Cut/merge the 12 Generation Insights to ~6-7 grouped mechanics, lead with Constraint-Driven as a single focal card (larger/heavier), and demote the rest into a tighter scannable list. — _16 equal boxes blow past 7+-2 and leave no focal point; chunk and rank for the scan._ (P4)
- **[high]** Rewrite Simulation copy into GM language: 'the forces pressing on a settlement' not 'nine pressure axes'; 'war wears a settlement down until it sues for peace' not 'war_drain / war_exhaustion / settlement strength dial'. — _Variable-name leaks are the cardinal jargon sin and make a premium simulator read like an engineer's debug panel._ (P11)
- **[med]** Replace the 16 bordered cards with spacing-grouped prose blocks under the two section heads (background tint per layer instead of per-card borders). — _Eliminate box-soup; let spacing and a single per-layer tint carry grouping._ (P5)


#### DM Philosophy tab
*File:* `src/components/HowToUse.jsx:212-316`
*Purpose:* The brand/voice essay: reframe the engine as 'discover your own world', and teach the philosophy of constraint, integration, downstream consequences, and mid-session use.
*Layout today:* Dark gradient opening card (3 paragraphs), then a COLS() flow of 7 gold-left-bordered Insight cards each a 60-100 word mini-essay.

| Q | Verdict | Finding |
|---|---|---|
| Trust/credibility: zero typos? | **broken** | Line 228-229 renders 'What you find when you arrive**disappointment**' — missing period+space, two words fused on screen, and the three-item list is mis-punctuated with periods. A typo in the tab whose entire thesis is honesty/coherence is the cardinal trust break (P2). |
| Scannability: prose-to-read vs data-to-scan, front-loaded? | **weak** | Seven dense full-prose Insight cards (lines 241-313) with no bold scannable facts and no front-loaded keyword — this is read-not-scan content styled in the same gold-left Insight box used for scannable tips elsewhere, so the visual promise (a tip card) mismatches the content (a paragraph essay). |
| Cognitive load: list within 7+-2, extraneous chrome? | **adequate** | Seven cards is at the 7+-2 ceiling and the essays are good, but all-equal weight again means no entry point; a GM skimming for the one actionable idea ('Using the Generator Mid-Session', line 305) has to read all seven. |
| Distinctness from Under the Hood? | **adequate** | Philosophy (why/voice) vs Under the Hood (how/mechanics) is a legitimate split, but both render as identical gold-left Insight grids, so they look like the same tab; the distinction is content-only, not visual. |
| Purpose & 5-second test? | **good** | The opening gradient line 'Discover your own world.' (line 218) lands the tab's intent immediately and is the strongest single hook on the surface. |

*Overhaul:*
- **[high]** Fix the line 228-229 punctuation immediately (period + space before 'disappointment', commas in the list). — _A fused-word typo on the honesty/coherence tab is the highest-severity trust defect on the whole surface._ (P2)
- **[med]** Promote the one operationally useful card ('Using the Generator Mid-Session') to the top with heavier treatment, and front-load each remaining essay with a bold lead clause. — _Give the skimming, time-pressured GM a focal entry and a scan path through read-heavy prose._ (P6)
- **[med]** Visually differentiate Philosophy (prose-to-read: serif, looser, no tip-style box) from the gold-left Insight boxes used for scannable mechanics. — _Prose-to-read must look different from data-to-scan; reusing the tip box mislabels the content._ (P6)


#### Reference tab
*File:* `src/components/HowToUse.jsx:319-382`
*Purpose:* A glossary/index of the whole app: Navigation, Settlement Detail Tabs, Settlement Workflow, World Map, Compendium, and Living World definitions in label→description Rows.
*Layout today:* COLS(360) flow of 6 RefSections; each = serif heading + a stack of Row components (bold label minWidth 120 + muted description, separated by 1px bottom borders).

| Q | Verdict | Finding |
|---|---|---|
| Does it fulfil its purpose (recognition reference)? | **good** | As a recognition-over-recall lookup it works: 6 well-chosen categories, label-first rows, accurate descriptions of every nav destination and detail tab (lines 332-375). This is the most utilitarian tab and earns its place. |
| Accessibility / semantics (real table headers)? | **weak** | It is visually a definition table but built from flex divs with bottom borders (Row, lines 62-69), not <dl>/<dt>/<dd> or a real table, so assistive tech gets no key→value structure. Compare ComparePage which uses proper <table>/<th scope>. |
| Match real world / cross-surface naming? | **good** | Uses the live nav names correctly (Create, Library, Realm, Compendium, About at lines 332-337), which actually exposes the PowerTab 'Settlements tab' inconsistency rather than committing it. |
| Distinctness from Compendium surface? | **weak** | RefTab's 'Compendium' and 'Living World' sections (lines 366-375) restate what the real Compendium contains, so a GM could read this as the reference and never visit the actual Compendium; the boundary between 'guide-about-Compendium' and 'Compendium' is muddy. |
| Cognitive load: lists within 7+-2? | **weak** | The 'Settlement Detail Tabs' section lists 12 rows (lines 339-352) in one ungrouped block — past 7+-2 with no sub-chunking, though as a reference index this is more tolerable than in a teaching tab. |

*Overhaul:*
- **[med]** Render reference sections as semantic <dl> (or a real <table> with <th scope='row'>) instead of flex divs. — _A key/value reference must expose that structure to assistive tech._ (P11)
- **[low]** Make each Row label a deep-link to the actual surface it documents (Library row → open Library) so Reference becomes a launchpad, not a dead glossary. — _Turns recognition into action and resolves the dead-end; references shown in context._ (P8)
- **[low]** Trim or collapse the 12-row Detail-Tabs list into grouped clusters (At-the-table / Prep / Cross-settlement). — _Sub-chunk past-7 lists for scan._ (P6)


#### How We Compare tab (live) + ComparePage (dead)
*File:* `src/components/HowToUse.jsx:387-425 and src/components/ComparePage.jsx (whole file)`
*Purpose:* Position SettlementForge honestly against AI prose generators, map-first tools, and campaign wikis — the comparison/SEO content.
*Layout today:* Live CompareTab: a maxWidth:760 column with a serif heading, intro paragraph, three gold-left Insight prose blocks (vs AI / vs maps / vs wikis), and a closing Tip. Dead ComparePage: full SEO pages with PageTitle/eyebrow/lede, 6-8 row <table> comparison grids with check/x/partial icons (FeatureRow), ForgeCTA, and GalleryNudge per page, plus a 3-card landing.

| Q | Verdict | Finding |
|---|---|---|
| Button→function mapping & dead controls? | **broken** | ComparePage.jsx is never imported by App.jsx; App.jsx:212-214 redirects compare/compare-chatgpt/compare-worldographer/compare-kanka to howto?tab=compare. 547 lines including superior comparison tables and CTAs are unreachable. routes.js:50-53 still lists those paths with stale named-product titles ('vs ChatGPT', 'vs Worldographer', 'vs Kanka') contradicting the category-only on-page copy. |
| Does it fulfil its purpose (let a GM weigh tools)? | **weak** | The live CompareTab is three prose paragraphs — it asserts differences but provides no at-a-glance comparison; the scannable feature-by-feature table (the actual decision aid) lives only in the dead ComparePage. A skimming GM gets opinion, not a grid to verify. |
| Primary CTA discipline / funnel? | **broken** | The live CompareTab has no CTA at all; the dead ComparePage had a ForgeCTA + GalleryNudge on every page. Folding compare into a tab deleted the comparison surface's entire conversion path. |
| Trust/credibility: honest provenance, no inconsistency? | **adequate** | The live copy is honestly framed ('upfront about what the other tool does well', line 395) and category-level per spec, which is good; but the routes.js named-competitor titles still leak to search results, creating an honesty/consistency gap between meta and page. |
| Width & responsive? | **adequate** | CompareTab pins maxWidth:760 (line 389) — reasonable for prose, but it's a one-off magic number inconsistent with the rest of the surface which is full-PAGE_MAX, so the tab is noticeably narrower than its siblings with no rationale. |

*Overhaul:*
- **[high]** Decide and execute: either revive ComparePage's comparison <table> + ForgeCTA inside CompareTab (best — restores the decision grid and a CTA), or delete ComparePage.jsx and fix routes.js titles to category-level. — _The live tab is a strict downgrade from dead-but-better code; ship the table, not three paragraphs, and stop maintaining 547 dead lines._ (P8)
- **[high]** Add a primary 'Forge a settlement' CTA at the end of How We Compare. — _A comparison surface exists to convert the comparer; close on the next step._ (P9)
- **[med]** Update routes.js:50-53 titles to the category framing ('SettlementForge vs AI prose generators' etc.) to match on-page copy. — _Meta/title-vs-page contradiction undermines credibility and the no-named-competitor spec._ (P2)


### Surface: Public Gallery — community-shared settlements and maps. Files: src/components/GalleryPage.jsx (coordinator + tabs), src/components/gallery/* (list, card, sidebar filters, topbar search/sort, detail/dossier reader, comments, report dialog, moderation panel, maps grid, vote/share/import controls, load-more). The surface is the "social proof + SEO + inspiration" layer: it must prove the engine is a real SIMULATOR (not an AI generator), let a time-pressured GM scan and recognize a runnable settlement fast, and convert browsers into forgers.

**Cross-cutting:**
- DEAD TRUST COPY — the surface's reason to exist is unrendered. gallery.antiAi ('Every dossier was simulated, not AI-generated... coherent because the simulator made them so', en.js:412) and gallery.emptyTitle (en.js:415) exist in copy but are rendered NOWHERE (grep confirms zero references in src/components/gallery/). For this audience, 'simulator not generator' IS the north star and the conversion lever; the gallery is the prime place to assert it and it is silent. (P2/P9, high)
- SEARCH IS NOT DEBOUNCED — every keystroke triggers a full gallery refetch and list reset (galleryQuery includes search at useGalleryPageState.js:55, and the fetch effect depends on galleryQuery at lines 62-86). This is a real perf/UX defect that makes typing lag and the grid/count strip thrash. (P10, high)
- NO SKELETONS ANYWHERE — initial list load, filter/sort changes, dossier body lazy-load (GalleryDetail.jsx:243), and maps load all fall back to bare 'Loading...' text. An async grid product needs content-shaped skeletons; blank parchment reads as empty/broken. (P10, med)
- ENGINE-INTERNAL LEAK TO USERS — GalleryMaps.jsx:132 shows 'Needs migration 045 deployed.' to end users, a direct P11 violation; raw error strings are also surfaced verbatim in GalleryList.jsx:116 and via err.message in several catch blocks. (P11/P10, high)
- GOLD IS OVERLOADED — gold marks the active tab (GalleryPage), curated badge/glow (GalleryCard), vote-success, selected filter chips (GallerySidebar), and the 'Load more' button (GalleryList). With so many gold high-emphasis families, the single intended primary ('Forge your own') doesn't win the squint test. Reserve gold and demote secondary actions to outline/ghost. (P4/P8, med)
- SELECTION/STATE ENCODED BY COLOR ALONE in multiple places — filter chips (gold fill only, GallerySidebar.jsx:52) and voted state (success color, same thumb glyph). Add a glyph/shape/weight channel. (P7, high)
- NO LIVING-WORLD / CHANGE SIGNAL — neither the cards nor the detail hero lead with deltas/trends/anomalies (stability is a flat tag; no 'unrest rising', no 'advanced to year N'). The gallery is the best showcase for causal change over time and it presents static absolutes, making the engine look like a roll-table generator. (P3, med)
- TWO DIVERGENT GALLERY DIALECTS — GalleryMaps re-implements list/card/empty/error/back-button patterns instead of reusing GalleryList/GalleryDetail primitives (ad-hoc notices, '← Back to maps' literal vs shared ChevronLeft, FS.pico badges, swatch.*Bg fallbacks). The Maps tab reads as a different, less-finished app. (P11/P5, med)
- EMPTY/FILTERED-EMPTY NOT DISTINGUISHED and CTA-less — GalleryList's empty state (GalleryList.jsx:119-126) is prose-only with no button and looks identical whether nothing is published or filters zeroed out the results; no 'clear filters' recovery. (empty-state checklist/P9, high)
- TIER GATE = DENIAL, NOT PREVIEW — map import for non-premium is a button that only shows a scolding notice (GalleryMaps.jsx:58); should reframe as an upgrade preview routing to Pricing. (P9, high)
- OFF-SCALE SPACING & TINY TYPE — recurring raw gaps (6/8) inside cards/chips instead of the SP scale, and FS.xxs/FS.pico labels (GalleryCard tags, GalleryMaps badges/tags) that risk failing AA contrast/size at 4.5:1 / 44px. Audit gold-pill (white-on-GOLD) and muted-on-tint combinations. (P5/accessibility, med)
- DESTRUCTIVE ACTIONS UNGUARDED — comment Delete (GalleryComments.jsx:157) is one-click irreversible with no confirm/undo. (error prevention, med)
- UNLABELED SORT CONTROL — the topbar <select> has no visible label or aria-label (GalleryTopbar.jsx:48-64). (accessibility/recognition, med)


#### Gallery coordinator + tabs (Settlements | Maps)
*File:* `src/components/GalleryPage.jsx`
*Purpose:* Top-level switch between the Settlements browse list and the Maps browse grid; owns route slug → detail handoff and wraps each region in an error boundary.
*Layout today:* A row of two Button tabs (gold when active, ghost otherwise) at PAGE_MAX, then either GalleryList or GalleryMaps inside a FeatureErrorBoundary. When activeSlug is set, the whole page is replaced by GalleryDetail.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test: can a GM tell what this page is for, who it's for, what to do next, and does 'a SIMULATOR for DMs' land? | **weak** | GalleryPage.jsx:17-37 renders only two bare tabs above the list; the page identity/title/subtitle live inside GalleryList header (GalleryList.jsx:78-83). The defining trust message gallery.antiAi ('Every dossier was simulated, not AI-generated') exists in copy (en.js:412) but is rendered NOWHERE in the surface — the single most important takeaway for this audience is dead copy. The takeaway that lands is 'a grid of towns', not 'a simulator'. |
| Distinctness from siblings (Library/Compendium/Realm): | **adequate** | The two-tab header + 'Forge your own' CTA + vote/comment chrome differentiate it from Library; but the card grid visually rhymes with Library/Realm tiles and nothing on the frame says 'public/community' at the page chrome level (only the subtitle inside the list header). A GM landing mid-scroll could confuse Gallery with their own Library. |
| Borders vs whitespace (anti-box-soup) at the tab/region level: | **adequate** | GalleryPage.jsx:122-124 wraps GalleryMaps in an extra padded div at PAGE_MAX while GalleryList manages its own PAGE_MAX wrapper (GalleryList.jsx:67) — inconsistent width ownership between the two tabs means the Maps tab and Settlements tab don't share a frame rhythm. |
| Cohesion with the whole flow (handoff in/out): | **good** | openDossier pushes a real route (useGalleryPageState.js:111) and back/forward sync the open dossier (useGalleryPageState.js:123-140); 'Forge your own' routes to generate (GalleryList.jsx:88). Clean handoffs, no dead-ends. |

*Overhaul:*
- **[high]** Render the gallery.antiAi trust line as a calm, persistent strip directly under the page title (one line, not a box), present on both tabs. This is the surface's reason to exist for this audience. — _The product's entire differentiator vs a 'generator' is that these are simulated, coherent worlds. Leaving that copy unrendered forfeits the conversion and trust peak the gallery is supposed to deliver._ (P9 (engineer the peak/trust) + north star (coherence is the difference between simulator and AI hallucination))
- **[med]** Move the page title/subtitle and tab strip into a single shared page header owned by GalleryPage, so both tabs sit under one identity frame and one width cap; let GalleryList/GalleryMaps render only their content. — _Today identity is buried inside GalleryList and Maps has none, so the Maps tab reads as a different page. One header = one recalled 'this is the community gallery'._ (P12 (width discipline, frame-not-fullbleed) + P6 (structure for the eye-path))
- **[med]** Style the tabs as a real tablist (role=tablist/tab, underline-active pattern) rather than two gold/ghost Buttons that read as competing CTAs next to the gold 'Load more' and gold filter chips. — _Gold is overloaded across this surface (active tab, curated badge, vote-success, load-more, filter chips). A gold tab competes with the actual primary action._ (P8 (one primary per region) + P11 (web conventions/ARIA))


#### Settlements browse list (GalleryList)
*File:* `src/components/gallery/GalleryList.jsx`
*Purpose:* The main browse surface: header + 'Forge your own' CTA, sidebar filters, search/sort topbar, responsive card grid, status banners, empty state, and load-more.
*Layout today:* PAGE_MAX wrapper. Header is a 2-col grid (title/subtitle | primary CTA). Then action banners. Then a 260px sidebar + main column grid; main holds topbar, error, empty state, an auto-fill card grid (min 270px), a 'loading more' line, and a gold 'Load more' button.

| Q | Verdict | Finding |
|---|---|---|
| Layout & spacing-as-grouping (squint test, scale gaps): | **adequate** | Gaps mostly use SP scale (GalleryList.jsx:67,75,97,127) — good. But the card grid uses raw '8' for internal card gaps (GalleryCard.jsx:110,157,175) and filter chips use raw 6/8 (GallerySidebar.jsx:28,48), so within-cluster rhythm is off-scale. The header's 'alignItems: end' (line 73) pins the CTA to the baseline of a 2-line subtitle, which looks accidental when the subtitle wraps. |
| Does it fulfill its purpose (browse → recognize → open): | **good** | Cards open the dossier (GalleryCard.jsx:60,113), filters/sort/search all wire through the hook, load-more paginates (GalleryList.jsx:143-154). The core browse task works. |
| System status & perceived speed (search debounce, skeletons): | **broken** | Search is NOT debounced: galleryQuery includes search (useGalleryPageState.js:55) and the fetch effect fires on every galleryQuery change (useGalleryPageState.js:62-86), so every keystroke triggers a network round-trip and a full list reset. There are also NO skeletons — initial load shows nothing until items arrive (GalleryList.jsx:119 only guards the empty state behind !listLoading), and the topbar just says 'Loading settlements...'. |
| Primary CTA discipline (one high-emphasis action): | **weak** | The header primary 'Forge your own' (GalleryList.jsx:85, variant primary) competes with a gold 'Load more' (line 146) and gold active tab and gold filter chips. Three gold/high-emphasis families on one screen dilute the single intended primary (forge). |
| Empty state (instruction + delight + one-click CTA): | **weak** | The empty state (GalleryList.jsx:119-126) renders only emptyBody as italic prose with an icon; the available gallery.emptyTitle (en.js:415) is unused, and there is no CTA button — the 'Forge your own' button sits far above in the header, so an empty gallery offers no in-place next action. Also it doesn't account for empty-because-of-filters vs empty-because-nothing-published (no 'clear filters' affordance when filters zero out results). |
| Error messages (plain language + CTA): | **weak** | List error prints 'Could not load the gallery: {raw err}' (GalleryList.jsx:116) — leaks the raw error string and offers no retry CTA, despite a clean gallery.loadError copy string (en.js:417) existing. Load-more failures set listError but the user is given no obvious retry path. |
| Borders vs whitespace (anti-box-soup): | **adequate** | Sidebar is a bordered tinted card (GallerySidebar.jsx:85-93), header is a tinted readable-surface, each card is bordered+shadowed, status banners are bordered — several stacked containers. The header tint + sidebar tint + card borders verge on box-soup; whitespace alone could carry the header. |
| Emphasis on change (deltas/anomalies): | **broken** | Cards and the list surface only static absolutes (population, tier, votes/views/comments). Nothing surfaces the simulation's living-world differentiator — no 'unrest rising', no stability delta, no 'advanced N years'. stability is shown only as a flat tag (GalleryCard.jsx:42). The list contradicts P3 entirely. |

*Overhaul:*
- **[high]** Debounce search (~250-300ms) in the hook before it enters galleryQuery, and keep the prior result list visible (dimmed) during refetch instead of resetting to empty. — _Per-keystroke network fetches are a correctness/perf bug and make typing feel laggy; resetting the grid to empty on every keystroke destroys the scan._ (P10 (status & perceived speed))
- **[high]** Rebuild the empty state with emptyTitle as a bold keyword-first heading + emptyBody + an in-place primary 'Forge your own' button; branch the copy when activeFilterCount>0 to 'No settlements match these filters' with a 'Clear filters' button. — _Empty states must instruct AND offer one-click action; the filtered-empty case currently looks identical to the never-published case, stranding the user._ (P9 (turn limits into next steps) + empty-state checklist)
- **[med]** Add card-shaped skeletons for the initial load (and for filter/sort changes), matching the grid template, instead of a blank area + topbar text. — _For an async grid this is the expected feedback; a blank parchment reads as 'broken' or 'empty' during the fetch._ (P10 + P12 (reflow))
- **[med]** Demote 'Load more' from gold to secondary/outline, keep 'Forge your own' as the only primary, and make filter chips secondary-on-selected via weight+check glyph rather than full gold fill. — _One primary per region; gold must mean one thing. Right now gold is the tab, the CTA-adjacent load-more, curated, and every selected filter._ (P8 + P4 (three-lever hierarchy) + P7 (encode selection in ≥2 channels))
- **[med]** Surface one living-world signal per card (e.g. a small stability glyph+label with tone, or 'advanced to year N' when the published dossier has a campaign arc) so the list proves the engine simulates over time. — _The gallery is the prime place to demonstrate causal change; static tags make it look like a table-roll generator._ (P3 (emphasize change) + P2 (causal coherence visible))
- **[med]** Replace the raw-error list banner with gallery.loadError plus a 'Retry' button, and add a retry affordance for load-more failures. — _Leaking raw error strings breaks trust and gives no recovery path._ (P10 (plain-language errors with CTA))


#### Gallery card (vote/share/open)
*File:* `src/components/gallery/GalleryCard.jsx`
*Purpose:* The repeated browse unit: image, vote/curated badges, title, meta, clamped description, tags, and a footer with vote/views/comments/share/date.
*Layout today:* Bordered+shadowed article; clickable image with absolute vote+curated badges top-left; padded body grid: title (as a ghost button), meta line, 2-line clamped description (sanitized HTML), up-to-5 tag chips, and a wrap footer of vote/views/comments/share + right-aligned date.

| Q | Verdict | Finding |
|---|---|---|
| Design optimality (hierarchy from ≥2 of size/weight/color, one focal point, ≤3 levels): | **weak** | The footer crams six peer elements at near-identical FS.xs/weight 800 (GalleryCard.jsx:175-194: vote, eye, comment, share, date) — no single focal point and >3 perceivable levels of muted metadata. The title (serif lg/700, INK) is the intended focus but the loud gold vote badge on the image (weight 950, GalleryCard.jsx:74-88) and the gold curated glow compete for first fixation. |
| Front-load/chunk for the scan (most table-relevant fact top-left): | **weak** | Top-left of the card is the vote count badge (GalleryCard.jsx:66-88), not a runnable fact. The GM-relevant identity (name, tier, terrain, stability) is below the image; the most table-relevant fact is not at top-left per P6. Meta is a single '/'-joined run (line 138) that's hard to scan. |
| Placement of every button/link by importance (Fitts/serial position): | **adequate** | Open is the whole image + the title button (good, large targets). Share is a low-frequency action sitting inline among metadata at equal weight (line 183) — fine, but it visually competes with vote. |
| Correct button→function mapping + shared icon/label: | **good** | Share uses Share2/Check + 'Copied' (GalleryCard.jsx:188-190) consistent with GalleryDetail (GalleryDetail.jsx:208-211); vote uses the shared VoteButton; open routes via onOpen(slug). Mappings are correct and consistent. |
| Accessibility (≥2 channels, contrast, targets): | **weak** | Vote/views/comments rely on icon+number (ok), but the curated state on the badge and the curated gold border/shadow lean on color; the 'Curated' text label helps on the badge though. swatch.white text on GOLD (GalleryCard.jsx:81-84) at FS.xxs/950 — small gold-bg pill contrast is borderline and should be verified ≥4.5:1. Tag chips at FS.xxs SECOND-on-CARD_ALT are tiny. |
| Trust/credibility (provenance, coherence): | **adequate** | sanitizeGalleryHtml guards the description (GalleryCard.jsx:154) — good. But the card shows no signal that this is engine-derived vs free-text; description is creator prose with no visual separation from data, and there's no 'simulated' provenance cue at card level. |

*Overhaul:*
- **[med]** Re-anchor the card: title top-left as the single focal point (it already is serif/lg), demote the vote badge off the image's top-left to the footer only, and keep on-image just the Curated badge (the one thing that needs to ride the image). — _P6 wants the most table-relevant fact top-left; a vote count is social metadata, not a runnable fact. Removing the duplicate vote (badge + footer VoteButton both show it) also de-duplicates._ (P6 + P4 (one focal point))
- **[med]** Collapse the footer's five peer metadata items into one quiet muted cluster (views/comments/date) plus the single interactive VoteButton, and move Share into a hover/affordance or the detail only. — _>3 muted peers at equal weight = no hierarchy and a noisy scan; share is rarely used from a browse card._ (P4 + P5 (quiet neighbors to emphasize) + P8)
- **[med]** Render meta as discrete labeled chips or a tier-led line (Tier first, bold) instead of a single capitalized '/'-joined string; visually distinguish creator-prose description (serif/italic) from data tags (sans). — _Layer-cake scanning needs data-to-scan distinct from prose-to-read (P6); the joined meta run is a wall._ (P6 + P2)
- **[med]** Add a small stability/state glyph+label with semantic tone to the card so the living-world state is legible at a glance, and verify gold-pill and tag-chip contrast to AA. — _P3/P7: state must show in ≥2 channels and the simulation's state is the hero; current tiny-color-only chips fail both._ (P3 + P7 + accessibility)


#### Filter sidebar (GallerySidebar)
*File:* `src/components/gallery/GallerySidebar.jsx`
*Purpose:* Faceted filtering by tier, terrain, government, magic, stability, plus boolean toggles (mine, has image/comments, curated) and a clear-all.
*Layout today:* Sticky bordered tinted aside (260px). Header row (slider icon + 'Filters' + conditional 'Clear'). Optional 'Yours' toggle. Then six sections of FilterChips (gold-on-selected) and a 'Surface' section of three checkboxes.

| Q | Verdict | Finding |
|---|---|---|
| Cognitive load & choices (7±2, grouping): | **weak** | Tier(7) + Terrain(10) + Government(9) + Magic(6) + Stability(5) chips = ~37 always-expanded chips plus 4 toggles (GallerySidebar.jsx:117-138, options from galleryUtils.js:1-5). Government has 9 and Terrain 10 — both exceed 7±2 with no collapse/show-more, so the sidebar is a dense wall the moment it loads. |
| Progressive disclosure (lead with essentials, reveal depth): | **weak** | All facets are expanded simultaneously (GallerySidebar.jsx:116-139). No accordion, no 'most-used first'. The expert GM scanning for 'town + coastal' must visually parse five fully-expanded chip groups. |
| Three-lever hierarchy / selection in ≥2 channels: | **weak** | Selected chips are conveyed by gold fill only (FilterChips uses variant gold vs secondary, GallerySidebar.jsx:52) — color-only selection state, no check glyph or weight delta, failing P7. Section headings are FS.xs/950 uppercase with letterSpacing:0 (line 35-36), nearly indistinguishable from chip labels in weight. |
| Borders vs whitespace: | **adequate** | One bordered tinted aside containing borderless sections is reasonable (GallerySidebar.jsx:85-93) — not box-soup. But the chips themselves are bordered Buttons, so 37 mini-borders inside still read busy. |
| Match real-world domain language: | **good** | All facets are GM-native (tier, terrain, government, magic, stability) via human()/TIER_LABELS; no engine jargon leaks. |
| Accessibility (labels/targets): | **adequate** | Toggles use real labeled checkboxes with useId (GallerySidebar.jsx:64-80) — good. Chips are size sm Buttons; verify ≥44px touch target and that selected state isn't color-only (it is — see above). |

*Overhaul:*
- **[high]** Add a check glyph (and/or weight bump + inset) to selected chips so selection is encoded in shape+color, not color alone; show the active count per section in the heading. — _Color-only selection fails P7 and is invisible to a colorblind GM mid-scan._ (P7 + P4)
- **[med]** Collapse the long facets (Terrain 10, Government 9) behind a 'Show all' after the first ~6, ordered by likely use; consider accordion sections defaulting the two or three most-used facets open. — _~37 always-visible chips violate 7±2 and bury the scan; progressive disclosure keeps the expert controls reachable without the wall._ (P1 (progressive disclosure) + cognitive load)
- **[med]** On mobile (<=860px the sidebar goes static and pushes the whole grid down), move filters into a collapsible 'Filters' drawer/disclosure so the cards lead on a tablet at the table. — _At a table the GM wants the settlements first; 37 chips above the grid on tablet buries the content._ (P12 (reflow) + P1 (content is hero))
- **[low]** Differentiate section headings from chips with a clear weight/size/color step and small top margin between groups so spacing carries the grouping. — _Headings and labels read at the same altitude now; the eye can't chunk facets._ (P5 + P6)


#### Search + sort topbar (GalleryTopbar)
*File:* `src/components/gallery/GalleryTopbar.jsx`
*Purpose:* Search the list, choose a sort, and show the result count.
*Layout today:* Grid: search input (with magnifier) | sort select, and a full-width count strip below ('N public settlements' / 'Loading...').

| Q | Verdict | Finding |
|---|---|---|
| Intuitiveness & first click: | **good** | Search input is labeled and obvious (GalleryTopbar.jsx:24-47); sort select lists clear GM-readable options (gallery.js:24-33). First click is unambiguous. |
| System status & perceived speed: | **weak** | The count strip flips to 'Loading settlements...' (GalleryTopbar.jsx:73), but because search isn't debounced (see hook), the strip thrashes on every keystroke and the grid resets — feedback is noisy, not reassuring. No inline 'searching' affordance on the input itself. |
| Match real-world / sort labels: | **good** | Sort options are domain-friendly ('Top voted','Most discussed','Population: high to low'); no jargon (gallery.js:25-33). |
| Accessibility: | **adequate** | Search has aria-label and a real label wrapper; the sort <select> has NO visible label or aria-label (GalleryTopbar.jsx:48-64) — a screen reader announces only the current value, and sighted users get no 'Sort by' affordance beyond the dropdown content. |
| Placement by importance: | **adequate** | Search gets the flexible column, sort a fixed 170-230px — reasonable. The count strip spanning full width below is a sensible status line. |

*Overhaul:*
- **[med]** Add a visible 'Sort' label (or aria-label + a leading 'Sort: ' affordance) to the select, matching how other pickers in the app are labeled. — _An unlabeled sort control fails recognition-over-recall and accessibility._ (P11 (conventions/ARIA) + recognition)
- **[low]** After debouncing search upstream, show a subtle inline spinner inside the search input while a query is in flight rather than thrashing the count strip. — _Localized status near the control is calmer and clearer than a count line that flickers per keystroke._ (P10)


#### Dossier detail view (GalleryDetail)
*File:* `src/components/gallery/GalleryDetail.jsx`
*Purpose:* The full public dossier reader: hero (image, title, meta, description, realm-arc digest, vote/share/report/import), the PublicDossierView body, comments, and 'more by creator'; plus an owner-listing card.
*Layout today:* PAGE_MAX grid. Back button; action banners; optional owner 'Your gallery listing' card; a hero article (image | text 2-col); then a body grid (dossier | aside with comments + more-by-creator).

| Q | Verdict | Finding |
|---|---|---|
| Runnability (grab essentials at a glance before deep detail): | **adequate** | The hero gives name/tier/population/terrain + description + realmArcSummary (GalleryDetail.jsx:106-189) before the deep PublicDossierView (line 244) — reasonable progressive disclosure. But there's no quick-reference 'stat block' summary distinct from the prose; the runnable essentials are mixed with social actions in the same hero row. |
| Engineer the peak (depth becomes legible): | **weak** | PublicDossierView is lazy-loaded with a bare text fallback 'Loading dossier...' (GalleryDetail.jsx:243) — the emotional peak (the depth reveal) opens on a flat one-liner, not a staged reveal or skeleton, undercutting P9. |
| Causal coherence visible (why this state): | **weak** | realmArcSummary is shown when present (GalleryDetail.jsx:180-189) — good provenance for the region arc. But the hero meta and description don't expose the WHY (food/legitimacy/war → tension); coherence depends entirely on PublicDossierView. The gold-left-border realm block is the only causal cue and it's optional. |
| Primary CTA discipline: | **weak** | The hero action row mixes Vote (success/secondary), Share (ghost), Report (secondary), and Import (gold) at the same scale on one line (GalleryDetail.jsx:190-236). For a signed-in viewer who can import, Import is the intended conversion, but it's the LAST item and visually peer to Report. The true 'forge your own' / convert action isn't present in the detail at all. |
| Trust/credibility (provenance, what's stripped): | **adequate** | Comment about anonymization exists in code (GalleryDetail.jsx:78-84) and description is sanitized (line 171). But the public-facing view never tells the reader what's public-safe vs stripped, nor reasserts 'simulated, not AI' here — a missed trust moment on the highest-intent page. |
| Error/empty messaging: | **adequate** | error/no-dossier path shows a back button + message (GalleryDetail.jsx:93-104) — recoverable. Loading shows 'Opening settlement...' (line 87). Functional but generic; no skeleton of the hero. |
| Recognition vs recall / shared context: | **good** | More-by-creator (line 249) and the owner card carry context; back returns to the list; ownedSave resolves the editor inline (lines 121-148). Good continuity. |
| Borders vs whitespace: | **weak** | Owner card (bordered gold tinted), hero (bordered card), realm-arc (bordered+left-border tinted), comments cards, more-by-creator buttons — many nested bordered containers stack vertically (GalleryDetail.jsx:121,150,181,247). The detail leans toward box-soup; several could be carried by spacing/tint. |

*Overhaul:*
- **[high]** Split the hero into (a) a compact runnable summary line/stat-strip top-left and (b) a clearly subordinate social-action row; make the conversion action (Import for eligible viewers, otherwise a 'Forge a settlement like this' CTA) the single primary, with Vote/Share/Report demoted to ghost/icon. — _P8: one primary per region; today four equal-weight actions and Import buried last leave no obvious first click, and non-importers get no conversion path._ (P8 + P9 (close on a next step) + P1 (runnable essentials first))
- **[med]** Replace the lazy 'Loading dossier...' text with a dossier-shaped skeleton (section headers + lines) so the depth reveal stages in. — _This is the product's emotional peak; a bare text fallback flattens it._ (P9 + P10)
- **[med]** Add a small, honest provenance line near the hero ('Simulated dossier — public-safe view; some DM-private detail withheld') and reassert the 'simulated, not AI' framing once here. — _Highest-intent page; disclosing what's stripped and reaffirming the engine builds the trust that converts._ (P2 + trust/credibility)
- **[low]** Flatten nesting: carry the realm-arc and owner blocks with tint+spacing (drop one border layer each) and let the hero be the only hard-bordered card in the upper region. — _Vertical stack of bordered cards reads as box-soup and creates false floors before the dossier body._ (P5 (anti-box-soup))


#### Maps tab (GalleryMaps)
*File:* `src/components/gallery/GalleryMaps.jsx`
*Purpose:* Browse shared maps (blank or map+campaign), preview a map and its settlements, and import (premium) into a new campaign.
*Layout today:* Notice banner; either a read-only preview (back + large image/terrain + name/desc/members + import) or a grid of map tiles (thumbnail/terrain placeholder, kind badge, name/desc/tags, View + Import buttons).

| Q | Verdict | Finding |
|---|---|---|
| Distinctness & consistency with the Settlements tab: | **weak** | GalleryMaps is a parallel implementation that does NOT reuse the list/card/empty/error patterns of GalleryList. Notices are ad-hoc inline divs with swatch.danger fallbacks (GalleryMaps.jsx:76-82), the preview uses a literal '← Back to maps' string (line 92) instead of the shared ChevronLeft back-button pattern used in GalleryDetail. Two visually different gallery dialects on one surface. |
| Error messages (plain language, no internals): | **broken** | The maps load error leaks an engine/ops internal directly to end users: 'Couldn't load maps: {error}. (Needs migration 045 deployed.)' (GalleryMaps.jsx:132). 'migration 045' is exactly the kind of internal P11 forbids, and it's shown to GMs. |
| Error prevention & tier gating (turn limits into previews): | **weak** | Non-premium users see 'Import (premium)' buttons (GalleryMaps.jsx:122,180) and clicking sets a flat notice 'Importing maps is a premium feature.' (line 58) — a denial, not a reframed upgrade preview with a CTA to pricing. The button looks active but only scolds. |
| System status & perceived speed: | **weak** | Loading states are bare text ('Loading shared maps…', 'Loading preview…', GalleryMaps.jsx:131,93) with no skeletons; import shows busy on the button (good). |
| Empty state: | **adequate** | Empty maps shows a single muted line pointing premium DMs to the toolbar (GalleryMaps.jsx:133-135) — informative but no CTA/sample and styled unlike the Settlements empty state. |
| Match real-world / domain language: | **adequate** | 'Blank map' / 'Map + Campaign' badges and 'Generated terrain' are GM-legible, but the migration-045 leak and the raw swatch fallbacks (line 79-80) betray the engine layer. |
| Accessibility / hierarchy: | **weak** | The kind badge uses FS.pico uppercase SECOND-on-CARD_HDR (GalleryMaps.jsx:150) — extremely small; tags at FS.pico MUTED (line 160) likely fail AA. Title uses ellipsis nowrap (line 155) so long map names truncate with no tooltip. |

*Overhaul:*
- **[high]** Remove the 'migration 045' leak; show the shared gallery.loadError-style message with a Retry button. — _Exposing migration numbers to GMs is a direct P11 violation and erodes credibility._ (P11 + P10)
- **[high]** Reframe the premium gate: for non-premium users make the import a clear 'Import — Cartographer' affordance that routes to Pricing (or opens the upgrade flow) rather than a button that only shows a scolding notice. — _P9 turns limits into previews/upgrade moments; a dead 'premium' button that scolds is a denial dark-pattern-adjacent dead-end._ (P9 + P8)
- **[med]** Refactor GalleryMaps to reuse the shared card/list/empty/error/back-button primitives and SP scale so the two tabs feel like one surface (shared ChevronLeft back, shared StatusMessage, shared skeletons, FS scale not pico). — _Two divergent gallery dialects break cohesion and Jakob's Law; the maps tab currently reads as a different, less-finished app._ (P11 (cross-surface consistency) + P5)
- **[med]** Verify/upsize the pico badges and tags to AA contrast/size and add title attributes for truncated map names. — _pico/MUTED on tinted backgrounds almost certainly fails 4.5:1 and 44px targets._ (accessibility (POUR))


#### Moderation panel (GalleryModerationPanel)
*File:* `src/components/gallery/GalleryModerationPanel.jsx`
*Purpose:* Admin/dev queue to triage gallery reports: filter by status, refresh, open the public dossier, resolve/dismiss/reopen.
*Layout today:* Segmented status filter (gold-active) + Refresh; error banner; loading/empty states; a scrollable list of report articles (name + status pill + count, meta line, body, public-flag note, action buttons).

| Q | Verdict | Finding |
|---|---|---|
| Does it fulfill its purpose (triage): | **good** | Status filter, refresh, open-dossier (navigates with slug, GalleryModerationPanel.jsx:188), and resolve/dismiss/reopen all wire to RPCs with busy state. The triage task is complete and coherent. |
| Hierarchy / emphasis (open vs resolved): | **good** | Open reports get a RED border + warm '#fffaf7' bg + red status pill + red count (GalleryModerationPanel.jsx:160-176) — state in ≥2 channels (color + border + label). Good. |
| Placement of destructive/primary actions: | **adequate** | Resolve (success) and Dismiss (danger) sit right-aligned together (GalleryModerationPanel.jsx:203-223). Reasonable for a queue, though Dismiss (destructive-ish) is peer-sized to Resolve; acceptable in an admin context. |
| Error messages: | **adequate** | Errors use the err.message with a sensible fallback (GalleryModerationPanel.jsx:81,101) in a red banner — plain enough for an admin audience, though no retry CTA beyond the existing Refresh. |
| Off-scale spacing / box-soup: | **adequate** | Uses SP scale and one border per report card; the hardcoded '#fffaf7' (line 162) is an off-token color but minor. Not box-soup. |
| Match real-world language: | **good** | reason/tier/reporterLabel/status are humanized (GalleryModerationPanel.jsx:179); status pill text is uppercased raw status which is fine for admins. |

*Overhaul:*
- **[low]** Replace the hardcoded '#fffaf7' open-report background with a theme token (e.g. a warm warning tint) so admin chrome stays on-system. — _Off-token colors drift from the palette and complicate theming._ (P11 (consistency))
- **[low]** Make the status pill text human-cased and add a count-of-open badge to the 'Open' segment so the moderator's eye lands on the queue depth first. — _Goal-gradient/serial-position: surfacing the open count focuses the triage entry point._ (P6 + P3)


#### Vote / Share / Report / Import controls + comments
*File:* `src/components/gallery/VoteButton.jsx`
*Purpose:* Shared interactive controls across card and detail: upvote, share link, report dialog, import-to-library, and the comment thread.
*Layout today:* VoteButton (success-when-voted secondary Button with ThumbsUp+count); Share (ghost copy-to-clipboard with Check feedback); Report (secondary opens modal dialog); Import (gold, gated); GalleryComments (textarea + post, list with delete).

| Q | Verdict | Finding |
|---|---|---|
| Correct button→function mapping + shared icon/label: | **good** | VoteButton stops propagation so a card vote doesn't open the dossier (VoteButton.jsx:13-17); share/report/import use consistent icons+labels across card and detail; report dialog reuses useDialogFocusTrap (GalleryReportDialog.jsx:35). Solid. |
| Emphasis in ≥2 channels (voted state): | **adequate** | Voted is conveyed by variant success (color) + title text change (VoteButton.jsx:9-11) but the icon/glyph stays ThumbsUp either way — selection leans mostly on color; a filled vs outline thumb would add a shape channel. |
| Error prevention & recovery (report/comment): | **good** | Report dialog has Cancel + Escape (ignored mid-flight), focus trap, and inline error (GalleryReportDialog.jsx:34-65,180-184); comments disable post when empty/busy and show char count (GalleryComments.jsx:122-129). Good prevention. |
| Error messages: | **adequate** | Report/comment errors use err.message with domain fallbacks (GalleryReportDialog.jsx:62; GalleryComments.jsx:64,77) — plain language, no codes. Adequate. |
| Recognition vs recall (signed-out states): | **adequate** | Comments show 'Sign in to comment' (GalleryComments.jsx:132-135); report works for anon as a quiet 'other' report (GalleryReportDialog.jsx:38-42). But the anon-vote path isn't explained at the control — anon users may click vote and silently no-op depending on backend. |
| Accessibility (delete confirmation): | **weak** | Comment Delete is a one-click danger Button with no confirmation (GalleryComments.jsx:157-165) — a destructive, irreversible action with no guard, contrary to error-prevention; also the delete sits at FS sm in the author row. |

*Overhaul:*
- **[med]** Guard comment Delete with a confirm (or undo toast). — _Irreversible destructive action with no confirmation violates error-prevention._ (error prevention/recovery)
- **[med]** For signed-out users, make Vote/Import prompt sign-in with a clear inline message instead of a silent no-op. — _Recognition-over-recall + don't-make-me-guess; a control that appears active but does nothing erodes trust._ (P8 + P10)
- **[low]** Add a shape channel to the voted state (filled thumb / inset) so it isn't color-only. — _P7: emphasis must use ≥2 channels; success-green alone is weak for colorblind users._ (P7)


### Surface: PRICING + cross-page marketing framing. Primary file src/components/PricingPage.jsx (the live public pricing surface: header with title/subtitle/anti-AI box, 3 tier cards, credit-pack section, hidden single-dossier block), plus src/components/pricing/TierCard + PackTile (defined inline in PricingPage), src/components/pricing/FounderTile.jsx (recognition tile, rendered ONLY on Account), src/components/pricing/PricingMomentCard.jsx (the fixed bottom-right upgrade nudge fired app-wide), and the marketing copy in src/copy/en.js (pricing.*, pricing.variant.*, pricingPitch.*, valueLadder.*, hero.*, footer.*) + src/copy/strings.js (pricing.moments). Catalog/config from src/config/pricing.js.

OVERALL VERDICT: the pricing surface is functional and the copy LAYER contains genuinely excellent simulation-led, anti-AI, audience-aware material — but almost none of the best material reaches the live page. The default page leads with a money-first subtitle ("Pay once for credits"), the simulation-led copy is gated behind a default-OFF A/B flag (pricingSimulationCopy), the canonical "Three rungs, one engine" value ladder and the full pricing FAQ both render on OTHER pages (HowToUse), the FounderTile recognition moment renders ONLY on Account, and an architectural bug makes the carefully-written variant/base tier taglines dead code (the always-present audience pitch line unconditionally overrides them). Net: the surface that should most loudly say "this is a SIMULATOR, not a generator" instead reads like a generic SaaS price grid with three near-identical bordered cards.

**Cross-cutting:**
- The best copy never ships: the simulation-led subtitle (en.js:253), simulation-led tier feature lists (en.js:264-273), and the named-system moment copy (strings.js:146-157) are all gated behind default-OFF flags (pricingSimulationCopy at PricingPage.jsx:234; founderRecognition at FounderTile.jsx:39) or live only in a transient toast. The LIVE pricing page therefore leads with 'Pay once for credits. Subscribe if you want more room.' — selling the meter, not the simulation. This is the single biggest miss against the north-star: the surface most responsible for 'this is a SIMULATOR, not a generator' is its weakest expression of that idea.
- Dead-tagline architecture bug: audienceLineFor() always resolves to a non-empty string because useCopy().audience() falls back to the lineNew key (useCopy.js:43-44), and TierCard sets tagline = audienceLine || variantTagline || baseTagline (PricingPage.jsx:77). Result: pricing.tiers.*.tagline AND pricing.variant.tiers.*.tagline are unreachable dead code — the page only ever shows pitch lines, and the A/B variant's taglines are silently defeated. For an anonymous visitor (audience defaults to 'new', useReaderAudience.js:57) only the lineNew variants are ever seen.
- Pricing's own assets are scattered onto other pages: the canonical value ladder renders on HowToUse/LivingWorldTab (despite the en.js:291-292 comment naming PricingPage as its home), the FounderTile conviction-sell renders only on Account, and the full pricing FAQ renders on HowToUse/AccountFAQ with no link from pricing (the t('pricing.faqLink') string is orphaned). PricingPage is left as a bare three-card grid + credit packs while the surfaces that should support a purchase decision live elsewhere.
- Box-soup and weak focal hierarchy: three near-identical bordered tier cards (P5/P4) plus a bordered credit-pack section containing bordered tile-buttons = up to three parchment border levels. Within cards and tiles, two FS-xl/serif-600 elements compete for the single focal point. Emphasis is over-reliant on borders rather than spacing + one quiet/loud contrast.
- CTA verb + emphasis inconsistency: 'make a settlement' is labeled four ways across hero/value-ladder/pricing ('Begin a settlement', 'Forge a {tier}', 'Forge a settlement', 'Start free') despite a committed Forge verb registry (en.js:481-490); and the pricing tier CTAs are near-co-equal (the de-emphasized ones use the low-contrast 'gold' Button variant = GOLD text on GOLD_BG), so no single first click dominates the region (P8).
- Error/jargon leaks at the edges: checkoutError renders raw e.message with no domain wrapper or retry CTA (PricingPage.jsx:351-364); FounderTile swallows checkout errors to console only (FounderTile.jsx:84-89); the local-mode notice leaks 'Supabase + Stripe' (PricingPage.jsx:439). Honest domain-language fallbacks (purchase.failureMessage) exist but aren't used.
- Accessibility: the single most load-bearing trust sentence (anti-AI) is small italic 12px on a 0.78-alpha tint over a painted-map background (PricingPage.jsx:339-349) — contrast unverifiable as written; semantic accents on PricingMomentCard ride on color alone (left border); PricingMomentCard uses role='alert' for a non-urgent promo. Multiple states/emphases are single-channel (color).


#### Pricing page header (title + subtitle + anti-AI box)
*File:* `src/components/PricingPage.jsx:315-366`
*Purpose:* Establish what this page is for, restate the core positioning ('a SIMULATOR for DMs', simulated-not-AI), and frame the tiers below. The emotional/credibility anchor before the price grid.
*Layout today:* Centered header in a .sf-readable-surface block: serif H1 'Pricing' (FS 36), an italic serif subtitle capped at 540px, then a gold-left-border italic 'anti-AI' paragraph capped at 580px, left-aligned, on a translucent cream tint. checkoutError banner appears below when present.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test: does 'a SIMULATOR for DMs' or the value land as the recalled message? | **weak** | The H1 is the bare word 'Pricing' (en.js:177) and the live subtitle is t('pricing.pageSubtitle') = 'Pay once for credits. Subscribe if you want more room.' (en.js:178). The simulation-led subtitle 'Generate a town in seconds. Then run the region for years.' exists (en.js:253) but is gated behind useFlag('pricingSimulationCopy') which is OFF by default (PricingPage.jsx:234-237). So the recalled message in 5s is 'buy credits / pay for room', not 'a simulator'. The hero engine is invisible above the fold. |
| Scannability & content: prose-to-read distinct from data-to-scan; front-loaded? | **adequate** | The anti-AI line (en.js:179) is strong, specific, and honestly scoped ('Only the optional Narrative Layer uses language synthesis, and it grounds itself in the simulator output') and is visually set apart by the gold left border (PricingPage.jsx:342). But it sits THIRD in the eye-path, after a generic title and a money subtitle, so the trust message is buried under the transactional one. |
| Accessibility (POUR): AA contrast on parchment incl. the anti-AI box? | **weak** | The anti-AI paragraph uses color swatch['#5A4A2A'] on background 'rgba(255,251,245,0.78)' over the painted-map page (PricingPage.jsx:343-346). #5A4A2A on near-white is ~7:1 (passes), but the box is semi-transparent (0.78) over an unknown painted-map backdrop, so effective contrast is not guaranteed AA and is untestable as written. The italic body at FS.sm (12px) also pushes small-text minimums. |
| Trust/credibility: can the GM verify how results are derived; provenance honest; zero typos? | **adequate** | Copy is honest and typo-free, and discloses the AI/sim split well (en.js:179, FAQ aiOrSim en.js:774-777). BUT the rich pricing FAQ (en.js:740-778, incl. the crucial 'Does SettlementForge use AI to write my settlement?' answer) and the t('pricing.faqLink')='See the full pricing FAQ' string (en.js:244) are NEVER rendered on PricingPage — the FAQ lives only on HowToUse/AccountFAQ. The page offers no link to it, so the skeptic can't verify provenance without leaving. |
| Error messages: failures state what went wrong AND what to do next? | **weak** | checkoutError renders e.message verbatim in a red banner (PricingPage.jsx:351-364, set from e.message at :274/:287). This leaks raw Stripe/network error text with no domain-language wrapper and no CTA/retry guidance, violating P10. There are honest domain-language fallbacks available (purchase.failureMessage 'Couldn't start checkout. Try once more.' en.js:463) that are not used here. |

*Overhaul:*
- **[high]** Replace the H1 'Pricing' + money subtitle with a simulation-led headline pair by default: promote the variant subtitle 'Generate a town in seconds. Then run the region for years.' (en.js:253) to the live unconditional subtitle, and make the H1 do positioning work (e.g. 'One engine. Three ways to run it.'). Retire the default-OFF flag gating or flip it on. — _The pricing page is a top conversion + positioning surface; leading with 'pay once for credits' sells the meter, not the product. The simulation is the hero and the differentiator from 'a generator'._ (P1 / P9 / north-star)
- **[high]** Render t('pricing.faqLink') as a real link to the pricing FAQ (anchor into HowToUse FAQ or inline the aiOrSim + refund + cancel + founder Q&As at the page foot). — _The FAQ answers the exact objections a buyer has at the decision point; shipping the string but never the link is a dead promise and forces a context switch to verify provenance._ (P2 / trust)
- **[med]** Move the anti-AI line to SECOND position (right under the subtitle, before any price), and tie it visually to the subtitle as one trust block rather than a detached bordered note. — _For this skeptical, lore-fluent audience 'simulated, not AI-generated' IS the buying reason; it must be read before the grid, not after._ (P2 / P6)
- **[med]** Wrap checkoutError in domain language with a retry CTA: show purchase.failureMessage (en.js:463) as the headline and a 'Try again' button, keeping e.message only in console. — _Raw Stripe error strings are engine-leak and dead-ends; the user needs what-to-do-next._ (P10 / P11)
- **[med]** Solidify the anti-AI box: drop the 0.78 alpha to an opaque cream token and verify #5A4A2A (or darken to INK/BODY) hits >=4.5:1; raise the italic body off 12px or use a non-italic weight for the legibility-critical claim. — _The single most load-bearing trust sentence must be unambiguously readable over the painted-map background at the table._ (P12 accessibility / north-star)


#### Tier cards (Wanderer / Cartographer / Founder)
*File:* `src/components/PricingPage.jsx:63-174 (TierCard) + en.js:180-285`
*Purpose:* Let a GM recognize which tier fits them and take one clear action (start free / subscribe / claim seat / manage). Should make the premium product — the living simulation — legible as the reason to pay.
*Layout today:* Flex-wrap row of three equal-ish cards (flex 1 1 240, max 320). Each: icon+name header (+FounderBadge on founder), italic serif tagline, big serif price + sub, founder seat line, Check-bulleted feature list, full-width CTA button, optional ctaSub. Cartographer is emphasised (2px gold border, gold shadow, 'Most popular' ribbon).

| Q | Verdict | Finding |
|---|---|---|
| Design optimality: hierarchy from >=2 of {size,weight,color}, one focal point, squint test? | **adequate** | Cartographer is correctly the focal card via border+shadow+ribbon (PricingPage.jsx:87,91-92,97-108) — emphasis in 3 channels, good. But within each card the price uses FS['32'] serif 600 (PricingPage.jsx:130) and competes with the FS.xl serif 600 name (:114-115); two near-equal serif foci per card weakens the per-card scan. The emphasised card's CTA is variant='primary' (gold-fill) while the other two are variant='gold' (pale gold-bg, gold text) (PricingPage.jsx:158) — a reasonable de-emphasis, though 'gold' on 'gold' is low-contrast (see CTA discipline). |
| Distinctness / cognitive load: are the three cards differentiated; is the bullet count within ~7? | **weak** | Cartographer carries 7 feature bullets (en.js:205-213) and the variant 6 (en.js:266-273); Founder repeats 'Everything in Cartographer' + 3 (en.js:222-227). At a glance the three cards are three identical bordered boxes with identical Check-list rhythm — the only quick differentiators are the ribbon and the price. The 7-bullet Cartographer list buries its lead ('Advance time: run the region for years') in a uniform list with secondary storage/export bullets, so the simulation hero doesn't pop above the commodity bullets. |
| Primary CTA discipline: one high-emphasis primary per region, styled by task importance? | **weak** | The three CTAs read as co-equal full-width buttons; the intended primary (Cartographer = 'Subscribe', primary/gold-fill) is only subtly distinguished from Wanderer/Founder ('gold' variant = GOLD_BG fill with GOLD text). GOLD text on GOLD_BG (Button.jsx:57-62) is a low-contrast button and an ambiguous emphasis signal. Per P8 the region should have exactly one obviously-dominant action; here all three look clickable-equal. |
| Match real world / consistency: shared CTA verbs match the app's verb registry? | **weak** | Wanderer CTA is 'Start free' (en.js:186) and routes to generate, but the app's committed generation verb is 'Forge' (verbs.forge/forgeTpl en.js:481-483; hero uses 'Begin a settlement' en.js:55 AND 'Forge a {tier}' v2 en.js:63). So the same first action is labeled 'Start free' here, 'Begin a settlement' on the legacy hero, and 'Forge a {tier}' on hero v2 — three labels for one action, violating P11 cross-surface consistency. Cartographer 'Subscribe' is fine; Founder 'Claim a Founder seat' is good and consistent with FounderTile. |
| Coherence (audience): does the premium card make the SIMULATION the visible reason to pay, with named, non-contradictory benefits? | **weak** | The simulation-led feature list (en.js:264-273) that names the war layer, living pantheon, and advance-time is gated behind simulationVariant (PricingPage.jsx:69-72), default OFF. The LIVE list (en.js:205-213) does lead with 'Advance time' but mixes it flat with 'Unlimited saves + cloud sync' and 'PDF + JSON export', so the differentiator reads as one commodity bullet among storage bullets. The card never shows the causal 'why pay' — there's no preview of what advancing time DOES. |

*Overhaul:*
- **[high]** Fix the dead-tagline bug: audienceLineFor() ALWAYS returns a string (useCopy.js:43-44 falls back to lineNew), so in TierCard tagline = audienceLine || variantTagline || baseTagline (PricingPage.jsx:77) means variant/base taglines are unreachable. Either make audienceLine opt-in (return null when no flag/signal) or reorder precedence so the simulation tagline can win. — _Two whole copy layers (pricing.tiers.*.tagline and pricing.variant.tiers.*.tagline) are currently dead code; the surface only ever shows pitch lines. This is a silent regression that defeats the A/B variant entirely._ (P2 coherence / correctness)
- **[high]** Make the Cartographer card's hero benefit a distinct top element, not bullet #1: pull 'Advance time — run the region for years' into a short bold lead line above a shorter (<=5) bullet list, and demote storage/export to a single 'plus unlimited saves, cloud sync, PDF/JSON' line. — _De-emphasize to emphasize: the simulation must outrank the commodity bullets so the squint test surfaces WHY this tier costs money._ (P4 / P1 / P6)
- **[high]** Resolve CTA emphasis + contrast: make Cartographer the sole filled-gold primary, render Wanderer as an outline/secondary ('Start free') and Founder as a distinct ink/violet button. Stop using variant='gold' (GOLD text on GOLD_BG) for a primary-sized CTA — it is low-contrast and reads as disabled-ish. — _Exactly one dominant action per region; current near-equal CTAs split the first click._ (P8 / accessibility)
- **[med]** Give the three cards real visual distinctness beyond the ribbon: Wanderer flatter/quieter (no heavy border), Cartographer the single bordered focal card, Founder dark/violet-or-ink treatment matching FounderTile's premium skin (FounderTile.jsx:93-100). Reduce box-soup by letting spacing + the one emphasised card carry grouping. — _Three identical bordered boxes fail P5 (box-soup) and P4 (one focal point); the founder conviction product especially should not look like the free tier._ (P5 / P4 / distinctness)
- **[med]** Unify the free-tier CTA verb with the app: use 'Forge a settlement' / 'Forge a Draft' (verbs.forge) instead of 'Start free', or at minimum align it with the hero's chosen label so one action has one name everywhere. — _Jakob's law + P11: a GM should never see three names for 'make a settlement'._ (P11)
- **[med]** Add a one-line causal preview to the Cartographer card (e.g. a tiny 'food -2 -> unrest rising -> war' delta chip or 'Advance a month: wars ignite and end, faiths rise, the chronicle writes itself') so the premium reason is shown, not just listed. — _Make causal coherence visible — the living world is the product; a static bullet can't convey it._ (P2 / P3)


#### Founder tile / Founder card seat counter
*File:* `src/components/PricingPage.jsx:138-148 + src/components/pricing/FounderTile.jsx`
*Purpose:* Sell the $99 lifetime conviction product. On PricingPage it's the third tier card with a live seat counter; FounderTile.jsx is a separate, richer 'you've earned this' recognition moment.
*Layout today:* PricingPage founder card: standard TierCard + a violet seat line + FounderBadge. FounderTile.jsx (separate): dark ink-gradient card, gold border, 'YOU'VE EARNED THIS OFFER' eyebrow, crown title, seat count, a value-math box ($144 vs $99 forever, +named-in-credits seat #), filled primary CTA 'Claim seat N, $99 one-time'.

| Q | Verdict | Finding |
|---|---|---|
| Plays on human psychology without dark patterns: scarcity + goal-gradient honest? | **good** | Scarcity is real and honestly sourced — live count via fetchFounderSeatsRemaining/RPC with a safe 'Limited to 500 seats.' fallback (PricingPage.jsx:144-146; FounderTile.jsx:45-55). The value math '$144 vs $99 forever' (FounderTile.jsx:137-138) and 'seat N in the credits' (FounderTile.jsx:139-143) are legitimate goal-gradient/peak framing, not fake urgency. Good. |
| Distinctness / placement: is the strongest founder treatment on the right surface? | **weak** | The far richer FounderTile (dark premium skin, value math, named-seat) renders ONLY inside AccountSubscriptionSection (AccountSubscriptionSection.jsx:216) and self-gates on flag('founderRecognition') (default off) AND audience==='worldbuilder' AND tier!=='premium' (FounderTile.jsx:59-63). On the actual PricingPage the founder option is just a flat third card identical in chrome to the free tier. The best conversion asset is hidden from the page whose job is conversion. |
| Match real world / engine-jargon: domain language only? | **good** | FounderTile uses clean GM/commerce language ('Founder Lifetime', 'lifetime Cartographer access', 'a seat in the credits' en.js:166-169 / strings.js founder_eligible). No engine internals leak. The 👑 emoji (FounderTile.jsx:119) is informal for the otherwise premium-serious skin but not a jargon problem. |
| System status: does claiming a seat give feedback? | **adequate** | FounderTile sets loading and shows 'Starting checkout…' (FounderTile.jsx:153) and the PricingPage card shows 'Redirecting…' (PricingPage.jsx:162) before Stripe redirect — fine. But FounderTile swallows checkout errors with only a console.warn (FounderTile.jsx:84-89) and NO user-facing message, so a failed founder checkout silently does nothing — worse than the PricingPage path. |

*Overhaul:*
- **[high]** Bring the FounderTile treatment (dark skin, $144-vs-$99 math, named-seat goal-gradient) onto the PricingPage founder card itself, rather than only Account, and stop gating the value math behind a default-off flag for the explicit pricing surface. — _The pricing page is where the purchase decision is made; the conviction-sell asset belongs here, distinct from the free tier's chrome._ (P9 peak/end / P8 / placement)
- **[med]** Add a user-facing error path to FounderTile.handleClick (surface purchase.failureMessage + retry) instead of console.warn only. — _A silent failure on a $99 CTA is a dead-end (P10) and loses the sale._ (P10)
- **[low]** Make the founder seat counter a visible delta/scarcity focal point ('N of 500 seats remaining') with a two-channel treatment (count + a thin progress meter), not only violet text (PricingPage.jsx:139-147). — _Encode the scarcity state in >=2 channels; emphasize the changing number, which is the honest urgency._ (P3 / P7)


#### Credit packs section
*File:* `src/components/PricingPage.jsx:176-217 (PackTile) + 394-442 + en.js:236-243`
*Purpose:* Sell pay-per-use narrative credits with a volume-discount ladder for users who don't want a subscription.
*Layout today:* Parchment-tinted bordered section with centered heading 'Narrative Credit Packs' + subhead, then a flex-wrap row of clickable PackTile buttons (Zap icon, credit count, '{n} credits', price, '$/ea', a discount ribbon on discounted tiers; 'best' tier highlighted gold). Local-mode disclaimer when !isConfigured.

| Q | Verdict | Finding |
|---|---|---|
| Borders vs whitespace (anti-box-soup): is the nesting earning its place? | **weak** | This is box-in-box-in-box: the bordered/tinted section (PricingPage.jsx:398-403) contains tiles that are themselves 2px-bordered buttons (PricingPage.jsx:185-186), sitting on a page of bordered tier cards above. Three border levels of the same parchment family = box-soup (P5). Differential spacing + the section tint could carry the grouping without the section border. |
| Design optimality: hierarchy + one focal point per tile? | **weak** | Each PackTile shows credit count (FS.xl 700), price (FS.xl 700, gold if best), '$/ea', and a discount ribbon — two FS.xl/700 foci compete (count vs price) in one ~160px tile (PricingPage.jsx:205,209). Nothing wins the squint; the discount (the actual decision driver) is the smallest element (FS.micro ribbon, :199). Emphasis should sit on per-credit value, not be the tiniest text. |
| Match real world: is this consistent with the in-app purchase modal? | **adequate** | Copy keys differ across surfaces: pricing.creditPacks.value='Most popular' / .best='Best value' (en.js:241-242) vs purchase.valueLabel/bestLabel (en.js:460-461) — duplicated label sources for the same packs, a drift risk. The pack catalog itself is correctly single-sourced from getActivePacks() (PricingPage.jsx:227; pricing.js:267), good. |
| Cognitive load: is the section pulling focus from the tiers it should be subordinate to? | **adequate** | Placement is reasonable (below tiers), but because the tier cards above are under-differentiated and the page lacks a value-ladder frame, the heavy bordered credit-pack block competes for attention as if it were a co-equal product rather than the secondary à-la-carte path. |

*Overhaul:*
- **[med]** Flatten the nesting: drop the credit-pack section's outer border (PricingPage.jsx:399) and carry the group with the parchment tint + generous space-7/8 separation from the tiers; make each PackTile a tint/shadow card, not a 2px-bordered button. — _Remove a redundant border level; let spacing carry grouping._ (P5)
- **[med]** Give each PackTile a single focal point — make the per-credit value (or discount) the dominant element and quiet the raw credit count and price label. — _The buyer's decision is value-per-credit; emphasize it, de-emphasize neighbors._ (P4)
- **[low]** Single-source the pack ribbon labels: have PricingPage and PurchaseModal both read one key set (consolidate pricing.creditPacks.value/best with purchase.valueLabel/bestLabel). — _Two label sources for one product invites copy drift — a visible inconsistency is the cardinal sin for a trust-led product._ (P11 / P2)
- **[low]** Reframe the !isConfigured local-mode note (PricingPage.jsx:434-440) — it leaks 'Supabase + Stripe' to any user who hits it. Use domain-neutral 'Purchases are temporarily unavailable.' in production builds. — _Engine/infra jargon (Supabase) must never reach a GM._ (P11)


#### PricingMomentCard (app-wide upgrade nudge)
*File:* `src/components/pricing/PricingMomentCard.jsx + strings.js:93-171`
*Purpose:* Surface contextual upgrade/unlock moments (e.g. third_save, map_clicked, first_advance_attempt) as a non-blocking nudge, reframing tier limits as previews of the living simulation.
*Layout today:* Fixed bottom-right toast (max 360px), white card with a colored left border (violet for Cartographer/Founder reasons, gold for unlock/signup), an uppercase eyebrow, serif headline, body, a primary action + a 'Not now' ghost + 'Won't ask again for 24h' note. Auto-dismisses after 30s.

| Q | Verdict | Finding |
|---|---|---|
| Engineer the peak / turn limits into previews (P9)? | **good** | The moment copy is the best simulation-selling material in the whole surface: first_advance_attempt, war_layer_curiosity, pantheon_preview (strings.js:146-157) each NAME a system and frame the wall as a preview ('Cartographer unlocks the living simulation… off by default until you do'). This is exactly the north-star framing the live PricingPage lacks. |
| Encode every state in >=2 channels (P7)? | **weak** | The violet-vs-gold accent (PricingMomentCard.jsx:84-85) is the only differentiator between an 'upgrade' and an 'unlock' moment AND it's color-only on the left border; the eyebrow text ('Cartographer' vs 'Upgrade', :115) partly pairs it, but the semantic accent itself rides on color alone for the border channel. |
| Primary CTA discipline + correct mapping (P8/P10)? | **adequate** | One primary + one ghost dismiss — clean. The primary inline-overrides Button's styling with the accent color (PricingMomentCard.jsx:131-133), bypassing the variant system; works but is a consistency smell. CTA labels ('See Cartographer' / 'Sign in to unlock') both route to setPurchaseModalOpen(true) (:69) — 'See Cartographer' implying a pricing view but opening a purchase modal is a slight label→function mismatch. |
| Accessibility: role/aria + dismissibility? | **adequate** | role='alert' aria-live='polite' (PricingMomentCard.jsx:89-90) — but role='alert' is assertive-by-role and may fight the polite live region; a promotional nudge arguably shouldn't be role='alert' at all. Auto-dismiss at 30s (:77) with a clear 'Not now' is good restraint (doors not walls). |

*Overhaul:*
- **[high]** Harvest this component's moment copy for the static PricingPage: the war-layer/pantheon/advance-time framing (strings.js:146-157) is the simulation-hero language the pricing cards are missing. Reuse it as the Cartographer card's lead + causal preview. — _The best 'why pay' copy in the product is trapped in a transient toast; the always-present pricing surface should not be weaker than the nudge._ (P1 / P2 / P9)
- **[low]** Pair the violet/gold accent with a non-color channel (icon or shape per moment class), and reconsider role='alert' → a non-assertive region for a promo. — _State in >=2 channels; correct ARIA semantics for a non-urgent nudge._ (P7 / accessibility)
- **[low]** Align label→destination: if 'See Cartographer' opens a purchase modal, either rename to 'Upgrade' or route it to the pricing view. — _Controls must do what their label promises._ (P8 / P11)


#### Cross-page marketing framing (value ladder, hero, footer, FAQ)
*File:* `en.js valueLadder:295-324 / hero:46-83 / footer:671-676 / faq:740-778; render sites LivingWorldTab.jsx, HomeHero, App.jsx footer`
*Purpose:* Carry the 'simulator-not-generator' positioning, the anti-AI line, and CTA verbs consistently across hero, pricing, gallery, footer, and the value ladder so the GM hears one coherent story.
*Layout today:* Distributed: hero (HomeHero), footer tagline+antiAi (App.jsx), gallery antiAi, the 'Three rungs, one engine' valueLadder rendered on HowToUse/LivingWorldTab, the FAQ on HowToUse/AccountFAQ.

| Q | Verdict | Finding |
|---|---|---|
| Consistency: is the anti-AI line identical/coherent across surfaces? | **adequate** | There are FOUR distinct anti-AI strings: hero.antiAi (en.js:54), pricing.antiAi (en.js:179), gallery.antiAi (en.js:412), footer.antiAi 'Simulated, not AI-generated.' (en.js:674). They're all on-message and the variation is arguably intentional per-surface, but the core claim should have one canonical short form ('Simulated, not AI-generated') that anchors every surface — currently the phrasing drifts (e.g. 'not generated by AI' vs 'not AI-generated'). |
| Consistency: CTA verbs for the same action across surfaces? | **weak** | The 'make a settlement' action is 'Begin a settlement' (hero.cta en.js:55), 'Forge a {tier} →' (hero.v2 en.js:63), 'Forge a settlement' (valueLadder tries.cta en.js:308), and 'Start free' (pricing wanderer.cta en.js:186) — four labels. The verb registry (en.js:481-490) commits to Forge but the live pricing + legacy hero don't honor it. |
| Cohesion with the whole flow: does pricing hand off to/from the value ladder? | **weak** | The canonical premium-value ladder 'Three rungs, one engine' (en.js:295-324) — explicitly commented as 'Rendered on the About landing + the canonical premium-value surface (PricingPage)' (en.js:291-292) — is in fact only rendered in LivingWorldTab.jsx:107, NOT on PricingPage. So the document the engine designed as the value frame for pricing is absent from pricing; the page and the ladder don't hand off to each other. |
| Trust: is provenance (what's stripped from public copy) disclosed and FAQ reachable from pricing? | **weak** | The FAQ that handles the central objection (aiOrSim en.js:774-777) plus refunds/cancellation/founder-cap is reachable only from HowToUse/Account, never from PricingPage despite the unused t('pricing.faqLink') string (en.js:244). A buyer with a pricing question has no in-context answer. |
| Distinctness: do pricing and the about/value surfaces stay distinct yet coherent? | **adequate** | They are distinct (good), but coherence suffers because the shared assets (value ladder, FAQ, founder recognition) all live on the OTHER surface, leaving pricing thin and the about page carrying pricing's job. |

*Overhaul:*
- **[high]** Render the valueLadder 'Three rungs, one engine' on PricingPage (above or interleaved with the tiers) as the engine's own comment intends, with the audience-lens headline (en.js:298-302). — _It is the canonical premium-value frame that turns three price boxes into one coherent 'try/save/run' story — the simulation-as-hero scaffolding the page is missing._ (P1 / P9 / cohesion)
- **[med]** Establish one canonical anti-AI sentence and reuse it verbatim as the lead trust line on hero, pricing, and gallery (longer per-surface elaboration may follow it), instead of four hand-tuned variants. — _A single repeated claim builds trust through consistency; drift in the core positioning line reads as less authoritative._ (P11 / P2)
- **[med]** Pick ONE first-action verb (Forge, per the verb registry) and apply it to hero, value-ladder, and pricing's free CTA; retire 'Begin a settlement' / 'Start free' as synonyms. — _One action, one name everywhere (Jakob's law)._ (P11)
- **[med]** Add a 'Questions?' FAQ link/teaser at the foot of PricingPage wiring t('pricing.faqLink') to the FAQ. — _Answer objections at the decision point; honor the already-written but orphaned string._ (P2 / trust)


### Surface: Global Chrome + Account + Auth + Admin

**Cross-cutting:**
- INLINE-STYLE MONOLITH: every file in this surface (App.jsx, AccountMenu, all account/* sections, admin/*, auth/*) builds its UI from large inline-style objects rather than shared style primitives. This is the root cause of the repeated box-soup and divider-clutter: borders/cards are hand-authored per block, so P5 (spacing-first grouping) is never enforced systemically. A shared <Field>, <Divider>, and <SettingRow> primitive set would let the whole surface lean on spacing and consistent borders.
- DUPLICATED CONTROLS / SOURCES OF TRUTH: email-notifications appears in BOTH AccountProfileSection and AccountPreferencesSection (same handler); sign-out exists in AccountMenu, AuthModal, AccountSecuritySection (everywhere) AND a page-end button in AccountPage. Multiple affordances for one action/setting violate P2 coherence and recognition-over-recall.
- MUTED USED FOR BODY TEXT: theme tokens explicitly document MUTED as chrome-only / sub-AA on parchment and BODY as the AA-passing body color, yet MUTED is used for real body/value text in AccountPage (email), header nav labels, footer links, and several helper lines. Sweep MUTED->BODY for any read content on light backgrounds (P7/accessibility).
- HEADING SEMANTICS MISSING: Account Section and Admin Section both render titles as styled <span> (AccountSection.jsx:23, AdminPanel Section), so two of the longest pages in the app have no <h2>/<h3> hierarchy for screen-reader/skim navigation (P6 + POUR).
- MODAL/MENU KEYBOARD GAPS: AuthModal has role=dialog but no focus trap/initial focus; AccountMenu has role=menu but no roving arrow-key focus or focus return. Both are baseline keyboard/POUR failures repeated across the chrome (P7).
- SILENT FAILURES: AccountPage.handleSaveName and AdminPanel UserRow.saveEdit both swallow errors to console with no user-facing feedback — inconsistent with the sections that DO surface errors (profile prefs, password). Every consequential mutation needs visible status/recovery (P10).
- RULE INCONSISTENCY ACROSS SURFACES: password minimum is 6 in sign-up (AuthPanel) but 8 in change-password (AccountSecuritySection) — a small but real visible contradiction (P2).
- PEAK/END UNDER-ENGINEERED IN AUTH: sign-in/up subtitles and the AuthModal blurb describe storage ('keep your work', 'unlimited saves') more than the simulation's living-world payoff. The auth wall is a prime moment to preview depth (regions, advancing the world) rather than utility (P9/P1).
- ADMIN DENSITY: the admin console is seven equal stacked cards with no tabs/nav, a non-semantic user table, and no mutation feedback — the surface most in need of a structural pass for both wayfinding (P4) and accessibility (P7).


#### Global Header / Top Nav (desktop)
*File:* `src/App.jsx:427-559`
*Purpose:* Persistent frame: brand + 'A simulator for Dungeon Masters' tagline, the six primary destinations (Create/Library/Realm/Compendium/Gallery/About), and the right-side action cluster (Upgrade chip / Admin shield / account chip).
*Layout today:* Sticky ink→ink-deep gradient bar. Left: MapIcon + lowercase wordmark + uppercase tagline. Right: empty HERO_LINKS slot, then a 6-tab boxed nav (each tab a bordered uppercase button), then conditional Upgrade (free) / Admin shield (elevated) / AccountMenu chip.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test: does 'a SIMULATOR for DMs' land and is the next action obvious? | **good** | The tagline at App.jsx:440-447 keeps the positioning visible for signed-in users (HomeHero is anon-only), and the nav is legible. The takeaway lands. |
| Design optimality: hierarchy from >=2 of {size,weight,color}, one focal point, <=3 levels? | **weak** | All six nav tabs are equal-weight bordered boxes (App.jsx:482-504) and compete with the Upgrade chip and account chip on the same row — there is no single focal entry point; the active tab differs only by gold fill+border (App.jsx:489-490), a borderline two-channel cue but visually flat against five identical neighbors. |
| Borders vs whitespace (anti-box-soup): is every border earning its place? | **weak** | Each nav tab carries its own 1px border (App.jsx:490) producing six adjacent boxes — classic box-soup in a nav that web convention renders as borderless text/underline tabs. The inactive border rgba(160,118,42,0.2) adds visual noise without grouping value. |
| Consistency & conventions (Jakob's Law): does the nav follow platform convention? | **adequate** | Boxed uppercase tabs are an unusual nav idiom; functional but heavier than the conventional text-tab bar. Active state is consistent app-wide which helps. |
| Placement by importance & first click: is the primary destination obvious? | **adequate** | Create is first (App.jsx:74) per Fitts/serial-position, good. But the Upgrade chip (gold, App.jsx:536-546) and the account chip sit visually at peer weight with nav tabs, so for a free user the eye may land on Upgrade rather than the intended destination. |
| Accessibility (POUR): contrast, two-channel state, focus, touch targets? | **weak** | Inactive nav labels use MUTED (App.jsx:492) on the dark ink gradient; MUTED is documented chrome-only and marginal — on the dark header it likely passes, but the same token is reused for body text elsewhere. No visible focus ring is defined on the raw <button> nav (App.jsx:482); relies on UA default which the boxed style can obscure. |

*Overhaul:*
- **[med]** Convert the six boxed tabs to borderless text tabs with a gold underline (or gold fill on active only) and remove the per-tab inactive border; let spacing carry separation. — _Eliminates box-soup, restores the conventional nav idiom, and lets the active tab be the single clear focal point._ (P5)
- **[med]** Visually subordinate the Upgrade and Admin controls from the nav row — smaller, or grouped behind a divider — so exactly one cluster (nav) owns primary navigation and the account/upgrade cluster reads as secondary. — _One unambiguous primary region; stops the gold Upgrade chip from out-competing the destination the GM actually wants._ (P8)
- **[med]** Add an explicit :focus-visible gold outline to the nav buttons. — _Keyboard operability with visible focus is required and the boxed style hides the UA default._ (P7)


#### Mobile Header + Bottom Nav + auth chip
*File:* `src/App.jsx:358-424, 661-726`
*Purpose:* Mobile chrome: slim top bar (brand + account chip) or, under mobileSingleChrome flag, a single bottom nav that also carries the auth/account slot.
*Layout today:* Top: sticky brand button + AccountMenu(compact). Bottom: fixed gradient bar of up to 4-5 icon+label tabs from MOBILE_NAV_PRIORITY, plus an optional 6th auth slot when the flag is on.

| Q | Verdict | Finding |
|---|---|---|
| Cohesion with the whole flow: clean handoff, no dead-ends? | **good** | Bottom nav priority is explicit (App.jsx:318) precisely to avoid silently dropping items; About correctly demotes to the account menu. Sound. |
| Placement by importance & touch targets (~44px)? | **good** | Bottom tabs use flex:1 with generous vertical padding (App.jsx:681) and compact chip enforces minHeight:44 (AccountMenu.jsx:90,117). Touch targets are adequate. |
| Accessibility: two-channel state, contrast? | **adequate** | Active tab uses gold color + gold top-border + bold weight (App.jsx:684-687) — good multi-channel. Inactive uses SECOND on dark which is acceptable; the auth chip's green '#4A7A3A' (App.jsx:713) on the dark gradient is the weakest contrast pairing. |
| Distinctness / intuitiveness: does the auth slot read as account vs a destination? | **adequate** | Under the flag the auth slot sits inline with destination tabs styled identically except color (App.jsx:700-723); a User icon helps but it visually reads as a 6th destination rather than an identity control. |
| Consistency: does the mobile auth entry match the desktop account chip? | **weak** | Desktop opens a dropdown menu (AccountMenu); mobile single-chrome slot jumps straight to setView('account') or the modal (App.jsx:703) — different interaction model for the same shared action across surfaces. |

*Overhaul:*
- **[low]** Give the bottom-nav auth slot a subtle visual separation (a hairline divider before it, or a filled avatar circle) so it reads as identity, not a destination. — _Recognition over recall; the account control should look like an account control, not a tab._ (P11)
- **[low]** Re-check the green account-chip color on the dark gradient for AA and bump toward a lighter green if it fails. — _State must survive contrast on the chrome background._ (P7)


#### AccountMenu (chip + dropdown)
*File:* `src/components/AccountMenu.jsx`
*Purpose:* Header identity control: anon -> 'Sign In' gold button; signed-in -> name chip opening a dropdown (Account / Manage subscription & credits / Sign out).
*Layout today:* Anon: single gold Button. Signed-in: secondary chip (User + name + chevron) over a white dropdown with three MenuRows, sign-out divided and toned danger.

| Q | Verdict | Finding |
|---|---|---|
| Correct button->function mapping & shared icons? | **good** | Settings icon -> Account, CreditCard -> subscription, LogOut(danger) -> sign out (AccountMenu.jsx:145-163); routes and icons are conventional and match elsewhere. |
| CTA discipline & destructive separation? | **good** | Sign out is visually subordinated (ghost row) and separated by a divider with danger tone (AccountMenu.jsx:156-164) — correct treatment for a destructive-ish action. |
| Accessibility: menu ARIA, keyboard, focus? | **weak** | Chip has aria-haspopup/aria-expanded (AccountMenu.jsx:110-111) and Escape closes, but there is no arrow-key roving focus among role=menuitem rows and focus is not moved into the menu on open nor returned to the chip on close — incomplete menu keyboard semantics. |
| Consistency: is 'Manage subscription & credits' the same label used elsewhere? | **adequate** | The dropdown routes to 'pricing' (App.jsx:555) while the account page calls the same surface 'Subscription & Credits' / billing portal — the destination is consistent but the label wording drifts between 'Manage subscription & credits' and the account section heading. |

*Overhaul:*
- **[med]** Implement roving tabindex + ArrowUp/Down navigation across the menu rows, move focus to the first item on open, and restore focus to the chip on close. — _A role=menu must be fully keyboard operable to meet POUR; today it is mouse/Escape only._ (P7)
- **[low]** Align the dropdown item label with the destination's own heading (e.g. 'Subscription & credits') so the same action reads identically across surfaces. — _Shared actions should use one name everywhere._ (P11)


#### Footer
*File:* `src/App.jsx:604-659`
*Purpose:* Secondary navigation (About / Pricing / Compendium / Gallery), contact email, copyright, and the anti-AI tagline.
*Layout today:* Two centered rows of pipe-separated ghost-button links + mailto, then copyright + italic anti-AI line, on the same ink gradient as the header.

| Q | Verdict | Finding |
|---|---|---|
| Scannability & content: keyword-first, no redundancy? | **good** | Links are short and from the copy module (App.jsx:623-627); the italic anti-AI line (App.jsx:657) reinforces the 'simulator not generator' trust message — on-brand. |
| Borders/false floors: does the footer read as page end without a false floor mid-page? | **good** | Single top border (App.jsx:606) on the gradient reads cleanly as the terminal frame; no false floors. |
| Accessibility: contrast of MUTED links on dark, touch targets? | **adequate** | Links use MUTED on the dark gradient (App.jsx:636) which is acceptable on dark; mobile enforces minHeight:44 (App.jsx:637) but desktop pipe-separated links are small click targets. |
| Consistency: do footer links match their header/nav equivalents? | **good** | Pricing routes to the single canonical premium surface, matching the header chip and Realm locked-state per the comment (App.jsx:600-603). Coherent. |

*Overhaul:*
- **[low]** None high-priority; optionally widen desktop link hit areas with padding. — _Minor Fitts improvement only._ (P8)


#### AuthPanel (shared sign-in/up/reset/verify)
*File:* `src/components/auth/AuthPanel.jsx`
*Purpose:* The single email + OAuth auth form, rendered in both the modal and the dedicated /signin·/register·/reset pages. Magic-link default, password behind 'More options'.
*Layout today:* Optional segmented Sign In / Create Account tabs, subtitle, error/success Alert, email (+password when password mode), CTA, OAuth block, a 'More options' ghost disclosure (switch to password / forgot), local-mode note.

| Q | Verdict | Finding |
|---|---|---|
| Cognitive load & choices: is the step minimized for speed? | **good** | Magic-link default collapses the form to email + one button (AuthPanel.jsx:235-250); password/forgot hidden behind disclosure (AuthPanel.jsx:289-317). Low-friction primary path. |
| Error messages: plain language + what to do next? | **adequate** | Errors are domain-plain ('Password must be at least 6 characters', AuthPanel.jsx:114) and surfaced via role=alert Alert. But success/error messages don't always carry a next-step CTA beyond the inline text (e.g. magic-link sent at AuthPanel.jsx:151 has no 'resend' affordance). |
| CTA discipline: one high-emphasis primary action? | **good** | Single full-width AuthCTAButton primary (AuthPanel.jsx:244); OAuth are secondary, mode-switch + more-options are ghost. Clean hierarchy. |
| Engineer peak/end: is the limit reframed and the success evocative? | **weak** | The signin/signup subtitles are functional ('Sign in to keep your work', SignInPage.jsx:44) but generic — they don't reframe auth as unlocking the simulation's depth (regions, living world); a missed peak per P9. |
| Trust/credibility: typos, leaked internals? | **good** | No engine jargon leaks; local-mode note is honest (AuthPanel.jsx:319-323). Copy is clean. |
| Match real world: minimum password 6 here vs 8 in Security section? | **weak** | Sign-up enforces 6 chars (AuthPanel.jsx:114) but the in-account change-password enforces 8 (AccountSecuritySection.jsx:97) — an internal inconsistency a careful user will notice. |

*Overhaul:*
- **[med]** Unify the password minimum (use 8 everywhere) between AuthPanel signup and AccountSecuritySection. — _Contradictory rules across surfaces erode trust — the cardinal coherence sin applied to UX rules._ (P2)
- **[med]** Add a 'Resend link' affordance (with a short cooldown) to the magic-link/verify success states. — _Closes the loop on the most common failure (email not arriving) instead of dead-ending._ (P10)
- **[low]** Rewrite the auth subtitles to lead with the simulation payoff (save regions, advance the living world, unlock larger settlements) rather than generic 'keep your work'. — _Turn the auth wall into a preview of depth, engineering the peak._ (P9)


#### AuthModal (overlay + signed-in account card)
*File:* `src/components/AuthModal.jsx`
*Purpose:* Modal entry to auth (signed-out -> AuthPanel) and a compact signed-in account card (tier/credits/upgrade/support/sign out + link to full Account).
*Layout today:* Backdrop dialog, gradient header (Welcome/Account + close), then either AuthPanel or a card: avatar+name+email+role/founder badges, Tier/Credits stat pair, upgrade button, full-settings link, blurb, support box, sign out.

| Q | Verdict | Finding |
|---|---|---|
| Does it fulfill its purpose: complete the auth/account task? | **good** | Both faces work; sign-in closes the modal, signed-in card deep-links to the full Account page (AuthModal.jsx:144-150). |
| Accessibility: dialog semantics, focus trap, ESC? | **weak** | role=dialog/aria-modal/aria-labelledby are present (AuthModal.jsx:62-64) but there is NO focus trap and ESC closes only via the backdrop's role=button keydown (AuthModal.jsx:47) — focus can escape behind the modal and no initial focus is set. |
| Emphasis on change: are credits/tier shown as state vs delta? | **adequate** | Tier + Credits shown as static absolutes (AuthModal.jsx:117-134); fine for a snapshot card but no movement cue. Acceptable here. |
| CTA discipline: one primary action? | **adequate** | Upgrade is the success-variant primary (AuthModal.jsx:138-142); full-settings + sign-out are subordinate. Reasonable, though two strong-ish actions (Upgrade, Sign Out danger) bracket the card. |
| Recognition vs recall: is everything needed visible? | **good** | Identity, tier, credits, role, founder badge all visible in one card (AuthModal.jsx:92-135). Good. |

*Overhaul:*
- **[high]** Add a focus trap and set initial focus (close button or first field) on open, returning focus to the trigger on close. — _Modal keyboard containment is a baseline POUR requirement currently unmet._ (P7)
- **[med]** Make the backdrop close handler not be a role=button that intercepts Enter/Space from inner controls; rely on an explicit ESC keydown + close button. — _The current role=button backdrop (AuthModal.jsx:46-50) is a fragile a11y pattern._ (P7)


#### Dedicated auth pages (SignIn/Register/Reset/VerifyEmail)
*File:* `src/components/auth/SignInPage.jsx, RegisterPage.jsx, VerifyEmailPage.jsx, ResetPasswordPage.jsx`
*Purpose:* Full-page routes wrapping AuthPanel in AuthPageShell, with ?next= redirect and a status surface for email verification.
*Layout today:* AuthPageShell: centered FORM_MAX card, brand lockup, gradient title/subtitle header, form body, footer link. VerifyEmail is a status surface (loading/confirmed/expired).

| Q | Verdict | Finding |
|---|---|---|
| Width discipline: routed through FORM_MAX? | **good** | AuthPageShell uses FORM_MAX (authUI.jsx:220) — correct narrow form cap, no full-bleed. |
| Error recovery: is the expired-link path actionable? | **good** | VerifyEmailPage gives a plain-language expired message + 'Go to Sign In' CTA (VerifyEmailPage.jsx:60-67). Solid recovery. |
| Cohesion: clean handoff via ?next=? | **good** | Both pages redirect to a safe internal ?next= or /create (SignInPage.jsx:21-38). Context carried forward correctly. |
| System status: is the confirming state shown? | **good** | Loader + 'Confirming your email…' then success + auto-redirect with a 1.6s read beat (VerifyEmailPage.jsx:41-56). Good perceived-speed handling. |

*Overhaul:*
- **[low]** Mirror the AuthPanel subtitle rewrite here so the page and modal share the depth-forward framing. — _Consistency + peak engineering across both entry points._ (P9)


#### AccountPage (composition root)
*File:* `src/components/AccountPage.jsx`
*Purpose:* Full account management: Profile, Login & Security, Subscription & Credits, Data & Privacy, Preferences, Support, plus an elevated Admin link and a final Sign Out.
*Layout today:* Single 680px centered column of stacked Section cards in fixed order, ending with a purple Admin link tile (elevated) and a full-width danger Sign Out button.

| Q | Verdict | Finding |
|---|---|---|
| Purpose & 5-second test: is it clear what this page is for? | **good** | Stacked titled sections (AccountPage.jsx:198-251) read clearly as account settings. Purpose lands. |
| Layout & spacing-as-grouping: do chunks emerge from spacing? | **adequate** | Uniform SP.lg gap between every Section (AccountPage.jsx:200) gives an even rhythm but no differential grouping — six equally-weighted bordered cards in a row is mild box-soup; spacing doesn't distinguish e.g. identity vs destructive zones. |
| CTA discipline: one primary action per region; destructive separation? | **weak** | There are TWO sign-out controls — one inside AccountSecuritySection (sign out everywhere) and a second full-width danger 'Sign Out' at page end (AccountPage.jsx:276-278) — plus the menu/modal sign-outs. The page-end danger button also sits with no confirmation directly after the Support section, an easy mis-click. |
| Error messages: are failures surfaced? | **weak** | handleSaveName swallows failures to console only (AccountPage.jsx:111-113) with no user-facing error, unlike handleSaveProfilePreferences which sets profileError — inconsistent and a silent failure. |
| Progressive disclosure & order: essentials first? | **adequate** | Profile->Security->Subscription is a sensible order, but every section is fully expanded at once, making the page long with no quick-jump/anchor nav for a time-pressured user. |
| Accessibility: heading semantics? | **weak** | Section titles render as styled <span> (AccountSection.jsx:23), not <h2>/<h3> — the page has no heading hierarchy for screen-reader navigation despite being a long multi-section page. |

*Overhaul:*
- **[med]** Remove the redundant page-end Sign Out button (keep sign-out in the menu/Security section), or at minimum separate it with extra space and a confirm. — _One destructive control, clearly separated — three sign-out paths on one surface is redundant and mis-click-prone._ (P8)
- **[med]** Give handleSaveName a user-facing error state matching handleSaveProfilePreferences. — _Silent failures violate status/recovery; the user must know the save failed and what to do._ (P10)
- **[med]** Render Section titles as real <h2> elements and add a sticky in-page section nav (anchor chips) for the long column. — _Heading semantics for POUR + faster scan for the time-pressured GM._ (P6)
- **[low]** Introduce differential spacing / a subtle zone break between benign sections and the destructive Data & Privacy / sign-out zone. — _Spacing should carry grouping and quarantine destructive actions._ (P5)


#### AccountProfileSection
*File:* `src/components/account/AccountProfileSection.jsx`
*Purpose:* Identity: avatar, inline-editable display name, email, role/founder badges, plus avatar URL / email-notifications / AI-model preference and Save.
*Layout today:* Avatar + name/email/badges row, then a stacked form (avatar URL, email checkbox, model select) and a Save button.

| Q | Verdict | Finding |
|---|---|---|
| Error prevention: is the avatar URL constrained safely? | **good** | avatarBackground() validates http(s) and CSS-escapes before use (AccountProfileSection.jsx:29-46) — XSS-safe with graceful fallback. Strong. |
| Distinctness: do email-notifications appear here AND in Preferences? | **weak** | The email-notifications toggle exists both here (AccountProfileSection.jsx:171-180) and in AccountPreferencesSection (sharing the same handler) — the same control duplicated across two sections invites confusion about which is authoritative. |
| CTA discipline: one primary save? | **adequate** | Single 'Save profile' primary with busy/saved states (AccountProfileSection.jsx:194-203). But name editing has its own separate save (inline check), so the section has two distinct save mechanisms. |
| Accessibility: labels present? | **good** | All inputs have htmlFor/aria-label (AccountProfileSection.jsx:160-192). Good. |
| Scannability: prose-to-read vs data-to-scan, label color? | **adequate** | Field labels use SECOND (AccountProfileSection.jsx:160) which is fine; helper/email text uses MUTED (line 146) which is the chrome-only token used for an actual data value (the email). |

*Overhaul:*
- **[med]** Remove the duplicate email-notifications toggle from one of the two sections (keep it in Preferences) so there is a single source of truth in the UI. — _Duplicated controls for the same state are a coherence/recognition failure._ (P2)
- **[low]** Use BODY (not MUTED) for the email value and any read body text. — _MUTED is documented chrome-only and fails AA for body content per the token comments._ (P7)


#### AccountSecuritySection
*File:* `src/components/account/AccountSecuritySection.jsx`
*Purpose:* Login & Security: change password (re-auth), reset via email, linked accounts (link/unlink Google/Discord), sign out everywhere, 2FA coming-soon stub.
*Layout today:* One Section with four border-top-separated blocks, each a label + controls; generic error/ok banners; 'signed in as' footnote.

| Q | Verdict | Finding |
|---|---|---|
| Error prevention & recovery: are password rules enforced and reversible? | **good** | Validates current+new, 8-char min, match (AccountSecuritySection.jsx:93-104); errors are generic by design and a Cancel always present. Strong. |
| Error messages: plain language + next step? | **good** | Messages like 'The new passwords do not match.' are domain-plain (AccountSecuritySection.jsx:101); link/unlink failures surface actionable text. |
| Borders vs whitespace: do the border-top dividers earn their place? | **adequate** | Four borderTop rules inside one card (lines 230,280,301) plus the card border — readable, but spacing alone could carry most of these divisions. |
| Match real world: '2FA coming soon' honest? | **good** | 2FA is a clearly-labeled disabled stub with a 'Coming soon' chip (AccountSecuritySection.jsx:284-296) — honest, no dark pattern. |
| Accessibility: keep-one-method guard communicated in >=2 channels? | **good** | Unlink disabled + title tooltip + explanatory prose (AccountSecuritySection.jsx:254-256, 234-236). Multi-channel. |

*Overhaul:*
- **[low]** Replace some borderTop dividers with larger inter-block spacing, keeping a divider only where contrast is needed. — _Spacing-first grouping reduces the in-card line clutter._ (P5)
- **[low]** Consider hoisting 'sign out everywhere' next to the other sign-out controls or clearly distinguish it, since the app now has multiple sign-out affordances. — _Reduce the spread of sign-out actions across surfaces._ (P8)


#### AccountSubscriptionSection
*File:* `src/components/account/AccountSubscriptionSection.jsx`
*Purpose:* Tier, credits, saves status; manage-billing portal; inline credit-pack purchase; Founder tile.
*Layout today:* Three side-by-side stat cards (Tier/Credits/Saves), each growing a colored upgrade footer; then manage-subscription button (premium), an inline 3-pack purchase row, and the Founder tile.

| Q | Verdict | Finding |
|---|---|---|
| Emphasis on change: deltas vs static absolutes? | **adequate** | Cards show absolutes (tier, balance, X/Y saves) but the contextual footers ('One save left.', 'Saves full.', AccountSubscriptionSection.jsx:119-130) act as anomaly cues — a reasonable approximation of change-emphasis. |
| Engineer the peak: are caps reframed as previews? | **good** | The footers reframe limits as Cartographer previews ('every size, unlimited saves, neighbours, AI prose pass', line 64-65) rather than denials. On-message per P9. |
| Color as sole channel for the three cards? | **weak** | Tier=gold, Credits=violet, Saves=green are distinguished primarily by background tint (lines 40,72,100) with similar layout; the violet/green/gold semantic relies heavily on color, and each footer uses bold + color which is okay, but the card identity itself is color-led. |
| Error messages: purchase failure handled? | **good** | purchaseError renders a domain banner (lines 160-168) and per-pack 'Redirecting...' status (line 203). Good feedback. |
| Width & reflow: do the cards reflow on tablet? | **good** | flex '1 1 180px' wrap (line 39) reflows by content width, not breakpoints. Correct per P12. |
| Borders vs box-soup: pack buttons? | **adequate** | Three pack buttons each carry a 2px tinted border (line 188); acceptable as they are genuine selectable cards, with discount badges as a second channel. |

*Overhaul:*
- **[low]** Add an icon/glyph header to each stat card (crown/zap/save) so Tier/Credits/Saves are distinguishable without relying on the tint. — _Encode the card's meaning in >=2 channels, not color alone._ (P7)
- **[low]** Lead the section with the single most action-relevant state (e.g. 'One save left' / '0 credits') rather than three equal cards, so the focal point is the thing needing attention. — _One focal point; emphasize the anomaly the GM must act on._ (P4)


#### AccountDataPrivacySection
*File:* `src/components/account/AccountDataPrivacySection.jsx`
*Purpose:* Data rights: export JSON, sharing/visibility defaults, privacy/analytics consent (embedded), bulk content deletion, typed-confirm account deletion request.
*Layout today:* One Section, five border-top-separated blocks; deletion blocks expand into danger-tinted confirmation panels (typed DELETE for account).

| Q | Verdict | Finding |
|---|---|---|
| Error prevention: are destructive actions confirmed/previewed? | **good** | Bulk wipe is confirmation-gated with exact counts (lines 188-191); account deletion requires typing DELETE and is a soft-delete request with a grace window (lines 103-120, 220-222). Excellent error prevention. |
| Error messages: deletion failure path? | **good** | Deletion failure routes to 'contact support' guidance (line 116); queued success is plain-language (lines 215-216). Solid. |
| Empty state: are zero-count deletes handled? | **good** | Delete buttons disable at count 0 (lines 199,202). Correct. |
| Borders vs whitespace: many border-top dividers? | **adequate** | Five borderTop dividers in one card (lines 140,174,179,210) — heavy but each block is genuinely distinct; spacing could carry some. |
| Accessibility: typed-confirm labeled, danger conveyed in >=2 channels? | **good** | DELETE input is aria-labelledby a danger label (lines 231-240) and danger is color + AlertTriangle icon + prose. Multi-channel. |

*Overhaul:*
- **[low]** Group the two deletion blocks (content wipe + account deletion) visually adjacent and slightly apart from benign export/consent, using spacing. — _Quarantine destructive controls so they don't sit flush against export/consent._ (P5)


#### AccountPreferencesSection
*File:* `src/components/account/AccountPreferencesSection.jsx`
*Purpose:* Durable generation/export/notification defaults (detail level, AI-polish, PDF style, campaign map autosave, email notifications).
*Layout today:* Intro line + five PrefRow rows (label/desc left, control right), each with a borderBottom; 'saves automatically' footnote.

| Q | Verdict | Finding |
|---|---|---|
| Match real world: domain language, no engine jargon? | **good** | Labels are GM-native ('The altitude a fresh dossier opens at.', line 64; detail levels guided/standard/expert). On-voice. |
| System status: is auto-save communicated? | **good** | 'Preferences save automatically.' with a check icon (lines 138-139). Clear. |
| Distinctness: email-notifications duplicated with Profile? | **weak** | Email notifications appears here (lines 124-136) AND in AccountProfileSection — the same toggle in two sections. Confusing source-of-truth. |
| Borders: borderBottom on every PrefRow? | **adequate** | Every PrefRow has a borderBottom (line 38) creating a ruled-table look; acceptable for a settings list but heavier than needed. |

*Overhaul:*
- **[med]** Keep email-notifications here only and drop it from Profile (paired with the Profile finding). — _Single source of truth for one setting._ (P2)
- **[low]** Drop the per-row borderBottom in favor of row spacing + zebra tint if separation is needed. — _Reduce ruled-line clutter; spacing carries grouping._ (P5)


#### AccountSupportSection + AccountFAQ + AccountTickets
*File:* `src/components/account/AccountSupportSection.jsx, AccountFAQ.jsx`
*Purpose:* FAQ-first self-resolve, then the ticket workflow (list/create/thread/reply) plus a direct email fallback.
*Layout today:* Section: FAQ heading + intro + accordion (6 Q&A), then AccountTickets.

| Q | Verdict | Finding |
|---|---|---|
| Cognitive walkthrough: does FAQ-first reduce ticket load correctly? | **good** | FAQ rendered before tickets with explicit 'if none solve it, open a ticket' guidance (AccountSupportSection.jsx:30-37). Sound flow. |
| Consistency: does AccountFAQ use shared theme tokens? | **weak** | AccountFAQ re-declares its OWN local GOLD/INK/BODY/MUTED/BORDER/sans from swatch (AccountFAQ.jsx:25-30) instead of importing theme tokens like every sibling — a drift risk if the palette changes. |
| Accessibility: accordion ARIA? | **adequate** | Accordion buttons have aria-expanded (AccountFAQ.jsx:71) but the answer panel isn't linked via aria-controls/region. Partial. |
| Empty state: no tickets yet? | **adequate** | AccountTickets handles its own list (not re-read here); the support intro + email fallback prevent a dead-end. |

*Overhaul:*
- **[med]** Replace AccountFAQ's locally-redeclared color constants with imports from theme.js. — _Cross-surface consistency; avoid a private palette that silently diverges._ (P11)
- **[low]** Add aria-controls + role=region linkage between each FAQ button and its answer panel. — _Complete the disclosure ARIA contract._ (P7)


#### AdminPanel (shell + UserRow + stats + sections)
*File:* `src/components/AdminPanel.jsx`
*Purpose:* Developer/admin console: stats, inline-editable user table (role/tier/credits), and seven stacked Section panels (user search, gallery reports, trends, analytics, sim tuning, support queue).
*Layout today:* PAGE_MAX column: Back + title, three stat cards, a User Management card (search + column headers + scrollable rows), then six more Section cards.

| Q | Verdict | Finding |
|---|---|---|
| Layout & spacing: do the seven sections form a navigable structure? | **weak** | Seven equal-weight Section cards stacked with uniform SP.lg gap (AdminPanel.jsx:300) and no in-page nav/tabs — a very long admin scroll with no wayfinding; the squint test yields a uniform stack. |
| Accessibility: is the user 'table' a real table? | **weak** | The user list is flex divs with a separate flex 'column headers' row (AdminPanel.jsx:362-373, UserRow), not a semantic <table>/<th> — header-cell association is lost for screen readers on tabular data. |
| Error prevention: are inline role/tier/credit edits confirmed? | **weak** | Inline edits save immediately on check-click with no confirmation (UserRow saveEdit, AdminPanel.jsx:61-90) and failures only console.error (line 86) — a consequential, audited mutation (granting developer role / credits) with no user-facing success/failure feedback or undo. |
| System status: feedback after an edit? | **broken** | On save the row just calls onUpdate() (re-fetch) with no toast/confirmation; on error nothing surfaces to the admin (line 85-88). The actor cannot tell whether a privilege change succeeded. |
| Match real world: any engine jargon in admin copy? | **adequate** | AdminPanel itself is clean, but a sibling (AdminTrendsPanel.jsx:423) leaks 'migrations 036-040' into a user-visible empty state — internal jargon in the UI. |
| Distinctness: is admin clearly distinct from account? | **good** | Purple-accented Section icons + 'Admin Panel' title + access-denied guard (AdminPanel.jsx:289-296) make it unmistakable. Good. |
| CTA discipline: one primary action per region? | **adequate** | Back is gold-primary; Refresh is ghost; inline edits are ghost values — reasonable, though the value-as-button pattern (clickable credits/role text) is a low-affordance control relying on the footnote 'Click any value to edit' (line 388-390). |

*Overhaul:*
- **[high]** Convert the user list to a semantic <table> with <thead>/<th scope=col>, and make inline-editable cells proper buttons/inputs with visible affordance. — _Tabular data needs real table semantics for POUR; the value-as-text edit is non-obvious._ (P7)
- **[high]** Add success/error feedback (toast or inline banner) for every admin mutation, and surface the caught error instead of console-only. — _Consequential audited privilege changes must confirm status and recovery, never fail silently._ (P10)
- **[med]** Add a confirmation step for high-impact edits (granting developer/admin role, large credit grants). — _Irreversible/sensitive mutations should be confirmed._ (P10)
- **[med]** Introduce a tab or sticky section-nav across the seven panels instead of one long scroll. — _Wayfinding for a dense console; one focal area at a time._ (P4)
- **[low]** Replace the 'migrations 036-040' empty-state copy (AdminTrendsPanel) with admin-domain language. — _No internal/engine jargon should leak into the UI, even in admin._ (P11)

