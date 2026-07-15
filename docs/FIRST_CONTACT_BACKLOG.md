# First-Contact Clarity — Proposal Backlog

From the first-contact visual-clarity pass: a brand-new-DM walkthrough of all 12 pages
(Create, Dossier, Library, Settlement detail, Realm, Compendium, About, Gallery, Pricing,
Account, Auth, Admin), hunting the small "huh?" moments a stranger hits in their first
few screens.

**Already done (not in this backlog):**
- **29 bounce-risk / friction fixes applied directly** in the first-contact pass (tooltips on
  jargon badges, score/scale anchors, orphaned-emoji removal, `AI-Enhanced` -> `Narrated`,
  sentence-case, mode-switch glosses, etc.).
- **~12 more friction-grade fixes applied** in the follow-up pass (Gallery `Stability:` chip
  prefix, Auth magic-link gloss, Library realm-clock `tick` -> month + sample `Fork this sample`,
  Compendium slider `0-100` anchor, Create threat-band gloss, Realm faith-tier gloss, Dossier
  `AIInlineCard` -> narrated, Account `AI model preference` -> `Narration model` + `AI-polish`
  -> `Narrate`, Pricing credit-pack subhead reorder).

What remains below is **wording judgment and feature-coupled renames the voice workstream owns**
(docs/VOICE_AND_TONE.md is binding). Severity: `friction` = a pause or extra click for a newcomer;
`polish` = refinement.

---

## Priority: residual "AI" language (voice-bible violation)

The voice bible is explicit (pillar 4 + the voice paragraph): **never "AI"; the product is
"narrated" / "the Narrative Layer."** These survive in **established feature labels with downstream
coupling** (shared `en.js` keys, the actual exported prompt text, analytics event names, pinned
tests), so they need a *coordinated* rename rather than an inline swap:

- **Export feature labels `Narrative AI Prompt` / `Map AI Prompt`** — appear on the dossier export
  controls and are referenced in the About guide (Quick Start step 6, Power User). Rename to drop
  "AI" (e.g. `Narrated prompt`), reconciling the `en.js` key, the button label, any analytics
  event, and the copied-prompt heading together.
- **About guide "Press the purple button"** (Quick Start + Power User) — names a color, not the
  control. Name the action diegetically (the Narrate / Narrative Layer control).
- **`COPY.ai.polishCta = 'Polish with AI'` in `src/copy/strings.js:74`** — still says "AI" and is
  consumed by `NextActionRail.jsx` (the post-generate rail). `AIInlineCard` was converted to an
  in-voice literal, but this shared string was left untouched to avoid silently changing
  NextActionRail. Rename the shared key (e.g. `'Run the Narrative Layer'`) and update both consumers
  together.

*(The low-coupling AI labels — `AIInlineCard` body/CTA, Account `AI model preference` / `AI-polish`
— were already converted in the follow-up friction pass, since they are component-local and the
bible mandates the swap.)*

---

## Remaining per-page proposals (wording + polish)

### Create
- `[polish]` **ChangeModeBar** — `Basic Generate` / `Advanced Generate` have no gloss on the bar
  itself (the intro paragraph below covers it). Optional `title=` on the mode name.
- `[polish]` **GenerateWizard "Generate Draft"** — confirm `Draft` reads as intended Lexicon to a
  first-timer (the subline + leave-confirm already teach it). Voice confirmation only.

### Dossier
- `[polish]` **Narrative empty states** ("Run the Narrative Layer to draw out...") — consider
  appending the known cost ("(N credits)") to the empty-state prompt, matching the button gloss.

### Library
- `[polish]` **SaveQuotaMeter pitch pill** — "Unlock the simulation: advance time, run campaigns..."
  is dense; optional `title=` gloss or simpler nouns. (`PREMIUM_PITCH` is centralized + test-asserted,
  so any change is coordinated.)
- `[polish]` **LivingWorldSignalRow war-weary pip** — the `title=` carries a raw decimal; drop it or
  anchor it ("on a 0 to 1 scale"). The band word alone reads fine.

