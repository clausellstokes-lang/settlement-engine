/**
 * StaffOnlyPage.jsx — what a NON-STAFF visitor meets at a staff-only route.
 *
 * ⛔ NO GATE REFUSES SILENTLY (owner ruling, ODQ §934.24(c)). The 'elevated'
 * route guard used to answer by NAVIGATING: a member — or anyone — who opened
 * /admin was replaced onto /create with nothing said. That is the exact shape
 * lib/refusalReasons.js was built against; three of the four original offenders
 * "answered a refusal by navigating", one of them to the page the reader was
 * already on. A staff-only route was the fifth, and it had never been counted.
 *
 * So the guard no longer moves anyone (App.jsx), and the route renders this: the
 * ONE refusal idiom (primitives/RefusalNotice.jsx), reading the ONE registered
 * reason (REFUSAL_REASONS.STAFF_ONLY), whose sentence lives in the ONE
 * `refusals.*` block in copy/en.js. Nothing is spelled here that the register
 * does not already own.
 *
 * ⚠ IT OFFERS NO DOOR, AND THAT IS THE DESIGN. Every other refusal in the
 * register can be answered — sign in, wait for tomorrow, pick a smaller size. A
 * staff role cannot be bought, so an instrument row here would either sell
 * something that is not for sale or send the reader somewhere that cannot help.
 * The notice says whose page it is and stops.
 *
 * ⚠ IT IS DELIBERATELY BLIND TO WHETHER THE VISITOR IS SIGNED IN. An anonymous
 * visitor and a signed-in member get the identical sentence, so the page can
 * never become an oracle for "is this account staff" — the same reason
 * AdminPanel's own server reads are audited rather than shape-revealing.
 *
 * LAZY BY CONSTRUCTION: AppViews code-splits this. It is the only reason the
 * refusal machinery (RefusalNotice → ClerkNote → the copy registry) does not
 * join the first-paint closure, which has ~a few KB of headroom
 * (tests/build/vendorPdfLazy.test.js).
 *
 * @enforced-by tests/components/staffOnlyRoute.test.jsx
 */
import Page from './primitives/Page.jsx';
import RefusalNotice from './primitives/RefusalNotice.jsx';
import { REFUSAL_REASONS, refusalOf } from '../lib/refusalReasons.js';
import { PROSE_MAX } from './theme.js';

export default function StaffOnlyPage() {
  return (
    <Page max={PROSE_MAX}>
      <RefusalNotice refusal={refusalOf(REFUSAL_REASONS.STAFF_ONLY)} />
    </Page>
  );
}
