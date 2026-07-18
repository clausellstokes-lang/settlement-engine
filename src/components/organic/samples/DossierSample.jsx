import { Surface, Display, Eyebrow, Rubric, Prose, Ink } from '../Manuscript.jsx';
import { Register, Marginalia } from '../Register.jsx';
import Rule from '../Rule.jsx';
import { SeededCartouche } from '../Ornament.jsx';
import { dossierFixture as d } from './fixtures.js';

/**
 * DossierSample — THE ARTIFACT REGISTER (Organic Craft law §2/§3). The settlement
 * dossier re-composed as a page the surveyor drew: manuscript grammar (scale · ink
 * density · rubric replace boxes), a seeded cartouche + house emblem, a dropcap
 * opening, a ruled situation register (not cards), and provenance marginalia in the
 * gloss channel. `field` swaps the whole surface to the dim field-notebook ramp
 * (the mobile FIELD-MODE sample renders the same component with field + a compact
 * posture). Posture is injected so it renders deterministically for the fixture.
 */

// Deterministic thousands separator (NO toLocaleString — that reads host locale
// and would fork the byte-stable sample golden across machines).
const commas = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function ScoreRegister({ rows }) {
  // A real ruled register (native table semantics) — feint row rules, the score
  // right-aligned as a tabular figure. The ledger alternative to three cards.
  return (
    <table className="oc-score-register">
      <caption className="oc-visually-hidden">Current situation</caption>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <th scope="row" className="oc-rubric">{r.label}</th>
            <td className="oc-score-register__note"><Ink tone="secondary">{r.note}</Ink></td>
            <td className="oc-score-register__num"><Ink tone="strong">{r.score}</Ink><Ink tone="secondary"> / 100</Ink></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function DossierSample({ field = false, posture = 'desk' }) {
  const gloss = (
    <>
      <Marginalia label="Whence these numbers?" open>
        {d.provenance.map((p, i) => <p key={i}>{p}</p>)}
      </Marginalia>
      <p><Ink tone="secondary">Recorded on the coast road, at the toll-gate, in fair weather. — S.</Ink></p>
    </>
  );

  return (
    <Surface field={field} posture={posture} as="article" className="oc-dossier oc-prose-host">
      <header>
        <Eyebrow>A surveyor’s dossier</Eyebrow>
        {/* The cartouche's own device medallion IS the settlement's mark — no
            second emblem beside it (review revision: the flex-wrapped duplicate
            rendered as an orphaned glyph below the plate at field widths). */}
        <div className="oc-dossier__plate">
          <SeededCartouche seed={d.name} mode={field ? 'field' : 'light'} width={300} height={88}>
            <Display size="xl" as="h1">{d.name}</Display>
          </SeededCartouche>
        </div>
        <p className="oc-dossier__facts">
          <Rubric>Tier</Rubric> <Ink>{d.tier}</Ink>{'  ·  '}
          <Rubric>Souls</Rubric> <Ink className="oc-tnum">{commas(d.population)}</Ink>{'  ·  '}
          <Ink tone="secondary">{d.tradeAccess}</Ink>
        </p>
        <p><Ink tone="secondary" className="oc-i">“{d.character}”</Ink></p>
        <Rule variant="double" />
      </header>

      <Register gloss={gloss}>
        <section>
          <Rubric variant="sectionLabel">Arrival</Rubric>
          <Prose dropcap><p>{d.arrival}</p></Prose>
        </section>

        <Rule variant="swelled" />

        <section>
          <Rubric variant="sectionLabel">The current situation</Rubric>
          <ScoreRegister rows={d.situation} />
        </section>

        <section className="oc-crisis">
          <Rubric variant="sectionLabel">Active crisis — {d.crisis.label}</Rubric>
          <Prose><p>{d.crisis.summary}</p></Prose>
          <p><Rubric variant="instruction">The hook.</Rubric> <Ink tone="body">{d.crisis.hook}</Ink></p>
        </section>

        <Rule variant="single" />

        <section className="oc-figures">
          <Rubric variant="sectionLabel">Key figures</Rubric>
          {d.npcs.map((n) => (
            <p key={n.name}>
              <Ink tone="strong">{n.name}</Ink>{' — '}<Ink tone="secondary">{n.role}. </Ink>
              <Ink tone="body" className="oc-i">{n.trait}</Ink>
            </p>
          ))}
        </section>

        <section>
          <Rubric variant="sectionLabel">Plot hooks</Rubric>
          <ol className="oc-hooks">
            {d.hooks.map((h, i) => <li key={i}><Ink tone="body">{h}</Ink></li>)}
          </ol>
        </section>

        <section>
          <Rubric variant="sectionLabel">Institutions</Rubric>
          <p><Ink tone="body">{d.institutions.join('  ·  ')}</Ink></p>
        </section>
      </Register>

      <footer className="oc-dossier__foot">
        <Rule variant="single" />
        <p><Ink tone="secondary">Surveyed for the table. State, never fate — the engine records what happened; the fate of any named soul is yours to decide.</Ink></p>
      </footer>
    </Surface>
  );
}
