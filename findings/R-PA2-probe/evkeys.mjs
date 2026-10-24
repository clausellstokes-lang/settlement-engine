// R-PA2 probe: the keys a dossier history event carries (is there a stable id to reference?)
const base = new URL('./cor/src/', import.meta.url);
const { composeInstantWorld, loadGenerationLawPayloads } = await import(new URL('lib/instantWorld/composeInstantWorld.js', base));
await loadGenerationLawPayloads();
const b = composeInstantWorld({ seed: 'pa2-probe', basicConfig: { realmSize: 'small' } });
const keys = new Set(); const tKeys = new Set(); const fKeys=new Set(); let ids=0;
for (const m of b.settlements) { const h=m.settlement.history; for (const e of h.historicalEvents) { Object.keys(e).forEach(k=>keys.add(k)); if (e.id!=null) ids++; }
  for (const t of h.currentTensions) Object.keys(t).forEach(k=>tKeys.add(k)); Object.keys(h.founding).forEach(k=>fKeys.add(k)); }
console.log('event keys', [...keys].join(','), '| events with id', ids);
console.log('tension keys', [...tKeys].join(','));
console.log('founding keys', [...fKeys].join(','));
console.log('top-level settlement keys', Object.keys(b.settlements[0].settlement).join(','));
