/**
 * narrowVenalSecret.test.js — F5-NARROW (PAGE-8, 2026-11-20; docs/chair/2026-11-20/content/page/briefs/F5-NARROW.md, the
 * chair's ruling of 18:26, PAGE-6-HANDBACK.md §0a): A PERSON WHO CANNOT BE BOUGHT KEEPS NO BOUGHT SECRET. A card whose FINAL
 * temperament is principled, honest, incorruptible or plain-dealing and whose secret is VENAL (F5's venal list: PAGE-1's
 * `measures/C/f5.mjs` venalRe, copied below as the test's own reading) takes, draw-free, the next row of its own pool it is
 * admitted to and no card of the town holds (npc/factionLeaderSecret.js :: settleMisfitSecrets with `narrow: true`, called by
 * narrativeGenerator.js :: enrichNpcCoherence after `castPowers.js :: rankPowers`, whose temperament yield is the last writer
 * of `personality.dominant`). Nothing else moves.
 *
 * Arms (the brief's TEST): (a) the pass reads the final temperament: every card's temperament AT THE PASS is the one its
 * record ends with; (b) no card the pass moved ends with a secret on F5's venal list; (c) a narrow card with an admitted row
 * left holds a non-venal secret; (d) a card that is not narrow is byte-identical to the base (the pass a no-op), and a narrow
 * card differs from it in its secret alone. The pass is observed through a wrapper of the module's own export (the base: the
 * narrow call a no-op); every other call runs the real code.
 * SEEDS, CHOSEN FROM THE 300 (measure.mjs's `hxd-<size>-<i>`, DEFAULT_CONFIG) BY COMPUTATION (the builder's scratch dump of
 * the 300, base and after): hxd-hamlet-41 (a narrow innkeeper walked), hxd-hamlet-45 and hxd-metropolis-24 (a card whose
 * temperament the yield moved after the S9 point: the probe's placement read it there), hxd-city-26 (the probe's garrison
 * commander), hxd-town-35 (a narrow cobbler walked).
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';
import * as npcData from '../../src/data/npcData.js';
import * as leaderSecret from '../../src/generators/npc/factionLeaderSecret.js';
import { TITLE_LINE_DECLARATIONS, TITLE_SECRETS } from '../../src/data/people/titleSecretsPresentations.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** The wrapper's state: `off` makes the narrow pass a no-op (the base); every card the pass sees is noted with its temperament there. */
const state = vi.hoisted(() => ({ off: false, passes: 0, seen: new Map() }));
vi.mock('../../src/generators/npc/factionLeaderSecret.js', async (importOriginal) => {
  /** @type {Record<string, any>} */
  const real = await importOriginal();
  return {
    ...real,
    settleMisfitSecrets: (/** @type {any[]} */ cards, /** @type {Record<string, unknown>} */ options = {}) => {
      if (options?.narrow !== true) return real.settleMisfitSecrets(cards, options);
      state.passes += 1;
      for (const c of cards || []) if (c?.personality && typeof c.personality === 'object') state.seen.set(c.personality, c.personality.dominant ?? null);
      return state.off ? { misfits: 0, moved: 0, kept: 0 } : real.settleMisfitSecrets(cards, options);
    },
  };
});

/** @type {Record<string, any>} */ const N = npcData;
/** @type {Record<string, any>} */ const F = leaderSecret;
const NARROW = new Set(['principled', 'honest', 'incorruptible', 'plain-dealing']);
// F5's venal list, verbatim from PAGE-1's f5.mjs (origin lane/page-1-2026-11-20-card, docs/chair/2026-11-20/content/page/measures/C/f5.mjs)
const venalRe = /embezzl|fencing|payroll|brib|protection scheme|for a fee|contraband|skim|selling|\bsells\b|betting against|exploitative labour|suppress a finding|been paid|paid to|is paid|for a share|pocket|keeping back|on the side|smuggl|overcharg|charges the families|cut of|kickback|monthly payment|for a purse|who pays? for it|families can pay|taking offerings|give generously|for money|for gold|for coin/i;
const TAGS = /** @type {Record<string, readonly string[]>} */ (N.CRIMINAL_SECRET_HOLDER_TAGS);
const DENIED = /** @type {Record<string, RegExp>} */ (N.SECRETS_DENIED_BY_TEMPERAMENT);
const BOUND = new Set(['dangerous_presents_safe', 'compromised_presents_professional', 'significant_presents_ordinary']
  .flatMap((k) => N.NPC_PRESENTATION_MODES[k] || []).map((p) => JSON.stringify(p)));
