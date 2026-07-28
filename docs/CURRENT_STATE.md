# Current state

> **BANKED 2026-07-26 (THE BANKING FOLD).** Everything this document describes as
> "uncommitted integration" is now committed on claude/composite-r4 as 12 lane
> commits (b503fe05..7a6603de) plus follow-ups; migrations are contiguous to 192 at
> HEAD. Governance home: the ledger branch (review-fixes-2026-07-08) — owner
> decisions live in ONE surface, `docs/OWNER_DECISION_QUEUE.md` there; the
> 2026-07-26 ledger rows carry the pivot ratification, the golden-regen
> adjudication, and the Wave-8 confirmation. This file remains the honest
> program-state entry point for the code branch.

**Status date:** 2026-07-28
**Code of record:** the active integration worktree; verify with `git worktree list`  
**Audience:** contributors, operators, and reviewers who need the shortest honest
entry point

SettlementForge is a deterministic settlement generator and persistent campaign
simulation with explainable consequences and DM-controlled canon. The core thesis
is implemented. The current integration is not yet a release certificate: it is a
large, actively changing tree whose local gates, deployment state, and live-service
evidence must be checked independently.

## What exists

- A seeded generation pipeline with explicit stage dependencies.
- Saved settlements, campaigns, maps, canon state, version history, and exports.
- A composed realm simulation spanning economy, movement, politics, belief,
  religion, war, peace, and consequence propagation.
- Forecast, explanation, Chronicle, Herald, and player-safe/DM-truth surfaces.
- Surveyor analysis and proposal flows in which AI is subordinate to deterministic
  state and human authorization.
- Supabase ownership enforcement, Stripe-backed entitlements, durable refund and
  deletion obligations, and executed database-policy tests.
- A broad local and CI gate covering data, migration shape, edge functions, map
  isolation, types, lint, behavior, builds, and distribution contracts.

## What this integration adds

- A local application-command spine with target, owner, expected-revision,
  preview, validation, receipt, and replay semantics. `commandId` is the
  behavior-fingerprinted replay/idempotency identity.
- The first server-authoritative command vertical (`CUT_TRADE_ROUTE`), where
  command identity, base-state compare-and-set, save mutation, and final receipt
  share one database transaction without a legacy outbox dual write. An
  ambiguous initiating response has an explicit same-session durable check:
  confirmed commits replay for projection, absent identities retry the exact
  original command, and unresolved rows remain visibly blocked.
- A structured existing-campaign import vertical with explicit settlement
  decisions, exact rehome disclosure, owner-scoped deterministic command
  identity, atomic cloud create/attach, and a source-free recovery record that
  requires exact export reupload before decisions or receipts can be restored.
- Owner- and generation-scoped pending edits with stable NPC identity, honest
  cascade previews, partial-result receipts, and snapshot undo.
- RealmItem read models and command-oriented Herald/Workbench surfaces behind
  default-off rollout flags.
- A deterministic, audience-safe `TownSceneManifest`, permanent 2D plan, and
  lazy illustrated 3D settlement portrait. The portrait is available as an
  opt-in view; default promotion remains deliberately withheld until the
  repository, rendered-matrix, physical-device, accessibility, representative-
  user, and field-soak receipts in the promotion contract are all current.
- Runtime admission for persisted save and campaign data, plus an honest boundary
  typecheck that does not pretend the JSX tree is already fully typed.
- Configurable separate-origin FMG loading and enforced production CSP contracts.
- Cross-queue operational health and acknowledgement for refund, deletion, and
  webhook obligations, plus fail-closed application-command journal health in
  the private-monitor probe. Production scheduling and alert delivery remain
  live-service evidence, not a repository claim.
- Safer backup/restore drills, compressed-transfer budgets, and source-identity-bound
  multi-size endurance receipts.
- A production-build desktop and mobile browser regression gate with non-vacuous
  LCP, CLS, and interaction-to-next-paint evidence. It remains distinct from
  field p75 performance certification.
- Deliberate adjudication of the generator, belief-map, deity-pulse, and PDF
  golden families. Their reviewed fixture changes were regenerated and
  reverified rather than accepted as an incidental side effect.

## Current release blockers

1. **Migration train.** Working-tree migration head 192 is 71 migrations ahead
   of the live-verified production head 121. The eleven declared waves need clone
   rehearsal, wave receipts, rollback practice, and then an authorized deployment.
2. **Live-service proof.** Local code cannot prove production Stripe, Supabase,
   DNS/TLS, CSP reporting, alert delivery, backup retention, or restore timing.
3. **Command durability breadth.** The durable journal and first transactional
   canon-event vertical now exist, migration 184 adds atomic structured-import
   reconciliation, and migration 185 adds immutable custom-content definitions,
   revisions, packs, environments, and reviewed command application.
   Most legacy mutations have not migrated. Each remaining
   family needs its own pure preparation and command-specific transaction; a
   generic dual-authority wrapper is explicitly not completion.
4. **Behavioral certification.** The composed soak proves several important
   invariants; it does not yet prove the complete rhythm/no-stasis contract.
5. **Uncoached use.** No internal gate can prove first-use comprehension, weekly
   preparation value, or willingness to pay.

## How to establish current truth

```sh
git worktree list
git status --short
npm run check
npm run check:edge-behavior
npm run soak:smoke
```

Then compare the repository migration head with the applied production marker.
`npm run check` is the main code gate; it is not a substitute for the Deno runtime
job, browser/device checks, release-scale soaks, or live operator drills.

## Canonical reading order

1. [`../README.md`](../README.md) — product and development entry point.
2. [`../ARCHITECTURE.md`](../ARCHITECTURE.md) — implemented system map.
3. [`TOWN_SCENE_3D_ARCHITECTURE.md`](./TOWN_SCENE_3D_ARCHITECTURE.md) and
   [`TOWN_SCENE_PROMOTION_CONTRACT.json`](./TOWN_SCENE_PROMOTION_CONTRACT.json) —
   the settlement-presentation architecture and its default-promotion evidence.
4. [`PRODUCT_COMPLETION_ARCHITECTURE.md`](./PRODUCT_COMPLETION_ARCHITECTURE.md) —
   remaining end-state and migration sequence.
5. [`GAME_GRADE_PROGRAM.md`](./GAME_GRADE_PROGRAM.md) — legibility/workflow program.
6. [`DEPLOY.md`](./DEPLOY.md) and [`ops/SERVICE_OBJECTIVES.md`](./ops/SERVICE_OBJECTIVES.md)
   — release and operating contracts.
7. [`VISION_IDEALIZED_FINAL_PRODUCT.md`](./VISION_IDEALIZED_FINAL_PRODUCT.md) —
   product constitution, including claims not yet graduated.

Historical reviews remain useful for rationale, but they do not override this page,
the current architecture, executable gates, or live environment evidence.
