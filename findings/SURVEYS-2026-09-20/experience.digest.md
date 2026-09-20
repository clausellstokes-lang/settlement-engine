# SURVEY DIGEST — what SettlementForge is intended to be at the end (experience view)

Tags: [END-STATE INTENT] = the documented target · [BUILT] = present in the build tree /
verified doc · [IN FLIGHT] = being built now · [PARKED] = deliberately deferred ·
[UNCERTAIN] = could not confirm. Sources are absolute paths or memory filenames.
Ledger docs read from git objects on `review-fixes-2026-07-08`; code read from
`/private/tmp/.../read-tip-tool23`.

---

## A. WHO IT IS FOR, THE PROMISE, THE POSITIONING, THE VALUE ANCHOR

- The finished product is "**the world engine behind the table**": a world a game master
  operates by hand or by voice, that "runs while they are away and greets them with what it
  did." Its identity in one contrast: "other tools write what happens next; SettlementForge
  runs what happens next — and can tell you why." [END-STATE INTENT]
  (source: docs/VISION_IDEALIZED_FINAL_PRODUCT.md, ledger branch)
- The audience is game masters **and** worldbuilders — the landing eyebrow "A SIMULATOR FOR
  DUNGEON MASTERS" was deliberately deleted "so the category framing doesn't exclude
  simulation fans, worldbuilders, and would-be DMs." [BUILT]
  (source: src/copy/landing.js, hero block comment)
- Marketing leads with the **felt experience**, never the mechanism: "distinction doesn't make
  people try a product — curiosity, resonance, and immersion do; distinction is what they
  discover after." Owner, 2026-07-21. Also: "immersion outranks conversion-copy visibility."
  [END-STATE INTENT] (source: memory/owner-marketing-doctrine.md)
- **Positioning law (owner, 2026-09-19), verbatim:** "why do you keep saying that others win
  on speed? my settlements are also derived in milliseconds. we simply force people to wait
  3-10 seconds for a psychological trick … it is not just that the facts agree, it is the
  depth of facts that is orders of magnitude more than others." The sanctioned line is "as
  instant as any generator, orders of magnitude deeper, and every fact agrees with every
  other." The 3–10 second forge is **theatre**, not cost; above ten seconds is a defect.
  [END-STATE INTENT] (source: memory/positioning-law-instant-and-orders-of-magnitude-deeper-never-concede-speed.md)
- The competitive set is **generators** (watabou MFCG/village, FantasyTownGenerator), not
  asset canvases (Inkarnate, Wonderdraft). Owner: Inkarnate "doesn't generate a map. it gives
  icons and building blocks for a user to build a city." The winnable frame is "a map you did
  not have to build, of a place that actually exists."
  [END-STATE INTENT] (source: memory/owner-marketing-doctrine.md, 2026-08-26 §689)
- **The value anchor (owner, 2026-09-20).** The owner asked what a freelancer would charge to
  hand-build the same dossier. Measured counts per tier (thorpe: 30 people, 3 NPCs, 7
  institutions, 3 factions, 7 services, 2,755 authored words → metropolis: 57,102 people, 19
  NPCs, 52 institutions, 9 factions, 95 services, 13,355 words). Priced against sourced
  freelance rates (2023 EN World survey mean 8.5¢/word; a town map $250–$500): **~$700–$1,200
  a thorpe to ~$3,600–$6,600 a metropolis** of freelance-equivalent labour per static
  settlement. The living/simulated version has no freelance equivalent — it is
  retainer-shaped (~$500–$2,000/month). Counts CONFIRMED; the price column is the chair's
  model at ±40%. [END-STATE INTENT / measurement]
  (source: memory/owner-context-2026-09-20-base-value-of-a-generated-settlement-measured-per-tier-and-priced-against-sourced-freelance-rates.md)
- **What it is not:** "Not a VTT. Not an AI storyteller. Not a wiki that remembers without
  understanding. Not a map painter whose maps mean nothing. Not a grand-strategy game you play
  to win. Not a replacement for the DM." VTTs are complemented, not fought: "finish the session
  in Foundry, tell SettlementForge what happened, walk into next week prepared."
  [END-STATE INTENT] (source: docs/VISION_IDEALIZED_FINAL_PRODUCT.md)

---

## B. THE JOURNEY, END TO END

- **The product loop, stated canonically:** "Forge → save → mark canon → connect → advance →
  understand → prepare → record play → repeat." Every remaining project must "shorten, clarify,
  or make that loop more trustworthy." [END-STATE INTENT]
  (source: docs/PRODUCT_COMPLETION_ARCHITECTURE.md §0)
- **The landing** is a scroll-driven journey with five numbered waypoints: hero → `01 · Forge`
  → `02 · The voice` → `03 · The Realm` → `04 · The commons` → `05 · Set out`. Hero: "Your
  players have a thousand choices. / Now you have every answer." Sub: "One click makes a town:
  its economy, its people, the quarrel it is having this week. Then time runs, and the town
  answers for it. A world that holds together." CTA "Forge your first settlement"; reassurance
  "Free. No account needed to forge your first town."; scroll cue "Follow the road." [BUILT]
  (source: src/copy/landing.js)
