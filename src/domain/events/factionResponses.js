/**
 * domain/events/factionResponses.js — Convert events into faction reactions.
 *
 * The architect critique pushed for full faction agency cards (wants,
 * fears, leverage, vulnerabilities, likely response). The cost is real:
 * authoring those for every faction in every culture is months of work.
 * This v1 ships ONE archetype — the Merchant Guild — and demonstrates
 * the loop end-to-end. Once the loop is proven, we add archetypes
 * incrementally based on which factions DMs actually have in their
 * settlements.
 *
 * The detection is name-pattern based (the same pragmatic shortcut
 * the rest of the engine uses). When the catalog gets stable IDs/tags,
 * this becomes a tag lookup without changing the response logic.
 */

/** @typedef {import('../types.js').Event} Event */
/** @typedef {import('../types.js').FactionResponse} FactionResponse */

/**
 * Compute responses from every faction in `settlement.powerStructure.factions`
 * that matches a known archetype, given an event.
 *
 * @param {Object} settlement
 * @param {Event}  event
 * @returns {FactionResponse[]}
 */
export function generateFactionResponses(settlement, event) {
  const factions = settlement?.powerStructure?.factions || settlement?.factions || [];
  /** @type {FactionResponse[]} */
  const out = [];
  for (const faction of factions) {
    const archetype = matchArchetype(faction);
    if (!archetype) continue;
    const response = ARCHETYPE_RESPONDERS[archetype]?.(faction, event, settlement);
    if (response) out.push(/** @type {FactionResponse} */ (response));
  }
  return out;
}

/**
 * Map a faction's name/category to a known archetype.
 *
 * Order matters: more specific patterns are checked first because some
 * factions match multiple loose terms (e.g. "Thieves' Guild" matches
 * both "thieves" and "guild"). The thieves'-guild branch wins.
 *
 * Falls back to `null` for unrecognized factions; the caller skips
 * those (they produce no response). New archetypes are added here +
 * a responder in ARCHETYPE_RESPONDERS.
 */
function matchArchetype(faction) {
  const name = String(faction?.name || faction?.faction || '').toLowerCase();
  const cat  = String(faction?.category || faction?.type || '').toLowerCase();
  // Criminal / shadow first — "thieves' guild" contains "guild"
  if (cat === 'criminal' || /thieves|smuggler|shadow|crime|bandit|underworld|assassin/.test(name)) return 'thieves_guild';
  // Religious — temples, churches, sects, clergy, monastery.
  // Match `clergy` explicitly because "The Clergy" doesn't share a
  // root with `cleric` for our regex purposes.
  if (cat === 'religious' || cat === 'temple' || /temple|church|shrine|monastery|cleric|clergy|priest|cult/.test(name)) return 'temple';
  // Watch / militia / law enforcement
  if (cat === 'military' || cat === 'watch' || cat === 'law' || /watch|militia|guard|sheriff|sentinel|ranger|warden/.test(name)) return 'watch';
  // Merchant — stable trade access, guilds, markets
  if (cat === 'merchant' || /merchant|guild|trade|bazaar|market/.test(name))    return 'merchant_guild';
  return null;
}

const ARCHETYPE_RESPONDERS = {
  merchant_guild: respondAsMerchantGuild,
  temple:         respondAsTemple,
  watch:          respondAsWatch,
  thieves_guild:  respondAsThievesGuild,
};

/**
 * Merchant Guild archetype.
 *
 * Wants:        stable trade access, high prices on goods they control,
 *               privileged relationship with civic authority.
 * Fears:        new competitors, price ceilings, route disruption that
 *               outlasts their stockpiles.
 * Leverage:     warehouse access, credit, caravan contracts, smuggling
 *               connections.
 * Vulnerability: depends on a few key routes and creditors.
 *
 * Response logic is deliberately legible — each event type maps to a
 * stance + a one-line action. No model-driven prose; the strings are
 * authored. The AI narrative layer (when wired) gets the structured
 * response and can elaborate; the structured response is the source of
 * truth.
 */
