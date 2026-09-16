# SettlementForge — Anti-Automation & Systems-Integrity Clauses

> **DRAFT FOR THE OWNER'S LEGAL CONSULT — NOT LEGAL ADVICE, NOT IN FORCE.**
> This document is a plain-language *input* for a qualified attorney to review,
> adapt, and (where appropriate) fold into the Terms of Use. It was drafted by an
> engineer to capture the *technical* abuse surface the Terms should address; the
> exact enforceable wording, jurisdictional fit, and consumer-law compliance are
> the attorney's call. Nothing here binds SettlementForge or any user until
> counsel has reviewed it and the owner has published finalized Terms.
>
> **Relationship to the other legal drafts.** The main Terms redraft lives at
> `docs/legal/TERMS_OF_USE_DRAFT.md` and already carries a high-level acceptable-use
> section (§9) and an anti-extraction clause (§6g). A separate `claude/tos-redraft`
> branch is the active home of that redraft — **this file does not modify it.** The
> clauses below are the *deeper, specific* anti-automation language that §9 / §6g
> reference at a high level; counsel can slot them in as expansions of those
> sections or as a new "Automated access and systems integrity" section.
>
> **What these clauses can and cannot do (read this first).** Terms of Use are a
> *contractual* control. They deter, they establish the ground for suspension and
> civil remedy, and they document that access is conditioned on compliance — but
> they do **not** technically prevent anything. The technical perimeter (robots
> directives, `X-Robots-Tag` / `TDM-Reservation` headers, server-side rate limits,
> the human-verification seam, WAF/bot filtering at the host) is what actually
> throttles abuse; see `docs/PERIMETER_RUNBOOK.md`. Voluntary-compliance crawlers
> honor the directives; hostile actors and user-credentialed AI agents do not, and
> the latter are indistinguishable from the user at the wire. The Terms are the
> layer that makes non-compliance a *breach* rather than merely unwelcome.

---

## 1. Definitions (proposed)

Counsel to confirm and tighten. The Terms already define "Service"; these add:

- **"Automated Means"** — any robot, spider, crawler, scraper, script, headless
  browser, browser-automation framework, bot, agent, or other software or process
  that accesses, reads, or interacts with the Service without a natural person
  contemporaneously directing each request through the Service's own interface.
- **"AI/ML Development"** — training, fine-tuning, pre-training, evaluating,
  grounding, retrieval-augmenting, or otherwise developing or improving any
  machine-learning model, foundation model, or generative-AI system.
- **"Text and Data Mining" ("TDM")** — any automated analytical technique aimed at
  analyzing text and data in digital form to generate information, including
  patterns, trends, and correlations (aligned with the definition used in the EU
  DSM Directive so the reservation is legible to EU-facing crawlers).
- **"Generated Content"** — the settlements, realms, maps, dossiers, narratives,
  NPCs, histories, and other outputs the Service produces from the deterministic
  simulation and the AI control surface.
- **"Bulk Generation"** — invoking the generation, simulation, export, or AI
  surfaces at a volume, rate, or concurrency that a natural person using the
  interface in good faith would not produce.

---

## 2. Clause A — Prohibited automated access and scraping

> You may access the Service only through the interfaces SettlementForge provides
> and only as a natural person (or, for a team plan, natural persons acting for the
> account holder). You must not, and must not permit or enable any third party or
> software to:
>
> (a) access, query, or interact with the Service by Automated Means, except (i) a
> general-purpose search-engine or social-unfurl crawler operating in compliance
> with the Service's published `robots.txt`, or (ii) any integration
> SettlementForge separately authorizes in writing;
>
> (b) scrape, harvest, copy, index, cache (beyond an ordinary browser cache),
> republish, or create a database or collection from the Service, its pages, its
> public gallery, or the Generated Content;
>
> (c) use, run, or facilitate any data-extraction, site-mirroring, or content-
> aggregation tool against the Service;
>
> (d) access non-public areas, accounts, systems, or Generated Content that are not
> yours, or probe, scan, or map the Service or its infrastructure; or
>
> (e) frame, mirror, or embed the Service or substantial portions of it, or remove,
> obscure, or alter any proprietary notice.

*Engineering note for counsel:* the public gallery and marketing pages are
**intentionally** readable by humans and by general search / social crawlers — that
is the acquisition funnel. The prohibition targets *automated bulk* access and
AI-oriented crawling, not a person reading a shared dossier link. Please preserve
that distinction so the clause does not read as prohibiting ordinary sharing.

---

## 3. Clause B — Reservation against AI/ML training and text-and-data-mining

> SettlementForge expressly reserves all rights in the Service, its pages, and the
> Generated Content against Text and Data Mining and AI/ML Development. You must
> not, and must not permit any third party or model to, use, collect, or ingest any
> part of the Service or the Generated Content for AI/ML Development or TDM. This
> reservation is made in machine-readable form via the Service's `robots.txt`, the
> `X-Robots-Tag: noai, noimageai` and `TDM-Reservation` response headers, and
> equivalent metadata, and it applies whether or not those signals are technically
> honored by a given actor. Accessing the Service is affirmative acceptance of this
> reservation. No license to the Service or the Generated Content for AI/ML
> Development or TDM is granted by access, by the presence of content on public
> pages, or by any absence of technical blocking.

*Engineering note:* this clause is the contractual twin of the technical
reservation shipped in `public/robots.txt`, `vercel.json` (the `X-Robots-Tag` /
`TDM-Reservation` headers), and the `noai, noimageai` meta on the entry document.
Counsel should confirm the reservation's enforceability and phrasing per target
jurisdiction (the EU DSM Art. 4 opt-out, UK, and US contract/CFAA-adjacent
theories differ).

---

