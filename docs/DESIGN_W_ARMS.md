## COMPLETE — sections 0–9 written (three checkpoints; lane W-ARMS-DESIGN, 2026-09-01)

# DESIGN_W_ARMS — generative heraldry with kinship inheritance, sized to a leaf

Lane W-ARMS-DESIGN (Fable seat, architect, read-only) · 2026-09-01 · build line `claude/composite-r4` = `60255ca8e`
(every product claim below was read at that sha via `git show`/`git grep`; the ledger line is `review-fixes-2026-07-08`,
read only for ODQ/design texts). No vitest, no build, no git write was run by this lane. Labels: **CONFIRMED** = read at
`60255ca8e` (or quoted from the named ledger row); **PLAUSIBLE** = reasoning only, with the settling act named.

---

## 0 · THESIS

**W-ARMS is a DISPLAY-PLANE, DERIVED-NEVER-STORED projection of state the estate already keeps: a settlement's
name-seeded house emblem becomes the CHARGE of a coat of arms whose FIELD and ORDINARY are drawn from closed
vocabularies by the same FNV picker; a founding-line cadet bears its house's arms DIFFERENCED; a subordinate polity
QUARTERS its liege's arms — all re-derived on every render from `settlement.parentRef` and the `treaties` spatial
ledger, with no persisted field, no generation write, and no second RNG.** Two files, one on each side of the
design/domain wall: a pure SVG/structured-node builder in `src/design/organic/ornament/arms.js` (zero domain imports,
like every file in that directory today) and a pure kinship read-model in `src/domain/display/armsKinship.js`
(display reads domain, never the reverse — the `hegemonyRead.js` precedent). Web seam: the dossier header medallion
GROWS into the arms (one mark, not two). PDF seam: a text-free react-pdf primitive from the SAME node builder, so the
view-model golden is unmoved by construction. Campaign PDF / World Book (jsPDF): omitted.

