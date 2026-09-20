# The landing page, rewritten as one narrative — DRAFT FOR THE OWNER

**Status: NOT SHIPPED.** `src/copy/landing.js` is untouched. This is the draft the
owner approves (or cuts) before a lane writes a byte of it.

**Order it answers** — ODQ §934.30 item 3: *"the voice needs work to be one cohesive
narrative rather than disconnected ideas."*

**Every quoted fact is from the regenerated fixture** (`src/components/home/landingFixture.js`,
seed `lf-033`, 12 weeks, generatorVersion 0.9.0 / simulationVersion 1), with its field
named. Nothing below is invented. Where a section's current copy makes a claim that
`tests/copy/landingClaimsParity.test.js` binds to enforcement, the claim is carried
through **word for word** and flagged ⚓.

---

## The problem, stated plainly

Read the five sections in order today and you get five pitches, not one story:

- **01 Forge** pitches the generator ("a living town in one click").
- **02 The voice** pitches the Narrative Layer ("the same facts, in a voice for the table").
- **03 The Realm** pitches the simulation ("make it canon, then let the world run").
- **04 The commons** pitches the gallery.
- **05 Set out** pitches the tiers.

Each is true. None of them refers to the one before it. Meanwhile the artifacts
beside them are all about **one place** — Cnocby — and the page never says so. The
reader is shown four cards about a village and told four separate things about a
product. The cure is not better sentences; it is to let Cnocby carry the page, and
to make each stop the next sentence of the same account.

