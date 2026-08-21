/**
 * StructuredCampaignReconciliation.jsx — deterministic existing-campaign
 * reconciliation inside the lazy campaign-import dialog.
 *
 * The surface is intentionally a reviewer, not a second import engine. Pure
 * modules admit the hostile export, rank candidates, record explicit choices,
 * and produce a bounded preview. This component never writes directly. Apply is
 * enabled only when the store exposes the narrow command-draft adapter.
 */
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  FileJson,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { useStore } from '../../store/index.js';
import { MAX_IMPORT_BYTES } from '../../lib/accountImport.js';
import { t } from '../../copy/index.js';
import {
  admitExistingCampaignImport,
  applyImportReconciliation,
  decideImportProposal,
  ingestSettlementForgeExport,
  previewImportReconciliation,
  reconciliationDecisionSummary,
} from '../../lib/importReconciliation.js';
import {
  importRecoveryPlanMatchesSession,
  loadImportReconciliationRecovery,
  persistImportReconciliationRecovery,
  restoreImportReconciliationDecisions,
  serializeImportReconciliationRecovery,
} from '../../lib/importReconciliationRecovery.js';
import { readImportCommandJournal } from '../../lib/importReconciliationCommandPersistence.js';
import {
  BODY, BORDER, CARD_ALT, GOLD, GREEN, INK, MUTED, RED,
  FS, SP, sans, serif_,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import {
  ImportMembershipTransfers,
  ImportPreviewFacts,
  ImportProposalRow,
  reconciliationFieldStyle,
} from './StructuredCampaignReconciliationParts.jsx';

function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(t('errors.importUnreadable')));
    reader.readAsText(file);
  });
}

