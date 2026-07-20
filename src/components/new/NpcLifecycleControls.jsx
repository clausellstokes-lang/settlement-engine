import { FS, MUTED, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { useStore } from '../../store/index.js';
import {
  NPC_ALIGNMENTS, NPC_TEMPERAMENTS, NPC_ROLE_ARCHETYPES, NPC_GOALS, npcFacetOf,
} from '../../domain/npc/npcBank.js';
import { STASIS_REASONS } from '../../domain/npc/npcOps.js';

/**
 * NpcLifecycleControls — DESIGN_NPC_LIFECYCLE §2 edit surface (the DM's NPC editor).
 *
 * The bank-bounded lifecycle controls for one NPC: four facet dropdowns (alignment /
 * temperament / role / goal) whose options come ONLY from THE BANK (free-text is
 * structurally impossible), plus the stasis shelf (a typed reason + return). Every
 * change goes through the standing covenant — queueEdit(kind, payload) — so it lands
 * in the pending-changes bar for preview/commit like every other edit. Rendered only
 * in editMode (the parent card gates it); resolves the NPC's live index at change
 * time so the op targets the right entity even if the roster was re-sorted.
 */

const FACETS = [
  { kind: 'alignment', label: 'Alignment', vocab: NPC_ALIGNMENTS },
  { kind: 'temperament', label: 'Temperament', vocab: NPC_TEMPERAMENTS },
  { kind: 'role', label: 'Role', vocab: NPC_ROLE_ARCHETYPES },
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

export default function NpcLifecycleControls({ npc, resolveNpcIndex }) {
  const queueEdit = useStore(s => s.queueEdit);
  const inStasis = !!(npc && npc.stasis);
  const stasisReason = inStasis ? npc.stasis.reason : '';

  const onFacet = (kind) => (e) => {
    const value = e.target.value;
    if (!value) return;
    const npcIndex = resolveNpcIndex();
    if (npcIndex >= 0) queueEdit('edit-npc', { npcIndex, facetKind: kind, value });
  };

  const onStasis = (e) => {
    const value = e.target.value;
    const npcIndex = resolveNpcIndex();
    if (npcIndex < 0) return;
    if (value === '') queueEdit('return-npc', { npcIndex });
    else queueEdit('stasis-npc', { npcIndex, reason: value });
  };

  // DESIGN_THE_ROADS §11 — THE PARTY'S HAND. When this NPC is a roads HOSTAGE, the DM may
  // intervene on the party's behalf: pay the ransom (the captor still profits, but the home
  // treasury is spared) or stage a rescue (no coin, but the captor is left the poorer and
  // angrier). Both queue through the standing covenant; the mover realises the release on its
  // next tick. Absent for any non-hostage.
  const isHostage = npc?.whereabouts?.state === 'hostage';
  const onParty = (kind) => () => {
    const npcIndex = resolveNpcIndex();
    if (npcIndex >= 0) queueEdit(kind, { npcIndex });
  };

  return (
    <div style={{ marginTop: 6, padding: '6px 8px', background: swatch['#F5F0E8']}}>
      <div style={{ fontSize: FS.micro, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
        Edit (bank) — queues a reviewable change
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {FACETS.map(({ kind, label, vocab }) => (
          <div key={kind} style={{ fontSize: FS.micro, color: MUTED, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {label}
            <select
              aria-label={`Set ${label.toLowerCase()} for ${npc?.name || 'NPC'}`}
              value={vocab.includes(npcFacetOf(npc, kind)) ? npcFacetOf(npc, kind) : ''}
              onChange={onFacet(kind)}
              style={selectStyle}
            >
              <option value="">—</option>
              {vocab.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        ))}
        <div style={{ fontSize: FS.micro, color: MUTED, display: 'flex', flexDirection: 'column', gap: 2 }}>
          Stasis
          <select
            aria-label={`Stasis state for ${npc?.name || 'NPC'}`}
            value={stasisReason}
            onChange={onStasis}
            style={selectStyle}
          >
            <option value="">active</option>
            {STASIS_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>
      {isHostage && (
        <div style={{ marginTop: 8, paddingTop: 6, borderTop: `1px solid ${swatch['#EDE3CC']}` }}>
          <div style={{ fontSize: FS.micro, fontWeight: 700, color: swatch.danger, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
            The party&apos;s hand — {npc?.name || 'this captive'} is held
          </div>
          {/* GUIDANCE WHISPER (§11 covenant): the two moves and their consequences, at the op. */}
          <p style={{ fontSize: FS.micro, color: MUTED, margin: '0 0 6px', lineHeight: 1.4 }}>
            Pay the ransom to buy them home — the captor still profits, but the home treasury is
            spared. Or stage a rescue: no coin, and the captive returns clean of any turned
            loyalty, but the captor keeps a grudge. The move settles on the next advance; it
            queues for review like any edit.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={onParty('ransom-npc')}
              aria-label={`Pay the ransom to bring ${npc?.name || 'the captive'} home`}
            >
              Pay ransom
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={onParty('rescue-npc')}
              aria-label={`Stage a rescue of ${npc?.name || 'the captive'}`}
            >
              Rescue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
