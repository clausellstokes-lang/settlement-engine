/**
 * WizardChipRow.jsx — P119 chrome-diet combined chip row.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. A single
 * max-32px-tall strip with: an inline "Advanced ⇄ Quick" toggle, a
 * config-loaded chip, a neighbour-active chip. All three were previously
 * full banner rows; now they fit in one. Presentational — every value
 * and handler arrives via props; state stays in the parent wizard.
 */

import { X } from 'lucide-react';
import { swatch, BORDER, CARD_HDR, SP, FS } from '../theme.js';
import IconButton from '../primitives/IconButton.jsx';
import Segmented from '../primitives/Segmented.jsx';
import { MODE_OPTIONS } from './ChangeModeBar.jsx';

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
      {/* Two-way Basic⇄Advanced switch (was a one-way "Switch to Basic →"
          button). Same options as ChangeModeBar so the two chrome variants
          read as one control. Same-mode taps are ignored so re-tapping the
          active side can't reset the wizard step. */}
      <Segmented
        options={MODE_OPTIONS}
        value={wizardMode === 'advanced' ? 'advanced' : 'basic'}
        onChange={(id) => {
          if (id !== (wizardMode === 'advanced' ? 'advanced' : 'basic')) setWizardMode(id);
        }}
        size="sm"
        ariaLabel="Generation mode"
      />
      {loadedFromSave && (
        <span style={{
          padding: '3px 9px', fontSize: FS.xxs, fontWeight: 700,
          background: CARD_HDR, border: `1px solid ${BORDER}`,
          borderRadius: 12, color: swatch['#5A3A00'],
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          📋 {loadedFromSave.name}
          <IconButton
            Icon={X}
            label="Clear loaded config"
            tone="ghost"
            size="sm"
            onClick={clearLoadedFromSave}
          />
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
          <IconButton
            Icon={X}
            label="Clear neighbour"
            tone="ghost"
            size="sm"
            onClick={clearNeighbour}
          />
        </span>
      )}
    </div>
  );
}
