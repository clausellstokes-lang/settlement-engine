/**
 * legal/BountyPage.jsx — R-9 THE CONTRADICTION BOUNTY (/bounty).
 *
 * The product's confidence, made a public invitation: every fact the world states
 * traces to a cause. If you ever find a receipt that does not trace — a claim the
 * world cannot back with its own history — tell us. A coherence bug turned into a
 * standing challenge. Carries the support-surface line (the single support address,
 * via copy/support.supportMailto — no PII scattered in the UI).
 */
import Page from '../primitives/Page.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import { LegalSection, LegalP, LegalList } from './LegalPage.jsx';
import { PROSE_MAX, GOLD_DEEP, sans, FS, SP } from '../theme.js';
import { supportMailto } from '../../copy/support.js';

const linkStyle = { color: GOLD_DEEP, fontFamily: sans, fontWeight: 600 };

export default function BountyPage() {
  return (
    <Page max={PROSE_MAX}>
      <PageHeader
        eyebrow="A standing invitation"
        title="The Contradiction Bounty"
        subtitle="Find a receipt that doesn’t trace. Tell us."
      />

      <LegalSection heading="Every claim carries its enforcer" id="bounty-claim">
        <LegalP>
          This world is built on one promise: nothing it states is left unexplained. Every event
          has a cause, every figure a source, every consequence a receipt you can follow back to the
          decision that made it. A famine traces to a failed harvest; a coup traces to the coin that
          bought it. The world is meant to be legible all the way down.
        </LegalP>
      </LegalSection>

      <LegalSection heading="The bounty" id="bounty-invite">
        <LegalP>So we invite you to try to break that promise. Send us:</LegalP>
        <LegalList items={[
          'A receipt that does not trace — a stated fact with no cause you can follow.',
          'A number that contradicts the history that supposedly produced it.',
          'A claim on any page that the product cannot actually back.',
        ]} />
        <LegalP>
          Include the world seed and what you were looking at, if you can &mdash; the seed is the
          world, bit for bit, so a seed lets us stand exactly where you stood.
        </LegalP>
      </LegalSection>

      <LegalSection heading="How to report it" id="bounty-report">
        <LegalP>
          Write to{' '}
          <a href={supportMailto('Contradiction bounty — a receipt that does not trace')} style={linkStyle}>
            our support inbox
          </a>{' '}
          with the details above. We read every one. Finding the world in a contradiction is not a
          failure of the tool &mdash; it is exactly the thing we most want to know.
        </LegalP>
      </LegalSection>

      <p style={{ marginTop: SP.xl, fontFamily: sans, fontSize: FS.sm, color: GOLD_DEEP, fontStyle: 'italic' }}>
        A world that can be checked is a world you can trust at the table.
      </p>
    </Page>
  );
}
