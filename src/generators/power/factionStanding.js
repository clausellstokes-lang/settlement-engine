/**
 * power/factionStanding.js — append relative-standing prose to each faction's
 * description based on its rank and the specific rivalries present (merchant vs
 * craft, thieves vs guard, noble vs merchant, clergy vs arcane, …).
 */

// annotateFactionStanding — enrich faction descriptions with their position in
// the (already normalised and sorted) power ranking (mutates in place).
export const annotateFactionStanding = (factions) => {
      var N = factions.map(function (qt) {
          return qt.faction;
        }),
        ye = function (qt) {
          return N.some(function (Ct) {
            return Ct.toLowerCase().includes(qt.toLowerCase());
          });
        },
        he = factions[0] ? factions[0].faction : null;
      factions[1] && factions[1].faction;
      var De = factions[0] ? factions[0].power : 0,
        Mi = factions[1] ? factions[1].power : 0,
        cr = De - Mi,
        bt = ye('Merchant'),
        tr = ye('Craft Guild'),
        ft = ye('Thieves'),
        Fr = ye('Military') || ye('Guard'),
        la =
          ye('Manor Household') || ye('Landed Gentry') || ye('Noble Famil') || ye('Great Famil') || ye('Noble House'),
        Rn = ye('Feudal Stewardship') || ye('Feudal Appointee'),
        vr = ye('Religious Authorities'),
        ei = ye('Arcane Orders');
      factions.forEach(function (qt, Ct) {
        var at = qt.power,
          Mt = qt.faction,
          wt = Mt.toLowerCase(),
          Gr = Ct > 0 ? factions[Ct - 1] : null,
          ti = Ct < factions.length - 1 ? factions[Ct + 1] : null,
          _r = Gr ? Gr.power - at : 0,
          _e = ti ? at - ti.power : 99,
          ve = '';
        if (
          (Ct === 1 &&
            !qt.isGoverning &&
            (cr <= 6
              ? (ve = he
                  ? 'The gap between them and ' +
                    (he && he.toLowerCase().includes('council') ? 'the governing council' : he) +
                    ' is narrow — a single shift in patronage, scandal, or armed muscle could swap their positions.'
                  : 'The dominant order is genuinely contested; a single shift in circumstance could reorder everything.')
              : cr <= 14
                ? (ve = he
                    ? 'They operate in the shadow of ' +
                      (he && he.toLowerCase().includes('council') ? 'the governing council' : he) +
                      ' but not comfortably — they are watching for leverage, not deferring.'
                    : 'Close enough to the top to resist, far enough behind to be cautious.')
                : (ve = he
                    ? 'Behind ' +
                      (he && he.toLowerCase().includes('council') ? 'the governing council' : he) +
                      ' by enough margin that direct challenge is not viable — they route their influence through procedure, not confrontation.'
                    : 'The hierarchy is settled for now; their energy goes into consolidating second place, not chasing first.')),
          Ct === 2 &&
            (_r <= 5 && _e <= 5
              ? (ve =
                  'Genuinely three-way territory — no faction has decisively broken from the pack; every council vote is negotiated.')
              : _r <= 10
                ? (ve =
                    'Close enough to the two above that their support is worth buying; they play ' +
                    (Gr ? Gr.faction : 'the second faction') +
                    ' and ' +
                    (factions[0] ? factions[0].faction : 'the top faction') +
                    ' against each other when they can.')
                : (ve =
                    'A reliable third presence — too significant to exclude from negotiations, not strong enough to set their own terms.')),
          Ct === factions.length - 1 &&
            at < 7 &&
            _r >= 5 &&
            (ve =
              'Their leverage is narrow and issue-specific; on broader questions they follow whoever is willing to deal with them that week.'),
          bt && tr)
        ) {
          if (wt.includes('merchant')) {
            var Se = factions.find(function (Ue) {
              return Ue.faction.includes('Craft Guild');
            });
            if (Se) {
              var me =
                Se.power > at
                  ? 'The craft guilds currently outweigh them in raw political numbers — an uncomfortable inversion the merchants are working to correct.'
                  : Se.power > at - 8
                    ? 'The craft guilds are close behind, contesting every pricing and quality-standard decision they try to push through council.'
                    : 'The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not.';
              ve = ve ? ve + ' ' + me : me;
            }
          }
          if (wt.includes('craft guild')) {
            var He = factions.find(function (Ue) {
              return Ue.faction.includes('Merchant');
            });
            if (He) {
              var be =
                He.power > at + 8
                  ? 'The merchants consistently outvote them on pricing and labour standards — craft masters have learned to attach riders to deals rather than fight directly.'
                  : He.power > at
                    ? 'Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods.'
                    : 'Ahead of the merchant guilds in current influence — an unusual position they intend to hold.';
              ve = ve ? ve + ' ' + be : be;
            }
          }
        }
        if (ft && Fr) {
          if (wt.includes('thieves')) {
            var Zt = factions.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('military') || Ue.faction.toLowerCase().includes('guard');
            });
            if (Zt) {
              var Xt =
                Zt.power > at + 10
                  ? 'The garrison outweighs them institutionally — they survive by corrupting the lower ranks and making enforcement selectively unprofitable.'
                  : Zt.power < at - 10
                    ? 'They currently outflank the military in real leverage; there are officers on payroll and commanders who know better than to ask questions.'
                    : 'Running roughly even with the military in actual influence — the garrison can arrest individuals, the guild can make the investigation expensive.';
              ve = ve ? ve + ' ' + Xt : Xt;
            }
          }
          if (wt.includes('military') || wt.includes('guard')) {
            var Xe = factions.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('thieves');
            });
            if (Xe) {
              var et =
                Xe.power > at + 10
                  ? 'The guild has more real leverage than they do — selective enforcement is the only tool that still works, and everyone knows it.'
                  : Xe.power < at - 10
                    ? 'They outmatch the guild institutionally, which keeps the criminal operation suppressed rather than eliminated — there is a difference.'
                    : 'Running a slow institutional war with the guild: arrests happen, networks rebuild, deals are struck and quietly violated.';
              ve = ve ? ve + ' ' + et : et;
            }
          }
        }
        if (bt && ft && wt.includes('merchant')) {
          var Rt = factions.find(function (Ue) {
            return Ue.faction.toLowerCase().includes('thieves');
          });
          if (Rt && Rt.power > 10) {
            var Ri =
              Rt.power > at
                ? 'The criminal network has more operational reach than the merchant guilds right now — some merchants are paying protection; others have become silent partners.'
                : "They tolerate the guild's cut because fighting it costs more than paying it; the arrangement is not advertised.";
            ve = ve ? ve + ' ' + Ri : Ri;
          }
        }
        if (
          la &&
          bt &&
          (wt.includes('manor') ||
            wt.includes('landed gentry') ||
            wt.includes('noble famil') ||
            wt.includes('great famil') ||
            wt.includes('noble house'))
        ) {
          var ca = factions.find(function (Ue) {
            return Ue.faction.includes('Merchant');
          });
          if (ca) {
            var qs =
              ca.power > at + 12
                ? 'The merchant guilds now hold more functional leverage — the noble families retain title, hereditary land, and social precedence, but the money has moved.'
                : ca.power > at
                  ? 'The merchants are closing the gap; the noble families are using every legal and social mechanism to slow a transition that looks increasingly inevitable.'
                  : 'Still ahead of merchant interests in real influence — for now. They know the gap is narrowing and are arranging marriages accordingly.';
            ve = ve ? ve + ' ' + qs : qs;
          }
        }
        if (Rn && la && (wt.includes('manor household') || wt.includes('landed gentry'))) {
          var Pa = factions.find(function (Ue) {
            return (
              (Ue.faction.includes('Feudal Stewardship') || Ue.faction.includes('Feudal Appointee')) &&
              Ue.faction !== qt.faction
            );
          });
          if (Pa) {
            var da = Math.floor(at * 7 + Pa.power * 3) % 3,
              _i =
                Pa.power > at + 10
                  ? da === 0
                    ? "The steward administers in the lord's name — the household is the source of that authority, not a rival to it, but the practical question of who signs what has become genuinely complicated."
                    : 'The steward holds the day-to-day authority; the household provides the legitimacy. In practice the line between them blurs whenever a petitioner finds one more receptive than the other.'
                  : Pa.power < at - 10
                    ? da === 0
                      ? 'They hold more direct influence than the steward appointed to govern in their name, which raises questions about why the steward exists at all.'
                      : 'The steward nominally governs but defers here more than the arrangement was designed to allow.'
                    : da === 0
                      ? 'Overlapping claims with the steward create an ambiguity that everyone exploits: petitioners approach whichever authority is more likely to give the answer they want.'
                      : da === 1
                        ? 'The steward and the household have developed a working arrangement, but its terms are renegotiated whenever something important is at stake.'
                        : 'Which one actually governs depends on the day and the question; both would say themselves.';
            ve = ve ? ve + ' ' + _i : _i;
          }
        }
        if (vr && ei) {
          if (wt.includes('religious')) {
            var qa = factions.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('arcane');
            });
            if (qa) {
              var ri =
                qa.power > at
                  ? 'The arcane orders currently hold more practical influence, which the clergy finds spiritually troubling and politically unacceptable.'
                  : "The arcane orders are present but operate in the clergy's shadow — questions of what is sanctioned magic and what is heresy remain deliberately unresolved.";
              ve = ve ? ve + ' ' + ri : ri;
            }
          }
          if (wt.includes('arcane')) {
            var ii = factions.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('religious');
            });
            if (ii) {
              var Li =
                ii.power > at
                  ? 'The clergy hold more civic influence — the arcane orders operate by navigating rather than challenging religious authority.'
                  : 'Ahead of the religious authorities in current influence, which they hold carefully: too much visible power invites accusations that they prefer to avoid.';
              ve = ve ? ve + ' ' + Li : Li;
            }
          }
        }
        if (vr && ft && wt.includes('religious')) {
          var Dr = factions.find(function (Ue) {
            return Ue.faction.toLowerCase().includes('thieves');
          });
          if (Dr && Dr.power > 10) {
            var Tt =
              Dr.power > at
                ? "The criminal network currently outweighs them — the clergy's moral authority is loud and largely unheeded."
                : 'They denounce the guild from the pulpit; the guild funds two charitable institutions and makes the denunciations look selective.';
            ve = ve ? ve + ' ' + Tt : Tt;
          }
        }
        if (Fr && vr && (wt.includes('military') || wt.includes('guard'))) {
          var _n = factions.find(function (Ue) {
            return Ue.faction.toLowerCase().includes('religious');
          });
          if (_n && Math.abs(_n.power - at) < 10) {
            var Ln =
              'They and the religious authorities operate parallel systems of social control — the garrison handles bodies, the clergy handles minds, and both would prefer the other operated at lower volume.';
            ve = ve ? ve + ' ' + Ln : Ln;
          }
        }
        ve && (qt.desc = qt.desc ? qt.desc + ' ' + ve : ve);
      });
};
