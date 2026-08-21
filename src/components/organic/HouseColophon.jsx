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
 * H3 THE EXPORT CEREMONY (C15-b): at the WEB dossier foot, the document closes
 * the way a charter closes — the maker's seal impresses (oc-m-impress: weight
 * arrives, sets, is done) beside the subject's medallion breathing one pulse of
 * ink (oc-m-inkpulse). Opt-in via `ceremony`; both are one-shot animations, so
 * the ceremony fires ONCE per mount (the dossier foot's arrival) and no more —
 * no counter or flag needed. Reduced-motion collapses both to instant globally.
 * Off by default → every other colophon (About, non-ceremonial feet) is
 * byte-identical. The PDF counterseal cannot mount these ornament SVG strings —
 * that stays a recorded seam (react-pdf's structured-path refactor is its own
 * future slice); this is web-surface ceremony only.
 *
 * @param {Object} props
 * @param {string} [props.seed]     the settlement name — seeds the counterseal;
 *                                  omitted = the house device alone
 * @param {boolean} [props.motto=true]  ceremonial contexts render the caption
 * @param {'light'|'field'} [props.mode='light']
 * @param {number} [props.size=34]
 * @param {boolean} [props.ceremony=false]  H3 — impress the seal + pulse the
 *                                  medallion once on mount (the web dossier foot)
 */
export default function HouseColophon({ seed, motto = true, mode = 'light', size = 34, ceremony = false }) {
  const deviceSvg = houseDevice({ mode: mode === 'field' ? 'dark' : 'light', size });
  const counterseal = seed ? emblem(seed, { mode, size: Math.round(size * 0.82) }) : null;
  const sealClass = `oc-ornament${ceremony ? ' oc-m-impress' : ''}`;
  const medallionClass = `oc-ornament oc-colophon__counterseal${ceremony ? ' oc-m-inkpulse' : ''}`;
  return (
    <div className="oc-colophon">
      <div className="oc-colophon__seals">
        <span className={sealClass} aria-hidden="true" dangerouslySetInnerHTML={{ __html: deviceSvg }} />
        {counterseal && (
          <span className={medallionClass} aria-hidden="true" dangerouslySetInnerHTML={{ __html: counterseal }} />
        )}
      </div>
      {motto && <div className="oc-colophon__motto">{HOUSE_MOTTO}</div>}
    </div>
  );
}
