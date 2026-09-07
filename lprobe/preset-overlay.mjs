#!/usr/bin/env node
/**
 * preset-overlay.mjs — ⛔⛔ SUPERSEDED 2026-09-05 (L-OVERLAY). IT REFUSES TO RUN.
 * Its replacement is `preset-seam.mjs`; `certify.sh` already calls that instead.
 *
 * ── WHAT IT WAS, AND WHY IT WAS RIGHT ──────────────────────────────────────────────────
 * When this file was written, `scripts/audit/whole-world-soak.mjs` had NO `--preset` flag: it
 * hardwired `preset: SIMULATION_RULE_PRESETS.full_simulation.rules`, and `composeSoakRules` is
 * `{ ...preset, ...seasonsOverride(seasons), ...overlay }`. So the ONLY seam to another preset
 * was `--rules-json`, whose object is spread LAST — able to override full_simulation key for
 * key, but ONLY for keys the overlay actually names. A key full_simulation carried and the
 * overlay did not stayed at FULL SIMULATION's value, so a "quiet_local receipt" taken through
 * that seam would silently carry full_simulation's setting for 33 keys.
 *
 * This file built the overlay from the REAL-birth resolved rules and REFUSED any overlay that
 * was not total — `keys(full_simulation.rules) \ keys(overlay)` — naming every leaked key. It
 * never trimmed the leak away and proceeded, and it never padded the overlay to totality
 * (a preset that does not carry a key does not describe a world in which that key has a value;
 * two of the leaked keys, `realmMagicDefault` and `narrativeTempo`, are not even booleans, so
 * the invention would have been a tuning choice wearing an instrument's name).
 *
 * ITS MEASUREMENT, PRESERVED — taken at 38474a59e, `lprobe-out-899-full/overlays/overlay-leak-report.json`:
 *
 *     full_simulation      0 leaked keys   -> a CLEAN receipt was producible
 *     dramatic_campaign   14 · living_realm 15
 *     quiet_local 33 · realistic_regional 33 · narrative_campaign 33 · static_campaign 34
 *
 * ── WHY IT IS RETIRED RATHER THAN KEPT ─────────────────────────────────────────────────
 * DOCKET item 7 (§899, car `2200db6f3`) landed the cure this file's STOP demanded: the soak
 * takes a real `--preset <id>` that REPLACES the composition base, and `--preset` with
 * `--rules-json` is REFUSED upstream. The leak this instrument measures is therefore a
 * property of a seam certification no longer uses. Left runnable, it would keep reporting
 * "6 of 7 presets REFUSED" about a defect that has been fixed — a claim that has decayed,
 * still wearing a receipt's clothes. So it fails closed instead.
 *
 * ⛔ THE ONE THING IT DOES NOT MEAN. The overlay seam itself is NOT dead: `--rules-json` and
 * `--lighting` remain lawful overlays ON TOP of a stated base, and the flag sweep needs them.
 * What is dead is using an overlay AS A SUBSTITUTE FOR A PRESET. That is what this file did.
 */
console.error('⛔ preset-overlay.mjs is SUPERSEDED and refuses to run.');
console.error('');
console.error('   It measured the LEAK of the `--rules-json` overlay seam, which was the only way to');
console.error('   reach a non-full_simulation preset before DOCKET item 7 (§899, car 2200db6f3) gave');
console.error('   `whole-world-soak.mjs` a real `--preset <id>`. That flag REPLACES the composition');
console.error('   base, so the leak this file measures can no longer occur on the certification path.');
console.error('');
console.error('   Its historical measurement is preserved in this file\'s header and in');
console.error('   `lprobe-out-899-full/overlays/overlay-leak-report.json`.');
console.error('');
console.error('   USE INSTEAD: node preset-seam.mjs --fixtures <birth-fixtures.json> --tree <TREE> --out <DIR>');
console.error('   which asks the seam\'s OWN question — does composeSoakRules({ preset: TABLE }) equal the');
console.error('   REAL birth of that preset, on keys, values and key order, in both directions?');
process.exit(2);
