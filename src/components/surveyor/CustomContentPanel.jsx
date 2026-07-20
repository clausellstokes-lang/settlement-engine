/**
 * components/surveyor/CustomContentPanel.jsx — S4 CUSTOM CONTENT (DESIGN_AI_CONTROL_SURFACE
 * §2 stage 4). A lazy write-stage body: a homebrew request compiles (server-side, schema-
 * walled) into a validated ContentDraft; the DM reviews PER ENTRY — approve / edit / reject —
 * and only accepted entries mint through the EXISTING addCustomItem verb. Each field wears its
 * honest §9 label (MECHANICAL / FLAVOR / UNSUPPORTED); an unsupported answer renders honestly
 * — the label IS the answer, never a fake mechanic. The transport is dynamic-imported, so this
 * body's graph stays off first paint.
 */

import { useState, useCallback } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { getSurveyorAiCost } from '../../config/pricing.js';
import { INK, BODY, MUTED, BORDER, CARD_ALT, GOLD, GREEN, SLATE, sans, SP, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import Badge from '../primitives/Badge.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import {
  MoneyLine, RefusalNote, MusingsBlock, FieldLabelBadge, Eyebrow, PromptArea, ProposalSlipLine,
} from './surveyorPanelKit.jsx';

const BUCKET_LABEL = {
  institutions: 'Institution', services: 'Service', resources: 'Resource', stressors: 'Stressor',
  tradeGoods: 'Trade good', factions: 'Faction', deities: 'Deity',
};
const ENTRY_LABEL_TONE = { required: 'gold', inferred: 'info', optional: 'muted', uncertain: 'warning' };

const cost = getSurveyorAiCost('customContent');

