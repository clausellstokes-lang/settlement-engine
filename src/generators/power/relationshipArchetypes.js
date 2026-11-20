/**
 * power/relationshipArchetypes.js — select the relationship archetype (a
 * STRESS_ECONOMIC_EFFECTS entry) between two factions from their category
 * pair, power gap, personalities and active stress flags.
 */
import { random as _rng } from '../../kernel/rngContext.js';
import { fnv1a32 } from '../../kernel/proseHash.js';
import { HANDLER_TIE_ARCHETYPES, REVERSED_TIE, STRESS_ECONOMIC_EFFECTS } from '../../data/npcData.js';
import { drawDeclared } from '../../domain/facts/drawDeclared.js';
import { notePresumption, withPresumptionLedger } from '../../domain/facts/presumptionLedger.js';

export const computeRelTension = (factionA, factionB, stressFlags, instFlags) => {
  const categoryPair = [factionA.category, factionB.category].sort().join('_'),
    powerDiff = factionA.power - factionB.power;
  if (stressFlags.merchantCriminalBlur && categoryPair.includes('economy') && categoryPair.includes('criminal'))
    return _rng() < 0.6 ? STRESS_ECONOMIC_EFFECTS.econ_crim_blur : STRESS_ECONOMIC_EFFECTS.econ_crim_exploitation;
  if (stressFlags.stateCrime && categoryPair.includes('military') && categoryPair.includes('criminal'))
    return STRESS_ECONOMIC_EFFECTS.mil_crim_corruption;
  if (!stressFlags.stateCrime && categoryPair.includes('military') && categoryPair.includes('criminal'))
    return instFlags.militaryEffective > instFlags.criminalEffective
      ? STRESS_ECONOMIC_EFFECTS.mil_crim_suppression
      : STRESS_ECONOMIC_EFFECTS.mil_crim_corruption;
  if (stressFlags.merchantArmy && categoryPair.includes('economy') && categoryPair.includes('military'))
    return STRESS_ECONOMIC_EFFECTS.econ_mil_contract;
  if (stressFlags.crusaderSynthesis && categoryPair.includes('religious') && categoryPair.includes('military'))
    return STRESS_ECONOMIC_EFFECTS.rel_mil_crusader;
  if (stressFlags.religiousFraud && categoryPair.includes('religious') && categoryPair.includes('criminal'))
    return STRESS_ECONOMIC_EFFECTS.rel_crim_fraud;
  if (stressFlags.arcaneBlackMarket && categoryPair.includes('magic') && categoryPair.includes('criminal'))
    return STRESS_ECONOMIC_EFFECTS.mag_crim_market;
  if (categoryPair.includes('government') && categoryPair.includes('economy') && instFlags.economyOutput > 65)
    return STRESS_ECONOMIC_EFFECTS.gov_econ_dependence;
  if (categoryPair.includes('government') && categoryPair.includes('military')) {
    const roll = _rng();
    return roll < 0.35
      ? STRESS_ECONOMIC_EFFECTS.gov_mil_friction
      : roll < 0.6
        ? STRESS_ECONOMIC_EFFECTS.wary_alliance
        : roll < 0.8
          ? STRESS_ECONOMIC_EFFECTS.genuine_respect
          : STRESS_ECONOMIC_EFFECTS.peer_rivalry;
  }
  if (Math.abs(powerDiff) >= 4)
    return _rng() < 0.5 ? STRESS_ECONOMIC_EFFECTS.mentor_legacy : STRESS_ECONOMIC_EFFECTS.old_debt;
  const getPersonality = (faction) => {
      const personality = faction.personality;
      return personality
        ? Array.isArray(personality)
          ? personality.join(' ')
          : [personality.dominant, personality.flaw, personality.modifier].filter(Boolean).join(' ')
        : '';
    },
    personalityA = getPersonality(factionA),
    personalityB = getPersonality(factionB),
    bothArrogant = personalityA.includes('arrogant') && personalityB.includes('arrogant'),
    bothGreedy = personalityA.includes('greedy') && personalityB.includes('greedy'),
    eitherPragmatic = personalityA.includes('pragmatic') || personalityB.includes('pragmatic');
  if (bothArrogant || bothGreedy || (factionA.category === factionB.category && _rng() < 0.2))
    return STRESS_ECONOMIC_EFFECTS.peer_rivalry;
  if (eitherPragmatic) return STRESS_ECONOMIC_EFFECTS.mutual_leverage;
  const weightedArchetypes = [
      {
        archetype: STRESS_ECONOMIC_EFFECTS.wary_alliance,
        weight: 2,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.mutual_leverage,
        weight: 1.8,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.genuine_respect,
        weight: 1.5,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.peer_rivalry,
        weight: 1.5,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.old_debt,
        weight: 1.2,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.bitter_history,
        weight: 0.8 * (instFlags.criminalEffective / 50),
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.family_complication,
        weight: 0.7,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.mentor_legacy,
        weight: 0.8,
      },
    ],
    totalWeight = weightedArchetypes.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = _rng() * totalWeight;
  for (const { archetype, weight } of weightedArchetypes) {
    roll -= weight;
    if (roll <= 0) return archetype;
  }
  return STRESS_ECONOMIC_EFFECTS.wary_alliance;
};

