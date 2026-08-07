/**
 * TCD-1 — THE GOVERNING SEAT'S NEWS ADDRESS, pinned against REAL generator output.
 *
 * The defect this guards: every `.id` read over a `powerStructure.factions` row is
 * inert. Measured through the full generateSettlementPipeline, 0 of 2,175 faction
 * rows across 360 settlements carry `id`. So `readWarSeatBooks` emitted no
 * `factionId`, `warTermination` never spread one into its receipt, and
 * `warRulingsNews` omitted `factionIds` from every WR-5 entry — a gap in the
 * address chain the NEWS ADDRESS LAW requires, and one that also made
 * `warRulingsNews.factionName`'s third arm (`${settlementId}:${stablePart(name)}`)
 * a reader with no writer.
 *
 * ⚠ THESE PINS MUST NOT BE MOVED ONTO A FIXTURE. Every `.id`-shaped faction
 * fixture in this repo (`{ id: 'fac.crown', ... }`) is a record no generator
 * makes, and fixtures of exactly that shape are what hid the four earlier
 * members of this defect class. Expectations here are DERIVED from the
 * settlement under test, never transcribed, and the corpus is multi-seed so no
 * single lucky world can carry the suite.
 */
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { governingFactionOf, nameOf } from '../../src/domain/rulingPower.js';
import { realmFactionPulseId } from '../../src/domain/dossier/realmEntityWeb.js';
import { ladderFactionKey } from '../../src/domain/worldPulse/npcLadderState.js';
import { seatTransitionGoverningFactionId } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { stablePart } from '../../src/domain/worldPulse/stablePart.js';
import {
  authoritySignatureFor,
  readWarSeatBooks,
} from '../../src/domain/worldPulse/warSeatBooks.js';
import { warRulingNewsEntry } from '../../src/domain/worldPulse/warRulingsNews.js';

const TIERS = Object.freeze(['hamlet', 'village', 'town', 'city', 'metropolis']);

/** Real worlds, several seeds and every tier — never one lucky settlement. */
function corpus() {
  const rows = [];
  for (let seed = 7100; seed < 7106; seed += 1) {
    for (const tier of TIERS) {
      let generated;
      try {
        generated = generateSettlementPipeline({ tier }, seed);
      } catch {
        continue;
      }
      const settlement = generated?.settlement || generated;
      const governing = governingFactionOf(settlement);
      if (!governing) continue;
      const id = `${tier}-${seed}`;
      rows.push({
        id,
        settlement,
        governing,
        item: { id, name: settlement?.name || id, settlement },
      });
    }
  }
  return rows;
}

function snapshotOf(rows) {
  return {
    settlements: rows.map((row) => row.item),
    byId: new Map(rows.map((row) => [row.id, row.item])),
  };
}

const ROWS = corpus();
const SNAPSHOT = snapshotOf(ROWS);

