/**
 * StaleDeployNotice.jsx - the "a new version is live" strip (lib/staleDeploy.js).
 *
 * Raised when a lazy chunk failed, the live index.html names a different entry
 * chunk than this tab is running, and an automatic reload was withheld because
 * work is on screen (an unsaved settlement or an open campaign) or a reload
 * already failed to cure it. It informs and offers the reload; it never reloads
 * on its own, so the user can save first.
 *
 * EAGER BY NECESSITY, unlike SessionEvictedBanner which it otherwise mirrors (a
 * flat ink strip, a hairline rule, no radii or shadows): a stale tab cannot load
 * a lazy chunk, and this notice exists for exactly that tab. Its imports are all
 * already in the first-paint closure (theme and the two primitives). It sits at
 * the BOTTOM so it never covers the eviction strip at the top.
 *
 * ⛔ ITS WORDS ARE LITERALS HERE, NOT COPY-REGISTER KEYS, AND THAT IS MEASURED. The
 * register (src/copy) is a lazy chunk; importing `t` from this eager component
 * dragged the whole register into the entry chunk (+58,594 B raw, over all three
 * first-paint budgets in tests/build/vendorPdfLazy.test.js). SessionEvictedBanner
 * keeps its words as literals for the same reason.
 */
import { useCallback, useState, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';
import { INK, CARD, BORDER, sans, FS, SP } from './theme.js';
import { STALE_DEPLOY_EVENT, isStaleDeployNoticeShown } from '../lib/staleDeploy.js';

/** The notice's words (literals: see the header). No em dash. */
export const STALE_DEPLOY_COPY = Object.freeze({
  message: 'SettlementForge was updated while this page was open. Save anything you want to keep, then reload to continue.',
  reload: 'Reload',
  dismiss: 'Dismiss',
});

/**
 * @param {{ reload?: () => void, isShown?: () => boolean }} [props]
 *   Test seams; production passes nothing.
 */
export default function StaleDeployNotice({ reload, isShown = isStaleDeployNoticeShown } = {}) {
  // The recovery owns the truth (raised once, never lowered); the event is only the
  // change signal. Reading it as an external store means a notice raised before this
  // component mounted still shows, with no effect-time state juggling.
  const subscribe = useCallback((onChange) => {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(STALE_DEPLOY_EVENT, onChange);
    return () => window.removeEventListener(STALE_DEPLOY_EVENT, onChange);
  }, []);
  const raised = useSyncExternalStore(subscribe, isShown, () => false);
  const [dismissed, setDismissed] = useState(false);

  if (!raised || dismissed) return null;

  const doReload = reload || (() => window.location.reload());

  return (
    <div
      role="alert"
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: SP.md,
        padding: `${SP.sm}px ${SP.md}px`, minHeight: 44,
        background: INK, color: CARD, borderTop: `1px solid ${BORDER}`,
        fontFamily: sans, fontSize: FS.sm, lineHeight: 1.4, textAlign: 'center',
      }}
    >
      <span>{STALE_DEPLOY_COPY.message}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexShrink: 0 }}>
        <Button variant="primary" size="lg" onClick={doReload} style={{ minHeight: 44 }}>
          {STALE_DEPLOY_COPY.reload}
        </Button>
        <IconButton Icon={X} label={STALE_DEPLOY_COPY.dismiss} onClick={() => setDismissed(true)} size="md" />
      </span>
    </div>
  );
}
