import { houseDevice, HOUSE_MOTTO } from '../../design/organic/logo.js';
import { emblem } from '../../design/organic/ornament/compose.js';

/**
 * components/organic/HouseColophon — SEAL AND COUNTERSEAL (owner placement:
 * dossier feet + export covers; the About seal moment).
 *
 * The house device beside the settlement's own seeded medallion from the ornament
 * library — the maker's mark and the subject's mark, closing the document the way
 * a charter closes. The motto is a small TYPOGRAPHIC caption UNDER the device in
 * ceremonial contexts only (`motto` prop) — never inside the mark.
 *
 * Decorative by contract (both marks aria-hidden); the caption is real text.
 * Lazy — rides whatever chunk mounts it (the dossier chunk today).
 *
 * @param {Object} props
 * @param {string} [props.seed]     the settlement name — seeds the counterseal;
 *                                  omitted = the house device alone
 * @param {boolean} [props.motto=true]  ceremonial contexts render the caption
 * @param {'light'|'field'} [props.mode='light']
 * @param {number} [props.size=34]
 */
export default function HouseColophon({ seed, motto = true, mode = 'light', size = 34 }) {
  const deviceSvg = houseDevice({ mode: mode === 'field' ? 'dark' : 'light', size });
  const counterseal = seed ? emblem(seed, { mode, size: Math.round(size * 0.82) }) : null;
  return (
    <div className="oc-colophon">
      <div className="oc-colophon__seals">
        <span className="oc-ornament" aria-hidden="true" dangerouslySetInnerHTML={{ __html: deviceSvg }} />
        {counterseal && (
          <span className="oc-ornament oc-colophon__counterseal" aria-hidden="true" dangerouslySetInnerHTML={{ __html: counterseal }} />
        )}
      </div>
      {motto && <div className="oc-colophon__motto">{HOUSE_MOTTO}</div>}
    </div>
  );
}
