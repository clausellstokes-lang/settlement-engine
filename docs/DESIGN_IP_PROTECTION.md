# DESIGN — THE IP-PROTECTION PROGRAM (IP-1..IP-4)

- **Status:** ARCHITECTED 2026-08-14 (Fable chair). Authored on the ledger
  branch first because the build branch was sealed under the GR-4B-IIIB
  implementation session at authoring time.
- **Fold: DONE.** This volume folded to the build branch verbatim at the
  `infra-1` train's member INFRA-M1-DOCS, with the enforcement-claims
  `CLAIM_RE` scan executed in the same change and returning zero hits over this
  file. This copy on `claude/composite-r4` is the canonical one; the
  ledger-branch copy is history.
- **Authority:** OWNER_DECISION_QUEUE §22 (universal standing authorization),
  §26 (the four-part ruling), §26a (the experience-first clarification). The
  evidence base is the measured 2026-08-07 read-only exposure audit
  (memory: `ip-exposure-measured-2026-08-07`), whose config-level findings must
  be re-verified at compile time of each wave — the audit predates ~250 commits.

## §0 · The owner's directives, verbatim intent

1. (2026-08-14 ~02:25) Local-CPU processes could let savvy users decode and
   clone the code, architecture, and tuning; prevention thoughts requested,
   including moving "the essentials and key pieces" server-side.
2. (2026-08-14 ~03:10) Determinism serves devs/admins; the general audience
   wants to EXPERIENCE trust, not measure it. Machinery and explanations can
   hide so long as the experience is perfect. The goal: deter cloning while the
   brand base and revenue build, without peers who decipher the code.
3. (2026-08-14 ~03:30) "Architect that out exhaustively, comprehensively,
   coherently, and carefully according to your suggestions and slot it in the
   remaining sequences before the diagnostic soak."

## §1 · Threat model — measured, not imagined

**The adversary** is a competent engineer with the shipped bundle, unlimited
time offline, and no access to servers. The 08-07 audit settled what they get:

- **Tuning:** 90.2% of ~2,573 distinct tuning constant names ship verbatim with
  values attached, because no JavaScript minifier mangles object keys — they are
  observable program semantics. Minification is structurally incapable here.
- **Mechanics:** the simulation is client-side end to end (zero generation code
  in the 33 edge functions and 6 Vercel handlers at audit time). All engine
  control flow is reconstructible; this repo's own history contains a completed
  bundle-to-source reconstruction (six `src/data/` files open with
  `// extracted from bundle`), so feasibility is empirical fact, not fear.
- **The corpus:** ~9,400 authored sentences ship as readable string literals.
  Technical protection nil; legal protection unusually strong — authored prose
  is copyrightable EXPRESSION, while mechanics and numeric weights are not.
- **What they do NOT get:** the test estate (28k tests, walkers, ratchets), the
  coherence machinery's governing documents, the authoring pipeline, release
  velocity, the brand, or any user's accumulated worlds.

**The asset ranking that follows** (highest protectable value first): the
corpus (legal-strong) → paid-surface revenue (enforceable) → tuning-in-motion
(hidable only by moving compute) → mechanics (unprotectable alone, low value
without the rest). The durable moats are corpus growth, velocity, accumulated
user worlds, and brand — none of which secrecy engineering builds.

## §2 · Design laws (bind every wave below)

- **L1 — The experience budget is inviolable.** No protection measure may tax
  first paint (a ratcheted budget), instant local generation, or product polish.
  Deterrence spending comes from the infrastructure budget, never the
  experience budget.
