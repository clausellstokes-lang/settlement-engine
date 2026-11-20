THE SENTENCE (proposed; the chair's to approve; `CRIMINAL_SWITCH_WORDS.housesHidden`): "While a criminal house is hidden, the town's criminal powers are kept off the shared page too, so they cannot give the house away; show the house to show them, or leave it hidden and they stay off."

THE CONDITION, one line: the switch reads "Shown to visitors" or "Partly shown, by you" AND the Curate model draws some house's whole-house eye as hidden (`criminalHouseHiddenWhileShown(state, model)`).

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

## How the condition matches R3's power rule
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

Limits, toward over-telling, recorded and not cured (outside the three files): (1) R3 withholds only where the town HAS a
non-governing criminal power; the notice shows on any shown/partly read with a house hidden, including a town without one
(the sentence is then true but idle). (2) "Shown" with a house hidden is unreachable on today's model (every whole-house
eye is a drawn criminal part, so a hidden one makes the switch read partly); the predicate covers it anyway, tested at the
predicate. (3) The income row of VR34 (b) is withheld under a narrower house test (`isCriminalInstitution` only); the
sentence speaks of powers only.

## Red and green (every run under `env -u GIT_*`, every exit by `sh scripts/gate-tail.sh`)
- RED (before the change): `RED-curateModeCriminalSwitch.txt`: exit 1, 3 failed | 11 passed (14): both "shows" arms (the
  sentence absent) and the predicate arm (not a function). The three "does not show" arms ((i) every criminal house shown,
  read partly and read shown; (ii) the switch reading hidden, fresh and after Show all then Hide all; (iii) a town with no
  criminal parts) pass at red vacuously and carry weight only at green.
- GREEN: `GREEN-curateModeCriminalSwitch.txt`: exit 0, 14 passed (14).
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
CONFIRMED (executed): the sentence shows on partly with a criminal house hidden and on no other tested read; the
predicate's house reading equals applyVeil's house removal on the fixture; the gates above; the census. CONFIRMED by
reading: R3's trigger is any house gone, and the model's whole eye is the applier's house test. PLAUSIBLE: that R3 as merged
(after R3-CURE-4) keeps that trigger; that the server projection R3 runs on lists the same houses as the screen's
`galleryPayloadFor` copy.

Commit: the one commit on `v25-curate` above ae77ff26f (`git log -1 v25-curate`; a file cannot hold its own commit's hash), files: src/components/gallery/CurateMode.jsx, src/domain/display/criminalVeilSwitch.js, tests/components/curateModeCriminalSwitch.test.jsx, docs/chair/2026-11-20/veil/out/v25/curate/*.
