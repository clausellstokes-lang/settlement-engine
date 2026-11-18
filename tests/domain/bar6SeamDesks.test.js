/**
 * tests/domain/bar6SeamDesks.test.js — SEAM-DESKS's guard (BRIEF-BAR6-SEAM, section SEAM-DESKS; 2026-11-17; vetoable by
 * the owner). Each case holds one cure of the seat at the fact it reads, and the build guard's rules it relies on are
 * PLANTED here, so a later change to the walker that drops a rule turns this red rather than reopening the line.
 *
 *   item 1  `paid watch` needs a watch on the roster that is not the unpaid rota (it read true where no watch stood);
 *   item 3  the defence desk's two twins and the power desk's council twin say no "the town" in pools no tier keys;
 *   item 4  the brewery's tavern lines declare the tavern (read on the roster at the late re-read);
 *   item 5  the safety profile's quiet streets are gated by the tier where the walker reads it; the war profiteers'
 *           line presumes no leather; both leave the build guard's door;
 *   item 6  the class table: court sits, seat held, seat members, paid watch answer their classes; legacy ruin joins none;
 *   item 7  the merchant guilds' sentence prints only where a power named Merchant Guilds stands; the travellers' line of
 *           the power desk is declared against the threat family (with its twin);
 *   item 8  "candid" and "forthright" yield to the secrets of deceit, never to the secrets of money.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { paidWatchOf } from '../../src/domain/facts/guardPay.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { resolveSibling } from '../../src/domain/facts/drawDeclared.js';
import { DESC_LATE_SIBLINGS } from '../../src/data/institutionDescVariants.js';
import { SECRETS_DENIED_BY_TEMPERAMENT, temperamentYieldsToSecret } from '../../src/data/npcData.js';
import { annotateFactionStanding } from '../../src/generators/power/factionStanding.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { CLASS_DIMS, classesOf, hitsOf, scanSource } from '../lint/presumptionClasses.shared.mjs';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { variantByVid } from '../helpers/drawnProse.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
/** The hits of a planted file, as `class:status` per text (the walker test's own form). @param {string} rel @param {string} src */
const planted = (rel, src) => hitsOf(scanSource(rel, src)).map((h) => `${h.cls}:${h.status} :: ${h.text}`);
const one = (/** @type {string} */ entry) => planted('src/data/plantedPool.js', `export const POOL = [\n  ${entry},\n];\n`);
/** Every variant text of a desk, flattened. @param {unknown} desk @returns {string[]} */
const textsOf = (desk) => { const out = []; const walk = (v) => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') { if (typeof v.text === 'string') out.push(v); Object.values(v).forEach(walk); } }; walk(desk); return out; };

describe('item 1 · `paid watch` needs a watch that is not the unpaid rota', () => {
  test('no watch on the roster reads false (it read true before: "not the unpaid rota" alone)', () => {
    expect(paidWatchOf({ institutions: [] })).toBe(false);
    expect(paidWatchOf({ institutions: [{ name: 'Blacksmith' }] })).toBe(false);
  });
  test('a watch that is paid reads true; the village rota alone reads false', () => {
    expect(paidWatchOf({ institutions: [{ name: 'Town watch' }] })).toBe(true);
    expect(paidWatchOf({ institutions: [{ name: 'Village watch' }] })).toBe(false);
  });
  test('the secret declared on it is refused in a town with no watch', () => {
    const decl = declarationOf({ needs: ['paid watch'], excludes: [] });
    expect(declarationAdmits(decl, factsOf({ institutions: [{ name: 'Granary' }] })).admitted).toBe(false);
    expect(declarationAdmits(decl, factsOf({ institutions: [{ name: 'Town watch' }] })).admitted).toBe(true);
  });
});

describe('item 3 and item 7 · the desks\' twins say a noun every tier bears', () => {
  const lines = [...textsOf(DOSSIER_STATE_PROSE_DEFENSE), ...textsOf(DOSSIER_STATE_PROSE_POWER)];
  test('DS-DEF-2 food trades failing, DS-DEF-12 capacity enough and DS-POW-5 council counterforce say no "the town"', () => {
    expectNoSeedFailures(collectSeedFailures([
      // RE-KEYED BY IDENTITY (DEBT-1, 2026-11-17): the same line (DS-DEF-2 CHAIN: food trades failing v2) lost its second
      // months figure about food ("through a year cut off"; foodEnduranceLine.test.js, one fact one home); the claim is unchanged.
      ['DS-DEF-2 food trades failing', /its stores would still carry it if it were cut off\.$/],
      ['DS-DEF-12 capacity enough', /and what the place cannot grow or make it mostly goes without\.$/],
      ['DS-POW-5 council counterforce', /has left obvious decisions untaken, and nobody there can make it take them\.$/],
    ], ([_name, re]) => {
      const hit = lines.filter((v) => re.test(v.text));
      expect(hit.length).toBe(1);
      expect(hit[0].text).not.toMatch(/\bthe town\b/); // anchored: hit.length is exactly 1 above, the one corpus line its pattern names
    }), 'every twin says a noun every tier bears');
  });
  test('the travellers\' line is declared against the THREAT family, and its twin stands under one', () => {
    const trav = lines.filter((v) => /^Travellers reach \{settlement\} and find nobody about/.test(v.text));
    expect(trav.length).toBe(1);
    expect(trav[0].marks).toEqual(['garrison', 'no crisis: threat']);
    const twin = lines.filter((v) => /^Soldiers are posted all over \{settlement\} and nobody else is about\./.test(v.text));
    expect(twin.length).toBe(1);
    expect(twin[0].marks).toEqual(['garrison', 'crisis: threat']);
  });
});

describe('item 4 · the brewery\'s tavern lines declare the tavern', () => {
  const sets = Object.entries(DESC_LATE_SIBLINGS).filter(([k]) => /^Commercial-scale ale and beer production/.test(k));
  test('two sets of two; every line that names the taverns needs one', () => {
    expect(sets.length).toBe(2);
    for (const [, set] of sets) {
      expect(set.length).toBe(2);
      for (const line of set) { expect(line.text).toMatch(/\btaverns\b/); expect(line.needs).toEqual(['institution: tavern']); }
    }
  });
  test('the declaration reads the roster: a tavern admits the original, no tavern refuses it', () => {
    for (const [key, set] of sets) {
      const original = set.find((l) => l.text === key);
      expect(declarationAdmits(declarationOf(original), factsOf({ institutions: [{ name: 'Brewery' }, { name: 'Tavern' }] })).admitted).toBe(true);
      expect(declarationAdmits(declarationOf(original), factsOf({ institutions: [{ name: 'Brewery' }] })).refused).toEqual(['institution: tavern']);
      expect(resolveSibling(key, DESC_LATE_SIBLINGS, { facts: () => factsOf({ institutions: [{ name: 'Brewery' }, { name: 'Tavern' }] }), poolId: 'test', surface: 'institutions', drawKind: 'T' })).toBe(key);
    }
  });
});

describe('item 5 · the safety profile\'s two lines leave the build guard\'s door by rule', () => {
  const src = readFileSync(join(ROOT, 'src/generators/safetyProfile.js'), 'utf8');
  const rows = hitsOf(scanSource('src/generators/safetyProfile.js', src));
  test('THE RULE PLANTED: a size word after a tier test is gated (`tierKey`: no hit); with none before it, it is stock', () => {
    expect(planted('src/generators/planted.js', "export function f(tier) {\n  const q = TINY_PLACES.includes(tier) ? 'The place is unusually quiet.' : 'The streets are unusually quiet.';\n  return q;\n}\n"))
      .toEqual([]);
    expect(planted('src/generators/planted.js', "export function f(x) {\n  const q = x ? 'The place is unusually quiet.' : 'The streets are unusually quiet.';\n  return q;\n}\n"))
      .toEqual(['size:none :: The streets are unusually quiet.']);
  });
  test('the quiet streets in the file read by that rule, and no hit of the line is stock', () => {
    const scanned = scanSource('src/generators/safetyProfile.js', src).filter((r) => /unusually quiet/.test(r.text));
    // LAST-DECLARE (2026-11-18, the chair's ruling LR4): the line stands in exactly three places, each read gated by the
    // tier: its print site (the door call that resolves it on the tier) and its declared sibling set in `SAFETY_LINE_SIBLINGS`
    // (the set's key and its first member, `needs: tier: ≥ village`). A fourth literal anywhere else is red here.
    const Q = 'The streets are unusually quiet.';
    const lines = src.split('\n');
    const where = (/** @type {{ pool: string, line: number }} */ r) => {
      const at = lines[r.line - 1] ?? '';
      if (r.pool === 'generateSafetyProfile' && at.includes(`resolveSibling('${Q}', SAFETY_LINE_SIBLINGS`)) return 'the print site';
      if (r.pool === 'SAFETY_LINE_SIBLINGS' && at.startsWith(`  '${Q}': Object.freeze([Object.freeze({ text: '${Q}', needs: Object.freeze(['tier: ≥ village']) })`)) return 'the declared set (key, member)';
      return `elsewhere (${r.pool}, line ${r.line})`;
    };
    expect(scanned.map((r) => [r.text, r.decl.tierKey, where(r)])).toEqual([
      [Q, true, 'the print site'], [Q, true, 'the declared set (key, member)'], [Q, true, 'the declared set (key, member)'],
    ]);
    expect(rows.filter((h) => /unusually quiet/.test(h.text))).toEqual([]);
  });
  test('the war profiteers\' line names no leather, and no goods word of it is a hit', () => {
    // the old words are gone from the file and the line that replaced them stands in it (the anchor)
    expectAbsentWithAnchor(src, 'adulterating grain and leather', "Suppliers adulterating the grain and provisions sold to the army's contracts.", 'the war profiteers line');
    expect(src).toMatch(/Suppliers adulterating the grain and provisions sold to the army's contracts\./);
    expect(rows.filter((h) => /^Suppliers adulterating/.test(h.text))).toEqual([]);
  });
});

describe('item 6 · the class table holds the atoms made after the guard seat\'s final', () => {
  test('court sits, seat held, seat members and paid watch answer their classes', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['court sits', ['office', 'law']], ['seat held', ['office']], ['seat members', ['office']], ['paid watch', ['office', 'law']],
    ], ([atom, classes]) => { for (const c of classes) expect(CLASS_DIMS[c]).toContain(atom); }), 'every atom answers its classes');
  });
  test('PLANTED: a line of office words declared on each answers its class', () => {
    expect(one(`{ text: 'The court sits at the new moon and the magistrates hear what is brought.' }`)).toEqual([
      'law:none :: The court sits at the new moon and the magistrates hear what is brought.',
      'office:none :: The court sits at the new moon and the magistrates hear what is brought.',
    ]);
    expect(one(`{ text: 'The court sits at the new moon and the magistrates hear what is brought.', needs: ['court sits'] }`)).toEqual([]);
    expect(one(`{ text: 'The councillors already sit with the household that asks.', needs: ['seat held'] }`)).toEqual([]);
    expect(one(`{ text: 'Its members cannot agree on anything this season.', needs: ['seat members'] }`)).toEqual([]);
    expect(one(`{ text: 'The night watch draws its pay for every name on the roll.', needs: ['paid watch'] }`)).toEqual([]);
  });
  test('legacy ruin joins no class: no class of the lexicon names a ruin built upon', () => {
    // the sentence is the corpus's own, computed by its identity (DS-GEN-16 LEGACY-RECOVERED vid 2), its slots left as written
    const legacy = variantByVid({ leaf: 'general', blockId: 'DS-GEN-16', poolKey: 'LEGACY-RECOVERED', vid: 2, slots: { settlement: '{settlement}', calamity: '{calamity}', timeband_age: '{timeband_age}' } });
    expect(classesOf(legacy)).toEqual([]);
    // every class of the lexicon, as one collection: the atom item 6 holds (court sits) stands in it, legacy ruin in none
    expectAbsentWithAnchor(Object.values(CLASS_DIMS).flat(), 'legacy ruin', 'court sits', 'no class names a ruin built upon');
  });
});

