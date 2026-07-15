# DESIGN — EVENT COMPOSER V2 (every capability forceable; every input bounded; every preview a dial)
## Fable 5 architecture, 2026-07-14 — owner-commissioned ("every single thing that can happen bounded within the simulation should have a counterpart that can be forced in the dossier... open-ended text only for flavor... bounded in what the system can actually do, in the current state... navigable and comprehendible... previews editable and bounded"). Grounded by a 3-slice read-only recon (composer UI / preview machinery / registry+mutate layer).
### The corpus reopened for exactly this document, by owner directive. Companions: Track K's operationRegistry (the manifest this projects), DESIGN_AI_CONTROL_SURFACE (the intent compiler is this surface's linguistic twin — one op layer, two navigation modes). Builds as W-COMPOSER-1/2 + a per-wave criterion.

## 0. WHAT EXISTS (recon verdict: half the design is built; the other half has named holes)

The good bones: **preview ≡ apply BY CONSTRUCTION** (previewEvent and applyEvent are thin
wrappers over one `runEventPipeline` — pure, re-runnable, pinned by test); a typed registry of
38 event types (29 composer-authorable); `batch.js`'s produces/consumes namespace as a real
legality validator; `PARTY_IMPACT_KINDS` as the one declared-params catalog; word-banded
severity ("words at the table, numbers in the engine" — STRESSOR_SEVERITY_VALUES); exemplar
same-function affordance predicates (canStageDeityEvent runs the SAME reconcileCultImposition
probe the store runs; clampTierDirection; linkableSiblings); TARGET_ENTITY_BY_EVENT — which,
inverted, IS the target-first index; the queued-events channel for clock-bound settlements; and
Track K's 157-op manifest with its completeness walker.

The named holes V2 closes:
1. **THE PHANTOM-EVENT HOLE** (the sharpest finding): mutation handlers have NO veto channel —
   when an in-handler gate fails (imposeCorruption without a clean NPC, changeRulingPower on the
   governing faction), the mutation silently no-ops while the registry's stateDeltas AND the
   narration still commit. The canon timeline records a story the world didn't do.
2. **No payload schemas exist anywhere** — bounds live ad hoc in handler defaults; handlers are
   silently forgiving (severity unclamped except one type). Dials cannot be surfaced until
   bounds are minted.
