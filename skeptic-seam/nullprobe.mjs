const SK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepSEAM';
const { generalDeskLines } = await import(SK+'/src/components/new/generalDeskRead.js');
for (const [label, arg] of [['null', null], ['undefined', undefined], ['{}', {}]]) {
  try {
    const out = generalDeskLines(arg, { publicDossier:false, playerView:false, stresses: [], populationTrend: undefined });
    console.log('OK  ', label, 'keys:', Object.keys(out).join(','));
  } catch (e) { console.log('THROW', label, e.constructor.name + ': ' + String(e.message).slice(0,160)); }
}
