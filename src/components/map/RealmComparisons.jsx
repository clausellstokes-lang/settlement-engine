/**
 * RealmComparisons.jsx — DESK-3: the authored comparison charts.
 *
 * A CLOSED authored set of one-question-one-picture comparisons over the
 * register's OWN rows (gazetteerRows — the one deriver; a chart here can never
 * disagree with the register or the census table) plus the exhaustion
 * standings. The steal from upstream is the GROUP-BY DEVICE alone (one entity
 * stacked by a second); the forty-slider free-form chart builder is
 * deliberately NOT adopted — each picture answers exactly one authored
 * question, and a question whose ledger is dormant asks nothing at all.
 *
 * THE TIER LAW: counts are denominator facts and lawful on every tier (the
 * filtered-denominator footers already speak them); the ONE numeric beyond
 * counts — per-tier population totals — is DM-INSTRUMENT, appended only when
 * the rows carry population at all (gazetteerRows builds it only for a proven
 * owner session, so the gate is the deriver's own).
 *
 * Every bar row carries its SENTENCE as the aria-label (glance = the bar,
 * sentence = the label — the legibility ladder again).
 */

import { useMemo } from 'react';

import { TIER_ORDER, prosperityRank } from '../../data/constants.js';
import { warExhaustionStandings } from '../../domain/display/warStatus.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, GREEN, INK, MUTED, RED, SECOND, SP, sans } from '../theme.js';

const WAR_SEGMENTS = Object.freeze([
  { clause: 'at peace', color: GREEN, word: 'at peace' },
  { clause: 'with its armies in the field', color: GOLD, word: 'afield' },
  { clause: 'under siege', color: RED, word: 'under siege' },
]);
const EXHAUSTION_BANDS = Object.freeze(['near peace', 'war-weary', 'exhausted']);

/** One horizontal stacked bar with its sentence. */
function BarRow({ label, sentence, segments, total, testid }) {
  return (
    <div data-testid={testid} aria-label={sentence} style={{ display: 'grid', gap: 2 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, textTransform: 'capitalize' }}>{label}</span>
        <span style={{ marginLeft: 'auto', color: MUTED, fontFamily: sans, fontSize: FS.micro, fontWeight: 700 }}>{sentence}</span>
      </div>
      <div style={{ display: 'flex', height: 8, background: BORDER2, overflow: 'hidden' }}>
        {segments.map((seg, i) => seg.count > 0 && (
          <div key={i} style={{ width: `${(seg.count / Math.max(1, total)) * 100}%`, background: seg.color }} />
        ))}
      </div>
    </div>
  );
}

function Question({ heading, children }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, background: CARD, padding: '9px 11px', display: 'grid', gap: 7 }}>
      <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {heading}
      </div>
      {children}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {ReadonlyArray<any>} props.rows      gazetteerRows output (the one deriver)
 * @param {any} [props.worldState]             for the exhaustion standings
 * @param {(id: any) => string} [props.nameFor]
 */
export default function RealmComparisons({ rows = [], worldState = null, nameFor = (id) => String(id) }) {
  const byTier = useMemo(() => {
    const map = new Map();
    for (const row of rows) {
      if (!map.has(row.tier)) map.set(row.tier, []);
      map.get(row.tier).push(row);
    }
    return [...map.entries()].sort((a, b) => TIER_ORDER.indexOf(a[0]) - TIER_ORDER.indexOf(b[0]));
  }, [rows]);

  const byProsperity = useMemo(() => {
    const map = new Map();
    for (const row of rows) {
      const word = row.prosperity || 'unsurveyed';
      if (!map.has(word)) map.set(word, 0);
      map.set(word, map.get(word) + 1);
    }
    return [...map.entries()].sort((a, b) => prosperityRank(b[0]) - prosperityRank(a[0]));
  }, [rows]);

  const exhaustion = useMemo(() => {
    const standings = warExhaustionStandings(worldState || {});
    const map = new Map();
    for (const s of standings) {
      if (!map.has(s.band)) map.set(s.band, []);
      map.get(s.band).push(s.id);
    }
    return EXHAUSTION_BANDS.map(band => ({ band, ids: map.get(band) || [] })).filter(b => b.ids.length > 0);
  }, [worldState]);

  if (rows.length === 0) return null;
  const hasPopulation = rows.some(row => Number.isFinite(row.population));

  return (
    <div data-testid="realm-comparisons" style={{ display: 'grid', gap: SP.sm }}>
      <Question heading="The realm by tier, and who is at peace">
        {byTier.map(([tier, tierRows]) => {
          const segments = WAR_SEGMENTS.map(seg => ({ ...seg, count: tierRows.filter(r => r.war === seg.clause).length }));
          const parts = segments.filter(s => s.count > 0).map(s => `${s.count} ${s.word}`);
          // DM-instrument numeric: the per-tier population total, only when the
          // deriver built population at all (a proven owner session).
          const pop = hasPopulation ? tierRows.reduce((sum, r) => sum + (r.population || 0), 0) : null;
          const plural = tierRows.length === 1 ? tier : `${tier}s`;
          const sentence = `${tierRows.length} ${plural}: ${parts.join(', ')}${pop != null ? ` · ${pop} folk` : ''}.`;
          return <BarRow key={tier} testid="comparison-tier-row" label={tier} sentence={sentence} segments={segments} total={tierRows.length} />;
        })}
      </Question>

      <Question heading="Where prosperity sits">
        {byProsperity.map(([word, count]) => (
          <BarRow
            key={word}
            testid="comparison-prosperity-row"
            label={word}
            sentence={`${count} settlement${count === 1 ? '' : 's'} read${count === 1 ? 's' : ''} ${word}.`}
            segments={[{ color: GOLD, count }]}
            total={rows.length}
          />
        ))}
      </Question>

      {exhaustion.length > 0 && (
        <Question heading="How worn the realm is">
          {exhaustion.map(({ band, ids }) => (
            <BarRow
              key={band}
              testid="comparison-exhaustion-row"
              label={band}
              sentence={`${ids.map(nameFor).join(', ')} ${ids.length === 1 ? 'stands' : 'stand'} ${band}.`}
              segments={[{ color: band === 'exhausted' ? RED : band === 'war-weary' ? GOLD : GREEN, count: ids.length }]}
              total={rows.length}
            />
          ))}
        </Question>
      )}
      <div style={{ color: BODY, fontFamily: sans, fontSize: FS.micro, fontStyle: 'italic', background: CARD_ALT, padding: '4px 8px' }}>
        Each picture answers one question, from the register&apos;s own rows. A quiet ledger asks nothing.
      </div>
    </div>
  );
}
