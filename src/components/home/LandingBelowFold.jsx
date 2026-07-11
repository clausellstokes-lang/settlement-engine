/**
 * home/LandingBelowFold.jsx — everything below the hero fold of the scrollable
 * Welcome page: the salt-road journey 01·Forge → 02·Brief → 03·Voice →
 * 04·Realm → 05·Commons → 06·Set out + footer. Lazy-loaded as ONE chunk by
 * HomeLanding.jsx so the hero paints first (LCP).
 *
 * Every artifact is a componentized recreation with hardcoded copy from the
 * registry (t/tl('*')) — no store subscription, no reuse of the live
 * dossier/replay components. Spec constraints held: tokens only (§3.1); gold is
 * the only brand accent, violet ONLY in §03 + the app's faith-event chip in the
 * §04 chronicle (§3.2); Lucide icons, no emoji (§3.5); every control routes and
 * the decorative chips (Save to Library / Fork / Advance time / pills) are plain
 * spans, never buttons (§3.8); sections are <section aria-labelledby> + <h2>.
 */

import { Lock, ChevronDown, ArrowRight, Sparkles, Map as MapIcon } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import StateBadge from '../primitives/StateBadge.jsx';
import Badge from '../primitives/Badge.jsx';
import { fontFamily, radius } from '../../design/tokens.js';
import {
  INK, SECOND, BODY, MUTED, GOLD, GOLD_DEEP, GOLD_TXT, GOLD_BG,
  PARCH, PARCH_100, BORDER, CARD, CARD_ALT,
  VIOLET, VIOLET_BG, VIOLET_DEEP, RED, RED_BG, GREEN, GREEN_BG, AMBER, AMBER_BG, AMBER_DEEP,
  FS, SP, R, ELEV, sans, serif_,
} from '../theme.js';
import { tl } from '../../copy/landing.js';

const MONO = fontFamily.mono;
const CONTENT_MAX = 1080; // spec §4 content column
const SCENE = (name) => `url('/backgrounds/landing/${name}-1400.jpg')`;

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

// Status-tint chip palette — all from tokens. `faith` reuses the app's
// faith-event convention (semantic violet), the one §9-sanctioned violet
// outside §03; it is NOT a second violet — it is the same violet token family.
const CHIP = {
  neutral:  { bg: PARCH_100, fg: BODY,        border: BORDER },
  warning:  { bg: AMBER_BG,  fg: AMBER_DEEP,  border: AMBER },
  success:  { bg: GREEN_BG,  fg: GREEN,       border: GREEN },
  danger:   { bg: RED_BG,    fg: RED,         border: RED },
  war:      { bg: RED_BG,    fg: RED,         border: RED },
  faith:    { bg: VIOLET_BG, fg: VIOLET_DEEP, border: VIOLET },
  economic: { bg: PARCH_100, fg: GOLD_TXT,    border: BORDER },
};
const dotColor = { danger: RED, success: GREEN, gold: GOLD };

// ── Shared style fragments ───────────────────────────────────────────────────
const h2Style = (isMobile) => ({ margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: isMobile ? FS['26'] : FS['34'], fontWeight: 600, lineHeight: 1.15, color: INK });
const proseStyle = { margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: FS.xl, lineHeight: 1.65, color: BODY };
const cardStyle = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg, boxShadow: ELEV[2] };
const panelStyle = { background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: R.lg, boxShadow: ELEV[1], padding: '28px 30px' };
const eyebrowGold = { fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD_DEEP };
const monoTag = { fontFamily: MONO, fontSize: FS.xs, color: MUTED };
const capsLink = {
  fontFamily: sans, fontSize: FS.sm, fontWeight: 800, letterSpacing: '0.04em',
  textTransform: 'uppercase', color: GOLD_TXT,
};

const twoColGrid = (gap = 28) => ({ maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap, alignItems: 'center' });

