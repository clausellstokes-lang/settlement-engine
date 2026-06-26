/**
 * WorldSectionToggles.jsx — the per-section "Share the living world" toggle group
 * for a map_with_campaign share.
 *
 * The five sections match the serializeWorldSnapshotPublic option keys exactly
 * (worldClock / chronicle / pantheon / warNetwork / dashboard) and the saved_maps
 * gallery_world_sections allowlist. Each section the owner leaves on is serialized
 * into the public snapshot; switching one off withholds it. Default all on — the
 * owner narrows, never opts in from nothing.
 *
 * Stateless: the parent owns the enabled Set and the persist; this only renders the
 * checkboxes and hands back the next Set.
 */

import { sans, SP, R, FS, CARD, CARD_ALT, BORDER2, INK, BODY, MUTED } from '../theme.js';

/**
 * The five revealable world sections: [key, label, helper]. The keys MUST stay in
 * lockstep with serializeWorldSnapshotPublic's opts and lib/gallery's
 * WORLD_SECTION_KEYS — a section reaches the public snapshot only when all three
 * honour the same key.
 */
export const WORLD_SECTIONS = Object.freeze([
  ['worldClock', 'World clock', 'The in-world date, season, and how many ticks the realm has lived.'],
  ['chronicle', 'Chronicle', 'The headline log of what happened each tick across the realm.'],
  ['pantheon', 'Pantheon', 'The deities, their tiers, and how many settlements hold each faith.'],
  ['warNetwork', 'War and network', 'Live sieges, trade wars, standings, and the public channels between settlements.'],
  ['dashboard', 'Dashboard', 'The simulation rules in play and the realm-arc summary of its epics.'],
]);

/**
 * @param {Object} props
 * @param {Set<string>} props.enabled  the currently enabled section keys.
 * @param {(next: Set<string>) => void} props.onToggle  called with the next Set when a box flips.
 */
export default function WorldSectionToggles({ enabled, onToggle }) {
  const flip = (key) => {
    const next = new Set(enabled);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onToggle(next);
  };

  return (
    <div style={{
      display: 'grid', gap: SP.xs, padding: SP.sm,
      border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD,
    }}>
      <div style={{ display: 'grid', gap: 2 }}>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Share the living world
        </span>
        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.4 }}>
          All sections start on. Switch off anything you would rather keep to yourself. Private DM detail is never included.
        </span>
      </div>
      {WORLD_SECTIONS.map(([key, label, helper]) => {
        const id = `map-share-world-${key}`;
        return (
          <label
            key={key}
            htmlFor={id}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer',
              padding: SP.xs, border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD_ALT,
            }}
          >
            <input
              id={id}
              type="checkbox"
              aria-label={`Share ${label}`}
              checked={enabled.has(key)}
              onChange={() => flip(key)}
              style={{ marginTop: 2, flexShrink: 0 }}
            />
            <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
              <strong style={{ color: INK }}>{label}</strong>. {helper}
            </span>
          </label>
        );
      })}
    </div>
  );
}
