// BAR8-AUDIT-K · LAW 14 · A TEXT SET ON THE WRONG PERSON OR POWER.
// A pure detector over one town read by `pageK.mjs :: readTownK`; returns instances
// { law: 14, rule, town, tab, line, against: { tab, line }, why, thing, writer }.
//   14a.descCopy  a power printed with another power's description word for word (the record carries the copy) (C14226)
//   14b.handler   "handled by <person> (<house>)" under a criminal house that is not that person's own (C6183)
//   14c.whole     "the whole <seat>" of a seat the page prints with one member (C16666)
//   14d.noble     a power's description that sets it "under noble oversight" where the town holds no noble (C44634)
//   14e.hookTrade a plot hook that gives a person a trade (competition, customers, a market) whose house and seats are
//                military only (C5296; NEGATIVE C5328, C5358: the person sits on a merchant power)
//   14f.secret    a secret that presumes a command or an office (an authorised sortie, terms of surrender) on a person who
//                holds no seat and keeps no house of command (C6865)
//   14g.sexTitle  a card's title in the other sex's form of a sex-paired title ("Emir" on a woman) (C36170)
//   14h.winMore   "Win N more people in <power>" where the page prints that power with fewer others than N (C14564)
const POW = 'Systems/Power', NPC = 'World/NPCs', HOOKS = 'Summary/Plot Hooks';

const MILITARY = /\b(garrison|watch|barracks|citadel|militia|guard|fort|fortress|castle|keep|army|soldier|mercenar|hireling|warband|war council)\b/i;
const COMMAND_ROLE = /\b(castellan|commander|captain|marshal|sergeant|general|warden|prefect|voivode|qaid|strategos|lord|lady|reeve|mayor|governor|councillor|elder|headman|chief|steward|magistrate|noyan)\b/i;
const MERCHANT_SEAT = /\b(merchant|guild|trade|oligarch|market|bank|money|caravan|syndicate|company|exchange|consortium)\b/i;
const TRADE_HOOK = /\b(competition|customers?|price-fixing|business rival|partnership|regular customer|two buyers|their stall|their shop|their goods|their prices|undercut)\b/i;

