/**
 * SettlementPalette — left sidebar showing the available settlements that
 * can be dragged onto the map. Each card is a draggable element with the
 * settlement's id/name/population encoded in its dataTransfer payload.
 *
 * Placed settlements show a "placed" badge and are visually muted.
 */

import { lazy, Suspense, useMemo, useState } from 'react';
import { MapPin, Search, GripVertical, PlusCircle } from 'lucide-react';
import { useStore } from '../../store';
import { formatCount } from '../../domain/formatNumber.js';
import { BODY, GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR, sans, FS, SP, R, swatch, EMPTY_VALUE } from '../theme.js';
import Button from '../primitives/Button.jsx';
import CampaignEmptyState from './CampaignEmptyState.jsx';
import { threatDisplay } from './settlementThreat.js';

// S2r re-home (C5): InstantWorldEntry — the premium one-click realm composer —
// was orphaned when the owner's create-page walk fix unmounted its only card
// (WizardEmptyState). Its natural host is the Realm empty state: it COMPOSES a
// realm, so the no-campaign moment is exactly where "build a whole realm at
// once" belongs. Mounted subordinate to the Create/Select CTA, never the page's
// gold (Advance owns that, and Advance only renders once a campaign is active,
// so the two golds never co-occur). Lazy so the heavy composer never enters the
// palette chunk — the realm-surfaces-lazy law holds; the desktop gate means it
// is never reached on a phone, so isMobile is pinned false.
const InstantWorldEntry = lazy(() => import('../instant/InstantWorldEntry.jsx'));

