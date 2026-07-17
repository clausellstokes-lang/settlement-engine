/**
 * GalleryReactionChips.jsx — the six structured reactions (GALLERY-2 phase 2).
 *
 * Two renderings of the same frozen vocabulary (src/data/galleryReactionVocab.js):
 *
 *   • <GalleryReactionChips>   — the INTERACTIVE chip row on the public dossier:
 *     all six phrases as toggle chips with live counts; `mine` renders pressed.
 *     Signed-out readers see the chips (counts included) but the press routes to
 *     the hook's sign-in notice — the caps bind ACTIONS, never rendering.
 *
 *   • <GalleryReactionSummary> — the READ-ONLY digest on gallery cards: the top
 *     non-zero reactions (count-desc, vocab order on ties), capped so a tile
 *     never grows a six-chip footer. Renders nothing when a settlement has no
 *     reactions yet.
 *
 * No free text anywhere: unknown keys never render (REACTION_LABELS lookup).
 */
import { REACTION_VOCAB, REACTION_LABELS } from '../../data/galleryReactionVocab.js';
import Button from '../primitives/Button.jsx';
import { BORDER2, CARD, GOLD_TXT, INK, sans, FS, SP } from '../theme.js';

const SUMMARY_LIMIT = 3;
// The pill radius idiom (design/tokens.js uses 999 for pill-shaped controls).
const PILL = 999;

/** Interactive dossier chip row. `state` = { counts, mine } (sanitizeReactionState). */
export default function GalleryReactionChips({ state, onReact, busyKey = null, itemId = null }) {
  const counts = state?.counts || {};
  const mine = state?.mine || {};
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs, alignItems: 'center' }}>
      {REACTION_VOCAB.map(({ key, label }) => {
        const count = Math.max(0, Number(counts[key]) || 0);
        const pressed = mine[key] === true;
        const busy = busyKey === `${itemId}:${key}`;
        return (
          <Button
            key={key}
            type="button"
            variant={pressed ? 'success' : 'secondary'}
            size="sm"
            aria-pressed={pressed}
            aria-label={`${pressed ? 'Remove reaction' : 'React'}: ${label}${count ? ` (${count})` : ''}`}
            disabled={busy}
            busy={busy}
            style={{ borderRadius: PILL }}
            onClick={event => {
              event.stopPropagation();
              onReact?.(key);
            }}
          >
            {label}
            {count > 0 && (
              <span style={{ color: GOLD_TXT, fontWeight: 800, marginLeft: 5 }}>{count}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

/** Read-only card digest: top non-zero reactions, capped at SUMMARY_LIMIT. */
export function GalleryReactionSummary({ counts }) {
  const entries = Object.entries(counts || {})
    .filter(([key, n]) => REACTION_LABELS[key] && Number(n) > 0)
    .sort((a, b) => (b[1] - a[1]) || (
      REACTION_VOCAB.findIndex(r => r.key === a[0]) - REACTION_VOCAB.findIndex(r => r.key === b[0])
    ))
    .slice(0, SUMMARY_LIMIT);
  if (!entries.length) return null;
  return (
    <div aria-label="Reader reactions" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {entries.map(([key, n]) => (
        <span
          key={key}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px',
            border: `1px solid ${BORDER2}`,
            borderRadius: PILL,
            background: CARD,
            color: INK,
            fontFamily: sans, fontSize: FS.xxs, fontWeight: 700,
          }}
        >
          {REACTION_LABELS[key]}
          <span style={{ color: GOLD_TXT, fontWeight: 800 }}>{n}</span>
        </span>
      ))}
    </div>
  );
}
