/**
 * primitives/CanonBadge - Tier 5.3 surface.
 *
 * Inline chip that surfaces an entity's canon tag (source +
 * canonStatus + locked). Drops next to entity names in the dossier
 * so the DM can see at a glance: was this generated procedurally,
 * authored by me, applied via event, or AI-polished? Is it draft
 * or canon? Is it locked from regenerate?
 *
 * Consumes domain/canonStatus.js#tagEntityCanon. Pure presentational.
 *
 * Variants (single chip per entity):
 *
 *   ┌──────────────┬──────────────┬──────────────┬──────────────┐
 *   │              │ generated    │ user         │ event        │
 *   ├──────────────┼──────────────┼──────────────┼──────────────┤
 *   │ draft        │ - (default)  │ -            │ -            │
 *   │ canon        │ ● canon      │ ✎ user       │ ✦ event      │
 *   │ optional     │ ○ optional   │ ○ optional   │ ○ optional   │
 *   │ superseded   │ ✕ superseded │ ✕ superseded │ ✕ superseded │
 *   └──────────────┴──────────────┴──────────────┴──────────────┘
 *
 * ai_overlay × canon renders as `✧ ai`.
 *
 * For brevity, drafts (the default for procedurally-generated
 * entities) render NOTHING - most dossier entities are draft and
 * the visual noise would drown the signal. The badge fires only
 * when an entity has been promoted beyond its default state.
 *
 * Pass `verbose` to force-render every state for debug surfaces.
 */

import { tagEntityCanon } from '../../domain/canonStatus.js';
import { FS, swatch, MUTED } from '../theme.js';

const VARIANTS = Object.freeze({
  // source × canonStatus → { glyph, label, bg, fg, bdr }
  'user/canon': {
    glyph: '✎', label: 'user-authored',
    bg: 'rgba(90,42,138,0.10)', fg: '#5a2a8a', bdr: 'rgba(160,100,220,0.35)',
  },
  'event/canon': {
    glyph: '✦', label: 'event-applied',
    bg: 'rgba(196,128,60,0.10)', fg: '#7a4f0f', bdr: 'rgba(196,128,60,0.4)',
  },
  'ai_overlay/canon': {
    glyph: '✧', label: 'ai polish',
    bg: 'rgba(90,42,138,0.06)', fg: '#7a5a9a', bdr: 'rgba(160,100,220,0.25)',
  },
  'ai_overlay/optional': {
    glyph: '✧', label: 'ai (optional)',
    bg: 'rgba(90,42,138,0.05)', fg: '#7a5a9a', bdr: 'rgba(160,100,220,0.25)',
  },
  'generated/canon': {
    glyph: '●', label: 'canon',
    bg: 'rgba(26,74,32,0.10)', fg: '#1a4a20', bdr: 'rgba(26,74,32,0.35)',
  },
  'generated/optional': {
    glyph: '○', label: 'optional',
    bg: '#faf6ee', fg: '#9c8068', bdr: '#d2bd96',
  },
  // Any source × superseded
  '*/superseded': {
    glyph: '✕', label: 'superseded',
    bg: 'rgba(139,26,26,0.08)', fg: '#8b1a1a', bdr: 'rgba(139,26,26,0.3)',
  },
});

function variantFor(tag) {
  if (!tag) return null;
  if (tag.canonStatus === 'superseded') return VARIANTS['*/superseded'];
  const key = `${tag.source}/${tag.canonStatus}`;
  return VARIANTS[key] || null;
}

/**
 * Render a canon tag chip for the given entity. Returns null for
 * default-state entities (generated + draft) unless `verbose` is set.
 *
 * Props:
 *   entity   - the entity to tag. Required.
 *   verbose  - when true, render every state (debug surfaces).
 *   showLock - when true and tag.locked, append a lock indicator.
 *   style    - caller-provided overrides.
 */
export function CanonBadge({ entity, verbose = false, showLock = true, style = {} }) {
  if (!entity || typeof entity !== 'object') return null;
  const tag = tagEntityCanon(entity);

  // Draft + generated is the silent majority. Show nothing unless
  // verbose so we don't pepper the dossier with redundant chips.
  if (!verbose && tag.source === 'generated' && tag.canonStatus === 'draft') return null;

  const v = variantFor(tag);
  if (!v) {
    if (!verbose) return null;
    return (
      <span
        title={`source: ${tag.source}, status: ${tag.canonStatus}`}
        style={{
          display: 'inline-block',
          fontSize: FS.micro, fontWeight: 700,
          padding: '1px 5px', borderRadius: 3,
          background: swatch['#FAF6EE'],
          color: MUTED,
          border: '1px solid #d2bd96',
          textTransform: 'uppercase', letterSpacing: '0.05em',
          ...style,
        }}
      >
        {tag.source}·{tag.canonStatus}
      </span>
    );
  }

  return (
    <span
      title={`${v.label}${tag.locked ? ' · locked' : ''}`}
      role="status"
      aria-label={`${v.label}${tag.locked ? ', locked' : ''}`}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        fontSize: FS.micro, fontWeight: 800,
        padding: '1px 5px', borderRadius: 3,
        background: v.bg,
        color: v.fg,
        border: `1px solid ${v.bdr}`,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        verticalAlign: 'middle',
        ...style,
      }}
    >
      <span aria-hidden="true">{v.glyph}</span>
      <span>{v.label}</span>
      {showLock && tag.locked && (
        <span aria-hidden="true" style={{ marginLeft: 2 }}>🔒</span>
      )}
    </span>
  );
}

export default CanonBadge;
