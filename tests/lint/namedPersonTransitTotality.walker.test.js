/**
 * namedPersonTransitTotality.walker.test.js — WR-7a law M's movement-site guard.
 *
 * The discovery signature follows every production file that either writes the Roads
 * leg clock, validates an injected envoy plan, calls the shared named-person physics,
 * or delegates to an established named-person mover. Every discovered site must be in
 * the closed route manifest below, and every manifest row must still be discoverable.
 *
 * This is intentionally a physics census, not a census of all entity placement writes:
 * first placement, admission, undo, and display interpolation do not open or advance a
 * route leg. A new route-leg writer cannot take that exemption merely by changing its
 * filename: the executable timing/delegation signatures are what discover it.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DOMAIN = join(ROOT, 'src', 'domain');

const SHARED_TRANSIT_FILE = 'src/domain/worldPulse/namedPersonTransit.js';
const DISCOVERY_RE = /\b(?:openNamedPersonLeg|namedPersonLegTicks|namedPersonLegPosition|namedPersonPathPosition|namedPersonArrivalTick|advanceWanderer|advanceLivedTraveller|advanceAssignedNpcTransits|walkLivedJourney)\s*\(|\blegArrivalTick\s*(?::|=)|\bnormalizeRoutePlan\s*\(/;
const SHARED_IMPORT_RE = /from\s+['"][^'"]*namedPersonTransit\.js['"]/;

/**
 * Every physics site and its explicit route to the shared authority. `injected` is the
 * envoy state machine: it validates a plan supplied by the transit owner but does not
 * price or advance a leg itself.
 */
const MOVEMENT_SITES = Object.freeze({
  'src/domain/roads/seaRoads.js': { route: 'direct', token: 'namedPersonPathPosition' },
  'src/domain/roads/state.js': { route: 'direct', token: 'namedPersonArrivalTick' },
  'src/domain/worldPulse/envoyErrand.js': { route: 'direct', token: 'namedPersonLegPosition' },
  'src/domain/worldPulse/npcCirculationTransit.js': { route: 'direct', token: 'openNamedPersonLeg' },
  'src/domain/worldPulse/npcDmVerbs.js': { route: 'delegate', token: 'advanceLivedTraveller' },
  'src/domain/worldPulse/npcResidency.js': { route: 'delegate', token: 'advanceWanderer' },
  'src/domain/worldPulse/pulseKernel.js': { route: 'delegate', token: 'advanceAssignedNpcTransits' },
  'src/domain/worldPulse/roadsKernel.js': { route: 'direct', token: 'namedPersonPathPosition' },
  'src/domain/worldPulse/routeNetworkConsumersRace.js': { route: 'delegate', token: 'walkLivedJourney' },
  'src/domain/worldPulse/routeNetworkConsumersTransit.js': { route: 'direct', token: 'namedPersonLegTicks' },
});

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.js$/.test(entry) && !/\.test\./.test(entry)) out.push(path);
  }
  return out;
}

/** Strip comments so prose cannot make a movement site appear compliant/discoverable. */
function executableSource(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

/** Return the balanced block introduced by `marker`, or an empty string. */
function blockAfter(source, marker) {
  const match = marker.exec(source);
  if (!match) return '';
  const open = source.indexOf('{', match.index + match[0].length);
  if (open < 0) return '';
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    else if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }
  return '';
}

function discoverMovementSites() {
  const found = [];
  for (const absolute of walk(DOMAIN)) {
    const rel = relative(ROOT, absolute).replace(/\\/g, '/');
    if (rel === SHARED_TRANSIT_FILE) continue;
    if (DISCOVERY_RE.test(executableSource(readFileSync(absolute, 'utf8')))) found.push(rel);
  }
  return found.sort();
}