describe('TCD-1 governing-seat faction address', () => {
  it('the corpus is real, non-empty, and carries no faction .id at all', () => {
    // The denominator. If this ever shrinks to nothing the pins below go
    // vacuous silently, which is exactly how this defect class propagates.
    expect(ROWS.length).toBeGreaterThanOrEqual(20);
    const factionRows = ROWS.flatMap((row) => row.settlement?.powerStructure?.factions || []);
    expect(factionRows.length).toBeGreaterThanOrEqual(60);
    // The premise of the whole repair, re-measured every run rather than quoted.
    expect(factionRows.filter((faction) => faction?.id != null)).toEqual([]);
  });

  it('readWarSeatBooks emits the settlement-scoped address id for every real governing seat', () => {
    let checked = 0;
    for (const row of ROWS) {
      const books = readWarSeatBooks({
        worldState: {},
        snapshot: SNAPSHOT,
        actorId: row.id,
        opponentId: 'elsewhere',
      });
      const expected = `${row.id}:${stablePart(nameOf(row.governing))}`;
      expect(books.factionId).toBe(expected);
      expect(books.factionName).toBe(nameOf(row.governing));
      checked += 1;
    }
    expect(checked).toBe(ROWS.length);
  });

  it('the address id is byte-identical to realmFactionPulseId, so the link web can follow it', () => {
    // The link web's resolveFaction indexes factions by realmFactionPulseId and
    // returns null outright on a colonless id, so an address that is merely
    // "present" but differently spelled is a dead rung. warSeatBooks cannot
    // import realmEntityWeb (a dossier-layer module would re-parent this lazy
    // worldPulse leaf's closure), so the single-source guarantee is THIS pin.
    for (const row of ROWS) {
      const books = readWarSeatBooks({
        worldState: {},
        snapshot: SNAPSHOT,
        actorId: row.id,
        opponentId: 'elsewhere',
      });
      const factions = row.settlement.powerStructure.factions;
      const index = factions.indexOf(row.governing);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(books.factionId).toBe(realmFactionPulseId(row.id, row.governing, index));
      expect(books.factionId).toContain(':');
    }
  });

  it('that id RESOLVES against the real roster — a war ruling that needs the faction rung survives', () => {
    // war_party_overturns_peacemaker REQUIRES the faction identity, and the
    // supplied-name evidence path is deliberately withheld here, so the entry
    // exists if and only if warRulingsNews.factionName resolved the id against
    // the settlement's own generated roster. With the old `.id`-only spelling
    // the id was absent, faction resolved to '', and the entry failed closed.
    let resolved = 0;
    let skippedUnreaderly = 0;
    for (const row of ROWS) {
      const books = readWarSeatBooks({
        worldState: {},
        snapshot: SNAPSHOT,
        actorId: row.id,
        opponentId: 'elsewhere',
      });
      // A faction display name carrying a digit or underscore is not reader
      // text and is legitimately unspeakable; count it rather than hide it.
      if (/[\d%×_{}[\]]/u.test(nameOf(row.governing))) {
        skippedUnreaderly += 1;
        continue;
      }
      const entry = warRulingNewsEntry({
        evidence: {
          kind: 'war_party_overturns_peacemaker',
          id: `tcd1:${row.id}`,
          tick: 12,
          settlementId: row.id,
          npcId: `${row.id}:seat`,
          npcName: 'The Seated Holder',
          factionId: books.factionId,
        },
        snapshot: SNAPSHOT,
        now: '2026-08-07T00:00:00.000Z',
      });
      expect(entry).not.toBeNull();
      expect(entry.factionIds).toEqual([books.factionId]);
      // The address rung must actually name the faction in the prose the
      // reader sees, not merely occupy a slot.
      const spoken = `${entry.headline} ${entry.summary}`;
      expect(spoken).toContain(nameOf(row.governing));
      resolved += 1;
    }
    expect(resolved).toBeGreaterThanOrEqual(ROWS.length - skippedUnreaderly);
    expect(resolved).toBeGreaterThanOrEqual(20);
  });

  it('a NEGATIVE CONTROL id resolves to nothing, so the pin above is not passing on the name alone', () => {
    const row = ROWS[0];
    const entry = warRulingNewsEntry({
      evidence: {
        kind: 'war_party_overturns_peacemaker',
        id: `tcd1:neg:${row.id}`,
        tick: 12,
        settlementId: row.id,
        npcId: `${row.id}:seat`,
        npcName: 'The Seated Holder',
        factionId: `${row.id}:a_faction_this_world_does_not_have`,
      },
      snapshot: SNAPSHOT,
      now: '2026-08-07T00:00:00.000Z',
    });
    expect(entry).toBeNull();
  });

  it('the AUTHORITY SIGNATURE stays blind to the display name — a rename is not a succession', () => {
    // Guards the two sites this repair deliberately did NOT change
    // (warSeatBooks.authoritySignatureFor and rulingPower.authorityTransferEpochFor).
    // Feeding the address id into either would make every faction rename read
    // as a legitimate authority transfer.
    const row = ROWS[0];
    const before = authoritySignatureFor({ worldState: {}, snapshot: SNAPSHOT, actorId: row.id });
    const renamedFactions = row.settlement.powerStructure.factions.map((faction) => (
      faction === row.governing
        ? { ...faction, faction: 'The Renamed Body', name: undefined }
        : faction
    ));
    const renamedSettlement = {
      ...row.settlement,
      powerStructure: {
        ...row.settlement.powerStructure,
        governingName: 'The Renamed Body',
        factions: renamedFactions,
      },
    };
    const renamedItem = { id: row.id, name: row.item.name, settlement: renamedSettlement };
    const renamedSnapshot = {
      settlements: [renamedItem],
      byId: new Map([[row.id, renamedItem]]),
    };
    const after = authoritySignatureFor({
      worldState: {}, snapshot: renamedSnapshot, actorId: row.id,
    });
    expect(after).toBe(before);
    // …while the ADDRESS id does move with the name, which is what makes it an
    // address rather than a continuity key.
    const renamedBooks = readWarSeatBooks({
      worldState: {}, snapshot: renamedSnapshot, actorId: row.id, opponentId: 'elsewhere',
    });
    expect(renamedBooks.factionId).toBe(`${row.id}:${stablePart('The Renamed Body')}`);
  });

  it('both seat-transition writers spell governingFactionId the same way', () => {
    // applyWorldPulse's approved-transfer path and npcLadderKernel's organic
    // succession path compose the same persisted row. They had drifted: one
    // resolved the ladder key, the other fell back to the INSTALLER's id.
    for (const row of ROWS) {
      const spelled = seatTransitionGoverningFactionId(row.governing);
      expect(spelled).toBe(ladderFactionKey(row.governing));
      expect(spelled).toMatch(/^fac\./);
      expect(spelled).not.toBe('');
    }
    expect(seatTransitionGoverningFactionId(null)).toBe('');
  });
});
