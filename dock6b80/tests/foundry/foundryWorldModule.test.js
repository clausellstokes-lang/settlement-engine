/**
 * foundryWorldModule.test.js — Vision V-11 THE FOUNDRY BRIDGE, the standalone
 * foundry-module/ package (the world importer). Proves the pure builder maps a
 * real world export to well-formed Foundry journal documents for BOTH variants,
 * that hostile content cannot inject markup, that the entry wires a read-only
 * import, and that the package's validate script is wired into `npm run check`.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildJournalDocuments, esc, worldFolderName, MODULE_ID } from '../../foundry-module/scripts/build-journals.js';
import { buildWorldExport } from '../../src/lib/worldExport.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');

const world = () => ({
  name: 'Saltmoor Reach',
  seed: 'realm-seed-xyz',
  settlements: [
    {
      id: 'save-1', name: 'Saltmoor',
      settlement: {
        id: 's_ab12cd34ef567890', name: 'Saltmoor', tier: 'town', population: 1200,
        thesis: 'A toll town on the ford.',
        // ENGINE-TRUTHFUL HOOK SHAPE. `settlement.plotHooks` is never written by
        // the pipeline; settlement-scope hooks live on economicViability (objects
        // keyed `hook`) and per history event (bare strings) — see
        // src/generators/aiLayer.js, which merges exactly these two surfaces. The
        // fixture deliberately carries NO top-level plotHooks so the page can only
        // render if the builder reads the real surfaces.
        economicViability: {
          plotHooks: [{ category: 'trade', hook: 'The toll ledger keeps a second set of numbers.', severity: 'high' }],
        },
        history: {
          historicalEvents: [
            { type: 'economic', yearsAgo: 12, anchored: true, plotHooks: ['A flood-year debt still binds the ford families.'] },
          ],
        },
        powerStructure: { factions: [{ faction: 'The River Guild', desc: 'Toll-keepers.' }] },
        npcs: [{ id: 'npc.varn', name: 'Lord Varn', role: 'ruler', secret: { what: 'took a bribe' }, goal: { short: 'hold the bridge' } }],
      },
    },
  ],
  worldState: { tick: 12, calendar: { year: 2, season: 'spring', month: 4, elapsedMonths: 3 } },
  regionalGraph: { channels: [] },
});

describe('foundry-module — buildJournalDocuments (DM variant)', () => {
  const data = buildWorldExport(world(), { variant: 'dm', generatedAt: 'x' });
  const docs = buildJournalDocuments(data);

  it('produces a realm index journal + one per settlement, all flagged for the module', () => {
    expect(docs.length).toBe(2);
    expect(docs[0].name).toContain('Realm');
    expect(docs[1].name).toContain('Saltmoor');
    for (const d of docs) expect(d.flags.settlementforge.moduleId).toBe(MODULE_ID);
  });

  it('every page is a text/markdown page with an ascending sort key', () => {
    for (const d of docs) {
      const sorts = d.pages.map((p) => p.sort);
      expect([...sorts].sort((a, b) => a - b)).toEqual(sorts);
      for (const p of d.pages) {
        expect(p.type).toBe('text');
        expect(p.text.format).toBe(2);
        expect(typeof p.text.markdown).toBe('string');
      }
    }
  });

  it('the DM variant renders the plot hooks + NPC secret it carries', () => {
    const dossier = docs[1];
    const names = dossier.pages.map((p) => p.name);
    expect(names).toContain('Plot Hooks');
    const md = dossier.pages.map((p) => p.text.markdown).join('\n');
    expect(md).toContain('took a bribe');
    expect(md).toContain('hold the bridge');
  });

  it('the hooks page reads the surfaces the ENGINE writes, not a fabricated field', () => {
    // The exported dossier must NOT carry a top-level plotHooks key — if it did,
    // this suite would be certifying a shape the pipeline never produces (the
    // fabricated-fixture hazard the page shipped with).
    const exported = data.settlements[0].dossier;
    expect(exported.plotHooks).toBeUndefined();
    expect(exported.economicViability.plotHooks).toHaveLength(1);
    expect(exported.history.historicalEvents[0].plotHooks).toHaveLength(1);

    // Both real surfaces reach the page, economics first then history — the
    // aiLayer merge order. An object hook is read through its `hook` key.
    const hooksPage = docs[1].pages.find((p) => p.name === 'Plot Hooks');
    expect(hooksPage.text.markdown).toContain('The toll ledger keeps a second set of numbers.');
    expect(hooksPage.text.markdown).toContain('A flood-year debt still binds the ford families.');
    expect(hooksPage.text.markdown).not.toContain('[object Object]');
    expect(hooksPage.text.markdown.indexOf('toll ledger'))
      .toBeLessThan(hooksPage.text.markdown.indexOf('flood-year'));
  });
});

describe('foundry-module — buildJournalDocuments (player variant leaks nothing)', () => {
  const data = buildWorldExport(world(), { variant: 'player', generatedAt: 'x' });
  const docs = buildJournalDocuments(data);
  const allMarkdown = docs.flatMap((d) => d.pages).map((p) => p.text.markdown).join('\n');

  it('carries NO plot hooks page and NO NPC secret (the export stripped them)', () => {
    const dossier = docs.find((d) => d.name.includes('Saltmoor'));
    expect(dossier.pages.map((p) => p.name)).not.toContain('Plot Hooks');
    expect(allMarkdown).not.toContain('took a bribe');
    expect(allMarkdown).not.toContain('hold the bridge');
    // …including hooks off the REAL surfaces: toPublicSafe's recursive denylist
    // drops every *hook key, so neither economics nor history hooks survive.
    expect(allMarkdown).not.toContain('second set of numbers');
    expect(allMarkdown).not.toContain('flood-year debt');
  });

  it('still renders the public settlement (not vacuous)', () => {
    expect(allMarkdown).toContain('Saltmoor');
    expect(allMarkdown).toContain('The River Guild');
    expect(worldFolderName(data)).toBe('SettlementForge — Saltmoor Reach');
  });
});

describe('foundry-module — safety', () => {
  it('esc neutralizes HTML and markdown metacharacters', () => {
    expect(esc('<img src=x onerror=alert(1)>')).not.toContain('<img');
    expect(esc('a *bold* [link] `tick`')).toBe('a \\*bold\\* \\[link\\] \\`tick\\`');
  });

  it('esc does not double-encode an apostrophe (the &#39; # is not re-escaped)', () => {
    // Regression pin: markdown-escape runs BEFORE HTML-entity encoding, so the
    // `#` inside &#39; is left intact instead of becoming &\#39; (a double-encode
    // that mangled the stored journals.json). A literal `#` is STILL escaped once
    // (the heading-injection guard survives the reorder).
    expect(esc("O'Brien")).toBe('O&#39;Brien');
    expect(esc('# not a heading')).toBe('\\# not a heading');
    expect(esc('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('a hostile settlement name cannot inject markup into a journal page', () => {
    const hostile = world();
    hostile.settlements[0].settlement.name = 'Ember<img src=x onerror=alert(1)>hold';
    hostile.settlements[0].name = 'Ember<img src=x onerror=alert(1)>hold';
    const docs = buildJournalDocuments(buildWorldExport(hostile, { variant: 'player' }));
    for (const d of docs) for (const p of d.pages) expect(p.text.markdown).not.toContain('<img');
  });

  it('rejects a payload that is not a SettlementForge world export', () => {
    expect(() => buildJournalDocuments({ format: 'something-else' })).toThrow(/world export/i);
    expect(() => buildJournalDocuments(null)).toThrow();
  });
});

describe('foundry-module — wiring', () => {
  it('the entry imports the pure builder and creates journals read-only (no world writes, no eval)', () => {
    const src = read('foundry-module/scripts/sf-world-import.js');
    expect(src).toMatch(/from ['"]\.\/build-journals\.js['"]/);
    expect(src).toMatch(/JournalEntry\.createDocuments/);
    expect(src).not.toMatch(/\beval\s*\(/);
    expect(src).not.toMatch(/\bnew\s+Function\s*\(/);
  });

  it('validate:foundry-module is wired into `npm run check`', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.scripts['validate:foundry-module']).toBeTruthy();
    expect(pkg.scripts.check).toContain('validate:foundry-module');
  });
});
