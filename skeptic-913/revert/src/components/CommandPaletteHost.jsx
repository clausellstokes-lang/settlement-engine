/**
 * CommandPaletteHost — the eager sliver of the command palette.
 *
 * Only this piece rides the first-paint closure: a single window keydown listener
 * for cmd/ctrl-K and one boolean of open state. The palette body itself is a lazy
 * import, so its bytes stay off the entry closure until the DM first summons it.
 * Kept deliberately minimal — the sanctioned eager cost of the feature is this file.
 *
 * cmd/ctrl-K toggles: a deliberate chord, so it fires from anywhere (including a
 * text field) after preventing the browser default, and pressing it again while
 * open closes the palette. Escape (inside the palette) also closes it.
 */
import { useState, useEffect, lazy, Suspense } from 'react';

const CommandPalette = lazy(() => import('./CommandPalette.jsx'));

export default function CommandPaletteHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;
  return (
    <Suspense fallback={null}>
      <CommandPalette onClose={() => setOpen(false)} />
    </Suspense>
  );
}
