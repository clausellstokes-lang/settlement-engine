/**
 * houseDescReader.walker.test.js — SURVEY S-A-4 (the chair's ruling on the independent reader's two findings): ONE READER
 * FOR A HOUSE's DESCRIPTION, AND EVERY CALLER STATES ITS AUDIENCE.
 *   ARM 1. Every call of the one reader (`institutionDescShown(`, `institutionDescription(` with a record,
 *          `<InstitutionCard`, the search's `InstitutionCard` renderer) states its `audience` (`owner` / `reader`); a
 *          caller that states none prints the stored line (the reader fails closed), so a new caller with none is red here.
 *   ARM 2. No print layer reads a house's `.desc` raw: every `.desc` read under src/components, src/pdf, src/foundry,
 *          src/domain/summary and src/utils is in the inventory below, each with why it is not a house's description
 *          printed raw; a new read (a file or a receiver, or one more of a known one) is red until it is justified here.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(__dirname, '../..');
const rel = (f) => relative(ROOT, f).split('\\').join('/');
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : /\.(m?js|jsx)$/.test(n) ? [p] : [];
});

/** The text of a call or a JSX element starting at `at` (balanced parentheses, or up to `/>` / `>`). */
function spanAt(src, at) {
  if (src[at] === '<') { const end = src.indexOf('/>', at); return src.slice(at, end < 0 ? at + 600 : end); }
  let depth = 0;
  for (let k = src.indexOf('(', at); k < src.length && k >= 0; k++) {
    if (src[k] === '(') depth++;
    else if (src[k] === ')' && --depth === 0) return src.slice(at, k + 1);
  }
  return src.slice(at, at + 600);
}

/** The calls that hand on their caller's own `options` (the audience is the caller's, stated where IT is called). */
const PASS_THROUGH = Object.freeze({
  'src/components/new/tabs/InstitutionsTab.jsx': 'institutionDescription(inst, settlement, options) hands its caller\'s options to the leaf',
});

