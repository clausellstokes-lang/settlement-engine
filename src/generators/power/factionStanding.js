/**
 * power/factionStanding.js — append relative-standing prose to each faction's
 * description based on its rank and the specific rivalries present (merchant vs
 * craft, thieves vs guard, noble vs merchant, clergy vs arcane, …).
 */

// annotateFactionStanding — enrich faction descriptions with their position in
// the (already normalised and sorted) power ranking (mutates in place).
export const annotateFactionStanding = (factions, force = { body: 'garrison' }) => { // F1: `force` is `defenseFacts.js :: forceWordsOf`, the garrison's words by default
      var factionNames = factions.map(function (f) {
          return f.faction;
        }),
        hasFaction = function (keyword) {
          return factionNames.some(function (name) {
            return name.toLowerCase().includes(keyword.toLowerCase());
          });
        },
        topFactionName = factions[0] ? factions[0].faction : null;
      factions[1] && factions[1].faction;
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
        hasArcane = hasFaction('Arcane Orders');
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
            (topTwoGap <= 6
              ? (standing = topFactionName
                  ? 'The gap between them and ' +
                    (topFactionName && factions[0].isGoverning && topFactionName.toLowerCase().includes('council') ? 'the governing council' : topFactionName) +
                    ' is narrow. A single shift in patronage, scandal, or armed muscle could swap their positions.'
                  : 'No one clearly leads here; one scandal or one lost ally could change who does.')
              : topTwoGap <= 14
                ? (standing = topFactionName
                    ? 'They operate in the shadow of ' +
                      (topFactionName && factions[0].isGoverning && topFactionName.toLowerCase().includes('council') ? 'the governing council' : topFactionName) +
                      ' but not comfortably: they are waiting for a chance to push back.'
                    : 'They are strong enough to resist those above them, but too far behind to risk an open fight.')
                : (standing = topFactionName
                    ? 'Behind ' +
                      (topFactionName && factions[0].isGoverning && topFactionName.toLowerCase().includes('council') ? 'the governing council' : topFactionName) +
                      ' by too much to challenge openly, so they get their way through petitions and procedure instead.'
                    : 'The order is settled for now; they are busy holding on to second place and make no move on first.')),
          rank === 2 &&
            (gapAbove <= 5 && gapBelow <= 5
              ? (standing =
                  'Three powers stand almost level here, and no one leads; every council vote has to be bargained for.')
              : gapAbove <= 10
                ? (standing =
                    'Close enough to the two above that their support is worth buying; they play ' +
                    (higherNeighbor ? higherNeighbor.faction : 'the second power') +
                    ' and ' +
                    (factions[0] ? factions[0].faction : 'the leading power') +
                    ' against each other when they can.')
                : (standing =
                    'They are always at the table, but cannot set their own terms.')),
          rank === factions.length - 1 &&
            power < 7 &&
            gapAbove >= 5 &&
            (standing =
              'They have a say on only a few matters; on everything else they side with whoever will deal with them that week.'),
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
                  : craftGuildRival.power > power - 8
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
                merchantRival.power > power + 8
                  ? 'The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal.'
                  : merchantRival.power > power
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
                    : `They are roughly even with the military: the ${force.body} can arrest their people, and the guild can make every investigation costly.`;
              standing = standing ? standing + ' ' + thievesGuardNote : thievesGuardNote;
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
                  : thievesRival.power < power - 10
                    ? 'They are stronger than the guild, enough to keep it down but not to stamp it out.'
                    : 'A slow war with the guild: arrests are made, the gangs rebuild, deals are struck and quietly broken.';
              standing = standing ? standing + ' ' + guardThievesNote : guardThievesNote;
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
                ? 'The merchant guilds now have more say: the noble families keep their titles, their land and their precedence, but the money has moved.'
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
                        : 'Which one actually governs depends on the day and the question; both would say themselves.';
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
                  ? 'The arcane orders have more say right now, and the clergy cannot accept it.'
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
                : 'They denounce the guild from the pulpit; the guild funds two charitable institutions and makes the denunciations look selective.';
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
        standing && (faction.desc = faction.desc ? faction.desc + ' ' + standing : standing);
      });
};
