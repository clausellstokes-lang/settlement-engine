# Existing-campaign import and reconciliation

**Status:** deterministic settlement-review and production command vertical
implemented; migration 184 deployment and live operational proof remain external

The best-fit SettlementForge customer often has an existing campaign. Import should
reduce switching cost without converting uncertain prose into false mechanical
precision.

## Trust model

- Source material remains user-held and attributable; browser recovery never
  retains the uploaded export.
- Parsing is a proposal, not canon.
- An entity match requires a stable target or explicit creation.
- Conflicts, unsupported mechanics, and uncertainty remain visible.
- Application uses the same previewable, idempotent command plane as manual work.
- Re-running an import cannot duplicate accepted operations.

## Session states

The structured-export slice uses:

`ingested → reconciling → previewed → applying → applied`

The terminal alternative is `failed_reconcilable`. A failed application retains
completed command receipts and unapplied proposals; it never reports
all-or-nothing success when only part persisted. Closing or backing out of the
review is UI disposal, not a terminal domain state: it writes no world mutation
and preserves the bounded recovery record. A future “discard permanently”
action would require explicit recovery-record deletion and is not implied by
dismissal.

`parsed` remains a future stage for natural-language and third-party formats. The
structured SettlementForge export already contains typed settlement records, so adding
a ceremonial parse state would create no new evidence or safety boundary.

## Records

- **Import source:** format, checksum, size, user label, ingestion time, and an
  optional active-session storage reference. The source is excluded from recovery.
- **Claim:** source location, normalized text, proposed entity/fact kind, confidence,
  and parser version.
- **Match decision:** create, match/reuse, skip, or defer; actor and time.
- **Conflict:** existing fact, proposed fact, compatibility class, and resolution.
- **Command draft:** stable proposal ID, target, normalized input, and source claims.
- **Import receipt:** source checksum, decision counts, command receipts, failures,
  and bounded recovery metadata.

Campaign text is private content and is excluded from ordinary analytics.

## Implemented first vertical

The first vertical reviews settlements from the existing structured SettlementForge
account export:

1. runtime-admit the file and preserve its checksum;
2. show imported settlements without writing;
3. match by stable provenance ID, then offer explicit name-based candidates;
4. let the user create, match/reuse, skip, or defer;
5. preview settlement creation and campaign membership while showing relationships and
   campaign mechanics as deferred;
6. disclose every exclusive-membership removal before apply;
7. produce stable, JSON-only command drafts behind the application command plane;
8. atomically create/attach or exclusively rehome in configured cloud mode;
9. retain per-draft partial receipts and private recovery IDs.

The campaign import dialog exposes this as a separate structured-export path beside
the existing table-notes workflow. Every settlement requires an explicit decision.
Uploading never writes, matching never overwrites the existing target, and the preview
states that it is a bounded plan rather than a simulated outcome.

The production store exposes two narrow capabilities:
`import.settlement.create-and-attach` and
`import.campaign.attach-existing`. In configured mode, migration 184's
`apply_import_reconciliation_command` is the only writer. It claims durable
owner-scoped command identity, validates the exact reviewed campaign-membership
topology, writes the settlement/campaign changes, and finalizes the receipt in one
PostgreSQL transaction. It supports current versioned, historical untagged nested,
and legacy unwrapped campaign envelopes; malformed campaign membership fails closed.
There is no saves/campaign outbox dual write.

Configured offline clients refuse apply because they cannot honestly claim the
authoritative transaction. Unconfigured local development uses a labeled
`local-recoverable-saga`: create first, write campaign membership second, and attempt
compensation if the second write fails. Its receipt remains unconfirmed rather than
borrowing cloud-atomic language.

The browser retains a bounded, owner-scoped private recovery record containing only
the checksum, target/source-choice IDs, explicit decisions, reviewed topology IDs,
and redacted receipts. It excludes the uploaded export, normalized settlements,
campaign prose, labels, and file references. Reopening requires the same export again.
A recovered receipt is attached only when the newly reconstructed plan is identical;
otherwise the UI reports the plan drift and only reads safe journal metadata.

### Implementation map

- `src/lib/importReconciliationAdmission.js` — byte cap, hostile envelope validation,
  normalization/scrub reuse, source-campaign scope, candidates, conflicts, unsupported
  mechanics, and deterministic proposal IDs.
- `src/lib/importReconciliationSession.js` — serialized-session admission and explicit
  decisions.
- `src/lib/importReconciliationExecution.js` — bounded preview, stable command drafts,
  injected execution, and resumable partial receipts.
- `src/lib/importReconciliationCommandIdentity.js` — deterministic owner/source/
  topology command identity without pulling the import parser into the live registry.
- `src/lib/importReconciliationCommandPersistence.js` — migration 184 RPC transport
  and owner-RLS journal diagnostics.
- `src/lib/importReconciliationRecovery.js` — source-free bounded reopen records.
- `src/lib/importReconciliationShared.js` and `importReconciliationTypes.js` — local
  deterministic JSON boundary and explicit contracts.
- `src/lib/importReconciliation.js` — stable public facade.
- `src/components/settlements/StructuredCampaignReconciliation.jsx` — narrow reviewer
  mounted inside the already-lazy campaign import dialog.
- `src/application/commands/adapters/importReconciliationApply.js` and
  `src/store/importReconciliationCommandTransaction.js` — command policy,
  atomic-cloud projection, owner/session fences, and honest local fallback.
- `supabase/migrations/184_import_reconciliation_commands.sql` — durable command
  transaction, exclusive rehome law, envelope-preserving patch, and command-health
  aggregate.
- `scripts/ops/obligation-probe.mjs` — fail-closed combination of migration 182
  external-obligation health and migration 184 application-command health.

### Deliberately deferred limits

- Only SettlementForge account-export JSON is accepted; no prose or third-party parser.
- Only settlement identity and target-campaign membership are planned. Relationships,
  imported campaign/world/map/chronicle state, AI overlays, and version histories remain
  visible but unapplied.
- Candidate evidence is stable source ID, prior import provenance, or exact normalized
  name. There is no fuzzy or semantic identity guess.
- The checksum is a deterministic content identity token, not a cryptographic signature.
- Browser recovery is deliberately not a copy of the source export. Losing the
  original export means decisions cannot be reconstructed from the recovery receipt.
- Migration 184 must be rehearsed and deployed before a configured production client
  can use the command RPC; the live-verified production head is 121.

Natural-language notes and third-party formats remain a later, separately admitted
vertical; they do not inherit structured-export certainty.

## Non-goals

- Silent bulk canonization.
- Mechanical inference from prose without confirmation.
- Scraping third-party services without an authorized export/API.
- Treating import data as an aggregate market-insight product.
- A universal ontology migration before the medieval-fantasy model is genuinely
  parameterized.
