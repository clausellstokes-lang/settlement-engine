/**
 * WizardChipRow.jsx — P119 chrome-diet combined chip row.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. A single
 * max-32px-tall strip with: an inline "Advanced ⇄ Quick" toggle, a
 * config-loaded chip, a neighbour-active chip. All three were previously
 * full banner rows; now they fit in one. Presentational — every value
 * and handler arrives via props; state stays in the parent wizard.
 */

import { swatch, BORDER, CARD_HDR, sans, SP, FS, SECOND } from '../theme.js';

export function WizardChipRow({
  wizardMode,
  setWizardMode,
  loadedFromSave,
  clearLoadedFromSave,
  importedNeighbour,
  clearNeighbour,
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      padding: `${SP.xs}px ${SP.sm}px`,
      flexWrap: 'wrap', fontSize: FS.xs,
    }}>
      {wizardMode === 'advanced' && (
        <button
          onClick={() => setWizardMode('basic')}
          style={{
            padding: '3px 9px', fontSize: FS.xxs, fontWeight: 700,
            background: swatch.white, border: `1px solid ${BORDER}`,
            borderRadius: 12, color: SECOND,
            cursor: 'pointer', fontFamily: sans,
          }}
        >
          Switch to Basic →
        </button>
      )}
      {loadedFromSave && (
        <span style={{
          padding: '3px 9px', fontSize: FS.xxs, fontWeight: 700,
          background: CARD_HDR, border: `1px solid ${BORDER}`,
          borderRadius: 12, color: swatch['#5A3A00'],
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          📋 {loadedFromSave.name}
          <button
            onClick={clearLoadedFromSave}
            style={{
              background: 'transparent', border: 'none',
              color: swatch['#5A3A00'], cursor: 'pointer', padding: 0,
              fontSize: FS.xs, fontWeight: 700,
            }}
            aria-label="Clear loaded config"
          >×</button>
        </span>
      )}
      {importedNeighbour && (
        <span style={{
          padding: '3px 9px', fontSize: FS.xxs, fontWeight: 700,
          background: swatch['#E2EEDB'], border: '1px solid #4a8a60',
          borderRadius: 12, color: swatch.success,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          🌐 {importedNeighbour.name}
          <button
            onClick={clearNeighbour}
            style={{
              background: 'transparent', border: 'none',
              color: swatch.success, cursor: 'pointer', padding: 0,
              fontSize: FS.xs, fontWeight: 700,
            }}
            aria-label="Clear neighbour"
          >×</button>
        </span>
      )}
    </div>
  );
}
