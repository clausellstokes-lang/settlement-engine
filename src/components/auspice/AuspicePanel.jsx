/**
 * AuspicePanel.jsx — V-16 THE AUSPICE (read the omens before you decide).
 *
 * "Read the auspices": advance a THROWAWAY copy of the realm and glimpse what the
 * coming season foretells — tiered by significance, with the crossroads where the
 * world would await the DM's word. The real campaign is never touched (the domain
 * composer clones + discards; auspice.test.js pins byte-identity).
 *
 * THE HONEST LABEL lives here, in the surface: an omen is a glimpse of the
 * ceteris-paribus future, never a promise — the world's course can still turn.
 *
 * Lazy: the auspice domain module is dynamic-imported on demand, so its advance
 * engine stays off the first-paint closure.
 */
import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { MUTED, INK, BODY, BORDER, GOLD_DEEP, AMBER_DEEP, sans, FS, SP, R } from '../theme.js';
import Card from '../primitives/Card.jsx';
import Button from '../primitives/Button.jsx';
import Badge from '../primitives/Badge.jsx';

const SPANS = [
  ['one_month', 'A month'], ['one_season', 'A season'], ['one_year', 'A year'],
];

/** @param {{ tick: any, headline: string }} b */
function Beat({ b, tone }) {
  return (
    <li style={{ display: 'flex', gap: SP.sm, alignItems: 'baseline', fontFamily: sans, fontSize: FS.sm, color: tone || BODY, margin: `${SP.xs}px 0` }}>
      <span style={{ color: MUTED, fontSize: FS.xs, minWidth: 44 }}>{b.tick != null ? `Tick ${b.tick}` : '–'}</span>
      <span>{b.headline}</span>
    </li>
  );
}

export default function AuspicePanel({ campaign }) {
  const saves = useStore((s) => s.savedSettlements);
  const [span, setSpan] = useState('one_season');
  const [running, setRunning] = useState(false);
  const [omen, setOmen] = useState(/** @type {any} */ (null));

  const memberIds = new Set((campaign?.settlementIds || []).map(String));
  const memberSaves = (saves || []).filter((s) => memberIds.has(String(s.id)));

  async function read() {
    if (!campaign) return;
    setRunning(true);
    try {
      const { readAuspices } = await import('../../domain/worldPulse/auspice.js');
      const now = new Date().toISOString();
      setOmen(await readAuspices({ campaign, saves: memberSaves, interval: span, now }));
    } catch {
      setOmen({ error: true });
    } finally {
      setRunning(false);
    }
  }

  if (!campaign) {
    return (
      <Card title="The Auspice" kicker="Read the omens">
        <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: 0 }}>
          Open a canonized realm to read its auspices: a glimpse of the season to come, cast
          from the world as it stands.
        </p>
      </Card>
    );
  }

  return (
    <Card title="The Auspice" kicker="Read the omens">
      <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: `0 0 ${SP.md}px` }}>
        Cast a glimpse of the season to come, then let it go. Reading the auspices touches
        nothing; the world advances only when you say so.
      </p>
      <div style={{ display: 'flex', gap: SP.xs, alignItems: 'center', flexWrap: 'wrap', marginBottom: SP.md }}>
        {SPANS.map(([key, label]) => (
          <Button key={key} size="sm" variant={span === key ? 'primary' : 'ghost'} onClick={() => setSpan(key)}>{label}</Button>
        ))}
        <Button size="sm" variant="secondary" disabled={running} onClick={read}>
          {running ? 'Casting…' : 'Read the auspices'}
        </Button>
      </div>

      {omen && omen.error && (
        <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: 0 }}>The auspices were unclear. Try again.</p>
      )}

      {omen && !omen.error && (
        <div>
          {omen.counts.major + omen.counts.notable + omen.counts.crossroads === 0 && (
            <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: 0 }}>
              The omens are quiet. The season ahead looks to pass without upheaval.
            </p>
          )}
          {omen.major.length > 0 && (
            <section style={{ marginBottom: SP.md }}>
              <span style={{ display: 'flex', gap: SP.xs, alignItems: 'center', fontSize: FS.xs, letterSpacing: '0.05em', textTransform: 'uppercase', color: GOLD_DEEP, fontFamily: sans, fontWeight: 700 }}>
                <Badge tone="gold" size="sm">Great signs</Badge>
              </span>
              <ul style={{ listStyle: 'none', margin: `${SP.xs}px 0 0`, padding: 0 }}>
                {omen.major.map((b, i) => <Beat key={i} b={b} tone={INK} />)}
              </ul>
            </section>
          )}
          {omen.notable.length > 0 && (
            <section style={{ marginBottom: SP.md }}>
              <span style={{ fontSize: FS.xs, letterSpacing: '0.05em', textTransform: 'uppercase', color: MUTED, fontFamily: sans, fontWeight: 700 }}>Lesser signs</span>
              <ul style={{ listStyle: 'none', margin: `${SP.xs}px 0 0`, padding: 0 }}>
                {omen.notable.map((b, i) => <Beat key={i} b={b} tone={BODY} />)}
              </ul>
            </section>
          )}
          {omen.crossroads.length > 0 && (
            <section style={{ marginBottom: SP.md }}>
              <span style={{ fontSize: FS.xs, letterSpacing: '0.05em', textTransform: 'uppercase', color: AMBER_DEEP, fontFamily: sans, fontWeight: 700 }}>Where the world would await your word</span>
              <ul style={{ listStyle: 'none', margin: `${SP.xs}px 0 0`, padding: 0 }}>
                {omen.crossroads.map((b, i) => <Beat key={i} b={b} tone={AMBER_DEEP} />)}
              </ul>
            </section>
          )}
          <p style={{ fontFamily: sans, fontStyle: 'italic', fontSize: FS.xs, color: MUTED, margin: 0, borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm, borderRadius: R.sm }}>
            An omen, not a promise. This is the season as it stands today; tuning and the turns of
            other hands can still bend the world&rsquo;s course.
          </p>
        </div>
      )}
    </Card>
  );
}
