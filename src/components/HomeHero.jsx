/**
 * HomeHero.jsx — Landing hero with two variants.
 *
 * Variants:
 *   1. Anonymous — anti-AI headline (GA, heroV2 inlined) + THE GAUGE
 *      (scale-rule size picker, hamlet / village / town — the anon TIER_GATE
 *      ceiling) + Begin CTA. Drives the funnel from cold visitor through first
 *      dossier.
 *   2. Signed-in — "Welcome back" header + instant generation across
 *      all six tiers (thorp → metropolis). No marketing text, no
 *      anti-AI line — the user is converted; they just need to roll.
 *      The Basic/Advanced mode picker below the hero carries "want full control".
 *
 * Both variants share THE GAUGE, handleBegin() (generator + analytics + anon
 * cap accounting), and the flat parchment plate (Deep Craft materials bridge).
 *
 * Base of record: master's remediated composition (LANDING_MAX frame, inlined
 * heroV2, P10 first-click failure surface, registry-routed copy). The gauge and
 * the flat plate are the Deep Craft craft layer that sits on top.
 */

import { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../store/index.js';
import { t } from '../copy/index.js';
import {
  anonAtCap, anonGensRemaining, DEFAULT_DAILY_CAP,
} from '../lib/anonGenCounter.js';
import { Funnel } from '../lib/analytics.js';
import WelcomeBackCard from './home/WelcomeBackCard.jsx';
import AnonTierTeaser from './AnonTierTeaser.jsx';
import Button from './primitives/Button.jsx';
import { ClerkNote } from './generate/ClerkNote.jsx';
import { GOLD, INK, BODY, BORDER, sans, serif_, SP, FS, GOLD_DEEP, GOLD_TXT, LANDING_MAX } from './theme.js';
import { TIER_FACTS, SINGLE_DOSSIER_PRICE } from '../config/tierFacts.js';
import { TIER_ORDER, POPULATION_RANGES } from '../data/constants.js';

// Sizes per audience. Anonymous gets the Wanderer-tier ceiling
// (TIER_GATE.anon.maxTier === 'town'); signed-in users get the full
// six-tier ladder. Order matters — the picker renders left-to-right.
const ANON_SIZES = ['hamlet', 'village', 'town'];
const ALL_SIZES  = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

// ── THE GAUGE (Deep Craft cluster 1) ─────────────────────────────────────────
// One scale-rule strip replaces the size cards: the viewer's entitled stations
// on a single drawn rule, the chosen size ink-filled. Figures derive from
// data/constants POPULATION_RANGES (already in the eager data chunk — zero new
// closure modules) and set in old-style numerals; the top tier renders
// open-ended (min+). Every station stays a real <button data-settlement-size>
// (the e2e flows' locator contract).
//
// OWNER LAW (veto on cluster 1a): the anonymous gauge renders ONLY the anon
// entitlement (hamlet / village / town) — the strip maps `sizes`, NOT the full
// TIER_ORDER, so capped stations are ABSENT for anon (not merely faint). The
// six-station ladder shows solely for signed-in viewers, where every station is
// enabled.

/** Old-style population figure for a size token: "8–60", top tier "25,001+". */
function popFigure(size) {
  const r = POPULATION_RANGES[size];
  if (!r) return '';
  const fmt = (n) => n.toLocaleString('en-US');
  const isTop = TIER_ORDER[TIER_ORDER.length - 1] === size;
  return isTop ? `${fmt(r.min)}+` : `${fmt(r.min)}–${fmt(r.max)}`;
}

function GaugeStation({ value, label, active, onClick, onHover }) {
  return (
    <button
      type="button"
      data-settlement-size={value}
      onClick={() => onClick(value)}
      onMouseEnter={() => onHover?.(value)}
      aria-pressed={active}
      className="sf-gauge-station oc-m-inkdarken oc-m-press"
      style={{
        flex: '1 1 0', minWidth: 76, padding: `0 ${SP.xs}px ${SP.sm}px`,
        background: 'transparent', border: 'none',
        cursor: 'pointer',
        textAlign: 'center', fontFamily: sans,
      }}
    >
      {/* The station marker sits ON the rule (pulled up over the strip's
          drawn border). Filled = chosen; open = available. */}
      <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" focusable="false"
        style={{ display: 'block', margin: '-7px auto 4px' }}>
        <circle cx="6.5" cy="6.5" r={active ? 5 : 3.5}
          fill={active ? INK : '#FBF5E6'}
          stroke={active ? INK : GOLD_DEEP}
          strokeWidth={active ? 1 : 1.5} />
      </svg>
      <div style={{
        fontFamily: serif_, fontSize: FS.md, fontWeight: active ? 700 : 500,
        color: active ? INK : BODY, lineHeight: 1.2,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: FS.xxs, color: BODY, marginTop: 1,
        fontVariantNumeric: 'oldstyle-nums', letterSpacing: '0.01em',
        opacity: active ? 1 : 0.8,
      }}>
        {popFigure(value)}
      </div>
    </button>
  );
}

export default function HomeHero({ onSignIn, onNavigate }) {
  const generate = useStore(s => s.generateSettlement);
  const updateConfig = useStore(s => s.updateConfig);
  const setWizardMode = useStore(s => s.setWizardMode);
  const authTier = useStore(s => s.auth.tier);
  const displayName = useStore(s => s.auth.displayName);
  // P115 / X-9 — the WelcomeBackCard "Open" CTA selects a saved
  // settlement; SettlementsPanel reads selectedSettlementId on mount and
  // opens the matching save in detail view.
  const setSelectedSettlementId = useStore(s => s.setSelectedSettlementId);

  // Variant: signed-in users see instant generation across all sizes;
  // anonymous users see the marketing hero with the funnel framing.
  const isAnon = authTier === 'anon';
  const sizes = isAnon ? ANON_SIZES : ALL_SIZES;
  const defaultSize = isAnon ? 'village' : 'town';

  const [pickedSize, setPickedSize] = useState(defaultSize);
  const [generating, setGenerating] = useState(false);
  // First-click failures must not be silent (P10). The catch below stores a
  // plain-language message; a retry strip renders beneath the CTA pointing back
  // at handleBegin — this is the most fragile point in the funnel.
  const [beginError, setBeginError] = useState(null);
  // THE STAGE BACKDROP (C1r-c3). The six evolution stills (one settlement, six
  // ages — the MANIFEST ruling) render as a faint stage backdrop behind the
  // gauge, keyed to the chosen station. INTERACTION-GATED: `stageLive` is false
  // until the visitor first touches the gauge, so NO still is fetched before the
  // hero's LCP (the funnel's hottest surface pays zero at first paint — the still
  // loads only once the user has engaged). Hovering a station PREFETCHES its
  // still (browser cache warm) so the pick is instant; the set dedupes so a
  // station warms once. All of this rides HomeHero's lazy chunk (zero eager JS).
  const [stageLive, setStageLive] = useState(false);
  const prefetched = useRef(new Set());
  const prefetchStage = (size) => {
    if (typeof window === 'undefined') return;
    if (prefetched.current.has(size)) return;
    prefetched.current.add(size);
    const img = new window.Image();
    img.src = `/evolution/${size}.jpg`;
  };
  const pickStage = (size) => {
    setPickedSize(size);
    setStageLive(true);
  };
  const atCap = anonAtCap();
  const remaining = anonGensRemaining();

  // Tier 8.8 — fire HOMEPAGE_VIEW once per session when the hero
  // mounts. Funnel.homepageView() handles the once-per-session guard
  // via sessionStorage so a re-render doesn't double-count. For the
  // signed-in variant this fires too — it's still a homepage view,
  // it just has a different surface.
  useEffect(() => {
    Funnel.homepageView();
  }, []);

  const handleBegin = async () => {
    if (isAnon && atCap) return;
    if (generating) return;
    setBeginError(null);
    setGenerating(true);
    try {
      // Signed-in users go to 'basic' (renamed from 'quick'); anon
      // also uses 'basic' so the post-hero state shows them the same
      // single-step flow if they navigate back to the wizard.
      setWizardMode('basic');
      updateConfig({ settType: pickedSize });
      generate();
      if (isAnon) {
        // Counting the generation against the daily cap is owned by
        // generateSettlement now (so wizard "Regenerate Draft" and the
        // sample fork count too, not just this first-gen button). Here
        // we only fire the anon-attribution analytics event.
        // Tier 8.8 — anon attribution. Permanent flag once set; drives
        // signup_after_anon and paid_after_anon reporting downstream.
        Funnel.anonGenerationCompleted({ tier: pickedSize });
      }
    } catch (e) {
      console.error('[HomeHero] generate failed:', e);
      setBeginError('Something went wrong forging your settlement. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      {/* P115 / X-9 — Welcome-back card. Self-gates inside; renders
          nothing for anons, first-visit signed-in users, or users
          without a saved settlement. */}
      {!isAnon && (
        <WelcomeBackCard
          onOpen={(s) => {
            if (s?.id && setSelectedSettlementId) setSelectedSettlementId(s.id);
            if (typeof onNavigate === 'function') onNavigate('settlements');
          }}
          onForge={handleBegin}
        />
      )}
    <section
      aria-label={isAnon ? 'Anonymous settlement generator' : 'Welcome back. Instant generator'}
      style={{
        // Deep Craft material: a FLAT parchment plate (hairline rule, no rounded
        // corners or drop shadow) framed at LANDING_MAX (master's composition).
        maxWidth: LANDING_MAX, margin: `${SP.xl}px auto ${SP.xxl}px`,
        padding: `${SP.xxl}px ${SP.xl}px`,
        background: `linear-gradient(180deg, #FBF5E6 0%, #F4EAD0 100%)`,
        border: `1px solid ${BORDER}`,
        fontFamily: sans,
        textAlign: 'center',
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────
          Two voices: marketing for anon, "Welcome back" for signed-in.
      */}
      {isAnon ? (
        // Two-voice hero (GA — heroV2 promoted + inlined). Anti-AI line as H1
        // (worldbuilder hook); italic deck translates for the new DM. The old
        // eyebrow + separate anti-AI quote block were dropped: the H1 IS the anti-AI line.
        <>
          <h1 style={{
            margin: 0, fontFamily: serif_, fontWeight: 600,
            fontSize: FS['32'], color: INK, lineHeight: 1.15,
            letterSpacing: '-0.005em',
          }}>
            {t('hero.v2.headline')}<br />
            <em style={{ color: GOLD_DEEP }}>{t('hero.v2.headlineAccent')}</em>
          </h1>
          <p style={{
            margin: `${SP.md}px auto 0`, maxWidth: 520,
            fontFamily: serif_, fontStyle: 'italic',
            fontSize: FS.lg, color: BODY, lineHeight: 1.55,
          }}>
            {t('hero.v2.deck')}
          </p>
        </>
      ) : (
        // No eyebrow on the signed-in hero. WelcomeBackCard (when it mounts
        // directly above) carries an eyebrow+serif-title pair; a matching
        // eyebrow here would make two stacked cards read as co-equal focal
        // points. Dropping it lets the hero H1 be the unambiguous squint winner.
        <>
          <h1 style={{
            margin: 0, fontFamily: serif_, fontWeight: 600,
            fontSize: FS['28'], color: INK, lineHeight: 1.2,
          }}>
            Welcome back{displayName ? `, ${displayName}` : ''}.
          </h1>
          <p style={{
            margin: `${SP.sm}px auto 0`, maxWidth: 480,
            fontFamily: serif_, fontStyle: 'italic',
            fontSize: FS.md, color: BODY, lineHeight: 1.55,
          }}>
            Pick a size. Roll a settlement. Every size from thorp to metropolis.
          </p>
        </>
      )}

      {/* ── The double rule — the desk header closes, the instrument begins.
          (Rule grammar: double = total/finality; pure CSS, zero JS.) */}
      <div aria-hidden="true" style={{
        maxWidth: 520, margin: `${SP.xl}px auto 0`, height: 5,
        borderTop: `1px solid ${INK}`, borderBottom: `2px solid ${INK}`,
        opacity: 0.55,
      }} />

      {/* ── THE GAUGE ─────────────────────────────────────────────────
          One scale-rule strip. Anon renders ONLY its entitlement
          (hamlet/village/town) per the owner law; signed-in renders the full
          six-station ladder. The chosen station is ink-filled. Focus stays
          perceivable without pointer state.
      */}
      <style>{`
        .sf-gauge-station:focus-visible {
          outline: 2px solid ${GOLD};
          outline-offset: 2px;
        }
        /* THE STAGE BACKDROP (C1r-c3). Faint, sepia-toned, masked top+bottom so
           it reads as a ground the strip sits ON, never a wash competing with the
           ink stations (opacity 0.13 keeps the INK labels + population figures AA
           on the parchment). Flat — no radius, shadow, or rgba. The still fades in
           on first pick; under prefers-reduced-motion it is simply present. */
        .sf-gauge-backdrop {
          position: absolute;
          top: -6px; left: -6px; right: -6px; bottom: -10px;
          width: calc(100% + 12px); height: calc(100% + 16px);
          object-fit: cover; object-position: center 45%;
          pointer-events: none; z-index: 0;
          opacity: 0.13;
          filter: sepia(0.45) saturate(0.8);
          -webkit-mask-image: linear-gradient(180deg, transparent, #000 30%, #000 78%, transparent);
          mask-image: linear-gradient(180deg, transparent, #000 30%, #000 78%, transparent);
          animation: sf-gauge-fade var(--oc-motion-settle) var(--oc-ease-settle) both;
        }
        @keyframes sf-gauge-fade { from { opacity: 0; } to { opacity: 0.13; } }
        @media (prefers-reduced-motion: reduce) {
          .sf-gauge-backdrop { animation: none; opacity: 0.13; }
        }
      `}</style>
      <div style={{ position: 'relative', marginTop: SP.xl }}>
        {/* The tier's evolution still, faint behind the strip. Rendered ONLY
            after first interaction (stageLive) so first paint fetches nothing;
            keyed by pickedSize so each pick re-mounts and fades the new age in
            (static under reduced-motion — see the sf-gauge-backdrop rule below).
            Decorative (empty alt, aria-hidden); the ink stations sit above it. */}
        {stageLive && (
          <img
            key={pickedSize}
            className="sf-gauge-backdrop"
            src={`/evolution/${pickedSize}.jpg`}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        )}
        <div
          role="group"
          aria-label={t('generate.gauge.label')}
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'flex-start',
            borderTop: `1px solid ${GOLD_DEEP}`,
            paddingTop: 0, flexWrap: 'wrap',
          }}
        >
          {sizes.map(size => (
            <GaugeStation
              key={size}
              value={size}
              label={t(`generate.sizes.${size}`)}
              active={pickedSize === size}
              onClick={pickStage}
              onHover={prefetchStage}
            />
          ))}
        </div>
      </div>
      {/* One memo line: the chosen station's hint (the owner law caps visible
          clerk's notes at one — the cap memo retired with the capped stations). */}
      {isAnon && (
        <p style={{
          margin: `${SP.sm}px auto 0`, maxWidth: 480,
          fontFamily: serif_, fontStyle: 'italic',
          fontSize: FS.sm, color: BODY, lineHeight: 1.5,
        }}>
          {t(`generate.sizeHint.${pickedSize}`)}
        </p>
      )}

      {/* ── Primary CTA ──────────────────────────────────────────────── */}
      <div style={{ marginTop: SP.xl }}>
        {isAnon && atCap ? (
          // Reframe the anon cap as an unlock, not a wall. Plain centered block
          // (no inner card — the section is already a bordered parchment surface,
          // so a second identically-filled bordered card was a false boundary).
          // Hierarchy leads with the UNLOCK VALUE and demotes the spent-allowance
          // recap to a quiet subhead. Tier facts stay config-derived
          // (TIER_FACTS/SINGLE_DOSSIER_PRICE) so they can never drift from the cap.
          <>
            <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: FS.xs, color: BODY, marginBottom: SP.sm }}>
                {t('hero.anonCap.spent')}
              </div>
              <div style={{
                fontFamily: serif_, fontSize: FS['18'], fontWeight: 600,
                color: INK, lineHeight: 1.4,
              }}>
                <b>Sign in (free)</b> to unlock thorp through metropolis and
                save up to {TIER_FACTS.free.saveLimit} drafts. Keep any dossier&apos;s
                PDF for {SINGLE_DOSSIER_PRICE}, or export freely with Cartographer.
              </div>
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => onSignIn?.()}
                style={{ marginTop: SP.md }}
              >
                Create free account →
              </Button>
            </div>
            <AnonTierTeaser onSignIn={onSignIn} />
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleBegin}
              disabled={generating}
              busy={generating}
              icon={<Sparkles size={18} />}
              trailingIcon={!generating ? <ArrowRight size={16} /> : null}
            >
              {generating
                ? 'Forging…'
                : isAnon
                  ? t('hero.v2.ctaTemplate', { tier: t(`generate.sizes.${pickedSize}`).toLowerCase() })
                  : `Generate a ${t(`generate.sizes.${pickedSize}`).toLowerCase()}`}
            </Button>
            {/* Plain-language failure surface (P10). The Deep Craft clerk's-note
                idiom (no tinted wash, role=alert passed through); the CTA above IS
                the retry. First-click failures are the most fragile funnel point. */}
            {beginError && (
              <div style={{ marginTop: SP.sm, textAlign: 'left' }}>
                <ClerkNote role="alert" rubric={t('generate.notes.errorRubric')}>
                  {beginError}
                </ClerkNote>
              </div>
            )}
            {isAnon && (
              <p style={{
                margin: `${SP.sm}px auto 0`, fontSize: FS.xs, color: BODY,
                fontStyle: 'italic',
              }}>
                {t('hero.ctaSubline')}
                {' '}
                <span style={{ opacity: 0.7 }}>
                  ({remaining} of {DEFAULT_DAILY_CAP} free today)
                </span>
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Footnote (anon only) ─────────────────────────────────────── */}
      {isAnon && (
        <p style={{
          margin: `${SP.lg}px auto 0`, maxWidth: 480,
          fontSize: FS.xs, color: BODY, lineHeight: 1.5,
        }}>
          {t('hero.note')}
          {onSignIn && (
            <>
              {' '}
              {/* Inline link on the Button primitive (ghost) so HomeHero leaves
                  the raw-button baseline; the gold-text underline + 44px target
                  are preserved via style overrides. */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onSignIn}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: `0 ${SP.xs}px`, minHeight: 44, minWidth: 44,
                  color: GOLD_TXT, fontFamily: 'inherit', fontSize: 'inherit',
                  fontWeight: 'inherit', textDecoration: 'underline',
                }}
              >
                Sign in
              </Button>
              .
            </>
          )}
        </p>
      )}

      {/* Bottom-edge ornament — subtle ink seal */}
      <div aria-hidden="true" style={{
        marginTop: SP.xl,
        height: 1,
        background: `linear-gradient(to right, transparent, ${BORDER}, transparent)`,
      }} />
    </section>
    </>
  );
}
