---
name: fix-c1-engine-shipped
description: "C1 engine/cohesion wave @ claude/c1-engine 8ccfe683 (NOT folded): 1 of 9 dimension-bar findings fixed (candidateType->impactKind prose/voice walker), 8 struck/queued (owner-gated dormancy, already-covered, refuted, feature lanes)."
metadata:
  node_type: memory
  type: project
  modified: 2026-07-21T05:36:13.208Z
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
---

**C1 ENGINE / COHESION wave shipped 2026-07-21** (dedicated subagent, vision-e worktree, branch claude/c1-engine).

- **claude/c1-engine @ `8ccfe683`** (base 982290ed): ONE commit "C1: engine cohesion tightened", 2 files (both tests), +139/-2. NOT folded/pushed. Gate: domain-strict 0 (bare) · tsc 0 (tsconfig.full.json) · eslint 0 touched · candidateTypeVoicePhrasing.walker + impactKindWalkers 9/9 green · NUL 0 · **eager delta 0** (test-only, zero src bytes, all chunks unchanged, no golden touched — 4 parked reds remain the only expected reds).

## The one real fix (finding bar2 "no walker binds every candidateType to an effect pathway")
- ⚠️ Key mechanism: apply routes STATE MUTATION by `outcome.type` + payload (npcPatch/factionPatch/stressor/proposalPayload.kind), **NOT** by candidateType. `applyWorldPulse.newsEntryForOutcome` (line ~298) stamps `impactKind: outcome.candidateType || outcome.type` — so **every minted candidateType is promoted to an impactKind** on its wizard-news entry. candidateType is a display/provenance LABEL, not a dispatch key. The finding's "no apply arm ⇒ no state" premise is architecturally mismatched.
- Reader worst case already DEFENDED BY CONSTRUCTION: `whatPhrase()` (settlementRumors.js:224, chokepoint) strips engine prefixes + de-underscores → "readable words, never a raw slug"; `newsVoiceCategory()` (newsVoice.js:650) has the **set-but-unclassified guard** `if (impactKind) return null` — every candidateType routes to null (no crier). But that safety was UNENFORCED.
- ⚠️ `impactKindWalkers.test.js` scans only LITERAL `impactKind:'<lit>'` mints and DISCLAIMED this dynamic candidateType path with a stale claim ("candidateTypes already phrased in WHAT_PHRASES") — true for only 32 of 41; the other 9 (convoy_ordered, intercept_ordered, intervention_ordered, reconsideration_forced, reinforcement_ordered, resource_discovery, resource_removal, settlement_resettled, settlement_terminal_death) ride the fallback.
- FIX = new **tests/domain/candidateTypeVoicePhrasing.walker.test.js** (impactKind-walker idiom): source-scans all `candidateType:'<lit>'` mints in src/domain/worldPulse (41 today), asserts for each (a) whatPhrase is non-empty + underscore-free, (b) newsVoiceCategory returns null unless in the (empty) VOICED_CANDIDATE_TYPES allowlist. Positive controls seed a slug + a classifier collision. Corrected the stale impactKindWalkers comment to point at it.

## The 8 struck/queued (each verified against code — do NOT re-find as bugs)
- **bar2 provenance ledger / bar4 recorded cause-walk (duplicate)**: `provenanceLedgerActive` is a documented virtual dormancy flag (mirrors upswingArcsActive); Cause-Walk UI correctly hidden when dark (no overclaim). Lighting = **OWNER-GATED** ONE-REGEN.
- **bar8 register guard on content**: REFUTED 3/4. `voiceMechanics.test.js` already walks src/data + src/domain with a per-file shrink-only em-dash+exclamation ratchet + frozen budget (EM 672 / BANG 15), covering eventProse.js, npcData.js, narrativeData.js. Only `src/generators/narrativeText.js` is OUTSIDE the walk (src/generators not scanned) — copy-wave gap, not src/domain.
- **bar10 absence-story off default**: `worldProgression` default `dm_advanced`; catch-up documented "strictly opt-in" (simulationRules.js ~L400). Default change = **OWNER-GATED** (paid-surface/constitutional promise).
- **bar97 tempo governor inert**: narrativeTempo null-when-unset deliberate; tempoGovernor.property.test.js pins bands; lighting owner-gated (e0-tempo memory). STRUCK.
- **misc enum-derived composer output**: REFUTED as enum leak. `.replace(/_/g,' ')` sites de-underscore CONTROLLED vocab (capture ladder none/adversarial/equilibrium/corrupted/capture; relationship types) reading as English; proseLeak.test.js guards composer OUTPUT. The 3 flat templates ("the settlement context changed" npcAgency:1065, "become a realm stressor" stressors:430, "for a new condition to emerge" candidateEvents:73) are hand-written prose feeding GREEN generator/dormancy goldens — reword is golden-bound OWNER-GATED copy polish.
- **bar4 no per-mechanism lit-walkthrough walker**: finding calls it "a convention"; 34 dormancy anti-vacuity goldens + preset-stability + moverCompositionSmoke uphold it. A ~152-mechanism coverage walker is a large fragile lane → DEFERRED (documented).
- **bar20 decade arc no durable history**: PARTIAL/real. Path EXISTS — `withCampaignHistoryEvent` (stressorAftermath.js:148) promotes GRADUATED stressor echoes to dated historicalEvents (campaignEra:true, yearsAgo:0) — but gated on graduation + terse stressor-shaped ("gripped the settlement... passed into memory"). A war-ARC promoter = NEW persisted state + golden shift = **OWNER-GATED** feature lane. Queued.

## Owner-gated / ONE-REGEN queue produced by this wave
provenance-ledger lighting (bar2/bar4) · default worldProgression+catch-up (bar10) · tempo lighting (bar97) · flat composer templates reword (misc, golden-bound) · war-arc durable-history promoter (bar20) · per-mechanism lit-walkthrough walker lane (bar4).
