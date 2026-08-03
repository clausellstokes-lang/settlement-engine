/**
 * home/LandingBelowFold.jsx — everything below the hero fold of the scrollable
 * Welcome page: the salt-road journey 01·Forge → 02·Visual → 03·Voice →
 * 04·Realm → 05·Commons → 06·Set out + footer. Lazy-loaded as ONE
 * chunk by HomeLanding.jsx so the hero paints first (LCP).
 *
 * The §02/§03/§04 artifacts render FROZEN REAL ENGINE OUTPUT (owner amendment
 * W-L2/1) and live in ./LandingArtifacts.jsx with their fixture; §05 renders up
 * to four REAL published gallery settlements (W-L2/3, fetched on mount, ranked
 * by top_voted — the strongest signal gallery.js tracks), with the decorative
 * cards as slot-fill and full fallback. Spec constraints held: tokens only
 * (§3.1); gold the only brand accent, violet ONLY in §03 + the faith chip in
 * the §04 chronicle (§3.2); Lucide icons, no emoji (§3.5); every control routes
 * and decorative chips are plain spans (§3.8); <section aria-labelledby> + h2.
 */

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ArrowRight, Sparkles, Map as MapIcon } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import WelcomeJourneyBackdrop from './WelcomeJourneyBackdrop.jsx';
import { fontFamily, radius } from '../../design/tokens.js';
import {
  INK, SECOND, BODY, MUTED, GOLD, GOLD_DEEP, GOLD_TXT, GOLD_BG,
  PARCH, PARCH_100, BORDER, CARD,
  FS, SP, R, ELEV, sans, serif_,
} from '../theme.js';
import { tl } from '../../copy/landing.js';
// THE MIGRATED LEGAL/COMMERCIAL ROW (LD-3). App.jsx suppresses the global
// footer on this route, so the band carries the one shared row instead — an
// EAGER module imported DOWNWARD from the lazy landing chunk (importing it the
// other way would re-parent this closure into the entry chunk).
import LegalRibbonRow from '../footer/LegalRibbonRow.jsx';
// Config-sourced tier facts (brief §4 / ruling #6): the closer tier strip
// interpolates these instead of hand-typing the numbers, so a catalog change
// (anon size ceiling, free save cap) can never drift from what the strip shows.
// tierFacts imports only config/pricing.js and rides this lazy below-fold chunk,
// so it adds nothing to the first-paint closure.
import { ANON_MAX_SIZE_LABEL, FREE_SAVE_LIMIT } from '../../config/tierFacts.js';
import { fetchPublicGallery } from '../../lib/gallery.js';
import {
  MiniDossierCard, VoiceCards, WhyTraceCard, RealmMapCard, MapPlateCard, SCENE, cardStyle,
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

const twoColGrid = (gap = 28) => ({ maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap, alignItems: 'center' });

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
const sectionPad = (isMobile) => ({ padding: isMobile ? `0 ${SP.md}px ${SP.xxl * 2}px` : `0 ${SP.xxl}px 84px` });

// ── 01 · Forge — the Instant Draft artifact (InstantDraftCard) was removed per
// owner order (2026-07-22): the Cnocby sample-draft card (MiniDossierCard) now
// fills that slot in §01. The widget was landing-only (never used by the Create
// page's own size picker), so its code is deleted as dead landing chrome. Its
// forge.draft* / forge.sizes / forge.mode* / forge.ceiling copy keys are now
// unreferenced on the landing (left in place as inert strings, not retyped).

// ── 06 · Commons — SIX slots, fed dynamically from the community gallery (W1) ─
// Fetched once on below-fold mount (anon-permitted public read), ranked by
// top_voted — the strongest ranking signal src/lib/gallery.js actually tracks
// (it has net_votes + view counts; there is NO fork counter). Real published
// towns fill the slots first; any slot without a real town falls back to a
// decorative card LABELED ' (placeholder)'. When six real towns exist, all six
// slots are real and no placeholder shows. A failed or empty fetch renders six
// placeholders (the empty-gallery dev state). Slot dimensions are identical in
// every state (150px thumb + one footer row), so the swap-in causes zero layout shift.
const COMMONS_SLOTS = 6; // owner order 2026-07-21, ledger 4f71743a
function GalleryCards({ onNavigate }) {
  const decoratives = tl('commons.cards') || [];
  const [tiles, setTiles] = useState(null); // null = not landed yet → decorative
  useEffect(() => {
    let live = true;
    fetchPublicGallery({ pageSize: COMMONS_SLOTS, sort: 'top_voted' })
      .then((r) => { if (live) setTiles((r?.items || []).slice(0, COMMONS_SLOTS)); })
      .catch(() => { if (live) setTiles([]); });
    return () => { live = false; };
  }, []);

  const real = tiles || [];
  const slots = decoratives.slice(0, COMMONS_SLOTS).map((deco, i) => (real[i] ? { real: real[i], deco } : { deco }));

  return (
    <div style={{
      maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0`, display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18,
    }}>
      {slots.map(({ real: tile, deco }) => (
        <div key={tile?.slug || deco.name} style={{ ...cardStyle, boxShadow: ELEV[1], overflow: 'hidden' }}>
          <div style={{
            position: 'relative', height: 150,
            // A real tile's own gallery image wins; otherwise the slot keeps its
            // painted scene (same box, zero shift).
            backgroundImage: tile?.imageUrl ? `url('${tile.imageUrl}')` : SCENE(deco.scene),
            backgroundSize: 'cover', backgroundPosition: tile?.imageUrl ? 'center' : deco.pos,
          }}>
            <span style={{
              position: 'absolute', top: 10, right: 10, fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
              letterSpacing: '0.05em', textTransform: 'uppercase', color: PARCH_100,
              background: 'rgba(27,20,8,0.6)', borderRadius: R.sm, padding: '2px 8px',
            }}>{tile ? tile.tier : deco.size}</span>
            <span style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, padding: '26px 14px 10px',
              backgroundImage: 'linear-gradient(rgba(20,14,5,0), rgba(20,14,5,0.72))',
              fontFamily: serif_, fontSize: FS['18'], fontWeight: 600, color: PARCH,
            }}>{tile ? tile.name : `${deco.name} (placeholder)`}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, padding: tile ? '7px 14px' : '11px 14px', minHeight: 52 }}>
            {tile ? (
              <>
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
              </>
            ) : (
              <>
                <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: MUTED }}>{deco.author}</span>
                <span style={{ marginLeft: 'auto', fontFamily: sans, fontSize: FS.sm, fontWeight: 800, color: SECOND }}>{deco.pop}</span>
                {/* Decorative — non-interactive span (§3.8). */}
                <span style={{
                  fontFamily: sans, fontSize: FS.xs, fontWeight: 800, color: SECOND,
                  background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg, padding: '5px 12px',
                }}>{tl('commons.fork')}</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 06 · Set out — tier strip + footer ───────────────────────────────────────
// Live founder-seat counter (owner: "link it to the amount of seats available").
// Lazy-imports the seat module so supabase never rides the eager chunk; the RPC
// read is anon-safe and 5-minute cached. Falls back to the static cap line when
// the count is unavailable (null), so a backend hiccup never breaks the card.
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
      {typeof remaining === 'number' ? `${remaining}/${cap} seats left` : `Limited to ${cap} seats`}
    </div>
  );
}

// Interpolate the config-sourced tier facts into a closer-strip body. The copy
// carries {anonSize}/{freeSaves} tokens (copy/landing.js); the numbers come from
// config/tierFacts.js so the strip can never restate a ceiling the catalog didn't
// (brief §4 / ruling #6 — config-sourced facts, zero hand-typed numbers).
const TIER_FACT_VARS = { anonSize: ANON_MAX_SIZE_LABEL, freeSaves: FREE_SAVE_LIMIT };
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
                'Premium' segment always renders gold (so Founder's "Premium ·
                Lifetime" matches Cartographer's gold PREMIUM); everything else
                follows the tier's accent. */}
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

function LandingFooter({ onNavigate, isMobile }) {
  const links = tl('footer.links') || [];
  const route = { Compendium: 'compendium', Pricing: 'pricing', Account: 'account' };
  return (
    <div style={{
      maxWidth: CONTENT_MAX, margin: `${SP.xxl * 2}px auto 0`, borderTop: '1px solid rgba(244,234,208,0.2)',
      paddingTop: SP.xl, display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
    }}>
      <MapIcon size={15} color={GOLD} aria-hidden="true" />
      <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: GOLD }}>{tl('footer.brand')}</span>
      <span style={{ marginLeft: 'auto', display: 'flex', gap: SP.lg, flexWrap: 'wrap' }}>
        {links.map((label) => (
          <Button
            key={label}
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(route[label])}
            style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 700, color: 'rgba(244,234,208,0.72)', padding: 0, minHeight: 24 }}
          >
            {label}
          </Button>
        ))}
      </span>
      {/* The page ends on the painting (LD-3): Pricing · Feedback & support ·
          Terms · Privacy · © · "Simulated, not AI-generated." MIGRATE, never
          delete — the global strip is suppressed on this route, and /pricing has
          no `nav:` block, so this row is the landing's only path to it. */}
      <LegalRibbonRow
        isMobile={isMobile}
        onNavigate={onNavigate}
        clearMobileNav
        style={{ width: '100%', marginTop: SP.xl, color: 'rgba(244,234,208,0.72)' }}
      />
    </div>
  );
}

// ── The below-fold page ──────────────────────────────────────────────────────
// The below-fold CTAs all route to real product surfaces (Forge → generate,
// See Cartographer / pricing links → pricing, Browse the gallery → gallery), so
// no onSignIn is needed here — the auth CTA lives only in the hero.
export default function LandingBelowFold({ isMobile, onNavigate }) {
  const pad = sectionPad(isMobile);
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
        style={{ ...pad }}
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
        {/* ══ 02 · The visual — the drawn town. The old standalone map waypoint
            is retired; its v2 map artifact lives here. Section id stays "brief"
            for anchor stability. Plain parchment (stop 2 · hamlet). ══ */}
      <section id="brief" aria-labelledby="sf-visual-title" className="sf-landing-scene-cream" style={{ ...pad }}>
        <Waypoint pill={tl('brief.waypoint')} />
        <div style={{ maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0` }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <h2 id="sf-visual-title" style={{ ...h2Style(isMobile), marginBottom: SP.md }}>{tl('map.h2')}</h2>
            <p style={{ ...proseStyle, margin: 0 }}>{tl('map.body')}</p>
          </div>
          <MapPlateCard />
          <p style={{ ...proseStyle, maxWidth: 640, margin: `${SP.xl}px auto 0`, textAlign: 'center', fontStyle: 'italic', color: SECOND }}>
            {tl('map.tease')}
          </p>
        </div>
      </section>

        {/* leg 3 · hamlet → village */}
        <div className="sf-welcome-leg" data-welcome-leg="2" aria-hidden="true" />
        {/* ══ 03 · The voice — plain parchment (#F7F0E4), hairline borders (stop 3 · village) ══ */}
      <section
        id="voice"
        aria-labelledby="sf-voice-title"
        className="sf-landing-scene-cream"
        style={{ ...pad, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
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
            <Button variant="ai" onClick={() => onNavigate('generate')} icon={<Sparkles size={14} />}>{tl('voice.cta')}</Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('pricing')}
              style={{ ...capsLink }}
              trailingIcon={<ChevronDown size={14} />}
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
        style={{ ...pad }}
      >
        <Waypoint pill={tl('realm.waypoint')} goldPill={tl('realm.waypointPill')} />
        <div style={twoColGrid(28)}>
          <div style={panelStyle}>
            <h2 id="sf-realm-title" style={h2Style(isMobile)}>{tl('realm.h2')}</h2>
            <p style={proseStyle}>{tl('realm.body1')}</p>
            <p style={{ ...proseStyle, marginBottom: SP.xl }}>{tl('realm.body2')}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={() => onNavigate('pricing')}>{tl('realm.cta')}</Button>
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
      <section id="commons" aria-labelledby="sf-commons-title" className="sf-landing-scene-cream" style={{ ...pad }}>
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
        {/* ══ 06 · Set out — dark painted create scene + footer (stop 6 · metropolis) ══ */}
      <section
        id="closer"
        aria-labelledby="sf-closer-title"
        className="sf-landing-scene-dark"
        // Item 11 (owner 2026-07-21): FLUSH BOTTOM. Zero bottom padding so the set-out
        // card's footer sits flush against the page end / the global app footer, with no
        // dead trailing scroll region. Set-out keeps its dark scene (item-10 exempt).
        style={{ padding: isMobile ? `0 ${SP.md}px 0` : `0 ${SP.xxl}px 0`, '--sf-scene': SCENE('create') }}
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
            trailingIcon={<ArrowRight size={14} />}
          >
            {tl('closer.fullPricing')}
          </Button>
        </div>
        <LandingFooter onNavigate={onNavigate} isMobile={isMobile} />
      </section>
      </div>
    </>
  );
}