// A small status chip (band label). radius 4 = R.sm.
function Chip({ tone, children, style }) {
  const c = CHIP[tone] || CHIP.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.04em',
      textTransform: 'uppercase', color: c.fg, background: c.bg,
      border: `1px solid ${c.border}`, borderRadius: R.sm, padding: '1px 7px',
      whiteSpace: 'nowrap', ...style,
    }}>
      {children}
    </span>
  );
}

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

// ── 02 · Brief — mini dossier artifact ────────────────────────────────────────
function MiniDossierCard() {
  const tabs = tl('brief.dossier.tabs') || [];
  const hooks = tl('brief.dossier.hooks') || [];
  return (
    <div style={{ ...cardStyle, overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ ...eyebrowGold, color: GOLD_DEEP, letterSpacing: '0.12em', marginBottom: 6 }}>
          {tl('brief.dossier.eyebrow')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.md, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: serif_, fontSize: FS['26'], fontWeight: 600, color: INK }}>
            {tl('brief.dossier.name')}
          </span>
          <span style={{ display: 'inline-flex', gap: SP.sm, alignItems: 'center' }}>
            <StateBadge kind="draft" />
            <Badge tone="gold" size="md">{tl('brief.dossier.population')}</Badge>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 2, marginTop: SP.md, borderBottom: `1px solid ${BORDER}` }}>
          {tabs.map((tab, i) => (
            <span key={tab} style={{
              fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
              color: i === 0 ? INK : MUTED, padding: '8px 12px',
              boxShadow: i === 0 ? `inset 0 -2px 0 ${GOLD}` : 'none',
            }}>{tab}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 22px 20px' }}>
        <p style={{ margin: '0 0 6px', fontFamily: serif_, fontSize: FS.lg, lineHeight: 1.6, color: BODY }}>
          {tl('brief.dossier.prose')}
        </p>
        <p style={{ margin: '0 0 14px', fontFamily: serif_, fontStyle: 'italic', fontSize: FS.lg, lineHeight: 1.6, color: SECOND }}>
          {tl('brief.dossier.proseItalic')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {hooks.map((hook, i) => (
            <div key={i} style={{ background: CARD_ALT, border: `1px solid ${BORDER}`, borderRadius: R.md, padding: '10px 13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: SP.sm, marginBottom: 3 }}>
                <span style={{
                  fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: hook.tone === 'success' ? GREEN : AMBER_DEEP,
                }}>{hook.kind}</span>
                <span style={monoTag}>{hook.tag}</span>
              </div>
              <span style={{ fontFamily: serif_, fontSize: FS['14'], lineHeight: 1.5, color: BODY }}>
                {hook.lead && <strong style={{ color: SECOND }}>{hook.lead}</strong>}
                {hook.rest || hook.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginTop: SP.md, borderTop: `1px solid ${BORDER}`, paddingTop: SP.md }}>
          {/* Decorative — non-interactive span styled like a secondary button (§3.8). */}
          <span style={{
            fontFamily: sans, fontSize: FS.xs, fontWeight: 800, color: SECOND,
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg, padding: '6px 12px',
          }}>{tl('brief.dossier.save')}</span>
          <span style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 700, color: MUTED }}>
            {tl('brief.dossier.saveNote')}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── 03 · Voice — RAW / NARRATED cards ────────────────────────────────────────
function VoiceCards() {
  const raw = tl('voice.raw') || [];
  return (
    <div style={{
      maxWidth: 960, margin: `${SP.xl}px auto 0`, display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18, alignItems: 'stretch',
    }}>
      {/* RAW */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg, boxShadow: ELEV[1], padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.sm, marginBottom: SP.md }}>
          <StateBadge kind="raw" />
          <span style={monoTag}>{tl('voice.rawTag')}</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: FS['12.5'], lineHeight: 1.75, color: BODY }}>
          {raw.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      </div>
      {/* NARRATED — the one violet border on the page (§3.2/§7). */}
      <div style={{ background: CARD, border: '1px solid rgba(123,79,207,0.35)', borderRadius: R.lg, boxShadow: ELEV[1], padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.sm, marginBottom: SP.md }}>
          <StateBadge kind="narrated" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: MONO, fontSize: FS.xs, color: VIOLET_DEEP }}>
            <Sparkles size={11} aria-hidden="true" />{tl('voice.credit')}
          </span>
        </div>
        <p style={{ margin: 0, fontFamily: serif_, fontStyle: 'italic', fontSize: FS['16'], lineHeight: 1.7, color: BODY }}>
          {tl('voice.narrated')}
        </p>
      </div>
    </div>
  );
}

// ── 04 · Realm — why-trace artifact ──────────────────────────────────────────
function WhyTraceCard() {
  const deltas = tl('realm.deltas') || [];
  return (
    <div style={{ ...cardStyle, padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm, marginBottom: SP.md }}>
        <span style={{ ...eyebrowGold, color: GOLD_DEEP }}>{tl('realm.whyTraceTitle')}</span>
        <span style={monoTag}>{tl('realm.whyTraceTag')}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {deltas.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: sans, fontSize: FS['12.5'], fontWeight: 800, color: SECOND }}>{d.axis}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Chip tone="neutral">{d.from}</Chip>
                <ArrowRight size={11} color={MUTED} aria-hidden="true" />
                <Chip tone={d.tone}>{d.to}</Chip>
              </span>
            </div>
            <span style={{ fontFamily: serif_, fontStyle: 'italic', fontSize: FS['14.5'], lineHeight: 1.5, color: BODY }}>
              {d.reason}
            </span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: SP.lg, paddingTop: SP.md, fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: MUTED }}>
        {tl('realm.derivedLine')}
      </div>
    </div>
  );
}

