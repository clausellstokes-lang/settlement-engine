/**
 * AssignDeityFromMap — the ONE steering action in UX Phase 5: awaken religion /
 * assign a settlement's primary deity directly from the Realm (plan §4.5, decision
 * 7 — assign-deity is the clean intervention; the others are a documented follow-up).
 *
 * It reuses the existing, undo-clean machinery end to end:
 *   1. The DM picks a campaign settlement → `hydrateFromSave` loads it into the
 *      live detail slot (state.settlement + activeSaveId).
 *   2. The existing <PrimaryDeityPicker> renders, and its `setPrimaryDeity` dispatches
 *      the SET_PRIMARY_DEITY canon event through applyEvent (registry + undo stack).
 *
 * No new event, no new mutation path — exactly the plan's "its event is already
 * plumbed + undo-clean" requirement. The other steering interventions (Declare War
 * / Force Siege / Trigger Trade War / Sue for Peace) are a documented follow-up,
 * surfaced here as a clearly-disabled "coming soon" affordance (never half-wired).
 *
 * Premium-gated by canManageCampaigns at the Realm level; PrimaryDeityPicker adds
 * its own canUseCustomContent gate + zero-authored-deities explainer.
 */

import { useMemo } from 'react';
import { Sun, Swords, Lock } from 'lucide-react';

import { useStore } from '../../store/index.js';
import PrimaryDeityPicker from '../settlement/PrimaryDeityPicker.jsx';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, R, SP, SECOND, sans } from '../theme.js';

// The documented FOLLOW-UP steering interventions — surfaced as disabled chips so
// the DM knows they're coming, never as half-wired controls (plan decision 7).
const COMING_SOON = ['Declare War', 'Force Siege', 'Trigger Trade War', 'Sue for Peace'];

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
          Add canon settlements to this campaign to assign a primary deity.
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
                width: '100%', padding: '8px 10px', minHeight: 36, border: `1px solid ${BORDER}`, borderRadius: R.sm,
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
            // The existing picker — dispatches SET_PRIMARY_DEITY (undo-clean).
            <PrimaryDeityPicker />
          ) : (
            <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, lineHeight: 1.5 }}>
              Pick a settlement above to assign or change its primary deity.
            </div>
          )}
        </>
      )}

      {/* ── Documented follow-up: the other steering interventions ────────── */}
      <div style={{
        border: `1px dashed ${BORDER2}`, borderRadius: R.md, background: CARD_ALT, padding: SP.sm,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 850 }}>
          <Swords size={12} /> War &amp; diplomacy steering
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 3, color: MUTED }}>
            <Lock size={10} /> Coming soon
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {COMING_SOON.map(label => (
            <span
              key={label}
              aria-disabled="true"
              title="Read-only Realm. War and diplomacy steering is a documented follow-up"
              style={{
                padding: '3px 8px', border: `1px solid ${BORDER2}`, borderRadius: R.sm,
                background: CARD, color: MUTED, fontFamily: sans, fontSize: FS.micro, fontWeight: 800,
                opacity: 0.65, cursor: 'not-allowed',
              }}
            >
              {label}
            </span>
          ))}
        </div>
        <p style={{ margin: '6px 0 0', color: BODY, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.4 }}>
          The Realm is read-only first. War and diplomacy steering arrives in a
          later pass, fully undoable.
        </p>
      </div>
    </div>
  );
}
