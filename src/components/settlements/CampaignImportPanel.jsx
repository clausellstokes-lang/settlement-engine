/**
 * CampaignImportPanel.jsx — V-17 THE CAMPAIGN IMPORT surface (lazy).
 *
 * Paste or upload your table's notes; a deterministic CLERK proposes a typed
 * backfill; you review and CONFIRM each event one at a time; confirmed events enter
 * the campaign chronicle as source:'table' history at the ticks you choose. Nothing
 * is written until you press Add — and only the events you confirmed.
 *
 * THE CLARITY CLAUSE governs here (this writes to your world): plain language over
 * costume on every control and confirmation. Keyboard-completable end to end (the
 * a11y showcase): a focus trap, Escape to close, labelled controls throughout.
 *
 * The mechanics live in the schema wall (domain/tableEvents.js) and the resumable
 * session (lib/campaignImport.js); this component is presentation + the confirm gate.
 */
import {
  lazy, Suspense, useState, useRef,
} from 'react';
import { Upload, Check, X, Plus, Trash2, ScrollText, FileJson } from 'lucide-react';
import {
  INK, BODY, MUTED, BORDER, CARD, CARD_ALT, GOLD, RED, GREEN,
  sans, serif_, FS, SP,
} from '../theme.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';
import { useStore } from '../../store/index.js';
import {
  TABLE_EVENT_KINDS, MAGNITUDE_BANDS, TABLE_EVENT_META,
} from '../../domain/tableEvents.js';
import {
  createImportSession, addBlankRow, updateRow, setRowConfirmed, setRowSkipped,
  confirmedRecords, importSummary,
} from '../../lib/campaignImport.js';

// Structured reconciliation pulls in hostile JSON admission and the settlement
// migration seam. Keep that graph behind its own user action; opening the notes
// importer should not pay for a workflow the user did not choose.
const StructuredCampaignReconciliation = lazy(
  () => import('./StructuredCampaignReconciliation.jsx'),
);

// Rule-framed, not rounded (the house plate idiom): no radius, no tint fills.
const fieldStyle = {
  padding: `${SP.xs}px ${SP.sm}px`, border: `1px solid ${BORDER}`,
  background: CARD, color: INK, fontFamily: sans, fontSize: FS.xs, minHeight: 32,
};
// Visible field descriptor (a11y names live on the controls themselves via aria-label).
const descStyle = { fontSize: FS.xxs, fontWeight: 700, color: MUTED, fontFamily: sans };

function currentTick(campaign) {
  const wt = Number(campaign?.worldState?.tick);
  if (Number.isFinite(wt)) return Math.max(0, Math.floor(wt));
  const ft = Number(campaign?.wizardNews?.currentTick);
  return Number.isFinite(ft) ? Math.max(0, Math.floor(ft)) : 0;
}

