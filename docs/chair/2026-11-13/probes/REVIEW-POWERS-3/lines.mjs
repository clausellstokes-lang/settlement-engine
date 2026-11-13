// REVIEW-POWERS-3 lines.mjs — TREE=<tree> CORPUS=<corpus.ndjson.gz> DUMPS=<dumps dir> OUT=<file.json> node lines.mjs
// Every new or reworded line of 714381934..96a6ced46, found where it PRINTS (the rendered dump of the town, as its owner
// sees it) and read against the town's own record (the census-2 corpus of the same tree). One row per line: the towns it
// prints in, and for each the check against the record (true / false with the fact). Draws nothing; reads only.
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE;
const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
const BASE = process.env.BCORPUS ? new Map(zlib.gunzipSync(fs.readFileSync(process.env.BCORPUS)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; })) : new Map();
let NEW = null; // set per check: true when the printed thing differs from the base's same card / power / row
const dumpOf = (seed) => { try { return fs.readFileSync(`${process.env.DUMPS}/${seed}.txt`, 'utf8'); } catch { return ''; } };
const { factsOf } = await import(T + '/src/domain/facts/factsOf.js');
const { crimeSignalOf } = await import(T + '/src/domain/crimeSignal.js');
const { houseBacksOf } = await import(T + '/src/domain/dossier/powerSupport.js'); const { isCriminalInstitution } = await import(T + '/src/domain/corruption.js');
let seatKeeperStyledNameOf = null, seatKeeperOf = null, keeperFormOf = null, isSeatVacant = null;
try { ({ seatKeeperStyledNameOf, seatKeeperOf, keeperFormOf, isSeatVacant } = await import(T + '/src/domain/people/seatKeeper.js')); } catch {}
const sizeOf = (seed) => seed.match(/(thorp|hamlet|village|town|city|metropolis)/)[1];
const stressOf = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type).filter(Boolean);
const R = {}; const add = (k, seed, ok, note) => { const r = (R[k] ||= { prints: 0, towns: new Set(), true: 0, false: 0, sizes: {}, crisis: 0, examples: [], falses: [], newPrints: 0, newTowns: new Set(), newTrue: 0, newFalse: 0, newFalses: [], newExamples: [] });
  if (NEW) { r.newPrints++; r.newTowns.add(seed); if (ok) { r.newTrue++; if (r.newExamples.length < 30) r.newExamples.push({ seed, note }); } else { r.newFalse++; if (r.newFalses.length < 60) r.newFalses.push({ seed, note }); } }
  r.prints++; r.towns.add(seed); r.sizes[sizeOf(seed)] = (r.sizes[sizeOf(seed)] || 0) + 1; if (/-(calm)-|^r2r-/.test(seed) === false) r.crisis++;
  if (ok) { r.true++; if (r.examples.length < 4) r.examples.push({ seed, note }); } else { r.false++; if (r.falses.length < 40) r.falses.push({ seed, note }); } };