export default function StructuredCampaignReconciliation({
  campaign,
  existingSettlements = [],
  onBack,
}) {
  const storeSettlements = useStore(state => state.savedSettlements);
  const storeCampaigns = useStore(state => state.campaigns);
  const ownerId = useStore(state => state.auth?.user?.id || null);
  const executeDraft = useStore(state => state.executeImportReconciliationDraft);
  const library = Array.isArray(storeSettlements)
    ? storeSettlements
    : existingSettlements;
  const campaigns = Array.isArray(storeCampaigns) && storeCampaigns.length > 0
    ? storeCampaigns
    : [campaign];
  const targetCampaign = campaigns.find(
    candidate => String(candidate?.id) === String(campaign?.id),
  ) || campaign;
  const fileRef = useRef(null);
  const journalReadSequence = useRef(0);
  const [phase, setPhase] = useState('file');
  const [ingest, setIngest] = useState(null);
  const [sourceCampaignId, setSourceCampaignId] = useState('');
  const [session, setSession] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [recoveryNotice, setRecoveryNotice] = useState(null);
  const [journalSummary, setJournalSummary] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session || !ownerId) return;
    persistImportReconciliationRecovery(session, ownerId, {
      receipt,
    });
  }, [ownerId, receipt, session]);

  async function inspectDurableRecovery(recoveredReceipt) {
    const commandIds = (recoveredReceipt?.commandReceipts || [])
      .map(item => item?.commandReceipt?.commandId)
      .filter(Boolean);
    if (commandIds.length === 0) {
      setJournalSummary(null);
      return;
    }
    const readSequence = ++journalReadSequence.current;
    try {
      const rows = await readImportCommandJournal(commandIds);
      if (readSequence !== journalReadSequence.current) return;
      setJournalSummary({
        found: rows.length,
        applied: rows.filter(row => row.status === 'applied').length,
        unresolved: rows.filter(row => (
          row.status === 'claimed'
          || row.status === 'reconcile-required'
        )).length,
      });
    } catch {
      if (readSequence === journalReadSequence.current) {
        setJournalSummary({ unavailable: true });
      }
    }
  }

  async function admitSource(nextIngest, choiceId = null) {
    setBusy(true);
    setError(null);
    try {
      const result = await admitExistingCampaignImport(nextIngest, {
        targetCampaign,
        existingSettlements: library,
        existingCampaigns: campaigns,
        sourceCampaignId: choiceId,
      });
      if (result.ok !== true) {
        setError(result.diagnostic?.message || t('errors.importReconcileFail'));
        return;
      }
      let nextSession = result.value;
      let nextPhase = 'review';
      let nextReceipt = null;
      let notice = null;
      const recovery = ownerId
        ? loadImportReconciliationRecovery({
            ownerId,
            sessionId: nextSession.sessionId,
            sourceChecksum: nextSession.source.checksum,
            targetCampaignId: nextSession.scope.targetCampaignId,
          })
        : null;
      if (recovery) {
        const restored = restoreImportReconciliationDecisions(
          nextSession,
          recovery,
        );
        nextSession = restored.session;
        notice = `${restored.restoredProposalIds.length} saved decision${
          restored.restoredProposalIds.length === 1 ? '' : 's'
        } restored from private recovery.`;
        const summary = reconciliationDecisionSummary(nextSession);
        if (summary.undecided === 0 && recovery.reviewedDrafts.length > 0) {
          const preview = previewImportReconciliation(nextSession);
          if (preview.ok === true) {
            nextSession = preview.value;
            nextPhase = 'preview';
            if (
              recovery.receipt
              && importRecoveryPlanMatchesSession(nextSession, recovery)
            ) {
              nextReceipt = recovery.receipt;
              nextPhase = 'result';
            } else if (recovery.receipt) {
              notice += ' The saved receipt belongs to an older membership plan, so it was not attached to this new review.';
            }
          }
        }
        void inspectDurableRecovery(recovery.receipt);
      } else {
        setJournalSummary(null);
      }
      setRecoveryNotice(notice);
      setReceipt(nextReceipt);
      setSession(nextSession);
      setPhase(nextPhase);
    } catch {
      setError(t('errors.importReconcileFail'));
    } finally {
      setBusy(false);
    }
  }

  async function onFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(null);
    setReceipt(null);
    setRecoveryNotice(null);
    setJournalSummary(null);
    journalReadSequence.current += 1;
    if (file.size > MAX_IMPORT_BYTES) {
      setError(t('errors.importTooLarge'));
      return;
    }
    setBusy(true);
    try {
      const text = await readFileText(file);
      const result = ingestSettlementForgeExport(text, {
        label: file.name,
        ingestedAt: null,
        storageRef: null,
      });
      if (result.ok !== true) {
        setError(result.diagnostic?.message || t('errors.importUnsupported'));
        return;
      }
      setIngest(result.value);
      if (result.value.sourceCampaigns.length > 1) {
        setSourceCampaignId('');
        setPhase('source');
      } else {
        await admitSource(result.value);
      }
    } catch (readError) {
      setError(readError instanceof Error
        ? readError.message
        : t('errors.importUnreadable'));
    } finally {
      setBusy(false);
    }
  }

  function chooseProposal(proposal, value) {
    if (!value) return;
    if (value.startsWith('match:')) {
      const candidateId = value.slice('match:'.length);
      const candidate = proposal.candidates.find(item => item.candidateId === candidateId);
      if (!candidate) return;
      setSession(current => decideImportProposal(current, proposal.proposalId, {
        action: 'match',
        targetSaveId: candidate.targetSaveId,
        actor: 'user',
        decidedAt: new Date().toISOString(),
      }));
      return;
    }
    setSession(current => decideImportProposal(current, proposal.proposalId, {
      action: value,
      actor: 'user',
      decidedAt: new Date().toISOString(),
    }));
  }

  function buildPreview() {
    const result = previewImportReconciliation(session);
    if (result.ok !== true) {
      setError(result.error || t('errors.importDecisionsOpen'));
      return;
    }
    setError(null);
    setSession(result.value);
    setPhase('preview');
  }

  async function applyPreview(reconcileDurable = false) {
    if (typeof executeDraft !== 'function') return;
    setBusy(true);
    setError(null);
    try {
      const attemptedAt = new Date().toISOString();
      const result = await applyImportReconciliation(session, {
        executeDraft: (draft, executionOptions = {}) => executeDraft(draft, {
          ...executionOptions,
          importSessionId: session.sessionId,
          sourceChecksum: session.source.checksum,
          requestedAt: attemptedAt,
        }),
        priorReceipt: receipt,
        attemptedAt,
        reconcileDurable,
      });
      if (result.value) setSession(result.value);
      if (result.receipt) {
        setReceipt(result.receipt);
        setPhase('result');
      } else {
        setError(result.error || t('errors.importApplyFail'));
      }
    } catch {
      setError(t('errors.importCommandFail'));
    } finally {
      setBusy(false);
    }
  }

  const decisionSummary = session
    ? reconciliationDecisionSummary(session)
    : null;
  const canExecute = typeof executeDraft === 'function' && Boolean(ownerId);
  const canApply = canExecute && session?.stage !== 'applied';
  const retryableFailures = receipt?.failures?.filter(
    failure => !failure.needsReconciliation,
  ).length || 0;
  const reconcilableFailures = receipt?.failures?.filter(
    failure => failure.needsReconciliation,
  ).length || 0;

  function downloadRecoveryReceipt() {
    const record = session && ownerId
      ? persistImportReconciliationRecovery(session, ownerId, { receipt })
      : null;
    const encoded = serializeImportReconciliationRecovery(record);
    if (
      !encoded
      || typeof URL === 'undefined'
      || typeof URL.createObjectURL !== 'function'
    ) {
      setError(t('errors.importRecoveryFail'));
      return;
    }
    const url = URL.createObjectURL(new Blob([encoded], {
      type: 'application/json',
    }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settlementforge-import-recovery.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
      <div>
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={12} />}
          onClick={phase === 'file' ? onBack : () => {
            setError(null);
            if (phase === 'review') setPhase('file');
            else if (phase === 'source') setPhase('file');
            else if (phase === 'preview') setPhase('review');
            else setPhase('preview');
          }}
        >
          Back
        </Button>
      </div>

      {recoveryNotice && (
        <div role="status" style={{
          border: `1px solid ${BORDER}`,
          padding: SP.sm,
          color: BODY,
          background: CARD_ALT,
          fontFamily: sans,
          fontSize: FS.xs,
          lineHeight: 1.45,
        }}>
          {recoveryNotice}
        </div>
      )}

      {phase === 'file' && (
        <>
          <div>
            <h3 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.md }}>
              Reconcile a SettlementForge export
            </h3>
            <p style={{
              margin: `${SP.xs}px 0 0`,
              color: BODY,
              fontFamily: sans,
              fontSize: FS.xs,
              lineHeight: 1.5,
            }}>
              Compare settlements from an earlier export with this campaign. The file is
              reviewed locally first; nothing is created, replaced, or attached on upload.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Upload size={12} />}
            onClick={() => fileRef.current?.click()}
            disabled={busy}
          >
            {busy ? 'Reading export…' : 'Choose SettlementForge export'}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            aria-label="SettlementForge export file"
            onChange={onFile}
            style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
          />
          <p style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: FS.xxs }}>
            Structured SettlementForge JSON only, up to 5 MB. Campaign prose is preserved
            as authored content and is never inferred into events or simulation facts.
          </p>
        </>
      )}

      {phase === 'source' && ingest && (
        <>
          <h3 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.md }}>
            Choose the source campaign
          </h3>
          <select
            aria-label="Source campaign"
            value={sourceCampaignId}
            onChange={event => setSourceCampaignId(event.target.value)}
            style={reconciliationFieldStyle}
          >
            <option value="">Choose a campaign…</option>
            {ingest.sourceCampaigns.map(source => (
              <option key={source.choiceId} value={source.choiceId}>
                {source.name} · {source.settlementIds.length} settlement
                {source.settlementIds.length === 1 ? '' : 's'}
              </option>
            ))}
          </select>
          <Button
            variant="primary"
            size="sm"
            icon={<Check size={12} />}
            disabled={!sourceCampaignId || busy}
            onClick={() => admitSource(ingest, sourceCampaignId)}
          >
            Compare this campaign
          </Button>
        </>
      )}

      {phase === 'review' && session && decisionSummary && (
        <>
          <div role="status" style={{ color: BODY, fontFamily: sans, fontSize: FS.xs }}>
            {decisionSummary.total - decisionSummary.undecided} of {decisionSummary.total}
            {' '}settlements decided. Every row needs an explicit choice.
          </div>
          <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
            {session.proposals.map(proposal => (
              <ImportProposalRow
                key={proposal.proposalId}
                proposal={proposal}
                conflicts={session.conflicts.filter(conflict => (
                  conflict.proposalId === proposal.proposalId
                ))}
                unsupported={session.unsupported.filter(issue => (
                  issue.proposalId === proposal.proposalId
                ))}
                onChoose={value => chooseProposal(proposal, value)}
              />
            ))}
          </ul>
          {session.proposals.length === 0 && (
            <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.xs }}>
              No readable settlement records were found in the selected source scope.
            </p>
          )}
          {session.unsupported.length > 0 && (
            <details style={{ color: BODY, fontFamily: sans, fontSize: FS.xs }}>
              <summary>
                {session.unsupported.length} item
                {session.unsupported.length === 1 ? '' : 's'} not applied by this pass
              </summary>
              <ul>
                {session.unsupported.map(issue => (
                  <li key={issue.issueId}>{issue.message}</li>
                ))}
              </ul>
            </details>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={<Eye size={12} />}
            disabled={decisionSummary.undecided > 0}
            onClick={buildPreview}
          >
            Preview exact changes
          </Button>
        </>
      )}

      {phase === 'preview' && session?.preview && (
        <>
          <div>
            <h3 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.md }}>
              Review the reconciliation plan
            </h3>
            <p style={{
              margin: `${SP.xs}px 0 0`,
              color: BODY,
              fontFamily: sans,
              fontSize: FS.xs,
              lineHeight: 1.5,
            }}>
              This is a bounded plan from your structured choices, not a simulation.
              No changes have been written yet.
            </p>
          </div>
          <ImportPreviewFacts preview={session.preview} />
          <ImportMembershipTransfers session={session} />
          {!canExecute && (
            <div role="status" style={{
              border: `1px solid ${BORDER}`,
              padding: SP.sm,
              color: BODY,
              background: CARD_ALT,
              fontFamily: sans,
              fontSize: FS.xs,
              lineHeight: 1.45,
            }}>
              {typeof executeDraft !== 'function'
                ? 'Applying structured reconciliation is not available in this build because the command adapter is not installed.'
                : 'Sign in to apply this owner-scoped reconciliation.'}
              {' '}Your campaign has not changed.
            </div>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={<Check size={12} />}
            disabled={!canApply || busy}
            onClick={() => applyPreview(false)}
          >
            {busy
              ? 'Applying…'
              : session.stage === 'applied'
                ? 'Reconciliation already applied'
                : 'Apply this reconciliation'}
          </Button>
        </>
      )}

      {phase === 'result' && receipt && (
        <>
          <FileJson size={20} color={receipt.ok ? GREEN : GOLD} aria-hidden="true" />
          <h3 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.md }}>
            {receipt.ok ? 'Reconciliation applied' : 'Reconciliation needs attention'}
          </h3>
          <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.xs }}>
            {receipt.commandReceipts.filter(item => item.ok).length} of
            {' '}{receipt.commandReceipts.length} command drafts completed. The receipt
            retains every completed and pending draft for safe recovery.
          </p>
          {session && ownerId && (
            <p style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: FS.xxs }}>
              A bounded private recovery record is saved on this device. It contains
              decisions and redacted command receipts, not the uploaded settlement
              content. Reopening still requires the same export file.
            </p>
          )}
          {journalSummary && !journalSummary.unavailable && (
            <p role="status" style={{
              margin: 0,
              color: BODY,
              fontFamily: sans,
              fontSize: FS.xs,
            }}>
              Durable journal: {journalSummary.applied} applied,
              {' '}{journalSummary.unresolved} unresolved,
              {' '}{journalSummary.found} found for this recovered plan.
            </p>
          )}
          {journalSummary?.unavailable && (
            <p role="status" style={{
              margin: 0,
              color: MUTED,
              fontFamily: sans,
              fontSize: FS.xs,
            }}>
              The durable journal could not be checked. No command was retried.
            </p>
          )}
          {retryableFailures > 0 && (
            <Button
              variant="primary"
              size="sm"
              icon={<RefreshCw size={12} />}
              disabled={busy}
              onClick={() => applyPreview(false)}
            >
              Retry {retryableFailures} known failure
              {retryableFailures === 1 ? '' : 's'}
            </Button>
          )}
          {reconcilableFailures > 0 && (
            <Button
              variant="primary"
              size="sm"
              icon={<RefreshCw size={12} />}
              disabled={busy || !canApply}
              onClick={() => applyPreview(true)}
            >
              Check {reconcilableFailures} durable outcome
              {reconcilableFailures === 1 ? '' : 's'}
            </Button>
          )}
          {session && ownerId && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Download size={12} />}
              disabled={busy}
              onClick={downloadRecoveryReceipt}
            >
              Download private recovery receipt
            </Button>
          )}
        </>
      )}

      {error && (
        <div role="alert" style={{ color: RED, fontFamily: sans, fontSize: FS.xs }}>
          {error}
        </div>
      )}
    </div>
  );
}
