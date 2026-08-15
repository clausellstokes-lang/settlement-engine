# THE GAME-GRADE PROGRAM — goal-first architecture

> **Program state**
> - Re-architected 2026-07-24 after a live-tree review of the six product surfaces, with a fresh
>   code-level rebaseline of the Settlement Editor and the Herald.
> - This document supersedes the 2026-07-22 horizontal G-wave implementation plan. The identifiers
>   G-0 through G-6 are retained so old discussions and commits remain traceable; their contents and
>   order are replaced below.
> - The live worktree contains uncommitted work from other active efforts. Several translation and
>   editor-reachability fixes are visible there. This checkpoint describes the live working tree, not a
>   release: nothing is called shipped until it is committed and passes the release gate.
> - **Current checkpoint:** the G-1 local transaction foundation, G-2a Settlement Workbench proof,
>   G-3 canonical `RealmItem` read model, G-4a Herald command-brief proof, and the code-provable G-4b
>   source-parity, quiet-state, large-history DOM, critical-state accessibility, and forecast-honesty
>   slices are implemented behind default-off flags. G-2b, the lived/durable/browser portions of G-4b,
>   the broader G-5 query/continuity work, and the final G-6 re-audit remain open.
> - The implemented Game Grade editor transaction boundary is deliberately local and honest. It supplies typed intents,
>   preconditions, receipts, retained failure, owner/save isolation, and snapshot undo around existing
>   writers. It is not yet a durable cloud outbox, cross-save atomic transaction, or persisted receipt
>   ledger.
> - A fresh default-promotion audit is pinned in
>   `docs/GAME_GRADE_PROMOTION_CONTRACT.json`. Neither user-facing proof is ready to become the shipped
>   default. The contract keeps both defaults off until named parity, rendered, accessibility,
>   performance, durability, and lived-comprehension evidence closes. `realmItemShadowDiagnostics` is an
>   internal accounting surface and is default-off by design, not a future user-facing default.
> - The generator, belief-map, deity-pulse, and PDF golden changes were separately
>   adjudicated, owner-approved, regenerated, and reverified through their normal
>   tests. They are no longer parked failures; another ceremonial regeneration is
>   neither required nor permitted without a new intentional behavior change.
> - Repository-wide evidence is recorded by the executable gate and
>   `docs/CURRENT_STATE.md`, rather than freezing a transient dirty-tree test count
>   into this long-lived program document.
> - During implementation, unretained manual desktop and 390 × 844 mobile
>   orientation checks exercised the Settlement Workbench's stage → preview →
>   apply → receipt → undo loop, its honest unavailable-cause state,
>   desktop-only NPC authoring boundary, and the Herald's unauthenticated mobile
>   gate. No runtime error was observed in that session. Because no source-bound
>   render receipt was retained, this observation satisfies no rendered,
>   accessibility, device-parity, or promotion requirement.
> - The companion evidence ledger is `docs/GAME_GRADE_AUDIT.md`.

### Implementation checkpoint — 2026-07-24

| Wave | Live-tree state | What is proven | What remains |
|---|---|---|---|
| G-1 | Foundation implemented | Typed local intent/receipt contract; complete kind validation; stable NPC targeting; owner/save fences; stale, pulse, remote-write, save-switch, pause/advance, and mixed-result handling; exact-scope preview; snapshot undo | Durable outbox/idempotency ownership at the cloud writer, persisted receipts, offline recovery, and true cross-save atomicity |
| G-2a | Proof implemented behind `settlementWorkbench=false` | Contextual Entity Inspector over the existing dossier index; honest Why state; save-scoped Change Dock; staged NPC proof; preview/apply/receipt/undo; read-only and mobile capability boundaries | G-2b entity-family migration, five-second orientation, full capability matrix, persistence/reopen coverage, and default cutover |
| G-3 | Read model and shadow accounting implemented | Eight source adapters; stable identity and fingerprints; independent topic/time/workflow/epistemic/attention dimensions; immutable derivation; collision degradation; causes, actions, ranking, and read state; default-off diagnostics | Production telemetry, persisted per-user read state, broader old-save evidence, and promotion criteria |
| G-4a / code-provable G-4b | Proof implemented behind `heraldCommandBrief=false` | Briefing/Stories/Plans/Decisions shell; canonical six-class attention order; stable non-cycling lead; ranked reasons; cause and entity routes; operation-linked command descriptors; time lens; campaign-scoped route-away restoration; mobile companion; canonical proposal decision with commit-time revalidation and receipt; paused-advance Decisions routing; one front-page catch-up owner; terminal-decision chronology; executable specialist-source parity; named peaceful and 24-settlement/640-record fixtures; 40-card archive batches; critical-state accessible names; full-input forecast invalidation; named refusals and bounded forecast claims | Timed representative-GM triage, complete share/redaction matrix, full action accessibility and device journeys, browser timing budgets, durable receipts/reopen, and default cutover |
| G-5 / G-6 | Translation floor closed; broader slices remain | Confirmed raw tick, score, priority, settlement-size, relationship, trace, deity-axis, missing-reference, Herald fallback, and formula-copy leaks were reverified and translated without changing stored values or simulation behavior | Generator, Map, Realm remainder, Custom Content, Library continuity, final accessibility/performance/rendered re-audit, rollout, and removal of superseded routes |

These are vertical proofs, not a declaration that the complete game-grade program is finished. The
default-off flags preserve the legacy dossier and seven-door Herald while the remaining device,
durability, browser-budget, and lived-evidence work is completed.

The parity inventory is executable in `src/components/map/heraldCommandSourceParity.js`: Dashboard and
Wizard News remain reachable from Briefing, War/Faith/Trade retain their specialist bodies under their
Stories aliases, and Plans/Decisions retain forecast, docket, and adjudication ownership. The named
render fixtures live in `tests/fixtures/gameGradeHeraldFixtures.js`; they are read-model acceptance
fixtures, not simulation goldens.

## 1. The outcome

SettlementForge should let a time-pressured GM understand a living settlement, change it safely,
advance its world, and recover from mistakes without learning the engine's internal vocabulary.

The target is not "more panels" or "one implementation of every benchmark feature on every page."
The target is a coherent play loop:

> **Observe → Understand → Decide → Preview → Apply or Queue → Review**

The simulation is already the product's deepest advantage. The program makes that depth legible,
trustworthy, and usable. Content remains the hero. Complexity appears progressively and only when it
answers the reader's present question.

## 2. Doctrine

