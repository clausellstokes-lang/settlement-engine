/**
 * misfitSecretSettle.test.js — S9 AS A POST-PASS (PAGE-6, 2026-11-20; docs/chair/2026-11-20/content/page/briefs/S9-POST.md,
 * the chair's ruling of 13:50): A SECRET THAT FITS ITS HOLDER. The secrets are dealt exactly as before; then, draw-free,
 * once per town (npc/factionLeaderSecret.js :: settleMisfitSecrets, called by narrativeGenerator.js :: enrichNpcCoherence
 * after every card is dealt), a card whose secret it is not admitted to — a role-free row that presumes an office or a
 * trade the card lacks (npcData.js :: CRIMINAL_SECRET_HOLDER_TAGS), or a venal row on a principled card — takes its next
 * admitted line that no card of the town holds, in its pool's row order; a card that is no misfit keeps its secret byte
 * for byte.
 *
 * Arms: (1) the tag table; (2) a misfit computed on a clergy face's own stream holds the next admitted, unheld line of its
 * pool and every other field as dealt, and a bystander is untouched; (3) a principled face's venal row is passed; (4) the
 * born towns: every card whose secret is a row of its noted pool holds an admitted one, or none was left to it.
 * RED AT THE LANE COMMIT eb5fedd13 (no tag table, no noted pool, no pass).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import * as npcData from '../../src/data/npcData.js';
import * as leaderSecret from '../../src/generators/npc/factionLeaderSecret.js';
import { generateSingleNPC, mergeNPCLists } from '../../src/generators/npcGenerator.js';
import { hasMarketInstitution } from '../../src/domain/facts/market.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { onStream } from '../../src/generators/people/representatives.js';
import { classOfRole, ROLE_CLASS } from '../../src/domain/roles/roleClass.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** @type {Record<string, any>} */ const N = npcData;
/** @type {Record<string, any>} */ const F = leaderSecret;
const TAGS = /** @type {Record<string, readonly string[]>} */ (N.CRIMINAL_SECRET_HOLDER_TAGS ?? {});
const VENAL = N.SECRETS_DENIED_BY_TEMPERAMENT.incorruptible;
const BOUND = new Set(['dangerous_presents_safe', 'compromised_presents_professional', 'significant_presents_ordinary']
  .flatMap((k) => N.NPC_PRESENTATION_MODES[k] || []).map((p) => JSON.stringify(p)));
const registry = () => ({ titles: new Set(), themes: new Set(), tells: new Set(), speech: new Set(), goals: new Set(), secrets: new Set() });
/** A face dealt on its own stream, as the birth seam deals one (no title row: the role's draw). */
const face = (/** @type {string} */ seed, /** @type {string} */ role, /** @type {string} */ category) => onStream(createPRNG(seed),
  () => generateSingleNPC(role, 'germanic', category, 'germanic', 'city', {}, [], registry(), null, { hook: false }));
/** The test's own reading of admission (the tags, the principled temperament's venal words). */
const admitted = (/** @type {{ secret: string }} */ row, /** @type {string | null} */ cls, /** @type {string | null} */ temperament) =>
  !(Object.hasOwn(TAGS, row.secret) && cls !== null && !TAGS[row.secret].includes(cls)) && !(temperament === 'principled' && VENAL.test(row.secret));
/** The next admitted line after `at` in `rows` that no card holds as the town prints it (`carry`; a guild row passed), or null. */
const nextLine = (/** @type {any[]} */ rows, /** @type {number} */ at, /** @type {string | null} */ cls, /** @type {string | null} */ temperament, /** @type {Set<string>} */ held, carry = (/** @type {string} */ t) => t) => {
  for (let k = 1; k < rows.length; k += 1) { const r = rows[(at + k) % rows.length]; if (admitted(r, cls, temperament) && !held.has(carry(r.secret).trim()) && !/thieves|guild/i.test(`${r.secret} ${r.stakes}`)) return r; }
  return null;
};
/**
 * The town's own rewrite of a row's text, COMPUTED by the merge that writes it (`npcGenerator.js :: mergeNPCLists`, its
 * no-market rule): a card holding `text` beside the town's houses, under a power of no crime.
 * @param {unknown[]} institutions @returns {(text: string) => string}
 */