const SEEDS = ['hxd-hamlet-41', 'hxd-hamlet-45', 'hxd-metropolis-24', 'hxd-city-26', 'hxd-town-35'];

/** The test's own reading of a row a narrow card may walk to: its tag names the card's class; no venal word, no word its
 * temperament denies (a principled card: the incorruptible words, as S9 reads them); no guild word; a title row undeclared. */
const narrowAdmits = (/** @type {{ secret: string, stakes: string }} */ row, /** @type {string | null} */ cls, /** @type {string} */ temperament, /** @type {boolean} */ title) => {
  const text = row.secret;
  if (!title && Object.hasOwn(TAGS, text) && cls !== null && !TAGS[text].includes(cls)) return false;
  if (venalRe.test(text) || /thieves|guild/i.test(`${row.secret} ${row.stakes}`)) return false;
  if ((Object.hasOwn(DENIED, temperament) && DENIED[temperament].test(text)) || (temperament === 'principled' && DENIED.incorruptible.test(text))) return false;
  return !(title && Object.hasOwn(TITLE_LINE_DECLARATIONS.secret, text));
};
/** The card's own pool: its noted pool (S9) where its secret is a row of it, else its title's rows. */
const poolOf = (/** @type {Record<string, any>} */ card) => {
  const what = card.secret?.what;
  const src = F.secretSourceOf(card);
  if (src) { const at = src.rows.findIndex((/** @type {any} */ r) => r.secret === what || F.withoutMarketWords(r.secret) === what); if (at >= 0) return { rows: src.rows, at, cls: src.holderClass, title: false }; }
  for (const t of [card.institution?.title, card.title]) {
    if (typeof t !== 'string' || !Object.hasOwn(TITLE_SECRETS, t)) continue;
    const at = TITLE_SECRETS[t].findIndex((/** @type {any} */ r) => r.secret === what);
    if (at >= 0) return { rows: TITLE_SECRETS[t], at, cls: null, title: true };
  }
  return null;
};

/** @type {Record<string, { base: any, after: any, seen: Map<object, string | null>, passes: number }>} */
const towns = {};
const forge = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) {
    state.off = true; const base = forge(seed);
    state.off = false; state.passes = 0; state.seen = new Map();
    const after = forge(seed);
    towns[seed] = { base, after, seen: state.seen, passes: state.passes };
  }
}, 240000);

describe('F5-NARROW · the pass reads the final temperament (condition 1)', () => {
  it('on every seed the pass runs once, sees every card of the record that has a temperament, and each one\'s temperament there is the one its record ends with', () => {
    const differ = [];
    let compared = 0;
    for (const seed of SEEDS) { // every seed runs: the faults are collected, asserted once below
      const { after, seen, passes } = towns[seed];
      if (passes !== 1) differ.push(`${seed}: the narrow pass ran ${passes} times`);
      for (const n of after.npcs.filter((/** @type {any} */ c) => c.personality && typeof c.personality === 'object')) { // a crisis's temporary figure carries no personality (and no secret)
        if (!seen.has(n.personality)) { differ.push(`${seed} ${n.id}: not seen at the pass`); continue; }
        compared += 1;
        if (seen.get(n.personality) !== n.personality.dominant) differ.push(`${seed} ${n.id} [${n.title}]: ${seen.get(n.personality)} at the pass, ${n.personality.dominant} at the end`);
      }
    }
    expect(differ).toEqual([]);
    expect(compared, 'cards compared').toBeGreaterThan(0);
  });
});

