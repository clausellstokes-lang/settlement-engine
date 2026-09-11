# DS-DEF-2 · `Disasters & Famine`: granary AND parish care only — REWRITE, draft round 1

Seat: Opus 5 — Fable-unvalidated. Writer packet. The rows below are the complete replacement for the
pool's variant rows: three variants in place, same vids, same order, same angle tags, none added,
none removed, none merged. The pool's typed lines are not touched and are not repeated here.

---

1. `[ledger]` Grain is stored at {settlement}, and the tending of the sick belongs to the parish. The town holds no hospital.
   - `[face]` A granary stands at {settlement}, and the sick are the parish's charge. No hospital is kept.
   - `[face]` Food sits in store at {settlement}, and the sick are attended by the clergy. No hospital stands in the town.
   - `[face]` The stores at {settlement} hold grain, and the sick pass into the parish's keeping. The town is without a hospital.
2. `[street]` The sick here are the clergy's work. The town keeps no hospital, and the grain is in store.
   - `[face]` Nursing falls to the parish, and no hospital besides. The town has its granary.
   - `[face]` The clergy do the nursing, and no hospital serves the town. Grain is laid up in the store.
   - `[face]` Care for the sick comes from the parish. The town has no hospital, and the store holds grain.
3. `[visitor]` A stranger at {settlement} is shown the granary. No hospital is shown, and the sick are the parish's.
   - `[face]` A traveller at {settlement} finds a granary and no hospital. The sick go to the clergy.
   - `[face]` A newcomer is brought to the granary at {settlement}. No hospital receives the sick, and the nursing is the parish's.
   - `[face]` The granary is what a visitor is taken to at {settlement}. No hospital exists in the town, and the sick are the clergy's.

---

--- NOTES

## The card's clauses, as cited below

- **[R]** `reads` / `predicate` — `disasterRowSituation(granary, hospital, church)` selects the row
  `granary, parish care` of `DISASTER_ROW_POOL` (`defenseStateProse.js`).
