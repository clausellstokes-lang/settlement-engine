/**
 * power/settlementNarrative.js — settlement-level power narratives:
 * succession/tension prose (genSuccessionNarr) and the salient-relationship
 * rumour (genRelNarrative), with their STRESS_FLAVOR / STRESS_RUMORS tables.
 */
import { random as _rng } from '../../kernel/rngContext.js';
import { pickRandom2, random01 } from '../helpers.js';

// STRESS_FLAVOR
export const STRESS_FLAVOR = {
  under_siege: ['debtor_creditor', 'enemy', 'patron_client'],
  famine: ['debtor_creditor', 'patron_client', 'political'],
  occupied: ['ally', 'debtor_creditor', 'enemy'],
  politically_fractured: ['enemy', 'rival', 'political'],
  indebted: ['debtor_creditor', 'patron_client'],
  recently_betrayed: ['ally', 'patron_client', 'enemy'],
  infiltrated: ['ally', 'patron_client'],
  plague_onset: ['patron_client', 'debtor_creditor'],
  succession_void: ['rival', 'enemy', 'political'],
  monster_pressure: ['patron_client', 'debtor_creditor'],
  insurgency: ['enemy', 'political', 'rival'],
  mass_migration: ['patron_client', 'debtor_creditor', 'ally'],
  wartime: ['enemy', 'ally', 'patron_client'],
  religious_conversion: ['rival', 'political', 'patron_client'],
  slave_revolt: ['enemy', 'rival', 'debtor_creditor'],
};

// STRESS_RUMORS — each renders a rumour phrasing from a relationship object
// {colour} (CENSUS-2e, R-R; ledger docs/census/declarations/STRESS_RUMORS.json): the fixed words presume
// only the two NPCs the key supplies, and the `tension` slot is upstream relationship prose, declared there.
// THE TIE IS DIRECTED (PEOPLE-4 TIES, R-P7; people/ties.js): `npc1Name` is the `from` end's name and leads every
// phrasing, `npc2Name` the `to` end's — the existing templates, the direction choosing who leads (M-4).
// W3 POW (the owner's style law of 2026-11-07; STYLE-AUDIT #58/#59/#190): rumours [0] and [1] print the tie's own
// detail alone (the frames "connected by something neither discusses openly", "more complicated than their public
// roles suggest" said nothing); [2] glosses the archetype LABEL (people/ties.js :: typeName, npcData's labels) in
// plain words in place of the lower-cased label. An unknown label reads "are closely tied".
const TIE_GLOSS = Object.freeze({
  'Commercial Complicity': 'are partners in a trade neither would want looked at',
  'Protection Arrangement': 'are bound by a protection deal',
  'Corrupt Arrangement': 'are in a crooked arrangement together',
  'Active Suppression': 'are at open odds, one working to shut the other down',
  'Security Contract': 'are bound by a contract for protection',
  'Sacred Commission': 'are bound by work done for the faith',
  'Institutional Cover': 'are tied together, one giving the other cover',
  'Arcane Supplier': 'are tied by a trade in magical goods',
  'Financial Dependence': 'are tied by money, one depending on the other',
  'Jurisdictional Tension': 'are at odds over who has the say',
  'Professional Rivalry': 'are rivals in the same line of work',
  'Mentor and Successor': 'are teacher and heir',
  'Mutual Leverage': 'each hold something over the other',
  'Pragmatic Alliance': 'are allies of convenience',
  'Genuine Respect': 'respect each other, and it is real',
  'Outstanding Debt': 'are tied by a debt not yet paid',
  'Family Complication': 'are family, and it is not simple',
  'Unresolved History': 'share a past neither has put behind them',
});
const STRESS_RUMORS = [
  (rel) => {
    var detail;
    return `${((detail = rel.description.split('—')[1]) == null ? void 0 : detail.trim()) || rel.tension}`;
  },
  (rel) => `${rel.tension}`,
  (rel) => {
    return `${rel.npc1Name} and ${rel.npc2Name} ${TIE_GLOSS[rel.typeName] || 'are closely tied'}. ${rel.tension}`;
  },
  (rel) => rel.tension,
];

// resolvePartyPair — resolve two party display names (with fallbacks), then
// dedupe: upstream, topFaction falls back to govFaction and the governing
// faction is often also the most powerful, so both slots can resolve to the
// same name ("Corrupt Council and Corrupt Council"). Returns [first, null]
// when only one distinct party exists so callers can switch to a
// single-party phrasing.
const resolvePartyPair = (a, fallbackA, b, fallbackB) => {
  const first = a || fallbackA;
  const second = b || fallbackB;
  const samePlace = (first || '').trim().toLowerCase() === (second || '').trim().toLowerCase();
  return samePlace ? [first, null] : [first, second];
};

// Values such as "the town council" are intentionally lower-case when used
// mid-sentence elsewhere. Capitalise only at the interpolation sites that open
// a new sentence, preserving the canonical display name in every other context.
const sentenceStart = value => {
  const text = String(value || '').trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
};

