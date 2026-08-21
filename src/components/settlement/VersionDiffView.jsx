/**
 * VersionDiffView.jsx — read-only side-by-side comparison of two version-history
 * snapshots (atlas queue #18, owner-signed BUILD).
 *
 * THE QUESTION THIS ANSWERS. A worldbuilder six months into an arc points at
 * two checkpoints on the Versions timeline and asks "what is different between
 * these two moments?". Until now the tab could only roll back to a snapshot,
 * never show what rolling back would cost.
 *
 * TWO REGISTERS, in the order LEGIBILITY LAW wants them:
 *
 *   1. WHAT THE WORLD DID — the translated half. deriveRegenerationDelta is
 *      already the repo's settlement-vs-settlement comparison authority (it
 *      composes compareSystemState / compareCausalState / compareCapacityStates
 *      / compareDailyLife plus an entity-catalog set diff) and it emits plain
 *      explanation sentences. RegenerationDeltaCard already renders exactly
 *      that shape. Both are reused verbatim; this view supplies its own header
 *      title so the card does not say "rerun" at a reader comparing versions.
 *
 *   2. WHAT WAS WRITTEN — the table half, for the vocabulary the derivations do
 *      not carry: the settlement's identity fields and the authored prose paths
 *      (PROSE_FIELD_LABELS, the same words the Workbench prose editor offers).
 *      A whole-object deep diff was deliberately NOT built: it yields hundreds
 *      of rows like `powerStructure.factions[3].power` that translate to
 *      nothing a reader can act on.
 *
 * A snapshot payload is settlement CONTENT only (snapshotSettlement strips the
 * timeline), so comparing two payloads is comparing two settlements. Nothing
 * here writes: no store action, no persistence, no mutation of either payload.
 *
 * LAZY LEAF. Reached only through VersionsTab's React.lazy seam, so the
 * derivation stack it pulls (system state, causal state, capacity, daily life)
 * never rides first paint. Pinned by tests/build/versionDiffLazy.test.js.
 */

import { useMemo } from 'react';
import { deriveRegenerationDelta } from '../../domain/regenerationDelta.js';
import { PROSE_FIELD_LABELS } from '../dossier/proseFieldLabels.js';
import RegenerationDeltaCard from '../primitives/RegenerationDeltaCard.jsx';
import Button from '../primitives/Button.jsx';
import { BODY, BORDER, CARD, FS, GOLD, INK, MUTED, SP, sans, serif_ } from '../theme.js';

/**
 * Identity and scale fields. These are not prose and not user-editable, but
 * they are the first thing a reader looks for when two checkpoints disagree,
 * and no derivation layer names them in words.
 */
const IDENTITY_FIELDS = Object.freeze([
  { path: 'name', label: 'Settlement name' },
  { path: 'tier', label: 'Size tier' },
  { path: 'population', label: 'Population' },
]);

/** Every field the table half inspects: identity first, then authored prose. */
const TABLE_FIELDS = Object.freeze([
  ...IDENTITY_FIELDS,
  ...PROSE_FIELD_LABELS.settlement,
]);

/** @param {any} obj @param {string} path */
function valueAtPath(obj, path) {
  if (obj == null) return undefined;
  let ref = obj;
  for (const key of path.split('.')) {
    if (ref == null || typeof ref !== 'object') return undefined;
    ref = ref[key];
  }
  return ref;
}

/**
 * Render one field value as comparable, displayable text. settlementReason is
 * an array of lines; numbers and booleans print as themselves; an absent value
 * becomes the empty string so "was blank, now written" is a legible row rather
 * than an undefined-vs-null false positive.
 * @param {unknown} value @returns {string}
 */
export function fieldText(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join('\n\n');
  if (typeof value === 'object') return '';
  return String(value);
}

/**
 * The table half: every TABLE_FIELDS path whose text differs between the two
 * payloads, in declaration order. Pure and exported for direct testing.
 *
 * @param {any} before @param {any} after
 * @returns {{ path: string, label: string, before: string, after: string }[]}
 */
export function diffSnapshotFields(before, after) {
  if (!before || !after) return [];
  const rows = [];
  for (const { path, label } of TABLE_FIELDS) {
    const b = fieldText(valueAtPath(before, path));
    const a = fieldText(valueAtPath(after, path));
    if (b !== a) rows.push({ path, label, before: b, after: a });
  }
  return rows;
}

/** Short, absolute, unambiguous. Matches the timeline's own stamp format. */
function stamp(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return String(ts);
  }
}

const BLANK_VALUE = '(blank)';

