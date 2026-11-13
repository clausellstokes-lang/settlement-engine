// REVIEW-VEIL-3: a leak differential on HAND-BUILT shares (not generated towns). Every sensitive value is a
// unique token. For each case: the 211 server's response (gallery `data`, link `dossier`) against the page the
// 210 client drew from the 210 response (sanitizeDossier's path: toPublicSafe over the server projection, then
// projectShareVeil). A token in a 211 response that the 210 page lacks is a LEAK. A token on the 210 page that
// the 211 page lacks is HIDE-MORE (reported, not a leak).
//   PGHOST=/var/tmp/rv3 PGUSER=postgres node leakfuzz.mjs <db cloned from a 211 chain> <cases> <seed>
const SP = '/tmp/claude-0/-home-user-settlement-engine/41bd6027-5844-54f9-b716-fc5eddd88409/scratchpad';
const pg = (await import(`${SP}/pgmod/node_modules/pg/lib/index.js`)).default;
const V = await import(`${SP}/veil5/src/domain/display/galleryVeil.js`);
const P = await import(`${SP}/veil5/src/domain/display/publicSafe.js`);
const [DB, CASES = '200', SEED = '1'] = process.argv.slice(2);
const db = new pg.Client({ database: DB }); await db.connect();
await db.query(`insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111') on conflict do nothing;
  insert into public.profiles (id) values ('11111111-1111-1111-1111-111111111111') on conflict do nothing;
  update public.profiles set role = 'developer' where id = '11111111-1111-1111-1111-111111111111';`);

let s = Number(SEED) >>> 0;
const r = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2 ** 32; };
const pick = (a) => a[Math.floor(r() * a.length)];
let tokN = 0;
const tok = (tag) => `TOK${String(++tokN).padStart(6, '0')}${tag}`;
const ODD = () => pick([null, 0, 1, -0.0, '', 'x', true, false, [], {}, [null], 1e21, 5e-324, '0', [1, [2]], { a: 1 }]);
const maybe = (p, v) => (r() < p ? v : undefined);
const clean = (o) => JSON.parse(JSON.stringify(o));

