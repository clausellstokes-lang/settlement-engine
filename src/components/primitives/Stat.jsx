import { FS, SP, INK, MUTED, sans, serif_ } from '../theme.js';
import { useIconsOn } from './IconsContext.js';

/**
 * primitives/Stat — one labelled figure, read as a clean ledger entry.
 *
 * A muted uppercase label over a serif value. Built for the identity strips
 * and key-fact rows (tier, population, ruler) where the figure should pop by
 * quieting its label, not by shouting (P4). Group several with spacing rather
 * than boxing each one (P5).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.label
 * @param {React.ReactNode} props.value
 * @param {string} [props.tone]   overrides the value color for an anomaly
 * @param {React.ComponentType<{size?:number}>} [props.icon]
 * @param {'sm'|'md'} [props.size='md']
 */
export default function Stat({ label, value, tone, icon: Icon, size = 'md' }) {
  const iconsOn = useIconsOn();
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: SP.sm, minWidth: 0 }}>
      {iconsOn && Icon && <Icon size={size === 'sm' ? 14 : 16} aria-hidden="true" />}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: sans, fontSize: FS.micro, fontWeight: 800,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: MUTED, lineHeight: 1.2,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: serif_, fontSize: size === 'sm' ? FS.lg : FS.xl,
          fontWeight: 600, color: tone || INK, lineHeight: 1.25,
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}
