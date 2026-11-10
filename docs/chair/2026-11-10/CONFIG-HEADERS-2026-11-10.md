# CONFIG-HEADERS: the configuration's headers stand on house plates (2026-11-10)

**Seat:** CONFIG-HEADERS, a child of the chair session `session_01FbPLbejcfwX5nii12VM673` (this seat: `session_01FbPLbdgVNYmnmDH1xzSKMB`).
**Base:** `ecadf531a` (`lane/integration-2026-11-07` tip, confirmed by `git rev-parse HEAD`).
**Branch:** `lane/config-headers-2026-11-10`.

**The owner's words (2026-11-10, verbatim):** "Next thing. The section headers for the configuration before generating a settlement are hard to read."

**STATUS:** every header, subtitle, lead and small label of the Create page before generation now stands on a house surface (CARD, CARD_HDR) and reads at least **4.59:1** against what is painted behind it, at 1440x900 and iPhone 13, Basic and Advanced, the chooser and the anonymous landing. Before, the subtitles read **1.03 to 2.33:1** on the painting. Not a word of copy changes, no control moves except into its band, and no new colour or size is used.

## 1. The chair's measure, and mine

The chair measured the configuration's section headers as bare text on `.page-bg.is-flow`: the painting under a cream veil of 0.49 to 0.56. The subtitles read 1.05 to 2.01, the kicker 1.35 to 2.59, the lead 3.1 to 5.9, and MUTED on the cards 3.25 to 3.57. The five section titles were at three sizes and two weights.

My probe (`docs/chair/2026-11-10/config-headers/probe.cjs`) works per element:
1. It scrolls the element to the middle of the viewport. The painting is `position: fixed`, so a full-page capture shows plain parchment where the reader sees trees. My first pass read wrongly for this reason and was thrown away.
2. It repaints the page with every glyph transparent.
3. It clip-captures the text's box and reports the contrast against the 5th and the 95th luminance percentile behind the box.

It reproduces the chair's figures, and on the phone it finds the same defect, which the full-page pass had hidden.

## 2. Rulings → commits → pins

| ruling | commit | what | pin |
|---|---|---|---|
| H1, H3 plates | `50800f59b` | The opening PageHeader sits on a CARD plate with the BORDER hairline. The empty-state PageHeader gets the same plate. "Founding Worlds" and its lead sit in a CARD_HDR band. CARD and not PARCH: the kicker's GOLD_DEEP reads 4.59 on CARD and would read 4.3 on PARCH. `PageHeader` itself is shared and untouched. | `tests/components/createHeadersOnPlates.test.jsx` |
| H2, H3 bands | `e6049ca38` | **1 · Foundations:** a CARD_HDR band in the ConfigurationPanel card's own border (BORDER2), with no bottom edge, so the card's top border is the one divider. **2 · Institutions, services & trade:** a CARD_HDR band in the disclosures' BORDER. The three disclosures stack flush under it with a −1 overlap, so no seam doubles, and Clear all stays in the band. **Exact seed:** a card with its own band. There is no card-in-card. | the same pin |
| H4 sizes | `684cc86fc` | Exact seed, Character, 1 · Foundations, 2 · Institutions… and Place in Region are all FS.xl (17), serif, 700, INK. | the probe's size column |
| H5 inks | `95cd09030` | MUTED becomes BODY at FS.sm for: the three header subtitles, the Clear-all status line, the Character hint and its group labels, READY TO GENERATE, "Current draft seed", and the Disclosure's collapsed hint. The Disclosure `hint` prop has exactly two callers, ConfigurationPanel's Fine-tune and the three deep sections, both on this page, so no other page moves. | the probe's table |
| H8 pin, registers, record | `c43f2a88a` (pin), `632f598bb` (lighting census), then the record and the roster bump | the pin, the probe, the screenshots and this record | `createHeadersOnPlates.test.jsx` |