// ── 04 · Realm — world map + chronicle artifact ──────────────────────────────
function RealmMapCard() {
  const pins = tl('realm.pins') || [];
  const chronicle = tl('realm.chronicle') || [];
  const rels = tl('realm.relationships') || [];
  // Pin percentage positions (relative to the image box — spec §7).
  const pinPos = [{ top: '22%', left: '60%' }, { top: '52%', left: '38%' }, { top: '70%', left: '64%' }];
  return (
    <div style={{
      ...cardStyle, maxWidth: CONTENT_MAX, margin: `${SP.xl + SP.md}px auto 0`, overflow: 'hidden',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    }}>
      {/* Map half */}
      <div style={{
        position: 'relative', minHeight: 320,
        backgroundImage: SCENE('world-map'), backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{
          position: 'absolute', top: 14, left: 14, background: 'rgba(255,251,245,0.94)',
          border: `1px solid ${BORDER}`, borderRadius: R.lg, padding: '12px 16px', boxShadow: ELEV[2],
        }}>
          <div style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 2 }}>
            {tl('realm.clockLabel')}
          </div>
          <div style={{ fontFamily: serif_, fontSize: FS['22'], fontWeight: 600, color: INK, marginBottom: SP.sm }}>
            {tl('realm.clockValue')}
          </div>
          {/* Decorative — non-interactive span styled like a small primary button (§3.8). */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
            color: CARD, background: GOLD, border: `1px solid ${GOLD}`, borderRadius: R.lg, padding: '5px 12px',
          }}>{tl('realm.clockCta')}</span>
        </div>
        {pins.map((pin, i) => (
          <div key={pin.name} style={{
            position: 'absolute', top: pinPos[i]?.top, left: pinPos[i]?.left, transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          }}>
            <span style={{
              width: 13, height: 13, borderRadius: radius.button, background: dotColor[pin.dotTone] || GOLD,
              border: `2.5px solid ${CARD}`, boxShadow: ELEV[1],
            }} />
            <span style={{
              fontFamily: sans, fontSize: FS.xs, fontWeight: 800, color: INK,
              background: 'rgba(255,251,245,0.92)', borderRadius: R.sm, padding: '1px 7px',
              boxShadow: ELEV[1], whiteSpace: 'nowrap',
            }}>{pin.name}</span>
            {pin.tag && (
              <span style={{
                fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: PARCH, background: pin.tagTone === 'danger' ? RED : AMBER,
                borderRadius: R.sm, padding: '1px 7px', boxShadow: ELEV[1], whiteSpace: 'nowrap',
              }}>{pin.tag}</span>
            )}
          </div>
        ))}
      </div>
      {/* Chronicle half */}
      <div style={{ padding: '20px 22px', borderLeft: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm, marginBottom: SP.md }}>
          <span style={{ fontFamily: serif_, fontSize: FS['18'], fontWeight: 600, color: INK }}>{tl('realm.chronicleTitle')}</span>
          <span style={monoTag}>{tl('realm.chronicleTag')}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {chronicle.map((entry, i) => (
            <div key={i} style={{ background: CARD_ALT, border: `1px solid ${BORDER}`, borderRadius: R.md, padding: '10px 13px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, marginBottom: 3 }}>
                <Chip tone={entry.tone} style={{ borderColor: 'transparent' }}>{entry.kind}</Chip>
                <span style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 700, color: MUTED }}>{entry.month}</span>
              </div>
              <span style={{ fontFamily: serif_, fontSize: FS['14.5'], lineHeight: 1.5, color: BODY }}>{entry.text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: SP.md, borderTop: `1px solid ${BORDER}`, paddingTop: SP.md }}>
          {rels.map((rel, i) => (
            <Chip key={i} tone={rel.tone} style={{ borderRadius: radius.button, padding: '3px 10px' }}>{rel.text}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 05 · Commons — gallery cards ─────────────────────────────────────────────
function GalleryCards() {
  const cards = tl('commons.cards') || [];
  return (
    <div style={{
      maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0`, display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18,
    }}>
      {cards.map((c) => (
        <div key={c.name} style={{ ...cardStyle, boxShadow: ELEV[1], overflow: 'hidden' }}>
          <div style={{
            position: 'relative', height: 150,
            backgroundImage: SCENE(c.scene), backgroundSize: 'cover', backgroundPosition: c.pos,
          }}>
            <span style={{
              position: 'absolute', top: 10, right: 10, fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
              letterSpacing: '0.05em', textTransform: 'uppercase', color: PARCH_100,
              background: 'rgba(27,20,8,0.6)', borderRadius: R.sm, padding: '2px 8px',
            }}>{c.size}</span>
            <span style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, padding: '26px 14px 10px',
              backgroundImage: 'linear-gradient(rgba(20,14,5,0), rgba(20,14,5,0.72))',
              fontFamily: serif_, fontSize: FS['18'], fontWeight: 600, color: PARCH,
            }}>{c.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, padding: '11px 14px' }}>
            <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: MUTED }}>{c.author}</span>
            <span style={{ marginLeft: 'auto', fontFamily: sans, fontSize: FS.sm, fontWeight: 800, color: SECOND }}>{c.pop}</span>
            {/* Decorative — non-interactive span (§3.8). */}
            <span style={{
              fontFamily: sans, fontSize: FS.xs, fontWeight: 800, color: SECOND,
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg, padding: '5px 12px',
            }}>{tl('commons.fork')}</span>
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, marginBottom: 6 }}>
            <span style={{ fontFamily: serif_, fontSize: FS.xxl, fontWeight: 600, color: PARCH }}>{tier.name}</span>
            <span style={{
              fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: tier.accent ? 'rgba(224,192,128,1)' : 'rgba(244,234,208,0.7)',
            }}>{tier.badge}</span>
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
          <MiniDossierCard />
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
          <GalleryCards />
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
          <div style={{ marginTop: SP.md, fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: 'rgba(251,245,230,0.7)' }}>
            {tl('closer.reassure')}
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
