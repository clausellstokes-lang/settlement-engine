# COMPENDIUM-INSTITUTIONS — the Institutions page in full, keys behind a toggle (phase 2 of COMPENDIUM-HUB), 2026-11-10

Seat COMPENDIUM-HUB (phase 2), a child of the chair session `session_01FbPLbejcfwX5nii12VM673`. Lane
`lane/compendium-institutions-2026-11-10`, cut at **445390e90** (phase 1's accepted tip, whose record is
`COMPENDIUM-HUB-2026-11-10.md` beside this one).

**The owner's words (2026-11-10 02:4x UTC, verbatim):** "And apply your suggestions as wll" and "Abd the
institution page should show ALL institutions with their native power backing and services and flows into
other institutions. The search bar simply ends up as a filter."

## The census (measured first, sent to the chair before the build)

Over the 282 distinct catalogue institutions (the Institutions tab's own read and de-duplication):

| field | registry | holds a line for | when silent |
|---|---|---|---|
| Size | `institutionalCatalog.js` families — the one tier each name is placed at | 282 | — |
| Priority slider | the catalogue row's `priorityCategory` | 282 | no line |
| Backing | `institutionBacking.js :: backingRowFor` | 282 | — |
| Services | `institutionServices.js :: INSTITUTION_SERVICES`, exact name | 262 (265 names hold a table; Water source, Multiple water sources and Sewage system hold an empty one) | no line |
| Flows into (goods) | `supplyChainData.js :: SUPPLY_CHAIN_NEEDS` + `resourceChains.js :: RESOURCE_CHAINS`, the outputs of every chain listing the house among its processing institutions | 153 (157 names sit in a chain; four of those chains list no output) | no line |
| Flows into (other institutions) | — | **STOP** | not printed |

The first census figures I sent (services 265, flows 157) counted a table or a chain's presence. The pins
measure the printed lines (262, 153), and those are what is recorded here.

**STOP, default taken:** the chain registries hold `processingInstitutions` as an unordered set, so no
registry says which house feeds which. "Mill flows into Bakers" would be an invented edge. "Flows into"
therefore prints the chain outputs (goods) only, and the chair has this default.

## Each ruling → its commit and pins

| ruling | commit | what changed | pins |
|---|---|---|---|
| H7 | 7eb87e07a | `src/components/compendium/institutionFacts.js` (the registry reads, nothing authored); `InstitutionsTab` shows all 282 with no first-48 cut and no search cap ("282 institutions"). Each card adds Size, Priority slider, Backing (the powers named, largest share first, no figures), Services and Flows into; a silent registry prints no line. `contentVisibility: auto` per card. | `tests/ui/compendiumInstitutionsPage.test.jsx`, red-first (the page pin 1 failed / 4 passed on the base card), then 5/5 |
| H9 | 60ec65183 | ONE "Show keys" toggle (aria-pressed, off by default) on Operations and on Living World; the operation names, the variable, pressure and system keys, and the scope and receipt chips render only while it is on | `compendiumHubs` H9 pin (red-first: 2 failed / 5 passed), the Operations pin re-keyed BY IDENTITY |
| registers | 7eb87e07a, then the next commit | phone chrome floor /compendium 206 -> 207 (the fact line); `institutionLabelSeam`'s reasoned raw reads 4 -> 5 (the facts module's registry lookup key, never printed); lighting census files 3176 -> 3177, credited 2781 -> 2782, titles 28984 -> 28990, suiteTitles 7826 -> 7828 | the walkers green |
| H11 | — | **STOP sent to the chair, not built** | — |

**Words, from existing copy only:** "Backing", "Services" and "Flows into" are the owner's nouns, "Size" is
the configuration panel's word, and "Priority slider" comes from the page's own lead ("the matching priority
slider band"). Backing carries no percentages: `proseNumerics` refuses new prose figures and its ceilings are
never raised, and the owner's X-45 word was that a row naming which powers a house backs "is plenty enough".
A first draft printed "Base chance NN%" and shares as percentages; the ratchet named both, and they were
removed rather than the ceiling raised.

**Filter chips:** not added. The ruling allowed them only if they came free, and the one search box already
filters the page by string (H8).

**H11 STOP:** the desktop coach is the owner's fixed bottom-right corner card (2026-10-30, verbatim in
`PostGenCoach.jsx`: "a relatively small floating and movable pop-up … at the corner of the window"), pinned in
`tests/components/postGenCoach.test.jsx`. Below 1024 px it already sits in the page flow. Keeping it off the
dossier at 1440 means re-deciding the owner's placement. My default, if ruled: open folded as the existing
one-line pill. Alternatives: (b) the right gutter where it is at least 296 px; at 1440 the gutter is
(1440 − PAGE_MAX 1200) / 2 = 120 px, computed rather than measured on a render; (c) the in-flow dock at every
width.

