/**
 * CharacterPresetCard — the 17-archetype "Character" preset, PROMOTED to a
 * top-level Tier-1 card in the Create flow.
 *
 * It was buried inside SliderPanel's "Archetype preset" dropdown; a new DM never
 * found it. Now it's the first thing on the layered ConfigurationPanel: pick a
 * character (or "Custom") and the priority sliders snap to that shape. Applying a
 * preset writes the SAME config patch the dropdown always did (archetypePatch),
 * so generation stays byte-identical — this is a surface move, not a mapping
 * change.
 *
 * Reads config + updateConfig from the store (no props needed), matching the rest
 * of the Create surfaces. The Arcane group hides when magic doesn't exist in the
 * world — same rule the legacy dropdown used.
 */

import { useStore } from '../../store/index.js';
import { ARCHETYPES, ARCHETYPE_GROUPS, archetypePatch } from './characterPresets.js';
import { GOLD, INK, MUTED, SECOND, BORDER, BORDER2, CARD, sans, serif_, FS, SP, R, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

const PARCHMENT = swatch['#F7F0E4'];

/**
 * Infer which archetype (if any) the current sliders match — so reopening the
 * panel shows the active character selected rather than always "Custom". Exact
 * match on the five priority values; otherwise null ("Custom").
 * @param {any} config
 */
function activeArchetypeKey(config) {
  return ARCHETYPES.find(a =>
    (config.priorityEconomy ?? 50) === a.e &&
    (config.priorityMilitary ?? 50) === a.m &&
    (config.priorityMagic ?? 50) === a.mg &&
    (config.priorityReligion ?? 50) === a.r &&
    (config.priorityCriminal ?? 50) === a.c,
  )?.key || null;
}

export default function CharacterPresetCard() {
  const config = useStore(s => s.config);
  const updateConfig = useStore(s => s.updateConfig);
  const setRandomSliderMode = useStore(s => s.setRandomSliderMode);

  const magicExists = config.magicExists !== false;
  const active = activeArchetypeKey(config);

  const apply = (key) => {
    const patch = archetypePatch(key);
    if (!patch) return;
    // Picking a character means explicit sliders — leave random mode if it was on,
    // so the chosen shape actually takes effect (mirrors the legacy dropdown,
    // which only showed under "Set manually").
    setRandomSliderMode?.(false);
    updateConfig(patch);
  };

  return (
    <div style={{ background: PARCHMENT, border: `1px solid ${BORDER}`, borderRadius: R.lg, padding: `${SP.md}px ${SP.lg}px`, marginBottom: SP.md }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK }}>Character</span>
        <span style={{ fontSize: FS.xs, color: MUTED }}>Pick a settlement archetype to shape it in one tap</span>
      </div>
      <p style={{ fontSize: FS.xs, color: SECOND, margin: `0 0 ${SP.sm}px`, lineHeight: 1.4 }}>
        Each character sets the priority sliders below. Choose one to start, or pick Custom and tune them yourself.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
        {ARCHETYPE_GROUPS.filter(g => magicExists || g.label !== 'Arcane').map(({ label, keys }) => (
          <div key={label}>
            <div style={{ fontSize: FS.xxs, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {keys.map(key => {
                const a = ARCHETYPES.find(x => x.key === key);
                if (!a) return null;
                const on = active === key;
                return (
                  <Button
                    key={key}
                    variant={on ? 'gold' : 'secondary'}
                    size="sm"
                    aria-pressed={on}
                    onClick={() => apply(key)}
                    title={a.desc}
                    style={{
                      fontSize: FS.xs, padding: '4px 10px', borderRadius: R.md, minHeight: 'auto',
                      border: `1px solid ${on ? GOLD : BORDER2}`, background: on ? `${GOLD}18` : CARD,
                      color: on ? GOLD : SECOND, fontWeight: on ? 700 : 500, fontFamily: sans,
                    }}
                  >
                    {a.name}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
