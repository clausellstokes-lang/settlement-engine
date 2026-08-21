import { Surface, Display, Eyebrow, Rubric, Prose, Ink } from '../Manuscript.jsx';
import Rule from '../Rule.jsx';
import { deitiesFixture as pantheon } from './fixtures.js';

/**
 * CompendiumSample — THE REFERENCE REGISTER (Organic Craft law §2/§3). A Compendium
 * hub (Deities) as a scholar's catalog: the entry NAME in the display serif, the
 * portfolio as reading prose, and the apparatus — rank / alignment / domain — in the
 * rubric voice, stated once per entry, ruled between entries with feint hairlines.
 * A reference surface reads mostly as an artifact (it is READ, not operated at
 * speed), but its one control — the rank filter — stays a quiet instrument.
 */

const ALIGN_TONE = { Good: 'body', Neutral: 'secondary', Evil: 'strong' };

export default function CompendiumSample({ posture = 'desk' }) {
  return (
    <Surface posture={posture} as="section" className="oc-compendium oc-prose-host">
      <header>
        <Eyebrow>Compendium</Eyebrow>
        <Display size="l" as="h1">Deities</Display>
        <Prose wide><p>{pantheon.intro}</p></Prose>
      </header>

      {/* The one instrument — a quiet rank filter (segmented; presentational in
          the static sample, wired to real controls on the live surface). */}
      <div className="oc-segmented">
        <span className="oc-segmented__opt oc-segmented__opt--on">All</span>
        <span className="oc-segmented__opt">Major</span>
        <span className="oc-segmented__opt">Minor</span>
        <span className="oc-segmented__opt">Cult</span>
      </div>

      <Rule variant="single" />

      <div className="oc-catalog">
        {pantheon.entries.map((e, i) => (
          <article key={e.name} className="oc-catalog__entry">
            {i > 0 && <Rule variant="hairline" />}
            <div className="oc-catalog__head">
              <Display size="s" as="h2">{e.name}</Display>
              <span className="oc-catalog__rank"><Rubric>{e.rank}</Rubric></span>
            </div>
            <Prose><p>{e.portfolio}.</p></Prose>
            <p className="oc-catalog__tags">
              <Rubric>Alignment</Rubric> <Ink tone={ALIGN_TONE[e.alignment] || 'body'}>{e.alignment}</Ink>{'   '}
              <Rubric>Domain</Rubric> <Ink tone="body">{e.domain}</Ink>{'   '}
              <Rubric>Temper</Rubric> <Ink tone="secondary">{e.temperament}</Ink>
            </p>
          </article>
        ))}
      </div>
    </Surface>
  );
}
