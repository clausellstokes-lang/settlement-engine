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
import { Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { useStore } from '../store/index.js';
import { t } from '../copy/index.js';
import {
  anonAtCap, anonGensRemaining, incrementAnonGen, DEFAULT_DAILY_CAP,
} from '../lib/anonGenCounter.js';
import { Funnel } from '../lib/analytics.js';
import { flag } from '../lib/flags.js';
import {
  GOLD, INK, _INK_DEEP, BODY, BORDER, _CARD, sans, serif_, SP, R, FS,
} from './theme.js';

// Sizes per audience. Anonymous gets the Wanderer-tier ceiling
// (TIER_GATE.anon.maxTier === 'town'); signed-in users get the full
// six-tier ladder. Order matters — the picker renders left-to-right.
const ANON_SIZES = ['hamlet', 'village', 'town'];
const ALL_SIZES  = ['thorp', 'hamlet', 'village', 'town', 'city', 'capital'];

function SizeButton({ value, label, hint, active, onClick, compact = false }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      aria-pressed={active}
      style={{
        flex: '1 1 0', minWidth: compact ? 92 : 120,
        padding: compact ? `${SP.sm}px ${SP.sm}px` : `${SP.md}px ${SP.md}px`,
        textAlign: 'left',
        background: active ? 'rgba(201,162,76,0.10)' : '#fff',
        border: `1.5px solid ${active ? GOLD : BORDER}`,
        borderRadius: R.lg,
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        fontFamily: sans,
      }}
    >
      <div style={{
        fontFamily: serif_, fontSize: compact ? FS.md : FS.lg, fontWeight: 600, color: INK,
        marginBottom: 2,
      }}>
        {label}
      </div>
      {hint && (
        <div style={{ fontSize: FS.xxs, color: '#4A3B22', lineHeight: 1.35 }}>
          {hint}
        </div>
      )}
    </button>
  );
}

