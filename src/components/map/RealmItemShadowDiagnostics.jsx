/**
 * RealmItemShadowDiagnostics.jsx — internal accounting for the G-3 shadow run.
 *
 * This is deliberately not a Herald door and it does not own presentation,
 * navigation, or decisions. It makes the canonical read model's accounting
 * inspectable while the established seven-door Herald remains on screen.
 *
 * The component is statically contained by RealmInspector, which is already a
 * lazy WorldMap chunk. Keeping this leaf here avoids creating a new first-paint
 * dependency or a second nested-lazy preload entry for a default-off diagnostic.
 */

import {
  BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, SECOND, SP, sans,
} from '../theme.js';
import { REALM_ITEM_SOURCE_CLASSES } from '../../domain/realm/realmItemReadModel.js';

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {Array<Record<string, unknown>>} */
function recordsOf(value) {
  return Array.isArray(value)
    ? value.filter(entry => entry != null && typeof entry === 'object' && !Array.isArray(entry))
    : [];
}

/** @param {unknown} value @returns {string} */
function textOf(value) {
  return value == null ? '' : String(value).trim();
}

/** @param {unknown} value @returns {number} */
function countOf(value) {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

function labelOf(sourceClass) {
  return textOf(sourceClass).replaceAll('_', ' ');
}

/**
 * Keep the arithmetic in one pure seam so diagnostics never have to infer from
 * rendered Herald prose. `modeledSourceReferences` is intentionally not called
 * "input total": exact duplicates are represented by an accounting diagnostic,
 * and a malformed collection may hide an unknowable number of records.
 *
 * @param {unknown} value
 */
export function summarizeRealmItemShadow(value) {
  const model = recordOf(value);
  const counts = recordOf(model.counts);
  const bySource = recordOf(counts.bySource);
  const diagnostics = recordsOf(model.diagnostics);
  const exclusions = recordsOf(model.exclusions);
  const sourceCounts = Object.fromEntries(
    REALM_ITEM_SOURCE_CLASSES.map(sourceClass => [sourceClass, countOf(bySource[sourceClass])]),
  );
  const presentSourceClasses = REALM_ITEM_SOURCE_CLASSES.filter(
    sourceClass => sourceCounts[sourceClass] > 0,
  );
  const collisions = diagnostics.filter(
    diagnostic => textOf(diagnostic.code).includes('collision'),
  );
  const errors = diagnostics.filter(
    diagnostic => textOf(diagnostic.severity).toLowerCase() === 'error',
  );
  const deduplicated = diagnostics.filter(
    diagnostic => textOf(diagnostic.code) === 'duplicate_source_projection',
  );

  return {
    itemCount: countOf(counts.total) || recordsOf(model.items).length,
    blockingCount: countOf(counts.blocking),
    sourceCounts,
    presentSourceClasses,
    modeledSourceReferences: Object.values(sourceCounts)
      .reduce((sum, count) => sum + count, 0),
    supportedSourceClassCount: REALM_ITEM_SOURCE_CLASSES.length,
    exclusions,
    diagnostics,
    collisions,
    errors,
    deduplicated,
  };
}

function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 0 }}>
      <dt style={{
        color: BODY,
        fontFamily: sans,
        fontSize: FS.micro,
        fontWeight: 750,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
      >
        {label}
      </dt>
      <dd style={{
        margin: 0,
        color: SECOND,
        fontFamily: sans,
        fontSize: FS.sm,
        fontWeight: 900,
      }}
      >
        {value}
      </dd>
    </div>
  );
}

function IssueList({ label, entries }) {
  if (entries.length === 0) return null;
  return (
    <section aria-label={label} style={{ display: 'grid', gap: 4 }}>
      <strong style={{
        color: SECOND,
        fontFamily: sans,
        fontSize: FS.micro,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
      >
        {label}
      </strong>
      <ul style={{ display: 'grid', gap: 3, margin: 0, paddingLeft: 18 }}>
        {entries.map((entry, index) => {
          const source = textOf(entry.sourceClass);
          const code = textOf(entry.code);
          const identity = textOf(entry.itemId);
          const reason = textOf(entry.reason) || textOf(entry.message) || 'No detail recorded.';
          return (
            <li
              key={`${source || code || 'issue'}:${identity || 'unscoped'}:${index}`}
              style={{ color: BODY, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.35 }}
            >
              {[source && labelOf(source), code, identity].filter(Boolean).join(' · ')}
              {(source || code || identity) ? ': ' : ''}{reason}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Read-only, internal shadow accounting. Passing the already-derived model is
 * important: the panel must never trigger a second derivation or read the store.
 */
export default function RealmItemShadowDiagnostics({ model }) {
  const summary = summarizeRealmItemShadow(model);
  const issueCount = summary.exclusions.length + summary.errors.length;

  return (
    <details
      data-testid="realm-item-shadow-diagnostics"
      style={{
        borderBottom: `1px solid ${BORDER}`,
        background: CARD_ALT,
        color: BODY,
      }}
    >
      <summary style={{
        cursor: 'pointer',
        padding: `${SP.xs}px ${SP.md}px`,
        color: SECOND,
        fontFamily: sans,
        fontSize: FS.micro,
        fontWeight: 850,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
      >
        RealmItem shadow · {summary.itemCount} items · {summary.modeledSourceReferences} source refs · {issueCount} issues
      </summary>
      <div style={{
        display: 'grid',
        gap: SP.sm,
        padding: `${SP.sm}px ${SP.md}px`,
        borderTop: `1px solid ${BORDER2}`,
        background: CARD,
      }}
      >
        <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.4 }}>
          Internal, read-only accounting. The legacy Herald remains the rendered interface;
          this shadow model performs no writes.
        </p>

        <dl style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: SP.sm,
          margin: 0,
        }}
        >
          <Stat label="Canonical items" value={summary.itemCount} />
          <Stat label="Blocking" value={summary.blockingCount} />
          <Stat
            label="Families present"
            value={`${summary.presentSourceClasses.length}/${summary.supportedSourceClassCount}`}
          />
          <Stat label="Excluded" value={summary.exclusions.length} />
        </dl>

        <section aria-label="RealmItem source counts" style={{ display: 'grid', gap: 4 }}>
          <strong style={{
            color: SECOND,
            fontFamily: sans,
            fontSize: FS.micro,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
          >
            Source-class coverage
          </strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {REALM_ITEM_SOURCE_CLASSES.map(sourceClass => (
              <span
                key={sourceClass}
                style={{
                  border: `1px solid ${BORDER2}`,
                  padding: '2px 5px',
                  color: summary.sourceCounts[sourceClass] > 0 ? GOLD : BODY,
                  opacity: summary.sourceCounts[sourceClass] > 0 ? 1 : 0.6,
                  fontFamily: sans,
                  fontSize: FS.micro,
                }}
              >
                {labelOf(sourceClass)} {summary.sourceCounts[sourceClass]}
              </span>
            ))}
          </div>
        </section>

        <div style={{ color: BODY, fontFamily: sans, fontSize: FS.micro }}>
          Collisions {summary.collisions.length} · errors {summary.errors.length} ·
          deduplicated repeats {summary.deduplicated.length}
        </div>

        <IssueList label="Excluded source records" entries={summary.exclusions} />
        <IssueList label="Collision and error diagnostics" entries={summary.errors} />
      </div>
    </details>
  );
}
