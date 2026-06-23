# SettlementForge Voice & Tone Bible

*The single source of truth for every word a Dungeon Master reads, from the landing hero to the deepest NPC ledger. One voice. Zero em dashes. Immersion first.*

> Derived from a full deconstruction of every prose surface (pages, the 17-tab
> dossier, the centralized copy registry, and the ~23 databases the dossier
> composes from) plus research into product voice systems, diegetic UX writing,
> TTRPG gazetteer prose, task-tuned microcopy, and the em-dash-as-AI-tell
> question. This codifies the voice already named in the header of
> `src/copy/en.js` ("a calm campaign archivist") and holds the line the
> codebase never held.

---

## 1. The Voice, in One Paragraph

SettlementForge speaks as a **calm campaign archivist**: a literate, unhurried hand who has read the settlement's whole file and now sets the facts down plainly, one idea per sentence. The archivist teaches through concrete civic nouns (the wall fund, the garrison, the salt road, the grain pit) rather than adjectives or judgment. They never sell, never hedge, never exclaim. They trust the world to be interesting on its own, because the simulator made it cohere: every street, every faction, every reason the place has not collapsed yet has a cause sitting one sentence away. When the archivist explains a mechanic, they explain it the way they would tell another DM at the table, in the world's own terms. When they file a fact, they state it and move on. The reader should never feel addressed by a product. They should feel handed a dossier by someone who has lived in the world longer than they have.

---

## 2. Voice Pillars

**1. Teach through concrete nouns, not adjectives.**
The voice is calmest when it is most specific. Name the civic thing; let it carry the meaning.
- Do: "Who owes whom, who eats what, and why prices wobble in spring."
- Don't: "For the DM running a *real* campaign." ("Real" is a judgment doing the work a noun should do.)

**2. One idea per sentence.**
A break in thought is a new sentence, not a clause stapled on with punctuation.
- Do: "No manual constraints. Fully procedural."
- Don't: "No manual constraints — fully procedural."

**3. State, do not sell.**
Every string is a teaching moment, never a pitch. Strip promotional urgency and SaaS verbs.
- Do: "Generate any size from hamlet to metropolis, free. See if a campaign takes root."
- Don't: "Generate any town, full size, free. See if the engine earns a campaign."

**4. Stay diegetic; keep the chrome inside the fiction.**
Buttons, labels, and toggles are the archivist's filing system, not a UI spec.
- Do: "Reveal DM-private content. Secrets, plot hooks, NPC goals, your DM notes, and the DM Compass become visible to all readers."
- Don't: "AI-narrated dossier ... DM-private content is still removed." ("AI-narrated," "content" are feature-flag language.)

**5. Let the data speak; never explain the simulation's rules to the reader.**
Drop meta-language ("this tab," "you will see," "what matters is whether"). The archivist files facts; they do not narrate their own filing.
- Do: "A coherent settlement holds together logically, even if some resources go untapped and some needs go unmet."
- Don't: "This tab checks whether your settlement makes logical sense. Not whether it's economically optimised."

**6. Causality is the house rhetoric.**
Show why the place holds together. Two facts and the seam between them beat one adjective.
- Do: "The captain is corrupt because the wall fund is short. Towns hang together when their problems explain each other."
- Don't: "A defining crisis — expect cascades."

**7. Match the world's register, not the editor's.**
No editorial asides, no dramatic pauses, no novelist's interruptions. The archivist finishes the thought and turns the page.
- Do: "Answers questions. Asks nothing. Remembers more than they show."
- Don't: "never volunteers information — only answers what is asked."

