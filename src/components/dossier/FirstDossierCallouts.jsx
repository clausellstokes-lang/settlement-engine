/**
 * FirstDossierCallouts.jsx — the first-dossier teaching band (W-GUIDE-1 keeper,
 * re-registered through the guidance registry).
 *
 * Renders THREE teaching points on a first-time user's first generated dossier,
 * pointing at what the engine already did — worldbuilding by example, not a
 * tutorial-before-the-work. The COPY stays; the trigger + dismissal now route
 * through the registry:
 *   • visibility is the registered whisper `dossier_first_callouts` (surface
 *     'dossier', trigger first_generate + condition tier≠anon & savedCount==0,
 *     newbornOnly) evaluated by isWhisperEligible — so the budget (one whisper
 *     per surface) and the firsts-backfill law (a veteran sees no newborn hints)
 *     are enforced in ONE place.
 *   • dismissal is the unified `sf:guidance:*` key (with read-once migration of
 *     the legacy `sf:dismissed_callouts:*` keys), so the band retires as ONE
 *     whisper rather than three independent flags.
 *
 * Importing the registry here (a lazy dossier chunk) is also what keeps the
 * GUIDANCE_REGISTRY_LAZY_SENTINEL in a lazy chunk (non-vacuity — see the registry
 * header + tests/build/vendorPdfLazy.test.js).
 *
 * Positioning: a stacked banner at the top of the dossier tab content; the
 * content is what teaches (the inline-anchor approach was too brittle).
 */

import { useState } from 'react';
import { FS, swatch } from '../theme.js';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import {
  GUIDANCE_REGISTRY, isWhisperEligible, deriveGuidanceFirst, deriveGuidanceNewborn,
} from '../../domain/display/guidanceRegistry.js';
import { isGuidanceDismissed, markGuidanceDismissed } from '../../lib/guidance.js';

const WHISPER_ID = 'dossier_first_callouts';
const GREEN = swatch['#4A7A3A'];
const SLATE = swatch['#7B4FCF'];
const AMBER = swatch['#D08020'];
const sans = '"Nunito", system-ui, sans-serif';

const CALLOUTS = [
  { key: 'tension', accent: GREEN,  bg: '#E2EEDB' },
  { key: 'supply',  accent: SLATE, bg: '#E4E9EE' },
  { key: 'hook',    accent: AMBER,  bg: '#FBEAD0' },
];

/** The registered whisper for this band (read off the retained registry object,
 *  which keeps the lazy-leaf sentinel in this chunk). */
const WHISPER = GUIDANCE_REGISTRY.whispers.find((w) => w.id === WHISPER_ID);

export default function FirstDossierCallouts() {
  const tier = useStore(s => s.auth.tier);
  const savedCount = useStore(s => s.savedSettlements?.length || 0);
  const settlement = useStore(s => s.settlement);

  // Local dismissal mirror so the band re-renders on click without a store hop.
  const [dismissed, setDismissed] = useState(() => isGuidanceDismissed(WHISPER_ID));

  if (!settlement) return null;
  if (dismissed) return null;

  // The registry is the single arbiter of whether this whisper renders: firsts
  // gate (has generated), the tier/savedCount condition, and the newborn gate.
  // Firsts are DERIVED from store signals (no eager firsts-map growth).
  const eligible = WHISPER && isWhisperEligible(WHISPER, {
    isDismissed: () => false,        // handled by the local mirror above
    firstAvailable: (key) => deriveGuidanceFirst(key, { hasSettlement: !!settlement, savedCount }),
    isNewborn: deriveGuidanceNewborn(savedCount),
    data: { tier, savedCount },
  });
  if (!eligible) return null;

  const handleDismiss = () => {
    markGuidanceDismissed(WHISPER_ID);
    setDismissed(true);
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
      {CALLOUTS.map(({ key, accent, bg }) => {
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
          </div>
        );
      })}
      {/* One band-level dismissal (the whisper retires as a whole). */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          aria-label={t('firstDossierCallouts.dismissLabel')}
        >
          {t('firstDossierCallouts.dismissLabel')} ×
        </Button>
      </div>
    </div>
  );
}
