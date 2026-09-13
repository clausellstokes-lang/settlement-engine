const SK='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM';
const { generalDeskLines } = await import(SK+'/src/components/new/generalDeskRead.js');
for (const [label, arg] of [['null', null], ['undefined', undefined], ['{}', {}]]) {
  try {
    const out = generalDeskLines(arg, { publicDossier:false, playerView:false, stresses: [], populationTrend: undefined });
    console.log('OK  ', label, 'keys:', Object.keys(out).join(','));
  } catch (e) { console.log('THROW', label, e.constructor.name + ': ' + String(e.message).slice(0,160)); }
}
