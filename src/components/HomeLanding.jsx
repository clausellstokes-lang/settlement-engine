/**
 * HomeLanding.jsx — the marketing front door (ported from the redesign template's
 * WelcomeScreen). A full-bleed engraved-town hero with a dark scrim, the thesis,
 * and two CTAs, then three serif pillars (Forge / Canonize / Simulate) and the
 * lifecycle spine. Shown on the Home tab; the bare root canonicalizes here for
 * logged-out visitors (App.jsx front door; members are sent to /create), and the
 * CTAs adapt by auth state.
 *
 * Icons-off (text-only).
 *
 * V2 (flag `landingV2`, default ON): the hero band is UNCHANGED, and new in-flow
 * bands mount below it — a proof band (sample dossier, anon cold-visitors only),
 * the same pillars + spine, an honest living-world feature strip (all auth
 * states), and a closing CTA band that repeats the hero's primary. Flag off
 * renders the original hero + three pillars + lifecycle spine.
 *
 * NOTE: the region-wake replay proof card (RegionWakeReplay) is deferred — its
 * `domain/display/regionWakeReplay.js` projection is a domain-wave deliverable
 * not yet landed in this tree. The proof band shows the sample dossier alone
 * until it arrives; see the 4d-4f/domain handoff.
 */
import { lazy, Suspense, useEffect } from 'react';
import { INK, PARCH_100, CARD, BORDER, BODY, SECOND, GOLD_DEEP, serif_, sans, FS, SP, R } from './theme.js';
import Button from './primitives/Button.jsx';
import LifecycleSpine from './primitives/LifecycleSpine.jsx';
import { backgroundImageUrl } from '../config/pageBackgrounds.js';
import { flag } from '../lib/flags.js';
import { Funnel } from '../lib/analytics.js';
import { useStore } from '../store/index.js';
import { t, tx } from '../copy/index.js';

const PILLARS = [
  { t: 'Forge', d: 'Pick an archetype and a size. In seconds you have a town with a working economy, named figures, and tensions ready for your table.' },
  { t: 'Canonize', d: 'Make a town part of your campaign. From there, every change you make becomes an event on its timeline. A history of its own.' },
  { t: 'Simulate', d: 'Drop your canon towns into the Realm and advance time. Wars ignite and resolve, faiths rise, and the chronicle writes itself.' },
];

// The anon proof card lazy-loads exactly like the Create landing does
// (WizardEmptyState's proof cards). It self-gates inside on
// tier === 'anon' && !settlement, so it renders nothing once the visitor has
// the real thing — but we ALSO gate the whole band (heading included) on the
// same condition below, so a member or a returning anon never sees an empty
// band shell.
const HomeSampleDossier = lazy(() => import('./home/HomeSampleDossier.jsx'));

// A height-matched skeleton reserves the lazy card's space so the proof band
// reads as "loading" rather than popping in and shifting layout (mirrors
// WizardEmptyState's ProofSkeleton).
function ProofSkeleton() {
  return (
    <div aria-hidden="true" style={{
      height: 360, borderRadius: R.lg, border: `1px solid ${BORDER}`, background: CARD, opacity: 0.6,
    }} />
  );
}

// One living-world system, landing-native and compact: the claim over a thin
// gold rule. Copy reuses the canonical aboutLiving.* registry strings (no
// duplication); this is an honest feature map, not an upsell wall, so there is
// no premium chip and no button. Internal padding trims on mobile (SP.lg) so
// the prose keeps its measure on a narrow card, matching the pillars above.
function LivingSystemStrip({ id, isMobile }) {
  return (
    <div style={{
      padding: isMobile ? SP.lg : SP.xl,
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg,
      borderTop: `3px solid ${GOLD_DEEP}`,
    }}>
      <h3 style={{ margin: 0, fontFamily: serif_, fontSize: FS.xl, fontWeight: 600, color: INK, lineHeight: 1.2 }}>
        {t(`aboutLiving.systems.${id}.title`)}
      </h3>
      <p style={{ margin: `${SP.sm}px 0 0`, fontFamily: serif_, fontSize: FS.lg, lineHeight: 1.6, color: BODY }}>
        {t(`aboutLiving.systems.${id}.claim`)}
      </p>
    </div>
  );
}