const carryOf = (institutions) => (text) => {
  const prev = setActiveRng(createPRNG('s9-carry'));
  try { return mergeNPCLists([{ role: 'the carrier', secret: { what: text, stakes: '' } }], [{ faction: 'Elder Council', isGoverning: true, category: 'government', power: 10 }], institutions, 'village', {})[0].secret.what; } finally { clearActiveRng(prev); }
};
const withoutSecret = (/** @type {Record<string, any>} */ card) => JSON.stringify({ ...card, secret: undefined });

describe('S9 · the role-free rows tagged by the holders they fit', () => {
  it('every tag keys a role-free row, names only ROLE_CLASS values, and holds `other`; the rows are untouched', () => {
    const ANY = N.NPC_CRIMINAL_SECRETS_BY_HOLDER.any;
    const texts = new Set(Object.values(ANY).flat().map((/** @type {any} */ r) => r.secret));
    const classes = new Set(Object.values(ROLE_CLASS));
    const faults = [];
    for (const [text, tag] of Object.entries(TAGS)) {
      if (!texts.has(text)) faults.push(`not a role-free row: ${text}`);
      for (const c of tag) if (!classes.has(c)) faults.push(`${text}: class ${c}`);
      if (!tag.includes('other')) faults.push(`${text}: no other`);
    }
    expect(faults).toEqual([]);
    expect(Object.keys(TAGS)).toHaveLength(10);
    for (const r of Object.values(ANY).flat()) expect(Object.keys(/** @type {any} */ (r)).sort()).toEqual(['secret', 'stakes']);
  });
});

describe('S9 · a misfit takes its next admitted line, draw-free, after the deal', () => {
  it('a clergy face dealt a row its tag refuses holds the next admitted, unheld line of its pool; nothing else moves', () => {
    const cls = classOfRole('High Priest');
    expect(cls).toBe('clergy');
    let seen = 0;
    for (let i = 0; i < 3000 && seen < 4; i += 1) {
      const card = face(`s9-post::${i}`, 'High Priest', 'religious');
      const what = card.secret?.what;
      if (!what || !Object.hasOwn(TAGS, what) || TAGS[what].includes(cls) || BOUND.has(JSON.stringify(card.presentation))) continue;
      seen += 1;
      let bystander = face(`s9-post::by::${i}`, 'Wealthiest Merchant', 'economy');
      for (let j = 0; bystander.secret && !admitted({ secret: bystander.secret.what }, classOfRole('Wealthiest Merchant'), bystander.personality.dominant); j += 1) bystander = face(`s9-post::by::${i}::${j}`, 'Wealthiest Merchant', 'economy'); // a card that is no misfit
      const before = withoutSecret(card);
      const bystanderBefore = JSON.stringify(bystander);
      const source = F.secretSourceOf?.(card);
      expect(source?.holderClass, `s9-post::${i}: the pool noted at the deal`).toBe(cls);
      const at = source.rows.findIndex((/** @type {any} */ r) => r.secret === what);
      expect(at).toBeGreaterThanOrEqual(0);
      const held = new Set([what, bystander.secret?.what].filter(Boolean));
      const want = nextLine(source.rows, at, cls, card.personality.dominant, held);
      F.settleMisfitSecrets([card, bystander]);
      expect(card.secret, `s9-post::${i}`).toEqual(want ? { what: want.secret, stakes: want.stakes } : { what, stakes: card.secret.stakes });
      expect(admitted({ secret: card.secret.what }, cls, card.personality.dominant)).toBe(!!want);
      expect(withoutSecret(card), 'every other field as dealt').toBe(before);
      expect(JSON.stringify(bystander), 'a card that is no misfit keeps its secret byte for byte').toBe(bystanderBefore);
    }
    expect(seen).toBeGreaterThan(0);
  });

  it('a principled face dealt a venal row is passed to the next line without the money words', () => {
    let seen = 0;
    for (let i = 0; i < 6000 && seen < 3; i += 1) {
      const card = face(`s9-venal::${i}`, 'Wealthiest Merchant', 'economy');
      const what = card.secret?.what;
      if (card.personality?.dominant !== 'principled' || !what || !VENAL.test(what) || BOUND.has(JSON.stringify(card.presentation))) continue;
      seen += 1;
      F.settleMisfitSecrets?.([card]);
      expect(VENAL.test(card.secret.what), `s9-venal::${i}: ${card.secret.what}`).toBe(false);
      expect(card.personality.dominant).toBe('principled');
    }
    expect(seen).toBeGreaterThan(0);
  });
});

