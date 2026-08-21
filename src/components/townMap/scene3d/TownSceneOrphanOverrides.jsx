import { useMemo, useState } from 'react';
import {
  inspectSceneOverrideOrphans,
  relinkSceneOverrideOrphan,
  removeSceneOverrideOrphan,
} from '../../../domain/townMap/sceneOverrideOrphans.js';
import {
  BODY,
  BORDER,
  CARD,
  CARD_ALT,
  FS,
  INK,
  SECOND,
} from '../../theme.js';
import Button from '../../primitives/Button.jsx';

const selectStyle = {
  width: '100%',
  minHeight: 36,
  border: `1px solid ${BORDER}`,
  borderRadius: 0,
  background: CARD,
  color: INK,
  padding: '5px 9px',
  font: 'inherit',
  fontSize: 12,
};

function overrideSummary(override) {
  const details = [];
  if (override.skinId) details.push(`material: ${override.skinId}`);
  if (override.variantId) details.push(`variant: ${override.variantId}`);
  if (Number.isFinite(override.headingOffsetStep)) {
    details.push(`rotation step: ${override.headingOffsetStep}`);
  }
  return details.join(' · ') || 'Saved appearance';
}

function resultMessage(reason) {
  if (reason === 'target-occupied') {
    return 'That building received another appearance edit. Choose a different target.';
  }
  if (reason === 'missing-target') {
    return 'That building is no longer in the current settlement. Choose another target.';
  }
  return 'The original target is present again, so this edit was left unchanged.';
}

function OrphanOverrideRow({
  orphan,
  targets,
  manifest,
  mapEdits,
  canEdit,
  onCommitEdits,
}) {
  const [targetAnchor, setTargetAnchor] = useState('');
  const [message, setMessage] = useState('');
  const selectId = `town-scene-orphan-target-${encodeURIComponent(orphan.anchor)}`;
  const authoring = canEdit && typeof onCommitEdits === 'function';

  const remove = () => {
    const result = removeSceneOverrideOrphan(mapEdits, manifest, orphan.anchor);
    if (!result.ok) {
      setMessage(resultMessage(result.reason));
      return;
    }
    onCommitEdits(result.edits, {
      kind: 'scene-override',
      action: 'remove-orphan',
      anchor: orphan.anchor,
      sourceAnchor: orphan.anchor,
      sceneId: null,
    });
  };

  const relink = () => {
    const result = relinkSceneOverrideOrphan(
      mapEdits,
      manifest,
      orphan.anchor,
      targetAnchor,
    );
    if (!result.ok) {
      setMessage(resultMessage(result.reason));
      return;
    }
    onCommitEdits(result.edits, {
      kind: 'scene-override',
      action: 'relink-orphan',
      anchor: result.target.anchor,
      sourceAnchor: orphan.anchor,
      targetAnchor: result.target.anchor,
      sceneId: result.target.sceneId,
    });
  };

  return (
    <li
      style={{
        display: 'grid',
        gap: 8,
        padding: 10,
        border: `1px solid ${BORDER}`,
        borderRadius: 0,
        background: CARD_ALT,
      }}
    >
      <div style={{ display: 'grid', gap: 3 }}>
        <strong style={{ color: INK, fontSize: FS.xs }}>Missing target</strong>
        <code style={{ color: BODY, fontSize: FS.micro, overflowWrap: 'anywhere' }}>
          {orphan.anchor}
        </code>
        <span style={{ color: SECOND, fontSize: FS.micro }}>
          {overrideSummary(orphan.override)}
        </span>
      </div>

      {authoring && (
        <>
          {targets.length > 0 ? (
            <label
              htmlFor={selectId}
              style={{ display: 'grid', gap: 4, color: INK, fontSize: FS.xs, fontWeight: 750 }}
            >
              Relink to a current building
              <select
                id={selectId}
                aria-label={`Relink destination for ${orphan.anchor}`}
                value={targetAnchor}
                onChange={(event) => {
                  setTargetAnchor(event.target.value);
                  setMessage('');
                }}
                style={selectStyle}
              >
                <option value="">Choose a building…</option>
                {targets.map((target) => (
                  <option key={target.anchor} value={target.anchor}>
                    {target.label}: {target.anchor}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p style={{ margin: 0, color: BODY, fontSize: FS.xs }}>
              Every current building already has an appearance edit. Remove this
              orphan or reset another building before relinking it.
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {targets.length > 0 && (
              <Button
                size="sm"
                variant="secondary"
                disabled={!targetAnchor}
                onClick={relink}
              >
                Relink override
              </Button>
            )}
            <Button size="sm" variant="danger" onClick={remove}>
              Remove orphaned override
            </Button>
          </div>
        </>
      )}

      {message && (
        <p role="status" style={{ margin: 0, color: BODY, fontSize: FS.xs }}>
          {message}
        </p>
      )}
    </li>
  );
}

/**
 * Report saved scene overrides whose canonical target no longer exists.
 *
 * Reporting is DM-only; mutation remains behind the stricter parent authoring
 * gate. Nothing is cleaned up on render. A remove/relink action emits exactly
 * one normalized parent commit so the existing map-edit persistence and undo
 * history stay authoritative.
 */
export default function TownSceneOrphanOverrides({
  manifest,
  mapEdits,
  audience = 'public',
  canEdit = false,
  onCommitEdits,
}) {
  const report = useMemo(
    () => inspectSceneOverrideOrphans(mapEdits, manifest),
    [manifest, mapEdits],
  );
  // An unavailable manifest means the target inventory is unknown, not empty.
  // The renderer's fallback owns that failure; reporting every override as an
  // orphan here would manufacture a canonical deletion that did not occur.
  if (!manifest || audience !== 'dm' || report.orphans.length === 0) return null;

  return (
    <aside
      aria-label="Orphaned portrait edits"
      style={{
        display: 'grid',
        gap: 9,
        border: `1px solid ${BORDER}`,
        borderRadius: 0,
        background: CARD,
        color: INK,
        padding: 12,
      }}
    >
      <div>
        <div style={{
          color: SECOND,
          fontSize: FS.micro,
          fontWeight: 800,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
        }}>
          Saved appearance review
        </div>
        <h3 style={{ margin: '3px 0 4px', fontSize: FS.sm }}>
          {report.orphans.length === 1
            ? '1 portrait edit needs a target'
            : `${report.orphans.length} portrait edits need targets`}
        </h3>
        <p style={{ margin: 0, color: BODY, fontSize: FS.xs }}>
          The referenced building is no longer part of the canonical settlement.
          Nothing was changed automatically.
        </p>
      </div>

      <ul style={{ display: 'grid', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
        {report.orphans.map((orphan) => (
          <OrphanOverrideRow
            key={orphan.anchor}
            orphan={orphan}
            targets={report.availableTargets}
            manifest={manifest}
            mapEdits={mapEdits}
            canEdit={canEdit}
            onCommitEdits={onCommitEdits}
          />
        ))}
      </ul>
    </aside>
  );
}
