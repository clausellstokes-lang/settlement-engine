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

import { GOLD, GOLD_TXT, INK, BODY, SECOND as SEC, VIOLET, GREEN, PROSE_MAX, SP, serif_, FS, swatch } from '../theme.js';
import { t, tx } from '../../copy/index.js';
import { useReaderAudience } from '../../hooks/useReaderAudience.js';
import Button from '../primitives/Button.jsx';
import { navigate } from '../../hooks/useRoute.js';

const COLS = (col = 340) => ({ columnWidth: `${col}px`, columnGap: SP.xl });
const NO_BREAK = { breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' };
// P11: ride the semantic AI/premium (VIOLET) and success (GREEN) tokens, not raw
// swatch[] hex keys — the values are identical (violet-500 / green-600) so this
// is a zero-pixel aliasing win that keeps these one-offs in the same channel as
// the rest of the app instead of drifting.

// 3-rung value ladder. Size is FREE — it lives on the FREE ("saves") rung, never
// pitched as premium. The lens line tailors the headline to the reader.
function ValueLadder() {
  const audience = useReaderAudience();
  const lensLine = t(`valueLadder.lens.${audience}`) || t('valueLadder.subhead');
  const rungs = ['tries', 'saves', 'simulates'];
  const accentFor = { tries: GREEN, saves: GOLD, simulates: VIOLET };
  // P9: the ladder names each next rung — wire the already-authored CTA so a GM
  // can climb it. Kept ghost/low-emphasis so the three rungs don't become three
  // co-equal primaries (the tab's single high-emphasis action is the upsell CTA
  // at the foot of the tab).
  const ctaTargetFor = { tries: 'generate', saves: 'register', simulates: 'realm' };
  return (
    <section style={{ ...NO_BREAK, marginBottom: SP.xl }}>
      <h2 style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, margin: '0 0 2px' }}>
        {t('valueLadder.heading')}
      </h2>
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '0 0 12px', fontStyle: 'italic' }}>
        {lensLine}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.md, alignItems: 'stretch' }}>
        {rungs.map(key => {
          const accent = accentFor[key];
          // P5: the 3px top accent + the column gap carry the small-multiple
          // grouping. The old `background: CARD` + borderRadius were inert (the
          // shell fill is ALSO CARD, so the radius/fill drew nothing) — dropped,
          // leaving the top rule to do the work and the padding to set the rhythm.
          // P4: the conversion target ("simulates") gets a wider flex-basis so it
          // wins on size as well as hue. P7: the gold eyebrow ("saves") rides
          // GOLD_TXT as text; the eyebrow size is FS.xs to clear the label floor.
          const focal = key === 'simulates';
          const eyebrowColor = key === 'saves' ? GOLD_TXT : accent;
          return (
            <div key={key} style={{ flex: focal ? '1.4 1 240px' : '1 1 200px', minWidth: 0,
              display: 'flex', flexDirection: 'column',
              borderTop: `3px solid ${accent}`, paddingTop: 10, paddingRight: 4 }}>
              <div style={{ fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: eyebrowColor }}>
                {t(`valueLadder.rungs.${key}.eyebrow`)}
              </div>
              <h3 style={{ fontFamily: serif_, fontSize: focal ? FS.lg : FS.md, fontWeight: 600, color: INK, margin: '2px 0 6px' }}>
                {t(`valueLadder.rungs.${key}.tier`)}
              </h3>
              <p style={{ fontSize: FS['12.5'], color: SEC, lineHeight: 1.6, margin: '0 0 10px' }}>
                {t(`valueLadder.rungs.${key}.body`)}
              </p>
              <div style={{ marginTop: 'auto' }}>
                <Button variant="ghost" size="sm" onClick={() => navigate(ctaTargetFor[key])}>
                  {t(`valueLadder.rungs.${key}.cta`)}
                </Button>
              </div>
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
  // P5: flattened to the violet left-accent + spacing. The violet AI/premium
  // layer is the one place a colored accent earns its place, but a full box on
  // top of the shell card is still box-soup — the left rule + ~14px padding +
  // between-block margin carry the grouping.
  return (
    <div style={{ ...NO_BREAK, borderLeft: `3px solid ${VIOLET}`,
      paddingLeft: 14, marginBottom: SP.lg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 600, color: INK }}>{title}</span>
        {/* P7: chip text raised to FS.xs (was 9px, below the persistent-label floor).
            First-contact gloss: the bare tier name means nothing to a new GM, so a
            native title= names it plainly as the paid simulation tier. */}
        <span title="Cartographer is the paid tier that runs the living simulation, $6 a month."
          style={{ fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: VIOLET, background: `${VIOLET}14`, border: `1px solid ${VIOLET}40`,
          borderRadius: 999, padding: '2px 8px' }}>
          {t('aboutLiving.premiumChip')}
        </span>
      </div>
      <p style={{ fontSize: FS.sm, color: INK, lineHeight: 1.6, margin: '0 0 6px' }}>{claim}</p>
      <p style={{ fontSize: FS['12.5'], color: SEC, lineHeight: 1.55, margin: '0 0 6px', fontStyle: 'italic' }}>
        How it stays coherent: {coherence}
      </p>
      {/* P7: this qualifier carries the reversibility promise — raised to FS.xs
          and BODY (was 9px MUT, failing on both contrast and the small-text floor). */}
      <div style={{ fontSize: FS.xs, fontWeight: 700, letterSpacing: '0.04em', color: BODY }}>
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
        borderRadius: 7, marginBottom: SP.lg, maxWidth: PROSE_MAX }}>
        <h2 style={{ fontFamily: serif_, fontSize: FS['18'], fontWeight: 600, color: GOLD, margin: '0 0 8px' }}>
          {t('aboutLiving.thesis')}
        </h2>
        <p style={{ fontSize: FS.sm, color: swatch['#C8B098'], lineHeight: 1.7, margin: 0 }}>
          {t('aboutLiving.thesisSub')}
        </p>
      </div>

      {/* The value ladder — anon tries / free saves + full-size / premium simulates */}
      <ValueLadder />

      {/* The systems — P10: skip the intro + grid entirely when the copy subtree
          is missing/empty, so the lead-in never strands over a blank column. */}
      {systems.length > 0 && (
        <>
          <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: `0 0 ${SP.md}px`, maxWidth: PROSE_MAX }}>
            {t('aboutLiving.intro')}
          </p>
          <div style={COLS()}>
            {systems.map(id => <LivingSystemCard key={id} id={id} />)}
          </div>
        </>
      )}

      {/* P8/P9: the tab sells Cartographer-tier simulation but the premium chips
          dead-end — close the upsell on the single high-emphasis next step. The
          ai variant ties it to the violet premium channel used for the chips. */}
      <div style={{ marginTop: SP.xl }}>
        <Button variant="ai" size="lg" onClick={() => navigate('realm')}>
          See the Realm
        </Button>
      </div>
    </>
  );
}
