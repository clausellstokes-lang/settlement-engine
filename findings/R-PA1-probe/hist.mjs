// R-PA1 probe: measure settlement.history across tiers/seeds (byte-copy of code of record @81f1cd963)
const { generateSettlementPipeline } = await import('./mcr/src/generators/generateSettlementPipeline.js');
const tiers = ['thorp','hamlet','village','town','city','metropolis'];
const N = Number(process.argv[2] || 40);
const stats = {}; const typeCount = {}; const tmplCount = {}; const keysSeen = {}; const evKeys = {}; let nonDet = 0, preFound = 0, nonInt = 0, negYear = 0, idCount = 0, total = 0;
const foundedBy = {}; const tensTypes = {}; const histKeys = {}; const topKeys = new Set();
const t0 = Date.now();
for (const tier of tiers) {
  const ages = []; const counts = [];
  for (let i = 0; i < N; i++) {
    const seed = `pa1-${tier}-${i}`;
    const s = generateSettlementPipeline({ settType: tier }, null, { seed });
    if (i < 3) { const s2 = generateSettlementPipeline({ settType: tier }, null, { seed }); if (JSON.stringify(s.history) !== JSON.stringify(s2.history)) nonDet++; }
    Object.keys(s).forEach(k => topKeys.add(k));
    const h = s.history; total++;
    Object.keys(h).forEach(k => histKeys[k] = (histKeys[k]||0)+1);
    ages.push(h.age); counts.push(h.historicalEvents.length);
    foundedBy[h.founding.foundedBy] = (foundedBy[h.founding.foundedBy]||0)+1;
    for (const e of h.historicalEvents) {
      Object.keys(e).forEach(k => evKeys[k] = (evKeys[k]||0)+1);
      typeCount[e.type] = (typeCount[e.type]||0)+1;
      tmplCount[e.templateType || ('(none) '+e.name)] = (tmplCount[e.templateType || ('(none) '+e.name)]||0)+1;
      if (e.yearsAgo > h.age) preFound++;
      if (!Number.isInteger(e.yearsAgo)) nonInt++;
      if (e.id || e.eventId || e.campaignEventId) idCount++;
    }
    for (const t of h.eventsTimeline) if (t.year < 0) negYear++;
    for (const t of h.currentTensions) tensTypes[t.type] = (tensTypes[t.type]||0)+1;
  }
  ages.sort((a,b)=>a-b); counts.sort((a,b)=>a-b);
  stats[tier] = { tierOut: tier, ageMin: ages[0], ageMed: ages[ages.length>>1], ageMax: ages.at(-1), evMin: counts[0], evMed: counts[counts.length>>1], evMax: counts.at(-1) };
}
console.log(JSON.stringify({ N, ms: Date.now()-t0, stats, total, nonDet, preFound, nonInt, negYear, idCount, histKeys, evKeys, typeCount, tmplCount, tensTypes, foundedByDistinct: Object.keys(foundedBy).length, topKeys: [...topKeys].sort() }, null, 1));
