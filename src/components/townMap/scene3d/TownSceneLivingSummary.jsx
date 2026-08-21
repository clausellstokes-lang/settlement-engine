import {
  BODY,
  BORDER,
  CARD,
  FS,
  GOLD_SOFT,
  INK,
  SECOND,
} from '../../theme.js';
import Button from '../../primitives/Button.jsx';

function titleCase(value) {
  return String(value || '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function livingRows(living) {
  return [
    ...(living?.conditions || []).map((record) => ({
      record,
      kind: String(record.id).startsWith('hazard:') ? 'Hazard' : 'Condition',
      label: record.label || titleCase(record.archetype) || 'Active condition',
      detail: [
        record.severityBand && `${titleCase(record.severityBand)} severity`,
        Number.isFinite(record.severityPermille)
          ? `${Math.round(record.severityPermille / 10)}% intensity`
          : null,
      ].filter(Boolean).join(' · '),
    })),
    ...(living?.scars || []).map((record) => ({
      record,
      kind: 'Persistent scar',
      label: titleCase(record.kind) || 'Recorded scar',
      detail: [
        Number.isFinite(record.week) ? `Recorded week ${record.week}` : null,
        Number.isFinite(record.severityPermille)
          ? `${Math.round(record.severityPermille / 10)}% severity`
          : null,
      ].filter(Boolean).join(' · '),
    })),
    ...(living?.reconstruction || []).map((record) => ({
      record,
      kind: 'Reconstruction',
      label: titleCase(record.type) || 'Rebuilding',
      detail: [
        record.freshnessBand && titleCase(record.freshnessBand),
        Number.isFinite(record.week) ? `Recorded week ${record.week}` : null,
      ].filter(Boolean).join(' · '),
    })),
  ];
}

function atmosphereText(atmosphere) {
  if (!atmosphere) return '';
  return [
    atmosphere.season && `${titleCase(atmosphere.season)} season`,
    atmosphere.severity && `${titleCase(atmosphere.severity)} weather`,
    atmosphere.besieged && 'Besieged',
    Number.isFinite(atmosphere.festivalScale) && atmosphere.festivalScale > 0
      ? 'Festival dress'
      : null,
  ].filter(Boolean).join(' · ');
}

/**
 * Textual parity for living-state marks in the portrait.
 *
 * The rows come only from the already audience-projected manifest. A row is a
 * button when the canonical semantic table gives it a selection address;
 * otherwise it remains readable without inventing a second semantic identity.
 */
export default function TownSceneLivingSummary({
  living,
  semantics = [],
  selectedNodeId = null,
  onSelect,
}) {
  const rows = livingRows(living);
  const atmosphere = atmosphereText(living?.atmosphere);
  if (!rows.length && !atmosphere) return null;
  const semanticById = new Map(
    semantics.map((semantic) => [semantic.sceneId, semantic]),
  );

  return (
    <section
      aria-labelledby="town-scene-living-title"
      style={{
        display: 'grid',
        gap: 8,
        border: `1px solid ${BORDER}`,
        borderRadius: 0,
        background: CARD,
        color: INK,
        padding: 12,
      }}
    >
      <h3 id="town-scene-living-title" style={{ margin: 0, fontSize: FS.sm }}>
        Living settlement state
      </h3>
      {atmosphere && (
        <p style={{ margin: 0, color: BODY, fontSize: FS.xs }}>
          {atmosphere}
        </p>
      )}
      {rows.length > 0 && (
        <div role="list" aria-label="Conditions, scars, and reconstruction" style={{ display: 'grid', gap: 5 }}>
          {rows.map(({ record, kind, label, detail }) => {
            const semantic = semanticById.get(record.id);
            const selected = record.id === selectedNodeId;
            const content = (
              <>
                <span style={{ fontSize: FS.xs, color: SECOND }}>{kind}</span>
                <span style={{ fontSize: FS.sm, fontWeight: 800 }}>{label}</span>
                {detail && <span style={{ fontSize: FS.xs, color: BODY }}>{detail}</span>}
              </>
            );
            return (
              <div key={record.id} role="listitem">
                {semantic ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    aria-current={selected ? 'true' : undefined}
                    onClick={() => onSelect?.(record.id, semantic)}
                    style={{
                      width: '100%',
                      minHeight: 44,
                      display: 'grid',
                      gap: 2,
                      padding: '7px 9px',
                      background: selected ? GOLD_SOFT : CARD,
                      textAlign: 'left',
                    }}
                  >
                    {content}
                  </Button>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gap: 2,
                      borderInlineStart: `3px solid ${BORDER}`,
                      padding: '4px 8px',
                    }}
                  >
                    {content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