/**
 * @param {Object} props
 * @param {{ id: string, ts?: string|number, label?: string, snapshot?: any }} props.earlier
 * @param {{ id: string, ts?: string|number, label?: string, snapshot?: any }} props.later
 * @param {Function} [props.onClose]
 */
export default function VersionDiffView({ earlier, later, onClose }) {
  // Hoisted so the memo dependencies name exactly the values the bodies read
  // (the React compiler refuses to preserve a memo whose declared deps are more
  // specific than the ones it infers from `earlier?.snapshot` inline).
  const earlierPayload = earlier?.snapshot;
  const laterPayload = later?.snapshot;

  const rows = useMemo(
    () => diffSnapshotFields(earlierPayload, laterPayload),
    [earlierPayload, laterPayload],
  );

  const delta = useMemo(() => {
    if (!earlierPayload || !laterPayload) return null;
    try {
      return deriveRegenerationDelta(earlierPayload, laterPayload);
    } catch {
      // A legacy snapshot payload the derivation stack cannot read must not
      // take the whole comparison down: the table half still answers.
      return null;
    }
  }, [earlierPayload, laterPayload]);

  const missingPayload = !earlierPayload || !laterPayload;
  // RegenerationDeltaCard returns null on an empty delta, so "nothing to show"
  // has to be decided here rather than read off the rendered card.
  const derivedCount = delta
    ? (delta.directEffects?.length || 0)
      + (delta.rippleEffects?.length || 0)
      + (delta.capacityShifts?.length || 0)
      + (delta.dailyLifeShifts?.length || 0)
      + (delta.newEntities?.length || 0)
      + (delta.removedEntities?.length || 0)
    : 0;

  return (
    <section
      aria-label="Snapshot comparison"
      style={{
        marginTop: SP.md,
        border: `1px solid ${BORDER}`,
        background: CARD,
        fontFamily: sans,
      }}
    >
      <header style={{
        display: 'flex', alignItems: 'baseline', gap: SP.sm, flexWrap: 'wrap',
        padding: `${SP.sm}px ${SP.md}px`,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <h4 style={{
          margin: 0, fontFamily: serif_, fontWeight: 600,
          fontSize: FS.lg, color: INK,
        }}>
          Comparing two snapshots
        </h4>
        <span style={{ flex: 1, fontSize: FS.xs, color: MUTED }}>
          {earlier?.label || 'Snapshot'} ({stamp(earlier?.ts)}) to {later?.label || 'Snapshot'} ({stamp(later?.ts)})
        </span>
        {onClose && (
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close comparison
          </Button>
        )}
      </header>

      <div style={{ padding: `${SP.sm}px ${SP.md}px ${SP.md}px` }}>
        {missingPayload ? (
          <p style={{ margin: 0, fontSize: FS.sm, color: MUTED, fontStyle: 'italic' }}>
            One of these entries carries no stored settlement, so there is nothing to compare.
            Snapshots taken from this tab always carry one.
          </p>
        ) : (
          <>
            {derivedCount === 0 && rows.length === 0 && (
              <p style={{ margin: 0, fontSize: FS.sm, color: MUTED, fontStyle: 'italic' }}>
                These two snapshots read the same. Nothing changed between them.
              </p>
            )}

            {derivedCount > 0 && (
              <RegenerationDeltaCard delta={delta} heading="What the world did between these points" />
            )}

            {rows.length > 0 && (
              <div style={{ marginTop: derivedCount > 0 ? SP.md : 0 }}>
                <h5 style={{
                  margin: `0 0 ${SP.xs}px`,
                  fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: GOLD,
                }}>
                  What was written ({rows.length})
                </h5>
                <table style={{
                  width: '100%', borderCollapse: 'collapse',
                  fontSize: FS.xs, color: BODY,
                }}>
                  <thead>
                    <tr>
                      <th scope="col" style={HEAD_CELL}>Field</th>
                      <th scope="col" style={HEAD_CELL}>Earlier</th>
                      <th scope="col" style={HEAD_CELL}>Later</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={row.path}>
                        <th scope="row" style={{ ...BODY_CELL, fontWeight: 700, color: INK, width: '22%' }}>
                          {row.label}
                        </th>
                        <td style={BODY_CELL}>{row.before || BLANK_VALUE}</td>
                        <td style={BODY_CELL}>{row.after || BLANK_VALUE}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

const HEAD_CELL = {
  textAlign: 'left',
  padding: '4px 8px',
  borderBottom: `1px solid ${BORDER}`,
  fontSize: FS.xxs,
  fontWeight: 800,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: MUTED,
};

const BODY_CELL = {
  textAlign: 'left',
  verticalAlign: 'top',
  padding: '5px 8px',
  borderBottom: `1px solid ${BORDER}`,
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
};
