/**
 * components/surveyor/InterpretApplyPanel.jsx — ACCEPT→MINT SURFACED (Surveyor S3→S4 seam).
 * Session text compiles into PROPOSED ops; the DM reviews each — approve / edit / reject — and
 * accepted ops apply through the EXISTING store verbs (applyEvent / recordPartyImpact), never a
 * bypass. Two structural guarantees are made visible: the PROTECTED-CONSENT BARRIER (a flagged
 * op cannot be approved without an explicit consent tick — it lands in `blocked`), and NEVER-
 * DROPPED honesty (an op that names no dispatchable verb is surfaced as `unroutable`, not
 * silently swallowed). Every apply carries the REPRODUCIBILITY RECEIPT (engine version + seed).
 * The transport + the pure review/apply halves are dynamic-imported (off first paint).
 */

import { useState, useCallback } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { getSurveyorAiCost } from '../../config/pricing.js';
import { INK, BODY, MUTED, BORDER, CARD_ALT, GOLD, GREEN, RED, VIOLET, sans, SP, R, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import Badge from '../primitives/Badge.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import { MoneyLine, RefusalNote, MusingsBlock, Eyebrow, PromptArea, ReceiptLine, ProposalSlipLine } from './surveyorPanelKit.jsx';

const cost = getSurveyorAiCost('interpret');
const OP_LABEL_TONE = { required: 'gold', inferred: 'info', optional: 'muted', uncertain: 'warning' };

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
        border: `1px solid ${action === 'reject' ? BORDER : action === 'approve' ? GOLD : VIOLET}`, borderRadius: R.md, padding: SP.sm,
        background: action === 'reject' ? CARD_ALT : '#fff', opacity: action === 'reject' ? 0.6 : 1,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
        <span style={{ fontSize: FS.sm, color: INK, fontFamily: sans, fontWeight: 700 }}>{op.opType}</span>
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
          style={{ fontSize: FS.xs, fontFamily: sans, color: INK, border: `1px solid ${BORDER}`, borderRadius: R.sm, padding: `2px ${SP.xs}px` }}
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
            aria-label={`Consent to the protected op ${op.opType}`}
          />
          This op touches a protected constraint — tick to consent, or it will not apply.
        </label>
      )}
    </div>
  );
}

export default function InterpretApplyPanel({ initialPrompt = '' }) {
  const { creditBalance, ctx, activeCampaignId, activeSaveId } = useSurveyorContext();
  const applyEvent = useStore((s) => s.applyEvent);
  const recordPartyImpact = useStore((s) => s.recordPartyImpact);

  const [sessionText, setSessionText] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { interpretation, seed, interpretRef, musings, byok } | { error }
  const [decisions, setDecisions] = useState({});
  const [applyResult, setApplyResult] = useState(null); // { applied, failed, unroutable, log, blocked }
  const [applying, setApplying] = useState(false);

  const compile = useCallback(async () => {
    const q = sessionText.trim();
    if (!q || loading) return;
    setLoading(true); setResult(null); setDecisions({}); setApplyResult(null);
    try {
      const { compileInterpretation } = await import('../../lib/surveyorWrite.js');
      const res = await compileInterpretation({ ...ctx, sessionText: q });
      setResult(res.ok ? res : { error: res.error, refusalClass: res.refusalClass, doors: res.doors });
    } catch {
      setResult({ error: 'The Surveyor is unavailable right now.' });
    } finally {
      setLoading(false);
    }
  }, [sessionText, loading, ctx]);

  const decide = useCallback((index, decision) => setDecisions((d) => ({ ...d, [index]: decision })), []);

  const applyAccepted = useCallback(async () => {
    const interpretation = result?.interpretation;
    if (!interpretation) return;
    setApplying(true);
    try {
      const { reviewInterpretation } = await import('../../domain/intent/interpretReview.js');
      const { runInterpretApply } = await import('../../lib/intent/interpretApply.js');
      const { accepted, blocked, corrections } = reviewInterpretation(interpretation, decisions);
      const res = await runInterpretApply({
        accepted, blocked, corrections,
        campaignId: activeCampaignId, saveId: activeSaveId,
        seed: result.seed, interpretRef: result.interpretRef,
        now: new Date().toISOString(),
        actions: { applyEvent, recordPartyImpact },
      });
      setApplyResult({ ...res, blocked });
    } catch {
      setApplyResult({ error: 'Apply failed.' });
    } finally {
      setApplying(false);
    }
  }, [result, decisions, activeCampaignId, activeSaveId, applyEvent, recordPartyImpact]);

  const interpretation = result?.interpretation;
  const ops = Array.isArray(interpretation?.ops) ? interpretation.ops : [];
  const anyApproved = Object.values(decisions).some((d) => d?.action === 'approve' || d?.action === 'edit');

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
                {applyResult.unroutable?.length > 0 && <span> · {applyResult.unroutable.length} unroutable</span>}
                {applyResult.blocked?.length > 0 && <span> · {applyResult.blocked.length} blocked (needs consent)</span>}
              </div>
              {applyResult.unroutable?.length > 0 && (
                <div data-testid="apply-unroutable" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
                  Unroutable (no verb, surfaced not dropped): {applyResult.unroutable.map((u) => u.opType).join(', ')}
                </div>
              )}
              {applyResult.failed?.length > 0 && (
                <div style={{ fontSize: FS.xs, color: RED, fontFamily: sans }}>
                  Failed: {applyResult.failed.map((f) => `${f.opType} (${f.reason})`).join(', ')}
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
