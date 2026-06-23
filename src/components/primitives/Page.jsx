import { SP, layout } from '../theme.js';

/**
 * primitives/Page — the shared width frame for a standalone surface.
 *
 * Routes every top-level page through one of the layout caps
 * (layout.page / prose / form) instead of reinventing arbitrary widths,
 * and never goes edge-to-edge (P12). Centers the content and gives it the
 * standard top/side/bottom rhythm. Pass `max` from `layout.*` for prose or
 * form measures.
 *
 * @param {Object} props
 * @param {number} [props.max=layout.page]   max content width
 * @param {string|number} [props.pad]        CSS padding override
 * @param {React.CSSProperties} [props.style]
 * @param {React.ReactNode} props.children
 */
export default function Page({ max = layout.page, pad, children, style, ...rest }) {
  return (
    <div
      style={{
        maxWidth: max,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        padding: pad != null ? pad : `${SP.xl}px ${SP.lg}px ${SP.huge}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
