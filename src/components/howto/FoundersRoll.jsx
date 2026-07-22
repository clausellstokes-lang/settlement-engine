/**
 * FoundersRoll.jsx — the quiet, dignified credits block promised by FounderTile
 * ("plus your name in the credits"). Renders the PUBLIC founders_roll() RPC (170):
 * the external_name of consenting, active founders, earliest first.
 *
 * DORMANT-SAFE by contract: if the RPC is absent (migration undeployed) or no
 * founder has opted in, this renders NOTHING — no header, no empty state. The
 * surface lights only when real consented names exist. Rides the lazy HowToUse
 * chunk (mounted in AboutManifesto), so it never touches the first-paint closure.
 */
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { GOLD, INK, MUTED, SP, FS, serif_ } from '../theme.js';

export default function FoundersRoll() {
  const [names, setNames] = useState(null); // null = loading/unknown, [] = none

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error } = await supabase.rpc('founders_roll');
        if (!alive) return;
        // An error means the RPC is undeployed (or transient) — stay dormant.
        setNames(!error && Array.isArray(data) ? data.map((r) => r?.name).filter(Boolean) : []);
      } catch {
        if (alive) setNames([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (!names || names.length === 0) return null;

  return (
    <section aria-label="The founders" style={{ marginTop: SP.xl, paddingTop: SP.lg, borderTop: '1px solid rgba(201,162,76,0.25)' }}>
      <h3 style={{ margin: 0, fontFamily: serif_, fontWeight: 600, fontSize: FS.lg, color: GOLD, letterSpacing: '0.02em' }}>
        The founders
      </h3>
      <p style={{ margin: `${SP.xs}px 0 ${SP.md}px`, fontFamily: serif_, fontSize: FS.sm, color: MUTED, fontStyle: 'italic' }}>
        With gratitude to the founders who backed the earliest maps.
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: `${SP.xs}px ${SP.lg}px` }}>
        {names.map((n, i) => (
          <li key={`${n}-${i}`} style={{ fontFamily: serif_, fontSize: FS.sm, color: INK }}>{n}</li>
        ))}
      </ul>
    </section>
  );
}
