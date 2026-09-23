// src/domain/edit/recordInvariantFlags.js — THE DECLARED FLAG DATA. PURE FROZEN DATA.
// ⛔ IMPORTS NOTHING. No branch, no PRNG, no clock, no locale, no store, no I/O.
//
// WHAT THIS TABLE IS. `FLAGS_EVER_TRUE` records, for each band of the two label ladders,
// which boolean flags the GENERATOR was ever observed to set TRUE beside that band. It is
// TAUGHT, not derived: `docs/DESIGN_EDIT_MODE_AND_DECREES.md` §22.3 item 6 strikes every
// learned envelope, and deriving a flag from the published percentage was refused by its own
// control — the flags are computed from the UNROUNDED value against a cut that differs from
// the label ladder's, and the derivation convicts honest rows in the overlap window.
//
// THE CORPUS IT WAS TAUGHT ON is named in `FLAG_CORPUS`: the whole golden-master corpus of
// `tests/helpers/goldenMasterCorpus.js`, generated plainly, at the measuring commit recorded
// there. What the table records is what the generator DOES across its two ladders.
//
// ⛔⛔ KEYED BY THE LADDER'S OWN BAND KEY, NEVER BY THE LABEL TEXT, AND THAT IS A
// REGISTRATION OBLIGATION, NOT A STYLE. `tests/copy/voiceMechanics.test.js` counts every em
// dash inside every string literal of every non-test `.js` file under `src/data` and
// `src/domain`, matches its per-file baseline EXACTLY, and holds a file with no baseline row
// at ZERO. One of the six food labels carries an em dash. `src/data/bandLadders.js` holds
// that label lawfully under the walker's exact-string allowlist; this leaf does not, and a
// leaf that transcribed it would red the walker at the build. So no label text is spelled
// here: `recordInvariants.js` resolves a record's label to its band key through the IMPORTED
// `FOOD_SECURITY_BANDS` and `LEGITIMACY_BANDS` tables at runtime.
//
// ⛔ AND NO NUMERIC LITERAL AT ALL. The observation counts behind each row live in the
// packet's receipt, not in this source: `scripts/lib/tuning-inventory.mjs` holds a new
// `src/domain` file at zero bare decimals and zero module-top-level named numerics.
//
// ⚠ A BAND THAT WAS NEVER OBSERVED IS ABSENT FROM THIS TABLE, NOT PRESENT AND EMPTY. Absence
// is what makes the reader ABSTAIN ENTIRELY on it; an empty row would convict every flag.

/** The flag fields each ladder's object carries, in the record's own key order. */
export const FLAG_FIELDS = Object.freeze({
  economicState: Object.freeze(['isDeficit', 'isPressured', 'isSecure', 'isSurplus']),
  powerStructure: Object.freeze(['isEndorsed', 'isApproved', 'isTolerated', 'isContested', 'isLegitimacyCrisis']),
});

/**
 * band key -> the flags EVER observed true beside it. The `powerStructure` rows are in the
 * legitimacy ladder's own order, because that ladder exposes no key of its own and the
 * reader resolves a label to a key by its POSITION in `LEGITIMACY_BANDS`.
 */
export const FLAGS_EVER_TRUE = Object.freeze({
  economicState: Object.freeze({
    famine: Object.freeze(['isDeficit']),
    deficit: Object.freeze(['isDeficit']),
    importDependent: Object.freeze(['isDeficit', 'isPressured']),
    pressured: Object.freeze(['isPressured']),
    secure: Object.freeze(['isSecure']),
  }),
  powerStructure: Object.freeze({
    endorsed: Object.freeze(['isEndorsed', 'isApproved']),
    approved: Object.freeze(['isApproved']),
    tolerated: Object.freeze(['isTolerated']),
    contested: Object.freeze(['isContested']),
    legitimacyCrisis: Object.freeze(['isLegitimacyCrisis']),
  }),
});

/**
 * THE ONE KNOWN GENERATOR DEFECT, NAMED AND DATED — never a blanket tolerance. The corpus
 * row below publishes a viability summary whose dependency count is not the count its own
 * dependencies roster carries. It is asserted STILL PRESENT by the control arm, in both
 * directions, so curing the generator REDS that arm and the cure's packet must remove this
 * row in the same act.
 */
export const KNOWN_VIOLATIONS = Object.freeze([
  Object.freeze({
    corpusKey: 'town|germanic|mountain|mountain_pass|civilized|golden-master-v3',
    id: 'V-SUMMARY-DEPS',
    found: '2026-09-23',
    curedBy: 'FIX-G1',
  }),
]);

/** The provenance of `FLAGS_EVER_TRUE`. Strings only; the counts live in the receipt. */
export const FLAG_CORPUS = Object.freeze({
  helper: 'tests/helpers/goldenMasterCorpus.js',
  spelling: 'goldenCorpus(), generated plainly, the whole corpus',
  measuredAt: '64b75240c98831693e4495efedeb2639cfa691f7',
});
