/**
 * PendingChangesBar.jsx — pending-changes floating drawer.
 *
 * Renders below the dossier title whenever the current save/draft namespace has
 * unapplied edits in `pendingEditsQueue`. Lists count + categories, with four
 * exact-scope actions:
 *   - Preview cascade → opens the side panel showing structured deltas
 *   - Review again    → refreshes retained stale/failed work before retry
 *   - Commit          → applies only the visible intent ids
 *   - Discard         → removes only the visible staged intents
 *
 * Self-gates inside on `flag('inlineEdit')` and `hasPending(queue)`.
 *
 * Visual: amber-accented banner-card, full-width inside dossier
 * gutter, max ~48px tall. Matches the EditorInline mockup from the
 * Editing & Map canvas.
 */

import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { flag } from '../../lib/flags.js';
import { hasPending, activeEdits } from '../../domain/pendingEdits.js';
import {
  pendingEditOwnerScope,
  selectPendingEditOwnerScope,
} from '../../domain/pendingEditIntents.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { sans, FS, SP, swatch } from '../theme.js';
import CascadePreviewPanel from './CascadePreviewPanel.jsx';
import Button from '../primitives/Button.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';

const AMBER = swatch['#D08020'];
const AMBER_BG = swatch['#FBEAD0'];
const INK = swatch['#1B1408'];

function npcName(settlement, payload) {
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  if (payload?.npcId != null) {
    const byId = npcs.find((npc) => String(npc?.id) === String(payload.npcId));
    if (byId?.name) return byId.name;
  }
  // Legacy previews may still contain an index-only primitive. New queue
  // envelopes retain only npcId, so reordering cannot mislabel reviewed work.
  const index = Number(payload?.npcIndex);
  const byIndex = Number.isInteger(index) ? npcs[index] : null;
  if (byIndex?.name) return byIndex.name;
  return 'NPC';
}

function words(value) {
  return String(value || '').replace(/[_-]+/g, ' ').trim();
}

/** Turn internal edit operations into table-facing language. */
export function describePendingEdit(edit, settlement) {
  const name = npcName(settlement, edit?.payload);
  switch (edit?.kind) {
    case 'rename-npc':         return `renamed ${edit.payload?.newName || name}`;
    case 'rename-faction':     return `renamed ${edit.payload?.newName || 'faction'}`;
    case 'rename-settlement':  return 'renamed settlement';
    case 'add-institution':    return `added ${edit.payload?.label || 'institution'}`;
    case 'remove-institution': return `removed ${edit.payload?.label || 'institution'}`;
    case 'add-resource':       return 'added resource';
    case 'remove-resource':    return 'removed resource';
    case 'add-stressor':       return 'added stressor';
    case 'remove-stressor':    return 'removed stressor';
    case 'edit-prose':         return 'edited prose';
    case 'edit-npc':           return `changed ${name}'s ${words(edit.payload?.facetKind) || 'details'}`;
    case 'reassign-npc':       return `reassigned ${name}`;
    case 'stasis-npc':         return `set ${name} aside (${words(edit.payload?.reason) || 'stasis'})`;
    case 'return-npc':         return `returned ${name} to active duty`;
    case 'ransom-npc':         return `authorized ransom for ${name}`;
    case 'rescue-npc':         return `planned rescue for ${name}`;
    case 'champion-npc':       return `backed ${name}`;
    case 'recall-npc':         return `recalled ${name}`;
    case 'table-event':        return 'recorded a table event';
    default:                   return 'queued dossier change';
  }
}

