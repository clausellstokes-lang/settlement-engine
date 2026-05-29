/**
 * DeleteConfirmation — Reusable inline delete confirmation panel.
 *
 * Renders an expandable warning with context-aware messaging.
 * Used by SettlementsPanel, CampaignSection, Compendium, and WorldMap.
 */
import { CARD, SECOND, BORDER, sans, FS, swatch } from './theme.js';

// Tier 7.19 — local BODY alias. The body-copy color used to be a
// hard-coded '#6b5340' literal; surfacing it as a named constant means
// a future contrast tweak is one edit. (We don't import from tabConstants
// because that's a tabs-only concern; this component is reused outside
// the tab system.)
const BODY = '#6b5340';

export default function DeleteConfirmation({ entityName, details, onConfirm, onCancel }) {
  return (
    <div style={{
      marginTop: 6, padding: '10px 12px',
      background: swatch.dangerBg, border: '1px solid #e8c0c0',
      borderRadius: 6,
    }}>
      <div style={{ fontSize: FS.sm, color: swatch.danger, fontWeight: 600, marginBottom: 5 }}>
        Delete "{entityName}"?
      </div>
      {details && (
        <div style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.5, marginBottom: 8 }}>
          {details}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onConfirm}
          style={{
            padding: '5px 14px', background: swatch.danger, color: swatch.white,
            border: 'none', borderRadius: 4, cursor: 'pointer',
            fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
          }}
        >
          Yes, delete permanently
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '5px 10px', background: CARD, color: SECOND,
            border: `1px solid ${BORDER}`, borderRadius: 4, cursor: 'pointer',
            fontSize: FS.xs, fontFamily: sans,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
