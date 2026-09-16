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

## 2b. THE LAUNCH-WHOLE AMENDMENT (owner ruling 2026-07-17: "I want all the ai
## capabilities at launch") — the trust ladder converts from shipping gate to monitor
ALL stages (S1–S6, incl. the style-overhaul rung) BUILD AND SHIP AT LAUNCH. What changes and
what survives:
- SAFETY UNCHANGED: the schema wall was always the safety mechanism, not the ladder — every
  write stage compiles to typed ops through validation/preview/per-item approval; worst case
  remains a refused draft. Shipping whole adds zero world-integrity risk.
- THE LADDER BECOMES A MONITORING FRAMEWORK: the §5 metrics + the §3f rider instrument every
  stage from day one; PER-STAGE KILL-SWITCHES at the entitlement layer (server-side pause of
  any stage without deploy); write stages carry an honest "early access" register at launch
  until their live metrics mature. Evidence-before-confidence survives; it no longer blocks
  the door.
- SEQUENCING (prerequisite-driven, all pre-push): S3 session interpretation + S4 custom
  entities + S5 construction (compiles onto the instant-world composer) build NOW — edge/
  display lanes, engine-frozen-compatible, ROUND 3 reviews them; S4+ knobs build in the
  post-soak TUNING WINDOW (the knob registry mints there — "one enumeration serves both");
  S6 tuning counsel builds post-soak (the world-health evaluator library is born there);
  rung-3 packs V1 per capacity. Everything lands before THE VERY END = at launch.