describe('F5-NARROW · the walk', () => {
  /** The cards whose secret the pass moved, per seed (base and after matched by id). */
  const moved = () => SEEDS.flatMap((seed) => {
    const before = new Map(towns[seed].base.npcs.map((/** @type {any} */ n) => [n.id, n]));
    return towns[seed].after.npcs.filter((/** @type {any} */ n) => JSON.stringify(n.secret) !== JSON.stringify(before.get(n.id)?.secret)).map((/** @type {any} */ n) => ({ seed, n, was: before.get(n.id) }));
  });

  it('(condition 2) no card the pass moved ends with a secret on F5\'s venal list; each moved card was a narrow card holding a venal one', () => {
    const all = moved();
    expect(all.length, 'the pass moves cards on these seeds').toBeGreaterThan(0);
    expect(all.filter((m) => venalRe.test(m.n.secret?.what ?? '')).map((m) => `${m.seed} ${m.n.id} [${m.n.title}]: ${m.n.secret.what}`)).toEqual([]);
    expect(all.filter((m) => !NARROW.has(m.n.personality.dominant) || !venalRe.test(m.was?.secret?.what ?? '')).map((m) => `${m.seed} ${m.n.id} [${m.n.title}] ${m.n.personality.dominant}`)).toEqual([]);
  });

  it('(c) a narrow card with an admitted row left in its own pool holds a non-venal secret', () => {
    const faults = [];
    let cured = 0;
    for (const seed of SEEDS) {
      const { base, after } = towns[seed];
      const held = new Set(after.npcs.map((/** @type {any} */ n) => n.secret?.what).filter(Boolean).map((/** @type {string} */ w) => w.trim()));
      const before = new Map(base.npcs.map((/** @type {any} */ n) => [n.id, n]));
      for (const card of after.npcs) {
        const temperament = card.personality?.dominant;
        if (!NARROW.has(temperament)) continue;
        if (!venalRe.test(card.secret?.what ?? '')) { if (venalRe.test(before.get(card.id)?.secret?.what ?? '')) cured += 1; continue; }
        const pool = poolOf(card);
        if (!pool || BOUND.has(JSON.stringify(card.presentation))) continue; // no pool row, or its presentation was drawn from its secret: it keeps its draw
        for (let k = 1; k < pool.rows.length; k += 1) {
          const r = pool.rows[(pool.at + k) % pool.rows.length];
          if (narrowAdmits(r, pool.cls, temperament, pool.title) && !held.has(r.secret.trim()) && !held.has(F.withoutMarketWords(r.secret).trim())) { faults.push(`${seed} ${card.id} [${card.title}] ${temperament}: "${card.secret.what}" though "${r.secret}" is left`); break; }
        }
      }
    }
    expect(faults).toEqual([]);
    expect(cured, 'narrow cards venal at the base hold a non-venal secret').toBeGreaterThan(0);
  });

  it('(d) a card that is not narrow is byte-identical to the base; a narrow card differs in its secret alone; the town beside its cast is unmoved', () => {
    const faults = [];
    for (const seed of SEEDS) { // every seed runs: the faults are collected, asserted once below
      const { base, after } = towns[seed];
      if (JSON.stringify(after.npcs.map((/** @type {any} */ n) => n.id)) !== JSON.stringify(base.npcs.map((/** @type {any} */ n) => n.id))) faults.push(`${seed}: the cast differs`);
      after.npcs.forEach((/** @type {any} */ n, /** @type {number} */ i) => {
        const b = base.npcs[i];
        const same = NARROW.has(n.personality?.dominant) ? JSON.stringify({ ...n, secret: null }) === JSON.stringify({ ...b, secret: null }) : JSON.stringify(n) === JSON.stringify(b);
        if (!same) faults.push(`${seed} ${n.id} [${n.title}] ${n.personality?.dominant}`);
      });
      if (JSON.stringify({ ...after, npcs: null }) !== JSON.stringify({ ...base, npcs: null })) faults.push(`${seed}: the town beside its cast`);
    }
    expect(faults).toEqual([]);
  });
});
