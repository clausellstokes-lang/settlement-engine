/**
 * legal/PrivacyPage.jsx — /privacy. Describes the ACTUAL data model: cookieless
 * essential telemetry, the anonymous research-structure tier (consent model v2,
 * opt-out and silent), what is never collected, and how to control or delete
 * your data. Not yet reviewed legal text (see the under-review banner).
 */
import LegalPage, { LegalSection, LegalP, LegalList } from './LegalPage.jsx';
import { supportMailto } from '../../copy/support.js';

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="What SettlementForge collects, what it never collects, and how you stay in control."
    >
      <LegalSection heading="What we collect" id="privacy-collect">
        <LegalP>
          We keep data collection deliberately small and honest:
        </LegalP>
        <LegalList items={[
          'Account data: if you register, your email address and account settings. Recovery answers are stored so you can regain access.',
          'Essential product telemetry: cookieless usage signals that keep the app working and let us find and fix problems. This is on by default and turns off if your browser sends Do Not Track, or if you opt out.',
          'Research structure: anonymous, structural snapshots of generated settlements that help improve the generator. This tier is on by default (opt-out) and reversible at any time.',
        ]} />
      </LegalSection>

      <LegalSection heading="What we never collect" id="privacy-never">
        <LegalP>
          Your private campaign text, NPC secrets, and personal notes are never
          collected. The research tier captures settlement structure only, never
          names, prose, or secrets. Generation seeds and private configuration are
          never exposed on shared or gallery surfaces. We do not sell your data.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Your consent and control" id="privacy-consent">
        <LegalP>
          Telemetry consent has three plain-language settings in Account then
          Privacy and data: essential product telemetry, the anonymous research
          contribution, and a reserved AI-prose research tier that is off and
          collects nothing today. The research contribution is on by default and
          the opt-out is silent, with no pop-up, so you are never nagged. You can
          turn it off there whenever you like, and your choice is remembered.
        </LegalP>
        <LegalP>
          If your browser sends a Do Not Track signal, we honor it as a full
          opt-out of all telemetry, including the essential tier, regardless of
          these toggles. Every research snapshot is stamped with the version of
          the consent model it was captured under, so its basis is auditable.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Payments" id="privacy-payments">
        <LegalP>
          Purchases and subscriptions are processed by Stripe. Your card details
          go to Stripe, not to us. We store only the record of what you bought and
          the entitlement it granted, so we can honor it.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Cookies and local storage" id="privacy-cookies">
        <LegalP>
          Our analytics are cookieless. We use your browser’s local storage to
          keep you signed in and to remember settings such as your telemetry
          choices. These stay on your device.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Deleting your data" id="privacy-deletion">
        <LegalP>
          You can delete settlements and unpublish shared content from your
          account at any time. To request deletion of your account and its
          associated data, contact us from the address on your account and we
          will remove it. Some records required to meet legal or tax obligations,
          such as payment receipts, may be retained for the period the law
          requires.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Changes" id="privacy-changes">
        <LegalP>
          We may update this policy as the product changes. Substantive changes
          bump the version stamped at the top of this page.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Contact" id="privacy-contact">
        <LegalP>
          Questions about your privacy or a deletion request? Reach us at{' '}
          <a href={supportMailto('Privacy question')}>our support inbox</a>.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
