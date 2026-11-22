# THE ROUND-21+ BACKLOG PROGRAM — PLAN

> **Progress** (append after every wave — this blockquote alone must reconstruct program state)
> - 2026-07-16 (round-2 review, docs-knowledge-6): **W2 FEED-RETENTION POSTURE — post-ratchet-#9
>   reality; the "it will fit" instruction in §1 below is OBSOLETE.** W2 is +363 B eager and the
>   live first-paint margin under RATCHET #9 (`CLOSURE_BUDGET_BYTES` in
>   `tests/build/vendorPdfLazy.test.js`, currently 1,121,903) is ~85 B — W2 does **NOT** fit.
>   It is PRESERVED on branch `claude/round21-w2-feed-retention @ 2f4f7b58` (verified NOT an
>   ancestor of the review-fixes tip) and re-applies **only inside its own FP-G reclaim window
>   under the ratchet law — never a bare cherry-pick**. Sequencing is owned by
>   `docs/COMPREHENSIVE_REVIEW_PROGRAM.md`; W2's live status was previously recorded only in
>   Claude memory (round21-backlog-program) — this line is the in-repo record.
> - 2026-07-13 (review program, ledger repair): **M11b CALAMITY LANDED @ 62c81a0c — the M1–M11
>   ladder is COMPLETE**; every "M11b unbuilt/WIP/blocked" line below is historical. Ruins-as-
>   artifacts is UNBLOCKED. ⚠️ HEADROOM CROSS-REF: current margin is 1,099B (post-M11b); W2 (+363B)
>   and W5 (~890B) do NOT both fit until the playbook §0.8-1 M10b eager-trim (~800B) lands — the
>   two docs previously double-allocated the same margin. The comprehensive review program
>   (docs/COMPREHENSIVE_REVIEW_PROGRAM.md) now owns sequencing.
> - Wave 2 (IMPLEMENTED + VALIDATED, ⚠️ BLOCKED on FP-2, pending branch 2f4f7b58) — FEED RETENTION:
>   arc-aware 240-cap that rescues orphaned major-arc HEADS while preserving the recency window.
>   seasonsMiniSoak FIXED, goldens byte-identical, feedDistribution re-baselined, sim suite 47/47.
>   BUT the feed engine wizardNews.js is EAGERLY store-imported → +363B first-paint (1,255,965→
>   1,256,348), OVER the 1,255,985 ratchet. Owner ruled FP-2-first (no raise), so it lands after FP-2
>   reclaims headroom (or an owner-authorized raise). **KEY DISCOVERY: "budget-free" ≠ engine-touching;
>   only LAZY DISPLAY additions + byte-neutral cleanups are truly budget-free — new engine code is eager.**
> - Wave 1 (shipped, 25003430) — VOICE SIDECARS: `src/domain/display/newsVoice.js` (pure display
>   read-model, zero imports) + `WizardNewsPanel` wiring; each war/faith/trade news item gains a
>   deterministic in-world crier line (FNV-1a variant, impactKind-primary categorization, 57 lines).
>   Byte-inert: closure UNCHANGED 1,255,965, three goldens byte-identical, lazy-only. +6 pins (newsVoice
>   11→17 tests). Verify: independent full gate + a 5-lens adversarial review (no must-fix, no scope
>   violation) + a fix-up round. ONE PRE-EXISTING env red: `pipeline.property` seed-sensitivity times
>   out at 20s under machine load ~273 — CONFIRMED identical on untouched base 5ea117ec, not this wave.
> - Program opened 2026-07-13 (Opus 4.8 main loop, owner-directed) from the playbook §7.2 backlog.
>   Owner triage calls (this session): first-wave pick DELEGATED to me → voice sidecars; budget
>   posture = **lazy/budget-free only** (no CLOSURE_BUDGET_BYTES raise this program without a fresh
>   owner ratification); base branch = **claude/round21-backlog** off review-fixes-2026-07-08
>   @ 5ea117ec (the spatial tip is checked out in the owner's main dir, so a child branch here).
> - State at open (verified via git + playbook §0.0): mover ladder at **M10a**; **M10b** (living/
>   autonomous, +86B eager) and **M11** (pestilence + calamity) still UNBUILT; first-paint closure
>   **1,255,965 / ratchet 1,255,985 = 20B eager headroom**; any-cast held at 2252.

## ▶ NEXT STEPS (handoff — START HERE)

State at merge (2026-07-13): **Wave 1 (voice sidecars) SHIPPED + merged to review-fixes-2026-07-08.**
**Wave 2 (feed retention) BUILT + VALIDATED but NOT merged** — it is +363B eager and busts the
first-paint ratchet; preserved on branch `claude/round21-w2-feed-retention @ 2f4f7b58`. Everything below
is dispatch-ready for a successor (or a later session), grouped by what unblocks it.

### 1. ⚠️ THE ONE OWNER DECISION — the budget fork (unblocks the eager third of the backlog)
Feed-retention (and the other eager waves) need first-paint headroom. Two paths:
- **(a) enact an owner-authorized budget raise** (raise `CLOSURE_BUDGET_BYTES` in
  `tests/build/vendorPdfLazy.test.js` — read its current value there, do not trust a number here;
  the W5 precedent): then LAND Wave 2 — cherry-pick `2f4f7b58` onto the review-fixes tip, bump the
  ratchet + its documented-reason comment, run the FULL gate (`npm run check`), confirm verify:dist
  green, commit. Unblocks warding + map-as-legibility too.
- **(b) FP-G reclaim-first (owner's standing ruling):** reclaim first-paint headroom (an FP-G
  microtrim window) FIRST, THEN cherry-pick `2f4f7b58` — see the 2026-07-16 Progress note above:
  under RATCHET #9 the margin is ~85 B and W2 is +363 B, so it does **NOT** fit today. Never a bare
  cherry-pick; re-run the full gate after the reclaim.
- Recommendation: **(b)** — feed-retention only matters at scale (>240-entry feeds), which are the
  long-run campaigns FP-2 targets. No blocker to the budget-free waves either way.

### 2. BUDGET-FREE WAVES (do any time, no budget needed — LAZY DISPLAY or BYTE-NEUTRAL)
- **Numeric prices (Wave 7) — HIGHEST remaining value.** A LAZY display read-model (voice-sidecar /
  M6d pattern, `src/domain/display/`) deriving numeric prices from the M6a/M6d commodity BANDS + stocks,
  rendered on the economics tab. GENERATION IS SACRED — read `economicState` read-only, never mutate.
  Needs a price-derivation design (band→number mapping). Byte-safe (rides a lazy chunk).
- **dramatic_campaign preset review (Wave 4).** Review the preset's depth vs the others
  (`simulationRules.js` / `simulationProfile.js`); surface findings; apply small fixes. Preset content
  edits are EAGER — keep fixes tiny or defer eager ones.
- **Dead wallClockNow pre-stamp collapse (Wave 3, note 2).** Byte-neutral: `propagation.js:292,451`
  pre-stamp `createdAt: wallClockNow()` then `:689` overwrites with pinned `now`. Collapse to
  `createdAt: null` at mint + `:689 → item.createdAt = now || wallClockNow()` (preserves the now-less
  boundary fallback). VERIFIED SAFE: no intermediate `createdAt` read exists (grep-confirmed), goldens
  byte-identical on the pinned path. LOW value; confirm verify:dist doesn't move (20B headroom).

### 3. FP-2-GATED WAVES (new engine code — EAGER, need §1 resolved first)
- **Feed retention (Wave 2)** — built, `2f4f7b58`; see §1.
- **Warding-vs-scrying (Wave 6)** — new engine mechanic on the belief/rumor layer (Wave-A `beliefMap` +
  3.5 `rumorNetwork`); needs a design pass; will cost eager bytes.
- **Map-as-legibility (Wave 10)** — heavy eager UI (fronts/embattlement/trade-flow on the realm map).
  Data is built (M1/M5/M6d/M9); the render is the eager cost.

### 4. OWNER-GATED (GOLDEN REGEN) — batch these together
- **Population-attractor retune (Wave 5)** — retune the M4 attractor constants from a soak; SHIFTS
  same-seed goldens → needs an owner-signed UPDATE_GOLDEN regen. **Piggyback the deferred `bornTick`
  temporal note here** (adding a `bornTick` integer stamp to stressors in `mergeStressorUpsert`
  [applyWorldPulse.js:425] also shifts stressor-shape goldens — do both in one regen). See
  `docs/TEMPORAL_AUDIT.md:98,128`.

### 5. BLOCKED / DESIGN-HEAVY (later)
- **Ruins-as-artifacts** — BLOCKED on M11b calamity (the last mover, UNBUILT). Do M11b first.
- **Peace treaties (Wave 8)** — new war-layer de-escalation (war + M9 factions + M10 approval); design pass.
- **Miracles / lived-practice faith (Wave 9)** — big system; SCOPE-BOUNDARY care (deity = alignment not
  domain; NEVER resolve a named character's fate — "named clergy" needs the aggregate treatment). Design pass.

### 6. RECONCILE before any eager wave / master merge (parallel streams, all off 5ea117ec, UNMERGED)
- `claude/phase55-parking-lot` (FP-2 + M10b CAP=26 + F24) — the headroom-reclaim path.
- `usage-telemetry @ 6a8bfade` — the endgame analytics workstream.
- The **master merge** (the big endgame item) is separate + owner-gated — NOT part of this program.

## Sources
- `docs/PHASE55_EXECUTION_PLAYBOOK.md` — §0.0 state ledger, §7.2 the backlog list, PART 7 M11 spec
  (RUINS couples to M11b), §0.2 constitutional laws, §0.3 manager checklist.
- `docs/PHASE55_SPATIAL_ENGINE_DESIGN.md` — Rounds 21 (→M11, unbuilt) + 22 (→M6/M7, built). NOTE:
  the §7.2 backlog items are mostly UNSPECCED ("round-21+ design" was Fable-reserved) — this program
  authors their specs (bold-architecture, owner-directed), it does not implement pre-made ones.
- Precedent: W2 conjunction sidecar (commit d7cc13df) + `src/domain/display/institutionVocabulary.js`
  — the display-side, lazy, deterministic-prose, byte-inert content pattern this program reuses.

## Method
Gates (deep-work §4 tiers, this repo's concrete commands):
- **fast** = `npx vitest run <the wave's new test files>`
- **quick** = `npm run check:quick` (= lint + test) — inner loop only
- **full** = `npm run check` (= validate:data + validate:migration-head + validate:edge + validate:map
  + typecheck + typecheck:domain:strict + lint + test + build + verify:dist)
- constitutional spot-checks per §0.2/§0.3: three golden masters byte-identical (generator /
  worldpulse / pdf), any-cast === 2252 EXACT, `npm run verify:dist` (dist contracts), the first-paint
  closure-budget test (`tests/build/vendorPdfLazy.test.js`, `CLOSURE_BUDGET_BYTES` — read the live
  const there; it has ratcheted down since this plan was written).

Every wave = an independent increment: architect the spec → dispatch an Opus implementer (fenced,
`model:'opus'`, leaves work UNSTAGED) → run the §0.3 manager checklist + adversarial-verify on
sensitive substrate → one commit naming the wave (explicit staging, shared-tree discipline, run the
post-commit survival check — this repo's husky+lint-staged hook has eaten untracked files before) →
a plan-note commit. **Push/deploy/master-merge are NEVER part of the loop** (owner-executed).

## Owner decisions honored throughout (do not violate)
- **Budget: lazy/budget-free only.** No eager first-paint bytes without a NEW owner ratification.
  Items that need eager bytes (numeric prices, map-as-legibility, M10b) are PARKED, not built.
- **Constitution (§0.2):** same-seed byte-identity (goldens never change silently); dormancy
  (feature absent/off ⇒ byte-identical); first-paint ratchet (verify:dist green under the live
  `CLOSURE_BUDGET_BYTES` const — down-only, never raised without the owner);
  any-cast EXACTLY 2252; pure engine functions (no Date.now/Math.random — seeded forks + FNV only);
  codepoint-sorted mutation.
- **Product scope (owner, binding):** world-only (never party-facing — DM territory); sub-century
  horizon; simplicity over fidelity; NEVER resolve a named character's fate (mortality is
  aggregate-population only). Applies hard to the miracles/named-clergy and ruins items.

## The waves (triaged 2026-07-13; sequenced by value/cost/dependency/budget)

### Wave 1 — VOICE SIDECARS for war/faith/trade news (risk: low) — SHIPPED (25003430)
Item: §7.2 "W2-style voice sidecars for war/faith/trade news" (the playbook's named first win).
Design: a new display read-model `src/domain/display/newsVoice.js` resolves a `wizardNews` entry to an
in-world crier/herald VOICE line — categorized war | faith | trade from `channelType`+`impactKind`,
variant chosen by `fnv1a32(entry.id :: key)` (no rng/Date), a fallback ladder to a per-category floor,
`null` for out-of-scope categories. Rendered in `WizardNewsPanel` `NewsEntry` beneath `entry.summary`.
Byte-safety: NEVER touches `wizardNews.js` entry generation (feed goldens structurally unaffected);
imported only by the lazy news panel → zero eager bytes (CONFIRM via the closure-budget test).
Gate: full. Verify: closure-budget byte-delta 0; goldens byte-identical; determinism (same entry ⇒
same line) + coverage (every war/faith/trade entry shape resolves above the generic floor) +
uniqueness/register guards. Exit: full gate green, closure unchanged, sidecar renders on a live feed.

### Wave 2+ — budget-free legibility/hygiene (risk: low; order per owner priority)
- **Feed retention (240-cap major-arc pinning).** The known open finding: `wizardNews` `sortEntries`
  is recency-primary, so `slice(0, MAX_ENTRIES=240)` flushes old MAJOR arcs. Fix = reserve capacity
  for MAJOR/threaded arcs before the recency cut. Data-model, not UI → budget-free.
- **The two temporal structural notes.** `mergeStressorUpsert` bornTick; the dead `wallClockNow`
  pre-stamps (`wizardNews.nowIso` fallback is one). Correctness/purity cleanup.
- **dramatic_campaign preset depth review.** Review → maybe small fixes.
- **population-attractor retune** (owner-parked; gates on soak data — surface findings, don't silently
  re-tune a shipped constant; owner-decision queue).
- **warding-vs-scrying** info-defense (new mechanic on the built Wave-A belief + 3.5 rumor layers;
  needs a spec; likely lazy).

### PARKED — eager/budget-gated (need owner ratification before building)
- **Numeric prices** (surfaces the economic model's numbers — UI-eager, "generation is sacred").
- **Map-as-legibility surface** (fronts/embattlement/trade-flow on the realm map — highest impact,
  heavy UI, eager). 
- **M10b** (living/autonomous progression + catch-up + preset flags — +86B, already owner-SPLIT).

### BLOCKED / needs-design
- **Ruins-as-artifacts** — couples to M11b calamity (UNBUILT). Sequence after M11b.
- **Miracles / divine-agency + lived-practice faith** (rituals, holy days, named clergy) — big system;
  brushes the scope boundaries (deity=alignment simplicity; never resolve a named character's fate).
  Needs a real design pass.
- **Peace treaties / negotiated terms** — new de-escalation path in the war layer (depends war + M9
  factions + M10 approval queue). Needs design.

## Sequencing rationale
Cheap, lazy, high-value, zero-budget-risk first (voice sidecars — the playbook's nominated first win),
then the rest of the budget-free legibility/hygiene set. Everything eager waits behind the owner's
budget call; everything that couples to the unbuilt ladder tail (ruins→M11b) waits behind it. Big
content/mechanic systems (miracles, peace treaties) get a design pass before an implementer wave.

## Deferred (documented — NOT bugs to re-find)
- **Wave 1 — "convoy" wording kept.** The content-scope review flagged "convoy" (×2) as faintly modern;
  it is period-plausible and kept. Not a defect.
- **Wave 1 — voice line renders on every arc stage, kept.** A multi-stage news arc shows a crier line
  on the head AND on each earlier stage (each stage is a distinct beat with its own voice); the earlier
  stages are collapsed behind `<details>` by default, so it is opt-in detail, not a wall of quotes.
  Considered and kept, not a bug.
- **Wave 1 — VOICE_FLOOR genericness, kept.** The per-category floor is the never-reached fallback (all
  12 cells authored + `bucketFor` total + the empty-array guard); its plainer register is by design and
  never renders. If a floor line is ever promoted into a live cell, rewrite it to cell register first.

## Owner-decision queue (parked, deliberate)
- **Budget path — RULED (parallel session, 2026-07-13): FP-2-first, NO raise.** The owner chose to
  reclaim first-paint headroom via FP-2 (the store-slice split) rather than raise CLOSURE_BUDGET_BYTES.
  So the eager backlog items and M10b unblock behind FP-2's reclaim, NOT a budget bump — see the sibling
  branch `claude/phase55-parking-lot` (4 commits off 5ea117ec, unmerged) and memory
  `parking-lot-adjudication-2026-07-13`. RECONCILE with the parking-lot branch before any eager wave.
- **⚠️ BUDGET FORK (surfaced 2026-07-13, awaiting owner): Wave 2 feed-retention is +363B eager and
  blocked.** Two owner directives are in tension: the FP-2-first ruling (no raise) vs this session's
  "take the risk if objectively better." I decided the ruling-consistent path (defer behind FP-2), but
  a budget raise is OWNER-GATED and cannot be self-enacted. OWNER PICKS: (a) enact the parked +1,000
  raise (1,255,985→~1,256,985, W5 precedent) to land Wave 2 (and unblock other eager waves) NOW, or
  (b) keep FP-2-first — Wave 2 (pending branch 2f4f7b58) + eager waves wait for FP-2's reclaim.
  Recommendation: (b) unless the owner wants to accelerate; feed-retention only matters at scale
  (>240-entry feeds), which are the long-run campaigns FP-2 targets anyway.
- **Which waves are budget-gated (need FP-2/raise) vs budget-free:** budget-FREE (do now) = lazy display
  (numeric-prices read-model, voice sidecars ✓) + byte-neutral cleanups (Wave 3 pre-stamp collapse) +
  constant retunes (Wave 5 population, though that shifts goldens → owner regen) + reviews (Wave 4).
  Budget-GATED (need FP-2) = feed-retention (Wave 2), warding-vs-scrying (new engine mechanic),
  map-as-legibility (eager UI). Ruins-as-artifacts stays blocked on M11b.
- **Ladder tail vs backlog** — M11 (last mover) and M10b remain unbuilt; owner directed the backlog
  first. RUINS needs M11b. Flag if the owner wants M11 slotted in. (M10b is now owned by the parking-lot
  stream: CAP=26, FP-2-gated.)
- **population-attractor retune** — a shipped, owner-delegated M4 constant; re-tuning changes same-seed
  outputs → surface soak findings + recommendation, owner ratifies before any golden shift.

## Judgment calls (each vetoable)
> Wave 1 decisions (delegated 2026-07-13; each vetoable):
> - Categorization is **impactKind-primary**: an entry's impactKind classifies it (faith/war/trade)
>   first, and channelType is only a fallback when impactKind is uninformative. Chosen over the initial
>   per-category OR (which let a war *channel* outrank a trade *impact*) because the voice should follow
>   what the news IS, not the channel it rode. Byte-inert on real entries (impactKind alone classifies
>   every current entry); it only differs on the war-channel + trade-impact cross case. Veto reverts the
>   newsVoiceCategory ordering in newsVoice.js.

> Program open (delegated 2026-07-13; each vetoable; all favor the owner's stated values):
> - Chose **voice sidecars** as Wave 1 (owner delegated the pick). Cheapest high-value item, lazy,
>   the playbook's named first win. Veto → pick another Wave-1 item; nothing is committed yet.
> - Chose to **author the round-21 specs myself** (the playbook reserved "round-21+ design" for Fable;
>   the owner is unavailable and directed the build). Bold-architecture within the constitution. Veto
>   reverts to a spec-only deliverable awaiting Fable.
> - Based the program on a **child branch** off review-fixes rather than committing in the owner's main
>   dir. Veto → rebase the branch's commits onto the chosen base (clean, no history rewrite of shared
>   branches).