**8. Trust the reader. Cut the sentence that repeats the last one.**
Overexplanation drains the reader's energy and attention, and it breaks immersion faster than a clumsy sentence does. State the thing once, with the most concrete words, then stop. A second sentence that restates the first idea, a clarifying gloss the fact already implies, or a tagline explaining the point you just made: cut it or fold it in. This is not a war on prose or literary device. A vivid image, a fragment, a turn of phrase all stay. What goes is prose that *over-clarifies*. The DM is smart. Let the world do the talking.
- Do: "If the salt road closes, this town runs out in eleven days. That is a session waiting to happen."
- Don't: "If the salt road closes, this town runs out in 11 days. That's a session. Supply chains aren't flavor, they're fuel." (Three taglines for one fact. Two of them say the same thing.)
- Do: "The captain is corrupt because the wall fund is short."
- Don't: "The captain is corrupt because the wall fund is short. The shortage in the wall fund is why the captain turned corrupt." (The second sentence is the first sentence backwards.)

---

## 3. Hard Mechanical Rules

### Punctuation

**No em dashes (`—`, `&mdash;`, U+2014) in any user-facing string. Ever.** This is the single most violated rule in the audit and the most legible AI tell. Every dash in a string a user reads must be replaced. See the playbook in Section 6 for the per-context replacement. (Developer-only code comments are out of scope; this rule governs text the reader sees.)

**No exclamation points in user-facing copy.** Replace with a period and let the fact stand.
- `'Complete!'` to `'Complete'`
- `"That's the tour — happy worldbuilding!"` to `"That's the tour. Happy worldbuilding."`
- An alarm prefix like `! ` to a plain word: `Missing: {name}` (or a silent visual badge; never an alarm glyph).

**No en dashes as connectors either.** A range gets a word: "hamlet *to* metropolis," not "hamlet–metropolis."

**Colons** introduce a list, an expansion, or a clarification: "Foundations: size, route, culture." "Bring proof: claw, ear, or head."

**Semicolons** are permitted but rationed, for two balanced independent clauses where a period would feel too hard. Prefer a period when in doubt.

**Parentheses** carry rank, type, or a true aside: "listed as (transit)," "(Premium)," "(a coup, an arrival, a schism)." Never use a dash where a parenthesis fits.

### Sentence shape

- One idea per sentence. When a sentence has a dash holding two ideas, split it.
- Fragments are allowed and good for oral delivery and ledger texture: "Tired. Not rudely, but visibly." "No resident clergy."
- Open declaratively. Avoid gerund-stacked bureaucratic openers ("Coordinates regional caravan assembly...") where a plain subject-verb works ("The hall coordinates caravan assembly.").
- Avoid rhetorical-question pile-ups as a stylistic tic. One pointed question is a hook ("Suicide or silenced?"); a habit of them reads as a novelist, not an archivist.

### Capitalization

- Sentence case everywhere in prose and most labels.
- Never capitalize a word for emphasis. `Share the STRUCTURE` to `Share the structure`. `generates ANY size` to `generates any size`.
- Proper in-world and feature nouns keep their caps where they are genuine names (see the Living Lexicon below).
- Tier names are capitalized as names (Wanderer, Cartographer, Founder); generic tier perks are not.

### Numerals

- **Spell out numbers inside diegetic prose**, where they read as part of the chronicle: "refined across thirteen passes," "runs out in eleven days."
- **Use digits in mechanical, scannable UI**: feature lists, counts, requirements, prices: "3 saved settlements," "at least 8 characters."
- The line: if the DM would read it aloud or read it *as the world*, spell it. If they scan it as a spec, use digits.

### Contractions and register

- **Error and security copy uses no contractions.** Trust moments stay measured: "cannot," "does not," "do not."
- **Diegetic prose may contract** where the world speaks naturally ("the place hasn't collapsed yet"). The split is by surface: Account/Auth/Admin/errors = formal; in-world chronicle = natural.
- Don't soften commands into suggestions in security contexts. "You must keep at least one method connected," not "Keep at least one method connected."

### Terminology & verb registry (standardize the audit's inconsistencies)

