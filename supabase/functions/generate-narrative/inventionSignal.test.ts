/**
 * inventionSignal.test.ts — the logging-only AI-invention signal (audit follow-up).
 *
 * Proves the scanner (1) flags a proper noun given a mechanical role that is absent
 * from both canon and DM color, (2) does NOT flag canon entities or DM-sanctioned
 * color, and (3) is TOTAL — never throws on garbage — because a throw on this path
 * (which runs after send({done})) would reach the stream's catch-all refund() and
 * spuriously refund a paid generation.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { collectFullCanon, proseFieldsOf, scanProseForInvention } from './inventionSignal.ts';

const settlement = {
  name: 'Ashford',
  npcs: [{ name: 'Aldric the Fair', goal: { short: 'restore House Aldric' } }],
  powerStructure: { factions: [{ faction: 'The Reeves' }] },
  institutions: [{ name: 'The Salt Wharf' }],
  neighbourNetwork: [{ neighbourName: 'Grimwood' }],
  narrativeNotes: { overview: 'A quiet town.' },
};

Deno.test('flags a role-marked proper noun absent from canon + DM color', () => {
  const canon = collectFullCanon(settlement);
  const prose = ['Guildmaster Ferrick runs the docks, and the Ironhold Temple looms over the square.'];
  const { count, samples } = scanProseForInvention(prose, canon, '');
  // "Ferrick" (title) and "Ironhold" (the X Temple) are both invented.
  assertEquals(count >= 2, true);
  assertEquals(samples.includes('Ferrick'), true);
  assertEquals(samples.includes('Ironhold'), true);
});

Deno.test('catches broadened org/title structures (empirical recall fix: League, Warden-of, Consortium)', () => {
  const canon = collectFullCanon(settlement);
  // A corpus measurement showed the narrow vocab caught ~50%; these forms were the misses.
  const cases = [
    'The Warden of the Meltwater rules the northern locks.',       // TITLE of X
    'The Broken Rake League undercuts the harbour trade.',          // the X League
    'The Coalfactors of Emmet Drane bought the failing terraces.',  // STRUCT of X
    'The Palewick Consortium now rivals the old guild.',            // the X Consortium
  ];
  for (const prose of cases) {
    assertEquals(scanProseForInvention([prose], canon, '').count > 0, true, `should flag: ${prose}`);
  }
});

Deno.test('does NOT flag a canon entity given a role', () => {
  const canon = collectFullCanon(settlement);
  // Aldric is a known NPC; "the Salt Wharf" is a known institution.
  const { count } = scanProseForInvention(['Master Aldric prays at the Salt Wharf Temple.'], canon, '');
  assertEquals(count, 0);
});

Deno.test('does NOT flag DM-sanctioned color (name present in the guidance text)', () => {
  const canon = collectFullCanon(settlement);
  const dm = 'The DM has established the Order of Vasht, a distant crusading order.';
  const { count } = scanProseForInvention(['Pilgrims speak of the Order of Vasht with dread.'], canon, dm);
  assertEquals(count, 0);
});

Deno.test('clean prose (only canon references) yields zero — not vacuous', () => {
  const canon = collectFullCanon(settlement);
  const { count } = scanProseForInvention(['The Reeves tax the Salt Wharf; Aldric the Fair objects.'], canon, '');
  assertEquals(count, 0);
});

Deno.test('collectFullCanon harvests npc/faction/institution/neighbour/settlement names', () => {
  const canon = collectFullCanon(settlement);
  for (const n of ['aldric the fair', 'the reeves', 'the salt wharf', 'grimwood', 'ashford']) {
    assertEquals(canon.has(n), true);
  }
});

Deno.test('proseFieldsOf gathers thesis, narrativeNotes, and npc goal.short', () => {
  const s = { thesis: 'T', narrativeNotes: { a: 'A', b: 2 }, npcs: [{ goal: { short: 'G' } }, { goal: {} }] };
  const fields = proseFieldsOf(s);
  assertEquals(fields.sort(), ['A', 'G', 'T']);
});

Deno.test('TOTAL: never throws on garbage input', () => {
  // Any of these throwing would be a money-path hazard on the done path.
  scanProseForInvention(null as any, new Set(), null as any);
  scanProseForInvention([null, 42, undefined] as any, new Set(['x']), undefined as any);
  collectFullCanon(null);
  collectFullCanon({ npcs: 'not-an-array', institutions: null });
  proseFieldsOf(undefined);
  assertEquals(true, true); // reached here ⇒ nothing threw
});