describe('S9 · the born towns', () => {
  // r2r-village-12 (no market; born in the r2r dials of tests/generators/informantNoThievesGuild.test.js): its priest holds the
  // protection scheme in the no-market rewrite (households), a clergy face's misfit the merge rewrote before the pass
  const SEEDS = ['hxd-city-3', 'hxd-metropolis-7', 'hxd-town-11', 'hxd-village-2', 'r2r-village-12'];
  const R2R = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** @type {Record<string, any>} */
  const towns = {};
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const seed of SEEDS) towns[seed] = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...(seed.startsWith('r2r-') ? R2R : {}), settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  }, 120000);

  it('every card whose secret is a row of its noted pool holds an admitted line, or none was left to it', () => {
    const faults = [];
    let noted = 0;
    for (const seed of SEEDS) {
      const npcs = towns[seed].npcs;
      const carry = carryOf(towns[seed].institutions || []);
      const held = new Set(npcs.map((/** @type {any} */ n) => n.secret?.what).filter(Boolean).map((/** @type {string} */ w) => w.trim()));
      for (const card of npcs) {
        const source = F.secretSourceOf?.(card);
        if (!source) continue;
        noted += 1;
        const at = source.rows.findIndex((/** @type {any} */ r) => r.secret === card.secret?.what || carry(r.secret) === card.secret?.what);
        if (at < 0 || admitted(source.rows[at], source.holderClass, card.personality?.dominant ?? null)) continue;
        if (BOUND.has(JSON.stringify(card.presentation))) continue; // its presentation was drawn from its secret's words: it keeps it
        if (nextLine(source.rows, at, source.holderClass, card.personality?.dominant ?? null, held, carry)) faults.push(`${seed} ${card.id} [${card.title}]: ${card.secret.what}`);
      }
    }
    expect(faults).toEqual([]);
    expect(noted, 'the deal notes its pool').toBeGreaterThan(0);
  });

  it('a card holding the no-market rewrite of a row it is refused is settled too (r2r-village-12, a town with no market)', () => {
    const town = towns['r2r-village-12'];
    expect(hasMarketInstitution(town.institutions || []), 'the anchor town holds no market').toBe(false);
    const carry = carryOf(town.institutions || []);
    const scheme = (/** @type {any[]} */ (N.NPC_CRIMINAL_SECRETS_BY_HOLDER.any.criminal)).find((r) => Object.hasOwn(TAGS, r.secret) && carry(r.secret) !== r.secret);
    expect(scheme, 'a tagged row the no-market rewrite changes').toBeTruthy();
    const holders = town.npcs.filter((/** @type {any} */ n) => n.secret?.what === carry(scheme.secret));
    const refused = holders.filter((/** @type {any} */ n) => { const src = F.secretSourceOf?.(n); return !src || !admitted(scheme, src.holderClass, n.personality?.dominant ?? null); });
    expect(refused.map((/** @type {any} */ n) => `${n.id} [${n.title}]`), 'no card the row refuses holds its rewrite').toEqual([]);
  });
});