/** The direct arithmetic forms the shared leaf is meant to make uninhabitable. */
function directBypasses(source) {
  const code = executableSource(source);
  const violations = [];
  if (/Math\.max\(\s*1\s*,[^;\n]*hopWeeks\s*\(/.test(code)) {
    violations.push('prices hopWeeks behind a local Math.max(1, ...) floor');
  }
  if (/\blegArrivalTick\s*(?::|=)[^;\n]*\b(?:weekClock|tick)\b\s*\+/.test(code)) {
    violations.push('writes a leg arrival as clock + local duration');
  }
  if (/clamp01\s*\([^;\n]*(?:tick|weekClock|now)[^;\n]*\/[^;\n]*(?:arrival|span|weeks)/i.test(code)) {
    violations.push('derives named-person progress with a local clock fraction');
  }
  if (/moveNpcRecord\s*\(\s*\{[\s\S]{0,300}?hostSettlementId\s*:\s*(?:target|settlementId)\b[\s\S]{0,300}?\}\s*\)/.test(code)) {
    violations.push('teleports a DM assignment directly to its target');
  }
  // ASSIGN's production movement abstraction is `placeNpcRecord`, not the lower-level
  // writer above. Only the route-lit arm is prohibited from naming its final target;
  // the legacy-dark arm and the advancer's mature final arrival are lawful placements.
  // Extracting the balanced lit block makes this detector follow that exact boundary.
  const livedAssignment = blockAfter(code, /if\s*\(\s*livedTransit\s*\)\s*/);
  if (/placeNpcRecord\s*\([\s\S]{0,240}?,\s*(?:target|settlementId)\b/.test(livedAssignment)) {
    violations.push('teleports a lived DM assignment through its placement delegate');
  }
  return violations;
}

describe('WR-7a law M — named-person transit site totality', () => {
  const discovered = discoverMovementSites();

  it('discovers exactly the registered named-person physics sites', () => {
    expect(discovered).toEqual(Object.keys(MOVEMENT_SITES).sort());
  });

  it('every site reaches the shared kernel directly, by a named delegate, or by injected plan', () => {
    const failures = [];
    for (const rel of discovered) {
      const row = MOVEMENT_SITES[rel];
      const source = readFileSync(join(ROOT, rel), 'utf8');
      const code = executableSource(source);
      if (!source.includes(row.token)) failures.push(`${rel}: missing route token ${row.token}`);
      if (row.route === 'direct' && !SHARED_IMPORT_RE.test(code)) {
        failures.push(`${rel}: direct physics owner does not import namedPersonTransit.js`);
      }
      if (row.route === 'delegate' && SHARED_IMPORT_RE.test(code)) {
        failures.push(`${rel}: declared delegate now imports the shared leaf directly; update its route row`);
      }
      if (row.route === 'injected' && SHARED_IMPORT_RE.test(code)) {
        failures.push(`${rel}: declared injected-plan validator now imports the shared leaf; update its route row`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('no registered site retains a second speed floor, arrival writer, or position fraction', () => {
    const failures = [];
    for (const rel of discovered) {
      for (const reason of directBypasses(readFileSync(join(ROOT, rel), 'utf8'))) {
        failures.push(`${rel}: ${reason}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('the bypass detector discriminates on planted timing, position, and DM-teleport controls', () => {
    const planted = `
      const weeks = Math.max(1, hopWeeks(digest, fromId, toId));
      mission.legArrivalTick = weekClock + weeks;
      const progress = clamp01((weekClock - departTick) / arrivalWeeks);
      moveNpcRecord({ worldState, wnpcId, hostSettlementId: target, sinceTick: tick });
    `;
    expect(directBypasses(planted)).toEqual([
      'prices hopWeeks behind a local Math.max(1, ...) floor',
      'writes a leg arrival as clock + local duration',
      'derives named-person progress with a local clock fraction',
      'teleports a DM assignment directly to its target',
    ]);
    expect(directBypasses('const label = "one week";')).toEqual([]);
  });

  it('kills a production-shaped mutation from the lived ASSIGN departure to its final target', () => {
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/npcDmVerbs.js'), 'utf8');
    const departure = 'placeNpcRecord(worldState, text(wnpcId), null, at, {';
    const mutant = source.replace(
      departure,
      'placeNpcRecord(worldState, text(wnpcId), target, at, {',
    );
    expect(mutant).not.toBe(source);
    expect(directBypasses(source)).not.toContain(
      'teleports a lived DM assignment through its placement delegate',
    );
    expect(directBypasses(mutant)).toContain(
      'teleports a lived DM assignment through its placement delegate',
    );
  });

  it('the reputation race remains routed through the lived named-person journey', () => {
    const race = readFileSync(join(ROOT, 'src/domain/worldPulse/routeNetworkConsumersRace.js'), 'utf8');
    const transit = readFileSync(join(ROOT, 'src/domain/worldPulse/routeNetworkConsumersTransit.js'), 'utf8');
    expect(executableSource(race)).toMatch(/walkLivedJourney\s*\(/);
    expect(executableSource(race)).toMatch(/storyArrivalTicks\s*\(/);
    expect(SHARED_IMPORT_RE.test(executableSource(transit))).toBe(true);
  });
});
