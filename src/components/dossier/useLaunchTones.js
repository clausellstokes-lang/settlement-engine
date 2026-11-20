/**
 * dossier/useLaunchTones.js — WHICH WORLD TABS WEAR THE LAUNCH HUE.
 *
 * THE OWNER, 2026-11-01 (ODQ §934.103): the dossier tabs that stand in the strip as
 * "Available at launch" teasers (War, Rumors & News, Faith while no live body exists)
 * wear a purple hue "just for distinction". OutputContainer calls this once per render
 * and spreads `tone: 'launch'` onto those tab entries; both strips paint the tone.
 *
 * The predicates are domain/dossier/launchTeasers.js's and mirror the tabs' own teaser
 * decisions. War's full predicate (WarTab :: warTabHasContent) lives on the lazy War
 * chunk, so it is read through a dynamic import only where a campaign owns the
 * settlement; the common campaign-less case is answered synchronously with no chunk.
 */
import { useEffect, useState } from 'react';
import { useStore } from '../../store/index.js';
import { faithTabHasContent, rumorsTabHasContent, warTeaserSync } from '../../domain/dossier/launchTeasers.js';

/**
 * @param {{ settlement: any, deityEmbed?: unknown, saveId?: string|number|null, playerView?: boolean, publicDossier?: boolean }} args
 *   `deityEmbed` is the settlement's `config.primaryDeitySnapshot` as the container already
 *   reads it (the observed-shape instrument banks that read there and nowhere new).
 * @returns {{ war: boolean, rumors: boolean, faith: boolean }} true = the tab is a teaser
 */
export default function useLaunchTones({ settlement, deityEmbed = null, saveId = null, playerView = false, publicDossier = false }) {
  const campaigns = useStore(s => s.campaigns);
  const warQuick = warTeaserSync(settlement, { saveId, campaigns });
  const [warResolved, setWarResolved] = useState(null);
  // The DM truth band (the includeGroundTruth convention, WarTab verbatim): the view and the
  // data, never the tier — never on the player view, never on a public dossier.
  const includeGroundTruth = !playerView && !publicDossier;
  useEffect(() => {
    if (warQuick !== null) return undefined;
    let alive = true;
    import('../new/tabs/WarTab.jsx')
      .then((m) => {
        if (!alive) return;
        setWarResolved(!m.warTabHasContent(settlement, { saveId, campaigns, includeGroundTruth }));
      })
      .catch(() => { /* the strip keeps the live colour; the tab body still shows its own card */ });
    return () => { alive = false; };
  }, [warQuick, settlement, saveId, campaigns, includeGroundTruth]);
  return {
    war: warQuick !== null ? warQuick : (warResolved ?? false),
    rumors: !rumorsTabHasContent(settlement, { saveId, campaigns }),
    faith: !faithTabHasContent(deityEmbed),
  };
}
