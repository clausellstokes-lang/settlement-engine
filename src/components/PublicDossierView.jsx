/**
 * PublicDossierView.jsx — Read-only renderer for shared public dossiers.
 *
 * Wraps OutputContainer in read-only mode and passes the settlement
 * object straight in (bypasses the store). Adds a small header strip
 * with title, tier, view count, and a "forge your own" CTA — the
 * gallery's whole point is to drive new sign-ups.
 *
 * Why not just reuse OutputContainer alone:
 *   The OutputContainer reaches into the store for the active
 *   settlement, AI state, regenerate handlers, etc. None of that
 *   applies to a public viewer. Wrapping it with explicit props and
 *   `readOnly` gives the public viewer a clean, owner-free surface.
 *
 * Privacy:
 *   No owner name, email, or display name is rendered — the dossier
 *   object is the world's view of the place, nothing more.
 */

import { ArrowRight, Eye } from 'lucide-react';
import OutputContainer from './OutputContainer.jsx';
import { TIER_LABELS } from './new/design.js';
import {
  GOLD, INK, BORDER, sans, serif_, SP, R, FS,
} from './theme.js';

const MUTED = '#6b5340';
const BODY  = '#4A3B22';

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function PublicDossierView({ dossier, onForge }) {
  if (!dossier || !dossier.settlement) {
    return (
      <div style={{
        padding: SP.xl, textAlign: 'center', color: BODY,
        fontFamily: sans, fontSize: FS.sm,
      }}>
        Dossier unavailable.
      </div>
    );
  }

  const { settlement, name, tier, publishedAt, viewCount } = dossier;
  const tierLabel = TIER_LABELS[tier] || tier;

  return (
    <article style={{ fontFamily: sans, color: INK }}>
      {/* Public-dossier banner */}
      <header style={{
        marginBottom: SP.lg,
        padding: `${SP.md}px ${SP.lg}px`,
        background: 'linear-gradient(135deg, #FBF5E6 0%, #F4EAD0 100%)',
        border: `1px solid ${BORDER}`,
        borderRadius: R.xl,
        display: 'flex', alignItems: 'center', gap: SP.lg,
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            margin: 0, fontFamily: serif_, fontSize: FS.xxl, fontWeight: 600,
            color: INK, lineHeight: 1.2,
          }}>
            {name || settlement.name || 'Untitled settlement'}
          </h1>
          <div style={{
            display: 'flex', alignItems: 'center', gap: SP.md,
            marginTop: 4, fontSize: FS.xs, color: MUTED,
            textTransform: 'capitalize',
          }}>
            <span>{tierLabel}</span>
            {publishedAt && (
              <>
                <span aria-hidden="true">·</span>
                <span>shared {formatDate(publishedAt)}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Eye size={11} /> {viewCount} {viewCount === 1 ? 'view' : 'views'}
            </span>
          </div>
        </div>
        {onForge && (
          <button
            type="button"
            onClick={onForge}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: `${SP.sm}px ${SP.lg}px`,
              background: GOLD, color: '#fff',
              border: 'none', borderRadius: R.button,
              fontFamily: sans, fontSize: FS.sm, fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Forge your own <ArrowRight size={14} />
          </button>
        )}
      </header>

      {/* The dossier itself, in read-only mode. */}
      <OutputContainer settlement={settlement} readOnly />
    </article>
  );
}
