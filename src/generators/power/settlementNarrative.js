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
const STRESS_RUMORS = [
  (rel) => {
    var detail;
    return `${rel.npc1Name} and ${rel.npc2Name} are connected by something neither discusses openly — ${((detail = rel.description.split('—')[1]) == null ? void 0 : detail.trim()) || rel.tension}`;
  },
  (rel) =>
    `${rel.npc1Name}'s relationship with ${rel.npc2Name} is more complicated than their public roles suggest. ${rel.tension}`,
  (rel) => {
    var typeName;
    return `The relationship between ${rel.npc1Name} and ${rel.npc2Name} is best understood as ${((typeName = rel.typeName) == null ? void 0 : typeName.toLowerCase()) || 'significant'}. ${rel.tension}`;
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
      `${ctx.name}'s ruler is ageing and the succession is contested; ${ctx.topFaction || 'the dominant faction'} has already positioned for the transition.`
    );
  if (ctx.topTension === 'corruption_scandal')
    narratives.push(
      `Evidence of corruption in ${ctx.govFaction || 'the council'} has surfaced; ${ctx.topNPCName ? ctx.topNPCName + ', the ' + ctx.topNPCRole + ',' : 'the most senior official'} is part of the answer and part of the problem.`
    );
  if (ctx.topTension === 'outside_debt')
    narratives.push(
      `${ctx.name}'s debt obligations are becoming visible in its decisions; the creditor hasn't moved yet, but the calculation of when to move is being made.`
    );
  if (ctx.topTension === 'infiltration_fear')
    narratives.push(
      `Rumours of enemy agents in ${ctx.name} have made the settlement paranoid in ways that are being exploited by at least one of the factions paranoia is supposed to protect against.`
    );
  if (!ctx.isViable && ctx.viabilityIssues?.length > 0)
    narratives.push(
      `${ctx.name} has a structural problem it hasn't solved — ${((issueMessage = ctx.viabilityIssues[0].message) == null ? void 0 : issueMessage.toLowerCase()) || 'an economic vulnerability'} — that will eventually force a decision.`
    );
  if (ctx.hasNeighborConflict && ctx.neighbor)
    narratives.push(
      `The relationship with ${ctx.neighbor} has deteriorated to the point where ${ctx.name}'s ${ctx.topNPCRole || 'leadership'} is making decisions with one eye on what conflict would cost.`
    );
  if (ctx.prosperity === 'Wealthy' || ctx.prosperity === 'Thriving')
    narratives.push(
      `${ctx.name} is prosperous enough that the real conflicts are about who controls the surplus — ${ctx.topFaction || 'the dominant faction'} has the most and wants more.`
    );
  if (ctx.prosperity === 'Poor') {
    const [costGov, costTop] = resolvePartyPair(
      ctx.govFaction, 'the council', ctx.topFaction, 'the merchant class'
    );
    narratives.push(
      costTop
        ? `${ctx.name} is poor enough that every resource decision is a political one; ${costGov} and ${costTop} disagree about who bears the cost.`
        : `${ctx.name} is poor enough that every resource decision is a political one; ${costGov} decides who bears the cost, and is resented for it.`
    );
  }
  if (ctx.commodity && ctx.isCrossroads)
    narratives.push(
      `${ctx.name} sits where trade roads cross; its ${ctx.commodity} trade moves through it in both directions, and whoever controls the tariff controls the settlement's revenue — a fact not lost on ${ctx.topFaction || 'the guilds'}.`
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
        ? `${ctx.name} looks stable from the outside; the relationship between ${contestTop} and ${contestGov} is more contested than it appears.`
        : `${ctx.name} looks stable from the outside; ${contestTop}'s hold on that stability is more contested than it appears.`
    );
  }
  if (ctx.topTension === 'economic_disparity') {
    const [surplusTop, surplusGov] = resolvePartyPair(
      ctx.topFaction, 'the merchant class', ctx.govFaction, 'the council'
    );
    narratives.push(
      surplusGov
        ? `The wealth gap in ${ctx.name} has become a fact of daily life — ${surplusTop} controls the surplus and ${surplusGov} cannot or will not force redistribution. Resentment is structural now, not episodic.`
        : `The wealth gap in ${ctx.name} has become a fact of daily life — ${surplusTop} controls the surplus and will not redistribute it. Resentment is structural now, not episodic.`
    );
  }
  if (ctx.topTension === 'religious_tension')
    narratives.push(
      `Two versions of faith are competing in ${ctx.name}; both claim legitimacy and both have the ear of someone powerful. ${sentenceStart(ctx.govFaction || 'The council')} has avoided taking sides so far, which means both factions resent it equally.`
    );
  if (ctx.topTension === 'guild_conflict')
    narratives.push(
      `The guild dispute in ${ctx.name} is not about craft standards — it is about who controls access to the market. ${sentenceStart(ctx.topFaction || 'The dominant guild')} has held the advantage long enough that the challengers have stopped playing by guild rules.`
    );
  if (ctx.topTension === 'external_threat' && ctx.neighbor)
    narratives.push(
      `${ctx.name} is watching ${ctx.neighbor} and does not like what it sees. ${sentenceStart(ctx.govFaction || 'The council')} and ${ctx.milForce || 'the garrison'} disagree about what to do about it, and that disagreement is now public.`
    );
  if (ctx.topTension === 'external_threat' && !ctx.neighbor)
    narratives.push(
      `The threat approaching ${ctx.name} is not yet visible to most residents. ${sentenceStart(ctx.topNPCName || 'The most senior figure')} knows the intelligence and has not shared it. The decision about when to share it — and how — is the real crisis.`
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
      `Something essential in ${ctx.name} is running short — food, water, or coin. The shortage is being managed through allocation decisions that are, functionally, political decisions. ${sentenceStart(ctx.govFaction || 'The council')} controls the allocation.`
    );
  if (ctx.topTension === 'crime_wave')
    narratives.push(
      `${ctx.name}'s criminal problem has grown past the point ${ctx.milForce || 'the guard'} can contain through normal enforcement. The question is whether ${ctx.govFaction || 'the council'} brings in more force, negotiates, or finds a scapegoat. Someone powerful benefits from each option.`
    );
  if (ctx.topTension === 'magical_controversy')
    narratives.push(
      `Magic in ${ctx.name} has done something recently that people cannot agree on how to interpret. ${sentenceStart(ctx.govFaction || 'The council')} is being pressured to regulate — by people who disagree about what regulation means.`
    );
  if (ctx.topTension === 'generational_divide')
    narratives.push(
      `In ${ctx.name} the older residents and the younger ones are not arguing about the same things. The older generation thinks the argument is about values; the younger thinks it is about access. Both are right.`
    );
  if (ctx.topTension === 'occupation_legacy')
    narratives.push(
      `${ctx.name} carries the memory of an occupation that officially ended. Collaborators and resisters still share the same streets, the same market, the same ${ctx.govFaction || 'council'}. The official position is that this is resolved.`
    );
  if (ctx.topTension === 'disputed_land')
    narratives.push(
      `A land dispute in ${ctx.name} that was dormant is now active — someone filed a claim, or found a document, or simply started pressing. ${sentenceStart(ctx.govFaction || 'The council')} has delayed ruling because there is no outcome that does not cost them something.`
    );
  if (ctx.topTension === 'population_friction')
    narratives.push(
      `${ctx.name} is absorbing people it did not plan for, or losing people it expected to keep. Either way, the settlement's social assumptions no longer match its actual composition, and ${ctx.govFaction || 'the council'} is governing for the settlement that used to exist.`
    );
  if (ctx.topTension === 'leadership_vacuum')
    narratives.push(
      `${ctx.name} has not had a strong authority since ${ctx.topNPCName || 'the last leader'} left or died. The pretense of normal governance is maintained. Every decision of consequence is being deferred or made informally by ${ctx.topFaction || 'the faction with the most to gain'}.`
    );
  narratives.push(
    `The most important thing happening in ${ctx.name} right now is happening below the surface — ${ctx.topNPCName ? ctx.topNPCName + ', the ' + ctx.topNPCRole + ',' : 'the most senior figure'} knows it and isn't discussing it.`
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
  return {
    npc1: topRel.npc1Name,
    npc2: topRel.npc2Name,
    type: topRel.typeName,
    phrasing,
    full: topRel.description,
    tension: topRel.tension,
  };
};
