/**
 * eventComposer/EditQueueBanner.jsx — the §10 edit-mode notice (THE MUTABLE
 * DOCKET): shown while the composer is editing a QUEUED intention; applying
 * replaces the entry in place, "Stop editing" returns to a fresh composition.
 */
import { INK, BORDER, CARD, sans, FS, SP } from '../../theme.js';
import Button from '../../primitives/Button.jsx';

export default function EditQueueBanner({ onStop }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: SP.sm, marginBottom: SP.sm,
      border: `1px solid ${BORDER}`,
      fontSize: FS.xxs, fontFamily: sans, color: INK, background: CARD,
    }}>
      <span style={{ flex: 1 }}>
        Editing a queued order. Applying replaces it in place (same slot, same identity).
        Changing the verb starts a fresh composition instead.
      </span>
      <Button variant="ghost" size="sm" onClick={onStop}>
        Stop editing
      </Button>
    </div>
  );
}