**The pin.** It renders the real GenerateWizard (Advanced, desktop: the widest tree) with the real LayeredConfigurationPanel, ConfigurationPanel, CharacterPresetCard, PlaceInRegionCard and WizardCloseout, and separately the real FoundingWorlds.
- **The rule:** every non-blank text node must have an ancestor, inside the surface under test, painted with a house surface (CARD, CARD_HDR, PARCH, CARD_ALT, or the Character card's parchment swatch).
- **What else counts as a surface:** a `.sf-btn` whose variant fill is not transparent (a ghost button does not count), and the house `.sf-readable-strip`.
- **Anchors:** the walk must visit the twelve named headers and subtitles and at least 60 text nodes.
- **Red on the base:** run in a base worktree at `ecadf531a`, the pin fails on exactly the chair's list: Forge a settlement, Create a settlement, the lead, Exact seed with its subtitle, 1 · Foundations with its subtitle, 2 · Institutions… with its subtitle, "nothing forced or forbidden yet", and Founding Worlds with its lead.
- **Green on this tip.**

## 3. Contrast, before and after (the probe; ratio = against the 5th–95th luminance behind the text)

| viewport | state | text | before: ink, size/weight | before ratio | after: ink, size/weight | after ratio |
|---|---|---|---|---|---|---|
| desktop | anon-landing | Founding Worlds | rgb(27,20,8) 15/900 | 8.08–11.54 | rgb(27,20,8) 15/900 | **16.67** |
| desktop | anon-landing | Start somewhere already alive. Fork one  | rgb(74,59,34) 12/400 | 5.10–7.32 | rgb(74,59,34) 12/400 | **9.88** |
| desktop | chooser | Character + foundations. The rest is rol | rgb(156,128,104) 12/400 | 3.57 | rgb(156,128,104) 12/400 | **3.57** |
| desktop | chooser | Founding Worlds | rgb(27,20,8) 15/900 | 8.08–11.54 | rgb(27,20,8) 15/900 | **16.67** |
| desktop | chooser | Start somewhere already alive. Fork one  | rgb(74,59,34) 12/400 | 5.10–7.32 | rgb(74,59,34) 12/400 | **9.88** |
| desktop | chooser | Want full control? | rgb(27,20,8) 17/600 | 15.66–15.80 | rgb(27,20,8) 17/600 | **15.66–15.80** |
| desktop | basic | Forge a settlement | rgb(140,111,50) 11/800 | 1.79–3.68 | rgb(140,111,50) 11/800 | **4.59** |
| desktop | basic | Create a settlement | rgb(27,20,8) 22/700 | 5.35–13.81 | rgb(27,20,8) 22/700 | **17.71** |
| desktop | basic | Pick a character and set the foundations | rgb(74,59,34) 15/400 | 3.42–6.91 | rgb(74,59,34) 15/400 | **10.50** |
| desktop | basic | Character | rgb(27,20,8) 15/700 | 16.12 | rgb(27,20,8) 17/700 | **16.12** |
| desktop | basic | Pick a settlement archetype to shape it in one tap | rgb(156,128,104) 11/400 | 3.25 | rgb(74,59,34) 12/400 | **9.56** |
| desktop | basic | Neutral | rgb(156,128,104) 10/700 | 3.25 | rgb(74,59,34) 12/700 | **9.56** |
| desktop | basic | Civic | rgb(156,128,104) 10/700 | 3.25 | rgb(74,59,34) 12/700 | **9.56** |
| desktop | basic | 1 · Foundations | rgba(0,0,0,0) 17/700 | 6.25–12.18 | rgb(27,20,8) 17/700 | **16.67** |
| desktop | basic | size, route, culture: the essentials | rgb(156,128,104) 11/400 | 1.24–2.31 | rgb(74,59,34) 12/400 | **9.88** |
| desktop | advanced | Forge a settlement | rgb(140,111,50) 11/800 | 2.81–3.60 | rgb(140,111,50) 11/800 | **4.59** |
| desktop | advanced | Create a settlement | rgb(27,20,8) 22/700 | 6.58–14.10 | rgb(27,20,8) 22/700 | **17.71** |
| desktop | advanced | Pick a character and the foundations. Op | rgb(74,59,34) 15/400 | 4.04–6.65 | rgb(74,59,34) 15/400 | **10.50** |
| desktop | advanced | Exact seed | rgb(27,20,8) 15/700 | 4.93–8.12 | rgb(27,20,8) 17/700 | **16.67** |
| desktop | advanced | reproduce a world: every dial rolls from the seed | rgb(156,128,104) 11/400 | 1.03–1.72 | rgb(74,59,34) 12/400 | **9.88** |
| desktop | advanced | Character | rgb(27,20,8) 15/700 | 16.12 | rgb(27,20,8) 17/700 | **16.12** |
| desktop | advanced | Pick a settlement archetype to shape it in one tap | rgb(156,128,104) 11/400 | 3.25 | rgb(74,59,34) 12/400 | **9.56** |
| desktop | advanced | Neutral | rgb(156,128,104) 10/700 | 3.25 | rgb(74,59,34) 12/700 | **9.56** |
| desktop | advanced | Civic | rgb(156,128,104) 10/700 | 3.25 | rgb(74,59,34) 12/700 | **9.56** |
| desktop | advanced | 1 · Foundations | rgb(27,20,8) 17/700 | 5.23–9.93 | rgb(27,20,8) 17/700 | **16.67** |
| desktop | advanced | size, route, culture: the essentials | rgb(156,128,104) 11/400 | 1.04–2.05 | rgb(74,59,34) 12/400 | **9.88** |
| desktop | advanced | 2 · Institutions, services & trade | rgb(27,20,8) 15/700 | 5.22–10.18 | rgb(27,20,8) 17/700 | **16.67** |
| desktop | advanced | force or forbid specifics | rgb(156,128,104) 11/400 | 1.05–2.30 | rgb(74,59,34) 12/400 | **9.88** |
| desktop | advanced | nothing forced or forbidden yet | rgb(156,128,104) 11/400 | 1.06–1.94 | rgb(74,59,34) 12/400 | **9.88** |
| desktop | advanced | Optional | rgb(156,128,104) 12/500 | 3.57 | rgb(74,59,34) 12/500 | **10.50** |
| desktop | advanced | Force or forbid | rgb(156,128,104) 12/500 | 3.57 | rgb(74,59,34) 12/500 | **10.50** |
| desktop | advanced | Guarantee or forbid | rgb(156,128,104) 12/500 | 3.57 | rgb(74,59,34) 12/500 | **10.50** |
| desktop | advanced | Exports & imports | rgb(156,128,104) 12/500 | 3.57 | rgb(74,59,34) 12/500 | **10.50** |
| desktop | advanced | Place in Region | rgb(27,20,8) 15/600 | 17.71 | rgb(27,20,8) 17/700 | **17.71** |
| desktop | advanced | Ready to generate | rgb(156,128,104) 11/700 | 3.36 | rgb(74,59,34) 12/700 | **9.88** |
| iphone13 | anon-landing | Founding Worlds | rgb(27,20,8) 15/900 | 8.17–11.39 | rgb(27,20,8) 15/900 | **16.67** |
| iphone13 | anon-landing | Start somewhere already alive. Fork one  | rgb(74,59,34) 12/400 | 5.14–7.00 | rgb(74,59,34) 12/400 | **9.88** |
| iphone13 | chooser | Character + foundations. The rest is rol | rgb(156,128,104) 12/400 | 3.57 | rgb(156,128,104) 12/400 | **3.57** |
| iphone13 | chooser | Founding Worlds | rgb(27,20,8) 15/900 | 8.07–14.94 | rgb(27,20,8) 15/900 | **16.67** |
| iphone13 | chooser | Start somewhere already alive. Fork one  | rgb(74,59,34) 12/400 | 5.11–7.07 | rgb(74,59,34) 12/400 | **9.88** |
| iphone13 | chooser | Want full control? | rgb(27,20,8) 17/600 | 15.65–15.80 | rgb(27,20,8) 17/600 | **15.65–15.80** |
| iphone13 | basic | Forge a settlement | rgb(140,111,50) 12/800 | 2.06–3.03 | rgb(140,111,50) 12/800 | **4.59** |
| iphone13 | basic | Create a settlement | rgb(27,20,8) 22/700 | 7.06–11.65 | rgb(27,20,8) 22/700 | **17.71** |
| iphone13 | basic | Pick a character and set the foundations | rgb(74,59,34) 15/400 | 3.18–6.63 | rgb(74,59,34) 15/400 | **10.50** |
| iphone13 | basic | Character | rgb(27,20,8) 15/700 | 14.94–16.12 | rgb(27,20,8) 17/700 | **14.94–16.12** |
| iphone13 | basic | Pick a settlement archetype to shape it in one tap | rgb(156,128,104) 11/400 | 3.25 | rgb(74,59,34) 12/400 | **9.56** |
| iphone13 | basic | Neutral | rgb(156,128,104) 10/700 | 3.02–3.25 | rgb(74,59,34) 12/700 | **8.86–9.56** |
| iphone13 | basic | Civic | rgb(156,128,104) 10/700 | 2.43–3.25 | rgb(74,59,34) 12/700 | **8.86–9.56** |
| iphone13 | basic | 1 · Foundations | rgb(27,20,8) 17/700 | 5.33–14.94 | rgb(27,20,8) 17/700 | **14.94–16.67** |
| iphone13 | basic | size, route, culture: the essentials | rgb(156,128,104) 11/400 | 1.09–2.20 | rgb(74,59,34) 12/400 | **9.88** |
| iphone13 | advanced | Forge a settlement | rgb(140,111,50) 12/800 | 2.34–3.74 | rgb(140,111,50) 12/800 | **4.59** |
| iphone13 | advanced | Create a settlement | rgb(27,20,8) 22/700 | 7.90–11.62 | rgb(27,20,8) 22/700 | **17.71** |
| iphone13 | advanced | Pick a character and the foundations. Op | rgb(74,59,34) 15/400 | 3.17–5.96 | rgb(74,59,34) 15/400 | **10.50** |
| iphone13 | advanced | Exact seed | rgb(27,20,8) 15/700 | 5.44–14.94 | rgb(27,20,8) 17/700 | **14.94–16.67** |
| iphone13 | advanced | reproduce a world: every dial rolls from the seed | rgb(156,128,104) 11/400 | 1.08–2.25 | rgb(74,59,34) 12/400 | **9.88** |
| iphone13 | advanced | Character | rgb(27,20,8) 15/700 | 14.94–16.12 | rgb(27,20,8) 17/700 | **14.94–16.12** |
| iphone13 | advanced | Pick a settlement archetype to shape it in one tap | rgb(156,128,104) 11/400 | 3.25 | rgb(74,59,34) 12/400 | **9.56** |
| iphone13 | advanced | Neutral | rgb(156,128,104) 10/700 | 3.02–3.25 | rgb(74,59,34) 12/700 | **8.86–9.56** |
| iphone13 | advanced | Civic | rgb(156,128,104) 10/700 | 1.91–3.25 | rgb(74,59,34) 12/700 | **8.86–9.56** |
| iphone13 | advanced | 1 · Foundations | rgb(27,20,8) 17/700 | 5.39–14.94 | rgb(27,20,8) 17/700 | **14.94–16.67** |
| iphone13 | advanced | size, route, culture: the essentials | rgb(156,128,104) 11/400 | 1.08–2.33 | rgb(74,59,34) 12/400 | **9.88** |
| iphone13 | advanced | Ready to generate | rgb(156,128,104) 11/700 | 3.02–3.36 | rgb(74,59,34) 12/700 | **9.88** |

The four middle archetype group labels (Economic, Military, Religious, Arcane) read the same as Neutral and Civic, and are folded out of the table. One before-row, desktop Basic "1 · Foundations", caught the leaf mid-unfold (`rgba(0,0,0,0)` ink). The Advanced row is the reliable before figure.

Horizontal overflow at 390 (iPhone 13) is **0** in every state, before and after.

## 4. What I saw (the screenshots, `docs/chair/2026-11-10/config-headers/*.before-after.webp`, before on the left)

- **desktop-advanced-1.** The opening block was bare over the hillside. Now it is one white plate, and Exact seed is a card with its band.
- **desktop-advanced-2 and -3.** "1 · Foundations" was a bare line between cards. It is now the card's header band, one outline with the fields. "2 · …" is the band of the three disclosures, joined flush, with Clear all and its status line in place.
- **Ready to generate.** The label is legible in the card's band.
- **desktop-chooser-1 and desktop-anon-landing-1.** "Founding Worlds" and its lead sit on a band above the cards.
- **iphone13-\*.** The same forms. Nothing overflows, and the plates keep the 16 px gutters.

## 5. CONFIRMED and PLAUSIBLE

CONFIRMED (executed):
- the contrast table above (probe run on base and tip, same server, same states);
- the pin, red on base and green on tip;
- the screenshots, which I read;
- eslint 0 on every touched file;
- the sweep and the e2e specs (§6).

PLAUSIBLE (not executed):
- The record-only items have no runtime effect.

## 6. Gates

- **The sweep** (`sh scripts/gate-tail.sh npx vitest run tests/lint tests/scripts tests/components tests/build tests/ui --maxWorkers=2`): 12 files red at the tip before its registers. Every one is named below.
  - **Two were this lane's registers, moved through their doors:**
    - the lighting census, re-frozen with `LIGHTING_CENSUS_REFREEZE` on the clean tree at `c43f2a88a` (files +1, credited +1, titles +2, suiteTitles +1: exactly the pin), plain re-run 34/34;
    - the source-citation roster (`dated` 217 → 218: this record), bumped through the Edit tool.
  - **Ten are THE BASE'S:** the same files and the same failing tests, red in a base worktree at `ecadf531a`:
    - `publicProseEquality` (soak1k-10, soak1k-11)
    - `readerValidationOnPage` (soak1k-24)
    - `domainAnyCastBaseline`
    - `ledgerCitationIntegrity` (the ledger ref `review-fixes-2026-07-08` is not fetched in this container)
    - `newsHeadlineContract` (A2, A3)
    - `observedShapeReaders` (4)
    - `proseFamilyContract` (A1, A3, A5)
    - `proseRegisterLoaders` (R6)
    - `provenanceMap` (the same missing ledger ref)
    - `heraldForecast`

    None of them is on the Create page.
- **E2E (Chromium, `--trace off`):** flow-a, visual-polish, phone-horizontal-overflow and pinned-footer, **97 passed**. They ran through a local, uncommitted wrapper config that points at the session's pre-installed Chromium, because the pinned Playwright's build is not installed here.
- `npm run typecheck:ratchet`: OK at **167** (ceiling 167).
- `node scripts/wiring-census.mjs --check`: verified, exit 0.
- eslint: **0** on every touched file.
- The forked-colour ratchet (`tests/lint/forkedColorBaseline.test.js`) is green in the sweep. No new colour; every value is a token (CARD, CARD_HDR, BORDER, BORDER2, BODY, INK).
- The phone type-floor census does not move: the touched lines move sizes up (FS.xxs/xs → FS.sm), and none of them was a census row.
- Nothing generated moves. No engine, data or generator file is touched.

## 7. What stays (not this lane's)

- **The chooser's mode-card descriptions** ("Character + foundations. The rest is rolled.", "Every dial: …") are MUTED 12px on CARD, 3.57:1 (`ModeSelector.jsx`). They are on a card, not the painting, and not on the chair's list.
- **The WizardCloseout chips' labels** ("Tier", "Tradition", …) are MUTED 11px on GOLD_BG. They are on a card and not on the chair's list.
- **The MUTED token's value itself** stays: the chair's finding for after the release (H9).
- **The kicker** ("FORGE A SETTLEMENT", GOLD_DEEP 11px) passes at 4.59 on the CARD plate, the tightest figure on the page. PageHeader's eyebrow colour is shared sitewide and was not touched.
- **"Founding Worlds"** stays at FS.lg/900: it is the landing's own heading, not one of the configuration's five section titles.
- **Untouched:** the `.page-bg` rules, the generating flow's veil, and every page outside Create.