### The translation principle

**Meaning first, useful precision second, raw implementation tokens never.**

- Recorded causes become plain-language explanations, not modifier arithmetic.
- Named bands frame state before a number. Useful population, date, count, price, and delta precision
  remains available when it helps play.
- A raw identifier, enum key, tick, rule name, or fallback token is not acceptable user copy.
- Missing evidence is stated honestly. The interface must not turn "not recorded" or "preview not
  supported" into "no effect."
- Deterministic machinery may be theatrical where that is an explicit product moment, but it must not
  masquerade as an explanation of a result.

### The seven evaluation lenses

The seven machinery points remain the audit rubric. They are **evaluation lenses**, not seven mandatory
widgets or subsystems that every surface must acquire.

1. **WHY_ON_DEMAND** — a consequential displayed state can reveal its recorded causes in plain language.
2. **NAMED_STATES** — state is framed in meaningful words, with useful precision and duration where known.
3. **QUERY_WEB** — a useful named thing can lead to its dossier, context, or explanation without a hunt.
4. **FORECAST_BEFORE_COMMIT** — consequential choices show the most truthful available preview or warning.
5. **LENSES** — when one body of information supports several real questions, the view can reframe it.
6. **ORIENTATION** — the product identifies what changed, what matters, and what deserves attention next.
7. **VERBS_ON_ENTITIES** — legal contextual actions are reachable where their subject is understood.

A creation form does not need artificial "lenses" to improve a matrix score. A reversible prose edit does
not need a simulated forecast. A forecast does not need to invent a cause. Each point is applied only where
it improves the actual task.

### Non-negotiable laws

1. **THE PROMISE:** no change to RNG order, tuning, generated gameplay fields, or pulse outcomes from
   game-grade work. Prefer read-time or sidecar observability so the generated payload remains
   byte-identical. If a persisted observability field is unavoidable, it requires a separately approved,
   frozen whitelist; the same-seed semantic comparison may exclude only those named non-gameplay keys,
   while every gameplay field remains exact.
2. **No fabricated causality:** explanations use recorded causes or explicitly say why an explanation is
   unavailable.
3. **No outcome-changing simulation work by stealth:** new simulation rules require a separate owner
   decision. Additive, non-decisioning observability may be added when necessary to expose existing truth:
   stable subject IDs, cause receipts, durations, read state, source fingerprints, and presentation
   metadata are allowed when scoped, versioned, and tested.
4. **One authoritative writer per fact:** presentation adapters may derive a view, but they do not become
   shadow simulation stores.
5. **Proportionate ceremony:** the consequence and recoverability of an action determine its preview,
   confirmation, and receipt requirements.
6. **Recovery is part of the happy path:** consequential operations provide cancel, retained failure,
   receipt, and undo or an honest explanation that undo is unavailable.
7. **Stable identity over array position:** links and queued changes target stable entity references, not
   incidental render indexes.
8. **Content-first restraint:** avoid box soup, permanent explanatory chrome, decorative urgency, and
   multiple equal-primary actions in one region.
9. **Accessible by construction:** keyboard order, visible focus, touch reachability, non-color status,
   reduced motion, and screen-reader state are acceptance requirements.
10. **Migration before deletion:** old routes and write paths remain available until the replacement has
    behavioral parity, persistence coverage, and deep-link compatibility.

### Existing owner decisions

- The per-order marginal forecast in `RealmForecast` remains owner-gated. This program does not quietly
  turn it on.
- A pre-advance view is weather, not prophecy: it may show pressures, scope, staged orders, and decisions
  that will resolve, but it must not pretend an uncomputed outcome is known.
- Terrain-at-cursor forecasting remains deferred unless the map bridge acquires a truthful, supported
  per-cell read.
- The Herald's new information architecture is a migration hypothesis, not a mandate to rewrite its voice
  or discard the shipped reporting system.

## 3. Behavioral task contracts

The program is judged by complete tasks rather than by component counts.

### Settlement understanding

Within five seconds of opening a saved settlement, a GM can answer:

- What settlement is this?
- What is under pressure or changing?
- Is anything authored, staged, queued, failed, or awaiting review?
- Where should I look next?

### Settlement change

A GM can select a meaningful entity or field, understand its present state and provenance, make a legal
change, see the appropriate preview, apply or queue it, receive a truthful result, undo where supported,
and reopen the save without ambiguity.

### Realm briefing

With 20 or more settlements, a GM can identify the top three items that require attention, understand why
each was prioritized, reach recorded causes or an explicit unavailable state and affected entities, and
take a legal action where one exists without reconstructing context in another disconnected desk.

### Advance and review

Before advancing, the GM can see the interval, scope, staged orders, endangered or lapsed orders, and
decisions due to resolve. After advancing, the product explains what changed, what resolved, what is new,
and what now requires a decision.

### Cross-surface continuity

The same entity retains one identity and name across dossier, Herald, map, Library, export, persistence,
and reopen. Canonical facts agree; their ranking and presentation may differ when the surface serves a
different task.

## 4. Shared semantic contracts

These contracts establish vocabulary and boundaries. They are not permission to build a universal
framework before a vertical slice proves the need.

### `EntityRef`

A stable, serializable reference to a subject:

- entity type;
- stable entity ID;
- owning save or campaign ID;
- optional route hint for compatibility, never as identity.

Identity equality uses only type, ID, and owner. Version and source fingerprint are freshness
preconditions on a view or intent, not part of identity. No new workflow may use an array index as
durable identity.

Legacy records without a stable ID use a deterministic read-time surrogate derived from immutable source
context, never a random backfill or an array index. A collision degrades to readable, non-interactive
content and emits a diagnostic. If persisted backfill later proves necessary, it is a separately approved,
idempotent, versioned migration with export/import preservation and old-reader compatibility.

### `CauseReceipt`

A view of already-recorded causal evidence:

- root record ID;
- ordered or graph-linked cause records;
- subject and affected `EntityRef` values when known;
- in-world time;
- provenance;
- an explicit `available`, `partial`, `degraded`, or `unavailable` state with a reason.

It does not infer a cause from correlation and does not persist a second causal history.

### `ChangeIntent`

A **small serializable envelope over an existing domain writer**, not a universal transaction engine:

- stable intent ID;
- primary target `EntityRef`;
- preconditions for every affected target: `{ targetRef, baseRevision or sourceFingerprint }`;
- kind class: `authoring`, `mechanical`, or `world`;
- scope: `save`, `campaign`, or `cross-save`;
- execution policy: `immediate`, `canon-queue`, or `next-pulse`;
- delivery policy: `direct` or `outbox`;
- lifecycle status: `draft`, `staged`, `applying`, `queued`, `applied`, `failed`, `stale`, or `reverted`;
- kind and validated payload;
- last-observed availability and refusal reason;
- preview policy and domain adapter ID;
- affected save IDs;
- apply adapter ID;
- recovery and undo policy.

The envelope does not absorb domain permission rules, duplicate the domain operation, or promise
cross-save atomicity that the persistence layer cannot provide. Cross-save work must list the affected
saves, preflight and commit-time revalidate every target precondition, and report per-target results and
partial failure honestly if atomicity is not supported.
The serialized value contains no store imports, dispatch functions, React callbacks, or other executable
state. Domain-local capability providers resolve its adapter IDs.
Availability is an observation, not durable permission: the provider revalidates capability and freshness
immediately before apply.

### `ChangeReceipt`

The structured explanation of an attempted change, persisted when its timing or recovery requires it:

- what applied;
- what is waiting for canon or a pulse;
- what failed or became stale;
- affected entities and saves;
- resulting version or snapshot;
- preview-to-apply correspondence;
- undo availability and expiry.

Failed intents remain actionable. A queue must not silently clear an item merely because a neighboring
item succeeded.

Receipts project existing snapshots, action results, outbox entries, and campaign records wherever
possible. Any new persisted receipt metadata must name one owner, schema version, user/save scope,
retention rule, rollback behavior, and old-reader fallback. It may not become a second event store.
`intentId` is the idempotency key at the authoritative writer. A replay after an ambiguous network result
returns or correlates to the existing receipt. The writer or coordinator persists the idempotency claim
before execution, and a partial retry executes only targets not already receipted as applied.
The first canon-event vertical makes that distinction visible in its initiating review: a confirmed
durable result is replayed only to restore its projection and receipt; a missing atomic journal row
permits the exact original command and original attempt timestamp to retry; an unresolved row permits
neither. This is bounded same-session recovery, not yet a product-wide reopen inbox.

### `RealmItem`

A **derived read envelope with a kind-specific payload** over an authoritative source record:

- stable derived identity and source fingerprint;
- source class and source-specific record kind;
- primary editorial topic plus secondary tags;
- effective temporal phase: historical, current, emerging, or planned;
- resolution state: unresolved, resolved, dismissed, or superseded;
- operational condition where applicable: active, endangered, lapsed, completed, or cancelled;
- workflow kind: report, order, proposal, verdict, or projection;
- epistemic class: recorded fact, pending decision, staged order, or computed projection;
- attention class, including whether the item is blocking;
- urgency and significance as separate facts;
- attention reason;
- subjects and affected entities;
- cause receipt;
- legal action descriptors;
- kind-specific source payload.

`RealmItem` is not a new persisted canonical store and not a flattened mega-type. Pulse records, Wizard
News, proposals, pauses, docket orders, and stressors remain authoritative. Forecasts are ephemeral
projections over authoritative inputs. Source adapters derive items, preserve provenance, and deduplicate
only when identity proves two projections represent the same event.

Read state is not shared campaign truth. It begins as optional session-local presentation state keyed by
source identity. Persisting it later requires a versioned per-user metadata owner. Computed projections
also carry their input fingerprint, generation revision, validity horizon, and epistemic class so they
cannot deduplicate into recorded history. Every legal action is revalidated at invocation time.

### `AttentionFact`

Shared facts may include urgency, significance, unresolved workflow, lapse risk, active pressure, recency,
and recorded cause. The Herald, map, and Library may rank those facts differently because their tasks
differ. "Canonical attention" means shared evidence and vocabulary, not byte-identical ordering.

### Domain-local capability descriptors

Each domain remains responsible for legal actions and refusal reasons. Domain-local resolvers may expose
small UI-neutral descriptors such as action ID, label, subject, availability, refusal reason, and adapter
key. There will be no cross-layer `entityVerbs` registry that owns permissions, store dispatch,
navigation, and component callbacks for the whole product.

## 5. Settlement Workbench target

The product-facing name may remain "Settlement Editor." "Settlement Workbench" names the architecture:
the dossier is the work, and tools gather around the selected subject.

### Current truth

The live editor has valuable organs worth preserving:

- a rich dossier and entity-link web;
- a working NPC-secret prose-authoring pattern with generated-value provenance, plus a wider latent field
  registry that is not yet live;
- pending edits and cascade receipts;
- NPC lifecycle actions;
- Event Composer and its preview/apply pipeline;
- relationship cascade, operation registry, snapshots, and linked-save helpers.

The problem is ownership, not absence. The current page combines several incompatible write paths, places
a long tool stack before the dossier, and sometimes separates an action from the control that can finish
it. Queue validation, scope, partial failure, and mobile completion are not yet one trustworthy story.

### Target composition

**Desktop**

1. Optional dossier outline, deferred from the first slice until navigation testing proves it useful.
2. Dossier canvas as the primary reading surface.
3. Contextual Entity Inspector beside the dossier.
4. Save-scoped Change Dock outside the scrolling article.

**Mobile**

1. Dossier remains the default.
2. Entity Inspector opens as a bottom sheet or focused full-screen view.
3. Change review opens as a reachable full-screen flow.
4. A user who can initiate an action can finish, cancel, or recover it on the same device.

The previously proposed permanent right-rail Workshop in `docs/UX_OVERHAUL_PLAN.md` is superseded where
it preserves a separate edit-mode prelude. Useful tools may be reused inside the contextual inspector or
Change Dock.

### Three task views

- **Read** — generated and authored canon, current pressures, relationships, and story.
- **Author** — editable copy, provenance, differences from generated text, and editorial undo.
- **Consequences** — staged changes, affected entities and saves, recorded causes, receipts, and forecast.

The existing dossier tabs remain navigation. They are not relabeled as lenses merely to satisfy the
rubric. These task views need not become three permanent global modes: Author may be entered at a field,
and Consequences may appear contextually in the inspector or Change Dock.

### Entity Inspector

Selecting an NPC, faction, institution, pressure, hook, or editable field should preserve dossier context
and reveal only the relevant layers:

1. **Story and state** — what it is and what state it is in.
2. **Why** — recorded causes or an honest unavailable state.
3. **Connections** — related entities and useful destinations.
4. **Actions or edit** — legal actions, refusal reasons, and the appropriate authoring path.

