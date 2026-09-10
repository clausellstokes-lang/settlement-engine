import { readFileSync, writeFileSync } from 'node:fs';

const EDITS = {
  'src/domain/institutions/institutionTable.js': [
    ['`inferred` — a basis names what the code DOES.', '`inferred`: a basis names what the code DOES.'],
    ['which NO writer in the estate produces — the ', 'which NO writer in the estate produces (the '],
    ['ledger lives at `settlement.economicState.treasury` — so the read degraded', 'ledger lives at `settlement.economicState.treasury`), so the read degraded'],
    ['generated settlement takes — but it is now absent', 'generated settlement takes, but it is now absent'],
    ['can never carry one they miss — which is why reading it', 'can never carry one they miss, which is why reading it'],
    ['read on every row — and STRUCTURALLY SILENT', 'read on every row, and STRUCTURALLY SILENT'],
    ['carrying an `on` key at all — the `on`/`p` pair is', 'carrying an `on` key at all: the `on`/`p` pair is'],
    ['institutionFoundingOf — the three typed kinds', 'institutionFoundingOf: the three typed kinds'],
    ['designation; OPEN BY LAW — ${OPEN_BY_LAW.office}', 'designation; OPEN BY LAW: ${OPEN_BY_LAW.office}'],
    ['`absent — ${OPEN_BY_LAW.holderRole}; ', '`absent: ${OPEN_BY_LAW.holderRole}; '],
    ['QUANTITY_BANDS reader — a band, never a roll', 'QUANTITY_BANDS reader: a band, never a roll'],
    ["the treaty TOLL-EXEMPTION term family — a route\\'s exemption", "the treaty TOLL-EXEMPTION term family: a route\\'s exemption"],
    ['institutionFoundingOf — FOUNDED{year,tick}', 'institutionFoundingOf: FOUNDED{year,tick}'],
  ],
  'src/domain/prose/entryGround.js': [
    ['the office roster is empty — derive it', 'the office roster is empty; derive it'],
    ['no table supplied — a settlement ground without a table is a guess', 'no table supplied; a settlement ground without a table is a guess'],
  ],
  'src/domain/prose/entryWalker.js': [
    ['with no shared count noun — whether they name one quantity', 'with no shared count noun; whether they name one quantity'],
    ['its sibling bands it ${other} — the same cell, the same state', 'its sibling bands it ${other} (the same cell, the same state)'],
    ["its sibling carries ${b.join('/')} — whether they name one subject", "its sibling carries ${b.join('/')}; whether they name one subject"],
    ['composer bag does not offer — the variant is unreachable', 'composer bag does not offer; the variant is unreachable'],
    ['this segment names none — a second fact', 'this segment names none; a second fact'],
    ['wiring does not fill — a pre-existing unlicensed claim', 'wiring does not fill; a pre-existing unlicensed claim'],
  ],
  'src/domain/prose/grammarWalker.js': [
    ['admissible orders — at n ≤ 2 a share ceiling', 'admissible orders; at n ≤ 2 a share ceiling'],
    ['no ceiling shape supplied — the share ceiling is', 'no ceiling shape supplied: the share ceiling is'],
    ['${n} order(s) — a run rate needs consecutive pairs', '${n} order(s); a run rate needs consecutive pairs'],
    ['`n = ${n} — the rota arm needs n ≥ 3`', '`n = ${n}; the rota arm needs n ≥ 3`'],
    ['no measurable pool — a spread over nothing', 'no measurable pool: a spread over nothing'],
    ['no spread ceilings supplied — MOVE-GRAMMAR §4.3', 'no spread ceilings supplied: MOVE-GRAMMAR §4.3'],
    ['(${(share * 100).toFixed(1)}%) — ${key} above the ceiling', '(${(share * 100).toFixed(1)}%): ${key} above the ceiling'],
    ['${segmentCount(text)} sentences — the register is one flowing', '${segmentCount(text)} sentences; the register is one flowing'],
    ['variants open on the settlement token — the wall allows at most one per pool', 'variants open on the settlement token; the wall allows at most one per pool'],
    ['both open on the settlement token — never two adjacent', 'both open on the settlement token; never two adjacent'],
    ['names the rejected alternative — the wiring census supplies the key', 'names the rejected alternative: the wiring census supplies the key'],
    ['`NOT-EXECUTABLE — wall ${wall.id}', '`NOT-EXECUTABLE: wall ${wall.id}'],
    ['no exemplar bands supplied — the BUDGET, DEPTH and PERFECTION arms', 'no exemplar bands supplied: the BUDGET, DEPTH and PERFECTION arms'],
    ['${fp.sentences} sentence(s) — too small to fingerprint', '${fp.sentences} sentence(s): too small to fingerprint'],
    ['band-widths ${e.side} — exempt as a declared defining feature', 'band-widths ${e.side}; exempt as a declared defining feature'],
    ['${scored.length} soft rules — FLAGGED SUSPECT', '${scored.length} soft rules: FLAGGED SUSPECT'],
    ['} — the classifier is a CHECK, never a source', '}; the classifier is a CHECK, never a source'],
    ['has no composer bag — every variant of it is unreachable', 'has no composer bag; every variant of it is unreachable'],
    ['${entry.pool} — the census and the corpus disagree', '${entry.pool}; the census and the corpus disagree'],
    ["not recovered'} — what this pool is entitled to say", "not recovered'}: what this pool is entitled to say"],
    ['no simulated reading sequence supplied — the consecutive-pair statistics', 'no simulated reading sequence supplied: the consecutive-pair statistics'],
    ['no exemplar bands or no owner numbers supplied — BUDGET, DEPTH and PERFECTION', 'no exemplar bands or no owner numbers supplied: BUDGET, DEPTH and PERFECTION'],
    ['licensed move/field unit(s) — a sentence may exist only to connect', 'licensed move/field unit(s); a sentence may exist only to connect'],
  ],
  'src/domain/prose/moveGrammar.js': [
    ['a named thing — the object, never the class', 'a named thing: the object, never the class'],
    ['left standing open — never an interrogative', 'left standing open; never an interrogative'],
    ['positional — a KIND, never a position rule', 'positional: a KIND, never a position rule'],
    ['whose value is unresolved — NOT-EXECUTABLE today', 'whose value is unresolved; NOT-EXECUTABLE today'],
    ['standing fact the table could act on — the reaction point', 'standing fact the table could act on: the reaction point'],
    ['V4]` text` — the\'', 'V4]` text`; the\''],
    ["'scripts/generate-dossier-state-prose.mjs — parseTag() must route", "'scripts/generate-dossier-state-prose.mjs: parseTag() must route"],
    ["'tests/data/dossierStateProseProjection.contract.test.js — the `--check` byte-compare moves", "'tests/data/dossierStateProseProjection.contract.test.js: the `--check` byte-compare moves"],
    ['no key, no index and no eligibility — `variantIsAnchored` reads', 'no key, no index and no eligibility; `variantIsAnchored` reads'],
  ],
  'src/domain/prose/plantLedger.js': [
    ["'plant.id — a stable identity", "'plant.id: a stable identity"],
    ["'plant.answerable — the typed flag", "'plant.answerable: the typed flag"],
    ["'plant.answer | plant.gapReason — the DM page", "'plant.answer | plant.gapReason: the DM page"],
    ["'no plant carries `answerable: true` — D8\\'s arm has no subject", "'no plant carries `answerable: true`; D8\\'s arm has no subject"],
    ['carries BOTH an answer and a gap-reason — D8 says exactly one', 'carries BOTH an answer and a gap-reason; D8 says exactly one'],
    ['two plants fold to one derived id — the derived id is a content fold', 'two plants fold to one derived id; the derived id is a content fold'],
    ['lies outside [0, 1] — a plant carrying', 'lies outside [0, 1]; a plant carrying'],
    ['answerable plant(s) — D8 wants a', 'answerable plant(s); D8 wants a'],
    ['answerable plant — the cross-seed limb needs at least two', 'answerable plant; the cross-seed limb needs at least two'],
    ['on all ${shares.length} seeds —`', 'on all ${shares.length} seeds.`'],
    // The completeness-claim rephrase (red 3): a hypothetical, not a standing claim.
    ['a walker that quietly returned "0 problems"', 'a walker that quietly reported a clean sweep'],
  ],
  'src/domain/prose/proseFingerprint.js': [
    ['exemplar(s) after exclusion — a band needs at least two', 'exemplar(s) after exclusion; a band needs at least two'],
  ],
  'src/domain/prose/wiringCensus.js': [
    ['no `minTowns` floor supplied — "co-fire on many towns"', 'no `minTowns` floor supplied: "co-fire on many towns"'],
    [
      "    rows.push({ field, op: bare[1] === '!' ? 'falsy' : 'truthy', value: '(no literal)' });",
      "    // The `(!?)` group captures the negation mark or the empty string, so a non-empty\n"
      + "    // capture IS the negation: the mark itself never has to sit in a string literal.\n"
      + "    rows.push({ field, op: bare[1] ? 'falsy' : 'truthy', value: '(no literal)' });",
    ],
  ],
};

let total = 0;
for (const [file, pairs] of Object.entries(EDITS)) {
  let src = readFileSync(file, 'utf8');
  for (const [oldText, newText] of pairs) {
    const n = src.split(oldText).length - 1;
    if (n !== 1) {
      console.error(`FAIL ${file}: ${n} occurrence(s) of ${JSON.stringify(oldText.slice(0, 70))}`);
      process.exit(1);
    }
    src = src.replace(oldText, newText);
    total += 1;
  }
  writeFileSync(file, src);
  console.log(`${file}: ${pairs.length} replacement(s) applied`);
}
console.log(`TOTAL ${total} replacements`);
