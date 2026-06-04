/**
 * emailTemplates.js — Tier 8.5 lifecycle email templates.
 *
 * Defines the six lifecycle email types as plain JS templates with
 * subject + plain-text body + minimal HTML body. The edge function
 * (supabase/functions/send-email) renders them through `renderTemplate`
 * below by name + payload.
 *
 * Voice: matches the simulation-first identity established in Tier
 * 7.12-7.13. Emails never say "AI-generated"; settlement work is
 * "simulated", narrative work is "refined". Tone is parchment-formal,
 * never enthusiastic-app-default.
 *
 * Templates here are also imported by the unit tests so renders are
 * verified without round-tripping through Supabase.
 *
 * Public surfaces of this module:
 *   - TEMPLATES — frozen map of key → { subject, text, html }
 *   - renderTemplate(key, payload) → { subject, text, html }
 *   - listTemplateKeys() — for the edge function's enum check
 *
 * Templates use `{var}` placeholders. The renderer substitutes from
 * the payload. Missing vars render as the literal `{var}` so a bug
 * is loud, not silent (same convention as copy/index.js).
 */

// ── Substitution helper ────────────────────────────────────────────────────
function interpolate(str, vars) {
  if (!vars || typeof str !== 'string') return str;
  return str.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
  );
}

// ── Template inventory ─────────────────────────────────────────────────────
export const TEMPLATES = Object.freeze({
  welcome: {
    subject: 'Welcome to SettlementForge',
    text: [
      'Hello {displayName},',
      '',
      'Your SettlementForge account is live. A few orientation notes:',
      '',
      '  • Every settlement is simulated from constraints. Not AI-generated.',
      '    Each town is the only coherent settlement that satisfies the',
      '    constraints you set — sliders, terrain, trade, stress.',
      '',
      '  • Your first three saves are free. After that, sign up for a',
      '    Cartographer subscription or claim a Founder Lifetime seat',
      '    (limited to the first 500 supporters).',
      '',
      '  • Narrative refinement (the optional prose layer) costs credits',
      '    per pass. Cartographer subscriptions include a monthly',
      '    allowance; credit packs top you up.',
      '',
      'Forge well.',
      '',
      '— SettlementForge',
      'https://settlementforge.com',
    ].join('\n'),
    html: null,  // text-only for v1; HTML can be added per template later
  },

  save_confirmation: {
    subject: 'Saved: {settlementName}',
    text: [
      'Hello {displayName},',
      '',
      'Your settlement {settlementName} ({tier}) has been saved to your',
      'campaign library. You can find it any time at:',
      '',
      '  https://settlementforge.com/settlements',
      '',
      'The save preserves the simulator state, your edits, and any',
      'narrative refinement passes you have run. Future regenerations',
      'will not overwrite locked entities.',
      '',
      '— SettlementForge',
    ].join('\n'),
    html: null,
  },

  export_confirmation: {
    subject: 'Dossier exported: {settlementName}',
    text: [
      'Hello {displayName},',
      '',
      'Your {settlementName} ({tier}) dossier export is ready.',
      '',
      'The PDF includes the simulator output, your saved canon, and any',
      'narrative refinement you have layered on. If anything looks off,',
      'you can re-export from the settlement detail view at any time.',
      '',
      '— SettlementForge',
    ].join('\n'),
    html: null,
  },

  credit_low: {
    subject: 'Narrative credits running low',
    text: [
      'Hello {displayName},',
      '',
      'Your narrative credit balance has dropped to {balance}. Each',
      'narrative refinement pass costs {narrativeCost} credits; each',
      'daily-life pass costs {dailyLifeCost}.',
      '',
      'Top up here:',
      '  https://settlementforge.com/pricing',
      '',
      'Reminder: settlements themselves never use credits — only the',
      'optional narrative refinement layer does. Your simulator output',
      'continues to work as normal.',
      '',
      '— SettlementForge',
    ].join('\n'),
    html: null,
  },

  founder_thank_you: {
    subject: 'Welcome, Founder',
    text: [
      'Hello {displayName},',
      '',
      'You are one of the first 500 supporters. Thank you.',
      '',
      'Your Founder Lifetime seat is permanent — Cartographer-tier',
      'access, unlimited saves, all current and future expansion packs.',
      'You also get the Founder badge on every dossier you publish.',
      '',
      'A direct line to the dev lives in Discord. The invite is on your',
      'account page.',
      '',
      'Forge well.',
      '',
      '— SettlementForge',
    ].join('\n'),
    html: null,
  },

  cap_warning: {
    subject: 'Anonymous generation cap reached',
    text: [
      'Hello,',
      '',
      'You have hit the daily cap for anonymous settlement generation',
      'on SettlementForge ({capUsed} of {capTotal} used). The cap',
      'resets at midnight UTC.',
      '',
      'Sign up for a free account to unlock:',
      '  • Up to Town size (Capital with a Cartographer subscription)',
      '  • Saved settlements (3 free)',
      '  • PDF export of any saved dossier',
      '',
      'Sign up: https://settlementforge.com/signin',
      '',
      '— SettlementForge',
    ].join('\n'),
    html: null,
  },
});

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Render a template by key with the supplied payload. Returns a
 * { subject, text, html } object ready to hand to the email provider.
 *
 * @param {keyof typeof TEMPLATES} key
 * @param {Object} [payload]  - variables for {placeholder} substitution
 * @returns {{ subject: string, text: string, html: string|null }}
 * @throws {Error} when the key is unknown.
 */
export function renderTemplate(key, payload = {}) {
  const tmpl = TEMPLATES[key];
  if (!tmpl) {
    throw new Error(`Unknown email template: ${key}`);
  }
  return {
    subject: interpolate(tmpl.subject, payload),
    text:    interpolate(tmpl.text,    payload),
    html:    tmpl.html ? interpolate(tmpl.html, payload) : null,
  };
}

/** Return the list of valid template keys (for edge function validation). */
export function listTemplateKeys() {
  return Object.keys(TEMPLATES);
}

/**
 * Sanity check: a payload satisfies a template if every {placeholder}
 * the template uses is present as a key in the payload. Useful for the
 * edge function to fail fast on bad inputs before calling the provider.
 *
 * @returns {string[]} — array of missing variable names; empty when ok.
 */
export function missingVariables(key, payload = {}) {
  const tmpl = TEMPLATES[key];
  if (!tmpl) return ['(unknown template)'];
  const seen = new Set();
  const seek = (str) => {
    if (typeof str !== 'string') return;
    const re = /\{(\w+)\}/g;
    let m;
    while ((m = re.exec(str)) !== null) seen.add(m[1]);
  };
  seek(tmpl.subject);
  seek(tmpl.text);
  if (tmpl.html) seek(tmpl.html);
  return Array.from(seen).filter(name =>
    !Object.prototype.hasOwnProperty.call(payload, name)
  );
}