Not every mention becomes a link. A link is warranted when a stable target exists and the destination
helps the present task.

### Change classes

| Class | Examples | Required ceremony |
|---|---|---|
| Authoring | prose and notes with no identity or rule role | explicit saved state, inline diff, provenance, easy undo; say that it does not alter the simulation |
| Mechanical | NPC facet, table membership, structural value | validate, stage, exact preview where possible, apply, receipt, undo/reopen coverage |
| World action | ransom, rescue, recall, decree, realm order | legal gate, timing, queue or immediate result, world receipt, post-pulse review |
| Cross-save | rename/link/cascade across canonized saves | enumerate saves, preflight, state atomicity limits, retain and explain failures |

Preview and apply should use the same pure operation path where one exists. A best-effort impact summary
must be labeled as such; it is not promoted to an exact forecast through copy.
Identity-bearing settlement or NPC renames are mechanical or cross-save according to phase and scope,
even when the visible operation looks like editing text.

### Change Dock

The settlement Change Dock is a projection anchored to the active save. It owns the visible lifecycle of
save-local work:

- authored and saved;
- staged for review;
- queued for canon or pulse;
- applying;
- applied;
- failed or stale;
- undoable.

It may group by source surface, but a table-only view must not commit or discard unrelated NPC work. Scope
is explicit in both the action label and the operation. Authoring and world actions may appear in the
same dock, but they remain separate lanes. The dock must not imply that they form one atomic batch or
offer an unscoped "Apply all."

Campaign realm orders remain authored and owned by the Herald docket. A cross-save intent has one
authoritative coordinator and receipt; affected settlement docks may show read-only projections of its
status but never become competing writers.

### Review epistemology

Every review surface identifies which of four claims it can honestly make:

1. **Exact deterministic diff** — preview and apply use the same pure operation path.
2. **Deterministic scope review** — the affected records are known, but the eventual world result is not.
3. **Directional outlook** — recorded pressure supports a trend, with an explicit uncertainty boundary.
4. **Unavailable** — the product states why no trustworthy preview exists.

Only consequential actions require a forecast or scope review. Authoring changes require a visible diff,
saved state, provenance, and recovery, not simulated prophecy. Coarse cascade counts are never labeled as
exact consequences.

## 6. Herald target

The Herald keeps its name, voice, cause walk, address chain, Wizard News story arcs, forecast, docket,
honest empty states, and newspaper sensibility. The goal is to turn strong but scattered organs into a
command briefing, not to replace them with a generic dashboard.

### Current truth

The current seven peer destinations mix several different axes:

- topic: War, Faith, Trade, Events;
- time and planning: Divination;
- workflow: Adjudication;
- summary: Dashboard.

The visible feed is not yet one complete realm read model: pulse history and live stressors drive the
main feed while Wizard News, proposals, paused verdicts, and docket orders enter through separate paths.
Filtering, counts, "while you were away," routing state, and mobile access therefore disagree at the
points where orientation matters most.

### Information-architecture hypothesis

The migration target is four task-oriented destinations:

1. **Briefing** — requires your word; changed since the last advance; happening now; building next.
2. **Stories** — the complete archive. War, Faith, Trade, Civic, settlement, provenance, time, and
   severity become filters or tags.
3. **Plans** — pressure outlook, staged orders, detailed forecast, docket, and Advance Realm context.
4. **Decisions** — a persistent inbox for proposals, paused verdicts, lapsed orders, and resolved history.

This is a hypothesis to prove behind compatibility adapters and a reversible migration flag. It does not
authorize a big-bang content rewrite. `heraldRouting.js`, current section IDs, and existing deep links
remain supported until parity and migration behavior are pinned.

The initial compatibility mapping is explicit:

- `dashboard` → Briefing;
- `war`, `faith`, `trade`, and `events` → Stories with the matching topic filter;
- `divination` → Plans;
- `adjudication` → Decisions.

The existing topic tabs may remain as visible filter aliases during rollout. Topic classification remains
independent from temporal and workflow state; the program does not repurpose the current `section` field
to mean the new navigation axis.

Stage the Road belongs with map tools. Timelapse belongs in Stories or Archive. A ticker is optional
polish after attention routing works.

### Attention order

The default Briefing ranks categories, then explains the reason:

1. blocking decisions;
2. endangered or lapsed orders;
3. critical active conditions;
4. new major changes;
5. emerging outlook;
6. routine record.

Urgency is not significance. A significant resolved war may belong high in Stories but below an urgent
proposal in Briefing. A peaceful realm should remain quiet rather than manufacturing ornamental alerts.
Within each class, ordering is deterministic: severity or deadline first where applicable, then in-world
time, stable source identity, and a documented final tie-break. Identical state produces identical order.
Merely opening an item does not change canonical priority; any future per-user read-state demotion must be
an explicit, separately tested presentation rule.

### Stable case anatomy

Where the source supports it, a story or decision case provides:

- named topic and state;
- in-world date or interval;
- headline and named subject;
- what changed;
- why it changed;
- who or what is affected;
- what happens if untouched, only when honestly knowable;
- one contextual primary action;
- routes to dossier and map;
- result or resolution receipt.

"Act" opens a prefilled, legally gated flow. Cards do not spray every possible verb. Adjudication becomes
an always-visible workflow and contextual action, not a silo the reader must reconstruct by hand.

### Mobile companion

Mobile should support reading the Briefing and Stories, reviewing the docket, completing a decision, and
returning to the originating story. Full map manipulation may remain desktop-only; withholding the entire
realm reading and decision experience is not the target.

## 7. Finding ownership

No finding may survive because a representative happy path happened not to exercise it.

| Evidence family | Delivery owner |
|---|---|
| Editor queue validation, scope, failure retention, stable targeting, stale prop refresh, role/goal write-read parity, and live writer inventory (`C-SED1`–`C-SED8`) | G-1 |
| Editor information architecture, preview claims, panel parity, entity migration, and cutover (`C-SED9`–`C-SED10`) | G-2a/G-2b |
| Herald source coverage, identity, independent dimensions, decision inclusion, and attention reasons (`C-HER2`–`C-HER5`, `C-HER10`) | G-3 |
| Herald navigation, duplicate summary ownership, advance/paused routing, mobile workflow, forecast honesty, chronology, contextual actions, and receipts (`C-HER1`, `C-HER6`–`C-HER9`, `C-HER11`–`C-HER13`) | G-4a/G-4b |
| Reverified editor translation | G-1/G-2 when each writer/card is touched |
| Reverified Herald translation (`V-HER1`–`V-HER9`) | G-3/G-4 when each source/card is normalized |
| Generator, Map Editor, Realm, and Custom Content blockers and translation findings | G-5 surface slice after G-0 revalidation |
| Global translation and degraded-state closure | G-6; no known leak may be deferred past completion |

