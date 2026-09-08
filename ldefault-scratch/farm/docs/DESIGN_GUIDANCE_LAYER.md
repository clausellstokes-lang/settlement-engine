# DESIGN — THE GUIDANCE LAYER (the world teaches; the software whispers)
## Fable 5 architecture, 2026-07-15 — owner-commissioned as the final scope item, under THE IMMERSION LAW (owner, verbatim intent: "coherent and cohesive with the UX... seamlessly integrate... provide immersion rather than dissociation"). Grounded by a 3-slice read-only recon: the complete fragment census (~40 fragments + ~340 native title= tooltips), the design-system/voice substrate, the teaching organs + persistence/analytics seams.
### THE CORPUS'S FINAL DOCUMENT. Builds as W-GUIDE-1/2 in the display lane; voice-alignment pass at Surveyor S1.

## 0. THE THESIS + THE LAW

**The world teaches; the software whispers.** The product's deepest systems already carry their
own pedagogy — grayed-verbs-with-reasons, veto prose, receipts, the pressures rail, prices that
explain their dearness. The guidance layer extends that principle to the seams the world cannot
speak from, under THE IMMERSION LAW: every hint renders from the study's own cloth (tokens,
typography, primitives — never generic tooltip chrome), sits at margins and rest-points (never
floating over content, never dimming, never mid-action), speaks in the two-register voice law,
prefers zero-new-chrome delivery through organs that already exist, and passes THE DISSOCIATION
TEST as per-hint acceptance: *could this be screenshotted and mistaken for the world's own
furniture?* Three precedence guards keep the law from curdling (owner-ratified in discussion):
comprehension outranks costume; the rescue lifeline (search/glossary/handbook) stays boring and
findable; commerce never wears the costume (tier/price surfaces speak plain).

## 1. WHAT EXISTS (the census verdict — the consolidation is half-done and half-ghost)

- **Already theme-native and KEPT (re-registered, not rebuilt):** the parchment left-accent
  callout family (HowToUse's Insight/Tip cards, FirstDossierCallouts, WizardNextSteps, the
  wizard step-hint banner), CampaignEmptyState's gold callout recipe, SampleDashboard's
  teach-by-example empty library, WelcomeBackCard, DesktopOnlyGate's calm gates, the
  tier-boundary cluster (all fact-sourced from tierFacts.js — the plain register, correctly).
- **IMMERSION-LAW VIOLATORS (named, each with its disposition in §5):** PostGenCoach (floating
  fixed bottom-right dialog), WorldMapTour (dim-everything spotlight tour), PipelineReveal
  (full-screen dark overlay on EVERY generation, no working Esc), HelpPopover (dark generic
  tooltip chrome, content duplicated inline against a stale comment), StaleNarrativeModal
  (backdrop modal for a non-gating choice), and the ~340 native `title=` OS tooltips — the
  largest uncounted instructional layer, all foreign chrome.
- **THE GHOST STRATUM (deleted by W-GUIDE-1):** `onboardingDiet` flag (zero consumers),
  `data-onboard-highlight` attributes (styled by no CSS), dead copy keys
  (onboarding.firstRun/checklist, narrativeDrift), the stale OnboardingCoach/compendiumHints
  header comments, `hasSeenWorldMapTour` (never read), and **ActionRail (zero consumers —
  DELETED; JUDGMENT: the registry + existing primitives supersede it; its keep-as-seam bet
  found no consumer and the whisper model renders through margin notes, not rails)**.
