/**
 * WizardLoadedBanners.jsx — legacy (chrome-diet-off) status banners.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. Two full-width
 * banners: "Config loaded" and "Neighbour active". Each self-gates on
 * its own datum. Rendered only on the legacy path (the parent still
 * guards the whole block on !chromeDiet). Presentational — values and
 * handlers arrive via props; state stays in the parent wizard.
 */

import { swatch, FS } from '../theme.js';

export function WizardLoadedBanners({
  loadedFromSave,
  clearLoadedFromSave,
  importedNeighbour,
  clearNeighbour,
}) {
  return (
    <>
      {loadedFromSave && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: swatch['#FDF8EE'], border: '2px solid #b8860b', borderRadius: 8, padding: '10px 14px' }}>
          <span style={{ fontSize: FS['16'], flexShrink: 0 }}>&#128203;</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: FS.md, fontWeight: 700, color: swatch['#5A3A00'] }}>Config loaded: {loadedFromSave.name}</span>
            {loadedFromSave.tier && <span style={{ fontSize: FS.sm, color: swatch['#8A6020'], marginLeft: 8 }}>{loadedFromSave.tier}</span>}
          </div>
          <button onClick={clearLoadedFromSave} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(184,134,11,0.15)', border: '1px solid #b8860b', color: swatch['#5A3A00'], cursor: 'pointer', fontSize: FS['16'], fontWeight: 700 }}>&times;</button>
        </div>
      )}

      {importedNeighbour && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: swatch.successBg, border: '2px solid #4a8a60', borderRadius: 8, padding: '10px 14px' }}>
          <span style={{ fontSize: FS['16'] }}>&#127760;</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: FS.md, fontWeight: 700, color: swatch.success }}>Neighbour active: {importedNeighbour.name}</span>
            <span style={{ fontSize: FS.sm, color: swatch['#4A8A60'], marginLeft: 8 }}>{importedNeighbour.tier}</span>
          </div>
          <button onClick={clearNeighbour} style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(74,138,96,0.15)', border: '1px solid #4a8a60', color: swatch.success, cursor: 'pointer', fontSize: FS['16'], fontWeight: 700 }}>&times;</button>
        </div>
      )}
    </>
  );
}
