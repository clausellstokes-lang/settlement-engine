/**
 * howto/LivingWorldTab.jsx — the About page's "The Living World" tab.
 * Extracted from HowToUse.jsx (which sits at its line budget).
 *
 * The bridge from the static dossier to the premium living simulation:
 *   - the landing thesis ("It generates a town in seconds, then it runs the
 *     region for years"),
 *   - the 3-rung value ladder (anon TRIES / free SAVES + full-size generation /
 *     premium SIMULATES), lens-labeled — size is FREE and lives on the FREE rung,
 *   - each premium system as a claim + a "how it stays coherent" line + a premium
 *     chip + the opt-in / off-by-default / reversible qualifier.
 *
 * All copy lives in en.js (valueLadder / aboutLiving). Pure presentational.
 */

import { GOLD, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, CARD, serif_, FS, swatch } from '../theme.js';
import { t, tx } from '../../copy/index.js';
import { useReaderAudience } from '../../hooks/useReaderAudience.js';

const COLS = (col = 340) => ({ columnWidth: `${col}px`, columnGap: '22px' });
const NO_BREAK = { breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' };
const VIOLET = swatch['#7B4FCF'];

// 3-rung value ladder. Size is FREE — it lives on the FREE ("saves") rung, never
// pitched as premium. The lens line tailors the headline to the reader.
function ValueLadder() {
  const audience = useReaderAudience();
  const lensLine = t(`valueLadder.lens.${audience}`) || t('valueLadder.subhead');
  const rungs = ['tries', 'saves', 'simulates'];
  const accentFor = { tries: swatch['#4A7A3A'], saves: GOLD, simulates: VIOLET };
  return (
    <section style={{ ...NO_BREAK, marginBottom: 18 }}>
      <div style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, margin: '0 0 2px' }}>
        {t('valueLadder.heading')}
      </div>
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '0 0 12px', fontStyle: 'italic' }}>
        {lensLine}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {rungs.map(key => {
          const accent = accentFor[key];
          return (
            <div key={key} style={{ flex: '1 1 200px', minWidth: 0, border: `1px solid ${BOR}`,
              borderTop: `3px solid ${accent}`, borderRadius: 7, padding: '12px 14px', background: CARD }}>
              <div style={{ fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: accent }}>
                {t(`valueLadder.rungs.${key}.eyebrow`)}
              </div>
              <div style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 600, color: INK, margin: '2px 0 6px' }}>
                {t(`valueLadder.rungs.${key}.tier`)}
              </div>
              <p style={{ fontSize: FS['12.5'], color: SEC, lineHeight: 1.6, margin: 0 }}>
                {t(`valueLadder.rungs.${key}.body`)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// One premium living-world system: claim + how-it-stays-coherent + premium chip +
// the opt-in / off-by-default / reversible qualifier.
function LivingSystemCard({ id }) {
  const title = t(`aboutLiving.systems.${id}.title`);
  const claim = t(`aboutLiving.systems.${id}.claim`);
  const coherence = t(`aboutLiving.systems.${id}.coherence`);
  return (
    <div style={{ ...NO_BREAK, border: `1px solid ${BOR}`, borderLeft: `3px solid ${VIOLET}`,
      borderRadius: 7, padding: '12px 14px', background: CARD, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 600, color: INK }}>{title}</span>
        <span style={{ fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: VIOLET, background: `${VIOLET}14`, border: `1px solid ${VIOLET}40`,
          borderRadius: 999, padding: '2px 8px' }}>
          {t('aboutLiving.premiumChip')}
        </span>
      </div>
      <p style={{ fontSize: FS.sm, color: INK, lineHeight: 1.6, margin: '0 0 6px' }}>{claim}</p>
      <p style={{ fontSize: FS['12.5'], color: SEC, lineHeight: 1.55, margin: '0 0 6px', fontStyle: 'italic' }}>
        How it stays coherent: {coherence}
      </p>
      <div style={{ fontSize: FS.micro, fontWeight: 700, letterSpacing: '0.04em', color: MUT }}>
        {t('aboutLiving.qualifier')}
      </div>
    </div>
  );
}

export default function LivingWorldTab() {
  const systems = Object.keys(tx('aboutLiving.systems') || {});
  return (
    <>
      {/* Thesis */}
      <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg,#1c1409 0%,#2d1f0e 100%)',
        borderRadius: 7, marginBottom: 16 }}>
        <div style={{ fontFamily: serif_, fontSize: FS['18'], fontWeight: 600, color: GOLD, marginBottom: 8 }}>
          {t('aboutLiving.thesis')}
        </div>
        <p style={{ fontSize: FS.sm, color: swatch['#C8B098'], lineHeight: 1.7, margin: 0 }}>
          {t('aboutLiving.thesisSub')}
        </p>
      </div>

      {/* The value ladder — anon tries / free saves + full-size / premium simulates */}
      <ValueLadder />

      {/* The systems */}
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '0 0 12px' }}>
        {t('aboutLiving.intro')}
      </p>
      <div style={COLS()}>
        {systems.map(id => <LivingSystemCard key={id} id={id} />)}
      </div>
    </>
  );
}
