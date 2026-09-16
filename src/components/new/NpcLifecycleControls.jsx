import { FS, MUTED, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { useStore } from '../../store/index.js';
import {
  NPC_ALIGNMENTS, NPC_TEMPERAMENTS, NPC_ROLE_ARCHETYPES, NPC_GOALS, npcFacetOf,
} from '../../domain/npc/npcBank.js';
import { STASIS_REASONS } from '../../domain/npc/npcOps.js';
import useIsMobile from '../../hooks/useIsMobile.js';

/**
 * NpcLifecycleControls — bounded NPC editing and owner-only urgent actions.
 *
 * The bank-bounded lifecycle controls for one NPC: four facet dropdowns (alignment /
 * temperament / role / goal) whose options come ONLY from THE BANK (free-text is
 * structurally impossible), plus the stasis shelf (a typed reason + return). Every
 * change goes through the standing covenant — queueEdit(kind, payload) — so it lands
 * in the pending-changes bar for preview/commit like every other edit. Facet controls
 * are edit-mode only, while time-sensitive party decisions (hostage rescue/ransom and
 * traveller recall) remain available on the supported desktop owner view.
 * Every queued operation targets the NPC's durable id, so a roster reorder between
 * review and commit cannot redirect the change to another person.
 */

const FACETS = [
  { kind: 'alignment', label: 'Alignment', vocab: NPC_ALIGNMENTS },
  { kind: 'temperament', label: 'Temperament', vocab: NPC_TEMPERAMENTS },
  // This bounded value is an archetype facet, not the NPC's authored office/title
  // (for example, "Harbourmistress"). Name it honestly and leave the richer
  // native role intact.
  { kind: 'role', label: 'Role archetype', vocab: NPC_ROLE_ARCHETYPES },
  { kind: 'goal', label: 'Goal', vocab: NPC_GOALS },
];

const selectStyle = {
  fontSize: FS.xxs,
  color: swatch.inkMag2,
  background: swatch['#FAF8F4'],
  border: `1px solid ${swatch['#EDE3CC']}`,
  padding: '2px 4px',
  maxWidth: '100%',
};

const STASIS_LABELS = Object.freeze({
  journey: 'Away on a journey',
  imprisoned: 'Imprisoned',
  missing: 'Missing',
  sequestered: 'In seclusion',
});

export function humanizeNpcFacet(value) {
  const words = String(value || '').replace(/[_-]+/g, ' ').trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : '';
}

export function hasNpcLifecycleAction(npc) {
  const state = npc?.whereabouts?.state;
  return state === 'hostage' || state === 'traveling' || state === 'visiting';
}

/**
 * @param {{
 *   npc: object,
 *   canAuthorNpc?: boolean,
 *   showEditor?: boolean,
 * }} props
 */
export default function NpcLifecycleControls({
  npc,
  canAuthorNpc = false,
  showEditor = true,
}) {
  const queueEdit = useStore(s => s.queueEdit);
  const mobile = useIsMobile();
  const rawNpcId = npc?.id == null ? '' : String(npc.id).trim();
  const npcId = rawNpcId || null;
  const editingUnavailable = !canAuthorNpc || mobile || npcId == null;
  const inStasis = !!(npc && npc.stasis);
  const stasisReason = inStasis ? npc.stasis.reason : '';

  // This leaf is deliberately fail-closed. Its parent already hides the panel
  // from readers, but keeping the capability check here prevents a future
  // accidental direct mount from exposing queue-backed mutation controls.
  if (!canAuthorNpc) return null;

  const onFacet = (kind) => (e) => {
    // Mobile is deliberately read-mostly until the same device can review,
    // commit, discard, and recover a queued change. Guard at the enqueue seam
    // as well as disabling the control so a synthetic event cannot bypass it.
    // Legacy NPCs without a durable id are also read-only: an array index could
    // silently retarget the edit if the roster changes before commit.
    if (editingUnavailable) return;
    const value = e.target.value;
    if (!value) return;
    queueEdit('edit-npc', { npcId, facetKind: kind, value });
  };

  const onStasis = (e) => {
    if (editingUnavailable) return;
    const value = e.target.value;
    if (value === '') {
      queueEdit('return-npc', { npcId });
    } else {
      queueEdit('stasis-npc', { npcId, reason: value });
    }
  };

  // Hostage decisions remain available outside edit mode because they are
  // time-sensitive party actions. Both still enter the pending-edit queue, and
  // the simulation realizes the release on its next tick.
  const isHostage = npc?.whereabouts?.state === 'hostage';
  const onParty = (kind) => () => {
    if (editingUnavailable) return;
    queueEdit(kind, { npcId });
  };

  // A recall starts the return leg on the next tick; it never teleports the NPC.
  // Returning travellers are already homeward, so no second recall is offered.
  const isTraveling = npc?.whereabouts?.state === 'traveling'
    || npc?.whereabouts?.state === 'visiting';
  const onRecall = () => {
    if (editingUnavailable) return;
    queueEdit('recall-npc', { npcId });
  };

  return (
    <div style={{ marginTop: 6, padding: '6px 8px', background: swatch['#F5F0E8'] }}>
      {showEditor && (
        <>
          <div style={{
            fontSize: FS.micro,
            fontWeight: 700,
            color: MUTED,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 4,
          }}>
            NPC details · changes wait for review
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FACETS.map(({ kind, label, vocab }) => (
              <div
                key={kind}
                style={{
                  fontSize: FS.micro,
                  color: MUTED,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {label}
                <select
                  aria-label={`Set ${label.toLowerCase()} for ${npc?.name || 'NPC'}`}
                  value={vocab.includes(npcFacetOf(npc, kind)) ? npcFacetOf(npc, kind) : ''}
                  onChange={onFacet(kind)}
                  disabled={editingUnavailable}
                  style={selectStyle}
                >
                  <option value="">No change</option>
                  {vocab.map(value => (
                    <option key={value} value={value}>
                      {humanizeNpcFacet(value)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div style={{
              fontSize: FS.micro,
              color: MUTED,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
              Availability
              <select
                aria-label={`Availability for ${npc?.name || 'NPC'}`}
                value={stasisReason}
                onChange={onStasis}
                disabled={editingUnavailable}
                style={selectStyle}
              >
                <option value="">Active</option>
                {STASIS_REASONS.map(reason => (
                  <option key={reason} value={reason}>
                    {STASIS_LABELS[reason] || humanizeNpcFacet(reason)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
      {isHostage && (
        <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${swatch['#EDE3CC']}` }}>
          <div style={{
            fontSize: FS.micro,
            fontWeight: 700,
            color: swatch.danger,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 3,
          }}>
            The party&apos;s hand: {npc?.name || 'this captive'} is held
          </div>
          {/* Keep the consequences beside the decision that queues them. */}
          <p style={{ fontSize: FS.micro, color: MUTED, margin: '0 0 6px', lineHeight: 1.4 }}>
            Pay the ransom to buy them home. The captor still profits, but the home treasury is
            spared. Or stage a rescue: no coin, and the captive returns clean of any turned
            loyalty, but the captor keeps a grudge. The move settles on the next advance; it
            queues for review like any edit.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={onParty('ransom-npc')}
              disabled={editingUnavailable}
              aria-label={`Pay the ransom to bring ${npc?.name || 'the captive'} home`}
            >
              Pay ransom
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={onParty('rescue-npc')}
              disabled={editingUnavailable}
              aria-label={`Stage a rescue of ${npc?.name || 'the captive'}`}
            >
              Rescue
            </Button>
          </div>
        </div>
      )}
      {isTraveling && !isHostage && (
        <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${swatch['#EDE3CC']}` }}>
          <div style={{
            fontSize: FS.micro,
            fontWeight: 700,
            color: MUTED,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 3,
          }}>
            On the road: {npc?.name || 'this traveller'} is away
          </div>
          <p style={{ fontSize: FS.micro, color: MUTED, margin: '0 0 6px', lineHeight: 1.4 }}>
            Summon them home early. They turn for the road at once: no shortcut, only an
            earlier start; the journey back still takes its weeks. Queues for review like any edit.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRecall}
            disabled={editingUnavailable}
            aria-label={`Recall ${npc?.name || 'the traveller'} home early`}
          >
            Recall home
          </Button>
        </div>
      )}
      {mobile && (
        <p
          role="note"
          style={{ fontSize: FS.micro, color: MUTED, margin: '6px 0 0', lineHeight: 1.4 }}
        >
          NPC changes can be reviewed and applied from this dossier on desktop.
        </p>
      )}
      {!mobile && npcId == null && (
        <p
          role="note"
          style={{ fontSize: FS.micro, color: MUTED, margin: '6px 0 0', lineHeight: 1.4 }}
        >
          This legacy NPC has no stable identity, so changes are unavailable.
        </p>
      )}
    </div>
  );
}
