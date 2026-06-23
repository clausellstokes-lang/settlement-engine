/**
 * RoutesToolbar — contextual toolbar for MAP_MODES.ROUTES.
 *
 * When Routes mode is the active map mode, this strip surfaces beneath
 * the mode pills and gives the user:
 *
 *   • A relationship-type filter (Trade / Allied / Patron / Rival /
 *     Hostile) — clicking a chip toggles that edge type on the
 *     relationships layer.
 *   • A supply-chain emphasis toggle — flips the chain layer between
 *     "all chains" and "stressed chains only" (the latter uses the
 *     existing chainFilter slot).
 *   • A "Show roads" toggle for completeness.
 *   • A network-stress hint when supplyChainState reports cascading
 *     failures — this is the "your routes are at risk" red-flag
 *     surface the critique called out.
 *
 * Pure presentational layer over the existing mapSlice. No new
 * persistence; settings round-trip through layers state that already
 * survives reload.
 *
 * Self-mounted by WorldMap.jsx (mapMode === MAP_MODES.ROUTES guard);
 * lazy-loaded so terrain/annotate users never download it.
 */

import { useMemo } from 'react';
import { useStore } from '../../store';
import { GOLD, GOLD_TXT, INK, SECOND, BORDER, BORDER2, RED, RED_BG, sans, FS, SP, R } from '../theme.js';
import { Link as LinkIcon, AlertTriangle, Eye, EyeOff, Check } from 'lucide-react';
import Button from '../primitives/Button.jsx';
// The relationship-type list (id + label + color) is the SHARED list used by
// LayersPanel and MapLegend, so the chips here name and color each type
// identically to those surfaces — the labels previously diverged ("Trade" here
// vs "Trade partner" in Layers) on a literally-shared toggle (P11).
import { REL_TYPES } from './relationshipEdgeStyle.js';

