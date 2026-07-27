/**
 * WorkbenchProseEditor — the Entity Inspector's authoring panel (R-2, flag-off).
 *
 * Gives the 16 queue-wired EDITABLE_FIELDS prose paths their lever. Every edit
 * rides the ONE existing staged-change spine — queueEdit('edit-prose') →
 * review in the pending-changes bar → commit through the registered
 * applyUserEditAction writer → snapshot undo in the Change Dock. This panel
 * never writes domain state itself; the only direct store call is the
 * registered revertUserEditAction, the same revert the NPC secret card uses.
 *
 * The wired field list is pinned to QUEUE_WIRED_PROSE_PATHS (the queue refuses
 * anything else with a typed reason), so this surface cannot silently offer a
 * path whose lifecycle does not hold.
 */

import { useState } from 'react';
import { useStore } from '../../store/index.js';
import {
  getEffectiveValue,
  getOriginalValue,
  isEdited,
} from '../../domain/userEdits.js';
import Button from '../primitives/Button.jsx';
import { BORDER, FS, SP, swatch, serif_ } from '../theme.js';

const MUTED = swatch.inkMag3;

/**
 * Display labels for every queue-wired prose path, per entity kind. One string
 * each; kept in exact lockstep with QUEUE_WIRED_PROSE_PATHS by
 * tests/components/workbenchProseEditor.test.jsx.
 */
export const PROSE_FIELD_LABELS = Object.freeze({
  faction: Object.freeze([
    { path: 'desc', label: 'Description' },
  ]),
  institution: Object.freeze([
    { path: 'desc', label: 'Description' },
  ]),
  settlement: Object.freeze([
    { path: 'arrivalScene', label: 'Arrival scene' },
    { path: 'pressureSentence', label: 'Pressure summary' },
    { path: 'settlementReason', label: 'Origin note' },
    { path: 'prominentRelationship.phrasing', label: 'Prominent relationship' },
    { path: 'history.historicalCharacter', label: 'Historical character' },
    { path: 'history.founding.reason', label: 'Founding reason' },
    { path: 'history.founding.initialChallenge', label: 'Founding challenge' },
    { path: 'history.founding.overcoming', label: 'How the challenge was overcome' },
    { path: 'history.founding.stressNote', label: 'Founding stress note' },
    { path: 'history.founding.foundedBy', label: 'Founded by' },
    { path: 'economicViability.summary', label: 'Outlook summary' },
    { path: 'economicState.safetyProfile.safetyDesc', label: 'Safety, as first surveyed' },
    { path: 'economicState.safetyProfile.guardEffectivenessDesc', label: 'Guard effectiveness, as first surveyed' },
    { path: 'economicState.safetyProfile.economicDragDesc', label: 'Economic drag, as first surveyed' },
  ]),
});

/** Render one effective value as editable text (settlementReason is an array). */
function asText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join('\n\n');
  return value == null ? '' : String(value);
}

/**
 * Resolve the entity's position in the array applyUserEditAction addresses.
 * Reference identity first (the index entry was built from this same live
 * settlement); a unique display-name match is the only fallback, and an
 * ambiguous or missing match refuses rather than guessing.
 */
function resolveEntityIndex(settlement, kind, entry) {
  if (kind === 'settlement') return -1;
  const list = kind === 'faction'
    ? settlement?.powerStructure?.factions
    : settlement?.institutions;
  if (!Array.isArray(list)) return null;
  const byRef = list.indexOf(entry?.raw);
  if (byRef >= 0) return byRef;
  const name = String(entry?.currentName || entry?.label || '').trim().toLowerCase();
  if (!name) return null;
  const matches = list
    .map((candidate, index) => ({ candidate, index }))
    .filter(({ candidate }) => (
      String(candidate?.faction || candidate?.name || '').trim().toLowerCase() === name
    ));
  return matches.length === 1 ? matches[0].index : null;
}

