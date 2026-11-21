const R = process.argv[2];
const { generateSettlementPipeline } = await import(R + 'src/generators/generateSettlementPipeline.js');
const t0 = Date.now();
const s = generateSettlementPipeline({ settType: 'town', stressTypes: ['famine', 'wartime'] }, null, { seed: 'probe-1', customContent: {} });
console.log('ms', Date.now() - t0);
const st = Array.isArray(s.stress) ? s.stress : [s.stress];
console.log('stress n', st.length, st.map(e => [e.type, e.forcedByConfig, Object.keys(e.cast || {})]));
console.log('has stressors', 'stressors' in s, s.stressors === s.stress, Array.isArray(s.stressors));
console.log(JSON.stringify(st[0].cast.stakes[0]), JSON.stringify(st[0].cast.roles?.[0]), JSON.stringify(st[0].cast.absent));
