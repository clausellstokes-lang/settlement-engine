/**
 * ChroniclePanel — Per-settlement AI narrative history log.
 *
 * Reads a saved settlement's `ai_data.chronicle` array (newest-first) and
 * renders a collapsible "Narrative Chronicles" section above the settlement
 * tabs. Each entry
 * captures one narrative event — initial generation, regenerate, progression,
 * or revert — with its thesis preserved.
 *
 * Entry modes:
 *   • 'full'    — full snapshot retained. Expandable via "Read full" modal.
 *   • 'summary' — thesis + summaryText only (rotated after hitting the free-tier
 *                 cap; also used at birth for revert events).
 *
 * This component is purely presentational — it takes `entries` as a prop and
 * owns no persistence. Rotation and appending happen in `aiSlice._appendChronicleEntry`.
 */

import { useState } from 'react';
import { FS, swatch } from './theme.js';
import { BookOpen, History, RotateCcw, Sparkles, Zap, X } from 'lucide-react';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';
import { useDialogFocusTrap } from './primitives/useDialogFocusTrap.js';

// ── Visual tokens, aligned with SettlementDetail / Primitives ────────────────
const BORDER = swatch['#E0D0B0'];
const INK    = swatch['#1C1409'];
const MUTED  = swatch['#9C8068'];
const CARD   = 'rgba(255,251,245,0.96)';

const REASON_META = {
  initial:     { label: 'Initial',     color: '#1a5a28', Icon: Sparkles },
  regenerate:  { label: 'Regenerate',  color: '#2a3a7a', Icon: RotateCcw },
  progression: { label: 'Progression', color: '#6a2a9a', Icon: Zap },
  revert:      { label: 'Revert',      color: '#8a5010', Icon: History },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function relativeTime(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (secs < 45)        return 'just now';
  if (secs < 90)        return '1 min ago';
  const mins = Math.floor(secs / 60);
  if (mins < 45)        return `${mins} min ago`;
  if (mins < 90)        return '1 hr ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)         return `${hrs} hr ago`;
  if (hrs < 36)         return '1 day ago';
  const days = Math.floor(hrs / 24);
  if (days < 30)        return `${days} days ago`;
  if (days < 45)        return '1 month ago';
  const months = Math.floor(days / 30);
  if (months < 12)      return `${months} months ago`;
  const years = Math.floor(days / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}

function absoluteTime(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString(); } catch (_) { return iso; }
}

// Chip with label + icon.
function Chip({ color, Icon, children, filled = false, title }) {
  return (
    <span title={title} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 11, fontSize: FS.xxs, fontWeight: 800,
      fontFamily: 'Nunito, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase',
      color: filled ? '#fff' : color,
      background: filled ? color : `${color}18`,
      border: `1px solid ${color}60`,
      whiteSpace: 'nowrap',
    }}>
      {Icon && <Icon size={9} />}
      {children}
    </span>
  );
}

// ── Full-entry modal ─────────────────────────────────────────────────────────

