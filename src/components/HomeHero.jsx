/**
 * HomeHero.jsx — Landing hero with two variants.
 *
 * Variants:
 *   1. Anonymous — marketing eyebrow + headline + anti-AI positioning
 *      + size picker (hamlet / village / town — the anon TIER_GATE
 *      ceiling) + Begin CTA. Drives the funnel from cold visitor
 *      through first dossier.
 *   2. Signed-in — "Welcome back" header + instant generation across
 *      all six tiers (thorp → metropolis). No marketing text, no
 *      anti-AI line — the user is converted; they just need to roll.
 *      The bottom of the card surfaces the legacy Quick/Advanced
 *      modes as "Want full control?" affordances.
 *
 * Both variants share:
 *   - SizeButton primitive
 *   - handleBegin() generator + analytics + anon cap accounting
 *   - The parchment gold gradient + ornament
 *
 * Flag:
 *   `homepageAnonGen` (default on). When off, the hero never mounts.
 */

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../store/index.js';
import { t } from '../copy/index.js';
import {
  anonAtCap, anonGensRemaining, DEFAULT_DAILY_CAP,
} from '../lib/anonGenCounter.js';
import { Funnel } from '../lib/analytics.js';
import { flag } from '../lib/flags.js';
import WelcomeBackCard from './home/WelcomeBackCard.jsx';
import AnonTierTeaser from './AnonTierTeaser.jsx';
import Button from './primitives/Button.jsx';
import { GOLD, INK, BODY, BORDER, sans, serif_, SP, R, FS, GOLD_DEEP, swatch } from './theme.js';
import { TIER_FACTS, SINGLE_DOSSIER_PRICE } from '../config/tierFacts.js';
import { TIER_ORDER, POPULATION_RANGES } from '../data/constants.js';

// Sizes per audience. Anonymous gets the Wanderer-tier ceiling
// (TIER_GATE.anon.maxTier === 'town'); signed-in users get the full
// six-tier ladder. Order matters — the picker renders left-to-right.
const ANON_SIZES = ['hamlet', 'village', 'town'];
const ALL_SIZES  = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

// ── THE GAUGE (Deep Craft cluster 1) ─────────────────────────────────────────
// One scale-rule strip replaces the size cards: six stations on a single
// drawn rule, the chosen size ink-filled, sizes outside the viewer's
// entitlement rendered lighter with one memo line beneath. Figures derive
// from data/constants POPULATION_RANGES (already in the eager data chunk —
// zero new closure modules) and set in old-style numerals; the top tier
// renders open-ended (min+), matching the ladder's honest ceiling. Every
// station stays a real <button data-settlement-size> (the e2e flows' locator
// contract); capped stations are disabled, never hidden — the ladder's shape
// is part of the pitch.

/** Old-style population figure for a size token: "8–60", top tier "25,001+". */
function popFigure(size) {
  const r = POPULATION_RANGES[size];
  if (!r) return '';
  const fmt = (n) => n.toLocaleString('en-US');
  const isTop = TIER_ORDER[TIER_ORDER.length - 1] === size;
  return isTop ? `${fmt(r.min)}+` : `${fmt(r.min)}–${fmt(r.max)}`;
}

