/**
 * power/factionStanding.js — append relative-standing prose to each faction's
 * description based on its rank and the specific rivalries present (merchant vs
 * craft, thieves vs guard, noble vs merchant, clergy vs arcane, …).
 */

import { powerNameWithArticle, powerSentenceName } from '../../domain/display/powerSentenceName.js'; // NAMES-1 (CN1): a power named in a standing sentence takes its article
import { pluralPowerName } from '../../domain/display/governanceAccount.js';
import { powerLabelOf, seatHolderApartOf, seatHolderLineOf, seatHolderLinesOf, seatHolderRelationLineOf } from '../factionDynamics.js'; // SEAT-10 U6 (CS12, W3): the holder apart, and its line
import { seatIsCouncil, withoutSeatAccess } from './claimStanding.js';
import { STRESS_POWER_FACES } from '../../data/stressPowerFaces.js';
import { coupContenders, coupRiskLabel } from '../../domain/rulingPowerCoup.js';
import { inferFactionCategory } from './factionCategories.js';
import { isCriminalPower } from '../../domain/people/allegiance.js';
import { seatsByHolder } from '../../domain/seat/seatLaw.js'; // SEAT-10 U6 (E65): the final-record pass reads the record's own law

// BAR8-K-POWERS (rule 13g, the audit's C21547; BRIEF-BAR8 K-POWERS 1): THE GUARD AND THE GUILD'S NOTE READS THEIR TIE. Where
// the governing seat is itself a criminal power (a purchased council: "Shadow Senate", "Corrupt Council"), the hall-capture
// state is corrupted or worse by its one writer's own rule (`domain/people/hallCapture.js :: hallCaptureOf`: a criminal
// ruler is corrupted), and the relation rows the page prints say so ("<guild> has bought key people in <seat>", "<guard>
// and <guild> have a working arrangement ... Certain arrests never happen": `factionDynamics.js :: govCriminalRelation`,
// `criminalMilitaryRelation`). There the notes that make the tie a contest of arrests ("A slow war with the guild", "the
// garrison can arrest their people", "enough to keep it down") are not written; the notes of bribes and payrolls stand.
// Read as the hall's writer reads its ruler (`allegiance.js :: isCriminalPower`), on the kind the roster's names give
// (`inferFactionCategory`; stored and inferred agree on every criminal power of the 750), so the power step and the roster's re-settlement (`rosterText.js :: standingsOf`) write the same sentence.
/** @param {ReadonlyArray<{ faction: string, isGoverning?: boolean }>} factions @returns {boolean} the governing seat is a criminal power */
const seatBoughtOf = (factions) => factions.some((f) => f.isGoverning && isCriminalPower({ faction: f.faction, category: inferFactionCategory(f.faction) }));

// BAR4-HISTORY C14176 (the chair's ruling FS2 of 2026-11-16, vetoable by the owner): A POWER THAT COULD TAKE THE SEAT IS NOT
// "TOO FAR BEHIND". The rank-1 line said "behind <seat> by too much to challenge openly" (or "too far behind to lead") beside
// the seat's own coup reading "Contested" (the challenger outweighs the gated incumbent: `rulingPowerCoup.js ::
// coupRiskLabel`). The callers hand the seat's legitimacy; the coup's own reader (`coupContenders`) reads the roster with it;
// the rank-1 power that is its first challenger takes this line. VETOABLE wording (the owner's).
export const SEAT_CONTESTED_STANDING = 'Close enough now to contest the seat, and they know it.';

