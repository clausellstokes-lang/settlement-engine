// VEIL-53, RULING V4 term (3): the cause of PAGES' 33 LOST "Notable connection" lines (prominentRelationship) on reads that
// hide nothing. For each birth of the banked 720 (censusPlan('r2', 1)), on the trial join: does the public projection
// (toPublicSafe) carry prominentRelationship, and does withholdCovertCopies (the veil's covert-copy rule, Reveal off) drop it?
// Each drop classed: IDENTITY (a covert tie with the copy's two ends and type: the covert tie's own copy), TEXT-ONLY (only a
// covert tie's description or tension equals the copy's), UNSURE (a covert tie with an empty end, or relationships unread).
// Also: is the copy's own tie (same ends and type among relationships[]) covert?
import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
const J = '/home/user/join53/';
it('prominentRelationship drops on the banked 720', async () => {
  const { censusPlan, configOf } = await import(J + 'tests/components/pageCensusWalk.shared.mjs');
  const { generateSettlementPipeline } = await import(J + 'src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(J + 'src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import(J + 'src/store/configSlice.js');
  const { toPublicSafe } = await import(J + 'src/domain/display/publicSafe.js');
  const { withholdCovertCopies } = await import(J + 'src/domain/display/gallerySecondHomes.js');
  await loadGenerationLawPayloads();
  const s = (v) => (typeof v === 'string' ? v : '');
  const rows = []; const tally = {};
  for (const row of censusPlan('r2', 1)) {
    const town = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
    const pub = toPublicSafe(town);
    if (!pub || !('prominentRelationship' in pub)) { tally.noCopyOnP0 = (tally.noCopyOnP0 || 0) + 1; continue; }
    const out = withholdCovertCopies(pub, town, false);
    if ('prominentRelationship' in out) { tally.kept = (tally.kept || 0) + 1; continue; }
    const pr = town.prominentRelationship || {};
    const rels = Array.isArray(town.relationships) ? town.relationships : [];
    const cov = rels.filter((t) => t && t.covert === true);
    const ident = cov.some((t) => s(t.npc1Name) === s(pr.npc1) && s(t.npc2Name) === s(pr.npc2) && s(t.typeName) === s(pr.type));
    const text = cov.some((t) => (s(pr.full) !== '' && t.description === pr.full) || (s(pr.tension) !== '' && t.tension === pr.tension));
    const unsure = !Array.isArray(town.relationships) || cov.some((t) => s(t.npc1Name) === '' || s(t.npc2Name) === '');
    const own = rels.find((t) => t && s(t.npc1Name) === s(pr.npc1) && s(t.npc2Name) === s(pr.npc2) && s(t.typeName) === s(pr.type));
    const cls = ident ? 'IDENTITY' : text ? 'TEXT-ONLY' : unsure ? 'UNSURE' : 'OTHER';
    tally[cls] = (tally[cls] || 0) + 1;
    rows.push({ seed: row.seed, cls, ownTieCovert: own ? own.covert === true : 'no-own-tie', covertTies: cov.length, pr: { npc1: pr.npc1, npc2: pr.npc2, type: pr.type, tension: s(pr.tension).slice(0, 80) } });
  }
  writeFileSync('/var/tmp/v53/probes-pr/prcause.json', JSON.stringify({ tally, rows }, null, 1));
  console.log('PRCAUSE', JSON.stringify(tally));
});
