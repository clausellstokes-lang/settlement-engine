/**
 * PrioritySliders — the five priority slider ROWS, extracted from
 * ConfigurationPanel's old SliderPanel.
 *
 * This is pure presentation of the same five config values
 * (priorityEconomy/Military/Magic/Religion/Criminal) the Character archetypes
 * write. It owns NO mode toggle: the Random/Custom decision now lives on the
 * Character card's chip row. The card renders these sliders always-on directly
 * beneath the archetype chips.
 *
 * The Magic slider hides when magic does not exist in the world, the same rule
 * the legacy panel used. When `muted` is true (Random chip active) the rows dim
 * and a calm hint says priorities are rolled per seed; dragging still works and
 * the card exits Random on change.
 *
 * Token-driven, icons-off (the config panel is not the map).
 *
 * @param {{
 *   config: any,
 *   updateConfig: (patch: object) => void,
 *   muted?: boolean,
 *   magicExists?: boolean,
 * }} props
 */

import { INK, BODY, SECOND, swatch, FS, SP } from '../theme.js';

// Priority-slider accents routed through the swatch escape hatch (no forked
// color consts). The accent is DECORATION on the track + value number; the
// magnitude itself is carried by the number text, so colour is never the sole
// channel (P7).
const PRIORITIES = [
  { key: 'priorityEconomy', label: 'Economy', accent: swatch['#A0762A'] },
  { key: 'priorityMilitary', label: 'Military', accent: swatch['#8B1A1A'] },
  { key: 'priorityMagic', label: 'Magic', accent: swatch['#5A2A8A'] },
  { key: 'priorityReligion', label: 'Religion', accent: swatch['#1A5A28'] },
  { key: 'priorityCriminal', label: 'Criminal', accent: swatch['#4A1A4A'] },
];

export default function PrioritySliders({ config, updateConfig, muted = false, magicExists = true }) {
  return (
    <div>
      <div style={{ fontSize: FS.xxs, fontWeight: 700, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
        Priorities
      </div>
      {muted && (
        <p style={{ fontSize: FS.xs, color: BODY, margin: `0 0 ${SP.sm}px`, lineHeight: 1.4 }}>
          Random rolls these five priorities fresh each generation. Drag a slider or pick an archetype to set them yourself.
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: muted ? 0.5 : 1 }}>
        {PRIORITIES.map(({ key, label, accent }) => {
          // Hide the magic slider entirely when magic does not exist in this world.
          if (key === 'priorityMagic' && magicExists === false) return null;
          const val = config[key] ?? 50;
          const shown = Math.max(5, val);
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: FS.sm, fontWeight: 600, color: INK, width: 62, flexShrink: 0 }}>
                {label}
              </span>
              <input
                type="range"
                aria-label={label}
                aria-valuetext={`${label} priority ${val} of 95`}
                min={5}
                max={95}
                value={shown}
                onChange={e => updateConfig({ [key]: Number(e.target.value) })}
                style={{ flex: 1, accentColor: accent, height: 4 }}
              />
              <span style={{ fontSize: FS.xs, fontWeight: 700, color: accent, width: 46, textAlign: 'right', whiteSpace: 'nowrap' }}>
                {val}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
