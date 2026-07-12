/**
 * foundryManifest.test.js — W-Session. The Foundry module's manifest shape,
 * file set, journal/page contract, variant chapter-inclusion, the static
 * loader guarantee, and end-to-end zip determinism.
 */
import { describe, it, expect } from 'vitest';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildFoundryModuleFiles } from '../../src/foundry/moduleBuilder.js';
import { buildJournalPages, esc } from '../../src/foundry/journalPages.js';
import { buildZip } from '../../src/foundry/zip.js';

const settlementFixture = (over = {}) => ({
  id: 's_ab12cd34ef567890',
  name: 'Emberhold',
  tier: 'town',
  population: 2400,
  npcs: [
    { name: 'Serah Voss', role: 'Captain', power: 85, plotHooks: ['A midnight muster'] },
    { name: 'Old Tam', role: 'Innkeep', power: 20 },
  ],
  history: { historicalEvents: [{ type: 'fire', title: 'The Ember Fire', yearsAgo: 12 }] },
  ...over,
});

const buildFor = (over = {}, opts = {}) => {
  const settlement = settlementFixture(over);
  const vm = buildViewModel({ settlement, phase: opts.phase || 'canon', eventLog: opts.eventLog || [] });
  return buildFoundryModuleFiles({ settlement, vm, variant: opts.variant || 'canon_dossier', faithUnlocked: !!opts.faithUnlocked });
};

const fileByTail = (files, tail) => files.find(f => f.path.endsWith(tail));

describe('module manifest (module.json)', () => {
  const { moduleId, files } = buildFor();
  const manifest = JSON.parse(fileByTail(files, 'module.json').data);

  it('id is a valid Foundry module id and unique per settlement', () => {
    expect(manifest.id).toBe(moduleId);
    expect(manifest.id).toMatch(/^settlementforge-[a-z0-9-]+$/);
    // the settlement's stable content-id tail keeps two settlements side-by-side
    expect(manifest.id).toMatch(/ef567890$|f567890$|567890$/);
  });

  it('declares v11–v13 compatibility and the loader esmodule', () => {
    expect(manifest.compatibility).toEqual({ minimum: '11', verified: '13' });
    expect(manifest.esmodules).toEqual(['scripts/init.js']);
    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(manifest.title).toContain('Emberhold');
  });
});

describe('module file set', () => {
  const { moduleId, files } = buildFor();

  it('ships manifest, static loader, journal data, manual-import copy, and README — all under the module folder', () => {
    const tails = ['module.json', 'scripts/init.js', 'data/journals.json', 'README.md'];
    for (const tail of tails) expect(fileByTail(files, tail), tail).toBeTruthy();
    expect(files.some(f => /\/data\/[a-z0-9-]+-journal\.json$/.test(f.path))).toBe(true);
    for (const f of files) expect(f.path.startsWith(`${moduleId}/`), f.path).toBe(true);
  });

  it('the loader script is STATIC — byte-identical across different settlements (no content interpolation)', () => {
    const a = fileByTail(buildFor().files, 'scripts/init.js').data;
    const b = fileByTail(buildFor({ name: 'Quiet Vale <script>alert(1)</script>', id: 's_ffff000011112222' }).files, 'scripts/init.js').data;
    expect(a).toBe(b);
  });
});

describe('journal document contract', () => {
  const { files } = buildFor();
  const payload = JSON.parse(fileByTail(files, 'data/journals.json').data);

  it('carries one settlement journal with markdown text pages (format 2)', () => {
    expect(payload.journals).toHaveLength(1);
    const journal = payload.journals[0];
    expect(journal.name).toContain('Emberhold');
    expect(journal.pages.length).toBeGreaterThan(3);
    for (const p of journal.pages) {
      expect(p.type).toBe('text');
      expect(p.text.format).toBe(2);
      expect(typeof p.text.markdown).toBe('string');
      expect(p.text.markdown.length).toBeGreaterThan(0);
    }
    // ascending sort keys keep the page order stable in Foundry's sidebar
    const sorts = journal.pages.map(p => p.sort);
    expect([...sorts].sort((a, b) => a - b)).toEqual(sorts);
  });

  it('flags the journal for the loader idempotency check', () => {
    expect(payload.journals[0].flags?.settlementforge?.moduleId).toBe(JSON.parse(fileByTail(files, 'module.json').data).id);
  });

  it('the manual-import copy is the same journal document', () => {
    const single = JSON.parse(files.find(f => /-journal\.json$/.test(f.path)).data);
    expect(single).toEqual(payload.journals[0]);
  });
});

describe('variant chapter inclusion (shared with the PDF)', () => {
  const settlement = settlementFixture();

  const namesFor = (variant, opts = {}) => {
    const vm = buildViewModel({ settlement, phase: opts.phase || 'canon', eventLog: opts.eventLog || [] });
    return buildJournalPages(vm, { variant }).map(p => p.name);
  };

  it('canon_dossier carries the full page set', () => {
    const names = namesFor('canon_dossier');
    for (const expected of ['Overview', 'NPC Quick Reference', 'Plot Hooks', 'Power & Factions', 'History & Founding']) {
      expect(names).toContain(expected);
    }
    expect(names.filter(n => n.startsWith('NPC — '))).not.toHaveLength(0);
  });

  it('timeline_packet is the lean recap — no NPC / hook / power pages', () => {
    const names = namesFor('timeline_packet', { eventLog: [{ event: { type: 'FIRE', description: 'The mill burns' }, narrativeSummary: 'Smoke over the river ward.' }] });
    expect(names).toContain('Timeline');
    for (const absent of ['NPC Quick Reference', 'Plot Hooks', 'Power & Factions', 'Overview']) {
      expect(names).not.toContain(absent);
    }
  });

  it('draft_brief never carries a Timeline page', () => {
    expect(namesFor('draft_brief')).not.toContain('Timeline');
  });
});

describe('content escaping', () => {
  it('esc() neutralizes raw HTML and markdown metacharacters', () => {
    expect(esc('<img src=x onerror=alert(1)>')).not.toContain('<img');
    expect(esc('a *bold* [link] `tick`')).toBe('a \\*bold\\* \\[link\\] \\`tick\\`');
  });

  it('hostile settlement names cannot smuggle HTML into journal markdown', () => {
    const { files } = buildFor({ name: 'Ember<img src=x onerror=alert(1)>hold' });
    const payload = JSON.parse(fileByTail(files, 'data/journals.json').data);
    // Document/page NAMES are plain-text data (Foundry escapes them in its
    // UI); the MARKDOWN content is what converts to HTML and must be inert.
    for (const page of payload.journals[0].pages) {
      expect(page.text.markdown, page.name).not.toContain('<img');
    }
  });
});

describe('end-to-end zip', () => {
  it('the assembled module zips deterministically', () => {
    const { files } = buildFor();
    const a = buildZip(files);
    const b = buildZip(buildFor().files);
    expect(Buffer.from(a).equals(Buffer.from(b))).toBe(true);
    expect(a[0]).toBe(0x50); // 'P'
    expect(a[1]).toBe(0x4b); // 'K'
  });
});
