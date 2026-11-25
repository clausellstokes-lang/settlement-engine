/**
 * WorldSectionToggles.jsx — the per-section "Share the living world" toggle group
 * for a map_with_campaign share.
 *
 * The four sections match serializeWorldSnapshotPublic option keys exactly
 * (worldClock / pantheon / warNetwork / dashboard) and sit inside the saved_maps
 * gallery_world_sections allowlist. Each section the owner leaves on is serialized
 * into the public snapshot; switching one off withholds it. Default all on — the
 * owner narrows, never opts in from nothing.
 *
 * NOT OFFERED: the chronicle (SNAP-CHRONICLE, VEIL-52, the chair's V13 2026-11-25). The
 * server's scanner (_gallery_world_snapshot_is_safe) refuses any `.*chronicle.*` key at
 * any depth, so a shared map's world carrying one is refused at publish. A shared map's
 * world never offers or serializes it; sending it would be a new capability (the
 * owner's), not built here. worldSnapshotShareOpts is the one place the share path
 * turns a selection into serializer opts, so a stored selection naming `chronicle`
 * (a share saved before this) cannot bring it back.
 *
 * Stateless: the parent owns the enabled Set and the persist; this only renders the
 * checkboxes and hands back the next Set.
 */

import { sans, SP, FS, CARD, CARD_ALT, BORDER2, INK, BODY, MUTED } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

/**
 * The four revealable world sections: [key, label, helper]. Each key MUST be a
 * serializeWorldSnapshotPublic opt and a member of lib/gallery's WORLD_SECTION_KEYS —
 * a section reaches the public snapshot only when all three honour the same key.
 * tests/security/shareSnapshotDenyPattern.walker.test.js tries every key offered here
 * against the server's deny pattern.
 */
export const WORLD_SECTIONS = Object.freeze([
  ['worldClock', 'World clock', 'The in-world date, season, and how many ticks the realm has lived.'],
  ['pantheon', 'Pantheon', 'The deities, their tiers, and how many settlements hold each faith.'],
  ['warNetwork', 'War and network', 'Live sieges, trade wars, realm contest records, and the public channels between settlements.'],
  ['dashboard', 'Dashboard', 'The simulation rules in play and the realm-arc summary of its epics.'],
]);

/**
 * The serializeWorldSnapshotPublic section opts for a SHARED MAP's world: one boolean per
 * OFFERED section and nothing else, so a key the editor does not offer (a stored selection
 * naming `chronicle`, saved before SNAP-CHRONICLE) can never switch a section on.
 *
 * @param {Iterable<string>|null|undefined} enabled the enabled section keys (a Set or an array).
 * @returns {Record<string, boolean>} the serializer opts, keyed by WORLD_SECTIONS' keys only.
 */
export function worldSnapshotShareOpts(enabled) {
  const on = new Set(enabled == null ? [] : enabled);
  return Object.fromEntries(WORLD_SECTIONS.map(([key]) => [key, on.has(key)]));
}

/**
 * @param {Object} props
 * @param {Set<string>} props.enabled  the currently enabled section keys.
 * @param {(next: Set<string>) => void} props.onToggle  called with the next Set when a box flips.
 */
export default function WorldSectionToggles({ enabled, onToggle }) {
  const mobile = useIsMobile();
  const flip = (key) => {
    const next = new Set(enabled);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onToggle(next);
  };

  return (
    <div style={{
      display: 'grid', gap: SP.xs, padding: SP.sm,
      border: `1px solid ${BORDER2}`, background: CARD,
    }}>
      <div style={{ display: 'grid', gap: 2 }}>
        <span style={{ color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Share the living world
        </span>
        <span style={{ color: MUTED, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), lineHeight: 1.4 }}>
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
              padding: SP.xs, border: `1px solid ${BORDER2}`, background: CARD_ALT,
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
            <span style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), lineHeight: 1.45 }}>
              <strong style={{ color: INK }}>{label}</strong>. {helper}
            </span>
          </label>
        );
      })}
    </div>
  );
}
