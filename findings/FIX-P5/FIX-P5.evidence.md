# FIX-P5 — the measurements, taken before the first edit

Lane: Opus FIX-P5 (parallel). Chair: Fable 5.1, session a9df403c, 2026-09-20.
Worktree `$SP/lane-fix-p5`, branch `fix-floors-labels-2026-09-20`, cut at **63e40fe57**.
Base tree for every "before" number: `$SP/read-tip-63e40fe57` (the same commit, untouched).

Goldens, before the first edit and after the last — **IDENTICAL**:

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

---

## F7 — THE PAINTED SIGN IN SLIP: 12 px DOES NOT FIT. STOPPED, AS THE BRIEF ORDERS.

Measured with the shipped geometry (`src/components/nav/arrowGeometry.js`
`layoutArrow`/`padTarget`/`slipFont`) at the four phone widths, plain `node`:

| clientWidth | painted PLATE box | painted SLIP box | SLIP CONTENT box | type today | 44 px target |
|---|---|---|---|---|---|
| 320 | 71.61 x 19.17 | 40.04 x 10.15 | 32.04 x **8.15** | 10 px | 71.61 x 44 |
| **375** | **83.92 x 22.47** | **46.92 x 11.89** | **38.92 x 9.89** | **10 px** | **83.92 x 44** |
| 391 | 87.50 x 23.43 | 48.92 x 12.40 | 40.92 x 10.40 | 10 px | 87.50 x 44 |
| 430 | 96.23 x 25.76 | 53.80 x 13.64 | 45.80 x 11.64 | 10 px | 96.23 x 44 |

**The two measurements the brief asked for, at 375 px.** The plate's DOM box is
**83.92 x 22.47**. The slip the type is drawn inside is **46.92 x 11.89** outer, and its
CONTENT box — after its 1 px rule on each side and the 3 px of side padding `AccountMenu`
`slipStyle` sets — is **38.92 x 9.89**. `slipStyle` sets `lineHeight: 1`, so a 12 px face
needs **12 px** of height inside a box that is **9.89 px** tall. **12 > 9.89: it does not
fit**, by 2.11 px, and it fits at none of the four widths.

**So the item is STOPPED and nothing was shrunk or overlaid** — and it is already the
estate's recorded position, which the review did not have in view.
`tests/components/publicChromeFloor.census.test.js` carries an EXCEPTIONS register with
exactly one row, "the painted Sign In slip", citing §934.26, whose arm re-derives the claim
from the shipped geometry on every gate run in three directions: LIVE (the slip really is
sub-floor), FORCED (a 12 px line really does not fit), PAID (the control really is
83.92 x 44, over the 44 px floor in both directions). It also pins the crossover: 12 px
first fits at clientWidth 625, which is above every phone the row claims.