function FieldRow({ field, entity, entityKind, entityIndex }) {
  const queueEdit = useStore(state => state.queueEdit);
  const revertUserEditAction = useStore(state => state.revertUserEditAction);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [note, setNote] = useState(null);

  const current = getEffectiveValue(entity, field.path);
  const edited = isEdited(entity, field.path);
  const original = edited ? getOriginalValue(entity, field.path) : null;

  const beginAuthoring = () => {
    setDraft(asText(current));
    setNote(null);
    setOpen(true);
  };

  const queueDraft = async () => {
    if (typeof queueEdit !== 'function') return;
    const intent = await queueEdit('edit-prose', {
      entityKind,
      entityIndex,
      path: field.path,
      value: draft,
    });
    if (intent) {
      setOpen(false);
      setNote({ tone: 'ok', text: 'Queued for review. Commit it from the pending changes bar.' });
    } else {
      setNote({
        tone: 'warn',
        text: 'Not queued. The text may be empty or unchanged, or the world may be mid-advance.',
      });
    }
  };

  const revertField = () => {
    if (typeof revertUserEditAction !== 'function') return;
    revertUserEditAction(entityKind, entityIndex, field.path);
    setOpen(false);
    setNote({ tone: 'ok', text: 'Restored the generated text.' });
  };

  return (
    <li style={{ marginBottom: SP.sm }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, flexWrap: 'wrap' }}>
        <span style={{ fontSize: FS.xs, fontWeight: 700, color: swatch.inkMag }}>
          {field.label}
        </span>
        {edited && (
          <span style={{ fontSize: FS.xxs, fontWeight: 800, color: swatch['#6A2A9A'] }}>
            Hand-written
          </span>
        )}
        {!open && (
          <Button variant="ghost" size="sm" onClick={beginAuthoring}>
            {edited ? 'Rewrite' : 'Write your own'}
          </Button>
        )}
        {edited && !open && (
          <Button variant="ghost" size="sm" onClick={revertField}>
            Restore generated
          </Button>
        )}
      </div>
      {!open && (
        <p style={{ margin: '2px 0 0', color: swatch.inkMag2, fontSize: FS.xs, lineHeight: 1.5 }}>
          {asText(current) || <em style={{ color: MUTED }}>Nothing recorded yet.</em>}
        </p>
      )}
      {open && (
        <div style={{ marginTop: 4 }}>
          <textarea
            aria-label={`${field.label} text`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={4}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              fontSize: FS.sm,
              lineHeight: 1.5,
              padding: 6,
              border: `1px solid ${BORDER}`,
            }}
          />
          <div style={{ display: 'flex', gap: SP.sm, marginTop: 4 }}>
            <Button variant="primary" size="sm" onClick={queueDraft}>
              Queue this text
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
          {edited && original != null && (
            <p style={{ margin: '4px 0 0', color: MUTED, fontSize: FS.xxs, lineHeight: 1.45 }}>
              The generated text is kept and can be restored at any time.
            </p>
          )}
        </div>
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
    </li>
  );
}

export default function WorkbenchProseEditor({ entry }) {
  const settlement = useStore(state => state.settlement);
  const entityKind = entry?.type;
  const fields = PROSE_FIELD_LABELS[entityKind];
  if (!fields || !settlement) return null;

  const entityIndex = resolveEntityIndex(settlement, entityKind, entry);
  const entity = entityKind === 'settlement'
    ? settlement
    : (entityIndex == null
      ? null
      : (entityKind === 'faction'
        ? settlement.powerStructure?.factions?.[entityIndex]
        : settlement.institutions?.[entityIndex]));

  return (
    <section aria-labelledby="workbench-author">
      <h3 id="workbench-author" style={{ margin: '0 0 5px', fontFamily: serif_, fontSize: FS.lg }}>
        Write your own
      </h3>
      {entity == null ? (
        <p role="note" style={{ margin: 0, color: MUTED, fontSize: FS.xxs, lineHeight: 1.45 }}>
          This record cannot be uniquely matched to the live settlement, so
          authoring is disabled rather than guessing.
        </p>
      ) : (
        <>
          <p style={{ margin: '0 0 7px', color: MUTED, fontSize: FS.xxs, lineHeight: 1.45 }}>
            Your text is staged for review first. Nothing changes until you
            commit it, and the generated version is always kept for restore.
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {fields.map(field => (
              <FieldRow
                key={field.path}
                field={field}
                entity={entity}
                entityKind={entityKind}
                entityIndex={entityIndex}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