/** A single drafted entry's review row (approve / edit / reject + the labelled fields). */
function DraftEntryCard({ entry: e, index, decision, onDecide }) {
  const action = decision?.action || 'pending';
  const labelMap = {};
  for (const fl of (Array.isArray(e.fieldLabels) ? e.fieldLabels : [])) labelMap[fl.field] = fl.kind;
  const baseEntry = (e.entry && typeof e.entry === 'object') ? e.entry : {};
  const edited = decision?.editedFields || {};
  const fieldKeys = Object.keys(baseEntry);

  const setField = (field, value) => onDecide(index, { action: 'edit', editedFields: { ...edited, [field]: value } });

  return (
    <div
      data-testid={`content-entry-${index}`}
      style={{
        border: `1px solid ${action === 'reject' ? BORDER : action === 'approve' ? GOLD : SLATE}`,
        padding: SP.sm, background: action === 'reject' ? CARD_ALT : '#fff',
        opacity: action === 'reject' ? 0.6 : 1, display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
        <Badge tone="neutral" size="sm">{BUCKET_LABEL[e.bucket] || e.bucket}</Badge>
        {e.label && <Badge tone={ENTRY_LABEL_TONE[e.label] || 'muted'} size="sm">{e.label}</Badge>}
        {e.sourced
          ? <span style={{ fontSize: FS.xs, color: GOLD }}>◆ grounded</span>
          : <span style={{ fontSize: FS.xs, color: MUTED }}>◇ the engine does not record this</span>}
        <span style={{ flex: 1 }} />
        <IconButton Icon={Check} label="Approve this entry" size="sm" tone={action === 'approve' ? 'active' : 'default'}
          pressed={action === 'approve'} onClick={() => onDecide(index, { action: 'approve' })} />
        <IconButton Icon={Pencil} label="Edit this entry" size="sm" tone={action === 'edit' ? 'active' : 'default'}
          pressed={action === 'edit'} onClick={() => onDecide(index, { action: 'edit', editedFields: edited })} />
        <IconButton Icon={X} label="Reject this entry" size="sm" tone={action === 'reject' ? 'active' : 'default'}
          pressed={action === 'reject'} onClick={() => onDecide(index, { action: 'reject' })} />
      </div>

      {e.rationale && <p style={{ margin: 0, fontSize: FS.xs, color: MUTED, lineHeight: 1.45 }}>{e.rationale}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {fieldKeys.map((field) => {
          const kind = labelMap[field] || 'flavor';
          const val = action === 'edit' && field in edited ? edited[field] : baseEntry[field];
          const editable = action === 'edit' && (kind === 'mechanical' || kind === 'flavor');
          return (
            <div key={field} style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
              <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, minWidth: 78 }}>{field}</span>
              <FieldLabelBadge kind={kind} />
              {editable ? (
                <input
                  aria-label={`Edit ${field}`}
                  value={typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')}
                  onChange={(ev) => setField(field, ev.target.value)}
                  style={{ flex: 1, minWidth: 96, fontSize: FS.xs, fontFamily: sans, color: INK,
                    border: `1px solid ${BORDER}`, padding: `2px ${SP.xs}px` }}
                />
              ) : (
                <span style={{ fontSize: FS.xs, color: kind === 'unsupported' ? MUTED : BODY, fontFamily: sans }}>
                  {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '—')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CustomContentPanel({ initialPrompt = '' }) {
  const { creditBalance, ctx } = useSurveyorContext();
  const addCustomItem = useStore((s) => s.addCustomItem);

  const [intent, setIntent] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { draft, musings, byok, earlyAccess } | { error, ... }
  const [decisions, setDecisions] = useState({});
  const [applied, setApplied] = useState(null); // { landed, failed, rejected }

  const compile = useCallback(async () => {
    const q = intent.trim();
    if (!q || loading) return;
    setLoading(true); setResult(null); setDecisions({}); setApplied(null);
    try {
      const { compileCustomContent } = await import('../../lib/surveyorWrite.js');
      const res = await compileCustomContent({ ...ctx, intent: q });
      setResult(res.ok ? res : { error: res.error, refusalClass: res.refusalClass, doors: res.doors });
    } catch {
      setResult({ error: 'The Surveyor is unavailable right now.' });
    } finally {
      setLoading(false);
    }
  }, [intent, loading, ctx]);

  const decide = useCallback((index, decision) => {
    setDecisions((d) => ({ ...d, [index]: decision }));
  }, []);

  const applyApproved = useCallback(async () => {
    const draft = result?.draft;
    if (!draft) return;
    const { reviewContentDraft } = await import('../../domain/content/contentReview.js');
    const { accepted, rejected } = reviewContentDraft(draft, decisions);
    let landed = 0; let failed = 0;
    for (const a of accepted) {
      const r = addCustomItem(a.bucket, a.entry);
      if (r === null) failed += 1; else landed += 1;
    }
    setApplied({ landed, failed, rejected: rejected.length });
  }, [result, decisions, addCustomItem]);

  const draft = result?.draft;
  const entries = Array.isArray(draft?.entries) ? draft.entries : [];
  const unsupported = Array.isArray(draft?.unsupported) ? draft.unsupported : [];
  const anyApproved = Object.values(decisions).some((d) => d?.action === 'approve' || d?.action === 'edit');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
      <Eyebrow>Homebrew content — describe what you want</Eyebrow>
      <PromptArea
        value={intent}
        onChange={setIntent}
        label="Describe the custom content you want the Surveyor to draft"
        placeholder="e.g. a smugglers' guild that fences stolen relics, criminal, medium economic weight…"
        disabled={loading}
      />
      <MoneyLine cost={cost} creditBalance={creditBalance} busy={loading} disabled={!intent.trim()} onSubmit={compile}
        submitLabel="Draft it" busyLabel="Drafting…" />

      {result?.error && <RefusalNote error={result.error} refusalClass={result.refusalClass} doors={result.doors} />}
      <MusingsBlock musings={result?.musings} />

      {draft && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm }}>
          <Eyebrow>Review each entry · approve, edit, or reject</Eyebrow>
          <ProposalSlipLine />
          {entries.length === 0 && <p style={{ margin: 0, fontSize: FS.sm, color: MUTED }}>Nothing landed in a registered content type.</p>}
          {entries.map((e, i) => (
            <DraftEntryCard key={i} entry={e} index={i} decision={decisions[i]} onDecide={decide} />
          ))}

          {unsupported.length > 0 && (
            <div data-testid="content-unsupported" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Eyebrow>Asked for, but the engine has no rule</Eyebrow>
              {unsupported.map((u, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
                  <FieldLabelBadge kind="unsupported" />
                  <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
                    {String(u.requested ?? u.field ?? u.key ?? 'unknown')}{u.reason ? ` — ${u.reason}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Button variant="primary" size="sm" disabled={!anyApproved} onClick={applyApproved}>
            Add approved to my content
          </Button>

          {applied && (
            <div data-testid="content-applied" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, lineHeight: 1.5 }}>
              <span style={{ color: GREEN }}>◆</span> Added {applied.landed} to your custom content
              {applied.failed > 0 && <span> · {applied.failed} failed validation</span>}
              {applied.rejected > 0 && <span> · {applied.rejected} rejected</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
