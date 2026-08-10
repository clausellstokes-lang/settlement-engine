# docs/ — index

Not all of these are equal. **CANONICAL** docs are living references kept in sync
with the code; trust them. **HISTORICAL** docs are point-in-time audit/plan exhaust
— useful for "why did we do this," but they describe a past state and are NOT
maintained, so do not treat them as the current shape of the system. (They are
kept on purpose, not deleted; the large ones are heavyweight build artifacts.)

When a historical doc and the code disagree, the code wins. When a historical doc
and a canonical doc disagree, the canonical doc wins.

> The root [`ARCHITECTURE.md`](../ARCHITECTURE.md) is the canonical system map;
> [`CONTRIBUTING.md`](../CONTRIBUTING.md) is the operating standard. For
> unbuilt subsystem work, [`implementation/INDEX.md`](./implementation/INDEX.md)
> is the only current dispatch surface.

## CANONICAL — living references (keep these current)

| Doc | What it is |
|---|---|
| [`implementation/INDEX.md`](./implementation/INDEX.md) | SHA-pinned registry of the few subsystem packets currently READY, BLOCKED, or being reconciled; only READY rows may be dispatched. |
| [`implementation/PACKET_STANDARD.md`](./implementation/PACKET_STANDARD.md) | Canonical scope, authority, verification, edge-case, and STOP contract for coding-agent instructions. |
| [`implementation/PACKET_TEMPLATE.md`](./implementation/PACKET_TEMPLATE.md) | Copyable packet skeleton; remove every placeholder before a packet can become READY. |
| [`CURRENT_STATE.md`](./CURRENT_STATE.md) | Short, honest product/release status and current reading order. |
| [`PRODUCT_COMPLETION_ARCHITECTURE.md`](./PRODUCT_COMPLETION_ARCHITECTURE.md) | End-state command/read/ops architecture and completion sequence. |
| [`TOWN_SCENE_3D_ARCHITECTURE.md`](./TOWN_SCENE_3D_ARCHITECTURE.md) | One-truth/two-presentations architecture for the opt-in 3D settlement portrait and permanent 2D plan. |
| [`TOWN_SCENE_PROMOTION_CONTRACT.json`](./TOWN_SCENE_PROMOTION_CONTRACT.json) | Machine-readable evidence gates that keep 3D availability separate from default promotion. |
| [`CUSTOM_CONTENT_PLATFORM_ARCHITECTURE.md`](./CUSTOM_CONTENT_PLATFORM_ARCHITECTURE.md) | Controlled-extension-language architecture for manifest truth, reviewed authoring, immutable revisions, packs, campaign environments, usage, and bounded scene presentation. |
| [`CUSTOM_CONTENT_PROMOTION_CONTRACT.json`](./CUSTOM_CONTENT_PROMOTION_CONTRACT.json) | Machine-readable boundary between implemented custom-content capabilities, open platform-integration gates, and intentional deferrals. |
| [`GENERATION_CONTRACTS.md`](./GENERATION_CONTRACTS.md) | Canonical ownership and persistence rules for world law, resources, cultural identity, generated-theme profiles, isolation support, and final coherence receipts. |
| [`GENERATION_REMEDIATION_HANDOFF.md`](./GENERATION_REMEDIATION_HANDOFF.md) | Program log for the generation-remediation lane; read it with `GENERATION_CONTRACTS.md` when touching that lane's ownership or persistence. It is not the global open-work queue. |
| [`CAPABILITY_REMEDIATION_PLAN.md`](./CAPABILITY_REMEDIATION_PLAN.md) | Program log for the Capability-Atlas remediation (waves R-0…R-5). The Progress blockquote, the deferral ledger, and the owner-gated tail are current; the resume protocol at the top self-labels HISTORICAL. |
| [`EPISTEMIC_PREVENTION_PLAN.md`](./EPISTEMIC_PREVENTION_PLAN.md) | Program log for the test-truthfulness machinery (waves EP-1…EP-6) — the anchored-negative / seeded-failure helpers (`tests/helpers/`) and the walkers that new tests must satisfy. The Progress blockquote is current. |
| [`DEPLOY.md`](./DEPLOY.md) | Deploy + gating runbook (client, Supabase, edge, the fail-closed CI gate). |
| [`ops/MIGRATION_REHEARSAL_RUNBOOK.md`](./ops/MIGRATION_REHEARSAL_RUNBOOK.md) | Bounded production-clone migration train and source-bound receipt. |
| [`ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`](./ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md) | Live source/CSP/health/head/obligation release proof. |
| [`GAME_GRADE_PROGRAM.md`](./GAME_GRADE_PROGRAM.md) | Current legibility, orientation, and action-surface program. |
| [`SOAK_PLAN_R2.md`](./SOAK_PLAN_R2.md) | Current endurance/scale evidence profiles and claim boundary. |
| [`ops/SERVICE_OBJECTIVES.md`](./ops/SERVICE_OBJECTIVES.md) | Launch service targets and required evidence. |
| [`IMPORT_RECONCILIATION_ARCHITECTURE.md`](./IMPORT_RECONCILIATION_ARCHITECTURE.md) | Staged existing-campaign import trust model. |
| [`USER_VALIDATION_PROTOCOL.md`](./USER_VALIDATION_PROTOCOL.md) | Uncoached task study and product-evidence rules. |
| [`PRIVACY_LOGGING.md`](./PRIVACY_LOGGING.md) | Policy: how IDs/IPs/fingerprints are handled in logs. |
| [`analytics-event-taxonomy.md`](./analytics-event-taxonomy.md) | The analytics event contract (enforced by the gate). |
| [`abuse-model.md`](./abuse-model.md) | Abuse / threat model. |
| [`settlement-schema.md`](./settlement-schema.md) | Settlement-shape reference. |
| [`azgaar-bridge.md`](./azgaar-bridge.md) | Azgaar FMG map bridge — setup. |
| [`fmg-fork.md`](./fmg-fork.md) | FMG fork — upgrade/reconciliation procedure. |
| [`email-lifecycle.md`](./email-lifecycle.md) | Transactional-email setup + lifecycle. |

