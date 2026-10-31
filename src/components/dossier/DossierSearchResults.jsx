/**
 * DossierSearchResults — the dossier search's results view (RULINGS-CROSS X-19, corrected by
 * X-19b; BUILD-W2-SEARCH U3). While a query is active it takes the tab body's place under the
 * strip: one section per owning tab, the tab's name as the header (a link to the tab), and
 * under it the matching objects rendered by THEIR OWN components with the props, collapsibles
 * and audience gating they carry on that tab. Never a summary row (R2): the person is the NPC
 * card, the house is the institution card with its services, the tie is the tie card.
 *
 * The finding and ranking are the pure module's (domain/dossier/dossierSearch.js), which also
 * holds the audience gate: a player view's objects come out of the public projection, so a
 * card found there has no secret to render. The REGISTRY below maps each object family to its
 * tab's component and a props builder; `ctx` carries what the tab computes once per page (the
 * chain-status sets, the chain depths, the roster) so a card here reads exactly what it reads
 * at home.
 *
 * Lazy: OutputContainer imports this file through React.lazy, so it and every renderer it
 * pulls stay off first paint until a reader types a query.
 */
import { useMemo, useState } from 'react';
import { FS, INK, BODY, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { literaryTitle } from '../new/labelLadder.js';
import { useStore } from '../../store/index.js';
import { useDossierEntities } from './DossierEntityContext.jsx';
import { enumerateDossierObjects, rankDossierObjects, isSearchActive, SEARCH_RESULTS_ID } from '../../domain/dossier/dossierSearch.js';
import { derivePowerStrata } from '../../domain/dossier/powerStrata.js';
import { factionIdFromName } from '../../lib/entities.js';
import { computeChainSets } from '../new/tabHelpers.js';
import { Ts } from '../new/tabConstants.js';
import { NPCInlineCard, NPCRelCard2, ConflictCard } from '../new/npcComponents.jsx';
import { NeighbourLinkCard } from '../new/neighbourComponents.jsx';
import { ServiceItem } from '../new/serviceComponents.jsx';
import { InstitutionCard, institutionsWithServices } from '../new/tabs/InstitutionsTab.jsx';
import { serviceChainDepthMap } from '../new/tabs/ServicesTab.jsx';
import { FactionRow } from '../new/tabs/power/PowerStrata.jsx';
import { relationshipTypeStyle } from '../new/tabs/RelationshipsTab.jsx';
import { HistoryEventCard, TensionRow } from '../new/tabs/HistoryTab.jsx';
import { TraditionRow } from '../new/tabs/TraditionsTab.jsx';
import { PlotHookCard } from '../new/tabs/PlotHooksTab.jsx';
import { ResourceChainCard } from '../new/tabs/ResourcesTab.jsx';

/** Objects shown per group before the "more on this tab" link (the tab holds the rest). */
const GROUP_CAP = 12;

/**
 * What a tab computes once per page and hands every card: the chain-status sets (Services and
 * Institutions), the chain depths (Services), the houses with their service rows
 * (Institutions), the roster and the relational faction groups (Power), the history (the
 * event card's still-relevant mark).
 * @param {Record<string, any>} settlement
 */
function renderContext(settlement) {
  return {
    settlement,
    sets: computeChainSets(settlement),
    chainDepth: serviceChainDepthMap(settlement),
    houses: new Map(institutionsWithServices(settlement).map((house) => [house.inst, house])),
    roster: derivePowerStrata(settlement).roster,
    history: settlement?.history || {},
  };
}

/**
 * THE RENDERER REGISTRY: object family -> the tab's own component and a props builder.
 * A builder answers null when the page has nothing to mount (a faction absent from the roster),
 * and the object is then left out rather than drawn in some other shape.
 * `ui` is the result's own open state, for the cards whose tab holds that state for them.
 */
const RENDERERS = Object.freeze({
  npc: {
    Component: NPCInlineCard,
    props: (o, ctx) => ({ npc: o.raw, pinnedIds: ctx.npc.pinnedIds, onTogglePin: ctx.npc.onTogglePin, canAuthorNpc: !!ctx.npc.canAuthorNpc }),
  },
  institution: {
    Component: InstitutionCard,
    props: (o, ctx) => {
      const house = ctx.houses.get(o.raw);
      return house ? { ...house, sets: ctx.sets } : null;
    },
  },
  service: {
    Component: ServiceItem,
    props: (o, ctx) => {
      const svc = o.raw;
      const host = o.meta.host;
      return {
        svc, accent: Ts[o.meta.category]?.accent, isCriminal: o.meta.category === 'criminal',
        tradeDeps: ctx.sets.tradeDeps, impaired: ctx.sets.impaired, degraded: ctx.sets.degraded,
        vulnerable: ctx.sets.vulnerable, depReasons: ctx.sets.depReasons,
        settlement: ctx.settlement, chainDepth: ctx.chainDepth.get(host),
      };
    },
  },
  faction: {
    Component: FactionRow,
    props: (o, ctx, ui) => {
      const i = ctx.roster.findIndex((r) => r.faction === o.raw);
      if (i < 0) return null;
      const r = ctx.roster[i];
      return {
        settlement: ctx.settlement, r, i, last: true,
        isExp: ui.open, onToggle: ui.toggle,
        onJumpToPower: (name) => ctx.navigateToEntity(factionIdFromName(name)),
      };
    },
  },
  neighbour: {
    Component: NeighbourLinkCard,
    props: (o, ctx) => ({ link: o.raw, settlement: ctx.settlement, styleFor: relationshipTypeStyle }),
  },
  tie: {
    Component: NPCRelCard2,
    props: (o) => ({ rel: o.raw, style: relationshipTypeStyle(o.meta.tieType) }),
  },
  conflict: { Component: ConflictCard, props: (o) => ({ conflict: o.raw }) },
  event: {
    Component: HistoryEventCard,
    props: (o, ctx, ui) => ({ evt: o.raw, h: ctx.history, isExp: ui.open, onToggle: ui.toggle }),
  },
  tension: { Component: TensionRow, props: (o) => ({ t: o.raw }) },
  tradition: { Component: TraditionRow, props: (o) => ({ rec: o.raw, preview: !!o.meta.preview }) },
  hook: { Component: PlotHookCard, props: (o) => ({ hook: o.raw }) },
  resource: { Component: ResourceChainCard, props: (o) => ({ chain: o.raw, stage: o.meta.stage }) },
});

/** One found object, mounted through its tab's component. */
function FoundObject({ object, ctx }) {
  const [open, setOpen] = useState(false);
  const entry = RENDERERS[object.type];
  const props = entry ? entry.props(object, ctx, { open, toggle: () => setOpen((v) => !v) }) : null;
  if (!entry || !props) return null;
  const { Component } = entry;
  return <div data-search-object={object.type}><Component {...props} /></div>;
}

/**
 * @param {{
 *   settlement: object,
 *   query: string,
 *   tabs: Array<{ id: string, label: string }>,
 *   publicDossier?: boolean,
 *   playerView?: boolean,
 *   npcProps?: { pinnedIds?: Set<string>, onTogglePin?: ((id: string) => void) | null, canAuthorNpc?: boolean },
 *   onOpenTab: (tabId: string) => void,
 *   children?: import('react').ReactNode,
 * }} props  `children` is the tab body, kept in place while the query is still too short to search on.
 */
export default function DossierSearchResults({ settlement, query, tabs, publicDossier = false, playerView = false, npcProps = {}, onOpenTab, children = null }) {
  const customTraditions = useStore((s) => s.customContent?.traditions);
  const { navigateToEntity } = useDossierEntities();
  const enumeration = useMemo(
    () => enumerateDossierObjects(settlement, { publicDossier, playerView }, { customTraditions }),
    [settlement, publicDossier, playerView, customTraditions],
  );
  // The tabs array is rebuilt on every container render; the result keys on its id SET.
  const tabSignature = (tabs || []).map((t) => t.id).join('|');
  const result = useMemo(
    () => rankDossierObjects(enumeration, query, { tabs: tabSignature ? tabSignature.split('|') : [] }),
    [enumeration, query, tabSignature],
  );
  const baseCtx = useMemo(() => renderContext(enumeration.settlement), [enumeration.settlement]);
  const ctx = { ...baseCtx, npc: npcProps, navigateToEntity };
  const labelOf = (tabId) => (tabs || []).find((t) => t.id === tabId)?.label || tabId;
  const q = String(query || '').trim();
  if (!isSearchActive(query)) return children;

  return (
    <div id={SEARCH_RESULTS_ID} role="region" aria-label={`Search results for ${q}`}
      style={{ padding: `${SP.md}px ${SP.lg}px`, display: 'flex', flexDirection: 'column', gap: SP.lg, fontFamily: sans }}>
      {result.total === 0 && (
        <p style={{ margin: 0, color: BODY, fontSize: FS.sm }}>{`Nothing in this dossier matches "${q}".`}</p>
      )}
      {result.groups.map((group) => {
        const label = labelOf(group.tab);
        const more = group.objects.length - GROUP_CAP;
        return (
          <section key={group.tab} data-testid={`search-group-${group.tab}`} aria-label={label}>
            <h3 style={{ margin: `0 0 ${SP.xs}px` }}>
              <Button variant="ghost" size="sm" onClick={() => onOpenTab(group.tab)}
                style={{ ...literaryTitle(FS.sm), color: INK, padding: 0, minHeight: 0 }}>
                {label}
              </Button>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
              {group.objects.slice(0, GROUP_CAP).map((object) => (
                <FoundObject key={object.key} object={object} ctx={ctx} />
              ))}
            </div>
            {more > 0 && (
              <Button variant="ghost" size="sm" onClick={() => onOpenTab(group.tab)} style={{ marginTop: SP.xs, padding: 0, minHeight: 0 }}>
                {`${more} more on ${label}`}
              </Button>
            )}
          </section>
        );
      })}
    </div>
  );
}
