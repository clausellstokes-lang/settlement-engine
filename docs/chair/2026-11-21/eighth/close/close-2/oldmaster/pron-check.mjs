const T = process.argv[2];
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { goldenCorpus } = await import(`${T}/tests/helpers/goldenMasterCorpus.js`);
const re = /[^."]{0,60}\b(him|her) (distrusts|cannot|has|is|was|wants|owes|knows|will|would|does|thinks|believes|fears|needs|can|keeps|took|gave|says|said|resents|trusts|wonders)\b[^."]{0,30}/;
let n = 0, hit = 0; const ex = [];
for (const c of goldenCorpus().slice(0, 120)) {
  const { _seed, ...cfg } = c; n++;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  const m = JSON.stringify({ r: s.relationships, p: s.prominentRelationship }).match(re);
  if (m) { hit++; if (ex.length < 4) ex.push(`${cfg.settType}: ${m[0]}`); }
}
console.log(`dark line: ${hit} of ${n} rows`); console.log(ex.join('\n'));
