/**
 * finalLinesPrintGate.walker.test.js — SURVEY S-A-2 (the chair's ruling: THE WORKER CARRIES NO TABLE).
 *
 * The stored descriptions and hooks are re-answered on the final record ONCE, on the caller's thread, where the
 * tables already live (`domain/display/printRecord.js :: printRecordOf`), and the PDF worker and the Foundry module
 * are handed the gated record: they print what they are given and carry no table.
 *   ARM 1. The static closures of the PDF worker, the Foundry module, the campaign book and the world book reach none of the description and hook
 *          tables nor the S-A leaves (the repository's one import walker, `tests/helpers/routeClosure.js`).
 *   ARM 2. EVERY importer of `buildViewModel`, `SettlementPDF` or the campaign book outside `src/pdf/**` is one this file names, and each
 *          gates: it calls `printRecordOf(` itself, or (the Foundry module, which may not reach the tables) every
 *          file that imports IT calls `printRecordOf(`. A new importer is red until it is named here and gates.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { FOLLOW_ALL, FOLLOW_STATIC, chainTo, importClosure, moduleSpecifiers, resolveRelative } from '../helpers/routeClosure.js';

const ROOT = resolve(__dirname, '../..');
const rel = (f) => relative(ROOT, f).split('\\').join('/');
const BANNED = [
  'src/data/institutionDescVariants.js', 'src/data/historyData.js', 'src/data/historyDescVariants.js', 'src/data/npcData.js',
  'src/domain/display/institutionDescShown.js', 'src/domain/dossier/storedHookShown.js', 'src/domain/facts/lineOnFinal.js',
  'src/domain/display/printRecord.js',
];
const ENTRIES = ['src/utils/pdfRender.worker.js', 'src/foundry/generateFoundryModule.js', 'src/utils/generateCampaignPDF.js', 'src/utils/generateWorldBook.js'];
const PRINT_DOORS = ['src/pdf/lib/viewModel.js', 'src/pdf/SettlementPDF.jsx', 'src/utils/generateCampaignPDF.js', 'src/utils/generateWorldBook.js'];
/** every importer the gate knows, and how it gates */
const KNOWN = Object.freeze({
  'src/utils/generateSettlementPDF.js': 'gates', // the export: worker props and the main-thread fallback
  'src/utils/pdfRender.worker.js': 'handed', // renders the props the export gated
  'src/foundry/generateFoundryModule.js': 'gated by its importers', // may not reach the tables (ARM 1)
  'src/components/settlements/CampaignFolder.jsx': 'gates', // the campaign book's one caller: each save gated
  'src/utils/generateWorldBook.js': 'gated by its importers', // the world book: handed each save gated by its caller
});

const srcFiles = (dir = join(ROOT, 'src')) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? srcFiles(p) : /\.(m?js|jsx)$/.test(n) ? [p] : [];
});
const importsOf = (file, follow) => moduleSpecifiers(readFileSync(file, 'utf8'), follow).map((s) => resolveRelative(file, s)).filter(Boolean).map(rel);

describe('S-A-2: the PDF worker and Foundry carry no table', () => {
  for (const entry of ENTRIES) {
    it(`ARM 1: ${entry}'s static closure reaches none of the tables or the S-A leaves`, () => {
      const { seen, parent } = importClosure([join(ROOT, entry)], FOLLOW_STATIC);
      const hit = [...seen].map(rel).filter((f) => BANNED.includes(f));
      expect(hit.map((f) => chainTo(parent, join(ROOT, f), ROOT)), 'gate on the caller\'s thread (printRecordOf); the worker prints what it is handed').toEqual([]);
    });
  }

  it('ARM 2: every importer of buildViewModel / SettlementPDF outside src/pdf is named and gates', () => {
    const files = srcFiles().map((f) => ({ f, r: rel(f) })).filter(({ r }) => !r.startsWith('src/pdf/'));
    const importers = files.filter(({ f }) => importsOf(f, FOLLOW_ALL).some((d) => PRINT_DOORS.includes(d))).map(({ r }) => r);
    expect(importers.filter((r) => !(r in KNOWN)), 'a new importer: name it in KNOWN and gate it').toEqual([]);
    const text = (r) => readFileSync(join(ROOT, r), 'utf8');
    const failures = [];
    for (const r of importers) {
      if (KNOWN[r] === 'gates' && !text(r).includes('printRecordOf(')) failures.push(`${r}: does not call printRecordOf(`);
      if (KNOWN[r] === 'gated by its importers') {
        const by = files.filter(({ f }) => importsOf(f, FOLLOW_ALL).includes(r)).map(({ r: x }) => x);
        expect(by.length, `${r} has importers`).toBeGreaterThan(0);
        for (const x of by) if (!text(x).includes('printRecordOf(')) failures.push(`${x} (imports ${r}): does not call printRecordOf(`);
      }
    }
    expect(failures).toEqual([]);
  });
});
