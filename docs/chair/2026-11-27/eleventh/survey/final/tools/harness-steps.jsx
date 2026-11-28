import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { guildOf } from 'TREE/src/domain/facts/guild.js';
import { factsOf } from 'TREE/src/domain/facts/factsOf.js';
export async function run(plan) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    const seen = [];
    const town = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {}, onStep: (name, ctx) => {
      const rec = { ...ctx, institutions: ctx.institutions, powerStructure: ctx.powerStructure };
      let g, p, t, docks, siege;
      try { g = guildOf(rec); } catch { g = '?'; }
      try { const f = factsOf(rec); p = f.prosperity; t = f.terrain; docks = f.hasInstitution('docks'); } catch (e) { p = 'ERR'; }
      seen.push(`${name}: guild=${g} prosperity=${p} terrain=${t} docks=${docks} factions=${(ctx.powerStructure?.factions || []).map((f) => f.faction || f.name).filter((x) => /guild/i.test(x)).join('/')}`);
    } });
    const f = factsOf(town);
    console.log(row.seed, 'FINAL guild', guildOf(town), 'prosperity', f.prosperity, 'terrain', f.terrain, 'docks', f.hasInstitution('docks'));
    for (const s of seen) console.log('  ', s);
  }
}
