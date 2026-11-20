/**
 * S9 (PAGE-2, 2026-11-20; docs/chair/2026-11-20/content/page/briefs/S.md S2 and S-v2.md S9): the role-free pool's rows
 * that presume an office, a duty or a trade are TAGGED with the holder classes they fit (src/data/npcData.js ::
 * CRIMINAL_SECRET_HOLDER_TAGS, keyed by text beside the table), and the principled temperament refuses a venal row; both
 * read by ONE draw-free walk after the roll (`npc/factionLeaderSecret.js :: admitsSecretRow`).
 *
 * Arms: (1) the tag table: every key a role-free row, every class a ROLE_CLASS value, `other` in every tag, the row
 * objects untouched; (2) the walk: on one stream, a holder a drawn row refuses takes the next admitted, unheld row of its
 * pool in order, and the stream is left where the admitted holder's draw leaves it (no new draw); the drawn text stays
 * held; (3) the principled temperament takes the next row past a venal one, and an office row too; (4) no class (no role)
 * and an admitted holder print what was drawn.
 */
import { describe, expect, it } from 'vitest';
import { CRIMINAL_SECRET_HOLDER_TAGS, NPC_CRIMINAL_SECRETS_BY_HOLDER, SECRETS_DENIED_BY_TEMPERAMENT } from '../../src/data/npcData.js';
import { OFFICE_SECRETS } from '../../src/data/people/officeSecrets.js';
import { admitsSecretRow, generateFactionLeaderSecret, settleOfficeSecret } from '../../src/generators/npc/factionLeaderSecret.js';
import { onStream } from '../../src/generators/people/representatives.js';
import { ROLE_CLASS } from '../../src/domain/roles/roleClass.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { random } from '../../src/kernel/rngContext.js';

const ANY = NPC_CRIMINAL_SECRETS_BY_HOLDER.any;
const ROLE_FREE = Object.entries(ANY).flatMap(([type, rows]) => rows.map((row) => ({ type, row })));
const CLASSES = new Set(Object.values(ROLE_CLASS));
const VENAL = SECRETS_DENIED_BY_TEMPERAMENT.incorruptible;

/** One draw on its own stream, and the stream's next value after it (equal next values: equal draw counts). */
const drawOn = (/** @type {string} */ seed, /** @type {string | undefined} */ role, held = new Set(), temperament = null) => onStream(createPRNG(seed), () => {
  const row = generateFactionLeaderSecret({}, [], null, role, held, temperament);
  return { row, next: random(), held };
});

describe('S9 · the role-free rows that presume an office, a duty or a trade', () => {
  it('every tag keys a role-free row, names only ROLE_CLASS values, and holds `other`', () => {
    const texts = new Set(ROLE_FREE.map((x) => x.row.secret));
    const faults = [];
    for (const [text, tag] of Object.entries(CRIMINAL_SECRET_HOLDER_TAGS)) {
      if (!texts.has(text)) faults.push(`not a role-free row: ${text}`);
      for (const c of tag) if (!CLASSES.has(c)) faults.push(`${text}: class ${c}`);
      if (!tag.includes('other')) faults.push(`${text}: no other`);
    }
    expect(faults).toEqual([]);
    expect(Object.keys(CRIMINAL_SECRET_HOLDER_TAGS)).toHaveLength(10);
    for (const { row } of ROLE_FREE) expect(Object.keys(row).sort()).toEqual(['secret', 'stakes']);
  });

  it('a refused drawn row takes the next admitted, unheld row of its pool, on the same draws, and the drawn text stays held', () => {
    let seen = 0;
    for (let i = 0; i < 400 && seen < 6; i++) {
      const seed = `s9::${i}`;
      const free = drawOn(seed, 'Wealthiest Merchant'); // merchant: admitted to every business row
      const text = free.row?.secret;
      const tag = CRIMINAL_SECRET_HOLDER_TAGS[text];
      if (!tag || tag.includes('clergy')) continue;
      const type = Object.keys(ANY).find((t) => ANY[t].includes(free.row));
      if (!type || ['religious', 'military'].includes(type)) continue; // a keyed type's pool differs by holder
      seen += 1;
      const refused = drawOn(seed, 'Priest'); // clergy
      const pool = ANY[type];
      const at = pool.indexOf(free.row);
      const inPool = pool.map((_, k) => pool[(at + 1 + k) % pool.length]).slice(0, pool.length - 1).find((r) => admitsSecretRow(r, 'clergy', null));
      const personal = type === 'personal' ? [] : ANY.personal.map((_, k) => ANY.personal[(at + k) % ANY.personal.length]);
      const next = inPool ?? personal.find((r) => admitsSecretRow(r, 'clergy', null)); // the pool's next, else the personal bucket's from the drawn row's place
      expect(refused.row, seed).toBe(next);
      expect(refused.next, `${seed}: no new draw`).toBe(free.next);
      expect(refused.held.has(text), `${seed}: the drawn text stays held`).toBe(true);
    }
    expect(seen).toBeGreaterThan(0);
  });

  it('the principled temperament passes a venal row, and an office row too; an admitted holder prints the draw', () => {
    let seen = 0;
    for (let i = 0; i < 400 && seen < 4; i++) {
      const seed = `s9p::${i}`;
      const brave = drawOn(seed, 'Wealthiest Merchant', new Set(), 'brave');
      if (!VENAL.test(brave.row?.secret ?? '')) continue;
      seen += 1;
      const principled = drawOn(seed, 'Wealthiest Merchant', new Set(), 'principled');
      expect(VENAL.test(principled.row.secret), seed).toBe(false);
      expect(principled.next).toBe(brave.next);
    }
    expect(seen).toBeGreaterThan(0);
    const venalOffice = OFFICE_SECRETS['the priest'].filter((r) => VENAL.test(r.secret));
    expect(venalOffice.length).toBeGreaterThan(0);
    for (const key of ['Ana', 'Bo', 'Cai', 'Dee', 'Eli', 'Fen']) {
      const row = settleOfficeSecret('the priest', key, new Set(), { secret: 'drawn' }, 'principled');
      expect(venalOffice).not.toContain(row);
    }
    expect(admitsSecretRow({ secret: 'Has been falsifying inspection records for a fee' }, null, null), 'no role: no tag read').toBe(true);
    expect(admitsSecretRow({ secret: 'Has been falsifying inspection records for a fee' }, 'office', null)).toBe(true);
    expect(admitsSecretRow({ secret: 'Has been falsifying inspection records for a fee' }, 'clergy', null)).toBe(false);
  });
});
