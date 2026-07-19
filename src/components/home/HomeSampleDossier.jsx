/**
 * HomeSampleDossier.jsx — P128 / H-2 sample dossier proof card.
 *
 * Renders below HomeHero for anonymous visitors. Three callouts —
 * green/violet/amber — each aimed at a different reader. Pulls the
 * fixture from Pillar G so the entities the callouts reference are
 * stable across renders.
 *
 * Self-gates on auth.tier === 'anon' AND !settlement (don't render once
 * the user has already generated; they have the real thing).
 *
 * Visual mirrors the SampleProofCard mockup from the canvas:
 *   - Dark ink header with the settlement name + meta strip
 *   - Three callout cards with colored left borders (green/violet/amber)
 *   - Calm footer line tying it back to the simulator
 *
 * Fires DOSSIER_PREVIEW_VIEWED once per session on mount so we can
 * measure the proof-card's contribution to conversion.
 */

import { useEffect } from 'react';
import { FS, swatch } from '../theme.js';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { SAMPLE_DOSSIER } from '../../data/sampleDossier.js';

const PARCH = swatch['#FBF5E6'];
const INK_DEEP = swatch['#1B1408'];
const INK = swatch['#2C2210'];
const GOLD = swatch['#C9A24C'];
const MUTED = swatch['#9C8068'];
const BORDER = swatch['#E8D9B0'];
const GREEN = swatch['#4A7A3A'];
const SLATE = swatch['#7B4FCF'];
const AMBER = swatch['#D08020'];
const sans = '"Nunito", system-ui, sans-serif';
const serif = '"Crimson Text", Georgia, serif';

const CALLOUTS = [
  { key: 'newDm',         accent: GREEN,  bg: '#E2EEDB' },
  { key: 'worldbuilder',  accent: SLATE, bg: '#E4E9EE' },
  { key: 'fridaysSession',accent: AMBER,  bg: '#FBEAD0', italic: true },
];

export default function HomeSampleDossier({ compact = false }) {
  const tier = useStore(s => s.auth.tier);
  // F40: this card only reads `settlement` for TRUTHINESS (the self-gate). Now
  // that it mounts on /home for every anon cold visitor, subscribing to the
  // whole object would re-render it on every event apply / pulse writeback. Take
  // the boolean instead — it flips only when a settlement appears.
  const hasSettlement = useStore(s => !!s.settlement);

  // Fire once per session on first eligible render.
  useEffect(() => {
    if (tier !== 'anon' || hasSettlement) return;
    try {
      const key = 'sf:sample_dossier_viewed';
      if (typeof sessionStorage !== 'undefined' &&
          sessionStorage.getItem(key) !== '1') {
        sessionStorage.setItem(key, '1');
        Funnel.track(EVENTS.DOSSIER_PREVIEW_VIEWED, { source: 'home_sample' });
      }
    } catch { /* storage unavailable; non-fatal */ }
  }, [tier, hasSettlement]);

  if (tier !== 'anon') return null;
  if (hasSettlement) return null;

  // Miniature scale ("half-scale dossier plate") for the below-the-fold proof
  // pair (C1r-c2). Presentational only — same fixture, self-gate, and analytics.
  // The plate goes flat (rule-framed, no rounded corners or elevation) and
  // narrows; the header type and paddings step down. This card is static, so
  // there is no hit target to preserve.
  const M = compact
    ? { cardMax: 300, cardMargin: '0 auto 32px', headPad: '9px 12px',
        nameFS: FS['13.5'], bodyPad: 11, bodyGap: 7, calloutPad: 8, footPad: '7px 12px 11px' }
    : { cardMax: 480, cardMargin: '24px auto 56px', headPad: '12px 16px',
        nameFS: FS['16'], bodyPad: 14, bodyGap: 10, calloutPad: 10, footPad: '8px 16px 14px' };

  const name = t('sampleDossier.header.name');
  const meta = t('sampleDossier.header.meta');

  return (
    <section
      aria-label="Sample settlement dossier"
      style={{
        maxWidth: M.cardMax, margin: M.cardMargin,
        background: swatch.white,
        border: `1px solid ${BORDER}`,
        borderRadius: compact ? 0 : 8,
        overflow: 'hidden',
        boxShadow: compact ? 'none' : '0 6px 24px rgba(27,20,8,0.08)',
        fontFamily: sans,
      }}
    >
      <header style={{
        padding: M.headPad,
        background: `linear-gradient(135deg, ${INK_DEEP}, ${INK})`,
        color: GOLD,
      }}>
        <div style={{
          fontFamily: serif, fontSize: M.nameFS, fontWeight: 600,
        }}>
          {name}
          <span style={{
            marginLeft: 8,
            fontSize: FS.micro,
            color: MUTED,
            fontFamily: sans,
            letterSpacing: '0.06em',
          }}>
            {meta}
          </span>
        </div>
      </header>

      <div style={{
        padding: M.bodyPad,
        display: 'flex', flexDirection: 'column', gap: M.bodyGap,
      }}>
        {CALLOUTS.map(({ key, accent, bg, italic }) => {
          const eyebrow = t(`sampleDossier.callouts.${key}.eyebrow`);
          const body = t(`sampleDossier.callouts.${key}.body`);
          return (
            <div
              key={key}
              style={{
                padding: M.calloutPad,
                background: bg,
                border: `1px solid ${accent}40`,
                borderLeft: `3px solid ${accent}`,
                borderRadius: compact ? 0 : 5,
              }}
            >
              <div style={{
                fontSize: FS.micro, fontWeight: 800,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: accent,
              }}>
                {eyebrow}
              </div>
              <div style={{
                marginTop: 4, fontSize: FS['11.5'],
                color: swatch['#3A2F18'], lineHeight: 1.5,
                fontFamily: italic ? serif : sans,
                fontStyle: italic ? 'italic' : 'normal',
              }}>
                {body}
              </div>
            </div>
          );
        })}
      </div>

      <footer style={{
        padding: M.footPad,
        borderTop: `1px dashed ${BORDER}`,
        fontSize: FS.xs, color: MUTED,
        fontStyle: 'italic', textAlign: 'center',
        background: PARCH,
      }}>
        {t('sampleDossier.footer')}{' '}
        <span style={{ fontFamily: serif, fontStyle: 'normal', color: GOLD, fontWeight: 600 }}>
          {SAMPLE_DOSSIER.npcs.length} NPCs · {SAMPLE_DOSSIER.plotHooks.length} hooks · {SAMPLE_DOSSIER.factions.length} factions
        </span>
      </footer>
    </section>
  );
}
