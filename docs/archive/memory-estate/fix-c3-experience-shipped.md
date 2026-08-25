---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-21
  kind: lane-completion
  branch: claude/c3-experience
  worktree: .claude/worktrees/vision-i
  base: 430f8042
  status: "committed, NOT folded/pushed"
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T06:30:27.345Z
---

# FIX CLUSTER C3 — EXPERIENCE/UX shipped (13 dimension-bar findings, eager-neutral)

One gated commit on `claude/c3-experience` (base 430f8042). Closure 1,039,975 B,
Δ 0 vs base (the 25 B margin is untouched). All fixes live in lazy chunks or
test files; comment-only edits elsewhere.

## Resolution (13 findings)
- **F1 bar90 handbook parity** FIXED — `tests/components/handbookClaimsParity.test.js`
  binds HowToUse prose to REL_DYNAMICS / getMirrorFactionLabel / priorityHelpers
  mechanism DIRECTIONS (not numerals) + a runtime famine+politically_fractured forge.
  The Rival line HAD drifted ("elevates criminal presence" — no such engine knob);
  prose fixed to compete-economy + militaryBias + agent/saboteur factions.
- **F2 bar90 flagship probe** FIXED — `tests/generators/flagshipCoherence.test.js`
  forges the struggling criminal frontier town through the REAL pipeline (24 fixed
  seeds). Measured: corrupt 0.708 · underfunded 1.0 · blackMarket 1.0 · secrets
  0.542 · full bundle 0.417. ⚠ The conceptIntro "will have" is ILLUSTRATIVE, not
  guaranteed (bundle 42%) — prose kept (owner voice), flagged for owner wording call.
- **F3 bar5 reveal no-skip** PARTIAL — stale header doc fixed (it promised "Esc
  dismisses immediately"; a52a88b1 deliberately REMOVED the Esc handler + Skip
  button — "loading reveal plays through" = owner-signed). No-skip + reduced-motion
  dwell-shortening FLAGGED owner-taste, not changed.
- **F4 bar5 narration guard** FIXED — `tests/lint/loadingNarrationRatchet.test.js`:
  bare-"Loading" literals in src/components pinned at 34, `fallback={null}` across
  src pinned at 40; sizeBaseline-style tri-directional (above fails, below demands
  ratchet-down). Comment lines count (deepCraftKillList precedent).
- **F5 bar10 absence-story analytics** DEFERRED — verified TRUE (no catch-up/
  while-away event; only RETURN_VISIT_DETECTED / WELCOME_BACK_OPEN_CLICKED), but
  instrumentation needs src/lib/analyticsEvents.js + src/store (out of C3 scope)
  and bar-10 is human-certified. Note: WORLD_PULSE_ADVANCED does fire on the
  catch-up path (partial signal exists).
- **F6 bar18 bare Loading** FIXED — 5 sites: GalleryHubPage ("Opening the
  settlement archive…"), GalleryMaps ("Unfurling the shared maps…"), GalleryDetail
  + MemberSettlementsList ("Opening the dossier…"), GenerateWizard ("Laying out the
  settlement dossier…"). Ratchet (F4) prevents recurrence.
- **F7 bar16 privacy policy vs consent model** FIXED — policy said "three settings"
  vs FOUR toggles (undisclosed `market` licensing tier); "we will remove it" vs the
  054 anonymise+lock soft-delete. Policy repaired (four settings, market-tier
  disclosure w/ opt-in default, "do not sell your PERSONAL data" qualified,
  anonymise+lock deletion truth). `tests/components/privacyPolicyParity.test.js`
  pins policy ↔ toggle roster ↔ 054/024 SQL. JUDGMENT (vetoable): legal-surface
  copy repaired to match shipped reality rather than flagged-only.
- **F8 bar16 retention** PARTIAL — three-month lapsed-plan retention window now
  disclosed in the policy + pinned to 024's `interval '3 months'`. ⚠ The 166
  retention-warning cron stays INERT (template on an unfolded branch) — owner
  deploy/fold item, unchanged here.
- **F9 bar90 Cold War NPCs** FIXED — "generates intelligence NPCs" → "seeds
  clandestine intelligence factions" (engine mints FACTION labels: Deep Cover
  Operatives / Clandestine Network); pinned in the F1 test.
- **F10 bar2 PDF↔screen spot-pins** DEFERRED-DOCUMENTED — CANNOT-CATCH block added
  to tests/pdf/screenParitySource.test.js naming the residual (any non-food/defense
  fact can still diverge); structural walker deliberately not built as a polish fix.
- **F11 bar10 capped catch-up copy** FIXED — banner now tells the owner-ruled truth
  (realm lives the FIRST capped weeks; the remainder is skipped for good —
  calendar-advances-past-cap, 2026-07-13). whileYouWereAway.test.jsx strengthened
  with negative pins (`most recent` / `run the rest` must stay out).
- **F12 bar18 raw-id headline** FIXED — the finding's ONE instance was a FOUR-member
  class in RealmDashboard (weariest sub-line, weariest Stat, topAggressor Stat,
  hegemony nameFor). All now degrade to in-fiction generics ('a settlement' /
  'an unnamed seat'); source pin in realmHub.test.jsx. ⚠ The old realmHub test
  LITERALLY PINNED the defect ("expect getByText('s1')") — corrected.
- **F13 bar18 Ti JSON dump** FIXED — Primitives.Ti: unknown objects → first string
  field → quiet dash; arrays → joined list; known keys recurse (no object child
  can reach React). Pinned in tests/components/primitivesTi.test.js.

## Hazards learned
- ⚠ vitest here SUPPRESSES console.log from PASSING tests — calibrate probe
  thresholds by throwing the measurement in an Error message, then remove.
- ⚠ Literal-string parity pins against JSX prose must be whitespace-tolerant
  (`\s+` between words) — JSX source wraps mid-sentence.
- ⚠ The realm store mock in realmHub.test.jsx passes NO nameById — every name
  lookup misses there, so fallback copy is what renders in that suite.

## Owner-decision queue from this lane
1. PipelineReveal reduced-motion: dwell window is not shortened for
   prefers-reduced-motion users (film already drops). Signed pacing — owner call.
2. conceptIntro flagship "will have" vs measured 42% bundle co-occurrence —
   keep as illustrative voice or soften; probe pins prevalence either way.
3. F5 catch-up analytics events (needs analyticsEvents.js + store wiring).