- The landing's sample dossier is intended to be **the real dossier component**, scaled into
  the card ("the demo IS the product — no facsimile markup survives"), so a visitor pokes the
  actual product before making an account. [END-STATE INTENT]
  (source: docs/DESIGN_LIVING_MINIATURE.md §0)
- **The navigation arrow is an argument, and its order is meaning** (owner, 2026-09-19):
  shaft→tip **Create → Library → Realm → Compendium → Gallery**, i.e. forge a settlement →
  keep it → set it among its neighbours → the vocabulary the world is written in → the shared
  showcase. Sign In sits off the shaft at the tip. On the phone: Create, Library | Compendium,
  Gallery, About — no Realm, never a hamburger, never a reshuffle. Law: no lane may reorder,
  regroup, rename-by-position or collapse the nav. [BUILT + END-STATE INTENT]
  (source: memory/brand-the-full-logo-is-the-painted-plaque-with-the-wax-seal-on-the-arrow.md;
  code: src/components/nav/ArrowHeader.jsx, arrowGeometry.js NAV_WORD)
- **Create (the forge).** A size and a click is the whole requirement; the Advanced panel adds
  terrain, age, wealth and trouble, with ~20 dials behind them. Copy: "A living town in one
  click. Twenty dials when you want them… Everything after that is derived, not drawn from a
  table." Sizes: Thorpe · Hamlet · Village · Town · City · Metropolis (an anonymous visitor is
  offered Hamlet/Village/Town). [BUILT]
  (source: src/copy/landing.js `forge`; src/config/tierFacts.js SIZE_LADDER, ANON_SIZES)
- **The end-state forge can be spoken to:** "describe the fortified river town with three
  claimant factions and no internal security, and the intent compiler configures this same
  causal generator, compares the result against your stated constraints, confesses its
  deviations, and lets you revise. The AI configures the forge; it never fakes the forging."
  [END-STATE INTENT] (source: docs/VISION_IDEALIZED_FINAL_PRODUCT.md, Layer 1)
- **Library → Realm.** "Canonize the draft and Cnocby becomes part of your campaign: it takes
  events, keeps a chronicle, remembers. Put it on the world map in the Realm with the towns
  around it, tie them together by trade and grudge, and add your own gods, guilds and goods in
  the Compendium." [BUILT] (source: src/copy/landing.js `realm`)
