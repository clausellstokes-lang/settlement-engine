// FRAME-6 Q4: the chair's four questions, counted over the framed towns of the calm pool. Read-only.
// argv: pool.json, tree src/ path (with trailing slash). Prints the per-town facts and the four counts.
import fs from 'node:fs';
const R = process.argv[3];
const { castTroubleFrame, troubleOfWeight, HALL_TAKEN } = await import(R + 'domain/tension/troubleCast.js');
const { composeTonightSheet } = await import(R + 'domain/summary/tonightSheet.js');
const { membersByRank } = await import(R + 'domain/people/membership.js');
const { rulingChainOf } = await import(R + 'domain/dossier/powerStrata.js');
const { isOfficeStandIn } = await import(R + 'domain/dossier/seatHolder.js');
const { castHash } = await import(R + 'domain/crisis/crisisCast.js');
const { FRAME_TUNING, ARCHETYPE_LADDER } = await import(R + 'domain/tension/sideArchetypes.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const str = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
const idOf = (n) => str(n.id) || str(n.name);
const live = (n) => !!n && !n.temporary && !n.ousted && !!str(n.name) && !isOfficeStandIn(n);
const sheetText = (sh, facts = true) => [sh.opening, ...(sh.frame ? [sh.frame.name, sh.frame.line, ...sh.frame.hooks, ...sh.frame.sides.flatMap((x) => [x.words, x.name, x.role, x.reason, x.line])] : []),
  ...sh.people.flatMap((p) => [p.name, p.role, p.reason, p.line, p.side]), ...(facts ? sh.facts.map((f) => f.text) : []), ...sh.hooks.flatMap((h) => [h.text, h.source])].filter(Boolean).join(' \n ');
// THE SHORT RESOURCE, tightly: the impaired chain's own words (its id, its label) and its depleted input (resource), never
// its outputs or houses; generic words dropped; a word matches itself or its plural only.
const STOP = new Set(['and', 'the', 'of', 'goods', 'grounds', 'areas', 'area', 'fields', 'wild', 'managed', 'deposits', 'land', 'veins', 'node', 'line', 'magical', 'luxury', 'finishing', 'processing', 'mining', 'petty', 'north', 'social', 'life', 'trade', 'manufacturing', 'crafts', 'advanced', 'armor', 'armour', 'weapons', 'animal', 'husbandry', 'fortification', 'food', 'precious', 'reed']);
const wordsOf = (c) => [...new Set([str(c.chainId).replace(/_/g, ' '), c.label, c.resource]
  .flatMap((x) => str(x).toLowerCase().split(/[^a-z]+/)).filter((w) => w.length >= 3 && !STOP.has(w)))];
const names = (txt, words) => words.filter((w) => new RegExp(`\\b${w}(s|es)?\\b`, 'i').test(txt));
const ctx = (txt, words) => words.map((w) => { const m = new RegExp(`[^\\n]{0,50}\\b${w}(s|es)?\\b[^\\n]{0,30}`, 'i').exec(txt); return m ? m[0].trim() : ''; });

const Q = { framed: 0, byStrain: {}, voiced: 0, voicedByRule: {}, powerSides: 0, powerSidesNoMember: 0, powerSidesNoLink: 0, labelSidesByRule: {}, byHash: 0, byFallback: 0, powerSideNoLinkList: [],
  nullSides: 0, nullPowerSides: 0, nullPowerSidesWithPerson: 0, nullWhy: {}, nullList: [],
  W3: 0, W3names: 0, W3list: [], W3ecoHookLost: 0, W3ecoHookNamesShort: 0, W3displaced: {},
  seatOnLine: 0, seatDropped: 0, seatDroppedByStrain: {}, seatKept: {}, W4: 0, W4capWords: 0, W4capPowerNamed: 0, W4list: [] };
const inc = (m, k) => { m[k] = (m[k] || 0) + 1; };
for (const { seed, tier, s } of towns) {
  const cast = castTroubleFrame(s);
  if (!cast) continue;
  const w = troubleOfWeight(s); const strain = w.strain.strain;
  Q.framed++; inc(Q.byStrain, strain);
  const tension = s.history.currentTensions[cast.at];
  const raws = tension.factions.map(str).slice(0, 3);
  const powers = (s.powerStructure?.factions || []).filter((f) => f && str(f.faction));
  const npcs = s.npcs || []; const roster = npcs.filter(live);
  const owner = composeTonightSheet(s, { audience: 'owner' }); const line = composeTonightSheet(s);
  const ties = (s.relationships || []);
  const tied = (a, b) => ties.some((t) => (t.from === idOf(a) && t.to === idOf(b)) || (t.from === idOf(b) && t.to === idOf(a)));
  // ---- Q1: each voiced side, its power, the person's link to it, and how the rung fired
  cast.sides.forEach((side, i) => {
    const f = side.face; const named = powers.find((p) => str(p.faction) === raws[i]);
    if (f && f.kind !== 'outsider' && f.npcId && owner.people.some((p) => p.name === f.name)) {
      Q.voiced++; inc(Q.voicedByRule, f.rule);
      const rate = (FRAME_TUNING.rates[side.archetype] || {})[f.kind] ?? 0;
      const h = castHash(str(s._seed), cast.type, `${i}:${f.kind}`);
      if (side.archetype === 'criminal' && f.kind === 'criminal') Q.byHash++; else if (h < rate) Q.byHash++; else Q.byFallback++;
      const npc = npcs.find((n) => idOf(n) === f.npcId);
      if (named) {
        Q.powerSides++;
        const members = membersByRank(npcs, str(named.faction));
        const member = members.some((m) => idOf(m) === f.npcId);
        const tie = members.some((m) => idOf(m) !== f.npcId && tied(npc, m));
        if (!member) Q.powerSidesNoMember++;
        if (!member && !tie) Q.powerSidesNoLink++;
        if (!member) Q.powerSideNoLinkList.push(`${seed}: "${side.words}" <- ${f.name} (${npc?.role}) rule=${f.rule} hash=${h.toFixed(3)}/${rate} member=${member} tieToMember=${tie} powerMembers=${members.length} head=${members[0]?.name}`);
      } else inc(Q.labelSidesByRule, f.rule);
    }
    // ---- Q2: a side with no one named while the record holds a person of its power
    if (!f) {
      Q.nullSides++;
      if (named) {
        Q.nullPowerSides++;
        const members = membersByRank(npcs, str(named.faction));
        if (members.length) {
          Q.nullPowerSidesWithPerson++;
          const liveM = members.filter(live);
          const usedIds = new Set(cast.sides.flatMap((x) => [x.face?.npcId, x.face?.viaId]).filter(Boolean));
          const officeTaken = cast.sides.some((x, j) => j !== i && x.face?.kind === 'office');
          const why = !liveM.length ? (members.every((m) => isOfficeStandIn(m)) ? 'every member is named by role (isOfficeStandIn), off the live roster' : 'no member on the live roster (stand-in/temporary/ousted)')
            : liveM.every((m) => usedIds.has(idOf(m))) ? 'its live members hold other sides'
              : officeTaken ? `office cap (officeSidesMax ${FRAME_TUNING.officeSidesMax}) taken by another side; no tie/trade rung fits` : 'live member free, no rung fits';
          inc(Q.nullWhy, why);
          Q.nullList.push(`${seed}: "${side.words}" (${side.archetype}, ladder ${ARCHETYPE_LADDER[side.archetype]}) members=${members.map((m) => m.name).join('/')} -> ${why}`);
        }
      }
    }
  });
  // ---- Q3: W3 frames, does the owner sheet name the short resource?
  if (strain === 'W3') {
    Q.W3++;
    const short = (s.economicState?.activeChains || []).filter((c) => c?.status === 'impaired');
    const kw = [...new Set(short.flatMap(wordsOf))];
    const ot = sheetText(owner, false); const lt = sheetText(line, false);
    const hit = names(ot, kw); const lhit = names(lt, kw);
    if (hit.length) Q.W3names++;
    const eco = new Set((s.economicViability?.plotHooks || []).map((h) => str(typeof h === 'object' ? (h.hook || h.text) : h)));
    const ecoLine = line.hooks.filter((h) => eco.has(str(h.text).replace(/\.$/, '')) || [...eco].some((e) => str(h.text).startsWith(e.slice(0, 40))));
    const ecoOwner = owner.hooks.filter((h) => ecoLine.some((e) => e.text === h.text));
    const lost = ecoLine.filter((e) => !ecoOwner.some((o) => o.text === e.text));
    let displaced = '';
    if (lost.length) {
      Q.W3ecoHookLost++;
      if (lost.some((e) => names(e.text, kw).length)) Q.W3ecoHookNamesShort++;
      const third = owner.hooks[owner.hooks.length - 1];
      const faces = new Set(owner.frame.sides.map((x) => x.name).filter(Boolean));
      displaced = third ? (faces.has(third.source) ? 'a face\'s own hook' : 'a non-face hook') : 'none';
      inc(Q.W3displaced, displaced);
    }
    Q.W3list.push(`${seed}: ${cast.type} impaired=[${short.map((c) => `${c.chainId}:${c.resource}`).join('; ')}] kw=[${kw}] ownerNames=[${hit}] {${ctx(ot, hit).join(' || ')}} lineNames=[${lhit}] ecoHookLost=${lost.map((e) => `"${e.text.slice(0, 50)}…"(${e.source}) namesShort=${names(e.text, kw).length > 0}`).join(' | ') || 'none'}${displaced ? ` displaces=${displaced}` : ''}`);
  }
  // ---- Q4: the seat-holder on People to voice; what a W4 frame prints of the capture
  const seat = str(rulingChainOf(s).npc?.name);
  const onLine = !!seat && line.people.some((p) => p.name === seat);
  const onOwner = !!seat && owner.people.some((p) => p.name === seat);
  if (onLine) { Q.seatOnLine++; if (!onOwner) { Q.seatDropped++; inc(Q.seatDroppedByStrain, strain); } else inc(Q.seatKept, `${strain}:${owner.people.find((p) => p.name === seat).reason}`); }
  if (strain === 'W4') {
    Q.W4++;
    const cap = powers.filter((f) => HALL_TAKEN.includes(str(f.captureState)));
    const ot = sheetText(owner);
    const capWords = /\b(captur\w*|corrupt\w*|criminal hands|in the pocket|bought)\b/i.test(ot);
    const powNamed = cap.some((f) => ot.toLowerCase().includes(str(f.faction).toLowerCase().replace(/^the /, '')));
    if (capWords) Q.W4capWords++; if (powNamed) Q.W4capPowerNamed++;
    Q.W4list.push(`${seed}: captured=[${cap.map((f) => `${f.faction}:${f.captureState}${f.isGoverning ? ' (governing)' : ''}`).join('; ')}] seat=${seat} seatOnOwner=${onOwner} capWordsOnOwner=${capWords} capturedPowerNamedOnOwner=${powNamed}`);
  }
}
const { powerSideNoLinkList, nullList, W3list, W4list, ...counts } = Q;
console.log(JSON.stringify(counts, null, 1));
console.log('\n# Q1 power-named sides voiced by a non-member'); powerSideNoLinkList.forEach((x) => console.log(x));
console.log('\n# Q2 null sides of a power with a person'); nullList.forEach((x) => console.log(x));
console.log('\n# Q3 W3 frames'); W3list.forEach((x) => console.log(x));
console.log('\n# Q4 W4 frames'); W4list.forEach((x) => console.log(x));
