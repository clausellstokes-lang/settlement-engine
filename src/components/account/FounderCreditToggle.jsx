/**
 * FounderCreditToggle.jsx — the founder's opt-in switch for the public credits
 * roll (170). Visible ONLY to founder accounts; toggles
 * profiles.founder_credit_listed via the founder-gated set_founder_credit_listed
 * RPC. What appears in the roll is the account's PUBLIC gallery name
 * (external_name), the same name every gallery surface already shows.
 *
 * DORMANT-SAFE: if the column/RPC is absent (migration undeployed), the toggle
 * hides itself rather than spewing errors — feature-detected on the profile read
 * and the RPC call. Self-contained (reads the store's isFounder selector + calls
 * supabase directly), so it drops into AccountProfileSection without prop glue and
 * rides the lazy AccountPage chunk.
 */
import { useCallback, useEffect, useId, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useStore } from '../../store/index.js';
import { MUTED, SECOND, SP, FS, sans } from '../theme.js';

export default function FounderCreditToggle() {
  const isFounder = useStore((s) => s.isFounder?.() ?? false);
  const [listed, setListed] = useState(null); // null = unknown, bool = known
  const [available, setAvailable] = useState(true); // false ⇒ column/RPC undeployed
  const [saving, setSaving] = useState(false);
  const cbId = useId();

  useEffect(() => {
    if (!isFounder) return undefined;
    let alive = true;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (alive) setAvailable(false); return; }
        const { data, error } = await supabase
          .from('profiles').select('founder_credit_listed').eq('id', user.id).maybeSingle();
        if (!alive) return;
        if (error) { setAvailable(false); return; } // column undeployed → hide
        setListed(data?.founder_credit_listed === true);
      } catch {
        if (alive) setAvailable(false);
      }
    })();
    return () => { alive = false; };
  }, [isFounder]);

  const onChange = useCallback(async (next) => {
    setSaving(true);
    try {
      const { error } = await supabase.rpc('set_founder_credit_listed', { p_listed: next });
      if (error) { setAvailable(false); return; } // RPC undeployed → hide gracefully
      setListed(next);
    } catch {
      setAvailable(false);
    } finally {
      setSaving(false);
    }
  }, []);

  if (!isFounder || !available || listed === null) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label htmlFor={cbId} style={{ display: 'flex', alignItems: 'center', gap: SP.sm, fontSize: FS.sm, color: SECOND, fontWeight: 700, fontFamily: sans }}>
        <input id={cbId} type="checkbox" checked={listed} disabled={saving}
          aria-label="List my name in the founders credits"
          onChange={(e) => onChange(e.target.checked)} />
        List my name in the founders credits
      </label>
      <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, paddingLeft: 24 }}>
        Your public gallery name appears in the credits on the About page.
      </span>
    </div>
  );
}