- **Two lifecycles, one arc** — the product's most load-bearing transition: per settlement
  `draft → canon` (edits stop being authorial and become diegetic, logged events), and per
  campaign `canonize world → world-pulse` (the clock starts, ticks advance, proposals arrive).
  A named coherence gap: both are called "canonize," and which fires depends on hidden
  membership. The recommended cure is to qualify them ("Mark Canon" vs "Start the World
  Clock") and add a campaign lifecycle dashboard. [BUILT (mechanics) / END-STATE INTENT (cure)]
  (source: docs/PRODUCT_COHERENCE.md §1, §3 gaps 1–2)
- **Exporting.** PDF variants: Draft Brief / Canon Dossier / Timeline Packet, plus a
  campaign-level export with a **State of the Realm** chapter (chronicle digest, war/siege
  standings, pantheon, realm arcs). Screen and print derive from one source so they cannot
  drift. The end-state intent is "shelf-worthy artifacts — the dossier, the campaign war room
  with its treaty table." [BUILT + END-STATE INTENT]
  (source: PDF_PARITY_AUDIT.md at the build tip; docs/VISION_IDEALIZED_FINAL_PRODUCT.md Layer 4)
- **Sharing (Gallery).** "Towns others have forged… Walk the Gallery and take one that has
  already lived a little; admire and share freely, and fork one into your own Library with
  Cartographer." [BUILT] (source: src/copy/landing.js `commons`)
- **Learning.** About splits into two pages — *What this Is* (thesis, positioning, how it
  works) and *Practical Guide* (quick start, power user, under the hood, export guidance) —
  plus a third dropdown item, **Founders**. [END-STATE INTENT]
  (source: docs/DESIGN_ABOUT_PAGES.md §0–§1)

---

## C. THE DOSSIER AS AN ARTIFACT

- **The tab structure as built:** four groups. *Summary* (Overview · DM Summary · Plot Hooks ·
  DM Compass) · *Systems* (Services · Economics · Power · Defense · Resources · Outlook ·
  Causes · Magic) · *World* (NPCs · Relationships · Rumors · War · Faith · Daily Life ·
  Traditions · History · Neighbours) · *Notes* (DM Notes · AI Notes · Chronicle · Versions).
  The Map group was deliberately removed from the strip. Tabs the settlement doesn't populate
  drop out of the strip entirely. [BUILT]
  (source: src/components/OutputContainer.jsx TAB_GROUPS; src/components/new/tabs/)
- **OWNER LAW (2026-09-19) — organized by subject, never by the DM's question.** The chair
  twice recommended reorganizing the dossier's front door around "what is happening tonight,
  who wants what, what breaks if I push here." The owner refused, verbatim: **"it shouldn't be
  organized by DM question to maintain immersion, also trust the DM more."** The dossier is an
  in-world document — a survey, a gazetteer, a chronicle — organized by its subject: the land,
  the trade, the walls, who holds power, what people believe. [END-STATE INTENT]
  (source: memory/owner-law-2026-09-19-the-dossier-is-organized-by-subject-not-by-the-dms-question-and-volume-is-handled-by-apparatus-not-disclosure.md)
- **Volume is handled by apparatus, never by progressive disclosure.** Hiding content behind
  clicks "manages the reader instead of trusting them." Instead, with nothing removed or
  hidden: stable placement (the same fact family in the same place in every dossier, so the
  layout is learned once); a set-apart **lede** sentence per section carrying its governing
  fact; an **index of names** at the back of the PDF with page references; marginal
  cross-references; typography doing the work (running heads, consistent rules, eyebrow
  labels). Any "show more" / collapsed-by-default proposal is vetoed. [END-STATE INTENT]
  (same source)
- **OWNER LAW (2026-09-19) — the dossier is a TOME or a SET OF SCROLLS.** Verbatim: "realize
  that the reference goal of the dossier itself is more like a tome or a set of scrolls…
  think medieval mediums for recording and writing." The chrome below the header must speak
  that grammar — rubrics instead of pills, ruled measures instead of borders and colour bars,
  **fore-edge tabs** for the tab strip, marginalia and manicules for cross-references, an
  incipit at each section head; the PDF as the tome proper (folios, running heads, rubricated
  heads, a table of matters, a **colophon** on the last page bearing the seal, the seed and
  the date); **the phone is the scroll** — continuous vertical reading, nothing behind a tap.
  [END-STATE INTENT; the parchment field, ink, rubrication, rules, ornament and drop-capital
  prose already exist — the tab chrome does not]
  (source: memory/owner-law-2026-09-19-the-dossier-is-a-tome-or-a-set-of-scrolls-the-medieval-medium-governs-its-chrome.md)
- **TWO REGISTERS BY DESIGN** (owner, same day): "the header is different than the rest. the
  header is designed intentionally to be striking." The painted arrow header is **the door**
  (arrival, once, striking); the dossier is **the tome** (read for an hour, calm, ruled,
  rubricated). They must not be made to match, and the painting's idiom is never extended
  downward. [END-STATE INTENT] (same source)
- **Prose and numbers.** The dossier "reads as fiction with receipts under every claim." Every
  fact is connected: "'why is the guard corrupt?' always has a real answer," receipted three
  causes deep. The house rhetoric is causality — "The captain is corrupt because the wall fund
  is short." [END-STATE INTENT + BUILT]
  (source: docs/VISION_IDEALIZED_FINAL_PRODUCT.md Layers 1 and 4; docs/VOICE_AND_TONE.md §2 pillar 6)
- **Plot-hook doctrine — one story once.** Measured baseline: 8.19% corpus repeat rate, 35% in
  the worst settlement. The end state adds a thematic layer so two *different* strings telling
  the *same beat* cannot both survive, with ranked retention keeping the most dramatic telling.
  The machine only drops from a projection or redraws from the same authored pool — it never
  rewrites prose, never invents, never touches a DM's edit. [END-STATE INTENT]
  (source: docs/DESIGN_HOOK_NONREDUNDANCY.md §0–§1)
- **A taste sample of the register** (real generated output): "Hunger has made Ashholt quiet.
  The market still opens, the queues still form, but the haggling has gone out of people —
  they take what they are given and calculate, silently, how long it will last."
  [BUILT] (source: docs/CONTENT_GT_DOSSIER_TASTE_SAMPLE.md §1)
- **The chronicle is span-scaled.** One advance renders at four altitudes — HEADLINE (one line,
  fiction register) → CHAPTERS (seasons) → THREADS (stories) → EVENTS (receipts) — with the
  scaffolding growing with the span, so a year-advance is never "scroll-archaeology."
  Compression is never truncation. The unit of comprehension is the causally-linked thread,
  extracted from the receipt graph, with an arc (began → turned → stands-now). Delta-first
  framing answers "what is different" before "what happened." [END-STATE INTENT]
  (source: docs/DESIGN_CHRONICLE_LEGIBILITY.md §1–§3)

---

## D. THE LIVING WORLD

- **Advance time and the world lives on five strata** (the Clock): information travels roads at
  hop-speed, degrades, corroborates by independent lineage, and settles into per-settlement,
  per-faction *beliefs* that diverge from truth; goods are finite stocks on real routes through
  tolls, banditry and smuggling; settlements carry INTERESTS, CHARACTER and MEMORY (grievances
  tagged seat-held or people-held — "a new ruler inherits the paper, never the people's hate");
  kindness is a real decision under a real ledger; war includes embargo, supply-strangling and
  covert sedition; peace is priced in a term budget with every term duration-capped ("a treaty
  is a season of history, never a law of physics"); and hegemonies rise **unnamed** — "the
  engine builds the bones; THE DM BAPTIZES." [END-STATE INTENT]
  (source: docs/VISION_IDEALIZED_FINAL_PRODUCT.md, Layer 2a–2e)
- **The narrative tempo governor** keeps the world breathing: a decade holds one great war and
  one golden age instead of four of each, and a held-back storm reads as the quiet before it.
  It "throttles spontaneity, never causality." [END-STATE INTENT] (same source)
- **THE PROMISE (constitutional).** Owner-ratified 2026-07-20 and amended 2026-08-05: **"a seed
  is a STARTING world, forever; a lived history, once lived, forever."** User-facing time
  advances and reroll affordances draw a fresh plausible outcome per click; the lived past
  never rewrites; tuning is owner-signed and versioned; auto-tuning was deliberated and
  rejected. [END-STATE INTENT / CONSTITUTIONAL] (source: memory/the-promise-ratified.md)
- **The scope boundaries** that filter every mechanic: (1) **world-only, not party-facing** —
  "we only provide the setting and background dynamic world"; (2) **sub-century horizon**; (3)
  **simplicity over fidelity**; (4) **never resolve a named character's fate** — world events
  act on aggregates and may *flag* a named character at risk as a hook, but "the sim RAISES
  stakes and tension; the DM SPENDS them"; (5) (added 2026-08-06) **setting-agnostic
  medieval** — the acceptance test is "does this survive a cosmology with no geology?", so
  there are no terrain-bound catastrophe mechanics; the DM authors the physical cause and the
  engine metabolizes the universal consequences. [END-STATE INTENT]
  (source: memory/product-scope-boundaries.md)
- **Faith is sociology, never theology** (owner, 2026-08-06): "It is nothing more than an
  extension of culture and traditions… The users have to determine whether a divine act happens
  and whether to attribute any meaning to it." No premade deities anywhere; gods enter only
  through custom content. The 2026-09-12 carve-out permits prose in which **the followers act**
  — never the god. [END-STATE INTENT / BUILT]
  (source: memory/deity-doctrine-no-premade-pool.md)
- **NPCs age into states, never fates.** Stasis is "a shelf, not a grave"; a caught-corrupt NPC
  resolves through a verdict table (jailed, banished, turncoat, criminal founding) with roaming
  as the shared displaced state; reputations travel; a destroyed settlement scatters its named
  cast as story-seeds. The engine kills no named character, ever. [END-STATE INTENT]
  (source: docs/DESIGN_NPC_LIFECYCLE.md §2; docs/DESIGN_NPC_CONSEQUENCES.md §0–§1)
- **The ten covenants** the finished product makes to the user (abridged): same seed, same
  world forever · new features never disturb old worlds · truth and belief stay separate on
  every surface including the AI's · no named fate is ever resolved by the machine · the party
  observes, it never feeds the math · everything can explain itself · bounded emergence,
  "rescuable, never annihilated" · the governor throttles spontaneity, never causality ·
  patterns over entities, the DM baptizes · fast on day one and fast in year ten.
  [END-STATE INTENT] (source: docs/VISION_IDEALIZED_FINAL_PRODUCT.md, THE COVENANTS)

---

## E. EDITING AND AUTHORSHIP (the biggest in-flight piece)

- **EDIT MODE** (owner design, 2026-09-19, architecture written, build train in flight): in the
  Library a saved settlement gets Edit; the dossier enters a mode where every editable card
  carries a **pencil** and every appropriate section carries a **plus**; clicking opens a modal
  over a darkened page with every field the card owns; **every value comes from a typed pool**
  — "nothing is written, everything comes from a pool based in this entire code base"; a quick
  save drops the change into an ordered **decree registry** at the foot of the dossier; leaving
  edit mode and advancing time applies the entries in order. The owner: "This is my way of
  trying to gamify it and make it intuitive." [IN FLIGHT]
  (source: memory/design-2026-09-19-edit-mode-pools-decree-registry-and-guards-proposal.md;
  docs/DESIGN_EDIT_MODE_AND_DECREES.md; docs/ARCH_EDIT_MODE_AND_DECREES.md)
- **Guards are suggestive, never refusals.** Owner: "in the magical world something can just
  happen overnight or the DM playing God decides so." A guard warns "X must happen before Y"
  and offers three doors — fulfil it for me / let me do it / proceed as it is — and an override
  is chronicled with the table's hand as its cause and no invented explanation. [IN FLIGHT]
- **Draft vs canon decides the effect, not the field.** A draft takes plain edits that apply
  now; a canonized town turns every pooled edit into an **event at the next advance**. Names
  and annotations still apply on save (spelling corrections are not chronicle events).
  Everything is reversible until the tick; an applied entry reopens read-only, because the
  lived past is immutable. [IN FLIGHT]
- **Edit at the source, never at the derivation.** Three kinds of fact: seed-level (the
  wizard's), **root** (editable: NPC name/role, institution name/class, faction category, power
  seat holder), and **derived** (economy, supply chains, defense scores, food security,
  history — never editable; the card shows provenance instead of a pencil; decrees are the
  lever). World facts (terrain, culture, trade access, resources, goods, services, stressors)
  *are* editable, and **a change never re-rolls** — one engine re-derives with every other
  chooser's output pinned from the record, so "the teleported port keeps its harbour master;
  incoherence is consequence." [IN FLIGHT]
- **Phantom counterparties.** No realm is required for a theatrical war or trade: the DM names
  a counterparty, it is minted from a seed, and a phantom "can absorb an act but never return
  one" — consequences at home are real, outcomes abroad are record-only, the chronicle marks
  them off-stage. [IN FLIGHT]
- **Edits do not travel.** The DM's layer and the registry live only in the owner's save; forks,
  imports and the gallery carry the seed's world alone. [IN FLIGHT]
- **The finite-semantics law is the reason for all of it** (owner, 2026-07-20): "players have
  unlimited freedom; the world's memory of that freedom is FINITE." Every effect touching the
  engine is a typed record from a closed vocabulary with bounded magnitude. Free text serves
  exactly three roles — the DM's verbatim words on a receipt, fuel for AI flavour polish, and
  the input UX the AI translates into proposed typed records that a human confirms.
  [END-STATE INTENT / CONSTITUTIONAL] (source: memory/finite-semantics-law.md)
- **Custom content (the Compendium / content plane).** The user authors institutions, resources,
  stressors, goods and deities; at the far end the AI may propose "any content, any vocabulary,
  any world — at the extreme end, a fully coherent sci-fi setting" but **only what compiles
  into a registered, validated content type lands, and only in that user's account**: "no
  content type = no landing." [END-STATE INTENT / partly BUILT]
  (source: docs/DESIGN_CONTENT_PLANE.md §0; docs/COMPENDIUM_COMPLETION_PLAN.md — the 63-gap
  compendium completion program closed 2026-07-22)
- **Import.** A staged reconciliation workflow — ingest without mutation, parse with
  provenance, propose matches, surface conflicts, let the DM confirm/skip/create each mapping,
  preview the command set, apply, keep a receipt. "Imported prose never silently becomes
  mechanical truth." Today this covers structured SettlementForge exports; universal campaign
  import (relationships, maps, chronicles, third-party formats) is explicitly a later vertical.
  [BUILT (SettlementForge exports) / PARKED (universal)]
  (source: docs/PRODUCT_COMPLETION_ARCHITECTURE.md §8, §11)

---

## F. THE AI EXPERIENCE

- **One trust model:** "something proposes — the simulator validates and resolves — the DM
  authorizes." The AI is "interface, interpreter, planner, analyst, and editor; NEVER the
  engine: it cannot silently alter canon, must confess mechanics the simulator lacks, cannot
  see DM truth when writing for players, and leaves a permanent record of everything proposed
  and decided." [END-STATE INTENT] (source: docs/VISION_IDEALIZED_FINAL_PRODUCT.md, Layers 3, 5)
- **The Surveyor (the interpreter).** ASK anything and the analyst answers from receipts,
  citing the causal chain. COMMAND anything — "make the king's grip slip without civil war" —
  and the intent compiler returns a labelled, conservative, reviewable proposal: required,
  inferred, optional, uncertain, protected. After a session, tell the world what your players
  did in plain sentences, approve what it distils, advance, harvest next week's material.
  "Play, tell, approve, advance, harvest: the campaign's heartbeat." [END-STATE INTENT]
- **The surface is one prompt box**, not a workshop (owner order, 2026-08-01): it expands
  upward on wrap, talking plainly to it does everything the workshop did, it accepts file and
  folder uploads ("listen to this audio recording," "look at this document"), a chat window
  above shows the conversation, output is copyable. [END-STATE INTENT / partly BUILT — the
  single floating door and its router exist] (source: docs/DESIGN_AI_CHAT_SURFACE.md §0, §0.5)
- **The capability ladder.** Different models must not share one ceiling; a model's tier is
  assigned by a **measured probe**, never by self-assessment or model name. The floor is
  uniform because every AI output is a typed bucket the engine validates — weak models fail
  closed. [END-STATE INTENT, pricing half ships inert]
  (source: docs/DESIGN_AI_CAPABILITY_LADDER.md §1)
- **The intent atlas** gives AI surfaces an id-free, k-anonymous aggregate picture of how users
  actually build, with the owner's hard constraint that "the AI must not remember this data
  after use" — satisfied architecturally (injected per request into stateless edge calls).
  [END-STATE INTENT] (source: docs/DESIGN_AI_INTENT_ATLAS.md §1)
- **On the product surface** the AI is presented as the Narrative Layer: "The Narrative Layer
  never invents facts. Everything it needs is already in the brief… Every AI feature here reads
  and proposes; only the deterministic engine writes canon." Priced in credits (5 credits to
  narrate). Providers are rented, the world model is owned, **bring your own key**. [BUILT]
  (source: src/copy/landing.js `voice`; docs/VISION_IDEALIZED_FINAL_PRODUCT.md Layer 5)

---

## G. LOOK, FEEL AND VOICE

- **The brand mark is the painted plaque bearing the wordmark with the wax seal**, part of the
  owner's own arrow-header painting. The OG wordmark and the favicon are derivatives; "never
  describe the favicon or the OG wordmark as 'the logo'." Palette: parchment #FBF5E6, ink
  #1B1408/#2C2210, gold #C9A24C–#D9B566, oxblood #8B2E2E; Lora is the serif on every
  non-painted surface. [BUILT] (source: memory/brand-... ; public/brand/{plaque.png,seal.png,arrow/})
- **The voice is a "calm campaign archivist"** — literate, unhurried, one idea per sentence,
  teaching through concrete civic nouns (the wall fund, the garrison, the salt road, the grain
  pit) rather than adjectives. Zero em dashes; no exclamation points; never sells, never hedges.
  "The reader should never feel addressed by a product. They should feel handed a dossier by
  someone who has lived in the world longer than they have." [END-STATE INTENT / enforced]
  (source: docs/VOICE_AND_TONE.md §1–§2)
- **"Craft-true, never archaeology"** (owner-approved 2026-08-04): the header is a war arrow —
  a cedar shaft, grey-goose fletching, silk whipping, a brand burned into the wood, a wax seal
  in the name — and the copy may know that. A fletching is *bound*, a whipping is *wound*, wax
  is *pressed*, a brand is *burned*. What it may never do is read like a museum label.
  (source: docs/VOICE_AND_TONE.md pillar 9)
- **The guidance law: "the world teaches; the software whispers."** Every hint renders from the
  study's own cloth, sits at margins and rest-points, never floats over content, never dims,
  never interrupts mid-action. The per-hint acceptance test is the **dissociation test**:
  *could this be screenshotted and mistaken for the world's own furniture?* Three guards keep
  it honest — comprehension outranks costume; the rescue lifeline (search, glossary, handbook)
  stays boring and findable; **commerce never wears the costume** (tier and price surfaces
  speak plain). Named violators to be cured: the floating post-generation coach, the
  dim-everything map tour, the full-screen pipeline overlay, generic tooltip chrome, and ~340
  native OS tooltips. [END-STATE INTENT] (source: docs/DESIGN_GUIDANCE_LAYER.md §0–§1)
- **"The site should feel bound like one book."** A surface's visual formality sets the minimum
  formality of every sentence rendered inside it; raw-scalar pills ("Severity 45%", "Tick N")
  are banned in manuscript and ceremonial registers and become band words and in-world dates.
  A ~12-behaviour motion grammar (lay-down page arrival, rule self-draw, hover = ink-darken
  never lift, seal impress-once, almanac page-turn) replaces generic fades; no bounce, no
  spring. Hero moments: **the arrival** (forge → dossier delivery), **the first advance**,
  **the export ceremony** (seal meets medallion on the cover), **the road** (the landing
  journey). [END-STATE INTENT]
  (source: docs/DESIGN_BOUND_BOOK.md §1–§2; docs/DESIGN_DEEP_CRAFT_PAGES.md)
- **The UI north star:** "the content is the hero; the UI is the calm, credible frame." Two
  readers at once — the skimmer hunting "who runs this town and why is it tense" mid-session,
  and the worldbuilder verifying the simulation hangs together. "A visible contradiction is the
  cardinal sin." Lead with deltas and anomalies, not static stats. Accessibility: the medium
  never costs legibility — phone floors of prose ≥14px / chrome ≥12px; reduced-motion renders
  every hero moment instantly. [END-STATE INTENT]
  (source: docs/UIUX_PRINCIPLES.md North Star, P1–P4; the phone floors from the tome law memory)

---

## H. ACCOUNTS AND MONEY

- **The ladder mirrors the depth** (vision): free forging with the anonymous funnel; $2.99 buys
  any single dossier as a permanent artifact; Premium buys the living world; Surveyor ($19.99)
  buys the interpreter — "priced against prep hours, not tool subscriptions" — with managed
  outcome-priced credits and BYOK; thirty lifetime Founders. [END-STATE INTENT]
  (source: docs/VISION_IDEALIZED_FINAL_PRODUCT.md, THE BUSINESS)
- **As configured today:** Wanderer (free account — every size, full customization, **3 saves**,
  Gallery sharing) · **Cartographer** (premium, $5.99/mo, unlimited saves and exports — "the
  living simulation: the Realm, wars that end themselves, custom content, and gallery import")
  · **Surveyor** ($14.99/mo — the band $14.99–19.99 ruled at its floor — BYOK, AI early access:
  "an analyst for your world, prose briefs, and session interpretation that proposes edits for
  you to approve. It never writes canon") · **Founder** (by invitation). Credit packs
  $4.99 / $9.99 / $19.99; single dossier $2.99. Per-task AI costs in credits: analysis 3,
  brief 4, session interpret 5, parley 3, custom content 6. An annual Cartographer plan
  ("two months free") is landed dark at factor 0. [BUILT]
  (source: src/config/pricing.js TIERS/SURVEYOR_PLAN/SINGLE_DOSSIER/SURVEYOR_AI_COSTS;
  src/config/tierFacts.js; src/copy/landing.js `closer.tiers`)
- **An anonymous visitor** may forge Hamlet, Village or Town without an account; a free account
  unlocks Thorpe and the upper sizes, saving, and full Basic/Advanced control. [BUILT]
  (source: src/config/tierFacts.js ANON_SIZES, SIGN_IN_UNLOCKS)
- **The Founders' Hall.** Thirty numbered chairs, Roman numerals I–XXX, **all by invitation,
  none sold, ever** (superseding an earlier fifty-seat, purchasable design within the same
  session). The owner: "I want to be selective and use them as a marketing strategy rather than
  a quick money grab — such as prominent DMs." The Founder card stays on the pricing page as a
  prestige artifact with no purchase path; a structural pin asserts no Stripe price exists. A
  dedicated public route, deep-linkable, "not a modal, not a section: a place." [END-STATE
  INTENT] (source: docs/DESIGN_FOUNDERS_HALL.md §0–§2)
- **Purchases are locked until launch**, and the whole editor sits behind the Cartographer tier
  and stays dark outside preview/staff until the owner opens it — paid-surface behaviour is
  owner-gated even under full delegation. [END-STATE INTENT]
  (source: memory MEMORY.md index fold rows; memory/design-2026-09-19-edit-mode... §934.52)
- **Gallery account-standing badges + a sponsored showcase** (Wanderer → Cartographer →
  Surveyor → Founder, with increasing prominence; a sponsored class in its own shelf at the top
  of the gallery) are fully designed but **PARKED** — activation is owner-gated.
  (source: docs/DESIGN_GALLERY_SHOWCASE.md §0)

---

## I. THE MAP AND VISUAL LAYER

- **The settlement map** (owner-commissioned, design frozen): viewable only in the Library, a
  `[Dossier | Map]` toggle above every saved settlement, interactable — "if you move the cursor
  over a building, it should show what institution that building or buildings or district"
  is — with basic editable options, and "tied explicitly to the dossier: if one is impacted, so
  is the other." Architecturally the map is a **pure view-time projection** of the settlement
  object, never persisted geometry, so mutual consistency is free rather than enforced, and
  same-seed byte identity is untouched. [END-STATE INTENT, design frozen]
  (source: docs/DESIGN_SETTLEMENT_MAP.md §0–§1)
- **The 3D illustrated settlement portrait** exists as an opt-in view; default promotion is
  "deliberately withheld" until repository, rendered-matrix, physical-device, accessibility,
  representative-user and field-soak receipts are all current. The 2D plan remains the
  precision, accessibility, export and performance fallback. [BUILT, opt-in; promotion PARKED]
  (source: docs/TOWN_SCENE_PROMOTION_CONTRACT.json; docs/CURRENT_STATE.md)
- **The realm map** imports an Azgaar/FMG snapshot, places settlements, and draws routes and
  relationships; continuous conditions (fronts, plague, belief-divergence) are intended to be
  drawn on it as instruments. [BUILT (premium) + END-STATE INTENT]
  (source: docs/PRODUCT_COHERENCE.md §2; docs/VISION_IDEALIZED_FINAL_PRODUCT.md Layer 4)
- **The deep living map** — persistent scarring history, "the burned quarter still scarred years
  later, the boom district visibly risen, the temple grown two sizes since the plague made it
  beloved" — is named in the vision as "the parked last thing," and PRODUCT_COMPLETION
  lists "deep living-map scarring before retention evidence" under Deferred by design.
  [PARKED] (source: docs/VISION_IDEALIZED_FINAL_PRODUCT.md Layer 4; PRODUCT_COMPLETION_ARCHITECTURE.md §11)

---

## J. WHAT A USER SHOULD FEEL

- **"I want the absolute best product not compromises."** And: "I could've launched some
  version of all of this a year ago or a month ago. I will keep waiting on launch for the best
  product." Launch date is not a pressure the owner feels. [OWNER DIRECTIVE, 2026-08-27]
  (source: memory/time-is-not-the-constraint-quality-is.md)
- **Trust is the product.** "For this audience worldbuilding is a data-consistency problem —
  contradictory lore breaks immersion faster than anything else." The design's anchoring
  question: "does this help a GM trust the world and run it faster?"
  (source: docs/UIUX_PRINCIPLES.md P2, North Star)
- **Immersion over everything on product surfaces**, including over conversion microcopy; the
  owner moved a transactional caption to hover because visible transactional microcopy "breaks
  immersion a bit." (source: memory/owner-marketing-doctrine.md)
- **The claim translated to the reader's side**, which is how the finished product is meant to
  land: determinism → "the war you watched start three sessions ago is still the same war";
  regen-surviving edits → "what you write is canon; the sim builds around you, never over you";
  the hand-authored corpus → "the news reads like someone who lives there wrote it"; rumour
  physics → "news arrives late, garbled, and more garbled the farther it traveled."
  (source: memory/owner-marketing-doctrine.md, 2026-08-05 sharpening)
- **The deepest commitment**, stated in the vision's own words: "the human at the head of the
  table is the author, and the world is the co-author that never breaks character and never
  forgets." (source: docs/VISION_IDEALIZED_FINAL_PRODUCT.md, WHAT IT IS NOT)

---

## CONTRADICTIONS BETWEEN DOCUMENTS (newest / owner-ratified wins)

1. **Progressive disclosure.** `docs/UIUX_PRINCIPLES.md` P1 explicitly prescribes "progressive
   disclosure with strong information scent." The **owner's 2026-09-19 ruling vetoes progressive
   disclosure in the dossier** and replaces it with reference-book apparatus. The owner ruling
   is newer and binding for the dossier; UIUX P1 survives only where it does not touch the
   dossier's own volume problem.
2. **Organizing the dossier by the DM's question.** `docs/PRODUCT_COHERENCE.md` (2026-06-16)
   and the chair's later reviews pushed toward a question-shaped front door; the owner refused
   twice and the chair's recommendation is recorded as **withdrawn**. The owner wins.
3. **Founder seats.** `DESIGN_FOUNDERS_HALL.md` §0 records "fifty seats, twenty purchasable"
   and then supersedes itself in the same session: **thirty chairs, all by invitation, none
   sold**. The later text binds.
4. **Surveyor price.** The vision states "$19.99"; `src/config/pricing.js` SURVEYOR_PLAN is
   **$14.99/mo** — ruling §464.2 set the band $14.99–19.99 and took its floor. The config is
   newer and binding.
5. **Programme state docs are stale.** `docs/CURRENT_STATE.md` is dated 2026-07-28 and
   `docs/START_HERE.md` 2026-07-18; both say git wins. The live state is in
   `docs/HANDOFF_CURRENT.md` and the memory index (2026-09-20).

---

## WHAT THE FINISHED PRODUCT FEELS LIKE, IN ONE PARAGRAPH (experience view)

You arrive at a painted door — a hand-made arrow header with a wooden plaque and a wax seal —
and follow a road down the page past five stops that each show you one real town rather than
telling you about a product. You pick a size and click once; a few seconds of deliberate
theatre later (the machine itself took milliseconds) a settlement exists, and what you get is
not a list of rolled results but a document: a gazetteer on parchment, organized the way a
reference book is organized — by subject, not by your question — with a lede sentence at the
head of each section, the same facts always in the same place, an index of names in the back,
and nothing hidden behind a click, because the product trusts you to navigate. You read who
holds power and why the captain is corrupt, and the answer is sitting one sentence away,
because every fact was derived from the last one. You keep the town in your Library, set it
among its neighbours in the Realm, add your own gods and guilds in the Compendium, and then
start the clock. Weeks pass while you are away, and when you come back the world tells you what
it did — at whatever altitude you want, from a single headline down to the receipts — with
threads instead of a feed, causes attached to every change, and a chronicle that writes itself.
You can put your own hand in: a pencil on any card, a plus on any section, every value chosen
from a pool rather than typed, each change dropping into an ordered registry at the foot of the
document that applies when time next moves, with the world politely warning you that one thing
usually happens before another and then doing whatever you told it anyway. You can talk to it
in plain sentences and get an analyst's answer with its causal chain cited, or tell it what
your players did last night and approve the changes it distils — and it never writes canon, and
it never invents a fact. You export a shelf-worthy PDF with a seal and a colophon, share a
sanitized copy to a public gallery, or fork somebody else's town that has already lived a
little. Nothing ever shouts at you; nothing exclaims; nothing reads like software. The feeling
the whole thing is built for is that the place was already there, that it will still be the
same place next week, and that you are its author while it is your co-author — one that never
breaks character and never forgets.

---

## THINGS I COULD NOT DETERMINE

- **Onboarding's intended end-state shape** beyond the guidance layer's disposition of the
  current violators (the post-generation coach, the map tour, the pipeline reveal). No
  first-run flow spec was found under a name I searched.
- **Whether the fore-edge-tab / rubric tome chrome has been ordered as a build.** The memory
  states it is the chair's *recommendation*, not yet an owner build order — so the dossier's
  current chrome (pills, bars, bordered cards) is still what a user sees.
- **The "Herald"** is named in `PRODUCT_COMPLETION_ARCHITECTURE.md` as "the campaign-scale
  command brief" and the Workbench as "the focused edit/receipt surface," both behind
  default-off rollout flags; I did not find a dedicated design doc for the Herald's UI.
- **Any mobile app.** Nothing found; the phone experience is the responsive web surface (the
  phone bar, the scroll-shaped dossier).
- **A real bespoke-town commission price paid by a private DM** — the owner's value anchor
  records this as NOT FOUND after search; the price column is an estimate, not an objective fact.
