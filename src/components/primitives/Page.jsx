import { SP, PAGE_MAX } from '../theme.js';

/**
 * primitives/Page — the shared width frame for a standalone surface.
 *
 * Routes every top-level page through one of the shared layout caps
 * (PAGE_MAX / PROSE_MAX / FORM_MAX) instead of reinventing arbitrary widths,
 * and never goes edge-to-edge (P12). Centers the content and gives it the
 * standard top/side/bottom rhythm. Pass `max` (PROSE_MAX / FORM_MAX from
 * theme.js) for prose or form measures.
 *
 * @param {Object} props
 * @param {number} [props.max=PAGE_MAX]        max content width
 * @param {string|number} [props.pad]          CSS padding override
 * @param {React.CSSProperties} [props.style]
 * @param {React.ReactNode} props.children
 */
export default function Page({ max = PAGE_MAX, pad, children, style, ...rest }) {
  return (
    <div
      style={{
        maxWidth: max,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        // OUR SP legacy scale caps at `xxl` (24); the between-section bottom
        // rhythm their `SP.huge` (48) named is `SP.xxl * 2` here.
        padding: pad != null ? pad : `${SP.xl}px ${SP.lg}px ${SP.xxl * 2}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
