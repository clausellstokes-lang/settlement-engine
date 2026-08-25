import { FS, SP, INK, MUTED, BORDER, CARD, CARD_ALT, ELEV, sans } from '../theme.js';
import { useIconsOn } from './IconsContext.js';

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
            style={{
              display: 'inline-flex', alignItems: 'center', gap: SP.xs,
              padding: `${padY}px ${padX}px`,
              borderRadius: 999, border: 'none', cursor: 'pointer',
              background: active ? CARD : 'transparent',
              boxShadow: active ? ELEV[1] : 'none',
              color: active ? INK : MUTED,
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