| Use this | Not this | Why |
|---|---|---|
| simulated, derived | AI-generated (except the explicit anti-AI claim) | The product is a deterministic simulator |
| narrated, the Narrative Layer | AI-narrated, AI overlay | Drop the industry prefix |
| simulation, the engine, a run | live engine, payload | Keep the in-world word |
| private content (secrets, hooks, notes) | DM-private (as standalone jargon) | Spell the concept |
| reach (a size) | unlock, push to (a size) | "Unlock" only for genuinely feature-gated things, never sizes |
| advance time, run for years | earn a campaign, see if the moat is real | Concrete DM action |
| visible on the gallery | publicly visible, public-safe | Strip the marketing adverb |
| saved settlement, your library | (SaaS framing of "account") | Civic, not SaaS |
| from hamlet to metropolis | hamlet — metropolis, any town full size | Word the range; never a dash; never "town" as a size |
| settlement facts, the dossier | placements, content, overlay | Concrete civic nouns |
| the party | the PCs | "PCs" must never appear in user-visible copy |
| profit from, take, extract | profit enormously, earn | No promotional intensifiers |

**Verb agency:** prefer concrete civic verbs (drives, holds, runs, feeds, profits from) over abstract enablement verbs (supports, enables, attracts).

**The "real" / "true" rule:** never use "real" or "true" as a quality judgment ("a real campaign"). Use it only when it carries mechanical meaning ("the bandit threat is real because both tabs read the same source").

### Living Lexicon (fixed in-world proper nouns; keep their caps)

World Pulse · DM Compass · Narrative Layer · Event Composer · Realm · Compendium · Chronicle · Neighbourhood System · Wanderer · Cartographer · Founder · Draft · Canon · Run · Timeline. Verb registry for actions: **Forge** (first generation), **Reforge** (regenerate), **Reroll** (one section), **Narrate** (prose pass), **Canonize**, **Advance time**.

---

## 4. Per-Surface Tone Matrix

The voice is one. The *tuning* shifts per surface task.

