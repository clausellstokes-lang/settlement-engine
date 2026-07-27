# DESIGN — THE AI CAPABILITY LADDER + CHARTER (queue item M43)

> **Status 2026-07-27:** SPEC + wave L-1 dispatched. Proposed ruling M43 (with two ↻ refinement
> rows) in docs/OWNER_DECISION_QUEUE.md (ledger tree); owner bid the lane open same day. Build
> staffing per MODEL SPLIT v3: Fable architects/validates (this doc), Opus implements each wave.
> **The pricing half ships INERT** — a paid-surface change stays owner-gated even under the
> standing delegation.

## 1. The two owner directives this implements

1. **No flattening:** different models must not share one ceiling; an Opus must not be capped
   to a Fable's ceiling nor vice versa. The finite-semantics law makes this safe: every AI
   output is a typed bucket the engine validates, so the FLOOR is uniform (weak models fail
   closed into `unsupported[]`), and the CEILING is free to vary — sharper inference, fewer
   clarification loops, richer multi-step composition; never different world-truth.
2. **Demonstrated, not declared** (owner follow-up, ruled in M43 ↻): a model's tier is
   assigned by a measured probe, never by introspective self-assessment and never by model
   name. This is independently required by the repo's own **conflicted-witness rule**
   (`docs/DESIGN_AI_CONTROL_SURFACE.md:280-284`): self-emitted tags never gate the trust
   ladder. What the model DOES self-direct is **spend within its earned ceiling** — how much
   headroom a given request deserves — with a credit-consent gate at the cost threshold.

## 2. Ground truth this design is built on (survey receipts, 2026-07-27)

- **13-surface machine-discovered roster** (`tests/security/aiSurfaceCensus.js:170`,
  floors `{edge:11, client:20, roster:13}`); three exact-set manifests already pattern this
  design's fourth (`AI_SURFACE_WALLS`, `SURFACE_FALLBACK`, `NON_AI_CLIENT_TRANSPORTS`).
- **Three model lists disagree and none imports another:** `ANTHROPIC_SUPPORTED_MODELS`
  (edge, 3 ids), `ROUTING_CLASS_MODEL` (client, 3 ids), `MODEL_PROFILES` (generate-narrative,
  8 profiles incl. OpenAI). The Deno↔src import barrier is the root cause; the two sanctioned
  workarounds are generated bundles and literal-mirror + drift test.
- **The chokepoint:** the identical `capturedModel = (providerKey.byok && pref &&
  ANTHROPIC_SUPPORTED_MODELS.includes(pref)) ? pref : DEFAULT` expression is copy-pasted
  across ~10 surfaces — one extraction away from a shared tier resolver. Precedence law to
  preserve (from `generate-narrative/index.ts:457-500`): preference is read from the **DB,
  never the request body**; operator forced-override sits at the top.
- **Tiers already work in one place:** `generate-narrative`'s profiles carry cost tiers with
  real credit-price differentiation (`narrative:5` vs `narrative_fast:2`) — generalize this
  outward, don't invent a parallel mechanism.
- **The cache synergy:** five Surveyor surfaces build documented byte-stable static prefixes
  and attach **no `cache_control`**; the one working cache implementation
  (`generate-narrative/promptCache.ts`) needed a 4096-token minimum prefix and a padding hack
  (`prompts.ts:1188-1197`). A charter block appended to those prefixes pushes them over the
  cache floor naturally — **a bigger charter is cheaper, not dearer, once `cache_control`
  is attached.**
- **Money law:** `spend_credits` in Postgres is the sole price authority (integer 1..12 band;
  new migration re-declares the whole body); `applyCreditCosts` is OFF and owner-gated;
  `tests/config/pricing.test.js` enforces three-way lockstep; panel costs are module-scope
  constants that must move inside components before any per-user multiplier can render.
- **The probe seam exists:** `surveyor-byok` `'verify'` action already has auth + session +
  IP-guard + entitlement + rate-limit + decrypt + timeout + classify + persist plumbing; the
  tier column slots beside `health` (mig-143 pattern); needs a bigger rate budget than one
  `consume_ai_generate_rate_limit` unit and its own timeout envelope.
- **No extended thinking exists anywhere on the Anthropic side today**; reasoning effort is
  OpenAI-only (`generate-narrative`). No per-model prompt differentiation exists anywhere.

