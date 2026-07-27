/**
 * components/surveyor/InterpretApplyPanel.jsx — ACCEPT→MINT SURFACED (Surveyor S3→S4 seam).
 * Session text compiles into PROPOSED ops; the DM reviews each — approve / edit / reject — and
 * accepted ops apply through the lazy application-command boundary and its EXISTING store-writer
 * adapters, never a bypass. Two structural guarantees are made visible: the PROTECTED-CONSENT
 * BARRIER (a flagged op cannot be approved without an explicit consent tick — it lands in
 * `blocked`), and NEVER-DROPPED honesty (an op that names no dispatchable command is surfaced as
 * `unroutable`, not silently swallowed). Every proposal has a stable command id and every run
 * carries the reproducibility summary (engine version + seed). Transport, review, and command
 * execution remain dynamic-imported (off first paint).
 */

import { useState, useCallback, useMemo } from 'react';
import { Check, Pencil, RefreshCw, X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { operationLabel } from '../../store/operationRegistry.js';
import { getSurveyorAiCost } from '../../config/pricing.js';
import { INK, BODY, MUTED, BORDER, CARD_ALT, GOLD, GREEN, RED, SLATE, sans, SP, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import Badge from '../primitives/Badge.jsx';
import { t } from '../../copy/index.js';
import { identityConsentNote } from '../../domain/intent/opVocabulary.js';
import { useSurveyorContext } from './useSurveyorContext.js';
import { MoneyLine, RefusalNote, MusingsBlock, Eyebrow, PromptArea, ReceiptLine, ProposalSlipLine } from './surveyorPanelKit.jsx';

const cost = getSurveyorAiCost('interpret');
const OP_LABEL_TONE = { required: 'gold', inferred: 'info', optional: 'muted', uncertain: 'warning' };
let reviewSequence = 0;

/**
 * One successful compile creates one review artifact. Its local reference is
 * stable for every Apply click on that review but unique from a later compile
 * of identical text, which makes replay protect retries without suppressing a
 * deliberate later command.
 */
function mintReviewRef() {
  const randomId = globalThis.crypto?.randomUUID?.();
  if (randomId) return `review:${randomId}`;
  reviewSequence += 1;
  return `review:${Date.now().toString(36)}:${reviewSequence.toString(36)}`;
}

function commandContextSnapshot({
  ownerId,
  activeSaveId,
  activeCampaignId,
  activeCampaign,
  savedSettlements,
}) {
  const save = activeSaveId == null
    ? null
    : (savedSettlements || []).find(
        (entry) => String(entry?.id) === String(activeSaveId),
      );
  const campaignTick = activeCampaign?.worldState?.tick;
  const campaignStamp = activeCampaign?.updatedAt;
  return {
    ownerId: ownerId ?? null,
    saveId: activeSaveId ?? null,
    campaignId: activeCampaignId ?? null,
    saveRevision: save?.timestamp
      ?? save?.campaignState?.editedAt
      ?? null,
    campaignRevision: activeCampaign
      ? `${campaignStamp ?? 'unstamped'}:${campaignTick ?? 'unticked'}`
      : null,
  };
}

function currentCommandContext() {
  const state = useStore.getState();
  const activeCampaignId = state.activeCampaignId ?? null;
  const activeCampaign = activeCampaignId == null
    ? null
    : (state.campaigns || []).find(
        (campaign) => String(campaign?.id) === String(activeCampaignId),
      ) || null;
  return commandContextSnapshot({
    ownerId: state.auth?.user?.id ?? null,
    activeSaveId: state.activeSaveId ?? null,
    activeCampaignId,
    activeCampaign,
    savedSettlements: state.savedSettlements,
  });
}

function canonRecoveryMessage(recovery) {
  if (recovery?.recovered && recovery.authorityState === 'applied') {
    return t('canonRecovery.applied');
  }
  if (recovery?.recovered && recovery.authorityState === 'proved-absent') {
    return t('canonRecovery.provedAbsent');
  }
  if (recovery?.authorityState === 'terminal-no-commit') {
    return t('canonRecovery.terminalNoCommit');
  }
  if (recovery?.authorityState === 'unresolved') {
    return t('canonRecovery.unresolved');
  }
  if (recovery?.authorityState === 'unavailable') {
    return t('canonRecovery.unavailable');
  }
  if (recovery?.status === 'stale') {
    return t('canonRecovery.stale');
  }
  if (recovery) {
    return t('canonRecovery.unconfirmed');
  }
  return t('canonRecovery.ambiguous');
}

function canonAuthorityReceipt(recovery) {
  return recovery?.authorityReceipt
    || recovery?.receipt?.result?.commandPersistence?.authorityReceipt
    || null;
}

/** One proposed op's review row. Protected ops expose the consent tick (the barrier). */
function OpCard({ op, index, decision, onDecide }) {
  const action = decision?.action || 'pending';
  const protectedFlags = Array.isArray(op.protectedFlags) ? op.protectedFlags : [];
  const isProtected = protectedFlags.length > 0;
  const params = (op.params && typeof op.params === 'object') ? op.params : {};
  const editedType = decision?.editedType ?? op.opType;

  return (
    <div
      data-testid={`op-${index}`}
      style={{
        border: `1px solid ${action === 'reject' ? BORDER : action === 'approve' ? GOLD : SLATE}`, padding: SP.sm,
        background: action === 'reject' ? CARD_ALT : '#fff', opacity: action === 'reject' ? 0.6 : 1,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
        {/* The authored, human label for the proposed verb (falls back to the raw
            opType for an unregistered/edited verb); the opType stays as a small
            monospace reference since it is the verb actually dispatched. */}
        <span style={{ fontSize: FS.sm, color: INK, fontFamily: sans, fontWeight: 700 }}>{operationLabel(op.opType)}</span>
        <code style={{ fontSize: FS.xxs, color: MUTED, fontFamily: 'monospace' }}>{op.opType}</code>
        {op.label && <Badge tone={OP_LABEL_TONE[op.label] || 'muted'} size="sm">{op.label}</Badge>}
        {isProtected && <Badge tone="danger" size="sm">protected</Badge>}
        <span style={{ flex: 1 }} />
        <IconButton Icon={Check} label="Approve this op" size="sm" tone={action === 'approve' ? 'active' : 'default'}
          pressed={action === 'approve'} onClick={() => onDecide(index, { ...decision, action: 'approve' })} />
        <IconButton Icon={Pencil} label="Edit this op" size="sm" tone={action === 'edit' ? 'active' : 'default'}
          pressed={action === 'edit'} onClick={() => onDecide(index, { ...decision, action: 'edit' })} />
        <IconButton Icon={X} label="Reject this op" size="sm" tone={action === 'reject' ? 'active' : 'default'}
          pressed={action === 'reject'} onClick={() => onDecide(index, { ...decision, action: 'reject' })} />
      </div>

      {action === 'edit' && (
        <input
          aria-label="Edit op type"
          value={editedType}
          onChange={(e) => onDecide(index, { ...decision, action: 'edit', editedType: e.target.value })}
          style={{ fontSize: FS.xs, fontFamily: sans, color: INK, border: `1px solid ${BORDER}`, padding: `2px ${SP.xs}px` }}
        />
      )}

      {Object.keys(params).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(params).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: SP.xs }}>
              <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, minWidth: 78 }}>{k}</span>
              <span style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
            </div>
          ))}
        </div>
      )}

      {isProtected && (
        <label htmlFor={`surveyor-consent-${index}`} style={{ display: 'flex', alignItems: 'center', gap: SP.xs, fontSize: FS.xs, color: RED, fontFamily: sans }}>
          <input
            id={`surveyor-consent-${index}`}
            type="checkbox"
            checked={decision?.consented === true}
            onChange={(e) => onDecide(index, { ...decision, consented: e.target.checked })}
            aria-label={`Consent to the protected op ${operationLabel(op.opType)}`}
          />
          {/* Wave R-1 (named-fate consent): a verb that DELETES a named character says so
              before the tick — consent to a party-caused kill is informed consent to the
              roster deletion its world-pulse linkage triggers. Generic copy is unchanged
              for every other protected op. */}
          {(() => {
            const note = identityConsentNote(op);
            const base = 'This op touches a protected constraint. Tick to consent, or it will not apply.';
            return note ? `${note} ${base}` : base;
          })()}
        </label>
      )}
    </div>
  );
}

