/**
 * CharacterPresetCard — the "Character" card in the Create flow, now the single
 * home of BOTH the archetype chips and the five priority sliders.
 *
 * Archetypes and sliders were always the SAME five config values
 * (priorityEconomy/Military/Magic/Religion/Criminal, plus monsterThreat on a
 * preset). archetypePatch(key) writes them; the sliders write them; the active
 * archetype is DERIVED by exact-matching the live values. This card reconciles
 * the two surfaces into one: archetype chips on top, the sliders always visible
 * directly underneath in the same parchment card.
 *
 * Three-state chip model (Advanced only):
 *   • Random  — randomSliderMode === true. The generator rolls priorities per
 *               seed and ignores the stored values. The default state.
 *   • <archetype> — randomSliderMode === false AND the live values exactly match
 *               one of the 17 presets. Picking a chip applies its full patch.
 *   • Custom  — randomSliderMode === false AND either the GM clicked the Custom
 *               chip (customSlidersExplicit) or the live values match no preset.
 *
 * The explicit-Custom flag exists because the live values can exactly match a
 * preset at the moment Custom is clicked — the default 50s equal `balanced`, and
 * picking any archetype leaves its values behind — so a purely derived Custom
 * could light up the matched preset instead and the click would feel ignored.
 * customSlidersExplicit lets the Custom click win over any preset match; any
 * archetype pick or Random clears it, and a slider drag leaves it as-is.
 *
 * Basic mode (advanced === false) is UNCHANGED: archetype chips only, no
 * Random/Custom chips, no sliders. The Arcane group + the Magic slider hide when
 * magic does not exist in the world.
 *
 * Reads config + updateConfig + setRandomSliderMode + randomSliderMode from the
 * store. The archetype label feeds nothing in the generator; only the priorities
 * do, so consolidating the surfaces is byte-identical to generation.
 */

