import { FS, SP, BORDER, CARD, CARD_ALT, ELEV, sans } from '../theme.js';
import { useIconsOn } from './IconsContext.js';
import useIsMobile from '../../hooks/useIsMobile.js';

/**
 * primitives/Segmented — a pill toggle for 2-4 mutually exclusive views.
 *
 * The canonical control for in-place lens switches (Raw/Narrated, tab
 * filters, view modes) where tabs would be too heavy and a dropdown hides
 * the choices. The active option lifts onto a card with a subtle shadow so
 * the selected state reads in two channels (fill + weight), not color alone
 * (P7). Style by task, not HTML semantics (P8).
 *
 * @param {Object} props
 * @param {{id:string,label:React.ReactNode,icon?:React.ComponentType<{size?:number}>}[]} props.options
 * @param {string} props.value
 * @param {(id:string)=>void} props.onChange
 * @param {'sm'|'md'} [props.size='md']
 * @param {string} [props.ariaLabel]
 */
export default function Segmented({ options = [], value, onChange, size = 'md', ariaLabel }) {
  const iconsOn = useIconsOn();
  const padY = size === 'sm' ? 5 : 7;
  const padX = size === 'sm' ? SP.md : SP.lg;
  // Mobile-only 44px tap floor — the SAME idiom Button and IconButton already
  // carry (useIsMobile + Math.max against the at-the-table usability floor), and
  // the third instance of the shape, so it is written here in the primitive
  // rather than at one call site. The Gallery's Settlements/Maps/Campaigns
  // switch measured 32px tall on a phone, under every target-size floor.
  // DESKTOP IS UNTOUCHED: minHeight is undefined off-mobile, so all thirteen
  // Segmented call sites render byte-identically at desk width.
  const isMobile = useIsMobile();
  const minHeight = isMobile ? 44 : undefined;
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex', padding: 3, gap: 2,
        background: CARD_ALT, border: `1px solid ${BORDER}`,
        borderRadius: 999,
      }}
    >
      {options.map((o) => {
        const active = value === o.id;
        const Icon = o.icon;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className="oc-m-press"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: SP.xs,
              // undefined off-mobile: React emits no minHeight at all, so the
              // desktop style attribute is byte-identical to before.
              minHeight,
              padding: `${padY}px ${padX}px`,
              borderRadius: 999, border: 'none', cursor: 'pointer',
              background: active ? CARD : 'transparent',
              boxShadow: active ? ELEV[1] : 'none',
              // The oc ink ramp: instrument ink for the lifted active cell, the
              // receding secondary ink for the rest (organic craft §3 ink density).
              color: active ? 'var(--oc-btn-ink)' : 'var(--oc-ink-secondary)',
              fontFamily: sans, fontSize: size === 'sm' ? FS.sm : FS.md,
              fontWeight: active ? 800 : 600,
              whiteSpace: 'nowrap',
            }}
          >
            {iconsOn && Icon && <Icon size={14} aria-hidden="true" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
