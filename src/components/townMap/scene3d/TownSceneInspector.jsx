import {
  SCENE_OVERRIDE_SKIN_IDS,
  withSceneOverride,
  withoutSceneOverride,
} from '../../../domain/townMap/mapEdits.js';
import {
  BODY,
  BORDER,
  CARD,
  FS,
  INK,
  SECOND,
} from '../../theme.js';
import Button from '../../primitives/Button.jsx';
import {
  townSceneInspectorFacts,
  townSceneReferenceLabel,
} from './townSceneInspectorPresentation.js';

const SKIN_LABELS = Object.freeze({
  stoneAshlar: 'Stone ashlar',
  timberVillage: 'Village timber',
  marbleTemple: 'Temple marble',
  brickGuild: 'Guild brick',
  steelModern: 'Worked steel',
  ruinedGothic: 'Ruined gothic',
});

const buttonStyle = {
  minHeight: 36,
  border: `1px solid ${BORDER}`,
  borderRadius: 0,
  background: CARD,
  color: INK,
  padding: '5px 9px',
  font: 'inherit',
  fontSize: 12,
  fontWeight: 750,
};

function SceneHistoryButtons({ canUndo, canRedo, onUndo, onRedo }) {
  if (!onUndo && !onRedo) return null;
  return (
    <div role="group" aria-label="Portrait edit history" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {onUndo && (
        <Button
          size="sm"
          variant="secondary"
          disabled={!canUndo}
          onClick={onUndo}
          style={buttonStyle}
        >
          Undo portrait edit
        </Button>
      )}
      {onRedo && (
        <Button
          size="sm"
          variant="secondary"
          disabled={!canRedo}
          onClick={onRedo}
          style={buttonStyle}
        >
          Redo portrait edit
        </Button>
      )}
    </div>
  );
}