function respondAsMerchantGuild(faction, event, settlement) {
  const name = faction.name || faction.faction || 'Merchant Guild';
  const id   = faction.id   || `faction.${name.toLowerCase().replace(/\s+/g, '_')}`;

  switch (event.type) {
    case 'DAMAGE_INSTITUTION':
    case 'REMOVE_INSTITUTION': {
      const targetKind = classifyInstitutionTarget(event.targetId);
      if (targetKind === 'food_storage') {
        return {
          factionId: id, factionName: name,
          stance: 'opportunity',
          response: `${name} mobilizes import contracts to fill the gap, offering grain on credit. Privately, members lobby the council against any temple-led rationing.`,
          hookSeed: `A dockworker overhears guild leadership talking about timing — they knew the granary was vulnerable.`,
        };
      }
      if (targetKind === 'trade') {
        return {
          factionId: id, factionName: name,
          stance: 'threat',
          response: `${name} loses immediate revenue and presses civic authorities to restore the lost market or compensate affected member houses.`,
          hookSeed: `A junior factor approaches the party with a fast-money proposition involving 'reorganized' goods.`,
        };
      }
      if (targetKind === 'law_enforcement') {
        return {
          factionId: id, factionName: name,
          stance: 'opportunity_and_threat',
          response: `${name} hires private guards for warehouses while quietly cultivating the criminals now moving without watch interference.`,
        };
      }
      return {
        factionId: id, factionName: name,
        stance: 'neutral',
        response: `${name} watches but does not yet act.`,
      };
    }

    case 'CUT_TRADE_ROUTE':
      return {
        factionId: id, factionName: name,
        stance: 'threat',
        response: `${name} suffers immediate cash-flow strain. Members with stockpiles raise prices; those without panic. Expect lobbying for armed escorts and tariff relief.`,
        hookSeed: `The Guild seeks a small group willing to scout the route and report on what closed it — quietly, before competitors do.`,
      };

    case 'DEPLETE_RESOURCE':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity_and_threat',
        response: `${name} pivots: members holding stockpiles benefit from scarcity prices; those without scramble for substitutes or imports.`,
        hookSeed: `Two guild houses are now openly bidding for any party willing to source a substitute supply.`,
      };

    case 'ADD_INSTITUTION':
      if (classifyInstitutionTarget(event.targetId) === 'religious') {
        return {
          factionId: id, factionName: name,
          stance: 'threat',
          response: `${name} watches the new ${labelOf(event.targetId)} carefully — temple charity often becomes a competing distribution network. Some members propose donations to co-opt the leadership.`,
        };
      }
      if (classifyInstitutionTarget(event.targetId) === 'trade') {
        return {
          factionId: id, factionName: name,
          stance: 'opportunity_and_threat',
          response: `${name} both fears competition and sees a chance to absorb the new ${labelOf(event.targetId)} into existing networks.`,
        };
      }
      return {
        factionId: id, factionName: name,
        stance: 'neutral',
        response: `${name} takes note.`,
      };

    default:
      return {
        factionId: id, factionName: name,
        stance: 'neutral',
        response: `${name} takes no public action yet.`,
      };
  }
}

/**
 * Temple archetype.
 *
 * Wants:        public legitimacy, charity authority, moral weight in
 *               civic decisions.
 * Fears:        rival sects, exposure of clergy misconduct, theocratic
 *               reform attacking established orthodoxy.
 * Leverage:     networks of laity, food relief, funerary rites, public
 *               sermons, claim to moral high ground.
 * Vulnerability: depends on legitimacy that can collapse from a single
 *               failed prophecy or scandal.
 */