**The owner's ratification (CONFIRMED, ODQ §728.1, 2026-08-29, verbatim):** *"'It all' is read as the whole review
INCLUDING the owner-gated generative-heraldry item (this directive is its ratification; it is sequenced last and stays
vetoable)."* The chartering line (CONFIRMED, `DESIGN_FMG_WEAVE.md` §3): *"W-ARMS (L, last, §728-ratified, vetoable):
generative heraldry with kinship inheritance (vassal quarters the liege's charge) over the relationship vocabularies
and the 8-emblem substrate; web/PDF seam honored; only the 104 pruned CC0 charges may be referenced."* Amendment 14:
*"W-ARMS owes determinism/dormancy/test-bill rows at its dispatch."* The chair's shape ruling (CONFIRMED, §879.11):
DISPLAY-PLANE, DERIVED-NEVER-STORED; a vassal QUARTERS the liege's charge read at render time from the
hegemony/lineage ledgers; renderer in `compose.js`'s idiom; web + PDF seams; bill = determinism pin · the §713.2 bit
claim · a DECLARED UI shift · four censuses if a domain leaf · imported from components/pdf only; slot = a short design
note + skeptic pass, then 2–3 Opus cars on their own gate after T13, before L9 iff the PDF seam moves
`goldenViewModel`.

**The veto (quoted so it is never lost):** §879.11 — *"⚠ OWNER: your one-word veto drops it; it sits beside the T13
REC on the desk."* Nothing in this note narrows that; every section below is what the chair holds (shape and slot),
never the capability.

**What this note changes against §879.11's sketch (each vetoable, each grounded below):**
1. The leaf is TWO files split by the layer wall, not one — §3.
2. The seed is `settlement.name` (the counterseal's seed), not `_seed` — §1.3; the alternative is owner row §9.1.
3. Tinctures are rendered as ENGRAVER'S HATCHING (Petra Sancta), not colour, because the ornament law's fixed ink
   palette forbids an open colour space — §1.1; owner row §9.3.
4. Kinship has TWO operations, both chartered under "kinship inheritance": lineage DIFFERENCING (cadency) and
   hegemony QUARTERING — §2.
5. The PDF seam does NOT move `goldenViewModel` — CONFIRMED by construction (§4.2) — so the landing slot is after
   L9, before the walk (§7).

---

## 1 · THE BLAZON MODEL

### 1.1 Closed vocabularies (the finite-semantics law: typed buckets, never free text)

Every value below is a member of a frozen array; the blazon is a small record over those arrays; nothing is a string
the AI or the user could author. (`'heraldry'` is an explicitly UNSUPPORTED custom-content field —
`tests/domain/customContentCompile.test.js:116`, CONFIRMED — and this note keeps it so: no custom-content door.)

| slot | vocabulary (closed) | size | rendering register |
|---|---|---|---|
| **field tincture** | metals `argent`, `or`; colours `gules`, `azure`, `sable`, `vert`, `purpure` | 7 | Petra Sancta hatching in the fixed ink: argent = plain; or = dotted; gules = vertical; azure = horizontal; sable = cross-hatch; vert = bend-wise; purpure = bend-sinister-wise |
| **ordinary** | `none`, `chief`, `fess`, `pale`, `bend`, `chevron` (+ `bordure` reserved for cadency, §2) | 6 | straight-line geometry only (integer coordinates in the 48-box) |
| **ordinary tincture** | a metal when the field is a colour, a colour when the field is a metal | derived | the rule of tincture, applied, never chosen |
| **charge** | the 8 house emblems by `name`: `tower · anvil · sheaf · wave · pick · chalice · coin · oak` (`EMBLEMS`, CONFIRMED `pools.js`) | 8 | the emblem's own `draw(p)` on the web; `EMBLEM_PATHS[name]` structured nodes on the PDF (CONFIRMED mirror, `emblemPaths.js`, walked by `tests/pdf/countersealStructuredPath.test.js`) |
| **charge ground** | when the field is a COLOUR the charge sits on a plain metal ROUNDEL (a "plate"); on a metal field it sits direct | derived | the rule of tincture keeps a stroke-drawn charge legible over hatching |
| **cadency mark** (§2) | `label`, `crescent`, `mullet`, `annulet` — hand-authored in the pools' stroke register | 4 | tiny marks in chief |
| **marshalling** (§2) | `sole`, `differenced`, `quartered`, `differenced_quartered` | 4 | the four-quarter layout |

**Why hatching and not colour (the constraint this note refuses to let bind silently).** `palette.js`
(CONFIRMED): *"freeform colour is what makes generated ornament read as glitch. So ornament draws from a tiny closed
set of ink tones … never an open colour space."* A heraldic palette of red/blue/green on the dossier's parchment and
ink-band would breach that law and read as a system foreign to the house hand. Engraved heraldry solved exactly this
problem four centuries ago with hatching, and the pools are explicitly *"house marks drawn for PURPOSE in an engraving
register"* — hatching IS that register. The estate's own "rule of tincture" reading (CONFIRMED `theme.js:1060`,
`tests/design/brandLockup.test.jsx:15`: *"a PALE METAL DEVICE on a MID-TONE BRONZE FACE"*) is already a metal-on-colour
rule stated in ink tones, not hues. Owner row §9.3 re-asks the palette constant rather than letting it bind.

**Two rendering registers from one blazon (the projection is not the truth):**
- **FULL** (≥ 40 px / ≥ 40 pt): hatched fields, ordinary, charge on ground, cadency, quarters.
- **SMALL** (< 40 px): no hatching; the field tincture collapses to a tone class of the fixed palette (metals → none/`faint`;
  colours → `line`), the charge direct, quarters collapse to the FIRST quarter plus a hairline "quartered" tick. The
  16 px `SettlementCard` medallion and the 14 pt PDF counterseal stay the bare emblem (they are not arms surfaces).
  The blazon record is identical under both registers; only the serializer differs. PLAUSIBLE that 38–44 px is the
  legibility floor for hatching at the header's `size: 38` — Car 1 renders the samples at 38/48/64 for the owner's
  glance (§9.5).

**Shield shape: a BANNER OF ARMS (rectangular 48×48, the emblems' native box).** Every hatch line and ordinary is then
an integer-coordinate straight segment clipped analytically to a rectangle — no curves, no `Math.sqrt`, no
transcendental anywhere (the determinism law and, if a domain leaf, the `transcendentalMathBaseline` zero allowance —
memory `a-new-domain-leaf-owes-four-censuses-not-one`, CONFIRMED). A curved escutcheon is owner row §9.2, a later car.

### 1.2 The blazon record (JSDoc-typed, frozen, the ONE truth both renderers project)

```js
/** @typedef {'argent'|'or'|'gules'|'azure'|'sable'|'vert'|'purpure'} Tincture */
/** @typedef {'none'|'chief'|'fess'|'pale'|'bend'|'chevron'} Ordinary */
/** @typedef {'tower'|'anvil'|'sheaf'|'wave'|'pick'|'chalice'|'coin'|'oak'} ChargeName */
/** @typedef {'label'|'crescent'|'mullet'|'annulet'} Cadency */
/** @typedef {{ field: Tincture, ordinary: Ordinary, ordinaryTincture: Tincture|null,
 *             charge: ChargeName, chargeOnPlate: boolean, cadency: Cadency|null }} Coat */
/** @typedef {{ marshalling: 'sole'|'differenced'|'quartered'|'differenced_quartered',
 *             own: Coat, liege: Coat|null, kinship: KinshipRead }} Arms */
```

`blazonText(arms)` → a sentence over the closed vocabulary ("Azure, a tower Or on a plate, a chief Argent; quarterly
with Gules, a sheaf Argent") — a template, never prose; owner row §9.6 decides where (if anywhere) it is shown.

### 1.3 Deterministic derivation — the existing picker, never a second RNG

`baseCoat(seed)` uses **exactly** the `seededPicker(seed)` idiom of `compose.js` (CONFIRMED: `fnv1a32` over
`${seed}::${slot}`, independent slots decorrelate): slots `'emblem'` (already the counterseal's slot), `'field'`,
`'ordinary'`, `'cadency'`. Because the charge slot IS the counterseal's slot, **the arms' charge equals the
settlement's existing mark on the web header, the Library card and the PDF cover** (CONFIRMED: all three seed
`emblem(...)`/`countersealEmblemName(...)` from `settlement.name`; `DossierHeaderRow.jsx:55`, `SettlementCard.jsx:144`,
`Cover.jsx:319`). One mark across ornaments extends bar 11's one mark across surfaces.

**The seed is `settlement.name || 'settlement'`** — the header's own expression (CONFIRMED). The alternative, the
replay seed `_seed` (CONFIRMED `settlement.schema.js:229`, "never mutate"), would make arms survive a rename but
would split the arms' charge from the counterseal's, and re-pointing the counterseal is a DECLARED shift of the
seeded-ornament golden family (`docs/samples/organic-craft/ornament/*.svg`, CONFIRMED byte-pinned by
`tests/design/organicOrnament.test.js`) and of the PDF cover. Owner row §9.1. Note the entropy-root census labels
`_seed` a WEAK, non-root control (CONFIRMED `entropyRootCensus.walker.test.js:599`), so either choice is outside that
census; `settlement.name` is not a world root at all.

No `Math.random`, no `Date`, no `localeCompare` (the `src/pdf` eslint block + `pdfEntropyGuard.test.js`, CONFIRMED,
allow FNV and forbid the entropy class); every list codepoint-sorted through `compareCodepoint` in the adapter.

### 1.4 World-state `kind` bias — the hook, the receipted input, and WHEN it enters

The pools carry the hook already (CONFIRMED docblock: *"Every emblem carries a `kind` so world state can bias
selection later (a mining town → the pick)"*; `emblemForKind(kind)` with a seeded fallback). The only receipted,
cross-surface-pinned "what is this town" input at hand is the SHARED_FIELDS canon fact `topExport.label`
(CONFIRMED `parityContract.js:85`, derived by `deriveTopExport(settlement)` from `economicState.primaryExports[0]`,
`dossierViewModel.js`), pinned canon === PDF by `viewModelParity.test.js`. A closed table goods-category → emblem
`kind` (mine/metal → `pick`, grain → `sheaf`, fish/salt → `wave`, crafts → `anvil`, luxury/coin → `coin`, timber →
`oak`, faith goods → `chalice`, else seeded) is the mechanism; it reads nothing that is not already a receipted
derivation, and it enters through **the ORDINARY** (a mining town's arms carry a `pale` — the pick's line — not a
different charge), so the charge stays the counterseal's mark.

**Ruled (vetoable): kind bias is NOT in Car 1.** Ground: the liege's quarter must be derived identically on the web
(full saves at hand — `allSavedSettlements`, CONFIRMED `OutputContainer.jsx`) and on the PDF (`campaign.settlements?`
/ `nameById?` are OPTIONAL props in the NameItem shape `{id, name}` — CONFIRMED `SettlementPDF.jsx` + `hegemony.js`
`buildNameById`), and a kind-biased ordinary for the liege needs the liege's `economicState` on both surfaces. Until
Car 0 measures what the exporter threads, kind bias would create a web/PDF drift in the liege quarter — a bar-11
violation. Car 3 admits it under a cross-surface parity pin (§7); owner row §9.4.

### 1.5 The 104 CC0 FMG charges — an OPTIONAL roster, deferred with reasons

CONFIRMED at `60255ca8e`: `public/map/charges/` holds exactly **104** files, **279,799 B**, every one declaring
`license="https://creativecommons.org/publicdomain/zero/1.0"` in its own `<metadata>` (pinned by
`tests/lint/shippedAssetLicence.test.js:311` "only CC0 charges may ship"; the 227 NC/SA charges were deleted
2026-08-24; `THIRD-PARTY-NOTICES.md:286` names the 104 positively: 72 by Azgaar, 30 Wikimedia Commons, 1 Wikipedia,
1 freesvg). The roster (CONFIRMED names): `anchor annulet armEmbowed… billet bowWithThreeArrows bridge2 carreau
cavalier centaur compassRose crescent cross×48 crosslet delf dragonfly drawingCompass earOfWheat flamberge
flangedMace fleurDeLis fusil goutte grapeBunch heart helmetZischagge laurelWreath2 lozenge×3 mace maces mascle
mullet×10 ouroboros pillar pique raft ribbon4 roundel×2 rustre scale×2 scythe2 shears skull×2 snail spiral squirrel
sun sunInSplendour trefle triangle×2`. They live on the map origin; a product renderer must COPY under CC0, never
fetch (the FMG fork's `fetchCharge` swallows a missing file silently — CONFIRMED in the walker's second half).

Why Car 1–3 use NONE of them, and what a later car owes:
- **Register mismatch (CONFIRMED sample `anchor.svg`):** `fill="#d7374a" stroke="#000" viewBox="50 50 200 200"`,
  `stroke-width=".5"` — filled, coloured, a different hand from the pools' 2-px round-capped stroke art. Mixing hands is
  the "icon-library glyphs at display level" tell the pools docblock names.
- **The licence walker walks `public/` only** (CONFIRMED `:64`): a charge copied into `src/` as path data escapes it,
  so a copy owes a NEW pin (copied `d` ⇔ source file byte-equal, the source's CC0 metadata re-asserted) plus an
  attribution file (`src/design/organic/ornament/CHARGES-CC0.md`: name, source URL, author, licence URL — CC0 needs
  no attribution, the estate's habit does) and a THIRD-PARTY-NOTICES row.
- **Bytes:** ~2.7 KB per charge average; a curated dozen (the cadency set `annulet crescent mullet fleurDeLis
  crossMoline` + `anchor earOfWheat bridge2 compassRose sun`) ≈ 30 KB raw into the dossier chunk and the PDF worker
  bundle, versus ~1 KB for four hand-authored cadency marks in the pools' register.
Owner row §9.8. The cadency marks Car 1 needs (`label crescent mullet annulet`) are drawn by hand in `pools.js`'s
idiom (a `CADENCY_MARKS` pool beside `EMBLEMS`, 4 entries, `draw(p)` + structured mirror) — and the CC0 files named
`annulet.svg`/`crescent.svg`/`mullet.svg` remain the OPTIONAL replacements if the owner prefers the historical hand.

---

## 2 · KINSHIP INHERITANCE

### 2.1 The two edges the estate already keeps (both CONFIRMED at the tip)

| edge | ledger | reader that owns the read today | heraldic operation |
|---|---|---|---|
| **lineage** (founding line) | `settlement.parentRef` — *"the immutable founding receipt"* (`settlement.schema.js:196` `SettlementParentRef`: `parentId`, `liveEdgeId`, `foundedTick`, `provenance`); written once by `lineageMemberBirth.js:166`; NEVER rewritten by a sale (`sovereigntyTransfer.js:31`) | `parentRefOf(item)` (`lineageClaim.js:124`, exported; honours `active:false`/`severed`/dead statuses) | **DIFFERENCING** — the cadet bears the HOUSE's arms with a mark of cadency |
| **subordination** (liege/vassal) | the `treaties` spatial ledger (`getSpatialLedger(worldState,'treaties')`, `spatialLedgerAccess.js:78`); a tie exists iff a treaty's `terms[]` carries a type in `SUBORDINATING_TERM_TYPES = ['tribute','compelled_alliance','puppet_seat','occupation_continuation']` (`hegemony.js:56`); WHO is liege comes from the ONE orientation reader `treatyOrientationOf(treaty)` → `{obligeeId = center, obligorId = sub}` (`treatyOrientation.js:120`, CR-WR10-G) | `hegemonyRead()` derives SPHERES (≥ `MIN_TIES: 3`), not pairs — a vassal with one liege is INVISIBLE to it, so the arms adapter reads the pair edge itself through the same three primitives | **QUARTERING** — the vassal quarters the liege's arms |

`sacredClaim.js` (`patronRefOf`, `faithStandingBetween`) and `settlementPolitics.js` (`leaderAlignmentKinship`) are
in the chartered vocabulary list but are NOT read by Cars 1–3: a patron-deity charge would edge toward "theological"
(DEITY DOCTRINE: faith = culture, never theological), and leader-alignment kinship is NPC-side. Recorded as deferred,
owner row §9.9.

### 2.2 The three derivations, with depth limits that make cycles impossible

```
baseCoat(seed)              = pick field/ordinary/charge/cadency from seededPicker(seed)      — every settlement
houseRoot(s)                = walk parentRefOf(...).parentId upward, ≤ MAX_DEPTH (8), visited-set; on cycle/depth/unknown → s itself
borneCoat(s)                = s is a cadet (houseRoot(s) ≠ s) ? baseCoat(root.seed) differenced by cadency(s.seed) : baseCoat(s.seed)
liegeOf(s, treaties)        = obligee of the standing subordinating treaty binding s; several → lowest SUBORDINATING_TERM_TYPES index of the dominant term, then codepoint-lowest obligeeId
arms(s)                     = liege ? QUARTERLY 1&4 borneCoat(s), 2&3 borneCoat(liege) : borneCoat(s)
```

- **Quartering depth is exactly ONE**: the liege's quarter is the liege's *borne* coat, never the liege's *quartered*
  arms — so no recursion, and a treaty cycle (A subordinate to B, B to A — impossible under one orientation reader, but
  the adapter does not rely on that) cannot loop. Reads per render: own record, root walk (≤ 8 hops, visited), one
  ledger scan, the liege's record and ITS root walk. Bounded and pure.
- **Differencing depth is exactly ONE mark**: a grandchild bears the ROOT house's coat with its own single mark (the
  house's arms are the founder's) rather than a double difference — simpler, and it keeps sibling cadets of one house
  visibly one house. Sibling collisions (two cadets drawing the same mark from 4) are accepted; owner row §9.9.
- **Strain does not alter arms.** A `strained`/`defaulted` compliance state is read by `hegemonyRead` for prose; the
  arms quarter while the treaty STANDS in the ledger. "State, never fate": the ledger's existence is the state; a
  defaulted tie that still stands is still a tie. Owner row §9.7 offers the alternative (drop the quarter on
  `defaulted`).
- **Steadings/satellites are PROPERTY, never parties** (CONFIRMED `hegemony.js:53`) — they have no dossier and no arms;
  `occupation_continuation` enters only through a treaty term, never through the occupation ledger (no new ledger read).

### 2.3 Why re-deriving on every render keeps THE PROMISE

Nothing is written: no `settlement.arms`, no `worldState` key, no chronicle entry, no event, no `spatialLedgers`
namespace. A seed's starting world is byte-identical with the leaf present or absent (the §713.2 bit claim, §5); lived
history is untouched because arms are a READ of history (the founding receipt, the standing treaty), never an entry in
it. When a treaty dissolves the quarter simply stops appearing — the `hegemony.js` posture verbatim: *"no lifecycle, no
death event, no persistence, no undo burden."* Regeneration, undo, restore, import and migration have nothing to carry:
the input records are theirs already (import remaps `parentRef.parentId` — `remapSettlementParentRefForImport`,
CONFIRMED — and the arms follow because they read the remapped value). The one lifecycle path the design MUST honour
is the rename path (the header is "the ONE place a settlement is renamed", CONFIRMED): under the `name` seed the arms
re-derive on rename exactly as the counterseal does today; that is the existing behaviour, not a new one (§9.1).

### 2.4 Typed fallback — never a throw on the render path

```js
/** @typedef {{ status: 'sole'|'cadet'|'vassal'|'cadet_vassal'|'unresolved',
 *             reason: null|'no_world'|'no_ledger'|'unknown_parent'|'unknown_liege'|'cycle'|'depth'|'self',
 *             rootSeed: string, liegeSeed: string|null }} KinshipRead */
```
Every branch returns a `KinshipRead`; `arms()` always returns an `Arms` (the borne coat when `unresolved`). Garbage
ledgers (`hegemony.js`'s INERT-NOT-CRASH posture) → `no_ledger`; a draft or non-campaign save (the dossier's
`owningWorldState` is `null` for those — CONFIRMED `OutputContainer.jsx:238`) → `no_world` → plain borne arms; a liege id
with no resolvable NAME on this surface → `unknown_liege` (the cross-surface hazard §8.3 names). The status is what the
optional blazon sentence and any tooltip read; nothing else branches on it.

---

## 3 · THE LEAF (placement, importers, walker, exports)

### 3.1 The decision: TWO files on the two sides of the layer wall

| file | layer | imports | exports (pure, JSDoc-typed) |
|---|---|---|---|
| `src/design/organic/ornament/arms.js` | design (token/builder leaf beside `compose.js`) | `./fnv.js`, `./palette.js`, `./pools.js` (+ a `CADENCY_MARKS` pool added there), `./emblemPaths.js` — **NO `src/domain` import** | `TINCTURES`, `ORDINARIES`, `CADENCY`, `baseCoat(seed)`, `differenceCoat(coat, cadency)`, `composeArms(own, liege)`, `armsNodes(arms, {mode,size,register})` → structured nodes, `armsSvg(arms, opts)` → string (= `svgWrap(nodesToMarkup(...))`), `blazonText(arms)` |
| `src/domain/display/armsKinship.js` | domain/display (beside `hegemonyRead.js`) | `../worldPulse/lineageClaim.js` (`parentRefOf`), `../worldPulse/hegemony.js` (`SUBORDINATING_TERM_TYPES`), `../worldPulse/treatyOrientation.js` (`treatyOrientationOf`), `../spatial/spatialLedgerAccess.js` (`getSpatialLedger`), `../deterministicSort.js` (`compareCodepoint`) | `kinshipRead({ settlement, worldState, settlements })` → `KinshipRead` (seeds resolved to NAMES through the NameItem shape `hegemony.js` already reads), `armsInputsFor(...)` → `{ seed, rootSeed, liegeSeed, status }` |

**Ground 1 — the engine-ceiling constraint decides the IMPORT DIRECTION, not the directory.** CONFIRMED
`vite.config.js:31` `computeEngineSharedDomain()`: the eager `engine-core` set is the transitive closure, WITHIN
`src/domain`, of every domain module ANY `src/generators` file imports; `ENGINE_SHARED_DOMAIN_EXCISIONS` is applied by
`.delete()` AFTER derivation (memory `a-new-domain-leaf-needs-its-own-esd-excision-row`: an excised importer's
dependencies still land eager). Two measured facts make both files safe: (a) generators import ZERO `domain/display`
files today (`git grep "domain/display" 60255ca8e -- src/generators` → 0, CONFIRMED), and no generator will import
`armsKinship.js`; (b) `src/design/**` is outside the walk entirely (it seeds from generators and walks `src/domain/`
only). The T13 first-paint closure sits at **1,047,205 B against a RAW ceiling of 1,047,000 — 205 B OVER, the owner's
open re-ask** (CONFIRMED §880.1) and the engine chunk is byte-identical across T13's builds (675,339 B): W-ARMS must
add ZERO bytes to first paint, and by import direction it does. The pin: a source-level test that neither file appears
in `EAGER_FIRST_PAINT_MODULES` (exported from `vite.config.js` and already consumed by
`tests/build/vendorPdfLazy.test.js` — CONFIRMED — so no build is needed for the pin) plus one build at Car 2 proving the
eager chunks (`kernel`, `engine-core`, `index`, `data`, `vendor-*`) are HASH-identical (the re-hash is the invisible
cost the memory names).

**Ground 2 — the layer wall decides the SPLIT.** `src/design` has ZERO imports from `src/domain` at the tip
(`git grep "/domain/" 60255ca8e -- src/design` → one comment mention only, CONFIRMED), and its files are
"token-def, lint-exempt" pure builders; a ledger-reading resolver does not belong there. Conversely the SVG builder must
not sit in `src/domain/display` because the PDF's structured-node serializer and the web string serializer are ornament
concerns (`emblemPaths.js` is the precedent: the structured half lives beside the string half). Display reads domain,
never the reverse — and design reads NEITHER: the leaf takes SCALARS (`seed`, `rootSeed`, `liegeSeed`, `status`).

**Ground 3 — the census bill favours this split.** The design file is outside every `src/domain` census
(`domainAnyCastBaseline` asserts `file.startsWith('src/domain/')`, CONFIRMED `:370`; `transcendentalMathBaseline` is
keyed on `src/domain` paths; `couplingInclusion` polices `worldPulse|spatial` only; `mechanismLitCoverage`'s
denominator is flat `src/domain/worldPulse/*.js` — CONFIRMED `:61`). The display adapter owes THREE of the four
(anyCast ZERO, transcendental ZERO, lighting) — `couplingInclusion` does not bind outside `worldPulse|spatial`
(memory, CONFIRMED). Had the whole leaf been one `src/domain/display/heraldry.js`, the hatch geometry would have been
typed under the zero-`any` allowance too; had it been one `src/design/.../arms.js`, it would have needed the first
design→domain import edge in the tree.

**Rejected alternatives (vetoable):** (i) ONE file at `src/domain/display/heraldry.js` — rejected on Ground 2/3;
(ii) ONE file at `src/design/organic/ornament/arms.js` importing `lineageClaim.js` — rejected on Ground 2 (first
design→domain edge); (iii) the adapter in `src/pdf/lib/` shared with components — rejected: components importing
`src/pdf` inverts the PDF's lazy contract (`vendorPdfLazy` contract 4, CONFIRMED); (iv) two adapters (web + PDF) —
rejected as a bar-11 fork that drifts.

### 3.2 Allowed importers (named) and the walker that pins placement

Allowed importers of `arms.js`: `src/components/dossier/DossierHeaderRow.jsx`, `src/components/organic/Ornament.jsx`
(a thin `<Arms/>` wrapper in its idiom), `src/pdf/primitives/HouseArmsBlock.jsx`, `scripts/gen-organic-ornament.mjs`,
tests. Allowed importers of `armsKinship.js`: `src/components/OutputContainer.jsx` (or the header row directly),
`src/pdf/sections/Cover.jsx` (or `src/pdf/lib/liveWorld.js` — see §4.2), tests. **Forbidden:** anything under
`src/generators/**`, `src/domain/worldPulse/**`, `src/store/**` (a store read would make it first-paint-reachable).

The placement walker: a new `describe` in an EXISTING scanner rather than a new file — `tests/build/domainGeneratorsBoundary.test.js`
already parses every `src/domain` import (CONFIRMED) and is the natural home for "no `src/generators`/`src/domain/worldPulse`
file imports `armsKinship.js` or `ornament/arms.js`", plus the `EAGER_FIRST_PAINT_MODULES` absence pin in
`tests/build/vendorPdfLazy.test.js`'s source-contract half. Zero new test files for the placement law.

### 3.3 Zero persisted fields, pure exports

No field on the settlement, the save, `worldState`, `campaign`, or the PDF view model. Every export is a pure function
of its arguments; `Object.freeze` on every vocabulary; JSDoc types for every parameter and return (the zero-`any`
allowance is a HARD ceiling for the display file — `Record<string, unknown>` for world states, named typedefs for
returns, per the memory's "type from the start"). No `**`, no `Math.*` beyond `Math.imul` (already in `fnv.js`) and
integer `Math.min/max/round` (not transcendental; `round` exists in `compose.js` today).


---

## 4 · THE RENDERERS

### 4.1 Web — the dossier header (and what is NOT a seam any more)

**The medallion GROWS into the arms; it is not joined by a second mark.** `DossierHeaderRow.jsx:55` (CONFIRMED)
renders `emblem(settlement.name || 'settlement', { mode: 'field', size: 38 })` into an `aria-hidden` span via
`dangerouslySetInnerHTML` — the exact idiom `arms.js` reuses: `armsSvg(arms, { mode: 'field', size: 48 })` in the same
span. The row gains two OPTIONAL props with `null` defaults — `worldState` and `settlements` — threaded from
`OutputContainer.jsx`, which ALREADY selects `owningWorldState` (`getCampaignForSettlement(saveId)?.worldState`,
`:238`) and `allSavedSettlements` (`:243`) for the chronicle seam (CONFIRMED). Absent props ⇒ `kinshipRead` returns
`no_world` ⇒ the borne coat ⇒ the existing `renameConsolidation.test.jsx` mounts of `DossierHeaderRow` (CONFIRMED,
settlement prop only) stay green by construction. A thin `<Arms seed … />` wrapper joins `Ornament.jsx` (`Emblem`,
`CompassRose` are the idiom, CONFIRMED).

**Not a seam:** the on-screen dossier foot colophon was REMOVED by owner order 2026-07-21 (CONFIRMED
`OutputContainer.jsx:1019` comment; `HouseColophon` is mounted only by `howto/AboutManifesto.jsx` at the tip, with no
seed). W-ARMS does not re-open it; the About colophon carries no settlement and therefore no arms. The brief's "house
colophon" seam is the PDF cover's `HouseCountersealSeal` (§4.2). `SettlementCard.jsx:144`'s 16 px medallion stays the
bare emblem (SMALL register, §1.1). `SettlementPalette`/`heraldRegister` (the map) are outside the charter's surfaces.

### 4.2 The dossier PDF (@react-pdf) — and whether `goldenViewModel` carries it

**It does NOT — CONFIRMED by construction, three ways.**
1. `tests/pdf/goldenViewModel.test.js` (CONFIRMED, 94 lines) snapshots `getByPath(canon, row.canonPath)` for every row
   of `SHARED_FIELDS` (20 rows in `parityContract.js`, the 17-line `.snap`); its render-leaf arm renders `Overview`
   only and asserts specific values reach text leaves. W-ARMS adds no `SHARED_FIELDS` row and touches neither
   `dossierViewModel.js` nor `Overview.jsx`.
2. `src/pdf/lib/viewModel.js` (917 lines, CONFIRMED) contains ZERO mentions of emblem/counterseal/seed/hegemony/
   treaty/parentRef/cover; the cover's counterseal reads `settlement.name` DIRECTLY in `Cover.jsx:319`, outside the
   view model. The arms block follows that precedent exactly: `HouseCountersealSeal.jsx`'s docblock (CONFIRMED):
   *"Decorative + text-free by construction (no <Text> ever — it adds nothing to the PDF's text leaves, so the
   goldenViewModel / collectText parity family is unmoved)."*
3. §879.12 (CONFIRMED) rules the VIEW-MODEL golden the paid-surface comparator because react-pdf bytes are
   non-deterministic (font-subset tags); a path-only primitive adds no text and no font object.

**Therefore the PDF seam may land after L9 (§7).** The one input the PDF path must carry is the kinship read's WORLD:
`SettlementPDF.jsx` (CONFIRMED) receives `campaign = { worldState, regionalGraph, settlements?, nameById? }` "threaded
ONLY for premium exports" (every export is premium — `TIER_GATE.free.export === false`, `anon.export === false`,
CONFIRMED `authSlice.js:48–49`) and passes it into `buildViewModel` → `buildPdfLiveWorld` (`liveWorld.js:118`), which
already reads the `treaties` ledger through `renderAllTreaties(worldState)` (`:255`) and resolves names through
`campaign.nameById` (worker-safe; a `nameFor` function would fail the structured clone — CONFIRMED docblock). Two
placements for the adapter call, ruled at Car 3 by measurement:
- **(a) inside `liveWorld.js`** as `liveWorld.arms = armsInputsFor(...)` — reuses its name resolver and its
  dormancy law (`null` slice ⇒ nothing renders), but the slice sits on `vm` — NOT in the snapshot (SHARED_FIELDS only),
  so still golden-inert; it does change `vm`'s SHAPE, which the observed-shape-readers census may see as new keys on a
  non-corpus record (PLAUSIBLE, settle by the Car 0 probe).
- **(b) beside the counterseal in `Cover.jsx`** — `armsInputsFor({ settlement, worldState: campaign?.worldState,
  settlements: campaign?.settlements })` at the call site, exactly as `HouseCountersealSeal seed={settlement.name}`
  is called. Chair's recommendation: **(b)** — smallest surface, no view-model shape change, one file.

`src/pdf/primitives/HouseArmsBlock.jsx` maps `armsNodes()` to `<Svg>/<Rect>/<Line>/<Path>/<Circle>` — the SAME node
list the web serializes, so there is no mirror table to walk (the improvement over `emblemPaths.js`, which exists
because `pools.js` draws strings). The charge inside the arms uses `EMBLEM_PATHS[name]` (already mirrored and walked).
The block renders on the cover beside the title block at 48–56 pt (owner row §9.5); the 14 pt counterseal stays.
`src/pdf` lint (CONFIRMED eslint block): no `localeCompare`, no entropy — the primitive has neither.

### 4.3 The campaign PDF and the World Book (jsPDF) — recommend OMIT

CONFIRMED: `generateCampaignPDF.js:15` and `generateWorldBook.js:24` import `jsPDF`; `package.json` carries `jspdf
^4.2.1` and `@react-pdf/renderer ^4.5.1` and NO `svg2pdf`/`canvg`; neither exporter reads emblems, ornament or SVG
today (zero grep hits). An arms block there would be hand-painted path ops (jsPDF `lines`/`path` — quadratic
segments converted to cubic, a new capability) or omitted. The glyph memory's law holds: in jsPDF an arms block "is
path data or omitted, never text glyphs" — and since these documents carry no house mark at all, adding one is scope
the charter's "web/PDF seam" does not name. **Omit; owner row §9.10 if wanted later.**

### 4.4 Foundry / journals — not a seam

CONFIRMED: `src/foundry/**` and `foundry-module/**` contain zero emblem/ornament/SVG references; `generateFoundryModule.js`
builds the same `vm` and emits journal pages from it. Because the arms are outside `vm` (§4.2 option b), Foundry is
untouched by construction. A journal arms image would be a base64 asset in the zip — a later, separate car if ever.

---

## 5 · DETERMINISM + DORMANCY

### 5.1 The byte-exact SVG pin (the existing golden family, extended — not a new one)

`scripts/gen-organic-ornament.mjs` (CONFIRMED: `ornamentSamples()` → `docs/samples/organic-craft/ornament/*.svg`;
`tests/design/organicOrnament.test.js` byte-pins every committed sample against a fresh render and requires every
emblem kind to be covered) gains `arms-*.svg` samples: the seven fields on one charge (tincture hatching legibility),
the six ordinaries, one differenced coat, one quartered coat, one differenced-and-quartered coat, at 48 and 64 px, light
and field modes — ~24 files, each a byte-stable owner taste-veto artifact, minted WITH a stated cause (the family's own
law: "component-library changes are DECLARED golden shifts"). Existing samples are untouched (the `EMBLEMS` pool is
not edited; `CADENCY_MARKS` is a new pool beside it — the "internally distinct pools" arm extends to it).

Unit pins (in the SAME test file, no new file): same input ⇒ identical string and identical node list; the web string
equals `nodesToMarkup(armsNodes(...))` (serializer parity — the ONE-source law); every hatch coordinate is an integer;
the rule of tincture holds for every `(field, ordinary)` pair (metal-on-colour or colour-on-metal, exhaustively over
7×6); `differenceCoat` is idempotent-free (a differenced coat is never differenced again); `composeArms` never
recurses (a quartered `liege` argument is refused with a typed reason).

### 5.2 The §713.2 bit claim — 525/525 + fence 21/21 at the landing tip, never argued

The leaf is generation-INERT by import direction (§3.1) but the law is explicit: NOT by construction — PROVEN
(§879.11's bill; the mint-window table row "R2 W-ARMS … NOT by construction — must be PROVEN (§713.2)", CONFIRMED). The
landing runs the standing dormancy comparator (base-dormant vs tip-dormant generation corpus, the 29-file/11.4 MB
comparison class, never an empty `out/`) and the espionage fence at the landing tip and quotes both counts. Expected:
525/525, 21/21, because no generator, worldPulse mover, store slice or schema byte moves. A single moved byte is a STOP.

### 5.3 The DECLARED UI shift record

Precedent (CONFIRMED §826/§879.11): VAR-3 landed as "a DECLARED UI shift; generation untouched". W-ARMS's record,
written in the landing's commit body and mirrored to the ODQ collection row: *"UI shift, DECLARED: the dossier header
medallion (38 px emblem) becomes the settlement's arms (48 px banner: field, ordinary, charge; differenced for cadets;
quartered for vassals); the PDF cover gains a text-free arms block beside the title; SettlementCard, the PDF
counterseal, About and the map are byte-identical; generation untouched (525/525, fence 21/21 at `<tip>`); view-model
golden unmoved (`goldenViewModel` .snap byte-identical); seeded-ornament golden family EXTENDED by N samples, none
re-recorded."* The ornament golden family is the only pin that moves, and it moves by ADDITION.

### 5.4 Flag or always-on — recommend ALWAYS-ON (vetoable)

Ground: the capability is owner-ratified; a UI flag would be a self-imposed constant that silently bounds the ambition
(the 08-27 law: such a constant is re-asked, never allowed to bind); a flag adds a lifecycle path (on/off) with nothing
behind it to persist; and the PDF half lands as its OWN car (§7) so the owner can veto the paid surface alone without a
flag. `mechanismLitCoverage` AXIS 2 counts `<x>Enabled` simulation-rules flags only (CONFIRMED) — a UI `flag()` would
not enter it, but it would still be a second switch to census somewhere. If the owner prefers to taste before the walk,
the samples in `docs/samples` are the taste surface, not a flag.

---

## 6 · THE BILL

| instrument | binds? | what W-ARMS owes | proof site |
|---|---|---|---|
| **four censuses (new `src/domain` leaf)** — `couplingInclusion` · `domainAnyCastBaseline` · `transcendentalMathBaseline` · lighting | `armsKinship.js`: **3 of 4** (coupling polices `worldPulse|spatial` only — CONFIRMED memory + the walker's LAYER_PATTERNS keys) | zero `any`/`*` tokens incl. JSDoc; zero transcendental sites, `**` counts; lighting refreeze WHOLE (five figures) for the new test file | `npx vitest run tests/lint` WHOLE at the car tip, then the reds re-run at the base sha in a detached tree (memory's law) |
| **`mechanismLitCoverage`** | **does not bind** — denominator is flat `src/domain/worldPulse/*.js` + `<x>Enabled` flags (CONFIRMED `:12,:61`) | nothing; a note in the car body so nobody re-derives it | — |
| **the SEVEN-member tree-scanner family** (memory `landing-a-src-adding-train-reds-six-tree-scanners`) | partially: `postureNameCollision`, `negativeAssertionAnchor` (new test file, ceiling 0 — anchor every negative on the comment block's last line), `wizardNewsAuthoring` line pins (only if a `src/` edit is NOT line-count-neutral in a file it pins — W-ARMS edits `pools.js` by APPENDING a pool, and `DossierHeaderRow.jsx`; verify neither is a pinned path), `kindPoolFloors` n/a, `couplingReceiptSample` n/a | run all seven at the car tip; none is reachable from a targeted run | the landing's whole-gate |
| **three-census bill per NEW TEST FILE** | ONE new test file: `tests/domain/display/armsKinship.test.js` (not an enforcer dir; basename carries no manifest token ⇒ lighting + anchor only, TWO not three) — every other pin EXTENDS an existing file (`organicOrnament.test.js`, `countersealStructuredPath.test.js`, `domainGeneratorsBoundary.test.js`, `vendorPdfLazy.test.js`) | lighting whole-refreeze; anchors | same commit as the file |
| **observed-shape-readers (OSR)** — reader-with-no-writer, per-identity ceiling 0 for a new file, growth NEVER bankable by `--write` (CONFIRMED §879.12) | **binds hardest.** `parentRef on settlement` IS a banked finding (CONFIRMED baseline rows `:911,:1295,:2172,:2179` — the corpus never graduates a steading) ⇒ a NEW direct read of `settlement.parentRef` anywhere in `src/` reds with no lawful bank. `obligeeId/obligorId/terms/complianceState/treaties/name on settlement/tier on settlement` are NOT banked (0 rows, CONFIRMED) ⇒ PLAUSIBLY clean. `topExport on` (2) and `terrain on` (5) ARE banked ⇒ kind bias must not read them directly (§1.4) | every kinship read routes through an EXISTING exported reader (`parentRefOf`, `treatyOrientationOf`, `getSpatialLedger`) and takes RESOLVED SCALARS; Car 0 runs `scripts/check-observed-shape-readers.mjs` on a scratch adapter BEFORE the car is written | Car 0 (rider), then the landing |
| **size rows** | first-paint closure RAW 1,047,000 (T13 at 1,047,205, the owner's re-ask — CONFIRMED §880.1): W-ARMS adds **0 B** by import direction; engine chunk 675,339 B: **hash-identical**; `max-lines`: `src/domain` 800 / `src/pdf` 800 / `src/components/**/*.jsx` 600 — trivially under; `src/design` has no `max-lines` layer rule (CONFIRMED eslint greps) and `sizeBaseline` is exact-set on OVER-ceiling files only | esbuild reasoning: `pools.js` charge paths already ship; arms adds hatch generator (~1.5 KB), vocab tables (~0.7 KB), two serializers (~1.5 KB), quartering/differencing (~1 KB) ≈ **4–5 KB raw / ~2 KB gz** into the LAZY dossier chunk AND (duplicated, by design — the worker is its own entry bundle, CONFIRMED vite comment `:86`) the `pdfRender.worker` bundle; the adapter's import of `lineageClaim.js` (605 lines; imports `constants.js`, `kernel/math.js`, `relationshipState.js`, `eventProse.js`) is the one cost to MEASURE — `liveWorld.js` already drags `treatyDocument.js`/`warStatus.js` into the worker, so PLAUSIBLY marginal | measure the minifier (the T13 worksheet's own law): `npx esbuild --bundle --minify` on a stub at Car 1; one full build at Car 2 with chunk-hash diff |
| **the chunk** | no `manualChunks` rule names `src/design/organic` or `src/components/dossier` (CONFIRMED) ⇒ Rollup co-locates with importers: the dossier chunk + the worker bundle; `armsKinship.js` is `src/domain/display` ⇒ not `engine-core` unless a generator reaches it (none does) | the `EAGER_FIRST_PAINT_MODULES` absence pin (source-level, no build) | `vendorPdfLazy.test.js` extension |
| **licence walker** | Cars 1–3 copy NO charges ⇒ the walker is untouched (CONFIRMED it walks `public/` only). A later CC0 car owes: an attribution file, a THIRD-PARTY-NOTICES row, and a new pin that each copied `d` equals its `public/map/charges/<name>.svg` source (the source's CC0 metadata re-asserted per copy) | — | Car 4 if minted |
| **`fnv1a32Identity` walker** (CONFIRMED: every local copy executed against the canonical) | the leaf IMPORTS `seededPicker` from `./fnv.js` — no new copy ⇒ untouched | — | — |
| **`entropyRootCensus`** | anchors on `rngSeed` reads (CONFIRMED); `settlement.name` is not a world root ⇒ untouched | — | — |
| **`pdfEntropyGuard` + the `src/pdf` eslint block** | no `Math.random`, no `localeCompare` in `HouseArmsBlock.jsx` | — | lint + the guard |
| **`domainGeneratorsBoundary`** (domain→generators edges, shrink-only) | `armsKinship.js` imports no generator ⇒ untouched; it HOSTS the placement `describe` (§3.2) | — | — |
| **`goldenViewModel` / `viewModelParity`** | unmoved by construction (§4.2) | quote the `.snap` byte-identity at the landing | — |
| **§713.2 bit claim + fence** | 525/525 · 21/21 at the tip | — | the landing |


---

## 7 · THE CAR PLAN — one zero-byte rider + three cars, own gate

**Slot (ruled, vetoable): its own gate AFTER T13, and AFTER L9 — before the walk.** Ground: the PDF seam does not
move `goldenViewModel` (§4.2, CONFIRMED by construction), so §879.11's "before L9 iff" clause does not fire; landing
after L9 keeps the GOLDEN freeze's corpus untouched by a display-only landing; landing BEFORE the walk is required
because the walk is the owner's taste surface and the arms must be seen there (the TAIL order: walk → ONE regen →
soak → tuning). If L9 slips past the walk, W-ARMS may land after T13 directly — the same proofs apply. Seat: Opus
builds (§724 re-split), Fable lands.

| car | product bytes | proof (executed, quoted) | STOP conditions |
|---|---|---|---|
| **Car 0 — MEASURE (rider, zero product bytes, read-only, may be this seat or Opus)** | none | (1) OSR probe: write the adapter's reads on a scratch copy in a detached worktree, run `scripts/check-observed-shape-readers.mjs`, quote the identity delta; (2) `EAGER_FIRST_PAINT_MODULES` at tip (import from `vite.config.js`, no build) — quote its size and that no ornament file is in it; (3) the exporter call sites' `campaign` payload — what `settlements`/`nameById` carry for the PDF path (grep every `<SettlementPDF`/`generateSettlementPDF` caller); (4) `npx esbuild --bundle --minify` of a 40-line stub of `arms.js` — quote bytes; (5) whether `wizardNewsAuthoring` pins any line in `pools.js`/`DossierHeaderRow.jsx`/`Cover.jsx` | any kinship read whose OSR identity is banked and has NO existing exported reader to route through ⇒ STOP to the chair (a chartered one-line reader export is a `src/domain` edit with its own bill — chair-gated, never lane-minted); the PDF path carrying ids only (no names) ⇒ Car 3 gains a `nameById` threading obligation, recorded before Car 1 starts |
| **Car 1 — THE LEAF + PINS** | `src/design/organic/ornament/arms.js` (new); `pools.js` +`CADENCY_MARKS` (append-only, 4 entries) + `emblemPaths.js` +`CADENCY_PATHS` mirror; `scripts/gen-organic-ornament.mjs` +arms samples; `docs/samples/organic-craft/ornament/arms-*.svg` (~24 new); `tests/design/organicOrnament.test.js` EXTENDED (no new file) | samples byte-stable (fresh render === committed); serializer parity (string === markup of nodes); rule-of-tincture exhaustive over 7×6; integer-geometry assertion over every emitted coordinate; `EMBLEMS` samples byte-IDENTICAL to base (the existing family unmoved — quote `git diff --stat docs/samples` = additions only); the mirror walker extended to `CADENCY_MARKS` ⇔ `CADENCY_PATHS`; lint + typecheck | any existing sample byte moves ⇒ STOP (a library change, not an addition); any import from `src/domain` in `arms.js` ⇒ STOP (the wall); any non-integer coordinate or `Math.*` beyond `imul/min/max/round` ⇒ STOP |
| **Car 2 — THE ADAPTER + THE WEB SEAM** | `src/domain/display/armsKinship.js` (new); `tests/domain/display/armsKinship.test.js` (new — the ONE new test file); `Ornament.jsx` +`<Arms/>`; `DossierHeaderRow.jsx` (medallion → arms, two optional props); `OutputContainer.jsx` threads `owningWorldState` + `allSavedSettlements`; placement `describe`s in `domainGeneratorsBoundary.test.js` + `vendorPdfLazy.test.js`; lighting census refrozen WHOLE + anchors; the DECLARED UI shift record | `tests/lint` WHOLE green at tip with the reds re-run at base; OSR exit 0 with the baseline UNTOUCHED (growth is unbankable); `renameConsolidation.test.jsx` green unchanged; a jsdom pin: header renders a `<svg class="oc-ornament-svg">` containing the counterseal's charge path `d` for the same name (one mark); kinship pins: sole / cadet (root walk) / vassal (one tie) / cadet-vassal / multiple lieges (type-index then codepoint) / cycle / depth / severed parentRef / garbage ledger — every branch a typed `KinshipRead`, never a throw; **one full build**: eager chunks hash-identical, first-paint closure byte-identical (quote both), dossier chunk delta quoted | OSR red ⇒ STOP (no bank exists); first-paint closure moves by ≥ 1 B ⇒ STOP; any eager chunk re-hashes ⇒ STOP; `couplingInclusion` reds (would mean the file was placed under `worldPulse|spatial` — it must not be) |
| **Car 3 — THE PDF SEAM** | `src/pdf/primitives/HouseArmsBlock.jsx` (new); `Cover.jsx` (arms block beside the title; counterseal kept; `armsInputsFor` at the call site — option (b) §4.2); `tests/pdf/countersealStructuredPath.test.js` EXTENDED with the arms render-tree arm (no text leaves; node geometry === `armsNodes()`); optionally the blazon sentence if §9.6 says yes | `goldenViewModel` `.snap` byte-identical (quote); `viewModelParity` green; `pdfEntropyGuard` + `src/pdf` lint green; cross-surface parity pin: for one fixture campaign (a liege with two vassals, one a cadet), the web adapter's `armsInputsFor` output === the PDF path's output (same names, same status) — the §8.3 obligation; the whole `tests/pdf/` dir at tip (42 files today, CONFIRMED §879.7) | any `<Text>` leaf added to a section `goldenViewModel`'s render-leaf arm reads (Overview) ⇒ STOP; the PDF path unable to resolve the liege's NAME ⇒ STOP until `nameById` is threaded (never fall back to `String(id)` as a seed — that would mint a different coat on the paid surface) |
| **Car 4 — the CC0 roster (OPTIONAL, owner-gated by taste §9.8)** | copied charges as path data + `CHARGES-CC0.md` + notices row + the copy-fidelity pin | walker + pin + samples | not in this landing |

Landing sequence (the one-gate law): Cars 1–3 rebased onto the landing base, the lighting census re-derived ONCE
covering the one new test file, OSR `--write` NOT run (the baseline must not move), the §713.2 comparator + fence at
the tip, the size/hash build, the whole gate, the UI-shift record in the commit body, the collection row. Cars 1 and 2
may collapse into one landing car if Car 0's OSR probe is clean; Car 3 stays separate so the paid surface is vetoable
alone.

---

## 8 · REFUTATION — five lenses, what survived

**8.1 THE PROMISE (a seed is a starting world forever; lived history immutable).**
Attack: "arms are a new fact about the world; storing them somewhere is inevitable (a cache, a save field, a
snapshot)." Defence: every render recomputes from two records the world already keeps; no writer exists, and the
placement walker forbids the importers that could write (`src/store`, `worldPulse`). Attack: "a rename re-arms the
settlement — that is history changing under the reader." Defence: the counterseal already re-seeds on rename
(CONFIRMED: three surfaces seed from `settlement.name`); the arms inherit an existing, shipped behaviour, and §9.1
offers `_seed` if the owner wants rename-stability — at the cost of a declared golden-family shift. **Survives.**

**8.2 The engine ceiling (205 B over, the owner's re-ask; the invisible re-hash).**
Attack: "importing `lineageClaim.js` (→ `eventProse.js`, prose pools) into the dossier chunk and the worker bundle is
not free, and the memory says the chunk RE-HASH is the bigger cost." Defence: neither file is reachable from
`src/generators` (0 edges today, pinned), so `engine-core`/`kernel`/`index`/`data` cannot change by construction; the
LAZY dossier chunk and the worker bundle are where the bytes land, and both are outside every eager budget. What does
NOT survive unmeasured: the adapter's import cost — Car 0 (4) and Car 2's build quote it; if `lineageClaim.js` proves
heavy, the lawful alternative is NOT a new direct `parentRef` read (OSR-banked) but a chair-chartered reader export on
the file that already owns the identity — a STOP, named. **Survives with one measured obligation.**

**8.3 Determinism — and the sharpest attack, which is cross-surface, not per-surface.**
Attack: "same seed ⇒ same SVG is easy per surface; but the LIEGE quarter depends on the liege's NAME, which the PDF
path only has if the exporter threads `campaign.settlements`/`nameById` — both OPTIONAL today (CONFIRMED
`SettlementPDF.jsx`; `liveWorld.js` falls back to `String(id)`). A web dossier showing quartered arms and a paid PDF of
the same settlement showing un-quartered (or DIFFERENTLY-seeded) arms is a bar-11 drift on the paid surface — worse
than no arms." Defence: the adapter never seeds from an id; an unresolvable name is a typed `unknown_liege` ⇒ the borne
coat; the Car 3 STOP forbids landing until the PDF path resolves names, and the cross-surface parity pin makes the
obligation executable. **This is the top refutation that survived: it did not defeat the design, it CHARTERED Car 3's
name-threading obligation and its parity pin.** Also attacked and held: treaty-ledger key order (codepoint-sorted),
several lieges (type index then codepoint), non-BMP names (`charCodeAt` over UTF-16 units is deterministic), the
hatching (integer geometry, no `sqrt`), and react-pdf's byte non-determinism (irrelevant: no text, no font object).

**8.4 The paid surface.**
Attack: "any rendered block changes paid bytes; §879.12 found the dossier cannot be byte-golden; the two renderers have
two glyph failure modes." Defence: the block is path-only (no glyphs, so neither failure mode applies); the paid-surface
comparator is the VIEW-MODEL golden and it is unmoved by construction (§4.2); the campaign PDF and World Book are
untouched; the PDF half is its own car with its own veto; the entropy guard and the `src/pdf` lint block bind it.
**Survives.**

**8.5 Scope creep.**
Attack: "the charter says 'vassal quarters the liege's charge'; this note adds cadency, ordinaries, hatching, a
blazon grammar, a root walk." Defence: "kinship inheritance" in the charter's own vocabulary IS the lineage bond
(`lineageClaim.js`: "kinship bond"), and differencing is how heraldry expresses it; every vocabulary is closed and
small (7·6·8·4, the CK3 constrained-combinatorics lesson the pools cite); the root walk is bounded and typed; kind bias
is deferred (§1.4), the CC0 roster is deferred (§1.5), sacred/politics vocabularies are deferred (§2.1), the campaign
PDF/World Book/Foundry are omitted (§4.3–4.4), and the on-screen colophon stays removed (§4.1). What was CUT by this
lens: an early draft's "arms of the sphere" (a hegemon's centre bearing an augmentation) — it would read
`hegemonyRead()` and `MIN_TIES`, a third input; dropped. **Survives, bounded.**

---

## 9 · OPEN QUESTIONS FOR THE OWNER (taste rows — the chair's recommendation first, each vetoable)

1. **Seed root.** REC `settlement.name` (one mark with the counterseal; re-arms on rename, as today). ALT `_seed`
   (rename-stable; the counterseal is re-pointed — a declared shift of the ornament golden family and the PDF cover).
2. **Shield.** REC a rectangular BANNER OF ARMS (integer geometry, PDF-portable). ALT a heater/escutcheon with curves,
   a later car.
3. **Tinctures.** REC engraver's HATCHING in the fixed ink palette (the ornament law §5 constant honoured). ALT colour
   tinctures — re-asks the fixed-palette constant itself; the chair does not recommend it but names it so the constant
   never binds silently.
4. **Kind bias.** REC through the ORDINARY (a mining town's pale), the charge stays the counterseal's mark; enters at
   Car 3 under the parity pin. ALT the charge itself by kind (the counterseal follows — a golden-family shift). ALT
   none.
5. **Sizes and placement.** REC header 48 px; PDF cover 48–56 pt beside the title (Power chapter head as ALT); the
   samples at 38/48/64 are the glance test.
6. **The blazon sentence** ("Azure, a tower Or on a plate, a chief Argent; quarterly …") — REC a visually-hidden
   caption on the web (the LEGIBILITY rung "sentence"); PDF text only if wanted (adds Latin-only text leaves).
7. **Defaulted subordination.** REC quarter while the treaty stands. ALT drop the quarter on `defaulted`.
8. **The CC0 roster.** REC defer (register mismatch, walker gap, bytes); if wanted, a curated dozen with the
   attribution file.
9. **Sibling cadency collisions and the sacred/politics vocabularies.** REC accept collisions; defer a birth-order
   mark (`foundedTick`) and any deity-derived charge.
10. **Campaign PDF / World Book arms.** REC omit. ALT a path-op painter, its own car.
11. **The on-screen dossier foot colophon** stays REMOVED (your 2026-07-21 order); the arms do not re-open it.

---

*Read-only lane; this file is its only write. Every CONFIRMED row carries a `git show`/`git grep` at `60255ca8e` or a
quoted ledger row in this lane's transcript; PLAUSIBLE rows name their settling act (Car 0 items 1–5, Car 2's build).*
