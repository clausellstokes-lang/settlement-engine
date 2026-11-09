/**
 * tests/pdf/whoRunsThisTownDm.test.jsx — THE DM VIEW in the PDF, and only there (the allegiance train,
 * car 3, ALLEGIANCE-CAR3, 2026-11-08; design §9; the W7 receipt ruling: never the Foundry journal).
 *
 *   - the view model carries `dm` (dmPowerViewOf over the canonical save) only when the caller asks for
 *     the DM layer; by default it carries no `dm` key at all (the golden view-model snapshot and the
 *     Foundry export byte-identical);
 *   - SettlementPDF asks for it (the DM's own dossier) and the Power Structure chapter mounts the section;
 *   - the Foundry journal, built the way the export builds it, carries none of the DM rows' strings.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildFoundryModuleFiles } from '../../src/foundry/moduleBuilder.js';
import { dmPowerViewOf } from '../../src/domain/people/patronage.js';

let s;
beforeAll(async () => { await ensureLaws(); s = birth(785).settlement; });

describe('the DM view in the PDF, never the Foundry journal', () => {
  it('the view model carries `dm` only on the DM layer', () => {
    expect(Object.hasOwn(buildViewModel({ settlement: s }), 'dm')).toBe(false);
    const vm = buildViewModel({ settlement: s, dmView: true });
    expect(vm.dm).toEqual(dmPowerViewOf(s));
    expect(vm.dm?.boosts.some((b) => b.hidden)).toBe(true);
  });

  it('SettlementPDF asks for the DM layer and Power Structure mounts the section', () => {
    expect(readFileSync('src/pdf/SettlementPDF.jsx', 'utf8')).toMatch(/dmView: true/);
    expect(readFileSync('src/pdf/sections/PowerStructure.jsx', 'utf8')).toMatch(/<WhoRunsThisTown dm=\{vm\?\.dm\} \/>/);
  });

  it('the Foundry journal carries none of the DM rows', () => {
    const view = dmPowerViewOf(s);
    const secrets = [
      ...view.boosts.map((b) => b.line),
      ...view.rulingThree.filter((f) => f.answersTo).map((f) => `answers to ${f.answersTo.guild}`),
      'Who really runs this town',
    ];
    const vm = buildViewModel({ settlement: s });
    const text = JSON.stringify(buildFoundryModuleFiles({ settlement: s, vm }).files.map((f) => String(f.data)));
    for (const x of secrets) expect(text, x).not.toContain(x);
    // the control: the strings the scan looks for are real (the DM view of the same town holds them)
    expect(JSON.stringify(view)).toContain(secrets[0]);
  });
});
