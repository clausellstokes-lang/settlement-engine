/**
 * components/surveyor/surveyorPanelKit.jsx — shared UI atoms for the Surveyor WRITE panels.
 *
 * The cross-cutting furniture every write stage repeats, factored once so the money path,
 * the §2b early-access register, the §3b musing register, the §9 field labels, the BYOK tag,
 * and the §3d graceful refusal render IDENTICALLY across custom-content / style / construction /
 * accept→mint. Theme vocabulary + primitives only (no raw buttons/colors). Rides the lazy panel
 * chunks — never eager (nothing here is statically imported by a first-paint module).
 */

import { Sparkles } from 'lucide-react';
import { INK, BODY, MUTED, BORDER, CARD_ALT, GOLD, RED, GREEN, sans, serif_, SP, R, FS } from '../theme.js';
import Badge from '../primitives/Badge.jsx';
import Button from '../primitives/Button.jsx';

/** The §9 per-field honesty label. mechanical = real engine effect · flavor = kept, no
 *  mechanic · unsupported = a field the schema has no primitive for (surfaced, never invented).
 *  The label TEXT is the honest signal (no native title tooltip — the a11y-poor kind the
 *  title= census discourages). */
const LABEL_TONE = { mechanical: 'success', flavor: 'info', unsupported: 'warning' };
const LABEL_TEXT = { mechanical: 'Mechanical', flavor: 'Flavor', unsupported: 'Unsupported' };
export function FieldLabelBadge({ kind }) {
  const k = LABEL_TONE[kind] ? kind : 'unsupported';
  return <Badge tone={LABEL_TONE[k]} size="sm">{LABEL_TEXT[k]}</Badge>;
}

/** §2b THE EARLY-ACCESS REGISTER — an honest label on every write stage until its live
 *  metrics mature (the edge stamps earlyAccess; absent ⇒ treated as on, fail-honest). */
export function EarlyAccessBadge({ show = true }) {
  if (!show) return null;
  return <Badge tone="ai" size="sm">Early access</Badge>;
}

/** The BYOK tag — surfaced post-response (the client never sees the key; the edge reports it). */
export function ByokTag({ byok }) {
  if (!byok) return null;
  return (
    <span aria-label="Answered on your own provider key" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
      · BYOK
    </span>
  );
}

/**
 * THE S1 MONEY PATH — the pre-send estimated cost + live balance + the send control, verbatim
 * from AiAnalystPanel. The cost line IS the confirm gate (no modal). When the balance is known
 * and short, the honest INSUFFICIENT state shows — the button stays live (the server is the
 * authority; it refunds/refuses), never a silently dead button.
 */
export function MoneyLine({ cost, creditBalance, busy, disabled, onSubmit, submitLabel = 'Compile', busyLabel = 'Working…' }) {
  const knownBalance = Number.isFinite(creditBalance);
  const short = knownBalance && creditBalance < cost;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          {cost} credit{cost === 1 ? '' : 's'}
          {knownBalance && <span> · {creditBalance} left</span>}
        </span>
        <Button
          variant="aiSolid"
          size="sm"
          icon={<Sparkles size={14} />}
          busy={busy}
          disabled={disabled}
          onClick={onSubmit}
        >
          {busy ? busyLabel : submitLabel}
        </Button>
      </div>
      {short && (
        <span data-testid="surveyor-insufficient" style={{ fontSize: FS.xs, color: RED, fontFamily: sans }}>
          Not enough credits for this — you have {creditBalance}, this needs {cost}. Nothing is charged until it runs.
        </span>
      )}
    </div>
  );
}

/**
 * §3d THE GRACEFUL-REFUSAL surface. The edge composes the cordial, door-naming message
 * (a paused stage's kill-switch included); the panel renders it verbatim in the refusal
 * register — never a broken button. The refusal CLASS is surfaced quietly for honesty.
 */
export function RefusalNote({ error, refusalClass, doors }) {
  if (!error) return null;
  const paused = refusalClass === 'stage_disabled';
  return (
    <div
      data-testid="surveyor-refusal"
      role="status"
      style={{
        borderLeft: `2px solid ${RED}`, paddingLeft: SP.sm,
        display: 'flex', flexDirection: 'column', gap: 2,
      }}
    >
      <p style={{ margin: 0, fontSize: FS.sm, color: RED, lineHeight: 1.45 }}>{error}</p>
      {(paused || (Array.isArray(doors) && doors.length > 0)) && (
        <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          {paused ? 'This stage is paused — nothing was charged.' : 'Nothing was charged.'}
        </span>
      )}
    </div>
  );
}

/**
 * §3b THE MUSING REGISTER — visibly distinct from any cited/validated content: serif italic,
 * a gold rule, a plain "suggestion" label. Never a control, never the record.
 */
export function MusingsBlock({ musings }) {
  if (!Array.isArray(musings) || musings.length === 0) return null;
  return (
    <div
      data-testid="surveyor-musings"
      style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: SP.sm, display: 'flex', flexDirection: 'column', gap: 4 }}
    >
      <span style={{ fontSize: FS.xs, color: GOLD, fontFamily: sans, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        The Surveyor muses · suggestions, not the record
      </span>
      {musings.map((m, i) => (
        <p key={i} style={{ margin: 0, fontSize: FS.sm, color: MUTED, fontStyle: 'italic', fontFamily: serif_, lineHeight: 1.5 }}>
          {m.text}
        </p>
      ))}
    </div>
  );
}

/** The visible CONTEXT ANCHOR chip (what the Surveyor reads) — the §3c honesty made tangible. */
export function AnchorChip({ label }) {
  if (!label) return null;
  return (
    <div
      data-testid="surveyor-anchor"
      aria-label={label}
      style={{
        fontSize: FS.xs, color: MUTED, fontFamily: sans, background: CARD_ALT,
        border: `1px solid ${BORDER}`, borderRadius: R.sm, padding: `2px ${SP.sm}px`,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
}

/** A small section eyebrow used across the panels. */
export function Eyebrow({ children }) {
  return (
    <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {children}
    </span>
  );
}

/** The reproducibility receipt line (engine version + seed) the accept→mint surfaces. */
export function ReceiptLine({ engineVersion, seed, applied }) {
  return (
    <div data-testid="surveyor-receipt" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, lineHeight: 1.5 }}>
      <span style={{ color: GREEN }}>◆</span> Reproducible: engine {engineVersion || 'unknown'}
      {seed != null && <span> · seed {String(seed)}</span>}
      {Number.isFinite(applied) && <span> · {applied} applied</span>}
    </div>
  );
}

/** A textarea styled to the panel vocabulary, with a required aria-label. */
export function PromptArea({ value, onChange, label, placeholder, rows = 3, disabled = false }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      style={{
        width: '100%', boxSizing: 'border-box', resize: 'vertical', borderRadius: R.md,
        border: `1px solid ${BORDER}`, background: disabled ? CARD_ALT : '#fff', color: INK,
        padding: SP.sm, fontSize: FS.sm, fontFamily: sans, lineHeight: 1.5,
      }}
    />
  );
}

export const PANEL_TEXT = { INK, BODY, MUTED };