/**
 * THE HANDLER TIE'S KIND (ALLEGIANCE-CAR1, the design §1.5): from the vector already on the agent's card, never
 * re-rolled — greed and hunger for status a SILENT PARTNERSHIP, forbidden patron THE PATRON NO ONE NAMES,
 * fanaticism SWORN TO THE CAUSE, fear HELD OVER THEM by one of four leverage sub-kinds (drawn by the caller on the
 * agent's own tie fork).
 */
export const HANDLER_LEVERAGE_KINDS = Object.freeze(['debt', 'secret', 'crime', 'loved']);
/**
 * @param {string} vector the allegiance's vector @param {string} [leverage] one of HANDLER_LEVERAGE_KINDS (fear only)
 * @returns {any} a HANDLER_TIE_ARCHETYPES entry
 */
export const handlerArchetypeFor = (vector, leverage = 'debt') => {
  if (vector === 'fear') return HANDLER_TIE_ARCHETYPES[`handler_leverage_${HANDLER_LEVERAGE_KINDS.includes(leverage) ? leverage : 'debt'}`];
  if (vector === 'forbidden_patron') return HANDLER_TIE_ARCHETYPES.handler_patron;
  if (vector === 'fanaticism') return HANDLER_TIE_ARCHETYPES.handler_cause;
  return HANDLER_TIE_ARCHETYPES.handler_partnership;
};

/** The archetype's key in either table (the stress table's first; the handler table's beside it). @param {unknown} archetype @returns {string | undefined} */
const archetypeKeyOf = (archetype) => Object.entries(STRESS_ECONOMIC_EFFECTS).find(([, value]) => value === archetype)?.[0]
  ?? Object.entries(HANDLER_TIE_ARCHETYPES).find(([, value]) => value === archetype)?.[0];

/**
 * GOALS-1 (GR3 for ties, the chair's ruling of 2026-11-20 10:28 UTC): an archetype's HEAD, the count of its variants
 * before any reserve (`npcData.js :: pairProse`). The head is frozen: the cycle, the lines that name both parties and
 * the pool today's resolution reads are the first `head` indices only, so a reserve moves no tie that today's code deals.
 * @param {any} archetype @returns {number}
 */
const headOf = (archetype) => archetype.tension.head ?? archetype.tension.size;

/** Two stand-in names no generated NPC carries, for reading which lines name both parties. */
const PARTY_A = { name: 'Party-A-of-the-tie' };
const PARTY_B = { name: 'Party-B-of-the-tie' };
/** @type {WeakMap<object, number[]>} */
const bothNamedCache = new WeakMap();
/** The indices of an archetype's HEAD tension lines that name BOTH parties (pure; cached per archetype). */
const bothNamedTensions = (archetype) => {
  let indices = bothNamedCache.get(archetype);
  if (!indices) {
    indices = [];
    for (let index = 0; index < headOf(archetype); index++) {
      const line = archetype.tension(PARTY_A, PARTY_B, index);
      if (line.includes(PARTY_A.name) && line.includes(PARTY_B.name)) indices.push(index);
    }
    bothNamedCache.set(archetype, indices);
  }
  return indices;
};

