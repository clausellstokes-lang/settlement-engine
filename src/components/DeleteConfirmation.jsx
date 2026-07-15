/**
 * DeleteConfirmation — Reusable inline delete confirmation panel.
 *
 * Renders an expandable warning with context-aware messaging.
 * Used by SettlementsPanel, CampaignSection, Compendium, and WorldMap.
 */
import { FS, SP, R, swatch, DANGER_BORDER } from './theme.js';
import Button from './primitives/Button.jsx';

// Local BODY alias. The body-copy color used to be a
// hard-coded '#6b5340' literal; surfacing it as a named constant means
// a future contrast tweak is one edit. (We don't import from tabConstants
// because that's a tabs-only concern; this component is reused outside
// the tab system.)
const BODY = swatch['#6B5340'];

export default function DeleteConfirmation({ entityName, details, onConfirm, onCancel }) {
  return (
    <div
      role="group"
      aria-label={`Delete ${entityName}`}
      style={{
        marginTop: SP.xs, padding: `${SP.sm}px ${SP.md}px`,
        background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`,
        borderRadius: R.md,
      }}
    >
      <div style={{ fontSize: FS.sm, color: swatch.danger, fontWeight: 600, marginBottom: SP.xs }}>
        Delete "{entityName}"?
      </div>
      {details && (
        <div style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.5, marginBottom: SP.sm }}>
          {details}
        </div>
      )}
      <div style={{ display: 'flex', gap: SP.sm }}>
        <Button variant="danger" size="sm" onClick={onConfirm} style={{ minHeight: 44 }}>
          Yes, delete permanently
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel} style={{ minHeight: 44 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