G-0 reclassifies the historical numeric findings under the new doctrine. A labeled percentage, score, or
count may be useful precision; a raw token, formula term, or misleading computed claim remains a defect.
Every reverified non-focus safety finding must be closed in its G-5 slice or explicitly deferred through a
separate owner decision with rationale. Re-audit alone is not a fix.

## 8. Delivery program

Each wave is a complete, reviewable increase in user capability. Visual overhaul follows correctness and
semantic ownership, not the reverse. The Workbench and Herald use independent migration flags so either
surface can ship, roll back, or pause without coupling the other.

### Common gate for every implementation wave

Every merged G-1 through G-5 sub-wave, entity-family migration, source expansion, surface slice, and
cutover requires:

- focused unit, integration, persistence, and rendered scenarios proportional to the wave;
- full `npm run check`;
- build and distribution verification;
- size-budget and lazy-boundary comparison against the recorded G-0 baseline;
- same-seed semantic projection and pulse-outcome parity;
- an updated progress block and evidence ledger.

G-6 is the final aggregate gate, not the first time intermediate work receives repository-wide
verification.

### G-0 — rebaseline and safety floor

**Thesis:** begin from the live product, not stale findings.

**In scope**

- Rebase the audit against the current checkout and distinguish committed baseline from dirty-tree work.
- Mark every prior finding `resolved`, `partial`, `open`, `stale`, or `not reverified`.
- Reclassify historical numeric findings as useful precision, misleading machinery, or unresolved
  translation; do not mechanically preserve the old violation count.
- Freeze the task contracts, mutation vocabulary, attention vocabulary, and degraded-state language.
- Freeze named fixtures for fresh, peaceful, active, decision-heavy, old-save, 20-plus-settlement, and
  large-history states; record expected attention IDs and deterministic tie-breaks.
- Record the human comprehension protocol and exact first-paint, bundle, DOM, render, interaction, and
  large-history budgets used by later waves.
- Add old-save identity fixtures and decide, per source family, deterministic surrogate versus a
  separately approved persisted backfill.
- Verify that any action currently reachable on mobile can also be completed or safely cancelled there.
- Disable mobile enqueue affordances that cannot yet reach review, commit, discard, and recovery; do not
  expand mobile authoring accidentally while closing the dead end.
- Resolve or temporarily disable dangerous queue-scope contradictions.
- Run the authoritative repository gate and record parked or flaky failures separately from regressions.

**Not in scope**

- A new editor shell.
- A new Herald information architecture.
- New simulation outcomes.
- Broad prevention walkers over behavior that is not yet architecturally true.

**Exit**

- The current sections describe the live tree truthfully and historical sections are unmistakably marked.
- No mutating action can be initiated in a device, phase, or permission scope that cannot also finish,
  cancel, or recover there. A disabled action may explain where the capability is available.
- The four previously parked golden shifts are separately explained and approved;
  the full gate reaches build and distribution verification.
- Baseline gate, budget, bundle, fixture, and rendered-state evidence are recorded.

### G-1 — settlement transaction spine

**Thesis:** make change trustworthy behind the current interface before moving the interface.

**In scope**

- Inventory every writer family and adapt the four representative flows in this wave to the minimal
  `ChangeIntent` and `ChangeReceipt` envelopes. Every other family receives an explicit G-2b migration or
  retained-legacy row.
- Validate complete payloads and stable targets before queue entry.
- Bind each intent to save/version or source fingerprint.
- Make commit and discard scopes explicit.
- Repair the table-ledger/global-queue ownership mismatch.
- Repair store-to-open-dossier refresh so a successful queued mutation becomes visible in place rather
  than leaving `detail.settlement` stale until reopen.
- Make NPC role and goal writers update the same translated fields the card reads.
- Define and pin the phase/capability matrix for unsaved draft, saved draft, canon-unbound,
  canon-clock-bound, owner, public/player, offline/outbox, advancing, and paused states.
- Choose and document per-operation atomicity. Where atomicity is unavailable, keep failed work and show
  exactly what succeeded.
- Establish preview/apply parity for one representative mechanical operation. Event Composer is exact
  only for direct application; a clock-bound next-pulse path is an isolated scope review unless it
  simulates the intervening queue and world state.
- Cover commit, receipt, undo, persistence, reopen, stale source, and mobile completion.

**Not in scope**

- Replacing domain writers with one generic executor.
- Cross-save atomicity promises unsupported by persistence.
- Moving every existing editor control.

**Exit**

- One prose edit, one NPC mechanical edit, one table change, and one NPC world action complete through a
  truthful lifecycle without clearing unrelated or failed work.
- The committed NPC change updates the open dossier immediately, uses reader-facing language after apply,
  and remains correct after reopen.

### G-2 — Settlement Workbench vertical slice

**Thesis:** prove the dossier-centered interaction before broad migration.

#### G-2a — proof slice

**In scope**

- Ship the Entity Inspector and Change Dock behind a reversible surface flag.
- Complete one NPC journey end to end:
  select → understand → trace → act → preview → apply or queue → receipt → undo or pulse review.
- Complete one prose field and one cross-save-aware change through proportionate paths.
- Establish the Read, Author, and Consequences task views without forcing global mode changes.
- Inventory every current edit-mode panel and map it to canvas, inspector, dock, contextual tools, or
  retired-with-rationale before removing the old prelude.
- Preserve the old editor prelude until feature, mobile, keyboard, and persistence parity are demonstrated.

**Not in scope**

- Migrating every dossier entity in one pass.
- Forcing cause depth where the engine recorded none.
- Turning every noun into a button.

**Exit**

- The G-2a-tagged Settlement Workbench scenarios in section 9 pass on their declared capability targets.
  Every action offered on mobile passes its complete mobile journey.
- Whenever non-baseline work exists, its state is discoverable without a deep hunt; the zero-change state
  adds no permanent status chrome.

#### G-2b — controlled expansion and cutover

After the proof slice, migrate one entity or writer family at a time. The inventory must explicitly map
System State, coherence, Event Composer, intentions, timeline, regional impacts, provenance, linking,
network effects, rename, versions/history, factions, institutions, pressures, hooks, and every live prose
writer to canvas, inspector, dock, contextual tool, retained legacy surface, or retired-with-rationale.