/** @type {WeakMap<object, boolean[]>} */
const namesBothCache = new WeakMap();
/** Whether an archetype's tension line at `id` (head or reserve) names BOTH parties (pure; cached per archetype). @param {any} archetype @param {number} id */
const namesBoth = (archetype, id) => {
  let flags = namesBothCache.get(archetype);
  if (!flags) {
    flags = Array.from({ length: archetype.tension.size }, (_, i) => {
      const line = archetype.tension(PARTY_A, PARTY_B, i);
      return line.includes(PARTY_A.name) && line.includes(PARTY_B.name);
    });
    namesBothCache.set(archetype, flags);
  }
  return flags[id] === true;
};

/** @type {WeakMap<object, ReadonlyArray<Readonly<{ id: number, needs: string[], excludes: string[], crisis: string[], trust?: 'none' | 'full' }>>>} BAR2-PEOPLE (PP4): a row's trust */
const pairPoolCache = new WeakMap();
/**
 * An archetype's tie indices as one declared pool: index i declares what its desc row
 * (`desc.lines[i % n]`) and its tension row (`tension.lines[i % m]`) declare, together (pure;
 * cached per archetype; frozen, so `drawDeclared` caches whether it declares at all). No tie row
 * declares a crisis (CENSUS-4c's ledger), so the union is a plain union.
 * @param {any} archetype
 */
/**
 * BAR2-PEOPLE (PP4, the chair's ruling of 2026-11-15, vetoable by the owner): ONE HOME FOR A PAIR'S TRUST. A line that
 * states the pair's trust declares it (`trust: 'none'` "neither trusts the other at all"; `trust: 'full'` "trust
 * completely", "trusts <B>'s word over any written contract"); a pair's later tie of another kind is admitted only where
 * its line agrees with what the pair's first trust line stated (Weihu: Tian Ma and Xiao Gao "cooperate efficiently and
 * neither trusts the other at all" and "disagree often and trust completely"). Draw-free: the refused index resolves
 * like a held one. @param {ReadonlyArray<any>} lines @param {number} i @returns {'none' | 'full' | undefined}
 */
const trustOfRow = (lines, i) => {
  const row = lines.length ? lines[i % lines.length] : null;
  return row && typeof row === 'object' && (row.trust === 'none' || row.trust === 'full') ? row.trust : undefined;
};
const tiePairPool = (archetype) => {
  let pool = pairPoolCache.get(archetype);
  if (!pool) {
    const descLines = archetype.desc?.lines ?? [];
    const tensionLines = archetype.tension?.lines ?? [];
    /** @param {ReadonlyArray<any>} lines @param {number} i @param {'needs'|'excludes'|'crisis'} f @returns {string[]} */
    const field = (lines, i, f) => {
      const row = lines.length ? lines[i % lines.length] : null;
      return row && typeof row === 'object' && Array.isArray(row[f]) ? row[f] : [];
    };
    pool = Object.freeze(Array.from({ length: archetype.tension.size }, (_, id) => Object.freeze({
      id,
      needs: [...field(descLines, id, 'needs'), ...field(tensionLines, id, 'needs')],
      excludes: [...field(descLines, id, 'excludes'), ...field(tensionLines, id, 'excludes')],
      crisis: [...field(descLines, id, 'crisis'), ...field(tensionLines, id, 'crisis')],
      trust: trustOfRow(descLines, id) ?? trustOfRow(tensionLines, id),
    })));
    pairPoolCache.set(archetype, pool);
  }
  return pool;
};
/** @type {WeakMap<object, ReadonlyArray<any>>} */
const headPoolCache = new WeakMap();
/** GOALS-1 (GR3): the pool's first `head` rows (the pool itself where the reserve is empty; frozen, cached). @param {any} archetype */
const tieHeadPool = (archetype) => {
  const pool = tiePairPool(archetype);
  const head = headOf(archetype);
  if (head >= pool.length) return pool;
  let slice = headPoolCache.get(archetype);
  if (!slice) {
    slice = Object.freeze(pool.slice(0, head));
    headPoolCache.set(archetype, slice);
  }
  return slice;
};
/** A non-negative remainder. @param {number} n @param {number} m */
const mod = (n, m) => ((n % m) + m) % m;
/**
 * A resolution with its presumption notes KEPT ASIDE (`people/goals.js :: quiet`'s shape), so the ledger
 * (`cert:false-presumption`) records the line the tie prints, never a candidate passed over.
 * @template T @param {() => T} fn @returns {{ result: T, notes: any[] }}
 */
