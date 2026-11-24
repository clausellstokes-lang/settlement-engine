// PAGE-1 helper C, F4: the machine's words on the people cards. RECORD-LEVEL: every label measured here is a pure
// function of the card's record, computed by the display's own readers (npcInteriorityRead.js, cardPowers.js,
// cardTies.js, entityLinks.js, seatKeeper.js) exactly as npcComponents.jsx :: NPCInlineCard calls them.
// Run from the repository root:
//   node docs/chair/2026-11-20/content/page/measures/C/f4.mjs "$PWD" > docs/chair/2026-11-20/content/page/measures/C/f4.out.txt 2>&1
// Optional 3rd arg: towns per size (default 50 = the chair's 300). Optional env C_CACHE=<file> caches the forged towns.
import { loadTowns, pct, tally } from './towns.mjs';

const [, , L = process.cwd(), nA = '50'] = process.argv;
const towns = await loadTowns(L, +nA, process.env.C_CACHE || null);
const { npcInteriority } = await import(`${L}/src/domain/display/npcInteriorityRead.js`);
const { cardPowerLine, governingNameOf, cardInstitutionOf } = await import(`${L}/src/domain/people/cardPowers.js`);
const { seatKeeperOf } = await import(`${L}/src/domain/people/seatKeeper.js`);
const { cardTieLines } = await import(`${L}/src/domain/relationships/cardTies.js`);
const { normalizeNpcTraits } = await import(`${L}/src/domain/dossier/entityLinks.js`);
const { powerBandOfRole } = await import(`${L}/src/generators/npcGenerator.js`);
const { classOfRole } = await import(`${L}/src/domain/roles/roleClass.js`);
const { poolFor, POOL_BY_TITLE } = await import(`${L}/src/generators/people/poolMap.js`);
// the keyword lists of npcGenerator.js:60-71, with each '_' read as a space (the pool rows spell their roles with spaces)
const HIGH = ['mayor', 'lord', 'governor', 'bishop', 'archmage', 'guild master', 'captain', 'commander', 'crime lord'];
const MID = ['council member', 'priest', 'wealthy merchant', 'wizard', 'knight', 'magister', 'sergeant'];
const bandSpaced = (role) => { const r = String(role || '').toLowerCase(); return HIGH.some((k) => r.includes(k)) ? 'high' : MID.some((k) => r.includes(k)) ? 'moderate' : 'low'; };

const SIZES = [...new Set(towns.map((t) => t.size))];
const say = (...a) => console.log(...a);
say(`F4 — the machine's words on the people cards. ${towns.length} towns (${SIZES.map((s) => `${s} ${towns.filter((t) => t.size === s).length}`).join(', ')}).`);

