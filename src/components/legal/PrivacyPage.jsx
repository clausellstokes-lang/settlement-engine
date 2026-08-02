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
          'Operator communications: service notices and announcements sent to your Account, plus whether you opened or dismissed them in the product. Direct notices are addressed to your account; broadcasts are one shared operator record.',
          'Consent history: when you change a privacy setting, we keep the setting changed, its prior and new values, and the time of the change as a compliance record.',
          'Essential product telemetry: cookieless usage signals that keep the app working and let us find and fix problems. This is on by default and turns off if your browser sends Do Not Track, or if you opt out.',
          'Research structure: anonymous, structural snapshots of generated settlements that help improve the generator. This tier is on by default (opt-out) and reversible at any time.',
        ]} />
      </LegalSection>

      <LegalSection heading="What we never collect" id="privacy-never">
        <LegalP>
          Your private campaign text, NPC secrets, and personal notes are never
          collected. The research tier captures settlement structure only, never
          names, prose, or secrets. Generation seeds and private configuration are
          never exposed on shared or gallery surfaces. We do not sell your
          personal data; if you opt in to anonymous market research, aggregate
          structural statistics may be shared or licensed to the worldbuilding
          market: never your names, prose, seeds, or campaign content, and never
          anything tied to you.
        </LegalP>
        <LegalP>
          We do not place tracking pixels in email or measure email opens. Message
          receipts may be created when a notice reaches Account Messages or its
          email courier. An in-product read is recorded only when you open that
          message's detail. These are service records, not product analytics.
          Message bodies never enter analytics.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Your consent and control" id="privacy-consent">
        <LegalP>
          Telemetry consent has four plain-language settings in Account then
          Privacy and data: essential product telemetry, the anonymous research
          contribution, an opt-in anonymous market-research tier, and a reserved
          AI-prose research tier that is off and collects nothing today. The
          research contribution is on by default and the opt-out is silent, with
          no pop-up, so you are never nagged. The market-research tier is off by
          default and covers aggregate, anonymous structure only. You can change
          any of these there whenever you like, and your choice is remembered.
          Each signed-in change also creates a durable consent-history record so
          the basis for the setting can be audited without relying on analytics.
        </LegalP>
        <LegalP>
          If your browser sends a Do Not Track signal, we honor it as a full
          opt-out of all telemetry, including the essential tier, regardless of
          these toggles. Every research snapshot is stamped with the version of
          the consent model it was captured under, so its basis is auditable.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Messages and email" id="privacy-messages">
        <LegalP>
          Account Messages is the source of truth for communications from
          SettlementForge. Service messages, such as security, policy, account, or
          moderation notices, appear there and may also be sent to your account
          email even if you turn off marketing email. Announcements always appear
          in Account Messages, but are emailed only after you explicitly opt in to
          Product updates. Every announcement email includes an unsubscribe link.
        </LegalP>
        <LegalP>
          Messages are one-way. If you reply, SettlementForge opens the existing
          support-ticket flow and links it to the message; it does not create a
          second private-messaging system.
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
          choices. When you are signed in, your consent settings are also mirrored
          to your account so an opt-out follows you across devices.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Deleting your data" id="privacy-deletion">
        <LegalP>
          You can delete settlements and unpublish shared content from your
          account at any time; that removes them immediately. Your Account data
          export includes messages received, their in-product receipts, and your
          consent-change history. To request deletion of your account, use Account
          then Data and privacy (or contact support). After a
          short grace window your sign-in is removed, billing stops, and your
          profile is irreversibly anonymised and locked. The anonymised shell
          can never be signed into or written to again. Some records required to
          meet legal or tax obligations, such as payment receipts, may be
          retained for the period the law requires. Deletion removes your direct
          notices, message receipts, and consent history; shared broadcast records
          remain as operator records without a receipt tied to you.
        </LegalP>
        <LegalP>
          If a paid plan lapses, settlements and maps created under it enter a
          three-month retention window. Export or delete them during that window,
          or resubscribe to keep them; when the window ends they are permanently
          cleared.
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