const quiet = (fn) => {
  /** @type {any[]} */
  const notes = [];
  const { result } = withPresumptionLedger(fn, /** @type {any} */ (notes));
  return { result, notes };
};

/**
 * GS-1 (ODQ §934.101): THE TIE-PROSE DRAW, WITHOUT REPLACEMENT PER SETTLEMENT. One draw per
 * `drawTies` call (one town; people/ties.js — the retired `generateRelationships` drew here before). The first tie of an archetype opens at a draw-free
 * fnv offset keyed on its own directed pair; each further tie of that archetype in the town takes
 * the next variant, so no description or tension line repeats on the page until the archetype's
 * whole pool is spent. Past that point the draw cycles through the lines that name BOTH parties
 * (when the pool has any), so an overflow tie can share a template with an earlier one but never
 * print the same sentence. ZERO rng draws: the relationship roll stream is untouched. The
 * returned `proseVariant` is stored on the tie because the line now depends on the rest of the
 * town, so a re-render under new names
 * (generateSettlementPipeline.js :: refreshRelationshipProjections) reuses it instead of re-hashing.
 * F1 (rung 1B): `force` is the place's force words (`defenseFacts.js :: forceWordsOf`), so a tie line
 * names the watch or the militia where no garrison stands; omitted, the lines keep the garrison's words.
 * CENSUS-1f (Appendix B site 19, H): the drawn index is RESOLVED through `drawDeclared` against
 * CENSUS-4c's in-place declarations (`npcData.js :: pairProse`'s `lines`). One index picks the desc
 * AND the tension line, so the index's declaration is the union of both rows' (`tiePairPool`). The
 * draw above is unchanged; a refused index moves to the hash argmax over the admitted indices (keyed
 * on the directed pair, so two ties of one archetype do not collapse onto one line). `facts` is the
 * birth's facts at the draw (R-V / R-Z: the roster and the government only; CENSUS-4c measured all
 * 30 declared rows settled there, 0 of 585 births differ); absent, a declared index is refused
 * (fail-closed, R-N). R2-CODE-A-14 (the chair's ruling (s1)): the draw hands the PAIR as its context (`ctx.pair`,
 * `[npc, partner]`), so a line about the two of them (`shared power`: "share a council bloc") reads the pair.
 * @param {Readonly<{ body: string, members: string, member: string }>} [force]
 * @param {object | (() => object) | null} [facts]
 * @returns {(archetype: any, npc: {id?: string, name?: string}, partner: {id?: string, name?: string}) =>
 *   {archetypeKey: string | undefined, proseVariant: number, resolvedIndex: number, description: string, tension: string}}
 *   `resolvedIndex` (GOALS-4 (A)): the index today's resolution chose before any TIES-HOLD replacement, for the caller's
 *   temper only; never stored on the tie.
 */
