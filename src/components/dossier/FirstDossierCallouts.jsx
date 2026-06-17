/**
 * FirstDossierCallouts.jsx — P130 / O-2 first-dossier teaching callouts.
 *
 * Renders THREE permanent-dismiss callouts on a first-time user's
 * first generated dossier. Each points at what the engine already did
 * and teaches worldbuilding by example — not by tutorial-before-the-work.
 *
 * Self-gates on every condition the critique requires:
 *   - auth.tier !== 'anon'           (anons see the H-2 sample card instead)
 *   - savedSettlements.length === 0  (first-time user)
 *   - !localStorage['sf:dismissed_callouts'] (each callout dismissed independently)
 *
 * Each callout has X-close that sets a permanent localStorage flag.
 * Once all three are dismissed, the component renders nothing forever
 * for this user.
 *
 * Positioning: this is a stacked banner at the top of the dossier
 * tab content (above the live settlement). The originally-mocked
 * inline-anchor approach (absolute positioning over specific cards)
 * was tempting but tied us to dossier internal layout — too brittle.
 * A stacked banner that introduces the three teaching points in order
 * is the right pragmatic UI; the *content* is what teaches.
 */

import { useState } from 'react';
import { FS, swatch, MUTED } from '../theme.js';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';

const DISMISS_KEY_PREFIX = 'sf:dismissed_callouts:';
const GREEN = swatch['#4A7A3A'];
const VIOLET = swatch['#7B4FCF'];
const AMBER = swatch['#D08020'];
const sans = '"Nunito", system-ui, sans-serif';

const CALLOUTS = [
  { key: 'tension', accent: GREEN,  bg: '#E2EEDB' },
  { key: 'supply',  accent: VIOLET, bg: '#EBE2FA' },
  { key: 'hook',    accent: AMBER,  bg: '#FBEAD0' },
];

function isDismissed(key) {
  try {
    return typeof localStorage !== 'undefined' &&
      localStorage.getItem(DISMISS_KEY_PREFIX + key) === '1';
  } catch {
    return false;
  }
}

function markDismissed(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DISMISS_KEY_PREFIX + key, '1');
    }
  } catch {
    /* storage unavailable; accept ephemeral dismiss */
  }
}

export default function FirstDossierCallouts() {
  const tier = useStore(s => s.auth.tier);
  const savedCount = useStore(s => s.savedSettlements?.length || 0);
  const settlement = useStore(s => s.settlement);

  // Track which callouts are dismissed locally so the component
  // re-renders on click without a store roundtrip.
  const [dismissed, setDismissed] = useState(() => {
    const d = {};
    for (const c of CALLOUTS) d[c.key] = isDismissed(c.key);
    return d;
  });

  if (tier === 'anon') return null;
  if (savedCount > 0) return null;  // they've been here before; this is the teach-once moment
  if (!settlement) return null;

  const visible = CALLOUTS.filter(c => !dismissed[c.key]);
  if (visible.length === 0) return null;

  const handleDismiss = (key) => {
    markDismissed(key);
    setDismissed(d => ({ ...d, [key]: true }));
  };

  return (
    <div
      role="region"
      aria-label="First-dossier teaching callouts"
      style={{
        padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: 8,
        fontFamily: sans,
      }}
    >
      {visible.map(({ key, accent, bg }) => {
        const eyebrow = t(`firstDossierCallouts.${key}.eyebrow`);
        const body = t(`firstDossierCallouts.${key}.body`);
        return (
          <div
            key={key}
            style={{
              padding: '10px 12px',
              background: bg,
              border: `1px solid ${accent}40`,
              borderLeft: `3px solid ${accent}`,
              borderRadius: 5,
              display: 'flex', alignItems: 'flex-start', gap: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: FS.micro, fontWeight: 800,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: accent,
              }}>
                {eyebrow}
              </div>
              <div style={{
                marginTop: 4, fontSize: FS.sm,
                color: swatch['#3A2F18'], lineHeight: 1.5,
              }}>
                {body}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDismiss(key)}
              aria-label={t('firstDossierCallouts.dismissLabel')}
              style={{
                background: 'transparent',
                border: 'none',
                color: MUTED,
                cursor: 'pointer',
                fontSize: FS.xs, fontWeight: 700,
                padding: '2px 8px',
                lineHeight: 1,
                fontFamily: sans,
                flexShrink: 0,
              }}
              title={t('firstDossierCallouts.dismissLabel')}
            >
              {t('firstDossierCallouts.dismissLabel')} ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
