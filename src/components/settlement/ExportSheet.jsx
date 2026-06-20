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
import { FS, swatch } from '../theme.js';
import { FileText, X, BookMarked, Clock, Edit3, Swords } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { PDF_VARIANTS } from '../../pdf/variants.js';
import { COPY } from '../../copy/strings.js';
import IconButton from '../primitives/IconButton.jsx';
import Button from '../primitives/Button.jsx';

const VARIANT_ICON = {
  draft_brief:     Edit3,
  canon_dossier:   BookMarked,
  timeline_packet: Clock,
  campaign_state:  Swords,
};

// Variants that print canon-only chapters as their reason for being — disabled
// in draft (a draft export of them would degrade to a thin shell).
const CANON_ONLY_VARIANTS = new Set(['timeline_packet', 'campaign_state']);

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {(variant: 'draft_brief'|'canon_dossier'|'timeline_packet'|'campaign_state', useAi?: boolean) => Promise<void>} props.onExport
 * @param {boolean} [props.exporting]
 */
export default function ExportSheet({ open, onClose, onExport, exporting }) {
  const phase    = useStore(s => s.phase);
  const eventCount = useStore(s => s.eventLog?.length ?? 0);
  const suggested = suggestVariant(phase, eventCount);
  const [picked, setPicked] = useState(suggested);
  // §2a — export source. When an AI narrative overlay exists the user chooses
  // raw simulation vs AI-enhanced; defaults to AI-enhanced when available.
  // buildViewModel swaps the dossier body on narrativeMode.
  const aiSettlement = useStore(s => s.aiSettlement);
  const hasAi = !!aiSettlement;
  const [useAi, setUseAi] = useState(hasAi);

  if (!open) return null;

  const variants = Object.entries(PDF_VARIANTS).map(([id, spec]) => ({
    id, ...spec,
    Icon: VARIANT_ICON[id] || FileText,
    disabled: CANON_ONLY_VARIANTS.has(id) && phase !== 'canon',
    disabledReason: CANON_ONLY_VARIANTS.has(id) && phase !== 'canon'
      ? 'Available once the settlement is canonized.'
      : null,
  }));

  return (
    // Modal overlay: backdrop click/keydown dismisses. Keeping role="dialog"
    // (vs button) is the correct a11y semantics, so this rule can't be satisfied.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-sheet-title"
      style={overlayStyle}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) onClose(); }}
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

        {hasAi && (
          <div style={{ padding: '0 12px 4px' }}>
            <div style={{ fontSize: FS.xxs, fontWeight: 700, color: swatch.inkMag3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Source</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ ai: false, label: 'Raw Simulation' }, { ai: true, label: 'AI-Enhanced' }].map(opt => (
                <Button
                  key={opt.label}
                  variant={useAi === opt.ai ? 'gold' : 'secondary'}
                  size="sm"
                  onClick={() => setUseAi(opt.ai)}
                  aria-pressed={useAi === opt.ai}
                  style={{ flex: 1 }}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            <div style={{ fontSize: FS.xxs, color: swatch.inkMag3, fontStyle: 'italic', lineHeight: 1.4, marginTop: 6 }}>
              {useAi
                ? 'Exports the AI-narrated dossier — canonical facts are preserved.'
                : 'Exports the raw simulation. Your AI narrative stays out of this file.'}
            </div>
          </div>
        )}

        <footer style={footerStyle}>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={exporting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onExport(picked, useAi)}
            disabled={exporting}
            busy={exporting}
          >
            {exporting ? 'Building PDF…' : <>Export {PDF_VARIANTS[picked].label}</>}
          </Button>
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
      <Icon size={18} aria-hidden="true" style={{ marginTop: 2, flexShrink: 0, color: swatch['#A0762A'] }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: FS.md, fontWeight: 700, color: swatch.inkMag }}>
          {v.label}
        </div>
        <div style={{ fontSize: FS.xs, color: swatch.inkMag3, marginTop: 2, lineHeight: 1.4 }}>
          {v.description}
        </div>
        {v.disabled && v.disabledReason && (
          <div style={{ fontSize: FS.xxs, color: swatch.danger, marginTop: 4, fontStyle: 'italic' }}>
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
