const files = ['defense','economy','general','power','stressors','warFaith'];
let pools = 0, byRole = {}, withRelation = 0, withAttach = 0, blocks = 0;
for (const f of files) {
  const m = await import(`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneSEAM/src/data/dossierStateProse/${f}.generated.js`);
  const corpus = Object.values(m)[0];
  for (const [bid, b] of Object.entries(corpus)) {
    blocks += 1;
    for (const [k, meta] of Object.entries(b.poolMeta || {})) {
      pools += 1;
      byRole[meta.role] = (byRole[meta.role] || 0) + 1;
      if (meta.relation) withRelation += 1;
      if (Array.isArray(meta.attach) && meta.attach.length) withAttach += 1;
    }
  }
}
console.log(`blocks ${blocks} · pools ${pools} · roles ${JSON.stringify(byRole)} · with relation ${withRelation} · with non-empty attach ${withAttach}`);
