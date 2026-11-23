// DISAGREE ITEM (4), MEASURE ONLY (PROSE-6's builder; the chair's N56, brief `briefs/DISAGREE-ITEM4.md`). Read-only on a tree:
//   TREE=/home/user/wt-disagree node <script> [N=150]
// THE QUESTION (E132 item (4)): cell pairs of different desks (or one desk at two positions) that read one fact family
// (food, money for defence, order, walls, trade), one asserting a LACK and the other a SUFFICIENCY, with their co-occurrence
// over 900 births (`dz-<size>-<i>`, i < N, born as `map/disagree.mjs` does). Pages are `buildPrintProse(s, {})`.
// WHICH CELL PRINTED (method step 2): buildPrintProse hands back strings only, and the general desk hands it strings too, so
// no print-time provenance reaches the page. The engine's own record of WHICH POOL AND VID A DESK DREW is the kernel's draw
// ledger (`withPresumptionLedger` around buildPrintProse: `pool = <block>::<key>`, `lineId = vid`). It records DRAWS, not
// prints (a glance row draws and prints nothing), so a drawn vid counts as PRINTED only when:
//   defense / economy / general: the tooth's own matcher for that one vid hits the page (`matchersOf`, `pageTextsOf`,
//     `sidePrinted` of `tests/helpers/oppositeSentencePairs.mjs`, imported);
//   power / stressors / warFaith (the helper's leaves do not hold them): the block's one SENTENCE mount
//     (`sentenceMountForBlock`) is on the page.
const T = process.env.TREE || '/home/user/wt-disagree';
const R = T + '/src/';
const t0 = Date.now();
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { buildPrintProse } = await import(R + 'domain/display/stateProse/printProse.js');
const { withPresumptionLedger } = await import(R + 'domain/facts/presumptionLedger.js');
const { sentenceMountForBlock } = await import(R + 'domain/display/stateProse/dossierMounts.js');
const H = await import(T + '/tests/helpers/oppositeSentencePairs.mjs');
const LEAF = {};
for (const d of ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']) LEAF[d] = Object.values(await import(R + `data/dossierStateProse/${d}.generated.js`))[0];
await loadGenerationLawPayloads();

const L = 'LACK', S = 'SUFFICIENCY';
const row = (family, polarity, desk, position, pool, why) => Object.freeze({ family, polarity, desk, position, pool, why });
// THE CLASSIFICATION: one row a cell, by its KEY and the reader behind it (never a sentence's wording alone).
const CELLS = Object.freeze([
  // ── FOOD ──
  row('food', L, 'defense', 'DS-DEF-2', 'CHAIN: food trades failing', 'chain economic arm < 0 (food trades)'),
  row('food', L, 'defense', 'DS-DEF-2', 'Disasters & Famine: NO reserves, hospital present', 'no granary'),
  row('food', L, 'defense', 'DS-DEF-2', 'Disasters & Famine: NO reserves, NO medical provision', 'no granary'),
  row('food', L, 'defense', 'DS-DEF-3', 'COMPOUND: famine', 'safety label rewritten by famine'),
  row('food', L, 'defense', 'DS-DEF-6', 'Logistics & Supply: No reserves, port open', 'no granary'),
  row('food', L, 'defense', 'DS-DEF-6', 'Logistics & Supply: No reserves, landlocked', 'no granary'),
  row('food', L, 'defense', 'DS-DEF-8', 'override: INTERNAL PRESSURE (famine)', 'famine stress posture'),
  row('food', L, 'defense', 'DS-DEF-10', 'posture INTERNAL PRESSURE (famine)', 'famine stress posture'),
  row('food', L, 'economy', 'DS-ECO-2', 'FOOD: deficit', 'food balance deficit > 0'),
  row('food', L, 'economy', 'DS-ECO-2', 'GRANARY: thin', 'granary outlook band'),
  row('food', L, 'economy', 'DS-ECO-2', 'GRANARY: nearly empty', 'granary outlook band'),
  row('food', L, 'economy', 'DS-ECO-8', 'FOOD AND PROSPERITY: hunger holds the town down', 'food prosperity mod cap'),
  row('food', L, 'economy', 'DS-ECO-8', 'FOOD AND PROSPERITY: the cost of food weighs on the town', 'food prosperity mod penalty'),
  row('food', L, 'economy', 'DS-ECO-9', 'PRESSURED', 'food security label'),
  row('food', L, 'economy', 'DS-ECO-9', 'DEFICIT', 'food security label'),
  row('food', L, 'economy', 'DS-ECO-9', 'ACTIVE FAMINE', 'food security label'),
  row('food', L, 'economy', 'DS-ECO-9', 'ACTIVE FAMINE: the failed source, most of the harvest', 'food band famine'),
  row('food', L, 'economy', 'DS-ECO-9', 'ACTIVE FAMINE: the failed source, part of the harvest', 'food band famine'),
  row('food', L, 'economy', 'DS-ECO-9', 'BLOCKADED', 'food stockpile blockaded'),
  row('food', L, 'economy', 'DS-SUP-3', 'THE FOOD GAP', 'food service category absent'),
  row('food', L, 'general', 'DS-GEN-3', 'foodSecurity.label: Pressured', 'food security label'),
  row('food', L, 'general', 'DS-GEN-3', 'foodSecurity.label: Deficit', 'food security label'),
  row('food', L, 'general', 'DS-GEN-3', 'foodSecurity.label: Deficit × Active Famine', 'food security label'),
  row('food', L, 'power', 'DS-POW-1', 'breakdown dominated by FOOD, adverse', 'legitimacy breakdown, food adverse'),
  row('food', L, 'stressors', 'DS-STR-1', 'FAMINE', 'famine stress banner'),
  row('food', L, 'stressors', 'DS-STR-2', 'SYNERGY: famine × disease_outbreak', 'famine stress synergy'),
  row('food', L, 'stressors', 'DS-STR-2', 'SYNERGY: famine × siege', 'famine stress synergy'),
  row('food', L, 'stressors', 'DS-CND-1', 'DIRECTION: worsening · CRISIS: famine', 'famine condition'),
  row('food', L, 'stressors', 'DS-CND-1', 'DIRECTION: stable · CRISIS: famine', 'famine condition'),
  row('food', L, 'stressors', 'DS-CND-1', 'DIRECTION: easing · CRISIS: famine', 'famine condition'),
  row('food', S, 'defense', 'DS-DEF-2', 'CHAIN: food trades working', 'chain economic arm > 0 (food trades)'),
  row('food', S, 'defense', 'DS-DEF-2', 'Disasters & Famine: granary AND hospital', 'granary present'),
  row('food', S, 'defense', 'DS-DEF-2', 'Disasters & Famine: granary AND parish care only', 'granary present'),
  row('food', S, 'defense', 'DS-DEF-2', 'Disasters & Famine: granary, NO medical provision', 'granary present'),
  row('food', S, 'defense', 'DS-DEF-6', 'Logistics & Supply: Granary + port', 'granary present'),
  row('food', S, 'defense', 'DS-DEF-6', 'Logistics & Supply: Granary in isolation', 'granary present'),
  row('food', S, 'defense', 'DS-DEF-6', 'Logistics & Supply: Granary with road supply', 'granary present'),
  row('food', S, 'economy', 'DS-ECO-2', 'FOOD: surplus', 'food balance surplus > 0'),
  row('food', S, 'economy', 'DS-ECO-2', 'FOOD: balanced', 'food balance even'),
  row('food', S, 'economy', 'DS-ECO-2', 'GRANARY: well stocked', 'granary outlook band'),
  row('food', S, 'economy', 'DS-ECO-2', 'GRANARY: stocked', 'granary outlook band'),
  row('food', S, 'economy', 'DS-ECO-8', 'FOOD AND PROSPERITY: full stores lift the town', 'food prosperity mod bonus'),
  row('food', S, 'economy', 'DS-ECO-9', 'SURPLUS', 'food security label'),
  row('food', S, 'economy', 'DS-ECO-9', 'SECURE', 'food security label'),
  row('food', S, 'general', 'DS-GEN-3', 'foodSecurity.label: Secure', 'food security label'),
  row('food', S, 'general', 'DS-GEN-3', 'foodSecurity.label: Surplus', 'food security label'),
  row('food', S, 'general', 'DS-GEN-17', 'PROVISIONED', 'granary or hospital (institutions)'),
  // ── MONEY FOR DEFENCE ──
  row('money', L, 'defense', 'DS-DEF-2', 'Economic Survival: WEAK', 'defence economic score band'),
  row('money', L, 'defense', 'DS-DEF-2', 'Economic Survival: CRITICAL', 'defence economic score band'),
  row('money', L, 'defense', 'DS-DEF-6', 'Economic Backing: Underfunded', 'defence economic backing'),
  row('money', L, 'defense', 'DS-DEF-6', 'Economic Backing: Critical', 'defence economic backing'),
  row('money', L, 'general', 'DS-GEN-3', 'scores.economic: WEAK', 'defence economic score band'),
  row('money', L, 'general', 'DS-GEN-3', 'scores.economic: CRITICAL', 'defence economic score band'),
  row('money', S, 'defense', 'DS-DEF-2', 'Economic Survival: STRONG', 'defence economic score band'),
  row('money', S, 'defense', 'DS-DEF-2', 'Economic Survival: ADEQUATE', 'defence economic score band'),
  row('money', S, 'defense', 'DS-DEF-6', 'Economic Backing: Well-funded', 'defence economic backing'),
  row('money', S, 'defense', 'DS-DEF-6', 'Economic Backing: Adequate', 'defence economic backing'),
  row('money', S, 'general', 'DS-GEN-3', 'scores.economic: STRONG', 'defence economic score band'),
  row('money', S, 'general', 'DS-GEN-3', 'scores.economic: ADEQUATE', 'defence economic score band'),
  row('money', S, 'general', 'DS-GEN-17', 'GARRISONED', 'paid hands: garrison, watch, company, navy'),
  // ── ORDER ──
  row('order', L, 'defense', 'DS-DEF-2', 'Internal Security: no legal infrastructure', 'no court, no prison (live)'),
  row('order', L, 'defense', 'DS-DEF-3', 'Unsafe', 'safety label'),
  row('order', L, 'defense', 'DS-DEF-3', 'Dangerous', 'safety label'),
  row('order', L, 'defense', 'DS-DEF-3', 'COMPOUND: insurgency', 'safety label rewritten by insurgency'),
  row('order', L, 'defense', 'DS-DEF-3', 'COMPOUND: slave revolt', 'safety label rewritten by revolt'),
  row('order', L, 'defense', 'DS-DEF-3', 'COMPOUND: criminal governance', 'safety label rewritten by crime rule'),
  row('order', L, 'defense', 'DS-DEF-6', 'Legal Infrastructure: None', 'no court, no prison'),
  row('order', L, 'defense', 'DS-DEF-8', 'override: INSURGENCY ACTIVE', 'insurgency stress posture'),
  row('order', L, 'defense', 'DS-DEF-8', 'override: REVOLT ACTIVE', 'revolt stress posture'),
  row('order', L, 'general', 'DS-GEN-3', 'scores.internal: WEAK', 'internal security score band'),
  row('order', L, 'general', 'DS-GEN-3', 'scores.internal: CRITICAL', 'internal security score band'),
  row('order', L, 'general', 'DS-GEN-3', 'safetyProfile.safetyLabel: head word in {Tense, Strained, Restricted, Unsafe}', 'safety label'),
  row('order', L, 'general', 'DS-GEN-3', 'safetyProfile.safetyLabel: head word in {Dangerous, Desperate}', 'safety label'),
  row('order', L, 'power', 'DS-POW-1', 'breakdown dominated by SAFETY, adverse', 'legitimacy breakdown, safety adverse'),
  row('order', L, 'power', 'DS-POW-6', 'capture pressure ADVANCING (weak security, poor prosperity)', 'breakdown safety < 0'),
  row('order', L, 'stressors', 'DS-STR-1', 'INSURGENCY', 'insurgency stress banner'),
  row('order', L, 'stressors', 'DS-STR-1', 'SLAVE REVOLT', 'revolt stress banner'),
  row('order', L, 'stressors', 'DS-CND-1', 'DIRECTION: worsening · CRISIS: insurgency', 'insurgency condition'),
  row('order', L, 'stressors', 'DS-CND-1', 'DIRECTION: stable · CRISIS: insurgency', 'insurgency condition'),
  row('order', L, 'stressors', 'DS-CND-1', 'DIRECTION: easing · CRISIS: insurgency', 'insurgency condition'),
  row('order', L, 'stressors', 'DS-CND-1', 'DIRECTION: worsening · CRISIS: slave_revolt', 'revolt condition'),
  row('order', L, 'stressors', 'DS-CND-1', 'DIRECTION: stable · CRISIS: slave_revolt', 'revolt condition'),
  row('order', L, 'stressors', 'DS-CND-1', 'DIRECTION: easing · CRISIS: slave_revolt', 'revolt condition'),
  row('order', S, 'defense', 'DS-DEF-2', 'Internal Security: full legal chain (court AND prison)', 'court and prison (live)'),
  row('order', S, 'defense', 'DS-DEF-3', 'Very Safe', 'safety label'),
  row('order', S, 'defense', 'DS-DEF-3', 'Safe', 'safety label'),
  row('order', S, 'defense', 'DS-DEF-6', 'Legal Infrastructure: Court + Prison', 'court and prison'),
  row('order', S, 'general', 'DS-GEN-3', 'scores.internal: STRONG', 'internal security score band'),
  row('order', S, 'general', 'DS-GEN-3', 'scores.internal: ADEQUATE', 'internal security score band'),
  row('order', S, 'general', 'DS-GEN-3', 'safetyProfile.safetyLabel: head word in {Secure, Controlled, Quarantined}', 'safety label'),
  row('order', S, 'general', 'DS-GEN-17', 'ADMINISTERED', 'court and prison flags'),
  row('order', S, 'power', 'DS-POW-6', 'capture pressure RECOVERING (strong security, prosperity)', 'breakdown safety > 0'),
  // ── WALLS ──
  row('walls', L, 'defense', 'DS-DEF-2', 'Beasts & Monsters: plagued, NO perimeter and NO force', 'no walls (perimeter)'),
  row('walls', L, 'defense', 'DS-DEF-2', 'Beasts & Monsters: frontier, force without a perimeter', 'no walls (perimeter)'),
  row('walls', L, 'defense', 'DS-DEF-2', 'Beasts & Monsters: settled, nothing organized', 'no walls, no force'),
  row('walls', L, 'defense', 'DS-DEF-2', 'Invasion & War: force with NO walls', 'no walls'),
  row('walls', L, 'defense', 'DS-DEF-2', 'Invasion & War: militia only', 'no walls'),
  row('walls', L, 'defense', 'DS-DEF-2', 'Invasion & War: neither walls nor force', 'no walls'),
  row('walls', L, 'defense', 'DS-DEF-5', 'walls ABSENT', 'standing forces: walls absent'),
  row('walls', L, 'defense', 'DS-DEF-11', 'UNWALLED-SMALL', 'standing forces: walls absent'),
  row('walls', L, 'defense', 'DS-DEF-11', 'UNWALLED-LARGE', 'standing forces: walls absent'),
  row('walls', S, 'defense', 'DS-DEF-2', 'Beasts & Monsters: plagued, perimeter AND organized force', 'walls (perimeter)'),
  row('walls', S, 'defense', 'DS-DEF-2', 'Beasts & Monsters: plagued, perimeter but NO force to hold it', 'walls (perimeter)'),
  row('walls', S, 'defense', 'DS-DEF-2', 'Beasts & Monsters: frontier, credible deterrence', 'walls (perimeter) and force'),
  row('walls', S, 'defense', 'DS-DEF-2', 'Beasts & Monsters: settled, defenses beyond the need', 'walls (perimeter)'),
  row('walls', S, 'defense', 'DS-DEF-2', 'Invasion & War: walls AND professional garrison', 'walls'),
  row('walls', S, 'defense', 'DS-DEF-2', 'Invasion & War: walls with citizen militia', 'walls'),
  row('walls', S, 'defense', 'DS-DEF-2', 'Invasion & War: walls with NO force', 'walls'),
  row('walls', S, 'defense', 'DS-DEF-5', 'walls PRESENT', 'standing forces: walls present'),
  row('walls', S, 'defense', 'DS-DEF-5', 'FIXTURE: gates', 'gates on walls'),
  row('walls', S, 'defense', 'DS-DEF-11', 'WALLED-THREATENED', 'standing forces: walls present'),
  row('walls', S, 'defense', 'DS-DEF-11', 'WALLED-QUIET', 'standing forces: walls present'),
  row('walls', S, 'defense', 'DS-DEF-11', 'WALLED-STRAINED', 'standing forces: walls present'),
  // ── TRADE ──
  row('trade', L, 'defense', 'DS-DEF-6', 'Naval Defense: Under blockade', 'port blockaded'),
  row('trade', L, 'economy', 'DS-ECO-1', 'COMBINATION C2: a high rung on a narrow approach (isolated / mountain_pass)', 'trade access narrow'),
  row('trade', L, 'economy', 'DS-ECO-1', 'COMBINATION C5: a low rung on a narrow approach', 'trade access narrow'),
  row('trade', L, 'economy', 'DS-ECO-3', 'SHORTAGE × trade-dependent', 'trade flow drift shortage'),
  row('trade', L, 'economy', 'DS-ECO-3', 'SHORTAGE × not trade-dependent', 'trade flow drift shortage'),
  row('trade', L, 'economy', 'DS-ECO-5', 'IMPAIRED (canonical scarce), with a named dependency', 'supply chain scarce'),
  row('trade', L, 'economy', 'DS-ECO-5', 'VULNERABLE (canonical strained)', 'supply chain strained'),
  row('trade', L, 'economy', 'DS-SUP-1', 'BLOCKED: nothing can be got away', 'chain output blocked'),
  row('trade', L, 'economy', 'DS-SUP-2', 'SCARCE', 'chain status'),
  row('trade', L, 'economy', 'DS-SUP-2', 'BLOCKED', 'chain status'),
  row('trade', L, 'economy', 'DS-SUP-2', 'COLLAPSING', 'chain status'),
  row('trade', L, 'economy', 'DS-SUP-2', "UPSTREAM WEAK: a chain the town's work draws on is failing", 'upstream chain failing'),
  row('trade', L, 'economy', 'DS-ECO-10', 'POSTURE: none', 'export posture'),
  row('trade', L, 'economy', 'DS-ECO-10', 'POSTURE: limited', 'export posture'),
  row('trade', L, 'economy', 'DS-ECO-10', 'POSTURE: vulnerable', 'export posture'),
  row('trade', L, 'economy', 'DS-ECO-10', 'SCARCITY: shortage', 'trade scarcity'),
  row('trade', L, 'economy', 'DS-ECO-12', 'TRADE PROFILE: no significant exports', 'no exports, no imports'),
  row('trade', L, 'economy', 'DS-ECO-12', 'TRADE PROFILE: imports only, nothing outward', 'no exports'),
  row('trade', L, 'general', 'DS-GEN-7', 'stress_economic: siege against trade income', 'siege against trade'),
  row('trade', L, 'general', 'DS-GEN-13', 'NO-MARKET', 'no live market'),
  row('trade', L, 'general', 'DS-GEN-13', 'MARKET-NARROW', 'market on a narrow approach'),
  row('trade', S, 'economy', 'DS-ECO-1', 'COMBINATION C1: a high rung on a working approach', 'trade access working'),
  row('trade', S, 'economy', 'DS-ECO-1', 'COMBINATION C4: a low rung on a working approach', 'trade access working'),
  row('trade', S, 'economy', 'DS-ECO-3', 'SURPLUS × trade-dependent', 'trade flow drift surplus'),
  row('trade', S, 'economy', 'DS-ECO-3', 'SURPLUS × not trade-dependent', 'trade flow drift surplus'),
  row('trade', S, 'economy', 'DS-ECO-3', 'ADEQUATE', 'trade flow drift adequate'),
  row('trade', S, 'economy', 'DS-ECO-5', 'RUNNING (canonical stable): draw only with the note fields empty (R-DST-F)', 'supply chain stable'),
  row('trade', S, 'economy', 'DS-ECO-5', 'ENTREPÔT', 'entrepot'),
  row('trade', S, 'economy', 'DS-SUP-1', 'COMPLETE LINE, output exported', 'chain output exported'),
  row('trade', S, 'economy', 'DS-SUP-2', 'STABLE', 'chain status'),
  row('trade', S, 'economy', 'DS-ECO-10', 'POSTURE: established', 'export posture'),
  row('trade', S, 'economy', 'DS-ECO-10', 'POSTURE: entrepot', 'export posture'),
  row('trade', S, 'economy', 'DS-ECO-10', 'SCARCITY: surplus', 'trade scarcity'),
  row('trade', S, 'economy', 'DS-ECO-10', 'SCARCITY: adequate', 'trade scarcity'),
  row('trade', S, 'economy', 'DS-ECO-12', 'TRADE PROFILE: exports and imports both present', 'exports and imports'),
  row('trade', S, 'economy', 'DS-ECO-12', 'TRADE PROFILE: isEntrepot, transit goods marked among the exports', 'entrepot transit'),
  row('trade', S, 'general', 'DS-GEN-13', 'MARKET-OPEN', 'live market, open approach'),
  row('trade', S, 'general', 'DS-GEN-13', 'ENTREPOT', 'live market, entrepot'),
]);
// THE CONTROL (amendment 1): taken BY VARIANT, the tooth's way (OPPOSITE_PAIRS, PINNED_OLD_WORDS at 0, printed below). The two
// cured cell pairs are also ordinary rows of the pair table, read by variant; their cell totals are printed here too.
const CONTROLS = Object.freeze([
  ['DS-DEF-2', 'CHAIN: food trades failing', 'DS-ECO-9', 'SECURE'],
  ['DS-DEF-2', 'Economic Survival: WEAK', 'DS-GEN-17', 'GARRISONED'],
]);

const HELPER = new Set(['defense', 'economy', 'general']);
const cellId = (c) => `${c.position}::${c.pool}`;
for (const c of CELLS) if (!Array.isArray(LEAF[c.desk]?.[c.position]?.pools?.[c.pool])) throw new Error(`no pool ${c.desk} ${cellId(c)}`);
if (new Set(CELLS.map(cellId)).size !== CELLS.length) throw new Error('a cell is classified twice');
const BY_ID = new Map(CELLS.map((c) => [cellId(c), c]));
const SIDES = new Map(); // `${cellId}::${vid}` -> one-vid side (held, so the helper's WeakMap cache holds)
const sideOf = (c, vid) => { const k = `${cellId(c)}::${vid}`; if (!SIDES.has(k)) SIDES.set(k, Object.freeze({ desk: c.desk, position: c.position, pool: c.pool, vids: Object.freeze([vid]) })); return SIDES.get(k); };
// The printed sentence itself: the shortest run of one to three whole sentences of a mount's text that the side matches
// (a template opening on a slot would otherwise match from the paragraph's first word).
const found = (res, texts) => {
  for (const t of texts) {
    if (!res.some((re) => re.test(t))) continue;
    const ss = t.split(/(?<=[.!?])\s+/);
    for (let w = 1; w <= 3; w++) for (let k = 0; k + w <= ss.length; k++) { const run = ss.slice(k, k + w).join(' '); if (res.some((re) => re.test(run))) return run; }
    for (const re of res) { const m = re.exec(t); if (m) return m[0]; }
  }
  return null;
};

const N = Number(process.argv[2] || 150);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const pages = new Map(CELLS.map((c) => [cellId(c), new Map()])); // cell -> seed -> sentence
const sizeOf = {};
const diag = { drawn: 0, printed: 0, matchNotDrawn: 0, matchNotDrawnEx: [] };
const tooth = { pairs: {}, old: 0 };
for (const settType of SIZES) {
  for (let i = 0; i < N; i++) {
    const seed = `dz-${settType}-${i}`;
    sizeOf[seed] = settType;
    const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
    const { result: pp, ledger } = withPresumptionLedger(() => buildPrintProse(s, {}));
    const texts = H.pageTextsOf(pp);
    const drawn = new Map();
    for (const e of ledger) if (BY_ID.has(e.pool) && typeof e.lineId === 'number') (drawn.get(e.pool) || drawn.set(e.pool, new Set()).get(e.pool)).add(e.lineId);
    for (const c of CELLS) {
      const id = cellId(c);
      const vids = drawn.get(id) || new Set();
      const said = new Map(); // vid -> the printed sentence (or, off the helper's leaves, the mount's paragraph)
      for (const vid of vids) {
        diag.drawn++;
        let t = null;
        if (HELPER.has(c.desk)) t = found(H.matchersOf(sideOf(c, vid)), texts);
        else { const m = sentenceMountForBlock(c.position); const p = m && pp[m.tab]?.[m.mount]; if (p) t = String(p); }
        if (t) said.set(vid, t.replaceAll(s.name, '{settlement}'));
      }
      if (said.size) { diag.printed++; pages.get(id).set(seed, said); }
      if (HELPER.has(c.desk)) for (const v of LEAF[c.desk][c.position].pools[c.pool]) {
        if (typeof v.vid !== 'number' || vids.has(v.vid)) continue;
        if (H.sidePrinted(H.matchersOf(sideOf(c, v.vid)), texts)) { diag.matchNotDrawn++; if (diag.matchNotDrawnEx.length < 6) diag.matchNotDrawnEx.push(`${seed} ${id} v${v.vid}`); }
      }
    }
    for (const id of H.oppositePairsOnPage(texts)) (tooth.pairs[id] ||= []).push(seed);
    for (const pin of H.PINNED_OLD_WORDS || []) if (H.sidePrinted(H.oldWordsMatchersOf(pin), texts)) tooth.old++;
  }
}

const count = (seeds) => { const by = Object.fromEntries(SIZES.map((z) => [z, 0])); for (const sd of seeds) by[sizeOf[sd]]++; return by; };
const pairOf = (a, b) => { const A = pages.get(cellId(a)), B = pages.get(cellId(b)); const both = [...A.keys()].filter((sd) => B.has(sd)); return { a, b, both, A, B }; };
const out = [];
for (const fam of ['food', 'money', 'order', 'walls', 'trade']) {
  const lack = CELLS.filter((c) => c.family === fam && c.polarity === L);
  const suff = CELLS.filter((c) => c.family === fam && c.polarity === S);
  for (const a of lack) for (const b of suff) {
    if (a.desk === b.desk && a.position === b.position) continue;
    const p = pairOf(a, b);
    if (p.both.length) out.push({ fam, ...p });
  }
}
out.sort((x, y) => y.both.length - x.both.length);
console.log(`CELLS classified: ${CELLS.length}`);
for (const fam of ['food', 'money', 'order', 'walls', 'trade']) console.log(`  ${fam}: LACK ${CELLS.filter((c) => c.family === fam && c.polarity === L).length}, SUFFICIENCY ${CELLS.filter((c) => c.family === fam && c.polarity === S).length}`);
console.log('CELLS THAT PRINT (pages):', CELLS.filter((c) => pages.get(cellId(c)).size).map((c) => `${c.family} ${c.polarity[0]} ${cellId(c)} ${pages.get(cellId(c)).size}`).join(' | '));
console.log(`\nPAIRS WITH >= 1 PAGE: ${out.length}`);
for (const p of out) {
  const by = count(p.both); const sd = p.both[0];
  console.log(`PAIR ${p.fam} | L ${p.a.desk} ${cellId(p.a)} | S ${p.b.desk} ${cellId(p.b)} | ${SIZES.map((z) => by[z]).join('/')} = ${p.both.length} | ${sd}`);
  // THE VARIANT PAIRS (amendment 1): LACK vid x SUFFICIENCY vid co-printing on a page, worst first, with the cumulative share
  // of the cell pair's pages and one page's two sentences (the leaf's text too, for a desk the helper cannot match).
  const vp = new Map();
  for (const sd2 of p.both) for (const va of p.A.get(sd2).keys()) for (const vb of p.B.get(sd2).keys()) { const k = `${va}x${vb}`; if (!vp.has(k)) vp.set(k, { va, vb, seeds: [] }); vp.get(k).seeds.push(sd2); }
  const ranked = [...vp.values()].sort((x, y) => y.seeds.length - x.seeds.length);
  const covered = new Set();
  for (const [n, v] of ranked.entries()) {
    v.seeds.forEach((x) => covered.add(x));
    const leaf = (c, vid) => LEAF[c.desk][c.position].pools[c.pool].find((x) => x.vid === vid)?.text;
    console.log(`   VP v${v.va} x v${v.vb}: ${v.seeds.length} pages, cum ${(100 * covered.size / p.both.length).toFixed(0)}% | ${v.seeds[0]}`);
    if (n < 10) {
      console.log(`      A: ${String(p.A.get(v.seeds[0]).get(v.va)).slice(0, 300)}${HELPER.has(p.a.desk) ? '' : ` || LEAF: ${leaf(p.a, v.va)}`}`);
      console.log(`      B: ${String(p.B.get(v.seeds[0]).get(v.vb)).slice(0, 300)}${HELPER.has(p.b.desk) ? '' : ` || LEAF: ${leaf(p.b, v.vb)}`}`);
    }
  }
}
console.log('\nCONTROL (cells):');
for (const [pa, ka, pb, kb] of CONTROLS) { const p = pairOf(BY_ID.get(`${pa}::${ka}`), BY_ID.get(`${pb}::${kb}`)); const by = count(p.both); console.log(`  ${pa} [${ka}] x ${pb} [${kb}]: ${SIZES.map((z) => by[z]).join('/')} = ${p.both.length} ${p.both.slice(0, 4).join(' ')}`); }
console.log(`CONTROL (the tooth's rows): OPPOSITE_PAIRS ${JSON.stringify(Object.fromEntries(Object.entries(tooth.pairs).map(([k, v]) => [k, v.length])))} (none = 0), PINNED_OLD_WORDS pages ${tooth.old}`);
console.log(`DIAG: drawn cell-vids ${diag.drawn}, cell-pages printed ${diag.printed}, matched but not drawn ${diag.matchNotDrawn} ${diag.matchNotDrawnEx.join(' ')}`);
console.log(`RUN ${((Date.now() - t0) / 1000).toFixed(1)}s, ${N * SIZES.length} births`);
