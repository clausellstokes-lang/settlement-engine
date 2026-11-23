/**
 * COHERENCE-VEIL phase 1 (a), the frozen copy and the $veil shape: a snapshot is served VERBATIM
 * by the gallery read, and the link's strip removes one key (the VEIL-FIX review's low finding 2).
 * Run: npx vitest run --config docs/chair/2026-11-11/veil-probe/vitest.probe.config.mjs frozen
 */
import { it, expect } from 'vitest';
import { bootChain } from './chain.mjs';

it('the gallery read returns the frozen copy as stored; the link strips one key', async () => {
  const { db, failed } = await bootChain();
  expect(failed).toEqual([]);
  const O = '11111111-1111-1111-1111-111111111111';
  await db.exec(`insert into auth.users (id) values ('${O}'); insert into public.profiles (id) values ('${O}') on conflict do nothing; update public.profiles set role = 'developer' where id = '${O}';`);
  const PLANT = { name: 'Old Copy', criminalCaptureState: { capturedBy: 'PLANT-CAPTURE' }, npcs: [{ id: 'n1', name: 'A', secret: 'PLANT-SECRET' }], seed: 'PLANT-SEED' };
  const rows = [
    ['snapshot', { $veil: { v: 1, deltas: [], mode: 'snapshot', at: '2026-01-01T00:00:00Z', snapshot: PLANT } }],
    ['array', { $veil: [] }],
    ['string', { $veil: 'x' }],
    ['extra-key', { $veil: { v: 1, deltas: [], copy: { secret: 'PLANT-EXTRA' } } }],
  ];
  const out = {};
  for (const [i, [tag, ov]] of rows.entries()) {
    const id = `aaaaaaaa-0000-0000-0000-00000000000${i + 1}`;
    await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides)
      values ($1, $2, 'T', 'town', '{"name":"T"}', true, $3, now(), $4, 'unlisted', $5)`, [id, O, `p${i}`, `l${i}`, JSON.stringify(ov)]);
    await db.exec(`set test.uid = '';`);
    const g = await db.query('select gallery_member_overrides from public.get_gallery_dossier($1)', [`p${i}`]).then((r) => JSON.stringify(r.rows[0]?.gallery_member_overrides)).catch((e) => `ERROR ${e.message}`);
    const l = await db.query('select public.get_unlisted_dossier($1) as o', [`l${i}`]).then((r) => JSON.stringify(r.rows[0]?.o?.gallery_member_overrides)).catch((e) => `ERROR ${e.message}`);
    out[tag] = { gallery: g, link: l };
  }
  console.log(JSON.stringify(out, null, 1));
  expect(out.snapshot.gallery).toContain('PLANT-SECRET');
  expect(out.snapshot.gallery).toContain('PLANT-CAPTURE');
  expect(out.snapshot.link).not.toContain('PLANT');
  expect(out.array.link).toMatch(/^ERROR/);
  expect(out['extra-key'].link).toContain('PLANT-EXTRA');
});
