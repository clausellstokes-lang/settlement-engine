/**
 * warFrontReads.js — the ONE provenance-gated war-front read surface.
 *
 * channelIdFor keys a channel on (type, from, to) ONLY, so a hostile RELATIONSHIP
 * bundle (region/graph.js relationshipChannelBundle §hostile) and a war-layer SIEGE
 * (mintDirectedChannel source 'war_layer_deploy') collide on the SAME war_front id.
 * The two are distinguished by evidence provenance: a relationship front carries
 * `source: 'relationship_label'`; a war-layer front carries a `war_layer*` tag (the
 * sticky ownership tag addRegionalChannels carries forward across label collisions).
 *
 * Reading ANY confirmed war_front as a live siege is the phantom-siege bug: a bare
 * hostile relationship — no army behind it, never through the mobilization/
 * feasibility gates — then reads as a siege (phantom war_pressure / war_drain), a
 * false "lifts the siege" recovery on an army's return, a fake garrison presence.
 * Every siege-DETECTION read MUST go through isLiveWarFront (directly or via the
 * warFrontsInto/From helpers here) so the gate can't diverge across call sites. This
 * module is imported by warDeployment.js AND its sibling readers (deploymentReturn,
 * settlementStrategy, occupation) — it depends only on region/graph.js, so it can
 * never form an import cycle with the war-layer orchestrator.
 */
import { hasWarLayerEvidence } from '../region/graph.js';

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * True if a war_front's provenance is a RELATIONSHIP-LABEL bundle (a 'relationship_label'
 * evidence source, minted by graph.js relationshipChannelBundle §hostile) and it carries
 * NO war-layer ownership tag. A front that is relationship-tagged WITHOUT a war-layer tag
 * is a pure hostility front, not a mobilized siege. (A war-layer front that has ALSO
 * accreted a relationship_label row still reads as war-layer-owned via
 * hasWarLayerEvidence, so it is NOT a phantom.)
 * @param {any} channel
 * @returns {boolean}
 */
export function isRelationshipMintedFront(channel) {
  const evidence = channel?.evidence;
  return Array.isArray(evidence)
    && evidence.some(item => item?.source === 'relationship_label')
    && !hasWarLayerEvidence(evidence);
}

/**
 * The READ-SIDE SIEGE GATE: a CONFIRMED war_front is a live siege UNLESS its provenance
 * is a pure hostile-RELATIONSHIP bundle (isRelationshipMintedFront). A war-layer front
 * (hasWarLayerEvidence) and a bare/light/legacy front are still read as sieges.
 * @param {any} channel
 * @returns {boolean}
 */
export function isLiveWarFront(channel) {
  return channel?.type === 'war_front'
    && channel.status === 'confirmed'
    && !isRelationshipMintedFront(channel);
}

/**
 * Active CONFIRMED WAR-LAYER war_front channels FROM a settlement, codepoint-sorted by
 * `to`. Hostile-relationship fronts are NOT counted — they are not sieges.
 * @param {any} graph @param {any} fromId @returns {string[]}
 */
export function warFrontsFrom(graph, fromId) {
  const out = [];
  for (const channel of graph?.channels || []) {
    if (!isLiveWarFront(channel)) continue;
    if (String(channel.from) !== String(fromId)) continue;
    out.push(String(channel.to));
  }
  return out.sort(codepoint);
}

/**
 * Active CONFIRMED WAR-LAYER war_front channels INTO a settlement (besiegers),
 * codepoint-sorted. Hostile-relationship fronts are NOT read as besiegers.
 * @param {any} graph @param {any} toId @returns {string[]}
 */
export function warFrontsInto(graph, toId) {
  const out = [];
  for (const channel of graph?.channels || []) {
    if (!isLiveWarFront(channel)) continue;
    if (String(channel.to) !== String(toId)) continue;
    out.push(String(channel.from));
  }
  return out.sort(codepoint);
}
