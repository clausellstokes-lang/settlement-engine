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
import { GOLD, GOLD_TXT, INK, BODY, BORDER, CARD, sans, serif_, SP, R, FS, GOLD_DEEP, DANGER_BORDER, LANDING_MAX, swatch } from './theme.js';

// Sizes per audience. Anonymous gets the Wanderer-tier ceiling
// (TIER_GATE.anon.maxTier === 'town'); signed-in users get the full
// six-tier ladder. Order matters — the picker renders left-to-right.
const ANON_SIZES = ['hamlet', 'village', 'town'];
const ALL_SIZES  = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

// Size toggle on the Button primitive (variant=gold for the selected item,
// matching CharacterPresetCard so "gold-filled = selected" is one learned idiom
// across the Create flow). The active state now carries THREE channels —
// soft-gold fill + gold border + a heavier ink label — not the old color-only
// 10%-wash-vs-border distinction; aria-pressed covers the screen-reader channel.
// The primitive's centered/nowrap defaults are overridden here to keep the
// two-line label+hint left-aligned layout the size cards need.
function SizeButton({ value, label, hint, active, onClick, compact = false }) {
  return (
    <Button
      variant={active ? 'gold' : 'secondary'}
      data-settlement-size={value}
      onClick={() => onClick(value)}
      aria-pressed={active}
      style={{
        flex: '1 1 0', minWidth: compact ? 92 : 120,
        flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center',
        gap: 2, textAlign: 'left', whiteSpace: 'normal', fontWeight: 400,
        padding: compact ? `${SP.sm}px ${SP.sm}px` : `${SP.md}px ${SP.md}px`,
      }}
    >
      <span style={{
        fontFamily: serif_, fontSize: compact ? FS.md : FS.lg,
        fontWeight: active ? 700 : 600, color: INK,
      }}>
        {label}
      </span>
      {hint && (
        <span style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.35, fontFamily: sans }}>
          {hint}
        </span>
      )}
    </Button>
  );
}

