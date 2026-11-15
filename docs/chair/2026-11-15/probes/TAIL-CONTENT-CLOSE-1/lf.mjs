const W = process.argv[2];
const m = await import(W + '/scripts/generate-landing-fixture.mjs');
const a = m.analyze('lf-033');
const show = (t, tag) => {
  console.log(tag, 'activeConditions', JSON.stringify((t.activeConditions||[]).map(c => [c.archetype, c.label, c.status])));
  console.log(tag, 'stressors', JSON.stringify((t.stressors||[]).map(s => s.type || s.kind || s.name)));
  console.log(tag, 'institutions w/ market', JSON.stringify((t.institutions||[]).map(i=>i.name).filter(n=>/market|fair|stall|trad|merchant/i.test(n))));
  console.log(tag, 'institutions', (t.institutions||[]).length);
};
show(a.town, 'BORN'); show(a.townAfter, 'AFTER');
