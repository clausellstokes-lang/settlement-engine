// REVIEW-VEIL-5, by hand: what does a side's own PAGE draw for the roster document of hand/roster.sql?
// (the client's projection, then its veil, over the row as the server at 203 sends it for a Reveal-DM share: unstripped)
import { it } from 'vitest';
import { appendFileSync } from 'node:fs';
it('roster page', async () => {
  const M = `${process.env.RV5_SRC}/src`;
  const { toPublicSafe } = await import(`${M}/domain/display/publicSafe.js`);
  const veil = await import(`${M}/domain/display/galleryVeil.js`);
  const ada = { id: 'npc_1', name: 'Ada Hidden', role: 'reeve', secret: 'RV5SECRET_ADA', goal: { short: 'RV5GOAL_ADA' } };
  const doc = { name: 'Rostertown', tier: 'town', npcs: [{ ...ada, factionAffiliation: 'Town Council' }, { id: 'npc_2', name: 'Bo Shown', role: 'smith', secret: 'RV5SECRET_BO' }],
    factions: [{ name: 'Town Council', members: [ada] }], powerStructure: { factions: [{ faction: 'Town Council', category: 'government', members: [ada] }] } };
  for (const [k, ov] of [['unmarked', { npc_1: { revealDm: false } }], ['marked', { npc_1: { revealDm: false }, $veil: { v: 1, deltas: [] } }]]) {
    const page = veil.projectShareVeil(toPublicSafe(structuredClone(doc), { full: true, memberOverrides: ov }), ov);
    const t = JSON.stringify(page);
    appendFileSync(process.env.RV5_OUT, `PAGE ${process.env.RV5_SIDE} ${k}: ada secret ${/RV5SECRET_ADA/.test(t)} ada goal ${/RV5GOAL_ADA/.test(t)} bo secret ${/RV5SECRET_BO/.test(t)} keys ${Object.keys(page).join(',')} roster ${JSON.stringify(page.factions || null).slice(0, 160)} ps ${JSON.stringify(page.powerStructure?.factions?.[0]?.members || null).slice(0, 160)}\n`);
  }
});