## 3. Architecture (five pieces)

1. **ONE MODEL REGISTRY** — a generated `_shared/modelRegistryBundle.js` from
   `src/domain/modelRegistry.js`: every model id with `provider`, `retentionClass`
   (required — `registerProviderAdapter` throws without one), `tierClass` floor,
   cache-prefix floor, cost class. Collapses the three disagreeing lists; the literal
   mirrors keep their drift tests but now assert against the registry.
2. **THE CHARTER** — per-surface generated teaching block: role + laws (finite-semantics,
   legibility, address law), the surface's full bucket vocabulary (from the same builders the
   walls already trust), worked exemplars, output contract. Authored the repo's way:
   **generated from domain source, server-owned, hash-pinned** (`src/domain/aiCharter.js` →
   `_shared/aiCharterBundle.js`), byte-stable for caching. Appended to the five static
   prefixes WITH `cache_control` attached (generalizing `promptCache.ts`); retires the
   padding hack where the charter clears the 4096 floor.
3. **THE LADDER** — tier resolver extracted from the 10× copy-paste into one shared function:
   `resolveTier({byok, probeTier, registry, surface})` → `{model, thinkingBudget,
   multiStepPermitted, charterDepth}`. Managed keys: tier from the registry's measured class.
   BYOK keys: tier from the probe (§4). DB-read preference + operator override precedence
   preserved. Working tier names `scout / journeyman / master` — **naming is an owner taste
   pick** (P-register).
4. **THE PROBE** — new `'probe'` action beside `'verify'` in `surveyor-byok`: three canonical
   bucketing tasks (one construct config, one custom-content draft, one interpret op-set)
   with **deterministic grading** — the existing validators score pass-rate; no model
   self-tags (conflicted-witness rule). Result persisted service-role beside `health`;
   re-probe on model-version change. Probe spends no credits (mirrors verify); its own rate
   budget + timeout.
5. **SPEND-WITHIN-CEILING** — the self-direction half: surfaces at `journeyman+` may request
   an escalated pass (Anthropic extended thinking budget, or multi-step composition where the
   surface's disposition permits) when the model flags the request as deep; the escalation
   consumes the tier's credit price and surfaces through the existing
   `surveyor_usage_precheck` warn/cap machinery — never silent.

## 4. Wave plan (Opus implements; Fable validates each wave; full gate incl. lint/copy/store dirs)

- **L-1 — charter substrate — ✅ LANDED 2026-07-27 (Opus implementer; Fable-validated):**
  `src/domain/aiCharter.js` (467 lines, pure, lazy-only) + `tests/domain/aiCharter.test.js`
  (34 tests). Receipts: 34/34 green (implementer run + independent manager re-run); every
  exemplar EXECUTED against its real validator; collateral gates green (sizeBaseline,
  anyCast, rawColorLiteral, mutationCoverageManifest, localeCompareGuard, layerBoundaries);
  zero tracked-file edits, both files untracked-new by design (red-at-HEAD does not apply —
  no manifest entries owed; filename avoids E-A enumeration tokens). Charter sizes:
  customContent ≈4,487 est. tokens · autonomy ≈3,209 · interpret ≈1,333 · construct ≈1,159 ·
  styleOverhaul ≈1,132 — customContent alone clears the 4096 cache floor. Bundle wiring
  deferred to L-2 (recorded deferral, not a gap).

**L-1 amendment — ✅ CLOSED 2026-07-27:** the R-4 remediation gate caught what L-1's
collateral gates missed — `aiCharter.js` carried 23 em dashes, redding `tests/copy`
voice-mechanics (681 vs EM_BUDGET 670). Ruling (vetoable): STRIP, never raise the baseline
(monotone-ratchet law). Opus stripped all 23 (colon/period/comma rewrites, no hyphen
substitution, no encoding dodge); Tier-2 total 681→658; three structural-marker literals in
the test updated to match; final acceptance run 50/50 green (34 charter + 16 voice) executed
by the manager. Residual noted: the layer-wide `!` count sits exactly AT BANG_BUDGET 15 —
zero headroom for the next literal `!` anyone adds. The miss was the known wave-gate hazard
(full lint/copy/store dirs; L-1 ran lint-tier only).
**Standing L-wave law from this incident: every L-wave gate includes the copy/voice tier.**

**Recorded findings surfaced by L-1 (pre-existing defects, NOT introduced; out of L-1 scope):**
- **F-A `baseLens` seam — ✅ CLOSED 2026-07-27 (owner ordered the fix run):** `baseLens` added
  to the client wall's `KNOWN` set as recognized-and-stripped (vetoable ruling in the code
  comment; the alternative — honoring it as resolution base — stays owner territory since it
  would change what every existing bespoke style resolves to). Reproduce-first: the charter
  exemplar payload reproduced the spurious row before the fix, zero violations after
  (@enforced-by tests/design/townMapStyleWall.test.js, tests/domain/styleOverhaulCompile.test.js). Traced
  both sides: `styleRiderTags` is edge-only (radar untouched); StyleOverhaulPanel stops
  showing a "rejected" badge on every well-formed response. TWO pins landed: the literal
  contract-payload regression + a class-level parity pin binding `STYLE_FIELDS` (edge) to
  `validateBespokeStyle` (client) with a negative control — the next field-list drift reds
  structurally. 352+137 tests green (implementer) · 83/83 on the manager's combined
  acceptance run (both pin suites + all three bundle freshness suites, charter bundle
  regenerated after the wall edit, pre-existing bundles byte-restored to HEAD).
  Same sitting: the sibling aiGroundingBundle freshness import-check was hardened from a
  prose-fooled text search to the line-anchored structural check (negative+positive controls
  executed; the old check was RED on the real charter bundle — the defect was live).