const NOBLE = /noble|gentry|manor|peerage|great famil|old famil|landed|baron|court/i;
for (const { seed, s } of rows) {
  const d = dumpOf(seed); if (!d) { add('_nodump', seed, false, 'no dump'); continue; }
  const npcs = s.npcs || []; const byId = new Map(npcs.map((n) => [n.id, n]));
  const F = s.powerStructure?.factions || []; const gov = F.find((f) => f.isGoverning); const st = stressOf(s);
  const facts = factsOf(s); const water = facts.water; const b = BASE.get(seed) || {};
  const bCard = new Map((b.npcs || []).map((n) => [n.id, n])); const bFac = new Map((b.powerStructure?.factions || []).map((f) => [f.faction, f])); const bRel = new Map((b.relationships || []).map((r) => [`${r.from}>${r.to}`, r]));
  const J = (x) => JSON.stringify(x ?? null);
  // L01 the styled role word on relationship rows (styledTitleOf): every row's role word against its card
  for (const r of s.relationships || []) for (const [id, role] of [[r.from, r.npc1Role], [r.to, r.npc2Role]]) {
    const c = byId.get(id); if (!c) continue;
    const fem = ['the lady', 'the abbess', 'the senior abbess', 'the high priestess'].includes(role);
    const masc = ['the lord', 'the abbot', 'the senior abbot', 'the high priest'].includes(role);
    if (!fem && !masc) continue;
    const onPage = d.includes(`${role} ·`) || d.includes(`· ${role}`); const br = bRel.get(`${r.from}>${r.to}`); NEW = !br || (id === r.from ? br.npc1Role : br.npc2Role) !== role;
    if (fem) add('L01 styled role (woman)', seed, c.gender === 'female' && c.title === role.replace('lady', 'lord').replace('abbess', 'abbot').replace('priestess', 'priest'), `${c.name} ${c.gender} title=${c.title} row=${role} onPage=${onPage}`);
    if (masc) add('L01b masculine role word on a row', seed, c.gender !== 'female', `${c.name} ${c.gender} row=${role} onPage=${onPage}`);
  }
  // L01w a woman whose title has a feminine form, named on any line beside the masculine word (the one home's reach)
  { const lines = d.split('\n'); for (const c of npcs) if (c.gender === 'female' && ['the lord', 'the abbot', 'the senior abbot', 'the high priest'].includes(c.title)) {
    const first = String(c.name).split(' ')[0]; const masc = c.title.replace(/^the /, '');
    for (const l of lines) if (l.includes(c.name) && new RegExp(`\\b(the|a) ${masc}\\b`, 'i').test(l) && !/^==/.test(l)) { NEW = null; add('L01w a woman named beside her title\'s masculine word', seed, false, `${c.name} (${c.title}): ${l.slice(0, 200)}`); } } }
  // L02 the midwife's honorific
  for (const c of npcs) if (c.title === 'the midwife') { for (const h of ['Goodman', 'Goodwife']) if ((NEW = h === 'Goodman') !== null && (d.includes(`${h} ${c.name}`) || d.includes(`${h} ${String(c.name).split(' ')[0]}`))) add(`L02 midwife ${h}`, seed, (h === 'Goodman') === (c.gender !== 'female'), `${h} ${c.name} ${c.gender}`); }
  // L03 / L04 the DM block's possessives
  const bd = process.env.BDUMPS ? (() => { try { return fs.readFileSync(`${process.env.BDUMPS}/${seed}.txt`, 'utf8'); } catch { return null; } })() : null; const bset = bd ? new Set(bd.split('\n')) : null;
  for (const line of d.split('\n')) { NEW = bset ? !bset.has(line) : null;
    if (/is third in .* and carries .* requests to the two above\./.test(line)) add('L03a rank-3 asker', seed, !/s's\b/.test(line), line.slice(0, 220));
    if (/While the seat of .* stands empty, its steward .* requests go through/.test(line)) add('L03b steward asker', seed, !/s's\b/.test(line), line.slice(0, 220));
    if (/goes after .* people when it can catch them/.test(line)) add('L04a adversarial possessive', seed, !/s's\b/.test(line), line.slice(0, 220));
    if (/A case that touches .* business goes nowhere\./.test(line) && !/touches its business/.test(line)) add('L04b captured possessive', seed, !/s's\b/.test(line), line.slice(0, 220));
    if (/\bGuilds's|Authorities's|Orders's|Houses's|Families's|Holders's|Circles?'s\b.*/.test(line) && /'s/.test(line)) add('L03z any s\'s possessive of a power', seed, false, line.slice(0, 200));
  }
  // L05 the minted lords' structural rows; the office lines; the governor's debts
  const lords = npcs.filter((c) => c.title === 'the lord');
  for (const c of lords) {
    const m = (c.memberships || []).find((x) => x.rank === 1) || (c.memberships || [])[0]; const body = F.find((f) => f.faction === m?.power);
    const pos = String(c.structuralPosition || ''); const con = String(c.activeConstraint || ''); NEW = J(bCard.get(c.id)?.structuralPosition) !== J(c.structuralPosition);
    if (/\boffice\b|Holds an office/i.test(pos + ' ' + con) && !/Holds the seat/.test(pos)) add('L05x lord reads an office', seed, false, `${c.name}: ${pos} | ${con}`);
    if (!pos) continue;
    const nobles = F.filter((f) => f.category === 'noble' || NOBLE.test(f.faction));
    const strongest = nobles.every((f) => (f.power || 0) <= (body?.power || 0));
    const outweighsGov = gov && body && (body.power || 0) > (gov.power || 0);
    if (/^Heads an old family while the seat's offices take up more/.test(pos)) add('L05a lord: Heads an old family (calm) + its say shrinks beside the offices', seed, strongest && !outweighsGov && !!gov, `${c.name} of ${body?.faction} ${body?.power}/${body?.powerLabel}; gov ${gov?.faction} ${gov?.power}/${gov?.powerLabel}; ${pos} | ${con}`);
    else if (/^Heads an old family while the seat fails/.test(pos)) add('L05b lord: Heads an old family while the seat fails', seed, strongest && (st.includes('politically_fractured') || st.length > 0), `${c.name} of ${body?.faction}; ${st}; ${pos}`);
    else if (/^Belongs to a lesser/.test(pos)) add('L05c lord: Belongs to a lesser family behind the leading one', seed, !strongest, `${c.name} of ${body?.faction} ${body?.power}; nobles ${nobles.map((f) => f.faction + ':' + f.power).join(',')}`);
    else add('L05z lord: other structural row', seed, true, `${c.name}: ${pos}`);
  }
  for (const r of s.relationships || []) if (r.archetypeKey === 'gov_econ_dependence') { NEW = bRel.get(`${r.from}>${r.to}`)?.description !== r.description; const a = byId.get(r.from), b = byId.get(r.to); for (const c of [a, b]) if (c && c.title === 'the lord') add('L05y governor\'s debt row on a lord', seed, false, `${c.name}: ${String(r.description).slice(0, 160)}`); }
  // L06 the minted face's secret: "the local underworld" / "a powerful outside interest"
  const sig = crimeSignalOf({ seats: F, estate: s.institutions || [] });
  for (const c of npcs) { const w = String(c.secret?.what || ''); if (!d.includes(w.slice(0, 40))) continue; NEW = bCard.get(c.id)?.secret?.what !== c.secret?.what;
    if (/the local underworld/.test(w)) add('L06a secret: the local underworld', seed, !!(sig?.present || F.some((f) => f.category === 'criminal')), `${c.name} (${c.title}): ${w.slice(0, 140)} | crime present=${sig?.present} factions=${(sig?.factions || []).join('/')}`);
    if (/a powerful outside interest/.test(w)) add('L06b secret: a powerful outside interest', seed, true, `${c.name}: ${w.slice(0, 140)} | crime present=${sig?.present}`);
    if (/thieves['’]? guild|criminal guild/i.test(w)) add('L06c secret names a thieves\' guild', seed, F.some((f) => /thie|criminal guild/i.test(f.faction)) || (sig?.factions || []).some((n) => /thie/i.test(n)) || (s.institutions || []).some((i) => /thie/i.test(i.name)), `${c.name} (${c.title}): ${w.slice(0, 140)}`);
  }
  // L07 the title lines' disqualifiers: a declared line printing where the town refuses it; its replacement
  const DECL = { "Buys fish from boats that fished where they are forbidden to": 'navigable', "Has been buying stolen ship's stores at night": 'coast', "Has been taking timber from the river's driftwood": 'river',
    'Cheerful in the cold and the stink of the market.': 'navigable', 'Smells of wax and soap, friendly and talkative': 'coast', 'Easy and talkative, proud of every boat on the river': 'river', 'Watches visitors near the slipway. Keeps the half-built hulls under cover.': 'river' };
  for (const c of npcs) { const txt = `${c.secret?.what || ''} || ${c.presentation?.impression || ''}`; const bc = bCard.get(c.id); NEW = !bc || bc.secret?.what !== c.secret?.what || bc.presentation?.impression !== c.presentation?.impression;
    for (const [k, need] of Object.entries(DECL)) if (txt.includes(k)) add(`L07 declared title line prints (${need})`, seed, !!water?.[need], `${c.name} (${c.title}) water=${water?.kind}: ${k}`);
    if (/foundlings to families who pay/.test(txt)) add('L07 foundling sale (topic human_trafficking)', seed, true, `${c.name} cfg.content=${JSON.stringify(s.config?.contentProfile || s.config?.contentSettings || null).slice(0, 80)}`);
    // the plain fishmonger's boat lines (no declaration: a twin lacking its sibling's condition?)
    if (/Owes the boats a month of fish|Talks about the boats, the weather/.test(`${c.secret?.what || ''} ${c.presentation?.behaviour || c.presentation?.disposition || ''} ${JSON.stringify(c.presentation || {})}`)) add('L07t the fishmonger\'s boat lines (undeclared twin)', seed, !!water?.navigable, `${c.name} (${c.title}) water=${water?.kind}`);
  }
  // L09 the head rows of a power's first (npcStructure: headsItsKind / UNDER_KINDS)
  for (const c of npcs) { const pos = String(c.structuralPosition || ''); if (!pos) continue; NEW = bCard.get(c.id)?.structuralPosition !== c.structuralPosition; const m = (c.memberships || []).find((x) => x.rank === 1); const body = m && F.find((f) => f.faction === m.power);
    const kinds = { economy: ['economy'], other: ['noble'], religious: ['religious'], criminal: ['criminal'], magic: ['magic'] }[c.category];
    const strongestKind = body && kinds && kinds.includes(body.category) && F.filter((f) => kinds.includes(f.category)).every((f) => (f.power || 0) <= (body.power || 0));
    if (/^(Leads the faith|Heads the crew|Heads the casters|Heads the leading house in the trade)/.test(pos)) add(`L09 head row: ${pos.split(/[;,]| while| in | among/)[0]}`, seed, !!strongestKind, `${c.name} (${c.title}, ${c.category}) of ${body?.faction || m?.power || '-'} ${body?.power}/${body?.powerLabel}; kind ${F.filter((f) => kinds?.includes(f.category)).map((f) => f.faction + ':' + f.power).join(',')}: ${pos.slice(0, 100)}`);
    if (m && /^(Serves the faith under its leaders|Holds a place under the crew's boss|Works spells under the senior casters|Holds a place in a crew)/.test(pos)) add('L09u a power\'s first reads under its own leaders', seed, false, `${c.name} (${c.title}) first of ${m.power}: ${pos.slice(0, 100)}`);
  }
  // L10 the conflict issue
  for (const cf of [...(s.powerStructure?.conflicts || []), ...(s.conflicts || [])]) if (/refuses to obey/.test(String(cf?.issue || '')) && (NEW = true)) add('L10 ' + cf.issue, seed, /A ruling that one power refuses to obey/.test(cf.issue) && d.includes('refuses to obey'), `${cf.parties} ; prints=${d.includes('refuses to obey')}`);
  // L11 the third power's standing line; the steward's note
  const ord = [...F].sort((a, b) => (b.power || 0) - (a.power || 0));
  for (const [i, f] of ord.entries()) { const desc = String(f.desc || ''); NEW = bFac.get(f.faction)?.desc !== f.desc;
    if (desc.includes('They are always at the table, but cannot set their own terms.') && d.includes('They are always at the table, but cannot set their own terms.')) add('L11a third power: always at the table', seed, i >= 2, `${f.faction} rank ${i + 1} ${ord.slice(0, 4).map((x) => x.faction + ':' + x.power + '/' + x.powerLabel).join(', ')}`);
    if (desc.includes('Three powers stand almost level here') && d.includes('Three powers stand almost level here')) add('L11c three powers almost level (kept twin)', seed, (ord[0].power - ord[2].power) <= 10 && !ord.slice(0, 3).some((x) => /dominant/i.test(x.powerLabel || '')), `${f.faction} ${ord.slice(0, 4).map((x) => x.faction + ':' + x.power + '/' + x.powerLabel).join(', ')}`);
    if (desc.includes('each would say it does')) add('L11b steward note: each would say it does', seed, d.includes('each would say it does'), `${f.faction}: …${desc.slice(-140)}`);
    if (desc.includes('both would say themselves')) add('L11z the old steward note still prints', seed, false, f.faction);
    if (desc.includes('An external interest with its own people placed inside the settlement.')) add('L13a infiltrator desc', seed, true, `${f.faction} hidden=${f.hidden} prints=${d.includes('An external interest with its own people')}`);
    if (desc.includes('Authority flows through military channels now.') && !desc.includes('Crown authority')) add('L13b sovereign wartime: Authority flows through military channels', seed, (s.institutions || []).some((x) => /^city-state government$/i.test(x.name)), `${f.faction} prints=${d.includes('Authority flows through military channels now.')}`);
    if (/^Emergency body (coordinating|with powers)/.test(desc)) add('L13c sovereign War Council: Emergency body', seed, true, `${f.faction} prints=${d.includes(desc.slice(0, 60))}`);
    if (desc.includes('give them structural influence the seat cannot easily override')) add('L15 noble: the seat cannot easily override', seed, !['Town Council', 'City Council', 'Grand Council'].includes(gov?.faction), `${f.faction} ${f.power}/${f.powerLabel}; gov ${gov?.faction}; vacant=${isSeatVacant ? isSeatVacant(s) : '?'}; prints=${d.includes('the seat cannot easily override')}`);
    if (desc.includes('structural influence the elected council cannot easily override')) add('L15b noble: the elected council (kept)', seed, ['Town Council', 'City Council', 'Grand Council'].includes(gov?.faction), `${f.faction}; gov ${gov?.faction}`);
  }
  // L12 the sovereign wartime vignette
  NEW = true;
  const sov = (s.institutions || []).some((x) => /^city-state government$/i.test(x.name));
  for (const [k, re] of [['L12a the city treasury pays its bills', /the city treasury pays its bills/], ['L12b an army quartermaster came last week', /An army quartermaster came last week/]]) if (re.test(d)) add(k, seed, sov && st.includes('wartime'), `sov=${sov} stress=${st}`);
  if (sov && st.includes('wartime')) { const crown = d.split('\n').filter((l) => /\bcrown\b/i.test(l) && !/^==/.test(l)); add('L12t a sovereign wartime town: any line naming a crown', seed, crown.length === 0, crown.slice(0, 3).map((l) => l.slice(0, 160)).join(' || ')); }
  // L16 the claim rungs (settleClaimsToLabel)
  const RUNG = [['Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.', 'merch'], ['The local clergy serve a real pastoral role', 'clergy'], ['Clergy are present but operate at the margins of civic life', 'clergy'],
    ['Mages and arcane practitioners hold real influence through monopoly on magical services', 'mage'], ['Magical practitioners are consulted but not formally empowered.', 'mage'],
    ['Organised criminal network controls the black market and several informal revenue streams; present in council discussions through intermediaries.', 'crimC'], ['A local protection operation tolerated', 'crim'], ['Criminal network operating in shadows', 'crim'],
    ['Hereditary landowners with genuine but not dominant feudal claims', 'noble'], ['Noble families with residual feudal claims', 'noble'], ['Gentry families with local landholdings; active in civic politics but outpaced by merchant capital', 'gentryM'],
    ['Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital.', 'nobleM'], ['Minor landed families with limited political reach', 'noble']];
  for (const f of F) { const desc = String(f.desc || ''); NEW = bFac.get(f.faction)?.desc !== f.desc; for (const [t, kind] of RUNG) if (desc.startsWith(t)) {
    const merch = F.filter((x) => x.category === 'economy' || /merchant|trade|commerc|guild/i.test(x.faction));
    let ok = /Minor|Suppressed/.test(f.powerLabel || ''); let why = `${f.faction} ${f.power}/${f.powerLabel}`;
    if (kind === 'gentryM') { ok = ok && merch.some((x) => (x.power || 0) > (f.power || 0)); why += ` merchants ${merch.map((x) => x.faction + ':' + x.power).join(',') || 'NONE'}`; }
    if (kind === 'nobleM') { ok = ok && merch.length > 0; why += ` merchants ${merch.map((x) => x.faction + ':' + x.power).join(',') || 'NONE'}`; }
    if (kind === 'crimC') { const council = /council|assembly|senate|parliament|diet|moot|thing/i.test(String(gov?.faction || '')); why += ` gov ${gov?.faction}`; ok = ok && council; }
    if (kind === 'merch') { why += ` merchants ${merch.map((x) => x.faction + ':' + x.power + '/' + x.powerLabel).join(',')}`; ok = ok && merch.some((x) => x !== f && (x.power || 0) > (f.power || 0)); }
    if (kind === 'mage') { why += ''; }
    add(`L16 rung: ${t.slice(0, 60)}`, seed, ok, why + ` prints=${d.includes(t.slice(0, 50))}`);
  } }
  // L16t a claim the table leaves beside a Minor/Suppressed label (siblings without the condition)
  for (const f of F) if (/Minor|Suppressed/.test(f.powerLabel || '')) { const desc = String(f.desc || ''); NEW = bFac.get(f.faction)?.desc !== f.desc;
    if (/(Dominant commercial|^Dominant|direct temporal power|substantial temporal power|substantial political leverage|genuine political weight|effectively controls|captured significant|structurally embedded in governance|expect political weight|structural influence|heavy cavalry|decisive weight|hold the purse|set prices)/.test(desc) && d.includes(desc.slice(0, 50))) add('L16t a commanding claim beside a Minor/Suppressed label', seed, false, `${f.faction} ${f.power}/${f.powerLabel}: ${desc.slice(0, 160)}`); }
  NEW = null;
  // L17 the Breakdown block
  if (/^Breakdown$/m.test(d)) add('L17 Breakdown heading prints', seed, false, 'Breakdown');
  for (const l of d.split('\n')) if (/^(Prosperity|Safety|Stability|Governance|Tradition|Corruption|Legitimacy|Order|Fear|Faith|Wealth|Justice)[a-z ]* [+−-]\d+$/.test(l)) { add('L17b a breakdown chip prints', seed, false, l); break; }
  // L18 the keeper, styled (no reader at the tip: the leaf's own answer, on every vacant seat)
  if (seatKeeperStyledNameOf && isSeatVacant && isSeatVacant(s)) { const k = seatKeeperOf(s); const v = seatKeeperStyledNameOf(s); const form = keeperFormOf(s);
    const bad = !k ? v !== '' : (!v.endsWith(String(k.name)) || /^(the |The )/.test(v) || (form && v.split(' ').slice(0, -String(k.name).split(' ').length).join(' ') !== form) || /\b(\w+) \1\b/i.test(v) || (() => { const par = /\(([^)]+)\)/.exec(v)?.[1]?.replace(/^the /i, '').toLowerCase(); return !!(form && par && par.split(' ').some((w) => w.length > 3 && form.toLowerCase().includes(w))); })());
    add('L18 seatKeeperStyledNameOf on a vacant seat', seed, !bad, `${v} | keeper ${k?.name} (${k?.title}) form=${form} prints=${d.includes(v)}`); }
  // L08 a criminal house's default backing (powerSupport.js :: houseBacksOf): what the house's row says now
  { let hb = null; try { hb = houseBacksOf(s); } catch {} if (hb) for (const [key, list] of hb) { const inst = (s.institutions || []).find((x, i) => `${i}` === String(key) || x.name === key || x.id === key);
    const crim = inst ? isCriminalInstitution(inst) : null; if (!crim) continue; NEW = null;
    const def = list.some((x) => x.basis === 'default');
    add(def ? 'L08 a criminal house: Under the ruling power (default)' : list.length ? 'L08 a criminal house: backed by a power' : 'L08 a criminal house: no backing row (silent)', seed, !def, `${inst?.name}: ${list.map((x) => x.faction + '/' + x.basis).join(', ') || '(none)'}`); } }
}
const out = Object.fromEntries(Object.entries(R).sort().map(([k, r]) => [k, { ...r, towns: r.towns.size, townList: [...r.towns].slice(0, 400), newTowns: r.newTowns.size, newTownList: [...r.newTowns].slice(0, 400) }]));
fs.writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
for (const [k, r] of Object.entries(out)) console.log(`${k} :: prints ${r.prints} in ${r.towns} towns (true ${r.true}, false ${r.false}); NEW at tip ${r.newPrints} in ${r.newTowns} towns (true ${r.newTrue}, false ${r.newFalse}); sizes ${JSON.stringify(r.sizes)}`);
