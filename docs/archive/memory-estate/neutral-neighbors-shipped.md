---
name: ""
metadata:
  node_type: memory
  title: NEUTRAL-NEIGHBOUR DEFAULT — co-campaign settlements read as implicit Neutral neighbours (chokepoint shipped, cascade-scoped)
  date: 2026-07-22
  tags:
    - neutral-neighbours
    - effective-neighbours-chokepoint
    - relationship-cascade
    - campaign-scoped
    - read-time-default
    - single-writer-guard
    - E-A-mutation-cover
    - routes-untouched
    - numeric-id-hazard
    - project
  branch: claude/neutral-neighbors
  base: 0fc79125
  tip: 299a83d3
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T09:08:33.989Z
---

# NEUTRAL-NEIGHBOUR DEFAULT (owner order 2026-07-22)

**Status: BUILT + gate-green on branch claude/neutral-neighbors (a6d24ccf feature + 299a83d3
guard, off 0fc79125). NOT folded, NOT pushed (owner/manager-gated). Manager architecture is the
implicit-default; VETOABLE by the owner at fold.** Owner verbatim: "Every settlement automatically
becomes a neutral neighbor by default. That does not mean that they automatically have a route to
each other. Those routes are established in the realm deterministically."

## THE CHOKEPOINT (as built)
`src/domain/relationships/effectiveNeighbours.js` (NEW, strict-clean, 0 any):
- `effectiveNeighboursOf(save, coCampaignSaves)` = every explicit link AS RECORDED + an implicit
  Neutral link to every OTHER co-campaign settlement with no explicit link. Explicit WINS (dedup by
  id AND name). Empty/absent coCampaignSaves ⇒ STRICT NO-OP (returns the exact explicit array,
  same identity).
- `campaignMembershipIndex(campaigns)` = Map<idStr, campaignId> from ACTIVE campaigns (String-
  normalized ids, same as campaignSliceShared.campaignSettlements).
- Implicit entries carry marker `IMPLICIT_NEUTRAL_FLAG = '__implicitNeutral'` + a one-sided
  synthetic `linkId` (`implicit_neutral__self__other`) + a RAW `targetId`. NEVER persisted — this
  is why lifecycle is automatic.
- ⭐ `src/lib/relationshipGraph.js` `buildGraph(saved, { campaignOf })` reads through the chokepoint
  campaign-scoped; groups saves by campaign, expands each against its own campaign group.
  `getSettlementModifiers` / `getAllModifiers` pass `options` through. NO options ⇒ byte-identical
  to before (28 existing cascade pins untouched). A direct-`targetId` fast path resolves implicit
  edges (their linkId is one-sided).

## ⚠️ NUMERIC-ID HAZARD (skeptic-caught, FIXED — cite if a cascade golden ever reddens)
Cloud saves carry NUMERIC ids (`saves.js`: `id = v2.id || Date.now()`). buildGraph keys its graph
Map + saveIndex by the RAW `save.id`; explicit edges resolve to the raw id via `owners.find(...)`.
The implicit edge MUST use the RAW target id too — a stringified `"3"` vs numeric `3` are distinct
Set/Map keys, so an already-explicitly-linked numeric-id partner got DOUBLE-visited (phantom neutral
on top of an explicit rival) and lost tier-ratio/factor-delta enrichment + onward propagation. Fix:
`effectiveNeighboursOf` stores raw `other.id` in `targetId`, and buildGraph's fast path does NOT
`String()` it. Pinned (tests/lib/relationshipGraphImplicitNeutral.test.js "NUMERIC ids"). Existing
cascade fixtures all use STRING ids, so nothing else covers this.

## CONSUMER CENSUS — converted vs exempt (JUDGMENT, vetoable)
CONVERTED (read through the chokepoint — the cross-settlement DYNAMICS):
- relationshipGraph cascade → SettlementsPanel library grid (getAllModifiers) + SettlementDetail
  dossier Network Effects panel (getSettlementModifiers via SettlementDetailNetworkEffectsPanel,
  which now derives campaignOf itself via useStore — moved OFF SettlementDetail.jsx to dodge its
  600-line ceiling). computeNetworkEcho got the param too but is DEAD (no importer).
EXEMPT / explicit-only ON PURPOSE (reasoned):
- roadNetwork.js + map RelationshipEdges — routes stay realm infra; an implicit neutral must never
  become a route (and neutral ∉ TRADE_RELATIONSHIPS anyway). THE ROUTES-UNTOUCHED PIN proves it.
