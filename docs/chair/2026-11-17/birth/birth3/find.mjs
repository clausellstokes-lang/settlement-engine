// BIRTH-3 re-key finder: TREE=<tree> node find.mjs <corpus> : towns bearing each claim the red tests need
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R = process.env.TREE + '/src';
const CSR = await import(R + '/domain/display/crisisStoppedRow.js');
const VP = await import(R + '/domain/display/validationOnPage.js');
const HI = await import(R + '/domain/facts/houseInputAtHand.js');
const EC = await import(R + '/domain/display/economicsCrisisMarks.js');
const { liveInstitutions } = await import(R + '/domain/institutions/institutionRoster.js');
const { hasTradeRouteConnection } = await import(R + '/domain/tradeRouteSemantics.js');
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const F = {}; const add = (k, v) => { (F[k] ||= []).push(v); };
const svcs = (s) => Object.values(s.availableServices || {}).flat().filter((x) => x && typeof x === 'object');
for await (const line of rl) {
  if (!line) continue; const { seed, s } = JSON.parse(line);
  const lines = VP.resourceGapLines(s).map((l) => l.impact);
  const conn = hasTradeRouteConnection(String(s.config?.tradeRouteAccess)); const siege = (s.config?.stressTypes || []).includes('under_siege');
  const byInst = (re) => liveInstitutions(s).filter((i) => re.test(i.name));
  for (const b of byInst(/^Charcoal burner$/)) {
    const cs = svcs(s).find((x) => x.institution === b.name && x.name === 'Charcoal supply');
    if (lines.includes('No timber reaches the charcoal burner.') && cs && /^Short of /.test(CSR.rowMarkText(s, 'service', cs) || '')) add('burner-short', `${seed}${conn ? '' : ' [no road]'} house:${CSR.rowMarkText(s, 'house', b)}`);
  }
  for (const b of byInst(/^Salt works$/)) if (/^Short of salt\./.test(CSR.rowMarkText(s, 'house', b) || '')) add('salt-short', `${seed}${conn ? '' : ' [no road]'}`);
  for (const b of byInst(/^Dairy farmer$/)) { const m = svcs(s).filter((x) => x.institution === b.name && /^Daily milk from cattle/.test(x.desc || '')).map((x) => CSR.rowMarkText(s, 'service', x)); if (m.some((x) => x === 'Short of livestock.')) add('dairy-short', `${seed}${conn ? '' : ' [no road]'}`); }
  for (const b of byInst(/^Vintner$/)) if (!conn && (s.resourceAnalysis?.gaps || []).some((g) => g.institution === b.name && g.chain === 'grapes' && g.kind === 'missing')) add('vintner-noroad', seed);
  for (const b of byInst(/^Sawmill \(commercial\)$/)) if ((s.resourceAnalysis?.gaps || []).filter((g) => g.institution === b.name && g.kind === 'missing').length >= 2) add('commsawmill-missing', `${seed}${conn ? '' : ' [no road]'} lines:${lines.filter((l) => /sawmill/.test(l)).join('|')}`);
  for (const b of byInst(/^Sawmill$/)) if ((s.resourceAnalysis?.gaps || []).some((g) => g.institution === b.name && g.kind === 'missing' && g.chain === 'timber')) add('sawmill-missing', `${seed}${conn ? '' : ' [no road]'}`);
  const wool = (s.economicState?.incomeSources || []).find((x) => x.source === 'Wool & Textile Trade');
  if (wool && /^Short of wool\./.test(EC.incomeMarkShown(s, wool) || '')) add('wool-share-short', `${seed}${siege ? ' [siege]' : ''}${conn ? '' : ' [no road]'}`);
  const v = HI.ventureHouseOf(s); if (v) add('venture', `${seed}:${v.name}:${v.venture}:${v.ground || '-'}`);
}
for (const [k, v] of Object.entries(F)) console.log(k, v.length, '\n   ', v.slice(0, 14).join('\n    '));
