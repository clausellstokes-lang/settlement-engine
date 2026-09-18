/**
 * home/LandingBelowFold.jsx — everything below the hero fold of the scrollable
 * Welcome page: the salt-road journey 01·Forge → 02·Visual → 03·Voice →
 * 04·Realm → 05·Commons → 06·Set out. Lazy-loaded as ONE chunk by
 * HomeLanding.jsx so the hero paints first (LCP). The page's footer is the
 * app's one global footer, pinned by App.jsx (owner order 2026-09-16).
 *
 * The §02/§03/§04 artifacts render FROZEN REAL ENGINE OUTPUT (owner amendment
 * W-L2/1) and live in ./LandingArtifacts.jsx with their fixture; §05 renders up
 * to six REAL published gallery settlements (W-L2/3, fetched on mount, ranked
 * by top_voted — the strongest signal gallery.js tracks), falling back to the
 * Create page's three curated Founding Worlds. Spec constraints held: tokens only
 * (§3.1); gold the only brand accent, violet ONLY in §03 + the faith chip in
 * the §04 chronicle (§3.2); Lucide icons, no emoji (§3.5); every control routes
 * and decorative chips are plain spans (§3.8); <section aria-labelledby> + h2.
 */

import { useEffect, useRef, useState } from 'react';
import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import { purchasesOpen } from '../../lib/launchGate.js';
import WelcomeJourneyBackdrop from './WelcomeJourneyBackdrop.jsx';
import { fontFamily, radius } from '../../design/tokens.js';
import {
  INK, SECOND, BODY, MUTED, GOLD, GOLD_TXT, GOLD_BG,
  PARCH, PARCH_100, BORDER,
  FS, SP, R, ELEV, sans, serif_,
} from '../theme.js';
import { tl } from '../../copy/landing.js';
// Config-sourced tier facts (brief §4 / ruling #6): the closer tier strip
// interpolates these instead of hand-typing the numbers, so a catalog change
// (anon size ceiling, free save cap) can never drift from what the strip shows.
// tierFacts imports only config/pricing.js and rides this lazy below-fold chunk,
// so it adds nothing to the first-paint closure.
import { ANON_MAX_SIZE_LABEL, FREE_SAVE_LIMIT, FOUNDER_SEATS } from '../../config/tierFacts.js';
import { fetchPublicGallery } from '../../lib/gallery.js';
// The commons fallback IS the Create page's Founding Worlds strip — the same
// component, so the heading, the lead-in, the three curated samples and the
// 'Fork this sample' wiring are single-sourced rather than restated here.
import FoundingWorlds from '../generate/FoundingWorlds.jsx';
import {
  MiniDossierCard, VoiceCards, WhyTraceCard, RealmMapCard, SCENE, cardStyle,
} from './LandingArtifacts.jsx';

const MONO = fontFamily.mono;
const CONTENT_MAX = 1080; // spec §4 content column

// Cream parchment on a photographic hero (>0.88 alpha) — the panel that holds
// text on the painted (01/04) sections so prose never sits on the painting (§5).
const PANEL_BG = 'rgba(255,251,245,0.9)';

// ── Shared style fragments ───────────────────────────────────────────────────
const h2Style = (isMobile) => ({ margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: isMobile ? FS['26'] : FS['34'], fontWeight: 600, lineHeight: 1.15, color: INK });
const proseStyle = { margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: FS.xl, lineHeight: 1.65, color: BODY };
const panelStyle = { background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: R.lg, boxShadow: ELEV[1], padding: '28px 30px' };
const capsLink = {
  fontFamily: sans, fontSize: FS.sm, fontWeight: 800, letterSpacing: '0.04em',
  textTransform: 'uppercase', color: GOLD_TXT,
};

