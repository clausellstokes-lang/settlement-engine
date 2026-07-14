# DESIGN — THE AI SECOND CONTROL SURFACE ("Surveyor")
## Fable 5 architecture, 2026-07-14 — mapping the owner's 41-section vision onto the existing engine
### The owner's spec (recorded in full in the session of 2026-07-14) is the WHAT; this doc is the HOW-on-THIS-codebase. BUILD queues after the fix program per the owner's sequencing ruling.

## 0. The one-sentence architecture
The AI layer is a PROPOSER that speaks an operation vocabulary the product ALREADY half-owns:
it compiles natural language into the same typed, receipted, validated operations the manual UI
uses (canon events, party impacts, ruleset changes, custom content, config, advances), those
operations flow through the EXISTING proposal/approval machinery, the deterministic engine
resolves them, and the read-model layer (already fail-closed, already truth/belief-aware) is the
sole source the AI narrates from. "AI proposes → simulator validates and resolves → DM
authorizes" is not a new trust model for this codebase — it is CL-0/M10a's trust model with a
second client.

## 1. Substrate audit — what already exists (this is why the vision is buildable)
| Vision component | Existing substrate | Gap |
|---|---|---|
| Operation layer, one for manual+AI | Track K ActionResult envelope + durable outbox (5 canon actions); 38-type canon-event registry with preview≡apply; partyImpactKinds; simulationRules + rulesetLog receipts; customContentSchema; regenerationDelta | UNIFY + COMPLETE: one OperationEnvelope over all six op families; Track K adoption 5→full (this is "uncompleted work" the fix program already owes) |
| Proposal review + approval | worldState.proposals + WorldPulsePanel approve/dismiss + M10a hold-then-expire + authorityFor policy | Extend payload with the intent-compiler labels (required/inferred/optional/uncertain/protected); per-item approve; edit-before-approve |
| Receipts/audit | rollExplanations, causal contributors, provenance, chronicle, rulesetLog | NEW aiOperationLog (prompt hash, interpretation, model+template version, ops proposed/approved/rejected/edited, before/after fingerprints, seed, engine version) — same conditional-ledger discipline |
| Read-only analyst grounding | The read-model layer (settlementBeliefs, settlementRumors, occupationStatus, warResolve, causalViews, tradeFlowEconomics…) + aiGroundingBundle (app-code-derived edge grounding ALREADY BUILT) | Retrieval slicing (per-question state slices); the analyst edge function |
| Player-safe outputs | publicSafe + settlementRumors player projection (fail-closed, client+server twins) | ARCHITECTURAL RULE: the player-safe brief feeds the AI the PROJECTION, never truth+instructions — leak-proof by construction, not by prompt |
| Dramatic-irony brief | belief-vs-truth divergence read-models (Wave A) | Pure composition + prose |
| Counterfactuals/branching | Deterministic engine + snapshot/version-history machinery + domain/counterfactual.js (BUILT, currently unconsumed — the review's orphan census) | Mount it: branch = clone + bounded advance + diff read-model |
| Advance-until | advanceCampaignWorld + interval orchestrator + M10b cap semantics | Typed StopCondition predicates evaluated per tick from read-models (deterministic; AI only COMPILES the predicate, never evaluates in-loop) |
| Protected entities | Canon identity locks (regenSection-respects-locks lands in F1); userEdits/_authored | Generalize to a protected-entity registry every op validator consults |
| Credits/billing | spend/refund/reservation RPCs, claim ledgers, nightly pricing resync cron | Task-type price table; per-task reservations (the generate-narrative pattern generalizes) |
| Consent/training data | Consent v2 (research plane, off-by-default precedent, server-side clamping) + the analytics seam | A SEPARATE campaign-level contribution toggle (off by default, revocable, deletable); sanitization pipeline; intent→ops→correction corpus schema |
| Provider | generate-narrative edge fn (Anthropic, Opus thesis + Haiku refinement) | Provider-neutral adapter + model routing (fast/balanced/deep by task class); BYOK vault |

## 2. The build, in the owner's sequence (each stage independently shippable)
1. **ANALYST (read-only).** New edge fn `ai-analyst`: JWT → credits reserve → retrieval (question
   → relevant read-model slices via a registry of state-slicers; DM questions may include
   includeGroundTruth slices, player-framed questions get projections) → provider adapter →
   answer with RECEIPT CITATIONS (each claim tagged with the read-model/receipt it came from).
   Zero write surface. Chat panel = lazy chunk (first-paint clean by construction).
2. **BRIEFS (editorial).** Brief composers are PURE read-model bundles (weekly/session-prep/
   settlement/faction/regional/dramatic-irony/player-safe) — new display modules, testable
   without AI; the AI adds prose over the bundle. Player-safe brief consumes ONLY the public
   projection (rule above). This stage also pays down the review's legibility findings — the
   brief bundles and the F3 surfaces share read-models.
3. **POST-SESSION INTERPRETATION (the first write path).** The intent compiler ships here,
   narrow: session text → proposed canon events + party impacts (vocabularies that already
   exist, preview≡apply already built, regen-survival records already exist [F-wave hardened]).
   Tool-schema = the op registry; the compiler labels each op required/inferred/optional/
   uncertain and lists protected constraints; the review UI renders labels and allows per-item
   approve/edit/reject. Every apply writes the aiOperationLog.
4. **CUSTOM CONTENT.** Compiler targets customContentSchema drafts; validation is the existing
   schema + injection points; "unsupported physics" answered honestly by construction (the
   compiler can only emit registered op types — the hallucinated-mechanics risk dies at the
   schema, and the response labels flavor vs mechanical mapping vs unsupported).
5. **SETTLEMENT CONSTRUCTION.** Intent → generator CONFIG (the config vocabulary is the op) →
   deterministic generate → INTENT-VS-RESULT COMPARATOR (read-models judge the result against
   extracted constraints; deviations listed) → revise loop → commit. The F2/G2 config-seam fixes
   are prerequisites (the compiler must not write vocabularies the pipeline ignores).
6. **REALM CONSTRUCTION.** Later; targets campaign/regional config + spatial canonize; the
   comparator generalizes. Gate on stage-5 acceptance metrics.
7. **ADVANCED AUTONOMY.** Typed StopConditions + acceleration ops (pressure nudges, never
   state-jumps — "raise the conditions, let the simulator decide") + standing campaign
   instructions (campaign-scoped, versioned, editable; injected into every compile; NEVER into
   engine state).

## 3. Hard rules (the constitution extended to the AI layer)
- The AI NEVER writes state: ops only, through validation, through approval. No op type = no
  effect. The engine stays LLM-free; no AI call per tick ever.
- Determinism: ops are data; replaying the op log against the same seed reproduces the world;
  aiOperationLog records engine version + seed per apply.
- The premium/DM-truth seam: analyst/briefs run per-audience — player-facing outputs are
  composed FROM the public projections, DM outputs may read includeGroundTruth; the AI never
  bridges the two in one context.
- First-paint: every AI surface is lazy; the eager cost target is ~0 (route + panel stubs ride
  existing lazy patterns). Budget ratchet applies as to any wave.
- BYOK: keys in encrypted server-side storage only (Supabase vault/pgsodium), decrypted inside
  the edge function per request, never logged, never in client state, never in world state,
  never in the training corpus; rotation + deletion + audit records. Prohibit key display after
  entry.
- Training corpus: campaign-level opt-IN (off by default), separate from analytics consent,
  revocable with deletion; sanitization strips secrets/PII/pasted-copyright; store state SLICES
  not whole campaigns. (Prerequisite: the F-wave consentTier stamping fix — the queue must purge
  on revocation for the new record types.)
- Provider-neutral: SettlementForge owns ontology, op schema, retrieval, validation, prompts,
  receipts, approval UX; providers are adapters (Anthropic first, OpenAI second). Routing
  classes fast/balanced/deep per task type; users buy OUTCOMES (task-priced credits), not tokens.

## 4. Commercial mapping (per the owner's spec, recorded decisions)
- **Surveyor tier $19.99/mo** = Premium + the AI control surface; tier axis gains 'surveyor'
  (the anon/free/premium × role orthogonality holds; entitlements gate the INTERFACE — the sim
  itself never reads tier, constitution law 3 untouched).
- **Managed credits** for non-BYOK usage, task-priced (interpret-session, construct-settlement,
  realm, brief, analysis, custom content, polish); margin telemetry via the analytics seam.
- **BYOK** included in Surveyor: $19.99 covers orchestration/validation/workflow; inference on
  their key; managed credits remain available alongside.
- **Founder (30 lifetime seats — the canonical cap)**: lifetime Premium + Surveyor core + BYOK;
  no unlimited funded inference; possible small allowance. (The 500-seat copy is a confirmed bug,
  fixed in F4.)
- Positioning line to carry through copy: "Other AI tools write what happens next.
  SettlementForge runs what happens next."

## 5. Evaluation + risks (operationalized)
Metrics ride the analytics seam: proposal acceptance rate, edit distance, invalid-op rate,
protected-constraint violations, undo rate, retained-change rate; eval sets split by campaign.
An invariant-preservation harness = the existing gate machinery run on branch worlds after
applied proposals. The seven risk classes in the owner's spec map to: schemas+validation
(hallucinated mechanics), conservative-diff rule + protected registry + previews + branches
(canon destruction), retrieval slicing + routing + BYOK (cost), the projection-feeding rule
(overtrust + leaks), ops-not-state + logged versions (determinism).

## 6. Sequencing vs the standing program
AFTER the fix program (owner ruling). Prerequisites already inside the fix program: Track K
completion (op layer), F2/G2 config-seam integrity, F3 read-model surfaces (brief bundles),
consentTier stamping, counterfactual.js mount decision, protected-entity locks (F1).
Stage 1-2 (analyst + briefs) are the recommended first Surveyor ship: read-only, immediately
valuable, monetizable, and they battle-test retrieval + routing before any write path exists.
OWNER DECISIONS QUEUED: Surveyor pricing final, allowance sizes, provider order, corpus
governance doc, the "Surveyor" name itself.