export default function HomeHero({ onSignIn }) {
  const generate = useStore(s => s.generateSettlement);
  const updateConfig = useStore(s => s.updateConfig);
  const setWizardMode = useStore(s => s.setWizardMode);
  const authTier = useStore(s => s.auth.tier);
  const displayName = useStore(s => s.auth.displayName);

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
        incrementAnonGen();
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
    <section
      aria-label={isAnon ? 'Anonymous settlement generator' : 'Welcome back — instant generator'}
      style={{
        maxWidth: 720, margin: `${SP.xl}px auto ${SP.xxl}px`,
        padding: `${SP.xxl}px ${SP.xl}px`,
        background: `linear-gradient(180deg, #FBF5E6 0%, #F4EAD0 100%)`,
        border: `1px solid ${BORDER}`,
        borderRadius: R.xl + 2,
        boxShadow: '0 6px 24px rgba(27,20,8,0.10)',
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
        <>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#8C6F32',
            marginBottom: SP.sm,
          }}>
            {t('hero.eyebrow')}
          </div>
          <h1 style={{
            margin: 0, fontFamily: serif_, fontWeight: 600,
            fontSize: 32, color: INK, lineHeight: 1.15,
          }}>
            {t('hero.title')}
          </h1>
          <p style={{
            margin: `${SP.md}px auto 0`, maxWidth: 520,
            fontFamily: serif_, fontStyle: 'italic',
            fontSize: FS.lg, color: '#4A3B22', lineHeight: 1.55,
          }}>
            {t('hero.subtitle')}
          </p>
          <p style={{
            margin: `${SP.md}px auto 0`, maxWidth: 480,
            padding: `${SP.xs}px ${SP.md}px`,
            borderLeft: `2px solid ${GOLD}`,
            fontFamily: sans, fontSize: FS.sm, color: '#5a4a2a',
            lineHeight: 1.5, textAlign: 'left',
            fontStyle: 'italic',
          }}>
            {t('hero.antiAi')}
          </p>
        </>
      ) : (
        <>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#8C6F32',
            marginBottom: SP.sm,
          }}>
            Instant Generation
          </div>
          <h1 style={{
            margin: 0, fontFamily: serif_, fontWeight: 600,
            fontSize: 28, color: INK, lineHeight: 1.2,
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

      {/* ── Size picker ───────────────────────────────────────────────
          Anon sees 3 buttons (hamlet/village/town); signed-in sees 6
          (thorp through capital). Same primitive, more buttons.
      */}
      <div style={{
        display: 'flex', gap: SP.sm, marginTop: SP.xl,
        justifyContent: 'center', flexWrap: 'wrap',
      }}>
        {sizes.map(size => (
          <SizeButton
            key={size}
            value={size}
            label={t(`generate.sizes.${size}`)}
            hint={isAnon ? t(`generate.sizeHint.${size}`) : null}
            active={pickedSize === size}
            onClick={setPickedSize}
            compact={!isAnon}
          />
        ))}
      </div>

      {/* ── Primary CTA ──────────────────────────────────────────────── */}
      <div style={{ marginTop: SP.xl }}>
        {isAnon && atCap ? (
          // P113 / X-5 — Reframe the anon cap as an unlock, not a wall.
          // Lead with what signin gets you, not with what you've used up.
          // Side-door $2.99 link below catches intermediates who just need
          // Friday's town.
          flag('anonCapUnlock') ? (
            <div style={{
              padding: SP.lg,
              background: `linear-gradient(135deg, #FBF5E6, #F4EAD0)`,
              border: `1px solid ${GOLD}`,
              borderRadius: R.lg,
              maxWidth: 460, margin: '0 auto', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: serif_, fontSize: 18, fontWeight: 600,
                color: INK, marginBottom: 6,
              }}>
                You’ve explored <em style={{ color: '#8C6F32' }}>hamlet, village, town.</em>
              </div>
              <div style={{ fontSize: FS.sm, color: '#4A3B22', lineHeight: 1.55 }}>
                <b>Sign in (free)</b> to unlock thorp through metropolis,
                save unlimited drafts, and export the PDF.
              </div>
              <button
                type="button"
                onClick={onSignIn}
                style={{
                  marginTop: SP.md,
                  padding: `${SP.md}px ${SP.xl}px`,
                  background: GOLD, color: '#fff',
                  border: 'none',
                  borderBottom: `2px solid #8C6F32`,
                  borderRadius: R.sm,
                  fontFamily: sans, fontSize: FS.md, fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Create free account →
              </button>
              <div style={{
                marginTop: SP.md, paddingTop: SP.sm,
                borderTop: `1px dashed ${BORDER}`,
                fontSize: FS.xs, color: '#6B5340', fontStyle: 'italic',
              }}>
                or just take this one —{' '}
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); document.querySelector('[data-buy-this-dossier]')?.scrollIntoView({ behavior: 'smooth' }); }}
                  style={{ color: '#8C6F32', fontWeight: 700, fontStyle: 'normal' }}
                >
                  buy the dossier for $2.99 ↓
                </a>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.sm,
            }}>
              <p style={{
                margin: 0, fontSize: FS.sm, color: '#4A3B22', maxWidth: 380,
              }}>
                You’ve used your {DEFAULT_DAILY_CAP} free generations today.
                Sign in to keep going — accounts unlock all sizes, saves, and exports.
              </p>
              <button
                type="button"
                onClick={onSignIn}
                style={{
                  padding: `${SP.md}px ${SP.xl}px`,
                  background: GOLD, color: '#fff',
                  border: 'none', borderRadius: R.button,
                  fontFamily: sans, fontSize: FS.md, fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <LogIn size={16} /> Sign in to continue
              </button>
            </div>
          )
        ) : (
          <>
            <button
              type="button"
              onClick={handleBegin}
              disabled={generating}
              style={{
                padding: `${SP.md + 2}px ${SP.xxl}px`,
                background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
                color: '#fff', border: 'none',
                borderRadius: R.button,
                fontFamily: serif_, fontWeight: 600,
                fontSize: 20, letterSpacing: '0.02em',
                cursor: generating ? 'wait' : 'pointer',
                opacity: generating ? 0.7 : 1,
                boxShadow: '0 4px 18px rgba(201,162,76,0.45)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'transform 0.1s',
              }}
            >
              <Sparkles size={18} />
              {generating
                ? 'Forging…'
                : isAnon ? t('hero.cta') : `Generate a ${t(`generate.sizes.${pickedSize}`).toLowerCase()}`}
              {!generating && <ArrowRight size={16} />}
            </button>
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
                  background: 'none', border: 'none', padding: 0,
                  color: GOLD, fontFamily: 'inherit', fontSize: 'inherit',
                  cursor: 'pointer', textDecoration: 'underline',
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
  );
}
