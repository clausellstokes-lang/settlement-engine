/**
 * outlookIssuesSayTheWorld.test.js — UPKEEP-9, step 7 (2026-11-14): viability.js's rows, the Outlook's issues
 * (`economicViability.warnings`, printed on the Outlook tab and the PDF). The round-three cut's #576 ("Military
 * slider is high …"), #823 #824 #825 (the bank row: "the economy priority is very low", "Banks cannot operate
 * without a merchant class" beside merchant guilds, "Raise Economy priority …"), the increment's #ww-522 ("Town
 * remains viable through local foodshed, reserves, seasonal access, patronage (57/52 capacity)." beside
 * "Not viable", under a siege), and round two B's "Add a tier-plausible hedge practitioner or alchemical
 * workshop". RULED: the page shows the ratings, never the machinery (no slider, priority or capacity figure);
 * a line that names a house reads the roster; a line that cannot be made true is not written.
 * THE GUARDS are the readers' own towns, born in their shape. THE LAW runs over births with the dial at its
 * extreme, of the sizes and crises the lines print under. Red at 33acecd6d.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** The readers' shapes: rr2s-<size>-<crisis|calm>-<rand|port>-<i>, rww-<size>-<crisis|calm>-<i>. */
const readerCfg = (seed) => {
  const m = /^(rr2s|rww)-(\w+?)-([a-z_+]+?)(?:-(rand|port))?-(\d+)$/.exec(seed);
  if (!m) throw new Error(`seed shape ${seed}`);
  return birthConfig({ ...DEFAULT_CONFIG, ...(m[4] === 'port' ? { tradeRouteAccess: 'port' } : {}), settType: m[2],
    selectedStressesRandom: false, selectedStresses: m[3] === 'calm' ? [] : m[3].split('+'), _randomizePriorities: true });
};
const born = (cfg, seed) => generateSettlementPipeline(cfg, null, { seed, customContent: {} });
/** Every printed field of every Outlook row. */
const rowsOf = (s) => ['issues', 'warnings', 'dependencies', 'suggestions'].flatMap((k) => s.economicViability?.[k] || []);
const textsOf = (row) => [row.title, row.description, row.impact, row.priorityNote, ...(row.suggestedFixes || [])].filter((t) => typeof t === 'string');
const MACHINERY = /\bslider\b|\bpriority\b|\d+\s*\/\s*\d+|tier-plausible/i;
const machineryIn = (s) => rowsOf(s).flatMap(textsOf).filter((t) => MACHINERY.test(t));

describe('the readers\' towns: the Outlook names no machinery, and its rows are true', () => {
  test('#576 rr2s-town-plague_onset-rand-1: the town set on arms, no slider', () => {
    const s = born(readerCfg('rr2s-town-plague_onset-rand-1'), 'rr2s-town-plague_onset-rand-1');
    expect(machineryIn(s)).toEqual([]);
    expect(rowsOf(s).map((r) => r.description)).toContain('The town is set on arms, but it has no walls, garrison, or barracks.');
  });

  test('#823 #824 #825 rr2s-city-famine-rand-1: the bank row, no priority, no denial of its merchants', () => {
    const s = born(readerCfg('rr2s-city-famine-rand-1'), 'rr2s-city-famine-rand-1');
    expect((s.institutions || []).some((i) => /merchant guild/i.test(String(i.name)))).toBe(true);
    expect(machineryIn(s)).toEqual([]);
    const bank = rowsOf(s).find((r) => r.title === 'Banking Without Economic Focus');
    expect(bank?.description).toBe('Banks stand here, but the city does little trade.');
    expect(bank?.suggestedFixes).toEqual(['Give the city more trade, or remove the banks']);
    expect(bank?.impact).toBe('Its banks find little business to do.');
  });

  test('the hedge suggestion, rr2s-thorp-calm-port-1: a thorp is offered no house its catalogue cannot hold', () => {
    const s = born(readerCfg('rr2s-thorp-calm-port-1'), 'rr2s-thorp-calm-port-1');
    expect(machineryIn(s)).toEqual([]);
    const magic = rowsOf(s).find((r) => r.title === 'Strong Magic: Informal Practice');
    expect(magic?.suggestedFixes).toEqual([]);
  });

  test('#ww-522 rww-town-under_siege-1: no capacity figure, and no "remains viable" beside a siege', () => {
    const s = born(readerCfg('rww-town-under_siege-1'), 'rww-town-under_siege-1');
    expect(machineryIn(s)).toEqual([]);
    expect(rowsOf(s).some((r) => r.title === 'Locally Sustained Isolation')).toBe(false);
  });
});

describe('THE LAW: births with the dial at its extreme, small to large, calm and in crisis', () => {
  const DIALS = [['priorityMilitary', 100], ['priorityMagic', 100], ['priorityEconomy', 0]];
  const SIZES = ['thorp', 'village', 'town', 'city'];
  const CRISES = [[], ['under_siege'], ['famine']];

  test('no Outlook row names a slider, a priority, a capacity figure or "tier-plausible"; "no arcane house" reads the roster', () => {
    const failures = [];
    let printed = 0;
    for (const [key, value] of DIALS) for (const size of SIZES) for (const crisis of CRISES) for (let i = 0; i < 3; i += 1) {
      const seed = `v9-law-${key}-${size}-${crisis[0] || 'calm'}-${i}`;
      const s = born(birthConfig({ ...DEFAULT_CONFIG, settType: size, [key]: value, selectedStresses: crisis, selectedStressesRandom: false }), seed);
      for (const t of machineryIn(s)) failures.push(`${seed}: ${t}`);
      const names = (s.institutions || []).map((n) => String(n.name).toLowerCase());
      if (rowsOf(s).some((r) => r.title === 'Strong Magic Without Arcane Houses')) {
        printed += 1;
        const house = names.find((n) => /teleport|scroll scribe|academy of magic|wizard|mage|enchant|alchemist/.test(n));
        if (house) failures.push(`${seed}: "no arcane house stands" beside ${house}`);
      }
    }
    expect(failures).toEqual([]);
    expect(printed, 'the arcane-house row must print somewhere in the law\'s births').toBeGreaterThan(0);
  });

  test('a besieged or failing isolated town is never told it "remains viable"', () => {
    const failures = [];
    for (const size of ['town', 'city']) for (const crisis of [['under_siege'], ['famine'], []]) for (let i = 0; i < 4; i += 1) {
      const seed = `v9-iso-${size}-${crisis[0] || 'calm'}-${i}`;
      const s = born(birthConfig({ ...DEFAULT_CONFIG, settType: size, tradeRouteAccess: 'isolated', selectedStresses: crisis, selectedStressesRandom: false }), seed);
      const viable = rowsOf(s).some((r) => r.title === 'Locally Sustained Isolation');
      if (viable && (s.economicViability?.viable === false || (s.config?.stressTypes || []).includes('under_siege'))) failures.push(seed);
    }
    expect(failures).toEqual([]);
  });
});
