# THE REMAINING ARCHITECTURE — the exhaustive execution plan to launch
> Written 2026-07-18 by the managing Fable session at the owner's order: "architect
> what must be done out exhaustively" so the program completes even if Fable quota
> runs out. A SUCCESSOR STARTS HERE. Every unit below carries: objective, inputs,
> steps, gates, done-when, hazards. Owner-gated items are marked ⛔OWNER.
> Companion docs: DESIGN_DEEP_CRAFT_PAGES.md (per-page compositions) ·
> W_ORGANIC_CRAFT_WAVE.md (laws) · COMPREHENSIVE_REVIEW_PROGRAM.md (the ledger of
> record) · marketing/assets/references/MANIFEST.md (art direction) ·
> MASTER_MERGE_PLAN.md · SOAK_PLAN_R2.md.

## §0 SUCCESSOR PROTOCOL (read before any action)
1. VERIFY STATE, trust nothing remembered: `git worktree list`; the ledger branch
   `review-fixes-2026-07-08` lives in the MAIN tree; code truth = `claude/the-composite`
   @ 78a04afc; the deep wave builds on `claude/deep-craft` (tip 78431763 at writing) in
   worktree `.claude/worktrees/agent-a39bc277a620ae767`.
2. THE WRONG-LINEAGE TRAP (12+ recurrences): cwd silently resets between Bash calls.
   EVERY state-mutating compound begins `cd <abs-worktree> && [ "$(git branch --show-current)" = "<branch>" ] || exit 1`.
   Python edits assert anchors before replace.
3. GATES ARE READ BARE: never through a pipe; `npm run build` BEFORE `verify:dist`;
   the full suite belongs to the MANAGER at folds only.
4. LANES DIE OF CONTEXT: order commit-at-every-lettered-boundary; a dying lane stops
   at a verified commit with an interim report (the 0a/0b precedents). Re-dispatch a
   FRESH agent into the SAME worktree (a new worktree cannot check out a held branch).
5. NUL SCAN before every fold (python byte-count; grep lies). No `git stash`, ever.
   No `git add -A`. The browser preview tool serves the MAIN tree — serve worktrees
   with unsandboxed vite + curl-probe a branch-only file first.
6. Expected suite reds on the composite lineage: EXACTLY the four parked golden
   families (generatorGoldenMaster · beliefMapGolden · worldpulseDeityGolden · pdf
   goldenViewModel). Anything else red is a regression — triage by name vs base.
7. Eager first-paint closure: 1,038,588 B of 1,040,000 at writing (headroom 1,412 B).
   Treat eager bytes as frozen; everything new lazy-loads. Reclaim-first; ⛔OWNER to raise.

## §1 STATE AT WRITING
- Deep wave landed: 0a ratchets (c335c355) · 0b material · 0c motion · 0d hero specs ·
  0e plates · 1a gauge · 1b arrival · 1c clerk's notes (tip 78431763). Ratchets:
  radii 1090 · shadows 117 · rgba 273 · callouts 248 — ALL MUST REACH 0 by phase D.
