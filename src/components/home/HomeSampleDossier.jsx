/**
 * HomeSampleDossier.jsx — sample dossier proof card.
 *
 * Renders below HomeHero for anonymous visitors. Three callouts —
 * green/violet/amber — each aimed at a different reader. Pulls the
 * shared SAMPLE_DOSSIER fixture so the entities the callouts reference
 * are stable across renders.
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
import {
  FS, swatch,
  PARCH, INK_DEEP, INK, GOLD, GOLD_B, GOLD_TXT, MUTED, BORDER,
  GREEN, GREEN_DEEP, VIOLET, VIOLET_DEEP, AMBER, AMBER_DEEP,
  sans, serif_,
} from '../theme.js';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { SAMPLE_DOSSIER } from '../../data/sampleDossier.js';

// Callout backgrounds keep their bespoke painted tints (the semantic
// success/warning surfaces read too cool for this proof card), so the
// exact hexes route through swatch[...] for lint compliance. `accent` paints
// the bright left border; `text` is the legible *_DEEP token that carries the
// eyebrow (the fill-strength accent fails AA 4.5:1 as small text on the tint).
const CALLOUTS = [
  { key: 'newDm',         accent: GREEN,  text: GREEN_DEEP,  bg: swatch['#E2EEDB'] },
  { key: 'worldbuilder',  accent: VIOLET, text: VIOLET_DEEP, bg: swatch['#EBE2FA'] },
  { key: 'fridaysSession',accent: AMBER,  text: AMBER_DEEP,  bg: swatch['#FBEAD0'], italic: true },
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
          fontFamily: serif_, fontSize: FS['16'], fontWeight: 600,
        }}>
          {name}
          <span style={{
            marginLeft: 8,
            fontSize: FS.micro,
            color: GOLD_B,
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
        {CALLOUTS.map(({ key, accent, text, bg, italic }) => {
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
                color: text,
              }}>
                {eyebrow}
              </div>
              <div style={{
                marginTop: 4, fontSize: FS['11.5'],
                color: swatch['#3A2F18'], lineHeight: 1.5,
                fontFamily: italic ? serif_ : sans,
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
        <span style={{ fontFamily: serif_, fontStyle: 'normal', color: GOLD_TXT, fontWeight: 600 }}>
          {SAMPLE_DOSSIER.npcs.length} NPCs · {SAMPLE_DOSSIER.plotHooks.length} hooks · {SAMPLE_DOSSIER.factions.length} factions
        </span>
      </footer>
    </section>
  );
}
