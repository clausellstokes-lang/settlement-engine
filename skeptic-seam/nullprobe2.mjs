const SK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepSEAM';
const { populationTrendBand } = await import(SK+'/src/domain/display/trendLens.js');
for (const a of [undefined, null, [], {}]) {
  try { console.log('OK  ', JSON.stringify(a), '->', JSON.stringify(populationTrendBand(a))); }
  catch (e) { console.log('THROW', JSON.stringify(a), e.message.slice(0,120)); }
}