function GaugeStation({ value, label, active, enabled, onClick }) {
  return (
    <button
      type="button"
      data-settlement-size={value}
      onClick={enabled ? () => onClick(value) : undefined}
      disabled={!enabled}
      aria-pressed={active}
      className="sf-gauge-station oc-m-inkdarken oc-m-press"
      style={{
        flex: '1 1 0', minWidth: 76, padding: `0 ${SP.xs}px ${SP.sm}px`,
        background: 'transparent', border: 'none',
        cursor: enabled ? 'pointer' : 'default',
        textAlign: 'center', fontFamily: sans,
        opacity: enabled ? 1 : 0.45,
      }}
    >
      {/* The station marker sits ON the rule (pulled up over the strip's
          drawn border). Filled = chosen; open = available; faint = capped. */}
      <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" focusable="false"
        style={{ display: 'block', margin: '-7px auto 4px' }}>
        <circle cx="6.5" cy="6.5" r={active ? 5 : 3.5}
          fill={active ? INK : '#FBF5E6'}
          stroke={active ? INK : (enabled ? GOLD_DEEP : BODY)}
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
        maxWidth: 720, margin: `${SP.xl}px auto ${SP.xxl}px`,
        padding: `${SP.xxl}px ${SP.xl}px`,
        background: `linear-gradient(180deg, #FBF5E6 0%, #F4EAD0 100%)`,
        border: `1px solid ${BORDER}`,
        fontFamily: sans,
        textAlign: 'center',
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────
          Two voices: marketing for anon, "Welcome back" for signed-in.
          Anon carries the eyebrow + headline + anti-AI line; signed-in
          gets a short greeting + a "Pick a size, hit Generate" prompt.
      */}
      {isAnon ? (
        flag('heroV2') ? (
          // P117 / H-1 — Two-voice hero rewrite. Anti-AI line as H1
          // (worldbuilder hook); italic deck translates for the new DM
          // ("the pieces explain each other"). Eyebrow + footer-signin +
          // anti-AI quote block all removed — the H1 IS the anti-AI line.
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
          <>
            <div style={{
              fontSize: FS.xs, fontWeight: 700, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: GOLD_DEEP,
              marginBottom: SP.sm,
            }}>
              {t('hero.eyebrow')}
            </div>
            <h1 style={{
              margin: 0, fontFamily: serif_, fontWeight: 600,
              fontSize: FS['32'], color: INK, lineHeight: 1.15,
            }}>
              {t('hero.title')}
            </h1>
            <p style={{
              margin: `${SP.md}px auto 0`, maxWidth: 520,
              fontFamily: serif_, fontStyle: 'italic',
              fontSize: FS.lg, color: BODY, lineHeight: 1.55,
            }}>
              {t('hero.subtitle')}
            </p>
            <p style={{
              margin: `${SP.md}px auto 0`, maxWidth: 480,
              padding: `${SP.xs}px ${SP.md}px`,
              borderLeft: `2px solid ${GOLD}`,
              fontFamily: sans, fontSize: FS.sm, color: swatch['#5A4A2A'],
              lineHeight: 1.5, textAlign: 'left',
              fontStyle: 'italic',
            }}>
              {t('hero.antiAi')}
            </p>
          </>
        )
      ) : (
        <>
          <div style={{
            fontSize: FS.xs, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: GOLD_DEEP,
            marginBottom: SP.sm,
          }}>
            Instant Generation
          </div>
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
            Pick a size. Roll a settlement. Full ladder unlocked.
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
          One scale-rule strip, six stations on a drawn rule. Every
          station renders for every audience (the ladder IS the pitch);
          stations beyond the viewer's entitlement are lighter, disabled,
          and explained by one memo line. The chosen station is
          ink-filled. Focus stays perceivable without pointer state.
      */}
      <style>{`
        .sf-gauge-station:focus-visible {
          outline: 2px solid ${GOLD};
          outline-offset: 2px;
        }
      `}</style>
      <div
        role="group"
        aria-label={t('generate.gauge.label')}
        style={{
          display: 'flex', alignItems: 'flex-start', marginTop: SP.xl,
          borderTop: `1px solid ${GOLD_DEEP}`,
          paddingTop: 0, flexWrap: 'wrap',
        }}
      >
        {TIER_ORDER.map(size => (
          <GaugeStation
            key={size}
            value={size}
            label={t(`generate.sizes.${size}`)}
            active={pickedSize === size}
            enabled={sizes.includes(size)}
            onClick={setPickedSize}
          />
        ))}
      </div>
      {/* The chosen station's hint (anon keeps the card hints' content, now
          as one line for the active choice); the cap memo names why the
          lighter stations wait. */}
      {isAnon && (
        <p style={{
          margin: `${SP.sm}px auto 0`, maxWidth: 480,
          fontFamily: serif_, fontStyle: 'italic',
          fontSize: FS.sm, color: BODY, lineHeight: 1.5,
        }}>
          {t(`generate.sizeHint.${pickedSize}`)}
        </p>
      )}
      {isAnon && (
        <p style={{
          margin: `${SP.xs}px auto 0`, fontSize: FS.xs, color: BODY,
          opacity: 0.8,
        }}>
          {t('generate.gauge.capMemo')}
        </p>
      )}

      {/* ── Primary CTA ──────────────────────────────────────────────── */}
      <div style={{ marginTop: SP.xl }}>
        {isAnon && atCap ? (
          // P113 / X-5 — Reframe the anon cap as an unlock, not a wall.
          // Lead with what signin gets you, not with what you've used up.
          // (The old "$2.99 buy this dossier" side-door was removed — it was a
          // no-op CTA scrolling to an anchor that renders nowhere on home.)
          <>
          <div style={{
            padding: SP.lg,
              background: `linear-gradient(135deg, #FBF5E6, #F4EAD0)`,
              border: `1px solid ${GOLD}`,
              borderRadius: R.lg,
              maxWidth: 460, margin: '0 auto', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: serif_, fontSize: FS['18'], fontWeight: 600,
                color: INK, marginBottom: 6,
              }}>
                You’ve explored <em style={{ color: GOLD_DEEP }}>hamlet, village, town.</em>
              </div>
              <div style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.55 }}>
                <b>Sign in (free)</b> to unlock thorp through metropolis and
                save up to {TIER_FACTS.free.saveLimit} drafts. Keep any dossier&apos;s
                PDF for {SINGLE_DOSSIER_PRICE}, or export freely with Cartographer.
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={onSignIn}
                style={{ marginTop: SP.md }}
              >
                Create free account →
              </Button>
              {/* The "$2.99 buy this dossier" side-door was removed: it scrolled
                  to a [data-buy-this-dossier] anchor that renders nowhere on the
                  home surface (a no-op money CTA). A dead, paid control is the
                  worst trust signal to this audience; the free-account path above
                  is the one honest action here. */}
            </div>
            <AnonTierTeaser onSignIn={onSignIn} />
          </>
        ) : (
          <>
            <Button
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
                : flag('heroV2') && isAnon
                  ? t('hero.v2.ctaTemplate', { tier: t(`generate.sizes.${pickedSize}`).toLowerCase() })
                  : isAnon
                    ? t('hero.cta')
                    : `Forge a ${t(`generate.sizes.${pickedSize}`).toLowerCase()}`}
            </Button>
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
              <button
                type="button"
                onClick={onSignIn}
                style={{
                  background: 'none', border: 'none', padding: `0 ${SP.xs}px`,
                  color: GOLD, fontFamily: 'inherit', fontSize: 'inherit',
                  cursor: 'pointer', textDecoration: 'underline',
                  display: 'inline-flex', alignItems: 'center',
                  minHeight: 44, minWidth: 44,
                }}
              >
                Sign in
              </button>
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
