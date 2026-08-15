# SettlementForge — Privacy Policy (redraft)

> **DRAFT — PENDING LEGAL REVIEW; NOT IN FORCE.**
>
> This is an internal working draft, not the live policy and binding no one. The live
> policy is `src/components/legal/PrivacyPage.jsx` (`/privacy`); this draft does not
> change it. It **ships only through the consolidated pre-launch legal consult** (the
> same review that clears the founder-payout classification and the enrichment-rider
> conditionality check). No section is in effect until the owner and counsel sign off
> and the live page is updated to match.
>
> Placeholders are wrapped in `[[ ... ]]` and collected at the end. This draft aligns
> the privacy policy with the Terms of Use draft (`TERMS_OF_USE_DRAFT.md`) and, per the
> §4b purpose-limitation guard, **names every consent purpose explicitly — including
> the Aggregate Interest Atlas.**

---

## 1. Our approach

We keep data collection deliberately small and honest. Settlements are simulated from
constraints; your private campaign material is not the product. This policy describes
what we collect, what we never collect, the specific purposes you consent to, how the
AI features (when they launch) handle data, and how you stay in control.

*(Source of truth: live `PrivacyPage.jsx`; consent model in `src/lib/consent.js` and
`src/components/PrivacySettings.jsx`.)*

## 2. What we collect

- **Account data.** If you register: your email address, account settings, and stored
  recovery answers (so you can regain access).
- **Operator communications and service records.** Messages SettlementForge sends to
  your Account inbox, whether you have read them, your current communication choices,
  and durable prior/new records when telemetry choices change. Message bodies are
  service content, not analytics events.
- **Essential product telemetry.** Cookieless, pseudonymous usage signals that keep the
  app working and show where users get stuck. On by default; turns off if your browser
  sends Do Not Track or if you opt out.
- **Research-structure snapshots.** Anonymous, structural snapshots of generated
  settlements (tiers, counts, conditions) that help improve the generator — never names,
  prose, or secrets. On by default (opt-out), reversible any time.
- **Payment records.** We store the record of what you bought and the entitlement it
  granted, so we can honor it. Card details go to Stripe, not to us.

*(Source of truth: `PrivacyPage.jsx#privacy-collect`; `PrivacySettings.jsx`;
`consent.js`.)*

## 3. The purposes you consent to (named explicitly)

Telemetry and research consent has **four** plain-language settings in **Account →
Privacy and data.** Each is a distinct, separately controlled purpose:

1. **Product analytics (`essential`).** Cookieless, pseudonymous usage events that show
   which features land and where new users get stuck. **On by default;** turns off with
   Do Not Track or opt-out.
2. **Generator research (`research`).** Anonymous **structural** data — tiers, counts,
   conditions — used **to improve the generator.** Never names, prose, or secrets.
   **On by default (opt-out);** one click to turn off; Do Not Track is a hard override.
3. **Aggregate market research — the Aggregate Interest Atlas (`market`).** Anonymous,
   **k-anonymous, id-free** aggregates of which systems and settlement shapes players
   build, **which may be shared or licensed to the worldbuilding market** (developer /
   worldbuilder insights). **This is a distinct external-sharing purpose, opt-IN and OFF
   by default** — being a user does not enroll you. **Only theme, category, and count
   aggregates ever leave; your verbatim creations are your intellectual property and
   never do.** Aggregates publish externally only where the population clears the
   k-anonymity floor. Do Not Track is a hard override.
4. **AI-prose research (`ai_prose`) — reserved.** Off today and collects nothing; shown
   so the settings do not churn when it becomes available.

**Do Not Track** is honored as a full opt-out of all telemetry (including the essential
tier), regardless of these toggles. Every research snapshot is stamped with the version
of the consent model it was captured under, so its basis is auditable; consent
downgrades apply going forward, and full erasure goes through account deletion.

> **§4b purpose-limitation guard (binding).** The Aggregate Interest Atlas is named here
> as its **own** consent purpose **before** collection for that purpose begins — external
> sharing is never retrofitted onto data collected for product improvement. Only
> theme/category/count aggregates are ever shared externally; verbatim user creations
> never are. *(Source: `docs/DESIGN_CONTENT_PLANE.md` §4b; `consent.js`
> `market` plane; `PrivacySettings.jsx`.)*

## 4. What we never collect