export default function HomeLanding({ isMobile, signedIn, isPremium = false, onNavigate, onSignIn }) {
  const v2 = flag('landingV2');

  // Anon cold-visitor gate for the proof band. Read unconditionally (hooks
  // rule); these only feed the V2 proof band. The V1 render path is unaffected
  // in behavior — flag off renders exactly as today. Matches the proof card's
  // own internal gate (tier === 'anon' && !settlement) so the band never mounts
  // an empty shell for a member or a returning anon.
  const tier = useStore(s => s.auth.tier);
  const hasSettlement = useStore(s => !!s.settlement);
  const showProof = v2 && tier === 'anon' && !hasSettlement;

  // Instrument the Welcome page (both variants, not flag-gated): fire a
  // once-per-session welcome_view. Distinct from homepage_view (the /create
  // hero), so each surface keeps its own funnel semantics. Optional-chained so
  // it degrades to a no-op until the analytics wave lands the welcome_view event.
  useEffect(() => {
    Funnel.welcomeView?.();
  }, []);

  // Full-bleed hero: cancel the <main> padding so the band spans edge to edge.
  const padH = isMobile ? SP.md : SP.xxl;
  const padTop = isMobile ? SP.md : SP.lg;

  const livingSystems = Object.keys(tx('aboutLiving.systems') || {});
  const primaryLabel = signedIn ? 'Forge your next settlement' : 'Forge your first settlement';

  return (
    <div>
      {/* Hero band — the DARK-HERO variant of the painted-page system. The ink
          scrim + create.jpg now live in index.css (.hero-dark); JS carries only
          the --page-bg URL var + the class, so no raw color leaks here
          (pageBackgrounds.js contract). A RADIAL scrim is darkest behind the
          centred headline (where the cartographer's-desk parchment sits blank)
          and eases toward the edges, so the maps / books / quill stay visible
          while the cream text keeps its contrast. Opposite polarity (dark ink)
          to the cream `.page-painted` pages, by design — one mechanism, two
          polarities. UNCHANGED in both variants. */}
      <div
        className="hero-dark"
        style={{
          margin: `-${padTop}px -${padH}px 0`,
          '--page-bg': backgroundImageUrl('create'),
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? `${SP.xxl}px ${SP.lg}px` : `${SP.xxl + SP.xl}px ${SP.xl}px`, textAlign: 'center' }}>
          {/* Hero headline steps down on mobile (FS['28']) to reclaim above-the-fold
              height on a phone; desktop stays at FS['36'] byte-identical. */}
          <h1 style={{ margin: 0, fontFamily: serif_, fontSize: isMobile ? FS['28'] : FS['36'], fontWeight: 600, color: PARCH_100, lineHeight: 1.1, maxWidth: 760, marginInline: 'auto', textShadow: '0 2px 10px rgba(0,0,0,0.55)' }}>
            Your players have a thousand choices.
            {/* The payoff sentence sits on its own line, set a hair apart, so it
                reads as a clean turn rather than wrapping mid-phrase. */}
            <span style={{ display: 'block', marginTop: SP.xs }}>Now you have every answer.</span>
          </h1>
          <p style={{ margin: `${SP.lg}px auto ${SP.xl}px`, maxWidth: 620, fontFamily: serif_, fontSize: FS.xxl, fontStyle: 'italic', color: 'rgba(244,234,208,0.85)', lineHeight: 1.6, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
            SettlementForge generates living towns: economies, people, tensions, and history.
            {/* The simulation turn starts on its own line so "Then ..." reads as a
                clean second beat. The closer names the concrete simulation
                (wars, faiths, the chronicle) rather than an abstraction. */}
            <span style={{ display: 'block' }}>Then it simulates how they change: wars ignite and resolve, faiths rise, and the chronicle writes itself.</span>
          </p>
          <div style={{ display: 'flex', gap: SP.sm, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" onClick={() => onNavigate('generate')}>{primaryLabel}</Button>
            {/* Secondary CTA: hidden for premium/elevated accounts (no upsell to
                someone who already has it). Anon gets Sign in; a signed-in free
                user gets the Explore Premium prompt to Pricing. On the dark scrim,
                lift the border opacity on mobile so the outline reads against the
                photographic hero; desktop keeps its lighter 0.4 border. */}
            {!isPremium && (
              <Button variant="secondary" size="lg" onClick={() => (signedIn ? onNavigate('pricing') : onSignIn())} style={{ background: 'rgba(251,245,230,0.1)', color: PARCH_100, borderColor: isMobile ? 'rgba(232,217,176,0.7)' : 'rgba(232,217,176,0.4)' }}>
                {signedIn ? 'Explore Premium' : 'Sign in'}
              </Button>
            )}
          </div>
          {/* Sub-CTA line, same font + size for both states: anon gets the free-to-
              try reassurance; members get a learn-more link into the About page's
              Living World tab (the Realm / Cartographer story). */}
          {signedIn ? (
            <div style={{ marginTop: SP.md, display: 'flex', justifyContent: 'center' }}>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('howto', { search: '?tab=living' })} style={{ fontFamily: sans, fontSize: FS.xs, color: 'rgba(244,234,208,0.72)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Learn more about the simulator and the Realm map for Cartographers
              </Button>
            </div>
          ) : (
            <div style={{ fontFamily: sans, fontSize: FS.xs, color: 'rgba(244,234,208,0.55)', marginTop: SP.md }}>
              Free. No account needed to forge your first town.
            </div>
          )}
        </div>
      </div>

      {/* ── PROOF BAND (V2, anon cold visitors only) ──────────────────────────
          The sample-dossier proof card, lazy-loaded like the Create landing. The
          whole band — heading included — is gated on the same condition the card
          self-gates on, so a member or a returning anon never sees an empty band
          shell. The region-wake replay card is deferred (see the file header). */}
      {showProof && (
        <section aria-labelledby="landing-proof-heading" style={{ maxWidth: 1100, margin: '0 auto', padding: `${SP.xxl}px 0 0` }}>
          <div style={{ textAlign: 'center', marginBottom: SP.xl }}>
            <h2 id="landing-proof-heading" style={{ margin: 0, fontFamily: serif_, fontSize: FS['32'], fontWeight: 600, color: INK }}>
              {t('landing.proofHeading')}
            </h2>
          </div>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <Suspense fallback={<ProofSkeleton />}>
              <HomeSampleDossier />
            </Suspense>
          </div>
        </section>
      )}

      {/* Three pillars — serif title + description, no icon boxes. Unchanged in
          both variants. */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: `${SP.xxl}px 0 ${SP.xl}px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: SP.lg }}>
          {PILLARS.map(p => (
            // Trim pillar internal padding on mobile (SP.lg) so prose keeps its
            // measure on a narrow card; desktop holds SP.xl byte-identical.
            <div key={p.t} style={{ padding: isMobile ? SP.lg : SP.xl, background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg }}>
              {/* V2 steps the pillar title down to the card-title tier (FS.xl) so
                  the V2 band section headings (FS['32']) read as dominant over the
                  cards beneath them — the 3-tier squint separation (section >
                  card-title > body). V1 (flag off) holds FS.h1 byte-identical. */}
              <h2 style={{ margin: 0, fontFamily: serif_, fontSize: v2 ? FS.xl : FS.h1, fontWeight: 600, color: INK }}>{p.t}</h2>
              <p style={{ margin: `${SP.sm}px 0 0`, fontFamily: serif_, fontSize: FS.lg, lineHeight: 1.6, color: BODY }}>{p.d}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: SP.xl, display: 'flex', justifyContent: 'center' }}>
          <LifecycleSpine stage="canon" />
        </div>
      </div>

      {/* ── LIVING-WORLD BAND (V2, all auth states) ───────────────────────────
          An honest, landing-native map of the four premium living systems. Copy
          reuses the canonical aboutLiving.* registry strings. No upsell buttons
          (premium members see this band too), only one ghost link into the About
          page's Living World tab. */}
      {v2 && livingSystems.length > 0 && (
        <section aria-labelledby="landing-living-heading" style={{ maxWidth: 1100, margin: '0 auto', padding: `${SP.xl}px 0` }}>
          <div style={{ textAlign: 'center', marginBottom: SP.xl }}>
            <h2 id="landing-living-heading" style={{ margin: 0, fontFamily: serif_, fontSize: FS['32'], fontWeight: 600, color: INK }}>
              {t('landing.livingHeading')}
            </h2>
            <p style={{ margin: `${SP.sm}px auto 0`, maxWidth: 620, fontFamily: serif_, fontSize: FS.lg, fontStyle: 'italic', lineHeight: 1.6, color: SECOND }}>
              {t('landing.livingSub')}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: SP.lg }}>
            {livingSystems.map(id => <LivingSystemStrip key={id} id={id} isMobile={isMobile} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: SP.sm, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, letterSpacing: '0.04em', color: BODY }}>
            {t('aboutLiving.qualifier')}
          </div>
          <div style={{ marginTop: SP.lg, display: 'flex', justifyContent: 'center' }}>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('howto', { search: '?tab=living' })}>
              {t('landing.livingCta')}
            </Button>
          </div>
        </section>
      )}

      {/* ── CLOSING CTA BAND (V2, all auth states) ────────────────────────────
          A short serif line and ONE primary button repeating the hero's primary.
          This is its own labeled region, so a second primary on the page is
          allowed (one primary per region). Anon also gets the hero's free-to-try
          reassurance. */}
      {v2 && (
        <section aria-labelledby="landing-closing-heading" style={{ maxWidth: 720, margin: '0 auto', padding: `${SP.xl}px 0 ${SP.xxl}px`, textAlign: 'center' }}>
          <h2 id="landing-closing-heading" style={{ margin: 0, fontFamily: serif_, fontSize: FS['32'], fontWeight: 600, color: INK }}>
            {t('landing.closingLine')}
          </h2>
          <div style={{ marginTop: SP.lg, display: 'flex', justifyContent: 'center' }}>
            <Button variant="primary" size="lg" onClick={() => onNavigate('generate')}>{primaryLabel}</Button>
          </div>
          {!signedIn && (
            <div style={{ fontFamily: sans, fontSize: FS.xs, color: SECOND, marginTop: SP.md }}>
              Free. No account needed to forge your first town.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