// BAR2-PEOPLE (PP10, the chair's ruling of 2026-11-15, vetoable by the owner): A POWER SENT IN BY AN OCCUPATION DECIDES. The
// ladder's rank lines say a power below the first bargains, petitions or waits ("Behind <top> by too much to challenge openly,
// so they get their way through petitions and procedure", "in the shadow of", "their support is worth buying"); the occupier
// (stressPowerFaces.js's appointed row) is outnumbered on the roster yet gives the orders (factionDynamics.js: the hall
// "carries out what" it "decides"). Below the first, it takes its own line, which says that one fact.
/** @param {{ faction?: string }} f @returns {boolean} the power is an occupation's appointed one */
const isAppointedOccupier = (f) => STRESS_POWER_FACES.some((row) => row.appointed && row.power === f.faction);
/** @param {{ faction: string } | undefined} gov @returns {string} the occupier's standing line, its hall named as the relation line names it */
const occupierStanding = (gov) => {
  if (!gov) return 'It does not bargain for its way: what it decides is carried out, whatever its numbers.';
  const said = powerNameWithArticle(gov.faction);
  return `It does not bargain for its way: ${said} ${pluralPowerName(said) ? 'carry' : 'carries'} out what it decides, whatever its numbers.`;
};

// TAIL-POWERS batch 2 (the chair's ruling P1 of 2026-11-14): a standing sentence reads the strength of the power it names. A
// craft guild the card prints as Minor or Suppressed is not "close behind, contesting every ... decision" nor "running close
// behind ... in a sustained dispute": it takes the line its ladder already prints for a guild outpaced by the merchants.
/** @param {{ power?: number }} f @returns {boolean} the power's label is Minor or Suppressed */
const isWeakPower = (f) => ['Minor', 'Suppressed'].includes(powerLabelOf(f.power));
// TAIL-POWERS-B-3 batch 7 (row 20053; P1, P3): the faith's card says "The arcane orders have more say" of the FIRST arcane
// power on the roster; where that is a governing Arcane Council, the Arcane Orders may stand behind the clergy (their own card
// says so: 7 of the 17 towns at 4ff449a7b). The line names the rival it read, by its prose form and its number.
/** @param {{ faction: string }} rival @returns {string} */
const arcaneAheadSaid = (rival) => // TAIL-CLOSE-SRC-4 (SR4): named as its card names it, by the one grammar reader, as every power is
  powerNameWithArticle(rival.faction, true) + (pluralPowerName(powerSentenceName(rival.faction)) ? ' have' : ' has');

// BAR6-POWERS (LAW 10f-weight, the audit's C110252, the chair's 10/c): the nobles' card said "The merchant guilds now have more
// say" of the FIRST power whose name holds "Merchant", which may be the ruling Grand Merchant Oligarchy while the Merchant Guilds
// stand Suppressed beneath the nobles: the clause names the power it weighed, in arcaneAheadSaid's form.
/** @param {{ faction: string }} rival @returns {string} */
const merchantAheadSaid = (rival) => arcaneAheadSaid(rival);

// annotateFactionStanding — enrich faction descriptions with their position in
// the (already normalised and sorted) power ranking (mutates in place).
/** The number of level powers, as the standing line says it (TAIL-POWERS-B-4, P31 (4)); past six, "Many". */
const LEVEL_COUNT_WORDS = Object.freeze(['', '', '', 'Three', 'Four', 'Five', 'Six', 'Many']);

/**
 * THE STANDING LADDER'S RANK LINES (rank 1, rank 2, the last rank), lifted from `annotateFactionStanding` BYTE-IDENTICAL
 * (SEAT-10 U6, the chair's E70 (a)): each row is its sentence's fixed parts, a name or a word between each pair. The ladder
 * writes from them and the final-record pass (`settleSeatHolderToRecord`) reads them (`RANK_STANDINGS`), so the two can
 * never drift: a reworded line is reworded for both. `level` opens on "Three", which the ladder replaces with its count word ("Three"…"Many"), as before.
 * @enforced-by tests/generators/seat/seatHolderLines.test.js (the ladder's totality arm)
 */
