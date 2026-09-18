/**
 * RealmLockedGate.jsx — THE ONE locked-Realm gate, for anon and free viewers.
 *
 * It was RealmDashboardLocked, living inside RealmDashboard.jsx and reachable
 * only from the PHONE (WorldMap renders RealmMobileGate below 640px; on desktop
 * the Inspector that hosts the dashboard is withheld until the realm's first
 * advance, which these viewers can never run). So the honest gate — "the live
 * controls and the world pulse unlock with Cartographer" — was a phone-only
 * surface, while the desktop Realm showed a non-entitled viewer a palette
 * inviting them to "Start a campaign" behind a button that could only toast.
 *
 * Lifted here as a LEAF so both surfaces render the SAME component rather than a
 * second copy of its words: RealmDashboard imports it for the phone dashboard,
 * SettlementPalette imports it for the desktop sidebar. Keeping it out of
 * RealmDashboard.jsx also keeps the palette off that module's chunk (warStatus,
 * mobilization, occupation, hegemony, the pantheon panel, the certification
 * panel) — a gate should not drag the dashboard behind it.
 *
 * PURE PRESENTATIONAL, with one fire-and-forget pricing-moment effect. No
 * worldState, no rng, no wall clock, and NO lucide import: both call sites live
 * in the map subtree and pass their own mark as `icon`, so this leaf stays out
 * of every icons-off roster (primitives/IconsContext.js).
 *
 * @param {Object} props
 * @param {string} props.tier                     auth tier ('anon' | 'free' | …)
 * @param {React.ReactNode} [props.icon]          the lock mark, supplied by the caller
 * @param {() => void} [props.onUpgrade]          route to the premium-value surface
 * @param {() => void} [props.onSignIn]           route to the sign-in surface (anon)
 * @param {{label: string, tone: string}|null} [props.previewTension]
 *        the viewer's OWN realm conflict band, when they have a campaign to preview
 * @param {boolean} [props.fireEntryMoment=true]  fire map_realm_teaser on mount
 * @param {string} [props.testId='realm-dashboard-locked']
 */

import { useEffect } from 'react';

import { useStore } from '../../store/index.js';
import { AMBER_DEEP, BODY, CARD, CARD_ALT, FS, GOLD, INK, RED, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import { purchasesOpen } from '../../lib/launchGate.js';

/** The gate's heading. Exported so a test pins the words in one place. */
export const REALM_GATE_HEADING = 'The Realm comes alive with Cartographer';

export default function RealmLockedGate({
  tier, icon = null, onUpgrade, onSignIn, previewTension = null,
  fireEntryMoment = true, testId = 'realm-dashboard-locked',
}) {
  // Purchases stay closed until launch (lib/launchGate.js). The TIER DOOR is a
  // conversion CTA and closes with the pill exactly like its siblings; "Sign in"
  // is account creation, not a purchase, and stays live — the same split the
  // save meter and the compendium gate apply.
  const purchasesAreOpen = purchasesOpen();
  const isAnon = tier === 'anon';

  useEffect(() => {
    if (!fireEntryMoment) return undefined;
    let cancelled = false;
    import('../../lib/pricingMoments.js')
      .then(({ triggerPricingMoment }) => {
        if (cancelled) return;
        const setActive = useStore.getState().setActivePricingMoment;
        triggerPricingMoment('map_realm_teaser', setActive, { tier });
      })
      .catch(() => { /* never block the teaser render */ });
    return () => { cancelled = true; };
  }, [tier, fireEntryMoment]);

  // P9 — pressing a gate control IS the advance attempt: fire the
  // simulation-intent moment (cooldown-guarded), then route. Both controls carry
  // it so the signal survives the pre-launch close of the tier door: an
  // anonymous viewer's live control is "Sign in", and it is the same intent.
  const attempt = () => {
    import('../../lib/pricingMoments.js')
      .then(({ triggerPricingMoment }) =>
        triggerPricingMoment('first_advance_attempt', useStore.getState().setActivePricingMoment, { tier }))
      .catch(() => {});
  };

  return (
    <div data-testid={testId} style={{
      display: 'grid', gap: SP.md,
      padding: SP.lg,
      border: `1px solid ${GOLD}`,
      background: CARD_ALT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon}
        <h3 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.md, fontWeight: 950 }}>
          {REALM_GATE_HEADING}
        </h3>
      </div>
      <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.55 }}>
        This is the living simulation. Advance time and the region runs for years:
        wars ignite and burn themselves out, faiths win converts, trade routes flip,
        and a chronicle writes itself. Explore the map below. The live controls and
        the world pulse unlock with Cartographer.
      </p>
      {/* A real, read-only preview of the GM's own realm (P9): the Conflict band
          their world is in right now, blurred just enough to read as locked. The
          aria-label keeps the actual band available to assistive tech. */}
      {previewTension && (
        <div
          data-testid="realm-locked-preview"
          aria-label={`Your realm's conflict band: ${previewTension.label} (unlock to read live)`}
          style={{
            display: 'grid', gap: 3,
            padding: `${SP.sm}px ${SP.md}px`,
            background: CARD, borderLeft: `3px solid ${previewTension.tone === 'crisis' ? RED : previewTension.tone === 'hot' ? AMBER_DEEP : GOLD}`,
          }}
        >
          <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Conflict · your realm
          </span>
          <span aria-hidden style={{
            color: previewTension.tone === 'crisis' ? RED : previewTension.tone === 'hot' ? AMBER_DEEP : INK,
            fontFamily: sans, fontSize: FS.lg, fontWeight: 950, lineHeight: 1.15,
            filter: 'blur(3px)', userSelect: 'none',
          }}>
            {previewTension.label}
          </span>
        </div>
      )}
      {/* Body color (not SECOND) so the three value props clear AA 4.5:1 on
          parchment — these are load-bearing benefit prose, not quiet scent (P7). */}
      <ul style={{ margin: 0, paddingLeft: 18, color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.7 }}>
        <li>Advance the realm month by month and watch the chronicle fill</li>
        <li>The self-ending war layer: sieges, coalitions, conquest</li>
        <li>The living pantheon: deities contest converts and rise</li>
      </ul>
      {/* The gate ends in an ACTION. It used to promise an anonymous viewer that
          signing in would "unlock the Realm" — it does not; the Realm is
          Cartographer's. So the anon arm carries BOTH true doors, and the free
          arm carries the one that is theirs. */}
      <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap' }}>
        {isAnon && (
          <Button variant="primary" size="md" onClick={() => { attempt(); onSignIn?.(); }}>
            Sign in
          </Button>
        )}
        <Button
          variant={isAnon ? 'secondary' : 'primary'} size="md"
          disabled={!purchasesAreOpen}
          style={purchasesAreOpen ? undefined : { flexWrap: 'wrap' }}
          onClick={() => { attempt(); onUpgrade?.(); }}
        >
          See Cartographer
          {!purchasesAreOpen && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
        </Button>
      </div>
    </div>
  );
}
