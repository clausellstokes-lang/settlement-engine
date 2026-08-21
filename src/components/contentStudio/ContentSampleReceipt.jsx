import { BODY, MUTED, BORDER, GREEN, FS, SP, sans } from '../theme.js';
import { Eyebrow } from '../surveyor/surveyorPanelKit.jsx';

function MaterializedList({ label, entries }) {
  if (!Array.isArray(entries) || entries.length === 0) return null;
  return (
    <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>
      <strong>{label}:</strong> {entries.map((entry) => entry.name).join(', ')}
    </div>
  );
}

const FIXTURE_LABELS = Object.freeze({
  institutions: 'Institution',
  resources: 'Resource',
  services: 'Service',
  deities: 'Deity',
  factions: 'Faction',
  stressors: 'Stressor',
  traditions: 'Tradition',
});

function FieldTruth({ receipt }) {
  const truth = receipt?.fieldTruth;
  const presentation = truth?.presentationOnly || [];
  const unsupported = truth?.unsupported || [];
  if (presentation.length === 0 && unsupported.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {presentation.length > 0 && (
        <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          Presentation only: {presentation.join(', ')}
        </div>
      )}
      {unsupported.length > 0 && (
        <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          Unsupported here: {unsupported.map(item => item.field).join(', ')}
        </div>
      )}
    </div>
  );
}

function FixtureResult({ fixture }) {
  if (fixture.kind === 'generation-boundary') {
    const definitions = fixture.receipt?.definitions || [];
    const boundary = (fixture.boundaries || []).join(' and ');
    return (
      <>
        <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>
          <strong>{FIXTURE_LABELS[fixture.bucket] || fixture.bucket}</strong>
          {' · '}
          {boundary} tier {fixture.tier}
          {' · '}
          {definitions.filter(item => item.materialized).length}/{definitions.length}
          {' reviewed definitions present'}
        </div>
        {definitions.map(definition => (
          <div key={definition.localUid || definition.name}>
            <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
              {definition.materializationState === 'ambiguous'
                ? 'Same-name entity present; exact definition unknown'
                : definition.materialized
                  ? 'Present'
                  : 'Not present'}
              : {definition.name}
            </div>
            <FieldTruth receipt={{ fieldTruth: definition.fieldTruth }} />
          </div>
        ))}
      </>
    );
  }

  if (fixture.kind === 'deity-assignment') {
    return (
      <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>
        <strong>Deity · temporary assignment:</strong>{' '}
        {fixture.result?.assigned ? fixture.name : `${fixture.name} was not assigned`}
      </div>
    );
  }
  if (fixture.kind === 'faction-event') {
    return (
      <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>
        <strong>Faction · unsaved ADD_FACTION:</strong>{' '}
        {fixture.result?.present ? fixture.name : `${fixture.name} was not introduced`}
      </div>
    );
  }
  if (fixture.kind === 'stressor-event') {
    return (
      <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>
        <strong>Stressor · unsaved APPLY_STRESSOR:</strong>{' '}
        {fixture.result?.active ? fixture.name : `${fixture.name} was not applied`}
        {fixture.result?.fixtureSeverity != null
          ? ` · fixture severity ${fixture.result.fixtureSeverity}`
          : ''}
      </div>
    );
  }
  const observance = fixture.result?.observance;
  return (
    <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>
      <strong>Tradition · dossier observance:</strong>{' '}
      {observance?.name || fixture.name}
      {observance?.window?.startWeekOfYear
        ? ` · week ${observance.window.startWeekOfYear}`
        : ''}
    </div>
  );
}

