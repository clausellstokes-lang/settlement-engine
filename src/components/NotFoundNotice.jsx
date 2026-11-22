/**
 * components/NotFoundNotice.jsx — WHAT THE FRONT DOOR SAYS WHEN THERE IS NO SUCH PAGE.
 *
 * ⛔ NO GATE REFUSES SILENTLY, AND A ROUTER IS A GATE (owner ruling, ODQ §934.24(c)).
 * The 2026-09-20 anonymous walk opened `/this-page-does-not-exist` on both viewports
 * and measured `href: /create`, `title: SettlementForge`, `notices: []`,
 * `saysNotFound: false` (REVIEW-P F11). `lib/routes.js` had returned `notFound: true`
 * for that address all along; its only consumer was App's canonical-URL upgrade, which
 * rewrote the address and dropped the flag. A dead link therefore looked exactly like a
 * link that worked — the worst version of this class, because the reader has no way to
 * know anything went wrong at all.
 *
 * ONE REASON, ONE SENTENCE, ONE COMPONENT. Like the Realm's phone notice and the staff
 * route's, this renders the registered reason through primitives/RefusalNotice.jsx
 * rather than writing its own line; the address is a VAR, so the sentence lives in
 * copy/en.js with every other refusal and the walker can prove it resolves.
 *
 * ⚠ THE ADDRESS IS PRINTED, AND IT IS THE READER'S OWN. It is `location.pathname` at
 * the moment the router refused it — never a query string, never a hash, so nothing a
 * link may have carried about the reader is echoed back onto the page.
 *
 * ⛔ THE LATCH IS NOT HERE. `notFound` is true for a single render (App rewrites the
 * URL and the route store re-emits), so the fact is captured by hooks/useMissedPath.js
 * and handed down; that module records why. This component is a leaf: given a path it
 * says the line, and it is fetched only by the visitor who needs it (AppViews lazily
 * mounts it, keeping the refusal machinery off the eager first-paint closure).
 *
 * @enforced-by tests/components/notFoundNotice.test.jsx
 */
import RefusalNotice from './primitives/RefusalNotice.jsx';
import Button from './primitives/Button.jsx';
import { REFUSAL_REASONS, refusalOf } from '../lib/refusalReasons.js';
import { t } from '../copy/index.js';
import { SP } from './theme.js';

/**
 * @param {object} props
 * @param {string} props.path        the address the router had no page for
 * @param {() => void} props.onDismiss  the reader is done with the line
 */
export default function NotFoundNotice({ path, onDismiss }) {
  return (
    <RefusalNotice
      refusal={refusalOf(REFUSAL_REASONS.PAGE_NOT_FOUND, { path })}
      style={{ maxWidth: 960, margin: `${SP.md}px auto 0`, width: '100%' }}
      // The door is "you have read it": the page the reader landed on is already the
      // useful destination, so the only thing left to offer is the line's own exit.
      actions={<Button variant="ghost" size="sm" onClick={onDismiss}>{t('common.close')}</Button>}
    />
  );
}