// ── 1. every card: the labels it prints from an inner scale ────────────────────────────────────────────
const cards = [];
for (const t of towns) {
  const settlement = { npcs: t.npcsFull, relationships: t.relationships, powerStructure: { factions: t.factions, governingName: t.governingName } };
  const keeper = seatKeeperOf({ ...settlement, powerStructure: { ...settlement.powerStructure } });
  const facCat = Object.fromEntries(t.factions.map((f) => [f.faction, f]));
  for (const n of t.npcsFull) {
    const it = npcInteriority({ npc: n });
    const ties = cardTieLines(t.relationships, n.id);
    const traits = normalizeNpcTraits(n).filter((x) => x.visibility !== 'gm');
    const firsts = (n.memberships || []).filter((m) => m.rank === 1).map((m) => m.power);
    cards.push({
      t, n, size: t.size,
      dots: n.influence === 'high' ? '●●●' : n.influence === 'moderate' ? '●●' : '●', // npcComponents.jsx:294
      standing: it?.standing || '', // npcInteriorityRead.js:45, :290
      powerLine: cardPowerLine(n, [], governingNameOf(settlement), !!n?.id && keeper?.id === n.id), // npcComponents.jsx:295
      own: ties.filter((x) => x.direction === 'own').map((x) => x.kind || 'Tie'), // npcComponents.jsx:539 (own header)
      calledBy: ties.filter((x) => x.direction === 'calledBy').map((x) => x.kind), // npcComponents.jsx:539 ("Called by" · kind)
      disposition: it?.disposition || [],
      traitLabels: traits.map((x) => `${x.label}`),
      firsts, facCat,
      band: powerBandOfRole(n.role), cls: classOfRole(n.role),
      inst: cardInstitutionOf(n),
      poolRole: (() => { const ti = n.institution?.title || n.title; return POOL_BY_TITLE[ti] ? poolFor(ti).role : null; })(),
    });
  }
}
say(`\ncards: ${cards.length}`);
say('\n§1 LABEL INVENTORY on the card (what each label prints, and its share of cards)');
say(`  header dots (npcComponents.jsx:294 infDots on n.influence): ${tally(cards.map((c) => c.dots)).map(([k, v]) => `${k} ${pct(v, cards.length)}`).join(' · ')}`);
say(`  "Standing" (npcComponents.jsx:570, npcInteriorityRead.js:45 INFLUENCE_WORD on n.influence): ${tally(cards.map((c) => c.standing || '(none)')).map(([k, v]) => `${k} ${pct(v, cards.length)}`).join(' · ')}`);
say(`  power line rank words (cardPowers.js:20 RANK_WORD, :22 UNRANKED_WORD): ${tally(cards.flatMap((c) => (c.n.memberships || []).map((m) => (m.rank ? ['first', 'second', 'third'][m.rank - 1] : 'member')))).map(([k, v]) => `${k} ${v}`).join(' · ')}; cards with no power line ${pct(cards.filter((c) => !c.powerLine).length, cards.length)}`);
const withOwn = cards.filter((c) => c.own.length); const withCalled = cards.filter((c) => c.calledBy.length);
say(`  tie header OWN (npcComponents.jsx:539 t.kind||'Tie'): cards with one ${pct(withOwn.length, cards.length)}; kinds printed: ${tally(cards.flatMap((c) => c.own)).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
say(`  tie header "Called by" (npcComponents.jsx:539-540, cardTies.js:42): cards with one ${pct(withCalled.length, cards.length)}; lines ${cards.reduce((a, c) => a + c.calledBy.length, 0)}; kinds after it: ${tally(cards.flatMap((c) => c.calledBy)).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
say(`  "Disposition" (npcInteriorityRead.js:278-282: temperament, loyalty, fear): entries per card ${tally(cards.map((c) => c.disposition.length)).map(([k, v]) => `${k}:${v}`).join(' ')}; words (top 12): ${tally(cards.flatMap((c) => c.disposition)).slice(0, 12).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
say(`  trait chips (entityLinks.js:204 normalizeNpcTraits, before the card's want-filter): ${tally(cards.flatMap((c) => c.traitLabels)).map(([k, v]) => `${k} ${v}`).join(' · ')}`);

// ── 2. who writes n.influence, measured: band by role keyword ─────────────────────────────────────────
say('\n§2 THE WRITER OF n.influence (npcGenerator.js:59-76 powerBandOfRole/generateNPCPowerLevel, stored at :162): against the PRINTED role (a coincidence check only; §2b reads the role it was really drawn through)');
const eq = cards.filter((c) => c.n.influence === c.band).length;
say(`  equal ${eq}/${cards.length} (${pct(eq, cards.length)}); raised above the role band (castPowers.js:592-600 raiseToBand): ${cards.filter((c) => ({ low: 0, moderate: 1, high: 2 })[c.n.influence] > ({ low: 0, moderate: 1, high: 2 })[c.band]).length}; other: ${cards.filter((c) => c.n.influence !== c.band && !(({ low: 0, moderate: 1, high: 2 })[c.n.influence] > ({ low: 0, moderate: 1, high: 2 })[c.band])).length}`);
say(`  by generatedAs: ${tally(cards.map((c) => `${c.n.generatedAs || '(birth)'}→${c.n.influence}`)).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
say(`  roles drawn at each band (top 10 each):`);
for (const b of ['high', 'moderate', 'low']) say(`    ${b}: ${tally(cards.filter((c) => c.n.influence === b).map((c) => c.n.role)).slice(0, 10).map(([k, v]) => `${k} ${v}`).join(' · ')}`);

say('\n§2b THE BAND IS DRAWN FROM THE POOL ROW\'S ROLE, NOT THE PRINTED ROLE: a house face is born through poolFor(title).role (representatives.js:502-503 -> npcGenerator.js:138 generateNPCPowerLevel(role)), then its role is overwritten with its title (representatives.js:513; castPowers.js:351).');
const hf = cards.filter((c) => c.poolRole);
say(`  house faces with a title row (poolMap.js:57 POOL_BY_TITLE): ${hf.length}; stored band == powerBandOfRole(pool role): ${hf.filter((c) => c.n.influence === powerBandOfRole(c.poolRole)).length}; raised above it (the dual hat / noble body, castPowers.js:437,668): ${hf.filter((c) => ({ low: 0, moderate: 1, high: 2 })[c.n.influence] > ({ low: 0, moderate: 1, high: 2 })[powerBandOfRole(c.poolRole)]).length}`);
say(`  THE UNDERSCORE KEYWORDS (npcGenerator.js:65 'guild_master', :69 'council_member', 'wealthy_merchant') never match a pool role spelled with spaces: pool roles whose band would differ if '_' read ' ': ${[...new Set(Object.values(POOL_BY_TITLE).map((r) => r[0]))].filter((r) => powerBandOfRole(r) !== bandSpaced(r)).map((r) => `${r} ${powerBandOfRole(r)}->${bandSpaced(r)}`).join(' · ') || 'none'}`);
say(`  cards affected (stored band equals the keyword band, which the spaced keyword would raise): ${hf.filter((c) => c.n.influence === powerBandOfRole(c.poolRole) && bandSpaced(c.poolRole) !== powerBandOfRole(c.poolRole)).length}`);
say('  the pool roles behind every low band (top 25, cards):');
say('    ' + tally(hf.filter((c) => c.n.influence === 'low').map((c) => c.poolRole)).slice(0, 25).map(([k, v]) => `${k} ${v}`).join(' · '));

// ── 3. the FIRST of each power: how often "Standing marginal" ─────────────────────────────────────────
say('\n§3 THE FIRST OF EACH POWER (membership rank 1: the card prints "first of <power>", cardPowers.js:60-66) and its Standing');
const firsts = [];
for (const c of cards) for (const p of c.firsts) firsts.push({ ...c, power: p, f: c.facCat[p] || null });
const marg = (xs) => `${xs.filter((x) => x.standing === 'marginal').length}/${xs.length} ${pct(xs.filter((x) => x.standing === 'marginal').length, xs.length)}`;
say(`  first-of rows (a card first in two powers counts twice): ${firsts.length}; Standing: ${tally(firsts.map((x) => x.standing || '(none)')).map(([k, v]) => `${k} ${v} (${pct(v, firsts.length)})`).join(' · ')}`);
say(`  marginal, by size: ${SIZES.map((s) => `${s} ${marg(firsts.filter((x) => x.size === s))}`).join(' | ')}`);
say(`  marginal, by power category (powerStructure.factions[].category): ${tally(firsts.map((x) => x.f?.category || '(no row)')).map(([k]) => `${k} ${marg(firsts.filter((x) => (x.f?.category || '(no row)') === k))}`).join(' | ')}`);
say(`  marginal, governing power vs not: governing ${marg(firsts.filter((x) => x.f?.isGoverning))} | not ${marg(firsts.filter((x) => !x.f?.isGoverning))}`);
say(`  marginal, by the power's own label (factions[].powerLabel): ${tally(firsts.map((x) => x.f?.powerLabel || '(none)')).map(([k]) => `${k} ${marg(firsts.filter((x) => (x.f?.powerLabel || '(none)') === k))}`).join(' | ')}`);
say(`  marginal, by the card's kind (institution.kind: a house face, a power's minted face): ${tally(firsts.map((x) => x.inst?.kind || '(none)')).map(([k]) => `${k} ${marg(firsts.filter((x) => (x.inst?.kind || '(none)') === k))}`).join(' | ')}`);
say(`  powers with NO first: ${towns.reduce((a, t) => a + t.factions.filter((f) => !t.npcsFull.some((n) => (n.memberships || []).some((m) => m.power === f.faction && m.rank === 1))).length, 0)} of ${towns.reduce((a, t) => a + t.factions.length, 0)} powers`);
say('  marginal firsts: the role (and its keyword band) behind them, top 15:');
for (const [k, v] of tally(firsts.filter((x) => x.standing === 'marginal').map((x) => `${x.n.role} <- pool role ${x.poolRole || '(minted/none)'} [band ${x.poolRole ? powerBandOfRole(x.poolRole) : '?'}; spaced ${x.poolRole ? bandSpaced(x.poolRole) : '?'}]`)).slice(0, 20)) say(`    ${v}  ${k}`);
const mf = firsts.filter((x) => x.standing === 'marginal');
say(`  marginal firsts that the spaced keywords would lift: ${mf.filter((x) => x.poolRole && bandSpaced(x.poolRole) !== 'low').length}/${mf.length}; whose printed role (the title) holds a high/mid keyword the pool role lacks: ${mf.filter((x) => powerBandOfRole(x.n.role) !== 'low').length}/${mf.length}`);
say(`  marginal firsts that are the seat's leader (role is the office: Elder, Headman, Household Elder, Eldest...): ${mf.filter((x) => x.f?.isGoverning).length}; their roles: ${tally(mf.filter((x) => x.f?.isGoverning).map((x) => x.n.role)).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
say('  marginal firsts: the power they are first of, top 15 (category):');
for (const [k, v] of tally(firsts.filter((x) => x.standing === 'marginal').map((x) => `${x.power} (${x.f?.category || '?'})`)).slice(0, 15)) say(`    ${v}  ${k}`);

// ── 4. relative to what? the same role across sizes; the first's band vs the power's strength ────────────
say('\n§4 RELATIVE TO WHAT? The band is a keyword match on the pool row\'s role (or the seat\'s band, or the noble body\'s): no input reads the town, its size or the power. One printed role, one word, at every size:');
const byRole = new Map();
for (const c of cards) { const k = c.n.role; if (!byRole.has(k)) byRole.set(k, new Set()); byRole.get(k).add(c.n.influence); }
const multi = [...byRole].filter(([, s]) => s.size > 1);
say(`  roles: ${byRole.size}; roles seen with more than one band: ${multi.length} (${multi.slice(0, 12).map(([r, s]) => `${r}: ${[...s].join('/')}`).join(' · ')})`);
say('  first-of rows: the first\'s Standing against the town\'s own ordering of its powers (rank of the power by factions[].power within its town, 1 = strongest):');
const powRank = (x) => { const fs = [...x.t.factions].sort((a, b) => (b.power ?? 0) - (a.power ?? 0)); return fs.findIndex((f) => f.faction === x.power) + 1; };
for (const r of [1, 2, 3, 4]) { const xs = firsts.filter((x) => (r < 4 ? powRank(x) === r : powRank(x) >= 4)); say(`    power ranked ${r < 4 ? r : '4+'} in its town: marginal ${marg(xs)}`); }
say('  the strongest power in its town whose first reads "marginal", by size: ' + SIZES.map((s) => marg(firsts.filter((x) => x.size === s && powRank(x) === 1))).join(' | '));

// examples
say('\n§5 EXAMPLES (first of the strongest power, Standing marginal), one per size where one exists:');
for (const s of SIZES) {
  const x = firsts.find((y) => y.size === s && powRank(y) === 1 && y.standing === 'marginal');
  if (x) say(`  ${x.t.seed} ${x.n.name}: role "${x.n.role}", title "${x.n.title}", line "${x.powerLine}", dots ${x.dots}, Standing ${x.standing}; power ${x.power} (${x.f?.category}, ${x.f?.powerLabel}, ${x.f?.power})`);
}
