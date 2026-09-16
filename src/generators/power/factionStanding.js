/**
 * power/factionStanding.js — append relative-standing prose to each faction's
 * description based on its rank and the specific rivalries present (merchant vs
 * craft, thieves vs guard, noble vs merchant, clergy vs arcane, …).
 */

// annotateFactionStanding — enrich faction descriptions with their position in
// the (already normalised and sorted) power ranking (mutates in place).
export const annotateFactionStanding = (factions) => {
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
                    (topFactionName && topFactionName.toLowerCase().includes('council') ? 'the governing council' : topFactionName) +
                    ' is narrow — a single shift in patronage, scandal, or armed muscle could swap their positions.'
                  : 'The dominant order is genuinely contested; a single shift in circumstance could reorder everything.')
              : topTwoGap <= 14
                ? (standing = topFactionName
                    ? 'They operate in the shadow of ' +
                      (topFactionName && topFactionName.toLowerCase().includes('council') ? 'the governing council' : topFactionName) +
                      ' but not comfortably — they are watching for leverage, not deferring.'
                    : 'Close enough to the top to resist, far enough behind to be cautious.')
                : (standing = topFactionName
                    ? 'Behind ' +
                      (topFactionName && topFactionName.toLowerCase().includes('council') ? 'the governing council' : topFactionName) +
                      ' by enough margin that direct challenge is not viable — they route their influence through procedure, not confrontation.'
                    : 'The hierarchy is settled for now; their energy goes into consolidating second place, not chasing first.')),
          rank === 2 &&
            (gapAbove <= 5 && gapBelow <= 5
              ? (standing =
                  'Genuinely three-way territory — no faction has decisively broken from the pack; every council vote is negotiated.')
              : gapAbove <= 10
                ? (standing =
                    'Close enough to the two above that their support is worth buying; they play ' +
                    (higherNeighbor ? higherNeighbor.faction : 'the second faction') +
                    ' and ' +
                    (factions[0] ? factions[0].faction : 'the top faction') +
                    ' against each other when they can.')
                : (standing =
                    'A reliable third presence — too significant to exclude from negotiations, not strong enough to set their own terms.')),
          rank === factions.length - 1 &&
            power < 7 &&
            gapAbove >= 5 &&
            (standing =
              'Their leverage is narrow and issue-specific; on broader questions they follow whoever is willing to deal with them that week.'),
          hasMerchant && hasCraftGuild)
        ) {
          if (nameLower.includes('merchant')) {
            var craftGuildRival = factions.find(function (member) {
              return member.faction.includes('Craft Guild');
            });
            if (craftGuildRival) {
              var craftGuildNote =
                craftGuildRival.power > power
                  ? 'The craft guilds currently outweigh them in raw political numbers — an uncomfortable inversion the merchants are working to correct.'
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
                  ? 'The merchants consistently outvote them on pricing and labour standards — craft masters have learned to attach riders to deals rather than fight directly.'
                  : merchantRival.power > power
                    ? 'Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods.'
                    : 'Ahead of the merchant guilds in current influence — an unusual position they intend to hold.';
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
                  ? 'The garrison outweighs them institutionally — they survive by corrupting the lower ranks and making enforcement selectively unprofitable.'
                  : guardRival.power < power - 10
                    ? 'They currently outflank the military in real leverage; there are officers on payroll and commanders who know better than to ask questions.'
                    : 'Running roughly even with the military in actual influence — the garrison can arrest individuals, the guild can make the investigation expensive.';
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
                  ? 'The guild has more real leverage than they do — selective enforcement is the only tool that still works, and everyone knows it.'
                  : thievesRival.power < power - 10
                    ? 'They outmatch the guild institutionally, which keeps the criminal operation suppressed rather than eliminated — there is a difference.'
                    : 'Running a slow institutional war with the guild: arrests happen, networks rebuild, deals are struck and quietly violated.';
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
                ? 'The criminal network has more operational reach than the merchant guilds right now — some merchants are paying protection; others have become silent partners.'
                : "They tolerate the guild's cut because fighting it costs more than paying it; the arrangement is not advertised.";
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
                ? 'The merchant guilds now hold more functional leverage — the noble families retain title, hereditary land, and social precedence, but the money has moved.'
                : merchantRivalForNoble.power > power
                  ? 'The merchants are closing the gap; the noble families are using every legal and social mechanism to slow a transition that looks increasingly inevitable.'
                  : 'Still ahead of merchant interests in real influence — for now. They know the gap is narrowing and are arranging marriages accordingly.';
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
                    ? "The steward administers in the lord's name — the household is the source of that authority, not a rival to it, but the practical question of who signs what has become genuinely complicated."
                    : 'The steward holds the day-to-day authority; the household provides the legitimacy. In practice the line between them blurs whenever a petitioner finds one more receptive than the other.'
                  : stewardRival.power < power - 10
                    ? stewardVariant === 0
                      ? 'They hold more direct influence than the steward appointed to govern in their name, which raises questions about why the steward exists at all.'
                      : 'The steward nominally governs but defers here more than the arrangement was designed to allow.'
                    : stewardVariant === 0
                      ? 'Overlapping claims with the steward create an ambiguity that everyone exploits: petitioners approach whichever authority is more likely to give the answer they want.'
                      : stewardVariant === 1
                        ? 'The steward and the household have developed a working arrangement, but its terms are renegotiated whenever something important is at stake.'
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
                  ? 'The arcane orders currently hold more practical influence, which the clergy finds spiritually troubling and politically unacceptable.'
                  : "The arcane orders are present but operate in the clergy's shadow — questions of what is sanctioned magic and what is heresy remain deliberately unresolved.";
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
                  ? 'The clergy hold more civic influence — the arcane orders operate by navigating rather than challenging religious authority.'
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
                ? "The criminal network currently outweighs them — the clergy's moral authority is loud and largely unheeded."
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
              'They and the religious authorities operate parallel systems of social control — the garrison handles bodies, the clergy handles minds, and both would prefer the other operated at lower volume.';
            standing = standing ? standing + ' ' + guardReligiousNote : guardReligiousNote;
          }
        }
        standing && (faction.desc = faction.desc ? faction.desc + ' ' + standing : standing);
      });
};
