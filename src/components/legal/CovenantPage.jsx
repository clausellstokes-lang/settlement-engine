/**
 * legal/CovenantPage.jsx — R-7 THE PORTABILITY COVENANT (/covenant).
 *
 * "Your world is yours." A public promise of local-first, export, and no lock-in
 * — and CLAIMS-PARITY BINDING: every promise on this page is one the code already
 * keeps. Each claim maps to a real capability (anchored + pinned in
 * tests/components/covenantClaimsParity.test.js): generate without an account,
 * export everything as JSON (lib/accountData.downloadAccountExport), import it
 * back (importAccountData), bind a settlement to a PDF (pdf/SettlementPDF), and
 * delete your data (requestAccountDeletion). If a capability is removed, the pin
 * reddens — the covenant can never over-promise.
 */
import Page from '../primitives/Page.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import { LegalSection, LegalP, LegalList } from './LegalPage.jsx';
import { PROSE_MAX, GOLD_DEEP, sans, FS, SP } from '../theme.js';

const linkStyle = { color: GOLD_DEEP, fontFamily: sans, fontWeight: 600 };

export default function CovenantPage() {
  return (
    <Page max={PROSE_MAX}>
      <PageHeader
        eyebrow="Your world is yours"
        title="The Portability Covenant"
        subtitle="A world you build here is yours to keep, to carry, and to leave with."
      />

      <LegalSection heading="It begins on your device" id="covenant-local">
        <LegalP>
          You can generate and save settlements without ever making an account. Your worlds live
          in your browser; you sign in only when you want them kept in the cloud and carried
          between devices. Nothing here holds your worlds hostage to a login.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Take it with you" id="covenant-export">
        <LegalP>Everything you make, you can carry out — in plain, open formats:</LegalP>
        <LegalList items={[
          'Export every settlement and campaign you own as a single JSON file, any time, from your account.',
          'Import that file back — into this browser, another machine, or a fresh account. A world that leaves can return.',
          'Bind any settlement into a PDF dossier to keep, print, or hand across the table.',
        ]} />
      </LegalSection>

      <LegalSection heading="Delete means gone" id="covenant-delete">
        <LegalP>
          You can delete your settlements and campaigns, or ask to close your account entirely. What
          you remove is removed — we do not keep a shadow copy to win you back.
        </LegalP>
      </LegalSection>

      <LegalSection heading="No lock-in" id="covenant-nolockin">
        <LegalP>
          The simulation is deterministic: the same seed makes the same world, everywhere. Your
          data is not a hostage and your history is not a trade secret. If a receipt ever fails to
          trace, that is a bug we want to hear about &mdash; see the{' '}
          <a href="/bounty" style={linkStyle}>Contradiction Bounty</a>.
        </LegalP>
      </LegalSection>

      <p style={{ marginTop: SP.xl, fontFamily: sans, fontSize: FS.sm, color: GOLD_DEEP, fontStyle: 'italic' }}>
        Build a world worth keeping. It will always be yours to keep.
      </p>
    </Page>
  );
}