**The spine (the arrow's order):** *here is Cnocby and what the forge knows of it →
what twelve weeks did to it → where it sits among its neighbours → how you make it
yours.*

---

## HERO — unchanged except the sub

The h1 is the strongest line on the page and does not move.

> **Your players have a thousand choices.**
> **Now you have every answer.**

**sub — proposed:**

> One click makes a town: its economy, its people, the quarrel it is having this
> week. Then time runs, and the town answers for it. A world that holds together.

*Why:* the current sub lists four nouns and ends on "Then it simulates how they
change", which is the mechanism, not the promise. "The town answers for it" is the
thing the next four sections actually demonstrate. It sets up the spine in one line.

**cta / reassure / scrollCue — unchanged.** ⚓ `hero.reassure` carries the free-tier
line and the hero is its one home.

---

## 01 · FORGE — *here is the town, and it took one click*

**h2 — proposed:**

> A living town in one click. Twenty dials when you want them.

*Unchanged.* It is the best headline on the page.

**body — proposed:**

> Pick a size and forge. Everything after that is derived, not drawn from a table:
> where the road goes, who holds the market, which faction is owed a favour, what
> was cut down a generation ago and never grew back. Open the Advanced panel and
> set terrain, age, wealth and trouble yourself.

*Facts:* "where the road goes" ← `voice.receipts[1]` (`road · Picked from
coherence-safe pool: road, road, road, isolated, isolated.`). "who holds the market"
← `voice.receipts[0]` (`The Grey Council × The Establishment · control of the market
licensing process`). "what was cut down and never grew back" ←
`voice.receipts[2]` (`mountain_timber · present but depleted (The accessible mountain
stands have been cleared faster than they can regrow.)`).

*Why:* the current body's list ("trade, factions, grudges, history") is abstract. The
same sentence made of Cnocby's own four facts sets up §02, where those exact four
receipts are printed.

**axiom — unchanged:** *"Every dossier answers the same question: given these
constraints, what must this place be?"*

**ceiling — UNCHANGED, VERBATIM.** ⚓ Bound in both directions
(`landingClaimsParity.test.js` → `ANON_MAX_SIZE_LABEL`, plus a rendered arm). Do not
touch this string.

**The brief block (`brief.*`, the Cnocby dossier card) — proposed body:**

> This is Cnocby: four hundred and twelve people, a mountain village the road
> reaches, and a bakehouse already on its second bake when you arrive. The Summary
> tab is your session prep. Systems, factions and history sit one tab deeper, for
> when the party starts digging.

*Facts:* `town.population` 412 · `town.eyebrow` "road village · mountain" ·
`town.prose` (the bakehouse, verbatim in spirit: *"Cnocby smells like bread from the
gate: a bakehouse near the entrance, open early, already on the second bake of the
day."*).

⚓ **`brief.deterministic` — UNCHANGED, VERBATIM**: *"Same seed, same town. Every
time."* (bound to the golden master).

---

## 02 · THE VOICE — *and here is how it knows*

**h2 — proposed:**

> The same town, in a voice for the table.

*Why:* one word. "The same **facts**" is the engineer's framing; "the same **town**"
is the reader's, and it ties this stop to the one above instead of restarting.

**body — proposed:**

> Left is what the engine derived about Cnocby: the road it rolled, the timber it
> marked out, the licence the two factions want. Right is the same four facts for
> the table. The Narrative Layer never invents facts. Everything it needs is already
> in the brief.

⚓ **"never invents facts" is carried word for word** (bound to `aiGrounding.js` and
its suites). ⚓ **`voice.aiNote` — UNCHANGED, VERBATIM**: it carries the
schema-wall promise (*"only the deterministic engine writes canon"*), also bound.

*Facts:* the three named receipts are `voice.receipts[1]`, `[2]`, `[0]` in the order
the card prints them.

---

## 03 · THE REALM — *then twelve weeks happened to it*

This is the stop that changes most, because the card beneath it changed most
(ODQ §934.30 item 4: it now shows events, not band deltas).

**h2 — proposed:**

> Make it canon. Then let the world happen to it.

*Why:* "let the world run" describes a machine starting. "Let the world happen to
it" keeps Cnocby the subject, which is what the new advance-time card now shows.

**body1 — proposed:**

> Canonize the draft and Cnocby becomes part of your campaign: it takes events,
> keeps a chronicle, remembers. Put it on the world map in the Realm with the towns
> around it, tie them together by trade and grudge, and add your own gods, guilds
> and goods in the Compendium.

**body2 — proposed:**

> Then advance time. In Cnocby's first twelve weeks the village took a patron creed,
> then wartime pressure, then the fracture passed and left its memory; by week ten
> there was crime, and by week twelve the road itself was strained. Every one of
> those is a record the engine wrote, and every one carries its cause.

*Facts — all from `realm.advance`, which is what the card renders:*

| week | field | the engine's own sentence |
|---|---|---|
| 1 | `realm.advance[0]` | *Cnocby turns to the faith of Vael* — "After a long contest of devotion, Vael has become the patron creed of Cnocby." |
| 2 | `realm.advance[1]` | *Wartime pressure takes hold* — "Cnocby shows enough conflict pressure for a new condition to emerge." |
| 4 | `realm.advance[2]` | *Religious conversion fracture has passed* — "…it leaves sectarian memory, temple debt, ritual disputes." |
| 7 | `realm.advance[3]` | *Nuada Walsh protects* |
| 10 | `realm.advance[4]` | *Criminal pressure takes hold* |
| 12 | `realm.advance[5]` | *Trade route strain takes hold* |

⚓ **"wars that end themselves"** stays in the Cartographer tier card (bound to
`warDeployment.js`). It is not needed in body2.

**The realm card's connective strings:**

- `realm.whyTraceTitle` — **UNCHANGED** (`Advance time · week {week}`), pinned by
  `tests/ui/homeLanding.test.jsx`.
- `realm.clockLabel` / `clockValue` / `clockCta` — **UNCHANGED**; `clockCta`
  ("Advance time") is pinned as a non-interactive span.
- `realm.derivedLine` — **UNCHANGED** (*"Every change carries its cause."*). It is
  now the honest footer of an events card: each entry's sentence **is** the cause.
- ⚠ **`realm.whyTraceTag` ("why-trace") IS NOW UNUSED.** The card stopped rendering
  the why-trace, and a mono tag reading "why-trace" over a list of events is exactly
  the stale-label defect the 09-18 walk found four of. The card now shows the
  **season** in that slot ("the spring of year 1", from the fixture). **The owner's
  call:** delete the key, or repoint it to something the card can honestly wear.
  Nothing renders it today.

**The chronicle half (beside the realm map) — proposed `chronicleTitle` framing:**
unchanged, but the section's own lead-in should name what it is, because the two
cards now say different things and a reader needs to know why:

> Beside it, the region: what the neighbours did while Cnocby was busy.

*Facts:* `realm.chronicle` is region-wide (Aryagrad, Cnocby, Penshaw);
`realm.relationships` carries `Cnocby ⇆ Keshigordu · trade partner` and
`Penshaw ⤬ Cnocby · border incident · Week 4`; `realm.neighbors` is Keshigordu
(town), Skáloy (city), Aryagrad (town), Penshaw (village).

---

## 04 · THE COMMONS — *other people's Cnocbys*

**h2 — unchanged:** *"Towns others have forged."*

**body — proposed:**

> You have just read one town. Walk the Gallery and take one that has already lived
> a little; admire and share freely, and fork one into your own Library with
> Cartographer. Cnocby is there to fork too, if you want to start from a place you
> already know.

*Fact:* Cnocby is now a curated sample (`src/data/sampleSettlements.js`,
`sample-cnocby`), which is the §934.30 item-5 change — so the sentence is true the
day this ships and not before.

*Why:* "Don't want to configure anything?" opens on a negative and on a question
about the reader's laziness. Opening on "You have just read one town" is the only
line on the page that explicitly hands the baton from the previous stop.

---

## 05 · SET OUT — *make one*

**h2 — unchanged:** *"The world holds together. Yours can too."*

**sub — proposed:**

> Cnocby took one click and twelve weeks. Yours can start before the kettle boils.

*Why:* the closer is the one place the page may say what it just did. "Forge a town
before the kettle boils" is the best line in the current closer and is kept; the
clause before it is what makes the page a single account rather than five.

**tiers — UNCHANGED.** ⚓ `{freeSaves}` and `{seats}` stay config-interpolated;
⚓ Cartographer's "wars that end themselves" is bound; the Surveyor card's AI-wall
wording is a ruling, not copy.

---

## What this draft deliberately does NOT do

1. **It does not concede speed.** Nothing here apologises for the forge's 3–10 s, and
   nothing calls it slow. The positioning law stands: as instant as any generator,
   orders of magnitude deeper, and every fact agrees. The word "instant" is not used
   as a boast either, because the page's argument is depth.
2. **It never calls the product AI content.** The only AI on the page is the
   Narrative Layer and the disclosure it already carries, unchanged.
3. **It touches no bound claim.** Every ⚓ string above is carried verbatim. The two
   claims-parity arms and the rendered-surface arm should stay green through this
   rewrite; if any of them reds, the rewrite is wrong, not the gate.
4. **It invents no fact.** Every concrete noun traces to a named fixture field. If
   the fixture is regenerated, the ⚑ sentences below are the ones that go stale and
   must be re-grounded in the same act:
   - 01 body (three receipts), brief body (population, eyebrow, the bakehouse),
     02 body (three receipts), 03 body2 (all six advance events),
     03's region line (the chronicle and the relationship chips), 05 sub (the week
     count).
   - `tests/build/landingFixtureFreshness.test.js` reds when the fixture drifts, but
     it cannot see that this PROSE drifted with it — the same residual the stock
     narration carries, and for the same reason.

## One question for the owner

The page currently ends every section with its own CTA (`forge.cta`, `brief.cta`,
`realm.cta`, `commons.cta`, `closer.cta`) — five asks in five stops. A single
narrative usually earns one ask at the end and one at the top. Cutting the three
middle CTAs to plain "read on" links would make the page read as one account rather
than five pitches, and would cost three conversion doors. **That is a product call,
not a copy call, and it is not made here.**
