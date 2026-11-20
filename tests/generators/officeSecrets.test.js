/**
 * L4 (PAGE-2, 2026-11-20; docs/chair/2026-11-20/content/page/briefs/S-v2.md): an office face's secret, settled DRAW-FREE
 * after the draw (src/data/people/officeSecrets.js, `npc/factionLeaderSecret.js :: settleOfficeSecret`).
 *
 * Arms: (1) the table — every key a pool-map title the title table does not write, three `{ secret, stakes }` rows each,
 * clean fragments, no text shared with the title table or any holder's pool of the secret draw, two titles share rows only by identity;
 * (2) the draw is UNCHANGED — an office face born on a stream prints every field the untitled face prints on the same
 * stream, but its secret, which is its own row at the card's `pickVariant` key, and the held set keeps the DRAWN text
 * beside the office text; (3) the walk — a held row passes to the next in row order, every row held keeps the drawn
 * secret; the ROTATION (the chair's addition): cards of one calling in one town never show one row twice, the rows run
 * out to the drawn secret, and with none drawn the last row stands marked `repeated`; (4) a title with no office rows is
 * untouched.
 */
import { describe, expect, it } from 'vitest';
import { OFFICE_SECRETS } from '../../src/data/people/officeSecrets.js';
import { TITLE_SECRETS } from '../../src/data/people/titleSecretsPresentations.js';
import { NPC_CRIMINAL_SECRETS_BY_HOLDER } from '../../src/data/npcData.js';
import { POOL_BY_TITLE } from '../../src/generators/people/poolMap.js';
import { generateSingleNPC } from '../../src/generators/npcGenerator.js';
import { settleOfficeSecret } from '../../src/generators/npc/factionLeaderSecret.js';
import { onStream } from '../../src/generators/people/representatives.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { pickVariant } from '../../src/kernel/proseHash.js';
import { textAssertsFunctionalMagic } from '../../src/domain/magicAssertionText.js';

const OFFICE_TITLES = Object.keys(OFFICE_SECRETS);
const registry = (/** @type {Set<string>} */ secrets = new Set()) => ({ titles: new Set(), themes: new Set(), tells: new Set(), speech: new Set(), goals: new Set(), secrets });
/** A face born on its own stream, as representatives.js births one. @param {string | undefined} title @param {Set<string>} [held] */
const face = (title, held = new Set(), seed = 'l4') => {
  const [role, category, titleKey] = POOL_BY_TITLE[title || 'the dean'];
  const reg = registry(held);
  const card = onStream(createPRNG(`${seed}::${title}`), () => generateSingleNPC(role, titleKey, category, 'germanic', 'city', {}, [], reg, null, { hook: false, title }));
  return { card, held: reg.secrets };
};
/** The same stream, the same role, no title: the draw as it is with no office rows. @param {string} title */
const untitled = (title, held = new Set(), seed = 'l4') => {
  const [role, category, titleKey] = POOL_BY_TITLE[title];
  const reg = registry(held);
  const card = onStream(createPRNG(`${seed}::${title}`), () => generateSingleNPC(role, titleKey, category, 'germanic', 'city', {}, [], reg, null, { hook: false, title: undefined }));
  return { card, held: reg.secrets };
};
const rowAt = (/** @type {string} */ title, /** @type {string} */ name) => pickVariant(OFFICE_SECRETS[title], `${name}::officeSecret::${title}`);