- **THE DORMANT SUBSTRATE (the design's luck):** onboardingSlice's `sf_features_used` firsts
  map with markFeatureUsed/shouldShowHint — built, persisted, ZERO consumers: the firsts
  ledger already exists and needs only keys + wiring. Disclosure's `onFirstOpen` fire-once
  ref is the trigger primitive in miniature. Card ships a `suggestion` variant literally
  documented "for AI/onboarding hooks." The ✦-glyph + uppercase-eyebrow + serif-prose band
  (DossierNarrativeBanner) is the margin-note visual grammar, already in the wild.

## 2. THE REGISTRY (one inventory, one budget, one walker — the tierFacts pattern generalized)

`src/domain/display/guidanceRegistry.js` — a LAZY LEAF (registryProse idiom: FIRST-PAINT LAW
header, dist sentinel in vendorPdfLazy, ONE importer per lazy chunk — the ~44 B shared-chunk
leak is measured law). Every whisper declared:
`{ id, surface, lane ('tourist'|'keeper'|'sovereign'|'builder'|'reader'), register
  ('note'|'plain'), trigger {first?, condition?}, priority, body (copy key), glossaryRef?,
  budgetClass }`.
- **THE BUDGET:** ONE whisper visible per surface at a time, ever (the pressureSuggestions
  cap-and-dedupe walker is the prototype); a priority queue behind it; per-whisper frequency
  caps via the pricingMoments cooldown idiom; a master quiet switch.
- **THE WALKER** (`tests/domain/guidanceRegistry.walker.test.js`, the operationRegistry/
  tierFacts census shape): (a) every registry id resolves to copy + a mounted surface;
  (b) a SOURCE CENSUS of instructional UI — the callout/coach/tour/hint component inventory —
  must be registered or on the shrink-only legacy ledger (seeded with the census's ~40, burned
  down by the waves); (c) **the title= ratchet**: a census of native title= occurrences with a
  shrink-only baseline (~340 seeded) — new instructional titles fail; existing ones migrate to
  the glossary affordance over waves; (d) register guards per §4.
- **THE CRITERION CLAUSE (standing, playbook-mirrored):** every wave that ships a new
  mechanism ships its registered whisper + glossary entry, or the walker reds — the composer
  criterion's final clause.

## 3. TRIGGERS: FIRSTS, NOT TIME

Extend `sf_features_used` (the dormant map) with the guidance firsts (first_generate,
first_save, first_canon, first_advance, first_pause_major, first_treaty_strain,
first_exposure, first_custom_mint, first_docket, first_forecast...) — loadFeaturesUsed's
spread-over-defaults backfills veterans; where a first is DERIVABLE from existing state
(saves exist ⇒ first_save passed; the saveMoments chokepoint already fires first/third-save
idempotently), derive rather than flag so existing users are never treated as newborns.
Dismissals unify under ONE key convention (`sf:guidance:*`) with one shared helper; the 9+
legacy keys (three naming conventions) read-once-migrate. Device-local is accepted;
cross-device seen-once needs an account-side store = a persistence-shape decision explicitly
DEFERRED to the owner (not taken under the night delegation). Lanes are inferred from surface
+ firsts, never asked; the one optional accelerator ("I've kept campaigns before") compresses
the sovereign lane at first canonize.

## 4. THE VOICE: THE SURVEYOR'S NOTES (+ the plain register)

The in-world register is scripted marginalia — `guidanceNotes.js`, the F3a sidecar shape
exactly: frozen `NOTE_LINES[topic][moment]` cells (≥2 variants), a totality floor, FNV-1a
variant selection on a stable id, precedence categorization — walker-tested with a FRESH
register guard (the crier's DENY_WORDS bans 'you/your'; the notes REQUIRE second person and
instead ban UI-verbs in the note register: click/tap/button/menu — the plain register handles
those). Visual grammar: the Card `suggestion` variant + uppercase micro-eyebrow ("A NOTE FROM
THE SURVEYOR") + serif prose at 1.65 + the signature em-dash "— S." + a text glyph (IconsContext
is off; unicode per the ✦ precedent). Copy lives in en.js `guidance.*` via t() (the existing
totality harness). The plain register (software about software: sync banners, quotas, prices)
keeps the sans house voice and NEVER borrows the persona. At Surveyor S1, the awakened AI
inherits the same eyebrow + signature — the ghost and the voice unify.

## 5. THE VIOLATOR DISPOSITIONS (each vetoable, decided under the delegation)

- **PostGenCoach → RETIRED**; its 3 steps become registered first_generate whispers rendered
  IN-FLOW at the dossier's top (the FirstDossierCallouts grammar — which stays, re-registered).
- **WorldMapTour → RETIRED** (dim+spotlight is the archetypal dissociation); replaced by ≤3
  registered rest-point notes on the map's own margins + the toolbar '?' deep-linking the
  glossary's realm page. `sf_worldmap_tour_done` joins the legacy-key migration.
- **PipelineReveal → THEATER, ONCE (JUDGMENT):** the forging overlay is the product's
  curtain-rise — genuinely immersive ON FIRST GENERATION, an interruption every time after.
  Keep the full theater for first_generate; thereafter a compact in-flow forging band (same
  step narration, no overlay); fix the phantom Esc either way. Say "veto" to keep every-time.
- **HelpPopover → RE-SKINNED + ABSORBED:** parchment margin-popover (the callout grammar, not
  dark tooltip chrome); its inline COMPENDIUM_HINTS move into the registry with glossaryRefs;
  the stale header comment dies.
- **StaleNarrativeModal → INLINE:** the same two-option choice as an accent band at the
  narrative banner (it never gated; a backdrop was never earned).
- **The title= layer:** ratcheted (§2), migrated opportunistically — high-traffic teaching
  titles (LivingWorldGates, WorldMapToolbar) first.

## 6. THE GLOSSARY (interpretation — "how to interpret everything")

The Compendium is the reference spine (its ?tab= + #anchor + type-ahead deep-links already
exist). W-GUIDE-2 adds: (a) GENERATED entries from the registries — event verbs + dials from
the affordance manifest, facets from their vocabularies, instrument legends (pips, bands,
capture rungs, strain, credibility) from their catalogs — via the analytics-dictionary
generate+freshness-test pattern so reference cannot drift from code; (b) the UNIFORM
"what am I reading?" affordance on instruments (a text-glyph touch target opening the
glossary card in-place — the InstitutionCard popover grammar, honesty-gated: never invent);
(c) HowToUse compresses to the themed Keeper's Handbook (narrative chapters) + FAQ, with
Reference delegating to the Compendium. The whatPhrase never-leak-a-slug ladder guards every
engine token the glossary names.

## 7. MEASUREMENT (zero new event names)

Whisper shown/dismissed/acted ride EXISTING events as coarse enum props from lazy call sites
(HELP_POPOVER_OPENED exists; lifecycle events per the spatialUsage enrichment doctrine — id
enums only, never freetext). Effectiveness (acted/shown per whisper) becomes the tuning
metric; the budget defends itself with data. New store actions (markGuidanceSeen etc.)
REGISTER as mechanical ops — the exempt ceiling is full by design.

## 8. WAVES + PINS

- **W-GUIDE-1 (the consolidation):** the registry + walker + budget engine; firsts unification
  + legacy-key migration; the ghost-stratum deletion (incl. ActionRail); the five violator
  dispositions; existing keepers re-registered. Pins: walker census both directions;
  budget (a second whisper cannot render); firsts backfill (a veteran sees no newborn hints);
  the dissociation review checklist committed as the wave's UI-review artifact.
- **W-GUIDE-2 (the voice + reference):** guidanceNotes + register walker; empty-states-as-
  invitations sweep (library/gallery/realm/docket-when-it-lands); the generated glossary +
  instrument affordance + title= migration tranche 1; the Handbook compression.
- **Standing:** the criterion clause (§2); the S1 voice-alignment pass; hint-effectiveness
  review joins the soak-phase tuning docket.
- **Eager-byte law:** target ZERO (everything lazy-leaf + existing-chunk resident; the
  registry sentinel-guarded; measured per wave against 1,214,050).

## 9. WHAT THIS LAYER NEVER DOES
Never blocks, never dims, never floats over the world, never repeats a dismissed whisper,
never speaks the persona on commerce, never invents world facts (the InstitutionCard honesty
gate is the model), never adds an event name, never assumes a new user is ignorant of the
hobby — it teaches THIS product, not tabletop.
