/**
 * DeityEffectPreview — the "This god will…" panel on the deity authoring form.
 * It renders the EXACT couplings the engine applies, read live
 * from the shared single source `describeDeityEffects` (src/domain/display/
 * deityEffects.js) — never hand-copied numbers. As the author sets the three
 * axes (alignment · temperament · rank), the preview updates because the draft
 * carries the same `alignmentAxis`/`temperamentAxis`/`rankAxis` field names the
 * engine snapshot uses.
 *
 * A fully-neutral / unranked draft yields [] (the dormancy guarantee), and we
 * say so — teaching that a neutral god does nothing to the substrate. The panel
 * also reminds the author the effects are INERT until the deity is assigned to a
 * settlement (the embed-on-assign bridge).
 */

import { Sun } from 'lucide-react';
import { describeDeityEffects } from '../../domain/display/deityEffects.js';
import { SECOND as SEC, MUTED as MUT, BORDER as BOR, FS, swatch } from '../theme.js';

const DEITY_ACCENT = swatch['#7A5A1A'];

/**
 * @param {{ draft: { alignmentAxis?: string, temperamentAxis?: string, rankAxis?: string } }} props
 */
export default function DeityEffectPreview({ draft }) {
  // SINGLE SOURCE OF TRUTH: the same function the dossier Faith-Effects surface
  // and the engine-equality test read. A draft IS a deity snapshot in shape.
  const effects = describeDeityEffects(draft || {});

  return (
    <div
      data-testid="deity-effect-preview"
      style={{
        marginTop: 8, padding: '10px 12px',
        border: `1px solid ${BOR}`, borderLeft: `3px solid ${DEITY_ACCENT}`,
        borderRadius: 7, background: `${DEITY_ACCENT}0A`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Sun size={13} color={DEITY_ACCENT} />
        <span style={{ fontSize: FS.xxs, fontWeight: 800, color: DEITY_ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          This god will…
        </span>
      </div>
      {effects.length === 0 ? (
        <div style={{ fontSize: FS.xs, color: MUT, fontStyle: 'italic', lineHeight: 1.5 }}>
          A fully-neutral, unranked god does nothing to the living world. Set an
          alignment, temperament, or rank to give it teeth.
        </div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {effects.map((e, i) => (
            <li key={i} style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.5 }}>{e}</li>
          ))}
        </ul>
      )}
      <div style={{ fontSize: FS.micro, color: MUT, fontStyle: 'italic', marginTop: 6, lineHeight: 1.4 }}>
        Dormant until you assign this deity as a settlement&rsquo;s primary god and enable
        Religion dynamics. Only then does it touch the substrate.
      </div>
    </div>
  );
}