describe('L4 · the office secrets table', () => {
  it('every key is a pool-map title the title table does not write, with three clean rows of the record shape', () => {
    expect(OFFICE_TITLES.slice().sort()).toEqual([
      'the abbot', 'the bishop', 'the captain of the watch', 'the chief magistrate', 'the dean', 'the garrison commander',
      'the magistrate', 'the militia captain', 'the priest', 'the senior abbot', 'the watch captain',
    ]);
    const faults = [];
    for (const title of OFFICE_TITLES) {
      if (!POOL_BY_TITLE[title]) faults.push(`${title}: not a pool-map title`);
      if (Object.hasOwn(TITLE_SECRETS, title)) faults.push(`${title}: the title table writes it`);
      const rows = OFFICE_SECRETS[title];
      if (rows.length !== 3) faults.push(`${title}: ${rows.length} rows`);
      for (const row of rows) {
        if (Object.keys(row).sort().join(',') !== 'secret,stakes') faults.push(`${title}: keys ${Object.keys(row)}`);
        for (const text of [row.secret, row.stakes]) {
          if (!/^[A-Z]/.test(text) || /[.!?]$/.test(text) || /\b(himself|herself)\b|\{|undefined|\s{2,}/i.test(text) || textAssertsFunctionalMagic(text)) faults.push(`${title}: ${text}`);
        }
      }
    }
    expect(faults).toEqual([]);
  });

  it('no office text repeats a title-table line or any line of the pools of the secret draw; two titles share rows only as one set', () => {
    const elsewhere = new Set([
      ...Object.values(TITLE_SECRETS).flat().map((r) => r.secret),
      ...Object.values(NPC_CRIMINAL_SECRETS_BY_HOLDER).flatMap((byType) => Object.values(byType).flat()).map((r) => r.secret),
    ]);
    const sets = [...new Set(Object.values(OFFICE_SECRETS))];
    const texts = sets.flat().map((r) => r.secret);
    expect(texts.length).toBe(27);
    expect(new Set(texts).size).toBe(texts.length);
    expect(texts.filter((t) => elsewhere.has(t))).toEqual([]);
    expect(OFFICE_SECRETS['the magistrate']).toBe(OFFICE_SECRETS['the chief magistrate']);
    expect(OFFICE_SECRETS['the watch captain']).toBe(OFFICE_SECRETS['the captain of the watch']);
  });
});

describe('L4 · settled draw-free after the draw', () => {
  it.each(OFFICE_TITLES)('%s: every field but the secret is the untitled face\'s; the secret is its own row; the drawn text stays held', (title) => {
    const a = face(title);
    const b = untitled(title);
    const { secret: sa, ...restA } = a.card;
    const { secret: sb, ...restB } = b.card;
    expect(restA).toEqual(restB);
    const row = rowAt(title, a.card.name);
    expect(sa).toEqual({ what: row.secret, stakes: row.stakes });
    expect(sb?.what, 'the untitled face drew a role-free line').not.toBe(row.secret);
    // the held set is the untitled face's (its drawn text, and S9's walked text where its draw was refused) and the office row
    expect([...a.held].sort()).toEqual([...b.held, row.secret].sort());
    expect(a.held.has(sb.what)).toBe(true);
  });

  it('a held office row passes to the next in row order; with all three held the drawn secret stands', () => {
    const title = 'the dean';
    const rows = OFFICE_SECRETS[title];
    const { card } = face(title);
    const at = rows.indexOf(rowAt(title, card.name));
    const next = rows[(at + 1) % rows.length];
    const held = face(title, new Set([rows[at].secret]));
    expect(held.card.name).toBe(card.name);
    expect(held.card.secret.what).toBe(next.secret);
    const allHeld = face(title, new Set(rows.map((r) => r.secret)));
    const drawn = untitled(title, new Set(rows.map((r) => r.secret)));
    expect(allHeld.card.secret).toEqual(drawn.card.secret);
    expect(rows.map((r) => r.secret)).not.toContain(allHeld.card.secret.what);
  });

  it('ROTATION (the chair\'s addition): cards of one calling in one town, born in roster order, never show one row twice', () => {
    /** Born in order on one roster's registry, each on its own stream. @param {string[]} titles */
    const roster = (titles) => {
      const reg = registry();
      return titles.map((title, i) => {
        const [role, category, titleKey] = POOL_BY_TITLE[title];
        return onStream(createPRNG(`rot::${i}`), () => generateSingleNPC(role, titleKey, category, 'germanic', 'city', {}, [], reg, null, { hook: false, title }));
      });
    };
    const three = roster(['the priest', 'the priest', 'the priest']);
    expect(new Set(three.map((c) => c.secret.what)).size).toBe(3);
    for (const c of three) expect(OFFICE_SECRETS['the priest'].map((r) => r.secret)).toContain(c.secret.what);
    const bench = roster(['the magistrate', 'the chief magistrate']);
    expect(bench[0].secret.what).not.toBe(bench[1].secret.what);
    // the rows run out: the fourth keeps the secret it drew (admitted to it: L4 tags nothing)
    const four = roster(['the priest', 'the priest', 'the priest', 'the priest']);
    expect(OFFICE_SECRETS['the priest'].map((r) => r.secret)).not.toContain(four[3].secret.what);
    expect(four[3].secret.what).toEqual(expect.any(String));
    // nothing drawn and every row held: the walk's last row stands, marked to be counted
    const rows = OFFICE_SECRETS['the priest'];
    const last = settleOfficeSecret('the priest', 'Ana', new Set(rows.map((r) => r.secret)), null);
    const at = rows.indexOf(rowAt('the priest', 'Ana'));
    expect(last).toEqual({ ...rows[(at + 2) % 3], repeated: true });
    expect(settleOfficeSecret('the priest', 'Ana', new Set(rows.map((r) => r.secret)), { secret: 'drawn' })).toBeNull();
    expect(settleOfficeSecret('the miller', 'Ana', new Set(), null)).toBeNull();
  });

  it('a title with no office rows is untouched (the title table\'s and a mint\'s)', () => {
    for (const title of ['the miller', 'the watch commander']) {
      const [role, category, titleKey] = POOL_BY_TITLE[title];
      const born = onStream(createPRNG(`l4::${title}`), () => generateSingleNPC(role, titleKey, category, 'germanic', 'city', {}, [], registry(), null, { hook: false, title }));
      const all = Object.values(OFFICE_SECRETS).flat().map((r) => r.secret);
      // anchored: the collection is every office row (27, counted above); the card's secret is drawn
      expect(all).not.toContain(born.secret?.what);
      expect(born.secret?.what).toEqual(expect.any(String));
    }
  });
});