// genSuccessionNarr — build a list of narrative sentences from a settlement
// context object `ctx`, each gated on a tension/state condition.
export const genSuccessionNarr = (ctx) => {
  var issueMessage, stabilityUnstable, stabilityFractured, stabilityVolatile;
  const narratives = [];
  if (ctx.topTension === 'succession_crisis')
    narratives.push(
      `${ctx.name}'s ruler is old and the succession is disputed; ${ctx.topFaction || 'the dominant faction'} already has its candidate ready.`
    );
  if (ctx.topTension === 'corruption_scandal')
    narratives.push(
      `Proof of corruption in ${ctx.govFaction || 'the council'} has come out, and ${ctx.topNPCName ? ctx.topNPCName + ', the ' + ctx.topNPCRole + ',' : 'the most senior official'} is expected to deal with it while being part of it.`
    );
  if (ctx.topTension === 'outside_debt')
    narratives.push(
      `${ctx.name} owes money, and it shows in what its leaders decide. The creditor has not called the debt in yet, but is choosing the moment.`
    );
  if (ctx.topTension === 'infiltration_fear')
    narratives.push(
      `Talk of enemy agents has ${ctx.name} suspicious of everyone, and at least one faction is using the fear for its own ends.`
    );
  if (!ctx.isViable && ctx.viabilityIssues?.length > 0)
    narratives.push(
      `${ctx.name} has a problem it has not solved (${((issueMessage = ctx.viabilityIssues[0].message) == null ? void 0 : issueMessage.toLowerCase()) || 'an economic vulnerability'}), and sooner or later its leaders will have to face it.`
    );
  if (ctx.hasNeighborConflict && ctx.neighbor)
    narratives.push(
      `The relationship with ${ctx.neighbor} has deteriorated to the point where ${ctx.name}'s ${ctx.topNPCRole || 'leadership'} is making decisions with one eye on what conflict would cost.`
    );
  if (ctx.prosperity === 'Wealthy' || ctx.prosperity === 'Thriving')
    narratives.push(
      `${ctx.name} is prosperous enough that the real conflicts are about who controls the surplus. ${sentenceStart(ctx.topFaction || 'The dominant faction')} has the most and wants more.`
    );
  if (ctx.prosperity === 'Poor') {
    const [costGov, costTop] = resolvePartyPair(
      ctx.govFaction, 'the council', ctx.topFaction, 'the merchant class'
    );
    narratives.push(
      costTop
        ? `${ctx.name} is poor, and ${costGov} and ${costTop} quarrel over who goes without.`
        : `${ctx.name} is poor; ${costGov} decides who goes without, and is resented for it.`
    );
  }
  if (ctx.commodity && ctx.isCrossroads)
    narratives.push(
      `${ctx.name} sits where trade roads cross, and its ${ctx.commodity} passes through in both directions. Whoever sets the toll controls the settlement's money, and ${ctx.topFaction || 'the guilds'} knows it.`
    );
  if (ctx.commodity && ctx.isPort)
    narratives.push(
      `${ctx.name}'s port handles more ${ctx.commodity} than the official records show; the gap between what arrives and what is taxed is understood by ${ctx.topFaction || 'the merchant class'} and the guard alike.`
    );
  if (
    ((stabilityUnstable = ctx.stability) != null && stabilityUnstable.includes('Unstable')) ||
    ((stabilityFractured = ctx.stability) != null && stabilityFractured.includes('Fractured')) ||
    ((stabilityVolatile = ctx.stability) != null && stabilityVolatile.includes('Volatile'))
  )
  {
    const [contestTop, contestGov] = resolvePartyPair(
      ctx.topFaction, 'the dominant faction', ctx.govFaction, 'the council'
    );
    narratives.push(
      contestGov
        ? `${sentenceStart(contestTop)} and ${contestGov} are at odds in ${ctx.name}, more than they let outsiders see.`
        : `${sentenceStart(contestTop)}'s hold on ${ctx.name} is weaker than it looks from outside.`
    );
  }
  if (ctx.topTension === 'economic_disparity') {
    const [surplusTop, surplusGov] = resolvePartyPair(
      ctx.topFaction, 'the merchant class', ctx.govFaction, 'the council'
    );
    narratives.push(
      surplusGov
        ? `The rich and the poor of ${ctx.name} live different lives now: ${surplusTop} holds the surplus, and ${surplusGov} cannot or will not make it share. The resentment does not ease between bad seasons.`
        : `The rich and the poor of ${ctx.name} live different lives now: ${surplusTop} holds the surplus and will not share it, and the resentment does not ease between bad seasons.`
    );
  }
  if (ctx.topTension === 'religious_tension')
    narratives.push(
      `Two versions of faith are competing in ${ctx.name}; both claim legitimacy and both have the ear of someone powerful. ${sentenceStart(ctx.govFaction || 'The council')} has avoided taking sides so far, which means both factions resent it equally.`
    );
  if (ctx.topTension === 'guild_conflict')
    narratives.push(
      `The guild dispute in ${ctx.name} is not about craft standards. It is about who controls access to the market. ${sentenceStart(ctx.topFaction || 'The dominant guild')} has held the advantage long enough that the challengers have stopped playing by guild rules.`
    );
  if (ctx.topTension === 'external_threat' && ctx.neighbor)
    narratives.push(
      `${ctx.name} is watching ${ctx.neighbor} and does not like what it sees. ${sentenceStart(ctx.govFaction || 'The council')} and ${ctx.milForce || 'the garrison'} disagree about what to do about it, and that disagreement is now public.`
    );
  if (ctx.topTension === 'external_threat' && !ctx.neighbor)
    narratives.push(
      `Trouble is coming to ${ctx.name}, and most people do not know it yet. ${sentenceStart(ctx.topNPCName || 'The most senior figure')} knows, and has told nobody.`
    );
  if (ctx.topTension === 'resource_scarcity' && ctx.commodity) {
    const [numbersTop, numbersGov] = resolvePartyPair(
      ctx.topFaction, 'The merchant class', ctx.govFaction, 'The council'
    );
    narratives.push(
      numbersGov
        ? `${ctx.name}'s ${ctx.commodity} supply is tighter than the official position acknowledges. ${sentenceStart(numbersTop)} knows the real numbers. ${sentenceStart(numbersGov)} has been told a different version.`
        : `${ctx.name}'s ${ctx.commodity} supply is tighter than the official position acknowledges. ${sentenceStart(numbersTop)} knows the real numbers and has kept them close.`
    );
  }
  if (ctx.topTension === 'resource_scarcity' && !ctx.commodity)
    narratives.push(
      `${ctx.name} is running short of something it needs, and ${ctx.govFaction || 'the council'} decides who gets what is left.`
    );
  if (ctx.topTension === 'crime_wave')
    narratives.push(
      `${ctx.name}'s criminal problem has grown past the point ${ctx.milForce || 'the guard'} can contain through normal enforcement. The question is whether ${ctx.govFaction || 'the council'} brings in more force, negotiates, or finds a scapegoat. Someone powerful benefits from each option.`
    );
  if (ctx.topTension === 'magical_controversy')
    narratives.push(
      `A recent piece of magic has divided ${ctx.name}. ${sentenceStart(ctx.govFaction || 'The council')} is being pushed to ban or license it, by people who cannot agree which.`
    );
  if (ctx.topTension === 'generational_divide')
    narratives.push(
      `In ${ctx.name} the old say the young have no respect, and the young say the old keep everything for themselves.`
    );
  if (ctx.topTension === 'occupation_legacy')
    narratives.push(
      `${ctx.name} carries the memory of an occupation that officially ended. Collaborators and resisters still share the same streets, the same market, the same ${ctx.govFaction || 'council'}. The official position is that this is resolved.`
    );
  if (ctx.topTension === 'disputed_land')
    narratives.push(
      `An old land dispute in ${ctx.name} has flared up again. ${sentenceStart(ctx.govFaction || 'The council')} keeps putting off a ruling, because whichever side loses will hold it against them.`
    );
  if (ctx.topTension === 'population_friction')
    narratives.push(
      `${ctx.name} is not the place it was a few years ago, and ${ctx.govFaction || 'the council'} still governs as if it were.`
    );
  if (ctx.topTension === 'leadership_vacuum')
    narratives.push(
      `Nobody has really led ${ctx.name} since the last strong leader went. Its leaders still meet, but anything that matters is put off or settled privately by ${ctx.topFaction || 'the faction with the most to gain'}.`
    );
  narratives.push(
    `${ctx.topNPCName ? sentenceStart(ctx.topNPCName) + ', the ' + ctx.topNPCRole + ',' : 'The most senior figure'} knows something about ${ctx.name} that nobody else does, and is keeping it quiet.`
  );
  return narratives;
};

