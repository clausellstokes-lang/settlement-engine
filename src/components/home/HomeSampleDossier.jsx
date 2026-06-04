/**
 * HomeSampleDossier.jsx - P128 / H-2 sample dossier proof card.
 *
 * Renders below HomeHero for anonymous visitors. Three callouts -
 * green/violet/amber - each aimed at a different reader. Pulls the
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

const PARCH = '#FBF5E6';
const INK_DEEP = '#1B1408';
const INK = '#2C2210';
const GOLD = '#C9A24C';
const MUTED = '#9C8068';
const BORDER = '#E8D9B0';
const GREEN = '#4A7A3A';
const VIOLET = '#7B4FCF';
const AMBER = '#D08020';
const sans = '"Nunito", system-ui, sans-serif';
const serif = '"Crimson Text", Georgia, serif';

const CALLOUTS = [
  { key: 'newDm',         accent: GREEN,  bg: '#E2EEDB' },
  { key: 'worldbuilder',  accent: VIOLET, bg: '#EBE2FA' },
  { key: 'fridaysSession',accent: AMBER,  bg: '#FBEAD0', italic: true },
];

export default function HomeSampleDossier() {
  const tier = useStore(s => s.auth.tier);
  const settlement = useStore(s => s.settlement);

  // Fire once per session on first eligible render.
  useEffect(() => {
    if (tier !== 'anon' || settlement) return;
    try {
      const key = 'sf:sample_dossier_viewed';
      if (typeof sessionStorage !== 'undefined' &&
          sessionStorage.getItem(key) !== '1') {
        sessionStorage.setItem(key, '1');
        Funnel.track(EVENTS.DOSSIER_PREVIEW_VIEWED, { source: 'home_sample' });
      }
    } catch { /* storage unavailable; non-fatal */ }
  }, [tier, settlement]);

  if (tier !== 'anon') return null;
  if (settlement) return null;

  const name = t('sampleDossier.header.name');
  const meta = t('sampleDossier.header.meta');

  return (
    <section
      aria-label="Sample settlement dossier"
      style={{
        maxWidth: 480, margin: '24px auto 56px',
        background: swatch.white,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 6px 24px rgba(27,20,8,0.08)',
        fontFamily: sans,
      }}
    >
      <header style={{
        padding: '12px 16px',
        background: `linear-gradient(135deg, ${INK_DEEP}, ${INK})`,
        color: GOLD,
      }}>
        <div style={{
          fontFamily: serif, fontSize: FS['16'], fontWeight: 600,
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
        padding: 14,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {CALLOUTS.map(({ key, accent, bg, italic }) => {
          const eyebrow = t(`sampleDossier.callouts.${key}.eyebrow`);
          const body = t(`sampleDossier.callouts.${key}.body`);
          return (
            <div
              key={key}
              style={{
                padding: 10,
                background: bg,
                border: `1px solid ${accent}40`,
                borderLeft: `3px solid ${accent}`,
                borderRadius: 5,
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
        padding: '8px 16px 14px',
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
