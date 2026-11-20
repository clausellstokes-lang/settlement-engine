THE WORDS (the chair's ruling, word for word; `CRIMINAL_SWITCH_WORDS.housesHidden`): "While a criminal house is hidden, the town's criminal powers stay off the shared page too, so they cannot give the house away. Show the house to show them, or leave it hidden and they stay off."

THE CONDITION, one line: the switch reads "Shown to visitors" or "Partly shown, by you" AND the Curate model draws some house's whole-house eye as hidden AND the screen's copy holds a power of category 'criminal' (`criminalHouseHiddenWhileShown(state, model, payload)`).

(Second commit, on the chair's ruling: the words replaced by the chair's two sentences; the third condition added. The
first commit 1bd894613 proposed one sentence: "...are kept off the shared page too, so they cannot give the house away;
show the house to show them, or leave it hidden and they stay off.")

# CURATE-NOTICE — hand-back (builder, VEIL-25; branch `v25-curate`, base ae77ff26f)

## The surfaces that render it
Census: `SURFACES.txt` (git grep over src, tests, supabase for `housesHidden`, `criminalHouseHiddenWhileShown`,
`CriminalSwitch`, `CRIMINAL_SWITCH_WORDS`, `houseHidden`, and every import of `gallery/CurateMode`).
- The sentence is read in ONE place: `src/components/gallery/CurateMode.jsx :: CriminalSwitch` (`W.housesHidden`), drawn
  only when `CurateMode` passes `houseHidden`, and `CriminalSwitch` is itself drawn only outside "Preview as visitor".
- `CriminalSwitch` is imported nowhere else. `CurateMode` is imported only by `src/components/gallery/ManageGallery.jsx`
  ("Curate for visitors" in the owner's "Manage gallery" panel), which only `src/components/ShareToGallery.jsx` mounts;
  ShareToGallery's mounts are the owner's own (SettlementDetail, DossierActionBand, and GalleryDetail behind `ownedSave`,
  the viewer's own saved settlement published under that slug).
- No served byte: no file under `supabase/` changes (`git diff ae77ff26f -- supabase` is empty), no applier
  (`galleryVeil.js`, `galleryRosterChoices.js`, `gallerySecondHomes.js`, the people and withhold-always files) is touched.
  It sets nothing: no draft change, no delta, no click handler (the test's flips go through the existing button only).

## The third condition: which field is read for "criminal power", and why it matches
`category` (case-folded, === 'criminal') on each entry of `payload.powerStructure.factions` and of master's top-level
`payload.factions`, where `payload` is the screen's own copy (`galleryPayloadFor`'s output, the same object CurateMode
already holds). This is the reading of `src/domain/people/cardVeil.js :: isVeiledPower` (`category.toLowerCase() ===
'criminal'`) and of R3's `galleryRosterChoices.js :: entryOut` (`asciiLowerOf(f.category) === 'criminal'`), over the two
lists R3 withholds from (`powerStructure.factions` and master's `factions`). Probed: `galleryPayloadFor` keeps each power's
`category` in `powerStructure.factions` (Reveal DM off and on) and the top-level `factions` only with Reveal DM on.
Remaining differences, recorded and not cured: R3 also withholds a power whose name matches /thie/ with no criminal
category (the notice does not show there; toward silence), and never withholds the GOVERNING power (VR42), so a town whose
only criminal power governs still shows the notice (toward over-telling). The chair's definition (category only) is the one
built.

## How the house condition matches R3's power rule
R3 (not merged; read at `origin/lane/veil-24-r3c2-2026-11-20` 9b18835d1, `galleryRosterChoices.js :: applyRosterChoices`)
withholds every non-governing criminal power (`entryOut`) where `whole = gone.length > 0`, `gone` being the houses of the
projection the veiled copy no longer lists (`gallerySecondHomes.js :: rosterHouses`). In base, `applyVeil` removes a house
whole exactly where `card:institution:<id>` is in the resolved set AND `isHideableHouse` holds; `curateModelFor` draws a
`whole` eye exactly for `isHideableHouse` cards, its `hidden` read from the same resolved set (`isAddressHidden(now, …)`).
So "a model card's whole eye reads hidden" = "applyVeil drops that house" = R3's `whole`. Every hideable house is a
criminal-family house: `isHideableHouse`'s three arms (criminal category, clandestine facet, illegal brokerage) are the
selectors of the three family classes (criminal-institution, clandestine-institution, covert-brokerage). The test's
predicate arm executes the middle equality on the fixture (applyVeil's institution count drops exactly when the predicate's
house reading holds, and not after the house is opened).

Limits, recorded and not cured: (1) cured by the second commit (the third condition above). (2) "Shown" with a house hidden is unreachable on today's model (every whole-house
eye is a drawn criminal part, so a hidden one makes the switch read partly); the predicate covers it anyway, tested at the
predicate. (3) The income row of VR34 (b) is withheld under a narrower house test (`isCriminalInstitution` only); the
sentence speaks of powers only.

## Red and green (every run under `env -u GIT_*`, every exit by `sh scripts/gate-tail.sh`)
- RED 2 (the chair's ruling, before the second change): `RED2-curateModeCriminalSwitch-power.txt`: exit 1, 3 failed |
  13 passed (16): the new no-criminal-power arm (a criminal house hidden, partly, read twice: after opening criminal
  services, and after Show all then hiding one house: the notice must NOT show), the words pin (the chair's two sentences),
  and the predicate arm (the third condition, both lists, any case). FIXTURE CHANGE: the arms that expect the notice
  (`twoDens`) had NO power; they now carry a criminal power ("Thieves' Guild", category 'criminal') beside a governing
  council; the no-power fixture is the same town with the council alone. The "(i) every house shown, partly" arm also
  carries the criminal power now, so it fails only by its house condition.
- GREEN 2: `GREEN-curateModeCriminalSwitch.txt`: exit 0, 16 passed (16).
- RED (first commit, before the first change): `RED-curateModeCriminalSwitch.txt`: exit 1, 3 failed | 11 passed (14): both "shows" arms (the
  sentence absent) and the predicate arm (not a function). The three "does not show" arms ((i) every criminal house shown,
  read partly and read shown; (ii) the switch reading hidden, fresh and after Show all then Hide all; (iii) a town with no
  criminal parts) pass at red vacuously and carry weight only at green.
- GREEN (first commit): 14 passed (14) (overwritten by GREEN 2; at 1bd894613 in git).
- `tests/domain/display/criminalVeilSwitch.test.js`: `base-domain-criminalVeilSwitch.txt` exit 0, 9 passed (9);
  `GREEN-domain-criminalVeilSwitch.txt` exit 0, 9 passed (9). UNCHANGED FROM THE BASE. Note: the brief's "known red,
  VR34 (b)" does NOT show at ae77ff26f; it is green here (it presumably reds on R3's branch, which is not in this base).
- eslint on the three files: `GREEN-eslint.txt` exit 0.
- `typecheck:domain:strict`: `GREEN-typecheck-domain-strict.txt` exit 0 (1113, ceiling 1113). A first run red +1 on the
  predicate's implicit `any` was cured by a typed local before the commit.
- `typecheck:ratchet`: `GREEN-typecheck-ratchet.txt` exit 0 (167, ceiling 167).
- Not asked, run for the touched literal: `tests/lint/presumedThings.walker.test.js`: `GREEN-presumedThings-walker.txt`
  exit 1, 1 failed | 42 passed; full list `presumedThings-walker-full.txt`: 46 entries, NONE the new sentence; the one in
  this module is the untouched `covers` literal (no register row names `criminalVeilSwitch.js` at all, so its verdict does
  not depend on this change); the rest are gallerySecondHomes.js and rosterChoiceRegistry.js. Base drift, not repaired.

## CONFIRMED vs PLAUSIBLE
CONFIRMED (executed): the notice shows on partly with a criminal house hidden and a criminal power, and on no other tested
read (no criminal power included); the
predicate's house reading equals applyVeil's house removal on the fixture; the gates above; the census. CONFIRMED by
reading: R3's trigger is any house gone, and the model's whole eye is the applier's house test. PLAUSIBLE: that R3 as merged
(after R3-CURE-4) keeps that trigger; that the server projection R3 runs on lists the same houses as the screen's
`galleryPayloadFor` copy.

Commits: 1bd894613 and the second commit above it on `v25-curate` (`git log -1 v25-curate`; a file cannot hold its own commit's hash), files: src/components/gallery/CurateMode.jsx, src/domain/display/criminalVeilSwitch.js, tests/components/curateModeCriminalSwitch.test.jsx, docs/chair/2026-11-20/veil/out/v25/curate/*.
