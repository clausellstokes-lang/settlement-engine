import fs from 'node:fs';
const SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad';
const files={
  M1_600y: `${SC}/capacity-horizon/artifacts/horizon-600y-4s-lit.json`,
  M2_lit:  `${SC}/capacity-horizon/artifacts/probe-30y-12s-lit.json`,
  M2_dark: `${SC}/capacity-horizon/artifacts/probe-30y-12s-dark.json`,
  s907_300y: `${SC}/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json`,
  s909_30y_lit: `${SC}/soak909/fresh-30y-4s-lit.json`,
  s909_30y_dark: `${SC}/soak909/fresh-30y-4s.json`,
};
for(const [k,p] of Object.entries(files)){
  if(!fs.existsSync(p)){console.log(k,'MISSING',p);continue;}
  const j=JSON.parse(fs.readFileSync(p,'utf8'));
  const b=j.receipt??j;
  const ym=b.yearlyMs||b.behavioral?.yearlyMs;
  console.log(k, JSON.stringify({
    schemaVersion:b.schemaVersion, passed:b.passed, years:b.years, settlements:b.settlements,
    seed:b.seed, runDurationsMs:b.runDurationsMs,
    demog:b.subsystems?.rules?.demographicsEnabled,
    yearlyPopulationsRows: b.yearlyPopulations?.length, width: b.yearlyPopulations?.[0]?.length,
    yearlyDiedFlagsRows: b.yearlyDiedFlags?.length,
    yearlyMsLen: Array.isArray(ym)?ym.length:typeof ym,
    peakHeap:b.peakHeapUsedBytes, finalHash: (b.finalHash||'').slice(0,14),
    topKeys: Object.keys(b).length
  }));
}