export default function PendingChangesBar() {
  const enabled = flag('inlineEdit');
  const queue = useStore(s => s.pendingEditsQueue || []);
  const ownerKey = useStore(s => pendingEditOwnerScope(s).ownerKey);
  const settlement = useStore(s => s.settlement);
  const commit = useStore(s => s.commitPendingEdits);
  const revert = useStore(s => s.revertPendingEdits);
  const refresh = useStore(s => s.refreshPendingEdits);
  // Per-edit removal. `queueEdit`'s registry row has always advertised "the edit
  // can be reverted on its own" through revertSingleEdit; until this list there
  // was no surface for it, so Discard-everything was the only way out of one
  // mistyped change. Both review mounts get it at once: the Workbench Change Dock
  // renders this same component.
  const revertOne = useStore(s => s.revertSingleEdit);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [resultNote, setResultNote] = useState('');
  // Staging and committing changes is a heavy-authoring write surface; the
  // locked mobile policy keeps it on desktop (mobile writes = rename + save).
  // On a narrow viewport we still surface the unsaved-count read so the user
  // knows a desktop session is mid-edit, but withhold the Commit/Revert/Preview
  // actions behind a calm note rather than rendering four write buttons inline.
  const mobile = useIsMobile();
  const scopedQueue = selectPendingEditOwnerScope(queue, ownerKey);

  if (!enabled) return null;
  if (!hasPending(scopedQueue)) return null;

  const active = activeEdits(scopedQueue);
  const count = active.length;
  const failedCount = active.filter((intent) =>
    intent.status === 'failed' || intent.status === 'stale').length;
  const noun = count === 1 ? 'change' : 'changes';
  const intentIds = active.map((intent) => intent.id);
  const attentionIds = active
    .filter((intent) => intent.status === 'failed' || intent.status === 'stale')
    .map((intent) => intent.id);

  // Short categorical summary: "renamed Captain · added Tavern".
  // Pull the first 2-3 distinctive edits and label them.
  const summary = active.slice(0, 3)
    .map((edit) => describePendingEdit(edit, settlement))
    .join(' · ');

  const onCommit = async () => {
    Funnel.track(EVENTS.EDIT_COMMITTED, { count });
    if (typeof commit !== 'function') return;
    const result = await commit({ intentIds });
    if (result?.status === 'partial') {
      setResultNote(`${result.applied.length} applied; ${result.failed.length} still need attention.`);
    } else if (result?.status === 'failed') {
      setResultNote('Nothing was applied. The changes remain here for review.');
    } else {
      setResultNote('');
    }
  };
  const onDiscard = async () => {
    Funnel.track(EVENTS.EDIT_REVERTED, { count });
    if (typeof revert === 'function') await revert({ intentIds });
    setResultNote('');
  };
  const onRefresh = async () => {
    if (typeof refresh !== 'function') return;
    const result = await refresh({ intentIds: attentionIds });
    if (result?.status === 'refreshed') {
      setResultNote('Reviewed against the current world. Preview again, then commit.');
    } else if (result?.status === 'partial') {
      setResultNote(`${result.refreshed.length} reviewed; ${result.failed.length} still need attention.`);
    } else {
      setResultNote('These changes still cannot be applied. They remain here for review.');
    }
  };
  const onRemoveOne = (intent) => {
    // The action is owner-scoped and returns false when the intent is not held
    // for this dossier any more (another save took the namespace, or a sibling
    // surface already discarded it). Say so rather than leaving a dead click.
    const removed = typeof revertOne === 'function' && revertOne(intent.id) === true;
    setResultNote(removed
      ? ''
      : 'That change is no longer held for this dossier, so nothing was removed.');
  };
  const onPreview = () => {
    Funnel.track(EVENTS.EDIT_CASCADE_PREVIEWED, { count });
    setPreviewOpen(true);
  };

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        style={{
          margin: `${SP.sm}px auto`,
          maxWidth: 720,
          padding: `${SP.sm}px ${SP.md}px`,
          background: AMBER_BG,
          border: `1px solid ${AMBER}`,
          borderLeft: `3px solid ${AMBER}`,
          display: 'flex', alignItems: 'center', gap: SP.sm,
          fontFamily: sans, fontSize: FS.xs, color: INK,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 700, color: AMBER }}>
          {failedCount > 0
            ? `${failedCount} ${failedCount === 1 ? 'change needs' : 'changes need'} attention`
            : `${count} unsaved ${noun}`}
        </span>
        {/* The one-line summary is the MOBILE reading of the queue: the phone
            withholds the write actions, so a categorical sentence is all it can
            offer. On desktop the itemized list below says the same thing per
            change and carries each one's Remove, so the sentence would only
            repeat it; the spacer keeps the action cluster on the right edge. */}
        {mobile
          ? (summary && (
            <span style={{ color: swatch['#3A2F18'], flex: 1, minWidth: 0 }}>
              · {summary}
            </span>
          ))
          : <span aria-hidden="true" style={{ flex: 1, minWidth: 0 }} />}
        {mobile ? (
          <span style={{ flexBasis: '100%', color: swatch['#3A2F18'], fontSize: FS.xxs, lineHeight: 1.5 }}>
            Reviewing and saving these edits is best on a larger screen. Open this dossier on desktop to preview the cascade and commit.
          </span>
        ) : (
          <>
            {attentionIds.length > 0 && (
              <Button variant="secondary" size="sm" onClick={onRefresh}>
                Review again
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onPreview}>
              Preview cascade →
            </Button>
            <Button variant="primary" size="sm" onClick={onCommit}>
              Commit
            </Button>
            <Button variant="ghost" size="sm" onClick={onDiscard}>
              Discard
            </Button>
          </>
        )}
        {/* The itemized layer under the glance count: every staged change, each
            with its own removal. Scrolls inside its own box so a long queue never
            stretches the banner. Desktop only, matching the write-action policy
            above. */}
        {!mobile && (
          <ul style={{
            flexBasis: '100%', margin: 0, padding: 0, listStyle: 'none',
            maxHeight: 132, overflowY: 'auto',
          }}>
            {active.map((intent) => (
              <li
                key={intent.id}
                style={{ display: 'flex', alignItems: 'center', gap: SP.xs, padding: '2px 0' }}
              >
                <span style={{ flex: 1, minWidth: 0, color: swatch['#3A2F18'] }}>
                  {describePendingEdit(intent, settlement)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveOne(intent)}
                  aria-label={`Remove this change: ${describePendingEdit(intent, settlement)}`}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
        {resultNote && (
          <span role="alert" style={{ flexBasis: '100%', color: swatch.danger, lineHeight: 1.5 }}>
            {resultNote}
          </span>
        )}
      </div>

      {!mobile && previewOpen && (
        <CascadePreviewPanel
          onClose={() => setPreviewOpen(false)}
          onCommit={() => { setPreviewOpen(false); onCommit(); }}
        />
      )}
    </>
  );
}