function npc(i, houses) {
  const id = pick([`npc-${i}`, `npc-${i}`, `npc-${i}`, i, undefined, `npc:${i}:x`, ` npc ${i} `]);
  return clean({
    id, name: pick([`Person ${i}`, `Person ${i}`, `İrem ${i}`, '', undefined, `Pérson-${i}`]), role: tok('role'), title: tok('title'),
    personality: maybe(0.8, tok('pers')), physical: maybe(0.6, tok('phys')), goal: maybe(0.7, tok('goal')), goals: maybe(0.3, [tok('goals')]),
    activeConstraint: maybe(0.4, tok('constr')), whereabouts: maybe(0.4, tok('where')), location: maybe(0.3, tok('loc')),
    secret: maybe(0.8, pick([tok('secret'), { text: tok('secretobj') }, [tok('secretarr')]])),
    relationships: maybe(0.5, [{ target: tok('reltarget'), type: 'rival' }]),
    institution: maybe(0.6, pick([...houses, { kind: 'house', key: pick(houses.length ? houses : ['h']), name: tok('instname') }, tok('inststr')])),
    linkedInstitutionIds: maybe(0.4, houses.slice(0, 2)),
    plotHooks: maybe(0.6, [tok('hook')]), allegiance: maybe(0.4, tok('alleg')), corrupt: maybe(0.3, pick([true, 1, 'yes'])),
    corruptionVector: maybe(0.3, tok('cvec')), corruptTies: maybe(0.3, [tok('cties')]),
    weirdHookField: maybe(0.2, tok('weirdhook')), extra: maybe(0.2, ODD()),
  });
}
function institution(i) {
  const kind = pick(['criminal', 'clandestine', 'brokerage', 'plain', 'plain', 'subterranean']);
  const name = `House ${i} ${pick(['', "Thieves' Guild", 'Black Market', 'Temple'])}`.trim();
  return clean({
    id: pick([`inst-${i}`, undefined, i, `inst-${i}`]), refId: maybe(0.2, `ref-${i}`), name,
    category: kind === 'criminal' ? pick(['criminal', 'Criminal', 'CRIMINAL']) : pick(['civic', 'religious', 'trade']),
    priorityCategory: maybe(0.2, 'criminal'),
    facets: kind === 'clandestine' ? { clandestine: 'clandestine' } : kind === 'subterranean' ? { subterranean: 'subterranean' } : maybe(0.3, { institutionFunction: pick(['clandestine', 'civic']) }),
    tags: kind === 'brokerage' ? ['brokerage', 'criminal'] : maybe(0.4, [pick(['facet:clandestine:clandestine', 'civic', 'facet:subterranean:subterranean'])]),
    serviceKeys: kind === 'brokerage' ? [pick(['info_query', 'info_feed', 'info_plant', 'info_calibration'])] : maybe(0.3, ['bread']),
    desc: tok('idesc'), description: maybe(0.4, tok('idescription')), tier: 'minor',
  });
}
function doc(n) {
  const insts = Array.from({ length: 1 + Math.floor(r() * 5) }, (_, i) => institution(n * 10 + i));
  const houses = insts.map((x) => x.name);
  const npcs = Array.from({ length: 1 + Math.floor(r() * 5) }, (_, i) => npc(n * 10 + i, houses));
  const factions = Array.from({ length: Math.floor(r() * 3) }, (_, i) => clean({
    faction: pick([`Faction ${n}${i}`, undefined]), name: `Faction ${n}${i}`, category: pick(['criminal', 'civic', 'Criminal']), power: 3,
    desc: tok('fdesc'), goals: maybe(0.6, [tok('fgoal')]), agenda: maybe(0.3, tok('fagenda')), conflicts: maybe(0.4, [tok('fconf')]),
    members: maybe(0.6, npcs.slice(0, 2).map((x) => ({ ...x, secret: tok('msecret') }))), captureState: maybe(0.4, tok('fcapture')), crisisNote: maybe(0.3, tok('fcrisis')),
  }));
  const ev = () => clean({ id: maybe(0.5, `ev-${tokN}`), name: maybe(0.5, pick([`Event ${tokN}`, '', 0])), title: maybe(0.3, `T ${tokN}`), label: maybe(0.2, pick(['L', 0, ''])),
    type: 'war', description: tok('evdesc'), lastingEffects: maybe(0.5, [tok('evlast')]), plotHooks: maybe(0.5, [tok('evhook')]) });
  return clean({
    name: `Town ${n}`, tier: 'town', population: 500 + n,
    npcs, institutions: insts,
    powerStructure: { factions, criminalCaptureState: maybe(0.5, tok('pcapture')), factionRelationships: maybe(0.4, [{ a: 1, captureState: tok('relcapture') }]), government: 'council' },
    history: { historicalEvents: Array.from({ length: Math.floor(r() * 4) }, ev), eventsTimeline: maybe(0.3, [ev()]),
      currentTensions: maybe(0.6, [clean({ name: maybe(0.6, `Tension ${n}`), type: 'feud', description: tok('tdesc'), plotHooks: maybe(0.5, [tok('thook')]) })]) },
    conflicts: maybe(0.5, [clean({ parties: [`A${n}`, `B${n}`], issue: `issue ${n}`, intensity: 2, stakes: tok('cstakes'), desc: tok('cdesc'), plotHooks: maybe(0.5, [tok('chook')]) })]),
    relationships: maybe(0.5, [clean({ from: npcs[0].name, to: npcs[npcs.length - 1].name, type: 'rival', tension: tok('rtension'), description: tok('rdesc'), plotHooks: maybe(0.5, [tok('rhook')]) })]),
    availableServices: { criminal: maybe(0.6, [{ name: tok('svccrim'), institution: houses[0] }]), trade: insts.map((x) => ({ name: tok('svc'), institution: x.name })) },
    economicState: { prosperity: 'modest', safetyProfile: { criminalInstitutions: maybe(0.5, [tok('spcrim')]), crimeTypes: maybe(0.5, [tok('spcrimetype')]), blackMarketCapture: maybe(0.5, tok('spbm')) } },
    structuralViolations: maybe(0.6, [{ reason: pick(['Weak walls', 'No garrison', 'Food shortfall', 'Militia only']), detail: tok('sv') }, { reason: 'Trade gap', detail: tok('sv2') }]),
    structuralSuggestions: maybe(0.4, [tok('ss')]), coherenceNotes: maybe(0.5, [tok('cn')]), generationCoherenceReceipt: maybe(0.4, { r: tok('rcpt') }),
    decrees: maybe(0.4, [tok('decree')]), dmLayer: maybe(0.4, { x: tok('dml') }),
    lore: maybe(0.4, { someHook: tok('lorehook'), deep: { deeper: { theHOOKs: tok('deephook'), ok: tok('deepok') } } }),
    publicProse: maybe(0.4, { blocks: { 'defense:criminal': { text: tok('ppcrim') }, 'power:desk': { legitimacyReading: tok('pplegit'), captureReading: tok('ppcap'), operationReading: tok('ppop'), gmAdvisory: tok('ppgm'), other: tok('ppother') } } }),
  });
}
function veilFor(d) {
  // addresses from the client's own curate model where possible, plus random raw ones
  const pub = P.toPublicSafe(d, { full: true });
  const addrs = new Set(V.defaultVeilFor ? [...V.defaultVeilFor(pub)].map((x) => (typeof x === 'string' ? x : x.address)).filter(Boolean) : []);
  for (const g of Object.keys(V.GROUPING_REMOVERS)) addrs.add(g);
  for (const kind of Object.keys(V.CARD_KINDS)) {
    for (const f of Object.keys(V.CARD_KINDS[kind].fields)) addrs.add(`class:${kind}:${f}`);
  }
  const ids = [];
  for (const x of d.npcs) ids.push(['npc', P.galleryMemberKey(x)]);
  for (const x of d.institutions) { try { ids.push(['institution', V.CARD_KINDS.institution.idOf(x)]); } catch { /* */ } }
  for (const x of d.powerStructure.factions) { try { ids.push(['faction', V.CARD_KINDS.faction.idOf(x)]); } catch { /* */ } }
  for (const x of d.history.historicalEvents) { try { ids.push(['event', V.CARD_KINDS.event.idOf(x)]); } catch { /* */ } }
  for (const [kind, id] of ids) {
    if (!id) continue;
    addrs.add(`card:${kind}:${id}`);
    for (const f of Object.keys(V.CARD_KINDS[kind].fields)) addrs.add(`field:${kind}:${id}:${f}`);
  }
  const all = [...addrs];
  const deltas = [];
  const n = Math.floor(r() * Math.min(40, all.length + 1));
  for (let i = 0; i < n; i++) deltas.push({ address: pick(all), hidden: r() < 0.6 });
  const ov = {};
  for (const x of d.npcs) if (r() < 0.3) ov[P.galleryMemberKey(x)] = { revealDm: pick([true, false, false]) };
  return { deltas, ov };
}
const TOK_RE = /TOK\d{6}[a-z]+/g;
const toks = (v) => new Set(JSON.stringify(v ?? null).match(TOK_RE) || []);