Each migrated family receives its capability-matrix, translation, stale-source, persistence, keyboard,
and supported-device scenarios. The old editor shell remains available for any unmigrated capability.
During the rollout, new receipts and identity metadata are additive and versioned; an old reader ignores
them safely. Required rollback proof is:

> create and apply under the Workbench → switch the Workbench flag off → reopen in the old editor with no
> loss, duplicate application, or corrupted queue.

The old render shell may be removed only when the inventory reaches parity. The stable data and route
compatibility it depends on are not removed merely because the new shell is ready.

### G-3 — canonical realm-item read model

**Thesis:** unify evidence before changing the Herald's doors.

**In scope**

- Inventory pulse records, live stressors, Wizard News, proposals, paused verdicts, docket orders, and
  projections, but prove the envelope first with one actionable family (proposal/paused verdict) and one
  narrative family (pulse or Wizard News).
- Derive `RealmItem` envelopes without replacing or mutating source records.
- Establish source identity, deduplication rules, attention facts, session-local read state, and routeable
  context.
- Use source-specific stable origin keys; prove that two same-kind, same-tick records cannot collapse.
- Preserve current section mapping through compatibility adapters.
- Render parity diagnostics behind the existing Herald before switching information architecture.
- Keep computed forecast projections out of recorded Stories in this slice. Their later Plans adapter must
  carry run fingerprint, generation revision, validity horizon, and stale invalidation.

**Not in scope**

- A persisted second event store.
- Flattening every source into one lowest-common-denominator schema.
- Fabricated subjects, causes, or consequences.

**Exit**

- Every pilot source record is accounted for as one item, a provenance-preserving proven merge, a stable
  sub-item expansion, or an explicit exclusion.
- No pilot proposal or paused verdict is omitted from resting attention counts.
- Duplicate/collision/source-disagreement fixtures fail tests. Production degrades visibly, preserves the
  underlying record, and emits diagnostics rather than crashing or silently dropping it.

### G-4 — Herald command-brief vertical slice

**Thesis:** reorganize around GM decisions while preserving the Herald's character.

#### G-4a — proof slice

**In scope**

- Ship Briefing, Stories, Plans, and Decisions behind a reversible migration flag.
- Keep the proof flag off by default and out of normal navigation; G-4a does not switch the user default or post-advance
  route while non-pilot sources remain outside the new views.
- Complete one decision-required case and one non-actionable story end to end.
- Resolve proposal/verdict/order actions through revalidated action descriptors, write one authoritative
  receipt, and update every projection exactly once.
- Give every prioritized item an attention reason.
- Prototype post-advance landing inside the flagged shell with decisions visible at rest.
- Make view, item, focus, filters, and return route restorable.
- Preserve search, time lens, inspector size, back/Escape behavior, scroll position, and every existing
  `openInspectorAt(...)` caller through the compatibility layer.
- Provide the mobile reading and decision companion.
- Keep old route IDs and callers supported.

**Not in scope**

- Rewriting Wizard News voice.
- Enabling the owner-gated marginal order forecast.
- Requiring every story to offer an intervention.
- Decorative ticker work before information routing is proven.

**Exit**

- The G-4a-tagged Herald scenarios in section 9 pass for the pilot decision and story, including mobile
  decision return and feature-flag rollback.

#### G-4b — source expansion and content parity

Expand source adapters only after the pilot proves the UI contract. Every record is accounted for as one
item, a provenance-preserving merge, a stable expansion, or an explicit exclusion. Before cutover, map
every Dashboard body, War/Faith/Trade/Events specialist block, Divination and forecast, Adjudication,
Stage the Road, Timelapse, time lens, focus/search/filter, locked state, and empty state to a new view,
legacy alias, retained tool, or retired-with-rationale row.

This sub-wave also:

- removes the simultaneous duplicate `WhileYouWereAway` rendering;
- switches user default and post-advance routing only after source/content parity passes;
- routes a paused advance directly to its blocking decision;
- sorts resolved decisions by recorded chronology;
- distinguishes an independently evaluated lapse warning from a simulated queue-drain refusal;
- closes forecast invalidation gaps, names refused orders and reasons, and removes "exact next tick"
  language where party-impact ripples or multi-interval scope are not simulated;
- brings the applicable Herald translation findings to zero;
- proves new-UI write → flag-off → old-UI reopen without loss or duplicate resolution.

Legacy semantic aliases (`dashboard`, topic IDs, `divination`, and `adjudication`) remain indefinitely
unless a specific future conflict justifies migration. Render shells may retire after parity; cheap
external-link compatibility does not.

### G-5 — selective cross-surface propagation

**Thesis:** share meaning where it helps a real task; do not force uniform UI.

G-5 is a sequence of independently shippable surface slices, not one horizontal merge.

#### G-5a — Generator

- Reverify the historical audit.
- Provide a truthful result recap and full-regeneration delta without inventing causes.
- Close or explicitly owner-defer every applicable Generator safety and translation finding.
- Exit on the named Generator scenario in section 9 plus the common wave gate.

#### G-5b — Map Editor and remaining Realm work

- Reverify both historical sections.
- Provide truthful placement proximity without terrain-at-cursor claims.
- Close destructive Clear/Regenerate/placement review gaps and expose useful attention/recent-story cues.
- Partition Realm ownership explicitly: G-4 owns advance, briefing, decisions, docket, and forecast; G-5b
  owns remaining map, palette, dossier, and placement propagation.
- Close or explicitly owner-defer every applicable Map and Realm safety finding.
- Exit on the named Map/Realm scenarios in section 9 plus the common wave gate.

#### G-5c — Custom Content

- Reverify the historical audit.
- Provide truth-tier effect descriptions, usage echoes, and useful dependency navigation.
- State plainly when a field affects presentation but not the living simulation.
- Close or explicitly owner-defer every applicable Custom Content safety and translation finding.
- Exit on the named Custom Content scenario in section 9 plus the common wave gate.

#### G-5d — Library and continuity

- Add task-specific attention sort and canon-state clarity without forcing Herald ordering.
- Complete stable identity, cause-receipt consistency, export/reopen preservation, and useful return routes
  across the six audited surfaces.
- Exit on the continuity scenarios in section 9 plus the common wave gate.

**Shared non-goals**