function CategoryFixtures({ fixtures }) {
  if (!Array.isArray(fixtures) || fixtures.length === 0) return null;
  return (
    <div
      data-testid="content-sample-category-fixtures"
      style={{
        borderTop: `1px solid ${BORDER}`,
        paddingTop: SP.xs,
        display: 'flex',
        flexDirection: 'column',
        gap: SP.xs,
      }}
    >
      <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans, fontWeight: 600 }}>
        Category-aware fixtures
      </div>
      {fixtures.map(fixture => (
        <div
          key={fixture.id}
          style={{
            borderLeft: `2px solid ${BORDER}`,
            paddingLeft: SP.xs,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <FixtureResult fixture={fixture} />
          {fixture.kind !== 'generation-boundary' && (
            <FieldTruth receipt={fixture.receipt} />
          )}
          {fixture.receipt?.note && (
            <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
              {fixture.receipt.note}
            </div>
          )}
          {fixture.receipt?.assumption && (
            <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
              {fixture.receipt.assumption}
            </div>
          )}
          {fixture.event?.veto && (
            <div role="alert" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
              Event refused: {fixture.event.veto.code}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Present the deterministic before/after facts from one unsaved taste gate.
 *
 * The component avoids causal prose: it says what changed, which candidates
 * were preview-forced, and which candidates remained dormant in this fixture.
 */
export default function ContentSampleReceipt({ sample }) {
  if (!sample) return null;
  const changes = sample.diff?.scalarChanges || [];
  const materialized = sample.diff?.materialized || {};
  const materializedOverrides = (sample.forced || [])
    .filter(entry => entry.materialized === true);
  const ambiguousOverrides = (sample.forced || [])
    .filter(entry => entry.materializationState === 'ambiguous');
  const gatedOverrides = (sample.forced || [])
    .filter(entry => (
      entry.materialized !== true
      && entry.materializationState !== 'ambiguous'
    ));
  return (
    <section
      data-testid="content-sample-receipt"
      aria-labelledby="content-sample-title"
      style={{
        border: `1px solid ${BORDER}`,
        padding: SP.sm,
        display: 'flex',
        flexDirection: 'column',
        gap: SP.xs,
      }}
    >
      <Eyebrow>
        <span id="content-sample-title">
          Unsaved sample settlement · same seed before and after
        </span>
      </Eyebrow>
      <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
        Seed {sample.seed} · this preview did not alter your library, saves, or
        campaigns.
      </div>
      {changes.length > 0 ? (
        <table style={{
          borderCollapse: 'collapse',
          width: '100%',
          fontSize: FS.xs,
          color: BODY,
          fontFamily: sans,
        }}>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'left' }}>Dimension</th>
              <th scope="col" style={{ textAlign: 'left' }}>Before</th>
              <th scope="col" style={{ textAlign: 'left' }}>With content</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => (
              <tr key={change.field}>
                <th
                  scope="row"
                  style={{ textAlign: 'left', fontWeight: 600 }}
                >
                  {change.field}
                </th>
                <td>{String(change.before ?? '–')}</td>
                <td>{String(change.after ?? '–')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          No registered scalar summary changed in this sample.
        </div>
      )}
      <MaterializedList
        label="Institutions present"
        entries={materialized.institutions}
      />
      <MaterializedList
        label="Resources present"
        entries={materialized.resources}
      />
      <MaterializedList
        label="Services present"
        entries={materialized.services}
      />
      {sample.diff?.addedExports?.length > 0 && (
        <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>
          <strong>New exports:</strong> {sample.diff.addedExports.join(', ')}
        </div>
      )}
      {materializedOverrides.length > 0 && (
        <div style={{
          fontSize: FS.xs,
          color: MUTED,
          fontFamily: sans,
          lineHeight: 1.4,
        }}>
          <span style={{ color: GREEN }}>◆</span>
          {' Preview fixture: '}
          {materializedOverrides.map((entry) => entry.name).join(', ')}
          {' was marked mandatory and materialized only in this unsaved summary.'}
        </div>
      )}
      {gatedOverrides.length > 0 && (
        <div style={{
          fontSize: FS.xs,
          color: MUTED,
          fontFamily: sans,
          lineHeight: 1.4,
        }}>
          Preview override did not bypass canonical eligibility:{' '}
          {gatedOverrides.map((entry) => entry.name).join(', ')} did not
          materialize in the default summary tier. Its tier and dependency
          fixtures appear below.
        </div>
      )}
      {ambiguousOverrides.length > 0 && (
        <div style={{
          fontSize: FS.xs,
          color: MUTED,
          fontFamily: sans,
          lineHeight: 1.4,
        }}>
          Same-name entity present, exact definition unknown:{' '}
          {ambiguousOverrides.map((entry) => entry.name).join(', ')}. This
          output surface does not retain enough identity to attribute the
          materialization safely.
        </div>
      )}
      {sample.dormant?.length > 0 && (
        <div style={{
          fontSize: FS.xs,
          color: MUTED,
          fontFamily: sans,
          lineHeight: 1.4,
        }}>
          Dormant in ordinary generation:{' '}
          {sample.dormant.map((entry) => entry.name).join(', ')}. The fixtures
          below exercise only the assignment, event, or presentation paths the
          product supports today.
        </div>
      )}
      <CategoryFixtures fixtures={sample.fixtures} />
    </section>
  );
}