export default function HomeHero({ onSignIn, onNavigate }) {
  const generate = useStore(s => s.generateSettlement);
  const updateConfig = useStore(s => s.updateConfig);
  const setWizardMode = useStore(s => s.setWizardMode);
  const setEntryPath = useStore(s => s.setEntryPath);
  const authTier = useStore(s => s.auth.tier);
  const displayName = useStore(s => s.auth.displayName);
  // The WelcomeBackCard "Open" CTA selects a saved
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
  const atCap = anonAtCap();
  const remaining = anonGensRemaining();

  // Fire HOMEPAGE_VIEW once per session when the hero
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
      // Instant path: Back / New Draft return to the Create landing, not the
      // Basic config panel (wizardMode is still set to 'basic' so Regenerate has
      // a config to re-roll, but entryPath is the source of truth for exit).
      setEntryPath('instant');
      setWizardMode('basic');
      updateConfig({ settType: pickedSize });
      generate();
      if (isAnon) {
        // Counting the generation against the daily cap is owned by
        // generateSettlement now (so wizard "Regenerate Draft" and the
        // sample fork count too, not just this first-gen button). Here
        // we only fire the anon-attribution analytics event.
        // Anon attribution. Permanent flag once set; drives
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
      {/* Welcome-back card. Self-gates inside; renders
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
        maxWidth: LANDING_MAX, margin: `${SP.xl}px auto ${SP.xxl}px`,
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
        flag('heroV2') ? (
          // Two-voice hero rewrite. Anti-AI line as H1
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
              fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: GOLD_DEEP,
              marginBottom: SP.xs,
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
        // No eyebrow on the signed-in hero. WelcomeBackCard (when it mounts
        // directly above) carries an eyebrow+serif-title pair; a matching
        // eyebrow here would make two stacked cards read as co-equal focal
        // points. Dropping it lets the hero H1 (FS['28']) be the unambiguous
        // squint-test winner of the stack.
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

      {/* ── Size picker ───────────────────────────────────────────────
          Anon sees 3 buttons (hamlet/village/town); signed-in sees 6
          (thorp through capital). Same primitive, more buttons.
      */}
      <div
        role="group"
        aria-label="Settlement size"
        style={{
          display: 'flex', gap: SP.sm, marginTop: SP.xxl,
          justifyContent: 'center', flexWrap: 'wrap',
        }}
      >
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

      {/* ── Anon size-ceiling upsell bar ──────────────────────────────────
          A quiet gold-left-border strip between the size pills and the forge
          CTA, shown to anonymous visitors who have not yet hit the daily cap.
          It states the anon size ceiling and offers a right-aligned ghost
          Sign in, staying subordinate to the primary forge button below (no
          competing fill). Reuses the GOLD/BORDER `wrap` treatment from
          PlaceInRegionCard. Copy comes from the existing registry. */}
      {isAnon && !atCap && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: SP.md,
            maxWidth: 520, margin: `${SP.lg}px auto 0`,
            padding: `${SP.sm}px ${SP.md}px`,
            border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}`,
            borderRadius: R.lg, background: CARD,
            textAlign: 'left',
          }}
        >
          <span style={{
            flex: 1, fontFamily: sans, fontSize: FS.sm,
            color: BODY, lineHeight: 1.5,
          }}>
            {t('hero.note')}
          </span>
          {onSignIn && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSignIn}
              style={{ flexShrink: 0, color: GOLD_TXT, textDecoration: 'underline', minHeight: 44 }}
            >
              {t('hero.anonCap.signin')}
            </Button>
          )}
        </div>
      )}

      {/* ── Primary CTA ──────────────────────────────────────────────── */}
      <div style={{ marginTop: SP.xxl }}>
        {isAnon && atCap ? (
          // Reframe the anon cap as an unlock, not a wall.
          // Lead with what signin gets you, not with what you've used up.
          // Side-door $2.99 link below catches intermediates who just need
          // Friday's town.
          <>
            {/* No inner card: the hero section is already a bordered parchment
                surface, so a second identically-filled bordered card here was a
                box-on-an-identical-box (false boundary, zero figure/ground gain).
                The unlock state is a plain centered block; whitespace
                (marginTop above) groups it. Hierarchy leads with the UNLOCK
                VALUE (the loudest line) and demotes the spent-allowance recap to
                a quiet subhead, so the squint-test winner is the next step, not
                what's used up. */}
            <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: FS.xs, color: BODY, marginBottom: SP.sm }}>
                {t('hero.anonCap.spent')}
              </div>
              <div style={{
                fontFamily: serif_, fontSize: FS['18'], fontWeight: 600,
                color: INK, lineHeight: 1.4,
              }}>
                {/* The lead phrase is bolded; the registry template carries a
                    {signin} placeholder so the surrounding sentence stays in
                    the copy registry while the bold span renders in JSX. */}
                {(() => {
                  const tpl = t('hero.anonCap.unlockTpl');
                  const signin = t('hero.anonCap.signin');
                  const [before, after] = tpl.split('{signin}');
                  return (
                    <>
                      {before}<b>{signin}</b>{after}
                    </>
                  );
                })()}
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
              {/* The "$2.99 buy this dossier" side-door was removed: it scrolled
                  to a [data-buy-this-dossier] anchor that exists nowhere (a no-op
                  money CTA), and the single-dossier purchase is disabled. A dead
                  revenue control is the worst trust signal to this audience; the
                  free-account path above is the one honest action here. */}
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
                : flag('heroV2') && isAnon
                  ? t('hero.v2.ctaTemplate', { tier: t(`generate.sizes.${pickedSize}`).toLowerCase() })
                  : isAnon
                    ? t('hero.cta')
                    : `Generate a ${t(`generate.sizes.${pickedSize}`).toLowerCase()}`}
            </Button>
            {/* Plain-language failure strip (P10). Sits in the centered column so
                it doesn't disturb the hero layout; the CTA above IS the retry. */}
            {beginError && (
              <p role="alert" style={{
                margin: `${SP.sm}px auto 0`, maxWidth: 460,
                padding: `${SP.xs}px ${SP.md}px`,
                background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`,
                borderRadius: R.md, color: swatch.danger,
                fontSize: FS.sm, lineHeight: 1.5,
              }}>
                {beginError}
              </p>
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
            {/* Signed-in scent to the expert accelerator. The instant CTA above is
                the dominant "roll now" path; this subordinate link routes the
                paying GM into the layered config panel (setWizardMode WITHOUT
                generating) so their depth isn't hidden behind a generate-then-back
                detour. Ghost variant keeps it clearly lower in the hierarchy. */}
            {!isAnon && (
              <p style={{
                margin: `${SP.sm}px auto 0`, fontSize: FS.xs, color: BODY,
              }}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setEntryPath('advanced'); setWizardMode('advanced'); }}
                  style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'underline', minHeight: 44 }}
                >
                  Configure instead →
                </Button>
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
    </section>
    </>
  );
}