- Byte-identical ranking across Map, Library, and Herald.
- A universal verb registry.
- Terrain-at-cursor claims without a real source.
- Claiming that traditions or other presentation-only custom fields steer simulation when they do not.

### G-6 — prevention, rendered gate, and re-audit

**Thesis:** ratchet proven behavior, not architectural aspiration.

**In scope**

- Targeted contracts for translation, stable identity, source-adapter coverage, deduplication, intent
  payloads, preview/apply parity, route restoration, persistence, and recovery.
- Browser scenarios for fresh, peaceful, active, decision-heavy, failure, stale, and 20-plus-settlement
  worlds on desktop, tablet, and mobile.
- Keyboard, screen-reader, focus, touch-target, non-color status, and reduced-motion verification.
- Full `npm run check`, build, distribution verification, size gates, and lazy-boundary review.
- Fresh six-surface re-audit based on task completion, not the number of widgets present.
- Retire superseded render shells only after parity. Preserve cheap semantic route aliases unless a
  separately recorded conflict requires their migration.
- Close the remaining translation and degraded-state inventory; G-6 may not turn a known leak into a
  larger accepted baseline.

**Not in scope**

- Source-regex walkers as a substitute for rendered usability.
- "Every noun is linked" or "every action has a forecast" absolutist tests.
- Hiding regressions inside an expanded baseline.

**Exit**

- All definition-of-done conditions in section 11 are met.

## 9. Required acceptance scenarios

Each scenario names its owning wave and proof type. Automated checks establish structure and state;
rendered journeys establish reachability; timed comprehension claims require human evidence.

G-0 freezes the named fixtures and budgets before implementation. The five-second settlement check uses
at least five representative GMs on the same active-save fixture; at least four must answer the three
state questions and point to the next useful place within five seconds and no more than one interaction.
The 20-plus-settlement fixture
contains an expected top-three oracle, typed attention reasons, and deterministic tie-breaks. Performance
scenarios use the exact G-0 first-paint, bundle, DOM, render, and interaction budgets rather than the word
"fast."

### Settlement Workbench

- **SED-01 [G-2b/G-6; timed human; desktop owner]** Identify settlement, top current pressure, and
  non-baseline change state, then point to the next useful place under the five-second protocol. The
  zero-change fixture adds no permanent status chrome.
- **SED-02 [G-2a; integration + rendered; desktop owner]** Edit the live NPC-secret prose field → see
  saved state and provenance → refresh → undo → reopen.
- **SED-03 [G-1/G-2a; integration + rendered; desktop owner]** Change the specific NPC goal and role
  fixtures → stage → correctly classified deterministic review → apply → visible in-place update →
  translated receipt → undo → reopen.
- **SED-04 [G-2b; rendered; capability matrix]** Ransom, rescue, recall, return, and each supported stasis
  reason complete on desktop. Every lifecycle affordance exposed on mobile completes there; unsupported
  mobile mutations are disabled before enqueue.
- **SED-05 [G-1; integration]** A table event and NPC change coexist; committing or discarding either
  named scope cannot affect the other.
- **SED-06 [G-1; integration]** A stale save revision blocks application, retains the intent, and offers a
  recovery path.
- **SED-07 [G-1; integration]** Each invalidation source — pulse, remote write, and save switch —
  invalidates stale review before apply.
- **SED-08 [G-1; integration]** A mixed batch is atomic inside its declared local boundary, or successful
  and failed items are separately receipted while failures remain retryable. Cross-save work reports one
  coordinator's saga/outbox state.
- **SED-09 [G-1; security + rendered]** Public and player views cannot mutate or reveal GM-only context.
- **SED-10 [G-1; integration + rendered]** Offline persistence failure is visible, retryable, and never
  reported as saved. Retrying after an ambiguous network result cannot apply the same intent twice.
- **SED-11 [G-1; integration]** Campaign and save switching cannot leak queued work into the new scope.
- **SED-12 [G-2b; rendered]** Each migrated entity class exposes the mapped story/state, available cause
  evidence, useful connections, and legal actions without losing dossier context. Unmigrated classes
  remain on the retained legacy path.
- **SED-13 [G-1/G-2a; contract + rendered]** "No structural effect" never means "preview unavailable";
  exact diff, deterministic scope, directional outlook, and unavailable states use distinct language.
- **SED-14 [G-2b/G-6; accessibility]** Every enabled row in the frozen capability matrix has a keyboard
  journey, visible focus, focus return, and reachable cancel/recovery/undo. Screen-reader and touch
  journeys are manually verified for their supported rows.
- **SED-15 [G-2a; integration]** Create/apply in the Workbench → disable its flag → reopen in the old
  editor with no loss, duplicate application, queue corruption, or first-paint budget regression.
- **SED-16 [G-1; integration]** Direct Event Composer application has preview/apply parity; a clock-bound
  next-pulse event is labeled as isolated scope review unless the intervening queue and world state are
  actually simulated.
- **SED-17 [G-1/G-2b; old-save fixture]** Legacy entities receive stable deterministic identity or
  degrade to non-interactive text; export/import/reopen never relinks by array position.

### Herald

- **HER-01 [G-4b/G-6; oracle + timed human; desktop owner]** In the 20-plus-settlement fixture, Briefing
  shows the expected top three above the fold, in stable order, with the typed reason each was promoted.
- **HER-02 [G-4a; integration + rendered]** A pending proposal appears at rest with a visible count; the
  GM inspects, compares, applies or dismisses, sees one receipt, and returns to the originating story.
- **HER-03 [G-4a; rendered]** A story with an indexed receipt traces to causes and affected entities, then
  routes to dossier and map and returns with context. A missing/unindexed receipt states that deeper
  provenance is unavailable instead of opening an empty raw-ID chain.
- **HER-04 [G-3; contract]** One source record can be Trade + emerging + blocking proposal without
  duplication or contradictory counts.
- **HER-05 [G-3/G-4a; integration]** A proposal or paused verdict has one identity across Briefing and
  Decisions; resolving it updates every projection exactly once.
- **HER-06 [G-3; contract]** Two same-kind, same-tick events both survive derivation and filtering.
- **HER-07 [G-3; rendered]** A missing or deleted subject degrades to readable, non-interactive text and a
  diagnostic rather than a broken route.
- **HER-08 [G-4b; integration + rendered]** After Advance Realm, the Herald opens on changed, resolved,
  new, and decision-required results; a paused result routes directly to the blocking verdict.