import { useStore } from '../../store/index.js';
import { ARCHETYPES, ARCHETYPE_GROUPS, archetypePatch } from './characterPresets.js';
import { INK, MUTED, SECOND, BORDER, sans, serif_, FS, SP, R, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import PrioritySliders from './PrioritySliders.jsx';

const PARCHMENT = swatch['#F7F0E4'];

const RANDOM_KEY = '__random__';
const CUSTOM_KEY = '__custom__';

// Shared chip geometry. The chips read compact (FS.xs), but the interactive box
// is held at the ~44px touch-target floor (WCAG 2.5.8 / 2.5.5) via minHeight +
// generous vertical padding — NOT shrunk to the glyph. Earlier these set
// `minHeight: 'auto'`, which defeated Button sm's 32px floor and left a ~21px hit
// area; this restores a reachable target without enlarging the visual text.
const CHIP_STYLE = {
  fontSize: FS.xs,
  padding: '10px 12px',
  borderRadius: R.md,
  minHeight: 44,
  fontFamily: sans,
};

/**
 * Infer which archetype (if any) the current sliders match — so reopening the
 * panel shows the active character selected rather than always "Custom". Exact
 * match on the five priority values; otherwise null ("Custom").
 * @param {any} config
 */
export function activeArchetypeKey(config) {
  return ARCHETYPES.find(a =>
    (config.priorityEconomy ?? 50) === a.e &&
    (config.priorityMilitary ?? 50) === a.m &&
    (config.priorityMagic ?? 50) === a.mg &&
    (config.priorityReligion ?? 50) === a.r &&
    (config.priorityCriminal ?? 50) === a.c,
  )?.key || null;
}

/**
 * The single active chip across the three states:
 *   Random when randomSliderMode is on; else Custom when the GM explicitly chose
 *   it (customSlidersExplicit); else the matched archetype; else Custom.
 *
 * An explicit Custom click means "I am hand-tuning" and ALWAYS wins (short of
 * Random), so the Custom chip is reliable even when the live values exactly match
 * a preset — the default 50s (which equal `balanced`) or the values left behind
 * right after picking an archetype. Any archetype pick or Random clears the flag;
 * dragging off a preset yields Custom by derivation regardless. Without this,
 * "pick an archetype, then click Custom" would leave that archetype lit and the
 * click would feel ignored.
 * @param {any} config
 * @param {boolean} randomSliderMode
 * @param {boolean} [customSlidersExplicit]
 */
export function activeChipKey(config, randomSliderMode, customSlidersExplicit = false) {
  if (randomSliderMode === true) return RANDOM_KEY;
  if (customSlidersExplicit) return CUSTOM_KEY;
  return activeArchetypeKey(config) || CUSTOM_KEY;
}

/**
 * @param {{ advanced?: boolean }} [props]
 *   advanced — when true, prepend a Random chip and append a Custom chip to the
 *     grouped archetype chips, and render the always-on priority sliders beneath.
 *     Basic (false, the default) renders archetypes only, as before.
 */
export default function CharacterPresetCard({ advanced = false } = {}) {
  const config = useStore(s => s.config);
  const updateConfig = useStore(s => s.updateConfig);
  const setRandomSliderMode = useStore(s => s.setRandomSliderMode);
  const randomSliderMode = useStore(s => s.randomSliderMode);
  const customSlidersExplicit = useStore(s => s.customSlidersExplicit);
  const setCustomSlidersExplicit = useStore(s => s.setCustomSlidersExplicit);

  const magicExists = config.magicExists !== false;
  // In Basic there is no Random state surfaced, so the active chip is purely the
  // matched archetype (or none). In Advanced, Random/Custom join the derivation.
  const active = advanced
    ? activeChipKey(config, randomSliderMode, customSlidersExplicit)
    : activeArchetypeKey(config);

  const apply = (key) => {
    const patch = archetypePatch(key);
    if (!patch) return;
    // Picking a character means explicit sliders — leave random mode if it was on,
    // so the chosen shape actually takes effect. An archetype pick also clears any
    // explicit-Custom intent, so the chosen chip (not Custom) lights up.
    setRandomSliderMode?.(false);
    setCustomSlidersExplicit?.(false);
    updateConfig(patch);
  };

  // Random clears explicit-Custom intent so returning from Custom→Random→Custom
  // re-derives cleanly.
  const chooseRandom = () => {
    setRandomSliderMode?.(true);
    setCustomSlidersExplicit?.(false);
  };
  // Custom enters manual mode WITHOUT touching slider values, so the GM tunes
  // from wherever the priorities currently sit. The explicit flag makes the Custom
  // chip win even when the priorities sit at the default 50s (which exact-match the
  // `balanced` archetype).
  const chooseCustom = () => {
    setRandomSliderMode?.(false);
    setCustomSlidersExplicit?.(true);
  };

  // A slider drag implicitly leaves Random and lands on Custom (or re-matches an
  // archetype). The card re-derives the active chip automatically. The explicit
  // flag is left untouched: a drag to a real preset still wins (flag only breaks
  // the `balanced` tie), and a deliberate drag back to 50s stays Custom.
  const handleSliderChange = (patch) => {
    if (randomSliderMode === true) setRandomSliderMode?.(false);
    updateConfig(patch);
  };

  const explainer = advanced
    ? 'Pick an archetype to shape the five priorities, choose Random to roll them per generation, or set Custom and tune the sliders yourself.'
    : 'Pick an archetype to shape the settlement. The simulator rolls the finer priorities for you.';

  return (
    <div style={{ background: PARCHMENT, border: `1px solid ${BORDER}`, borderRadius: R.lg, padding: `${SP.md}px ${SP.lg}px`, marginBottom: SP.md }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK }}>Character</span>
        <span style={{ fontSize: FS.xs, color: MUTED }}>Pick a settlement archetype to shape it in one tap</span>
      </div>
      <p style={{ fontSize: FS.xs, color: SECOND, margin: `0 0 ${SP.sm}px`, lineHeight: 1.4 }}>
        {explainer}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
        {advanced && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Button
                variant={active === RANDOM_KEY ? 'gold' : 'secondary'}
                size="sm"
                aria-pressed={active === RANDOM_KEY}
                onClick={chooseRandom}
                title="Roll all five priorities fresh each generation"
                style={{ ...CHIP_STYLE, fontWeight: active === RANDOM_KEY ? 700 : 500 }}
              >
                {active === RANDOM_KEY ? '✓ Random' : 'Random'}
              </Button>
            </div>
          </div>
        )}
        {ARCHETYPE_GROUPS.filter(g => magicExists || g.label !== 'Arcane').map(({ label, keys }) => (
          <div key={label}>
            <div style={{ fontSize: FS.xxs, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {keys.map(key => {
                const a = ARCHETYPES.find(x => x.key === key);
                if (!a) return null;
                const on = active === key;
                // Selected chip uses the `gold` variant's own (WCAG-passing)
                // colors plus a check glyph + bold weight, so the active state
                // reads in text/weight/glyph as well as colour (P7), never colour
                // alone.
                return (
                  <Button
                    key={key}
                    variant={on ? 'gold' : 'secondary'}
                    size="sm"
                    aria-pressed={on}
                    onClick={() => apply(key)}
                    title={a.desc}
                    style={{ ...CHIP_STYLE, fontWeight: on ? 700 : 500 }}
                  >
                    {on ? `✓ ${a.name}` : a.name}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
        {advanced && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Button
                variant={active === CUSTOM_KEY ? 'gold' : 'secondary'}
                size="sm"
                aria-pressed={active === CUSTOM_KEY}
                onClick={chooseCustom}
                title="Tune the sliders yourself from the current values"
                style={{ ...CHIP_STYLE, fontWeight: active === CUSTOM_KEY ? 700 : 500 }}
              >
                {active === CUSTOM_KEY ? '✓ Custom' : 'Custom'}
              </Button>
            </div>
          </div>
        )}
      </div>
      {advanced && (
        <div style={{ marginTop: SP.md, paddingTop: SP.md, borderTop: `1px solid ${BORDER}` }}>
          <PrioritySliders
            config={config}
            updateConfig={handleSliderChange}
            muted={active === RANDOM_KEY}
            magicExists={magicExists}
          />
        </div>
      )}
    </div>
  );
}