| Surface group | Task | Tonal tuning | Exemplar (before → after) |
|---|---|---|---|
| **Core copy registry** (`en.js`, `strings.js`) | Single source of truth; every string a teaching moment | Most neutral and authoritative. No marketing verbs, no judgment adjectives, no hedges. | "Generate any town, full size, free. See if the engine earns a campaign." → "Generate any size from hamlet to metropolis, free. See if a campaign takes root." |
| **Home / landing** | First contact; convince a cold DM the simulator is real | **Most diegetic.** Read like a DM's own note, not a product page. Shortest sentences. | "A free account generates ANY size — hamlet through metropolis — saves your work..." → "A free account generates any size, from hamlet to metropolis. It saves your work and exports the PDF." |
| **Generate wizard & pipeline reveal** | Configure a settlement; reveal the simulation running | **Two registers.** Config UI: plain, procedural. Pipeline step labels: theatrical narration of the engine (kept by design). | "size, route, culture — the essentials" → "Foundations: size, route, culture. The essentials." |
| **Dossier shell & tab framing** | Bracket the dossier with tabs, banners, callouts | **Transparent chrome.** The frame is a filing system, not a UI. Concrete verbs on buttons. | "Narrative Layer — Identity" → "Narrative Layer: Identity" |
| **Dossier content tabs** (the 17-tab read) | The DM's primary table read | **Pure diegesis.** No "this tab," no meta. Let the data speak; clean empty states. | "This tab checks whether your settlement makes logical sense." → "A coherent settlement holds together logically, even if some resources go untapped and some needs go unmet." |
| **Settlement detail & campaign-state** | Author events; inspect war, faith, state | **Archival, fact-forward.** State the consequence and move on; no dramatic pause. | "This destroys {name} — services go dark..." → "This destroys {name}. Services go dark, institutions are impaired, and partner relationships sour." |
| **Pricing & conversion** | Earn trust at the pay decision | **Warm but plain.** One concrete payoff per sentence. Trust through specificity, not flourish. | "A great town in seconds — and a region that grows with you." → "A great town in seconds, then a region that grows with you." |
| **Gallery** (public dossiers) | Browse, publish, set visibility | **Lore-keeper documenting the gallery's rules,** not a PM explaining feature flags. | "The gallery will show your AI-narrated dossier..." → "The gallery displays your narrated dossier. Viewers read the refined prose. Private content (secrets, hooks, notes) stays hidden." |
| **Compendium / custom content** | Reference catalog + custom authoring | **Docent-like, documentary.** Factual, never selling or alerting. | "Custom Compendium &mdash; Premium" → "Custom Compendium (Premium)" |
| **Map / Realm hub** | Place settlements, advance time, manage wars and faith | **Calm in-world advisor.** Tour copy especially: a sage guide, not modern marketing. | "Toggle overlays — relationships, supply chains, labels — to focus..." → "Toggle overlays: relationships, supply chains, labels. Focus on what matters right now." |
| **Account / Auth** | Sign in, billing, privacy, support | **Transactional but of-a-piece.** Formal register: no contractions, no emphasis caps, complete sentences. | "Share the STRUCTURE of your settlements — tiers, counts..." → "Share the structure of your settlements (tiers, counts, conditions, causal bands) to study how coherent settlements are designed." |
| **About / How-to / Compare** | Explain the thesis, the workflow, the alternative | **Grounded teacher.** Strip marketing lilt and reference-table dashes; one idea per sentence. | "They solve different problems — and they're better together than apart." → "They solve different problems and work better together than apart." |
| **Admin & misc modals** | Internal tooling + user-visible error/balance copy | **Diagnostic observation.** Plain statement of fact, concrete and kind. Never defensive or alarmed. | "Wars may be too frequent — {sieges} live sieges across {n} settlements." → "Wars may be too frequent. {sieges} live sieges across {n} settlements." |
| **DATA: NPCs** | Prose read aloud at the table | **Steady, archival, oral.** Fragments aid delivery; appositives take commas. | "Speaks in short, clipped sentences — every word intentional" → "Speaks in short, clipped sentences, every word intentional." |
| **DATA: Institutions & services** | Town gazetteer entries | **Plain declarative.** Name it, state its nature, move on. No service-catalog gerunds. | "Raise dead — expensive, not guaranteed" → "Raise dead. Expensive and not guaranteed." |
| **DATA: History & narrative** | Arrival scenes, terrain hooks, plot hooks | **Diegetic chronicle.** Two clean ideas over one dashed one. "The party," never "the PCs." | "A reformer has been found dead — suicide or silenced?" → "A reformer has been found dead. Suicide or silenced?" |
| **DATA: Stress / pressure** | Viability notes, crisis hooks, secrets | **Matter-of-fact spy report.** Dark and tense already; punctuation stays bureaucratic. | "Something important — a resource, a prisoner, a decision — falls into the contested space..." → "Something important (a resource, a prisoner, a decision) falls into the contested space between factions." |
| **DATA: Supply chain & economy** | Economics/Resources tab prose | **Documentary fact.** No "profit enormously," no "supports/enables." Extraction stated plainly. | "Oasis water — settlement depends on sustained water access" → "Oasis water. The settlement depends on sustained water access." |

---

## 5. Immersion Doctrine

The dossier is diegetic by nature. The danger is always the **chrome** around it: buttons, banners, toggles, error states, and the data that composes into prose. Keep all of it inside the fiction.

1. **The chrome is the archivist's filing system.** Tabs, banners, and buttons are labels in a campaign file, not UI controls. Use concrete verbs (Generate, View Raw, Commit, Link Neighbour) and world nouns (Chronicle, Realm, Compendium).
2. **Never name the machinery the world runs on.** No "live engine," "payload," "overlay," "feature flag," "placements." The only sanctioned technical claim is the deliberate anti-AI statement, which *uses* its plainness as immersion: "Simulated, not AI-generated. The town is derived from constraints, coherent because it has to be."
3. **The party, never the PCs.** Any string that mentions players uses "the party" or "they." "The PCs" is a dev-side term and must never reach a user surface.
4. **Empty states stay in character.** An empty tab is a quiet ledger page, not a system message. Never an error tone, never an alarm glyph.
5. **Teach the mechanic in the world's own terms.** Frame behavior as chronicle, not documentation: "Advance time and the region runs for years: wars ignite and burn themselves out, faiths win converts, trade routes flip, and a chronicle writes itself."
6. **Causality is the immersion engine.** Write the seam: corruption *because* the wall fund is short; the garrison thinning *because* a coalition besieges.
7. **Theatrical narration is allowed only where it is the engine's own voice.** The pipeline reveal ("casting NPCs," "knotting hooks") and the simulation drawer are stylized narration *of the simulation*, and they stay. The moment that register touches configuration UI, helper text, or error copy, it becomes a voice break.
8. **Trust moments earn plainness.** At pricing, auth, and privacy, immersion *is* trustworthiness. The archivist who strips every flourish reads as someone who knows the world deeply and has nothing to oversell.
9. **Let darkness sit unadorned.** Stress and history data are already grim. Do not heighten them with em dashes or rhetorical pauses; the facts carry the dread.