// The track minimum is capped at the column's own width: on a 390px phone the stop's
// content box is 366px, and a bare 380px minimum pushed the page 2px sideways.
const twoColGrid = (gap = 28) => ({ maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', gap, alignItems: 'center' });

// ── The salt-road waypoint spine (spec §4) ───────────────────────────────────
function Waypoint({ pill, goldPill, dark = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} aria-hidden="true">
      <div style={{
        width: 1, height: 56,
        background: dark
          ? 'linear-gradient(rgba(244,234,208,0), rgba(244,234,208,0.55))'
          : 'linear-gradient(rgba(74,59,34,0), rgba(74,59,34,0.5))',
      }} />
      <div style={{
        width: 11, height: 11, borderRadius: radius.button, background: GOLD,
        border: dark ? '2px solid rgba(251,245,230,0.9)' : '2px solid rgba(255,251,245,1)',
        boxShadow: ELEV[1], margin: `${SP.sm}px 0`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{
          fontFamily: MONO, fontSize: FS.xs, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: dark ? 'rgba(244,234,208,0.85)' : SECOND,
          background: dark ? 'transparent' : 'rgba(255,251,245,0.9)',
          border: dark ? '1px solid rgba(244,234,208,0.35)' : `1px solid ${BORDER}`,
          borderRadius: radius.button, padding: '4px 14px', whiteSpace: 'nowrap', lineHeight: 1.4,
        }}>
          {pill}
        </span>
        {goldPill && (
          <span style={{
            fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: GOLD_TXT, background: GOLD_BG,
            border: `1px solid ${GOLD}`, borderRadius: radius.button, padding: '4px 12px',
            whiteSpace: 'nowrap', lineHeight: 1.4,
          }}>
            {goldPill}
          </span>
        )}
      </div>
    </div>
  );
}

// Section wrappers ------------------------------------------------------------
/** The empty band below a stop's content, before the next travel leg. */
const sectionTail = (isMobile) => (isMobile ? SP.xxl * 2 : 84);
const sectionPad = (isMobile) => ({ padding: isMobile ? `0 ${SP.md}px ${sectionTail(true)}px` : `0 ${SP.xxl}px ${sectionTail(false)}px` });
// THE FADED TAIL (owner orders 2026-09-17, "Fix the small visual defects"). The header
// is transparent over the page, so every translucent-cream stop scrolls under it, and
// while a stop's empty bottom band passes beneath the arrow it read as a plain cream
// strip between the shaft and the painted film. The strip was that band, not a space
// kept for the feather (measured: at 1440x900 and scroll 2400 the layer under the
// shaft is #forge's bottom padding, and the film begins where #forge ends). So the
// band fades out: the cream dissolves into the film over the tail's own height, which
// holds no content, and the painting meets the shaft at every scroll position. Masks
// read only alpha, so the gradient's colour is a token (the ArrowPaint idiom).
const creamTailFade = (isMobile) => {
  const fade = `linear-gradient(${INK} calc(100% - ${sectionTail(isMobile)}px), transparent)`;
  return { WebkitMaskImage: fade, maskImage: fade };
};

// ── 01 · Forge — the Instant Draft artifact (InstantDraftCard) was removed per
// owner order (2026-07-22): the Cnocby sample-draft card (MiniDossierCard) now
// fills that slot in §01. The widget was landing-only (never used by the Create
// page's own size picker), so its code is deleted as dead landing chrome. Its
// forge.draft* / forge.sizes / forge.mode* copy keys are unreferenced on the
// landing (left in place as inert strings, not retyped).
//
// ⚠ forge.ceiling IS THE EXCEPTION, AND WAS THE DEFECT (§320.3): the widget's
// removal took the anon SIZE-CEILING DISCLOSURE off the page with it, while the
// key and its claims-parity pin stayed green — a claim bound to enforcement that
// no visitor could read. §363.1 rules it back on: the sentence is RE-LIT in the
// §01 panel below, at the landing's anonymous entry point. The words are the
// owner-era spec string, re-referenced and NOT retyped, so the tierFacts binding
// (tests/copy/landingClaimsParity.test.js) holds unchanged — and that same file
// now carries a RENDERED arm, so un-referencing this key again reds the gate
// instead of passing quietly.

// ── 05 · Commons — REAL published towns, or the curated Founding Worlds (W1) ─
// Fetched once on below-fold mount (anon-permitted public read), ranked by
// top_voted — the strongest ranking signal src/lib/gallery.js actually tracks
// (it has net_votes + view counts; there is NO fork counter).
//
// ⛔ THE PLACEHOLDER BACKFILL IS GONE (2026-09-18). Every slot without a real
// town used to render a DECORATIVE card — an invented name, an invented author,
// an invented population, labelled ' (placeholder)' beside the name — so an
// empty gallery showed six fabricated towns to every visitor of a page that
// sells "Simulated, not AI-generated". There was no flag: the state was purely
// data-driven, and the gallery is empty before launch. The rule now:
//   • THREE OR MORE real published rows → render the real rows, up to six;
//   • fewer than three → render the Create page's three curated Founding Worlds
//     (Mossgate / Black Crag / Thornwell), with its heading, its copy and its
//     real 'Fork this sample' action. They are real generations from real seeds,
//     so the fallback offers the visitor something true to do instead of
//     something false to look at.
// The threshold is three because a one- or two-card grid reads as a broken strip;
// below it the Founding Worlds trio fills the row honestly.
const COMMONS_SLOTS = 6;      // owner order 2026-07-21, ledger 4f71743a
const COMMONS_MIN_REAL = 3;   // below this the curated trio shows instead

// A real row without its own gallery image keeps the strip's painted-scene box
// (same height, zero layout shift). The scene is DERIVED from the row's own
// tier, never invented: it is the card's backdrop, not a claim about the town.
const SCENE_FOR_TIER = { thorp: 'thorpe', hamlet: 'thorpe', village: 'village', town: 'village', city: 'city', metropolis: 'city', capital: 'city' };

function GalleryCards({ onNavigate }) {
  const [tiles, setTiles] = useState(null); // null = not landed yet
  useEffect(() => {
    let live = true;
    fetchPublicGallery({ pageSize: COMMONS_SLOTS, sort: 'top_voted' })
      .then((r) => { if (live) setTiles((r?.items || []).slice(0, COMMONS_SLOTS)); })
      .catch(() => { if (live) setTiles([]); });
    return () => { live = false; };
  }, []);

  const real = (tiles || []).slice(0, COMMONS_SLOTS);
  // Not landed yet, unreachable, or a gallery too thin to fill a row: the
  // curated trio. It carries its own heading and lead-in (the Create page's).
  if (real.length < COMMONS_MIN_REAL) return <FoundingWorlds onNavigate={onNavigate} />;

  return (
    <div style={{
      maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0`, display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18,
    }}>
      {real.map((tile) => (
        <div key={tile.slug} style={{ ...cardStyle, boxShadow: ELEV[1], overflow: 'hidden' }}>
          <div style={{
            position: 'relative', height: 150,
            backgroundImage: tile.imageUrl ? `url('${tile.imageUrl}')` : SCENE(SCENE_FOR_TIER[tile.tier] || 'village'),
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
            <span style={{
              position: 'absolute', top: 10, right: 10, fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
              letterSpacing: '0.05em', textTransform: 'uppercase', color: PARCH_100,
              background: 'rgba(27,20,8,0.6)', borderRadius: R.sm, padding: '2px 8px',
            }}>{tile.tier}</span>
            <span style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, padding: '26px 14px 10px',
              backgroundImage: 'linear-gradient(rgba(20,14,5,0), rgba(20,14,5,0.72))',
              fontFamily: serif_, fontSize: FS['18'], fontWeight: 600, color: PARCH,
            }}>{tile.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, padding: '7px 14px', minHeight: 52 }}>
            <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: MUTED }}>
              {tl('commons.votes', { n: tile.netVotes ?? 0 })}
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: sans, fontSize: FS.sm, fontWeight: 800, color: SECOND }}>
              {tile.population ?? ''}
            </span>
            {/* Real tile → a real route (§3.8): the gallery detail view. */}
            <Button variant="secondary" size="sm" onClick={() => onNavigate('gallery', { params: { slug: tile.slug } })}>
              {tl('commons.open')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 06 · Set out — tier strip ────────────────────────────────────────────────
// Live founder-chair counter. Lazy-imports the seat module so supabase never
// rides the eager chunk; the RPC read is anon-safe and 5-minute cached. Falls
// back to the static cap line when the count is unavailable (null), so a backend
// hiccup never breaks the card.
//
// ⛔ IT COUNTS CHAIRS HELD, NOT SEATS LEFT (DESIGN_FOUNDERS_HALL §1, ODQ §118).
// "N/30 seats left" is scarcity vocabulary for a thing on sale, and no chair has
// ever been sold. The Hall's own covenant voice reads "N of 30 chairs held", and
// the landing page now says the same words as the Hall it points at.
function FounderSeatLine() {
  const [seats, setSeats] = useState(null); // { remaining, cap } once loaded
  useEffect(() => {
    let alive = true;
    import('../../lib/founderSeats.js')
      .then(async (m) => {
        const remaining = await m.fetchFounderSeatsRemaining();
        if (alive) setSeats({ remaining, cap: m.FOUNDER_SEAT_CAP });
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  const cap = seats?.cap ?? 30;
  const remaining = seats?.remaining;
  return (
    <div style={{
      marginTop: SP.sm, fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
      letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(224,192,128,1)',
    }}>
      {typeof remaining === 'number'
        ? `${cap - remaining} of ${cap} chairs held`
        : `${cap} chairs, by invitation`}
    </div>
  );
}

// Interpolate the config-sourced tier facts into a closer-strip body. The copy
// carries {anonSize}/{freeSaves} tokens (copy/landing.js); the numbers come from
// config/tierFacts.js so the strip can never restate a ceiling the catalog didn't
// (brief §4 / ruling #6 — config-sourced facts, zero hand-typed numbers).
const TIER_FACT_VARS = { anonSize: ANON_MAX_SIZE_LABEL, freeSaves: FREE_SAVE_LIMIT, seats: FOUNDER_SEATS };
function fillTierBody(body) {
  return String(body).replace(/\{(\w+)\}/g, (m, name) =>
    Object.prototype.hasOwnProperty.call(TIER_FACT_VARS, name) ? String(TIER_FACT_VARS[name]) : m);
}

function TierStrip() {
  const tiers = tl('closer.tiers') || [];
  return (
    <div style={{
      // Owner order (2026-07-22): a TWO-BY-TWO grid (Wanderer + Cartographer on
      // row 1, Surveyor + Founder on row 2, reading order preserved) — not the
      // 3+1 that orphaned Founder on its own row. maxWidth 680 + a 300px column
      // min holds exactly two columns on desktop (2*300+gap fits the cap, three
      // never do) while auto-fit still collapses to a single column on mobile —
      // the existing responsive behaviour, preserved.
      maxWidth: 680, margin: `${SP.xxl * 2}px auto 0`, display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: SP.md,
    }}>
      {tiers.map((tier) => (
        <div key={tier.name} style={{
          background: tier.aiWall ? 'rgba(123,79,207,0.10)' : 'rgba(251,245,230,0.08)',
          // Surveyor is walled in the violet AI channel (ruling #3); Cartographer
          // keeps the gold accent; the rest read as quiet parchment.
          border: tier.aiWall ? '1px solid rgba(123,79,207,0.5)'
            : tier.accent ? '1px solid rgba(224,192,128,0.55)'
            : '1px solid rgba(244,234,208,0.25)',
          borderRadius: R.lg, padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: serif_, fontSize: FS.xxl, fontWeight: 600, color: PARCH }}>{tier.name}</span>
            {/* Per-segment badge colour: the AI-channel band renders violet; a
                'Premium' segment always renders gold; everything else follows
                the tier's accent. Founder reads "By invitation" and is therefore
                deliberately NOT gold: it is not a purchasable premium segment. */}
            <span style={{
              fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {String(tier.badge).split(' · ').map((seg, i) => (
                <span key={seg}>
                  {i > 0 && <span style={{ color: 'rgba(244,234,208,0.7)' }}>{' · '}</span>}
                  <span style={{ color: tier.aiWall ? 'rgba(180,150,235,1)'
                    : (tier.accent || /^premium$/i.test(seg)) ? 'rgba(224,192,128,1)'
                    : 'rgba(244,234,208,0.7)' }}>{seg}</span>
                </span>
              ))}
            </span>
          </div>
          <div style={{ fontFamily: sans, fontSize: FS.md, fontWeight: 600, lineHeight: 1.55, color: 'rgba(251,245,230,0.85)' }}>
            {fillTierBody(tier.body)}
          </div>
          {tier.seatLive && <FounderSeatLine />}
        </div>
      ))}
    </div>
  );
}

// ── The below-fold page ──────────────────────────────────────────────────────
// The below-fold CTAs all route to real product surfaces (Forge → generate,
// See Cartographer / pricing links → pricing, Browse the gallery → gallery), so
// no onSignIn is needed here — the auth CTA lives only in the hero.
export default function LandingBelowFold({ isMobile, onNavigate }) {
  const pad = sectionPad(isMobile);
  const tail = creamTailFade(isMobile);
  // Pre-launch lockout (lib/launchGate.js): See Cartographer is the landing's one
  // purchase CTA, so it renders disabled with the pill until purchases open. The
  // pricing links are information and stay live.
  const purchasesAreOpen = purchasesOpen();
  // The scroll-journey root: the film backdrop measures the `.leg` travel spacers
  // inside this container to drive its playhead (home/useScrollJourney).
  const rootRef = useRef(null);

  return (
    <>
      {/* THE FILM (Slice C2): the fixed travel-and-stop growth film, behind the
          stops (zIndex 0). The stops + legs below sit at zIndex 1 over it. */}
      <WelcomeJourneyBackdrop rootRef={rootRef} />
      <div ref={rootRef} style={{ position: 'relative', zIndex: 1 }}>
        {/* leg 1 · desk → thorp */}
        <div className="sf-welcome-leg" data-welcome-leg="0" aria-hidden="true" />
        {/* ══ 01 · Forge + the sample draft. Translucent cream
            (sf-landing-scene-cream) with no painted scene, so the growth film
            reads through (stop 1 · thorp). ══ */}
      <section
        id="forge"
        aria-labelledby="sf-forge-title"
        className="sf-landing-scene-cream"
        style={{ ...pad, ...tail }}
      >
        <Waypoint pill={tl('forge.waypoint')} />
        <div style={twoColGrid(28)}>
          <div style={panelStyle}>
            <h2 id="sf-forge-title" style={h2Style(isMobile)}>{tl('forge.h2')}</h2>
            <p style={proseStyle}>{tl('forge.body')}</p>
            <p style={{ ...proseStyle, fontStyle: 'italic', fontSize: FS['16'], color: SECOND, marginBottom: SP.xl }}>
              {tl('forge.axiom')}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={() => onNavigate('generate')}>{tl('forge.cta')}</Button>
              <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: SECOND }}>{tl('forge.micro')}</span>
            </div>
            {/* THE ANON SIZE CEILING (§363.1). It sits DIRECTLY under the CTA row
                because that row is where the promise is made: "No account needed"
                is true, and this is the one sentence that says what the free door
                actually opens onto. Always visible — no cap, no state, no hover.
                Same understated disclosure idiom as §03's aiNote (§3.1 tokens
                only, no new design-system motion). */}
            <p style={{ margin: `${SP.sm}px 0 0`, fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: SECOND }}>
              {tl('forge.ceiling')}
            </p>
          </div>
          {/* Owner order (2026-07-22): the Instant Draft widget slot now hosts the
              Cnocby sample-draft card (MiniDossierCard), relocated from §02. The
              drawn-town map sub-block that used to sit below moved into §02, which
              is now "The visual". */}
          <MiniDossierCard onNavigate={onNavigate} />
        </div>
      </section>

        {/* leg 2 · thorp → hamlet */}
        <div className="sf-welcome-leg" data-welcome-leg="1" aria-hidden="true" />
        {/* STRIP-1 (owner ruling, ODQ §725): the "02 · The visual" section was the
            drawn settlement map and NOTHING else — waypoint, headline, body, the
            frozen lens plates and their flip. It is REMOVED whole; leaving the copy
            shell would promise a drawing the product no longer has.
            THE FILM IS UNTOUCHED: six travel legs (data-welcome-leg 0..5) still map
            1:1 onto the six shipped leg videos + seven stop stills under
            public/media/journey-legs/, machinery shared with the loading journey, so
            no leg is dropped. The surviving five stops renumber 01..05 in the copy
            registry (waypoint pills stay contiguous — tests/ui/homeLanding.test.jsx).
            Legs 1 and 2 now run back-to-back: one longer cinematic stretch between
            "01 · Forge" and "02 · The voice". Replacement §02 content is a MARKETING
            decision, deliberately not invented here (charter §11.2 Q9). ══ */}

        {/* leg 3 · hamlet → village */}
        <div className="sf-welcome-leg" data-welcome-leg="2" aria-hidden="true" />
        {/* ══ 03 · The voice — plain parchment (#F7F0E4), hairline borders (stop 3 · village) ══ */}
      <section
        id="voice"
        aria-labelledby="sf-voice-title"
        className="sf-landing-scene-cream"
        // The bottom hairline fades out with the tail (THE FADED TAIL, above).
        style={{ ...pad, ...tail, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
      >
        <Waypoint pill={tl('voice.waypoint')} />
        <div style={{ maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0` }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <h2 id="sf-voice-title" style={{ ...h2Style(isMobile), marginBottom: SP.md }}>{tl('voice.h2')}</h2>
            <p style={{ ...proseStyle, margin: 0 }}>{tl('voice.body')}</p>
            {/* AI disclosure: upfront, deliberately understated (owner). */}
            <p style={{ margin: `${SP.sm}px 0 0`, fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: SECOND }}>
              {tl('voice.aiNote')}
            </p>
          </div>
          <VoiceCards />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.md, marginTop: SP.xl, flexWrap: 'wrap' }}>
            <Button variant="ai" onClick={() => onNavigate('generate')}>{tl('voice.cta')}</Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('pricing')}
              style={{ ...capsLink }}
            >
              {tl('voice.pricingLink')}
            </Button>
          </div>
        </div>
      </section>

        {/* leg 4 · village → town */}
        <div className="sf-welcome-leg" data-welcome-leg="3" aria-hidden="true" />
        {/* ══ 04 · The Realm — painted city scene + CARTOGRAPHER pill (stop 4 · town) ══ */}
      <section
        id="realm"
        aria-labelledby="sf-realm-title"
        className="sf-landing-scene-cream"
        style={{ ...pad, ...tail }}
      >
        <Waypoint pill={tl('realm.waypoint')} goldPill={tl('realm.waypointPill')} />
        <div style={twoColGrid(28)}>
          <div style={panelStyle}>
            <h2 id="sf-realm-title" style={h2Style(isMobile)}>{tl('realm.h2')}</h2>
            <p style={proseStyle}>{tl('realm.body1')}</p>
            <p style={{ ...proseStyle, marginBottom: SP.xl }}>{tl('realm.body2')}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
              <Button variant="primary" disabled={!purchasesAreOpen} onClick={() => onNavigate('pricing')} style={purchasesAreOpen ? undefined : { flexWrap: 'wrap' }}>
                {tl('realm.cta')}
                {!purchasesAreOpen && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
              </Button>
              <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: SECOND }}>{tl('realm.micro')}</span>
            </div>
          </div>
          <WhyTraceCard />
        </div>
        <RealmMapCard />
      </section>

        {/* leg 5 · town → city. With the map artifact folded into §02, this
            travel leg (the film still has six: data-welcome-leg 0..5) leads
            straight into §05 The commons at the city stop. */}
        <div className="sf-welcome-leg" data-welcome-leg="4" aria-hidden="true" />

      {/* ══ 05 · The commons — translucent cream (item 10) ══ */}
      <section id="commons" aria-labelledby="sf-commons-title" className="sf-landing-scene-cream" style={{ ...pad, ...tail }}>
        <Waypoint pill={tl('commons.waypoint')} />
        <div style={{ maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0` }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <h2 id="sf-commons-title" style={{ ...h2Style(isMobile), marginBottom: SP.md }}>{tl('commons.h2')}</h2>
            <p style={{ ...proseStyle, margin: 0 }}>{tl('commons.body')}</p>
          </div>
          <GalleryCards onNavigate={onNavigate} />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: SP.xxl }}>
            <Button variant="primary" onClick={() => onNavigate('gallery')}>{tl('commons.cta')}</Button>
          </div>
        </div>
      </section>

        {/* leg 6 · city → metropolis */}
        <div className="sf-welcome-leg" data-welcome-leg="5" aria-hidden="true" />
        {/* ══ 06 · Set out — dark painted create scene (stop 6 · metropolis) ══ */}
      <section
        id="closer"
        aria-labelledby="sf-closer-title"
        className="sf-landing-scene-dark"
        // The band's own footer strip is gone (owner order 2026-09-16: the app's one
        // global footer now follows this band on every route, pinned on desktop), so
        // item 11's FLUSH BOTTOM (owner 2026-07-21) no longer has a strip to sit flush.
        // A bottom pad keeps "Full pricing" off the footer's edge. Set-out keeps its
        // dark scene (item-10 exempt).
        style={{ padding: isMobile ? `0 ${SP.md}px ${SP.xxl * 2}px` : `0 ${SP.xxl}px ${SP.xxl * 2}px`, '--sf-scene': SCENE('create') }}
      >
        <Waypoint pill={tl('closer.waypoint')} dark />
        <div style={{ maxWidth: 880, margin: `${SP.xxl * 2}px auto 0`, textAlign: 'center' }}>
          <h2 id="sf-closer-title" style={{
            margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: isMobile ? FS['32'] : FS['44'],
            fontWeight: 600, lineHeight: 1.15, color: PARCH,
          }}>{tl('closer.h2')}</h2>
          <p style={{ margin: `0 0 ${SP.xl}px`, fontFamily: serif_, fontStyle: 'italic', fontSize: FS['18'], lineHeight: 1.6, color: 'rgba(251,245,230,0.85)' }}>
            {tl('closer.sub')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="primary" size="lg" onClick={() => onNavigate('generate')}>{tl('closer.cta')}</Button>
          </div>
        </div>
        <TierStrip />
        <div style={{ textAlign: 'center', marginTop: SP.lg }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('pricing')}
            style={{ ...capsLink, color: 'rgba(224,192,128,1)' }}
          >
            {tl('closer.fullPricing')}
          </Button>
        </div>
      </section>
      </div>
    </>
  );
}
