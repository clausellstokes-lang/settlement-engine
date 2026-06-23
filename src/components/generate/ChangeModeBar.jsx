/**
 * ChangeModeBar.jsx — "Change mode" back button.
 *
 * Shown above the mode-specific UI once a card is picked. Module-scope so
 * React Compiler can memoize without seeing it reborn on every render of
 * the parent wizard. Extracted byte-for-byte from GenerateWizard.jsx.
 */

import { ChevronLeft } from 'lucide-react';
import { MUTED, SECOND, INK, BORDER, CARD_HDR, SP, R, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import Segmented from '../primitives/Segmented.jsx';

const MODE_OPTIONS = [
  { id: 'basic', label: 'Basic' },
  { id: 'advanced', label: 'Advanced' },
];

// "Change mode" back button — shown above the mode-specific UI once a card
// is picked. Module-scope so React Compiler can memoize without seeing it
// reborn on every render of the parent wizard.
export function ChangeModeBar({ mode, onChangeMode }) {
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
          aria-label keeps the back semantics for screen readers. Icons stay
          off on this surface, so the crumb carries its meaning in text +
          weight, not the (suppressed) ChevronLeft glyph. */}
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
        value={mode === 'advanced' ? 'advanced' : 'basic'}
        onChange={onChangeMode}
        size="sm"
        ariaLabel="Generation mode"
      />
    </div>
  );
}
