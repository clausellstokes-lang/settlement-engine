// R-PA1 probe: merge N dossiers' histories into one realm timeline (proposal a); measure what is linkable in time.
const { generateSettlementPipeline } = await import('./mcr/src/generators/generateSettlementPipeline.js');
const MIX = ['city','town','town','village','village','village','hamlet','thorp'];
const WORLDS = Number(process.argv[2] || 40);
const LINKABLE = new Set(['external_threat','occupation_legacy','infiltration_fear','population_friction','trade_collapse','outside_debt','plague_years','pilgrimage_surge','heresy_trial','religious_tension','disputed_land','trade_dispute']);
let ev = 0, beforeClock = 0, linkTmpl = 0, linkTmplBeforeClock = 0, partnersAvail = 0, spanSum = 0, clockSum = 0, ties = 0; const oldestTier = {};
const spans = [];
for (let w = 0; w < WORLDS; w++) {
  const towns = MIX.map((tier, i) => { const s = generateSettlementPipeline({ settType: tier }, null, { seed: `realm-${w}-${i}` }); return { tier, age: s.history.age, events: s.history.historicalEvents }; });
  const ages = towns.map(t => t.age).sort((a,b) => b-a);
  const A = ages[0], clock = A - ages[1]; // realm year 0 = oldest founding; clock starts at second-oldest founding
  if (ages[0] === ages[1]) ties++;
  oldestTier[towns.find(t => t.age === A).tier] = (oldestTier[towns.find(t => t.age === A).tier]||0)+1;
  spans.push(A); clockSum += ages[1];
  for (const t of towns) for (const e of t.events) {
    ev++; const realmYear = A - e.yearsAgo;
    const isLink = LINKABLE.has(e.templateType);
    if (realmYear < clock) beforeClock++;
    if (isLink) { linkTmpl++; if (realmYear < clock) linkTmplBeforeClock++;
      // other towns already founded at that realm year
      const others = towns.filter(o => o !== t && (A - o.age) <= realmYear).length; if (others > 0) partnersAvail++; }
  }
}
spans.sort((a,b)=>a-b);
console.log(JSON.stringify({ WORLDS, mix: MIX, events: ev, eventsBeforeClock: beforeClock, pctBeforeClock: +(100*beforeClock/ev).toFixed(1),
  linkableTemplateEvents: linkTmpl, linkableBeforeClock: linkTmplBeforeClock, linkableWithAPartnerFoundedThen: partnersAvail, pctLinkableWithPartner: +(100*partnersAvail/linkTmpl).toFixed(1),
  realmSpanYears: { min: spans[0], med: spans[spans.length>>1], max: spans.at(-1) }, meanSecondOldestAge: Math.round(clockSum/WORLDS), ageTies: ties, oldestTier }, null, 1));