export default function SettlementPalette({
  saves = [], placements = {}, activeCampaign, onNavigate,
  onCreateCampaign, onSelectCampaign, hasCampaigns = false,
}) {
  const [query, setQuery] = useState('');
  // F28 — keyboard placement is impossible here: a settlement lands on the map
  // by dragging its card onto an <iframe> world map at a pointer coordinate,
  // resolved by the FMG bridge in WorldMap.jsx. There is no keyboard-reachable
  // map target, so pressing Enter on a card can't place it. Rather than lie via
  // role="button"+aria-label "Drag X onto the map" (an action a keyboard user
  // can't take), the card now announces honest guidance into this live region.
  const [placementHint, setPlacementHint] = useState('');
  const setSelectedBurgId = useStore(s => s.setSelectedBurgId);
  // P136 / M-6 — hover on a palette card sets the QuickInspector
  // target so the worldbuilder peeks what they're about to drag.
  const setHover = useStore(s => s.setHoveredSettlementId);
  const clearHover = useStore(s => s.clearHoveredSettlementId);

  // Map settlementId → placed-at burgId so we can mark cards
  const placedSettlements = useMemo(() => {
    const set = new Set();
    for (const p of Object.values(placements || {})) {
      if (p?.settlementId) set.add(String(p.settlementId));
    }
    return set;
  }, [placements]);

  const filtered = useMemo(() => {
    if (!query.trim()) return saves;
    const q = query.trim().toLowerCase();
    return saves.filter(s => {
      const name = (s.name || s.settlement?.name || '').toLowerCase();
      return name.includes(q);
    });
  }, [saves, query]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div style={{
        padding: `${SP.sm}px ${SP.md}px`,
        background: CARD_HDR, borderBottom: `1px solid ${BORDER2}`,
      }}>
        <div style={{
          fontSize: FS.xs, fontWeight: 800, color: SECOND,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
        }}>
          {activeCampaign ? activeCampaign.name : 'All Settlements'}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={12} color={MUTED}
            style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
            aria-label="Search settlements"
            style={{
              width: '100%',
              padding: '6px 8px 6px 26px',
              border: `1px solid ${BORDER}`,
              borderRadius: R.sm,
              fontSize: FS.xs, fontFamily: sans,
              background: CARD,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* No-campaign prompt — placement needs an active campaign. This is an
          ACTIONABLE empty state (P1/P8): it carries a real first click here
          instead of pointing at the toolbar — a primary "Create a campaign"
          when none exist, "Select a campaign" when some do. It REUSES the ONE
          shared CampaignEmptyState recipe (RealmInspector / RealmDashboard),
          so "no campaign" looks the same on every surface. */}
      {!activeCampaign && (
        <div style={{ margin: SP.sm, marginBottom: 0 }}>
          <CampaignEmptyState
            lead="Start a campaign to place settlements"
            onCreateCampaign={onCreateCampaign}
            onSelectCampaign={onSelectCampaign}
            hasCampaigns={hasCampaigns}
          />
          <div style={{
            marginTop: SP.xs, padding: `0 ${SP.xs}px`,
            fontSize: FS.xs, color: BODY, fontFamily: sans, lineHeight: 1.5,
            textAlign: 'center',
          }}>
            A campaign holds your map and its living world. Only canon settlements drop onto the map.
          </div>
          {/* S2r re-home (C5): the premium one-click realm composer, subordinate
              to the Create/Select CTA above it. Self-gates on premium (a
              non-premium reach fires the pricing moment); lazy, so the composer
              never enters the palette chunk. isMobile is pinned false — the Realm
              is desktop-gated, so this sidebar never renders on a phone. */}
          <Suspense fallback={null}>
            <InstantWorldEntry isMobile={false} onNavigate={onNavigate} />
          </Suspense>
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: SP.sm }}>
        {!filtered.length ? (
          saves.length === 0 ? (
            // Actionable no-settlements empty state: the hint keeps naming the
            // Create tab, and the CTA IS the first click (guarded — the palette
            // renders without onNavigate in isolated/test mounts).
            <div style={{
              display: 'grid', gap: SP.sm, justifyItems: 'center', textAlign: 'center',
              padding: SP.md,
            }}>
              <MapPin size={20} color={MUTED} />
              <div style={{ fontSize: FS.xs, color: SECOND, fontFamily: sans, lineHeight: 1.5 }}>
                No settlements yet. Generate one on the Create tab.
              </div>
              {typeof onNavigate === 'function' && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<PlusCircle size={13} />}
                  onClick={() => onNavigate('create')}
                >
                  Generate a settlement
                </Button>
              )}
            </div>
          ) : (
            <div style={{
              padding: SP.md, textAlign: 'center',
              fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
            }}>
              No matches.
            </div>
          )
        ) : (
          filtered.map(save => (
            <SettlementCard
              key={save.id}
              save={save}
              placed={placedSettlements.has(String(save.id))}
              onSelect={(name, isPlaced) => {
                setSelectedBurgId(null);
                setHover?.(save.id); // surface the QuickInspector peek
                setPlacementHint(
                  isPlaced
                    ? `${name} is already placed on the map.`
                    : `${name} selected. Drag its card onto the map with a mouse or touch to place it — keyboard placement isn't available for the map yet.`,
                );
              }}
              onHover={(hovering) => {
                if (hovering) setHover?.(save.id);
                else clearHover?.();
              }}
            />
          ))
        )}
      </div>

      {/* Footer hint — doubles as an aria-live region so a keyboard user who
          selects a card (Enter/Space) hears honest placement guidance instead
          of a silently-inert "button". */}
      <div
        aria-live="polite"
        style={{
          padding: `${SP.xs}px ${SP.md}px`,
          borderTop: `1px solid ${BORDER2}`,
          fontSize: FS.xxs, color: MUTED, fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        {placementHint || 'Drag a card onto the map to place it.'}
      </div>
    </div>
  );
}

// P136 / M-2 — Enriched palette. The card surfaces tier + pop + threat
// + stress so a worldbuilder choosing where to place a settlement sees
// the relevant facts without opening the dossier.
//
// Threat label + colors come from the shared threatDisplay helper, the SAME
// source DossierHeaderRow reads, so a settlement can never read as one threat
// here and another in its dossier (P2).

function SettlementCard({ save, placed, onSelect, onHover }) {
  const settlement = save.settlement || {};
  const name = save.name || settlement.name || 'Untitled';
  const tier = save.tier || settlement.tier || EMPTY_VALUE;
  const pop  = settlement.population || 0;
  const threat = settlement.config?.monsterThreat;
  // 'frontier' is the calm baseline both surfaces suppress; threatDisplay
  // returns its tones but the pill below self-gates on threat !== 'frontier'.
  const threatTone = threatDisplay(threat);
  // Stress can be an array (stressors[]) or a single object — both
  // shapes surface a label.
  const stressLabel = (() => {
    const stressors = settlement.stressors;
    if (Array.isArray(stressors) && stressors.length > 0) {
      return stressors[0].label || stressors[0].type || null;
    }
    const stress = settlement.stress;
    if (Array.isArray(stress) && stress.length > 0) {
      return stress[0].label || stress[0].type || null;
    }
    if (stress && typeof stress === 'object') {
      return stress.label || stress.type || null;
    }
    return null;
  })();

  function handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/settlementforge', JSON.stringify({
      id: save.id,
      name,
      population: pop,
      tier,
    }));
  }

  // F28 — Enter/Space is a REAL action now: it selects the settlement (drives
  // the QuickInspector peek) and announces honest placement guidance via the
  // palette's aria-live footer. Placement itself remains a pointer drag (the
  // map is an untabbable iframe), so the aria-label no longer commands a
  // keyboard-impossible "Drag … onto the map".
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault(); // Space would otherwise scroll the list
      onSelect?.(name, placed);
    }
  }

  return (
    <div
      draggable
      role="button"
      tabIndex={0}
      aria-label={placed
        ? `${name}, already placed on the map`
        : `${name}, ${tier}. Press Enter for placement options.`}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: SP.xs,
        padding: `${SP.xs}px ${SP.sm}px`,
        marginBottom: 4,
        background: placed ? GOLD_BG : CARD,
        border: `1px solid ${placed ? GOLD : BORDER}`,
        borderRadius: R.sm,
        cursor: 'grab',
        opacity: placed ? 0.75 : 1,
        fontSize: FS.sm, fontFamily: sans, color: INK,
        transition: 'background 0.12s, transform 0.08s',
      }}
      onMouseDown={e => (e.currentTarget.style.cursor = 'grabbing')}
      onMouseUp={e => (e.currentTarget.style.cursor = 'grab')}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onFocus={() => onHover?.(true)}
      onBlur={() => onHover?.(false)}
    >
      <GripVertical size={12} color={MUTED} style={{ marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <div style={{
            fontWeight: 700, fontSize: FS.sm,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            flex: 1, minWidth: 0,
          }}>
            {name}
          </div>
          {placed && (
            <MapPin size={11} color={GOLD} title="Placed on map" />
          )}
        </div>
        <div style={{ fontSize: FS.xxs, color: SECOND, marginTop: 1 }}>
          {tier} · {formatCount(pop)}
        </div>
        {(threat || stressLabel) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            marginTop: 3, flexWrap: 'wrap',
          }}>
            {threatTone && threat !== 'frontier' && (
              <span style={{
                // Fill/border use the lighter hue; the LABEL uses the audited
                // -text step so the word clears 4.5:1 on the card (P7) — the
                // embattled pill previously rendered its text at 3.43:1.
                fontSize: FS.xxs, fontWeight: 800,
                color: threatTone.text,
                background: `${threatTone.fill}1A`,
                border: `1px solid ${threatTone.fill}55`,
                borderRadius: 3, padding: '1px 5px',
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {threatTone.label}
              </span>
            )}
            {stressLabel && (
              <span
                title={`Active stressor: ${stressLabel}`}
                style={{
                  fontSize: FS.xxs, fontWeight: 700,
                  color: swatch['#8A5A20'],
                  background: 'rgba(196,128,60,0.10)',
                  border: '1px solid rgba(196,128,60,0.30)',
                  borderRadius: 3, padding: '1px 5px',
                  maxWidth: 110, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                ⚠ {stressLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
