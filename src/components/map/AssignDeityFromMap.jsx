/**
 * AssignDeityFromMap — the ONE steering action in UX Phase 5: awaken religion /
 * assign a settlement's primary deity directly from the Realm (plan §4.5, decision
 * 7 — assign-deity is the clean intervention; the others are a documented follow-up).
 *
 * It reuses the existing, undo-clean machinery end to end:
 *   1. The DM picks a campaign settlement → `hydrateFromSave` loads it into the
 *      live detail slot (state.settlement + activeSaveId).
 *   2. The existing <DeityAssignmentPanel> renders (the W-C4 patron/cult picker),
 *      and its `setPrimaryDeity` / `imposeCult` dispatch the SET_PRIMARY_DEITY /
 *      IMPOSE_CULT canon events through applyEvent (registry + undo stack).
 *
 * No new event, no new mutation path — exactly the plan's "its event is already
 * plumbed + undo-clean" requirement. The other steering interventions (Declare War
 * / Force Siege / Trigger Trade War / Sue for Peace) are a documented follow-up,
 * surfaced here as a clearly-disabled "coming soon" affordance (never half-wired).
 *
 * Premium-gated by canManageCampaigns at the Realm level; DeityAssignmentPanel adds
 * its own canUseCustomContent gate (premium write picker / lapsed read-only / free
 * upsell that names no deity), and never reveals a latent seed to a free viewer.
 */

import { useMemo } from 'react';
import { Sun, Swords, ArrowRight } from 'lucide-react';

import { useStore } from '../../store/index.js';
import DeityAssignmentPanel from '../settlement/DeityAssignmentPanel.jsx';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, SP, SECOND, sans } from '../theme.js';

// components-map-4: the war/diplomacy steering verbs SHIPPED with W-COMPOSER-2 —
// they now live in Realm Orders (the World Pulse composer). This surface points
// the DM there instead of the stale "coming soon" that outlived the wave.
const NOW_IN_ORDERS = ['Declare War', 'Force Siege', 'Trigger Trade War', 'Sue for Peace'];

/**
 * @param {Object} props
 * @param {any} props.campaign  the active campaign (settlementIds)
 */
export default function AssignDeityFromMap({ campaign }) {
  const saves = useStore(s => s.savedSettlements);
  const activeSaveId = useStore(s => s.activeSaveId);
  const hydrateFromSave = useStore(s => s.hydrateFromSave);

  // The campaign's member settlements — the only ones a Realm DM can steer.
  const members = useMemo(() => {
    const ids = new Set((campaign?.settlementIds || []).map(String));
    return (saves || [])
      .filter(sv => ids.has(String(sv.id)))
      .map(sv => ({ id: sv.id, name: sv.name || sv.settlement?.name || 'Settlement', save: sv }));
  }, [saves, campaign]);

  if (!campaign) return null;

  const selected = members.find(m => String(m.id) === String(activeSaveId)) || null;

  return (
    <div data-testid="assign-deity-from-map" style={{ display: 'grid', gap: SP.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Sun size={14} color={GOLD} />
        <h4 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Steer the Realm
        </h4>
      </div>

      {members.length === 0 ? (
        <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, lineHeight: 1.5 }}>
          Add canon settlements to this campaign to assign a patron deity.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gap: 4 }}>
            <span style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>
              Settlement
            </span>
            <select
              aria-label="Settlement to assign a deity"
              value={selected ? String(selected.id) : ''}
              onChange={(e) => {
                const m = members.find(x => String(x.id) === e.target.value);
                if (m) hydrateFromSave(m.save);
              }}
              style={{
                width: '100%', padding: '8px 10px', minHeight: 36, border: `1px solid ${BORDER}`,
                fontSize: FS.sm, fontFamily: sans, color: INK, outline: 'none', background: CARD,
              }}
            >
              <option value="">Select a settlement…</option>
              {members.map(m => (
                <option key={m.id} value={String(m.id)}>{m.name}</option>
              ))}
            </select>
          </div>

          {selected ? (
            // The existing W-C4 picker — reads the live settlement slot, dispatches
            // SET_PRIMARY_DEITY / IMPOSE_CULT (undo-clean) with its own tier gate.
            <DeityAssignmentPanel />
          ) : (
            <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, lineHeight: 1.5 }}>
              Pick a settlement above to assign or change its patron deity.
            </div>
          )}
        </>
      )}

      {/* ── War & diplomacy steering: SHIPPED — now in Realm Orders ────────── */}
      <div style={{
        border: `1px solid ${BORDER2}`, background: CARD_ALT, padding: SP.sm,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 850 }}>
          <Swords size={12} /> War &amp; diplomacy steering
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 3, color: GOLD }}>
            Now in Realm Orders <ArrowRight size={11} />
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {NOW_IN_ORDERS.map(label => (
            <span
              key={label}
              title="Available in Realm Orders (the World Pulse composer). Staged, previewed, and undoable."
              style={{
                padding: '3px 8px', border: `1px solid ${BORDER2}`,
                background: CARD, color: INK, fontFamily: sans, fontSize: FS.micro, fontWeight: 800,
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <p style={{ margin: '6px 0 0', color: BODY, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.4 }}>
          These orders now live in <strong>Realm Orders</strong>, in the World Pulse panel.
          Each one staged, previewed against the forecast, and fully undoable before it lands.
        </p>
      </div>
    </div>
  );
}
