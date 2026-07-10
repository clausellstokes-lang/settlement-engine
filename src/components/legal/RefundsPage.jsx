/**
 * legal/RefundsPage.jsx — /refunds. The real billing semantics: automatic credit
 * refunds on failed generations, the first-narrative-free grant, the single
 * dossier PDF (re-downloadable while saved, forfeited on delete), and
 * subscription cancellation. Numbers live on the Pricing page, never here (F22).
 * Not yet reviewed legal text (see the under-review banner).
 */
import LegalPage, { LegalSection, LegalP, LegalList } from './LegalPage.jsx';
import { supportMailto } from '../../copy/support.js';

export default function RefundsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refunds and Cancellation"
      subtitle="How credits, one-time purchases, and subscriptions work when something goes wrong or you change your mind."
    >
      <LegalSection heading="Narrative credits" id="refunds-credits">
        <LegalP>
          The optional Narrative Layer spends credits per generation. If a
          narration fails, its credit is returned automatically. You are only
          charged for narrations you actually receive. Your first narration is
          free: the server grants it without spending a credit.
        </LegalP>
      </LegalSection>

      <LegalSection heading="The single dossier PDF" id="refunds-dossier">
        <LegalP>
          A single dossier is a one-time purchase of a settlement’s PDF. After
          purchase the PDF is delivered on the success page, and it stays yours to
          re-download for as long as that settlement is saved. If you delete the
          settlement, the download right for it is forfeited. If a purchase is
          charged but the PDF never delivers, contact support and we will make it
          right.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Cartographer subscription" id="refunds-subscription">
        <LegalP>
          The Cartographer plan is billed monthly through Stripe. You can cancel
          at any time from your account. When you cancel, your access continues to
          the end of the billing period you have already paid for, and you are not
          charged again. We do not generally refund partial months, except where
          consumer law in your jurisdiction requires it.
        </LegalP>
      </LegalSection>

      <LegalSection heading="Founder Lifetime" id="refunds-founder">
        <LegalP>
          The Founder tier is a one-time purchase of lifetime access rather than a
          recurring subscription. If you believe you were charged in error,
          contact support with your Stripe receipt and we will review it.
        </LegalP>
      </LegalSection>

      <LegalSection heading="How to request a refund" id="refunds-request">
        <LegalP>Reaching us:</LegalP>
        <LegalList items={[
          'Contact support from the email associated with your account.',
          'Include your Stripe receipt or the reference shown on the checkout confirmation.',
          'Tell us what happened. Charges for something you never received, such as an undelivered PDF or a failed narration that did not auto-refund, are corrected.',
        ]} />
      </LegalSection>

      <LegalSection heading="Contact" id="refunds-contact">
        <LegalP>
          Billing or refund question? Reach us at{' '}
          <a href={supportMailto('Refund request')}>our support inbox</a>.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
