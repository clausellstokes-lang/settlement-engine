/**
 * RoadScenePanel.jsx — "Stage the Road" (DESIGN_THE_ROADS §14). The DM picks an origin +
 * destination and reads the road scene: the chosen route + conditions, who is on the road, and
 * what waits at the gates — composed PURELY from truth (composeRoadSceneBrief), writing nothing.
 *
 * §15 SECRETS SEAM: the road scene is DM-SECRET; this surface consults viewerSeesDmSecrets and
 * renders a redacted note for any non-owner / unauthenticated / shared context (fail closed).
 * The optional "Dress with AI" button routes the composed bundle through the EXISTING metered
 * ai-analyst surface (normal server-side credit spend; the un-dressed bundle stands alone).
 */
import { useState, useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { composeRoadSceneBrief, composeRoadScenePlayerBrief } from '../../domain/briefs/roadScene.js';
import { viewerSeesDmSecrets } from '../../domain/display/viewerSecrets.js';
import Button from '../primitives/Button.jsx';
import { BODY, BORDER, FS, MUTED, SECOND, SP, sans, swatch } from '../theme.js';

const selectStyle = {
  fontSize: FS.xs, color: swatch.inkMag2, background: swatch['#FAF8F4'],
  border: `1px solid ${swatch['#EDE3CC']}`, padding: '4px 6px', maxWidth: '100%',
};

/** A compact human line for one brief item (per section). Pure.
 *  Exported for the regression pin: an unrecognized item never renders raw JSON. */
export function itemLine(sectionId, it) {
  if (sectionId === 'road') {
    // The player-safe lead carries no danger/tolls numbers (it.danger absent) — coarse by design.
    if (it.leg) return `${it.leg} — ${it.hops} hop${it.hops === 1 ? '' : 's'}${it.danger != null ? `, danger ${it.danger}${it.tolls ? `, tolls ${it.tolls}` : ''}` : ''}`;
    // V-6 BIOME TRUTH: the season/terrain texture appends only on a biomeTexture canon
    // (it.terrain present); absent ⇒ the line is byte-identical to the pre-V-6 render.
    return `${it.at}: ${it.condition}${it.toll ? ` (toll ${it.toll})` : ''}${it.terrain ? ` — ${it.terrain}` : ''}`;
  }
  if (sectionId === 'onRoad') {
    if (it.kind === 'army') return `Army of ${it.banner} at ${it.at}, ${it.posture} toward ${it.heading}`;
    if (it.kind === 'migrants') return `${it.reason} (${it.arrivals} folk)`;
    if (it.kind === 'envoy') return `${it.npc} of ${it.home}, ${it.purpose}, under ${it.escort}, bound for ${it.heading}`;
  }
  if (sectionId === 'gates') {
    if (it.state === 'occupied') return `Occupied by ${it.by}${it.rung ? ` (${it.rung})` : ''}`;
    if (it.state === 'under siege') return `Under siege by ${it.by}`;
    if (it.state === 'a festival is on') return `A festival is on — ${it.guestRight}`;
  }
  // Graceful in-register fallback: the composer is registry-driven and grows (a
  // future onRoad kind / gate state), so speak whatever labelled fields the item
  // carries — never raw JSON on the DM's diegetic staging surface (§14).
  const what = it.state || it.kind || it.condition || it.purpose;
  const where = it.at || it.heading || it.to || it.by || it.home;
  if (what && where) return `${what} — ${where}`;
  if (what) return String(what);
  if (where) return `Movement near ${where}`;
  return 'Something stirs on the road, the particulars not yet clear.';
}

export default function RoadScenePanel({ campaign }) {
  const savedSettlements = useStore(s => s.savedSettlements);
  const selectedId = useStore(s => s.selectedSettlementId);
  const auth = useStore(s => s.auth);
  const setCreditBalance = useStore(s => s.setCreditBalance);

  // §15 — fail-closed: only an authenticated owner session (a live realm inspector) sees truth.
  const seesSecrets = viewerSeesDmSecrets({ isOwner: !!auth?.user, authenticated: !!auth?.user });

  const members = useMemo(() => {
    const ids = new Set((campaign?.settlementIds || []).map(String));
    return (savedSettlements || [])
      .filter(s => ids.has(String(s?.id ?? s?.settlement?.id)))
      .map(s => ({ id: String(s?.id ?? s?.settlement?.id), name: s?.settlement?.name || s?.name || String(s?.id) }));
  }, [savedSettlements, campaign]);

  const [origin, setOrigin] = useState(() => (selectedId != null ? String(selectedId) : ''));
  const [dest, setDest] = useState('');
  const [asPlayer, setAsPlayer] = useState(false); // V-25a — preview/show the inhabitant view
  const [dressing, setDressing] = useState(false);
  const [dressed, setDressed] = useState(/** @type {{answer?:string,error?:string}|null} */(null));

  const worldState = useMemo(() => campaign?.worldState || {}, [campaign]);
  const regionalGraph = useMemo(() => campaign?.regionalGraph || worldState.regionalGraph || null, [campaign, worldState]);

  const brief = useMemo(() => {
    if (!seesSecrets || !origin || !dest || origin === dest) return null;
    const compose = asPlayer ? composeRoadScenePlayerBrief : composeRoadSceneBrief;
    return compose({
      originId: origin, destId: dest, worldState, settlements: savedSettlements,
      regionalGraph, tick: worldState.tick,
    });
  }, [seesSecrets, origin, dest, asPlayer, worldState, savedSettlements, regionalGraph]);

  if (!campaign) {
    return <p style={{ color: BODY, fontFamily: sans, fontSize: FS.xs }}>Stage the road once a campaign is live.</p>;
  }
  if (!seesSecrets) {
    return <p style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs }}>The road scene is the DM&apos;s own view. Sign in to your realm to stage a road.</p>;
  }

  const onDress = async () => {
    if (!brief || dressing) return;
    setDressing(true); setDressed(null);
    try {
      const { dressRoadScene } = await import('../../lib/roadSceneAi.js');
      const res = await dressRoadScene({ brief });
      if (res.creditsRemaining != null && typeof setCreditBalance === 'function') setCreditBalance(res.creditsRemaining);
      setDressed(res.error ? { error: res.error } : { answer: res.answer });
    } catch (e) {
      setDressed({ error: 'The AI-dressing request failed.' });
    } finally {
      setDressing(false);
    }
  };

  const pickerRow = (id, label, value, onChange, exclude) => (
    <label htmlFor={id} style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: FS.micro, color: MUTED, fontWeight: 700 }}>
      {label}
      <select id={id} aria-label={label} value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
        <option value="">—</option>
        {members.filter(m => m.id !== exclude).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
    </label>
  );

  return (
    <div style={{ display: 'grid', gap: SP.sm }} data-testid="road-scene-panel">
      <div style={{ fontSize: FS.micro, color: MUTED, lineHeight: 1.4 }}>
        Pick an origin and destination (or click a settlement on the map for the origin). The road
        is read from truth — staging it writes nothing.
      </div>
      <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap' }}>
        {pickerRow('road-scene-from', 'From', origin, setOrigin, dest)}
        {pickerRow('road-scene-to', 'To', dest, setDest, origin)}
      </div>

      {/* V-25a — the DM previews (and can read aloud) the inhabitant view: the same road, but only
          what the party would themselves perceive. No covert movement, no secret war. */}
      <div role="group" aria-label="View the road as" style={{ display: 'flex', gap: SP.xs, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: FS.micro, color: MUTED, fontWeight: 700 }}>View as</span>
        <Button variant={asPlayer ? 'ghost' : 'secondary'} size="sm" aria-pressed={!asPlayer} onClick={() => setAsPlayer(false)}>DM</Button>
        <Button variant={asPlayer ? 'secondary' : 'ghost'} size="sm" aria-pressed={asPlayer} onClick={() => setAsPlayer(true)}>Players</Button>
        {asPlayer && <span style={{ fontSize: FS.micro, color: MUTED }}>What the party sees — no DM secrets.</span>}
      </div>

      {origin && dest && origin === dest && (
        <p style={{ color: MUTED, fontSize: FS.micro }}>Choose two different settlements.</p>
      )}

      {brief && brief.sections.length === 0 && (
        <p style={{ color: BODY, fontFamily: sans, fontSize: FS.xs }}>No road runs between them (no land route on the realm graph).</p>
      )}

      {brief && brief.sections.map(sec => (
        <section key={sec.id} style={{ border: `1px solid ${BORDER}`, padding: `${SP.xs}px ${SP.sm}px` }}>
          <h4 style={{ margin: '0 0 4px', fontSize: FS.xs, fontWeight: 800, color: SECOND, fontFamily: sans }}>{sec.title}</h4>
          <ul style={{ margin: 0, paddingLeft: 16, display: 'grid', gap: 2 }}>
            {sec.items.map((it, i) => (
              <li key={i} style={{ fontSize: FS.micro, color: BODY, lineHeight: 1.4 }}>{itemLine(sec.id, it)}</li>
            ))}
          </ul>
        </section>
      ))}

      {brief && brief.sections.length > 0 && !asPlayer && (
        <div style={{ display: 'flex', gap: SP.sm, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="ai" size="sm" onClick={onDress} busy={dressing} disabled={dressing}
            aria-label="Dress the road scene with grounded AI prose (spends credits)">
            {dressing ? 'Dressing…' : 'Dress with AI'}
          </Button>
          <span style={{ fontSize: FS.micro, color: MUTED }}>Optional — spends credits; the scene above stands on its own.</span>
        </div>
      )}
      {dressed?.error && <p style={{ color: swatch.danger, fontSize: FS.micro }}>{dressed.error}</p>}
      {dressed?.answer && (
        <p style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.5, fontStyle: 'italic', borderLeft: `2px solid ${swatch['#A0762A']}`, paddingLeft: SP.sm }}>{dressed.answer}</p>
      )}
    </div>
  );
}
