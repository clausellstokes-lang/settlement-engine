import { Surface, Display, Eyebrow, Rubric, Prose, Ink } from '../Manuscript.jsx';
import Rule from '../Rule.jsx';
import { pricingFixture as pr } from './fixtures.js';

/**
 * PricingSample — the pricing page RE-CHECKED under the law (§0/§2/§6). The AI-slop
 * tell is three uniform rounded shadow-cards; this composes the tiers as one ruled
 * bench where the RECOMMENDED tier carries more ink and scale (differentiated
 * anatomy, not a shadow), prices are tabular figures, the feature marks are a rubric
 * glyph (never colour alone), and the CTA is a clean instrument. The service line is
 * a rubricated aside; the one-time bundle is its own lane.
 */

function Tier({ t }) {
  return (
    <div className={`oc-tier${t.featured ? ' oc-tier--featured' : ''}`}>
      {t.featured && <div className="oc-tier__flag"><Rubric variant="entryPoint">Recommended</Rubric></div>}
      <Display size={t.featured ? 'm' : 's'} as="h2">{t.name}</Display>
      <p className="oc-tier__price">
        <Ink tone="ink" className="oc-tnum">{t.price}</Ink>{' '}
        <Ink tone="secondary">{t.cadence}</Ink>
      </p>
      <p className="oc-tier__tag"><Ink tone="secondary">{t.tagline}</Ink></p>
      <ul className="oc-tier__features">
        {t.features.map((f, i) => (
          <li key={i}><span className="oc-tier__mark" aria-hidden="true">†</span> <Ink tone="body">{f}</Ink></li>
        ))}
      </ul>
      {/* Presentational in the static sample; the live tier card wires the real
          Button primitive with its checkout action. */}
      <span className={`oc-btn${t.featured ? ' oc-btn--primary' : ''}`}>{t.cta}</span>
    </div>
  );
}

export default function PricingSample({ posture = 'desk' }) {
  return (
    <Surface posture={posture} as="section" className="oc-pricing">
      <header>
        <Eyebrow>Plans</Eyebrow>
        <Display size="l" as="h1">Pricing</Display>
        <p><Ink tone="secondary">{pr.noHiddenFees}</Ink></p>
        <Rule variant="double" />
      </header>

      <div className="oc-tiers">
        {pr.tiers.map((t) => <Tier key={t.name} t={t} />)}
      </div>

      <p className="oc-pricing__service">
        <Rubric variant="instruction">A service, not a feature key.</Rubric>{' '}
        <Ink tone="secondary">{pr.serviceLine}</Ink>
      </p>

      <Rule variant="swelled" />

      {/* The one-time lane — its own composition, not a fourth card. */}
      <div className="oc-bundle">
        <div className="oc-bundle__body">
          <Rubric variant="sectionLabel">One-time — no subscription</Rubric>
          <Display size="s" as="h2">{pr.bundle.name}</Display>
          <Prose wide><p>{pr.bundle.body}</p></Prose>
        </div>
        <div className="oc-bundle__price">
          <Ink tone="ink" className="oc-tnum">{pr.bundle.price}</Ink>
          <span className="oc-btn">Forge a settlement</span>
        </div>
      </div>
    </Surface>
  );
}