// genRelNarrative — pick the most salient relationship and render a rumour for it
export const genRelNarrative = (input) => {
  var firstStress, topScored;
  const { relationships = [], stress, config: _config = {} } = input;
  if (!relationships.length || random01(0.4)) return null;
  const primaryStressType =
      ((firstStress = (stress ? (Array.isArray(stress) ? stress : [stress]) : [])[0]) == null
        ? void 0
        : firstStress.type) || null,
    flavorTypes = primaryStressType ? STRESS_FLAVOR[primaryStressType] || [] : [],
    scored = relationships.map((rel) => {
      let score = _rng() * 0.5;
      if (flavorTypes.includes(rel.type)) score += 2;
      if (rel.flagDriven) score += 1;
      if (rel.tension && rel.tension.length > 30) score += 0.5;
      return {
        r: rel,
        score,
      };
    });
  scored.sort((a, b) => b.score - a.score);
  const topRel = (topScored = scored[0]) == null ? void 0 : topScored.r;
  if (!topRel) return null;
  const phrasing = pickRandom2(STRESS_RUMORS)(topRel);
  // the tie's `from` end leads (`npc1`), its `to` end follows (`npc2`)
  return {
    npc1: topRel.npc1Name,
    npc2: topRel.npc2Name,
    type: topRel.typeName,
    phrasing,
    full: topRel.description,
    tension: topRel.tension,
  };
};
