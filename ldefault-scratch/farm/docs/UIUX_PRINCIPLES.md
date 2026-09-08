# SettlementForge — UI/UX Guiding Principles

> The ultimate, audience-weighted design north-star + the canonical review checklists, synthesized from exhaustive research across 12 design dimensions (spatial layout, visual hierarchy, perception/psychology, CTA-flow, onboarding, density, IA, TTRPG-audience UX, emotional/brand, accessibility, consistency) and weighted to the expert Game-Master / worldbuilder audience.

> **Copy/voice is governed separately by [`docs/VOICE_AND_TONE.md`](VOICE_AND_TONE.md)** ("calm campaign archivist"). This document owns *structure* — spatial layout, hierarchy, flow, IA, interaction, and the legibility foundation. The two are complementary; where this doc touches words, defer to the voice bible.

## North Star

SettlementForge's interface exists to make a deterministic simulation feel legible, trustworthy, and runnable to an expert, lore-fluent, time-pressured Game Master. The content — a coherent, causally-linked settlement and its living region — is the hero; the UI is the calm, credible frame that lets a GM extract the runnable essentials in one glance during play, then drill into simulated depth on demand. Every screen must serve two readers at once: the skimmer hunting "who runs this town and why is it tense" mid-session, and the worldbuilder verifying that the simulation hangs together. The design's job is therefore restraint over ornament, hierarchy over density, and visible causal coherence over black-box output — because to this audience, coherence is the entire difference between a premium "simulator" and a dismissible "generator" or "AI hallucination." The parchment/serif aesthetic is a real trust asset and conversion lever, but it earns its keep only when it never fights legibility; the moment beauty taxes the at-the-table scan, the content has lost to the chrome. Anchor every decision to one question: does this help a GM trust the world and run it faster?

## The Principles

### P1 — Content is the hero; the engine owns the complexity

**Rule.** Lead every surface with the runnable essentials and let the deterministic engine — not the GM — absorb the irreducible complexity. The zero-input default path must produce a complete, coherent, runnable settlement; configuration is an expert accelerator, never a precondition. Surface deep simulation detail through progressive disclosure with strong information scent, never as an upfront dump.

**Why.** Tesler's Law: complexity is conserved — whatever the system doesn't absorb, the user pays for. 'Simulates, not rolls on a table' is only credible if depth arrives free and coherent. Aesthetic-minimalist design and cognitive-load theory both say every extraneous unit dilutes the relevant ones; the intrinsic complexity of food/legitimacy/trade/factions/war/faith IS the value and must be preserved, but everything around it should recede.

**How to apply (SettlementForge).** Keep the dossier opening with settlement identity + headline state + a few hot-path facts (name, size, ruler/NPCs, current crisis, hooks) before any deep section. Preserve and generalize the EngineSections self-gating pattern (sections render to null when there is no live/causal content) so a peaceful settlement stays clean. Keep LayeredConfigurationPanel's always-on Foundations + collapsible Fine-tune/Deep with scent hints. Never trim the 17 archetypes or Deep knobs to satisfy a misremembered '7' — for this expert audience, familiar categorized breadth is the paid value.

### P2 — Make causal coherence visible — trust is the product

**Rule.** Expose WHY the simulation produced this state (food deficit + contested legitimacy + nearby war → tension) and keep named entities (NPCs, factions, places, bands) identical across every tab and across settlements in a region. A visible contradiction is the cardinal sin.

**Why.** Stanford web credibility: users judge trustworthiness on perceived expertise and verifiability; black-box output reads as a random roll or AI hallucination to a lore-fluent GM. For this audience worldbuilding is a data-consistency problem — contradictory lore breaks immersion faster than anything else and nukes the aesthetic-usability trust halo instantly.

**How to apply (SettlementForge).** Keep the causal-chain / cascade viewers and worldPulse cross-settlement dynamics legible, not buried — let the GM SEE the system hang together. After Advance Time, consequences must follow plausibly from prior state. Audit every place a named entity is rendered twice (cross-tab, cross-settlement, dossier vs PDF, public vs private copy) for drift. Treat any band that disagrees with its own narrative as a P0 bug.

### P3 — Emphasize change, not static stats — show the living world

**Rule.** Lead with deltas, trends, and anomalies (food -2, legitimacy ↓ Contested, 'unrest rising'), not just new absolute values. The product's differentiator is causal change over time, so the movement should be the focal point.

**Why.** In data-dense displays the highest-signal items are deltas and anomalies, not raw numbers. This is also the strongest possible argument that it's a simulation and not a table roll — and it directly serves the deferred Deployed-Troops / Trade-War cross-settlement features in the roadmap.

**How to apply (SettlementForge).** On Advance Time and worldPulse effects, render comparisons to the previous tick with trend glyphs/sparklines per meter. Structure the dossier as headline state → key meters with deltas → deep faction/event detail. Reserve saturated semantic color for the anomaly (a 'critical/collapsed' band the GM must not miss), not for the baseline.

### P4 — Three-lever hierarchy; de-emphasize to emphasize; one focal point per view

**Rule.** Build importance from at least two of {size, weight, color} together — never size alone, never thin/light weights for de-emphasis. Make the value pop by quieting its label and neighbors, not by escalating the focal element. Each view has exactly one dominant entry point, capped at ~3 perceivable levels per panel.

**Why.** Refactoring UI: hierarchy rides on multiple inverse levers; emphasis is relative, so suppression beats addition. Smashing/Von Restorff: 'everything louder' means nothing is heard; people perceive ~three levels of dominance and recall the one isolated element. Light weights read as washed-out and low-quality, especially on parchment.

**How to apply (SettlementForge).** Define a strict 3-tier type system per dossier section (Lora display title / value / muted label). On parchment, de-emphasize with the same hue at lower saturation ('aged ink'), not cool grey. Run the squint/blur test on every key view (dossier, Realm, Pricing, Library, generator): the settlement identity + headline state must survive the blur — not badges, chrome, or two co-equal CTAs. Avoid gold/violet/green/red/amber all firing at once and flattening the hierarchy.

### P5 — Spacing carries grouping; reduce borders and avoid box-soup

**Rule.** Group with differential spacing first (tight within a cluster, clearly looser between clusters), then a background tint or subtle shadow; reach for a bordered card only when whitespace can't carry it. Breathe between chunks, stay tight within them.

**Why.** Gestalt proximity/common-region: spacing is the cheapest grouping cue and overpowers ambiguity, while every extra border adds clutter and can create 'false floors' that read as page-end and suppress scrolling. Over-containerization on top of the painted-map background is this app's specific clutter risk in a long, multi-section dossier.