- Owner walk of cluster 1 OPEN (vite from the deep-craft worktree, port 5199).
- Microsite (reference implementation of the Survey): marketing/website, port 5301.
- THE PUSH: partial (ledger branch confirmed remote); resume per §3. ⛔OWNER ordered,
  standing (Ruling #7) — resume without re-asking, verify per-branch.
- ROUND 3: HELD at the owner gate until the deep wave folds + finished-site walk.
- External chip session running: task_7e1e1e51 (ConfigurationPanel stale population
  literals) — do not duplicate; rebase-check its result before touching that file.

## §1b THE BASE RULING (owner, 2026-07-18 — read before any §2 slice)
origin/master @ d024286e (the deployed GitHub site) is THE UI BASE OF RECORD: page
organization, button placement, layout discipline. Master is a STRICT ANCESTOR of the
composite (887 commits behind, same lineage) — restoration is per-page structural
diffing, never merging. EVERY §2 slice now runs three steps in order: (1) SET THE BASE —
restore master's page organization where the composite regressed it (per THE BASE
RECONCILIATION MAP, docs/THE_BASE_RECONCILIATION_MAP.md — COMMITTED 2026-07-18; three
regressed surfaces confirmed: S1 dossier header-reroll/world-order/overview-affordances/
PostGenCoach, S2 library NextActionRail two-column, S3 create single
LayeredConfigurationPanel vs stepped wizard; S4 nav ALREADY ALIGNED; FORENSICS
CONFIRMED the owner's alternative-tree diagnosis with ONE culprit for the whole class:
merge commit 0168e287 "MASTER MERGE W1" (2026-07-15) resolved ~147 contested UI files
to the program/"ours" side, discarding master's parallel P7–P12 organization; the 886
commits after it never restored them. Restoration recipe per slice:
`git diff 0168e287^2 0168e287 -- <path>` shows exactly what the merge discarded;
master's version lives intact at `d024286e:<path>`. The ~138 collateral files beyond
the nine surveyed surfaces (pricing, library toolbar, settlements cards, how-to,
primitives, copy, theme) get the same master-first walk by their owning slices before
craft treatment); (2) PLUG IN
the post-master functionality (guide · AI panels · map stack · exports · entitlements ·
seal · analytics) into that organization; (3) CRAFT TREATMENT on top — heavier
treatment WELCOME (owner: "I'm okay with heavier treatment but the base has to be set
properly"). The functionality-retention law covers BOTH inventories: nothing master's
organization had, and nothing the composite added, may be lost. Anon gauge shows
hamlet→town only; create pre-generation consolidates to one commissioning plate.

## §2 THE DEEP CRAFT WAVE — REMAINING SLICES
Standing laws for every slice: FUNCTIONALITY RETENTION (structure moves, behavior
never; touched-surface behavioral tests stay green UNTOUCHED — a rewritten pin is a
violation; census DEFERRED-with-reason is the only legal drop) · INSTRUMENT PRINCIPLE ·
DEPTH STANDARD (JUDGMENTs + rejected alternatives in every report) · guidance
checkpoints (whisper registry untouched; title census ≤485 monotone; Handbook +
WorldMapToolbar deferrals re-flagged) · copy law (registry strings; zero hand-typed
numbers; tier names from config) · art direction per MANIFEST TAKE/NEVER-TAKE ·
motion only via the twelve `.oc-m-*` behaviors · kill-list ceilings lowered in the
same commit as each win. Focused gates per commit: own tests + kill-list + eslint
touched + tsc full + domain:strict + build + verify:dist (in that order).

### Slice C1-fin — finish the commissioning desk
- BASE-MAP RE-CUT (2026-07-18): SET THE BASE first from master's versions —
  `d024286e:src/components/generate/WizardEmptyState.jsx` (quiet non-large
  ModeSelector, LANDING_MAX frame), `d024286e:src/components/HomeHero.jsx` (GA-inlined
  heroV2, primitive SizeButton, three sizes), and master's single
  `LayeredConfigurationPanel` config stage in `GenerateWizard.jsx` (drop
  StepIndicator/WizardCommitBand/per-step Institutions-Services-Trade panels; the
  orphaned `LayeredConfigurationPanel.jsx` still exists in the composite tree — revive
  it). Keep `InstantWorldEntry` as a subordinate premium card. RE-AUDIT the landed
  1a/1b/1c work against this base (the gauge lives in master's compact hero card, not
  a new composition). Master's three-button hero already satisfies the anon veto.
- ⛔OWNER VETO LANDED on judgment #3: the anonymous gauge shows HAMLET→TOWN ONLY —
  remove capped-tier stations from anon render (signed-in keeps all six).
- CREATE CONSOLIDATION (owner ruling): pre-generation = ONE commissioning plate
  (headline + gauge + one gold Forge + one honesty line); Advanced ENTIRELY behind
  the unfolding leaf; visible clerk's notes ≤1 (the rest live inside the leaf);
  demo artifacts below the fold as exhibits — fewer visible pieces before the choice.
- Advanced second leaf: the existing Advanced controls re-composed as labeled scale
  rules (terrain/age/wealth/trouble) inside an unfolding second leaf (`.oc-m-unfold`);
  SAME control components re-vehicled — zero handler changes; the leaf is layout only.
- Demo miniatures: HomeHero demo panels become true miniatures (half-scale dossier
  plate + almanac strip) — presentational wrappers around the existing demo data.
- Wizard tint trio: WizardCommitBand dangerBg, WizardLoadedBanners, WizardChipRow →
  ClerkNote/plate idiom (1c's primitive). Lower the callout ceiling per conversion.
- Evolution backdrops (OWN MEASURED SUB-SLICE): the six stage stills as gauge stage
  backdrops — lazy `<img loading=lazy>`/CSS behind the strip, prefetch on hover,
  ZERO eager bytes, measure network on the funnel's hottest surface before/after;
  abandon (record) if p75 LCP worsens.
- Pre-check: reread tests/design/contrast.test.js pins before touching chip colors.

### Slice C2L — THE LOADING JOURNEYS (owner-commissioned 2026-07-18)
Two loading backgrounds, both PROGRESS-SCRUBBED (never wall-clock-timed):
(1) GENERATION LOADING: the journey film's desk→<target-tier> segment as the
loading page's background, playhead driven by the ACTUAL pipeline-step progress
signal (the microsite conductor idiom with generation progress replacing scroll) —
the film lands on the chosen tier exactly as the dossier arrives; chapter mapping =
the film's existing 6 legs; final frozen frame = the ordered tier. (2) REALM/FMG
LOADING: the scroll-unfurl map film (video-refs library) plays while the FMG iframe
boots. BOTH inherit the Welcome film's six engineering laws verbatim (streamed
media zero-JS, fetch-at-click racing generation, stills floor, chapter/segment
files, desktop fine-pointer only w/ stills fallback, taste-gate toggle). Masters:
~/Desktop/settlementforge-marketing-masters/. ⚠ taste call at the walk: the
8-second thorp segment's playback rate. Integrates with PipelineReveal (its
THEATER-ONCE disposition stands — the film is the theater's backdrop).
⬛ OWNER AMENDMENT (same day, THE PERFORMANCE FALLBACK): generation is actually
<50ms — the wait is DELIBERATE THEATER. So the conductor has TWO MODES:
(1) THEATER MODE (default): the film plays the scripted per-tier cadence (the
owner's psychological pacing — the step timings are the driver, not real work).
(2) REALITY MODE (fallback): if real completion has NOT arrived when the theater
script would end (perf regression, slow device, network — the realm/FMG boot is
network-bound and thus reality-native), the conductor switches to ACTUAL-progress
scrubbing: the film slows/holds at the last chapter boundary short of arrival and
plays its final leg only on true completion. THE UNIFYING LAW: the film may NEVER
finish before the real artifact exists — arrival is the only thing that ends it.

### Slice C2 — THE WELCOME: the Survey of One Settlement (THE FILM RULING)
⬛ OWNER RULING 2026-07-18 ("i want the microsite animation for my welcome page…
after each settlement tier it shows the different sections of the current welcome
page before moving to the next"): the app Welcome GETS THE REAL SCRUBBED FILM —
the microsite's travel-and-stop mechanic, verbatim in feel. This REVERSES the
manager's stills-only ruling (recorded; the eager budget guards the JS closure —
streamed media never touches it; the true cost is network weight, engineered below).
- Reference implementation: marketing/website/src/main.js (the conductor: leg/stop
  ranges, still-as-floor, freeze-at-stop, edge fades). TRANSLATE to React.
- Structure: hero over still-0 (desk) → 6 travel legs where scroll SCRUBS the
  growth film between tiers → 6 stops where the film freezes and the EXISTING
  Welcome sections present re-vehicled UNCHANGED (retention law): Forge@thorp ·
  Brief@hamlet(demo dossier lf-033) · Voice@village · LivingWorld@town (+ "you
  have just watched this town grow") · Artifacts/maps@city ·
  rate-strip+door@metropolis. Funnel analytics preserved by name (grep first,
  list in the report); enrich existing events only — zero new eager names.
- ENGINEERING LAWS (each is a done-when):
  1. STILLS ARE THE FLOOR, ALWAYS: the desk still + six evolution plates render
     the complete journey with the film entirely absent (z0 under video, exactly
     the microsite architecture). The page must be fully readable and every CTA
     functional before one video byte arrives — prove it with a network-blocked
     walk. The film is a progressive enhancement, never a dependency.
  2. ZERO EAGER JS: the conductor rides the lazy Welcome chunk; eager closure
     delta = 0 B (the ratchet enforces it).
  3. CHAPTER-SPLIT MEDIA, NEVER MONOLITHIC: re-encode the master
     (marketing/assets/videos/settlementforge-journey-scrub.mp4) into SIX
     per-leg ALL-KEYFRAME files (`-g 1 -keyint_min 1 -sc_threshold 0`), 720p,
     CRF tuned to ≤ ~8 MB/leg. Leg 1 fetches on idle after first paint; leg N+1
     prefetches when the viewer crosses stop N. LCP is untouched (hero paints
     over the optimized still-0 image).
  4. DESKTOP FINE-POINTER ONLY: touch/mobile and prefers-reduced-motion get the
     stills journey (legs compress to 70vh, instant stop states) — already the
     guaranteed floor, so one code path serves both.
  5. TASTE-GATE: film presence behind a config toggle so the owner can compare
     film-on vs stills-only at the walk without a rebuild.
  6. Assets live under public/ as media (not JS); the ~460 MB marketing masters
     question (§3 ⛔OWNER) is unchanged — only the optimized leg derivatives ship.
- DONE-WHEN: all existing section tests green untouched; scroll walk at 3
  postures + the network-blocked stills walk; eager JS delta 0 B; per-leg file
  sizes recorded in the report.

### Slice C3 — THE LIBRARY: the ledger
⬛ OWNER RULING 2026-07-18 (THE LIVING BACKDROP, lands with the settlement-view
restoration this slice shares with C4): the settlement view's background = that
settlement's LAST-VIEWED map — persist the tuple {view: plan|panorama, lens/skin}
DEVICE-LOCAL (localStorage per settlement; the mapEdits blob is an owner-gated
persistence surface and must not churn on mere viewing — vetoable JUDGMENT),
re-render deterministically as a low-opacity ink wash under the dossier plates +
right rail (no blur; extend the contrast pins over it; lazy, zero eager bytes).
Never-viewed ⇒ default plan lens. Auto-upgrades to the illustrated/seasonal
portrait at THE ILLUSTRATED TOWN fold. Map edit gating stays CARTOGRAPHER per the
entitlement ladder (owner re-ratified same day).
- Recipe from the phase-2 sample + MANIFEST 05. Real table; per-row seeded medallion
  (16px, from the ornament composer, memoized); memo-line italics from live state
  (reuse the situation/stressor summary selectors — read-only); CANON rubric small
  caps; phase-glyph standing; select-mode checkboxes as margin tallies (same
  handlers). PROTECTED BEHAVIOR (grep + list before editing): search, sort, filters,
  bulk select, quota banner, open/delete/export flows, empty-state SurveyorNote.
- DEFERRED-legal only with reason rows. Lower radii/shadow ceilings per conversion.

### Slice C4 — THE DOSSIER: preserve-and-polish the RULED MODEL (owner, 2026-07-18)
- THE MODEL IS THE CURRENT LAYOUT per the owner's four screenshots (ledger row of the
  same date): identity band · crisis banner+hook · Systems Health status cards over
  labeled meters · collapsible Origin/Geography/Layout · institutions chip-row · the
  Draft→Saved→Canon→Realm→Shared stepper · header actions · right-rail
  Narrate/Export/Edit · anon save+buy footer · dark prose bands (data on parchment,
  world-voice on umber). DO NOT RESTRUCTURE. Craft applies as MATERIALS+TYPE only:
  plates/hairline rules where cards sit, house serif+small-caps, oxblood criticals,
  medallion in the identity band, colophon foot. Manuscript grammar (drop caps,
  marginalia) ONLY on prose surfaces (Overview narrative, DM Summary, Plot Hooks).
- ADD the wave functionality this layout predates: provenance-on-hover on every
  number (SM-5 idiom) · map-stack entry points (lenses/panorama/interiors/change
  view/DM pins/fog) · chronicle annals markers · slate AI surfaces + the stamp ·
  entitlement gating per the ruled ladder · config-fed figures (zero hand-typed).
- Panels (each its register, all behavior kept): Chronicle=annals · Trade=factor's
  ledger · Services=posted bill (toggle daggers = same toggles) · Deities=votive
  register · WhatChanged=erratum slip · Config/Preview/StaleNarrative = instrument
  plates. EditableInline, chips, medallion header, colophon foot already live — keep.
- HIGH-RISK: densest pin surface in the app. Census the touched tests FIRST; convert
  panel-by-panel with a commit each.

### Slice C5 — THE REALM: the surveyor's table + H2 THE FIRST ADVANCE
- ADDED (S2r deferral ruling, 2026-07-18): MOUNT InstantWorldEntry in the Realm
  empty state (its natural host — it composes a realm). The component is currently
  UNREACHABLE (create-page card removed by owner walk fix); the retention law
  requires this re-home; same props/handlers, subordinate premium placement.
- Chrome only; the map canvas is already in-fiction. Top surveyor's rail (lens strip,
  advance = the winding key, the page's one gold); layers → clipped field card;
  inspector → field note (cartouche-lite + mini-register); pulse → almanac strip.
- H2 per spec: first-advance-only almanac page-turn + medallion ink-pulse + report
  slip (`.oc-m-*` only; fire-once via existing advance counters — no new persisted state).
- FENCE: townMap/map files carry live pins (SM-5, edge annotations, tour). The realm
  desktop gate title is PINNED — copy stays. WorldMapToolbar teaching-title tranche
  remains a RECORDED deferral. Mobile: Realm stays desktop-gated (§7 law).

### Slices C6–C12 — the document pages and account surfaces
- C6 Pricing: reconcile to the five-band sample bench (structure exists; kill radii/
  shadows/tints; dagger markers; config-fed numbers ONLY).
- C7 Compendium: lexicon recipe on hubs + entries; drawer-label hubs; rubricated
  initials; generated-not-copied provenance line at section feet (exists — keep).
- C8 Gallery: specimen-drawer recipe; plates in hairline frames; hover ink-darken;
  report dialog = clerk's form; moderation panel DEFERRED (owner tooling).
- C9 Founders: the charter (clauses, worked-sum margin, seat tally board struck-
  through from live seat data, signature-line + gold claim, seal foot). Paid-surface
  behavior untouched (⛔OWNER class) — presentation only.
- C10 Auth: register-desk plates; restraint law (plainest pages); errors as rubric
  notes above the form (same error strings/flows; NO toast rewiring).
- C11 Account: registry ledger blocks; danger zone rubric-ruled; typed-confirmation
  delete flow byte-identical.
- C12 Checkout success: the receipt artifact + colophon (purchased-dossier moment).

### Slice C13 — THE SURVEYOR AI: the write-desk (THE SLATE RULING + THE ONE DOOR)
⬛ OWNER RULING 2026-07-18 (THE ONE DOOR): AI access = ONE floating marker on the
LEFT edge of the page only ("Ask the Surveyor" wording = vetoable manager suggestion
over the owner's "AI / ask me anything"). It is THE ONLY AI entry point in the app
besides the dossier Polish/Narrate (owner-named carve-out; proposal-slip
accept/decline stamps are results, not entries). ALL prompts route through it.
CONTEXT-FIRST LAW: the router assumes every request concerns the CURRENT surface —
grounding envelope = (route + active tab + map lens + selected entity) → current
settlement → world → product — and moves outward ONLY when the intent classifier
says the request exceeds the local scope (this is the AI token-efficiency doctrine
in UX form: small local payloads first). Architecture: the S3 intent compiler IS the
router; the existing stage panels (S1 analyst, S4 content, S5/S6 construction, style
overhaul, S7 autonomy) become DESTINATIONS the router opens, never entry points —
FloatingAffordances re-composes to the single left-edge slate tab (marginalia
position; slate per the honesty law; no text until hover). Entitlement: OWNER-RATIFIED 2026-07-18,
second clarification same day ("the floating AI button should only show for the
surveyor premium") — the door and everything behind it are SURVEYOR-gated AND the
marker RENDERS ONLY for Surveyor-tier users: no lock-tease, no placeholder — the
left margin is simply empty for everyone else (this supersedes the manager's
lock-glyph-tease default). AI-tier discovery lives on the Pricing page and the
existing tierFacts surfaces, never as in-app chrome. Polish/Narrate rides its own
credit pricing below the tier, unaffected. Machinery
unchanged — this is front-of-house consolidation; the schema wall, per-stage
kill-switches, and early-access labels all survive verbatim.
- The deferred violet→slate conversion: define slate as a semantic token pair
  (light/dim) in tokens.js; AI-authored/proposal surfaces convert to DRAFT-document
  slips (slate border + "PROPOSED — the engine writes canon" small-cap line via the
  copy registry); accept = the gold STAMP (same accept handlers); decline = file-away.
  Analyst chat = correspondence register (user ink vs analyst slate).
- LAW: AI stays visually DISTINCT (the honesty law) — slate replaces violet, never
  removes the distinction. Grep the violet token's consumers; convert all or none.

### Slice C14 — TABLEVIEW: the lantern table
- The recorded deferral pays: four kind-accents redesigned as lamp tones (ember/gold/
  moss/slate) at field-legible contrast; ADD contrast pins for all four on umber;
  wake-lock behavior untouched. Dim tokens from dim-desk plate (MANIFEST 04).

### Slice C15 — EXPORT: the dispatch desk + H3 THE EXPORT CEREMONY
- ExportSheet → parcel rows (labeled formats, one gold dispatch). H3 per spec at the
  web dossier foot/export moment: seal meets medallion (`.oc-m-impress` +
  `.oc-m-inkpulse`, once — CORRECTED 2026-07-19: this doc's original
  `.oc-m-seal-impress`/`.oc-m-medallion-pulse` names never existed; the closed
  twelve-behavior vocabulary spells them as above; C15-b used the real names). PDF counterseal remains a RECORDED SEAM (react-pdf
  cannot mount ornament SVG strings — the structured-path refactor is its own future
  slice; do NOT half-fix).

### Slice C16 — THE SHELL
- Modals → plates over warm-dim (same Dialog machinery; scrim color/token swap +
  plate chrome); toasts → desk-edge slips (`.oc-m-slip-in`); nav small-cap stations
  w/ drawn-rule active state; chassis defaults: Button/IconButton/Segmented/Card
  render the .oc vocabulary as their base face (visual-only prop-compatible).

### Phase D — VERIFICATION (the wave cannot close without ALL of these)
1. Kill-list at ZERO×4 (ceilings walked down commit-by-commit; final commit pins 0).
2. The census re-walked BY EXCEPTION: every surface not deeply recomposed carries a
   reason row; zero PENDING; the manager review targets the exceptions.
3. Contrast per state on every recomposed surface (extend tests/design/contrast).
4. The seam walk: the named journeys end-to-end at 3 postures + dim.
5. Throttled mid-range perf: manual CPU-throttled TTI/INP pass recorded (the e2e
   harness remains a named deferral if not built).
6. Eager report to the byte; closure ≤ 1,040,000 with the delta enumerated.
7. Full behavioral suite green with pins untouched (manager's fold, below).
8. THE BASE RESTORATION LEDGER (docs/THE_BASE_RESTORATION_LEDGER.md) shows ZERO
   PENDING rows — every file merge 0168e287 decided against master carries a named
   disposition (restored / matches-master / program-side-ruled / superseded /
   deferred-with-reason); the 10 ⛔ADJUDICATE deletions each have an individual
   verdict. Owning slices update their rows in the same commit as the work.

### THE DEEP-WAVE FOLD (manager)
1. NUL-scan the full diff (python). 2. Merge --no-ff into claude/the-composite in its
worktree (hard-gated). 3. Bare gates: build → verify:dist → tsc → strict → lint.
4. FULL suite: expected reds = the four parked goldens + aiGroundingBundle.freshness
(proven pre-existing at 78a04afc, 2026-07-18 forensic — the composite's claimed
"freshness regen" didn't stick); CURE AT THIS FOLD: `npm run build:edge-shared`
regen, declared cause, then freshness leaves the expected set. Triage anything else
by name vs the base. ⚠ FLAKE PROTOCOL (proven twice 2026-07-18): pglite hook-timeout
and 20s test-timeout reds under concurrent-lane machine load are retriaged by
ISOLATION RE-RUN before any diagnosis. 5. Ledger row + memory. 6. ⛔OWNER: the
finished-site walk (serve the merged tree) before ROUND 3 dispatches.

## §3 THE PUSH — completion protocol
`GIT_TERMINAL_PROMPT=0 git ls-remote origin HEAD` (auth probe) → push in small
batches, backgrounded, no short timeouts: [review-fixes, w7-prep, the-composite,
deep-craft] then [organic-craft, w-r2-g2, content-gt-final, the-ladder, interiors,
landforms, doc-wave, sm-5-legibility, spatial-consequence, ai-panels,
generation-time-content]. VERIFY each: `git ls-remote origin <branch>` SHA == local.
⚠️ ~460 MB of reference/video masters now sit in marketing/ on the ledger branch:
BEFORE pushing review-fixes, either `git lfs track "marketing/assets/**"` + migrate,
or move masters out of git (Desktop archive) keeping only optimized derivatives —
⛔OWNER choice; default (recorded): move masters out, commit the removal.

## §4 THE ROUND 3 LOOP — the convergence program (⬛ OWNER RULING 2026-07-19,
verbatim intent: "The round 3 should go after the composite… a complete and
utter resurvey followed by fixes… everything fixed exhaustively and
comprehensively… objectively better and not just maximally safe… absolutely
perfect, A+ grade throughout where possible at this stage. When you are done…
do not simply stop the program and wait for me to push… create a loop cycle of
complete exhaustive review cycle to fixes until there is materially no more
fixes to be made and every dimension that can be made into A+ is made into an
A+ at this stage, rinse and repeat.")
- ⬛⭐ THE FINAL-REVIEW DOCTRINE (owner, 2026-07-19: "the whole point of the
  review cycle is to be the FINAL review! that means we need to have everything
  complete in code before then… no compromises on the best quality and
  objectively best architecture"): THE LOOP REVIEWS A FINISHED CODEBASE — it
  never builds missing features. ENTRY THEREFORE REQUIRES BUILD-COMPLETENESS:
  after the de-eager + caliber lanes fold (batch 3), THE COMPLETION WAVES run
  BEFORE the loop: WAVE A = the zero×4 residual sweep to LITERAL ZERO (the
  burn-down's offender map, parallel lanes by cluster, ceilings set at folds) ·
  WAVE B = the eleven Class-A items built (lastingEffects authoring [taste-
  vetoable prose] · traditions genesis consumption + manual authoring UI · the
  PDF counterseal structured-path refactor · the deterministic-violet re-tones
  · Viability→ adjudication · WhatChangedPanel wire-or-remove · ?cat= deep-link
  · folder thead a11y · journey_stop enrichment · vendorManifest try/finally).
  ⭐ WAVE C (the B re-audit, 2026-07-19 — the manager's own "stage-blocked"
  label was safety-shaped): the §16 traditions seams are BUILDABLE DARK NOW and
  move into the completion waves — festival-week map dress (groundDressOps
  hook) · REFRAME_VOCAB 'tradition' act class (rides reframeEnabled) ·
  culture-vector tradition read · tradition trade-lane bonus · cross-settlement
  pilgrimage — each with dormancy proofs + lit-path harness tests, certification
  deferred to the regen/soak (the only part that truly waits). TRUE Class B
  (nothing code can satisfy): player validation · soak-data tuning · lit
  certification. Class C stays the owner's, BUT two items gate
  build-completeness and are ASKED with recommendations: (1) HowToUse — REC:
  keep the About-pivot structure, restore master's lost Philosophy/UnderTheHood
  content INTO it; (2) Surveyor-tier — REC: premium-as-Surveyor declared FINAL
  launch semantics (the chokepoint stands).
  ⭐ WAVE D — THE PERIMETER (owner-commissioned 2026-07-19: protect the work
  from external-AI mishandling/mutation/bot-waves; users use the owner's
  systems, not outside AI): audit-then-harden — crawler governance (robots.txt
  AI-crawler directives + noai meta + TDM headers) · rate-limit audit + server-
  side limits on every edge/auth endpoint · server-side quota/invariant proofs
  · bot-wave anomaly detection in the existing analytics seam (cadence/velocity
  flags) · the sf-bridge origin audit (pre-stocked) · ToS anti-automation
  clauses (drafted for the legal consult). OWNER-KEY SEAMS built but inert:
  hosting WAF/bot-filter toggles · ⬛ ADAPTIVE CAPTCHA (owner addendum
  2026-07-19): Turnstile MANAGED mode — invisible-first, challenge
  only-when-necessary (native) — wired into sign-in/sign-up/password-reset via
  Supabase Auth captchaToken; DELIBERATELY NOT on the anonymous generation
  funnel (conversion frictionless — JUDGMENT); lazy widget behind the flag,
  zero eager; graceful degradation in the house register; activation checklist
  in the runbook (keys → flag → dashboard toggle → test sign-in).
  ⬛ + CHECKOUT (owner, same day): the widget on purchase-initiation surfaces
  (incl. the anon $2.99 path) + server-side siteverify INSIDE the
  checkout-session edge function before any Stripe session (card-testing
  defense at OUR door; Stripe Radar owns theirs); additive token, paid-surface
  behavior byte-identical, purchase pins censused; inert without keys.
  HONEST LIMITS recorded: crawler directives are voluntary-
  compliance; user-credentialed browser agents are indistinguishable from
  users — the defense is server-side validity + limits + telemetry (automation
  gains nothing, corrupts nothing, gets noticed).
  The de-eagering additionally
  receives a dedicated Fable ADVERSARIAL VERIFICATION pass at fold batch 3
  (persistence substrate, escalation clause). Cycle 1's intake is thereby PURE
  REVIEW.
- ENTRY: THE COMPOSITE ASSEMBLED (the deep-wave fold complete) → the
  de-eagering lane (owner-ordered) → THE LOOP's cycles run to convergence →
  ⬛ THE PUSH IMMEDIATELY AFTER THE LOOP (owner, final clarification
  2026-07-19: "the push happens immediately after the loop… everything before
  that must happen with the utmost highest caliber and quality") — the full §3
  push completion fires the moment convergence is declared, delayed by NOTHING
  at that boundary. The site-walk runs whenever the owner walks (non-blocking;
  feedback = next cycle's intake). MANAGER ASSUMPTION (vetoable): Ruling #7's
  quiet interim branch-backup pushes remain authorized during the loop (pure
  safety, never a deploy) — say "no interim pushes" to hold ALL pushing until
  after convergence.
- THE CYCLE (repeat until convergence): (1) FULL RESURVEY — fan-out across every
  dimension (correctness · cohesion/counterparts · experience/immersion vs THE
  EIGHT CROWNS · substance benchmarks · performance/eager · security/abuse · AI
  cost-efficiency · content/voice · a11y · game-feel) + an A+ GRADE per
  dimension with the gap named; (2) findings ADVERSARIALLY VERIFIED (2-of-3
  refuters) before any fix; (3) FIX WAVES — one commit per cluster, bold-over-
  safe WITHIN the constitution (byte-identity/dormancy/pins/ratchets are what
  boldness is proven WITH), full gate per wave; (4) cycle ledger row + grade
  table. CONVERGENCE: a cycle yielding ZERO verified must-fix findings AND zero
  achievable grade improvements triggers ONE confirming cycle; if that is also
  clean, the loop CLOSES with a completion row. Dimensions whose A+ is
  structurally unreachable at this stage (needs real users / the soak / launch)
  carry their ceiling NAMED, never silently regraded.
- ⬛ THE STANDARD ITSELF IS AMENDABLE UPWARD (owner, 2026-07-19: "if you need to
  ammend the A+ standard so that it is maximally expressed, please do so. This
  is under my no compromises directive"): cycle 1 opens with a STANDARD AUDIT —
  the A+ rubric (A_PLUS_ROADMAP · the depth standard's five columns · THE EIGHT
  CROWNS) is itself reviewed for under-expression and AMENDED UP wherever it is
  softer than the best conceivable expression of that dimension; amendments are
  recorded vetoably in the ledger and become the loop's grading law. The
  standard RATCHETS — amendments may only raise it, never lower it; a dimension
  passing the old rubric but failing the amended one is a FINDING, not
  grandfathered.
- OWNER GATES SURVIVE EVERY CYCLE: no deploy · no db push · no golden regen
  (THE ONE REGEN stays pre-signed and separate) · no budget raises · no
  paid-surface behavior changes beyond frozen designs · taste/parked items stay
  in the owner queue. Limit strikes and the Fable boundary do NOT end the loop —
  the ledger carries cycle state; any successor continues per START_HERE §6b.
- The commission (ledger, 2026-07-08 row): "comprehensively and exhaustively read,
  review, and analyze the entire code and codebase... Claude Opus Ultracode to verify
  findings and implement fixes... choose objectively better with risk every time...
  mature my code to absolute perfection... cohesive, complete, immersive... not just
  in code but in experience." Run it VERBATIM as the survey's charter.
- STAFFING (fan-out; Opus lanes; adversarial verify): survey dimensions — correctness ·
  engine cohesion/counterparts · experience/immersion (vs THE EIGHT CROWNS, owner-
  ratified 2026-07-18, superseding the four: 1 settlement map generators · 2 world map
  generators · 3 settlement substance generators · 4 casual game engines [game-feel:
  pacing, session rhythm, return-pull — NEW named dimension] · 5 prose & hooks
  generators · 6 setting & world builder · 7 world simulator for TTRPGs · 8 AI usages
  for TTRPG creation and framing) · substance benchmarks (the depth standard's five
  columns) · performance/eager · security/abuse · AI cost-efficiency · content/voice ·
  a11y · GAME-FEEL (crown 4's survey lens). Crown-2 RE-SCORED (owner correction +
  in-tree verification, 2026-07-18): the world map IS Azgaar's FMG, vendored fork at
  public/map/ (iframe + sf-bridge.js postMessage RPC; docs/fmg-fork.md runbook) —
  Azgaar-class by construction + the living layer; THE ILLUSTRATED REALM from-scratch
  build is SUPERSEDED by an optional house FMG style preset (vetoable, small). Every
  finding: adversarially verified (2-of-3 refuters) before the fix list.
- PRE-STOCKED ITEMS (must appear in the survey's intake): W6 delta audit ·
  SettlementsPanel:748 guard · S1–S3 token retrofit · doc-claims audit · interior
  entry hook · edit-chrome teaser · decree-provenance gap (applyWorldPulseProposal
  applies without provenance recording) · panel analytics · S3–S6 instruction
  adoption · ladder recorded seams · the 23-literal tokenize-down (raw-color budget
  1450→) · slugify dedup (ladder token fn) · PDF counterseal refactor · annex/survey
  naming reconcile · Wizard/Forge spawn-task overlap check (task_7e1e1e51) ·
  sf-bridge postMessage RPC security/origin audit (public/map/sf-bridge.js, the FMG
  iframe bridge) · public/map gate-coverage verification (the vendored FMG fork sits
  outside eslint/tsc/vitest by design — docs/fmg-fork.md names its only real gates;
  confirm they run) · FMG-fork upgrade currency check (drift vs upstream; runbook
  docs/fmg-fork.md) · ✅ THE LADDER FACTION-KEY BUG — RETIRED 2026-07-19 (pulled
  forward, CONFIRMED empirically + FIXED @ 14e8a2fa on claude/the-ladder): real
  generatePowerStructure records carry .faction only ⇒ pre-fix every faction keyed
  fac.unknown and the ladder produced ZERO ladders on real data (worse than the
  recorded merge hypothesis). Fix = factionName accessor chokepoint (npcLadderState)
  + the read-side mirror factionKeyOf (townMap/ladderRead.js — the coup path would
  have desynced write/read keys); 3 sites fixed, classification consumers verified
  N/A via factionArchetype; real-shape pin 9/9 revert-proven; dormancy byte-identity
  green. The traditions faction.power seam now waits only on the folds. ·
  vendorManifestExactSet.test.js NON-ATOMIC MV of public/map/libs/flatqueue.js
  (proven to strand a deleted file + .bak on mid-run crash; two lanes bitten
  2026-07-19) — add try/finally restoration so a crashed run cannot damage the tree. ·
  WhatChangedPanel has NO live importer (tested at whatChangedPanel.test.jsx, mounted
  nowhere in src/ — found at C4c-d 2026-07-19; erratum-slip materials applied so it is
  register-correct if wired) — adjudicate wire-or-remove. · CENSUS PASSING FLAGS
  (2026-07-19, census §5): SettlementsPanel dropped owner-keyed `cancelled` latch
  (cross-user library-write guard) + reportError seam · WizardNewsPanel dropped
  try/catch (paid button can stick busy) · HomeSampleDossier accent eyebrow fails AA ·
  ~7 map files P-principle styling reversion review · en.js 6 master footer/legal keys
  absent (verify footer) · dailyLifeLogic buildPrompt supersession unverified ·
  realmArcSummary relocation check · Card de-shadow vs cardElevation pin · Segmented
  strip recomposition.
- FIX WAVES: one commit per finding-cluster, full gate at each wave end, ledger rows.
- EXIT: findings ledger complete; fixes folded; full suite green (four parked reds).

## §5 THE SOAK
- ⬛ 2026-07-19 OWNER RULING (SOAK_PLAN_R2 §5 is the authority): THREE LEVELS
  (CERT-30 / CENTURY-100 / CENTURY-300, all PASS criteria at each) + the COMBINATORIAL
  MANDATE (tick-path toggle matrix: L1 factorial where affordable, L2 all-on +
  leave-one-out + only-one-on + all-off, L3 all-on + flagged; display-only exclusions
  only by executed same-seed byte-identity proof) + THE RESEQUENCING: the soak runs on
  a SEPARATE machine cloned from the pushed branches (push precedes soak; a pre-soak
  deploy, if any, ships DARK per the recorded recommendation; certs bind to a SOAK-BASE SHA).
- Plan: docs/SOAK_PLAN_R2.md. CENTURY-300 first (300-settlement century run, local).
- ADDS from this program: certify THE LADDER's cadence band (promotions rare;
  weeks-to-years goal spans; three-body distributions; stigma tax visible), the
  reframe/provenance layers' stability, upswing/discovery/urban-fabric interplay.
- Collect: stasis metrics, war/peace cadence, economy drift, NPC ladder churn,
  memory/perf. ABORT criteria per plan. Findings → tuning intake.

## §6 THE TUNING WINDOW
- Dials from soak findings; the knob registry lands in S7's signal registry
  (additive-only ratchet); re-certs: dormancy goldens stay byte-identical for dark
  flags; tempo governor bands; ladder §8 loop constants. Each tune: same-seed
  behavior-shift honesty row (never silent).

## §7 THE ONE REGEN (PRE-SIGNED — no pause at the regen itself)
1. Merge order into the composite: any un-merged parked branches remaining after the
   deep-wave fold (verify each `--is-ancestor` first; content-gt-final SUPERSEDES the
   older content stack — never merge superseded branches).
2. Light the SEVEN flags in DEFAULT_SIMULATION_RULES: distancePricedNewsEnabled ·
   reframeEnabled · provenanceLedgerEnabled · urbanFabricEnabled · npcGrowthEnabled ·
   spatialConsequenceEnabled · npcLadderEnabled.
3. Regen ALL goldens ONCE (the four parked families + any flag-shifted): each
   family's own regen script (UPDATE_* envs / scripts per family README).
4. Full gate: suite must be 100% green, zero tolerated reds, closure ≤ budget.
5. Ledger the DECLARED SHIFT (the one-time same-seed change, its cause named).

## §8 THE VERY END
- ⬛ 2026-07-19: the deploy may SPLIT per SOAK_PLAN_R2 §5c — batch 1 (owner-chosen,
  pre-soak) ships DARK; batch 2 (post-soak/tuning/ONE-REGEN) lights the flags. The
  carve-outs below gate whichever deploy goes PUBLIC first, regardless of batch.
- PR from the composite to master per MASTER_MERGE_PLAN.md (re-survey the plan doc
  first — the third-lineage religion-arc + migration-chain collision is documented).
- Deploy batch: ~35 pending migrations in numeric order (138–154+), the edge
  functions, the covert-scrub migration 142 rides here. Staging first if available.
- CARVE-OUTS before public: ⛔OWNER LEGAL CONSULT (ToS/privacy + trademark clearance
  for the seal) · SUPPORT EMAIL FLIP (owner intent 2026-07-18: branded
  support@settlementforge.com redirecting to settlementforge@gmail.com; MX probe
  that day = EMPTY, forwarding NOT yet configured — ⛔OWNER configures email
  routing at the registrar/DNS, then: verify MX + one test mail round-trips, THEN
  flip SUPPORT_EMAIL's default in src/copy/support.js to the branded address in
  the same deploy batch; the gmail default stays until the test passes — never
  flip first).
- ⛔OWNER physically: the PR merge button · `supabase db push`.

## §9 THE OWNER DECISION QUEUE (nothing blocks until its named point)
⛔⭐ THE COMPOSITE BUDGET DECISION (2026-07-19, BLOCKS THE PUSH): the assembly
measured the eager closure at 1,040,998 B vs the 1,040,000 ratchet — 998 B over,
CONFIRMED irreducible without owner action (probe forensics: the bytes are honest
traditions-registration in already-eager modules — schema validateTradition +
key mirrors ≈793 B engine-core, slice/vocabulary/registration ≈375 B index; each
lane green alone, the sum breaches; the only reduction lane is the owner-gated
customRegistry de-eagering). OWNER OPTIONS: (a) MANAGER-RECOMMENDED: re-pin the
budget AT the measured 1,040,998 (a zero-slack raise — grandfathers only the
measured honest bytes, every future eager byte still fails; the ratchet's own
text scheduled "the final tightening at the composite gate"); or (b) order the
de-eagering lane (sync→async persisted-path conversion; delays the push). ·
realm-unfurl film (C2L finding 2026-07-19: no master exists; the machine + drop-in
seam ship; produce/choose the film = taste + media production) · ✅ SURVEYOR SEMANTICS RESOLVED (owner 2026-07-19): premium-as-Surveyor is FINAL
launch semantics; the chokepoint stands; comment finalization rides Wave B · losing
journey-legs media set deleted at the walk (bg vs journey) ·
HowToUse direction (census #1: About-pivot vs master's 11-heading how-to — content
verified not relocated) · research-consent opt-in→opt-out posture (census §2) ·
backend-gated restores (profile-name RPCs migration-075 · productPrefs visibility
defaults) · cluster-1 walk (NOW) · finished-site walk (at fold) · six deep-wave JUDGMENTs ·
plate .orig deletions · open-bottom ladder amendment · maker's-name on About ·
audit-spine write path (rec: edge endpoint; can ride ROUND 3) · founder-seat
transfers (no-build stands) · LFS-vs-move for marketing masters · legal consult ·
support email · the microsite's public deployment (unscheduled — ⛔OWNER).

## §10 POST-LAUNCH OWED (named, never silent)
Real-user task validation (instrumentation ready) · localization (registries keep the
door open) · PDF counterseal structured-path refactor · IM Fell display face ·
throttled TTI/INP e2e harness · cross-advance chronicle reader (the provenance
unlock) · Handbook narrative rewrite · WorldMapToolbar teaching tranche ·
customRegistry de-eagering (~41KB, sync→async, ⛔OWNER) · marketing film production
variants (720p, lazy legs).

## §11 HAZARD COMPENDIUM (every trap that has actually fired)
wrong-lineage cwd resets (hard-gate everything) · piped-gate exit masking (bare
exits) · NUL-bearing files (python scan; grep -a lies) · node_modules walk-up in
worktrees (npx from the worktree; never ./node_modules/.bin blindly) · preview tool
serves the main tree · stale-dist (build before verify) · exact-match baselines
(sync deliberately, growth ceilings refuse additions — migrate instead) · context
exhaustion (commit boundaries + interim reports) · vitest diff orientation
("Received" = actual) · CDN download throttling (retry with backoff) · Higgsfield
preset interception (decline with declined_preset_id) · limit strikes (commit early;
resume from transcript + disk, verify empirically) · em-dash mojibake in pasted docs.
