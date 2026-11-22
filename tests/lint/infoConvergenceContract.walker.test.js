/**
 * infoConvergenceContract.walker.test.js — FP IN-6 U5, THE ENVELOPES CROSS-CHECKED
 * (src/domain/certification/infoConvergenceContract.js; DESIGN_FP_INFORMATION.md §5 IN-6: "the
 * envelope list above cross-checks mechanically against every Endings block in §5 (no promised
 * envelope may go unauthored again)" and "envelope negative controls mutate a tuning constant and
 * the envelope REDS").
 *
 * EIGHT ARMS, each executed against the tree or the volume, never against a copied list:
 *   ENDINGS     every `**Endings entries:**` block of the volume is parsed; its token groups per
 *               wave equal the registry's, both directions; the two endingless blocks resolve as
 *               the volume rules them (IN-0d to the toll incidence, IN-1 to none).
 *   THE LIST    every envelope's name stands EXACTLY ONCE in the volume's IN-6 envelope list, and
 *               the list's brace groups equal the registry's mix groups.
 *   TOTALITY    every volume token is exactly one ending's volumeToken; availability is closed;
 *               an OWED ending names its wave and carries no producer, every other one does.
 *   PRODUCERS   every producer address resolves to a live export carrying its literal, and every
 *               receipt is a registered kind or a brokerage act.
 *   TRIPWIRE    no OWED token is spelled as a literal in the information modules; the same scan
 *               finds a built token (guard-the-guard), so the deferral cannot ghost.
 *   BANDS       every envelope has its own raw band, shares within zero to one, and none of them
 *               sits among the owner-ratified soak bands.
 *   MUTANTS     every envelope PASSES a fixture under its band and REDS when one tuning constant
 *               moves (a mutated copy of the table, executed here).
 *   TODAY       with the measured availability, which envelopes can grade a receipt and which
 *               answer NOT_EXECUTABLE, pinned so the day a producer lands flips it loudly.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, test } from 'vitest';

import {
  INFO_CONVERGENCE_TUNING,
  INFO_ENDING_AVAILABILITY,
  INFO_ENVELOPES,
  INFO_ENVELOPE_VERDICTS,
  evaluateInfoConvergence,
  evaluateInfoEnvelope,
} from '../../src/domain/certification/infoConvergenceContract.js';
import { EXACT_SECTION } from '../../src/domain/realm/heraldRouting.js';
import { INFORMATION_KIND_REGISTRY } from '../../src/domain/worldPulse/informationNews.js';
import { BROKERAGE_ACTS } from '../../src/domain/worldPulse/brokerageServicesRules.js';
import { RATIFIED_SOAK_BANDS } from '../../src/domain/tuning/proposedSoakBands.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const VOLUME = readFileSync(join(ROOT, 'docs/DESIGN_FP_INFORMATION.md'), 'utf8');
const LINES = VOLUME.split('\n');
const squash = (text) => text.replace(/\s+/g, ' ').trim();
const byId = new Map(INFO_ENVELOPES.map((row) => [row.id, row]));
const tokenSet = (tokens) => [...tokens].sort().join(',');

/** The block a `- **Label**` bullet opens, to the next bullet or heading. */
function bulletBlock(startLine) {
  const out = [LINES[startLine]];
  for (let i = startLine + 1; i < LINES.length && !/^(- \*\*|#{2,4} |\*\*IN-)/.test(LINES[i]); i += 1) out.push(LINES[i]);
  return squash(out.join('\n'));
}

/** The wave a line sits in: the nearest preceding `### IN-n` heading or `**IN-0x —` slice opener. */
function waveAt(line) {
  for (let i = line; i >= 0; i -= 1) {
    const slice = LINES[i].match(/^\*\*(IN-\d[a-d]) /);
    if (slice) return slice[1];
    const wave = LINES[i].match(/^### (IN-\d) /);
    if (wave) return wave[1];
  }
  return null;
}

const braceGroups = (text) => [...text.matchAll(/\{([a-z_, ]+)\}/g)].map((m) => m[1].split(',').map((t) => t.trim()));

const ENDINGS_BLOCKS = LINES
  .map((line, index) => (line.startsWith('- **Endings entries:**') ? index : -1))
  .filter((index) => index >= 0)
  .map((index) => ({ wave: waveAt(index), text: bulletBlock(index) }));

describe('ENDINGS — every Endings block of the volume against the registry, both directions', () => {
  test('guard-the-guard: the parser finds the eight blocks, each in a wave', () => {
    // Re-measured at the build tree: eight `**Endings entries:**` bullets (IN-0a, IN-0b, IN-0d,
    // IN-1, IN-2, IN-3, IN-4, IN-5). A parser that silently found fewer would pass the arms below.
    expect(ENDINGS_BLOCKS.map((b) => b.wave)).toEqual(['IN-0a', 'IN-0b', 'IN-0d', 'IN-1', 'IN-2', 'IN-3', 'IN-4', 'IN-5']);
  });

  test('each wave\'s token groups equal the registry\'s volume groups for that wave', () => {
    /** @type {Map<string, string[]>} */
    const fromVolume = new Map();
    for (const block of ENDINGS_BLOCKS) {
      for (const group of braceGroups(block.text)) fromVolume.set(block.wave, [...(fromVolume.get(block.wave) || []), tokenSet(group)]);
    }
    /** @type {Map<string, string[]>} */
    const fromRegistry = new Map();
    for (const row of INFO_ENVELOPES) {
      for (const g of row.volumeGroups) fromRegistry.set(g.wave, [...(fromRegistry.get(g.wave) || []), tokenSet(g.tokens)]);
    }
    const sorted = (m) => Object.fromEntries([...m.entries()].map(([k, v]) => [k, [...v].sort()]).sort(([a], [b]) => (a < b ? -1 : 1)));
    expect(sorted(fromRegistry)).toEqual(sorted(fromVolume));
  });

  test('the endingless blocks resolve as ruled: IN-0d to the toll incidence, IN-1 to none', () => {
    const toll = ENDINGS_BLOCKS.find((b) => b.wave === 'IN-0d').text;
    expect(toll).toContain('NONE OF ITS OWN');
    expect(toll).toContain('TOLL INCIDENCE');
    expect(byId.get('toll_incidence').producer.symbol).toBe('secrecyTradeFactorOf');
    const mirror = ENDINGS_BLOCKS.find((b) => b.wave === 'IN-1').text;
    expect(mirror).toContain('none of its own');
    expect(INFO_ENVELOPES.some((row) => row.volumeGroups.some((g) => g.wave === 'IN-1'))).toBe(false);
  });
});

describe('THE LIST — the volume\'s IN-6 envelope list, exactly once each', () => {
  const start = LINES.findIndex((line) => line.startsWith('- **The envelopes (each with a mutant negative control'));
  const list = bulletBlock(start);

  test('guard-the-guard: the list is found and is not vacuous', () => {
    expect(start).toBeGreaterThan(0);
    expect(list.length).toBeGreaterThan(1500);
  });

  test('every envelope name stands exactly once in the list, and the registry holds eleven', () => {
    expect(INFO_ENVELOPES).toHaveLength(11);
    for (const row of INFO_ENVELOPES) expect(list.split(row.volumeName).length - 1, row.volumeName).toBe(1);
  });

  test('the list\'s brace groups are exactly the registry\'s mix groups', () => {
    const fromList = braceGroups(list).map(tokenSet).sort();
    const fromRegistry = [...new Set(INFO_ENVELOPES
      .filter((row) => row.kind === 'mix' && row.id !== 'arc')
      .flatMap((row) => row.volumeGroups.map((g) => tokenSet(g.tokens))))].sort();
    expect(fromList).toEqual(fromRegistry);
  });
});

describe('TOTALITY — every promised ending is graded or owed, never dropped', () => {
  test('each volume token is exactly one ending of its envelope, availability closed', () => {
    for (const row of INFO_ENVELOPES.filter((r) => r.kind === 'mix')) {
      const volumeTokens = [...new Set(row.volumeGroups.flatMap((g) => g.tokens))].sort();
      expect(row.endings.map((e) => e.volumeToken).sort(), row.id).toEqual(volumeTokens);
      for (const e of row.endings) expect(INFO_ENDING_AVAILABILITY).toContain(e.availability);
    }
  });

  test('an OWED ending names its wave and has no producer; every other ending has one', () => {
    for (const row of INFO_ENVELOPES) {
      for (const e of row.endings) {
        if (e.availability === 'OWED') {
          expect(e.owedBy, `${row.id}.${e.token}`).toMatch(/^IN-\d/);
          expect(e.producer, `${row.id}.${e.token}`).toBeUndefined();
        } else {
          expect(e.producer, `${row.id}.${e.token}`).toBeDefined();
        }
      }
    }
  });
});

/** Every producer address in the registry: endings and share/series rows. */
const PRODUCERS = INFO_ENVELOPES.flatMap((row) => [
  ...row.endings.filter((e) => e.producer).map((e) => ({ where: `${row.id}.${e.token}`, ...e.producer })),
  ...(row.producer ? [{ where: row.id, ...row.producer }] : []),
]);

describe('PRODUCERS — every address resolves in the live tree', () => {
  test('each producer module exports its symbol, carrying the literal it names', async () => {
    expect(PRODUCERS.length).toBeGreaterThanOrEqual(15);
    for (const p of PRODUCERS) {
      const mod = await import(pathToFileURL(join(ROOT, p.module)).href);
      const value = mod[p.symbol];
      expect(value, `${p.where}: ${p.module} :: ${p.symbol}`).toBeDefined();
      if (!p.literal) {
        expect(typeof value, p.where).toBe('function');
      } else if (typeof value === 'string') {
        expect(value, p.where).toBe(p.literal);
      } else {
        // An array vocabulary, a registry of rows by kind, or a routing table by value.
        const list = Array.isArray(value) ? value : Object.values(value);
        const spelled = list.map((v) => (typeof v === 'string' ? v : v?.kind));
        expect(spelled, p.where).toContain(p.literal);
      }
    }
  });

  test('every receipt is a registered kind or a brokerage act', () => {
    const registered = new Set([...Object.keys(EXACT_SECTION), ...INFORMATION_KIND_REGISTRY.map((r) => r.kind), ...BROKERAGE_ACTS]);
    const receipts = INFO_ENVELOPES.flatMap((row) => row.endings.filter((e) => e.receipt).map((e) => e.receipt));
    expect(receipts.length).toBeGreaterThanOrEqual(8);
    for (const receipt of receipts) expect(registered.has(receipt), receipt).toBe(true);
  });
});

/** The information program's modules, where a producer of an owed ending would be spelled. */
const INFORMATION_MODULES = Object.freeze([
  'brokeragePatronage.js', 'brokeragePlantHandoff.js', 'brokerageServices.js', 'brokerageServicesFeed.js',
  'brokerageServicesPlant.js', 'brokerageServicesRules.js', 'counterIntelSweep.js', 'disinformationPlant.js',
  'infoLure.js', 'informationNews.js', 'informationReceiptPools.js', 'informationStatecraft.js',
  'patronExposure.js', 'reputationRaceConsumer.js', 'routeNetworkConsumersRace.js', 'secondOrderBelief.js',
  'secrecyTradeFactor.js', 'suspicion.js',
].map((file) => `src/domain/worldPulse/${file}`));
const quotedIn = (token) => INFORMATION_MODULES.filter((file) => readFileSync(join(ROOT, file), 'utf8').includes(`'${token}'`));

describe('TRIPWIRE — an owed ending has no producer anywhere in the information modules', () => {
  test('guard-the-guard: the scan reads every module and finds a built token', () => {
    expect(INFORMATION_MODULES).toHaveLength(18);
    expect(quotedIn('clean_miss').length).toBeGreaterThan(0);
    expect(quotedIn('neither').length).toBeGreaterThan(0);
  });

  test('no OWED token is spelled as a literal; the day one is, its row must flip', () => {
    const owed = INFO_ENVELOPES.flatMap((row) => row.endings.filter((e) => e.availability === 'OWED').map((e) => `${row.id}.${e.token}`));
    expect(owed.length).toBe(15);
    for (const where of owed) expect(quotedIn(where.split('.')[1]), where).toEqual([]);
  });
});

describe('BANDS — raw, per envelope, never among the ratified soak bands', () => {
  test('every envelope has its own band and every share is within zero to one', () => {
    expect(Object.keys(INFO_CONVERGENCE_TUNING).sort()).toEqual(INFO_ENVELOPES.map((r) => r.id).sort());
    const shares = (band) => [band.dominanceMaxShare, band.minShare, band.maxShare,
      ...Object.values(band.floors || {}), ...Object.values(band.ceilings || {})].filter((v) => v !== undefined);
    for (const [id, band] of Object.entries(INFO_CONVERGENCE_TUNING)) {
      for (const v of shares(band)) {
        expect(v, id).toBeGreaterThan(0);
        expect(v, id).toBeLessThanOrEqual(1);
      }
    }
  });

  test('unsigned: no ratified soak band reads this contract or names an information envelope', () => {
    expect(RATIFIED_SOAK_BANDS.length).toBeGreaterThan(0);
    for (const band of RATIFIED_SOAK_BANDS) {
      // anchored: the ratified list is asserted non-empty above, and every row carries constantModule
      expect(String(band.constantModule || ''), band.metric).not.toContain('infoConvergenceContract');
      expect(INFO_ENVELOPES.some((row) => String(band.metric).startsWith(`${row.id}.`)), band.metric).toBe(false);
    }
  });
});

/** A deep copy of the table with ONE constant moved. */
function mutate(path, value) {
  const copy = JSON.parse(JSON.stringify(INFO_CONVERGENCE_TUNING));
  const keys = path.split('.');
  let node = copy;
  for (const key of keys.slice(0, -1)) node = node[key];
  node[keys.at(-1)] = value;
  return copy;
}

/**
 * THE MUTANTS: per envelope, an observation that PASSES under the authored band and the one
 * constant whose move reds it. Mixes are graded over all their endings here (the day the
 * producers land); TODAY below pins what the measured availability grades.
 */
const MUTANTS = Object.freeze({
  knowledge_share: { observation: { shares: { knowledge_share: { numerator: 10, denominator: 100 } } }, path: 'knowledge_share.maxShare', value: 0.05 },
  plant: { observation: { mixes: { plant: { took: 10, died_quiet: 6, exposed: 3, backfired: 1 } } }, path: 'plant.floors.exposed', value: 0.2 },
  intercept: { observation: { mixes: { intercept: { read: 10, refused: 8, caught: 2 } } }, path: 'intercept.floors.caught', value: 0.2 },
  toll_incidence: { observation: { shares: { toll_incidence: { numerator: 12, denominator: 100 } } }, path: 'toll_incidence.minShare', value: 0.2 },
  lure: { observation: { mixes: { lure: { sprung: 4, resisted: 3, exposed_first: 2, backfired: 1 } } }, path: 'lure.floors.resisted', value: 0.4 },
  race: { observation: { mixes: { race: { person: 2, story: 10, together: 6, neither: 2 } } }, path: 'race.ceilings.person', value: 0.05 },
  sweep: { observation: { mixes: { sweep: { caught: 3, clean_miss: 4, false_accusation: 3 } } }, path: 'sweep.ceilings.false_accusation', value: 0.2 },
  house: { observation: { mixes: { house: { unmasked: 4, weathered: 3, ruined_name: 3 } } }, path: 'house.dominanceMaxShare', value: 0.3 },
  courier_errand: { observation: { mixes: { courier_errand: { delivered: 6, intercepted: 2, lost: 1, turned: 1 } } }, path: 'courier_errand.dominanceMaxShare', value: 0.5 },
  arc: { observation: { mixes: { arc: { burned: 3, withdrawn: 2, gone_quiet: 2, turned: 1 } } }, path: 'arc.minDistinct', value: 5 },
  divergence_sane: {
    // eleven readings: years one to two at one half, then nine at exactly one. The final ten
    // include a half, so the authored window passes; a window of nine is pinned and reds.
    observation: { series: { divergence_sane: [0.5, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1] } },
    path: 'divergence_sane.finalWindowYears',
    value: 9,
  },
});

describe('MUTANTS — each envelope reds when one tuning constant moves', () => {
  test('the mutant table covers every envelope and every verdict is in the closed vocabulary', () => {
    expect(Object.keys(MUTANTS).sort()).toEqual(INFO_ENVELOPES.map((r) => r.id).sort());
  });

  for (const row of INFO_ENVELOPES) {
    test(`${row.id}: PASS under its band, FAIL with ${MUTANTS[row.id].path} moved`, () => {
      const { observation, path, value } = MUTANTS[row.id];
      const graded = row.kind === 'mix' ? row.endings.map((e) => e.token) : null;
      const authored = evaluateInfoEnvelope(row, observation, { graded });
      expect(authored.verdict, authored.findings.join('; ')).toBe('PASS');
      const mutated = evaluateInfoEnvelope(row, observation, { graded, tuning: mutate(path, value) });
      expect(mutated.verdict).toBe('FAIL');
      expect(INFO_ENVELOPE_VERDICTS).toContain(mutated.verdict);
    });
  }
});

describe('TODAY — what the measured availability can grade', () => {
  test('plant and race grade receipts; the mixes with fewer than two receipted endings cannot', () => {
    const observation = {
      mixes: Object.fromEntries(Object.entries(MUTANTS).filter(([, m]) => m.observation.mixes).map(([id, m]) => [id, Object.fromEntries(
        Object.entries(m.observation.mixes[id]).map(([token, n]) => [token, byId.get(id).endings.find((e) => e.token === token).availability === 'RECEIPTED' ? n : 0]),
      )])),
    };
    const verdicts = Object.fromEntries(evaluateInfoConvergence(observation)
      .filter((r) => byId.get(r.envelope).kind === 'mix').map((r) => [r.envelope, r.verdict]));
    expect(verdicts).toEqual({
      arc: 'NOT_EXECUTABLE',
      courier_errand: 'NOT_EXECUTABLE',
      house: 'NOT_EXECUTABLE',
      intercept: 'NOT_EXECUTABLE',
      lure: 'NOT_EXECUTABLE',
      plant: 'PASS',
      race: 'PASS',
      sweep: 'NOT_EXECUTABLE',
    });
  });

  test('a count on an ending no receipt can carry is REGISTRY_STALE, not a silent share', () => {
    const r = evaluateInfoEnvelope(byId.get('plant'), { mixes: { plant: { took: 9, exposed: 3, died_quiet: 2 } } });
    expect(r.verdict).toBe('REGISTRY_STALE');
    expect(r.findings[0]).toContain('died_quiet');
  });

  test('an empty observation grades nothing and claims nothing', () => {
    for (const r of evaluateInfoConvergence({})) expect(r.verdict, r.envelope).toBe('NOT_EXECUTABLE');
  });
});