describe('item 7 · the merchant guilds\' sentence prints only where a power named Merchant Guilds stands', () => {
  const nobles = (rival) => {
    const factions = [{ faction: rival, power: 60, desc: '' }, { faction: 'Noble Families', power: 30, desc: '' }];
    annotateFactionStanding(factions);
    return JSON.stringify(factions);
  };
  test('beside the Merchant Guilds it prints', () => {
    expect(nobles('Merchant Guilds')).toMatch(/The merchant guilds now have more say/);
  });
  test('beside the Grand Merchant Oligarchy, the Merchant Council and the Merchant Princes it never prints', () => {
    expectNoSeedFailures(collectSeedFailures(['Grand Merchant Oligarchy', 'Merchant Council', 'Merchant Princes'], (rival) => {
      // the anchor: the money's sentence the same standing prints beside every rival
      expectAbsentWithAnchor(nobles(rival), 'The merchant guilds now have more say', 'the noble families keep their titles, their land and their precedence, but the money has moved.', rival);
    }), 'beside every other merchant power it never prints');
  });
});

describe('item 8 · "candid" and "forthright" yield to the secrets of deceit only', () => {
  const card = (dominant, what) => temperamentYieldsToSecret({ personality: { dominant, flaw: null }, secret: { what } });
  test('forthright and candid yield beside the four secrets of deceit', () => {
    expectNoSeedFailures(collectSeedFailures([
      ['forthright', 'Their appointment was secured through forged credentials'],
      ['forthright', 'Lied about the battle that earned the lodge\'s honours, and the men who could say otherwise are almost all dead'],
      ['candid', 'Their celebrated origin story is a fabrication they created to escape an intolerable past'],
      ['forthright', 'Falsified the conscription rolls to keep their own household\'s men home'],
    ], ([dominant, what]) => {
      const out = card(dominant, what).personality.dominant;
      expect(out).not.toBe(dominant);
      expect(['honest', 'plain-dealing', 'candid', 'forthright']).not.toContain(out); // anchored: a literal list built here cannot drift; the line above proves the word moved
    }), 'every secret of deceit moves the temperament');
  });
  test('never for a secret of money, nor one the holder only knows of', () => {
    expect(card('forthright', 'Has been paid to lose the case').personality.dominant).toBe('forthright');
    expect(card('candid', 'Knows the deed to the mill was forged').personality.dominant).toBe('candid');
  });
  test('the table\'s form: one pattern per temperament, the deceit words of "honest"', () => {
    expect(String(SECRETS_DENIED_BY_TEMPERAMENT.candid)).toBe(String(SECRETS_DENIED_BY_TEMPERAMENT.honest));
    expect(String(SECRETS_DENIED_BY_TEMPERAMENT.forthright)).toBe(String(SECRETS_DENIED_BY_TEMPERAMENT.honest));
  });
});
