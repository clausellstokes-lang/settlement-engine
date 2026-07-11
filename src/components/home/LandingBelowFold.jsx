/**
 * home/LandingBelowFold.jsx — everything below the hero fold of the scrollable
 * Welcome page: the salt-road journey 01·Forge → 02·Brief → 03·Voice →
 * 04·Realm → 05·Commons → 06·Set out + footer. Lazy-loaded as ONE chunk by
 * HomeLanding.jsx so the hero paints first (LCP).
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

import { useEffect, useState } from 'react';
import { Lock, ChevronDown, ArrowRight, Sparkles, Map as MapIcon } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import { fontFamily, radius } from '../../design/tokens.js';
import {
  INK, SECOND, BODY, MUTED, GOLD, GOLD_DEEP, GOLD_TXT, GOLD_BG,
  PARCH, PARCH_100, BORDER, CARD,
  FS, SP, R, ELEV, sans, serif_,
} from '../theme.js';
import { tl } from '../../copy/landing.js';
import { fetchPublicGallery } from '../../lib/gallery.js';
import {
  MiniDossierCard, VoiceCards, WhyTraceCard, RealmMapCard, SCENE, cardStyle,
} from './LandingArtifacts.jsx';

const MONO = fontFamily.mono;
const CONTENT_MAX = 1080; // spec §4 content column

// Cream parchment on a photographic hero (>0.88 alpha) — the panel that holds
// text on the painted (01/04) sections so prose never sits on the painting (§5).
const PANEL_BG = 'rgba(255,251,245,0.9)';

// Respect the user's motion preference for the in-page smooth scroll (the
// waypoint / "read on" anchors). a11y.css forces scroll-behavior:auto under
// reduced-motion for CSS scrolls; scrollIntoView needs the explicit check.
function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
const scrollToId = (id) => (e) => {
  e.preventDefault();
  const el = typeof document !== 'undefined' && document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
};

// ── Shared style fragments ───────────────────────────────────────────────────
const h2Style = (isMobile) => ({ margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: isMobile ? FS['26'] : FS['34'], fontWeight: 600, lineHeight: 1.15, color: INK });
const proseStyle = { margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: FS.xl, lineHeight: 1.65, color: BODY };
const panelStyle = { background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: R.lg, boxShadow: ELEV[1], padding: '28px 30px' };
const eyebrowGold = { fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD_DEEP };
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

// ── 01 · Forge — instant-draft artifact ──────────────────────────────────────
function InstantDraftCard() {
  const sizes = tl('forge.sizes') || [];
  return (
    <div style={{ ...cardStyle, padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm, marginBottom: SP.md }}>
        <span style={{ ...eyebrowGold, color: GOLD_DEEP }}>{tl('forge.draftTitle')}</span>
        <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: MUTED }}>{tl('forge.draftHint')}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm, marginBottom: SP.lg }}>
        {sizes.map((s) => (
          <span key={s.name} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            border: `1px solid ${s.selected ? GOLD : BORDER}`,
            background: s.selected ? GOLD_BG : CARD,
            borderRadius: radius.button, padding: '8px 15px',
            opacity: s.locked ? 0.55 : 1,
          }}>
            <span style={{ fontFamily: sans, fontSize: FS.md, fontWeight: 800, color: INK }}>{s.name}</span>
            <span style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 700, color: MUTED }}>{s.range}</span>
            {s.locked && <Lock size={11} color={MUTED} aria-hidden="true" />}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: SP.sm, flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
          color: INK, background: GOLD_BG, border: `1px solid ${GOLD}`, borderRadius: R.md, padding: '6px 14px',
        }}>{tl('forge.modeBasic')}</span>
        <span style={{
          fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
          color: MUTED, border: `1px solid ${BORDER}`, borderRadius: R.md, padding: '6px 14px',
        }}>{tl('forge.modeAdvanced')}</span>
        <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: MUTED, marginLeft: 6 }}>{tl('forge.modeDials')}</span>
      </div>
      <div style={{
        borderTop: `1px solid ${BORDER}`, marginTop: SP.md, paddingTop: SP.md,
        fontFamily: sans, fontSize: FS.sm, fontWeight: 700, lineHeight: 1.5, color: BODY,
      }}>
        {tl('forge.ceiling')}
      </div>
    </div>
  );
}

// ── 05 · Commons — up to four REAL published gallery towns (W-L2/3) ─────────
// Fetched once on below-fold mount (anon-permitted public read), ranked by
// top_voted — the strongest ranking signal src/lib/gallery.js actually tracks
// (it has net_votes + view counts; there is NO fork counter). Decorative cards
// fill the remaining slots; a failed or empty fetch renders all four decorative.
// Slot dimensions are identical in every state (150px thumb + one footer row),
// so the swap-in causes zero layout shift.
function GalleryCards({ onNavigate }) {
  const decoratives = tl('commons.cards') || [];
  const [tiles, setTiles] = useState(null); // null = not landed yet → decorative
  useEffect(() => {
    let live = true;
    fetchPublicGallery({ pageSize: 4, sort: 'top_voted' })
      .then((r) => { if (live) setTiles((r?.items || []).slice(0, 4)); })
      .catch(() => { if (live) setTiles([]); });
    return () => { live = false; };
  }, []);

  const real = tiles || [];
  const slots = decoratives.slice(0, 4).map((deco, i) => (real[i] ? { real: real[i], deco } : { deco }));

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
            }}>{tile ? tile.name : deco.name}</span>
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
function TierStrip() {
  const tiers = tl('closer.tiers') || [];
  return (
    <div style={{
      maxWidth: 1000, margin: `${SP.xxl * 2}px auto 0`, display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: SP.md,
    }}>
      {tiers.map((tier) => (
        <div key={tier.name} style={{
          background: 'rgba(251,245,230,0.08)',
          border: tier.accent ? '1px solid rgba(224,192,128,0.55)' : '1px solid rgba(244,234,208,0.25)',
          borderRadius: R.lg, padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: serif_, fontSize: FS.xxl, fontWeight: 600, color: PARCH }}>{tier.name}</span>
            {/* Per-segment badge colour: a 'Premium' segment always renders gold
                (so Founder's "Premium · Lifetime" matches Cartographer's gold
                PREMIUM); everything else follows the tier's accent. */}
            <span style={{
              fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {String(tier.badge).split(' · ').map((seg, i) => (
                <span key={seg}>
                  {i > 0 && <span style={{ color: 'rgba(244,234,208,0.7)' }}>{' · '}</span>}
                  <span style={{ color: (tier.accent || /^premium$/i.test(seg)) ? 'rgba(224,192,128,1)' : 'rgba(244,234,208,0.7)' }}>{seg}</span>
                </span>
              ))}
            </span>
          </div>
          <div style={{ fontFamily: sans, fontSize: FS.md, fontWeight: 600, lineHeight: 1.55, color: 'rgba(251,245,230,0.85)' }}>
            {tier.body}
          </div>
        </div>
      ))}
    </div>
  );
}

