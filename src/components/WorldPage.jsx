/**
 * WorldPage.jsx — THE SEED POST landing (Vision V-13). The page at
 * /world/<share-code>: it decodes the code to a (seed + preset), regenerates the
 * BYTE-IDENTICAL world client-side (no server state), and previews it — the
 * gallery becomes a commons anyone can reproduce from a sentence-length code.
 *
 * LAZY: this whole module is a React.lazy route (AppViews), and the heavy composer
 * (→ the generator engine) is DYNAMICALLY imported on mount, so nothing here — not
 * even the engine — touches the first-paint graph (tests/build/worldPageLazy).
 *
 * Fail-closed: an invalid / tampered / unknown-version code shows a graceful
 * "not a valid world" state, never a crash.
 */
import { useEffect, useState } from 'react';
import { decodeWorldCode } from '../lib/worldCode.js';
import { viewToPath } from '../lib/routes.js';
import { FS, PARCH, INK, BODY, MUTED, BORDER, GOLD, CARD, sans, serif_ } from './theme.js';
import Button from './primitives/Button.jsx';

const REALM_LABEL = { small: 'Small realm', medium: 'Medium realm', large: 'Large realm' };
const TONE_LABEL = { quiet_local: 'Quiet', realistic_regional: 'Realistic', dramatic_campaign: 'Dramatic' };

/**
 * @param {{ code?: string, onNavigate?: (view: string) => void }} props
 */
export default function WorldPage({ code, onNavigate }) {
  const [state, setState] = useState({ status: 'decoding', world: null, decoded: null, error: null });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const decoded = decodeWorldCode(code);
    if (!decoded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: 'invalid', world: null, decoded: null, error: null });
      return undefined;
    }
    setState({ status: 'generating', world: null, decoded, error: null });
    // The composer (and, through it, the generator engine) is loaded ONLY here —
    // dynamic import keeps it off first paint.
    import('../lib/instantWorld/composeInstantWorld.js')
      .then(({ composeInstantWorld }) => {
        if (cancelled) return;
        const bundle = composeInstantWorld({ seed: decoded.seed, basicConfig: decoded.basicConfig });
        if (cancelled) return;
        setState({ status: 'ready', world: bundle, decoded, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ status: 'error', world: null, decoded, error: err && err.message ? err.message : String(err) });
      });
    return () => { cancelled = true; };
  }, [code]);

  const shareUrl = typeof window !== 'undefined' && code
    ? `${window.location.origin}${viewToPath('world', { code })}`
    : '';

  const copyLink = () => {
    if (!shareUrl || !navigator.clipboard) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div style={{ minHeight: '60vh', background: PARCH, padding: `${32}px 20px`, fontFamily: sans }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>
          A shared world
        </div>

        {state.status === 'decoding' || state.status === 'generating' ? (
          <Panel>
            <h1 style={titleStyle}>Rebuilding the world…</h1>
            <p style={bodyStyle}>
              This world is being regenerated from its share code on your own device. The
              same seed always builds the same world.
            </p>
          </Panel>
        ) : null}

        {state.status === 'invalid' ? (
          <Panel>
            <h1 style={titleStyle}>That share code isn&apos;t valid.</h1>
            <p style={bodyStyle}>
              A world share code looks like <code>w1.…</code> and carries a checksum, so a
              mistyped or truncated link won&apos;t open the wrong world. Check the link, or
              start a realm of your own.
            </p>
            <div style={{ marginTop: 14 }}>
              <Button variant="primary" size="sm" onClick={() => onNavigate && onNavigate('generate')}>Create a realm</Button>
            </div>
          </Panel>
        ) : null}

        {state.status === 'error' ? (
          <Panel>
            <h1 style={titleStyle}>The world couldn&apos;t be rebuilt.</h1>
            <p style={bodyStyle}>{state.error}</p>
          </Panel>
        ) : null}

        {state.status === 'ready' && state.world ? (
          <ReadyView world={state.world} decoded={state.decoded} shareUrl={shareUrl} copied={copied} onCopy={copyLink} onNavigate={onNavigate} />
        ) : null}
      </div>
    </div>
  );
}

function ReadyView({ world, decoded, shareUrl, copied, onCopy, onNavigate }) {
  const plan = world.plan || {};
  const settlements = Array.isArray(world.settlements) ? world.settlements : [];
  const largest = settlements.slice().sort((a, b) => (b?.settlement?.population || 0) - (a?.settlement?.population || 0));
  return (
    <>
      <Panel>
        <h1 style={titleStyle}>{world.campaign?.name || 'A rebuilt realm'}</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '6px 0 14px' }}>
          <Chip>{REALM_LABEL[plan.realmSize] || plan.realmSize || 'Realm'}</Chip>
          <Chip>{TONE_LABEL[plan.tonePresetId] || plan.tonePresetId || 'Realistic'}</Chip>
          <Chip>{settlements.length} settlements</Chip>
        </div>
        <p style={bodyStyle}>
          Rebuilt from its share code on your device, identical to the original. Its seed is{' '}
          <code>{decoded?.seed}</code>.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          <Button variant="primary" size="sm" onClick={onCopy}>{copied ? 'Link copied' : 'Copy share link'}</Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigate && onNavigate('generate')}>Create your own</Button>
        </div>
        {shareUrl ? <div style={{ marginTop: 10, fontSize: FS.xxs, color: MUTED, wordBreak: 'break-all' }}>{shareUrl}</div> : null}
      </Panel>

      <Panel>
        <div style={{ fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 10 }}>
          Its settlements
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {largest.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, padding: '6px 0', borderBottom: i < largest.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <span style={{ fontFamily: serif_, fontWeight: 700, fontSize: FS.md, color: INK }}>{s?.settlement?.name || s?.name || 'Settlement'}</span>
              <span style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s?.tier || s?.settlement?.tier}</span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function Panel({ children }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `4px solid ${GOLD}`, padding: '18px 20px', marginBottom: 16 }}>
      {children}
    </div>
  );
}

function Chip({ children }) {
  return (
    <span style={{ fontSize: FS.xxs, fontWeight: 700, color: BODY, background: PARCH, border: `1px solid ${BORDER}`, padding: '3px 9px' }}>
      {children}
    </span>
  );
}

const titleStyle = { margin: 0, fontFamily: serif_, fontWeight: 600, fontSize: FS.xxl, color: INK, lineHeight: 1.15 };
const bodyStyle = { fontSize: FS.sm, color: BODY, lineHeight: 1.55, marginTop: 8 };
