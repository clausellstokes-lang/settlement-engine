/**
 * COHERENCE-VEIL-2: write the Force-all record and its two veils (default; every eye the panel offers
 * shut) as JSON files into DUMP_DIR, for the profile and the read-only checks run by hand on the
 * scratch cluster. FORCE_ALL names the request (deploy-check-force-all.json beside this file).
 */
import { it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { everyEye } from './client.mjs';

it('dumps the Force-all row', async () => {
  const { generateSettlementPipeline: gen } = await import('../../../../src/generators/generateSettlementPipeline.js');
  const { composePublicProse } = await import('../../../../src/components/new/publicProseCompose.js');
  const veil = await import('../../../../src/domain/display/galleryVeil.js');
  const req = JSON.parse(readFileSync(process.env.FORCE_ALL || resolve(import.meta.dirname, 'deploy-check-force-all.json'), 'utf-8'));
  const raw = gen(req.config, null, { seed: req.seed, customContent: {} });
  const rec = { ...raw, publicProse: composePublicProse(raw) };
  const pub = veil.galleryPayloadFor(rec, {});
  const dir = process.env.DUMP_DIR;
  writeFileSync(resolve(dir, 'fa-rec.json'), JSON.stringify(rec));
  writeFileSync(resolve(dir, 'fa-all.json'), JSON.stringify(veil.writeShareVeil({}, everyEye(veil, pub).map((address) => ({ address, hidden: true })))));
  writeFileSync(resolve(dir, 'fa-def.json'), JSON.stringify(veil.writeShareVeil({}, [])));
});