const shownHist = {}; const caseCls = {}; let otherMiss = 0; let veilMiss = 0; let projDiv = 0; let pageChange = 0; let leaks = 0; let hideMore = 0; let raised = 0; let cases = 0; const examples = []; const divExamples = [];
for (let c = 0; c < Number(CASES); c++) {
  const d = doc(c);
  const { deltas, ov } = veilFor(d);
  const dm = r() < 0.3;
  const snap = r() < 0.3;
  let overrides = V.writeShareVeil(ov, deltas, snap ? { mode: 'snapshot', at: '2026-11-01T00:00:00.000Z', snapshot: V.galleryPayloadFor(d, { shareDm: dm, memberOverrides: ov }) } : { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
  const id = `cccccccc-0000-0000-0000-${String(c).padStart(12, '0')}`;
  await db.query('delete from public.settlements where id = $1', [id]);
  await db.query(`insert into public.settlements (id, user_id, name, tier, data, is_public, public_slug, published_at, unlisted_slug, visibility, gallery_member_overrides, gallery_share_dm, gallery_importable)
    values ($1, '11111111-1111-1111-1111-111111111111', 'T', 'town', $2, true, $3, now(), $4, 'unlisted', $5, $6, true)`,
  [id, JSON.stringify(d), `fz${SEED}-${c}`, `fzl${SEED}-${c}`, JSON.stringify(overrides), dm]);
  cases++;
  try {
    await db.query(`select set_config('test.uid', '', false)`);
    const g = (await db.query('select * from public.get_gallery_dossier($1)', [`fz${SEED}-${c}`])).rows[0];
    const l = (await db.query('select public.get_unlisted_dossier($1) as o', [`fzl${SEED}-${c}`])).rows[0].o;
    // the 210 response's data: the projection + splice of the source (the copy in snapshot mode is what the 210 CLIENT drew)
    const src = snap ? 'gallery_member_overrides #> \'{$veil,snapshot}\'' : 'data';
    const p210 = (await db.query(`select public._gallery_apply_member_overrides(
        case when gallery_share_dm then public._gallery_dm_full_json(data) else public._gallery_sanitize_public_json(data) end,
        public._gallery_dm_full_json(data), gallery_member_overrides, gallery_share_dm, gallery_importable, false) as d,
        public._gallery_sanitize_public_json(${src}) as copy_pub, public._gallery_dm_full_json(${src}) as copy_dm
        from public.settlements where id = $1`, [id])).rows[0];
    // 210 client gallery page: source = the stored copy (snapshot) else the row's data
    const share = V.readShareMode(overrides);
    const src210 = share.mode === 'snapshot' && share.snapshot ? share.snapshot : p210.d;
    const page210 = V.projectShareVeil(P.toPublicSafe(src210, { full: dm, memberOverrides: overrides }), overrides);
    const page211 = V.projectServedVeil(g.data, g.gallery_member_overrides);
    // 210 link page (party link: never full, no member restore, default veil when unmarked)
    const link210src = (await db.query(`select public._gallery_apply_member_overrides(public._gallery_sanitize_public_json(data), public._gallery_sanitize_public_json(data), gallery_member_overrides, false, gallery_importable, false) as d from public.settlements where id = $1`, [id])).rows[0].d;
    const linkPage210 = V.projectShareVeil(P.toPublicSafe(link210src, { full: false, memberOverrides: null }), overrides);
    const T210 = toks(page210); const L210 = toks(linkPage210);
    // the client's projection WITHOUT the veil: a token there that the veiled page lacks was hidden by the VEIL
    const U210 = toks(P.toPublicSafe(src210, { full: dm, memberOverrides: overrides }));
    const UL210 = toks(P.toPublicSafe(link210src, { full: false, memberOverrides: null }));
    const linkPage211 = V.projectServedVeil(l.dossier, l.gallery_member_overrides);
    const missG = [...toks(g.data)].filter((t) => !T210.has(t) && U210.has(t));
    const missL = [...toks(l.dossier)].filter((t) => !L210.has(t) && UL210.has(t));
    // classify each miss by where the server sends it: inside an npcs[] card with no name and no role (the
    // card the client's projection drops whole: filter(npc => npc.name || npc.role)) or anywhere else
    const pathsOf = (o, t, p = '', out = []) => { if (o && typeof o === 'object') { for (const [k, v] of Object.entries(o)) pathsOf(v, t, p + '.' + k, out); } else if (typeof o === 'string' && o.includes(t)) out.push(p); return out; };
    const namelessOnly = (resp, t) => pathsOf(resp, t).every((p) => { const m = p.match(/^\.npcs\.(\d+)\./); if (!m) return false; const card = resp.npcs[Number(m[1])]; return !(card && (card.name || card.role)); });
    const other = [...missG.filter((t) => !namelessOnly(g.data, t)), ...missL.filter((t) => !namelessOnly(l.dossier, t))];
    if (other.length) { otherMiss++; if (examples.length < 12) examples.push({ c, OTHERMISS: other.slice(0, 6), dm, snap }); }
    if (missG.length || missL.length) { veilMiss++; if (examples.length < 12) examples.push({ c, VEILMISS: true, missG: missG.slice(0, 6), missL: missL.slice(0, 6) }); }
    const divG = [...toks(g.data)].filter((t) => !T210.has(t) && !U210.has(t));
    const divL = [...toks(l.dossier)].filter((t) => !L210.has(t) && !UL210.has(t));
    if (divG.length || divL.length) { projDiv++; if (divExamples.length < 6) divExamples.push({ c, dm, snap, divG: divG.slice(0, 4), divL: divL.slice(0, 4) }); }
    const pg211 = toks(page211); const pl211 = toks(linkPage211);
    const shown = [...[...pg211].filter((t) => !T210.has(t)).map((t) => ['G', t, g.data]), ...[...pl211].filter((t) => !L210.has(t)).map((t) => ['L', t, l.dossier])];
    for (const [side, t, resp] of shown) {
      const tag = t.replace(/TOK\d{6}/, '');
      const ps = pathsOf(resp, t);
      const inNameless = ps.length && ps.every((p) => { const m = p.match(/^\.npcs\.(\d+)\./); if (!m) return false; const raw = d.npcs[Number(m[1])]; return raw && !raw.name; });
      const key = `${side}:${tag}:${inNameless ? 'nameless-npc' : (ps[0] || '?').replace(/\.\d+/g, '[]').slice(0, 60)}`;
      shownHist[key] = (shownHist[key] || 0) + 1;
    }
    if (shown.length) {
      pageChange++;
      const cls = new Set(Object.keys(shownHist).length ? shown.map(([side, t, resp]) => { const ps = pathsOf(resp, t); return ps.length && ps.every((p) => { const m = p.match(/^\.npcs\.(\d+)\./); return m && d.npcs[Number(m[1])] && !d.npcs[Number(m[1])].name; }) ? 'nameless' : (ps.every((p) => /^\.(decrees|dmLayer)\b/.test(p)) ? 'decrees' : 'other'); }) : []);
      caseCls[[...cls].sort().join('+')] = (caseCls[[...cls].sort().join('+')] || 0) + 1;
      const revealed = shown.every(([side, t, resp]) => pathsOf(resp, t).every((p) => { const m = p.match(/^\.npcs\.(\d+)\./); if (!m) return false; const card = resp.npcs[Number(m[1])]; const key = card ? P.galleryMemberKey(card) : null; return key && overrides[key] && overrides[key].revealDm === true; }));
      caseCls[revealed ? 'ALL-REVEALED-BY-DM' : 'NOT-ALL-REVEALED'] = (caseCls[revealed ? 'ALL-REVEALED-BY-DM' : 'NOT-ALL-REVEALED'] || 0) + 1;
    }
    const leakG = [...toks(g.data)].filter((t) => !T210.has(t));
    const leakO = [...toks(g.gallery_member_overrides), ...toks(l.gallery_member_overrides)];
    const leakL = [...toks(l.dossier)].filter((t) => !L210.has(t));
    const more = [...T210].filter((t) => !toks(page211).has(t));
    if (leakG.length || leakL.length || leakO.length) { leaks++; if (examples.length < 12) examples.push({ c, dm, snap, leakG: leakG.slice(0, 6), leakL: leakL.slice(0, 6), leakO: leakO.slice(0, 4) }); }
    if (more.length) hideMore++;
  } catch (e) { raised++; if (examples.length < 12) examples.push({ c, raised: String(e.message).slice(0, 160) }); }
}
console.log(JSON.stringify({ seed: SEED, cases, caseCls, shownHist, otherMiss, veilMiss, projDiv, pageChange, leaks, hideMore, raised, examples, divExamples }, null, 1));
await db.end();