export default function TownSceneInspector({
  semantic,
  building,
  livingRecord,
  provenance = [],
  audience = 'public',
  mapEdits,
  canEdit = false,
  onCommitEdits,
  onOpenWorkbench,
  onOpenHerald,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}) {
  if (!semantic) {
    if (!canEdit || (!onUndo && !onRedo)) return null;
    return (
      <aside
        aria-label="Portrait edit history"
        style={{
          border: `1px solid ${BORDER}`,
          borderRadius: 0,
          background: CARD,
          color: INK,
          padding: 12,
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: FS.sm }}>Portrait edits</h3>
        <SceneHistoryButtons {...{ canUndo, canRedo, onUndo, onRedo }} />
      </aside>
    );
  }
  const anchor = semantic.anchorKey || building?.anchorKey;
  const current = (mapEdits?.sceneOverrides || []).find((entry) => entry.anchor === anchor) || {};
  const workbenchRef = semantic.workbenchRef || (
    semantic.entityKind === 'building'
    && semantic.canonicalRef?.kind === 'institution'
      ? semantic.canonicalRef
      : null
  );
  const canOpenWorkbench = Boolean(
    onOpenWorkbench
    && workbenchRef?.id,
  );
  const canOpenHerald = Boolean(onOpenHerald);
  const facts = townSceneInspectorFacts(semantic, livingRecord);
  const relatedRefs = [
    ...(semantic.relatedRefs?.factionRefs || []),
    ...(semantic.relatedRefs?.pressureRefs || []),
    ...(semantic.relatedRefs?.storyRefs || []),
    ...(semantic.chronicleRefs || []),
  ];
  const workbenchAction = workbenchRef?.kind === 'settlement'
    ? 'Open connected settlement'
    : 'Open in Workbench';

  const commit = (next, action) => {
    if (!canEdit || !anchor || !onCommitEdits) return;
    onCommitEdits(next, {
      kind: 'scene-override',
      action,
      anchor,
      sceneId: semantic.sceneId,
    });
  };
  const patch = (value, action) => commit(withSceneOverride(mapEdits, anchor, value), action);

  return (
    <aside
      aria-label="Selected place"
      style={{
        border: `1px solid ${BORDER}`,
        borderRadius: 0,
        background: CARD,
        color: INK,
        padding: 12,
      }}
    >
      <div style={{ fontSize: FS.xs, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {semantic.entityKind || 'Place'}
      </div>
      <h3 style={{ margin: '3px 0 5px', fontSize: FS.md }}>{semantic.label || 'Unnamed place'}</h3>
      <p style={{ margin: '0 0 9px', color: BODY, fontSize: FS.xs }}>
        {audience === 'dm'
          ? 'DM projection. Use a player or public view before sharing this scene.'
          : 'Player-safe projection. This scene was compiled only from the redacted settlement view.'}
      </p>
      {facts.length > 0 && (
        <dl
          aria-label="Selected place facts"
          style={{
            display: 'grid',
            gridTemplateColumns: 'max-content minmax(0, 1fr)',
            gap: '4px 8px',
            margin: '0 0 9px',
            color: BODY,
            fontSize: FS.xs,
          }}
        >
          {facts.map((fact) => (
            <div key={`${fact.label}:${fact.value}`} style={{ display: 'contents' }}>
              <dt style={{ fontWeight: 750, color: INK }}>{fact.label}</dt>
              <dd style={{ margin: 0 }}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {provenance.length > 0 && (
        <div style={{ margin: '0 0 9px', color: BODY, fontSize: FS.xs }}>
          <strong style={{ color: INK }}>Why this is here</strong>
          <ul style={{ margin: '5px 0 0', paddingInlineStart: 18 }}>
            {provenance.map((entry) => (
              <li key={entry.id} style={{ marginBottom: 3 }}>
                {entry.displayText || (
                  <>
                    {entry.effect || 'Derived'}
                    {entry.family ? ` · ${entry.family}` : ''}
                    {entry.sourceRef ? ` · ${entry.sourceRef}` : ''}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {relatedRefs.length > 0 && (
        <div style={{ margin: '0 0 9px', color: BODY, fontSize: FS.xs }}>
          <strong style={{ color: INK }}>Connected records</strong>
          <ul style={{ margin: '5px 0 0', paddingInlineStart: 18 }}>
            {relatedRefs.map((reference, index) => (
              <li key={`${reference.kind || 'record'}:${reference.id || index}`}>
                {townSceneReferenceLabel(reference) || 'Recorded reference'}
              </li>
            ))}
          </ul>
        </div>
      )}
      {livingRecord && (
        <dl
          aria-label="Recorded living state"
          style={{
            display: 'grid',
            gridTemplateColumns: 'max-content minmax(0, 1fr)',
            gap: '4px 8px',
            margin: '0 0 9px',
            color: BODY,
            fontSize: FS.xs,
          }}
        >
          {livingRecord.severityBand && (
            <>
              <dt style={{ fontWeight: 750, color: INK }}>Severity</dt>
              <dd style={{ margin: 0 }}>
                {livingRecord.severityBand}
                {Number.isFinite(livingRecord.severityPermille)
                  ? ` (${Math.round(livingRecord.severityPermille / 10)}%)`
                  : ''}
              </dd>
            </>
          )}
          {Number.isFinite(livingRecord.week) && (
            <>
              <dt style={{ fontWeight: 750, color: INK }}>Recorded</dt>
              <dd style={{ margin: 0 }}>Week {livingRecord.week}</dd>
            </>
          )}
          {(livingRecord.kind || livingRecord.type || livingRecord.archetype) && (
            <>
              <dt style={{ fontWeight: 750, color: INK }}>State</dt>
              <dd style={{ margin: 0 }}>
                {livingRecord.kind || livingRecord.type || livingRecord.archetype}
              </dd>
            </>
          )}
        </dl>
      )}

      {(canOpenWorkbench || canOpenHerald) && (
        <div aria-label="Open selected place" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9 }}>
          {canOpenWorkbench && (
            <Button
              size="sm"
              variant="secondary"
              style={buttonStyle}
              onClick={() => onOpenWorkbench({
                sceneId: semantic.sceneId,
                semantic,
                canonicalRef: semantic.canonicalRef || null,
                workbenchRef,
              })}
            >
              {workbenchAction}
            </Button>
          )}
          {canOpenHerald && (
            <Button
              size="sm"
              variant="secondary"
              style={buttonStyle}
              onClick={() => onOpenHerald({
                sceneId: semantic.sceneId,
                semantic,
                canonicalRef: semantic.canonicalRef || null,
                provenanceRefs: semantic.provenanceRefs || [],
                provenance,
              })}
            >
              Open the Herald
            </Button>
          )}
        </div>
      )}

      {canEdit && building && semantic.entityKind === 'building' && anchor && (
        <div aria-label="Cosmetic building controls" style={{ display: 'grid', gap: 8, marginTop: 9 }}>
          <SceneHistoryButtons {...{ canUndo, canRedo, onUndo, onRedo }} />
          <label htmlFor={`town-scene-skin-${semantic.sceneId}`} style={{ display: 'grid', gap: 4, fontSize: FS.xs, fontWeight: 750 }}>
            Material treatment
            <select
              id={`town-scene-skin-${semantic.sceneId}`}
              value={current.skinId || building?.skinId || ''}
              onChange={(event) => patch(
                { skinId: event.target.value || undefined },
                'skin',
              )}
              style={{ ...buttonStyle, width: '100%', cursor: 'pointer' }}
            >
              <option value="">Generated treatment</option>
              {SCENE_OVERRIDE_SKIN_IDS.map((value) => (
                <option key={value} value={value}>{SKIN_LABELS[value] || value}</option>
              ))}
            </select>
          </label>
          <label htmlFor={`town-scene-variant-${semantic.sceneId}`} style={{ display: 'grid', gap: 4, fontSize: FS.xs, fontWeight: 750 }}>
            Silhouette variant
            <select
              id={`town-scene-variant-${semantic.sceneId}`}
              value={current.variantId || building?.variantId || 'default'}
              onChange={(event) => patch(
                { variantId: event.target.value === 'default' ? undefined : event.target.value },
                'variant',
              )}
              style={{ ...buttonStyle, width: '100%', cursor: 'pointer' }}
            >
              <option value="default">Generated orientation</option>
              <option value="mirror">Mirrored silhouette</option>
            </select>
          </label>
          <div role="group" aria-label="Rotate building" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Button
              size="sm"
              variant="secondary"
              style={buttonStyle}
              onClick={() => patch({ headingOffsetStep: (current.headingOffsetStep || 0) - 1 }, 'rotate-left')}
            >
              Rotate left
            </Button>
            <Button
              size="sm"
              variant="secondary"
              style={buttonStyle}
              onClick={() => patch({ headingOffsetStep: (current.headingOffsetStep || 0) + 1 }, 'rotate-right')}
            >
              Rotate right
            </Button>
            <Button
              size="sm"
              variant="secondary"
              style={buttonStyle}
              onClick={() => commit(withoutSceneOverride(mapEdits, anchor), 'reset')}
            >
              Reset appearance
            </Button>
          </div>
          <p style={{ margin: 0, fontSize: FS.xs, color: BODY }}>
            Appearance edits do not change routes, districts, or simulation distances.
          </p>
        </div>
      )}
    </aside>
  );
}
