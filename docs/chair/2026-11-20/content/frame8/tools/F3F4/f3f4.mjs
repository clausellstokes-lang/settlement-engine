// FRAME-9 · F3+F4: owner and stranger digests over the 330-town calm pool at one tree, the counts, and the first-chain
// question (brief frame9/F3F4-BUILD-2.md (i)). Read-only.
// argv: <pool.json (frame6/tools/pool.mjs 55)> <tree src/ (trailing slash)> <out.json>
import fs from 'node:fs';
import crypto from 'node:crypto';
const [POOL, R, OUT] = process.argv.slice(2);
const T = await import(R + 'domain/summary/tonightSheet.js');
const { troubleOfWeight } = await import(R + 'domain/tension/troubleCast.js');
const { chainPrintName } = await import(R + 'domain/display/chainPrintName.js');
const { chainSourceOf } = await import(R + 'domain/display/chainHouses.js');
const { isHideableHouse } = await import(R + 'domain/people/cardVeil.js');
const { towns } = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const d = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const digests = {};
const C = { towns: 0, calm: 0, framed: 0, byStrain: {}, w3Supply: 0, w4Hall: 0, rowOffStrain: 0, strangerRow: 0, firstChainLacks: 0, w3Impaired: 0, w3ImpairedChains: 0, criminalChains: 0, firstHideableProcessors: 0, anyHideableProcessors: 0, houses: {}, lines: [] };
/** The roster houses of a chain's trade (chainHouses.js's reading: the pattern's first twelve letters at a word's start). */
const housesOf = (chain, s) => (chain.processingInstitutions || []).flatMap((pattern) => {
  const p = String(pattern || '');
  const re = new RegExp(`(?:^|[\\s'"(-])${p.slice(0, 12).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
  return (s.institutions || []).filter((i) => i && re.test(String(i.name || '')));
});
for (const { seed, tier, s } of towns) {
  C.towns++;
  const owner = T.composeTonightSheet(s, { audience: 'owner' });
  const stranger = T.composeTonightSheet(s);
  const strain = owner.frame ? troubleOfWeight(s)?.strain?.strain : null;
  digests[seed] = { owner: d(owner), stranger: d(stranger), framed: !!owner.frame, strain };
  const ids = (sheet) => sheet.facts.map((f) => f.id);
  if (ids(stranger).some((i) => i === 'supply' || i === 'hall')) C.strangerRow++;
  if (!owner.frame) { C.calm++; if (ids(owner).some((i) => i === 'supply' || i === 'hall')) C.rowOffStrain++; continue; }
  C.framed++;
  C.byStrain[strain] = (C.byStrain[strain] || 0) + 1;
  const supply = owner.facts.find((f) => f.id === 'supply');
  const hall = owner.facts.find((f) => f.id === 'hall');
  if (supply && strain !== 'W3') C.rowOffStrain++;
  if (hall && strain !== 'W4') C.rowOffStrain++;
  if (strain === 'W3') {
    // (i): the first impaired chain in the record's order, read here from the record: does it lack a name, source or cause?
    const impaired = (s.economicState?.activeChains || []).filter((c) => c && c.status === 'impaired');
    if (impaired.length) {
      C.w3Impaired++;
      const first = impaired[0];
      C.w3ImpairedChains += impaired.length;
      C.criminalChains += impaired.filter((c) => c.needKey === 'criminal_economy').length;
      for (const c of impaired) if (housesOf(c, s).some(isHideableHouse)) C.anyHideableProcessors++;
      if (housesOf(first, s).some(isHideableHouse)) C.firstHideableProcessors++;
      for (const h of housesOf(first, s)) C.houses[String(h.name)] = (C.houses[String(h.name)] || 0) + 1;
      const printed = chainPrintName(first, s);
      const lacks = !printed.label || !chainSourceOf(first, printed) || first.resourceCondition !== 'depleted';
      if (lacks) { C.firstChainLacks++; C.lines.push(`LACKS ${seed}: ${first.chainId} ${first.resourceCondition}`); }
    }
    if (supply) { C.w3Supply++; C.lines.push(`${seed} (${tier}) Supply: ${supply.text}`); }
  }
  if (strain === 'W4' && hall) { C.w4Hall++; C.lines.push(`${seed} (${tier}) The hall: ${hall.text}`); }
}
fs.writeFileSync(OUT, JSON.stringify({ counts: C, digests }, null, 1));
const { lines, ...c } = C;
console.log(JSON.stringify(c));
console.log(lines.join('\n'));