- **[M]** `may claim` — that the reader selects that row, **as a STANDING fact of the record**.
- **[B]** `bag` — `{band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call
  sites: `{settlement}` only.
- **[N]** `may NOT` — a count, a cause, a season, a future, a standpoint, a second fact, another civic
  object of the class `temple`.
- **[S]** `source: (none)` · standing SOURCE-UNRESOLVED — no citation is licensed (arm A13).
- **[X]** REFUSED COLUMNS, always — a totality over persons; an exemption from a duty; a named
  character and that character's fate; a theological claim about a deity.

## The claim set every face carries

The row is ONE composite standing fact with three named limbs. Every one of the twelve wordings
asserts these three and nothing else, so the four faces of each variant are claim-equal to each other
and the three variants cohere in structural fact (C-sibling):

- **C1 — the town holds stored food (a granary).** Licensed by **[R]** (`granary` true in the selected
  row) under **[M]** (standing, never an event, never a season).
- **C2 — the tending of the sick is the parish's / the clergy's.** Licensed by **[R]** (`church` true;
  the row's own words "parish care") under **[M]**.
- **C3 — there is no hospital.** Licensed by **[R]** (`hospital` false in the selected row; the pool
  key's "only" is this limb). Written as the LACK class (a) of MOVE-GRAMMAR §1.2 row 11 / R-DA-08:
  flat, never the opener, never adjacent to another absence, and never completed by a "but"
  (R-DA-02).

## Per face

**Variant 1 `[ledger]` — order OBJECT → PRESENT → LACK; close: an absence; slot set `{settlement}`.**

| face | C1 licensed by | C2 licensed by | C3 licensed by |
|---|---|---|---|
| 1 (the numbered line) — "Grain is stored at {settlement}…" | [R] granary + [M]; {settlement} by [B] | [R] church + [M] | [R] hospital false + [M] |
| face 2 — "A granary stands at {settlement}…" | [R] granary + [M] | [R] church + [M] | [R] hospital false + [M] |
| face 3 — "Food sits in store at {settlement}…" | [R] granary + [M] | [R] church + [M] | [R] hospital false + [M] |
| face 4 — "The stores at {settlement} hold grain…" | [R] granary + [M] | [R] church + [M] | [R] hospital false + [M] |

**Variant 2 `[street]` — order PRESENT → LACK → OBJECT; close: the store (an object) or the granary;
slot set: EMPTY (the shipped variant carries no slot, so no face may introduce one — the annex's
face rule, ARCH §2.5).**

| face | C1 | C2 | C3 |
|---|---|---|---|
| 2 (the numbered line) — "The sick here are the clergy's work…" | [R] granary + [M] | [R] church + [M] | [R] hospital false + [M] |
| face 2 — "Nursing falls to the parish, and no hospital besides…" | [R] granary + [M] | [R] church + [M] | [R] hospital false + [M] |
| face 3 — "The clergy do the nursing…" | [R] granary + [M] | [R] church + [M] | [R] hospital false + [M] |
| face 4 — "Care for the sick comes from the parish…" | [R] granary + [M] | [R] church + [M] | [R] hospital false + [M] |

**Variant 3 `[visitor]` — order OBJECT → LACK → PRESENT; close: the parish or the clergy (a name /
office); slot set `{settlement}`.**

| face | C1 | C2 | C3 |
|---|---|---|---|
| 3 (the numbered line) — "A stranger at {settlement} is shown the granary…" | [R] granary + [M]; {settlement} by [B] | [R] church + [M] | [R] hospital false + [M] |
| face 2 — "A traveller at {settlement} finds a granary and no hospital…" | [R] granary + [M] | [R] church + [M] | [R] hospital false + [M] |
| face 3 — "A newcomer is brought to the granary at {settlement}…" | [R] granary + [M] | [R] church + [M] | [R] hospital false + [M] |
| face 4 — "The granary is what a visitor is taken to at {settlement}…" | [R] granary + [M] | [R] church + [M] | [R] hospital false + [M] |

## What each shipped variant claimed that the card does NOT license, and is therefore DROPPED

Dropping these is the rewrite's purpose; the shipped breach is the corpus's known state (Part B §21,
§22 — the slot survives, the wording leaves).

**Variant 1, shipped:** *"There is food stored at {settlement} and there are clergy who tend the sick:
reserves against hunger, and against disease something better than nothing and well short of a
hospital."*

- "reserves **against hunger**" — a purpose gloss on the granary, and a season/consequence the field
  does not hold. DROPPED under **[N]** (a cause, a season) and the MEANING non-move (MOVE-GRAMMAR
  §1.3).
- "**something better than nothing**" — an evaluative rating of the parish's care. DROPPED under
  **[N]** (a standpoint) and the VERDICT non-move.
- "**well short of** a hospital" — the same lack rendered as a comparison-as-judgment. The LACK
  itself (C3) is KEPT; the rating is DROPPED under **[N]** (a standpoint) and R-DA-11 (a comparison
  is a measurement in words).
- "**There is / there are**" — the expletive opener, struck under R-DA-07 (not a claim; a form fix).

**Variant 2, shipped:** *"The town can eat through a bad year. What it does about a plague is pray and
nurse, in that order."*

- "can eat through **a bad year**" — a forecast of what the reserves will carry the town through, over
  a season. DROPPED under **[N]** (a season, a future, a cause); the presence of the reserves (C1) is
  KEPT.
- "about **a plague**" — an event frame the standing row does not hold. DROPPED under **[N]** (a
  season, a second fact); the standing arrangement (C2) is KEPT.
- "**pray**" — an act of the clergy the reader does not type; the `church` flag licenses that the care
  of the sick is the parish's, not what the parish does besides. DROPPED under **[N]** (a second
  fact) and, at its edge, **[X]** (the deity doctrine's fence: faith is culture, never theology).
- "**in that order**" — a dry verdict on the arrangement. DROPPED under **[N]** (a standpoint) and
  R-DA-12 (the generalisation test).

**Variant 3, shipped:** *"A stranger finds a full store and a modest infirmary at {settlement}, and can
see which of the two the town has spent its thinking on."*

- "a **full** store" — a quantity claim. The reader carries a presence flag, not a level. DROPPED
  under **[N]** (a count); C1 is KEPT as presence.
- "a **modest** infirmary" — two breaches in three words: "modest" is an evaluative rating (**[N]**, a
  standpoint) and "infirmary" asserts a BUILDING the row does not hold (**[N]**, a second fact; the
  row holds parish care, not a second civic object). Both DROPPED; C2 is KEPT as the parish's
  tending, and the no-hospital limb the word "modest" was carrying is KEPT flat as C3.
- "**can see which of the two the town has spent its thinking on**" — a standpoint about the town's
  priorities, and a summarising second beat. DROPPED under **[N]** (a standpoint), the MEANING
  non-move, and R-DA-03 (the second-sentence summary → 0).

## Laws checked, with the reading taken

- **No citation anywhere.** **[S]** stands: SOURCE-UNRESOLVED, so no face names a record holder — no
  parish register, no roll, no books. "the parish" and "the clergy" appear only as the CARERS the row
  types, never as the keeper of a record (arm A13 would refuse the second).
- **The `[plain]` marker appears nowhere**; each variant carries exactly one bracketed angle tag, its
  own, unchanged.
- **Slot sets are preserved per variant**, faces included: variant 1 and variant 3 carry
  `{settlement}`, variant 2 carries none. No `{band}`, no `{route}` — the card's bag lists them but
  they are not FILLED at this block's call sites.
- **No face opens on `{settlement}`** (T-F8), and no variant opens on the settlement token at all
  (R-DA-17).
- **Three distinct level-1 orders, one per variant**, constant across that variant's four faces so the
  variant's grammar tag stays true of every wording: V-shape OBJECT→PRESENT→LACK (variant 1),
  PRESENT→LACK→OBJECT (variant 2), OBJECT→LACK→PRESENT (variant 3). A pool of three carries three
  distinct grammars (MOVE-GRAMMAR §2.1).
- **The ABSENCE walls hold**: C3 never opens a face, never sits beside a second absence, and is never
  completed by a "but", an "instead" or a "though" (wall 3; R-DA-02).
- **The close kind varies by variant**: an absence (variant 1), an object (variant 2), an office or
  body (variant 3). No face closes on a pronoun (R-DA-04's `pronounRate`).
- **Two sentences at most per face; one joint at most in a sentence**; no third sentence, no `, which`
  tail, no em dash, no exclamation, no digit, no question (R-DA-03, R-DA-07, B-DASH, B0.8).
- **No run of three** anywhere; the three limbs are never listed as a tricolon (R-DA-10).
- **THE THREAD**: in every face the second sentence either carries a noun forward from the first (the
  town, the store, the sick, the verb "shown" echoed in variant 3's numbered line) or is the one turn
  outward and sits last (variant 1 face 2; variant 2 face 3; variant 3 faces 2 and 3). Every face ends
  on a civic noun a modifier can pick up — hospital, town, granary, store, grain, parish, clergy — so
  the spine hands the thread forward wherever the composer seats a modifier.
- **A1 / A11 against the siblings**: the four sibling rows of `Disasters & Famine` (granary AND
  hospital · granary, NO medical provision · NO reserves, hospital present · NO reserves, NO medical
  provision) and this block's other four categories are neither restated nor contradicted. Their
  wordings are deliberately avoided: no "failed harvest", no "outbreak", no "sick-house", no
  "somewhere to put the sick", no "directed to neither", no "a place for grain and a place for the
  ill". First two words differ across the three variants (Grain is · The sick · A stranger) and across
  the twelve faces.
- **Density (§21.4)**: the compression is kept where it rewards — "the sick are the parish's", "and no
  hospital besides", "the sick pass into the parish's keeping". Nothing was made plainer without a law
  behind the change; every plainer word replaced a claim the card refuses.

## Judgment calls, recorded for the refuter to overturn

1. **"grain is stored" / "the granary holds food" reads the `granary` limb as reserves PRESENT, not as
   a level.** A granary flag that licensed only the building and not the food in it would make the row
   unsayable. Every quantity word ("full", "stocked") is nonetheless dropped, so nothing in the packet
   asserts how much. If the refuter reads the limb as building-only, faces 1, 3 and 4 of variant 1 and
   faces 2, 3 and 4 of variant 2 would need "a granary stands" throughout.
2. **"the sick" is written as a class inside an arrangement, never as a totality over persons**
   (**[X]**). No face says "everyone who falls ill", "all the sick" or "the only". The exclusivity the
   pool key carries ("only") is rendered as the flat LACK of a hospital, never as a quantifier over
   people.
3. **The `[visitor]` angle is taken as the card's own licensed angle, not as a standpoint.** A face
   states what a stranger is shown or finds — the standing arrangement met at the door — and never
   what the stranger concludes, prefers or feels. The shipped variant's "can see which of the two the
   town has spent its thinking on" is exactly the standpoint that is dropped.
4. **The no-hospital limb is kept in all three variants.** Variant 1 carried it explicitly ("well
   short of a hospital"); variant 2 carried it in its exclusive frame ("what it does about a plague
   IS pray and nurse"); variant 3 carried it in "modest". So no claim is added to any variant; the
   limb is re-rendered flat where the shipped wording carried it inside an evaluation.
5. **One civic object of the class `temple` at most.** The parish and the clergy are the row's own
   `church` limb; no face names a second temple-class object, and no face names a church BUILDING.

## Refusals

**None.** All three variants were made lawful under the card and the voice; no variant is banked, and
the banked count for this pool is zero. The variant count stands at three and the face count at four
per variant (twelve wordings), both only ever rising (§22).