function respondAsTemple(faction, event /* , settlement */) {
  const name = faction.name || faction.faction || 'Temple';
  const id   = faction.id   || `faction.${name.toLowerCase().replace(/\s+/g, '_')}`;

  switch (event.type) {
    case 'DAMAGE_INSTITUTION':
    case 'REMOVE_INSTITUTION': {
      const kind = classifyInstitutionTarget(event.targetId);
      if (kind === 'food_storage') {
        return {
          factionId: id, factionName: name,
          stance: 'opportunity',
          response: `${name} opens public kitchens and frames the food crisis as a moral test for the community. Sermons turn pointed toward those hoarding grain.`,
          hookSeed: 'A young acolyte begs the party to escort relief carts past hostile checkpoints.',
        };
      }
      if (kind === 'religious') {
        return {
          factionId: id, factionName: name,
          stance: 'threat',
          response: `${name} treats the loss as desecration. Members demand a guilty party — preferably a rival faction. Public mourning ritual is announced.`,
          hookSeed: 'Clergy accuse a competing temple of arson with no evidence.',
        };
      }
      return {
        factionId: id, factionName: name,
        stance: 'neutral',
        response: `${name} offers prayers but takes no decisive action.`,
      };
    }

    case 'KILL_NPC':
    case 'KILL_LEADER': {
      const importance = event.payload?.importance || 'notable';
      if (importance === 'pillar' || event.type === 'KILL_LEADER') {
        return {
          factionId: id, factionName: name,
          stance: 'threat',
          response: `${name} declares public mourning. Clergy call for justice and frame the death as a sign that the gods are displeased with the current order.`,
          hookSeed: 'A junior priest claims to have witnessed something the high clergy is suppressing.',
        };
      }
      return {
        factionId: id, factionName: name,
        stance: 'neutral',
        response: `${name} performs funeral rites and continues normal services.`,
      };
    }

    case 'EXPOSE_CORRUPTION':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity',
        response: `${name} seizes the moral high ground. Sermons frame the exposed corruption as proof of the need for clerical oversight in civic affairs.`,
        hookSeed: 'A cleric quietly approaches the party with evidence of similar corruption inside the temple itself.',
      };

    case 'REFUGEE_WAVE':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity_and_threat',
        response: `${name} opens its doors and gains followers, but scarcity strains its charity reserves. The high priest navigates between mercy and overcommitment.`,
        hookSeed: 'A refugee child claims to have seen something on the road the temple wants kept quiet.',
      };

    case 'PLAGUE':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity_and_threat',
        response: `${name} performs ceaseless rites and tends the sick. Public legitimacy rises if relief works; collapses if it doesn't. Volunteers become martyrs.`,
        hookSeed: 'The temple needs a rare herb only available across a quarantine line.',
      };

    case 'RAID_OR_MONSTER_ATTACK':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity',
        response: `${name} interprets the attack as divine warning. Sermons demand spiritual discipline, and the donations basket runs hot.`,
      };

    case 'CUT_TRADE_ROUTE':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity',
        response: `${name} positions its relief networks as the new lifeline. Donations rise; so does dependency on clerical authority.`,
      };

    case 'IMPAIR_FACTION':
      // If WE'RE the impaired faction, this isn't actually a response.
      // Skip when the impaired target is the temple itself.
      if (String(event.targetId || '').toLowerCase().includes(name.toLowerCase())) return null;
      return {
        factionId: id, factionName: name,
        stance: 'opportunity',
        response: `${name} subtly maneuvers to absorb the weakened faction's followers and influence.`,
      };

    default:
      return {
        factionId: id, factionName: name,
        stance: 'neutral',
        response: `${name} watches in silence and continues its rites.`,
      };
  }
}

/**
 * Watch / Militia archetype.
 *
 * Wants:        authority, public order, professional standing, budget.
 * Fears:        corruption charges, rival militias, occupation by an
 *               external force, becoming irrelevant.
 * Leverage:     coercive capacity, gates and checkpoints, witness
 *               networks, holding cells.
 * Vulnerability: vulnerable to political shifts in the ruling order;
 *               low pay creates corruption pressure.
 */
