import { Surface, Display, Eyebrow, Rubric, Ink } from '../Manuscript.jsx';
import Rule from '../Rule.jsx';
import { libraryFixture as lib } from './fixtures.js';

/**
 * LibrarySample — THE INSTRUMENT REGISTER (Organic Craft law §2). The library is an
 * OPERATED surface (open / advance / export under a glance), so it stays orthodox
 * and quiet — a machined ledger, not an in-fiction artifact. It still speaks the one
 * type/ink/rubric system (that is what unifies the app), but it spends NO rebellion
 * budget on interaction: no dropcap, no cartouche. This sample sits beside the
 * dossier to show the split — the master pattern every studied success obeys.
 *
 * The ledger idiom (a genuinely tabular comparison surface): feint row rules that
 * recede, headers stated ONCE, the health carried by a rubric word + a pip (never
 * colour alone), one quiet "Open" instrument per row.
 */

const HEALTH_GLYPH = { thriving: '●', steady: '◐', strained: '◑', embattled: '○' };

function HealthPip({ health }) {
  return (
    <span className="oc-pip" aria-hidden="true">{HEALTH_GLYPH[health] || '·'}</span>
  );
}

export default function LibrarySample({ posture = 'desk' }) {
  return (
    <Surface posture={posture} as="section" className="oc-library">
      <header>
        <Eyebrow>Your settlements</Eyebrow>
        <Display size="l" as="h1">Library</Display>
        <p><Ink tone="secondary">Your saved settlements and campaigns. Reopen a town, advance its world, or export a dossier for the table.</Ink></p>
      </header>

      {/* Quota strip — an instrument, stated plainly. */}
      <p className="oc-library__quota">
        <Rubric>{lib.quota.tier}</Rubric>{'  ·  '}
        <Ink tone="body" className="oc-tnum">{lib.quota.used}</Ink>
        <Ink tone="secondary"> of {lib.quota.max} saved</Ink>
      </p>

      {/* The instrument toolbar — quiet controls, orthodox affordances. (Static
          preview: the controls are presentational; the live surface wires the real
          input/menu primitives.) */}
      <div className="oc-library__toolbar">
        <span className="oc-control oc-control--input">Search settlements</span>
        <span className="oc-control">Sort: Recent ▾</span>
        <span className="oc-control">Filters ▾</span>
        <span className="oc-control">Select</span>
      </div>

      <Rule variant="single" />

      {/* The ledger — a real table (a genuinely tabular comparison surface, so
          horizontal-scroll-in-container is the sanctioned narrow behaviour), one
          register, headers stated once, feint row rules. */}
      <div className="oc-ledger-scroll">
        <table className="oc-ledger">
          <caption className="oc-visually-hidden">Saved settlements</caption>
          <thead>
            <tr>
              <th scope="col" className="oc-rubric">Settlement</th>
              <th scope="col" className="oc-rubric">Tier</th>
              <th scope="col" className="oc-rubric">Phase</th>
              <th scope="col" className="oc-rubric">Standing</th>
              <th scope="col"><span className="oc-visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {lib.rows.map((r) => (
              <tr key={r.name}>
                <td>
                  <Ink tone="strong">{r.name}</Ink>
                  {r.campaign && <Ink tone="secondary" className="oc-ledger__campaign"> · {r.campaign}</Ink>}
                  <div className="oc-ledger__signal"><Ink tone="secondary">{r.signal}</Ink></div>
                </td>
                <td><Ink tone="body">{r.tier}</Ink></td>
                <td>{r.phase === 'Canon' ? <Rubric>Canon</Rubric> : <Ink tone="secondary">Draft</Ink>}</td>
                <td className="oc-ledger__standing"><HealthPip health={r.health} /> <Ink tone="body">{r.health}</Ink></td>
                <td className="oc-ledger__actions"><span className="oc-btn">Open</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}