**How to apply (SettlementForge).** Encode the space-1..space-12 perceptual scale into grouping (e.g. space-2 within a stat row, space-7 between dossier sections). Flatten nested cards to one elevation level; where a stat is currently boxed, replace cell borders with spacing + tint so numbers read as a clean ledger, not a spreadsheet grid. Make the SectionShell colored left-border carry consistent semantic meaning (economy/defense/faith) so the boundary teaches as it groups, and reserve strong borders for genuinely distinct surfaces (the violet AI layer vs simulation tabs).

### P6 — Front-load and chunk for the scan — structure for the GM's eye-path

**Rule.** Write and lay out for skimming, not reading: information-bearing keyword-first headings ('Factions & Tensions', not 'Politics'), bold scannable facts, chunked sections, the most table-relevant fact at the top-left of each card. Visually distinguish prose-to-read (the AI narrative layer) from data-to-scan.

**Why.** Users scan in layer-cake (skim headings to find the faction part) and spotted (hunt the population) modes; the wasteful F-pattern is a symptom of weak formatting that buries the war declaration on the right. Concise/scannable/objective writing measured ~124% higher usability. Chunking keeps each unit within one working-memory slot.

**How to apply (SettlementForge).** Lead every EngineSection with its keyword and headline fact. Cap/group long faction/threat/export lists so they don't blow past ~7±2. Co-locate causally-linked facts so the GM never has to hold a faction from one tab while reading another (offload memory with a sticky settlement header / PendingChangesBar). Keep narrative prose to the prose-820 measure and visually marked (the violet tint) so the GM knows which mode each surface wants. Preserve scannability when curating 'elegant' prose.

### P7 — Encode every state and emphasis in at least two channels

**Rule.** Never let color be the sole carrier of meaning. Pair it with an icon, glyph, text label, weight, shape, or position — for both semantic states and emphasis.

**Why.** WCAG 1.4.1 makes this normative; ~8% of GMs have color-vision deficiency; and warm gold-on-cream / parchment-on-parchment contrast is marginal, so a second channel also makes hierarchy robust on the textured surface. Von Restorff isolation only works if the distinctive element is multi-channel.

**How to apply (SettlementForge).** Keep BandPill's color + glyph + uppercase label pattern everywhere a band appears (it is exemplary — preserve it). Pair 'at war' with a crossed-swords icon and text, 'famine risk' with an icon, negative meters with a down arrow plus color. Tier badges (Wanderer/Cartographer/Founder) and credits (violet) carry labels/icons, not hue alone. Verify emphasized text meets 4.5:1 on parchment; keep muted-500 out of body copy (chrome-only, as the tokens already mandate).

### P8 — One unambiguous primary action per region; first click must land

**Rule.** Each region has exactly one high-emphasis primary button (large, near, distinct), with secondary (outline) and tertiary/ghost actions visibly subordinate. Style buttons by task importance, not HTML semantics. The correct first click for each page's primary task must be obvious.

**Why.** Button hierarchy is the direct UI expression of Hick's Law (one dominant CTA cuts decision time) and Fitts's Law (primary targets big and reachable); first-click success strongly predicts task success. A loud destructive button just because it 'is a button' misdirects attention and risks a GM's months of campaign work.

**How to apply (SettlementForge).** Generator: 'Simulate Settlement' = primary; Save/Advance = secondary; Reset/Copy/export = ghost. In the dossier and Realm, the many actions (regenerate, pin, export, share) are mostly ghost icon-text so they don't out-shout content. Upgrade/credits CTAs are primary only on Pricing/Account, secondary elsewhere. Give Delete low emphasis + confirmation (DeleteConfirmation). Verify the anon→first-generation first click is unmissable; ensure map/dossier touch targets hit ~44px (the mobile smoke tests imply mobile matters).

### P9 — Engineer the peak and the end; turn limits into previews

**Rule.** Protect the PipelineReveal as the emotional peak (the moment depth becomes legible and 'this is a real engine, not a roll' lands), and close every flow on a runnable, evocative detail plus one clear next step. Reframe negative peaks (anon size cap, upgrade walls, errors) as satisfying previews, never denials.

**Why.** Peak-End Rule: people judge an experience by its most intense moment and its end. The reveal is SettlementForge's wow and its premium justification; a hard paywall slap right after it is a peak-end violation that directly costs conversion. Doherty: a deliberate ~2s narrated delay converts suspiciously-instant output into perceived depth and value — applied exactly right.

**How to apply (SettlementForge).** Keep PipelineReveal's MIN_TOTAL_MS pacing, staged narration, and Esc fast-path for power users; everywhere else honor the real <400ms threshold (tab switches, drawers, autosave) with lazy first-paint and skeletons for async fetches (gallery/library/account). End generation on the settlement's most evocative detail + a single next action (PostGenCoach), not a wall. Present the anon cap as 'here's a town — the engine can simulate a metropolis' (AnonTierTeaser/BuyThisDossier). Use Zeigarnik open loops (a brewing coup, a strained granary) to pull GMs back to advance time — without dark-pattern nags.

### P10 — Status, recovery, and plain-language errors for long-running simulation

**Rule.** Show real progress for any operation over ~10s (which simulation stage is running, not a bare spinner), make every consequential mutation reversible or clearly warned, and write every error in domain language stating what went wrong AND what to do next with a CTA.

**Why.** Nielsen heuristics 1/3/5/9: visibility of system status in complex apps, user control/freedom, error prevention, and recovery. A generic spinner breaks the GM's trust that depth is being computed; a dead-end 'not importable' or raw tier-cap failure offers no path forward; regenerating over hand-edited DM notes can destroy months of work.

**How to apply (SettlementForge).** PipelineRail/PipelineReveal must name the stage being computed. Gate every destructive or consequential action (regenerate, delete, canonize, import, Advance Time) with confirmation/preview/undo and an always-present labeled Cancel (the StaleNarrativeModal/DeleteConfirmation pattern). Turn tier caps and blocked imports into 'Upgrade to Cartographer to generate cities' with a CTA. FeatureErrorBoundary must degrade with a recovery action, never a technical crash.

### P11 — Domain-native language, conventions, and cross-surface consistency

**Rule.** Speak only the GM's language (faction, legitimacy, region, tier, dossier, stat block) and never leak engine internals (seed, RPC, partialize, canonStatus vs phase, worldPulse). Honor both web conventions (tabs/cards/ARIA) and TTRPG conventions (stat blocks, dossiers, hex/region maps). Shared actions look and sit identically everywhere.

**Why.** Nielsen 2/4 and Jakob's Law: users expect your tool to work like the ones they already know, and inconsistency in an expert tool compounds inefficiency. Save/Canonize/Share/Import/Export/Delete differing in label/icon/placement across SettlementCard / SettlementDetail / OutputContainer / GalleryDetail violates consistency; novel metaphors force the GM to learn a new grammar mid-prep.