## 4. Clause C — Bot-waves, credential abuse, and abusive volume

> You must not, and must not attempt to:
>
> (a) direct automated, scripted, or coordinated traffic at the Service — including
> account-creation waves, sign-in floods, credential stuffing, password-spraying,
> enumeration of accounts, dossiers, or identifiers, or any distributed request
> pattern designed to evade rate limits;
>
> (b) create, operate, or coordinate multiple accounts by Automated Means, or
> create accounts using automatically generated or disposable identities to
> multiply free allowances or evade a suspension;
>
> (c) interfere with, disrupt, degrade, or place an undue burden on the Service or
> its infrastructure, including by denial-of-service, amplification, or
> resource-exhaustion techniques; or
>
> (d) circumvent, disable, or interfere with any rate limit, quota, human-
> verification challenge (e.g. a CAPTCHA), access control, or other technical
> measure the Service uses to protect its integrity or meter usage.

---

## 5. Clause D — Bulk generation and paid-surface abuse

> The generation, simulation, export, and AI surfaces are metered and, in part,
> paid. You must not:
>
> (a) engage in Bulk Generation, or use any Automated Means to trigger generation,
> simulation, export, narration, or checkout;
>
> (b) use the checkout or payment surfaces other than to make a genuine purchase for
> your own account — including no card-testing, no payment-instrument enumeration,
> and no automated or scripted checkout attempts;
>
> (c) resell, sublicense, or commercially redistribute access to the Service's
> generation or AI surfaces, or operate the Service as a backend for a third-party
> product, except under a separate written agreement; or
>
> (d) exploit, or attempt to exploit, any credit, refund, promotional, founder-seat,
> referral, or free-allowance mechanism other than as intended.

*Engineering note:* the payment surface is hard-walled server-side (Stripe hosted
checkout + the server-side entitlement and reservation gates), and the session-
creation endpoints are the card-testing target the technical perimeter throttles;
this clause makes such attempts a breach as well. See `docs/PERIMETER_RUNBOOK.md`.

---

## 6. Clause E — Systems integrity and security research boundary

> You must not (a) access or attempt to access the Service's systems, source,
> models, prompts, or internals except as expressly permitted; (b) reverse-engineer,
> decompile, or attempt to derive the Service's source code, model weights, prompts,
> or the deterministic simulation's internals, including by automated enumeration or
> meta-probing of outputs (see also the anti-extraction clause in the main Terms);
> or (c) introduce malware, or use the Service to store or transmit material that
> violates law or third-party rights. Good-faith security research is welcomed only
> under a separately published coordinated-disclosure policy, if any; absent that,
> do not test the Service's security without written permission.

---

## 7. Clause F — Enforcement, throttling, and remedies

> To protect the Service and its users, SettlementForge may, with or without notice:
> rate-limit, throttle, degrade, challenge (including with a human-verification
> step), suspend, or terminate access; require re-verification; invalidate
> automatically created accounts; and pursue any remedy available at law or equity,
> including injunctive relief, for a breach of these automated-access, integrity, or
> reservation terms. A failure to enforce is not a waiver. These remedies are in
> addition to, not in place of, the general suspension/termination terms.

*Engineering note:* the technical layer already applies graduated responses
(per-user and per-IP rate limits, an invisible-first human-verification challenge on
sensitive flows, and host-level bot filtering). This clause gives those responses a
contractual basis and adds the civil-remedy backstop for actors the technical layer
cannot stop.

---

## 8. Clause G — Authorized user-agents and the honest limit

> Nothing in these terms prohibits a natural person from using standard assistive
> technology or a personal AI assistant to help them use the Service through its
> normal interface for their own legitimate, individual use — provided such use does
> not itself constitute Automated Means at abusive volume, scraping, Bulk
> Generation, or a circumvention of a technical measure. SettlementForge may still
> apply rate limits and human-verification challenges to any session.

*Engineering note (the honest limit — important for counsel's expectations):* a
user-credentialed AI agent acting on one person's behalf, at human scale, through
the normal interface is **indistinguishable at the wire from that person**, and the
Service does not attempt to prohibit it. The line the Terms and the perimeter both
draw is at *volume, scraping, bulk generation, resale, and circumvention* — not at
"a human used an assistant." Please keep Clause G consistent with that reality so
the Terms are not overbroad or unenforceable.

---

## 9. Open questions for counsel

1. **Jurisdiction & enforceability of the TDM/AI reservation** — EU DSM Art. 4
   opt-out wording vs. UK vs. US contract/CFAA-adjacent framing. Which governs, and
   should the reservation be phrased to satisfy the strictest?
2. **Browsewrap vs. clickwrap** — the automated-access and reservation terms bind an
   actor who never clicks "I agree." Does the reservation need a header/notice
   posture (already shipping) plus a clickwrap at sign-up to be enforceable against
   (a) crawlers and (b) account holders?
3. **Consumer-protection fit** — the "no waiver," suspension-without-notice, and
   remedies language must not run afoul of consumer law in target markets.
4. **Security-research carve-out** — does the owner want a coordinated-disclosure
   safe harbor? Clause E currently defaults closed.
5. **Definition of "abusive volume"** — keep it standard-based ("more than a natural
   person in good faith would produce") rather than a hard numeric the Service might
   change? The runbook holds the actual technical thresholds.
6. **Interaction with the Surveyor BYOK terms (§6d) and the enrichment rider
   (§6f)** in the main draft — ensure no conflict with the AI-service telemetry
   language already there.

---

*End of draft. Deliver to counsel alongside `docs/legal/TERMS_OF_USE_DRAFT.md`,
`docs/legal/PRIVACY_POLICY_DRAFT.md`, and `docs/PERIMETER_RUNBOOK.md`.*
