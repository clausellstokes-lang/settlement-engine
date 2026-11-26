// BIRTH-1, unit D2 (the prominent tie is never a covert one): the measure of one birth, read from the RAW record only (the oracle
// is the record's own ties, never the picker): is the stored `prominentRelationship` the copy of a tie the record flags
// `covert: true` (same two names and the same description), and does the stored `pressureSentence` name both ends of one.
import { createHash } from 'node:crypto';
export function measure(town) {
  const rels = Array.isArray(town?.relationships) ? town.relationships : [];
  const covert = rels.filter((r) => r && r.covert === true);
  const pr = town?.prominentRelationship ?? null;
  const prCovert = !!pr && covert.some((r) => pr.npc1 === r.npc1Name && pr.npc2 === r.npc2Name && pr.full === r.description);
  const prAny = !!pr && rels.some((r) => pr.npc1 === r.npc1Name && pr.npc2 === r.npc2Name && pr.full === r.description);
  const prPair = !!pr && covert.some((r) => [pr.npc1, pr.npc2].includes(r.npc1Name) && [pr.npc1, pr.npc2].includes(r.npc2Name));
  const ps = typeof town?.pressureSentence === 'string' ? town.pressureSentence : '';
  const psBoth = covert.filter((r) => r.npc1Name && r.npc2Name && ps.includes(r.npc1Name) && ps.includes(r.npc2Name));
  return {
    ties: rels.length, covert: covert.length, allCovert: rels.length > 0 && covert.length === rels.length,
    pr: pr ? 1 : 0, prCovert, prPair, prAny, prType: pr?.type ?? null,
    psBoth: psBoth.length, ps: psBoth.length ? ps : undefined, prText: prCovert ? pr.phrasing : undefined,
    prHash: pr ? JSON.stringify(pr) : null, psHash: ps,
    restHash: createHash('sha256').update(JSON.stringify({ ...town, prominentRelationship: null, pressureSentence: null })).digest('hex'),
  };
}
