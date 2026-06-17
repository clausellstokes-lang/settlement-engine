/**
 * WizardLoadedBanners.jsx — legacy (chrome-diet-off) status banners.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. Two full-width
 * banners: "Config loaded" and "Neighbour active". Each self-gates on
 * its own datum. Rendered only on the legacy path (the parent still
 * guards the whole block on !chromeDiet). Presentational — values and
 * handlers arrive via props; state stays in the parent wizard.
 */

import { X } from 'lucide-react';
import { swatch, FS } from '../theme.js';
import IconButton from '../primitives/IconButton.jsx';

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
          <IconButton Icon={X} label="Clear loaded config" tone="active" size="md" onClick={clearLoadedFromSave} />
        </div>
      )}

      {importedNeighbour && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: swatch.successBg, border: '2px solid #4a8a60', borderRadius: 8, padding: '10px 14px' }}>
          <span style={{ fontSize: FS['16'] }}>&#127760;</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: FS.md, fontWeight: 700, color: swatch.success }}>Neighbour active: {importedNeighbour.name}</span>
            <span style={{ fontSize: FS.sm, color: swatch['#4A8A60'], marginLeft: 8 }}>{importedNeighbour.tier}</span>
          </div>
          <IconButton Icon={X} label="Clear neighbour" tone="ghost" size="md" onClick={clearNeighbour} />
        </div>
      )}
    </>
  );
}