function FullEntryModal({ entry, onClose }) {
  // Shared modal focus management: focus-in, Tab cycling, Escape-to-close, and
  // focus restore on unmount — the same contract PurchaseModal/AuthModal use.
  // Replaces the hand-rolled backdrop + card role=button (no focus trap, no
  // Escape) that this component carried before.
  const dialogRef = useDialogFocusTrap(!!entry, onClose);
  if (!entry) return null;
  const s = entry.aiSettlement || {};
  const dl = entry.aiDailyLife || {};
  const meta = REASON_META[entry.reason] || REASON_META.initial;

  // Plain-text dumper for known narrative sections. Intentionally simple — the
  // point is to let the DM read what they had, not to re-render the tab UI.
  const renderSection = (title, body) => {
    if (!body) return null;
    const text = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: FS.xxs, fontWeight: 800, color: swatch.ai, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{title}</div>
        <p style={{ margin: 0, fontSize: FS['12.5'], color: INK, lineHeight: 1.6, fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}>{text}</p>
      </div>
    );
  };

  const renderList = (title, arr, formatter) => {
    if (!Array.isArray(arr) || !arr.length) return null;
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: FS.xxs, fontWeight: 800, color: swatch.ai, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{title}</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: FS.sm, color: INK, lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>
          {arr.map((item, i) => <li key={i} style={{ marginBottom: 3 }}>{formatter(item)}</li>)}
        </ul>
      </div>
    );
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop click-to-close; keyboard dismissal (Escape) is handled by useDialogFocusTrap.
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events -- handler only stops propagation to the backdrop, not real interactivity; keyboard dismissal (Escape) is handled by useDialogFocusTrap */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Chronicle entry details"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10,
          width: '100%', maxWidth: 720, maxHeight: '85vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 12px 48px rgba(0,0,0,0.45)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '12px 18px', background: 'linear-gradient(135deg, #1c1409 0%, #2d1f0e 100%)',
          display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(196,154,60,0.2)',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS['18'], fontWeight: 600, color: swatch['#C49A3C'] }}>
              Narrative Chronicle Entry
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip color={meta.color} Icon={meta.Icon} filled>{meta.label}</Chip>
              <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: 'Nunito, sans-serif' }}>
                {absoluteTime(entry.createdAt)} &middot; {relativeTime(entry.createdAt)}
              </span>
            </div>
          </div>
          <IconButton Icon={X} label="Close" tone="ghost" size="sm" onClick={onClose} />
        </div>

        {/* Body */}
        <div style={{ padding: '16px 22px', overflowY: 'auto', flex: 1 }}>
          {entry.triggeredBy && (
            <div style={{ marginBottom: 12, padding: '6px 10px', background: 'rgba(106,42,154,0.08)', border: '1px solid rgba(106,42,154,0.2)', borderRadius: 5, fontSize: FS.xs, color: swatch.ai, fontFamily: 'Nunito, sans-serif' }}>
              <strong>Triggered by:</strong> {entry.triggeredBy}
            </div>
          )}

          {renderSection('Thesis', s.thesis || entry.thesis)}
          {renderSection('History', s.history)}
          {renderSection('Economic Viability', s.economicViability)}

          {renderList('Institutions', s.institutions, (it) => `${it?.name || 'Unnamed'}: ${it?.description || ''}`)}
          {renderList('NPCs', s.npcs, (n) => `${n?.name || 'Unnamed'} (${n?.role || ''}): ${n?.description || ''}`)}
          {renderList('Factions', s.powerStructure?.factions, (f) => `${f?.name || 'Unnamed'}: ${f?.description || ''}`)}
          {renderList('Conflicts', s.powerStructure?.conflicts, (c) => (typeof c === 'string' ? c : c?.description || JSON.stringify(c)))}
          {renderList('Stressors', s.stress, (st) => `${st?.label || ''}: ${st?.description || st?.text || ''}`)}

          {renderList('Identity Markers', s.identityMarkers, (m) => m)}
          {renderList('Friction Points', s.frictionPoints, (fp) => `${fp?.who || ''} - ${fp?.what || ''}`)}

          {s.dmCompass && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: FS.xxs, fontWeight: 800, color: swatch.ai, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>DM Compass</div>
              {Array.isArray(s.dmCompass.hooks) && s.dmCompass.hooks.length > 0 && (
                <>
                  <div style={{ fontSize: FS.xs, fontWeight: 700, color: INK, marginTop: 6, marginBottom: 2, fontFamily: 'Nunito, sans-serif' }}>Hooks</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: FS.sm, color: INK, lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>
                    {s.dmCompass.hooks.map((h, i) => <li key={i} style={{ marginBottom: 2 }}>{h}</li>)}
                  </ul>
                </>
              )}
              {Array.isArray(s.dmCompass.redFlags) && s.dmCompass.redFlags.length > 0 && (
                <>
                  <div style={{ fontSize: FS.xs, fontWeight: 700, color: swatch.danger, marginTop: 6, marginBottom: 2, fontFamily: 'Nunito, sans-serif' }}>Red flags</div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: FS.sm, color: INK, lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>
                    {s.dmCompass.redFlags.map((r, i) => <li key={i} style={{ marginBottom: 2 }}>{r}</li>)}
                  </ul>
                </>
              )}
              {s.dmCompass.twist && (
                <>
                  <div style={{ fontSize: FS.xs, fontWeight: 700, color: swatch['#A0762A'], marginTop: 6, marginBottom: 2, fontFamily: 'Nunito, sans-serif' }}>Twist</div>
                  <p style={{ margin: 0, fontSize: FS.sm, color: INK, lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>{s.dmCompass.twist}</p>
                </>
              )}
            </div>
          )}

          {dl && Object.keys(dl).length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: FS.xxs, fontWeight: 800, color: swatch.ai, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Daily Life</div>
              {['dawn', 'morning', 'midday', 'evening', 'night'].map(k => dl[k] && (
                <div key={k} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: FS.xxs, fontWeight: 700, color: MUTED, textTransform: 'capitalize', fontFamily: 'Nunito, sans-serif', marginBottom: 2 }}>{k}</div>
                  <p style={{ margin: 0, fontSize: FS.sm, color: INK, lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>{dl[k]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Entry card ──────────────────────────────────────────────────────────────

function EntryCard({ entry, onOpen }) {
  const meta = REASON_META[entry.reason] || REASON_META.initial;
  const isFull = entry.mode === 'full';
  const thesisText = entry.thesis || entry.summaryText || '(no thesis captured)';

  return (
    <div style={{
      padding: '10px 12px',
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderLeft: `3px solid ${meta.color}`,
      borderRadius: 6,
      marginBottom: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
        <Chip color={meta.color} Icon={meta.Icon}>{meta.label}</Chip>
        <Chip
          color={isFull ? '#6a2a9a' : MUTED}
          title={isFull
            ? 'Full snapshot retained. Open Read full to re-read the whole narrative.'
            : 'Thesis kept, the full snapshot rotated out. Summaries hold the through-line, not the full prose.'}
        >{isFull ? 'Full' : 'Summary'}</Chip>
        <span style={{ fontSize: FS['10.5'], color: MUTED, fontFamily: 'Nunito, sans-serif' }} title={absoluteTime(entry.createdAt)}>
          {relativeTime(entry.createdAt)}
        </span>
        <div style={{ flex: 1 }} />
        {isFull && onOpen && (
          <Button
            variant="ai"
            size="sm"
            icon={<BookOpen size={12} />}
            onClick={() => onOpen(entry)}
          >
            Read full
          </Button>
        )}
      </div>
      {entry.triggeredBy && (
        <div style={{ fontSize: FS.xxs, color: swatch.ai, fontStyle: 'italic', fontFamily: 'Nunito, sans-serif', marginBottom: 4 }}>
          {entry.triggeredBy}
        </div>
      )}
      <p style={{ margin: 0, fontSize: FS.sm, color: INK, lineHeight: 1.55, fontFamily: 'Georgia, serif' }}>
        {thesisText}
      </p>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

export default function ChroniclePanel({ entries }) {
  const list = Array.isArray(entries) ? entries : [];
  const [open, setOpen] = useState(false);
  const [modalEntry, setModalEntry] = useState(null);

  const fullCount = list.filter(e => e?.mode === 'full').length;
  const summaryCount = list.length - fullCount;

  return (
    // No self-margin: this panel is placed in a gap'd flex column (the lifecycle
    // cluster), so the parent's gap owns the spacing — a baked-in marginBottom
    // double-counted it and broke the spacing rhythm (P5). The border stays: this
    // is a genuinely-interactive collapsible (a click target earns it).
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px',
          background: open ? '#f5ede0' : CARD,
          border: 'none', cursor: 'pointer', textAlign: 'left',
          borderBottom: open ? `1px solid ${BORDER}` : 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <History size={14} color="#6a2a9a" />
        <span style={{ fontFamily: 'Crimson Text, Georgia, serif', fontSize: FS['14'], fontWeight: 600, color: INK, flex: 1 }}>
          Narrative Chronicles {list.length > 0 ? `(${list.length})` : ''}
        </span>
        {list.length > 0 && (
          <span style={{ fontSize: FS.xxs, color: MUTED, fontFamily: 'Nunito, sans-serif' }}>
            {fullCount} full{summaryCount > 0 ? ` · ${summaryCount} summary` : ''}
          </span>
        )}
        <span style={{ fontSize: FS.xs, color: MUTED }}>{open ? '\u25b2' : '\u25bc'}</span>
      </button>

      {open && (
        <div style={{ padding: '12px 14px', background: swatch['#FAF8F4'], maxHeight: 420, overflowY: 'auto' }}>
          {list.length === 0 ? (
            <div style={{ padding: '18px 0', textAlign: 'center', color: MUTED, fontSize: FS.sm, fontStyle: 'italic', fontFamily: 'Nunito, sans-serif' }}>
              No narrative chronicle entries yet. Generate a narrative to start the log.
            </div>
          ) : (
            list.map((e) => (
              <EntryCard key={e.id} entry={e} onOpen={setModalEntry} />
            ))
          )}
        </div>
      )}

      {modalEntry && <FullEntryModal entry={modalEntry} onClose={() => setModalEntry(null)} />}
    </div>
  );
}
