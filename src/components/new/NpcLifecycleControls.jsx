import { FS, MUTED, swatch } from '../theme.js';
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
  borderRadius: 4,
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

  return (
    <div style={{ marginTop: 6, padding: '6px 8px', background: swatch['#F5F0E8'], borderRadius: 4 }}>
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
    </div>
  );
}
