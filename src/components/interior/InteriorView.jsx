/**
 * components/interior/InteriorView — THE KEYED SCALE standalone interior viewer (DOOR 3).
 *
 * A pure, STORE-FREE, mountable-from-a-plain-prop view of a building interior. It renders
 * the deterministic interior model (domain/interior) as a self-contained SVG under any of
 * the four map lenses. It reads NO store — every input arrives as a prop — so the map's
 * enter-from-map hook (hover→enter, the RECORDED SEAM the manager wires at fold) needs
 * only to pass a resolved `institution` + `settlement` + an `onClose` callback; nothing
 * here is coupled to how it is mounted.
 *
 * SCRUB POSTURE: pass `publicSafe` for a gallery/handout mount and the model is built
 * fail-closed (the DM-only concealed chamber is never derived). The default (owner) mount
 * shows the full interior.
 *
 * WIRING RULE (binding on the mount the manager wires — the prop default cannot enforce
 * it): EVERY mount whose audience is not the owner — gallery, shared handout, an
 * owner-side "preview as public" pane — MUST pass `publicSafe`. The default is the OWNER
 * mount, so a forgotten prop builds the DM model, and nothing downstream re-scrubs it:
 * the SVG is drawn AS GIVEN (interiorDraw.js). Gallery data reaching here through
 * toPublicSafe already carries no covert impairment, so it yields no concealed chamber
 * either way; the rule closes the one seam that reads RAW local data.
 *
 * LAZY: imported by NOTHING eager — a consumer React.lazy()-loads it (the town-map surface
 * chunk), so the interior domain fingerprint stays off first paint (interiorLazy pin).
 */

import { useMemo } from 'react';
import { INK, MUTED, BORDER, CARD, PARCH, sans, FS, SP } from '../theme.js';
import Button from '../primitives/Button.jsx';
import {
  buildInteriorModel, buildInteriorSvg, applyInteriorEdits, hasDrawableInterior,
} from '../../domain/interior/index.js';
import { DEFAULT_STYLE_ID } from '../../design/townMapStyles.js';

/** A human label for an interior KIND (the header subtitle). */
const KIND_LABEL = {
  faith: 'Temple', security: 'Barracks', trade: 'Guildhall', craft: 'Workshop',
  learning: 'Library', vice: 'Tavern', civic: 'Hall', generic: 'Interior',
};

/**
 * @param {{
 *   institution: any,
 *   settlement: any,
 *   styleId?: string,
 *   publicSafe?: boolean,
 *   interiorEditsEntry?: any,
 *   size?: number,
 *   onClose?: (() => void) | null,
 * }} props
 */
export default function InteriorView({
  institution, settlement, styleId = DEFAULT_STYLE_ID, publicSafe = false,
  interiorEditsEntry = null, size = 560, onClose = null,
}) {
  const { model, svg } = useMemo(() => {
    if (!institution || !settlement) return { model: null, svg: null };
    const base = buildInteriorModel(settlement, institution, { publicSafe });
    const withEdits = interiorEditsEntry ? applyInteriorEdits(base, interiorEditsEntry) : base;
    if (!hasDrawableInterior(withEdits)) return { model: withEdits, svg: null };
    return { model: withEdits, svg: buildInteriorSvg(withEdits, { style: styleId, width: 1000, height: 1000 }) };
  }, [institution, settlement, styleId, publicSafe, interiorEditsEntry]);

  if (!institution || !settlement) return null;

  const name = (institution && typeof institution.name === 'string' && institution.name) || 'Institution';
  const kindLabel = (model && KIND_LABEL[model.meta?.kind]) || 'Interior';
  const dataUrl = svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : null;

  return (
    <div style={{
      fontFamily: sans, background: CARD, color: INK, border: `1px solid ${BORDER}`,
      padding: SP.md, maxWidth: size + SP.md * 2,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm, marginBottom: SP.sm }}>
        <div>
          <div style={{ fontSize: FS.lg, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: FS.sm, color: MUTED }}>
            {kindLabel}
            {model?.meta?.hasEvidenceRoom ? ' · records exposed' : ''}
          </div>
        </div>
        {onClose ? (
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close interior">
            Back to map
          </Button>
        ) : null}
      </div>

      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`Interior floor plan of ${name}`}
          width={size}
          height={size}
          style={{ display: 'block', width: size, maxWidth: '100%', height: 'auto', background: PARCH }}
        />
      ) : (
        <div style={{ fontSize: FS.md, color: MUTED, padding: SP.lg, textAlign: 'center' }}>
          This building has no keyed interior.
        </div>
      )}
    </div>
  );
}
