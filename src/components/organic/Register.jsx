/**
 * components/organic/Register — the manuscript register grid + marginalia (law §3).
 *
 * A container-query register (organic.css): the main block runs in the primary
 * column, secondary apparatus lives in the wide OUTER margin as a gloss channel.
 * On a narrow pane the container query collapses it to one column and the gloss
 * reflows in-flow beneath its anchor (also the screen-reader order). Boxes are the
 * residue of failed typesetting — this replaces a card with position + alignment.
 */

/** The register frame — wraps a main block and an optional gloss channel. */
export function Register({ children, gloss }) {
  return (
    <div className="oc-register">
      <div className="oc-register__inner">
        <div className="oc-register__body">{children}</div>
        {gloss != null && <aside className="oc-register__gloss">{gloss}</aside>}
      </div>
    </div>
  );
}

/**
 * Marginalia — a single gloss note. Re-anchors from space to point on narrow
 * screens: rendered as a real <details> so it is a tap target (tap-gloss) and its
 * content sits in DOM flow for screen readers; on a wide pane the register places
 * the whole gloss column in the margin. `label` is the visible anchor.
 */
export function Marginalia({ label, children, open = false }) {
  return (
    <details className="oc-margin-note" open={open}>
      <summary className="oc-rubric oc-rubric--instruction">{label}</summary>
      <div>{children}</div>
    </details>
  );
}

export default Register;
