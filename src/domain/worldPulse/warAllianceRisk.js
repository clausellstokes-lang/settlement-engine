/** WR-6 depth-two, belief-side alliance-web retaliation read. */

import { readBeliefRelationship, readBeliefStrength } from './beliefMap.js';
import { alliesOf } from './warCoalitionGraph.js';
import { normalizeRelationshipType } from './relationshipState.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
function codepoint(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

/**
 * Price the enemy's alliance web to depth two.  Truth topology controls who is
 * legally in the web; the candidate court's belief controls every strength read.
 * The enemy itself is priced elsewhere and is therefore excluded here.
 *
 * @param {{rows:ReturnType<import('./warCoalitionGraph.js').canonicalAllianceRows>,observerId:string,enemyId:string,worldState:Record<string,unknown>,strengthFor:(id:string)=>number,excludeIds?:string[]}} args
 */
export function readAllianceWebRisk({ rows, observerId, enemyId, worldState, strengthFor, truthRelationshipFor = null, excludeIds = [] }) {
  const observer = String(observerId);
  const enemy = String(enemyId);
  const excluded = new Set([observer, enemy, ...excludeIds.map(String)]);
  /** @type {Map<string, 1|2>} */
  const depthById = new Map();
  for (const direct of alliesOf(rows, enemy)) {
    if (!excluded.has(direct.allyId)) depthById.set(direct.allyId, 1);
    for (const second of alliesOf(rows, direct.allyId)) {
      if (excluded.has(second.allyId)) continue;
      const prior = depthById.get(second.allyId);
      if (!prior || prior > 2) depthById.set(second.allyId, 2);
    }
  }
  const members = [...depthById.keys()].sort(codepoint).map((subjectId) => {
    const depth = /** @type {1|2} */ (depthById.get(subjectId));
    const truth = clamp01(strengthFor(subjectId));
    const truthRelationship = truthRelationshipFor ? String(truthRelationshipFor(subjectId) || 'neutral') : 'neutral';
    const believedRelationship = normalizeRelationshipType(
      readBeliefRelationship(observer, subjectId, worldState, truthRelationship),
    );
    // The belief label is observer↔subject (the only categorical relationship
    // axis the belief estate actually owns).  A court believed friendly is less
    // likely to retaliate against the observer; a believed rival is more likely.
    const responseWeight = ['allied', 'ally', 'vassal', 'patron', 'defensive_pact'].includes(believedRelationship)
      ? 0.35
      : ['hostile', 'rival', 'cold_war'].includes(believedRelationship) ? 1 : 0.7;
    const believedStrength01 = clamp01(readBeliefStrength(observer, subjectId, worldState, truth)) * responseWeight;
    return { subjectId, depth, believedStrength01, believedRelationship };
  });
  const directRisk = members.filter((row) => row.depth === 1)
    .reduce((sum, row) => sum + row.believedStrength01, 0);
  const secondRisk = members.filter((row) => row.depth === 2)
    .reduce((sum, row) => sum + row.believedStrength01, 0);
  const totalRisk = directRisk * 0.65 + secondRisk * 0.35;
  return {
    members,
    risk01: clamp01(totalRisk),
    band: totalRisk >= 0.7 ? 'decisive' : totalRisk >= 0.45 ? 'pressing' : totalRisk >= 0.2 ? 'present' : 'quiet',
  };
}
