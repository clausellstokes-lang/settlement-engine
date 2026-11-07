/**
 * tests/scripts/landingStageMeasure.test.js — THE STAGE DRIVER'S `measure` READS ALL FIVE MOVED SURFACES.
 *
 * GOLDEN-REHEARSAL 2026-11-07 finding 2: `scripts/audit/landing-stage.sh measure` read 3 of the 5 surfaces the people
 * car moves (the 525, the herald desk, the fence) and the rehearsal measured the prose manifest, the witness and the
 * PDF snapshot by hand. The landing applied the rehearsal's proposed diff. This arm reads the live `measure` block and
 * counts the surfaces it measures; the planted control is the pre-landing block's three calls, which must count three.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const SURFACE_READERS = {
  'generator master (525)': /golden-master-stage\.mjs/,
  'herald desk': /herald-stage\.mjs/,
  'espionage fence': /refence\.mjs/,
  'prose manifest': /prose-manifest-cells\.mjs --out/,
  'PDF view-model snapshot': /goldenViewModel\.test\.js --update/,
};
const WITNESS = /witness-stage\.mjs/;

const surfacesRead = (block) => Object.entries(SURFACE_READERS).filter(([, re]) => re.test(block)).map(([name]) => name);

function measureBlock(text) {
  const from = text.indexOf('  measure)\n');
  const to = text.indexOf('  suites)\n');
  if (from === -1 || to === -1) throw new Error('landing-stage.sh carries no measure)/suites) arms');
  return text.slice(from, to);
}

describe('landing-stage.sh measure', () => {
  test('the planted control: the pre-landing measure block reads three surfaces, not five', () => {
    const before = [
      '  measure)',
      '    node "$here/scripts/audit/golden-master-stage.mjs" "$stage" --out "$out/gm.json"',
      '    node "$here/scripts/audit/herald-stage.mjs" "$stage" --out "$out/herald.json"',
      '    node "$here/scripts/audit/refence.mjs" "$stage" --rows-out "$out/fence.tsv"',
    ].join('\n');
    expect(surfacesRead(before)).toEqual(['generator master (525)', 'herald desk', 'espionage fence']);
  });

  test('the live block reads all five moved surfaces, the witness beside them, and chains stage to stage', () => {
    const block = measureBlock(readFileSync('scripts/audit/landing-stage.sh', 'utf8'));
    expect(surfacesRead(block)).toEqual(Object.keys(SURFACE_READERS));
    expect(WITNESS.test(block), 'the preset lighting witness is measured too').toBe(true);
    expect(/stage-chain\.mjs/.test(block), 'with a previous stage, every surface is compared stage to stage').toBe(true);
    expect(/\$prev\/gm\.json/.test(block), 'the 525 compares against the PREVIOUS stage, not the committed fixture').toBe(true);
  });
});