export const createTieProseDraw = (force, facts = null) => {
  /** @type {Map<unknown, {base: number, used: number, printed: Set<number>, cards: Map<number, string[][]>}>} GOALS-1 (GR3): `cards`, each printed index's ties as their two cards */
  const draws = new Map();
  /** TAIL-TIES-2 (T6): each pair's FIRST tie of a kind, as its directed key (`npcData.js :: REVERSED_TIE`). @type {Map<string, string>} */
  const firstOfPair = new Map();
  /** BAR2-PEOPLE (PP4): each pair's trust, as its first trust line stated it (the two ids, unordered). @type {Map<string, string>} */
  const trustOfPair = new Map();
  return (archetype, npc, partner) => {
    const archetypeKey = archetypeKeyOf(archetype);
    let draw = draws.get(archetype);
    if (!draw) {
      draw = { base: fnv1a32(`${npc?.name ?? ''}>${partner?.name ?? ''}::${archetypeKey ?? archetype?.label}`), used: 0, printed: new Set(), cards: new Map() };
      draws.set(archetype, draw);
    }
    // GOALS-1 (GR3): THE HEAD IS FROZEN. The cycle's modulus, the two-name lines and the pool today's resolution reads
    // are the first `head` indices (`headOf`); the reserve past them is reached only by a repeat, below.
    const size = headOf(archetype);
    const named = bothNamedTensions(archetype);
    const used = draw.used;
    const inHead = used < size || named.length === 0;
    const drawnVariant = inHead
      ? (draw.base + used) % size
      : named[(draw.base + used - size) % named.length];
    draw.used += 1;
    const whole = tiePairPool(archetype);
    const pool = tieHeadPool(archetype);
    /** @param {{ draw: (p: ReadonlyArray<any>) => any, held?: Set<string>, heldKey?: (l: any) => string }} how @param {ReadonlyArray<any>} [over] */
    const resolveAt = (how, over = pool) => drawDeclared(over, {
      ...how, facts, ctx: { pair: [npc, partner] }, key: `${npc?.name ?? ''}>${partner?.name ?? ''}::${archetypeKey ?? archetype?.label}`,
      poolId: `npcData:${archetypeKey && Object.hasOwn(HANDLER_TIE_ARCHETYPES, archetypeKey) ? 'HANDLER_TIE_ARCHETYPES' : 'STRESS_ECONOMIC_EFFECTS'}.${archetypeKey ?? archetype?.label}`, surface: 'relationships', drawKind: 'H',
    });
    // R2-CODE-A-14: WITHOUT REPLACEMENT HOLDS THROUGH THE RESOLUTION. In the head of the cycle (the first `size` ties
    // of the archetype in the town) a refused index resolves to an admitted index NO EARLIER TIE OF THE ARCHETYPE
    // PRINTED (the indices printed are `held`, so drawDeclared's hash argmax passes over them; a drawn index an
    // earlier resolution already printed is refused as held and resolves the same way). Draw-free: the drawn index is
    // the cycle's as before, and a town whose draws are all admitted resolves exactly as before. Only where every
    // admitted index is printed does it resolve as it did (a repeat, never a false line).
    const trustKey = [String(npc?.id ?? npc?.name ?? ''), String(partner?.id ?? partner?.name ?? '')].sort().join('\u0000');
    const pairTrust = trustOfPair.get(trustKey);
    const contrary = pairTrust ? pool.filter((l) => l.trust && l.trust !== pairTrust).map((l) => String(l.id)) : [];
    const held = inHead && (draw.printed.size || contrary.length) ? new Set([...[...draw.printed].map(String), ...contrary]) : null;
    const { result: resolved, notes: todayNotes } = quiet(() => {
      const once = held ? resolveAt({ draw: () => pool[drawnVariant], held, heldKey: (l) => String(l.id) }) : null;
      // TAIL-TIES-2 (T6's vote lines refuse more indices under one ruler): PAST THE POOL'S END the cycle runs over the lines
      // that name BOTH cards (above), so a refused overflow index resolves among THOSE first (the held set's rule: never a
      // one-name line where an admitted two-name one stands); the whole pool only where none is admitted. Draw-free.
      const overflow = !inHead && !once ? resolveAt({ draw: () => pool[drawnVariant], held: new Set([...pool.filter((l) => !named.includes(l.id)).map((l) => String(l.id)), ...contrary]), heldKey: (l) => String(l.id) }) : null;
      const agreeing = contrary.length && !(once && once.line) && !(overflow && overflow.line) ? resolveAt({ draw: () => pool[drawnVariant], held: new Set(contrary), heldKey: (l) => String(l.id) }) : null;
      return once && once.line ? once : overflow && overflow.line ? overflow : agreeing && agreeing.line ? agreeing : resolveAt({ draw: (p) => p[drawnVariant] });
    });
    const from = String(npc?.id ?? npc?.name ?? '');
    const to = String(partner?.id ?? partner?.name ?? '');
    // GOALS-4 (A), the chair's ruling of 2026-11-20 21:30 UTC: TODAY'S RESOLVED INDEX, before any replacement below. It is
    // handed out beside `proseVariant` (never stored on the tie) so the tie's temper (`people/ties.js :: temperOfTie`) reads
    // the line today's resolution chose, never a replacement's declaration: the stored fields stay byte-equal.
    const resolvedIndex = resolved.line ? resolved.line.id : drawnVariant;
    let index = resolvedIndex;
    let notes = todayNotes;
    // GOALS-4 (A2), TIES-HOLD (the chair's ruling of 2026-11-20 21:30 UTC; it carries GOALS-1's GR3 for ties, 10:28 UTC):
    // WITHIN ONE PLACE NO TIE PRINTS A TEMPLATE ANOTHER TIE OF THE PLACE PRINTED while a line is free. One template is one
    // index of one archetype (one index picks the description AND the tension; no two lines of the tables render one
    // template), and the place's ledger is `draw.cards` (each printed index's ties, in the ties' own order). Only where
    // today's resolution prints an index already taken, draw-free: (1) the first index of the HEAD in its keyed order from
    // the drawn index, then (2) the first of the RESERVE from the cycle's place past the head, not yet taken, that the trust
    // clause and the line's own declarations admit; else (3) the LEAST PRINTED admitted line (a line naming both cards
    // before a one-name line, TAIL-TIES-2; then one whose earlier ties share no card with this one, GR3's "a template held
    // twice is never held by two people tied to each other"; then the same keyed order). THE TRUST CLAUSE, the corrected
    // law (20:30 and 20:50 UTC): a replacement that declares a trust stands in only for today's same trust; one that
    // declares none stands in for any. A line contrary to the pair's stated trust is held, as before.
    if (draw.printed.has(index)) {
      const trust = whole[index]?.trust;
      const contraryWhole = pairTrust ? whole.filter((l) => l.trust && l.trust !== pairTrust).map((l) => String(l.id)) : [];
      const heldNow = new Set(contraryWhole);
      /** @param {number} id */
      const admits = (id) => {
        if (whole[id].trust && whole[id].trust !== trust) return null;
        const probe = quiet(() => resolveAt({ draw: () => whole[id], held: heldNow, heldKey: (l) => String(l.id) }, whole));
        return probe.result.line && probe.result.line.id === id ? probe.notes : null;
      };
      const reserve = whole.length - size;
      const order = [
        ...Array.from({ length: size }, (_, k) => mod(drawnVariant + k, size)),
        ...Array.from({ length: reserve }, (_, k) => size + mod(draw.base + used - size + k, reserve)),
      ];
      /** @type {{ id: number, kept: any[] } | null} */
      let found = null;
      for (const id of order) {
        if (draw.printed.has(id)) continue;
        const kept = admits(id);
        if (kept) { found = { id, kept }; break; }
      }
      if (!found) {
        /** @type {Array<{ id: number, kept: any[], rank: number[] }>} */
        const open = [];
        order.forEach((id, at) => {
          const kept = admits(id);
          if (!kept) return;
          const by = draw.cards.get(id) ?? [];
          const shares = by.some((pair) => pair.includes(from) || pair.includes(to)) ? 1 : 0;
          open.push({ id, kept, rank: [namesBoth(archetype, id) ? 0 : 1, by.length, shares, at] });
        });
        open.sort((x, y) => x.rank[0] - y.rank[0] || x.rank[1] - y.rank[1] || x.rank[2] - y.rank[2] || x.rank[3] - y.rank[3]);
        if (open.length && open[0].id !== index) found = open[0];
      }
      if (found) { index = found.id; notes = found.kept; }
    }
    for (const note of notes) notePresumption(note);
    draw.printed.add(index);
    draw.cards.set(index, [...(draw.cards.get(index) ?? []), [from, to]]);
    const statedTrust = resolved.line ? resolved.line.trust : undefined;
    if (statedTrust && !trustOfPair.has(trustKey)) trustOfPair.set(trustKey, statedTrust);
    // TAIL-TIES-2, the chair's ruling (T6): a second tie of the same kind between the same two cards, drawn the other way
    // round, is written in the first tie's order (the pair's direction has one home); its index and draw are untouched.
    const pairKey = `${archetypeKey ?? archetype?.label}::${[from, to].sort().join('\u0000')}`;
    if (!firstOfPair.has(pairKey)) firstOfPair.set(pairKey, `${from}>${to}`);
    const reversed = from !== to && firstOfPair.get(pairKey) === `${to}>${from}`;
    const proseVariant = reversed ? REVERSED_TIE + index : index;
    return {
      archetypeKey,
      proseVariant,
      resolvedIndex,
      description: archetype.desc(npc, partner, proseVariant, force),
      tension: archetype.tension(npc, partner, proseVariant, force),
    };
  };
};