// A COMMAND OR AN OFFICE the secret presumes (the crisis pools of `data/stressInstitutionEffects.js` and the very rare rows
// of `data/rareSecrets.js` are read alike: a rare row is known by its words)
const COMMAND_SECRET = [
  ['sortie', /\bAuthori[sz]ed an illegal sortie\b/i],
  ['surrender', /\bnegotiating surrender terms\b/i],
  ['stores', /\b(Sold off the settlement's emergency stores|supplies they declared destroyed|declared destroyed in a fire)\b/i],
];

// SEX-PAIRED TITLES (the product's own pairs in `data/faceHonorifics.js`, and the ordinary English pairs); an office's title
// held by either sex ("Lord Mayor", "-master") is NOT here (the readers' NOT A FLAG)
const MALE_FORM = new Set(['Emir', 'Sheikh', 'Khan', 'Raja', 'Maharaja', 'Boyar', 'Godi', 'King', 'Prince', 'Duke', 'Count', 'Baron', 'Sultan', 'Shah', 'Tsar', 'Headman', 'Foreman', 'Goodman', 'Abbot', 'Monk', 'Friar', 'Patriarch', 'Earl', 'Marquis', 'Viscount']);
const FEMALE_FORM = new Set(['Lady', 'Queen', 'Princess', 'Duchess', 'Countess', 'Baroness', 'Khatun', 'Rani', 'Maharani', 'Boyarina', 'Gydja', 'Goodwife', 'Abbess', 'Prioress', 'Nun', 'Headwoman', 'Sultana', 'Tsarina', 'Emira', 'Sheikha', 'Priestess', 'Matriarch', 'Marchioness', 'Viscountess']);
const NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

export function law14K(T, town) {
  const out = [];
  const push = (rule, at, against, why, thing, writer) => out.push({ law: 14, rule, town, tab: at.tab, i: at.i, line: at.line, s: at.s, against, why, thing, writer });
  const pow = T.tabs[POW] || [];
  const factions = Array.isArray(T.record?.powerStructure?.factions) ? T.record.powerStructure.factions : [];

  // ---- 14a · one description on two powers
  const byDesc = new Map();
  for (const f of factions) { const d = String(f?.desc || '').trim(); if (d) (byDesc.get(d) || byDesc.set(d, []).get(d)).push(f); }
  for (const [d, fs] of byDesc) {
    if (fs.length < 2 || new Set(fs.map((f) => f.faction)).size < 2) continue;
    const copy = fs.find((f) => f.contestsNiche) || fs[1];
    const host = fs.find((f) => f !== copy);
    const i = pow.findIndex((l, k) => l.startsWith(d.slice(0, 60)) && /\[opened\] /.test(pow[k - 1] || '') && pow[k - 1].includes(copy.faction));
    push('14a.descCopy', { tab: i >= 0 ? POW : 'record', i, line: d, s: d }, { tab: 'record', line: `powerStructure.factions: "${host.faction}" and "${copy.faction}" (contestsNiche ${copy.contestsNiche || 'none'}) carry one desc` },
      `the power ${copy.faction} is printed with the description of ${host.faction}`, copy.faction,
      copy.contestsNiche ? 'src/generators/density/applyDensityLaw.js (the doubled niche\'s mint copies the host: `...host`, desc kept)' : 'the faction roster (two powers, one desc)');
  }

  // ---- 14b · a covert network credited to another house's boss
  // The block prints a criminal house's name, then its handlers ("handled by <person>, the <role> (<house label>)"), each
  // followed by the people that person runs. A house's network that NO person of the house itself handles (every handler
  // the boss of another criminal house) is the swap; a network with its own boss among its handlers is not read.
  const who = pow.indexOf('Who answers to whom');
  if (who >= 0) {
    const groups = [];
    for (let k = who + 1; k < pow.length && !/^The (fronts|hall|boosts)$/.test(pow[k]); k++) {
      const m = /^handled by (.+?), the .+? \((.+)\)$/.exec(pow[k]);
      if (m) { if (groups.length) groups[groups.length - 1].handlers.push({ k, name: m[1].trim(), label: m[2].trim() }); continue; }
      if (/ · brings /.test(pow[k])) continue;
      groups.push({ head: pow[k].trim(), k, handlers: [] });
    }
    const npcs = T.record?.npcs || [];
    const ownOf = (h) => { const n = npcs.find((y) => y?.name === h.name); return String(n?.institution?.key || n?.allegiance?.house || h.label); };
    for (const g of groups) {
      if (!g.handlers.length || /^Front businesses$/.test(g.head)) continue;
      if (g.handlers.some((h) => ownOf(h) === g.head || h.label === g.head)) continue;
      for (const h of g.handlers)
        push('14b.handler', { tab: POW, i: h.k, line: pow[h.k], s: pow[h.k] }, { tab: POW, i: g.k, line: `the network's house: ${g.head}; ${h.name}'s own house: ${ownOf(h)}` },
          `no person of ${g.head} handles its network; it is credited to ${h.name} of ${ownOf(h)}`, g.head, 'src/domain/people/allegiance.js (the handler of a criminal house\'s network; the record carries the swap)');
    }
  }

  // ---- 14c · "the whole <seat>" of a seat of one
  for (const x of T.findSent(/\bgoes to the whole ([^,]+),/i)) {
    const seat = x.s.match(/\bgoes to the whole ([^,]+),/i)[1].trim();
    const p = T.powers.find((q) => q.name.replace(/[◆●▲▼↑↓]/g, '').trim() === seat);
    if (p && p.members === 1) push('14c.whole', x, { tab: POW, i: p.idx, line: `${seat} · ${p.members} member` }, `"the whole ${seat}" of a seat the page prints with one member`, seat,
      'src/data/dossierStateProse/power.generated.js (pools > council: no ruler: lord)');
  }

  // ---- 14d · noble oversight in a town with no noble
  const nobleHere = factions.some((f) => /noble|gentry|lord|baron|manor|aristocra|duke|count\b/i.test(`${f.faction} ${f.category}`))
    || (T.record?.institutions || []).some((x) => /\b(manor|noble|lord|castle|keep|estate)\b/i.test(String(x?.name || '')))
    || (T.record?.npcs || []).some((n) => /\b(lord|lady|noble|baron)\b/i.test(String(n?.role || '')))
    || !!T.record?.neighborRelationship;
  if (!nobleHere) for (const x of T.findSent(/\bunder noble oversight\b|\bat the noble's pleasure\b|\bfor the lord\b|\bthe lord's (?:men|steward|bailiff)\b/i)) {
    push('14d.noble', x, { tab: 'record', line: 'no noble power, house, person or neighbour on the record (factions, institutions, npcs, neighborRelationship)' },
      'the line sets the town under a noble the town does not hold', 'noble', 'src/generators/power/rulingStructure.js (the Elected Reeve\'s desc)');
  }

  // ---- 14e · a trade hook on a soldier
  for (const h of T.hooks) {
    if (!TRADE_HOOK.test(h.hook)) continue;
    const n = (T.record?.npcs || []).find((y) => y?.name === h.name); if (!n) continue;
    const house = String(n?.institution?.key || '');
    const seats = (n.memberships || []).map((m) => String(m?.power || ''));
    const military = MILITARY.test(`${house} ${n.role || ''}`) && !MERCHANT_SEAT.test(house);
    if (!military || seats.some((s) => MERCHANT_SEAT.test(s))) continue;
    push('14e.hookTrade', { tab: HOOKS, i: h.i, line: h.hook, s: h.hook }, { tab: 'record', line: `${n.name}, ${n.role} @ ${house} [${seats.join('; ') || 'no seat'}]` },
      `the hook gives ${n.name} a trade; the house and every seat are military`, n.name, 'src/data/npcData.js (the plot-hook pool: needs market only; no holder test)');
  }

  // ---- 14f · a secret of command on a person with none
  for (const p of T.people) {
    const n = p.npc; const what = String(n?.secret?.what || '');
    const hit = COMMAND_SECRET.find(([, re]) => re.test(what));
    if (!hit) continue;
    const seats = (n.memberships || []).filter((m) => !m?.veiled);
    const house = String(n?.institution?.key || '');
    if (seats.length || MILITARY.test(house) || COMMAND_ROLE.test(String(n.role || '')) || /granary|stores|warehouse|town hall|council/i.test(house)) continue;
    const line = p.body.find((b) => /^Secret: /.test(b.text));
    push(`14f.secret.${hit[0]}`, { tab: NPC, i: line ? line.i : p.idx, line: line ? line.text : `Secret: ${what}`, s: what }, { tab: 'record', line: `${n.name}, ${n.role} @ ${house}; memberships: ${seats.length}; structuralRank ${n.structuralRank || ''}` },
      `the secret presumes a command (${hit[0]}); ${n.name} holds no seat and keeps no house of command`, n.name,
      'src/data/stressInstitutionEffects.js (the crisis pool\'s secret: needs other npc only; no holder test) via src/generators/npcGenerator.js');
  }

  // ---- 14g · a sex-paired title in the other sex's form
  for (const p of T.people) {
    const g = String(p.npc?.gender || '');
    const t = p.title.trim();
    const wrong = (g === 'female' && MALE_FORM.has(t)) || (g === 'male' && FEMALE_FORM.has(t));
    if (!wrong) continue;
    push('14g.sexTitle', { tab: NPC, i: p.titleIdx, line: t, s: t }, { tab: 'record', line: `${p.name}: gender ${g}, title ${p.npc?.institution?.title || p.npc?.title || ''}` },
      `the card titles a ${g === 'female' ? 'woman' : 'man'} "${t}", the other sex's form of a paired title`, t, 'src/data/faceHonorifics.js (a culture\'s form given as one string, not { male, female })');
  }

  // ---- 14h · more people in a power than it holds
  for (const p of T.people) for (const b of p.body) {
    const m = /^Wants Win (one|two|three|four|five|six|\d+) more people in (.+?) over to their side(?: before (.+?) notices)?/.exec(b.text);
    if (!m) continue;
    const want = NUM[m[1]] || Number(m[1]);
    const pw = T.powers.find((q) => q.name.replace(/[◆●▲▼↑↓]/g, '').trim() === m[2].trim());
    if (!pw) continue;
    const selfIn = (p.npc?.memberships || []).some((x) => x?.power === m[2].trim()) ? 1 : 0;
    const other = m[3] ? (T.record?.npcs || []).find((y) => y?.name === m[3].trim()) : null;
    const otherIn = other && (other.memberships || []).some((x) => x?.power === m[2].trim()) ? 1 : 0;
    const left = pw.members - selfIn - otherIn;
    if (left < want) push('14h.winMore', { tab: NPC, i: b.i, line: b.text, s: b.text }, { tab: POW, i: pw.idx, line: `${pw.name} · ${pw.members} members` },
      `the want counts ${want} more people in ${m[2]}; the page prints ${pw.members} member(s), ${left} beside the person and the one named`, m[2], 'src/data/people/goalFamilies.js (the win-over goal: its count not read against the power\'s members)');
  }
  return out;
}
