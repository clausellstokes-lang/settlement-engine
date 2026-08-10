/**
 * tests/helpers/bandSaturation.js — the fixture-saturation guard
 * (epistemic prevention; F-SURVEY-1 amendment M4, band-top fixture saturation).
 *
 * THE CLASS, NAMED BY THE ES-3 REPAIR ROUND AND BANKED AGAIN BY ES-4: a fixture whose
 * value already sits at the TOP of its ladder makes every cap, equality and "it rose"
 * assertion measured against it VACUOUS. Both sides of the comparison clamp, so the pin
 * holds for the correct implementation and for the very defect it excludes, and it does
 * so silently. It is not a hypothetical in this estate — it has shipped twice:
 *
 *   ES-3 (`tests/domain/espionageProducts.test.js`) — `reconcileBelief` CLAMPS
 *     `confidence01` at 1.0, and on the file's original 0.7 prior a single report already
 *     saturated it. MEASURED across eleven priors: the honest one-report fold and a
 *     nine-report echo chamber BOTH landed exactly 1.0 from prior 0.5 upward, so the
 *     wave's central claim held under the echo chamber it existed to refuse.
 *   ES-4 (`tests/domain/espionageDistantSourceEs4.test.js`) — the spy-fed row's supply
 *     rungs land `storesBand: 'deep'` and `routeBand: 'established'`, each the LAST rung
 *     of its ladder, so a rung derivation that OVERSHOOTS clamps back onto the expected
 *     word and every equality stays green.
 *
 * THE GUARD: state the fixture's headroom as an assertion instead of hoping for it. A
 * rung handed to `expectRungBelowBandTop` must sit STRICTLY BELOW its ladder's top rung,
 * so a later tuning change that saturates the fixture reds HERE, by name, instead of
 * quietly emptying the pins around it.
 *
 * ── THE DECLARATION, AND WHY IT IS A CLAIM RATHER THAN A MUTE BUTTON ────────────────
 * Some fixtures legitimately sit at a band top (ES-4's do — the far holding is deliberately
 * rich, and moving it down a rung would move the differential the whole wave rests on). A
 * test declares those in its OWN NAME, listing the labels after the token:
 *
 *   it('… — AT THE BAND TOP: storesBand, routeBand', () => { … });
 *
 * A declared label INVERTS the guard: the rung must then BE the top, exactly. So the
 * declaration cannot license a below-top rung, and a declared fixture that later drops off
 * its ceiling reds too — the EXACT-ledger idiom this estate uses for declared overruns,
 * applied to fixtures. The saturation stops being a residual buried in a queue row and
 * becomes a sentence in the test's own title that a machine checks in both directions.
 *
 * ⚠ MEMBERSHIP IS CHECKED FIRST, and it is not decoration: `ladder.indexOf(typo)` is -1,
 * and -1 is strictly below every top, so a mis-spelled rung would satisfy the guard
 * vacuously — the very shape this file exists to refuse, one level up.
 *
 * A CLAMPED SCALAR is the same shape with a one-value top, so `ladder` may also be the
 * NUMBER the quantity clamps at (ES-3's `confidence01` clamps at 1).
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its suites
 * in every importer — see tests/helpers/dormancyOracle.js for the incident).
 */
import { expect } from 'vitest';

/** The token a test's own NAME carries to declare which rungs sit at their band top. */
export const TOP_RUNG_DECLARATION = 'AT THE BAND TOP:';

/** Labels the CURRENT test's name declares as sitting at their band top. */
function declaredTopRungs() {
  const name = String(expect.getState().currentTestName ?? '');
  const at = name.lastIndexOf(TOP_RUNG_DECLARATION);
  if (at < 0) return [];
  return name.slice(at + TOP_RUNG_DECLARATION.length)
    .split(',')
    .map((word) => word.trim())
    .filter((word) => /^[A-Za-z][A-Za-z0-9_]*$/.test(word));
}

/**
 * Assert a fixture value sits STRICTLY BELOW the top of its band — unless the running
 * test's name declares `label` at the band top, in which case assert it sits EXACTLY there.
 *
 * @param {string|number} rung  the fixture's value
 * @param {readonly string[]|number} ladder  the ascending rung words, or the numeric clamp
 * @param {string} label  the slot's name, as it would be written in a declaration
 */
export function expectRungBelowBandTop(rung, ladder, label) {
  const declared = declaredTopRungs().includes(label);

  if (typeof ladder === 'number') {
    expect(
      Number.isFinite(rung),
      `${label}: ${String(rung)} is not a finite number, so it cannot be compared against`
      + ` the clamp ${ladder} — a non-number satisfies neither side of this guard honestly`,
    ).toBe(true);
    if (declared) {
      expect(
        rung,
        `${label}: the test NAME declares this value sits AT its clamp (${ladder}) and it does`
        + ' not. A declaration is a CLAIM, not a licence — delete it, or restore the fixture.',
      ).toBe(ladder);
      return;
    }
    expect(
      rung,
      `${label}: the fixture sits AT its clamp (${ladder}), so every equality and "it rose"`
      + ' assertion measured against it is SATURATED and would hold under an implementation'
      + ' that overshoots. Give the arithmetic room to move, or declare it in the test NAME:'
      + ` "… ${TOP_RUNG_DECLARATION} ${label}".`,
    ).toBeLessThan(ladder);
    return;
  }

  const index = ladder.indexOf(/** @type {string} */ (rung));
  expect(
    index,
    `${label}: '${String(rung)}' is not a rung of [${ladder.join(', ')}] — a word the ladder`
    + ' does not carry indexes to -1, which is strictly below every top and would satisfy'
    + ' this guard vacuously. Fix the spelling or pass the ladder the fixture actually uses.',
  ).toBeGreaterThan(-1);

  const top = ladder.length - 1;
  if (declared) {
    expect(
      index,
      `${label}: the test NAME declares '${ladder[top]}' at the band top and the fixture now`
      + ` reads '${String(rung)}' (rung ${index} of ${ladder.length}). A declaration is a CLAIM,`
      + ' not a licence — the fixture came off its ceiling, so drop the label from the title'
      + ' and let the live guard below do the work.',
    ).toBe(top);
    return;
  }
  expect(
    index,
    `${label}: the fixture sits on the TOP rung ('${String(rung)}' of ${ladder.length}), so every`
    + ' cap and equality measured against it is SATURATED — a derivation that OVERSHOOTS clamps'
    + ' back onto the expected word and the pins stay green. Move the fixture down a rung, or'
    + ` declare it in the test NAME: "… ${TOP_RUNG_DECLARATION} ${label}".`,
  ).toBeLessThan(top);
}
