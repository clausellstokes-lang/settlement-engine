# TRAD-2 · UNIT 2 — THE SHARED PAGE: THE CURATE-SCREEN PROOF AND THE PUBLIC SEARCH

Read `TRAD-2-COMMON.md` first; it binds you. Base: `lane/trad-2-2026-11-20` at the commit your worktree starts on.
A security reader reads this unit first: every arm is a born proof with its control.

## Files you may change
`tests/security/traditionDescriptionSharedPage.test.js` (the traditions' own born test; the ONLY file under
`tests/security/` you touch), `src/domain/dossier/dossierSearch.js`, `src/components/dossier/DossierSearchResults.jsx`
(only if the audience must be passed through it), ONE new test file outside `tests/security/` for the search
(e.g. `tests/domain/dossierSearchTraditions.test.js`: its basename must avoid the mutation manifest's walker name pattern
census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin).
Not the leaf (`traditionDescription.js`, its table): unit 1 owns them; if you need a change there, STOP and report.

## The chair's rulings you build to
- THE PROOF EXTENDED: with EVERY ADDRESS THE CURATE SCREEN CAN HIDE hidden — not only every hideable house — the drawn
  traditions text (`publicProseCompose.js` site `traditions`, a list of rows `{id, name, element, chip, when, text}`) is
  BYTE-IDENTICAL to the text drawn with nothing hidden, and names nothing hidden. Read how the screen's model lists its
  addresses on `origin/lane/veil-22-2026-11-20` (`git show origin/lane/veil-22-2026-11-20:src/domain/display/galleryVeil.js`,
  `curateModelFor`; READ, EDIT NOTHING THERE) and on this tree (`src/domain/display/galleryVeil.js :: curateModelFor`,
  `applyVeil`, `defaultVeilFor`, `writeShareVeil`, `projectShareVeil`). Build the arm over born towns that hold
  hideable houses (the existing INVERSION arm's six are a start; widen to every tier): enumerate every address the
  model offers, hide them ALL (and, as a second arm, each CLASS of address alone), draw, compare bytes; and assert no
  name of a hidden thing (house, power, card name, field value the address names) stands in any row's text. State in
  the report how many addresses were hidden per town and of which kinds; if veil-22's model lists an address kind this
  tree's model lacks, say so and cover it from veil-22's reading by hand-built addresses in the test.
  Non-vacuity: assert the towns hold addresses of each kind you claim; a control that plants a hidden name INTO a row
  must make the "names nothing hidden" assertion red.
- THE READER'S TEXT IS DRAWN AT SAVE AND SERVED LATER, so it may name nothing ANY later act of the DM could hide.
  Write, as a comment block at the head of your new arms, one paragraph per clause the reader's text can carry (what is
  done; who keeps it: house, power, owner; the founding cause; the dead's cause; the economy): why no later hide can
  reach it (by class: the leaf never names a hideable house, a veiled power or any person; the founding, the history
  event and the income source are not hideable addresses — VERIFY each against the curate model, do not assume).
  If any clause CAN be reached by a later hide, STOP and report it at once: that is a finding for the chair, not a cure
  for you.
- THE SEARCH INDEX COMPOSED WITH THE VIEW'S OWN AUDIENCE (`src/domain/dossier/dossierSearch.js :: traditionsOf`): today
  on a public view it derives a set from `id` (the wrong set) and indexes no description. On a public dossier it reads
  ONLY the served rows (`publicProseOf(view, 'traditions')`: name, chip, text) and never derives from `id`; with no
  rows drawn, it indexes no tradition. On the owner's views it indexes the description composed with the view's audience
  (player view → 'reader', else 'owner'), through `src/domain/traditions/shownTraditions.js` (the tab's one set rule)
  and `describeTradition`. RED FIRST: a born test on the PUBLIC search (a born town saved owner-side, served by the party
  link as `traditionDescriptionSharedPage.test.js` builds it): searching a word of a served row's description finds it
  (red on the base: not indexed); searching the name of a rite the id-derived set holds but the owner's set does not
  finds nothing (red on the base); on the owner's player view a hideable house's name is not indexed.
