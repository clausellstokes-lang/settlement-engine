/**
 * HeraldGazetteer.jsx — THE GAZETTEER, the Herald's living-roster door (owner
 * directive 5, judgment J-D5, wave W-C).
 *
 * The other report doors answer "what happened". This one answers "what is
 * there": every settlement the realm still counts, one compact register row
 * each, in the order a register reads (alphabetical, codepoint-stable).
 *
 * LEGIBILITY LAW, glance then sentence: the name and its tier word are the
 * glance; the one-line state beneath is a SENTENCE, built by heraldRegister from
 * derivations the realm already publishes (the engine's tier stamp, the economy
 * generator's prosperity word, the live war ledgers). No population count, no
 * score, no band number reaches this page.
 *
 * NEWS ADDRESS LAW: every name is a live RealmEntityLink into that settlement's
 * dossier, so the register is a way IN, not a dead list.
 *
 * THE SECRETS SEAM: the door consults viewerSeesDmSecrets exactly as the Road
 * Scene and Travelers surfaces do (fail closed). The roster itself is the
 * world's own fact and ships to every audience; the monster-threat read is a DM
 * assessment and is never BUILT for an unproven session.
 *
 * A LAZY LEAF. HeraldBody mounts it through lazy(), so a GM who never opens this
 * door pays nothing for it. @enforced-by tests/build/heraldRegisterDoorsLazy.test.js
 */

import { useMemo, useState } from 'react';

import { TIER_ORDER, prosperityRank } from '../../data/constants.js';
import { useStore } from '../../store/index.js';
import { viewerSeesDmSecrets } from '../../domain/display/viewerSecrets.js';
import { gazetteerRows } from './heraldRegister.js';
import { isCalmThreat, threatDisplay } from './settlementThreat.js';
import { canShowOnMap, showSettlementOnMap } from './showOnMap.js';
import RealmComparisons from './RealmComparisons.jsx';
import { Pill, Section } from './WorldPulsePrimitives.jsx';
import RealmEntityLink from '../primitives/RealmEntityLink.jsx';
import Button from '../primitives/Button.jsx';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, INK, SP, sans, EMPTY_VALUE } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