---

## 6. The Em-Dash Replacement Playbook

Every em dash has a job. Identify the job, then use the plain mark that does it. Default to a **period**; reach for others only when the period genuinely loses the relationship.

| Dash context | What the dash was doing | Replacement | Example |
|---|---|---|---|
| **Break between two complete ideas** | Splitting two independent thoughts | **Period. New sentence.** | "No manual constraints — fully procedural." → "No manual constraints. Fully procedural." |
| **Consequence / cause appended** | Tacking on a result or reason | **Period**, or *because/and* | "A fresh mandate — legitimacy starts warmer" → "A fresh mandate. Legitimacy starts warmer." |
| **Range** (size, tier) | Spanning two endpoints | **Word it:** *from X to X* | "any size — hamlet through metropolis" → "any size from hamlet to metropolis" |
| **Clarification / definition follows** | Introducing what something is | **Colon** | "Bring proof — claw, ear, or head." → "Bring proof: claw, ear, or head." |
| **List set off mid-sentence** | A series interrupting the clause | **Colon** (open) **+ period** (close), or **parentheses** | "Toggle overlays — relationships, supply chains — to focus..." → "Toggle overlays: relationships, supply chains. Focus..." |
| **Appositive / aside mid-sentence** | A non-essential clarification | **Parentheses**, or commas | "Something important — a resource, a prisoner — falls..." → "Something important (a resource, a prisoner) falls..." |
| **Label / title separator** | Splitting a heading from its facet | **Colon** | "Narrative Layer — Identity" → "Narrative Layer: Identity" |
| **Premium / feature tag** | Marketing-style separator | **Parentheses** | "Custom Compendium &mdash; Premium" → "Custom Compendium (Premium)" |
| **Contrast / reversal** | Pivoting "not money, but X" | **Comma**, or *but/yet* | "to collect — not money, but something specific" → "to collect, not money but something specific" |
| **Dramatic pause for emphasis** | A theatrical beat | **Delete it; use a period.** | "A defining crisis — expect cascades" → "A defining crisis. Expect cascades." |
| **Trailing condition / proviso** | "...applies — only by deliberate action" | **Comma** or **period** | "Recoverable, but only by deliberate action." → "Recoverable only by deliberate action." |

**Decision order when you hit a dash:**
1. Two complete ideas? → period.
2. Cause or consequence? → period (or weave with *because/and*).
3. A range? → *from X to X*.
4. Something being defined or listed after it? → colon.
5. A true aside or rank/type? → parentheses.
6. A contrast? → comma, or *but/yet*.
7. Pure drama? → delete and use a period.

When two replacements both fit, choose the one that yields **one idea per sentence**. The period is almost always right.

---

## 7. Enforcement

A guard test (`tests/copy/voiceMechanics.test.js`) walks the centralized copy objects (`en` and `COPY`) and fails the build if any user-facing string contains an em dash or an exclamation point. New copy cannot reintroduce the tells. The data files the dossier reads are swept for the same rules; extend the guard to them as composition coverage grows.

---

*Quick compliance checklist for any new string: No em dash. No exclamation point. No emphasis caps. One idea per sentence. Concrete civic noun doing the work. No SaaS or dev jargon. "The party," not "the PCs." Numerals spelled in prose, digits in specs. Contractions only outside trust surfaces. If you can read it aloud at the table and it sounds like the world, ship it.*
