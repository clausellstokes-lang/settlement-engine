# docs/ — index

Not all of these are equal. **CANONICAL** docs are living references kept in sync
with the code; trust them. **HISTORICAL** docs are point-in-time audit/plan exhaust
— useful for "why did we do this," but they describe a past state and are NOT
maintained, so do not treat them as the current shape of the system. (They are
kept on purpose, not deleted; the large ones are heavyweight build artifacts.)

When a historical doc and the code disagree, the code wins. When a historical doc
and a canonical doc disagree, the canonical doc wins.

> The root [`ARCHITECTURE.md`](../ARCHITECTURE.md) is the canonical system map;
> [`CONTRIBUTING.md`](../CONTRIBUTING.md) is the operating standard.

## CANONICAL — living references (keep these current)

| Doc | What it is |
|---|---|
| [`DEPLOY.md`](./DEPLOY.md) | Deploy + gating runbook (client, Supabase, edge, the fail-closed CI gate). |
| [`RISK_REGISTER.md`](./RISK_REGISTER.md) | Living risk view — the maintained successor to `REVIEW_FINDINGS.md`. |
| [`PRODUCT_COHERENCE.md`](./PRODUCT_COHERENCE.md) | Companion to the risk register (UX-coherence). |
| [`PRIVACY_LOGGING.md`](./PRIVACY_LOGGING.md) | Policy: how IDs/IPs/fingerprints are handled in logs. |
| [`analytics-event-taxonomy.md`](./analytics-event-taxonomy.md) | The analytics event contract (enforced by the gate). |
| [`abuse-model.md`](./abuse-model.md) | Abuse / threat model. |
| [`settlement-schema.md`](./settlement-schema.md) | Settlement-shape reference. |
| [`azgaar-bridge.md`](./azgaar-bridge.md) | Azgaar FMG map bridge — setup. |
| [`fmg-fork.md`](./fmg-fork.md) | FMG fork — upgrade/reconciliation procedure. |
| [`email-lifecycle.md`](./email-lifecycle.md) | Transactional-email setup + lifecycle. |

## HISTORICAL — point-in-time audit / plan / status exhaust (not maintained)

Snapshots from past review/design passes. Read for rationale, not for current truth.

- [`REVIEW_FINDINGS.md`](./REVIEW_FINDINGS.md) — already self-labeled SUPERSEDED; superseded by `RISK_REGISTER.md`.
- Multi-agent audit dumps: [`GENERATION_COHERENCE_AUDIT.md`](./GENERATION_COHERENCE_AUDIT.md), [`SIMULATION_LOGIC_AUDIT.md`](./SIMULATION_LOGIC_AUDIT.md), [`REGIONAL_ENGINE_AUDIT.md`](./REGIONAL_ENGINE_AUDIT.md), [`refund-ledger-audit.md`](./refund-ledger-audit.md), [`a11y-audit.md`](./a11y-audit.md), [`mobile-responsive-audit.md`](./mobile-responsive-audit.md).
- `.review_findings.json` — raw machine-generated review-findings dump (heavy build artifact, not hand-maintained).
- Plans / design specs (largely realized; describe intent at authoring time): [`COHESION_REMEDIATION_PLAN.md`](./COHESION_REMEDIATION_PLAN.md), [`SUBSYSTEM_INTEGRATION_PLAN.md`](./SUBSYSTEM_INTEGRATION_PLAN.md), [`UX_OVERHAUL_PLAN.md`](./UX_OVERHAUL_PLAN.md), [`PROPOSAL_ASSESSMENT.md`](./PROPOSAL_ASSESSMENT.md), [`A_PLUS_ROADMAP.md`](./A_PLUS_ROADMAP.md) (self-labeled HISTORICAL; the prescriptive A+ build order at authoring time), [`GEOPOLITICAL_WAR_LAYER.md`](./GEOPOLITICAL_WAR_LAYER.md) (DESIGN, partially implemented), [`SIMULATION_TO_10.md`](./SIMULATION_TO_10.md), [`STRESSOR_WAVE_DESIGN.md`](./STRESSOR_WAVE_DESIGN.md), [`simulation-intelligence-layer.md`](./simulation-intelligence-layer.md), [`regional-causality-engine.md`](./regional-causality-engine.md), [`world-pulse-roadmap.md`](./world-pulse-roadmap.md), [`P3_CONSERVED_LEDGER.md`](./P3_CONSERVED_LEDGER.md).
- "Tier N.NN" status/migration notes (closed-out work logs): [`critique-implementation-status.md`](./critique-implementation-status.md), [`tier-9-status.md`](./tier-9-status.md), [`ui-migration-map.md`](./ui-migration-map.md), [`body-token-sweep.md`](./body-token-sweep.md), [`duplicate-keys-removed.md`](./duplicate-keys-removed.md).

Root-level historical audit exhaust lives alongside [`ASSESSMENT.md`](../ASSESSMENT.md)
(already labeled superseded): [`CODEBASE_REVIEW.md`](../CODEBASE_REVIEW.md),
[`PDF_PARITY_AUDIT.md`](../PDF_PARITY_AUDIT.md), and
[`DESIGN_STRESSOR_DYNAMICS.md`](../DESIGN_STRESSOR_DYNAMICS.md) are point-in-time
review/design snapshots, not living references.

> Note: `docs/fmg-bridge.js` is source, not a doc — it lives here next to
> `azgaar-bridge.md` / `fmg-fork.md` for proximity to the bridge docs.