describe('S-A-4: one reader for a house\'s description', () => {
  it('ARM 1: every caller of the reader states its audience', () => {
    const missing = [];
    for (const file of walk(join(ROOT, 'src'))) {
      const r = rel(file);
      if (r === 'src/domain/display/institutionDescShown.js') continue; // the reader itself
      const src = readFileSync(file, 'utf8');
      // `InstitutionCard` is the Institutions tab's card only where the file IS that tab or imports it from there (the
      // popover in primitives/, the catalogue picker and the PDF's own section card are other components of that name,
      // and print no stored description: the PDF's reads the gated view model)
      const theCard = r === 'src/components/new/tabs/InstitutionsTab.jsx' || /import\s*\{[^}]*\bInstitutionCard\b[^}]*\}\s*from\s*'[^']*tabs\/InstitutionsTab\.jsx'/.test(src);
      for (const m of src.matchAll(/institutionDescShown\(|institutionDescription\(|<InstitutionCard\b|Component: InstitutionCard/g)) {
        if (!theCard && /InstitutionCard/.test(m[0])) continue;
        const before = src.slice(Math.max(0, m.index - 9), m.index);
        if (/function\s$/.test(before)) continue; // a definition
        const span = m[0] === 'Component: InstitutionCard' ? src.slice(m.index, m.index + 400) : spanAt(src, m.index);
        if (m[0] === 'institutionDescription(' && !span.includes(',')) continue; // no record: the stored line (the old leaf)
        if (span.includes('audience')) continue;
        if (PASS_THROUGH[r] && /options\)/.test(span)) continue;
        missing.push(`${r}: ${span.slice(0, 90).replace(/\s+/g, ' ')}`);
      }
    }
    expect(missing, 'state the audience: owner (the owner\'s page, the whole-document surfaces) or reader (a shared page)').toEqual([]);
  });

  /** file → receiver → [count, why it is not a house's description printed raw] */
  const INVENTORY = {
    'src/components/ChroniclePanel.jsx': {
      c: [1, 'a conflict of the AI narrative snapshot'], f: [1, 'a power of the AI narrative snapshot'], n: [1, 'an NPC of the snapshot'],
      it: [1, 'a house of a chronicle entry\'s AI narrative snapshot (entry.aiSettlement: the narrative\'s own copy, dated by the entry; not the stored draw)'],
    },
    'src/components/CompendiumPanel.jsx': { LANDING_META: [1, 'page copy'] },
    'src/components/InstitutionalGrid.jsx': { def: [4, 'a catalogue definition (the generator\'s picker)'], instDef: [2, 'a catalogue definition'] },
    'src/components/ServicesTogglePanel.jsx': { d: [1, 'a service definition'], def: [2, 'a service definition'] },
    'src/components/TradeDynamicsPanel.jsx': { g: [1, 'a trade good'], good: [2, 'a trade good'] },
    'src/components/compendium/CatalogTabs.jsx': { a: [2, 'a catalogue entry'], i: [1, 'a catalogue entry (the compendium search)'], inst: [2, 'a catalogue house (the compendium, no town)'], meta: [1, 'page copy'], s: [2, 'a catalogue stress or service'] },
    'src/components/compendium/CustomContent.jsx': { entry: [1, 'a DM\'s custom definition'] },
    'src/components/generate/CharacterPresetCard.jsx': { a: [1, 'a preset'] },
    'src/components/new/dailyLifeLogic.js': { c: [1, 'a Daily Life row'] },
    'src/components/new/npcComponents.jsx': { c: [2, 'an NPC\'s tie or constraint'] },
    'src/components/new/serviceComponents.jsx': { svc: [1, 'a service row'] },
    'src/components/new/tabs/DefenseTab.jsx': { ct: [1, 'a crime type'], i: [2, 'a force card\'s house: the presence test and the margin; the line prints through institutionDescShown'] },
    'src/components/new/tabs/EconomicsTab.jsx': { r: [1, 'a revenue row'] },
    'src/components/new/tabs/InstitutionsTab.jsx': { inst: [3, 'the reader\'s own fallback (no record) and the card\'s presence tests; the line prints through institutionDescShown'] },
    'src/components/new/tabs/ServicesTab.jsx': { svc: [2, 'a service row'] },
    'src/components/new/tabs/power/PowerStrata.jsx': { f: [3, 'a power'] },
    'src/components/settlement/CatalogPicker.jsx': { i: [1, 'a catalogue entry'], item: [2, 'a catalogue entry'] },
    'src/components/settlement/SystemStateBar.jsx': { meta: [1, 'page copy'] },
    'src/domain/summary/settlementQuickGuide.js': { conflict: [1, 'a conflict'] },
    'src/foundry/journalPages.js': { f: [2, 'a power'] },
    'src/pdf/lib/viewModel.js': { f: [1, 'a power'], q: [2, 'a quarter'] },
    'src/pdf/lib/viewModelBodySlices.js': { inst: [1, 'a house of the record the export hands the worker, already gated (printRecord.js)'] },
    'src/pdf/sections/DefenseSecurity.jsx': { force: [2, 'a defence copy of a house in the view model of the gated record (printRecord.js gates the copies)'] },
    'src/pdf/sections/EconomicsTrade.jsx': { r: [1, 'a revenue row'] },
    'src/pdf/sections/Institutions.jsx': { svc: [1, 'a service row'] },
    'src/pdf/sections/SystemStateSnapshot.jsx': { meta: [1, 'page copy'] },
  };

  it('ARM 2: every .desc read in the print layers is in the inventory, at its count', () => {
    const live = {};
    for (const dir of ['src/components', 'src/pdf', 'src/foundry', 'src/domain/summary', 'src/utils']) {
      for (const file of walk(join(ROOT, dir))) {
        for (const m of readFileSync(file, 'utf8').matchAll(/([A-Za-z_]+)\??\.desc\b/g)) {
          const r = rel(file);
          (live[r] ||= {})[m[1]] = ((live[r] || {})[m[1]] || 0) + 1;
        }
      }
    }
    const unexplained = [];
    for (const [r, recv] of Object.entries(live)) {
      for (const [name, n] of Object.entries(recv)) {
        const row = INVENTORY[r]?.[name];
        if (!row || n > row[0]) unexplained.push(`${r} :: ${name}.desc x${n}${row ? ` (inventory ${row[0]})` : ''}`);
      }
    }
    expect(unexplained, 'a house\'s description prints through institutionDescShown with its audience; justify any other read here').toEqual([]);
  });
});