function respondAsWatch(faction, event /* , settlement */) {
  const name = faction.name || faction.faction || 'Watch';
  const id   = faction.id   || `faction.${name.toLowerCase().replace(/\s+/g, '_')}`;

  switch (event.type) {
    case 'DAMAGE_INSTITUTION':
    case 'REMOVE_INSTITUTION': {
      const kind = classifyInstitutionTarget(event.targetId);
      if (kind === 'food_storage') {
        return {
          factionId: id, factionName: name,
          stance: 'threat',
          response: `${name} doubles patrols around remaining warehouses. Curfew is declared after dusk. Suspect lists grow without much evidence.`,
          hookSeed: 'A captain offers the party gold to identify whoever set the fire — accuracy not strictly required.',
        };
      }
      if (kind === 'law_enforcement') {
        return {
          factionId: id, factionName: name,
          stance: 'threat',
          response: `${name} reels. Surviving officers demand emergency budget and conscription powers. Order frays at the edges of town.`,
          hookSeed: 'A retired captain reaches out, claiming someone inside the watch enabled the attack.',
        };
      }
      return {
        factionId: id, factionName: name,
        stance: 'neutral',
        response: `${name} files a report and increases patrols.`,
      };
    }

    case 'EXPOSE_CORRUPTION':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity_and_threat',
        response: `${name} purges visible offenders publicly while quietly shielding the well-connected. Internal morale fractures along seniority lines.`,
        hookSeed: 'A rookie watch member begs the party for help — they have evidence pointing higher up than anyone wants to look.',
      };

    case 'KILL_LEADER':
    case 'KILL_NPC': {
      const importance = event.payload?.importance || 'notable';
      if (importance === 'pillar' || event.type === 'KILL_LEADER') {
        return {
          factionId: id, factionName: name,
          stance: 'threat',
          response: `${name} declares martial conditions. Curfew, gate searches, and house-to-house questioning. Several arrests will not stand up in court.`,
          hookSeed: 'A wrongly-accused merchant offers the party a fortune to clear their name before the watch makes the charge stick.',
        };
      }
      return {
        factionId: id, factionName: name,
        stance: 'neutral',
        response: `${name} investigates, but without urgency.`,
      };
    }

    case 'REFUGEE_WAVE':
      return {
        factionId: id, factionName: name,
        stance: 'threat',
        response: `${name} fortifies the gates and demands papers. Petty crime spikes. The captain requests reinforcements that may not come.`,
        hookSeed: 'A refugee family offers the party shelter in exchange for help getting past the watch checkpoint.',
      };

    case 'PLAGUE':
      return {
        factionId: id, factionName: name,
        stance: 'threat',
        response: `${name} enforces quarantine zones. Sick households are sealed in. Discontent rises against the harshness of the measures.`,
      };

    case 'RAID_OR_MONSTER_ATTACK':
      return {
        factionId: id, factionName: name,
        stance: 'threat',
        response: `${name} mobilizes for a counter-strike. Reservists are called up. Civilians are warned to stay indoors.`,
        hookSeed: 'The captain offers the party a contract: track the raiders to their hideout.',
      };

    case 'CUT_TRADE_ROUTE':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity_and_threat',
        response: `${name} expands its mandate to escort caravans, but the captain privately worries about overreach.`,
      };

    case 'ASSIGN_NPC_TO_ROLE':
      // Watch reacts when a captain is appointed — quality matters.
      if (event.payload?.role && /captain|commander|sheriff/.test(String(event.payload.role).toLowerCase())) {
        const q = event.payload?.quality;
        if (q === 'corrupt' || q === 'faction_captured') {
          return {
            factionId: id, factionName: name,
            stance: 'threat',
            response: `${name} grumbles internally. The new ${event.payload.role} is widely seen as bought, and several officers consider resigning.`,
            hookSeed: 'A senior officer asks the party to look into the new captain\'s background.',
          };
        }
        if (q === 'popular') {
          return {
            factionId: id, factionName: name,
            stance: 'opportunity',
            response: `${name} responds well to the new ${event.payload.role}. Morale lifts and recruits arrive in unexpected numbers.`,
          };
        }
      }
      return null;

    default:
      return {
        factionId: id, factionName: name,
        stance: 'neutral',
        response: `${name} continues its patrols.`,
      };
  }
}

/**
 * Thieves' Guild archetype.
 *
 * Wants:        monopoly on shadow economy, control of black markets,
 *               leverage over civic figures.
 * Fears:        rigorous law enforcement, public exposure, rival guilds
 *               muscling in, internal betrayal.
 * Leverage:     information networks, smuggling routes, protection
 *               rackets, blackmail material on prominent citizens.
 * Vulnerability: depends on watch corruption and on the silence of its
 *               own ranks.
 */