- **L2 — Machinery-hiding is presentation, not protection.** Hiding numbers,
  bands, formulas, and determinism talk from player surfaces is adopted
  presentation doctrine (§26a) — and deters no cloner, because cloners read the
  bundle, not the UI. No wave below may claim UI-hiding as a protection.
  In-fiction explanation (the news address law's prose "because") is the
  experience and is never hidden.
- **L3 — Watermarks are static, never per-account.** Per-account variation
  would make one seed render different bytes for different users, breaking the
  seed-as-shared-address identity (THE PROMISE, constitutional). One corpus,
  one set of salts, identical for every user.
- **L4 — §3h is inherited whole.** Nothing that can move an output lands after
  the tuning signature. Every output-moving wave below is explicitly slotted
  relative to the soaks and the signature.
- **L5 — Enforcement beats secrecy where the asset is revenue.** A paywall that
  the server enforces protects income even from a user who has read every line.
- **L6 — Protection concentrates on the corpus.** It is the one asset where the
  legal lever is strong; the program's center of gravity sits there.
- **L7 — Legal acts are owner+counsel, by nature.** Copyright registration,
  ToS anti-extraction terms, and DMCA posture are prepared here as briefs but
  executed only through the owner's counsel carve-out.

## §3 · The four programs

### IP-1 — THE SOURCEMAP GUARD (pre-soak; output-neutral; one micro-wave)

The bundle currently ships no source maps — but only by Vite's default, and one
config line silently undoes it. Owed since 08-07.

- **Build:** one test in the strict-dist family (the `verify:dist` battery is
  the natural home) asserting, over every emitted `dist/assets` chunk: zero
  `.map` files exist, and no chunk's final bytes carry a `sourceMappingURL`
  comment. The assertion runs against the real built artifact set the strict
  runner already discovers, inheriting its file census so a new chunk is
  covered automatically.
- **Proof:** a disposable mutant flips the Vite config to emit sourcemaps,
  rebuilds, and the guard must red by name; restore digest-exact. The
  plant-nothing-greens rule applies.
- **Slot:** lands PRE-SOAK, immediately after the GR-4B-IIIB session's seal
  lifts. It moves no output (dist .map emission is not a simulated output and
  the guard is test-only), so it does not disturb build-complete-dark.
- **Cost:** one test file + possibly one fixture; zero product bytes.

### IP-2 — STATIC WATERMARKS (three parts, three different slots)

**IP-2a — prose salts (output-moving; slots WITH the post-first-soak
composition repairs, before the terminal soak).** A small set of distinctive
authored phrasings — correct in register, unusual in construction — placed in
low-traffic pools across several prose families. Their purpose: a clone that
carries them is provably copied, converting a hard infringement case into an
easy one.

- The salts are authored by the chair as an annex-governed corpus edit (the
  A-row pattern), so every governing walker re-derives them and no code path
  special-cases them. They are ordinary variants to the engine; only the
  register makes them special.
- ⛔ **The salt register never enters the repository.** A committed list of
  salted phrasings is a strip-list for the cloner. The register (phrase, pool,
  date, rationale) lives in the owner's out-of-repo design-handoff folder
  beside the extracted pricing sheet, with only its existence noted in the
  ledger. This mirrors the 08-10 two-docs extraction precedent.
- Because salts move same-seed prose bytes, this is a DECLARED output shift and
  slots exactly where declared shifts belong: inside the post-first-soak repair
  window, before the terminal soak, never after the tuning signature (L4).

**IP-2b — constant salts (slots INSIDE the tuning-signature act).** Two or
three tuning constants set to correct-but-arbitrarily-precise values (a fifth
decimal that no independent derivation would reproduce). They are tuning values
and therefore ride the owner-signed tuning signature itself — no separate wave,
no extra slot. The record of which constants lives in the same out-of-repo
register (IP-2a's rule).

**IP-2c — the legal layer (owner+counsel; no engineering slot).** A brief for
counsel: US copyright registration of the corpus as a literary work (enabling
statutory damages), ToS anti-extraction and anti-benchmarking terms, and a
DMCA-readiness note naming the watermark register as evidence machinery. The
chair prepares the brief; execution is the owner's carve-out (L7).

### IP-3 — SERVER-ENFORCED PAID SURFACES (launch-adjacent; owner-visible)

The audit found the three priced surfaces are client booleans — advisory, not
enforced: the PDF export right (`dossierEntitlements.js`), the Faith & War
premium chapter (`pdf/variants.js`), and the Instant World gate
(`InstantWorldEntry.jsx`). (Sites re-verified at each wave's compile time; the
audit citations are 08-07 vintage.)

- **Design:** entitlement checks move from client boolean to server assertion.
  For the two PDF surfaces, the premium artifact assembly (the entitled
  chapter/variant composition) happens behind an authenticated endpoint that
  verifies the purchase ledger server-side and returns the assembled artifact
  or a short-lived signed grant the client-side renderer honors. For Instant
  World, the gate's unlock resolves against the server ledger per activation.
- **Degradation law:** offline or unreachable-server states degrade with an
  honest message on the paid action only; nothing else in the product notices.
  The free experience must never acquire a network dependency (L1).
- **What it protects:** revenue, not secrets. A bundle reader can still read
  the chapter's composition code; they cannot mint an entitled artifact from
  your service without paying, and the local clone of a paid surface is now a
  product they must build and host themselves.
- **Slot:** its own gated wave, POST-TUNING and preferably first post-launch
  iteration. It moves no simulated output (L4-clean) but changes paid-surface
  behavior, which is exactly the class that should not churn during the
  launch-stability window. If the owner prefers it at launch, the only §3h
  constraint is that it stays off the tuning-signature tree.

### IP-4 — CLOUD WORLDS (post-launch tier; the one structural move)

The single architecture that actually hides engine behavior: world advances
resolved server-side for connected accounts. §26a's clarification lowered its
product cost decisively — open local verifiability has no mass-audience value,
initial generation stays local and instant, and only the advance loop moves.

- **Shape:** a world is LOCAL or CLOUD, chosen at creation; conversion is a
  one-way local→cloud import. A cloud world's canonical state lives in the
  existing persistence (Supabase); the client submits an advance intent
  (worldId, interval parameters); the server runs the same headless engine
  (Node-runnable today — the soak harness is the proof), persists the new
  state, and returns the projected world plus prose through the existing
  public-projection seam (the reveal selector already separates DM truth from
  player-safe surfaces). The client renders projections and never holds the
  advance path for cloud worlds.
- **Determinism is preserved, not sacrificed:** same engine, same seed, same
  bytes — computed where the user cannot read the computation. THE PROMISE
  holds verbatim.
- **What it protects:** the composed consequence behavior — the thing IP-1..3
  cannot hide — plus real paid-tier enforcement and cross-device sync as
  product value the tier can be SOLD on (secrecy rides a feature users want,
  which is the only sustainable way to pay for it).
- **The engineering risks, named:** engine/runtime parity (pin the server Node
  version; the domain layer is already headless and must stay so — L-shaped
  regression guard: the existing headless law); per-advance CPU cost (measure
  from the soak-era timing corpus before pricing the tier); worldState payload
  size on the wire (measure; if heavy, the server holds state and ships only
  projections); strict serial advance per world (one timeline, no merge — a
  cloud world has exactly one authority); abuse/rate limits on the advance
  endpoint; migration honesty (a converted world's history imports byte-exact
  or the conversion refuses).
- **Slot:** DESIGN is this section, done now. BUILD is post-launch, first
  major post-launch program, so launch stability and the endgame tail are
  never re-plumbed under it. Pricing-tier mapping and conversion policy are
  owner decisions queued to §26.

## §4 · The sequencing table (relative to the ruled tail)

> ⚠ **CORRECTED 2026-08-14 by OWNER_DECISION_QUEUE §27 (build-everything
> ordering):** rows 2-5 no longer imply the diagnostic soak follows the GR-4b
> tail directly — EVERY declared program wave builds first, then the soak. The
> IP waves' own slots are unchanged: IP-1 during the build phase, IP-2a in the
> post-diagnostic-soak fix window, IP-2b at the tuning signature, IP-3/IP-4
> post-launch. §27 is the ordering authority; this table stays for the IP
> rows' relative positions only.

| Order | Act | Output-moving? | Slot |
|---|---|---|---|
| 1 | GR-4B-IIIB lands (in flight) | yes (declared, packeted) | now, sealed session |
| 2 | GAP-1 walker cure (G1 draft → packet) | test-side | pre-soak, REQUIRED (soak inventory depends on it) |
| 3 | GR-4b-ii annex act + `reaffirmed` wave (per II-R/B1) | yes (declared) | pre-soak, chair-ruled |
| 4 | **IP-1 sourcemap guard** | no | **pre-soak, after the seal lifts** |
| 5 | Build-complete-dark SHA declared; ledger current | — | the soak precondition |
| 6 | THE FIRST DIAGNOSTIC SOAK (D-1/L0 + lighting grid per the SD plan) | no (disposable tree) | findings only |
| 7 | Composition repairs from findings + **IP-2a prose salts** | yes (declared shifts) | the post-soak repair window |
| 8 | The owner's walk; light flags + THE ONE REGEN; terminal soak | yes (the ordered acts) | §3h steps 4-6 |
| 9 | THE TUNING SIGNATURE, carrying **IP-2b constant salts** | the last output act | §3h step 7 |
| 10 | Push / deploy (owner-confirmed); **IP-2c counsel brief** in parallel | no | §3h step 8 |
| 11 | **IP-3 paid-surface enforcement** | paid-surface behavior | first post-launch iteration |
| 12 | **IP-4 cloud worlds build** | tier feature | first major post-launch program |

## §5 · Refusals, recorded with reasons

- **Blanket obfuscation/minifier hardening:** REFUSED — taxes first paint
  forever (L1) against weeks of adversary delay; object keys stay readable
  regardless (measured).
- **Corpus encryption:** REFUSED — the client must decrypt to render, so the
  bundle ships the key; adds startup cost for zero adversary cost.
- **Per-account steganographic watermarking:** REFUSED — violates THE PROMISE
  (L3). Static salting achieves the legal purpose.
- **Moving initial generation server-side:** REFUSED — destroys instant local
  generation, the first-contact experience itself (L1), for the least valuable
  asset (mechanics).
- **WASM-compiling the kernel as protection:** DECLINED as a protection wave —
  raises reverse-engineering effort modestly at real build-toolchain cost;
  reconsidered only if IP-4 evidence shows a cheap co-benefit.

## §6 · Receipts each wave owes

IP-1: the planted-mutant conviction + green at HEAD. IP-2a: the annex rows,
walker re-derivation, the declared-shift record in the golden ledger, and the
out-of-repo register updated the same day. IP-2b: the signature document names
that salted constants exist without naming them. IP-3: a paid artifact is
UNOBTAINABLE with the client boolean forced true and no server grant (the
negative control), plus the offline degradation path exercised. IP-4: byte
identity between a local advance and a cloud advance of the same seed/world at
the same engine version — the parity proof that keeps THE PROMISE honest.

## §7 · Standing risks this volume leaves open

The salt register's out-of-repo custody is a single point of loss (mitigate:
the owner's folder plus counsel's copy). IP-3's endpoint inherits the existing
edge-function security posture — its wave must read the extracted security
register's relevant rows before building. IP-4's per-advance economics are
unmeasured until the soak timing corpus exists — its pricing waits on that
evidence. None of these blocks any pre-soak act.
