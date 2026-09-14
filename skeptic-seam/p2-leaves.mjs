const base = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/src/data/dossierStateProse/';
const desks = ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith'];
let pools = 0, metas = 0, clause = 0, modifier = 0, turn = 0, spine = 0, withRelation = 0, withAttach = 0, variants = 0, withWordings = 0;
const roles = {};
const seats = {};
for (const d of desks) {
  const m = await import(base + d + '.generated.js');
  const corpus = m.default || Object.values(m)[0];
  for (const [blockId, block] of Object.entries(corpus)) {
    for (const [k, v] of Object.entries(block.pools || {})) {
      pools += 1; variants += v.length;
      for (const varnt of v) if (Array.isArray(varnt.wordings)) withWordings += 1;
    }
    for (const [k, meta] of Object.entries(block.poolMeta || {})) {
      metas += 1;
      roles[meta.role || '(absent)'] = (roles[meta.role || '(absent)'] || 0) + 1;
      seats[meta.seat === undefined ? '(absent)' : meta.seat] = (seats[meta.seat === undefined ? '(absent)' : meta.seat] || 0) + 1;
      if (meta.seat === 'clause') clause += 1;
      if (meta.role === 'modifier') modifier += 1;
      if (meta.role === 'turn') turn += 1;
      if (meta.role === 'spine') spine += 1;
      if (meta.relation) withRelation += 1;
      if (Array.isArray(meta.attach) && meta.attach.length) withAttach += 1;
    }
  }
}
console.log('pools', pools, 'variants', variants, 'variants with wordings', withWordings);
console.log('poolMeta rows', metas, 'roles', JSON.stringify(roles), 'seats', JSON.stringify(seats));
console.log('clause-seated', clause, 'modifier-role', modifier, 'turn-role', turn, 'spine-role', spine, 'with relation', withRelation, 'with NON-EMPTY attach', withAttach);