- **HER-09 [G-4b; rendered]** Plans names interval, settlement scope, staged orders, independent lapse
  warnings, and auto-resolving decisions without calling a non-simulated queue drain certain.
- **HER-10 [G-4a/G-4b; route integration]** Topic, time, focus, query, item, scroll, and inspector size
  survive story open/back; Escape returns focus correctly.
- **HER-11 [G-4b; rendered peaceful fixture]** Zero false urgent items, no warning styling, one compact
  empty explanation, and no grid of empty desks.
- **HER-12 [G-4b; accessibility]** Critical state uses named text plus a second non-color channel.
- **HER-13 [G-4a; compatibility]** Legacy section IDs, external deep links, and every
  `openInspectorAt(...)` caller retain their semantic destination.
- **HER-14 [G-4b; security]** Covert and GM-only facts never leak to public, share, or player surfaces.
- **HER-15 [G-4a/G-4b; keyboard + touch]** Desktop, tablet, and mobile users complete a supported decision
  and return to its story with focus restored.
- **HER-16 [G-4b/G-6; performance]** The frozen large-history fixture stays within every G-0 budget.
- **HER-17 [G-4b; contract + rendered]** Forecast copy reflects its real epistemic boundary: omitted
  party-impact ripples and multi-interval runs cannot claim "exact" or "this is the next tick"; each
  refused order is named with its reason.
- **HER-18 [G-4b; integration]** Resolved decisions sort by recorded chronology, and lapse wording matches
  independent current-state evaluation rather than simulated queue order.
- **HER-19 [G-4b; rendered]** The front page renders one `WhileYouWereAway` projection, not two.
- **HER-20 [G-4a; integration]** Resolve under the new shell → disable its flag → reopen under the legacy
  shell with no duplicate action, lost receipt, or unreadable metadata.

### G-5 surface slices and continuity

- **GEN-01 [G-5a; rendered + golden]** The result recap describes only generated facts, and full
  regeneration reports count/band deltas without entity-ID noise or invented causes.
- **MAP-01 [G-5b; rendered]** Placement review names computed neighbors/proximity without claiming
  unavailable terrain; Clear and Regenerate enumerate their real loss scope and recovery boundary.
- **RLM-01 [G-4b/G-5b; rendered]** Advance review names interval, settlement scope, staged orders, and
  due decisions at the control; dossier/map projections agree with the post-advance receipt.
- **CUS-01 [G-5c; rendered + domain contract]** One deity, institution, resource, stressor, and
  presentation-only tradition each show the correct truth tier and usage echo without claiming an
  unimplemented simulation effect.
- **LIB-01 [G-5d; rendered + selector contract]** Library attention sorting is deterministic from shared
  facts, preserves canon state, and may differ from Herald ordering for a documented task reason.
- **X-01 [G-5d/G-6; old-save + export integration]** The same owner-visible entity retains one identity
  and name across dossier, Herald, map, Library, export, import, and reopen; intentional public redaction
  is preserved.
- **X-02 [G-5d/G-6; contract]** Cross-surface cause projections agree on structured subject, polarity,
  cause identity, and in-world time; prose wording may differ by surface.
- **X-03 [G-5d; selector contract]** Attention evidence agrees while task-specific ordering and tie-breaks
  remain documented and stable.
- **X-04 [G-5d; route integration]** Every offered route has a stable resolvable target, successful
  navigation, preserved originating context, and a return path.
- **X-05 [every wave; golden]** RNG order, gameplay fields, and pulse outcomes remain exact. Any excluded
  additive observability key is on the approved frozen whitelist.

## 10. Validation matrix

| Risk | Required proof |
|---|---|
| Simulation drift | exact RNG/gameplay/pulse semantic projection plus approved observability whitelist |
| Writer divergence | preview and apply execute the same pure operation path where available |
| Queue corruption | mixed-scope, stale, partial-failure, retain, retry, and discard tests |
| Identity drift | save/reopen/export/deep-link round trips using stable refs |
| Metadata rollback | new-UI write, flag-off old-reader reopen, no duplicate application |
| Realm omission | source-adapter coverage and explicit-exclusion inventory |
| Realm duplication | fingerprint and cross-source deduplication cases |
| False causality | cause-receipt provenance and unavailable/degraded cases |
| Route regression | old ID compatibility, restored focus/filter/item, back-navigation tests |
| Accessibility | keyboard journey, focus return, screen-reader state, non-color cues, touch completion |
| Scale | rendered 20-plus-settlement Briefing, map, and Library scenarios |
| Quiet-state quality | fresh and peaceful worlds with honest empty states |
| Performance | lazy-boundary, first-paint, size-budget, and distribution verification |

Structural prevention lands only after the behavior is true. A walker may prove that every registered edit
kind declares a preview policy; it cannot prove that a person understands the preview. Both contract tests
and rendered scenarios are required.

## 11. Definition of done

The game-grade program is complete only when:

- the five task contracts in section 3 are demonstrably satisfied;
- all six surfaces have a current evidence-backed audit;
- no known raw engine token reaches any end-user-facing surface; only explicitly inventoried,
  owner-approved product artifacts or debug/admin tools may be exceptions;
- consequential actions have truthful, proportionate previews and recovery;
- unsupported causality and forecast are named honestly;
- stable identity survives navigation, persistence, export, and reopen;
- the Settlement Workbench and Herald acceptance suites pass on desktop and mobile where supported;
- a 20-plus-settlement realm is triageable without opening every settlement or topic;
- superseded editor and Herald render shells are retired only after parity, while stable semantic aliases
  remain compatible;
- the full repository, build, distribution, accessibility, performance, and same-seed gates pass;
- owner-gated simulation decisions remain gated or have a separately recorded approval.

## 12. Explicit non-goals and future horizon

This program does not make every surface identical, every noun interactive, or every action predictive.
It does not add multiplayer coordination, a new simulation engine, inferred causal AI, or a second event
store.

After G-6, further work should be driven by observed campaign use:

- deepen cause recording only where real user questions repeatedly hit an honest unavailable state;
- add new domain actions only when a complete subject → decision → receipt journey exists;
- extend further mobile authoring only after the declared Workbench mutations and reading/decision
  companion are stable;
- use product telemetry and structured playtests to tune attention ranking without changing canonical
  facts;
- broaden custom-content simulation influence only through explicit domain proposals, not presentation
  copy;
- preserve a small benchmark scenario suite as the permanent regression corpus.

The endpoint is not maximum machinery. It is a settlement and campaign tool whose depth feels calm,
answerable, and dependable at the table.
