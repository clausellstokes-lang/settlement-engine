// FRAME-6 · F1–F5: the five counts and the digests over the 330-town calm pool, at one tree. Read-only.
// argv: <pool.json> <tree src/ (trailing slash)> <out.json>
import fs from 'node:fs';
import crypto from 'node:crypto';
const [POOL, R, OUT] = process.argv.slice(2);
const { castTroubleFrame, troubleOfWeight } = await import(R + 'domain/tension/troubleCast.js');
const { composeTonightSheet } = await import(R + 'domain/summary/tonightSheet.js');
const { membersByRank } = await import(R + 'domain/people/membership.js');
const { rulingChainOf } = await import(R + 'domain/dossier/powerStrata.js');
const { CAPTURE_RUNG_LABELS } = await import(R + 'data/people/dmPowerLines.js');
const { towns } = JSON.parse(fs.readFileSync(POOL, 'utf8'));
const str = (v) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '');
const idOf = (n) => str(n.id) || str(n.name);
const d = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 16);
// F1: the ties of standing WITH a member, by the record's own `type` (never rival, enemy, political leverage or a debt)
const STANDING = new Set(['ally', 'respect', 'mentor_student', 'family', 'patron_client']);
const live = (n) => !!n && typeof n === 'object' && !n.temporary && !n.ousted && !!str(n.name);
const sheetText = (sh) => [sh.opening, ...(sh.frame ? [sh.frame.line, ...sh.frame.hooks, ...sh.frame.sides.flatMap((x) => [x.words, x.name, x.role, x.reason, x.line])] : []),
  ...sh.people.flatMap((p) => [p.name, p.role, p.reason, p.line, p.side]), ...sh.facts.map((f) => `${f.label}: ${f.text}`), ...sh.hooks.map((h) => h.text)].filter(Boolean).join(' \n ');
const STOP = new Set(['and', 'the', 'of', 'goods', 'grounds', 'areas', 'area', 'fields', 'wild', 'managed', 'deposits', 'land', 'veins', 'node', 'line', 'magical', 'luxury', 'finishing', 'processing', 'mining', 'petty', 'north', 'social', 'life', 'trade', 'manufacturing', 'crafts', 'advanced', 'armor', 'armour', 'weapons', 'animal', 'husbandry', 'fortification', 'food', 'precious', 'reed']);
const wordsOf = (c) => [...new Set([str(c.chainId).replace(/_/g, ' '), c.label, c.resource].flatMap((x) => str(x).toLowerCase().split(/[^a-z]+/)).filter((w) => w.length >= 3 && !STOP.has(w)))];

const C = { towns: 0, calm: 0, framed: 0, byStrain: {},
  f1: { voicedPowerSides: 0, noMember: 0, noMemberNoTie: 0, emptyPowerSides: 0, list: [] },
  f2: { emptySides: 0, emptyPowerSidesWithLivePersonUncast: 0, list: [] },
  f3: { W3: 0, namesShort: 0 },
  f4: { W4: 0, printsCapture: 0, list: [] },
  f5: { framed: 0, seatOnStranger: 0, seatDropped: 0, byStrain: {}, list: [] } };
const digests = {};
const inc = (m, k) => { m[k] = (m[k] || 0) + 1; };
for (const { seed, s } of towns) {
  C.towns++;
  const owner = composeTonightSheet(s, { audience: 'owner' });
  const stranger = composeTonightSheet(s);
  const top = troubleOfWeight(s);
  digests[seed] = { owner: d(owner), stranger: d(stranger), framed: !!owner.frame };
  if (!owner.frame) { C.calm++; continue; }
  C.framed++;
  const strain = top.strain.strain; inc(C.byStrain, strain);
  const cast = castTroubleFrame(s);
  const raws = s.history.currentTensions[cast.at].factions.map(str).slice(0, 3);
  const powers = (s.powerStructure?.factions || []).filter((f) => f && str(f.faction));
  const npcs = (s.npcs || []).filter((n) => n && typeof n === 'object');
  const ties = (s.relationships || []).filter((t) => t && STANDING.has(str(t.type)));
  const tied = (a, b) => ties.some((t) => (str(t.from) === a && str(t.to) === b) || (str(t.from) === b && str(t.to) === a));
  const castIds = new Set(cast.sides.flatMap((x) => [x.face?.npcId, x.face?.viaId]).filter(Boolean));
  cast.sides.forEach((side, i) => {
    const f = side.face;
    const named = powers.find((p) => str(p.faction) === raws[i]);
    if (!f) {
      C.f2.emptySides++;
      if (named) {
        C.f1.emptyPowerSides++;
        const people = membersByRank(npcs, str(named.faction)).filter(live).filter((m) => !castIds.has(idOf(m)));
        if (people.length) { C.f2.emptyPowerSidesWithLivePersonUncast++; C.f2.list.push(`${seed}: "${side.words}" <- could be ${people.map((m) => m.name).join('/')}`); }
      }
      return;
    }
    if (!named || !f.npcId || f.kind === 'outsider') return;
    C.f1.voicedPowerSides++;
    const members = membersByRank(npcs, str(named.faction));
    const member = members.some((m) => idOf(m) === f.npcId);
    const tie = members.some((m) => idOf(m) !== f.npcId && tied(f.npcId, idOf(m)));
    if (!member) C.f1.noMember++;
    if (!member && !tie) { C.f1.noMemberNoTie++; C.f1.list.push(`${seed}: "${side.words}" <- ${f.name} (${f.rule})`); }
  });
  if (strain === 'W3') {
    C.f3.W3++;
    const kw = [...new Set((s.economicState?.activeChains || []).filter((c) => c?.status === 'impaired').flatMap(wordsOf))];
    const txt = sheetText(owner);
    if (kw.some((w) => new RegExp(`\\b${w}(s|es)?\\b`, 'i').test(txt))) C.f3.namesShort++;
  }
  if (strain === 'W4') {
    C.f4.W4++;
    const txt = sheetText(owner);
    const hit = [CAPTURE_RUNG_LABELS.corrupted, CAPTURE_RUNG_LABELS.capture].some((w) => txt.toLowerCase().includes(w.toLowerCase()));
    if (hit) C.f4.printsCapture++;
    C.f4.list.push(`${seed}: hall=${str(s.powerStructure?.criminalCaptureState)} taken=${powers.filter((p) => ['corrupted', 'capture'].includes(str(p.captureState))).map((p) => `${p.faction}:${p.captureState}`).join(';')} prints=${hit}`);
  }
  C.f5.framed++;
  const seat = str(rulingChainOf(s).npc?.name);
  const onStranger = !!seat && stranger.people.some((p) => p.name === seat);
  const onOwner = !!seat && owner.people.some((p) => p.name === seat);
  if (onStranger) C.f5.seatOnStranger++;
  if (onStranger && !onOwner) { C.f5.seatDropped++; inc(C.f5.byStrain, strain); C.f5.list.push(`${seed}:${strain}:${seat}`); }
}
fs.writeFileSync(OUT, JSON.stringify({ counts: C, digests }, null, 1));
const { list: l1, ...f1 } = C.f1; const { list: l2, ...f2 } = C.f2; const { list: l4, ...f4 } = C.f4; const { list: l5, ...f5 } = C.f5;
console.log(JSON.stringify({ towns: C.towns, calm: C.calm, framed: C.framed, byStrain: C.byStrain, f1, f2, f3: C.f3, f4, f5 }, null, 1));
console.log('# F1', l1.join('\n# F1 ')); console.log('# F2', l2.join('\n# F2 ')); console.log('# F4', l4.join('\n# F4 '));