export default function InterpretApplyPanel({ initialPrompt = '' }) {
  const {
    creditBalance,
    ownerId,
    ctx,
    activeCampaignId,
    activeCampaign,
    activeSaveId,
    savedSettlements,
  } = useSurveyorContext();
  const applyEvent = useStore((s) => s.applyEvent);
  const recordPartyImpact = useStore((s) => s.recordPartyImpact);
  // Wave R-1 (named-fate consent): the lifecycle phase feeds the protected context the
  // compile POSTs and the client-side identity-flag hardening below.
  const phase = useStore((s) => s.phase);
  const readLiveCommandContext = useCallback(() => currentCommandContext(), []);
  const liveCommandContext = useMemo(() => commandContextSnapshot({
    ownerId,
    activeSaveId,
    activeCampaignId,
    activeCampaign,
    savedSettlements,
  }), [
    ownerId,
    activeSaveId,
    activeCampaignId,
    activeCampaign,
    savedSettlements,
  ]);

  const [sessionText, setSessionText] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { interpretation, seed, interpretRef, musings, byok } | { error }
  const [decisions, setDecisions] = useState({});
  const [applyResult, setApplyResult] = useState(null); // { applied, failed, unroutable, log, blocked }
  const [applying, setApplying] = useState(false);
  const [recoveringCommandId, setRecoveringCommandId] = useState(null);
  const [recoveryError, setRecoveryError] = useState(null);

  const compile = useCallback(async () => {
    const q = sessionText.trim();
    if (!q || loading) return;
    setLoading(true);
    setResult(null);
    setDecisions({});
    setApplyResult(null);
    setRecoveryError(null);
    try {
      const [{ compileInterpretation }, { buildProtectedContext, applyIdentityConsentFlags }] = await Promise.all([
        import('../../lib/surveyorWrite.js'),
        import('../../domain/intent/opVocabulary.js'),
      ]);
      // Wave R-1 (named-fate consent, atlas queue #2): POST the protected context the
      // edge's flagProtected needs. Without it NO op was ever flagged — the consent
      // barrier existed at both ends but the live lane never carried the context.
      const res = await compileInterpretation({
        ...ctx, sessionText: q,
        protectedContext: buildProtectedContext(ctx.settlement, phase),
      });
      // Capture the addressed owner/save/campaign at compile time. If the user
      // navigates or the source revision changes during review, the command
      // executor refuses the stale proposal instead of applying it elsewhere.
      setResult(res.ok
        ? {
            ...res,
            // Client-side hardening: union the CANON_IDENTITY flag locally so the
            // barrier holds even against a deployed edge that predates the party-arm
            // rule. Union-only — edge-computed flags are never removed.
            interpretation: applyIdentityConsentFlags(res.interpretation, {
              identityLockedPhase: phase === 'canon',
            }),
            commandTarget: liveCommandContext,
            reviewRef: mintReviewRef(),
          }
        : { error: res.error, refusalClass: res.refusalClass, doors: res.doors });
    } catch {
      setResult({ error: 'The Surveyor is unavailable right now.' });
    } finally {
      setLoading(false);
    }
  }, [sessionText, loading, ctx, phase, liveCommandContext]);

  const decide = useCallback((index, decision) => setDecisions((d) => ({ ...d, [index]: decision })), []);

  const applyAccepted = useCallback(async () => {
    const interpretation = result?.interpretation;
    if (!interpretation) return;
    setApplying(true);
    setRecoveryError(null);
    try {
      const { reviewInterpretation } = await import('../../domain/intent/interpretReview.js');
      const { runInterpretApply } = await import('../../lib/intent/interpretApply.js');
      const { accepted, blocked, corrections } = reviewInterpretation(interpretation, decisions);
      const { EVENTS, track } = await import('../../lib/analytics.js');
      for (const correction of corrections) {
        track(EVENTS.AI_INTERPRET_CORRECTION, {
          correctionClass: correction.class,
        });
      }
      track(EVENTS.SURVEYOR_ADOPTION, {
        surface: 'interpret',
        verdict: corrections.length > 0 ? 'revised' : 'accepted',
      });
      const res = await runInterpretApply({
        accepted, blocked, corrections,
        targetContext: result.commandTarget || liveCommandContext,
        currentContext: liveCommandContext,
        readCurrentContext: readLiveCommandContext,
        seed: result.seed,
        interpretRef: result.interpretRef,
        reviewRef: result.reviewRef,
        now: new Date().toISOString(),
        actions: { applyEvent, recordPartyImpact },
      });
      setApplyResult({ ...res, blocked });
    } catch {
      setApplyResult({ error: 'Apply failed.' });
    } finally {
      setApplying(false);
    }
  }, [
    result,
    decisions,
    liveCommandContext,
    readLiveCommandContext,
    applyEvent,
    recordPartyImpact,
  ]);

  const reconcileCanonCommand = useCallback(async (commandResult) => {
    const command = commandResult?.recoveryCommand;
    if (!command || recoveringCommandId) return;
    setRecoveringCommandId(command.commandId);
    setRecoveryError(null);
    try {
      const [
        { recoverCanonEventCommand },
        { mergeCanonEventRecoveryResult },
      ] = await Promise.all([
        import('../../application/commands/canonEventCommandRecovery.js'),
        import('../../lib/intent/interpretApply.js'),
      ]);
      const snapshot = currentCommandContext();
      const recovery = await recoverCanonEventCommand(command, {
        context: {
          ownerId: snapshot.ownerId,
          saveId: snapshot.saveId,
          campaignId: snapshot.campaignId,
          revision: snapshot.saveRevision,
          now: command.requestedAt,
          actions: { applyEvent, recordPartyImpact },
        },
        readCurrentContext: () => {
          const current = readLiveCommandContext();
          return {
            ownerId: current.ownerId,
            saveId: current.saveId,
            campaignId: current.campaignId,
            revision: current.saveRevision,
          };
        },
      });
      setApplyResult(previous => mergeCanonEventRecoveryResult(
        previous,
        command.commandId,
        recovery,
      ));
    } catch {
      setRecoveryError(t('errors.canonRecoveryOpenFail'));
    } finally {
      setRecoveringCommandId(null);
    }
  }, [
    applyEvent,
    readLiveCommandContext,
    recordPartyImpact,
    recoveringCommandId,
  ]);

  const interpretation = result?.interpretation;
  const ops = Array.isArray(interpretation?.ops) ? interpretation.ops : [];
  const anyApproved = Object.values(decisions).some((d) => d?.action === 'approve' || d?.action === 'edit');
  const canonRecoveryResults = (applyResult?.commandResults || []).filter(
    item => item.recoveryCommand || item.recovery,
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
      <Eyebrow>Interpret a session · paste what happened</Eyebrow>
      <PromptArea
        value={sessionText}
        onChange={setSessionText}
        label="Paste the session recap for the Surveyor to interpret into proposed ops"
        placeholder="e.g. The party sacked the customs house and named the Ashford cartel as the force behind the raids…"
        rows={3}
        disabled={loading}
      />
      <MoneyLine cost={cost} creditBalance={creditBalance} busy={loading} disabled={!sessionText.trim()} onSubmit={compile}
        submitLabel="Interpret" busyLabel="Interpreting…" />

      {result?.error && <RefusalNote error={result.error} refusalClass={result.refusalClass} doors={result.doors} />}
      <MusingsBlock musings={result?.musings} />

      {interpretation && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm }}>
          <Eyebrow>Proposed ops · approve, edit, or reject each</Eyebrow>
          <ProposalSlipLine />
          {ops.length === 0 && <p style={{ margin: 0, fontSize: FS.sm, color: MUTED }}>The Surveyor proposed no ops from this text.</p>}
          {ops.map((op, i) => (
            <OpCard key={i} op={op} index={i} decision={decisions[i]} onDecide={decide} />
          ))}

          <Button variant="primary" size="sm" busy={applying} disabled={!anyApproved || applying} onClick={applyAccepted}>
            Apply accepted ops
          </Button>

          {applyResult?.error && <p style={{ margin: 0, fontSize: FS.sm, color: RED }}>{applyResult.error}</p>}

          {applyResult && !applyResult.error && (
            <div data-testid="apply-result" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, lineHeight: 1.5 }}>
                <span style={{ color: GREEN }}>◆</span> Applied {applyResult.applied?.length ?? 0}
                {applyResult.failed?.length > 0 && <span> · {applyResult.failed.length} failed</span>}
                {applyResult.commandResults?.some((item) => item.status === 'reconcile-required') && (
                  <span> · reconciliation required</span>
                )}
                {applyResult.unroutable?.length > 0 && <span> · {applyResult.unroutable.length} unroutable</span>}
                {applyResult.blocked?.length > 0 && <span> · {applyResult.blocked.length} blocked (needs consent)</span>}
              </div>
              {applyResult.unroutable?.length > 0 && (
                <div data-testid="apply-unroutable" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
                  Unroutable (no verb, surfaced not dropped): {applyResult.unroutable.map((u) => operationLabel(u.opType)).join(', ')}
                </div>
              )}
              {applyResult.failed?.length > 0 && (
                <div style={{ fontSize: FS.xs, color: RED, fontFamily: sans }}>
                  Failed: {applyResult.failed.map((f) => `${operationLabel(f.opType)} (${f.reason})`).join(', ')}
                </div>
              )}
              {canonRecoveryResults.map((item) => {
                const recovery = item.recovery || null;
                const authorityReceipt = canonAuthorityReceipt(recovery);
                const canCheck = (
                  item.status === 'reconcile-required'
                  && Boolean(item.recoveryCommand)
                );
                return (
                  <div
                    key={`canon-recovery:${item.commandId}`}
                    data-testid="canon-command-recovery"
                    role="status"
                    style={{
                      border: `1px solid ${recovery?.recovered ? GREEN : GOLD}`,
                      background: CARD_ALT,
                      padding: SP.sm,
                      color: BODY,
                      fontFamily: sans,
                      fontSize: FS.xs,
                      lineHeight: 1.45,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: SP.xs,
                    }}
                  >
                    <span>{canonRecoveryMessage(recovery)}</span>
                    {authorityReceipt && (
                      <span style={{ color: MUTED, fontSize: FS.xxs }}>
                        {t('canonRecovery.receiptLabel')}: {authorityReceipt.eventType || t('canonRecovery.eventFallback')}
                        {authorityReceipt.updatedAt
                          ? ` · ${authorityReceipt.updatedAt}`
                          : ''}
                      </span>
                    )}
                    {canCheck && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<RefreshCw size={12} />}
                        busy={recoveringCommandId === item.commandId}
                        disabled={Boolean(recoveringCommandId)}
                        onClick={() => reconcileCanonCommand(item)}
                      >
                        {t('canonRecovery.checkOutcome')}
                      </Button>
                    )}
                  </div>
                );
              })}
              {recoveryError && (
                <div role="alert" style={{ color: RED, fontFamily: sans, fontSize: FS.xs }}>
                  {recoveryError}
                </div>
              )}
              <ReceiptLine engineVersion={applyResult.log?.engineVersion} seed={applyResult.log?.seed} applied={applyResult.log?.appliedCount} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
