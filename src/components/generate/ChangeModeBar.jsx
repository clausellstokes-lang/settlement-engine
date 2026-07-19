/**
 * ChangeModeBar.jsx — "Create" breadcrumb + inline Basic⇄Advanced switch.
 *
 * Shown above the mode-specific UI once a card is picked. Module-scope so
 * React Compiler can memoize without seeing it reborn on every render of
 * the parent wizard. Extracted byte-for-byte from GenerateWizard.jsx, then
 * the one-way "Change mode" back button was reframed as a breadcrumb root
 * plus a Segmented mode switch, so flipping Basic⇄Advanced is one tap
 * instead of a round-trip through the mode picker.
 */

import { ChevronLeft } from 'lucide-react';
import { INK, MUTED, SECOND, BORDER, CARD_HDR, SP, R, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import Segmented from '../primitives/Segmented.jsx';

// The Basic⇄Advanced switch options for the breadcrumb switch below.
export const MODE_OPTIONS = [
  { id: 'basic', label: 'Basic' },
  { id: 'advanced', label: 'Advanced' },
];

// "Change mode" bar — shown above the mode-specific UI once a card is
// picked. Module-scope so React Compiler can memoize without seeing it
// reborn on every render of the parent wizard.
export function ChangeModeBar({ mode, onChangeMode }) {
  const value = mode === 'advanced' ? 'advanced' : 'basic';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      padding: `${SP.sm}px ${SP.md}px`,
      background: CARD_HDR,
      border: `1px solid ${BORDER}`,
      borderRadius: R.md,
      fontSize: FS.sm, color: SECOND,
    }}>
      {/* Breadcrumb root: the back affordance is reframed as a clickable
          "Create" crumb. Its handler is unchanged (onChangeMode(null)); the
          aria-label keeps the back semantics for screen readers. */}
      <Button
        variant="ghost"
        size="md"
        icon={<ChevronLeft size={14} />}
        onClick={() => onChangeMode(null)}
        aria-label="Create, change generation mode"
        style={{ padding: 0, color: INK, fontWeight: 600 }}
      >
        Create
      </Button>
      <span style={{ color: MUTED }}>·</span>
      <Segmented
        options={MODE_OPTIONS}
        value={value}
        onChange={(id) => { if (id !== value) onChangeMode(id); }}
        size="sm"
        ariaLabel="Generation mode"
      />
    </div>
  );
}