- domain/region/graph.js `deriveRegionalGraphFromSaves` — "intentionally separate" causal channel
  graph; routing it through would mint a confirmed war/trade channel per co-campaign pair (sim
  explosion). Only called by the manual "Discover channels" button, not per tick.
- PDF/worldbook exports (getAllModifiers in generateWorldBook:153, generateCampaignPDF:671) — LEFT
  without campaignOf → byte-identical, no paid-surface change. ⚠️ EXPORT vs ON-SCREEN divergence:
  exports do NOT show the implicit-neutral baseline the panels show. Deliberate (paid-surface +
  display-taste). OWNER MAY VETO to extend.
- persistence, all write/delink paths, existence-gates (LibraryToolbar Linked filter, telemetry,
  structuralFingerprint, CascadePreviewPanel delete-count, SettlementCard badges) — all explicit-only.

## LIFECYCLE (proven — derived from live membership, no stored state)
place / remove / re-place / import (neighbourNetwork scrubbed to []) / campaign-move all flow from
campaign membership. ⭐ Removing a settlement needs NO delink for its implicit neutrals (only
explicit rows get Delink Cleanup, unchanged) — the design's virtue. Pinned in
tests/domain/effectiveNeighbours.test.js.

## BEHAVIORAL DELTA (owner's intent = coherence)
For co-campaign settlements that previously had NO links, the Network Effects cascade now activates
at a NEUTRAL baseline: the panel appears on every settlement in a multi-settlement campaign; each
gets small effects from every co-campaign neutral (economy/safety/supply/political 0.05 each ×
tier/factor scaling). ⚠️ Larger campaigns → proportionally larger neutral totals (N-1 neutral
neighbours, uncapped). NO CAP added — a cap/scale is an owner balance decision (flagged, deferred).
NO same-seed campaign/worldPulse golden shifts: worldPulse hand-builds regionalGraph and never
calls relationshipGraph; the new behaviour only activates where a live caller passes campaignOf, and
no test/golden does.

## THE GUARD (structural-prevention Pattern 3 + E-A)
`tests/lint/implicitNeutralSingleSource.test.js` — single-writer source scan: implicit neutrals are
minted ONLY in effectiveNeighbours.js (WRITE signatures: `[IMPLICIT_NEUTRAL_FLAG]:` key set,
`implicit_neutral__` literal; reads don't trip it). E-A totality: it's a new invariant test, so it
REQUIRED a mutation-coverage entry — added `check_caught_planted "neutral-neighbour/second implicit
minter"` to scripts/mutation-sweep.sh + a kind:"mutation" entry in
scripts/mutation-coverage-manifest.json. Plant→red→green demonstrated (both the manual plant and the
standing sweep line). ⚠️ ANY new lint/security/invariant test file trips mutationCoverageManifest
TOTALITY — you must add a manifest entry (mutation plant preferred, or rationale).

## PRE-EXISTING BASE REDS (confirmed on 0fc79125, NOT mine — manager to triage)
The composite base is NOT at "4 parked" — 6 files red on base right now (mostly goldens/hashes a
parallel lane fold likely shifted): worldpulseDeityGolden, deepCraftKillList (borderRadius ceiling),
aiGroundingBundle.freshness (source-tree hash — needs build:edge-shared regen), beliefMapGolden,
goldenViewModel (pdf canon). ⚠️ homeLanding.test.jsx is red on base too — 2 tests: "all seven
section headings render from the copy registry" + "the anon ceiling string appears exactly once" —
manager suspects a MISSED-FOLD regression from the landing restructure, NOT parked. advancePauseResume
+ the two pglite suites were CPU-contention timeouts (green in isolation) during a wave-c fold.

## GATE (final snapshot)
domain-strict 0 · tsc full 0 · eslint 0 new (SettlementDetail reverted to dodge 600 ceiling;
SettlementsPanel dense-lined under 600) · my 2 reds FIXED (domainAnyCastBaseline: 0 any;
mutationCoverageManifest: manifest+plant) · VERIFY_DIST 227/227 · first-paint entry static closure
1,039,961 B == BASE 1,039,961 (Δ=0 EXACTLY, cascade source stays in the lazy SettlementsPanel chunk;
brief's "1,039,956" was 5 B stale). Full-suite two-shard run was CONTAMINATED by parallel sessions
(VENDOR-MANIFEST / __exact_set_probe__ writes) — triaged in isolation instead.