**How to apply (SettlementForge).** Keep the GM-native nav (Library/Realm/Compendium/Gallery) and ensure those four stay distinct and non-confusable. Audit shared actions for identical label/icon/placement across all card/detail surfaces. Keep enforcing the primitives/Button + tokens system (raw <button> and raw color are lint-banned). Burn down the deferred escape hatches — the ~140 swatch hex keys and inline rgba/gradient literals (including BandPill's own rgba) onto semantic tokens — so consistency and a future dark theme are real, not aspirational. Gloss tier names in plain GM-outcome terms (more settlements, bigger cities, world sim).

### P12 — Width discipline, responsive reflow, and frame-not-fullbleed

**Rule.** Route every page width through the shared caps (page 1200 / prose 820 / form 460); never go edge-to-edge. Hold long-form lore to the ~45–75ch prose measure even inside a wider card, and let card grids reflow by content width, not device breakpoints.

**Why.** Refactoring UI: filling all available width hurts readability and dilutes focus; different content types need different widths. The parchment framing depends on content being a framed document, not a full-bleed app, and intrinsic/auto-fit grids keep the dossier single-column-legible on a tablet at the table.

**How to apply (SettlementForge).** Verify all top-level pages consume layout.page/prose/form rather than reinventing the old arbitrary 440/680/760/860/960/1100 widths. Use repeat(auto-fit, minmax(min, 1fr)) for Library/Gallery/dossier sub-grids so they collapse to one readable column on narrow screens with breakpoints set where content breaks. Keep the painted-map background framing the document; protect card padding so content never crowds the textured edges.

## Per-page review checklist

Apply to *every* page/card. Includes the required 11 questions (purpose, layout, fulfils purpose, cohesion, psychology, design optimality, distinctness, element placement, intuitiveness, button→function mapping) plus the superset below.

1. Purpose & 5-second test: In 5 seconds can a GM tell what this page is for, who it's for, and what to do next — and does the intended takeaway ('a SIMULATOR for DMs', or this settlement's identity/state) land as the recalled message?
2. Layout & spacing-as-grouping: Squinting at the page, do distinct chunks emerge from SPACING ALONE (tight within, looser between), or is the gap rhythm uniform/ambiguous? Are all gaps from the space-1..space-12 scale?
3. Does it fulfill its purpose: Does the page actually let the user complete the primary task it exists for — and for the dossier, can a GM grab the runnable essentials before deep detail?
4. Cohesion with the whole flow: Does this page hand off cleanly to the steps before and after it (e.g. config→generate→dossier→save/place), with no dead-ends and shared context carried forward?
5. Plays on human psychology: Does the page exploit the right law — peak/end at the reveal and closeouts, Zeigarnik open loops for unfinished drafts, recognition-over-recall for pickers, goal-gradient for progress — without dark patterns?
6. Design optimality: Is hierarchy built from ≥2 of {size, weight, color} (never size or thin weight alone), capped at ~3 perceivable levels, with one focal point that survives the squint/blur test?
7. Distinctness from other pages: Is this page visually and functionally distinct from its siblings (Library vs Gallery vs Compendium vs Realm), so a GM never confuses where they are or what this surface does?
8. Placement of every button/link/element by importance & purpose: Is each element positioned by frequency/importance (primary actions large and edge/near per Fitts; high-value items at list ends per serial-position; destructive actions small and separated)?
9. Intuitiveness & first click: For the page's primary task, is the correct first click obvious and unambiguous, with no decoy controls drawing clicks away?
10. Correct button→function/link mapping: Does every control actually do what its label/icon promises, route to the right destination, and use the shared name/icon for that action used elsewhere in the app?
11. Primary CTA discipline: Is there exactly one high-emphasis primary action per region, with secondary (outline) and tertiary/ghost actions clearly subordinate, styled by task importance not HTML semantics?
12. System status & perceived speed: Does every action give immediate feedback; do >10s operations show the actual simulation stage (not a bare spinner); do <400ms interactions feel instant, with skeletons for async fetches?
13. Match real world (domain language): Does every label/icon use GM/TTRPG terms with zero engine jargon (seed, RPC, partialize, canonStatus, worldPulse) leaking through?
14. Error prevention & recovery: Are error-prone inputs constrained with smart defaults, consequential/irreversible actions confirmed or previewed, and is a labeled Cancel/exit/undo always present?
15. Error messages: When something fails, does the message state in plain language what went wrong AND what to do next (with a CTA), never a code or dead-end (incl. tier caps and blocked imports reframed as upgrade moments)?
16. Recognition vs recall: Is everything the user needs visible/recognizable here, with references shown in context, so they needn't remember data from a prior screen or hold it across tabs?
17. Scannability & content: Are headings keyword-first and information-bearing, facts bold/scannable, prose chunked and front-loaded for layer-cake/spotted scanning — with prose-to-read visually distinct from data-to-scan?
18. Cognitive load & choices: Is the number of choices/fields on this step minimized where speed matters, lists kept/grouped within ~7±2, and is anything extraneous (decorative texture, redundant chrome) competing with the content?
19. Progressive disclosure: Does the page lead with essentials and reveal depth/advanced settings on demand with strong information scent — without collapsing the frequently-used expert controls the paying GM scans?
20. Borders vs whitespace (anti-box-soup): Is every border/card/shadow earning its place, with nested containers flattened, no 'false floors' that read as page-end, and the colored left-border carrying consistent semantic meaning?
21. Emphasis on change: Where the simulation has advanced, does the page surface deltas/trends/anomalies as the focal point rather than only static absolute values?
22. Empty state: If there's no data yet, does the page explain what will appear, what to do next, and offer a one-click sample/template CTA (two parts instruction, one part delight)?
23. Accessibility (POUR): AA contrast incl. parchment/gold (≥4.5:1 body); state and emphasis conveyed in ≥2 channels (never color alone); full keyboard operation with visible focus; ~44px touch targets; correct labels/ARIA; semantic markup (real table headers, headings, page language)?
24. Consistency & conventions: Do labels, icons, placement, and styling for shared actions match the rest of the product and follow platform + TTRPG conventions (Jakob's Law)?
25. Trust/credibility: Does the page look credible at a glance, let the GM verify how results were derived, disclose provenance honestly (what's stripped from public copy), and contain zero typos/inconsistencies?
26. Width & responsive: Does content route through the page/prose/form caps (no full-bleed), hold prose to ~45–75ch, and reflow to a single readable column on a tablet at the table?
27. Cognitive walkthrough (per step): Will the user form the right goal, notice the correct control, associate it with the desired outcome, and get clear feedback of progress after acting?
28. Runnability (audience): Can a GM grab this page's runnable essentials at a glance mid-session before the deep detail, with a quick-reference vs deep view where needed and PDF/print parity preserved?
29. Coherence (audience): Does the simulated content read as internally consistent and causally justified, with named entities matching across surfaces and the underlying logic visible enough that an expert trusts and can extend it?

## Whole-system review checklist

1. Value proposition & differentiation: Across all surfaces, is it consistently clear that this SIMULATES (not table-rolls, not AI-generates) and why that depth/coherence is better for the target GM?
2. Information architecture: Do top-nav labels match the GM's mental model, and are Forge/Realm/Library/Compendium/Gallery distinct and non-confusable on a tree test (where does a generated settlement go; how do I get it onto my map; my saves vs public showcase vs reference)?
3. Navigation & wayfinding: Is global nav consistent everywhere, is current location always clear, and can a GM reach the core task (generate) and return to their work (Library/Realm) from any surface?
4. Cross-surface consistency: Are shared actions (Save, Canonize, Share, Import, Export, Delete) identically named, placed, and styled across every component, and is the tokens/primitives system applied uniformly (no per-page width or color drift)?
5. Token & escape-hatch burn-down: Are the deferred bypasses — the ~140 swatch hex keys, inline rgba/gradient literals (incl. BandPill), and any raw px sizes — migrated onto semantic tokens so consistency (and a future dark theme) is real rather than aspirational?
6. End-to-end task flows: Do the key journeys (anon→first dossier; create campaign→add settlement→advance time; share→import from gallery; free→upgrade) work step-by-step with right-goal/notice/associate/feedback at each step?
7. Conversion funnel: Where are drop-offs in anon→signup→free→paid, is the upgrade prompted at a value-realized moment rather than a wall, and is signup friction minimal at the point of intent?
8. Pricing: Are there 3–4 transparent tiers with one visually highlighted recommended plan, GM-legible differences (depth/size/world-sim/credits), action-oriented CTAs, free trial surfaced, and mobile-optimized layout?
9. Onboarding & activation: Does a first-time GM reach a 'wow' runnable dossier fast by doing, and do empty states/coaches (OnboardingCoach, PostGenCoach, FirstDossierCallouts) drive concrete first actions and set expectations for the simulation?
10. Flexibility for power users: Are there accelerators (shortcuts, saved config presets, batch Library actions, expert skip-paths, remembered Deep-section expansions for returning Cartographers) so repeat GMs prep faster while novices still get guidance from the same flows?
11. Help system: Is help in-context (tooltips explaining what 'legitimacy'/'defense posture' mean and how they were simulated), searchable (Compendium), task-focused, and concrete — so the GM grasps the depth model without leaving their work?
12. Performance & perceived speed: Do interactions feel <400ms or carry feedback to compensate, with the deliberately-slowed PipelineReveal as the only intentional delay (and an Esc fast-path), and lazy first-paint/skeletons covering generate/advance/map/PDF/fetches?
13. Trust & credibility holistically: Does the product feel like a trustworthy expert simulator (verifiable causal logic, coherent results, honest provenance disclosures, polished error-free craft) across every surface?
14. Memorable peak & end: Is there an engineered emotional peak (the dossier reveal) and satisfying ends (post-generation, post-advance) rather than dead-ends, with unfinished drafts surfaced to pull GMs back?
15. Accessibility & responsive baseline: Does the whole product meet WCAG 2.2 AA, convey all state in ≥2 channels, work on mobile/tablet at the table (≥44px targets), and degrade gracefully via FeatureErrorBoundary without technical crashes?
16. Audience coherence at scale: Across many settlements/factions/regions, does the world stay internally consistent (cross-references resolve, named entities match across settlements, advancing time yields plausible consequences, worldPulse reads coherently) so lore-fluent GMs keep trusting it?
17. Aesthetic vs legibility pressure-test: Has the parchment/serif polish been tested with real GMs running a dossier under time pressure — where the trust halo wears off — to confirm beauty is never adding extraneous load or hurting the at-the-table scan?
18. Review meta: For each finding, is the violated heuristic/principle named, the exact location cited, a severity assigned, and a concrete fix proposed — and are existing strengths (token system, EngineSections self-gating, BandPill multi-channel bands, PipelineReveal pacing, anti-vacuity gating, lazy first-paint) documented and preserved, not just problems?

## Appendix — research sources by dimension

### Heuristic & professional UX review questions for evaluating individual pages AND the whole product — the complete reviewer question set, weighted for the expert TTRPG GM / worldbuilder audience and applied to SettlementForge

- **Nielsen Heuristic 1 — Visibility of System Status (esp. in dense/long-running simulation displays)** (high relevance) — https://www.nngroup.com/articles/usability-heuristics-complex-applications/
- **Nielsen Heuristic 2 — Match Between System and the Real World (speak the GM's domain language)** (high relevance) — https://www.nngroup.com/articles/ten-usability-heuristics/
- **Nielsen Heuristic 3 — User Control and Freedom (emergency exits, undo, no lost work)** (high relevance) — https://www.nngroup.com/articles/ten-usability-heuristics/
- **Nielsen Heuristic 4 — Consistency and Standards (internal + external + platform conventions)** (high relevance) — https://www.nngroup.com/articles/ten-usability-heuristics/
- **Nielsen Heuristic 5 — Error Prevention (before Heuristic 9 error messages)** (high relevance) — https://www.nngroup.com/articles/ten-usability-heuristics/
- **Nielsen Heuristic 6 — Recognition Rather Than Recall (minimize memory load across a deep tool)** (high relevance) — https://www.nngroup.com/articles/ten-usability-heuristics/
- **Nielsen Heuristic 7 — Flexibility and Efficiency of Use (accelerators for power-user GMs)** (high relevance) — https://www.nngroup.com/articles/usability-heuristics-complex-applications/
- **Nielsen Heuristic 8 — Aesthetic and Minimalist Design + progressive disclosure of depth** (high relevance) — https://www.nngroup.com/articles/usability-heuristics-complex-applications/
- **Nielsen Heuristic 9 — Help Users Recognize, Diagnose, and Recover from Errors** (high relevance) — https://www.nngroup.com/articles/ten-usability-heuristics/
- **Nielsen Heuristic 10 — Help and Documentation (in-context, task-focused, concrete)** (high relevance) — https://www.nngroup.com/articles/help-and-documentation/
- **Heuristic Evaluation method — how the review itself is run (severity, multiple evaluators, strengths + violations)** (med relevance) — https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/
- **Cognitive Walkthrough — the 4 first-time-user questions per task step (learnability lens)** (high relevance) — https://www.nngroup.com/articles/cognitive-walkthroughs/
- **5-Second Test — first-impression comprehension of a single page** (high relevance) — https://www.smashingmagazine.com/2023/12/five-second-testing-case-study/
- **First-Click Test — does the first click land on the right path?** (high relevance) — https://www.userinterviews.com/ux-research-field-guide-chapter/first-click-testing
- **Information Architecture & Findability — structure that matches the GM's mental model** (high relevance) — https://www.nngroup.com/articles/ia-study-guide/
- **Conversion / Funnel & Pricing review — anon→free→premium activation and upgrade path** (high relevance) — https://goodui.org/
- **Accessibility — WCAG 2.2 POUR (Perceivable, Operable, Understandable, Robust)** (med relevance) — https://www.w3.org/TR/WCAG22/
- **Laws of UX — Cognitive Load, Miller's Law (chunking), Hick's Law & Choice Overload** (high relevance) — https://lawsofux.com/cognitive-load/
- **Laws of UX — Aesthetic-Usability Effect, Jakob's Law, Fitts's Law, Doherty Threshold** (high relevance) — https://lawsofux.com/
- **Laws of UX — Peak-End Rule, Goal-Gradient & Zeigarnik (motivation through the funnel & sessions)** (med relevance) — https://lawsofux.com/peak-end-rule/
- **Refactoring UI — visual hierarchy, constrained systems, and spacing-as-grouping** (high relevance) — https://www.refactoringui.com/
- **Content Design — concise, scannable, objective writing & scan-pattern-aware layout** (high relevance) — https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/
- **Web Credibility / Trust (Stanford Web Credibility Guidelines, B.J. Fogg)** (high relevance) — https://en.wikipedia.org/wiki/Stanford_Web_Credibility_Project
- **Onboarding & Empty States — first-run activation and 'no data yet' moments** (high relevance) — https://www.appcues.com/blog/user-onboarding-ui-ux-patterns
- **TTRPG audience fit — runnable-at-the-table content & scannable reference design** (high relevance) — https://thedmlair.com/blogs/news/43-must-have-rpg-tools-for-game-masters
- **TTRPG audience fit — coherence & plausibility of the simulated world (the depth promise)** (high relevance) — https://inkwellideas.com/worldbuilding/worldbuilding-local-area-design/worldbuilding-local-area-design-settlements/

### Spatial layout & composition: grid systems, alignment, whitespace, proximity/grouping (Gestalt), focal points, reading patterns, balance, density & rhythm, responsive layout

- **Start with too much whitespace, then remove** (med relevance) — https://refactoring-ui.nyc3.cdn.digitaloceanspaces.com/Refactoring%20UI%20-%20Start%20with%20too%20much%20white%20space.pdf
- **Codify a spacing scale (8-pt grid), spaced perceptually not linearly** (high relevance) — https://www.ajnisbet.com/blog/refactoring-ui
- **Proximity: spacing encodes relationship (tight within, loose between)** (high relevance) — https://www.nngroup.com/articles/common-region/
- **Common Region: containers group, but boxes overpower whitespace — use sparingly** (high relevance) — https://www.nngroup.com/articles/common-region/
- **Three levels of dominance / explicit focal point** (high relevance) — https://www.smashingmagazine.com/2015/02/design-principles-dominance-focal-points-hierarchy/
- **Reading patterns: F-pattern is a failure mode; format to redirect the eye** (high relevance) — https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- **Reading gravity: Gutenberg / Z-pattern for sparse top-level layouts** (med relevance) — https://everydayconcepts.io/gutenberg-diagram
- **Alignment & a shared invisible grid** (high relevance) — https://learnvisual.design/layout-spacing
- **Don't fill the screen by default: constrain width & measure** (high relevance) — https://www.ajnisbet.com/blog/refactoring-ui
- **Manage data density high-level → low-level; offer rhythm not uniform packing** (high relevance) — https://paulwallas.medium.com/designing-for-data-density-what-most-ui-tutorials-wont-teach-you-091b3e9b51f4
- **Chunking for skimming and memory** (high relevance) — https://www.nngroup.com/articles/chunking/
- **Similarity & repetition create rhythm and encode role** (med relevance) — https://ixdf.org/literature/topics/gestalt-principles
- **Balance: symmetry = calm/stability, asymmetry = tension/energy** (med relevance) — https://ixdf.org/literature/topics/symmetry
- **Intrinsic/responsive layout: let content size itself, set breakpoints by content** (med relevance) — https://moderncss.dev/contextual-spacing-for-intrinsic-web-design/

### Visual hierarchy & emphasis discipline (type scale, weight, color, contrast, size, spacing; de-emphasize to emphasize; one focal point per view; button hierarchy; reducing borders in favor of shadow/space)

- **Hierarchy rides on three independent levers: size, weight, AND color — never size alone** (high relevance) — https://www.sglavoie.com/posts/2023/09/09/book-summary-refactoring-ui/
- **De-emphasize to emphasize: turn down competitors rather than turning up the focal point** (high relevance) — https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886
- **One dominant focal point per view; three perceivable levels of dominance is the ceiling** (high relevance) — https://www.smashingmagazine.com/2015/02/design-principles-dominance-focal-points-hierarchy/
- **Button hierarchy: exactly one high-emphasis primary per region; secondary outline; tertiary/ghost recede** (high relevance) — https://subux.pro/guides/article/button-hierarchy-primary-secondary-tertiary
- **Reduce borders — separate with spacing, background tints, and subtle shadow instead** (high relevance) — https://howtoes.blog/2025/07/04/refactoring-ui-complete-book-summary-all-key-ideas/
- **Contrast tiers + color scarcity: neutral baseline, saturated color reserved for meaning** (high relevance) — https://uxtbe.medium.com/designing-ui-for-dense-data-without-turning-the-screen-into-an-excel-spreadsheet-bad61c3c5cae
- **Front-load and format for scanning; good hierarchy overrides the default F-pattern** (high relevance) — https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- **Whitespace as an emphasis tool: isolate to highlight, breathe to reduce clutter** (high relevance) — https://www.smashingmagazine.com/2015/02/design-principles-dominance-focal-points-hierarchy/
- **Emphasize change over absolute values; let detail be explorable, not loud** (high relevance) — https://uxtbe.medium.com/designing-ui-for-dense-data-without-turning-the-screen-into-an-excel-spreadsheet-bad61c3c5cae
- **Never let color be the sole carrier of emphasis (Von Restorff + WCAG 1.4.1)** (med relevance) — https://lawsofux.com/von-restorff-effect/
- **Use the squint/blur test to validate hierarchy and check for competing emphasis** (med relevance) — https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- **Stat-block usability: emphasize the few numbers used constantly, recede the reference detail** (high relevance) — https://medium.com/theuglymonster/ttrpg-character-sheets-are-art-e5ebc7a31acf

### Human visual perception & decision psychology for interfaces (Gestalt, Fitts, Hick, Miller, Jakob, Von Restorff, serial-position, peak-end, aesthetic-usability, cognitive load, Tesler, Zeigarnik, Doherty) — weighted for SettlementForge's expert, time-pressured TTRPG GM / worldbuilder audience

- **Gestalt: Common Region (containers create groups, and override proximity/similarity)** (high relevance) — https://www.nngroup.com/articles/common-region/
- **Gestalt: Proximity & Similarity (spacing and shared traits do the grouping work)** (high relevance) — https://www.nngroup.com/articles/gestalt-proximity/
- **Hick's Law (decision time grows ~log with number of options) — and where it breaks for experts** (high relevance) — https://lawsofux.com/hicks-law/
- **Miller's Law (7±2) — chunk, but do NOT cap menus at seven** (high relevance) — https://lawsofux.com/millers-law/
- **Jakob's Law (users expect your app to work like the others they know)** (high relevance) — https://lawsofux.com/jakobs-law/
- **Von Restorff / Isolation Effect (the thing that differs is remembered)** (high relevance) — https://lawsofux.com/von-restorff-effect/
- **Serial-Position Effect (primacy + recency: ends are remembered, middles fade)** (med relevance) — https://lawsofux.com/serial-position-effect/
- **Peak-End Rule (experiences are judged by their peak and their ending)** (high relevance) — https://lawsofux.com/peak-end-rule/
- **Aesthetic-Usability Effect (beauty is read as usability, trust, and value)** (high relevance) — https://lawsofux.com/aesthetic-usability-effect/
- **Cognitive Load Theory (minimize EXTRANEOUS load; preserve intrinsic)** (high relevance) — https://www.nngroup.com/articles/minimize-cognitive-load/
- **Tesler's Law / Conservation of Complexity (irreducible complexity goes to system or user)** (high relevance) — https://lawsofux.com/teslers-law/
- **Zeigarnik Effect (unfinished tasks create memorable, motivating tension)** (med relevance) — https://lawsofux.com/zeigarnik-effect/
- **Doherty Threshold (sub-400ms response keeps users in flow; manage PERCEIVED performance)** (high relevance) — https://lawsofux.com/doherty-threshold/
- **Fitts's Law (target acquisition time depends on distance and size; edges/corners are 'infinite' targets)** (med relevance) — https://lawsofux.com/fittss-law/
- **Progressive & Staged Disclosure (show the common few first; defer the specialized many)** (high relevance) — https://www.nngroup.com/articles/progressive-disclosure/
- **Scannability & F-Pattern reading (experts scan, they don't read; structure for the eye-path)** (high relevance) — https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/
- **Coherence & continuity as trust (audience-specific: GMs reject inconsistent lore instantly)** (high relevance) — https://www.legendkeeper.com/

### Calls-to-action, button placement, and directing user FLOW/movement between pages

- **Replace generic CTAs with specific, action+object labels (strong information scent)** (high relevance) — https://www.nngroup.com/articles/get-started/
- **One obvious primary action per screen; everything else visibly subordinate** (high relevance) — https://lawsofux.com/hicks-law/
- **No dead ends — every terminal screen offers a next step or clear expectation** (high relevance) — https://uxmag.com/articles/usability-tip-no-dead-ends-please
- **First-run / empty states are onboarding, not edge cases — guide to one activation action** (high relevance) — https://www.useronboard.com/onboarding-ux-patterns/empty-states/
- **Fitts's Law + thumb zones: make primary CTAs large, reachable, and near the user's attention** (high relevance) — https://lawsofux.com/fittss-law/
- **Repeat the primary CTA on long pages (sticky and/or bottom), but keep it the same single ask** (high relevance) — https://dev.goodui.org/patterns/60/tests/46
- **Match accelerators and flexible paths to expert GMs without hiding the obvious path from novices** (high relevance) — https://www.nngroup.com/articles/flexibility-efficiency-heuristic/
- **Use in-context links with strong scent to route GMs to deeper, related pages mid-narrative** (high relevance) — https://www.nngroup.com/articles/information-scent/
- **Build a legible journey: minimize click depth, sequence steps to create momentum, show where you are** (med relevance) — https://lollypop.design/blog/2026/january/wizard-ui-design/
- **Earn the scroll and anchor the primary CTA with visual dominance (contrast + whitespace)** (med relevance) — https://www.smashingmagazine.com/2015/02/design-principles-dominance-focal-points-hierarchy/
- **Honor user control: make CTAs reversible and provide clear 'emergency exits' from any flow** (med relevance) — https://www.nngroup.com/articles/user-control-and-freedom/
- **Carry momentum after the creative act: offer save/export/share/remix as the immediate next move** (med relevance) — https://jackrighteous.com/en-us/blogs/guides-using-suno-ai-music-creation/suno-remix-covers-edits-settlements-studio

### Onboarding, empty states, and progressive disclosure for SettlementForge — first-run experience, teaching in context, empty/zero states as guidance, staged reveal, sensible defaults, "do then learn," reducing time-to-value, and keeping depth discoverable for expert TTRPG GMs / worldbuilders

- **Do, then learn — front the core action, not a tour (push vs. pull revelations)** (high relevance) — https://www.nngroup.com/articles/onboarding-tutorials/
- **Empty states are the primary onboarding surface — three jobs: status, teaching, pathway** (high relevance) — https://www.nngroup.com/articles/empty-state-interface-design/
- **Progressive disclosure — core few first, depth on demand; never hide what experts use often** (high relevance) — https://www.nngroup.com/articles/progressive-disclosure/
- **Staged disclosure (the wizard) for linear creation — distinct from optional progressive disclosure** (high relevance) — https://www.uxdatabase.io/newsletter-issue/04-staged-vs-progressive-disclosure
- **Reduce time-to-value ruthlessly — first value in minutes, required fields only if the engine can't run without them** (high relevance) — https://foundey.com/blog/saas-onboarding-ux
- **Sensible defaults & the default effect — pre-decide the boring choices, keep them overridable** (high relevance) — https://www.ux-bulletin.com/default-effect-in-ux/
- **Tesler's Law (Conservation of Complexity) — the sim must absorb complexity the GM shouldn't** (high relevance) — https://lawsofux.com/teslers-law/
- **Hick's Law — limit and chunk the choices at any one moment** (med relevance) — https://lawsofux.com/hicks-law/
- **Teach in context with dismissible, non-blocking, recallable hints — avoid modal/tooltip overload** (high relevance) — https://www.saasfactor.co/blogs/why-most-product-tours-fail-and-how-to-implement-contextual-onboarding
- **Slack-style scattered empty-slate onboarding — the app teaches itself as it's explored** (high relevance) — https://userguiding.com/blog/slack-user-onboarding-teardown
- **Templates/prompts-as-defaults defeat the worldbuilder's blank page** (high relevance) — https://www.worldanvil.com/features/worldbuilding-templates
- **Goal-gradient & endowed-progress — light-touch completion mechanics, sized for experts** (low relevance) — https://learningloop.io/plays/psychology/goal-gradient-effect

### Simplicity vs. complexity and information density: restraint, signal-to-noise, and managing intentional depth without clutter (weighted for the expert TTRPG GM / worldbuilder audience)

- **Density is a strategy, not a defect — match it to the user and the task** (high relevance) — https://www.nngroup.com/topic/information-density/
- **Progressive disclosure as the primary complexity-management primitive (max 2 levels)** (high relevance) — https://www.nngroup.com/articles/progressive-disclosure/
- **Tesler's Law — complexity is conserved; the system should absorb it, not the user** (high relevance) — https://lawsofux.com/teslers-law/
- **Restraint / 'less but better' (Rams) — good design is as little design as possible, unobtrusive** (med relevance) — https://www.vitsoe.com/us/about/good-design
- **Signal-to-noise ratio — signal is user- and task-dependent; reduce competing elements** (high relevance) — https://www.nngroup.com/articles/signal-noise-ratio/
- **Visual hierarchy via size/weight/color — de-emphasize the secondary to make the primary powerful** (high relevance) — https://www.refactoringui.com/
- **Maximize data density within reason (Tufte) — high data-ink ratio, small multiples for comparison** (high relevance) — https://www.edwardtufte.com/tufte/books_vdqi
- **Hick's Law — choices cost decision time; reduce options at the entry point** (med relevance) — https://lawsofux.com/hicks-law/
- **Aesthetic-usability effect — but expert daily-use tools are less forgiving of form over function** (high relevance) — https://www.nngroup.com/articles/aesthetic-usability-effect/
- **Design GM content to be runnable at-a-glance — separate prep-time depth from play-time reference** (high relevance) — https://www.dndbeyond.com/posts/1890-preview-the-new-stat-block-design-in-the-2024
- **Content is the hero — chrome recedes so the substance leads (restraint in service of content)** (high relevance) — https://givegoodux.com/signal-vs-noise-cleaning-up-visual-clutter-in-ui-design/

### Navigation & information architecture for SettlementForge (multi-surface TTRPG settlement simulator: Create / Library / Realm / Compendium / Gallery + Pricing / Account / Admin)

- **Jakob's Law — match the conventions GMs already know (top nav, familiar mental models)** (high relevance) — https://lawsofux.com/jakobs-law/
- **Hick's Law — keep top-level choices few and prioritized** (high relevance) — https://lawsofux.com/hicks-law/
- **Miller's Law — global nav and any single menu should sit within 7±2** (med relevance) — https://lawsofux.com/millers-law/
- **Indicate the current location — the single most common nav mistake** (high relevance) — https://www.nngroup.com/articles/navigation-you-are-here/
- **Tabs done right — one row, parallel content, never make users scroll the tab strip** (high relevance) — https://www.nngroup.com/articles/tabs-used-right/
- **Local navigation as orientation + wayfinding, visually subordinate to global nav** (high relevance) — https://www.nngroup.com/articles/local-navigation/
- **Breadcrumbs for deep hierarchies; for flat 1–2 level sites, just signal the section** (med relevance) — https://www.nngroup.com/articles/breadcrumbs/
- **Search AND browse — synergy, not either/or; facets turn search into navigation** (high relevance) — https://www.nngroup.com/articles/search-not-enough/
- **Flat-and-wide beats deep-and-narrow — minimize clicks to reach gameable content** (high relevance) — https://www.nngroup.com/articles/flat-vs-deep-hierarchy/
- **Visual hierarchy via size/weight/color — primary vs secondary nav, de-emphasize utility actions** (high relevance) — https://www.refactoringui.com/
- **Cross-linking interdependent entities — make the causal system navigable** (high relevance) — https://kanka.io/
- **Clear, plain, scannable labels with strong information scent** (high relevance) — https://www.nngroup.com/articles/menu-design/
- **Don't lose legacy links — redirect, never 404, when IA changes** (med relevance) — https://www.nngroup.com/articles/breadcrumbs/

### Audience-specific UX for TTRPG / GM tools and creative worldbuilding software (donjon, Kassoon, Watabou, World Anvil, LegendKeeper, Inkarnate, Foundry VTT, Notion-for-worldbuilding) — how to present complex generated/structured content to expert, time-pressured GMs and worldbuilders so simulated depth feels legible, trustworthy, runnable, and powerful without being intimidating.

- **Prep-speed is the product: optimize ruthlessly for time-to-value (the 20-minute / one-page session prep)** (high relevance) — https://slyflourish.com/eight_steps_2023.html
- **Generate actionable hooks grounded in motive/relationship, not paragraphs of flavor prose** (high relevance) — https://slyflourish.com/eight_steps_2023.html
- **Front-load and structure for scanning — design for the 'layer-cake', not the F-pattern** (high relevance) — https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- **Progressive disclosure: show the runnable few first, defer simulation depth to an obvious second level** (high relevance) — https://www.nngroup.com/articles/progressive-disclosure/
- **Avoid feature-bloat overwhelm: the World Anvil cautionary tale vs the LegendKeeper focus** (high relevance) — https://www.legendkeeper.com/world-anvil-alternative
- **Trustworthy generation = coherence + believability, with controlled imperfection — not algorithmic-looking output** (high relevance) — https://www.cottageofeverything.com/blog/realism-believability-and-fantasy
- **Make the 'why' visible: transparency and explainability build trust in generated systems** (high relevance) — https://arxiv.org/pdf/2412.20071
- **Let editing and re-roll be granular and lossless — lock what works, regenerate the rest** (high relevance) — https://watabou.github.io/dungeon.html
- **Design explicitly for at-the-table use: glanceable, no page-flipping, everything-to-run-it in one place** (high relevance) — https://theangrygm.com/fixing-crappy-character-sheets/
- **Treat print / PDF / export as a first-class GM workflow, not an afterthought** (high relevance) — https://rosipov.com/blog/one-page-ttrpg-prep/
- **Defer signup and start from a populated example, never a blank slate** (high relevance) — https://www.useronboard.com/onboarding-ux-patterns/empty-states/
- **Embrace high density for experts — but earn it with hierarchy, scan-anchors, and consistent rhythm** (high relevance) — https://www.nngroup.com/articles/complex-application-design/
- **Structured data (factions, resources, NPCs) belongs in scannable, comparable tables — not prose** (med relevance) — https://www.nngroup.com/articles/data-tables/
- **Support nonlinear, interruptible workflows and the GM's train of thought** (med relevance) — https://www.nngroup.com/articles/complex-application-design/

### Emotional/brand design, microcopy, and trust for SettlementForge: voice & tone, delight without noise, restraint as maturity, credible anti-AI/"simulated not generated" positioning, mature parchment aesthetic, error/empty/loading copy, and building trust in a procedural simulation through transparency ("view the logic")

- **Trustworthiness drives desirability far more than friendliness (the dominant tone lever for a paid creative tool)** (high relevance) — https://www.nngroup.com/articles/tone-voice-users/
- **Calibrated trust through layered transparency: a coarse summary first, the full reasoning on demand (progressive disclosure for 'view the logic')** (high relevance) — https://dl.acm.org/doi/10.1145/3374218
- **Determinism and reproducibility are the credible substance behind 'simulated, not generated' for an expert audience** (high relevance) — https://workers.io/blog/deterministic-simulation-testing/
- **Anti-AI positioning is credible only as structural transparency, never as a slogan or a swipe at competitors** (high relevance) — https://www.thestateofbrand.com/news/anti-ai-brand-market-positioning
- **Restraint signals maturity and confidence; delight must be subtle, earned, and never noisy** (high relevance) — https://refactoringui.com/
- **Mature fantasy/parchment aesthetic = tone + restraint, with texture as seasoning and one disciplined accent** (high relevance) — https://www.kittl.com/blogs/future-medieval-design-stl/
- **Empty states must communicate status, teach, and offer a path — and stay in character** (med relevance) — https://www.nngroup.com/articles/empty-state-interface-design/
- **Error copy: plain, specific, never blaming, always constructive — and in trust-surface register** (med relevance) — https://www.nngroup.com/articles/error-message-guidelines/
- **Tone is one identity, tuned per surface; consistency across surfaces is itself a trust signal** (med relevance) — https://www.nngroup.com/articles/tone-of-voice-dimensions/
- **Pure simulation earns expert respect: Dwarf Fortress is the audience's reference point for 'emergent, not generated'** (high relevance) — https://en.wikipedia.org/wiki/Dwarf_Fortress
- **Reduce friction by doing the math for the user and making pricing transparent** (med relevance) — https://goodui.org/
- **Aesthetic-Usability Effect and Peak-End Rule: invest in the coherent surface and the two moments users remember** (med relevance) — https://lawsofux.com/aesthetic-usability-effect/

### Accessibility & legibility as design quality (WCAG 2.2 AA contrast, type sizing/measure/line-height, focus states, motion/reduced-motion, target sizes, text over imagery, color-not-the-only-signal) — weighted for an expert TTRPG GM/worldbuilder audience reading dense, long-form simulated dossiers on a painted-parchment surface

- **Body text contrast must clear 4.5:1; large/bold text 3:1 — and parchment makes this harder, not easier** (high relevance) — https://www.w3.org/TR/WCAG22/
- **Non-text contrast: borders, icons, focus rings, and meaningful graphics need 3:1** (high relevance) — https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- **Focus must be visible AND meet Focus Appearance (2.4.13): >=2px-equivalent area, 3:1 state-change contrast** (high relevance) — https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- **Target size 24x24 is the WCAG floor; 44-48px is the usability target (Fitts's Law)** (med relevance) — https://lawsofux.com/fittss-law/
- **Text over the painted background needs a guaranteed surface or scrim — test the worst-case image region** (high relevance) — https://www.nngroup.com/articles/text-over-images/
- **Reading measure 45-75 characters (target ~66); long lines tire, short lines stutter** (high relevance) — https://baymard.com/blog/line-length-readability
- **Line-height >=1.5 and the full Text Spacing override (SC 1.4.12) must not break the layout** (high relevance) — https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- **Color must never be the only signal (SC 1.4.1) — pair it with icon, shape, weight, or label** (high relevance) — https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html
- **prefers-reduced-motion: cut large/parallax/looping motion; keep sub-200ms opacity fades and focus transitions** (med relevance) — https://web.dev/articles/prefers-reduced-motion
- **De-emphasize with weight and hue-shift, not washed-out gray — hierarchy and contrast can coexist** (high relevance) — https://www.refactoringui.com/
- **Dyslexia/sustained-reading guide: left-align (never justify), avoid block-caps and italic for runs of text, prefer bold** (high relevance) — https://cdn.bdadyslexia.org.uk/uploads/documents/Advice/style-guide/BDA-Style-Guide-2023.pdf
- **Accessibility improvements double as general legibility and elegance wins** (high relevance) — https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/

### Design systems & internal consistency: design tokens, component reuse, one canonical affordance per action (Jakob internal consistency), consistent spacing/radius/elevation scales, variant discipline, and how a coherent system reduces cognitive load and signals craft

- **Consistency & Standards (Nielsen Heuristic #4) — internal AND external** (high relevance) — https://www.nngroup.com/articles/ten-usability-heuristics/
- **Jakob's Law — users prefer your product to work like everything else they know** (high relevance) — https://lawsofux.com/jakobs-law/
- **Three-tier token architecture: primitive → semantic (alias) → component** (med relevance) — https://m3.material.io/foundations/design-tokens
- **Semantic naming over value naming — name the intent, not the pixel** (med relevance) — https://www.door3.com/blog/naming-design-tokens-guide
- **Systematize everything; design is constraints, not talent (Refactoring UI)** (high relevance) — https://www.refactoringui.com/
- **Limited spacing scale (8-pt grid) creates rhythm, reduces decisions, signals trust** (high relevance) — https://www.designsystems.com/space-grids-and-layouts/
- **Variant discipline — bound variants; separate visual weight from semantic intent** (med relevance) — https://dev.to/ku5ic/why-i-separated-variant-from-intent-in-my-component-api-56k0
- **One canonical component per pattern; govern against component/variant sprawl** (med relevance) — https://www.pathtoproject.com/blog/20240611-how-to-govern-component-sprawl-before-it-breaks-your-design-system
- **Consistency reduces cognitive load and behavioral consistency builds trust** (high relevance) — https://darosoft.com/blog/consistent-ui-patterns/
- **Aesthetic-usability effect — coherent polish is perceived as more usable and earns goodwill** (high relevance) — https://www.nngroup.com/articles/aesthetic-usability-effect/
- **Hick's Law — fewer, well-curated choices speed expert decisions** (high relevance) — https://lawsofux.com/hicks-law/
- **Reuse genre conventions: the scannable stat block as a recognized pattern** (high relevance) — https://valloric.github.io/statblock5e/