- **F-B interpret `params` shape gap:** `interpretCore.ts:337` teaches `"params":{...}` with
  no shape, while `applyDispatch` spreads params into the event — real shape is `targetId` +
  `payload.{severity|importance|cause}` per `src/domain/events/registry.js`. The L-1 charter
  exemplar is now the only written-down statement of that shape for a model; L-4 attachment
  closes a genuine inference gap, not just a cost one.
- **L-2 — registry + wiring — SPLIT 2026-07-27 (manager ruling, vetoable), on observing the
  remediation lane wind down with heavy fold obligations recorded:**
  - **L-2a — ✅ LANDED 2026-07-27 (Opus built, Fable validated 102/102 on independent
    re-run):** `src/domain/modelRegistry.js` (10 model ids, 8 disagreement classes D1–D8
    recorded verbatim in its docblock — sharpest: **D1** generate-narrative serves
    `claude-sonnet-4-6` which the BYOK picker's allowlist refuses; **D2** haiku dated-vs-
    undated id seam at the copy-pasted `.includes()` chokepoint; **D3** OpenAI is invisible
    to the retention contract — no adapter registered, no retention posture recorded,
    TODO-OWNER), `src/domain/intentAtlas.js` + v0 empty distillate + 27-test id-free gate,
    both bundles generated (aiCharter 426KB/87 inputs; intentAtlas 2.6KB) with four-layer
    freshness tests. Tracked edits: exactly the two allowed; pre-existing bundle outputs
    byte-restored with hash proofs (the dirty `pendingEdits.js` red is FOREIGN and preserved).
    Implementer judgment calls (vetoable, recorded in module docblocks): haiku ids kept as
    separate entries (the seam L-2b must close stays visible); costTier-'standard' infers
    'balanced' never 'deep' (ceilings correct upward from evidence, per demonstrated-not-
    declared); `useCaseHint` dropped from Phase A (no use-case dimension exists to filter on;
    returns in Phase B); atlas returns `''` on unknown surface (absence is Phase A's normal
    state) while the charter throws. KNOWN REDS carried to fold: E-A totality names the three
    new enforcer-dir tests (entries land with their subjects at fold, headers say so
    verbatim); analyticsEventsBundle freshness red is pre-existing foreign WIP.
  - **L-2b — ✅ LANDED 2026-07-27 (owner-ordered with the deferred set; Opus built, Fable
    validated 23/23 at HEAD 848ba7cb):** assertion-layer unification as
    `tests/config/modelRegistryAgreement.test.js` (538 lines, 17 tests, one-file delta).
    Parses all three lists from source, asserts full registry parity (union of lists ==
    registry ids in BOTH directions; per-entry provider/retention/tier parity; the L-2a
    hand-written `sources` attributions recomputed and confirmed zero-drift), and pins every
    observable divergence with shrink-only semantics: a pinned divergence disappearing reds
    (silent resolution) and a new one appearing reds. All observed divergences map onto the
    docblock's D1–D8 — nothing missed; three extra detectors (routing-vs-picker,
    multi-provider ids, unreachable registry ids) are empty today and pinned loud. Seven
    negative controls executed (incl. fail-closed source-extraction: a renamed anchor throws,
    never green-on-nothing). NO list membership or runtime change — D1/D2 remain owner
    decisions. DEVIATION (vetoable, measured): filename uses `Agreement` not `Parity` —
    **E-A's NAME_PATTERN conscripts basenames containing `parity|contract|golden|coverage|
    freshness|pin|…` into the manifest spine even OUTSIDE the seven enforcer dirs**
    (measured red/green both ways); rename + manifest entry at a future fold if wanted in
    the spine. Residual (PLAUSIBLE, recorded): D6 means an env-var override can serve an id
    no literal carries — static tests cannot see it; closes with L-3's deploy-time check.
- **L-3 — resolver + probe — ✅ LANDED 2026-07-27 (two partitioned Opus implementers; Fable
  validated 78/78 + 92/92):**
  **L-3a:** `ai-analyst/modelResolver.ts` replaces the nine copy-pasted selection blocks —
  strictly behavior-neutral (D2's plain `.includes` DELIBERATELY preserved and pinned as a
  named test), tierClass exposed (null for unknown ids: guessing a rung is the flattening
  this program exists to prevent), and a two-sided census (`edgeModelDefaultsCensus`) so the
  copy-paste class cannot regrow — currently ONE named exemption (surveyor-byok's probe-model
  check, cross-lane; retire via `isSupportedModelPref()` at the fold, exemption then reds
  until deleted). Telemetry threading SKIPPED with evidence: no jsonb meta exists (typed
  columns only, migs 078/138); analytics-props route blocked by dirty-bundle entanglement —
  recorded deferral, thread `tier_class` beside `byok` when the analytics bundle regenerates
  from a quiet tree. Four negative controls executed.
  **L-3b:** mig `191_surveyor_probe_tier.sql` (columns + service-role setter + carry-ALL
  status redefinition) + `surveyor-byok/probeCore.ts` 'probe' action: three frozen exam
  tasks graded ONLY by the real validators (conflicted-witness made structural: graders
  never read rider/musings/confidence — pinned by source scan AND two executed cases: a
  self-deprecating correct answer passes, a confident wrong one fails); 3/2/≤1 passes →
  master/journeyman/scout (WORKING NAMES, owner taste). Probe = optional user button
  (spends the user's own provider tokens — their choice), no credits, per-task rate units,
  60s envelope. Client: tier chip + plain-sentence description ("never probed" is its own
  honest state, not the bottom rung). Exam frozen with a drift wall binding it to the live
  vocabularies. 13-test pglite suite runs the REAL SQL with an executed negative control.
  **⚠ REGRESSION FOUND + REPAIRED (behavior change, flagged not smuggled, veto = split it
  out):** mig 159's redefinition of `surveyor_byok_set` silently DROPPED mig 143's
  health-reset-on-rotate — deployed behavior lets a rotated key keep the prior key's
  `healthy` badge and timestamp. 191 recomposes the function carrying ALL deltas
  (139+159+143+probe-reset); the pglite suite now extracts NET-CURRENT definitions across
  the whole corpus (the structural cure for silent-drop-by-later-migration) and proves the
  stripped body leaves stale health standing. **This ships at the mig-train deploy — T9
  runbook should name it.**
  Recorded deferrals: `probe_version` not persisted (4th column = persistence-shape,
  owner-gated; recommend at fold) · probe never writes health (verify stays the authority) ·
  auto-re-probe on model change = resolver follow-up.
  ✅✅ **L-7a LANDED 2026-07-27 (Opus built, Fable validated 134/134 + 9/9 Deno):** mig 191
  amended in place (legal while uncommitted — M38-inverse argued in the header, expiring at
  commit): `probe_version` (closes the twice-recorded deferral) + `probe_profile` jsonb with
  a DATABASE-SIDE shape wall — the "verdicts, never prose" rule is enforced in Postgres (enum
  reason-classes only, bare-identifier keys, counts must match; executed negative control),
  not by caller convention, because a stored sentence would later be read aloud to a model as
  coaching it never earned. One atomic write: a profile can never outlive its tier.
  `_shared/modelCoaching.ts` renders the frozen sentence table (12 rows, byte-stable, '' on
  clean/absent/malformed; output always a subset of the file's own literals) — ZERO importers
  by design until L-WIRE. Two durable facts banked: a semicolon inside a multi-column ALTER's
  comment silently truncates the pglite extraction (⚠ NO SEMICOLON warning + truncation
  detector landed); `deno task test:edge` runs without --allow-read, so source-scan pins for
  edge code must live vitest-side. Fold-coupling note: the 191 pglite manifest kindNote's
  list is now incomplete (should also name modelCoaching.ts + its Deno test) — amend at
  L-WIRE.
  ↻ **PROBE v2 SPEC (owner idea 2026-07-27, "for you to consider" — adopted in refined form,
  Phase-B-coupled, NOT built):** the exam gains evidence-inference tasks derived from FROZEN
  atlas snapshots — an ambiguous request whose evidence-supported completion is COMPUTED by
  code from the fixture's weights; the model answers in typed buckets; pass = its choice
  lands in the computed set. Grading stays a pure function (the conflicted-witness rule
  forbids an AI judge — "interpreted well" without a computable key would be self-assessment
  in a trench coat). Structural tasks stay as the floor (validity); evidence tasks become the
  ceiling discriminator (journeyman/master separate on inference quality, which formatting
  tasks cannot see). Exam fixtures freeze per probeVersion — the second reason the
  `probe_version` column should land at the fold. Rejected half, recorded: AI interpretation
  inside the TEST SUITES themselves — gates stay deterministic in this house.
- **L-4 — cache attachment — ✅ LANDED 2026-07-27 (Opus built, Fable validated 116/116 +
  clean edge typecheck):** `_shared/anthropicCache.ts` (sealStaticPrefix = strip→pad→marker,
  one entry point so "exactly one marker at the end" is true by construction; 39 Deno tests)
  + charters injected into all five cores + the six shells send split content arrays.
  **Measured floor decisions (executed, production vocabularies):** customContent 6,459 and
  autonomy 4,805 est. tokens clear the 4096 floor UNAIDED (padding hack retired there — and
  the measurement CORRECTED the spec's own guess on autonomy); construct-settlement 4,447 /
  construct-realm 4,436 / styleOverhaul 4,435 / interpret 4,428 pad deterministically to
  target. Zero pre-existing prompt pins moved — proven by execution (77/77 unchanged, then
  extended to 85). New money-regression drift guard: a shell reverting to `content: prompt`
  reds `aiProviderAbstraction` (negative control executed). **F-B CLOSED behaviorally**
  (PIN 6: the interpret prompt now teaches targetId+payload shape with the worked literal).
  Marker-in-tail safety total (strip at cores + posted-vocab seal + first-occurrence-wins).
  Deferral recorded: unification with generate-narrative's promptCache is a
  delete-and-re-export later (marker literals kept byte-identical for that reason).
  **PLAUSIBLE→post-deploy:** the actual billed cache hit — verify with two consecutive live
  calls reading `usage.cache_creation_input_tokens` then `cache_read_input_tokens`; ADD TO
  THE POST-DEPLOY VERIFICATION RUNBOOK.
- **L-5 — pricing (INERT) — ✅ LANDED 2026-07-27 (Opus built, Fable validated 50/50):**
  mig `192_tier_credit_multiplier.sql` — `spend_credits(feature, p_profile, p_tier)` forked
  from the TRUE net-current body (**174, not the brief's 153** — the agent's corpus grep
  caught that forking 153 would have dropped mig 161's session belt AND reverted 174's
  pricing values, the exact 159-class accident; the lockstep pin is now STRUCTURAL, resolving
  net-currency dynamically instead of naming migration numbers in a comment that had already
  rotted). Multiplier from system_config `ai_tier_multipliers` (band 0.5..3, hard 1..12 clamp,
  NO seed row — absence is the inert state). Inertness MEASURED: two databases (pre-192 vs
  192 bodies) diffed across all 16 features — zero ledger drift; client side 60 cells (10
  features × 6 tiers) identical; counter-proof: a seeded 2× config doubles the debit. Five
  panels de-module-scoped (three of the brief's eight already called in-body). Activation
  checklist in the migration header: config seed + precheck extension (carry-ALL) + edge
  threading — **all owner-signed (M5)**. Hazard found + contained: the house net-current
  extractors use an UNANCHORED regex (a header quoting the create-function line in prose gets
  extracted instead of the function — fed Postgres 11k chars of English); own extractors
  anchored. ✅ CLASS CLOSED same sitting, twice over: the in-session fix anchored both
  money-path copies + added loud-failure shape assertions (a mis-extract now THROWS naming
  the cause; corpus parity 367/369 byte-identical, the 2 movers provably broken before),
  while the owner-started chip session concurrently anchored the 12 remaining sites and
  landed a standing walker (netCurrentExtractorAnchor, tests/lib budgeted in its
  denominator). Two lanes, zero collision, class extinct.

- **L-6 — THE FORMATIVE LOOP (owner ruling 2026-07-27: "the tests become part of the process
  for the AI rather than a barrier") — DISPATCHED, ships INERT:** overturns the surveyed
  "failed validation never re-prompts" fact by owner order. `_shared/repairLoop.ts`: draft →
  validator verdict (typed reason codes, the validators' own — conflicted-witness holds) →
  bounded repair re-prompt reusing the L-4 sealed cached prefix (repair rounds are nearly
  free) → merge (only validator-accepted repairs; still-invalid degrades EXACTLY as today) →
  cap/deadline. Tier dial `REPAIR_ROUNDS_BY_TIER` all-zero = inert; intended 0/1/2 at
  activation (batched with tier pricing, M5-adjacent; deep→master, balanced→journeyman,
  fast→scout). Rounds live inside the single credited call — the 7 runCreditedCall
  invariants untouched, pinned. The convergence: tier = persistence you pay for · cache
  makes repair cheap · repair traces are the atlas's and probe-v2's richest telemetry.

  **L-6 RECEIPTS — ✅ BUILT 2026-07-27 (Opus implementer; awaiting Fable validation):**
  `_shared/repairLoop.ts` (`runWithRepair`, `REPAIR_ROUNDS_BY_TIER`, `mergeByText`) plus
  `_shared/repairLoop.test.ts` (25 Deno tests, all green). All six compile surfaces wired;
  each core gained a `*RepairViolations` restatement of the verdict it already produced and
  a `merge*Compiled` fold, so the verdict stays beside the validator that issued it.
  **CONFLICTED-WITNESS MADE STRUCTURAL:** an entry survives a round only because the
  validator accepted it; the merge is RE-VALIDATED and discarded WHOLE if it carries a
  violation neither input carried (executed, with an honest-merge negative control); no
  decision in the loop reads a model-authored confidence, rider or musing, and a
  self-declared fix that fails the wall is an executed case.
  **INERTNESS MEASURED, NOT ASSERTED:** the per-surface pin runs the pre-L-6 expression
  (`compile<Surface>(answerText, vocab)`) beside the loop at zero rounds and compares the
  results for all five cores, every fixture carrying a real violation so the comparison is
  over a degrade path; exactly ONE provider call, and the prompt it receives is the base
  prompt byte-for-byte.
  **MONEY:** the loop runs inside `runCreditedCall`'s `callModel` window; the seven
  invariants are pinned untouched with THREE provider round-trips inside ONE credited call
  (`tests/edgeFunctions/creditFlow.test.js` 9 → 13 tests). Repair tokens sum into the SAME
  `ai_usage_events` row via a caller-owned ledger that survives a mid-loop provider throw.
  **STRUCTURAL PREVENTION:** `tests/edgeFunctions/aiProviderAbstraction.test.js` 30 → 60
  tests, over a set DISCOVERED from source (a shell that seals a cache prefix is a compile
  surface and must wire the loop), so a seventh surface cannot skip the formative path
  silently; five executed negative controls for the five predicates.
  **RECORDED DEFERRALS:** style-overhaul's EDGE verdict is STRUCTURAL ONLY (top-level
  fields the coercion dropped, using the client wall's own `unsupported_field` spelling);
  value-level style repair needs `validateBespokeStyle`'s verdict to reach the edge, which
  is a request-shape change and therefore owner-gated, and a second value checker on the
  edge would be the fork that drifts. Each shell keeps its own per-call AbortController AND
  relays the loop's round signal, so a round is bounded by whichever budget is tighter.

- **L-7 — THE FORMATIVE EXAM (owner ruling 2026-07-27: "the exam should feed into the actual
  model rather than only be a gate of choosing the model; related to the telemetry data where
  available") — L-7a DISPATCHED, L-7b QUEUED behind L-6:** the probe's per-task, per-reason
  texture (validator verdicts ONLY — enum reason-classes, no prose, no model output) persists
  as the model's profile (191 amended in place — legal while uncommitted/undeployed; also
  lands the twice-recommended `probe_version`), and a pure deterministic renderer
  (`_shared/modelCoaching.ts`) turns it into a short coaching block from a frozen sentence
  table — appended to that model's charter prefix (L-7b wiring, after L-6's lane clears).
  Population-level model-class evidence (exam + production repair traces, id-free) later
  joins under the SAME evidential floors as the intent atlas — a model-class weakness must
  clear the statistical bar before any coaching block asserts it. The full circle: telemetry
  shapes the exam (probe v2) → the exam measures the model → the measurement coaches the
  model → production traces refine the telemetry. Every arrow deterministic; nothing
  retained by any model.

## 4b. THE RECONCILIATION (owner ruling 2026-07-27: exam and validators must not become
redundant; every quality gate becomes part of the process; the goal is token reduction,
streamlining, coherence)

**One evidence stream, two entry points.** The atomic unit of truth is a VALIDATOR VERDICT
on a model's output (surface, reason-class, passed). The exam is validator verdicts on
synthetic work — it exists ONLY as the bootstrap for a profile with zero history, and runs
once per (key, model-version). Production — the walls + the L-6 repair loop — produces the
identical verdict shape continuously as a FREE byproduct (zero marginal tokens). Rules:
1. The exam NEVER re-runs while fresher evidence exists; re-fire triggers are exactly: new
   key · changed model version · long-dormant profile. No scheduled re-probing.
2. The tier is a LIVING measurement: seated by the exam, refined by production verdicts
   under the SAME evidential floors as the intent atlas (a tier moves only when evidence
   clears the bar — no flapping). Verdict records are forward-compatible with a `source:
   exam|production` tag; today's profiles are all-exam by construction, so no schema break —
   the tag lands with the population rollup (Phase-B analytics infrastructure).
3. Coaching blocks render from the UNIFIED profile; exam verdicts fade as production
   verdicts accumulate (volume/recency weighting under the same floors).
4. **Token economy of the whole layer (the owner's stated goal, tallied):** charter rides a
   cached prefix (~90% discount after first read) · a repair round costs only the tail while
   a user re-ask costs a FULL request — the repair loop is net token-NEGATIVE · evidence
   floors keep the atlas block minimal (no tokens on noise) · coaching asserts only
   demonstrated weaknesses (lines, not lectures) · the exam collapses to a one-time
   bootstrap of a stream production feeds free.
5. **Gates that STAY gates, deliberately:** entitlement, credits, consent, kill switches —
   rights gates, not quality gates; folding those into the process would be a hole, not an
   elegance.

## 4c. KNOWN SUBOPTIMALITIES (recorded 2026-07-27 at the owner's "is this the best?")
> ↻ SAME SITTING: the owner ordered all three FIXED comprehensively. Statuses: (1) L-9a
> schema substrate DISPATCHED (new-files-only; edge wiring rides L-WIRE). (2) Escalation
> design SIMPLIFIED while implementing: thinking room is a TIER PROPERTY (budget per rung,
> applied every call, provider bills only actual thinking tokens) — the two-pass
> "model flags itself deep" shape is REJECTED (spends a probe call, flirts with
> self-assessment); ships inert (all budgets 0) on the same activation switch as pricing +
> repair; lands in L-WIRE. (3) The quantization law below is now LAW; enforced in L-WIRE's
> coaching wiring. **L-WIRE = one consolidated pass over the surface files after L-6 + L-7a
> land:** tool-schema calls + parse-from-tool_use w/ fallback · thinking budgets ·
> coaching block + atlas block into prefixes (quantized) · surveyor-byok exemption
> retirement. One sweep, not three.

✅✅ **L-9a LANDED 2026-07-27 (Opus built, Fable validated 112/112):** `src/domain/aiOutputSchema.js`
(452 lines, 5 surfaces, every enum rendered from the live builders, deeply frozen) + 78-test
suite with six always-on negative controls (the machinery cannot go green on nothing). All
five charter exemplars validate clean; alien keys, out-of-enum values, over-deep nesting,
out-of-range severities all provably unbuildable. **EXCEEDS the §4c.1 prediction:**
`wrong_family` is killed too (discriminated oneOf per family — an executed test proves a
mis-tagged kind matches no branch); the repair loop's interpret jurisdiction is smaller than
predicted. **FINDING F-C (pre-existing, owner-relevant — the genre door):** the charter
teaches `glyphSet`/`seasonBias` from buildStyleVocabulary, but styleOverhaulCore's
STYLE_FIELDS omits both — the edge strips them, manufactures an `unsupported_field` verdict,
and L-6 would ask the model to repair a field the charter told it to use; genre flavor is
unreachable through the AI path. Fix = edge-side (add both to STYLE_FIELDS, F-A's direction:
the vocabulary is the truth, the narrower list is the bug) — **joins L-WIRE scope.**
Deferrals recorded in the module: reason-enum/style-ceiling mirrors pinned against same-tree
sources fail-closed; edge-side parity pins belong to L-WIRE.

1. **Constrained output at the API level (the highest-leverage unexplored candidate):**
   provider tool-use / structured-output schemas can make malformed-JSON and out-of-enum
   failure classes IMPOSSIBLE at generation time, at zero tokens — shrinking the repair
   loop's workload to purely semantic failures (wrong_family, wall rules), which the
   validators keep owning. Not in the L-waves because it changes the provider-call shape on
   every surface and interacts with the cross-provider path. Evaluate post-launch against
   measured repair-round reason-class distribution: if schema-expressible classes dominate,
   this wave pays for itself.
2. **Spend-within-ceiling (§3.5) remains unbuilt** — until escalation lands, tier
   differences are repair persistence + briefing depth, not deliberation room. The ladder's
   top rung is real but not fully load-bearing. Ships with the Surveyor-planning ruling.
3. **Coaching-cache quantization law (must be written before Phase B):** coaching blocks
   ride the cached prefix; profiles updating per-verdict would churn the per-model cache and
   leak the token thesis. LAW: coaching text re-renders only at threshold crossings
   (tier change, a reason-class entering/leaving the cleared set), never per verdict.
4. Standing caveat outranking all three: the layer is proven in vitro; cache economics,
   probe discrimination across real frontier models, and repair fix-rates are predictions
   until post-deploy receipts land (the runbook items recorded at L-4/L-3).

## 5. Owner-gated (never self-ruled)

Tier names/taste · pricing multiplier values + activation · probe crediting posture ·
provider order / OpenAI BYOK · `generate-chronicle` governance uplift (least-governed
surface; roster member) · Surveyor multi-step planning as the ladder's top rung (its own
ruling) · any golden-shifting interaction (none designed).

## 6. Non-goals (deliberate, documented)

- ~~A validation-failure repair loop ("cheap model drafts, dear model repairs")~~ —
  **OVERTURNED BY OWNER ORDER 2026-07-27** and BUILT as wave L-6 (§4). Kept here rather
  than deleted, because the reason it was a non-goal is still the constraint the build had
  to satisfy: it is new machinery, it needed its own ruling, and it had to respect
  `runCreditedCall`'s 7 invariants. It does, and they are pinned. The half that remains a
  non-goal is the SHAPE this line described: "cheap model drafts, dear model repairs" is
  cross-model routing, which nothing in L-6 does. A repair re-calls the SAME model with the
  SAME sealed prefix; a second model's opinion of a first model's output would be an AI
  grading an AI, which the conflicted-witness rule forbids in this house.
- Any change to the finite-semantics walls, the fallback totality contract, or engine
  behavior. Same confirmed buckets + same seed = same world on every tier — that sentence is
  the design's constitution.