function LandingFooter({ onNavigate }) {
  const links = tl('footer.links') || [];
  const route = { Compendium: 'compendium', Pricing: 'pricing', Account: 'account' };
  return (
    <div style={{
      maxWidth: CONTENT_MAX, margin: `${SP.xxl * 2}px auto 0`, borderTop: '1px solid rgba(244,234,208,0.2)',
      paddingTop: SP.xl, display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
    }}>
      <MapIcon size={15} color={GOLD} aria-hidden="true" />
      <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: GOLD }}>{tl('footer.brand')}</span>
      <span style={{ fontFamily: MONO, fontSize: FS.xs, color: 'rgba(244,234,208,0.55)' }}>{tl('footer.tagline')}</span>
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
    </div>
  );
}

// ── The below-fold page ──────────────────────────────────────────────────────
// The below-fold CTAs all route to real product surfaces (Forge → generate,
// See Cartographer / pricing links → pricing, Browse the gallery → gallery), so
// no onSignIn is needed here — the auth CTA lives only in the hero.
export default function LandingBelowFold({ isMobile, onNavigate }) {
  const pad = sectionPad(isMobile);

  return (
    <>
      {/* ══ 01 · Forge — painted thorpe scene ══ */}
      <section
        id="forge"
        aria-labelledby="sf-forge-title"
        className="sf-landing-scene-cream"
        style={{ ...pad, '--sf-scene': SCENE('thorpe') }}
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
          <InstantDraftCard />
        </div>
      </section>

      {/* ══ 02 · The brief — plain parchment ══ */}
      <section id="brief" aria-labelledby="sf-brief-title" style={{ ...pad, background: PARCH }}>
        <Waypoint pill={tl('brief.waypoint')} />
        <div style={twoColGrid(36)}>
          <div>
            <h2 id="sf-brief-title" style={h2Style(isMobile)}>{tl('brief.h2')}</h2>
            <p style={proseStyle}>{tl('brief.body')}</p>
            <p style={{ ...proseStyle, marginBottom: SP.xl }}>{tl('brief.library')}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={() => onNavigate('generate')}>{tl('brief.cta')}</Button>
              <a href="#voice" onClick={scrollToId('voice')} style={{ ...capsLink, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {tl('brief.link')}<ChevronDown size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
          <MiniDossierCard onNavigate={onNavigate} />
        </div>
      </section>

      {/* ══ 03 · The voice — plain parchment (#F7F0E4), hairline borders ══ */}
      <section
        id="voice"
        aria-labelledby="sf-voice-title"
        className="sf-landing-voice"
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

      {/* ══ 04 · The Realm — painted city scene + CARTOGRAPHER pill ══ */}
      <section
        id="realm"
        aria-labelledby="sf-realm-title"
        className="sf-landing-scene-cream"
        style={{ ...pad, '--sf-scene': SCENE('city') }}
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

      {/* ══ 05 · The commons — plain parchment ══ */}
      <section id="commons" aria-labelledby="sf-commons-title" style={{ ...pad, background: PARCH }}>
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

      {/* ══ 06 · Set out — dark painted create scene + footer ══ */}
      <section
        id="closer"
        aria-labelledby="sf-closer-title"
        className="sf-landing-scene-dark"
        style={{ padding: isMobile ? `0 ${SP.md}px ${SP.xxl}px` : `0 ${SP.xxl}px 56px`, '--sf-scene': SCENE('create') }}
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
        <LandingFooter onNavigate={onNavigate} />
      </section>
    </>
  );
}
