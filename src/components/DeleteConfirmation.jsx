/**
 * DeleteConfirmation — Reusable inline delete confirmation panel.
 *
 * Renders an expandable warning with context-aware messaging.
 * Used by SettlementsPanel, CampaignSection, Compendium, and WorldMap.
 */
import { FS, swatch } from './theme.js';
import Button from './primitives/Button.jsx';

// Local BODY alias. The body-copy color used to be a
// hard-coded '#6b5340' literal; surfacing it as a named constant means
// a future contrast tweak is one edit. (We don't import from tabConstants
// because that's a tabs-only concern; this component is reused outside
// the tab system.)
const BODY = swatch['#6B5340'];

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
        <Button variant="danger" size="sm" onClick={onConfirm}>
          Yes, delete permanently
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
