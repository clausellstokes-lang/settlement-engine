/**
 * WorkbenchFactionRename — THE FACTION-RENAME DOOR (owner queue #14).
 *
 * The atlas recorded the gap plainly: a generated settlement had no working
 * faction-rename affordance anywhere. The cured store action had zero callers,
 * and the one exposed surface rendered a list that is empty on pipeline data.
 * This is the door, mounted where a reader is already looking at the faction:
 * the Entity Inspector.
 *
 * It writes nothing itself. The rename rides the SAME staged-change spine every
 * other authored edit uses — queueEdit('rename-faction') → review in the Change
 * Dock → commit through the converged renameFactionImpl writer → snapshot undo.
 * That is what makes the cascade honest: one writer, one review surface, one
 * receipt.
 *
 * PREMIUM GATE. This leaf is only mounted by SettlementWorkbench when
 * `readOnly` is false, and SettlementWorkbenchMount computes that from the ONE
 * shared predicate `viewerCanAuthor` (src/lib/viewerAuthority.js). Free and
 * anonymous viewers get the read-only inspector with no rename control, the
 * same way the prose editor and the NPC authoring button close.
 */

import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { nameOf } from '../../domain/rulingPower.js';
import Button from '../primitives/Button.jsx';
import { BORDER, FS, SP, swatch, serif_ } from '../theme.js';

const MUTED = swatch.inkMag3;

/**
 * Resolve the faction's position in the CANONICAL roster the writer addresses.
 * Reference identity first (the inspector entry was built from this same live
 * settlement); a unique name match is the only fallback, and an ambiguous or
 * missing match refuses rather than guessing which faction to rename.
 *
 * @param {any} settlement
 * @param {{ raw?: any, currentName?: string, label?: string }} entry
 * @returns {number | null}
 */
export function resolveFactionIndex(settlement, entry) {
  const list = settlement?.powerStructure?.factions;
  if (!Array.isArray(list)) return null;
  const byRef = list.indexOf(entry?.raw);
  if (byRef >= 0) return byRef;
  const wanted = String(entry?.currentName || entry?.label || '').trim().toLowerCase();
  if (!wanted) return null;
  const matches = list
    .map((candidate, index) => ({ candidate, index }))
    .filter(({ candidate }) => nameOf(candidate).toLowerCase() === wanted);
  return matches.length === 1 ? matches[0].index : null;
}

export default function WorkbenchFactionRename({ entry }) {
  const settlement = useStore(state => state.settlement);
  const queueEdit = useStore(state => state.queueEdit);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [note, setNote] = useState(null);

  if (!settlement) return null;
  const factionIndex = resolveFactionIndex(settlement, entry);
  const currentName = factionIndex == null
    ? ''
    : nameOf(settlement.powerStructure?.factions?.[factionIndex]);

  const beginRename = () => {
    setDraft(currentName);
    setNote(null);
    setOpen(true);
  };

  const queueRename = async () => {
    if (typeof queueEdit !== 'function' || factionIndex == null) return;
    const intent = await queueEdit('rename-faction', { factionIndex, newName: draft });
    if (intent) {
      setOpen(false);
      setNote({ tone: 'ok', text: 'Queued for review. Commit it from the Change Dock.' });
    } else {
      setNote({
        tone: 'warn',
        // One string, and it names every reason the queue can refuse this kind:
        // empty or unchanged name, canon identity lock, world mid-advance.
        text: 'Not queued. The name may be empty or unchanged, this settlement may be canonized, or the world may be mid-advance.',
      });
    }
  };

  return (
    <section aria-labelledby="workbench-faction-rename">
      <h3
        id="workbench-faction-rename"
        style={{ margin: '0 0 5px', fontFamily: serif_, fontSize: FS.lg }}
      >
        Name
      </h3>
      {factionIndex == null ? (
        <p role="note" style={{ margin: 0, color: MUTED, fontSize: FS.xxs, lineHeight: 1.45 }}>
          This faction cannot be uniquely matched to the live settlement, so
          renaming is disabled rather than guessing.
        </p>
      ) : (
        <>
          <p style={{ margin: '0 0 7px', color: MUTED, fontSize: FS.xxs, lineHeight: 1.45 }}>
            A new name is staged for review first. When you commit it, it carries
            through the roster, the governing seat, every member and every
            neighbouring settlement that names this faction.
          </p>
          {!open && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, flexWrap: 'wrap' }}>
              <span style={{ fontSize: FS.sm, fontWeight: 700, color: swatch.inkMag }}>
                {currentName}
              </span>
              <Button variant="ghost" size="sm" onClick={beginRename}>
                Rename this faction
              </Button>
            </div>
          )}
          {open && (
            <div>
              <input
                aria-label="New faction name"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  fontSize: FS.sm,
                  minHeight: 40,
                  padding: 6,
                  border: `1px solid ${BORDER}`,
                }}
              />
              <div style={{ display: 'flex', gap: SP.sm, marginTop: 4 }}>
                <Button variant="primary" size="sm" onClick={queueRename}>
                  Queue this name
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {note && (
        <p
          role={note.tone === 'warn' ? 'alert' : 'status'}
          style={{
            margin: '4px 0 0',
            color: note.tone === 'warn' ? swatch.danger : swatch.success,
            fontSize: FS.xxs,
            lineHeight: 1.45,
          }}
        >
          {note.text}
        </p>
      )}
    </section>
  );
}