/** One reviewable event row. Every control carries a label (keyboard-completable). */
function ReviewRow({ row, settlements, onPatch, onConfirm, onSkip }) {
  const meta = TABLE_EVENT_META[row.kind] || { label: row.kind };
  return (
    <li style={{
      listStyle: 'none', border: `1px solid ${row.confirmed ? GREEN : BORDER}`,
      background: CARD_ALT,
      padding: SP.md, marginBottom: SP.sm, opacity: row.skipped ? 0.5 : 1,
      display: 'flex', flexDirection: 'column', gap: SP.sm,
    }}>
      <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={descStyle}>What happened</span>
        <select aria-label="What kind of event" value={row.kind} onChange={e => onPatch({ kind: e.target.value })} style={fieldStyle}>
          {TABLE_EVENT_KINDS.map(k => <option key={k} value={k}>{TABLE_EVENT_META[k]?.label || k}</option>)}
        </select>
        <span style={descStyle}>How big</span>
        <select aria-label="How big the event was" value={row.band} onChange={e => onPatch({ band: e.target.value })} style={fieldStyle}>
          {MAGNITUDE_BANDS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <span style={descStyle}>At tick</span>
        <input aria-label="At which tick" type="number" min={0} step={1} value={row.tick}
          onChange={e => onPatch({ tick: Math.max(0, Math.floor(Number(e.target.value) || 0)) })}
          style={{ ...fieldStyle, width: 76 }} />
        {!row.confident && (
          <span style={{ fontSize: FS.xxs, color: MUTED, fontStyle: 'italic', fontFamily: sans }}>
            unsure, set it yourself
          </span>
        )}
      </div>

      <span style={descStyle}>Your words (kept verbatim, shown in the chronicle, never changes the mechanics)</span>
      <textarea aria-label="Your words for this event, kept verbatim" value={row.flavor} rows={2}
        onChange={e => onPatch({ flavor: e.target.value })}
        placeholder="What the table remembers…"
        style={{ ...fieldStyle, resize: 'vertical', fontFamily: serif_, fontSize: FS.sm }} />

      {settlements.length > 0 && (
        <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', gap: SP.md, flexWrap: 'wrap' }}>
          <legend style={{ ...descStyle, padding: 0 }}>Which settlements</legend>
          {settlements.map(s => {
            const id = String(s.id);
            const on = row.settlementIds.includes(id);
            const label = s.name || s.settlement?.name || id;
            return (
              <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs, fontSize: FS.xs, color: BODY, fontFamily: sans }}>
                <input type="checkbox" checked={on} aria-label={label}
                  onChange={() => onPatch({ settlementIds: on ? row.settlementIds.filter(x => x !== id) : [...row.settlementIds, id] })} />
                {label}
              </span>
            );
          })}
        </fieldset>
      )}

      <div style={{ display: 'flex', gap: SP.sm, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant={row.confirmed ? 'secondary' : 'primary'} size="sm"
          icon={<Check size={12} />}
          onClick={() => onConfirm(!row.confirmed)}
          aria-pressed={row.confirmed}>
          {row.confirmed ? 'Confirmed' : 'Confirm this event'}
        </Button>
        <Button variant="ghost" size="sm" icon={<Trash2 size={12} />} onClick={() => onSkip(!row.skipped)}>
          {row.skipped ? 'Keep' : 'Skip'}
        </Button>
        <span aria-hidden="true" style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans }}>
          {meta.label} · {row.band}
        </span>
      </div>
    </li>
  );
}

