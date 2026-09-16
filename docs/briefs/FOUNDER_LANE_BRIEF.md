# THE FOUNDER LANE — terms copy, the seat-lineage page, the entitlement schema
## Branch: `claude/founder-lane`, cut from the post-W8 mainline tip (dispatcher supplies the
## hash — verify it). Read docs/briefs/W_R2_COMMON_PROTOCOL.md FIRST. Display+schema lane:
## you touch NO engine file. Commissioned 2026-07-16 ("i look forward to you building it all");
## strategy + agreed shape recorded in the manager's ledger rows of
## docs/COMPREHENSIVE_REVIEW_PROGRAM.md (search "FOUNDER") — read them.

**THE STRATEGY (owner, binding):** 30 Founder seats, $99 lifetime, THE CAP NEVER RAISES —
transfers are the cap's defense (succession, never minting). Founders are the community
nucleus; the public page is the proof surface. The transfer MECHANISM itself is
deferred-by-design (concierge v1 at month 12) — you build the FOUNDATION: honest terms, the
page, the seat model.

**SCOPE (three deliverables):**

1. **TERMS COPY.** Survey where the founder offer lives (the purchase surface + any legal/
   terms copy home) and land the offer language: "transferable lifetime individual license";
   "no more than 30 Founder seats will ever exist" (the word FOUNDER is reserved for the 30
   — future tiers must be named differently); the transfer-right reservation (transferable
   through SettlementForge only, after a 12-month hold; incoming holder pays the $99 transfer
   price; outgoing holder receives $49.50 after verification, clearance, and a payout delay;
   accounts/worlds/credits/personal data never transfer; transfers may be paused for
   security/legal/operational reasons). NO investment framing anywhere — never "appreciating,"
   "resale value," "ownership," or "governance." Copy register: plain and honest, not
   persona-voiced (terms are a rescue-lifeline surface, not a whisper host).

2. **THE FOUNDERS PAGE (seat lineage).** A public, lazy route (zero eager bytes): seats
   numbered 1–30 as a LINEAGE — per seat: its number, the current holder's OPT-IN display
   name (absent opt-in ⇒ "a Founder" or unclaimed state; NEVER an email or account id), the
   held-since date, prior holders as history rows (transfers append, never erase), and a link
   to the holder's PUBLIC gallery worlds where any exist (the page is a portal of proof, not
   a wall of names). Pre-launch truth: all 30 seats unsold — the page must render the
   all-unclaimed state with dignity (the offer IS the content at that stage). Display names
   ride the existing public-projection + moderation lanes (same screens as gallery content).
   Fail-closed: nothing about a holder is public except what they opted in.

3. **THE ENTITLEMENT SCHEMA (DRAFT — presented, not decided).** Migration `137_founder_seats`
   WRITTEN-NOT-DEPLOYED (the standing 130–136 pattern): a `founder_seats` table — immutable
   `seat_id` 1–30, current holder (nullable pre-sale), `display_name_optin` (text, nullable,
   moderated), held-since, plus an append-only transfer-history shape (same table with rows
   or a twin log table — propose the better one and say why); RLS: PUBLIC SELECT of opted-in
   display fields ONLY (seat number, opted display name, held-since, prior opted names);
   holder-only UPDATE of their own opt-in; service-role writes for seat assignment. The seat
   is an ENTITLEMENT SEPARATE FROM THE ACCOUNT — never synonymous with a user row (the
   premium-seam law: entitlements gate the interface; the sim never reads them). Also
   PROPOSE (document, do not wire) the purchase-webhook seat-assignment hook (lowest unclaimed
   seat on founder purchase). ⚠️ THE SCHEMA SHAPE IS OWNER-GATED: your report PRESENTS the
   drafted migration for the owner's sign-off — write it, test what is testable without
   deploy (SQL-lint/shape pins), and mark it clearly as awaiting signature in the report.

**LAWS:** zero eager (measure + quote the closure delta; budget 1,066,400); goldens
byte-identical (nothing here touches generation/sim); premium seam; fail-closed public
exposure; the page copy honors the register guards. HARD RULES: never `git stash`; never
push; explicit staging; never raise budgets/ceilings; EXEMPT_CEILING 69>66 is the known
owner-gated red. One writer per worktree.

**GATE:** focused suites for your files + `npm run build` + `npm run verify:dist` (quote
143/143 + closure). Full check not required (the manager gates the unified tip).

**REPORT (house format):** per-deliverable summary; the drafted schema VERBATIM with its
rationale and the sign-off ask; pin coverage; byte measurement; commits; judgment calls;
deferrals-with-seams.