function respondAsThievesGuild(faction, event /* , settlement */) {
  const name = faction.name || faction.faction || 'Thieves\' Guild';
  const id   = faction.id   || `faction.${name.toLowerCase().replace(/\s+/g, '_')}`;

  switch (event.type) {
    case 'DAMAGE_INSTITUTION':
    case 'REMOVE_INSTITUTION': {
      const kind = classifyInstitutionTarget(event.targetId);
      if (kind === 'law_enforcement') {
        return {
          factionId: id, factionName: name,
          stance: 'opportunity',
          response: `${name} expands fast. Black-market goods move openly for the first time in years. Protection rackets fan out to streets that had been off-limits.`,
          hookSeed: 'A shop owner who used to be untouchable approaches the party — they\'ll pay anything for protection.',
        };
      }
      if (kind === 'food_storage') {
        return {
          factionId: id, factionName: name,
          stance: 'opportunity',
          response: `${name} stockpiles whatever grain still exists and resells it through hidden channels. Member recruitment surges among the desperate.`,
          hookSeed: 'A cell leader offers the party a cut to silence a witness who saw too much during the granary fire.',
        };
      }
      return {
        factionId: id, factionName: name,
        stance: 'opportunity',
        response: `${name} looks for angles in the disruption. Smaller scores become available; larger ones go quiet for now.`,
      };
    }

    case 'CUT_TRADE_ROUTE':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity',
        response: `${name} thrives. Smugglers become essential. Rates triple. Old debts are called in for favors at the new chokepoints.`,
        hookSeed: 'A guild fixer offers the party impossible coin to escort a caravan along the secret route.',
      };

    case 'EXPOSE_CORRUPTION':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity_and_threat',
        response: `${name} burns its bought officials and recruits replacements. Several lieutenants disappear quietly to avoid being used as scapegoats.`,
        hookSeed: 'A guild member breaks omertà — they need protection or they sing.',
      };

    case 'KILL_LEADER':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity_and_threat',
        response: `${name} watches who steps into the vacancy. If a rival faction maneuvers, the guild recruits its own candidate and quietly funds them. Internal succession also stirs.`,
        hookSeed: 'A guild contact wants the party to make sure a specific candidate becomes the next watch captain.',
      };

    case 'REFUGEE_WAVE':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity',
        response: `${name} recruits from the desperate. Pickpocket rings expand overnight. Some refugees are coerced into paying off impossible "transit fees."`,
        hookSeed: 'A refugee elder asks the party to help free a young relative from the guild\'s grip.',
      };

    case 'PLAGUE':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity_and_threat',
        response: `${name} smuggles medicine — for a price. Some members refuse to enter quarantine zones; others charge double to do so.`,
      };

    case 'RAID_OR_MONSTER_ATTACK':
      return {
        factionId: id, factionName: name,
        stance: 'opportunity',
        response: `${name} loots quietly through the chaos. Caches stashed years ago are quietly relocated.`,
      };

    case 'ASSIGN_NPC_TO_ROLE':
      if (event.payload?.quality === 'corrupt' || event.payload?.quality === 'faction_captured') {
        return {
          factionId: id, factionName: name,
          stance: 'opportunity',
          response: `${name} celebrates quietly. The new appointment is theirs, or theirs to manipulate.`,
        };
      }
      return null;

    case 'IMPAIR_FACTION':
      // Rivals' weakness is our opportunity.
      if (String(event.targetId || '').toLowerCase().includes(name.toLowerCase())) return null;
      return {
        factionId: id, factionName: name,
        stance: 'opportunity',
        response: `${name} moves to absorb the weakened faction's territory and contacts.`,
      };

    default:
      return {
        factionId: id, factionName: name,
        stance: 'neutral',
        response: `${name} watches and waits.`,
      };
  }
}

// ── helpers shared with registry's classification ──────────────────────────

function classifyInstitutionTarget(targetId) {
  const n = String(targetId || '').toLowerCase();
  if (/granary|mill|silo|storage|warehouse/.test(n))           return 'food_storage';
  if (/temple|cathedral|shrine|monastery|church/.test(n))      return 'religious';
  if (/watch|garrison|barracks|militia|guard/.test(n))         return 'law_enforcement';
  if (/market|bazaar|exchange|trade hall/.test(n))             return 'trade';
  return 'other';
}

function labelOf(targetId) {
  if (!targetId) return 'institution';
  const tail = String(targetId).split('.').pop();
  return tail.replace(/^[a-z]/, c => c.toUpperCase()).replace(/_/g, ' ');
}
