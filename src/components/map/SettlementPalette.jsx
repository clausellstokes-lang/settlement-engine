/**
 * SettlementPalette — left sidebar showing the available settlements that
 * can be dragged onto the map. Each card is a draggable element with the
 * settlement's id/name/population encoded in its dataTransfer payload.
 *
 * Placed settlements show a "placed" badge and are visually muted.
 */

import { useMemo, useState } from 'react';
import { MapPin, Search, GripVertical, FolderOpen, PlusCircle } from 'lucide-react';
import { useStore } from '../../store';
import Button from '../primitives/Button.jsx';
import { GOLD, GOLD_BG, INK, BODY, MUTED, SECOND, BORDER, CARD, CARD_HDR, sans, FS, SP, R, swatch } from '../theme.js';
import { threatDisplay } from './settlementThreat.js';

export default function SettlementPalette({
  saves = [], placements = {}, activeCampaign, onNavigate,
  onCreateCampaign, onSelectCampaign, hasCampaigns = false,
}) {
  const [query, setQuery] = useState('');
  const setSelectedBurgId = useStore(s => s.setSelectedBurgId);
  // Hover on a palette card sets the QuickInspector
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
      {/* Header — the CARD_HDR tint carries the chrome grouping; the internal
          hairline is dropped so the column isn't a stack of false-floor rules
          (P5). One outer frame (the Stage's SidebarShell) is the only elevation. */}
      <div style={{
        padding: `${SP.sm}px ${SP.md}px`,
        background: CARD_HDR,
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
          ACTIONABLE empty state, so it carries a real first-click here instead
          of pointing at the toolbar (P1/P8/P10): a primary "Create a campaign"
          when none exist, a "Select a campaign" when some do. The gold TINT +
          icon carry the call-out in two channels without a third nested frame —
          matching the borderless "No settlements yet" state below (P5). */}
      {!activeCampaign && (
        <div style={{
          margin: SP.sm,
          display: 'grid', gap: SP.sm, justifyItems: 'center', textAlign: 'center',
          padding: SP.md,
          borderRadius: R.md, background: GOLD_BG,
        }}>
          <FolderOpen size={20} color={GOLD} />
          <div style={{ fontSize: FS.sm, fontWeight: 800, color: INK, fontFamily: sans, lineHeight: 1.4 }}>
            Start a campaign to place settlements
          </div>
          <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans, lineHeight: 1.5 }}>
            A campaign holds your map and its living world. Only canon settlements drop onto the map.
          </div>
          {hasCampaigns && typeof onSelectCampaign === 'function' ? (
            <Button variant="primary" size="sm" icon={<FolderOpen size={13} />} onClick={onSelectCampaign}>
              Select a campaign
            </Button>
          ) : typeof onCreateCampaign === 'function' ? (
            <Button variant="primary" size="sm" icon={<PlusCircle size={13} />} onClick={onCreateCampaign}>
              Create a campaign
            </Button>
          ) : null}
        </div>
      )}

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: SP.sm }}>
        {!filtered.length ? (
          saves.length === 0 ? (
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
              fontSize: FS.xs, color: BODY, fontStyle: 'italic',
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
              onClick={() => setSelectedBurgId(null)}
              onHover={(hovering) => {
                if (hovering) setHover?.(save.id);
                else clearHover?.();
              }}
            />
          ))
        )}
      </div>

      {/* Footer hint — separated by top padding only, not a borderTop rule: a
          bottom hairline read as a page-end that suppressed awareness of the
          scroll region above it (P5 false-floor). */}
      <div style={{
        padding: `${SP.sm}px ${SP.md}px ${SP.xs}px`,
        fontSize: FS.xs, color: BODY, fontStyle: 'italic',
        textAlign: 'center',
      }}>
        Drag a card onto the map to place it.
      </div>
    </div>
  );
}

// Enriched palette. The card surfaces tier + pop + threat
// + stress so a worldbuilder choosing where to place a settlement sees
// the relevant facts without opening the dossier.
//
// Threat label + colors come from the shared threatDisplay helper, the SAME
// source DossierHeaderRow reads, so a settlement can never read as one threat
// here and another in its dossier (P2).

function SettlementCard({ save, placed, onHover }) {
  const settlement = save.settlement || {};
  const name = save.name || settlement.name || 'Untitled';
  // En-dash placeholder for a missing tier — the app's standard "intentional
  // absence" mark — rather than the stray ', ' that read as a render bug (P11).
  const tier = save.tier || settlement.tier || '–';
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

  return (
    // Not role="button": placement is a mouse drag with no keyboard equivalent
    // here, so announcing a button would be a false affordance (WCAG 2.1.1). The
    // card stays focusable so keyboard users still get the hover-peek (onFocus),
    // and the label describes what focus does rather than promising a gesture.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- draggable peek source: drag is a mouse gesture with no keyboard placement path on this surface, so no button role is claimed
    <div
      draggable
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable so keyboard users still trigger the onFocus hover-peek; not announced as interactive
      tabIndex={0}
      aria-label={`${name}. Drag onto the map to place it.`}
      onDragStart={handleDragStart}
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
        <div style={{ fontSize: FS.xs, color: BODY, marginTop: 1 }}>
          {tier} · {pop.toLocaleString()}
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
                fontSize: FS.xs, fontWeight: 800,
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
                  // Fill/border are derived from the same amber stress swatch the
                  // label uses, with 1A/55 alpha suffixes — the same recipe the
                  // threat pill above builds from threatTone.fill (no raw rgba).
                  fontSize: FS.xs, fontWeight: 700,
                  color: swatch['#8A5A20'],
                  background: `${swatch['#8A5A20']}1A`,
                  border: `1px solid ${swatch['#8A5A20']}55`,
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
