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

import { lazy, Suspense, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import OutputContainer from './OutputContainer.jsx';
import Button from './primitives/Button.jsx';
import Segmented from './primitives/Segmented.jsx';
import DetailErrorBoundary from './settlementDetail/DetailErrorBoundary.jsx';
import { TIER_LABELS } from './new/design.js';
import { INK, BORDER, sans, serif_, SP, FS, swatch, PARCH, PARCH_100 } from './theme.js';
import { t } from '../copy/index.js';

// SM-4 gallery opt-in — the town map, reused from the library viewer. Lazy: the
// SAME chunk SettlementDetail already mints (identical specifier ⇒ no NEW chunk,
// no new entry-preload leak), and PublicDossierView is itself lazily routed, so the
// map stays off the first-paint closure. View-only in the gallery (canEdit=false,
// no saveId), rendered from the ALREADY-sanitized public projection.
const SettlementMapPane = lazy(() => import('./townMap/SettlementMapPane.jsx'));

const MUTED = swatch['#6B5340'];
const BODY  = swatch['#4A3B22'];

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function PublicDossierView({ dossier, onForge, showHeader = true }) {
  const [view, setView] = useState('dossier');
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

  const { settlement, name, tier, publishedAt, viewCount, shareDm, chronicle } = dossier;
  const tierLabel = TIER_LABELS[tier] || tier;

  // SM-4 — GALLERY OPT-IN (fail-closed default OFF). The town map appears in the
  // public gallery ONLY when the owner opted into the existing DM-full share
  // (gallery_share_dm ⇒ dossier.shareDm). Absent/false ⇒ no toggle, no map, so a
  // non-opted-in dossier renders EXACTLY as before (byte-identical). The map is a
  // SIBLING of OutputContainer (never inside it — design §4), renders from the
  // ALREADY-sanitized `settlement` (the server public projection; mapEdits are
  // stripped ⇒ base layout ⇒ no cosmetic leak), and is strictly view-only
  // (canEdit=false, no saveId). A dedicated `gallery_share_town_map` flag +
  // exposing the owner's cosmetic mapEdits would need a migration + SQL twin
  // (owner-gated, design §6) — deferred; V1 rides the existing flag.
  const mapOptIn = !!shareDm;
  const showMap = mapOptIn && view === 'map';

  return (
    <article style={{ fontFamily: sans, color: INK }}>
      {/* Public-dossier banner */}
      {showHeader && <header style={{
        marginBottom: SP.lg,
        padding: `${SP.md}px ${SP.lg}px`,
        background: `linear-gradient(135deg, ${PARCH} 0%, ${PARCH_100} 100%)`,
        border: `1px solid ${BORDER}`,
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
            <span>
              {viewCount} {viewCount === 1 ? 'view' : 'views'}
            </span>
          </div>
        </div>
        {onForge && (
          <Button
            type="button"
            variant="primary"
            onClick={onForge}
            trailingIcon={<ArrowRight size={14} />}
          >
            {t('gallery.forgeYourOwn')}
          </Button>
        )}
      </header>}

      {/* SM-4 — the [Dossier | Map] lens toggle, shown ONLY when the owner opted
          into the town-map share (fail-closed). A non-opted-in dossier never sees
          it, so its markup is unchanged. */}
      {mapOptIn && (
        <div style={{ marginBottom: SP.lg }}>
          <Segmented
            ariaLabel="Public settlement view"
            options={[{ id: 'dossier', label: 'Dossier' }, { id: 'map', label: 'Map' }]}
            value={view}
            onChange={setView}
          />
        </div>
      )}

      {showMap ? (
        // The town map, view-only, from the already-sanitized public projection.
        // A sibling of OutputContainer — never inside it (design §4).
        <DetailErrorBoundary>
          <Suspense fallback={<div style={{ padding: 20, textAlign: 'center', color: MUTED, fontFamily: sans, fontSize: FS.sm }}>Loading map...</div>}>
            <SettlementMapPane settlement={settlement} canEdit={false} saveId={null} />
          </Suspense>
        </DetailErrorBoundary>
      ) : (
        /* The dossier itself, read-only. Player view by default (DM content hidden);
           when the owner opted into "Reveal DM-private content" (shareDm), render in
           DM mode so secrets, NPC goals, the DM Compass, etc. are shown. The event
           Chronicle renders in BOTH modes: a public dossier has no saved
           campaignState to read the eventLog from, so the gallery RPC ships an
           allowlisted projection (titles + summaries; migration 032) as its own
           column, threaded here as publicChronicle. */
        <OutputContainer settlement={settlement} readOnly playerView={!shareDm} publicChronicle={chronicle} />
      )}
    </article>
  );
}