Your private campaign text, NPC secrets, and personal notes are never collected. The
research and market tiers capture settlement **structure** and **aggregate categories**
only — never names, prose, or secrets. Generation seeds and private configuration are
never exposed on shared or gallery surfaces. We do not put tracking pixels in email,
record email opens, or copy operator-message bodies into analytics. Account-message
read receipts and consent-change history are operational service records, kept outside
the analytics event stream. **We do not sell your data.**

*(Source of truth: `PrivacyPage.jsx#privacy-never`; the fail-closed public-projection
rule in `DESIGN_AI_CONTROL_SURFACE.md` §1.)*

## 5. AI features and your data (the Surveyor — takes effect at launch)

> The Surveyor AI control surface is designed but **not yet available.** The commitments
> below take effect when it launches and describe how it is built to handle data.

- **The Forgetting Law.** The model that answers your requests retains nothing of your
  world beyond the request. Each request is stateless. **Providers we use must never use
  your inputs or outputs to train their models, and provider retention is contractually
  bounded — zero where the provider offers it;** any bounded abuse-monitoring window is
  disclosed and no more is claimed. **These statements never exceed the provider's actual
  current contract** — the exact wording is set from live provider terms at
  implementation. *(Source: `DESIGN_AI_CONTROL_SURFACE.md` §3e.)*
- **Our own AI audit records store hashes and category labels, not your content.**
- **Bring your own key (BYOK).** If you supply your own provider key, it is held in
  encrypted server-side storage only, decrypted only inside the server function per
  request, **never logged, never shown back to you, never in client or world state, and
  never used as training data;** you can rotate or delete it, and key actions are
  audited. *(Source: `DESIGN_AI_CONTROL_SURFACE.md` §3, §3e.)*
- **Service telemetry (the enrichment rider).** Each AI response carries **id-free,
  category-grade** tags (theme, intent, tier, refusal reason-class) captured on our
  servers as a byproduct of serving the request — **controlled-vocabulary categories
  only, never your content, never free text.** This category-grade telemetry is a
  **condition of using the AI features** (managed and BYOK) and is not togglable; because
  it is id-free it describes how the world-machine is used, not who used it. *(Source:
  `DESIGN_AI_CONTROL_SURFACE.md` §3f, capture layer 1.)*
- **Content-grade AI research is separately opt-in.** The fuller record — your stated
  intent, the compiled result, your corrections, and refusals as text — is collected
  **only if you opt in**, is revocable, and is deletable. *(Source:
  `DESIGN_AI_CONTROL_SURFACE.md` §3f, capture layer 2; and §3 training corpus.)*

> **Legal-review note:** the "condition of service" framing for id-free category
> telemetry needs the strict-jurisdiction conditionality / GDPR check flagged in
> `DESIGN_AI_CONTROL_SURFACE.md` §3f.

## 6. Payments

Purchases and subscriptions are processed by **Stripe.** Your card details go to Stripe,
not to us. We store only the record of what you bought and the entitlement it granted.

*(Source of truth: `PrivacyPage.jsx#privacy-payments`.)*

## 7. Cookies and local storage

Our analytics are **cookieless.** We use your browser's local storage to keep you signed
in and to remember settings such as your telemetry choices. These stay on your device.

*(Source of truth: `PrivacyPage.jsx#privacy-cookies`.)*

## 8. Your controls

- **Export.** Download your saved settlements and campaigns, the operator messages you
  received and their Account receipt state, and your consent-change history from
  Account → Data and privacy. The usual download is one JSON file. If long-lived
  service history would make that file too large to import safely, the export becomes
  a restorable account JSON plus a second complete, export-only service-record JSON;
  no service records are truncated or imported into another account.
- **Delete content.** Delete individual or all saved settlements and campaigns, and
  unpublish gallery content, from your account.
- **Delete your account.** Request account deletion from Account → Data and privacy. This
  files a **soft-delete request** processed by a server job after a short grace window,
  during which you can contact support to cancel. Some records required to meet legal or
  tax obligations, such as payment receipts, may be retained for the period the law
  requires. When deletion is processed, direct messages addressed only to you, your
  message receipts, and your consent-change history are removed. Shared broadcast
  messages remain as operator records, without your receipt or account association.
- **Consent.** Change any of the four purposes in §3 at any time; your choice is
  remembered and stamped with the consent-model version.

*(Sources of truth: `src/components/account/AccountDataPrivacySection.jsx`;
`lib/accountData.js`; `PrivacyPage.jsx#privacy-deletion`.)*

## 9. Data retention