export const LADDER = Object.freeze({
  gapNarrow: Object.freeze(['The gap between them and ', ' is narrow. A single shift in patronage, scandal, or armed muscle could swap their positions.']),
  noOneLeads: Object.freeze(['No one clearly leads here; one scandal or one lost ally could change who does.']),
  contested: Object.freeze([SEAT_CONTESTED_STANDING]),
  shadow: Object.freeze(['They operate in the shadow of ', ', close enough to matter and too far behind to lead.']),
  resist: Object.freeze(['They are strong enough to resist those above them, but too far behind to risk an open fight.']),
  behind: Object.freeze(['Behind ', ' by too much to challenge openly, so they get their way through petitions and procedure instead.']),
  settled: Object.freeze(['The order is settled for now; they are busy holding on to second place and make no move on first.']),
  level: Object.freeze(['Three powers stand almost level here, and no one leads; every ', ' has to be bargained for.']),
  atTable: Object.freeze(['They are always at the table, but cannot set their own terms.']),
  worthBuying: Object.freeze(['Close enough to the two above that their support is worth buying; they play ', ' and ', ' against each other when they can.']),
  fewMatters: Object.freeze(['They have a say on only a few matters; on everything else they side with whoever will deal with them that week.']),
});

export const annotateFactionStanding = (factions, force = { body: 'garrison' }, seat = null) => { // F1: `force` is `defenseFacts.js :: forceWordsOf`, the garrison's words by default
      var factionNames = factions.map(function (f) {
          return f.faction;
        }),
        hasFaction = function (keyword) {
          return factionNames.some(function (name) {
            return name.toLowerCase().includes(keyword.toLowerCase());
          });
        },
        topFactionName = factions[0] ? factions[0].faction : null,
        // SEAT-1 U4 (CS3): the partial settlement hands the law its seat carries (`seat.config`), or none, and then the coup's
        // reader reads the OLD law (fail closed): under the seat law the power that holds the seat is no challenger of it.
        seatReading = seat ? coupContenders(/** @type {any} */ ({ powerStructure: { factions, publicLegitimacy: seat.publicLegitimacy }, ...(seat.config ? { config: seat.config } : {}) })) : null, // BAR4-HISTORY C14176 (FS2)
        contestedBy = seatReading && coupRiskLabel(seatReading) === 'Contested' ? (seatReading.challengers[0]?.name ?? null) : null;
      // SEAT-10 U6 (CS12, W3): under the seat law, the holder apart from the form says it holds the form's seat, in place of the
      // rank line that sets it below the seat ("in the shadow of", "The gap between them", "Behind"); absent the born config, none
      var apart = seat && seat.config ? seatHolderApartOf(factions, seat.config) : null,
        holderStanding = apart ? seatHolderLineOf('standing', apart) : null;
      // POWERS-16 (the chair's ruling (r2)): a power named in a standing sentence takes its prose form, from one leaf
      var topSaid = topFactionName ? powerNameWithArticle(topFactionName) : null;
      factions[1] && factions[1].faction;
      // TAIL-POWERS-B-4 (the chair's P31 (4), vetoable by the owner): "Three powers stand almost level ... no one leads" reads the
      // roster: the powers level with the first are those within five of it AT ITS OWN RUNG of the ladder (powerLabelOf), so a
      // Significant power over Minor ones is no level, and their number is said (four or five where they stand so)
      var levelCount = factions.filter(function (f) {
        return factions[0] && factions[0].power - f.power <= 5 && powerLabelOf(f.power) === powerLabelOf(factions[0].power);
      }).length;
      var topPower = factions[0] ? factions[0].power : 0,
        secondPower = factions[1] ? factions[1].power : 0,
        topTwoGap = topPower - secondPower,
        hasMerchant = hasFaction('Merchant'),
        hasCraftGuild = hasFaction('Craft Guild'),
        hasThieves = hasFaction('Thieves'),
        hasMilitary = hasFaction('Military') || hasFaction('Guard'),
        hasNobility =
          hasFaction('Manor Household') ||
          hasFaction('Landed Gentry') ||
          hasFaction('Noble Famil') ||
          hasFaction('Great Famil') ||
          hasFaction('Noble House'),
        hasFeudalSteward = hasFaction('Feudal Stewardship') || hasFaction('Feudal Appointee'),
        hasReligious = hasFaction('Religious Authorities'),
        hasArcane = hasFaction('Arcane Orders'),
        seatBought = seatBoughtOf(factions); // BAR8-K-POWERS (13g)
      factions.forEach(function (faction, rank) {
        var power = faction.power,
          factionName = faction.faction,
          nameLower = factionName.toLowerCase(),
          higherNeighbor = rank > 0 ? factions[rank - 1] : null,
          lowerNeighbor = rank < factions.length - 1 ? factions[rank + 1] : null,
          gapAbove = higherNeighbor ? higherNeighbor.power - power : 0,
          gapBelow = lowerNeighbor ? power - lowerNeighbor.power : 99,
          standing = '';
        if (
          (rank === 1 &&
            !faction.isGoverning &&
            (holderStanding && apart && faction === apart.holder
              ? (standing = holderStanding)
              : topTwoGap <= 6
              ? (standing = topFactionName
                  ? LADDER.gapNarrow[0] +
                    (topFactionName && factions[0].isGoverning && topFactionName.toLowerCase().includes('council') ? 'the governing council' : topSaid) +
                    LADDER.gapNarrow[1]
                  : LADDER.noOneLeads[0])
              : contestedBy && factionName === contestedBy && factions[0] && factions[0].isGoverning
                ? (standing = LADDER.contested[0])
              : topTwoGap <= 14
                ? (standing = topFactionName
                    ? LADDER.shadow[0] +
                      (topFactionName && factions[0].isGoverning && topFactionName.toLowerCase().includes('council') ? 'the governing council' : topSaid) +
                      LADDER.shadow[1] // BAR3-POWERS (C45570): no grudge the pair's relation row may deny ("symbiotic, stable")
                    : LADDER.resist[0])
                : (standing = topFactionName
                    ? LADDER.behind[0] +
                      (topFactionName && factions[0].isGoverning && topFactionName.toLowerCase().includes('council') ? 'the governing council' : topSaid) +
                      LADDER.behind[1]
                    : LADDER.settled[0])),
          rank === 2 &&
            (gapAbove <= 5 && gapBelow <= 5
              ? (standing = topTwoGap <= 5 && levelCount >= 3
                  ? `${LADDER.level[0]}${seatIsCouncil(factions.find((x) => x.isGoverning)?.faction) ? 'council vote' : 'decision'}${LADDER.level[1]}`.replace(/^Three/, LEVEL_COUNT_WORDS[Math.min(levelCount, LEVEL_COUNT_WORDS.length - 1)]) // TAIL-POWERS-B: a vote only where a council sits; TAIL-POWERS-B-4: their number
                  : LADDER.atTable[0])
              : gapAbove <= 10
                ? (standing =
                    LADDER.worthBuying[0] +
                    (higherNeighbor ? powerNameWithArticle(higherNeighbor.faction) : 'the second power') +
                    LADDER.worthBuying[1] +
                    (factions[0] ? powerNameWithArticle(factions[0].faction) : 'the leading power') +
                    LADDER.worthBuying[2])
                : (standing =
                    LADDER.atTable[0])),
          rank === factions.length - 1 &&
            power < 7 &&
            gapAbove >= 5 &&
            (standing =
              LADDER.fewMatters[0]),
          hasMerchant && hasCraftGuild)
        ) {
          if (nameLower.includes('merchant')) {
            var craftGuildRival = factions.find(function (member) {
              return member.faction.includes('Craft Guild');
            });
            if (craftGuildRival) {
              var craftGuildNote =
                craftGuildRival.power > power
                  ? 'The craft guilds currently carry more weight than they do, and the merchants are working to change that.'
                  : craftGuildRival.power > power - 8 && !isWeakPower(craftGuildRival)
                    ? 'The craft guilds are close behind, contesting every pricing and quality-standard decision they try to push through council.'
                    : 'The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not.';
              standing = standing ? standing + ' ' + craftGuildNote : craftGuildNote;
            }
          }
          if (nameLower.includes('craft guild')) {
            var merchantRival = factions.find(function (member) {
              return member.faction.includes('Merchant');
            });
            if (merchantRival) {
              var merchantNote =
                merchantRival.power > power + 8 || (merchantRival.power > power && isWeakPower(faction))
                  ? 'The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal.'
                  : merchantRival.power > power && !isWeakPower(faction)
                    ? 'Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods.'
                    : 'Ahead of the merchant guilds in current influence: an unusual position they intend to hold.';
              standing = standing ? standing + ' ' + merchantNote : merchantNote;
            }
          }
        }
        if (hasThieves && hasMilitary) {
          if (nameLower.includes('thieves')) {
            var guardRival = factions.find(function (member) {
              return member.faction.toLowerCase().includes('military') || member.faction.toLowerCase().includes('guard');
            });
            if (guardRival) {
              var thievesGuardNote =
                guardRival.power > power + 10
                  ? `The ${force.body} is far stronger. They survive by bribing the lower ranks and making it costly to arrest the wrong people.`
                  : guardRival.power < power - 10
                    ? 'They have more real pull than the military right now: officers on their payroll, and commanders who know better than to ask questions.'
                    : seatBought ? '' // BAR8-K-POWERS (13g): no contest of arrests where the guild has bought the seat
                    : `They are roughly even with the military: the ${force.body} can arrest their people, and the guild can make every investigation costly.`;
              if (thievesGuardNote) standing = standing ? standing + ' ' + thievesGuardNote : thievesGuardNote;
            }
          }
          if (nameLower.includes('military') || nameLower.includes('guard')) {
            var thievesRival = factions.find(function (member) {
              return member.faction.toLowerCase().includes('thieves');
            });
            if (thievesRival) {
              var guardThievesNote =
                thievesRival.power > power + 10
                  ? 'The guild is stronger than they are. They can only make arrests where it is safe to, and everyone knows it.'
                  : seatBought ? '' // BAR8-K-POWERS (13g): the relation row says the working arrangement; no war, no keeping it down
                  : thievesRival.power < power - 10
                    ? 'They are stronger than the guild, enough to keep it down but not to stamp it out.'
                    : 'A slow war with the guild: arrests are made, the gangs rebuild, deals are struck and quietly broken.';
              if (guardThievesNote) standing = standing ? standing + ' ' + guardThievesNote : guardThievesNote;
            }
          }
        }
        if (hasMerchant && hasThieves && nameLower.includes('merchant')) {
          var thievesRivalForMerchant = factions.find(function (member) {
            return member.faction.toLowerCase().includes('thieves');
          });
          if (thievesRivalForMerchant && thievesRivalForMerchant.power > 10) {
            var merchantThievesNote =
              thievesRivalForMerchant.power > power
                ? 'The criminal network reaches further than the merchant guilds right now. Some merchants are paying for protection; others have become silent partners.'
                : "They tolerate the guild's cut because fighting it costs more than paying it, and nobody says so aloud.";
            standing = standing ? standing + ' ' + merchantThievesNote : merchantThievesNote;
          }
        }
        if (
          hasNobility &&
          hasMerchant &&
          (nameLower.includes('manor') ||
            nameLower.includes('landed gentry') ||
            nameLower.includes('noble famil') ||
            nameLower.includes('great famil') ||
            nameLower.includes('noble house'))
        ) {
          var merchantRivalForNoble = factions.find(function (member) {
            return member.faction.includes('Merchant');
          });
          if (merchantRivalForNoble) {
            var nobleMerchantNote =
              merchantRivalForNoble.power > power + 12
                ? (merchantRivalForNoble.faction === 'Merchant Guilds' ? 'The merchant guilds now have more say' : merchantAheadSaid(merchantRivalForNoble) + ' more say now') + ': the noble families keep their titles, their land and their precedence, but the money has moved.' // BAR6-POWERS (10f-weight, C110252): it names the power it weighed (the old words, byte for byte, where that is the Merchant Guilds)
                : merchantRivalForNoble.power > power
                  ? 'The merchants are closing the gap, and the noble families are using every law and every social tie they have to slow them down.'
                  : 'Still ahead of merchant interests in real influence, for now. They know the gap is narrowing and are arranging marriages accordingly.';
            standing = standing ? standing + ' ' + nobleMerchantNote : nobleMerchantNote;
          }
        }
        if (hasFeudalSteward && hasNobility && (nameLower.includes('manor household') || nameLower.includes('landed gentry'))) {
          var stewardRival = factions.find(function (member) {
            return (
              (member.faction.includes('Feudal Stewardship') || member.faction.includes('Feudal Appointee')) &&
              member.faction !== faction.faction
            );
          });
          if (stewardRival) {
            var stewardVariant = Math.floor(power * 7 + stewardRival.power * 3) % 3,
              stewardNote =
                stewardRival.power > power + 10
                  ? stewardVariant === 0
                    ? "The steward rules in the lord's name, and the household is where that right comes from, but who signs what has become a tangle."
                    : 'The steward runs things day to day; the household gives the steward the right to. When a petitioner finds one of them more willing than the other, the line between them blurs.'
                  : stewardRival.power < power - 10
                    ? stewardVariant === 0
                      ? 'They hold more direct influence than the steward appointed to govern in their name, which raises questions about why the steward exists at all.'
                      : 'The steward governs in name, but gives way to them more often than was ever intended.'
                    : stewardVariant === 0
                      ? 'They and the steward both claim the same authority, so petitioners go to whichever is likelier to say yes.'
                      : stewardVariant === 1
                        ? 'The steward and the household have worked out who does what, but they bargain it again whenever something important is at stake.'
                        : 'Which one actually governs depends on the day and the question; each would say it does.'; // COHERENCE-POWERS-8 (round three #565): the clause read whole
            standing = standing ? standing + ' ' + stewardNote : stewardNote;
          }
        }
        if (hasReligious && hasArcane) {
          if (nameLower.includes('religious')) {
            var arcaneRival = factions.find(function (member) {
              return member.faction.toLowerCase().includes('arcane');
            });
            if (arcaneRival) {
              var religiousArcaneNote =
                arcaneRival.power > power
                  ? arcaneAheadSaid(arcaneRival) + ' more say right now, and the clergy cannot accept it.'
                  : "The arcane orders are present but operate in the clergy's shadow. Questions of what is sanctioned magic and what is heresy remain deliberately unresolved.";
              standing = standing ? standing + ' ' + religiousArcaneNote : religiousArcaneNote;
            }
          }
          if (nameLower.includes('arcane')) {
            var religiousRival = factions.find(function (member) {
              return member.faction.toLowerCase().includes('religious');
            });
            if (religiousRival) {
              var arcaneReligiousNote =
                religiousRival.power > power
                  ? 'The clergy have more say in public affairs, so the arcane orders work around them and never challenge them openly.'
                  : 'Ahead of the religious authorities in current influence, which they hold carefully: too much visible power invites accusations that they prefer to avoid.';
              standing = standing ? standing + ' ' + arcaneReligiousNote : arcaneReligiousNote;
            }
          }
        }
        if (hasReligious && hasThieves && nameLower.includes('religious')) {
          var thievesRivalForReligious = factions.find(function (member) {
            return member.faction.toLowerCase().includes('thieves');
          });
          if (thievesRivalForReligious && thievesRivalForReligious.power > 10) {
            var religiousThievesNote =
              thievesRivalForReligious.power > power
                ? 'The criminal network is stronger than they are. The clergy preach against it loudly, and few people listen.'
                : 'They denounce the guild from the pulpit; the guild gives openly to the poor and makes the denunciations look selective.' // TAIL-POWERS-B (22709): no charity house the town may not hold;
            standing = standing ? standing + ' ' + religiousThievesNote : religiousThievesNote;
          }
        }
        if (hasMilitary && hasReligious && (nameLower.includes('military') || nameLower.includes('guard'))) {
          var religiousRivalForGuard = factions.find(function (member) {
            return member.faction.toLowerCase().includes('religious');
          });
          if (religiousRivalForGuard && Math.abs(religiousRivalForGuard.power - power) < 10) {
            var guardReligiousNote =
              `They and the religious authorities both keep people in line. The ${force.body} deals with bodies and the clergy with minds, and each wishes the other would keep quieter.`;
            standing = standing ? standing + ' ' + guardReligiousNote : guardReligiousNote;
          }
        }
        if (rank > 0 && !faction.isGoverning && isAppointedOccupier(faction)) standing = occupierStanding(factions.find((f) => f.isGoverning)); // BAR2-PEOPLE (PP10)
        standing && (faction.desc = faction.desc ? faction.desc + ' ' + standing : standing);
      });
};