## HISTORICAL — point-in-time audit / plan / status exhaust (not maintained)

Snapshots from past review/design passes. Read for rationale, not for current truth.

- [`RISK_REGISTER.md`](./RISK_REGISTER.md) — self-labels as a historical 2026-06-16
  register; its distributed-state analysis remains useful, but it is not the current
  release ledger.
- [`PRODUCT_COHERENCE.md`](./PRODUCT_COHERENCE.md) — the 2026-06-16 product mental
  model; superseded for current planning by `PRODUCT_COMPLETION_ARCHITECTURE.md`.
- [`REVIEW_FINDINGS.md`](./REVIEW_FINDINGS.md) — already self-labeled SUPERSEDED.
- Multi-agent audit dumps: [`GENERATION_COHERENCE_AUDIT.md`](./GENERATION_COHERENCE_AUDIT.md), [`SIMULATION_LOGIC_AUDIT.md`](./SIMULATION_LOGIC_AUDIT.md), [`REGIONAL_ENGINE_AUDIT.md`](./REGIONAL_ENGINE_AUDIT.md), [`refund-ledger-audit.md`](./refund-ledger-audit.md), [`a11y-audit.md`](./a11y-audit.md), [`mobile-responsive-audit.md`](./mobile-responsive-audit.md).
- `.review_findings.json` — raw machine-generated review-findings dump (heavy build artifact, not hand-maintained).
- Plans / design specs (largely realized; describe intent at authoring time): [`COHESION_REMEDIATION_PLAN.md`](./COHESION_REMEDIATION_PLAN.md), [`SUBSYSTEM_INTEGRATION_PLAN.md`](./SUBSYSTEM_INTEGRATION_PLAN.md), [`UX_OVERHAUL_PLAN.md`](./UX_OVERHAUL_PLAN.md), [`PROPOSAL_ASSESSMENT.md`](./PROPOSAL_ASSESSMENT.md), [`A_PLUS_ROADMAP.md`](./A_PLUS_ROADMAP.md) (self-labeled HISTORICAL; the prescriptive A+ build order at authoring time), [`GEOPOLITICAL_WAR_LAYER.md`](./GEOPOLITICAL_WAR_LAYER.md) (DESIGN, partially implemented), [`SIMULATION_TO_10.md`](./SIMULATION_TO_10.md), [`STRESSOR_WAVE_DESIGN.md`](./STRESSOR_WAVE_DESIGN.md), [`simulation-intelligence-layer.md`](./simulation-intelligence-layer.md), [`regional-causality-engine.md`](./regional-causality-engine.md), [`world-pulse-roadmap.md`](./world-pulse-roadmap.md), [`P3_CONSERVED_LEDGER.md`](./P3_CONSERVED_LEDGER.md).
- **Design specs** — the `DESIGN_*.md` family: commissioned
  architecture written before a wave was built, so they state intent at authoring time and
  the code wins wherever they disagree. Most are realized in whole or in part. A design
  file may inform a packet, but it never dispatches work directly; only a READY row in
  `implementation/INDEX.md` does that. Older program logs and
  `docs/OWNER_DECISION_QUEUE.md` retain decision provenance — e.g.
  [`DESIGN_AI_CAPABILITY_LADDER.md`](./DESIGN_AI_CAPABILITY_LADDER.md) carries queue item
  M43. Grouped by subject:
  - AI + authoring platform: [`DESIGN_AI_CAPABILITY_LADDER.md`](./DESIGN_AI_CAPABILITY_LADDER.md), [`DESIGN_AI_CONTROL_SURFACE.md`](./DESIGN_AI_CONTROL_SURFACE.md), [`DESIGN_AI_INTENT_ATLAS.md`](./DESIGN_AI_INTENT_ATLAS.md), [`DESIGN_CONTENT_PLANE.md`](./DESIGN_CONTENT_PLANE.md), [`DESIGN_EVENT_COMPOSER_V2.md`](./DESIGN_EVENT_COMPOSER_V2.md), [`DESIGN_ANALYTICS_V2.md`](./DESIGN_ANALYTICS_V2.md), [`DESIGN_TRACK_K_COMPLETION.md`](./DESIGN_TRACK_K_COMPLETION.md).
  - World simulation + geopolitics: [`DESIGN_CONVERGENCE.md`](./DESIGN_CONVERGENCE.md), [`DESIGN_CORRUPTION_WEB.md`](./DESIGN_CORRUPTION_WEB.md), [`DESIGN_INFORMATION_STATECRAFT.md`](./DESIGN_INFORMATION_STATECRAFT.md), [`DESIGN_MOMENTUM.md`](./DESIGN_MOMENTUM.md), [`DESIGN_NAVY.md`](./DESIGN_NAVY.md), [`DESIGN_PEACE_ENGINE.md`](./DESIGN_PEACE_ENGINE.md), [`DESIGN_SUPPLY_WEB_WARFARE.md`](./DESIGN_SUPPLY_WEB_WARFARE.md), [`DESIGN_RESOURCE_DYNAMICS.md`](./DESIGN_RESOURCE_DYNAMICS.md), [`DESIGN_SETTLEMENT_LIFECYCLE.md`](./DESIGN_SETTLEMENT_LIFECYCLE.md), [`DESIGN_SETTLEMENT_POLITICS.md`](./DESIGN_SETTLEMENT_POLITICS.md), [`DESIGN_SIM_DEPTH_R2.md`](./DESIGN_SIM_DEPTH_R2.md), [`DESIGN_COHESION_WEAVE.md`](./DESIGN_COHESION_WEAVE.md), [`DESIGN_PACING_GOVERNOR.md`](./DESIGN_PACING_GOVERNOR.md), [`DESIGN_THE_LADDER.md`](./DESIGN_THE_LADDER.md), [`DESIGN_NPC_LIFECYCLE.md`](./DESIGN_NPC_LIFECYCLE.md), [`DESIGN_UPSWING.md`](./DESIGN_UPSWING.md), [`DESIGN_UPSWING_RELATIONSHIP_FLOWS.md`](./DESIGN_UPSWING_RELATIONSHIP_FLOWS.md), [`DESIGN_GENEROSITY_ENGINE.md`](./DESIGN_GENEROSITY_ENGINE.md) (supersedes Part A of the previous).
  - Surfaces, legibility, craft: [`DESIGN_CHRONICLE_LEGIBILITY.md`](./DESIGN_CHRONICLE_LEGIBILITY.md), [`DESIGN_DEEP_CRAFT_PAGES.md`](./DESIGN_DEEP_CRAFT_PAGES.md), [`DESIGN_GUIDANCE_LAYER.md`](./DESIGN_GUIDANCE_LAYER.md), [`DESIGN_MAP_DOORS.md`](./DESIGN_MAP_DOORS.md), [`DESIGN_NUMERIC_PRICES.md`](./DESIGN_NUMERIC_PRICES.md), [`DESIGN_ORGANIC_CRAFT.md`](./DESIGN_ORGANIC_CRAFT.md), [`DESIGN_SETTLEMENT_MAP.md`](./DESIGN_SETTLEMENT_MAP.md).
- "Tier N.NN" status/migration notes (closed-out work logs): [`critique-implementation-status.md`](./critique-implementation-status.md), [`tier-9-status.md`](./tier-9-status.md), [`ui-migration-map.md`](./ui-migration-map.md), [`body-token-sweep.md`](./body-token-sweep.md), [`duplicate-keys-removed.md`](./duplicate-keys-removed.md).

Root-level historical audit exhaust lives alongside [`ASSESSMENT.md`](../ASSESSMENT.md)
(already labeled superseded): [`CODEBASE_REVIEW.md`](../CODEBASE_REVIEW.md),
[`PDF_PARITY_AUDIT.md`](../PDF_PARITY_AUDIT.md), and
[`DESIGN_STRESSOR_DYNAMICS.md`](../DESIGN_STRESSOR_DYNAMICS.md) are point-in-time
review/design snapshots, not living references.

> Note: `docs/fmg-bridge.js` is source, not a doc — it lives here next to
> `azgaar-bridge.md` / `fmg-fork.md` for proximity to the bridge docs.
