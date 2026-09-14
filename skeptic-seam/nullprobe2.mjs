const SK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM';
const { populationTrendBand } = await import(SK+'/src/domain/display/trendLens.js');
for (const a of [undefined, null, [], {}]) {
  try { console.log('OK  ', JSON.stringify(a), '->', JSON.stringify(populationTrendBand(a))); }
  catch (e) { console.log('THROW', JSON.stringify(a), e.message.slice(0,120)); }
}