We keep account and content data while your account is active and delete it on request
per §8, subject to legally required retention (e.g. payment/tax records). Consented
research and market records are retained at **event grain** with stable schemas (the
"collect fine, aggregate late" storage law), governed by the k-anonymity floors and the
purpose limits in §3. *(Source: `DESIGN_CONTENT_PLANE.md` §4b.)*

## 10. Children `[[PLACEHOLDER]]`

`[[Age / children's-data clause to be set at legal review, consistent with the minimum
age in the Terms §1 and the GDPR/COPPA question below.]]`

## 11. International data transfers `[[PLACEHOLDER]]`

`[[Cross-border transfer and legal-basis clause (e.g. GDPR lawful bases, standard
contractual clauses) to be supplied at legal review, tied to the operating entity and the
data processors — Stripe, hosting/Supabase, and AI providers.]]`

## 12. Changes

We may update this policy as the product changes. Substantive changes bump the version
stamped at the top of the live policy.

*(Source of truth: `PrivacyPage.jsx#privacy-changes`.)*

## 13. Contact

Questions about your privacy or a deletion request? Reach us at
`[[CONTACT EMAIL — support@settlementforge.com is selected; activate only after
MX/forwarding and a round-trip test pass. The current runtime fallback remains
settlementforge@gmail.com until that operational proof.]]`.

*(Source of truth: `src/copy/support.js`.)*

---

## 14. Summary — what each section binds, and its source of truth

| Section | What it binds | Source-of-truth doc / file |
|---|---|---|
| 2. What we collect | Account data, operator communications and service records, essential telemetry, research snapshots, payment records | `PrivacyPage.jsx#privacy-collect`; `consent.js`; `operator_messages` |
| 3. Consent purposes | The four named planes: `essential`, `research`, `market` (Atlas), `ai_prose` | `PrivacySettings.jsx`; `consent.js`; `DESIGN_CONTENT_PLANE.md` §4b |
| 3.3 Aggregate Interest Atlas | Distinct external-sharing purpose, opt-in/off; only theme/category/count aggregates leave; k-floors | `DESIGN_CONTENT_PLANE.md` §4b; `consent.js` `market` |
| 4. Never collected | No campaign text/prose/secrets/seeds, email-open tracking, or message bodies in analytics; no data sale | `PrivacyPage.jsx#privacy-never`; `PRIVACY_LOGGING.md` |
| 5. AI data handling | Forgetting Law, BYOK, id-free rider (condition of service), content-grade opt-in | `DESIGN_AI_CONTROL_SURFACE.md` §3, §3e, §3f |
| 6. Payments | Stripe processing; we store entitlement records only | `PrivacyPage.jsx#privacy-payments` |
| 7. Cookies/local storage | Cookieless; local storage for session + settings | `PrivacyPage.jsx#privacy-cookies` |
| 8. Your controls | Export including service records; delete content/account; consent; shared broadcasts retained without receipts | `AccountDataPrivacySection.jsx`; `PrivacyPage.jsx#privacy-deletion` |
| 9. Retention | Event-grain, collect-fine-aggregate-late; legal retention | `DESIGN_CONTENT_PLANE.md` §4b |
| 10. Children | Age / children's-data clause | Placeholder — legal review |
| 11. Int'l transfers | Cross-border basis (GDPR/SCCs) | Placeholder — legal review |
| 13. Contact | Support address | `copy/support.js` |

## 15. Open placeholders (must be resolved before force)

1. **`[[CONTACT EMAIL]]`** — `support@settlementforge.com` is selected.
   Operational activation still requires MX/forwarding and a successful round-trip;
   `settlementforge@gmail.com` remains the runtime fallback until then.
2. **`[[Operating entity / legal name]]`** — required for the data-controller identity.
3. **`[[Children / minimum age]]`** (§10) — consistent with Terms §1.
4. **`[[International transfers / GDPR lawful bases + SCCs]]`** (§11), naming the
   processors: Stripe, hosting/Supabase, and AI providers.
5. **Enrichment-rider conditionality / GDPR** (§5) — strict-jurisdiction check for the
   non-togglable id-free service telemetry.
6. **Aggregate Interest Atlas external-sharing basis** (§3) — confirm the licensing basis
   and k-floors with counsel before any external publication begins.

## 16. Explicit non-goal of this wave

Wiring this draft into the live `PrivacyPage.jsx` is out of scope by design. The live
page updates only after the owner and legal counsel sign off through the consolidated
pre-launch legal consult. This document and its Terms of Use sibling are the input to
that consult, not a replacement for it.
