/**
 * PULSE-SITES P1 (the chair's ruling on the reviewer's BLOCK, 2026-11-10): PROMOTE_NPC / DEMOTE_NPC narration names
 * the card's first-rank power ONLY where that membership is stamped `veiled: false` (people/cardVeil.js ::
 * stampMembershipsVeil, the stamp migration 206 reads); a veiled one keeps the base's words, "their power".
 *
 * Why it matters: the narration is the log entry's `narrativeSummary` (events/applyEvent.js), which migration 032's
 * `_gallery_chronicle_entry` publishes verbatim to anon on the gallery page and on a shared campaign's settlements.
 * Three arms, each through the REAL `applyEvent` and the REAL net-current `_gallery_chronicle_entry` in pglite:
 * (a) a member of a HIDDEN power (soak1k-113, the infiltrator `hidden: true`), (b) a member of a CRIMINAL power
 * (soak1k-3, Thieves' Guild) — neither name may reach the entry; (c) a member of an OPEN power with an unveiled
 * membership (soak1k-3), whose name IS printed, so the cure cannot pass by blanking everything.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { firstRankMembershipOf, powerOrderOf } from '../../src/domain/people/membership.js';
import { isVeiledPower } from '../../src/domain/people/cardVeil.js';
import { applyEvent } from '../../src/domain/events/applyEvent.js';

const MIG_032 = resolve(process.cwd(), 'supabase/migrations/032_gallery_public_chronicle.sql');

/** A first-rank member of a power picked by a predicate on its row, and a swap peer (a second member of the same
 *  power where there is one, else any other named card: the narration reads only the target). */
function pairIn(settlement, pick) {
  const order = powerOrderOf(settlement);
  const power = settlement.powerStructure.factions.find((f) => pick(f)
    && settlement.npcs.some((n) => n.id && firstRankMembershipOf(n, order)?.power === f.faction));
  if (!power) return {};
  const members = settlement.npcs.filter((n) => n.id && firstRankMembershipOf(n, order)?.power === power.faction);
  const peer = members[1] || settlement.npcs.find((n) => n.id && n !== members[0]);
  return { power: power.faction, a: members[0], b: peer, veiled: firstRankMembershipOf(members[0], order).veiled };
}

/** @type {Record<string, any>} */
const arms = {};
/** @type {PGlite} */
let db;

beforeAll(async () => {
  await ensureLaws();
  const hiddenTown = birth(113).settlement;
  const town = birth(3).settlement;
  arms.hidden = { s: hiddenTown, ...pairIn(hiddenTown, (f) => f.hidden === true) };
  arms.criminal = { s: town, ...pairIn(town, (f) => String(f.category || '').toLowerCase() === 'criminal') };
  arms.open = { s: town, ...pairIn(town, (f) => !isVeiledPower(f)) };
  db = new PGlite();
  const sql = readFileSync(MIG_032, 'utf8');
  const m = sql.match(/^create\s+or\s+replace\s+function\s+public\._gallery_chronicle_entry\b[\s\S]*?\n\$\$;/im);
  await db.exec(m[0]);
}, 180_000);

/** Commit one event through the real applyEvent and project its log entry through the real SQL. */
async function committed(arm, type) {
  const event = { id: `ev-${type}-${arm.a.id}`, type, targetId: arm.a.id, payload: { swapWithNpcId: arm.b.id }, cause: 'dm_direct' };
  const { logEntry } = applyEvent({ settlement: arm.s, event, now: '2026-11-10T00:00:00.000Z' });
  const r = await db.query('select public._gallery_chronicle_entry($1::jsonb) as e', [JSON.stringify(logEntry)]);
  return { summary: String(logEntry.narrativeSummary || ''), projected: JSON.stringify(r.rows[0].e) };
}

describe('the public chronicle never names a veiled power through PROMOTE/DEMOTE narration (P1)', () => {
  it('the three arms stand on real records: a hidden pair, a criminal pair, an open unveiled pair', () => {
    expect(arms.hidden.power).toBeTruthy();
    expect(arms.hidden.veiled).toBe(true);
    expect(arms.criminal.power).toBeTruthy();
    expect(arms.criminal.veiled).toBe(true);
    expect(arms.open.power).toBeTruthy();
    expect(arms.open.veiled).toBe(false);
  });

  for (const which of ['hidden', 'criminal']) {
    for (const type of ['PROMOTE_NPC', 'DEMOTE_NPC']) {
      it(`(${which}) ${type}: neither the log entry nor the public projection names the power`, async () => {
        const arm = arms[which];
        const { summary, projected } = await committed(arm, type);
        expect(summary).toContain(arm.a.name); // anchored: the narration ran on this card
        expect(summary).toContain('their power');
        expect(summary).not.toContain(arm.power);
        expect(projected).toContain('their power');
        expect(projected).not.toContain(arm.power);
      });
    }
  }

  for (const type of ['PROMOTE_NPC', 'DEMOTE_NPC']) {
    it(`(open) ${type}: an unveiled first-rank membership IS named, in the entry and in the projection`, async () => {
      const arm = arms.open;
      const { summary, projected } = await committed(arm, type);
      expect(summary).toContain(arm.power);
      expect(projected).toContain(arm.power);
    });
  }
});