### Settlement detail
- `[polish]` **Edit Names disclaimer** — "updates this settlement's JSON export" surfaces a file
  format; reword to a civic noun ("...saved file and any linked neighbour references").
- `[polish]` **"Revert to Raw"** — `Raw` is a state word; keep the label, ensure the helper sentence
  stays adjacent (it does).
- `[polish]` **Network Effects "Sources" causal tags** ("2-hop, 60% strength", "1.4x tier leverage")
  — a short `title=` on the Sources sub-heading explaining decay (distant neighbours pass weaker
  effects).

### Realm / World Map
- `[polish]` **WorldMapToolbar preset chips** (Quiet / Realistic / Dramatic in More > Simulation) —
  enrich each `title=` with a one-line consequence (what each does to pace/volatility).
- `[polish]` **RealmInspector section tabs** (Pulse Results, War & Diplomacy, Pantheon, Chronicle) —
  give each a `title=` that glosses the section's content rather than echoing the label.

### Compendium
- `[polish]` **EconomyTab "Viability Score" card** — names a score + "Economic stress analysis" but
  never states the scale/direction; add a one-line band or min/max anchor.
- `[polish]` **CustomContentManager "Custom" badge** — context already explains it; optional
  `title="Authored by you."`

### About / How-To
- (see the residual-"AI" cluster above for `Narrative AI Prompt` and "purple button")
- `[polish]` **Under the Hood slider thresholds** ("Military >=80") — a one-time "(sliders run 0 to
  100)" anchor at first mention.

### Gallery
- `[polish]` **GallerySidebar "Surface" filter heading** — groups Has image / Has comments / Curated;
  "Surface" is cryptic. Rename (candidate: "Listing" / "Details") or add a one-line gloss.
- `[polish]` **GalleryDetail "Share" button** — refine the `title=` to name the result ("Copy a link
  to this dossier"); behavior is platform-dependent.

### Pricing
- `[polish]` **Cartographer tier bullets** ("The self-ending war layer + the living pantheon") — a
  short plain-language gloss (wars start and end on their own; faiths gain and lose converts).
- `[polish]` **PricingMomentCard "See Cartographer"** — append a cost hint ("Cartographer is
  $6/month"); placement is a conversion + voice call.

### Account
- `[polish]` **AI model dropdown for zero-credit users** — a free DM with no credits sees a
  paid-narration model picker with no "optional" signal; mark it optional or note it applies once
  credits are present.
- `[polish]` **Saved Settlements "inactive retained"** — unexplained jargon for a returning
  downgraded user; `title=` gloss ("Settlements kept read-only beyond your active save limit").
- `[polish]` **Save profile vs See Cartographer** — two primary-variant buttons on the page (in
  separate sections); consider demoting Save profile to secondary so the conversion CTA is the lone
  primary.
- `[polish]` **Subscription upsell-footer wording** — harmonize "AI prose pass" -> "narrated prose
  pass" to match the Narrate control + Narrative Layer lexicon.

### Auth
- `[polish]` **Tab toggle case** — "Sign In" / "Create Account" / "Back to Sign In" are title case;
  the voice doc prefers sentence case. Harmonize the tabs + their referents together.
- `[polish]` **AuthModal header** — "Welcome" has no subtitle of its own; optional one-line subtitle
  echoing the page ("Sign in to keep your work"). The panel below already carries this.

### Admin
- `[polish]` **"Sim Tuning" Section title** — clipped; a new admin can't tell it changes live
  war/occupation/trade behavior. A one-line gloss under the title.
- `[polish]` **Role edit dropdown options** (User / Admin / Developer) — the open menu options carry
  no scope gloss (the trigger `title=` covers first contact); per-option glosses would need a custom
  menu component.

---

## Couldn't verify in this environment
- Native `title=` tooltips (the bulk of the applied fixes) only appear on hover and to assistive
  tech — confirm with a real pointer + a screen reader.
- The orphaned-`U+FE0F` removal fixed a stray-box artifact whose old rendering was OS/font-stack
  dependent — confirm the dropdowns look clean on the platforms your DMs use.
- The `/realm` FMG map fill needs a real browser (the cross-origin iframe black band noted in the
  UI/UX overhaul status).
