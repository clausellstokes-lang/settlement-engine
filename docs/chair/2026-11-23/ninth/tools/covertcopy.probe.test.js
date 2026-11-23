// A read-only probe (the ninth chair, 2026-11-23): on the WORKING LINE as it stands, does the public projection serve
// the copy of a covert (handler) tie at `prominentRelationship`? Nothing is written anywhere.
import { test, expect } from 'vitest';
import { generateSettlementPipeline } from '/home/user/wt/line/src/generators/generateSettlementPipeline.js';
import { toPublicSafe } from '/home/user/wt/line/src/domain/display/publicSafe.js';

test('covert tie copy on the public projection (count only)', () => {
  const sizes = ['town', 'city', 'metropolis'];
  let births = 0, withCovert = 0, copyIsCovert = 0, servedCopy = 0;
  const cases = [];
  for (const settType of sizes) {
    for (let i = 0; i < 60; i++) {
      const s = generateSettlementPipeline({ settType, culture: 'germanic' }, null, { seed: `ccp-${settType}-${i}`, customContent: {} });
      births++;
      const ties = Array.isArray(s.relationships) ? s.relationships : [];
      const covert = ties.filter((t) => t && t.covert === true);
      if (!covert.length) continue;
      withCovert++;
      const pr = s.prominentRelationship;
      if (!pr || typeof pr !== 'object') continue;
      const hit = covert.find((t) => t.npc1Name === pr.npc1 && t.npc2Name === pr.npc2);
      if (!hit) continue;
      copyIsCovert++;
      const pub = toPublicSafe(s);
      const servedPr = pub && pub.prominentRelationship;
      const tieServed = (Array.isArray(pub?.relationships) ? pub.relationships : []).some((t) => t && t.npc1Name === pr.npc1 && t.npc2Name === pr.npc2);
      if (servedPr && servedPr.npc1 === pr.npc1 && servedPr.npc2 === pr.npc2) {
        servedCopy++;
        if (cases.length < 3) cases.push({ seed: `ccp-${settType}-${i}`, tieServedInList: tieServed, servedKeys: Object.keys(servedPr), type: servedPr.type });
      }
    }
  }
  console.log(JSON.stringify({ births, withCovert, copyIsCovert, servedCopy, cases }, null, 1));
  expect(births).toBe(180);
});
