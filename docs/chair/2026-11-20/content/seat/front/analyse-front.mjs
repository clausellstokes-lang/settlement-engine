#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/front/analyse-front.mjs — FRONT-MEASURE's arithmetic over front-default.json and
 * front-presets.json (written by measure-front.mjs). Draw-free over the rows; writes front-figures.json.
 *   node docs/chair/2026-11-20/content/seat/front/analyse-front.mjs
 * The pool a rate is applied to: the eligible heads that are WILLING (greed | hunger_for_status) and NOT already an
 * agent (today's deal is left unmoved), in towns holding crime on record under the criterion named.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const load = (arm) => JSON.parse(readFileSync(join(HERE, `front-${arm}.json`), 'utf8'));
const POOLS = { default: load('default').rows, presets: load('presets').rows };
POOLS.both = [...POOLS.default, ...POOLS.presets];
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };
const CRITERIA = {
  power: (t) => t.crimPowers > 0,
  independentPower: (t) => t.independent > 0,
  bm10: (t) => t.bm > 10, bm20: (t) => t.bm > 20, bm30: (t) => t.bm > 30,
  'power|bm10': (t) => t.crimPowers > 0 || t.bm > 10,
  'power|bm20': (t) => t.crimPowers > 0 || t.bm > 20,
  'power|bm30': (t) => t.crimPowers > 0 || t.bm > 30,
};
const poolOf = (t) => t.heads.filter((h) => h.willing && !h.agent);
const expectHolding = (towns, crit, r) => towns.reduce((s, t) => s + (crit(t) ? 1 - (1 - r) ** poolOf(t).length : 0), 0);
const solve = (towns, crit, target) => { let lo = 0; let hi = 1; for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2; if (expectHolding(towns, crit, m) < target) lo = m; else hi = m; } return (lo + hi) / 2; };
const r4 = (x) => Math.round(x * 10000) / 10000;

const figures = {};
for (const [name, towns] of Object.entries(POOLS)) {
  const F = { towns: towns.length };
  // (1) today's allegiances
  const al = { townsWithOne: 0, cards: 0, via: {}, vector: {}, handler: 0, noHandler: 0, frontHead: 0, frontHeadRank1: 0, frontHeadWilling: 0 };
  for (const t of towns) {
    if (t.al.total) al.townsWithOne += 1;
    al.cards += t.al.total; al.handler += t.al.handler; al.noHandler += t.al.noHandler;
    al.frontHead += t.al.frontHead; al.frontHeadRank1 += t.al.frontHeadRank1; al.frontHeadWilling += t.al.frontHeadWilling;
    for (const [k, v] of Object.entries(t.al.via)) bump(al.via, k, v);
    for (const [k, v] of Object.entries(t.al.vector)) bump(al.vector, k, v);
  }
  F.allegiances = al;
  // (2) crime on record
  const bms = towns.map((t) => t.bm).filter((x) => x != null).sort((a, b) => a - b);
  F.record = { crimPower: towns.filter((t) => t.crimPowers > 0).length, independent: towns.filter((t) => t.independent > 0).length,
    rulerCriminal: towns.filter((t) => t.rulerCriminal).length,
    bm: { min: bms[0], p50: bms[Math.floor(bms.length / 2)], p90: bms[Math.floor(bms.length * 0.9)], p99: bms[Math.floor(bms.length * 0.99)], max: bms[bms.length - 1],
      over10: bms.filter((x) => x > 10).length, over20: bms.filter((x) => x > 20).length, over30: bms.filter((x) => x > 30).length },
    frontHeadsAll: towns.reduce((s, t) => s + t.frontHeadsAll, 0), frontHeadsCrim: towns.reduce((s, t) => s + t.frontHeadsCrim, 0), frontHeadsOffice: towns.reduce((s, t) => s + t.frontHeadsOffice, 0) };
  // (2)+(3) eligibility and the seat, per criterion
  F.criteria = {};
  for (const [cname, crit] of Object.entries(CRITERIA)) {
    const on = towns.filter(crit);
    const gate = on.reduce((s, t) => s + t.heads.length, 0);
    const willing = on.reduce((s, t) => s + t.heads.filter((h) => h.willing).length, 0);
    const pool = on.reduce((s, t) => s + poolOf(t).length, 0);
    const townsWithPool = on.filter((t) => poolOf(t).length).length;
    const seatPool = on.filter((t) => poolOf(t).some((h) => h.seat)).length;
    const seatGate = on.filter((t) => t.heads.some((h) => h.seat)).length;
    const hatPool = on.filter((t) => poolOf(t).some((h) => h.hatFace)).length;
    const seatIsHat = on.filter((t) => t.seatIsHatFace).length;
    const seatAgentWilling = on.filter((t) => t.heads.some((h) => h.seat && h.willing && h.agent)).length;
    const row = { townsOnRecord: on.length, headsGate: gate, headsWilling: willing, poolWillingNotAgent: pool, townsWithPool, seatGate, seatPool, seatAgentWilling, hatFacePool: hatPool, seatIsHatFace: seatIsHat };
    for (const [label, target] of [['1in50', towns.length / 50], ['1in200', towns.length / 200]]) {
      if (expectHolding(towns, crit, 1) < target) { row[label] = { rate: null, note: 'unreachable even at 1' }; continue; }
      const r = solve(towns, crit, target);
      const drawHolding = on.filter((t) => poolOf(t).some((h) => h.u < r)).length;
      const drawSeat = on.filter((t) => poolOf(t).some((h) => h.seat && h.u < r)).length;
      row[label] = { rate: r4(r), expectHolding: r4(expectHolding(towns, crit, r)), expectSeatBorn: r4(r * seatPool), drawHolding, drawSeatBorn: drawSeat };
    }
    F.criteria[cname] = row;
  }
  // (6) the capture probe under today's rule
  const probe = {};
  for (const t of towns) if (t.probe) bump(probe, `${t.probe.before} -> ${t.probe.after} (agentRung ${t.probe.afterAgentRung}, underworld ${t.probe.underworld ? 'yes' : 'no'})`);
  F.captureProbe = probe;
  F.probeExample = towns.find((t) => t.probe && t.probe.underworld)?.probe?.receipt || null;
  figures[name] = F;
}
// a fixed-rate cross-check: the recommended rates applied to every pool, executed draw beside expectation
const FIXED = [0.01, 0.02, 0.03, 0.05, 0.1];
for (const [name, towns] of Object.entries(POOLS)) {
  figures[name].fixed = {};
  for (const [cname, crit] of Object.entries(CRITERIA)) {
    figures[name].fixed[cname] = FIXED.map((r) => {
      const on = towns.filter(crit);
      return { r, expectHolding: r4(expectHolding(towns, crit, r)), drawHolding: on.filter((t) => poolOf(t).some((h) => h.u < r)).length,
        expectSeatBorn: r4(r * on.filter((t) => poolOf(t).some((h) => h.seat)).length), drawSeatBorn: on.filter((t) => poolOf(t).some((h) => h.seat && h.u < r)).length };
    });
  }
}
writeFileSync(join(HERE, 'front-figures.json'), `${JSON.stringify(figures, null, 1)}\n`);
process.stderr.write('wrote front-figures.json\n');