/**
 * THE RANK LINES the standing ladder above writes (rank 1, rank 2, the last rank), read back on the final record from the
 * ladder's own table (`LADDER`; the chair's E70 (a)): a holder's row says it holds the seat in place of whichever of them it
 * carries (E65 (2): W3 at ANY rank). A name or a word sits between each pair of fixed parts, never across a sentence's end.
 */
const escapeText = (/** @type {string} */ t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** `level` opens on the count word the ladder sets in place of "Three", so its pattern opens on a word; every other slot is a name (no full stop in it). */
export const RANK_STANDINGS = Object.freeze(Object.entries(LADDER).map(([key, parts]) => new RegExp(parts.map(escapeText).join('[^.]+?')
  .replace(key === 'level' ? /^Three/ : /^$/, '\\b\\w+'))));

/**
 * THE FINAL-RECORD PASS (SEAT-10 U6, the chair's E65 of 2026-11-22): where the holder is known only on the final record (R2,
 * the person's first power, cast after the power step), the form<->holder rows take W1 (and W2 on a licensed pair), the
 * holder's row takes W3 in place of its rank line at any rank (one row a seat; appended where it carries none), and its
 * "expect council access" clause is cut. The same gate as the power step (`factionDynamics.js :: seatHolderApartOf`, the
 * record handed): the seat law off the record's own config, the holder apart, not veiled. Under law 1 it returns before it
 * reads anything else. Keyed picks only (`seatHolderLineOf`): it draws nothing from the stream. Mutates in place, as
 * `claimStanding.js :: settleArcaneToPractitioners` beside it does; it runs before `withConflictRelations` reads the rows.
 * A W3 on any other row (a density-law rival's copy of its host) is cut.
 * @param {Record<string, any> | null | undefined} record the final settlement record
 */
export function settleSeatHolderToRecord(record) {
  const ps = record?.powerStructure;
  if (!ps || !Array.isArray(ps.factions) || !seatsByHolder(record)) return;
  const apart = seatHolderApartOf(ps.factions, record, record);
  // ONE ROW A SEAT: a W3 the power step wrote on a row that is not the final holder (a density-law rival minted as a copy
  // of its host carries its host's sentence) is cut, never reworded; no word is authored
  const form = ps.factions.find((f) => f?.isGoverning);
  if (form) {
    for (const f of ps.factions) {
      if (!f || f === apart?.holder || typeof f.desc !== 'string') continue;
      for (const line of seatHolderLinesOf('standing', { form, holder: f })) if (f.desc.includes(line)) f.desc = f.desc.replace(` ${line}`, '').replace(line, '').trim();
    }
  }
  if (!apart) return;
  const seed = record?._seed; // the record's seed: the stream is spent by now, so the key reads the seed the record carries
  const relation = seatHolderRelationLineOf(apart, seed);
  for (const row of Array.isArray(ps.factionRelationships) ? ps.factionRelationships : []) {
    if (row && Array.isArray(row.pair) && row.pair.includes(apart.form.faction) && row.pair.includes(apart.holder.faction)) row.narrative = relation;
  }
  const own = seatHolderLineOf('standing', apart, seed);
  const desc = withoutSeatAccess(String(apart.holder.desc || ''));
  // one row a seat: the power step's W3 (drawn off the step's stream seed) gives way to the record's, else the rank line, else appended
  const written = seatHolderLinesOf('standing', apart).find((line) => desc.includes(line));
  const rankLine = RANK_STANDINGS.find((re) => re.test(desc));
  apart.holder.desc = written ? desc.replace(written, own) : rankLine ? desc.replace(rankLine, own) : desc ? `${desc} ${own}` : own;
}
