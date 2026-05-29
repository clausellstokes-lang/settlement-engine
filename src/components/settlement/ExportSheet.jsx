/**
 * ExportSheet — Variant picker for PDF export.
 *
 * Replaces the single "Export PDF" button with a small modal where the
 * user chooses Draft Brief / Canon Dossier / Timeline Packet. Each
 * variant card explains what's in the artifact and what's not. The
 * primary action button label updates to match the choice so the
 * commit feels intentional.
 *
 * Phase-aware defaults:
 *   - draft phase   → suggests Draft Brief
 *   - canon phase   → suggests Canon Dossier
 *   - canon + many events → suggests Timeline Packet (recap mode)
 *
 * Some variants are disabled by phase: a Timeline Packet from a draft
 * settlement would print an empty timeline chapter, which is useless.
 */

import { useState } from 'react';
import { FS } from '../theme.js';
import { FileText, Loader2, X, BookMarked, Clock, Edit3 } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { PDF_VARIANTS } from '../../pdf/variants.js';
import { COPY } from '../../copy/strings.js';
import IconButton from '../primitives/IconButton.jsx';

const VARIANT_ICON = {
  draft_brief:     Edit3,
  canon_dossier:   BookMarked,
  timeline_packet: Clock,
};

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {(variant: 'draft_brief'|'canon_dossier'|'timeline_packet') => Promise<void>} props.onExport
 * @param {boolean} [props.exporting]
 */
export default function ExportSheet({ open, onClose, onExport, exporting }) {
  const phase    = useStore(s => s.phase);
  const eventCount = useStore(s => s.eventLog?.length ?? 0);
  const suggested = suggestVariant(phase, eventCount);
  const [picked, setPicked] = useState(suggested);

  if (!open) return null;

  const variants = Object.entries(PDF_VARIANTS).map(([id, spec]) => ({
    id, ...spec,
    Icon: VARIANT_ICON[id] || FileText,
    disabled: id === 'timeline_packet' && phase !== 'canon',
    disabledReason: id === 'timeline_packet' && phase !== 'canon'
      ? 'Available once the settlement is canonized.'
      : null,
  }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-sheet-title"
      style={overlayStyle}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={sheetStyle}>
        <header style={headerStyle}>
          <h2 id="export-sheet-title" style={titleStyle}>
            <FileText size={16} aria-hidden="true" /> {COPY.export.sheetTitle}
          </h2>
          <IconButton Icon={X} label="Close" tone="ghost" size="sm" onClick={onClose} />
        </header>

        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {variants.map(v => (
            <VariantCard
              key={v.id}
              v={v}
              picked={picked === v.id}
              onPick={() => !v.disabled && setPicked(v.id)}
            />
          ))}
        </div>

        <footer style={footerStyle}>
          <button type="button" onClick={onClose} style={cancelBtnStyle} disabled={exporting}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onExport(picked)}
            disabled={exporting}
            style={primaryBtnStyle(exporting)}
          >
            {exporting
              ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Building PDF…</>
              : <>Export {PDF_VARIANTS[picked].label}</>}
          </button>
        </footer>
      </div>
    </div>
  );
}

function VariantCard({ v, picked, onPick }) {
  const Icon = v.Icon;
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={v.disabled}
      aria-pressed={picked}
      title={v.disabled ? v.disabledReason : v.description}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: 10,
        background: picked ? 'rgba(160,118,42,0.10)' : '#fff',
        border: `1px solid ${picked ? '#a0762a' : '#d2bd96'}`,
        borderRadius: 6,
        cursor: v.disabled ? 'not-allowed' : 'pointer',
        opacity: v.disabled ? 0.5 : 1,
        textAlign: 'left',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <Icon size={18} aria-hidden="true" style={{ marginTop: 2, flexShrink: 0, color: '#a0762a' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: FS.md, fontWeight: 700, color: '#1c1409' }}>
          {v.label}
        </div>
        <div style={{ fontSize: FS.xs, color: '#6b5340', marginTop: 2, lineHeight: 1.4 }}>
          {v.description}
        </div>
        {v.disabled && v.disabledReason && (
          <div style={{ fontSize: FS.xxs, color: '#8b1a1a', marginTop: 4, fontStyle: 'italic' }}>
            {v.disabledReason}
          </div>
        )}
      </div>
    </button>
  );
}

function suggestVariant(phase, eventCount) {
  if (phase === 'draft') return 'draft_brief';
  if (phase === 'canon' && eventCount >= 4) return 'timeline_packet';
  return 'canon_dossier';
}

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(28,20,9,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
};
const sheetStyle = {
  width: 'min(480px, calc(100vw - 32px))',
  maxHeight: 'calc(100vh - 32px)', overflow: 'auto',
  background: '#fffbf5',
  border: '1px solid #d2bd96', borderRadius: 8,
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
};
const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '10px 12px',
  borderBottom: '1px solid #d2bd96',
};
const titleStyle = {
  margin: 0, display: 'flex', alignItems: 'center', gap: 6,
  fontSize: 14, fontWeight: 700, color: '#1c1409',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};
const footerStyle = {
  display: 'flex', justifyContent: 'flex-end', gap: 8,
  padding: 12,
  borderTop: '1px solid #d2bd96',
};
const cancelBtnStyle = {
  padding: '6px 12px',
  background: '#fff', color: '#1c1409',
  border: '1px solid #d2bd96', borderRadius: 4,
  fontSize: FS.sm, fontWeight: 700, fontFamily: 'system-ui, -apple-system, sans-serif',
  cursor: 'pointer',
};
function primaryBtnStyle(exporting) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '6px 14px',
    background: exporting ? '#a89880' : '#a0762a', color: '#fff',
    border: 'none', borderRadius: 4,
    fontSize: FS.sm, fontWeight: 700, fontFamily: 'system-ui, -apple-system, sans-serif',
    cursor: exporting ? 'not-allowed' : 'pointer',
  };
}