**For the OWNER (the painting is the owner's).** The only ways to a 12 px Sign In are to
re-cut the painting so the brass plate's slip is taller, or to accept 10 px on a 44 x 44
target. The lane built neither. No code changed for F7.

---

## F8 — THE FIFTH SEAT, MEASURED

REVIEW-P `walk4-phone.json` §G, Chromium 375x812 mobile UA, capture `02-landing-phone.png`:

| seat | scrollWidth | clientWidth | clipped |
|---|---|---|---|
| Create | 45 | 45 | no |
| Library | 49 | 49 | no |
| **Compendium** | **82** | **71** | **yes (`text-overflow: ellipsis`)** |
| Gallery | 53 | 53 | no |
| About | 42 | 42 | no |

The cause is arithmetic, not taste: `flex: 1` is `1 1 0%`, so five equal fifths of 375 is
75 px a seat and 71 px of content after the 2 px side padding App.jsx sets. **375 / 5 = 75 < 82**,
so no equal-share bar can hold that word at the 12 px floor at any padding. The words are
§934.26's and the floor is §934.24(4)'s; the SHARE is the only one of the three nobody
ordered, so the share gave: `flex: '1 1 auto'`.

After: 271 px of labels + 20 px of padding = **291 <= 375**, leaving 84 px of slack split
five ways (16.8 px a seat). Compendium's seat becomes ~102.8 px and About's — the narrowest —
~62.8 px, still over the 44 px touch floor.

---

## noticed 7 — THE 22 px HEADER AGAINST ITS 44 px BUTTONS

`ArrowHeader`'s `<header>` height is `HEADER_H`, which is the painted BAND's height, and
`padTarget` grows both painted plates to 44. Measured across the whole narrow band:

| clientWidth | band (the header box) | 44 px overhang | ARROW_HANG reserve | + main's phone pad (SP.md 13) | clear by |
|---|---|---|---|---|---|
| 280 | 16.78 | 27.22 | 27.14 | 40.14 | **12.92** |
| 320 | 19.17 | 24.83 | 31.01 | 44.01 | 19.18 |
| **375** | **22.47** | **21.53** | **36.34** | **49.34** | **27.81** |
| 430 | 25.76 | 18.24 | 41.67 | 54.67 | 36.43 |
| 1023 | 40.80 | 3.20 | 66.00 | 79.00 | 75.80 |

**The finding is a true box fact with no live consequence, and it is now measured rather
than assumed.** Both controls are absolutely positioned, so the overhang costs no layout;
it lands inside the arrow's own hang layer, which is `pointerEvents: 'none'` at z 35 under
the header's z 50; and `main`'s first content line sits `ARROW_HANG + SP.md` below the box,
which clears the control's last row by **at least 12.92 px at every narrow width**.

Growing the header to 44 was rejected and the reason is recorded in the new arm: `HEADER_H`
is the sticky offset the shell hangs from (the feather layer, the wizard toolbar, the
landing's hero pull-up), so growing it slides the painted feather down the page — re-cutting
the owner's painting to fix a hit target that is already paid for.

---

## F9 — /pricing's TYPE, BOTH FLOORS

Source census (`tests/components/phoneFloorCensus.shared.mjs`, run through the router
closure), base tree vs this branch:

```
BEFORE  /pricing  {"roots":1,"files":14,"floored":7,"ruled":3,"bare":10}
AFTER   /pricing  {"roots":1,"files":14,"floored":17,"ruled":3,"bare":0}
```

The ten bare sites, all at 11 px (`FS.xs`), and the floor each took:

| site | rendered | ladder |
|---|---|---|
| `PricingPage.jsx:316` | the redeem `role="status"` notice | prose |
| `PricingPage.jsx:511` | "Payments are not available in local mode." | prose |
| `PricingBands.jsx:59` | "AI - early access" (the Surveyor badge) | chrome |
| `PricingBands.jsx:137` | "Chairs held are counted in the Hall." | prose |
| `PricingBands.jsx:225` | "Dollar figures are estimates at the starter-pack rate" | prose |
| `PricingBands.jsx:267` | the ladder's four area headings | chrome |
| `PricingTierCards.jsx:107` | "Most popular" | chrome |
| `PricingTierCards.jsx:173` | the Founder seat line | prose |
| `PricingTierCards.jsx:287` | "17% off" | chrome |
| `PricingTierCards.jsx:294` | "25 credits" / "60 credits" / "150 credits" | chrome |

**And the half no instrument could see.** The shared scanner judges a literal only when it
reads below the 12 px CHROME floor, so the eleven `<p>` lines the review measured at exactly
12 px (`FS.sm`) were invisible to it in BOTH directions. Measured on the three pricing
files, **24 prose-shaped sites below the 14 px prose floor** (9 + 12 + 3) are now on
`proseFontSize`, and `proseFloorCensusOfSource` + a `PROSE_FLOOR_ROSTER` in
`publicChromeFloor.census.test.js` holds them there. The new arm is **opt-in by roster**, not
estate-wide: `App.jsx`, `HomeHero.jsx` and `generate/ClerkNote.jsx` carry five such lines
between them and belong to lane 28, so folding the higher floor into the existing roster
would have reddened three files this lane is not curing.

**/pricing is the ONLY route row this lane moves.** Every other row is byte-identical
between the untouched base tree and this branch (`routes.before.txt` vs `routes.final.txt`).

⚠ Pre-existing drift at the base, **not this lane's**, and green in the permitted direction:
`/create` bare measures 97 against a row of 98 (an owned row may only fall), and
`/settlements` files measures 208 against a floor of 206.

---

## F14 — THE TIER WORD: THE DECLARED REASON READ, AND WHAT IT ACTUALLY SAYS

The review reports `tierFacts.js:106` as declaring the split deliberate. Read at
`src/config/tierFacts.js:35-38` (the comment above `SIZE_LABEL`), it declares the OPPOSITE:

> "`thorp` READS AS 'Thorpe' (2026-09-19). The wizard's own size list has always said so
> (copy/en.js `generate.sizes.thorp`), and this table said 'Thorp' - two spellings of one
> rung, one of them on the refusal sentences lane 28 wired. The reader-facing label is the
> wizard's, so the two now agree; the TOKEN is untouched."

**So the declared distinction is real but it is TOKEN vs LABEL, never label vs label.** The
token `thorp` stays (it is an id in routes, saves, the ladder and every generator); the
reader's word is one word. The chair's rule applies with no exception.

Censused: **five tier-LABEL tables** in `src/`, in five different layers, found by shape
rather than by name (an object at least three of whose non-thorp rungs already spell that
rung exactly as `SIZE_LABEL` does). Three said "Thorp" and now say "Thorpe":
`src/components/new/design.js`, `src/pdf/lib/viewModel.js`,
`src/domain/display/humanizeEngineTokens.js`. Two already agreed: `src/config/tierFacts.js`,
`src/copy/en.js`. A sixth site derived the word by upper-casing the raw token —
`SummaryTabV2.jsx` printed "THORP" on the DM Summary — and now reads the table.

**Two surfaces are REGISTERED, not cured, and each names the authority it needs:**

1. **The Compendium tier entries.** `scripts/generate-compendium-data.mjs` writes
   `label: titleCase(id)`, which can only produce "Thorp", and the label is baked into
   `src/domain/compendium/generated/compendiumData.generated.js`, which
   `tests/docs/compendiumDataFreshness.test.js` pins **byte-identical**. Curing it is a
   generator edit plus a regenerated record — the brief's STOP.
2. **The gallery facet chips.** `textTransform: 'capitalize'` over raw tokens in
   `GallerySidebar`, `GalleryCard` and `GalleryDetail`. The same CSS capitalises every
   facet the gallery draws (terrain, status, tags), so re-pointing the tier at `SIZE_LABEL`
   is a decision about how the gallery names ALL its facets, not one word.

The register's compendium row is EXECUTED: it asserts the shipped artifact still says
"Thorp", so the day the handover lands the row REDS and must be deleted rather than
outliving its cause.

---

## noticed 5 — REFUTED BY THE SOURCE. NOT RE-WORDED.

The brief expects the exclamation in "a JSX text node or content JSON that `voiceMechanics`
does not scan". It is in neither.

- It lives in the COPY REGISTRY: `src/copy/en.js:496`, `realmGate.valueLines[1]`.
- `tests/copy/voiceMechanics.test.js` DOES scan it, and carries a named, count-pinned
  Tier-1 declared exception for it: `'en.realmGate.valueLines[1]'`, citing §934.26.
- `en.js:486-493` explains why it is declared there rather than in a component: a component
  literal would fall under the Tier-3 JSX ratchet, whose budget is ZERO and which has no
  allowlist at all.
- **ODQ §934.26 addendum (2026-09-19 09:1x, the chair):** "an owner's verbatim order
  outranks the estate's own voice law for that one string - the string stays as ordered...
  Vetoable: say the word and the exclamation becomes a full stop."

Re-wording it would overturn an owner's verbatim copy order and a recorded chair ruling.
**No edit.** If the owner wants the full stop, it is one character in `en.js` and one count
in the allowlist row.

---

## noticed 4 — THE DAGGER IS A CHECK, BY THE ESTATE'S OWN INSTRUMENT

`tests/design/contrast.test.js:133` already names this site "PricingPage decorative gold
marks (FeatureRow **check**, used as the sole glyph...)". So the estate calls it a check and
draws it with `†`, the reader's footnote mark, before every Wanderer and Cartographer
feature line on a page that carries no footnote. Cured as a glyph (`✓`), not as an invented
footnote.

⚠ `src/components/organic/samples/PricingSample.jsx` (the taste-approved pricing-desk sample
the row was cut from) still draws `†`. A sample is the RECORD of what was approved and
re-cutting it is a taste decision; the divergence is written at the shipped site and is the
chair's to close or to veto.

---

## noticed 6 — EVERY SITE MEASURED, THIRTEEN FOUND, THIRTEEN CURED

A source census of `src/components/new` for a shouted word in a JSX text node (four or more
capitals) found **13** after the review's three were cured, and none of them is an acronym:

`SummaryTab` ACTIVE CRISIS - `SummaryTabV2` HOOK - `SupplyChainsPanel` EXPORT x2 -
`npcComponents` ◆ EMERGENT - `HistoryTab` PARTY / EDIT / WORLD - `NPCsTab` {n} PINNED -
`RelationshipsTab` ◆ EMERGENT CONDITIONS ACTIVE - `ResourcesTab` UNEXPLOITED / PARTIAL /
✓ FULLY EXPLOITED.

All thirteen are kickers or badges, so all thirteen are now written words wearing
`textTransform: 'uppercase'` — the convention `dossierLabelCase.test.jsx` already pinned on
one rendered badge, now a fact about the whole tree. The census reads **0**.

The three-letter legend CODES (`REQ`, `YOU`, `WORLD` in OverviewTab's provenance legend,
`REQ`/`FORCED` in DefenseTab) are deliberately below the four-letter bar: each is glossed in
words on the same screen ("REQ = Historically required"), and sentence-casing a
three-character stamp buys a reader nothing. The judgment and its two failure directions are
written into the arm.
