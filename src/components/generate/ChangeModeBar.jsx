/**
 * ChangeModeBar.jsx — "Change mode" back button.
 *
 * Shown above the mode-specific UI once a card is picked. Module-scope so
 * React Compiler can memoize without seeing it reborn on every render of
 * the parent wizard. Extracted byte-for-byte from GenerateWizard.jsx.
 */

import { ChevronLeft } from 'lucide-react';
import { INK, MUTED, SECOND, BORDER, CARD_HDR, serif_, SP, R, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';

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
      <Button
        variant="ghost"
        size="md"
        icon={<ChevronLeft size={14} />}
        onClick={() => onChangeMode(null)}
        style={{ padding: 0 }}
      >
        Change mode
      </Button>
      <span style={{ color: MUTED }}>·</span>
      <span style={{ fontFamily: serif_, fontWeight: 600, color: INK }}>
        {mode === 'basic' ? 'Basic Generate' : 'Advanced Generate'}
      </span>
    </div>
  );
}
