// COHERENCE-UPKEEP-5, stage one: readiness as a list of parts. MEASURES ONLY; builds nothing in.
//
//   const P = await loadParts(<tree root>);
//   P.today(settlement, keep)            -> today's five scores and readiness, recomputed term by term
//                                           (the receipt that every term is classed: it must equal
//                                           defenseProfile on every birth)
//   P.itemise(settlement, keep, variant) -> { parts, crises, total, band } for variant 'V1' | 'V2'
//
// `keep` is `keepOf(label)` from the tree; `itemise` is handed the label BEFORE any crisis (the owner:
// a crisis acts once, on the parts it touches; never through a label it capped) and the stores'
// months at that label's share.

export async function loadParts(root) {
  const imp = (p) => import(`${root}/${p}`);
  const { getInstFlags, getPriorities } = await imp('src/generators/helpers.js');
  const { computeEffectiveMagicPresence } = await imp('src/generators/priorityHelpers.js');
  const { nativeSemanticName } = await imp('src/domain/content/customContentSemanticAuthority.js');
  const { hasTradeRouteConnection } = await imp('src/domain/tradeRouteSemantics.js');
  const { resolveGenerationWorldLaw } = await imp('src/generators/generationContext.js');
  const { readinessBandOf } = await imp('src/data/bandLadders.js');
  const { fundedGate } = await imp('src/domain/facts/keep.js');

  const TIER_BONUS = { thorp: 12, hamlet: 8, village: 4, town: 2 };
  const THREAT_PEN = { plagued: 15, frontier: 7 };
  const TERRAIN = { mountain: 1.28, hills: 1.18, forest: 1.12, riverside: 1.06, coastal: 1.02 };

  /** Everything both readings share: the flags, the dials, the traditions, the chains. */
  function inputs(s) {
    const config = s.config || {};
    const institutions = s.institutions || [];
    const stressTypes = s.stress
      ? (Array.isArray(s.stress) ? s.stress : [s.stress]).map((x) => x?.type).filter(Boolean)
      : (config.stressTypes || config.intendedStressTypes || []);
    const fl = getInstFlags(config, institutions);
    const inst = fl.inst;
    const milPri = getPriorities(config).military ?? 50;
    const nType = String(config.neighborRelationship?.relationshipType || '').toLowerCase();
    const nbr = (nType.includes('hostile') || nType.includes('rival')) ? 1.2 : nType.includes('cold_war') ? 1.18 : nType.includes('tense') ? 1.1 : nType.includes('allied') ? 0.92 : nType.includes('trade_partner') ? 0.96 : 1;
    const milEff = Math.round(fl.militaryEffective), crimEff = Math.round(fl.criminalEffective);
    const econOut = Math.round(fl.economyOutput), magInf = Math.round(fl.magicInfluence);
    const tier = s.tier || 'town';
    const threat = config.monsterThreat || 'frontier';
    const route = config.tradeRouteAccess || 'road';
    const worldLaw = resolveGenerationWorldLaw(null, config);
    const magicOn = worldLaw.magicEnabled;
    const magPri = magicOn ? (config.priorityMagic ?? 50) : 0;
    const relPri = config.priorityReligion ?? 50;
    const hasInst = (...kws) => institutions.some((i) => kws.some((kw) => nativeSemanticName(i).toLowerCase().includes(kw)));
    const t = {
      hasArcane: magicOn && magPri >= 35 && (inst.hasMagicInst || hasInst('wizard', 'mages', 'arcane', 'enchant', 'spellcasting', 'academy of magic', 'mages\' district')),
      hasArcaneGuild: magicOn && magPri >= 55 && hasInst('mages\' guild', 'wizard\'s tower', 'arcane academy', 'mages\' district', 'academy of magic'),
      hasDivine: magicOn && relPri >= 55 && (hasInst('cathedral', 'monastery', 'great cathedral', 'parish church') || (relPri >= 65 && hasInst('shrine', 'temple', 'friary'))),
      hasDivineStrong: magicOn && relPri >= 65 && hasInst('cathedral', 'monastery', 'great cathedral'),
      hasDruid: magicOn && magPri >= 30 && hasInst('druid circle', 'grove shrine', 'elder grove', 'sacred grove'),
      hasWardens: hasInst('warden\'s lodge'),
      hasAlchemy: magicOn && magPri >= 15 && hasInst('alchemist', 'apothecary district', 'alchemist quarter'),
      hasTower: hasInst('wizard\'s tower'),
      hasTeleport: hasInst('teleportation', 'teleport'),
    };
    const isSmall = ['thorp', 'hamlet', 'village'].includes(tier);
    const community = { isolation: 0, arms: 0, churchMil: 0, churchInt: 0, elderMil: 0, elderInt: 0, close: 0, noDen: 0 };
    if (isSmall) {
      community.isolation = route === 'isolated' ? 8 : route === 'road' ? 4 : 2;
      community.arms = tier === 'thorp' ? 6 : tier === 'hamlet' ? 8 : 10;
      community.close = tier === 'thorp' ? 18 : tier === 'hamlet' ? 14 : 10;
      if (inst.hasChurch) { community.churchInt = 8; community.churchMil = 3; }
      if (hasInst('reeve', 'steward', 'elder', 'household council', 'free elder')) { community.elderInt = 6; community.elderMil = 3; }
      if (!hasInst('fence', 'smuggl', 'gang', 'outlaw')) community.noDen = 6;
    }
    const comMil = community.isolation + community.arms + community.churchMil + community.elderMil;
    const comInt = community.close + community.churchInt + community.elderInt + community.noDen;
    // magic presence (the magical dimension's base), as the generator reads it
    const smallTier = isSmall;
    const hasActualMagic = inst.hasMagicInst || t.hasDruid || t.hasArcane
      || hasInst('healer', 'monastery', 'cathedral', 'divine', 'healing', 'druid', 'wizard', 'mage', 'arcane', 'enchant');
    let presence = null;
    if (magicOn && !(smallTier && !hasActualMagic)) {
      presence = computeEffectiveMagicPresence(institutions, { ...config, nearbyResources: config.nearbyResources || [] }).score;
    }
    // chains
    const chainById = Object.fromEntries((s.economicState?.activeChains || []).map((c) => [c.chainId, c]));
    const canProvision = hasTradeRouteConnection(config.tradeRouteAccess || s.tradeRoute || 'road');
    const healthy = (c) => !!c && (c.status === 'operational' || c.status === 'running'
      || (c.status === 'vulnerable' && !c.dependency && !c.substituteActive && canProvision
        && ((c.upstreamMissing && c.upstreamMissing.length) || (c.upstreamWeak && c.upstreamWeak.length))));
    const g = chainById.garrison, f = chainById.fortification, m = chainById.mercenary, fp = chainById.food_processing;
    const chains = {
      garrison: g ? (healthy(g) ? 5 : (g.status === 'vulnerable' || g.status === 'impaired') ? -5 : 0) : 0,
      fortification: f ? (healthy(f) ? 6 : f.status === 'impaired' ? -4 : 0) : 0,
      mercenaryHealthy: healthy(m),
      food: fp ? (fp.status === 'impaired' ? -8 : 5) : 0,
    };
    const fs = s.economicState?.foodSecurity;
    return { config, institutions, stressTypes, inst, milPri, nbr, milEff, crimEff, econOut, magInf, tier, threat, route, worldLaw, magicOn, magPri, relPri, t, isSmall, community, comMil, comInt, presence, chains, fs, terrain: TERRAIN[config.terrainType || 'plains'] || 1, magicExists: config.magicExists !== false };
  }

  const storageScoreOf = (mo) => Math.min(70, Math.round(mo <= 1 ? mo * 10 : mo <= 6 ? 10 + (mo - 1) * 7 : 45 + (mo - 6) * 4));

  /** The crises, as today's code writes them: per crisis, the points it takes from each dimension. */
  function crisisPoints(x) {
    const { t, magPri } = x; const has = (k) => x.stressTypes.includes(k);
    const out = [];
    if (has('under_siege')) {
      let e = 25, i = 15;
      if (t.hasArcane && magPri >= 65 && t.hasTeleport) e = Math.round(e * 0.4);
      else if (t.hasArcaneGuild && magPri >= 50) i = Math.round(i * 0.53);
      if (t.hasDivineStrong) i = Math.round(i * 0.53);
      if (t.hasDruid && magPri >= 40) e = Math.round(e * 0.72);
      out.push(['under_siege', { eco: e, int: i }]);
    }
    if (has('famine')) {
      let e = 20, m = 10, i = 20, mo = 8;
      if (t.hasDruid && magPri >= 30) { e = Math.round(e * 0.4); m = Math.round(m * 0.5); mo = Math.round(mo * 0.5); }
      if (t.hasDivine) { e = Math.min(e, 12); m = Math.min(m, 6); }
      if (t.hasArcane && magPri >= 50) e = Math.min(e, 15);
      if (t.hasAlchemy) e = Math.max(0, e - 3);
      out.push(['famine', { eco: e, mil: m, int: i, mon: mo }]);
    }
    if (has('occupied')) out.push(['occupied', { mil: 35, int: 20 }]);
    if (has('plague_onset')) {
      let m = 15, e = 15;
      if (t.hasDivine) { m = Math.round(m * 0.33); e = Math.round(e * 0.53); }
      if (t.hasAlchemy) { m = Math.min(m, 8); e = Math.min(e, 10); }
      if (t.hasArcane && magPri >= 50) m = Math.min(m, 10);
      out.push(['plague_onset', { mil: m, eco: e }]);
    }
    if (has('succession_void')) out.push(['succession_void', { mil: 15, int: 20 }]);
    if (has('politically_fractured')) out.push(['politically_fractured', { int: 20 }]);
    if (has('recently_betrayed')) out.push(['recently_betrayed', { int: 10, mil: 10 }]);
    if (has('indebted')) out.push(['indebted', { eco: 15, mil: 10 }]);
    if (has('infiltrated')) out.push(['infiltrated', { int: 15, mil: 8 }]);
    if (has('monster_pressure')) {
      let mo = 20;
      if (t.hasArcane && magPri >= 40) mo = Math.round(mo * 0.25);
      if (t.hasDivine) mo = Math.round(mo * 0.4);
      if (t.hasDruid) mo = Math.round(mo * 0.5);
      out.push(['monster_pressure', { mon: mo, mil: 5 }]);
    }
    return out;
  }

  /** TODAY, term by term in the generator's own order (the classification's receipt). */
  function today(s, keep) {
    const x = inputs(s); const { inst, t, magPri, relPri, community } = x;
    const SF = 0.35, SN = 0.06;
    const standing = (fl, watchInStead = false) => {
      let m = x.comMil;
      if (fl.hasWalls) m += 30; if (fl.hasGarrison) m += 28; if (fl.hasMilitia) m += 10; if (fl.hasWatch || watchInStead) m += 7;
      if (t.hasArcane) { m += Math.round(10 + Math.min(15, (magPri - 35) * 0.25)); if (t.hasTower) m += 5; if (t.hasArcaneGuild) m += 8; }
      if (t.hasDivineStrong && relPri >= 70) m += 6;
      const bos = fl.hasWalls || fl.hasGarrison || fl.hasMilitia || fl.hasWatch || watchInStead;
      const hired = fl.hasMercenary || fl.hasCharterHall;
      const rate = bos ? SF : hired ? SN + (SF - SN) * keep.bought : SN;
      m = Math.min(100, m + Math.round(x.milEff * rate));
      m = Math.min(100, Math.round(m * x.terrain));
      const g = fundedGate(0.6, keep);
      if ((bos || hired) && g < 1) m = Math.round(x.comMil + Math.max(0, m - x.comMil) * g);
      return m;
    };
    const hiredMil = Math.round(((inst.hasMercenary ? 14 : 0) + (inst.hasCharterHall ? 10 : 0)) * keep.bought);
    let mil = Math.min(100, standing(inst) + hiredMil);
    const hasStanding = inst.hasGarrison || inst.hasMilitia || inst.hasWatch;
    if ((inst.hasMercenary || inst.hasCharterHall) && !hasStanding) mil = Math.min(mil, standing(inst, true));
    let mon = x.threat === 'plagued' ? 8 : x.threat === 'frontier' ? 4 : 0; const monBase = mon;
    if (inst.hasGarrison) mon += 20; if (inst.hasWalls) mon += 20; if (inst.hasMilitia) mon += 12; if (inst.hasHospital) mon += 5; if (t.hasWardens) mon += 12;
    let mb = 0;
    if (t.hasArcane) mb += Math.round(15 + Math.min(10, (magPri - 35) * 0.2)); if (t.hasDivine) mb += 18; if (t.hasDruid) mb += 12;
    mon = Math.min(100, mon + Math.min(35, mb));
    const unpaid = monBase + Math.min(Math.min(35, mb), (t.hasDivine ? 18 : 0) + (t.hasDruid ? 12 : 0));
    const mg = fundedGate(0.7, keep);
    if (mg < 1) mon = Math.round(unpaid + Math.max(0, mon - unpaid) * mg);
    if (inst.hasCharterHall) mon = Math.min(100, mon + Math.round(35 * keep.bought));
    if (x.threat === 'plagued') mon = Math.max(0, mon - 15);
    let int = x.comInt;
    if (inst.hasCourtSystem) int += 20; if (inst.hasPrison) int += 15; if (inst.hasGarrison) int += 15; if (inst.hasWatch) int += 18; if (inst.hasMilitia) int += 8; if (inst.hasCharterHall) int += 5;
    if (t.hasArcane && magPri >= 50) int += Math.min(8, Math.round((magPri - 50) * 0.16));
    if (t.hasDivine && relPri >= 60) int += Math.min(10, Math.round((relPri - 60) * 0.25));
    const law = inst.hasCourtSystem || inst.hasPrison || inst.hasGarrison || inst.hasWatch;
    int = Math.min(100, int + Math.round(x.milEff * (law ? 0.25 : 0.04)));
    const ig = fundedGate(0.65, keep);
    if (law && ig < 1) int = Math.round(x.comInt + Math.max(0, int - x.comInt) * ig);
    int = Math.max(0, int - Math.round(x.crimEff * 0.4));
    const months = x.fs?.storageMonths ?? (inst.hasGranary ? 4 : 1);
    let eco = storageScoreOf(months);
    if (inst.hasMarket) eco += 10; if (inst.hasHospital) eco += 10;
    if (x.route === 'port' && x.worldLaw.supportsMaritime()) eco += 10; if (x.route === 'crossroads') eco += 8;
    eco = Math.min(100, eco + Math.round(x.econOut * 0.2));
    if (t.hasAlchemy && inst.hasGranary) eco += 8; eco = Math.min(100, eco);
    eco = Math.round(eco * fundedGate(0.45, keep));
    let mag;
    if (x.presence === null) mag = 0;
    else {
      mag = x.presence;
      if (t.hasDivine) mag = Math.min(100, mag + Math.round(relPri * 0.12));
      if (t.hasDruid) mag = Math.min(100, mag + 6);
      if (t.hasArcaneGuild) mag = Math.min(100, mag + 8);
      mag = magPri > 0 ? Math.round(mag * Math.min(1, Math.max(0.45, x.magInf / Math.max(1, x.presence)))) : Math.round(mag);
    }
    const D = { mil, mon, int, eco };
    for (const [, pts] of crisisPoints(x)) for (const [d, p] of Object.entries(pts)) D[d] = Math.max(0, D[d] - p);
    let chainMil = x.chains.garrison + x.chains.fortification + (x.chains.mercenaryHealthy ? Math.round(4 * keep.bought) : 0);
    D.mil = Math.min(100, Math.max(0, D.mil + chainMil));
    D.eco = Math.min(100, Math.max(0, D.eco + x.chains.food));
    const dims = x.magicExists ? [D.mil, D.mon, D.int, D.eco, mag] : [D.mil, D.mon, D.int, D.eco];
    const avg = Math.round(dims.reduce((a, b) => a + b, 0) / dims.length);
    const score = Math.min(100, Math.max(0, avg + (TIER_BONUS[x.tier] || 0) - (THREAT_PEN[x.threat] || 0)));
    return { military: D.mil, monster: D.mon, internal: D.int, economic: D.eco, magical: mag, score };
  }

  /**
   * THE ITEMISED FORM. Each part: its group (BUILT, STANDS, SUSTAINS, GROUND, AGAINST), its points
   * on each of the five dimensions, the scale prosperity sets on it ('funded' | 'bought' | 'stores' |
   * null) and the share that scale leaves. Readiness = the sum over every part of its dimension points
   * divided by the number of dimensions the world has (five, or four with no magic), plus the
   * ground's own size and threat points. No cap, floor or clamp anywhere.
   */
  function itemise(s, keep, variant, monthsPre) {
    const x = inputs(s); const { inst, t, magPri, relPri, community: c } = x;
    const parts = [];
    const add = (group, name, dims, scale = null, share = 1, note = '') => {
      const clean = Object.fromEntries(Object.entries(dims).filter(([, v]) => v));
      if (!Object.keys(clean).length) return;
      parts.push({ group, name, raw: clean, scale, share, dims: Object.fromEntries(Object.entries(clean).map(([d, v]) => [d, v * share])), note });
    };
    const F = (floor) => fundedGate(floor, keep);
    const COND = variant === 'V4C'; // V4 with R12's conditions (a probe proposal: odds and step below)
    const R13 = variant === 'V4' || COND; // V4 = V3 with the chair's R13 (the will held to the armed bodies) and R14 (the neighbour factor)
    const V3 = variant === 'V3' || R13;
    // V3 (R2): the three traditions together count at most 35 against monsters (one job, once).
    const arcMon = t.hasArcane ? Math.round(15 + Math.min(10, (magPri - 35) * 0.2)) : 0;
    const tradF = V3 ? Math.min(1, 35 / Math.max(1, arcMon + (t.hasDivine ? 18 : 0) + (t.hasDruid ? 12 : 0))) : 1; // a paid part keeps floor + (1-floor) x funded of itself
    const hasStanding = inst.hasGarrison || inst.hasMilitia || inst.hasWatch;
    const hired = inst.hasMercenary || inst.hasCharterHall;
    const law = inst.hasCourtSystem || inst.hasPrison || inst.hasGarrison || inst.hasWatch;
    // BUILT: what already stands. Prosperity does not scale it.
    if (inst.hasWalls) add('BUILT', 'Walls', { mil: 30, mon: 20 });
    if (x.chains.fortification) add('BUILT', x.chains.fortification > 0 ? 'Masons keeping the walls' : 'Walls going unmended', { mil: x.chains.fortification });
    // STANDS: who defends. Paid forces at the funded share of their own dimension floors.
    if (inst.hasGarrison) parts.push(paid('STANDS', 'Garrison', { mil: 28, mon: 20, int: 15 }));
    if (inst.hasMilitia) parts.push(paid('STANDS', 'Militia', { mil: 10, mon: 12, int: 8 }));
    if (inst.hasWatch) parts.push(paid('STANDS', 'Watch', { mil: 7, int: 18 }));
    if (inst.hasCourtSystem) parts.push(paid('STANDS', 'Court', { int: 20 }));
    if (inst.hasPrison) parts.push(paid('STANDS', 'Prison', { int: 15 }));
    if (t.hasWardens) parts.push(paid('STANDS', 'Wardens', { mon: 12 }));
    const bos = inst.hasWalls || hasStanding;
    // V3 (R9): the dial is the base configuration's own (the slider), not the effective reading, which
    // folds in the garrison's presence, crime and the crisis multipliers (each counted elsewhere).
    const dial = R13 ? x.milPri * x.nbr : V3 ? x.milPri : x.milEff;
    if (bos) {
      parts.push(paid('STANDS', 'Martial strength (the military dial)', { mil: Math.round(dial * 0.35), int: Math.round(dial * (law ? 0.25 : 0.04)) }));
    } else {
      const rate = hired ? 0.06 + 0.29 * keep.bought : 0.06;
      add('STANDS', 'Martial strength (the military dial)', { mil: Math.round(dial * rate), int: Math.round(dial * (law ? 0.25 : 0.04)) }, hired ? 'bought' : null, 1, hired ? 'rate set by what the place can pay' : '');
    }
    if (inst.hasMercenary) add('STANDS', 'Hired company', { mil: 14 + (x.chains.mercenaryHealthy ? 4 : 0) }, 'bought', keep.bought);
    if (inst.hasCharterHall) add('STANDS', 'Adventurers\' charter', { mil: 10, mon: 35, int: 5 }, 'bought', keep.bought);
    add('STANDS', 'Armed households', { mil: c.arms });
    add('STANDS', 'Parish as rallying point', { mil: c.churchMil, int: c.churchInt });
    add('STANDS', 'Elders and reeve', { mil: c.elderMil, int: c.elderInt });
    // V3 (count once): the criminal houses count once, in Crime; no separate bonus for their absence.
    add('STANDS', 'Close-knit self-policing', { int: c.close + (V3 ? 0 : c.noDen) });
    // STANDS, the practitioners: arcane force is retained (paid); divine and druid force is not.
    if (t.hasArcane) {
      parts.push(paid('STANDS', 'Arcane practitioners', {
        mil: Math.round(10 + Math.min(15, (magPri - 35) * 0.25)) + (t.hasTower ? 5 : 0) + (t.hasArcaneGuild ? 8 : 0),
        mon: arcMon * tradF,
        int: magPri >= 50 ? Math.min(8, Math.round((magPri - 50) * 0.16)) : 0,
      }));
    }
    if (t.hasDivine) add('STANDS', 'Clergy (divine)', { mil: t.hasDivineStrong && relPri >= 70 ? 6 : 0, mon: 18 * tradF, int: relPri >= 60 ? Math.min(10, Math.round((relPri - 60) * 0.25)) : 0 });
    else if (t.hasDivineStrong && relPri >= 70) add('STANDS', 'Clergy (divine)', { mil: 6 });
    if (t.hasDruid) add('STANDS', 'Druids', { mon: 12 * tradF });
    // SUSTAINS: what keeps the force going.
    const months = monthsPre ?? x.fs?.storageMonths ?? (inst.hasGranary ? 4 : 1);
    add('SUSTAINS', `Stores (${Math.round(months * 10) / 10} months)`, { eco: storageScoreOf(months) }, 'stores', 1, 'laid by at the place\'s share, at the stores\' own writer');
    if (t.hasAlchemy && inst.hasGranary) parts.push(paid('SUSTAINS', 'Alchemists preserving the grain', { eco: 8 }));
    if (inst.hasHospital) parts.push(paid('SUSTAINS', 'Healing (hospital)', { eco: 10, mon: 5 }));
    if (inst.hasMarket) parts.push(paid('SUSTAINS', 'Market', { eco: 10 }));
    if (V3) add('SUSTAINS', 'The purse', { eco: 20 }, 'bought', keep.bought, 'what the place can pay (R6)');
    else add('SUSTAINS', 'The purse (the economy dial)', { eco: Math.round(x.econOut * 0.2) });
    if (x.chains.food) add('SUSTAINS', x.chains.food > 0 ? 'Food processing working' : 'Food processing broken', { eco: x.chains.food });
    if (x.chains.garrison) add('SUSTAINS', x.chains.garrison > 0 ? 'Garrison provisioned' : 'Garrison unprovisioned', { mil: x.chains.garrison });
    if (x.presence !== null) {
      // V3 (count once): the temple, the grove and the guild stand as their own parts; the presence already counts their houses.
      const raw = x.presence + (V3 ? 0 : (t.hasDivine ? Math.round(relPri * 0.12) : 0) + (t.hasDruid ? 6 : 0) + (t.hasArcaneGuild ? 8 : 0));
      const share = V3 ? F(0.45) : magPri > 0 ? Math.min(1, Math.max(0.45, x.magInf / Math.max(1, x.presence))) : 1;
      add('SUSTAINS', 'Magic (wards, healing, countermagic)', { mag: raw }, V3 ? 'funded' : 'magic', share, V3 ? 'paid from the one label (R5)' : 'the magic\'s own health reading');
    }
    // GROUND: the place itself.
    add('GROUND', 'Remoteness (alarm and flight)', { mil: c.isolation });
    if (x.route === 'port' && x.worldLaw.supportsMaritime()) add('GROUND', 'Sea supply', { eco: 10 });
    if (x.route === 'crossroads') add('GROUND', 'Many roads in', { eco: 8 });
    const tb = x.threat === 'plagued' ? 8 : x.threat === 'frontier' ? 4 : 0;
    add('GROUND', 'Folk used to beasts', { mon: tb });
    if (x.threat === 'plagued') add('GROUND', 'Plagued country', { mon: -15 });
    // AGAINST: crime works against order.
    if (x.crimEff) add('AGAINST', 'Crime', { int: -Math.round(x.crimEff * 0.4) });
    // terrain strengthens what is built and stands (its military points)
    if (x.terrain !== 1) {
      const base = parts.filter((p) => (p.group === 'BUILT' || p.group === 'STANDS')).reduce((a, p) => a + Math.max(0, p.dims.mil || 0), 0);
      add('GROUND', `Terrain (${x.config.terrainType})`, { mil: base * (x.terrain - 1) }, null, 1, `×${x.terrain} on what is built and stands`);
    }

    // V2's limit (b): walls with no one to man them count in part (half).
    const FORCE = V3 ? /^(Garrison|Militia|Watch|Hired company|Adventurers' charter|Armed households|Wardens)$/
      : /^(Garrison|Militia|Watch|Hired company|Adventurers' charter|Armed households|Arcane practitioners|Clergy \(divine\)|Druids|Wardens)$/;
    const manned = parts.some((p) => p.group === 'STANDS' && FORCE.test(p.name) && Object.values(p.dims).some((v) => v > 0));
    if ((variant === 'V2' || V3) && inst.hasWalls && !manned) {
      const w = parts.find((p) => p.name === 'Walls'); w.share = 0.5; w.dims = { mil: 15, mon: 10 }; w.note = 'no one stands to man them: counts half';
    }

    // R12 (PROPOSAL, measured only): a condition of each body or work, below / ordinary / above, odds 0.2 / 0.6 / 0.2,
    // a step of a tenth of the part; drawn once per house from its own key (here a hash, standing in for a
    // registered fork). Above is closed where the facts forbid it: walls unmended; a bought body the place
    // cannot pay (bought < 0.6); a paid body below full pay (funded < 0.7); any body a crisis in force takes from.
    const conditions = [];
    if (COND) {
      const BODY = /^(Walls|Garrison|Militia|Watch|Hired company|Adventurers' charter|Wardens|Armed households)$/;
      const hash = (str) => { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; return (h >>> 0) / 4294967296; };
      const inCrisis = crisisPoints(x).length > 0;
      for (const q of parts) {
        if (!BODY.test(q.name)) continue;
        const u = hash(`${s.id || s.name || ''}|${q.name}|condition`);
        let c = u < 0.2 ? -1 : u >= 0.8 ? 1 : 0;
        const closed = c === 1 && ((q.name === 'Walls' && x.chains.fortification < 0) || (q.scale === 'bought' && keep.bought < 0.6) || (q.scale === 'funded' && keep.funded < 0.7) || (q.group === 'STANDS' && inCrisis));
        if (closed) c = 0;
        if (c) { for (const d of Object.keys(q.dims)) q.dims[d] *= 1 + 0.1 * c; }
        conditions.push({ part: q.name, c, closed });
      }
    }
    // V3 (R2): a hired-only place never reads above the same place with a watch in its hired force's stead.
    let hiredCapped = 0;
    if (V3 && hired && !hasStanding) {
      const milOf = (q) => q.dims.mil || 0;
      const hiredParts = parts.filter((q) => q.name === 'Hired company' || q.name === 'Adventurers\' charter');
      const dialPart = parts.find((q) => q.name.startsWith('Martial strength'));
      const now = parts.reduce((a, q) => a + milOf(q), 0);
      const cf = now - hiredParts.reduce((a, q) => a + milOf(q), 0) - (dialPart ? milOf(dialPart) : 0) + 7 * F(0.6) + Math.round(x.milPri * 0.35) * F(0.6);
      const hm = hiredParts.reduce((a, q) => a + milOf(q), 0);
      if (now > cf && hm > 0) { const cut = Math.min(hm, now - cf); hiredCapped = cut; for (const q of hiredParts) q.dims.mil = milOf(q) * (1 - cut / hm); }
    }
    // CRISES: each takes today's points from the parts it touches, pro rata, and no more than they hold.
    const TOUCH = { eco: ['SUSTAINS'], mil: ['STANDS'], int: ['STANDS'], mon: ['STANDS'] };
    const crises = [];
    for (const [name, pts] of crisisPoints(x)) {
      const took = {};
      for (const [d, p] of Object.entries(pts)) {
        // The famine already ate the stores at their own writer (what is in hand), so it does not take them twice.
        const spared = (q) => name === 'famine' && d === 'eco' && q.name.startsWith('Stores');
        const hit = parts.filter((q) => TOUCH[d].includes(q.group) && (q.dims[d] || 0) > 0 && !spared(q));
        const hold = hit.reduce((a, q) => a + q.dims[d], 0);
        const take = Math.min(p, hold);
        for (const q of hit) { const cut = take * q.dims[d] / hold; q.dims[d] -= cut; (q.crisis ||= {})[name] = ((q.crisis[name] || 0) + cut); }
        took[d] = take;
      }
      crises.push({ name, points: pts, took });
    }

    const n = x.magicExists ? 5 : 4;
    // R13: the will counts for no more than the armed bodies that carry it (after pay and crises); the 0.06 rules stay.
    let willHeld = 0;
    if (R13 && bos) {
      const ARMED = /^(Garrison|Militia|Watch|Hired company|Adventurers' charter|Armed households|Wardens)$/;
      const pts = (q) => Object.entries(q.dims).reduce((a, [d, v]) => a + (d === 'mag' && !x.magicExists ? 0 : v), 0);
      const armed = parts.filter((q) => ARMED.test(q.name)).reduce((a, q) => a + pts(q), 0);
      const will = parts.find((q) => q.name.startsWith('Martial strength'));
      if (will && pts(will) > armed) { const k = armed > 0 ? armed / pts(will) : 0; willHeld = (pts(will) - armed) / n; for (const d of Object.keys(will.dims)) will.dims[d] *= k; will.note = 'held to the armed bodies that carry it (R13)'; }
    }
    const val = (p) => Object.entries(p.dims).reduce((a, [d, v]) => a + (d === 'mag' && !x.magicExists ? 0 : v), 0) / n;
    for (const p of parts) p.points = val(p);
    const sum = (g) => parts.filter((p) => g.includes(p.group)).reduce((a, p) => a + p.points, 0);
    let sustains = sum(['SUSTAINS']);
    const force = sum(['STANDS']);
    let sustainsLimited = null;
    if (variant === 'V2' && sustains > force) { sustainsLimited = { from: sustains, to: Math.max(0, force) }; sustains = Math.max(0, force); }
    // V3: limit 1 on the parts themselves (scaled down together), then each score full at 100 (R1).
    let altScore = null;
    if (V3) {
      const dimsOf = () => { const o = {}; for (const q of parts) for (const [d, v] of Object.entries(q.dims)) if (!(d === 'mag' && !x.magicExists)) o[d] = (o[d] || 0) + v; return o; };
      const size0 = TIER_BONUS[x.tier] || 0, danger0 = THREAT_PEN[x.threat] || 0;
      // the other order, for R1's count: fullness first, then limit 1 on the group points
      { const raw = dimsOf(); const fac = Object.fromEntries(Object.entries(raw).map(([d, v]) => [d, v > 100 ? 100 / v : v < 0 ? 0 : 1]));
        const g = (grp) => parts.filter((q) => grp.includes(q.group)).reduce((a, q) => a + Object.entries(q.dims).reduce((b, [d, v]) => b + (d === 'mag' && !x.magicExists ? 0 : v * fac[d]), 0), 0) / n;
        let su = g(['SUSTAINS']); const fo = g(['STANDS']); if (su > fo) su = Math.max(0, fo);
        altScore = Math.round(Math.min(100, Math.max(0, g(['BUILT']) + fo + su + g(['GROUND', 'AGAINST']) + size0 - danger0))); }
      if (sustains > force) {
        sustainsLimited = { from: sustains, to: Math.max(0, force) };
        const k = sustains > 0 ? Math.max(0, force) / sustains : 0;
        for (const q of parts) if (q.group === 'SUSTAINS') { for (const d of Object.keys(q.dims)) q.dims[d] *= k; q.points *= k; }
        sustains = Math.max(0, force);
      }
      const dims = dimsOf();
      const full = Object.fromEntries(Object.entries(dims).map(([d, v]) => [d, Math.min(100, Math.max(0, v))]));
      const reserve = Object.fromEntries(Object.entries(dims).filter(([d, v]) => v !== full[d]).map(([d, v]) => [d, Math.round((v - full[d]) * 10) / 10]));
      const raw = Object.values(full).reduce((a, v) => a + v, 0) / n + size0 - danger0;
      const t3 = Math.min(100, Math.max(0, raw));
      const sc = Math.round(t3);
      return { parts, crises, n, size: size0, danger: danger0, sustainsLimited, hiredCapped, willHeld, conditions, dims: Object.fromEntries(Object.entries(full).map(([d, v]) => [d, Math.round(v * 10) / 10])), reserve, scaleEnd: raw > 100 ? Math.round(raw - 100) : raw < 0 ? Math.round(raw) : 0,
        groups: { BUILT: sum(['BUILT']), STANDS: force, SUSTAINS: sustains, GROUND: sum(['GROUND']), AGAINST: sum(['AGAINST']) }, total: t3, score: sc, band: readinessBandOf(sc).label, altScore, altBand: readinessBandOf(altScore).label };
    }
    const size = TIER_BONUS[x.tier] || 0, danger = THREAT_PEN[x.threat] || 0;
    const total = sum(['BUILT']) + force + sustains + sum(['GROUND', 'AGAINST']) + size - danger;
    const score = Math.round(total);
    // DIAGNOSTIC ONLY (not a variant): the same parts with today's five 0..100 ceilings kept, to show
    // how much of a move comes from removing them.
    const perDim = {};
    for (const p of parts) for (const [d, v] of Object.entries(p.dims)) perDim[d] = (perDim[d] || 0) + v;
    const ceilinged = Object.entries(perDim).reduce((a, [d, v]) => a + (d === 'mag' && !x.magicExists ? 0 : Math.min(100, Math.max(0, v))), 0) / n + size - danger;
    const overflow = Object.fromEntries(Object.entries(perDim).filter(([, v]) => v > 100).map(([d, v]) => [d, Math.round(v)]));
    return { parts, crises, n, size, danger, sustainsLimited, groups: { BUILT: sum(['BUILT']), STANDS: force, SUSTAINS: sustains, GROUND: sum(['GROUND']), AGAINST: sum(['AGAINST']) }, total, score, band: readinessBandOf(score).label, ceilinged, overflow };

    function paid(group, name, dims) {
      const FLOOR = { mil: 0.6, mon: 0.7, int: 0.65, eco: 0.45 };
      const clean = Object.fromEntries(Object.entries(dims).filter(([, v]) => v));
      return { group, name, raw: clean, scale: 'funded', share: null, dims: Object.fromEntries(Object.entries(clean).map(([d, v]) => [d, v * F(FLOOR[d])])), note: '' };
    }
  }

  return { today, itemise, inputs, readinessBandOf };
}