export default function RoutesToolbar() {
  const layers       = useStore(s => s.mapState?.layers);
  const setLayerFilter = useStore(s => s.setLayerFilter);
  const toggleLayer  = useStore(s => s.toggleLayer);
  const savedSettlements = useStore(s => s.savedSettlements);
  const placements   = useStore(s => s.mapState?.placements);

  const activeFilter = Array.isArray(layers?.relationshipFilter)
    ? layers.relationshipFilter
    : [];

  const toggleRelType = (id) => {
    const next = activeFilter.includes(id)
      ? activeFilter.filter(t => t !== id)
      : [...activeFilter, id];
    setLayerFilter('relationshipFilter', next);
  };

  const showAllRels = () => {
    setLayerFilter('relationshipFilter', REL_TYPES.map(t => t.id));
  };

  const hideAllRels = () => {
    setLayerFilter('relationshipFilter', []);
  };

  // The network-stress callout is REALM-WIDE: it surfaces the worst supply-chain
  // failure across every PLACED settlement on the map, not just the selected
  // burg (P3 — a cascading trade-war failure two burgs over must still flag).
  // The file's header always promised "the WORST one as a single callout"; this
  // now actually scans the placed set. Bound to placed settlements + memoized so
  // the realm-wide read stays cheap.
  const topFailure = useMemo(() => {
    const placedIds = new Set(
      Object.values(placements || {}).map(p => p?.settlementId).filter(Boolean).map(String),
    );
    if (!placedIds.size || !Array.isArray(savedSettlements)) return null;
    let worst = null;
    for (const save of savedSettlements) {
      const id = save?.id || save?.settlement?.id;
      if (!id || !placedIds.has(String(id))) continue;
      const failures = (save.settlement || save)?.supplyChainState?.failures || [];
      for (const f of failures) {
        const sev = Number.isFinite(f?.severity) ? f.severity : 0;
        if (!worst || sev > worst.severity) worst = { ...f, severity: sev };
      }
    }
    return worst;
  }, [savedSettlements, placements]);

  return (
    // Second row of the shared toolbar card (WorldMap.jsx) — no border/fill of
    // its own; a single top hairline divides it from the mode row (P5).
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
      padding: `${SP.sm}px ${SP.md}px`,
      borderTop: `1px solid ${BORDER}`,
    }}>
      {/* Eyebrow */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <LinkIcon size={13} color={GOLD} />
        <span style={{
          // GOLD_TXT (gold-800), not GOLD (gold-500): gold-500 as TEXT on the
          // light card is 2.33:1 and fails AA — GOLD_TXT is the legible step the
          // token system exists to enforce. The icon beside it stays GOLD (a
          // decorative graphic, defensible at 3:1) (P7).
          fontSize: FS.xs, fontWeight: 800,
          color: GOLD_TXT, letterSpacing: '0.08em',
          textTransform: 'uppercase', fontFamily: sans,
        }}>
          Routes
        </span>
      </div>

      {/* Grouping via differential spacing, not a hairline — mirrors the
          already-shipped AnnotateToolbar / TerrainToolbar siblings (P5). */}
      <div style={{ width: SP.lg }} />

      {/* Relationship filter chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {REL_TYPES.map(rt => {
          const active = activeFilter.includes(rt.id);
          return (
            <Button
              key={rt.id}
              variant="ghost"
              size="sm"
              aria-pressed={active}
              onClick={() => toggleRelType(rt.id)}
              title={`Toggle ${rt.label} edges`}
              style={{
                gap: 4,
                minHeight: 'auto',
                padding: '3px 8px',
                background: active ? `${rt.color}1A` : 'transparent',
                border: `1px solid ${active ? rt.color : BORDER2}`,
                borderRadius: R.sm,
                color: active ? INK : SECOND,
                fontWeight: active ? 700 : 500,
              }}
            >
              <span aria-hidden style={{
                width: 8, height: 8, borderRadius: 4, flexShrink: 0,
                background: rt.color,
                opacity: active ? 1 : 0.45,
              }} />
              {rt.label}
              {/* The active chip carries the SAME Check glyph as LayersPanel's
                  FilterChip so the selected-state grammar (dot + fill + check +
                  aria-pressed) is identical across the two shared toggle sets
                  (P11). */}
              {active && <Check size={10} />}
            </Button>
          );
        })}
        <Button
          variant="ghost"
          size="sm"
          onClick={activeFilter.length === REL_TYPES.length ? hideAllRels : showAllRels}
        >
          {activeFilter.length === REL_TYPES.length ? 'None' : 'All'}
        </Button>
      </div>

      {/* Grouping via differential spacing, not a hairline — mirrors the
          already-shipped AnnotateToolbar / TerrainToolbar siblings (P5). */}
      <div style={{ width: SP.lg }} />

      {/* Roads toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => toggleLayer('roads')}
        title="Toggle the roads layer"
        aria-pressed={!!layers?.roads}
        icon={layers?.roads ? <Eye size={11} /> : <EyeOff size={11} />}
      >
        Roads
      </Button>

      {/* Chains toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => toggleLayer('chains')}
        title="Toggle the supply-chain layer"
        aria-pressed={!!layers?.chains}
        icon={layers?.chains ? <Eye size={11} /> : <EyeOff size={11} />}
      >
        Chains
      </Button>

      {/* Network-stress callout — pulled to the right so it reads as a red flag,
          not a setting. Rendered as a BORDERLESS tinted chip (P5 anti-box-soup):
          inside the already-bordered toolbar card a second ring read as a box-in-
          a-box. The AlertTriangle icon + saturated RED text carry the alert in
          two channels (P7), and the raw rgba/#hex literals are replaced with the
          danger RED / RED_BG semantic tokens (P11). Mirrors the AutoSaveChip
          borderless-pill recipe. */}
      {topFailure && (
        <div style={{
          marginLeft: 'auto',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px',
          background: RED_BG,
          borderRadius: R.sm,
          fontSize: FS.xs, fontFamily: sans,
        }}>
          <AlertTriangle size={11} color={RED} />
          <span style={{ color: RED, fontWeight: 700 }}>
            Network stress
          </span>
          <span style={{ color: SECOND }}>
            {topFailure.good ? `${topFailure.good} stalled` : 'a supply line is failing'}
          </span>
        </div>
      )}
    </div>
  );
}