export default function CampaignImportPanel({ campaign, settlements = [], onClose }) {
  const importTableEvents = useStore(s => s.importTableEvents);
  // Notes and structured exports share the same campaign entry point but keep
  // separate trust models: notes propose table events; reconciliation admits
  // only a structured SettlementForge export and never infers prose mechanics.
  const [step, setStep] = useState('paste'); // paste | review | done | reconcile
  const [notes, setNotes] = useState('');
  const [session, setSession] = useState(null);
  const [committed, setCommitted] = useState(0);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const dialogRef = useDialogFocusTrap(true, onClose);

  const members = Array.isArray(settlements) ? settlements : [];
  const defaultTick = currentTick(campaign);

  function readNotes() {
    setSession(createImportSession(notes, { defaultTick }));
    setStep('review');
  }
  function startManual() {
    setSession(addBlankRow(createImportSession('', { defaultTick }), { tick: defaultTick }));
    setStep('review');
  }
  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNotes(String(reader.result || ''));
    reader.readAsText(file);
  }
  function patchRow(index, patch) { setSession(s => updateRow(s, index, patch)); }
  function confirmRow(index, on) { setSession(s => setRowConfirmed(s, index, on)); }
  function skipRow(index, on) { setSession(s => setRowSkipped(s, index, on)); }

  function commit() {
    setError(null);
    try {
      const records = confirmedRecords(session);
      if (!records.length) return;
      const n = importTableEvents(campaign.id, records);
      setCommitted(n);
      setStep('done');
    } catch {
      setError(t('errors.saveFailed'));
    }
  }

  const summary = session ? importSummary(session) : { total: 0, confirmed: 0, skipped: 0, pending: 0, ready: false };

  return (
    <div role="presentation" className="oc-m-warmdim"
      style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SP.lg }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose?.(); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-label="Bring your campaign to the world"
        tabIndex={-1}
        style={{ width: 'min(100%, 760px)', maxHeight: 'min(92vh, 780px)', overflow: 'auto', border: `1px solid ${BORDER}`, background: CARD }}>
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: SP.md, padding: `${SP.lg}px ${SP.lg}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`, background: CARD_ALT }}>
          <ScrollText size={18} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.lg, fontWeight: 900 }}>
              Bring your campaign
            </h2>
            <p style={{ margin: `${SP.xs}px 0 0`, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.45 }}>
              Paste what your table already remembers. We propose a shape for each event; you confirm each one before it enters the chronicle. Nothing is written until you say so.
            </p>
          </div>
          <IconButton Icon={X} label="Close import" onClick={onClose} tone="ghost" size="sm" />
        </header>

        <div style={{ padding: SP.lg }}>
          {step === 'paste' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
              <span style={{ fontSize: FS.xs, fontWeight: 900, color: INK, fontFamily: sans }}>
                Your campaign notes
              </span>
              <textarea aria-label="Your campaign notes" value={notes} onChange={e => setNotes(e.target.value)} rows={8}
                placeholder={'One event per line works best. For example:\nThe famine struck Ashford in the third winter.\nThe party bought grain and saved the granary.\nThe steward was exposed as corrupt.'}
                style={{ ...fieldStyle, minHeight: 160, fontFamily: serif_, fontSize: FS.sm, resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button variant="primary" size="sm" icon={<ScrollText size={12} />} onClick={readNotes} disabled={!notes.trim()}>
                  Read the notes
                </Button>
                <Button variant="secondary" size="sm" icon={<Upload size={12} />} onClick={() => fileRef.current?.click()}>
                  Upload a file
                </Button>
                <input ref={fileRef} type="file" accept=".txt,.md,text/plain,text/markdown" onChange={onFile}
                  style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} aria-hidden="true" tabIndex={-1} />
                <Button variant="ghost" size="sm" icon={<Plus size={12} />} onClick={startManual}>
                  Or add events by hand
                </Button>
              </div>
              <div style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: SP.md,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: SP.sm,
              }}>
                <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
                  Already have a SettlementForge export?
                </span>
                <span style={{
                  color: MUTED,
                  fontFamily: sans,
                  fontSize: FS.xxs,
                  lineHeight: 1.45,
                }}>
                  Compare its structured settlements with this campaign before anything is
                  created or attached.
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<FileJson size={12} />}
                  onClick={() => setStep('reconcile')}
                >
                  Reconcile a SettlementForge export
                </Button>
              </div>
            </div>
          )}

          {step === 'reconcile' && (
            <Suspense fallback={(
              <div role="status" style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs }}>
                Opening structured reconciliation…
              </div>
            )}>
              <StructuredCampaignReconciliation
                campaign={campaign}
                existingSettlements={members}
                onBack={() => setStep('paste')}
              />
            </Suspense>
          )}

          {step === 'review' && session && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
              <div role="status" style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>
                {summary.confirmed} of {summary.total} confirmed{summary.skipped ? ` · ${summary.skipped} skipped` : ''}. Only confirmed events are added.
              </div>
              <ul style={{ margin: 0, padding: 0 }}>
                {session.rows.map(row => (
                  <ReviewRow key={row.index} row={row} settlements={members}
                    onPatch={p => patchRow(row.index, p)}
                    onConfirm={on => confirmRow(row.index, on)}
                    onSkip={on => skipRow(row.index, on)} />
                ))}
              </ul>
              <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', alignItems: 'center', borderTop: `1px solid ${BORDER}`, paddingTop: SP.md }}>
                <Button variant="ghost" size="sm" icon={<Plus size={12} />} onClick={() => setSession(s => addBlankRow(s, { tick: defaultTick }))}>
                  Add another event
                </Button>
                <div style={{ flex: 1 }} />
                <Button variant="secondary" size="sm" onClick={() => setStep('paste')}>Back</Button>
                <Button variant="primary" size="sm" icon={<Check size={12} />} onClick={commit} disabled={!summary.ready}>
                  Add {summary.confirmed} event{summary.confirmed === 1 ? '' : 's'} to the chronicle
                </Button>
              </div>
              {error && <div role="alert" style={{ fontSize: FS.xs, color: RED, fontFamily: sans }}>{error}</div>}
            </div>
          )}

          {step === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md, alignItems: 'flex-start' }}>
              <p style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.md, lineHeight: 1.5 }}>
                {committed} event{committed === 1 ? '' : 's'} joined your chronicle. They now read as your table's own history, marked as authored at the table.
              </p>
              <Button variant="primary" size="sm" onClick={onClose}>Done</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