3. **Affordance predicates are half shared-function, half comment-mirror** ("mirrors the guards
   in setPrimaryDeity") — the drift class.
4. **Preview staleness is live**: a stored pendingPreview is preferred over the edited form at
   apply (the OLD event commits), and previews never invalidate when the settlement changes
   underneath.
5. **Freetext is not flavor-only today**: ADD_NPC names, trade-good labels (label IS storage),
   custom resource names, and RESOLVE_STRESSOR's free-text fallback are parsed and load-bearing.
6. **Coverage gaps**: 9 NON_AUTHORABLE types (deliberately folded into stressor/sibling
   affordances — acceptable IF the fold is legible); and the realm scale — sieges, mobilization,
   deployments, occupations, realm route cuts, and every pending E-family verb — has no
   forceable counterpart at all.
7. `commitPendingEdits` is HOLLOW (8 of 10 edit kinds silently dropped while the queue clears) —
   V2 does NOT build on pendingEdits; flagged for separate disposition.

## 1. THE THREE LAWS OF THE SURFACE

**LAW 1 — BOUNDED BY CONSTRUCTION.** Every substantive input is a choice from what the sim can
do in the settlement's CURRENT state. Enforced structurally: every verb carries an affordance
predicate and a dial schema (§2–3); anything without them cannot render. Freetext law, refined
with the owner's intent preserved: freetext may MINT IDENTITY (naming a newly created NPC,
trade good, or resource — that is the DM's pen, and the name selects no behavior) and may add
FLAVOR (description fields, rendered as prose, never parsed); freetext may never SELECT
BEHAVIOR (RESOLVE_STRESSOR's free-text fallback is replaced by a bounded archetype pick).

**LAW 2 — COUNTERPART PARITY, PERMANENTLY.** Every simulation capability has a forceable
counterpart running the SAME machinery as its organic twin (synthetic cause id, DM provenance,
organic-identical written shapes — the imposeCorruption precedent). This becomes a
WAVE-COMPLETION CRITERION in the playbook: no mover ships without its verb, its predicate, its
dials, and its preview. The walker layer (§2) makes the criterion fail-closed, not aspirational.

**LAW 3 — THE PREVIEW IS THE CONTRACT.** What the DM sees is what commits: previews derive
through the one shared pipeline, re-derive live as dials move, invalidate on ANY divergence
(form edits, settlement change underneath), and an edited preview is re-validated — never
trusted wholesale (the current canSubmit bypass dies).

## 2. THE PROJECTION ARCHITECTURE (registry → surface, two levels)

The composer becomes a projection of a TWO-LEVEL tree: Track K's operation manifest (157 ops)
at the trunk, and within the `applyEvent` op, the event-type vocabulary (38+, growing with
every E-wave) as the branch layer — recon confirmed this two-level identity is the real shape;
the design names it rather than fighting it.

- **THE AFFORDANCE MANIFEST** (new, lazy leaf per the partyImpactKinds/registryProse idiom —
  registry.js/mutate.js/batch.js are EAGER; the manifest is not): per verb —
  `{ predicate(settlement, worldState?) → {available, reasons[], unlocks[]} , dials (§3),
  targetsFrom (the TARGET_ENTITY_BY_EVENT source), authority (the authorityFor class),
  scope ('settlement'|'realm'), foldedInto? }`.
  The predicate SHAPE is feasibilityGate's — verdict + WHY + what-would-unlock
  ("requires a criminal organization or a foreign channel"; "needs a faction with two seated
  members") — so unavailability TEACHES instead of hiding. Grayed-with-reason beats absent.
- **THE SAME-FUNCTION LAW**: predicates wrap the sim's own gates (readCorruptionClimate,
  transferRulingPower's error codes, reconcileCultImposition, classifyFeasibility, TIER_ORDER,
  batch.js's nsHas semantics) — never re-implementations. The comment-mirror gates
  (criminalOrgs filter, rulingPowerOptions) are REPLACED by exports from the owning modules.
- **THE WALKERS** (structural prevention, both directions):
  (a) *coverage walker* — every authorable event type + registered macro op has a manifest
  entry (or an explicit `foldedInto` pointing at its carrying verb — the 9 folded types become
  legible: "PLAGUE arrives via APPLY_STRESSOR (plague)"); new types cannot ship uncovered.
  (b) *predicate-parity walker* — every in-handler gate in mutateEntities/mutateWorld has a
  matching manifest predicate (enumerated, shrink-only exemption ledger), which CLOSES THE
  PHANTOM-EVENT HOLE from the offering side; and the build adds the veto channel from the
  applying side: `runEventPipeline` gains a handler-veto contract (a gated no-op returns a
  refusal the pipeline surfaces as a blocking warning — deltas and narration do NOT commit on a
  vetoed mutation). Preview≡apply makes the veto visible before the DM ever commits.

## 3. THE DIAL LAYER (bounds are minted, then enforced twice)

Generalize PARTY_IMPACT_KINDS' declared-params shape into per-verb dial schemas:
`{ key, kind: 'enum'|'band'|'range'|'target'|'toggle', options|min/max/step, default,
   bandWords?, clampAtCommit: true }`.
- **Words at the table, numbers in the engine** stays the idiom: severity dials render as word
  bands (minor/moderate/severe) mapping to the engine's numeric points; ranges surface only
  where the design of the verb genuinely wants a continuum (duration weeks within term caps).
- Options are CURRENT-STATE-FILTERED through the same predicate layer (the target dial for
  EXPOSE_CORRUPTION lists only actually-compromised entities; a purge clause dial lists only
  live leashes).
- **Enforced twice**: at buildEvent (the dial can't express out-of-band) AND at commit
  (clamping lands in the handler reads — recon: handlers accept out-of-band values silently
  today; that forgiveness is retired for dialed fields). The dual enforcement is pinned.

## 4. NAVIGATION (nobody ever meets the catalog)

- **TARGET-FIRST (primary)**: invert TARGET_ENTITY_BY_EVENT — click any entity anywhere in the
  dossier (institution, NPC, faction, neighbour edge, resource, stressor, the settlement
  itself) → its legal verbs, predicate-filtered to NOW, typically 5–12. Entry points ride the
  SuccessorPrompt injection precedent (stage a composition from anywhere + data-anchor scroll).
- **FAMILY BROWSE (secondary)**: the registry's affected-domain tags (Economy / People / Power /
  Faith / War / Relations / Realm) — for the DM who knows the domain, not the target.
- **SEARCH (tertiary)**: CatalogPicker generalized over the whole verb manifest (it already
  does search + category pills + caps).
- **THE PRESSURES RAIL (the situation speaks first)**: current conditions surface the verbs
  they make relevant — a siege floats relief/sortie/treat; a scandal floats purge/expose/
  reform; a famine floats the generosity verbs. The §H philosophy applied to UI: the situation
  loads what you see. (Derives from activeConditions + causeVocabulary's CAUSE_SIGNAL classes —
  read-models that already exist.)
- **RECENTS + the batch cart** stay (the cart's order-aware validateBatch is already the right
  multi-event machinery).

## 5. THE LIVE PREVIEW (editable, bounded, honest)

- **Engine**: `runEventPipeline` called directly — pure and re-runnable by construction. For
  dial-drag cadence: hoist/memoize the before-derivation (beforeSystemState/beforeCausalState
  don't change while dials move) + `skipFactionResponses` during drag, full derivation on
  settle. (Recon: unbenchmarked for per-tick cadence — the build's first task is the benchmark;
  the fallback is settle-only re-derivation, still live in feel.)
- **IDENTITY**: one compose-session-stable event id minted at composition start (dial turns
  never re-mint — undo/timeline/successor-PRNG keying stays stable); the existing id semantics
  at commit are unchanged.
- **STALENESS LAW** (kills the live bug): the preview is keyed to (payload hash × settlement
  fingerprint); ANY divergence invalidates it — an edited form can never commit a stale
  preview, and a world-pulse advance under an open composer visibly voids the pane. The
  apply-prefers-pendingPreview bypass is retired; an edited preview re-validates.
- **QUEUED-VS-NOW is surfaced**: clock-bound canon settlements queue (the existing channel);
  the preview pane says so plainly ("applies at the next advance") instead of silence.
- **Two-band rendering law**: previews render summarizeEventResult's DM-facing band; diagnostic
  delta families never leak to the pane (the existing separation rule, kept).
- **Batch**: the preview-vs-apply computation divergence near saturation (different
  clamp/round ordering) gets a pin in the build; the cart renders per-event dials inline.

## 6. REALM-SCALE FORCEABLES (the coverage gap, closed by the proposal machinery)

The realm layer already contains the perfect force-path and the recon named it: **the proposal
applier is approve-≡-auto by construction** (resolveProposalToOutcome → applyWorldPulseOutcomes
— the same shared-applier property the settlement layer has). So realm-scale forcing = **the DM
mints a proposal** (DM provenance, `forced` cause class) **and approves it through the existing
applier** — byte-identical to a sim-originated outcome, zero new apply paths. Concretely:
- Verbs: mobilize/stand-down, deploy/recall, open-siege (classifyFeasibility IS the predicate,
  surfaced with its verdict + reasons + unlocks — require_coalition/betrayal/magic render as
  the unlock hints), impose/lift occupation posture, realm route cut/restore, seed-rumor (the
  statecraft LIE verb when W-DOCTRINE lands), and every E-family verb as its wave ships
  (treaties, generosity acts, coalition nudges, leashes — each wave's criterion per LAW 2).
- Campaign-scope guards are law: the advanceInFlight + pausedAdvance sync-prefix pattern
  (recon: writes outside it get wholesale-reverted by the Phase-2 commit).
- The authority column: every realm verb carries its authorityFor class, so dm_only/
  recommendations/routine modes govern forced ops exactly as they govern the sim's own.
- Scheduling: "at the next tick" rides the existing queued-events channel; "now" rides the
  proposal-approve path.

## 7. WHAT V2 DOES NOT DO
No pendingEdits base (the hollow dispatcher is dispositioned separately); no freetext parsing
anywhere; no new apply paths (everything through applyEvent/applyEventBatch/the proposal
applier); no mobile authoring (view-only posture holds; authoring is desktop); no AI in this
surface (the Surveyor consumes the same manifest later — building the manifest well IS the
Surveyor's ground-floor).

## 8. SEQUENCING + THE CRITERION

- **W-COMPOSER-1 (foundation)**: the affordance manifest + both walkers + the handler-veto
  channel + dial schemas for the existing 29 authorable types + target-first navigation + the
  pressures rail + the live-preview frame (benchmark first) + the staleness law + id stability.
  Parallel-safe with E1 (composer/manifest files vs worldPulse kernel files).
- **W-COMPOSER-2 (realm)**: the force-as-proposal lane + feasibility surfacing + authority
  column + the first realm verb set (mobilize/deploy/siege/occupation/route).
- **THE STANDING CRITERION (playbook amendment, permanent)**: every subsequent wave that adds a
  simulation capability ships its verb + predicate + dials + preview in the same wave, enforced
  by the coverage walker. The composer never falls behind the world again.

## 9. PINS (the build's proof set, headline items)
Predicate-parity walker green with zero exemptions at foundation (every in-handler gate has a
predicate); the phantom-event pin (a vetoed mutation commits NO deltas and NO narration — the
regression pin for the hole); dial dual-enforcement (out-of-band unreachable via UI AND clamped
at handler); staleness (edited form cannot commit a stale preview; advance-under-composer voids
it); target-first completeness (every entity kind reaches every legal verb); fold legibility
(each NON_AUTHORABLE type's card names its carrying verb); realm force-≡-organic byte-parity
(a forced mobilization equals the sim's own, modulo provenance); preview≡apply preserved at
every new seam (the existing pin extends to dials and batches).