/** The register's calm nothing-here state. A realm with no places is not broken. */
function EmptyRegister() {
  return (
    <div style={{ border: `1px dashed ${BORDER}`, padding: 14, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
      No settlement stands in this realm yet. Place one on the map and it enters the register.
    </div>
  );
}

/** One register row: the name and its tier at a glance, the state as a sentence.
 *  DESK-2: hovering (or keyboard-focusing) a row lights the settlement's marker
 *  on the map (the hover-glow layer); the "Show on map" verb flies the camera
 *  to its placement — rendered only when it would actually work (placed ∧ FMG
 *  mode; the camera is mode-specific and an image backdrop has no programmatic
 *  camera). */
function RegisterRow({ row, onHover, onLeave, showable }) {
  const mobile = useIsMobile();
  const threat = row.threat && !isCalmThreat(row.threat) ? threatDisplay(row.threat) : null;
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- hover-peek enhancement only: the row's real controls (the entity link, the show-on-map button) stay native; onFocus/onBlur mirror the glow for keyboard users by focus-bubbling from those controls, and the wrapper itself is deliberately not a tab stop.
    <div
      data-testid="gazetteer-row"
      onPointerEnter={(e) => { if (e.pointerType !== 'touch') onHover?.(row.id); }}
      onPointerLeave={() => onLeave?.()}
      onFocus={() => onHover?.(row.id)}
      onBlur={() => onLeave?.()}
      style={{
        display: 'grid', gap: 3,
        padding: '8px 10px',
        border: `1px solid ${BORDER2}`,
        background: CARD,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <RealmEntityLink
          settlementSaveId={row.id}
          label={row.name}
          style={{ color: INK, fontWeight: 900, fontSize: FS.sm }}
        />
        <Pill>{row.tier}</Pill>
        {threat && (
          <span style={{ color: threat.text, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {threat.label}
          </span>
        )}
        {showable && (
          <Button
            variant="ghost"
            size="sm"
            data-testid="gazetteer-show-on-map"
            aria-label={`Show ${row.name} on the map`}
            onClick={() => showSettlementOnMap(row.id)}
            style={{ marginLeft: 'auto', padding: '0 6px', minHeight: 24, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800 }}
          >
            Show on map
          </Button>
        )}
      </div>
      <div style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.45, overflowWrap: 'anywhere' }}>
        {row.line}
      </div>
    </div>
  );
}

// ── DESK-1 — the census TABLE, the register's second reading ─────────────────
// The register's third legibility rung: glance (name+tier) → sentence (the row
// line) → TABLE (the same derivations as sortable columns). Columns draw ONLY
// from what gazetteerRows already derives — one deriver, two renders. The
// player tier stays banded words; the ONE numeric column (population) exists
// only when the rows carry it (seesSecrets — the DM-instrument tier).
// The chartered militarization index is NOT here: no forces-per-population
// metric is derivable (currentEffectiveStrength is a 0..100 capacity figure,
// not a headcount — dividing it by population would be a unit fork), so the
// column waits for a real ratio field rather than printing a false one.
const WAR_CLAUSE_RANK = ['under siege', 'with its armies in the field', 'at peace'];
const TABLE_SORTS = {
  name: (a, b) => codepointCompare(a.name, b.name),
  tier: (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier),
  prosperity: (a, b) => prosperityRank(a.prosperity) - prosperityRank(b.prosperity),
  war: (a, b) => WAR_CLAUSE_RANK.indexOf(a.war) - WAR_CLAUSE_RANK.indexOf(b.war),
  threat: (a, b) => codepointCompare(a.threat || '', b.threat || ''),
  population: (a, b) => (a.population ?? 0) - (b.population ?? 0),
};
function codepointCompare(a, b) {
  const x = String(a);
  const y = String(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

function GazetteerTable({ rows, seesSecrets }) {
  const mobile = useIsMobile();
  const [sortKey, setSortKey] = useState('name');
  const [dir, setDir] = useState(1);
  const sorted = useMemo(() => {
    const cmp = TABLE_SORTS[sortKey] || TABLE_SORTS.name;
    return [...rows].sort((a, b) => (cmp(a, b) || codepointCompare(a.name, b.name)) * dir);
  }, [rows, sortKey, dir]);
  const onSort = (key) => {
    if (key === sortKey) setDir(d => -d);
    else { setSortKey(key); setDir(1); }
  };
  const columns = [
    ['name', 'Name'], ['tier', 'Tier'], ['prosperity', 'Prosperity'], ['war', 'War'],
    ...(seesSecrets ? [['threat', 'Threat'], ['population', 'Population']] : []),
  ];
  const th = { textAlign: 'left', padding: '6px 8px', borderBottom: `1px solid ${BORDER}`, color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
  const td = { padding: '6px 8px', borderBottom: `1px solid ${BORDER2}`, color: BODY, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), verticalAlign: 'baseline' };
  return (
    <div data-testid="gazetteer-table" style={{ overflowX: 'auto', border: `1px solid ${BORDER2}`, background: CARD }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {columns.map(([key, label]) => (
              <th key={key} aria-sort={sortKey === key ? (dir === 1 ? 'ascending' : 'descending') : 'none'} style={th}>
                <Button variant="ghost" size="sm" onClick={() => onSort(key)}
                  aria-label={`Sort by ${label}`}
                  style={{ padding: 0, minHeight: 24, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}{sortKey === key ? (dir === 1 ? ' ▲' : ' ▼') : ''}
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr key={row.id} data-testid="gazetteer-table-row">
              <td style={td}>
                <RealmEntityLink settlementSaveId={row.id} label={row.name} style={{ color: INK, fontWeight: 800, fontSize: chromeFontSize(FS.xs, mobile) }} />
              </td>
              <td style={td}>{row.tier}</td>
              <td style={td}>{row.prosperity || EMPTY_VALUE}</td>
              <td style={td}>{row.war}</td>
              {seesSecrets && <td style={td}>{row.threat || EMPTY_VALUE}</td>}
              {seesSecrets && <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.population ?? EMPTY_VALUE}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {any} props.campaign
 * @param {ReadonlyArray<any>} [props.saves]
 */
export default function HeraldGazetteer({ campaign, saves = [] }) {
  const auth = useStore(s => s.auth);
  // §15 fail-closed, the RoadScenePanel idiom: only a proven owner session gets
  // the DM half of the register.
  const seesSecrets = viewerSeesDmSecrets({ isOwner: !!auth?.user, authenticated: !!auth?.user });
  const rows = useMemo(
    () => gazetteerRows({ campaign, saves, seesSecrets }),
    [campaign, saves, seesSecrets],
  );
  // DESK-2 — word→map linkage: the hover setters (the PlacementsLayer pair,
  // written from the word side) + per-row show-on-map availability.
  const setHovered = useStore(s => s.setHoveredSettlementId);
  const clearHovered = useStore(s => s.clearHoveredSettlementId);
  const placements = useStore(s => s.mapState?.placements);
  const imageMode = useStore(s => !!s.mapState?.customBackdrop?.imageUrl);
  const showableIds = useMemo(() => {
    if (imageMode) return new Set();
    const state = { mapState: { placements: placements || {} } };
    return new Set(rows.filter(row => canShowOnMap(state, row.id)).map(row => String(row.id)));
  }, [rows, placements, imageMode]);

  // DESK-1 — register⇄table: the register (glance + sentence) stays the
  // default reading; the table is the sortable third rung over the SAME rows.
  const [view, setView] = useState('register');

  return (
    <div data-testid="herald-gazetteer" style={{ display: 'grid', gap: SP.sm }}>
      <Section heading="The realm at large" count={rows.length}>
        {rows.length > 0 && (
          <div role="group" aria-label="Register, table, or compared view" style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <Button variant={view === 'register' ? 'gold' : 'secondary'} size="sm" aria-pressed={view === 'register'}
              data-testid="gazetteer-view-register" onClick={() => setView('register')}>Register</Button>
            <Button variant={view === 'table' ? 'gold' : 'secondary'} size="sm" aria-pressed={view === 'table'}
              data-testid="gazetteer-view-table" onClick={() => setView('table')}>Table</Button>
            <Button variant={view === 'compared' ? 'gold' : 'secondary'} size="sm" aria-pressed={view === 'compared'}
              data-testid="gazetteer-view-compared" onClick={() => setView('compared')}>Compared</Button>
          </div>
        )}
        {rows.length === 0 ? (
          <EmptyRegister />
        ) : view === 'table' ? (
          <GazetteerTable rows={rows} seesSecrets={seesSecrets} />
        ) : view === 'compared' ? (
          <RealmComparisons
            rows={rows}
            worldState={campaign?.worldState || null}
            nameFor={(id) => rows.find(r => String(r.id) === String(id))?.name || String(id)}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rows.map(row => (
              <RegisterRow
                key={row.id}
                row={row}
                onHover={setHovered}
                onLeave={clearHovered}
                showable={showableIds.has(String(row.id))}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
