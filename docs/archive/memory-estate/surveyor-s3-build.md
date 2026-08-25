---
name: surveyor-s3-build
description: "Surveyor S3 (the biggest AI build) FOLDED into claude/w7-prep @ 9ade8e08 (2026-07-17): the intent compiler (interpret-session), THE PARLEY (parley), and the Shell core (context anchor + zero-cost empty state). ~128 pins; migrations RENUMBERED AT FOLD 145/146→149/150 (spend_credits interpret=5/parley=3 + per-stage kill-switch; head 150 contiguous). NOT pushed. Lane tip 03b5e2b4."
metadata: 
  node_type: memory
  type: project
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

# Surveyor S3 — the intent compiler + the parley + the Shell (2026-07-17)

Built by the Opus implementer per the S3 brief (task #33, the biggest AI build). Branch
`claude/surveyor-s3` off `e6f14414` (RATCHET #11), lane tip 03b5e2b4 (5 commits).
**FOLDED into claude/w7-prep @ 9ade8e08 (2026-07-17)** with migrations RENUMBERED
145/146 → **149/150** (collision with the gallery fold's 145–148; validator: 150
contiguous, full-sequence pglite green; ARCHITECTURE count→150, DEPLOY head→
150_surveyor_stage_kill_switch, pricing.js auto-merge verified 599 + interpret/parley).
NOT pushed (the very end). Sign-off asks ride the RULING #5 blanket, all vetoable.

## The three charges (all COMMITTED, incrementally)
- **A — THE INTENT COMPILER** (`interpret-session`), commit 6ea8a1bc. Session text → proposed
  canon events + party impacts only. `interpretCore.ts` (pure): label taxonomy (required/
  inferred/optional/uncertain), THE SCHEMA WALL (emits only the 40 canon-event types +
  12 party-impact kinds; unregistered ⇒ surfaced as unsupported, never invented), protected-
  constraint flags, the aiOperationLog. Client: `src/domain/intent/opVocabulary.js` (tool-schema
  builder + protected context), `interpretReview.js` (per-item approve/edit/reject, the
  PROTECTED-CONSENT BARRIER, and the §9 SURVEYOR correction typology GONE LIVE — the 6 classes
  in `correctionTypology.js` that were deferred "until the compiler ships").
- **C — THE PARLEY** (`parley`), commit 117a53ad. In-character consultation, MUSINGS-ONLY
  (nothing commits). `parleyCore.ts` (pure): EPISTEMIC FIDELITY is structural — the persona
  speaks only from its belief slice, enforced by the analyst citation law over the slice (a
  line reaching outside is scored as a LEAK). The glue typology (patronage⇒patron / else seat),
  the TOTAL-GROUNDING MANIFEST + parity check. Client: `src/domain/ai/groundingManifest.js`
  (person facets sourced FROM `NPC_FACET_KINDS` — the one enumerable no-dead-facet census,
  consumed in reverse) + `personaSlicer.js` (belief-scoped; every facet from the entity's OWN
  knowledge + fogged reads, never another entity's ground truth).
- **B — THE SURVEYOR SHELL core**, commit 389c3f61. `contextAnchor.js` (the VISIBLE, page-
  following anchor: dossier⇒settlement · realm⇒realm · chronicle⇒advance · map-selection⇒the
  picked settlement; consumed as the default retrieval scope) + `suggestedQuestions.js` (3-4
  read-model-derived questions, ZERO provider cost — the module imports no transport). Wired
  into `AiAnalystPanel.jsx` (reads the route via `useRoute()` inside the lazy chunk — NO
  App.jsx change, no ceiling touch): visible anchor chip, zero-cost empty state, live credit
  balance, retrieval routed through the anchored settlement.

## Reuse (never duplicated)
Both new edge functions REUSE the S1 machinery by direct import from `../ai-analyst/`:
`creditFlow.ts` (the money round-trip), `byok.ts`, `providerErrors.ts`, and the pure core
(`analystCore.ts`: fnv1a canary, meta-probe, the §3f rider, the §3e provider-adapter retention
contract, `validateClaims`/`citationCoverage`). JUDGMENT: import over refactoring analystCore
into `_shared` — keeps every S1 pin green + the S1 edge bytes byte-identical. The one genuinely-
shared NEW piece IS in `_shared`: `surveyorStage.ts` (the kill-switch helper).

## The kill-switch (§2b launch-whole)
Migration 146: `system_config.surveyor_stage_switches` (launch-whole default-ON: analysis/
brief/interpret/parley all true) + `surveyor_stage_enabled(stage)` RPC. The edge fails CLOSED
(`isStageEnabled` = literal `true` only; OFF *or* unreachable ⇒ a §3d graceful refusal naming
the switch), consulted AFTER entitlement and BEFORE any spend. Operators pause a stage via a
direct config edit — no writer RPC, no deploy.

## Migrations (OWNER-GATED — do not push/apply without sign-off)
- **145** `spend_credits` +interpret=5 +parley=3 (PROVISIONAL/vetoable pricing; owner-queued).
- **146** the per-stage kill-switch. Both apply cleanly in `migrationSequenceAll.pglite`.
- applied-head stays 117 (bumping it is a deploy step — untouched).

## Pins (~106 across 8 new test files)
`aiInterpret` (19), `interpretReview` (12), `aiParley` (15), `personaSlicer` (7),
`surveyorShell` (11), `surveyorKillSwitch` (edge wiring + helper), `surveyorStageKillSwitch.
pglite` (7). Enumerated brief pins all covered: compiler label taxonomy + per-item flows +
protected refusal · kill-switch fail-closed · anchor-follows-page + visible · suggested-
questions-zero-cost · parley epistemic-fidelity LEAK FIXTURE · total-grounding parity ·
musings-only · citation/canary/rider/retention on BOTH new task classes · eval events
(interpret correction-rate + register/grounding coverage). 5 id-free eval events added
(dictionary/metrics-registry/edge-shared bundle regen; the spurious aiGrounding meta timestamp
was reverted — only inputs I touched change).

## Byte budget
First-paint closure UNDER the 1,040,000 budget (verify:dist green). The Shell rides the lazy
`AiAnalystPanel` chunk (zero eager); only eager delta = 5 short analytics event-name strings
(~150 B), well under the 1KB stop-threshold.

## Gate (final, executed)
Full suite run twice on the tree. The deterministic red set = the conformance the new
surfaces owed the gate, ALL FIXED @ 03b5e2b4: config.toml verify_jwt pins (interpret-session
+ parley), doc-count freshness (ARCHITECTURE 18→20 fns / 144→146 migrations; DEPLOY head
146 + 2 deploy lines; abuse-model 18→20), and ⚠️ THE ANY-HOLE TRAP RECURRED — the strict-fix's
`@param {any}` annotations tripped domainAnyCastBaseline (new domain files get 0); resolved
with structural typedefs (SettlementLite/EntityLite/HomeLite/ReviewOp…) satisfying BOTH
ratchets at once. Remaining reds: EXEMPT_CEILING 69>66 (pre-existing on the pre-signature
base; per the coordinator it is SIGNED at 69 on the mainline and clears at merge) + load
flakes proven by isolation (advancePauseResume 9/9, accountStatusGate.pglite 12/12,
feedDistribution/timelineVariety/moverComposition green alone; every run-2-only red passed
in run 1 on the identical tree). Validators + typecheck + domain-strict-0 + lint(0 err) +
build + verify:dist 143/143 all green. Final S3 sanity: 121/121. Tip = 03b5e2b4 (5 commits).

## Seams / deferrals (recorded, not bugs)
- The Shell UI is the pinnable CORE + the anchor/empty-state wiring; the fuller §2c surface
  (docked-resizable panel vs the floating card, ambient ask-here glyphs on every receipt/card,
  the in-panel interpret proposal cards fully interactive, the parley "speak with…" affordance,
  Cmd+K palette) is UI polish OVER the now-pinned logic — deferred with reason (least verifiable
  without a live authed browser session; the constitutional pins are secured).
- The interpret ACCEPT→mint-proposal wiring (interpretReview produces the accepted ops; routing
  them through `applyWorldPulseProposal`/`recordPartyImpact`/`stageRealmVerb` per the op family)
  is designed but not yet wired into the panel — deferred (the review-side transitions + the
  proposal machinery both exist; connecting them is the next slice).
- personaSlicer's deep read-model calls (fogged hegemony via `makeHegemonyFear`, reframe stance
  via `reframeReadingOf`, season via `seasonalContextFor`) are guarded (`safe`) and DEGRADE to
  muted facets on a dormant/partial worldState — so parity always holds; the depth of each
  facet's data grows as those (dormant-gated) read-models light up.