## Measured

- **Render, phone profile** (iPhone 13 emulation, `vite --mode e2e`, warm module cache): all 282 cards are in
  the DOM 239 ms after the route push at CPU ×1, and 906 ms at CPU ×4 (1,317 ms before `contentVisibility`).
  A full scroll of the 80,501 px page shows two long frames (max 128 ms at ×1, about 0.55 s at ×4). For
  comparison, Operations' 160 cards: two long frames, max 109 / 231 ms. No horizontal scroll (390 = 390). No
  pagination was reached for.
- **Bundle:** CompendiumPanel's chunk goes 154,535 -> 156,596 B (all of phase 1 and 2). Every registry H7
  reads was already in `data-lazy`, which the base Compendium chunk already imports (`data-lazy`
  byte-identical, 1,501,168 B). No registry was newly pulled into the page's graph.
- **Boot:** `node scripts/boot-smoke.mjs` prints the same three stage lines as the base build (the chunk
  cycle seat BOOT-TIP owns) and no new one.

## What I saw

At 1440 the Institutions page shows five columns of cards, each with its tag, its description, then Size,
Priority slider, Backing, Services and Flows into, where held. At 390 it is one column, the same lines,
readable, no horizontal scroll. Operations and Living World at both widths open with "Show keys" off (no
keys: 0 key elements). Pressed, it shows 480 key elements on Operations and 46 on Living World, and pressing
it again hides them. The scope legend stays visible because it is pinned "always visible"
(`compendiumLivingCompletions`). I tried hiding it with the keys and reverted rather than move that pin.

## CONFIRMED against PLAUSIBLE

CONFIRMED by execution: the census figures as printed lines; the 282 cards and their line counts; the silent
case; the toggle's default and both states; the render figures above; no new boot-smoke line; no registry
newly pulled. PLAUSIBLE, not run: that the generated outputs (gm, fence, prose, witness, herald, PDF) are
unmoved, since no generator or display source changed. The WebKit e2e block was not run here either.

## The sweep at the phase-2 tip, read against the base

The sweep (`tests/lint tests/scripts tests/components tests/build` plus the compendium UI files) shows the
base's own reds unchanged: publicProseEquality, proseFamilyContract, newsHeadlineContract,
dossierPhoneFloorAllViews, readerValidationOnPage, domainAnyCastBaseline, provenanceMap and
ledgerCitationIntegrity (load), observedShapeReaders' four, and the dist reds of the base build (bootSmoke's
cycle, cultureProfilesLazy, generationWorkerLazy, vendorPdfLazy's two). It adds three lane-own findings:

1. **vendorPdfLazy, the goods migration roster:** `institutionFacts.js` imports the chain registries
   directly, so it needs its roster row. Cured: `src/domain/goods.schema.js` gains `R | l | chains | direct |
   src/components/compendium/institutionFacts.js` (the arm green).
2. **observedShapeReaders, the UNREVIEWED-UI cohort:** files 49 -> 50 and identities +2. The new facts module
   joined the src/components reader cohort. **STOP**, not cured: the instrument cannot run here (`schema 39 —
   expected 40`, the base's own governed migration is owed) and `--write` takes only a shrink. Default: move the
   reads into `src/domain/compendium/` (the exact-scan scope) once the migration lands, or bank the two
   identities by the governed door.
3. **brandDerivatives ARM B (a PHASE-1 red, found only now):** `scripts/ai-media-provenance.json` is a declared
   input of the brand derivation, and phase 1's c53d6175e moved it (the twelve tile rows), so the mint record's
   input digest no longer matches. The phase-1 sweep ran before that commit. **STOP, not cured:** the record
   was minted on darwin/arm64 (sharp 0.35.3 / vips 8.18.3), and `--record` re-derives and refuses on a byte
   mismatch, so a re-mint from this Linux container would either refuse or change the minting platform. The
   cure is `node scripts/derive-brand-marks.mjs --record` on the minting platform (the owner's Mac) at the
   merged tip; the art bytes do not move.

## What stays

- H11 waits on the chair's (or the owner's) ruling.
- Institution-to-institution flows wait on a registry that orders a chain.
- The 17 houses with no service table, and the three with an empty one, print no Services line until a
  registry holds them.
