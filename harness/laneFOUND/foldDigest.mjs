#!/usr/bin/env node
/**
 * CAR-FOUND · the fold's per-leaf digest, for a BASE-vs-TIP drawing delta.
 * Run in both trees and `diff` the two outputs. Every figure a reader can re-derive.
 */
import { CORPUS, buildOne } from '../exemplars.mjs';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage } from '../../src/domain/townMap/fabric/partitionView.js';
import { seatPartition } from '../../src/domain/townMap/fabric/partitionSeating.js';
import { colonizationFromLedger } from '../../src/domain/townMap/fabric/growthLedger.js';
import { liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { shaObject } from '../instruments/digest.mjs';
import { partitionInputs } from '../laneSPINE1/partitionPerf.mjs';

const only = (process.argv.find((a) => a.startsWith('--leaves=')) || '').slice(9);
const list = only ? CORPUS.filter((s) => only.split(',').includes(s.key)) : CORPUS;

for (const spec of list) {
  const { settlement, model, fabric } = buildOne(spec);
  const input = partitionInputs(settlement, model, fabric);
  const P = buildSettledPartition(input);
  const page = projectPage(P, { roadWidth: input.roadWidth });
  const seat = seatPartition(P, page, settlement, {
    prosperity: (settlement.economicState && settlement.economicState.prosperity) || null,
    tier: fabric.meta.tier,
  });
  const col = colonizationFromLedger(input.ledger, 0.5);
  const led = input.ledger;
  const geom = shaObject({
    v: liveFaces(P.arrangement).map((f) => `${f.id}:${f.cls}`).join(','),
  });
  const emSouls = led.emissions.reduce((n, e) => n + e.souls, 0);
  console.log([
    spec.key.padEnd(12),
    `plots=${String(P.plots).padStart(5)}`,
    `faces=${String(liveFaces(P.arrangement).length).padStart(5)}`,
    `wraps=${P.wraps.length}`,
    `gates=${String(P.gates.length).padStart(2)}`,
    `pEmit=${String(P.emissions.length).padStart(2)}`,
    `lEmit=${String(led.emissions.length).padStart(2)}`,
    `lSouls=${String(emSouls).padStart(5)}`,
    `refus=${P.waterRefusals}/${P.gateEconomyRefusals}/${P.sprawlRefusals}/${P.emissionRefusals}`,
    `seats=${String(seat.seats.length).padStart(3)}`,
    `physViol=${seat.physicalViolations}`,
    `colon=${col.colonised ? `y@${col.atYear}` : 'n'}`,
    `geom=${geom}`,
  ].join(' '));
}
