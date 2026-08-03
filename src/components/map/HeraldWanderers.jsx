/**
 * HeraldWanderers.jsx — THE WANDERERS, the Herald's register of people without a
 * place (design DESIGN_NPC_CONSEQUENCES.md §8, wave W-H4).
 *
 * The Gazetteer answers "what is there" and Ruins & Remembrance answers "what is gone".
 * This door answers a question neither of them can: WHO is out there. A realm that
 * exiles, jails and disgraces people accumulates a cast with no address, and until this
 * page they were only visible as a state map nobody could open.
 *
 * LEGIBILITY LAW, glance then sentence. The glance is the name and the "(former ...)"
 * title; beneath it the card is SENTENCES, built by heraldWanderers from the audience
 * projection. No notoriety band token, no verdict token, no tick and no durable id
 * reaches this page. The only id here is a settlement save id inside a link, where it is
 * a destination rather than a printed token.
 *
 * NEWS ADDRESS LAW: the origin and the resting place are live RealmEntityLinks, so the
 * register is a way INTO the story that put somebody on the road, not a dead list.
 *
 * THE SECRETS SEAM: the door consults viewerSeesDmSecrets exactly as the Gazetteer and
 * Ruins & Remembrance do (fail closed). The register itself is the world's own fact and
 * ships to every audience: a wanderer is a person on a road. What does NOT ship is
 * WHOSE LEASH THEY WERE ON, which is covert intelligence, and the DM verbs, which are
 * the DM's authority rather than a reader's affordance. Redaction here means the field
 * is NEVER BUILT (the projection's allowlist), not hidden by CSS.
 *
 * PRESENCE, NOT DISABLEMENT. Unlike its two sibling registers this door is CONDITIONAL:
 * a realm whose rules do not run the consequence economy has no roaming pool at all, so
 * RealmInspector omits the tab entirely rather than offering an empty page of a system
 * that is switched off (the ai_notes presence lesson). The body still carries its own
 * calm empty state, because a live realm that has simply exiled nobody yet is good news.
 *
 * A LAZY LEAF. HeraldBody mounts it through lazy(), so a GM who never opens this door
 * pays nothing for it. @enforced-by tests/build/heraldWanderersLazy.test.js
 */

import { useMemo } from 'react';

import { useStore } from '../../store/index.js';
import { viewerSeesDmSecrets } from '../../domain/display/viewerSecrets.js';
import { wandererRows } from './heraldWanderers.js';
import { registerIdOf, registerNameOf, campaignRegisterSaves } from './heraldRegister.js';
import WandererVerbControls, { WandererUndoControl } from './WandererVerbControls.jsx';
import { Pill, Section } from './WorldPulsePrimitives.jsx';
import RealmEntityLink from '../primitives/RealmEntityLink.jsx';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, INK, MUTED, SECOND, SP, sans } from '../theme.js';

/** The register's calm nothing-here state. A realm that has exiled nobody is not
 *  broken; it is a realm nobody has been thrown out of yet. */
function EmptyRegister() {
  return (
    <div style={{ border: `1px dashed ${BORDER}`, padding: 14, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
      Nobody wanders this realm. Every name it knows still has a roof and a place to stand.
    </div>
  );
}

/**
 * One person's card: the glance line, the why, what is said of them, and the two live
 * addresses their story runs between.
 *
 * @param {Object} props
 * @param {import('./heraldWanderers.js').WandererRow} props.row
 * @param {boolean} props.seesSecrets
 * @param {string} props.campaignId
 * @param {ReadonlyArray<{ id: string, name: string }>} props.places
 */
export function WandererCard({ row, seesSecrets, campaignId, places }) {
  return (
    <div
      data-testid="wanderer-row"
      style={{
        display: 'grid', gap: 4,
        padding: '8px 10px',
        border: `1px solid ${BORDER2}`,
        borderLeft: `3px solid ${MUTED}`,
        background: CARD,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ color: INK, fontFamily: sans, fontWeight: 900, fontSize: FS.sm }}>{row.name}</span>
        <Pill>{row.title}</Pill>
      </div>
      <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.45, overflowWrap: 'anywhere' }}>
        {row.whyLine} {row.notorietyLine}
      </div>
      {row.standingLines.map(line => (
        <div key={line} style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>{line}</div>
      ))}
      {row.doorsLine && (
        <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>{row.doorsLine}</div>
      )}
      {row.whereaboutsLine && (
        <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>{row.whereaboutsLine}</div>
      )}
      <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>{row.whenLine}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontFamily: sans, fontSize: FS.xxs, color: MUTED }}>
        {/* THE ORIGIN STORY POINTER (design §8): the place whose trouble put them here. */}
        {row.originId && (
          <span>
            Came from{' '}
            <RealmEntityLink settlementSaveId={row.originId} label={row.originName || 'a place the record does not name'} />
          </span>
        )}
        {row.restingId && (
          <span>
            {row.roaming ? 'Resting at ' : 'Held at '}
            <RealmEntityLink settlementSaveId={row.restingId} label={row.restingName || 'a place the record does not name'} />
          </span>
        )}
      </div>
      {row.dmLine && (
        <div data-testid="wanderer-dm-line" style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontStyle: 'italic' }}>
          {row.dmLine}
        </div>
      )}
      {seesSecrets && campaignId && (
        <WandererVerbControls
          campaignId={campaignId}
          wnpcId={row.key}
          name={row.name}
          doorsShut={!!row.doorsLine}
          places={places}
          defaultPlaceId={row.restingId}
        />
      )}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {any} props.campaign
 * @param {ReadonlyArray<any>} [props.saves]
 */
export default function HeraldWanderers({ campaign, saves = [] }) {
  const auth = useStore(s => s.auth);
  // §15 fail-closed, the RoadScenePanel / register-doors idiom: only a proven owner
  // session gets the covert read, and only a proven owner session gets the verbs.
  const seesSecrets = viewerSeesDmSecrets({ isOwner: !!auth?.user, authenticated: !!auth?.user });
  const rows = useMemo(
    () => wandererRows({ campaign, saves, seesSecrets }),
    [campaign, saves, seesSecrets],
  );
  // The places a DM may settle somebody into: the campaign's own register, in the same
  // order it reads. Derived from the SAME saves filter the Gazetteer uses, so the two
  // pages can never offer different realms.
  const places = useMemo(
    () => campaignRegisterSaves(campaign, saves).map(save => ({
      id: registerIdOf(save),
      name: registerNameOf(save),
    })),
    [campaign, saves],
  );
  const campaignId = campaign?.id == null ? '' : String(campaign.id);

  return (
    <div data-testid="herald-wanderers" style={{ display: 'grid', gap: SP.sm }}>
      {/* THE RECOVERY DOOR for every ruling handed down from this register. It sits ABOVE
          the rows on purpose: a recorded death takes its own row off the page, so an undo
          that lived inside the cards would disappear with the act most in need of it. */}
      {seesSecrets && campaignId && <WandererUndoControl campaignId={campaignId} />}
      <Section heading="On the road" count={rows.roaming.length}>
        {rows.roaming.length === 0 ? (
          <EmptyRegister />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rows.roaming.map(row => (
              <WandererCard key={row.key} row={row} seesSecrets={seesSecrets} campaignId={campaignId} places={places} />
            ))}
          </div>
        )}
      </Section>
      {rows.settled.length > 0 && (
        <Section heading="Found a place again" count={rows.settled.length}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rows.settled.map(row => (
              <WandererCard key={row.key} row={row} seesSecrets={seesSecrets} campaignId={campaignId} places={places} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