## 2c. THE SURVEYOR SHELL (owner UX commission 2026-07-17: the floating access pattern —
## "a floating icon on the right side... opens up an appropriately sized text box... access
## to whatever is in that account's settlements and maps etc with default expectation of the
## page that they are in")
The access architecture, on the owner's backbone + the ambient layer:
1. **THE DOCKED PANEL**: floating sigil (right side, the Surveyor's compass) → a docked,
   resizable side panel (never a modal — the world stays visible mid-conversation); mobile =
   bottom sheet; Cmd+K palette shortcut as the power complement. Lazy chunk (S1's
   FloatingAffordances/AiAnalystPanel is the seed — this spec refines it).
2. **THE CONTEXT ANCHOR (the owner's page-default, formalized)**: every request carries an
   anchor (page scope + selected entity) — dossier ⇒ that settlement · realm dashboard ⇒
   realm · chronicle ⇒ the advance in view · map ⇒ viewport/selection. The anchor is VISIBLE
   in the panel ("Reading: <entity> · Week <n>") with a tap-to-change scope chip —
   transparency about what the AI sees (the §3c honesty made tangible). The state-slicers
   consume the anchor as the default retrieval scope.
3. **THE AMBIENT LAYER**: ask-here glyphs on every receipt/chronicle-beat/entity card (open
   the panel PRE-ANCHORED with the obvious question staged); SELECTION-AWARENESS (a selected
   NPC/institution pulses the sigil — one click anchors the ask).
4. **THE EMPTY STATE**: anchor + 3-4 suggested questions derived from READ-MODELS (zero AI
   cost until asked) + one-tap S2 brief shortcuts + credit balance.
5. **IN-PANEL LAWS SURFACED**: two-voices rendering (cited report / marked musings) ·
   audience toggle at top · per-question ESTIMATED CREDIT COST before send · §3d drafted
   proposals render as approve/edit/discard cards in-panel, landing in the docket like any
   decree (bias-to-the-form's UI). First-open whisper introduces the persona per the
   guidance register.
BUILD SLOT: rides the S3 wave (task #33 — it builds the review UI; the shell refinement
lands with it).

## 2d. THE PARLEY (owner commission 2026-07-17: "how do you think X would respond or how
## would X approach x topic? for NPCs, settlements, factions... not to commit the action but
## to give the DM an idea... or even have a conversation with them")
In-character consultation — the differentiator is EPISTEMIC FIDELITY, structurally enforced:
- **THE PERSONA COMPILES FROM READ-MODELS**: the entity speaks from its OWN belief slice
  (confidently wrong exactly as its rumor exposure made it; under D1 it has not heard what
  has not reached it — the slicer machinery enforces this like the audience rule, never a
  prompt), shaped by core personality + ACQUIRED traits (the Growth Layer), goals, alignment,
  relationship warmth/grievances, and D7 reframes (the curdled gift colors its stance on the
  asker). Settlements/factions speak collectively — the glue typology names WHO is speaking
  (seat vs patron) and the answer may carry internal dissent.
- **MUSINGS-REGISTER ONLY, NOTHING COMMITS**: pure read-side; every response clearly marked
  interpretation, never the record; the AI AUDITIONS the character, the DM remains the
  author (state-never-fate: the machine may guess at a soul, never decide one). GROUNDED:
  each response cites the traits/beliefs/reframes that shaped it (receipts under the
  roleplay). Multi-turn = a held persona anchor.
- **ACCESS**: a "speak with…" affordance on entity cards via the Shell's ambient layer +
  selection pulse; a new task class ('parley'), task-priced; DM-ONLY at first (the persona
  knows its own secrets) — a player-facing variant needs a beliefs-∩-player-safe compile
  (parked). Rider tags entity-class + topic-class (the atlas learns what tables rehearse).
- **THE TOTAL-GROUNDING LAW (owner amendment 2026-07-17: faction/power, deity, power
  rankings + rulings, economy, seasons, NPC relations — "all of that should factor into all
  of this. Make sure it is cohesive"): THE PARLEY READS EVERYTHING THE ENGINE READS** — the
  persona slice is a SUPERSET of the entity's engine-consumer census (the no-dead-facet
  walker's census, consumed in reverse; walker-checkable parity: any mechanism that begins
  reading an entity class automatically feeds its voice). THE MANIFEST, explicitly: faction
  membership + archetype + stance · sovereign/power allegiance + the HEGEMONY READ through
  the entity's fog (she ranks powers as her beliefs rank them) · standing rulings/decrees
  touching her settlement/institution (felt through the reframe layer) · the settlement's
  deity + doctrine courses + imposed-cult/heresy context · economy (prosperity, her
  livelihood's supply state, trade dependencies, blockade pressure) · THE SEASON + its
  pressures (harvest anxiety, winter road-dread) · the NPC web (patron/rival/kin/bloc edges,
  people-held vs seat-held). All cited under the response.
- **QUALITY**: consistency is guaranteed by grounding; aliveness is a taste problem —
  register guards + owner veto on the persona voice (the content-program bar).
Read-only ⇒ ships AT LAUNCH under §2b. BUILD SLOT: the S3 wave (task #33, with the Shell).

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

## 3b. THE TWO-VOICES LAW (owner amendment 2026-07-16: "It should also respond back to the
## user in conversation with ideas and expansions and clarifications where asked.")
The Surveyor CONVERSES — ideation, expansions, alternatives, and clarifying questions back to
the user are first-class, not just Q&A. One bright line keeps the honesty boundary intact:
**THE REPORTING VOICE and THE MUSING VOICE are visibly distinct registers.**
- REPORTING (what IS): citation-bound per the standing law; unsourceable ⇒ "the engine does
  not record this." Never speculative content in this register.
- MUSING (what COULD BE): clearly marked as suggestion (a distinct visual register in the
  panel + a distinct block in the answer contract — not a prose disclaimer); creative freedom
  is the point; NOTHING in this register lands in the world except through the standing typed-
  ops → validation → preview → approval lane. Clarifying questions to the user are always
  permitted (read-only conversation).
- The answer contract carries the split structurally (e.g. `report[]` cited + `musings[]`
  uncited) so the client renders them differently BY CONSTRUCTION — the register can never
  blur by prompt drift. Eval: register-purity joins the §5 metrics (speculation appearing in
  the report block = a scored failure).

## 3c. EXTRACTION DEFENSE (owner amendment 2026-07-16: "I don't want my architecture being
## deciphered by a cunning user using his AI. If we can protect and deter then yes.")
FOUNDATION (by construction, already true): the provider model NEVER sees the engine — no
source, kernels, formulas, tuned constants, or catalogs in any context; it reads DERIVED
read-model slices only. Architecture cannot leak through a door it never entered. HONEST
FLOOR (recorded): observable behavior is inferable — any player can reconstruct the
rulebook's outline by experimenting; the moat is execution depth, not concept secrecy; we
defend the gap between "can describe" and "can rebuild." THE DETER/DETECT/DENY STACK:
1. NOTHING-SECRET-IN-THE-PACKET policy: instruction packets (persona/rules/vocabulary) are
   treated as semi-public — a successful extraction yields nothing proprietary.
2. DISCLOSURE HYGIENE: the Surveyor declines to discuss its instructions, retrieval
   machinery, slice composition, or internals (soft deterrent, honestly labeled bypassable).
3. NAMING HYGIENE: user-facing citations use public receipt names ONLY — never internal
   module/system/file names; answers describe the world, not the software.
4. CANARY TOKENS: each account's packet carries a unique inert marker; leaked packet text is
   attributable to its account.
5. EXTRACTION DETECTION on the audit spine: aiOperationLog already records prompt hash +
   slice list per request — add pattern flags for systematic enumeration / meta-probing
   (frequency of instruction-seeking questions, breadth-scan signatures) → throttle + review.
   Probing is loud in a fully receipted system.
6. ECONOMIC DETERRENCE: task-priced credits make bulk probing expensive by construction
   (BYOK pays its own tokens but the per-request slice boundary still bounds exposure).
7. TERMS: systematic extraction / reverse-engineering prohibited in ToS — the action basis
   when the detector trips.

## 3d. THE ACTION-READINESS LAW (owner amendment 2026-07-16: "it should always be ready to
## take action where necessary and also be cordial and clear where it cannot.")
SCOPE CONFIRMED: the AI operates every door the human has — creation (S5 construction,
S4/S4+ custom content), realm management (the composer surface: all registered realm verbs,
force-as-proposal, the forecast, the mutable docket), post-creation edits (S3 session
interpretation, dossier ops, custom-content edits) — arriving in trust-ladder order, all
through the standing typed-ops → validation → preview → approval lane. Two halves:
1. **BIAS TO THE FORM.** When conversation surfaces an actionable intent, the Surveyor
   OFFERS THE DRAFTED ACTION (a compiled, previewed proposal — approve/edit/discard), not
   prose about it. Readiness = the draft is always one approval away; NEVER action without
   approval. In the musing register, ideas carry draft-affordances ("want this as a
   proposal?").
2. **THE GRACEFUL REFUSAL CONTRACT.** Every "no" is cordial, specific, and names the nearest
   door: the boundary in plain language (no op type exists / arrives at a later trust stage /
   DM-sovereign territory / validation failed because X / tier-gated) + what it CAN do
   instead. Extends the realm-veto-prose culture (W-R2-LIGHT's dark-gate refusals naming the
   preset + dialog path) to the AI layer. A dead-end refusal is a scored failure — refusal
   QUALITY joins the §5 evals alongside refusal rate.

## 3e. THE FORGETTING LAW (owner amendment 2026-07-16, adopted on the manager's shape:
## "any AI using this from my website has to delete their information after use")
The rented model retains NOTHING of a user's world beyond the request — enforced at the
three layers where it is REAL, never by prompt (a "delete after use" instruction would be
retention theater and is prohibited as a claimed mechanism):
1. **BY CONSTRUCTION (already true):** statelessness — each request is born with its packet
   and dies with its response; no provider-side conversation state, no memory features, no
   accumulation in a brain we don't own.
2. **BY CONTRACT (the floor, mandatory):** every provider must satisfy — inputs/outputs
   NEVER used for provider training + retention contractually bounded (zero-retention
   adopted wherever the provider offers it; bounded abuse-monitoring windows accepted and
   DISCLOSED until then). Verify current provider terms at implementation — never assert
   from memory.
3. **BY STRUCTURE (the immutable part):** retention posture is a FIRST-CLASS REQUIRED
   property of the provider adapter contract — `retentionClass: 'zero' | 'bounded' |
   'training'` declared per adapter; NO adapter registers without one (walker-pinned);
   routing enforces a floor (world-data classes never route to 'training'-class adapters —
   which are therefore banned in practice); BYOK surfaces the user's own provider's posture
   honestly rather than laundering it.
LOUD, NOT HIDDEN: the mechanism is invisible plumbing, but the COMMITMENT is public — the
privacy policy states it in plain sentences ("your world data is never used to train
provider models; provider retention is contractually bounded, zero where available; our own
audit records store hashes and slice lists, not your content"). PROMISES NEVER EXCEED
CONTRACTS: terms state the actual current floor and upgrade only when the paper does.
Our own side already complies in spirit: aiOperationLog stores hashes not content; the
training corpus is separately consent-gated opt-in (§3).

## 3f. THE ENRICHMENT RIDER (owner amendments 2026-07-16: capture-before-forgetting for
## analytics, the AI deciphers its own traffic, "enforceable even if the user is providing
## their own API... part of the contract of using our services")
Every Surveyor response carries a machine-readable ENRICHMENT RIDER beside the human answer:
controlled-vocabulary tags only — theme-dictionary ids, intent class, rung/extension tier,
refusal reason-class, action-drafted flags. The model tags its own traffic as a byproduct of
serving it (no second call; marginal tokens). Captured SERVER-SIDE in the edge function from
the response in transit — composing cleanly with §3e (the PROVIDER keeps nothing; WE keep
what this section and the consent planes permit).
**THE TWO CAPTURE LAYERS:**
1. CONDITION-OF-SERVICE (managed AND BYOK, non-togglable, ToS-disclosed): the ID-FREE,
   CATEGORY-GRADE rider only — service telemetry about the world-machine, never content,
   never free-text (out-of-vocabulary ⇒ 'other' + a dictionary-growth signal via the
   k-floored A2 process). This layer's id-free design is what makes the
   condition-of-service framing defensible — flag to the consolidated PRE-LAUNCH LEGAL
   CONSULT (with the founder-payout items) for the strict-jurisdiction conditionality check.
2. CONSENT-GATED (unchanged): content-grade capture — the corpus plane's full
   intent→result→correction→refusal records — stays separately opt-in per §3. The rider
   makes the consented corpus SEARCHABLE (collect-fine-aggregate-late).
**BYOK ENFORCEABILITY IS STRUCTURAL, not merely contractual:** keys exist only server-side
(§3), so every AI interaction — managed or BYOK — flows through the ONE edge path where the
rider is constructed and captured; there is no bypass to write a term against. The ToS
clause DISCLOSES what the architecture guarantees. BYOK honesty: rider token overhead rides
the user's key (negligible, <~1%) — disclosed in BYOK terms.
**THE CONFLICTED-WITNESS RULE:** self-emitted tags serve INTEREST data only (themes/intents/
refusal reasons — roughly-right-at-scale is the point). QUALITY metrics (citation coverage,
register purity, refusal quality) are INDEPENDENTLY scored (deterministic checks or a
separate grader) — a model self-reporting its own compliance never gates the trust ladder.
**HONEST BOUNDARY (recorded):** this binds every interaction through SettlementForge's
surface — total coverage of our own pipe; it cannot and does not claim to bind what users do
with exported data in outside tools.

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

## 7. TOKEN-EFFICIENCY DOCTRINE (owner commission, 2026-07-17; corpus entry)

"Optimize how AI is used to reasonably reduce any unnecessary spending of tokens" — without
giving up quality; user-visible AI cost is an adoption risk, hardest on BYOK (users watch
their own console). Seven levers, each vetoable:

1. **Retrieval slice budgets** — per-task-class slice budgets in the slicer registry;
   compact canonical encodings of read-model slices (stable key order, nulls dropped) over
   raw dumps; real prompt sizes measured per task class via the edge usage meter.
2. **Prompt-cache discipline** — static-first assembly (system prompt, op-registry tool
   schema, design corpus, lens definitions FIRST, byte-stable; per-request slices LAST) so
   provider prompt caching prices the schema wall once, not per call. Static-prefix
   byte-identity pinned per task class.
3. **Routing classes enforced as config** — fast/balanced/deep per task type (§3) becomes
   operator config, not convention; construction compiles use deep only where the
   comparator demands.
4. **Ops-not-essays** — structured op output, bounded max_tokens per task class; the
   compiler emits ops and labels, never prose padding.
5. **Delta revise loops** — S5/S6 revise passes send the comparator's deviations only plus
   minimal correction context; never full re-context. Pinned.
6. **Zero-AI-where-deterministic** — bundle assembly, validation, comparator judgment,
   suggested prompts stay pure code; the AI is called only for the genuinely generative step.
7. **Per-task token budgets + anomaly flags** at the edge meter (operator-visible overruns;
   user-facing estimates stay labeled estimates).

**THE QUALITY BAR (non-negotiable):** grounding-parity + citation-law pins stay green —
slicing never trims grounding below what the epistemic-fidelity law requires; §5 acceptance
metrics are the regression check. A lever that conflicts with quality is rejected and
recorded as a JUDGMENT.

**Commercial frame:** task-priced credits mean efficiency = house margin on managed +
visible cost relief on BYOK. **Execution:** S4–S6 born efficient (directives relayed
in-flight 2026-07-17); S1–S3 retrofit rides ROUND 3 as a named charge with an
ai-cost-efficiency survey dimension.
